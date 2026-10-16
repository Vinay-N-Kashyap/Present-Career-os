'use client';

import React, { Suspense } from 'react';
import AssignmentRubricComposer from '@/components/teacher/AssignmentRubricComposer';

export default function TeacherAssignmentsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      padding: '28px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>📝 Assignment & Multi-Dimensional Rubric Studio</h1>
        <p style={{ fontSize: 13.5, color: '#94a3b8', marginBottom: 24 }}>
          Design rubric evaluation standards with 100% weight invariants and preview automated student feedback.
        </p>
        <Suspense fallback={<div>Loading Rubric Studio...</div>}>
          <AssignmentRubricComposer />
        </Suspense>
      </div>
    </div>
  );
}
