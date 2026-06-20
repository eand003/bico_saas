# Projeto de Implementação — Seletor Inteligente de Bicos

## Spray Precision PRO — Convencional, PWM e Bico Duplo

**Objetivo:** evoluir o seletor atual de bicos ISO para recomendar pontas em três configurações:

1. Pulverizador convencional
2. Sistema pulsado com PWM
3. Sistema com bico duplo / seleção automática

---

## 1. Situação atual

O sistema atual já seleciona bicos para pulverização convencional considerando:

- Vazão alvo em L/ha
- Espaçamento entre bicos
- Densidade da calda
- Pressão mínima e máxima
- Velocidade mínima, média e máxima
- Tabela de bicos ISO
- Vazão catálogo @3 bar
- Pressão necessária por velocidade
- Status: atende, parcial ou não recomendado

A evolução proposta é criar um seletor inteligente capaz de considerar tecnologias modernas de aplicação.

---

## 2. Nova estrutura do app

Adicionar um seletor de modo:

```text
Tipo de sistema:
[ Convencional ] [ PWM / Pulsado ] [ Bico Duplo ]
```

Cada modo usa a base atual de cálculo, mas adiciona regras específicas.

---

# 3. Modo Convencional

## Entradas

- Vazão alvo (L/ha)
- Espaçamento (cm)
- Densidade da calda
- Pressão mínima
- Pressão máxima
- Velocidade mínima
- Velocidade média
- Velocidade máxima

## Saídas

- Bico ISO recomendado
- Vazão de calibração em L/min
- Vazão catálogo @3 bar
- Pressão na velocidade mínima
- Pressão na velocidade média
- Pressão na velocidade máxima
- Janela operacional de velocidade
- Status técnico

## Regra principal

```text
Atende se:
pressão na velocidade mínima >= pressão mínima
E
pressão na velocidade máxima <= pressão máxima
```

---

# 4. Modo PWM / Sistema Pulsado

## Conceito

No PWM, a vazão é controlada pelo duty cycle. O bico normalmente precisa ser um pouco maior do que no sistema convencional, para que o sistema tenha amplitude de trabalho.

A lógica não é apenas “bater a vazão”, mas garantir que o duty cycle fique em uma zona saudável.

## Novos campos

```text
Duty mínimo aceitável (%)
Duty ideal (%)
Duty máximo aceitável (%)
Pressão alvo PWM
```

Valores padrão sugeridos:

```text
Duty mínimo: 30%
Duty ideal: 70%
Duty máximo: 90%
Pressão alvo: 3,0 bar
```

## Fórmulas

### Vazão requerida por bico

```text
Q_req = (L/ha × velocidade × espaçamento_m) / 600
```

### Vazão disponível do bico na pressão alvo

```text
Q_bico = Q3 × raiz(pressão_alvo / 3)
```

### Correção por densidade

```text
Q_bico_corrigido = Q_bico / raiz(densidade)
```

### Duty cycle

```text
Duty (%) = (Q_req / Q_bico_corrigido) × 100
```

Calcular duty para:

- Velocidade mínima
- Velocidade média
- Velocidade máxima

## Classificação PWM

### Ideal PWM

```text
Duty mínimo >= duty mínimo aceitável
Duty médio próximo de 60% a 75%
Duty máximo <= duty máximo aceitável
```

### Aceitável

```text
Duty máximo <= 100%
Duty mínimo não extremamente baixo
```

### Saturando

```text
Duty máximo acima do limite configurado
```

### Duty baixo

```text
Duty mínimo abaixo do limite mínimo aceitável
```

### Não recomendado

```text
Duty máximo > 100%
ou duty mínimo muito baixo
```

## Ranking PWM

Prioridade de ordenação:

1. Duty máximo dentro do limite
2. Duty médio mais próximo do duty ideal
3. Duty mínimo acima do limite mínimo
4. Bico com melhor equilíbrio operacional

## Saída no card PWM

```text
ISO 025
Vazão catálogo: 1,00 L/min @3 bar
Duty mín: 48%
Duty médio: 69%
Duty máx: 88%
Pressão alvo: 3,0 bar
Status: Ideal PWM
```

## Alertas PWM

