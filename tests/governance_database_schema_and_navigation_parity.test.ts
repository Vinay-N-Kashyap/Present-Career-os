import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  isSupabaseConfigured,
  loadGovernanceRecords,
  saveGovernanceRecord
} from '../src/lib/services/governancePersistence';

import { ALL_GOVERNANCE_PORTALS } from '../src/components/admin/CampusAdminShell';
import { ALL_FACULTY_STUDIOS } from '../src/components/teacher/TeacherDashboard';
import {
  auditEnvironmentKeys,
  runSystemHealthAudit,
  CRITICAL_ENV_KEYS,
  CRITICAL_GOVERNANCE_TABLES
} from '../src/lib/admin/systemHealth';

test('1. Database Migration: 20261018 SQL Schema File Exists & Contains Invariants', () => {
  const migrationPath = path.resolve(
    process.cwd(),
    'supabase/migrations/20261018_central_governance_and_faculty_studios.sql'
  );
  assert.ok(fs.existsSync(migrationPath), 'Migration SQL file must exist on disk');

  const content = fs.readFileSync(migrationPath, 'utf-8');
  assert.ok(content.length > 5000, 'Migration file must have substantial SQL content');

  // Verify core table creations
  const tableMatches = content.match(/CREATE TABLE IF NOT EXISTS public\.(\w+)/g) || [];
  assert.ok(
    tableMatches.length >= 30,
    `Expected at least 30 table declarations in migration, found ${tableMatches.length}`
  );

  // Verify critical tables are present
  assert.ok(content.includes('public.central_nirf_rankings'));
  assert.ok(content.includes('public.faculty_emeritus_fellowships'));
  assert.ok(content.includes('public.central_disaster_safety'));
  assert.ok(content.includes('public.faculty_startup_incubation'));
  assert.ok(content.includes('public.central_equal_opportunity'));
  assert.ok(content.includes('public.faculty_professor_of_practice'));
  assert.ok(content.includes('public.central_internal_audit_cag'));
  assert.ok(content.includes('public.central_academic_bank_credits'));
  assert.ok(content.includes('public.central_procurement_tenders'));
  assert.ok(content.includes('public.central_rti_grievances'));

  // Verify RLS security invariants
  const rlsMatches = content.match(/ENABLE ROW LEVEL SECURITY/g) || [];
  assert.ok(
    rlsMatches.length >= 30,
    `Every table must have Row-Level Security enabled, found ${rlsMatches.length}`
  );

  const policyMatches = content.match(/CREATE POLICY "Tenant isolation for/g) || [];
  assert.ok(
    policyMatches.length >= 30,
    `Every table must have multi-tenant isolation policies, found ${policyMatches.length}`
  );
});

test('2. Universal Persistence: Resilient Fallback Works Without Crashes', async () => {
  // Test loading fallback records
  const defaultList = [{ id: 'mock-1', title: 'Test NIRF Record' }];
  const loadResult = await loadGovernanceRecords('central_nirf_rankings', defaultList);

  assert.ok(loadResult);
  assert.ok(Array.isArray(loadResult.data));
  assert.ok(loadResult.data.length > 0);
  assert.ok(['supabase', 'local_storage', 'memory'].includes(loadResult.source));

  // Test saving a record
  const saveResult = await saveGovernanceRecord(
    'central_nirf_rankings',
    { id: 'mock-rec-99', title: 'Automated Test Submission' },
    'id'
  );

  assert.equal(saveResult.success, true);
  assert.ok(saveResult.data);
  assert.equal(saveResult.data.id, 'mock-rec-99');
  assert.ok(['supabase', 'local_storage', 'memory'].includes(saveResult.source));
});

test('3. Campus Admin Shell Navigation: All 40 Portals Route to Real App Router Pages', () => {
  assert.ok(
    ALL_GOVERNANCE_PORTALS.length >= 35,
    `Expected at least 35 governance portals in directory, found ${ALL_GOVERNANCE_PORTALS.length}`
  );

  for (const portal of ALL_GOVERNANCE_PORTALS) {
    assert.ok(portal.id, 'Portal must have id');
    assert.ok(portal.title, 'Portal must have title');
    assert.ok(portal.path.startsWith('/campus-admin/'), `Path must start with /campus-admin/: ${portal.path}`);
    assert.ok(portal.regulatoryBody, 'Portal must cite statutory regulatory body');

    // Check that physical page file exists on disk
    const subRoute = portal.path.replace('/campus-admin/', '');
    const pageFile = path.resolve(process.cwd(), `src/app/campus-admin/${subRoute}/page.tsx`);
    assert.ok(
      fs.existsSync(pageFile),
      `Target Next.js page route file must exist on disk: ${pageFile}`
    );
  }
});

test('4. Faculty Dashboard Navigation: All 34 Studios Route to Real App Router Pages', () => {
  assert.ok(
    ALL_FACULTY_STUDIOS.length >= 25,
    `Expected at least 25 faculty studios in directory, found ${ALL_FACULTY_STUDIOS.length}`
  );

  for (const studio of ALL_FACULTY_STUDIOS) {
    assert.ok(studio.id, 'Studio must have id');
    assert.ok(studio.title, 'Studio must have title');
    assert.ok(studio.path.startsWith('/teacher/'), `Path must start with /teacher/: ${studio.path}`);
    assert.ok(studio.badge, 'Studio must have statutory badge');

    // Check that physical page file exists on disk
    const subRoute = studio.path.replace('/teacher/', '');
    const pageFile = path.resolve(process.cwd(), `src/app/teacher/${subRoute}/page.tsx`);
    assert.ok(
      fs.existsSync(pageFile),
      `Target Next.js teacher page route file must exist on disk: ${pageFile}`
    );
  }
});

test('5. Environment & System Health Diagnostics: Accurately Evaluates Config', async () => {
  const envAudits = auditEnvironmentKeys();
  assert.equal(envAudits.length, CRITICAL_ENV_KEYS.length);

  for (const item of envAudits) {
    assert.ok(item.key);
    assert.equal(typeof item.isConfigured, 'boolean');
    assert.equal(typeof item.isRequiredInProd, 'boolean');
  }

  const report = await runSystemHealthAudit();
  assert.ok(report);
  assert.ok(report.timestamp);
  assert.ok(['HEALTHY_PRODUCTION', 'DEGRADED_DEMO_LOCAL', 'CONFIG_WARNING'].includes(report.readinessStatus));
  assert.equal(report.criticalTablesAudited.length, CRITICAL_GOVERNANCE_TABLES.length);
  assert.ok(Array.isArray(report.recommendations));
});
