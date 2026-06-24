# Plano de Comercialização e Controle de Acesso — Spray Precision PRO

**Projeto:** Spray Precision PRO  
**Módulos incluídos:** Seletor de Bicos + Diagnóstico de Vazão Manual  
**Documento:** lógica comercial, limitações de demo, laudo avulso, assinatura e implementação no app  
**Data:** 24/06/2026  
**Versão:** v1

---

## 1. Objetivo deste documento

Este documento consolida a lógica comercial e técnica para implementar um modelo de acesso que permita:

1. Aumentar o acesso ao app.
2. Permitir que o usuário experimente a ferramenta.
3. Evitar que o usuário resolva uma aferição completa de graça.
4. Manter valor percebido para assinatura mensal/anual.
5. Criar opção de pagamento avulso para quem precisa apenas de uma máquina.
6. Controlar acesso aos módulos:
   - Seletor de Bicos;
   - Diagnóstico de Vazão Manual.
7. Integrar essa lógica ao painel `admin_super.html`.
8. Preservar funcionamento offline em campo.
9. Reduzir risco de burla de acesso gratuito.

---

## 2. Situação atual observada no projeto

A landing page atual do tráfego pago posiciona o Spray Precision PRO como uma plataforma com **duas ferramentas**:

- Seletor Inteligente de Bicos;
- Diagnóstico de Vazão Manual com laudo técnico.

O material comercial atual trabalha a ideia de:

> Duas ferramentas. Mais precisão no campo.

Também apresenta os planos:

- mensal;
- anual;
- anual fundador;
- corporativo.

Na landing atual, a oferta de lote fundador está estruturada como:

- **R$ 35,90/mês no plano anual via Pix**;
- **R$ 430,80/ano para os primeiros 30 clientes pagantes**;
- depois volta para **R$ 574/ano**.

Além disso, a página reforça que o acesso inclui os dois módulos completos, laudo técnico, funcionamento offline e suporte via WhatsApp.

---

## 3. Situação atual observada no Seletor Enterprise

O arquivo do Seletor Enterprise já possui uma boa base de controle de acesso:

- tela de login/cadastro;
- PWA;
- funcionamento online/offline;
- CRM de clientes e máquinas;
- geração de relatório técnico;
- modos convencional, PWM e bico duplo;
- controle por usuário;
- branding por empresa/parceiro;
- verificação de bloqueio;
- verificação de vencimento de assinatura;
- verificação de acesso ao módulo Seletor;
- banner de demo;
- mensagem informando que no modo demo a geração de PDFs está desativada.

O app já usa metadados do usuário como:

```text
is_trial
subscription_end
is_blocked
has_seletor
has_diagnostico
partner_name
partner_color
partner_logo
partner_whatsapp
```

Isso significa que a lógica proposta pode ser implementada evoluindo a estrutura atual, sem precisar recomeçar do zero.

---

## 4. Problema comercial identificado

A ideia inicial de liberar um teste gratuito completo pode funcionar para consultores e revendas, mas tem um problema importante:

> Se um produtor quiser apenas aferir uma máquina uma única vez e o modo gratuito permitir essa aferição completa, o problema dele estará resolvido sem pagamento.

Portanto, o modo grátis não pode permitir:

- aferição completa de uma máquina real;
- geração de PDF profissional;
- histórico completo;
- exportação de dados;
- laudo final utilizável comercialmente.

A demo deve provar que a ferramenta funciona, mas não deve entregar o resultado profissional completo.

---

## 5. Estratégia comercial recomendada

A estratégia mais equilibrada é trabalhar com quatro níveis principais:

1. **Demo gratuita limitada**
2. **Laudo avulso**
3. **Assinatura PRO**
4. **Plano corporativo/parceiro**

---

# 6. Plano 1 — Demo Gratuita Limitada

## 6.1. Objetivo da demo

A demo serve para o usuário sentir o valor da ferramenta, mas sem conseguir resolver completamente uma operação real.

