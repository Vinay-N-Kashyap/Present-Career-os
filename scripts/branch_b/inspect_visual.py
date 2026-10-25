import json

file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\lessonVisuals\bcom_ecom\day-30.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Keys:', list(data.keys()))
if 'schemaVersion' in data:
    print('schemaVersion:', data['schemaVersion'])
if 'prefix' in data:
    print('prefix:', data['prefix'])
if 'entries' in data:
    print('entries count:', len(data['entries']))
    print('First entry keys:', list(data['entries'][0].keys()))
    print('First entry preview:', json.dumps(data['entries'][0], indent=2)[:500])
elif 'parts' in data:
    print('parts count:', len(data['parts']))
    print('First part preview:', json.dumps(data['parts'][0], indent=2)[:500])
