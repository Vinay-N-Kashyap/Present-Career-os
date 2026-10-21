'use client';

import React, { useState } from 'react';
import {
  SportsDiscipline,
  SportsAchievementTier,
  QuotaAdmissionStage,
  SportsQuotaApplicant,
  INITIAL_SPORTS_APPLICANTS,
  SPORTS_TIER_POINTS_MATRIX,
  MIN_TRIAL_QUALIFYING_SCORE,
  registerSportsApplicant,
  recordFitnessTrials,
  offerSportsQuotaAdmission,
  confirmSportsAdmission,
  exportSportsQuotaLedgerCSV,
} from '@/lib/admin/centralSports';
import { useGovernanceStore } from '@/lib/hooks/useGovernanceStore';

export default function CentralSportsManager() {
  const {
    records: applicants,
    setRecords: setApplicants,
    syncSource,
    isSaving,
    saveRecord
  } = useGovernanceStore<SportsQuotaApplicant>(
    'central_sports_quota',
    INITIAL_SPORTS_APPLICANTS,
    'applicantId'
  );
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [selectedApplicant, setSelectedApplicant] = useState<SportsQuotaApplicant | null>(null);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTrialsModal, setShowTrialsModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);

  // Register Form State
  const [newName, setNewName] = useState('');
  const [newAppNo, setNewAppNo] = useState('');
  const [newDisc, setNewDisc] = useState<SportsDiscipline>('ATHLETICS');
  const [newTier, setNewTier] = useState<SportsAchievementTier>('TIER_2_ALL_INDIA_AIU');
  const [newTournament, setNewTournament] = useState('');
  const [newAuthority, setNewAuthority] = useState('Association of Indian Universities (AIU)');
  const [newCertYear, setNewCertYear] = useState(new Date().getFullYear());
  const [newDept, setNewDept] = useState('Computer Science & Engineering');

  // Trials Form State
  const [sprintSec, setSprintSec] = useState(6.5);
  const [jumpMeters, setJumpMeters] = useState(2.5);
  const [runMins, setRunMins] = useState(3.2);
  const [skillScore, setSkillScore] = useState(40);
  const [fitnessScore, setFitnessScore] = useState(40);

  // Offer Modal State
  const [scholarshipInr, setScholarshipInr] = useState(35000);

  // Feedback Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showMsg = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // KPIs
  const totalApplicants = applicants.length;
  const eliteMedalists = applicants.filter(
    (a) => a.achievementTier === 'TIER_1_INTERNATIONAL' || a.achievementTier === 'TIER_2_ALL_INDIA_AIU'
  ).length;
  const elitePct = totalApplicants > 0 ? ((eliteMedalists / totalApplicants) * 100).toFixed(0) : '0';
  const seatsOffered = applicants.filter(
    (a) => a.stage === 'MERIT_SEAT_OFFERED' || a.stage === 'ADMISSION_CONFIRMED'
  ).length;
  const totalScholarship = applicants.reduce((sum, a) => sum + a.sportsScholarshipAwardedInr, 0);

  // Filters
  const filteredApplicants = selectedDiscipline === 'ALL'
    ? applicants
    : applicants.filter((a) => a.sportsDiscipline === selectedDiscipline);

  // Handlers
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = registerSportsApplicant({
        fullName: newName,
        enrollmentOrAppNo: newAppNo,
        sportsDiscipline: newDisc,
        achievementTier: newTier,
        highestTournamentName: newTournament,
        certificateIssuingAuthority: newAuthority,
        certificateYear: Number(newCertYear),
        departmentApplied: newDept,
      });

      setApplicants([created, ...applicants]);
      await saveRecord(created);
      setShowRegisterModal(false);
      showMsg(`Registered sports quota applicant ${created.fullName} (${created.trackingToken}) with ${created.baseAchievementPoints} base merit points.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleRecordTrials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant) return;
    try {
      const updated = recordFitnessTrials(selectedApplicant, {
        sprint50mSeconds: Number(sprintSec),
        standingBroadJumpMeters: Number(jumpMeters),
        enduranceRun1000mMinutes: Number(runMins),
        skillTrialScore: Number(skillScore),
        fitnessTrialScore: Number(fitnessScore),
      });

      setApplicants(applicants.map((a) => (a.applicantId === updated.applicantId ? updated : a)));
      setSelectedApplicant(updated);
      await saveRecord(updated);
      setShowTrialsModal(false);
      if (updated.trialMetrics?.isTrialQualified) {
        showMsg(`Trials passed! Composite sports merit score: ${updated.compositeSportsMeritScore}/100.`, 'success');
      } else {
        showMsg(`Trials failed: Score below qualifying hurdle (${MIN_TRIAL_QUALIFYING_SCORE}).`, 'error');
      }
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleOfferAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant) return;
    try {
      const updated = offerSportsQuotaAdmission(selectedApplicant, Number(scholarshipInr));
      setApplicants(applicants.map((a) => (a.applicantId === updated.applicantId ? updated : a)));
      setSelectedApplicant(updated);
      await saveRecord(updated);
      setShowOfferModal(false);
      showMsg(`Supernumerary sports quota seat offered with ₹${scholarshipInr} annual sports scholarship.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleConfirmAdmission = async (applicant: SportsQuotaApplicant) => {
    try {
      const updated = confirmSportsAdmission(applicant);
      setApplicants(applicants.map((a) => (a.applicantId === updated.applicantId ? updated : a)));
      await saveRecord(updated);
      showMsg(`Sports quota admission confirmed for ${updated.fullName}!`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    const csv = exportSportsQuotaLedgerCSV(applicants);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sports_Quota_Admission_Ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('Sports Quota Admission Ledger CSV exported successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏅</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Central University Sports Quota & Inter-University Tournament Console
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Statutory Compliance: AIU Inter-University Sports Board, National Sports Development Code & 5% Supernumerary Quota Regulations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${syncSource === 'supabase' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{syncSource === 'supabase' ? 'Live Supabase DB' : syncSource === 'local_storage' ? 'Local Persistence' : 'Runtime Cache'}</span>
            {isSaving && <span className="text-cyan-400 ml-1">(saving...)</span>}
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>+</span> Register Sports Applicant
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>📥</span> Export Sports CSV
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
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Sports Applicants</div>
          <div className="text-2xl font-bold text-white mt-2">{totalApplicants}</div>
          <div className="text-slate-500 text-xs mt-1">Active Quota Dossiers</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">AIU / National Elite Athletes</div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{elitePct}%</div>
          <div className="text-slate-500 text-xs mt-1">{eliteMedalists} Tier 1 & 2 Medalists</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Supernumerary Seats Offered</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{seatsOffered}</div>
          <div className="text-slate-500 text-xs mt-1">Within 5% Departmental Cap</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Scholarship Commitments</div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">₹{totalScholarship.toLocaleString()}</div>
          <div className="text-slate-500 text-xs mt-1">Performance Aid Disbursed</div>
        </div>
      </div>

      {/* Discipline Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'BASKETBALL', 'SWIMMING', 'ATHLETICS', 'CRICKET', 'FOOTBALL', 'BADMINTON', 'TABLE_TENNIS', 'CHESS'].map((disc) => (
          <button
            key={disc}
            onClick={() => setSelectedDiscipline(disc)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedDiscipline === disc
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {disc.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Applicants List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredApplicants.map((a) => {
          const isConfirmed = a.stage === 'ADMISSION_CONFIRMED';
          const isOffered = a.stage === 'MERIT_SEAT_OFFERED';
          const isRejected = a.stage === 'APPLICATION_REJECTED';

          return (
            <div
              key={a.applicantId}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-amber-950 border border-amber-800 text-amber-300 rounded text-xs font-semibold">
                      {a.sportsDiscipline.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{a.trackingToken}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                      {a.achievementTier.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        isConfirmed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isOffered
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : isRejected
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {a.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-1.5">{a.fullName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    App No: <span className="text-slate-200 font-mono">{a.enrollmentOrAppNo}</span> | Tournament: <span className="text-slate-200 font-medium">{a.highestTournamentName}</span> ({a.certificateYear}) | Dept: <span className="text-slate-200">{a.departmentApplied}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {a.stage === 'APPLICATION_FILED' && (
                    <button
                      onClick={() => {
                        setSelectedApplicant(a);
                        setShowTrialsModal(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition"
                    >
                      Conduct Fitness Trials
                    </button>
                  )}
                  {a.stage === 'FITNESS_TRIALS_COMPLETED' && (
                    <button
                      onClick={() => {
                        setSelectedApplicant(a);
                        setShowOfferModal(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition"
                    >
                      Offer Supernumerary Seat
                    </button>
                  )}
                  {a.stage === 'MERIT_SEAT_OFFERED' && (
                    <button
                      onClick={() => handleConfirmAdmission(a)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition"
                    >
                      Confirm Admission
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedApplicant(a);
                      setShowSealModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-medium transition"
                  >
                    View Cryptographic Seal
                  </button>
                </div>
              </div>

              {/* Merit Score Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Base Certificate Points (50%)</div>
                  <div className="text-xl font-bold text-white mt-1">{a.baseAchievementPoints} pts</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Weighted: {(a.baseAchievementPoints * 0.5).toFixed(1)}</div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Fitness & Skill Trials (50%)</div>
                  <div className="text-xl font-bold text-indigo-400 mt-1">
                    {a.trialMetrics ? `${a.trialMetrics.totalTrialScore} / 100` : 'Pending'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {a.trialMetrics ? `Weighted: ${(a.trialMetrics.totalTrialScore * 0.5).toFixed(1)}` : 'Hurdle: ≥ 50'}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-400">Composite Sports Merit Score</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{a.compositeSportsMeritScore} / 100</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Scholarship: ₹{a.sportsScholarshipAwardedInr.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Trials Telemetry */}
              {a.trialMetrics && (
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1">
                  <div className="font-semibold text-slate-300">Physical Fitness & Skill Measurements:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-slate-400 pt-1">
                    <div>Sprint 50m: <span className="text-white font-medium">{a.trialMetrics.sprint50mSeconds}s</span></div>
                    <div>Broad Jump: <span className="text-white font-medium">{a.trialMetrics.standingBroadJumpMeters}m</span></div>
                    <div>1000m Endurance: <span className="text-white font-medium">{a.trialMetrics.enduranceRun1000mMinutes}m</span></div>
                    <div>Skill Test: <span className="text-white font-medium">{a.trialMetrics.skillTrialScore}/50</span></div>
                    <div>Fitness Score: <span className="text-white font-medium">{a.trialMetrics.fitnessTrialScore}/50</span></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal 1: Register Applicant */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🏅 Register Sports Quota Applicant</h3>
            <p className="text-xs text-slate-400">
              National Sports Development Code of India & 5% Supernumerary Reservation Quota.
            </p>
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Athlete legal name"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Application / Enrollment No</label>
                  <input
                    type="text"
                    value={newAppNo}
                    onChange={(e) => setNewAppNo(e.target.value)}
                    placeholder="e.g. SPRT-APP-2026-050"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Sports Discipline</label>
                  <select
                    value={newDisc}
                    onChange={(e) => setNewDisc(e.target.value as SportsDiscipline)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="ATHLETICS">ATHLETICS</option>
                    <option value="BASKETBALL">BASKETBALL</option>
                    <option value="BADMINTON">BADMINTON</option>
                    <option value="CRICKET">CRICKET</option>
                    <option value="FOOTBALL">FOOTBALL</option>
                    <option value="SWIMMING">SWIMMING</option>
                    <option value="TABLE_TENNIS">TABLE TENNIS</option>
                    <option value="VOLLEYBALL">VOLLEYBALL</option>
                    <option value="CHESS">CHESS</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Achievement Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as SportsAchievementTier)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="TIER_1_INTERNATIONAL">Tier 1: International Medalist (100 pts)</option>
                    <option value="TIER_2_ALL_INDIA_AIU">Tier 2: All India AIU / Sr National (85 pts)</option>
                    <option value="TIER_3_ZONAL_INTER_UNIV">Tier 3: Zonal AIU / State Champ (65 pts)</option>
                    <option value="TIER_4_INTER_COLLEGIATE">Tier 4: Inter-Collegiate (45 pts)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Highest Tournament Name</label>
                <input
                  type="text"
                  value={newTournament}
                  onChange={(e) => setNewTournament(e.target.value)}
                  placeholder="e.g. All India Inter-University Basketball Championship"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-slate-400 block mb-1">Certificate Issuing Authority</label>
                  <input
                    type="text"
                    value={newAuthority}
                    onChange={(e) => setNewAuthority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Year</label>
                  <input
                    type="number"
                    value={newCertYear}
                    onChange={(e) => setNewCertYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Department Applied For</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Register Applicant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Fitness Trials */}
      {showTrialsModal && selectedApplicant && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🏃 Record Fitness & Skill Trials</h3>
            <p className="text-xs text-slate-400">
              Candidate must score minimum 50 / 100 in physical fitness & sports skills testing.
            </p>
            <form onSubmit={handleRecordTrials} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Sprint 50m (s)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sprintSec}
                    onChange={(e) => setSprintSec(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Broad Jump (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={jumpMeters}
                    onChange={(e) => setJumpMeters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">1000m Run (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={runMins}
                    onChange={(e) => setRunMins(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Sports Skill Score (0-50)</label>
                  <input
                    type="number"
                    value={skillScore}
                    onChange={(e) => setSkillScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Fitness Score (0-50)</label>
                  <input
                    type="number"
                    value={fitnessScore}
                    onChange={(e) => setFitnessScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTrialsModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium"
                >
                  Save Trials & Compute Merit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Offer Admission */}
      {showOfferModal && selectedApplicant && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🎓 Offer Supernumerary Admission</h3>
            <p className="text-xs text-slate-400">
              Confirm departmental allocation under 5% quota ceiling and award sports scholarship.
            </p>
            <form onSubmit={handleOfferAdmission} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Annual Sports Scholarship Amount (INR)</label>
                <input
                  type="number"
                  value={scholarshipInr}
                  onChange={(e) => setScholarshipInr(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Offer Admission Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Cryptographic Seal Inspector */}
      {showSealModal && selectedApplicant && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔐</span> Tamper-Proof Cryptographic Sports Seal
            </h3>
            <p className="text-xs text-slate-400">
              Immutable SHA-256 digest bound to athlete identity, AIU achievement tier, trial metrics, and composite merit score.
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
              {selectedApplicant.cryptographicSeal || 'PENDING_SEAL'}
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <div><strong className="text-slate-300">Tracking Token:</strong> {selectedApplicant.trackingToken}</div>
              <div><strong className="text-slate-300">Athlete:</strong> {selectedApplicant.fullName}</div>
              <div><strong className="text-slate-300">Stage:</strong> {selectedApplicant.stage}</div>
              <div><strong className="text-slate-300">Last Verified:</strong> {selectedApplicant.lastUpdated}</div>
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
