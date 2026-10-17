import React from 'react';
import { ScholarshipLedgerManager } from '@/components/admin/ScholarshipLedgerManager';

export const metadata = {
  title: 'Student Scholarships & Financial Aid | Campus Admin | PinIT Career OS',
  description: 'NAAC Criterion 5.1 freeships, merit-cum-means grants, corporate endowments, and DBT disbursement ledger',
};

export default function CampusScholarshipsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <ScholarshipLedgerManager />
      </div>
    </div>
  );
}
