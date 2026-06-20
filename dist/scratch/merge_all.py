import re
import os

def update_file(filepath, replacements):
    print(f"Updating {filepath}...")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    modified = content
    for target, replacement in replacements:
        if target not in modified:
            print(f"  WARNING: Target not found in {filepath}!")
            # Let's print clean version for comparison
            target_clean = re.sub(r'\s+', '', target)
            mod_clean = re.sub(r'\s+', '', modified)
            if target_clean in mod_clean:
                print("    Target found with different spacing/whitespace!")
            else:
                print("    Target not found even with whitespace stripped!")
        else:
            modified = modified.replace(target, replacement)
    
    if modified != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(modified)
        print(f"  Successfully updated {filepath}!")
    else:
        print(f"  No changes made to {filepath}!")

# ==================== 1. Update seletor-bico/index.html (showApp) ====================
seletor_path = r"C:\Users\Eduardo\Documents\GitHub\bico_saas\seletor-bico\index.html"
seletor_reps = [
    # showApp function update (fix special characters in comment)
    (
        "    async function showApp() {\n      try {\n        const { data: { user }, error } = await clienteSupabase.auth.getUser();\n        if (user) {\n          // Validação inicial de acesso e bloqueio\n          const metadata = user.user_metadata || {};\n          if (metadata.is_blocked === true) {\n            alert(t(\"⚠️ Acesso interrompido: Esta conta foi bloqueada temporariamente!\"));\n            await logout();\n            return;\n          }\n          if (metadata.subscription_end) {\n            const end = new Date(metadata.subscription_end);\n            const today = new Date();\n            today.setHours(0,0,0,0);\n            end.setHours(23,59,59,999);\n            if (end < today) {\n              const formattedEnd = new Date(metadata.subscription_end + 'T12:00:00').toLocaleDateString('pt-BR');\n              alert(t(\"⚠️ Acesso interrompido: Seu período de assinatura expirou em \") + formattedEnd + \"!\");\n              await logout();\n              return;\n            }\n          }",
        "    async function showApp() {\n      try {\n        const { data: { user }, error } = await clienteSupabase.auth.getUser();\n        if (user) {\n          // Validação inicial de acesso e bloqueio\n          const metadata = user.user_metadata || {};\n          if (metadata.is_blocked === true) {\n            alert(t(\"⚠️ Acesso interrompido: Esta conta foi bloqueada temporariamente!\"));\n            await logout();\n            return;\n          }\n          window.isTrialActive = (metadata.is_trial === true);\n          if (metadata.subscription_end) {\n            const end = new Date(metadata.subscription_end);\n            const today = new Date();\n            today.setHours(0,0,0,0);\n            end.setHours(23,59,59,999);\n            if (end < today) {\n              const formattedEnd = new Date(metadata.subscription_end + 'T12:00:00').toLocaleDateString('pt-BR');\n              const isTrialUser = metadata.is_trial === true;\n              if (isTrialUser) {\n                alert(t(\"Olá! Seu período de testes de 5 dias do Spray Precision PRO terminou.\\n\\nPara continuar usando as ferramentas e gerando laudos ilimitados, entre em contato para ativar sua licença profissional!\"));\n                const waMsg = encodeURIComponent(\"Olá! Meu período de testes de 5 dias expirou e gostaria de assinar a versão completa do Spray Precision PRO.\");\n                window.open(`https://wa.me/5565999106415?text=${waMsg}`, '_blank');\n              } else {\n                alert(t(\"⚠️ Acesso interrompido: Seu período de assinatura expirou em \") + formattedEnd + \"!\");\n              }\n              await logout();\n              return;\n            }\n          }\n          if (window.isTrialActive && metadata.subscription_end) {\n            const banner = document.getElementById('trial-banner');\n            if (banner) {\n              const end = new Date(metadata.subscription_end + 'T12:00:00');\n              const formattedEnd = end.toLocaleDateString('pt-BR');\n              banner.innerHTML = `🧪 <strong>Modo de Teste (Demo):</strong> Seus 5 dias de acesso terminam em ${formattedEnd}. A geração de PDFs está desativada.`;\n              banner.style.display = 'flex';\n            }\n          }"
    )
]
update_file(seletor_path, seletor_reps)

