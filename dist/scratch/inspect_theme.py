with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\index.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for idx, line in enumerate(lines):
    if "</style>" in line:
        print(f"Found </style> at line {idx+1}")
        for j in range(idx - 10, idx + 2):
            if j < len(lines):
                safe_line = lines[j].encode('ascii', errors='replace').decode('ascii')
                print(f"  {j+1}: {safe_line}")
        break
