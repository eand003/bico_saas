with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\seletor-bico\index.html", "r", encoding="utf-8") as f:
    seletor_content = f.read()

with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\diagnostico-vazao-manual\app.js", "r", encoding="utf-8") as f:
    app_content = f.read()

# Let's search for "window.print" or "print" or "pdf" or "gerar" or "relatorio"
def search_in_text(text, filename):
    print(f"=== Search in {filename} ===")
    lines = text.split('\n')
    for idx, line in enumerate(lines):
        if any(k in line.lower() for k in ["print", "pdf", "laudo", "relator"]):
            safe_line = line.encode('ascii', errors='replace').decode('ascii')
            print(f"Line {idx+1}: {safe_line[:120]}")

search_in_text(seletor_content, "seletor-bico/index.html")
search_in_text(app_content, "diagnostico-vazao-manual/app.js")
