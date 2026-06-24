# Plano de Implementação — App Único Multiuso para Consultores, Fazendas e Empresas

**Projeto:** Spray Precision PRO  
**Objetivo:** manter um único app para atender consultores, fazendas, revendas e empresas, adaptando telas, permissões e planos conforme o tipo de conta.  
**Data:** 24/06/2026  
**Versão:** v1

---

# 1. Decisão principal

A decisão estratégica é:

> Manter um único app Spray Precision PRO para todos os públicos.

Não criar apps separados para:

- consultores;
- fazendas;
- revendas;
- empresas;
- parceiros.

O app deve ser único, mas com:

- tipos de conta diferentes;
- planos diferentes;
- permissões por recurso;
- telas adaptadas;
- controle por organização;
- usuários com papéis diferentes.

---

# 2. Por que manter um único app

Criar vários apps diferentes agora aumentaria:

- custo de desenvolvimento;
- manutenção;
- risco de bugs;
- retrabalho;
- dificuldade de atualização;
- confusão comercial;
- dificuldade para escalar.

A melhor arquitetura é:

```text
Um único app
+ tipo de conta
+ tipo de plano
+ permissões
+ papéis de usuário
+ telas adaptadas
```

---

# 3. Conceito central do produto

O Spray Precision PRO deve ser uma plataforma única com dois módulos principais:

1. **Seletor de Bicos**
2. **Diagnóstico de Vazão Manual**

E com camadas adicionais conforme o público:

- CRM de clientes;
- gestão de fazendas;
- gestão de pulverizadores;
- histórico de laudos;
- painel de frota;
- gestão de equipe;
- white-label;
- BI.

---

# 4. Públicos atendidos pelo mesmo app

---

## 4.1. Consultor

### Necessidade principal

O consultor atende vários clientes e precisa entregar laudos profissionais.

### Tela ideal

```text
Meus Clientes
├── Cliente / Grupo Agrícola
│   ├── Fazenda
│   │   ├── Pulverizador 01
│   │   ├── Pulverizador 02
│   │   └── Histórico de laudos
```

### Recursos importantes

- cadastro de clientes;
- cadastro de fazendas;
- cadastro de máquinas;
- laudos por cliente;
- histórico por máquina;
- PDF profissional;
- uso offline;
- Seletor de Bicos;
- Diagnóstico de Vazão;
- relatório para entrega ao produtor.

### Valor percebido

> O consultor consegue atender vários clientes e entregar laudos técnicos com aparência profissional.

---

## 4.2. Fazenda

### Necessidade principal

A fazenda precisa controlar a qualidade de aplicação da sua própria frota.

### Tela ideal

```text
Minha Frota
├── Jacto Uniport 3030 — 🟢 Apto
├── John Deere 4730 — 🟡 Atenção
├── Stara Imperador — 🔴 Corrigir
└── Horsch Leeb — ⚪ Sem aferição recente
```

### Recursos importantes

- cadastro da frota;
- status por pulverizador;
- histórico por máquina;
- relatório consolidado da frota;
- operadores/técnicos internos;
- pendências de manutenção;
- alertas de aferição vencida;
- laudos por máquina;
- controle antes da aplicação.

### Valor percebido

> A fazenda sabe quais máquinas estão prontas para aplicar e quais precisam de correção.

---

## 4.3. Revenda / Empresa / Parceiro

### Necessidade principal

A empresa precisa padronizar o atendimento técnico da equipe e entregar valor para clientes.

### Tela ideal

```text
Painel da Empresa
├── Consultores
├── Clientes atendidos
├── Máquinas avaliadas
├── Laudos gerados
├── Pendências
└── Relatórios por período
```

### Recursos importantes

- múltiplos usuários;
- gestão de equipe;
- carteira de clientes;
- laudos com logo da empresa;
- white-label;
- painel administrativo;
- BI de uso;
- histórico dos atendimentos;
- suporte comercial e técnico.

### Valor percebido

> A revenda transforma assistência técnica em venda consultiva com laudo e prova visual.

---

## 4.4. Produtor pontual

### Necessidade principal

O produtor quer aferir uma máquina específica, sem necessariamente assinar.

### Tela ideal

```text
Laudo Avulso
├── 1 máquina
├── 1 diagnóstico completo
└── 1 PDF profissional
```

### Recursos importantes

- compra de laudo avulso;
- limite de 1 máquina;
- validade por período;
- PDF profissional;
- sem recorrência.

