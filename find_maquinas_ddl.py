import json

log_path = r"C:\Users\Eduardo\.gemini\antigravity\brain\0a6580cf-2171-470f-9caf-7257ecee404d\.system_generated\logs\transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            d = json.loads(line)
            step = d.get('step_index')
            if step is not None and step < 3400:
                content = d.get("content", "")
                tool_calls = d.get("tool_calls", [])
                for tc in tool_calls:
                    args = tc.get("args", {})
                    if "CodeContent" in args and "CREATE TABLE" in args["CodeContent"] and "maquinas" in args["CodeContent"]:
                        print(f"=== Step {step} ===")
                        print(args["CodeContent"])
                        print("---")
        except Exception as e:
            pass
