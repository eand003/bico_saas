# Briefing de Contexto para IA: Ecossistema Spray Precision PRO

> **COMO USAR ESTE ARQUIVO:** Copie todo o conteúdo deste arquivo markdown e cole-o na sua ferramenta de IA (como ChatGPT, Claude, Gemini, etc.) junto com a sua solicitação. Por exemplo: *"Use o briefing abaixo como contexto e crie 3 posts de carrossel para o Instagram focados em convencer revendas de máquinas a contratarem nossa solução."*

---

## 1. Visão Geral do Projeto
A **Spray Precision PRO** é uma plataforma SaaS (Software as a Service) voltada para a otimização, calibração e auditoria da tecnologia de aplicação de defensivos agrícolas no campo. 

O ecossistema é composto por dois aplicativos (módulos) principais integrados em uma plataforma robusta e focada em gerar resultados financeiros rápidos: **redução do desperdício de insumos** para o produtor e **aumento das vendas de bicos de pulverização** para as revendas parceiras.

---

## 2. A Dor que Resolvemos
1. **Desperdício Financeiro Invisível**: Bicos desgastados aplicam mais produto do que o necessário, gerando desperdício de defensivos agrícolas caros (herbicidas, fungicidas, inseticidas) ou aplicando menos, o que gera ineficiência no controle de pragas.
2. **Falta de Dados no Campo**: Agrônomos e consultores medem a vazão dos bicos no campo, mas demoram para calcular manualmente as perdas e apresentar um laudo convincente ao produtor.
3. **Decisão Baseada em Achismo**: A escolha do modelo e vazão do bico muitas vezes é feita sem base matemática, gerando deriva (gotas muito finas levadas pelo vento) ou má cobertura da folha.

---

## 3. Os Dois Aplicativos Core

### Módulo 1: Seletor Inteligente de Bicos (Spray Precision Selector)
* **Objetivo**: Escolher cientificamente a ponta de pulverização perfeita.
* **Como funciona**: O usuário insere a velocidade de trabalho do trator, a taxa de aplicação desejada (L/ha) e o tamanho de gota pretendido. O aplicativo analisa o banco de dados conforme a norma internacional **ISO 10625**.
* **O Diferencial "Simulador Ultra"**: Em vez de apenas indicar o tamanho do bico, o aplicativo exibe um manômetro digital neon em tempo real que mostra a estabilidade e a janela de resiliência de cada bico. O sistema recomenda o bico que opera no centro da pressão de trabalho, garantindo que o trator possa acelerar ou desacelerar no campo sem sair da pressão ideal e sem gerar deriva.
* **Resiliência de Campo**: Funciona 100% offline (PWA) e sincroniza na nuvem (Supabase) automaticamente ao detectar internet.

### Módulo 2: Diagnóstico de Vazão Manual
* **Objetivo**: Auditar o estado das pontas de pulverização e impulsionar vendas de reposição.
* **Como funciona**: O técnico realiza a coleta da água bico a bico usando copo graduado/proveta durante um tempo cronometrado (ex: 30s ou 60s). O aplicativo calcula o desvio percentual de cada bico em relação ao padrão teórico da norma ISO.
* **O Laudo Comercial Instantâneo**: O app gera um gráfico colorido e um relatório instantâneo. Bicos ótimos ficam em **verde**, bicos limítrofes em **amarelo** (atenção) e bicos gastos ou com defeito em **vermelho** (substituição imediata necessária).
* **Propósito**: Funciona como um poderoso fechamento de vendas. Ao mostrar o relatório vermelho para o produtor, o técnico justifica tecnicamente a necessidade de troca física de bicos, gerando receita imediata para a revenda parceira.

---

## 4. O Grande Diferencial: Modelo SaaS White-Label B2B
A plataforma é comercializada para revendedoras de máquinas agrícolas, cooperativas e consultorias agronômicas sob o modelo **White-Label**.
* Quando os consultores/técnicos de uma revenda fazem login na plataforma, o aplicativo herda automaticamente a identidade visual do parceiro (ex: verde e amarelo se for concessionária John Deere, laranja se for Jacto, vermelho se for Case IH).
* O logotipo da revenda parceira é aplicado nos cabeçalhos e nos laudos técnicos em PDF gerados para os clientes.
* Os relatórios incluem botões diretos com link de WhatsApp do vendedor ou setor de peças daquela revenda específica.

---

## 5. Exemplos de Prompts Recomendados
Use este briefing com os comandos abaixo para gerar materiais de divulgação:

* **Para Copy de Vendas (E-mail frio / Cold Mail)**:
  > *"Com base no briefing da Spray Precision PRO, escreva um e-mail de vendas altamente persuasivo voltado para o Diretor de Peças e Serviços de uma grande concessionária de tratores, oferecendo nossa plataforma White-Label para a equipe técnica dele usar como ferramenta para vender mais bicos de pulverização."*

* **Para Social Media (Instagram / LinkedIn)**:
  > *"Com base no briefing, crie um roteiro para um carrossel de 5 slides no Instagram direcionado ao produtor rural. O tema do carrossel deve ser: 'O perigo invisível que está jogando seu defensivo agrícola no ralo e como o Diagnóstico de Vazão resolve'."*

* **Para Roteiro de Demonstração (Demo Script)**:
  > *"Com base no briefing, escreva o roteiro para um vídeo de demonstração rápida de 2 minutos focado no 'Simulador Ultra' (o manômetro de pressão estável) do aplicativo Seletor de Bicos."*
