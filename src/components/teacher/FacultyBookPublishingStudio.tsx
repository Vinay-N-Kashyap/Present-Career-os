'use client';

import React, { useState } from 'react';
import {
  PublicationType,
  CreativeCommonsLicense,
  AcademicBookRecord,
  AuthorContributor,
  UGC_API_POINTS_MATRIX,
  INITIAL_BOOK_PUBLICATIONS,
  registerAcademicPublication,
  depositToOpenAccessRepository,
  exportFacultyBookPublicationsCSV,
} from '@/lib/teacher/facultyBookPublication';

export default function FacultyBookPublishingStudio() {
  const [publications, setPublications] = useState<AcademicBookRecord[]>(INITIAL_BOOK_PUBLICATIONS);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedPub, setSelectedPub] = useState<AcademicBookRecord | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);

  // Add Publication Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<PublicationType>('INTERNATIONAL_MONOGRAPH_BOOK');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newPublisher, setNewPublisher] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newEdition, setNewEdition] = useState('');
  const [newPeerReviewed, setNewPeerReviewed] = useState(true);
  const [newIsOpenAccess, setNewIsOpenAccess] = useState(false);
  const [newLicense, setNewLicense] = useState<CreativeCommonsLicense>('CC_BY_4_0');

  // Authors State in Form
  const [authorsList, setAuthorsList] = useState<Omit<AuthorContributor, 'allocatedApiScore'>[]>([
    {
      authorId: 'AUT-1',
      fullName: 'Dr. Siddharth Sen',
      institutionName: 'PinIT University',
      isFirstAuthor: true,
      isCorrespondingAuthor: true,
    },
  ]);

  // Deposit Modal State
  const [depositLicense, setDepositLicense] = useState<CreativeCommonsLicense>('CC_BY_4_0');

  // Feedback Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showMsg = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // KPIs
  const totalPublications = publications.length;
  const totalApiScore = publications
    .reduce((acc, p) => acc + p.authors.reduce((sum, a) => sum + a.allocatedApiScore, 0), 0)
    .toFixed(1);
  const openAccessCount = publications.filter((p) => p.isOpenAccess).length;
  const internationalCount = publications.filter((p) => p.publicationType.includes('INTERNATIONAL')).length;
  const internationalPct = totalPublications > 0 ? ((internationalCount / totalPublications) * 100).toFixed(0) : '0';

  // Filters
  const filteredPubs = selectedType === 'ALL'
    ? publications
    : publications.filter((p) => p.publicationType === selectedType);

  // Authors management in form
  const handleAddAuthorRow = () => {
    setAuthorsList([
      ...authorsList,
      {
        authorId: `AUT-${Date.now()}`,
        fullName: '',
        institutionName: 'PinIT University',
        isFirstAuthor: false,
        isCorrespondingAuthor: false,
      },
    ]);
  };

  const handleUpdateAuthor = (index: number, field: string, value: any) => {
    const updated = [...authorsList];
    (updated[index] as any)[field] = value;
    setAuthorsList(updated);
  };

  const handleRemoveAuthor = (index: number) => {
    if (authorsList.length === 1) return;
    setAuthorsList(authorsList.filter((_, idx) => idx !== index));
  };

  // Handlers
  const handleRegisterPublication = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = registerAcademicPublication({
        title: newTitle,
        publicationType: newType,
        department: newDept,
        publisherName: newPublisher,
        isbn: newIsbn,
        publicationYear: Number(newYear),
        editionOrVolume: newEdition,
        isPeerReviewed: newPeerReviewed,
        isOpenAccess: newIsOpenAccess,
        license: newLicense,
        authors: authorsList,
      });

      setPublications([created, ...publications]);
      setShowAddModal(false);
      // Reset form
      setNewTitle('');
      setNewPublisher('');
      setNewIsbn('');
      setNewEdition('');
      showMsg(`Academic publication '${created.title}' recorded (${created.trackingToken}) with ${created.totalApiPointsBase} UGC CAS points.`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleDepositRepository = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPub) return;
    try {
      const updated = depositToOpenAccessRepository(selectedPub, depositLicense);
      setPublications(publications.map((p) => (p.publicationId === updated.publicationId ? updated : p)));
      setSelectedPub(updated);
      setShowDepositModal(false);
      showMsg(`Deposited to Institutional Open-Access Repository! Assigned DOI: ${updated.repositoryDoiUri}`, 'success');
    } catch (err: any) {
      showMsg(err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    const csv = exportFacultyBookPublicationsCSV(publications);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Faculty_Book_Publications_CAS_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showMsg('UGC CAS Book Publications Ledger CSV exported successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Faculty Academic Book Publication & Open-Access Repository Studio
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Statutory Compliance: UGC Regulations (Table 2 CAS Category 3 - Books, Edited Volumes & Chapters) & Institutional Open-Access Repository (DOI).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>+</span> Register Publication
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
          >
            <span>📥</span> Export UGC CSV
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Authored Publications</div>
          <div className="text-2xl font-bold text-white mt-2">{totalPublications}</div>
          <div className="text-slate-500 text-xs mt-1">Monographs, Volumes & Chapters</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total CAS Category 3 Points</div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">{totalApiScore}</div>
          <div className="text-slate-500 text-xs mt-1">UGC Table 2 Verified Points</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Open-Access Repository</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{openAccessCount}</div>
          <div className="text-slate-500 text-xs mt-1">Indexed with Campus DOI</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">International Publishers</div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{internationalPct}%</div>
          <div className="text-slate-500 text-xs mt-1">{internationalCount} of {totalPublications} Titles</div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'INTERNATIONAL_MONOGRAPH_BOOK', 'NATIONAL_MONOGRAPH_BOOK', 'CHAPTER_IN_EDITED_BOOK', 'EDITOR_INTERNATIONAL_BOOK', 'EDITOR_NATIONAL_BOOK'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedType === t
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Publications List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPubs.map((pub) => {
          return (
            <div
              key={pub.publicationId}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded text-xs font-semibold">
                      {pub.publicationType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {pub.trackingToken}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                      UGC Base: {pub.totalApiPointsBase} API Points
                    </span>
                    {pub.isOpenAccess ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-teal-950 text-teal-300 border border-teal-800">
                        OPEN ACCESS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400">
                        RESTRICTED
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-1.5">{pub.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Publisher: <span className="text-slate-200 font-medium">{pub.publisherName}</span> | ISBN: <span className="text-slate-200 font-mono">{pub.isbn}</span> | Year: <span className="text-slate-200">{pub.publicationYear}</span>
                    {pub.editionOrVolume && <span> | {pub.editionOrVolume}</span>}
                  </p>
                  {pub.repositoryDoiUri && (
                    <div className="text-xs text-indigo-400 mt-1 font-mono flex items-center gap-1.5">
                      <span>🔗 Repository DOI:</span>
                      <span className="underline select-all">{pub.repositoryDoiUri}</span>
                      <span className="text-slate-500 font-sans">({pub.license.replace(/_/g, ' ')})</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!pub.isOpenAccess && (
                    <button
                      onClick={() => {
                        setSelectedPub(pub);
                        setShowDepositModal(true);
                      }}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-medium transition"
                    >
                      Deposit to Open-Access Repository
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPub(pub);
                      setShowSealModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-medium transition"
                  >
                    View Cryptographic Seal
                  </button>
                </div>
              </div>

              {/* Authors Roster & UGC 70/30 Distribution */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>Author Credits & UGC CAS Point Allocation (70/30 Formula)</span>
                  <span className="text-slate-500 font-normal">Principal/Corr: 70% | Co-Authors: 30%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pub.authors.map((author) => (
                    <div
                      key={author.authorId}
                      className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-semibold text-white">{author.fullName}</div>
                          <div className="text-[11px] text-slate-400">{author.institutionName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-indigo-400">{author.allocatedApiScore} pts</div>
                          <div className="text-[10px] text-slate-500">API Score</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {author.isFirstAuthor && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-950 text-blue-300 border border-blue-800">
                            First Author (Principal)
                          </span>
                        )}
                        {author.isCorrespondingAuthor && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-950 text-purple-300 border border-purple-800">
                            Corresponding Author
                          </span>
                        )}
                        {!author.isFirstAuthor && !author.isCorrespondingAuthor && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                            Co-Author (30% Pool)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Register Publication */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-white">📖 Register Academic Book / Chapter Publication</h3>
            <p className="text-xs text-slate-400">
              UGC Regulations Table 2 (Category 3). Points will be split automatically using the 70% principal / 30% co-author rule.
            </p>
            <form onSubmit={handleRegisterPublication} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Book / Chapter Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Systems"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Publication Category</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as PublicationType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="INTERNATIONAL_MONOGRAPH_BOOK">International Publisher Book (12 pts)</option>
                    <option value="NATIONAL_MONOGRAPH_BOOK">National Publisher Book (10 pts)</option>
                    <option value="CHAPTER_IN_EDITED_BOOK">Chapter in Edited Book (5 pts)</option>
                    <option value="EDITOR_INTERNATIONAL_BOOK">Editor of International Volume (10 pts)</option>
                    <option value="EDITOR_NATIONAL_BOOK">Editor of National Volume (8 pts)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Publisher Name</label>
                  <input
                    type="text"
                    value={newPublisher}
                    onChange={(e) => setNewPublisher(e.target.value)}
                    placeholder="e.g. Cambridge University Press"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Standard ISBN (10 or 13)</label>
                  <input
                    type="text"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    placeholder="e.g. 978-0-521-86697-2"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Edition / Volume / Chapter Details (Optional)</label>
                <input
                  type="text"
                  value={newEdition}
                  onChange={(e) => setNewEdition(e.target.value)}
                  placeholder="e.g. 1st Edition or Chapter 4, pp. 110-145"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>

              {/* Authors List Builder */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">Author Contributors ({authorsList.length})</span>
                  <button
                    type="button"
                    onClick={handleAddAuthorRow}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
                  >
                    + Add Co-Author
                  </button>
                </div>
                {authorsList.map((author, idx) => (
                  <div key={author.authorId} className="p-3 bg-slate-950 border border-slate-800 rounded space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={author.fullName}
                        onChange={(e) => handleUpdateAuthor(idx, 'fullName', e.target.value)}
                        placeholder="Author Full Name"
                        className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                        required
                      />
                      <input
                        type="text"
                        value={author.institutionName}
                        onChange={(e) => handleUpdateAuthor(idx, 'institutionName', e.target.value)}
                        placeholder="Affiliated Institution"
                        className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={author.isFirstAuthor}
                            onChange={(e) => handleUpdateAuthor(idx, 'isFirstAuthor', e.target.checked)}
                          />
                          <span>First / Principal</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={author.isCorrespondingAuthor}
                            onChange={(e) => handleUpdateAuthor(idx, 'isCorrespondingAuthor', e.target.checked)}
                          />
                          <span>Corresponding</span>
                        </label>
                      </div>
                      {authorsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(idx)}
                          className="text-rose-400 hover:text-rose-300 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Open Access Toggle */}
              <div className="flex items-center gap-4 border-t border-slate-800 pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newIsOpenAccess}
                    onChange={(e) => setNewIsOpenAccess(e.target.checked)}
                  />
                  <span>Index in Institutional Open-Access Repository (Assigns Campus DOI)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Save Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Deposit Open Access */}
      {showDepositModal && selectedPub && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">🌐 Deposit to Institutional Repository</h3>
            <p className="text-xs text-slate-400">
              Deposit "{selectedPub.title}" into the campus open-access research repository and assign a permanent DOI resolver.
            </p>
            <form onSubmit={handleDepositRepository} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Creative Commons Open Access License</label>
                <select
                  value={depositLicense}
                  onChange={(e) => setDepositLicense(e.target.value as CreativeCommonsLicense)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                >
                  <option value="CC_BY_4_0">CC BY 4.0 (Attribution - Standard Open Access)</option>
                  <option value="CC_BY_NC_4_0">CC BY-NC 4.0 (Non-Commercial)</option>
                  <option value="CC_BY_ND_4_0">CC BY-ND 4.0 (No Derivatives)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded font-medium"
                >
                  Confirm Deposit & Mint DOI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Cryptographic Seal Inspector */}
      {showSealModal && selectedPub && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔐</span> Tamper-Proof Cryptographic Publication Seal
            </h3>
            <p className="text-xs text-slate-400">
              Immutable SHA-256 digest bound to title, publisher, ISBN, author shares, and repository DOI.
            </p>
            <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
              {selectedPub.cryptographicPublicationSeal || 'PENDING_SEAL'}
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <div><strong className="text-slate-300">Tracking Token:</strong> {selectedPub.trackingToken}</div>
              <div><strong className="text-slate-300">Title:</strong> {selectedPub.title}</div>
              <div><strong className="text-slate-300">ISBN:</strong> {selectedPub.isbn}</div>
              <div><strong className="text-slate-300">Last Verified:</strong> {selectedPub.lastUpdated}</div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSealModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
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
