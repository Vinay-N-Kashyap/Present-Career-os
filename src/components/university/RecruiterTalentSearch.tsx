'use client';

import React, { useState, useMemo } from 'react';
import {
  CandidateMetrics,
  EmployabilityTier,
  rankCandidatesForRecruiter,
  detectCohortSkillGaps,
} from '@/lib/admin/placement';

interface RecruiterTalentSearchProps {
  institutionId?: string;
}

export default function RecruiterTalentSearch({
  institutionId = 'inst-apex-001',
}: RecruiterTalentSearchProps) {
  const [selectedTier, setSelectedTier] = useState<'ALL' | EmployabilityTier>('ALL');
  const [minAts, setMinAts] = useState<number>(70);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [shortlistedRolls, setShortlistedRolls] = useState<Set<string>>(new Set());

  // Verified candidate pool
  const rawCandidates: CandidateMetrics[] = useMemo(() => [
    {
      studentRoll: 'CS-2026-001',
      fullName: 'Aarav Sharma',
      department: 'CSE',
      institutionId,
      atsScore: 94,
      codingPercentile: 96,
      systemsQuestCompletion: 92,
      interviewCommunicationScore: 89,
      githubProvenanceScore: 95,
      skills: ['TypeScript', 'Distributed Systems', 'PostgreSQL', 'Next.js'],
    },
    {
      studentRoll: 'CS-2026-002',
      fullName: 'Priya Patel',
      department: 'CSE',
      institutionId,
      atsScore: 90,
      codingPercentile: 92,
      systemsQuestCompletion: 88,
      interviewCommunicationScore: 94,
      githubProvenanceScore: 85,
      skills: ['Python', 'FastAPI', 'Redis', 'Machine Learning'],
    },
    {
      studentRoll: 'EC-2026-015',
      fullName: 'Rohan Varma',
      department: 'ECE',
      institutionId,
      atsScore: 82,
      codingPercentile: 78,
      systemsQuestCompletion: 74,
      interviewCommunicationScore: 80,
      githubProvenanceScore: 76,
      skills: ['Embedded C', 'IoT Firmware', 'MQTT', 'Rust'],
    },
    {
      studentRoll: 'ME-2026-042',
      fullName: 'Vikram Rao',
      department: 'MECH',
      institutionId,
      atsScore: 75,
      codingPercentile: 68,
      systemsQuestCompletion: 65,
      interviewCommunicationScore: 70,
      githubProvenanceScore: 60,
      skills: ['Python', 'Data Analytics', 'CAD/CAM'],
    },
    {
      studentRoll: 'IT-2026-088',
      fullName: 'Ananya Roy',
      department: 'IT',
      institutionId,
      atsScore: 88,
      codingPercentile: 85,
      systemsQuestCompletion: 80,
      interviewCommunicationScore: 85,
      githubProvenanceScore: 82,
      skills: ['React', 'Node.js', 'Docker', 'GraphQL'],
    },
  ], [institutionId]);

  const rankedCandidates = useMemo(() => {
    return rankCandidatesForRecruiter(
      rawCandidates,
      {
        minAtsScore: minAts,
        targetTier: selectedTier === 'ALL' ? undefined : selectedTier,
        department: selectedDept === 'ALL' ? undefined : selectedDept,
      },
      institutionId
    );
  }, [rawCandidates, selectedTier, minAts, selectedDept, institutionId]);

  const skillGaps = useMemo(() => {
    return detectCohortSkillGaps(rawCandidates, institutionId);
  }, [rawCandidates, institutionId]);

  const filteredCandidates = useMemo(() => {
    return rankedCandidates.filter((c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentRoll.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rankedCandidates, searchTerm]);

  const toggleShortlist = (roll: string) => {
    const next = new Set(shortlistedRolls);
    if (next.has(roll)) next.delete(roll);
    else next.add(roll);
    setShortlistedRolls(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Shortlist Summary */}
      <div style={{
        background: 'var(--card, #0f172a)',
        border: '1px solid #1e293b',
        borderRadius: 12,
        padding: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Campus Recruiter Portal</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0 0', color: '#f8fafc' }}>
            Verified Graduate Talent Search
          </h1>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            Candidates Filtered: <b style={{ color: '#38bdf8' }}>{filteredCandidates.length}</b> • Shortlisted: <b style={{ color: '#10b981' }}>{shortlistedRolls.size}</b>
          </div>
        </div>

        {shortlistedRolls.size > 0 && (
          <button
            onClick={() => alert(`Interview interview requests dispatched for ${shortlistedRolls.size} candidates.`)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            ✓ Request {shortlistedRolls.size} Candidate Interviews
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: 'var(--card, #0f172a)',
        border: '1px solid #1e293b',
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            type="text"
            placeholder="Search candidates by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: '#020617',
              border: '1px solid #334155',
              padding: '10px 14px',
              borderRadius: 8,
              color: '#f8fafc',
              fontSize: 13.5,
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          {/* Tier Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Target Tier:</span>
            {[
              { id: 'ALL', label: 'All Tiers' },
              { id: 'TIER_1_PRODUCT', label: 'Tier 1 (Product)' },
              { id: 'TIER_2_UNICORN', label: 'Tier 2 (Unicorn)' },
              { id: 'TIER_3_ENTERPRISE', label: 'Tier 3 (Enterprise)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: selectedTier === t.id ? '#4f46e5' : '#1e293b',
                  color: selectedTier === t.id ? '#ffffff' : '#94a3b8',
                  border: '1px solid #334155'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ATS Score Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 260 }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Min ATS Score:</span>
            <input
              type="range"
              min={40}
              max={95}
              value={minAts}
              onChange={(e) => setMinAts(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#10b981' }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981', minWidth: 32 }}>{minAts}</span>
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20
      }}>
        {filteredCandidates.map((c) => {
          const isShortlisted = shortlistedRolls.has(c.studentRoll);
          return (
            <div
              key={c.studentRoll}
              style={{
                background: 'var(--card, #0f172a)',
                border: `1px solid ${isShortlisted ? '#10b981' : '#1e293b'}`,
                borderRadius: 12,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: isShortlisted ? '0 0 16px rgba(16, 185, 129, 0.2)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#f8fafc' }}>{c.fullName}</h3>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                      <code>{c.studentRoll}</code> • {c.department}
                    </div>
                  </div>

                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    background:
                      c.tier === 'TIER_1_PRODUCT'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : c.tier === 'TIER_2_UNICORN'
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                    color:
                      c.tier === 'TIER_1_PRODUCT'
                        ? '#10b981'
                        : c.tier === 'TIER_2_UNICORN'
                        ? '#818cf8'
                        : '#f59e0b'
                  }}>
                    {c.tier.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Radar Metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8,
                  background: '#020617',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 14
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Hiring Prob.</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>{c.hiringProbabilityScore}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>ATS Resume</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>{c.radarDimensions.ats}/100</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Coding DSA</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#a78bfa' }}>{c.radarDimensions.coding}th %</div>
                  </div>
                </div>

                {/* Target Alignment */}
                <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 12 }}>
                  <b style={{ color: '#94a3b8' }}>Target Alignment: </b>
                  {c.targetCompanies.slice(0, 3).join(', ')}
                </div>

                {/* Strengths Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {c.strengths.slice(0, 2).map((s, i) => (
                    <span key={i} style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: '#1e293b',
                      color: '#94a3b8',
                      border: '1px solid #334155'
                    }}>
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => toggleShortlist(c.studentRoll)}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: 6,
                    background: isShortlisted ? '#10b981' : '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: 'pointer'
                  }}
                >
                  {isShortlisted ? '✓ Shortlisted' : '+ Shortlist Candidate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cohort Skill Gaps Telemetry */}
      {skillGaps.length > 0 && (
        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 24
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px 0' }}>
            Campus Cohort Skill Gap Radar (Accreditation & Curriculum Insights)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {skillGaps.map((gap, i) => (
              <div key={i} style={{
                background: '#020617',
                border: '1px solid #1e293b',
                padding: 12,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: 12.5, color: '#cbd5e1' }}>{gap.skillGap}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>
                  {gap.percentage}% ({gap.studentCount})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
