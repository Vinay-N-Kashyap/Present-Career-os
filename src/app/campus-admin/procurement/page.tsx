import React from 'react';
import CentralProcurementManager from '@/components/admin/CentralProcurementManager';

export const metadata = {
  title: 'Central University Procurement & Works e-Tender Portal | Campus Admin',
  description: 'Statutory GFR 2017 & GeM e-tendering, Central Purchase Committee two-bid evaluations, and cryptographic contract awards.',
};

export default function ProcurementPage() {
  return <CentralProcurementManager />;
}
