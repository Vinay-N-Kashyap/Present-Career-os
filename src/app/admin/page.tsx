'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RoleGate } from '@/components/auth/RoleGate';
import AdminDashboardShell from '@/components/admin/AdminDashboardShell';

function AdminPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'overview';

  const handleTabChange = (nextTab: string) => {
    if (nextTab === 'overview' || nextTab === 'dashboard') {
      router.replace('/admin');
    } else {
      router.replace(`/admin?tab=${encodeURIComponent(nextTab)}`);
    }
  };

  return (
    <RoleGate allow={['admin', 'superadmin']} label="Campus Admin">
      <div style={{ minHeight: '100vh', background: 'var(--bg-main, #f8fafc)' }}>
        <AdminDashboardShell activeTab={tabParam} onTabChange={handleTabChange} />
      </div>
    </RoleGate>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading Admin Portal...</div>}>
      <AdminPageContent />
    </Suspense>
  );
}
