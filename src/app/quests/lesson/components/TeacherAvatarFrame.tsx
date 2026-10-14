import React from 'react';
import AvatarDisplay from '@/components/avatar/AvatarDisplay';

export interface LessonQuestData {
  id?: string;
  title?: string;
  desc?: string;
  syllabus?: string[];
  testDays?: string[];
  type?: string;
  language?: string;
  [key: string]: unknown;
}

export interface TeacherAvatarFrameProps {
  userId: string;
  teacherId: string;
  teacher: {
    name: string;
    avatar: string;
    accent: string;
    role?: string;
  };
  isPlaying: boolean;
  speechText: string;
  questData: LessonQuestData | null | undefined;
}

/**
 * Spec v1.2:
 * Dedicated teacher avatar panel covering ~10% screen width in bottom navigation bar.
 * Renders animated SVG avatar with live mouth movement, breathing, and presence.
 */
export function TeacherAvatarFrame({
  userId,
  teacherId,
  teacher,
  isPlaying,
  speechText,
  questData,
}: TeacherAvatarFrameProps): React.ReactElement {
  const safeTeacher = teacher || {
    name: 'Tutor',
    avatar: '👨‍🏫',
    accent: 'var(--accent)',
    role: 'Instructor'
  };

  return (
    <div
      className="teacher-avatar-docked-frame"
      data-testid="teacher-avatar-dock"
      data-speech-active={isPlaying ? 'true' : 'false'}
      title={speechText ? `${safeTeacher.name}: "${speechText.slice(0, 160)}${speechText.length > 160 ? '…' : ''}"` : `Tutor: ${safeTeacher.name}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '4px 12px 4px 6px',
        borderRadius: '16px',
        background: 'var(--bg2)',
        border: `1.5px solid ${isPlaying ? (safeTeacher.accent || 'var(--accent)') : 'var(--border)'}`,
        boxShadow: isPlaying
          ? '0 0 14px color-mix(in srgb, var(--accent) 30%, transparent)'
          : 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        flexShrink: 0,
        height: '48px',
        minWidth: '160px',
        maxWidth: '240px',
        boxSizing: 'border-box',
      }}
      aria-label={`Tutor: ${safeTeacher.name}`}
    >
      <style>{`
        .teacher-avatar-docked-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          min-width: 0;
        }
        @keyframes avatarVoicePulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(var(--brand-rgb), 0.45);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(var(--brand-rgb), 0);
          }
        }
        @keyframes barEqualizer {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @media (max-width: 639px) {
          .teacher-avatar-docked-info {
            display: none !important;
          }
          .teacher-avatar-docked-waveform {
            display: none !important;
          }
          .teacher-avatar-docked-frame {
            padding: 2px !important;
            border-radius: 50% !important;
            width: 42px !important;
            height: 42px !important;
            min-width: 42px !important;
            justify-content: center !important;
          }
        }
      `}</style>

      {/* Real Animated Avatar Portrait */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--bg3)',
          border: `1.5px solid ${isPlaying ? (safeTeacher.accent || 'var(--accent)') : 'var(--border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          animation: isPlaying ? 'avatarVoicePulse 1.8s infinite ease-in-out' : 'none',
        }}
      >
        <AvatarDisplay
          teacherId={teacherId || 'kashyap'}
          speaking={isPlaying}
          size={42}
        />

        {/* Live speaking indicator dot */}
        {isPlaying && (
          <span
            style={{
              position: 'absolute',
              bottom: '1px',
              right: '1px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--success)',
              boxShadow: '0 0 6px var(--success)',
              border: '1.5px solid var(--bg2)',
              zIndex: 3,
            }}
          />
        )}
      </div>

      {/* Teacher Name & Status (Desktop / Tablet) */}
      <div className="teacher-avatar-docked-info">
        <span
          data-testid="teacher-avatar-name"
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--t1)',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          {safeTeacher.name}
        </span>
        <span
          data-testid="teacher-avatar-status"
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: isPlaying ? 'var(--success)' : 'var(--t3)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {isPlaying ? 'Speaking...' : (safeTeacher.role || 'AI Instructor')}
        </span>
      </div>

      {/* Animated Waveform Equalizer (when speaking) */}
      {isPlaying && (
        <div
          className="teacher-avatar-docked-waveform"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5px',
            paddingLeft: '4px',
            height: '14px',
          }}
          aria-hidden="true"
        >
          {[0.2, 0.4, 0.1, 0.35].map((delay, i) => (
            <div
              key={i}
              style={{
                width: '2.5px',
                height: '12px',
                background: safeTeacher.accent || 'var(--accent)',
                borderRadius: '1px',
                animation: `barEqualizer 0.8s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
