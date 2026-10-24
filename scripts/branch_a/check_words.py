import sys, os
sys.path.insert(0, os.path.abspath('.'))

def check_day(mod_name):
    mod = __import__(f"scripts.branch_a.{mod_name}", fromlist=[mod_name.upper()])
    day_var = [k for k in dir(mod) if k.startswith('DAY_')][0]
    day_data = getattr(mod, day_var)
    print("="*70)
    print(f"DAY {day_data['day']}: {day_data['title']}")
    print("="*70)
    total_words = 0
    all_pass = True
    for p in day_data['parts']:
        words = sum(len(para.split()) for para in p['say'])
        total_words += words
        status = "PASS" if words >= 600 else f"FAIL ({words}<600)"
        if words < 600: all_pass = False
        print(f"Part {p['part']}: {words:>4} words | {len(p['say']):>2} paras | {status} | {p['title'][:40]}")
    print(f"TOTAL WORDS: {total_words} | {'ALL PARTS >= 600 WORDS' if all_pass else 'SOME PARTS FAILED'}")
    return all_pass, total_words

if __name__ == '__main__':
    for arg in sys.argv[1:]:
        check_day(arg)
