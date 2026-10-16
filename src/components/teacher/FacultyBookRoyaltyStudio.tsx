'use client';

import React, { useState } from 'react';
import {
  BookPublicationType,
  BookPublishingStatus,
  RoyaltyCycle,
  TranslationGrant,
  FacultyBookPublishingRecord,
  UGC_CAS_BOOK_POINTS,
  STATUTORY_ROYALTY_TDS_PERCENT,
  validateIsbn13,
  createBookPublishingRecord,
  recordRoyaltyCycle,
  disburseRoyaltyToAuthor,
  sanctionTranslationGrant,
  disburseTranslationMilestone,
  exportFacultyBookPublishingLedgerCSV,
  SAMPLE_FACULTY_BOOKS,
} from '@/lib/teacher/facultyBookPublishingRoyalty';

export default function FacultyBookRoyaltyStudio() {
  const [records, setRecords] = useState<FacultyBookPublishingRecord[]>(SAMPLE_FACULTY_BOOKS);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<FacultyBookPublishingRecord | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showRoyaltyModal, setShowRoyaltyModal] = useState<boolean>(false);
  const [showGrantModal, setShowGrantModal] = useState<boolean>(false);
  const [actionRecord, setActionRecord] = useState<FacultyBookPublishingRecord | null>(null);

  // New Book Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAuthorId, setNewAuthorId] = useState('FAC-CS-2022-045');
  const [newAuthorName, setNewAuthorName] = useState('Dr. Ananya Roy');
  const [newDepartment, setNewDepartment] = useState('Computer Science & Engineering');
  const [newIsbn, setNewIsbn] = useState('978-0-12-824047-2');
  const [newPublisher, setNewPublisher] = useState('Academic Press / Elsevier');
  const [newType, setNewType] = useState<BookPublicationType>('INTERNATIONAL_PEER_REVIEWED_MONOGRAPH');
  const [newRoyaltyPercent, setNewRoyaltyPercent] = useState<number>(12);
  const [newSubsidized, setNewSubsidized] = useState<boolean>(false);
  const [newYear, setNewYear] = useState<number>(2025);
  const [formError, setFormError] = useState<string>('');

  // Royalty Cycle Form State
  const [cyclePeriod, setCyclePeriod] = useState('2025-2026 H2');
  const [cycleCopiesSold, setCycleCopiesSold] = useState<number>(250);
  const [cycleGrossSales, setCycleGrossSales] = useState<number>(375000);

  // Translation Grant Form State
  const [grantSourceLang, setGrantSourceLang] = useState('English');
  const [grantTargetLang, setGrantTargetLang] = useState('Hindi');
  const [grantAmount, setGrantAmount] = useState<number>(200000);
  const [grantError, setGrantError] = useState<string>('');

  // Notification / Feedback Toast
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Aggregated Statistics
  const totalBooks = records.length;
  const totalGrossRoyalty = records.reduce((acc, r) => acc + r.totalRoyaltyEarnedInr, 0);
  const totalTdsDeducted = records.reduce((acc, r) => {
    const tds = r.royaltyCycles.reduce((cAcc, c) => cAcc + c.tdsDeductedInr, 0);
    return acc + tds;
  }, 0);
  const totalNetDisbursed = records.reduce((acc, r) => {
    const net = r.royaltyCycles
      .filter(c => c.status === 'DISBURSED_CLEARED')
      .reduce((cAcc, c) => cAcc + c.netDisbursedInr, 0);
    return acc + net;
  }, 0);
  const totalCasPoints = records.reduce((acc, r) => acc + r.ugcCasPoints, 0);
  const totalGrantSanctioned = records.reduce(
    (acc, r) => acc + (r.translationGrant ? r.translationGrant.sanctionedAmountInr : 0),
    0
  );

  // Filtered List
  const filteredRecords = records.filter(r => {
    const matchesType = filterType === 'ALL' || r.publicationType === filterType;
    const matchesSearch =
      r.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.facultyAuthorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.isbnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.publisherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookRecordId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Handlers
  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newTitle.trim()) {
      setFormError('Book title is required');
      return;
    }

    if (!validateIsbn13(newIsbn)) {
      setFormError('Invalid 13-digit ISBN format. Must start with 978 or 979.');
      return;
    }

    try {
      const created = createBookPublishingRecord({
        facultyAuthorId: newAuthorId,
        facultyAuthorName: newAuthorName,
        department: newDepartment,
        bookTitle: newTitle,
        isbnNumber: newIsbn,
        publisherName: newPublisher,
        publicationType: newType,
        royaltyAgreementPercent: newRoyaltyPercent,
        isUniversityPressSubsidized: newSubsidized,
        publicationYear: newYear,
      });

      setRecords([created, ...records]);
      setShowAddModal(false);
      showNotification(`Academic Book "${created.bookTitle}" registered successfully! Allocated ${created.ugcCasPoints} UGC CAS Points.`);
      // Reset form
      setNewTitle('');
      setNewIsbn('978-0-12-824047-2');
    } catch (err: any) {
      setFormError(err.message || 'Failed to create academic book record');
    }
  };

  const handleOpenRoyaltyModal = (record: FacultyBookPublishingRecord) => {
    setActionRecord(record);
    setShowRoyaltyModal(true);
  };

  const handleRecordRoyalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionRecord) return;

    const { record: updatedRecord, cycle } = recordRoyaltyCycle(actionRecord, {
      cyclePeriod,
      copiesSold: cycleCopiesSold,
      grossSalesInr: cycleGrossSales,
    });

    setRecords(records.map(r => (r.bookRecordId === updatedRecord.bookRecordId ? updatedRecord : r)));
    if (selectedRecord?.bookRecordId === updatedRecord.bookRecordId) {
      setSelectedRecord(updatedRecord);
    }
    setShowRoyaltyModal(false);
    showNotification(
      `Recorded royalty statement for ${cycle.cyclePeriod}: Gross ₹${cycle.grossRoyaltyEarnedInr.toLocaleString('en-IN')}, TDS (10%) ₹${cycle.tdsDeductedInr.toLocaleString('en-IN')}.`
    );
  };

  const handleDisburseRoyalty = (record: FacultyBookPublishingRecord, cycleId: string) => {
    const res = disburseRoyaltyToAuthor(record, cycleId);
    if (!res.success) {
      showNotification(res.error || 'Failed to disburse royalty', 'error');
      return;
    }

    setRecords(records.map(r => (r.bookRecordId === res.record.bookRecordId ? res.record : r)));
    if (selectedRecord?.bookRecordId === res.record.bookRecordId) {
      setSelectedRecord(res.record);
    }
    showNotification(`Royalty successfully disbursed and cleared to faculty author account!`);
  };

  const handleOpenGrantModal = (record: FacultyBookPublishingRecord) => {
    setActionRecord(record);
    setGrantError('');
    setShowGrantModal(true);
  };

  const handleSanctionGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionRecord) return;
    setGrantError('');

    const res = sanctionTranslationGrant(actionRecord, {
      sourceLanguage: grantSourceLang,
      targetIndianLanguage: grantTargetLang,
      sanctionedAmountInr: grantAmount,
    });

    if (!res.success) {
      setGrantError(res.error || 'Failed to sanction grant');
      return;
    }

    setRecords(records.map(r => (r.bookRecordId === res.record.bookRecordId ? res.record : r)));
    if (selectedRecord?.bookRecordId === res.record.bookRecordId) {
      setSelectedRecord(res.record);
    }
    setShowGrantModal(false);
    showNotification(
      `NEP 2020 Translation Grant of ₹${grantAmount.toLocaleString('en-IN')} sanctioned for ${grantSourceLang} ➔ ${grantTargetLang}!`
    );
  };

  const handleDisburseMilestone = (record: FacultyBookPublishingRecord, milestone: 1 | 2) => {
    const res = disburseTranslationMilestone(record, milestone);
    if (!res.success) {
      showNotification(res.error || 'Failed to disburse milestone', 'error');
      return;
    }

    setRecords(records.map(r => (r.bookRecordId === res.record.bookRecordId ? res.record : r)));
    if (selectedRecord?.bookRecordId === res.record.bookRecordId) {
      setSelectedRecord(res.record);
    }
    showNotification(
      `Milestone ${milestone} (₹${res.disbursedInr.toLocaleString('en-IN')}) disbursed successfully under NEP Translation Scheme!`
    );
  };

  const handleExportCSV = () => {
    const csvContent = exportFacultyBookPublishingLedgerCSV(records);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `faculty_book_royalty_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Official Faculty Book Publishing Ledger CSV exported.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Faculty Book Publishing Royalty & Translation Studio
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                UGC CAS Table 2 Category 2 Book Research Scores • Publisher Royalties • Section 194J 10% TDS • NEP 2020 Translation Grants
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Ledger CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Register Academic Book
          </button>
        </div>
      </div>

      {/* Stat KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Registered Books</p>
          <p className="text-2xl font-bold text-white mt-1">{totalBooks}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">ISBN Cataloged</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Gross Royalty</p>
          <p className="text-2xl font-bold text-amber-300 mt-1">₹{totalGrossRoyalty.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Publisher Earnings</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-rose-400 uppercase tracking-wider">TDS (Sec 194J)</p>
          <p className="text-2xl font-bold text-rose-300 mt-1">₹{totalTdsDeducted.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">10% Statutory IT Deducted</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Disbursed Royalty</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">₹{totalNetDisbursed.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Cleared to Bank</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">UGC CAS Points</p>
          <p className="text-2xl font-bold text-indigo-300 mt-1">{totalCasPoints}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Table 2 Category 2</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-medium text-cyan-400 uppercase tracking-wider">NEP Translation</p>
          <p className="text-2xl font-bold text-cyan-300 mt-1">₹{totalGrantSanctioned.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Bhasha Grants Sanctioned</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center overflow-x-auto gap-2 border border-slate-800 rounded-lg p-1 bg-slate-900/40">
          {[
            { id: 'ALL', label: 'All Publications' },
            { id: 'INTERNATIONAL_PEER_REVIEWED_MONOGRAPH', label: 'Monographs (12 Pts)' },
            { id: 'NATIONAL_ACADEMIC_TEXTBOOK', label: 'Textbooks (10 Pts)' },
            { id: 'TRANSLATED_INDIAN_LANGUAGE_WORK', label: 'Translations (8 Pts)' },
            { id: 'EDITED_VOLUME_CHAPTER', label: 'Chapters (5 Pts)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
                filterType === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search title, ISBN, author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <svg className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Books Table / Grid */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Publication Token & Title</th>
                <th className="py-3 px-4">Author & Dept</th>
                <th className="py-3 px-4">Publisher & ISBN</th>
                <th className="py-3 px-4 text-center">UGC CAS</th>
                <th className="py-3 px-4 text-right">Copies Sold</th>
                <th className="py-3 px-4 text-right">Gross Royalty</th>
                <th className="py-3 px-4">NEP Grant</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No academic book publications match the criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(book => {
                  const hasGrant = !!book.translationGrant;
                  return (
                    <tr key={book.bookRecordId} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{book.bookTitle}</div>
                        <div className="text-[11px] text-amber-400 font-mono mt-0.5">{book.bookRecordId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{book.facultyAuthorName}</div>
                        <div className="text-[11px] text-slate-500">{book.department}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-300">{book.publisherName}</div>
                        <div className="text-[11px] font-mono text-slate-400">ISBN: {book.isbnNumber}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {book.ugcCasPoints} Points
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {book.totalCopiesSold.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-bold text-amber-300">₹{book.totalRoyaltyEarnedInr.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-slate-500">{book.royaltyAgreementPercent}% rate</div>
                      </td>
                      <td className="py-3 px-4">
                        {hasGrant ? (
                          <div>
                            <span className="text-[11px] font-semibold text-cyan-300">
                              ₹{book.translationGrant!.sanctionedAmountInr.toLocaleString('en-IN')}
                            </span>
                            <div className="text-[10px] text-cyan-400/80">
                              {book.translationGrant!.sourceLanguage} ➔ {book.translationGrant!.targetIndianLanguage}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-600 italic">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            book.status === 'ROYALTY_ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : 'bg-slate-700/30 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {book.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenRoyaltyModal(book)}
                            title="Record Royalty Cycle"
                            className="p-1.5 rounded-md hover:bg-slate-800 text-amber-400 border border-slate-800 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          {!hasGrant && (
                            <button
                              onClick={() => handleOpenGrantModal(book)}
                              title="Sanction NEP Translation Grant"
                              className="p-1.5 rounded-md hover:bg-slate-800 text-cyan-400 border border-slate-800 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedRecord(book)}
                            title="View Full Ledger & Audit Seal"
                            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer / Modal for Selected Book */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-amber-400">{selectedRecord.bookRecordId}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedRecord.bookTitle}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Author: <span className="text-slate-200">{selectedRecord.facultyAuthorName}</span> ({selectedRecord.department}) • Publisher:{' '}
                  <span className="text-slate-200">{selectedRecord.publisherName}</span> • ISBN: {selectedRecord.isbnNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {/* UGC Score & Audit Seal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">UGC CAS Table 2 Score</span>
                <p className="text-2xl font-bold text-indigo-400 mt-1">{selectedRecord.ugcCasPoints} Points</p>
                <p className="text-[11px] text-slate-500 mt-1">{selectedRecord.publicationType.replace(/_/g, ' ')}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Royalty Terms</span>
                <p className="text-2xl font-bold text-amber-400 mt-1">{selectedRecord.royaltyAgreementPercent}% Gross</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {selectedRecord.isUniversityPressSubsidized ? 'University Press Subsidized' : 'Commercial Contract'}
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase">Cryptographic Audit Seal</span>
                <p className="text-xs font-mono text-emerald-400 break-all mt-1">{selectedRecord.auditSha256}</p>
                <p className="text-[10px] text-slate-500 mt-1">SHA-256 Tamper-Proof Audit Token</p>
              </div>
            </div>

            {/* NEP Translation Grant Progress (if present) */}
            {selectedRecord.translationGrant && (
              <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <h3 className="text-sm font-bold text-cyan-300">
                      NEP 2020 Bharatiya Bhasha Translation Grant ({selectedRecord.translationGrant.grantSanctionNumber})
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-cyan-200">
                    Disbursed: ₹{selectedRecord.translationGrant.disbursedAmountInr.toLocaleString('en-IN')} / ₹
                    {selectedRecord.translationGrant.sanctionedAmountInr.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  Scheme for translating academic reference monographs into regional Indian languages ({selectedRecord.translationGrant.sourceLanguage} ➔{' '}
                  {selectedRecord.translationGrant.targetIndianLanguage}).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Milestone 1 (50% Manuscript Draft)</p>
                      <p className="text-[11px] text-slate-400">
                        ₹{(selectedRecord.translationGrant.sanctionedAmountInr * 0.5).toLocaleString('en-IN')}
                      </p>
                    </div>
                    {selectedRecord.translationGrant.milestone1Disbursed ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        CLEARED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDisburseMilestone(selectedRecord, 1)}
                        className="px-3 py-1 text-xs font-bold rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
                      >
                        Disburse M1
                      </button>
                    )}
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Milestone 2 (50% Final Publication)</p>
                      <p className="text-[11px] text-slate-400">
                        ₹{(selectedRecord.translationGrant.sanctionedAmountInr * 0.5).toLocaleString('en-IN')}
                      </p>
                    </div>
                    {selectedRecord.translationGrant.milestone2Disbursed ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        CLEARED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDisburseMilestone(selectedRecord, 2)}
                        disabled={!selectedRecord.translationGrant.milestone1Disbursed}
                        className={`px-3 py-1 text-xs font-bold rounded transition ${
                          selectedRecord.translationGrant.milestone1Disbursed
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Disburse M2
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Royalty Statements Cycle Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden mb-6">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Biannual Publisher Royalty Statements & TDS Deductions
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Sec 194J 10% TDS Applied</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Period</th>
                      <th className="py-2.5 px-4 text-right">Copies Sold</th>
                      <th className="py-2.5 px-4 text-right">Gross Sales</th>
                      <th className="py-2.5 px-4 text-right">Gross Royalty</th>
                      <th className="py-2.5 px-4 text-right">TDS (10%)</th>
                      <th className="py-2.5 px-4 text-right">Net Payable</th>
                      <th className="py-2.5 px-4">Status & Ref</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {selectedRecord.royaltyCycles.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-500">
                          No royalty statement cycles recorded yet.
                        </td>
                      </tr>
                    ) : (
                      selectedRecord.royaltyCycles.map(cycle => (
                        <tr key={cycle.cycleId} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-4 font-semibold text-white">{cycle.cyclePeriod}</td>
                          <td className="py-2.5 px-4 text-right">{cycle.copiesSold.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-4 text-right">₹{cycle.grossSalesInr.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-4 text-right font-medium text-amber-300">
                            ₹{cycle.grossRoyaltyEarnedInr.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 text-right text-rose-300 font-medium">
                            ₹{cycle.tdsDeductedInr.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-emerald-300">
                            ₹{cycle.netDisbursedInr.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-4">
                            {cycle.status === 'DISBURSED_CLEARED' ? (
                              <div>
                                <span className="text-[10px] font-bold text-emerald-400">CLEARED</span>
                                <div className="text-[10px] font-mono text-slate-500">{cycle.payoutReferenceNumber}</div>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-400">PENDING</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            {cycle.status === 'CALCULATED_PENDING' && (
                              <button
                                onClick={() => handleDisburseRoyalty(selectedRecord, cycle.cycleId)}
                                className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
                              >
                                Disburse
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Academic Book */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h2 className="text-lg font-bold text-white">Register Academic Book Publication</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateBook} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern Electric Vehicle Powertrain Control"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Faculty Author Name *</label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={e => setNewAuthorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">ISBN-13 (Standard) *</label>
                  <input
                    type="text"
                    required
                    value={newIsbn}
                    onChange={e => setNewIsbn(e.target.value)}
                    placeholder="978-0-12-824047-2"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Publisher Name *</label>
                  <input
                    type="text"
                    required
                    value={newPublisher}
                    onChange={e => setNewPublisher(e.target.value)}
                    placeholder="e.g. Oxford University Press / Springer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Publication Type (UGC CAS) *</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as BookPublicationType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="INTERNATIONAL_PEER_REVIEWED_MONOGRAPH">International Monograph (12 Pts)</option>
                    <option value="NATIONAL_ACADEMIC_TEXTBOOK">National Textbook (10 Pts)</option>
                    <option value="TRANSLATED_INDIAN_LANGUAGE_WORK">Indian Language Translation (8 Pts)</option>
                    <option value="EDITED_VOLUME_CHAPTER">Edited Volume Chapter (5 Pts)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Royalty Agreement (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newRoyaltyPercent}
                    onChange={e => setNewRoyaltyPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="subsidizedPress"
                  checked={newSubsidized}
                  onChange={e => setNewSubsidized(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
                />
                <label htmlFor="subsidizedPress" className="text-slate-300">
                  Published under University Press Publication Subsidy Scheme
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                >
                  Register Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Royalty Statement */}
      {showRoyaltyModal && actionRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Record Royalty Statement</h2>
                <p className="text-xs text-slate-400 mt-0.5">{actionRecord.bookTitle}</p>
              </div>
              <button onClick={() => setShowRoyaltyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRecordRoyalty} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Cycle Period *</label>
                <input
                  type="text"
                  required
                  value={cyclePeriod}
                  onChange={e => setCyclePeriod(e.target.value)}
                  placeholder="e.g. 2025-2026 H2"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Copies Sold</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={cycleCopiesSold}
                    onChange={e => setCycleCopiesSold(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Gross Sales (INR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={cycleGrossSales}
                    onChange={e => setCycleGrossSales(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Calculated Breakdown Preview */}
              {(() => {
                const estGrossRoyalty = Math.round(cycleGrossSales * (actionRecord.royaltyAgreementPercent / 100));
                const estTds = Math.round(estGrossRoyalty * 0.1);
                const estNet = estGrossRoyalty - estTds;
                return (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Royalty Rate:</span>
                      <span className="text-slate-200 font-medium">{actionRecord.royaltyAgreementPercent}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Gross Royalty:</span>
                      <span className="text-amber-300 font-bold">₹{estGrossRoyalty.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Statutory TDS (10% under Sec 194J):</span>
                      <span className="text-rose-400 font-medium">- ₹{estTds.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between text-white font-bold text-sm">
                      <span>Net Disbursable:</span>
                      <span className="text-emerald-400">₹{estNet.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRoyaltyModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                >
                  Save Royalty Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Sanction NEP Translation Grant */}
      {showGrantModal && actionRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Sanction NEP 2020 Translation Grant</h2>
                <p className="text-xs text-slate-400 mt-0.5">{actionRecord.bookTitle}</p>
              </div>
              <button onClick={() => setShowGrantModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {grantError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200">
                {grantError}
              </div>
            )}

            <form onSubmit={handleSanctionGrant} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Source Language</label>
                  <input
                    type="text"
                    required
                    value={grantSourceLang}
                    onChange={e => setGrantSourceLang(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Indian Language</label>
                  <input
                    type="text"
                    required
                    value={grantTargetLang}
                    onChange={e => setGrantTargetLang(e.target.value)}
                    placeholder="Hindi / Tamil / Bengali / Marathi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Sanctioned Amount (Max ₹2,50,000 under NEP Scheme)
                </label>
                <input
                  type="number"
                  min="10000"
                  max="250000"
                  step="5000"
                  required
                  value={grantAmount}
                  onChange={e => setGrantAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Disbursed in two equal milestones: 50% on first-half manuscript, 50% on printed publication.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
                >
                  Sanction Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
