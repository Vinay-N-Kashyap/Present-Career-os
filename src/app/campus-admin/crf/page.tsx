import React from 'react';
import CentralResearchFacilityManager from '@/components/admin/CentralResearchFacilityManager';

export const metadata = {
  title: 'Central Instrumentation Facility (CRF / CUIF) Console | Campus Admin',
  description: 'DST-FIST & National I-STEM equipment slot booking, differential academic & commercial tariffs, and test audit ledger.',
};

export default function CrfPage() {
  return <CentralResearchFacilityManager />;
}
