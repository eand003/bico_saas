with open(r"C:\Users\Eduardo\Documents\GitHub\bico_saas\diagnostico-vazao-manual\app.js", "r", encoding="utf-8") as f:
    content = f.read()

count = content.count("isTrialActive")
print(f"Total isTrialActive count: {count}")