A lógica da demo deve ser:

> Mostrar o potencial, não entregar o serviço completo.

---

## 6.2. Demo no Seletor de Bicos

O Seletor pode ser usado como ferramenta de entrada, pois ele gera interesse e ajuda o usuário a entender o valor técnico do app.

### O que liberar no Seletor Demo

- Simulação básica no modo convencional.
- Visualização de alguns bicos recomendados.
- Gráfico/tabela parcial.
- Alteração de parâmetros principais:
  - L/ha;
  - velocidade;
  - espaçamento;
  - pressão;
  - densidade.
- Visualização do conceito de janela operacional.

### O que limitar no Seletor Demo

- Bloquear PDF técnico.
- Bloquear salvar calibração em cliente/máquina.
- Bloquear CRM completo.
- Bloquear exportação.
- Limitar modos avançados:
  - PWM;
  - bico duplo.
- Limitar quantidade de simulações salvas.
- Mostrar apenas Top 3 recomendações, se necessário.

### Mensagem sugerida

> Você está usando o modo demonstração do Seletor. Para salvar calibrações, gerar PDF técnico e usar modos avançados como PWM e Bico Duplo, ative o Spray Precision PRO.

---

## 6.3. Demo no Diagnóstico de Vazão

Aqui a limitação deve ser mais rígida.

O Diagnóstico de Vazão é o módulo que mais entrega valor profissional, pois permite aferir uma máquina real.

### O que liberar no Diagnóstico Demo

- Fluxo de coleta demonstrativo.
- Até 10 ou 12 bicos por diagnóstico.
- Resultado parcial na tela.
- Mapa parcial da barra.
- Simulação de relatório na tela.
- Dados fictícios de exemplo ou diagnóstico parcial real.

### O que bloquear no Diagnóstico Demo

- Coleta da barra completa.
- PDF profissional.
- Histórico completo.
- Exportação CSV/JSON.
- QR Code de validação.
- Logo personalizado.
- Sincronização em nuvem.
- Laudo sem marca d’água.
- Mais de 1 diagnóstico salvo localmente.

### Mensagem sugerida

> Modo demonstração: você pode testar o fluxo com até 12 bicos. Para aferir a barra completa e gerar o laudo profissional, compre um Laudo Avulso ou assine o PRO.

---

## 6.4. Por que limitar por quantidade de bicos

Não basta bloquear apenas o PDF.

Se o usuário conseguir coletar 87 bicos e ver todos os resultados na tela, ele já resolveu o problema. Mesmo sem PDF, ele pode usar print, anotar valores ou tomar decisão em campo.

Por isso, no Diagnóstico de Vazão, a demo deve limitar:

```text
max_nozzles_per_inspection = 12
```

Ou, no máximo:

```text
max_nozzles_per_inspection = 20
```

A recomendação principal é usar **12 bicos** como limite inicial.

---

# 7. Plano 2 — Laudo Avulso

## 7.1. Por que criar laudo avulso

Existe um público que não quer assinatura:

- produtor pequeno;
- fazenda com uma única máquina;
- usuário pontual;
- pessoa que quer testar em uma máquina antes de assinar;
- consultor que ainda não tem demanda recorrente.

Se não existir laudo avulso, esse usuário pode tentar resolver tudo no modo grátis ou desistir.

O laudo avulso monetiza esse perfil.

---

## 7.2. Conceito do laudo avulso

Nome sugerido:

> **Laudo Avulso Spray Precision**

Ou:

> **Aferição Avulsa por Máquina**

Descrição:

> Libera uma aferição completa de uma máquina, com uso do Seletor de Bicos e Diagnóstico de Vazão, incluindo geração de um laudo profissional em PDF.

---

## 7.3. O que o laudo avulso deve liberar

- 1 máquina.
- 1 diagnóstico completo de vazão.
- Uso do Seletor de Bicos para essa máquina.
- Geração de 1 PDF profissional.
- Histórico daquele laudo.
- Exportação do PDF.
- Funcionar offline após ativação online.
- Prazo de uso limitado.

