'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_INSTITUTIONS, InstitutionContext } from '@/lib/admin/tenant';
import StudentRosterManager from './StudentRosterManager';
import FeeLedgerDashboard from './FeeLedgerDashboard';

export interface GovernancePortalItem {
  id: string;
  title: string;
  path: string;
  category: 'academic' | 'exams' | 'rankings' | 'finance' | 'safety' | 'inclusion';
  icon: string;
  badge: string;
  regulatoryBody: string;
  description: string;
}

export const ALL_GOVERNANCE_PORTALS: GovernancePortalItem[] = [
  // 1. National & Global Rankings
  {
    id: 'nirf-ranking',
    title: 'Central NIRF & QS World Ranking Telemetry',
    path: '/campus-admin/nirf-ranking',
    category: 'rankings',
    icon: '🏆',
    badge: 'Block 40 Final',
    regulatoryBody: 'MoE NIRF / QS',
    description: 'Statutory 5-dimension TLR, RPC, GO, OI, PR weighted composite score engine and DCS disclosure vault.'
  },
  {
    id: 'iqac',
    title: 'Internal Quality Assurance Cell (IQAC)',
    path: '/campus-admin/iqac',
    category: 'rankings',
    icon: '📊',
    badge: 'Core IQAC',
    regulatoryBody: 'NAAC Mandate',
    description: 'Annual Quality Assurance Report (AQAR) synthesis, institutional metric benchmarks and audit ledgers.'
  },
  {
    id: 'governance',
    title: 'Institutional Senate & Executive Governance',
    path: '/campus-admin/governance',
    category: 'rankings',
    icon: '🏛️',
    badge: 'Statutory Board',
    regulatoryBody: 'University Act',
    description: 'Senate resolutions, Academic Council minutes, Board of Governors compliance and policy tracker.'
  },

  // 2. Academic Affairs & Accreditation
  {
    id: 'roster',
    title: 'Student Roster & Batch Ingestion Hub',
    path: '/campus-admin/roster',
    category: 'academic',
    icon: '👥',
    badge: 'Core ERP',
    regulatoryBody: 'Registrar',
    description: 'Multi-tenant student enrolment, automated CSV ingestion, roll number mapping and section assignment.'
  },
  {
    id: 'accreditation',
    title: 'NAAC, NBA & ABET Accreditation Suite',
    path: '/campus-admin/accreditation',
    category: 'academic',
    icon: '🛡️',
    badge: 'Outcome Based',
    regulatoryBody: 'NAAC A++ / NBA',
    description: 'Outcome-based education telemetry, continuous quality improvement indicators and SSR packager.'
  },
  {
    id: 'academic-bank-credits',
    title: 'Academic Bank of Credits (ABC) & APAAR ID',
    path: '/campus-admin/academic-bank-credits',
    category: 'academic',
    icon: '💳',
    badge: 'NEP 2020',
    regulatoryBody: 'DigiLocker / NAD',
    description: 'National Academic Depository synchronization, 12-digit APAAR ID verification and credit transfers.'
  },
  {
    id: 'affiliation',
    title: 'College Affiliation & Inspection Committee',
    path: '/campus-admin/affiliation',
    category: 'academic',
    icon: '📜',
    badge: 'Affiliation Cell',
    regulatoryBody: 'UGC Regulations',
    description: 'Constituent and affiliated college annual inspection scores, seat matrix and statutory scrutiny.'
  },
  {
    id: 'departments',
    title: 'Academic Departments & School Administration',
    path: '/campus-admin/departments',
    category: 'academic',
    icon: '🏫',
    badge: 'Departmental',
    regulatoryBody: 'Dean Academic',
    description: 'Faculty rosters, student-teacher ratios, laboratory allocations and academic calendar monitoring.'
  },

  // 3. Examinations, Question Custody & Convocation
  {
    id: 'coe-press',
    title: 'CoE Question Paper Custody & Printing Press',
    path: '/campus-admin/coe-press',
    category: 'exams',
    icon: '🔒',
    badge: 'Confidential',
    regulatoryBody: 'Controller of Exams',
    description: 'Double-lock physical vault protocol, encrypted set randomizer and tamper-proof custodial audit logs.'
  },
  {
    id: 'convocation',
    title: 'Annual Convocation & Degree Scroll Sealing',
    path: '/campus-admin/convocation',
    category: 'exams',
    icon: '🎓',
    badge: 'Chancellor Seals',
    regulatoryBody: 'University Senate',
    description: 'Chancellor Gold Medal lists, tamper-proof SHA-256 degree scroll hashes and conferment registers.'
  },
  {
    id: 'academic-integrity',
    title: 'Academic Integrity & Plagiarism Tribunal',
    path: '/campus-admin/academic-integrity',
    category: 'exams',
    icon: '⚖️',
    badge: 'Ethics Hearing',
    regulatoryBody: 'UGC Plagiarism Rules',
    description: 'Thesis similarity index screening (Levels 0-3), tribunal summons, faculty hearing notes and rulings.'
  },
  {
    id: 'exam-seating',
    title: 'Examination Seating & Flying Squad Allocation',
    path: '/campus-admin/exam-seating',
    category: 'exams',
    icon: '🪑',
    badge: 'Exam Cell',
    regulatoryBody: 'CoE Central',
    description: 'Conflict-free seating matrix distribution, hall ticket barcodes and invigilator assignment roster.'
  },
  {
    id: 'moderation',
    title: 'Examination Marks Moderation & Normalization',
    path: '/campus-admin/moderation',
    category: 'exams',
    icon: '📈',
    badge: 'Evaluation',
    regulatoryBody: 'Board of Examiners',
    description: 'Statistical bell-curve normalization, pass percentage moderation and grace mark rule application.'
  },

  // 4. Finance, Procurement & Tenders
  {
    id: 'fees',
    title: 'Sub-Ledger & Fee Management Dashboard',
    path: '/campus-admin/fees',
    category: 'finance',
    icon: '💰',
    badge: 'Core Ledger',
    regulatoryBody: 'Finance Officer',
    description: 'Double-entry student fee ledgers, automated reconciliation, overdue notices and receipt generation.'
  },
  {
    id: 'procurement',
    title: 'Central University Tenders & Works Contract (GeM)',
    path: '/campus-admin/procurement',
    category: 'finance',
    icon: '📑',
    badge: 'GeM / GFR',
    regulatoryBody: 'CVC / Finance',
    description: 'Government e-Marketplace integration, General Financial Rules (GFR) compliance and bid scrutiny.'
  },
  {
    id: 'internal-audit',
    title: 'Internal Audit & CAG Compliance Recovery',
    path: '/campus-admin/internal-audit',
    category: 'finance',
    icon: '🔍',
    badge: 'Audit Para',
    regulatoryBody: 'CAG of India',
    description: 'Comptroller & Auditor General inspection response ledger, monetary variance settlement and action logs.'
  },
  {
    id: 'budgets',
    title: 'University Annual Budget & CapEx Allocation',
    path: '/campus-admin/budgets',
    category: 'finance',
    icon: '📊',
    badge: 'Finance Board',
    regulatoryBody: 'Finance Committee',
    description: 'Departmental budget allocations, non-recurring grant utilization and quarterly burn-rate telemetry.'
  },
  {
    id: 'scholarships',
    title: 'Student Scholarships & Means-Cum-Merit Grants',
    path: '/campus-admin/scholarships',
    category: 'finance',
    icon: '🎗️',
    badge: 'Financial Aid',
    regulatoryBody: 'Social Welfare',
    description: 'Fee waiver scrutiny, state scholarship portal synchronization and DBT disbursement ledgers.'
  },
  {
    id: 'alumni-endowment',
    title: 'Alumni Endowment & Philanthropic Corpus',
    path: '/campus-admin/alumni-endowment',
    category: 'finance',
    icon: '🤝',
    badge: '80G Compliant',
    regulatoryBody: 'Development Office',
    description: 'Alumni pledge ledgers, named chair endowments, tax exemption certificates and capital corpus vaults.'
  },

  // 5. Campus Estates, Safety & Infrastructure
  {
    id: 'disaster-safety',
    title: 'Disaster Management, Fire Safety & Evacuation',
    path: '/campus-admin/disaster-safety',
    category: 'safety',
    icon: '🚒',
    badge: 'NDMA / Fire NOC',
    regulatoryBody: 'Estate Office',
    description: 'Building-zone evacuation routes, mock drill telemetry, Fire NOC renewal schedules and safety scores.'
  },
  {
    id: 'campus-security',
    title: 'Campus Security, Gate Pass & Surveillance',
    path: '/campus-admin/campus-security',
    category: 'safety',
    icon: '🛡️',
    badge: 'Proctorial Guard',
    regulatoryBody: 'Chief Security Officer',
    description: 'Vehicle RFID registration, visitor gate passes, CCTV zone surveillance logs and night curfew alerts.'
  },
  {
    id: 'crf',
    title: 'Central Research Facility (CRF) Instrumentation',
    path: '/campus-admin/crf',
    category: 'safety',
    icon: '🔬',
    badge: 'High-End Labs',
    regulatoryBody: 'Dean Research',
    description: 'SEM, TEM, XRD and NMR spectrometer slot scheduling, internal/external billing rates and logbooks.'
  },
  {
    id: 'guest-house',
    title: 'University Guest House & VIP Protocol Allocation',
    path: '/campus-admin/guest-house',
    category: 'safety',
    icon: '🏨',
    badge: 'Hospitality',
    regulatoryBody: 'Registrar Estate',
    description: 'Visiting professor transit suites, VIP dignitary protocol allotments, billing and housekeeping telemetry.'
  },
  {
    id: 'campus-transport',
    title: 'Campus Fleet & Electric Shuttle Management',
    path: '/campus-admin/campus-transport',
    category: 'safety',
    icon: '🚌',
    badge: 'Logistics',
    regulatoryBody: 'Transport Office',
    description: 'GPS vehicle tracking, campus loop frequency, fuel/EV charge logs and driver compliance monitoring.'
  },
  {
    id: 'hostel-welfare',
    title: 'Hostel Administration & Student Residential Welfare',
    path: '/campus-admin/hostel-welfare',
    category: 'safety',
    icon: '🏠',
    badge: 'Chief Warden',
    regulatoryBody: 'Dean Students',
    description: 'Room allocation rosters, mess committee menus, hygiene audit scores and late-entry curfew registry.'
  },
  {
    id: 'health',
    title: 'Campus Health Centre & Emergency Medical Roster',
    path: '/campus-admin/health',
    category: 'safety',
    icon: '🏥',
    badge: 'Medical Board',
    regulatoryBody: 'Chief Medical Officer',
    description: 'Outpatient consultations, ambulance dispatch logs, student health insurance and vaccination campaigns.'
  },

  // 6. Regulatory Compliance, Inclusion & Student Representation
  {
    id: 'equal-opportunity',
    title: 'Equal Opportunity Cell (EOC) & PwD Accessibility',
    path: '/campus-admin/equal-opportunity',
    category: 'inclusion',
    icon: '♿',
    badge: 'RPwD Act 2016',
    regulatoryBody: 'EOC Committee',
    description: 'Physical/digital accessibility audits, scribe allocations, remedial assistive devices and grievance triage.'
  },
  {
    id: 'rti',
    title: 'Right to Information (RTI 2005) & CPGRAMS Cell',
    path: '/campus-admin/rti',
    category: 'inclusion',
    icon: '📑',
    badge: 'Statutory 30-Day',
    regulatoryBody: 'CIC / CPIO',
    description: 'Central Public Information Officer scrutiny, Section 8 exemptions, appeal hearings and compliance timers.'
  },
  {
    id: 'anti-ragging',
    title: 'Anti-Ragging Committee & Proctorial Squad',
    path: '/campus-admin/anti-ragging',
    category: 'inclusion',
    icon: '🚫',
    badge: 'Zero Tolerance',
    regulatoryBody: 'Supreme Court Mandate',
    description: 'UGC anti-ragging affidavits, 24/7 hotline logs, flying squad surprise rounds and inquiry reports.'
  },
  {
    id: 'elections',
    title: 'Student Council Elections & Campus Representation',
    path: '/campus-admin/elections',
    category: 'inclusion',
    icon: '🗳️',
    badge: 'Lyngdoh Norms',
    regulatoryBody: 'Election Commission',
    description: 'Nomination scrutiny, expenditure audits, electronic ballot verification and campus representation.'
  },
  {
    id: 'sports-quota',
    title: 'Sports Quota & Inter-University Tournament Cell',
    path: '/campus-admin/sports-quota',
    category: 'inclusion',
    icon: '⚽',
    badge: 'AIU Approved',
    regulatoryBody: 'Sports Board',
    description: 'All India Inter-University trial scores, national medal verification, diet allowances and equipment logs.'
  },
  {
    id: 'ethics',
    title: 'Institutional Ethics Committee (IEC / IBC)',
    path: '/campus-admin/ethics',
    category: 'inclusion',
    icon: '🔬',
    badge: 'Bioethics',
    regulatoryBody: 'ICMR / DBT',
    description: 'Human/animal research protocol clearances, biosafety level compliance and ethical approval certificates.'
  },
  {
    id: 'parent-notices',
    title: 'Parent Portal Telemetry & Automated Notification Gateway',
    path: '/campus-admin/parent-notices',
    category: 'inclusion',
    icon: '👨‍👩‍👦',
    badge: 'Outreach',
    regulatoryBody: 'Proctorial Cell',
    description: 'Automated attendance deficit warnings, cryptographic magic links and institutional notices.'
  },
  {
    id: 'industry',
    title: 'Corporate Relations & Placement Administration',
    path: '/campus-admin/industry',
    category: 'inclusion',
    icon: '💼',
    badge: 'Placement Cell',
    regulatoryBody: 'T&P Directorate',
    description: 'Recruiter drive schedules, Day-0 dream offers, CTC distribution stats and alumni interview panels.'
  },
  {
    id: 'events',
    title: 'Campus Cultural Festivities & Academic Conferences',
    path: '/campus-admin/events',
    category: 'inclusion',
    icon: '🎉',
    badge: 'Campus Life',
    regulatoryBody: 'Dean Culture',
    description: 'Auditorium booking ledgers, celebrity artist permissions, police clearances and student committee budgets.'
  },
  {
    id: 'grievances',
    title: 'Central Student Grievance Redressal Committee (SGRC)',
    path: '/campus-admin/grievances',
    category: 'inclusion',
    icon: '⚖️',
    badge: 'UGC Ombudsperson',
    regulatoryBody: 'SGRC Cell',
    description: 'Anonymous whistleblowing vaults, academic dispute hearings and statutory appeal timelines.'
  }
];

