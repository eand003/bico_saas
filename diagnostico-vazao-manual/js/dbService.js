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

// ==========================================
// MOCK DIAGNÓSTICOS DE DEMONSTRAÇÃO COMERCIAIS
// ==========================================
const STATIC_DEMO_INSPECTIONS = {
  'demo-aprovado': {
    inspection: {
      id: 'demo-aprovado',
      client_name: 'Fazenda Progresso',
      farm_name: 'Fazenda Progresso (Aprovado)',
      city: 'Sorriso',
      state: 'MT',
      field_name: 'Talhão 04',
      crop: 'Soja',
      operation_type: 'fungicida',
      sprayer_brand: 'John Deere',
      sprayer_model: 'M4030',
      sprayer_type: 'autopropelido',
      boom_width_m: 30,
      total_nozzles: 10,
      nozzle_spacing_m: 0.5,
      pressure_value: 3.0,
      pressure_unit: 'bar',
      speed_kmh: 16.0,
      target_rate_l_ha: 100,
      nozzle_model: 'MGA ISO 03 Azul',
      expected_flow_l_min: 1.20,
      tolerance_percent: 10,
      collection_time_seconds: 30,
      created_at: new Date().toISOString(),
      summary: {
        totalNozzles: 10,
        evaluatedNozzles: 10,
        okCount: 10,
        belowCount: 0,
        criticalBelowCount: 0,
        aboveCount: 0,
        criticalAboveCount: 0,
        notEvaluatedCount: 0,
        averageFlowLMin: 1.205,
        expectedFlowLMin: 1.20,
        averageDeviationPercent: 0.4,
        averageActualRateLHa: 100.4,
        coefficientOfVariationPercent: 2.1,
        generalClassification: 'aprovado'
      },
      notes: "Inspeção de Demonstração Geral.\nInspetor: Consultor Técnico (Spray Precision)"
    },
    measurements: [
      { nozzle_number: 1, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 602, collection_time_seconds: 30, measured_flow_l_min: 1.204, expected_flow_l_min: 1.20, deviation_percent: 0.3, actual_rate_l_ha: 100.3, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' },
      { nozzle_number: 2, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 598, collection_time_seconds: 30, measured_flow_l_min: 1.196, expected_flow_l_min: 1.20, deviation_percent: -0.3, actual_rate_l_ha: 99.7, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' },
      { nozzle_number: 3, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 605, collection_time_seconds: 30, measured_flow_l_min: 1.21, expected_flow_l_min: 1.20, deviation_percent: 0.8, actual_rate_l_ha: 100.8, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' },
      { nozzle_number: 4, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 600, collection_time_seconds: 30, measured_flow_l_min: 1.20, expected_flow_l_min: 1.20, deviation_percent: 0.0, actual_rate_l_ha: 100.0, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' },
      { nozzle_number: 5, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 604, collection_time_seconds: 30, measured_flow_l_min: 1.208, expected_flow_l_min: 1.20, deviation_percent: 0.7, actual_rate_l_ha: 100.7, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' },
      { nozzle_number: 6, section_number: 2, boom_side: 'direito', collected_volume_ml: 595, collection_time_seconds: 30, measured_flow_l_min: 1.19, expected_flow_l_min: 1.20, deviation_percent: -0.8, actual_rate_l_ha: 99.2, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' },
      { nozzle_number: 7, section_number: 2, boom_side: 'direito', collected_volume_ml: 601, collection_time_seconds: 30, measured_flow_l_min: 1.202, expected_flow_l_min: 1.20, deviation_percent: 0.2, actual_rate_l_ha: 100.2, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' },
      { nozzle_number: 8, section_number: 2, boom_side: 'direito', collected_volume_ml: 608, collection_time_seconds: 30, measured_flow_l_min: 1.216, expected_flow_l_min: 1.20, deviation_percent: 1.3, actual_rate_l_ha: 101.3, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' },
      { nozzle_number: 9, section_number: 2, boom_side: 'direito', collected_volume_ml: 597, collection_time_seconds: 30, measured_flow_l_min: 1.194, expected_flow_l_min: 1.20, deviation_percent: -0.5, actual_rate_l_ha: 99.5, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' },
      { nozzle_number: 10, section_number: 2, boom_side: 'direito', collected_volume_ml: 600, collection_time_seconds: 30, measured_flow_l_min: 1.20, expected_flow_l_min: 1.20, deviation_percent: 0.0, actual_rate_l_ha: 100.0, status: 'ok', recommendation: 'Manter ponta e acompanhar desgaste periódico.', notes: 'Ponta operando em perfeitas condições hidráulicas.' }
    ]
  },
  'demo-ressalvas': {
    inspection: {
      id: 'demo-ressalvas',
      client_name: 'Fazenda Boa Vista',
      farm_name: 'Fazenda Boa Vista (Ressalvas)',
      city: 'Lucas do Rio Verde',
      state: 'MT',
      field_name: 'Talhão Sede',
      crop: 'Milho',
      operation_type: 'inseticida',
      sprayer_brand: 'Jacto',
      sprayer_model: 'Uniport 3030',
      sprayer_type: 'autopropelido',
      boom_width_m: 30,
      total_nozzles: 10,
      nozzle_spacing_m: 0.5,
      pressure_value: 3.0,
      pressure_unit: 'bar',
      speed_kmh: 16.0,
      target_rate_l_ha: 100,
      nozzle_model: 'MGA ISO 03 Azul',
      expected_flow_l_min: 1.20,
      tolerance_percent: 10,
      collection_time_seconds: 30,
      created_at: new Date().toISOString(),
      summary: {
        totalNozzles: 10,
        evaluatedNozzles: 10,
        okCount: 8,
        belowCount: 1,
        criticalBelowCount: 0,
        aboveCount: 1,
        criticalAboveCount: 0,
        notEvaluatedCount: 0,
        averageFlowLMin: 1.21,
        expectedFlowLMin: 1.20,
        averageDeviationPercent: 0.83,
        averageActualRateLHa: 100.8,
        coefficientOfVariationPercent: 11.2,
        generalClassification: 'aprovado_com_ressalvas'
      },
      notes: "Inspeção de Demonstração Geral.\nInspetor: Consultor Técnico (Spray Precision)"
    },
    measurements: [
      { nozzle_number: 1, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 602, collection_time_seconds: 30, measured_flow_l_min: 1.204, expected_flow_l_min: 1.20, deviation_percent: 0.3, actual_rate_l_ha: 100.3, status: 'ok', recommendation: 'Manter bico e acompanhar.', notes: 'Operando normalmente.' },
      { nozzle_number: 2, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 598, collection_time_seconds: 30, measured_flow_l_min: 1.196, expected_flow_l_min: 1.20, deviation_percent: -0.3, actual_rate_l_ha: 99.7, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 3, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 520, collection_time_seconds: 30, measured_flow_l_min: 1.04, expected_flow_l_min: 1.20, deviation_percent: -13.3, actual_rate_l_ha: 86.7, status: 'abaixo', recommendation: 'Limpar filtro individual do bico e remover incrustações.', notes: 'Vazão ligeiramente abaixo da tolerância.' },
      { nozzle_number: 4, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 600, collection_time_seconds: 30, measured_flow_l_min: 1.20, expected_flow_l_min: 1.20, deviation_percent: 0.0, actual_rate_l_ha: 100.0, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 5, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 604, collection_time_seconds: 30, measured_flow_l_min: 1.208, expected_flow_l_min: 1.20, deviation_percent: 0.7, actual_rate_l_ha: 100.7, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 6, section_number: 2, boom_side: 'direito', collected_volume_ml: 595, collection_time_seconds: 30, measured_flow_l_min: 1.19, expected_flow_l_min: 1.20, deviation_percent: -0.8, actual_rate_l_ha: 99.2, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 7, section_number: 2, boom_side: 'direito', collected_volume_ml: 601, collection_time_seconds: 30, measured_flow_l_min: 1.202, expected_flow_l_min: 1.20, deviation_percent: 0.2, actual_rate_l_ha: 100.2, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 8, section_number: 2, boom_side: 'direito', collected_volume_ml: 700, collection_time_seconds: 30, measured_flow_l_min: 1.40, expected_flow_l_min: 1.20, deviation_percent: 16.7, actual_rate_l_ha: 116.7, status: 'acima', recommendation: 'Substituir ponta. Desgaste físico orifício alargado.', notes: 'Vazão acima da tolerância.' },
      { nozzle_number: 9, section_number: 2, boom_side: 'direito', collected_volume_ml: 597, collection_time_seconds: 30, measured_flow_l_min: 1.194, expected_flow_l_min: 1.20, deviation_percent: -0.5, actual_rate_l_ha: 99.5, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 10, section_number: 2, boom_side: 'direito', collected_volume_ml: 600, collection_time_seconds: 30, measured_flow_l_min: 1.20, expected_flow_l_min: 1.20, deviation_percent: 0.0, actual_rate_l_ha: 100.0, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' }
    ]
  },
  'demo-reprovado': {
    inspection: {
      id: 'demo-reprovado',
      client_name: 'Fazenda Santo Antônio',
      farm_name: 'Fazenda Santo Antônio (Reprovado)',
      city: 'Sorriso',
      state: 'MT',
      field_name: 'Talhão Secão',
      crop: 'Algodão',
      operation_type: 'herbicida',
      sprayer_brand: 'Case IH',
      sprayer_model: 'Patriot 350',
      sprayer_type: 'autopropelido',
      boom_width_m: 30,
      total_nozzles: 10,
      nozzle_spacing_m: 0.5,
      pressure_value: 3.0,
      pressure_unit: 'bar',
      speed_kmh: 16.0,
      target_rate_l_ha: 100,
      nozzle_model: 'MGA ISO 03 Azul',
      expected_flow_l_min: 1.20,
      tolerance_percent: 10,
      collection_time_seconds: 30,
      created_at: new Date().toISOString(),
      summary: {
        totalNozzles: 10,
        evaluatedNozzles: 10,
        okCount: 5,
        belowCount: 2,
        criticalBelowCount: 1,
        aboveCount: 1,
        criticalAboveCount: 1,
        notEvaluatedCount: 0,
        averageFlowLMin: 1.15,
        expectedFlowLMin: 1.20,
        averageDeviationPercent: -4.16,
        averageActualRateLHa: 95.8,
        coefficientOfVariationPercent: 28.4,
        generalClassification: 'reprovado'
      },
      notes: "⚠️ Calibração Reprovada. Desuniformidade severa na barra (CV% muito alto) e múltiplos bicos com obstrução/desgaste crítico.\nInspetor: Consultor Técnico (Spray Precision)"
    },
    measurements: [
      { nozzle_number: 1, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 602, collection_time_seconds: 30, measured_flow_l_min: 1.204, expected_flow_l_min: 1.20, deviation_percent: 0.3, actual_rate_l_ha: 100.3, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 2, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 320, collection_time_seconds: 30, measured_flow_l_min: 0.64, expected_flow_l_min: 1.20, deviation_percent: -46.7, actual_rate_l_ha: 53.3, status: 'critico_abaixo', recommendation: '⚠️ Substituir ou efetuar desobstrução urgente da ponta.', notes: 'Restrição severa de vazão. Entupimento grave.' },
      { nozzle_number: 3, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 530, collection_time_seconds: 30, measured_flow_l_min: 1.06, expected_flow_l_min: 1.20, deviation_percent: -11.7, actual_rate_l_ha: 88.3, status: 'abaixo', recommendation: 'Limpar filtro individual e bico.', notes: 'Vazão ligeiramente abaixo da tolerância.' },
      { nozzle_number: 4, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 600, collection_time_seconds: 30, measured_flow_l_min: 1.20, expected_flow_l_min: 1.20, deviation_percent: 0.0, actual_rate_l_ha: 100.0, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 5, section_number: 1, boom_side: 'esquerdo', collected_volume_ml: 604, collection_time_seconds: 30, measured_flow_l_min: 1.208, expected_flow_l_min: 1.20, deviation_percent: 0.7, actual_rate_l_ha: 100.7, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 6, section_number: 2, boom_side: 'direito', collected_volume_ml: 595, collection_time_seconds: 30, measured_flow_l_min: 1.19, expected_flow_l_min: 1.20, deviation_percent: -0.8, actual_rate_l_ha: 99.2, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' },
      { nozzle_number: 7, section_number: 2, boom_side: 'direito', collected_volume_ml: 515, collection_time_seconds: 30, measured_flow_l_min: 1.03, expected_flow_l_min: 1.20, deviation_percent: -14.2, actual_rate_l_ha: 85.8, status: 'abaixo', recommendation: 'Limpar bico e filtro.', notes: 'Vazão abaixo da tolerância.' },
      { nozzle_number: 8, section_number: 2, boom_side: 'direito', collected_volume_ml: 710, collection_time_seconds: 30, measured_flow_l_min: 1.42, expected_flow_l_min: 1.20, deviation_percent: 18.3, actual_rate_l_ha: 118.3, status: 'acima', recommendation: 'Substituir ponta desgastada.', notes: 'Vazão acima da tolerância.' },
      { nozzle_number: 9, section_number: 2, boom_side: 'direito', collected_volume_ml: 960, collection_time_seconds: 30, measured_flow_l_min: 1.92, expected_flow_l_min: 1.20, deviation_percent: 60.0, actual_rate_l_ha: 160.0, status: 'critico_acima', recommendation: '⚠️ Substituir imediatamente a ponta. Risco crítico de desperdício severo.', notes: 'Desgaste severo do orifício da ponta.' },
      { nozzle_number: 10, section_number: 2, boom_side: 'direito', collected_volume_ml: 600, collection_time_seconds: 30, measured_flow_l_min: 1.20, expected_flow_l_min: 1.20, deviation_percent: 0.0, actual_rate_l_ha: 100.0, status: 'ok', recommendation: 'Manter bico.', notes: 'Operando normalmente.' }
    ]
  }
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

  const demoHeaders = [
    {
      id: 'demo-aprovado',
      client_name: '🚀 DEMO - Fazenda Progresso',
      farm_name: 'Fazenda Progresso (Aprovado)',
      city: 'Sorriso',
      state: 'MT',
      sprayer_brand: 'John Deere',
      sprayer_model: 'M4030',
      nozzle_model: 'MGA ISO 03 Azul',
      created_at: new Date().toISOString(),
      summary: {
        totalNozzles: 10,
        evaluatedNozzles: 10,
        okCount: 10,
        coefficientOfVariationPercent: 2.1,
        generalClassification: 'aprovado'
      },
      is_demo: true
    },
    {
      id: 'demo-ressalvas',
      client_name: '💡 DEMO - Fazenda Boa Vista',
      farm_name: 'Fazenda Boa Vista (Ressalvas)',
      city: 'Lucas do Rio Verde',
      state: 'MT',
      sprayer_brand: 'Jacto',
      sprayer_model: 'Uniport 3030',
      nozzle_model: 'MGA ISO 03 Azul',
      created_at: new Date().toISOString(),
      summary: {
        totalNozzles: 10,
        evaluatedNozzles: 10,
        okCount: 8,
        coefficientOfVariationPercent: 11.2,
        generalClassification: 'aprovado_com_ressalvas'
      },
      is_demo: true
    },
    {
      id: 'demo-reprovado',
      client_name: '🔴 DEMO - Fazenda Santo Antônio',
      farm_name: 'Fazenda Santo Antônio (Reprovado)',
      city: 'Sorriso',
      state: 'MT',
      sprayer_brand: 'Case IH',
      sprayer_model: 'Patriot 350',
      nozzle_model: 'MGA ISO 03 Azul',
      created_at: new Date().toISOString(),
      summary: {
        totalNozzles: 10,
        evaluatedNozzles: 10,
        okCount: 5,
        coefficientOfVariationPercent: 28.4,
        generalClassification: 'reprovado'
      },
      is_demo: true
    }
  ];

  if (USE_SUPABASE) {
    try {
      const supabase = window.supabaseClient;
      if (!supabase) throw new Error("Cliente Supabase não inicializado!");

      // Tentar sincronizar inspeções offline pendentes de forma transparente
      try {
        await syncOfflineInspections();
      } catch (syncErr) {
        console.warn("Falha ao sincronizar inspeções offline pendentes:", syncErr);
      }

      const { data, error } = await supabase
        .from('flow_inspections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return [...demoHeaders, ...(data || [])];
    } catch (err) {
      console.warn("Falha ao buscar do Supabase (offline ou sem autenticação), recorrendo ao local:", err);
      // ---- FALLBACK OFFLINE SE O SUPABASE FALHAR OU ESTIVER SEM CONEXÃO ----
      const inspections = getLocalStorageItem(KEYS.INSPECTIONS, []);
      const sorted = inspections.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return [...demoHeaders, ...sorted];
    }
  } else {
    // ---- FLUXO OFFLINE ----
    const inspections = getLocalStorageItem(KEYS.INSPECTIONS, []);
    const sorted = inspections.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [...demoHeaders, ...sorted];
  }
}

/**
 * Obtém uma inspeção específica pelo seu ID (cabeçalho + medições)
 */
async function getInspectionById(id) {
  // Interceptar demos comerciais
  if (id === 'demo-aprovado' || id === 'demo-ressalvas' || id === 'demo-reprovado') {
    return STATIC_DEMO_INSPECTIONS[id];
  }

  await delay(150);

  if (USE_SUPABASE) {
    try {
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
    } catch (err) {
      console.warn("Falha ao buscar laudo do Supabase, recorrendo ao local:", err);
      // ---- FALLBACK OFFLINE ----
      const inspections = getLocalStorageItem(KEYS.INSPECTIONS, []);
      const allMeasurements = getLocalStorageItem(KEYS.MEASUREMENTS, []);

      const inspection = inspections.find(i => i.id === id);
      if (!inspection) return null;

      const measurements = allMeasurements
        .filter(m => m.inspection_id === id)
        .sort((a, b) => a.nozzle_number - b.nozzle_number);

      return { inspection, measurements };
    }
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
    try {
      const supabase = window.supabaseClient;
      if (!supabase) throw new Error("Cliente Supabase não inicializado!");

      // Graças ao "on delete cascade" nas FKs do banco, ao deletar a inspeção principal
      // as medições correspondentes serão excluídas automaticamente
      const { error } = await supabase
        .from('flow_inspections')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.warn("Falha ao deletar do Supabase, tentando deletar localmente:", e);
    }
    // Deletar também localmente por segurança (limpa se for local ou cache)
    const inspections = getLocalStorageItem(KEYS.INSPECTIONS, []);
    const allMeasurements = getLocalStorageItem(KEYS.MEASUREMENTS, []);

    const filteredInspections = inspections.filter(i => i.id !== id);
    const filteredMeasurements = allMeasurements.filter(m => m.inspection_id !== id);

    setLocalStorageItem(KEYS.INSPECTIONS, filteredInspections);
    setLocalStorageItem(KEYS.MEASUREMENTS, filteredMeasurements);

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

/**
 * Sincroniza laudos de calibração salvos offline (localStorage) com o banco de dados do Supabase
 */
async function syncOfflineInspections() {
  const supabase = window.supabaseClient;
  if (!supabase) return;

  // Verificar se há usuário logado e autenticado no Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return; // Sem usuário online autenticado, não inicia sincronização
  }

  const inspections = getLocalStorageItem(KEYS.INSPECTIONS, []);
  if (inspections.length === 0) return;

  // Filtrar apenas laudos que não sejam demonstração estática
  const offlineInspections = inspections.filter(i => i.id && !i.id.startsWith('demo-'));
  if (offlineInspections.length === 0) return;

  console.log(`[Sync] Detectado(s) ${offlineInspections.length} laudo(s) offline pendente(s). Sincronizando...`);

  const allMeasurements = getLocalStorageItem(KEYS.MEASUREMENTS, []);
  const remainingInspections = [...inspections];
  let remainingMeasurements = [...allMeasurements];

  let syncedCount = 0;

  for (const inspection of offlineInspections) {
    try {
      const measurements = allMeasurements.filter(m => m.inspection_id === inspection.id);

      // Vincular o laudo ao usuário logado atual
      const inspectionToUpload = {
        ...inspection,
        owner_id: user.id,
        updated_at: new Date().toISOString()
      };

      // 1. Enviar cabeçalho (flow_inspections)
      const { data: insData, error: insError } = await supabase
        .from('flow_inspections')
        .upsert(inspectionToUpload)
        .select()
        .single();

      if (insError) throw insError;
      const inspectionId = insData.id;

      // 2. Enviar medições dos bicos (flow_measurements)
      const formattedMeasurements = measurements.map(m => ({
        ...m,
        inspection_id: inspectionId
      }));

      // Limpar medições anteriores localmente para evitar duplicidades
      await supabase
        .from('flow_measurements')
        .delete()
        .eq('inspection_id', inspectionId);

      if (formattedMeasurements.length > 0) {
        const { error: measError } = await supabase
          .from('flow_measurements')
          .insert(formattedMeasurements);

        if (measError) throw measError;
      }

      // Sucesso na sincronização deste laudo! Remover do array local
      const idx = remainingInspections.findIndex(i => i.id === inspection.id);
      if (idx >= 0) remainingInspections.splice(idx, 1);

      remainingMeasurements = remainingMeasurements.filter(m => m.inspection_id !== inspection.id);
      syncedCount++;

      console.log(`[Sync] Laudo offline com ID ${inspectionId} sincronizado com a nuvem com sucesso.`);
    } catch (err) {
      console.error(`[Sync] Falha ao sincronizar laudo ${inspection.id}:`, err);
    }
  }

  // Gravar estados limpos no localStorage (restará apenas as demos e os que eventualmente falharam)
  setLocalStorageItem(KEYS.INSPECTIONS, remainingInspections);
  setLocalStorageItem(KEYS.MEASUREMENTS, remainingMeasurements);

  if (syncedCount > 0) {
    const msg = typeof window.t === 'function'
      ? window.t("Oba! Sincronização concluída: seus diagnósticos salvos offline foram enviados para a nuvem!")
      : "Oba! Sincronização concluída: seus diagnósticos salvos offline foram enviados para a nuvem!";
    alert(msg);
  }
}

window.syncOfflineInspections = syncOfflineInspections;
