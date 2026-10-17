'use client';

import React, { useState } from 'react';
import {
  IndustryMoURecord,
  InternshipAllocation,
  PartnershipTier,
  MoUStatus,
  industryMoUStore,
  exportIndustryMoUCSV,
} from '@/lib/admin/industryMOU';

interface IndustryPartnershipsManagerProps {
  institutionId?: string;
}

const SEED_MOUS: IndustryMoURecord[] = [
  {
    mouId: 'mou-g-01',
    institutionId: 'inst-apex-001',
    partnerCompanyName: 'Google Cloud Platform',
    partnerIndustry: 'Cloud Infrastructure & AI',
    partnershipTier: 'STRATEGIC_GLOBAL',
    signedDate: '2025-06-01T00:00:00Z',
    expiryDate: '2028-05-31T00:00:00Z',
    status: 'ACTIVE',
    primaryContactPerson: 'Sanjay Deshmukh (University Programs)',
    contactEmail: 'sanjay.d@google.com',
    committedInternshipsPerYear: 25,
    filledInternshipsCount: 18,
    averageStipendPerMonth: 65000,
    ppoConversionRatePercentage: 82.5,
    jointLabEstablished: true,
    jointLabName: 'Apex-Google Cloud Innovation Center',
    curriculumAdvisoryParticipation: true,
  },
  {
    mouId: 'mou-ms-02',
    institutionId: 'inst-apex-001',
    partnerCompanyName: 'Microsoft Corporation',
    partnerIndustry: 'Enterprise Software & Azure AI',
    partnershipTier: 'STRATEGIC_GLOBAL',
    signedDate: '2024-08-15T00:00:00Z',
    expiryDate: '2027-08-14T00:00:00Z',
    status: 'ACTIVE',
    primaryContactPerson: 'Priyanka Iyer (Talent Acquisition)',
    contactEmail: 'priyanka.i@microsoft.com',
    committedInternshipsPerYear: 20,
    filledInternshipsCount: 15,
    averageStipendPerMonth: 60000,
    ppoConversionRatePercentage: 78.0,
    jointLabEstablished: true,
    jointLabName: 'Azure Quantum & Edge Lab',
    curriculumAdvisoryParticipation: true,
  },
  {
    mouId: 'mou-nv-03',
    institutionId: 'inst-apex-001',
    partnerCompanyName: 'NVIDIA Graphics Technologies',
    partnerIndustry: 'GPU Compute & Autonomous Machines',
    partnershipTier: 'TIER_1_ENTERPRISE',
    signedDate: '2023-11-01T00:00:00Z',
    expiryDate: '2026-11-30T00:00:00Z', // Pending renewal within 60 days
    status: 'PENDING_RENEWAL',
    primaryContactPerson: 'Arun Bhatia (Deep Learning Institute)',
    contactEmail: 'abhatia@nvidia.com',
    committedInternshipsPerYear: 15,
    filledInternshipsCount: 14,
    averageStipendPerMonth: 70000,
    ppoConversionRatePercentage: 85.0,
    jointLabEstablished: true,
    jointLabName: 'Apex AI Deep Learning Supercomputing Suite',
    curriculumAdvisoryParticipation: false,
  },
];

const SEED_ALLOCATIONS = [
  {
    institutionId: 'inst-apex-001',
    mouId: 'mou-g-01',
    studentId: 'CS2026-004',
    studentName: 'Aarav Patel',
    department: 'Computer Science',
    stipendAmount: 65000,
    startDate: '2026-05-01',
    endDate: '2026-07-31',
    ppoReceived: true,
  },
  {
    institutionId: 'inst-apex-001',
    mouId: 'mou-ms-02',
    studentId: 'IT2026-018',
    studentName: 'Simran Khurana',
    department: 'Information Technology',
    stipendAmount: 60000,
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    ppoReceived: false,
  },
];

