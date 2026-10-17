import React from 'react';
import { CampusEventsManager } from '@/components/admin/CampusEventsManager';

export const metadata = {
  title: 'Campus Events & Auditorium Scheduling | Campus Admin | PinIT Career OS',
  description: 'Auditorium inventory, spatial clash prevention, CPCB noise regulations, and keynote visitor pass engine',
};

export default function CampusEventsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <CampusEventsManager />
      </div>
    </div>
  );
}
