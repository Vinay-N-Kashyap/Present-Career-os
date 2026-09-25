# Contract map — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`

- **generated**: 2026-09-25T11:53:19.571Z
- **appCodeFiles**: 607
- **verticals**: 73
- **verticalsWithDefects**: 39
- **clientCalledPaths**: 278
- **reachablePaths**: 273
- **brokenOnEveryMethod**: 76
- **brokenOnSomeMethods**: 11
- **defectsInDeadCode**: 5
- **unbuiltPages**: 0
- **reachableSourceFiles**: 574
- **guardBranches**: 185
- **unreachableOrDynamicGuards**: 46
- **campusSwitchCases**: 102
- **campusPrefixes**: 19
- **deadRouteFiles**: 217
- **interceptorBypasses**: []
- **preferLivePrefixes**: 71
- **needsManualCheck**: 0
- **byWorst**: {"REAL":176,"STUB":48,"UNHANDLED-404":37,"CAMPUS-404":7,"COMPUTE":1,"DECLINED":4,"LOCAL-STORE":5}
- **byBucket**: {"OK":176,"A":77,"B":24,"C":1}
- **byLayer**: {"firestoreRouter":191,"campusFallback":50,"none":37}
- **guardsByVerdict**: {"REAL":142,"LOCAL-STORE":5,"STUB":38}

**Verdict** — `REAL` reaches a datastore · `STUB` returns a literal · `THROWS` raises ApiError
· `EXTERNAL` calls out over the network · `COMPUTE` local computation only
· `UNHANDLED-404` no guard matches · `CAMPUS-404` campus switch has no case, default throws
· `BYPASSES-SHIM` interceptor exempts it, so the Firebase `**` rewrite answers with index.html.

**Bucket** — `A` port to client · `B` needs a trusted server · `C` genuinely stateless · `OK` already real.

## Broken no matter how they are called (76)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/analytics/leaderboard` | STUB | A | firestoreRouter | client.ts:1508 | — | 0/1 |
| `/api/analytics/leaderboard/preview` | STUB | A | firestoreRouter | client.ts:1507 | — | 0/1 |
| `/api/arena/create-room` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/create-room/route.ts | 1/2 |
| `/api/arena/join-room` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/join-room/route.ts | 1/2 |
| `/api/arena/matchmake` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/matchmake/route.ts | 1/2 |
| `/api/arena/room/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 5/5 |
| `/api/attention-span` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/auth` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/auth/logout` | STUB | A | firestoreRouter | client.ts:429 | — | 0/1 |
| `/api/avatar` | STUB | A | firestoreRouter | client.ts:4298 | — | 0/1 |
| `/api/cache/clear` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/2 |
| `/api/career-twin` | STUB | A | firestoreRouter | client.ts:740 | — | 0/1 |
| `/api/career-twin/readiness` | STUB | A | firestoreRouter | client.ts:740 | /api/career-twin/readiness/route.ts | 1/1 |
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:736 | /api/career-twin/results/route.ts | 0/4 |
| `/api/career-twin/run` | STUB | A | firestoreRouter | client.ts:737 | — | 1/3 |
| `/api/career-twin/simulate` | STUB | A | firestoreRouter | client.ts:737 | — | 0/1 |
| `/api/chat/history` | STUB | A | firestoreRouter | client.ts:2266 | — | 0/1 |
| `/api/chat/history/:param` | STUB | A | firestoreRouter | client.ts:2265 | — | 1/2 |
| `/api/chat/session` | STUB | A | firestoreRouter | client.ts:2264 | — | 1/3 |
| `/api/code/debug-tutor` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/debug-tutor/route.ts | 1/2 |
| `/api/code/evaluate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/evaluate/route.ts | 1/2 |
| `/api/codewars/matches` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/codewars/matches/route.ts | 2/4 |
| `/api/contact` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/contact/route.ts | 2/4 |
| `/api/exam` | STUB | A | firestoreRouter | client.ts:2013 | — | 0/2 |
| `/api/exam/:param/questions` | STUB | A | firestoreRouter | client.ts:2010 | — | 0/1 |
| `/api/exam/available` | STUB | A | firestoreRouter | client.ts:2009 | — | 0/2 |
| `/api/exam/results` | STUB | A | firestoreRouter | client.ts:2012 | — | 0/3 |
| `/api/exam/sync-result` | STUB | A | firestoreRouter | client.ts:2011 | /api/exam/sync-result/route.ts | 1/3 |
| `/api/exams/admin-manage` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | /api/exams/admin-manage/route.ts | 3/5 |
| `/api/exams/get-exam` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | /api/exams/get-exam/route.ts | 1/1 |
| `/api/exams/results` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 0/1 |
| `/api/exams/schedule` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 0/1 |
| `/api/finance/dues` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 0/1 |
| `/api/friends` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/route.ts | 6/11 |
| `/api/friends/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/friends/challenges` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/challenges/route.ts | 4/8 |
| `/api/friends/messages` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/messages/route.ts | 3/5 |
| `/api/friends/privacy` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/privacy/route.ts | 5/10 |
| `/api/friends/projects` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/projects/route.ts | 3/6 |
| `/api/friends/report` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/report/route.ts | 1/2 |
| `/api/github/ingest` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/github/ingest/route.ts | 2/4 |
| `/api/internships` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/internships/route.ts | 2/4 |
| `/api/interview` | STUB | A | firestoreRouter | client.ts:2000 | — | 0/1 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:2000 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:2000 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/memory` | STUB | A | firestoreRouter | client.ts:3640 | — | 0/1 |
| `/api/news` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/notes` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notes/upload` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/pathway/evidence` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pathway/evidence/route.ts | 1/2 |
| `/api/payment/plans` | STUB | A | firestoreRouter | client.ts:1808 | — | 0/3 |
| `/api/personality` | STUB | A | firestoreRouter | client.ts:2008 | — | 0/1 |
| `/api/personality/analyze` | STUB | A | firestoreRouter | client.ts:2007 | — | 0/2 |
| `/api/personality/report` | STUB | A | firestoreRouter | client.ts:2005 | — | 0/3 |
| `/api/personality/session` | STUB | A | firestoreRouter | client.ts:2006 | — | 0/2 |
| `/api/pins/buy-ai-minutes` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/buy-ai-minutes/route.ts | 1/2 |
| `/api/pins/claim-bonus` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/pins/claim-bonus/route.ts | 0/1 |
| `/api/pins/claim-streak-bonus` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/claim-streak-bonus/route.ts | 1/2 |
| `/api/pins/extend-grace` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/extend-grace/route.ts | 1/2 |
| `/api/quest/complete` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/quest/complete/route.ts | 3/6 |
| `/api/quests/enrollment` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/quests/enrollment/route.ts | 5/10 |
| `/api/quests/roadmap/generate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/quests/roadmap/generate/route.ts | 1/2 |
| `/api/resume` | STUB | A | firestoreRouter | client.ts:1284 | — | 0/1 |
| `/api/resume/analyze` | STUB | B | firestoreRouter | client.ts:1284 | /api/resume/analyze/route.ts | 0/1 |
| `/api/resume/suggestions` | STUB | A | firestoreRouter | client.ts:1284 | — | 0/1 |
| `/api/sentinel` | STUB | A | firestoreRouter | client.ts:2043 | — | 0/1 |
| `/api/sentinel/fingerprint` | STUB | A | firestoreRouter | client.ts:2016 | — | 0/1 |
| `/api/sentinel/search-similar` | STUB | A | firestoreRouter | client.ts:2025 | — | 0/1 |
| `/api/study` | STUB | A | firestoreRouter | client.ts:2527 | — | 0/1 |
| `/api/teacher/submit-marks` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/teacher/submit-marks/route.ts | 1/2 |
| `/api/time` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/time/route.ts | 1/2 |
| `/api/trust` | STUB | A | firestoreRouter | client.ts:2004 | — | 0/1 |
| `/api/tts` | STUB | A | firestoreRouter | client.ts:3641 | /api/tts/route.ts | 3/7 |
| `/api/v1/auth` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/verify/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/xp/add` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/xp/add/route.ts | 1/2 |

