import React from 'react';
import FacultyEmeritusStudio from '@/components/teacher/FacultyEmeritusStudio';
import TeacherRoleGate from '@/components/teacher/TeacherRoleGate';

export const metadata = {
  title: 'Faculty Emeritus Fellowship & Superannuation Studio | PinIT Career OS',
  description: 'UGC Emeritus Fellowship Scheme (Fixed ₹50,000/mo Honorarium, ₹50,000/yr Contingency, 10% Section 194J TDS Deduction)'
};

export default function FacultyEmeritusPage() {
  return (
    <TeacherRoleGate>
      <FacultyEmeritusStudio />
    </TeacherRoleGate>
  );
}
