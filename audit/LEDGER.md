# Work ledger — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`. Status is not stored here —
it is derived from the code, so a vertical leaves this list by being fixed.

A **vertical** is one session of work: the pages, the handler branches that
serve them, and the dead route under `src/app/api/` that specifies what the
handler should do.

**Bucket** — `A` port to the client (plain datastore CRUD) · `B` needs a trusted
server, move to `backend/` (secrets, signature verification, presigning) ·
`C` genuinely stateless.

## Remaining (39 verticals, 76 broken + 11 partial paths)

| vertical | broken | partial | ok | dead | buckets |
|---|---|---|---|---|---|
| `friends` | 7 | 0 | 0 | 0 | A:1 B:6 |
| `interview` | 3 | 4 | 1 | 0 | A:3 B:4 |
| `resume` | 3 | 3 | 3 | 1 | A:5 B:1 |
| `career-twin` | 5 | 0 | 0 | 0 | A:5 |
| `exam` | 5 | 0 | 0 | 1 | A:5 |
| `arena` | 4 | 0 | 0 | 0 | A:4 |
| `chat` | 3 | 1 | 0 | 0 | A:4 |
| `exams` | 4 | 0 | 2 | 0 | A:4 |
| `personality` | 4 | 0 | 0 | 0 | A:4 |
| `pins` | 4 | 0 | 4 | 0 | A:1 B:3 |
| `sentinel` | 3 | 0 | 0 | 0 | A:3 |
| `analytics` | 2 | 0 | 2 | 0 | A:2 |
| `auth` | 2 | 0 | 15 | 0 | A:2 |
| `avatar` | 1 | 1 | 2 | 0 | A:1 B:1 |
| `code` | 2 | 0 | 2 | 0 | B:2 |
| `notes` | 2 | 0 | 0 | 0 | A:2 |
| `quests` | 2 | 0 | 2 | 0 | B:2 |
| `attention-span` | 1 | 0 | 3 | 0 | A:1 |
| `cache` | 1 | 0 | 0 | 2 | A:1 |
| `codewars` | 1 | 0 | 0 | 0 | A:1 |
| `contact` | 1 | 0 | 0 | 0 | B:1 |
| `finance` | 1 | 0 | 4 | 0 | A:1 |
| `github` | 1 | 0 | 0 | 0 | B:1 |
| `internships` | 1 | 0 | 0 | 0 | A:1 |
| `memory` | 1 | 0 | 0 | 0 | A:1 |
| `news` | 1 | 0 | 0 | 0 | A:1 |
| `opportunities` | 0 | 1 | 4 | 0 | A:1 |
| `pathway` | 1 | 0 | 0 | 0 | B:1 |
| `payment` | 1 | 0 | 4 | 0 | A:1 |
| `quest` | 1 | 0 | 0 | 0 | A:1 |
| `study` | 1 | 0 | 1 | 0 | A:1 |
| `teacher` | 1 | 0 | 4 | 0 | A:1 |
| `time` | 1 | 0 | 0 | 0 | A:1 |
| `trust` | 1 | 0 | 2 | 0 | A:1 |
| `tts` | 1 | 0 | 0 | 0 | A:1 |
| `v1-auth` | 1 | 0 | 6 | 0 | A:1 |
| `vault` | 0 | 1 | 4 | 0 | A:1 |
| `verify` | 1 | 0 | 0 | 0 | A:1 |
| `xp` | 1 | 0 | 0 | 0 | B:1 |

`dead` = the path is only called from code that is never built, so no visitor can
reach it. Not work. 5 defective paths across the codebase are dead;
they are listed at the end of this file.

## Clean (34 verticals)

`admin` (14) · `admissions` (1) · `advisor` (4) · `attendance` (4) · `career-builder` (1) · `career-dna` (6) · `communication` (2) · `consultant` (9) · `documents` (2) · `events` (2) · `gd` (1) · `grievances` (2) · `group-discussion` (3) · `hostel` (6) · `leaderboard` (1) · `library` (4) · `llm` (1) · `maintenance` (2) · `mentor` (0) · `messages` (2) · `missions` (6) · `notifications` (3) · `parent` (5) · `placements` (1) · `portfolio` (3) · `projects` (1) · `recruiter` (15) · `research` (2) · `services` (5) · `settings` (4) · `stt` (1) · `student` (1) · `transport` (2) · `university` (5)

## Detail

### friends — 7 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/friends` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/friends/:param` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/friends/challenges` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/friends/messages` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/friends/privacy` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/friends/projects` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/friends/report` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### interview — 3 broken, 4 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/interview` | BROKEN | STUB | A | client.ts:2000 |
| `/api/interview/assist` | BROKEN | STUB | B | client.ts:2000 |
| `/api/interview/chat` | PARTIAL | STUB | B | client.ts:2000 |
| `/api/interview/evaluate` | PARTIAL | STUB | B | client.ts:2000 |
| `/api/interview/generate-problem` | BROKEN | STUB | B | client.ts:2000 |
| `/api/interview/respond` | PARTIAL | STUB | A | client.ts:2000 |
| `/api/interview/start` | PARTIAL | STUB | A | client.ts:2000 |

### resume — 3 broken, 3 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/resume` | BROKEN | STUB | A | client.ts:1284 |
| `/api/resume/:param/improve` | PARTIAL | STUB | A | client.ts:1284 |
| `/api/resume/analyze` | BROKEN | STUB | B | client.ts:1284 |
| `/api/resume/generate-from-vault` | PARTIAL | STUB | A | client.ts:1284 |
| `/api/resume/structured` | PARTIAL | STUB | A | client.ts:1284 |
| `/api/resume/suggestions` | BROKEN | STUB | A | client.ts:1284 |

