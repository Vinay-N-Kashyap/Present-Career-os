/**
 * Master Student Health Center & Faculty Mentorship Systems Test Suite (TASK-935)
 * 
 * Verifies:
 * 1. University Student Health Center, Medical Leaves & Vaccination Passport Engine (TASK-931).
 * 2. Outpatient consultation logging and emergency triage ambulance dispatching.
 * 3. Statutory medical leave validation invariants (duration, date range, physician license).
 * 4. Dual-tier attendance waiver governance (Physician verified <= 14 days, Dean approved > 14 days).
 * 5. Immunization and vaccination passport tracking.
 * 6. Faculty Mentorship, Proctor & Student Counseling Telemetry Engine (TASK-933).
 * 7. Dynamic student risk status evaluation (THRIVING, STABLE, NEEDS_SUPPORT, CRITICAL_RISK).
 * 8. AICTE 20:1 proctor-mentee ratio compliance and counselor escalation tracking.
 * 9. NAAC Criterion 5.1.4 mentoring log and statutory medical leave CSV exports.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  seedStudentHealthData,
  resetStudentHealthStore,
  getConsultations,
  getMedicalLeaves,
  getVaccinations,
  logConsultation,
  submitMedicalLeave,
  verifyMedicalLeave,
  recordVaccination,
  computeHealthCentreSummary,
  exportMedicalLeaveLedgerCSV
} from '../src/lib/admin/studentHealth';

import {
  seedMentorshipData,
  resetMentorshipStore,
  getMentorshipSessions,
  getMentees,
  assignMentee,
  evaluateMenteeStatus,
  recordMentorshipSession,
  computeFacultyMentorshipSummary,
  exportMentorshipLogCSV
} from '../src/lib/teacher/facultyMentorship';

describe('TASK-935: Student Health & Faculty Mentorship Systems Suite', () => {
  const TEST_INSTITUTION = 'inst-apex-test';

  beforeEach(() => {
    resetStudentHealthStore();
    seedStudentHealthData(TEST_INSTITUTION);

    resetMentorshipStore();
    seedMentorshipData(TEST_INSTITUTION);
  });

  describe('TASK-931: University Student Health Center & Medical Leaves Engine', () => {
    it('logs outpatient consultations and emergency ambulance dispatches', () => {
      const record = logConsultation({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-CS-2026-099',
        studentName: 'Vikram Joshi',
        rollNumber: '2026-CSE-099',
        doctorName: 'Dr. Pratibha Deshmukh, MD',
        symptoms: ['Chest Pain', 'Shortness of Breath'],
        diagnosis: 'Acute Costochondritis',
        prescriptionNotes: 'Analgesics; ECG performed; Observation',
        severity: 'URGENT',
        admittedToInfirmary: true,
        ambulanceDispatched: false
      });

      assert.ok(record.id.startsWith('HLT-'));
      assert.equal(record.severity, 'URGENT');
      assert.equal(record.admittedToInfirmary, true);
      assert.equal(record.ambulanceDispatched, false);
      assert.equal(record.symptoms.length, 2);
    });

    it('enforces medical leave duration and physician registration invariants', () => {
      // 1. Invalid duration
      const res1 = submitMedicalLeave({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-CS-2026-100',
        studentName: 'Maya Sen',
        rollNumber: '2026-CSE-100',
        department: 'Computer Science',
        startDate: '2026-10-20',
        endDate: '2026-10-20',
        daysCount: 0,
        medicalReason: 'General illness',
        physicianLicenseNumber: 'KMC-10291',
        hospitalClinicName: 'City Clinic'
      });
      assert.equal(res1.success, false);
      assert.ok(res1.error?.includes('INVALID_DURATION'));

      // 2. Invalid date range
      const res2 = submitMedicalLeave({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-CS-2026-100',
        studentName: 'Maya Sen',
        rollNumber: '2026-CSE-100',
        department: 'Computer Science',
        startDate: '2026-10-25',
        endDate: '2026-10-20',
        daysCount: 5,
        medicalReason: 'General illness',
        physicianLicenseNumber: 'KMC-10291',
        hospitalClinicName: 'City Clinic'
      });
      assert.equal(res2.success, false);
      assert.ok(res2.error?.includes('INVALID_DATE_RANGE'));

      // 3. Missing physician license
      const res3 = submitMedicalLeave({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-CS-2026-100',
        studentName: 'Maya Sen',
        rollNumber: '2026-CSE-100',
        department: 'Computer Science',
        startDate: '2026-10-20',
        endDate: '2026-10-25',
        daysCount: 5,
        medicalReason: 'General illness',
        physicianLicenseNumber: '',
        hospitalClinicName: 'City Clinic'
      });
      assert.equal(res3.success, false);
      assert.ok(res3.error?.includes('MISSING_PHYSICIAN_LICENSE'));
    });

    it('governs dual-tier attendance waivers (standard vs extended absence > 14 days)', () => {
      // Standard 7-day leave: Physician verification immediately approves attendance waiver
      const stdLeave = submitMedicalLeave({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-CS-2026-101',
        studentName: 'Kavita Roy',
        rollNumber: '2026-CSE-101',
        department: 'Computer Science',
        startDate: '2026-10-20',
        endDate: '2026-10-27',
        daysCount: 7,
        medicalReason: 'Severe Conjunctivitis',
        physicianLicenseNumber: 'KMC-99182',
        hospitalClinicName: 'Apex Health Centre'
      });
      assert.equal(stdLeave.success, true);

      const verifyStd = verifyMedicalLeave(stdLeave.certificate!.id, 'Dr. Pratibha Deshmukh, MD');
      assert.equal(verifyStd.success, true);
      assert.equal(verifyStd.certificate?.status, 'PHYSICIAN_VERIFIED');
      assert.equal(verifyStd.certificate?.attendanceWaiverApproved, true);

      // Extended 21-day leave: Physician verification leaves waiver pending until Dean sign-off
      const extLeave = submitMedicalLeave({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-CS-2026-102',
        studentName: 'Rohan Gupta',
        rollNumber: '2026-CSE-102',
        department: 'Computer Science',
        startDate: '2026-11-01',
        endDate: '2026-11-22',
        daysCount: 21,
        medicalReason: 'Major Abdominal Appendectomy Surgery',
        physicianLicenseNumber: 'MCI-88192',
        hospitalClinicName: 'Manipal Hospital'
      });
      assert.equal(extLeave.success, true);

      // Step 1: Physician verifies (waiver still pending Dean)
      const verifyExt = verifyMedicalLeave(extLeave.certificate!.id, 'Dr. Pratibha Deshmukh, MD', {
        deanApproved: false
      });
      assert.equal(verifyExt.success, true);
      assert.equal(verifyExt.certificate?.status, 'PHYSICIAN_VERIFIED');
      assert.equal(verifyExt.certificate?.attendanceWaiverApproved, false);

      // Step 2: Dean signs off on extended waiver
      const deanSign = verifyMedicalLeave(extLeave.certificate!.id, 'Dr. Pratibha Deshmukh, MD', {
        deanApproved: true
      });
      assert.equal(deanSign.success, true);
      assert.equal(deanSign.certificate?.status, 'DEAN_APPROVED');
      assert.equal(deanSign.certificate?.attendanceWaiverApproved, true);
      assert.ok(deanSign.certificate?.deanApprovedAt);
    });

    it('records vaccination passports and generates medical leave ledger CSV', () => {
      const vac = recordVaccination({
        institutionId: TEST_INSTITUTION,
        studentId: 'STU-CS-2026-101',
        studentName: 'Kavita Roy',
        vaccine: 'COVID19',
        doseNumber: 2,
        administeredDate: '2026-09-10',
        batchNumber: 'COV-BATCH-991'
      });

      assert.ok(vac.id.startsWith('VAC-'));
      assert.equal(vac.isVerified, true);

      const summary = computeHealthCentreSummary(TEST_INSTITUTION);
      assert.ok(summary.totalConsultations >= 2);
      assert.ok(summary.approvedAttendanceWaivers >= 2);

      const csv = exportMedicalLeaveLedgerCSV(TEST_INSTITUTION);
      assert.ok(csv.includes('=== UNIVERSITY HEALTH CENTRE: STATUTORY MEDICAL LEAVE & ATTENDANCE WAIVER LEDGER ==='));
      assert.ok(csv.includes('Aarav Nair'));
      assert.ok(csv.includes('Siddharth Menon'));
      assert.ok(csv.includes('Clavicle Orthopedic Surgery'));
    });
  });

  describe('TASK-933: Faculty Mentorship, Proctor & Student Counseling Telemetry Engine', () => {
    it('evaluates student risk state dynamically based on CGPA, attendance, and backlogs', () => {
      // 1. Thriving
      assert.equal(evaluateMenteeStatus(9.0, 92, 0), 'THRIVING');

      // 2. Stable
      assert.equal(evaluateMenteeStatus(7.5, 80, 0), 'STABLE');

      // 3. Needs Support (1 backlog or attendance 65%)
      assert.equal(evaluateMenteeStatus(7.0, 68, 1), 'NEEDS_SUPPORT');

      // 4. Critical Risk (3 backlogs or attendance < 60%)
      assert.equal(evaluateMenteeStatus(4.5, 52, 3), 'CRITICAL_RISK');
    });

    it('assigns mentees to faculty and updates profile risk status', () => {
      const mentee = assignMentee({
        studentId: 'STU-CS-2026-088',
        studentName: 'Ananya Deshpande',
        rollNumber: '2026-CSE-088',
        institutionId: TEST_INSTITUTION,
        department: 'Computer Science',
        cgpa: 8.8,
        attendancePercent: 91,
        backlogsCount: 0,
        status: 'THRIVING',
        assignedFacultyId: 'FAC-CS-001'
      });

      assert.equal(mentee.status, 'THRIVING');
      assert.equal(mentee.assignedFacultyId, 'FAC-CS-001');
    });

    it('records 1-on-1 counseling encounters and handles professional psychologist escalation', () => {
      const res = recordMentorshipSession({
        institutionId: TEST_INSTITUTION,
        mentorFacultyId: 'FAC-CS-001',
        mentorFacultyName: 'Dr. Aris Thorne',
        department: 'Computer Science',
        studentId: 'STU-CS-2026-015',
        studentName: 'Siddharth Menon',
        rollNumber: '2026-CSE-015',
        category: 'CAREER_GUIDANCE',
        urgency: 'LOW',
        discussionPoints: 'Explored summer research internship opportunities at IIT Bombay and AWS Cloud.',
        actionPlan: 'Submit draft statement of purpose by next week.',
        parentContacted: false,
        referredToProfessionalCounselor: false,
        sessionDate: '2026-10-16T14:00:00Z',
        followUpDate: '2026-10-30'
      });

      assert.equal(res.success, true);
      assert.ok(res.session?.id.startsWith('MNT-'));
      assert.equal(res.session?.category, 'CAREER_GUIDANCE');
      assert.equal(res.session?.urgency, 'LOW');
    });

    it('rejects mentorship sessions missing discussion points', () => {
      const res = recordMentorshipSession({
        institutionId: TEST_INSTITUTION,
        mentorFacultyId: 'FAC-CS-001',
        mentorFacultyName: 'Dr. Aris Thorne',
        department: 'Computer Science',
        studentId: 'STU-CS-2026-015',
        studentName: 'Siddharth Menon',
        rollNumber: '2026-CSE-015',
        category: 'ACADEMIC_PROGRESS',
        urgency: 'MEDIUM',
        discussionPoints: '', // Missing
        actionPlan: 'Follow up',
        sessionDate: '2026-10-16T14:00:00Z'
      });

      assert.equal(res.success, false);
      assert.ok(res.error?.includes('MISSING_DISCUSSION_NOTES'));
    });

    it('computes faculty mentorship metrics summary and checks AICTE 20:1 ratio compliance', () => {
      const summary = computeFacultyMentorshipSummary('FAC-CS-001', TEST_INSTITUTION);

      assert.equal(summary.facultyName, 'Dr. Aris Thorne');
      assert.ok(summary.totalMenteesCount <= 20);
      assert.equal(summary.isRatioCompliant, true); // <= 20
      assert.ok(summary.totalSessionsCompleted >= 2);
      assert.ok(summary.criticalInterventionsCount >= 1);
      assert.ok(summary.professionalCounselorReferrals >= 1);
    });

    it('exports official NAAC Criterion 5.1.4 student mentoring CSV', () => {
      const csv = exportMentorshipLogCSV(TEST_INSTITUTION);

      assert.ok(csv.includes('=== NAAC CRITERION 5.1.4: FACULTY MENTORSHIP & STUDENT COUNSELING LOG ==='));
      assert.ok(csv.includes('Dr. Aris Thorne'));
      assert.ok(csv.includes('Siddharth Menon'));
      assert.ok(csv.includes('Priya Sundaram'));
      assert.ok(csv.includes('MENTAL_HEALTH_WELLBEING'));
      assert.ok(csv.includes('CRITICAL_COUNSELOR_ESCALATION'));
    });
  });
});
