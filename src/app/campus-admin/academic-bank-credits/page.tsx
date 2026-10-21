import React from 'react';
import { Metadata } from 'next';
import CentralAcademicBankManager from '@/components/admin/CentralAcademicBankManager';

export const metadata: Metadata = {
  title: 'Academic Bank of Credits (ABC) & Digilocker NAD | PinIT Central University OS',
  description: 'NEP 2020 Multiple Entry and Exit in Academic Programmes (MEES), APAAR ID registry, and credit redemption console'
};

export default function AcademicBankCreditsPage() {
  return <CentralAcademicBankManager />;
}
