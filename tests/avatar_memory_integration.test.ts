// tests/avatar_memory_integration.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildMentorSystemPrompt,
  BaseMentorContext,
} from '../src/lib/avatar/mentorPromptBuilder';

import {
  TriStateMemoryResult,
  AvatarMemory,
} from '../src/lib/avatar/memoryStore';

const BASE_CONTEXT: BaseMentorContext = {
  studentName: 'Rahul',
  targetRole: '3D Graphics Engine Architect',
  questTitle: 'G3D Day 26: Hi-Z Occlusion Culling',
  missingSkills: ['Hi-Z Occlusion', 'Reverse-Z Buffer'],
  atsScore: 78,
  teacherId: 'priya',
};

// ============================================================================
// SUITE 1: Legacy Mode Invariant (Zero Regression when Feature Flag is OFF)
// ============================================================================
test('PromptBuilder: Legacy mode produces exact legacy prompt without memory block', () => {
  const prompt = buildMentorSystemPrompt(BASE_CONTEXT, undefined, 'v1_legacy');
  
  assert.match(prompt, /You are an elite, empathetic Technical Career Mentor/);
  assert.match(prompt, /Persona: priya/);
  assert.match(prompt, /Active Learning Quest: "G3D Day 26: Hi-Z Occlusion Culling"/);
  assert.match(prompt, /Current ATS Resume Score: 78\/100/);
  // P0 Invariant: Must NOT contain V2 memory block
  assert.doesNotMatch(prompt, /PERSONALIZED AVATAR MEMORY \(V2\)/);
});

// ============================================================================
// SUITE 2: V2 Tri-State Memory Resolution
// ============================================================================
test('PromptBuilder: Injects engagement index and persistent notes on SUCCESS', () => {
  const memoryPayload: TriStateMemoryResult = {
    status: 'SUCCESS',
    memory: {
      userId: 'student_123',
      persona: { style: 'Encouraging & Fast-Paced' },
      memories: [
        { data: 'Target company: Nvidia' },
        { data: 'Mastered Linear Blend Skinning' },
      ],
      conversationHistory: [],
      relationshipState: { interactionCount: 15 },
    },
  };

  const prompt = buildMentorSystemPrompt(BASE_CONTEXT, memoryPayload, 'v2_advisor');

  assert.match(prompt, /PERSONALIZED AVATAR MEMORY \(V2\)/);
  assert.match(prompt, /Engagement Index: (?:0\.[0-9]+|1\.00)\/1\.00/);
  assert.match(prompt, /Target company: Nvidia/);
  assert.match(prompt, /Mastered Linear Blend Skinning/);
  assert.match(prompt, /Inferred Style: Encouraging & Fast-Paced/);
});

test('PromptBuilder: Directs warm onboarding on NOT_FOUND (first-time user)', () => {
  const emptyPayload: TriStateMemoryResult = {
    status: 'NOT_FOUND',
    memory: {
      userId: 'new_student',
      persona: {},
      memories: [],
      conversationHistory: [],
      relationshipState: {},
    },
  };

  const prompt = buildMentorSystemPrompt(BASE_CONTEXT, emptyPayload, 'v2_advisor');

  assert.match(prompt, /PERSONALIZED AVATAR MEMORY \(V2\)/);
  assert.match(prompt, /Authentic first-time student onboarding session/);
  assert.match(prompt, /Welcome them warmly to PinIT Career OS/);
});

test('PromptBuilder: Directs graceful degradation on ERROR without failing', () => {
  const errorPayload: TriStateMemoryResult = {
    status: 'ERROR',
    error: 'SUPABASE_TIMEOUT_503',
    memory: {
      userId: 'student_123',
      persona: {},
      memories: [],
      conversationHistory: [],
      relationshipState: {},
    },
  };

  const prompt = buildMentorSystemPrompt(BASE_CONTEXT, errorPayload, 'v2_advisor');

  assert.match(prompt, /PERSONALIZED AVATAR MEMORY \(V2\)/);
  assert.match(prompt, /Persistent memory store temporarily offline/);
  assert.match(prompt, /SUPABASE_TIMEOUT_503/);
  assert.match(prompt, /Acknowledge the active session context gracefully/);
});
