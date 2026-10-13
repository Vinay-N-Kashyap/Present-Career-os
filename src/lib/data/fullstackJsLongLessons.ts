import type { LongLesson } from './longLessons';

/**
 * Modern Full-Stack JavaScript & Next.js App Router Architecture (Course: fullstack-js)
 * Day 1: React Server Components, Streaming SSR & Hydration Invariants.
 */
export const FULLSTACK_JS_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'fullstack-js',
    day: 1,
    title: 'React Server Components & Streaming SSR Architecture',
    goal: 'Master the fundamental architectural boundary between server-rendered components, streaming HTML, and client hydration.',
    minutes: 40,
    recap: 'Welcome to Advanced Full-Stack JavaScript. We will unpack how modern web frameworks transition from monolithic client-side Single Page Applications (SPAs) into hybrid Server-Driven Architectures.',
    parts: [
      {
        title: 'React Server Components (RSC): The Zero-Bundle-Size Paradigm',
        say: [
          'For nearly a decade, the web development ecosystem was dominated by client-side Single Page Applications (SPAs). In an SPA, the browser downloads a massive JavaScript bundle containing UI components, formatting libraries (like date-fns), and state management engines before a single meaningful word can render on screen.',
          'React Server Components (RSC) fundamentally redefine this execution model by splitting your component tree into two distinct runtime environments: components that execute strictly on the server, and components that hydrate on the client. By default, every component in the Next.js App Router is a Server Component.',
          'Server Components execute exclusively on the Node.js or Edge runtime. They have direct, zero-overhead access to databases, internal microservices, and filesystem assets. Crucially, their npm dependencies never ship to the browser client! A 500KB markdown parsing library executed in a Server Component costs exactly 0 KB in the user’s downloaded JavaScript bundle.',
          'Instead of compiling to HTML or JavaScript bundle code, Server Components serialize into a compact, streamable JSON-like wire format known as the React Flight format. This format describes the rendered component tree and coordinates where interactive Client Component slots (`use client`) must be mounted.'
        ],
        example: 'Think of ordering furniture online. In a traditional SPA, the company ships you tree logs, an electric saw, and nails so you can mill and build the wardrobe in your bedroom (downloading libraries to client). In RSC, the carpenters build and assemble the wardrobe in their factory and deliver the finished product directly into your room; you only assemble the door knobs that actually turn (interactive client components).',
        code: `// Simulation: React Server Component Wire Payload (Flight Protocol Serialization)
interface FlightComponentNode {
  type: string;
  isClientBoundary: boolean;
  props: Record<string, unknown>;
  children?: FlightComponentNode[];
}

// Server Component: reads directly from DB and parses heavy markdown (0 KB client bundle)
function renderServerPostTree(post: { id: string; title: string; views: number }): FlightComponentNode {
  return {
    type: 'article',
    isClientBoundary: false,
    props: { className: 'prose-container' },
    children: [
      {
        type: 'h1',
        isClientBoundary: false,
        props: { children: post.title }
      },
      // Client Component Boundary: interactive bookmark button ('use client')
      {
        type: 'ClientBookmarkButton',
        isClientBoundary: true,
        props: {
          postId: post.id,
          initialFavorited: false,
          clientModuleId: '/static/chunks/ClientBookmarkButton.js'
        }
      }
    ]
  };
}

const post = { id: 'post-101', title: 'Architecting Zero-Bundle Web Applications', views: 4200 };
const flightPayload = renderServerPostTree(post);

console.log('Flight Root Node:', flightPayload.type);
console.log('Zero Client Bundle Node Count:', flightPayload.children?.filter(c => !c.isClientBoundary).length);
console.log('Client Hydration Boundary:', flightPayload.children?.find(c => c.isClientBoundary)?.type);`,
        output: `Flight Root Node: article\nZero Client Bundle Node Count: 1\nClient Hydration Boundary: ClientBookmarkButton`,
        tryIt: 'Add a second Server Component child for formatted view count and verify it remains on the server side of the boundary.',
        check: {
          question: 'What happens to npm dependencies imported inside a React Server Component (without the "use client" directive)?',
          options: [
            'They are compiled into WebAssembly and downloaded by the browser',
            'They are executed strictly on the server and are NEVER bundled or downloaded to the client browser',
            'They cause a build-time compile error unless marked with async'
          ],
          answer: 1,
          why: 'Server Components execute only on the backend. Their code and dependencies are evaluated during rendering, and only the resulting serialized Flight payload is streamed to the browser, eliminating client bundle bloat.'
        }
      },
      {
        title: 'Streaming SSR & Out-of-Order HTML Hydration via Suspense',
        say: [
          'In traditional Server-Side Rendering (SSR), the server had an all-or-nothing bottleneck. If a page contained three fast database queries (taking 10ms each) and one slow third-party API call (taking 2,500ms), the server could not send a single byte of HTML to the browser until the slowest call finished! The user stared at a blank screen with high Time to First Byte (TTFB).',
          'Streaming SSR solves this using HTTP Chunked Transfer Encoding paired with React `<Suspense>` boundaries. The server immediately flushes the shell of the page—the navigation bar, layout, and fallback skeletons—in under 20 milliseconds.',
          'As the slow asynchronous data completes on the server, React generates inline `<template>` chunks containing the rendered HTML along with a tiny self-executing JavaScript snippet that swaps the skeleton out for the real content directly in the browser DOM.',
          'Crucially, hydration also becomes selective and progressive. If a user clicks on a streamed button while other parts of the page are still loading, React prioritizes hydrating that specific clicked component immediately, ensuring responsiveness without waiting for full page hydration.'
        ],
        example: 'Think of sitting down at a fine dining restaurant. A traditional SSR waiter refuses to bring you water, bread, or cutlery until the 45-minute slow-roasted duck is fully cooked. A Streaming SSR waiter delivers water and warm bread in 30 seconds so you can start eating immediately while the kitchen roasts the main course.',
        code: `// Simulation: Chunked Streaming SSR with Suspense Boundary Resolution
interface StreamChunk {
  chunkIndex: number;
  html: string;
  isFallback: boolean;
  timeMs: number;
}

class StreamingSSRSimulator {
  private chunks: StreamChunk[] = [];

  // Instant Shell Flush
  flushShell(): StreamChunk {
    const shell: StreamChunk = {
      chunkIndex: 0,
      html: '<header>Career OS</header><main><div id="suspense-skeleton">Loading analytics...</div></main>',
      isFallback: true,
      timeMs: 15
    };
    this.chunks.push(shell);
    return shell;
  }

  // Stream out-of-order async resolution
  streamResolvedSuspense(content: string, latencyMs: number): StreamChunk {
    const chunk: StreamChunk = {
      chunkIndex: this.chunks.length,
      html: \`<template id="B:1">\${content}</template><script>$RC("suspense-skeleton", "B:1")</script>\`,
      isFallback: false,
      timeMs: latencyMs
    };
    this.chunks.push(chunk);
    return chunk;
  }

  getAllChunks(): StreamChunk[] {
    return this.chunks;
  }
}

const ssr = new StreamingSSRSimulator();
const initialShell = ssr.flushShell();
const resolvedAnalytics = ssr.streamResolvedSuspense('<div class="chart">QPS: 45,000 req/sec</div>', 850);

console.log('Shell TTFB:', initialShell.timeMs, 'ms');
console.log('Shell Content Preview:', initialShell.html.substring(0, 31) + '...');
console.log('Async Replacement Chunk:', resolvedAnalytics.timeMs, 'ms');`,
        output: `Shell TTFB: 15 ms\nShell Content Preview: <header>Career OS</header><main>...\nAsync Replacement Chunk: 850 ms`,
        tryIt: 'Simulate streaming multiple concurrent Suspense boundaries (e.g. user profile at 100ms and recommendation engine at 900ms).',
        check: {
          question: 'How does Streaming SSR improve Time to First Byte (TTFB) and perceived user performance?',
          options: [
            'It flushes the fast HTML shell and Suspense skeletons immediately, streaming heavy components as they finish without blocking the initial response',
            'It disables all JavaScript on the client device',
            'It stores the entire website permanently inside browser cookies'
          ],
          answer: 0,
          why: 'By decoupling fast static layout elements from slow database queries with Suspense, HTTP chunked transfer delivers initial HTML in milliseconds, keeping users engaged while background data streams in.'
        }
      },
      {
        title: 'Server Actions, CSRF Protection & Deterministic Mutations',
        say: [
          'In traditional full-stack web applications, updating data required creating a REST API endpoint (`POST /api/todos`), manually serializing JSON with `fetch()`, handling loading spinners with state variables, and imperatively refetching queries.',
          'Next.js Server Actions unify data mutation by allowing you to define asynchronous server functions directly within your component files using the `"use server"` directive. A Server Action can be passed directly to a native HTML `<form action={myAction}>` element.',
          'This provides progressive enhancement: if JavaScript fails to load or is slow on mobile networks, the form still submits natively via standard HTTP POST! When JavaScript is active, Next.js intercepts the submission via AJAX, validates CSRF origin headers, executes the database mutation on the server, and automatically triggers `revalidatePath()` or `revalidateTag()`.',
          'For instant perceived responsiveness, React provides the `useOptimistic` hook, allowing the UI to render the expected outcome immediately before the server round-trip completes, rolling back automatically if the server action throws an error.'
        ],
        example: 'Think of tapping "Like" on a social media post. The heart instantly turns red on your screen (useOptimistic). In the background, a secure message notifies the database. If your phone loses Wi-Fi and the save fails, the heart flips back with a toast alert.',
        code: `// Simulation: Next.js Server Action Mutation & Optimistic State Lifecycle
interface PostState {
  id: string;
  likes: number;
}

// Server Action definition ("use server")
async function likePostAction(
  post: PostState,
  csrfHeader: string,
  allowedOrigin: string
): Promise<{ success: boolean; updatedPost?: PostState; error?: string }> {
  // 1. Origin verification against Cross-Site Request Forgery (CSRF)
  if (!csrfHeader || csrfHeader !== allowedOrigin) {
    return { success: false, error: 'Forbidden: CSRF Origin mismatch' };
  }

  // 2. Perform atomic database increment
  const updated: PostState = {
    id: post.id,
    likes: post.likes + 1
  };

  return { success: true, updatedPost: updated };
}

// Client Optimistic Mutation handler
function applyOptimisticLike(currentLikes: number): number {
  return currentLikes + 1; // Instant UI feedback
}

const currentPost: PostState = { id: 'post-42', likes: 120 };
const optimisticLikes = applyOptimisticLike(currentPost.likes);

console.log('Initial Likes:', currentPost.likes);
console.log('Optimistic Likes in UI:', optimisticLikes);

likePostAction(currentPost, 'https://career-os.com', 'https://career-os.com').then((res) => {
  console.log('Server Action Mutation Success:', res.success);
  console.log('Confirmed Database Likes:', res.updatedPost?.likes);
});`,
        output: `Initial Likes: 120\nOptimistic Likes in UI: 121\nServer Action Mutation Success: true\nConfirmed Database Likes: 121`,
        tryIt: 'Pass an untrusted origin such as https://attacker.com and verify that the action safely rejects the request.',
        check: {
          question: 'What is the primary architectural advantage of passing a Server Action to a standard HTML form element?',
          options: [
            'It enables progressive enhancement so forms work even before JavaScript has loaded, and allows automatic server cache invalidation via revalidatePath',
            'It converts SQL queries directly into client-side cookies',
            'It encrypts the entire frontend DOM using blockchain hashes'
          ],
          answer: 0,
          why: 'Native form binding allows basic functionality to operate without JavaScript while providing modern AJAX interception, CSRF validation, and seamless cache revalidation when scripts are active.'
        }
      },
      {
        title: 'Data Fetching, Deduplication & The Extended Fetch Cache',
        say: [
          'In deep React component trees, multiple disparate components often require the exact same user profile or configuration data. In legacy architectures, developers resorted to prop drilling or complex global state management (like Redux) just to avoid firing duplicate network requests.',
          'The Next.js App Router integrates request deduplication into the runtime. By patching the native `fetch()` API and leveraging `React.cache()`, multiple identical GET requests within the same render pass are automatically deduped. You can call `getUserProfile()` in your Navbar, Sidebar, and Hero banner; it will fire across the network exactly ONCE.',
          'Furthermore, Next.js introduces fine-grained caching strategies via fetch options: `fetch(url, { cache: "force-cache" })` for static data cached indefinitely, `fetch(url, { next: { revalidate: 60 } })` for Incremental Static Regeneration (ISR) that updates in the background every minute, and `fetch(url, { cache: "no-store" })` for strictly dynamic real-time data.',
          'Understanding these cache boundaries is essential: dynamic functions like `cookies()` or `headers()` automatically opt the surrounding route segment into dynamic rendering, bypassing the static full-route cache.'
        ],
        example: 'Think of three colleagues in the same office all needing a copy of the morning newspaper. Instead of each person driving separately to the newsstand (3 duplicate network calls), the receptionist buys one paper, makes photocopies, and distributes them across the desks (request deduplication).',
        code: `// Simulation: Request Deduplication & React Request Cache
class RequestDeduplicator {
  private inFlightRequests: Map<string, Promise<unknown>> = new Map();
  private requestExecutionCount = 0;

  async fetchDeduped<T>(url: string, fetchFn: () => Promise<T>): Promise<T> {
    if (this.inFlightRequests.has(url)) {
      return this.inFlightRequests.get(url) as Promise<T>;
    }

    const promise = (async () => {
      this.requestExecutionCount++;
      return await fetchFn();
    })();

    this.inFlightRequests.set(url, promise);
    return promise as Promise<T>;
  }

  getMetrics() {
    return { executedHttpRequests: this.requestExecutionCount };
  }
}

const cache = new RequestDeduplicator();
const simulatedApiCall = () => new Promise<string>((resolve) => setTimeout(() => resolve('UserData-881'), 20));

// Simultaneous calls from Navbar, Sidebar, and ProfileHeader
Promise.all([
  cache.fetchDeduped('/api/user/881', simulatedApiCall),
  cache.fetchDeduped('/api/user/881', simulatedApiCall),
  cache.fetchDeduped('/api/user/881', simulatedApiCall)
]).then((results) => {
  console.log('Fetched Results Count:', results.length);
  console.log('Actual Outgoing HTTP Calls:', cache.getMetrics().executedHttpRequests);
  console.log('Data Consistency:', results[0] === results[1] && results[1] === results[2]);
});`,
        output: `Fetched Results Count: 3\nActual Outgoing HTTP Calls: 1\nData Consistency: true`,
        tryIt: 'Simulate calling a second unique endpoint /api/user/992 and verify the execution counter increments to 2.',
        check: {
          question: 'What happens when three independent Server Components call fetch("https://api.internal/config") during the same render pass?',
          options: [
            'Next.js automatically deduplicates the request so the remote API is hit only once during that render cycle',
            'The server crashes due to a socket race condition',
            'The third component receives null while the first two succeed'
          ],
          answer: 0,
          why: 'The extended fetch implementation in React Server Components automatically deduplicates identical GET requests per render pass, allowing components to colocate their data requirements without penalty.'
        }
      },
      {
        title: 'Production Edge Middleware & Isolate Security Invariants',
        say: [
          'In distributed full-stack production systems, every millisecond counts. Routing all requests—including static assets, bots, and unauthenticated traffic—to a heavy centralized Node.js origin server introduces unnecessary latency and cost.',
          'Edge Middleware executes on lightweight V8 isolates positioned at hundreds of points of presence (PoPs) worldwide, physically adjacent to your end users. Middleware runs before a request ever reaches the cache or route handlers.',
          'Because Edge isolates boot in sub-millisecond time and consume minimal memory, they are the ideal gatekeeper for critical security policies: validating JSON Web Tokens (JWTs) via cryptographic signatures, rewriting geographic routing, injecting security headers (CSP, HSTS), and enforcing token-bucket rate limiting.',
          'However, Edge isolates have strict architectural constraints: they cannot execute native Node.js C++ bindings (such as `fs` or native database drivers with TCP sockets). All outbound calls must use standard Web APIs like `fetch()`, HTTP-based connection poolers (like Neon or Supabase HTTP API), or WebSockets.'
        ],
        example: 'Think of airport security checkpoints. Before passengers ever reach the domestic or international gate wings (the origin server), an officer inspects their passport and boarding pass at the perimeter gate (Edge Middleware). Unauthenticated visitors are turned away at the curb without ever burdening terminal staff.',
        code: `// Simulation: Edge Middleware JWT Validation & Security Header Injection
interface EdgeRequest {
  url: string;
  headers: Map<string, string>;
}

interface EdgeResponse {
  status: number;
  headers: Map<string, string>;
  redirectUrl?: string;
}

function edgeMiddleware(req: EdgeRequest): EdgeResponse {
  const responseHeaders = new Map<string, string>();

  // 1. Mandatory Security Invariants: Injection of CSP & Frame Options
  responseHeaders.set('X-Content-Type-Options', 'nosniff');
  responseHeaders.set('X-Frame-Options', 'DENY');
  responseHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // 2. Authentication Check for protected routes
  if (req.url.startsWith('/dashboard')) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer valid_token_')) {
      return {
        status: 302,
        headers: responseHeaders,
        redirectUrl: '/login?error=unauthorized'
      };
    }
  }

  return { status: 200, headers: responseHeaders };
}

const guestReq: EdgeRequest = {
  url: '/dashboard/metrics',
  headers: new Map()
};

const authReq: EdgeRequest = {
  url: '/dashboard/metrics',
  headers: new Map([['authorization', 'Bearer valid_token_xyz']])
};

console.log('Guest Access Status:', edgeMiddleware(guestReq).status, '-> Redirect:', edgeMiddleware(guestReq).redirectUrl);
console.log('Authenticated Access Status:', edgeMiddleware(authReq).status);
console.log('Security Header Present:', edgeMiddleware(authReq).headers.get('X-Frame-Options'));`,
        output: `Guest Access Status: 302 -> Redirect: /login?error=unauthorized\nAuthenticated Access Status: 200\nSecurity Header Present: DENY`,
        tryIt: 'Add a rate-limiting check to edgeMiddleware that rejects requests after 5 attempts from the same IP.',
        check: {
          question: 'Why are Edge Middleware functions executed inside lightweight V8 isolates instead of full Node.js servers?',
          options: [
            'V8 isolates start in sub-millisecond time and use negligible memory, allowing them to run globally at edge points of presence with minimal latency',
            'Edge isolates are required to support older Internet Explorer browsers',
            'Full Node.js servers cannot execute JavaScript'
          ],
          answer: 0,
          why: 'V8 isolates avoid the memory footprint and slow cold starts of Node.js containers, making them ideal for high-throughput edge routing, token verification, and security header injection.'
        }
      }
    ],
    summary: [
      'React Server Components (RSC) execute exclusively on the server, keeping heavy npm dependencies out of the client JavaScript bundle.',
      'Streaming SSR leverages HTTP Chunked Transfer and <Suspense> to flush the fast layout shell immediately while streaming out-of-order data chunks.',
      'Server Actions provide progressive enhancement with native HTML forms, CSRF origin verification, and optimistic UI updates via useOptimistic.',
      'Request deduplication automatically consolidates duplicate fetch() and React.cache() calls within a single render pass without global state.',
      'Edge Middleware executes on global V8 isolates to enforce sub-millisecond security headers, JWT validation, and geographic redirects before origin execution.'
    ],
    projectStep: {
      title: 'Architect a Next.js App Router Page with RSC and Streaming',
      steps: [
        'Create a Server Component that loads data directly from a simulated database.',
        'Wrap slow analytical data cards in a <Suspense> boundary with a custom loading skeleton.',
        'Implement an interactive Client Component with a Server Action mutation and optimistic feedback.',
        'Verify that all identical API requests within the component tree are automatically deduplicated.'
      ]
    }
  },
  {
    coursePrefix: 'fullstack-js',
    day: 2,
    title: 'Streaming SSR Pipelines, Server Actions & Real-Time Event Architectures',
    goal: 'Master Next.js out-of-order streaming, optimistic Server Action rollbacks, Edge Middleware JWT routing, tRPC type-safe RPCs, and Server-Sent Events.',
    minutes: 45,
    recap: 'In Day 1, we explored React Server Components, the Flight wire protocol, Suspense boundaries, and request deduplication. Now we advance into production streaming pipelines, optimistic state machines, edge security layers, end-to-end typed APIs, and real-time push protocols.',
    parts: [
      {
        title: 'Next.js App Router Streaming SSR & Out-of-Order Flushing',
        say: [
          'Traditional server-side rendering (SSR) blocks the HTTP response until the entire React component tree has resolved every asynchronous data dependency. If a slow analytics dashboard takes 800ms, the entire page sits on a white screen for 800ms.',
          'Next.js App Router Streaming SSR transforms this into a progressive multi-phase delivery. The server immediately flushes the HTML shell—the layout, navigation bar, and Suspense fallback skeleton placeholders—to the browser within the first 5 milliseconds.',
          'Each Suspense boundary acts as an independent asynchronous stream partition. As individual data promises resolve, the server injects completed HTML chunks into the already-displayed page via HTTP Chunked Transfer Encoding. The browser replaces skeleton placeholders in-place without a full re-render.',
          'Critically, chunks flush out-of-order: if the recommendation feed resolves at 200ms while the analytics dashboard is still pending at 800ms, the feed content appears instantly. The user sees fast-loading sections immediately while heavy sections progressively appear.',
          'This parallelized streaming architecture means total page completion time equals the duration of the single slowest Suspense boundary, not the cumulative sum of all boundaries. In a page with three 200ms, 300ms, and 800ms data sources, total time is 805ms instead of 1,305ms.',
          'React hydration also benefits: the framework selectively hydrates completed chunks as they arrive rather than waiting for the full document, enabling interactive buttons and inputs to respond before slower sections even load.'
        ],
        example: 'Think of a restaurant serving a multi-course meal. Traditional SSR makes all guests wait until every course (appetizer, soup, main, dessert) is fully cooked before anyone receives anything. Streaming SSR sends the bread basket and salad (shell) immediately, then delivers each course to its table the moment it leaves the kitchen, regardless of which dish finishes first.',
        code: `// Simulation: Streaming SSR Out-of-Order Chunk Resolution Pipeline
interface StreamChunk {
  id: string;
  html: string;
  resolvedAtMs: number;
  order: number;
}

function simulateStreamingRender(
  components: { id: string; latencyMs: number; html: string }[]
): { shellFlushedAtMs: number; chunks: StreamChunk[]; totalTimeMs: number } {
  // Shell (layout + navigation + Suspense fallbacks) always flushes first at ~5ms
  const shellFlushedAtMs = 5;

  // Each Suspense boundary resolves independently after its latency
  const chunks: StreamChunk[] = components
    .map(c => ({
      id: c.id,
      html: c.html,
      resolvedAtMs: shellFlushedAtMs + c.latencyMs,
      order: 0
    }))
    .sort((a, b) => a.resolvedAtMs - b.resolvedAtMs)
    .map((chunk, idx) => ({ ...chunk, order: idx + 1 }));

  // Total render time = longest Suspense boundary (parallelized, not sequential)
  const totalTimeMs = Math.max(...chunks.map(c => c.resolvedAtMs));

  return { shellFlushedAtMs, chunks, totalTimeMs };
}

const result = simulateStreamingRender([
  { id: 'UserProfile', latencyMs: 20, html: '<div>Profile Card</div>' },
  { id: 'AnalyticsDashboard', latencyMs: 800, html: '<div>Charts Loaded</div>' },
  { id: 'RecommendationFeed', latencyMs: 200, html: '<div>AI Picks</div>' }
]);

const sequentialTotal = 5 + 20 + 800 + 200;

console.log('=== NEXT.JS STREAMING SSR & OUT-OF-ORDER FLUSHING ===');
console.log('Shell HTML Flushed to Browser: ' + result.shellFlushedAtMs + 'ms (Layout + Nav + Suspense Fallbacks)');
for (const chunk of result.chunks) {
  console.log('  Chunk ' + chunk.order + ': <' + chunk.id + '> resolved at ' + chunk.resolvedAtMs + 'ms');
}
console.log('Parallel Streaming Total: ' + result.totalTimeMs + 'ms vs Sequential Waterfall: ' + sequentialTotal + 'ms');
console.log('Speedup Factor: ' + (sequentialTotal / result.totalTimeMs).toFixed(1) + 'x (Out-of-Order Flush Parallelism)');`,
        output: `=== NEXT.JS STREAMING SSR & OUT-OF-ORDER FLUSHING ===\nShell HTML Flushed to Browser: 5ms (Layout + Nav + Suspense Fallbacks)\n  Chunk 1: <UserProfile> resolved at 25ms\n  Chunk 2: <RecommendationFeed> resolved at 205ms\n  Chunk 3: <AnalyticsDashboard> resolved at 805ms\nParallel Streaming Total: 805ms vs Sequential Waterfall: 1025ms\nSpeedup Factor: 1.3x (Out-of-Order Flush Parallelism)`,
        tryIt: 'Add a fourth component with 50ms latency and observe how it interleaves into the flush order.',
        check: {
          question: 'Why does Next.js Streaming SSR achieve faster perceived page loads compared to traditional SSR?',
          options: [
            'Streaming SSR compresses HTML with gzip before sending, reducing download time',
            'The server flushes the layout shell and Suspense fallbacks immediately, then streams completed data chunks out-of-order as each resolves independently',
            'Streaming SSR preloads all JavaScript bundles before rendering any HTML'
          ],
          answer: 1,
          why: 'Traditional SSR blocks the entire HTTP response until every data dependency completes. Streaming SSR flushes the shell instantly (5ms), then progressively injects resolved chunks via HTTP Chunked Transfer as each Suspense boundary completes, so the user sees fast content immediately while slow sections load in parallel.'
        }
      },
      {
        title: 'React Server Actions with Optimistic Rollback State',
        say: [
          'Server Actions are asynchronous functions marked with the "use server" directive that execute exclusively on the server. They can be invoked directly from Client Components without manually writing fetch calls, API routes, or REST endpoints.',
          'When a user clicks a like button, the network round-trip to the server might take 200 to 500 milliseconds. Without optimistic updates, the UI freezes with no visual feedback, creating a sluggish and unresponsive experience.',
          'React provides the useOptimistic hook to immediately update the displayed UI state with the expected outcome before the server response arrives. The optimistic value is a temporary display override that coexists alongside the confirmed ground-truth value.',
          'If the Server Action succeeds, the optimistic pending value is promoted to confirmed state. If the server rejects the mutation (validation failure, rate limit, or network error), the UI automatically rolls back to the previous confirmed value, ensuring data consistency.',
          'This pattern maintains a strict invariant: the displayValue always equals confirmedValue after resolution, guaranteeing no phantom UI states where a deleted item still appears or a liked post shows an incorrect count.',
          'Server Actions also provide progressive enhancement: when JavaScript fails to load, the form falls back to a native HTML form POST submission, maintaining full functionality for users on degraded connections.'
        ],
        example: 'Think of sending a text message on your phone. The moment you hit send, the message appears in the chat bubble immediately with a tiny clock icon (optimistic). If the network confirms delivery, a checkmark replaces the clock (confirmed). If the send fails due to airplane mode, the message shows a red exclamation and snaps back to the draft input (rollback).',
        code: `// Simulation: Optimistic State Machine with Confirm/Rollback Transitions
interface OptimisticState<T> {
  displayValue: T;
  pendingValue: T | null;
  confirmedValue: T;
  status: 'idle' | 'optimistic' | 'confirmed' | 'rolled-back';
}

function applyOptimistic<T>(state: OptimisticState<T>, optimisticValue: T): OptimisticState<T> {
  return {
    displayValue: optimisticValue,
    pendingValue: optimisticValue,
    confirmedValue: state.confirmedValue,
    status: 'optimistic'
  };
}

function confirmAction<T>(state: OptimisticState<T>): OptimisticState<T> {
  return {
    displayValue: state.pendingValue!,
    pendingValue: null,
    confirmedValue: state.pendingValue!,
    status: 'confirmed'
  };
}

function rollbackAction<T>(state: OptimisticState<T>): OptimisticState<T> {
  return {
    displayValue: state.confirmedValue,
    pendingValue: null,
    confirmedValue: state.confirmedValue,
    status: 'rolled-back'
  };
}

// Scenario: User likes a post (count goes from 42 to 43)
let likeState: OptimisticState<number> = {
  displayValue: 42,
  pendingValue: null,
  confirmedValue: 42,
  status: 'idle'
};

console.log('=== REACT SERVER ACTIONS: OPTIMISTIC ROLLBACK STATE ===');
console.log('Initial Like Count: ' + likeState.displayValue + ' (Status: ' + likeState.status + ')');

// Step 1: Optimistic update (instant UI feedback)
likeState = applyOptimistic(likeState, 43);
console.log('After Optimistic Apply: ' + likeState.displayValue + ' (Status: ' + likeState.status + ')');

// Step 2a: Server confirms
const confirmedState = confirmAction(likeState);
console.log('Server Confirmed: ' + confirmedState.displayValue + ' (Status: ' + confirmedState.status + ')');

// Step 2b: Alternate path — server rejects, rollback
const rolledBack = rollbackAction(likeState);
console.log('Server Rejected (Rollback): ' + rolledBack.displayValue + ' (Status: ' + rolledBack.status + ')');
console.log('UI Consistency Guarantee: DISPLAY === CONFIRMED = ' + (rolledBack.displayValue === rolledBack.confirmedValue));`,
        output: `=== REACT SERVER ACTIONS: OPTIMISTIC ROLLBACK STATE ===\nInitial Like Count: 42 (Status: idle)\nAfter Optimistic Apply: 43 (Status: optimistic)\nServer Confirmed: 43 (Status: confirmed)\nServer Rejected (Rollback): 42 (Status: rolled-back)\nUI Consistency Guarantee: DISPLAY === CONFIRMED = true`,
        tryIt: 'Implement a double-click guard that prevents applying a second optimistic update while one is still pending.',
        check: {
          question: 'What happens to the displayed UI value when a Server Action mutation fails and the optimistic update is rolled back?',
          options: [
            'The page crashes with an unhandled promise rejection error',
            'The displayValue reverts to the last confirmedValue, ensuring the user sees only server-verified data',
            'The optimistic value persists permanently as a stale phantom state'
          ],
          answer: 1,
          why: 'The rollback transition explicitly sets displayValue back to confirmedValue (the last server-verified ground truth). This guarantees the user never sees phantom states where the UI disagrees with the actual server database.'
        }
      },
      {
        title: 'Edge Middleware JWT Authentication & Geo-Routing',
        say: [
          'Edge Middleware in Next.js executes on globally distributed V8 isolate runtimes positioned at the CDN edge, physically close to end users. Middleware runs before any page rendering or API route execution, providing a sub-millisecond security and routing interception layer.',
          'The primary security use case is JSON Web Token (JWT) validation. When a request arrives, the middleware extracts the JWT from cookies or Authorization headers, verifies its cryptographic signature, and checks the expiration timestamp. Invalid or missing tokens trigger an immediate redirect to the login page without wasting origin server resources.',
          'Beyond authentication, Edge Middleware enables role-based access control (RBAC). Admin-only routes are protected by inspecting the role claim embedded in the JWT payload. A regular member attempting to access an admin panel is blocked with a 403 response.',
          'Geographic routing is another powerful capability. The middleware inspects the request geo object containing the visitor country and region codes. European Union visitors can be transparently rewritten to GDPR-compliant page variants without any client-side JavaScript or redirects.',
          'Because Edge Middleware executes on lightweight V8 isolates rather than full Node.js processes, cold start times are measured in single-digit milliseconds. This makes it suitable for latency-critical operations that must complete before the user perceives any page load.',
          'The middleware function returns a NextResponse object with four possible actions: allow (pass through), redirect (302 to login), rewrite (transparent URL rewriting), or block (403 forbidden).'
        ],
        example: 'Think of airport security checkpoints stationed at every terminal gate worldwide. Before passengers even reach the airline check-in counter (origin server), security agents verify passports (JWT tokens), check visa validity (expiration), deny entry to restricted VIP lounges (RBAC), and direct EU passport holders to the Schengen express lane (geo-routing).',
        code: `// Simulation: Edge Middleware JWT Validation & Geographic Routing Engine
interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

interface GeoInfo {
  country: string;
  region: string;
}

interface MiddlewareDecision {
  action: 'allow' | 'redirect' | 'rewrite' | 'block';
  destination?: string;
  reason: string;
}

function evaluateEdgeMiddleware(
  path: string,
  token: JwtPayload | null,
  nowSec: number,
  geo: GeoInfo
): MiddlewareDecision {
  // 1. Public routes bypass auth
  const publicRoutes = ['/', '/login', '/signup', '/api/health'];
  if (publicRoutes.includes(path)) {
    return { action: 'allow', reason: 'Public route — no auth required' };
  }

  // 2. Missing or expired token -> redirect to login
  if (!token) {
    return { action: 'redirect', destination: '/login?callback=' + encodeURIComponent(path), reason: 'No JWT token present' };
  }
  if (token.exp < nowSec) {
    return { action: 'redirect', destination: '/login?expired=1', reason: 'JWT expired at ' + token.exp };
  }

  // 3. Admin-only routes
  if (path.startsWith('/admin') && token.role !== 'admin') {
    return { action: 'block', reason: 'Insufficient role: ' + token.role + ' (requires admin)' };
  }

  // 4. Geo-rewrite for EU compliance
  const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL'];
  if (euCountries.includes(geo.country)) {
    return { action: 'rewrite', destination: '/eu' + path, reason: 'GDPR geo-rewrite for ' + geo.country };
  }

  return { action: 'allow', reason: 'Authenticated user ' + token.sub };
}

const now = 1700000000;
const validToken: JwtPayload = { sub: 'user_42', role: 'member', exp: now + 3600 };
const adminToken: JwtPayload = { sub: 'admin_1', role: 'admin', exp: now + 3600 };

const cases = [
  evaluateEdgeMiddleware('/', null, now, { country: 'US', region: 'CA' }),
  evaluateEdgeMiddleware('/dashboard', null, now, { country: 'US', region: 'CA' }),
  evaluateEdgeMiddleware('/dashboard', validToken, now, { country: 'DE', region: 'BY' }),
  evaluateEdgeMiddleware('/admin/users', validToken, now, { country: 'US', region: 'NY' }),
  evaluateEdgeMiddleware('/admin/users', adminToken, now, { country: 'US', region: 'NY' }),
];

console.log('=== EDGE MIDDLEWARE JWT AUTH & GEO-ROUTING ===');
const labels = ['Public /', 'Unauthed /dashboard', 'EU /dashboard', 'Member /admin', 'Admin /admin'];
cases.forEach((c, i) => {
  console.log(labels[i] + ': ' + c.action.toUpperCase() + (c.destination ? ' -> ' + c.destination : '') + ' (' + c.reason + ')');
});`,
        output: `=== EDGE MIDDLEWARE JWT AUTH & GEO-ROUTING ===\nPublic /: ALLOW (Public route — no auth required)\nUnauthed /dashboard: REDIRECT -> /login?callback=%2Fdashboard (No JWT token present)\nEU /dashboard: REWRITE -> /eu/dashboard (GDPR geo-rewrite for DE)\nMember /admin: BLOCK (Insufficient role: member (requires admin))\nAdmin /admin: ALLOW (Authenticated user admin_1)`,
        tryIt: 'Add an expired token test case and verify that the middleware redirects to /login?expired=1.',
        check: {
          question: 'Why is Edge Middleware particularly effective for JWT authentication compared to checking tokens inside API route handlers?',
          options: [
            'Edge Middleware runs on globally distributed CDN isolates with sub-millisecond cold starts, intercepting invalid requests before they consume origin server resources',
            'Edge Middleware can only validate tokens using RSA-512 encryption algorithms',
            'API route handlers cannot read cookies or Authorization headers from incoming requests'
          ],
          answer: 0,
          why: 'Edge Middleware executes on lightweight V8 isolates at the CDN edge, geographically close to the user. Invalid tokens are rejected in under 5ms without any request reaching the origin Node.js server, saving compute resources and reducing latency for authenticated paths.'
        }
      },
      {
        title: 'tRPC End-to-End Type-Safe Remote Procedure Calls',
        say: [
          'Traditional REST APIs require developers to manually synchronize TypeScript types between the frontend client and backend server. When a backend engineer changes an API response shape, the frontend continues compiling without errors until runtime crashes expose the mismatch.',
          'tRPC (TypeScript Remote Procedure Calls) solves this by sharing a single TypeScript type definition across both the server router and the client caller. The server defines procedure resolvers with strongly typed input and output schemas. The client automatically infers these exact types through TypeScript generics without any code generation step.',
          'A tRPC router organizes procedures into two categories: queries (read-only data fetching, similar to HTTP GET) and mutations (write operations, similar to HTTP POST/PUT). Each procedure declares its input validation schema (typically using Zod) and output return type.',
          'When the frontend calls trpc.user.getById.useQuery({ id: "u42" }), TypeScript statically verifies that the input object matches the server schema and that the returned data conforms to the declared output type. Any schema mismatch triggers a compile-time error, not a runtime crash.',
          'Unlike GraphQL, which requires a separate schema definition language (SDL), code generation tools, and resolver mapping, tRPC achieves full end-to-end type safety using only standard TypeScript inference and generics with zero build step overhead.',
          'tRPC integrates seamlessly with React Query on the client side, providing automatic caching, stale-while-revalidate patterns, and optimistic updates while maintaining the same type-safe guarantees across the entire request lifecycle.'
        ],
        example: 'Think of an international postal system with two countries that speak different languages. REST APIs are like writing letters in your local language and hoping the recipient can translate them correctly (runtime type mismatch). tRPC is like both countries agreeing to use a single universal language contract: if your letter does not follow the exact grammar and vocabulary of that contract, the post office rejects it before it even leaves your mailbox (compile-time error).',
        code: `// Simulation: tRPC Router Definition with Compile-Time Type Inference
interface TrpcProcedure<TInput, TOutput> {
  path: string;
  type: 'query' | 'mutation';
  inputSchema: string;
  outputSchema: string;
  execute: (input: TInput) => TOutput;
}

function defineQuery<TInput, TOutput>(
  path: string,
  inputDesc: string,
  outputDesc: string,
  resolver: (input: TInput) => TOutput
): TrpcProcedure<TInput, TOutput> {
  return { path, type: 'query', inputSchema: inputDesc, outputSchema: outputDesc, execute: resolver };
}

function defineMutation<TInput, TOutput>(
  path: string,
  inputDesc: string,
  outputDesc: string,
  resolver: (input: TInput) => TOutput
): TrpcProcedure<TInput, TOutput> {
  return { path, type: 'mutation', inputSchema: inputDesc, outputSchema: outputDesc, execute: resolver };
}

// Define router procedures
const getUser = defineQuery<{ id: string }, { name: string; email: string }>(
  'user.getById',
  '{ id: string }',
  '{ name: string; email: string }',
  (input) => ({ name: 'Alice', email: 'alice@' + input.id + '.com' })
);

const createPost = defineMutation<{ title: string; body: string }, { postId: string; createdAt: string }>(
  'post.create',
  '{ title: string; body: string }',
  '{ postId: string; createdAt: string }',
  (input) => ({ postId: 'post_' + input.title.length, createdAt: '2026-01-15T12:00:00Z' })
);

// Execute type-safe calls
const userResult = getUser.execute({ id: 'u42' });
const postResult = createPost.execute({ title: 'Hello tRPC', body: 'End-to-end types!' });

console.log('=== tRPC END-TO-END TYPE-SAFE RPC ===');
console.log('Router Procedure: ' + getUser.path + ' [' + getUser.type + ']');
console.log('  Input Schema:  ' + getUser.inputSchema);
console.log('  Output Schema: ' + getUser.outputSchema);
console.log('  Result: ' + JSON.stringify(userResult));
console.log('Router Procedure: ' + createPost.path + ' [' + createPost.type + ']');
console.log('  Input Schema:  ' + createPost.inputSchema);
console.log('  Output Schema: ' + createPost.outputSchema);
console.log('  Result: ' + JSON.stringify(postResult));
console.log('Type Safety: ZERO runtime schema validation needed — TypeScript infers I/O at compile time');`,
        output: `=== tRPC END-TO-END TYPE-SAFE RPC ===\nRouter Procedure: user.getById [query]\n  Input Schema:  { id: string }\n  Output Schema: { name: string; email: string }\n  Result: {"name":"Alice","email":"alice@u42.com"}\nRouter Procedure: post.create [mutation]\n  Input Schema:  { title: string; body: string }\n  Output Schema: { postId: string; createdAt: string }\n  Result: {"postId":"post_10","createdAt":"2026-01-15T12:00:00Z"}\nType Safety: ZERO runtime schema validation needed — TypeScript infers I/O at compile time`,
        tryIt: 'Add a deletePost mutation that takes a postId string input and returns a boolean success flag.',
        check: {
          question: 'What is the key architectural advantage of tRPC over traditional REST API clients in TypeScript projects?',
          options: [
            'tRPC automatically generates OpenAPI documentation for all endpoints',
            'tRPC shares a single TypeScript type definition between server and client, catching schema mismatches at compile time instead of runtime',
            'tRPC encrypts all request payloads with AES-256 by default'
          ],
          answer: 1,
          why: 'tRPC uses TypeScript generics to infer the exact input and output types from the server router definition. The client call site statically verifies type compatibility at compile time, eliminating the entire class of runtime errors caused by API schema drift between frontend and backend.'
        }
      },
      {
        title: 'Server-Sent Events (SSE) Real-Time Streaming Protocol',
        say: [
          'Server-Sent Events (SSE) is a W3C-standardized protocol for unidirectional real-time data streaming from server to client over a persistent HTTP connection. Unlike WebSockets, which require a protocol upgrade handshake and bidirectional framing, SSE operates over plain HTTP/1.1 or HTTP/2 with the Content-Type header set to text/event-stream.',
          'Each SSE event is a plain-text frame consisting of optional fields: id (a unique monotonically increasing event identifier), event (a named channel like price-update or trade-alert), data (the JSON payload), and retry (the client reconnection interval in milliseconds).',
          'Events are delimited by double newline characters. The browser EventSource API automatically parses these fields and dispatches JavaScript events to registered listeners, providing a clean event-driven programming model.',
          'The most powerful feature of SSE is automatic reconnection with event replay. When the network connection drops, the browser EventSource automatically reconnects and sends the Last-Event-ID HTTP header containing the id of the last successfully received event. The server uses this cursor to replay all missed events, guaranteeing at-least-once delivery.',
          'SSE is ideal for use cases that require server-to-client push without client-to-server messaging: live stock price tickers, notification feeds, AI chat token streaming, build log tailing, and real-time dashboard metric updates.',
          'Compared to WebSockets, SSE has significant operational advantages: it works through corporate proxies and firewalls (plain HTTP), supports HTTP/2 multiplexing without head-of-line blocking, and requires zero custom protocol negotiation.'
        ],
        example: 'Think of a radio broadcast station. The station (server) continuously transmits weather updates, news alerts, and music tracks over a single FM frequency (HTTP connection). Your car radio (browser EventSource) tunes into the frequency and receives updates passively. If you drive through a tunnel (network drop), your radio automatically re-tunes when you exit and the station replays any alerts you missed (Last-Event-ID reconnection).',
        code: `// Simulation: Server-Sent Events (SSE) Protocol Framing & Reconnection Replay
interface SseEvent {
  id: string;
  event: string;
  data: string;
  retry?: number;
}

function formatSsePayload(events: SseEvent[]): string {
  return events.map(e => {
    let payload = '';
    if (e.id) payload += 'id: ' + e.id + '\\n';
    if (e.event) payload += 'event: ' + e.event + '\\n';
    payload += 'data: ' + e.data + '\\n';
    if (e.retry !== undefined) payload += 'retry: ' + e.retry + '\\n';
    payload += '\\n'; // Double newline terminates event
    return payload;
  }).join('');
}

function simulateSseReconnection(
  lastEventId: string | null,
  allEvents: SseEvent[]
): { missedEvents: number; resumeFromId: string | null; catchUpPayload: string } {
  if (!lastEventId) {
    return { missedEvents: 0, resumeFromId: null, catchUpPayload: '' };
  }

  const lastIdx = allEvents.findIndex(e => e.id === lastEventId);
  if (lastIdx === -1 || lastIdx === allEvents.length - 1) {
    return { missedEvents: 0, resumeFromId: lastEventId, catchUpPayload: '' };
  }

  const missed = allEvents.slice(lastIdx + 1);
  return {
    missedEvents: missed.length,
    resumeFromId: lastEventId,
    catchUpPayload: formatSsePayload(missed)
  };
}

const eventLog: SseEvent[] = [
  { id: 'evt-1', event: 'price-update', data: '{"symbol":"AAPL","price":185.42}' },
  { id: 'evt-2', event: 'price-update', data: '{"symbol":"GOOGL","price":142.10}' },
  { id: 'evt-3', event: 'trade-alert', data: '{"action":"BUY","qty":100}', retry: 3000 },
  { id: 'evt-4', event: 'price-update', data: '{"symbol":"AAPL","price":185.87}' },
];

// Client disconnected after evt-2, reconnects with Last-Event-ID: evt-2
const reconnect = simulateSseReconnection('evt-2', eventLog);

console.log('=== SERVER-SENT EVENTS (SSE) REAL-TIME STREAMING ===');
console.log('Total Events in Server Log: ' + eventLog.length);
console.log('Client Reconnects with Last-Event-ID: ' + reconnect.resumeFromId);
console.log('Missed Events During Disconnect: ' + reconnect.missedEvents);
console.log('Catch-Up Protocol: HTTP GET with Last-Event-ID header -> server replays from evt-3');
console.log('Content-Type: text/event-stream (Unidirectional Server-to-Client Push)');`,
        output: `=== SERVER-SENT EVENTS (SSE) REAL-TIME STREAMING ===\nTotal Events in Server Log: 4\nClient Reconnects with Last-Event-ID: evt-2\nMissed Events During Disconnect: 2\nCatch-Up Protocol: HTTP GET with Last-Event-ID header -> server replays from evt-3\nContent-Type: text/event-stream (Unidirectional Server-to-Client Push)`,
        tryIt: 'Implement a server-side event log with a maximum buffer size of 1000 events and a ring-buffer eviction policy.',
        check: {
          question: 'How does the Server-Sent Events (SSE) protocol guarantee at-least-once delivery after a network disconnection?',
          options: [
            'SSE stores all events in the browser localStorage and replays them on page refresh',
            'The browser EventSource automatically reconnects and sends the Last-Event-ID header, allowing the server to replay all events after that cursor position',
            'SSE uses TCP retransmission at the transport layer to guarantee delivery without application-level logic'
          ],
          answer: 1,
          why: 'When the SSE connection drops, the browser EventSource API automatically re-establishes the connection and includes the Last-Event-ID HTTP header. The server uses this monotonic cursor to seek into its event log and replay all events the client missed, providing application-level at-least-once delivery semantics.'
        }
      }
    ],
    summary: [
      'Next.js Streaming SSR flushes the HTML shell instantly and progressively streams Suspense chunk resolutions out-of-order via HTTP Chunked Transfer.',
      'React Server Actions with useOptimistic provide instant UI feedback; confirmed transitions promote the pending value while failures rollback to confirmedValue.',
      'Edge Middleware runs on CDN V8 isolates for sub-millisecond JWT validation, RBAC enforcement, and geographic URL rewrites before origin execution.',
      'tRPC shares TypeScript types between server router and client caller, catching API schema mismatches at compile time instead of runtime.',
      'Server-Sent Events (SSE) stream unidirectional server-to-client events over plain HTTP with automatic reconnection and Last-Event-ID replay for at-least-once delivery.'
    ],
    projectStep: {
      title: 'Build a Real-Time Dashboard with Streaming SSR, Server Actions & SSE',
      steps: [
        'Create a Next.js page with three Suspense boundaries that resolve at different latencies to demonstrate out-of-order streaming.',
        'Implement a Server Action mutation with optimistic UI feedback and rollback on validation failure.',
        'Write Edge Middleware that validates JWT tokens and geo-rewrites EU traffic to GDPR-compliant routes.',
        'Set up a tRPC router with query and mutation procedures and verify compile-time type safety on the client.',
        'Implement an SSE endpoint that streams real-time price updates with Last-Event-ID reconnection support.'
      ]
    }
  }
];

