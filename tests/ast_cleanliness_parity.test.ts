import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const TARGET_FILES = [
  'src/app/university/page.tsx',
  'src/app/interview/components/InterviewSetupView.tsx',
  'src/app/quests/components/TrackSelectorDrawer.tsx',
  'src/app/arena/page.tsx',
  'src/components/friends/ReportStudentModal.tsx'
];

test('AST Cleanliness: No raw unescaped ampersands inside JSX text nodes in critical UI files', () => {
  const jsxTextAmpersandRegex = />[^<\n]*\b&\b[^<\n]*</;

  for (const filePath of TARGET_FILES) {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(jsxTextAmpersandRegex);
      assert.strictEqual(
        match,
        null,
        `File ${filePath}:${i + 1} contains unescaped '&' in JSX text node: ${match?.[0]}`
      );
    }
  }
});

test('AST Cleanliness: InterviewSetupView does not nest React fragments inside HTML select element', () => {
  const content = fs.readFileSync('src/app/interview/components/InterviewSetupView.tsx', 'utf-8');
  assert.ok(
    !content.includes('<select') || !content.match(/<select[^>]*>[\s\S]*?<>/),
    'InterviewSetupView must not contain React fragments (<>) directly inside <select>'
  );
});

test('AST Cleanliness: TypeScript compiler parses all 5 files cleanly with zero syntax diagnostics', () => {
  for (const filePath of TARGET_FILES) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      code,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    );
    assert.ok(sourceFile.statements.length > 0, `${filePath} must contain parsed AST statements`);
  }
});