export const IndustryPartnershipsManager: React.FC<IndustryPartnershipsManagerProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  // Seed store if empty
  useState(() => {
    const existing = industryMoUStore.getMoUsByInstitution(institutionId);
    if (existing.length === 0) {
      for (const m of SEED_MOUS) industryMoUStore.registerMoU(m);
      for (const a of SEED_ALLOCATIONS) industryMoUStore.allocateInternship(a);
    }
  });

  const [activeTab, setActiveTab] = useState<'mous' | 'allocations'>('mous');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // New MoU modal state
  const [isMoUModalOpen, setIsMoUModalOpen] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [industryDomain, setIndustryDomain] = useState<string>('Cloud & AI');
  const [tier, setTier] = useState<PartnershipTier>('TIER_1_ENTERPRISE');
  const [expiryDate, setExpiryDate] = useState<string>('2028-12-31');
  const [committedSeats, setCommittedSeats] = useState<number>(10);
  const [avgStipend, setAvgStipend] = useState<number>(45000);
  const [hasJointLab, setHasJointLab] = useState<boolean>(false);
  const [jointLabName, setJointLabName] = useState<string>('');

  // Allocation modal state
  const [isAllocModalOpen, setIsAllocModalOpen] = useState<boolean>(false);
  const [selectedMoUId, setSelectedMoUId] = useState<string>(SEED_MOUS[0].mouId);
  const [studentName, setStudentName] = useState<string>('Mehul Rastogi');
  const [studentId, setStudentId] = useState<string>('CS2026-088');
  const [studentDept, setStudentDept] = useState<string>('Computer Science');
  const [stipendAmt, setStipendAmt] = useState<number>(55000);

  const [mous, setMous] = useState<IndustryMoURecord[]>(() =>
    industryMoUStore.getMoUsByInstitution(institutionId)
  );

  const [allocations, setAllocations] = useState<InternshipAllocation[]>(() =>
    industryMoUStore.getAllocationsByInstitution(institutionId)
  );

  const refreshAll = () => {
    setMous(industryMoUStore.getMoUsByInstitution(institutionId));
    setAllocations(industryMoUStore.getAllocationsByInstitution(institutionId));
  };

  const filteredMoUs = mous.filter(m => {
    if (tierFilter !== 'ALL' && m.partnershipTier !== tierFilter) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    return true;
  });

  const totalCommitted = mous.reduce((s, m) => s + m.committedInternshipsPerYear, 0);
  const totalFilled = mous.reduce((s, m) => s + m.filledInternshipsCount, 0);
  const avgPPO = mous.length > 0
    ? Math.round((mous.reduce((s, m) => s + m.ppoConversionRatePercentage, 0) / mous.length) * 10) / 10
    : 0;

  const handleCreateMoU = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    const newMoU = industryMoUStore.registerMoU({
      mouId: `mou-${Date.now()}`,
      institutionId,
      partnerCompanyName: companyName.trim(),
      partnerIndustry: industryDomain,
      partnershipTier: tier,
      signedDate: new Date().toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
      status: 'ACTIVE',
      primaryContactPerson: 'University Corporate Relations',
      contactEmail: `partnerships@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      committedInternshipsPerYear: committedSeats,
      filledInternshipsCount: 0,
      averageStipendPerMonth: avgStipend,
      ppoConversionRatePercentage: 75.0,
      jointLabEstablished: hasJointLab,
      jointLabName: hasJointLab ? jointLabName : undefined,
      curriculumAdvisoryParticipation: true,
    });

    setIsMoUModalOpen(false);
    setCompanyName('');
    refreshAll();
    setBannerNotice(`Industry MoU registered with ${newMoU.partnerCompanyName}! Committed seats: ${committedSeats}`);
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const alloc = industryMoUStore.allocateInternship({
        institutionId,
        mouId: selectedMoUId,
        studentId,
        studentName,
        department: studentDept,
        stipendAmount: stipendAmt,
        startDate: '2026-06-01',
        endDate: '2026-08-31',
      });

      setIsAllocModalOpen(false);
      refreshAll();
      setBannerNotice(`Student ${alloc.studentName} allocated to ${alloc.partnerCompanyName} internship!`);
      setTimeout(() => setBannerNotice(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ALLOCATION_FAILED';
      setBannerNotice(`Failed to allocate: ${msg}`);
      setTimeout(() => setBannerNotice(null), 4000);
    }
  };

  const handleExportCSV = () => {
    const csv = exportIndustryMoUCSV(mous);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Industry_MoUs_NAAC_Report_${institutionId}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBannerNotice('NAAC Criterion 3.5 Collaboration CSV exported successfully.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xl font-bold">
            🤝
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Industry Partnerships & Corporate MoUs Governance
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              NAAC Criterion 3.5 & NBA Criterion 10 corporate agreements, student internship quotas, and pre-placement offer telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAllocModalOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-semibold transition"
          >
            <span>👤</span> Allocate Student
          </button>
          <button
            onClick={() => setIsMoUModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <span>+</span> Register New MoU
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >
            <span>📥</span> Export NAAC CSV
          </button>
        </div>
      </div>

      {bannerNotice && (
        <div className="p-3 bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 text-sm rounded-lg flex items-center gap-2">
          <span>ℹ️</span> {bannerNotice}
        </div>
      )}

      {/* Corporate Health Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active MoUs</div>
          <div className="text-3xl font-bold text-slate-100 mt-2">{mous.length}</div>
          <div className="text-xs text-slate-500 mt-1">Multi-year corporate pacts</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Committed Internships</div>
          <div className="text-3xl font-bold text-indigo-400 mt-2">{totalCommitted} seats</div>
          <div className="text-xs text-slate-500 mt-1">{totalFilled} filled this academic year</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">PPO Conversion Rate</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{avgPPO}%</div>
          <div className="text-xs text-slate-500 mt-1">Internship to full-time offers</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Joint Research Labs</div>
          <div className="text-3xl font-bold text-amber-400 mt-2">
            {mous.filter(m => m.jointLabEstablished).length} Labs
          </div>
          <div className="text-xs text-slate-500 mt-1">Co-sponsored center of excellence</div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('mous')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'mous' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Corporate MoUs ({mous.length})
          </button>
          <button
            onClick={() => setActiveTab('allocations')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'allocations' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Allocations ({allocations.length})
          </button>
        </div>

        {activeTab === 'mous' && (
          <div className="flex items-center gap-3">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Tiers</option>
              <option value="STRATEGIC_GLOBAL">Strategic Global</option>
              <option value="TIER_1_ENTERPRISE">Tier 1 Enterprise</option>
              <option value="RESEARCH_CONSORTIUM">Research Consortium</option>
              <option value="REGIONAL_STARTUP">Regional Startup</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_RENEWAL">Pending Renewal</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'mous' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMoUs.map((mou) => {
            const isRenewal = mou.status === 'PENDING_RENEWAL';

            return (
              <div
                key={mou.mouId}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{mou.partnerCompanyName}</h3>
                      <div className="text-xs text-slate-400 font-medium">{mou.partnerIndustry}</div>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        isRenewal
                          ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {mou.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div>
                      Tier: <span className="text-indigo-400 font-semibold">{mou.partnershipTier.replace(/_/g, ' ')}</span>
                    </div>
                    <div>
                      Expiry: <span className="text-slate-300">{mou.expiryDate.split('T')[0]}</span>
                    </div>
                  </div>

                  {mou.jointLabEstablished && (
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-indigo-300">
                      🔬 <span className="font-semibold">{mou.jointLabName}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Committed Seats</span>
                      <span className="font-bold text-slate-200">
                        {mou.filledInternshipsCount} / {mou.committedInternshipsPerYear}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Avg Stipend</span>
                      <span className="font-bold text-emerald-400">${mou.averageStipendPerMonth.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">PPO Conversion:</span>
                  <span className="font-bold text-indigo-400">{mou.ppoConversionRatePercentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">
              Active Student Internship Placements ({allocations.length})
            </h2>
            <span className="text-xs text-slate-400">Corporate MoUs Direct Placement</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Partner Employer</th>
                  <th className="py-3 px-4">Monthly Stipend</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">PPO Offer Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {allocations.map((alloc) => (
                  <tr key={alloc.allocationId} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{alloc.studentName}</div>
                      <div className="text-xs text-slate-500">{alloc.studentId}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {alloc.department}
                    </td>
                    <td className="py-3 px-4 font-semibold text-indigo-300">
                      {alloc.partnerCompanyName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ${alloc.stipendAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {alloc.startDate} to {alloc.endDate}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {alloc.ppoReceived ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
                          PPO Extended 🎉
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-700 font-medium">
                          In Progress
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New MoU Registration Modal */}
      {isMoUModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleCreateMoU} className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>🤝</span> Register Institutional Industry MoU
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Partner Corporate Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Cisco Systems"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Industry Domain</label>
                <input
                  type="text"
                  required
                  value={industryDomain}
                  onChange={(e) => setIndustryDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Partnership Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as PartnershipTier)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  <option value="STRATEGIC_GLOBAL">Strategic Global</option>
                  <option value="TIER_1_ENTERPRISE">Tier 1 Enterprise</option>
                  <option value="RESEARCH_CONSORTIUM">Research Consortium</option>
                  <option value="REGIONAL_STARTUP">Regional Startup</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Committed Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={committedSeats}
                    onChange={(e) => setCommittedSeats(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Avg Stipend ($)</label>
                  <input
                    type="number"
                    min="1000"
                    value={avgStipend}
                    onChange={(e) => setAvgStipend(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Agreement Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasJointLab}
                    onChange={(e) => setHasJointLab(e.target.checked)}
                    className="accent-indigo-500 rounded"
                  />
                  Establish Co-Sponsored Research Lab
                </label>
                {hasJointLab && (
                  <input
                    type="text"
                    placeholder="Enter center of excellence name..."
                    value={jointLabName}
                    onChange={(e) => setJointLabName(e.target.value)}
                    className="w-full mt-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsMoUModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold"
              >
                Register Agreement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Student Internship Allocation Modal */}
      {isAllocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleAllocate} className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>👤</span> Allocate Student to Industry Internship
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Corporate Partner MoU</label>
                <select
                  value={selectedMoUId}
                  onChange={(e) => setSelectedMoUId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  {mous.map(m => (
                    <option key={m.mouId} value={m.mouId}>
                      {m.partnerCompanyName} ({m.filledInternshipsCount}/{m.committedInternshipsPerYear} filled)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Roll Number</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={studentDept}
                  onChange={(e) => setStudentDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Stipend ($)</label>
                <input
                  type="number"
                  min="1000"
                  required
                  value={stipendAmt}
                  onChange={(e) => setStipendAmt(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAllocModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold"
              >
                Confirm Placement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default IndustryPartnershipsManager;
