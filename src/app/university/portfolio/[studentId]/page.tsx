import React from 'react';
import { StudentPortfolioShowcase } from '@/components/university/StudentPortfolioShowcase';
import { compilePublicPortfolio, StudentAcademicProfile } from '@/lib/admin/portfolio';

export const metadata = {
  title: 'Verifiable Student Portfolio | PinIT University Network',
  description: 'Cryptographically certified student academic portfolio and engineering capstone showcase',
};

export default function StudentPortfolioPage({
  params
}: {
  params: { studentId: string }
}) {
  const studentId = params?.studentId || 'stu-arjun-01';

  // Seed academic profile
  const mockProfile: StudentAcademicProfile = {
    studentId,
    institutionId: 'inst-apex-001',
    fullName: 'Arjun Verma',
    rollNumber: 'CS2026-089',
    email: 'arjun.v@apex.edu.in',
    phone: '+91 98765 43210', // Will be redacted
    department: 'Computer Science & Engineering',
    degree: 'B.Tech in Artificial Intelligence & Data Science',
    batchYear: 2026,
    cgpa: 9.42,
    attendancePercentage: 96.5,
    feeBalanceDue: 0, // Will be redacted
    internalDisciplinaryNotes: [], // Will be redacted
    completedQuestsCount: 48,
    capstones: [
      {
        capstoneId: 'cap-dist-01',
        title: 'Distributed In-Memory Raft Consensus Engine',
        courseCode: 'CS401',
        grade: 'A+',
        score: 98,
        completionDate: '2026-09-15',
        repositoryUrl: 'https://github.com/apex-students/raft-consensus-engine',
        liveDemoUrl: 'https://raft.apex.edu.in',
        competencies: ['Distributed Systems', 'Go / C++', 'Raft Protocol', 'Network Partition Recovery'],
      },
      {
        capstoneId: 'cap-quant-02',
        title: 'Sub-Microsecond Limit Order Book & Matching Engine',
        courseCode: 'CS405',
        grade: 'A+',
        score: 96,
        completionDate: '2026-10-02',
        repositoryUrl: 'https://github.com/apex-students/quant-lob-engine',
        competencies: ['Low Latency', 'C++20', 'Cache Alignment', 'Lock-Free Queues'],
      },
    ],
    exams: [
      {
        examId: 'exam-algo-final',
        examTitle: 'Advanced Data Structures & Graph Algorithms',
        score: 94,
        integrityScore: 100,
        passed: true,
        proctoredDate: '2026-08-20',
      },
      {
        examId: 'exam-os-final',
        examTitle: 'Operating Systems & Concurrency Mechanics',
        score: 91,
        integrityScore: 98,
        passed: true,
        proctoredDate: '2026-09-30',
      },
    ],
    employabilityScore: 94,
    tier: 'TIER_1_PRODUCT',
  };

  const publicPortfolio = compilePublicPortfolio(mockProfile, 'Apex Institute of Technology');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <StudentPortfolioShowcase portfolio={publicPortfolio} />
    </div>
  );
}
