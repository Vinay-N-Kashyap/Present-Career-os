import React from 'react';
import { FacultyMentorshipStudio } from '@/components/teacher/FacultyMentorshipStudio';

export const metadata = {
  title: 'Faculty Mentorship & Student Counseling | Teacher Portal | PinIT Career OS',
  description: 'AICTE proctor-mentee ratio compliance (1:20), early risk interventions, student counseling encounters, and NAAC 5.1.4 log',
};

export default function FacultyMentorshipPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <FacultyMentorshipStudio />
      </div>
    </div>
  );
}
