filepath = r"C:\Users\Eduardo\Documents\GitHub\bico_saas\index.html"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
replaced_count = 0
for idx, line in enumerate(lines):
    if "Novo por aqui? Solicite seu acesso" in line:
        if "es" in lines[idx-20:idx] or "es:" in "".join(lines[idx-20:idx]):
            lines[idx] = '        "Novo por aqui? Conheça nossos Planos e Preços ou solicite seu acesso pelo WhatsApp!": "¿Nuevo por aquí? ¡Conozca nuestros Planes y Precios o solicite su acesso por WhatsApp!",'
            replaced_count += 1
            print(f"Replaced ES translation at line {idx+1}")
        elif "en" in lines[idx-20:idx] or "en:" in "".join(lines[idx-20:idx]):
            lines[idx] = '        "Novo por aqui? Conheça nossos Planos e Preços ou solicite seu acesso pelo WhatsApp!": "New here? Check our Plans & Pricing or request your access via WhatsApp!",'
            replaced_count += 1
            print(f"Replaced EN translation at line {idx+1}")

if replaced_count > 0:
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Successfully updated {replaced_count} translation lines in index.html!")
else:
    print("No translation lines replaced.")
