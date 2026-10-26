for fname in ["scripts/branch_b/generate_day56.py", "scripts/branch_b/generate_day57.py"]:
    with open(fname, "r", encoding="utf-8") as f:
        text = f.read()

    old_s = 'timestamp = time.strftime("%Y-%m-%d %H:%M:%SZ", time.gmtime())'
    new_s = 'timestamp = "2026-10-26 02:40:00Z"'

    if old_s in text:
        text = text.replace(old_s, new_s)
        with open(fname, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Fixed non-deterministic timestamp in {fname}")
    else:
        print(f"Pattern not found in {fname}")
