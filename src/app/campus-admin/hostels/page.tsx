import React from 'react';
import { HostelFacilityManager } from '@/components/admin/HostelFacilityManager';

export const metadata = {
  title: 'Hostels & Campus Housing Facility Allocation | Campus Admin | PinIT Career OS',
  description: 'Residential facility management, bed inventory allocation, maintenance ticketing, and curfew compliance',
};

export default function CampusHostelsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <HostelFacilityManager />
      </div>
    </div>
  );
}