### Valor percebido

> O produtor resolve uma máquina sem precisar contratar um plano recorrente.

---

# 5. Estrutura de navegação adaptada

O app deve detectar o tipo de conta e adaptar a tela inicial.

---

## 5.1. Para consultor

Menu sugerido:

```text
Dashboard
Clientes
Fazendas
Máquinas
Nova Aferição
Seletor de Bicos
Laudos
Configurações
```

---

## 5.2. Para fazenda

Menu sugerido:

```text
Dashboard da Frota
Pulverizadores
Nova Aferição
Seletor de Bicos
Pendências
Relatórios
Usuários
Configurações
```

---

## 5.3. Para revenda / empresa

Menu sugerido:

```text
Dashboard Empresa
Clientes
Consultores
Máquinas
Laudos
Relatórios
Equipe
Marca / White-label
Configurações
```

---

## 5.4. Para usuário de laudo avulso

Menu sugerido:

```text
Minha Aferição
Seletor de Bicos
Gerar Laudo
Comprar Novo Laudo
```

---

# 6. Tipos de conta

Criar campo:

```text
account_type
```

Valores sugeridos:

```text
consultant
farm
company
partner
single_user
internal_admin
```

---

## 6.1. Significado de cada tipo

| account_type | Uso |
|---|---|
| `consultant` | consultor individual que atende clientes |
| `farm` | fazenda ou grupo agrícola com frota própria |
| `company` | empresa/revenda com equipe |
| `partner` | parceiro com white-label |
| `single_user` | usuário pontual ou individual |
| `internal_admin` | equipe interna Spray Precision |

---

# 7. Tipos de plano

Criar campo:

```text
plan_type
```

Valores sugeridos:

```text
demo
single_report
pro_individual
farm_start
farm_pro
company
partner
enterprise
free_internal
```

---

## 7.1. Tabela de planos

| Plano | Público | Foco |
|---|---|---|
| `demo` | curioso / lead | testar sem resolver completo |
| `single_report` | produtor pontual | 1 máquina / 1 laudo |
| `pro_individual` | consultor pequeno | laudos recorrentes |
| `farm_start` | fazenda pequena | frota até limite inicial |
| `farm_pro` | fazenda média/grande | frota e histórico |
| `company` | revenda/empresa | equipe e clientes |
| `partner` | parceiro comercial | white-label |
| `enterprise` | grupos maiores | BI, equipe e gestão |
| `free_internal` | uso interno | acesso livre controlado |

---

# 8. Permissões por recurso

Criar feature flags.

Exemplos:

```text
can_use_seletor
can_use_diagnostico
can_generate_pdf
can_export_csv
can_export_json
can_sync_cloud
can_use_pwm
can_use_dual_nozzle
can_use_crm
can_use_fleet_dashboard
can_manage_team
can_use_custom_logo
can_view_bi
can_create_clients
can_create_farms
can_create_machines
can_create_unlimited_reports
```

---

# 9. Papéis de usuário

Dentro de uma organização, usuários podem ter papéis diferentes.

Criar campo:

```text
role
```

Valores sugeridos:

```text
owner
admin
manager
consultant
technician
operator
viewer
```

---

## 9.1. Permissões por papel

| Papel | Pode fazer |
|---|---|
| `owner` | controla tudo da organização |
| `admin` | gerencia usuários, máquinas e laudos |
| `manager` | vê relatórios e status da frota |
| `consultant` | faz aferições e gera laudos |
| `technician` | faz aferições e registra ocorrências |
| `operator` | preenche coleta e consulta máquina |
| `viewer` | apenas visualiza relatórios |

---

# 10. Estrutura de dados recomendada

A estrutura ideal deve ser multiempresa/multiorganização.

---

## 10.1. Tabelas principais

```text
organizations
users
organization_users
clients
farms
machines
inspections
reports
subscriptions
report_credits
licenses
```

---

## 10.2. `organizations`

Representa a conta principal.

Pode ser:

- consultoria;
- fazenda;
- revenda;
- empresa;
- parceiro.

Campos sugeridos:

```text
id
name
account_type
document
phone
whatsapp
logo_url
brand_color
created_at
updated_at
```

---

## 10.3. `organization_users`

Relaciona usuários com organizações.

Campos sugeridos:

```text
id
organization_id
user_id
role
status
created_at
updated_at
```

---

## 10.4. `clients`

Usado principalmente por consultores e revendas.

Campos sugeridos:

