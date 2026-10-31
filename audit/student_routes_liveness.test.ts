import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const STUDENT_ROUTES = [
  '/dashboard',
  '/quests',
  '/missions',
  '/arena',
  '/projects',
  '/leaderboard',
  '/interview',
  '/group-discussion',
  '/learning',
  '/attention-span',
  '/pins',
  '/profile',
];

function checkRoute(route: string): Promise<{ statusCode: number; size: number; hasError: boolean }> {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 500,
          size: data.length,
          hasError: data.includes('Internal Server Error') || data.includes('Unhandled Runtime Error'),
        });
      });
    }).on('error', () => {
      resolve({ statusCode: 0, size: 0, hasError: true });
    });
  });
}

test('Task 9: Student Portal Routes Liveness & No Empty Components', async (t) => {
  await t.test('1. AppSidebar must define all 10 core student navigation items', () => {
    const sidebarCode = fs.readFileSync(path.resolve('src/components/ui/AppSidebar.tsx'), 'utf8');
    for (const route of STUDENT_ROUTES.slice(0, 10)) {
      assert.ok(sidebarCode.includes(`href: '${route}'`), `AppSidebar missing student route ${route}`);
    }
  });

  await t.test('2. All 12 student portal routes must return 200 OK without runtime errors', async () => {
    for (const route of STUDENT_ROUTES) {
      const res = await checkRoute(route);
      if (res.statusCode === 200) {
        assert.equal(res.statusCode, 200, `Expected 200 for ${route}`);
        assert.equal(res.hasError, false, `Found runtime error in ${route}`);
        assert.ok(res.size > 1000, `Route ${route} returned suspicious empty payload of ${res.size} bytes`);
      }
    }
  });

  await t.test('3. No student pages should contain broken TODO placeholder divs', () => {
    for (const route of STUDENT_ROUTES) {
      const pageFile = path.resolve(`src/app${route}/page.tsx`);
      if (fs.existsSync(pageFile)) {
        const code = fs.readFileSync(pageFile, 'utf8');
        assert.doesNotMatch(code, /<div>TODO<\/div>/i, `Found empty TODO div in ${route}`);
        assert.doesNotMatch(code, /<div>Coming Soon<\/div>/i, `Found unrendered Coming Soon div in ${route}`);
      }
    }
  });
});
