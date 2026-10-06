import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const VIEWPORTS = [
  { width: 390, height: 844, name: '390px mobile' },
  { width: 1440, height: 900, name: '1440px desktop' },
];

const TEMPLATES = ['flow', 'boxes', 'table', 'letters', 'compare'];
const THEMES = ['light', 'dark'];

test.describe('Visual Template Gallery E2E (E-06)', () => {
  // If run in normal production build (test mode not enabled), page must return 404
  if (process.env.NEXT_PUBLIC_E2E_TEST_MODE !== '1') {
    test('returns 404 in normal production build without NEXT_PUBLIC_E2E_TEST_MODE=1', async ({ page }) => {
      const response = await page.goto('/dev/visual-gallery');
      expect(response?.status()).toBe(404);
    });
    return;
  }

  for (const vp of VIEWPORTS) {
    test(`renders every template and every step without sideways scroll at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const response = await page.goto('/dev/visual-gallery', { waitUntil: 'load' });
      expect(response?.status()).toBe(200);

      await page.waitForSelector('.visual-gallery-root', { timeout: 15000 });

      // Verify every template section is rendered
      for (const t of TEMPLATES) {
        const section = page.locator(`[data-testid="gallery-section-${t}"]`);
        await expect(section, `Section for template ${t} must be visible`).toBeVisible();
      }

      // Verify every step for every template is rendered and visible
      const expectedSteps: Record<string, number> = {
        flow: 3,
        boxes: 3,
        table: 3,
        letters: 3,
        compare: 2,
      };

      for (const [template, count] of Object.entries(expectedSteps)) {
        for (let idx = 0; idx < count; idx++) {
          const stepEl = page.locator(`[data-testid="gallery-step-${template}-${idx}"]`);
          await expect(stepEl, `Template ${template} step ${idx + 1} must be visible at ${vp.name}`).toBeVisible();
        }
      }

      // Check for horizontal overflow (no sideways scroll)
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        return {
          docScrollWidth: doc.scrollWidth,
          bodyScrollWidth: body.scrollWidth,
          windowWidth: window.innerWidth,
        };
      });

      expect(
        overflow.docScrollWidth,
        `Document has horizontal scroll at ${vp.name} (scrollWidth: ${overflow.docScrollWidth}, window: ${overflow.windowWidth})`
      ).toBeLessThanOrEqual(overflow.windowWidth + 1);

      expect(
        overflow.bodyScrollWidth,
        `Body has horizontal scroll at ${vp.name} (scrollWidth: ${overflow.bodyScrollWidth}, window: ${overflow.windowWidth})`
      ).toBeLessThanOrEqual(overflow.windowWidth + 1);
    });
  }

  for (const theme of THEMES) {
    test(`passes WCAG color contrast check in ${theme} mode`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/dev/visual-gallery', { waitUntil: 'load' });
      await page.waitForSelector('.visual-gallery-root', { timeout: 15000 });

      // Apply theme
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        document.documentElement.className = t;
        localStorage.setItem('pc_theme', t);
      }, theme);

      await page.waitForTimeout(300);

      // Analyze color-contrast on the gallery root
      const results = await new AxeBuilder({ page })
        .include('.visual-gallery-root')
        .withRules(['color-contrast'])
        .analyze();

      const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast');
      expect(
        contrastViolations,
        `Found color contrast violations in ${theme} mode: ${JSON.stringify(
          contrastViolations.map((v) => v.nodes.map((n) => n.target)),
          null,
          2
        )}`
      ).toEqual([]);
    });
  }
});
