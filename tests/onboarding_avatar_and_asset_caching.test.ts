import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Onboarding, Procedural Avatar, and Asset Caching Verification', () => {
  test('VRoidAvatarEngine and RigidAvatarMentorWidget do not assign to readonly Three.js position', () => {
    const vroidEngineFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/avatar/VRoidAvatarEngine.ts'),
      'utf8'
    );
    const rigidWidgetFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/avatar/RigidAvatarMentorWidget.tsx'),
      'utf8'
    );

    // Verify neither file uses Object.assign(..., { position: ... })
    assert.ok(
      !vroidEngineFile.includes('Object.assign(new THREE.Mesh'),
      'VRoidAvatarEngine should not use Object.assign on THREE.Mesh'
    );
    assert.ok(
      !rigidWidgetFile.includes('Object.assign(new THREE.Mesh'),
      'RigidAvatarMentorWidget should not use Object.assign on THREE.Mesh'
    );

    // Verify both files use neckMesh.position.set(0, 0.06, 0)
    assert.ok(
      vroidEngineFile.includes('neckMesh.position.set(0, 0.06, 0)'),
      'VRoidAvatarEngine should use neckMesh.position.set'
    );
    assert.ok(
      rigidWidgetFile.includes('neckMesh.position.set(0,0.06,0)') || rigidWidgetFile.includes('neckMesh.position.set(0, 0.06, 0)'),
      'RigidAvatarMentorWidget should use neckMesh.position.set'
    );
  });

  test('middleware excludes static assets and 3D models from no-store headers and matcher', () => {
    const middlewareFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/middleware.ts'),
      'utf8'
    );

    // Matcher excludes .glb, .gltf, /avatar/, /draco/, etc.
    assert.ok(
      middlewareFile.includes('avatar/'),
      'Middleware matcher must exclude avatar/'
    );
    assert.ok(
      middlewareFile.includes('glb'),
      'Middleware matcher must exclude glb'
    );
    assert.ok(
      middlewareFile.includes('isStaticAsset'),
      'Middleware must define isStaticAsset check'
    );
    // no-store must NOT apply to static assets
    assert.ok(
      middlewareFile.includes('!isStaticAsset'),
      'no-store header check must be conditioned on !isStaticAsset'
    );
  });

  test('useOnboardingWizard has non-blocking roadmap race timeout and rapid dashboard transition', () => {
    const wizardFile = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/onboarding/hooks/useOnboardingWizard.ts'),
      'utf8'
    );

    // Verify Promise.race is used with generateFusedRoadmap
    assert.ok(
      wizardFile.includes('Promise.race') && wizardFile.includes('cOS.generateFusedRoadmap(skillsArray, effectiveWeakAreas'),
      'Standard onboarding should wrap generateFusedRoadmap in Promise.race'
    );
    // Verify immediate fail-safe navigation to dashboard
    assert.ok(
      wizardFile.includes("window.location.replace('/dashboard')"),
      'goToDashboard should execute window.location.replace to /dashboard'
    );
    assert.ok(
      wizardFile.includes('markOnboardingLocallyComplete'),
      'wizard should call markOnboardingLocallyComplete to prevent back-redirects'
    );
  });

  test('/api/opportunities/feed and /api/analytics/dashboard route files exist and export GET handlers', () => {
    const oppRoute = path.resolve(process.cwd(), 'src/app/api/opportunities/feed/route.ts');
    const analyticsRoute = path.resolve(process.cwd(), 'src/app/api/analytics/dashboard/route.ts');

    assert.ok(fs.existsSync(oppRoute), '/api/opportunities/feed/route.ts must exist');
    assert.ok(fs.existsSync(analyticsRoute), '/api/analytics/dashboard/route.ts must exist');

    const oppContent = fs.readFileSync(oppRoute, 'utf8');
    const analyticsContent = fs.readFileSync(analyticsRoute, 'utf8');

    assert.ok(oppContent.includes('export async function GET'), 'Opportunities feed must export GET');
    assert.ok(analyticsContent.includes('export async function GET'), 'Analytics dashboard must export GET');
  });
});
