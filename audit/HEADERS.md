# Hosting headers vs. what the app does — generated, do not hand-edit

Regenerate: `node audit/check-headers.mjs`

Under static Firebase hosting `src/middleware.ts` does not run, so `firebase.json`
is the only thing setting response headers. A denied host or device produces the
same symptom as a stubbed handler — the feature silently does nothing — but the
cause is in `firebase.json`, not in `src/`.

- **findings**: 2 {"BROKEN":2}
- **connect-src**: `'self' blob: https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://*.razorpay.com https://pinit-voice-service.onrender.com https://pinit-backend-v8pd.onrender.com https://api.github.com https://cdn.jsdelivr.net`
- **Permissions-Policy**: `camera=(self), microphone=(self), geolocation=(), browsing-topics=()`

## 1. [BROKEN] csp — `https://openrouter.ai`

called from src/lib/server/llmJson.ts but not in connect-src, so the request is blocked by CSP.

**Fix:** Add https://openrouter.ai to connect-src in firebase.json, or route the call through the backend.

## 2. [BROKEN] csp — `https://api.groq.com`

called from src/lib/server/llmJson.ts but not in connect-src, so the request is blocked by CSP.

**Fix:** Add https://api.groq.com to connect-src in firebase.json, or route the call through the backend.
