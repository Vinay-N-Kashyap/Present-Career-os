'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '@/lib/store/useAppStore';
import { StudentProfile } from '@/components/friends/StudentCard';
import { FriendProfileDrawer } from '@/components/friends/FriendProfileDrawer';
import { ArenaChallengeModal } from '@/components/friends/ArenaChallengeModal';
import { ProjectInviteModal } from '@/components/friends/ProjectInviteModal';
import { SquadProjectsView } from '@/components/friends/SquadProjectsView';
import { FriendChatView } from '@/components/friends/FriendChatView';
import { ArenaChallengesView } from '@/components/friends/ArenaChallengesView';
import { SmartMatchModal } from '@/components/friends/SmartMatchModal';
import { PrivacySettingsModal } from '@/components/friends/PrivacySettingsModal';
import { ReportStudentModal } from '@/components/friends/ReportStudentModal';
import { computeStudentMatch, CURRENT_STUDENT_PROFILE, MatchStudentProfile, MatchBreakdown } from '@/lib/friends/matching';

type FriendsTab = 'discover' | 'network' | 'requests' | 'messages' | 'challenges' | 'projects';
const FRIENDS_TAB_ORDER: FriendsTab[] = ['discover', 'network', 'requests', 'messages', 'challenges', 'projects'];

function FriendsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<FriendsTab>('discover');
  const tabRefs = useRef<Partial<Record<FriendsTab, HTMLButtonElement | null>>>({});
  const suggestionsRequestRef = useRef(0);

  // Filter Chips
  const [activeFilter, setActiveFilter] = useState<'all' | 'college' | 'skills' | 'course' | 'nearby' | 'goals'>('all');

  // Search input state & debounced search
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // View Mode for All Students (List vs Grid)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Modals & Drawer State
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [challengeStudent, setChallengeStudent] = useState<StudentProfile | null>(null);
  const [projectStudent, setProjectStudent] = useState<StudentProfile | null>(null);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string>('CareerOS Platform');
  const [smartMatchStudent, setSmartMatchStudent] = useState<MatchStudentProfile | null>(null);
  const [smartMatchBreakdown, setSmartMatchBreakdown] = useState<MatchBreakdown | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [reportModalStudent, setReportModalStudent] = useState<StudentProfile | null>(null);

  // Real Supabase State (ZERO DUMMY DATA)
  const [suggestedStudents, setSuggestedStudents] = useState<Array<StudentProfile & { matchPct: number; matchDetails: string }>>([]);
  const [friendsNetwork, setFriendsNetwork] = useState<StudentProfile[]>([]);
  const [incomingRequestsList, setIncomingRequestsList] = useState<any[]>([]);
  const [networkStats, setNetworkStats] = useState<{ friendsCount: number; pendingCount: number }>({ friendsCount: 0, pendingCount: 0 });
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  // Chat View Active Friend
  const [activeChatFriendId, setActiveChatFriendId] = useState<string | undefined>(undefined);

  const navigateToTab = (tab: FriendsTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    if (tab !== 'messages') params.delete('friendId');
    router.replace(`/friends?${params.toString()}`, { scroll: false });
  };

  const navigateToChat = (studentId: string) => {
    setActiveChatFriendId(studentId);
    setActiveTab('messages');
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'messages');
    params.set('friendId', studentId);
    router.replace(`/friends?${params.toString()}`, { scroll: false });
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentTab: FriendsTab) => {
    const currentIndex = FRIENDS_TAB_ORDER.indexOf(currentTab);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % FRIENDS_TAB_ORDER.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + FRIENDS_TAB_ORDER.length) % FRIENDS_TAB_ORDER.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = FRIENDS_TAB_ORDER.length - 1;
    else return;

    event.preventDefault();
    const nextTab = FRIENDS_TAB_ORDER[nextIndex];
    navigateToTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  // ── Sync URL Search Parameters (e.g. ?tab=messages&friendId=...) ─────────
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && FRIENDS_TAB_ORDER.includes(tabParam as FriendsTab)) {
      setActiveTab(tabParam as FriendsTab);
    }
    const friendIdParam = searchParams.get('friendId');
    if (friendIdParam) {
      setActiveChatFriendId(friendIdParam);
    } else {
      setActiveChatFriendId(undefined);
    }
  }, [searchParams]);

  // ── Debounce Search Input ────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── 1. Fetch Real Friendships & Counts From Supabase ──────────────────────
  const fetchNetworkData = async () => {
    try {
      console.log('[FriendsHub] Fetching live friendships from Supabase API /api/friends...');
      const res = await fetch('/api/friends');
      const data = await res.json();
      console.log('[FriendsHub] /api/friends response:', data);

      if (data.ok) {
        const friends: StudentProfile[] = (data.friends || []).map((f: any) => ({
          ...f.student,
          relationship: 'friends' as const,
          friendshipId: f.friendshipId
        }));
        setFriendsNetwork(friends);

        const incoming = (data.incomingRequests || []).map((r: any) => ({
          id: r.requestId,
          studentId: r.sender?.id,
          name: r.sender?.name || 'Classmate',
          avatar: r.sender?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + r.requestId,
          college: r.sender?.college || 'College not listed',
          course: r.sender?.course || 'Course not listed',
          skills: Array.isArray(r.sender?.skills) ? r.sender.skills : []
        }));
        setIncomingRequestsList(incoming);

        setNetworkStats({
          friendsCount: data.friendsCount || 0,
          pendingCount: data.pendingCount || 0
        });

        // Initialize sent requests state
        const sentMap: Record<string, boolean> = {};
        (data.sentRequests || []).forEach((s: any) => {
          if (s.recipient?.id) {
            sentMap[s.recipient.id] = true;
          }
        });
        setSentRequests(prev => ({ ...prev, ...sentMap }));
      }
    } catch (err) {
      console.error('[FriendsHub] Error loading network data:', err);
    }
  };

  // ── 2. Fetch Live Student Suggestions & Search Results ───────────────────
  const fetchSuggestions = async () => {
    const requestId = ++suggestionsRequestRef.current;
    try {
      setIsSearching(true);
      setSuggestionsError(null);
      const url = `/api/friends/suggestions?filter=${activeFilter}${debouncedSearch ? `&q=${encodeURIComponent(debouncedSearch)}` : ''}`;
      console.log(`[FriendsHub] Fetching student suggestions from Supabase: ${url}`);
      
      const res = await fetch(url);
      const data = await res.json();
      console.log('[FriendsHub] /api/friends/suggestions response:', data);

      // Search requests can finish out of order; only let the newest query update the page.
      if (requestId !== suggestionsRequestRef.current) return;
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not load classmates.');

      if (Array.isArray(data.suggestions)) {
        setSuggestedStudents(data.suggestions);
      } else {
        setSuggestedStudents([]);
      }
    } catch (err) {
      console.error('[FriendsHub] Error fetching suggestions:', err);
      if (requestId === suggestionsRequestRef.current) {
        setSuggestedStudents([]);
        setSuggestionsError(err instanceof Error ? err.message : 'Could not load classmates.');
      }
    } finally {
      if (requestId === suggestionsRequestRef.current) {
        setIsSearching(false);
        setIsLoading(false);
      }
    }
  };

  // ── 3. Fetch Blocked Users ───────────────────────────────────────────────
  const fetchBlockedUsers = async () => {
    try {
      const res = await fetch('/api/friends/privacy');
      const data = await res.json();
      if (data.ok && Array.isArray(data.blockedUsers)) {
        setBlockedIds(data.blockedUsers.map((b: any) => b.studentId));
      }
    } catch (err) {
      console.error('[FriendsHub] Error fetching privacy list:', err);
    }
  };

  useEffect(() => {
    fetchNetworkData();
    fetchBlockedUsers();
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [activeFilter, debouncedSearch]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleAddFriend = async (targetStudentId: string, studentName: string) => {
    // Optimistic UI update
    setSentRequests(prev => ({ ...prev, [targetStudentId]: true }));

    try {
      console.log(`[FriendsHub] Sending friend request to ${studentName} (${targetStudentId})...`);
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStudentId })
      });
      const data = await res.json();
      console.log('[FriendsHub] Add friend response:', data);

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to send friend request');
      }
      if (data.status === 'accepted') {
        setSentRequests(prev => {
          const next = { ...prev };
          delete next[targetStudentId];
          return next;
        });
        toast.success('Connected!', `You and ${studentName} are now connected as friends!`);
        fetchNetworkData();
      } else {
        toast.success('Request sent', `Your classmate ${studentName} can now accept your connection.`);
      }
    } catch (err: any) {
      console.error('[FriendsHub] Error adding friend:', err);
      toast.error('Could Not Send', err.message || 'Error communicating with Supabase.');
      setSentRequests(prev => {
        const next = { ...prev };
        delete next[targetStudentId];
        return next;
      });
    }
  };

  const handleAcceptRequest = async (reqId: string, name: string) => {
    const request = incomingRequestsList.find(r => r.id === reqId);
    setIncomingRequestsList(prev => prev.filter(r => r.id !== reqId));
    setNetworkStats(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1), friendsCount: prev.friendsCount + 1 }));

    try {
      console.log(`[FriendsHub] Accepting friend request ${reqId}...`);
      const res = await fetch('/api/friends', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: reqId, action: 'accept' })
      });
      const data = await res.json();
      console.log('[FriendsHub] Accept request response:', data);
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not accept this request.');
      toast.success('Classmate connected', `You and ${name} are now connected.`);
      fetchNetworkData();
    } catch (e) {
      console.error('[FriendsHub] Error accepting friend request:', e);
      if (request) setIncomingRequestsList(prev => [request, ...prev]);
      setNetworkStats(prev => ({ ...prev, pendingCount: prev.pendingCount + 1, friendsCount: Math.max(0, prev.friendsCount - 1) }));
      toast.error('Could not accept request', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  const handleAcceptRequestByStudentId = async (studentId: string, name: string) => {
    const matchingReq = incomingRequestsList.find(r => r.studentId === studentId);
    const reqId = matchingReq ? matchingReq.id : undefined;
    setIncomingRequestsList(prev => prev.filter(r => r.studentId !== studentId));
    setNetworkStats(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1), friendsCount: prev.friendsCount + 1 }));

    try {
      const res = await fetch('/api/friends', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: reqId, studentId, action: 'accept' })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not accept this request.');
      toast.success('Classmate connected', `You and ${name} are now connected.`);
      fetchNetworkData();
    } catch (e) {
      console.error('[FriendsHub] Error accepting friend request:', e);
      if (matchingReq) setIncomingRequestsList(prev => [matchingReq, ...prev]);
      setNetworkStats(prev => ({ ...prev, pendingCount: prev.pendingCount + (matchingReq ? 1 : 0), friendsCount: Math.max(0, prev.friendsCount - 1) }));
      toast.error('Could not accept request', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  const handleDeclineRequest = async (reqId: string) => {
    const request = incomingRequestsList.find(r => r.id === reqId);
    setIncomingRequestsList(prev => prev.filter(r => r.id !== reqId));
    setNetworkStats(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1) }));

    try {
      console.log(`[FriendsHub] Declining friend request ${reqId}...`);
      const res = await fetch('/api/friends', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: reqId, action: 'decline' })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not dismiss this request.');
      toast.info('Request dismissed', 'The connection request was declined.');
    } catch (e) {
      console.error('[FriendsHub] Error declining friend request:', e);
      if (request) setIncomingRequestsList(prev => [request, ...prev]);
      setNetworkStats(prev => ({ ...prev, pendingCount: prev.pendingCount + 1 }));
      toast.error('Could not dismiss request', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  const handleNavigateToProfile = (studentId: string) => {
    console.log(`[FriendsHub] Navigating to dedicated student profile: /friends/${studentId}`);
    router.push(`/friends/${studentId}`);
  };

  const handleOpenSmartMatch = (student: StudentProfile) => {
    const candidate: MatchStudentProfile = {
      id: student.id,
      name: student.name,
      headline: student.headline,
      avatar: student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      college: student.college || 'Campus',
      course: student.course || 'Undergraduate',
      skills: student.skills || [],
      careerGoal: student.careerGoal || 'Software Engineer',
      online: student.online,
      careerScore: student.careerScore,
      xp: student.xp,
      arenaWins: student.arenaWins,
      projectsCount: student.projectsCount
    };
    const breakdown = computeStudentMatch(CURRENT_STUDENT_PROFILE, candidate);
    setSmartMatchStudent(candidate);
    setSmartMatchBreakdown(breakdown);
  };

  const handleRemoveFriend = async (studentId: string) => {
    try {
      const res = await fetch(`/api/friends?studentId=${encodeURIComponent(studentId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.ok) {
        toast.success('Connection Removed', 'Removed student from your friends network.');
        setFriendsNetwork(prev => prev.filter(f => f.id !== studentId));
        setNetworkStats(prev => ({ ...prev, friendsCount: Math.max(0, prev.friendsCount - 1) }));
        if (selectedStudent?.id === studentId) {
          setSelectedStudent(null);
        }
      } else {
        toast.error('Failed to remove', data.error || 'Could not remove connection.');
      }
    } catch {
      toast.error('Network Error', 'Failed to communicate with server.');
    }
  };

  const handleSendChallenge = async () => {
    fetchNetworkData();
  };

  const handleSendProjectInvite = async () => {
    fetchNetworkData();
  };

  // Filter out blocked users from display
  const activeSuggested = useMemo(() => {
    return suggestedStudents.filter(s => !blockedIds.includes(s.id));
  }, [suggestedStudents, blockedIds]);

  // Dynamically resolve drawer student relationship status
  const drawerStudent = useMemo(() => {
    if (!selectedStudent) return null;
    const isFriend = friendsNetwork.some(f => f.id === selectedStudent.id) || selectedStudent.relationship === 'friends';
    const isSent = Boolean(sentRequests[selectedStudent.id]) || selectedStudent.relationship === 'sent';
    return {
      ...selectedStudent,
      relationship: (isFriend ? 'friends' : isSent ? 'sent' : selectedStudent.relationship || 'none') as 'friends' | 'sent' | 'none' | 'received'
    };
  }, [selectedStudent, friendsNetwork, sentRequests]);

  return (
    <div className="friends-container">
      {/* ── Top Header / Branding ── */}
      <div className="friends-top-header">
        <div>
              <h2 className="friends-title">Learning Network</h2>
          <p className="friends-subtitle">
            Find classmates, connect around shared courses and skills, and learn together.
          </p>
        </div>

        <div className="friends-header-actions">
          <button
            className="friends-icon-btn"
            title="Privacy Settings"
            onClick={() => setShowPrivacyModal(true)}
          >
            🔒 Privacy
          </button>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="friends-main-layout">

        {/* ── LEFT / CENTER COLUMN ── */}
        <div className="friends-content-column">

          {/* Hero Banner with Custom Lettering & Graphic */}
          <div className="friends-hero-ref">
            <div className="friends-hero-text-wrap">
              <h1 className="friends-hero-title-ref">Learn<span> together</span></h1>
              <p className="friends-hero-subtitle-ref">
                Meet classmates with similar goals, practice together, and turn shared interests into projects.
              </p>
            </div>

            <div className="friends-hero-graphic-wrap">
              <div className="hero-cursive-quote">Good friends, better futures</div>
              <div className="hero-tagline-caps">
                SAME LEARNING<br />
                DIFFERENT PATHS<br />
                GREATER TOGETHER
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="friends-tabs-bar-ref" role="tablist" aria-label="Learning network" aria-orientation="horizontal">
            <button
              ref={(node) => { tabRefs.current.discover = node; }}
              id="friends-tab-discover"
              type="button"
              role="tab"
              aria-selected={activeTab === 'discover'}
              aria-controls="friends-tabpanel"
              tabIndex={activeTab === 'discover' ? 0 : -1}
              className={`friends-tab-pill ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => navigateToTab('discover')}
              onKeyDown={(event) => handleTabKeyDown(event, 'discover')}
            >
              <span aria-hidden="true">🔍</span> Find classmates
            </button>
            <button
              ref={(node) => { tabRefs.current.network = node; }}
              id="friends-tab-network"
              type="button"
              role="tab"
              aria-selected={activeTab === 'network'}
              aria-controls="friends-tabpanel"
              tabIndex={activeTab === 'network' ? 0 : -1}
              className={`friends-tab-pill ${activeTab === 'network' ? 'active' : ''}`}
              onClick={() => navigateToTab('network')}
              onKeyDown={(event) => handleTabKeyDown(event, 'network')}
            >
              <span aria-hidden="true">👥</span> My network
              {networkStats.friendsCount > 0 && (
                <span className="tab-counter-badge">{networkStats.friendsCount}</span>
              )}
            </button>
            <button
              ref={(node) => { tabRefs.current.requests = node; }}
              id="friends-tab-requests"
              type="button"
              role="tab"
              aria-selected={activeTab === 'requests'}
              aria-controls="friends-tabpanel"
              tabIndex={activeTab === 'requests' ? 0 : -1}
              aria-label={`Requests${networkStats.pendingCount > 0 ? `, ${networkStats.pendingCount} pending` : ''}`}
              className={`friends-tab-pill ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => navigateToTab('requests')}
              onKeyDown={(event) => handleTabKeyDown(event, 'requests')}
            >
              <span>👤+</span> Requests
              {networkStats.pendingCount > 0 && (
                <span className="tab-counter-badge" style={{ background: '#ef4444' }}>{networkStats.pendingCount}</span>
              )}
            </button>
            <button
              ref={(node) => { tabRefs.current.messages = node; }}
              id="friends-tab-messages"
              type="button"
              role="tab"
              aria-selected={activeTab === 'messages'}
              aria-controls="friends-tabpanel"
              tabIndex={activeTab === 'messages' ? 0 : -1}
              className={`friends-tab-pill ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => navigateToTab('messages')}
              onKeyDown={(event) => handleTabKeyDown(event, 'messages')}
            >
              <span aria-hidden="true">💬</span> Study messages
            </button>
            <button
              ref={(node) => { tabRefs.current.challenges = node; }}
              id="friends-tab-challenges"
              type="button"
              role="tab"
              aria-selected={activeTab === 'challenges'}
              aria-controls="friends-tabpanel"
              tabIndex={activeTab === 'challenges' ? 0 : -1}
              className={`friends-tab-pill ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => navigateToTab('challenges')}
              onKeyDown={(event) => handleTabKeyDown(event, 'challenges')}
            >
              <span aria-hidden="true">🏆</span> Practice challenges
            </button>
            <button
              ref={(node) => { tabRefs.current.projects = node; }}
              id="friends-tab-projects"
              type="button"
              role="tab"
              aria-selected={activeTab === 'projects'}
              aria-controls="friends-tabpanel"
              tabIndex={activeTab === 'projects' ? 0 : -1}
              className={`friends-tab-pill ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => navigateToTab('projects')}
              onKeyDown={(event) => handleTabKeyDown(event, 'projects')}
            >
              <span aria-hidden="true">👥</span> Team projects
            </button>
          </div>

          <div id="friends-tabpanel" role="tabpanel" aria-labelledby={`friends-tab-${activeTab}`} tabIndex={0} className="friends-tabpanel">
          {/* ── TAB 1: DISCOVER ── */}
          {activeTab === 'discover' && (
            <>
              {/* Live Search Bar */}
              <div className="friends-live-search-box">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 16, color: '#64748b', pointerEvents: 'none', zIndex: 2 }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="friends-live-search-input"
                  aria-label="Search classmates by name, college, course, or skill"
                  placeholder="Search classmates by name, course, college, or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="friends-live-search-clear"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    title="Clear search"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
                {isSearching && (
                  <div style={{ position: 'absolute', right: searchQuery ? 46 : 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(99, 102, 241, 0.25)', borderTopColor: '#818cf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: 12.5, color: '#818cf8', fontWeight: 600 }}>Searching...</span>
                  </div>
                )}
              </div>

              {/* Filter Chips Row */}
              <div className="friends-filters-row">
                <div className="filter-chips-left">
                  <button
                    type="button"
                    className={`ref-filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
                    aria-pressed={activeFilter === 'all'}
                    onClick={() => setActiveFilter('all')}
                  >
                    All Students
                  </button>
                  <button
                    type="button"
                    className={`ref-filter-chip ${activeFilter === 'college' ? 'active' : ''}`}
                    aria-pressed={activeFilter === 'college'}
                    onClick={() => setActiveFilter('college')}
                  >
                    Same College
                  </button>
                  <button
                    type="button"
                    className={`ref-filter-chip ${activeFilter === 'skills' ? 'active' : ''}`}
                    aria-pressed={activeFilter === 'skills'}
                    onClick={() => setActiveFilter('skills')}
                  >
                    Same Skills
                  </button>
                  <button
                    type="button"
                    className={`ref-filter-chip ${activeFilter === 'course' ? 'active' : ''}`}
                    aria-pressed={activeFilter === 'course'}
                    onClick={() => setActiveFilter('course')}
                  >
                    Course or track
                  </button>
                  <button
                    type="button"
                    className={`ref-filter-chip ${activeFilter === 'goals' ? 'active' : ''}`}
                    aria-pressed={activeFilter === 'goals'}
                    onClick={() => setActiveFilter('goals')}
                  >
                    Similar Goals
                  </button>
                </div>
              </div>

              {/* Suggested For You Section */}
              <div style={{ marginTop: 16 }}>
                <div className="section-header-row">
                  <div>
                    <h2 className="section-heading-title">
                      {searchQuery ? `Classmate matches (${activeSuggested.length})` : 'Classmates to learn with'}
                    </h2>
                    <div className="section-heading-sub">
                      {searchQuery
                        ? `Classmates whose profiles match "${searchQuery}"`
                        : 'Suggested using shared courses, skills, and learning goals'}
                    </div>
                  </div>
                  {activeSuggested.length > 0 && (
                    <button
                      type="button"
                      className="see-all-link"
                      onClick={() => handleOpenSmartMatch(activeSuggested[0])}
                    >
                      AI Match Breakdown →
                    </button>
                  )}
                </div>

                {isLoading ? (
                    <div role="status" aria-live="polite" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: 31, marginBottom: 10 }}>⚡</div>
                      <div>Finding classmates…</div>
                  </div>
                ) : suggestionsError ? (
                  <div className="friends-empty-state-card" role="alert">
                    <span className="empty-state-icon">⚠️</span>
                    <h3 className="empty-state-title">Classmates could not be loaded</h3>
                    <p className="empty-state-desc">{suggestionsError}</p>
                    <button type="button" className="friends-btn friends-btn-primary" onClick={fetchSuggestions}>
                      Try again
                    </button>
                  </div>
                ) : activeSuggested.length === 0 ? (
                  <div className="friends-empty-state-card">
                    <span className="empty-state-icon">🔍</span>
                    <h3 className="empty-state-title">No classmates found</h3>
                    <p className="empty-state-desc">
                      {searchQuery
                        ? `We couldn't find classmates matching "${searchQuery}". Try another course or skill, or clear the search.`
                        : 'No classmates match this filter right now. Try selecting "All Students" to see the full campus directory.'}
                    </p>
                    {searchQuery && (
                      <button
                        className="friends-btn friends-btn-primary"
                        style={{ marginTop: 8 }}
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="suggested-cards-grid" style={{ marginTop: 14 }}>
                    {activeSuggested.slice(0, 6).map((peer) => (
                      <div key={peer.id} className="suggested-peer-card">
                        <div className="suggested-card-top">
                          <button
                            type="button"
                            aria-label={`View ${peer.name}'s profile`}
                            className="suggested-avatar-box"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(peer.id)}
                            title={`View ${peer.name}'s Profile`}
                          >
                            <img src={peer.avatar} alt={peer.name} />
                            {peer.online && <span className="online-beacon" />}
                          </button>
                          <button
                            type="button"
                            aria-label={`${peer.matchPct}% learning match with ${peer.name}; view why`}
                            className="match-percentage-badge"
                            style={{ cursor: 'pointer' }}
                            title="Click for AI Affinity Breakdown"
                            onClick={() => handleOpenSmartMatch(peer)}
                          >
                            <span className="match-percentage-val">{peer.matchPct}%</span>
                            <span className="match-percentage-label">Match</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          className="suggested-peer-name"
                          title={peer.name}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleNavigateToProfile(peer.id)}
                        >
                          {peer.name}
                        </button>
                        <div className="suggested-peer-degree">{peer.course} • {peer.college}</div>

                        <div className="suggested-skills-pills">
                          {peer.skills.map((s, i) => (
                            <span key={i} className="mini-skill-pill">{s}</span>
                          ))}
                        </div>

                        <div className="suggested-match-reason">
                          <span>{peer.matchDetails || '⚡ High skill synergy'}</span>
                        </div>

                        <div className="suggested-card-btn-row">
                          <button
                            className="friends-btn friends-btn-secondary"
                            onClick={() => setSelectedStudent(peer)}
                            style={{ padding: '7px 12px', fontSize: 13 }}
                          >
                            View Profile
                          </button>
                          {sentRequests[peer.id] ? (
                            <button
                              className="friends-btn friends-btn-pending"
                              style={{ padding: '7px 12px', fontSize: 13 }}
                              disabled
                            >
                              ✓ Sent
                            </button>
                          ) : (
                            <button
                              className="friends-btn friends-btn-primary"
                              onClick={() => handleAddFriend(peer.id, peer.name)}
                              style={{ padding: '7px 12px', fontSize: 13 }}
                            >
                              + Connect
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── "All Students" Section (List vs Grid Mode) ── */}
              {activeSuggested.length > 6 && (
                <div className="all-students-section">
                  <div className="all-students-controls-row">
                  <h2 className="section-heading-title">More classmates ({activeSuggested.length})</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="view-mode-toggle-group">
                        <button
                          className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                          onClick={() => setViewMode('grid')}
                          title="Grid View"
                        >
                          ⊞
                        </button>
                        <button
                          className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                          onClick={() => setViewMode('list')}
                          title="List View"
                        >
                          ☰
                        </button>
                      </div>
                    </div>
                  </div>

                  {viewMode === 'list' ? (
                    <div className="students-list-view-container">
                      {activeSuggested.slice(6).map((student) => (
                        <div key={student.id} className="student-list-item-row">
                          <button
                            type="button"
                            className="student-list-identity"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(student.id)}
                          >
                            <div className="student-list-avatar">
                              <img src={student.avatar} alt={student.name} />
                              {student.online && <span className="online-beacon" />}
                            </div>
                            <div>
                              <div className="student-list-name">{student.name}</div>
                              <div className="student-list-college">{student.course} • {student.college}</div>
                            </div>
                          </button>

                          <div className="student-list-skills">
                            {student.skills.map((sk, idx) => (
                              <span key={idx} className="mini-skill-pill">{sk}</span>
                            ))}
                          </div>

                          <div className="student-list-actions">
                            <button
                              className="friends-btn friends-btn-secondary"
                              onClick={() => setSelectedStudent(student)}
                            >
                              View Profile
                            </button>
                            {sentRequests[student.id] ? (
                              <button className="friends-btn friends-btn-pending" disabled>
                                ✓ Sent
                              </button>
                            ) : (
                              <button
                                className="friends-btn friends-btn-primary"
                                onClick={() => handleAddFriend(student.id, student.name)}
                              >
                                + Connect
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="suggested-cards-grid" style={{ marginTop: 14 }}>
                      {activeSuggested.slice(6).map((student) => (
                        <div key={student.id} className="suggested-peer-card">
                          <div className="suggested-card-top">
                            <button
                              type="button"
                              aria-label={`View ${student.name}'s profile`}
                              className="suggested-avatar-box"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleNavigateToProfile(student.id)}
                            >
                              <img src={student.avatar} alt={student.name} />
                              {student.online && <span className="online-beacon" />}
                            </button>
                            <div className="match-percentage-badge">
                              <span className="match-percentage-val">{student.matchPct}%</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="suggested-peer-name"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(student.id)}
                          >
                            {student.name}
                          </button>
                          <div className="suggested-peer-degree">{student.course} • {student.college}</div>
                          <div className="suggested-skills-pills">
                            {student.skills.map((s, i) => (
                              <span key={i} className="mini-skill-pill">{s}</span>
                            ))}
                          </div>
                          <div className="suggested-card-btn-row">
                            <button
                              className="friends-btn friends-btn-secondary"
                              onClick={() => setSelectedStudent(student)}
                              style={{ padding: '7px 12px', fontSize: 13 }}
                            >
                              View Profile
                            </button>
                            {sentRequests[student.id] ? (
                              <button className="friends-btn friends-btn-pending" disabled style={{ padding: '7px 12px', fontSize: 13 }}>
                                ✓ Sent
                              </button>
                            ) : (
                              <button
                                className="friends-btn friends-btn-primary"
                                onClick={() => handleAddFriend(student.id, student.name)}
                                style={{ padding: '7px 12px', fontSize: 13 }}
                              >
                                + Connect
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── TAB 2: MY FRIENDS ── */}
          {activeTab === 'network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    My learning network ({friendsNetwork.length})
                  </h2>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
                    Find study partners, practice new skills, and build team projects together.
                  </p>
                </div>
                <button className="friends-btn friends-btn-primary" onClick={() => navigateToTab('discover')}>
                  + Discover Peers
                </button>
              </div>

              {friendsNetwork.length === 0 ? (
                <div className="friends-empty-state-card">
                  <span className="empty-state-icon">👥</span>
                  <h3 className="empty-state-title">Your learning network starts here</h3>
                  <p className="empty-state-desc">
                    Find classmates in your course or with shared skills, then connect to study, practice, and build together.
                  </p>
                  <button
                    className="friends-btn friends-btn-primary"
                    style={{ marginTop: 12 }}
                    onClick={() => navigateToTab('discover')}
                  >
                    Browse Students
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {friendsNetwork.map((friend) => (
                    <div key={friend.id} style={{ padding: 16, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{ position: 'relative', width: 44, height: 44, flexShrink: 0, cursor: 'pointer' }}
                          onClick={() => handleNavigateToProfile(friend.id)}
                        >
                          <img src={friend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={friend.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          {friend.online && <span className="online-beacon" />}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{ fontSize: 15.5, fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(friend.id)}
                          >
                            {friend.name}
                          </div>
                          <div style={{ fontSize: 12.5, color: '#94a3b8' }}>{friend.course} • {friend.college}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {friend.skills.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="mini-skill-pill">{sk}</span>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 4 }}>
                        <button
                          className="friends-btn friends-btn-secondary"
                          style={{ fontSize: 12.5, padding: '7px' }}
                          onClick={() => navigateToChat(friend.id)}
                        >
                          💬 Study chat
                        </button>
                        <button
                          className="friends-btn friends-btn-secondary"
                          style={{ fontSize: 12.5, padding: '7px' }}
                          onClick={() => setChallengeStudent(friend)}
                        >
                          🧩 Practice
                        </button>
                        <button
                          className="friends-btn friends-btn-secondary"
                          style={{ fontSize: 12.5, padding: '7px' }}
                          onClick={() => setProjectStudent(friend)}
                        >
                          👥 Project
                        </button>
                        <button
                          className="friends-btn friends-btn-secondary"
                          style={{ fontSize: 12.5, padding: '7px' }}
                          onClick={() => setSelectedStudent(friend)}
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: REQUESTS ── */}
          {activeTab === 'requests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 17.5, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>
                  Classmate connection requests ({incomingRequestsList.length})
                </h3>
                {incomingRequestsList.length === 0 ? (
                  <div className="friends-empty-state-card">
                    <span className="empty-state-icon">📫</span>
                    <h3 className="empty-state-title">No Pending Requests</h3>
                    <p className="empty-state-desc">
                      You are all caught up! When classmates send you connection requests, they will appear here.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
                    {incomingRequestsList.map((req) => (
                      <div key={req.id} style={{ padding: 16, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={req.avatar}
                            alt={req.name}
                            style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer' }}
                            onClick={() => handleNavigateToProfile(req.studentId)}
                          />
                          <div>
                            <div
                              style={{ fontSize: 15.5, fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                              onClick={() => handleNavigateToProfile(req.studentId)}
                            >
                              {req.name}
                            </div>
                            <div style={{ fontSize: 12.5, color: '#94a3b8' }}>{req.course} • {req.college}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          {req.skills.map((s: string, i: number) => (
                            <span key={i} className="mini-skill-pill">{s}</span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="friends-btn friends-btn-primary"
                            style={{ flex: 1, fontSize: 13, padding: '8px' }}
                            onClick={() => handleAcceptRequest(req.id, req.name)}
                          >
                            ✓ Accept
                          </button>
                          <button
                            className="friends-btn friends-btn-secondary"
                            style={{ flex: 1, fontSize: 13, padding: '8px' }}
                            onClick={() => handleDeclineRequest(req.id)}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 4: MESSAGES ── */}
          {activeTab === 'messages' && (
            <FriendChatView
              initialFriendId={activeChatFriendId}
              friends={friendsNetwork || []}
              onOpenProfile={(s) => handleNavigateToProfile(s.id)}
              onOpenChallenge={(s) => setChallengeStudent(s)}
              onOpenProjectInvite={(s) => setProjectStudent(s)}
            />
          )}

          {/* ── TAB 5: CHALLENGES ── */}
          {activeTab === 'challenges' && (
            <ArenaChallengesView
              onOpenChallengeModal={(s) => setChallengeStudent(s || (suggestedStudents[0] || null))}
            />
          )}

          {/* ── TAB 6: GROUP PROJECTS ── */}
          {activeTab === 'projects' && (
            <SquadProjectsView
              onOpenInviteModal={(projTitle) => {
                setSelectedProjectTitle(projTitle || 'CareerOS Platform');
                setProjectStudent(suggestedStudents[0] || null);
              }}
            />
          )}

          </div>
        </div>

        {/* ── RIGHT COLUMN: NETWORK SUMMARY & QUICK ACTIONS ── */}
        <div className="friends-sidebar-column">

          {/* 1. "Your Network" Card (LIVE DYNAMIC COUNTS) */}
          <div className="ref-sidebar-card">
            <div className="ref-sidebar-header">
              <span>Learning network</span>
              <button
                type="button"
                className="friends-side-link"
                style={{ fontSize: 14.5, color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => navigateToTab('network')}
              >
                View all ›
              </button>
            </div>

            <div className="network-stats-row">
              <button
                type="button"
                className="network-stat-box"
                onClick={() => navigateToTab('network')}
              >
                <span className="network-stat-icon" style={{ color: '#818cf8' }}>👥</span>
                <div>
                  <div className="network-stat-num">{networkStats.friendsCount}</div>
                  <div className="network-stat-text">Friends</div>
                </div>
              </button>

              <button
                type="button"
                className="network-stat-box"
                onClick={() => navigateToTab('requests')}
              >
                <span className="network-stat-icon" style={{ color: '#f87171' }}>🚀</span>
                <div>
                  <div className="network-stat-num">{networkStats.pendingCount}</div>
                  <div className="network-stat-text">Requests</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. "Connected Peers" / Messages Preview */}
          <div className="ref-sidebar-card">
            <div className="ref-sidebar-header">
              <span>Study partners</span>
              <button type="button" className="see-all-link" style={{ fontSize: 12.5 }} onClick={() => navigateToTab('messages')}>
                Open chat →
              </button>
            </div>

            {friendsNetwork.length === 0 ? (
              <div style={{ padding: '16px 8px', textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
                No classmates connected yet.<br />
                Find a learning partner to start a study conversation.
              </div>
            ) : (
              <div className="recent-messages-list">
                {friendsNetwork.slice(0, 4).map((friend) => (
                  <button
                    key={friend.id}
                    type="button"
                    className="recent-msg-item"
                    aria-label={`Open study messages with ${friend.name}`}
                    onClick={() => {
                      navigateToChat(friend.id);
                    }}
                  >
                    <div className="recent-msg-avatar-wrap">
                      <img src={friend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={friend.name} />
                      {friend.online && <span className="online-beacon" />}
                    </div>
                    <div className="recent-msg-meta">
                      <div className="recent-msg-author">{friend.name}</div>
                      <div className="recent-msg-snippet">{friend.course} • {friend.college}</div>
                    </div>
                    <span className="recent-msg-time">Message</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. "Quick Actions" 2x2 Grid */}
          <div className="ref-sidebar-card">
            <div className="ref-sidebar-header">
              <span>Quick Actions</span>
            </div>

            <div className="quick-actions-grid">
              <button
                type="button"
                className="quick-action-tile purple"
                onClick={() => navigateToTab('challenges')}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">🏆</span>
                  <span className="tile-label">Practice<br />challenges</span>
                </div>
                <span className="tile-arrow">›</span>
              </button>

              <button
                type="button"
                className="quick-action-tile green"
                onClick={() => navigateToTab('projects')}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">👥</span>
                  <span className="tile-label">Team<br />projects</span>
                </div>
                <span className="tile-arrow">›</span>
              </button>

              <button
                type="button"
                className="quick-action-tile blue"
                onClick={() => {
                  navigateToTab('discover');
                  requestAnimationFrame(() => searchInputRef.current?.focus());
                }}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">👤+</span>
                  <span className="tile-label">Find<br />classmates</span>
                </div>
                <span className="tile-arrow">›</span>
              </button>

              <button
                type="button"
                className="quick-action-tile amber"
                onClick={() => navigateToTab('network')}
              >
                <div className="tile-icon-title">
                  <span className="tile-icon">👥</span>
                  <span className="tile-label">My learning<br />network</span>
                </div>
                <span className="tile-arrow">›</span>
              </button>
            </div>
          </div>

          {/* 4. Inspiration Ribbon Card */}
          <div className="inspiration-ribbon-card">
            <h4>Great ideas start with great people.</h4>
            <div className="inspiration-tagline">
              CONNECT • COLLABORATE • CREATE • GROW
            </div>
          </div>

        </div>

      </div>

      {/* ── Slide-over Profile Drawer ── */}
      <FriendProfileDrawer
        student={drawerStudent}
        onClose={() => setSelectedStudent(null)}
        onAcceptRequest={(id) => handleAcceptRequestByStudentId(id, selectedStudent?.name || 'Student')}
        onSendRequest={(id) => handleAddFriend(id, selectedStudent?.name || 'Student')}
        onRemoveFriend={handleRemoveFriend}
        onOpenChallenge={(s) => {
          setSelectedStudent(null);
          setChallengeStudent(s);
        }}
        onOpenMessage={(s) => {
          setSelectedStudent(null);
          navigateToChat(s.id);
        }}
        onOpenProjectInvite={(s) => {
          setSelectedStudent(null);
          setProjectStudent(s);
        }}
      />

      {/* ── Arena Challenge Modal ── */}
      <ArenaChallengeModal
        student={challengeStudent}
        onClose={() => setChallengeStudent(null)}
        onSendChallenge={handleSendChallenge}
      />

      {/* ── Smart Match Breakdown Modal ── */}
      <SmartMatchModal
        student={smartMatchStudent}
        match={smartMatchBreakdown}
        onClose={() => { setSmartMatchStudent(null); setSmartMatchBreakdown(null); }}
        onAddFriend={(id, name) => handleAddFriend(id, name)}
        onOpenChallenge={(s) => {
          setSmartMatchStudent(null);
          setSmartMatchBreakdown(null);
          setChallengeStudent(suggestedStudents.find(p => p.id === s.id) || null);
        }}
        onOpenProjectInvite={(s) => {
          setSmartMatchStudent(null);
          setSmartMatchBreakdown(null);
          setProjectStudent(suggestedStudents.find(p => p.id === s.id) || null);
        }}
      />

      {/* ── Project Invite Modal ── */}
      <ProjectInviteModal
        student={projectStudent}
        onClose={() => setProjectStudent(null)}
        onSendInvite={handleSendProjectInvite}
      />

      {/* ── Privacy Settings Modal ── */}
      {showPrivacyModal && (
        <PrivacySettingsModal
          onClose={() => {
            setShowPrivacyModal(false);
            fetchBlockedUsers();
          }}
        />
      )}

      {/* ── Report Student Modal ── */}
      <ReportStudentModal
        student={reportModalStudent}
        onClose={() => setReportModalStudent(null)}
      />
    </div>
  );
}

export default function FriendsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 24px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: 35, marginBottom: 12 }}>⚡</div>
          <div style={{ fontSize: 17.5, fontWeight: 700, color: '#f8fafc' }}>Loading Campus Network...</div>
        </div>
      }
    >
      <FriendsContent />
    </Suspense>
  );
}
