import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

# Let's import BCOM_ECOM_LONG_LESSONS via node or inspect the ts file directly
with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's check words of days 56 to 60 in bcomEcomLongLessons.ts
# Let's write a small script in TS and run via tsx