---

## 7.4. Limitações do laudo avulso

- Não libera uso recorrente.
- Não libera laudos ilimitados.
- Não libera múltiplos clientes.
- Não libera múltiplas máquinas.
- Não libera painel de equipe.
- Não libera white-label amplo.
- Não libera exportações ilimitadas.
- Não libera BI.
- Não libera histórico completo de frota.

---

## 7.5. Prazo recomendado

Opções:

```text
48 horas após ativação
```

ou:

```text
7 dias após ativação
```

Minha sugestão:

> Usar 7 dias para reduzir atrito no campo, mas consumir o crédito quando o laudo profissional for gerado.

Assim o usuário tem tempo de ir até a fazenda, aferir e gerar o laudo.

---

## 7.6. Preço sugerido

Considerando que o plano mensal atual é R$ 69,00, o laudo avulso não pode ser barato demais.

Sugestão:

```text
Laudo Avulso: R$ 39,90 a R$ 49,90 por máquina
```

Minha recomendação comercial:

> R$ 49,90 por laudo avulso

Justificativa:

- 2 laudos avulsos = R$ 99,80;
- plano mensal = R$ 69,00;
- a partir da segunda máquina, assinar fica mais vantajoso.

Se quiser uma entrada mais agressiva:

> R$ 39,90 por laudo avulso

Mas nesse caso, manter o mensal claramente mais vantajoso a partir de 2 máquinas.

---

## 7.7. Mensagem de conversão após demo

Quando o usuário terminar a demo, mostrar:

> Diagnóstico parcial concluído com sucesso. Para aferir a barra completa e gerar um laudo profissional em PDF, escolha uma opção:

Botões:

```text
Comprar 1 Laudo Avulso
Assinar PRO Mensal
Assinar PRO Anual
```

---

# 8. Plano 3 — Assinatura PRO

## 8.1. Público

- consultor;
- revenda;
- fazenda com uso recorrente;
- equipe técnica;
- prestador de serviço;
- profissional que vai gerar vários laudos.

---

## 8.2. O que liberar

- Seletor de Bicos completo.
- Diagnóstico de Vazão completo.
- PDF profissional.
- Laudos ilimitados ou limite alto.
- Histórico local e nuvem.
- Cadastro de clientes.
- Cadastro de máquinas.
- Funcionamento offline com licença válida.
- Exportação CSV/JSON.
- Suporte via WhatsApp.
- Uso de logo/branding, conforme plano.
- Modo PWM.
- Modo Bico Duplo.
- Relatórios profissionais.

---

## 8.3. Preços atuais mantidos

### Mensal

```text
R$ 69,00/mês
```

Inclui:

- acesso completo aos 2 módulos;
- laudo técnico;
- PWA offline;
- suporte via WhatsApp.

---

### Anual

```text
R$ 574,00/ano
```

Equivalente a:

```text
R$ 47,83/mês
```

---

### Plano fundador

```text
R$ 430,80/ano no Pix
```

Equivalente a:

```text
R$ 35,90/mês
```

Condição:

```text
Primeiros 30 clientes pagantes
```

---

## 8.4. Lógica comercial dos preços

A estrutura fica coerente assim:

| Produto | Valor sugerido | Lógica |
|---|---:|---|
| Demo | grátis | mostra valor, mas não resolve tudo |
| Laudo avulso | R$ 49,90 | ideal para 1 máquina |
| Mensal | R$ 69,00/mês | melhor a partir de 2 máquinas/mês |
| Anual | R$ 574,00/ano | reduz custo mensal |
| Fundador anual | R$ 430,80/ano | validação dos primeiros pagantes |
| Corporativo | sob medida | revendas/equipes |

---

# 9. Plano 4 — Corporativo / Parceiro

## 9.1. Público

- revendas;
- consultorias;
- cooperativas;
- empresas de assistência técnica;
- representantes comerciais;
- equipes com múltiplos usuários.

