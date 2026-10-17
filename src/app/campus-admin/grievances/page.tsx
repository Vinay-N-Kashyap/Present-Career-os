import React from 'react';
import GrievanceRedressalManager from '@/components/admin/GrievanceRedressalManager';

export const metadata = {
  title: 'Student Grievance Redressal & Ombudsman | Campus Admin | PinIT Career OS',
  description: 'AICTE & UGC statutory student dispute resolution, hearing scheduler, and 15-day SLA compliance watchdog',
};

export default function CampusGrievancesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <GrievanceRedressalManager />
      </div>
    </div>
  );
}
