# Projeto — Diagnóstico Manual de Vazão por Bico  
## Módulo para o projeto `bico_saas` | Spray Precision

> **Objetivo deste Markdown:** servir como briefing técnico para o AntiGravity criar um novo módulo dentro do projeto existente `bico_saas`, sem quebrar a calculadora atual de vazão de bico, reaproveitando autenticação, Supabase, Vercel e estrutura existente.

---

# 1. Visão geral do projeto

A ideia é criar um módulo de **diagnóstico manual de vazão por bico**, onde o usuário coleta a vazão de cada ponta usando o método tradicional com **proveta/copo graduado**, durante um tempo definido pelo usuário, por exemplo:

- 30 segundos por bico;
- 60 segundos por bico;
- tempo personalizado.

Depois da coleta, o sistema calcula a vazão real de cada bico, compara com a vazão esperada/teórica, classifica cada ponta e gera um **relatório técnico-comercial semelhante em lógica ao diagnóstico de equipamentos como o Fluxin**, mas usando método manual e identidade própria da Spray Precision.

Importante: este projeto **não deve copiar nome, identidade visual, layout, fluxo patenteado, textos comerciais ou marca de terceiros**. A proposta é criar um sistema próprio de diagnóstico, baseado em fundamentos técnicos de tecnologia de aplicação.

---

# 2. Nome sugerido do módulo

Sugestões:

1. `diagnostico-vazao-manual`
2. `auditoria-vazao-bicos`
3. `spray-diagnostico-vazao`
4. `relatorio-vazao-manual`

Minha sugestão principal:

```txt
diagnostico-vazao-manual
```

Nome de interface para o usuário:

```txt
Diagnóstico de Vazão Manual
```

Subtítulo:

```txt
Aferição bico a bico com proveta, cálculo automático de desvio e relatório técnico.
```

---

# 3. Sugestão de estrutura de pastas

Antes de criar qualquer coisa, o AntiGravity deve **inspecionar a estrutura atual do projeto**.

## 3.1. Se o projeto usa Next.js com App Router

Criar:

```txt
bico_saas/
  app/
    diagnostico-vazao/
      page.tsx
      novo/
        page.tsx
      [id]/
        page.tsx
        relatorio/
          page.tsx

  src/
    features/
      diagnostico-vazao/
        components/
        hooks/
        services/
        types/
        utils/
        __tests__/

  supabase/
    migrations/
      20260530_diagnostico_vazao_manual.sql

  docs/
    PROJETO_DIAGNOSTICO_VAZAO_MANUAL.md
```

## 3.2. Se o projeto usa React/Vite

Criar:

```txt
bico_saas/
  src/
    pages/
      DiagnosticoVazao/
        index.tsx
        NovoDiagnostico.tsx
        RelatorioDiagnostico.tsx

    features/
      diagnostico-vazao/
        components/
        hooks/
        services/
        types/
        utils/
        __tests__/

  supabase/
    migrations/
      20260530_diagnostico_vazao_manual.sql

  docs/
    PROJETO_DIAGNOSTICO_VAZAO_MANUAL.md
```

## 3.3. Regra importante

Não criar um novo app isolado dentro do repositório sem necessidade.

O módulo deve ser integrado ao projeto existente, reaproveitando:

- autenticação atual;
- layout atual;
- conexão Supabase atual;
- variáveis de ambiente já usadas;
- estilo visual já implementado;
- componentes existentes, quando houver.

---

# 4. Usuário-alvo

O sistema será usado por:

- consultor técnico da Spray Precision;
- representante/vendedor;
- operador treinado;
- produtor rural ou gerente agrícola;
- equipe de aplicação.

O uso esperado é em campo, muitas vezes pelo celular. Portanto, a interface precisa ser:

- mobile-first;
- rápida;
- simples;
- tolerante a erro;
- com botões grandes;
- com poucos campos obrigatórios por etapa;
- capaz de gerar relatório profissional ao final.

---

# 5. Fluxo principal do usuário

## 5.1. Tela inicial do módulo

A tela deve mostrar:

- botão **Novo Diagnóstico**;
- lista de diagnósticos anteriores;
- busca por cliente, fazenda, máquina ou data;
- status visual:
  - concluído;
  - em andamento;
  - necessita revisão;
  - arquivado.

