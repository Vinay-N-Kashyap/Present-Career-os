import json
import re

with open(r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Let's import the ts file using tsx or parse it
print(f"File size: {len(text)} characters, {len(text.splitlines())} lines")
