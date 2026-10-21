import React from 'react';
import { LiveAttendanceSession } from '@/components/teacher/LiveAttendanceSession';

export const metadata = {
  title: 'Live QR Attendance | Teacher Portal | PinIT Career OS',
  description: 'Dynamic revolving QR code attendance with classroom geofencing and proxy protection',
};

export default function TeacherAttendancePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Classroom Attendance & Anti-Proxy Verification
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Revolving time-synced QR codes authenticated against campus lecture hall GPS coordinates.
          </p>
        </div>

        <LiveAttendanceSession />
      </div>
    </div>
  );
}
