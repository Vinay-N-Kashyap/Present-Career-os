import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyFilters,
  computeDashboard,
  computeEmployability,
  THRESHOLDS,
  CohortIndex,
  UniversityFilters,
} from '../src/lib/university/analytics';

test('Block 162 (TASK-482): THRESHOLDS governance bounds are immutable and well-defined', () => {
  assert.strictEqual(THRESHOLDS.atsQualified, 70, 'ATS Qualified threshold must be 70');
  assert.strictEqual(THRESHOLDS.placementReadyAts, 70, 'Placement ready ATS threshold must be 70');
  assert.strictEqual(THRESHOLDS.placementReadyTrust, 70, 'Placement ready Trust threshold must be 70');
  assert.strictEqual(THRESHOLDS.highlyEmployable, 75, 'Highly employable threshold must be 75');
  assert.strictEqual(THRESHOLDS.employable, 50, 'Employable threshold must be 50');
  assert.strictEqual(THRESHOLDS.highTrust, 75, 'High trust threshold must be 75');
  assert.strictEqual(THRESHOLDS.engagedMissions, 5, 'Engaged missions threshold must be 5');
});

test('Block 162 (TASK-482): applyFilters correctly partitions students by college, department, and batch', () => {
  const students = [
    { id: 's1', display_name: 'Alice' },
    { id: 's2', display_name: 'Bob' },
    { id: 's3', display_name: 'Charlie' },
    { id: 's4', display_name: 'Diana' },
  ];

  const cohorts: CohortIndex = new Map([
    ['s1', { college: 'Apex University', department: 'Computer Science', batchYear: 2025 }],
    ['s2', { college: 'Apex University', department: 'Information Technology', batchYear: 2025 }],
    ['s3', { college: 'Apex University', department: 'Computer Science', batchYear: 2026 }],
    ['s4', { college: 'Zenith College', department: 'Computer Science', batchYear: 2025 }],
  ]);

  // 1. Universal filter returns all students
  const allResult = applyFilters(students, cohorts, { college: 'all', department: 'all' });
  assert.strictEqual(allResult.length, 4);

  // 2. Filter by college
  const apexOnly = applyFilters(students, cohorts, { college: 'Apex' });
  assert.strictEqual(apexOnly.length, 3);
  assert.ok(apexOnly.every((s) => s.id !== 's4'));

  // 3. Filter by college AND department
  const csApex = applyFilters(students, cohorts, { college: 'Apex', department: 'Computer Science' });
  assert.strictEqual(csApex.length, 2);
  assert.ok(csApex.some((s) => s.id === 's1'));
  assert.ok(csApex.some((s) => s.id === 's3'));

  // 4. Filter by batch year
  const batch2026 = applyFilters(students, cohorts, { batchYear: 2026 });
  assert.strictEqual(batch2026.length, 1);
  assert.strictEqual(batch2026[0].id, 's3');
});