---

## 9.2. O que liberar

- painel administrativo;
- gestão de consultores;
- clientes da equipe;
- máquinas/frotas;
- BI de uso;
- white-label da empresa;
- logo da empresa;
- WhatsApp da revenda;
- cor da marca;
- treinamento dedicado;
- laudos com identidade visual do parceiro.

Esse modelo já conversa com a lógica existente do painel `admin_super.html`.

---

# 10. Tabela de permissões sugerida

| Recurso | Demo | Laudo Avulso | PRO Mensal/Anual | Corporativo |
|---|---:|---:|---:|---:|
| Seletor básico | Sim | Sim | Sim | Sim |
| Seletor PWM/Bico Duplo | Não ou limitado | Sim | Sim | Sim |
| Diagnóstico parcial | Sim | Sim | Sim | Sim |
| Diagnóstico completo | Não | 1 máquina | Sim | Sim |
| Limite de bicos diagnóstico | 12 | Completo | Completo | Completo |
| PDF profissional | Não | 1 PDF | Sim | Sim |
| Marca d’água demo | Sim | Não | Não | Não |
| Histórico local | 1 item | Laudo comprado | Sim | Sim |
| Histórico em nuvem | Não | Limitado | Sim | Sim |
| Exportar CSV/JSON | Não | Não ou limitado | Sim | Sim |
| QR/ID de validação | Não | Sim | Sim | Sim |
| CRM clientes/máquinas | Não ou 1 cliente | 1 cliente/1 máquina | Sim | Sim |
| Logo personalizado | Não | Não | Opcional | Sim |
| Gestão de equipe | Não | Não | Não | Sim |
| BI | Não | Não | Não | Sim |
| Offline | Limitado | Sim, por prazo | Sim, por licença | Sim |

---

# 11. Campos novos recomendados para o painel admin

O painel admin atual já controla assinatura, trial, bloqueio e módulos. Para implementar a nova lógica, recomenda-se adicionar campos comerciais mais claros.

## 11.1. Campos de plano

```text
plan_type
```

Valores sugeridos:

```text
demo
single_report
pro_monthly
pro_annual
founder_annual
enterprise
free_internal
```

---

## 11.2. Campos de crédito/uso

```text
max_reports
reports_used
max_nozzles_per_report
max_clients
max_machines
```

---

## 11.3. Campos de permissão

```text
can_use_seletor
can_use_diagnostico
can_use_pwm
can_use_dual_nozzle
can_generate_pdf
can_export_csv
can_export_json
can_sync_cloud
can_use_custom_logo
can_use_crm
can_use_bi
```

---

## 11.4. Campos de validade

```text
subscription_start
subscription_end
license_valid_until
single_report_valid_until
```

---

## 11.5. Campos de segurança

```text
is_blocked
device_limit
authorized_devices
last_license_refresh
offline_license_days
```

---

# 12. Estrutura recomendada de plano no banco

## 12.1. MVP usando user_metadata

Para começar rápido, pode usar `user_metadata`, pois o projeto já utiliza esse padrão.

Exemplo:

```json
{
  "plan_type": "demo",
  "is_trial": true,
  "subscription_start": "2026-06-24",
  "subscription_end": "2026-06-29",
  "has_seletor": true,
  "has_diagnostico": true,
  "max_reports": 0,
  "reports_used": 0,
  "max_nozzles_per_report": 12,
  "can_generate_pdf": false,
  "can_export_csv": false,
  "can_sync_cloud": false,
  "can_use_pwm": false,
  "can_use_dual_nozzle": false
}
```

Para laudo avulso:

```json
{
  "plan_type": "single_report",
  "has_seletor": true,
  "has_diagnostico": true,
  "max_reports": 1,
  "reports_used": 0,
  "max_nozzles_per_report": 999,
  "can_generate_pdf": true,
  "can_export_csv": false,
  "can_sync_cloud": true,
  "single_report_valid_until": "2026-07-01"
}
```

