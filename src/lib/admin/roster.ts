/**
 * PinIT Career OS - Campus Admin Student Roster CSV Batch Ingestion Pipeline
 * Module ID: TASK-852
 * Architecture Reference: MULTI_BRANCH_PARALLEL_EXECUTION_SOP.md & PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf
 * 
 * Capabilities:
 * - Robust CSV parsing handling commas in quotes, CRLF/LF line breaks, and trim formatting.
 * - Flexible header mapping: maps varied university formats (e.g. "Roll No", "Register Number", "RegNo") into canonical keys.
 * - Input sanitization against XSS and SQL injection fragments.
 * - Multi-dimensional schema validation (email regex, CGPA scale 0-10, semester 1-10, graduation year).
 * - Duplicate roll number and email collision detection within batch.
 * - In-memory mock roster store for deterministic testing & offline mode.
 */

export interface StudentRosterRecord {
  rollNumber: string;
  fullName: string;
  email: string;
  department: string;
  batchYear: number;
  currentSemester: number;
  cgpa: number;
  phoneNumber?: string;
  status: 'active' | 'graduated' | 'suspended' | 'on_leave';
  institutionId: string;
}

export interface IngestionError {
  row: number;
  field: string;
  value: string;
  reason: string;
}

export interface RosterIngestionResult {
  success: boolean;
  totalRows: number;
  validRecords: StudentRosterRecord[];
  errors: IngestionError[];
  summary: {
    validCount: number;
    errorCount: number;
    duplicateCount: number;
  };
}

/** Header normalization dictionary */
const HEADER_SYNONYMS: Record<string, keyof StudentRosterRecord> = {
  'roll': 'rollNumber',
  'rollno': 'rollNumber',
  'rollnumber': 'rollNumber',
  'regno': 'rollNumber',
  'registernumber': 'rollNumber',
  'student_id': 'rollNumber',
  'name': 'fullName',
  'fullname': 'fullName',
  'studentname': 'fullName',
  'email': 'email',
  'emailaddress': 'email',
  'dept': 'department',
  'department': 'department',
  'branch': 'department',
  'batch': 'batchYear',
  'batchyear': 'batchYear',
  'graduationyear': 'batchYear',
  'year': 'batchYear',
  'sem': 'currentSemester',
  'semester': 'currentSemester',
  'currentsemester': 'currentSemester',
  'cgpa': 'cgpa',
  'gpa': 'cgpa',
  'phone': 'phoneNumber',
  'phonenumber': 'phoneNumber',
  'mobile': 'phoneNumber',
  'status': 'status',
};

/**
 * Sanitizes input string against basic injection vectors.
 */
function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/['";\\]/g, '')
    .trim();
}

/**
 * Splits CSV lines into tokens while respecting quotes.
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parses and validates raw CSV student roster data.
 */
