import json, hashlib

with open('scripts/branch_b/day59_dmkt_data.json', 'r', encoding='utf-8') as f:
    json_d59 = json.load(f)

json_p5 = json_d59['parts'][4]
raw_json = json_p5['title'] + ''.join(json_p5['say']) + json_p5.get('code', '')
hash_json = hashlib.sha256(raw_json.encode('utf-8')).hexdigest()
print("Hash calculated from day59_dmkt_data.json:", hash_json)

# Now extract Day 59 Part 5 from bcomDmktLongLessons.ts
with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find Day 59 in text
d59_pos = text.find('"day": 59')
d59_start = text.rfind('{', 0, d59_pos)
d60_pos = text.find('"day": 60')
d60_start = text.rfind('{', 0, d60_pos)
d59_full = text[d59_start:d60_start].rstrip()
if d59_full.endswith(','):
    d59_full = d59_full[:-1].rstrip()

d59_parsed = json.loads(d59_full)
ts_p5 = d59_parsed['parts'][4]
raw_ts = ts_p5['title'] + ''.join(ts_p5['say']) + ts_p5.get('code', '')
hash_ts = hashlib.sha256(raw_ts.encode('utf-8')).hexdigest()
print("Hash calculated from bcomDmktLongLessons.ts:", hash_ts)

print("Difference in raw strings:")
if raw_json != raw_ts:
    print(f"Length raw_json={len(raw_json)}, length raw_ts={len(raw_ts)}")
    for i in range(min(len(raw_json), len(raw_ts))):
        if raw_json[i] != raw_ts[i]:
            print(f"Diff at index {i}:")
            print(f"json: {repr(raw_json[i:i+50])}")
            print(f"ts:   {repr(raw_ts[i:i+50])}")
            break
else:
    print("They are identical!")
