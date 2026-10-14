'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  {
    ssr: false,
    loading: () => (
      <div
        data-testid="vroid-loading-fallback"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(11, 17, 33, 0.85)',
          color: 'var(--t3)',
          fontSize: '11px',
          fontWeight: 600,
          gap: 6
        }}
      >
        <div style={{ animation: 'spin 1s linear infinite', fontSize: 18 }}>⬡</div>
        <span>Loading VRoid Mentor...</span>
      </div>
    )
  }
);

export interface TeacherVRoidPanelProps {
  teacherId?: string;
  teacherName?: string;
  teacherRole?: string;
  teacherAccent?: string;
  isPlaying?: boolean;
  isFullscreen?: boolean;
}

export function TeacherVRoidPanel({
  teacherId = 'kashyap',
  teacherName = 'Kashyap Sir',
  teacherRole = 'Staff Systems Architect',
  teacherAccent = 'var(--accent)',
  isPlaying = false,
  isFullscreen = false,
}: TeacherVRoidPanelProps): React.ReactElement {
  const [minimized, setMinimized] = useState(false);

  return (
    <aside
      data-testid="teacher-vroid-panel"
      className="teacher-vroid-panel"
      aria-label={`VRoid Teacher: ${teacherName}`}
      style={{
        position: 'fixed',
        bottom: isFullscreen ? 24 : 20,
        right: isFullscreen ? 28 : 24,
        width: minimized ? '150px' : '210px',
        height: minimized ? '44px' : '250px',
        zIndex: 9999,
        borderRadius: '16px',
        background: 'rgba(11, 17, 33, 0.94)',
        backdropFilter: 'blur(16px)',
        border: `1.5px solid ${isPlaying ? (teacherAccent || 'var(--accent)') : 'rgba(255, 255, 255, 0.12)'}`,
        boxShadow: isPlaying
          ? '0 10px 36px rgba(0, 0, 0, 0.7), 0 0 20px color-mix(in srgb, var(--accent) 35%, transparent)'
          : '0 8px 30px rgba(0, 0, 0, 0.55)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @keyframes vroidBarEqualizer {
          0%, 100% { transform: scaleY(0.25); }
          50% { transform: scaleY(1); }
        }
        @keyframes vroidLivePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>

      {/* Header bar: Teacher Identity & Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 10px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderBottom: minimized ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          {/* Live pulsing dot */}
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isPlaying ? 'var(--success)' : 'var(--accent)',
              boxShadow: `0 0 8px ${isPlaying ? 'var(--success)' : 'var(--accent)'}`,
              animation: isPlaying ? 'vroidLivePulse 1.2s infinite ease-in-out' : 'none',
              flexShrink: 0,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.15 }}>
            <span
              data-testid="vroid-teacher-name"
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: 'var(--t1)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {teacherName}
            </span>
            {!minimized && (
              <span
                data-testid="vroid-teacher-status"
                style={{
                  fontSize: 9.5,
                  fontWeight: 600,
                  color: isPlaying ? 'var(--success)' : 'var(--t3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {isPlaying ? 'Speaking...' : 'VRoid Live Mentor'}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Equalizer bars when speaking */}
          {isPlaying && !minimized && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                height: 12,
                paddingRight: 4,
              }}
              aria-hidden="true"
            >
              {[0.1, 0.35, 0.2, 0.4].map((delay, i) => (
                <div
                  key={i}
                  style={{
                    width: 2,
                    height: 10,
                    background: teacherAccent || 'var(--accent)',
                    borderRadius: 1,
                    animation: 'vroidBarEqualizer 0.75s ease-in-out infinite',
                    animationDelay: `${delay}s`,
                    transformOrigin: 'bottom',
                  }}
                />
              ))}
            </div>
          )}

          {/* Minimize / expand toggle button */}
          <button
            type="button"
            data-testid="btn-toggle-vroid-panel"
            onClick={() => setMinimized(prev => !prev)}
            title={minimized ? 'Expand VRoid Teacher' : 'Minimize Panel'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--t3)',
              cursor: 'pointer',
              fontSize: 11,
              padding: '2px 4px',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            {minimized ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Area */}
      {!minimized && (
        <div
          data-testid="vroid-avatar-viewport"
          style={{
            flex: 1,
            position: 'relative',
            background: 'radial-gradient(circle at 50% 40%, rgba(var(--brand-rgb), 0.14), rgba(0, 0, 0, 0.5) 85%)',
            overflow: 'hidden',
          }}
        >
          <VRoidInterviewAvatar
            teacherId={teacherId || 'kashyap'}
            animState={isPlaying ? 'talking' : 'idle'}
            zoom={1.5}
            visible={true}
          />

          {/* Role badge overlay at bottom */}
          <div
            data-testid="vroid-teacher-role"
            style={{
              position: 'absolute',
              bottom: 6,
              left: 8,
              right: 8,
              background: 'rgba(10, 15, 30, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: 8,
              padding: '3px 8px',
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--t3)',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              pointerEvents: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {teacherRole}
          </div>
        </div>
      )}
    </aside>
  );
}
