import json
import hashlib
import re

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

with open('scripts/branch_b/day46_dmkt_data.json', 'r', encoding='utf-8') as f:
    d46_json = json.load(f)

# Extract Day 46 from bcomDmktLongLessons.ts
m = re.search(r'\{\s*"coursePrefix":\s*"bcom_dmkt",\s*"day":\s*46\b', text)
start = m.start()
m_next = re.search(r'\{\s*"coursePrefix":\s*"bcom_dmkt",\s*"day":\s*47\b', text[start+1:])
end = start + 1 + m_next.start()
d46_ts_str = text[start:end].strip().rstrip(',')
d46_ts = json.loads(d46_ts_str)

code_json = d46_json["parts"][0]["code"]
code_ts = d46_ts["parts"][0]["code"]

hash_json = hashlib.sha256(code_json.encode('utf-8')).hexdigest()
hash_ts = hashlib.sha256(code_ts.encode('utf-8')).hexdigest()

print(f"Code JSON length: {len(code_json)}, hash: {hash_json}")
print(f"Code TS length: {len(code_ts)}, hash: {hash_ts}")
print(f"Visual binding in TS: {d46_ts.get('visualBinding')}")
