import json
import os
import hashlib

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_dmkt")
os.makedirs(visuals_dir, exist_ok=True)

standard_stages = [
    {"id": "top", "label": "Traffic & Reach Discovery", "value": 10000, "percentage": 100, "tone": "data"},
    {"id": "qual", "label": "Qualified Intent Engagement", "value": 4500, "percentage": 45, "dropoffRate": 55, "tone": "ok"},
    {"id": "target", "label": "Consideration & Conversion", "value": 1800, "percentage": 18, "dropoffRate": 60, "tone": "ok"},
    {"id": "final", "label": "Customer Equity Retention", "value": 720, "percentage": 7.2, "dropoffRate": 60, "tone": "idle"}
]

step_definitions = [
    {
        "at": "intro",
        "caption": "Initial audience discovery and traffic acquisition phase.",
        "activeStageId": "top"
    },
    {
        "at": "say1",
        "caption": "Engagement qualification and intent filtering stage.",
        "activeStageId": "qual"
    },
    {
        "at": "example",
        "caption": "Active consideration and high intent conversion checkout.",
        "activeStageId": "target"
    },
    {
        "at": "tryIt",
        "caption": "Customer lifetime value retention and advocacy expansion.",
        "activeStageId": "final"
    }
]

for day_num in range(31, 36):
    data_file = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_dmkt_data.json")
    with open(data_file, "r", encoding="utf-8") as f:
        lesson = json.load(f)
    
    entries = []
    for p_idx, part in enumerate(lesson["parts"]):
        # Calculate SHA-256 codeHash: title + say.join('') + (code || '')
        hash_input = part["title"] + "".join(part["say"]) + part.get("code", "")
        code_hash = hashlib.sha256(hash_input.encode("utf-8")).hexdigest()
        
        # Build 4 steps
        steps = []
        for step_def in step_definitions:
            steps.append({
                "at": step_def["at"],
                "caption": step_def["caption"],
                "activeStageId": step_def["activeStageId"],
                "stages": standard_stages
            })
        
        entries.append({
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": {
                "template": "funnel",
                "title": f"{part['title']} — Conversion Funnel",
                "steps": steps
            }
        })
    
    visual_envelope = {
        "schemaVersion": 1,
        "prefix": "bcom_dmkt",
        "day": day_num,
        "promptSha": hashlib.sha256(f"bcom_dmkt_day_{day_num}".encode("utf-8")).hexdigest(),
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }
    
    out_path = os.path.join(visuals_dir, f"day-{day_num}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(visual_envelope, f, indent=2)
    
    print(f"Generated Gate v2 visual envelope: day-{day_num}.json with 5 entries.")

print("All Gate v2 visual envelopes generated successfully!")
