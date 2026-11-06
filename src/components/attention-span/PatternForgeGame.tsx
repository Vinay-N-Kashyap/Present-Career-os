'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameId, Difficulty, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';
import { GameShell } from './GameShell';
import { useSprintClock } from './useSprintClock';

interface PatternProblem {
  level: number;
  title: string;
  type: 'sequence' | 'attributes' | 'transform' | 'matrix' | 'multi';
  questionPrompt: string;
  sequenceDisplay?: string[];
  matrixGrid?: (string | null)[];
  options: string[];
  correctIdx: number;
  timeLimitSec: number;
}

const PROBLEMS: PatternProblem[] = [
  // Level 1: Simple Sequences
  {
    level: 1,
    title: 'Level 1: Simple Sequence Rule',
    type: 'sequence',
    questionPrompt: 'Discover the repeating shape pattern sequence:',
    sequenceDisplay: ['●', '▲', '●', '▲', '?'],
    options: ['●', '■', '▲', '◆'],
    correctIdx: 2, // ▲
    timeLimitSec: 10,
  },
  // Level 2: Multiple Attributes (Color + Shape)
  {
    level: 2,
    title: 'Level 2: Dual Attribute Rule (Color + Shape)',
    type: 'attributes',
    questionPrompt: 'Identify both the color alternation and shape pattern:',
    sequenceDisplay: ['🔴 ●', '🔵 ▲', '🔴 ●', '?'],
    options: ['🔴 ▲', '🔵 ▲', '🔴 ●', '🔵 ●'],
    correctIdx: 1, // 🔵 ▲
    timeLimitSec: 9,
  },
  // Level 3: Transformation Rule (Rotation)
  {
    level: 3,
    title: 'Level 3: Rotational Transformation Rule',
    type: 'transform',
    questionPrompt: 'Each shape undergoes a +90° clockwise rotation transformation:',
    sequenceDisplay: ['▲ (0°)', '► (90°)', '▼ (180°)', '?'],
    options: ['◄ (270°)', '▲ (0°)', '▼ (180°)', '► (90°)'],
    correctIdx: 0, // ◄ (270°)
    timeLimitSec: 8,
  },
  // Level 4: Matrix Reasoning (3x3 Progressive Matrix)
  {
    level: 4,
    title: 'Level 4: 3x3 Progressive Matrix Reasoning',
    type: 'matrix',
    questionPrompt: 'Determine the missing element in the 3x3 matrix where each row shifts symbols:',
    matrixGrid: [
      '●', '▲', '■',
      '▲', '■', '●',
      '■', '●', null
    ],
    options: ['●', '▲', '■', '◆'],
    correctIdx: 1, // ▲
    timeLimitSec: 8,
  },
  // Level 5: Multi-Rule Combined Pattern
  {
    level: 5,
    title: 'Level 5: Multi-Rule Combined Pattern',
    type: 'multi',
    questionPrompt: 'Rule 1: Color flips Red ➔ Blue. Rule 2: Digits double x2.',
    sequenceDisplay: ['🔴 2', '🔵 4', '🔴 8', '?'],
    options: ['🔵 10', '🔵 16', '🔴 16', '🔵 12'],
    correctIdx: 1, // 🔵 16
    timeLimitSec: 7,
  },
  // Level 6: High-Speed Time Pressure Mode
  {
    level: 6,
    title: 'Level 6: High-Speed Time Pressure Mode',
    type: 'multi',
    questionPrompt: 'Rule 1: Shape rotates 90°. Rule 2: Count increments by +1.',
    sequenceDisplay: ['● 1', '▲ 2', '■ 3', '?'],
    options: ['◆ 4', '● 4', '▲ 4', '■ 4'],
    correctIdx: 0, // ◆ 4
    timeLimitSec: 5,
  },
];

function pickSprintProblems<T>(pool: T[], count: number): T[] {
  const shuffled = [...pool];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled.slice(0, count);
}

