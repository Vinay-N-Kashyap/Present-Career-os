import re

def check_file(filename):
    print("=== " + filename + " ===")
    with open('src/lib/data/' + filename, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # find all lesson objects
    # Let's search for occurrences of day: \d+
    for m in re.finditer(r'(?:^|\n)\s*["\']?day["\']?\s*:\s*(\d+)', text):
        val = int(m.group(1))
        if val > 30 or val == 0:
            start = max(0, m.start() - 100)
            end = min(len(text), m.end() + 200)
            print(f"Match day={val} at offset {m.start()}:")
            print(text[start:end])
            print("-" * 50)

check_file('bcomDmktLongLessons.ts')
check_file('bcomEcomLongLessons.ts')
