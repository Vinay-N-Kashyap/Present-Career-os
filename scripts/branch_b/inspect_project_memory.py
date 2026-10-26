import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for Course 07 or bcom_ecom or Branch B
print('Total characters in PROJECT_MEMORY.md:', len(text))

pos = text.find('bcom_ecom')
while pos != -1:
    print('--- MATCH ---')
    print(text[max(0, pos-100):min(len(text), pos+300)])
    pos = text.find('bcom_ecom', pos+400)
