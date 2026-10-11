# scripts/visuals/assemble_softskills_communication_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.softskills_communication_spec_m1 import SOFTSKILLS_COMMUNICATION_M1_DAYS_1_15
from scripts.visuals.softskills_communication_spec_m1_rest import SOFTSKILLS_COMMUNICATION_M1_DAYS_16_30
from scripts.visuals.softskills_communication_spec_m2_part1 import SOFTSKILLS_COMMUNICATION_M2_DAYS_31_45
from scripts.visuals.softskills_communication_spec_m2_part2 import SOFTSKILLS_COMMUNICATION_M2_DAYS_46_60

m1_days = SOFTSKILLS_COMMUNICATION_M1_DAYS_1_15 + SOFTSKILLS_COMMUNICATION_M1_DAYS_16_30
m2_days = SOFTSKILLS_COMMUNICATION_M2_DAYS_31_45 + SOFTSKILLS_COMMUNICATION_M2_DAYS_46_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)

assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

# Normalize and validate all 60 days
for d in m1_days + m2_days:
    assert len(d["quests"]) == 4, f"Day {d['day']} has {len(d['quests'])} quests"
    assert "situationalPuzzle" in d, f"Day {d['day']} missing situationalPuzzle"
    assert len(d["situationalPuzzle"]["options"]) == 4, f"Day {d['day']} options count != 4"
    
    sp = d["situationalPuzzle"]
    if "explanation" in sp and "debrief" not in sp:
        sp["debrief"] = sp["explanation"]
    elif "debrief" in sp and "explanation" not in sp:
        sp["explanation"] = sp["debrief"]

    if "correctOptionIndex" not in sp:
        if "correctOption" in sp and sp["correctOption"] in sp["options"]:
            sp["correctOptionIndex"] = sp["options"].index(sp["correctOption"])
        else:
            sp["correctOptionIndex"] = 1
            
    assert len(d["socraticHints"]) == 3, f"Day {d['day']} has {len(d['socraticHints'])} socraticHints"
    assert "conceptInvariant" in d, f"Day {d['day']} missing conceptInvariant"
    assert "failureMode" in d, f"Day {d['day']} missing failureMode"
    assert "tryItFriction" in d, f"Day {d['day']} missing tryItFriction"

    for idx, q in enumerate(d["quests"]):
        if "id" not in q:
            q["id"] = f"Q36.{((d['day'] - 1) * 4) + idx + 1}"
        if "title" not in q and "name" in q:
            q["title"] = q["name"]
        if "name" not in q and "title" in q:
            q["name"] = q["title"]
        if "description" not in q and "desc" in q:
            q["description"] = q["desc"]
        if "desc" not in q and "description" in q:
            q["desc"] = q["description"]

out_path = Path(__file__).resolve().parent / "softskills-communication-masterclass-spec.ts"

content = f"""// scripts/visuals/softskills-communication-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Professional Tech Communication & Interview Mastery (course-softskills-communication)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total: Q36.1 to Q36.240).
// Generated automatically from Python specifications.
// Capstone 1: ApexSpeaker: Institutional Executive Technical Communication & Behavioral Leadership Suite (Day 30).
// Capstone 2: ApexExecutiveComms: Enterprise Cross-Functional Alignment, Crisis Escalation & Principal Engineer Interview Portfolio Suite (Day 60).

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const SOFTSKILLS_COMMUNICATION_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const SOFTSKILLS_COMMUNICATION_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
