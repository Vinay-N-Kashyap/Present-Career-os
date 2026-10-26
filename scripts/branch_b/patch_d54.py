with open('scripts/branch_b/generate_ecom_day54.py', 'r', encoding='utf-8') as f:
    content = f.read()

p4_extra = '''    "Furthermore, modern localization pipelines integrate automated pseudo-localization test harnesses into continuous deployment (CI/CD) workflows. By dynamically injecting accent-expanded characters and bidirectional bracket markers into pre-production storefront builds, automated visual regression suites catch text truncation, font glyph rendering failures, and bidirectional layout collisions before code merges into production release branches.",
    "In the following deterministic Python implementation,'''

content = content.replace('    "In the following deterministic Python implementation,', p4_extra, 1)

p5_extra = '''    "From a regulatory reporting standpoint, the command tower generates automated statutory disclosure filings required under national corporate governance codes and consumer protection watchdog mandates. Detailed compliance logs recording zero-tolerance enforcement of mandatory cooling-off periods, complete audit trails for every duty drawback tax reclamation claim, and mathematical proof of cryptographic privacy protection are consolidated into verifiable executive packets that satisfy international financial auditors and customs enforcement investigators.",
    "In the following deterministic Python implementation, we build the Global Governance Command Tower'''

content = content.replace('    "In the following deterministic Python implementation, we build the Global Governance Command Tower', p5_extra, 1)

with open('scripts/branch_b/generate_ecom_day54.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched generate_ecom_day54.py successfully!")
