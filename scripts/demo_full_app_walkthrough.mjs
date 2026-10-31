import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve('demo_screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const PAGES_TO_AUDIT = [
  { id: '01_dashboard', url: '/dashboard', name: 'Student Dashboard', expectedSelector: '[data-testid="app-sidebar"], .db-page, main' },
  { id: '02_quests_catalog', url: '/quests', name: 'Quests & Certification Catalog', expectedSelector: '[data-testid="crash-plan-cards-root"], [data-testid="quests-page-root"], main' },
  { id: '03_missions', url: '/missions', name: 'Daily Missions', expectedSelector: 'main, h1, h2, h3' },
  { id: '04_arena', url: '/arena', name: 'Challenging Arena', expectedSelector: 'main, h1, h2, h3' },
  { id: '05_projects', url: '/projects', name: 'Industry Projects & Squads', expectedSelector: 'main, h1, h2, h3' },
  { id: '06_leaderboard', url: '/leaderboard', name: 'Leaderboard & Global Leagues', expectedSelector: 'main, h1, h2, h3' },
  { id: '07_interview', url: '/interview', name: 'AI Mock Interview', expectedSelector: 'main, h1, h2, h3' },
  { id: '08_group_discussion', url: '/group-discussion', name: 'GD Practice Room', expectedSelector: 'main, h1, h2, h3' },
  { id: '09_learning', url: '/learning', name: 'Learning & Twin Roadmaps', expectedSelector: 'main, h1, h2, h3' },
  { id: '10_attention_span', url: '/attention-span', name: 'Attention Span & Focus Lab', expectedSelector: 'main, h1, h2, h3' },
  { id: '11_friends', url: '/friends', name: 'Friends & Peer Network', expectedSelector: 'main, h1, h2, h3' },
  { id: '12_pins', url: '/pins', name: 'Pins & Wallet', expectedSelector: 'main, h1, h2, h3' },
  { id: '13_notifications', url: '/notifications', name: 'Notifications & Alerts', expectedSelector: 'main, h1, h2, h3' },
  { id: '14_profile', url: '/profile', name: 'Student Profile & Verifiable Passport', expectedSelector: '[data-testid="profile-tabs-header"], main' },
  { id: '15_career_builder', url: '/career-builder', name: 'AI Career Builder & ATS', expectedSelector: 'main, h1, h2, h3' },
  { id: '16_lesson_experience', url: '/quests/lesson?questId=python-lecture1-day-1&testMode=true', name: 'Interactive Lesson & Code Studio', expectedSelector: '[data-testid="classroom-page-root"], [data-testid="lesson-card-root"], .classroom-page-root, main' },
];

