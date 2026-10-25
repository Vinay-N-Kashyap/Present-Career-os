import json
import os

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'

total_block_words = 0
total_parts = 0

for d_num in range(31, 36):
    data_file = os.path.join(commerce_dir, 'scripts', 'branch_b', f'day{d_num}_dmkt_data.json')
    with open(data_file, 'r', encoding='utf-8') as f:
        d = json.load(f)
    day_words = 0
    print(f"\n=======================================================")
    print(f"Day {d['day']}: {d['title']}")
    print(f"Goal: {d['goal'][:90]}...")
    print(f"Minutes: {d['minutes']}")
    print(f"=======================================================")
    for i, p in enumerate(d['parts']):
        text = ' '.join(p['say']) + ' ' + p.get('example', '')
        w = len(text.split())
        day_words += w
        total_block_words += w
        total_parts += 1
        has_code = 'def ' in p.get('code', '') or 'class ' in p.get('code', '')
        has_output = bool(p.get('output'))
        check = p.get('check', {})
        has_4_opts = len(check.get('options', [])) == 4
        ans_is_zero = check.get('answer') == 0 or check.get('answerIndex') == 0
        has_why = len(check.get('why', '')) >= 40
        
        status = "PASS" if (w >= 580 and has_code and has_output and has_4_opts and ans_is_zero and has_why) else "FAIL"
        print(f"  Part {i+1}: {w} words | Code: {has_code} | Out: {has_output} | Check: 4opts={has_4_opts}, ans0={ans_is_zero}, why={has_why} [{status}]")
    print(f"--- Day {d['day']} Total Words: {day_words} (Avg: {day_words/5:.1f} w/part) ---")

print(f"\n=======================================================")
print(f"BLOCK 7 MASTER TOTAL: {total_block_words} words across {total_parts} parts.")
print(f"BLOCK 7 AVERAGE: {total_block_words / 5:.1f} words/day | {total_block_words / total_parts:.1f} words/part.")
print(f"=======================================================")
