import React from 'react';
import CentralAcademicIntegrityManager from '@/components/admin/CentralAcademicIntegrityManager';

export const metadata = {
  title: 'Central University Academic Integrity & Plagiarism Prevention Tribunal | Campus Admin',
  description: 'Statutory DAIP & IAIP Inquiry Protocols under UGC (Academic Integrity and Prevention of Plagiarism in HEIs) Regulations, 2018.',
};

export default function AcademicIntegrityPage() {
  return <CentralAcademicIntegrityManager />;
}