# ==================== 2. Update enterprise/index.html ====================
enterprise_path = r"C:\Users\Eduardo\Documents\GitHub\bico_saas\enterprise\index.html"
enterprise_reps = [
    # 2a. Inject trial banner in HTML
    (
        '  <!-- MAIN APP (Hidden by default) -->\n  <div id="mainApp" style="display: none; width: 100%; flex-direction: column; align-items: center;">\n\n    <div class="header">',
        '  <!-- MAIN APP (Hidden by default) -->\n  <div id="mainApp" style="display: none; width: 100%; flex-direction: column; align-items: center;">\n    <div id="trial-banner" style="display:none; width: 100%; max-width: 1200px; padding: 12px 20px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.25); border-radius: 12px; margin-top: 16px; margin-bottom: 8px; color: #fbbf24; font-weight: bold; text-align: center; gap: 8px; align-items: center; justify-content: center; font-size: 14px; font-family: \'Inter\', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"></div>\n\n    <div class="header">'
    ),
    # 2b. Intercept generateReport
    (
        '      function generateReport() {\n        if (typeof logTelemetry === \'function\') {',
        '      function generateReport() {\n        if (window.isTrialActive) {\n          showTrialPremiumModal();\n          return;\n        }\n        if (typeof logTelemetry === \'function\') {'
    ),
    # 2c. Update verifySessionIntegrity
    (
        '        if (user) {\n          const metadata = user.user_metadata || {};\n          if (metadata.is_blocked === true) {\n            alert(t("⚠️ Acesso interrompido: Esta conta foi bloqueada temporariamente!"));\n            await logout();\n            return;\n          }\n          if (metadata.subscription_end) {\n            const end = new Date(metadata.subscription_end);\n            const today = new Date();\n            today.setHours(0, 0, 0, 0);\n            end.setHours(23, 59, 59, 999);\n            if (end < today) {\n              const formattedEnd = new Date(metadata.subscription_end + \'T12:00:00\').toLocaleDateString(\'pt-BR\');\n              alert(t("⚠️ Acesso interrompido: Seu período de assinatura expirou em ") + formattedEnd + "!");\n              await logout();\n              return;\n            }\n          }\n        }',
        '        if (user) {\n          const metadata = user.user_metadata || {};\n          if (metadata.is_blocked === true) {\n            alert(t("⚠️ Acesso interrompido: Esta conta foi bloqueada temporariamente!"));\n            await logout();\n            return;\n          }\n          window.isTrialActive = (metadata.is_trial === true);\n          if (metadata.subscription_end) {\n            const end = new Date(metadata.subscription_end);\n            const today = new Date();\n            today.setHours(0, 0, 0, 0);\n            end.setHours(23, 59, 59, 999);\n            if (end < today) {\n              const formattedEnd = new Date(metadata.subscription_end + \'T12:00:00\').toLocaleDateString(\'pt-BR\');\n              const isTrialUser = metadata.is_trial === true;\n              if (isTrialUser) {\n                alert(t("Olá! Seu período de testes de 5 dias do Spray Precision PRO terminou.\\n\\nPara continuar usando as ferramentas e gerando laudos ilimitados, entre em contato para ativar sua licença profissional!"));\n                const waMsg = encodeURIComponent("Olá! Meu período de testes de 5 dias expirou e gostaria de assinar a versão completa do Spray Precision PRO.");\n                window.open(`https://wa.me/5565999106415?text=${waMsg}`, \'_blank\');\n              } else {\n                alert(t("⚠️ Acesso interrompido: Seu período de assinatura expirou em ") + formattedEnd + "!");\n              }\n              await logout();\n              return;\n            }\n          }\n          if (window.isTrialActive && metadata.subscription_end) {\n            const banner = document.getElementById(\'trial-banner\');\n            if (banner) {\n              const end = new Date(metadata.subscription_end + \'T12:00:00\');\n              const formattedEnd = end.toLocaleDateString(\'pt-BR\');\n              banner.innerHTML = `🧪 <strong>Modo de Teste (Demo):</strong> Seus 5 dias de acesso terminam em ${formattedEnd}. A geração de PDFs está desativada.`;\n              banner.style.display = \'flex\';\n            }\n          }\n        }'
    ),
    # 2d. Update showApp
    (
        '        if (user) {\n          // Validação inicial de acesso e bloqueio\n          const metadata = user.user_metadata || {};\n          if (metadata.is_blocked === true) {\n            alert(t("⚠️ Acesso interrompido: Esta conta foi bloqueada temporariamente!"));\n            await logout();\n            return;\n          }\n          if (metadata.subscription_end) {\n            const end = new Date(metadata.subscription_end);\n            const today = new Date();\n            today.setHours(0,0,0,0);\n            end.setHours(23,59,59,999);\n            if (end < today) {\n              const formattedEnd = new Date(metadata.subscription_end + \'T12:00:00\').toLocaleDateString(\'pt-BR\');\n              alert(t("⚠️ Acesso interrompido: Seu período de assinatura expirou em ") + formattedEnd + "!");\n              await logout();\n              return;\n            }\n          }',
        '        if (user) {\n          // Validação inicial de acesso e bloqueio\n          const metadata = user.user_metadata || {};\n          if (metadata.is_blocked === true) {\n            alert(t("⚠️ Acesso interrompido: Esta conta foi bloqueada temporariamente!"));\n            await logout();\n            return;\n          }\n          window.isTrialActive = (metadata.is_trial === true);\n          if (metadata.subscription_end) {\n            const end = new Date(metadata.subscription_end);\n            const today = new Date();\n            today.setHours(0,0,0,0);\n            end.setHours(23,59,59,999);\n            if (end < today) {\n              const formattedEnd = new Date(metadata.subscription_end + \'T12:00:00\').toLocaleDateString(\'pt-BR\');\n              const isTrialUser = metadata.is_trial === true;\n              if (isTrialUser) {\n                alert(t("Olá! Seu período de testes de 5 dias do Spray Precision PRO terminou.\\n\\nPara continuar usando as ferramentas e gerando laudos ilimitados, entre em contato para ativar sua licença profissional!"));\n                const waMsg = encodeURIComponent("Olá! Meu período de testes de 5 dias expirou e gostaria de assinar a versão completa do Spray Precision PRO.");\n                window.open(`https://wa.me/5565999106415?text=${waMsg}`, \'_blank\');\n              } else {\n                alert(t("⚠️ Acesso interrompido: Seu período de assinatura expirou em ") + formattedEnd + "!");\n              }\n              await logout();\n              return;\n            }\n          }\n          if (window.isTrialActive && metadata.subscription_end) {\n            const banner = document.getElementById(\'trial-banner\');\n            if (banner) {\n              const end = new Date(metadata.subscription_end + \'T12:00:00\');\n              const formattedEnd = end.toLocaleDateString(\'pt-BR\');\n              banner.innerHTML = `🧪 <strong>Modo de Teste (Demo):</strong> Seus 5 dias de acesso terminam em ${formattedEnd}. A geração de PDFs está desativada.`;\n              banner.style.display = \'flex\';\n            }\n          }'
    ),
    # 2e. Append helper function and premium modal
    (
        '    // Run lang initialization\n    window.addEventListener(\'DOMContentLoaded\', () => {\n      initLanguage();\n      populateSelects();\n    });\n  </script>',
        '    function showTrialPremiumModal() {\n      const modal = document.getElementById(\'trial-premium-modal\');\n      if (modal) {\n        document.getElementById(\'trial-modal-text\').innerText = "A geração de laudos técnicos detalhados e orçamentos em PDF é exclusiva para a versão profissional. Libere o acesso ilimitado para gerar relatórios com a sua marca e fechar mais vendas de bicos!";\n        const waMsg = encodeURIComponent("Olá! Gostaria de assinar a versão profissional do Spray Precision PRO para liberar a geração de laudos técnicos em PDF.");\n        document.getElementById(\'trial-modal-whatsapp\').href = `https://wa.me/5565999106415?text=${waMsg}`;\n        modal.style.display = \'flex\';\n      }\n    }\n\n    // Run lang initialization\n    window.addEventListener(\'DOMContentLoaded\', () => {\n      initLanguage();\n      populateSelects();\n    });\n  </script>\n\n  <!-- MODAL PREMIUM PARA CONTAS TRIAL -->\n  <div id="trial-premium-modal" class="modal-overlay" style="display:none;" onclick="if(event.target === this) this.style.display=\'none\'">\n    <div class="modal-content" style="background: rgba(15, 20, 24, 0.95); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 28px; padding: 40px 30px; text-align: center; max-width: 480px; box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(249, 115, 22, 0.15); margin: auto; position: relative;">\n      <button class="modal-close" onclick="document.getElementById(\'trial-premium-modal\').style.display=\'none\'">&times;</button>\n      <div style="width: 70px; height: 70px; background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.25); color: #f97316; border-radius: 20px; font-size: 2.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto; box-shadow: 0 8px 25px rgba(249, 115, 22, 0.2);">🔒</div>\n      <h3 style="font-family: \'Outfit\', sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #ffffff 40%, #fed7aa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: none; border: none; padding: 0; box-shadow: none; width: auto; height: auto;">Recurso Premium</h3>\n      <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 30px;" id="trial-modal-text">\n        A geração de laudos técnicos detalhados e orçamentos em PDF é exclusiva para a versão profissional.\n      </p>\n      <a id="trial-modal-whatsapp" href="#" target="_blank" class="btn" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); border: none; color: #ffffff; padding: 16px 32px; border-radius: 14px; font-size: 1rem; font-weight: 700; width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);">\n        💬 Liberar Acesso Profissional\n      </a>\n    </div>\n  </div>'
    )
]
update_file(enterprise_path, enterprise_reps)

