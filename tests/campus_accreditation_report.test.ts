import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAccreditationManifest,
  exportAccreditationCSV,
} from '../src/lib/admin/accreditation';

describe('TASK-868: Institutional NAAC & NBA Accreditation Export Engine', () => {
  test('computes compliant manifest with exemplary criteria for top tier university', () => {
    const manifest = computeAccreditationManifest({
      institutionId: 'inst-apex-001',
      institutionName: 'Apex Institute of Technology',
      academicYear: '2026-2027',
      studentCount: 3000,
      facultyCount: 200, // 15:1 ratio
      passedStudentsCount: 2700, // 90% CLO attainment
      verifiedPlacementCount: 2550, // 85% placement rate
    });

    assert.equal(manifest.institutionId, 'inst-apex-001');
    assert.equal(manifest.studentFacultyRatio, '15:1');
    assert.equal(manifest.cloAttainmentRate, 90.0);
    assert.equal(manifest.placementRateVerified, 85.0);
    assert.equal(manifest.criteria[0].status, 'EXEMPLARY');
    assert.equal(manifest.criteria[1].status, 'EXEMPLARY');
    assert.equal(manifest.criteria[2].status, 'COMPLIANT');
    assert.ok(manifest.overallComplianceScore >= 90);
    assert.equal(typeof manifest.manifestSignature, 'string');
    assert.equal(manifest.manifestSignature.length, 64); // SHA-256 hex length
  });

  test('flags ACTION_REQUIRED when placement or faculty ratios fall below standard', () => {
    const manifest = computeAccreditationManifest({
      institutionId: 'inst-struggle-001',
      institutionName: 'Struggling College',
      academicYear: '2026-2027',
      studentCount: 2000,
      facultyCount: 80, // 25:1 ratio (> 15:1 NBA limit)
      passedStudentsCount: 1200, // 60% CLO (< 75%)
      verifiedPlacementCount: 800, // 40% placement (< 65%)
    });

    assert.equal(manifest.criteria[0].status, 'ACTION_REQUIRED');
    assert.equal(manifest.criteria[1].status, 'ACTION_REQUIRED');
    assert.equal(manifest.criteria[2].status, 'ACTION_REQUIRED');
    assert.ok(manifest.overallComplianceScore < 50);
  });

  test('exports standardized regulatory CSV string with cryptographic hashes', () => {
    const manifest = computeAccreditationManifest({
      institutionId: 'inst-apex-001',
      institutionName: 'Apex Tech',
      academicYear: '2026-2027',
      studentCount: 1500,
      facultyCount: 100,
      passedStudentsCount: 1350,
      verifiedPlacementCount: 1200,
    });

    const csv = exportAccreditationCSV(manifest);
    assert.ok(csv.includes('REGULATORY_BODY,CRITERION_ID,CRITERION_NAME'));
    assert.ok(csv.includes('NAAC-2.6'));
    assert.ok(csv.includes('NAAC-5.2'));
    assert.ok(csv.includes('NBA-CRIT-4'));
  });

  test('throws error on non-positive student or faculty count', () => {
    assert.throws(() => {
      computeAccreditationManifest({
        institutionId: 'inst-apex-001',
        institutionName: 'Apex Tech',
        academicYear: '2026-2027',
        studentCount: 0,
        facultyCount: 10,
        passedStudentsCount: 0,
        verifiedPlacementCount: 0,
      });
    }, /positive student\/faculty counts required/);
  });
});
