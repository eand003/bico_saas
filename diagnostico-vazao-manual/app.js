/**
 * Spray Precision PRO - Controlador Dinâmico da SPA
 * Gerencia a navegação, eventos de formulário, cronômetro, gráficos Chart.js,
 * assistente de voz e integração com o dbService.
 */

// Os módulos de suporte (calculations.js, dbService.js, supabaseClient.js, voiceService.js)
// são carregados no escopo global através de tags <script> individuais no index.html.

// ==========================================
// ESTADO GLOBAL DA APLICAÇÃO
// ==========================================
let currentInspectionId = null;
let activeNozzleIndex = 0; // 0-indexed
let totalNozzles = 60;
let measurements = []; // Array de FlowMeasurement
let activeTab = 'tab-identificacao';

// Gráficos
let reportChartInstance = null;

// Cronômetro
let timerInterval = null;
let timerTimeLeft = 30; // segundos
let timerDuration = 30;

function initApp() {
  setupNavigation();
  setupNozzleIsoCatalog();
  setupEventListeners();
  
  // Tentar restaurar rascunho anterior de calibração em andamento
  const restored = restoreActiveDraft();
  if (!restored) {
    initMeasurements();
  }
  
  setupVoiceAssistant();
  loadSavedCredentials();
  
  // Executar autenticação Supabase online
  checkAuthSession();
  
  // Registrar data atual na identificação
  const today = new Date().toLocaleDateString('pt-BR');
  document.getElementById('input-notas-identificacao').placeholder = `Inspeção realizada em ${today}...`;
  
  // Iniciar escuta para auto-save de rascunhos em tempo real
  setupDraftAutoSave();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ==========================================
// SISTEMA DE AUTENTICAÇÃO UNIFICADA (NUVEM SAAS)
// ==========================================
function checkOfflinePreAuthorization() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('spray_offline_authorized') === 'true';
    }
  } catch (e) {
    console.warn("Erro ao ler autorização offline do localStorage:", e);
  }
  return false;
}

function setOfflinePreAuthorization(status) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (status) {
        window.localStorage.setItem('spray_offline_authorized', 'true');
      } else {
        window.localStorage.removeItem('spray_offline_authorized');
      }
    }
  } catch (e) {
    console.warn("Erro ao gravar autorização offline no localStorage:", e);
  }
}

async function checkAuthSession() {
  const supabase = window.supabaseClient;
  const isPreAuthorized = checkOfflinePreAuthorization();
  
  if (!supabase) {
    console.warn("Cliente Supabase não detectado. Verificando contingência offline.");
    if (isPreAuthorized) {
      handleOfflineBypass();
    } else {
      showLoginScreen({ noNetwork: true });
    }
    return;
  }
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      handleUserLoggedIn(session.user);
    } else {
      showLoginScreen();
    }
  } catch (e) {
    console.error("Erro ao verificar sessão do usuário:", e);
    if (isPreAuthorized) {
      handleOfflineBypass();
    } else {
      showLoginScreen({ noNetwork: true });
    }
  }
}

function showLoginScreen(options = {}) {
  document.getElementById('app-login-screen').style.display = 'flex';
  document.querySelector('.app-container').style.display = 'none';
  
  const isPreAuthorized = checkOfflinePreAuthorization();
  const skipBtn = document.getElementById('btn-login-skip');
  const blockedMsg = document.getElementById('login-offline-blocked-msg');
  
  if (options.noNetwork) {
    if (isPreAuthorized) {
      skipBtn.style.display = 'block';
      blockedMsg.style.display = 'none';
      document.getElementById('login-email').disabled = false;
      document.getElementById('login-password').disabled = false;
      document.getElementById('btn-login-submit').disabled = false;
      document.getElementById('btn-login-submit').textContent = "🔐 Entrar no Sistema";
    } else {
      skipBtn.style.display = 'none';
      blockedMsg.style.display = 'block';
      document.getElementById('login-email').disabled = true;
      document.getElementById('login-password').disabled = true;
      document.getElementById('btn-login-submit').disabled = true;
      document.getElementById('btn-login-submit').textContent = "❌ Sem Conexão de Rede";
    }
  } else {
    document.getElementById('login-email').disabled = false;
    document.getElementById('login-password').disabled = false;
    document.getElementById('btn-login-submit').disabled = false;
    document.getElementById('btn-login-submit').textContent = "🔐 Entrar no Sistema";
    blockedMsg.style.display = 'none';
    
    if (isPreAuthorized) {
      skipBtn.style.display = 'block';
    } else {
      skipBtn.style.display = 'none';
    }
  }
}

function showAppContainer() {
  document.getElementById('app-login-screen').style.display = 'none';
  document.querySelector('.app-container').style.display = 'flex';
}

function handleOfflineBypass() {
  showAppContainer();
  
  // Alternar visibilidade dos badges no cabeçalho
  const badgeOnline = document.getElementById('user-profile-badge');
  const badgeOffline = document.getElementById('offline-profile-badge');
  if (badgeOnline) badgeOnline.style.display = 'none';
  if (badgeOffline) badgeOffline.style.display = 'flex';
  
  // Carregar histórico local
  renderHistoryList();
}

function handleUserLoggedIn(user) {
  // Salvar pré-autorização offline bem sucedida no dispositivo
  setOfflinePreAuthorization(true);
  
  showAppContainer();
  
  // Alternar visibilidade dos badges no cabeçalho
  const badgeOnline = document.getElementById('user-profile-badge');
  const badgeOffline = document.getElementById('offline-profile-badge');
  if (badgeOnline) {
    badgeOnline.style.display = 'flex';
    document.getElementById('logged-user-email').textContent = user.email.toUpperCase();
  }
  if (badgeOffline) badgeOffline.style.display = 'none';
  
  // Auto-preencher o Inspetor Técnico se estiver em branco
  const responsavel = document.getElementById('input-responsavel');
  if (responsavel && !responsavel.value) {
    // Extrai o nome de exibição do e-mail
    responsavel.value = user.email.split('@')[0].toUpperCase();
  }
  
  // Carregar histórico de inspeções sincronizadas da nuvem
  renderHistoryList();
}

async function handleUserLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const submitBtn = document.getElementById('btn-login-submit');
  const supabase = window.supabaseClient;
  
  if (!supabase) {
    alert("Erro: O conector Supabase não foi carregado. Verifique sua conexão de rede.");
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = "⌛ Entrando no Sistema...";
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) throw error;
    
    playBeep('success');
    speak("Login efetuado com sucesso.");
    handleUserLoggedIn(data.user);
  } catch (err) {
    playBeep('error');
    console.error("Erro de login:", err);
    alert("Falha ao entrar: " + (err.message || "E-mail ou senha incorretos."));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "🔐 Entrar no Sistema";
  }
}

async function handleUserLogout() {
  if (!confirm("Tem certeza que deseja sair do aplicativo? Suas credenciais de sincronização serão limpas.")) {
    return;
  }
  
  const supabase = window.supabaseClient;
  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
    
    // Limpar exibição de perfil
    const badge = document.getElementById('user-profile-badge');
    if (badge) badge.style.display = 'none';
    
    // Limpar formulário de login
    document.getElementById('login-password').value = '';
    
    playBeep('success');
    speak("Sessão encerrada.");
    showLoginScreen();
  } catch (err) {
    console.error("Erro ao efetuar logout:", err);
    alert("Erro ao desconectar: " + err.message);
  }
}

