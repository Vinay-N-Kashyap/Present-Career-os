import sys

def wire_bible():
    file_path = 'scripts/visuals/compile-500p-srs-pdf.mts'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add import
    import_target = "import { NLP_MONTH_1_SPECS, NLP_MONTH_2_SPECS } from './nlp-masterclass-spec';"
    import_replacement = (
        "import { NLP_MONTH_1_SPECS, NLP_MONTH_2_SPECS } from './nlp-masterclass-spec';\n"
        "import { buildMasterVisualsPlanHtml, buildDualTrackTestingSrsHtml } from './visuals-master-sections';"
    )
    if import_target not in content:
        print("Error: import target not found!")
        sys.exit(1)
    content = content.replace(import_target, import_replacement, 1)

    # 2. Add audit data loading and HTML embedding in generateMasterSrsPdf
    target_block = """  ${buildDeepMasterclassesHtml()}

</body>
</html>`;"""

    replacement_block = """  ${buildDeepMasterclassesHtml()}

  ${(() => {
    const auditPath = path.resolve(process.cwd(), 'docs/visuals/PINIT_36_COURSES_CATEGORIZED_AUDIT.json');
    if (fs.existsSync(auditPath)) {
      const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
      return buildMasterVisualsPlanHtml(courses, auditData.all, auditData);
    }
    return '';
  })()}

  ${buildDualTrackTestingSrsHtml()}

</body>
</html>`;"""

    if target_block not in content:
        print("Error: target_block not found!")
        sys.exit(1)
    content = content.replace(target_block, replacement_block, 1)

    # 3. Update Header & Footer
    old_header = "PinIT Career OS — 36+ Courses Masterclass SRS &amp; Architecture (v6.0 True 9.8 Standard)"
    new_header = "PinIT Career OS — 37 Courses Masterclass SRS, Visuals &amp; Architecture Bible (v7.0 Grand Standard)"
    content = content.replace(old_header, new_header)

    old_footer = "Zero-Hallucination Enforced &bull; Socratic Ladders &bull; 37 Courses (1,110 Days / 6,660 Parts)"
    new_footer = "Zero-Hallucination Enforced &bull; All 37 Courses, 17 Visual Engines &amp; Testing SRS (43 Parts / 2,220 Days / 8,862 Quests)"
    content = content.replace(old_footer, new_footer)

    # 4. Save alias PDF
    save_target = """  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(pdfOutPath, artifactPdfPath);
    console.log(`Successfully copied PDF to artifact path: ${artifactPdfPath}`);
  }"""

    save_replacement = """  const allInOnePdfPath = path.resolve(process.cwd(), 'docs/visuals/PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf');
  fs.copyFileSync(pdfOutPath, allInOnePdfPath);
  console.log(`Successfully created All-in-One Bible PDF: ${allInOnePdfPath}`);

  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(pdfOutPath, artifactPdfPath);
    fs.copyFileSync(pdfOutPath, path.join(artifactDir, 'PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf'));
    console.log(`Successfully copied PDF to artifact path: ${artifactPdfPath}`);
  }"""

    if save_target not in content:
        print("Error: save_target not found!")
        sys.exit(1)
    content = content.replace(save_target, save_replacement, 1)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully wired Grand All-in-One Architecture Bible into compile-500p-srs-pdf.mts!")

if __name__ == '__main__':
    wire_bible()
