'use client';

import React, { useState } from 'react';
import {
  DepartmentBudgetPlan,
  BudgetCategory,
  budgetPlanningStore,
  exportBudgetPlanCSV,
} from '@/lib/admin/budgetPlanning';

interface BudgetPlanningDashboardProps {
  institutionId?: string;
}

const INITIAL_PLANS: Parameters<typeof budgetPlanningStore.createOrUpdatePlan>[0][] = [
  {
    institutionId: 'inst-apex-001',
    department: 'Computer Science',
    fiscalYear: '2026-2027',
    auditStatus: 'APPROVED_BY_DEAN',
    lineItems: [
      {
        id: 'li-cs-01',
        category: 'FACULTY_SALARIES_AND_BENEFITS',
        allocatedAmount: 280000,
        expendedAmount: 185000,
        isCapex: false,
        description: 'Core faculty, teaching assistant stipends & adjunct professors',
      },
      {
        id: 'li-cs-02',
        category: 'LAB_AND_RESEARCH_EQUIPMENT',
        allocatedAmount: 95000,
        expendedAmount: 72000,
        isCapex: true,
        description: 'NVIDIA GPU workstations & robotics lab sensors',
      },
      {
        id: 'li-cs-03',
        category: 'SOFTWARE_LICENSES_AND_CLOUD',
        allocatedAmount: 45000,
        expendedAmount: 39500,
        isCapex: false,
        description: 'AWS / GCP cloud computing credits & MATLAB licenses',
      },
      {
        id: 'li-cs-04',
        category: 'STUDENT_SCHOLARSHIPS_AND_AID',
        allocatedAmount: 30000,
        expendedAmount: 28000,
        isCapex: false,
        description: 'Merit-cum-means tuition waivers & hackathon grants',
      },
      {
        id: 'li-cs-05',
        category: 'CONFERENCES_AND_GUEST_LECTURES',
        allocatedAmount: 20000,
        expendedAmount: 14000,
        isCapex: false,
        description: 'ACM/IEEE travel stipends & visiting industry keynotes',
      },
    ],
    grants: [
      {
        grantId: 'grt-dst-01',
        grantTitle: 'Autonomous Robotics & Edge AI Navigation',
        fundingAgency: 'Department of Science & Technology (DST)',
        principalInvestigator: 'Dr. C. Ramanathan',
        totalGrantAmount: 150000,
        disbursedToDate: 90000,
        fiscalYear: '2026-2027',
      },
      {
        grantId: 'grt-serb-02',
        grantTitle: 'Federated Privacy-Preserving Health Analytics',
        fundingAgency: 'SERB Core Research Grant',
        principalInvestigator: 'Dr. Meera Iyer',
        totalGrantAmount: 120000,
        disbursedToDate: 85000,
        fiscalYear: '2026-2027',
      },
    ],
  },
  {
    institutionId: 'inst-apex-001',
    department: 'Information Technology',
    fiscalYear: '2026-2027',
    auditStatus: 'FINANCE_COMMITTED',
    lineItems: [
      {
        id: 'li-it-01',
        category: 'FACULTY_SALARIES_AND_BENEFITS',
        allocatedAmount: 190000,
        expendedAmount: 128000,
        isCapex: false,
        description: 'IT faculty and systems laboratory coordinators',
      },
      {
        id: 'li-it-02',
        category: 'LAB_AND_RESEARCH_EQUIPMENT',
        allocatedAmount: 60000,
        expendedAmount: 48000,
        isCapex: true,
        description: 'Server rack switches and cybersecurity sandboxes',
      },
      {
        id: 'li-it-03',
        category: 'SOFTWARE_LICENSES_AND_CLOUD',
        allocatedAmount: 35000,
        expendedAmount: 31000,
        isCapex: false,
        description: 'Enterprise Linux subscriptions and virtualization tools',
      },
      {
        id: 'li-it-04',
        category: 'CONFERENCES_AND_GUEST_LECTURES',
        allocatedAmount: 15000,
        expendedAmount: 9000,
        isCapex: false,
        description: 'Cybersecurity symposiums and guest lectures',
      },
    ],
    grants: [
      {
        grantId: 'grt-ind-03',
        grantTitle: 'Zero-Trust Campus Network Security Framework',
        fundingAgency: 'Industry Cybersecurity Consortium',
        principalInvestigator: 'Dr. Arvind Joshi',
        totalGrantAmount: 85000,
        disbursedToDate: 60000,
        fiscalYear: '2026-2027',
      },
    ],
  },
];

