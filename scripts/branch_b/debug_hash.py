import json
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

# From json
with open('scripts/branch_b/day46_ecom_data.json', 'r', encoding='utf-8') as f:
    d_json = json.load(f)

p_json = d_json['parts'][0]
raw_json = p_json['title'] + "".join(p_json['say']) + p_json['code']
h_json = hashlib.sha256(raw_json.encode('utf-8')).hexdigest()

# From visual file
with open('src/lib/data/lessonVisuals/bcom_ecom/day-46.json', 'r', encoding='utf-8') as f:
    vis = json.load(f)
h_vis = vis['entries'][0]['codeHash']

print(f"h_json: {h_json}")
print(f"h_vis:  {h_vis}")
print(f"Match:  {h_json == h_vis}")

# From ts file
import re
with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    ts_text = f.read()

# Let's inspect the actual vs expected from test output
# In test: actual = vis.codeHash ('dac4ea7879e8b41b1123184c3ed69372ad98f726d06c3c96d00df6036cda1b41')
# expected = computed from lesson in ts ('c051ab4f8811f159e83977b19b6a3eeceb76a1803547917d40048a50e7b1686c')
