import re

with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\admin_super.html", "r", encoding="utf-8") as f:
    content = f.read()

script_blocks = re.findall(r'<script.*?>([\s\S]*?)</script>', content)

output = []
output.append(f"Found {len(script_blocks)} script blocks")

for i, block in enumerate(script_blocks):
    if any(k in block for k in ["user_metadata", "signUp", "accessSubEnd", "subscription", "trial"]):
        output.append(f"\n=================== Block {i}: length {len(block)} ===================")
        lines = block.split('\n')
        for idx, line in enumerate(lines):
            if any(k in line for k in ["user_metadata", "signUp", "accessSubEnd", "subscription", "trial"]):
                start = max(0, idx - 6)
                end = min(len(lines), idx + 8)
                output.append(f"--- Line {idx} ---")
                output.append("\n".join(lines[start:end]))
                output.append("-" * 30)

with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\scratch\search_results.txt", "w", encoding="utf-8") as f_out:
    f_out.write("\n".join(output))

print("Results written to C:\\Users\\Eduardo\\Documents\\GitHub\\bico_saas\\scratch\\search_results.txt")
