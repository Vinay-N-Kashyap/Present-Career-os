import React from 'react';
import { Metadata } from 'next';
import FacultyConsultancyBillingStudio from '@/components/teacher/FacultyConsultancyBillingStudio';

export const metadata: Metadata = {
  title: 'Faculty Corporate Consultancy & Client Billing Studio | PinIT Career OS',
  description: 'Corporate R&D client billing, GST 18% SAC 9983 invoicing, and institutional revenue sharing console'
};

export default function FacultyConsultancyBillingPage() {
  return <FacultyConsultancyBillingStudio />;
}
