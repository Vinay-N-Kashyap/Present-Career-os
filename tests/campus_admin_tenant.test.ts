import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveTenantFromHost,
  resolveTenantFromHeader,
  enforceTenantAccess,
  withTenantFilter,
  verifyTenantIsolationPolicy,
  TenantIsolationError,
  MOCK_INSTITUTIONS,
} from '../src/lib/admin/tenant';

describe('TASK-851: Multi-Tenant Campus Isolation & RLS Interceptor', () => {
  test('resolves tenant correctly from known subdomains', () => {
    const inst = resolveTenantFromHost('apex.pinit.edu');
    assert.ok(inst, 'Expected institution to resolve');
    assert.equal(inst.id, 'inst-apex-001');
    assert.equal(inst.name, 'Apex Institute of Technology');
    assert.equal(inst.tier, 'enterprise');
  });

  test('resolves tenant from custom vanity domain mapping', () => {
    const customMap = { 'careers.apex-tech.org': 'inst-apex-001' };
    const inst = resolveTenantFromHost('careers.apex-tech.org', customMap);
    assert.ok(inst);
    assert.equal(inst.id, 'inst-apex-001');
  });

  test('returns null for unregistered or invalid domains without crashing', () => {
    assert.equal(resolveTenantFromHost('unknown-university.com'), null);
    assert.equal(resolveTenantFromHost(''), null);
    assert.equal(resolveTenantFromHost(null as any), null);
  });

  test('extracts tenant id from Headers object or dictionary', () => {
    const headersObj = { 'x-institution-id': 'inst-metro-002' };
    assert.equal(resolveTenantFromHeader(headersObj), 'inst-metro-002');

    const headersMixedCase = { 'X-Institution-Id': 'inst-royal-003' };
    assert.equal(resolveTenantFromHeader(headersMixedCase), 'inst-royal-003');

    assert.equal(resolveTenantFromHeader({}), null);
    assert.equal(resolveTenantFromHeader(null as any), null);
  });

  test('enforces strict tenant access and throws on cross-tenant leak attempts', () => {
    // Legitimate access
    assert.doesNotThrow(() => {
      enforceTenantAccess('inst-apex-001', 'inst-apex-001');
    });

    // Cross-tenant breach attempt
    assert.throws(
      () => {
        enforceTenantAccess('inst-apex-001', 'inst-metro-002');
      },
      (err: any) => {
        assert.ok(err instanceof TenantIsolationError);
        assert.equal(err.code, 'CROSS_TENANT_LEAK_ATTEMPT');
        assert.equal(err.statusCode, 403);
        return true;
      }
    );

    // Missing active tenant context
    assert.throws(
      () => {
        enforceTenantAccess('', 'inst-metro-002');
      },
      (err: any) => {
        assert.ok(err instanceof TenantIsolationError);
        assert.equal(err.code, 'TENANT_CONTEXT_MISSING');
        return true;
      }
    );
  });

  test('withTenantFilter tags objects with immutable institution_id', () => {
    const student = { name: 'Aarav Sharma', roll: 'CS-2026-042', gpa: 3.9 };
    const tagged = withTenantFilter(student, 'inst-apex-001');

    assert.equal(tagged.institution_id, 'inst-apex-001');
    assert.equal(tagged.name, 'Aarav Sharma');
    assert.equal(tagged.roll, 'CS-2026-042');

    // Throws on empty tenantId
    assert.throws(() => {
      withTenantFilter(student, '');
    });
  });

  test('verifyTenantIsolationPolicy validates outgoing queries for RLS compliance', () => {
    // Valid query
    const valid = verifyTenantIsolationPolicy(
      { table: 'students', filterTenantId: 'inst-apex-001' },
      'inst-apex-001'
    );
    assert.equal(valid.valid, true);

    // Missing filter
    const missingFilter = verifyTenantIsolationPolicy(
      { table: 'students' },
      'inst-apex-001'
    );
    assert.equal(missingFilter.valid, false);
    assert.match(missingFilter.reason || '', /lacks required institution_id filter/);

    // Mismatched filter
    const mismatched = verifyTenantIsolationPolicy(
      { table: 'students', filterTenantId: 'inst-royal-003' },
      'inst-apex-001'
    );
    assert.equal(mismatched.valid, false);
    assert.match(mismatched.reason || '', /does not match active security context/);
  });
});
