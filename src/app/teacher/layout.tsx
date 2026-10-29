'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TeacherRoleGate from '@/components/teacher/TeacherRoleGate';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSubStudio = pathname && pathname !== '/teacher' && pathname.startsWith('/teacher/');

  return (
    <TeacherRoleGate>
      {isSubStudio && (
        <div
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/teacher"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                background: '#eff6ff',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: 13,
                border: '1px solid #bfdbfe',
              }}
            >
              ← Back to Faculty & Teacher Portal
            </Link>
            <span style={{ fontSize: 12.5, color: '#64748b' }}>
              Active Studio: <code style={{ color: '#0f172a', fontWeight: 600 }}>{pathname}</code>
            </span>
          </div>
          <Link
            href="/dashboard"
            style={{
              textDecoration: 'none',
              fontSize: 12.5,
              color: '#475569',
              fontWeight: 600,
            }}
          >
            Main Workspace →
          </Link>
        </div>
      )}
      {children}
    </TeacherRoleGate>
  );
}
