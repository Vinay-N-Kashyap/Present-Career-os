/**
 * Lightweight Vitest / Jest compatibility shim for Node.js native test runner (node:test)
 */
import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

export { describe, it, before, after, beforeEach, afterEach };

export function expect(actual: any) {
  const matchers = (isNot: boolean = false) => ({
    toBe(expected: any) {
      if (isNot) {
        assert.notEqual(actual, expected);
      } else {
        assert.equal(actual, expected);
      }
    },
    toEqual(expected: any) {
      if (isNot) {
        assert.notDeepEqual(actual, expected);
      } else {
        assert.deepEqual(actual, expected);
      }
    },
    toBeGreaterThan(expected: number) {
      if (isNot) {
        assert.ok(actual <= expected);
      } else {
        assert.ok(actual > expected, `Expected ${actual} > ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (isNot) {
        assert.ok(actual < expected);
      } else {
        assert.ok(actual >= expected, `Expected ${actual} >= ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      if (isNot) {
        assert.ok(actual >= expected);
      } else {
        assert.ok(actual < expected, `Expected ${actual} < ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (isNot) {
        assert.ok(actual > expected);
      } else {
        assert.ok(actual <= expected, `Expected ${actual} <= ${expected}`);
      }
    },
    toBeDefined() {
      if (isNot) {
        assert.equal(actual, undefined);
      } else {
        assert.notEqual(actual, undefined, `Expected value to be defined`);
      }
    },
    toBeUndefined() {
      if (isNot) {
        assert.notEqual(actual, undefined);
      } else {
        assert.equal(actual, undefined, `Expected value to be undefined`);
      }
    },
    toBeNull() {
      if (isNot) {
        assert.notEqual(actual, null);
      } else {
        assert.equal(actual, null, `Expected value to be null`);
      }
    },
    toBeTruthy() {
      if (isNot) {
        assert.ok(!Boolean(actual));
      } else {
        assert.ok(Boolean(actual), `Expected ${actual} to be truthy`);
      }
    },
    toBeFalsy() {
      if (isNot) {
        assert.ok(Boolean(actual));
      } else {
        assert.ok(!Boolean(actual), `Expected ${actual} to be falsy`);
      }
    },
    toBeCloseTo(expected: number, precision: number = 2) {
      const diff = Math.abs(actual - expected);
      const tolerance = Math.pow(10, -precision) / 2;
      assert.ok(diff <= tolerance, `Expected ${actual} to be close to ${expected}`);
    },
    toContain(expected: any) {
      if (typeof actual === 'string' || Array.isArray(actual)) {
        if (isNot) {
          assert.ok(!actual.includes(expected));
        } else {
          assert.ok(actual.includes(expected), `Expected collection to contain ${expected}`);
        }
      } else if (actual && typeof actual === 'object') {
        if (isNot) {
          assert.ok(!(expected in actual));
        } else {
          assert.ok(expected in actual, `Expected object to contain key ${expected}`);
        }
      }
    },
    toMatch(regex: RegExp | string) {
      const r = typeof regex === 'string' ? new RegExp(regex) : regex;
      if (isNot) {
        assert.ok(!r.test(String(actual)), `Expected ${actual} not to match ${regex}`);
      } else {
        assert.match(String(actual), r);
      }
    },
    toHaveLength(len: number) {
      const actualLen = actual?.length ?? (typeof actual === 'object' ? Object.keys(actual).length : 0);
      if (isNot) {
        assert.notEqual(actualLen, len);
      } else {
        assert.equal(actualLen, len, `Expected length ${len}, got ${actualLen}`);
      }
    },
    toThrow(expected?: string | RegExp | Error) {
      if (typeof actual !== 'function') {
        throw new Error('toThrow requires a function');
      }
      if (isNot) {
        assert.doesNotThrow(actual);
      } else if (expected instanceof RegExp) {
        assert.throws(actual, expected);
      } else if (typeof expected === 'string') {
        assert.throws(actual, (err: any) => {
          return String(err?.message || err).includes(expected);
        });
      } else {
        assert.throws(actual);
      }
    }
  });

  return {
    ...matchers(false),
    not: matchers(true)
  };
}
