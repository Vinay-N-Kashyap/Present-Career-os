/**
 * Client-safe pattern helpers for detecting when a student is asking AI Mentor (Ms. Priya)
 * to launch or teach a specific course day or curriculum topic, so client-side voice routers
 * do not hijack the utterance to a generic `/quests` or `autostart=lesson` page.
 */

const DAY_NUMBER_REGEX = /\b(?:day|lesson|module|session)\s*(?:#\s*)?(?:[1-9]|[1-5]\d|60)\b/i;

const TUTOR_OR_LAUNCH_VERB_REGEX =
  /\b(?:don'?t\s+understand|do\s+not\s+understand|did\s+not\s+understand|didn'?t\s+understand|confused|stuck|explain|teach\s+me|teach|help\s+me|walk\s+me\s+through|break\s+down|what\s+is|how\s+does|start|open|launch|begin|resume|study)\b/i;

const COURSE_OR_TOPIC_REGEX =
  /\b(?:python\s*ai|ai\s*python|python|sql|database|react|node(?:\.?js)?|javascript|full[\s-]?stack|dsa|algorithms?|java|cloud|devops|iot|embedded|accounting|finance|marketing|audit|banking|e[\s-]?commerce|tax|law|variables?|loops?|softmax|transformers?|attention|joins?|recursion|hooks?|closures?|pointers?)\b/i;

export function isSpecificLessonRequest(text: string): boolean {
  const clean = String(text || '').trim();
  if (clean.length < 4) return false;
  if (DAY_NUMBER_REGEX.test(clean)) return true;
  if (TUTOR_OR_LAUNCH_VERB_REGEX.test(clean) && COURSE_OR_TOPIC_REGEX.test(clean)) return true;
  return false;
}

export type LessonContinuationCommand =
  | 'next_part'
  | 'prev_part'
  | 'quiz'
  | 'example'
  | 'launch_current';

export function isLessonContinuationIntent(text: string): LessonContinuationCommand | null {
  const lower = String(text || '').toLowerCase().trim();
  if (!lower) return null;

  if (/\b(?:start|open|launch)\b.*\b(?:full\s+lesson|this\s+lesson|that\s+lesson|classroom|interactive)\b/.test(lower)) {
    return 'launch_current';
  }
  if (/\b(?:next\s+part|next\s+step|continue\s+(?:lesson|teaching|part)|keep\s+going|move\s+on)\b/.test(lower)) {
    return 'next_part';
  }
  if (/\b(?:previous\s+part|prev\s+part|go\s+back|repeat\s+that|still\s+confused)\b/.test(lower)) {
    return 'prev_part';
  }
  if (/\b(?:quiz\s+me|test\s+me|ask\s+me\s+a\s+question|check\s+my\s+understanding)\b/.test(lower)) {
    return 'quiz';
  }
  if (/\b(?:give\s+me\s+an\s+example|show\s+(?:an\s+)?example|show\s+code|code\s+example)\b/.test(lower)) {
    return 'example';
  }
  return null;
}
