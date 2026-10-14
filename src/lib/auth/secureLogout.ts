import type { QueryClient } from '@tanstack/react-query';

export interface SecureLogoutOptions {
  queryClient?: QueryClient | null;
  authLogout?: () => Promise<void>;
  redirectTo?: string;
}

/**
 * Performs a comprehensive, secure logout:
 * 1. Purges TanStack React Query cache (in-memory data)
 * 2. Calls AuthContext / Supabase logout
 * 3. Deletes server HttpOnly session cookies via /api/auth/session
 * 4. Clears all browser localStorage items (preserving theme if set)
 * 5. Clears sessionStorage completely
 * 6. Purges IndexedDB voice cache
 * 7. Clears all client-accessible cookies
 * 8. Broadcasts FORCE_STORAGE_PURGE to all open tabs
 * 9. Replaces browser history state and navigates via window.location.replace
 *    to prevent the user from re-entering via the browser "Back" button.
 */
export async function executeSecureLogout(options: SecureLogoutOptions = {}): Promise<void> {
  const { queryClient, authLogout, redirectTo = '/login' } = options;

  // 1. Invalidate and clear in-memory TanStack query cache
  if (queryClient) {
    try {
      queryClient.cancelQueries();
      queryClient.clear();
      queryClient.removeQueries();
    } catch (e) {
      console.warn('[SecureLogout] QueryClient clear error:', e);
    }
  }

  // 2. Call AuthContext / Supabase signOut
  if (authLogout) {
    try {
      await authLogout();
    } catch (e) {
      console.warn('[SecureLogout] AuthContext logout error:', e);
    }
  }

  // 3. Client Storage & Cookie Purge (Guaranteed fallback even if AuthContext threw)
  if (typeof window !== 'undefined') {
    // 3a. Clear localStorage (preserve theme if set)
    try {
      const theme = window.localStorage.getItem('pc_theme');
      window.localStorage.clear();
      if (theme) {
        window.localStorage.setItem('pc_theme', theme);
      }
    } catch (e) {
      console.warn('[SecureLogout] localStorage clear error:', e);
    }

    // 3b. Clear sessionStorage
    try {
      window.sessionStorage.clear();
    } catch (e) {
      console.warn('[SecureLogout] sessionStorage clear error:', e);
    }

    // 3c. Purge IndexedDB Voice Cache
    try {
      const { voiceCacheDB } = await import('@/lib/voiceCacheDB');
      await voiceCacheDB.clearCache();
    } catch (e) {
      // Voice cache might not be present or initialized
    }

    // 3d. Invalidate server session HttpOnly cookies
    try {
      await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
    } catch {}

    // 3e. Expire client-accessible cookies
    try {
      if (typeof document !== 'undefined' && document.cookie) {
        const cookies = document.cookie.split(';');
        for (const c of cookies) {
          const eq = c.indexOf('=');
          const name = eq > -1 ? c.substring(0, eq).trim() : c.trim();
          if (name) {
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
            if (window.location && window.location.hostname) {
              document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
            }
          }
        }
      }
    } catch {}

    // 3f. Multi-tab BroadcastChannel notification
    if ('BroadcastChannel' in window) {
      try {
        const authSync = new BroadcastChannel('pinit_career_os_sync');
        authSync.postMessage({ type: 'FORCE_STORAGE_PURGE', timestamp: Date.now() });
        authSync.close();
      } catch {}
    }

    // 4. Overwrite history state and hard-replace location so Back button cannot return
    try {
      if (window.history && typeof window.history.replaceState === 'function') {
        window.history.replaceState(null, '', redirectTo);
      }
      if (window.location && typeof window.location.replace === 'function') {
        window.location.replace(redirectTo);
      } else {
        window.location.href = redirectTo;
      }
    } catch {
      window.location.href = redirectTo;
    }
  }
}
