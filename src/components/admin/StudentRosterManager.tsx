'use client';

import React, { useState, useEffect } from 'react';
import {
  parseStudentRosterCSV,
  InMemoryRosterStore,
  StudentRosterRecord,
  RosterIngestionResult,
} from '@/lib/admin/roster';

interface StudentRosterManagerProps {
  institutionId: string;
}

export default function StudentRosterManager({ institutionId }: StudentRosterManagerProps) {
  const [students, setStudents] = useState<StudentRosterRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [ingestionResult, setIngestionResult] = useState<RosterIngestionResult | null>(null);

  // Pre-seed demo students if store is empty
  useEffect(() => {
    let existing = InMemoryRosterStore.getStudentsByInstitution(institutionId);
    if (existing.length === 0) {
      InMemoryRosterStore.upsertStudents([
        {
          rollNumber: 'CS-2026-001',
          fullName: 'Aarav Sharma',
          email: 'aarav.sharma@apex.edu',
          department: 'CSE',
          batchYear: 2026,
          currentSemester: 6,
          cgpa: 8.92,
          status: 'active',
          institutionId,
        },
        {
          rollNumber: 'CS-2026-002',
          fullName: 'Priya Patel',
          email: 'priya.patel@apex.edu',
          department: 'CSE',
          batchYear: 2026,
          currentSemester: 6,
          cgpa: 9.35,
          status: 'active',
          institutionId,
        },
        {
          rollNumber: 'EC-2026-015',
          fullName: 'Rohan Varma',
          email: 'rohan.varma@apex.edu',
          department: 'ECE',
          batchYear: 2026,
          currentSemester: 6,
          cgpa: 7.84,
          status: 'active',
          institutionId,
        },
        {
          rollNumber: 'ME-2025-042',
          fullName: 'Vikram Rao',
          email: 'vikram.rao@apex.edu',
          department: 'MECH',
          batchYear: 2025,
          currentSemester: 8,
          cgpa: 8.15,
          status: 'graduated',
          institutionId,
        },
      ]);
      existing = InMemoryRosterStore.getStudentsByInstitution(institutionId);
    }
    setStudents(existing);
  }, [institutionId]);

  const handleRunIngestion = () => {
    if (!csvInput.trim()) return;
    const res = parseStudentRosterCSV(csvInput, institutionId);
    setIngestionResult(res);

    if (res.validRecords.length > 0) {
      InMemoryRosterStore.upsertStudents(res.validRecords);
      const updated = InMemoryRosterStore.getStudentsByInstitution(institutionId);
      setStudents(updated);
    }
  };

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.department.toUpperCase() === deptFilter.toUpperCase();
    return matchesSearch && matchesDept;
  });

  const departments = ['ALL', 'CSE', 'ECE', 'MECH', 'IT', 'COMMERCE'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Controls: Search, Filters & Bulk Import Action */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        background: 'var(--card, #0f172a)',
        padding: '18px 24px',
        borderRadius: 12,
        border: '1px solid var(--border, #1e293b)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background: deptFilter === dept ? '#4f46e5' : '#1e293b',
                color: deptFilter === dept ? '#ffffff' : '#94a3b8',
                border: '1px solid #334155'
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setShowUploadModal(true);
            setIngestionResult(null);
          }}
          style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
            color: '#ffffff',
            borderRadius: 8,
            border: 'none',
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
        >
          <span>📥</span> Bulk Onboard (CSV)
        </button>
      </div>

      {/* Roster Table */}
      <div style={{
        background: 'var(--card, #0f172a)',
        borderRadius: 12,
        border: '1px solid var(--border, #1e293b)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            Enrolled Students ({filtered.length})
          </h2>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Multi-Tenant Isolated to: <code>{institutionId}</code>
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#020617', color: '#94a3b8', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>ROLL NUMBER</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>STUDENT NAME</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>EMAIL ADDRESS</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>DEPT</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>SEM</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>CGPA</th>
                <th style={{ padding: '12px 20px', fontWeight: 600 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr
                  key={s.rollNumber}
                  style={{
                    borderBottom: '1px solid #1e293b',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                  }}
                >
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>
                    {s.rollNumber}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#f8fafc' }}>
                    {s.fullName}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                    {s.email}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: '#1e293b',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#a5b4fc'
                    }}>
                      {s.department}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>Sem {s.currentSemester}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: s.cgpa >= 8.5 ? '#10b981' : '#f59e0b' }}>
                    {s.cgpa.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      background: s.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                      color: s.status === 'active' ? '#10b981' : '#94a3b8'
                    }}>
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Ingestion Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20
        }}>
          <div style={{
            background: '#0f172a',
            borderRadius: 14,
            border: '1px solid #334155',
            width: '100%',
            maxWidth: 720,
            padding: 28,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>📥 Bulk Student Roster CSV Ingestion</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
              Paste your student roster CSV below. Required columns: <code>Roll Number</code>, <code>Full Name</code>, <code>Email</code>, <code>Department</code>.
            </p>

            <textarea
              rows={8}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder={`Roll Number,Full Name,Email,Department,Semester,CGPA\nCS-2026-101,Ananya Roy,ananya@apex.edu,CSE,6,9.15\nCS-2026-102,Karan Mehta,karan@apex.edu,CSE,6,8.40`}
              style={{
                width: '100%',
                background: '#020617',
                border: '1px solid #334155',
                borderRadius: 8,
                padding: 12,
                color: '#f8fafc',
                fontSize: 12.5,
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* Ingestion Report Feedback */}
            {ingestionResult && (
              <div style={{
                marginTop: 14,
                padding: 14,
                borderRadius: 8,
                background: ingestionResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${ingestionResult.success ? '#10b98155' : '#ef444455'}`
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: ingestionResult.success ? '#10b981' : '#ef4444' }}>
                  {ingestionResult.success
                    ? `✓ Ingestion Succeeded: ${ingestionResult.summary.validCount} student records enrolled.`
                    : `⚠ Ingestion Warning: ${ingestionResult.summary.validCount} valid, ${ingestionResult.summary.errorCount} errors detected.`}
                </div>
                {ingestionResult.errors.length > 0 && (
                  <div style={{ marginTop: 8, maxHeight: 120, overflowY: 'auto', fontSize: 12, color: '#fca5a5' }}>
                    {ingestionResult.errors.map((err, i) => (
                      <div key={i}>• Row {err.row} [{err.field}]: {err.reason}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 6,
                  background: '#1e293b',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                Close
              </button>
              <button
                onClick={handleRunIngestion}
                style={{
                  padding: '9px 20px',
                  borderRadius: 6,
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                Validate & Ingest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
