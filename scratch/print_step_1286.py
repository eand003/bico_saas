with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\admin_super.html", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split('\n')

def get_raw_range(start, end):
    result = []
    for idx in range(start-1, min(end, len(lines))):
        result.append(f"{idx+1}: {lines[idx]}")
    return "\n".join(result)

# Write to file to check without print conversion errors
with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\scratch\step_1286_content.txt", "w", encoding="utf-8") as f_out:
    f_out.write("=== createUserModal fields ===\n")
    f_out.write(get_raw_range(1284, 1300))
    f_out.write("\n\n=== accessModal fields ===\n")
    f_out.write(get_raw_range(1350, 1366))
    f_out.write("\n\n=== openAccessModal ===\n")
    f_out.write(get_raw_range(1640, 1653))
    f_out.write("\n\n=== renderUsersTable status ===\n")
    f_out.write(get_raw_range(2055, 2085))
    f_out.write("\n\n=== createUser ===\n")
    f_out.write(get_raw_range(2310, 2337))
    f_out.write("\n\n=== saveAccessControl ===\n")
    f_out.write(get_raw_range(2450, 2470))

print("Dumped raw contents to step_1286_content.txt")
