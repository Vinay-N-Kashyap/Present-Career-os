'use client';

import React, { useState } from 'react';
import {
  DegreeCandidate,
  ConvocationCeremony,
  getAllDegreeCandidates,
  getAllConvocationCeremonies,
  registerDegreeCandidate,
  registerConvocationCeremony,
  conferUniversityDegree,
  generateNadDigiLockerRecord,
  exportConvocationGazetteCSV,
  ConferralMode,
} from '@/lib/admin/convocationCertification';

export default function ConvocationManager() {
  const [ceremony] = useState<ConvocationCeremony>(() => {
    const existing = getAllConvocationCeremonies();
    if (existing.length > 0) return existing[0];

    return registerConvocationCeremony({
      id: 'CONV-2026-32',
      edition: '32nd Annual Grand Convocation',
      academicYear: '2025-2026',
      ceremonyDate: '2026-12-18',
      venue: 'Sir M. Visvesvaraya Memorial Grand Auditorium',
      chancellorName: 'Dr. K. Kasturirangan (Former ISRO Chairman)',
      viceChancellorName: 'Prof. Anupama Venkataraman',
      chiefGuestName: 'Dr. Soumya Swaminathan',
      chiefGuestDesignation: 'Former Chief Scientist, World Health Organization (WHO)',
      totalEligibleGraduates: 450,
      inPersonAttendees: 385,
      inAbsentiaCount: 65,
      status: 'SCHEDULED',
    });
  });

  const [candidates, setCandidates] = useState<DegreeCandidate[]>(() => {
    const existing = getAllDegreeCandidates();
    if (existing.length > 0) return existing;

    const c1 = registerDegreeCandidate({
      id: 'CAND-01',
      studentRoll: '20CS001',
      studentName: 'Aarohi Shenoy',
      aadhaarOrAbhaId: 'ABHA-9821-4412-1092',
      department: 'Computer Science & Engineering',
      degreeProgram: 'Bachelor of Technology (B.Tech)',
      majorSpecialization: 'Artificial Intelligence & Distributed Systems',
      graduationYear: 2026,
      completedCredits: 164,
      finalCGPA: 9.85,
      classification: 'FIRST_CLASS_WITH_DISTINCTION',
      isMedalWinner: true,
      medalTitle: "Chancellor's Gold Medal for Institute Rank 1",
      clearance: {
        academicDeanCleared: true,
        bursarZeroDuesCleared: true,
        libraryNoDuesCleared: true,
        hostelNoDuesCleared: true,
        disciplinaryHold: false,
      },
      convocationStatus: 'ELIGIBLE_FOR_CONVOCATION',
    });

    const c2 = registerDegreeCandidate({
      id: 'CAND-02',
      studentRoll: '20CS014',
      studentName: 'Vikramaditya Singhania',
      aadhaarOrAbhaId: 'ABHA-7741-9012-3811',
      department: 'Computer Science & Engineering',
      degreeProgram: 'Bachelor of Technology (B.Tech)',
      majorSpecialization: 'Cloud Computing & Cyber Defense',
      graduationYear: 2026,
      completedCredits: 160,
      finalCGPA: 8.92,
      classification: 'FIRST_CLASS_WITH_DISTINCTION',
      isMedalWinner: false,
      clearance: {
        academicDeanCleared: true,
        bursarZeroDuesCleared: true,
        libraryNoDuesCleared: true,
        hostelNoDuesCleared: true,
        disciplinaryHold: false,
      },
      convocationStatus: 'ELIGIBLE_FOR_CONVOCATION',
    });

    const c3 = registerDegreeCandidate({
      id: 'CAND-03',
      studentRoll: '20EC008',
      studentName: 'Priya Nambiar',
      aadhaarOrAbhaId: 'ABHA-1209-6632-4410',
      department: 'Electronics & Communication',
      degreeProgram: 'Bachelor of Technology (B.Tech)',
      majorSpecialization: 'VLSI Design & Embedded Systems',
      graduationYear: 2026,
      completedCredits: 162,
      finalCGPA: 8.45,
      classification: 'FIRST_CLASS',
      isMedalWinner: false,
      clearance: {
        academicDeanCleared: true,
        bursarZeroDuesCleared: false, // Bursar hold demo
        libraryNoDuesCleared: true,
        hostelNoDuesCleared: true,
        disciplinaryHold: false,
      },
      convocationStatus: 'CLEARANCE_PENDING',
    });

    // Confer c1 initially for demo
    conferUniversityDegree({
      candidateId: c1.id,
      conferralMode: 'IN_PERSON',
      conferralDate: '2026-12-18',
    });

    return getAllDegreeCandidates();
  });

  const [activeTab, setActiveTab] = useState<'ROSTER' | 'NAD_DIGILOCKER'>('ROSTER');

  // Modals
  const [selectedCandidate, setSelectedCandidate] = useState<DegreeCandidate | null>(null);
  const [showConferModal, setShowConferModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [conferralMode, setConferralMode] = useState<ConferralMode>('IN_PERSON');

  // Stats
  const totalGraduates = candidates.length;
  const conferredCount = candidates.filter((c) => c.degreeSerialNumber).length;
  const medalsCount = candidates.filter((c) => c.isMedalWinner).length;
  const pendingClearanceCount = candidates.filter((c) => c.convocationStatus === 'CLEARANCE_PENDING').length;

  const handleDownloadGazette = () => {
    try {
      const csv = exportConvocationGazetteCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Official_Convocation_Gazette_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert(`Error exporting Gazette CSV: ${e.message}`);
    }
  };

  const handleConferDegree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    try {
      conferUniversityDegree({
        candidateId: selectedCandidate.id,
        conferralMode,
        conferralDate: ceremony.ceremonyDate,
      });
      setCandidates(getAllDegreeCandidates());
      setShowConferModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              UGC & MoE Statutory Registry
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              NAD / DigiLocker Certified
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Convocation Ceremony & Cryptographic Degree Registry
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Statutory 160-credit degree audit validation, Chancellor authentication seals, and National Academic Depository integration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadGazette}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Official Gazette CSV
          </button>
        </div>
      </div>

      {/* Convocation Ceremony Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-900/40 border border-amber-900/40 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Official University Convocation</span>
            <h2 className="text-2xl font-black text-white">{ceremony.edition} ({ceremony.academicYear})</h2>
            <p className="text-xs text-slate-300">
              <strong className="text-white">Venue:</strong> {ceremony.venue} • <strong className="text-white">Date:</strong> {ceremony.ceremonyDate}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span><strong>Chancellor:</strong> {ceremony.chancellorName}</span>
              <span>•</span>
              <span><strong>Chief Guest:</strong> {ceremony.chiefGuestName} ({ceremony.chiefGuestDesignation})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-slate-950/80 border border-amber-500/30 rounded-xl text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Ceremony Status</p>
              <p className="text-sm font-extrabold text-amber-400 mt-0.5">{ceremony.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Graduating Cohort</p>
            <p className="text-3xl font-bold text-white mt-1">{totalGraduates}</p>
            <p className="text-xs text-emerald-400 mt-1">160-Credit AICTE Cleared</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Degrees Conferred</p>
            <p className="text-3xl font-bold text-amber-400 mt-1">{conferredCount} <span className="text-sm font-normal text-slate-500">/ {totalGraduates}</span></p>
            <p className="text-xs text-amber-400/80 mt-1">SHA-256 Digitally Sealed</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Medals & Honors</p>
            <p className="text-3xl font-bold text-purple-400 mt-1">{medalsCount}</p>
            <p className="text-xs text-purple-400/80 mt-1">Chancellor&apos;s Gold Medalists</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Clearances Pending</p>
            <p className="text-3xl font-bold text-red-400 mt-1">{pendingClearanceCount}</p>
            <p className="text-xs text-red-400/80 mt-1">Bursar / Hostel dues hold</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex gap-4">
        <button
          onClick={() => setActiveTab('ROSTER')}
          className={`pb-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'ROSTER'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Graduating Scholar Roster & Conferral Ledger
        </button>
        <button
          onClick={() => setActiveTab('NAD_DIGILOCKER')}
          className={`pb-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'NAD_DIGILOCKER'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          National Academic Depository (NAD) & DigiLocker
        </button>
      </div>

      {activeTab === 'ROSTER' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Graduating Candidates Registry</h2>
                <p className="text-xs text-slate-400 mt-0.5">Approved graduating scholars cleared across Dean, Bursar, Library, and Housing</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Program & Dept</th>
                    <th className="py-3 px-4">CGPA & Class</th>
                    <th className="py-3 px-4">Clearance Status</th>
                    <th className="py-3 px-4">Degree Serial No.</th>
                    <th className="py-3 px-4">Digital Seal</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {candidates.map((c) => {
                    const isConferred = Boolean(c.degreeSerialNumber);
                    const isCleared = c.convocationStatus === 'ELIGIBLE_FOR_CONVOCATION';

                    return (
                      <tr key={c.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-semibold text-white flex items-center gap-1.5">
                                {c.studentName}
                                {c.isMedalWinner && (
                                  <span className="text-amber-400" title={c.medalTitle}>★</span>
                                )}
                              </p>
                              <p className="text-xs text-slate-400 font-mono">{c.studentRoll} • {c.aadhaarOrAbhaId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-xs font-semibold text-white">{c.degreeProgram}</p>
                          <p className="text-[11px] text-slate-400">{c.department}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-emerald-400">{c.finalCGPA.toFixed(2)}</span>
                          <p className="text-[10px] text-slate-400 font-semibold">{c.classification.replace(/_/g, ' ')}</p>
                        </td>
                        <td className="py-3 px-4">
                          {c.clearance.disciplinaryHold ? (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                              Disciplinary Hold
                            </span>
                          ) : !c.clearance.bursarZeroDuesCleared ? (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              Bursar Dues Hold
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              All 4 Cleared
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">
                          {c.degreeSerialNumber ? (
                            <span className="text-amber-400 font-bold">{c.degreeSerialNumber}</span>
                          ) : (
                            <span className="text-slate-600 italic">Pending Conferral</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {c.cryptoSealDigest ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-800">
                              {c.cryptoSealDigest.substring(0, 8)}...
                            </span>
                          ) : (
                            <span className="text-slate-600 italic text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isConferred ? (
                            <button
                              onClick={() => {
                                setSelectedCandidate(c);
                                setShowCertificateModal(true);
                              }}
                              className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-300 rounded border border-amber-500/30 transition"
                            >
                              View Degree
                            </button>
                          ) : isCleared ? (
                            <button
                              onClick={() => {
                                setSelectedCandidate(c);
                                setShowConferModal(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded transition shadow"
                            >
                              Confer Degree
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500">Hold Active</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'NAD_DIGILOCKER' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">National Academic Depository (NAD) XML/JSON Payload</h2>
                <p className="text-xs text-slate-400 mt-0.5">Government of India DigiLocker API integration schema</p>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live Cloud Sync Active
              </span>
            </div>

            <div className="space-y-4">
              {candidates
                .filter((c) => c.degreeSerialNumber)
                .map((c) => {
                  const nadRecord = generateNadDigiLockerRecord(c.id);
                  return (
                    <div key={c.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-amber-400 font-bold">{c.degreeSerialNumber}</span>
                        <span className="text-slate-400">{c.studentName} ({c.studentRoll})</span>
                      </div>
                      <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/90 p-3 rounded overflow-x-auto border border-slate-800">
                        {JSON.stringify(nadRecord, null, 2)}
                      </pre>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Confer Modal */}
      {showConferModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Confer Degree Certificate</h3>
              <button onClick={() => setShowConferModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConferDegree} className="space-y-4 text-sm">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                <p className="text-white font-bold">{selectedCandidate.studentName} ({selectedCandidate.studentRoll})</p>
                <p className="text-slate-400">{selectedCandidate.degreeProgram} • {selectedCandidate.department}</p>
                <p className="text-emerald-400 font-semibold">CGPA: {selectedCandidate.finalCGPA.toFixed(2)} ({selectedCandidate.classification.replace(/_/g, ' ')})</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Conferral Mode</label>
                <select
                  value={conferralMode}
                  onChange={(e) => setConferralMode(e.target.value as ConferralMode)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-amber-500 outline-none"
                >
                  <option value="IN_PERSON">In-Person at Convocation Ceremony</option>
                  <option value="IN_ABSENTIA">In-Absentia (Registered Collection)</option>
                  <option value="POSTAL_DISPATCH">Postal Dispatch via Registered Speed Post</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConferModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition shadow"
                >
                  Confer & Seal Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {showCertificateModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 border-2 border-amber-600/60 rounded-2xl w-full max-w-2xl p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {/* University Crest Header */}
            <div className="text-center space-y-2 border-b border-amber-800/40 pb-6">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">PinIT Institute of Science & Technology</span>
              <h2 className="text-2xl font-black text-white tracking-wide uppercase">Degree Certificate</h2>
              <p className="text-xs text-slate-400 italic">Established under the University Grants Commission Act, 1956</p>
            </div>

            {/* Body */}
            <div className="text-center space-y-4 py-4 text-slate-200">
              <p className="text-sm">By the authority of the Board of Governors and the Academic Senate,</p>
              <p className="text-2xl font-serif font-bold text-amber-300">{selectedCandidate.studentName}</p>
              <p className="text-xs text-slate-400 font-mono">Roll Number: {selectedCandidate.studentRoll}</p>
              <p className="text-sm">having satisfied all statutory requirements and completed 160 credits is hereby admitted to the degree of</p>
              <p className="text-xl font-bold text-white tracking-wide">{selectedCandidate.degreeProgram}</p>
              <p className="text-sm text-slate-300">in {selectedCandidate.department}</p>
              <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mt-2">
                {selectedCandidate.classification.replace(/_/g, ' ')} (CGPA: {selectedCandidate.finalCGPA.toFixed(2)})
              </div>
            </div>

            {/* Footer with Seal & Signatures */}
            <div className="border-t border-amber-800/40 pt-6 flex justify-between items-end text-xs text-slate-400">
              <div className="space-y-1">
                <p className="font-mono text-amber-400 font-bold">{selectedCandidate.degreeSerialNumber}</p>
                <p className="text-[10px] font-mono">Seal: {selectedCandidate.cryptoSealDigest}</p>
                <p className="text-[10px] text-slate-500">Conferred: {selectedCandidate.conferralDate}</p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-white font-semibold">{ceremony.viceChancellorName}</p>
                <p className="text-[11px] text-slate-400">Vice-Chancellor</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
