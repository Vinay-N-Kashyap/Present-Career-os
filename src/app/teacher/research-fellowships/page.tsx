import React from 'react';
import { Metadata } from 'next';
import FacultyFellowshipStudio from '@/components/teacher/FacultyFellowshipStudio';

export const metadata: Metadata = {
  title: 'Faculty Research Fellowship & Scholar Stipend Studio | PinIT Career OS',
  description: 'JRF, SRF, and Post-Doctoral research fellowship monthly stipend bills, DBT release, and contingency grant ledger'
};

export default function ResearchFellowshipsPage() {
  return <FacultyFellowshipStudio />;
}
