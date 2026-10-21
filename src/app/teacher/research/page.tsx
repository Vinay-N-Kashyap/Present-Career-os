import React from 'react';
import { ResearchPortfolioStudio } from '@/components/teacher/ResearchPortfolioStudio';

export const metadata = {
  title: 'Faculty Research & Patents Portfolio | Teacher Portal | PinIT Career OS',
  description: 'NAAC 3.3/3.4 publications, Scopus/WoS tracking, IPR patent ledger and sponsored research grants',
};

export default function TeacherResearchPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <ResearchPortfolioStudio />
      </div>
    </div>
  );
}
