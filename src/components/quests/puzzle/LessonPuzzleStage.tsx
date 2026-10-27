'use client';

import React, { useState, useEffect } from 'react';
import type { LessonPuzzleSpec, PuzzleBlock } from '@/lib/puzzles/lessonPuzzleEngine';

interface LessonPuzzleStageProps {
  puzzle: LessonPuzzleSpec;
  teacherAccent?: string;
  onPuzzleSolved: () => void;
  playChime: () => void;
  launchConfetti: () => void;
}

export function LessonPuzzleStage({
  puzzle,
  teacherAccent = 'var(--accent)',
  onPuzzleSolved,
  playChime,
  launchConfetti,
}: LessonPuzzleStageProps) {
  // Scramble initial block order
  const [placedOrder, setPlacedOrder] = useState<string[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<PuzzleBlock[]>([]);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Scramble blocks deterministically
    const scrambled = [...puzzle.blocks].sort((a, b) => {
      const hashA = a.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const hashB = b.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return hashB - hashA;
    });
    setAvailableBlocks(scrambled);
    setPlacedOrder([]);
    setIsEvaluated(false);
    setIsSuccess(false);
    setErrorMessage(null);
  }, [puzzle]);

  // Click to place block into pipeline
  const handleSelectAvailable = (blockId: string) => {
    if (isSuccess) return;
    setAvailableBlocks(prev => prev.filter(b => b.id !== blockId));
    setPlacedOrder(prev => [...prev, blockId]);
    setIsEvaluated(false);
    setErrorMessage(null);
  };

  // Click to remove block from pipeline back to inventory
  const handleRemovePlaced = (blockId: string) => {
    if (isSuccess) return;
    const block = puzzle.blocks.find(b => b.id === blockId);
    if (!block) return;
    setPlacedOrder(prev => prev.filter(id => id !== blockId));
    setAvailableBlocks(prev => [...prev, block]);
    setIsEvaluated(false);
    setErrorMessage(null);
  };

  // Move block up in sequence
  const handleMoveUp = (index: number) => {
    if (isSuccess || index === 0) return;
    setPlacedOrder(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setIsEvaluated(false);
    setErrorMessage(null);
  };

  // Move block down in sequence
  const handleMoveDown = (index: number) => {
    if (isSuccess || index === placedOrder.length - 1) return;
    setPlacedOrder(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setIsEvaluated(false);
    setErrorMessage(null);
  };

  // Verify solution against target sequence
  const handleTestSolution = () => {
    setIsEvaluated(true);

    // Check for decoys first
    if (puzzle.decoyBlockIds && puzzle.decoyBlockIds.length > 0) {
      const placedDecoyId = placedOrder.find(id => puzzle.decoyBlockIds?.includes(id));
      if (placedDecoyId) {
        const decoyBlock = puzzle.blocks.find(b => b.id === placedDecoyId);
        setErrorMessage(`Decoy Detected: "${decoyBlock?.label || 'This block'}" is an intentional trap / anti-pattern! Remove it from the pipeline.`);
        setIsSuccess(false);
        return;
      }
    }
    
    // Check length
    if (placedOrder.length !== puzzle.correctOrder.length) {
      setErrorMessage(`Incomplete pipeline: You placed ${placedOrder.length} blocks, but this solution requires exactly ${puzzle.correctOrder.length} blocks.`);
      setIsSuccess(false);
      return;
    }

    // Check exact order
    const isMatch = placedOrder.every((id, idx) => id === puzzle.correctOrder[idx]);

    if (isMatch) {
      setIsSuccess(true);
      setErrorMessage(null);
      playChime();
      launchConfetti();
    } else {
      setIsSuccess(false);
      // Find first mismatch
      const mismatchIdx = placedOrder.findIndex((id, idx) => id !== puzzle.correctOrder[idx]);
      setErrorMessage(`Misaligned Step ${mismatchIdx + 1}: The block at position ${mismatchIdx + 1} does not belong here in the logical sequence.`);
    }
  };

  // Helper color classes
  const getColorStyle = (color: PuzzleBlock['color']) => {
    switch (color) {
      case 'emerald':
        return { border: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', text: '#34d399', glow: 'rgba(16, 185, 129, 0.25)' };
      case 'cyan':
        return { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', text: '#22d3ee', glow: 'rgba(6, 182, 212, 0.25)' };
      case 'amber':
        return { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', text: '#fbbf24', glow: 'rgba(245, 158, 11, 0.25)' };
      case 'purple':
        return { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', text: '#c084fc', glow: 'rgba(168, 85, 247, 0.25)' };
      case 'rose':
        return { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', text: '#fb7185', glow: 'rgba(244, 63, 94, 0.25)' };
      case 'indigo':
        return { border: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', text: '#818cf8', glow: 'rgba(99, 102, 241, 0.25)' };
      default:
        return { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', text: '#60a5fa', glow: 'rgba(59, 130, 246, 0.25)' };
    }
  };

  return (
    <div
      data-testid="lesson-puzzle-stage"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        borderRadius: 16,
        border: '1.5px solid rgba(var(--brand-rgb), 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 2.5D Isometric ambient grid effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>🧩</span>
            <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: teacherAccent, background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 4 }}>
              Interactive 2.5D Puzzle Event
            </span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0, color: '#ffffff' }}>
            {puzzle.title}
          </h3>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0 0', lineHeight: 1.45 }}>
            {puzzle.missionPrompt}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHint(prev => !prev)}
          style={{
            background: showHint ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${showHint ? '#f59e0b' : 'rgba(255,255,255,0.15)'}`,
            color: showHint ? '#fbbf24' : '#cbd5e1',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
      </div>

      {showHint && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontSize: 12.5, lineHeight: 1.45, position: 'relative', zIndex: 1 }}>
          <strong>Hint:</strong> {puzzle.hint}
        </div>
      )}

      {/* Main 2.5D Assembly Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, position: 'relative', zIndex: 1 }}>
        
        {/* Left Column: Solution Pipeline Slot Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8' }}>
              🎯 Target Assembly ({placedOrder.length} / {puzzle.correctOrder.length} Placed)
            </span>
            {placedOrder.length > 0 && !isSuccess && (
              <button
                type="button"
                onClick={() => {
                  setAvailableBlocks(puzzle.blocks);
                  setPlacedOrder([]);
                  setIsEvaluated(false);
                  setErrorMessage(null);
                }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Reset Pipeline
              </button>
            )}
          </div>

          <div
            style={{
              minHeight: 220,
              padding: 10,
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 12,
              border: isSuccess ? '2px solid #10b981' : (isEvaluated && errorMessage ? '2px solid #ef4444' : '1.5px dashed rgba(255,255,255,0.2)'),
              boxShadow: isSuccess ? '0 0 20px rgba(16, 185, 129, 0.3)' : undefined,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'all 0.3s ease',
            }}
          >
            {placedOrder.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: '#64748b', textAlign: 'center', gap: 6 }}>
                <span style={{ fontSize: 24, opacity: 0.6 }}>📥</span>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>Click blocks on the right to snap them into this sequence</span>
              </div>
            ) : (
              placedOrder.map((blockId, idx) => {
                const block = puzzle.blocks.find(b => b.id === blockId);
                if (!block) return null;
                const cStyle = getColorStyle(block.color);
                return (
                  <div
                    key={block.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: cStyle.bg,
                      border: `1.5px solid ${cStyle.border}`,
                      boxShadow: `0 4px 12px ${cStyle.glow}`,
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 900, background: cStyle.border, color: '#0f172a', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {idx + 1}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {block.label}
                          </span>
                          {block.badge && (
                            <span style={{ fontSize: 9.5, fontWeight: 900, padding: '1px 5px', borderRadius: 4, background: cStyle.border, color: '#0f172a', letterSpacing: '0.5px' }}>
                              {block.badge}
                            </span>
                          )}
                        </div>
                        {block.subtext && (
                          <div style={{ fontSize: 11.5, fontFamily: 'monospace', color: cStyle.text, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {block.subtext}
                          </div>
                        )}
                      </div>
                    </div>

                    {!isSuccess && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveUp(idx)}
                          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ffffff', padding: '3px 6px', borderRadius: 4, cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === placedOrder.length - 1}
                          onClick={() => handleMoveDown(idx)}
                          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#ffffff', padding: '3px 6px', borderRadius: 4, cursor: idx === placedOrder.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === placedOrder.length - 1 ? 0.3 : 1 }}
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePlaced(block.id)}
                          style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '3px 6px', borderRadius: 4, cursor: 'pointer', fontSize: 11, marginLeft: 4 }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Available Blocks Inventory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>
            📦 Available Component Inventory ({availableBlocks.length} Available)
          </span>

          <div
            style={{
              minHeight: 220,
              padding: 10,
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {availableBlocks.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: '#475467', textAlign: 'center', gap: 4 }}>
                <span style={{ fontSize: 20 }}>✨</span>
                <span style={{ fontSize: 12 }}>All blocks placed into pipeline!</span>
              </div>
            ) : (
              availableBlocks.map(block => {
                const cStyle = getColorStyle(block.color);
                return (
                  <div
                    key={block.id}
                    onClick={() => handleSelectAvailable(block.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: `1px solid ${cStyle.border}`,
                      cursor: isSuccess ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>
                          {block.label}
                        </span>
                        {block.badge && (
                          <span style={{ fontSize: 9, fontWeight: 900, padding: '1px 5px', borderRadius: 4, background: cStyle.border, color: '#0f172a', letterSpacing: '0.5px' }}>
                            {block.badge}
                          </span>
                        )}
                      </div>
                      {block.subtext && (
                        <div style={{ fontSize: 11, fontFamily: 'monospace', color: cStyle.text, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {block.subtext}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 14, color: '#38bdf8', paddingLeft: 6 }}>＋</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Validation Message Box */}
      {isEvaluated && errorMessage && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {isSuccess && (
        <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981', color: '#6ee7b7', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 900 }}>
            <span>🎉</span>
            <span>PUZZLE SOLVED! INVARIANTS HARMONIZED!</span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#d1fae5', lineHeight: 1.45 }}>
            {puzzle.successExplanation}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4, position: 'relative', zIndex: 1 }}>
        {!isSuccess ? (
          <button
            type="button"
            data-testid="btn-test-puzzle"
            onClick={handleTestSolution}
            disabled={placedOrder.length === 0}
            style={{
              background: placedOrder.length === 0 ? 'rgba(255,255,255,0.1)' : teacherAccent,
              border: 'none',
              padding: '10px 24px',
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 800,
              color: '#ffffff',
              cursor: placedOrder.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: placedOrder.length > 0 ? '0 4px 14px rgba(56, 189, 248, 0.3)' : undefined,
              transition: 'all 0.2s ease',
            }}
          >
            ⚡ Test Puzzle Solution
          </button>
        ) : (
          <button
            type="button"
            data-testid="btn-enter-rapid-battle"
            onClick={onPuzzleSolved}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              padding: '12px 28px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 900,
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              animation: 'pulse 2s infinite',
            }}
          >
            ⚔️ Enter 60-Second MCQ Battle ▶
          </button>
        )}
      </div>
    </div>
  );
}
