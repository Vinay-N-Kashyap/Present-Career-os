'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { RapidFireBattleSpec, RapidBattleQuestion } from '@/lib/puzzles/lessonPuzzleEngine';

interface RapidFireBattleStageProps {
  battle: RapidFireBattleSpec;
  teacherAccent?: string;
  onBattleCleared: (score: number) => void;
  playChime: () => void;
  launchConfetti: () => void;
}

export function RapidFireBattleStage({
  battle,
  teacherAccent = 'var(--accent)',
  onBattleCleared,
  playChime,
  launchConfetti,
}: RapidFireBattleStageProps) {
  const [timeLeft, setTimeLeft] = useState(battle.timeLimitSeconds || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [battleFinished, setBattleFinished] = useState(false);
  const [battleFailed, setBattleFailed] = useState(false);
  const [score, setScore] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-start battle timer on mount
  useEffect(() => {
    setIsRunning(true);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer countdown loop
  useEffect(() => {
    if (!isRunning || battleFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, battleFinished]);

  // Restart battle
  const handleRestartBattle = () => {
    setTimeLeft(battle.timeLimitSeconds || 60);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setIsAnswerLocked(false);
    setStreak(0);
    setBattleFinished(false);
    setBattleFailed(false);
    setScore(0);
    setIsRunning(true);
  };

  // Time ran out
  const handleTimeExpired = () => {
    setBattleFailed(true);
    setBattleFinished(true);
  };

  // Select an option
  const handleSelectOption = (optIdx: number) => {
    if (isAnswerLocked || battleFinished) return;
    setIsAnswerLocked(true);

    const question = battle.questions[currentQuestionIdx];
    const isCorrect = optIdx === question.correctIndex;

    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: optIdx }));

    if (isCorrect) {
      setStreak(s => s + 1);
      setScore(sc => sc + 1);
      playChime();
    } else {
      setStreak(0);
    }

    // Fast auto-advance in 350ms to keep lightning adrenaline pace!
    setTimeout(() => {
      if (currentQuestionIdx < battle.questions.length - 1) {
        setCurrentQuestionIdx(i => i + 1);
        setIsAnswerLocked(false);
      } else {
        // Battle finished!
        setIsRunning(false);
        setBattleFinished(true);
        const finalScore = isCorrect ? score + 1 : score;
        if (finalScore >= (battle.passScore || 4)) {
          launchConfetti();
        } else {
          setBattleFailed(true);
        }
      }
    }, 350);
  };

  const currentQ = battle.questions[currentQuestionIdx];
  const progressPercent = (timeLeft / (battle.timeLimitSeconds || 60)) * 100;
  
  // Timer bar color based on urgency
  let timerBarColor = '#10b981'; // green
  if (timeLeft < 30 && timeLeft >= 15) timerBarColor = '#f59e0b'; // amber
  if (timeLeft < 15) timerBarColor = '#ef4444'; // red

  return (
    <div
      data-testid="rapid-fire-battle-stage"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #090d16, #0f172a)',
        borderRadius: 16,
        border: '2px solid rgba(56, 189, 248, 0.4)',
        boxShadow: '0 8px 36px rgba(0,0,0,0.6)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 60-Second Adrenaline Top Timer Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>⚔️</span>
            <span style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8' }}>
              60-Second MCQ Battle Arena
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {streak >= 2 && (
              <span style={{ fontSize: 12, fontWeight: 900, color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: 4, animation: 'pulse 1s infinite' }}>
                🔥 {streak}x STREAK COMBO!
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(15, 23, 42, 0.8)', padding: '4px 12px', borderRadius: 20, border: `1.5px solid ${timerBarColor}` }}>
              <span style={{ fontSize: 14 }}>⏱️</span>
              <span style={{ fontSize: 15, fontWeight: 900, fontFamily: 'monospace', color: timerBarColor }}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Pulsing neon time bar */}
        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: timerBarColor,
              boxShadow: `0 0 10px ${timerBarColor}`,
              transition: 'width 1s linear, background 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Battle in Progress */}
      {!battleFinished ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 260 }}>
          {/* Question Index Pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              Question {currentQuestionIdx + 1} of {battle.questions.length}
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981' }}>
              Score: {score} Correct
            </span>
          </div>

          {/* Question Prompt */}
          <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: '2px 0 6px 0', lineHeight: 1.45, color: '#f8fafc' }}>
            {currentQ.question}
          </h3>

          {/* 4 Lightning Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
              const isRight = oIdx === currentQ.correctIndex;
              let bg = 'rgba(30, 41, 59, 0.7)';
              let border = '1px solid rgba(255,255,255,0.15)';
              let color = '#f1f5f9';

              if (isAnswerLocked && isSelected) {
                if (isRight) {
                  bg = 'rgba(16, 185, 129, 0.25)';
                  border = '1.5px solid #10b981';
                  color = '#34d399';
                } else {
                  bg = 'rgba(239, 68, 68, 0.25)';
                  border = '1.5px solid #ef4444';
                  color = '#f87171';
                }
              }

              return (
                <button
                  key={oIdx}
                  type="button"
                  data-testid={`battle-option-${oIdx}`}
                  disabled={isAnswerLocked}
                  onClick={() => handleSelectOption(oIdx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: bg,
                    border,
                    color,
                    fontSize: 13.5,
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: isAnswerLocked ? 'default' : 'pointer',
                    transition: 'all 0.1s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Battle Finished: Results Card */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', textAlign: 'center', gap: 14 }}>
          {score >= (battle.passScore || 4) && !battleFailed ? (
            <>
              <span style={{ fontSize: 48 }}>🏆</span>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#34d399', margin: 0 }}>
                VICTORY! RAPID-FIRE BATTLE CLEARED!
              </h2>
              <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 450, margin: 0, lineHeight: 1.5 }}>
                Phenomenal reflexes! You answered {score} out of {battle.questions.length} questions correctly under 60 seconds!
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  data-testid="btn-graduate-lesson"
                  onClick={() => onBattleCleared(score)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 900,
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 0 24px rgba(16, 185, 129, 0.5)',
                  }}
                >
                  🎖️ Finish Quest & Collect Rewards ▶
                </button>
              </div>
            </>
          ) : (
            <>
              <span style={{ fontSize: 44 }}>⏰</span>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#ef4444', margin: 0 }}>
                {timeLeft === 0 ? "TIME'S UP! THE CLOCK RAN OUT!" : "BATTLE INCOMPLETE"}
              </h2>
              <p style={{ fontSize: 13.5, color: '#cbd5e1', maxWidth: 450, margin: 0, lineHeight: 1.5 }}>
                You scored {score} / {battle.questions.length} (Passing target: {battle.passScore || 4}). Do not worry—speed comes with practice!
              </p>
              <button
                type="button"
                data-testid="btn-retry-battle"
                onClick={handleRestartBattle}
                style={{
                  background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#ffffff',
                  cursor: 'pointer',
                  marginTop: 8,
                  boxShadow: '0 4px 16px rgba(56, 189, 248, 0.4)',
                }}
              >
                ⚡ Retry 60-Second Battle
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
