import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

control_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
with open(control_csv, "r", encoding="utf-8") as f:
    r = csv.reader(f)
    for row in r:
        if len(row) >= 4 and "branch-b" in row[3]:
            print(row)
