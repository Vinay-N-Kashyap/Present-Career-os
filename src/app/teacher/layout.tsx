'use client';

import React from 'react';
import TeacherRoleGate from '@/components/teacher/TeacherRoleGate';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherRoleGate>{children}</TeacherRoleGate>;
}
