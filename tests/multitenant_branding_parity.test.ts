import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getInstitutionTheme,
  generateThemeCSSVariables,
  validateBrandingColors,
  issueVerifiableCertificate,
  MOCK_THEMES,
} from '../src/lib/admin/branding';

describe('TASK-870: Dynamic Multi-Tenant White-Label Branding & Domain Theme Provider', () => {
  test('retrieves distinct white-label themes for individual universities', () => {
    const apexTheme = getInstitutionTheme('inst-apex-001');
    const metroTheme = getInstitutionTheme('inst-metro-002');
    const royalTheme = getInstitutionTheme('inst-royal-003');

    assert.equal(apexTheme.primaryColor, '#4f46e5');
    assert.equal(metroTheme.primaryColor, '#059669');
    assert.equal(royalTheme.primaryColor, '#d97706');

    assert.equal(apexTheme.fontFamily, 'system-ui, -apple-system, sans-serif');
    assert.equal(royalTheme.fontFamily, 'Georgia, serif');
  });

  test('falls back gracefully to default theme for unknown institution', () => {
    const fallback = getInstitutionTheme('unknown-inst');
    assert.ok(fallback);
    assert.equal(fallback.institutionId, 'inst-apex-001');
  });

  test('generates valid CSS variable dictionary for styling engines', () => {
    const theme = MOCK_THEMES['inst-apex-001'];
    const cssVars = generateThemeCSSVariables(theme);

    assert.equal(cssVars['--tenant-primary'], '#4f46e5');
    assert.equal(cssVars['--tenant-secondary'], '#818cf8');
    assert.equal(cssVars['--tenant-surface'], '#0f172a');
    assert.equal(cssVars['--tenant-radius'], '8px');
  });

  test('validates hex colors correctly', () => {
    assert.equal(validateBrandingColors('#4f46e5', '#818cf8'), true);
    assert.equal(validateBrandingColors('#123', '#456'), false); // Short hex invalid
    assert.equal(validateBrandingColors('red', 'blue'), false); // Named colors invalid
  });

  test('issues cryptographically signed verifiable degree completion certificate', () => {
    const cert = issueVerifiableCertificate({
      institutionId: 'inst-apex-001',
      studentRoll: 'CS-2026-001',
      studentName: 'Aarav Sharma',
      courseTrack: 'Full-Stack Distributed Systems Masterclass',
    });

    assert.equal(cert.institutionId, 'inst-apex-001');
    assert.equal(cert.studentName, 'Aarav Sharma');
    assert.equal(cert.degreeOrCourseTrack, 'Full-Stack Distributed Systems Masterclass');
    assert.ok(cert.certificateId.startsWith('CERT-INST-APEX-001'));
    assert.equal(typeof cert.certificateHash, 'string');
    assert.equal(cert.certificateHash.length, 64);
    assert.ok(cert.verificationUrl.includes('/verify/'));
  });
});
