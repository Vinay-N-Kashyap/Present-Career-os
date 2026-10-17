'use client';

import React, { Suspense } from 'react';
import AccreditationReportGenerator from '@/components/admin/AccreditationReportGenerator';

export default function CampusAdminAccreditationPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      padding: '28px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Suspense fallback={<div>Loading Accreditation Reports...</div>}>
          <AccreditationReportGenerator institutionId="inst-apex-001" />
        </Suspense>
      </div>
    </div>
  );
}