export const BudgetPlanningDashboard: React.FC<BudgetPlanningDashboardProps> = ({
  institutionId = 'inst-apex-001',
}) => {
  // Seed store if empty
  useState(() => {
    const existing = budgetPlanningStore.getPlansByInstitution(institutionId);
    if (existing.length === 0) {
      for (const p of INITIAL_PLANS) {
        budgetPlanningStore.createOrUpdatePlan(p);
      }
    }
  });

  const [selectedDept, setSelectedDept] = useState<'Computer Science' | 'Information Technology'>('Computer Science');
  const [fiscalYear, setFiscalYear] = useState<string>('2026-2027');
  const [plans, setPlans] = useState<DepartmentBudgetPlan[]>(() =>
    budgetPlanningStore.getPlansByInstitution(institutionId, fiscalYear)
  );

  // Expense modal state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [expenseCategory, setExpenseCategory] = useState<BudgetCategory>('LAB_AND_RESEARCH_EQUIPMENT');
  const [expenseAmount, setExpenseAmount] = useState<number>(5000);
  const [vendorName, setVendorName] = useState<string>('National Instruments Pvt Ltd');
  const [invoiceNo, setInvoiceNo] = useState<string>('INV-2026-884');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const currentPlan = plans.find(
    p => p.department.toLowerCase() === selectedDept.toLowerCase()
  ) || plans[0];

  const refreshPlans = () => {
    setPlans(budgetPlanningStore.getPlansByInstitution(institutionId, fiscalYear));
  };

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlan || expenseAmount <= 0) return;

    budgetPlanningStore.recordExpense({
      expenseId: `exp-${Date.now()}`,
      institutionId,
      department: selectedDept,
      fiscalYear,
      category: expenseCategory,
      amount: expenseAmount,
      vendorOrPayee: vendorName,
      invoiceNumber: invoiceNo,
      approvedBy: 'Dean of Finance & Accounts',
      incurredAt: new Date().toISOString(),
    });

    setIsExpenseModalOpen(false);
    refreshPlans();
    setBannerNotice(`Expense of $${expenseAmount.toLocaleString()} successfully recorded for ${expenseCategory.replace(/_/g, ' ')}`);
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleExportCSV = () => {
    const csv = exportBudgetPlanCSV(plans);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Campus_Budget_Report_${institutionId}_${fiscalYear}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBannerNotice('Financial Resource Allocation CSV exported successfully.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  if (!currentPlan) {
    return <div className="p-8 text-center text-slate-400">Loading budget data...</div>;
  }

  const burnColor = currentPlan.burnRatePercentage > 90
    ? 'text-rose-400'
    : currentPlan.burnRatePercentage > 75
    ? 'text-amber-400'
    : 'text-emerald-400';

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xl font-bold">
            💰
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Department Budget Planning & Capital Allocation (CAPEX / OPEX)
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Fiscal expenditure tracking, research grant disbursements, and NAAC Criterion 4 financial resource management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <span>+</span> Log Purchase / Expense
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >
            <span>📥</span> Export Finance CSV
          </button>
        </div>
      </div>

      {bannerNotice && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-sm rounded-lg flex items-center gap-2">
          <span>✓</span> {bannerNotice}
        </div>
      )}

      {/* Control Switchers: Department & Fiscal Year */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as 'Computer Science' | 'Information Technology')}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Fiscal Year:</span>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="2026-2027">FY 2026-2027</option>
              <option value="2025-2026">FY 2025-2026</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Approval Status:</span>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-950 text-indigo-400 border border-indigo-500/30 font-bold">
            {currentPlan.auditStatus.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Allocated Budget</div>
          <div className="text-3xl font-extrabold text-slate-100 mt-2">
            ${currentPlan.totalAllocated.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">CAPEX & OPEX Combined</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expended (Burn)</div>
          <div className={`text-3xl font-extrabold mt-2 ${burnColor}`}>
            ${currentPlan.totalExpended.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {currentPlan.burnRatePercentage}% of allocation burned
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Balance</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            ${currentPlan.remainingBalance.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Uncommitted operating funds</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Active Research Grants</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2">
            {currentPlan.grants.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ${currentPlan.grants.reduce((s, g) => s + g.totalGrantAmount, 0).toLocaleString()} sponsored capital
          </div>
        </div>
      </div>

      {/* Main Budget Line Item Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">
            Categorical Budget Allocation & Utilization Matrix
          </h2>
          <span className="text-xs text-slate-400">Institutional Fiscal Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Line Item / Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Allocated</th>
                <th className="py-3 px-4">Expended</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Burn Progress</th>
                <th className="py-3 px-4">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentPlan.lineItems.map((item) => {
                const burnPct = item.allocatedAmount > 0 
                  ? Math.round((item.expendedAmount / item.allocatedAmount) * 100) 
                  : 0;
                const isOver = item.expendedAmount > item.allocatedAmount;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">
                        {item.category.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold">
                      <span className={`px-2 py-0.5 rounded border ${
                        item.isCapex 
                          ? 'bg-purple-950/60 text-purple-300 border-purple-500/30' 
                          : 'bg-blue-950/60 text-blue-300 border-blue-500/30'
                      }`}>
                        {item.isCapex ? 'CAPEX' : 'OPEX'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      ${item.allocatedAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-300">
                      ${item.expendedAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-400">
                      ${(item.allocatedAmount - item.expendedAmount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 w-44">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              burnPct > 95 ? 'bg-rose-500' : burnPct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, burnPct)}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono">{burnPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {isOver ? (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-500/40 font-semibold">
                          Overspent
                        </span>
                      ) : burnPct > 80 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/40 font-semibold">
                          Near Cap
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-semibold">
                          On Track
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sponsored Research Grants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">
            Sponsored Research Grants & External Funding ({currentPlan.grants.length} Active)
          </h2>
          <span className="text-xs text-slate-400">NAAC Metric 3.1 & 3.2</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPlan.grants.map((grant) => (
            <div
              key={grant.grantId}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-indigo-400">
                    {grant.grantId.toUpperCase()} • {grant.fundingAgency}
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    {grant.grantTitle}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>

              <div className="text-xs text-slate-400">
                Principal Investigator: <span className="text-slate-200 font-semibold">{grant.principalInvestigator}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-xs">
                <div>
                  <span className="text-slate-400">Total Sanctioned:</span>{' '}
                  <span className="font-bold text-slate-100">${grant.totalGrantAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400">Disbursed:</span>{' '}
                  <span className="font-bold text-emerald-400">${grant.disbursedToDate.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handleRecordExpense} className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>💳</span> Record Department Purchase / Expense
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Budget Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as BudgetCategory)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                >
                  <option value="FACULTY_SALARIES_AND_BENEFITS">Faculty Salaries & Benefits</option>
                  <option value="LAB_AND_RESEARCH_EQUIPMENT">Lab & Research Equipment (CAPEX)</option>
                  <option value="SOFTWARE_LICENSES_AND_CLOUD">Software Licenses & Cloud Credits</option>
                  <option value="STUDENT_SCHOLARSHIPS_AND_AID">Student Scholarships & Aid</option>
                  <option value="CONFERENCES_AND_GUEST_LECTURES">Conferences & Guest Lectures</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Invoice Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Invoice / PO Number</label>
                <input
                  type="text"
                  required
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold"
              >
                Commit Expense
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanningDashboard;
