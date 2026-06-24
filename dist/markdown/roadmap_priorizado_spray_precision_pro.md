# Roadmap Priorizado — Spray Precision PRO

**Documento:** revisão e organização dos Markdown anteriores  
**Projeto:** Spray Precision PRO  
**Contexto atual:** o app já está funcionando em campo e entregando resultado sem problemas  
**Data:** 24/06/2026  
**Versão:** v1 — Roadmap realista de implementação

---

# 1. Objetivo deste documento

Este documento organiza todos os planos e revisões anteriores em uma sequência prática de prioridades.

Foram considerados os seguintes documentos anteriores:

1. `revisao_app_diagnostico_vazao_spray_precision.md`
2. `revisao_app_diagnostico_vazao_spray_precision_v2.md`
3. `revisao_conceitual_botoes_etapa4_ocorrencias_campo.md`
4. `plano_comercializacao_controle_acesso_spray_precision_pro.md`
5. `documento_mestre_melhorias_spray_precision_pro.md`
6. `plano_app_unico_multiperfil_spray_precision_pro.md`

Também foram considerados os 4 arquivos principais do projeto:

1. `admin_super.html`
2. `index.html` — Seletor Enterprise
3. `a637cd8d-7977-4de4-bb08-678d8683bb1e.html` — Diagnóstico de Vazão Manual
4. `homepro_promocional.html`

---

# 2. Diretriz principal

Como o app já está funcionando em campo, a regra principal deve ser:

> **Não mexer primeiro no núcleo que já funciona.**

O foco inicial deve ser:

1. organizar modelo comercial;
2. proteger acesso;
3. melhorar comunicação do valor;
4. adicionar controles sem quebrar o fluxo atual;
5. melhorar o relatório de forma incremental;
6. só depois evoluir para frota, multiusuário, BI e arquitetura avançada.

---

# 3. O que não fazer agora

Evitar neste momento:

- refazer o app do zero;
- dividir o produto em vários apps;
- mudar toda a estrutura de banco antes de vender;
- criar dashboard corporativo antes de validar clientes pagantes;
- implementar BI completo antes de ter uso real;
- complicar demais os planos;
- mexer nos cálculos que já estão entregando resultado;
- fazer uma migração grande sem backup e teste;
- bloquear o uso offline de forma que atrapalhe o campo.

---

# 4. Ordem correta de pensamento

A ordem ideal é:

```text
1. Manter funcionando
2. Comercializar melhor
3. Controlar acesso
4. Melhorar relatório
5. Criar laudo avulso
6. Começar painel de frota simples
7. Evoluir para multiusuário
8. Criar BI e white-label
```

---

# 5. Resumo das decisões tomadas

## 5.1. Produto

O Spray Precision PRO deve continuar sendo um **app único** com dois módulos principais:

- Seletor de Bicos;
- Diagnóstico de Vazão Manual.

Não criar apps separados para consultor, fazenda e empresa.

---

## 5.2. Comercial

Modelo decidido:

```text
Demo gratuita limitada
Laudo avulso por máquina
Assinatura PRO individual
Plano Fazenda
Plano Empresa / Revenda / Parceiro
Corporativo sob medida
```

---

## 5.3. Segurança

O app deve continuar funcionando offline, mas a camada profissional deve ser protegida:

- PDF profissional;
- laudo validado;
- QR Code;
- sincronização;
- créditos de laudo;
- assinatura ativa;
- permissões por recurso.

---

## 5.4. Diagnóstico

O Diagnóstico de Vazão deve evoluir para um relatório mais técnico com:

- fonte da referência;
- bico novo como referência principal;
- confiabilidade da referência;
- ocorrências de campo;
- separação entre vazão e falha mecânica;
- relatório mais explicativo;
- recomendações práticas.

---

## 5.5. Fazenda/Frota

Para fazendas com múltiplos pulverizadores, o app deve evoluir para:

> **Sistema de controle da qualidade de aplicação da frota.**

Mas isso deve vir em etapas, sem travar a comercialização atual.

---

# 6. Priorização geral

## Prioridade 0 — Preservar o que funciona

Antes de qualquer melhoria:

1. salvar versão atual estável;
2. criar cópia de segurança;
3. versionar no GitHub;
4. registrar quais arquivos estão em produção;
5. testar fluxo completo offline;
6. testar geração de laudo;
7. testar login;
8. testar em celular.

### Objetivo

Garantir que qualquer nova implementação possa ser revertida.

### Status recomendado

```text
Obrigatório antes de mexer no código.
```

---

# 7. Etapa 1 — Comercialização e landing page

## Por que vem primeiro

Você já tem app funcional. O gargalo agora não é tecnologia, é transformar isso em cliente pagante sem entregar tudo de graça.

## Arquivo principal

```text
homepro_promocional.html
```

## O que fazer

1. Ajustar a landing para explicar melhor os caminhos de compra:
   - Demo gratuita;
   - Laudo avulso;
   - PRO mensal;
   - PRO anual;
   - Plano fundador;
   - Fazenda/Corporativo.

2. Inserir seção:

```text
Escolha como quer começar
```

3. Criar cards:
   - Demo limitada;
   - Laudo Avulso;
   - PRO;
   - Fazenda/Empresa.

4. Manter destaque do plano fundador:

```text
R$ 430,80/ano no Pix
equivalente a R$ 35,90/mês
primeiros 30 clientes pagantes
```

5. Explicar que o acesso completo inclui os dois módulos:
   - Seletor de Bicos;
   - Diagnóstico de Vazão Manual.

## Frase sugerida para a landing

```text
Teste o fluxo gratuitamente, compre um laudo avulso para uma máquina ou assine o PRO para uso recorrente.
```

## O que evitar

Não prometer:

```text
Teste grátis completo
```

Preferir:

```text
Demonstração limitada
```

## Resultado esperado

A página já começa a filtrar melhor:

- curioso vai para demo;
- produtor pontual vai para laudo avulso;
- consultor vai para assinatura;
- fazenda maior chama no WhatsApp.

## Prioridade

```text
Muito alta
```

---

# 8. Etapa 2 — Ajustar painel admin para planos simples

## Por que vem agora

Antes de automatizar cobrança, é melhor conseguir liberar manualmente tipos de acesso pelo admin.

## Arquivo principal

```text
admin_super.html
```

## O que já existe

O painel já controla:

```text
is_trial
subscription_start
subscription_end
is_blocked
has_seletor
has_diagnostico
```

Isso já é suficiente para evoluir.

## O que adicionar primeiro

### Campo 1 — Tipo de plano

```text
plan_type
```

Valores:

```text
demo
single_report
pro_monthly
pro_annual
founder_annual
farm
company
enterprise
free_internal
```

---

### Campo 2 — Limite de bicos

```text
max_nozzles_per_report
```

Valores sugeridos:

```text
Demo = 12
Laudo avulso = 999
PRO = 999
```

---

### Campo 3 — Créditos de laudo

```text
max_reports
reports_used
single_report_valid_until
```

Exemplo de laudo avulso:

```text
max_reports = 1
reports_used = 0
validade = 7 dias
```

---

### Campo 4 — Permissões básicas

```text
can_generate_pdf
can_export_csv
can_sync_cloud
can_use_pwm
can_use_dual_nozzle
can_use_crm
```

## Implementação recomendada

No início, pode manter em `user_metadata`, pois isso evita migração grande.

Depois, migrar para tabelas próprias.

## Resultado esperado

Você consegue vender e liberar manualmente:

- Demo;
- Laudo avulso;
- Mensal;
- Anual;
- Fundador;
- Fazenda;
- Empresa.

## Prioridade

```text
Muito alta
```

---

# 9. Etapa 3 — Feature Guard único

## Por que é importante

Hoje existem permissões espalhadas. A recomendação é criar uma função central para checar acesso.

## Arquivos envolvidos

```text
index.html
Diagnóstico de Vazão
admin_super.html indiretamente
```

## Conceito

Criar algo como:

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

## Onde usar

No Seletor:

```text
generateReport()
openSaveModal()
saveActiveSimulation()
setMode('pwm')
setMode('dual')
CRM
```

No Diagnóstico:

