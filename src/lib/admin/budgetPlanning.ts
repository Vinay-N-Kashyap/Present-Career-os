/**
 * Institutional Departmental Budget Planning & CAPEX Engine (TASK-886)
 * 
 * Provides:
 * 1. Annual OPEX and CAPEX budget planning for academic departments.
 * 2. Multi-category budget allocation (Salaries, Lab Equipment, Cloud/Software, Scholarships, Facilities, Conferences).
 * 3. Actual expenditure burn rate, remaining fiscal balance, and overspending variance diagnostics.
 * 4. Research grant and endowment disbursement tracking.
 * 5. Multi-tenant isolation and NAAC/NBA Criterion 4 Financial Resource CSV export.
 */

export type BudgetCategory = 
  | 'FACULTY_SALARIES_AND_BENEFITS'
  | 'LAB_AND_RESEARCH_EQUIPMENT' // CAPEX
  | 'SOFTWARE_LICENSES_AND_CLOUD'
  | 'STUDENT_SCHOLARSHIPS_AND_AID'
  | 'FACILITY_AND_INFRASTRUCTURE'
  | 'CONFERENCES_AND_GUEST_LECTURES';

export interface BudgetLineItem {
  id: string;
  category: BudgetCategory;
  allocatedAmount: number; // in USD or INR
  expendedAmount: number;
  isCapex: boolean;
  description: string;
}

export interface ResearchGrantDisbursement {
  grantId: string;
  grantTitle: string;
  fundingAgency: string; // e.g. DST, SERB, NSF, Industry Partner
  principalInvestigator: string;
  totalGrantAmount: number;
  disbursedToDate: number;
  fiscalYear: string;
}

export interface DepartmentBudgetPlan {
  planId: string;
  institutionId: string;
  department: string;
  fiscalYear: string; // e.g. "2026-2027"
  totalAllocated: number;
  totalExpended: number;
  remainingBalance: number;
  burnRatePercentage: number;
  lineItems: BudgetLineItem[];
  grants: ResearchGrantDisbursement[];
  isOverspent: boolean;
  overspentCategories: BudgetCategory[];
  auditStatus: 'DRAFT' | 'APPROVED_BY_DEAN' | 'FINANCE_COMMITTED' | 'AUDITED';
}

export interface ExpenseRecord {
  expenseId: string;
  institutionId: string;
  department: string;
  fiscalYear: string;
  category: BudgetCategory;
  amount: number;
  vendorOrPayee: string;
  invoiceNumber: string;
  approvedBy: string;
  incurredAt: string; // ISO date
}

export class BudgetPlanningStore {
  private plans: Map<string, DepartmentBudgetPlan> = new Map();
  private expenses: Map<string, ExpenseRecord[]> = new Map();