## Broken only on some methods (11)

These resolve to a working handler for at least one HTTP method. Confirm which
method the call site actually uses before treating one as a defect.

- `/api/avatar/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/evaluate` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/respond` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/start` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/opportunities` — broken on POST, PUT, PATCH, DELETE; works on GET
- `/api/resume/:param/improve` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/resume/generate-from-vault` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/resume/structured` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/vault/items` — broken on POST, PUT, PATCH, DELETE; works on GET

## All paths (278)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/admin` | REAL | OK | firestoreRouter | client.ts:3283 | — | 0/2 |
| `/api/admin/audit-log` | REAL | OK | firestoreRouter | client.ts:3283 | /api/admin/audit-log/route.ts | 0/3 |
| `/api/admin/audit-log/add` | REAL | OK | firestoreRouter | client.ts:3283 | — | 0/1 |
| `/api/admin/audit-log/list` | REAL | OK | firestoreRouter | client.ts:3283 | — | 0/1 |
| `/api/admin/broadcast` | REAL | OK | firestoreRouter | client.ts:3283 | /api/admin/broadcast/route.ts | 1/3 |
| `/api/admin/dashboard` | REAL | OK | firestoreRouter | client.ts:3283 | /api/admin/dashboard/route.ts | 0/1 |
| `/api/admin/fraud-alerts` | REAL | OK | firestoreRouter | client.ts:3283 | /api/admin/fraud-alerts/route.ts | 0/1 |
| `/api/admin/metrics-summary` | REAL | OK | firestoreRouter | client.ts:3283 | /api/admin/metrics-summary/route.ts | 0/2 |
| `/api/admin/platform-stats` | REAL | OK | firestoreRouter | client.ts:3283 | /api/admin/platform-stats/route.ts | 0/1 |
| `/api/admin/users` | REAL | OK | firestoreRouter | client.ts:3283 | /api/admin/users/route.ts | 1/13 |
| `/api/admin/users/:param` | REAL | OK | firestoreRouter | client.ts:3283 | — | 1/2 |
| `/api/admin/users/:param/role` | REAL | OK | firestoreRouter | client.ts:3283 | — | 2/4 |
| `/api/admin/users/:param/score-override` | REAL | OK | firestoreRouter | client.ts:3283 | — | 1/2 |
| `/api/admin/users/:param/suspend` | REAL | OK | firestoreRouter | client.ts:3283 | — | 1/2 |
| `/api/admissions/apply` | REAL | OK | campusFallback | campusFallback.ts:158 | /api/admissions/apply/route.ts | 1/3 |
| `/api/advisor/admin/alert` | REAL | OK | campusFallback | campusFallback.ts:248 | /api/advisor/admin/alert/route.ts | 1/2 |
| `/api/advisor/admin/risks` | REAL | OK | campusFallback | campusFallback.ts:246 | /api/advisor/admin/risks/route.ts | 0/1 |
| `/api/advisor/performance` | REAL | OK | campusFallback | campusFallback.ts:242 | /api/advisor/performance/route.ts | 0/1 |
| `/api/advisor/quest/complete` | REAL | OK | campusFallback | campusFallback.ts:244 | /api/advisor/quest/complete/route.ts | 0/1 |
| `/api/analytics` | REAL | OK | firestoreRouter | client.ts:1509 | — | 0/1 |
| `/api/analytics/dashboard` | REAL | OK | firestoreRouter | client.ts:1506 | — | 0/4 |
| `/api/analytics/leaderboard` | STUB | A | firestoreRouter | client.ts:1508 | — | 0/1 |
| `/api/analytics/leaderboard/preview` | STUB | A | firestoreRouter | client.ts:1507 | — | 0/1 |
| `/api/arena/create-room` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/create-room/route.ts | 1/2 |
| `/api/arena/join-room` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/join-room/route.ts | 1/2 |
| `/api/arena/matchmake` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/matchmake/route.ts | 1/2 |
| `/api/arena/room/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 5/5 |
| `/api/attendance` | REAL | OK | firestoreRouter | client.ts:4358 | — | 0/1 |
| `/api/attendance/identify` | REAL | OK | firestoreRouter | client.ts:4355 | — | 0/2 |
| `/api/attendance/logs` | REAL | OK | firestoreRouter | client.ts:4328 | — | 0/1 |
| `/api/attendance/report` | REAL | OK | firestoreRouter | client.ts:4348 | — | 0/1 |
| `/api/attention-span` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/attention-span/analytics` | REAL | OK | firestoreRouter | client.ts:2861 | /api/attention-span/analytics/route.ts | 2/5 |
| `/api/attention-span/leaderboard` | REAL | OK | firestoreRouter | client.ts:2861 | /api/attention-span/leaderboard/route.ts | 1/3 |
| `/api/attention-span/progress` | REAL | OK | firestoreRouter | client.ts:2861 | /api/attention-span/progress/route.ts | 2/4 |
| `/api/auth` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/auth/demo` | REAL | OK | firestoreRouter | client.ts:560 | /api/auth/demo/route.ts | 1/2 |
| `/api/auth/face/challenge` | REAL | OK | firestoreRouter | client.ts:550 | /api/auth/face/challenge/route.ts | 0/3 |
| `/api/auth/face/enroll` | REAL | OK | firestoreRouter | client.ts:546 | /api/auth/face/enroll/route.ts | 2/5 |
| `/api/auth/face/enrolled` | REAL | OK | firestoreRouter | client.ts:542 | — | 1/3 |
| `/api/auth/face/nonce` | REAL | OK | firestoreRouter | client.ts:560 | /api/auth/face/nonce/route.ts | 1/2 |
| `/api/auth/face/verify` | REAL | OK | firestoreRouter | client.ts:550 | /api/auth/face/verify/route.ts | 1/4 |
| `/api/auth/forgot-password` | REAL | OK | firestoreRouter | client.ts:528 | — | 0/2 |
| `/api/auth/logout` | STUB | A | firestoreRouter | client.ts:429 | — | 0/1 |
| `/api/auth/me` | REAL | OK | firestoreRouter | client.ts:428 | /api/auth/me/route.ts | 0/5 |
| `/api/auth/onboarding` | REAL | OK | firestoreRouter | client.ts:442 | /api/auth/onboarding/route.ts | 4/9 |
| `/api/auth/profile` | REAL | OK | firestoreRouter | client.ts:430 | — | 12/26 |
| `/api/auth/reset-password` | REAL | OK | firestoreRouter | client.ts:536 | — | 0/2 |
| `/api/auth/session` | REAL | OK | firestoreRouter | client.ts:560 | /api/auth/session/route.ts | 5/10 |
| `/api/auth/signup` | REAL | OK | firestoreRouter | client.ts:560 | — | 0/1 |
| `/api/auth/teacher` | REAL | OK | firestoreRouter | client.ts:441 | — | 1/3 |
| `/api/auth/vault-exchange` | REAL | OK | firestoreRouter | client.ts:560 | /api/auth/vault-exchange/route.ts | 1/2 |
| `/api/avatar` | STUB | A | firestoreRouter | client.ts:4298 | — | 0/1 |
| `/api/avatar/chat` | STUB | B | firestoreRouter | client.ts:4298 | /api/avatar/chat/route.ts | 2/6 |
| `/api/avatar/context` | REAL | OK | firestoreRouter | client.ts:3839 | /api/avatar/context/route.ts | 2/5 |
| `/api/avatar/memory` | REAL | OK | firestoreRouter | client.ts:3846 | /api/avatar/memory/route.ts | 2/5 |
| `/api/cache/clear` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/2 |
| `/api/cache/hash` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/cache/stats` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/2 |
| `/api/career-builder/generate` | REAL | OK | firestoreRouter | client.ts:758 | — | 0/3 |
| `/api/career-dna/archetype` | REAL | OK | firestoreRouter | client.ts:733 | — | 0/1 |
| `/api/career-dna/calculate` | REAL | OK | firestoreRouter | client.ts:734 | — | 0/1 |
| `/api/career-dna/history` | REAL | OK | firestoreRouter | client.ts:735 | — | 0/1 |
| `/api/career-dna/profile` | REAL | OK | firestoreRouter | client.ts:732 | — | 0/2 |
| `/api/career-dna/recalculate` | REAL | OK | firestoreRouter | client.ts:734 | — | 0/1 |
| `/api/career-dna/scores` | REAL | OK | firestoreRouter | client.ts:731 | — | 0/2 |
| `/api/career-twin` | STUB | A | firestoreRouter | client.ts:740 | — | 0/1 |
| `/api/career-twin/readiness` | STUB | A | firestoreRouter | client.ts:740 | /api/career-twin/readiness/route.ts | 1/1 |
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:736 | /api/career-twin/results/route.ts | 0/4 |
| `/api/career-twin/run` | STUB | A | firestoreRouter | client.ts:737 | — | 1/3 |
| `/api/career-twin/simulate` | STUB | A | firestoreRouter | client.ts:737 | — | 0/1 |
| `/api/chat` | STUB | A | firestoreRouter | client.ts:2266 | — | 1/4 |
| `/api/chat/history` | STUB | A | firestoreRouter | client.ts:2266 | — | 0/1 |
| `/api/chat/history/:param` | STUB | A | firestoreRouter | client.ts:2265 | — | 1/2 |
| `/api/chat/session` | STUB | A | firestoreRouter | client.ts:2264 | — | 1/3 |
| `/api/code/debug-tutor` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/debug-tutor/route.ts | 1/2 |
| `/api/code/evaluate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/evaluate/route.ts | 1/2 |
| `/api/code/run-java` | REAL | OK | firestoreRouter | client.ts:2112 | /api/code/run-java/route.ts | 1/3 |
| `/api/code/run-python` | REAL | OK | firestoreRouter | client.ts:2045 | /api/code/run-python/route.ts | 1/3 |
| `/api/codewars/matches` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/codewars/matches/route.ts | 2/4 |
| `/api/communication/all` | REAL | OK | campusFallback | campusFallback.ts:218 | /api/communication/all/route.ts | 0/1 |
| `/api/communication/evaluate` | REAL | OK | firestoreRouter | client.ts:585 | — | 0/2 |
| `/api/consultant` | REAL | OK | firestoreRouter | client.ts:3160 | — | 0/2 |
| `/api/consultant/analytics` | REAL | OK | firestoreRouter | client.ts:3160 | /api/consultant/analytics/route.ts | 0/2 |
| `/api/consultant/pipeline` | REAL | OK | firestoreRouter | client.ts:3160 | /api/consultant/pipeline/route.ts | 0/2 |
| `/api/consultant/sessions` | REAL | OK | firestoreRouter | client.ts:3160 | — | 1/4 |
| `/api/consultant/student` | REAL | OK | firestoreRouter | client.ts:3160 | — | 0/6 |
| `/api/consultant/student/:param` | REAL | OK | firestoreRouter | client.ts:3160 | — | 2/4 |
| `/api/consultant/student/:param/task` | REAL | OK | firestoreRouter | client.ts:3160 | — | 1/2 |
| `/api/consultant/student/:param/verify-document` | REAL | OK | firestoreRouter | client.ts:3160 | — | 1/2 |
| `/api/consultant/student/add` | REAL | OK | firestoreRouter | client.ts:3160 | /api/consultant/student/add/route.ts | 1/3 |
| `/api/contact` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/contact/route.ts | 2/4 |
| `/api/documents/mine` | REAL | OK | campusFallback | campusFallback.ts:120 | /api/documents/mine/route.ts | 0/1 |
| `/api/documents/request` | REAL | OK | campusFallback | campusFallback.ts:122 | /api/documents/request/route.ts | 0/1 |
| `/api/events/rsvp` | REAL | OK | campusFallback | campusFallback.ts:264 | /api/events/rsvp/route.ts | 0/1 |
| `/api/events/stats` | REAL | OK | campusFallback | campusFallback.ts:262 | /api/events/stats/route.ts | 0/1 |
| `/api/exam` | STUB | A | firestoreRouter | client.ts:2013 | — | 0/2 |
| `/api/exam/:param/questions` | STUB | A | firestoreRouter | client.ts:2010 | — | 0/1 |
| `/api/exam/available` | STUB | A | firestoreRouter | client.ts:2009 | — | 0/2 |
| `/api/exam/results` | STUB | A | firestoreRouter | client.ts:2012 | — | 0/3 |
| `/api/exam/scheduled` | STUB | A | firestoreRouter | client.ts:2013 | — | 0/1 |
| `/api/exam/sync-result` | STUB | A | firestoreRouter | client.ts:2011 | /api/exam/sync-result/route.ts | 1/3 |
| `/api/exams/admin-manage` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | /api/exams/admin-manage/route.ts | 3/5 |
| `/api/exams/get-exam` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | /api/exams/get-exam/route.ts | 1/1 |
| `/api/exams/results` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 0/1 |
| `/api/exams/schedule` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 0/1 |
| `/api/exams/student-results` | REAL | OK | campusFallback | campusFallback.ts:97 | /api/exams/student-results/route.ts | 1/2 |
| `/api/exams/student-schedule` | REAL | OK | campusFallback | campusFallback.ts:95 | /api/exams/student-schedule/route.ts | 0/1 |
| `/api/finance/apply-scholarship` | REAL | OK | campusFallback | campusFallback.ts:79 | /api/finance/apply-scholarship/route.ts | 0/1 |
| `/api/finance/dues` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 0/1 |
| `/api/finance/pay-due` | REAL | OK | campusFallback | campusFallback.ts:75 | /api/finance/pay-due/route.ts | 0/1 |
| `/api/finance/scholarships` | COMPUTE | C | campusFallback | campusFallback.ts:77 | /api/finance/scholarships/route.ts | 0/1 |
| `/api/finance/student-dues` | REAL | OK | campusFallback | campusFallback.ts:73 | /api/finance/student-dues/route.ts | 1/2 |
| `/api/friends` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/route.ts | 6/11 |
| `/api/friends/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/friends/challenges` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/challenges/route.ts | 4/8 |
| `/api/friends/messages` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/messages/route.ts | 3/5 |
| `/api/friends/privacy` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/privacy/route.ts | 5/10 |
| `/api/friends/projects` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/projects/route.ts | 3/6 |
| `/api/friends/report` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/report/route.ts | 1/2 |
| `/api/gd/history` | REAL | OK | firestoreRouter | client.ts:2268 | /api/gd/history/route.ts | 3/7 |
| `/api/github/ingest` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/github/ingest/route.ts | 2/4 |
| `/api/grievances/stats` | REAL | OK | campusFallback | campusFallback.ts:251 | /api/grievances/stats/route.ts | 0/1 |
| `/api/grievances/submit` | REAL | OK | campusFallback | campusFallback.ts:253 | /api/grievances/submit/route.ts | 0/1 |
| `/api/group-discussion/bot-reply` | REAL | OK | firestoreRouter | client.ts:2438 | /api/group-discussion/bot-reply/route.ts | 2/5 |
| `/api/group-discussion/evaluate` | REAL | OK | firestoreRouter | client.ts:2465 | /api/group-discussion/evaluate/route.ts | 1/3 |
| `/api/group-discussion/messages` | REAL | OK | firestoreRouter | client.ts:2421 | — | 0/2 |
| `/api/hostel/checkout-visitor` | REAL | OK | campusFallback | campusFallback.ts:68 | /api/hostel/checkout-visitor/route.ts | 0/1 |
| `/api/hostel/log-attendance` | REAL | OK | campusFallback | campusFallback.ts:60 | /api/hostel/log-attendance/route.ts | 0/1 |
| `/api/hostel/raise-complaint` | REAL | OK | campusFallback | campusFallback.ts:62 | /api/hostel/raise-complaint/route.ts | 0/1 |
| `/api/hostel/register-visitor` | REAL | OK | campusFallback | campusFallback.ts:66 | /api/hostel/register-visitor/route.ts | 0/1 |
| `/api/hostel/request-room` | REAL | OK | campusFallback | campusFallback.ts:58 | /api/hostel/request-room/route.ts | 0/1 |
| `/api/hostel/stats` | REAL | OK | campusFallback | campusFallback.ts:56 | /api/hostel/stats/route.ts | 0/1 |
| `/api/internships` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/internships/route.ts | 2/4 |
| `/api/interview` | STUB | A | firestoreRouter | client.ts:2000 | — | 0/1 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:2000 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/chat` | STUB | B | firestoreRouter | client.ts:2000 | /api/interview/chat/route.ts | 1/3 |
| `/api/interview/evaluate` | STUB | B | firestoreRouter | client.ts:2000 | /api/interview/evaluate/route.ts | 2/5 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:2000 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/interview/history` | REAL | OK | firestoreRouter | client.ts:1987 | /api/interview/history/route.ts | 2/5 |
| `/api/interview/respond` | STUB | A | firestoreRouter | client.ts:2000 | — | 0/1 |
| `/api/interview/start` | STUB | A | firestoreRouter | client.ts:2000 | /api/interview/start/route.ts | 2/5 |
| `/api/leaderboard` | REAL | OK | firestoreRouter | client.ts:1391 | /api/leaderboard/route.ts | 1/2 |
| `/api/library/books` | REAL | OK | campusFallback | campusFallback.ts:84 | /api/library/books/route.ts | 0/1 |
| `/api/library/borrow` | REAL | OK | campusFallback | campusFallback.ts:86 | /api/library/borrow/route.ts | 0/1 |
| `/api/library/reserve` | REAL | OK | campusFallback | campusFallback.ts:90 | /api/library/reserve/route.ts | 0/1 |
| `/api/library/return` | REAL | OK | campusFallback | campusFallback.ts:88 | /api/library/return/route.ts | 0/1 |
| `/api/llm` | REAL | OK | firestoreRouter | client.ts:4313 | /api/llm/route.ts | 3/7 |
| `/api/maintenance/report` | REAL | OK | campusFallback | campusFallback.ts:202 | /api/maintenance/report/route.ts | 0/1 |
| `/api/maintenance/stats` | REAL | OK | campusFallback | campusFallback.ts:200 | /api/maintenance/stats/route.ts | 0/1 |
| `/api/memory` | STUB | A | firestoreRouter | client.ts:3640 | — | 0/1 |
| `/api/mentor/chat` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/mentor/chat/route.ts | 1/2 |
| `/api/messages/direct` | REAL | OK | firestoreRouter | client.ts:3562 | /api/messages/direct/route.ts | 1/3 |
| `/api/messages/unread` | REAL | OK | firestoreRouter | client.ts:3558 | — | 0/1 |
| `/api/missions/generate-custom-skill` | REAL | OK | firestoreRouter | client.ts:580 | — | 1/3 |
| `/api/missions/history` | REAL | OK | firestoreRouter | client.ts:564 | /api/missions/history/route.ts | 0/2 |
| `/api/missions/roleplay` | REAL | OK | firestoreRouter | client.ts:704 | /api/missions/roleplay/route.ts | 3/7 |
| `/api/missions/streak` | REAL | OK | firestoreRouter | client.ts:730 | — | 0/2 |
| `/api/missions/submit` | REAL | OK | firestoreRouter | client.ts:565 | /api/missions/submit/route.ts | 2/5 |
| `/api/missions/today` | REAL | OK | firestoreRouter | client.ts:563 | /api/missions/today/route.ts | 0/3 |
| `/api/news` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/notes` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notes/upload` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notifications` | REAL | OK | firestoreRouter | client.ts:1369 | /api/notifications/route.ts | 0/4 |
| `/api/notifications/:param/read` | REAL | OK | firestoreRouter | client.ts:1371 | — | 1/2 |
| `/api/notifications/mark-all-read` | REAL | OK | firestoreRouter | client.ts:1370 | /api/notifications/mark-all-read/route.ts | 1/3 |
| `/api/opportunities` | STUB | A | firestoreRouter | client.ts:1377 | — | 0/4 |
| `/api/opportunities/applications` | REAL | OK | firestoreRouter | client.ts:1389 | — | 0/2 |
| `/api/opportunities/apply` | REAL | OK | firestoreRouter | client.ts:1382 | — | 1/3 |
| `/api/opportunities/feed` | REAL | OK | firestoreRouter | client.ts:1377 | — | 0/2 |
| `/api/opportunities/match` | REAL | OK | firestoreRouter | client.ts:1383 | — | 0/2 |
| `/api/parent` | REAL | OK | firestoreRouter | client.ts:2566 | — | 0/2 |
| `/api/parent/link-student` | REAL | OK | firestoreRouter | client.ts:2566 | /api/parent/link-student/route.ts | 1/3 |
| `/api/parent/student` | REAL | OK | firestoreRouter | client.ts:2566 | — | 0/2 |
| `/api/parent/student/:param/overview` | REAL | OK | firestoreRouter | client.ts:2528 | — | 0/1 |
| `/api/parent/students` | REAL | OK | firestoreRouter | client.ts:2566 | /api/parent/students/route.ts | 0/3 |
| `/api/pathway/evidence` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pathway/evidence/route.ts | 1/2 |
| `/api/payment` | REAL | OK | firestoreRouter | client.ts:1816 | — | 0/1 |
| `/api/payment/create-order` | REAL | OK | firestoreRouter | client.ts:1809 | /api/payment/create-order/route.ts | 1/9 |
| `/api/payment/plans` | STUB | A | firestoreRouter | client.ts:1808 | — | 0/3 |
| `/api/payment/status` | REAL | OK | firestoreRouter | client.ts:1781 | — | 0/3 |
| `/api/payment/verify` | REAL | OK | firestoreRouter | client.ts:1813 | /api/payment/verify/route.ts | 2/11 |
| `/api/personality` | STUB | A | firestoreRouter | client.ts:2008 | — | 0/1 |
| `/api/personality/analyze` | STUB | A | firestoreRouter | client.ts:2007 | — | 0/2 |
| `/api/personality/report` | STUB | A | firestoreRouter | client.ts:2005 | — | 0/3 |
| `/api/personality/session` | STUB | A | firestoreRouter | client.ts:2006 | — | 0/2 |
| `/api/pins/balance` | REAL | OK | firestoreRouter | client.ts:1748 | — | 0/2 |
| `/api/pins/buy-ai-minutes` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/buy-ai-minutes/route.ts | 1/2 |
| `/api/pins/claim-bonus` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/pins/claim-bonus/route.ts | 0/1 |
| `/api/pins/claim-streak-bonus` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/claim-streak-bonus/route.ts | 1/2 |
| `/api/pins/earn` | REAL | OK | firestoreRouter | client.ts:1752 | /api/pins/earn/route.ts | 2/5 |
| `/api/pins/extend-grace` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/extend-grace/route.ts | 1/2 |
| `/api/pins/purchase` | REAL | OK | firestoreRouter | client.ts:1776 | — | 0/1 |
| `/api/pins/spend` | REAL | OK | firestoreRouter | client.ts:1764 | /api/pins/spend/route.ts | 1/3 |
| `/api/placements/push` | REAL | OK | firestoreRouter | client.ts:3695 | — | 0/1 |
| `/api/portfolio/analyze-certificate` | REAL | OK | firestoreRouter | client.ts:2898 | /api/portfolio/analyze-certificate/route.ts | 1/3 |
| `/api/portfolio/verify-endorsement` | REAL | OK | firestoreRouter | client.ts:2877 | /api/portfolio/verify-endorsement/route.ts | 2/5 |
| `/api/portfolio/verify-exam` | REAL | OK | firestoreRouter | client.ts:3057 | /api/portfolio/verify-exam/route.ts | 1/3 |
| `/api/projects/generate` | REAL | OK | firestoreRouter | client.ts:1511 | /api/projects/generate/route.ts | 1/3 |
| `/api/quest/complete` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/quest/complete/route.ts | 3/6 |
| `/api/quests/enrollment` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/quests/enrollment/route.ts | 5/10 |
| `/api/quests/generate-slides` | REAL | OK | firestoreRouter | client.ts:3850 | — | 0/1 |
| `/api/quests/roadmap/generate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/quests/roadmap/generate/route.ts | 1/2 |
| `/api/quests/verify` | REAL | OK | firestoreRouter | client.ts:3648 | /api/quests/verify/route.ts | 0/2 |
| `/api/recruiter` | REAL | OK | firestoreRouter | client.ts:2639 | — | 0/2 |
| `/api/recruiter/activity-log` | REAL | OK | firestoreRouter | client.ts:2639 | — | 1/2 |
| `/api/recruiter/analytics` | REAL | OK | firestoreRouter | client.ts:2639 | — | 0/2 |
| `/api/recruiter/applications` | REAL | OK | firestoreRouter | client.ts:2639 | — | 1/4 |
| `/api/recruiter/candidate` | REAL | OK | firestoreRouter | client.ts:2639 | — | 0/2 |
| `/api/recruiter/candidate/:param` | REAL | OK | firestoreRouter | client.ts:2639 | — | 0/1 |
| `/api/recruiter/candidates` | REAL | OK | firestoreRouter | client.ts:2639 | — | 0/2 |
| `/api/recruiter/company` | REAL | OK | firestoreRouter | client.ts:2639 | — | 1/4 |
| `/api/recruiter/contact-request` | REAL | OK | firestoreRouter | client.ts:2639 | /api/recruiter/contact-request/route.ts | 1/4 |
| `/api/recruiter/jobs` | REAL | OK | firestoreRouter | client.ts:2639 | — | 2/8 |
| `/api/recruiter/jobs/:param` | REAL | OK | firestoreRouter | client.ts:2639 | — | 1/2 |
| `/api/recruiter/pipeline` | REAL | OK | firestoreRouter | client.ts:2639 | /api/recruiter/pipeline/route.ts | 0/2 |
| `/api/recruiter/schedule-interview` | REAL | OK | firestoreRouter | client.ts:2639 | /api/recruiter/schedule-interview/route.ts | 3/8 |
| `/api/recruiter/shortlist` | REAL | OK | firestoreRouter | client.ts:2639 | /api/recruiter/shortlist/route.ts | 1/4 |
| `/api/recruiter/visibility` | REAL | OK | firestoreRouter | client.ts:2834 | /api/recruiter/visibility/route.ts | 2/6 |
| `/api/research/publish-paper` | REAL | OK | campusFallback | campusFallback.ts:274 | /api/research/publish-paper/route.ts | 0/1 |
| `/api/research/stats` | REAL | OK | campusFallback | campusFallback.ts:272 | /api/research/stats/route.ts | 0/1 |
| `/api/resume` | STUB | A | firestoreRouter | client.ts:1284 | — | 0/1 |
| `/api/resume/:param/improve` | STUB | A | firestoreRouter | client.ts:1284 | — | 0/1 |
| `/api/resume/analyze` | STUB | B | firestoreRouter | client.ts:1284 | /api/resume/analyze/route.ts | 0/1 |
| `/api/resume/generate-from-vault` | STUB | A | firestoreRouter | client.ts:1284 | — | 0/3 |
| `/api/resume/list` | STUB | A | firestoreRouter | client.ts:1284 | — | 0/1 |
| `/api/resume/structured` | STUB | A | firestoreRouter | client.ts:1284 | — | 0/2 |
| `/api/resume/structured/:param/enhance` | REAL | OK | firestoreRouter | client.ts:1239 | — | 0/1 |
| `/api/resume/structured/me` | REAL | OK | firestoreRouter | client.ts:741 | — | 0/2 |
| `/api/resume/suggestions` | STUB | A | firestoreRouter | client.ts:1284 | — | 0/1 |
| `/api/resume/upload` | REAL | OK | firestoreRouter | client.ts:858 | — | 1/4 |
| `/api/sentinel` | STUB | A | firestoreRouter | client.ts:2043 | — | 0/1 |
| `/api/sentinel/fingerprint` | STUB | A | firestoreRouter | client.ts:2016 | — | 0/1 |
| `/api/sentinel/search-similar` | STUB | A | firestoreRouter | client.ts:2025 | — | 0/1 |
| `/api/services/apply-leave` | REAL | OK | campusFallback | campusFallback.ts:229 | /api/services/apply-leave/route.ts | 2/4 |
| `/api/services/book-appointment` | REAL | OK | campusFallback | campusFallback.ts:233 | /api/services/book-appointment/route.ts | 1/2 |
| `/api/services/book-counselling` | REAL | OK | campusFallback | campusFallback.ts:235 | /api/services/book-counselling/route.ts | 1/2 |
| `/api/services/file-request` | REAL | OK | campusFallback | campusFallback.ts:231 | /api/services/file-request/route.ts | 2/4 |
| `/api/services/stats` | REAL | OK | campusFallback | campusFallback.ts:227 | /api/services/stats/route.ts | 0/1 |
| `/api/settings/erp/sync` | DECLINED | A | campusFallback | campusFallback.ts:294 | — | 0/1 |
| `/api/settings/migration/execute` | DECLINED | A | campusFallback | campusFallback.ts:294 | — | 0/1 |
| `/api/settings/migration/validate` | DECLINED | A | campusFallback | campusFallback.ts:294 | — | 0/1 |
| `/api/settings/rollout/feedback` | DECLINED | A | campusFallback | campusFallback.ts:294 | — | 0/1 |
| `/api/stt` | REAL | OK | firestoreRouter | client.ts:3642 | /api/stt/route.ts | 2/5 |
| `/api/student/activity` | REAL | OK | firestoreRouter | client.ts:3442 | /api/student/activity/route.ts | 6/14 |
| `/api/study` | STUB | A | firestoreRouter | client.ts:2527 | — | 0/1 |
| `/api/study/complete` | REAL | OK | firestoreRouter | client.ts:2526 | — | 1/3 |
| `/api/teacher/inbox` | REAL | OK | firestoreRouter | client.ts:3554 | /api/teacher/inbox/route.ts | 0/1 |
| `/api/teacher/list` | REAL | OK | firestoreRouter | client.ts:3538 | — | 0/1 |
| `/api/teacher/students` | REAL | OK | firestoreRouter | client.ts:3516 | — | 0/3 |
| `/api/teacher/submit-marks` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/teacher/submit-marks/route.ts | 1/2 |
| `/api/teacher/training/submit` | REAL | OK | firestoreRouter | client.ts:3582 | — | 1/3 |
| `/api/time` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/time/route.ts | 1/2 |
| `/api/transport/register` | REAL | OK | campusFallback | campusFallback.ts:106 | /api/transport/register/route.ts | 0/1 |
| `/api/transport/stats` | REAL | OK | campusFallback | campusFallback.ts:104 | /api/transport/stats/route.ts | 0/1 |
| `/api/trust` | STUB | A | firestoreRouter | client.ts:2004 | — | 0/1 |
| `/api/trust/evaluate` | REAL | OK | firestoreRouter | client.ts:2003 | — | 1/3 |
| `/api/trust/score` | REAL | OK | firestoreRouter | client.ts:2002 | — | 0/2 |
| `/api/tts` | STUB | A | firestoreRouter | client.ts:3641 | /api/tts/route.ts | 3/7 |
| `/api/university` | REAL | OK | firestoreRouter | client.ts:3145 | — | 0/1 |
| `/api/university/dashboard` | REAL | OK | firestoreRouter | client.ts:3145 | /api/university/dashboard/route.ts | 0/2 |
| `/api/university/employability-report` | REAL | OK | firestoreRouter | client.ts:3145 | /api/university/employability-report/route.ts | 0/2 |
| `/api/university/placement-roster` | REAL | OK | firestoreRouter | client.ts:3145 | /api/university/placement-roster/route.ts | 1/1 |
| `/api/university/skill-gaps` | REAL | OK | firestoreRouter | client.ts:3145 | /api/university/skill-gaps/route.ts | 0/2 |
| `/api/v1/auth` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/v1/auth/devices` | LOCAL-STORE | A | firestoreRouter | client.ts:418 | — | 0/1 |
| `/api/v1/auth/exchange-session` | LOCAL-STORE | A | firestoreRouter | client.ts:309 | — | 1/3 |
| `/api/v1/auth/logout-all` | LOCAL-STORE | A | firestoreRouter | client.ts:404 | — | 1/3 |
| `/api/v1/auth/vault-approve` | LOCAL-STORE | A | firestoreRouter | client.ts:269 | — | 0/2 |
| `/api/v1/auth/vault-challenge` | REAL | OK | firestoreRouter | client.ts:155 | — | 0/2 |
| `/api/v1/auth/vault-stream` | LOCAL-STORE | A | firestoreRouter | client.ts:234 | — | 0/1 |
| `/api/vault` | REAL | OK | firestoreRouter | client.ts:1297 | — | 1/7 |
| `/api/vault/delete` | REAL | OK | firestoreRouter | client.ts:1075 | /api/vault/delete/route.ts | 2/6 |
| `/api/vault/items` | STUB | A | firestoreRouter | client.ts:1285 | — | 0/1 |
| `/api/vault/stats` | REAL | OK | firestoreRouter | client.ts:1286 | — | 0/1 |
| `/api/vault/upload` | REAL | OK | firestoreRouter | client.ts:1299 | /api/vault/upload/route.ts | 0/7 |
| `/api/verify/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/xp/add` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/xp/add/route.ts | 1/2 |
