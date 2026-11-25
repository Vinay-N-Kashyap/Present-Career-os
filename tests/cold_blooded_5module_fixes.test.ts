import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { GET as getDashboardAnalytics } from '../src/app/api/analytics/dashboard/route';
import { POST as postAttentionLeaderboard } from '../src/app/api/attention-span/leaderboard/route';
import { syncAuthoritativeTrustScore, getLocalTrustScore } from '../src/lib/trust/trustEngine';
import { extractCanonicalUserId, ArenaPvPStore } from '../src/lib/services/arenaPvPStore';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';

const ROOT = process.cwd();

test('Audit #1 & Task 2: Dashboard API rejects unauthenticated / pinit_uid cookie-only IDOR requests with 401', async () => {
  const req = new NextRequest('http://localhost/api/analytics/dashboard', {
    headers: { cookie: 'pinit_uid=victim-student-uuid' },
  });
  const res = await getDashboardAnalytics(req);
  assert.equal(res.status, 401, 'Dashboard analytics MUST return 401 without verified bearer session');

  const routeSrc = fs.readFileSync(path.join(ROOT, 'src/app/api/analytics/dashboard/route.ts'), 'utf8');
  assert.equal(routeSrc.includes("req.cookies.get('pinit_uid')"), false, 'Unsigned pinit_uid cookie fallback must be removed');
  assert.equal(routeSrc.includes('Math.round(atsScore * 0.4)'), false, 'Fake 0.4x history fabrication must be removed');
  assert.ok(routeSrc.includes('telemetry:'), 'Dashboard API must expose full live telemetry snapshot');
});