  /**
   * Generates or updates an annual department budget plan
   */
  public createOrUpdatePlan(params: {
    institutionId: string;
    department: string;
    fiscalYear: string;
    lineItems: BudgetLineItem[];
    grants?: ResearchGrantDisbursement[];
    auditStatus?: DepartmentBudgetPlan['auditStatus'];
  }): DepartmentBudgetPlan {
    if (!params.institutionId || !params.department || !params.fiscalYear) {
      throw new Error('INVALID_BUDGET_PLAN_PARAMS');
    }

    if (params.lineItems.length === 0) {
      throw new Error('LINE_ITEMS_REQUIRED');
    }

    let totalAllocated = 0;
    let totalExpended = 0;
    const overspentCategories: BudgetCategory[] = [];

    const clonedLineItems: BudgetLineItem[] = params.lineItems.map(item => ({ ...item }));
    for (const item of clonedLineItems) {
      if (item.allocatedAmount < 0 || item.expendedAmount < 0) {
        throw new Error('AMOUNTS_MUST_BE_NON_NEGATIVE');
      }
      totalAllocated += item.allocatedAmount;
      totalExpended += item.expendedAmount;

      if (item.expendedAmount > item.allocatedAmount) {
        overspentCategories.push(item.category);
      }
    }

    const remainingBalance = totalAllocated - totalExpended;
    const burnRatePercentage = totalAllocated > 0 
      ? Math.round((totalExpended / totalAllocated) * 1000) / 10 
      : 0;

    const planKey = `${params.institutionId}:${params.department.toLowerCase()}:${params.fiscalYear}`;
    const planId = `bdg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const plan: DepartmentBudgetPlan = {
      planId,
      institutionId: params.institutionId,
      department: params.department,
      fiscalYear: params.fiscalYear,
      totalAllocated,
      totalExpended,
      remainingBalance,
      burnRatePercentage,
      lineItems: clonedLineItems,
      grants: params.grants || [],
      isOverspent: overspentCategories.length > 0 || remainingBalance < 0,
      overspentCategories,
      auditStatus: params.auditStatus || 'DRAFT',
    };

    this.plans.set(planKey, plan);
    return plan;
  }

  /**
   * Log an approved expense transaction and update departmental burn
   */
  public recordExpense(expense: ExpenseRecord): DepartmentBudgetPlan {
    const planKey = `${expense.institutionId}:${expense.department.toLowerCase()}:${expense.fiscalYear}`;
    const plan = this.plans.get(planKey);

    if (!plan) {
      throw new Error('BUDGET_PLAN_NOT_FOUND');
    }

    // Match line item category
    const lineItem = plan.lineItems.find(li => li.category === expense.category);
    if (!lineItem) {
      throw new Error('BUDGET_CATEGORY_NOT_ALLOCATED');
    }

    lineItem.expendedAmount += expense.amount;
    plan.totalExpended += expense.amount;
    plan.remainingBalance = plan.totalAllocated - plan.totalExpended;
    plan.burnRatePercentage = plan.totalAllocated > 0 
      ? Math.round((plan.totalExpended / plan.totalAllocated) * 1000) / 10 
      : 0;

    if (lineItem.expendedAmount > lineItem.allocatedAmount && !plan.overspentCategories.includes(expense.category)) {
      plan.overspentCategories.push(expense.category);
    }
    plan.isOverspent = plan.overspentCategories.length > 0 || plan.remainingBalance < 0;

    // Track expense log
    const expList = this.expenses.get(planKey) || [];
    expList.push(expense);
    this.expenses.set(planKey, expList);

    this.plans.set(planKey, plan);
    return plan;
  }

  /**
   * Query plans strictly by institution
   */
  public getPlansByInstitution(institutionId: string, fiscalYear?: string): DepartmentBudgetPlan[] {
    const results: DepartmentBudgetPlan[] = [];
    for (const plan of this.plans.values()) {
      if (plan.institutionId !== institutionId) continue;
      if (fiscalYear && plan.fiscalYear !== fiscalYear) continue;
      results.push({ ...plan });
    }
    return results;
  }

  /**
   * Clear in-memory store for isolated unit tests
   */
  public clear(): void {
    this.plans.clear();
    this.expenses.clear();
  }
}

export const budgetPlanningStore = new BudgetPlanningStore();

/**
 * Standard NAAC / NBA Criterion 4 Financial Resource Allocation CSV Export
 */
export function exportBudgetPlanCSV(plans: DepartmentBudgetPlan[]): string {
  const headers = [
    'Institution_ID',
    'Department',
    'Fiscal_Year',
    'Total_Allocated',
    'Total_Expended',
    'Remaining_Balance',
    'Burn_Rate_Pct',
    'Status',
    'Overspent_Flag',
    'Total_Active_Grants',
  ];

  const rows = plans.map(p => [
    `"${p.institutionId}"`,
    `"${p.department}"`,
    `"${p.fiscalYear}"`,
    p.totalAllocated,
    p.totalExpended,
    p.remainingBalance,
    p.burnRatePercentage,
    `"${p.auditStatus}"`,
    p.isOverspent ? 'YES' : 'NO',
    p.grants.length,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
