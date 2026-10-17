'use client';

import React, { useState } from 'react';
import {
  AlumniProfile,
  EndowmentContribution,
  EndowmentDesignation,
  alumniNetworkStore,
  exportAlumniDirectoryCSV,
  exportEndowmentLedgerCSV,
} from '@/lib/admin/alumniNetwork';

interface AlumniMentorshipPortalProps {
  institutionId?: string;
}

const SEED_ALUMNI: AlumniProfile[] = [
  {
    alumniId: 'alm-01',
    institutionId: 'inst-apex-001',
    name: 'Vikramaditya Singhal',
    graduationYear: 2020,
    degree: 'B.Tech Computer Science',
    department: 'Computer Science',
    currentCompany: 'Google',
    currentRole: 'Senior Software Engineer (Cloud Infrastructure)',
    industry: 'Cloud Computing & Distributed Systems',
    location: 'Bangalore, India',
    willingToMentor: true,
    mentorshipDomains: ['Distributed Systems', 'System Design Interview', 'Go & Kubernetes'],
    activeMenteeCount: 1,
    maxMentees: 3,
    email: 'vikram.singhal@google.com',
    isPrivacyProtected: true,
  },
  {
    alumniId: 'alm-02',
    institutionId: 'inst-apex-001',
    name: 'Dr. Neha Kapoor',
    graduationYear: 2018,
    degree: 'B.Tech Information Technology',
    department: 'Information Technology',
    currentCompany: 'Microsoft Research',
    currentRole: 'Principal Applied Scientist',
    industry: 'Artificial Intelligence & NLP',
    location: 'Redmond, WA, USA',
    willingToMentor: true,
    mentorshipDomains: ['Machine Learning Research', 'PhD Applications', 'LLM Fine-Tuning'],
    activeMenteeCount: 2,
    maxMentees: 2, // Full capacity
    email: 'neha.kapoor@microsoft.com',
    isPrivacyProtected: true,
  },
  {
    alumniId: 'alm-03',
    institutionId: 'inst-apex-001',
    name: 'Aditya Chawla',
    graduationYear: 2022,
    degree: 'B.Tech Computer Science',
    department: 'Computer Science',
    currentCompany: 'Stripe',
    currentRole: 'Software Engineer II (Payments Core)',
    industry: 'Fintech & Payment Rails',
    location: 'San Francisco, CA, USA',
    willingToMentor: true,
    mentorshipDomains: ['Fintech Engineering', 'Resume Review', 'Full-Stack TypeScript'],
    activeMenteeCount: 0,
    maxMentees: 3,
    email: 'aditya.chawla@stripe.com',
    isPrivacyProtected: true,
  },
];

const SEED_ENDOWMENTS = [
  {
    institutionId: 'inst-apex-001',
    alumniId: 'alm-01',
    alumniName: 'Vikramaditya Singhal',
    amount: 15000,
    designation: 'SCHOLARSHIP_ENDOWMENT' as EndowmentDesignation,
  },
  {
    institutionId: 'inst-apex-001',
    alumniId: 'alm-02',
    alumniName: 'Dr. Neha Kapoor',
    amount: 25000,
    designation: 'RESEARCH_LAB_INFRASTRUCTURE' as EndowmentDesignation,
  },
];

