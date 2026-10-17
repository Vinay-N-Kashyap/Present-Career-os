'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  HostelBlock,
  HostelRoom,
  MaintenanceTicket,
  NightOutPass,
  StudentGender,
  MaintenanceCategory,
  TicketPriority,
  TicketStatus,
  getBlocks,
  getRooms,
  allocateRoomBed,
  vacateRoomBed,
  createMaintenanceTicket,
  updateMaintenanceTicketStatus,
  getMaintenanceTickets,
  getNightPasses,
  approveNightOutPass,
  checkoutNightPass,
  recordNightPassReturn,
  computeHostelOccupancySummary,
  exportHostelRosterCSV,
  seedHostelData
} from '@/lib/admin/hostelManagement';

interface HostelFacilityManagerProps {
  institutionId?: string;
}

export const HostelFacilityManager: React.FC<HostelFacilityManagerProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'maintenance' | 'nightPasses'>('rooms');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [allocationError, setAllocationError] = useState<string | null>(null);

  // Allocation Form State
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [allocStudentId, setAllocStudentId] = useState('');
  const [allocStudentName, setAllocStudentName] = useState('');
  const [allocEnrollment, setAllocEnrollment] = useState('');
  const [allocGender, setAllocGender] = useState<StudentGender>('MALE');

  // Ticket Form State
  const [ticketBlockId, setTicketBlockId] = useState('');
  const [ticketRoomNumber, setTicketRoomNumber] = useState('');
  const [ticketStudentId, setTicketStudentId] = useState('');
  const [ticketStudentName, setTicketStudentName] = useState('');
  const [ticketCategory, setTicketCategory] = useState<MaintenanceCategory>('PLUMBING');
  const [ticketPriority, setTicketPriority] = useState<TicketPriority>('MEDIUM');
  const [ticketDescription, setTicketDescription] = useState('');

  // Initial Seed
  useEffect(() => {
    const existing = getBlocks(institutionId);
    if (existing.length === 0) {
      seedHostelData(institutionId);
      setRefreshKey(k => k + 1);
    }
  }, [institutionId]);

  const blocks = useMemo(() => getBlocks(institutionId), [institutionId, refreshKey]);
  const rooms = useMemo(() => getRooms(institutionId), [institutionId, refreshKey]);
  const tickets = useMemo(() => getMaintenanceTickets(institutionId), [institutionId, refreshKey]);
  const passes = useMemo(() => getNightPasses(institutionId), [institutionId, refreshKey]);
  const summary = useMemo(() => computeHostelOccupancySummary(institutionId), [institutionId, refreshKey]);

  const blockMap = useMemo(() => {
    return new Map(blocks.map(b => [b.id, b]));
  }, [blocks]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchesBlock = selectedBlockId === 'ALL' || r.blockId === selectedBlockId;
      const matchesSearch = r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.occupants.some(o => o.studentName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesBlock && matchesSearch;
    });
  }, [rooms, selectedBlockId, searchTerm]);

  const handleExportCSV = () => {
    const csvContent = exportHostelRosterCSV(institutionId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Hostel_Allocation_Roster_${institutionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    setAllocationError(null);

    if (!selectedRoomId || !allocStudentId.trim() || !allocStudentName.trim() || !allocEnrollment.trim()) {
      setAllocationError('Please fill in all required fields');
      return;
    }

    const res = allocateRoomBed({
      institutionId,
      roomId: selectedRoomId,
      studentId: allocStudentId.trim(),
      studentName: allocStudentName.trim(),
      enrollmentNumber: allocEnrollment.trim(),
      gender: allocGender
    });

    if (!res.success) {
      setAllocationError(res.error || 'Failed to allocate bed');
      return;
    }

    // Success
    setAllocStudentId('');
    setAllocStudentName('');
    setAllocEnrollment('');
    setShowAllocateModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleVacate = (roomId: string, studentId: string) => {
    if (confirm('Are you sure you want to vacate this student from their room?')) {
      vacateRoomBed(institutionId, roomId, studentId);
      setRefreshKey(k => k + 1);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketRoomNumber.trim() || !ticketDescription.trim()) return;

    createMaintenanceTicket({
      institutionId,
      blockId: ticketBlockId || blocks[0]?.id || 'BLK-BH1',
      roomNumber: ticketRoomNumber.trim(),
      reportedByStudentId: ticketStudentId.trim() || 'STU-ANON',
      reportedByStudentName: ticketStudentName.trim() || 'Resident Student',
      category: ticketCategory,
      priority: ticketPriority,
      description: ticketDescription.trim(),
    });

    setTicketRoomNumber('');
    setTicketDescription('');
    setShowTicketModal(false);
    setRefreshKey(k => k + 1);
  };

  const handleTicketStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateMaintenanceTicketStatus(ticketId, newStatus, newStatus === 'IN_PROGRESS' ? 'Facilities Duty Technician' : undefined);
    setRefreshKey(k => k + 1);
  };

  const handleApproveNightPass = (passId: string) => {
    approveNightOutPass(passId, 'Resident Hostel Warden', true);
    setRefreshKey(k => k + 1);
  };

  const handleCheckoutPass = (passId: string) => {
    checkoutNightPass(passId);
    setRefreshKey(k => k + 1);
  };

  const handleReturnPass = (passId: string) => {
    recordNightPassReturn(passId);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Campus Hostels & Residential Housing Portal</h1>
              <p className="text-sm text-slate-400">
                Facility Allocation • Bed Inventory • Maintenance SLAs • Curfew & Night-Out Compliance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export AICTE Housing CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Occupancy Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-indigo-400">{summary.occupancyRate}%</h3>
            <span className="text-xs text-slate-400">({summary.occupiedBeds} / {summary.totalCapacityBeds} beds)</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${summary.occupancyRate}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Available Beds</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-emerald-400">{summary.availableBeds}</h3>
            <span className="text-xs text-slate-400">vacant for allotment</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Across {summary.totalBlocks} Residential Halls</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Open Maintenance Issues</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-amber-400">{summary.openMaintenanceTickets}</h3>
            <span className="text-xs text-slate-400">active tickets</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Plumbing, electrical & Wi-Fi queues</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Night-Out Passes</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-extrabold text-cyan-400">{summary.pendingNightPasses}</h3>
            <span className="text-xs text-slate-400">awaiting approval</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Curfew cut-off: 21:30 hrs</p>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'rooms'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Room Allocation Matrix ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'maintenance'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Maintenance Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('nightPasses')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'nightPasses'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Night-Out Passes ({passes.length})
          </button>
        </div>

        {activeTab === 'rooms' && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search room or student..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 w-full sm:w-60"
            />
            <select
              value={selectedBlockId}
              onChange={e => setSelectedBlockId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Blocks</option>
              {blocks.map(b => (
                <option key={b.id} value={b.id}>{b.code} ({b.name})</option>
              ))}
            </select>
            <button
              onClick={() => {
                setAllocationError(null);
                setShowAllocateModal(true);
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shrink-0"
            >
              + Allocate Bed
            </button>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <button
            onClick={() => setShowTicketModal(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shrink-0"
          >
            + Log Maintenance Issue
          </button>
        )}
      </div>

      {/* Tab 1: Rooms Matrix */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map(room => {
            const block = blockMap.get(room.blockId);
            const isFull = room.occupants.length >= room.capacity;
            return (
              <div
                key={room.id}
                className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-400">{block?.code || 'BLK'}</span>
                      <h3 className="text-lg font-bold text-white">{room.roomNumber}</h3>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      room.status === 'OCCUPIED'
                        ? 'bg-rose-900/40 text-rose-300 border-rose-500/40'
                        : room.status === 'AVAILABLE'
                        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-900/40 text-amber-300 border-amber-500/40'
                    }`}>
                      {room.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Floor {room.floor} • Type: <span className="text-slate-200 font-semibold">{room.roomType}</span> ({room.occupants.length}/{room.capacity} Beds)</p>
                    <p>Fee: ₹{(room.feePerSemesterINR).toLocaleString('en-IN')} / semester</p>
                    <p className="text-slate-300">Amenities: {room.amenities.join(', ')}</p>
                  </div>

                  {/* Occupants List */}
                  <div className="pt-2 border-t border-slate-700/50 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Occupants</p>
                    {room.occupants.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No occupants allocated to this room yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {room.occupants.map(occ => (
                          <div key={occ.studentId} className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg text-xs">
                            <div>
                              <p className="font-semibold text-white">{occ.studentName}</p>
                              <p className="text-slate-400 font-mono">{occ.enrollmentNumber} ({occ.gender})</p>
                            </div>
                            <button
                              onClick={() => handleVacate(room.id, occ.studentId)}
                              className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/50"
                            >
                              Vacate
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {!isFull && room.status !== 'MAINTENANCE' && (
                  <button
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setAllocationError(null);
                      setShowAllocateModal(true);
                    }}
                    className="w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold text-xs rounded-lg border border-indigo-500/40 transition"
                  >
                    + Allocate Bed to Student
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Maintenance Tickets */}
      {activeTab === 'maintenance' && (
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400">
              No active maintenance tickets logged.
            </div>
          ) : (
            tickets.map(ticket => (
              <div
                key={ticket.id}
                className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-400">{ticket.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">
                      Room {ticket.roomNumber}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-700 text-slate-300">
                      {ticket.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      ticket.priority === 'EMERGENCY'
                        ? 'bg-rose-900/60 text-rose-300 border border-rose-600'
                        : ticket.priority === 'HIGH'
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-600'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{ticket.description}</h3>
                  <p className="text-xs text-slate-400">
                    Reported by: <span className="text-slate-300">{ticket.reportedByStudentName}</span> • Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    {ticket.assignedTechnician && ` • Assigned: ${ticket.assignedTechnician}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    ticket.status === 'RESOLVED'
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40'
                      : ticket.status === 'IN_PROGRESS'
                      ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/40'
                      : 'bg-amber-900/40 text-amber-300 border border-amber-500/40'
                  }`}>
                    {ticket.status}
                  </span>

                  {ticket.status === 'OPEN' && (
                    <button
                      onClick={() => handleTicketStatusChange(ticket.id, 'IN_PROGRESS')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded"
                    >
                      Dispatch Tech
                    </button>
                  )}

                  {ticket.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleTicketStatusChange(ticket.id, 'RESOLVED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Night-Out Passes */}
      {activeTab === 'nightPasses' && (
        <div className="space-y-3">
          {passes.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400">
              No night-out passes requested.
            </div>
          ) : (
            passes.map(pass => (
              <div
                key={pass.id}
                className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-5 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-400">{pass.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">
                      Room {pass.roomNumber}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      pass.parentConsentVerified ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                    }`}>
                      {pass.parentConsentVerified ? 'Parental Consent Verified' : 'No Parent Consent'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{pass.studentName} &rarr; {pass.destination}</h3>
                  <p className="text-xs text-slate-400">
                    Departure: <span className="text-slate-300">{new Date(pass.departureTimestamp).toLocaleString()}</span> • Expected Return: <span className="text-slate-300">{new Date(pass.expectedReturnTimestamp).toLocaleString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    pass.status === 'RETURNED'
                      ? 'bg-slate-700 text-slate-300'
                      : pass.status === 'CHECKED_OUT'
                      ? 'bg-blue-900/40 text-blue-300 border border-blue-500/40'
                      : pass.status === 'APPROVED'
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40'
                      : pass.status === 'OVERDUE'
                      ? 'bg-rose-900/40 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-900/40 text-amber-300 border border-amber-500/40'
                  }`}>
                    {pass.status}
                  </span>

                  {pass.status === 'REQUESTED' && (
                    <button
                      onClick={() => handleApproveNightPass(pass.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
                    >
                      Verify & Approve
                    </button>
                  )}

                  {pass.status === 'APPROVED' && (
                    <button
                      onClick={() => handleCheckoutPass(pass.id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded"
                    >
                      Gate Check-Out
                    </button>
                  )}

                  {(pass.status === 'CHECKED_OUT' || pass.status === 'OVERDUE') && (
                    <button
                      onClick={() => handleReturnPass(pass.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
                    >
                      Gate Return In
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Allocate Bed Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Allocate Hostel Bed</h3>
              <button onClick={() => setShowAllocateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {allocationError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-300 text-xs">
                {allocationError}
              </div>
            )}

            <form onSubmit={handleAllocate} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Room</label>
                <select
                  required
                  value={selectedRoomId}
                  onChange={e => setSelectedRoomId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="">Select an available room...</option>
                  {rooms
                    .filter(r => r.occupants.length < r.capacity && r.status !== 'MAINTENANCE')
                    .map(r => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} ({r.roomType} - {r.capacity - r.occupants.length} beds free)
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={allocStudentName}
                  onChange={e => setAllocStudentName(e.target.value)}
                  placeholder="e.g. Siddharth Verma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Student ID</label>
                  <input
                    type="text"
                    required
                    value={allocStudentId}
                    onChange={e => setAllocStudentId(e.target.value)}
                    placeholder="STU-3091"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Enrollment No.</label>
                  <input
                    type="text"
                    required
                    value={allocEnrollment}
                    onChange={e => setAllocEnrollment(e.target.value)}
                    placeholder="ENG-2024-204"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Gender</label>
                <select
                  value={allocGender}
                  onChange={e => setAllocGender(e.target.value as StudentGender)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other / Non-Binary</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Hostel gender policy is strictly validated on submit.</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                >
                  Confirm Bed Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Maintenance Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Log Hostel Maintenance Issue</h3>
              <button onClick={() => setShowTicketModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Hostel Block</label>
                  <select
                    value={ticketBlockId}
                    onChange={e => setTicketBlockId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    {blocks.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={ticketRoomNumber}
                    onChange={e => setTicketRoomNumber(e.target.value)}
                    placeholder="e.g. BH1-204"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={e => setTicketCategory(e.target.value as MaintenanceCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="PLUMBING">Plumbing</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="CARPENTRY">Carpentry</option>
                    <option value="CLEANLINESS">Cleanliness / Housekeeping</option>
                    <option value="HVAC_WIFI">HVAC & Wi-Fi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={e => setTicketPriority(e.target.value as TicketPriority)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="EMERGENCY">Emergency (Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Description</label>
                <textarea
                  required
                  rows={3}
                  value={ticketDescription}
                  onChange={e => setTicketDescription(e.target.value)}
                  placeholder="Detail the defect, location in room, and severity..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