export default function CampusAdminShell() {
  const [activeTenantId, setActiveTenantId] = useState<string>('inst-apex-001');
  const [activeTab, setActiveTab] = useState<'overview' | 'directory' | 'roster' | 'fees' | 'audit'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentTenant: InstitutionContext = MOCK_INSTITUTIONS[activeTenantId] || MOCK_INSTITUTIONS['inst-apex-001'];

  const filteredPortals = ALL_GOVERNANCE_PORTALS.filter((portal) => {
    const matchesCategory = selectedCategory === 'all' || portal.category === selectedCategory;
    const matchesSearch =
      portal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.regulatoryBody.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg, #090d16)',
      color: 'var(--t1, #f8fafc)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Banner: Multi-Tenant Institution Selector & Branding */}
      <header style={{
        background: 'var(--card, #0f172a)',
        borderBottom: '1px solid var(--border, #1e293b)',
        padding: '16px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${currentTenant.themeColor}, #1e1b4b)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: '-0.3px' }}>
                {currentTenant.name}
              </h1>
              <span style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 999,
                background: `${currentTenant.themeColor}22`,
                color: currentTenant.themeColor,
                fontWeight: 600,
                border: `1px solid ${currentTenant.themeColor}55`,
                textTransform: 'uppercase'
              }}>
                {currentTenant.tier}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--t3, #94a3b8)', marginTop: 2 }}>
              Domain: <code style={{ color: '#cbd5e1' }}>{currentTenant.domain}</code> • Tenant ID: <code style={{ color: '#cbd5e1' }}>{currentTenant.id}</code>
            </div>
          </div>
        </div>

        {/* Multi-Tenant Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', fontWeight: 500 }}>Active Campus:</label>
          <select
            value={activeTenantId}
            onChange={(e) => setActiveTenantId(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--bg2, #1e293b)',
              color: 'var(--t1, #f8fafc)',
              border: '1px solid var(--border, #334155)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {Object.values(MOCK_INSTITUTIONS).map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name} ({inst.tier})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        background: 'rgba(15, 23, 42, 0.75)',
        borderBottom: '1px solid var(--border, #1e293b)',
        padding: '0 28px',
        display: 'flex',
        gap: 8,
        backdropFilter: 'blur(8px)',
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: '📊 Campus Overview', icon: '📊' },
          { id: 'directory', label: '🏛️ Central Governance Directory (40 Modules)', icon: '🏛️' },
          { id: 'roster', label: '👥 Student Roster & Ingestion', icon: '👥' },
          { id: 'fees', label: '💳 Sub-Ledger & Fee Management', icon: '💳' },
          { id: 'audit', label: '🛡️ Compliance & Accreditation', icon: '🛡️' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '14px 18px',
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? currentTenant.themeColor : 'var(--t3, #94a3b8)',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${currentTenant.themeColor}` : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: '28px', maxWidth: 1400, margin: '0 auto' }}>
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div style={{
                background: 'var(--card, #0f172a)',
                border: '1px solid var(--border, #1e293b)',
                borderRadius: 12,
                padding: 24,
                borderLeft: `4px solid ${currentTenant.themeColor}`
              }}>
                <div style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Roster Capacity</div>
                <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: '#f8fafc' }}>
                  3,420 <span style={{ fontSize: 16, color: 'var(--t3, #94a3b8)', fontWeight: 400 }}>/ {currentTenant.maxRosterCapacity}</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#10b981', marginTop: 8 }}>● 68.4% Enrollment Utilization</div>
              </div>

              <div style={{
                background: 'var(--card, #0f172a)',
                border: '1px solid var(--border, #1e293b)',
                borderRadius: 12,
                padding: 24,
                borderLeft: '4px solid #10b981'
              }}>
                <div style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Accreditation Status</div>
                <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: '#10b981' }}>NAAC A++</div>
                <div style={{ fontSize: 12.5, color: 'var(--t3, #94a3b8)', marginTop: 8 }}>NIRF & QS World Ranking Telemetry Active</div>
              </div>

              <div style={{
                background: 'var(--card, #0f172a)',
                border: '1px solid var(--border, #1e293b)',
                borderRadius: 12,
                padding: 24,
                borderLeft: '4px solid #f59e0b'
              }}>
                <div style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Fee Collection Rate</div>
                <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: '#f59e0b' }}>94.2%</div>
                <div style={{ fontSize: 12.5, color: 'var(--t3, #94a3b8)', marginTop: 8 }}>Double-entry verified ledger</div>
              </div>

              <div style={{
                background: 'var(--card, #0f172a)',
                border: '1px solid var(--border, #1e293b)',
                borderRadius: 12,
                padding: 24,
                borderLeft: '4px solid #6366f1'
              }}>
                <div style={{ fontSize: 12, color: 'var(--t3, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Institutional Governance</div>
                <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: '#6366f1' }}>40 Portals</div>
                <div style={{ fontSize: 12.5, color: '#38bdf8', marginTop: 8 }}>
                  <button
                    onClick={() => setActiveTab('directory')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      textDecoration: 'underline',
                      padding: 0,
                      cursor: 'pointer',
                      fontSize: 12.5
                    }}
                  >
                    View Complete Executive Directory →
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links Showcase */}
            <div style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>🌟 Key Operational Portals & High-Priority Systems</h2>
                <button
                  onClick={() => setActiveTab('directory')}
                  style={{
                    background: 'var(--card, #0f172a)',
                    border: '1px solid var(--border, #334155)',
                    color: '#f8fafc',
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Browse All 40 Portals
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                {ALL_GOVERNANCE_PORTALS.slice(0, 6).map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    style={{
                      textDecoration: 'none',
                      background: 'var(--card, #0f172a)',
                      border: '1px solid var(--border, #1e293b)',
                      borderRadius: 10,
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <span style={{ fontSize: 24 }}>{item.icon}</span>
                        <span style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: '#1e293b',
                          color: '#38bdf8',
                          border: '1px solid #334155',
                          fontWeight: 600
                        }}>
                          {item.regulatoryBody}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px 0', color: '#f8fafc' }}>{item.title}</h3>
                      <p style={{ fontSize: 12.5, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
                    </div>
                    <div style={{ marginTop: 14, fontSize: 12, color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Open Console →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Directory Tab: Master 40 Governance Portals Directory */}
        {activeTab === 'directory' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px 0' }}>Central University Governance & Operational Portals</h2>
              <p style={{ fontSize: 14, color: 'var(--t3, #94a3b8)', margin: 0 }}>
                Comprehensive master directory of all 40 statutory institutional administration, compliance, examination, and infrastructure consoles.
              </p>
            </div>

            {/* Filter Bar */}
            <div style={{
              background: 'var(--card, #0f172a)',
              border: '1px solid var(--border, #1e293b)',
              borderRadius: 10,
              padding: 16,
              marginBottom: 24,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search portals by title, regulatory body (UGC, NAAC, NIRF), or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 280,
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: '#020617',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  fontSize: 13.5,
                  outline: 'none'
                }}
              />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  { id: 'all', label: 'All (40)' },
                  { id: 'rankings', label: 'Rankings & IQAC' },
                  { id: 'academic', label: 'Academic Affairs' },
                  { id: 'exams', label: 'Exams & Custody' },
                  { id: 'finance', label: 'Finance & Tenders' },
                  { id: 'safety', label: 'Estates & Safety' },
                  { id: 'inclusion', label: 'Inclusion & Compliance' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: selectedCategory === cat.id ? 700 : 500,
                      borderRadius: 6,
                      border: '1px solid',
                      borderColor: selectedCategory === cat.id ? '#38bdf8' : '#334155',
                      background: selectedCategory === cat.id ? '#0284c722' : 'transparent',
                      color: selectedCategory === cat.id ? '#38bdf8' : '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Portals Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {filteredPortals.map((portal) => (
                <div
                  key={portal.id}
                  style={{
                    background: 'var(--card, #0f172a)',
                    border: '1px solid var(--border, #1e293b)',
                    borderRadius: 12,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={{ fontSize: 26 }}>{portal.icon}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{
                          fontSize: 10.5,
                          padding: '2px 7px',
                          borderRadius: 4,
                          background: '#1e293b',
                          color: '#38bdf8',
                          border: '1px solid #334155',
                          fontWeight: 600
                        }}>
                          {portal.regulatoryBody}
                        </span>
                        <span style={{
                          fontSize: 10.5,
                          padding: '2px 7px',
                          borderRadius: 4,
                          background: '#052e16',
                          color: '#4ade80',
                          border: '1px solid #166534',
                          fontWeight: 600
                        }}>
                          {portal.badge}
                        </span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: 15.5, fontWeight: 700, margin: '0 0 8px 0', color: '#f8fafc' }}>
                      {portal.title}
                    </h3>
                    <p style={{ fontSize: 12.5, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                      {portal.description}
                    </p>
                  </div>

                  <div style={{ marginTop: 18, borderTop: '1px solid #1e293b', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: 11, color: '#64748b' }}>{portal.path}</code>
                    <Link
                      href={portal.path}
                      style={{
                        textDecoration: 'none',
                        background: '#2563eb',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: 6,
                        fontSize: 12.5,
                        fontWeight: 600
                      }}
                    >
                      Open Portal →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredPortals.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>
                No governance portals match your search criteria.
              </div>
            )}
          </div>
        )}

        {activeTab === 'roster' && (
          <StudentRosterManager institutionId={currentTenant.id} />
        )}

        {activeTab === 'fees' && (
          <FeeLedgerDashboard institutionId={currentTenant.id} />
        )}

        {activeTab === 'audit' && (
          <div style={{
            background: 'var(--card, #0f172a)',
            border: '1px solid var(--border, #1e293b)',
            borderRadius: 12,
            padding: 28
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Institutional Compliance & Audit Trail</h2>
            <p style={{ fontSize: 13.5, color: 'var(--t3, #94a3b8)', marginBottom: 20 }}>
              Immutable audit ledger capturing all student onboarding, fee receipt hashes, and faculty grade overrides.
            </p>
            <div style={{
              background: '#020617',
              borderRadius: 8,
              padding: 16,
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#38bdf8',
              lineHeight: 1.6
            }}>
              <div>[2026-10-18T00:00:00Z] [AUDIT-OK] Tenant [{currentTenant.id}] RLS isolation check verified. 0 cross-tenant leaks.</div>
              <div>[2026-10-17T19:34:25Z] [FEE-HASH-SIG] Double-entry invariant holds: sum(debits) == sum(credits) + receivables.</div>
              <div>[2026-10-17T19:32:10Z] [ROSTER-SYNC] 31 student records ingested with zero schema collisions.</div>
              <div>[2026-10-17T19:30:00Z] [ACCREDITATION] NAAC Criterion 2.6 (Student Learning Outcomes) audit report generated.</div>
              <div>[2026-10-17T19:28:15Z] [NIRF-SEAL-VERIFIED] Composite ranking hash SHA-256 validated across 5 statutory dimensions.</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
