/**
 * Assistente de Voz — Spray Precision PRO  v3.0
 * Web Speech API (síntese + reconhecimento) para operação Hands-Free em campo.
 *
 * ARQUITETURA ANTI-OFUSCAÇÃO:
 *   Funções internas podem ser renomeadas pelo obfuscator.
 *   API pública exposta via window.SprayVoiceService (propriedades de string
 *   NÃO são renomeadas pelo obfuscator).
 *
 * FIXES v3.0:
 *   - speak() SIMPLIFICADO: não toca no reconhecimento (evita race-condition)
 *   - localStorage com try/catch (fix Safari privado / iOS strict)
 *   - recognition.stop() no lugar de abort() (melhor compat iOS)
 *   - _applyLang segura contra SecurityError
 *   - Sem flag speakingNow (causava filtro falso de resultados)
 */

console.log('[Voice] voiceService v3.0 carregado');

// ── Estado ───────────────────────────────────────────────────────────────────
var _vsRecognition   = null;
var _vsListening     = false;   // confirmado via onstart
var _vsUserWants     = false;   // intenção explícita do usuário
var _vsRestartTimer  = null;

// ── Síntese ──────────────────────────────────────────────────────────────────
var _vsSynth = (typeof window !== 'undefined') ? window.speechSynthesis : null;

// ── Callbacks ────────────────────────────────────────────────────────────────
var _vsOnResult  = null;
var _vsOnCommand = null;
var _vsOnStatus  = null;

// ─────────────────────────────────────────────────────────────────────────────
// UTILIDADES INTERNAS
// ─────────────────────────────────────────────────────────────────────────────

function _vsGetLang() {
  try {
    return localStorage.getItem('spray_language') || 'pt';
  } catch (e) {
    return 'pt';
  }
}

function _vsLangCode(lang) {
  if (lang === 'en') return 'en-US';
  if (lang === 'es') return 'es-419';
  return 'pt-BR';
}

function _vsApplyLang() {
  if (!_vsRecognition) return;
  try {
    _vsRecognition.lang = _vsLangCode(_vsGetLang());
  } catch (e) {}
}

function _vsEmitStatus(status, extra) {
  if (_vsOnStatus) {
    try { _vsOnStatus(status, extra); } catch (e) {}
  }
}

function _vsScheduleRestart() {
  clearTimeout(_vsRestartTimer);
  _vsRestartTimer = setTimeout(function () {
    if (_vsUserWants && !_vsListening) {
      try {
        _vsRecognition.start();
      } catch (e) {
        console.warn('[Voice] restart falhou:', e.message || e);
        if (e.name === 'NotAllowedError') {
          _vsUserWants = false;
          _vsEmitStatus('negado', e.name);
        }
      }
    }
  }, 500);
}

