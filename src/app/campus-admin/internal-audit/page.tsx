import React from 'react';
import { Metadata } from 'next';
import CentralAuditCagManager from '@/components/admin/CentralAuditCagManager';

export const metadata: Metadata = {
  title: 'Internal Audit & CAG Statutory Compliance | PinIT Central University OS',
  description: 'Comptroller and Auditor General (CAG) compliance, GFR procurement audit memos, and Action Taken Note (ATN) resolution console'
};

export default function InternalAuditPage() {
  return <CentralAuditCagManager />;
}
