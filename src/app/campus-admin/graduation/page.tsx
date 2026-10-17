import React from 'react';
import GraduationAuditConsole from '@/components/admin/GraduationAuditConsole';

export const metadata = {
  title: 'Graduation Degree Audit & Convocation Clearance | Campus Admin | PinIT Career OS',
  description: 'Academic transcript verification, 160-credit degree invariant checks, and convocation clearance rosters',
};

export default function CampusGraduationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <GraduationAuditConsole />
      </div>
    </div>
  );
}
