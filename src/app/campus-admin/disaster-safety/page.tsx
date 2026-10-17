import React from 'react';
import { Metadata } from 'next';
import CentralDisasterSafetyManager from '@/components/admin/CentralDisasterSafetyManager';

export const metadata: Metadata = {
  title: 'Disaster Management, Fire Safety & Evacuation Console | Campus Admin',
  description: 'Disaster Management Act 2005, NDMA Higher Education Safety Guidelines, and NBC 2016 Fire Safety Standards.',
};

export default function DisasterSafetyPage() {
  return <CentralDisasterSafetyManager />;
}
