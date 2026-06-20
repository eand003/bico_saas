with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\index.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for idx, line in enumerate(lines):
    if any(k in line for k in ["subscription_end", "is_blocked", "blocked", "venc", "expir", "login", "auth"]):
        safe_line = line.encode('ascii', errors='replace').decode('ascii')
        print(f"Line {idx+1}: {safe_line}")
