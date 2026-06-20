with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\diagnostico-vazao-manual\index.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for idx, line in enumerate(lines):
    if "header" in line.lower() or "id=\"mainApp\"" in line.lower() or "class=\"main-app\"" in line.lower():
        safe_line = line.encode('ascii', errors='replace').decode('ascii')
        print(f"{idx+1}: {safe_line.strip()}")
