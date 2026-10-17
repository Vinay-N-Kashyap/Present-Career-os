'use client';

import React, { useState } from 'react';
import {
  LibraryItem,
  LibraryCheckout,
  LibraryAssetType,
  digitalLibraryStore,
  exportLibraryCatalogCSV,
} from '@/lib/admin/libraryCatalog';

interface DigitalLibraryCatalogProps {
  institutionId?: string;
}

const SEED_CATALOG: LibraryItem[] = [
  {
    itemId: 'bk-cs-01',
    institutionId: 'inst-apex-001',
    title: 'Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems',
    authors: ['Martin Kleppmann'],
    isbnOrDoi: '978-1449373320',
    assetType: 'PHYSICAL_BOOK',
    publisher: "O'Reilly Media",
    publicationYear: 2017,
    department: 'Computer Science',
    rfidTag: 'RFID-99482-CS',
    totalCopies: 6,
    availableCopies: 4,
    isDigitalAccessible: true,
    digitalAccessUrl: 'https://library.career-os.internal/books/ddia.pdf',
  },
  {
    itemId: 'jr-ieee-02',
    institutionId: 'inst-apex-001',
    title: 'Attention Is All You Need: Scaling Transformers Across Multimodal Architectures',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
    isbnOrDoi: '10.1145/3292500.3330701',
    assetType: 'JOURNAL_PAPER',
    publisher: 'IEEE / ACM Transactions on Neural Systems',
    publicationYear: 2023,
    department: 'Computer Science',
    totalCopies: 1,
    availableCopies: 1,
    isDigitalAccessible: true,
    digitalAccessUrl: 'https://ieee.career-os.internal/papers/transformer-scaling.pdf',
  },
  {
    itemId: 'bk-os-03',
    institutionId: 'inst-apex-001',
    title: 'Operating Systems: Three Easy Pieces',
    authors: ['Remzi H. Arpaci-Dusseau', 'Andrea C. Arpaci-Dusseau'],
    isbnOrDoi: '978-1985086593',
    assetType: 'PHYSICAL_BOOK',
    publisher: 'Arpaci-Dusseau Books',
    publicationYear: 2018,
    department: 'Computer Science',
    rfidTag: 'RFID-11203-CS',
    totalCopies: 5,
    availableCopies: 3,
    isDigitalAccessible: true,
    digitalAccessUrl: 'https://ostep.org',
  },
  {
    itemId: 'th-it-04',
    institutionId: 'inst-apex-001',
    title: 'Decentralized Zero-Knowledge Proofs for Verifiable Credential Issuance in Academic Registrars',
    authors: ['Dr. Vikram Singhal'],
    isbnOrDoi: 'THESIS-APEX-2024-001',
    assetType: 'INSTITUTIONAL_THESIS',
    publisher: 'Apex University Institutional Repository',
    publicationYear: 2024,
    department: 'Information Technology',
    totalCopies: 2,
    availableCopies: 2,
    isDigitalAccessible: true,
    digitalAccessUrl: 'https://repository.apex.edu/theses/2024-001.pdf',
  },
];

