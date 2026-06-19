# Pitch Sebrae — Spray Precision PRO

> **Versão estratégica e realista para fase de validação | Junho/2026**  
> **Projeto:** Spray Precision PRO  
> **Foco:** Apoio Sebrae, validação comercial em escala, melhoria de canais e preparação para editais de fomento (FAPEMAT/FINEP/EMBRAPII)  
> **Estágio atual:** MVP funcional completo (Convencional, PWM, Bico Duplo e White-label ativos) com usuários em teste e validação em campo.

---

## 1. Tese do Projeto

A **Spray Precision PRO** é uma plataforma digital para **gestão inteligente de pontas de pulverização**, criada para ajudar produtores, consultores, revendas e técnicos a eliminar o achismo na escolha, calibração e auditoria de bicos agrícolas.

O projeto resolve uma dor crítica no campo: embora os pulverizadores modernos possuam tecnologia embarcada de ponta, a escolha do bico adequado e o diagnóstico de desgaste físico ainda dependem de tabelas de papel, processos manuais lentos e cálculos complexos de desvio. A Spray Precision PRO unifica essa jornada em um ecossistema digital inteligente:

**Seleção técnica multitecnologia (PWA Offline) ➔ Aferição bico a bico simplificada ➔ Geração de laudo comercial/técnico instantâneo com marca própria (White-label) ➔ Apoio direto à decisão agronômica e à venda de peças.**

---

## 2. O Problema

A pulverização de defensivos é uma das operações mais caras e decisivas da lavoura. A eficiência da aplicação depende de uma harmonia exata de parâmetros hidráulicos:

* **Inadequação Tecnológica:** A chegada de tecnologias avançadas como PWM (pulsação) e Bico Duplo (estágios sequenciais de vazão) aumentou drasticamente a complexidade para o operador. Catálogos físicos convencionais não conseguem prever o comportamento de pressão e tamanho de gota sob oscilações de velocidade nessas máquinas.
* **Desgaste Físico Invisível:** Pontas de pulverização sofrem erosão contínua por abrasão química e física dos defensivos. Um desgaste de 10% a 15% na vazão é invisível a olho nu, mas compromete totalmente o padrão de deposição de gotas.
* **Falta de Padronização:** O diagnóstico de campo (jaragem) é historicamente lento. O técnico anota os valores em um papel amassado, realiza cálculos de cabeça ou em planilhas isoladas, impossibilitando a criação de um histórico auditável para a fazenda.

---

## 3. Dor Econômica (Valor sob Risco)

O diferencial da Spray Precision PRO é adotar uma abordagem financeira conservadora e altamente defensável perante avaliadores de inovação: **não assumimos que todo desgaste se traduz em perda total de insumos, mas sim em valor financeiro sob risco operacional.**

### Cenário de Referência (Fazenda de 1.000 Hectares)
* **Custo anual médio com defensivos:** R$ 1.200,00 a R$ 1.300,00 por hectare.
* **Investimento anual fitossanitário total:** R$ 1,2 milhão a R$ 1,3 milhão.
* **Desvio hidráulico operacional médio:** 5% de desconformidade na aplicação (bicos gastos aplicando a mais ou bicos obstruídos aplicando a menos).

#### O Impacto no Bolso:
$$\text{Investimento Fitossanitário} \times \text{Desvio Médio} = \text{Valor sob Risco}$$
$$\text{R\$ } 1.200.000,00 \times 5\% = \text{R\$ } 60.000,00 \text{ por ano under-risk}$$

* **Sobredosagem (Risco de Desperdício):** Bicos gastos aplicam acima do limite tolerado de +10%, jogando calda cara diretamente no solo, aumentando resíduos químicos e elevando o custo operacional de forma invisível.
* **Subdosagem (Risco de Ineficácia):** Bicos entupidos ou com vazão abaixo de -10% aplicam doses subletais, gerando escapes de pragas, doenças ou matocompetição, forçando reentradas de pulverização que custam caro.

---

## 4. A Solução (Ecossistema Funcional)

Diferente de projetos em fase de ideia, a Spray Precision PRO apresenta uma plataforma PWA (Progressive Web App) offline-first com seus módulos core totalmente construídos e funcionais:

