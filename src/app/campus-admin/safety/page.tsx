import React from 'react';
import CampusSafetyBroadcastManager from '@/components/admin/CampusSafetyBroadcastManager';

export const metadata = {
  title: 'Campus Safety & Emergency Response Dispatch | Campus Admin | PinIT Career OS',
  description: 'Real-time monitored zone geofences, first responder dispatch, and campus emergency sirens',
};

export default function CampusSafetyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <CampusSafetyBroadcastManager />
      </div>
    </div>
  );
}
