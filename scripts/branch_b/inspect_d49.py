import json

with open(r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\day49_ecom_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

words = []
for p_idx, part in enumerate(d["parts"]):
    text = " ".join(part["say"]) if isinstance(part["say"], list) else part["say"]
    wc = len(text.strip().split())
    words.append(wc)
    chk = part["check"]
    ans = chk.get("answer", chk.get("answerIndex", -1))
    print(f"Part {p_idx+1}: {wc} words, answer: {ans}, options: {len(chk['options'])}")

print(f"Total words: {sum(words)}, minutes: {d.get('minutes')}")
