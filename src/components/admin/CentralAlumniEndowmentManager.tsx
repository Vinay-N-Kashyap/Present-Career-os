'use client';

import React, { useState } from 'react';
import {
  EndowmentCategory,
  DonationCurrency,
  EndowmentPledgeRecord,
  INITIAL_ALUMNI_ENDOWMENTS,
  registerEndowmentPledge,
  realizeCorpusAndCertify80G,
  activateEndowmentChair,
  exportAlumniEndowmentLedgerCSV,
} from '@/lib/admin/centralAlumniEndowment';

export default function CentralAlumniEndowmentManager() {
  const [endowments, setEndowments] = useState<EndowmentPledgeRecord[]>(INITIAL_ALUMNI_ENDOWMENTS);
  const [filterCategory, setFilterCategory] = useState<EndowmentCategory | 'ALL'>('ALL');
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [isRealizeModalOpen, setIsRealizeModalOpen] = useState(false);
  const [selectedEndowment, setSelectedEndowment] = useState<EndowmentPledgeRecord | null>(null);
  const [realizeInrInput, setRealizeInrInput] = useState<number>(0);

  // New Pledge Form State
  const [newDonorName, setNewDonorName] = useState('');
  const [newBatchYear, setNewBatchYear] = useState(2000);
  const [newDegree, setNewDegree] = useState('B.Tech Computer Science');
  const [newPan, setNewPan] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newCategory, setNewCategory] = useState<EndowmentCategory>('CHAIR_PROFESSORSHIP');
  const [newAmount, setNewAmount] = useState(50000000);
  const [newCurrency, setNewCurrency] = useState<DonationCurrency>('INR');
  const [newExchangeRate, setNewExchangeRate] = useState(1.0);
  const [isForeign, setIsForeign] = useState(false);
  const [newFcraNo, setNewFcraNo] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered Endowments
  const filteredList = filterCategory === 'ALL'
    ? endowments
    : endowments.filter((e) => e.category === filterCategory);

  // Telemetry Aggregations
  const totalCorpusInr = endowments.reduce((sum, e) => sum + e.realizedAmountInr, 0);
  const totalAnnualPayoutInr = endowments.reduce((sum, e) => sum + e.annualNetPayoutInr, 0);
  const certified80gCount = endowments.filter((e) => e.section80gCertNumber).length;
  const certifiedRate = endowments.length > 0 ? ((certified80gCount / endowments.length) * 100).toFixed(1) : '0';
  const operationalChairsCount = endowments.filter((e) => e.stage === 'ENDOWMENT_CHAIR_OPERATIONAL').length;

  const handleCreatePledge = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const created = registerEndowmentPledge({
        donorFullName: newDonorName,
        donorBatchYear: Number(newBatchYear),
        donorAlmaMaterDegree: newDegree,
        donorPanNumber: newPan,
        donorEmail: newEmail,
        organizationAffiliation: newOrg || undefined,
        category: newCategory,
        pledgedAmount: Number(newAmount),
        currency: newCurrency,
        exchangeRateToInr: Number(newExchangeRate),
        isForeignDonation: isForeign,
        fcraApprovalNumber: newFcraNo || undefined,
        designatedDepartmentOrPurpose: newPurpose,
      });

      setEndowments([created, ...endowments]);
      setIsPledgeModalOpen(false);
      // Reset form
      setNewDonorName('');
      setNewPan('');
      setNewEmail('');
      setNewPurpose('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('An unexpected error occurred while logging endowment pledge.');
      }
    }
  };

  const handleOpenRealizeModal = (endowment: EndowmentPledgeRecord) => {
    setSelectedEndowment(endowment);
    setRealizeInrInput(endowment.realizedAmountInr);
    setIsRealizeModalOpen(true);
  };

  const handleConfirmRealization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEndowment) return;
    try {
      const updated = realizeCorpusAndCertify80G(selectedEndowment, Number(realizeInrInput));
      setEndowments(endowments.map((item) => (item.endowmentId === updated.endowmentId ? updated : item)));
      setIsRealizeModalOpen(false);
      setSelectedEndowment(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error realizing corpus.');
    }
  };

  const handleActivateChair = (endowment: EndowmentPledgeRecord) => {
    try {
      const updated = activateEndowmentChair(endowment);
      setEndowments(endowments.map((item) => (item.endowmentId === updated.endowmentId ? updated : item)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error activating endowment chair.');
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = exportAlumniEndowmentLedgerCSV(endowments);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Alumni_Endowment_Ledger_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Indian Trusts Act 1882 & Sec 80G
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              FCRA 2010 MHA Compliant
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
            Central University Alumni Endowment & Philanthropy Directorate
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Chair Professorships, Student Merit Fellowships, Infrastructure Naming & Perpetual Sovereign Yield Ledger
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Export Statutory CSV
          </button>
          <button
            onClick={() => setIsPledgeModalOpen(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
          >
            + Log Alumni Pledge
          </button>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Realized Corpus</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            ₹{(totalCorpusInr / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-xs text-slate-500">Principal university endowment funds</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Annual Yield Net Payout</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            ₹{(totalAnnualPayoutInr / 100000).toFixed(2)} L/yr
          </div>
          <span className="text-xs text-slate-500">6.0% net sovereign yield distribution</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Section 80G Certified</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {certifiedRate}%
          </div>
          <span className="text-xs text-slate-500">{certified80gCount} of {endowments.length} gifts Form 10BE certified</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Endowed Chairs</span>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            {operationalChairsCount}
          </div>
          <span className="text-xs text-slate-500">Distinguished faculty chairs funded</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        {(['ALL', 'CHAIR_PROFESSORSHIP', 'STUDENT_MERIT_SCHOLARSHIP', 'INFRASTRUCTURE_NAMING', 'RESEARCH_INCUBATION_SEED'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {cat.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Ledger Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((endowment) => (
          <div
            key={endowment.endowmentId}
            className="flex flex-col justify-between p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300">
                  {endowment.trackingToken}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                    endowment.stage === 'ENDOWMENT_CHAIR_OPERATIONAL'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : endowment.stage === 'SECTION_80G_CERTIFIED'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      : endowment.stage === 'FCRA_CLEARANCE_PENDING'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {endowment.stage.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mt-3">{endowment.donorFullName}</h3>
              <p className="text-xs text-slate-400">
                Class of {endowment.donorBatchYear} • {endowment.donorAlmaMaterDegree}
              </p>
              {endowment.organizationAffiliation && (
                <p className="text-xs text-indigo-400 mt-0.5 font-medium">
                  {endowment.organizationAffiliation}
                </p>
              )}

              <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Pledged Gift:</span>
                  <span className="font-semibold text-white">
                    {endowment.currency} {endowment.pledgedAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Realized Corpus:</span>
                  <span className="font-bold text-emerald-400">
                    ₹{(endowment.realizedAmountInr / 10000000).toFixed(2)} Cr
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Annual Net Payout:</span>
                  <span className="font-semibold text-cyan-400">
                    ₹{(endowment.annualNetPayoutInr / 100000).toFixed(2)} L/yr
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs">
                <span className="text-slate-400 block font-medium">Designated Purpose:</span>
                <span className="text-slate-200">{endowment.designatedDepartmentOrPurpose}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                {endowment.section80gCertNumber ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    80G: {endowment.section80gCertNumber}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    80G Pending
                  </span>
                )}
                {endowment.isForeignDonation && (
                  <span
                    className={`px-2 py-0.5 rounded border ${
                      endowment.fcraApprovalNumber
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {endowment.fcraApprovalNumber ? `FCRA: ${endowment.fcraApprovalNumber}` : 'FCRA Clearance Awaited'}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                Seal: {endowment.cryptographicSeal?.slice(0, 10)}...
              </span>

              <div className="flex items-center gap-2">
                {endowment.stage === 'PLEDGE_FILED' && (
                  <button
                    onClick={() => handleOpenRealizeModal(endowment)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  >
                    Realize & 80G
                  </button>
                )}

                {endowment.stage === 'SECTION_80G_CERTIFIED' && (
                  <button
                    onClick={() => handleActivateChair(endowment)}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-indigo-600 hover:bg-indigo-500 text-white transition"
                  >
                    Activate Chair
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Log New Alumni Pledge */}
      {isPledgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-1">Log Alumni Philanthropic Pledge</h2>
            <p className="text-xs text-slate-400 mb-4">
              Compliant with Indian Trusts Act 1882, Section 80G Form 10BE and MHA FCRA regulations.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePledge} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Donor Full Name</label>
                <input
                  type="text"
                  required
                  value={newDonorName}
                  onChange={(e) => setNewDonorName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Gupta"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Batch Graduation Year</label>
                  <input
                    type="number"
                    required
                    value={newBatchYear}
                    onChange={(e) => setNewBatchYear(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Alma Mater Degree</label>
                  <input
                    type="text"
                    required
                    value={newDegree}
                    onChange={(e) => setNewDegree(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">PAN Number (for 80G)</label>
                  <input
                    type="text"
                    required
                    value={newPan}
                    onChange={(e) => setNewPan(e.target.value)}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="donor@alumni.edu"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Organization / Foundation (Optional)</label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="e.g. Gupta Charitable Foundation"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Endowment Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EndowmentCategory)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CHAIR_PROFESSORSHIP">Chair Professorship (Min ₹5 Cr)</option>
                    <option value="STUDENT_MERIT_SCHOLARSHIP">Student Merit Scholarship</option>
                    <option value="INFRASTRUCTURE_NAMING">Infrastructure Naming Rights</option>
                    <option value="RESEARCH_INCUBATION_SEED">Research Incubation Seed Fund</option>
                    <option value="UNRESTRICTED_DISCRETIONARY">Unrestricted Discretionary</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Donation Currency</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => {
                      const curr = e.target.value as DonationCurrency;
                      setNewCurrency(curr);
                      if (curr === 'INR') {
                        setNewExchangeRate(1.0);
                        setIsForeign(false);
                      } else if (curr === 'USD') {
                        setNewExchangeRate(86.5);
                        setIsForeign(true);
                      } else if (curr === 'GBP') {
                        setNewExchangeRate(108.0);
                        setIsForeign(true);
                      } else if (curr === 'EUR') {
                        setNewExchangeRate(92.0);
                        setIsForeign(true);
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Pledged Amount</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Exchange Rate to INR</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newExchangeRate}
                    onChange={(e) => setNewExchangeRate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {isForeign && (
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    FCRA MHA Approval / Registration No (if available)
                  </label>
                  <input
                    type="text"
                    value={newFcraNo}
                    onChange={(e) => setNewFcraNo(e.target.value)}
                    placeholder="e.g. FCRA-MHA-2026-99120"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Designated Department or Purpose</label>
                <textarea
                  required
                  rows={2}
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder="e.g. Endowed Chair in AI Ethics & Distinguished Visiting Fellows"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPledgeModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Confirm & Seal Pledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Realize Corpus & Issue 80G Certificate */}
      {isRealizeModalOpen && selectedEndowment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-white mb-1">Realize Corpus & Issue 80G Certificate</h2>
            <p className="text-xs text-slate-400 mb-4">
              Donor: {selectedEndowment.donorFullName} ({selectedEndowment.trackingToken})
            </p>

            <form onSubmit={handleConfirmRealization} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Actual Realized INR Amount</label>
                <input
                  type="number"
                  required
                  value={realizeInrInput}
                  onChange={(e) => setRealizeInrInput(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                Authorizing realization will generate a Form 10BE Section 80G Certificate for Income Tax exemption and calculate net perpetual annual yield.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRealizeModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                >
                  Certify 80G & Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
