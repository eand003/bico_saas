# Documento Mestre de Melhorias — Spray Precision PRO

**Projeto:** Spray Precision PRO  
**Módulos:** Seletor de Bicos Enterprise + Diagnóstico de Vazão Manual  
**Arquivos-chave relacionados:**  
1. `admin_super.html` — Painel Master Admin / gestão de usuários, empresas, permissões e BI  
2. `index.html` — Seletor de Bicos Enterprise / PWA com login, CRM, Seletor, PWM, Bico Duplo e relatórios  
3. `a637cd8d-7977-4de4-bb08-678d8683bb1e.html` — Diagnóstico de Vazão Manual / coleta bico a bico e laudo técnico  
4. `homepro_promocional.html` — Landing page / página de tráfego pago e oferta comercial  

**Data:** 24/06/2026  
**Objetivo:** consolidar todas as decisões de melhoria discutidas para orientar a implementação técnica, comercial e de segurança do Spray Precision PRO.

---

# 1. Visão geral da decisão estratégica

O Spray Precision PRO deve ser tratado como uma plataforma SaaS composta por dois módulos principais:

1. **Seletor Inteligente de Bicos**
2. **Diagnóstico de Vazão Manual com Laudo Técnico**

A estratégia decidida é:

> **Demo gratuita mostra o valor, mas não resolve uma máquina completa.**  
> **Laudo avulso resolve uma máquina.**  
> **Assinatura PRO resolve uso recorrente.**  
> **Corporativo resolve equipes, revendas e parceiros.**

Essa lógica evita entregar uma aferição completa de graça, preserva o valor da assinatura e cria uma entrada paga para usuários pontuais.

---

# 2. Arquivos-chave e função de cada um no projeto

---

## 2.1. `admin_super.html`

### Função atual

O `admin_super.html` é o painel administrativo master do SaaS.

Ele já possui:

- login master;
- gestão de usuários;
- gestão de empresas/parceiros;
- criação de usuários;
- edição de acesso;
- bloqueio de usuário;
- data de início e fim de assinatura;
- marcação de conta demo;
- controle de acesso ao Seletor de Bicos;
- controle de acesso ao Diagnóstico de Vazão;
- painel de empresas;
- CRM geral;
- BI e estatísticas;
- gestão de branding das empresas parceiras;
- botão de renovação via WhatsApp.

### Pontos positivos

O painel já está bem encaminhado para ser a central comercial do SaaS.

Ele já trabalha com metadados como:

```text
is_trial
subscription_start
subscription_end
is_blocked
has_seletor
has_diagnostico
partner_id
partner_name
partner_color
partner_logo
partner_whatsapp
```

Isso permite evoluir para a lógica de planos sem refazer a base.

---

## 2.2. `index.html` — Seletor Enterprise

### Função atual

O `index.html` do Enterprise é o módulo do Seletor de Bicos.

Ele já possui:

- login/cadastro;
- Supabase;
- PWA;
- modo offline pré-autorizado;
- CRM de clientes e máquinas;
- simulação de bicos;
- modo convencional;
- modo PWM;
- modo bico duplo;
- geração de relatório técnico;
- tradução PT/ES/EN;
- termos de uso;
- telemetria;
- estatísticas anônimas;
- histórico local;
- tentativa de controle por assinatura e bloqueio.

### Pontos positivos

O Seletor é o melhor módulo para atrair o usuário, pois entrega valor rápido e ajuda o usuário a entender o conceito técnico.

Ele deve ser a principal “porta de entrada” do Spray Precision PRO.

---

## 2.3. `a637cd8d-7977-4de4-bb08-678d8683bb1e.html` — Diagnóstico de Vazão Manual

### Função atual

Esse é o módulo de diagnóstico/aferição bico a bico.

Ele já possui:

- login;
- modo offline/local;
- coleta guiada;
- modo planilha;
- histórico;
- relatório técnico;
- exportação PDF/CSV/JSON;
- cálculo de CV;
- mapa visual da barra;
- classificação OK/abaixo/acima/crítico;
- ajuda interna;
- integração com arquivos JS externos.

### Pontos positivos

É o módulo de maior valor profissional, pois gera laudo e diagnóstico de barra.

### Ponto crítico