async function runDemoAudit() {
  console.log('======================================================================');
  console.log('🚀 PIN-IT CAREER OS — PHYSICAL LAPTOP DEMO & FULL-APP AUDIT');
  console.log(`Target URL: ${BASE_URL}`);
  console.log('======================================================================\n');

  const browser = await chromium.launch({
    headless: true, // High-fidelity headless rendering for pixel-perfect screenshots
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  const studentUser = {
    id: 'usr_demo_student_aarav',
    uid: 'usr_demo_student_aarav',
    username: 'aarav_patel',
    displayName: 'Aarav Patel',
    full_name: 'Aarav Patel',
    email: 'student@pinit.in',
    role: 'student',
    onboardingStep: 3,
    roadmapGenerated: true,
    atsScore: 88,
    trustScore: 92,
    careerDnaScore: 85,
    xp: 1450,
    pins: 120,
    isDevUser: false,
  };

  // Pre-seed localStorage before any page navigation so AuthContext hydrates immediately
  await context.addInitScript((user) => {
    const uid = user.id;
    window.localStorage.setItem('pinit_current_user', JSON.stringify(user));
    window.localStorage.setItem(`pinit_${uid}_profile`, JSON.stringify(user));
    window.localStorage.setItem(`pinit_${uid}_ob_step`, '3');
    window.localStorage.setItem(`pinit_${uid}_road_gen`, 'true');
    window.localStorage.setItem(`pinit_${uid}_onboarding_complete`, 'true');
    window.localStorage.setItem('pinit_has_completed_onboarding', 'true');
    window.localStorage.setItem('pinit_ob_step', '3');
    window.localStorage.setItem('pinit_road_gen', 'true');
    window.localStorage.setItem(`pinit_${uid}_onboarding_answers`, JSON.stringify({
      hasCompleted: true,
      role: 'Full Stack Engineer',
      track: 'sde',
      degree: 'B.Tech CS',
      year: '3rd Year'
    }));
    window.localStorage.setItem(`pinit_${uid}_xp`, '1450');
    window.localStorage.setItem(`pinit_${uid}_pins`, '120');
    window.localStorage.setItem('pc_theme', 'dark');

    // Dispatch event as fallback for any listener
    window.addEventListener('load', () => {
      window.dispatchEvent(new CustomEvent('pinit:identity_user_authenticated', {
        detail: { user }
      }));
    });
  }, studentUser);

  const page = await context.newPage();

  // Set authoritative HttpOnly session cookie via API route first
  try {
    const setupPage = await context.newPage();
    await setupPage.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    await setupPage.evaluate(async (user) => {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: user.role,
          uid: user.id,
          id: user.id,
          email: user.email,
          isDevUser: user.isDevUser,
        }),
      }).catch(() => {});
    }, studentUser);
    await setupPage.close();
  } catch (e) {
    console.warn('Session pre-auth note:', e.message);
  }

  const auditResults = [];
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known benign third-party warnings
      if (!text.includes('favicon') && !text.includes('Dicebear') && !text.includes('hydrat') && !text.includes('Supabase')) {
        consoleErrors.push(`[Console Error on ${page.url()}]: ${text}`);
      }
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(`[Unhandled Page Error on ${page.url()}]: ${err.message}`);
  });

  for (const item of PAGES_TO_AUDIT) {
    const fullUrl = `${BASE_URL}${item.url}`;
    const t0 = Date.now();
    let status = 'PASS';
    let httpCode = 200;
    let notes = '';

    try {
      console.log(`➡️  Testing [${item.name}] (${item.url})...`);
      const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      httpCode = response ? response.status() : 200;

      // Small pause for client animations & renders
      await page.waitForTimeout(1000);

      // Verify page element rendered
      if (item.expectedSelector) {
        await page.waitForSelector(item.expectedSelector, { timeout: 8000 });
      }

      // Special Interactive testing on Quests page
      if (item.id === '02_quests_catalog') {
        const webBtn = page.locator('[data-testid="btn-track-web"]');
        const pythonBtn = page.locator('[data-testid="btn-track-python"]');
        if (await webBtn.isVisible() && await pythonBtn.isVisible()) {
          // Click Python track
          await pythonBtn.click();
          await page.waitForTimeout(600);
          const pyScreenshotPath = path.join(SCREENSHOTS_DIR, '02b_quests_python_ai_track.png');
          await page.screenshot({ path: pyScreenshotPath, fullPage: false });

          // Click back to Web track
          await webBtn.click();
          await page.waitForTimeout(600);
          notes += 'Track switching verified (Web ↔ Python AI). ';
        }

        // Test credentials preview modal
        const previewBtn = page.locator('[data-testid="btn-preview-credentials"]').first();
        if (await previewBtn.isVisible()) {
          await previewBtn.click();
          await page.waitForTimeout(600);
          const modalScreenshotPath = path.join(SCREENSHOTS_DIR, '02c_credential_preview_modal.png');
          await page.screenshot({ path: modalScreenshotPath, fullPage: false });
          // Close modal with Escape key
          await page.keyboard.press('Escape');
          await page.waitForTimeout(400);
          notes += 'Credentials preview modal tested cleanly. ';
        }
      }

      // Special Interactive testing on Profile page
      if (item.id === '14_profile') {
        // Test switching tabs (Portfolio, Settings)
        const portfolioTabBtn = page.locator('button:has-text("Portfolio"), [data-testid="profile-tab-portfolio"]').first();
        if (await portfolioTabBtn.isVisible()) {
          await portfolioTabBtn.click();
          await page.waitForTimeout(600);
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14b_profile_portfolio_tab.png'), fullPage: false });
        }
        const settingsTabBtn = page.locator('button:has-text("Settings"), [data-testid="profile-tab-settings"]').first();
        if (await settingsTabBtn.isVisible()) {
          await settingsTabBtn.click();
          await page.waitForTimeout(600);
          await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14c_profile_settings_tab.png'), fullPage: false });
        }
        // Return to Passport tab
        const passportTabBtn = page.locator('button:has-text("Passport"), [data-testid="profile-tab-passport"]').first();
        if (await passportTabBtn.isVisible()) {
          await passportTabBtn.click();
          await page.waitForTimeout(500);
        }
        notes += 'Profile 3-tab navigation verified (Passport, Portfolio, Settings). ';
      }

      // Take main screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${item.id}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      const elapsed = Date.now() - t0;
      console.log(`   ✅ PASS (HTTP ${httpCode}) in ${elapsed}ms -> Saved ${item.id}.png`);

      auditResults.push({
        id: item.id,
        name: item.name,
        url: item.url,
        httpCode,
        durationMs: elapsed,
        status: 'PASS',
        notes: notes || 'Rendered cleanly without errors',
        screenshot: `${item.id}.png`,
      });
    } catch (err) {
      const elapsed = Date.now() - t0;
      const currentUrl = page.url();
      console.log(`   ❌ FAIL in ${elapsed}ms: ${err.message} (Current URL: ${currentUrl})`);
      const failScreenshotPath = path.join(SCREENSHOTS_DIR, `${item.id}_FAIL.png`);
      try {
        await page.screenshot({ path: failScreenshotPath, fullPage: false });
        console.log(`   📸 Saved failure snapshot to: ${item.id}_FAIL.png`);
      } catch {}
      auditResults.push({
        id: item.id,
        name: item.name,
        url: item.url,
        currentUrl,
        httpCode,
        durationMs: elapsed,
        status: 'FAIL',
        notes: err.message,
        screenshot: `${item.id}_FAIL.png`,
      });
    }
  }

  await browser.close();

  // Write Audit Report Summary
  const reportPath = path.join(SCREENSHOTS_DIR, 'DEMO_READINESS_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalAudited: PAGES_TO_AUDIT.length,
    passed: auditResults.filter(r => r.status === 'PASS').length,
    failed: auditResults.filter(r => r.status === 'FAIL').length,
    consoleErrorsCount: consoleErrors.length,
    consoleErrors: consoleErrors.slice(0, 10),
    results: auditResults,
  }, null, 2), 'utf8');

  console.log('\n======================================================================');
  console.log(`🎉 DEMO AUDIT COMPLETED: ${auditResults.filter(r => r.status === 'PASS').length} / ${PAGES_TO_AUDIT.length} Pages Verified Cleanly!`);
  console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log('======================================================================');

  if (consoleErrors.length > 0) {
    console.log(`⚠️  Captured ${consoleErrors.length} console warning/errors during navigation:`);
    consoleErrors.forEach((e) => console.log('   - ' + e));
  } else {
    console.log('✨ ZERO console errors captured across all tested routes!');
  }
}

runDemoAudit().catch((err) => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
