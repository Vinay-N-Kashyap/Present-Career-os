import React from 'react';
import { AntiRaggingTribunalManager } from '@/components/admin/AntiRaggingTribunalManager';

export const metadata = {
  title: 'Anti-Ragging Cell & Disciplinary Tribunal | Campus Admin | PinIT Career OS',
  description: 'Supreme Court & UGC 2009 anti-ragging regulation enforcement, anonymous incident tokens, squad dispatch, tribunal sanctions, and 7-day statutory ATR watchdog',
};

export default function AntiRaggingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <AntiRaggingTribunalManager />
      </div>
    </div>
  );
}
