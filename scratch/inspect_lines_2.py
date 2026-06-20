with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\index.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
print(f"Total lines in index.html: {len(lines)}")

# Let's search for divs, header, buttons or cards in index.html
for idx, line in enumerate(lines):
    if any(k in line.lower() for k in ["class=\"card\"", "id=\"card\"", "header", "menu", "modal", "nav", "preço", "preco"]):
        safe_line = line.encode('ascii', errors='replace').decode('ascii')
        print(f"Line {idx+1}: {safe_line[:120]}")
