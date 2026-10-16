'use client';

import React, { useState, useMemo } from 'react';
import {
  GuestBookingRecord,
  GuestCategory,
  RoomType,
  BookingStage,
  SEED_GUEST_BOOKINGS,
  registerGuestBooking,
  updateGuestBookingStatus,
  exportGuestHouseBookingsCSV,
} from '@/lib/admin/centralGuestHouse';

export default function CentralGuestHouseManager() {
  const [bookings, setBookings] = useState<GuestBookingRecord[]>(SEED_GUEST_BOOKINGS);
  const [selectedCategory, setSelectedCategory] = useState<GuestCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [stageModalBooking, setStageModalBooking] = useState<GuestBookingRecord | null>(null);
  const [sealModalBooking, setSealModalBooking] = useState<GuestBookingRecord | null>(null);

  // New Booking Form State
  const [guestName, setGuestName] = useState('');
  const [guestDesignation, setGuestDesignation] = useState('External Academic Viva Examiner');
  const [guestCategory, setGuestCategory] = useState<GuestCategory>('CATEGORY_A_INSTITUTIONAL');
  const [roomType, setRoomType] = useState<RoomType>('EXECUTIVE_DELUXE');
  const [roomNumber, setRoomNumber] = useState('Deluxe-203');
  const [checkInDate, setCheckInDate] = useState('2026-03-20');
  const [checkOutDate, setCheckOutDate] = useState('2026-03-22');
  const [sponsoringDepartment, setSponsoringDepartment] = useState('Computer Science & Engineering');
  const [sponsoringFacultyPi, setSponsoringFacultyPi] = useState('Prof. Arvind Swaminathan');
  const [vipProtocolRequired, setVipProtocolRequired] = useState(false);

  // Stage Advancement Form State
  const [targetStage, setTargetStage] = useState<BookingStage>('ESTATE_OFFICER_APPROVED');
  const [remarks, setRemarks] = useState('Sanctioned as per Institutional Guest entitlement norms.');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesCat = selectedCategory === 'ALL' || b.guestCategory === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.bookingRefNumber.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.roomNumber.toLowerCase().includes(q) ||
        b.sponsoringDepartment.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [bookings, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const catACount = bookings.filter((b) => b.guestCategory === 'CATEGORY_A_INSTITUTIONAL').length;
    const active = bookings.filter((b) => b.stage !== 'CANCELLED' && b.stage !== 'CHECKED_OUT_BILLED').length;
    const revenue = bookings.reduce((acc, b) => acc + b.totalBillingAmount, 0);
    return { total, catACount, active, revenue };
  }, [bookings]);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !roomNumber.trim()) {
      showToast('Please provide guest name and room number');
      return;
    }

    try {
      const created = registerGuestBooking(bookings, {
        guestName: guestName.trim(),
        guestDesignation: guestDesignation.trim(),
        guestCategory,
        roomType,
        roomNumber: roomNumber.trim(),
        checkInDate,
        checkOutDate,
        sponsoringDepartment: sponsoringDepartment.trim(),
        sponsoringFacultyPi: sponsoringFacultyPi.trim() || undefined,
        vipProtocolRequired,
      });

      setBookings([created, ...bookings]);
      setIsNewBookingModalOpen(false);
      setGuestName('');
      showToast(`Booking ${created.bookingRefNumber} requested successfully!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reserving room';
      showToast(`Reservation failed: ${msg}`);
    }
  };

  const handleAdvanceStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageModalBooking) return;

    const updated = updateGuestBookingStatus(stageModalBooking, targetStage, remarks.trim());
    setBookings(bookings.map((b) => (b.bookingId === updated.bookingId ? updated : b)));
    setStageModalBooking(null);
    showToast(`Booking stage advanced to ${targetStage.replace(/_/g, ' ')}!`);
  };

  const handleExportCSV = () => {
    const csv = exportGuestHouseBookingsCSV(bookings);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `University_Guest_House_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Guest house room ledger CSV exported successfully');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl text-sm font-medium animate-bounce flex items-center gap-2 border border-emerald-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-rose-500/20 text-rose-300 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-rose-500/30 uppercase">
                Estate Office & VIP Protocol
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Transit Accommodation Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Central University Guest House & VIP Protocol Console
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Institutional guest reservation management, multi-tier tariff allocations (Category A/B/C),
              VIP protocol reception services, and Estate Office hospitality billing audits.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewBookingModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 border border-rose-400/40 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Reserve Room
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2 border border-slate-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Estate CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
          <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">{stats.total}</p>
          <div className="text-xs text-rose-400 mt-2 flex items-center gap-1 font-medium">
            <span>{stats.active} current/upcoming</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Institutional Guests</p>
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 mt-1">{stats.catACount}</p>
          <div className="text-xs text-amber-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>100% University sponsored</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Occupancy Rate</p>
          <p className="text-2xl md:text-3xl font-extrabold text-emerald-400 mt-1">86%</p>
          <div className="text-xs text-emerald-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Optimal transit capacity</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tariff Revenue</p>
          <p className="text-2xl md:text-3xl font-extrabold text-sky-400 mt-1">₹{stats.revenue.toLocaleString('en-IN')}</p>
          <div className="text-xs text-sky-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Estate Office collections</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'ALL',
              'CATEGORY_A_INSTITUTIONAL',
              'CATEGORY_B_ACADEMIC_VISITOR',
              'CATEGORY_C_PERSONAL_GENERAL',
            ] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition border ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL'
                ? 'All Bookings'
                : cat === 'CATEGORY_A_INSTITUTIONAL'
                ? 'Cat A: Institutional'
                : cat === 'CATEGORY_B_ACADEMIC_VISITOR'
                ? 'Cat B: Visiting Scholars'
                : 'Cat C: Personal / General'}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking, guest, room, dept..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p className="text-slate-400 font-medium">No guest house reservations found</p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.bookingId}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg space-y-5"
            >
              {/* Header Row */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-rose-950 text-rose-300 border border-rose-700/50 px-2.5 py-1 rounded-md">
                    {b.bookingRefNumber}
                  </span>
                  <span className="font-bold text-xs bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded-full border border-slate-700">
                    {b.roomNumber} ({b.roomType.replace(/_/g, ' ')})
                  </span>
                  <span className="text-xs bg-slate-800/70 text-slate-400 px-2.5 py-0.5 rounded-full">
                    {b.guestCategory.replace(/_/g, ' ')}
                  </span>
                  {b.vipProtocolRequired && (
                    <span className="text-[11px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-bold animate-pulse">
                      VIP Protocol Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                      b.stage === 'CHECKED_OUT_BILLED'
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : b.stage === 'CHECKED_IN'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : b.stage === 'ESTATE_OFFICER_APPROVED'
                        ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {b.stage.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Guest Details */}
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-base font-bold text-white">{b.guestName}</h3>
                  <span className="text-xs text-slate-400">({b.guestDesignation})</span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 mt-2">
                  <span>
                    <strong className="text-slate-300">Department:</strong> {b.sponsoringDepartment}
                  </span>
                  {b.sponsoringFacultyPi && (
                    <span>
                      <strong className="text-slate-300">Host Faculty:</strong> {b.sponsoringFacultyPi}
                    </span>
                  )}
                  <span>
                    <strong className="text-slate-300">Stay:</strong> {b.checkInDate} to {b.checkOutDate} ({b.durationDays} days)
                  </span>
                </div>
                {b.approvalRemarks && (
                  <p className="text-xs text-slate-300 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40 mt-2.5">
                    {b.approvalRemarks}
                  </p>
                )}
              </div>

              {/* Billing Summary Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400 block">Tariff Rate:</span>
                  <span className="text-slate-200 font-bold text-sm">
                    {b.tariffPerDay === 0 ? 'Free (Sponsored)' : `₹${b.tariffPerDay}/day`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Stay Duration:</span>
                  <span className="text-slate-200 font-semibold text-sm">{b.durationDays} Days</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Billing:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {b.totalBillingAmount === 0 ? '₹0.00 (Cat A Waiver)' : `₹${b.totalBillingAmount.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Protocol Status:</span>
                  <span className="text-emerald-400 font-semibold text-sm">
                    {b.vipProtocolRequired ? 'Car + Escort' : 'Standard Host'}
                  </span>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-slate-800/60">
                <div className="text-xs text-slate-400">
                  Room allocated under Estate Office Central Guest House Schedule of Charges.
                </div>

                <div className="flex items-center gap-2">
                  {b.cryptographicSeal && (
                    <button
                      onClick={() => setSealModalBooking(b)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Inspect Seal
                    </button>
                  )}

                  {b.stage !== 'CHECKED_OUT_BILLED' && b.stage !== 'CANCELLED' && (
                    <button
                      onClick={() => {
                        setStageModalBooking(b);
                        if (b.stage === 'REQUESTED') setTargetStage('ESTATE_OFFICER_APPROVED');
                        else if (b.stage === 'ESTATE_OFFICER_APPROVED') setTargetStage('CHECKED_IN');
                        else if (b.stage === 'CHECKED_IN') setTargetStage('CHECKED_OUT_BILLED');
                      }}
                      className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-medium px-3.5 py-1.5 rounded-lg transition border border-rose-400/40"
                    >
                      Update Stage
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: New Booking */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Reserve Guest House Room</h3>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Guest Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Prof. R. G. Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Designation / Affiliation
                  </label>
                  <input
                    type="text"
                    required
                    value={guestDesignation}
                    onChange={(e) => setGuestDesignation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Guest Category
                  </label>
                  <select
                    value={guestCategory}
                    onChange={(e) => setGuestCategory(e.target.value as GuestCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="CATEGORY_A_INSTITUTIONAL">Category A: Institutional (Sponsored)</option>
                    <option value="CATEGORY_B_ACADEMIC_VISITOR">Category B: Visiting Academic (Subsidized)</option>
                    <option value="CATEGORY_C_PERSONAL_GENERAL">Category C: Personal / General (Commercial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Room Type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  >
                    <option value="VIP_PRESIDENTIAL_SUITE">VIP Presidential Suite</option>
                    <option value="EXECUTIVE_DELUXE">Executive Deluxe</option>
                    <option value="STANDARD_DOUBLE">Standard Double</option>
                    <option value="TRANSIT_SCHOLAR_STUDIO">Transit Scholar Studio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. Deluxe-205"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Sponsoring Department
                  </label>
                  <input
                    type="text"
                    required
                    value={sponsoringDepartment}
                    onChange={(e) => setSponsoringDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Host Faculty PI (Optional)
                  </label>
                  <input
                    type="text"
                    value={sponsoringFacultyPi}
                    onChange={(e) => setSponsoringFacultyPi(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vipCheck"
                  checked={vipProtocolRequired}
                  onChange={(e) => setVipProtocolRequired(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-rose-600 focus:ring-0"
                />
                <label htmlFor="vipCheck" className="text-xs text-rose-300 font-semibold">
                  VIP Protocol Car & Escort Service Required
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Stage */}
      {stageModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Update Reservation Status</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{stageModalBooking.bookingRefNumber}</p>
              </div>
              <button
                onClick={() => setStageModalBooking(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdvanceStage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Target Stage
                </label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as BookingStage)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                >
                  <option value="ESTATE_OFFICER_APPROVED">Estate Officer Approved</option>
                  <option value="CHECKED_IN">Guest Checked-In</option>
                  <option value="CHECKED_OUT_BILLED">Checked-Out & Billed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Estate Office Remarks / Folio
                </label>
                <input
                  type="text"
                  required
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStageModalBooking(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SHA-256 Seal Inspector */}
      {sealModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">Cryptographic Reservation Seal</h3>
              </div>
              <button
                onClick={() => setSealModalBooking(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Booking Reference:</span>
                <span className="font-mono text-rose-400 font-semibold">{sealModalBooking.bookingRefNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Guest & Room:</span>
                <span className="text-slate-200 font-medium">
                  {sealModalBooking.guestName} ({sealModalBooking.roomNumber})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Total Billing:</span>
                <span className="text-amber-400 font-bold font-mono">
                  ₹{sealModalBooking.totalBillingAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">SHA-256 Digest:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 break-all font-mono text-[11px] text-emerald-400">
                  {sealModalBooking.cryptographicSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalBooking(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
