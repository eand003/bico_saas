# Revisão Conceitual — Botões “Entupido” e “Vazando” na Etapa 4

**Projeto:** Spray Precision PRO  
**Módulo:** Diagnóstico de Vazão Manual / Coleta bico a bico  
**Tema:** Revisão das funções “Marcar Entupido” e “Marcar Vazando”  
**Objetivo:** avaliar se esses botões fazem sentido na prática de aferição da máquina e propor uma melhoria conceitual para o app e para o relatório técnico.

---

## 1. Contexto

Na Etapa 4 do app, durante a coleta bico a bico, existem dois botões específicos:

- **🚫 Marcar Entupido**
- **💧 Marcar Vazando**

A ideia inicial parece ser permitir que o técnico registre rapidamente problemas observados durante a coleta.

Porém, durante o teste prático, foi observado que ao usar esses botões não houve diferença clara no relatório final. Isso indica que o botão pode até existir na interface, mas o status registrado não está sendo refletido corretamente no laudo, nos contadores, no mapa visual ou nas recomendações.

---

## 2. Opinião sincera sobre o conceito

O conceito faz sentido, mas precisa ser melhor organizado.

Essas funções são úteis em campo, porém não devem ser tratadas apenas como botões isolados. Elas precisam fazer parte de uma lógica maior chamada:

> **Ocorrências de Campo**

Ou:

> **Falhas observadas durante a inspeção**

A coleta de vazão mede o volume aplicado por cada bico. Já ocorrências como vazamento, entupimento, filtro sujo ou ponta danificada são observações mecânicas/técnicas que podem ou não aparecer apenas pelo número da vazão.

Portanto, o app deve separar:

1. **Resultado da medição de vazão**
2. **Ocorrências observadas em campo**

---

## 3. “Marcar Entupido” faz sentido?

Sim, faz bastante sentido.

Durante a aferição, o técnico pode chegar em um bico e perceber que:

- não sai água;
- sai muito pouco;
- há jato irregular;
- a ponta está obstruída;
- o filtro individual pode estar sujo;
- o porta-bico pode estar obstruído.

Nesse caso, o botão é útil porque evita que o usuário tenha que digitar manualmente um volume muito baixo ou zero apenas para o app entender o problema.

---

## 4. Mudança sugerida para “Marcar Entupido”

O nome atual pode ser melhorado.

### Nome atual

> Marcar Entupido

### Nome sugerido

> **🚫 Sem vazão / Entupido**

Ou:

> **🚫 Obstruído / Sem vazão**

Esse nome é mais claro porque nem sempre o diagnóstico visual é “entupido” com certeza. Pode ser obstrução total, obstrução parcial, filtro sujo ou problema no porta-bico.

---

## 5. Como “Sem vazão / Entupido” deveria funcionar

Quando o usuário clicar nesse botão, o app deveria:

1. Registrar o bico atual como **entupido/obstruído**.
2. Salvar um status manual no objeto do bico.
3. Considerar esse bico como **falha crítica**.
4. Registrar volume como `0 mL` ou permitir manter volume informado.
5. Aparecer no mapa da barra com ícone/cor específica.
6. Aparecer na tabela final.
7. Entrar em um contador próprio no relatório.
8. Gerar recomendação específica.
9. Permitir recoletar após correção.

---

## 6. Exemplo no relatório para bico entupido

| Nº | Volume | Medido | Desvio | Status | Ação Recomendada |
|---:|---:|---:|---:|---|---|
| 17 | 0 mL | 0,00 L/min | -100% | 🚫 Sem vazão / Entupido | Limpar ponta, filtro individual e porta-bico. Repetir coleta após correção. |

Texto técnico sugerido:

> O bico 17 foi marcado manualmente como sem vazão/entupido durante a inspeção. Recomenda-se limpeza do filtro individual, porta-bico e ponta, seguida de nova coleta para validação.

---

## 7. “Marcar Vazando” faz sentido?

Faz sentido registrar vazamento, mas não da forma atual como botão principal no mesmo nível de “entupido”.

O motivo é que **vazamento não é exatamente uma medição de vazão da ponta**.

Um bico ou conjunto pode estar vazando por vários motivos:

- antigotejo com problema;
- vedação danificada;
- capa frouxa;
- porta-bico trincado;
- corpo da ponta com dano;
- filtro mal encaixado;
- conexão com falha.

E mesmo assim o volume coletado na proveta pode aparecer dentro da tolerância.

Portanto, “vazando” deve ser tratado como:

> **Falha mecânica observada**

E não apenas como “vazão acima” ou “ponta desgastada”.

---

## 8. Mudança sugerida para “Marcar Vazando”

A recomendação é substituir o botão fixo **“Marcar Vazando”** por um botão mais amplo:

> **⚠️ Problema observado**

Ao clicar, o app abriria uma lista rápida de ocorrências.

### Opções sugeridas dentro de “Problema observado”

