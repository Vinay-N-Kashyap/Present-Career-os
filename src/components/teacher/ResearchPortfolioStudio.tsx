'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Publication,
  Patent,
  ResearchGrant,
  PublicationType,
  IndexingTier,
  PatentStatus,
  FundingAgency,
  addPublication,
  addPatent,
  updatePatentStatus,
  getPublicationsByInstitution,
  getPatentsByInstitution,
  getGrantsByInstitution,
  computeFacultyMetrics,
  exportResearchPublicationsCSV,
  seedResearchData
} from '@/lib/teacher/researchPublications';

interface ResearchPortfolioStudioProps {
  institutionId?: string;
  facultyId?: string;
  facultyName?: string;
  department?: string;
}

export const ResearchPortfolioStudio: React.FC<ResearchPortfolioStudioProps> = ({
  institutionId = 'inst-apex-001',
  facultyId = 'FAC-CSE-001',
  facultyName = 'Dr. Aris Thorne',
  department = 'Computer Science & Engineering',
}) => {
  const [activeTab, setActiveTab] = useState<'publications' | 'patents' | 'grants'>('publications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');

  // Modals state
  const [showAddPubModal, setShowAddPubModal] = useState(false);
  const [showAddPatentModal, setShowAddPatentModal] = useState(false);

  // Form states for new publication
  const [newPubTitle, setNewPubTitle] = useState('');
  const [newPubVenue, setNewPubVenue] = useState('');
  const [newPubType, setNewPubType] = useState<PublicationType>('JOURNAL');
  const [newPubYear, setNewPubYear] = useState<number>(2026);
  const [newPubDoi, setNewPubDoi] = useState('');
  const [newPubCitations, setNewPubCitations] = useState<number>(0);
  const [newPubIndexing, setNewPubIndexing] = useState<IndexingTier[]>(['SCOPUS']);
  const [newPubIsFirst, setNewPubIsFirst] = useState(true);

  // Form states for new patent
  const [newPatentTitle, setNewPatentTitle] = useState('');
  const [newPatentAppNo, setNewPatentAppNo] = useState('');
  const [newPatentOffice, setNewPatentOffice] = useState<'INDIAN_PATENT_OFFICE' | 'USPTO' | 'EPO' | 'WIPO'>('INDIAN_PATENT_OFFICE');
  const [newPatentStatus, setNewPatentStatus] = useState<PatentStatus>('FILED');

  // Load / Seed data on mount
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const existing = getPublicationsByInstitution(institutionId);
    if (existing.length === 0) {
      seedResearchData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const publications = useMemo(() => {
    return getPublicationsByInstitution(institutionId);
  }, [institutionId, refreshKey]);

  const patents = useMemo(() => {
    return getPatentsByInstitution(institutionId);
  }, [institutionId, refreshKey]);

  const grants = useMemo(() => {
    return getGrantsByInstitution(institutionId);
  }, [institutionId, refreshKey]);

  const metrics = useMemo(() => {
    return computeFacultyMetrics(facultyId, institutionId);
  }, [facultyId, institutionId, refreshKey]);

  // Filtering publications
  const filteredPubs = useMemo(() => {
    return publications.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.facultyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = selectedTierFilter === 'ALL' || p.indexing.includes(selectedTierFilter as IndexingTier);
      return matchesSearch && matchesTier;
    });
  }, [publications, searchTerm, selectedTierFilter]);

  const handleExportCSV = () => {
    const csvContent = exportResearchPublicationsCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NAAC_Criterion_3_Research_Audit_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreatePublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubTitle.trim() || !newPubVenue.trim()) return;

    addPublication({
      institutionId,
      facultyId,
      facultyName,
      department,
      title: newPubTitle.trim(),
      type: newPubType,
      venue: newPubVenue.trim(),
      indexing: newPubIndexing,
      publicationYear: newPubYear,
      doi: newPubDoi.trim() || undefined,
      citationCount: newPubCitations,
      isFirstOrCorrespondingAuthor: newPubIsFirst,
      coAuthors: []
    });

    setNewPubTitle('');
    setNewPubVenue('');
    setNewPubDoi('');
    setNewPubCitations(0);
    setShowAddPubModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleCreatePatent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatentTitle.trim()) return;

    addPatent({
      institutionId,
      facultyId,
      facultyName,
      department,
      title: newPatentTitle.trim(),
      applicationNumber: newPatentAppNo.trim() || `PAT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      filingDate: new Date().toISOString().split('T')[0],
      status: newPatentStatus,
      patentOffice: newPatentOffice,
      inventors: [facultyName, 'PinIT Academy']
    });

    setNewPatentTitle('');
    setNewPatentAppNo('');
    setShowAddPatentModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleAdvancePatent = (id: string, currentStatus: PatentStatus) => {
    let nextStatus: PatentStatus = 'PUBLISHED';
    let grantDate: string | undefined = undefined;

    if (currentStatus === 'FILED') nextStatus = 'PUBLISHED';
    else if (currentStatus === 'PUBLISHED') nextStatus = 'EXAMINED';
    else if (currentStatus === 'EXAMINED') {
      nextStatus = 'GRANTED';
      grantDate = new Date().toISOString().split('T')[0];
    } else if (currentStatus === 'GRANTED') nextStatus = 'COMMERCIALIZED';

    updatePatentStatus(id, nextStatus, grantDate);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Faculty Research & Patents Portfolio Studio</h1>
              <p className="text-sm text-slate-400">
                NAAC Criteria 3.3 & 3.4 • UGC-CARE / Scopus / WoS Publications • IPR Patent Ledger • AICTE Research Grants
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export NAAC AQAR CSV
          </button>
        </div>
      </div>

      {/* KPI Research Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* FRIS Score Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Research Impact Score</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{metrics.frisScore} <span className="text-sm text-slate-400 font-normal">/ 100</span></h3>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border ${
              metrics.frisScore >= 75
                ? 'bg-purple-900/40 text-purple-300 border-purple-500/40'
                : metrics.frisScore >= 50
                ? 'bg-blue-900/40 text-blue-300 border-blue-500/40'
                : 'bg-amber-900/40 text-amber-300 border-amber-500/40'
            }`}>
              {metrics.frisScore >= 75 ? 'Tier 1 Leader' : metrics.frisScore >= 50 ? 'Active Scholar' : 'Emerging'}
            </span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${metrics.frisScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">Calculated from indexing weights, citations, & grants</p>
        </div>

        {/* Citations & h-Index */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Citations & h-Index</p>
          <div className="flex items-baseline gap-3 mt-1">
            <h3 className="text-3xl font-extrabold text-blue-400">{metrics.totalCitations}</h3>
            <span className="text-sm font-semibold text-slate-300 bg-slate-700/60 px-2.5 py-0.5 rounded border border-slate-600">
              h-index: {metrics.hIndex}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Verified across Google Scholar & Scopus</p>
        </div>

        {/* Publications Breakdown */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Publications</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-emerald-400">{metrics.totalPublications}</h3>
            <span className="text-xs text-slate-400">papers</span>
          </div>
          <div className="flex gap-2 text-xs text-slate-300 mt-3">
            <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
              Scopus: {metrics.scopusCount}
            </span>
            <span className="bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/40 font-mono">
              WoS: {metrics.webOfScienceCount}
            </span>
          </div>
        </div>

        {/* Patents & Grants */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Patents & Grants</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-amber-400">{metrics.patentsGranted}</h3>
            <span className="text-xs text-slate-400">Granted ({metrics.totalPatents} Total)</span>
          </div>
          <p className="text-xs text-slate-300 mt-3 font-mono">
            Active Grants: ₹{(metrics.activeGrantsINR / 100000).toFixed(1)} Lakhs
          </p>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('publications')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'publications'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Publications ({publications.length})
          </button>
          <button
            onClick={() => setActiveTab('patents')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'patents'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Patents & IPR ({patents.length})
          </button>
          <button
            onClick={() => setActiveTab('grants')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'grants'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Research Grants ({grants.length})
          </button>
        </div>

        {activeTab === 'publications' && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search papers, DOI or venue..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 w-full sm:w-64"
            />
            <select
              value={selectedTierFilter}
              onChange={e => setSelectedTierFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Tiers</option>
              <option value="SCOPUS">Scopus</option>
              <option value="WEB_OF_SCIENCE">Web of Science</option>
              <option value="IEEE_ACM">IEEE / ACM</option>
              <option value="UGC_CARE">UGC-CARE</option>
            </select>
            <button
              onClick={() => setShowAddPubModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shrink-0"
            >
              + Add Publication
            </button>
          </div>
        )}

        {activeTab === 'patents' && (
          <button
            onClick={() => setShowAddPatentModal(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shrink-0"
          >
            + File New Patent
          </button>
        )}
      </div>

      {/* Tab 1: Publications List */}
      {activeTab === 'publications' && (
        <div className="space-y-3">
          {filteredPubs.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400">
              No publications found matching your filters.
            </div>
          ) : (
            filteredPubs.map(pub => (
              <div
                key={pub.id}
                className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-700 text-slate-300">
                        {pub.type}
                      </span>
                      {pub.isFirstOrCorrespondingAuthor && (
                        <span className="text-xs px-2 py-0.5 rounded font-medium bg-blue-900/40 text-blue-300 border border-blue-700/50">
                          Lead / Corresponding Author
                        </span>
                      )}
                      <span className="text-xs text-slate-400">Year {pub.publicationYear}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white leading-snug">{pub.title}</h3>
                    <p className="text-sm text-slate-300">{pub.venue}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-blue-400">{pub.citationCount}</div>
                    <p className="text-xs text-slate-400">citations</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400">Indexed In:</span>
                    {pub.indexing.map(idx => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                      >
                        {idx}
                      </span>
                    ))}
                  </div>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      DOI: {pub.doi}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Patents & IPR */}
      {activeTab === 'patents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patents.map(patent => (
            <div
              key={patent.id}
              className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400">{patent.applicationNumber}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    patent.status === 'GRANTED' || patent.status === 'COMMERCIALIZED'
                      ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40'
                      : patent.status === 'EXAMINED'
                      ? 'bg-cyan-900/40 text-cyan-300 border-cyan-500/40'
                      : 'bg-amber-900/40 text-amber-300 border-amber-500/40'
                  }`}>
                    {patent.status}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white leading-snug">{patent.title}</h3>
                <p className="text-xs text-slate-400">
                  Office: <span className="text-slate-200 font-semibold">{patent.patentOffice}</span> • Filed: {patent.filingDate}
                  {patent.grantDate && ` • Granted: ${patent.grantDate}`}
                </p>
                <div className="text-xs text-slate-400">
                  Inventors: <span className="text-slate-300">{patent.inventors.join(', ')}</span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span className={patent.status !== 'FILED' ? 'text-blue-400 font-bold' : 'text-slate-200'}>1. Filed</span>
                  <span className={['PUBLISHED', 'EXAMINED', 'GRANTED', 'COMMERCIALIZED'].includes(patent.status) ? 'text-blue-400 font-bold' : ''}>2. Pub</span>
                  <span className={['EXAMINED', 'GRANTED', 'COMMERCIALIZED'].includes(patent.status) ? 'text-blue-400 font-bold' : ''}>3. Exam</span>
                  <span className={['GRANTED', 'COMMERCIALIZED'].includes(patent.status) ? 'text-emerald-400 font-bold' : ''}>4. Granted</span>
                </div>

                {patent.status !== 'COMMERCIALIZED' && (
                  <button
                    onClick={() => handleAdvancePatent(patent.id, patent.status)}
                    className="w-full py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded transition"
                  >
                    Advance Status &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Research Grants */}
      {activeTab === 'grants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grants.map(grant => (
            <div
              key={grant.id}
              className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded bg-blue-900/40 text-blue-300 font-bold border border-blue-700/50">
                  Agency: {grant.fundingAgency}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  grant.status === 'ACTIVE'
                    ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {grant.status}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">{grant.projectTitle}</h3>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/50">
                <div>
                  <p className="text-slate-400">Sanctioned Budget</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">₹{(grant.sanctionedAmountINR).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-slate-400">Duration</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">{grant.durationMonths} Months ({grant.startDate})</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Publication Modal */}
      {showAddPubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Record New Peer-Reviewed Publication</h3>
              <button onClick={() => setShowAddPubModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreatePublication} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Paper Title</label>
                <input
                  type="text"
                  required
                  value={newPubTitle}
                  onChange={e => setNewPubTitle(e.target.value)}
                  placeholder="e.g. Byzantine-Resilient Consensus for Autonomous Fleets"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
                  <select
                    value={newPubType}
                    onChange={e => setNewPubType(e.target.value as PublicationType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="JOURNAL">Journal Article</option>
                    <option value="CONFERENCE">Conference Proceedings</option>
                    <option value="BOOK_CHAPTER">Book Chapter</option>
                    <option value="BOOK">Scholarly Book</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
                  <input
                    type="number"
                    value={newPubYear}
                    onChange={e => setNewPubYear(parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Journal / Conference Venue</label>
                <input
                  type="text"
                  required
                  value={newPubVenue}
                  onChange={e => setNewPubVenue(e.target.value)}
                  placeholder="e.g. IEEE Transactions on Software Engineering"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">DOI (Optional)</label>
                  <input
                    type="text"
                    value={newPubDoi}
                    onChange={e => setNewPubDoi(e.target.value)}
                    placeholder="10.1109/TSE.2026.12345"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Citations</label>
                  <input
                    type="number"
                    value={newPubCitations}
                    onChange={e => setNewPubCitations(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Indexing Badges</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['SCOPUS', 'WEB_OF_SCIENCE', 'IEEE_ACM', 'UGC_CARE'] as IndexingTier[]).map(tier => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => {
                        if (newPubIndexing.includes(tier)) {
                          setNewPubIndexing(newPubIndexing.filter(t => t !== tier));
                        } else {
                          setNewPubIndexing([...newPubIndexing, tier]);
                        }
                      }}
                      className={`text-xs px-2.5 py-1 rounded font-semibold border ${
                        newPubIndexing.includes(tier)
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="firstAuth"
                  checked={newPubIsFirst}
                  onChange={e => setNewPubIsFirst(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-blue-600"
                />
                <label htmlFor="firstAuth" className="text-xs text-slate-300">
                  Faculty is First or Corresponding Author (+2 FRIS bonus)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPubModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
                >
                  Save Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Patent Modal */}
      {showAddPatentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">File New Intellectual Property / Patent</h3>
              <button onClick={() => setShowAddPatentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreatePatent} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Invention Title</label>
                <input
                  type="text"
                  required
                  value={newPatentTitle}
                  onChange={e => setNewPatentTitle(e.target.value)}
                  placeholder="e.g. Lock-Free Hardware FIFO Buffer for Sub-Microsecond Schedulers"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Patent Office</label>
                  <select
                    value={newPatentOffice}
                    onChange={e => setNewPatentOffice(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="INDIAN_PATENT_OFFICE">Indian Patent Office (IPO)</option>
                    <option value="USPTO">USPTO (USA)</option>
                    <option value="EPO">EPO (Europe)</option>
                    <option value="WIPO">WIPO (PCT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={newPatentStatus}
                    onChange={e => setNewPatentStatus(e.target.value as PatentStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="FILED">Filed</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="EXAMINED">Examined</option>
                    <option value="GRANTED">Granted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Application Number (Optional)</label>
                <input
                  type="text"
                  value={newPatentAppNo}
                  onChange={e => setNewPatentAppNo(e.target.value)}
                  placeholder="Leave empty to auto-generate PAT-2026-XXXXXX"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPatentModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
                >
                  File Patent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