```text
⚠️ Duty alto: risco de saturar em velocidade máxima.
```

```text
⚠️ Duty baixo: pode prejudicar a estabilidade da aplicação em baixa velocidade.
```

```text
✅ Bico ideal para PWM: mantém margem operacional na faixa informada.
```

---

# 5. Modo Bico Duplo

## Conceito

Em sistemas de bico duplo, a máquina pode trabalhar em estágios:

1. Apenas bico A aberto
2. Apenas bico B aberto
3. Bico A + bico B abertos juntos

O app deve indicar qual combinação cobre melhor a faixa de velocidade informada.

## Novos campos

```text
Estratégia:
[ Automática ] [ Manual ]

Bico A
Bico B
Pressão mínima
Pressão máxima
Velocidade mínima
Velocidade média
Velocidade máxima
```

## Modo automático

O sistema testa combinações possíveis de bicos ISO.

Exemplos:

```text
015 + 02
02 + 025
02 + 03
025 + 04
03 + 04
04 + 05
```

Evitar combinações muito desproporcionais no modo simples.

## Cálculo por estágio

### Bico A sozinho

```text
Q_A = vazão corrigida do bico A
```

### Bico B sozinho

```text
Q_B = vazão corrigida do bico B
```

### Bico A + B

```text
Q_AB = Q_A + Q_B
```

### Velocidade possível

```text
Velocidade = (Q_total × 600) / (L/ha × espaçamento_m)
```

Calcular para pressão mínima e máxima de cada estágio.

## Classificação bico duplo

### Cobertura total

```text
Os estágios cobrem a velocidade mínima até a máxima sem lacunas relevantes.
```

### Cobertura parcial

```text
A combinação cobre parte da operação, mas tem pequenas lacunas.
```

### Troca crítica

```text
Existe lacuna grande ou transição ruim entre estágios.
```

### Não recomendado

```text
Não cobre a faixa operacional informada.
```

## Saída no card bico duplo

```text
Combinação recomendada
Bico A: ISO 02
Bico B: ISO 03

Estágio 1 — ISO 02:
10,5 a 14,8 km/h

Estágio 2 — ISO 03:
14,0 a 19,2 km/h

Estágio 3 — ISO 02 + ISO 03:
19,0 a 26,5 km/h

Status: Cobertura total
```

## Alertas bico duplo

```text
⚠️ Lacuna operacional entre 16,2 e 17,4 km/h.
```

```text
⚠️ Sobreposição excessiva entre bico A e bico B.
```

```text
✅ Combinação cobre toda a faixa de velocidade informada.
```

---

# 6. Mudanças na interface

## Seletor de modo

Adicionar no painel de parâmetros:

```html
<select id="machineMode">
  <option value="conventional">Convencional</option>
  <option value="pwm">PWM / Pulsado</option>
  <option value="dual">Bico Duplo</option>
</select>
```

## Blocos condicionais

### PWM

Mostrar apenas quando `machineMode = pwm`:

```text
Duty mínimo
Duty ideal
Duty máximo
Pressão alvo PWM
```

### Bico duplo

Mostrar apenas quando `machineMode = dual`:

```text
Estratégia automática/manual
Bico A
Bico B
```

## Resultado

Alterar dinamicamente o título:

```text
Top Recomendados — Convencional
Top Recomendados — PWM
Top Recomendados — Bico Duplo
```

---

# 7. Mudanças na API

## Opção recomendada

Usar uma rota única:

```text
/api/calculate
```

Com o campo:

```json
{
  "machineMode": "pwm"
}
```

Valores possíveis:

```text
conventional
pwm
dual
```

## Payload PWM

```json
{
  "machineMode": "pwm",
  "rate": 60,
  "spacingM": 0.5,
  "density": 1.0,
  "pMin": 2,
  "pMax": 4,
  "vMin": 14,
  "vAvg": 17,
  "vMax": 20,
  "unit": "bar",
  "pwm": {
    "dutyMin": 30,
    "dutyIdeal": 70,
    "dutyMax": 90,
    "targetPressure": 3
  }
}
```

## Payload bico duplo

