with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

for l in text.splitlines():
    if 'bcom_dmkt' in l and ('Month 2' in l or 'Block' in l or '50' in l or '45' in l):
        safe_l = l.encode('ascii', 'replace').decode('ascii')
        print(safe_l)
