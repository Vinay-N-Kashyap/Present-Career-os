import React from 'react';
import CentralCampusSecurityManager from '@/components/admin/CentralCampusSecurityManager';

export const metadata = {
  title: 'Campus Security, Gate Pass & Access Control Directorate | Campus Admin',
  description: 'MHA Campus Perimeter Security Standards, Automated ANPR & RFID Gate Pass Access, Curfew Overstay Surveillance & Security Holds.',
};

export default function CampusSecurityPage() {
  return <CentralCampusSecurityManager />;
}