export const AlumniMentorshipPortal: React.FC<AlumniMentorshipPortalProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  // Seed store if empty
  useState(() => {
    const existing = alumniNetworkStore.getAlumniByInstitution(institutionId);
    if (existing.length === 0) {
      for (const a of SEED_ALUMNI) alumniNetworkStore.registerAlumni(a);
      for (const e of SEED_ENDOWMENTS) alumniNetworkStore.recordEndowment(e);
    }
  });

  const [activeTab, setActiveTab] = useState<'mentors' | 'endowments'>('mentors');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Mentorship Booking State
  const [selectedAlumnus, setSelectedAlumnus] = useState<AlumniProfile | null>(null);
  const [studentName, setStudentName] = useState<string>('Rohan Varma');
  const [studentId, setStudentId] = useState<string>('CS2026-015');
  const [sessionTopic, setSessionTopic] = useState<string>('System Design Mock Interview & Career Pathing');
  const [sessionDate, setSessionDate] = useState<string>('2026-10-25T16:00');

  // Endowment Donation Modal State
  const [isDonationOpen, setIsDonationOpen] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [donorAmount, setDonorAmount] = useState<number>(10000);
  const [donorDesignation, setDonorDesignation] = useState<EndowmentDesignation>('SCHOLARSHIP_ENDOWMENT');

  const [alumniList, setAlumniList] = useState<AlumniProfile[]>(() =>
    alumniNetworkStore.getAlumniByInstitution(institutionId)
  );

  const [endowments, setEndowments] = useState<EndowmentContribution[]>(() =>
    alumniNetworkStore.getEndowmentsByInstitution(institutionId)
  );

  const refreshAll = () => {
    setAlumniList(alumniNetworkStore.getAlumniByInstitution(institutionId));
    setEndowments(alumniNetworkStore.getEndowmentsByInstitution(institutionId));
  };

  const filteredAlumni = alumniList.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.currentRole.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = domainFilter === 'ALL' || a.mentorshipDomains.some(d => d.includes(domainFilter));
    return matchesSearch && matchesDomain;
  });

  const totalRaised = endowments.reduce((sum, e) => sum + e.amount, 0);
  const activeMentors = alumniList.filter(a => a.willingToMentor).length;

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumnus) return;

    try {
      const session = alumniNetworkStore.bookMentorshipSession({
        institutionId,
        alumniId: selectedAlumnus.alumniId,
        studentId,
        studentName,
        sessionTopic,
        scheduledAt: sessionDate,
      });

      setSelectedAlumnus(null);
      refreshAll();
      setBannerNotice(`Mentorship booked with ${selectedAlumnus.name}! Meeting Link: ${session.meetingLink}`);
      setTimeout(() => setBannerNotice(null), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'BOOKING_FAILED';
      setBannerNotice(`Failed to book session: ${msg}`);
      setTimeout(() => setBannerNotice(null), 4000);
    }
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || donorAmount <= 0) return;

    const gift = alumniNetworkStore.recordEndowment({
      institutionId,
      alumniId: `alm-donor-${Date.now()}`,
      alumniName: donorName.trim(),
      amount: donorAmount,
      designation: donorDesignation,
    });

    setIsDonationOpen(false);
    setDonorName('');
    refreshAll();
    setBannerNotice(`Thank you! Gift of $${donorAmount.toLocaleString()} received. SHA-256 Tax Receipt: ${gift.receiptHash.slice(0, 16)}...`);
    setTimeout(() => setBannerNotice(null), 7000);
  };

  const handleExportAlumniCSV = () => {
    const csv = exportAlumniDirectoryCSV(alumniList);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Alumni_Network_Directory_${institutionId}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportEndowmentsCSV = () => {
    const csv = exportEndowmentLedgerCSV(endowments);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Endowment_Ledger_${institutionId}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xl font-bold">
            🎓
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Institutional Alumni Mentorship & Endowment Network
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Connect students with industry alumni leaders, schedule 1-on-1 technical advisory sessions, and track philanthropic endowments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDonationOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <span>🎁</span> Contribute Endowment
          </button>
          <button
            onClick={activeTab === 'mentors' ? handleExportAlumniCSV : handleExportEndowmentsCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >
            <span>📥</span> Export {activeTab === 'mentors' ? 'Directory' : 'Endowment'} CSV
          </button>
        </div>
      </div>

      {bannerNotice && (
        <div className="p-3 bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 text-sm rounded-lg flex items-center gap-2">
          <span>ℹ️</span> {bannerNotice}
        </div>
      )}

      {/* Network Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Alumni</div>
          <div className="text-3xl font-bold text-slate-100 mt-2">{alumniList.length}</div>
          <div className="text-xs text-slate-500 mt-1">Across global tech & finance</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Mentors</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{activeMentors}</div>
          <div className="text-xs text-slate-500 mt-1">Offering 1-on-1 coaching</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Endowment Capital</div>
          <div className="text-3xl font-bold text-indigo-400 mt-2">${totalRaised.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Cryptographically audited gifts</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Top Employers</div>
          <div className="text-xl font-bold text-slate-100 mt-2 truncate">Google, Microsoft, Stripe</div>
          <div className="text-xs text-slate-500 mt-1">High-density campus hiring</div>
        </div>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'mentors'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Alumni Mentors ({alumniList.length})
          </button>
          <button
            onClick={() => setActiveTab('endowments')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'endowments'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Endowment Contributions ({endowments.length})
          </button>
        </div>

        {activeTab === 'mentors' && (
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, role, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 w-64 focus:outline-none focus:border-indigo-500"
            />

            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Mentorship Domains</option>
              <option value="Distributed Systems">Distributed Systems</option>
              <option value="System Design">System Design</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Fintech">Fintech</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'mentors' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredAlumni.map((alumnus) => {
            const isFull = alumnus.activeMenteeCount >= alumnus.maxMentees;

            return (
              <div
                key={alumnus.alumniId}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{alumnus.name}</h3>
                      <div className="text-xs font-medium text-indigo-400 mt-0.5">
                        {alumnus.currentRole}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold">{alumnus.currentCompany}</div>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      Class &apos;{alumnus.graduationYear.toString().slice(-2)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>📍 {alumnus.location}</span>
                    <span>•</span>
                    <span>{alumnus.degree}</span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Mentorship Domains
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {alumnus.mentorshipDomains.map((dom, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[11px] border border-slate-800 font-medium"
                        >
                          {dom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Capacity:{' '}
                    <span className={isFull ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {alumnus.activeMenteeCount} / {alumnus.maxMentees} Mentees
                    </span>
                  </div>

                  <button
                    disabled={isFull}
                    onClick={() => setSelectedAlumnus(alumnus)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition"
                  >
                    {isFull ? 'Capacity Full' : 'Book Session'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">
              Audited Endowment Gifts & Philanthropic Contributions
            </h2>
            <span className="text-xs text-slate-400">Section 80G / 501(c)(3) Compliant</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Gift ID</th>
                  <th className="py-3 px-4">Benefactor</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Fund Designation</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">SHA-256 Tax Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {endowments.map((gift) => (
                  <tr key={gift.giftId} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">
                      {gift.giftId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {gift.alumniName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ${gift.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-indigo-300">
                      {gift.designation.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {gift.contributionDate.split('T')[0]}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      {gift.receiptHash.slice(0, 16)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mentorship Booking Modal */}
      {selectedAlumnus && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleBookSession} className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>📅</span> Request Mentorship with {selectedAlumnus.name}
            </h3>
            <p className="text-xs text-slate-400">
              {selectedAlumnus.currentRole} at {selectedAlumnus.currentCompany}.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Roll Number / ID</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Session Agenda / Questions</label>
                <textarea
                  rows={3}
                  required
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Requested Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSelectedAlumnus(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold"
              >
                Confirm Mentorship Session
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Endowment Contribution Modal */}
      {isDonationOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleContribute} className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>🎁</span> Contribute to University Endowment
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Alumnus Benefactor Name</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Anand Mahindra"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Endowment Amount ($)</label>
                <input
                  type="number"
                  min="100"
                  required
                  value={donorAmount}
                  onChange={(e) => setDonorAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Fund Designation</label>
                <select
                  value={donorDesignation}
                  onChange={(e) => setDonorDesignation(e.target.value as EndowmentDesignation)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  <option value="SCHOLARSHIP_ENDOWMENT">Need-based Student Scholarships</option>
                  <option value="RESEARCH_LAB_INFRASTRUCTURE">Research Lab & GPU Infrastructure</option>
                  <option value="CAMPUS_SPORTS_AND_CULTURE">Campus Sports & Cultural Centers</option>
                  <option value="UNRESTRICTED">General University Endowment (Unrestricted)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsDonationOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold"
              >
                Process Endowment Gift
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AlumniMentorshipPortal;
