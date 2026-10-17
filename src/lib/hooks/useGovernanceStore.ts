'use client';

import { useState, useEffect } from 'react';
import {
  loadGovernanceRecords,
  saveGovernanceRecord,
  PersistenceResult
} from '@/lib/services/governancePersistence';

export interface GovernanceStoreHook<T> {
  records: T[];
  setRecords: React.Dispatch<React.SetStateAction<T[]>>;
  loading: boolean;
  syncSource: 'supabase' | 'local_storage' | 'memory';
  isSaving: boolean;
  lastSaved: string | null;
  saveRecord: (record: T) => Promise<PersistenceResult<T>>;
}

/**
 * Universal Governance Store Hook
 * Connects any Campus Admin or Faculty Studio component to Supabase PostgreSQL
 * with automatic fallback to client-side localStorage/in-memory cache.
 */
export function useGovernanceStore<T extends Record<string, any>>(
  tableName: string,
  initialData: T[],
  primaryKey: string = 'id'
): GovernanceStoreHook<T> {
  const [records, setRecords] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [syncSource, setSyncSource] = useState<'supabase' | 'local_storage' | 'memory'>('memory');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const res = await loadGovernanceRecords(tableName, initialData);
        if (mounted) {
          setRecords(res.data);
          setSyncSource(res.source);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setRecords(initialData);
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [tableName]);

  const saveRecord = async (record: T): Promise<PersistenceResult<T>> => {
    setIsSaving(true);
    const recId = record[primaryKey];
    let previousSnapshot: T[] = [];

    // Optimistic UI state update with snapshot preservation
    setRecords((prev) => {
      previousSnapshot = prev;
      const idx = prev.findIndex((item) => item[primaryKey] === recId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = record;
        return copy;
      }
      return [record, ...prev];
    });

    try {
      const res = await saveGovernanceRecord(tableName, record, primaryKey);
      if (!res.success) {
        // Rollback state on persistence failure
        setRecords(previousSnapshot);
        setIsSaving(false);
        return res;
      }
      setSyncSource(res.source);
      setLastSaved(new Date().toLocaleTimeString());
      setIsSaving(false);
      return res;
    } catch (e: any) {
      // Rollback state on thrown exception
      setRecords(previousSnapshot);
      setIsSaving(false);
      return { success: false, source: 'memory', error: e?.message };
    }
  };

  return {
    records,
    setRecords,
    loading,
    syncSource,
    isSaving,
    lastSaved,
    saveRecord
  };
}