Esse módulo não pode ser liberado completamente em modo demo, pois se o usuário aferir uma máquina completa de graça, o problema dele estará resolvido sem pagamento.

---

## 2.4. `homepro_promocional.html`

### Função atual

É a página comercial usada no tráfego pago.

Ela já posiciona o Spray Precision PRO como solução com dois módulos:

- Seletor Inteligente de Bicos;
- Diagnóstico de Vazão Manual.

Ela também já apresenta:

- oferta de lote fundador;
- R$ 35,90/mês no anual via Pix;
- R$ 430,80/ano para primeiros clientes;
- plano mensal R$ 69/mês;
- plano anual R$ 574/ano;
- plano corporativo sob medida;
- acesso orientado via WhatsApp;
- argumento de laudo técnico e PWA offline.

### O que precisa mudar

A landing deve incluir claramente:

- Demo gratuita limitada;
- Laudo avulso por máquina;
- PRO Mensal;
- PRO Anual;
- Corporativo.

---

# 3. Melhoria 1 — Nova lógica comercial

---

## 3.1. Problema identificado

O modelo “teste grátis completo” pode gerar uso indevido.

Especialmente no caso de um produtor que deseja aferir apenas uma máquina:

> Se ele conseguir fazer uma aferição completa gratuitamente, ele não terá motivo imediato para pagar.

Portanto, a demo deve permitir experimentar, mas não concluir um serviço completo.

---

## 3.2. Modelo comercial decidido

A nova lógica deve ter quatro níveis:

1. **Demo gratuita limitada**
2. **Laudo avulso**
3. **Assinatura PRO**
4. **Corporativo / Parceiro**

---

# 4. Plano Demo Gratuita Limitada

## 4.1. Objetivo

A demo deve gerar desejo de assinatura, não substituir o produto pago.

Mensagem conceitual:

> Teste o fluxo. Para aferir a máquina completa e gerar laudo profissional, ative um plano.

---

## 4.2. Demo no Seletor de Bicos

### Liberar

- simulação básica;
- modo convencional;
- visualização de top recomendações;
- alteração de parâmetros principais;
- entendimento da janela operacional;
- resultado parcial na tela.

### Limitar

- bloquear PDF técnico;
- bloquear salvar calibração em CRM;
- bloquear modos avançados PWM e Bico Duplo;
- bloquear histórico completo;
- bloquear exportações;
- bloquear laudo profissional.

### Mensagem sugerida

```text
Você está usando o modo demonstração do Seletor.
Para salvar calibrações, gerar PDF técnico e usar modos avançados como PWM e Bico Duplo, ative o Spray Precision PRO.
```

---

## 4.3. Demo no Diagnóstico de Vazão

### Liberar

- fluxo demonstrativo;
- coleta limitada;
- resultado parcial;
- visualização de mapa parcial;
- simulação de relatório na tela.

### Limitar

- máximo de 12 bicos por diagnóstico;
- sem PDF profissional;
- sem CSV/JSON;
- sem histórico completo;
- sem QR Code;
- sem laudo oficial;
- sem sincronização em nuvem;
- sem aferição completa da barra.

### Regra sugerida

```text
max_nozzles_per_report = 12
```

### Mensagem sugerida

```text
Modo demonstração: você pode testar o fluxo com até 12 bicos.
Para aferir a barra completa e gerar o laudo profissional, compre um Laudo Avulso ou assine o PRO.
```

---

# 5. Plano Laudo Avulso

## 5.1. Objetivo

Monetizar o usuário que deseja fazer apenas uma máquina, sem assinatura recorrente.

Esse plano é importante para não perder o produtor pontual.

---

## 5.2. Nome sugerido

```text
Laudo Avulso Spray Precision
```

ou

```text
Aferição Avulsa por Máquina
```

---

## 5.3. O que libera

- 1 máquina;
- 1 diagnóstico completo;
- 1 PDF profissional;
- uso do Seletor para essa máquina;
- histórico daquele laudo;
- funcionamento offline após ativação;
- validade temporária.

---

## 5.4. Limitações

- sem laudos ilimitados;
- sem múltiplos clientes;
- sem múltiplas máquinas;
- sem BI;
- sem gestão de equipe;
- sem white-label amplo;
- sem assinatura recorrente;
- sem exportação ilimitada.

