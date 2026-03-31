# 🚜 Manual do Licenciador: Spray Precision PRO SaaS

Este guia contém tudo o que você precisa para gerenciar seus parceiros (revendas) e escalar suas vendas no modelo White-Label.

---

## 🛠️ 1. Como Cadastrar um Novo Parceiro (Passo a Passo)

Sempre que você fechar uma venda com uma nova revenda/loja, os passos são:

1.  **Criar o Usuário no Supabase**:
    *   Acesse o painel do Supabase -> Authentication.
    *   Clique em "Add User" -> "Create New User".
    *   Crie um e-mail e senha para o gerente da loja (Ex: `vendas@agromt.com`).
2.  **Enviar o Link de Configuração**:
    *   Envie este link para o cliente: `https://bico-saas.vercel.app/admin_config_parceiro.html`
    *   Peça para ele logar com o e-mail/senha que você criou e preencher os dados (Nome, Cor, Logo e WhatsApp).
3.  **Pronto!**: O app Enterprise (`https://bico-saas.vercel.app/enterprise/`) já estará personalizado para esse e-mail.

---

## 💰 2. Estratégia de Venda (O Pitch)

Ao bater na porta de uma revenda, não venda um "calculador de bicos". Venda **Agilidade e Profissionalismo**.

### **Os 3 gatilhos principais:**
*   **A "Minha Loja" Digital**: "Doutor, você não vai mais mandar um site de terceiros para o seu cliente. Você vai mandar o **SEU** link, com a sua marca e o seu WhatsApp no botão."
*   **Fim do Catálogo Confuso**: "Sua equipe de vendas gasta 20 minutos folheando PDF de fabricante. Com o Spray Precision, eles fazem a recomendação correta em 15 segundos no balcão."
*   **Fidelização do Produtor**: "O produtor vai salvar o link da sua loja no celular. Sempre que ele for trocar bicos, ele vai abrir o seu simulador e o botão lateral leva direto para o seu vendedor."

---

## 🎨 3. Dicas de Branding

Para o app ficar perfeito no cliente:
*   **Logo**: Recomende que usem imagens em formato **PNG Transparente** (sem fundo branco). No formulário, eles podem usar o link de sites como o *Imgur* ou o link do logo do próprio site da revenda.
*   **Cores**: Use o código Hexadecimal (Ex: `#00D2FF`). Se a revenda for John Deere, use Verde (`#367c2b`); se for New Holland, use Azul (`#005596`).
*   **WhatsApp**: O número deve conter o código do país (55) + DDD + número (Ex: `5565999998888`).

---

## ❓ 4. Resolução de Problemas (Troubleshoot)

*   **"Mudei a cor no painel mas no app continua antigo"**: Peça para o cliente dar um "Hard Refresh" (Ctrl+F5 no PC) ou limpar o histórico do navegador no celular. O Service Worker (cache) pode segurar a versão antiga por alguns minutos.
*   **"Botão Comprar está com número errado"**: Certifique-se de que o parceiro preencheu o campo WhatsApp no painel e clicou em "Salvar". O app enterprise precisa ser atualizado (F5) para ler os novos dados.

---

## 🚀 Próximos Passos recomendados:

1.  **Gravar um vídeo curto**: Com a tela do seu celular, mostre você mudando a cor no painel e o app mudando na hora. Esse vídeo é a sua melhor ferramenta de venda via WhatsApp.
2.  **Definir Planos**:
    *   **Plano Mensal**: R$ 199,00 / loja.
    *   **Plano Anual**: R$ 1.900,00 / loja (Ganha 2 meses grátis).

---
*Documento gerado por **Antigravity AI** para Eduardo Andrade.*
