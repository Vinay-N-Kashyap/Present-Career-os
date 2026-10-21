'use client';

import React, { Suspense } from 'react';
import StudentRosterManager from '@/components/admin/StudentRosterManager';

export default function CampusAdminRosterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      padding: '28px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>👥 Student Roster & Onboarding Hub</h1>
        <p style={{ fontSize: 13.5, color: '#94a3b8', marginBottom: 24 }}>
          Manage institutional student roster, batch enrollment, and execute CSV bulk onboarding.
        </p>
        <Suspense fallback={<div>Loading Roster...</div>}>
          <StudentRosterManager institutionId="inst-apex-001" />
        </Suspense>
      </div>
    </div>
  );
}
