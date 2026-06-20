with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\admin_super.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')
for idx, line in enumerate(lines):
    if "createUser" in line or "accessModal" in line or 'id="newUser' in line or 'id="createUser' in line:
        safe_line = line.encode('ascii', errors='replace').decode('ascii')
        print(f"Line {idx+1}: {safe_line}")
