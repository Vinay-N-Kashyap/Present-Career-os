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
  },
  {
    coursePrefix: 'fullstack-js',
    day: 3,
    title: 'Production Infrastructure: WebSockets, Redis Sessions, Connection Pools & Rate Limiting',
    goal: 'Master enterprise backend infrastructure: bidirectional WebSockets with heartbeats and backpressure, distributed Redis session storage with sliding TTL, PostgreSQL connection pool management and deadlock recovery, defense-in-depth web security with CSP nonces and CORS preflight, and Token Bucket rate limiting with HTTP 429 throttling headers.',
    minutes: 45,
    recap: 'In Day 1, we mastered React Server Components, streaming hydration, and state normalization. In Day 2, we conquered Streaming SSR Suspense boundaries, optimistic Server Actions, Edge JWT middleware, tRPC, and Server-Sent Events. Now in Day 3, we build enterprise infrastructure: bidirectional WebSockets, distributed Redis sessions, PostgreSQL connection pooling, web security headers, and distributed rate limiting.',
    parts: [
      {
        title: 'Bidirectional WebSockets, Heartbeats & Backpressure Management',
        say: [
          'While Server-Sent Events excel at unidirectional server push, interactive real-time applications such as collaborative documents, trading desks, and multiplayer games require full-duplex bidirectional communication over WebSockets (RFC 6455).',
          'A WebSocket connection begins as a standard HTTP/1.1 request that negotiates an Upgrade handshake with HTTP 101 Switching Protocols. Once established, both client and server can transmit lightweight text or binary frames with minimal frame header overhead.',
          'In production environments, persistent TCP connections face silent network disconnects caused by intermediate NAT gateways, corporate firewalls, and mobile carrier handoffs dropping idle connections without transmitting TCP FIN packets.',
          'To detect dead connections (zombie peers), enterprise WebSocket servers implement periodic Ping/Pong heartbeats. If a client fails to return a PONG frame before the next heartbeat cycle, the server forcibly terminates the connection to reclaim memory and file descriptors.',
          'Furthermore, high-throughput servers must manage Socket Backpressure: when a server pushes messages faster than a slow mobile client can consume them over TCP, buffered frames accumulate in the OS network buffer.',
          'If the server continues queueing messages unchecked, process memory explodes into an Out-Of-Memory (OOM) crash. Production engines monitor socket.bufferedAmount and pause message draining whenever buffers exceed high-watermark thresholds.'
        ],
        example: 'Think of a high-pressure fire hose connection. The initial coupling handshake clicks the hose onto the fire hydrant (HTTP 101 Upgrade). A small pulse sensor vibrates the nozzle every 30 seconds to confirm the line is still open (Ping/Pong heartbeat). If water pressure builds up faster than the nozzle operator can spray it (backpressure), the intake valve automatically throttles the flow to prevent the hose from bursting (pausing writes when bufferedAmount exceeds threshold).',
        code: `// Simulation: WebSocket Heartbeat Invariant & Backpressure Handling
interface WsConnection {
  id: string;
  isAlive: boolean;
  bufferedAmount: number; // bytes in queue
  maxBufferThreshold: number;
}

class WebSocketServerSimulator {
  private clients: Map<string, WsConnection> = new Map();

  connect(id: string): WsConnection {
    const conn: WsConnection = {
      id,
      isAlive: true,
      bufferedAmount: 0,
      maxBufferThreshold: 64 * 1024 // 64 KB
    };
    this.clients.set(id, conn);
    return conn;
  }

  // Heartbeat ping-pong audit
  heartbeatCheck(): { aliveCount: number; terminatedCount: number } {
    let aliveCount = 0;
    let terminatedCount = 0;
    for (const [id, conn] of this.clients.entries()) {
      if (!conn.isAlive) {
        this.clients.delete(id);
        terminatedCount++;
      } else {
        conn.isAlive = false; // Mark false; client must respond with PONG before next tick
        aliveCount++;
      }
    }
    return { aliveCount, terminatedCount };
  }

  pong(id: string) {
    const conn = this.clients.get(id);
    if (conn) conn.isAlive = true;
  }

  send(id: string, payloadBytes: number): { sent: boolean; backpressureTriggered: boolean } {
    const conn = this.clients.get(id);
    if (!conn) return { sent: false, backpressureTriggered: false };
    if (conn.bufferedAmount + payloadBytes > conn.maxBufferThreshold) {
      return { sent: false, backpressureTriggered: true }; // Pause draining to avoid OOM
    }
    conn.bufferedAmount += payloadBytes;
    return { sent: true, backpressureTriggered: false };
  }
}

const ws = new WebSocketServerSimulator();
ws.connect('client-alpha');
ws.connect('client-zombie');

// Tick 1: Ping sent to both
ws.heartbeatCheck();
// Only alpha responds with PONG
ws.pong('client-alpha');

// Tick 2: Zombie has not responded -> evicted
const audit2 = ws.heartbeatCheck();
// Keep alpha alive for message transmission
ws.pong('client-alpha');

const backpressureTest = ws.send('client-alpha', 70 * 1024);

console.log('=== WEBSOCKETS HEARTBEAT & BACKPRESSURE INVARIANTS ===');
console.log('Active Clients Monitored: 2');
console.log('Dead Connection Evicted: Zombie client terminated after ping timeout (' + audit2.terminatedCount + ' dropped)');
console.log('High-Watermark Backpressure: ' + (backpressureTest.backpressureTriggered ? 'PAUSED (Socket buffer limit exceeded)' : 'NORMAL'));`,
        output: `=== WEBSOCKETS HEARTBEAT & BACKPRESSURE INVARIANTS ===\nActive Clients Monitored: 2\nDead Connection Evicted: Zombie client terminated after ping timeout (1 dropped)\nHigh-Watermark Backpressure: PAUSED (Socket buffer limit exceeded)`,
        tryIt: 'Simulate client-alpha draining its buffer back to 0 bytes and verify that subsequent messages are delivered without backpressure.',
        check: {
          question: 'What catastrophic failure occurs if a WebSocket server ignores socket.bufferedAmount and continues writing to a slow client?',
          options: [
            'The client browser switches to HTTP/1.0 mode',
            'Unsent messages accumulate indefinitely in server process RAM until the Node.js process crashes with an Out-Of-Memory (OOM) error',
            'The database immediately drops all foreign key constraints'
          ],
          answer: 1,
          why: 'When a client receives data slower than the server produces it, TCP flow control stalls writes and the Node.js runtime buffers unsent frames in process heap. Without backpressure throttling based on bufferedAmount, memory usage climbs monotonically to an OOM crash.'
        }
      },
      {
        title: 'Redis Distributed Session Store & Sliding TTL Expiration',
        say: [
          'In monolithic architectures, user sessions were frequently stored in local server RAM. However, modern cloud architectures deploy dozens of stateless backend container instances behind load balancers, making local in-memory session state unviable.',
          'Storing session tokens in a centralized in-memory datastore like Redis provides sub-millisecond session validation while enabling any backend container to service any incoming HTTP request.',
          'Unlike stateless JWTs—which cannot be revoked until their expiration timestamp passes without maintaining a distributed denylist—Redis session stores provide instantaneous server-side session revocation across all nodes.',
          'To balance security with user convenience, production systems implement Sliding Window Expiration: every time an authenticated user makes a valid API request, the server executes an EXPIRE command to reset the session TTL back to 30 minutes.',
          'Furthermore, Redis enables enterprise session concurrency limits: by maintaining a Redis Set of active session IDs per user, the system can enforce policies like "maximum 2 concurrent logins," automatically evicting the oldest session when a user signs in on a new device.',
          'This architecture neutralizes session hijacking risks and prevents zombie sessions from consuming memory indefinitely.'
        ],
        example: 'Think of an office keycard access system. When you badge into a door (valid API request), the security guard resets your 30-minute hall pass timer (sliding TTL refresh). If you leave your desk and the timer hits 0 without activity, the card automatically deactivates (session expiration). If you register a third badge when company policy only allows two, the security desk automatically revokes your oldest badge (session concurrency limit).',
        code: `// Simulation: Redis Distributed Session Store & Sliding TTL Expiration
interface UserSession {
  sessionId: string;
  userId: string;
  role: string;
  createdAt: number;
  lastAccessedAt: number;
  expiresAt: number;
}

class RedisSessionStoreSimulator {
  private sessions: Map<string, UserSession> = new Map();
  private userIndex: Map<string, Set<string>> = new Map();
  private defaultTtlSeconds: number;
  private maxSessionsPerUser: number;
  private counter: number = 1;

  constructor(ttlSeconds = 1800, maxSessions = 3) {
    this.defaultTtlSeconds = ttlSeconds;
    this.maxSessionsPerUser = maxSessions;
  }

  createSession(userId: string, role: string, now: number): string {
    const sessionId = 'sess_' + userId + '_v' + (this.counter++);
    const existing = this.userIndex.get(userId) || new Set<string>();

    // Enforce max session concurrency limit (evict oldest)
    if (existing.size >= this.maxSessionsPerUser) {
      const oldestId = Array.from(existing)[0];
      this.sessions.delete(oldestId);
      existing.delete(oldestId);
    }

    const session: UserSession = {
      sessionId,
      userId,
      role,
      createdAt: now,
      lastAccessedAt: now,
      expiresAt: now + this.defaultTtlSeconds
    };

    this.sessions.set(sessionId, session);
    existing.add(sessionId);
    this.userIndex.set(userId, existing);
    return sessionId;
  }

  // Sliding TTL renewal on valid request
  touchSession(sessionId: string, now: number): UserSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (now > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }
    session.lastAccessedAt = now;
    session.expiresAt = now + this.defaultTtlSeconds; // Sliding window extension
    return session;
  }
}

const redis = new RedisSessionStoreSimulator(1800, 2);
const t0 = 1700000000;
const s1 = redis.createSession('usr_101', 'admin', t0);
const s2 = redis.createSession('usr_101', 'admin', t0 + 60);
const s3 = redis.createSession('usr_101', 'admin', t0 + 120); // Should evict s1 (max 2 sessions)

const touched = redis.touchSession(s2, t0 + 300);

console.log('=== REDIS DISTRIBUTED SESSION STORE & SLIDING TTL ===');
console.log('Session Created: ' + s2);
console.log('Sliding Window TTL Extended: New ExpiresAt = +' + (touched ? touched.expiresAt - t0 : 0) + 's');
console.log('Concurrent Session Limit (Max 2): Evicted oldest session s1 -> ' + (redis.touchSession(s1, t0 + 300) === null ? 'EXPIRED/EVICTED' : 'ACTIVE'));`,
        output: `=== REDIS DISTRIBUTED SESSION STORE & SLIDING TTL ===\nSession Created: sess_usr_101_v2\nSliding Window TTL Extended: New ExpiresAt = +2100s\nConcurrent Session Limit (Max 2): Evicted oldest session s1 -> EXPIRED/EVICTED`,
        tryIt: 'Query session s3 and confirm it is active with 1800 seconds remaining from t0 + 120.',
        check: {
          question: 'Why is a distributed Redis session store superior to stateless JWTs for enterprise security compliance?',
          options: [
            'Redis encrypts data using quantum cryptographic keys',
            'Redis sessions can be revoked instantly on the server side across all nodes upon logout or security breach, whereas JWTs remain valid until exp timestamp',
            'Redis does not require any network connections'
          ],
          answer: 1,
          why: 'Stateless JWTs cannot be revoked prior to expiration without maintaining a distributed denylist. Redis stores session state centrally, allowing instantaneous revocation, device eviction, and sliding expiration across all backend server nodes.'
        }
      },
      {
        title: 'Database Connection Pooling & Deadlock Recovery',
        say: [
          'Opening a physical TCP connection to a PostgreSQL database is computationally expensive: it involves TCP three-way handshakes, TLS negotiation, authentication, process forking, and memory allocation for backend workers.',
          'If a web server opened a new database connection for every incoming HTTP request, the database server would quickly exhaust its connection limit, thrash CPU cores in process scheduling, and collapse under connection storms.',
          'Database connection pools (such as pg.Pool in Node.js or HikariCP in Java) maintain a pre-allocated pool of warm, reusable database connections. Application threads borrow an active connection, execute a query or transaction, and return the connection to the pool immediately upon completion.',
          'Sizing a connection pool follows Little’s Law and hardware queuing theory: counterintuitively, smaller connection pools (such as 10–20 connections per server node) often yield higher throughput and lower latency than pools of 200 connections, because they prevent disk I/O and CPU context switching saturation.',
          'In concurrent relational workloads, conflicting transactional row locks can result in Deadlocks (PostgreSQL error code 40P01). When two transactions each hold a lock the other requires, the database deadlock detector terminates one transaction with a serialization failure.',
          'Production backend services wrap database transactions in automated retry handlers with exponential backoff and randomized jitter, allowing the aborted transaction to replay cleanly once the competing transaction commits.'
        ],
        example: 'Think of taxi cabs waiting outside an airport terminal. If every arriving passenger had to purchase their own new car from a dealership (opening a raw DB connection), the airport would instantly gridlock. Instead, passengers queue for a fleet of 20 shared taxis (connection pool). As soon as one passenger reaches their destination, the cab immediately returns to the airport for the next rider.',
        code: `// Simulation: Database Connection Pooling & Automated Deadlock Recovery
class PgConnectionPoolSimulator {
  private maxConnections: number;
  private activeConnections: number = 0;
  private idleConnections: number = 0;

  constructor(maxConns: number) {
    this.maxConnections = maxConns;
    this.idleConnections = maxConns;
  }

  acquire(): { release: () => void } {
    if (this.idleConnections <= 0) {
      throw new Error('Connection pool exhausted: max ' + this.maxConnections + ' in use');
    }
    this.idleConnections--;
    this.activeConnections++;
    let released = false;
    return {
      release: () => {
        if (!released) {
          released = true;
          this.activeConnections--;
          this.idleConnections++;
        }
      }
    };
  }

  // Execute query with automatic deadlock retry (PostgreSQL 40P01)
  executeWithRetry<T>(
    operation: (attempt: number) => { success: boolean; errorCode?: string; result?: T },
    maxRetries = 3
  ): { result: T | null; attempts: number; recoveredFromDeadlock: boolean } {
    let recovered = false;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const conn = this.acquire();
      try {
        const op = operation(attempt);
        if (op.success && op.result !== undefined) {
          return { result: op.result, attempts: attempt, recoveredFromDeadlock: recovered };
        }
        if (op.errorCode === '40P01') {
          recovered = true;
          // In real DB, sleep with exponential backoff & jitter
          continue;
        }
        throw new Error('Unrecoverable DB Error: ' + op.errorCode);
      } finally {
        conn.release();
      }
    }
    throw new Error('Max retries exceeded');
  }
}

const pool = new PgConnectionPoolSimulator(10);
let simulatedDbAttempt = 0;
const txResult = pool.executeWithRetry<string>((attempt) => {
  simulatedDbAttempt++;
  if (simulatedDbAttempt === 1) {
    return { success: false, errorCode: '40P01' }; // PostgreSQL deadlock error
  }
  return { success: true, result: 'TX_COMMITTED_LEDGER_BALANCE_UPDATED' };
});

console.log('=== DATABASE CONNECTION POOLING & DEADLOCK RECOVERY ===');
console.log('Pool Status: Active 0, Idle 10 (Connections returned cleanly)');
console.log('Deadlock Recovery: ' + (txResult.recoveredFromDeadlock ? 'DETECTED 40P01 & RETRIED SUCCESSFULLY' : 'FAILED'));
console.log('Transaction Result: ' + txResult.result + ' (Took ' + txResult.attempts + ' attempts)');`,
        output: `=== DATABASE CONNECTION POOLING & DEADLOCK RECOVERY ===\nPool Status: Active 0, Idle 10 (Connections returned cleanly)\nDeadlock Recovery: DETECTED 40P01 & RETRIED SUCCESSFULLY\nTransaction Result: TX_COMMITTED_LEDGER_BALANCE_UPDATED (Took 2 attempts)`,
        tryIt: 'Trigger a connection pool exhaustion error by calling acquire() 11 times without calling release().',
        check: {
          question: 'What is the purpose of wrapping database transactions in a retry loop when encountering PostgreSQL error 40P01?',
          options: [
            '40P01 signifies a syntax error in the SQL string',
            '40P01 indicates a Deadlock Detected abort, which is transient and will succeed when retried after competing transactions release their locks',
            '40P01 indicates that the hard drive is completely full'
          ],
          answer: 1,
          why: 'PostgreSQL error code 40P01 indicates that the database deadlock detector aborted the transaction to break a circular lock dependency. Because the condition is transient, retrying with exponential backoff allows the transaction to succeed once the competing transaction commits.'
        }
      },
      {
        title: 'Web Security Hardening: Content Security Policy (CSP) & CORS Preflight',
        say: [
          'Web application security requires defense-in-depth at the HTTP protocol layer to protect users against Cross-Site Scripting (XSS), clickjacking, and cross-origin data exfiltration.',
          'Content Security Policy (CSP) is an HTTP response header that restricts which scripts, styles, images, and frames the browser is permitted to execute or render on the page.',
          'Modern CSP implementations utilize Cryptographic Nonces: the server generates a cryptographically random, single-use base64 token per HTTP request and includes it in the header: script-src \'self\' \'nonce-{token}\' \'strict-dynamic\'.',
          'Any inline <script> tag injected by an attacker via stored or reflected XSS will lack the secret nonce and will be blocked instantly by the browser execution engine, completely defusing XSS attacks.',
          'Cross-Origin Resource Sharing (CORS) governs how browsers enforce the Same-Origin Policy (SOP). When an application frontend at https://app.pinit.os sends a fetch request to an API at https://api.pinit.os with custom headers or credentials, the browser first issues an HTTP OPTIONS Preflight request.',
          'The server must validate the incoming Origin against an allowed whitelist and respond with Access-Control-Allow-Origin and Access-Control-Allow-Credentials: true. Crucially, browsers reject credentials if the server responds with a wildcard (*), enforcing strict origin specificity.'
        ],
        example: 'Think of a VIP concert backstage pass. A generic sign saying "Anyone welcome" (*) will never grant access to private dressing rooms (credentials blocked). Instead, security guards inspect your personalized wristband with today\'s unique hologram stamp (cryptographic CSP nonce). If a counterfeit badge lacks today\'s stamp, the guards immediately bar entry at the door.',
        code: `// Simulation: Defense-in-Depth Web Security (CSP Nonce & CORS Preflight)
class SecurityHeadersSimulator {
  generateCspHeader(nonce: string): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'nonce-" + nonce + "' 'strict-dynamic'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "frame-ancestors 'none'",
      "base-uri 'self'"
    ].join('; ');
  }

  handleCorsPreflight(
    requestOrigin: string,
    allowedOrigins: string[]
  ): { status: number; headers: Record<string, string> } {
    if (!allowedOrigins.includes(requestOrigin)) {
      return { status: 403, headers: {} };
    }
    return {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': requestOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
      }
    };
  }
}

const sec = new SecurityHeadersSimulator();
const nonce = 'rAnd0mN0nc3Str1ng';
const cspHeader = sec.generateCspHeader(nonce);
const corsResponse = sec.handleCorsPreflight('https://app.pinit.os', [
  'https://app.pinit.os',
  'https://dashboard.pinit.os'
]);

console.log('=== WEB SECURITY: CSP NONCE & CORS PREFLIGHT ===');
console.log('CSP Nonce Directives: ' + cspHeader.split('; ')[1]);
console.log('CORS Preflight Status: ' + corsResponse.status + ' No Content');
console.log('Access-Control-Allow-Origin: ' + corsResponse.headers['Access-Control-Allow-Origin']);
console.log('Access-Control-Allow-Credentials: ' + corsResponse.headers['Access-Control-Allow-Credentials']);`,
        output: `=== WEB SECURITY: CSP NONCE & CORS PREFLIGHT ===\nCSP Nonce Directives: script-src 'self' 'nonce-rAnd0mN0nc3Str1ng' 'strict-dynamic'\nCORS Preflight Status: 204 No Content\nAccess-Control-Allow-Origin: https://app.pinit.os\nAccess-Control-Allow-Credentials: true`,
        tryIt: 'Send an origin like https://malicious-site.com and verify that handleCorsPreflight returns HTTP 403 Forbidden.',
        check: {
          question: 'Why does the browser refuse to send cookies/credentials if the server responds to a CORS request with Access-Control-Allow-Origin: *?',
          options: [
            'Because the browser treats wildcard credentials as an insecure configuration that would allow any malicious third-party site to steal authenticated user sessions',
            'Because wildcards are not valid characters in ASCII',
            'Because the server will crash if it receives an asterisk'
          ],
          answer: 0,
          why: 'The W3C CORS specification forbids combining Access-Control-Allow-Credentials: true with a wildcard origin (*). If permitted, any arbitrary website on the internet could perform credentialed requests against private user data.'
        }
      },
      {
        title: 'Token Bucket Rate Limiting & Distributed Throttling',
        say: [
          'To protect API gateways and backend microservices against Denial of Service (DDoS), credential stuffing, and scraping, systems implement algorithmic Rate Limiting.',
          'Among rate limiting algorithms—including Fixed Window Counter, Sliding Window Log, and Leaky Bucket—the Token Bucket algorithm is the enterprise standard adopted by AWS, Stripe, and Cloudflare.',
          'A token bucket is defined by two parameters: Burst Capacity (the maximum number of tokens the bucket can hold) and Refill Rate (the rate at which tokens accumulate per second).',
          'When an incoming API request arrives, the algorithm calculates how many tokens have accumulated since the last request based on elapsed time: tokens = min(capacity, tokens + elapsedSec * refillRate).',
          'If enough tokens are present, the request consumes tokens and proceeds immediately, allowing bursts of legitimate user traffic without artificial latency.',
          'When the bucket is exhausted, the server rejects the request with HTTP 429 Too Many Requests and attaches standard RFC 6585 headers: X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After: {seconds}, instructing the client exactly when it may safely retry.'
        ],
        example: 'Think of an arcade ticket dispenser. The machine starts with a roll of 5 tickets (burst capacity). Every second, the machine prints 1 new ticket (refill rate). If you want to play a game requiring 3 tickets, you hand them over immediately. If you try to play three games back-to-back in half a second, the tickets run out and the machine displays "Please wait 2 seconds before inserting more coins" (HTTP 429 with Retry-After).',
        code: `// Simulation: Token Bucket Rate Limiting & HTTP 429 Throttling
class TokenBucketRateLimiter {
  private capacity: number;
  private refillRatePerSec: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(capacity: number, refillRatePerSec: number) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefillTimestamp = 0;
  }

  consume(cost = 1, currentTimestamp: number): {
    allowed: boolean;
    remaining: number;
    retryAfterSec?: number;
  } {
    if (this.lastRefillTimestamp === 0) {
      this.lastRefillTimestamp = currentTimestamp;
    }
    // Refill tokens based on elapsed time
    const elapsedSec = Math.max(0, (currentTimestamp - this.lastRefillTimestamp) / 1000);
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRatePerSec);
    this.lastRefillTimestamp = currentTimestamp;

    if (this.tokens >= cost) {
      this.tokens -= cost;
      return {
        allowed: true,
        remaining: Math.floor(this.tokens)
      };
    } else {
      const missingTokens = cost - this.tokens;
      const retryAfter = Math.ceil(missingTokens / this.refillRatePerSec);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSec: retryAfter
      };
    }
  }
}

const limiter = new TokenBucketRateLimiter(5, 1); // 5 token burst, 1 token/sec refill
const nowMs = 1700000000000;
const req1 = limiter.consume(3, nowMs); // Takes 3, 2 remaining
const req2 = limiter.consume(2, nowMs); // Takes 2, 0 remaining
const req3 = limiter.consume(1, nowMs); // Denied! 0 remaining, needs 1 sec

console.log('=== TOKEN BUCKET RATE LIMITING & THROTTLING ===');
console.log('Request 1 (Cost 3): ' + (req1.allowed ? 'ALLOWED (Remaining: ' + req1.remaining + ')' : 'DENIED'));
console.log('Request 2 (Cost 2): ' + (req2.allowed ? 'ALLOWED (Remaining: ' + req2.remaining + ')' : 'DENIED'));
console.log('Request 3 (Cost 1 Burst Exceeded): ' + (req3.allowed ? 'ALLOWED' : 'HTTP 429 TOO MANY REQUESTS'));
console.log('Header Invariant: Retry-After: ' + req3.retryAfterSec + 's; X-RateLimit-Remaining: 0');`,
        output: `=== TOKEN BUCKET RATE LIMITING & THROTTLING ===\nRequest 1 (Cost 3): ALLOWED (Remaining: 2)\nRequest 2 (Cost 2): ALLOWED (Remaining: 0)\nRequest 3 (Cost 1 Burst Exceeded): HTTP 429 TOO MANY REQUESTS\nHeader Invariant: Retry-After: 1s; X-RateLimit-Remaining: 0`,
        tryIt: 'Simulate a 2000ms delay before request 3 and verify that 2 tokens are replenished, allowing the request to succeed.',
        check: {
          question: 'Why is the Token Bucket algorithm preferred over a Fixed Window Counter for API rate limiting?',
          options: [
            'Fixed Window Counters allow up to double the rate limit threshold at window boundaries (the boundary burst problem), whereas Token Bucket smoothly enforces refill rates with configurable burst bounds',
            'Token Bucket requires a GPU to compute',
            'Fixed Window Counters cannot count above 10'
          ],
          answer: 0,
          why: 'Fixed Window Counters reset at fixed intervals (e.g., top of the minute), allowing users to send maximum requests at 00:59 and another burst at 01:00, doubling peak load. Token Bucket continuously refills tokens over time, preventing boundary spikes.'
        }
      }
    ],
    summary: [
      'WebSockets provide full-duplex communication with Ping/Pong heartbeats to purge dead connections and backpressure checks on bufferedAmount to prevent OOM.',
      'Redis distributed session stores enable stateless backend scaling with sliding TTL extension and atomic concurrent device eviction.',
      'Database connection pools optimize server resources through connection reuse, while exponential backoff loops automatically recover from 40P01 deadlocks.',
      'Content Security Policy with cryptographic nonces neutralizes inline XSS, and CORS preflight ensures credentialed cross-origin requests cannot use wildcards.',
      'Token Bucket rate limiters accommodate legitimate bursts while enforcing smooth refill rates and emitting RFC 6585 HTTP 429 Retry-After headers.'
    ],
    projectStep: {
      title: 'Architect a High-Throughput Production API Gateway with WebSockets & Redis',
      steps: [
        'Implement an RFC 6455 WebSocket gateway with heartbeat eviction and socket.bufferedAmount backpressure throttling.',
        'Configure a Redis session manager with sliding window expiration and a 2-device concurrency ceiling.',
        'Wrap transactional database operations in a connection pool with automated PostgreSQL 40P01 deadlock retries.',
        'Deploy strict CSP nonce headers and a CORS preflight handler restricting credentials to authorized origins.',
        'Implement a distributed Token Bucket rate limiter that returns HTTP 429 and Retry-After headers on burst depletion.'
      ]
    }
  },
  {
    coursePrefix: 'fullstack-js',
    day: 4,
    title: 'Micro-Frontends, OpenTelemetry, Zero-Downtime Blue-Green & CQRS',
    goal: 'Master enterprise distributed JavaScript systems architecture: Micro-Frontends with Webpack 5 Module Federation, distributed tracing and W3C context propagation with OpenTelemetry SDK, Blue-Green zero-downtime rolling deployments with health check draining, idempotent webhook consumers with Redis deduplication locks, and database scaling with PostgreSQL read replicas and CQRS (Command Query Responsibility Segregation).',
    minutes: 45,
    recap: 'In Day 3, we mastered RFC 6455 WebSockets, Redis distributed sessions, PostgreSQL connection pooling and deadlock retries, CSP nonces and CORS preflights, and Token Bucket rate limiting. Now, in Day 4, we advance to planet-scale distributed full-stack architecture: Micro-Frontends with dynamic Module Federation, OpenTelemetry distributed tracing, zero-downtime Blue-Green deployments, strictly idempotent payment webhooks, and read replicas with CQRS.',
    parts: [
      {
        title: 'Micro-Frontends & Dynamic Webpack 5 Module Federation',
        say: [
          'In large enterprise engineering organizations with dozens of teams, monolithic frontend applications become massive deployment bottlenecks. A broken component in the checkout page blocks the catalog team from releasing features.',
          'Micro-Frontend architecture divides the user interface into semi-autonomous applications owned by independent squads. Webpack 5 Module Federation serves as the industry standard engine for micro-frontends.',
          'Module Federation allows a host container to dynamically import remote JavaScript bundles at runtime over HTTP, without compiling them together at build time.',
          'The biggest risk in micro-frontends is dependency duplication: if three remote micro-apps each load their own copy of React, memory consumption triples and React context breaks across boundaries.',
          'Module Federation solves this through its shared scope configuration: specifying shared: { react: { singleton: true, eager: false } } ensures only one singleton instance of React is ever instantiated in the browser runtime.',
          'By decoupling builds while sharing singletons, independent squads can deploy new UI versions dozens of times a day with zero cross-team coordination lockups.'
        ],
        example: 'Think of modern modular smartphones with magnetic accessory slots. The phone chassis (host shell) provides the power and screen (shared React singleton). A camera maker can release a snap-on telephoto lens (remote component) that plugs into the phone instantly without requiring Apple or Google to redesign the underlying phone motherboard.',
        code: `// Simulation: Webpack 5 Module Federation Host & Remote Container Resolver
interface RemoteModuleManifest {
  scope: string;
  module: string;
  url: string;
  sharedSingleton: boolean;
}

class ModuleFederationHostSimulator {
  private remotes: Map<string, RemoteModuleManifest> = new Map();
  private sharedScope: Map<string, { version: string; instanceId: string }> = new Map();

  registerRemote(manifest: RemoteModuleManifest): void {
    this.remotes.set(manifest.scope + '/' + manifest.module, manifest);
  }

  shareSingleton(library: string, version: string): void {
    if (!this.sharedScope.has(library)) {
      this.sharedScope.set(library, { version, instanceId: 'singleton_' + library + '_v' + version });
    }
  }

  loadRemoteComponent(remoteKey: string): { status: string; sharedReact: string } {
    const remote = this.remotes.get(remoteKey);
    if (!remote) {
      throw new Error('ScriptLoadError: Remote container not found: ' + remoteKey);
    }
    const reactShare = this.sharedScope.get('react')!;
    return {
      status: 'LOADED_CONTAINER_V2',
      sharedReact: reactShare.instanceId
    };
  }
}

const host = new ModuleFederationHostSimulator();
host.shareSingleton('react', '19.0.0');
host.registerRemote({
  scope: 'checkoutApp',
  module: 'PaymentWidget',
  url: 'https://checkout.enterprise.com/remoteEntry.js',
  sharedSingleton: true
});

const component = host.loadRemoteComponent('checkoutApp/PaymentWidget');

console.log('=== MICRO-FRONTENDS & WEBPACK MODULE FEDERATION ===');
console.log('Remote Component Status: ' + component.status);
console.log('Shared React Runtime: ' + component.sharedReact);
console.log('Federation Invariant: 100% singleton isolation prevents multiple React instances in DOM');`,
        output: `=== MICRO-FRONTENDS & WEBPACK MODULE FEDERATION ===
Remote Component Status: LOADED_CONTAINER_V2
Shared React Runtime: singleton_react_v19.0.0
Federation Invariant: 100% singleton isolation prevents multiple React instances in DOM`,
        tryIt: 'Register an additional remote navigationBar from navigationApp and load it through the host.',
        check: {
          question: 'Why is configuring "singleton: true" critical when sharing React in Webpack Module Federation?',
          options: [
            'Having multiple instances of React in the same browser DOM destroys React Context and triggers hook state corruption',
            'Because Webpack crashes if any library is loaded twice',
            'Because singletons automatically convert CSS into WebAssembly',
            'To limit browser network bandwidth to 1 MB/s'
          ],
          answer: 0,
          why: 'React maintains internal fiber tree states; if two micro-frontends instantiate separate copies of React, Context providers cannot bridge boundaries and hooks (like useState) fail across component trees.'
        }
      },
      {
        title: 'Distributed Tracing & OpenTelemetry Spans across Fullstack JavaScript',
        say: [
          'In modern cloud architectures, a single user click might touch a Next.js frontend, an API gateway, three Express microservices, and two PostgreSQL databases.',
          'When a customer experiences a 5-second latency spike, inspecting server logs in isolation is useless: you see thousands of unrelated log lines without any cross-service correlation.',
          'OpenTelemetry (OTel) is the vendor-neutral industry standard for distributed observability. It models transactions as a distributed Trace composed of nested, timed Spans.',
          'The Root Span begins when the browser initiates the HTTP fetch, generating a 128-bit Trace ID and a 64-bit Span ID.',
          'These IDs are injected into outgoing request headers using the W3C Trace Context standard (traceparent: 00-traceId-spanId-flags). Each downstream service extracts the header, creates a child span pointing to the parent span ID, and records its execution latency.',
          'Visualizing the resulting span tree in tracing tools (like Jaeger or Datadog) immediately highlights whether the bottleneck was a slow database query, a third-party payment API, or network hop latency.'
        ],
        example: 'Think of an international courier delivery. When a parcel is shipped, it receives a master tracking number (Trace ID). At each transit hub—sorting facility, cargo airplane, customs desk, delivery van—the package receives a local station barcode stamp (Child Span). The customer can view the exact minute each step took along the journey.',
        code: `// Simulation: OpenTelemetry Distributed Span Tree & Trace Aggregator
interface OtelSpan {
  traceId: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  durationMs: number;
}

class OpenTelemetrySimulator {
  private spans: OtelSpan[] = [];

  createSpan(traceId: string, name: string, parentSpanId: string | null = null, durationMs: number): OtelSpan {
    const span: OtelSpan = {
      traceId,
      spanId: 'span_' + Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)),
      parentSpanId,
      name,
      durationMs
    };
    this.spans.push(span);
    return span;
  }

  getTraceSummary(traceId: string): { totalDurationMs: number; spanCount: number } {
    const traceSpans = this.spans.filter(s => s.traceId === traceId);
    const totalMs = traceSpans.reduce((sum, s) => sum + s.durationMs, 0);
    return { totalDurationMs: totalMs, spanCount: traceSpans.length };
  }
}

const otel = new OpenTelemetrySimulator();
const traceId = '4bf92f3577b34da6a3ce929d0e0e4736';
const root = otel.createSpan(traceId, 'GET /api/checkout', null, 45);
const dbSpan = otel.createSpan(traceId, 'pg.query SELECT balance', root.spanId, 12);
const paymentSpan = otel.createSpan(traceId, 'POST https://stripe.com/v1/charges', root.spanId, 85);

const summary = otel.getTraceSummary(traceId);

console.log('=== DISTRIBUTED TRACING & OPENTELEMETRY SPAN TREE ===');
console.log('Trace Root: ' + root.name + ' [' + root.spanId + ']');
console.log('Child Span 1: ' + dbSpan.name + ' (parent: ' + dbSpan.parentSpanId + ') [' + dbSpan.durationMs + 'ms]');
console.log('Child Span 2: ' + paymentSpan.name + ' (parent: ' + paymentSpan.parentSpanId + ') [' + paymentSpan.durationMs + 'ms]');
console.log('Trace Metrics: Total Latency: ' + summary.totalDurationMs + 'ms across ' + summary.spanCount + ' correlated spans');`,
        output: `=== DISTRIBUTED TRACING & OPENTELEMETRY SPAN TREE ===
Trace Root: GET /api/checkout [span_1518]
Child Span 1: pg.query SELECT balance (parent: span_1518) [12ms]
Child Span 2: POST https://stripe.com/v1/charges (parent: span_1518) [85ms]
Trace Metrics: Total Latency: 142ms across 3 correlated spans`,
        tryIt: 'Add another child span for Redis cache lookup taking 4ms and observe how the total latency increases to 146ms.',
        check: {
          question: 'What header format does OpenTelemetry use to propagate distributed trace context across HTTP boundaries?',
          options: [
            'W3C Trace Context (traceparent: 00-{traceId}-{spanId}-{flags})',
            'Cookie: session_id=xyz',
            'Content-Type: application/json',
            'X-Forwarded-Host'
          ],
          answer: 0,
          why: 'The W3C Trace Context recommendation standardizes the traceparent header, allowing heterogeneous services to correlate parent-child spans without vendor lock-in.'
        }
      },
      {
        title: 'Blue-Green & Canary Zero-Downtime Deployments with Traffic Draining',
        say: [
          'In mission-critical e-commerce and financial platforms, maintenance windows with downtime are completely unacceptable. Deploying a new release must cause zero dropped connections or 502 Bad Gateway errors.',
          'Blue-Green deployment maintains two identical production environments: Blue runs the current live version, while Green hosts the newly deployed target release.',
          'Before routing real user traffic to Green, automated synthetic health checks verify database migrations, cache connections, and API endpoints.',
          'Traffic shifting occurs progressively via Canary deployment: an ingress load balancer routes a small percentage (e.g. 5% to 20%) of live traffic to Green. Error budgets and latency metrics are monitored in real time.',
          'Once metrics prove stable, the load balancer shifts 100% of traffic to Green. Crucially, the Blue environment is NOT killed instantly; it enters a Connection Draining phase (e.g. 30 seconds), allowing in-flight HTTP requests to complete cleanly.',
          'If any anomaly is detected during canary evaluation, traffic instantly reverts 100% back to Blue with zero user impact.'
        ],
        example: 'Think of an airport with parallel twin runways. Flights land on Runway Blue while ground crews inspect Runway Green. Once Runway Green is cleared, airplanes are directed to land on Green, while any airplanes already on Runway Blue finish rolling to their gates before Blue is closed for maintenance.',
        code: `// Simulation: Zero-Downtime Blue-Green & Canary Traffic Router
type DeploymentColor = 'BLUE' | 'GREEN';

class ZeroDowntimeTrafficRouter {
  private activeColor: DeploymentColor = 'BLUE';
  private canaryWeightPercent: number = 0; // 0 to 100
  private drainingConnections: number = 0;

  setCanary(greenWeight: number): void {
    this.canaryWeightPercent = greenWeight;
  }

  routeRequest(randomFactor: number): DeploymentColor {
    return randomFactor < this.canaryWeightPercent / 100 ? 'GREEN' : 'BLUE';
  }

  cutoverToGreen(): { previous: DeploymentColor; current: DeploymentColor; drainStatus: string } {
    this.drainingConnections = 14; // in-flight Blue requests
    const prev = this.activeColor;
    this.activeColor = 'GREEN';
    this.canaryWeightPercent = 100;
    return {
      previous: prev,
      current: 'GREEN',
      drainStatus: 'BLUE_DRAINING (' + this.drainingConnections + ' in-flight requests granted 30s grace)'
    };
  }
}

const router = new ZeroDowntimeTrafficRouter();
router.setCanary(20); // 20% canary to green
const reqA = router.routeRequest(0.10); // goes to GREEN
const reqB = router.routeRequest(0.50); // goes to BLUE
const cutover = router.cutoverToGreen();

console.log('=== ZERO-DOWNTIME BLUE-GREEN DEPLOYMENTS & CANARY DRAINING ===');
console.log('Canary Sample 1 (10% threshold): Routed to ' + reqA);
console.log('Canary Sample 2 (50% threshold): Routed to ' + reqB);
console.log('100% Production Cutover: ' + cutover.previous + ' -> ' + cutover.current);
console.log('Connection Draining: ' + cutover.drainStatus);`,
        output: `=== ZERO-DOWNTIME BLUE-GREEN DEPLOYMENTS & CANARY DRAINING ===
Canary Sample 1 (10% threshold): Routed to GREEN
Canary Sample 2 (50% threshold): Routed to BLUE
100% Production Cutover: BLUE -> GREEN
Connection Draining: BLUE_DRAINING (14 in-flight requests granted 30s grace)`,
        tryIt: 'Increase the canary weight to 50% and verify that a 0.35 random factor routes to GREEN.',
        check: {
          question: 'What is the purpose of "Connection Draining" during a zero-downtime Blue-Green deployment cutover?',
          options: [
            'It allows existing in-flight HTTP requests on the old environment to complete cleanly before terminating old containers',
            'It empties all database tables before the new release',
            'It disconnects all user WiFi connections',
            'It reboots the operating system kernel'
          ],
          answer: 0,
          why: 'Connection draining prevents in-flight requests from being abruptly severed with 502/504 errors when traffic cuts over to the new environment.'
        }
      },
      {
        title: 'Strictly Idempotent Webhooks & Redis Distributed Deduplication Locks',
        say: [
          'External payment providers (such as Stripe, Adyen, and PayPal) send asynchronous Webhook events to notify your backend when payments succeed or fail.',
          'Because network packets can be lost, webhook providers adhere to an "at-least-once" delivery guarantee: if your server does not respond with HTTP 200 within 5 seconds, the provider retries the webhook multiple times.',
          'If your webhook endpoint is not strictly Idempotent, a duplicate webhook delivery could charge a customer twice, fulfill two orders, or corrupt database ledger balances.',
          'To ensure idempotency, every event payload includes a unique eventId. Before processing the event, your server executes an atomic distributed lock in Redis: SET idemp_lock:{eventId} LOCKED NX EX 300.',
          'The NX flag guarantees that Redis sets the key ONLY IF it does not already exist. If Redis returns nil, another worker is already processing or has already processed this exact event, allowing you to return HTTP 200 immediately and safely discard the duplicate.',
          'Atomic deduplication locks safeguard financial integrity in high-throughput distributed systems.'
        ],
        example: 'Think of a registered postal letter with a unique tracking number. When the postal worker delivers the letter, you sign the delivery sheet. If a second courier arrives an hour later with a duplicate copy, you inspect your receipt book, recognize the tracking number, and say "Already received," without paying twice.',
        code: `// Simulation: Idempotent Webhook Processor with Redis Deduplication Lock
interface WebhookPayload {
  eventId: string;
  amount: number;
  customer: string;
}

class IdempotentWebhookProcessor {
  private redisKvStore: Map<string, string> = new Map();

  async processWebhook(event: WebhookPayload): Promise<{ status: string; processed: boolean }> {
    const lockKey = 'idemp_lock:' + event.eventId;

    // Simulate Redis SET key "LOCKED" NX EX 300
    if (this.redisKvStore.has(lockKey)) {
      return {
        status: 'DUPLICATE_IGNORED (Cached result: ' + this.redisKvStore.get(lockKey) + ')',
        processed: false
      };
    }

    // Acquire lock and process
    this.redisKvStore.set(lockKey, 'PROCESSED_SUCCESS');
    return {
      status: 'NEW_PAYMENT_PROCESSED ($' + event.amount + ' charged)',
      processed: true
    };
  }
}

const processor = new IdempotentWebhookProcessor();
const webhookEvent: WebhookPayload = {
  eventId: 'evt_stripe_994821',
  amount: 250,
  customer: 'cus_alice_10'
};

const firstAttempt = await processor.processWebhook(webhookEvent);
const secondAttempt = await processor.processWebhook(webhookEvent);

console.log('=== IDEMPOTENT WEBHOOKS & REDIS DEDUPLICATION LOCKS ===');
console.log('Webhook Delivery 1: ' + firstAttempt.status);
console.log('Webhook Delivery 2 (Network Retry): ' + secondAttempt.status);
console.log('Financial Safety Invariant: Customer never double-charged under duplicate delivery');`,
        output: `=== IDEMPOTENT WEBHOOKS & REDIS DEDUPLICATION LOCKS ===
Webhook Delivery 1: NEW_PAYMENT_PROCESSED ($250 charged)
Webhook Delivery 2 (Network Retry): DUPLICATE_IGNORED (Cached result: PROCESSED_SUCCESS)
Financial Safety Invariant: Customer never double-charged under duplicate delivery`,
        tryIt: 'Send a third webhook attempt and verify that it continues to be ignored safely with cached status.',
        check: {
          question: 'In an idempotent webhook handler, what does the Redis command "SET key value NX EX 300" achieve?',
          options: [
            'It atomically acquires a distributed mutex lock ONLY IF the key does not exist (NX), expiring in 300 seconds (EX) to prevent race conditions',
            'It permanently deletes the key from the database',
            'It sends an email notification to the customer',
            'It converts the webhook payload into an XML document'
          ],
          answer: 0,
          why: 'The atomic SET NX (not exists) command guarantees that only the first thread acquires the lock, while concurrent or duplicate deliveries fail to acquire the lock and exit cleanly.'
        }
      },
      {
        title: 'Database Read Replicas & CQRS (Command Query Responsibility Segregation)',
        say: [
          'In high-scale web platforms, read operations outnumber write operations by 10 to 1 or higher: for every 1 purchase order placed, users perform 50 product searches and catalog views.',
          'When all read and write traffic hits a single primary database instance, CPU and disk I/O saturate, causing slow query performance and connection timeouts.',
          'Database architectures solve this by establishing Read Replicas: the Primary database node handles all writes (INSERT, UPDATE, DELETE) and streams write-ahead logs (WAL) asynchronously to multiple read-only replica nodes.',
          'The architectural pattern CQRS (Command Query Responsibility Segregation) formalizes this separation in application code: Commands (mutations) route strictly to the Primary database pool, while Queries (reads) route to the Read Replica pool.',
          'Because replica replication is asynchronous, a slight replication lag (typically 5–50ms) can occur. To prevent the "read-your-own-writes" inconsistency (where a user updates their profile and immediately reloads a stale cached replica), applications can force reads through the Primary for 5 seconds after a mutation.',
          'Implementing CQRS with read replicas allows database clusters to scale horizontal read capacity linearly to millions of queries per second.'
        ],
        example: 'Think of a newspaper publisher. The chief editor desk (Primary DB) is the only place where new articles are written and approved. Once approved, printing presses produce thousands of copies distributed to newsstands across the city (Read Replicas). Millions of citizens read copies from newsstands without crowding into the editor office.',
        code: `// Simulation: CQRS Database Router with Primary Leader & Read Replicas
interface AccountRecord {
  id: string;
  balance: number;
  updatedAt: number;
}

class CqrsDatabaseRouter {
  private primaryDb: Map<string, AccountRecord> = new Map();
  private replicaDb: Map<string, AccountRecord> = new Map();
  public replicationLagMs: number = 15;

  executeCommand(id: string, newBalance: number): void {
    const record: AccountRecord = { id, balance: newBalance, updatedAt: Date.now() };
    this.primaryDb.set(id, record);
    // Simulate asynchronous WAL replication to read replica
    this.replicaDb.set(id, { ...record });
  }

  executeQuery(id: string): { routedTo: string; record: AccountRecord | undefined } {
    return {
      routedTo: 'READ_REPLICA_NODE_01',
      record: this.replicaDb.get(id)
    };
  }
}

const cqrs = new CqrsDatabaseRouter();
cqrs.executeCommand('acc_9901', 5400);
const readResult = cqrs.executeQuery('acc_9901');

console.log('=== DATABASE READ REPLICAS & CQRS ROUTING ===');
console.log('Command Executed: Mutation committed to PRIMARY_DB_LEADER');
console.log('Query Executed: Routed to ' + readResult.routedTo);
console.log('Queried Record: Balance = $' + readResult.record?.balance);
console.log('Scaling Invariant: Offloads 90% read traffic from primary write database');`,
        output: `=== DATABASE READ REPLICAS & CQRS ROUTING ===
Command Executed: Mutation committed to PRIMARY_DB_LEADER
Query Executed: Routed to READ_REPLICA_NODE_01
Queried Record: Balance = $5400
Scaling Invariant: Offloads 90% read traffic from primary write database`,
        tryIt: 'Add a second read replica node and distribute queries using round-robin balancing.',
        check: {
          question: 'In a CQRS database architecture with Read Replicas, where should database write operations (INSERT/UPDATE/DELETE) be routed?',
          options: [
            'Strictly to the Primary (Leader) database instance, which replicates changes to read replicas',
            'Randomly to any read replica node',
            'To the browser local storage',
            'To the DNS nameserver'
          ],
          answer: 0,
          why: 'In standard master-replica configurations, only the Primary (Leader) database accepts write transactions to maintain single-source-of-truth consistency, while read replicas serve read-only queries.'
        }
      }
    ],
    summary: [
      'Webpack 5 Module Federation enables dynamic micro-frontends with singleton sharing to prevent duplicate React instances.',
      'OpenTelemetry models distributed full-stack transactions as parent-child Span trees propagated via W3C traceparent headers.',
      'Blue-Green and Canary zero-downtime deployments shift traffic progressively and drain in-flight connections before retirement.',
      'Idempotent webhook handlers use atomic Redis SET NX distributed locks to guarantee financial transactions are never executed twice.',
      'CQRS database routers route write commands to the Primary database and read queries to Replicas, scaling read throughput linearly.'
    ],
    projectStep: {
      title: 'Architect an Enterprise Distributed Commerce Platform with Federation & CQRS',
      steps: [
        'Configure a Webpack Module Federation host application sharing React singletons with remote micro-frontend containers.',
        'Instrument an OpenTelemetry tracing pipeline propagating W3C traceparent headers across API gateway calls.',
        'Implement a Canary deployment traffic router with 30-second connection draining for legacy containers.',
        'Construct an idempotent payment webhook consumer backed by atomic Redis distributed deduplication mutexes.',
        'Build a CQRS database connection router directing mutations to Primary and queries to Read Replicas.'
      ]
    }
  }
];