export const DigitalLibraryCatalog: React.FC<DigitalLibraryCatalogProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  // Seed store if empty
  useState(() => {
    const existing = digitalLibraryStore.searchCatalog({ institutionId });
    if (existing.length === 0) {
      for (const item of SEED_CATALOG) digitalLibraryStore.addCatalogItem(item);
    }
  });

  const [activeTab, setActiveTab] = useState<'catalog' | 'checkouts'>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [assetFilter, setAssetFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Checkout modal state
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [studentName, setStudentName] = useState<string>('Rohan Varma');
  const [studentId, setStudentId] = useState<string>('CS2026-015');

  const [catalog, setCatalog] = useState<LibraryItem[]>(() =>
    digitalLibraryStore.searchCatalog({ institutionId })
  );

  const [checkouts, setCheckouts] = useState<LibraryCheckout[]>(() =>
    digitalLibraryStore.getCheckoutsByInstitution(institutionId)
  );

  const refreshAll = () => {
    setCatalog(digitalLibraryStore.searchCatalog({ institutionId }));
    setCheckouts(digitalLibraryStore.getCheckoutsByInstitution(institutionId));
  };

  const filteredItems = catalog.filter(item => {
    if (assetFilter !== 'ALL' && item.assetType !== assetFilter) return false;
    if (deptFilter !== 'ALL' && item.department.toLowerCase() !== deptFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        item.title.toLowerCase().includes(q) ||
        item.authors.some(a => a.toLowerCase().includes(q)) ||
        item.isbnOrDoi.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalCopies = catalog.reduce((s, i) => s + i.totalCopies, 0);
  const availableCopies = catalog.reduce((s, i) => s + i.availableCopies, 0);
  const digitalCount = catalog.filter(i => i.isDigitalAccessible).length;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const chk = digitalLibraryStore.checkoutItem({
        institutionId,
        itemId: selectedItem.itemId,
        studentId,
        studentName,
      });

      setSelectedItem(null);
      refreshAll();
      setBannerNotice(`Checked out "${chk.itemTitle}" to ${chk.studentName}! Due in 14 days.`);
      setTimeout(() => setBannerNotice(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'CHECKOUT_FAILED';
      setBannerNotice(`Checkout error: ${msg}`);
      setTimeout(() => setBannerNotice(null), 4000);
    }
  };

  const handleReturn = (checkoutId: string) => {
    try {
      const chk = digitalLibraryStore.returnItem(checkoutId);
      refreshAll();
      setBannerNotice(`Item returned successfully! Assessed Overdue Fine: $${chk.fineAmount.toFixed(2)}`);
      setTimeout(() => setBannerNotice(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'RETURN_FAILED';
      setBannerNotice(`Return error: ${msg}`);
      setTimeout(() => setBannerNotice(null), 4000);
    }
  };

  const handleExportCSV = () => {
    const csv = exportLibraryCatalogCSV(catalog);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Library_Catalog_Inventory_${institutionId}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBannerNotice('Library Catalog CSV exported successfully.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xl font-bold">
            📚
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              University Digital Library & Academic Journal Repository
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Search peer-reviewed IEEE/ACM publications, check out RFID physical textbooks, and browse institutional research theses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <span>📥</span> Export Catalog CSV
          </button>
        </div>
      </div>

      {bannerNotice && (
        <div className="p-3 bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 text-sm rounded-lg flex items-center gap-2">
          <span>ℹ️</span> {bannerNotice}
        </div>
      )}

      {/* Library KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catalog Titles</div>
          <div className="text-3xl font-bold text-slate-100 mt-2">{catalog.length} Titles</div>
          <div className="text-xs text-slate-500 mt-1">{totalCopies} physical & digital assets</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Available Copies</div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">{availableCopies} / {totalCopies}</div>
          <div className="text-xs text-slate-500 mt-1">Ready for RFID checkout</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Open-Access Digital</div>
          <div className="text-3xl font-bold text-indigo-400 mt-2">{digitalCount} Assets</div>
          <div className="text-xs text-slate-500 mt-1">Instant PDF / ePub download</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Active Borrowings</div>
          <div className="text-3xl font-bold text-amber-400 mt-2">{checkouts.filter(c => c.status !== 'RETURNED').length}</div>
          <div className="text-xs text-slate-500 mt-1">Student circulating loans</div>
        </div>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Catalog Titles ({catalog.length})
          </button>
          <button
            onClick={() => setActiveTab('checkouts')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'checkouts' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Circulation Loans ({checkouts.length})
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search title, author, ISBN, DOI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 w-64 focus:outline-none focus:border-indigo-500"
            />

            <select
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Media Types</option>
              <option value="PHYSICAL_BOOK">Physical Textbooks</option>
              <option value="JOURNAL_PAPER">IEEE / ACM Journal Papers</option>
              <option value="E_BOOK">Digital eBooks</option>
              <option value="INSTITUTIONAL_THESIS">Research Theses</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'catalog' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => {
            const hasCopies = item.availableCopies > 0;

            const typeBadge = {
              PHYSICAL_BOOK: 'bg-blue-950 text-blue-300 border-blue-500/30',
              JOURNAL_PAPER: 'bg-purple-950 text-purple-300 border-purple-500/30',
              E_BOOK: 'bg-emerald-950 text-emerald-300 border-emerald-500/30',
              INSTITUTIONAL_THESIS: 'bg-amber-950 text-amber-300 border-amber-500/30',
            }[item.assetType];

            return (
              <div
                key={item.itemId}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${typeBadge}`}>
                        {item.assetType.replace(/_/g, ' ')}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 leading-snug pt-1">
                        {item.title}
                      </h3>
                      <div className="text-xs text-slate-400">
                        by <span className="text-slate-300 font-medium">{item.authors.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                    <div>Publisher: <span className="text-slate-300">{item.publisher} ({item.publicationYear})</span></div>
                    <div>Identifier: <span className="font-mono text-slate-400">{item.isbnOrDoi}</span></div>
                    {item.rfidTag && (
                      <div>RFID Tag: <span className="font-mono text-indigo-400">{item.rfidTag}</span></div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400">Availability: </span>
                    <span className={hasCopies ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {item.availableCopies} of {item.totalCopies} Copies
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.isDigitalAccessible && item.digitalAccessUrl && (
                      <a
                        href={item.digitalAccessUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Read Digital
                      </a>
                    )}
                    {item.assetType === 'PHYSICAL_BOOK' && (
                      <button
                        disabled={!hasCopies}
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold"
                      >
                        {hasCopies ? 'RFID Checkout' : 'All Checked Out'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">
              Active Circulation Checkouts & Return Desk ({checkouts.length})
            </h2>
            <span className="text-xs text-slate-400">14-Day Borrowing Window</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Borrowed</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Fine</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {checkouts.map((chk) => {
                  const isReturned = chk.status === 'RETURNED';
                  const isOverdue = chk.status === 'OVERDUE';

                  return (
                    <tr key={chk.checkoutId} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100">{chk.studentName}</div>
                        <div className="text-xs font-mono text-slate-500">{chk.studentId}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-200 font-medium max-w-xs truncate">
                        {chk.itemTitle}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {chk.borrowedAt.split('T')[0]}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {chk.dueAt.split('T')[0]}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <span className={`px-2 py-0.5 rounded border font-semibold ${
                          isReturned
                            ? 'bg-slate-950 text-slate-400 border-slate-800'
                            : isOverdue
                            ? 'bg-rose-950 text-rose-400 border-rose-500/40'
                            : 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {chk.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono font-bold text-rose-400">
                        ${chk.fineAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isReturned && (
                          <button
                            onClick={() => handleReturn(chk.checkoutId)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                          >
                            Return Book
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleCheckout} className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>📖</span> RFID Self-Checkout Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Borrowing: &quot;{selectedItem.title}&quot;
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Student Roll Number / Card ID</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
                <div>Borrowing Period: <span className="text-slate-200 font-semibold">14 Days</span></div>
                <div>Overdue Fine Rate: <span className="text-rose-400 font-semibold">$1.00 / day</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold"
              >
                Confirm Checkout
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DigitalLibraryCatalog;
