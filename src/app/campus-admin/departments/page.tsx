import React from 'react';
import DepartmentAnalyticsDashboard from '@/components/admin/DepartmentAnalyticsDashboard';

export const metadata = {
  title: 'Department Analytics & Faculty Workload | Campus Admin | PinIT Career OS',
  description: 'Multi-metric Department Performance Index (DPI), AICTE faculty workload balance, and NBA/NAAC compliance',
};

export default function CampusDepartmentsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DepartmentAnalyticsDashboard />
      </div>
    </div>
  );
}
