import React from 'react';
import { SyllabusPlannerStudio } from '@/components/teacher/SyllabusPlannerStudio';

export const metadata = {
  title: 'Course Syllabus & Lesson Planner | Teacher Portal | PinIT Career OS',
  description: '16-week outcome-based syllabus planner with contact hours invariants and delivery velocity tracking',
};

export default function TeacherSyllabusPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <SyllabusPlannerStudio />
      </div>
    </div>
  );
}
