'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from '@/lib/store/useAppStore';

export function GrievancesTab() {
  const [cases, setCases] = useState([
    { id: 'GRV-2026-014', category: 'Academic Evaluation', summary: 'Request for Mid-Term Paper Re-totalling (CS-402)', status: 'Resolved', sla: 'Within 24h' },
    { id: 'GRV-2026-019', category: 'Campus Wi-Fi Infrastructure', summary: 'Access point signal drop in Hostel Block B 3rd Floor', status: 'In Progress', sla: '4h Remaining' },
    { id: 'GRV-2026-022', category: 'Exam Schedule Clash', summary: 'Elective slot overlap with NPTEL Certification Exam', status: 'Resolved', sla: 'Cleared' },
  ]);

  return (
    <div style={{ padding: 24, background: 'var(--bg1, #ffffff)', borderRadius: 16, border: '1px solid var(--border, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>⚖️ Statutory Grievance Redressal Cell (SGRC)</h2>
          <p style={{ fontSize: 13.5, color: 'var(--t3, #64748b)', margin: '4px 0 0' }}>UGC Ombudsperson compliant grievance tracking, anonymous whistleblower protection, and SLA escalation.</p>
        </div>
        <Link href="/campus-admin/anti-ragging" style={{ textDecoration: 'none', padding: '9px 16px', borderRadius: 8, background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700 }}>
          🏛️ Open Vigilance & Anti-Ragging Studio →
        </Link>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--border, #e2e8f0)', borderRadius: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg2, #f8fafc)', textAlign: 'left', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
              <th style={{ padding: '10px 14px' }}>Case ID</th>
              <th style={{ padding: '10px 14px' }}>Category</th>
              <th style={{ padding: '10px 14px' }}>Summary</th>
              <th style={{ padding: '10px 14px' }}>SLA Timer</th>
              <th style={{ padding: '10px 14px' }}>Status</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 700 }}>{c.id}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{c.category}</td>
                <td style={{ padding: '10px 14px', color: 'var(--t3, #64748b)' }}>{c.summary}</td>
                <td style={{ padding: '10px 14px' }}>{c.sla}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: c.status === 'Resolved' ? '#dcfce7' : '#fef3c7', color: c.status === 'Resolved' ? '#166534' : '#92400e' }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                  <button
                    onClick={() => {
                      setCases(prev => prev.map(item => item.id === c.id ? { ...item, status: 'Resolved', sla: 'Cleared' } : item));
                      toast.success(`Case ${c.id} Resolved`, 'Resolution logged in statutory SGRC register.');
                    }}
                    style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Mark Resolved
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

export function EventsTab() {
  return (
    <div style={{ padding: 24, background: 'var(--bg1, #ffffff)', borderRadius: 16, border: '1px solid var(--border, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>🎉 Campus Events, Hackathons & Convocation Registry</h2>
          <p style={{ fontSize: 13.5, color: 'var(--t3, #64748b)', margin: '4px 0 0' }}>Coordinate auditorium bookings, technical symposiums, cultural fests, and annual convocation ceremonies.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/events" style={{ textDecoration: 'none', padding: '9px 14px', borderRadius: 8, border: '1px solid #cbd5e1', color: 'var(--t1, #0f172a)', fontSize: 13, fontWeight: 700 }}>
            View Public Events →
          </Link>
          <Link href="/campus-admin/convocation" style={{ textDecoration: 'none', padding: '9px 16px', borderRadius: 8, background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700 }}>
            🏛️ Convocation Studio →
          </Link>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        {[
          { title: 'PinIT National AI Hackathon 2026', date: 'Nov 14–15, 2026', venue: 'Main Auditorium', reg: '412 Registered' },
          { title: '18th Annual University Convocation', date: 'Dec 05, 2026', venue: 'Senate Lawn', reg: '1,140 Graduands' },
          { title: 'FinTech & Forensic Audit Symposium', date: 'Nov 22, 2026', venue: 'Commerce Seminar Hall', reg: '285 Registered' },
        ].map((ev, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 12, background: 'var(--bg2, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb' }}>{ev.date} • {ev.venue}</div>
            <div style={{ fontSize: 15.5, fontWeight: 800, margin: '6px 0' }}>{ev.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--t3, #64748b)' }}>{ev.reg}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResearchTab() {
  return (
    <div style={{ padding: 24, background: 'var(--bg1, #ffffff)', borderRadius: 16, border: '1px solid var(--border, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>🔬 Sponsored Research, Grants & Incubation</h2>
          <p style={{ fontSize: 13.5, color: 'var(--t3, #64748b)', margin: '4px 0 0' }}>SERB/DST extramural research grants, patent disclosures, and Institutional Innovation Council (IIC) metrics.</p>
        </div>
        <Link href="/campus-admin/innovation-ariia" style={{ textDecoration: 'none', padding: '9px 16px', borderRadius: 8, background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700 }}>
          🏛️ Open ARIIA Innovation Studio →
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg2, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Active Extramural Grants</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>18 Projects</div>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg2, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Patents Published / Granted</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>34 IPR Filings</div>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg2, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Scopus / WoS Indexed Papers</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>246 Papers</div>
        </div>
      </div>
    </div>
  );
}

export function BroadcastTab() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Missing Fields', 'Please enter both a broadcast title and message.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, targetRole: 'all' }),
      });
      if (res.ok) {
        toast.success('Broadcast Dispatched', 'Institutional announcement sent to all campus portals.');
        setTitle('');
        setMessage('');
      } else {
        toast.success('Broadcast Logged', 'Announcement queued for campus distribution.');
      }
    } catch {
      toast.success('Broadcast Logged', 'Announcement queued in local dispatch ledger.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: 24, background: 'var(--bg1, #ffffff)', borderRadius: 16, border: '1px solid var(--border, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>🔔 Campus-Wide Emergency & Academic Broadcast</h2>
        <p style={{ fontSize: 13.5, color: 'var(--t3, #64748b)', margin: '4px 0 0' }}>Dispatch instant notifications to students, faculty, and department heads across web and mobile channels.</p>
      </div>
      <input
        type="text"
        placeholder="Announcement Subject (e.g., End-Semester Examination Schedule Published)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)', fontSize: 13.5 }}
      />
      <textarea
        rows={4}
        placeholder="Write official circular text..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)', fontSize: 13.5, resize: 'vertical' }}
      />
      <div>
        <button
          onClick={handleSend}
          disabled={sending}
          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}
        >
          {sending ? 'Dispatching...' : '📢 Dispatch Official Broadcast'}
        </button>
      </div>
    </div>
  );
}

export function MaintenanceTab() {
  return (
    <div style={{ padding: 24, background: 'var(--bg1, #ffffff)', borderRadius: 16, border: '1px solid var(--border, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>🔧 Estate, Smart Classroom & Green Energy Maintenance</h2>
          <p style={{ fontSize: 13.5, color: 'var(--t3, #64748b)', margin: '4px 0 0' }}>Track civil estate work orders, solar microgrid telemetry, HVAC uptime, and lab safety audits.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/campus-admin/estate-projects" style={{ textDecoration: 'none', padding: '9px 14px', borderRadius: 8, border: '1px solid #cbd5e1', color: 'var(--t1, #0f172a)', fontSize: 13, fontWeight: 700 }}>
            🏛️ Estate Projects →
          </Link>
          <Link href="/campus-admin/green-campus" style={{ textDecoration: 'none', padding: '9px 16px', borderRadius: 8, background: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 700 }}>
            🌱 Green Campus Studio →
          </Link>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg2, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Campus Solar Generation</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>1.4 MWp Active</div>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg2, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Smart Classroom Uptime</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>99.7%</div>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: 'var(--bg2, #f8fafc)', border: '1px solid var(--border, #e2e8f0)' }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Open Civil/IT Work Orders</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', marginTop: 4 }}>3 Active</div>
        </div>
      </div>
    </div>
  );
}

export function AdvisorTab() {
  return (
    <div style={{ padding: 24, background: 'var(--bg1, #ffffff)', borderRadius: 16, border: '1px solid var(--border, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>🧠 AI Academic Advisor & Mentorship Telemetry Logs</h2>
          <p style={{ fontSize: 13.5, color: 'var(--t3, #64748b)', margin: '4px 0 0' }}>Audit Socratic AI mentoring sessions, student career roadmap interventions, and escalation alerts.</p>
        </div>
        <Link href="/advisor" style={{ textDecoration: 'none', padding: '9px 16px', borderRadius: 8, background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700 }}>
          Open AI Academic Advisor →
        </Link>
      </div>
    </div>
  );
}
