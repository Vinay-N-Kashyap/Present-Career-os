import json
import re

STOP_WORDS = {
    'this', 'that', 'with', 'from', 'have', 'more', 'some', 'such', 'than',
    'them', 'then', 'there', 'these', 'they', 'when', 'which', 'while', 'will',
    'also', 'into', 'only', 'other', 'what', 'where', 'about', 'after'
}

for day in [46, 47, 48, 49, 50]:
    v_path = f'src/lib/data/lessonVisuals/ai/day-{day}.json'
    l_path = f'scripts/branch_c/day{day}_lesson.json'
    v = json.load(open(v_path, encoding='utf-8'))
    l = json.load(open(l_path, encoding='utf-8'))
    print(f'=== Day {day} ===')
    day_fails = 0
    for p_idx, part in enumerate(l['parts']):
        entry = v['entries'][p_idx]
        for s_idx, step in enumerate(entry['spec']['steps']):
            at = step['at']
            cap = step['caption']
            if at == 'say1':
                target = part['say'][0]
            elif at == 'say2':
                target = part['say'][1]
            elif at == 'example':
                target = part['example']
            elif at == 'tryIt':
                target = part['tryIt']
            else:
                target = ''
            
            cap_words = set(w.lower() for w in re.findall(r'[a-zA-Z]{4,}', cap) if w.lower() not in STOP_WORDS)
            target_words = set(w.lower() for w in re.findall(r'[a-zA-Z]{4,}', target) if w.lower() not in STOP_WORDS)
            common = cap_words & target_words
            if not common:
                day_fails += 1
                print(f'FAIL Day {day} Part {p_idx+1} Step {s_idx+1} ({at}): cap: "{cap}" | target: "{target[:60]}..."')
    if day_fails == 0:
        print(f'Day {day}: ALL 20 CAPTIONS PASS R12!')
