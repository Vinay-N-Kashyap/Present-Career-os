import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Let's check visual files for day-56 through day-60
import json

for d in range(56, 61):
    vis_path = f"src/lib/data/lessonVisuals/bcom_dmkt/day-{d}.json"
    print(f"Visual file day-{d}.json exists?", os.path.exists(vis_path))