### 4.1 Spray Precision Selector (Seletor Inteligente)
Ferramenta matemática que recomenda o bico ideal com base nas variáveis operacionais inseridas (velocidade de trabalho, taxa L/ha, tamanho de gota e espaçamento). O grande diferencial é o suporte nativo a três modos tecnológicos:
* **Convencional:** Recomendação direta baseada na norma ISO 10625.
* **Pulsado (PWM):** Calcula o Duty Cycle ideal e a velocidade operacional de trabalho segura para sistemas como *ExactApply (John Deere)*, *Hawkeye (Raven)* e *DynaJet (TeeJet)*.
* **Bico Duplo (Estágios):** Determina as faixas exatas de transição (Estágio A, Estágio B, Estágio A+B), pressões de trabalho correspondentes e identifica zonas de sobreposição e lacunas de aplicação para sistemas como *Horsch*, *Stara* e *Jacto*.

### 4.2 Spray Precision Audit (Diagnóstico e Aferição)
Automatiza a coleta física de vazão bico a bico com proveta e cronômetro digital integrado na tela (com suporte hands-free via comando de voz).
* **Veredito Visual e Gráficos:** Gera gráficos de barras e representações espaciais da barra em tempo real. Bicos normais em **verde**, bicos de atenção em **amarelo** e bicos críticos em **vermelho**.
* **Laudo PDF Profissional:** Emissão de laudo técnico instantâneo com veredito estatístico baseado no Coeficiente de Variação (CV% da barra) e desvio nominal.
* **Mecanismo White-Label Ativo:** Ao fazer login, a plataforma adapta inteiramente suas cores de destaque, logotipos e rodapés de laudo para a identidade visual de revendas parceiras, incluindo links diretos para o WhatsApp do setor de peças da concessionária para venda de pontas novas.

---

## 5. Estágio Atual de Desenvolvimento

A startup encontra-se no estágio de **validação comercial e ajuste de fit de mercado**, com o desenvolvimento tecnológico do MVP core concluído.

### Já Realizado (Tecnologia & Produto)
* [x] Plataforma PWA (Progressive Web App) responsiva com funcionamento 100% offline.
* [x] Módulo Seletor multitecnologia (Convencional, PWM e Bico Duplo) ativo.
* [x] Módulo Diagnóstico Manual de Vazão com geração de laudos em tempo real ativo.
* [x] Mecanismo corporativo de White-label automatizado via metadados de usuário.
* [x] Validação inicial em campo realizada pelo fundador e consultor parceiro.
* [x] Histórico local e sincronização automática em nuvem (Supabase) configurados.

### Foco da Validação Atual (Negócios & Mercado)
* [ ] Disposição real de pagamento recorrente (SaaS) por agrônomos autônomos.
* [ ] Precificação ideal dos planos White-Label para concessionárias de máquinas.
* [ ] Métricas de ativação e taxa de conversão do período de teste grátis (7 a 10 dias).
* [ ] Frequência de uso do laudo de diagnóstico como ferramenta de fechamento comercial de bicos nas revendas.

---

## 6. Mercado-Alvo e Canais Iniciais

A estratégia de go-to-market foca em canais de alto volume de relacionamento no agronegócio:

1. **Consultores Agronômicos e Agrônomos de Campo:** Utilizam o aplicativo para prestar serviços técnicos de auditoria, gerando relatórios de alto impacto visual para convencer os produtores a corrigirem falhas e trocarem bicos.
2. **Revendas, Distribuidoras e Cooperativas (White-Label):** O maior canal comercial. A concessionária de máquinas ou defensivos adquire o app sob sua própria marca para que os técnicos de pós-venda auditem pulverizadores de clientes, impulsionando a venda física de pontas de pulverização de reposição no balcão de peças.
3. **Produtores Rurais e Administradores de Grandes Fazendas:** Monitoram internamente o status das frotas de pulverizadores para redução de risco operacional e governança fitossanitária.

---

## 7. Concorrência e Diferenciais Estratégicos

O mercado possui concorrentes consolidados focados em hardware ou em calibração analógica convencional. A Spray Precision PRO diferencia-se por abranger a jornada completa (da seleção técnica à auditoria de campo) e cobrir as tecnologias de aplicação mais modernas em uma única interface Web/Mobile offline:

| Recurso / Diferencial | Concorrente A (Aferidores Físicos) | Concorrente B (Apps de Calibração) | Spray Precision PRO |
| :--- | :---: | :---: | :---: |
| **Diagnóstico de Vazão** | Sim | Sim/Parcial | **Sim (PWA Offline)** |
| **Laudo Técnico com Gráficos** | Não | Sim/Parcial | **Sim (Instantâneo)** |
| **Seletor de Bicos Multitecnologia** | Não | Não | **Sim (Norma ISO 10625)** |
| **Suporte Avançado PWM** | Não | Não | **Sim (Duty Cycle & Limites)** |
| **Suporte Bico Duplo / Estágios** | Não | Não | **Sim (Transições & Lacunas)** |
| **Branding White-Label Ativo** | Não | Não | **Sim (Cores, Logos e WhatsApp)** |
| **Assistência de Voz Hands-free** | Não | Não | **Sim (Coleta por comando de voz)** |

