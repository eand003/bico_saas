/**
 * Biblioteca Hidráulica e Catálogo ISO da Spray Precision
 * Lógica matemática pura para diagnóstico de vazão bico a bico
 */

// Catálogo de bicos padrão ISO (vazão nominal em L/min a 3.0 BAR e cores padrão)
const ISO_NOZZLES = [
  { code: '01', color: '#FFB347', label: '01 - Laranja', flow3bar: 0.40 },
  { code: '015', color: '#38EF7D', label: '015 - Verde', flow3bar: 0.60 },
  { code: '02', color: '#F1C40F', label: '02 - Amarelo', flow3bar: 0.80 },
  { code: '025', color: '#C39BD3', label: '025 - Roxo', flow3bar: 1.00 },
  { code: '03', color: '#2980B9', label: '03 - Azul', flow3bar: 1.20 },
  { code: '04', color: '#E74C3C', label: '04 - Vermelho', flow3bar: 1.60 },
  { code: '05', color: '#8E5A2F', label: '05 - Marrom', flow3bar: 2.00 },
  { code: '06', color: '#95A5A6', label: '06 - Cinza', flow3bar: 2.40 },
  { code: '08', color: '#FFFFFF', label: '08 - Branco', flow3bar: 3.20 },
  { code: '10', color: '#3498DB', label: '10 - Azul Claro', flow3bar: 4.00 }
];

/**
 * Converte pressão de PSI para BAR
 */
function psiToBar(psi) {
  return psi / 14.5038;
}

/**
 * Converte pressão de BAR para PSI
 */
function barToPsi(bar) {
  return bar * 14.5038;
}

/**
 * Calcula a vazão teórica de um bico ISO com base na pressão (Lei da Afinidade Hidráulica)
 * Q1 / Q2 = sqrt(P1 / P2) -> Q_pressao = Q_3bar * sqrt(pressao / 3.0)
 */
function calculateExpectedFlowByISO(flow3bar, pressureValue, pressureUnit = 'bar') {
  if (!flow3bar || !pressureValue) return 0;
  
  // Garantir pressão em BAR para a fórmula
  const pressureBar = pressureUnit === 'psi' ? psiToBar(pressureValue) : pressureValue;
  
  if (pressureBar <= 0) return 0;
  
  return flow3bar * Math.sqrt(pressureBar / 3.0);
}

/**
 * Calcula a vazão medida em L/min com base no volume coletado em mL e o tempo em segundos
 * vazao_l_min = (volume_ml / 1000) / (tempo_segundos / 60)
 */
function calculateMeasuredFlowLMin(volumeMl, timeSeconds) {
  if (!volumeMl || !timeSeconds || timeSeconds <= 0) return 0;
  return (volumeMl / 1000.0) / (timeSeconds / 60.0);
}

/**
 * Calcula a vazão esperada em L/min com base nos parâmetros da aplicação
 * vazao_esperada_l_min = (volume_alvo_l_ha * velocidade_km_h * espacamento_bicos_m) / 600
 */
function calculateExpectedFlowLMin(targetRateLHa, speedKmh, nozzleSpacingM) {
  if (!targetRateLHa || !speedKmh || !nozzleSpacingM) return 0;
  return (targetRateLHa * speedKmh * nozzleSpacingM) / 600.0;
}

/**
 * Calcula o desvio percentual da vazão medida em relação à vazão esperada
 * desvio = ((vazao_medida - vazao_esperada) / vazao_esperada) * 100
 */
function calculateDeviationPercent(measuredFlowLMin, expectedFlowLMin) {
  if (!expectedFlowLMin || expectedFlowLMin <= 0) return 0;
  return ((measuredFlowLMin - expectedFlowLMin) / expectedFlowLMin) * 100.0;
}

/**
 * Calcula a taxa real aplicada por um bico em L/ha
 * taxa_real_l_ha = (vazao_medida_l_min * 600) / (velocidade_km_h * espacamento_bicos_m)
 */
function calculateActualRateLHa(measuredFlowLMin, speedKmh, nozzleSpacingM) {
  if (!measuredFlowLMin || !speedKmh || !nozzleSpacingM) return 0;
  return (measuredFlowLMin * 600.0) / (speedKmh * nozzleSpacingM);
}

/**
 * Classifica a condição de um bico com base no desvio percentual e tolerância configurada
 */
