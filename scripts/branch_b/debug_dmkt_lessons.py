import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days_unquoted = re.findall(r"\bday:\s*(\d+)", text)
days_quoted = re.findall(r'"day":\s*(\d+)', text)

print("days unquoted:", len(days_unquoted), days_unquoted)
print("days quoted:", len(days_quoted), days_quoted)

# Check what the exported array is
exports = re.findall(r"export\s+const\s+(\w+)", text)
print("Exports:", exports)

# Check length of the array in Node/TS
last_lines = text.splitlines()[-40:]
print("Last 40 lines:")
print("\n".join(last_lines))