// ==========================================
// 1. SISTEMA DE NAVEGAÇÃO & ABAS (SPA)
// ==========================================
function setupNavigation() {
  const tabs = document.querySelectorAll('.step-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  if (tabId === activeTab) return;
  
  // Validações básicas antes de avançar
  if (activeTab === 'tab-identificacao' && (tabId === 'tab-pulverizador' || tabId === 'tab-pontas' || tabId === 'tab-coleta' || tabId === 'tab-relatorio')) {
    if (!validateTabIdentificacao()) return;
  }
  if (activeTab === 'tab-pulverizador' && (tabId === 'tab-pontas' || tabId === 'tab-coleta' || tabId === 'tab-relatorio')) {
    if (!validateTabPulverizador()) return;
  }

  // Atualizar visual do Stepper
  const tabs = document.querySelectorAll('.step-tab');
  tabs.forEach(t => {
    if (t.getAttribute('data-target') === tabId) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  // Trocar visualização de telas
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
  
  // Callback ao carregar abas específicas
  if (tabId === 'tab-coleta') {
    renderBoomVisualizer('boom-track-visual');
    updateGuidedNozzleFocus();
    rebuildBulkGrid();
  } else if (tabId === 'tab-relatorio') {
    generateReportAndRender();
  }

  activeTab = tabId;
  saveActiveDraft();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateTabIdentificacao() {
  const cliente = document.getElementById('input-cliente').value.trim();
  const cidade = document.getElementById('input-cidade').value.trim();
  const responsavel = document.getElementById('input-responsavel').value.trim();
  
  if (!cliente || !cidade || !responsavel) {
    alert("Por favor, preencha os campos obrigatórios (*): Cliente, Cidade e Responsável Técnico.");
    return false;
  }
  return true;
}

function validateTabPulverizador() {
  const largura = parseFloat(document.getElementById('input-largura-barra').value);
  const bicos = parseInt(document.getElementById('input-total-bicos').value);
  const espacamento = parseFloat(document.getElementById('input-espacamento').value);
  const pressao = parseFloat(document.getElementById('input-pressao').value);
  const velocidade = parseFloat(document.getElementById('input-velocidade').value);
  const volume = parseFloat(document.getElementById('input-volume-alvo').value);

  if (isNaN(largura) || isNaN(bicos) || isNaN(espacamento) || isNaN(pressao) || isNaN(velocidade) || isNaN(volume)) {
    alert("Por favor, preencha todos os parâmetros numéricos obrigatórios do pulverizador.");
    return false;
  }

  // Se o número de bicos mudou, reinicializar medições
  if (bicos !== totalNozzles) {
    totalNozzles = bicos;
    initMeasurements();
  }

  return true;
}

// ==========================================
// 2. CATÁLOGO ISO & AUTOPREENCHIMENTO
// ==========================================
function setupNozzleIsoCatalog() {
  const select = document.getElementById('select-iso-nozzle');
  
  // Limpar e preencher
  select.innerHTML = '<option value="">Use entrada manual de vazão nominal...</option>';
  ISO_NOZZLES.forEach(nz => {
    const opt = document.createElement('option');
    opt.value = nz.code;
    opt.textContent = nz.label;
    select.appendChild(opt);
  });

  // Evento ao alterar bico ISO ou alterar pressão de trabalho
  select.addEventListener('change', autoCalculateNominalFlow);
  document.getElementById('input-pressao').addEventListener('input', autoCalculateNominalFlow);
  document.getElementById('select-unidade-pressao').addEventListener('change', autoCalculateNominalFlow);
}

function autoCalculateNominalFlow() {
  const select = document.getElementById('select-iso-nozzle');
  const code = select.value;
  if (!code) return; // Entrada manual ativa

  const selectedNozzle = ISO_NOZZLES.find(n => n.code === code);
  if (!selectedNozzle) return;

  const pressure = parseFloat(document.getElementById('input-pressao').value) || 3.0;
  const unit = document.getElementById('select-unidade-pressao').value;

  // Obter vazão nominal esperada a essa pressão
  const expectedNominalFlow = calculateExpectedFlowByISO(selectedNozzle.flow3bar, pressure, unit);
  
  // Injetar no input de vazão nominal da ponta
  document.getElementById('input-vazao-nominal').value = expectedNominalFlow.toFixed(2);
}

// Presets de atalhos
window.setSpacingValue = function(val) {
  document.getElementById('input-espacamento').value = val;
  const btns = document.querySelectorAll('#tab-pulverizador .timer-preset-btn');
  btns.forEach(b => {
    const bSpacing = parseFloat(b.getAttribute('data-spacing'));
    b.classList.toggle('active', bSpacing === val);
  });
};

window.setToleranceValue = function(val) {
  document.getElementById('input-tolerancia').value = val;
  const btns = document.querySelectorAll('#tab-pontas .timer-preset-btn');
  btns.forEach(b => {
    const bTolerance = parseFloat(b.getAttribute('data-tolerance'));
    b.classList.toggle('active', bTolerance === val);
  });
};

window.setCollectionTime = function(val) {
  document.getElementById('input-tempo-coleta').value = val;
  timerDuration = val;
  resetChronometer();
  const btns = document.querySelectorAll('#tab-coleta .timer-preset-btn');
  btns.forEach(b => {
    const bTime = parseInt(b.getAttribute('data-time'));
    b.classList.toggle('active', bTime === val);
  });
};

// ==========================================
// 3. ESTRUTURA DOS DADOS (MEDICOES)
// ==========================================
function initMeasurements() {
  measurements = [];
  for (let i = 1; i <= totalNozzles; i++) {
    measurements.push({
      nozzle_number: i,
      section_number: Math.ceil(i / (totalNozzles / 4 || 1)), // Sugere 4 seções
      boom_side: i <= totalNozzles / 2 ? 'esquerdo' : 'direito',
      collected_volume_ml: 0,
      collection_time_seconds: 30,
      measured_flow_l_min: 0,
      expected_flow_l_min: 1.20,
      deviation_percent: 0,
      actual_rate_l_ha: 0,
      status: 'nao_avaliado',
      recommendation: '',
      notes: ''
    });
  }
}

// ==========================================
// 4. MAPA VISUAL DA BARRA (BOOM VISUALIZER)
// ==========================================
function renderBoomVisualizer(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  measurements.forEach((m, idx) => {
    const node = document.createElement('div');
    node.className = `boom-nozzle-node status-${m.status}`;
    node.textContent = String(m.nozzle_number).padStart(2, '0');
    node.setAttribute('data-index', idx);
    
    if (containerId === 'boom-track-visual') {
      if (idx === activeNozzleIndex) {
        node.classList.add('active-editing');
      }
      
      // Clique no bico muda o foco no Modo Guided
      node.addEventListener('click', () => {
        activeNozzleIndex = idx;
        updateGuidedNozzleFocus();
      });
    }
    
    container.appendChild(node);
  });
}

function updateGuidedNozzleFocus() {
  // Ajustar nós ativos na barra visual
  const nodes = document.querySelectorAll('#boom-track-visual .boom-nozzle-node');
  nodes.forEach((n, idx) => {
    if (idx === activeNozzleIndex) {
      n.classList.add('active-editing');
      // Scroll automático para manter o bico focado centralizado
      n.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      n.classList.remove('active-editing');
    }
  });

  // Atualizar card focado
  const currentNozzle = measurements[activeNozzleIndex];
  document.getElementById('focus-nozzle-num').textContent = String(currentNozzle.nozzle_number).padStart(2, '0');
  
  // Limpar e preencher input (com desativação do autofocus em mobile para evitar saltos de teclado)
  const inputVol = document.getElementById('input-volume-ml');
  inputVol.value = currentNozzle.collected_volume_ml > 0 ? currentNozzle.collected_volume_ml : '';
  
  const isMobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (!isMobile) {
    inputVol.focus();
  }

  // Resetar cronômetro se tempo mudou
  const expectedDuration = parseInt(document.getElementById('input-tempo-coleta').value) || 30;
  if (timerDuration !== expectedDuration) {
    timerDuration = expectedDuration;
    resetChronometer();
  }

  // Progresso
  updateProgressVisuals();
  
  // Feedback dinâmico
  updateRealtimeNozzleFeedback();
}

function updateProgressVisuals() {
  const evaluatedCount = measurements.filter(m => m.status !== 'nao_avaliado' && m.collected_volume_ml > 0).length;
  const percent = Math.round((evaluatedCount / totalNozzles) * 100);
  
  document.getElementById('guided-progress-fill').style.width = `${percent}%`;
  document.getElementById('guided-progress-label').textContent = `Bico ${activeNozzleIndex + 1} de ${totalNozzles} (Coletado ${evaluatedCount} de ${totalNozzles} bicos - ${percent}% concluído)`;
}

// Feedback dinâmico enquanto o usuário digita
function updateRealtimeNozzleFeedback() {
  const inputVolVal = parseFloat(document.getElementById('input-volume-ml').value);
  const feedbackDiv = document.getElementById('realtime-nozzle-feedback');
  
  if (isNaN(inputVolVal) || inputVolVal <= 0) {
    feedbackDiv.style.display = 'none';
    return;
  }

  const duration = parseInt(document.getElementById('input-tempo-coleta').value) || 30;
  const expectedFlow = parseFloat(document.getElementById('input-vazao-nominal').value) || 1.2;
  const tolerance = parseFloat(document.getElementById('input-tolerancia').value) || 10;
  
  // Medidas reais baseadas no volume digitado
  const measuredFlow = calculateMeasuredFlowLMin(inputVolVal, duration);
  const deviation = calculateDeviationPercent(measuredFlow, expectedFlow);
  const status = classifyNozzle(deviation, tolerance);
  const rec = getNozzleRecommendation(status, activeNozzleIndex + 1);

  let statusClass = 'status-ok';
  let statusText = 'OK - Dentro da tolerância';
  
  if (status === 'abaixo' || status === 'critico_abaixo') {
    statusClass = status === 'abaixo' ? 'status-abaixo' : 'status-critico_abaixo';
    statusText = status === 'abaixo' ? 'Atenção - Abaixo da vazão' : 'Crítico - Vazão muito baixa!';
  } else if (status === 'acima' || status === 'critico_acima') {
    statusClass = status === 'acima' ? 'status-acima' : 'status-critico_acima';
    statusText = status === 'acima' ? 'Atenção - Desgaste leve' : 'Crítico - Desgaste muito alto!';
  }

  feedbackDiv.style.display = 'block';
  feedbackDiv.className = ``;
  feedbackDiv.style.backgroundColor = `var(--${statusClass === 'status-ok' ? 'accent-green-bg' : (statusClass.includes('critico') ? 'accent-error-bg' : 'accent-warning-bg')})`;
  feedbackDiv.style.border = `1px solid var(--${statusClass === 'status-ok' ? 'accent-green-border' : (statusClass.includes('critico') ? 'accent-error-border' : 'accent-warning-border')})`;
  
  feedbackDiv.innerHTML = `
    <div style="font-weight:bold; color:var(--text-main); margin-bottom:4px; font-family:'Outfit';">Bico ${activeNozzleIndex + 1}: ${statusText}</div>
    <div style="font-size:12px; color:var(--text-muted); line-height:1.4;">
      Vazão: **${measuredFlow.toFixed(2)} L/min** (Esperado: ${expectedFlow.toFixed(2)} L/min)<br>
      Desvio Hidráulico: <strong style="color:var(--text-main);">${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}%</strong><br>
      *Ação:* ${rec.action}
    </div>
  `;
}

// ==========================================
// 5. CRONÔMETRO DE COLETA (STOPWATCH)
// ==========================================
function startChronometer() {
  if (timerInterval) return; // Já está rodando

  timerTimeLeft = timerDuration;
  document.getElementById('chronometer-display').textContent = formatTimerTime(timerTimeLeft);
  document.getElementById('btn-timer-start').textContent = '⏸️ Pausar';
  playBeep('success');

  timerInterval = setInterval(() => {
    timerTimeLeft -= 0.1;
    if (timerTimeLeft <= 0) {
      timerTimeLeft = 0;
      clearInterval(timerInterval);
      timerInterval = null;
      document.getElementById('btn-timer-start').textContent = '▶️ Iniciar';
      
      // Ações ao concluir o cronômetro
      playBeep('timer_end');
      speak(`Tempo esgotado para o bico ${activeNozzleIndex + 1}. Registre o volume.`);
      
      // Tentar focar no input de volume automaticamente (desativado em mobile)
      const isMobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      if (!isMobile) {
        document.getElementById('input-volume-ml').focus();
      }
    }
    document.getElementById('chronometer-display').textContent = formatTimerTime(timerTimeLeft);
  }, 100);
}

function pauseChronometer() {
  if (!timerInterval) return;
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById('btn-timer-start').textContent = '▶️ Retomar';
}

function resetChronometer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerTimeLeft = timerDuration;
  document.getElementById('chronometer-display').textContent = formatTimerTime(timerTimeLeft);
  document.getElementById('btn-timer-start').textContent = '▶️ Iniciar';
}

function formatTimerTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const deciseconds = Math.floor((sec % 1) * 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${deciseconds}`;
}

// ==========================================
// 6. MODO COLETA EM MASSA (SPREADSHEET MODE)
// ==========================================
window.switchCollectionMode = function(mode) {
  const btnGuided = document.getElementById('btn-mode-guided');
  const btnBulk = document.getElementById('btn-mode-bulk');
  const divGuided = document.getElementById('coleta-mode-guided');
  const divBulk = document.getElementById('coleta-mode-bulk');

  if (mode === 'guided') {
    btnGuided.classList.add('active');
    btnBulk.classList.remove('active');
    divGuided.style.display = 'block';
    divBulk.style.display = 'none';
    updateGuidedNozzleFocus();
  } else {
    btnGuided.classList.remove('active');
    btnBulk.classList.add('active');
    divGuided.style.display = 'none';
    divBulk.style.display = 'block';
    rebuildBulkGrid();
  }
};

function rebuildBulkGrid() {
  const tbody = document.getElementById('bulk-grid-tbody');
  tbody.innerHTML = '';

  const duration = parseInt(document.getElementById('input-tempo-coleta').value) || 30;
  const expectedFlow = parseFloat(document.getElementById('input-vazao-nominal').value) || 1.2;
  const tolerance = parseFloat(document.getElementById('input-tolerancia').value) || 10;

  measurements.forEach((m, idx) => {
    const tr = document.createElement('tr');
    tr.id = `bulk-row-${idx}`;
    if (m.status === 'ok') tr.style.backgroundColor = 'rgba(16, 185, 129, 0.04)';
    
    tr.innerHTML = `
      <td style="padding:8px; font-weight:bold; font-family:'Outfit';">${String(m.nozzle_number).padStart(2, '0')}</td>
      <td style="padding:4px;">
        <input type="number" value="${m.collected_volume_ml > 0 ? m.collected_volume_ml : ''}" 
               placeholder="Digitar volume" 
               class="input-field" 
               style="max-width:140px; padding:6px 10px; font-size:14px;"
               data-index="${idx}">
      </td>
      <td style="padding:8px;" id="bulk-flow-${idx}">${m.measured_flow_l_min > 0 ? m.measured_flow_l_min.toFixed(2) + ' L/min' : '--'}</td>
      <td style="padding:8px; font-weight:bold;" id="bulk-dev-${idx}">${m.deviation_percent !== 0 ? (m.deviation_percent > 0 ? '+' : '') + m.deviation_percent.toFixed(1) + '%' : '--'}</td>
      <td style="padding:8px;" id="bulk-status-${idx}">
        <span class="badge status-${m.status}">${m.status.replace('_', ' ')}</span>
      </td>
    `;

    // Evento de atualização dinâmica ao digitar na planilha
    const input = tr.querySelector('input');
    input.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value) || 0;
      updateNozzleData(idx, vol, duration, expectedFlow, tolerance);
      
      // Atualizar estatísticas locais na linha
      const updated = measurements[idx];
      document.getElementById(`bulk-flow-${idx}`).textContent = updated.measured_flow_l_min > 0 ? updated.measured_flow_l_min.toFixed(2) + ' L/min' : '--';
      document.getElementById(`bulk-dev-${idx}`).textContent = updated.deviation_percent !== 0 ? (updated.deviation_percent > 0 ? '+' : '') + updated.deviation_percent.toFixed(1) + '%' : '--';
      
      const badgeSpan = document.getElementById(`bulk-status-${idx}`).querySelector('span');
      badgeSpan.className = `badge status-${updated.status}`;
      badgeSpan.textContent = updated.status.replace('_', ' ');
      
      tr.style.backgroundColor = updated.status === 'ok' ? 'rgba(16, 185, 129, 0.04)' : '';
      
      // Atualizar também o mini visualizador da barra
      renderBoomVisualizer('boom-track-visual');
    });

    tbody.appendChild(tr);
  });
}

function updateNozzleData(index, volumeMl, duration, expectedFlow, tolerance) {
  const m = measurements[index];
  m.collected_volume_ml = volumeMl;
  m.collection_time_seconds = duration;
  
  if (volumeMl > 0) {
    m.measured_flow_l_min = calculateMeasuredFlowLMin(volumeMl, duration);
    m.deviation_percent = calculateDeviationPercent(m.measured_flow_l_min, expectedFlow);
    m.status = classifyNozzle(m.deviation_percent, tolerance);
    
    const speed = parseFloat(document.getElementById('input-velocidade').value) || 16;
    const spacing = parseFloat(document.getElementById('input-espacamento').value) || 0.5;
    m.actual_rate_l_ha = calculateActualRateLHa(m.measured_flow_l_min, speed, spacing);
    
    const rec = getNozzleRecommendation(m.status, index + 1);
    m.recommendation = rec.action;
    m.notes = rec.diagnostic;
  } else {
    // Preservar marcadores manuais críticos (Entupimento ou Vazamento) que possuem volume zero
    if (m.status === 'critico_abaixo') {
      m.measured_flow_l_min = 0;
      m.deviation_percent = -100;
      m.actual_rate_l_ha = 0;
      const rec = getNozzleRecommendation('critico_abaixo', index + 1);
      m.recommendation = rec.action;
      m.notes = rec.diagnostic;
    } else if (m.status === 'critico_acima') {
      m.measured_flow_l_min = 0;
      m.deviation_percent = 100;
      m.actual_rate_l_ha = 0;
      const rec = getNozzleRecommendation('critico_acima', index + 1);
      m.recommendation = rec.action;
      m.notes = rec.diagnostic;
    } else {
      m.measured_flow_l_min = 0;
      m.deviation_percent = 0;
      m.actual_rate_l_ha = 0;
      m.status = 'nao_avaliado';
      m.recommendation = '';
      m.notes = '';
    }
  }
  saveActiveDraft();
}

// ==========================================
// 7. GERAÇÃO DE RELATÓRIO TÉCNICO (ETAPA 5)
// ==========================================
function generateReportAndRender() {
  const cliente = document.getElementById('input-cliente').value;
  const fazenda = document.getElementById('input-fazenda').value || 'Não informada';
  const local = `${document.getElementById('input-cidade').value} - ${document.getElementById('input-estado').value}`;
  const data = new Date().toLocaleDateString('pt-BR');
  const maquina = `${document.getElementById('input-marca').value || 'Pulverizador'} ${document.getElementById('input-modelo').value || ''}`.trim();
  const barra = `${document.getElementById('input-largura-barra').value} metros (${totalNozzles} bicos)`;
  const ponta = `${document.getElementById('select-ponta-tipo').value.replace('_', ' ')} ${document.getElementById('input-ponta-modelo').value || ''}`.trim();
  const inspetor = document.getElementById('input-responsavel').value;

  // Atualizar Metadados no Relatório
  document.getElementById('rep-cliente').textContent = cliente;
  document.getElementById('rep-fazenda').textContent = fazenda;
  document.getElementById('rep-local').textContent = local;
  document.getElementById('rep-data').textContent = data;
  document.getElementById('rep-maquina').textContent = maquina;
  document.getElementById('rep-barra').textContent = barra;
  document.getElementById('rep-ponta').textContent = ponta;
  document.getElementById('rep-inspetor').textContent = inspetor;
  document.getElementById('rep-sig-inspetor').textContent = inspetor;

  // Parâmetros Hydraulics
  const expectedFlow = parseFloat(document.getElementById('input-vazao-nominal').value) || 1.2;
  const speed = parseFloat(document.getElementById('input-velocidade').value) || 16;
  const spacing = parseFloat(document.getElementById('input-espacamento').value) || 0.5;
  const tolerance = parseFloat(document.getElementById('input-tolerancia').value) || 10;
  
  document.getElementById('rep-tolerancia-num').textContent = tolerance;

  // Gerar Estatísticas
  const summary = calculateBarSummary(measurements, expectedFlow, speed, spacing, tolerance, totalNozzles);

  // Cards Principais
  document.getElementById('rep-card-avaliados').textContent = `${summary.evaluatedNozzles} / ${summary.totalNozzles}`;
  document.getElementById('rep-card-cv').textContent = `${summary.coefficientOfVariationPercent.toFixed(1)}%`;
  
  const veredito = document.getElementById('rep-card-veredito');
  veredito.textContent = summary.generalClassification.toUpperCase().replace(/_/g, ' ');
  if (summary.generalClassification === 'aprovado') {
    veredito.style.color = 'var(--accent-green)';
  } else if (summary.generalClassification === 'aprovado_com_ressalvas') {
    veredito.style.color = 'var(--accent-warning)';
  } else {
    veredito.style.color = 'var(--accent-error)';
  }

  document.getElementById('rep-card-vazao-esperada').textContent = `${expectedFlow.toFixed(2)} L/min`;
  document.getElementById('rep-card-vazao').textContent = `${summary.averageFlowLMin.toFixed(2)} L/min`;
  
  const targetRateVal = parseFloat(document.getElementById('input-volume-alvo').value) || 100;
  document.getElementById('rep-card-taxa-esperada').textContent = `${targetRateVal.toFixed(0)} L/ha`;
  document.getElementById('rep-card-taxa').textContent = `${summary.averageActualRateLHa.toFixed(1)} L/ha`;

  // Preencher quantidades detalhadas por status de bicos
  document.getElementById('rep-card-ok').textContent = summary.okCount;
  document.getElementById('rep-card-status-abaixo').textContent = summary.belowCount;
  document.getElementById('rep-card-status-acima').textContent = summary.aboveCount;
  document.getElementById('rep-card-status-criticas').textContent = summary.criticalBelowCount + summary.criticalAboveCount;

  // Texto Conclusivo da Barra Inteligente
  let textoConclusao = "";
  const totalOffTarget = summary.totalNozzles - summary.okCount;
  const criticalCount = summary.criticalBelowCount + summary.criticalAboveCount;
  const cvVal = summary.coefficientOfVariationPercent;

  if (summary.generalClassification === 'aprovado') {
    textoConclusao = `✔️ **Equipamento APROVADO!** A barra de pulverização apresenta um Coeficiente de Variação excelente de **${cvVal.toFixed(1)}%** (dentro do limite recomendado de 10%). Dos bicos avaliados, **${summary.okCount} estão totalmente calibrados** e em conformidade com o alvo nominal. Equipamento liberado para pulverização uniforme e de alta eficiência em campo.`;
  } else if (summary.generalClassification === 'aprovado_com_ressalvas') {
    textoConclusao = `⚠️ **Atenção (Aprovado com Ressalvas):** A barra opera em faixa limítrofe. `;
    if (cvVal > 10 && cvVal <= 15) {
      textoConclusao += `O Coeficiente de Variação está em **${cvVal.toFixed(1)}%** (faixa de atenção entre 10% e 15%), indicando pequenas oscilações de fluxo. `;
    } else {
      textoConclusao += `A uniformidade de vazão relativa está aceitável (CV de **${cvVal.toFixed(1)}%**), mas `;
    }
    textoConclusao += `existem **${summary.belowCount + summary.aboveCount} bicos com desvio leve** de vazão (desgaste ou obstrução leve). Recomenda-se realizar a limpeza dos bicos e dos filtros individuais assinalados antes da próxima aplicação.`;
  } else {
    // REPROVADO cases
    textoConclusao = `❌ **Equipamento REPROVADO!** `;
    if (cvVal <= 10) {
      // Caso clássico: CV baixo (bom), mas reprovado porque os bicos estão todos descalibrados em relação ao alvo (ou bicos críticos)
      textoConclusao += `Apesar de apresentar um Coeficiente de Variação baixo e uniforme de **${cvVal.toFixed(1)}%** (indicando que as pontas aplicam volumes muito parecidos entre si), a barra possui **${totalOffTarget} bicos desregulados em relação à vazão nominal alvo esperada** de **${expectedFlow.toFixed(2)} L/min** (sendo **${criticalCount} bicos em estado crítico** de entupimento ou desgaste severo). Aplicar nessas condições causará uma subdosagem ou sobredosagem sistemática na área, distanciando toda a aplicação do alvo planejado de calda. **Substitua e limpe imediatamente** as pontas indicadas para reajustar a máquina ao planejado.`;
    } else {
      // CV ruim (desuniformidade severa)
      textoConclusao += `A barra apresenta desuniformidade mecânica severa de fluxo, registrando um Coeficiente de Variação inaceitável de **${cvVal.toFixed(1)}%** (limite máximo recomendado de 10%). A barra possui **${criticalCount} bicos em estado crítico** de entupimento ou desgaste severo e **${summary.belowCount + summary.aboveCount} bicos desregulados**. Pulverizar nessas condições gerará faixas com falha severa de controle (subdosagem) e faixas com desperdício direto de defensivo e risco de fitotoxicidade (sobredosagem). **Realize a manutenção imediata** das pontas indicadas.`;
    }
  }
  document.getElementById('rep-texto-conclusao').innerHTML = textoConclusao;

  // Renderizar Barra Espacial no Relatório
  renderBoomVisualizer('boom-track-report');

  // Gerar Gráfico no Relatório
  renderReportChart(summary, expectedFlow, tolerance);

  // Preencher Tabela de Bicos e Plano de Ação
  const tbody = document.getElementById('report-table-tbody');
  tbody.innerHTML = '';

  const planoAcaoSet = new Set();

  measurements.forEach(m => {
    const tr = document.createElement('tr');
    tr.className = m.status === 'nao_avaliado' ? 'no-print' : '';
    
    let badgeClass = 'status-ok';
    if (m.status.includes('abaixo')) badgeClass = 'status-critico_abaixo';
    else if (m.status.includes('acima')) badgeClass = 'status-acima';

    tr.innerHTML = `
      <td style="font-weight:bold;">${String(m.nozzle_number).padStart(2, '0')}</td>
      <td>${m.collected_volume_ml > 0 ? m.collected_volume_ml + ' mL' : '--'}</td>
      <td>${m.collected_volume_ml > 0 ? m.collection_time_seconds + 's' : '--'}</td>
      <td>${m.measured_flow_l_min > 0 ? m.measured_flow_l_min.toFixed(2) : '--'}</td>
      <td>${m.expected_flow_l_min ? m.expected_flow_l_min.toFixed(2) : '--'}</td>
      <td style="font-weight:bold; color: ${m.deviation_percent > 0 ? '#b45309' : (m.deviation_percent < 0 ? '#ef4444' : 'inherit')}">
        ${m.collected_volume_ml > 0 ? (m.deviation_percent > 0 ? '+' : '') + m.deviation_percent.toFixed(1) + '%' : '--'}
      </td>
      <td>${m.actual_rate_l_ha > 0 ? m.actual_rate_l_ha.toFixed(1) : '--'}</td>
      <td><span class="badge ${badgeClass}">${m.status.replace('_', ' ')}</span></td>
      <td style="font-size:12px; color:var(--text-muted);">${m.recommendation || 'Nenhuma ação necessária.'}</td>
    `;
    tbody.appendChild(tr);

    // Alimentar o plano de ação sugerido
    if (m.status === 'abaixo' || m.status === 'critico_abaixo') {
      planoAcaoSet.add('Limpar pontas com vazão abaixo da tolerância usando escova de nylon apropriada.');
      planoAcaoSet.add('Revisar e higienizar os filtros individuais de malha dos porta-bicos correspondentes.');
    }
    if (m.status === 'acima' || m.status === 'critico_acima') {
      planoAcaoSet.add('Substituir pontas com vazão excessiva por bicos novos idênticos.');
    }
  });

  // Checklist de Plano de Ação
  const listaAcao = document.getElementById('rep-recomendacoes-lista');
  listaAcao.innerHTML = '';
  
  if (planoAcaoSet.size === 0) {
    listaAcao.innerHTML = '<li>✓ Todas as pontas estão dentro dos padrões normais de vazão. Apenas mantenha a higienização física rotineira ao final de cada aplicação.</li>';
  } else {
    planoAcaoSet.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      listaAcao.appendChild(li);
    });
    // Itens padrão
    listaAcao.innerHTML += '<li>Verificar no manômetro de cabine a estabilidade da pressão e aferir a bomba hidráulica do pulverizador.</li>';
    listaAcao.innerHTML += '<li>Realizar uma nova inspeção espacial de aferição após a execução das trocas e limpezas físicas.</li>';
  }

  // Acionar simulador financeiro interativo
  triggerFinancialLossSimulator();
  
  // Salvar diagnóstico no histórico do localStorage automaticamente ao abrir relatório
  saveInspectionToDatabase(summary);
}

// Simulador financeiro dinâmico
function triggerFinancialLossSimulator() {
  const area = parseFloat(document.getElementById('sim-area').value) || 250;
  const custo = parseFloat(document.getElementById('sim-custo').value) || 200;
  const valorSafra = parseFloat(document.getElementById('sim-valor-safra').value) || 3000;
  const perdaPercent = parseFloat(document.getElementById('sim-perda-percent').value) || 10;
  
  const expectedFlow = parseFloat(document.getElementById('input-vazao-nominal').value) || 1.2;
  const speed = parseFloat(document.getElementById('input-velocidade').value) || 16;
  const spacing = parseFloat(document.getElementById('input-espacamento').value) || 0.5;

  const simResult = simulateFinancialLoss(measurements, expectedFlow, speed, spacing, custo, area, valorSafra, perdaPercent);

  // Injetar valores
  document.getElementById('rep-sim-desperdicio').textContent = `R$ ${simResult.wastedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById('rep-sim-escape').textContent = `R$ ${simResult.efficiencyLossRiskCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById('rep-sim-total').textContent = `R$ ${simResult.totalLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Injetar parâmetros dinâmicos na memória de cálculo/legenda
  document.getElementById('memo-area').textContent = area.toLocaleString('pt-BR');
  document.getElementById('memo-custo').textContent = custo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('memo-valor-safra').textContent = valorSafra.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('memo-perda-percent').textContent = perdaPercent;
}

// ==========================================
// 8. RENDERIZADOR DO GRÁFICO (CHART.JS)
// ==========================================
function renderReportChart(summary, expectedFlow, tolerancePercent) {
  if (reportChartInstance) {
    reportChartInstance.destroy();
  }

  const ctx = document.getElementById('report-chart-canvas').getContext('2d');
  
  const labels = [];
  const dataFlows = [];
  const barColors = [];
  
  // Limites de tolerância
  const upperTol = expectedFlow * (1 + tolerancePercent / 100);
  const lowerTol = expectedFlow * (1 - tolerancePercent / 100);

  measurements.forEach(m => {
    labels.push(String(m.nozzle_number));
    dataFlows.push(m.measured_flow_l_min > 0 ? m.measured_flow_l_min : null);
    
    // Cor por bico baseada no desvio
    if (m.status === 'ok') {
      barColors.push('#10b981'); // Emerald 500
    } else if (m.status === 'abaixo' || m.status === 'acima') {
      barColors.push('#f59e0b'); // Amber 500
    } else if (m.status.includes('critico')) {
      barColors.push('#ef4444'); // Red 500
    } else {
      barColors.push('#e2e8f0');
    }
  });

  reportChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Vazão Medida (L/min)',
        data: dataFlows,
        backgroundColor: barColors,
        borderWidth: 1,
        borderRadius: 2,
        barPercentage: 0.8,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 15,
          right: 5,
          top: 5,
          bottom: 5
        }
      },
      plugins: {
        legend: { display: false },
        annotation: {
          annotations: {
            lineTarget: {
              type: 'line',
              yMin: expectedFlow,
              yMax: expectedFlow,
              borderColor: '#0066cc',
              borderWidth: 2,
              label: {
                content: `Esperado: ${expectedFlow.toFixed(2)} L/min`,
                display: true,
                position: 'start',
                backgroundColor: 'rgba(0,102,204,0.85)',
                font: { family: 'Outfit', weight: 'bold', size: 10 }
              }
            },
            lineUpper: {
              type: 'line',
              yMin: upperTol,
              yMax: upperTol,
              borderColor: '#f59e0b',
              borderDash: [5, 5],
              borderWidth: 1.5,
              label: {
                content: `+${tolerancePercent}%`,
                display: true,
                position: 'end',
                backgroundColor: 'rgba(245,158,11,0.85)',
                font: { size: 9 }
              }
            },
            lineLower: {
              type: 'line',
              yMin: lowerTol,
              yMax: lowerTol,
              borderColor: '#ef4444',
              borderDash: [5, 5],
              borderWidth: 1.5,
              label: {
                content: `-${tolerancePercent}%`,
                display: true,
                position: 'end',
                backgroundColor: 'rgba(239,68,68,0.85)',
                font: { size: 9 }
              }
            }
          }
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'Vazão por Bico (L/min)', font: { family: 'Outfit', weight: 'bold', size: 12 } },
          min: 0,
          max: Math.max(2.0, parseFloat((expectedFlow * 1.5).toFixed(2))),
          grid: { color: 'rgba(15, 23, 42, 0.05)' }
        },
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            autoSkip: false,
            font: { size: 7.5, weight: 'bold' }
          },
          grid: { display: false }
        }
      }
    }
  });
}

