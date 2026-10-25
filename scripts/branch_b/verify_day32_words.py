import json
import os

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'
data_file = os.path.join(commerce_dir, 'scripts', 'branch_b', 'day32_dmkt_data.json')

with open(data_file, 'r', encoding='utf-8') as f:
    d = json.load(f)

print(f"=== Day {d['day']}: {d['title']} ===")
total_words = 0
for i, part in enumerate(d['parts']):
    text_content = ' '.join(part['say']) + ' ' + part.get('example', '')
    words = len(text_content.split())
    total_words += words
    status = "PASS" if words >= 580 else "FAIL"
    print(f"  Part {i+1} ({part['title'][:40]}...): {words} words [{status}]")

print(f"Total Day {d['day']} Words: {total_words} (Avg: {total_words/5:.1f} w/part)")