```text
gerar PDF
exportar CSV
exportar JSON
sincronizar
coleta acima do limite demo
salvar histórico completo
```

## Resultado esperado

Você cria uma camada de controle sem reescrever o app.

## Prioridade

```text
Muito alta
```

---

# 10. Etapa 4 — Demo limitada e Laudo Avulso

## Por que vem antes das melhorias técnicas profundas

Porque isso resolve a principal preocupação comercial:

> usuário testar sem resolver a máquina completa de graça.

## Regra da Demo

### Seletor Demo

Permitir:

- simulação básica;
- modo convencional;
- visualização de recomendações;
- alteração de parâmetros.

Bloquear:

- PDF;
- CRM completo;
- PWM;
- Bico Duplo;
- exportações;
- salvamento em nuvem.

---

### Diagnóstico Demo

Permitir:

- teste do fluxo;
- até 12 bicos;
- resultado parcial na tela.

Bloquear:

- barra completa;
- PDF profissional;
- CSV/JSON;
- histórico completo;
- QR Code;
- laudo oficial.

## Regra do Laudo Avulso

Liberar:

- 1 máquina;
- 1 diagnóstico completo;
- 1 PDF profissional;
- validade de 7 dias;
- uso offline após ativação.

Consumir crédito quando:

```text
PDF profissional for gerado
```

ou:

```text
laudo for salvo como oficial
```

## Preço sugerido

```text
R$ 49,90 por máquina
```

Alternativa:

```text
R$ 39,90 por máquina
```

## Resultado esperado

Você monetiza o usuário pontual sem prejudicar a assinatura.

## Prioridade

```text
Muito alta
```

---

# 11. Etapa 5 — Melhorias leves no Diagnóstico sem quebrar o fluxo

## Por que não mexer pesado agora

O Diagnóstico já funciona em campo. Então as melhorias devem primeiro ser de linguagem, relatório e metadados, sem alterar a lógica central de coleta.

## Arquivo principal

```text
Diagnóstico de Vazão Manual
```

## Mudança 1 — Trocar “Vazão Nominal Esperada”

Substituir por:

```text
Vazão de Referência
```

ou:

```text
Fonte da Referência
```

## Mudança 2 — Adicionar fonte da referência

Opções:

```text
Bico novo medido em campo
Amostra da barra
Tabela ISO / catálogo
Vazão calculada por L/ha
Monitor da máquina
```

## Mudança 3 — Adicionar confiabilidade

```text
Alta
Média
Baixa
```

Exemplo:

```text
Bico novo medido em campo = Alta
Amostra da barra = Média
Monitor da máquina = Baixa/Média
```

## Mudança 4 — Ajustar texto do relatório

Inserir uma seção:

```text
Metodologia do Diagnóstico
```

Exemplo:

```text
Este diagnóstico foi realizado com base em ponta nova do mesmo modelo, aferida em campo na pressão de teste informada.
```

## Resultado esperado

O relatório fica mais profissional sem mudar a coleta que já funciona.

## Prioridade

```text
Alta
```

---

# 12. Etapa 6 — Ocorrências de campo na Etapa 4

## Por que é importante

Isso melhora muito o valor técnico do laudo.

## Arquivo principal

```text
Diagnóstico de Vazão Manual
```

## Mudança principal

Substituir o conceito isolado:

```text
Marcar Vazando
```

por:

```text
Problema observado
```

## Layout sugerido

```text
[Anterior] [Pular] [Salvar e Próximo]

[🚫 Sem vazão / Entupido] [⚠️ Problema observado]
```

## Problemas observados

```text
Vazamento no conjunto
Filtro sujo
Ponta diferente instalada
Ponta danificada
Jato irregular
Bico substituído
Não coletado
Outra observação
```

## Regra importante

Separar:

```text
Status de vazão
```

de:

```text
Ocorrência de campo
```

Exemplo:

```text
Vazão dentro da tolerância, porém com vazamento no porta-bico.
```

## Resultado esperado

O relatório deixa de ser apenas numérico e vira diagnóstico técnico de campo.

## Prioridade

```text
Alta
```

---

