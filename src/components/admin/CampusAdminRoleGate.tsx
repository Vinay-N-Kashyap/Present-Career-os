'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { isDemoAuthEnabled } from '@/lib/demoAuth';
import { supabase } from '@/lib/supabaseClient';

const ALLOWED_ADMIN_ROLES = ['admin', 'superadmin', 'dean', 'campus_admin', 'director', 'faculty'];

export default function CampusAdminRoleGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090d16',
          color: '#64748b'
        }}
      >
        <div style={{ fontSize: 35, marginBottom: 12 }}>🏛️</div>
        <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
          Verifying institutional administrator credentials...
        </div>
      </div>
    );
  }

  // If user is not authenticated and demo auth is NOT enabled
  const demoActive = isDemoAuthEnabled() || process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === 'true';

  if (!user && !demoActive) {
    const handleDemoAdminLogin = async () => {
      setIsLoggingIn(true);
      setLoginError(null);
      try {
        const res = await fetch('/api/auth/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@pinit.in' })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Demo login failed');
        await supabase.auth.setSession({
          access_token: json.access_token,
          refresh_token: json.refresh_token
        });
        window.location.reload();
      } catch (err: any) {
        setLoginError(err?.message || 'Authentication failed');
      } finally {
        setIsLoggingIn(false);
      }
    };

    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#090d16',
          padding: 24,
          color: '#f8fafc'
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: '100%',
            padding: 32,
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: 12,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px 0' }}>
            Campus Administration Restricted
          </h2>
          <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.5, marginBottom: 24 }}>
            This governance console is strictly restricted to institutional Deans, Directors, and authorized Campus Administrators.
          </p>

          {loginError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: '#450a0a',
                color: '#f87171',
                fontSize: 13,
                marginBottom: 16
              }}
            >
              {loginError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => (window.location.href = '/login?role=admin')}
              style={{
                width: '100%',
                padding: '12px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Sign in with Campus SSO / Credentials
            </button>
            <button
              onClick={handleDemoAdminLogin}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                color: '#94a3b8',
                border: '1px solid #334155',
                borderRadius: 8,
                fontWeight: 500,
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                fontSize: 13
              }}
            >
              {isLoggingIn ? 'Authenticating...' : '⚡ Quick Demo Dean Access'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
