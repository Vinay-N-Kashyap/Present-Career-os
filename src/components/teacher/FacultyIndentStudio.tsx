'use client';

import React, { useState, useMemo } from 'react';
import {
  FacultyIndentRecord,
  IndentCategory,
  BudgetHeadType,
  IndentStage,
  SEED_INDENTS,
  createFacultyIndent,
  advanceIndentStage,
  completeAssetInwarding,
  exportFacultyIndentsCSV,
} from '@/lib/teacher/facultyIndents';

export default function FacultyIndentStudio() {
  const [indents, setIndents] = useState<FacultyIndentRecord[]>(SEED_INDENTS);
  const [selectedCategory, setSelectedCategory] = useState<IndentCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewIndentModalOpen, setIsNewIndentModalOpen] = useState(false);
  const [stageModalIndent, setStageModalIndent] = useState<FacultyIndentRecord | null>(null);
  const [inwardModalIndent, setInwardModalIndent] = useState<FacultyIndentRecord | null>(null);
  const [sealModalIndent, setSealModalIndent] = useState<FacultyIndentRecord | null>(null);

  // New Indent Form State
  const [facultyPi, setFacultyPi] = useState('Dr. Aruna Chatterjee');
  const [department, setDepartment] = useState('Biotechnology & Biomedical Engineering');
  const [category, setCategory] = useState<IndentCategory>('RESEARCH_EQUIPMENT_CAPEX');
  const [budgetHead, setBudgetHead] = useState<BudgetHeadType>('EXT_SPONSORED_RESEARCH');
  const [budgetProjectCode, setBudgetProjectCode] = useState('DST-SERB-CRG-2025-102');
  const [availableBudget, setAvailableBudget] = useState<number>(2_500_000);
  const [isPac, setIsPac] = useState(false);
  const [pacJustification, setPacJustification] = useState('');

  // Dynamic Item Rows
  const [itemRows, setItemRows] = useState([
    { description: 'Tabletop High-Speed Refrigerated Centrifuge (18,000 RPM)', quantity: 1, unit: 'Unit', estimatedUnitPrice: 450_000, catalogNumber: 'E-5424R' },
  ]);

  // Stage Advancement Form State
  const [targetStage, setTargetStage] = useState<IndentStage>('HOD_RECOMMENDED');
  const [poNumber, setPoNumber] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [remarks, setRemarks] = useState('');

  // Inwarding Form State
  const [inspectorFaculty, setInspectorFaculty] = useState('Dr. M. S. Narayanan (Lab In-charge)');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-9901');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered Indents
  const filteredIndents = useMemo(() => {
    return indents.filter((ind) => {
      const matchesCat = selectedCategory === 'ALL' || ind.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ind.indentNumber.toLowerCase().includes(q) ||
        ind.facultyPi.toLowerCase().includes(q) ||
        ind.department.toLowerCase().includes(q) ||
        (ind.poNumber && ind.poNumber.toLowerCase().includes(q)) ||
        (ind.assetTagNumber && ind.assetTagNumber.toLowerCase().includes(q)) ||
        (ind.vendorName && ind.vendorName.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [indents, selectedCategory, searchQuery]);

  // Telemetry Stats
  const stats = useMemo(() => {
    const total = indents.length;
    const totalOutlay = indents.reduce((acc, i) => acc + i.totalEstimatedOutlay, 0);
    const pendingApproval = indents.filter(
      (i) => i.stage === 'DRAFTED' || i.stage === 'HOD_RECOMMENDED' || i.stage === 'FINANCE_VETTED'
    ).length;
    const inwardedAssets = indents.filter((i) => i.stage === 'ASSET_INWARDED').length;
    return {
      total,
      totalOutlayLakhs: (totalOutlay / 100_000).toFixed(1),
      pendingApproval,
      inwardedAssets,
    };
  }, [indents]);

  const handleAddItemRow = () => {
    setItemRows([
      ...itemRows,
      { description: '', quantity: 1, unit: 'Unit', estimatedUnitPrice: 10_000, catalogNumber: '' },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (itemRows.length <= 1) return;
    setItemRows(itemRows.filter((_, i) => i !== index));
  };

  const handleCreateIndent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyPi.trim() || itemRows.some((r) => !r.description.trim() || r.quantity <= 0)) {
      showToast('Please specify valid item descriptions and quantities');
      return;
    }

    try {
      const items = itemRows.map((r, idx) => ({
        itemId: `ITM-NEW-${idx + 1}`,
        description: r.description.trim(),
        quantity: Number(r.quantity),
        unit: r.unit.trim() || 'Unit',
        estimatedUnitPrice: Number(r.estimatedUnitPrice),
        catalogNumber: r.catalogNumber.trim() || undefined,
      }));

      const created = createFacultyIndent({
        facultyPi: facultyPi.trim(),
        department: department.trim(),
        category,
        budgetHead,
        budgetProjectCode: budgetProjectCode.trim() || undefined,
        availableBudget,
        items,
        isPac,
        pacJustification: isPac ? pacJustification.trim() : undefined,
      });

      setIndents([created, ...indents]);
      setIsNewIndentModalOpen(false);
      showToast(`Indent ${created.indentNumber} drafted successfully!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating indent';
      showToast(`Requisition failed: ${msg}`);
    }
  };

  const handleAdvanceStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageModalIndent) return;

    const updated = advanceIndentStage(stageModalIndent, targetStage, {
      poNumber: poNumber.trim() || undefined,
      vendorName: vendorName.trim() || undefined,
      remarks: remarks.trim() || undefined,
    });

    setIndents(indents.map((i) => (i.indentId === updated.indentId ? updated : i)));
    setStageModalIndent(null);
    setPoNumber('');
    setVendorName('');
    showToast(`Indent stage advanced to ${targetStage.replace(/_/g, ' ')}`);
  };

  const handleCompleteInwarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inwardModalIndent || !inspectorFaculty.trim() || !invoiceNumber.trim()) {
      showToast('Inspector name and vendor invoice number are required');
      return;
    }

    const updated = completeAssetInwarding(
      inwardModalIndent,
      inspectorFaculty.trim(),
      invoiceNumber.trim()
    );

    setIndents(indents.map((i) => (i.indentId === updated.indentId ? updated : i)));
    setInwardModalIndent(null);
    showToast(`Consignment inspected! Asset tagged: ${updated.assetTagNumber}`);
  };

  const handleExportCSV = () => {
    const csv = exportFacultyIndentsCSV(indents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Faculty_Departmental_Indents_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Departmental indent ledger CSV exported successfully');
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
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-teal-500/20 text-teal-300 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-teal-500/30 uppercase">
                Departmental Purchase Committee (DPC)
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold tracking-wide border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Dead-Stock Asset Inwarding
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Faculty Purchase Requisition & Asset Inward Studio
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Raise equipment & consumable purchase indents against research grants and department budgets.
              Track approvals, generate dead-stock asset tags, and verify delivery with SHA-256 inspection seals.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewIndentModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 border border-teal-400/40 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Raise Purchase Indent
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2 border border-slate-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Store CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Indents</p>
          <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">{stats.total}</p>
          <div className="text-xs text-teal-400 mt-2 flex items-center gap-1 font-medium">
            <span>Inwarded & In-Process</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Requisitioned Outlay</p>
          <p className="text-2xl md:text-3xl font-extrabold text-amber-400 mt-1">₹{stats.totalOutlayLakhs} L</p>
          <div className="text-xs text-amber-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Grant & departmental funds</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Sanction</p>
          <p className="text-2xl md:text-3xl font-extrabold text-sky-400 mt-1">{stats.pendingApproval}</p>
          <div className="text-xs text-sky-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>HOD & Finance vetting</span>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inwarded Assets</p>
          <p className="text-2xl md:text-3xl font-extrabold text-emerald-400 mt-1">{stats.inwardedAssets}</p>
          <div className="text-xs text-emerald-400/80 mt-2 flex items-center gap-1 font-medium">
            <span>Dead-stock tagged & sealed</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              'ALL',
              'LAB_CONSUMABLES',
              'RESEARCH_EQUIPMENT_CAPEX',
              'SOFTWARE_LICENSES',
              'BOOKS_AND_JOURNALS',
              'MAINTENANCE_AND_SPARES',
            ] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition border ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white border-teal-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL'
                ? 'All Categories'
                : cat
                    .split('_')
                    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                    .join(' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indent, PI, dept, PO, asset..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Indents List */}
      <div className="space-y-6">
        {filteredIndents.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-slate-400 font-medium">No purchase requisitions matching selected filter</p>
          </div>
        ) : (
          filteredIndents.map((indent) => {
            const isInwarded = indent.stage === 'ASSET_INWARDED';

            return (
              <div
                key={indent.indentId}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-teal-950 text-teal-300 border border-teal-700/50 px-2.5 py-1 rounded-md">
                      {indent.indentNumber}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {indent.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs bg-slate-800/70 text-slate-400 px-2.5 py-0.5 rounded-full">
                      {indent.budgetHead.replace(/_/g, ' ')}
                    </span>
                    {indent.isPac && (
                      <span className="text-[11px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-semibold">
                        PAC (GFR 166)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        isInwarded
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : indent.stage === 'PO_ISSUED'
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {indent.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Indent Details */}
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-base font-bold text-white">{indent.facultyPi}</h3>
                    <span className="text-xs text-slate-400">({indent.department})</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 mt-2">
                    {indent.budgetProjectCode && (
                      <span>
                        <strong className="text-slate-300">Grant Code:</strong> {indent.budgetProjectCode}
                      </span>
                    )}
                    <span>
                      <strong className="text-slate-300">Submitted:</strong> {indent.submissionDate}
                    </span>
                    {indent.poNumber && (
                      <span>
                        <strong className="text-slate-300">PO Number:</strong> {indent.poNumber}
                      </span>
                    )}
                    {indent.vendorName && (
                      <span>
                        <strong className="text-slate-300">Vendor:</strong> {indent.vendorName}
                      </span>
                    )}
                  </div>

                  {indent.pacJustification && (
                    <div className="mt-2.5 bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-xl text-xs text-amber-200">
                      <strong>Proprietary Justification:</strong> {indent.pacJustification}
                    </div>
                  )}
                </div>

                {/* Bill of Quantities (BOQ) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300 uppercase tracking-wide">
                    <span>Requisition Items ({indent.items.length})</span>
                    <span className="text-amber-400 font-bold font-mono">
                      Total: ₹{indent.totalEstimatedOutlay.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Item Description</th>
                          <th className="py-2.5 px-3">Catalog / Part #</th>
                          <th className="py-2.5 px-3">Qty</th>
                          <th className="py-2.5 px-3">Unit Price (INR)</th>
                          <th className="py-2.5 px-3 text-right">Total (INR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {indent.items.map((it) => (
                          <tr key={it.itemId} className="hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-medium text-white">{it.description}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-400">{it.catalogNumber || 'N/A'}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-200">
                              {it.quantity} {it.unit}
                            </td>
                            <td className="py-2.5 px-3">₹{it.estimatedUnitPrice.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-3 font-bold text-amber-400 text-right">
                              ₹{it.totalPrice.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Dead-Stock Inwarding Details */}
                {isInwarded && indent.assetTagNumber && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-emerald-950/20 border border-emerald-900/40 p-3.5 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-400 block">Dead-Stock Asset Tag:</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {indent.assetTagNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Verified By / Date:</span>
                      <span className="text-slate-200 font-semibold">
                        {indent.inspectorFaculty} ({indent.inspectionDate})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Vendor Invoice Number:</span>
                      <span className="font-mono text-slate-300 font-semibold">{indent.invoiceNumber}</span>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-slate-800/60">
                  <div className="text-xs text-slate-400">
                    Budget Head Solvency: Available ₹{indent.availableBudget.toLocaleString('en-IN')}
                  </div>

                  <div className="flex items-center gap-2">
                    {indent.cryptographicSeal && (
                      <button
                        onClick={() => setSealModalIndent(indent)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Inspection Seal
                      </button>
                    )}

                    {!isInwarded && (
                      <>
                        <button
                          onClick={() => {
                            setStageModalIndent(indent);
                            if (indent.stage === 'DRAFTED') setTargetStage('HOD_RECOMMENDED');
                            else if (indent.stage === 'HOD_RECOMMENDED') setTargetStage('FINANCE_VETTED');
                            else if (indent.stage === 'FINANCE_VETTED') setTargetStage('PO_ISSUED');
                          }}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-lg transition border border-slate-700"
                        >
                          Advance Stage
                        </button>

                        <button
                          onClick={() => setInwardModalIndent(indent)}
                          className="text-xs bg-teal-600 hover:bg-teal-500 text-white font-medium px-3.5 py-1.5 rounded-lg transition border border-teal-400/40"
                        >
                          Inward & Tag Asset
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Raise Purchase Indent */}
      {isNewIndentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Raise Faculty Purchase Indent</h3>
              <button
                onClick={() => setIsNewIndentModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIndent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Faculty PI Name
                  </label>
                  <input
                    type="text"
                    required
                    value={facultyPi}
                    onChange={(e) => setFacultyPi(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IndentCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="RESEARCH_EQUIPMENT_CAPEX">Research Equipment (CAPEX)</option>
                    <option value="LAB_CONSUMABLES">Lab Consumables & Chemicals</option>
                    <option value="SOFTWARE_LICENSES">Software Licenses</option>
                    <option value="BOOKS_AND_JOURNALS">Books & Journals</option>
                    <option value="MAINTENANCE_AND_SPARES">Maintenance & Spares</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Budget Head
                  </label>
                  <select
                    value={budgetHead}
                    onChange={(e) => setBudgetHead(e.target.value as BudgetHeadType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="EXT_SPONSORED_RESEARCH">External Sponsored Research Grant</option>
                    <option value="INST_DEV_FUND">Institutional Development Fund</option>
                    <option value="FACULTY_SEED_GRANT">Faculty Seed Grant</option>
                    <option value="CONSULTANCY_OVERHEAD">Consultancy Overhead (DDF)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Grant / Project Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={budgetProjectCode}
                    onChange={(e) => setBudgetProjectCode(e.target.value)}
                    placeholder="e.g. DST-CRG-2025-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Available Budget Balance (INR)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={availableBudget}
                    onChange={(e) => setAvailableBudget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Bill of Quantities (Items Requested)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
                  >
                    + Add Item Row
                  </button>
                </div>

                <div className="space-y-2">
                  {itemRows.map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 items-center text-xs"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          required
                          placeholder="Item Description"
                          value={row.description}
                          onChange={(e) => {
                            const copy = [...itemRows];
                            copy[idx].description = e.target.value;
                            setItemRows(copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Qty"
                          value={row.quantity}
                          onChange={(e) => {
                            const copy = [...itemRows];
                            copy[idx].quantity = Number(e.target.value);
                            setItemRows(copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Unit"
                          value={row.unit}
                          onChange={(e) => {
                            const copy = [...itemRows];
                            copy[idx].unit = e.target.value;
                            setItemRows(copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Price"
                          value={row.estimatedUnitPrice}
                          onChange={(e) => {
                            const copy = [...itemRows];
                            copy[idx].estimatedUnitPrice = Number(e.target.value);
                            setItemRows(copy);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        {itemRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="text-rose-400 hover:text-rose-300 font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPacCheck"
                    checked={isPac}
                    onChange={(e) => setIsPac(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-teal-600 focus:ring-0"
                  />
                  <label htmlFor="isPacCheck" className="text-xs text-slate-300 font-semibold">
                    Proprietary Article Certificate (PAC) - GFR Rule 166
                  </label>
                </div>

                {isPac && (
                  <div className="mt-2">
                    <textarea
                      rows={2}
                      value={pacJustification}
                      onChange={(e) => setPacJustification(e.target.value)}
                      placeholder="Detailed technical justification why no other make/model is acceptable..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewIndentModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Draft Indent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Advance Indent Stage */}
      {stageModalIndent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Advance Requisition Stage</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{stageModalIndent.indentNumber}</p>
              </div>
              <button
                onClick={() => setStageModalIndent(null)}
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
                  onChange={(e) => setTargetStage(e.target.value as IndentStage)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="HOD_RECOMMENDED">HOD Recommended</option>
                  <option value="FINANCE_VETTED">Finance Vetted</option>
                  <option value="PO_ISSUED">Purchase Order (PO) Issued</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {targetStage === 'PO_ISSUED' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Purchase Order (PO) Number
                    </label>
                    <input
                      type="text"
                      required
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      placeholder="e.g. PO-2026-CH-0155"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Approved Vendor Name
                    </label>
                    <input
                      type="text"
                      required
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="e.g. Thermo Fisher Scientific India"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Remarks / Notes
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Sanctioned under Dean R&D approval dated 2026-03-01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStageModalIndent(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Update Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Consignment Inspection & Asset Inwarding */}
      {inwardModalIndent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Physical Inspection & Asset Tagging</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{inwardModalIndent.indentNumber}</p>
              </div>
              <button
                onClick={() => setInwardModalIndent(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteInwarding} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Inspecting Faculty / Lab In-Charge
                </label>
                <input
                  type="text"
                  required
                  value={inspectorFaculty}
                  onChange={(e) => setInspectorFaculty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Vendor Invoice / Challan Number
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-2026-88192"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="bg-teal-950/30 border border-teal-800/40 p-3 rounded-xl text-xs text-teal-300 space-y-1">
                <p className="font-semibold">Automatic Dead-Stock Ledger Actions:</p>
                <p>1. Generates official asset tag: <code className="font-mono">AST-[DEPT]-2026-[HEX6]</code></p>
                <p>2. Seals inspection certificate with tamper-proof SHA-256 hash digest.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setInwardModalIndent(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
                >
                  Inward & Issue Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SHA-256 Inspection Seal */}
      {sealModalIndent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">Cryptographic Inspection Seal</h3>
              </div>
              <button
                onClick={() => setSealModalIndent(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Indent Reference:</span>
                <span className="font-mono text-teal-400 font-semibold">{sealModalIndent.indentNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Dead-Stock Asset Tag:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{sealModalIndent.assetTagNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Inspected By:</span>
                <span className="text-slate-200 font-medium">{sealModalIndent.inspectorFaculty}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">SHA-256 Digest:</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 break-all font-mono text-[11px] text-emerald-400">
                  {sealModalIndent.cryptographicSeal}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSealModalIndent(null)}
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
