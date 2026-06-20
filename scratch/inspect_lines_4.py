with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\admin_super.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')

# Let's search for "async function createUser" and print about 50 lines
start_line = None
for idx, line in enumerate(lines):
    if "async function createUser" in line:
        start_line = idx + 1
        break

if start_line:
    print(f"Found createUser at line {start_line}")
    for idx in range(start_line - 1, start_line + 60):
        if idx < len(lines):
            safe_line = lines[idx].encode('ascii', errors='replace').decode('ascii')
            print(f"{idx+1}: {safe_line}")
else:
    print("createUser not found")