// ==========================================
// 9. PERSISTÊNCIA & HISTÓRICO (DATABASE)
// ==========================================
async function saveInspectionToDatabase(summary) {
  if (currentInspectionId === 'demo-aprovado' || currentInspectionId === 'demo-ressalvas' || currentInspectionId === 'demo-reprovado') {
    console.log("Rascunho de demonstração - Impedindo salvamento automático no banco.");
    return;
  }

  const cliente = document.getElementById('input-cliente').value.trim();
  const fazenda = document.getElementById('input-fazenda').value.trim();
  const cidade = document.getElementById('input-cidade').value.trim();
  const estado = document.getElementById('input-estado').value;
  const talhao = document.getElementById('input-talhao').value.trim();
  const cultura = document.getElementById('input-cultura').value.trim();
  const operacao = document.getElementById('input-operacao').value;
  const marca = document.getElementById('input-marca').value.trim();
  const modelo = document.getElementById('input-modelo').value.trim();
  const tipo = document.getElementById('input-tipo-pulv').value;
  const largura = parseFloat(document.getElementById('input-largura-barra').value) || 30;
  const espacamento = parseFloat(document.getElementById('input-espacamento').value) || 0.5;
  const pressao = parseFloat(document.getElementById('input-pressao').value) || 3.0;
  const pressaoUnidade = document.getElementById('select-unidade-pressao').value;
  const velocidade = parseFloat(document.getElementById('input-velocidade').value) || 16;
  const volumeAlvo = parseFloat(document.getElementById('input-volume-alvo').value) || 100;
  const bicoModelo = document.getElementById('input-ponta-modelo').value.trim();
  const expectedNominalFlow = parseFloat(document.getElementById('input-vazao-nominal').value) || 1.2;
  const tolerance = parseFloat(document.getElementById('input-tolerancia').value) || 10;
  const tempoColeta = parseInt(document.getElementById('input-tempo-coleta').value) || 30;
  const inspetor = document.getElementById('input-responsavel').value.trim();
  const notes = document.getElementById('input-notas-identificacao').value.trim();

  // Cabeçalho da inspeção
  const header = {
    id: currentInspectionId, // Pode ser null para nova inserção no dbService
    client_name: cliente,
    farm_name: fazenda,
    city: cidade,
    state: estado,
    field_name: talhao,
    crop: cultura,
    operation_type: operacao,
    sprayer_brand: marca,
    sprayer_model: modelo,
    sprayer_type: tipo,
    boom_width_m: largura,
    total_nozzles: totalNozzles,
    nozzle_spacing_m: espacamento,
    pressure_value: pressao,
    pressure_unit: pressaoUnidade,
    speed_kmh: velocidade,
    target_rate_l_ha: volumeAlvo,
    nozzle_model: bicoModelo,
    expected_flow_l_min: expectedNominalFlow,
    tolerance_percent: tolerance,
    collection_time_seconds: tempoColeta,
    status: 'completed',
    summary: summary,
    notes: `${notes}\nInspetor: ${inspetor}`
  };

  try {
    const saved = await saveInspection(header, measurements);
    currentInspectionId = saved.id;
    console.log("Diagnóstico salvo com sucesso no banco de dados!", saved.id);
  } catch (error) {
    console.error("Falha ao salvar diagnóstico online, executando contingência local:", error);
    
    // CONTINGÊNCIA: Salvar localmente via localStorage de forma segura
    try {
      const now = new Date().toISOString();
      const backupInspection = {
        ...header,
        id: header.id || generateUUID(),
        created_at: now,
        updated_at: now
      };
      
      const inspections = getLocalStorageItem('spray_flow_inspections', []);
      const allMeasurements = getLocalStorageItem('spray_flow_measurements', []);
      
      let existingIndex = inspections.findIndex(i => i.id === backupInspection.id);
      if (existingIndex >= 0) {
        inspections[existingIndex] = backupInspection;
      } else {
        inspections.push(backupInspection);
      }
      
      setLocalStorageItem('spray_flow_inspections', inspections);
      
      const cleanMeasurements = allMeasurements.filter(m => m.inspection_id !== backupInspection.id);
      const newMeasurements = measurements.map(m => ({
        ...m,
        id: m.id || generateUUID(),
        inspection_id: backupInspection.id
      }));
      setLocalStorageItem('spray_flow_measurements', [...cleanMeasurements, ...newMeasurements]);
      
      currentInspectionId = backupInspection.id;
      
      alert("⚠️ Alerta: Falha ao sincronizar com a nuvem (verifique se as tabelas do Supabase foram criadas via painel SQL). O laudo foi salvo localmente no aparelho por segurança.");
    } catch (e2) {
      console.error("Falha gravíssima no fallback offline:", e2);
      alert("Erro ao gravar laudo. Verifique o espaço de armazenamento do seu aparelho.");
    }
  }
  try {
    localStorage.removeItem('spray_flow_active_draft');
  } catch (e) {}
}

