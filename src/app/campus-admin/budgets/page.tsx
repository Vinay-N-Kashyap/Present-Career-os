import React from 'react';
import BudgetPlanningDashboard from '@/components/admin/BudgetPlanningDashboard';

export const metadata = {
  title: 'Department Budget Planning & Capital Allocation | Campus Admin | PinIT Career OS',
  description: 'Departmental OPEX/CAPEX allocation matrix, grant disbursement tracking, and NAAC/NBA financial reporting',
};

export default function CampusBudgetsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <BudgetPlanningDashboard />
      </div>
    </div>
  );
}
