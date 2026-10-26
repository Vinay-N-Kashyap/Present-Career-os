import sys, re

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'(?:{\s*|\n\s*)"?day"?\s*:\s*(\d+)', text)
# find which day objects contain "Buy Box"
day_chunks = re.split(r'(?:{\s*|\n\s*)"?day"?\s*:\s*\d+', text)
print(f"Number of chunks: {len(day_chunks)}")
for i, d in enumerate(days):
    if i+1 < len(day_chunks):
        if 'Buy Box' in day_chunks[i+1]:
            print(f"Day {d} contains 'Buy Box'")