async function renderHistoryList() {
  const container = document.getElementById('history-items-container');
  const empty = document.getElementById('history-empty-state');
  
  container.innerHTML = '';
  
  try {
    const list = await getInspections();
    
    if (list.length === 0) {
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';

    list.forEach(item => {
      const card = document.createElement('div');
      
      let badgeClass = 'rejected';
      let classificationText = 'Reprovado';
      const cvVal = item.summary ? item.summary.coefficientOfVariationPercent : 0;
      const okPercent = item.summary ? (item.summary.okCount / item.summary.evaluatedNozzles) * 100 : 0;

      if (item.summary?.generalClassification === 'aprovado') {
        badgeClass = 'approved';
        classificationText = 'Aprovado';
      } else if (item.summary?.generalClassification === 'aprovado_com_ressalvas') {
        badgeClass = 'warning';
        classificationText = 'Aprovado com Ressalvas';
      }

      card.className = `history-item-card ${badgeClass}`;
      
      card.innerHTML = `
        <div style="font-weight:bold; font-size:16px; color:var(--text-main); font-family:'Outfit'; display:flex; align-items:center; justify-content:space-between;">
          <span>${item.client_name}</span>
          ${item.is_demo ? `<span style="font-size:10px; background:var(--accent-glow); color:var(--accent); padding:2px 8px; border-radius:12px; font-weight:bold; border: 1px solid rgba(0, 102, 204, 0.12);">💡 DEMO</span>` : ''}
        </div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:-6px;">
          🏡 ${item.farm_name || 'Fazenda S/N'} | 📍 ${item.city} - ${item.state}
        </div>
        <div style="font-size:11px; background:#f1f5f9; padding:6px; border-radius:8px; display:flex; flex-direction:column; gap:2px; border:1px solid #cbd5e1;">
          <div>🚜 Pulverizador: **${item.sprayer_brand || ''} ${item.sprayer_model || ''}**</div>
          <div>🎨 Bico: **${item.nozzle_model || 'Não informado'}**</div>
          <div>⏱️ CV da Barra: **${cvVal.toFixed(1)}%** (${item.summary?.evaluatedNozzles} bicos aferidos)</div>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <span style="font-size:10px; color:var(--text-light);">${new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary btn-open-ins" data-id="${item.id}" style="padding:6px 10px; min-height:30px; font-size:11px;">📂 Abrir</button>
            <button class="btn btn-danger btn-delete-ins" data-id="${item.id}" style="padding:6px 10px; min-height:30px; font-size:11px;">🗑️ Excluir</button>
          </div>
        </div>
      `;

      // Eventos dos botões
      card.querySelector('.btn-open-ins').addEventListener('click', () => loadInspectionIntoApp(item.id));
      card.querySelector('.btn-delete-ins').addEventListener('click', () => deleteInspectionFromHistory(item.id));

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao listar histórico:", error);
  }
}

async function loadInspectionIntoApp(id) {
  try {
    const data = await getInspectionById(id);
    if (!data) return;

    const { inspection, measurements: savedMeasurements } = data;
    
    currentInspectionId = inspection.id;
    totalNozzles = inspection.total_nozzles;
    measurements = savedMeasurements;
    activeNozzleIndex = 0;

    // Repovoar formulários
    document.getElementById('input-cliente').value = inspection.client_name;
    document.getElementById('input-fazenda').value = inspection.farm_name || '';
    document.getElementById('input-cidade').value = inspection.city;
    document.getElementById('input-estado').value = inspection.state;
    document.getElementById('input-talhao').value = inspection.field_name || '';
    document.getElementById('input-cultura').value = inspection.crop || '';
    document.getElementById('input-operacao').value = inspection.operation_type;
    
    document.getElementById('input-marca').value = inspection.sprayer_brand || '';
    document.getElementById('input-modelo').value = inspection.sprayer_model || '';
    document.getElementById('input-tipo-pulv').value = inspection.sprayer_type;
    document.getElementById('input-largura-barra').value = inspection.boom_width_m;
    document.getElementById('input-total-bicos').value = inspection.total_nozzles;
    document.getElementById('input-espacamento').value = inspection.nozzle_spacing_m;
    
    document.getElementById('input-pressao').value = inspection.pressure_value;
    document.getElementById('select-unidade-pressao').value = inspection.pressure_unit;
    document.getElementById('input-velocidade').value = inspection.speed_kmh;
    document.getElementById('input-volume-alvo').value = inspection.target_rate_l_ha;
    
    document.getElementById('input-ponta-modelo').value = inspection.nozzle_model || '';
    document.getElementById('input-vazao-nominal').value = inspection.expected_flow_l_min;
    document.getElementById('input-tolerancia').value = inspection.tolerance_percent;
    document.getElementById('input-tempo-coleta').value = inspection.collection_time_seconds;

    // Carregar notas
    const notesArray = inspection.notes ? inspection.notes.split('\nInspetor:') : ['', ''];
    document.getElementById('input-notas-identificacao').value = notesArray[0].trim();
    
    // Recuperar Responsável Técnico (ou auto-preencher se vazio para evitar bloqueios de validação)
    let inspectorVal = notesArray[1] ? notesArray[1].trim() : '';
    if (!inspectorVal) {
      const emailSpan = document.getElementById('logged-user-email');
      if (emailSpan && emailSpan.textContent && emailSpan.textContent !== '--') {
        inspectorVal = emailSpan.textContent.split('@')[0].toUpperCase();
      } else {
        inspectorVal = 'CONSULTOR';
      }
    }
    document.getElementById('input-responsavel').value = inspectorVal;

    // Fechar modal do histórico
    document.getElementById('modal-history').style.display = 'none';

    // Avançar direto para a coleta ou relatório
    switchTab('tab-coleta');
    alert(`Diagnóstico de ${inspection.client_name} carregado com sucesso!`);
    
  } catch (error) {
    console.error("Erro ao carregar dados do diagnóstico:", error);
    alert("Falha ao ler dados da inspeção.");
  }
}

async function deleteInspectionFromHistory(id) {
  if (id === 'demo-aprovado' || id === 'demo-ressalvas' || id === 'demo-reprovado') {
    alert("Ops! Esta é uma inspeção de demonstração estática e não pode ser excluída.");
    return;
  }

  if (!confirm("Tem certeza que deseja excluir permanentemente este diagnóstico e todas as suas medições de bico?")) {
    return;
  }
  
  try {
    await deleteInspection(id);
    renderHistoryList();
    if (currentInspectionId === id) {
      currentInspectionId = null;
      initMeasurements();
    }
  } catch (e) {
    console.error("Erro ao excluir do banco:", e);
    alert("Falha ao deletar.");
  }
}

// ==========================================
// 10. ASSISTENTE DE VOZ (HANDS-FREE)
// ==========================================
function setupVoiceAssistant() {
  const indicator = document.getElementById('voice-indicator');
  
  const check = initVoiceService();
  if (!check.supported) {
    indicator.style.display = 'none';
    return;
  }

  // Conectar callbacks de voz à interface
  registerVoiceCallbacks({
    onResult: (volumeMl, explicitNozzle) => {
      // Se um bico explícito foi falado (ex: "Bico 5, 450 ml")
      if (explicitNozzle !== null && explicitNozzle >= 1 && explicitNozzle <= totalNozzles) {
        activeNozzleIndex = explicitNozzle - 1;
        updateGuidedNozzleFocus();
      }

      document.getElementById('input-volume-ml').value = volumeMl;
      updateRealtimeNozzleFeedback();
      playBeep('success');
      speak(`Bico ${activeNozzleIndex + 1}: ${volumeMl} mL anotado.`);
    },
    onCommand: (cmd) => {
      if (cmd === 'next') {
        saveAndNextNozzle();
      } else if (cmd === 'back') {
        prevNozzle();
      } else if (cmd === 'timer') {
        startChronometer();
      } else if (cmd === 'clear') {
        document.getElementById('input-volume-ml').value = '';
        updateRealtimeNozzleFeedback();
        speak(`Valores apagados para o bico ${activeNozzleIndex + 1}.`);
      } else if (cmd === 'clogged') {
        markNozzleStatus('critico_abaixo');
      } else if (cmd === 'leaking') {
        markNozzleStatus('critico_acima');
      }
    },
    onStatus: (status, err) => {
      if (status === 'escutando') {
        indicator.className = 'voice-indicator active';
        indicator.textContent = '🎤 Assistente de Voz: Ouvindo...';
      } else {
        indicator.className = 'voice-indicator';
        indicator.textContent = '🎤 Assistente de Voz: Desligado';
      }
    }
  });

  // Ligar/Desligar no clique do indicador
  indicator.addEventListener('click', () => {
    if (isCurrentlyListening()) {
      stopListening();
      speak("Assistente de voz inativo.");
    } else {
      startListening();
      speak("Assistente ativado. Diga o volume ou cronômetro.");
    }
  });
}

function saveAndNextNozzle() {
  const inputVol = document.getElementById('input-volume-ml');
  const vol = parseFloat(inputVol.value) || 0;
  
  const duration = parseInt(document.getElementById('input-tempo-coleta').value) || 30;
  const expectedFlow = parseFloat(document.getElementById('input-vazao-nominal').value) || 1.2;
  const tolerance = parseFloat(document.getElementById('input-tolerancia').value) || 10;

  // Atualizar dados
  updateNozzleData(activeNozzleIndex, vol, duration, expectedFlow, tolerance);

  // Avançar no estado
  if (activeNozzleIndex < totalNozzles - 1) {
    activeNozzleIndex++;
    resetChronometer();
    updateGuidedNozzleFocus();
  } else {
    // Fim da barra
    speak("Aferição espacial de bicos concluída. Gerando relatório.");
    switchTab('tab-relatorio');
  }
}

function prevNozzle() {
  if (activeNozzleIndex > 0) {
    activeNozzleIndex--;
    resetChronometer();
    updateGuidedNozzleFocus();
  }
}

function markNozzleStatus(status) {
  const m = measurements[activeNozzleIndex];
  m.status = status;
  m.collected_volume_ml = 0;
  
  const rec = getNozzleRecommendation(status, activeNozzleIndex + 1);
  m.recommendation = rec.action;
  m.notes = rec.diagnostic;

  playBeep('error');
  speak(`Bico ${activeNozzleIndex + 1} marcado como ${status.replace('_', ' ')}.`);
  
  setTimeout(() => {
    saveAndNextNozzle();
  }, 1200);
}

// ==========================================
// 11. CREDENCIAIS SUPABASE (PORTABILIDADE)
// ==========================================
function loadSavedCredentials() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const url = localStorage.getItem('spray_supabase_url');
      const key = localStorage.getItem('spray_supabase_key');
      if (url && key) {
        document.getElementById('db-supabase-url').value = url;
        document.getElementById('db-supabase-key').value = key;
      }
    }
  } catch (e) {
    console.warn("localStorage não está acessível para recuperar as chaves salvas do Supabase:", e);
  }
}