function classifyNozzle(deviationPercent, tolerancePercent = 10) {
  if (deviationPercent === null || deviationPercent === undefined || isNaN(deviationPercent)) {
    return 'nao_avaliado';
  }
  
  const dev = parseFloat(deviationPercent);
  const tol = parseFloat(tolerancePercent);
  
  if (dev >= -tol && dev <= tol) {
    return 'ok';
  } else if (dev < -tol && dev >= -2 * tol) {
    return 'abaixo';
  } else if (dev < -2 * tol) {
    return 'critico_abaixo';
  } else if (dev > tol && dev <= 2 * tol) {
    return 'acima';
  } else {
    return 'critico_acima';
  }
}

/**
 * Retorna a recomendação técnica e ação sugerida com base no status do bico
 */
function getNozzleRecommendation(status, nozzleNumber) {
  switch (status) {
    case 'ok':
      return {
        diagnostic: 'Ponta operando em perfeitas condições hidráulicas.',
        action: 'Manter ponta e acompanhar desgaste periódico.'
      };
    case 'abaixo':
      return {
        diagnostic: 'Vazão ligeiramente abaixo da tolerância. Possível acúmulo de resíduos, filtro obstruído ou início de entupimento.',
        action: 'Parar e realizar limpeza física da ponta com escova apropriada e limpar o filtro individual do porta-bico.'
      };
    case 'critico_abaixo':
      return {
        diagnostic: 'Restrição severa de vazão. Entupimento grave, obstrução de linha ou bico inadequado para a seção.',
        action: '⚠️ Substituir ou efetuar desobstrução urgente da ponta e verificar vazão da linha da seção.'
      };
    case 'acima':
      return {
        diagnostic: 'Vazão acima da tolerância. Indica desgaste mecânico da ponta (orifício alargado) ou pressão local excessiva.',
        action: 'Substituir a ponta por uma nova. Pontas desgastadas causam sobredosagem e gotas desuniformes.'
      };
    case 'critico_acima':
      return {
        diagnostic: 'Desgaste severo do orifício da ponta ou ponta montada com vazão nominal incorreta (trocada na barra).',
        action: '⚠️ Substituir imediatamente a ponta. Risco crítico de desperdício severo de defensivo e fitotoxicidade.'
      };
    case 'nao_avaliado':
    default:
      return {
        diagnostic: 'Aferição não realizada ou bico marcado como inativo/pulado.',
        action: 'Recomenda-se realizar a coleta deste bico para um diagnóstico completo da barra.'
      };
  }
}

/**
 * Calcula estatísticas gerais da barra de pulverização
 */
function calculateBarSummary(measurements, expectedFlowLMin, speedKmh, nozzleSpacingM, tolerancePercent, totalNozzles) {
  const evaluated = measurements.filter(m => m.status !== 'nao_avaliado');
  const evaluatedCount = evaluated.length;
  
  if (evaluatedCount === 0) {
    return {
      totalNozzles,
      evaluatedNozzles: 0,
      okCount: 0,
      belowCount: 0,
      criticalBelowCount: 0,
      aboveCount: 0,
      criticalAboveCount: 0,
      notEvaluatedCount: totalNozzles,
      averageFlowLMin: 0,
      expectedFlowLMin,
      averageDeviationPercent: 0,
      averageActualRateLHa: 0,
      coefficientOfVariationPercent: 0,
      maxPositiveDeviationPercent: 0,
      maxNegativeDeviationPercent: 0,
      generalClassification: 'reprovado'
    };
  }

  let okCount = 0;
  let belowCount = 0;
  let criticalBelowCount = 0;
  let aboveCount = 0;
  let criticalAboveCount = 0;
  
  let sumFlow = 0;
  let sumDeviation = 0;
  let sumRate = 0;
  
  let maxPosDev = -999;
  let maxNegDev = 999;
  
  const flows = [];

  evaluated.forEach(m => {
    flows.push(m.measured_flow_l_min);
    sumFlow += m.measured_flow_l_min;
    sumDeviation += m.deviation_percent;
    
    // Taxa real
    const rate = calculateActualRateLHa(m.measured_flow_l_min, speedKmh, nozzleSpacingM);
    sumRate += rate;
    
    if (m.deviation_percent > maxPosDev) maxPosDev = m.deviation_percent;
    if (m.deviation_percent < maxNegDev) maxNegDev = m.deviation_percent;
    
    // Contagem de status
    switch (m.status) {
      case 'ok': okCount++; break;
      case 'abaixo': belowCount++; break;
      case 'critico_abaixo': criticalBelowCount++; break;
      case 'acima': aboveCount++; break;
      case 'critico_acima': criticalAboveCount++; break;
    }
  });

  const averageFlow = sumFlow / evaluatedCount;
  const averageDeviation = sumDeviation / evaluatedCount;
  const averageRate = sumRate / evaluatedCount;
  
  // Cálculo do Desvio Padrão Amostral das Vazões (N - 1)
  let stdDevFlow = 0;
  if (evaluatedCount > 1) {
    const variance = flows.reduce((acc, f) => acc + Math.pow(f - averageFlow, 2), 0) / (evaluatedCount - 1);
    stdDevFlow = Math.sqrt(variance);
  }
  
  // Coeficiente de Variação da Barra (CV%)
  const cv = averageFlow > 0 ? (stdDevFlow / averageFlow) * 100 : 0;
  
  // Classificação Geral
  // Aprovado: >= 90% dos bicos OK e CV <= 10%
  // Aprovado com Ressalvas: 75% a 89% dos bicos OK ou CV entre 10% e 15%
  // Reprovado: < 75% dos bicos OK ou CV > 15%
  const okPercent = (okCount / evaluatedCount) * 100;
  let generalClassification = 'reprovado';
  
  if (okPercent >= 90 && cv <= 10) {
    generalClassification = 'aprovado';
  } else if (okPercent >= 75 || (cv > 10 && cv <= 15)) {
    generalClassification = 'aprovado_com_ressalvas';
  } else {
    generalClassification = 'reprovado';
  }

  return {
    totalNozzles,
    evaluatedNozzles: evaluatedCount,
    okCount,
    belowCount,
    criticalBelowCount,
    aboveCount,
    criticalAboveCount,
    notEvaluatedCount: totalNozzles - evaluatedCount,
    averageFlowLMin: averageFlow,
    expectedFlowLMin,
    averageDeviationPercent: averageDeviation,
    averageActualRateLHa: averageRate,
    coefficientOfVariationPercent: cv,
    maxPositiveDeviationPercent: maxPosDev === -999 ? 0 : maxPosDev,
    maxNegativeDeviationPercent: maxNegDev === 999 ? 0 : maxNegDev,
    generalClassification
  };
}

