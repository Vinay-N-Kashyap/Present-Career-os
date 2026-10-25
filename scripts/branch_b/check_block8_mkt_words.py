# -*- coding: utf-8 -*-
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

def check_day(mod_name, day_var):
    try:
        mod = __import__(mod_name, fromlist=[day_var])
        data = getattr(mod, day_var)
    except Exception as e:
        print(f"Error loading {mod_name}.{day_var}: {e}")
        return False
    
    day_num = data.get('day', '?')
    title = data.get('title', '')
    parts = data.get('parts', [])
    print(f"\n=== Day {day_num}: {title} ===")
    print(f"Total parts: {len(parts)} (Required: 5)")
    all_ok = True
    if len(parts) != 5:
        print(f"  ERROR: Expected exactly 5 parts, found {len(parts)}!")
        all_ok = False
        
    total_words = 0
    for idx, p in enumerate(parts):
        say = p.get('say', [])
        words = sum(len(s.split()) for s in say)
        total_words += words
        status = "OK" if words >= 600 else "FAIL (< 600)"
        if words < 600:
            all_ok = False
        print(f"  Part {idx+1}: {words} words [{status}] - '{p.get('title', '')}'")
        
        # Check assessment
        chk = p.get('check', {})
        if not chk:
            print(f"    ERROR: Missing check in part {idx+1}")
            all_ok = False
        else:
            opts = chk.get('options', [])
            ans = chk.get('answer', -1)
            ans_idx = chk.get('answerIndex', -1)
            why = chk.get('why', '')
            why_words = len(why.split())
            if len(opts) != 4 or ans != 0 or ans_idx != 0 or why_words < 20:
                print(f"    ERROR: Check invalid! opts={len(opts)}, ans={ans}, ans_idx={ans_idx}, why_words={why_words}")
                all_ok = False
                
    print(f"Total Day {day_num} Words: {total_words} (Avg: {total_words//len(parts) if parts else 0}/part)")
    return all_ok

if __name__ == '__main__':
    targets = [
        ('create_day36_mkt', 'day36_data'),
        ('create_day37_mkt', 'day37_data'),
        ('create_day38_mkt', 'day38_data'),
        ('create_day39_mkt', 'day39_data'),
        ('create_day40_mkt', 'day40_data'),
    ]
    for mod, var in targets:
        check_day(mod, var)
