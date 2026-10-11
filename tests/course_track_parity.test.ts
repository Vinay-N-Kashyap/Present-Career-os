import test from 'node:test';
import assert from 'node:assert/strict';
import { ENABLED_COURSES, isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { COURSES_CATALOG } from '../src/lib/data/coursesCatalog';

test('Block 3 Invariant: ENABLED_COURSES covers all released courses including IoT, systems and B.Com', () => {
  const requiredPrefixes = [
    'python',
    'sql-mastery',
    'dsa-py',
    'ai-py',
    'dist-py',
    'react-basics',
    'node-web',
    'dsa-optim',
    'devops',
    'cloud',
    'cyber',
    'iot_edge',
    'iot_sec',
    'bcom_ops',
    'bcom-accounting',
    'fullstack-js',
    'java-basics'
  ];

  for (const prefix of requiredPrefixes) {
    assert.ok(ENABLED_COURSES.includes(prefix), `ENABLED_COURSES must include "${prefix}"`);
    assert.strictEqual(isCourseVisualsEnabled(prefix), true, `isCourseVisualsEnabled("${prefix}") must be true`);
  }

  // Safety boundary
  assert.strictEqual(isCourseVisualsEnabled('unknown-prefix-999'), false, 'Unknown prefixes must remain disabled');
});

test('Block 3 Invariant: COURSES_CATALOG has 37 masterclasses with valid metadata', () => {
  assert.strictEqual(COURSES_CATALOG.length, 37, 'Catalog must contain 37 courses');
  for (const course of COURSES_CATALOG) {
    assert.ok(course.id.startsWith('course-'), `Course ID "${course.id}" must start with course-`);
    assert.ok(course.title && course.title.trim().length > 0, `Course "${course.id}" must have a title`);
    assert.ok(course.desc && course.desc.trim().length > 0, `Course "${course.id}" must have a description`);
    assert.ok(course.durationWeeks > 0, `Course "${course.id}" must have positive duration`);
  }
});

test('Block 3 Invariant: COURSES_REGISTRY has all courses populated with block tests', () => {
  assert.ok(COURSES_REGISTRY.length >= 37, 'Registry must have at least 37 courses');
  for (const course of COURSES_REGISTRY) {
    assert.ok(course.quests && course.quests.length >= 30, `Course "${course.id}" must have at least 30 quests`);
  }
});
