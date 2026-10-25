import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
builder_path = os.path.join(commerce_dir, "scripts", "branch_b", "build_day55_dmkt.py")

p4_extra3 = '''    "Additionally, the bridge features Automated Lookback Window Sensitivity Calibration, allowing analysts to model 7-day, 14-day, and 30-day "
    "attribution windows to understand consumer purchase latency across low-involvement groceries and high-involvement consumer durable products.",
'''

p5_extra3 = '''    "This rigorous governance framework ensures that every retail media dollar is backed by auditable data, establishing an unshakeable standard "
    "of fiduciary responsibility and sustainable commercial excellence across global retail marketplaces.",
'''

with open(builder_path, "r", encoding="utf-8") as f:
    text = f.read()

# Insert into p4_say
idx4 = text.find('p4_example =')
bracket4 = text[:idx4].rstrip().rfind(']')
text = text[:bracket4] + p4_extra3 + text[bracket4:]

# Insert into p5_say
idx5 = text.find('p5_example =')
bracket5 = text[:idx5].rstrip().rfind(']')
text = text[:bracket5] + p5_extra3 + text[bracket5:]

with open(builder_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Successfully applied final top-up to build_day55_dmkt.py!")