window.saveDbConfig = function(event) {
  event.preventDefault();
  const url = document.getElementById('db-supabase-url').value.trim();
  const key = document.getElementById('db-supabase-key').value.trim();
  
  try {
    configureSupabase(url, key);
    alert("Credenciais do Supabase gravadas e validadas localmente com sucesso! Quando alterar a flag USE_SUPABASE em dbService.js, o banco online estará ativo.");
    document.getElementById('modal-db-config').style.display = 'none';
  } catch (e) {
    alert("Erro ao validar conexão Supabase. Verifique a URL e a Anon Key fornecidas.");
  }
};

// ==========================================
// 12. EVENTOS GERAIS DA INTERFACE
// ==========================================
function setupEventListeners() {
  // Navegação direta por botões de rodapé
  document.getElementById('btn-goto-pulverizador').addEventListener('click', () => switchTab('tab-pulverizador'));
  document.getElementById('btn-goto-pontas').addEventListener('click', () => switchTab('tab-pontas'));
  document.getElementById('btn-goto-coleta').addEventListener('click', () => switchTab('tab-coleta'));
  document.getElementById('btn-goto-relatorio').addEventListener('click', () => switchTab('tab-relatorio'));

  document.getElementById('btn-back-to-identificacao').addEventListener('click', () => switchTab('tab-identificacao'));
  document.getElementById('btn-back-to-pulverizador').addEventListener('click', () => switchTab('tab-pulverizador'));
  document.getElementById('btn-back-to-pontas').addEventListener('click', () => switchTab('tab-pontas'));
  document.getElementById('btn-back-to-coleta').addEventListener('click', () => switchTab('tab-coleta'));

  // Modais
  document.getElementById('btn-show-history').addEventListener('click', () => {
    document.getElementById('modal-history').style.display = 'flex';
    renderHistoryList();
  });
  


  document.getElementById('btn-help').addEventListener('click', () => {
    document.getElementById('modal-help').style.display = 'flex';
  });

  // Ações de Coleta Guided
  document.getElementById('btn-timer-start').addEventListener('click', () => {
    if (timerInterval) {
      pauseChronometer();
    } else {
      startChronometer();
    }
  });

  document.getElementById('btn-timer-reset').addEventListener('click', resetChronometer);
  document.getElementById('btn-prev-nozzle').addEventListener('click', prevNozzle);
  document.getElementById('btn-skip-nozzle').addEventListener('click', () => {
    if (activeNozzleIndex < totalNozzles - 1) {
      activeNozzleIndex++;
      updateGuidedNozzleFocus();
    }
  });

  document.getElementById('btn-save-next-nozzle').addEventListener('click', saveAndNextNozzle);
  
  document.getElementById('btn-mark-clogged').addEventListener('click', () => markNozzleStatus('critico_abaixo'));
  document.getElementById('btn-mark-leaking').addEventListener('click', () => markNozzleStatus('critico_acima'));

  // Ações de relatório
  document.getElementById('btn-print').addEventListener('click', () => window.print());
  document.getElementById('btn-export-csv').addEventListener('click', exportToCSV);
  document.getElementById('btn-export-json').addEventListener('click', exportToJSON);

  // Trigger de importação e input file
  document.getElementById('btn-trigger-import').addEventListener('click', () => {
    document.getElementById('input-import-file').click();
  });
  document.getElementById('input-import-file').addEventListener('change', importFromJSON);

  // Simulador financeiro interativo
  document.getElementById('sim-area').addEventListener('input', triggerFinancialLossSimulator);
  document.getElementById('sim-custo').addEventListener('input', triggerFinancialLossSimulator);
  document.getElementById('sim-valor-safra').addEventListener('input', triggerFinancialLossSimulator);
  document.getElementById('sim-perda-percent').addEventListener('input', triggerFinancialLossSimulator);

  // Botões de Iniciar Novo Diagnóstico
  document.getElementById('btn-header-new').addEventListener('click', createNewInspectionWorkflow);
  document.getElementById('btn-new-inspection-bottom').addEventListener('click', createNewInspectionWorkflow);

  // Presets de espaçamento programáticos
  document.querySelectorAll('[data-spacing]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = parseFloat(e.currentTarget.getAttribute('data-spacing'));
      setSpacingValue(val);
    });
  });

  // Presets de tolerância programáticos
  document.querySelectorAll('[data-tolerance]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = parseFloat(e.currentTarget.getAttribute('data-tolerance'));
      setToleranceValue(val);
    });
  });

  // Presets de tempo de coleta programáticos
  document.querySelectorAll('[data-time]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = parseInt(e.currentTarget.getAttribute('data-time'));
      setCollectionTime(val);
    });
  });

  // Modos de coleta programáticos
  document.getElementById('btn-mode-guided').addEventListener('click', () => {
    switchCollectionMode('guided');
  });
  document.getElementById('btn-mode-bulk').addEventListener('click', () => {
    switchCollectionMode('bulk');
  });

  // Listener para tempo de coleta manual
  const handleTempoColetaInput = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      timerDuration = val;
      resetChronometer();
      // Atualizar botões de atalho correspondentes
      const btns = document.querySelectorAll('#tab-coleta .timer-preset-btn');
      btns.forEach(b => {
        const bTime = parseInt(b.getAttribute('data-time'));
        b.classList.toggle('active', bTime === val);
      });
    }
  };
  const inputTempoColeta = document.getElementById('input-tempo-coleta');
  inputTempoColeta.addEventListener('input', handleTempoColetaInput);
  inputTempoColeta.addEventListener('change', handleTempoColetaInput);

  // Foco no teclado na coletaguided
  document.getElementById('input-volume-ml').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveAndNextNozzle();
    }
  });

  // Eventos de Autenticação Supabase
  document.getElementById('login-form').addEventListener('submit', handleUserLogin);
  document.getElementById('btn-logout').addEventListener('click', handleUserLogout);
  document.getElementById('btn-login-skip').addEventListener('click', handleOfflineBypass);
  document.getElementById('btn-trigger-login').addEventListener('click', showLoginScreen);
}

