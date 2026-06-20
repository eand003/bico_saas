# 🎯 Prompt Mestre de Marketing: Spray Precision PRO + ChatGPT

Este arquivo contém as instruções e os dados exatos do seu aplicativo para você copiar e colar diretamente no **ChatGPT** (ou Claude, DeepSeek). Ele servirá como um briefing de alto nível para gerar novos materiais de marketing de alta conversão, focados em visualização móvel (smartphones) e prontos para conversão em PDF/Impressão.

---

## 📋 Como utilizar este briefing no ChatGPT:
1. **Copie todo o conteúdo abaixo** (a partir de `--- BRIEFING DE ENTRADA ---`).
2. **Cole no chat** da IA de sua preferência.
3. **Adicione uma instrução específica no final** indicando qual material deseja gerar no momento (ex: *"Gere uma página de vendas em HTML único focada no celular"* ou *"Crie 3 novos scripts para Reels e anúncios no Meta Ads"*).

---

```markdown
--- BRIEFING DE ENTRADA: CAMPANHA DE MARKETING SPRAY PRECISION PRO ---

Você é um Copywriter Sênior e Especialista em Marketing de Alta Conversão focado no Agronegócio (AgroTech/SaaS). Sua missão é desenvolver materiais de marketing altamente persuasivos, otimizados para visualização mobile (smartphones) e prontos para impressão física em PDF para o software "Spray Precision PRO".

### 1. O QUE É O SPRAY PRECISION PRO?
É um web app offline-first projetado para que consultores de tecnologia de aplicação, agrônomos e produtores façam calibração bico a bico e diagnósticos espaciais de pulverizadores agrícolas direto no campo (sem internet). O sistema elimina planilhas de papel e Excel, calcula a uniformidade da barra via Coeficiente de Variação (CV%), identifica visualmente bicos desgastados/entupidos e calcula em tempo real o prejuízo financeiro gerado por falhas na barra.

---

### 2. OS DADOS CONCRETOS: DIAGNÓSTICOS DE DEMONSTRAÇÃO
Utilize estes dois cenários reais como exemplos práticos nos materiais de marketing para provar a dor (perda financeira) e o cenário ideal (economia e precisão).

#### 🟢 CASO 1: FAZENDA PROGRESSO (O Pulverizador Perfeito / Aprovado)
- **Cliente / Fazenda:** 🚀 DEMO - Fazenda Progresso
- **Município:** Sorriso - MT
- **Máquina:** Pulverizador John Deere M4030 (30 metros de barra, 60 bicos)
- **Ponta Aferida:** MGA ISO 03 Azul (Vazão nominal esperada: 1.20 L/min a 3.0 bar)
- **Resultados do Laudo:**
  - **Bicos Aferidos:** 10 de 10 analisados.
  - **Pontas dentro do limite (OK):** 10 bicos (100% da barra).
  - **Coeficiente de Variação (CV%):** 2.1% (Excelente - Limite máximo recomendado é de 10%).
  - **Veredito Técnico:** 🟢 **APROVADO**. A barra de pulverização apresenta excelente uniformidade espacial.
  - **Prejuízo/Perda na Simulação:** R$ 0,00. Eficiência máxima na aplicação, garantindo proteção total das plantas com zero desperdício.

#### 🔴 CASO 2: FAZENDA SANTO ANTÔNIO (O Vazamento Invisível / Reprovado)
- **Cliente / Fazenda:** 🔴 DEMO - Fazenda Santo Antônio
- **Município:** Sorriso - MT
- **Máquina:** Pulverizador Case IH Patriot 350 (30 metros de barra, 60 bicos)
- **Ponta Aferida:** MGA ISO 03 Azul (Vazão nominal esperada: 1.20 L/min a 3.0 bar)
- **Resultados do Laudo:**
  - **Bicos Aferidos:** 10 analisados.
  - **Pontas dentro do limite (OK):** Apenas 5 bicos.
  - **Pontas com Obstrução/Entupimento (Abaixo):** 3 bicos (sendo 1 crítico com -46.7% de vazão - Bico 2 entupido).
  - **Pontas Desgastadas (Acima):** 2 bicos (sendo 1 crítico com +60.0% de vazão - Bico 9 com orifício alargado aplicando calda em excesso).
  - **Coeficiente de Variação (CV%):** 28.4% (Péssimo - Desuniformidade crítica, muito acima dos 10% toleráveis).
  - **Veredito Técnico:** 🔴 **REPROVADO**. Alto risco de prejuízo econômico e ineficiência agronômica.
  - **Prejuízo Financeiro Simulado (Área de 250 ha, Calda de R$ 200/ha, Produtividade Esperada R$ 3.000/ha):**
    - **Perda por Desperdício (Sobredosagem):** R$ 1.950,00 (defensivo jogado fora em bicos gastos, gerando fitotoxicidade e resíduos).
    - **Risco de Perda por Escape (Subdosagem):** R$ 15.600,00 (faixas com bicos entupidos que não controlam lagartas/doenças, causando quebra severa de rendimento na colheita).
    - **📉 PREJUÍZO TOTAL ESTIMADO:** **R$ 17.550,00** em apenas um talhão!

---

### 3. DIRETRIZES DE DESIGN E UX MOBILE-FIRST (Para páginas e panfletos digitais)
- **Mobile Centric:** 95% do público agro acessa via WhatsApp/Celular. Utilize layouts de coluna única, fontes grandes (título com 28-32px, corpo com 15-16px) e botões de toque com pelo menos 48px de altura (fáceis de clicar com uma só mão).
- **Estética Premium Light Mode (Modo Claro):** Curadoria visual sofisticada usando branco puro, cinza ardósia suave (`#f8fafc`), azul tecnológico (`#0066cc`), verde esmeralda para conquistas (`#10b981`) e vermelho carmesim para perdas e alertas (`#ef4444`). Evite fundos pretos ou cores fluorescentes que atrapalham a leitura sob a luz do sol.
- **Chamadas de Ação (CTAs) Claras:** Links ou botões grandes com mensagens de alta conversão, como: *"Gere seu Primeiro Laudo Grátis"*, *"Simular Perdas de Vazão"*, *"Falar com Consultor via WhatsApp"*.
- **Otimização para PDF/Print:** Estilos CSS limpos para impressão física (folha A4) usando `@media print`, escondendo botões e menus de navegação, removendo sombras e forçando fundos brancos puros para economizar tinta da impressora do produtor.

