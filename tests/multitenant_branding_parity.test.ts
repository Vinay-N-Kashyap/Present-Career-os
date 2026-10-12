import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { STUDENT_NAV, ADMIN_NAV, TEACHER_NAV, getNav } from '../src/components/ui/AppSidebar';

test('Multi-Tenant Brand Decoupling: AppShell has no hardcoded single-tenant strings', () => {
  const appShellPath = path.resolve(process.cwd(), 'src/components/ui/AppShell.tsx');
  const content = fs.readFileSync(appShellPath, 'utf-8');

  // Must not have hardcoded "BGS Academic" or "BGS" in the header
  assert.equal(content.includes('BGS Academic'), false, 'AppShell must not contain hardcoded "BGS Academic"');
  assert.equal(content.includes('>BGS<'), false, 'AppShell must not contain hardcoded ">BGS<"');

  // Must dynamically derive institution name and initials
  assert.ok(content.includes('institutionName'), 'AppShell must compute dynamic institutionName');
  assert.ok(content.includes('institutionInitials'), 'AppShell must compute dynamic institutionInitials');
});

test('Multi-Tenant Brand Decoupling: Library E-Reader has no hardcoded institution prefix', () => {
  const libraryPath = path.resolve(process.cwd(), 'src/app/library/page.tsx');
  const content = fs.readFileSync(libraryPath, 'utf-8');

  assert.equal(content.includes('BGS Digital Library'), false, 'Library page must not contain hardcoded "BGS Digital Library"');
  assert.ok(content.includes('Digital Campus Library E-Reader'), 'Library page must use tenant-agnostic or dynamic header');
});

test('Career OS Navigation Purity: STUDENT_NAV contains zero administrative ERP links', () => {
  const forbiddenErpPrefixes = ['/admin', '/admissions', '/consultant', '/crm', '/finance', '/hostel', '/transport'];

  const allStudentHrefs: string[] = [];
  for (const section of STUDENT_NAV) {
    for (const item of section.items) {
      if ('href' in item) {
        allStudentHrefs.push(item.href);
      } else if ('children' in item) {
        allStudentHrefs.push(...item.children.map(c => c.href));
      }
    }
  }

  for (const href of allStudentHrefs) {
    for (const prefix of forbiddenErpPrefixes) {
      assert.notEqual(
        href,
        prefix,
        `STUDENT_NAV must not contain administrative ERP route: ${href}`
      );
    }
  }

  // Verify presence of core skill-acquisition routes
  const requiredStudentRoutes = ['/dashboard', '/quests', '/missions', '/arena', '/projects', '/interview', '/leaderboard'];
  for (const route of requiredStudentRoutes) {
    assert.ok(
      allStudentHrefs.includes(route),
      `STUDENT_NAV must contain essential competency route: ${route}`
    );
  }
});

test('Role-Based Navigation Resolution: getNav maps each role to its isolated surface', () => {
  assert.deepEqual(getNav('student'), STUDENT_NAV, 'Default student role gets STUDENT_NAV');
  assert.deepEqual(getNav('admin'), ADMIN_NAV, 'Admin gets ADMIN_NAV');
  assert.deepEqual(getNav('superadmin'), ADMIN_NAV, 'Superadmin gets ADMIN_NAV');
  assert.deepEqual(getNav('teacher'), TEACHER_NAV, 'Teacher gets TEACHER_NAV');
});

test('Admin Settings Isolation: RBAC guard present in settings page', () => {
  const settingsPath = path.resolve(process.cwd(), 'src/app/admin/settings/page.tsx');
  const content = fs.readFileSync(settingsPath, 'utf-8');

  assert.ok(content.includes('useAuth'), 'Admin settings page must useAuth for session inspection');
  assert.ok(content.includes("['admin', 'superadmin'].includes(user.role)"), 'Admin settings page must check admin role');
  assert.ok(content.includes("router.replace('/dashboard')"), 'Admin settings page must redirect non-admins');
});