/**
 * Simula o impacto financeiro estimado da aplicação com bicos descalibrados
 * Baseia-se no desvio individual de cada bico
 */
function simulateFinancialLoss(measurements, targetRateLHa, speedKmh, nozzleSpacingM, costCaldaLha, areaHa, valorSafraHa = 3000, perdaSafraPercent = 10) {
  if (!measurements || measurements.length === 0 || !costCaldaLha || !areaHa) {
    return { wastedCost: 0, efficiencyLossRiskCost: 0, totalLoss: 0 };
  }

  const evaluated = measurements.filter(m => m.status !== 'nao_avaliado');
  if (evaluated.length === 0) return { wastedCost: 0, efficiencyLossRiskCost: 0, totalLoss: 0 };

  let totalWastedVolumePercent = 0; // Desperdício puro (bicos aplicando acima do alvo)
  let totalUnderappliedPercent = 0; // Sobra/defasagem (bicos aplicando abaixo, gerando falha de dose)
  
  evaluated.forEach(m => {
    if (m.deviation_percent > 10) { // Tolerância padrão ou custom
      // Bicos aplicando acima geram desperdício linear de produto químico
      totalWastedVolumePercent += (m.deviation_percent - 10) / 100; 
    } else if (m.deviation_percent < -10) {
      // Bicos aplicando abaixo criam faixas com dose insuficiente, arriscando controle químico ineficaz
      totalUnderappliedPercent += Math.abs(m.deviation_percent + 10) / 100;
    }
  });

  // Dividir pelo total de bicos físicos da barra (measurements.length) para ter o impacto ponderado real na máquina
  const totalNozzlesPhysical = measurements.length || evaluated.length || 60;
  const avgWastedFactor = totalWastedVolumePercent / totalNozzlesPhysical;
  const avgUnderappliedFactor = totalUnderappliedPercent / totalNozzlesPhysical;

  // 1. Custo do Desperdício Direto (Defensivos jogados fora por sobre-aplicação)
  const wastedCost = avgWastedFactor * costCaldaLha * areaHa;

  // 2. Custo do Risco de Quebra de Eficácia (Subdosagem)
  // Perda potencial por escape de pragas na faixa sub-dosada baseada no valor da safra e perda percentual
  const efficiencyLossRiskCost = avgUnderappliedFactor * (valorSafraHa * (perdaSafraPercent / 100)) * areaHa;

  const totalLoss = wastedCost + efficiencyLossRiskCost;

  return {
    wastedCost: Math.max(0, wastedCost),
    efficiencyLossRiskCost: Math.max(0, efficiencyLossRiskCost),
    totalLoss: Math.max(0, totalLoss)
  };
}
