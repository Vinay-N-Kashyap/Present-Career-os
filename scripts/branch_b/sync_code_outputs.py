import json
import subprocess
import sys

def sync_day(day_file):
    with open(day_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for idx, p in enumerate(data['parts']):
        code = p['code']
        with open('scripts/branch_b/temp_exec.py', 'w', encoding='utf-8') as tf:
            tf.write(code)
        res = subprocess.run([sys.executable, 'scripts/branch_b/temp_exec.py'], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error executing Part {idx+1} in {day_file}:")
            print(res.stderr)
            raise RuntimeError(f"Part {idx+1} failed execution")
        p['output'] = res.stdout
        print(f"Synced {day_file} Part {idx+1} output ({len(res.stdout)} chars)")

    with open(day_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    sync_day('scripts/branch_b/day56_dmkt_data.json')
