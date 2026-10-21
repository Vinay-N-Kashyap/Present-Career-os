import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseStudentRosterCSV,
  parseCSVLine,
  InMemoryRosterStore,
} from '../src/lib/admin/roster';

describe('TASK-852: Campus Admin Student Roster CSV Batch Ingestion Pipeline', () => {
  beforeEach(() => {
    InMemoryRosterStore.clear();
  });

  test('parses CSV lines respecting embedded quotes and commas', () => {
    const line = 'CS-01,"Sharma, Aarav",aarav@apex.edu,"Computer Science, AI"';
    const tokens = parseCSVLine(line);
    assert.deepEqual(tokens, [
      'CS-01',
      'Sharma, Aarav',
      'aarav@apex.edu',
      'Computer Science, AI',
    ]);
  });

  test('successfully ingests valid student CSV with full schema validation', () => {
    const csv = `Roll Number,Full Name,Email,Department,Batch Year,Semester,CGPA
CS-2026-001,Aarav Sharma,aarav@apex.edu,CSE,2026,6,8.75
CS-2026-002,Priya Patel,priya@apex.edu,ECE,2026,6,9.12
IT-2027-015,Rohan Varma,rohan@apex.edu,IT,2027,4,7.80`;

    const result = parseStudentRosterCSV(csv, 'inst-apex-001');

    assert.equal(result.success, true);
    assert.equal(result.totalRows, 3);
    assert.equal(result.validRecords.length, 3);
    assert.equal(result.errors.length, 0);

    const first = result.validRecords[0];
    assert.equal(first.rollNumber, 'CS-2026-001');
    assert.equal(first.fullName, 'Aarav Sharma');
    assert.equal(first.email, 'aarav@apex.edu');
    assert.equal(first.department, 'CSE');
    assert.equal(first.cgpa, 8.75);
    assert.equal(first.institutionId, 'inst-apex-001');
  });

  test('accepts flexible and varied university header synonyms', () => {
    const csv = `RegNo,Student Name,Email Address,Branch,Graduation Year,CGPA
ME-101,Vikram Rao,vikram@apex.edu,Mechanical,2025,8.10`;

    const result = parseStudentRosterCSV(csv, 'inst-apex-001');
    assert.equal(result.success, true);
    assert.equal(result.validRecords.length, 1);
    assert.equal(result.validRecords[0].rollNumber, 'ME-101');
    assert.equal(result.validRecords[0].fullName, 'Vikram Rao');
    assert.equal(result.validRecords[0].department, 'MECHANICAL');
  });

  test('detects and flags duplicate roll numbers and emails within the same batch', () => {
    const csv = `Roll Number,Full Name,Email,Department
CS-101,Student One,student1@apex.edu,CSE
CS-101,Student Two,student2@apex.edu,CSE
CS-102,Student Three,student1@apex.edu,CSE`;

    const result = parseStudentRosterCSV(csv, 'inst-apex-001');
    assert.equal(result.success, false);
    assert.equal(result.validRecords.length, 1); // Only Student One is valid
    assert.equal(result.summary.duplicateCount, 2);

    const rollErr = result.errors.find((e) => e.field === 'rollNumber');
    assert.ok(rollErr);
    assert.match(rollErr.reason, /Duplicate roll number/);

    const emailErr = result.errors.find((e) => e.field === 'email');
    assert.ok(emailErr);
    assert.match(emailErr.reason, /Duplicate email address/);
  });

  test('sanitizes XSS tags and malformed input characters safely', () => {
    const csv = `Roll Number,Full Name,Email,Department
CS-XSS,"<script>alert('xss')</script>John Doe",john@apex.edu,CSE`;

    const result = parseStudentRosterCSV(csv, 'inst-apex-001');
    assert.equal(result.success, true);
    assert.equal(result.validRecords[0].fullName, 'John Doe');
  });

  test('validates numeric bounds on CGPA and Semester', () => {
    const csv = `Roll Number,Full Name,Email,Department,Semester,CGPA
CS-ERR1,Bad Sem,bad1@apex.edu,CSE,15,8.0
CS-ERR2,Bad GPA,bad2@apex.edu,CSE,5,11.5`;

    const result = parseStudentRosterCSV(csv, 'inst-apex-001');
    assert.equal(result.success, false);
    assert.equal(result.validRecords.length, 0);

    const semErr = result.errors.find((e) => e.field === 'currentSemester');
    assert.ok(semErr);
    assert.match(semErr.reason, /Semester must be between 1 and 12/);

    const gpaErr = result.errors.find((e) => e.field === 'cgpa');
    assert.ok(gpaErr);
    assert.match(gpaErr.reason, /CGPA must be between 0.00 and 10.00/);
  });

  test('in-memory store upserts students and isolates records by institutionId', () => {
    const apexStudents = [
      {
        rollNumber: 'CS-001',
        fullName: 'Student A',
        email: 'a@apex.edu',
        department: 'CSE',
        batchYear: 2026,
        currentSemester: 6,
        cgpa: 8.5,
        status: 'active' as const,
        institutionId: 'inst-apex-001',
      },
    ];

    const metroStudents = [
      {
        rollNumber: 'CS-001', // Same roll number, different institution
        fullName: 'Student M',
        email: 'm@metro.edu',
        department: 'ECE',
        batchYear: 2026,
        currentSemester: 4,
        cgpa: 7.9,
        status: 'active' as const,
        institutionId: 'inst-metro-002',
      },
    ];

    InMemoryRosterStore.upsertStudents(apexStudents);
    InMemoryRosterStore.upsertStudents(metroStudents);

    const apexList = InMemoryRosterStore.getStudentsByInstitution('inst-apex-001');
    assert.equal(apexList.length, 1);
    assert.equal(apexList[0].fullName, 'Student A');

    const metroList = InMemoryRosterStore.getStudentsByInstitution('inst-metro-002');
    assert.equal(metroList.length, 1);
    assert.equal(metroList[0].fullName, 'Student M');
  });
});