Para PRO:

```json
{
  "plan_type": "pro_monthly",
  "has_seletor": true,
  "has_diagnostico": true,
  "max_reports": 9999,
  "reports_used": 0,
  "max_nozzles_per_report": 999,
  "can_generate_pdf": true,
  "can_export_csv": true,
  "can_sync_cloud": true,
  "can_use_pwm": true,
  "can_use_dual_nozzle": true
}
```

---

## 12.2. Estrutura melhor para produção

Depois, migrar para tabelas próprias:

### Tabela `subscriptions`

```sql
user_id
plan_type
status
subscription_start
subscription_end
max_reports
reports_used
max_nozzles_per_report
can_generate_pdf
can_export_csv
can_export_json
can_sync_cloud
can_use_pwm
can_use_dual_nozzle
can_use_custom_logo
is_blocked
created_at
updated_at
```

### Tabela `report_credits`

```sql
id
user_id
credit_type
total_credits
used_credits
valid_until
created_at
updated_at
```

### Tabela `licenses`

```sql
id
user_id
device_id
plan_type
entitlements_json
valid_until
signed_license
created_at
last_refresh_at
```

---

# 13. Função central recomendada: Feature Guard

Criar uma função única para controlar permissões nos dois apps:

```js
function canUse(feature) {
  const entitlements = window.currentEntitlements || {};

  if (entitlements.is_blocked) return false;

  const now = new Date();

  if (entitlements.subscription_end) {
    const end = new Date(entitlements.subscription_end);
    end.setHours(23, 59, 59, 999);
    if (end < now) return false;
  }

  return entitlements[feature] === true;
}
```

Exemplos de uso:

```js
if (!canUse('can_generate_pdf')) {
  showUpgradeModal('pdf');
  return;
}
```

```js
if (!canUse('can_use_pwm')) {
  showUpgradeModal('pwm');
  return;
}
```

```js
if (currentNozzleCount > entitlements.max_nozzles_per_report) {
  showUpgradeModal('nozzle_limit');
  return;
}
```

---

# 14. Pontos de bloqueio no Seletor de Bicos

No Seletor, bloquear ou limitar:

1. `generateReport()`
2. `openSaveModal()`
3. `saveActiveSimulation()`
4. uso do CRM completo;
5. uso de PWM;
6. uso de Bico Duplo;
7. exportações;
8. carregamento de múltiplas máquinas;
9. salvamento em nuvem.

## 14.1. Ações recomendadas para Demo

### Ao clicar em salvar calibração

Mensagem:

> Recurso PRO: para salvar calibrações em clientes e máquinas, ative o plano PRO.

### Ao clicar em gerar relatório

Mensagem:

> A geração de relatório técnico em PDF está disponível no Laudo Avulso ou na assinatura PRO.

### Ao clicar em PWM ou Bico Duplo

Mensagem:

> Os modos avançados PWM e Bico Duplo fazem parte do plano PRO.

---

# 15. Pontos de bloqueio no Diagnóstico de Vazão

No Diagnóstico, bloquear ou limitar:

1. quantidade máxima de bicos;
2. geração de PDF;
3. salvar no histórico;
4. exportar CSV;
5. exportar JSON;
6. importar JSON;
7. sincronizar com nuvem;
8. laudo sem marca d’água.

## 15.1. Regra do limite de bicos

```js
if (plan_type === 'demo' && totalNozzles > 12) {
  showUpgradeModal('diagnostico_completo');
  return;
}
```

Mensagem:

> No modo demonstração, a coleta é limitada a 12 bicos. Para aferir a barra completa, compre um Laudo Avulso ou assine o PRO.

---

# 16. Consumo de crédito do Laudo Avulso

## 16.1. Quando consumir o crédito

O crédito do laudo avulso deve ser consumido quando o usuário gerar o laudo profissional.

Melhor evento:

```text
PDF profissional gerado com sucesso
```

Ou, em arquitetura mais segura:

```text
Laudo salvo/sincronizado como oficial no servidor
```

---

## 16.2. Offline

Como o app precisa funcionar offline, o laudo avulso precisa ter regra própria.

### Fluxo recomendado

1. Usuário compra laudo avulso com internet.
2. Servidor gera licença/crédito.
3. App salva licença offline temporária.
4. Usuário vai a campo.
5. Gera laudo offline.
6. O app marca:
   - crédito consumido localmente;
   - laudo pendente de sincronização.
7. Quando voltar internet:
   - sincroniza laudo;
   - servidor baixa o crédito oficialmente;
   - gera ID/QR oficial.

---

## 16.3. Texto no PDF offline

Se estiver offline:

> Laudo gerado offline — pendente de sincronização e validação em nuvem.

Depois de sincronizado:

> Laudo validado em nuvem — ID: SP-XXXXXX.

---

# 17. Segurança comercial recomendada

A segurança deve proteger principalmente o valor comercial:

- PDF profissional;
- laudo oficial;
- histórico em nuvem;
- QR/ID de validação;
- créditos de laudo avulso;
- assinatura ativa.

Não tentar proteger apenas a interface.

## 17.1. Regra principal

> O frontend pode permitir visualização e coleta. O servidor deve validar licença, créditos e geração oficial de laudo.

---

## 17.2. Evitar

- `isPremium = true` simples no frontend;
- confiar apenas em modal;
- esconder botão como segurança;
- liberar PDF completo em demo;
- liberar aferição completa em demo;
- colocar service role no navegador em produção;
- usar apenas localStorage como verdade absoluta de plano.

---

## 17.3. Recomendado

- licença offline com validade curta;
- permissões vindas do servidor;
- RLS no Supabase;
- controle de créditos no banco;
- laudo com ID único;
- QR Code de validação;
- status “pendente de sincronização”;
- assinatura/validação do laudo em nuvem.

---

# 18. Ajustes recomendados na landing page

A landing atual está focada em:

- apresentação guiada;
- mensal;
- anual;
- fundador;
- corporativo.

A recomendação é inserir o **Laudo Avulso** e uma **Demo Limitada** como alternativas de entrada.

## 18.1. Nova seção sugerida

Título:

> Escolha como quer começar

Cards:

1. **Demo gratuita**
2. **Laudo avulso**
3. **Plano PRO**
4. **Corporativo**

---

## 18.2. Card Demo

```text
Demo gratuita
Teste o fluxo com limite de uso.

Inclui:
- Seletor básico;
- Diagnóstico parcial até 12 bicos;
- Relatório na tela;
- Sem PDF profissional.

CTA:
Testar demonstração
```

---

## 18.3. Card Laudo Avulso

```text
Laudo Avulso
Ideal para aferir uma máquina.

Inclui:
- Seletor completo para a máquina;
- Diagnóstico completo;
- 1 PDF profissional;
- Validade de 7 dias;
- Sem assinatura recorrente.

Valor sugerido:
R$ 49,90 por máquina

CTA:
Comprar 1 laudo
```

---

## 18.4. Card PRO

```text
Plano PRO
Para uso recorrente.

Inclui:
- 2 módulos completos;
- laudos profissionais;
- histórico;
- PWA offline;
- suporte WhatsApp.

Valor:
R$ 69/mês ou R$ 574/ano
Oferta fundador:
R$ 430,80/ano no Pix
```

---

# 19. Mensagens de conversão no app

## 19.1. Quando atingir limite de bicos na demo

> Você atingiu o limite do modo demonstração. Para continuar a coleta da barra completa, compre um Laudo Avulso ou assine o PRO.

Botões:

```text
Comprar Laudo Avulso
Assinar PRO
Falar no WhatsApp
```

---

## 19.2. Quando tentar gerar PDF na demo

> O PDF profissional está disponível apenas no Laudo Avulso ou na assinatura PRO. Você pode continuar visualizando o resultado na tela em modo demonstração.

---