```text
id
organization_id
name
document
phone
notes
created_at
updated_at
```

---

## 10.5. `farms`

Representa fazendas/unidades.

Campos sugeridos:

```text
id
organization_id
client_id
name
location
notes
created_at
updated_at
```

Observação:

- para fazenda própria, `client_id` pode ser nulo;
- para consultor/revenda, `client_id` identifica o cliente atendido.

---

## 10.6. `machines`

Representa pulverizadores.

Campos sugeridos:

```text
id
organization_id
client_id
farm_id
name
brand
model
year
boom_width_m
nozzle_count
spacing_cm
system_type
current_nozzle
usual_rate_lha
usual_speed_kmh
usual_pressure_bar
operator_name
last_inspection_at
next_inspection_due
current_status
created_at
updated_at
```

Valores de `system_type`:

```text
conventional
pwm
dual_nozzle
```

Valores de `current_status`:

```text
apt
attention
failed
overdue
not_inspected
```

---

## 10.7. `inspections`

Representa cada diagnóstico/aferição.

Campos sugeridos:

```text
id
organization_id
client_id
farm_id
machine_id
user_id
inspection_date
reference_source
reference_flow_lmin
reference_confidence
cv_percent
average_flow_lmin
status
total_nozzles
ok_nozzles
attention_nozzles
critical_nozzles
field_occurrences_count
notes
created_at
updated_at
```

---

## 10.8. `reports`

Representa PDFs/laudos.

Campos sugeridos:

```text
id
organization_id
inspection_id
machine_id
report_type
pdf_url
validation_code
qr_code_url
status
generated_at
synced_at
created_at
```

Valores de `report_type`:

```text
single_machine
fleet_summary
single_report_credit
demo
```

Valores de `status`:

```text
draft
offline_pending
validated
cancelled
```

---

# 11. Estrutura visual por tipo de conta

---

## 11.1. Consultor

```text
Organização: Consultoria Felipe
├── Cliente: Fazenda São João
│   ├── Fazenda Matriz
│   │   ├── Pulverizador Jacto 3030
│   │   └── Pulverizador JD 4730
│   └── Fazenda Norte
└── Cliente: Grupo Mussi
    └── Fazenda Algodão
```

---

## 11.2. Fazenda

```text
Organização: Fazenda São João
├── Unidade: Fazenda Matriz
│   ├── Pulverizador Jacto 3030
│   └── Pulverizador JD 4730
└── Unidade: Fazenda Norte
    └── Pulverizador Stara Imperador
```

---

## 11.3. Revenda

```text
Organização: Revenda AgroTech
├── Consultor: João
│   ├── Cliente: Fazenda São João
│   └── Cliente: Grupo Mussi
├── Consultor: Carlos
│   └── Cliente: Fazenda Primavera
└── Relatórios da equipe
```

---

# 12. Dashboard por perfil

---

## 12.1. Dashboard do consultor

Indicadores:

```text
Clientes ativos
Máquinas cadastradas
Laudos gerados no mês
Máquinas com pendência
Últimas aferições
```

Cards:

```text
Cliente
Fazenda
Pulverizador
Última aferição
Status
Ação
```

---

## 12.2. Dashboard da fazenda

Indicadores:

```text
Pulverizadores aptos
Pulverizadores em atenção
Pulverizadores reprovados
Pulverizadores sem aferição recente
CV médio da frota
Pendências abertas
```

Cards:

```text
Pulverizador
Status
Última aferição
CV
Críticas
Ocorrências
Próxima ação
```

---

## 12.3. Dashboard da empresa/revenda

Indicadores:

```text
Consultores ativos
Clientes atendidos
Máquinas avaliadas
Laudos gerados
Taxa de máquinas reprovadas
Pendências abertas
```

Filtros:

```text
Por consultor
Por cliente
Por fazenda
Por período
Por status
```

---

# 13. Relatórios necessários

---

## 13.1. Laudo individual por máquina

Usado em todos os perfis.

Deve conter:

- dados da organização;
- cliente/fazenda;
- máquina;
- metodologia;
- fonte da referência;
- confiabilidade da referência;
- CV;
- vazão média;
- status por bico;
- ocorrências de campo;
- recomendações;
- QR/ID de validação.

---

## 13.2. Relatório consolidado da frota

Principal para fazendas.

Deve conter:

```text
Total de pulverizadores avaliados
Máquinas aptas
Máquinas em atenção
Máquinas reprovadas
Máquinas vencidas
Total de bicos avaliados
Pontas críticas
Ocorrências de campo
CV médio da frota
Prioridades de correção
```

