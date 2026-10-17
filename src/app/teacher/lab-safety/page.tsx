import React from 'react';
import LabSafetyStudio from '@/components/teacher/LabSafetyStudio';

export const metadata = {
  title: 'Faculty Laboratory Chemical Safety & Hazardous Waste | Teacher Portal',
  description: 'OSHA Satellite Accumulation Area chemical waste inventory, 90-day storage limits, and SPCB TSDF manifest dispatches.',
};

export default function LabSafetyPage() {
  return <LabSafetyStudio />;
}
