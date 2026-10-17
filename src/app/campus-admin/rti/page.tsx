import React from 'react';
import CentralRtiManager from '@/components/admin/CentralRtiManager';

export const metadata = {
  title: 'Right to Information (RTI 2005) & Public Grievance Portal | Campus Admin',
  description: 'Statutory 30-day response tracking, Section 8 exemptions scrutiny, First Appellate Authority hearings, and CIC quarterly returns.',
};

export default function RtiPage() {
  return <CentralRtiManager />;
}
