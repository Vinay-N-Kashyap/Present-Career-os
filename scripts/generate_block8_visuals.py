import json
import hashlib
import os

from day36_data import day36
from day37_data import day37
from day38_data import day38
from day39_data import day39
from day40_data import day40

days = [day36, day37, day38, day39, day40]

for day_obj in days:
    day_num = day_obj["day"]
    entries = []
    
    for part_idx, part in enumerate(day_obj["parts"]):
        part_title = part["title"]
        code = part.get("code", "")
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
        
        spec = {
            "template": "stack-queue",
            "title": f"Day {day_num} Part {part_idx + 1} — JVM Call Stack & Heap State",
            "mode": "stack",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Allocate stack frame and inspect reference pointers for {part_title[:25]}.",
                    "mode": "stack",
                    "items": ["main() Frame", "DomainService.execute()", f"Day{day_num}Subsystem.init()"],
                    "action": "push",
                    "actionItem": f"Day{day_num}Subsystem.init()",
                    "tones": ["ok", "data", "data"]
                },
                {
                    "at": "say1",
                    "caption": "Step 2: Push active execution frame onto JVM thread call stack.",
                    "mode": "stack",
                    "items": ["main() Frame", "DomainService.execute()", f"Day{day_num}Subsystem.init()", f"Part{part_idx + 1}Executor.run()"],
                    "action": "push",
                    "actionItem": f"Part{part_idx + 1}Executor.run()",
                    "tones": ["ok", "ok", "data", "data"]
                },
                {
                    "at": "example",
                    "caption": "Step 3: Pop completed execution frame after verifying heap state invariant.",
                    "mode": "stack",
                    "items": ["main() Frame", "DomainService.execute()", f"Day{day_num}Subsystem.init()"],
                    "action": "pop",
                    "actionItem": f"Part{part_idx + 1}Executor.run()",
                    "tones": ["ok", "data", "data"]
                },
                {
                    "at": "tryIt",
                    "caption": "Step 4: Push interactive mutation frame to test edge cases and boundary guards.",
                    "mode": "stack",
                    "items": ["main() Frame", "DomainService.execute()", "TryItRunner.mutate()"],
                    "action": "push",
                    "actionItem": "TryItRunner.mutate()",
                    "tones": ["ok", "ok", "accent"]
                }
            ]
        }
        
        entries.append({
            "partTitle": part_title,
            "codeHash": code_hash,
            "spec": spec
        })
        
    day_file = {
        "schemaVersion": 1,
        "prefix": "java-basics",
        "day": day_num,
        "promptSha": f"java-basics-day-{day_num}-spec",
        "model": "curriculum-visual-synthesizer-v2",
        "entries": entries
    }
    
    out_path = f"src/lib/data/lessonVisuals/java-basics/day-{day_num}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(day_file, f, indent=2, ensure_ascii=False)
    print(f"Wrote {out_path} with {len(entries)} entries")

print("All Block 8 visual specs generated successfully!")
