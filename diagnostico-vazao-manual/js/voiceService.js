/**
 * Assistente de Voz Inteligente — Spray Precision PRO
 * Web Speech API (síntese + reconhecimento) para operação Hands-Free em campo.
 *
 * BUGS CORRIGIDOS nesta versão:
 *  #1 — Chrome continuous timeout: onend auto-reinicia se userWantsListening=true
 *  #2 — Microfone pausado durante síntese de voz (evita auto-trigger)
 *  #3 — Flag userWantsListening separa intenção do usuário do estado real da API
 *  #4 — stopListening usa recognition.abort() (imediato) em vez de stop()
 *  #5 — processTranscript aceita variações sem acento e palavras sinônimas
 */

// ── Estado ──────────────────────────────────────────────────────────────────
let recognition      = null;
let isListening      = false;   // true = onstart confirmado
let userWantsListen  = false;   // intenção explícita do usuário
let restartTimer     = null;    // timeout de auto-restart
let speakingNow      = false;   // síntese em andamento (evita auto-trigger)

// ── Síntese de Voz ───────────────────────────────────────────────────────────
const synth = (typeof window !== 'undefined') ? window.speechSynthesis : null;

// ── Callbacks registrados pela interface ─────────────────────────────────────
let resultCallback  = null; // onResult(volumeMl, nozzleIndex|null)
let commandCallback = null; // onCommand('next'|'back'|'timer'|'clear'|'clogged'|'leaking'|'pause_timer')
let statusCallback  = null; // onStatus('escutando'|'inativo'|'reconectando'|'negado'|'indisponivel')

// ─────────────────────────────────────────────────────────────────────────────
// INICIALIZAÇÃO
// ─────────────────────────────────────────────────────────────────────────────
function initVoiceService() {
  if (typeof window === 'undefined') return { supported: false };

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('[VoiceService] Speech Recognition não suportado. Use Chrome, Edge ou Safari.');
    return { supported: false };
  }

  try {
    recognition = new SpeechRecognition();
    recognition.continuous      = true;
    recognition.interimResults  = false;
    recognition.maxAlternatives = 1;
    _applyLang();

    // ── onstart: API confirmou início da escuta ──
    recognition.onstart = () => {
      isListening = true;
      clearTimeout(restartTimer);
      console.log('[VoiceService] Reconhecimento iniciado.');
      if (statusCallback) statusCallback('escutando');
    };

    // ── onend: API encerrou (por qualquer motivo) ──
    // FIX #1 — Chrome tem timeout de silêncio que dispara onend sem erro.
    // Se o usuário QUER ouvir (userWantsListen=true), auto-reinicia.
    recognition.onend = () => {
      isListening = false;
      console.log('[VoiceService] onend — userWantsListen:', userWantsListen);

      if (userWantsListen) {
        if (statusCallback) statusCallback('reconectando');
        restartTimer = setTimeout(() => {
          if (userWantsListen && !isListening) {
            try {
              recognition.start();
            } catch (e) {
              console.warn('[VoiceService] Falha ao reiniciar:', e);
              userWantsListen = false;
              if (statusCallback) statusCallback('inativo');
            }
          }
        }, 400);
      } else {
        if (statusCallback) statusCallback('inativo');
      }
    };

    // ── onerror: erros da API ──
    recognition.onerror = (event) => {
      console.warn('[VoiceService] Erro:', event.error);

      // FIX #3 — só desabilita definitivamente se permissão negada
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        userWantsListen = false;
        clearTimeout(restartTimer);
        isListening = false;
        if (statusCallback) statusCallback('negado', event.error);
        return;
      }
      // Para 'no-speech', 'network', 'aborted', etc. → onend cuida do restart
    };

    // ── onresult: transcrição recebida ──
    recognition.onresult = (event) => {
      // FIX #2 — Ignora resultados capturados enquanto TTS está falando
      if (speakingNow) {
        console.log('[VoiceService] Resultado ignorado durante TTS.');
        return;
      }

      const idx        = event.resultIndex;
      const transcript = event.results[idx][0].transcript.trim().toLowerCase();
      console.log('[VoiceService] Fala detectada:', transcript);
      _processTranscript(transcript);
    };

    return { supported: true };
  } catch (e) {
    console.error('[VoiceService] Falha ao configurar:', e);
    return { supported: false };
  }
}

function _applyLang() {
  if (!recognition) return;
  const lang = (typeof localStorage !== 'undefined') ? (localStorage.getItem('spray_language') || 'pt') : 'pt';
  recognition.lang = lang === 'en' ? 'en-US' : (lang === 'es' ? 'es-419' : 'pt-BR');
}

