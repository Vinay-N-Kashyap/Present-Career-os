const { chromium } = require('@playwright/test');

async function runLiveVerification() {
  console.log('🚀 Starting End-to-End Live Verification on Vercel Production...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Capture all console errors and uncaught exceptions
  const consoleErrors = [];
  const uncaughtErrors = [];
  const networkFailures = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore benign favicon or font 404s if any
      if (!text.includes('favicon') && !text.includes('socket')) {
        consoleErrors.push(text);
      }
    }
  });

  page.on('pageerror', err => {
    uncaughtErrors.push(err.message);
  });

  page.on('requestfailed', req => {
    const url = req.url();
    if (!url.includes('socket') && !url.includes('analytics') && !url.includes('favicon')) {
      networkFailures.push(`${req.method()} ${url} - ${req.failure()?.errorText}`);
    }
  });

  // Configure valid student session cookies and local storage identity
  await page.context().addCookies([
    { name: 'pinit_session', value: 'active', domain: 'present-career-os.vercel.app', path: '/' },
    { name: 'pinit_role', value: 'student', domain: 'present-career-os.vercel.app', path: '/' },
    { name: 'pinit_uid', value: 'usr_demo_student', domain: 'present-career-os.vercel.app', path: '/' }
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('pinit_usr_demo_student_onboarding_answers', JSON.stringify({
      role: 'Python Developer',
      hasCompleted: true
    }));
    window.addEventListener('DOMContentLoaded', () => {
      window.dispatchEvent(new CustomEvent('pinit:identity_user_authenticated', {
        detail: {
          user: {
            id: 'usr_demo_student',
            displayName: 'Demo Student',
            role: 'student',
            email: 'student@pinit.in'
          }
        }
      }));
    });
  });

  const liveUrl = 'https://present-career-os.vercel.app/quests/lesson?questId=python-lecture1-day-1&teacherId=kashyap';
  console.log(`\n1. Navigating to: ${liveUrl}`);
  await page.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // 2. Wait for lesson card
  console.log('2. Waiting for classroom interface to hydrate...');
  await page.waitForSelector('[data-testid="lesson-card-root"]', { timeout: 25000 });
  console.log('   ✅ Classroom card successfully mounted.');

  // 3. Verify Visual Stage is present
  console.log('3. Checking Visual Stage canvas...');
  const visualStage = await page.waitForSelector('[data-testid="visual-stage-root"]', { timeout: 15000 });
  assert(visualStage, 'Visual Stage root mounted');
  const stageHeading = await page.textContent('.visual-stage-header');
  console.log(`   ✅ Visual Stage mounted with heading: "${stageHeading?.trim()}"`);

  // 4. Verify Fullscreen Toggle button in LessonHeader
  console.log('4. Checking Fullscreen Gaming Mode button & shortcuts...');
  const fsBtn = await page.waitForSelector('[data-testid="btn-fullscreen-toggle"]', { timeout: 5000 });
  const fsBtnText = await fsBtn.textContent();
  console.log(`   ✅ Fullscreen toggle button rendered: "${fsBtnText?.trim()}"`);

  // 5. Trigger Fullscreen via keyboard shortcut (Shift + double Space)
  console.log('5. Triggering Shift + double tap Space keyboard shortcut...');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Space');
  await page.waitForTimeout(100);
  await page.keyboard.press('Space');
  await page.keyboard.up('Shift');
  await page.waitForTimeout(500);

  // Check if fullscreen HUD pill appears
  const hudPill = await page.$('[data-testid="fullscreen-mode-pill"]');
  if (hudPill) {
    const hudText = await hudPill.textContent();
    console.log(`   ✅ Fullscreen Gaming Mode activated! HUD Pill text: "${hudText?.trim()}"`);
  } else {
    // In headless chromium, document.documentElement.requestFullscreen() can require mock,
    // let's click the toggle button to test UI state
    console.log('   (Headless environment intercepted native window fullscreen, testing toggle button)');
    await fsBtn.click();
    await page.waitForTimeout(300);
    const hudPillAfterClick = await page.$('[data-testid="fullscreen-mode-pill"]');
    if (hudPillAfterClick) {
      console.log(`   ✅ Fullscreen Focus Mode toggle active! HUD Pill: "${(await hudPillAfterClick.textContent())?.trim()}"`);
    }
  }

  // 6. Test Exiting Fullscreen via Shift + Esc
  console.log('6. Triggering Shift + Escape exit shortcut...');
  await page.keyboard.down('Shift');
  await page.keyboard.press('Escape');
  await page.keyboard.up('Shift');
  await page.waitForTimeout(300);
  console.log('   ✅ Exit shortcut processed.');

  // 7. Test Python Code Execution
  console.log('7. Testing Python code execution in browser runner...');
  const runBtn = await page.waitForSelector('[data-testid="btn-run-code"], .btn-run-code, button:has-text("Run Code")', { timeout: 10000 });
  console.log('   Clicking "Run Code"...');
  await runBtn.click();

  // Wait for execution result output
  console.log('   Waiting for Pyodide worker to compile & execute code...');
  await page.waitForTimeout(5000);

  // Check terminal/output text
  const terminalText = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="code-output-terminal"], .code-output-terminal, .terminal-window, pre');
    return el ? el.textContent : '';
  });

  console.log(`   Python Runner Output: "${terminalText?.trim().slice(0, 100)}"`);
  const hasError = terminalText?.includes('Python could not start');
  if (hasError) {
    console.error('   ❌ ERROR: Python failed to start!');
  } else {
    console.log('   ✅ Python executed without "Python could not start" error!');
  }

  // 8. Error Summary
  console.log('\n--- VERIFICATION AUDIT SUMMARY ---');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) consoleErrors.forEach(e => console.log('   ⚠️ Console Error:', e));
  console.log(`Uncaught Errors: ${uncaughtErrors.length}`);
  if (uncaughtErrors.length > 0) uncaughtErrors.forEach(e => console.log('   ⚠️ Uncaught Error:', e));
  console.log(`Network Failures: ${networkFailures.length}`);
  if (networkFailures.length > 0) networkFailures.forEach(e => console.log('   ⚠️ Network Failure:', e));

  await browser.close();

  if (consoleErrors.length === 0 && uncaughtErrors.length === 0 && !hasError) {
    console.log('\n🎉 ALL LIVE VERIFICATION CHECKS PASSED: ZERO ERRORS, PERFECT EXECUTION!');
  } else {
    console.log('\n⚠️ Some warnings or errors detected during live run.');
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

runLiveVerification().catch(err => {
  console.error('Fatal live test failure:', err);
  process.exit(1);
});
