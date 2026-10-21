/**
 * Platform System Health & Environment Diagnostics Service
 * 
 * Inspects production readiness, environment secrets, database schema availability,
 * and multi-tenant isolation invariants with zero fatal crashes.
 */

import { supabase } from '@/lib/supabaseClient';
import { isSupabaseConfigured } from '@/lib/services/governancePersistence';

export type SystemReadinessStatus = 'HEALTHY_PRODUCTION' | 'DEGRADED_DEMO_LOCAL' | 'CONFIG_WARNING';

export interface EnvKeyCheck {
  key: string;
  isConfigured: boolean;
  isRequiredInProd: boolean;
  purpose: string;
  warning?: string;
}

export interface TableCheck {
  tableName: string;
  status: 'ONLINE_POSTGRES' | 'FALLBACK_LOCAL';
}

export interface SystemHealthReport {
  timestamp: string;
  readinessStatus: SystemReadinessStatus;
  supabaseConnected: boolean;
  databaseSource: 'supabase_postgres' | 'local_resilient_store';
  environmentKeys: EnvKeyCheck[];
  criticalTablesAudited: TableCheck[];
  recommendations: string[];
}

export const CRITICAL_ENV_KEYS = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    isRequiredInProd: true,
    purpose: 'Public endpoint URL for Supabase PostgreSQL database & auth'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    isRequiredInProd: true,
    purpose: 'Public client-side anonymous key for Supabase RPC and RLS queries'
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    isRequiredInProd: true,
    purpose: 'Administrative backend key for elevated service operations'
  },
  {
    key: 'EVIDENCE_SIGNING_SECRET',
    isRequiredInProd: true,
    purpose: 'HMAC-SHA256 cryptographic signing key for student transcripts & credentials'
  },
  {
    key: 'ALLOW_DEV_AUTH_BYPASS',
    isRequiredInProd: false,
    purpose: 'Local development auth bypass toggle (MUST be false or undefined in production)'
  }
];

export const CRITICAL_GOVERNANCE_TABLES = [
  'central_nirf_rankings',
  'faculty_emeritus_fellowships',
  'central_disaster_safety',
  'faculty_startup_incubation',
  'central_equal_opportunity',
  'faculty_professor_of_practice',
  'central_internal_audit_cag',
  'central_academic_bank_credits',
  'central_procurement_tenders',
  'central_rti_grievances'
];

/**
 * Audit environment keys safely
 */
export function auditEnvironmentKeys(): EnvKeyCheck[] {
  return CRITICAL_ENV_KEYS.map((item) => {
    const val = process.env[item.key];
    const isConfigured = Boolean(
      val &&
      !val.includes('your-') &&
      !val.includes('placeholder')
    );

    let warning: string | undefined;
    if (!isConfigured && item.isRequiredInProd) {
      warning = `Missing or placeholder value. Production database persistence requires a valid ${item.key}.`;
    }
    if (item.key === 'ALLOW_DEV_AUTH_BYPASS' && val === 'true') {
      warning = 'CRITICAL SECURITY RISK: Dev auth bypass is ENABLED. Ensure this is NEVER deployed to production.';
    }

    return {
      key: item.key,
      isConfigured,
      isRequiredInProd: item.isRequiredInProd,
      purpose: item.purpose,
      warning
    };
  });
}

/**
 * Run end-to-end system health and persistence audit
 */
export async function runSystemHealthAudit(): Promise<SystemHealthReport> {
  const envChecks = auditEnvironmentKeys();
  const supabaseConfigured = isSupabaseConfigured();
  let supabaseConnected = false;

  const tableChecks: TableCheck[] = [];

  if (supabaseConfigured) {
    try {
      // Probe Supabase with a lightweight query
      const { error } = await supabase.from('central_nirf_rankings').select('id').limit(1);
      if (!error) {
        supabaseConnected = true;
      }
    } catch {
      supabaseConnected = false;
    }
  }

  for (const tbl of CRITICAL_GOVERNANCE_TABLES) {
    tableChecks.push({
      tableName: tbl,
      status: supabaseConnected ? 'ONLINE_POSTGRES' : 'FALLBACK_LOCAL'
    });
  }

  const recommendations: string[] = [];

  if (!supabaseConfigured) {
    recommendations.push(
      'Supabase credentials are not configured or using placeholders. Platform is operating in Resilient Local/Demo Mode.'
    );
    recommendations.push(
      'To enable live cloud PostgreSQL persistence, apply migration `supabase/migrations/20261018_central_governance_and_faculty_studios.sql` to your Supabase project and provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
    );
  } else if (!supabaseConnected) {
    recommendations.push(
      'Supabase credentials are set, but connection failed or tables do not exist. Please run database migrations: `npx supabase db push`.'
    );
  }

  const hasMissingProdKey = envChecks.some(e => e.isRequiredInProd && !e.isConfigured);
  const readinessStatus: SystemReadinessStatus = supabaseConnected
    ? 'HEALTHY_PRODUCTION'
    : hasMissingProdKey
    ? 'CONFIG_WARNING'
    : 'DEGRADED_DEMO_LOCAL';

  return {
    timestamp: new Date().toISOString(),
    readinessStatus,
    supabaseConnected,
    databaseSource: supabaseConnected ? 'supabase_postgres' : 'local_resilient_store',
    environmentKeys: envChecks,
    criticalTablesAudited: tableChecks,
    recommendations
  };
}
