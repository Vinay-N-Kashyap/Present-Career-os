import json
import hashlib
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
scripts_dir = os.path.join(commerce_dir, "scripts", "branch_b")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_dmkt")

for d in range(46, 51):
    day_file = os.path.join(scripts_dir, f"day{d}_dmkt_data.json")
    with open(day_file, "r", encoding="utf-8") as f:
        day_data = json.load(f)
        
    vis_file = os.path.join(visuals_dir, f"day-{d}.json")
    with open(vis_file, "r", encoding="utf-8") as f:
        vis_data = json.load(f)
        
    p0_code = day_data["parts"][0]["code"]
    p0_hash = hashlib.sha256(p0_code.encode("utf-8")).hexdigest()
    
    vis_entry_0_hash = vis_data["entries"][0]["codeHash"]
    assert p0_hash == vis_entry_0_hash, f"Day {d} code hash mismatch: {p0_hash} vs {vis_entry_0_hash}"
    print(f"Day {d}: Visual hash matches part 0 code hash ({p0_hash[:16]}...)")

print("ALL CODE HASHES IN VISUALS MATCH PART 0 CODE EXACTLY!")