- 💧 Vazamento no conjunto / porta-bico
- 🚫 Sem vazão / entupido
- 🟡 Vazão fraca / jato irregular
- 🔧 Filtro sujo
- 🔁 Bico substituído em campo
- 📌 Ponta diferente instalada
- ❌ Ponta quebrada ou danificada
- ⏭️ Não coletado / inacessível
- 📝 Outra observação

---

## 9. Por que essa mudança melhora o app

A tela fica mais limpa e o diagnóstico fica mais técnico.

Em vez de dois botões vermelhos que parecem ter o mesmo peso da coleta, o app passa a ter:

- uma ação rápida para o caso mais comum e direto: **sem vazão/entupido**;
- um menu de ocorrências para problemas observados.

Isso evita confusão e torna o laudo mais completo.

---

## 10. Tela de coleta sugerida

### Layout sugerido

```text
Volume Coletado (mL): _______

[Anterior] [Pular] [Salvar e Próximo]

[🚫 Sem vazão / Entupido] [⚠️ Problema observado]
```

O botão **Sem vazão / Entupido** fica como atalho direto.

O botão **Problema observado** abre um modal ou menu rápido com as opções de ocorrência.

---

## 11. Separação conceitual importante

O relatório deve separar duas coisas:

---

### 11.1. Resultado da medição de vazão

Classificação baseada no desvio em relação à vazão de referência:

- OK;
- abaixo da referência;
- acima da referência;
- crítico abaixo;
- crítico acima;
- não coletado.

---

### 11.2. Ocorrências observadas em campo

Falhas ou observações registradas pelo técnico:

- sem vazão / entupido;
- vazamento no conjunto;
- filtro sujo;
- ponta danificada;
- ponta diferente instalada;
- bico substituído;
- jato irregular;
- recoletado após correção;
- observação manual.

Essa separação é essencial porque uma ocorrência mecânica pode existir mesmo que a vazão esteja dentro da tolerância.

---

## 12. Exemplo: vazamento com vazão dentro da tolerância

Situação:

- Bico 22 coletou volume dentro do padrão.
- Porém o técnico observou vazamento no porta-bico.

O relatório não deve dizer apenas “OK”.

Deve dizer:

| Nº | Volume | Medido | Desvio | Status Vazão | Ocorrência | Ação Recomendada |
|---:|---:|---:|---:|---|---|---|
| 22 | 605 mL | 1,21 L/min | +0,8% | OK | 💧 Vazamento observado | Revisar vedação, antigotejo, capa e porta-bico. Repetir teste após correção. |

Texto sugerido:

> O bico 22 apresentou vazão dentro da tolerância, porém foi registrado vazamento no conjunto porta-bico. Recomenda-se correção mecânica antes da liberação operacional.

---

## 13. Regra de prioridade dos status

O status manual deve ter prioridade sobre o cálculo automático apenas em casos críticos, como sem vazão/entupido.

Para vazamento, o ideal é manter o resultado de vazão e adicionar uma ocorrência.

### Regra sugerida

```text
1. Se marcou "Sem vazão / Entupido":
   Status final = Falha crítica por obstrução.

2. Se marcou "Vazamento":
   Status de vazão = calculado normalmente.
   Ocorrência = Vazamento observado.
   Recomendação = revisar conjunto mecânico.

3. Se marcou "Ponta substituída":
   Status = Recoletar após substituição.

4. Se marcou "Não coletado":
   Status final = Não coletado.

5. Se não marcou nenhuma ocorrência:
   Status final = calculado pelo desvio da vazão.
```

---

## 14. Estrutura de dados recomendada

Cada bico deveria guardar tanto o resultado calculado quanto as ocorrências manuais.

Exemplo:

```js
{
  numero: 17,
  volumeMl: 0,
  tempoColeta: 30,
  vazaoLmin: 0,
  desvioPercent: -100,
  statusCalculado: "critico_abaixo",
  ocorrencias: ["sem_vazao_entupido"],
  statusFinal: "sem_vazao_entupido",
  recomendacao: "Limpar filtro individual, porta-bico e ponta. Repetir coleta após correção."
}
```

Exemplo para vazamento:

```js
{
  numero: 22,
  volumeMl: 605,
  tempoColeta: 30,
  vazaoLmin: 1.21,
  desvioPercent: 0.8,
  statusCalculado: "ok",
  ocorrencias: ["vazamento_conjunto"],
  statusFinal: "ok_com_ocorrencia",
  recomendacao: "Vazão dentro da tolerância, porém com vazamento observado. Revisar vedação, antigotejo, capa e porta-bico."
}
```

---

## 15. O que deve aparecer no relatório

O relatório deveria incluir uma seção específica:

> **Ocorrências observadas em campo**

Exemplo:

```text
Ocorrências observadas:
- Bico 17: sem vazão / provável obstrução.
- Bico 22: vazamento no conjunto porta-bico.
- Bico 31: filtro individual sujo.
- Bico 44: ponta substituída durante a inspeção.
```

---