// ─────────────────────────────────────────────────────────────────────────────
// API PÚBLICA
// ─────────────────────────────────────────────────────────────────────────────

/** Registra callbacks da interface */
function registerVoiceCallbacks({ onResult, onCommand, onStatus }) {
  if (onResult)  resultCallback  = onResult;
  if (onCommand) commandCallback = onCommand;
  if (onStatus)  statusCallback  = onStatus;
}

/** Ativa o microfone */
function startListening() {
  if (!recognition) {
    const check = initVoiceService();
    if (!check.supported) {
      if (statusCallback) statusCallback('indisponivel');
      return false;
    }
  }

  userWantsListen = true;
  _applyLang();

  if (isListening) return true; // já está ouvindo

  try {
    recognition.start();
    return true;
  } catch (e) {
    console.error('[VoiceService] Erro ao iniciar:', e);
    userWantsListen = false;
    return false;
  }
}

/** Desliga o microfone permanentemente (intenção do usuário) */
function stopListening() {
  userWantsListen = false;        // impede onend de reiniciar
  clearTimeout(restartTimer);
  isListening = false;

  if (recognition) {
    try { recognition.abort(); } catch (e) {} // FIX #4 — abort é imediato
  }
}

/** Retorna true se o microfone está ativamente escutando */
function isCurrentlyListening() {
  return isListening;
}

// ─────────────────────────────────────────────────────────────────────────────
// SÍNTESE DE VOZ
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fala um texto em português brasileiro.
 * FIX #2 — Pausa o reconhecimento durante a fala para evitar auto-trigger.
 */
function speak(text, interrupt = true) {
  if (!synth || !text) return;

  // Cancela fala anterior se solicitado
  if (interrupt) synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const lang      = (typeof localStorage !== 'undefined') ? (localStorage.getItem('spray_language') || 'pt') : 'pt';
  utterance.lang  = lang === 'en' ? 'en-US' : (lang === 'es' ? 'es-419' : 'pt-BR');
  utterance.rate  = 1.05;
  utterance.pitch = 1.0;

  // ── Pausa o microfone enquanto TTS fala ──
  const wasListening = isListening;
  if (wasListening && recognition) {
    speakingNow     = true;
    userWantsListen = false; // impede restart automático do onend durante TTS
    try { recognition.abort(); } catch(e) {}
  }

  utterance.onend = () => {
    speakingNow = false;
    // Reinicia microfone se estava ativo antes do TTS
    if (wasListening) {
      userWantsListen = true;
      setTimeout(() => {
        if (userWantsListen && !isListening) {
          try { recognition.start(); } catch(e) {}
        }
      }, 350);
    }
  };

  utterance.onerror = () => {
    speakingNow = false;
    if (wasListening) {
      userWantsListen = true;
      setTimeout(() => {
        if (userWantsListen && !isListening) {
          try { recognition.start(); } catch(e) {}
        }
      }, 350);
    }
  };

  synth.speak(utterance);
}