// Exportador CSV
function exportToCSV() {
  const cliente = document.getElementById('input-cliente').value;
  const data = new Date().toLocaleDateString('pt-BR');
  
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Relatório de Diagnóstico de Vazão Manual - Spray Precision\n";
  csvContent += `Cliente: ${cliente}\n`;
  csvContent += `Data: ${data}\n\n`;
  csvContent += "Bico;Volume Coletado (mL);Tempo (s);Vazao Medida (L/min);Vazao Esperada (L/min);Desvio (%);Taxa Real (L/ha);Status\n";

  measurements.forEach(m => {
    csvContent += `${m.nozzle_number};${m.collected_volume_ml};${m.collection_time_seconds};${m.measured_flow_l_min.toFixed(2)};${m.expected_flow_l_min.toFixed(2)};${m.deviation_percent.toFixed(1)};${m.actual_rate_l_ha.toFixed(1)};${m.status}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Relatorio_Vazao_Bicos_${cliente.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Exportador JSON (Backup Físico do Diagnóstico)
function exportToJSON() {
  const cliente = document.getElementById('input-cliente').value.trim() || 'Sem_Nome';
  const data = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
  
  const expectedFlow = parseFloat(document.getElementById('input-vazao-nominal').value) || 1.2;
  const speed = parseFloat(document.getElementById('input-velocidade').value) || 16;
  const spacing = parseFloat(document.getElementById('input-espacamento').value) || 0.5;
  const tolerance = parseFloat(document.getElementById('input-tolerancia').value) || 10;
  
  const summary = calculateBarSummary(measurements, expectedFlow, speed, spacing, tolerance, totalNozzles);

  const exportData = {
    inspection: {
      id: currentInspectionId,
      client_name: document.getElementById('input-cliente').value.trim(),
      farm_name: document.getElementById('input-fazenda').value.trim(),
      city: document.getElementById('input-cidade').value.trim(),
      state: document.getElementById('input-estado').value,
      field_name: document.getElementById('input-talhao').value.trim(),
      crop: document.getElementById('input-cultura').value.trim(),
      operation_type: document.getElementById('input-operacao').value,
      sprayer_brand: document.getElementById('input-marca').value.trim(),
      sprayer_model: document.getElementById('input-modelo').value.trim(),
      sprayer_type: document.getElementById('input-tipo-pulv').value,
      boom_width_m: parseFloat(document.getElementById('input-largura-barra').value) || 30,
      total_nozzles: totalNozzles,
      nozzle_spacing_m: spacing,
      pressure_value: parseFloat(document.getElementById('input-pressao').value) || 3.0,
      pressure_unit: document.getElementById('select-unidade-pressao').value,
      speed_kmh: speed,
      target_rate_l_ha: parseFloat(document.getElementById('input-volume-alvo').value) || 100,
      nozzle_model: document.getElementById('input-ponta-modelo').value.trim(),
      expected_flow_l_min: expectedFlow,
      tolerance_percent: tolerance,
      collection_time_seconds: parseInt(document.getElementById('input-tempo-coleta').value) || 30,
      status: 'completed',
      summary: summary,
      notes: document.getElementById('input-notas-identificacao').value.trim(),
      created_at: new Date().toISOString()
    },
    measurements: measurements
  };

  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonString);
  link.setAttribute("download", `Backup_Vazao_${cliente.replace(/\s+/g, '_')}_${data}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Importador JSON (Restauração Física de Backups)
function importFromJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      // Validações de integridade
      if (!data.inspection || !data.measurements || !Array.isArray(data.measurements)) {
        alert("Erro: O arquivo selecionado não é um backup de diagnóstico válido do Spray Precision.");
        return;
      }

      // Garantir salvamento relacional como novo ou sobrescrever se coincidir ID
      const inspection = {
        ...data.inspection,
        id: data.inspection.id || null
      };
      
      const importedMeasurements = data.measurements;

      // Gravar via dbService
      const saved = await saveInspection(inspection, importedMeasurements);
      
      playBeep('success');
      speak("Diagnóstico importado com sucesso.");
      
      alert(`Sucesso! O diagnóstico de "${saved.client_name}" foi importado e restaurado no histórico offline.`);
      
      // Resetar input
      event.target.value = '';
      
      // Recarregar histórico
      renderHistoryList();
      
    } catch (err) {
      console.error("Erro ao decodificar JSON:", err);
      alert("Erro ao ler arquivo JSON. Certifique-se de selecionar um arquivo de backup íntegro da Spray Precision.");
    }
  };
  reader.readAsText(file);
}

