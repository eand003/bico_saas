# 🗺️ Mapa do Projeto - Spray Precision PRO

Este arquivo serve como um guia de referência rápida sobre a estrutura do projeto **Spray Precision PRO** para consultas futuras.

---

## 🚀 Arquitetura Geral do SaaS

A plataforma é um SaaS voltado para calibração de pulverizadores agrícolas e diagnóstico de pontas (bicos) de pulverização. Ela é modularizada em três sub-aplicações principais (SPAs) integradas via Supabase:

```
bico_saas/
├── 📂 seletor-bico/                 # Módulo 1: Seleção Inteligente de Bicos (PWA)
├── 📂 diagnostico-vazao-manual/     # Módulo 2: Inspeção de Vazão e Laudo Estatístico
├── 📂 enterprise/                   # Módulo 3: Hub do Consultor, CRM e White-Label
├── 📂 marketing/                    # Landing pages de captação e conversão
├── 📂 api/                          # Endpoints auxiliares no backend
├── 📄 index.html                    # Portal Hub e login de entrada
├── 📄 admin_super.html              # Painel administrativo Master Admin
└── 📄 sw.js / manifest.json         # Configurações de PWA (Instalação e Modo Offline)
```

---

## 📂 Diretórios e Módulos Principais

### 1. [seletor-bico](file:///C:/Users/Eduardo/Documents/GitHub/bico_saas/seletor-bico/) (Seletor Inteligente)
* **Objetivo**: Auxiliar o produtor/agrônomo a encontrar a ponta ideal com base em parâmetros operacionais.
* **Principais recursos**:
  * Sugere o bico padrão ISO ideal.
  * Simulador de pressão com aviso de estabilidade.
  * Funciona 100% offline (PWA) e gera relatório técnico.

### 2. [diagnostico-vazao-manual](file:///C:/Users/Eduardo/Documents/GitHub/bico_saas/diagnostico-vazao-manual/) (Aferição Hidráulica)
* **Objetivo**: Ferramenta de diagnóstico de campo para identificar desgaste individual de pontas de pulverização.
* **Principais arquivos**:
  * `js/dbService.js`: Gerencia a persistência híbrida (salvamento automático offline em `localStorage` e sincronização transparente na nuvem Supabase assim que detecta conexão).
  * `app.js`: Lógica de interface, cálculo de desvio hidráulico (%), Coeficiente de Variação (CV%) da barra e geração de relatórios instantâneos.

### 3. [enterprise](file:///C:/Users/Eduardo/Documents/GitHub/bico_saas/enterprise/) (Hub Multiusuário)
* **Objetivo**: Área do consultor, revenda ou cooperativa.
* **Principais recursos**:
  * Gerenciamento de clientes e frota de pulverizadores.
  * Histórico de laudos sincronizados.
  * Customização **White-Label** (cores e logotipo personalizados nos relatórios para parceiros comerciais).

### 4. [marketing](file:///C:/Users/Eduardo/Documents/GitHub/bico_saas/marketing/) (Captação)
* **Objetivo**: Páginas de vendas e apresentação do produto.
* **Destaque**: `landing_page_divulgacao.html` é a landing page oficial de conversão com ganchos de vendas e CTA direto para o WhatsApp comercial.

---

## 🔑 Arquivos Administrativos

* **[admin_super.html](file:///C:/Users/Eduardo/Documents/GitHub/bico_saas/admin_super.html)**:
  Acesso restrito ao e-mail master (`eand003@gmail.com`). Usado para gerenciar planos de usuários, bloquear/desbloquear acesso, acompanhar estatísticas gerais de uso, controlar o pop-up promocional do Hub e executar a **limpeza de dados órfãos** (limpa de forma inteligente registros de usuários excluídos).

---

## 🗄️ Integração com Banco de Dados (Supabase)

O banco de dados armazena os registros utilizando as seguintes tabelas principais:
1. `clientes`: Cadastro de produtores rurais.
2. `maquinas`: Pulverizadores agrícolas associados aos produtores.
3. `flow_inspections`: Cabeçalho das inspeções (laudos) realizadas no campo.
4. `flow_measurements`: Dados individuais de volume/vazão aferidos bico por bico (vinculados às inspeções com exclusão em cascata).
5. `user_sessions`: Gerenciamento de sessão única para mitigar compartilhamento de contas no Safari/iOS.
6. `global_configs`: Configurações globais dinâmicas do SaaS (como anúncios e status do Hub).

---

## ⚠️ Arquivos Históricos (Podem ser removidos futuramente)
* **`/v2`** e **`/v3`**: Códigos monolíticos legados das primeiras fases de desenvolvimento. Não são mais utilizados pelo ecossistema SaaS.
* **Arquivos `index - Copia.html`**: Cópias de segurança que podem ser deletadas na próxima faxina do repositório.
