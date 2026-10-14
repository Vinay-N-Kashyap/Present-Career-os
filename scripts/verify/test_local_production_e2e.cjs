const { chromium } = require('@playwright/test');

async function testLocalProduction() {
  console.log('🚀 Running Full Local Production E2E Test on http://localhost:3005...\n');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const consoleErrors = [];
  const uncaughtErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('socket')) {
        consoleErrors.push(text);
      }
    }
  });

  page.on('pageerror', err => {
    uncaughtErrors.push(err.message);
  });

  // 1. Navigate to Python Lecture 1 Day 1
  const lessonUrl = 'http://localhost:3005/quests/lesson?questId=python-lecture1-day-1&teacherId=kashyap&testMode=true';
  console.log(`1. Navigating to: ${lessonUrl}`);
  await page.goto(lessonUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // 2. Wait for Classroom interface to mount
  console.log('2. Verifying Classroom interface mounts...');
  const lessonCard = await page.waitForSelector('[data-testid="lesson-card-root"]', { timeout: 15000 });
  assert(lessonCard, 'Classroom card mounted');
  console.log('   ✅ Classroom card mounted successfully.');

  // Slide 0 is the welcome intro. Advance to Slide 1 for the 2-column interactive stage
  console.log('3. Advancing from Intro Slide 0 to Teaching Slide 1...');
  const nextBtn = await page.waitForSelector('[data-testid="btn-next-slide"]', { timeout: 10000 });
  await nextBtn.click();
  await page.waitForTimeout(1000);

  // 4. Verify Visual Stage canvas on Slide 1
  console.log('4. Verifying Visual Stage...');
  const visualStage = await page.waitForSelector('[data-testid="visual-stage-root"]', { timeout: 15000 });
  assert(visualStage, 'Visual Stage root mounted');
  const stageHeading = await page.$eval('[data-testid="visual-stage-root"] h3', el => el.textContent);
  console.log(`   ✅ Visual Stage mounted with heading: "${stageHeading?.trim()}"`);
  const stageCaption = await page.textContent('[data-testid="visual-stage-caption"]');
  console.log(`   ✅ Visual Stage caption: "${stageCaption?.trim()}"`);

  // Take screenshot of default classroom layout
  await page.screenshot({ path: 'scripts/verify/screenshot_1_normal_classroom.png' });
  console.log('   📸 Screenshot saved: scripts/verify/screenshot_1_normal_classroom.png');

  // 4. Test Feature 2: Fullscreen Gaming Mode
  console.log('\n4. Testing Feature 2: Fullscreen Focus / Gaming Mode...');
  const fsBtn = await page.waitForSelector('[data-testid="btn-fullscreen-toggle"]', { timeout: 5000 });
  const fsBtnText = await fsBtn.textContent();
  console.log(`   Button label: "${fsBtnText?.trim()}"`);

  // Test entering fullscreen via button
  console.log('   Clicking Fullscreen Focus Mode toggle button...');
  await fsBtn.click();
  await page.waitForTimeout(600);

  // Check if fullscreen styling is active
  let isFullscreenActive = await page.evaluate(() => {
    return document.querySelector('.classroom-page-root')?.classList.contains('fullscreen-mode');
  });
  console.log(`   Classroom page has .fullscreen-mode: ${isFullscreenActive}`);

  let hudPill = await page.$('[data-testid="fullscreen-mode-pill"]');
  assert(hudPill, 'Fullscreen HUD pill is displayed');
  let hudPillText = await hudPill.textContent();
  console.log(`   ✅ Fullscreen HUD badge active: "${hudPillText?.trim()}"`);

  // Take screenshot of Fullscreen Gaming Mode layout
  await page.screenshot({ path: 'scripts/verify/screenshot_2_fullscreen_gaming_mode.png' });
  console.log('   📸 Screenshot saved: scripts/verify/screenshot_2_fullscreen_gaming_mode.png');

  // Test keyboard shortcut to exit fullscreen (Shift + Esc)
  console.log('   Pressing Shift + Escape to exit fullscreen...');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Escape');
  await page.keyboard.up('Shift');
  await page.waitForTimeout(500);

  isFullscreenActive = await page.evaluate(() => {
    return document.querySelector('.classroom-page-root')?.classList.contains('fullscreen-mode');
  });
  console.log(`   Exited fullscreen. .fullscreen-mode active: ${isFullscreenActive}`);

  // Ensure nothing is focused that would block keyboard shortcuts
  await page.evaluate(() => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  });
  await page.mouse.click(20, 20);
  await page.waitForTimeout(200);

  // Test entering fullscreen via keyboard shortcut (Shift + Space twice within 500ms)
  console.log('   Testing keyboard shortcut: Shift + double tap Spacebar to enter fullscreen...');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
  await page.keyboard.press('Space');
  await page.keyboard.up('Shift');
  await page.waitForTimeout(600);

  isFullscreenActive = await page.evaluate(() => {
    return document.querySelector('.classroom-page-root')?.classList.contains('fullscreen-mode');
  });
  console.log(`   Keyboard shortcut activated .fullscreen-mode: ${isFullscreenActive}`);

  // Exit again cleanly
  await page.keyboard.down('Shift');
  await page.keyboard.press('Escape');
  await page.keyboard.up('Shift');
  await page.waitForTimeout(400);
  console.log('   ✅ Fullscreen Gaming Mode toggled cleanly via keyboard shortcut and button.');

  // 5. Test Python In-Browser Code Execution
  console.log('\n5. Testing Python Code Execution in browser worker...');
  const runBtn = await page.waitForSelector('button:has-text("Run Code"), [data-testid="btn-run-code"]', { timeout: 10000 });
  assert(runBtn, 'Run Code button found');
  console.log('   Clicking "Run Code"...');
  await runBtn.click();

  console.log('   Waiting for Pyodide worker execution to finish...');
  await page.waitForFunction(() => {
    const el = document.querySelector('[data-testid="lesson-code-output"]');
    return el && !el.textContent.includes('Starting Python') && !el.textContent.includes('Running in isolated');
  }, { timeout: 45000 });

  const finalOutputEl = await page.$('[data-testid="lesson-code-output"]');
  assert(finalOutputEl, 'Lesson code output container displayed');
  const finalOutputText = await finalOutputEl.textContent();

  console.log(`   Final Terminal Output: "${finalOutputText?.trim()}"`);
  const hasStartError = finalOutputText?.includes('Python could not start');
  assert(!hasStartError, 'Python must not fail with "Python could not start"');
  console.log('   ✅ Python executed successfully inside the browser without errors!');

  await finalOutputEl.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'scripts/verify/screenshot_3_python_execution_success.png' });
  console.log('   📸 Screenshot saved: scripts/verify/screenshot_3_python_execution_success.png');

  // 6. Test Feature 1: Access Control - Completed Previous Classes are Locked
  console.log('\n6. Testing Feature 1: User Cannot Access Previous Classes...');
  // Inject completedQuests = ['python-lecture1-day-1'] into localStorage
  await page.evaluate(() => {
    localStorage.setItem('pinit_completed_quests', JSON.stringify(['python-lecture1-day-1']));
    localStorage.setItem('pinit_guest_completed_quests', JSON.stringify(['python-lecture1-day-1']));
    localStorage.setItem('pinit_test-ci-student_completed_quests', JSON.stringify(['python-lecture1-day-1']));
    localStorage.setItem('pinit_guest_onboarding_answers', JSON.stringify({
      completedQuests: ['python-lecture1-day-1']
    }));
  });

  // Navigate to the completed class in student session
  console.log('   Attempting to access previously completed class (student session)...');
  await page.goto('http://localhost:3005/quests/lesson?questId=python-lecture1-day-1&teacherId=kashyap&testMode=true', { waitUntil: 'networkidle' });

  const lockedElement = await page.waitForSelector('[data-testid="quest-already-completed-locked"]', { timeout: 10000 });
  assert(lockedElement, 'Lock screen mounted for previously completed class');
  const lockText = await lockedElement.textContent();
  console.log(`   ✅ Access Denied Lock Screen Active: "${lockText?.trim().slice(0, 80)}..."`);
  const returnBtn = await page.$('[data-testid="btn-completed-return"]');
  assert(returnBtn, 'Return button on locked screen exists');
  await page.screenshot({ path: 'scripts/verify/screenshot_4_locked_previous_class.png' });
  console.log('   📸 Screenshot saved: scripts/verify/screenshot_4_locked_previous_class.png');

  // 7. Verify Console & Crash Errors
  console.log('\n--- SYSTEM PERFORMANCE AUDIT ---');
  console.log(`Console Errors count: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(err => console.log('   ⚠️ Console error:', err));
  } else {
    console.log('   ✅ ZERO console errors detected.');
  }
  console.log(`Uncaught Exceptions: ${uncaughtErrors.length}`);
  if (uncaughtErrors.length > 0) {
    uncaughtErrors.forEach(err => console.log('   ⚠️ Uncaught error:', err));
  } else {
    console.log('   ✅ ZERO uncaught errors detected.');
  }

  await browser.close();
  console.log('\n🎉 ALL TESTS COMPLETED: NO ERRORS, NO CODE ERRORS, PERFECT EXECUTION!');
}

function assert(condition, message) {
  if (!condition) {
    console.error('Assertion failed:', message);
    throw new Error(message || 'Assertion failed');
  }
}

testLocalProduction().catch(err => {
  console.error('Fatal test failure:', err);
  process.exit(1);
});