---

## 5.5. Validade recomendada

```text
7 dias após ativação
```

O crédito deve ser consumido quando o PDF profissional for gerado ou quando o laudo for salvo como oficial.

---

## 5.6. Preço sugerido

```text
R$ 49,90 por máquina
```

Alternativa mais agressiva:

```text
R$ 39,90 por máquina
```

Recomendação principal:

> Usar R$ 49,90 para não desvalorizar a assinatura mensal.

---

## 5.7. Lógica de comparação

```text
1 laudo avulso = R$ 49,90
2 laudos avulsos = R$ 99,80
Plano mensal = R$ 69,00
```

Assim, a partir da segunda máquina, o plano mensal fica mais vantajoso.

---

# 6. Assinatura PRO

## 6.1. Público

- consultores;
- revendas;
- fazendas com uso recorrente;
- prestadores de serviço;
- equipes técnicas;
- profissionais que geram laudos com frequência.

---

## 6.2. O que libera

- Seletor completo;
- Diagnóstico completo;
- PDF profissional;
- laudos recorrentes;
- CRM de clientes e máquinas;
- histórico local e nuvem;
- PWA offline com licença válida;
- exportação CSV/JSON;
- suporte WhatsApp;
- modos PWM e Bico Duplo;
- relatórios profissionais.

---

## 6.3. Preços atuais mantidos

### Mensal

```text
R$ 69,00/mês
```

### Anual

```text
R$ 574,00/ano
```

Equivalente a:

```text
R$ 47,83/mês
```

### Fundador

```text
R$ 430,80/ano no Pix
```

Equivalente a:

```text
R$ 35,90/mês
```

Condição sugerida:

```text
Primeiros 30 clientes pagantes
```

---

# 7. Corporativo / Parceiro

## 7.1. Público

- revendas;
- cooperativas;
- empresas de assistência técnica;
- consultorias;
- equipes comerciais;
- empresas que querem usar o app com sua marca.

---

## 7.2. O que libera

- painel administrativo;
- gestão de usuários;
- gestão de consultores;
- CRM geral;
- BI;
- white-label;
- logo da empresa;
- cor da marca;
- WhatsApp da empresa;
- treinamento dedicado;
- laudos com identidade da empresa;
- acesso multiusuário.

---

# 8. Tabela resumida de planos

| Recurso | Demo | Laudo Avulso | PRO Mensal/Anual | Corporativo |
|---|---:|---:|---:|---:|
| Seletor básico | Sim | Sim | Sim | Sim |
| PWM / Bico Duplo | Não ou limitado | Sim | Sim | Sim |
| Diagnóstico parcial | Sim | Sim | Sim | Sim |
| Diagnóstico completo | Não | 1 máquina | Sim | Sim |
| Limite de bicos | 12 | Completo | Completo | Completo |
| PDF profissional | Não | 1 PDF | Sim | Sim |
| Histórico local | Limitado | Sim | Sim | Sim |
| Histórico nuvem | Não | Limitado | Sim | Sim |
| CSV/JSON | Não | Opcional | Sim | Sim |
| QR/ID validação | Não | Sim | Sim | Sim |
| CRM | Não ou 1 cliente | 1 cliente/máquina | Sim | Sim |
| Logo personalizado | Não | Não | Opcional | Sim |
| BI | Não | Não | Não | Sim |
| Gestão de equipe | Não | Não | Não | Sim |

---

# 9. Melhorias no `admin_super.html`

---

## 9.1. Adicionar campo “Tipo de Plano”

No modal de acesso do usuário, adicionar:

```text
plan_type
```

Opções:

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

## 9.2. Adicionar controle de créditos

Campos:

```text
max_reports
reports_used
single_report_valid_until
```

Exemplo:

```text
Laudo Avulso:
max_reports = 1
reports_used = 0
single_report_valid_until = data + 7 dias
```

---

## 9.3. Adicionar limite de bicos

Campo:

```text
max_nozzles_per_report
```

Exemplos:

```text
Demo = 12
Laudo Avulso = 999
PRO = 999
```

---

## 9.4. Adicionar permissões granulares

Campos recomendados:

```text
can_generate_pdf
can_export_csv
can_export_json
can_sync_cloud
can_use_pwm
can_use_dual_nozzle
can_use_crm
can_use_bi
can_use_custom_logo
```

---

## 9.5. Melhorar tela de acesso do usuário

No modal atual de acesso, além de Demo, Seletor e Diagnóstico, incluir:

- Tipo de plano;
- Créditos de laudo;
- Créditos usados;
- Validade do crédito;
- Limite de bicos;
- Permissões específicas;
- Status da licença offline;
- Dispositivos autorizados.

---

## 9.6. Segurança do admin

Hoje o painel carrega a `service_role` no navegador. Para protótipo privado, é compreensível, mas para produção é um risco.

### Recomendação

Migrar futuramente para:

- Supabase Edge Functions;
- Vercel Serverless Functions;
- backend protegido;
- service_role apenas no servidor;
- navegador usando apenas anon key + JWT do usuário.

---

# 10. Melhorias no `index.html` — Seletor Enterprise

---

## 10.1. Criar função central de permissões

Implementar uma função única:

```js
function canUse(feature) {
  const entitlements = window.currentEntitlements || {};

  if (entitlements.is_blocked) return false;

  const now = new Date();

  if (entitlements.subscription_end) {
    const end = new Date(entitlements.subscription_end + 'T23:59:59');
    if (end < now) return false;
  }

  return entitlements[feature] === true;
}
```

---

## 10.2. Bloquear recursos por plano

### Demo

Bloquear:

- gerar relatório técnico;
- salvar calibração;
- CRM completo;
- PWM;
- Bico Duplo;
- exportações;
- múltiplos clientes.

### PRO

Liberar tudo.

### Laudo Avulso

Liberar uso do Seletor para uma máquina, mas sem acesso recorrente ilimitado.

---

## 10.3. Pontos do código que precisam usar `canUse()`

- `generateReport()`
- `openSaveModal()`
- `saveActiveSimulation()`
- `setMode('pwm')`
- `setMode('dual')`
- CRM de clientes/máquinas
- exportações futuras
- salvamento em nuvem

---

## 10.4. Mensagens de upgrade

### PDF bloqueado

```text
A geração de relatório técnico em PDF está disponível no Laudo Avulso ou na assinatura PRO.
```

### PWM bloqueado

```text
Os modos avançados PWM e Bico Duplo fazem parte do plano PRO.
```

### CRM bloqueado

```text
Para salvar clientes e máquinas, ative o plano PRO.
```

---

## 10.5. Manter Seletor como porta de entrada

O Seletor deve ser a ferramenta que o usuário consegue experimentar com menos fricção.

Ele deve gerar desejo para o Diagnóstico e para o PDF.

---

# 11. Melhorias no Diagnóstico de Vazão Manual

---

# 11.1. Melhorar conceito de “Vazão Nominal Esperada”

## Problema

O termo atual pode confundir.

O usuário pode pensar que precisa informar:

- vazão ISO de catálogo;
- vazão teórica a 3 bar;
- vazão calculada por L/ha;
- ou vazão total do monitor dividida pelo número de bicos.

## Decisão

Substituir o conceito por:

```text
Fonte da Referência
```

E o campo principal por:

```text
Vazão de Referência
```

ou:

```text
Vazão de Referência da Ponta Nova
```

---

## 11.2. Criar opções de fonte de referência

Opções recomendadas:

1. **Bico novo medido em campo** — melhor opção.
2. **Amostra da barra** — provisória.
3. **Tabela ISO / catálogo** — técnica.
4. **Vazão calculada por L/ha** — validação de aplicação.
5. **Monitor da máquina** — estimativa com alerta.

---

## 11.3. Bico novo como melhor referência

Fluxo recomendado:

1. Colocar a máquina com todas as seções ligadas.
2. Estabilizar pressão próxima da condição de trabalho.
3. Instalar bico novo do mesmo modelo.
4. Coletar com proveta.
5. Usar essa vazão como referência.
6. Coletar os demais bicos.
7. Gerar laudo comparativo.

Texto no app:

```text
Colete um bico novo do mesmo modelo, na mesma pressão de teste.
Essa vazão será usada como referência para classificar os demais bicos.
```

