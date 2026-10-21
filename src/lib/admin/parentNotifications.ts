/**
 * Parent Portal Telemetry & Automated Notification Gateway (TASK-878)
 * 
 * Provides:
 * 1. Automatic trigger rules: Attendance deficit (<75%), Academic critical risk, Fee overdue, and Milestone honors.
 * 2. Templated multi-channel dispatch payload preparation (WhatsApp, SMS, Email).
 * 3. Ephemeral passwordless Parent Magic Link generator with cryptographic HMAC-SHA256 validation.
 * 4. Multi-tenant isolation and anti-spam notification rate limiter.
 */

import { createHmac, randomBytes } from 'crypto';

export type NotificationCategory =
  | 'ATTENDANCE_DEFICIT_WARNING'
  | 'CRITICAL_ACADEMIC_RISK'
  | 'FEE_OVERDUE_ALERT'
  | 'CAPSTONE_HONOR_COMMENDATION';

export type DispatchChannel = 'WHATSAPP' | 'SMS' | 'EMAIL';

export interface ParentContact {
  studentId: string;
  studentName: string;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  preferredChannel: DispatchChannel;
}

export interface ParentNotificationPayload {
  notificationId: string;
  institutionId: string;
  studentId: string;
  category: NotificationCategory;
  channel: DispatchChannel;
  recipientContact: string;
  title: string;
  messageBody: string;
  magicPortalUrl: string;
  createdAt: string;
  status: 'QUEUED' | 'SENT' | 'FAILED' | 'THROTTLED';
}

export interface MagicTokenPayload {
  studentId: string;
  institutionId: string;
  expiresAt: number; // Unix timestamp ms
}

const DEFAULT_SECRET = 'pinit_parent_secret_key_2026';

/**
 * Generates an ephemeral cryptographic magic link for parents
 * Valid for 7 days by default
 */
export function generateParentMagicToken(
  payload: MagicTokenPayload,
  secretKey: string = DEFAULT_SECRET
): string {
  const data = `${payload.studentId}:${payload.institutionId}:${payload.expiresAt}`;
  const sig = createHmac('sha256', secretKey)
    .update(data)
    .digest('hex')
    .slice(0, 24);

  return `${payload.studentId}.${payload.institutionId}.${payload.expiresAt}.${sig}`;
}

/**
 * Validates cryptographic authenticity and expiration of parent magic token
 */
export function validateParentMagicToken(
  token: string,
  secretKey: string = DEFAULT_SECRET,
  currentTimeMs: number = Date.now()
): { valid: boolean; payload?: MagicTokenPayload; error?: string } {
  const parts = token.split('.');
  if (parts.length !== 4) {
    return { valid: false, error: 'MALFORMED_TOKEN' };
  }

  const [studentId, institutionId, expiresAtStr, sig] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);

  if (isNaN(expiresAt) || currentTimeMs > expiresAt) {
    return { valid: false, error: 'TOKEN_EXPIRED' };
  }

  const data = `${studentId}:${institutionId}:${expiresAt}`;
  const expectedSig = createHmac('sha256', secretKey)
    .update(data)
    .digest('hex')
    .slice(0, 24);

  if (sig !== expectedSig) {
    return { valid: false, error: 'SIGNATURE_INVALID' };
  }

  return {
    valid: true,
    payload: {
      studentId,
      institutionId,
      expiresAt,
    },
  };
}

/**
 * Templates for parent notices
 */
