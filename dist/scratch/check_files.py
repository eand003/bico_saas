import os

keywords = ["subscription_end", "is_blocked", "blocked", "venc", "expir", "login", "auth"]
root = r"C:\Users\Eduardo\Documents\GitHub\bico_saas"

for dirpath, dirnames, filenames in os.walk(root):
    if "node_modules" in dirpath or ".git" in dirpath or "dist" in dirpath:
        continue
    for f in filenames:
        if f.endswith(".html") or f.endswith(".js"):
            path = os.path.join(dirpath, f)
            try:
                with open(path, "r", encoding="utf-8") as file:
                    content = file.read()
                found = [k for k in keywords if k in content]
                if found:
                    rel = os.path.relpath(path, root)
                    print(f"File: {rel} | Matches: {found}")
            except Exception as e:
                pass
