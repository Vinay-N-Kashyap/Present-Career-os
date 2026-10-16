import React from 'react';
import { StudentHealthManager } from '@/components/admin/StudentHealthManager';

export const metadata = {
  title: 'Student Health & Infirmary Triage | Campus Admin | PinIT Career OS',
  description: 'Campus clinic outpatient consultations, emergency triage, statutory medical leave certificates, and attendance waiver governance',
};

export default function StudentHealthPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <StudentHealthManager />
      </div>
    </div>
  );
}
