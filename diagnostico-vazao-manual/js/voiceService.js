/**
 * Assistente de Voz Inteligente da Spray Precision
 * Encapsula a Web Speech API para síntese (fala) e reconhecimento (escuta) de voz nativos do navegador.
 * Projetado para operações "Hands-Free" (mãos livres) no campo.
 */

// Reconhecimento de Voz (Speech to Text)
let recognition = null;
let isListening = false;

// Síntese de Voz (Text to Speech)
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

// Callbacks que serão acionados pelo serviço
let resultCallback = null; // Quando escuta um valor (ex: "450" ou "bico 5 500")
let commandCallback = null; // Quando escuta um comando (ex: "próximo", "voltar", "cronômetro")
let statusCallback = null; // Atualizações de status do microfone

/**
 * Inicializa o assistente de voz e verifica suporte nativo no navegador
 */
function initVoiceService() {
  if (typeof window === 'undefined') return { supported: false };

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn("Speech Recognition não é suportado neste navegador. Recomenda-se Chrome, Edge ou Safari.");
    return { supported: false };
  }

  try {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    const lang = localStorage.getItem('spray_language') || 'pt';
    recognition.lang = lang === 'en' ? 'en-US' : (lang === 'es' ? 'es-419' : 'pt-BR');

    recognition.onstart = () => {
      isListening = true;
      if (statusCallback) statusCallback('escutando');
    };

    recognition.onend = () => {
      isListening = false;
      if (statusCallback) statusCallback('inativo');
    };

    recognition.onerror = (event) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      if (statusCallback) statusCallback('erro', event.error);
      
      // Auto-restart em caso de perda de conexão no campo (mas não em caso de aborto explícito)
      if (isListening && event.error !== 'aborted') {
        setTimeout(() => {
          try { recognition.start(); } catch (e) {}
        }, 1000);
      }
    };

    recognition.onresult = (event) => {
      const resultIndex = event.resultIndex;
      const transcript = event.results[resultIndex][0].transcript.trim().toLowerCase();
      console.log("Fala detectada:", transcript);
      
      processTranscript(transcript);
    };

    return { supported: true };
  } catch (e) {
    console.error("Erro ao configurar reconhecimento de voz:", e);
    return { supported: false };
  }
}

/**
 * Registra callbacks de escuta para a interface
 */
function registerVoiceCallbacks({ onResult, onCommand, onStatus }) {
  if (onResult) resultCallback = onResult;
  if (onCommand) commandCallback = onCommand;
  if (onStatus) statusCallback = onStatus;
}

/**
 * Ativa o microfone e começa a escutar comandos
 */
function startListening() {
  if (!recognition) {
    const check = initVoiceService();
    if (!check.supported) return false;
  }
  
  try {
    recognition.start();
    isListening = true;
    return true;
  } catch (e) {
    console.error("Erro ao iniciar reconhecimento:", e);
    return false;
  }
}

/**
 * Desliga o microfone
 */
function stopListening() {
  if (!recognition) return;
  try {
    isListening = false;
    recognition.stop();
  } catch (e) {
    console.error("Erro ao parar reconhecimento:", e);
  }
}

/**
 * Retorna se o assistente está escutando no momento
 */
function isCurrentlyListening() {
  return isListening;
}

/**
 * Executa síntese de fala (fala um texto em português brasileiro)
 */
function speak(text, interrupt = true) {
  if (!synth) return;
  
  if (interrupt) {
    synth.cancel(); // Cancela falas anteriores em andamento
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  const lang = localStorage.getItem('spray_language') || 'pt';
  utterance.lang = lang === 'en' ? 'en-US' : (lang === 'es' ? 'es-419' : 'pt-BR');
  utterance.rate = 1.0; // Velocidade natural
  utterance.pitch = 1.0;
  
  synth.speak(utterance);
}

/**
 * Emite um beep de áudio customizado usando a Web Audio API (evita dependências de arquivos de áudio locais)
 */
function playBeep(type = 'success') {
  if (typeof window === 'undefined') return;
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Nota A5 (agudo rápido)
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'timer_end') {
      // Beep duplo longo (fim de tempo)
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // Nota C5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime); // Grave de erro
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.warn("Web Audio API não inicializada:", e);
  }
}

/**
 * Processa o texto transcrito pelo microfone e interpreta intenções
 */
function processTranscript(text) {
  // 1. Verificar comandos de navegação rápidos
  if (text.includes('próximo') || text.includes('salvar') || text.includes('avançar')) {
    if (commandCallback) commandCallback('next');
    return;
  }
  if (text.includes('voltar') || text.includes('anterior')) {
    if (commandCallback) commandCallback('back');
    return;
  }
  if (text.includes('iniciar') || text.includes('cronômetro') || text.includes('tempo') || text.includes('começar')) {
    if (commandCallback) commandCallback('timer');
    return;
  }
  if (text.includes('repetir') || text.includes('limpar') || text.includes('zerar')) {
    if (commandCallback) commandCallback('clear');
    return;
  }
  if (text.includes('entupido') || text.includes('obstruído')) {
    if (commandCallback) commandCallback('clogged');
    return;
  }
  if (text.includes('vazando') || text.includes('vazamento')) {
    if (commandCallback) commandCallback('leaking');
    return;
  }

  // 2. Extrair números para volumes de coleta (mL)
  // Expressões regulares para encontrar números (ex: "quatrocentos e cinquenta", "450 ml", "450")
  const textCleaned = text
    .replace(/ml/g, '')
    .replace(/militros/g, '')
    .replace(/l/g, '')
    .trim();
  
  // Tentar extrair números explícitos digitados
  const numbersFound = textCleaned.match(/\d+/g);
  
  if (numbersFound && numbersFound.length > 0) {
    const value = parseInt(numbersFound[0]);
    if (value > 0 && value < 10000) {
      
      // Checar se o usuário disse "bico X valor Y"
      // Ex: "bico cinco quatrocentos e cinquenta"
      if (text.includes('bico') || text.includes('pontas')) {
        const bicoWordIndex = text.indexOf('bico');
        const bicoText = text.substring(bicoWordIndex);
        const subNumbers = bicoText.match(/\d+/g);
        
        if (subNumbers && subNumbers.length >= 2) {
          const nozzleNum = parseInt(subNumbers[0]);
          const volMl = parseInt(subNumbers[1]);
          if (resultCallback) {
            resultCallback(volMl, nozzleNum);
            return;
          }
        }
      }
      
      // Caso contrário, apenas reporta o volume para o bico atual da interface
      if (resultCallback) {
        resultCallback(value, null); // null indica "bico atual"
      }
    }
  } else {
    // Tentar converter números por extenso básicos (zero a dez) em pt-BR se a API não traduzir para dígitos
    const numWords = {
      'zero': 0, 'um': 1, 'dois': 2, 'três': 3, 'quatro': 4, 'cinco': 5,
      'seis': 6, 'sete': 7, 'oito': 8, 'nove': 9, 'dez': 10
    };
    
    for (const [word, val] of Object.entries(numWords)) {
      if (textCleaned === word) {
        if (resultCallback) resultCallback(val, null);
        return;
      }
    }
  }
}