---

## 13.3. Relatório da equipe

Principal para revendas/empresas.

Deve conter:

```text
Consultores ativos
Clientes atendidos
Laudos por consultor
Máquinas avaliadas
Pendências por cliente
Ranking de problemas encontrados
```

---

# 14. Lógica de uso offline

O app deve continuar funcionando offline no campo.

## 14.1. Regra

O usuário precisa fazer primeiro login online para baixar:

- dados da organização;
- permissões;
- máquinas;
- clientes/fazendas;
- licença offline;
- créditos de laudo, se houver.

---

## 14.2. Offline por perfil

### Consultor

Pode acessar clientes e máquinas previamente sincronizados.

### Fazenda

Pode acessar a frota da própria fazenda.

### Revenda

Pode acessar carteira sincronizada conforme permissão do usuário.

### Laudo avulso

Pode acessar apenas a máquina/diagnóstico liberado.

---

# 15. Licença offline

Criar licença offline temporária.

Campos sugeridos:

```text
user_id
organization_id
plan_type
account_type
features
valid_until
device_id
signature
```

Validade sugerida:

```text
7 a 15 dias
```

---

# 16. Regras de segurança

## 16.1. Não confiar apenas no frontend

O frontend pode mostrar telas e permitir coleta, mas o servidor deve validar:

- assinatura;
- crédito de laudo;
- PDF profissional;
- QR Code;
- laudo oficial;
- sincronização;
- usuários e organizações.

---

## 16.2. Proteger valor comercial

Proteger principalmente:

- geração de PDF profissional;
- laudo oficial validado;
- histórico em nuvem;
- créditos de laudo;
- permissões de equipe;
- white-label;
- BI.

---

# 17. Fases de implementação

---

# Fase 1 — Base multiuso simples

## Objetivo

Manter o app atual, mas preparar estrutura para diferentes públicos.

## Implementar

1. Criar `account_type`.
2. Criar `plan_type`.
3. Criar `role`.
4. Criar permissões por recurso.
5. Adaptar menu inicial conforme tipo de conta.
6. Manter dados atuais de cliente/máquina.
7. Criar status simples de máquina:
   - apta;
   - atenção;
   - reprovada;
   - sem aferição.
8. Vincular laudos a máquinas.
9. Exibir histórico por máquina.

## Resultado esperado

O mesmo app começa a atender:

- consultor;
- fazenda;
- usuário individual.

---

# Fase 2 — Dashboard de frota

## Objetivo

Criar visão específica para fazendas com múltiplos pulverizadores.

## Implementar

1. Tela “Minha Frota”.
2. Cards de pulverizadores.
3. Última aferição por máquina.
4. Status visual.
5. Pendências.
6. Próxima aferição recomendada.
7. Contadores:
   - aptas;
   - atenção;
   - reprovadas;
   - vencidas.
8. Filtro por fazenda/unidade.

## Resultado esperado

A fazenda consegue ver rapidamente quais pulverizadores estão prontos para aplicação.

---

# Fase 3 — Relatório consolidado da frota

## Objetivo

Gerar valor para gestores.

## Implementar

1. Relatório consolidado por fazenda.
2. PDF da frota.
3. Resumo de status.
4. Total de pontas avaliadas.
5. Ocorrências gerais.
6. Lista de prioridades.
7. CV médio da frota.
8. Máquinas sem aferição recente.

## Resultado esperado

A ferramenta passa a ser vendida como controle de qualidade da aplicação da frota.

---

# Fase 4 — Gestão de equipe

## Objetivo

Atender revendas, empresas e fazendas maiores.

## Implementar

1. Organizações.
2. Usuários vinculados à organização.
3. Papéis:
   - owner;
   - admin;
   - gestor;
   - técnico;
   - operador;
   - visualizador.
4. Controle de permissões por papel.
5. Painel de usuários.
6. Histórico por usuário.
7. Assinatura por organização.

## Resultado esperado

Uma revenda ou fazenda consegue ter vários usuários usando o mesmo ambiente.

---

# Fase 5 — White-label e parceiro

## Objetivo

Atender empresas parceiras.

## Implementar

1. Logo da empresa no app.
2. Cor da marca.
3. WhatsApp da empresa.
4. Nome da empresa no laudo.
5. Configuração por organização.
6. Laudo com identidade visual do parceiro.

