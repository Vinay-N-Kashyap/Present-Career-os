import os

compiler_path = os.path.join(os.getcwd(), 'scripts', 'visuals', 'compile-500p-srs-pdf.mts')
with open(compiler_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update import
old_import = "import { buildMasterVisualsPlanHtml, buildDualTrackTestingSrsHtml } from './visuals-master-sections';"
new_import = "import { buildMasterVisualsPlanHtml, buildDualTrackTestingSrsHtml } from './visuals-master-sections';\nimport { buildForensicAuditAndRemediationHtml } from './part44_forensic_audit';"

if old_import in content:
    content = content.replace(old_import, new_import, 1)
    print("Import updated successfully.")
else:
    print("Warning: old import not found, checking if already updated...")

# 2. Update HTML assembly
old_assembly = "  ${buildDualTrackTestingSrsHtml()}\n\n</body>"
new_assembly = "  ${buildDualTrackTestingSrsHtml()}\n\n  ${buildForensicAuditAndRemediationHtml()}\n\n</body>"

if old_assembly in content:
    content = content.replace(old_assembly, new_assembly, 1)
    print("HTML assembly updated successfully.")
else:
    print("Warning: old assembly not found, checking...")

# 3. Update header/footer
content = content.replace(
    "PinIT Career OS — 37 Courses Masterclass SRS, Visuals &amp; Architecture Bible (v7.0 Grand Standard)",
    "PinIT Career OS — 37 Courses Masterclass SRS, Visuals, Testing &amp; 10/10 Remediation Bible (v8.0 Grand Standard)"
)
content = content.replace(
    "All 37 Courses, 17 Visual Engines &amp; Testing SRS (43 Parts / 2,220 Days / 8,862 Quests)",
    "All 37 Courses, 17 Visual Engines, Testing SRS &amp; 10/10 Remediation Crucible (44 Parts / 2,220 Days / 8,862 Quests)"
)

with open(compiler_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully updated {compiler_path}")
