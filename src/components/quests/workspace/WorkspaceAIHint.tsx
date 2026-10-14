'use client';

import React, { useEffect } from 'react';
import { generateLocalSocraticHint, buildOfflineDebugTutorHint } from '@/lib/tutor/socraticHint';

export { generateLocalSocraticHint, buildOfflineDebugTutorHint };

interface WorkspaceAIHintProps {
  showAiTutorModal: boolean;
  setShowAiTutorModal: (show: boolean) => void;
  loadingAiTutor: boolean;
  aiTutorHint: string | null;
}

export function WorkspaceAIHint({
  showAiTutorModal,
  setShowAiTutorModal,
  loadingAiTutor,
  aiTutorHint,
}: WorkspaceAIHintProps) {
  useEffect(() => {
    if (!showAiTutorModal || typeof window === 'undefined') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAiTutorModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showAiTutorModal, setShowAiTutorModal]);

  if (!showAiTutorModal) return null;

  const resolvedHint = aiTutorHint || buildOfflineDebugTutorHint({});

  const handleListen = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(resolvedHint.replace(/🤖|💡|👩‍🎨|👨‍🏫|👩‍💼|👨‍💼/g, ''));
        u.rate = 1.02;
        window.speechSynthesis.speak(u);
      } catch {}
    }
  };

  return (
    <div
      data-testid="workspace-ai-hint-modal"
      role="dialog"
      aria-modal="true"
      aria-label="AI Debug Tutor Assistance"
      onClick={() => setShowAiTutorModal(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 520,
          width: '100%',
          background: 'var(--bg2)',
          border: '1px solid var(--accent)',
          borderRadius: 24,
          padding: 28,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
            🤖 AI Debug Tutor Assistance
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!loadingAiTutor && (
              <button
                type="button"
                data-testid="btn-listen-ai-hint"
                onClick={handleListen}
                style={{
                  background: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  borderRadius: 8,
                  color: 'var(--accent)',
                  padding: '4px 10px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🔊 Listen
              </button>
            )}
            <button
              type="button"
              data-testid="workspace-ai-hint-close"
              onClick={() => setShowAiTutorModal(false)}
              style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 20, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        {loadingAiTutor ? (
          <div data-testid="workspace-ai-hint-loading" style={{ padding: '30px 0', textAlign: 'center', color: 'var(--t3)' }}>
            <span>Analyzing code AST and execution stack trace... 🧠</span>
          </div>
        ) : (
          <div data-testid="workspace-ai-hint-body" style={{ whiteSpace: 'pre-wrap', fontSize: 14.5, color: 'var(--t1)', lineHeight: 1.6 }}>
            {resolvedHint}
          </div>
        )}

        <button
          type="button"
          data-testid="workspace-ai-hint-return"
          onClick={() => setShowAiTutorModal(false)}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '10px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--text)',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Return to Workspace ➔
        </button>
      </div>
    </div>
  );
}