Campos na listagem:

- data;
- cliente;
- propriedade;
- pulverizador;
- quantidade de bicos avaliados;
- percentual de bicos fora da tolerância;
- classificação geral;
- botão para abrir relatório.

---

## 5.2. Novo diagnóstico — Etapa 1: Identificação

Campos:

- Cliente;
- Fazenda/Propriedade;
- Município/UF;
- Talhão ou área, opcional;
- Cultura, opcional;
- Operação, opcional:
  - herbicida;
  - fungicida;
  - inseticida;
  - dessecação;
  - adubação foliar;
  - outro;
- Responsável pela aferição;
- Observações iniciais.

O sistema deve permitir selecionar cliente existente ou cadastrar rapidamente um novo.

---

## 5.3. Novo diagnóstico — Etapa 2: Pulverizador

Campos:

- Marca;
- Modelo;
- Ano, opcional;
- Tipo:
  - autopropelido;
  - arrasto;
  - barra hidráulica;
  - outro;
- Largura da barra, em metros;
- Número total de bicos;
- Espaçamento entre bicos:
  - 0,35 m;
  - 0,50 m;
  - personalizado;
- Número de seções, opcional;
- Pressão de trabalho:
  - bar;
  - psi;
- Velocidade operacional:
  - km/h;
- Volume alvo:
  - L/ha.

---

## 5.4. Novo diagnóstico — Etapa 3: Ponta/bico avaliado

Campos:

- Tipo de ponta:
  - leque;
  - cone;
  - indução de ar;
  - eletrostática;
  - outro;
- Modelo da ponta;
- Cor;
- Vazão nominal, se conhecida;
- Condição:
  - nova;
  - usada;
  - desconhecida;
- Tolerância de avaliação:
  - ±5%;
  - ±10%;
  - personalizada.

Regra prática:

- bico novo: sugerir ±5%;
- bico usado: sugerir ±10%;
- permitir personalização.

---

## 5.5. Novo diagnóstico — Etapa 4: Configuração da coleta

Campos:

- Tempo de coleta por bico:
  - 30 segundos;
  - 60 segundos;
  - personalizado;
- Unidade de entrada:
  - mL coletados;
  - L coletados;
- Modo de leitura:
  - bico a bico;
  - por seção;
  - importação manual em tabela.

Sugestão de interface:

- botão para iniciar cronômetro;
- campo para inserir volume coletado;
- botão **Salvar e próximo bico**;
- indicador do bico atual:
  - Bico 01 de 49;
- possibilidade de pular bico;
- possibilidade de marcar bico como:
  - entupido;
  - vazando;
  - sem leitura;
  - removido;
  - não avaliado.

---

## 5.6. Novo diagnóstico — Etapa 5: Coleta bico a bico

Para cada bico, o usuário informa:

- número do bico;
- seção, opcional;
- lado da barra, opcional:
  - esquerdo;
  - centro;
  - direito;
- volume coletado;
- observação, opcional.

O sistema calcula automaticamente:

- vazão medida em L/min;
- vazão esperada em L/min;
- desvio percentual;
- taxa real em L/ha;
- classificação;
- recomendação.

---

# 6. Fórmulas técnicas

## 6.1. Vazão medida

Quando o usuário informa o volume coletado em mL e o tempo em segundos:

```txt
vazao_medida_l_min = (volume_ml / 1000) / (tempo_segundos / 60)
```

Exemplo:

```txt
volume = 450 mL
tempo = 30 s

vazao = (450 / 1000) / (30 / 60)
vazao = 0,45 / 0,5
vazao = 0,90 L/min
```

---

## 6.2. Vazão esperada por bico

Fórmula clássica para pulverização em barra:

```txt
vazao_esperada_l_min = (volume_alvo_l_ha * velocidade_km_h * espacamento_bicos_m) / 600
```

Exemplo:

```txt
volume alvo = 80 L/ha
velocidade = 18 km/h
espaçamento = 0,50 m

vazao esperada = (80 * 18 * 0,50) / 600
vazao esperada = 720 / 600
vazao esperada = 1,20 L/min
```

---

## 6.3. Desvio percentual

```txt
desvio_percentual = ((vazao_medida_l_min - vazao_esperada_l_min) / vazao_esperada_l_min) * 100
```

Exemplo:

```txt
vazao medida = 0,90 L/min
vazao esperada = 1,20 L/min

desvio = ((0,90 - 1,20) / 1,20) * 100
desvio = -25%
```

---

## 6.4. Taxa real aplicada por bico

```txt
taxa_real_l_ha = (vazao_medida_l_min * 600) / (velocidade_km_h * espacamento_bicos_m)
```

Exemplo:

```txt
vazao medida = 0,90 L/min
velocidade = 18 km/h
espaçamento = 0,50 m

taxa real = (0,90 * 600) / (18 * 0,50)
taxa real = 540 / 9
taxa real = 60 L/ha
```

---

## 6.5. Coeficiente de variação da barra

```txt
cv_percentual = (desvio_padrao_vazoes / media_vazoes) * 100
```

Classificação sugerida:

| CV da barra | Interpretação |
|---:|---|
| 0% a 5% | Excelente uniformidade |
| 5,01% a 10% | Boa uniformidade |
| 10,01% a 15% | Atenção |
| Acima de 15% | Alta desuniformidade |

---

# 7. Critérios de classificação por bico

A classificação deve considerar a tolerância configurada pelo usuário.

Exemplo com tolerância de ±10%:

| Desvio | Status | Diagnóstico provável | Ação sugerida |
|---:|---|---|---|
| entre -10% e +10% | OK | Dentro da faixa | Manter |
| abaixo de -10% até -20% | Abaixo | Restrição parcial, filtro sujo, início de entupimento | Limpar, verificar filtro e porta-bico |
| abaixo de -20% | Crítico abaixo | Entupimento, restrição severa ou falha de alimentação | Parar e corrigir antes da aplicação |
| acima de +10% até +20% | Acima | Desgaste, ponta inadequada ou pressão divergente | Verificar pressão e considerar troca |
| acima de +20% | Crítico acima | Desgaste severo ou ponta fora do padrão | Trocar ponta e revisar conjunto |

Importante: o sistema deve deixar claro que o diagnóstico é **indicativo**, não substitui inspeção física do conjunto.

---

# 8. Diagnóstico geral da barra

O sistema deve gerar uma conclusão geral com base em:

- percentual de bicos dentro da tolerância;
- percentual de bicos abaixo;
- percentual de bicos acima;
- maior desvio positivo;
- maior desvio negativo;
- vazão média;
- CV da barra;
- taxa média real em L/ha;
- diferença média em relação ao alvo.

## 8.1. Classificação geral sugerida

| Condição | Classificação |
|---|---|
| 90% ou mais dos bicos OK e CV até 10% | Aprovado |
| 75% a 89% dos bicos OK ou CV entre 10% e 15% | Aprovado com ressalvas |
| Menos de 75% dos bicos OK ou CV acima de 15% | Reprovado / requer manutenção |

---

# 9. Estimativa de impacto operacional

O relatório deve trazer uma simulação simples de impacto.

Campos opcionais:

- área prevista da aplicação, em hectares;
- custo da calda por hectare;
- volume do tanque;
- capacidade operacional, opcional.

Cálculos sugeridos:

## 9.1. Diferença média de volume

```txt
diferenca_media_l_ha = taxa_real_media_l_ha - volume_alvo_l_ha
```

## 9.2. Excesso ou falta total estimada

```txt
impacto_total_litros = diferenca_media_l_ha * area_ha
```

## 9.3. Impacto financeiro estimado

```txt
impacto_financeiro = diferenca_media_l_ha_percentual * custo_calde_por_area
```

Melhor evitar promessas absolutas. Usar linguagem como:

```txt
Estimativa técnica baseada nos dados informados.
O impacto real depende da calda, produto, condição de campo, velocidade, pressão e uniformidade operacional.
```

---

# 10. Relatório final

O relatório deve ser gerado em formato visual, com opção de:

- imprimir;
- salvar em PDF pelo navegador;
- exportar CSV;
- exportar dados em JSON, opcional;
- futuramente exportar XLSX.

## 10.1. Estrutura do relatório

### Capa

- Logo Spray Precision, se existir no projeto;
- Título: Relatório de Diagnóstico de Vazão Manual;
- Cliente;
- Fazenda;
- Município/UF;
- Data;
- Responsável técnico.

### Resumo executivo

Exemplo de texto automático:

