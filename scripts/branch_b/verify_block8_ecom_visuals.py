import json
import hashlib
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")

for day_num in range(36, 41):
    data_file = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    with open(data_file, "r", encoding="utf-8") as f:
        day_data = json.load(f)

    vis_file = os.path.join(visuals_dir, f"day-{day_num}.json")
    assert os.path.exists(vis_file), f"Visual file {vis_file} missing"

    with open(vis_file, "r", encoding="utf-8") as f:
        vis_data = json.load(f)

    assert vis_data["schemaVersion"] == 1, f"Day {day_num} schemaVersion != 1"
    assert vis_data["prefix"] == "bcom_ecom", f"Day {day_num} prefix != bcom_ecom"
    assert vis_data["day"] == day_num, f"Day {day_num} day mismatch"

    entries = vis_data["entries"]
    assert len(entries) == 5, f"Day {day_num} entries != 5"

    for idx, (part, entry) in enumerate(zip(day_data["parts"], entries)):
        assert part["title"] == entry["partTitle"], f"Day {day_num} Part {idx+1} title mismatch"
        
        # Verify SHA-256 codeHash
        raw_input = part["title"] + "".join(part["say"]) + part.get("code", "")
        expected_hash = hashlib.sha256(raw_input.encode("utf-8")).hexdigest()
        assert entry["codeHash"] == expected_hash, f"Day {day_num} Part {idx+1} hash mismatch: {entry['codeHash']} != {expected_hash}"

        # Verify steps and captions
        steps = entry["spec"]["steps"]
        assert len(steps) == 4, f"Day {day_num} Part {idx+1} steps != 4"
        for s in steps:
            cap = s["caption"]
            assert not re.search(r"\d", cap), f"Day {day_num} Part {idx+1} caption has digit: '{cap}'"
            assert cap.endswith("."), f"Day {day_num} Part {idx+1} caption missing dot: '{cap}'"
            assert len(cap) <= 75, f"Day {day_num} Part {idx+1} caption > 75: '{cap}'"

    print(f"Day {day_num} Visuals VERIFIED: 5 entries, 100% hash and caption compliant.")

print("=" * 60)
print("ALL BLOCK 8 (DAYS 36-40) VISUAL ENVELOPES 100% VERIFIED!")
print("=" * 60)
