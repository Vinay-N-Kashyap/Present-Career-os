import React from 'react';
import { TransportFleetManager } from '@/components/admin/TransportFleetManager';

export const metadata = {
  title: 'Campus Fleet Transportation & Bus Telemetry | Campus Admin | PinIT Career OS',
  description: 'Real-time GPS tracking, multi-stop route dispatch, contactless RFID student passes, and RTO safety compliance',
};

export default function CampusTransportPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <TransportFleetManager />
      </div>
    </div>
  );
}