## 16. Novos cards no resumo do relatório

Além dos cards já existentes, o relatório poderia mostrar:

- Bicos OK;
- Bicos abaixo da referência;
- Bicos acima da referência;
- Bicos críticos por desvio;
- **Sem vazão / entupidos**;
- **Com vazamento observado**;
- **Com outras ocorrências**;
- **Não coletados**.

Exemplo:

```text
Pontas OK: 78
Abaixo da referência: 4
Acima da referência: 3
Críticas por desvio: 2
Sem vazão / entupidas: 1
Vazamento observado: 2
Não coletadas: 0
```

---

## 17. Como isso melhora a conclusão técnica

A conclusão técnica poderia ficar mais rica.

### Exemplo de conclusão atual

> A barra apresenta bicos críticos e necessita manutenção.

### Exemplo de conclusão melhorada

> A barra apresentou boa uniformidade geral de vazão, porém foram registradas ocorrências mecânicas durante a inspeção: 1 ponto sem vazão e 2 conjuntos com vazamento observado. Recomenda-se corrigir os pontos indicados e repetir a coleta nesses bicos antes da liberação operacional da máquina.

---

## 18. Recomendações automáticas sugeridas

### Sem vazão / Entupido

> Limpar ponta, filtro individual e porta-bico. Verificar obstrução na linha e repetir coleta após correção.

### Vazamento no conjunto

> Revisar antigotejo, vedação, capa, porta-bico e encaixe da ponta. Corrigir vazamento e repetir teste.

### Filtro sujo

> Remover e limpar filtro individual. Avaliar necessidade de limpeza dos filtros de linha e principal.

### Ponta diferente instalada

> Substituir por ponta do mesmo modelo e vazão da barra. Repetir coleta após substituição.

### Ponta quebrada/danificada

> Substituir a ponta. Não liberar operação até nova coleta de validação.

### Jato irregular

> Verificar desgaste, obstrução parcial, filtro individual e padrão de jato. Recoletar após correção.

---

## 19. Melhor nomenclatura para o app

### Evitar

- Marcar Vazando
- Marcar Entupido
- Defeito
- Erro

### Preferir

- Sem vazão / Entupido
- Problema observado
- Ocorrência de campo
- Falha mecânica observada
- Recoletar após correção
- Vazamento no conjunto
- Obstrução parcial
- Ponto não coletado

---

## 20. Melhor fluxo prático em campo

1. O técnico chega no bico.
2. Faz a coleta normalmente.
3. Digita o volume coletado.
4. Se estiver tudo normal, salva e avança.
5. Se não sair água, clica em **Sem vazão / Entupido**.
6. Se perceber vazamento, filtro sujo, ponta diferente ou outro problema, clica em **Problema observado**.
7. O app salva a medição e a ocorrência.
8. No relatório, o bico aparece com status de vazão e ocorrência observada.
9. Se houver correção em campo, o técnico pode recoletar e registrar antes/depois.

---

## 21. Função futura: antes e depois da correção

Um recurso muito interessante seria permitir registrar uma recoleta após manutenção.

Exemplo:

```text
Bico 17
Primeira coleta: 0 mL — sem vazão / entupido.
Ação: limpeza do filtro e porta-bico.
Recoleta: 600 mL — dentro da tolerância.
Status final: corrigido em campo.
```

Isso gera muito valor comercial, porque mostra o serviço prestado e a melhoria real.

No relatório:

> O bico 17 foi identificado inicialmente sem vazão. Após limpeza do filtro/porta-bico, foi recoletado e apresentou vazão dentro da tolerância. Ocorrência corrigida em campo.

---

## 22. Recomendação final

A recomendação é:

1. **Manter a função de marcar problema**, pois ela faz sentido na prática de campo.
2. **Renomear “Marcar Entupido” para “Sem vazão / Entupido”**.
3. **Substituir “Marcar Vazando” por “Problema observado”**.
4. Dentro de “Problema observado”, incluir “Vazamento no conjunto”.
5. Separar no relatório:
   - status de vazão;
   - ocorrências de campo.
6. Criar seção específica no laudo:
   - **Ocorrências observadas em campo**.
7. Permitir recoleta após correção.
8. Fazer os contadores e recomendações refletirem essas ocorrências.

---

## 23. Resumo executivo para implementação

### Problema atual

Os botões “Marcar Entupido” e “Marcar Vazando” existem na coleta, mas não parecem gerar diferença clara no relatório final. Isso reduz a utilidade prática da função.

### Melhor conceito

Transformar esses botões em um módulo de:

> **Ocorrências de Campo**

### Tela sugerida

```text
[🚫 Sem vazão / Entupido] [⚠️ Problema observado]
```

### Relatório sugerido

Criar seção:

> **Falhas observadas durante a inspeção**

Com lista por bico e recomendação específica.

### Benefício

O app deixa de ser apenas uma calculadora de desvio de vazão e passa a ser uma ferramenta completa de diagnóstico técnico da barra.

---
