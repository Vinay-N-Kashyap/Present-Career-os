'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  CampusVenue,
  CampusEvent,
  EventCategory,
  EventStatus,
  getVenues,
  getCampusEvents,
  requestCampusEvent,
  updateEventApprovalStatus,
  computeEventGovernanceSummary,
  exportCampusEventsCSV,
  seedCampusEventData
} from '@/lib/admin/campusEvents';

interface CampusEventsManagerProps {
  institutionId?: string;
}

export const CampusEventsManager: React.FC<CampusEventsManagerProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'VENUES'>('EVENTS');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('TECHNICAL_SYMPOSIUM');
  const [venueId, setVenueId] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [advisorName, setAdvisorName] = useState('');
  const [studentLead, setStudentLead] = useState('');
  const [startDate, setStartDate] = useState('2026-11-20T10:00');
  const [endDate, setEndDate] = useState('2026-11-20T16:00');
  const [attendees, setAttendees] = useState(200);
  const [keynoteSpeakers, setKeynoteSpeakers] = useState('');

  // Initial Seed
  useEffect(() => {
    const existingVenues = getVenues(institutionId);
    if (existingVenues.length === 0) {
      seedCampusEventData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const venues = useMemo(() => getVenues(institutionId), [institutionId, refreshKey]);
  const events = useMemo(() => getCampusEvents(institutionId), [institutionId, refreshKey]);
  const summary = useMemo(() => computeEventGovernanceSummary(institutionId), [institutionId, refreshKey]);

  useEffect(() => {
    if (venues.length > 0 && !venueId) {
      setVenueId(venues[0].id);
    }
  }, [venues, venueId]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.organizingClubOrDept.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [events, categoryFilter, statusFilter, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportCampusEventsCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NAAC_Criterion_5_3_Campus_Events_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    const speakersList = keynoteSpeakers.split(',').map(s => s.trim()).filter(Boolean);

    const res = requestCampusEvent({
      institutionId,
      title: title.trim(),
      category,
      venueId,
      organizingClubOrDept: organizer.trim() || 'Student Activity Council',
      facultyAdvisorName: advisorName.trim() || 'Dr. Aris Thorne',
      studentLeadName: studentLead.trim() || 'Student Coordinator',
      startDateTime: new Date(startDate).toISOString(),
      endDateTime: new Date(endDate).toISOString(),
      expectedAttendees: Number(attendees),
      keynoteSpeakers: speakersList.length > 0 ? speakersList : undefined
    });

    if (!res.success) {
      setBookingError(res.error || 'Failed to request event');
      return;
    }

    setShowRequestModal(false);
    setTitle('');
    setKeynoteSpeakers('');
    setAttendees(200);
    setRefreshKey(k => k + 1);
  };

  const handleStatusAdvance = (eventId: string, newStatus: EventStatus) => {
    updateEventApprovalStatus(eventId, newStatus);
    setRefreshKey(k => k + 1);
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'ESTATE_OFFICE_SANCTIONED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">SANCTIONED</span>;
      case 'FACULTY_ADVISOR_APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">ADVISOR ENDORSED</span>;
      case 'REQUESTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">UNDER REVIEW</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-800">REJECTED</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">COMPLETED</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Campus Events & Auditorium Scheduling Console
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
              NAAC Criterion 5.3
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Centralized spatial allocation, double-booking prevention, CPCB noise regulations, and keynote visitor pass engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Schedule Campus Event
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export NAAC 5.3 CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Venues & Capacity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Auditorium Inventory</span>
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.totalVenues}</span>
            <span className="text-slate-400 text-xs">venues registered</span>
          </div>
          <p className="mt-3 text-xs text-indigo-300">
            Total capacity: <span className="font-semibold text-white">4,000+ seats</span>
          </p>
        </div>

        {/* Card 2: Events Sanctioned */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Sanctioned Events</span>
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.totalEventsSanctioned}</span>
            <span className="text-slate-400 text-xs">cleared by Estate Office</span>
          </div>
          <p className="mt-3 text-xs text-emerald-400">
            Est. Utilization: <span className="font-semibold">{summary.averageAuditoriumUtilizationPercent}%</span>
          </p>
        </div>

        {/* Card 3: Pending Approvals */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Pending Clearance</span>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.pendingApprovalsCount}</span>
            <span className="text-slate-400 text-xs">requests in review</span>
          </div>
          <p className="mt-3 text-xs text-amber-300">
            Advisor / Estate Office action needed
          </p>
        </div>

        {/* Card 4: Guest Keynotes & Passes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <span>Keynote Visitors</span>
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{summary.activeKeynotesCount}</span>
            <span className="text-slate-400 text-xs">speakers pass-issued</span>
          </div>
          <p className="mt-3 text-xs text-cyan-300">
            Security escort codes generated
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('EVENTS')}
          className={`pb-2 px-1 text-sm font-semibold transition ${
            activeTab === 'EVENTS'
              ? 'border-b-2 border-indigo-500 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Scheduled Campus Events ({filteredEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('VENUES')}
          className={`pb-2 px-1 text-sm font-semibold transition ${
            activeTab === 'VENUES'
              ? 'border-b-2 border-indigo-500 text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Venues & Auditoriums ({venues.length})
        </button>
      </div>

      {/* Tab 1: Scheduled Events */}
      {activeTab === 'EVENTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search event title, venue, or dept..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Categories</option>
                <option value="TECHNICAL_SYMPOSIUM">Technical Symposium</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="ACADEMIC_CONFERENCE">Academic Conference</option>
                <option value="CULTURAL_FEST">Cultural Fest</option>
                <option value="GUEST_KEYNOTE">Guest Keynote</option>
                <option value="SPORTS_TOURNAMENT">Sports Tournament</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ESTATE_OFFICE_SANCTIONED">Sanctioned</option>
                <option value="FACULTY_ADVISOR_APPROVED">Advisor Endorsed</option>
                <option value="REQUESTED">Under Review</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Event ID & Title</th>
                  <th className="py-3 px-3">Venue & Schedule</th>
                  <th className="py-3 px-3">Attendees</th>
                  <th className="py-3 px-3">Keynote Speakers & Passes</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Governance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredEvents.map(event => (
                  <tr key={event.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{event.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {event.organizingClubOrDept} | Adv: {event.facultyAdvisorName}
                      </div>
                      <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{event.id}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-200">{event.venueName}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(event.startDateTime).toLocaleDateString()} {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {!event.noiseClearanceObtained && (
                        <span className="text-[10px] text-amber-400 font-medium">⚠ CPCB Noise Permit Req.</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-white">{event.expectedAttendees}</span>
                      <span className="text-slate-400 text-[11px]"> delegates</span>
                    </td>

                    <td className="py-3.5 px-3">
                      {event.keynoteSpeakers && event.keynoteSpeakers.length > 0 ? (
                        <div className="space-y-1">
                          <div className="text-slate-300 font-medium">{event.keynoteSpeakers.join(', ')}</div>
                          <div className="text-[10px] text-cyan-400 font-mono">
                            Pass: {event.visitorPassCodes?.join(', ')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Internal Event</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {getStatusBadge(event.status)}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {event.status === 'REQUESTED' && (
                          <button
                            onClick={() => handleStatusAdvance(event.id, 'FACULTY_ADVISOR_APPROVED')}
                            className="px-2 py-1 bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-300 rounded text-[11px] font-medium border border-cyan-700/50"
                          >
                            Advisor Endorse
                          </button>
                        )}

                        {event.status === 'FACULTY_ADVISOR_APPROVED' && (
                          <button
                            onClick={() => handleStatusAdvance(event.id, 'ESTATE_OFFICE_SANCTIONED')}
                            className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 rounded text-[11px] font-medium border border-emerald-700/50"
                          >
                            Sanction Venue
                          </button>
                        )}

                        {event.status === 'ESTATE_OFFICE_SANCTIONED' && (
                          <button
                            onClick={() => handleStatusAdvance(event.id, 'COMPLETED')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-medium border border-slate-700"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Venues Inventory */}
      {activeTab === 'VENUES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {venues.map(venue => (
            <div key={venue.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900">
                  {venue.type.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-white">{venue.seatingCapacity} Seats</span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{venue.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{venue.locationBlock}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="font-semibold text-slate-400">AV & Infrastructure:</div>
                <div className="flex flex-wrap gap-1.5">
                  {venue.avEquipment.map((eq, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-800 rounded text-[11px] text-slate-300">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className={venue.isAirConditioned ? 'text-emerald-400' : 'text-slate-500'}>
                  {venue.isAirConditioned ? '❄ AC Equipped' : 'Non-AC'}
                </span>
                <span className={venue.noisePermitRequired ? 'text-amber-400' : 'text-slate-500'}>
                  {venue.noisePermitRequired ? '🔊 CPCB Permit Mandatory' : 'Standard Decibel Cap'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Schedule Campus Event</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {bookingError && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-3 rounded-lg">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Annual Tech Symposium"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as EventCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="TECHNICAL_SYMPOSIUM">Technical Symposium</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="ACADEMIC_CONFERENCE">Academic Conference</option>
                    <option value="CULTURAL_FEST">Cultural Fest</option>
                    <option value="GUEST_KEYNOTE">Guest Keynote</option>
                    <option value="SPORTS_TOURNAMENT">Sports Tournament</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Venue</label>
                  <select
                    value={venueId}
                    onChange={e => setVenueId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  >
                    {venues.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.seatingCapacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={attendees}
                    onChange={e => setAttendees(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Organizing Body</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dept of CSE"
                    value={organizer}
                    onChange={e => setOrganizer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Faculty Advisor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Aris Thorne"
                    value={advisorName}
                    onChange={e => setAdvisorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Student Lead</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sen"
                    value={studentLead}
                    onChange={e => setStudentLead(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Keynote Speakers (Comma-separated, for Visitor Passes)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Doe (MIT), John Smith (Google)"
                  value={keynoteSpeakers}
                  onChange={e => setKeynoteSpeakers(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