# 13. Etapa 7 — Melhorias no relatório técnico

## Por que vem depois

Depois de incluir referência e ocorrências, o relatório pode ser reorganizado.

## Novo relatório deve conter

1. Identificação
2. Máquina
3. Condição de teste
4. Fonte da referência
5. Confiabilidade da referência
6. Resumo da barra
7. CV
8. Média real
9. Bicos OK
10. Bicos abaixo/acima
11. Críticos
12. Ocorrências de campo
13. Recomendações
14. Metodologia
15. QR/ID de validação no futuro

## Nova seção recomendada

```text
Ocorrências observadas em campo
```

## Nova seção recomendada

```text
Recomendações técnicas
```

## Resultado esperado

O relatório passa a ser o maior diferencial contra soluções de mercado.

## Prioridade

```text
Alta
```

---

# 14. Etapa 8 — Integração comercial entre Seletor e Diagnóstico

## Objetivo

Fazer os dois módulos parecerem uma plataforma única, não apps separados.

## Arquivos envolvidos

```text
index.html — Seletor Enterprise
Diagnóstico de Vazão Manual
Hub / tela inicial
```

## Melhorias

1. Mesmo login.
2. Mesmo plano.
3. Mesma lógica de permissões.
4. Mesmo cliente/fazenda/máquina.
5. Possibilidade de usar dados do Seletor no Diagnóstico.
6. Possibilidade de anexar recomendação de bico no laudo de vazão.

## Exemplo de valor

```text
O bico instalado está aferido, mas não é o melhor para a faixa de velocidade desejada.
```

## Resultado esperado

O Spray Precision PRO passa a ser vendido como plataforma completa.

## Prioridade

```text
Média/Alta
```

---

# 15. Etapa 9 — MVP Fazenda / Frota simples

## Por que só agora

Antes de criar frota completa, primeiro é preciso validar comercialmente o uso básico.

## Conceito

Criar um painel simples:

```text
Frota de Pulverizadores
```

## Primeiros campos

```text
Fazenda
Máquina
Número de bicos
Espaçamento
Última aferição
Status atual
```

## Status

```text
🟢 Apta
🟡 Atenção
🔴 Reprovada
⚪ Sem aferição recente
```

## Card de máquina

```text
Jacto 3030 — 72 bicos
Última aferição: 12/06/2026
CV: 6,8%
Críticas: 2
Status: 🟡 Atenção
```

## Resultado esperado

Já fica possível vender para fazendas com múltiplos pulverizadores sem construir um ERP.

## Prioridade

```text
Média
```

---

# 16. Etapa 10 — Histórico por máquina

## Objetivo

Transformar cada pulverizador em uma ficha técnica.

## Cada máquina deve ter

```text
Dados cadastrais
Configuração da barra
Bico instalado
Histórico de laudos
Status atual
Pendências
Ocorrências anteriores
```

## Resultado esperado

A fazenda enxerga evolução e manutenção de qualidade por máquina.

## Prioridade

```text
Média
```

---

# 17. Etapa 11 — Relatório consolidado da frota

## Por que é importante

É o relatório que conversa com gestor de fazenda.

## Deve conter

```text
Total de pulverizadores avaliados
Máquinas aptas
Máquinas em atenção
Máquinas reprovadas
Máquinas sem aferição recente
Total de bicos avaliados
Pontas críticas
Ocorrências de campo
CV médio da frota
Prioridades de correção
```

## Resultado esperado

O app passa a justificar plano Fazenda com maior valor.

## Prioridade

```text
Média
```

---

# 18. Etapa 12 — Account type e app único multiperfil

## Por que não fazer primeiro

É importante, mas se fizer antes da comercialização e controle básico, vira projeto grande demais.

## Campos futuros

```text
account_type
plan_type
role
organization_id
```

## Tipos de conta

```text
consultant
farm
company
partner
single_user
internal_admin
```

## Resultado esperado

O mesmo app se adapta a:

- consultor;
- fazenda;
- revenda;
- empresa;
- usuário avulso.

## Prioridade

```text
Média
```

---

# 19. Etapa 13 — Gestão de equipe

## Público

