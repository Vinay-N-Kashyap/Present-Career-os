'use client';

import React, { Suspense } from 'react';
import ModerationIncidentQueue from '@/components/admin/ModerationIncidentQueue';

export default function CampusAdminModerationPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      padding: '28px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>🛡️ Community Moderation & Escalation Queue</h1>
        <p style={{ fontSize: 13.5, color: '#94a3b8', marginBottom: 24 }}>
          Automated toxicity filtering, exam leak prevention, and Dean of Student Affairs disciplinary review portal.
        </p>
        <Suspense fallback={<div>Loading Moderation Queue...</div>}>
          <ModerationIncidentQueue institutionId="inst-apex-001" />
        </Suspense>
      </div>
    </div>
  );
}