// ─────────────────────────────────────────────────────────────────────────────
// ÁUDIO — BEEPS (Web Audio API)
// ─────────────────────────────────────────────────────────────────────────────
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

    function tone(freq, startAt, duration, volume = 0.18, shape = 'sine') {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = shape;
      osc.connect(gain);
      gain.connect(ctx.destination);

      const t0 = ctx.currentTime + startAt;
      osc.frequency.setValueAtTime(freq, t0);

      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(volume, t0 + 0.015);
      gain.gain.setValueAtTime(volume, t0 + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    }

    if (type === 'timer_start') {
      tone(660,  0.00, 0.12, 0.16);
      tone(1047, 0.22, 0.20, 0.22);
    } else if (type === 'countdown_tick') {
      tone(1200, 0.00, 0.06, 0.14, 'square');
    } else if (type === 'timer_end') {
      tone(880,  0.00, 0.22, 0.22);
      tone(880,  0.32, 0.22, 0.22);
      tone(523,  0.64, 0.55, 0.28);
    } else if (type === 'success') {
      tone(880, 0.00, 0.14, 0.12);
    } else if (type === 'error') {
      tone(160, 0.00, 0.30, 0.16, 'sawtooth');
    }
  } catch (e) {
    console.warn('[VoiceService] Web Audio API indisponível:', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESSAMENTO DE TRANSCRIÇÃO
// FIX #5 — aceita variações sem acento, sinônimos e palavras por extenso PT-BR
// ─────────────────────────────────────────────────────────────────────────────

/** Remove acentos para comparação tolerante */
function _normalize(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function _processTranscript(text) {
  const n = _normalize(text); // versão sem acentos para matching

  // ── 1. Comandos de navegação ────────────────────────────────────────────
  if (_matchAny(n, ['proximo', 'salvar', 'avancar', 'confirmar', 'gravar'])) {
    if (commandCallback) commandCallback('next');
    return;
  }
  if (_matchAny(n, ['voltar', 'anterior', 'retornar'])) {
    if (commandCallback) commandCallback('back');
    return;
  }

  // ── 2. Cronômetro ───────────────────────────────────────────────────────
  if (_matchAny(n, ['iniciar', 'cronometro', 'cronometros', 'comecar', 'comeca', 'medir', 'mede', 'tempo', 'start'])) {
    if (commandCallback) commandCallback('timer');
    return;
  }
  if (_matchAny(n, ['parar', 'pausar', 'para', 'pausa', 'stop', 'finalizar', 'terminar', 'encerrar'])) {
    if (commandCallback) commandCallback('pause_timer');
    return;
  }

  // ── 3. Limpar ────────────────────────────────────────────────────────────
  if (_matchAny(n, ['repetir', 'limpar', 'zerar', 'apagar', 'deletar', 'errei'])) {
    if (commandCallback) commandCallback('clear');
    return;
  }

  // ── 4. Status dos bicos ──────────────────────────────────────────────────
  if (_matchAny(n, ['entupido', 'entupida', 'obstruido', 'obstruida', 'bloqueado', 'nao passa', 'sem fluxo'])) {
    if (commandCallback) commandCallback('clogged');
    return;
  }
  if (_matchAny(n, ['vazando', 'vazamento', 'gotejando', 'goteja', 'pingando'])) {
    if (commandCallback) commandCallback('leaking');
    return;
  }

  // ── 5. Extração de volume numérico (mL) ──────────────────────────────────
  const cleaned = n
    .replace(/mililitros?/g, '')
    .replace(/\bml\b/g, '')
    .replace(/litros?/g, '')
    .trim();

  // Tentar extrair dígitos diretos: "450", "450 ml", "bico 3 450"
  const digits = cleaned.match(/\d+/g);
  if (digits && digits.length > 0) {
    // Detectar "bico X valor Y"
    if (n.includes('bico') || n.includes('ponta') || n.includes('bocal')) {
      const bicoIdx = Math.max(n.indexOf('bico'), n.indexOf('ponta'), n.indexOf('bocal'));
      const afterBico = n.substring(bicoIdx);
      const subNums = afterBico.match(/\d+/g);
      if (subNums && subNums.length >= 2) {
        const nozzle = parseInt(subNums[0]);
        const vol    = parseInt(subNums[1]);
        if (resultCallback && vol > 0 && vol < 10000) {
          resultCallback(vol, nozzle);
          return;
        }
      }
    }

    const val = parseInt(digits[0]);
    if (resultCallback && val > 0 && val < 10000) {
      resultCallback(val, null);
      return;
    }
  }

  // Converter extenso PT-BR (unidades + centenas comuns no campo)
  const wordMap = {
    'zero': 0, 'um': 1, 'dois': 2, 'tres': 3, 'quatro': 4, 'cinco': 5,
    'seis': 6, 'sete': 7, 'oito': 8, 'nove': 9, 'dez': 10,
    'onze': 11, 'doze': 12, 'treze': 13, 'quatorze': 14, 'quinze': 15,
    'dezesseis': 16, 'dezessete': 17, 'dezoito': 18, 'dezenove': 19, 'vinte': 20,
    'trinta': 30, 'quarenta': 40, 'cinquenta': 50,
    'sessenta': 60, 'setenta': 70, 'oitenta': 80, 'noventa': 90,
    'cem': 100, 'cento': 100, 'duzentos': 200, 'trezentos': 300,
    'quatrocentos': 400, 'quinhentos': 500, 'seiscentos': 600,
    'setecentos': 700, 'oitocentos': 800, 'novecentos': 900,
    'mil': 1000
  };

  // Tentar somar palavras presentes no enunciado
  let total = 0;
  let found = false;
  const words = cleaned.split(/\s+/);
  for (const w of words) {
    if (wordMap[w] !== undefined) {
      total += wordMap[w];
      found = true;
    }
  }
  if (found && total > 0 && total < 10000) {
    if (resultCallback) resultCallback(total, null);
  }
}

/** Verifica se qualquer palavra da lista aparece no texto normalizado */
function _matchAny(normalizedText, keywords) {
  return keywords.some(kw => normalizedText.includes(kw));
}
