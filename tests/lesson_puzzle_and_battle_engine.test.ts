import { describe, it, expect } from 'vitest';
import { 
  generateLessonPuzzle, 
  generateRapidFireBattle, 
  detectCourseDomain,
  extractLessonConceptSummary 
} from '../src/lib/puzzles/lessonPuzzleEngine';
import { getLongLesson } from '../src/lib/data/longLessons';

describe('Lesson Puzzle & Rapid-Fire Battle Engine Verification', () => {
  const sampleTracks = [
    { prefix: 'py', day: 1, expectedDomain: 'python' },
    { prefix: 'py', day: 4, expectedDomain: 'python' },
    { prefix: 'py', day: 12, expectedDomain: 'python' },
    { prefix: 'react', day: 5, expectedDomain: 'react' },
    { prefix: 'sql', day: 3, expectedDomain: 'sql' },
    { prefix: 'java', day: 1, expectedDomain: 'java' },
    { prefix: 'bcom_acc', day: 1, expectedDomain: 'accounting' },
    { prefix: 'bcom_fin', day: 5, expectedDomain: 'finance' },
    { prefix: 'bcom_ban', day: 10, expectedDomain: 'banking' },
    { prefix: 'bcom_aud', day: 8, expectedDomain: 'auditing' },
    { prefix: 'bcom_tax', day: 15, expectedDomain: 'taxation' },
    { prefix: 'bcom_law', day: 20, expectedDomain: 'corporate-law' },
    { prefix: 'bcom_ops', day: 12, expectedDomain: 'supply-chain' },
    { prefix: 'bcom_dmkt', day: 7, expectedDomain: 'digital-marketing' },
    { prefix: 'bcom_ecom', day: 14, expectedDomain: 'ecommerce' },
    { prefix: 'devops', day: 6, expectedDomain: 'devops-cloud' },
    { prefix: 'iot', day: 2, expectedDomain: 'embedded-iot' },
    { prefix: 'blockchain', day: 11, expectedDomain: 'blockchain' },
    { prefix: 'cyber', day: 9, expectedDomain: 'cybersecurity' },
    { prefix: 'node', day: 4, expectedDomain: 'nodejs' },
    { prefix: 'git', day: 3, expectedDomain: 'git-vcs' },
  ];

  it('correctly classifies domain for every key track prefix', () => {
    for (const track of sampleTracks) {
      const domain = detectCourseDomain(track.prefix, `Day ${track.day} Lesson`);
      expect(domain).toBe(track.expectedDomain);
    }
  });

  it('generates a structurally robust 2.5D puzzle for every track', () => {
    for (const track of sampleTracks) {
      const longLesson = getLongLesson(track.prefix, track.day);
      const puzzle = generateLessonPuzzle(`quest-${track.prefix}-${track.day}`, track.prefix, track.day, longLesson);

      expect(puzzle).toBeDefined();
      expect(puzzle.id).toBeTruthy();
      expect(puzzle.title.length).toBeGreaterThan(5);
      expect(puzzle.missionPrompt.length).toBeGreaterThan(15);
      expect(puzzle.blocks.length).toBeGreaterThanOrEqual(3);
      expect(puzzle.correctOrder.length).toBeGreaterThanOrEqual(3);
      expect(puzzle.hint.length).toBeGreaterThan(10);
      expect(puzzle.successExplanation.length).toBeGreaterThan(10);

      // Verify correct order points to existing blocks
      const blockIdSet = new Set(puzzle.blocks.map(b => b.id));
      for (const targetId of puzzle.correctOrder) {
        expect(blockIdSet.has(targetId)).toBe(true);
      }

      // Verify decoy blocks are not included in the correct order
      if (puzzle.decoyBlockIds && puzzle.decoyBlockIds.length > 0) {
        for (const decoyId of puzzle.decoyBlockIds) {
          expect(puzzle.correctOrder).not.toContain(decoyId);
          expect(blockIdSet.has(decoyId)).toBe(true);
        }
      }
    }
  });

  it('generates a 60-second Rapid-Fire Battle with exactly 5 calibrated questions', () => {
    for (const track of sampleTracks) {
      const longLesson = getLongLesson(track.prefix, track.day);
      const battle = generateRapidFireBattle(`quest-${track.prefix}-${track.day}`, track.prefix, track.day, longLesson);

      expect(battle).toBeDefined();
      expect(battle.timeLimitSeconds).toBe(60);
      expect(battle.passScore).toBe(4);
      expect(battle.questions).toHaveLength(5);

      for (let i = 0; i < battle.questions.length; i++) {
        const q = battle.questions[i];
        expect(q.id).toBeTruthy();
        expect(q.question.length).toBeGreaterThan(10);
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThanOrEqual(3);
        expect(q.explanation.length).toBeGreaterThan(5);
      }
    }
  });

  it('extracts concept summaries accurately from dynamic lessons', () => {
    const mockLesson = {
      title: "Asynchronous Node.js Streams and Backpressure",
      parts: [
        { title: "Part 1: Readable Stream Lifecycle", code: "const stream = fs.createReadStream('data.csv');", check: { question: "What event fires on EOF?" } },
        { title: "Part 2: Writable Stream Drainage", code: "stream.pipe(res);", check: { question: "When does drain fire?" } },
        { title: "Part 3: Transform Stream Pipeline", code: "pipeline(src, gzip, dst, err => {});", check: { question: "Why use pipeline()?" } }
      ]
    };

    const summary = extractLessonConceptSummary(mockLesson, 'node');
    expect(summary.domain).toBe('nodejs');
    expect(summary.concepts).toHaveLength(3);
    expect(summary.codeSnippets).toHaveLength(3);
    expect(summary.firstCodeLines).toHaveLength(3);
  });
});