---

## 11.4. Quando não houver bico novo

Permitir:

```text
Referência por amostra da barra
```

Procedimento:

1. coletar 10 a 15 bicos distribuídos na barra;
2. usar média/mediana;
3. excluir extremos;
4. marcar como referência provisória;
5. recomendar validação futura com bico novo.

---

## 11.5. Monitor da máquina como última opção

O método:

```text
L/min total do monitor ÷ número de bicos
```

deve ser aceito apenas como estimativa.

Mensagem obrigatória:

```text
Atenção: este método depende da calibração do sensor de vazão, do monitor e da pressão informada pela máquina. Use com cautela.
```

---

# 12. Melhorias na Etapa 4 do Diagnóstico — Coleta

---

## 12.1. Problema identificado

Os botões atuais:

```text
Marcar Entupido
Marcar Vazando
```

fazem sentido na prática, mas não devem ficar como ações isoladas sem impacto claro no relatório.

---

## 12.2. Decisão

Transformar esses botões em um conceito maior:

```text
Ocorrências de Campo
```

ou:

```text
Falhas observadas durante a inspeção
```

---

## 12.3. Novo layout sugerido

```text
Volume coletado: ______ mL

[Anterior] [Pular] [Salvar e Próximo]

[🚫 Sem vazão / Entupido] [⚠️ Problema observado]
```

---

## 12.4. Botão “Sem vazão / Entupido”

Esse botão deve continuar como atalho rápido.

Ao clicar:

- marcar bico como sem vazão/entupido;
- classificar como falha crítica;
- salvar ocorrência manual;
- aparecer no mapa;
- aparecer no relatório;
- gerar recomendação;
- permitir recoleta.

---

## 12.5. Trocar “Marcar Vazando” por “Problema observado”

Dentro do modal/lista:

- Vazamento no conjunto;
- Filtro sujo;
- Ponta diferente instalada;
- Ponta quebrada;
- Jato irregular;
- Bico substituído;
- Não coletado;
- Outra observação.

---

## 12.6. Separar medição de vazão e ocorrência

No relatório, separar:

### Status de vazão

- OK;
- abaixo;
- acima;
- crítico abaixo;
- crítico acima;
- não coletado.

### Ocorrências de campo

- sem vazão;
- vazamento;
- filtro sujo;
- ponta danificada;
- ponta diferente;
- bico substituído;
- jato irregular;
- recoleta.

---

# 13. Melhorias no Relatório Técnico do Diagnóstico

---

## 13.1. Separar indicadores principais

O relatório deve separar:

1. **Uniformidade da barra**
   - CV.
2. **Aderência à referência**
   - média real vs referência.
3. **Condição individual dos pontos**
   - status bico a bico.
4. **Ocorrências observadas**
   - problemas manuais registrados em campo.
5. **Metodologia usada**
   - fonte da referência.

---

## 13.2. Nova seção obrigatória

Adicionar:

```text
Ocorrências observadas em campo
```

Exemplo:

```text
Bico 17: sem vazão / provável obstrução.
Bico 22: vazamento no conjunto porta-bico.
Bico 31: filtro individual sujo.
```

---

## 13.3. Texto por metodologia

### Bico novo

```text
Este diagnóstico foi realizado por comparação direta com uma ponta nova do mesmo modelo, aferida em campo na pressão de teste informada.
```

### Amostra da barra

```text
Este diagnóstico foi realizado com referência provisória calculada a partir de amostra de bicos da própria barra. Recomenda-se validação futura com ponta nova.
```

### Monitor da máquina

```text
Este diagnóstico foi realizado com referência estimada a partir da vazão total informada pelo monitor dividida pelo número de bicos ativos. Resultado sujeito à calibração do sensor de vazão e da pressão informada.
```

---

## 13.4. Confiabilidade da referência

Adicionar ao laudo:

```text
Confiabilidade da referência: Alta / Média / Baixa
```

Sugestão:

| Fonte | Confiabilidade |
|---|---|
| Bico novo medido em campo | Alta |
| Amostra da barra | Média |
| Catálogo ISO com pressão conferida | Média/Alta |
| Monitor da máquina | Baixa/Média |
| Monitor divergente do manômetro | Baixa |

