import React from 'react';
import { Metadata } from 'next';
import FacultyBookRoyaltyStudio from '@/components/teacher/FacultyBookRoyaltyStudio';

export const metadata: Metadata = {
  title: 'Faculty Book Publishing Royalty & Translation Studio | PinIT Career OS',
  description: 'UGC CAS Table 2 Category 2 book research scores, publisher royalties, 10% TDS deductions, and NEP translation grants'
};

export default function BookPublishingPage() {
  return <FacultyBookRoyaltyStudio />;
}
