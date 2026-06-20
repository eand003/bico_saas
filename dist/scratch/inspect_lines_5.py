with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\index.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for idx in range(549, 681):
    if idx < len(lines):
        safe_line = lines[idx].encode('ascii', errors='replace').decode('ascii')
        print(f"{idx+1}: {safe_line}")
