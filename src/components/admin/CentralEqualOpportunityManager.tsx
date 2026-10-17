'use client';

import React, { useState } from 'react';
import {
  DisabilityCategory,
  AssistiveServiceType,
  FacilityAuditType,
  EocScholarRecord,
  CampusAccessibilityAudit,
  validateUdidFormat,
  calculateExamCompensatoryTime,
  registerEocScholar,
  assignAssistiveService,
  conductAccessibilityAudit,
  exportEocLedgerCSV,
  SAMPLE_EOC_SCHOLARS,
  SAMPLE_A11Y_AUDITS,
} from '@/lib/admin/centralEqualOpportunity';

export default function CentralEqualOpportunityManager() {
  const [scholars, setScholars] = useState<EocScholarRecord[]>(SAMPLE_EOC_SCHOLARS);
  const [audits, setAudits] = useState<CampusAccessibilityAudit[]>(SAMPLE_A11Y_AUDITS);
  const [activeTab, setActiveTab] = useState<'SCHOLARS' | 'AUDITS'>('SCHOLARS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScholar, setSelectedScholar] = useState<EocScholarRecord | null>(null);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [actionScholar, setActionScholar] = useState<EocScholarRecord | null>(null);

  // Register Scholar Form State
  const [rollNo, setRollNo] = useState('2024CSB031');
  const [name, setName] = useState('Rohan Venkatesh');
  const [dept, setDept] = useState('Computer Science & Engineering');
  const [category, setCategory] = useState<DisabilityCategory>('LOCOMOTOR_DISABILITY');
  const [udid, setUdid] = useState('KA0110320020089123');
  const [disabilityPercent, setDisabilityPercent] = useState<number>(55);
  const [formError, setFormError] = useState('');

  // Assign Service Form State
  const [serviceType, setServiceType] = useState<AssistiveServiceType>('EXAM_SCRIBE_COMPENSATORY_TIME');
  const [resourceDetails, setResourceDetails] = useState('Certified Scribe allocated + 60m extra time per 3-hour exam');
  const [serviceCost, setServiceCost] = useState<number>(12000);

  // Audit Form State
  const [auditBuilding, setAuditBuilding] = useState('Tagore Central Library');
  const [auditFacility, setAuditFacility] = useState<FacilityAuditType>('BUILDING_RAMP_ENTRANCE');
  const [auditScore, setAuditScore] = useState<number>(88);
  const [auditDeficiencies, setAuditDeficiencies] = useState('Dual handrails installed; tactile pavers pending at landing');
  const [auditCost, setAuditCost] = useState<number>(35000);

  // Scribe Simulator State
  const [simExamMinutes, setSimExamMinutes] = useState<number>(180);

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // KPIs
  const totalScholars = scholars.length;
  const benchmarkPwDCount = scholars.filter(s => s.isBenchmarkDisability).length;
  const benchmarkRate = totalScholars > 0 ? Math.round((benchmarkPwDCount / totalScholars) * 100) : 0;
  const totalServicesDisbursedInr = scholars.reduce((acc, s) => {
    return acc + s.allocatedServices.reduce((cAcc, c) => cAcc + c.disbursedCostInr, 0);
  }, 0);
  const avgAuditScore = audits.length > 0 ? Math.round(audits.reduce((acc, a) => acc + a.auditScorePercent, 0) / audits.length) : 0;
  const compliantAudits = audits.filter(a => a.isCompliant).length;

  // Filtered Scholars
  const filteredScholars = scholars.filter(s => {
    const matchesCat = selectedCategory === 'ALL' || s.disabilityCategory === selectedCategory;
    const matchesSearch =
      s.scholarName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentRollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.udidNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Handlers
  const handleRegisterScholar = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!validateUdidFormat(udid)) {
      setFormError('Invalid UDID Card format. Must be 18 alphanumeric characters (e.g. KA0110320020089123).');
      return;
    }

    try {
      const created = registerEocScholar({
        studentRollNumber: rollNo,
        scholarName: name,
        department: dept,
        disabilityCategory: category,
        udidNumber: udid,
        disabilityPercentage: disabilityPercent,
      });

      setScholars([created, ...scholars]);
      setShowRegisterModal(false);
      notify(`Scholar ${created.scholarName} registered with EOC. Benchmark status: ${created.isBenchmarkDisability ? 'YES' : 'NO'}.`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to register scholar');
    }
  };

  const handleOpenAssignModal = (scholar: EocScholarRecord) => {
    setActionScholar(scholar);
    setShowAssignModal(true);
  };

  const handleAssignService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionScholar) return;

    const { record: updated } = assignAssistiveService(actionScholar, {
      serviceType,
      assignedResourceDetails: resourceDetails,
      disbursedCostInr: serviceCost,
    });

    setScholars(scholars.map(s => (s.scholarRecordId === updated.scholarRecordId ? updated : s)));
    if (selectedScholar?.scholarRecordId === updated.scholarRecordId) {
      setSelectedScholar(updated);
    }
    setShowAssignModal(false);
    notify(`Sanctioned assistive service (${serviceType}) for ${updated.scholarName}.`);
  };

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = conductAccessibilityAudit({
      buildingName: auditBuilding,
      facilityType: auditFacility,
      auditScorePercent: auditScore,
      deficienciesIdentified: [auditDeficiencies],
      rectificationCostEstInr: auditCost,
    });

    setAudits([created, ...audits]);
    setShowAuditModal(false);
    notify(`Accessibility audit logged for ${created.buildingName} (Score: ${created.auditScorePercent}%).`);
  };

  const handleExportCSV = () => {
    const csv = exportEocLedgerCSV(scholars);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `eoc_pwd_scholar_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Official Equal Opportunity Cell Ledger CSV exported.');
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
            <span className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Equal Opportunity Cell (EOC) & Universal Accessibility Console
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                RPwD Act 2016 4% Statutory Quota • CPWD Barrier-Free Built Environment • Assistive Devices & Scribe Allocation • UDID Verification
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
            Export EOC CSV
          </button>
          <button
            onClick={() => setShowAuditModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-teal-300 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Audit Facility
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Register PwD Scholar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Registered Scholars</p>
          <p className="text-2xl font-bold text-white mt-1">{totalScholars}</p>
          <span className="text-[11px] text-teal-400 mt-1 block">UDID Verified Roster</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Benchmark PwD (≥40%)</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{benchmarkRate}%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">{benchmarkPwDCount} Affirmative Action</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Assistive Outlay</p>
          <p className="text-2xl font-bold text-cyan-300 mt-1">₹{totalServicesDisbursedInr.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Hardware & Scribe Grants</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Campus A11y Index</p>
          <p className="text-2xl font-bold text-amber-300 mt-1">{avgAuditScore}%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">CPWD 2021 Benchmark</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Compliant Buildings</p>
          <p className="text-2xl font-bold text-indigo-300 mt-1">{compliantAudits} / {audits.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Barrier-Free Infrastructure</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-purple-400 uppercase tracking-wider">RPwD Statutory Quota</p>
          <p className="text-2xl font-bold text-purple-300 mt-1">4.0%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Sec 32 Higher Education</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-4 border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('SCHOLARS')}
          className={`pb-3 text-xs font-bold tracking-wide uppercase transition relative ${
            activeTab === 'SCHOLARS' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          PwD Scholars & Accommodations Roster ({scholars.length})
          {activeTab === 'SCHOLARS' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('AUDITS')}
          className={`pb-3 text-xs font-bold tracking-wide uppercase transition relative ${
            activeTab === 'AUDITS' ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CPWD Universal Campus Accessibility Audits ({audits.length})
          {activeTab === 'AUDITS' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full" />}
        </button>
      </div>

      {activeTab === 'SCHOLARS' ? (
        <>
          {/* Category Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center overflow-x-auto gap-2 border border-slate-800 rounded-lg p-1 bg-slate-900/40">
              {[
                { id: 'ALL', label: 'All Disabilities' },
                { id: 'LOCOMOTOR_DISABILITY', label: 'Locomotor' },
                { id: 'VISUAL_IMPAIRMENT_BLINDNESS', label: 'Visual (Blindness)' },
                { id: 'LOW_VISION', label: 'Low Vision' },
                { id: 'HEARING_SPEECH_IMPAIRMENT', label: 'Hearing/Speech' },
                { id: 'AUTISM_SPEC_NEURODIVERGENT', label: 'Neurodivergent' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                    selectedCategory === tab.id
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
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
                placeholder="Search scholar, roll no, UDID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <svg className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Scholars Table */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Scholar & Roll Number</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Disability Category</th>
                    <th className="py-3 px-4">UDID Number</th>
                    <th className="py-3 px-4 text-center">Disability %</th>
                    <th className="py-3 px-4 text-center">Benchmark (≥40%)</th>
                    <th className="py-3 px-4">Active Services</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredScholars.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        No PwD scholars match the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredScholars.map(scholar => (
                      <tr key={scholar.scholarRecordId} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{scholar.scholarName}</div>
                          <div className="text-[11px] font-mono text-teal-400">{scholar.studentRollNumber}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-200">{scholar.department}</div>
                          <div className="text-[10px] text-slate-500">{scholar.academicYear}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-200 border border-slate-700">
                            {scholar.disabilityCategory.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-amber-300">
                          {scholar.udidNumber}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-white">
                          {scholar.disabilityPercentage}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          {scholar.isBenchmarkDisability ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              BENCHMARK
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                              NON-BENCHMARK
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] font-medium text-cyan-300">
                            {scholar.allocatedServices.length} Allocated
                          </span>
                          {scholar.allocatedServices.length > 0 && (
                            <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                              {scholar.allocatedServices[0].serviceType.replace(/_/g, ' ')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                            {scholar.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenAssignModal(scholar)}
                              title="Assign Assistive Device / Service"
                              className="p-1.5 rounded-md hover:bg-slate-800 text-teal-400 border border-slate-800 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setSelectedScholar(scholar)}
                              title="View Scholar Profile & Audit Seal"
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
        </>
      ) : (
        /* Infrastructure Audits Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audits.map(audit => (
              <div key={audit.auditId} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-teal-400">{audit.auditId}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{audit.buildingName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Facility: {audit.facilityType.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold ${
                        audit.isCompliant ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {audit.auditScorePercent}%
                    </span>
                    <div className="text-[10px] text-slate-500">
                      {audit.isCompliant ? 'CPWD COMPLIANT' : 'RECTIFICATION REQD'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-medium text-slate-300">Identified Deficiencies & Rectification:</span>
                  <ul className="mt-1 space-y-1">
                    {audit.deficienciesIdentified.map((d, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Est. Rectification Cost: <span className="text-white font-medium">₹{audit.rectificationCostEstInr.toLocaleString('en-IN')}</span></span>
                  <span className="text-[11px] text-slate-500">Deadline: {audit.rectificationDeadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scribe & Compensatory Extra Time Simulator Banner */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-950 border border-teal-500/20 rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              UGC Standard Operating Procedure — Scribe & Compensatory Extra Time Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              RPwD Act 2016 statutory extra time calculator: 20 minutes compensatory extra time per 60 minutes for benchmark disability.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Exam Length:</label>
              <select
                value={simExamMinutes}
                onChange={e => setSimExamMinutes(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
              >
                <option value={60}>1 Hour (60m)</option>
                <option value={120}>2 Hours (120m)</option>
                <option value={180}>3 Hours (180m)</option>
              </select>
            </div>
            <div className="bg-slate-900 border border-teal-500/40 px-3 py-1.5 rounded-lg text-center">
              <span className="text-[10px] text-teal-400 uppercase font-semibold">Statutory Extra Time</span>
              <p className="text-sm font-bold text-white">+{calculateExamCompensatoryTime(simExamMinutes, 50)} Mins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal for Selected Scholar */}
      {selectedScholar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-teal-400">{selectedScholar.scholarRecordId}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedScholar.scholarName}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Roll: <span className="text-slate-200">{selectedScholar.studentRollNumber}</span> • Dept:{' '}
                  <span className="text-slate-200">{selectedScholar.department}</span> • UDID:{' '}
                  <span className="text-amber-300 font-mono">{selectedScholar.udidNumber}</span>
                </p>
              </div>
              <button onClick={() => setSelectedScholar(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Disability Assessment</span>
                <p className="text-2xl font-bold text-teal-300 mt-1">{selectedScholar.disabilityPercentage}%</p>
                <p className="text-[11px] text-slate-500 mt-1">{selectedScholar.disabilityCategory.replace(/_/g, ' ')}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">RPwD Benchmark Quota</span>
                <p className={`text-2xl font-bold mt-1 ${selectedScholar.isBenchmarkDisability ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {selectedScholar.isBenchmarkDisability ? 'ELIGIBLE (≥40%)' : 'NOT ELIGIBLE'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Section 32 RPwD Act 2016</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase mb-2">Sanctioned Assistive Services & Devices</h3>
              {selectedScholar.allocatedServices.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No assistive devices or services allocated yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedScholar.allocatedServices.map(srv => (
                    <div key={srv.serviceId} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-semibold text-white">{srv.serviceType.replace(/_/g, ' ')}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{srv.assignedResourceDetails}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-teal-300">₹{srv.disbursedCostInr.toLocaleString('en-IN')}</span>
                        <div className="text-[10px] text-slate-500">Valid until {srv.validUntil}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
              <span className="text-[10px] text-slate-400 uppercase">Cryptographic Audit Seal</span>
              <p className="text-xs font-mono text-emerald-400 break-all mt-1">{selectedScholar.auditSha256}</p>
              <p className="text-[10px] text-slate-500 mt-1">SHA-256 Tamper-Proof Audit Token</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedScholar(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register PwD Scholar */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-lg font-bold text-white">Register PwD Scholar with EOC</h2>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleRegisterScholar} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Student Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={e => setRollNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Scholar Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Academic Department *</label>
                <input
                  type="text"
                  required
                  value={dept}
                  onChange={e => setDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Disability Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as DisabilityCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="LOCOMOTOR_DISABILITY">Locomotor Disability</option>
                    <option value="VISUAL_IMPAIRMENT_BLINDNESS">Visual (Blindness)</option>
                    <option value="LOW_VISION">Low Vision</option>
                    <option value="HEARING_SPEECH_IMPAIRMENT">Hearing & Speech</option>
                    <option value="AUTISM_SPEC_NEURODIVERGENT">Autism / Neurodivergent</option>
                    <option value="MULTIPLE_DISABILITIES_OTHER">Multiple Disabilities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Disability Percentage (1-100%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={disabilityPercent}
                    onChange={e => setDisabilityPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Unique Disability ID (UDID) *</label>
                <input
                  type="text"
                  required
                  value={udid}
                  onChange={e => setUdid(e.target.value.toUpperCase())}
                  placeholder="KA0110320020089123"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">18-character Indian statutory UDID card number issued by MSJE.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition"
                >
                  Register Scholar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Assistive Service */}
      {showAssignModal && actionScholar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Assign Assistive Service / Device</h2>
                <p className="text-xs text-slate-400 mt-0.5">{actionScholar.scholarName} ({actionScholar.studentRollNumber})</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAssignService} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Service Type *</label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as AssistiveServiceType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="EXAM_SCRIBE_COMPENSATORY_TIME">Exam Scribe & Compensatory Time</option>
                  <option value="ASSISTIVE_TECHNOLOGY_HARDWARE">Assistive Technology Hardware (JAWS / Braille)</option>
                  <option value="MOBILITY_TRANSPORT_SHUTTLE">Campus Mobility Shuttle Allotment</option>
                  <option value="SIGN_LANGUAGE_INTERPRETER">Sign Language Interpreter Support</option>
                  <option value="REMEDIAL_COACHING_GRANT">Remedial Coaching & Book Grant</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Resource & Allocation Details *</label>
                <textarea
                  required
                  rows={3}
                  value={resourceDetails}
                  onChange={e => setResourceDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Sanctioned Grant / Cost (INR) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={serviceCost}
                  onChange={e => setServiceCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition"
                >
                  Sanction Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Audit Campus Facility */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-lg font-bold text-white">Log Campus Accessibility Infrastructure Audit</h2>
              <button onClick={() => setShowAuditModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAudit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Building Name *</label>
                <input
                  type="text"
                  required
                  value={auditBuilding}
                  onChange={e => setAuditBuilding(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Facility Type *</label>
                  <select
                    value={auditFacility}
                    onChange={e => setAuditFacility(e.target.value as FacilityAuditType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="BUILDING_RAMP_ENTRANCE">Building Ramp & Entrance</option>
                    <option value="BRAILLE_ELEVATOR_LIFT">Braille & Audio Elevator</option>
                    <option value="TACTILE_FLOORING_PATHWAY">Tactile Flooring Pathway</option>
                    <option value="ACCESSIBLE_WASHROOM">Accessible PwD Washroom</option>
                    <option value="DIGITAL_PORTAL_WCAG_A11Y">Digital Portal (WCAG 2.1)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Compliance Score (0-100%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={auditScore}
                    onChange={e => setAuditScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Deficiencies / Rectification Note *</label>
                <textarea
                  required
                  rows={3}
                  value={auditDeficiencies}
                  onChange={e => setAuditDeficiencies(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Estimated Rectification Cost (INR) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={auditCost}
                  onChange={e => setAuditCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAuditModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition"
                >
                  Save Audit Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
