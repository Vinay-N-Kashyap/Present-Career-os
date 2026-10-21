import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  scanContentForToxicity,
  InMemoryIncidentStore,
} from '../src/lib/admin/moderation';

describe('TASK-863: Automated Community Moderation & Toxicity Guardrails', () => {
  beforeEach(() => {
    InMemoryIncidentStore.clear();
  });

  test('allows clean academic and professional text without flagging', () => {
    const text = 'Hello team, the B+ Tree index optimization significantly reduced sequential disk seeks.';
    const res = scanContentForToxicity(text);

    assert.equal(res.isFlagged, false);
    assert.equal(res.severity, 'CLEAN');
    assert.equal(res.toxicityScore, 0);
    assert.equal(res.actionRecommended, 'ALLOW');
    assert.equal(res.censoredText, text);
  });

  test('masks profanity with asterisks and issues user warning', () => {
    const text = 'This code is pure shit and completely broken.';
    const res = scanContentForToxicity(text);

    assert.equal(res.isFlagged, true);
    assert.ok(res.matchedCategories.includes('profanity'));
    assert.equal(res.actionRecommended, 'WARN_USER');
    assert.match(res.censoredText, /\*\*\*\*/);
    assert.doesNotMatch(res.censoredText, /\bshit\b/);
  });

  test('flags harassment and escalates to review queue', () => {
    const text = 'You are worthless and should drop out of engineering.';
    const res = scanContentForToxicity(text);

    assert.equal(res.isFlagged, true);
    assert.ok(res.matchedCategories.includes('harassment'));
    assert.equal(res.severity, 'HIGH');
    assert.equal(res.actionRecommended, 'FLAG_FOR_REVIEW');
  });

  test('detects academic dishonesty and proxy test taking violations', () => {
    const text = 'Will pay me to solve my test online tomorrow?';
    const res = scanContentForToxicity(text);

    assert.equal(res.isFlagged, true);
    assert.ok(res.matchedCategories.includes('academic_dishonesty'));
    assert.equal(res.severity, 'HIGH');
    assert.match(res.censoredText, /ACADEMIC INTEGRITY VIOLATION/);
  });

  test('triggers CRITICAL_AUTO_SUSPEND on explicit exam leak phrases', () => {
    const text = 'Here is the leaked question paper for CS301 midterm!';
    const res = scanContentForToxicity(text);

    assert.equal(res.isFlagged, true);
    assert.ok(res.matchedCategories.includes('exam_leak'));
    assert.equal(res.severity, 'CRITICAL_AUTO_SUSPEND');
    assert.equal(res.actionRecommended, 'AUTO_SUSPEND_24H');
    assert.match(res.censoredText, /EXAM LEAK VIOLATION/);
  });

  test('incident store logs violations and maintains multi-tenant isolation', () => {
    const apexInc = InMemoryIncidentStore.logIncident({
      institutionId: 'inst-apex-001',
      userId: 'user-01',
      userName: 'Aarav S',
      channel: 'discussion_forum',
      text: 'Leaked exam answers free download here',
    });

    const metroInc = InMemoryIncidentStore.logIncident({
      institutionId: 'inst-metro-002',
      userId: 'user-02',
      userName: 'Vikram M',
      channel: 'mock_interview_transcript',
      text: 'This bastard interviewer was rude',
    });

    assert.ok(apexInc);
    assert.ok(metroInc);

    const apexList = InMemoryIncidentStore.getIncidents('inst-apex-001');
    assert.equal(apexList.length, 1);
    assert.equal(apexList[0].userId, 'user-01');

    const metroList = InMemoryIncidentStore.getIncidents('inst-metro-002');
    assert.equal(metroList.length, 1);
    assert.equal(metroList[0].userId, 'user-02');

    // Resolve incident
    const resolved = InMemoryIncidentStore.resolveIncident(
      apexInc.id,
      'action_taken',
      'Account suspended for 24h by Campus Admin.'
    );
    assert.equal(resolved?.status, 'action_taken');
    assert.equal(resolved?.resolutionNotes, 'Account suspended for 24h by Campus Admin.');
  });
});
