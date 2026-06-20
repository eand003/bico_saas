with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\index.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for idx, line in enumerate(lines):
    if "Novo por aqui? Solicite seu acesso" in line:
        print(f"Line {idx+1}: {repr(line)}")