---

# 14. Segurança e PWA Offline

---

## 14.1. Decisão principal

Como é PWA e precisa funcionar offline, não é possível proteger 100% a lógica no frontend.

Então a segurança deve proteger o valor comercial:

- PDF profissional;
- laudo oficial;
- QR/ID de validação;
- sincronização em nuvem;
- créditos de laudo avulso;
- assinatura ativa.

---

## 14.2. Licença offline

Criar lógica de licença offline temporária.

A licença deve conter:

```text
user_id
plan_type
features
device_id
valid_until
signature
```

Validade sugerida:

```text
7 a 15 dias
```

---

## 14.3. Primeiro acesso online obrigatório

Fluxo:

1. Usuário faz login online.
2. Servidor valida assinatura.
3. Servidor gera licença offline.
4. App salva licença.
5. App funciona offline enquanto a licença for válida.

---

## 14.4. Laudo offline

Se estiver offline, o PDF deve mostrar:

```text
Laudo gerado offline — pendente de sincronização e validação em nuvem.
```

Após sincronizar:

```text
Laudo validado em nuvem — ID: SP-XXXXXX.
```

---

## 14.5. Service role

Não usar `service_role` no navegador em produção.

Migrar para backend/Edge Function.

---

## 14.6. CDNs

Os arquivos usam bibliotecas externas por CDN.

Para PWA de campo, recomenda-se empacotar localmente:

```text
chart.min.js
chartjs-plugin-annotation.min.js
supabase.min.js
```

E cachear no Service Worker.

---

# 15. Melhorias na `homepro_promocional.html`

---

## 15.1. Problema

A página já vende mensal, anual, fundador e corporativo, mas ainda não comunica claramente a lógica:

```text
Demo limitada
Laudo avulso
PRO recorrente
Corporativo
```

---

## 15.2. Nova seção sugerida

Título:

```text
Escolha como quer começar
```

Cards:

1. Demo gratuita
2. Laudo avulso
3. PRO Mensal/Anual
4. Corporativo

---

## 15.3. Card Demo sugerido

```text
Demo gratuita
Teste o fluxo sem compromisso.

Inclui:
- Seletor básico;
- diagnóstico parcial até 12 bicos;
- relatório apenas na tela;
- sem PDF profissional.

CTA:
Testar demonstração
```

---

## 15.4. Card Laudo Avulso sugerido

```text
Laudo Avulso
Ideal para aferir uma máquina.

Inclui:
- Seletor completo para a máquina;
- diagnóstico completo;
- 1 PDF profissional;
- validade de 7 dias;
- sem assinatura recorrente.

Preço:
R$ 49,90 por máquina

CTA:
Comprar 1 laudo
```

---

## 15.5. Card PRO sugerido

```text
PRO
Para uso recorrente.

Inclui:
- 2 módulos completos;
- laudos profissionais;
- histórico;
- PWA offline;
- suporte via WhatsApp.

R$ 69/mês
ou R$ 574/ano
```

---

## 15.6. Card Fundador

Manter destaque:

```text
Plano Fundador
R$ 430,80/ano no Pix
equivalente a R$ 35,90/mês
primeiros 30 clientes pagantes
```

---

# 16. Mensagens de conversão no app

---

## 16.1. Limite de bicos atingido

```text
Você atingiu o limite do modo demonstração.
Para continuar a coleta da barra completa, compre um Laudo Avulso ou assine o PRO.
```

Botões:

```text
Comprar Laudo Avulso
Assinar PRO
Falar no WhatsApp
```

---

## 16.2. PDF bloqueado

```text
O PDF profissional está disponível apenas no Laudo Avulso ou na assinatura PRO.
Você pode continuar visualizando o resultado na tela em modo demonstração.
```

---

## 16.3. Crédito de laudo consumido

```text
Laudo profissional gerado com sucesso.
Seu crédito de laudo avulso foi utilizado.
Para gerar novos laudos, compre outro avulso ou assine o plano PRO.
```

---

## 16.4. Assinatura expirada

```text
Seu acesso expirou.
Você ainda pode visualizar seus dados salvos, mas para gerar novos laudos profissionais é necessário renovar o acesso.
```

---

