with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\admin_super.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for idx, line in enumerate(lines):
    if "Assinatura & Acesso status" in line:
        print(f"Found at line {idx+1}")
        for j in range(idx - 5, idx + 40):
            if j < len(lines):
                safe_line = lines[j].encode('ascii', errors='replace').decode('ascii')
                print(f"  {j+1}: {safe_line}")
        break
