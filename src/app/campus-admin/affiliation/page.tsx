import React from 'react';
import CentralAffiliationManager from '@/components/admin/CentralAffiliationManager';

export const metadata = {
  title: 'College Affiliation & Annual Inspection Committee (AIC) | Campus Admin',
  description: 'Statutory college affiliation dossiers, physical inspection committee findings, cadre ratio compliance, and University Syndicate sanction resolutions.',
};

export default function AffiliationPage() {
  return <CentralAffiliationManager />;
}
