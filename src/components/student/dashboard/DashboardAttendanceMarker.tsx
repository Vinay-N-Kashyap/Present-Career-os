'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { toast } from '@/lib/store/useAppStore';
import {
  studentAttendanceService,
  StudentAttendanceRecord,
  getTodayDateString,
} from '@/lib/services/studentAttendanceService';

interface Props {
  onCheckInSuccess?: (record: StudentAttendanceRecord) => void;
}

export default function DashboardAttendanceMarker({ onCheckInSuccess }: Props) {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const [record, setRecord] = useState<StudentAttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentId = user?.id || 'guest_student';
  const todayStr = getTodayDateString();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await studentAttendanceService.getAttendance(studentId);
        if (isMounted) setRecord(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [studentId]);

  const isCheckedInToday = record?.last_check_in === todayStr;

  const handleCheckIn = async () => {
    if (!record || isCheckedInToday || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await studentAttendanceService.markDailyCheckIn(studentId, record);
      if (res.success) {
        setRecord(res.record);
        // Grant rewards via CareerOS Context
        try {
          if (typeof cOS.earnPins === 'function') {
            cOS.earnPins(10, 'daily_attendance');
          }
          if (typeof cOS.addXp === 'function') {
            cOS.addXp(25, 'Daily Attendance Check-In');
          }
        } catch {}

        toast.success('Attendance Marked! 📍', res.message);
        if (onCheckInSuccess) onCheckInSuccess(res.record);
      } else {
        toast.info('Attendance Notice', res.message);
      }
    } catch (err: any) {
      toast.error('Check-in Failed', err?.message || 'Unable to record attendance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pct = record?.percentage || 85;
  const isSafe = pct >= 75;
  const isCritical = pct < 65;

  return (
    <div
      data-testid="attendance-marker-root"
      style={{
        padding: '16px 20px',
        borderRadius: 16,
        background: isCheckedInToday
          ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(10,14,23,0.6) 100%)'
          : 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(10,14,23,0.6) 100%)',
        border: `1.5px solid ${isCheckedInToday ? 'rgba(16,185,129,0.35)' : 'rgba(99,102,241,0.3)'}`,
        boxShadow: isCheckedInToday
          ? '0 8px 24px -4px rgba(16,185,129,0.18)'
          : '0 8px 24px -4px rgba(99,102,241,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>{isCheckedInToday ? '✅' : '📍'}</span>
          <div>
            <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              CAMPUS ATTENDANCE &amp; 75% ELIGIBILITY
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)' }}>
              {isCheckedInToday ? "Today's Attendance Recorded" : "Daily Attendance Check-In"}
            </h4>
          </div>
        </div>

        {/* 75% Criteria Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 11.5,
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              background: isSafe ? 'rgba(16,185,129,0.15)' : isCritical ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
              color: isSafe ? '#10b981' : isCritical ? '#ef4444' : '#f59e0b',
              border: `1px solid ${isSafe ? 'rgba(16,185,129,0.3)' : isCritical ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
            }}
          >
            {isSafe ? `✓ Safe (${pct}%) — Exam Eligible` : `⚠️ Warning (${pct}%) — Below 75%`}
          </span>

          <span
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 11.5,
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg3)',
              color: 'var(--t2)',
              border: '1px solid var(--border)',
            }}
          >
            🔥 {record?.focus_streak || 1} Day Streak
          </span>
        </div>
      </div>

      {/* Main Interactive Check-In Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.45, maxWidth: 540 }}>
          {isCheckedInToday ? (
            <span>
              Your institutional attendance has been recorded for today (<strong style={{ color: 'var(--t1)' }}>{todayStr}</strong>). Your attendance percentage is currently <strong style={{ color: '#10b981' }}>{pct}%</strong> ({record?.attended_classes} of {record?.total_classes} sessions).
            </span>
          ) : (
            <span>
              Click below to mark your official attendance for today. Maintaining over <strong style={{ color: 'var(--t1)' }}>75% attendance</strong> is mandatory for semester exams and campus placement drives.
            </span>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isCheckedInToday ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                background: 'rgba(16,185,129,0.15)',
                border: '1.5px solid #10b981',
                color: '#10b981',
                fontSize: 13,
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
              }}
            >
              <span>✓</span> Attendance Present · +10 Pins Claimed
            </div>
          ) : (
            <button
              type="button"
              data-testid="btn-mark-attendance"
              onClick={handleCheckIn}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent), #4f46e5)',
                border: 'none',
                color: '#ffffff',
                fontSize: 13.5,
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                transition: 'all 0.18s ease',
              }}
            >
              <span>📍</span>
              {isSubmitting ? 'Recording...' : "Mark Today's Attendance (+10 Pins)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