// ─────────────────────────────────────────────────────────────────────────────
// INICIALIZAÇÃO
// ─────────────────────────────────────────────────────────────────────────────
function initVoiceService() {
  if (typeof window === 'undefined') return { supported: false };

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    console.warn('[Voice] SpeechRecognition NÃO disponível neste navegador.');
    return { supported: false };
  }

  // Permite re-chamada segura (idempotente)
  if (_vsRecognition) return { supported: true };

  try {
    _vsRecognition = new SR();
    _vsRecognition.continuous     = true;  // ignorado no iOS mas sem dano
    _vsRecognition.interimResults = false;

    try { _vsRecognition.maxAlternatives = 1; } catch (e) {}

    _vsApplyLang();
    console.log('[Voice] suporte detectado — lang:', _vsRecognition.lang);

    // ── onstart ──────────────────────────────────────────────────────────────
    _vsRecognition.onstart = function () {
      _vsListening = true;
      clearTimeout(_vsRestartTimer);
      console.log('[Voice] onstart — reconhecimento ativo');
      _vsEmitStatus('escutando');
    };

    // ── onend ────────────────────────────────────────────────────────────────
    // Chrome: dispara ~60s de silêncio; iOS: dispara após cada frase.
    // Se _vsUserWants, reagenda restart automático.
    _vsRecognition.onend = function () {
      _vsListening = false;
      console.log('[Voice] onend — userWants:', _vsUserWants);

      if (_vsUserWants) {
        _vsEmitStatus('reconectando');
        _vsScheduleRestart();
      } else {
        _vsEmitStatus('inativo');
      }
    };

    // ── onerror ──────────────────────────────────────────────────────────────
    _vsRecognition.onerror = function (evt) {
      console.warn('[Voice] onerror:', evt.error);

      // Permissão negada → para definitivamente
      if (evt.error === 'not-allowed' || evt.error === 'service-not-allowed') {
        _vsUserWants = false;
        clearTimeout(_vsRestartTimer);
        _vsListening = false;
        _vsEmitStatus('negado', evt.error);
        return;
      }
      // 'no-speech', 'network', 'aborted' → onend vai disparar e cuidar do restart
    };

    // ── onresult ─────────────────────────────────────────────────────────────
    _vsRecognition.onresult = function (evt) {
      var idx        = evt.resultIndex;
      var transcript = evt.results[idx][0].transcript.trim().toLowerCase();
      console.log('[Voice] fala detectada:', transcript);
      _vsProcessTranscript(transcript);
    };

    return { supported: true };

  } catch (e) {
    console.error('[Voice] Falha ao inicializar SpeechRecognition:', e);
    _vsRecognition = null;
    return { supported: false };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API PÚBLICA
// ─────────────────────────────────────────────────────────────────────────────

function registerVoiceCallbacks(opts) {
  if (opts.onResult)  _vsOnResult  = opts.onResult;
  if (opts.onCommand) _vsOnCommand = opts.onCommand;
  if (opts.onStatus)  _vsOnStatus  = opts.onStatus;
}

function startListening() {
  // Garante inicialização
  if (!_vsRecognition) {
    var c = initVoiceService();
    if (!c.supported) {
      _vsEmitStatus('indisponivel');
      return false;
    }
  }

  _vsUserWants = true;
  _vsApplyLang();

  if (_vsListening) return true; // já ativo

  try {
    _vsRecognition.start();
    return true;
  } catch (e) {
    console.error('[Voice] Erro ao iniciar:', e.message || e);
    if (e.name === 'NotAllowedError') {
      _vsUserWants = false;
      _vsEmitStatus('negado', e.name);
    } else {
      // Pode ser "already started" — tenta parar e reagendar
      try { _vsRecognition.stop(); } catch (e2) {}
      _vsScheduleRestart();
    }
    return false;
  }
}

function stopListening() {
  _vsUserWants = false;
  clearTimeout(_vsRestartTimer);
  _vsListening = false;

  if (_vsRecognition) {
    try { _vsRecognition.stop(); } catch (e) {}
  }
}

function isCurrentlyListening() {
  return _vsListening;
}

// ─────────────────────────────────────────────────────────────────────────────
// SÍNTESE DE VOZ
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Fala um texto. NÃO interfere com o reconhecimento (simplificado v3.0).
 * O microfone pode captar a voz sintética, mas processTranscript não reconhece
 * as frases de confirmação como comandos.
 */
function speak(text, interrupt) {
  if (interrupt === undefined) interrupt = true;
  if (!_vsSynth || !text) return;

  if (interrupt) _vsSynth.cancel();

  var utterance  = new SpeechSynthesisUtterance(text);
  utterance.lang  = _vsLangCode(_vsGetLang());
  utterance.rate  = 1.05;
  utterance.pitch = 1.0;

  _vsSynth.speak(utterance);
}

// ─────────────────────────────────────────────────────────────────────────────
// ÁUDIO — BEEPS
// ─────────────────────────────────────────────────────────────────────────────
function playBeep(type) {
  if (!type) type = 'success';
  if (typeof window === 'undefined') return;

  try {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    var ctx = new AudioCtx();

    // iOS Safari: AudioContext começa suspenso — resume() é necessário
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    function tone(freq, startAt, duration, volume, shape) {
      if (!volume) volume = 0.18;
      if (!shape)  shape  = 'sine';

      var osc  = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = shape;
      osc.connect(gain);
      gain.connect(ctx.destination);

      var t0 = ctx.currentTime + startAt;
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
    console.warn('[Voice] playBeep falhou:', e.message || e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESSAMENTO DE TRANSCRIÇÃO
// ─────────────────────────────────────────────────────────────────────────────

function _vsNormalize(str) {
  try {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    return str;
  }
}

function _vsMatchAny(n, keywords) {
  for (var i = 0; i < keywords.length; i++) {
    if (n.indexOf(keywords[i]) !== -1) return true;
  }
  return false;
}

function _vsProcessTranscript(text) {
  var n = _vsNormalize(text);

  // ── Comandos de navegação ──────────────────────────────────────────────────
  if (_vsMatchAny(n, ['proximo', 'salvar', 'avancar', 'confirmar', 'gravar'])) {
    if (_vsOnCommand) _vsOnCommand('next');
    return;
  }
  if (_vsMatchAny(n, ['voltar', 'anterior', 'retornar'])) {
    if (_vsOnCommand) _vsOnCommand('back');
    return;
  }

  // ── Cronômetro ────────────────────────────────────────────────────────────
  if (_vsMatchAny(n, ['iniciar', 'cronometro', 'comecar', 'comeca', 'medir', 'start'])) {
    if (_vsOnCommand) _vsOnCommand('timer');
    return;
  }
  if (_vsMatchAny(n, ['parar', 'pausar', 'para', 'pausa', 'stop', 'finalizar'])) {
    if (_vsOnCommand) _vsOnCommand('pause_timer');
    return;
  }

  // ── Limpar ────────────────────────────────────────────────────────────────
  if (_vsMatchAny(n, ['limpar', 'zerar', 'apagar', 'deletar', 'errei', 'repetir'])) {
    if (_vsOnCommand) _vsOnCommand('clear');
    return;
  }

  // ── Status dos bicos ──────────────────────────────────────────────────────
  if (_vsMatchAny(n, ['entupido', 'entupida', 'obstruido', 'bloqueado', 'sem fluxo'])) {
    if (_vsOnCommand) _vsOnCommand('clogged');
    return;
  }
  if (_vsMatchAny(n, ['vazando', 'vazamento', 'gotejando', 'pingando'])) {
    if (_vsOnCommand) _vsOnCommand('leaking');
    return;
  }

  // ── Volume numérico (mL) ──────────────────────────────────────────────────
  var cleaned = n
    .replace(/mililitros?/g, '')
    .replace(/\bml\b/g, '')
    .replace(/litros?/g, '')
    .trim();

  // "bico X valor Y"
  if (_vsMatchAny(n, ['bico', 'ponta', 'bocal'])) {
    var bicoIdx = -1;
    ['bico','ponta','bocal'].forEach(function(w) {
      var i = n.indexOf(w);
      if (i !== -1 && (bicoIdx === -1 || i < bicoIdx)) bicoIdx = i;
    });
    if (bicoIdx !== -1) {
      var subNums = n.substring(bicoIdx).match(/\d+/g);
      if (subNums && subNums.length >= 2) {
        var nozzle = parseInt(subNums[0], 10);
        var vol    = parseInt(subNums[1], 10);
        if (_vsOnResult && vol > 0 && vol < 10000) {
          console.log('[Voice] volume reconhecido:', vol, 'mL — bico:', nozzle);
          _vsOnResult(vol, nozzle);
          return;
        }
      }
    }
  }

  var digits = cleaned.match(/\d+/g);
  if (digits && digits.length > 0) {
    var val = parseInt(digits[0], 10);
    if (_vsOnResult && val > 0 && val < 10000) {
      console.log('[Voice] volume reconhecido:', val, 'mL');
      _vsOnResult(val, null);
      return;
    }
  }

  // Palavras por extenso PT-BR
  var wordMap = {
    'zero':0,'um':1,'dois':2,'tres':3,'quatro':4,'cinco':5,
    'seis':6,'sete':7,'oito':8,'nove':9,'dez':10,
    'onze':11,'doze':12,'treze':13,'quatorze':14,'quinze':15,
    'dezesseis':16,'dezessete':17,'dezoito':18,'dezenove':19,'vinte':20,
    'trinta':30,'quarenta':40,'cinquenta':50,'sessenta':60,
    'setenta':70,'oitenta':80,'noventa':90,
    'cem':100,'cento':100,'duzentos':200,'trezentos':300,
    'quatrocentos':400,'quinhentos':500,'seiscentos':600,
    'setecentos':700,'oitocentos':800,'novecentos':900,'mil':1000
  };
  var total = 0;
  var found = false;
  var words = cleaned.split(/\s+/);
  for (var j = 0; j < words.length; j++) {
    if (wordMap[words[j]] !== undefined) {
      total += wordMap[words[j]];
      found = true;
    }
  }
  if (found && total > 0 && total < 10000 && _vsOnResult) {
    console.log('[Voice] volume por extenso:', total, 'mL');
    _vsOnResult(total, null);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPOSIÇÃO PÚBLICA — Anti-ofuscação
// Propriedades de window são strings e NÃO são renomeadas pelo obfuscator.
// app.js deve usar window.SprayVoiceService.start() etc.
// ─────────────────────────────────────────────────────────────────────────────
window['SprayVoiceService'] = {
  init:              initVoiceService,
  registerCallbacks: registerVoiceCallbacks,
  start:             startListening,
  stop:              stopListening,
  isListening:       isCurrentlyListening,
  speak:             speak,
  playBeep:          playBeep
};

console.log('[Voice] window.SprayVoiceService pronto:', Object.keys(window['SprayVoiceService']));
