"""
append_block10_to_lessons.py
Appends Days 46 to 50 of bcom_tax to src/lib/data/bcomTaxLongLessons.ts.
"""

import json
import sys
import os

sys.path.append('scripts/branch_b')
import create_day46_tax
import create_day47_tax
import create_day48_tax
import create_day49_tax
import create_day50_tax

def clean_day(d):
    # Ensure no part has 'id'
    for p in d['parts']:
        if 'id' in p:
            del p['id']
    return d

def append_block10():
    days = [
        clean_day(create_day46_tax.get_day46_data()),
        clean_day(create_day47_tax.get_day47_data()),
        clean_day(create_day48_tax.get_day48_data()),
        clean_day(create_day49_tax.get_day49_data()),
        clean_day(create_day50_tax.get_day50_data())
    ]
    
    target_file = os.path.join("src", "lib", "data", "bcomTaxLongLessons.ts")
    with open(target_file, "r", encoding="utf-8") as f:
        content = f.read()
        
    last_bracket_idx = content.rfind("];")
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in bcomTaxLongLessons.ts")
        
    # Serialize days to formatted JSON string
    days_json_strings = []
    for day_data in days:
        json_str = json.dumps(day_data, indent=2, ensure_ascii=False)
        days_json_strings.append(json_str)
        
    combined_days_str = ",\n" + ",\n".join(days_json_strings) + "\n];\n"
    
    new_content = content[:last_bracket_idx] + combined_days_str
    
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print(f"Successfully appended Days 46-50 to {target_file}!")

if __name__ == "__main__":
    append_block10()
