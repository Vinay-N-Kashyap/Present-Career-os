import os

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'
files = [
    'src/lib/data/bcomDigitalMarketingKnowledgeGraph.ts',
    'src/lib/data/bcomDigitalMarketing30DayData.ts',
    'src/lib/data/bcomDigitalMarketingPilotDays.ts'
]

for rel in files:
    full = os.path.join(commerce_dir, rel)
    if os.path.exists(full):
        with open(full, 'r', encoding='utf-8') as f:
            content = f.read()
        print(f"=== {rel} ({len(content)} chars) ===")
        print(content[:500])
        print("...")
        print(content[-300:])
    else:
        print(f"=== {rel} NOT FOUND ===")
