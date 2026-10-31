'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '@/lib/api/hooks';
import { toast } from '@/lib/store/useAppStore';
import Link from 'next/link';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { getUserSoundscapeVolume } from '@/lib/audio/soundscapes';
import { executeSecureLogout } from '@/lib/auth/secureLogout';

import PortfolioTab from './tabs/PortfolioTab';
import PassportTab, { type PassportView } from './tabs/PassportTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import PreferencesTab from './tabs/PreferencesTab';
import SettingsTab from './tabs/SettingsTab';
import SecurityTab from './tabs/SecurityTab';
import ActivityTab from './tabs/ActivityTab';

/** The 4 top-level profile areas. */
type TabType = 'portfolio' | 'passport' | 'analytics' | 'settings';

/** Legacy `?tab=` values (8 old tabs) → new tab + the section to focus. */
const LEGACY_TAB_MAP: Record<string, { tab: TabType; section?: string }> = {
  portfolio:    { tab: 'portfolio' },
  passport:     { tab: 'passport' },
  'career-dna': { tab: 'passport', section: 'dna' },
  analytics:    { tab: 'analytics' },
  activity:     { tab: 'analytics', section: 'activity' },
  settings:     { tab: 'settings' },
  preferences:  { tab: 'settings', section: 'preferences' },
  security:     { tab: 'settings', section: 'security' },
};

const TABS: Array<{ id: TabType; icon: string; label: string; hint: string }> = [
  { id: 'portfolio', icon: '👤', label: 'Portfolio',          hint: 'Pitch, projects, credentials, resume' },
  { id: 'passport',  icon: '🎫', label: 'Skills & DNA',       hint: 'Skill passport, career DNA, pathway' },
  { id: 'analytics', icon: '📊', label: 'Growth & Activity',  hint: 'Progress analytics and history' },
  { id: 'settings',  icon: '⚙️', label: 'Settings',           hint: 'Preferences, audio, security, sign out' },
];

export default function ProfilePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t3)' }}>Loading…</div>}>
      <ProfilePageInner />
    </Suspense>
  );
}

function SectionHeading({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: 80, margin: '8px 0 12px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--t3)', margin: '2px 0 0' }}>{subtitle}</p>}
    </div>
  );
}

