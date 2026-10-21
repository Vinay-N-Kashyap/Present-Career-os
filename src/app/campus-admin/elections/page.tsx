import React from 'react';
import CentralElectionManager from '@/components/admin/CentralElectionManager';

export const metadata = {
  title: 'Central University Student Election & Campus Council Governance | Campus Admin',
  description: 'Statutory Student Council Elections under Lyngdoh Committee Recommendations (Hon\'ble Supreme Court Order), Model Code of Conduct & Voter Turnout Telemetry.',
};

export default function ElectionsPage() {
  return <CentralElectionManager />;
}