### career-twin — 5 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/career-twin` | BROKEN | STUB | A | client.ts:740 |
| `/api/career-twin/readiness` | BROKEN | STUB | A | client.ts:740 |
| `/api/career-twin/results` | BROKEN | STUB | A | client.ts:736 |
| `/api/career-twin/run` | BROKEN | STUB | A | client.ts:737 |
| `/api/career-twin/simulate` | BROKEN | STUB | A | client.ts:737 |

### exam — 5 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/exam` | BROKEN | STUB | A | client.ts:2013 |
| `/api/exam/:param/questions` | BROKEN | STUB | A | client.ts:2010 |
| `/api/exam/available` | BROKEN | STUB | A | client.ts:2009 |
| `/api/exam/results` | BROKEN | STUB | A | client.ts:2012 |
| `/api/exam/sync-result` | BROKEN | STUB | A | client.ts:2011 |

### arena — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/arena/create-room` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/arena/join-room` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/arena/matchmake` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/arena/room/:param` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### chat — 3 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/chat` | PARTIAL | STUB | A | client.ts:2266 |
| `/api/chat/history` | BROKEN | STUB | A | client.ts:2266 |
| `/api/chat/history/:param` | BROKEN | STUB | A | client.ts:2265 |
| `/api/chat/session` | BROKEN | STUB | A | client.ts:2264 |

### exams — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/exams/admin-manage` | BROKEN | CAMPUS-404 | A | campusFallback.ts default: throws |
| `/api/exams/get-exam` | BROKEN | CAMPUS-404 | A | campusFallback.ts default: throws |
| `/api/exams/results` | BROKEN | CAMPUS-404 | A | campusFallback.ts default: throws |
| `/api/exams/schedule` | BROKEN | CAMPUS-404 | A | campusFallback.ts default: throws |

### personality — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/personality` | BROKEN | STUB | A | client.ts:2008 |
| `/api/personality/analyze` | BROKEN | STUB | A | client.ts:2007 |
| `/api/personality/report` | BROKEN | STUB | A | client.ts:2005 |
| `/api/personality/session` | BROKEN | STUB | A | client.ts:2006 |

### pins — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/pins/buy-ai-minutes` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/pins/claim-bonus` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/pins/claim-streak-bonus` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/pins/extend-grace` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### sentinel — 3 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/sentinel` | BROKEN | STUB | A | client.ts:2043 |
| `/api/sentinel/fingerprint` | BROKEN | STUB | A | client.ts:2016 |
| `/api/sentinel/search-similar` | BROKEN | STUB | A | client.ts:2025 |

### analytics — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/analytics/leaderboard` | BROKEN | STUB | A | client.ts:1508 |
| `/api/analytics/leaderboard/preview` | BROKEN | STUB | A | client.ts:1507 |

### auth — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/auth` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/auth/logout` | BROKEN | STUB | A | client.ts:429 |

### avatar — 1 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/avatar` | BROKEN | STUB | A | client.ts:4298 |
| `/api/avatar/chat` | PARTIAL | STUB | B | client.ts:4298 |

### code — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/code/debug-tutor` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/code/evaluate` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### notes — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/notes` | BROKEN | CAMPUS-404 | A | campusFallback.ts default: throws |
| `/api/notes/upload` | BROKEN | CAMPUS-404 | A | campusFallback.ts default: throws |

### quests — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/quests/enrollment` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/quests/roadmap/generate` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### attention-span — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/attention-span` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### cache — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/cache/clear` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### codewars — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/codewars/matches` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### contact — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/contact` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### finance — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/finance/dues` | BROKEN | CAMPUS-404 | A | campusFallback.ts default: throws |

### github — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/github/ingest` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### internships — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/internships` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### memory — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/memory` | BROKEN | STUB | A | client.ts:3640 |

### news — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/news` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### opportunities — 0 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/opportunities` | PARTIAL | STUB | A | client.ts:1377 |

### pathway — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/pathway/evidence` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### payment — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/payment/plans` | BROKEN | STUB | A | client.ts:1808 |

### quest — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/quest/complete` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### study — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/study` | BROKEN | STUB | A | client.ts:2527 |

### teacher — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/teacher/submit-marks` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### time — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/time` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### trust — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/trust` | BROKEN | STUB | A | client.ts:2004 |

### tts — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/tts` | BROKEN | STUB | A | client.ts:3641 |

### v1-auth — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/v1/auth` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### vault — 0 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/vault/items` | PARTIAL | STUB | A | client.ts:1285 |

### verify — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/verify/:param` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### xp — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/xp/add` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |


## Defects in dead code — do not fix (5)

Every call site for these lives in a file no built page imports. Fixing them
changes nothing a visitor can see. Delete the callers, or leave them.

- `/api/cache/hash` (UNHANDLED-404) — called from src/lib/voiceCache.ts
- `/api/cache/stats` (UNHANDLED-404) — called from src/lib/voiceCache.ts
- `/api/exam/scheduled` (STUB) — called from src/lib/api/hooks.ts
- `/api/mentor/chat` (UNHANDLED-404) — called from src/lib/mentor/avatarDialogue.ts
- `/api/resume/list` (STUB) — called from src/lib/api/hooks.ts