---

## 8. Modelo de Negócio (SaaS Recorrente)

O modelo de negócio foi estruturado sob assinatura mensal recorrente com faixas de valores calibradas para testes de tração comercial:

* **Plano Individual PRO:** 
  * *Público:* Agrônomos autônomos, consultores de pulverização e técnicos agrícolas.
  * *Valor:* **R$ 60,00 por mês** (com teste gratuito de 7 a 10 dias).
  * *Entregas:* Acesso irrestrito ao Seletor e Audit, exportações ilimitadas de laudos em PDF com o nome do técnico e histórico básico local.
* **Plano Revenda / Enterprise (White-Label):**
  * *Público:* Distribuidoras de insumos, cooperativas agrícolas e concessionárias de máquinas.
  * *Valor:* **R$ 199,00 a R$ 499,00 por mês por concessionária/parceiro** (faturado anualmente).
  * *Entregas:* Personalização completa da plataforma com logotipo, cores da revenda, rodapé institucional e link do WhatsApp da equipe de peças no laudo, painel de relatórios consolidados e múltiplos usuários técnicos.

---

## 9. Metas de Validação Comercial (12 Meses)

Com o suporte e a mentoria do Sebrae, a Spray Precision PRO estabelece metas claras focadas no crescimento do negócio:

* **Usuários Ativos em Teste (Ativação):** 50 usuários.
* **Assinantes Pagantes PRO (Conversão):** 10 assinantes individuais recorrentes.
* **Parceiros Comerciais de Revenda (Pilotos White-label):** 5 concessionárias/cooperativas ativas.
* **Diagnósticos Realizados na Plataforma (Engajamento):** 500 aferições de barras em campo.
* **Laudos Técnicos Gerados em PDF:** 100 relatórios comerciais emitidos.
* **Estudos de Caso de Retorno Agronômico:** 3 casos de sucesso estruturados em campo comprovando redução de desperdício.

---

## 10. Uso Planejado dos Recursos (Apoio Sebrae)

A proposta de captação inicial visa obter fomento na faixa de **R$ 50.000,00 a R$ 100.000,00** para acelerar a validação comercial, estruturação corporativa e governança do produto:

| Destinação | Percentual | Aplicação Prática |
| :--- | :---: | :--- |
| **Validação Comercial e Tração** | 35% | Landing page profissional, tráfego pago geolocalizado para revendas do MT/Centro-Oeste, produção de materiais explicativos e ativação comercial. |
| **Melhorias de Produto e UX/UI** | 30% | Refinamento da usabilidade móvel da planilha de coleta no campo, otimização visual dos gráficos interativos e estruturação do painel B2B para revendas. |
| **Desenvolvimento e Infraestrutura** | 20% | Hospedagem na nuvem, segurança de banco de dados (Supabase), estabilização das rotinas de sincronismo offline e proteção de dados. |
| **Validação de Campo e Conteúdo Técnico** | 10% | Viagens para acompanhamento dos pilotos nas concessionárias parceiras, coleta de depoimentos e estruturação técnica dos laudos. |
| **Assessoria Jurídica e Regulatória** | 5% | Elaboração dos Termos de Uso do SaaS, Políticas de Privacidade alinhadas à LGPD e Contratos de Licenciamento piloto para empresas. |

---

## 11. Roadmap de Execução

### Fase 1: Validação de Pilotos e Testes de Preço (0 a 3 meses)
* Fechamento dos primeiros 5 acordos de piloto White-label com revendas agrícolas locais.
* Coleta de feedback contínuo sobre a usabilidade da coleta bico a bico no smartphone.
* Testes iniciais com o paywall integrado no Hub do aplicativo.

### Fase 2: Automação do SaaS e Lançamento Comercial (3 a 6 meses)
* Implementação do gateway de pagamento automatizado para assinaturas PRO individuais.
* Lançamento do dashboard consolidado para gestores de revenda monitorarem a equipe de técnicos em campo.
* Publicação do primeiro estudo de caso mostrando o aumento na venda de bicos físicos nas concessionárias parceiras.

### Fase 3: Expansão e Captação de Fomento Adicional (6 a 12 meses)
* Prospecção comercial focada nas principais regiões produtoras de grãos do Centro-Oeste brasileiro.
* Conexão e integração inicial do seletor inteligente com pontas inovadoras de novos fabricantes parceiros.
* Preparação de propostas para editais públicos de fomento à inovação de maior escala (FINEP Startup, FAPEMAT, EMBRAPII).

