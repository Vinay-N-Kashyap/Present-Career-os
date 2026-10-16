'use client';

import React, { useState, useMemo } from 'react';
import { 
  CourseSyllabus, 
  WeeklyLessonPlan, 
  createCourseSyllabus, 
  recordWeeklyProgress, 
  computeSyllabusVelocity, 
  exportLessonPlanCSV 
} from '@/lib/teacher/syllabus';

interface SyllabusPlannerStudioProps {
  institutionId?: string;
  facultyId?: string;
}

export const SyllabusPlannerStudio: React.FC<SyllabusPlannerStudioProps> = ({
  institutionId = 'inst-apex-001',
  facultyId = 'fac-prof-rao',
}) => {
  // Mock 16-week baseline for CS401 Distributed Systems
  const initialSyllabus = useMemo(() => {
    const weeklyPlan: WeeklyLessonPlan[] = [
      { weekNumber: 1, moduleId: 'mod-1', theme: 'System Models & RPC Handshakes', topicsCovered: ['Fallacies of distributed computing', 'Synchronous vs asynchronous networks'], labPracticalTopics: ['gRPC & Protobuf compilation'], plannedHours: 4, deliveredHours: 4, status: 'COMPLETED' },
      { weekNumber: 2, moduleId: 'mod-1', theme: 'Clock Synchronization & Logical Clocks', topicsCovered: ['Lamport timestamps', 'Vector clocks', 'Causal consistency'], labPracticalTopics: ['Vector clock causality tracker in Go'], plannedHours: 4, deliveredHours: 4, status: 'COMPLETED' },
      { weekNumber: 3, moduleId: 'mod-1', theme: 'State Machine Replication', topicsCovered: ['Deterministic state transitions', 'Log replication topology'], labPracticalTopics: ['Deterministic transaction playback'], plannedHours: 4, deliveredHours: 4, status: 'COMPLETED' },
      { weekNumber: 4, moduleId: 'mod-2', theme: 'Consensus Basics: 2PC & 3PC', topicsCovered: ['Two-Phase Commit', 'Coordinator failure modes', 'Blocking drawbacks'], labPracticalTopics: ['2PC simulator with node partition'], plannedHours: 4, deliveredHours: 4, status: 'COMPLETED' },
      { weekNumber: 5, moduleId: 'mod-2', theme: 'Paxos & Viewstamped Replication', topicsCovered: ['Single-decree Paxos', 'Multi-Paxos leader leases'], labPracticalTopics: ['Paxos proposer-acceptor harness'], plannedHours: 4, deliveredHours: 3, status: 'IN_PROGRESS' },
      { weekNumber: 6, moduleId: 'mod-2', theme: 'Raft Consensus Protocol I', topicsCovered: ['Leader election', 'Heartbeats & randomized election timeouts'], labPracticalTopics: ['Raft election state machine'], plannedHours: 4, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 7, moduleId: 'mod-2', theme: 'Raft Consensus Protocol II', topicsCovered: ['Log matching invariant', 'Commit index safety'], labPracticalTopics: ['Raft log compaction & snapshots'], plannedHours: 4, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 8, moduleId: 'mod-3', theme: 'Midterm Review & Milestone 1 Audit', topicsCovered: ['Formal proof review', 'Midterm examination'], labPracticalTopics: ['Milestone 1 Code Review'], plannedHours: 3, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 9, moduleId: 'mod-3', theme: 'Distributed Transactions & Isolation', topicsCovered: ['Serializability vs Linearizability', 'Snapshot Isolation'], labPracticalTopics: ['MVCC timestamp ordering engine'], plannedHours: 4, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 10, moduleId: 'mod-3', theme: 'Distributed Key-Value Stores', topicsCovered: ['Consistent Hashing', 'Virtual nodes', 'Dynamo paper invariants'], labPracticalTopics: ['Consistent hashing ring in C++'], plannedHours: 4, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 11, moduleId: 'mod-4', theme: 'Quorum Systems & Anti-Entropy', topicsCovered: ['Read/Write quorums (R + W > N)', 'Sloppy quorums & hinted handoff'], labPracticalTopics: ['Merkle tree anti-entropy gossip'], plannedHours: 4, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 12, moduleId: 'mod-4', theme: 'Conflict Resolution: CRDTs', topicsCovered: ['State-based vs Operation-based CRDTs', 'Pn-Counters', 'LWW-Element-Set'], labPracticalTopics: ['Collaborative text editing buffer'], plannedHours: 4, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 13, moduleId: 'mod-4', theme: 'Byzantine Fault Tolerance (BFT)', topicsCovered: ['Byzantine generals dilemma', 'PBFT 3-phase commit (Pre-prepare, Prepare, Commit)'], labPracticalTopics: ['PBFT network simulation with malicious nodes'], plannedHours: 4, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 14, moduleId: 'mod-5', theme: 'Distributed Stream Processing', topicsCovered: ['Event time vs processing time', 'Watermarks & windowing'], labPracticalTopics: ['Sliding window aggregator'], plannedHours: 4, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 15, moduleId: 'mod-5', theme: 'Chaos Engineering & Failure Injection', topicsCovered: ['Network partitions (Jepsen-style)', 'Split-brain recovery'], labPracticalTopics: ['Chaos monkey node killer'], plannedHours: 4, deliveredHours: 0, status: 'SCHEDULED' },
      { weekNumber: 16, moduleId: 'mod-5', theme: 'Capstone Presentations & Final Evaluation', topicsCovered: ['Peer architecture reviews', 'Final Capstone Project Defense'], labPracticalTopics: ['Production benchmark evaluation'], plannedHours: 5, deliveredHours: 0, status: 'SCHEDULED' },
    ];

    return createCourseSyllabus({
      institutionId,
      facultyId,
      courseCode: 'CS401',
      courseTitle: 'Distributed Systems Architecture & Consensus',
      department: 'Computer Science & Engineering',
      semester: 6,
      academicYear: '2026-2027',
      totalCredits: 4,
      lectureCredits: 3,
      labCredits: 1, // 3*15 + 1*30 = 45 + 15 = 60 hours
      clos: [
        { cloId: 'clo-1', code: 'CLO-1', description: 'Model distributed synchronization using vector clocks and Lamport timestamps', bloomTaxonomyLevel: 'APPLY', mappedProgramOutcomes: ['PO-1', 'PO-2'] },
        { cloId: 'clo-2', code: 'CLO-2', description: 'Implement state machine replication via Paxos and Raft consensus', bloomTaxonomyLevel: 'CREATE', mappedProgramOutcomes: ['PO-3', 'PO-5'] },
        { cloId: 'clo-3', code: 'CLO-3', description: 'Design conflict-free replicated data types and linearizable quorums', bloomTaxonomyLevel: 'EVALUATE', mappedProgramOutcomes: ['PO-4'] },
      ],
      modules: [
        { moduleId: 'mod-1', moduleNumber: 1, title: 'Foundations & Logical Clocks', plannedLectureHours: 9, plannedLabHours: 3, learningOutcomes: ['CLO-1'], keyTopics: ['RPC', 'Clocks', 'Replication'] },
        { moduleId: 'mod-2', moduleNumber: 2, title: 'Consensus & Raft Protocol', plannedLectureHours: 12, plannedLabHours: 4, learningOutcomes: ['CLO-2'], keyTopics: ['2PC', 'Paxos', 'Raft'] },
        { moduleId: 'mod-3', moduleNumber: 3, title: 'Transactions & Distributed Storage', plannedLectureHours: 9, plannedLabHours: 3, learningOutcomes: ['CLO-2'], keyTopics: ['Serializability', 'Dynamo'] },
        { moduleId: 'mod-4', moduleNumber: 4, title: 'Quorums, CRDTs & BFT', plannedLectureHours: 9, plannedLabHours: 3, learningOutcomes: ['CLO-3'], keyTopics: ['Quorums', 'CRDTs', 'PBFT'] },
        { moduleId: 'mod-5', moduleNumber: 5, title: 'Streaming, Chaos & Capstone', plannedLectureHours: 9, plannedLabHours: 4, learningOutcomes: ['CLO-3'], keyTopics: ['Streams', 'Chaos', 'Capstone'] },
      ],
      weeklyPlan,
    });
  }, [institutionId, facultyId]);

  const [syllabus, setSyllabus] = useState<CourseSyllabus>(initialSyllabus);
  const [targetWeek, setTargetWeek] = useState<number>(5);

  const velocity = useMemo(() => {
    return computeSyllabusVelocity(syllabus, targetWeek);
  }, [syllabus, targetWeek]);

  const handleUpdateHours = (weekNumber: number, hours: number) => {
    const updated = recordWeeklyProgress(
      { ...syllabus, weeklyPlan: [...syllabus.weeklyPlan.map(w => ({ ...w }))] },
      weekNumber,
      hours
    );
    setSyllabus(updated);
  };

  const handleExportCSV = () => {
    const csvData = exportLessonPlanCSV(syllabus);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LessonPlan_${syllabus.courseCode}_Sem${syllabus.semester}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Course Overview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold mb-2">
              <span>{syllabus.courseCode}</span>
              <span>•</span>
              <span>{syllabus.department}</span>
              <span>•</span>
              <span>Semester {syllabus.semester} ({syllabus.academicYear})</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {syllabus.courseTitle}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              NAAC Criterion 1 & 2 Outcome-Based Education (OBE) Syllabus & Lesson Plan Studio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition"
            >
              <span>📥</span>
              Export Regulatory CSV
            </button>
          </div>
        </div>

        {/* Velocity & Academic Calendar Radar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Credit Structure (L-T-P)</div>
            <div className="text-xl font-bold text-white mt-1">
              {syllabus.lectureCredits} - 0 - {syllabus.labCredits}{' '}
              <span className="text-xs text-indigo-400 font-normal">({syllabus.totalCredits} Credits)</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Total: {syllabus.totalContactHours} Contact Hours</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Delivered Progress</div>
            <div className="text-xl font-bold text-white mt-1">
              {velocity.totalDeliveredHours}{' '}
              <span className="text-xs text-slate-500 font-normal">/ {velocity.totalPlannedHours} hrs</span>
            </div>
            <div className="text-xs text-emerald-400 font-semibold mt-0.5">
              {velocity.completionPercentage}% Syllabus Covered
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Calendar Week</span>
              <span className="text-indigo-400 font-mono">Target: W{targetWeek}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="16"
                value={targetWeek}
                onChange={e => setTargetWeek(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Adjust academic calendar week</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Delivery Velocity Status</div>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                velocity.status === 'ON_TRACK'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : velocity.status === 'SLIGHT_DELAY'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {velocity.status === 'ON_TRACK' ? '✓ ON SCHEDULE' : velocity.status === 'SLIGHT_DELAY' ? '⚠️ SLIGHT LAG' : '🚨 CRITICAL DRIFT'}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              Drift: {velocity.driftHours >= 0 ? `+${velocity.driftHours}` : velocity.driftHours} hrs
            </div>
          </div>
        </div>

        {velocity.remedialRecommendation && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>{velocity.remedialRecommendation}</span>
          </div>
        )}
      </div>

      {/* 16-Week Lesson Plan Timeline */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>📅</span>
          16-Week Semester Lesson Execution Timeline
        </h2>

        <div className="space-y-4">
          {syllabus.weeklyPlan.map(week => (
            <div 
              key={week.weekNumber}
              className={`p-5 rounded-2xl border transition-all ${
                week.weekNumber === targetWeek
                  ? 'bg-indigo-950/20 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                    week.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : week.status === 'IN_PROGRESS'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    W{week.weekNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                        {week.moduleId}
                      </span>
                      <span className="text-slate-600">•</span>
                      <h3 className="text-base font-bold text-white">{week.theme}</h3>
                    </div>

                    <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                      <div><strong className="text-slate-300">Lectures:</strong> {week.topicsCovered.join(', ')}</div>
                      <div><strong className="text-slate-300">Lab Practice:</strong> {week.labPracticalTopics.join(', ')}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Dial & Quick Update */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-mono">
                      {week.deliveredHours} / {week.plannedHours} hrs
                    </div>
                    <span className={`inline-block mt-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      week.status === 'COMPLETED' ? 'text-emerald-400' : week.status === 'IN_PROGRESS' ? 'text-indigo-400' : 'text-slate-500'
                    }`}>
                      {week.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl p-1">
                    <button
                      onClick={() => handleUpdateHours(week.weekNumber, Math.max(0, week.deliveredHours - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-mono text-white font-bold">
                      {week.deliveredHours}
                    </span>
                    <button
                      onClick={() => handleUpdateHours(week.weekNumber, Math.min(week.plannedHours + 2, week.deliveredHours + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