```txt
Foram avaliados 49 bicos do pulverizador, com tempo de coleta de 30 segundos por bico. 
A vazão esperada era de 1,20 L/min por bico, considerando 80 L/ha, 18 km/h e espaçamento de 0,50 m.
O diagnóstico identificou 38 bicos dentro da faixa de tolerância, 7 bicos abaixo e 4 bicos acima da vazão esperada.
A barra apresentou coeficiente de variação de 12,4%, indicando necessidade de correção antes da aplicação.
```

### Dados da aplicação

- Volume alvo;
- Velocidade;
- Espaçamento;
- Pressão;
- Ponta;
- Tempo de coleta;
- Tolerância adotada.

### Indicadores principais

Cards:

- bicos avaliados;
- bicos OK;
- bicos fora da tolerância;
- vazão média;
- taxa real média;
- CV da barra;
- maior desvio positivo;
- maior desvio negativo.

### Gráfico da barra

Criar gráfico de barras:

- eixo X: número do bico;
- eixo Y: vazão medida;
- linha horizontal: vazão esperada;
- faixa superior/inferior: tolerância;
- cores:
  - verde para OK;
  - amarelo para atenção;
  - vermelho para crítico.

Caso o projeto não tenha biblioteca de gráficos, usar inicialmente um componente simples com CSS/HTML/SVG. Não adicionar dependências pesadas sem necessidade.

### Tabela bico a bico

Colunas:

- Nº do bico;
- seção;
- volume coletado;
- tempo;
- vazão medida;
- vazão esperada;
- desvio %;
- taxa real L/ha;
- status;
- ação recomendada;
- observação.

### Plano de ação

Gerar automaticamente uma lista:

- limpar bicos abaixo da vazão;
- substituir bicos acima da vazão;
- verificar filtros;
- verificar antigotejos;
- conferir pressão no manômetro;
- repetir aferição após manutenção.

### Conclusão

Exemplo:

```txt
O pulverizador apresenta desuniformidade de vazão acima do recomendado para uma aplicação uniforme. 
Recomenda-se realizar manutenção nos bicos indicados, verificar filtros e repetir a aferição antes da aplicação.
```

### Assinatura

- Responsável técnico;
- Cliente ou operador;
- Data.

---

# 11. Telas necessárias

## 11.1. Dashboard do módulo

Rota sugerida:

```txt
/diagnostico-vazao
```

Elementos:

- botão Novo Diagnóstico;
- cards de resumo;
- tabela/lista de diagnósticos;
- filtros por data, cliente e máquina.

---

## 11.2. Criar novo diagnóstico

Rota sugerida:

```txt
/diagnostico-vazao/novo
```

Usar fluxo em etapas:

1. Identificação;
2. Pulverizador;
3. Ponta e parâmetros;
4. Coleta;
5. Revisão;
6. Relatório.

---

## 11.3. Tela de coleta

Essa é a tela mais importante.

Características:

- mobile-first;
- número do bico em destaque;
- campo grande para volume coletado;
- cronômetro opcional;
- botão salvar e avançar;
- botão voltar;
- botão marcar problema;
- progresso visual.

Exemplo:

```txt
Bico 12 de 49

Tempo de coleta: 30 s
Volume coletado: [_____] mL

Resultado:
Vazão medida: 0,92 L/min
Desvio: -23,3%
Status: Crítico abaixo

[Salvar e próximo]
```

---

## 11.4. Relatório

Rota sugerida:

```txt
/diagnostico-vazao/[id]/relatorio
```

Elementos:

- layout limpo para impressão;
- botão imprimir/salvar PDF;
- botão exportar CSV;
- botão voltar para editar;
- botão duplicar diagnóstico, opcional.

---

# 12. Banco de dados Supabase

O AntiGravity deve primeiro verificar se já existem tabelas de clientes, fazendas, máquinas ou usuários. Se existirem, reaproveitar.

Caso não existam, criar tabelas novas com nomes claros e sem conflito.

## 12.1. Tabela `flow_inspections`

