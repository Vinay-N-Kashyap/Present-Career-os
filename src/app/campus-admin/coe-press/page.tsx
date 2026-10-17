import React from 'react';
import CentralCoePressManager from '@/components/admin/CentralCoePressManager';

export const metadata = {
  title: 'Controller of Examinations Confidential Press & Custody | Campus Admin',
  description: 'Confidential examination question paper printing, dual-custodian double-lock custody, and emergency fallback contingency governance.',
};

export default function CoePressPage() {
  return <CentralCoePressManager />;
}