```json
{
  "machineMode": "dual",
  "rate": 80,
  "spacingM": 0.5,
  "density": 1.0,
  "pMin": 2,
  "pMax": 5,
  "vMin": 12,
  "vAvg": 17,
  "vMax": 24,
  "unit": "bar",
  "dual": {
    "strategy": "auto",
    "nozzleA": null,
    "nozzleB": null
  }
}
```

---

# 8. Funções sugeridas no backend

```javascript
function calculateConventional(input) {}

function calculatePWM(input) {}

function calculateDualNozzle(input) {}

function rankConventional(rows) {}

function rankPWM(rows) {}

function rankDual(combinations) {}

function validateInput(input) {}

function correctFlowForDensity(q, density) {}

function pressureRequired(qMix, q3, density, pRef) {}

function velocityForFlow(rate, spacingM, q) {}
```

---

# 9. Pseudocódigo PWM

```javascript
function calculatePWM(input) {
  const results = [];

  for (const nozzle of NOZZLES) {
    const qNozzle =
      nozzle.q3 *
      Math.sqrt(input.pwm.targetPressure / 3) /
      Math.sqrt(input.density);

    const qMin = qRequired(input.rate, input.vMin, input.spacingM);
    const qAvg = qRequired(input.rate, input.vAvg, input.spacingM);
    const qMax = qRequired(input.rate, input.vMax, input.spacingM);

    const dutyMin = (qMin / qNozzle) * 100;
    const dutyAvg = (qAvg / qNozzle) * 100;
    const dutyMax = (qMax / qNozzle) * 100;

    const status = classifyPWM(dutyMin, dutyAvg, dutyMax, input.pwm);

    results.push({
      nozzle,
      qNozzle,
      dutyMin,
      dutyAvg,
      dutyMax,
      status
    });
  }

  return rankPWM(results);
}
```

---

# 10. Pseudocódigo bico duplo

```javascript
function calculateDualNozzle(input) {
  const combinations = [];

  for (const nozzleA of NOZZLES) {
    for (const nozzleB of NOZZLES) {
      if (!isValidDualCombination(nozzleA, nozzleB)) continue;

      const stages = [
        createStage("A", [nozzleA], input),
        createStage("B", [nozzleB], input),
        createStage("A+B", [nozzleA, nozzleB], input)
      ];

      const coverage = calculateVelocityCoverage(stages, input.vMin, input.vMax);
      const status = classifyDualCoverage(coverage);

      combinations.push({
        nozzleA,
        nozzleB,
        stages,
        coverage,
        status
      });
    }
  }

  return rankDual(combinations);
}
```

---

# 11. Regras agronômicas essenciais

## Convencional

- Evitar pressão abaixo do mínimo
- Evitar pressão acima do máximo
- Priorizar pressão média próxima do centro da faixa
- Mostrar vazão catálogo e vazão de calibração

## PWM

- Priorizar duty médio perto de 70%
- Evitar duty máximo próximo de 100%
- Evitar duty mínimo muito baixo
- Permitir bico maior que o convencional
- Explicar por que PWM pode exigir bico maior

## Bico duplo

- Priorizar cobertura contínua da faixa de velocidade
- Evitar lacunas entre estágios
- Evitar sobreposição excessiva
- Evitar combinações muito desproporcionais
- Mostrar claramente em qual velocidade cada bico entra

---

# 12. Tabela de status

## Convencional

| Status | Critério |
|---|---|
| Atende | Pressões dentro da faixa |
| Parcial | Parte da faixa atende |
| Não recomendado | Fora da faixa |

## PWM

| Status | Critério |
|---|---|
| Ideal PWM | Duty médio 60–75%, duty máximo dentro do limite |
| Aceitável | Duty utilizável, mas fora do ideal |
| Saturando | Duty máximo acima do limite |
| Duty baixo | Duty mínimo abaixo do limite |
| Não recomendado | Fora da janela operacional |

## Bico Duplo

| Status | Critério |
|---|---|
| Cobertura total | Cobre toda a faixa |
| Cobertura parcial | Pequena lacuna |
| Troca crítica | Lacuna grande ou transição ruim |
| Não recomendado | Não cobre a operação |

---

# 13. Etapas de implementação

## Fase 1 — Arquitetura

