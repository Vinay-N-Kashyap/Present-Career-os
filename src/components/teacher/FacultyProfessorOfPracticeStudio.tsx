'use client';

import React, { useState } from 'react';
import {
  PoPFundingModel,
  PoPTenureStatus,
  PoPHonorariumBill,
  ProfessorOfPracticeRecord,
  MIN_INDUSTRY_EXPERIENCE_YEARS,
  MAX_UNIVERSITY_MONTHLY_HONORARIUM_INR,
  onboardProfessorOfPractice,
  generatePoPHonorariumBill,
  disbursePoPHonorarium,
  exportPoPLedgerCSV,
  SAMPLE_POP_RECORDS,
} from '@/lib/teacher/facultyProfessorOfPractice';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';

export default function FacultyProfessorOfPracticeStudio() {
  const {
    records,
    setRecords,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<ProfessorOfPracticeRecord>('faculty_professor_of_practice', SAMPLE_POP_RECORDS, 'popRecordId');
  const [selectedFunding, setSelectedFunding] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ProfessorOfPracticeRecord | null>(null);

  // Modals
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [actionRecord, setActionRecord] = useState<ProfessorOfPracticeRecord | null>(null);

  // Onboarding Form State
  const [name, setName] = useState('Dr. Sangeeta Rao');
  const [parentOrg, setParentOrg] = useState('Google Cloud / DeepMind Enterprise');
  const [designation, setDesignation] = useState('Senior Staff AI Architect & Engineering Lead');
  const [experienceYears, setExperienceYears] = useState<number>(18);
  const [department, setDepartment] = useState('Computer Science & AI');
  const [fundingModel, setFundingModel] = useState<PoPFundingModel>('UNIVERSITY_FUNDED_POP');
  const [sponsorName, setSponsorName] = useState('');
  const [monthlyHonorarium, setMonthlyHonorarium] = useState<number>(100000);
  const [tenureYears, setTenureYears] = useState<number>(1);
  const [courseCodes, setCourseCodes] = useState('CS-810-AUTONOMOUS-AGENTS; CS-840-LLM-OPS');
  const [formError, setFormError] = useState('');

  // Bill Generation Form State
  const [billingMonth, setBillingMonth] = useState('2026-03');
  const [daysDelivered, setDaysDelivered] = useState<number>(18);

  // Feedback Toast
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // KPIs
  const totalPoPs = records.length;
  const totalActive = records.filter(r => r.status === 'APPOINTMENT_ACTIVE').length;
  const industrySponsoredCount = records.filter(r => r.fundingModel === 'INDUSTRY_SPONSORED_POP').length;
  const industryShare = totalPoPs > 0 ? Math.round((industrySponsoredCount / totalPoPs) * 100) : 0;
  const totalMonthlyCommitmentInr = records.reduce((acc, r) => acc + r.monthlyHonorariumRateInr, 0);
  const totalDisbursedInr = records.reduce((acc, r) => {
    return acc + r.honorariumBills.filter(b => b.status === 'DISBURSED_CLEARED').reduce((bAcc, b) => bAcc + b.netPayableInr, 0);
  }, 0);
  const totalTdsDeductedInr = records.reduce((acc, r) => {
    return acc + r.honorariumBills.reduce((bAcc, b) => bAcc + b.tdsDeductionInr, 0);
  }, 0);

  // Filtered List
  const filteredRecords = records.filter(r => {
    const matchesFunding = selectedFunding === 'ALL' || r.fundingModel === selectedFunding;
    const matchesSearch =
      r.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.parentOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.popRecordId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFunding && matchesSearch;
  });

  // Handlers
  const handleOnboardPoP = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      const created = onboardProfessorOfPractice({
        expertName: name,
        parentOrganization: parentOrg,
        designationInIndustry: designation,
        totalYearsIndustryExperience: experienceYears,
        department,
        fundingModel,
        sponsoringIndustryPartner: sponsorName || undefined,
        monthlyHonorariumRateInr: monthlyHonorarium,
        tenureYears,
        coTaughtCourseCodes: courseCodes.split(';').map(c => c.trim()).filter(Boolean),
      });

      await saveRecord(created);
      setShowOnboardModal(false);
      notify(`Professor of Practice ${created.expertName} successfully onboarded in ${created.department}!`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to onboard Professor of Practice');
    }
  };

  const handleOpenBillModal = (record: ProfessorOfPracticeRecord) => {
    setActionRecord(record);
    setShowBillModal(true);
  };

  const handleGenerateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionRecord) return;

    try {
      const { record: updated, bill } = generatePoPHonorariumBill(actionRecord, {
        billingMonth,
        daysDelivered,
      });

      await saveRecord(updated);
      if (selectedRecord?.popRecordId === updated.popRecordId) {
        setSelectedRecord(updated);
      }
      setShowBillModal(false);
      notify(
        `Generated honorarium bill for ${bill.billingMonth}: Gross ₹${bill.grossAmountInr.toLocaleString('en-IN')}, TDS (10%) ₹${bill.tdsDeductionInr.toLocaleString('en-IN')}, Net ₹${bill.netPayableInr.toLocaleString('en-IN')}.`
      );
    } catch (err: any) {
      notify(err.message || 'Failed to generate honorarium bill', 'error');
    }
  };

  const handleDisburseBill = async (record: ProfessorOfPracticeRecord, billId: string) => {
    const res = disbursePoPHonorarium(record, billId);
    if (!res.success) {
      notify(res.error || 'Failed to disburse honorarium', 'error');
      return;
    }

    await saveRecord(res.record);
    if (selectedRecord?.popRecordId === res.record.popRecordId) {
      setSelectedRecord(res.record);
    }
    notify(`Honorarium successfully disbursed via NEFT to ${record.expertName}.`);
  };

  const handleExportCSV = () => {
    const csv = exportPoPLedgerCSV(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `professor_of_practice_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Official Professor of Practice (PoP) Ledger CSV exported.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                Faculty Professor of Practice (PoP) & Industry Chair Studio
                <span className={`text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  syncSource === 'supabase'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${syncSource === 'supabase' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                  {syncSource === 'supabase' ? 'PostgreSQL Active (support.pinit)' : 'Resilient Local Storage'}
                  {isSaving && <span className="text-emerald-400 ml-1">Saving...</span>}
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                UGC 2022 Guidelines • 15+ Years Industry Practice • Industry-Sponsored & University Models • Section 194J 10% TDS Deductions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PoP CSV
          </button>
          <button
            onClick={() => setShowOnboardModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Onboard Professor of Practice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active PoP Experts</p>
          <p className="text-2xl font-bold text-white mt-1">{totalActive}</p>
          <span className="text-[11px] text-indigo-400 mt-1 block">15+ Yrs Industry Seniority</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Monthly Commitment</p>
          <p className="text-2xl font-bold text-amber-300 mt-1">₹{totalMonthlyCommitmentInr.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Total Retainer Portfolio</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Disbursed (Net)</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">₹{totalDisbursedInr.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Cleared via NEFT</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-rose-400 uppercase tracking-wider">TDS (Sec 194J)</p>
          <p className="text-2xl font-bold text-rose-300 mt-1">₹{totalTdsDeductedInr.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">10% Professional Tax</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Industry Sponsored</p>
          <p className="text-2xl font-bold text-cyan-300 mt-1">{industryShare}%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">{industrySponsoredCount} Corporate Funded</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-purple-400 uppercase tracking-wider">Faculty Ceiling</p>
          <p className="text-2xl font-bold text-purple-300 mt-1">10.0%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">UGC Sanctioned Max Cap</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center overflow-x-auto gap-2 border border-slate-800 rounded-lg p-1 bg-slate-900/40">
          {[
            { id: 'ALL', label: 'All Faculty Chairs' },
            { id: 'UNIVERSITY_FUNDED_POP', label: 'University Funded (Max ₹1L)' },
            { id: 'INDUSTRY_SPONSORED_POP', label: 'Industry Sponsored' },
            { id: 'HONORARY_POP', label: 'Honorary Practice' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFunding(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                selectedFunding === tab.id
                  ? 'bg-indigo-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search expert, company, dept..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* PoP Roster Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Expert Name & Token</th>
                <th className="py-3 px-4">Industry Organization & Role</th>
                <th className="py-3 px-4 text-center">Seniority</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Funding Scheme</th>
                <th className="py-3 px-4 text-right">Monthly Retainer</th>
                <th className="py-3 px-4 text-center">Tenure</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No Professors of Practice match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(pop => (
                  <tr key={pop.popRecordId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{pop.expertName}</div>
                      <div className="text-[11px] font-mono text-indigo-400">{pop.popRecordId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{pop.parentOrganization}</div>
                      <div className="text-[10px] text-slate-500">{pop.designationInIndustry}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {pop.totalYearsIndustryExperience} Yrs
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200">{pop.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          pop.fundingModel === 'INDUSTRY_SPONSORED_POP'
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                            : pop.fundingModel === 'UNIVERSITY_FUNDED_POP'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {pop.fundingModel.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      ₹{pop.monthlyHonorariumRateInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400">
                      {pop.tenureYearsTotal} Yr{pop.tenureYearsTotal > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {pop.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {pop.fundingModel !== 'HONORARY_POP' && (
                          <button
                            onClick={() => handleOpenBillModal(pop)}
                            title="Generate Honorarium Claim Bill"
                            className="p-1.5 rounded-md hover:bg-slate-800 text-indigo-400 border border-slate-800 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedRecord(pop)}
                          title="View Full Ledger & Audit Seal"
                          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected PoP Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-indigo-400">{selectedRecord.popRecordId}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedRecord.expertName}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedRecord.designationInIndustry} • <span className="text-slate-200">{selectedRecord.parentOrganization}</span>
                </p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Industry Seniority</span>
                <p className="text-2xl font-bold text-indigo-300 mt-1">{selectedRecord.totalYearsIndustryExperience} Years</p>
                <p className="text-[11px] text-slate-500 mt-1">UGC Min: 15 Years</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Honorarium Rate</span>
                <p className="text-2xl font-bold text-amber-300 mt-1">₹{selectedRecord.monthlyHonorariumRateInr.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-slate-500 mt-1">Per Month Retainer</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Tenure Window</span>
                <p className="text-sm font-bold text-white mt-1">{selectedRecord.tenureYearsTotal} Year ({selectedRecord.appointmentStartDate} to {selectedRecord.appointmentEndDate})</p>
                <p className="text-[11px] text-slate-500 mt-1">UGC Max: 4 Years</p>
              </div>
            </div>

            {/* Co-taught courses */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase mb-2">Co-Taught Courses & Industry Syllabi</h3>
              <div className="flex flex-wrap gap-2">
                {selectedRecord.coTaughtCourseCodes.map((code, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
                    {code}
                  </span>
                ))}
              </div>
            </div>

            {/* Honorarium Billing Cycles */}
            <div className="border border-slate-800 rounded-xl overflow-hidden mb-6">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase">
                  Monthly Honorarium Billing & Section 194J TDS Statements
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">10% Statutory TDS</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Month</th>
                      <th className="py-2.5 px-4 text-center">Days</th>
                      <th className="py-2.5 px-4 text-right">Gross</th>
                      <th className="py-2.5 px-4 text-right">TDS (10%)</th>
                      <th className="py-2.5 px-4 text-right">Net Payable</th>
                      <th className="py-2.5 px-4">Status & Ref</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {selectedRecord.honorariumBills.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-500">
                          No monthly honorarium bills generated yet.
                        </td>
                      </tr>
                    ) : (
                      selectedRecord.honorariumBills.map(bill => (
                        <tr key={bill.billId} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-4 font-semibold text-white">{bill.billingMonth}</td>
                          <td className="py-2.5 px-4 text-center">{bill.daysDelivered}</td>
                          <td className="py-2.5 px-4 text-right">₹{bill.grossAmountInr.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-4 text-right text-rose-300">- ₹{bill.tdsDeductionInr.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-4 text-right font-bold text-emerald-400">₹{bill.netPayableInr.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-4">
                            {bill.status === 'DISBURSED_CLEARED' ? (
                              <div>
                                <span className="text-[10px] font-bold text-emerald-400">CLEARED</span>
                                <div className="text-[10px] font-mono text-slate-500">{bill.payoutReference}</div>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-400">PENDING AUDIT</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            {bill.status === 'GENERATED_PENDING_AUDIT' && (
                              <button
                                onClick={() => handleDisburseBill(selectedRecord, bill.billId)}
                                className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
                              >
                                Disburse
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
              <span className="text-[10px] text-slate-400 uppercase">Cryptographic Audit Seal</span>
              <p className="text-xs font-mono text-emerald-400 break-all mt-1">{selectedRecord.auditSha256}</p>
              <p className="text-[10px] text-slate-500 mt-1">SHA-256 Tamper-Proof Audit Token</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Onboard Professor of Practice */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-lg font-bold text-white">Onboard Professor of Practice (UGC 2022)</h2>
              <button onClick={() => setShowOnboardModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleOnboardPoP} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Expert Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Parent Organization *</label>
                  <input
                    type="text"
                    required
                    value={parentOrg}
                    onChange={e => setParentOrg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Industry Designation *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Industry Experience (Min 15 Yrs) *</label>
                  <input
                    type="number"
                    min="15"
                    required
                    value={experienceYears}
                    onChange={e => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Host Department *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Funding Model *</label>
                  <select
                    value={fundingModel}
                    onChange={e => {
                      const m = e.target.value as PoPFundingModel;
                      setFundingModel(m);
                      if (m === 'UNIVERSITY_FUNDED_POP') {
                        setMonthlyHonorarium(100000);
                      } else if (m === 'HONORARY_POP') {
                        setMonthlyHonorarium(0);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="UNIVERSITY_FUNDED_POP">University Funded (Max ₹1,00,000)</option>
                    <option value="INDUSTRY_SPONSORED_POP">Industry / Corporate Sponsored</option>
                    <option value="HONORARY_POP">Honorary Practice (No Retainer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Monthly Honorarium (INR)</label>
                  <input
                    type="number"
                    min="0"
                    max={fundingModel === 'UNIVERSITY_FUNDED_POP' ? MAX_UNIVERSITY_MONTHLY_HONORARIUM_INR : 1000000}
                    disabled={fundingModel === 'HONORARY_POP'}
                    value={monthlyHonorarium}
                    onChange={e => setMonthlyHonorarium(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Tenure (Years, Max 4)</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={tenureYears}
                    onChange={e => setTenureYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Co-Taught Course Codes (Semicolon separated)</label>
                <input
                  type="text"
                  value={courseCodes}
                  onChange={e => setCourseCodes(e.target.value)}
                  placeholder="e.g. CS-701; CS-802"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold transition"
                >
                  Onboard PoP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generate Monthly Bill */}
      {showBillModal && actionRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Generate Honorarium Bill</h2>
                <p className="text-xs text-slate-400 mt-0.5">{actionRecord.expertName}</p>
              </div>
              <button onClick={() => setShowBillModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleGenerateBill} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Billing Month *</label>
                <input
                  type="month"
                  required
                  value={billingMonth}
                  onChange={e => setBillingMonth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Academic Days Delivered (Standard max 20) *</label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  required
                  value={daysDelivered}
                  onChange={e => setDaysDelivered(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Calculated Breakdown Preview */}
              {(() => {
                const daily = Math.round(actionRecord.monthlyHonorariumRateInr / 20);
                const gross = Math.min(actionRecord.monthlyHonorariumRateInr, daily * daysDelivered);
                const tds = Math.round(gross * 0.1);
                const net = gross - tds;
                return (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Daily Prorated Rate:</span>
                      <span className="text-slate-200">₹{daily.toLocaleString('en-IN')}/day</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Gross Honorarium:</span>
                      <span className="text-amber-300 font-bold">₹{gross.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>10% Statutory TDS (Sec 194J):</span>
                      <span className="text-rose-400">- ₹{tds.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between text-white font-bold text-sm">
                      <span>Net Payable:</span>
                      <span className="text-emerald-400">₹{net.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBillModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold transition"
                >
                  Confirm & Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