---

### 4. O QUE VOCÊ DEVE GERAR AGORA?
Escolha um ou mais dos tópicos abaixo e gere com qualidade profissional:

#### [OPÇÃO A] - PÁGINA DE VENDAS COMPACTA EM HTML MOBILE-FIRST
Crie o código completo de um arquivo HTML único (`index.html`) contendo CSS incorporado (`<style>`). 
- Apresente o problema do papel no campo e introduza o Spray Precision PRO.
- Exiba a comparação lado a lado (em formato de cartões responsivos tipo carrossel ou empilhados) entre o **Cenário Aprovado (Fazenda Progresso)** e o **Cenário Reprovado (Fazenda Santo Antônio)**.
- Mostre os números financeiros chocantes do Cenário Reprovado (R$ 17.550,00 de perda).
- Coloque CTAs chamativos direcionando para o link do aplicativo ou para o WhatsApp de vendas.
- Otimize o CSS com `@media print` para que ao imprimir (Ctrl+P), a página vire um lindo panfleto comercial A4.

#### [OPÇÃO B] - SEQUÊNCIA DE TEXTOS PARA CAPTAÇÃO NO WHATSAPP
Gere uma sequência de 3 mensagens prontas para WhatsApp:
1. **Atração de Consultores (B2B):** Foco em mostrar como o app valoriza a prestação de serviços de regulagem de barra e ajuda a vender mais bicos novos com o laudo de prejuízos.
2. **Abordagem Direta a Produtores (B2C):** Foco no choque do prejuízo financeiro invisível (bicos gastos desperdiçando defensivos caros).
3. **Mensagem de Fechamento de Venda:** Explicando o modelo Freemium vs. Plano Consultor PRO.

#### [OPÇÃO C] - ROTEIROS DE ANÚNCIOS (META ADS / GOOGLE ADS)
Gere copys de alta conversão para tráfego pago:
- 2 roteiros para anúncios em vídeo (Stories/Reels) com ganchos fortes nos primeiros 3 segundos.
- 3 títulos e 3 descrições para Google Ads (Rede de Pesquisa) focando em termos técnicos.
```

Use este modelo no ChatGPT para gerar qualquer material de suporte comercial complementar!