test('Task 2 & Audit #9: Authoritative Trust sync overrides stale localStorage and Dashboard syncs live telemetry cleanly', () => {
  const uid = 'dash_sync_user_1';
  const prevWin = (globalThis as any).window;
  const store = new Map<string, string>([[`pinit_trust_score_${uid}`, '33']]);
  (globalThis as any).window = {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => { store.set(k, v); },
    },
  };
  try {
    // Stale browser cache had 33, DB now says 68
    const synced = syncAuthoritativeTrustScore(uid, 68);
    assert.equal(synced, 68);
    assert.equal(getLocalTrustScore(uid, 50), 68);
  } finally {
    if (prevWin === undefined) delete (globalThis as any).window;
    else (globalThis as any).window = prevWin;
  }

  const dashPage = fs.readFileSync(path.join(ROOT, 'src/app/dashboard/page.tsx'), 'utf8');
  const hud = fs.readFileSync(path.join(ROOT, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf8');
  const bento = fs.readFileSync(path.join(ROOT, 'src/components/student/dashboard/DashboardBentoGrid.tsx'), 'utf8');
  const shell = fs.readFileSync(path.join(ROOT, 'src/components/student/StudentDashboardShell.tsx'), 'utf8');

  assert.ok(dashPage.includes("fetch('/api/analytics/dashboard'"), 'Dashboard must hydrate directly from /api/analytics/dashboard');
  assert.ok(dashPage.includes('syncAuthoritativeTrustScore'), 'Dashboard must overwrite stale local trust cache with DB value');
  assert.equal(dashPage.includes("window.addEventListener('focus'"), false, 'Dashboard must throttle visibilitychange instead of refetching on every focus');
  assert.ok(hud.includes('hasLiveTelemetry && typeof trustScore'), 'HeaderHUD must prioritize authoritative live telemetry');
  assert.equal(bento.includes('Math.max(100, Math.round(rawUserElo))'), false, 'BentoGrid must not clamp sub-100 ELO up to 100 while HUD shows real ELO');
  assert.equal(shell.includes('Rahul Sharma'), false, 'StudentDashboardShell must not have hardcoded placeholder Rahul Sharma');
});

test('Audit #2, #3, #6, #10: Arena matchmaking strips device suffix, dedupes settlement, guards forfeit & drops client DB writes', async () => {
  const uuid = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  assert.equal(extractCanonicalUserId(`${uuid}_dev9988a`), uuid, 'Must strip _device suffix from UUID');
  assert.equal(extractCanonicalUserId(uuid), uuid);

  // Matchmaking pair test: even with device-suffixed queue tickets, created room must hold clean userId!
  const q1 = await ArenaPvPStore.matchmake(
    { studentId: `${uuid}_devA`, userId: uuid, studentName: 'Player One', difficulty: 'basic', eloRating: 120, enqueuedAt: Date.now() },
    'war_two_sum_01'
  );
  assert.equal(q1.matched, false);

  // Same user on second device must NOT match themselves!
  const selfMatch = await ArenaPvPStore.matchmake(
    { studentId: `${uuid}_devB`, userId: uuid, studentName: 'Player One Alt', difficulty: 'basic', eloRating: 120, enqueuedAt: Date.now() },
    'war_two_sum_01'
  );
  assert.equal(selfMatch.matched, false, 'Same user account on two devices must not self-match');

  const uuid2 = 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e';
  const q2 = await ArenaPvPStore.matchmake(
    { studentId: `${uuid2}_devC`, userId: uuid2, studentName: 'Player Two', difficulty: 'basic', eloRating: 115, enqueuedAt: Date.now() },
    'war_two_sum_01'
  );
  assert.equal(q2.matched, true);
  assert.equal(q2.room?.hostId, uuid, 'Room hostId must be canonical UUID without _dev suffix');
  assert.equal(q2.room?.guestId, uuid2, 'Room guestId must be canonical UUID without _dev suffix');

  const roomRoute = fs.readFileSync(path.join(ROOT, 'src/app/api/arena/room/[roomCode]/route.ts'), 'utf8');
  assert.ok(roomRoute.includes('MATCH_NOT_IN_PROGRESS'), 'forfeit action must be blocked when match is not in_progress');

  const arenaPage = fs.readFileSync(path.join(ROOT, 'src/app/arena/page.tsx'), 'utf8');
  const lbPage = fs.readFileSync(path.join(ROOT, 'src/app/leaderboard/page.tsx'), 'utf8');
  assert.equal(arenaPage.includes("supabase.from('users').update({ arena_elo: 100 })"), false, 'Browser must not directly update users.arena_elo');
  assert.equal(lbPage.includes("supabase.from('users').update({ arena_elo: 100 })"), false, 'Leaderboard browser must not directly update users.arena_elo');
});

test('Audit #4 & #7: No retired 404 Groq models remain in Interview/GD APIs and Trust reward requires >=35% non-eliminated score', () => {
  const assist = fs.readFileSync(path.join(ROOT, 'src/app/api/interview/assist/route.ts'), 'utf8');
  const genProb = fs.readFileSync(path.join(ROOT, 'src/app/api/interview/generate-problem/route.ts'), 'utf8');
  const gdEval = fs.readFileSync(path.join(ROOT, 'src/app/api/group-discussion/evaluate/route.ts'), 'utf8');
  const ivEval = fs.readFileSync(path.join(ROOT, 'src/app/api/interview/evaluate/route.ts'), 'utf8');

  for (const [name, src] of [['assist', assist], ['generate-problem', genProb], ['gd/evaluate', gdEval]]) {
    assert.equal(/'llama-3\.3-70b-versatile'|'llama-3\.1-8b-instant'/.test(src), false, `${name} still invokes retired Groq 404 model`);
    assert.ok(src.includes('qwen/qwen3.8-27b'), `${name} must use active qwen/qwen3.8-27b model`);
  }
  assert.ok(gdEval.includes('generativelanguage.googleapis.com'), 'GD evaluate must include Gemini failover before heuristic fallback');
  assert.ok(ivEval.includes('!isEliminated && finalEvaluation.score >= 35'), 'Interview Trust +3 award must require >=35% non-eliminated score');
});

test('Audit #5 & #8: Leaderboard bounds mastery query to visible rows and Attention leaderboard blocks anonymous/spam farming', async () => {
  const lbRoute = fs.readFileSync(path.join(ROOT, 'src/app/api/leaderboard/route.ts'), 'utf8');
  assert.ok(lbRoute.includes("if (mode === 'verified_evidence' && userIds.length > 0 && admin)"), 'Must skip 10k mastery loop unless sorting by verified_evidence');
  assert.ok(lbRoute.includes('entries.slice(0, 100)'), 'Must cap returned entries to top 100 + caller');
  assert.ok(lbRoute.includes('sourceRows'), 'Off-cohort rank resolution must reuse already-fetched cohort rows instead of second 10k query');

  const unauthRes = await postAttentionLeaderboard(new Request('http://localhost/api/attention-span/leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accuracyEarned: 100 }),
  }));
  assert.equal(unauthRes.status, 401, 'Attention leaderboard POST must require auth');

  const attnRoute = fs.readFileSync(path.join(ROOT, 'src/app/api/attention-span/leaderboard/route.ts'), 'utf8');
  const attnProgress = fs.readFileSync(path.join(ROOT, 'src/lib/attention/progress.ts'), 'utf8');
  assert.ok(attnRoute.includes('RATE_LIMIT_COOLDOWN'), 'Attention leaderboard must enforce per-round cooldown');
  assert.ok(attnProgress.includes('DAILY_ACCURACY_CAP_REACHED'), 'Attention progress must enforce daily accuracy cap');
});
