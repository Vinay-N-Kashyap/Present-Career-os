import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { executeSecureLogout } from '../src/lib/auth/secureLogout';
import SecurityTab from '../src/app/profile/tabs/SecurityTab';
import SettingsTab from '../src/app/profile/tabs/SettingsTab';

describe('Profile Logout & Browser History Protection Suite', () => {
  it('purges all cache stores (QueryClient, localStorage, sessionStorage, cookies)', async () => {
    let mockLocalStorage: Record<string, string> = {
      'pc_theme': 'dark',
      'pinit_user_123_xp': '250',
      'sb-access-token': 'jwt_fake_token',
      'pinit_current_user': '{"id":"usr_123"}'
    };

    let mockSessionStorage: Record<string, string> = {
      'pinit_active_session': 'active',
      'temp_quiz_answer': 'A'
    };

    let postMessageCalled = false;
    let postMessageData: any = null;
    let replaceStateCalledWith: any = null;
    let locationReplaceCalledWith: any = null;
    let fetchCalledWith: any = null;

    (global as any).fetch = async (url: string, opts: any) => {
      fetchCalledWith = { url, opts };
      return { ok: true, json: async () => ({ success: true }) };
    };

    (global as any).localStorage = {
      getItem: (k: string) => mockLocalStorage[k] || null,
      setItem: (k: string, v: string) => { mockLocalStorage[k] = v; },
      removeItem: (k: string) => { delete mockLocalStorage[k]; },
      clear: () => { mockLocalStorage = {}; },
      key: (i: number) => Object.keys(mockLocalStorage)[i] || null,
      get length() { return Object.keys(mockLocalStorage).length; }
    };

    (global as any).sessionStorage = {
      getItem: (k: string) => mockSessionStorage[k] || null,
      setItem: (k: string, v: string) => { mockSessionStorage[k] = v; },
      removeItem: (k: string) => { delete mockSessionStorage[k]; },
      clear: () => { mockSessionStorage = {}; },
      key: (i: number) => Object.keys(mockSessionStorage)[i] || null,
      get length() { return Object.keys(mockSessionStorage).length; }
    };

    (global as any).BroadcastChannel = class {
      postMessage(data: any) {
        postMessageCalled = true;
        postMessageData = data;
      }
      close() {}
    };

    (global as any).window = {
      localStorage: (global as any).localStorage,
      sessionStorage: (global as any).sessionStorage,
      history: {
        replaceState: (state: any, title: string, url: string) => {
          replaceStateCalledWith = { state, title, url };
        },
        pushState: () => {},
      },
      location: {
        replace: (url: string) => {
          locationReplaceCalledWith = url;
        },
        href: '/profile',
        hostname: 'localhost'
      },
      BroadcastChannel: (global as any).BroadcastChannel,
    };

    (global as any).document = {
      cookie: 'pinit_session=xyz; pinit_uid=usr_123; sb-token=abc'
    };

    let cancelQueriesCalled = false;
    let clearQueriesCalled = false;
    let removeQueriesCalled = false;
    const mockQueryClient = {
      cancelQueries: () => { cancelQueriesCalled = true; },
      clear: () => { clearQueriesCalled = true; },
      removeQueries: () => { removeQueriesCalled = true; }
    } as any;

    let authLogoutCalled = false;
    const mockAuthLogout = async () => {
      authLogoutCalled = true;
    };

    await executeSecureLogout({
      queryClient: mockQueryClient,
      authLogout: mockAuthLogout,
      redirectTo: '/login'
    });

    // 1. In-memory React Query cache cleared
    assert.equal(cancelQueriesCalled, true, 'queryClient.cancelQueries must be called');
    assert.equal(clearQueriesCalled, true, 'queryClient.clear must be called');
    assert.equal(removeQueriesCalled, true, 'queryClient.removeQueries must be called');

    // 2. AuthContext logout invoked
    assert.equal(authLogoutCalled, true, 'authLogout must be invoked');

    // 3. localStorage wiped except theme preference
    assert.equal(mockLocalStorage['pinit_user_123_xp'], undefined);
    assert.equal(mockLocalStorage['sb-access-token'], undefined);
    assert.equal(mockLocalStorage['pinit_current_user'], undefined);
    assert.equal(mockLocalStorage['pc_theme'], 'dark');

    // 4. sessionStorage wiped completely
    assert.equal(mockSessionStorage['pinit_active_session'], undefined);
    assert.equal(mockSessionStorage['temp_quiz_answer'], undefined);

    // 5. Server session HttpOnly cookie deletion endpoint called
    assert.deepEqual(fetchCalledWith, { url: '/api/auth/session', opts: { method: 'DELETE' } });

    // 6. BroadcastChannel purge event dispatched
    assert.equal(postMessageCalled, true);
    assert.equal(postMessageData?.type, 'FORCE_STORAGE_PURGE');

    // 7. Browser history replaced to defeat back button re-entry
    assert.deepEqual(replaceStateCalledWith, { state: null, title: '', url: '/login' });
    assert.equal(locationReplaceCalledWith, '/login');
  });

  it('renders prominent logout triggers in SecurityTab and SettingsTab', () => {
    // 1. SecurityTab Danger Zone logout button
    const securityHtml = renderToString(
      React.createElement(SecurityTab, {
        logout: async () => {},
        router: { push: () => {} }
      })
    );
    assert.match(securityHtml, /data-testid="security-danger-logout-btn"/);
    assert.match(securityHtml, /Sign Out &amp; Clear All Sessions/);

    // 2. SettingsTab Session & Sign Out card
    const settingsHtml = renderToString(
      React.createElement(SettingsTab, {
        soundscapeVol: 0.5,
        setSoundscapeVol: () => {},
        onLogout: () => {},
        loggingOut: false
      })
    );
    assert.match(settingsHtml, /data-testid="settings-logout-btn"/);
    assert.match(settingsHtml, /Sign Out Account/);
  });

  it('handles auth network error gracefully and still forces complete cache wipe & history replacement', async () => {
    let mockLocalStorage: Record<string, string> = { 'sensitive_token': 'secret123' };
    let locationReplaceTarget = '';

    (global as any).localStorage = {
      getItem: (k: string) => mockLocalStorage[k] || null,
      setItem: (k: string, v: string) => { mockLocalStorage[k] = v; },
      clear: () => { mockLocalStorage = {}; }
    };
    (global as any).sessionStorage = { clear: () => {} };
    (global as any).window = {
      localStorage: (global as any).localStorage,
      sessionStorage: (global as any).sessionStorage,
      history: { replaceState: () => {} },
      location: { replace: (url: string) => { locationReplaceTarget = url; }, href: '/profile' }
    };

    const failingLogout = async () => {
      throw new Error('Supabase network error during sign out');
    };

    await executeSecureLogout({
      authLogout: failingLogout,
      redirectTo: '/login'
    });

    assert.equal(mockLocalStorage['sensitive_token'], undefined, 'Local storage must be purged even on auth failure');
    assert.equal(locationReplaceTarget, '/login', 'History replacement must proceed even on auth failure');
  });
});