---

## 12. Indicadores de Sucesso para Acompanhamento

| Indicador Estratégico | Unidade de Medida | Foco de Monitoramento |
| :--- | :---: | :--- |
| **Usuários Recorrentes** | Quantidade | Frequência de uso semanal do seletor e do diagnóstico. |
| **Conversão do Trial** | Percentual | % de agrônomos que assinam o plano pago após os 10 dias de teste. |
| **Receita Recorrente Mensal (MRR)** | R$ | Crescimento do faturamento com assinaturas individuais e contratos Enterprise. |
| **LTV / CAC (Economia da Unidade)** | Proporção | Relação entre o tempo de permanência do assinante e o custo de atração comercial. |
| **NPS (Net Promoter Score)** | Pontuação | Nível de satisfação dos técnicos de campo com a interface offline. |

---

## 13. Pedido ao Sebrae

A **Spray Precision PRO** solicita a parceria do Sebrae para acelerar seu amadurecimento corporativo e transformá-la em uma startup AgTech escalável. Buscamos:
1. **Apoio Financeiro de Fomento:** Para estruturação comercial e validação de fit de mercado no Centro-Oeste.
2. **Mentoria em Modelagem de Negócio:** Conexão com mentores especializados em vendas B2B SaaS e canais de distribuição para o agro.
3. **Conexão com Ecossistemas de Inovação:** Preparação e ponte para captações subsequentes em editais de inovação tecnológica e rodadas de investidores anjo agrícolas.

---

## 14. Frase de Impacto Final

> "O agronegócio brasileiro investe bilhões em defensivos químicos de última geração, máquinas gigantescas e softwares de satélite. Mas a eficiência real da aplicação e a economia de calda no final do dia ainda dependem de um pequeno componente de plástico ou cerâmica na ponta da barra: o bico de pulverização.
> 
> A **Spray Precision PRO** digitaliza essa última e decisiva etapa operacional, transformando a calibração de campo em inteligência de dados, economia agronômica e alavancagem comercial de peças."

---

## 15. Fontes Técnicas, Científicas e Mercadológicas

1. **Sebrae Startups — Fomento e Inovação Nacional**  
   Plataforma nacional do Sebrae para iniciativas de apoio a startups, aceleração e estruturação de negócios inovadores.  
   *Link:* [sebraestartups.com.br](https://programas.sebraestartups.com.br/)
2. **Sebrae For Startups — Start Digital**  
   Programa estratégico de pré-aceleração projetado para startups digitais validarem MVPs, testarem canais e estruturarem primeiras vendas.  
   *Link:* [sebraeforstartups.sebraesp.com.br](https://sebraeforstartups.sebraesp.com.br/startups/start/)
3. **TeeJet Technologies — A User’s Guide to Spray Technology**  
   Manual de engenharia de aplicação que detalha que desgastes de vazão de 10% ou mais nas pontas comprometem a aplicação e indica a troca mecânica imediata.  
   *Link:* [teejet.com](https://www.teejet.com/pt-br/-/media/dam/agricultural/usa/sales-material/product-market-bulletin/li-tj416_user-guide-to-spray-technology.pdf)
4. **Baio et al., 2024 — Evaluation of spray nozzle wear under field conditions**  
   Estudo acadêmico de engenharia agrícola analisando taxas reais de erosão em bicos e validação do limite estatístico de CV% para calibração hidráulica.  
   *Link:* [scielo.br/j/eagri](https://www.scielo.br/j/eagri/a/sZFHBmBN7gwjLFxfLWGGTzg/?lang=en)
5. **CropLife Latin America — Calibração e Tecnologia de Aplicação**  
   Diretrizes institucionais sobre boas práticas agronômicas, segurança na aplicação de defensivos e impacto econômico das calibrações de vazão no campo.  
   *Link:* [croplifela.org](https://croplifela.org/pt/novidades/o-que-voce-precisa-saber-sobre-calibracao-de-equipamentos)
6. **Conab — Metodologia e Custos de Produção Agropecuária**  
   Dados oficiais brasileiros para cálculo de custos de insumos agrícolas e planejamento de safra por hectare.  
   *Link:* [gov.br/conab](https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/custos-de-producao)
7. **Safras & Mercado / Senar-MT — Custos de Produção da Soja no Mato Grosso (2026)**  
   Levantamentos recentes demonstrando o peso dos defensivos fitossanitários nos custos operacionais totais de lavouras graneleiras do Centro-Oeste.  
   *Link:* [safras.com.br](https://safras.com.br/custo-de-producao-da-soja-em-mato-grosso-reduz-em-janeiro/)
