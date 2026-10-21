import React from 'react';
import { ParentCommunicationDispatcher } from '@/components/admin/ParentCommunicationDispatcher';

export const metadata = {
  title: 'Parent Notices & Early Warning Dispatcher | Campus Admin | PinIT Career OS',
  description: 'Multi-channel automated communication gateway for parents with cryptographic magic links',
};

export default function CampusParentNoticesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <ParentCommunicationDispatcher />
      </div>
    </div>
  );
}
