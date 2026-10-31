import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Task 7: Padding, Margin & Container Alignment Audit', async (t) => {
  await t.test('1. AppShell should delegate responsive padding to CSS rather than hardcoding 20px 24px inline', () => {
    const appShellCode = fs.readFileSync(path.resolve('src/components/ui/AppShell.tsx'), 'utf8');
    assert.doesNotMatch(appShellCode, /effectiveFocusMode\s*\?\s*'40px 60px'\s*:\s*'20px 24px'/);
    assert.match(appShellCode, /className="page-content animate-fade-in"/);
  });

  await t.test('2. Student tab pages must not have duplicate outer desktop horizontal padding', () => {
    const arenaCode = fs.readFileSync(path.resolve('src/app/arena/page.tsx'), 'utf8');
    assert.doesNotMatch(arenaCode, /padding:\s*'24px',\s*maxWidth/);

    const projectsCode = fs.readFileSync(path.resolve('src/app/projects/page.tsx'), 'utf8');
    assert.doesNotMatch(projectsCode, /padding:\s*'24px 20px 80px'/);

    const leaderboardCode = fs.readFileSync(path.resolve('src/app/leaderboard/page.tsx'), 'utf8');
    assert.doesNotMatch(leaderboardCode, /padding:\s*'24px 32px 80px'/);

    const interviewCode = fs.readFileSync(path.resolve('src/app/interview/page.tsx'), 'utf8');
    assert.doesNotMatch(interviewCode, /padding:\s*isInterviewActive\s*\?\s*'6px 16px'\s*:\s*'24px 36px'/);

    const pinsCode = fs.readFileSync(path.resolve('src/app/pins/page.tsx'), 'utf8');
    assert.doesNotMatch(pinsCode, /padding:\s*'28px 20px 60px'/);
  });

  await t.test('3. CSS media queries in globals.css must define standard fluid gutters', () => {
    const globalsCss = fs.readFileSync(path.resolve('src/styles/globals.css'), 'utf8');
    assert.match(globalsCss, /\.page-content\s*\{/);
    assert.match(globalsCss, /@media\s*\(max-width:\s*900px\)/);
    assert.match(globalsCss, /@media\s*\(max-width:\s*640px\)/);
  });

  await t.test('4. Group discussion boardroom must not force minHeight 100vh inside AppShell', () => {
    const gdCss = fs.readFileSync(path.resolve('src/styles/group-discussion.css'), 'utf8');
    assert.doesNotMatch(gdCss, /min-height:\s*100vh;/);
    assert.match(gdCss, /min-height:\s*80vh;/);
  });
});
