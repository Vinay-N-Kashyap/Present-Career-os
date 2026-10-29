import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

import { GET as sessionGet } from '../../src/app/api/auth/session/route';
import { GET as faceEnrolledGet } from '../../src/app/api/auth/face/enrolled/route';
import { POST as genCustomSkillPost } from '../../src/app/api/missions/generate-custom-skill/route';
import { POST as commEvalPost } from '../../src/app/api/communication/evaluate/route';
import { POST as cacheClearPost } from '../../src/app/api/cache/clear/route';
import { POST as rolloutFeedbackPost } from '../../src/app/api/settings/rollout/feedback/route';
import { POST as migrationValidatePost } from '../../src/app/api/settings/migration/validate/route';
import { POST as migrationExecutePost } from '../../src/app/api/settings/migration/execute/route';
import { POST as erpSyncPost } from '../../src/app/api/settings/erp/sync/route';
import { GET as recruiterLogsGet, POST as recruiterLogsPost } from '../../src/app/api/recruiter/activity-log/route';
import { GET as recruiterAnalyticsGet } from '../../src/app/api/recruiter/analytics/route';
import { GET as recruiterJobsGet, POST as recruiterJobsPost } from '../../src/app/api/recruiter/jobs/route';
import { POST as resumeUploadPost } from '../../src/app/api/resume/upload/route';
import { POST as resumeFromVaultPost } from '../../src/app/api/resume/generate-from-vault/route';
import { GET as teacherStudentsGet } from '../../src/app/api/teacher/students/route';
import { POST as teacherTrainingSubmitPost } from '../../src/app/api/teacher/training/submit/route';
import { GET as univDashboardGet } from '../../src/app/api/university/dashboard/route';
import { GET as univEmployabilityGet } from '../../src/app/api/university/employability-report/route';
import { GET as univSkillGapsGet } from '../../src/app/api/university/skill-gaps/route';

let passed = 0;
let failed = 0;