// Inicializa o fluxo de um novo diagnóstico limpo do zero
function createNewInspectionWorkflow() {
  if (!confirm("Deseja realmente iniciar uma nova calibração? Todos os dados atuais da coleta (volumes e identificações) serão limpos localmente. Certifique-se de ter impresso o PDF ou exportado o Backup JSON se precisar guardar esses registros.")) {
    return;
  }

  // 1. Resetar IDs e Estados
  currentInspectionId = null;
  activeNozzleIndex = 0;
  
  // 2. Limpar todos os formulários da UI
  // Identificação (Etapa 1)
  document.getElementById('input-cliente').value = '';
  document.getElementById('input-fazenda').value = '';
  document.getElementById('input-cidade').value = '';
  document.getElementById('input-estado').selectedIndex = 0; // MT default
  document.getElementById('input-talhao').value = '';
  document.getElementById('input-cultura').value = '';
  document.getElementById('input-operacao').selectedIndex = 3; // fungicida default
  document.getElementById('input-responsavel').value = '';
  document.getElementById('input-notas-identificacao').value = '';
  
  // Pulverizador (Etapa 2)
  document.getElementById('input-marca').value = '';
  document.getElementById('input-modelo').value = '';
  document.getElementById('input-tipo-pulv').selectedIndex = 0; // autopropelido
  document.getElementById('input-largura-barra').value = '30';
  document.getElementById('input-total-bicos').value = '60';
  document.getElementById('input-espacamento').value = '0.5';
  document.getElementById('input-pressao').value = '3.0';
  document.getElementById('select-unidade-pressao').selectedIndex = 0; // bar
  document.getElementById('input-velocidade').value = '16.0';
  document.getElementById('input-volume-alvo').value = '100';

  // Parâmetros bicos (Etapa 3)
  document.getElementById('select-iso-nozzle').selectedIndex = 0;
  document.getElementById('input-vazao-nominal').value = '1.20';
  document.getElementById('select-ponta-tipo').selectedIndex = 1; // leque inducao
  document.getElementById('input-ponta-modelo').value = '';
  document.getElementById('select-ponta-condicao').selectedIndex = 1; // usada
  document.getElementById('input-tolerancia').value = '10';

  // Coleta (Etapa 4)
  document.getElementById('input-tempo-coleta').value = '30';
  document.getElementById('input-volume-ml').value = '';
  
  // Simulador Financeiro (Etapa 5)
  document.getElementById('sim-area').value = '250';
  document.getElementById('sim-custo').value = '200';
  document.getElementById('sim-valor-safra').value = '3000';
  document.getElementById('sim-perda-percent').value = '10';

  // 3. Reinicializar medições físicas de bicos
  totalNozzles = 60;
  initMeasurements();

  // 4. Resetar Cronômetro
  resetChronometer();

  // 5. Retornar à Etapa 1
  switchTab('tab-identificacao');
  
  // Efeitos sonoros e assistente de voz
  try {
    localStorage.removeItem('spray_flow_active_draft');
  } catch (e) {}
  playBeep('success');
  speak("Iniciando nova calibração.");
}

