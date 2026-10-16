import React from 'react';
import BogGovernanceManager from '@/components/admin/BogGovernanceManager';

export const metadata = {
  title: 'Statutory Governance & Board of Governors Console | Campus Admin',
  description: 'Apex university policy resolutions, statutory council quorums, Action Taken Reports (ATR), and gazette notification ledger.',
};

export default function GovernancePage() {
  return <BogGovernanceManager />;
}
