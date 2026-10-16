'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  HealthConsultationRecord,
  MedicalLeaveCertificate,
  TriageSeverity,
  MedicalLeaveStatus,
  getConsultations,
  getMedicalLeaves,
  logConsultation,
  submitMedicalLeave,
  verifyMedicalLeave,
  computeHealthCentreSummary,
  exportMedicalLeaveLedgerCSV,
  seedStudentHealthData
} from '@/lib/admin/studentHealth';

interface StudentHealthManagerProps {
  institutionId?: string;
}

export const StudentHealthManager: React.FC<StudentHealthManagerProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  const [activeTab, setActiveTab] = useState<'CLINIC' | 'LEAVES'>('CLINIC');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [leaveStatusFilter, setLeaveStatusFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  // Consult Form
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Pratibha Deshmukh, MD (Campus CMO)');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [severity, setSeverity] = useState<TriageSeverity>('ROUTINE');
  const [admitInfirmary, setAdmitInfirmary] = useState(false);
  const [dispatchAmbulance, setDispatchAmbulance] = useState(false);

  // Leave Form
  const [leaveStudentName, setLeaveStudentName] = useState('');
  const [leaveRollNumber, setLeaveRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-22');
  const [daysCount, setDaysCount] = useState(7);
  const [medicalReason, setMedicalReason] = useState('');
  const [physicianLicense, setPhysicianLicense] = useState('KMC-89104');
  const [hospitalName, setHospitalName] = useState('Apex University Health Centre');

  // Initial Seed
  useEffect(() => {
    const existing = getConsultations(institutionId);
    if (existing.length === 0) {
      seedStudentHealthData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const consultations = useMemo(() => getConsultations(institutionId), [institutionId, refreshKey]);
  const medicalLeaves = useMemo(() => getMedicalLeaves(institutionId), [institutionId, refreshKey]);
  const summary = useMemo(() => computeHealthCentreSummary(institutionId), [institutionId, refreshKey]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter(c => {
      const matchesSeverity = severityFilter === 'ALL' || c.severity === severityFilter;
      const matchesSearch = c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [consultations, severityFilter, searchTerm]);

  const filteredLeaves = useMemo(() => {
    return medicalLeaves.filter(l => {
      const matchesStatus = leaveStatusFilter === 'ALL' || l.status === leaveStatusFilter;
      const matchesSearch = l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.medicalReason.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [medicalLeaves, leaveStatusFilter, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportMedicalLeaveLedgerCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Medical_Leave_Attendance_Waivers_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !diagnosis.trim()) return;

    logConsultation({
      institutionId,
      studentId: `STU-${rollNumber.trim() || 'GEN'}`,
      studentName: studentName.trim(),
      rollNumber: rollNumber.trim() || '2026-CSE-100',
      doctorName,
      symptoms: symptoms.split(',').map(s => s.trim()).filter(Boolean),
      diagnosis: diagnosis.trim(),
      prescriptionNotes: prescription.trim() || 'General rest & hydration',
      severity,
      admittedToInfirmary: admitInfirmary,
      ambulanceDispatched: dispatchAmbulance
    });

    setShowConsultModal(false);
    setStudentName('');
    setRollNumber('');
    setSymptoms('');
    setDiagnosis('');
    setPrescription('');
    setAdmitInfirmary(false);
    setDispatchAmbulance(false);
    setRefreshKey(k => k + 1);
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveError(null);

    const res = submitMedicalLeave({
      institutionId,
      studentId: `STU-${leaveRollNumber.trim() || 'GEN'}`,
      studentName: leaveStudentName.trim(),
      rollNumber: leaveRollNumber.trim() || '2026-CSE-101',
      department,
      startDate,
      endDate,
      daysCount: Number(daysCount),
      medicalReason: medicalReason.trim() || 'Acute illness requiring bed rest',
      physicianLicenseNumber: physicianLicense.trim(),
      hospitalClinicName: hospitalName.trim()
    });

    if (!res.success) {
      setLeaveError(res.error || 'Failed to submit medical leave');
      return;
    }

    setShowLeaveModal(false);
    setLeaveStudentName('');
    setLeaveRollNumber('');
    setMedicalReason('');
    setRefreshKey(k => k + 1);
  };

  const handleVerify = (leaveId: string, isDean: boolean) => {
    verifyMedicalLeave(leaveId, 'Dr. Pratibha Deshmukh, MD (Campus CMO)', {
      deanApproved: isDean
    });
    setRefreshKey(k => k + 1);
  };

  const getSeverityBadge = (sev: TriageSeverity) => {
    switch (sev) {
      case 'EMERGENCY_AMBULANCE_DISPATCH':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">EMERGENCY (AMBULANCE)</span>;
      case 'URGENT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">URGENT</span>;
      case 'ROUTINE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">ROUTINE</span>;
    }
  };

  const getLeaveStatusBadge = (status: MedicalLeaveStatus, waived: boolean) => {
    switch (status) {
      case 'DEAN_APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">DEAN APPROVED (WAIVED)</span>;
      case 'PHYSICIAN_VERIFIED':
        return waived ? (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">VERIFIED (WAIVED)</span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">VERIFIED (DEAN PENDING)</span>
        );
      case 'SUBMITTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">SUBMITTED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-800">REJECTED</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              University Health Centre & Clinical Governance Console
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-800">
              Campus Infirmary
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Emergency triage, outpatient health telemetry, statutory medical leaves, and attendance waiver governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowConsultModal(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Log Patient Triage
          </button>

          <button
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submit Medical Certificate
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Medical Ledger CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Consultations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Outpatient Consultations</span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.totalConsultations}</span>
            <span className="text-slate-400 text-xs">patient encounters</span>
          </div>
          <p className="mt-3 text-xs text-indigo-300">
            Immunization Coverage: <span className="font-semibold text-white">{summary.immunizationCoveragePercent}%</span>
          </p>
        </div>

        {/* Card 2: Active Infirmary Beds */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Infirmary Admissions</span>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.activeInfirmaryAdmissions}</span>
            <span className="text-slate-400 text-xs">students in observation</span>
          </div>
          <p className="mt-3 text-xs text-amber-400">
            Campus clinic recovery ward active
          </p>
        </div>

        {/* Card 3: Emergency Ambulances */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Ambulance Dispatches</span>
            <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.emergencyAmbulanceDispatches}</span>
            <span className="text-slate-400 text-xs">critical transfers</span>
          </div>
          <p className="mt-3 text-xs text-rose-300">
            Emergency hospital transfers logged
          </p>
        </div>

        {/* Card 4: Attendance Waivers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Attendance Waivers Approved</span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.approvedAttendanceWaivers}</span>
            <span className="text-slate-400 text-xs">statutory exemptions</span>
          </div>
          <p className="mt-3 text-xs text-emerald-400">
            Pending Reviews: <span className="font-semibold">{summary.pendingMedicalLeaveReviews}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('CLINIC')}
          className={`pb-2 px-1 text-sm font-semibold transition ${
            activeTab === 'CLINIC'
              ? 'border-b-2 border-rose-500 text-rose-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Outpatient Clinic & Triage Stream ({filteredConsultations.length})
        </button>
        <button
          onClick={() => setActiveTab('LEAVES')}
          className={`pb-2 px-1 text-sm font-semibold transition ${
            activeTab === 'LEAVES'
              ? 'border-b-2 border-rose-500 text-rose-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Medical Leave Attendance Waivers ({filteredLeaves.length})
        </button>
      </div>

      {/* Tab 1: Clinic Stream */}
      {activeTab === 'CLINIC' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patient, roll no, or diagnosis..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 w-64"
              />
            </div>

            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Triage Severities</option>
              <option value="ROUTINE">Routine</option>
              <option value="URGENT">Urgent</option>
              <option value="EMERGENCY_AMBULANCE_DISPATCH">Emergency Ambulance</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Patient & Roll No</th>
                  <th className="py-3 px-3">Diagnosis & Symptoms</th>
                  <th className="py-3 px-3">Attending Physician</th>
                  <th className="py-3 px-3">Triage Severity</th>
                  <th className="py-3 px-3">Admission / Transit</th>
                  <th className="py-3 px-3 text-right">Encounter Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredConsultations.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{c.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.rollNumber}</div>
                      <div className="text-[10px] text-rose-400 font-mono mt-0.5">{c.id}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-200">{c.diagnosis}</div>
                      <div className="text-[11px] text-slate-400">
                        Symptoms: {c.symptoms.join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-500 italic mt-0.5">
                        Rx: {c.prescriptionNotes}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-300 font-medium">{c.doctorName}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      {getSeverityBadge(c.severity)}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        {c.admittedToInfirmary && (
                          <span className="block text-[10px] text-amber-400 font-medium">🛌 Infirmary Bed Assigned</span>
                        )}
                        {c.ambulanceDispatched && (
                          <span className="block text-[10px] text-rose-400 font-bold">🚑 Emergency Ambulance Run</span>
                        )}
                        {!c.admittedToInfirmary && !c.ambulanceDispatched && (
                          <span className="text-[10px] text-slate-500">Outpatient Discharge</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right text-slate-400 text-[11px]">
                      {new Date(c.timestamp).toLocaleDateString()} {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Medical Leaves */}
      {activeTab === 'LEAVES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search certificate or student..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 w-64"
              />
            </div>

            <select
              value={leaveStatusFilter}
              onChange={e => setLeaveStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DEAN_APPROVED">Dean Approved</option>
              <option value="PHYSICIAN_VERIFIED">Physician Verified</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Student & Department</th>
                  <th className="py-3 px-3">Absence Duration</th>
                  <th className="py-3 px-3">Medical Reason & Hospital</th>
                  <th className="py-3 px-3">Physician Registration</th>
                  <th className="py-3 px-3">Attendance Waiver Status</th>
                  <th className="py-3 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredLeaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{l.studentName}</div>
                      <div className="text-[11px] text-slate-400">{l.department}</div>
                      <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{l.id}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white">{l.daysCount} Days</div>
                      <div className="text-[11px] text-slate-400">
                        {l.startDate} to {l.endDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-200 font-medium">{l.medicalReason}</div>
                      <div className="text-[11px] text-slate-400">{l.hospitalClinicName}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-300 font-mono text-xs">{l.physicianLicenseNumber}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{l.verificationDigest.slice(0, 16)}...</div>
                    </td>

                    <td className="py-3.5 px-3">
                      {getLeaveStatusBadge(l.status, l.attendanceWaiverApproved)}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {l.status === 'SUBMITTED' && (
                          <button
                            onClick={() => handleVerify(l.id, false)}
                            className="px-2 py-1 bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-300 rounded text-[11px] font-medium border border-cyan-700/50"
                          >
                            Physician Verify
                          </button>
                        )}

                        {l.status === 'PHYSICIAN_VERIFIED' && l.daysCount > 14 && !l.attendanceWaiverApproved && (
                          <button
                            onClick={() => handleVerify(l.id, true)}
                            className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 rounded text-[11px] font-medium border border-emerald-700/50"
                          >
                            Dean Waiver Sign-off
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Consult Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Log Patient Triage & Consultation</h3>
              <button onClick={() => setShowConsultModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConsultSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sen"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-CSE-045"
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Symptoms (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. High Fever, Chills, Vomiting"
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Viral Bronchitis"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Prescription Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Paracetamol 650mg TDS; Rest for 3 days"
                  value={prescription}
                  onChange={e => setPrescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Triage Severity</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as TriageSeverity)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="ROUTINE">Routine (Outpatient)</option>
                  <option value="URGENT">Urgent (Observation)</option>
                  <option value="EMERGENCY_AMBULANCE_DISPATCH">Emergency Ambulance Dispatch</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={admitInfirmary}
                    onChange={e => setAdmitInfirmary(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-rose-500"
                  />
                  Admit to Campus Infirmary Bed
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dispatchAmbulance}
                    onChange={e => setDispatchAmbulance(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-rose-500"
                  />
                  Dispatch Campus Ambulance
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConsultModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm"
                >
                  Save Encounter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Submit Medical Certificate</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {leaveError && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-3 rounded-lg">
                {leaveError}
              </div>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={leaveStudentName}
                    onChange={e => setLeaveStudentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={leaveRollNumber}
                    onChange={e => setLeaveRollNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Days</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={daysCount}
                    onChange={e => setDaysCount(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Medical Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Typhoid Enteric Fever"
                  value={medicalReason}
                  onChange={e => setMedicalReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Physician License / MCI Reg No</label>
                  <input
                    type="text"
                    required
                    value={physicianLicense}
                    onChange={e => setPhysicianLicense(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={e => setHospitalName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Submit Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
