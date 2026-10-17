import React from 'react';
import { IqacAccreditationStudio } from '@/components/admin/IqacAccreditationStudio';

export const metadata = {
  title: 'Internal Quality Assurance Cell (IQAC) | Campus Admin | PinIT Career OS',
  description: 'Statutory NAAC 7-criteria quality framework, AQAR annual report synthesis, CGPA calculation, and digital accreditation seal',
};

export default function IqacPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <IqacAccreditationStudio />
      </div>
    </div>
  );
}
