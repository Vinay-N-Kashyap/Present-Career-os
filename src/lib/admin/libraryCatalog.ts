/**
 * University Digital Library, Journal Subscriptions & RFID Circulation Engine (TASK-898)
 * 
 * Provides:
 * 1. Hybrid catalog inventory for Physical Books (RFID), eBooks, IEEE/ACM Journal Papers, and Theses.
 * 2. Automated checkout circulation engine with 14-day borrowing window and daily overdue fine calculations.
 * 3. Search and filtering across departments, publishers, and digital open-access gateways.
 * 4. Multi-tenant isolation and library circulation compliance CSV export.
 */

export type LibraryAssetType = 
  | 'PHYSICAL_BOOK'
  | 'E_BOOK'
  | 'JOURNAL_PAPER'
  | 'INSTITUTIONAL_THESIS';

export type CheckoutStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';

export interface LibraryItem {
  itemId: string;
  institutionId: string;
  title: string;
  authors: string[];
  isbnOrDoi: string;
  assetType: LibraryAssetType;
  publisher: string;
  publicationYear: number;
  department: string;
  rfidTag?: string;
  totalCopies: number;
  availableCopies: number;
  isDigitalAccessible: boolean;
  digitalAccessUrl?: string;
}

export interface LibraryCheckout {
  checkoutId: string;
  institutionId: string;
  itemId: string;
  itemTitle: string;
  studentId: string;
  studentName: string;
  borrowedAt: string; // ISO date
  dueAt: string; // ISO date
  returnedAt?: string;
  overdueDays: number;
  fineAmount: number;
  status: CheckoutStatus;
}

const DEFAULT_BORROW_DAYS = 14;
const DAILY_FINE_RATE = 1.0; // $1.00 per overdue day

export class DigitalLibraryStore {
  private items: Map<string, LibraryItem> = new Map();
  private checkouts: Map<string, LibraryCheckout> = new Map();

  /**
   * Register a new catalog asset
   */
  public addCatalogItem(item: LibraryItem): LibraryItem {
    if (!item.institutionId || !item.itemId || !item.title) {
      throw new Error('INVALID_CATALOG_ITEM');
    }
    if (item.totalCopies < 0 || item.availableCopies < 0) {
      throw new Error('COPIES_NON_NEGATIVE');
    }

    this.items.set(item.itemId, { ...item });
    return item;
  }

  /**
   * Search catalog with department & asset type filters
   */
  public searchCatalog(params: {
    institutionId: string;
    query?: string;
    assetType?: LibraryAssetType;
    department?: string;
  }): LibraryItem[] {
    const results: LibraryItem[] = [];

    for (const item of this.items.values()) {
      if (item.institutionId !== params.institutionId) continue;
      if (params.assetType && item.assetType !== params.assetType) continue;
      if (params.department && item.department.toLowerCase() !== params.department.toLowerCase()) continue;

      if (params.query && params.query.trim()) {
        const q = params.query.toLowerCase();
        const matches = 
          item.title.toLowerCase().includes(q) ||
          item.authors.some(a => a.toLowerCase().includes(q)) ||
          item.isbnOrDoi.toLowerCase().includes(q);
        if (!matches) continue;
      }

      results.push({ ...item });
    }

    return results;
  }

  /**
   * Checkout an asset to a student
   */
  public checkoutItem(params: {
    institutionId: string;
    itemId: string;
    studentId: string;
    studentName: string;
  }): LibraryCheckout {
    const item = this.items.get(params.itemId);
    if (!item || item.institutionId !== params.institutionId) {
      throw new Error('ITEM_NOT_FOUND_OR_TENANT_MISMATCH');
    }

    if (item.availableCopies <= 0) {
      throw new Error('NO_COPIES_AVAILABLE');
    }

    const now = new Date();
    const dueDate = new Date(now.getTime() + DEFAULT_BORROW_DAYS * 24 * 60 * 60 * 1000);
    const checkoutId = `chk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const checkout: LibraryCheckout = {
      checkoutId,
      institutionId: params.institutionId,
      itemId: item.itemId,
      itemTitle: item.title,
      studentId: params.studentId,
      studentName: params.studentName,
      borrowedAt: now.toISOString(),
      dueAt: dueDate.toISOString(),
      overdueDays: 0,
      fineAmount: 0,
      status: 'BORROWED',
    };

    item.availableCopies--;
    this.items.set(item.itemId, item);
    this.checkouts.set(checkoutId, checkout);

    return checkout;
  }

  /**
   * Return a borrowed asset and assess overdue fines
   */
  public returnItem(checkoutId: string, returnDateISO?: string): LibraryCheckout {
    const checkout = this.checkouts.get(checkoutId);
    if (!checkout) {
      throw new Error('CHECKOUT_NOT_FOUND');
    }

    if (checkout.status === 'RETURNED') {
      return checkout;
    }

    const returnTime = returnDateISO ? new Date(returnDateISO).getTime() : Date.now();
    const dueTime = new Date(checkout.dueAt).getTime();

    const diffDays = Math.floor((returnTime - dueTime) / (1000 * 60 * 60 * 24));
    const overdueDays = Math.max(0, diffDays);
    const fineAmount = overdueDays * DAILY_FINE_RATE;

    checkout.status = 'RETURNED';
    checkout.returnedAt = new Date(returnTime).toISOString();
    checkout.overdueDays = overdueDays;
    checkout.fineAmount = fineAmount;

    // Restore copy
    const item = this.items.get(checkout.itemId);
    if (item) {
      item.availableCopies = Math.min(item.totalCopies, item.availableCopies + 1);
      this.items.set(item.itemId, item);
    }

    this.checkouts.set(checkoutId, checkout);
    return checkout;
  }

  /**
   * Query active checkouts strictly by institution
   */
  public getCheckoutsByInstitution(institutionId: string): LibraryCheckout[] {
    const results: LibraryCheckout[] = [];
    const now = Date.now();

    for (const c of this.checkouts.values()) {
      if (c.institutionId !== institutionId) continue;

      // Update overdue days dynamically if still borrowed
      if (c.status === 'BORROWED') {
        const dueTime = new Date(c.dueAt).getTime();
        const diffDays = Math.floor((now - dueTime) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          c.overdueDays = diffDays;
          c.fineAmount = diffDays * DAILY_FINE_RATE;
          c.status = 'OVERDUE';
        }
      }

      results.push({ ...c });
    }

    return results.sort((a, b) => new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime());
  }

  /**
   * Clear store for tests
   */
  public clear(): void {
    this.items.clear();
    this.checkouts.clear();
  }
}

export const digitalLibraryStore = new DigitalLibraryStore();

/**
 * Standard Library Catalog Inventory CSV Export
 */
export function exportLibraryCatalogCSV(items: LibraryItem[]): string {
  const headers = [
    'Item_ID',
    'Institution_ID',
    'Title',
    'Authors',
    'ISBN_or_DOI',
    'Asset_Type',
    'Publisher',
    'Year',
    'Department',
    'Total_Copies',
    'Available_Copies',
    'Digital_Accessible',
  ];

  const rows = items.map(i => [
    `"${i.itemId}"`,
    `"${i.institutionId}"`,
    `"${i.title.replace(/"/g, '""')}"`,
    `"${i.authors.join('; ')}"`,
    `"${i.isbnOrDoi}"`,
    `"${i.assetType}"`,
    `"${i.publisher}"`,
    i.publicationYear,
    `"${i.department}"`,
    i.totalCopies,
    i.availableCopies,
    i.isDigitalAccessible ? 'YES' : 'NO',
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