test('Block 162 (TASK-482): computeDashboard generates accurate placement, engagement, and department metrics', () => {
  const students = [
    {
      id: 's1',
      display_name: 'Student High Performer',
      ats_score: 92,
      trust_score: 88,
      career_dna_score: 90,
      missions_completed: 12,
      xp_total: 450,
      recruiter_visibility: 95,
    },
    {
      id: 's2',
      display_name: 'Student Ready',
      ats_score: 75,
      trust_score: 72,
      career_dna_score: 70,
      missions_completed: 6,
      xp_total: 200,
      recruiter_visibility: 80,
    },
    {
      id: 's3',
      display_name: 'Student Developing',
      ats_score: 60,
      trust_score: 55,
      career_dna_score: 50,
      missions_completed: 1,
      xp_total: 40,
      recruiter_visibility: 40,
    },
    {
      id: 's4',
      display_name: 'Student Inactive',
      ats_score: 45,
      trust_score: 40,
      career_dna_score: 40,
      missions_completed: 0,
      xp_total: 0,
      recruiter_visibility: 20,
    },
  ];

  const cohorts: CohortIndex = new Map([
    ['s1', { college: 'Apex University', department: 'CSE', batchYear: 2025 }],
    ['s2', { college: 'Apex University', department: 'CSE', batchYear: 2025 }],
    ['s3', { college: 'Apex University', department: 'ECE', batchYear: 2025 }],
    ['s4', { college: 'Apex University', department: 'ECE', batchYear: 2025 }],
  ]);

  const dashboard = computeDashboard(students, cohorts, true);

  // Placement stats validation
  assert.strictEqual(dashboard.placementStats.total_students, 4);
  assert.strictEqual(dashboard.placementStats.placement_ready, 2, 's1 and s2 should be placement ready (>= 70)');
  assert.strictEqual(dashboard.placementStats.ats_qualified, 2, 's1 and s2 should be ATS qualified (>= 70)');
  assert.strictEqual(dashboard.placementStats.engaged_students, 3, 's1, s2, and s3 should be engaged (missions > 0 or xp > 0)');

  // Averages validation: (92 + 75 + 60 + 45) / 4 = 272 / 4 = 68
  assert.strictEqual(dashboard.placementStats.avg_ats, 68);
  // (88 + 72 + 55 + 40) / 4 = 255 / 4 = 63.75 -> round to 64
  assert.strictEqual(dashboard.placementStats.avg_trust, 64);
  // (90 + 70 + 50 + 40) / 4 = 250 / 4 = 62.5 -> round to 63
  assert.strictEqual(dashboard.placementStats.avg_dna, 63);

  // Top students sort order (s1 highest sum 270, s2 second 217, s3 165, s4 125)
  assert.strictEqual(dashboard.topStudents[0].id, 's1');
  assert.strictEqual(dashboard.topStudents[1].id, 's2');
  assert.strictEqual(dashboard.topStudents[2].id, 's3');
  assert.strictEqual(dashboard.topStudents[3].id, 's4');

  // Department breakdown
  assert.strictEqual(dashboard.deptStats.length, 2);
  const cse = dashboard.deptStats.find((d) => d.dept_code === 'CSE');
  assert.ok(cse);
  assert.strictEqual(cse.student_count, 2);
  assert.strictEqual(cse.avg_ats, 84); // (92 + 75) / 2 = 83.5 -> 84

  assert.strictEqual(dashboard.dataAvailable.students, true);
  assert.strictEqual(dashboard.dataAvailable.departments, true);
});

test('Block 162 (TASK-482): computeEmployability distributes student readiness and handles empty states safely', () => {
  const students = [
    { id: 's1', ats_score: 90, trust_score: 90, career_dna_score: 90, missions_completed: 10, certifications: ['cert1'] }, // avg 90 -> highly employable
    { id: 's2', ats_score: 65, trust_score: 60, career_dna_score: 55, missions_completed: 4, certifications: [] }, // avg 60 -> employable
    { id: 's3', ats_score: 40, trust_score: 40, career_dna_score: 40, missions_completed: 0, certifications: [] }, // avg 40 -> needs development
  ];

  const { report, dataAvailable } = computeEmployability(students);
  assert.strictEqual(report.highly_employable, 1);
  assert.strictEqual(report.employable, 1);
  assert.strictEqual(report.needs_development, 1);
  assert.strictEqual(report.high_trust, 1);
  assert.strictEqual(report.highly_engaged, 1);
  assert.strictEqual(report.certified, 1);
  assert.strictEqual(dataAvailable.students, true);

  // Zero-state resilience test: empty students array must never produce NaN or throw
  const emptyResult = computeEmployability([]);
  assert.strictEqual(emptyResult.report.highly_employable, 0);
  assert.strictEqual(emptyResult.report.employable, 0);
  assert.strictEqual(emptyResult.report.needs_development, 0);
  assert.strictEqual(emptyResult.dataAvailable.students, false);

  const emptyDashboard = computeDashboard([], new Map(), false);
  assert.strictEqual(emptyDashboard.placementStats.total_students, 0);
  assert.strictEqual(emptyDashboard.placementStats.avg_ats, 0);
  assert.strictEqual(emptyDashboard.placementStats.avg_trust, 0);
  assert.strictEqual(emptyDashboard.placementStats.avg_dna, 0);
  assert.strictEqual(emptyDashboard.deptStats.length, 0);
  assert.strictEqual(emptyDashboard.dataAvailable.students, false);
  assert.strictEqual(emptyDashboard.dataAvailable.departments, false);
});