## Resultado esperado

Revendas e empresas conseguem usar o Spray Precision PRO como ferramenta própria de atendimento técnico.

---

# Fase 6 — BI e gestão avançada

## Objetivo

Criar valor corporativo.

## Implementar

1. Dashboard executivo.
2. Métricas por período.
3. Métricas por consultor.
4. Métricas por cliente.
5. Métricas por máquina.
6. Ranking de problemas.
7. Exportação de dados.
8. Indicadores de qualidade da frota.

## Resultado esperado

O produto passa a justificar plano corporativo com maior valor.

---

# Fase 7 — QR Code por máquina

## Objetivo

Facilitar uso em campo.

## Implementar

1. QR Code único por pulverizador.
2. Link para ficha da máquina.
3. Acesso rápido à última aferição.
4. Botão “Nova Aferição”.
5. Impressão de adesivo.
6. Histórico da máquina via QR.

## Resultado esperado

O técnico escaneia o pulverizador e começa a aferição sem procurar manualmente.

---

# Fase 8 — Segurança e licença offline

## Objetivo

Proteger uso comercial mantendo funcionamento offline.

## Implementar

1. Licença offline por usuário/dispositivo.
2. Validade de 7 a 15 dias.
3. Sincronização obrigatória periódica.
4. Controle de créditos de laudo avulso.
5. PDF offline como pendente.
6. Validação em nuvem após sincronizar.
7. QR Code de laudo validado.
8. Service role fora do frontend.

## Resultado esperado

O app continua útil no campo, mas reduz risco de uso indevido sem assinatura.

---

# 18. MVP recomendado

Para começar sem travar, implementar primeiro:

```text
1. account_type
2. plan_type
3. permissões básicas
4. status da máquina
5. histórico por máquina
6. dashboard simples de frota
7. limite da demo
8. laudo avulso
```

---

# 19. Sequência prática de implementação

## Etapa 1

Atualizar painel admin:

- tipo de conta;
- tipo de plano;
- papel do usuário;
- permissões;
- limite de bicos;
- crédito de laudo.

## Etapa 2

Atualizar Seletor Enterprise:

- menu adaptado;
- bloqueio por permissões;
- CRM conforme plano;
- modos avançados conforme plano.

## Etapa 3

Atualizar Diagnóstico:

- vincular diagnóstico à máquina;
- limitar demo;
- consumir crédito de laudo;
- salvar status da máquina.

## Etapa 4

Criar tela de frota:

- cards de pulverizadores;
- status;
- últimas aferições;
- pendências.

## Etapa 5

Criar relatório consolidado:

- resumo da frota;
- prioridades;
- PDF consolidado.

---

# 20. Risco de escopo

Cuidado para não tentar implementar tudo de uma vez.

A ordem correta é:

```text
Primeiro: app único + permissões + status de máquina.
Depois: frota.
Depois: equipe.
Depois: BI.
Depois: white-label avançado.
```

---

# 21. Frase de posicionamento

Para consultor:

> Atenda vários clientes com laudos técnicos profissionais e histórico por máquina.

Para fazenda:

> Controle a qualidade de aplicação da sua frota pulverizador por pulverizador.

Para revenda:

> Padronize o atendimento técnico da equipe e venda com base em diagnóstico.

Para produtor pontual:

> Faça uma aferição completa da sua máquina com um laudo avulso profissional.

---

# 22. Resumo executivo

O Spray Precision PRO deve continuar sendo um único app, mas com experiência adaptada para cada perfil.

A arquitetura ideal é:

```text
Um app único
Uma base de dados multiempresa
Tipos de conta
Tipos de plano
Papéis de usuário
Permissões por recurso
Dashboard adaptado
Histórico por máquina
Relatórios individuais e consolidados
```

Essa estrutura permite atender:

- consultores;
- fazendas;
- revendas;
- empresas;
- parceiros;
- usuários pontuais.

Sem duplicar produto.

---

# 23. Comando conceitual para implementação

```text
Implementar no Spray Precision PRO uma arquitetura multiuso com app único para consultores, fazendas, revendas e empresas, utilizando account_type, plan_type, roles e feature flags para adaptar telas, permissões, dashboards e relatórios conforme o perfil do usuário. A estrutura deve permitir clientes, fazendas, pulverizadores, diagnósticos, laudos, frota, equipe e white-label em fases progressivas, preservando funcionamento offline e controle comercial por assinatura ou laudo avulso.
```

---
