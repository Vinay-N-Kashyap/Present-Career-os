import React from 'react';
import { SabbaticalPortalStudio } from '@/components/teacher/SabbaticalPortalStudio';

export const metadata = {
  title: 'Faculty Sabbatical & Academic Deputation | Teacher Portal | PinIT Career OS',
  description: 'UGC sabbatical leave governance (6-year continuous service rule), academic deputations, and research lien records',
};

export default function FacultyLeavesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <SabbaticalPortalStudio />
      </div>
    </div>
  );
}