// ==========================================
// 15. PERSISTÊNCIA E AUTO-SAVE DO RASCUNHO ATIVO (PROTEÇÃO CONTRA RELOAD NO IPHONE)
// ==========================================
function saveActiveDraft() {
  try {
    // Não salvar rascunho se estiver no laudo
    if (activeTab === 'tab-relatorio') return;
    
    // Apenas salva se houver algum dado relevante
    const cliente = document.getElementById('input-cliente')?.value.trim() || '';
    const responsavel = document.getElementById('input-responsavel')?.value.trim() || '';
    const totalMeasurementsWithVolume = measurements.filter(m => m.collected_volume_ml > 0 || m.status !== 'nao_avaliado').length;
    
    if (!cliente && !responsavel && totalMeasurementsWithVolume === 0) {
      return; // Rascunho vazio, não vale a pena salvar
    }
    
    const draft = {
      currentInspectionId,
      activeNozzleIndex,
      totalNozzles,
      activeTab,
      measurements,
      inputs: {
        cliente,
        fazenda: document.getElementById('input-fazenda')?.value.trim() || '',
        cidade: document.getElementById('input-cidade')?.value.trim() || '',
        estado: document.getElementById('input-estado')?.value || 'MT',
        talhao: document.getElementById('input-talhao')?.value.trim() || '',
        cultura: document.getElementById('input-cultura')?.value.trim() || '',
        operacao: document.getElementById('input-operacao')?.value || 'fungicida',
        responsavel,
        notas_identificacao: document.getElementById('input-notas-identificacao')?.value.trim() || '',
        
        marca: document.getElementById('input-marca')?.value.trim() || '',
        modelo: document.getElementById('input-modelo')?.value.trim() || '',
        tipo_pulv: document.getElementById('input-tipo-pulv')?.value || 'autopropelido',
        largura_barra: parseFloat(document.getElementById('input-largura-barra')?.value) || 30,
        total_bicos: parseInt(document.getElementById('input-total-bicos')?.value) || 60,
        espacamento: parseFloat(document.getElementById('input-espacamento')?.value) || 0.5,
        pressao: parseFloat(document.getElementById('input-pressao')?.value) || 3.0,
        unidade_pressao: document.getElementById('select-unidade-pressao')?.value || 'bar',
        velocidade: parseFloat(document.getElementById('input-velocidade')?.value) || 16,
        volume_alvo: parseFloat(document.getElementById('input-volume-alvo')?.value) || 100,
        
        iso_nozzle: document.getElementById('select-iso-nozzle')?.value || '',
        vazao_nominal: parseFloat(document.getElementById('input-vazao-nominal')?.value) || 1.2,
        ponta_tipo: document.getElementById('select-ponta-tipo')?.value || 'leque_inducao',
        ponta_modelo: document.getElementById('input-ponta-modelo')?.value.trim() || '',
        ponta_condicao: document.getElementById('select-ponta-condicao')?.value || 'usada',
        tolerancia: parseFloat(document.getElementById('input-tolerancia')?.value) || 10,
        
        tempo_coleta: parseInt(document.getElementById('input-tempo-coleta')?.value) || 30
      }
    };
    
    localStorage.setItem('spray_flow_active_draft', JSON.stringify(draft));
  } catch (e) {
    console.error("Erro ao salvar rascunho de calibração:", e);
  }
}

function restoreActiveDraft() {
  try {
    const rawDraft = localStorage.getItem('spray_flow_active_draft');
    if (!rawDraft) return false;
    
    const draft = JSON.parse(rawDraft);
    if (!draft || !draft.measurements || draft.measurements.length === 0) return false;
    
    // Restaurar IDs e Estado
    currentInspectionId = draft.currentInspectionId;
    activeNozzleIndex = draft.activeNozzleIndex;
    totalNozzles = draft.totalNozzles;
    measurements = draft.measurements;
    activeTab = draft.activeTab || 'tab-identificacao';
    
    // Restaurar inputs
    const inputs = draft.inputs;
    if (inputs) {
      if (document.getElementById('input-cliente')) document.getElementById('input-cliente').value = inputs.cliente || '';
      if (document.getElementById('input-fazenda')) document.getElementById('input-fazenda').value = inputs.fazenda || '';
      if (document.getElementById('input-cidade')) document.getElementById('input-cidade').value = inputs.cidade || '';
      if (document.getElementById('input-estado')) document.getElementById('input-estado').value = inputs.estado || 'MT';
      if (document.getElementById('input-talhao')) document.getElementById('input-talhao').value = inputs.talhao || '';
      if (document.getElementById('input-cultura')) document.getElementById('input-cultura').value = inputs.cultura || '';
      if (document.getElementById('input-operacao')) document.getElementById('input-operacao').value = inputs.operacao || 'fungicida';
      if (document.getElementById('input-responsavel')) document.getElementById('input-responsavel').value = inputs.responsavel || '';
      if (document.getElementById('input-notas-identificacao')) document.getElementById('input-notas-identificacao').value = inputs.notas_identificacao || '';
      
      if (document.getElementById('input-marca')) document.getElementById('input-marca').value = inputs.marca || '';
      if (document.getElementById('input-modelo')) document.getElementById('input-modelo').value = inputs.modelo || '';
      if (document.getElementById('input-tipo-pulv')) document.getElementById('input-tipo-pulv').value = inputs.tipo_pulv || 'autopropelido';
      if (document.getElementById('input-largura-barra')) document.getElementById('input-largura-barra').value = inputs.largura_barra || 30;
      if (document.getElementById('input-total-bicos')) document.getElementById('input-total-bicos').value = inputs.total_bicos || 60;
      if (document.getElementById('input-espacamento')) document.getElementById('input-espacamento').value = inputs.espacamento || 0.5;
      if (document.getElementById('input-pressao')) document.getElementById('input-pressao').value = inputs.pressao || 3.0;
      if (document.getElementById('select-unidade-pressao')) document.getElementById('select-unidade-pressao').value = inputs.unidade_pressao || 'bar';
      if (document.getElementById('input-velocidade')) document.getElementById('input-velocidade').value = inputs.velocidade || 16;
      if (document.getElementById('input-volume-alvo')) document.getElementById('input-volume-alvo').value = inputs.volume_alvo || 100;
      
      if (document.getElementById('select-iso-nozzle')) document.getElementById('select-iso-nozzle').value = inputs.iso_nozzle || '';
      if (document.getElementById('input-vazao-nominal')) document.getElementById('input-vazao-nominal').value = inputs.vazao_nominal || 1.2;
      if (document.getElementById('select-ponta-tipo')) document.getElementById('select-ponta-tipo').value = inputs.ponta_tipo || 'leque_inducao';
      if (document.getElementById('input-ponta-modelo')) document.getElementById('input-ponta-modelo').value = inputs.ponta_modelo || '';
      if (document.getElementById('select-ponta-condicao')) document.getElementById('select-ponta-condicao').value = inputs.ponta_condicao || 'usada';
      if (document.getElementById('input-tolerancia')) document.getElementById('input-tolerancia').value = inputs.tolerancia || 10;
      
      if (document.getElementById('input-tempo-coleta')) document.getElementById('input-tempo-coleta').value = inputs.tempo_coleta || 30;
    }
    
    // Atualizar UI
    renderBoomVisualizer('boom-track-visual');
    updateGuidedNozzleFocus();
    rebuildBulkGrid();
    
    // Forçar a visualização da aba ativa restaurada
    switchTab(activeTab);
    
    console.log("Rascunho de calibração ativa restaurado do localStorage!");
    return true;
  } catch (e) {
    console.error("Erro ao restaurar rascunho de calibração:", e);
    return false;
  }
}

function setupDraftAutoSave() {
  const container = document.querySelector('.app-container');
  if (container) {
    // Escutar por alterações de input para salvar rascunho instantaneamente
    container.addEventListener('input', saveActiveDraft);
    container.addEventListener('change', saveActiveDraft);
  }
  
  // Evitar Pull-To-Refresh no Safari/Chrome móvel (além do CSS)
  window.addEventListener('beforeunload', (event) => {
    // Se houver algum bico coletado, pedir confirmação antes de sair
    const hasVolume = measurements.some(m => m.collected_volume_ml > 0 || m.status !== 'nao_avaliado');
    if (hasVolume && activeTab !== 'tab-relatorio') {
      event.preventDefault();
      event.returnValue = 'Você possui coletas em andamento. Deseja realmente atualizar a página?';
      return event.returnValue;
    }
  });
}