export function parseStudentRosterCSV(
  csvContent: string,
  institutionId: string
): RosterIngestionResult {
  if (!institutionId || !institutionId.trim()) {
    throw new Error('Ingestion failed: institutionId is required for multi-tenant isolation.');
  }

  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return {
      success: false,
      totalRows: 0,
      validRecords: [],
      errors: [{ row: 1, field: 'header', value: '', reason: 'CSV must contain a header and at least one data row.' }],
      summary: { validCount: 0, errorCount: 1, duplicateCount: 0 },
    };
  }

  // Parse header
  const rawHeaders = parseCSVLine(lines[0]);
  const headerMap: Map<number, keyof StudentRosterRecord> = new Map();

  rawHeaders.forEach((h, index) => {
    const normalized = h.toLowerCase().replace(/[^a-z0-9]/g, '');
    const canonical = HEADER_SYNONYMS[normalized];
    if (canonical) {
      headerMap.set(index, canonical);
    }
  });

  // Verify mandatory headers
  const mappedFields = new Set(headerMap.values());
  const mandatoryFields: (keyof StudentRosterRecord)[] = ['rollNumber', 'fullName', 'email', 'department'];
  for (const req of mandatoryFields) {
    if (!mappedFields.has(req)) {
      return {
        success: false,
        totalRows: lines.length - 1,
        validRecords: [],
        errors: [{ row: 1, field: String(req), value: '', reason: `Missing mandatory header column for [${String(req)}].` }],
        summary: { validCount: 0, errorCount: 1, duplicateCount: 0 },
      };
    }
  }

  const validRecords: StudentRosterRecord[] = [];
  const errors: IngestionError[] = [];
  const seenRolls = new Set<string>();
  const seenEmails = new Set<string>();
  let duplicateCount = 0;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (let rowIdx = 1; rowIdx < lines.length; rowIdx++) {
    const tokens = parseCSVLine(lines[rowIdx]);
    const rawData: Partial<StudentRosterRecord> = {};

    headerMap.forEach((field, colIdx) => {
      const val = tokens[colIdx] ? sanitizeInput(tokens[colIdx]) : '';
      (rawData as any)[field] = val;
    });

    let rowHasError = false;

    // 1. Roll Number Validation
    const roll = (rawData.rollNumber || '').toUpperCase();
    if (!roll) {
      errors.push({ row: rowIdx + 1, field: 'rollNumber', value: '', reason: 'Roll number is required.' });
      rowHasError = true;
    } else if (seenRolls.has(roll)) {
      errors.push({ row: rowIdx + 1, field: 'rollNumber', value: roll, reason: 'Duplicate roll number in batch.' });
      duplicateCount++;
      rowHasError = true;
    }

    // 2. Full Name
    const name = rawData.fullName || '';
    if (!name || name.length < 2) {
      errors.push({ row: rowIdx + 1, field: 'fullName', value: name, reason: 'Full name must be at least 2 characters.' });
      rowHasError = true;
    }

    // 3. Email Validation
    const email = (rawData.email || '').toLowerCase();
    if (!email || !emailRegex.test(email)) {
      errors.push({ row: rowIdx + 1, field: 'email', value: email, reason: 'Invalid email address format.' });
      rowHasError = true;
    } else if (seenEmails.has(email)) {
      errors.push({ row: rowIdx + 1, field: 'email', value: email, reason: 'Duplicate email address in batch.' });
      duplicateCount++;
      rowHasError = true;
    }

    // 4. Department
    const dept = (rawData.department || '').toUpperCase();
    if (!dept) {
      errors.push({ row: rowIdx + 1, field: 'department', value: '', reason: 'Department / Branch is required.' });
      rowHasError = true;
    }

    // 5. Batch Year (Default current year + 1 if not provided)
    let batchYear = Number(rawData.batchYear);
    if (!batchYear || isNaN(batchYear)) {
      batchYear = new Date().getFullYear();
    } else if (batchYear < 2000 || batchYear > 2045) {
      errors.push({ row: rowIdx + 1, field: 'batchYear', value: String(batchYear), reason: 'Batch graduation year must be between 2000 and 2045.' });
      rowHasError = true;
    }

    // 6. Current Semester (Default 1 if missing)
    let sem = Number(rawData.currentSemester);
    if (!sem || isNaN(sem)) {
      sem = 1;
    } else if (sem < 1 || sem > 12) {
      errors.push({ row: rowIdx + 1, field: 'currentSemester', value: String(sem), reason: 'Semester must be between 1 and 12.' });
      rowHasError = true;
    }

    // 7. CGPA (Default 0.0 if missing)
    let cgpa = Number(rawData.cgpa);
    if (isNaN(cgpa)) {
      cgpa = 0.0;
    } else if (cgpa < 0 || cgpa > 10.0) {
      errors.push({ row: rowIdx + 1, field: 'cgpa', value: String(cgpa), reason: 'CGPA must be between 0.00 and 10.00.' });
      rowHasError = true;
    }

    // 8. Status
    let status: StudentRosterRecord['status'] = 'active';
    if (rawData.status && ['active', 'graduated', 'suspended', 'on_leave'].includes(rawData.status.toLowerCase())) {
      status = rawData.status.toLowerCase() as StudentRosterRecord['status'];
    }

    if (!rowHasError) {
      seenRolls.add(roll);
      seenEmails.add(email);
      validRecords.push({
        rollNumber: roll,
        fullName: name,
        email,
        department: dept,
        batchYear,
        currentSemester: sem,
        cgpa,
        phoneNumber: rawData.phoneNumber || undefined,
        status,
        institutionId,
      });
    }
  }

  return {
    success: errors.length === 0,
    totalRows: lines.length - 1,
    validRecords,
    errors,
    summary: {
      validCount: validRecords.length,
      errorCount: errors.length,
      duplicateCount,
    },
  };
}

/** In-memory persistent mock roster store for offline resilience */
export class InMemoryRosterStore {
  private static store: Map<string, StudentRosterRecord> = new Map();

  static upsertStudents(records: StudentRosterRecord[]): { inserted: number; updated: number } {
    let inserted = 0;
    let updated = 0;

    for (const rec of records) {
      const key = `${rec.institutionId}:${rec.rollNumber}`;
      if (this.store.has(key)) {
        this.store.set(key, rec);
        updated++;
      } else {
        this.store.set(key, rec);
        inserted++;
      }
    }

    return { inserted, updated };
  }

  static getStudentsByInstitution(institutionId: string): StudentRosterRecord[] {
    const results: StudentRosterRecord[] = [];
    for (const [key, student] of this.store.entries()) {
      if (student.institutionId === institutionId) {
        results.push(student);
      }
    }
    return results;
  }

  static clear(): void {
    this.store.clear();
  }
}
