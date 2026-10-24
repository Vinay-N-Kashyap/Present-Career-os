import sys
import importlib

def check_day(module_name, func_name):
    sys.path.append('scripts/branch_b')
    mod = importlib.import_module(module_name)
    func = getattr(mod, func_name)
    data = func()
    print(f"=== {module_name} ({data['title']}) ===")
    print(f"Total parts: {len(data['parts'])}")
    total_words = 0
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        total_words += words
        print(f"  Part {i+1} ('{p['title']}'): {words} words | has_id: {'id' in p}")
        if words < 600:
            print(f"    WARNING: Part {i+1} has {words} words (< 600)!")
    print(f"Total words: {total_words}\n")

if __name__ == "__main__":
    check_day("create_day46_tax", "get_day46_data")
    check_day("create_day47_tax", "get_day47_data")
    check_day("create_day48_tax", "get_day48_data")
    check_day("create_day49_tax", "get_day49_data")
    check_day("create_day50_tax", "get_day50_data")
