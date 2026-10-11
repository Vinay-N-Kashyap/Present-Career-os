'use client';

import React from 'react';
import { AvatarTeacher } from '../interviewTypes';

interface InterviewSessionHeaderProps {
  activeTeacher: AvatarTeacher;
  activeTopicName: string;
  activeStage: string;
  elapsedSeconds: number;
  formatElapsed: (sec: number) => string;
  isScoredStage: boolean;
  isAssistModeActive: boolean;
  setIsAssistModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  messages: Array<{ role: string; content: string }>;
  fetchAssistScript: (script: string) => void;
  avatarVolume: number;
  handleVolumeChange: (newVol: number) => void;
  showCameraPreview: boolean;
  toggleCameraPreview: () => void;
  isAvatarSpeaking: boolean;
  interruptSpeech: () => void;
  exitInterview: () => void;
}

export function InterviewSessionHeader({
  activeTeacher,
  activeTopicName,
  activeStage,
  elapsedSeconds,
  formatElapsed,
  isScoredStage,
  isAssistModeActive,
  setIsAssistModeActive,
  messages,
  fetchAssistScript,
  avatarVolume,
  handleVolumeChange,
  showCameraPreview,
  toggleCameraPreview,
  isAvatarSpeaking,
  interruptSpeech,
  exitInterview
}: InterviewSessionHeaderProps) {
  const rounds = [
    { id: 'round1_behavioral', label: 'Background' },
    { id: 'round2_coding', label: 'Challenge' },
    { id: 'round3_systems', label: 'Architecture' },
    { id: 'round4_star', label: 'Deep dive' },
  ];
  const activeRoundIndex = rounds.findIndex(round => round.id === activeStage);
  const currentRound = rounds[activeRoundIndex];
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '10px 18px',
      background: 'var(--bg2)',
      borderRadius: 14,
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22 }}>{activeTeacher.emoji}</span>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--t1)' }}>
            {activeTeacher.name} ({activeTeacher.title})
          </div>
          <div style={{ fontSize: 11, color: 'var(--accent-mid)' }}>
            {currentRound ? `Round ${activeRoundIndex + 1} of ${rounds.length} · ${currentRound.label}` : 'Interview'} · {activeTopicName} · {formatElapsed(elapsedSeconds)}
          </div>
        </div>
      </div>

       </div>
       <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            title="Toggle AI Spoken Teleprompter Assist Mode"
            onClick={() => {
              const next = !isAssistModeActive;
              setIsAssistModeActive(next);
              if (next) {
                const lastMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
                if (lastMsg) fetchAssistScript(lastMsg);
              }
            }}
            style={{
              background: isAssistModeActive ? 'linear-gradient(135deg, var(--reward) 0%, var(--purple) 100%)' : 'var(--bg3)',
              border: isAssistModeActive ? '1.5px solid var(--reward)' : '1px solid var(--border)',
              color: isAssistModeActive ? '#ffffff' : 'var(--t2)',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: isAssistModeActive ? '0 0 10px rgba(var(--reward-rgb),0.5)' : 'none'
            }}
          >
            {isAssistModeActive ? '🎯 Assist Mode: ON' : '🎯 Assist Mode: OFF'}
          </button>
        </div>

        {/* Inline Avatar Volume Slider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--bg3)',
          padding: '4px 10px',
          borderRadius: 8,
          border: '1px solid var(--border)'
        }}>
          <span style={{ fontSize: 12 }}>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={avatarVolume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            style={{ width: 60, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', minWidth: 28 }}>{avatarVolume}%</span>
        </div>

        <button
          onClick={toggleCameraPreview}
          style={{
            background: showCameraPreview ? 'var(--accent-light)' : 'var(--bg3)',
            border: showCameraPreview ? '1px solid var(--accent)' : '1px solid var(--border)',
            color: showCameraPreview ? 'var(--accent)' : 'var(--t2)',
            borderRadius: 8,
            padding: '5px 12px',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          {showCameraPreview ? '📷 Self-View ON' : '📷 Self-View'}
        </button>

        {isAvatarSpeaking && (
          <button
            onClick={interruptSpeech}
            style={{
              background: 'var(--warning)',
              border: 'none',
              color: '#000',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            ✋ Interrupt &amp; Speak
          </button>
        )}

        <button
          onClick={() => {
            if (window.confirm('Exit this interview? Your current session will end and you will return to setup.')) exitInterview();
          }}
          style={{
            background: 'var(--coral-light)',
            border: '1px solid var(--coral-mid)',
            color: 'var(--coral-mid)',
            borderRadius: 8,
            padding: '5px 14px',
            fontSize: 12,
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          ✕ Exit Session
        </button>
      </div>
      <div aria-label="Interview progress" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
        {rounds.map((round, index) => {
          const complete = activeStage === 'results' || index < activeRoundIndex;
          const current = index === activeRoundIndex;
          return <div key={round.id} style={{ minWidth: 0 }}>
            <div style={{ height: 4, borderRadius: 99, background: complete || current ? 'var(--accent)' : 'var(--bg3)', opacity: current ? 1 : 0.65 }} />
            <div style={{ marginTop: 4, fontSize: 10, fontWeight: current ? 900 : 700, color: current ? 'var(--accent-mid)' : 'var(--t3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {index + 1}. {round.label}
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}
