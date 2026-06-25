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
 * Emite beeps de áudio customizados usando a Web Audio API
 * Perfis:
 *   'timer_start'    → 2 bipes ascendentes (bing-BING) → "atenção, começa!"
 *   'countdown_tick' → tick curto a cada segundo (3-2-1)
 *   'timer_end'      → 3 bipes descendentes longos     → "PARE a coleta!"
 *   'success'        → bipe simples positivo
 *   'error'          → bipe grave de erro
 */
function playBeep(type = 'success') {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    /**
     * Cria um oscilador agendado num contexto já aberto
     * @param {number} freq     - frequência Hz
     * @param {number} startAt  - segundos (relativo a ctx.currentTime)
     * @param {number} duration - duração em segundos
     * @param {number} volume   - 0 a 1
     * @param {string} shape    - tipo de onda (sine, square, sawtooth, triangle)
     */
    function tone(freq, startAt, duration, volume = 0.18, shape = 'sine') {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = shape;
      osc.connect(gain);
      gain.connect(ctx.destination);

      const t0 = ctx.currentTime + startAt;
      osc.frequency.setValueAtTime(freq, t0);

      // Ataque suave (evita clique digital)
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(volume, t0 + 0.015);
      // Sustain + decay
      gain.gain.setValueAtTime(volume, t0 + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    }

    if (type === 'timer_start') {
      // ── "atenção-VAI!" ── dois bipes ascendentes ──
      tone(660,  0.00, 0.12, 0.16); // bing  (E5)
      tone(1047, 0.22, 0.20, 0.22); // BING  (C6) — sinal de largada

    } else if (type === 'countdown_tick') {
      // ── Tick dos últimos 3-2-1 segundos ──
      tone(1200, 0.00, 0.06, 0.14, 'square'); // curto e nítido

    } else if (type === 'timer_end') {
      // ── "PARE!" ── três bipes descendentes ──
      tone(880,  0.00, 0.22, 0.22); // beep 1  (A5)
      tone(880,  0.32, 0.22, 0.22); // beep 2  (A5)
      tone(523,  0.64, 0.55, 0.28); // beep 3 longo (C5) — sinal de fim

    } else if (type === 'success') {
      // ── Bipe positivo simples ──
      tone(880, 0.00, 0.14, 0.12);

    } else if (type === 'error') {
      // ── Bipe grave de erro ──
      tone(160, 0.00, 0.30, 0.16, 'sawtooth');
    }

  } catch (e) {
    console.warn('Web Audio API não disponível:', e);
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
