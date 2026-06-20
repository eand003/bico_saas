with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\diagnostico-vazao-manual\index.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for idx in range(130, 160):
    if idx < len(lines):
        safe_line = lines[idx].encode('ascii', errors='replace').decode('ascii')
        print(f"{idx+1}: {safe_line}")
