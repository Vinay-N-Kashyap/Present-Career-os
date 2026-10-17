'use client';

import React, { Suspense } from 'react';
import FeeLedgerDashboard from '@/components/admin/FeeLedgerDashboard';

export default function CampusAdminFeesPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      padding: '28px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>💳 Campus Sub-Ledger & Fee Collections</h1>
        <p style={{ fontSize: 13.5, color: '#94a3b8', marginBottom: 24 }}>
          Double-entry institutional accounts receivable, student dues ledger, and SHA-256 digital payment proofs.
        </p>
        <Suspense fallback={<div>Loading Ledger...</div>}>
          <FeeLedgerDashboard institutionId="inst-apex-001" />
        </Suspense>
      </div>
    </div>
  );
}
