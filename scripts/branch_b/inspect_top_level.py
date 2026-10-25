import re

def inspect_lessons(filename):
    print("=== " + filename + " ===")
    with open('src/lib/data/' + filename, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Each lesson object starts with coursePrefix or day
    # Let's find matches like: coursePrefix: 'bcom_...' ... day: \d+
    # or { day: \d+, title:
    matches = re.findall(r'\{\s*(?:(?:coursePrefix|day)\s*:\s*[\'"][^\'"]+[\'"]\s*,\s*)?(?:coursePrefix|day)\s*:\s*(\d+)', text)
    if not matches:
        matches = re.findall(r'day:\s*(\d+)\s*,', text)
    print("Lesson days found:", len(matches), [int(x) for x in matches if int(x) <= 60])

inspect_lessons('bcomMktLongLessons.ts')
inspect_lessons('bcomDmktLongLessons.ts')
inspect_lessons('bcomEcomLongLessons.ts')
inspect_lessons('bcomScrmLongLessons.ts')
inspect_lessons('bcomAnaLongLessons.ts')
