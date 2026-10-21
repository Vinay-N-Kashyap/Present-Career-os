import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  registerConvocationCeremony,
  registerDegreeCandidate,
  conferUniversityDegree,
  generateNadDigiLockerRecord,
  exportConvocationGazetteCSV,
  DegreeCandidate,
} from '../src/lib/admin/convocationCertification.ts';

import {
  registerCourseAttainmentConfig,
  submitCourseExitSurvey,
  computeProgramOutcomeAttainments,
  exportCoPoAttainmentCSV,
  CourseExitSurveyConfig,
} from '../src/lib/teacher/courseExitSurvey.ts';

describe('TASK-950: Convocation Ceremony & Course Outcome Attainment Systems Suite', () => {
  describe('TASK-946: Central University Convocation & Degree Certificate Issuance Engine', () => {
    it('registers convocation ceremonies and degree candidates correctly', () => {
      const ceremony = registerConvocationCeremony({
        id: 'CEREMONY-TEST-1',
        edition: '32nd Convocation',
        academicYear: '2025-2026',
        ceremonyDate: '2026-12-18',
        venue: 'Grand Memorial Auditorium',
        chancellorName: 'Dr. K. Kasturirangan',
        viceChancellorName: 'Prof. Anupama Venkataraman',
        chiefGuestName: 'Dr. Soumya Swaminathan',
        chiefGuestDesignation: 'Former Chief Scientist, WHO',
        totalEligibleGraduates: 100,
        inPersonAttendees: 90,
        inAbsentiaCount: 10,
        status: 'SCHEDULED',
      });

      assert.equal(ceremony.status, 'SCHEDULED');
      assert.equal(ceremony.totalEligibleGraduates, 100);

      const candidate: DegreeCandidate = {
        id: 'CAND-TEST-1',
        studentRoll: '20CS101',
        studentName: 'Aarohi Shenoy',
        aadhaarOrAbhaId: 'ABHA-1234-5678-9012',
        department: 'Computer Science & Engineering',
        degreeProgram: 'Bachelor of Technology (B.Tech)',
        majorSpecialization: 'Distributed Systems',
        graduationYear: 2026,
        completedCredits: 164,
        finalCGPA: 9.85,
        classification: 'FIRST_CLASS_WITH_DISTINCTION',
        isMedalWinner: true,
        medalTitle: "Chancellor's Gold Medal",
        clearance: {
          academicDeanCleared: true,
          bursarZeroDuesCleared: true,
          libraryNoDuesCleared: true,
          hostelNoDuesCleared: true,
          disciplinaryHold: false,
        },
        convocationStatus: 'CLEARANCE_PENDING',
      };

      const registered = registerDegreeCandidate(candidate);
      assert.equal(registered.convocationStatus, 'ELIGIBLE_FOR_CONVOCATION');
    });

    it('rejects degree conferral when candidate has statutory credit deficit (< 160 credits)', () => {
      const underCreditCandidate: DegreeCandidate = {
        id: 'CAND-UNDER-CREDIT',
        studentRoll: '20CS102',
        studentName: 'Incomplete Scholar',
        aadhaarOrAbhaId: 'ABHA-9999-8888-7777',
        department: 'Computer Science & Engineering',
        degreeProgram: 'B.Tech',
        majorSpecialization: 'Software Eng',
        graduationYear: 2026,
        completedCredits: 156, // Less than statutory 160
        finalCGPA: 7.5,
        classification: 'FIRST_CLASS',
        isMedalWinner: false,
        clearance: {
          academicDeanCleared: true,
          bursarZeroDuesCleared: true,
          libraryNoDuesCleared: true,
          hostelNoDuesCleared: true,
          disciplinaryHold: false,
        },
        convocationStatus: 'CLEARANCE_PENDING',
      };

      registerDegreeCandidate(underCreditCandidate);

      assert.throws(
        () =>
          conferUniversityDegree({
            candidateId: 'CAND-UNDER-CREDIT',
            conferralMode: 'IN_PERSON',
          }),
        /STATUTORY_CREDIT_DEFICIT/
      );
    });

    it('rejects degree conferral when clearances are missing or disciplinary hold is active', () => {
      const heldCandidate: DegreeCandidate = {
        id: 'CAND-HELD',
        studentRoll: '20CS103',
        studentName: 'Held Student',
        aadhaarOrAbhaId: 'ABHA-1111-2222-3333',
        department: 'Computer Science & Engineering',
        degreeProgram: 'B.Tech',
        majorSpecialization: 'Cybersecurity',
        graduationYear: 2026,
        completedCredits: 160,
        finalCGPA: 8.2,
        classification: 'FIRST_CLASS',
        isMedalWinner: false,
        clearance: {
          academicDeanCleared: true,
          bursarZeroDuesCleared: false, // Outstanding fee debt
          libraryNoDuesCleared: true,
          hostelNoDuesCleared: true,
          disciplinaryHold: false,
        },
        convocationStatus: 'CLEARANCE_PENDING',
      };

      registerDegreeCandidate(heldCandidate);

      assert.throws(
        () =>
          conferUniversityDegree({
            candidateId: 'CAND-HELD',
            conferralMode: 'IN_PERSON',
          }),
        /OUTSTANDING_CLEARANCES/
      );

      // Disciplinary hold test
      heldCandidate.clearance.bursarZeroDuesCleared = true;
      heldCandidate.clearance.disciplinaryHold = true;
      registerDegreeCandidate(heldCandidate);

      assert.throws(
        () =>
          conferUniversityDegree({
            candidateId: 'CAND-HELD',
            conferralMode: 'IN_PERSON',
          }),
        /DISCIPLINARY_HOLD_ACTIVE/
      );
    });

    it('confers degree, assigns unique serial number, generates SHA-256 seal, and NAD record', () => {
      const conferred = conferUniversityDegree({
        candidateId: 'CAND-TEST-1',
        conferralMode: 'IN_PERSON',
        conferralDate: '2026-12-18',
      });

      assert.equal(conferred.convocationStatus, 'DEGREE_CONFERRED');
      assert.match(conferred.degreeSerialNumber!, /^DEG-2026-CSE-[A-F0-9]{6}$/);
      assert.ok(conferred.cryptoSealDigest!.length >= 16);
      assert.ok(conferred.verificationUrl!.includes('https://verify.pinit.edu/degree/'));

      // NAD DigiLocker record generation
      const nad = generateNadDigiLockerRecord('CAND-TEST-1');
      assert.equal(nad.docType, 'DEGREE_CERTIFICATE');
      assert.equal(nad.certificateId, conferred.degreeSerialNumber);
      assert.equal(nad.studentRoll, '20CS101');
      assert.equal(nad.cgpa, 9.85);
    });

    it('exports official Convocation Gazette CSV with statutory columns', () => {
      const csv = exportConvocationGazetteCSV();
      assert.ok(csv.includes('Degree Serial Number,Student Roll,Student Name,Aadhaar/ABHA ID'));
      assert.ok(csv.includes('20CS101'));
      assert.ok(csv.includes('FIRST_CLASS_WITH_DISTINCTION'));
    });
  });

  describe('TASK-948: Faculty Course Exit Survey (CES) & Program Outcome (CO/PO) Attainment Engine', () => {
    it('registers course outcomes with Bloom taxonomy and computes direct attainment', () => {
      const config: CourseExitSurveyConfig = {
        courseCode: 'CS401',
        courseName: 'Distributed Systems',
        department: 'CSE',
        semester: 7,
        academicYear: '2025-2026',
        facultyId: 'FAC-01',
        facultyName: 'Dr. Meenakshi',
        totalEnrolledStudents: 50,
        surveyResponses: [],
        outcomes: [
          {
            id: 'CO1',
            description: 'Apply distributed consensus principles',
            bloomLevel: 'APPLY',
            cieScore: 2.6,
            seeScore: 2.4,
            directAttainment: 0,
            indirectAttainment: 0,
            overallAttainment: 0,
            targetBenchmark: 2.1,
            isTargetAchieved: false,
          },
          {
            id: 'CO2',
            description: 'Design replication state machines',
            bloomLevel: 'CREATE',
            cieScore: 2.5,
            seeScore: 2.5,
            directAttainment: 0,
            indirectAttainment: 0,
            overallAttainment: 0,
            targetBenchmark: 2.1,
            isTargetAchieved: false,
          },
        ],
        coPoMapping: {
          CO1: { PO1: 3, PO2: 3, PO3: 2 },
          CO2: { PO1: 2, PO2: 3, PO3: 3 },
        },
      };

      const registered = registerCourseAttainmentConfig(config);
      // Direct attainment = 0.40 * 2.6 + 0.60 * 2.4 = 1.04 + 1.44 = 2.48
      assert.equal(registered.outcomes[0].directAttainment, 2.48);
      // Indirect attainment defaults to 2.0 when responses empty
      assert.equal(registered.outcomes[0].indirectAttainment, 2.0);
      // Overall attainment = 0.80 * 2.48 + 0.20 * 2.0 = 1.984 + 0.4 = 2.38
      assert.equal(registered.outcomes[0].overallAttainment, 2.38);
      assert.equal(registered.outcomes[0].isTargetAchieved, true);
    });

    it('submits student Course Exit Survey response and recalculates indirect & composite attainments', () => {
      submitCourseExitSurvey({
        courseCode: 'CS401',
        studentToken: 'ANON-STU-01',
        ratings: { CO1: 5, CO2: 4 },
        qualitativeStrengths: 'Great lab assignments',
      });

      submitCourseExitSurvey({
        courseCode: 'CS401',
        studentToken: 'ANON-STU-02',
        ratings: { CO1: 4, CO2: 5 },
        qualitativeStrengths: 'Clear theory lectures',
      });

      // CO1 ratings: 5, 4 -> avg = 4.5
      // Indirect attainment = (4.5 / 5) * 3.0 = 2.70
      // Direct attainment = 2.48
      // Overall attainment = 0.80 * 2.48 + 0.20 * 2.70 = 1.984 + 0.54 = 2.52
      const updated = exportCoPoAttainmentCSV('CS401');
      assert.ok(updated.includes('"CO1"'));
      assert.ok(updated.includes('ACHIEVED'));
    });

    it('rejects duplicate or invalid survey submissions', () => {
      // Duplicate token check
      assert.throws(
        () =>
          submitCourseExitSurvey({
            courseCode: 'CS401',
            studentToken: 'ANON-STU-01',
            ratings: { CO1: 5 },
          }),
        /DUPLICATE_SUBMISSION/
      );

      // Out of bounds rating check (< 1 or > 5)
      assert.throws(
        () =>
          submitCourseExitSurvey({
            courseCode: 'CS401',
            studentToken: 'ANON-STU-03',
            ratings: { CO1: 6 },
          }),
        /INVALID_RATING/
      );
    });

    it('computes NBA Program Outcome (PO) weighted attainments', () => {
      const poSummaries = computeProgramOutcomeAttainments('CS401');
      assert.ok(poSummaries.length > 0);

      const po1 = poSummaries.find((p) => p.poKey === 'PO1');
      assert.ok(po1 !== undefined);
      assert.ok(po1.weightedScore > 2.0);
      assert.equal(po1.isTargetAchieved, true);
    });

    it('exports statutory NBA Criterion 3/4 CO-PO Attainment CSV', () => {
      const csv = exportCoPoAttainmentCSV('CS401');
      assert.ok(csv.includes('NBA CRITERION 3 & 4: COURSE & PROGRAM OUTCOME ATTAINMENT REPORT'));
      assert.ok(csv.includes('COURSE OUTCOME ATTAINMENT'));
      assert.ok(csv.includes('PROGRAM OUTCOME (PO & PSO) ATTAINMENT'));
      assert.ok(csv.includes('Engineering Knowledge'));
    });
  });
});