# ==================== 3. Update diagnostico-vazao-manual/index.html ====================
diag_html_path = r"C:\Users\Eduardo\Documents\GitHub\bico_saas\diagnostico-vazao-manual\index.html"
diag_html_reps = [
    # 3a. Inject trial banner
    (
        '  <div class="app-container" style="display: none;">\n    \n    <!-- APP HEADER -->',
        '  <div class="app-container" style="display: none;">\n    <div id="trial-banner" style="display:none; width: 100%; max-width: 1200px; padding: 12px 20px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.25); border-radius: 12px; margin-top: 16px; margin-bottom: 8px; color: #fbbf24; font-weight: bold; text-align: center; gap: 8px; align-items: center; justify-content: center; font-size: 14px; font-family: \'Inter\', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"></div>\n    \n    <!-- APP HEADER -->'
    ),
    # 3b. Inject trial premium modal
    (
        '</body>\n</html>',
        '  <!-- MODAL PREMIUM PARA CONTAS TRIAL -->\n  <div id="trial-premium-modal" class="modal-overlay" style="display:none;" onclick="if(event.target === this) this.style.display=\'none\'">\n    <div class="modal-content" style="background: rgba(15, 20, 24, 0.95); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 28px; padding: 40px 30px; text-align: center; max-width: 480px; box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(249, 115, 22, 0.15); margin: auto; position: relative;">\n      <button class="modal-close" onclick="document.getElementById(\'trial-premium-modal\').style.display=\'none\'">&times;</button>\n      <div style="width: 70px; height: 70px; background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.25); color: #f97316; border-radius: 20px; font-size: 2.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto; box-shadow: 0 8px 25px rgba(249, 115, 22, 0.2);">🔒</div>\n      <h3 style="font-family: \'Outfit\', sans-serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; background: linear-gradient(135deg, #ffffff 40%, #fed7aa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: none; border: none; padding: 0; box-shadow: none; width: auto; height: auto;">Recurso Premium</h3>\n      <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 30px;" id="trial-modal-text">\n        A geração de laudos técnicos detalhados e orçamentos em PDF é exclusiva para a versão profissional.\n      </p>\n      <a id="trial-modal-whatsapp" href="#" target="_blank" class="btn" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); border: none; color: #ffffff; padding: 16px 32px; border-radius: 14px; font-size: 1rem; font-weight: 700; width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);">\n        💬 Liberar Acesso Profissional\n      </a>\n    </div>\n  </div>\n\n</body>\n</html>'
    )
]
update_file(diag_html_path, diag_html_reps)

