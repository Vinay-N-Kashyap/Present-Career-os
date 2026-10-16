'use client';

import React, { Suspense } from 'react';
import ExamSchedulerMonitor from '@/components/teacher/ExamSchedulerMonitor';

export default function TeacherExamsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      padding: '28px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Suspense fallback={<div>Loading Exam Monitor...</div>}>
          <ExamSchedulerMonitor />
        </Suspense>
      </div>
    </div>
  );
}
