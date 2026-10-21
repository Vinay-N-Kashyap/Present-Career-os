import React from 'react';
import { FacultyFdpStudio } from '@/components/teacher/FacultyFdpStudio';

export const metadata = {
  title: 'Faculty Development Programs (FDP) & CPD | Teacher Portal | PinIT Career OS',
  description: 'AICTE ATAL Academy, UGC HRDC, NPTEL/SWAYAM certifications, industry immersion tracking, and NAAC Criterion 6.3 report',
};

export default function FacultyFdpPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <FacultyFdpStudio />
      </div>
    </div>
  );
}
