import { test, expect } from '@playwright/test';

test.describe('Change & Run (Task E-22 / Plan C6)', () => {
  test('python Day 2 Part 1: changing lunch=120 to lunch=150 updates total box to 215', async ({ page }) => {
    await page.goto('/quests/lesson?questId=python-lecture1-day-2&testMode=true', { waitUntil: 'load' });
    await page.waitForSelector('.lesson-card, .visual-stage-root', { timeout: 15000 });

    // Assert visual for python:2:0 is visible
    const visualRoot = page.locator('.visual-stage-root');
    await expect(visualRoot).toBeVisible();

    // Find the code editor
    const codeEditor = page.locator('[data-testid="lesson-code-input"]');
    await expect(codeEditor).toBeVisible();

    const initialCode = await codeEditor.inputValue();
    expect(initialCode).toContain('lunch = 120');

    // Change lunch = 120 to lunch = 150
    const updatedCode = initialCode.replace('lunch = 120', 'lunch = 150');
    await codeEditor.fill(updatedCode);

    // Click Run Code
    const runBtn = page.locator('[data-testid="btn-run-code"]');
    await runBtn.click();

    // Wait for code to finish executing
    await expect(runBtn).not.toHaveText(/Running/, { timeout: 15000 });

    // Navigate to step 3 (index 2: example) or step 4 (index 3: tryIt) where total is shown
    const step3Dot = page.locator('button.step-dot').nth(2);
    await step3Dot.click();

    // Total box should now show 215
    const totalBox = page.locator('[aria-label*="total: 215"]');
    await expect(totalBox).toBeVisible({ timeout: 5000 });
  });

  test('renaming lunch: fallback line appears and lesson values are kept', async ({ page }) => {
    await page.goto('/quests/lesson?questId=python-lecture1-day-2&testMode=true', { waitUntil: 'load' });
    await page.waitForSelector('.lesson-card, .visual-stage-root', { timeout: 15000 });

    const codeEditor = page.locator('[data-testid="lesson-code-input"]');
    await expect(codeEditor).toBeVisible();

    const initialCode = await codeEditor.inputValue();

    // Rename lunch to food
    const renamedCode = initialCode
      .replace('lunch = 120', 'food = 120')
      .replace('lunch', 'food');
    await codeEditor.fill(renamedCode);

    // Click Run Code
    const runBtn = page.locator('[data-testid="btn-run-code"]');
    await runBtn.click();
    await expect(runBtn).not.toHaveText(/Running/, { timeout: 15000 });

    // Fallback message should appear
    const fallbackNotice = page.locator('.visual-fallback-note');
    await expect(fallbackNotice).toBeVisible({ timeout: 5000 });
    await expect(fallbackNotice).toContainText(
      "Your code changed the names this picture uses, so it shows the lesson's values."
    );

    // Total box keeps lesson value (185)
    const step3Dot = page.locator('button.step-dot').nth(2);
    await step3Dot.click();
    const totalBox = page.locator('[aria-label*="total: 185"]');
    await expect(totalBox).toBeVisible();
  });

  test('python Day 2 Part 2: changing balance=500 to balance=600 updates first step to 600', async ({ page }) => {
    await page.goto('/quests/lesson?questId=python-lecture1-day-2&testMode=true', { waitUntil: 'load' });
    await page.waitForSelector('.lesson-card, .visual-stage-root', { timeout: 15000 });

    // Advance to slide 2 (Day 2 Part 2)
    const nextSlideBtn = page.locator('button[data-testid="btn-next-slide"]');
    await expect(nextSlideBtn).toBeVisible();
    await nextSlideBtn.click();
    await page.waitForTimeout(400);

    // Assert visual is at python:2:1
    await expect(page.locator('[data-visual-key="python:2:1"]')).toBeVisible({ timeout: 5000 });

    const codeEditor = page.locator('[data-testid="lesson-code-input"]');
    await expect(codeEditor).toBeVisible();

    const initialCode = await codeEditor.inputValue();
    expect(initialCode).toContain('balance = 500');

    // Change balance = 500 to balance = 600
    const updatedCode = initialCode.replace('balance = 500', 'balance = 600');
    await codeEditor.fill(updatedCode);

    // Click Run Code
    const runBtn = page.locator('[data-testid="btn-run-code"]');
    await runBtn.click();
    await expect(runBtn).not.toHaveText(/Running/, { timeout: 15000 });

    // Step 1 (first step, index 0) should show balance as 600
    const step1Dot = page.locator('button.step-dot').first();
    await step1Dot.click();

    const balanceBox = page.locator('[aria-label*="balance: 600"]');
    await expect(balanceBox).toBeVisible({ timeout: 5000 });
  });
});
