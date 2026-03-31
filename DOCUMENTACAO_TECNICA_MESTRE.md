# 🏛️ Documentação Mestre: Spray Precision PRO

Este documento serve como o "Mapa da Mina" para o desenvolvedor e o gestor do projeto. Ele explica as duas arquiteturas coexistentes e como o sistema se comporta.

---

## 📁 1. Estrutura do Repositório

*   `/enterprise/index.html`: **O Coração do SaaS.** É a versão moderna, White-Label, que muda de cor e logo conforme o usuário logado.
*   `/v2/index.html`: **A Versão Standard/Offline.** Focada no produtor final, sem branding dinâmico, mas com suporte a PWA (instalação).
*   `admin_config_parceiro.html`: **O Painel de Controle do Parceiro.** Onde as revendas configuram sua identidade sem precisar de você.
*   `Manual_do_Licenciador_SaaS.md`: Guia comercial e de onboarding de parceiros.

---

## 🚀 2. O Motor de Branding (Enterprise White-Label)

A versão Enterprise funciona via **Metadados do Supabase**.

1.  **Persistência**: As cores e logos não estão no código, estão no `user_metadata` do usuário no Supabase.
2.  **Funcionamento**:
    *   O `index.html` faz login -> busca o perfil -> executa a função `applyPartnerBranding(meta)`.
    *   Essa função injeta variáveis CSS (`--accent`) e troca as URLs de imagem (`.header-icon`).
    *   **Importante**: O número de WhatsApp é salvo em `window.partnerWhatsApp` para que botões criados dinamicamente (resultados de bicos) também usem o número correto.

---

## 📄 3. Sistema de Relatórios PDF

A geração do laudo técnico não usa bibliotecas pesadas. Ela usa o motor de impressão nativo do navegador com "máscaras" de CSS.

*   **HTML**: Existe uma `div` chamada `#printReport` que fica oculta (`display: none`).
*   **Ação**: Quando o botão 📄 é clicado, a função `generateReport()` limpa esse container, preenche com os dados da simulação e clona a tabela de bicos (filtrando apenas os que têm parâmetros verdes).
*   **CSS (@media print)**: Esconde o App inteiro e mostra apenas o `#printReport`. O comando `@page { margin: 15mm; }` ajuda a esconder URLs e datas indesejadas no rodapé do navegador.

---

## ⚙️ 4. Manutenção e Cálculos

A lógica matemática reside na função `update()`. Se precisar alterar tabelas de bicos ou constantes:

*   **Tabela de Bicos**: Procure a constante `NOZZLES` no `index.html`. É um array de objetos com ISO, Cor e Vazão Padrão (Q3).
*   **Cálculo de Pressão**: Usa a fórmula física de vazão vs pressão (Relação Quadrática) e o fator de correção de densidade específica (`Math.sqrt(densidade)`).

---

## 🌐 5. Deployment e URLs

O projeto é hospedado na **Vercel** e usa o domínio principal para todas as versões:
*   `bico-saas.vercel.app/` -> Página Inicial / Pitch.
*   `bico-saas.vercel.app/enterprise/` -> App White-Label.
*   `bico-saas.vercel.app/admin_config_parceiro.html` -> Painel de Configuração.

---
*Dúvidas Futuras: Consulte esta documentação antes de qualquer refatoração.*