# ==================== 4. Update diagnostico-vazao-manual/app.js ====================
diag_js_path = r"C:\Users\Eduardo\Documents\GitHub\bico_saas\diagnostico-vazao-manual\app.js"
diag_js_reps = [
    # 4a. Intercept btn-print click
    (
        "  document.getElementById('btn-print').addEventListener('click', () => {\n      logTelemetry('print_report', {",
        "  document.getElementById('btn-print').addEventListener('click', () => {\n      if (window.isTrialActive) {\n        showTrialPremiumModal();\n        return;\n      }\n      logTelemetry('print_report', {"
    ),
    # 4b. Intercept CSV export function
    (
        "// Exportador CSV\nfunction exportToCSV() {",
        "// Exportador CSV\nfunction exportToCSV() {\n  if (window.isTrialActive) {\n    showTrialPremiumModal();\n    return;\n  }"
    ),
    # 4c. Update checkSessionIntegrity
    (
        "      if (metadata.subscription_end) {\n        const end = new Date(metadata.subscription_end);\n        const today = new Date();\n        today.setHours(0,0,0,0);\n        end.setHours(23,59,59,999);\n        if (end < today) {\n          const formattedEnd = new Date(metadata.subscription_end + 'T12:00:00').toLocaleDateString('pt-BR');\n          alert(t(\"⚠️ Acesso interrompido: Seu período de assinatura expirou em \") + formattedEnd + \"!\");\n          await forceUserLogout();\n          return;\n        }\n      }",
        "      window.isTrialActive = (metadata.is_trial === true);\n      if (metadata.subscription_end) {\n        const end = new Date(metadata.subscription_end);\n        const today = new Date();\n        today.setHours(0,0,0,0);\n        end.setHours(23,59,59,999);\n        if (end < today) {\n          const formattedEnd = new Date(metadata.subscription_end + 'T12:00:00').toLocaleDateString('pt-BR');\n          const isTrialUser = metadata.is_trial === true;\n          if (isTrialUser) {\n            alert(t(\"Olá! Seu período de testes de 5 dias do Spray Precision PRO terminou.\\n\\nPara continuar usando as ferramentas e gerando laudos ilimitados, entre em contato para ativar sua licença profissional!\"));\n            const waMsg = encodeURIComponent(\"Olá! Meu período de testes de 5 dias expirou e gostaria de assinar a versão completa do Spray Precision PRO.\");\n            window.open(`https://wa.me/5565999106415?text=${waMsg}`, \'_blank\');\n          } else {\n            alert(t(\"⚠️ Acesso interrompido: Seu período de assinatura expirou em \") + formattedEnd + \"!\");\n          }\n          await forceUserLogout();\n          return;\n        }\n      }\n      if (window.isTrialActive && metadata.subscription_end) {\n        const banner = document.getElementById(\'trial-banner\');\n        if (banner) {\n          const end = new Date(metadata.subscription_end + \'T12:00:00\');\n          const formattedEnd = end.toLocaleDateString(\'pt-BR\');\n          banner.innerHTML = `🧪 <strong>Modo de Teste (Demo):</strong> Seus 5 dias de acesso terminam em ${formattedEnd}. A geração de PDFs e exportação de CSV estão desativadas.`;\n          banner.style.display = \'flex\';\n        }\n      }"
    ),
    # 4d. Update handleUserLoggedIn
    (
        "  if (metadata.subscription_end) {\n    const end = new Date(metadata.subscription_end);\n    const today = new Date();\n    today.setHours(0,0,0,0);\n    end.setHours(23,59,59,999);\n    if (end < today) {\n      const formattedEnd = new Date(metadata.subscription_end + 'T12:00:00').toLocaleDateString('pt-BR');\n      alert(t(\"⚠️ Acesso interrompido: Seu período de assinatura expirou em \") + formattedEnd + \"!\");\n      await forceUserLogout();\n      return;\n    }\n  }",
        "  window.isTrialActive = (metadata.is_trial === true);\n  if (metadata.subscription_end) {\n    const end = new Date(metadata.subscription_end);\n    const today = new Date();\n    today.setHours(0,0,0,0);\n    end.setHours(23,59,59,999);\n    if (end < today) {\n      const formattedEnd = new Date(metadata.subscription_end + 'T12:00:00').toLocaleDateString('pt-BR');\n      const isTrialUser = metadata.is_trial === true;\n      if (isTrialUser) {\n        alert(t(\"Olá! Seu período de testes de 5 dias do Spray Precision PRO terminou.\\n\\nPara continuar usando as ferramentas e gerando laudos ilimitados, entre em contato para ativar sua licença profissional!\"));\n        const waMsg = encodeURIComponent(\"Olá! Meu período de testes de 5 dias expirou e gostaria de assinar a versão completa do Spray Precision PRO.\");\n        window.open(`https://wa.me/5565999106415?text=${waMsg}`, \'_blank\');\n      } else {\n        alert(t(\"⚠️ Acesso interrompido: Seu período de assinatura expirou em \") + formattedEnd + \"!\");\n      }\n      await forceUserLogout();\n      return;\n    }\n  }\n  if (window.isTrialActive && metadata.subscription_end) {\n    const banner = document.getElementById(\'trial-banner\');\n    if (banner) {\n      const end = new Date(metadata.subscription_end + \'T12:00:00\');\n      const formattedEnd = end.toLocaleDateString(\'pt-BR\');\n      banner.innerHTML = `🧪 <strong>Modo de Teste (Demo):</strong> Seus 5 dias de acesso terminam em ${formattedEnd}. A geração de PDFs e exportação de CSV estão desativadas.`;\n      banner.style.display = \'flex\';\n    }\n  }"
    )
]
update_file(diag_js_path, diag_js_reps)

# Add showTrialPremiumModal helper to the end of app.js
print("Adding showTrialPremiumModal helper to app.js...")
with open(diag_js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

helper_code = """
// Helper function to display the premium trial warning modal in flow diagnostics
function showTrialPremiumModal() {
  const modal = document.getElementById('trial-premium-modal');
  if (modal) {
    document.getElementById('trial-modal-text').innerText = "A geração de laudos técnicos detalhados e orçamentos em PDF é exclusiva para a versão profissional. Libere o acesso ilimitado para gerar relatórios com a sua marca e fechar mais vendas de bicos!";
    const waMsg = encodeURIComponent("Olá! Gostaria de assinar a versão profissional do Spray Precision PRO para liberar a geração de laudos técnicos em PDF.");
    document.getElementById('trial-modal-whatsapp').href = `https://wa.me/5565999106415?text=${waMsg}`;
    modal.style.display = 'flex';
  }
}
"""

if "function showTrialPremiumModal" not in js_content:
    with open(diag_js_path, "w", encoding="utf-8") as f:
        f.write(js_content + helper_code)
    print("  Successfully appended showTrialPremiumModal helper to app.js!")
else:
    print("  showTrialPremiumModal helper already exists in app.js!")
