with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\index.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
start = max(0, len(lines) - 60)
for idx in range(start, len(lines)):
    safe_line = lines[idx].encode('ascii', errors='replace').decode('ascii')
    print(f"{idx+1}: {safe_line}")
