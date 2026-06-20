with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\seletor-bico\index.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')

def print_range(start, end, title):
    print(f"=== {title} (Lines {start}-{end}) ===")
    for i in range(start-1, min(end, len(lines))):
        safe_line = lines[i].encode('ascii', errors='replace').decode('ascii')
        print(f"{i+1}: {safe_line}")
    print()

print_range(3580, 3640, "Report Start in Seletor")
print_range(3970, 3990, "Report End / Print Trigger")
