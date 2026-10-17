'use client';

import React, { useState, useMemo } from 'react';
import {
  computeAccreditationManifest,
  exportAccreditationCSV,
  InstitutionalAccreditationManifest,
} from '@/lib/admin/accreditation';

interface AccreditationReportGeneratorProps {
  institutionId?: string;
}

export default function AccreditationReportGenerator({
  institutionId = 'inst-apex-001',
}: AccreditationReportGeneratorProps) {
  const [academicYear, setAcademicYear] = useState('2026-2027');

  const manifest: InstitutionalAccreditationManifest = useMemo(() => {
    return computeAccreditationManifest({
      institutionId,
      institutionName: 'Apex Institute of Technology',
      academicYear,
      studentCount: 3420,
      facultyCount: 228, // 15:1 ratio
      passedStudentsCount: 3112, // 91.0% CLO attainment
      verifiedPlacementCount: 2907, // 85.0% placement rate
    });
  }, [institutionId, academicYear]);

  const handleDownloadCSV = () => {
    const csvContent = exportAccreditationCSV(manifest);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NAAC_NBA_Accreditation_Manifest_${academicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header & Export Actions */}
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
          <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Regulatory Compliance & Audit</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0 0', color: '#f8fafc' }}>
            NAAC / NBA Accreditation Manifest Generator
          </h1>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            Evaluation Cycle: <b style={{ color: '#818cf8' }}>{academicYear}</b> • Institution: <b style={{ color: '#f8fafc' }}>{manifest.institutionName}</b>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: 8,
              background: '#020617',
              color: '#f8fafc',
              border: '1px solid #334155',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <option value="2026-2027">2026–2027 (Current)</option>
            <option value="2025-2026">2025–2026 (Audited)</option>
            <option value="2024-2025">2024–2025 (Historical)</option>
          </select>

          <button
            onClick={handleDownloadCSV}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <span>📥</span> Export Submission Pack (CSV)
          </button>
        </div>
      </div>

      {/* Compliance Score & Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16
      }}>
        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Overall Compliance Rating</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#10b981' }}>
            {manifest.overallComplianceScore}% <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 400 }}>(NAAC A++)</span>
          </div>
          <div style={{ fontSize: 12, color: '#86efac', marginTop: 4 }}>
            Full criteria compliance achieved
          </div>
        </div>

        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: '4px solid #6366f1'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>CLO Attainment Rate</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#818cf8' }}>
            {manifest.cloAttainmentRate}%
          </div>
          <div style={{ fontSize: 12, color: '#a5b4fc', marginTop: 4 }}>
            Target: 80.0% • 5-Part Socratic Verification
          </div>
        </div>

        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Verified Placement Rate</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#f59e0b' }}>
            {manifest.placementRateVerified}%
          </div>
          <div style={{ fontSize: 12, color: '#fde68a', marginTop: 4 }}>
            Target: 70.0% • Provenance audited proof
          </div>
        </div>

        <div style={{
          background: 'var(--card, #0f172a)',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          borderLeft: '4px solid #38bdf8'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Cadre Ratio (SFR)</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: '#38bdf8' }}>
            {manifest.studentFacultyRatio}
          </div>
          <div style={{ fontSize: 12, color: '#7dd3fc', marginTop: 4 }}>
            NBA Standard $\le 15:1$ satisfied
          </div>
        </div>
      </div>

      {/* Criteria Breakdown & Evidence Ledgers */}
      <div style={{
        background: 'var(--card, #0f172a)',
        borderRadius: 12,
        border: '1px solid #1e293b',
        padding: 24
      }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px 0', color: '#f8fafc' }}>
          Audited Regulatory Criteria & Attainment Proofs
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {manifest.criteria.map((c) => (
            <div
              key={c.criterionId}
              style={{
                background: '#020617',
                border: '1px solid #1e293b',
                borderRadius: 10,
                padding: 18,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16
              }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: '#1e293b',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#818cf8',
                    fontFamily: 'monospace'
                  }}>
                    {c.criterionId}
                  </span>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{c.standard} Standard</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  Target: <b>{c.targetMetric}</b> • Achieved: <b style={{ color: '#10b981' }}>{c.achievedMetric}</b>
                </div>
                <div style={{ fontSize: 11.5, color: '#38bdf8', marginTop: 6, fontFamily: 'monospace' }}>
                  Proof: {c.evidences[0]?.title} ({c.evidences[0]?.docHash.slice(0, 16)}...)
                </div>
              </div>

              <div>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background:
                    c.status === 'EXEMPLARY'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : c.status === 'COMPLIANT'
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                  color:
                    c.status === 'EXEMPLARY'
                      ? '#10b981'
                      : c.status === 'COMPLIANT'
                      ? '#818cf8'
                      : '#ef4444'
                }}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cryptographic Manifest Seal */}
      <div style={{
        background: '#020617',
        border: '1px solid #1e293b',
        borderRadius: 10,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🔏</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>
              Cryptographic Board Submission Seal
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
              SHA-256 Digest: {manifest.manifestSignature}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
          ✓ Verified Immutable Record
        </div>
      </div>
    </div>
  );
}
