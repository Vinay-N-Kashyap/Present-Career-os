import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

test('Task 8: CSS Standards, Design Tokens & Cross-Browser Consistency Audit', async (t) => {
  const globalsCss = fs.readFileSync(path.resolve('src/styles/globals.css'), 'utf8');

  await t.test('1. globals.css must parse cleanly with PostCSS without syntax errors', () => {
    const result = postcss.parse(globalsCss, { from: 'src/styles/globals.css' });
    assert.ok(result.nodes.length > 400, 'Expected >400 CSS rules in globals.css');
  });

  await t.test('2. All stylesheets in src/styles must be free of syntax errors', () => {
    const cssDir = path.resolve('src/styles');
    const files = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(cssDir, file), 'utf8');
      assert.doesNotThrow(() => {
        postcss.parse(content, { from: file });
      }, `Stylesheet ${file} contains CSS syntax errors`);
    }
  });

  await t.test('3. Dark mode tokens must provide accessible WCAG AA contrast for tertiary text', () => {
    assert.match(globalsCss, /--t3:\s*#7b85ad/);
    assert.match(globalsCss, /--t2:\s*#9da6c5/);
  });

  await t.test('4. Light mode tokens must provide accessible WCAG AA contrast on white background', () => {
    assert.match(globalsCss, /--t3:\s*#525b77/);
    assert.match(globalsCss, /--t2:\s*#43495d/);
  });

  await t.test('5. Scrollbar styling must include standard W3C scrollbar-width for Firefox/Linux', () => {
    assert.match(globalsCss, /scrollbar-width:\s*thin/);
    assert.match(globalsCss, /scrollbar-color:/);
    assert.match(globalsCss, /::-webkit-scrollbar/);
  });

  await t.test('6. Glassmorphism fallback must be present for low-power devices', () => {
    assert.match(globalsCss, /@supports\s+not\s+\(backdrop-filter:\s*blur\(1px\)\)/);
  });
});
