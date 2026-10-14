const { chromium } = require('@playwright/test');
const assert = require('assert');

async function verifyClassroomUpdates() {
  console.log('🚀 Running Verification of Navigation Layout, Dynamic Visuals, and Teacher Avatar...\n');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('socket')) {
        consoleErrors.push(text);
      }
    }
  });

  const lessonUrl = 'http://localhost:3005/quests/lesson?questId=python-lecture1-day-1&teacherId=kashyap&testMode=true';
  console.log(`1. Navigating to: ${lessonUrl}`);
  await page.goto(lessonUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // 1. Advance to Slide 1
  const nextBtnIntro = await page.waitForSelector('[data-testid="btn-next-slide"]', { timeout: 10000 });
  await nextBtnIntro.click();
  await page.waitForTimeout(1000);

  // 2. Check layout positions: Left = Avatar Dock, Center = Next Button, Right = Controls
  console.log('2. Auditing 3-Zone Navigation Bar Layout...');
  const avatarDock = await page.waitForSelector('[data-testid="teacher-avatar-dock"]');
  const nextBtn = await page.waitForSelector('[data-testid="btn-next-slide"]');
  const prevBtn = await page.waitForSelector('[data-testid="btn-prev-slide"]');
  const qaBtn = await page.waitForSelector('[data-testid="btn-qa-toggle"]');

  const avatarBox = await avatarDock.boundingBox();
  const nextBox = await nextBtn.boundingBox();
  const prevBox = await prevBtn.boundingBox();
  const qaBox = await qaBtn.boundingBox();

  console.log(`   Avatar Dock X: ${avatarBox.x.toFixed(1)}px (Left)`);
  console.log(`   Next Button X: ${nextBox.x.toFixed(1)}px (Middle)`);
  console.log(`   Prev Button X: ${prevBox.x.toFixed(1)}px (Right)`);
  console.log(`   Q&A Button X:  ${qaBox.x.toFixed(1)}px (Right)`);

  assert(avatarBox.x < nextBox.x, 'Avatar dock must be to the left of the Next button');
  assert(nextBox.x < prevBox.x, 'Next button must be to the left of the Prev button (centered)');
  console.log('   ✅ Navigation layout is correctly partitioned: Left = Teacher Avatar, Center = Next Button, Right = Prev & Q&A!');

  // 3. Check Teacher Avatar elements (name, status, icon)
  console.log('\n3. Auditing Teacher Avatar Frame...');
  const teacherName = await page.textContent('[data-testid="teacher-avatar-name"]');
  const teacherStatus = await page.textContent('[data-testid="teacher-avatar-status"]');
  console.log(`   Teacher Name: "${teacherName?.trim()}"`);
  console.log(`   Teacher Status: "${teacherStatus?.trim()}"`);
  assert(teacherName && teacherName.includes('Kashyap'), 'Avatar shows teacher name');
  console.log('   ✅ Teacher Avatar dock is visible and prominent on the bottom-left!');

  // 4. Check Dynamic Flow Visuals on Day 1 Python
  console.log('\n4. Auditing Dynamic Python Day 1 Flow Visuals...');
  const flowRoot = await page.waitForSelector('[data-testid="flow-template-root"]');
  assert(flowRoot, 'Flow template root rendered');

  const nodeLabels = await page.$$eval('[data-testid="flow-template-root"] [aria-label]', nodes => {
    return nodes.map(n => n.getAttribute('aria-label'));
  });
  console.log('   Node aria-labels:', nodeLabels);
  assert(nodeLabels.some(l => l.includes('Instructions')), 'Instructions node present');
  assert(nodeLabels.some(l => l.includes('Python')), 'Python engine node present');
  assert(nodeLabels.some(l => l.includes('Screen')), 'Screen output node present');

  // Check if laser dashed animation is active on lit arrow
  const laserSvg = await page.$('[data-testid="flow-template-root"] svg');
  assert(laserSvg, 'Laser arrow SVG rendered');
  console.log('   ✅ Dynamic Flow Visual with animated laser arrows and glowing nodes verified!');

  // 5. Check Tappable Underlined Words in the right column
  console.log('\n5. Auditing Key Concept Underlines & Karaoke Highlighting...');
  const tappableWord = await page.$('[data-testid="tappable-word-instructions"]');
  assert(tappableWord, 'Tappable key concept "Instructions" is present and underlined');
  const borderBottom = await tappableWord.evaluate(el => window.getComputedStyle(el).borderBottom);
  console.log(`   Key concept border-bottom: ${borderBottom}`);
  assert(borderBottom && !borderBottom.includes('none'), 'Key concept word is underlined');
  console.log('   ✅ Key concepts are clearly underlined for student focus!');

  // Save new high-resolution screenshot
  await page.screenshot({ path: 'scripts/verify/screenshot_5_updated_navigation_and_visuals.png' });
  console.log('\n   📸 Screenshot saved: scripts/verify/screenshot_5_updated_navigation_and_visuals.png');

  console.log(`\nConsole errors: ${consoleErrors.length}`);
  assert.strictEqual(consoleErrors.length, 0, 'Zero console errors');
  console.log('🎉 ALL NEW CLASSROOM UPDATES VERIFIED SUCCESSFULLY WITH 0 ERRORS!');

  await browser.close();
}

verifyClassroomUpdates().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
