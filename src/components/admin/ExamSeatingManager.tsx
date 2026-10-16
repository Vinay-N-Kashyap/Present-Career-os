'use client';

import React, { useState } from 'react';
import {
  ExamHall,
  ExamHallSeatingPlan,
  InvigilationDuty,
  MalpracticeIncident,
  getAllExamHalls,
  getAllSeatingPlans,
  getAllInvigilationDuties,
  getAllMalpracticeIncidents,
  generateInterleavedSeatingPlan,
  logMalpracticeIncident,
  exportExamSeatingPlanCSV,
  ExamCandidate,
} from '@/lib/admin/examSeating';

export default function ExamSeatingManager() {
  const [halls] = useState<ExamHall[]>(() => getAllExamHalls());
  const [activeTab, setActiveTab] = useState<'SEATING_GRID' | 'INVIGILATION_ROSTER'>('SEATING_GRID');
  const [selectedHallId, setSelectedHallId] = useState<string>('HALL-ARYABHATTA-101');
  const [plans, setPlans] = useState<ExamHallSeatingPlan[]>(() => {
    // Generate initial sample plan if empty
    const existing = getAllSeatingPlans();
    if (existing.length > 0) return existing;

    const cseStudents: ExamCandidate[] = [
      { id: 'STU-01', name: 'Aarav Sharma', rollNumber: '21CS001', courseCode: 'CS401', courseName: 'Distributed Operating Systems', department: 'CSE', semester: 7 },
      { id: 'STU-02', name: 'Ishita Patel', rollNumber: '21CS002', courseCode: 'CS401', courseName: 'Distributed Operating Systems', department: 'CSE', semester: 7 },
      { id: 'STU-03', name: 'Rohan Verma', rollNumber: '21CS003', courseCode: 'CS401', courseName: 'Distributed Operating Systems', department: 'CSE', semester: 7 },
      { id: 'STU-04', name: 'Pooja Iyer', rollNumber: '21CS004', courseCode: 'CS401', courseName: 'Distributed Operating Systems', department: 'CSE', semester: 7 },
      { id: 'STU-05', name: 'Siddharth Nair', rollNumber: '21CS005', courseCode: 'CS401', courseName: 'Distributed Operating Systems', department: 'CSE', semester: 7 },
      { id: 'STU-06', name: 'Ananya Rao', rollNumber: '21CS006', courseCode: 'CS401', courseName: 'Distributed Operating Systems', department: 'CSE', semester: 7 },
      { id: 'STU-07', name: 'Kunal Deshmukh', rollNumber: '21CS007', courseCode: 'CS401', courseName: 'Distributed Operating Systems', department: 'CSE', semester: 7 },
      { id: 'STU-08', name: 'Meera Menon', rollNumber: '21CS008', courseCode: 'CS401', courseName: 'Distributed Operating Systems', department: 'CSE', semester: 7 },
    ];

    const eceStudents: ExamCandidate[] = [
      { id: 'STU-09', name: 'Vikram Malhotra', rollNumber: '21EC001', courseCode: 'EC402', courseName: 'VLSI Design & Embedded Systems', department: 'ECE', semester: 7 },
      { id: 'STU-10', name: 'Tanvi Joshi', rollNumber: '21EC002', courseCode: 'EC402', courseName: 'VLSI Design & Embedded Systems', department: 'ECE', semester: 7 },
      { id: 'STU-11', name: 'Arjun Kulkarni', rollNumber: '21EC003', courseCode: 'EC402', courseName: 'VLSI Design & Embedded Systems', department: 'ECE', semester: 7 },
      { id: 'STU-12', name: 'Deepika Reddy', rollNumber: '21EC004', courseCode: 'EC402', courseName: 'VLSI Design & Embedded Systems', department: 'ECE', semester: 7 },
      { id: 'STU-13', name: 'Varun Hegde', rollNumber: '21EC005', courseCode: 'EC402', courseName: 'VLSI Design & Embedded Systems', department: 'ECE', semester: 7 },
      { id: 'STU-14', name: 'Divya Pillai', rollNumber: '21EC006', courseCode: 'EC402', courseName: 'VLSI Design & Embedded Systems', department: 'ECE', semester: 7 },
      { id: 'STU-15', name: 'Nikhil Bose', rollNumber: '21EC007', courseCode: 'EC402', courseName: 'VLSI Design & Embedded Systems', department: 'ECE', semester: 7 },
      { id: 'STU-16', name: 'Shruti Sen', rollNumber: '21EC008', courseCode: 'EC402', courseName: 'VLSI Design & Embedded Systems', department: 'ECE', semester: 7 },
    ];

    const samplePlan = generateInterleavedSeatingPlan({
      planId: 'PLAN-ENDSEM-2026-H101',
      hallId: 'HALL-ARYABHATTA-101',
      examDate: '2026-11-20',
      timeSlot: 'MORNING_09_12',
      sessionType: 'END_SEMESTER',
      candidatesByCourse: [cseStudents, eceStudents],
      assignedInvigilators: [
        { id: 'FAC-101', name: 'Dr. Suresh Ranganathan' },
        { id: 'FAC-102', name: 'Prof. Nalini Swaminathan' },
      ],
    });

    return [samplePlan];
  });

  const [duties] = useState<InvigilationDuty[]>(() => {
    const existing = getAllInvigilationDuties();
    if (existing.length > 0) return existing;
    return [
      {
        id: 'DUTY-01',
        facultyId: 'FAC-101',
        facultyName: 'Dr. Suresh Ranganathan',
        department: 'Mechanical Engineering',
        hallId: 'HALL-ARYABHATTA-101',
        hallName: 'Aryabhatta Exam Hall 101',
        examDate: '2026-11-20',
        timeSlot: 'MORNING_09_12',
        role: 'CHIEF_SUPERINTENDENT',
        status: 'SCHEDULED',
      },
      {
        id: 'DUTY-02',
        facultyId: 'FAC-102',
        facultyName: 'Prof. Nalini Swaminathan',
        department: 'Humanities & Social Sciences',
        hallId: 'HALL-ARYABHATTA-101',
        hallName: 'Aryabhatta Exam Hall 101',
        examDate: '2026-11-20',
        timeSlot: 'MORNING_09_12',
        role: 'ROOM_INVIGILATOR',
        status: 'SCHEDULED',
      },
      {
        id: 'DUTY-03',
        facultyId: 'FAC-103',
        facultyName: 'Dr. Arvind Krishnamurthy',
        department: 'Physics',
        hallId: 'HALL-BHASKARA-AUD',
        hallName: 'Bhaskara Central Exam Arena',
        examDate: '2026-11-20',
        timeSlot: 'MORNING_09_12',
        role: 'FLYING_SQUAD_MEMBER',
        status: 'REPORTED',
      },
    ];
  });

  const [malpractices, setMalpractices] = useState<MalpracticeIncident[]>(() => getAllMalpracticeIncidents());

  // Modal states
  const [showMalpracticeModal, setShowMalpracticeModal] = useState(false);
  const [malpracticeCandidateRoll, setMalpracticeCandidateRoll] = useState('');
  const [malpracticeCandidateName, setMalpracticeCandidateName] = useState('');
  const [malpracticeCourse, setMalpracticeCourse] = useState('CS401');
  const [malpracticeDescription, setMalpracticeDescription] = useState('');
  const [malpracticeEvidence, setMalpracticeEvidence] = useState('Handwritten formulas concealed in calculator cover');

  const selectedHall = halls.find((h) => h.id === selectedHallId) || halls[0];
  const activePlan = plans.find((p) => p.hallId === selectedHallId);

  // Stats
  const totalSeated = plans.reduce((acc, p) => acc + p.totalSeatsFilled, 0);
  const totalCapacity = halls.reduce((acc, h) => acc + h.totalCapacity, 0);
  const activeIncidents = malpractices.length;

  const handleDownloadCSV = (planId: string) => {
    try {
      const csv = exportExamSeatingPlanCSV(planId);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CoE_Exam_Seating_Plan_${planId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert(`Error exporting CSV: ${e.message}`);
    }
  };

  const handleCreateMalpractice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!malpracticeCandidateRoll || !malpracticeDescription) return;

    const incident = logMalpracticeIncident({
      id: `INC-${Date.now()}`,
      studentId: `STU-${Date.now()}`,
      studentRoll: malpracticeCandidateRoll,
      studentName: malpracticeCandidateName || 'Examinee',
      hallId: selectedHallId,
      courseCode: malpracticeCourse,
      reportedByFacultyId: 'FAC-101',
      reportedByFacultyName: 'Dr. Suresh Ranganathan',
      description: malpracticeDescription,
      evidenceItems: malpracticeEvidence.split(',').map((s) => s.trim()),
    });

    setMalpractices((prev) => [incident, ...prev]);
    setShowMalpracticeModal(false);
    setMalpracticeCandidateRoll('');
    setMalpracticeCandidateName('');
    setMalpracticeDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Controller of Examinations (CoE)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Anti-Cheating Seating System
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Examination Hall Seating & Invigilation Dispatcher
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Statutory AICTE/UGC interleaved anti-cheating seat allocations, faculty invigilator conflict guard, and CoE flying squad telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activePlan && (
            <button
              onClick={() => handleDownloadCSV(activePlan.id)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CoE Seating CSV
            </button>
          )}

          <button
            onClick={() => setShowMalpracticeModal(true)}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-sm font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Report Unfair Means (UFM)
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Candidates Seated</p>
            <p className="text-3xl font-bold text-white mt-1">{totalSeated} <span className="text-sm font-normal text-slate-500">/ {totalCapacity}</span></p>
            <p className="text-xs text-emerald-400 mt-1">Interleaved anti-cheating matrix</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Exam Halls</p>
            <p className="text-3xl font-bold text-blue-400 mt-1">{halls.filter(h => h.isActive).length}</p>
            <p className="text-xs text-blue-400/80 mt-1">100% CCTV & Clock Sync</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Invigilator Ratio</p>
            <p className="text-3xl font-bold text-purple-400 mt-1">1 : 24</p>
            <p className="text-xs text-purple-400/80 mt-1">AICTE statutory norm (1:25)</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Unfair Means (UFM) Log</p>
            <p className="text-3xl font-bold text-amber-400 mt-1">{activeIncidents}</p>
            <p className="text-xs text-amber-400/80 mt-1">Flying Squad active inspection</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex gap-4">
        <button
          onClick={() => setActiveTab('SEATING_GRID')}
          className={`pb-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'SEATING_GRID'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Visual Seating Matrix & Hall Layout
        </button>
        <button
          onClick={() => setActiveTab('INVIGILATION_ROSTER')}
          className={`pb-3 font-medium text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'INVIGILATION_ROSTER'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Faculty Invigilation Roster & Flying Squad
        </button>
      </div>

      {activeTab === 'SEATING_GRID' && (
        <div className="space-y-6">
          {/* Hall Selection & Legend */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-300">Select Exam Hall:</label>
              <select
                value={selectedHallId}
                onChange={(e) => setSelectedHallId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
              >
                {halls.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.hallName} ({h.rows}x{h.columns} = {h.totalCapacity} seats)
                  </option>
                ))}
              </select>
            </div>

            {/* Anti-Cheating Visual Legend */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">Interleaved Courses:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500"></span>
                <span className="text-slate-300">CS401 (CSE 7th Sem)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500"></span>
                <span className="text-slate-300">EC402 (ECE 7th Sem)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></span>
                <span className="text-slate-500">Vacant / Buffer</span>
              </div>
            </div>
          </div>

          {/* Hall Metadata Card */}
          {activePlan && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-4">
                <span><strong className="text-white">Exam Date:</strong> {activePlan.examDate}</span>
                <span><strong className="text-white">Slot:</strong> {activePlan.timeSlot}</span>
                <span><strong className="text-white">Session:</strong> {activePlan.sessionType}</span>
                <span><strong className="text-white">Invigilators:</strong> {activePlan.assignedInvigilatorNames.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Seal: {activePlan.digest}
                </span>
                <span className="text-emerald-400 font-bold">{activePlan.occupancyPercentage}% Filled</span>
              </div>
            </div>
          )}

          {/* Interactive Seating Matrix */}
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl overflow-x-auto">
            <div className="mb-4 text-center">
              <div className="inline-block px-8 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 uppercase tracking-widest">
                Front: Blackboard & Invigilator Podium
              </div>
            </div>

            <div
              className="grid gap-3 mx-auto justify-center"
              style={{
                gridTemplateColumns: `repeat(${selectedHall.columns}, minmax(110px, 1fr))`,
              }}
            >
              {Array.from({ length: selectedHall.rows }).map((_, r) =>
                Array.from({ length: selectedHall.columns }).map((_, c) => {
                  const seatLabel = `${String.fromCharCode(65 + r)}${c + 1}`;
                  const allocated = activePlan?.allocatedSeats.find(
                    (s) => s.row === r + 1 && s.column === c + 1
                  );

                  const isCSE = allocated?.courseCode === 'CS401';
                  const isECE = allocated?.courseCode === 'EC402';

                  return (
                    <div
                      key={seatLabel}
                      className={`p-2.5 rounded-lg border text-left transition relative group ${
                        allocated
                          ? isCSE
                            ? 'bg-blue-950/40 border-blue-600/50 text-blue-200'
                            : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-mono font-bold mb-1">
                        <span>{seatLabel}</span>
                        {allocated && (
                          <span
                            className={`px-1 rounded text-[10px] font-semibold ${
                              isCSE ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {allocated.courseCode}
                          </span>
                        )}
                      </div>

                      {allocated ? (
                        <div>
                          <p className="text-[11px] font-semibold text-white truncate">{allocated.studentName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{allocated.studentRoll}</p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-600 italic">Empty</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'INVIGILATION_ROSTER' && (
        <div className="space-y-6">
          {/* Duty Roster Table */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Faculty Invigilation Duty Roster</h2>
              <span className="text-xs text-slate-400 font-semibold">AICTE Statutory Duty Compliance</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Assigned Hall</th>
                    <th className="py-3 px-4">Exam Date & Slot</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {duties.map((duty) => (
                    <tr key={duty.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-semibold text-white">{duty.facultyName}</td>
                      <td className="py-3 px-4 text-slate-400">{duty.department}</td>
                      <td className="py-3 px-4 font-mono text-emerald-400">{duty.hallName}</td>
                      <td className="py-3 px-4 text-xs">{duty.examDate} ({duty.timeSlot})</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          {duty.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {duty.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Malpractice Unfair Means Ledger */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                Controller of Examinations Unfair Means (UFM) Register
              </h2>
              <span className="text-xs text-red-400 font-semibold">{malpractices.length} Cases Lodged</span>
            </div>

            {malpractices.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">No malpractice or unfair means incidents reported for this session.</p>
            ) : (
              <div className="space-y-3">
                {malpractices.map((incident) => (
                  <div key={incident.id} className="p-4 bg-slate-950 border border-red-900/40 rounded-lg flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                          {incident.token}
                        </span>
                        <span className="text-sm font-semibold text-white">{incident.studentName} ({incident.studentRoll})</span>
                        <span className="text-xs text-slate-400">in {incident.hallName}</span>
                      </div>
                      <p className="text-xs text-slate-300">{incident.description}</p>
                      <p className="text-xs text-red-400"><strong>Evidence:</strong> {incident.evidenceItems.join(', ')}</p>
                    </div>

                    <div className="text-right flex flex-col justify-between">
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 inline-block self-end">
                        {incident.status}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-2">Reported by {incident.reportedByFacultyName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Malpractice Modal */}
      {showMalpracticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Lodge Malpractice Incident (UFM)
              </h3>
              <button onClick={() => setShowMalpracticeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMalpractice} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Candidate Roll Number</label>
                <input
                  type="text"
                  required
                  value={malpracticeCandidateRoll}
                  onChange={(e) => setMalpracticeCandidateRoll(e.target.value)}
                  placeholder="e.g. 21CS042"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  value={malpracticeCandidateName}
                  onChange={(e) => setMalpracticeCandidateName(e.target.value)}
                  placeholder="e.g. Rahul Gupta"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Under Examination</label>
                <select
                  value={malpracticeCourse}
                  onChange={(e) => setMalpracticeCourse(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
                >
                  <option value="CS401">CS401 - Distributed Operating Systems</option>
                  <option value="EC402">EC402 - VLSI Design & Embedded Systems</option>
                  <option value="ME301">ME301 - Fluid Mechanics & Turbomachinery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Incident Description & Circumstances</label>
                <textarea
                  required
                  rows={3}
                  value={malpracticeDescription}
                  onChange={(e) => setMalpracticeDescription(e.target.value)}
                  placeholder="Describe where material was found and observe candidate conduct..."
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confiscated Evidence Items (comma-separated)</label>
                <input
                  type="text"
                  value={malpracticeEvidence}
                  onChange={(e) => setMalpracticeEvidence(e.target.value)}
                  placeholder="e.g. 2 handwritten chits, smart watch"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-red-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMalpracticeModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition shadow"
                >
                  Issue UFM Notice & Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
