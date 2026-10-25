import glob
import os
import re

base = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data'
for f in sorted(glob.glob(os.path.join(base, 'bcom*LongLessons.ts'))):
    fname = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fp:
        t = fp.read()
    
    # find export const BCOM_... = [
    # Let's see how many items are in the array
    # Look for objects having day: \d+ at indentation or top level of array
    lesson_days = []
    # match day: <num> where it is followed by title: or preceded by coursePrefix:
    pattern = r'{\s*(?:coursePrefix:\s*[\'"][^\'"]+[\'"]\s*,\s*)?day:\s*(\d+)\s*,\s*title:'
    matches = re.findall(pattern, t)
    if not matches:
        # try without coursePrefix
        pattern2 = r'day:\s*(\d+)\s*,\s*coursePrefix:'
        matches = re.findall(pattern2, t)
    if not matches:
        pattern3 = r'["\']day["\']:\s*(\d+)'
        matches = re.findall(pattern3, t)
    
    # Let's count how many {.*coursePrefix:.*title: occur
    all_lessons = re.findall(r'title:\s*[\'"]', t)
    
    print(f"{fname:30} | Pattern matches: {len(matches):2d} | title count: {len(all_lessons):2d}")
    if matches:
        m_ints = [int(x) for x in matches if 1 <= int(x) <= 60]
        print(f"   -> Days: {sorted(list(set(m_ints)))}")
