import React from 'react';
import { CasPromotionStudio } from '@/components/teacher/CasPromotionStudio';

export const metadata = {
  title: 'Faculty CAS Promotion Dossier | Teacher Portal | PinIT Career OS',
  description: 'UGC 2018 Career Advancement Scheme promotion portfolio, PBAS API verification, and external peer review scoring',
};

export default function CasDossierPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <CasPromotionStudio />
      </div>
    </div>
  );
}
