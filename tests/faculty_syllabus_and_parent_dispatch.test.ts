/**
 * Faculty Syllabus & Parent Dispatch Verification Audit Suite (TASK-880)
 * 
 * Tests:
 * 1. Syllabus credit and contact hour invariants (L-T-P structure, 16 weeks).
 * 2. Weekly delivery velocity, delay diagnostics, and NAAC CSV export.
 * 3. Ephemeral parent magic link HMAC-SHA256 generation, expiration & tamper defense.
 * 4. Multi-channel dispatch payload formatting, rate-limiting & multi-tenant isolation.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createCourseSyllabus,
  recordWeeklyProgress,
  computeSyllabusVelocity,
  exportLessonPlanCSV,
  WeeklyLessonPlan,
} from '../src/lib/teacher/syllabus.js';
import {
  generateParentMagicToken,
  validateParentMagicToken,
  buildParentNotification,
  parentNotificationStore,
  ParentContact,
} from '../src/lib/admin/parentNotifications.js';

describe('TASK-880: Faculty Syllabus & Parent Dispatch Verification Audit Suite', () => {
  beforeEach(() => {
    parentNotificationStore.clear();
  });

  const generateMock16Weeks = (hoursPerWeek: number = 4): WeeklyLessonPlan[] => {
    const list: WeeklyLessonPlan[] = [];
    for (let i = 1; i <= 16; i++) {
      list.push({
        weekNumber: i,
        moduleId: `mod-${Math.ceil(i / 3.2)}`,
        theme: `Semester Topic Week ${i}`,
        topicsCovered: [`Theory Topic ${i}`],
        labPracticalTopics: [`Lab Practical ${i}`],
        plannedHours: hoursPerWeek,
        deliveredHours: 0,
        status: 'SCHEDULED',
      });
    }
    return list;
  };

  it('strictly validates credit sum and contact hour invariants', () => {
    const weeks = generateMock16Weeks(4); // 16 * 4 = 64 hours

    // Lecture 3 (45h) + Lab 1 (30h) = 75h != 64h -> should fail HOURS_ALLOCATION_INVARIANT
    assert.throws(() => {
      createCourseSyllabus({
        institutionId: 'inst-apex-001',
        facultyId: 'fac-prof-rao',
        courseCode: 'CS401',
        courseTitle: 'Distributed Systems',
        department: 'CSE',
        semester: 6,
        academicYear: '2026-2027',
        totalCredits: 4,
        lectureCredits: 3,
        labCredits: 1, // Expects 45 + 30 = 75 contact hours
        clos: [],
        modules: [],
        weeklyPlan: weeks, // Sums to 64
      });
    }, /HOURS_ALLOCATION_INVARIANT/);

    // Credit mismatch: total 5, but 3 + 1 = 4
    assert.throws(() => {
      createCourseSyllabus({
        institutionId: 'inst-apex-001',
        facultyId: 'fac-prof-rao',
        courseCode: 'CS401',
        courseTitle: 'Distributed Systems',
        department: 'CSE',
        semester: 6,
        academicYear: '2026-2027',
        totalCredits: 5,
        lectureCredits: 3,
        labCredits: 1,
        clos: [],
        modules: [],
        weeklyPlan: weeks,
      });
    }, /CREDIT_MISMATCH_INVARIANT/);
  });

  it('correctly creates valid 4-credit course syllabus (75 contact hours)', () => {
    // 3 lecture credits (45h) + 1 lab credit (30h) = 75 hours
    // 11 weeks with 5 hours (55h) + 5 weeks with 4 hours (20h) = 75 hours
    const weeks: WeeklyLessonPlan[] = [];
    for (let i = 1; i <= 16; i++) {
      weeks.push({
        weekNumber: i,
        moduleId: 'mod-1',
        theme: `Topic ${i}`,
        topicsCovered: ['Lecture'],
        labPracticalTopics: ['Lab'],
        plannedHours: i <= 11 ? 5 : 4,
        deliveredHours: 0,
        status: 'SCHEDULED',
      });
    }

    const syllabus = createCourseSyllabus({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      courseTitle: 'Distributed Systems',
      department: 'CSE',
      semester: 6,
      academicYear: '2026-2027',
      totalCredits: 4,
      lectureCredits: 3,
      labCredits: 1,
      clos: [
        { cloId: 'c1', code: 'CLO-1', description: 'Analyze consensus', bloomTaxonomyLevel: 'ANALYZE', mappedProgramOutcomes: ['PO-1'] },
      ],
      modules: [
        { moduleId: 'mod-1', moduleNumber: 1, title: 'Consensus', plannedLectureHours: 45, plannedLabHours: 15, learningOutcomes: ['CLO-1'], keyTopics: ['Paxos', 'Raft'] },
      ],
      weeklyPlan: weeks,
    });

    assert.equal(syllabus.totalContactHours, 75); // 3*15 + 1*30 = 75
    // Wait, 3*15 + 1*30 = 75 hours! Let's check with 75 hours:
  });

  it('evaluates delivery velocity and flags critical drift when syllabus lags', () => {
    // 15 weeks * 5 hours = 75 hours
    const weeks: WeeklyLessonPlan[] = [];
    for (let i = 1; i <= 16; i++) {
      weeks.push({
        weekNumber: i,
        moduleId: 'mod-1',
        theme: `Topic ${i}`,
        topicsCovered: ['Lecture'],
        labPracticalTopics: ['Lab'],
        plannedHours: i <= 11 ? 5 : 5, // 15*5 = 75
        deliveredHours: 0,
        status: 'SCHEDULED',
      });
    }
    // Adjust week 16 to 0 to make exactly 75
    weeks[15].plannedHours = 0;

    const syllabus = createCourseSyllabus({
      institutionId: 'inst-apex-001',
      facultyId: 'fac-prof-rao',
      courseCode: 'CS401',
      courseTitle: 'Distributed Systems',
      department: 'CSE',
      semester: 6,
      academicYear: '2026-2027',
      totalCredits: 4,
      lectureCredits: 3,
      labCredits: 1,
      clos: [],
      modules: [],
      weeklyPlan: weeks,
    });

    // Calendar is at Week 6 (Expected: 6 * 5 = 30 hours)
    // Only delivered Week 1 and 2 (10 hours total) -> 20 hours deficit!
    recordWeeklyProgress(syllabus, 1, 5);
    recordWeeklyProgress(syllabus, 2, 5);

    const report = computeSyllabusVelocity(syllabus, 6);
    assert.equal(report.isDrifting, true);
    assert.equal(report.status, 'CRITICAL_LAG');
    assert.ok(report.driftHours <= -6);
    assert.match(report.remedialRecommendation || '', /CRITICAL: Schedule/);

    // CSV export test
    const csv = exportLessonPlanCSV(syllabus);
    assert.ok(csv.includes('Week_Number,Course_Code,Module_ID'));
    assert.ok(csv.includes('CS401'));
  });

  it('generates, validates, and expires ephemeral parent magic links', () => {
    const now = 1700000000000;
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    const token = generateParentMagicToken({
      studentId: 'stu-01',
      institutionId: 'inst-apex-001',
      expiresAt,
    }, 'secret_key_123');

    assert.ok(token.includes('stu-01'));
    assert.ok(token.includes('inst-apex-001'));

    // Valid check
    const validation = validateParentMagicToken(token, 'secret_key_123', now);
    assert.equal(validation.valid, true);
    assert.equal(validation.payload?.studentId, 'stu-01');
    assert.equal(validation.payload?.institutionId, 'inst-apex-001');

    // Expired check
    const expiredValidation = validateParentMagicToken(token, 'secret_key_123', expiresAt + 1000);
    assert.equal(expiredValidation.valid, false);
    assert.equal(expiredValidation.error, 'TOKEN_EXPIRED');

    // Tampered signature check
    const tamperedToken = token.slice(0, -4) + 'ffff';
    const tamperedValidation = validateParentMagicToken(tamperedToken, 'secret_key_123', now);
    assert.equal(tamperedValidation.valid, false);
    assert.equal(tamperedValidation.error, 'SIGNATURE_INVALID');
  });

  it('enforces notification rate limiting and maintains multi-tenant outbox isolation', () => {
    const contactA: ParentContact = {
      studentId: 'stu-01',
      studentName: 'Rohan Varma',
      rollNumber: 'CS2026-015',
      parentName: 'Suresh Varma',
      parentPhone: '+91 98765 11223',
      parentEmail: 'suresh@gmail.com',
      preferredChannel: 'WHATSAPP',
    };

    const notif1 = buildParentNotification({
      institutionId: 'inst-apex-001',
      contact: contactA,
      category: 'ATTENDANCE_DEFICIT_WARNING',
      metricValue: '68.5',
    });

    const now = Date.now();
    const res1 = parentNotificationStore.dispatch(notif1, now);
    assert.equal(res1.success, true);
    assert.equal(res1.status, 'SENT');

    // Attempt second immediate notification for same student and category -> THROTTLED
    const notif2 = buildParentNotification({
      institutionId: 'inst-apex-001',
      contact: contactA,
      category: 'ATTENDANCE_DEFICIT_WARNING',
      metricValue: '67.0',
    });

    const res2 = parentNotificationStore.dispatch(notif2, now + 1000); // 1 second later
    assert.equal(res2.success, false);
    assert.equal(res2.status, 'THROTTLED');

    // Different category (Academic Risk) should be allowed immediately
    const notif3 = buildParentNotification({
      institutionId: 'inst-apex-001',
      contact: contactA,
      category: 'CRITICAL_ACADEMIC_RISK',
      advisorName: 'Prof. Rao',
    });

    const res3 = parentNotificationStore.dispatch(notif3, now + 2000);
    assert.equal(res3.success, true);
    assert.equal(res3.status, 'SENT');

    // Multi-tenant outbox query
    const apexNotifs = parentNotificationStore.getNotificationsByInstitution('inst-apex-001');
    const metroNotifs = parentNotificationStore.getNotificationsByInstitution('inst-metro-002');

    assert.equal(apexNotifs.length, 3);
    assert.equal(metroNotifs.length, 0);
  });
});
