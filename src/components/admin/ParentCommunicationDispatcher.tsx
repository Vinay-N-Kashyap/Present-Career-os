'use client';

import React, { useState } from 'react';
import { 
  NotificationCategory, 
  DispatchChannel, 
  ParentContact, 
  ParentNotificationPayload,
  buildParentNotification, 
  parentNotificationStore 
} from '@/lib/admin/parentNotifications';

interface ParentCommunicationDispatcherProps {
  institutionId?: string;
}

const MOCK_STUDENTS: ParentContact[] = [
  { studentId: 'stu-01', studentName: 'Rohan Varma', rollNumber: 'CS2026-015', parentName: 'Suresh Varma', parentPhone: '+91 98765 11223', parentEmail: 'suresh.varma@gmail.com', preferredChannel: 'WHATSAPP' },
  { studentId: 'stu-02', studentName: 'Ananya Deshmukh', rollNumber: 'CS2026-034', parentName: 'Dr. Vivek Deshmukh', parentPhone: '+91 98765 44556', parentEmail: 'v.deshmukh@hospital.org', preferredChannel: 'SMS' },
  { studentId: 'stu-03', studentName: 'Arjun Verma', rollNumber: 'CS2026-089', parentName: 'Meenakshi Verma', parentPhone: '+91 98765 77889', parentEmail: 'meenakshi.v@gmail.com', preferredChannel: 'EMAIL' },
];

export const ParentCommunicationDispatcher: React.FC<ParentCommunicationDispatcherProps> = ({
  institutionId = 'inst-apex-001'
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS[0].studentId);
  const [category, setCategory] = useState<NotificationCategory>('ATTENDANCE_DEFICIT_WARNING');
  const [metricValue, setMetricValue] = useState<string>('68.4');
  const [advisorName, setAdvisorName] = useState<string>('Prof. C. Rao (HOD Computer Science)');
  const [channelOverride, setChannelOverride] = useState<DispatchChannel | null>(null);

  const [outbox, setOutbox] = useState<ParentNotificationPayload[]>(() => {
    return parentNotificationStore.getNotificationsByInstitution(institutionId);
  });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const currentContact = MOCK_STUDENTS.find(s => s.studentId === selectedStudentId) || MOCK_STUDENTS[0];
  const effectiveChannel = channelOverride || currentContact.preferredChannel;

  // Real-time preview of notification
  const previewPayload = buildParentNotification({
    institutionId,
    contact: { ...currentContact, preferredChannel: effectiveChannel },
    category,
    metricValue,
    advisorName,
  });

  const handleDispatch = () => {
    const payload = buildParentNotification({
      institutionId,
      contact: { ...currentContact, preferredChannel: effectiveChannel },
      category,
      metricValue,
      advisorName,
    });

    parentNotificationStore.dispatch(payload);
    setOutbox([...parentNotificationStore.getNotificationsByInstitution(institutionId)]);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold mb-1">
              <span>INSTITUTIONAL OUTREACH</span>
              <span>•</span>
              <span>PARENTS & GUARDIANS GATEWAY</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Parent Communication & Early Warning Dispatcher
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Automated multi-channel notices with passwordless cryptographic Parent Magic Links.
            </p>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-xs text-slate-400">Total Dispatched</div>
            <div className="text-2xl font-bold text-white mt-1">{outbox.length}</div>
            <div className="text-xs text-emerald-400 mt-0.5">Across all channels</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-xs text-slate-400">Attendance Alerts</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {outbox.filter(n => n.category === 'ATTENDANCE_DEFICIT_WARNING').length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">&lt; 75% threshold</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-xs text-slate-400">Critical Academic Risks</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">
              {outbox.filter(n => n.category === 'CRITICAL_ACADEMIC_RISK').length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Faculty conferences</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <div className="text-xs text-slate-400">Rate Limit Status</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">Active</div>
            <div className="text-xs text-slate-500 mt-0.5">12h throttle guard</div>
          </div>
        </div>
      </div>

      {/* Dispatch Composer & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Composer Form */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>✍️</span>
            Compose Parent Notice
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Student
            </label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none"
            >
              {MOCK_STUDENTS.map(s => (
                <option key={s.studentId} value={s.studentId}>
                  {s.studentName} ({s.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Notification Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as NotificationCategory)}
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="ATTENDANCE_DEFICIT_WARNING">⚠️ Attendance Deficit (&lt; 75%)</option>
              <option value="CRITICAL_ACADEMIC_RISK">🚨 Critical Academic Risk</option>
              <option value="FEE_OVERDUE_ALERT">📋 Fee Overdue Alert</option>
              <option value="CAPSTONE_HONOR_COMMENDATION">🌟 Capstone Honor Commendation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Metric Value / Context
            </label>
            <input
              type="text"
              value={metricValue}
              onChange={e => setMetricValue(e.target.value)}
              placeholder="e.g. 68.4 or 15000"
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Advisor / Authority Name
            </label>
            <input
              type="text"
              value={advisorName}
              onChange={e => setAdvisorName(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Dispatch Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['WHATSAPP', 'SMS', 'EMAIL'] as DispatchChannel[]).map(ch => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChannelOverride(ch)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    effectiveChannel === ch
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {ch === 'WHATSAPP' ? '💬 WhatsApp' : ch === 'SMS' ? '📱 SMS' : '✉️ Email'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDispatch}
            className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            Dispatch Parent Notice
          </button>
        </div>

        {/* Right: Real-Time Preview & Outbox */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Notice Preview Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>👁️</span>
                Recipient Simulation Preview ({effectiveChannel})
              </h2>
              <span className="text-xs text-slate-400 font-mono">To: {previewPayload.recipientContact}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                {previewPayload.title}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {previewPayload.messageBody}
              </p>
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-mono">
                <span>Passwordless HMAC Magic Link Embedded</span>
                <span>Valid for 7 Days</span>
              </div>
            </div>
          </div>

          {/* Outbox Activity Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span>
              Dispatched Outbox Activity ({outbox.length})
            </h2>

            {outbox.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No notifications dispatched yet in this session.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Student</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Channel</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Magic Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {outbox.slice().reverse().map(item => (
                      <tr key={item.notificationId} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 font-medium text-white">{item.studentId}</td>
                        <td className="py-3 text-xs text-slate-400 font-mono">
                          {item.category.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-400">
                            {item.channel}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'SENT' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleCopyLink(item.magicPortalUrl, item.notificationId)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition"
                          >
                            {copiedToken === item.notificationId ? '✓ Copied' : '🔗 Link'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