- fazendas maiores;
- revendas;
- empresas;
- parceiros.

## Papéis

```text
owner
admin
manager
consultant
technician
operator
viewer
```

## Resultado esperado

Mais valor para planos empresariais.

## Prioridade

```text
Média/Baixa no início
```

---

# 20. Etapa 14 — Segurança avançada / licença offline

## Por que não fazer tudo agora

Segurança avançada é importante, mas pode atrasar a validação comercial.

## O que fazer agora

- não confiar em botão escondido;
- bloquear PDF e laudo oficial por permissão;
- controlar demo/laudo avulso;
- limitar bicos no demo.

## O que fazer depois

- licença offline assinada;
- QR Code de validação;
- backend/Edge Functions;
- service_role fora do navegador;
- tabela `subscriptions`;
- tabela `report_credits`;
- tabela `licenses`.

## Resultado esperado

Reduz risco de burla sem prejudicar uso offline.

## Prioridade

```text
Alta para bloqueios simples
Média para arquitetura avançada
```

---

# 21. Etapa 15 — QR Code por máquina

## Objetivo

Facilitar uso em campo.

## Como seria

Cada pulverizador teria um QR Code:

```text
Spray Precision PRO
Pulverizador: Jacto 3030
```

Ao escanear:

- abre ficha da máquina;
- mostra último status;
- permite nova aferição;
- mostra histórico.

## Prioridade

```text
Baixa/Média
```

Não fazer antes de histórico por máquina.

---

# 22. Etapa 16 — BI e white-label

## Público

- revendas;
- parceiros;
- empresas;
- corporativo.

## Recursos

```text
Logo da empresa
Cor da marca
WhatsApp do parceiro
Relatório com identidade visual
Indicadores de equipe
Ranking de problemas
Laudos por consultor
Clientes atendidos
```

## Prioridade

```text
Baixa no início
Alta apenas quando houver cliente empresa/parceiro pagando
```

---

# 23. Ordem final recomendada

## Ciclo 1 — Comercialização segura

Foco: vender sem entregar tudo de graça.

```text
1. Backup da versão atual
2. Ajustar landing page
3. Criar plano Demo / Laudo Avulso / PRO
4. Adicionar campos básicos no admin
5. Criar Feature Guard
6. Limitar Demo
7. Bloquear PDF profissional no Demo
8. Liberar Laudo Avulso manualmente
```

---

## Ciclo 2 — Melhorar valor do laudo

Foco: diferenciar tecnicamente.

```text
1. Trocar "Vazão Nominal" por "Vazão de Referência"
2. Adicionar fonte da referência
3. Adicionar confiabilidade
4. Adicionar metodologia no relatório
5. Adicionar ocorrências de campo
6. Melhorar recomendações técnicas
7. Reorganizar PDF
```

---

## Ciclo 3 — Plataforma com 2 módulos integrados

Foco: parecer SaaS completo.

```text
1. Unificar permissões entre Seletor e Diagnóstico
2. Integrar cliente/fazenda/máquina
3. Permitir vínculo entre simulação de bico e diagnóstico
4. Padronizar mensagens de upgrade
5. Padronizar visual de plano/acesso
```

---

## Ciclo 4 — Fazenda / Frota MVP

Foco: vender para fazenda com múltiplos pulverizadores.

```text
1. Criar status da máquina
2. Criar histórico por máquina
3. Criar dashboard simples de frota
4. Criar relatório consolidado simples
5. Mostrar máquinas aptas/atenção/reprovadas
```

---

## Ciclo 5 — Multiusuário / Empresa

Foco: planos maiores.

```text
1. Criar organizações
2. Criar papéis de usuário
3. Criar gestão de equipe
4. Criar permissões por usuário
5. Criar white-label básico
```

---

## Ciclo 6 — Segurança avançada e escala

Foco: produção SaaS mais robusta.

```text
1. Migrar permissões para tabelas
2. Criar backend seguro
3. Tirar service_role do navegador
4. Criar licença offline assinada
5. Criar QR Code de validação
6. Criar BI
7. Automatizar cobrança
```

---

# 24. Matriz esforço x impacto