export const NOTIFICATION_TEMPLATES: Record<NotificationCategory, { title: string; template: string }> = {
  ATTENDANCE_DEFICIT_WARNING: {
    title: '⚠️ Urgent: Attendance Deficit Warning',
    template: 'Dear {{parent_name}}, attendance for {{student_name}} ({{roll_number}}) has dropped to {{metric_value}}% (below the required 75.0% threshold). Please review official records via your secure parent portal: {{magic_url}}',
  },
  CRITICAL_ACADEMIC_RISK: {
    title: '🚨 Academic Advisory Conference Required',
    template: 'Dear {{parent_name}}, {{student_name}} has been flagged for critical academic risk in recent coursework. Faculty advisor {{advisor_name}} invites you to schedule a virtual review: {{magic_url}}',
  },
  FEE_OVERDUE_ALERT: {
    title: '📋 Institutional Fee Payment Reminder',
    template: 'Dear {{parent_name}}, an outstanding balance of ₹{{metric_value}} for {{student_name}} is overdue. View itemized fee sub-ledger breakdown and make an online payment: {{magic_url}}',
  },
  CAPSTONE_HONOR_COMMENDATION: {
    title: '🌟 Academic Achievement Commendation',
    template: 'Dear {{parent_name}}, congratulations! {{student_name}} has completed their Capstone Project with Distinction (Grade {{metric_value}}). View their verifiable portfolio: {{magic_url}}',
  },
};

/**
 * Builds and formats a notification payload
 */
export function buildParentNotification(params: {
  institutionId: string;
  contact: ParentContact;
  category: NotificationCategory;
  metricValue?: string | number;
  advisorName?: string;
  secretKey?: string;
}): ParentNotificationPayload {
  const { institutionId, contact, category, metricValue, advisorName, secretKey } = params;

  // Generate 7-day magic link
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = Date.now() + sevenDaysMs;
  const token = generateParentMagicToken(
    { studentId: contact.studentId, institutionId, expiresAt },
    secretKey
  );

  const magicPortalUrl = `/parent/portal?token=${token}`;
  const templateConfig = NOTIFICATION_TEMPLATES[category];

  let body = templateConfig.template
    .replace('{{parent_name}}', contact.parentName)
    .replace('{{student_name}}', contact.studentName)
    .replace('{{roll_number}}', contact.rollNumber)
    .replace('{{magic_url}}', magicPortalUrl);

  if (metricValue !== undefined) {
    body = body.replace('{{metric_value}}', String(metricValue));
  }
  if (advisorName) {
    body = body.replace('{{advisor_name}}', advisorName);
  }

  const recipientContact = contact.preferredChannel === 'EMAIL' 
    ? contact.parentEmail 
    : contact.parentPhone;

  return {
    notificationId: `notif_${Date.now()}_${randomBytes(3).toString('hex')}`,
    institutionId,
    studentId: contact.studentId,
    category,
    channel: contact.preferredChannel,
    recipientContact,
    title: templateConfig.title,
    messageBody: body,
    magicPortalUrl,
    createdAt: new Date().toISOString(),
    status: 'QUEUED',
  };
}

/**
 * In-memory notification dispatcher & rate-limiting queue
 */
class ParentNotificationStore {
  private notifications: ParentNotificationPayload[] = [];
  // Key: institutionId:studentId:category -> lastSentTimestampMs
  private throttleMap: Map<string, number> = new Map();

  // Rate limit window: 12 hours between identical category notices for the same student
  private readonly THROTTLE_WINDOW_MS = 12 * 60 * 60 * 1000;

  public dispatch(
    payload: ParentNotificationPayload,
    currentTimeMs: number = Date.now()
  ): { success: boolean; status: ParentNotificationPayload['status']; reason?: string } {
    const throttleKey = `${payload.institutionId}:${payload.studentId}:${payload.category}`;
    const lastSent = this.throttleMap.get(throttleKey);

    if (lastSent && currentTimeMs - lastSent < this.THROTTLE_WINDOW_MS) {
      payload.status = 'THROTTLED';
      this.notifications.push(payload);
      return {
        success: false,
        status: 'THROTTLED',
        reason: 'Rate limit applied: Notice already dispatched within last 12 hours',
      };
    }

    payload.status = 'SENT';
    this.throttleMap.set(throttleKey, currentTimeMs);
    this.notifications.push(payload);

    return {
      success: true,
      status: 'SENT',
    };
  }

  public getNotificationsByInstitution(institutionId: string): ParentNotificationPayload[] {
    return this.notifications.filter(n => n.institutionId === institutionId);
  }

  public clear(): void {
    this.notifications = [];
    this.throttleMap.clear();
  }
}

export const parentNotificationStore = new ParentNotificationStore();
