# 🏛️ Documentação Mestre: Spray Precision PRO

Este documento serve como o "Mapa da Mina" para o desenvolvedor e o gestor do projeto. Ele explica as arquiteturas coexistentes e como o sistema se comporta.

---

## 📁 1. Estrutura do Ecossistema

O projeto é dividido em múltiplos pilares principais, cada um com sua finalidade comercial:

*   **CORE (`/index.html`)**: Versão pública para captura de leads via Supabase. Requer internet para os cálculos via `/api/calcular`.
*   **LANDINGS DE CONVERSÃO (`/landing/` e `/landing_vendas/`)**:
    *   `/landing/index.html`: Funil B2B focado em Autoridade Consultiva (Estética Extreme Dark).
    *   `/landing_vendas/index.html`: Funil B2C para Varejo e Revendas. Usa o app como "Motor de Auditoria" para justificar venda física de peças.
*   **ENTERPRISE (`/enterprise/index.html`)**: O Coração do SaaS. Versão White-Label dinâmica que muda de cor e logo conforme o parceiro logado via Supabase Metadata. (Usa `/api/calcular`).
*   **OFFLINE / PWA (`/v2/index.html`)**: Versão blindada para o campo. **Matemática portada localmente**, não depende da pasta API nem de internet para os resultados.
*   **SIMULADOR ULTRA (`/simulador_ranking_ultra.html`)**: Ferramenta de fechamento de vendas visual. Otimizada para mobile, usa manômetros dinâmicos para provar a superioridade técnica do bico recomendado.

---

## ⚙️ 2. O Motor de Inteligência (API vs Local)

A inteligência matemática foi padronizada em conformidade com a norma **ISO 10625**.

1.  **API Central (`/api/calcular.js`)**: Função Serverless (Node.js) hospedada na Vercel. Garante que o CORE e o ENTERPRISE usem a mesma base de dados.
2.  **Lógica Offline**: Na versão `/v2`, o array `NOZZLES` e a lógica de ranking foram injetados no JavaScript.
3.  **Padrão ISO (3.0 BAR)**: Abandonamos a conversão de GPM para usar valores reais de mercado (Ex: ISO 04 = 1.60 L/min).
    *   *Fórmula Mestra*: `Vazão (L/min) = Código_ISO * 4.0`.

---

## 🏆 3. Algoritmo de Ranking (Resiliência Operacional)

O sistema não escolhe apenas o bico que atende a faixa, ele busca o bico mais **estável**:
-   **Prioridade 1**: Atendimento binário (dentro do limite Pmin/Pmax em velocidade Min e Max).
-   **Prioridade 2**: Proximidade do Centro (Janela de Resiliência). O bico que trabalha no centro do manômetro é o Top 1, pois dá margem para o operador oscilar a velocidade.

---

## 🚀 4. Deployment e URLs (Vercel)

O projeto usa a infraestrutura da Vercel para servir tanto os arquivos estáticos quanto as funções de backend.

*   `bico-saas.vercel.app/` -> Página Inicial / Pitch.
*   `bico-saas.vercel.app/enterprise/` -> App White-Label.
*   `bico-saas.vercel.app/v2/` -> App Offline Field Ready.
*   `bico-saas.vercel.app/simulador_ranking_ultra.html` -> Ferramenta de Venda Visual.
*   `bico-saas.vercel.app/admin_config_parceiro.html` -> Painel de Configuração.

---
*Dúvidas Futuras: Consulte este mapa de rotas antes de qualquer alteração estrutural.*