function check(label: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ✅ [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${label}${detail ? ': ' + detail : ''}`);
    failed++;
  }
}

async function run() {
  console.log('========================================================================');
  console.log('🚀 FULL 3-PORTAL END-TO-END VERIFICATION SUITE');
  console.log('========================================================================\n');

  // ── 0. GLOBAL MIDDLEWARE & SESSION HANDSHAKE ──
  console.log('── 0. Global Middleware & Session Handshake ──');
  const mw = fs.readFileSync(path.resolve(process.cwd(), 'src/middleware.ts'), 'utf8');
  check('Middleware does not block public /admissions showcase', !mw.includes("'/admissions',"));
  check('Middleware does not block /university showcase', !mw.includes("'/university',"));
  check('Middleware honors pinit_session + pinit_uid cookies', mw.includes('hasHttpOnlySession'));
  check('Middleware handles dev-bypass-authorized without falling into jwtVerify', mw.includes("token === 'dev-bypass-authorized'"));

  const sessRes = await sessionGet(new NextRequest('http://localhost:3000/api/auth/session'));
  const sessJson = await sessRes.json();
  check('GET /api/auth/session returnsboth active and authenticated keys', 'active' in sessJson && 'authenticated' in sessJson);

  // ── 1. 1ST PRIORITY: STUDENT PORTAL (LEFT SIDEBAR) ──
  console.log('\n── 1. 1st Priority: Student Portal (Left Sidebar) ──');
  const missionsPanel = fs.readFileSync(path.resolve(process.cwd(), 'src/components/student/dashboard/DashboardMissionsPanel.tsx'), 'utf8');
  check('DashboardMissionsPanel routes practice/debug to /arena (not 404 /challenges)', !missionsPanel.includes("'/challenges'") && missionsPanel.includes("'/arena'"));
  check('DashboardMissionsPanel routes communication to /interview (not 404 /interview-prep)', !missionsPanel.includes("'/interview-prep'") && missionsPanel.includes("'/interview'"));
  check('DashboardMissionsPanel toggleComplete supports mission_ prefix IDs', missionsPanel.includes("id.startsWith('mission_')"));

  const appShell = fs.readFileSync(path.resolve(process.cwd(), 'src/components/ui/AppShell.tsx'), 'utf8');
  check('AppShell scopes Study Notebook questId by course + day on /quests/lesson', appShell.includes("const courseParam = params.get('course') || params.get('prefix')") && appShell.includes("courseParam ? `${courseParam}_day_${dayParam || '1'}`"));

  const arenaPage = fs.readFileSync(path.resolve(process.cwd(), 'src/app/arena/page.tsx'), 'utf8');
  check('Arena page uses toast.error instead of raw alert()', !arenaPage.includes("alert('Submission error:") && arenaPage.includes("toast.error("));
  check('Arena page renders Hackathons & AI Viva tabs cleanly', arenaPage.includes("(activeTab === 'all' || activeTab === 'hackathons')") && arenaPage.includes("(activeTab === 'all' || activeTab === 'viva')"));

  const faceRes = await faceEnrolledGet(new NextRequest('http://localhost:3000/api/auth/face/enrolled'));
  const faceJson = await faceRes.json();
  check('GET /api/auth/face/enrolled returns 200 with enrolled boolean', faceRes.status === 200 && typeof faceJson.enrolled === 'boolean');

  const skillRes = await genCustomSkillPost(new NextRequest('http://localhost:3000/api/missions/generate-custom-skill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skill: 'Distributed Caching' }),
  }));
  const skillJson = await skillRes.json();
  check('POST /api/missions/generate-custom-skill generates custom mission', skillRes.status === 200 && skillJson.ok === true && Array.isArray(skillJson.modules));

  const commRes = await commEvalPost(new NextRequest('http://localhost:3000/api/communication/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'First, we analyzed the root cause because latency increased by 25%. Therefore, we deployed a read replica to resolve the bottleneck.' }),
  }));
  const commJson = await commRes.json();
  check('POST /api/communication/evaluate returns scores, rewrites, and feedback for LinguaLab', commRes.status === 200 && commJson.ok === true && commJson.scores?.average > 0 && !!commJson.rewrites?.executive);

  // ── 2. 2ND PRIORITY: ADMIN PORTAL ──
  console.log('\n── 2. 2nd Priority: Admin Portal ──');
  const adminPage = fs.readFileSync(path.resolve(process.cwd(), 'src/app/admin/page.tsx'), 'utf8');
  const adminShell = fs.readFileSync(path.resolve(process.cwd(), 'src/components/admin/AdminDashboardShell.tsx'), 'utf8');
  check('/admin/page.tsx passes activeTab into AdminDashboardShell', adminPage.includes('<AdminDashboardShell activeTab={tabParam}'));
  check('AdminDashboardShell renders all operational & management tabs inside main shell', adminShell.includes('<AdmissionsTab />') && adminShell.includes('<DocumentsTab />') && adminShell.includes('<BroadcastTab />') && adminShell.includes('<MaintenanceTab />'));
  check('AdminDashboardShell preserves portalService.getEnrolledStudents() CSV export', adminShell.includes('portalService.getEnrolledStudents()'));

  const sidebar = fs.readFileSync(path.resolve(process.cwd(), 'src/components/ui/AppSidebar.tsx'), 'utf8');
  check('ADMIN_NAV links to /campus-admin (All 34 Governance Studios)', sidebar.includes("href: '/campus-admin'"));
  check('ADMIN_NAV differentiates /admin/settings?tab=migration and /admin/settings?tab=erp', sidebar.includes("'/admin/settings?tab=migration'") && sidebar.includes("'/admin/settings?tab=erp'"));
  check('ADMIN_NAV differentiates /university?tab=reports', sidebar.includes("'/university?tab=reports'"));

  const campusGate = fs.readFileSync(path.resolve(process.cwd(), 'src/components/admin/CampusAdminRoleGate.tsx'), 'utf8');
  check('CampusAdminRoleGate blocks logged-in non-admin roles with 403', campusGate.includes('403 — Institutional Administrator Access Required') && campusGate.includes('!ALLOWED_ADMIN_ROLES.includes(userRole)'));

  const cacheRes = await cacheClearPost();
  check('POST /api/cache/clear returns 200 ok', cacheRes.status === 200 && (await cacheRes.json()).ok === true);

  const fbRes = await rolloutFeedbackPost(new Request('http://localhost:3000/api/settings/rollout/feedback', {
    method: 'POST',
    body: JSON.stringify({ phase: 'Phase 1', note: 'Smooth rollout' }),
  }));
  check('POST /api/settings/rollout/feedback returns 200 ok', fbRes.status === 200 && (await fbRes.json()).ok === true);

  const migValRes = await migrationValidatePost(new Request('http://localhost:3000/api/settings/migration/validate', {
    method: 'POST',
    body: JSON.stringify({ rows: [{ name: 'Student 1', email: 'student1@pinit.in' }] }),
  }));
  check('POST /api/settings/migration/validate validates rows', migValRes.status === 200 && (await migValRes.json()).ok === true);

  const migExecRes = await migrationExecutePost(new Request('http://localhost:3000/api/settings/migration/execute', {
    method: 'POST',
    body: JSON.stringify({ rows: [{ name: 'Student 1', email: 'student1@pinit.in' }] }),
  }));
  check('POST /api/settings/migration/execute returns migrated count', migExecRes.status === 200 && (await migExecRes.json()).count === 1);

  const erpRes = await erpSyncPost(new Request('http://localhost:3000/api/settings/erp/sync', {
    method: 'POST',
    body: JSON.stringify({ provider: 'SAP' }),
  }));
  check('POST /api/settings/erp/sync returns 200 ok', erpRes.status === 200 && (await erpRes.json()).ok === true);

  const recAnalyticsRes = await recruiterAnalyticsGet();
  const recJobsRes = await recruiterJobsGet();
  const recLogsRes = await recruiterLogsGet();
  const recPostJobRes = await recruiterJobsPost(new Request('http://localhost:3000/api/recruiter/jobs', {
    method: 'POST',
    body: JSON.stringify({ title: 'Platform Engineer' }),
  }));
  const recPostLogRes = await recruiterLogsPost(new Request('http://localhost:3000/api/recruiter/activity-log', {
    method: 'POST',
    body: JSON.stringify({ text: 'Created job' }),
  }));
  check('Recruiter API endpoints (/analytics, /jobs, /activity-log) return 200 ok', recAnalyticsRes.status === 200 && recJobsRes.status === 200 && recLogsRes.status === 200 && recPostJobRes.status === 200 && recPostLogRes.status === 200);

  const resUpload = await resumeUploadPost(new Request('http://localhost:3000/api/resume/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Built TypeScript React microservices reducing latency by 45%.', fileName: 'cv.pdf' }),
  }));
  const resVault = await resumeFromVaultPost(new Request('http://localhost:3000/api/resume/generate-from-vault', {
    method: 'POST',
    body: JSON.stringify({ targetRole: 'Backend Engineer' }),
  }));
  check('Resume API endpoints (/upload, /generate-from-vault) return 200 ok', resUpload.status === 200 && resVault.status === 200);

  const uDash = await univDashboardGet();
  const uEmp = await univEmployabilityGet();
  const uGaps = await univSkillGapsGet();
  check('University API endpoints (/dashboard, /employability-report, /skill-gaps) return 200 ok', uDash.status === 200 && uEmp.status === 200 && uGaps.status === 200);

  // ── 3. 3RD PRIORITY: TEACHER PORTAL ──
  console.log('\n── 3. 3rd Priority: Teacher Portal ──');
  const teacherDash = fs.readFileSync(path.resolve(process.cwd(), 'src/components/teacher/TeacherDashboard.tsx'), 'utf8');
  const studioMatches = teacherDash.match(/path:\s*'\/teacher\/[a-z0-9-]+'/g) || [];
  check(`ALL_FACULTY_STUDIOS contains all 34 studios (found ${studioMatches.length})`, studioMatches.length === 34);
  check('TeacherDashboard includes Academic Mentoring Tools links', teacherDash.includes('Academic Mentoring Tools') && teacherDash.includes("href: '/quests/teacher-select'"));
  check('TeacherDashboard does not hardcode fallback 2 for pendingGradesCount', !teacherDash.includes('pending > 0 ? pending : 2'));

  const teacherLayout = fs.readFileSync(path.resolve(process.cwd(), 'src/app/teacher/layout.tsx'), 'utf8');
  check('TeacherLayout provides Back to Faculty & Teacher Portal return bar on sub-studios', teacherLayout.includes('← Back to Faculty & Teacher Portal'));

  const batchAnalytics = fs.readFileSync(path.resolve(process.cwd(), 'src/components/teacher/BatchAnalyticsView.tsx'), 'utf8');
  check('BatchAnalyticsView Export CSV Report button has working onClick handler', batchAnalytics.includes('batch_analytics_') && batchAnalytics.includes('URL.createObjectURL(blob)'));

  const teacherSelect = fs.readFileSync(path.resolve(process.cwd(), 'src/app/quests/teacher-select/page.tsx'), 'utf8');
  check('/quests/teacher-select defaults questId to python instead of bouncing to /quests', teacherSelect.includes("searchParams.get('questId') || 'python'"));

  const tStudRes = await teacherStudentsGet();
  const tTrainRes = await teacherTrainingSubmitPost(new Request('http://localhost:3000/api/teacher/training/submit', {
    method: 'POST',
    body: JSON.stringify({ teacherId: 'priya', moduleId: 'mod-proctor', score: 100 }),
  }));
  check('Teacher API endpoints (/api/teacher/students, /api/teacher/training/submit) return 200 ok', tStudRes.status === 200 && tTrainRes.status === 200);

  console.log('\n========================================================================');
  console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('========================================================================\n');

  if (failed > 0) process.exit(1);
}

run().catch(err => {
  console.error('Fatal error in E2E suite:', err);
  process.exit(1);
});