export function PatternForgeGame({
  gameId,
  difficulty,
  onDifficultyChange,
  completedDifficulties,
  soundMuted,
  onComplete,
  onExit,
}: {
  gameId: GameId;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  completedDifficulties?: Record<string, Difficulty[]>;
  soundMuted: boolean;
  onComplete: (score: number, accuracyEarned: number) => void;
  onExit: () => void;
}) {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'done'>('ready');
  const [problemSet, setProblemSet] = useState<PatternProblem[]>(() => pickSprintProblems(PROBLEMS, 3));
  const [problemIdx, setProblemIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceLockedRef = useRef(false);
  const sprintRemaining = useSprintClock(phase === 'playing', () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setPhase('done');
  });
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
  }, []);

  const currentProb = problemSet[problemIdx] || problemSet[problemSet.length - 1];

  const advanceLevel = useCallback((wasCorrect: boolean, optIdx: number) => {
    if (advanceLockedRef.current) return;
    advanceLockedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(optIdx);

    setTotalAttempts(prev => prev + 1);
    if (wasCorrect) {
      playSound('correct', soundMuted);
      setCorrectCount(prev => prev + 1);
      setScore(prev => prev + (problemIdx + 1) * 20);
    } else {
      playSound('wrong', soundMuted);
    }

    transitionTimerRef.current = setTimeout(() => {
      transitionTimerRef.current = null;
      setSelectedOption(null);
      if (problemIdx + 1 < problemSet.length) {
        setProblemIdx(prev => prev + 1);
        const timeSec = difficulty === 'easy' ? 5 : 4;
        setTimeLeft(timeSec);
        startTimeRef.current = Date.now();
        advanceLockedRef.current = false;
      } else {
        playSound('win', soundMuted);
        setPhase('done');
      }
    }, 600);
  }, [problemIdx, problemSet, difficulty, soundMuted]);

  const startGame = () => {
    setPhase('playing');
    setProblemSet(pickSprintProblems(PROBLEMS, 3));
    setProblemIdx(0);
    advanceLockedRef.current = false;
    setScore(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    const timeSec = difficulty === 'easy' ? 5 : 4;
    setTimeLeft(timeSec);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (phase !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          advanceLevel(false, -1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, advanceLevel]);

  const accuracyPct = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
  const finalScore = score + (correctCount * 15);
  const accuracyEarned = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  return (
    <GameShell
      accent="pink"
      mark="pattern"
      title="Pattern Forge"
      description="Find the sequence, rotation, or matrix rule before the clock runs out."
      phase={phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={startGame} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      doneTitle="Forge closed"
      doneScore={`${finalScore} pts`}
      doneHint={`${correctCount} correct across ${totalAttempts} attempts · ${accuracyPct}%`}
      doneExtra={
        <CompletionBanner
          difficulty={difficulty}
          onNextChallenge={(nextDiff) => {
            onDifficultyChange(nextDiff);
            setPhase('countdown');
          }}
        />
      }
      onClaim={() => { onComplete(finalScore, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('countdown')}
    >

      {phase === 'playing' && (
        <>
          <div className="att-hud">
            <div className="att-hud-key"><span>{currentProb.title}</span><b>{score}</b></div>
            <div><span>Rule</span><b className={timeLeft <= 3 ? 'att-warn' : undefined}>{timeLeft}s</b></div>
            <div className="att-sprint-clock" aria-label={`${sprintRemaining} seconds remaining`}><span>Sprint</span><b>{sprintRemaining}s</b></div>
          </div>
          <div className="att-arena">
            <div className="att-board" style={{ display: 'block', width: '100%', transform: 'rotateX(6deg)' }}>
              <p className="att-sub" style={{ marginBottom: 14 }}>{currentProb.questionPrompt}</p>
              {currentProb.sequenceDisplay && (
                <div className="att-seq">
                  {currentProb.sequenceDisplay.map((item, idx) => (
                    <div key={idx} className={`att-chip${item === '?' ? ' is-ask' : ''}`}>{item}</div>
                  ))}
                </div>
              )}
              {currentProb.matrixGrid && (
                <div className="att-board" style={{ gridTemplateColumns: 'repeat(3, 64px)', margin: '12px auto 0' }}>
                  {currentProb.matrixGrid.map((item, idx) => (
                    <div key={idx} className={`att-tile${item === null ? ' is-target' : ''}`} style={{ width: 64, height: 64, cursor: 'default' }}>
                      {item === null ? '?' : item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="att-choice" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 14 }}>
            {currentProb.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentProb.correctIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`att-choice-btn${isSelected ? (isCorrect ? ' is-good' : ' is-bad') : ''}`}
                  onClick={() => advanceLevel(isCorrect, idx)}
                  disabled={selectedOption !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </>
      )}
    </GameShell>
  );
}
