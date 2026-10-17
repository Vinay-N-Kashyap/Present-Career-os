import React from 'react';
import CentralNirfRankingManager from '@/components/admin/CentralNirfRankingManager';
import CampusAdminRoleGate from '@/components/admin/CampusAdminRoleGate';

export const metadata = {
  title: 'Central University NIRF & Global Ranking Console | PinIT Career OS',
  description: 'Ministry of Education (MoE) NIRF 5-Dimensional Telemetry & QS World Ranking Telemetry Bridge'
};

export default function CentralNirfRankingPage() {
  return (
    <CampusAdminRoleGate>
      <CentralNirfRankingManager />
    </CampusAdminRoleGate>
  );
}