```sql
create table if not exists public.flow_inspections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,

  client_name text not null,
  farm_name text,
  city text,
  state text,
  field_name text,
  crop text,
  operation_type text,

  sprayer_brand text,
  sprayer_model text,
  sprayer_type text,
  boom_width_m numeric,
  total_nozzles integer not null,
  nozzle_spacing_m numeric not null,

  pressure_value numeric,
  pressure_unit text check (pressure_unit in ('bar', 'psi')),
  speed_kmh numeric not null,
  target_rate_l_ha numeric not null,

  nozzle_type text,
  nozzle_model text,
  nozzle_color text,
  nozzle_condition text check (nozzle_condition in ('nova', 'usada', 'desconhecida')),
  expected_flow_l_min numeric,
  tolerance_percent numeric not null default 10,

  collection_time_seconds integer not null default 30,

  status text not null default 'draft' check (status in ('draft', 'completed', 'archived')),

  summary jsonb,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 12.2. Tabela `flow_measurements`

```sql
create table if not exists public.flow_measurements (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.flow_inspections(id) on delete cascade,

  nozzle_number integer not null,
  section_number integer,
  boom_side text check (boom_side in ('esquerdo', 'centro', 'direito')),

  collected_volume_ml numeric,
  collection_time_seconds integer not null,

  measured_flow_l_min numeric,
  expected_flow_l_min numeric,
  deviation_percent numeric,
  actual_rate_l_ha numeric,

  status text not null check (status in (
    'ok',
    'abaixo',
    'critico_abaixo',
    'acima',
    'critico_acima',
    'nao_avaliado'
  )),

  recommendation text,
  notes text,

  created_at timestamptz not null default now(),

  unique (inspection_id, nozzle_number)
);
```

---

## 12.3. Índices

```sql
create index if not exists idx_flow_inspections_owner_id
on public.flow_inspections(owner_id);

create index if not exists idx_flow_inspections_created_at
on public.flow_inspections(created_at desc);

create index if not exists idx_flow_measurements_inspection_id
on public.flow_measurements(inspection_id);
```

---

## 12.4. RLS

Ativar RLS:

```sql
alter table public.flow_inspections enable row level security;
alter table public.flow_measurements enable row level security;
```

Políticas para `flow_inspections`:

```sql
create policy "Users can view own flow inspections"
on public.flow_inspections
for select
using (auth.uid() = owner_id);

create policy "Users can insert own flow inspections"
on public.flow_inspections
for insert
with check (auth.uid() = owner_id);

create policy "Users can update own flow inspections"
on public.flow_inspections
for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Users can delete own flow inspections"
on public.flow_inspections
for delete
using (auth.uid() = owner_id);
```

Políticas para `flow_measurements`:

```sql
create policy "Users can view measurements from own inspections"
on public.flow_measurements
for select
using (
  exists (
    select 1
    from public.flow_inspections fi
    where fi.id = flow_measurements.inspection_id
      and fi.owner_id = auth.uid()
  )
);

create policy "Users can insert measurements from own inspections"
on public.flow_measurements
for insert
with check (
  exists (
    select 1
    from public.flow_inspections fi
    where fi.id = flow_measurements.inspection_id
      and fi.owner_id = auth.uid()
  )
);

create policy "Users can update measurements from own inspections"
on public.flow_measurements
for update
using (
  exists (
    select 1
    from public.flow_inspections fi
    where fi.id = flow_measurements.inspection_id
      and fi.owner_id = auth.uid()
  )
);

create policy "Users can delete measurements from own inspections"
on public.flow_measurements
for delete
using (
  exists (
    select 1
    from public.flow_inspections fi
    where fi.id = flow_measurements.inspection_id
      and fi.owner_id = auth.uid()
  )
);
```

---

# 13. Funções utilitárias de cálculo

Criar arquivo sugerido:

```txt
src/features/diagnostico-vazao/utils/flowCalculations.ts
```

Funções necessárias:

```ts
export function calculateMeasuredFlowLMin(volumeMl: number, timeSeconds: number): number

export function calculateExpectedFlowLMin(
  targetRateLHa: number,
  speedKmh: number,
  nozzleSpacingM: number
): number

export function calculateDeviationPercent(
  measuredFlowLMin: number,
  expectedFlowLMin: number
): number

export function calculateActualRateLHa(
  measuredFlowLMin: number,
  speedKmh: number,
  nozzleSpacingM: number
): number

export function classifyNozzle(
  deviationPercent: number,
  tolerancePercent: number
): NozzleStatus