## 19.3. Quando usar Seletor avançado na demo

> Os modos PWM e Bico Duplo estão disponíveis no plano PRO. Assine para usar simulações avançadas de máquinas modernas.

---

## 19.4. Quando laudo avulso for consumido

> Laudo profissional gerado com sucesso. Seu crédito de laudo avulso foi utilizado. Para gerar novos laudos, compre outro avulso ou assine o plano PRO.

---

# 20. Ajustes recomendados no painel admin

Adicionar ao modal de Gerenciar Acesso:

## 20.1. Tipo de plano

Campo select:

```text
Demo
Laudo Avulso
PRO Mensal
PRO Anual
Fundador Anual
Corporativo
Livre Interno
```

---

## 20.2. Créditos

Campos:

```text
Créditos de laudo total
Créditos usados
Validade do crédito
```

---

## 20.3. Limites

Campos:

```text
Máximo de bicos por diagnóstico
Máximo de clientes
Máximo de máquinas
```

---

## 20.4. Recursos

Checkboxes:

```text
Acesso ao Seletor
Acesso ao Diagnóstico
PDF profissional
Exportar CSV
Exportar JSON
Sincronização em nuvem
CRM
PWM
Bico Duplo
Logo personalizado
BI
```

---

# 21. Roadmap de implementação

## Fase 1 — rápida

1. Criar `plan_type` no metadata do usuário.
2. Criar `max_nozzles_per_report`.
3. Criar `max_reports` e `reports_used`.
4. Criar `can_generate_pdf`.
5. Travar PDF no demo.
6. Travar diagnóstico completo no demo.
7. Adicionar laudo avulso manual pelo painel admin.
8. Ajustar landing page com novo card de Laudo Avulso.

---

## Fase 2 — intermediária

1. Criar função `canUse(feature)` central.
2. Usar a mesma função no Seletor e Diagnóstico.
3. Criar modal padrão de upgrade.
4. Criar contador visual de créditos.
5. Consumir crédito após geração de PDF.
6. Criar status de laudo:
   - demo;
   - avulso;
   - pro;
   - pendente de sincronização;
   - validado.

---

## Fase 3 — produção mais segura

1. Migrar permissões para tabela `subscriptions`.
2. Criar tabela `report_credits`.
3. Criar licença offline assinada.
4. Criar QR Code de validação do laudo.
5. Criar backend seguro para controle de assinatura/créditos.
6. Evitar service role no navegador.
7. Integrar cobrança futura via Asaas/Mercado Pago/Stripe, se desejado.

---

# 22. Recomendação final

A melhor lógica comercial para o Spray Precision PRO é:

> Demo gratuita mostra o valor, mas não resolve a máquina completa.

> Laudo avulso monetiza o usuário pontual.

> Assinatura PRO atende consultor, revenda e fazenda com uso recorrente.

> Corporativo atende equipes e parceiros.

Essa estrutura evita entregar uma aferição completa de graça, mantém o valor da assinatura e cria uma porta de entrada paga para quem só quer fazer uma máquina.

---

# 23. Resumo executivo

## Modelo comercial sugerido

```text
Demo gratuita:
- Seletor básico;
- Diagnóstico limitado a 12 bicos;
- sem PDF profissional.

Laudo Avulso:
- 1 máquina;
- 1 diagnóstico completo;
- 1 PDF profissional;
- validade 7 dias;
- R$ 49,90 sugerido.

PRO Mensal:
- 2 módulos completos;
- laudos recorrentes;
- R$ 69/mês.

PRO Anual:
- 2 módulos completos;
- R$ 574/ano.

Fundador:
- R$ 430,80/ano no Pix;
- primeiros 30 clientes pagantes.

Corporativo:
- sob medida;
- gestão de equipe;
- white-label;
- BI.
```

## Regra central

```text
Demo não entrega solução completa.
Laudo avulso resolve uma máquina.
Assinatura resolve uso recorrente.
Corporativo resolve equipe/revenda.
```

---
