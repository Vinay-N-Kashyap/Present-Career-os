import React from 'react';
import { Metadata } from 'next';
import CentralEqualOpportunityManager from '@/components/admin/CentralEqualOpportunityManager';

export const metadata: Metadata = {
  title: 'Equal Opportunity Cell (EOC) & Universal Accessibility Console | Campus Admin',
  description: 'RPwD Act 2016 4% Statutory Quota, CPWD Barrier-Free Built Environment Standards, and Assistive Technology Grants.',
};

export default function EqualOpportunityPage() {
  return <CentralEqualOpportunityManager />;
}