# 17. Estrutura de dados recomendada

---

## 17.1. MVP no user_metadata

Para implementação rápida:

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

---

## 17.2. Laudo avulso

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

---

## 17.3. PRO

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

## 17.4. Estrutura ideal futura

Criar tabelas:

```text
subscriptions
report_credits
licenses
report_validations
```

---

# 18. Roadmap de implementação

---

## Fase 1 — Implementação rápida

1. Criar `plan_type`.
2. Criar `max_nozzles_per_report`.
3. Criar `max_reports`.
4. Criar `reports_used`.
5. Criar `can_generate_pdf`.
6. Travar PDF no Demo.
7. Travar diagnóstico completo no Demo.
8. Criar Laudo Avulso manual no admin.
9. Atualizar landing com card Laudo Avulso.
10. Ajustar mensagens de upgrade.

---

## Fase 2 — Integração entre módulos

1. Criar função `canUse(feature)` compartilhada.
2. Usar a mesma lógica no Seletor e Diagnóstico.
3. Criar modal padrão de upgrade.
4. Criar contador de créditos.
5. Consumir crédito ao gerar PDF.
6. Adicionar status:
   - demo;
   - avulso;
   - pro;
   - pendente;
   - validado.

---

## Fase 3 — Segurança e produção

1. Migrar `service_role` para backend.
2. Criar licença offline assinada.
3. Criar QR Code de validação.
4. Criar tabela de assinaturas.
5. Criar tabela de créditos.
6. Criar validação em nuvem.
7. Empacotar bibliotecas externas.
8. Melhorar Service Worker.
9. Integrar cobrança automatizada.

---

# 19. Prioridades finais

## Prioridade máxima

1. Não permitir diagnóstico completo no Demo.
2. Bloquear PDF profissional no Demo.
3. Criar Laudo Avulso.
4. Criar `plan_type`.
5. Criar limite de bicos.
6. Ajustar landing page.

---

## Prioridade técnica no Diagnóstico

1. Trocar “Vazão Nominal Esperada” por “Fonte da Referência”.
2. Adicionar bico novo como referência principal.
3. Criar amostra da barra como referência provisória.
4. Transformar botões Entupido/Vazando em Ocorrências de Campo.
5. Fazer ocorrências aparecerem no relatório.
6. Adicionar confiabilidade da referência.

---

## Prioridade técnica no Seletor

1. Bloquear PDF por permissão.
2. Bloquear PWM/Bico Duplo no Demo.
3. Bloquear CRM completo no Demo.
4. Manter simulação básica como degustação.
5. Criar mensagens de conversão.

---

## Prioridade no Admin

1. Adicionar tipo de plano.
2. Adicionar créditos de laudo.
3. Adicionar limite de bicos.
4. Adicionar permissões granulares.
5. Preparar para migração de service_role.

---

# 20. Resumo executivo final

A plataforma deve evoluir de um app com acesso simples para um SaaS com controle comercial claro.

A estrutura recomendada é:

```text
Demo gratuita:
mostra o valor, mas não resolve uma máquina completa.

Laudo avulso:
resolve uma máquina e monetiza usuário pontual.

PRO:
resolve uso recorrente de consultores, fazendas e revendas.

Corporativo:
resolve equipes, white-label, gestão e BI.
```

O Diagnóstico de Vazão deve se tornar mais técnico e confiável com:

```text
Fonte da referência
Bico novo como referência principal
Ocorrências de campo
Relatório mais claro
Confiabilidade da referência
```

O Seletor Enterprise deve ser a porta de entrada comercial, mas com bloqueio de recursos profissionais.

O Admin deve ser o centro de controle de planos, créditos e permissões.

A Landing deve explicar claramente os caminhos de compra.

---

# 21. Comando conceitual para implementação

```text
Implementar no Spray Precision PRO uma arquitetura comercial baseada em Demo limitada, Laudo Avulso, Assinatura PRO e Corporativo, integrando permissões por usuário nos módulos Seletor Enterprise e Diagnóstico de Vazão, controladas pelo painel admin_super, com bloqueio de PDF profissional, limite de bicos na demo, crédito de laudo avulso, licença offline temporária e mensagens de upgrade alinhadas à landing homepro_promocional.
```

---
