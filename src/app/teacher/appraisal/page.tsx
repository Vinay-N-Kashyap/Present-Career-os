import React from 'react';
import { FacultyAppraisalStudio } from '@/components/teacher/FacultyAppraisalStudio';

export const metadata = {
  title: 'Faculty Annual Appraisal & UGC CAS | Teacher Portal | PinIT Career OS',
  description: 'UGC Career Advancement Scheme (CAS) self-assessment, Category I-III API scoring, and HoD/Dean endorsements',
};

export default function FacultyAppraisalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <FacultyAppraisalStudio />
      </div>
    </div>
  );
}
