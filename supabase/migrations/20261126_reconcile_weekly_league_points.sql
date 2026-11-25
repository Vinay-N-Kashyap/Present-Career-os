-- Idempotent Supabase migration to guarantee weekly League Points columns,
-- canonical ledger/arena tables, and backfill drifted pre-reset user rows.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS weekly_xp INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weekly_arena_points INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS league_joined_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_league_eval TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.xp_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL DEFAULT 'XP Award',
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

CREATE INDEX IF NOT EXISTS idx_xp_ledger_user_created
  ON public.xp_ledger (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.arena_solo_matches (
  match_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deadline_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'settled')),
  passed BOOLEAN,
  settlement JSONB,
  settled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS arena_solo_matches_user_started_idx
  ON public.arena_solo_matches (user_id, started_at DESC);

ALTER TABLE public.arena_rooms
  ADD COLUMN IF NOT EXISTS elo_applied BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS host_elo_delta INTEGER,
  ADD COLUMN IF NOT EXISTS guest_elo_delta INTEGER,
  ADD COLUMN IF NOT EXISTS host_new_elo INTEGER,
  ADD COLUMN IF NOT EXISTS guest_new_elo INTEGER,
  ADD COLUMN IF NOT EXISTS host_arena_points_award INTEGER,
  ADD COLUMN IF NOT EXISTS guest_arena_points_award INTEGER;

-- 1. Heal pre-reset accounts whose weekly_xp drifted behind xp_total before any Monday reset
UPDATE public.users
SET weekly_xp = GREATEST(COALESCE(weekly_xp, 0), COALESCE(xp_total, 0)),
    updated_at = NOW()
WHERE last_league_eval IS NULL
  AND COALESCE(xp_total, 0) > COALESCE(weekly_xp, 0);

-- 2. Reconcile current-sprint XP from xp_ledger (since latest Monday 01:00 AM IST)
WITH sprint_window AS (
  SELECT ((date_trunc('week', NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '1 hour') AT TIME ZONE 'Asia/Kolkata') AS sprint_start
),
ledger_sums AS (
  SELECT l.user_id, COALESCE(SUM(GREATEST(0, l.amount)), 0)::INTEGER AS sprint_xp
  FROM public.xp_ledger l, sprint_window sw
  WHERE l.created_at >= sw.sprint_start
  GROUP BY l.user_id
)
UPDATE public.users u
SET weekly_xp = GREATEST(COALESCE(u.weekly_xp, 0), ls.sprint_xp),
    updated_at = NOW()
FROM ledger_sums ls
WHERE u.id = ls.user_id
  AND ls.sprint_xp > COALESCE(u.weekly_xp, 0);

-- 3. Reconcile current-sprint Arena Points from settled solo + PvP rooms
WITH sprint_window AS (
  SELECT ((date_trunc('week', NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '1 hour') AT TIME ZONE 'Asia/Kolkata') AS sprint_start
),
solo_sums AS (
  SELECT m.user_id, COALESCE(SUM(GREATEST(0, COALESCE((m.settlement->>'arenaPointsAwarded')::INTEGER, 0))), 0)::INTEGER AS solo_pts
  FROM public.arena_solo_matches m, sprint_window sw
  WHERE m.status = 'settled'
    AND m.settled_at >= sw.sprint_start
  GROUP BY m.user_id
),
pvp_host AS (
  SELECT r.host_id::UUID AS user_id, COALESCE(SUM(GREATEST(0, COALESCE(r.host_arena_points_award, 0))), 0)::INTEGER AS pts
  FROM public.arena_rooms r, sprint_window sw
  WHERE r.status = 'completed'
    AND r.elo_applied = TRUE
    AND r.updated_at >= sw.sprint_start
    AND r.host_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  GROUP BY r.host_id
),
pvp_guest AS (
  SELECT r.guest_id::UUID AS user_id, COALESCE(SUM(GREATEST(0, COALESCE(r.guest_arena_points_award, 0))), 0)::INTEGER AS pts
  FROM public.arena_rooms r, sprint_window sw
  WHERE r.status = 'completed'
    AND r.elo_applied = TRUE
    AND r.updated_at >= sw.sprint_start
    AND r.guest_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  GROUP BY r.guest_id
),
combined_arena AS (
  SELECT user_id, SUM(pts)::INTEGER AS total_arena_pts
  FROM (
    SELECT user_id, solo_pts AS pts FROM solo_sums
    UNION ALL
    SELECT user_id, pts FROM pvp_host
    UNION ALL
    SELECT user_id, pts FROM pvp_guest
  ) t
  GROUP BY user_id
)
UPDATE public.users u
SET weekly_arena_points = GREATEST(COALESCE(u.weekly_arena_points, 0), ca.total_arena_pts),
    updated_at = NOW()
FROM combined_arena ca
WHERE u.id = ca.user_id
  AND ca.total_arena_pts > COALESCE(u.weekly_arena_points, 0);
