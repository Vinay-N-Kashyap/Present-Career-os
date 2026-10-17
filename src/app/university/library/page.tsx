import React from 'react';
import DigitalLibraryCatalog from '@/components/university/DigitalLibraryCatalog';

export const metadata = {
  title: 'Digital Library & Research Repository | University Portal | PinIT Career OS',
  description: 'Search academic textbooks, download open-access journal papers, and manage RFID book checkouts',
};

export default function UniversityLibraryPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DigitalLibraryCatalog />
      </div>
    </div>
  );
}
