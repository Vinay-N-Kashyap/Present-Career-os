'use client';

import { useMemo } from 'react';
import DashboardAttendanceMarker from './DashboardAttendanceMarker';
import { useCareerOS } from '@/lib/context/CareerOSContext';

const EVO_STAGES = [
  { stage: 1, icon: '🌱', name: 'Syntax & Logic Novice', minScore: 0, desc: 'Variables, loops & conditional logic' },
  { stage: 2, icon: '⚙️', name: 'Algorithmic Problem Solver', minScore: 21, desc: 'Data structures, complexity & clean OOP' },
  { stage: 3, icon: '🚀', name: 'Full-Stack Developer', minScore: 41, desc: 'React, Node.js & relational schemas' },
  { stage: 4, icon: '⚡', name: 'Systems Architect', minScore: 61, desc: 'Microservices, caching & cloud pipelines' },
  { stage: 5, icon: '🏆', name: 'Placement Ready Engineer', minScore: 81, desc: 'Interview-cleared & high-scale ready' },
];

interface Props {
  careerScore: number;
  dnaScore: number;
  activeTrack: 'sde' | 'iot';
  contributionDates: Date[];
  getContributionsForDate: (date: Date) => number;
  activeStageIndex: number;
  learningMistakes?: any[];
}

export default function DashboardBentoGrid({
  careerScore, dnaScore, activeTrack,
  contributionDates, getContributionsForDate,
  activeStageIndex, learningMistakes = [],
}: Props) {
  const cOS = useCareerOS();
  const accentRgb = activeTrack === 'iot' ? '20,184,166' : '99,102,241';
  const accentVar = activeTrack === 'iot' ? 'var(--teal-mid)' : 'var(--accent)';

  // Authentic trigonometric radar polygon calculation (Center 60,60, R=48)
  const radarPoints = useMemo(() => {
    const ob = cOS?.onboardingAnswers;
    const arch = ob?.mindset_archetype || ob?.voice_archetype || '';
    const completedCount = cOS?.completedQuests?.length || 0;
    const vaultCount = cOS?.vaultItems?.length || 0;

    let codingScore = careerScore > 0 ? careerScore : (completedCount > 0 ? Math.min(100, completedCount * 15) : 0);
    if (codingScore > 0 && arch.includes('Pattern Hunter')) codingScore = Math.min(100, codingScore + 5);

    let archScore = (careerScore > 0 || dnaScore > 0)
      ? Math.round((careerScore * 0.7) + (dnaScore * 0.3))
      : (vaultCount > 0 ? Math.min(100, vaultCount * 15) : 0);
    if (archScore > 0 && arch.includes('Explorer')) archScore = Math.min(100, archScore + 5);

    let dataScore = dnaScore > 0 ? dnaScore : (completedCount > 0 ? Math.min(100, completedCount * 10) : 0);
    if (dataScore > 0 && arch.includes('Stabilizer')) dataScore = Math.min(100, dataScore + 5);

    const trust = cOS?.trustScore ?? 0;
    let socraticScore = trust > 0 ? trust : 0;
    if (socraticScore > 0 && arch.includes('Social IQ')) socraticScore = Math.min(100, socraticScore + 5);

    let iotScore = activeTrack === 'iot'
      ? (careerScore > 0 ? careerScore : 0)
      : Math.round(careerScore * 0.5);

    const scores = [codingScore, archScore, dataScore, socraticScore, iotScore];
    const angles = [0, 72, 144, 216, 288];

    return scores.map((score, i) => {
      const clamped = Math.max(0, Math.min(100, score || 0));
      const r = (clamped / 100) * 46;
      const rad = angles[i] * (Math.PI / 180);
      const x = +(60 + r * Math.sin(rad)).toFixed(1);
      const y = +(60 - r * Math.cos(rad)).toFixed(1);
      return `${x},${y}`;
    }).join(' ');
  }, [careerScore, dnaScore, activeTrack, cOS?.onboardingAnswers, cOS?.completedQuests?.length, cOS?.vaultItems?.length, cOS?.trustScore]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Row 1: Evolution Timeline (full width) */}
      <div className="db-glass" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          <div>
            <span className="db-label">🧬 ENGINEERING GROWTH TRACK</span>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
              Stage: <span style={{ color: 'var(--accent)' }}>{EVO_STAGES[activeStageIndex]?.icon} {EVO_STAGES[activeStageIndex]?.name}</span> &middot; Level {activeStageIndex + 1} of 5
            </h3>
          </div>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--t2)', background: 'var(--bg3)', padding: '4px 10px', borderRadius: 8, border: '1px solid var(--border)' }}>
            DNA Mastery: <strong style={{ color: 'var(--accent)' }}>{careerScore}</strong>/100
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '12px 0', margin: '4px 0' }}>
          {/* Base Track line */}
          <div style={{ position: 'absolute', left: '6%', right: '6%', height: 3, background: 'rgba(255,255,255,0.06)', zIndex: 0, borderRadius: 2 }} />
          {/* Active Progress line */}
          <div style={{ position: 'absolute', left: '6%', width: `${Math.min(88, activeStageIndex * 22)}%`, height: 3, background: 'linear-gradient(90deg, var(--accent), #10b981)', zIndex: 0, transition: 'width 0.6s ease', boxShadow: '0 0 10px rgba(99,102,241,0.5)', borderRadius: 2 }} />
          
          {EVO_STAGES.map((step, idx) => {
            const active = idx <= activeStageIndex;
            const current = idx === activeStageIndex;
            return (
              <div key={step.stage} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '18%', textAlign: 'center' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: current ? 'linear-gradient(135deg, var(--accent), #4f46e5)' : active ? 'rgba(99,102,241,0.2)' : 'var(--bg3)',
                  border: `2px solid ${current ? '#fff' : active ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  boxShadow: current ? '0 0 16px rgba(99,102,241,0.6)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}>
                  {step.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: current ? 800 : active ? 700 : 500, color: current ? 'var(--accent)' : active ? 'var(--t1)' : 'var(--t4)', marginTop: 8, whiteSpace: 'nowrap' }}>
                  {step.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3, display: current ? 'block' : 'none', maxWidth: 110, lineHeight: 1.3, fontFamily: 'var(--font-mono)' }}>
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: '8px 0 0', lineHeight: 1.5 }}>
          Clear coding quests, pass lab experiments, verify vault credentials, and pass mock interviews to rank up to Placement Ready.
        </p>
      </div>

      {/* Row 1.5: Campus Attendance Marker & 75% Eligibility HUD */}
      <DashboardAttendanceMarker />

      {/* Row 2: Radar + Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>

        {/* Competencies Radar */}
        <div className="db-glass" style={{ padding: 20 }}>
          <span className="db-label">📊 SOCRATIC COMPETENCIES RADAR</span>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 14px', fontFamily: 'var(--font-display)' }}>
            Multi-Dimensional Skills
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <svg viewBox="0 0 120 120" style={{ width: 190, height: 190, overflow: 'visible' }}>
              {[0.25, 0.5, 0.75, 1.0].map((scale, i) => (
                <polygon
                  key={i}
                  points={[0, 72, 144, 216, 288].map(ang => {
                    const r = 46 * scale;
                    const rad = ang * (Math.PI / 180);
                    return `${+(60 + r * Math.sin(rad)).toFixed(1)},${+(60 - r * Math.cos(rad)).toFixed(1)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.8"
                />
              ))}
              {[0, 72, 144, 216, 288].map((ang, i) => {
                const rad = ang * (Math.PI / 180);
                const x2 = +(60 + 46 * Math.sin(rad)).toFixed(1);
                const y2 = +(60 - 46 * Math.cos(rad)).toFixed(1);
                return <line key={i} x1="60" y1="60" x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />;
              })}
              <polygon
                points={radarPoints}
                fill={`rgba(${accentRgb},0.22)`}
                stroke={accentVar}
                strokeWidth="1.8"
                style={{ transition: 'all 0.5s ease' }}
              />
              <text x="60" y="8" fill="var(--t3)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle">CODING</text>
              <text x="110" y="44" fill="var(--t3)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle">AF</text>
              <text x="96" y="112" fill="var(--t3)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle">DATA</text>
              <text x="24" y="112" fill="var(--t3)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle">SOCRATIC</text>
              <text x="10" y="44" fill="var(--t3)" fontSize="6" fontFamily="var(--font-mono)" textAnchor="middle">IoT</text>
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 10, fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: activeTrack === 'sde' ? 'var(--accent)' : 'var(--teal-mid)' }} />
              Live Competency Profile
            </span>
          </div>
        </div>

        {/* Heatmap with Right-Aligned Legend to eliminate text collisions */}
        <div className="db-glass" style={{ padding: 20 }}>
          <span className="db-label">🔥 SOCRATIC CONTRIBUTION TRACKER</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, margin: '2px 0 14px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: 0, fontFamily: 'var(--font-display)' }}>
              Learning Activity &amp; Attendance Heatmap
            </h3>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
              84-Day Consistency Grid
            </span>
          </div>
          <style>{`
            .db-hcell { position: relative; }
            .db-hcell:hover::after, .db-hcell:focus-visible::after { content: attr(data-tip); position:absolute; bottom:140%; left:50%; transform:translateX(-50%); background:#111827; color:#f3f4f6; border:1px solid rgba(255,255,255,0.08); padding:3px 7px; border-radius:4px; font-size:10px; font-family:var(--font-mono); white-space:nowrap; z-index:9999; pointer-events:none; }
            .db-hcell:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; z-index: 10; }
          `}</style>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Month row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 4, paddingLeft: 24, fontSize: 9.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
              {Array.from({ length: 12 }).map((_, ci) => {
                const ws = contributionDates[ci * 7];
                const show = ci === 0 || (ws && ws.getMonth() !== contributionDates[(ci - 1) * 7]?.getMonth());
                return <div key={ci} style={{ visibility: show ? 'visible' : 'hidden' }}>{ws ? ws.toLocaleString('default', { month: 'short' }) : ''}</div>;
              })}
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
              {/* Day labels */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 104, fontSize: 9.5, color: 'var(--t3)', paddingRight: 4, fontFamily: 'var(--font-mono)', lineHeight: '12px' }}>
                <span>Sun</span><span>Tue</span><span>Thu</span><span>Sat</span>
              </div>
              {/* Grid */}
              <div role="grid" aria-label="Learning Activity Contribution Heatmap" style={{ display: 'grid', gridTemplateRows: 'repeat(7,1fr)', gridAutoFlow: 'column', gap: 3.5, flex: 1, height: 104 }}>
                {contributionDates.map((date, idx) => {
                  const cnt = getContributionsForDate(date);
                  const lv = cnt === 0 ? 0 : cnt === 1 ? 1 : cnt === 2 ? 2 : 3;
                  const fut = date > new Date();
                  let bg = fut ? 'rgba(255,255,255,0.01)' : lv === 0 ? 'rgba(255,255,255,0.03)' : lv === 1 ? `rgba(${accentRgb},0.2)` : lv === 2 ? `rgba(${accentRgb},0.55)` : accentVar;
                  const tip = fut ? 'Future' : `${cnt} contribution${cnt !== 1 ? 's' : ''} on ${date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                  return (
                    <div 
                      key={idx} 
                      role="gridcell"
                      tabIndex={fut ? -1 : 0}
                      aria-label={tip}
                      title={tip}
                      data-tip={tip} 
                      className="db-hcell" 
                      style={{ aspectRatio: '1', background: bg, border: '1px solid var(--border)', borderRadius: 2, cursor: fut ? 'default' : 'pointer' }} 
                    />
                  );
                })}
              </div>
            </div>

            {/* Legend - Cleanly aligned to the right, zero text overlap */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--t3)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
              <span>Less</span>
              <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {[0, 1, 2, 3].map(lv => (
                  <div
                    key={lv}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: lv === 0 ? 'rgba(255,255,255,0.03)' : lv === 1 ? `rgba(${accentRgb},0.2)` : lv === 2 ? `rgba(${accentRgb},0.55)` : accentVar,
                      border: lv === 0 ? '1px solid var(--border)' : 'none'
                    }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: AI Mistakes widget (if present) */}
      {learningMistakes.length > 0 && (
        <div className="db-glass" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <span className="db-label">⚠️ AI MISTAKES &amp; REMEDIATION</span>
              <h3 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', margin: '2px 0 0' }}>Unresolved Knowledge Gaps</h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--coral-mid)', background: 'var(--coral-light)', padding: '2px 8px', borderRadius: 8 }}>
              {learningMistakes.length} active
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {learningMistakes.slice(0, 2).map((m: any) => (
              <div key={m.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 8, padding: 9 }}>
                <span style={{ fontSize: 11, background: 'var(--coral-light)', color: 'var(--coral-mid)', padding: '1px 5px', borderRadius: 4, fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>{m.type}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.module}</div>
                  <div style={{ fontSize: 11, color: 'var(--t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{m.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
