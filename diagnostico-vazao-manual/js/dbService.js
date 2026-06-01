/**
 * Camada de Acesso a Dados (DAO)
 * Abstração de persistência: LocalStorage (Offline) <-> Supabase (Online)
 */

// supabase import removed

// Alterar para true para ativar o banco de dados online do Supabase
const USE_SUPABASE = true; 

/**
 * Retorna as chaves locais usadas no localStorage
 */
const KEYS = {
  INSPECTIONS: 'spray_flow_inspections',
  MEASUREMENTS: 'spray_flow_measurements'
};

/**
 * Auxiliar para simular delay de rede nas operações locais (opcional, melhora a UX do loader)
 */
function delay(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Salva ou atualiza uma Inspeção de Vazão (Cabeçalho) e suas Medições (Bicos)
 */
async function saveInspection(inspection, measurements) {
  await delay(200);

  if (USE_SUPABASE) {
    const supabase = window.supabaseClient;
    if (!supabase) throw new Error("Cliente Supabase não inicializado!");
    
    // Obter usuário logado atual do Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("Usuário não autenticado no Supabase!");
    
    const inspectionData = {
      ...inspection,
      id: inspection.id || generateUUID(),
      owner_id: user.id,
      updated_at: new Date().toISOString()
    };

    // 1. Upsert na tabela flow_inspections
    const { data: insData, error: insError } = await supabase
      .from('flow_inspections')
      .upsert(inspectionData)
      .select()
      .single();

    if (insError) throw insError;
    const inspectionId = insData.id;

    // 2. Formatar e fazer upsert das medições
    const formattedMeasurements = measurements.map(m => ({
      ...m,
      inspection_id: inspectionId
    }));

    // Excluir medições anteriores para evitar duplicidade antes de inserir as novas
    const { error: delError } = await supabase
      .from('flow_measurements')
      .delete()
      .eq('inspection_id', inspectionId);

    if (delError) throw delError;

    const { error: measError } = await supabase
      .from('flow_measurements')
      .insert(formattedMeasurements);

    if (measError) throw measError;

    return { id: inspectionId, ...insData };
  } else {
    // ---- FLUXO OFFLINE (LOCAL STORAGE) ----
    const inspections = getLocalStorageItem(KEYS.INSPECTIONS, []);
    const allMeasurements = getLocalStorageItem(KEYS.MEASUREMENTS, []);

    let existingIndex = inspections.findIndex(i => i.id === inspection.id);
    const now = new Date().toISOString();

    let savedInspection = { ...inspection };

    if (existingIndex >= 0) {
      // Atualização
      savedInspection.updated_at = now;
      inspections[existingIndex] = savedInspection;
    } else {
      // Inserção
      if (!savedInspection.id) savedInspection.id = generateUUID();
      savedInspection.created_at = now;
      savedInspection.updated_at = now;
      inspections.push(savedInspection);
    }

    // Salvar Inspeções
    setLocalStorageItem(KEYS.INSPECTIONS, inspections);

    // Filtrar medições de outras inspeções e manter apenas as atuais
    const cleanMeasurements = allMeasurements.filter(m => m.inspection_id !== savedInspection.id);
    
    const newMeasurements = measurements.map(m => ({
      ...m,
      id: m.id || generateUUID(),
      inspection_id: savedInspection.id
    }));

    // Salvar todas as medições consolidadas
    setLocalStorageItem(KEYS.MEASUREMENTS, [...cleanMeasurements, ...newMeasurements]);

    return savedInspection;
  }
}

/**
 * Retorna todas as inspeções salvas (ordenadas por data decrescente)
 */
async function getInspections() {
  await delay(150);

  if (USE_SUPABASE) {
    const supabase = window.supabaseClient;
    if (!supabase) throw new Error("Cliente Supabase não inicializado!");

    const { data, error } = await supabase
      .from('flow_inspections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } else {
    // ---- FLUXO OFFLINE ----
    const inspections = getLocalStorageItem(KEYS.INSPECTIONS, []);
    return inspections.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

/**
 * Obtém uma inspeção específica pelo seu ID (cabeçalho + medições)
 */
async function getInspectionById(id) {
  await delay(150);

  if (USE_SUPABASE) {
    const supabase = window.supabaseClient;
    if (!supabase) throw new Error("Cliente Supabase não inicializado!");

    // 1. Buscar cabeçalho
    const { data: inspection, error: insError } = await supabase
      .from('flow_inspections')
      .select('*')
      .eq('id', id)
      .single();

    if (insError) throw insError;

    // 2. Buscar medições dos bicos
    const { data: measurements, error: measError } = await supabase
      .from('flow_measurements')
      .select('*')
      .eq('inspection_id', id)
      .order('nozzle_number', { ascending: true });

    if (measError) throw measError;

    return { inspection, measurements };
  } else {
    // ---- FLUXO OFFLINE ----
    const inspections = getLocalStorageItem(KEYS.INSPECTIONS, []);
    const allMeasurements = getLocalStorageItem(KEYS.MEASUREMENTS, []);

    const inspection = inspections.find(i => i.id === id);
    if (!inspection) return null;

    const measurements = allMeasurements
      .filter(m => m.inspection_id === id)
      .sort((a, b) => a.nozzle_number - b.nozzle_number);

    return { inspection, measurements };
  }
}

/**
 * Deleta uma inspeção e suas medições associadas
 */
async function deleteInspection(id) {
  await delay(200);

  if (USE_SUPABASE) {
    const supabase = window.supabaseClient;
    if (!supabase) throw new Error("Cliente Supabase não inicializado!");

    // Graças ao "on delete cascade" nas FKs do banco, ao deletar a inspeção principal
    // as medições correspondentes serão excluídas automaticamente
    const { error } = await supabase
      .from('flow_inspections')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } else {
    // ---- FLUXO OFFLINE ----
    const inspections = getLocalStorageItem(KEYS.INSPECTIONS, []);
    const allMeasurements = getLocalStorageItem(KEYS.MEASUREMENTS, []);

    const filteredInspections = inspections.filter(i => i.id !== id);
    const filteredMeasurements = allMeasurements.filter(m => m.inspection_id !== id);

    setLocalStorageItem(KEYS.INSPECTIONS, filteredInspections);
    setLocalStorageItem(KEYS.MEASUREMENTS, filteredMeasurements);

    return true;
  }
}

// ==========================================
// FUNÇÕES AUXILIARES DE SUPORTE (Com Fallback em Memória se localStorage estiver bloqueado)
// ==========================================

let isLocalStorageAvailable = false;
const memoryStorage = {};

try {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Fazer teste de gravação/leitura para confirmar disponibilidade real
    window.localStorage.setItem('__spray_test_ls__', '1');
    window.localStorage.removeItem('__spray_test_ls__');
    isLocalStorageAvailable = true;
  }
} catch (e) {
  console.warn("localStorage não está acessível ou está desativado pelo navegador. Usando fallback em memória (in-memory data store) para garantir execução.", e);
}

function getLocalStorageItem(key, defaultValue) {
  if (isLocalStorageAvailable) {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Erro ao ler chave ${key} do localStorage`, e);
    }
  }
  return memoryStorage[key] !== undefined ? memoryStorage[key] : defaultValue;
}

function setLocalStorageItem(key, value) {
  if (isLocalStorageAvailable) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return;
    } catch (e) {
      console.error(`Erro ao gravar chave ${key} no localStorage`, e);
    }
  }
  memoryStorage[key] = value;
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback antigo para ambientes limitados
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
