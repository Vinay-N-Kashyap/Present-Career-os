'use client';

import React, { useState, useMemo } from 'react';
import {
  ConsultancyCategory,
  ConsultancyStage,
  FacultyConsultancyProject,
  getAllConsultancyProjects,
  registerConsultancyProject,
  updateConsultancyStage,
  calculateConsultancyFinances,
  validateConsultancyCommitment,
  exportFacultyConsultancyCSV,
} from '@/lib/teacher/facultyConsultancy';

export default function FacultyConsultancyStudio() {
  const [projects, setProjects] = useState<FacultyConsultancyProject[]>(() =>
    getAllConsultancyProjects()
  );
  const [selectedCategory, setSelectedCategory] = useState<ConsultancyCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [stageModalProject, setStageModalProject] = useState<FacultyConsultancyProject | null>(null);
  const [sealModalProject, setSealModalProject] = useState<FacultyConsultancyProject | null>(null);

  // New Project Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ConsultancyCategory>('PRODUCT_DEVELOPMENT');
  const [clientCompany, setClientCompany] = useState('');
  const [clientGstin, setClientGstin] = useState('');
  const [facultyPi, setFacultyPi] = useState('Prof. Anita Deshmukh');
  const [facultyCoPi, setFacultyCoPi] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [netContractValue, setNetContractValue] = useState<number>(1500000);
  const [daysCommitment, setDaysCommitment] = useState<number>(20);
  const [startDate, setStartDate] = useState('2026-11-01');
  const [targetEndDate, setTargetEndDate] = useState('2027-04-30');
  const [deliverablesSummary, setDeliverablesSummary] = useState('');

  // Stage Form State
  const [targetStage, setTargetStage] = useState<ConsultancyStage>('PAYMENT_RECEIVED');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.facultyPiName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  // Aggregate Financial Statistics
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalNetValue = projects.reduce((acc, p) => acc + p.netContractValueInr, 0);
    const totalHonorarium = projects.reduce((acc, p) => acc + p.facultyHonorariumInr, 0);
    const totalOverhead = projects.reduce((acc, p) => acc + p.universityOverheadInr, 0);

    return { totalProjects, totalNetValue, totalHonorarium, totalOverhead };
  }, [projects]);

  // Live financial preview for new project modal
  const liveFinances = useMemo(() => {
    return calculateConsultancyFinances(netContractValue || 0);
  }, [netContractValue]);

  const handleExportCSV = () => {
    const csvContent = exportFacultyConsultancyCSV(filteredProjects);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SRIC_Faculty_Consultancy_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('SRIC Corporate Consultancy Ledger CSV exported successfully.');
  };

  const handleRegisterProject = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !clientCompany.trim() || !facultyPi.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!validateConsultancyCommitment(daysCommitment)) {
      alert('AICTE Statutory Violation: Faculty time commitment cannot exceed 52 days per year.');
      return;
    }

    const created = registerConsultancyProject({
      title: title.trim(),
      category,
      clientCompany: clientCompany.trim(),
      clientGstin: clientGstin.trim() || undefined,
      facultyPiName: facultyPi.trim(),
      facultyPiEmployeeId: `FAC-${Date.now().toString().slice(-3)}`,
      facultyCoPiName: facultyCoPi.trim() || undefined,
      department: department.trim(),
      netContractValueInr: Number(netContractValue),
      estimatedDaysCommitment: Number(daysCommitment),
      stage: 'AGREEMENT_SIGNED',
      startDate,
      targetEndDate,
      deliverablesSummary:
        deliverablesSummary.trim() || 'Industrial technical consultancy and development services.',
      createdDate: new Date().toISOString().split('T')[0],
    });

    setProjects(getAllConsultancyProjects());
    setIsRegisterModalOpen(false);
    // Reset inputs
    setTitle('');
    setClientCompany('');
    setClientGstin('');
    setDeliverablesSummary('');
    showToast(`Project ${created.projectCode} (${created.clientCompany}) successfully registered.`);
  };

  const handleOpenStage = (project: FacultyConsultancyProject) => {
    setStageModalProject(project);
    setTargetStage(project.stage);
  };

  const handleSubmitStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageModalProject) return;

    updateConsultancyStage(stageModalProject.id, targetStage);
    setProjects(getAllConsultancyProjects());
    setStageModalProject(null);
    showToast(`Project ${stageModalProject.projectCode} status updated to ${targetStage}.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-400 flex items-center space-x-2 animate-bounce">
          <svg className="w-5 h-5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950/70 rounded-lg border border-emerald-700/60 text-emerald-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Faculty Sponsored Research & Corporate Consultancy (SRIC / IRD) Studio
              </h1>
              <p className="text-sm text-slate-400">
                Corporate Contract Research, Technical Advisory, 70/30 Honorarium Splits & GST Invoice Management
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export SRIC CSV</span>
          </button>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Register Corporate Consultancy</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Corporate Projects</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.totalProjects}</h3>
            <p className="text-xs text-emerald-400 mt-1">Active Industry Contracts</p>
          </div>
          <div className="w-12 h-12 bg-indigo-950/60 border border-indigo-800/60 rounded-xl flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Contract Outlay</p>
            <h3 className="text-2xl font-bold text-sky-400 mt-1">₹{(stats.totalNetValue / 100000).toFixed(1)} Lakhs</h3>
            <p className="text-xs text-slate-500 mt-1">+18% GST Invoiced</p>
          </div>
          <div className="w-12 h-12 bg-sky-950/60 border border-sky-800/60 rounded-xl flex items-center justify-center text-sky-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faculty Honorarium (70%)</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">₹{(stats.totalHonorarium / 100000).toFixed(1)} Lakhs</h3>
            <p className="text-xs text-slate-400 mt-1">Disbursed to Faculty PIs</p>
          </div>
          <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center justify-center text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">University Overhead (30%)</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">₹{(stats.totalOverhead / 100000).toFixed(1)} Lakhs</h3>
            <p className="text-xs text-slate-500 mt-1">Dept (15%) + Central Pool (15%)</p>
          </div>
          <div className="w-12 h-12 bg-purple-950/60 border border-purple-800/60 rounded-xl flex items-center justify-center text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setSelectedCategory('PRODUCT_DEVELOPMENT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'PRODUCT_DEVELOPMENT'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Product Development
          </button>
          <button
            onClick={() => setSelectedCategory('EXPERT_INVESTIGATION')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'EXPERT_INVESTIGATION'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Expert Failure Investigation
          </button>
          <button
            onClick={() => setSelectedCategory('RETAINER_CONSULTANCY')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'RETAINER_CONSULTANCY'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Retainer Advisory
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search project title, client company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Projects Portfolio Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-slate-700 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                    {p.projectCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                    {p.category.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 border border-indigo-700 text-indigo-300">
                    {p.stage.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">{p.title}</h3>
                <p className="text-xs text-slate-400">
                  Client: <strong className="text-slate-200">{p.clientCompany}</strong> {p.clientGstin && `(${p.clientGstin})`}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  PI: <span className="text-slate-300 font-medium">{p.facultyPiName}</span> ({p.department})
                  {p.facultyCoPiName && ` • Co-PI: ${p.facultyCoPiName}`}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Days Commitment</span>
                <span className="text-xs font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block mt-0.5">
                  {p.estimatedDaysCommitment} / 52 Days
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2">{p.deliverablesSummary}</p>

            {/* Financial Split Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-950/90 p-2.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] block">Net Value</span>
                <span className="font-bold text-slate-200">₹{(p.netContractValueInr / 100000).toFixed(1)} L</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Gross (+18% GST)</span>
                <span className="font-bold text-sky-400">₹{(p.grossInvoiceAmountInr / 100000).toFixed(2)} L</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Faculty (70%)</span>
                <span className="font-bold text-emerald-400">₹{(p.facultyHonorariumInr / 100000).toFixed(2)} L</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Overhead (30%)</span>
                <span className="font-bold text-purple-400">₹{(p.universityOverheadInr / 100000).toFixed(2)} L</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-[11px] text-slate-500">
                Period: {p.startDate} to {p.targetEndDate}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleOpenStage(p)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white rounded border border-slate-700 font-medium transition-colors"
                >
                  Update Stage
                </button>
                {p.cryptographicAgreementDigest && (
                  <button
                    onClick={() => setSealModalProject(p)}
                    className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded font-medium transition-colors"
                  >
                    Contract Seal
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Register New Consultancy Project */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Register Corporate Consultancy Project</h3>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleRegisterProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Failure Analysis of High-Pressure Gas Pipeline Welds"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ConsultancyCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="PRODUCT_DEVELOPMENT">Product Development</option>
                    <option value="EXPERT_INVESTIGATION">Expert Investigation</option>
                    <option value="RETAINER_CONSULTANCY">Retainer Advisory</option>
                    <option value="ROUTINE_TESTING">Routine Testing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Host Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Client Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Larsen & Toubro Heavy Engg"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Client GSTIN</label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAACL1029Q1ZX"
                    value={clientGstin}
                    onChange={(e) => setClientGstin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Faculty Principal Investigator (PI)</label>
                  <input
                    type="text"
                    value={facultyPi}
                    onChange={(e) => setFacultyPi(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Faculty Co-PI (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Harish Chandra"
                    value={facultyCoPi}
                    onChange={(e) => setFacultyCoPi(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Net Contract Value (INR)</label>
                  <input
                    type="number"
                    step="50000"
                    value={netContractValue}
                    onChange={(e) => setNetContractValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-emerald-800 rounded px-2.5 py-1.5 text-emerald-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Annual Commitment (Max 52 Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={daysCommitment}
                    onChange={(e) => setDaysCommitment(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Financial Live Calculator */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">GST (18%):</span>
                  <span className="font-bold text-sky-400">₹{liveFinances.gstAmountInr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Commercial Billing:</span>
                  <span className="font-bold text-white">₹{liveFinances.grossInvoiceAmountInr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Faculty Honorarium (70%):</span>
                  <span className="font-bold text-emerald-400">₹{liveFinances.facultyHonorariumInr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">University Overhead (30%):</span>
                  <span className="font-bold text-purple-400">₹{liveFinances.universityOverheadInr.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Deliverables & Technical Scope</label>
                <textarea
                  rows={2}
                  placeholder="Testing methodologies, simulation models, and final technical report..."
                  value={deliverablesSummary}
                  onChange={(e) => setDeliverablesSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold"
                >
                  Register Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Stage */}
      {stageModalProject && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Update Consultancy Project Stage</h3>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">{stageModalProject.projectCode}</p>
              </div>
              <button
                onClick={() => setStageModalProject(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitStage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Contract Milestone Stage</label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as ConsultancyStage)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="PROPOSAL_SUBMITTED">Proposal Submitted</option>
                  <option value="DEAN_SRIC_APPROVED">Dean SRIC Approved</option>
                  <option value="AGREEMENT_SIGNED">Agreement Signed</option>
                  <option value="INVOICE_DISPATCHED">Invoice Dispatched</option>
                  <option value="PAYMENT_RECEIVED">Payment Received</option>
                  <option value="COMPLETED_CLOSED">Completed & Closed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStageModalProject(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold"
                >
                  Update Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agreement Seal */}
      {sealModalProject && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🤝</span>
                <h3 className="text-base font-bold text-white">SRIC Corporate Contract Cryptographic Seal</h3>
              </div>
              <button
                onClick={() => setSealModalProject(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Project Code</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{sealModalProject.projectCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Client Corporation</span>
                <span className="text-slate-200 font-medium">{sealModalProject.clientCompany}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Faculty PI & Department</span>
                <span className="text-slate-300 font-medium">{sealModalProject.facultyPiName} ({sealModalProject.department})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Net Contract Consideration</span>
                <span className="text-emerald-300 font-semibold">₹{sealModalProject.netContractValueInr.toLocaleString()} (Excl. 18% GST)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">SHA-256 Tamper-Proof Contract Digest</span>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-emerald-300 break-all">
                  {sealModalProject.cryptographicAgreementDigest}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSealModalProject(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
              >
                Close Seal Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
