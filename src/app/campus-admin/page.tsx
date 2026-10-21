'use client';

import React, { Suspense } from 'react';
import CampusAdminShell from '@/components/admin/CampusAdminShell';

export default function CampusAdminPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: '#090d16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: 14
      }}>
        Loading Campus Admin Portal...
      </div>
    }>
      <CampusAdminShell />
    </Suspense>
  );
}