function ProfilePageInner() {
  const { user, logout } = useAuth();
  const cOS = useCareerOS();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();

  const [teacherId, setTeacherId] = useState(user?.selectedTeacherId || 'priya');
  const [visibility, setVisibility] = useState('recruiters_only');
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await executeSecureLogout({
      queryClient: qc,
      authLogout: logout,
      redirectTo: '/login'
    });
  };

  // Focus Audio Soundscape Volume State (0–100)
  const [soundscapeVol, setSoundscapeVol] = useState<number>(50);
  const [isPreviewingAudio, setIsPreviewingAudio] = useState(false);

  useEffect(() => {
    setSoundscapeVol(getUserSoundscapeVolume());
  }, []);

  // Sync state from authoritative user profile
  useEffect(() => {
    if (user) {
      if (user.selectedTeacherId) {
        setTeacherId(user.selectedTeacherId);
      }
      const rVis = (user as any).recruiter_visibility ?? (user as any).recruiterVisibility;
      if (rVis !== undefined && rVis !== null) {
        const num = Number(rVis);
        if (num === 0) setVisibility('private');
        else if (num === 100) setVisibility('public');
        else if (num === 50) setVisibility('institution_only');
        else setVisibility('recruiters_only');
      }
    }
  }, [user]);

  const [tab, setTab] = useState<TabType>('portfolio');
  const [focusSection, setFocusSection] = useState<string | undefined>(undefined);

  // Read URL `?tab=` (supports all 8 legacy values) to pick tab + section
  useEffect(() => {
    let tabParam = searchParams.get('tab');
    if (!tabParam) {
      for (const k of Array.from(searchParams.keys())) {
        if (k.toLowerCase().includes('setting')) {
          tabParam = 'settings';
          break;
        }
      }
    }
    const mapped = tabParam ? LEGACY_TAB_MAP[tabParam] : undefined;
    if (mapped) {
      setTab(mapped.tab);
      setFocusSection(mapped.section);
    }
  }, [searchParams]);

  // Scroll to the focused section (e.g. ?tab=security) once it has rendered
  useEffect(() => {
    if (!focusSection || focusSection === 'dna' || typeof window === 'undefined') return;
    const t = window.setTimeout(() => {
      document.getElementById(`profile-section-${focusSection}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
    return () => window.clearTimeout(t);
  }, [focusSection, tab]);

  const handleTabChange = (nextTab: TabType) => {
    setTab(nextTab);
    setFocusSection(undefined);
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', `/profile?tab=${nextTab}`);
      } catch {}
    }
  };

  async function saveTeacher() {
    setSaving(true);
    try {
      await api.patch('/api/auth/teacher', { teacherId });
      await api.patch('/api/auth/profile', { selectedTeacherId: teacherId });
      qc.invalidateQueries({ queryKey: KEYS.me });
      toast.success('Saved!', 'Your AI teacher has been updated.');
    } catch (err) {
      toast.error('Save failed', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function saveVisibility() {
    setSaving(true);
    try {
      await api.patch('/api/recruiter/visibility', { visibility });
      qc.invalidateQueries({ queryKey: KEYS.me });
      toast.success('Saved!', 'Visibility updated.');
    } catch (err) {
      toast.error('Save failed', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const effectiveUser: any = user || {
    id: 'guest',
    displayName: 'Student',
    username: '@student',
    role: 'student',
    avatar_url: null,
    subscription_tier: 'free',
  };

  const displayName = effectiveUser.displayName || effectiveUser.name || 'Student';
  const initials = (displayName.trim()[0] || 'S').toUpperCase();
  const handle = effectiveUser.username || (effectiveUser.email ? effectiveUser.email : '');
  const college = effectiveUser.institutionName || effectiveUser.collegeName || effectiveUser.onboardingAnswers?.college || '';
  const registerNumber = effectiveUser.registerNumber || '';
  const tier = String(effectiveUser.subscription_tier || 'free');

  const stats = [
    { label: 'Career', value: Number(cOS?.careerScore) || 0 },
    { label: 'DNA', value: Number(cOS?.dnaScore) || 0 },
    { label: 'Trust', value: Number(cOS?.trustScore) || 0 },
  ];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 60 }}>
      {/* Profile Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20,
        background: 'var(--card)', padding: 22, borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)', flexWrap: 'wrap', boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--teal))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 27, fontWeight: 900, color: '#ffffff', flexShrink: 0,
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>
            {displayName}
          </div>
          <div style={{ fontSize: 13, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {[handle, college, registerNumber].filter(Boolean).join(' · ')}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 100, background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>
              {effectiveUser.role}
            </span>
            <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 100, background: 'var(--bg3)', color: 'var(--t2)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>
              {tier} plan
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center', minWidth: 64, padding: '8px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {tier === 'free' && (
            <Link href="/pricing" className="btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
              ⭐ Upgrade
            </Link>
          )}
          <button
            type="button"
            data-testid="profile-header-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            className="btn-ghost btn-sm"
            style={{
              color: 'var(--coral)',
              borderColor: 'rgba(var(--danger-rgb), 0.35)',
              background: 'rgba(var(--danger-rgb), 0.08)',
              fontWeight: 700,
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease'
            }}
          >
            {loggingOut ? 'Signing out...' : '🚪 Log Out'}
          </button>
        </div>
      </div>

      {/* 4 top-level tabs */}
      <div
        role="tablist"
        aria-label="Profile sections"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 20 }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              data-testid={`profile-tab-${t.id}`}
              type="button"
              onClick={() => handleTabChange(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'var(--accent-light)' : 'var(--card)',
                boxShadow: active ? '0 0 0 3px color-mix(in srgb, var(--accent) 12%, transparent)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, color: active ? 'var(--accent)' : 'var(--t1)', fontFamily: 'var(--font-display)' }}>{t.label}</span>
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {tab === 'portfolio' && <PortfolioTab user={user} cOS={cOS} />}

      {tab === 'passport' && (
        <PassportTab user={user} cOS={cOS} initialView={(focusSection === 'dna' ? 'dna' : 'skills') as PassportView} />
      )}

      {tab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionHeading id="profile-section-analytics" title="Growth analytics" subtitle="Scores, trends and course progress" />
          <AnalyticsTab />
          <SectionHeading id="profile-section-activity" title="Activity history" subtitle="Everything you have done recently" />
          <ActivityTab user={user} />
        </div>
      )}

      {tab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionHeading id="profile-section-preferences" title="Preferences" subtitle="AI mentor, recruiter visibility, focus audio and sidebar options" />
          <PreferencesTab
            user={user}
            cOS={cOS}
            soundscapeVol={soundscapeVol}
            setSoundscapeVol={setSoundscapeVol}
            isPreviewingAudio={isPreviewingAudio}
            setIsPreviewingAudio={setIsPreviewingAudio}
            teacherId={teacherId}
            setTeacherId={setTeacherId}
            visibility={visibility}
            setVisibility={setVisibility}
            saving={saving}
            saveTeacher={saveTeacher}
            saveVisibility={saveVisibility}
          />
          <SectionHeading id="profile-section-security" title="Security" subtitle="Password, face login and account protection" />
          <SecurityTab logout={handleLogout} router={router} />
          <SectionHeading id="profile-section-general" title="Tour, microphone & session" />
          <SettingsTab
            soundscapeVol={soundscapeVol}
            setSoundscapeVol={setSoundscapeVol}
            onLogout={handleLogout}
            loggingOut={loggingOut}
          />
        </div>
      )}
    </div>
  );
}
