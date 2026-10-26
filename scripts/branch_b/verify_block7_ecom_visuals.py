# -*- coding: utf-8 -*-
"""
Verify visual envelopes for bcom_ecom Days 31-35
"""
import json
import hashlib
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

all_good = True
for day_num in range(31, 36):
    data_path = f"scripts/branch_b/day{day_num}_ecom_data.json"
    vis_path = f"src/lib/data/lessonVisuals/bcom_ecom/day-{day_num}.json"
    
    with open(data_path, "r", encoding="utf-8") as df:
        ddata = json.load(df)
    with open(vis_path, "r", encoding="utf-8") as vf:
        vdata = json.load(vf)
        
    assert vdata["schemaVersion"] == 1, f"Day {day_num} schemaVersion != 1"
    assert vdata["prefix"] == "bcom_ecom", f"Day {day_num} prefix != bcom_ecom"
    assert vdata["day"] == day_num, f"Day {day_num} day mismatch"
    assert len(vdata["entries"]) == 5, f"Day {day_num} entries length != 5"
    
    for p_idx, part in enumerate(ddata["parts"]):
        ventry = vdata["entries"][p_idx]
        assert ventry["partTitle"] == part["title"], f"Day {day_num} part {p_idx+1} title mismatch"
        
        # Calculate expected hash
        say_text = "".join(part["say"]) if isinstance(part["say"], list) else str(part["say"])
        part_content = part["title"] + say_text + (part.get("code", "") or "")
        calc_hash = hashlib.sha256(part_content.encode("utf-8")).hexdigest()
        
        if ventry["codeHash"] != calc_hash:
            print(f"FAILED HASH: Day {day_num} Part {p_idx+1}: expected {calc_hash}, got {ventry['codeHash']}")
            all_good = False
            
        # Verify captions
        steps = ventry["spec"]["steps"]
        assert len(steps) == 4, f"Day {day_num} Part {p_idx+1} steps length != 4"
        for step in steps:
            cap = step["caption"]
            if re.search(r"\d", cap):
                print(f"FAILED CAPTION (contains digit): Day {day_num} Part {p_idx+1}: {cap}")
                all_good = False
            if not cap.endswith("."):
                print(f"FAILED CAPTION (no period): Day {day_num} Part {p_idx+1}: {cap}")
                all_good = False
            if len(cap) > 75:
                print(f"FAILED CAPTION (length > 75): Day {day_num} Part {p_idx+1} ({len(cap)}): {cap}")
                all_good = False

if all_good:
    print("ALL 5 Visual Envelopes for Days 31-35 100% VERIFIED: Schema, Hashes, Captions, Stages!")
else:
    print("ERRORS DETECTED in visual envelopes!")
    sys.exit(1)
