/**
 * PinIT Career OS - Automated Community Moderation & Toxicity Guardrails
 * Module ID: TASK-863
 * Architecture Reference: MULTI_BRANCH_PARALLEL_EXECUTION_SOP.md & PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf
 */

export type ModerationCategory =
  | 'profanity'
  | 'harassment'
  | 'hate_speech'
  | 'academic_dishonesty'
  | 'exam_leak'
  | 'spam';

export type ToxicitySeverity =
  | 'CLEAN'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL_AUTO_SUSPEND';

export interface ModerationScanResult {
  isFlagged: boolean;
  severity: ToxicitySeverity;
  toxicityScore: number;
  matchedCategories: ModerationCategory[];
  censoredText: string;
  actionRecommended: 'ALLOW' | 'WARN_USER' | 'FLAG_FOR_REVIEW' | 'AUTO_SUSPEND_24H';
}

export interface ModerationIncident {
  id: string;
  institutionId: string;
  userId: string;
  userName: string;
  channel: 'discussion_forum' | 'peer_review' | 'mock_interview_transcript' | 'direct_message';
  originalText: string;
  censoredText: string;
  toxicityScore: number;
  severity: ToxicitySeverity;
  category: ModerationCategory;
  status: 'pending_review' | 'action_taken' | 'false_positive_dismissed';
  resolutionNotes?: string;
  timestamp: string;
}

const PROFANITY_WORDS = new Set([
  'bastard', 'bitch', 'asshole', 'fuck', 'shit', 'cunt', 'dick', 'piss'
]);

const HARASSMENT_PATTERNS = [
  /\bkill\s+yourself\b/gi,
  /\byou\s+are\s+worthless\b/gi,
  /\bshut\s+the\s+fuck\s+up\b/gi,
  /\bi\s+will\s+destroy\s+you\b/gi,
];

const ACADEMIC_DISHONESTY_PATTERNS = [
  /\b(will\s+pay(\s+me)?|pay\s+me)\s+to\s+(solve|write|take)\s+(my\s+)?(exam|test|quiz|assignment)\b/gi,
  /\bproxy\s+(attendance|exam|test|coder)\b/gi,
  /\bcheat\s+(in|on)\s+(the\s+)?(exam|test|quiz)\b/gi,
  /\bcopy\s+paste\s+without\s+citation\b/gi,
];

const EXAM_LEAK_PATTERNS = [
  /\bleaked\s+(exam|question\s+paper|midterm|final\s+paper)\b/gi,
  /\bdownload\s+(exam|test)\s+answers\s+free\b/gi,
  /\bactual\s+exam\s+questions\s+paper\b/gi,
];

export function scanContentForToxicity(text: string): ModerationScanResult {
  if (!text || !text.trim()) {
    return {
      isFlagged: false,
      severity: 'CLEAN',
      toxicityScore: 0,
      matchedCategories: [],
      censoredText: '',
      actionRecommended: 'ALLOW',
    };
  }

  const matchedCategories = new Set<ModerationCategory>();
  let toxicityScore = 0;
  let censored = text;

  // 1. Exam Leak Check (Critical)
  for (const pattern of EXAM_LEAK_PATTERNS) {
    if (pattern.test(censored)) {
      matchedCategories.add('exam_leak');
      toxicityScore += 50;
      censored = censored.replace(pattern, '[REDACTED: EXAM LEAK VIOLATION]');
    }
  }

  // 2. Academic Dishonesty Check
  for (const pattern of ACADEMIC_DISHONESTY_PATTERNS) {
    if (pattern.test(censored)) {
      matchedCategories.add('academic_dishonesty');
      toxicityScore += 40;
      censored = censored.replace(pattern, '[REDACTED: ACADEMIC INTEGRITY VIOLATION]');
    }
  }

  // 3. Harassment Check
  for (const pattern of HARASSMENT_PATTERNS) {
    if (pattern.test(censored)) {
      matchedCategories.add('harassment');
      toxicityScore += 45;
      censored = censored.replace(pattern, '[REDACTED: HARASSMENT]');
    }
  }

  // 4. Profanity Check (Apply to transformed censored string)
  const words = censored.split(/\b/);
  const censoredWords = words.map((w) => {
    const cleanWord = w.toLowerCase().trim();
    if (PROFANITY_WORDS.has(cleanWord)) {
      matchedCategories.add('profanity');
      toxicityScore += 15;
      return '*'.repeat(w.length);
    }
    return w;
  });
  censored = censoredWords.join('');

  const finalScore = Math.min(100, toxicityScore);

  let severity: ToxicitySeverity = 'CLEAN';
  let action: ModerationScanResult['actionRecommended'] = 'ALLOW';

  if (finalScore >= 80 || matchedCategories.has('exam_leak')) {
    severity = 'CRITICAL_AUTO_SUSPEND';
    action = 'AUTO_SUSPEND_24H';
  } else if (finalScore >= 40 || matchedCategories.has('harassment') || matchedCategories.has('academic_dishonesty')) {
    severity = 'HIGH';
    action = 'FLAG_FOR_REVIEW';
  } else if (finalScore >= 15 || matchedCategories.has('profanity')) {
    severity = 'MEDIUM';
    action = 'WARN_USER';
  } else if (finalScore > 0) {
    severity = 'LOW';
    action = 'ALLOW';
  }

  return {
    isFlagged: matchedCategories.size > 0,
    severity,
    toxicityScore: finalScore,
    matchedCategories: Array.from(matchedCategories),
    censoredText: censored,
    actionRecommended: action,
  };
}

export class InMemoryIncidentStore {
  private static incidents: Map<string, ModerationIncident> = new Map();

  static logIncident(params: {
    institutionId: string;
    userId: string;
    userName: string;
    channel: ModerationIncident['channel'];
    text: string;
  }): ModerationIncident | null {
    const scan = scanContentForToxicity(params.text);
    if (!scan.isFlagged) return null;

    const id = `inc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const incident: ModerationIncident = {
      id,
      institutionId: params.institutionId,
      userId: params.userId,
      userName: params.userName,
      channel: params.channel,
      originalText: params.text,
      censoredText: scan.censoredText,
      toxicityScore: scan.toxicityScore,
      severity: scan.severity,
      category: scan.matchedCategories[0] || 'profanity',
      status: 'pending_review',
      timestamp: new Date().toISOString(),
    };

    this.incidents.set(id, incident);
    return incident;
  }

  static getIncidents(institutionId: string): ModerationIncident[] {
    const list: ModerationIncident[] = [];
    for (const inc of this.incidents.values()) {
      if (inc.institutionId === institutionId) {
        list.push(inc);
      }
    }
    return list.sort((a, b) => b.toxicityScore - a.toxicityScore);
  }

  static resolveIncident(
    id: string,
    status: 'action_taken' | 'false_positive_dismissed',
    notes: string
  ): ModerationIncident | null {
    const inc = this.incidents.get(id);
    if (!inc) return null;
    inc.status = status;
    inc.resolutionNotes = notes;
    return inc;
  }

  static clear(): void {
    this.incidents.clear();
  }
}
