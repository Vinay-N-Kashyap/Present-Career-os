path = 'scripts/branch_b/build_day53_dmkt.py'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '    "globally optimal, profit-maximizing clearing price with minimal capital waste.",\n]'
replacement = '''    "globally optimal, profit-maximizing clearing price with minimal capital waste.",
    "Finally, the bidding platform exposes real-time telemetry hooks that broadcast bid updates, pacing statuses, and harvesting anomalies directly to "
    "enterprise communication channels. By pairing automated execution with granular visibility, media engineering teams retain absolute strategic control "
    "while eliminating thousands of hours of repetitive manual campaign adjustments."
]'''

if target not in text:
    target = target.replace('\n', '\r\n')
    replacement = replacement.replace('\n', '\r\n')

assert target in text, 'target still not found'
text = text.replace(target, replacement)
with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Successfully patched p5 in build_day53_dmkt.py!')
