// src/lib/avatar/wakeWordParser.ts
/**
 * Wake-Word & Voice Intent Parser for PinIT Career OS AI Mentors (Priya / Anish).
 * 
 * Features:
 * - Word-boundary enforcement (\b) preventing substring false positives (e.g., Priyadarshini).
 * - Tolerates flexible pre-greeting punctuation (e.g., "Hey, Priya, open quests").
 * - Strips trailing punctuation cleanly so route matches receive clean command text.
 * - Detects standalone wake-words (e.g., user just says "Hey Priya") to trigger listening state.
 */

const WAKE_WORD_REGEX = /^\s*(?:(?:hey|hi|hello)[,\s]+)?(priya|anish)\b[\s,.:;!?-]*/i;

export interface WakeWordResult {
  hasWakeWord: boolean;
  mentor: 'priya' | 'anish' | null;
  command: string;
  isStandaloneWake: boolean;
}

export function parseWakeWord(transcript: unknown): WakeWordResult {
  if (typeof transcript !== 'string') {
    return { hasWakeWord: false, mentor: null, command: '', isStandaloneWake: false };
  }

  const trimmed = transcript.trim();
  if (!trimmed) {
    return { hasWakeWord: false, mentor: null, command: '', isStandaloneWake: false };
  }

  const match = trimmed.match(WAKE_WORD_REGEX);
  if (!match) {
    return {
      hasWakeWord: false,
      mentor: null,
      command: trimmed,
      isStandaloneWake: false,
    };
  }

  const mentor = match[1].toLowerCase() as 'priya' | 'anish';
  const matchedPrefixLength = match[0].length;
  const rawCommand = trimmed.slice(matchedPrefixLength).trim();

  // Clean any leading punctuation that might remain
  const cleanCommand = rawCommand.replace(/^[\s,.:;!?-]+/, '').trim();

  return {
    hasWakeWord: true,
    mentor,
    command: cleanCommand,
    isStandaloneWake: cleanCommand.length === 0,
  };
}
