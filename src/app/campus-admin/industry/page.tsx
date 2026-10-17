import React from 'react';
import IndustryPartnershipsManager from '@/components/admin/IndustryPartnershipsManager';

export const metadata = {
  title: 'Industry MoUs & Corporate Partnerships | Campus Admin | PinIT Career OS',
  description: 'Manage corporate MoUs, student corporate internship allocations, and NAAC Criterion 3.5 compliance',
};

export default function CampusIndustryPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <IndustryPartnershipsManager />
      </div>
    </div>
  );
}
