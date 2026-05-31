# 🌾 Diagnóstico de Vazão Manual — Spray Precision PRO

Módulo de auditoria e diagnóstico espacial de bicos agrícolas por método tradicional de jaragem (proveta e cronômetro), integrado de forma 100% isolada e desacoplada no ecossistema `bico_saas`.

Este subprojeto conta com uma **arquitetura híbrida offline-first**, rodando de forma 100% funcional localmente usando `localStorage` com esquemas de dados idênticos ao banco de dados relacional. A portabilidade para a nuvem de produção do **Supabase** é imediata, bastando chavear uma flag.

---

## 🏛️ Lógica de Persistência Híbrida (LocalStorage <-> Supabase)

Toda a lógica de banco de dados da aplicação está encapsulada no módulo [js/dbService.js](file:///c:/Users/Eduardo/Documents/GitHub/bico_saas/diagnostico-vazao-manual/js/dbService.js).

Para rodar em modo 100% local (padrão):
```javascript
export const USE_SUPABASE = false;
```
Quando estiver pronto para rodar online com persistência na nuvem, basta alterar a flag no mesmo arquivo:
```javascript
export const USE_SUPABASE = true;
```
A partir desse momento, a aplicação passará a consumir a biblioteca do Supabase, exigindo que o usuário esteja logado no sistema e enviará os diagnósticos diretamente para as tabelas relacionais em nuvem.

---

## 💾 Script de Migração SQL (Supabase)

Para preparar seu banco de dados Supabase de produção para receber as sincronizações online deste módulo, execute as queries SQL abaixo no editor SQL (SQL Editor) do Painel do Supabase:

```sql
-- 1. Tabela flow_inspections (Cabeçalhos dos Relatórios)
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

-- 2. Tabela flow_measurements (Leituras de Cada Bico da Barra)
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

-- 3. Índices de Performance Hidráulica
create index if not exists idx_flow_inspections_owner_id
on public.flow_inspections(owner_id);

create index if not exists idx_flow_inspections_created_at
on public.flow_inspections(created_at desc);

create index if not exists idx_flow_measurements_inspection_id
on public.flow_measurements(inspection_id);

-- 4. Habilitar Segurança de Nível de Linha (RLS)
alter table public.flow_inspections enable row level security;
alter table public.flow_measurements enable row level security;

-- 5. Políticas de Segurança (Políticas RLS) para flow_inspections
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

-- 6. Políticas de Segurança (Políticas RLS) para flow_measurements
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

## ⚡ Deployment e Execução

### Rodar Localmente
Basta abrir o arquivo `index.html` em qualquer navegador web moderno.
Para uma experiência completa (incluindo o suporte ao **Assistente de Voz Hands-Free**), é recomendado rodar um servidor de desenvolvimento local leve (ex: `npx serve .` ou Live Server do VSCode), pois navegadores bloqueiam o uso do microfone/reconhecimento de voz em caminhos de arquivo locais brutos (`file://`).

### Hospedagem na Vercel
Por estar integrado dentro da estrutura de pastas da Spray Precision, ao fazer o push do repositório no GitHub, o Vercel irá implantar a nova pasta automaticamente. O módulo estará disponível de forma imediata na URL de deploy:
```txt
sua-url-vercel.app/diagnostico-vazao-manual/
```

---

## 🎨 Design System e Detalhes da Experiência

O design system contido em `styles.css` foi estruturado sob medida em **Modo Claro (Light Mode)** de alto contraste por três motivos cruciais:
1. **Ergonomia do Produtor:** A visualização em campo aberto (sob luz solar direta) é inviabilizada por designs escuros (efeito espelho na tela do celular). O modo claro de alto contraste garante visibilidade perfeita ao ar livre.
2. **Folha de Impressão Sustentável:** O CSS do `@media print` foi desenhado cirurgicamente para remover fundos coloridos pesados das tabelas e do mapa de bicos ao disparar a impressão nativa. Isso poupa tinta das impressoras no escritório e gera relatórios em PDF incrivelmente limpos e profissionais.
3. **Wow Factors Premium:** Integração nativa com **Chart.js** exibindo os desvios de forma espacial, renderização em tempo real de beeps industriais de tempo e assistente inteligente pt-BR por sintetizador de fala nativo.