| Item | Impacto comercial | Risco técnico | Prioridade |
|---|---:|---:|---:|
| Ajustar landing | Alto | Baixo | Muito alta |
| Demo limitada | Alto | Médio | Muito alta |
| Laudo avulso | Alto | Médio | Muito alta |
| Campos no admin | Alto | Médio | Muito alta |
| Bloquear PDF no demo | Alto | Baixo/Médio | Muito alta |
| Fonte da referência | Alto | Baixo | Alta |
| Ocorrências de campo | Alto | Médio | Alta |
| Melhorar PDF | Alto | Médio | Alta |
| Dashboard frota | Médio/Alto | Médio | Média |
| Relatório consolidado | Alto para fazenda | Médio | Média |
| Multiusuário | Alto futuro | Alto | Média/Baixa |
| BI | Alto futuro | Alto | Baixa agora |
| QR máquina | Médio | Médio | Baixa/Média |
| Licença offline assinada | Alto segurança | Alto | Média |
| Tirar service_role do browser | Alto segurança | Médio/Alto | Média/Alta |

---

# 25. O MVP comercial mais inteligente

O MVP comercial mais inteligente agora é:

```text
Landing clara
Demo limitada
Laudo avulso
PRO mensal/anual
Admin liberando manualmente
PDF bloqueado no demo
Diagnóstico limitado no demo
Relatório mais profissional
```

Isso já permite começar a vender sem esperar o sistema perfeito.

---

# 26. O que vender primeiro

## Para produtor pontual

```text
Laudo Avulso por máquina
```

## Para consultor

```text
PRO mensal ou anual
```

## Para fazenda pequena

```text
PRO ou Plano Fazenda inicial
```

## Para fazenda com frota

```text
Diagnóstico inicial da frota + assinatura Fazenda
```

## Para revenda

```text
Plano parceiro com equipe e white-label futuro
```

---

# 27. Posicionamento comercial recomendado

## Frase principal

```text
Spray Precision PRO transforma aferição manual e seleção de bicos em laudo técnico profissional, com funcionamento offline e controle por máquina.
```

## Contra soluções de alto custo

```text
Uma alternativa acessível para profissionalizar a aferição da barra sem começar investindo em equipamentos digitais de alto custo.
```

## Para fazendas

```text
Controle a qualidade de aplicação da sua frota pulverizador por pulverizador.
```

## Para consultores

```text
Atenda seus clientes com laudos técnicos, histórico por máquina e recomendação de bicos com base técnica.
```

## Para revendas

```text
Venda bicos e assistência técnica com prova visual, laudo e diagnóstico bico a bico.
```

---

# 28. Checklist antes de implementar cada etapa

Antes de cada alteração:

```text
1. Fazer backup
2. Registrar versão
3. Testar fluxo online
4. Testar fluxo offline
5. Testar celular
6. Testar geração de PDF
7. Testar usuário demo
8. Testar usuário PRO
9. Testar vencimento/bloqueio
10. Documentar mudança
```

---

# 29. Conclusão final

O projeto não precisa de uma grande reconstrução imediata.

A decisão mais segura é:

> **Preservar o app que já funciona em campo e adicionar camadas comerciais, permissões e melhorias de relatório em ciclos pequenos.**

A ordem correta é:

```text
1. Comercial e acesso
2. Demo / laudo avulso
3. Relatório técnico melhorado
4. Integração dos módulos
5. Frota simples
6. Multiusuário
7. BI / white-label / segurança avançada
```

Isso reduz risco técnico, aumenta chance de vender rápido e mantém o produto funcionando no campo.

---

# 30. Comando conceitual para implementação

```text
Organizar a evolução do Spray Precision PRO em ciclos curtos, preservando o funcionamento atual em campo. Priorizar primeiro landing, modelo comercial, demo limitada, laudo avulso, permissões básicas e bloqueio de PDF no demo. Em seguida, melhorar o relatório técnico com fonte da referência, confiabilidade e ocorrências de campo. Depois integrar Seletor e Diagnóstico, criar dashboard simples de frota e evoluir para multiusuário, white-label, BI e segurança avançada.
```

---