export function calculateBarSummary(measurements: FlowMeasurement[]): FlowInspectionSummary
```

---

# 14. Tipos TypeScript

Criar arquivo sugerido:

```txt
src/features/diagnostico-vazao/types/index.ts
```

Tipos principais:

```ts
export type NozzleStatus =
  | "ok"
  | "abaixo"
  | "critico_abaixo"
  | "acima"
  | "critico_acima"
  | "nao_avaliado";

export interface FlowInspection {
  id: string;
  owner_id: string;
  client_name: string;
  farm_name?: string;
  city?: string;
  state?: string;
  crop?: string;
  operation_type?: string;
  sprayer_brand?: string;
  sprayer_model?: string;
  total_nozzles: number;
  nozzle_spacing_m: number;
  pressure_value?: number;
  pressure_unit?: "bar" | "psi";
  speed_kmh: number;
  target_rate_l_ha: number;
  nozzle_model?: string;
  tolerance_percent: number;
  collection_time_seconds: number;
  status: "draft" | "completed" | "archived";
  summary?: FlowInspectionSummary;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FlowMeasurement {
  id?: string;
  inspection_id: string;
  nozzle_number: number;
  section_number?: number;
  boom_side?: "esquerdo" | "centro" | "direito";
  collected_volume_ml?: number;
  collection_time_seconds: number;
  measured_flow_l_min?: number;
  expected_flow_l_min?: number;
  deviation_percent?: number;
  actual_rate_l_ha?: number;
  status: NozzleStatus;
  recommendation?: string;
  notes?: string;
}

export interface FlowInspectionSummary {
  totalNozzles: number;
  evaluatedNozzles: number;
  okCount: number;
  belowCount: number;
  criticalBelowCount: number;
  aboveCount: number;
  criticalAboveCount: number;
  notEvaluatedCount: number;
  averageFlowLMin: number;
  expectedFlowLMin: number;
  averageDeviationPercent: number;
  averageActualRateLHa: number;
  coefficientOfVariationPercent: number;
  maxPositiveDeviationPercent: number;
  maxNegativeDeviationPercent: number;
  generalClassification: "aprovado" | "aprovado_com_ressalvas" | "reprovado";
}
```

---

# 15. Componentes sugeridos

Criar em:

```txt
src/features/diagnostico-vazao/components/
```

Componentes:

```txt
FlowInspectionDashboard.tsx
FlowInspectionForm.tsx
SprayerSetupForm.tsx
NozzleSetupForm.tsx
CollectionSetupForm.tsx
NozzleMeasurementScreen.tsx
NozzleMeasurementTable.tsx
FlowSummaryCards.tsx
FlowBarChart.tsx
FlowInspectionReport.tsx
ReportPrintActions.tsx
StatusBadge.tsx
RecommendationList.tsx
```

---

# 16. Serviços Supabase

Criar em:

```txt
src/features/diagnostico-vazao/services/flowInspectionService.ts
```

Funções:

```ts
createFlowInspection(data)
getFlowInspections()
getFlowInspectionById(id)
updateFlowInspection(id, data)
deleteFlowInspection(id)

upsertFlowMeasurement(inspectionId, measurement)
getFlowMeasurements(inspectionId)
deleteFlowMeasurement(id)

completeFlowInspection(id)
archiveFlowInspection(id)
```

Regras:

- usar o cliente Supabase já existente no projeto;
- não criar nova conexão se já houver uma;
- respeitar autenticação atual;
- sempre usar `owner_id = user.id` ao criar diagnóstico;
- tratar erros com mensagens claras.

---

# 17. UX e interface

## 17.1. Visual

Manter o padrão visual do projeto atual.

Caso não exista padrão consolidado:

- cards com cantos arredondados;
- tipografia limpa;
- botões grandes;
- layout responsivo;
- foco em uso mobile no campo;
- cores de status:
  - OK;
  - atenção;
  - crítico.

## 17.2. Mensagens ao usuário

Exemplos:

```txt
Bico dentro da faixa de tolerância.
```

```txt
Vazão abaixo do esperado. Verifique entupimento, filtro, porta-bico ou restrição na linha.
```

```txt
Vazão acima do esperado. Possível desgaste da ponta ou divergência de pressão.
```

```txt
Desuniformidade elevada na barra. Recomenda-se manutenção e nova aferição antes da aplicação.
```

---

# 18. Exportação

## 18.1. Primeira versão

Implementar:

- impressão/salvar PDF pelo navegador usando `window.print()`;
- layout próprio para impressão via CSS `@media print`;
- exportação CSV da tabela bico a bico.

## 18.2. Versão futura

Avaliar depois:

- PDF nativo;
- XLSX;
- assinatura digital;
- upload de fotos;
- modo offline;
- sincronização posterior.

---

# 19. Integração futura com o seletor de bicos

Como o projeto já possui calculadora de vazão de bico, o módulo deve tentar reaproveitar a lógica existente.

Objetivo futuro:

- selecionar o bico recomendado pelo seletor;
- importar pressão, vazão, velocidade e L/ha;
- comparar:
  - ponta recomendada;
  - ponta instalada;
  - vazão esperada;
  - vazão medida;
  - taxa real.

Mensagem estratégica:

```txt
O sistema não apenas mede a vazão: ele compara a aplicação real com a configuração ideal.
```

---

# 20. Critérios de aceite

O módulo será considerado pronto quando:

1. Usuário logado conseguir criar um diagnóstico;
2. Usuário conseguir informar cliente, pulverizador e parâmetros de aplicação;
3. Sistema calcular vazão esperada automaticamente;
4. Usuário conseguir inserir volume coletado bico a bico;
5. Sistema calcular vazão medida, desvio e taxa real por bico;
6. Sistema classificar cada bico;
7. Sistema gerar resumo geral da barra;
8. Sistema exibir gráfico simples da vazão por bico;
9. Sistema gerar relatório visual;
10. Sistema permitir imprimir/salvar PDF pelo navegador;
11. Sistema exportar CSV;
12. Dados serem salvos no Supabase com RLS;
13. Usuário só enxergar seus próprios diagnósticos;
14. Projeto continuar funcionando na Vercel;
15. Calculadora atual de bico não ser quebrada.

---

# 21. Cuidados técnicos

O AntiGravity deve:

- criar branch antes de alterar;
- inspecionar `package.json`;
- identificar framework usado;
- identificar sistema de rotas;
- identificar cliente Supabase existente;
- não duplicar bibliotecas;
- não sobrescrever arquivos centrais sem necessidade;
- rodar build;
- corrigir erros TypeScript;
- testar fluxo manualmente;
- registrar no final o que foi criado e alterado.

---

# 22. Roadmap sugerido

## Fase 1 — MVP

- cadastro de diagnóstico;
- configuração de aplicação;
- entrada manual bico a bico;
- cálculos;
- classificação;
- relatório visual;
- impressão/PDF pelo navegador;
- CSV.

## Fase 2 — Profissionalização

- cadastro completo de clientes;
- cadastro de máquinas;
- histórico por máquina;
- comparação entre diagnósticos;
- fotos do pulverizador e bicos;
- assinatura;
- PDF nativo;
- painel de indicadores.

## Fase 3 — Produto SaaS

- multiusuário por empresa;
- vendedores/parceiros;
- permissões por perfil;
- relatórios com marca personalizada;
- dashboard de fazendas atendidas;
- mapa de visitas;
- integração com CRM Spray Precision;
- integração com seletor de bico;
- módulo de checklist de pulverização.

## Fase 4 — Hardware futuro

- integração com sensor de vazão;
- leitura via Bluetooth;
- leitura automática;
- modo proveta + modo eletrônico;
- histórico comparativo entre aferição manual e aferição digital.

---

# 23. Prompt pronto para usar no AntiGravity

Copie e cole o texto abaixo no AntiGravity:

```txt
Você é um desenvolvedor sênior full-stack. Preciso criar um novo módulo dentro do projeto existente `bico_saas`, sem quebrar a aplicação atual.

Contexto:
- O projeto já está no GitHub.
- Já usa Supabase para autenticação e banco de dados.
- Já está publicado na Vercel.
- Já existe uma calculadora de vazão de bico.
- Quero criar um módulo novo chamado `diagnostico-vazao-manual`.

Objetivo:
Criar um sistema para diagnóstico manual de vazão por bico de pulverizador agrícola. O usuário irá coletar o volume de cada bico com proveta/copo graduado durante 30 segundos, 60 segundos ou tempo personalizado. O sistema deve calcular vazão medida em L/min, vazão esperada, desvio percentual, taxa real em L/ha, classificar cada bico e gerar relatório técnico.

Regras importantes:
1. Primeiro inspecione a arquitetura atual do projeto.
2. Identifique se o projeto usa Next.js, React/Vite ou outra estrutura.
3. Identifique como a autenticação Supabase está implementada.
4. Identifique onde ficam rotas, componentes, serviços e tipos.
5. Não sobrescreva arquivos importantes sem necessidade.
6. Não quebre a calculadora atual.
7. Reaproveite o cliente Supabase existente.
8. Não copie nome, marca, layout ou textos comerciais de equipamentos de terceiros.
9. Crie o módulo com identidade própria: Diagnóstico de Vazão Manual.

Funcionalidades do MVP:
- Dashboard de diagnósticos.
- Criar novo diagnóstico.
- Informar cliente, fazenda, cidade/UF, cultura e operação.
- Informar pulverizador: marca, modelo, largura de barra, número de bicos, espaçamento, pressão, velocidade e volume alvo.
- Informar ponta/bico: tipo, modelo, cor, condição e tolerância.
- Definir tempo de coleta: 30s, 60s ou personalizado.
- Inserir volume coletado por bico.
- Calcular automaticamente:
  - vazão medida em L/min;
  - vazão esperada em L/min;
  - desvio percentual;
  - taxa real em L/ha;
  - status do bico;
  - recomendação.
- Gerar resumo geral:
  - total de bicos;
  - bicos OK;
  - bicos abaixo;
  - bicos acima;
  - críticos;
  - vazão média;
  - taxa real média;
  - CV da barra;
  - classificação geral.
- Gerar relatório visual.
- Permitir imprimir/salvar PDF pelo navegador.
- Exportar CSV.

Fórmulas:
vazao_medida_l_min = (volume_ml / 1000) / (tempo_segundos / 60)

vazao_esperada_l_min = (volume_alvo_l_ha * velocidade_km_h * espacamento_bicos_m) / 600

desvio_percentual = ((vazao_medida_l_min - vazao_esperada_l_min) / vazao_esperada_l_min) * 100

taxa_real_l_ha = (vazao_medida_l_min * 600) / (velocidade_km_h * espacamento_bicos_m)

cv_percentual = (desvio_padrao_vazoes / media_vazoes) * 100

Classificação:
- Dentro da tolerância: OK.
- Abaixo da tolerância: possível entupimento/restrição.
- Muito abaixo: crítico abaixo.
- Acima da tolerância: possível desgaste/pressão divergente.
- Muito acima: crítico acima.

Banco Supabase:
Crie as tabelas:
- flow_inspections
- flow_measurements

Use RLS para garantir que cada usuário só acesse seus próprios dados.

Interface:
- Mobile-first.
- Simples para uso em campo.
- Tela de coleta com número do bico grande.
- Campo de volume coletado grande.
- Botão Salvar e próximo.
- Relatório limpo e profissional.

Antes de implementar:
- Faça um plano curto.
- Liste os arquivos que pretende criar/alterar.
- Só depois implemente.

Depois de implementar:
- Rode lint/build/test se existirem scripts.
- Corrija erros.
- Informe o que foi criado.
```

---

# 24. Observação estratégica

Este módulo pode se tornar um produto muito forte para a Spray Precision porque conecta três coisas:

1. diagnóstico técnico real da barra;
2. argumento comercial sobre perdas invisíveis na aplicação;
3. histórico profissional para o cliente.

Frase de posicionamento sugerida:

```txt
Se a pulverização fosse medida como rendimento de colheitadeira, você aceitaria perder sem saber onde?
```

Mensagem curta:

```txt
Diagnóstico de Vazão Manual: transforme a coleta com proveta em relatório técnico, decisão e venda consultiva.
```

---

# 25. Próximos passos recomendados

1. Criar a pasta/documento de especificação dentro do projeto.
2. Rodar o AntiGravity com o prompt acima.
3. Implementar primeiro o MVP sem PDF nativo complexo.
4. Validar no campo com 1 pulverizador real.
5. Ajustar relatório com base na dor comercial da Spray Precision.
6. Depois evoluir para checklist completo de aplicação e integração com o seletor de bicos.
