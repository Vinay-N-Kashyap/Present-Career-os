'use client';

import React, { useState } from 'react';
import {
  ElectoralPost,
  CandidateDegreeLevel,
  ElectionStage,
  ElectionRecord,
  ElectionCandidate,
  MAX_CAMPAIGN_EXPENDITURE_INR,
  MIN_ATTENDANCE_PERCENTAGE,
  INITIAL_ELECTION_RECORDS,
  initializeElectionNotification,
  registerCandidateNomination,
  finalizeCandidateScrutiny,
  auditCampaignExpenditure,
  recordPollingResults,
  certifyElectionResults,
  exportElectionAuditCSV,
} from '@/lib/admin/centralElections';

export default function CentralElectionManager() {
  const [elections, setElections] = useState<ElectionRecord[]>(INITIAL_ELECTION_RECORDS);
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedElection, setSelectedElection] = useState<ElectionRecord | null>(null);

  // Modal states
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showNominateModal, setShowNominateModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPollingModal, setShowPollingModal] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);

  // New Election Form
  const [newPost, setNewPost] = useState<ElectoralPost>('VICE_PRESIDENT');
  const [newYear, setNewYear] = useState('2026-2027');
  const [newRO, setNewRO] = useState('Prof. Aniruddha Sen (Dean of Student Affairs)');
  const [newPollingDate, setNewPollingDate] = useState('2026-09-25');
  const [newVoterCount, setNewVoterCount] = useState(4200);

  // New Nomination Form
  const [nomStudentId, setNomStudentId] = useState('');
  const [nomFullName, setNomFullName] = useState('');
  const [nomEnrollment, setNomEnrollment] = useState('');
  const [nomDept, setNomDept] = useState('');
  const [nomDegree, setNomDegree] = useState<CandidateDegreeLevel>('UNDERGRADUATE');
  const [nomAge, setNomAge] = useState(20);
  const [nomAttendance, setNomAttendance] = useState(85);
  const [nomBacklogs, setNomBacklogs] = useState(0);
  const [nomDisciplinary, setNomDisciplinary] = useState(false);

  // Expense Form
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(500);

  // Polling Form
  const [pollingVotes, setPollingVotes] = useState<{ [id: string]: number }>({});
  const [rejectedBallots, setRejectedBallots] = useState(0);

  // Error/Success Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showMsg = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // KPIs
  const totalElections = elections.length;
  const totalEligibleVoters = elections.reduce((sum, e) => sum + e.eligibleVoterCount, 0);
  const totalVotesCast = elections.reduce((sum, e) => sum + e.totalVotesCast, 0);
  const overallTurnout = totalEligibleVoters > 0 ? ((totalVotesCast / totalEligibleVoters) * 100).toFixed(1) : '0.0';
  const declaredWinners = elections.filter((e) => e.stage === 'RESULTS_DECLARED').length;

  // Filter
  const filteredElections = selectedStage === 'ALL'
    ? elections
    : elections.filter((e) => e.stage === selectedStage);

  // Handlers
  const handleCreateElection = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = initializeElectionNotification({
        post: newPost,
        academicYear: newYear,
        returningOfficerName: newRO,
        pollingDate: newPollingDate,
        eligibleVoterCount: Number(newVoterCount),
      });
      setElections([created, ...elections]);
      setShowNotifyModal(false);
      showMsg(`Election notification issued for post of ${newPost} (${created.certificateToken}).`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleRegisterNomination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElection) return;
    try {
      const updated = registerCandidateNomination(selectedElection, {
        studentId: nomStudentId.trim(),
        fullName: nomFullName.trim(),
        enrollmentNumber: nomEnrollment.trim(),
        department: nomDept.trim(),
        degreeLevel: nomDegree,
        ageYears: Number(nomAge),
        attendancePercentage: Number(nomAttendance),
        academicBacklogs: Number(nomBacklogs),
        hasDisciplinaryAction: nomDisciplinary,
        campaignExpenditureInr: 0,
      });
      setElections(elections.map((item) => (item.electionId === updated.electionId ? updated : item)));
      setSelectedElection(updated);
      setShowNominateModal(false);
      const addedCandidate = updated.candidates[updated.candidates.length - 1];
      if (addedCandidate.isScrutinyApproved) {
        showMsg(`Nomination filed & approved under Lyngdoh criteria for ${addedCandidate.fullName}.`, 'success');
      } else {
        showMsg(`Nomination scrutinized: DISQUALIFIED (${addedCandidate.disqualificationReason}).`, 'error');
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleFinalizeScrutiny = (election: ElectionRecord) => {
    try {
      const updated = finalizeCandidateScrutiny(election);
      setElections(elections.map((item) => (item.electionId === updated.electionId ? updated : item)));
      showMsg(`Scrutiny finalized for ${election.post}. Ballot list locked for campaigning.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleAuditExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElection || !selectedCandidateId) return;
    const candidate = selectedElection.candidates.find((c) => c.candidateId === selectedCandidateId);
    if (!candidate) return;

    const audit = auditCampaignExpenditure(candidate, Number(expenseAmount));
    if (!audit.approved) {
      showMsg(audit.reason || 'Expense ceiling breached!', 'error');
      return;
    }

    const updatedCandidates = selectedElection.candidates.map((c) =>
      c.candidateId === selectedCandidateId
        ? { ...c, campaignExpenditureInr: audit.totalExpenditureInr }
        : c
    );
    const updated = { ...selectedElection, candidates: updatedCandidates };
    setElections(elections.map((item) => (item.electionId === updated.electionId ? updated : item)));
    setSelectedElection(updated);
    setShowExpenseModal(false);
    showMsg(`Campaign expense of ₹${expenseAmount} logged (Total: ₹${audit.totalExpenditureInr}/${MAX_CAMPAIGN_EXPENDITURE_INR}).`, 'success');
  };

  const handleRecordPolling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedElection) return;
    try {
      const updated = recordPollingResults(selectedElection, pollingVotes, Number(rejectedBallots));
      setElections(elections.map((item) => (item.electionId === updated.electionId ? updated : item)));
      setSelectedElection(updated);
      setShowPollingModal(false);
      showMsg(`Secret ballot polling votes successfully recorded and verified.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleCertifyResults = (election: ElectionRecord) => {
    try {
      const updated = certifyElectionResults(election);
      setElections(elections.map((item) => (item.electionId === updated.electionId ? updated : item)));
      const winner = updated.candidates.find((c) => c.candidateId === updated.declaredWinnerCandidateId);
      showMsg(`Election certified! Declared Winner: ${winner?.fullName || 'Candidate'} with ${winner?.votesReceived} votes.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    const csv = exportElectionAuditCSV(elections);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Election_Ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('Student Council Election Ledger CSV exported successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🗳️</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Central Student Election & Campus Council Representation Console
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Statutory Compliance: Lyngdoh Committee Recommendations (Supreme Court Order), Model Code of Conduct & University Representation Acts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotifyModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>📢</span> Issue Notification
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>📥</span> Export Ledger CSV
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Electoral Posts</div>
          <div className="text-2xl font-bold text-white mt-2">{totalElections}</div>
          <div className="text-slate-500 text-xs mt-1">Active Council Portfolios</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Eligible Campus Voters</div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">{totalEligibleVoters.toLocaleString()}</div>
          <div className="text-slate-500 text-xs mt-1">Full-time Registered Scholars</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Aggregate Voter Turnout</div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{overallTurnout}%</div>
          <div className="text-slate-500 text-xs mt-1">{totalVotesCast.toLocaleString()} Total Ballots Polled</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Declared Council Reps</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{declaredWinners}</div>
          <div className="text-slate-500 text-xs mt-1">Certified by Returning Officer</div>
        </div>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'NOTIFICATION_ISSUED', 'NOMINATIONS_OPEN', 'SCRUTINY_COMPLETED', 'CAMPAIGN_PERIOD', 'POLLING_ACTIVE', 'RESULTS_DECLARED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStage(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedStage === st
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Elections List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredElections.map((election) => {
          const turnoutPct = election.eligibleVoterCount > 0
            ? ((election.totalVotesCast / election.eligibleVoterCount) * 100).toFixed(1)
            : '0.0';

          return (
            <div
              key={election.electionId}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm"
            >
              {/* Card Top Banner */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded text-xs font-semibold">
                      {election.post.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {election.certificateToken}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                      {election.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-1">
                    Student Council Election: {election.post.replace(/_/g, ' ')} ({election.academicYear})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Returning Officer: <span className="text-slate-200">{election.returningOfficerName}</span> | Polling Date: <span className="text-slate-200">{election.pollingDate}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(election.stage === 'NOTIFICATION_ISSUED' || election.stage === 'NOMINATIONS_OPEN') && (
                    <button
                      onClick={() => {
                        setSelectedElection(election);
                        setShowNominateModal(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition"
                    >
                      + File Nomination
                    </button>
                  )}
                  {election.stage === 'NOMINATIONS_OPEN' && (
                    <button
                      onClick={() => handleFinalizeScrutiny(election)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition"
                    >
                      Finalize Scrutiny
                    </button>
                  )}
                  {(election.stage === 'SCRUTINY_COMPLETED' || election.stage === 'CAMPAIGN_PERIOD') && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedElection(election);
                          setShowExpenseModal(true);
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition"
                      >
                        Audit Expenses
                      </button>
                      <button
                        onClick={() => {
                          setSelectedElection(election);
                          // Initialize polling votes state
                          const initialVotes: { [id: string]: number } = {};
                          election.candidates.forEach((c) => {
                            initialVotes[c.candidateId] = c.votesReceived || 0;
                          });
                          setPollingVotes(initialVotes);
                          setRejectedBallots(election.rejectedBallotsCount || 0);
                          setShowPollingModal(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium transition"
                      >
                        Record Ballot Polling
                      </button>
                    </>
                  )}
                  {election.stage === 'POLLING_ACTIVE' && (
                    <button
                      onClick={() => handleCertifyResults(election)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition"
                    >
                      Certify Results & Declare Winner
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedElection(election);
                      setShowSealModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-medium transition"
                  >
                    View Cryptographic Seal
                  </button>
                </div>
              </div>

              {/* Turnout Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Polling Turnout Progress ({election.totalVotesCast.toLocaleString()} / {election.eligibleVoterCount.toLocaleString()} Voters)</span>
                  <span className="font-semibold text-slate-200">{turnoutPct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(Number(turnoutPct), 100)}%` }}
                  />
                </div>
              </div>

              {/* Candidates Ledger */}
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Nominated Candidates & Scrutiny Records ({election.candidates.length})
                </div>

                {election.candidates.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    No nominations filed yet. Click "+ File Nomination" to file under Lyngdoh Committee criteria.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {election.candidates.map((c) => {
                      const isWinner = election.declaredWinnerCandidateId === c.candidateId;
                      return (
                        <div
                          key={c.candidateId}
                          className={`p-4 rounded-xl border space-y-3 ${
                            isWinner
                              ? 'bg-emerald-950/30 border-emerald-700'
                              : c.isScrutinyApproved
                              ? 'bg-slate-950 border-slate-800'
                              : 'bg-rose-950/20 border-rose-900/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                                {c.fullName}
                                {isWinner && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                                    🏆 ELECTED
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">{c.enrollmentNumber} • {c.department}</div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                c.isScrutinyApproved
                                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800'
                                  : 'bg-rose-900/40 text-rose-300 border border-rose-800'
                              }`}
                            >
                              {c.isScrutinyApproved ? 'APPROVED' : 'DISQUALIFIED'}
                            </span>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                            <div>
                              <div className="text-slate-500">Degree</div>
                              <div className="text-slate-200 font-medium capitalize">{c.degreeLevel.toLowerCase()}</div>
                            </div>
                            <div>
                              <div className="text-slate-500">Age</div>
                              <div className="text-slate-200 font-medium">{c.ageYears} yrs</div>
                            </div>
                            <div>
                              <div className="text-slate-500">Attendance</div>
                              <div className={`font-medium ${c.attendancePercentage >= MIN_ATTENDANCE_PERCENTAGE ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {c.attendancePercentage}%
                              </div>
                            </div>
                          </div>

                          {/* Disqualification Reason */}
                          {!c.isScrutinyApproved && c.disqualificationReason && (
                            <div className="text-[11px] text-rose-300 bg-rose-950/60 p-2 rounded border border-rose-900/60">
                              ⚠️ {c.disqualificationReason}
                            </div>
                          )}

                          {/* Campaign Expenditure & Votes */}
                          {c.isScrutinyApproved && (
                            <div className="space-y-1.5 pt-1 border-t border-slate-800/80 text-[11px]">
                              <div className="flex justify-between text-slate-400">
                                <span>Campaign Spend (₹5,000 cap):</span>
                                <span className="font-semibold text-slate-200">₹{c.campaignExpenditureInr}</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full ${c.campaignExpenditureInr > MAX_CAMPAIGN_EXPENDITURE_INR * 0.9 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                  style={{ width: `${Math.min((c.campaignExpenditureInr / MAX_CAMPAIGN_EXPENDITURE_INR) * 100, 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center pt-1">
                                <span className="text-slate-400">Votes Polled:</span>
                                <span className="text-sm font-bold text-indigo-400">{c.votesReceived.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Issue New Notification */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">📢 Issue Election Notification</h3>
            <form onSubmit={handleCreateElection} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Electoral Post</label>
                <select
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value as ElectoralPost)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                >
                  <option value="PRESIDENT">PRESIDENT</option>
                  <option value="VICE_PRESIDENT">VICE PRESIDENT</option>
                  <option value="GENERAL_SECRETARY">GENERAL SECRETARY</option>
                  <option value="JOINT_SECRETARY">JOINT SECRETARY</option>
                  <option value="ACADEMIC_COUNCIL_REP">ACADEMIC COUNCIL REP</option>
                  <option value="FACULTY_SPORTS_REP">FACULTY SPORTS REP</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Academic Year</label>
                <input
                  type="text"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Returning Officer</label>
                <input
                  type="text"
                  value={newRO}
                  onChange={(e) => setNewRO(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Polling Date</label>
                <input
                  type="date"
                  value={newPollingDate}
                  onChange={(e) => setNewPollingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Eligible Voter Roll Count</label>
                <input
                  type="number"
                  value={newVoterCount}
                  onChange={(e) => setNewVoterCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNotifyModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Issue Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: File Nomination */}
      {showNominateModal && selectedElection && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white">
              📝 File Nomination: {selectedElection.post.replace(/_/g, ' ')}
            </h3>
            <p className="text-xs text-slate-400">
              Scrutinized automatically under Lyngdoh Committee statutory criteria (Age, Attendance $\ge 75\%$, 0 Backlogs, Clean Conduct).
            </p>
            <form onSubmit={handleRegisterNomination} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Student ID</label>
                  <input
                    type="text"
                    value={nomStudentId}
                    onChange={(e) => setNomStudentId(e.target.value)}
                    placeholder="e.g. STU-2023-CS-010"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={nomFullName}
                    onChange={(e) => setNomFullName(e.target.value)}
                    placeholder="Candidate full legal name"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    value={nomEnrollment}
                    onChange={(e) => setNomEnrollment(e.target.value)}
                    placeholder="e.g. 2023CSB010"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    value={nomDept}
                    onChange={(e) => setNomDept(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Degree Level</label>
                  <select
                    value={nomDegree}
                    onChange={(e) => setNomDegree(e.target.value as CandidateDegreeLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="UNDERGRADUATE">UG (17-22 yrs)</option>
                    <option value="POSTGRADUATE">PG (up to 25 yrs)</option>
                    <option value="RESEARCH_SCHOLAR">Scholar (up to 28 yrs)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={nomAge}
                    onChange={(e) => setNomAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Attendance %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={nomAttendance}
                    onChange={(e) => setNomAttendance(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Active Backlogs / Arrears</label>
                  <input
                    type="number"
                    value={nomBacklogs}
                    onChange={(e) => setNomBacklogs(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={nomDisciplinary}
                      onChange={(e) => setNomDisciplinary(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600"
                    />
                    <span>Has Disciplinary Penalty</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNominateModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                >
                  Submit Nomination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Audit Campaign Expense */}
      {showExpenseModal && selectedElection && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">💰 Audit Campaign Expenditure</h3>
            <p className="text-xs text-slate-400">
              Statutory Lyngdoh Ceiling: Maximum ₹{MAX_CAMPAIGN_EXPENDITURE_INR} per candidate across handbills and stationery.
            </p>
            <form onSubmit={handleAuditExpense} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Candidate</label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                >
                  <option value="">-- Choose Candidate --</option>
                  {selectedElection.candidates
                    .filter((c) => c.isScrutinyApproved)
                    .map((c) => (
                      <option key={c.candidateId} value={c.candidateId}>
                        {c.fullName} (Current Spend: ₹{c.campaignExpenditureInr})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Additional Bill / Receipt Expense (INR)</label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium"
                >
                  Verify & Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Record Polling Results */}
      {showPollingModal && selectedElection && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🗳️ Record Secret Ballot Polling</h3>
            <p className="text-xs text-slate-400">
              Enter verified vote counts tallied from sealed ballot boxes under returning officer supervision.
            </p>
            <form onSubmit={handleRecordPolling} className="space-y-3 text-xs">
              {selectedElection.candidates
                .filter((c) => c.isScrutinyApproved)
                .map((c) => (
                  <div key={c.candidateId}>
                    <label className="text-slate-300 block mb-1 font-medium">{c.fullName} ({c.department})</label>
                    <input
                      type="number"
                      value={pollingVotes[c.candidateId] || 0}
                      onChange={(e) =>
                        setPollingVotes({
                          ...pollingVotes,
                          [c.candidateId]: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      required
                    />
                  </div>
                ))}
              <div>
                <label className="text-slate-400 block mb-1">Invalid / Rejected Ballots</label>
                <input
                  type="number"
                  value={rejectedBallots}
                  onChange={(e) => setRejectedBallots(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPollingModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
                >
                  Save Polling Tally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Cryptographic Seal Inspector */}
      {showSealModal && selectedElection && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔐</span> Tamper-Proof Cryptographic Election Seal
            </h3>
            <p className="text-xs text-slate-400">
              Immutable SHA-256 digest generated from election stage, returning officer, vote count, and winner certification.
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
              {selectedElection.cryptographicElectionSeal || 'PENDING_SEAL'}
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <div><strong className="text-slate-300">Tracking Token:</strong> {selectedElection.certificateToken}</div>
              <div><strong className="text-slate-300">Returning Officer:</strong> {selectedElection.returningOfficerName}</div>
              <div><strong className="text-slate-300">Stage:</strong> {selectedElection.stage}</div>
              <div><strong className="text-slate-300">Last Verified:</strong> {selectedElection.lastUpdated}</div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSealModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
