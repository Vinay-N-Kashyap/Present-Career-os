'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from '@/lib/store/useAppStore';

interface AdminOpsCardProps {
  icon: string;
  title: string;
  badge: string;
  description: string;
  studioHref: string;
  studioLabel: string;
  metrics: { label: string; value: string; accent?: string }[];
  records: { id: string; primary: string; secondary: string; status: string }[];
  actionLabel: string;
}

function AdminOperationalConsole({
  icon,
  title,
  badge,
  description,
  studioHref,
  studioLabel,
  metrics,
  records: initialRecords,
  actionLabel,
}: AdminOpsCardProps) {
  const [records, setRecords] = useState(initialRecords);
  const [filter, setFilter] = useState('');

  const filtered = records.filter(
    r =>
      r.primary.toLowerCase().includes(filter.toLowerCase()) ||
      r.secondary.toLowerCase().includes(filter.toLowerCase()) ||
      r.id.toLowerCase().includes(filter.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const nextStatus = r.status === 'Verified' || r.status === 'Active' || r.status === 'Resolved'
          ? 'Under Review'
          : 'Verified';
        toast.success(`Updated ${id}`, `Status set to ${nextStatus}`);
        return { ...r, status: nextStatus };
      })
    );
  };

  return (
    <div style={{ padding: 24, background: 'var(--bg1, #ffffff)', borderRadius: 16, border: '1px solid var(--border, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 26 }}>{icon}</span>
            <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0, color: 'var(--t1, #0f172a)' }}>{title}</h2>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
              {badge}
            </span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--t3, #64748b)', margin: 0 }}>{description}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link
            href={studioHref}
            style={{
              textDecoration: 'none',
              padding: '9px 16px',
              borderRadius: 8,
              background: '#2563eb',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            🏛️ {studioLabel} →
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 12, background: 'var(--bg2, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
            <div style={{ fontSize: 12, color: 'var(--t3, #64748b)', fontWeight: 600 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: m.accent || 'var(--t1, #0f172a)', marginTop: 4 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter records by ID, title, or department..."
          style={{ flex: 1, minWidth: 220, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)', fontSize: 13 }}
        />
        <button
          onClick={() => toast.success(actionLabel, 'Institutional ledger synchronized with Campus ERP.')}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)', background: 'var(--bg2, #f8fafc)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
        >
          ⚡ {actionLabel}
        </button>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--border, #e2e8f0)', borderRadius: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg2, #f8fafc)', textAlign: 'left', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
              <th style={{ padding: '10px 14px' }}>Record ID</th>
              <th style={{ padding: '10px 14px' }}>Subject / Entity</th>
              <th style={{ padding: '10px 14px' }}>Details</th>
              <th style={{ padding: '10px 14px' }}>Status</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 700 }}>{r.id}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.primary}</td>
                <td style={{ padding: '10px 14px', color: 'var(--t3, #64748b)' }}>{r.secondary}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: r.status === 'Verified' || r.status === 'Active' || r.status === 'Resolved' ? '#dcfce7' : '#fef3c7', color: r.status === 'Verified' || r.status === 'Active' || r.status === 'Resolved' ? '#166534' : '#92400e' }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggleStatus(r.id)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdmissionsTab() {
  return (
    <AdminOperationalConsole
      icon="🎟️"
      title="Admissions & Seat Matrix Console"
      badge="AICTE / UGC Intake"
      description="Monitor applicant verification, merit list seat allocation, and scholarship disbursement."
      studioHref="/admissions"
      studioLabel="Open Admissions Portal"
      actionLabel="Sync Merit Seat Matrix"
      metrics={[
        { label: 'Total Sanctioned Intake', value: '1,200' },
        { label: 'Verified Applications', value: '1,084', accent: '#2563eb' },
        { label: 'Seats Allotted', value: '962', accent: '#16a34a' },
        { label: 'Pending Document Audit', value: '28', accent: '#d97706' },
      ]}
      records={[
        { id: 'ADM-2026-101', primary: 'B.Tech Computer Science & AI', secondary: '180 / 180 Seats Filled • Cutoff 94.2%', status: 'Verified' },
        { id: 'ADM-2026-102', primary: 'B.Com Honours (Corporate Finance)', secondary: '116 / 120 Seats Filled • Cutoff 89.5%', status: 'Active' },
        { id: 'ADM-2026-103', primary: 'M.Tech Embedded & IoT Systems', secondary: '54 / 60 Seats Filled • GATE Quota', status: 'Under Review' },
      ]}
    />
  );
}

export function FinanceTab() {
  return (
    <AdminOperationalConsole
      icon="💳"
      title="Institutional Finance & Fee Ledger"
      badge="Statutory Treasury"
      description="Track semester tuition collections, scholarship waivers, and departmental budget utilization."
      studioHref="/campus-admin/endowment"
      studioLabel="Open Endowment & Treasury Studio"
      actionLabel="Reconcile Fee Gateway"
      metrics={[
        { label: 'Semester Collection Rate', value: '94.6%', accent: '#16a34a' },
        { label: 'Active Scholarships', value: '142', accent: '#2563eb' },
        { label: 'Pending Fee Dues', value: '19 Students', accent: '#d97706' },
        { label: 'Audit Compliance', value: '100% Clean' },
      ]}
      records={[
        { id: 'FIN-TX-8821', primary: 'Semester VII Tuition Batch A', secondary: 'NEFT / UPI Gateway • 96% Cleared', status: 'Verified' },
        { id: 'FIN-TX-8822', primary: 'NSP Merit Scholarship Disbursement', secondary: 'Direct Benefit Transfer • 48 Scholars', status: 'Verified' },
        { id: 'FIN-TX-8823', primary: 'Lab Capital Equipment Grant', secondary: 'AICTE MODROBS • Utilization Certificate', status: 'Under Review' },
      ]}
    />
  );
}

export function LibraryTab() {
  return (
    <AdminOperationalConsole
      icon="📚"
      title="Central Library & Digital Repository"
      badge="KOHA / INFLIBNET"
      description="Manage ISBN circulation, IEEE/Springer digital subscriptions, and overdue book returns."
      studioHref="/library"
      studioLabel="Open Library Center"
      actionLabel="Run RFID Inventory Sync"
      metrics={[
        { label: 'Total Volumes & E-Journals', value: '64,500+' },
        { label: 'Active Checkouts', value: '418', accent: '#2563eb' },
        { label: 'Digital E-Resources', value: '100% Online', accent: '#16a34a' },
        { label: 'Overdue Notices', value: '11', accent: '#d97706' },
      ]}
      records={[
        { id: 'LIB-CAT-401', primary: 'IEEE Xplore & ACM Digital Library', secondary: 'Campus-wide IP & Remote Shibboleth Access', status: 'Active' },
        { id: 'LIB-CAT-402', primary: 'Designing Data-Intensive Applications', secondary: '32 Copies • CS Reference Rack B2', status: 'Verified' },
        { id: 'LIB-CAT-403', primary: 'Corporate Accounting & Auditing Standards', secondary: '25 Copies • Commerce Wing Section A', status: 'Verified' },
      ]}
    />
  );
}

export function HostelTab() {
  return (
    <AdminOperationalConsole
      icon="🏢"
      title="Hostel & Residential Warden Desk"
      badge="Campus Housing"
      description="Oversee room allotments, biometric curfew logs, and mess hygiene inspections."
      studioHref="/campus-admin/hostel-allocation"
      studioLabel="Open Hostel Allocation Studio"
      actionLabel="Export Warden Occupancy Roster"
      metrics={[
        { label: 'Total Residential Capacity', value: '1,850 Beds' },
        { label: 'Current Occupancy', value: '96.2%', accent: '#2563eb' },
        { label: 'Biometric Attendance', value: '99.1%', accent: '#16a34a' },
        { label: 'Maintenance Tickets', value: '4 Open', accent: '#d97706' },
      ]}
      records={[
        { id: 'HST-BLK-A', primary: 'Aryabhatta Scholars Residence (Block A)', secondary: '620 / 630 Beds Occupied • Warden Dr. R. Verma', status: 'Verified' },
        { id: 'HST-BLK-B', primary: 'Gargi Women Scholars Enclave (Block B)', secondary: '590 / 600 Beds Occupied • Warden Prof. S. Nair', status: 'Verified' },
        { id: 'HST-MESS-1', primary: 'Central Dining Hall & FSSAI Audit', secondary: 'Weekly Nutrition & Hygiene Score: 98/100', status: 'Active' },
      ]}
    />
  );
}

export function TransportTab() {
  return (
    <AdminOperationalConsole
      icon="🚌"
      title="Campus Transit & Fleet Telemetry"
      badge="GPS Fleet Ops"
      description="Monitor bus route schedules, AIS-140 GPS tracking, driver rosters, and student transit passes."
      studioHref="/campus-admin/fleet-transport"
      studioLabel="Open Fleet & Transport Studio"
      actionLabel="Refresh GPS Telemetry"
      metrics={[
        { label: 'Active Transit Routes', value: '24 Routes' },
        { label: 'On-Time Arrival Rate', value: '98.4%', accent: '#16a34a' },
        { label: 'Student Pass Holders', value: '1,120', accent: '#2563eb' },
        { label: 'Fleet Safety Fitness', value: '100% Certified' },
      ]}
      records={[
        { id: 'TRN-RT-01', primary: 'Route 01: Metro Central → Main Campus', secondary: 'Bus KA-01-F-4412 • 52 Pass Holders • On Schedule', status: 'Active' },
        { id: 'TRN-RT-04', primary: 'Route 04: Tech Corridor → South Gate', secondary: 'Bus KA-01-F-4419 • 48 Pass Holders • On Schedule', status: 'Active' },
        { id: 'TRN-EV-02', primary: 'In-Campus Electric Shuttle Loop', secondary: 'Zero-Emission EV Shuttle • Every 10 mins', status: 'Verified' },
      ]}
    />
  );
}

export function DocumentsTab() {
  return (
    <AdminOperationalConsole
      icon="📄"
      title="Institutional Document Vault & NAD DigiLocker"
      badge="NAD / ABC Verified"
      description="Verify transcripts, bonafide certificates, migration requests, and Academic Bank of Credits (ABC) sync."
      studioHref="/campus-admin/nad-digilocker"
      studioLabel="Open NAD DigiLocker Studio"
      actionLabel="Batch Sign Pending Transcripts"
      metrics={[
        { label: 'NAD DigiLocker Synced', value: '4,820 Records', accent: '#16a34a' },
        { label: 'ABC ID Coverage', value: '99.4%', accent: '#2563eb' },
        { label: 'Pending Bonafide Requests', value: '7', accent: '#d97706' },
        { label: 'Cryptographic Signatures', value: 'SHA-256 Active' },
      ]}
      records={[
        { id: 'DOC-NAD-901', primary: 'Provisional Degree Certificate Batch 2026', secondary: 'NAD DigiLocker Push • 312 Graduates', status: 'Verified' },
        { id: 'DOC-BON-214', primary: 'Internship NOC & Bonafide Letter', secondary: 'Requested by CS Final Year Cohort', status: 'Active' },
        { id: 'DOC-MIG-088', primary: 'Official Transcript & Migration Sealed Packet', secondary: 'Higher Studies Verification Queue', status: 'Under Review' },
      ]}
    />
  );
}

export function ServicesTab() {
  return (
    <AdminOperationalConsole
      icon="💼"
      title="Student Services & Single-Window SLA Desk"
      badge="SLA Tracked"
      description="Manage ID card re-issuance, scholarship attestations, railway concessions, and administrative clearances."
      studioHref="/services"
      studioLabel="Open Student Services Portal"
      actionLabel="Process Cleared SLA Tickets"
      metrics={[
        { label: 'Open Service Tickets', value: '14', accent: '#2563eb' },
        { label: 'Avg Resolution Time', value: '4.2 Hours', accent: '#16a34a' },
        { label: 'SLA Compliance', value: '98.9%' },
        { label: 'Escalated Tickets', value: '1', accent: '#d97706' },
      ]}
      records={[
        { id: 'SRV-REQ-501', primary: 'Smart Campus ID Card Replacement', secondary: 'RFID Chip Provisioning • Registrar Desk', status: 'Resolved' },
        { id: 'SRV-REQ-502', primary: 'AICTE Pragati Scholarship Attestation', secondary: 'Principal Digital Signature Queue', status: 'Active' },
        { id: 'SRV-REQ-503', primary: 'No-Dues Clearance Certificate', secondary: 'Library + Hostel + Lab Automated Check', status: 'Verified' },
      ]}
    />
  );
}
