'use client';

import React, { useState } from 'react';
import {
  ConsultancyProject,
  ConsultancyType,
  ConsultancyMilestone,
  SAMPLE_CONSULTANCY_PROJECTS,
  createConsultancyProject,
  raiseMilestoneInvoice,
  recordClientPaymentAndDisburse,
  exportFacultyConsultancyLedgerCSV,
  STANDARD_CONSULTANCY_GST_PERCENT,
  STANDARD_CONSULTANCY_SAC_CODE
} from '@/lib/teacher/facultyConsultancyBilling';

export default function FacultyConsultancyBillingStudio() {
  const [projects, setProjects] = useState<ConsultancyProject[]>(SAMPLE_CONSULTANCY_PROJECTS);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<ConsultancyProject | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<ConsultancyMilestone | null>(null);

  // Modals state
  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showSealModal, setShowSealModal] = useState<boolean>(false);
  const [alertBanner, setAlertBanner] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  // New Project Form state
  const [newTitle, setNewTitle] = useState('');
  const [newLeadId, setNewLeadId] = useState('FAC-CS-2018-081');
  const [newLeadName, setNewLeadName] = useState('Dr. Nandini Ramanathan');
  const [newDept, setNewDept] = useState('Computer Science & AI');
  const [newSalary, setNewSalary] = useState(2400000);
  const [newClient, setNewClient] = useState('');
  const [newGstin, setNewGstin] = useState('');
  const [newPan, setNewPan] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newType, setNewType] = useState<ConsultancyType>('CORPORATE_R_AND_D');
  const [newMouDate, setNewMouDate] = useState('2026-03-01');
  const [newDischargeDate, setNewDischargeDate] = useState('2026-11-30');
  const [m1Title, setM1Title] = useState('Phase 1: Architecture Blueprint & Proof of Concept');
  const [m1Desc, setM1Desc] = useState('Deliverable D1: Complete algorithmic specification and benchmark results');
  const [m1Amount, setM1Amount] = useState(500000);
  const [m1Target, setM1Target] = useState('2026-06-30');

  // Payment Form state
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  // Invoice Form state
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  // Filtering
  const filteredProjects = projects.filter(p => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CORPORATE_R_AND_D') return p.consultancyType === 'CORPORATE_R_AND_D';
    if (activeTab === 'RETAINER_ADVISORY') return p.consultancyType === 'RETAINER_ADVISORY';
    if (activeTab === 'TESTING') return p.consultancyType === 'INSTITUTIONAL_FACILITY_TESTING';
    if (activeTab === 'POLICY') return p.consultancyType === 'GOVERNMENT_POLICY_CONSULTING';
    return true;
  });

  // Telemetry KPIs
  const totalContracts = projects.length;
  const totalPortfolioValue = projects.reduce((sum, p) => sum + p.totalContractValueInr, 0);
  const totalFacultyHonorarium = projects.reduce((sum, p) => sum + p.disbursementSummary.facultyHonorariumInr, 0);
  const totalUniversityOverhead = projects.reduce((sum, p) => sum + p.disbursementSummary.universityCentralOverheadInr + p.disbursementSummary.departmentDevelopmentFundInr, 0);

  // Handlers
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const p = createConsultancyProject({
        projectTitle: newTitle,
        leadFacultyId: newLeadId,
        leadFacultyName: newLeadName,
        department: newDept,
        facultyAnnualGrossSalaryInr: Number(newSalary),
        clientOrganization: newClient,
        clientGstin: newGstin,
        clientPan: newPan,
        clientAddress: newAddress,
        consultancyType: newType,
        mouExecutionDate: newMouDate,
        expectedDischargeDate: newDischargeDate,
        milestonesData: [
          {
            title: m1Title,
            deliverableDescription: m1Desc,
            targetCompletionDate: m1Target,
            baseAmountInr: Number(m1Amount)
          }
        ]
      });

      setProjects([p, ...projects]);
      setShowAddProjectModal(false);
      setAlertBanner({ type: 'success', message: `Consultancy MoU registered with ID ${p.projectId} for ${p.clientOrganization}` });
    } catch (err: unknown) {
      setAlertBanner({ type: 'error', message: err instanceof Error ? err.message : 'Failed to register consultancy' });
    }
  };

  const handleRaiseInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedMilestone) return;

    const res = raiseMilestoneInvoice(selectedProject, selectedMilestone.milestoneNumber, invoiceDate);
    if (!res.success) {
      setAlertBanner({ type: 'error', message: res.error || 'Failed to raise invoice' });
      return;
    }

    setProjects(projects.map(p => p.projectId === res.project.projectId ? res.project : p));
    setSelectedProject(res.project);
    setShowInvoiceModal(false);
    setAlertBanner({
      type: 'success',
      message: `Statutory GST Tax Invoice ${res.invoiceNumber} (SAC ${STANDARD_CONSULTANCY_SAC_CODE}) raised successfully!`
    });
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedMilestone) return;

    const res = recordClientPaymentAndDisburse(selectedProject, {
      milestoneNumber: selectedMilestone.milestoneNumber,
      paymentReceiptRef: paymentRef,
      paymentClearedDate: paymentDate
    });

    if (!res.success) {
      setAlertBanner({ type: 'error', message: res.error || 'Payment recording failed' });
      return;
    }

    setProjects(projects.map(p => p.projectId === res.project.projectId ? res.project : p));
    setSelectedProject(res.project);
    setShowPaymentModal(false);

    if (res.isCeilingWarning) {
      setAlertBanner({
        type: 'warning',
        message: `Payment cleared & disbursed! CAUTION: Faculty cumulative honorarium (₹${res.project.disbursementSummary.facultyHonorariumInr.toLocaleString()}) exceeds annual gross salary ceiling! BoG sanction required.`
      });
    } else {
      setAlertBanner({
        type: 'success',
        message: `Payment cleared! Disbursed ₹${res.disbursement.facultyPayout.toLocaleString()} to Faculty and ₹${res.disbursement.universityOverhead.toLocaleString()} to University Overhead.`
      });
    }
  };

  const handleExportCSV = () => {
    const csvData = exportFacultyConsultancyLedgerCSV(projects);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Faculty_Consultancy_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlertBanner({ type: 'success', message: 'Consultancy ledger CSV exported successfully' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 font-mono text-sm">
              GST SAC {STANDARD_CONSULTANCY_SAC_CODE} (18%)
            </span>
            <span className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono text-sm">
              UGC / MoE Faculty Consultancy Norms
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-2">
            Faculty Corporate Consultancy & Client Billing Studio
          </h1>
          <p className="text-sm text-slate-400">
            Corporate R&D contract governance, milestone tax invoicing, 70/30 & 50/50 revenue sharing & salary ceiling safeguards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-indigo-950"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Register Consultancy MoU
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Consultancy CSV
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertBanner && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          alertBanner.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
            : alertBanner.type === 'warning'
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="font-bold">{alertBanner.type === 'success' ? '✓' : alertBanner.type === 'warning' ? '⚠️' : '✕'}</span>
            <p className="text-sm">{alertBanner.message}</p>
          </div>
          <button onClick={() => setAlertBanner(null)} className="text-slate-400 hover:text-slate-200 text-sm">✕</button>
        </div>
      )}

      {/* Telemetry Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Client Contracts</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{totalContracts}</p>
          <p className="text-xs text-slate-500 mt-1">Corporate & PSU MoUs</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Total Contract Portfolio</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">₹{(totalPortfolioValue / 100000).toFixed(2)} L</p>
          <p className="text-xs text-slate-500 mt-1">Base Contract Value</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Disbursed Faculty Honorarium</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">₹{(totalFacultyHonorarium / 100000).toFixed(2)} L</p>
          <p className="text-xs text-slate-500 mt-1">70% / 50% Statutory Split</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">University & DDF Overhead</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">₹{(totalUniversityOverhead / 100000).toFixed(2)} L</p>
          <p className="text-xs text-slate-500 mt-1">Institutional Corpus & Dept Fund</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        {[
          { id: 'ALL', label: 'All Projects' },
          { id: 'CORPORATE_R_AND_D', label: 'Corporate R&D (Type I)' },
          { id: 'RETAINER_ADVISORY', label: 'Advisory Retainers' },
          { id: 'TESTING', label: 'Lab Facility Testing (Type II)' },
          { id: 'POLICY', label: 'Govt Policy Advisory' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="space-y-5">
        {filteredProjects.map(project => {
          const isSalaryCeilingBreached = project.disbursementSummary.facultyHonorariumInr > project.facultyAnnualGrossSalaryInr;

          return (
            <div
              key={project.projectId}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition"
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {project.projectId}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      project.consultancyType === 'INSTITUTIONAL_FACILITY_TESTING'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                        : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
                    }`}>
                      {project.consultancyType === 'INSTITUTIONAL_FACILITY_TESTING' 
                        ? 'Type II (50/30/20 Testing)' 
                        : 'Type I (70/20/10 Advisory)'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      SAC {project.sacCode}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">{project.projectTitle}</h3>
                  <p className="text-xs text-slate-400">
                    Lead: <span className="text-slate-200 font-semibold">{project.leadFacultyName}</span> | Dept: {project.department}
                  </p>
                  <p className="text-xs text-slate-400">
                    Client: <span className="text-slate-200 font-medium">{project.clientOrganization}</span> (GSTIN: {project.clientGstin})
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    project.status === 'PROJECT_COMPLETED_DISCHARGED'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : project.status === 'PAYMENT_RECEIVED_CLEARED'
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  }`}>
                    {project.status.replace(/_/g, ' ')}
                  </span>
                  <p className="text-xs font-mono text-slate-400">
                    Total Contract: <span className="font-bold text-slate-100">₹{(project.totalContractValueInr / 100000).toFixed(2)} L</span>
                  </p>
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setShowSealModal(true);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono mt-1"
                  >
                    <span>Audit Seal</span>
                    <span>🔍</span>
                  </button>
                </div>
              </div>

              {/* Revenue Sharing & Salary Safeguard Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Base Billed & Cleared</span>
                  <span className="text-slate-200 font-bold text-sm">
                    ₹{project.disbursementSummary.totalPaidBaseAmountInr.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    of ₹{project.totalContractValueInr.toLocaleString()} base
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Faculty Honorarium (Disbursed)</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    ₹{project.disbursementSummary.facultyHonorariumInr.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Share: {project.disbursementSummary.facultySharePercent}%
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">University Overhead & DDF</span>
                  <span className="text-cyan-400 font-bold text-sm">
                    ₹{(project.disbursementSummary.universityCentralOverheadInr + project.disbursementSummary.departmentDevelopmentFundInr).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Univ {project.disbursementSummary.universitySharePercent}% + DDF {project.disbursementSummary.ddfSharePercent}%
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">UGC Salary Ceiling Safeguard</span>
                  {isSalaryCeilingBreached ? (
                    <span className="text-rose-400 font-bold block">⚠️ Ceiling Exceeded (&gt;100% Salary)</span>
                  ) : (
                    <span className="text-emerald-400 font-bold block">✓ Within Salary Limits</span>
                  )}
                  <span className="text-[11px] text-slate-500 block">
                    Annual Gross: ₹{project.facultyAnnualGrossSalaryInr.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Milestones Accordion */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contract Deliverable Milestones & Tax Invoicing
                </p>

                <div className="space-y-2">
                  {project.milestones.map(m => (
                    <div
                      key={m.milestoneId}
                      className="bg-slate-950/40 border border-slate-800/90 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">Milestone {m.milestoneNumber}:</span>
                          <span className="font-medium text-slate-300">{m.title}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                            m.status === 'PAYMENT_RECEIVED_RECONCILED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : m.status === 'TAX_INVOICE_ISSUED'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {m.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-slate-500">{m.deliverableDescription}</p>
                        <p className="text-slate-500">
                          Due: {m.targetCompletionDate} {m.invoiceNumber && `| Invoice: ${m.invoiceNumber}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-slate-200">
                            ₹{m.baseAmountInr.toLocaleString()} + GST {STANDARD_CONSULTANCY_GST_PERCENT}%
                          </p>
                          <p className="font-bold text-indigo-400">
                            Total: ₹{m.totalInvoiceAmountInr.toLocaleString()}
                          </p>
                        </div>

                        {/* Actions */}
                        {m.status === 'SCHEDULED_PENDING' && (
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setSelectedMilestone(m);
                              setShowInvoiceModal(true);
                            }}
                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded font-medium transition"
                          >
                            Raise Tax Invoice
                          </button>
                        )}

                        {m.status === 'TAX_INVOICE_ISSUED' && (
                          <button
                            onClick={() => {
                              setSelectedProject(project);
                              setSelectedMilestone(m);
                              setPaymentRef(`UTR-${Date.now().toString().slice(-8)}`);
                              setShowPaymentModal(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded font-medium transition"
                          >
                            Record Payment
                          </button>
                        )}

                        {m.status === 'PAYMENT_RECEIVED_RECONCILED' && (
                          <span className="text-emerald-400 font-mono font-medium">✓ Settled</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register New Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Register New Consultancy Project / MoU</h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 text-sm">
              <div>
                <label className="text-slate-400 text-xs">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Design & Optimization of Edge AI Inference Engine..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Lead Faculty Name</label>
                  <input
                    type="text"
                    required
                    value={newLeadName}
                    onChange={e => setNewLeadName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Department</label>
                  <input
                    type="text"
                    required
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Faculty Annual Gross Salary (INR)</label>
                  <input
                    type="number"
                    required
                    value={newSalary}
                    onChange={e => setNewSalary(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Consultancy Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as ConsultancyType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  >
                    <option value="CORPORATE_R_AND_D">Corporate R&D (70/20/10)</option>
                    <option value="RETAINER_ADVISORY">Retainer Advisory (70/20/10)</option>
                    <option value="INSTITUTIONAL_FACILITY_TESTING">Lab Testing (50/30/20)</option>
                    <option value="GOVERNMENT_POLICY_CONSULTING">Govt Policy (70/20/10)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-slate-400 text-xs">Client Organization</label>
                  <input
                    type="text"
                    required
                    value={newClient}
                    onChange={e => setNewClient(e.target.value)}
                    placeholder="Bosch Automotive India Ltd"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Client GSTIN</label>
                  <input
                    type="text"
                    required
                    value={newGstin}
                    onChange={e => setNewGstin(e.target.value)}
                    placeholder="29AAACB1001P1Z5"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs">Client PAN</label>
                  <input
                    type="text"
                    required
                    value={newPan}
                    onChange={e => setNewPan(e.target.value)}
                    placeholder="AAACB1001P"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs">Client Registered Address</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    placeholder="Hosur Road, Adugodi, Bangalore"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                <p className="text-xs font-semibold text-slate-300">Initial Deliverable Milestone</p>
                <div>
                  <label className="text-slate-400 text-xs">Milestone Title</label>
                  <input
                    type="text"
                    required
                    value={m1Title}
                    onChange={e => setM1Title(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 mt-0.5 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 text-xs">Base Amount (INR)</label>
                    <input
                      type="number"
                      required
                      value={m1Amount}
                      onChange={e => setM1Amount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 mt-0.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs">Target Date</label>
                    <input
                      type="date"
                      required
                      value={m1Target}
                      onChange={e => setM1Target(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 mt-0.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Register Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Raise Tax Invoice Modal */}
      {showInvoiceModal && selectedProject && selectedMilestone && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Raise GST 18% Tax Invoice</h3>
                <p className="text-xs text-slate-400">{selectedProject.clientOrganization}</p>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleRaiseInvoice} className="space-y-3 text-sm">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Milestone:</span>
                  <span className="text-slate-200 font-semibold">{selectedMilestone.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Consulting Fee:</span>
                  <span className="text-slate-200 font-semibold">₹{selectedMilestone.baseAmountInr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GST SAC 9983 @ 18%:</span>
                  <span className="text-amber-400 font-semibold">₹{selectedMilestone.gstAmountInr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                  <span className="text-slate-200">Total Invoice Amount:</span>
                  <span className="text-indigo-400">₹{selectedMilestone.totalInvoiceAmountInr.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Invoice Date</label>
                <input
                  type="date"
                  required
                  value={invoiceDate}
                  onChange={e => setInvoiceDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Generate Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedProject && selectedMilestone && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Record Client Payment Receipt</h3>
                <p className="text-xs text-slate-400">Invoice: {selectedMilestone.invoiceNumber}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-sm">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Billed with GST:</span>
                  <span className="text-indigo-400 font-bold">₹{selectedMilestone.totalInvoiceAmountInr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Faculty Honorarium Split:</span>
                  <span className="text-emerald-400 font-semibold">
                    ₹{(selectedMilestone.baseAmountInr * (selectedProject.disbursementSummary.facultySharePercent / 100)).toLocaleString()} ({selectedProject.disbursementSummary.facultySharePercent}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">University Overhead & DDF:</span>
                  <span className="text-cyan-400 font-semibold">
                    ₹{(selectedMilestone.baseAmountInr * ((100 - selectedProject.disbursementSummary.facultySharePercent) / 100)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs">Bank Transfer Reference (UTR / Txn Ref)</label>
                <input
                  type="text"
                  required
                  value={paymentRef}
                  onChange={e => setPaymentRef(e.target.value)}
                  placeholder="UTR-HDFC000124981"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1 uppercase"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs">Payment Cleared Date</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 mt-1"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  Reconcile & Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seal Inspector Modal */}
      {showSealModal && selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Cryptographic Seal Inspector</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedProject.projectId}</p>
              </div>
              <button onClick={() => setShowSealModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block">SHA-256 Contract & Billing Seal</span>
                <span className="font-mono text-emerald-400 break-all">{selectedProject.auditSha256}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lead Faculty ID:</span>
                  <span className="text-slate-200 font-mono">{selectedProject.leadFacultyId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client GSTIN:</span>
                  <span className="text-slate-200 font-mono">{selectedProject.clientGstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Milestones:</span>
                  <span className="text-slate-200 font-semibold">{selectedProject.milestones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MoU Execution Date:</span>
                  <span className="text-slate-200">{selectedProject.mouExecutionDate}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSealModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
