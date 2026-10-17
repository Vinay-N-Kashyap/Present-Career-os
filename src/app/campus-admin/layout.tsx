'use client';

import React from 'react';
import CampusAdminRoleGate from '@/components/admin/CampusAdminRoleGate';

export default function CampusAdminLayout({ children }: { children: React.ReactNode }) {
  return <CampusAdminRoleGate>{children}</CampusAdminRoleGate>;
}
