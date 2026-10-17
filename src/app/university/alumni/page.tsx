import React from 'react';
import AlumniMentorshipPortal from '@/components/university/AlumniMentorshipPortal';

export const metadata = {
  title: 'Alumni Mentorship Network & Endowments | University Portal | PinIT Career OS',
  description: 'Connect with alumni leaders, book 1-on-1 career mentorship, and track philanthropic endowments',
};

export default function UniversityAlumniPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <AlumniMentorshipPortal />
      </div>
    </div>
  );
}
