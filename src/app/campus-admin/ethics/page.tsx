import React from 'react';
import EthicsComplianceManager from '@/components/admin/EthicsComplianceManager';

export const metadata = {
  title: 'Institutional Bio-Safety & Animal Ethics (IAEC / IBSC) | Campus Admin',
  description: 'Statutory CCSEA animal ethics clearances, 3Rs welfare invariants, recombinant DNA biosafety containment, and protocol registries.',
};

export default function EthicsPage() {
  return <EthicsComplianceManager />;
}
