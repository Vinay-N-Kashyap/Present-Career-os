'use client';

import React, { useState, useMemo } from 'react';
import {
  Instrument,
  SlotBooking,
  InstrumentCategory,
  UserCategory,
  OperatorMode,
  BookingStatus,
  getAllInstruments,
  getAllBookings,
  registerCrfBooking,
  updateBookingStatus,
  calculateTariffCharge,
  exportCrfBookingsCSV,
  isInstrumentBookable,
} from '@/lib/admin/centralResearchFacility';

export default function CentralResearchFacilityManager() {
  const [instruments] = useState<Instrument[]>(() => getAllInstruments());
  const [bookings, setBookings] = useState<SlotBooking[]>(() => getAllBookings());
  const [selectedCategory, setSelectedCategory] = useState<InstrumentCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [statusModalBooking, setStatusModalBooking] = useState<SlotBooking | null>(null);
  const [digestModalBooking, setDigestModalBooking] = useState<SlotBooking | null>(null);

  // Booking Form State
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(instruments[0]?.id || 'EQ-001');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [requesterAffiliation, setRequesterAffiliation] = useState('Department of Physics, PinIT');
  const [userCategory, setUserCategory] = useState<UserCategory>('INTERNAL_STUDENT');
  const [sampleDescription, setSampleDescription] = useState('');
  const [hazardsDeclared, setHazardsDeclared] = useState(false);
  const [hazardDetails, setHazardDetails] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-10-22');
  const [timeSlot, setTimeSlot] = useState('10:00 - 12:00');
  const [durationHours, setDurationHours] = useState(2);
  const [operatorMode, setOperatorMode] = useState<OperatorMode>('TECHNICIAN_ASSISTED');

  // Status Form State
  const [targetStatus, setTargetStatus] = useState<BookingStatus>('SAMPLE_RUN_COMPLETED');
  const [technicianNotes, setTechnicianNotes] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Instruments
  const filteredInstruments = useMemo(() => {
    return instruments.filter((inst) => {
      const matchCat = selectedCategory === 'ALL' || inst.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.instrumentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.makeModel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [instruments, selectedCategory, searchQuery]);

  // Aggregate Telemetry
  const stats = useMemo(() => {
    const totalInstruments = instruments.length;
    const operationalCount = instruments.filter((i) => i.status === 'OPERATIONAL').length;
    const totalBookings = bookings.length;
    const commercialRevenue = bookings
      .filter((b) => b.userCategory === 'INDUSTRY_RND' || b.userCategory === 'EXTERNAL_ACADEMIC')
      .reduce((acc, b) => acc + b.totalChargeInr, 0);

    const internalBookings = bookings.filter(
      (b) => b.userCategory === 'INTERNAL_STUDENT' || b.userCategory === 'INTERNAL_FACULTY'
    ).length;
    const internalUtilization = totalBookings > 0 ? Math.round((internalBookings / totalBookings) * 100) : 0;

    return { totalInstruments, operationalCount, totalBookings, commercialRevenue, internalUtilization };
  }, [instruments, bookings]);

  // Live tariff preview
  const liveTariff = useMemo(() => {
    const inst = instruments.find((i) => i.id === selectedEquipmentId);
    if (!inst) return 0;
    return calculateTariffCharge(inst.ratesPerHour, userCategory, durationHours, operatorMode);
  }, [selectedEquipmentId, userCategory, durationHours, operatorMode, instruments]);

  const handleExportCSV = () => {
    const csvContent = exportCrfBookingsCSV(bookings);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CRF_Equipment_Bookings_ISTEM_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('I-STEM & DST-FIST CRF slot ledger CSV exported successfully.');
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requesterName.trim() || !requesterEmail.trim() || !sampleDescription.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const res = registerCrfBooking({
      instrumentId: selectedEquipmentId,
      instrumentName: '',
      requesterName: requesterName.trim(),
      requesterEmail: requesterEmail.trim(),
      requesterAffiliation: requesterAffiliation.trim(),
      userCategory,
      sampleDescription: sampleDescription.trim(),
      hazardsDeclared,
      hazardDetails: hazardsDeclared ? hazardDetails.trim() : undefined,
      bookingDate,
      timeSlot,
      durationHours: Number(durationHours),
      operatorMode,
      status: 'APPROVED_SCHEDULED',
      totalChargeInr: liveTariff,
      createdDate: new Date().toISOString().split('T')[0],
    });

    if (!res.success || !res.booking) {
      alert(`Booking Failed: ${res.error}`);
      return;
    }

    setBookings(getAllBookings());
    setIsBookModalOpen(false);
    // Reset inputs
    setRequesterName('');
    setRequesterEmail('');
    setSampleDescription('');
    setHazardsDeclared(false);
    setHazardDetails('');
    showToast(`Slot booked successfully! Token: ${res.booking.bookingToken}`);
  };

  const handleOpenStatus = (booking: SlotBooking) => {
    setStatusModalBooking(booking);
    setTargetStatus(booking.status);
    setTechnicianNotes(booking.technicianNotes || '');
  };

  const handleSubmitStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalBooking) return;

    updateBookingStatus(statusModalBooking.id, targetStatus, technicianNotes.trim() || undefined);
    setBookings(getAllBookings());
    setStatusModalBooking(null);
    showToast(`Booking ${statusModalBooking.bookingToken} updated to ${targetStatus}.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl border border-emerald-400 flex items-center space-x-2 animate-bounce">
          <svg className="w-5 h-5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-950/70 rounded-lg border border-indigo-700/60 text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Central Research Instrumentation Facility (CRF / CUIF) Console
              </h1>
              <p className="text-sm text-slate-400">
                DST-FIST & National I-STEM Advanced Equipment Scheduler, Differential Tariffs & Slot Allocation
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export I-STEM CSV</span>
          </button>
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Book Analytical Slot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CRF Inventory</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.totalInstruments} Instruments</h3>
            <p className="text-xs text-emerald-400 mt-1">{stats.operationalCount} Operational (100%)</p>
          </div>
          <div className="w-12 h-12 bg-indigo-950/60 border border-indigo-800/60 rounded-xl flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Bookings</p>
            <h3 className="text-2xl font-bold text-sky-400 mt-1">{stats.totalBookings} Active Slots</h3>
            <p className="text-xs text-slate-500 mt-1">Multi-Tier Allocated</p>
          </div>
          <div className="w-12 h-12 bg-sky-950/60 border border-sky-800/60 rounded-xl flex items-center justify-center text-sky-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Commercial Revenue</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">₹{(stats.commercialRevenue / 1000).toFixed(1)}k</h3>
            <p className="text-xs text-slate-500 mt-1">Industry & External Academic</p>
          </div>
          <div className="w-12 h-12 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center justify-center text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Academic Access</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">{stats.internalUtilization}%</h3>
            <p className="text-xs text-slate-500 mt-1">In-House PhD & Student Subsidized</p>
          </div>
          <div className="w-12 h-12 bg-purple-950/60 border border-purple-800/60 rounded-xl flex items-center justify-center text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            All Instruments ({instruments.length})
          </button>
          <button
            onClick={() => setSelectedCategory('ELECTRON_MICROSCOPY')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'ELECTRON_MICROSCOPY'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Electron Microscopy
          </button>
          <button
            onClick={() => setSelectedCategory('SPECTROSCOPY')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'SPECTROSCOPY'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Spectroscopy (NMR)
          </button>
          <button
            onClick={() => setSelectedCategory('DIFFRACTION_XRAY')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'DIFFRACTION_XRAY'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            X-Ray Diffraction
          </button>
          <button
            onClick={() => setSelectedCategory('MASS_SPECTROMETRY')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'MASS_SPECTROMETRY'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            Mass Spectrometry
          </button>
          <button
            onClick={() => setSelectedCategory('SUPERCOMPUTING')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'SUPERCOMPUTING'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            DGX Supercomputing
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search equipment, make/model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Equipment Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInstruments.map((inst) => {
          const bookableCheck = isInstrumentBookable(inst);

          return (
            <div
              key={inst.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/80">
                    {inst.instrumentCode}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">{inst.name}</h3>
                  <p className="text-xs text-slate-400">{inst.makeModel}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    inst.status === 'OPERATIONAL'
                      ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                      : 'bg-amber-950 border border-amber-800 text-amber-400'
                  }`}
                >
                  {inst.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div>📍 {inst.location}</div>
                <div>👤 Lead: <span className="text-slate-300 font-medium">{inst.custodianFaculty}</span></div>
                <div>🔧 Operator: <span className="text-slate-300">{inst.operatorTechnician}</span></div>
                <div>📅 Next Calibration: <span className="text-slate-300">{inst.nextCalibrationDueDate}</span></div>
              </div>

              {/* Differential Tariff Table */}
              <div className="grid grid-cols-3 gap-1 text-center text-[10px] bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block">In-House</span>
                  <span className="font-bold text-emerald-400">₹{inst.ratesPerHour.internalAcademic}/h</span>
                </div>
                <div>
                  <span className="text-slate-500 block">External Uni</span>
                  <span className="font-bold text-sky-400">₹{inst.ratesPerHour.externalAcademic}/h</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Industry</span>
                  <span className="font-bold text-purple-400">₹{inst.ratesPerHour.industryCommercial}/h</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  disabled={!bookableCheck.isBookable}
                  onClick={() => {
                    setSelectedEquipmentId(inst.id);
                    setIsBookModalOpen(true);
                  }}
                  className={`w-full py-1.5 text-xs font-semibold rounded transition-colors ${
                    bookableCheck.isBookable
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {bookableCheck.isBookable ? 'Reserve Analytical Slot' : 'Equipment Unavailable'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookings Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg space-y-3">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>CRF Analytical Slot Bookings & Test Audit Ledger</span>
          </h2>
          <span className="text-xs text-slate-400">Showing {bookings.length} reservations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Token & Equipment</th>
                <th className="py-3 px-4">Requester & Affiliation</th>
                <th className="py-3 px-4">Tier & Sample</th>
                <th className="py-3 px-4">Slot & Operator</th>
                <th className="py-3 px-4">Tariff & Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-indigo-400 block">{b.bookingToken}</span>
                    <span className="text-slate-300 font-medium text-xs mt-0.5 block">{b.instrumentName}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-200 block">{b.requesterName}</span>
                    <span className="text-[11px] text-slate-400 block">{b.requesterAffiliation}</span>
                    <span className="text-[10px] text-slate-500">{b.requesterEmail}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                      {b.userCategory.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-1">{b.sampleDescription}</p>
                    {b.hazardsDeclared && (
                      <span className="inline-block mt-0.5 text-[10px] text-rose-400 font-semibold">⚠️ Hazardous</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-200">{b.bookingDate}</div>
                    <div className="text-[11px] text-slate-400">{b.timeSlot} ({b.durationHours}h)</div>
                    <div className="text-[10px] text-slate-500 font-medium">{b.operatorMode}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-emerald-400 text-sm">₹{b.totalChargeInr.toLocaleString()}</div>
                    {b.status === 'APPROVED_SCHEDULED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 border border-sky-800 text-sky-400">
                        SCHEDULED
                      </span>
                    )}
                    {b.status === 'SAMPLE_RUN_COMPLETED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-800 text-emerald-400">
                        RUN COMPLETED
                      </span>
                    )}
                    {b.status === 'INVOICED_PAID' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 border border-purple-800 text-purple-400">
                        INVOICED & PAID
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleOpenStatus(b)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white rounded border border-slate-700 text-xs font-medium transition-colors"
                    >
                      Status
                    </button>
                    {b.cryptographicDigest && (
                      <button
                        onClick={() => setDigestModalBooking(b)}
                        className="px-2.5 py-1 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded text-xs font-medium transition-colors"
                      >
                        Audit Seal
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Book Analytical Slot */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Book CRF Analytical Equipment Slot</h3>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Instrument</label>
                <select
                  value={selectedEquipmentId}
                  onChange={(e) => setSelectedEquipmentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                >
                  {instruments.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.instrumentCode}: {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Requester Name</label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="e.g. Aarohi Shenoy"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    placeholder="e.g. aarohi@pinit.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Institutional Affiliation</label>
                  <input
                    type="text"
                    value={requesterAffiliation}
                    onChange={(e) => setRequesterAffiliation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">User Category (Tariff Tier)</label>
                  <select
                    value={userCategory}
                    onChange={(e) => setUserCategory(e.target.value as UserCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="INTERNAL_STUDENT">Internal Student / PhD Scholar</option>
                    <option value="INTERNAL_FACULTY">Internal Faculty</option>
                    <option value="EXTERNAL_ACADEMIC">External Academic (Other Univ)</option>
                    <option value="INDUSTRY_RND">Industry R&D Commercial Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Sample Description & Material Type</label>
                <textarea
                  rows={2}
                  value={sampleDescription}
                  onChange={(e) => setSampleDescription(e.target.value)}
                  placeholder="e.g. Nanocrystalline titanium thin film on silicon substrate..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="10:00 - 12:00"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Operator Mode</label>
                  <select
                    value={operatorMode}
                    onChange={(e) => setOperatorMode(e.target.value as OperatorMode)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="TECHNICIAN_ASSISTED">CRF Technician Assisted</option>
                    <option value="SELF_OPERATED">Self-Operated (Certified User)</option>
                  </select>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
                  <span className="text-slate-400 block text-[10px]">Calculated Charge</span>
                  <span className="text-base font-bold text-emerald-400">₹{liveTariff.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold"
                >
                  Confirm Slot Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Run Status */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Update Analytical Run Status</h3>
                <p className="text-xs text-indigo-400 font-mono mt-0.5">{statusModalBooking.bookingToken}</p>
              </div>
              <button
                onClick={() => setStatusModalBooking(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Analytical Run Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as BookingStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                >
                  <option value="APPROVED_SCHEDULED">Approved / Scheduled</option>
                  <option value="SAMPLE_RUN_COMPLETED">Sample Run Completed</option>
                  <option value="INVOICED_PAID">Invoiced & Paid</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Technician Analytical Notes</label>
                <textarea
                  rows={3}
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  placeholder="Spectra resolution, detector sensitivity notes, or raw data file URI..."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStatusModalBooking(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold"
                >
                  Save Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Test Audit Digest */}
      {digestModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🔬</span>
                <h3 className="text-base font-bold text-white">CRF Analytical Test Audit Digest</h3>
              </div>
              <button
                onClick={() => setDigestModalBooking(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Booking Token</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{digestModalBooking.bookingToken}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Instrument</span>
                <span className="text-slate-200 font-medium">{digestModalBooking.instrumentName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Requester</span>
                <span className="text-slate-300 font-medium">{digestModalBooking.requesterName} ({digestModalBooking.requesterAffiliation})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Slot Run</span>
                <span className="text-slate-300">{digestModalBooking.bookingDate} at {digestModalBooking.timeSlot} ({digestModalBooking.durationHours}h)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">SHA-256 Cryptographic Test Audit Digest</span>
                <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-emerald-300 break-all">
                  {digestModalBooking.cryptographicDigest}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDigestModalBooking(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
              >
                Close Audit Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