- Criar campo `machineMode`
- Separar cálculo convencional em função própria
- Padronizar retorno da API
- Manter compatibilidade com o modo atual

## Fase 2 — PWM

- Adicionar inputs de duty
- Criar função `calculatePWM`
- Criar ranking PWM
- Criar cards PWM
- Criar tabela PWM
- Criar alertas PWM

## Fase 3 — Bico duplo

- Adicionar painel bico duplo
- Criar modo automático
- Criar modo manual
- Calcular estágios A, B e A+B
- Criar gráfico de zonas
- Criar tabela de transições

## Fase 4 — Comparador

Criar tela opcional:

```text
Comparativo de sistemas

Convencional: ISO 025
PWM: ISO 03
Bico Duplo: ISO 02 + ISO 03
```

---

# 14. Atualizações no CRM e histórico

Ao salvar uma calibração, incluir:

```json
{
  "machineMode": "pwm",
  "recommendation": {
    "iso": "025",
    "dutyMin": 48,
    "dutyAvg": 69,
    "dutyMax": 88,
    "statusText": "Ideal PWM"
  }
}
```

Para bico duplo:

```json
{
  "machineMode": "dual",
  "recommendation": {
    "nozzleA": "02",
    "nozzleB": "03",
    "stages": [
      { "mode": "A", "speedMin": 10.5, "speedMax": 14.8 },
      { "mode": "B", "speedMin": 14.0, "speedMax": 19.2 },
      { "mode": "A+B", "speedMin": 19.0, "speedMax": 26.5 }
    ],
    "statusText": "Cobertura total"
  }
}
```

---

# 15. Atualização do relatório técnico

O relatório deve exibir o modo usado:

```text
Tipo de sistema: PWM / Pulsado
```

Ou:

```text
Tipo de sistema: Bico Duplo
```

Para PWM, incluir:

```text
Duty mínimo
Duty médio
Duty máximo
Pressão alvo PWM
```

Para bico duplo, incluir:

```text
Bico A
Bico B
Estágio 1
Estágio 2
Estágio 3
Velocidades de transição
```

---

# 16. Disclaimer técnico

Adicionar no app e relatório:

```text
As recomendações são baseadas em simulação matemática e parâmetros informados.
A calibração real em campo deve ser conferida por medição de vazão, inspeção do padrão de aplicação e avaliação das condições ambientais.
```

---

# 17. Diferencial comercial

Essa evolução posiciona o produto como:

```text
Seletor Inteligente de Bicos para Sistemas Convencionais, PWM e Bico Duplo
```

Possíveis nomes:

- Spray Precision Smart Nozzle
- Spray Precision PRO — Smart Selector
- Seletor Inteligente de Bicos ISO
- Spray Precision Decision

---

# 18. Ordem recomendada

1. Refatorar o cálculo convencional
2. Adicionar seletor de modo
3. Implementar PWM
4. Validar PWM com exemplos reais
5. Implementar bico duplo automático
6. Criar gráfico de estágios
7. Atualizar CRM
8. Atualizar relatório PDF
9. Testar no mobile
10. Testar no Vercel

---

# 19. Checklist

- [ ] Criar `machineMode`
- [ ] Separar cálculo convencional
- [ ] Criar bloco de inputs PWM
- [ ] Calcular duty mínimo, médio e máximo
- [ ] Criar classificação PWM
- [ ] Criar bloco de inputs bico duplo
- [ ] Simular bico A, bico B e A+B
- [ ] Calcular cobertura da faixa de velocidade
- [ ] Criar gráfico por modo
- [ ] Atualizar cards
- [ ] Atualizar tabela técnica
- [ ] Atualizar relatório
- [ ] Atualizar CRM/histórico
- [ ] Atualizar tela de ajuda
- [ ] Testar responsividade mobile
- [ ] Testar deploy Vercel
- [ ] Testar cache/service worker

---

## Conclusão

A evolução para PWM e bico duplo transforma o Spray Precision PRO em uma ferramenta de decisão técnica, não apenas uma calculadora.

O valor principal é responder:

```text
qual bico usar,
em qual sistema,
com qual margem operacional,
em qual velocidade,
e por que a recomendação muda quando a tecnologia da máquina muda.
```
