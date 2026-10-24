import sys
import os

sys.path.append(os.path.abspath('scripts/branch_a'))

for day in [51, 52, 53, 54, 55]:
    mod_name = f"day{day}_content"
    try:
        mod = __import__(mod_name)
        day_dict = getattr(mod, f"DAY_{day}")
        print(f"=== Day {day}: {day_dict['title']} ===")
        tot = 0
        for i, p in enumerate(day_dict['parts']):
            say = " ".join(p['say']) if isinstance(p['say'], list) else p['say']
            words = len(say.split())
            tot += words
            status = "OK" if words >= 600 else "FAIL (<600)"
            print(f"  Part {i+1} ({p['title'][:35]}...): {words} words [{status}]")
        print(f"  Total Day {day}: {tot} words\n")
    except Exception as e:
        print(f"Error loading {mod_name}: {e}")
