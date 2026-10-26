with open('scripts/branch_b/generate_ecom_day54.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'p4_say = [' in line:
        new_lines.append(line)
        new_lines.append('    "Furthermore, modern localization pipelines integrate automated pseudo-localization test harnesses into continuous deployment (CI/CD) workflows. By dynamically injecting accent-expanded characters and bidirectional bracket markers into pre-production storefront builds, automated visual regression suites catch text truncation, font glyph rendering failures, and bidirectional layout collisions before code merges into production release branches.",\n')
    elif 'p5_say = [' in line:
        new_lines.append(line)
        new_lines.append('    "From a regulatory reporting standpoint, the command tower generates automated statutory disclosure filings required under national corporate governance codes and consumer protection watchdog mandates. Detailed compliance logs recording zero-tolerance enforcement of mandatory cooling-off periods, complete audit trails for every duty drawback tax reclamation claim, and mathematical proof of cryptographic privacy protection are consolidated into verifiable executive packets that satisfy international financial auditors and customs enforcement investigators.",\n')
        new_lines.append('    "In addition, the command tower maintains continuous automated reconciliation between international merchant payouts, localized value-added tax accounts, and customs authority refund deposits. By eliminating manual spreadsheet reconciliations and isolated treasury silos, the architecture ensures that global financial controllers maintain instantaneous visibility into cross-border working capital velocity across all active trading currency pairs.",\n')
    else:
        new_lines.append(line)

with open('scripts/branch_b/generate_ecom_day54.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Directly injected into p4_say and p5_say!")
