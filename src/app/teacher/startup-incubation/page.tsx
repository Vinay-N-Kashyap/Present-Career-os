import React from 'react';
import { Metadata } from 'next';
import FacultyStartupIncubationStudio from '@/components/teacher/FacultyStartupIncubationStudio';

export const metadata: Metadata = {
  title: 'Faculty Student Start-Up Incubation & Innovation Studio | Teacher Portal',
  description: 'National Innovation and Start-up Policy (NISP 2019), University Equity Stake Governance, and Innovation Seed Grants.',
};

export default function StartupIncubationPage() {
  return <FacultyStartupIncubationStudio />;
}
