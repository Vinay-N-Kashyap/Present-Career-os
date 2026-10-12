import type { LongLesson } from './longLessons';

export const MOBILE_LONG_LESSONS: LongLesson[] = [
  {
    day: 1,
    title: 'React Native Architecture, Bridge Lifecycles & 60 FPS Mobile Performance',
    goal: 'Master high-performance cross-platform mobile engineering: the JavaScript thread vs Native UI thread, Safe Area boundaries, virtualized list memory constraints (FlatList), touch responder lifecycles, and offline SQLite synchronization.',
    minutes: 32,
    recap: 'Welcome to React Native & Mobile Systems Architecture. Today we transition from desktop browser DOMs into multi-threaded native iOS and Android environments.',
    parts: [
      {
        title: 'Mobile Architecture: JS Thread, UI Main Thread & The JSI',
        say: [
          'In a standard web browser, JavaScript and DOM rendering run on the same main browser thread.',
          'React Native operates very differently: it separates execution across at least three distinct threads.',
          '1. The JavaScript Thread: Executes your React components, hooks, business logic, and API calls (running on the Hermes bytecode engine).',
          '2. The Native UI Main Thread: Directly renders native platform views (UIKit on iOS, Android Views on Android) and handles user touch inputs at 60 or 120 FPS.',
          '3. The Shadow Thread: Calculates Flexbox layouts using Meta’s Yoga C++ layout engine.',
          'Historically, messages between JS and Native traveled over an asynchronous JSON bridge. Modern React Native uses the JavaScript Interface (JSI), allowing C++ Host Objects to be invoked directly and synchronously from JavaScript without JSON serialization overhead.'
        ],
        example: 'Like an orchestra conductor (JS thread) sending sheet music to musicians (Native UI thread). If the conductor writes instructions on paper and mails them across town (legacy bridge), things lag. If the conductor stands in the room speaking directly to the first violinist (JSI), music plays synchronously without delay.',
        code: `// React Native Thread Architecture & JSI Invocation Simulator
interface ThreadMetrics {
  jsFps: number;
  uiFps: number;
  bridgeLatencyMs: number;
  jsiDirectCallNs: number;
}

class MobileRuntimeSimulator {
  private jsBlocked = false;

  simulateHeavyCalculation() {
    this.jsBlocked = true;
    // Simulate expensive JS operation
    let acc = 0;
    for (let i = 0; i < 100000; i++) acc += (i % 2 === 0 ? 1 : -1);
    this.jsBlocked = false;
    return acc;
  }

  getThreadTelemetry(): ThreadMetrics {
    return {
      jsFps: this.jsBlocked ? 18 : 60,
      uiFps: 60, // Native UI thread continues smooth 60fps animations even if JS stalls!
      bridgeLatencyMs: 4.8,
      jsiDirectCallNs: 120 // JSI C++ call executes in nanoseconds
    };
  }
}

const runtime = new MobileRuntimeSimulator();
console.log('Baseline 60 FPS Mobile Telemetry:', JSON.stringify(runtime.getThreadTelemetry()));

runtime.simulateHeavyCalculation();
const blockedTelemetry = runtime.getThreadTelemetry();
console.log('During Heavy JS Processing:');
console.log('  Native UI Thread FPS:', blockedTelemetry.uiFps, '(Scroll/Animations stay silky smooth)');
console.log('  JavaScript Thread FPS:', blockedTelemetry.jsFps, '(State updates queued)');
console.log('  JSI Direct Invocation Overhead:', blockedTelemetry.jsiDirectCallNs, 'ns vs Legacy Bridge:', blockedTelemetry.bridgeLatencyMs, 'ms');`,
        output: `Baseline 60 FPS Mobile Telemetry: {"jsFps":60,"uiFps":60,"bridgeLatencyMs":4.8,"jsiDirectCallNs":120}\nDuring Heavy JS Processing:\n  Native UI Thread FPS: 60 (Scroll/Animations stay silky smooth)\n  JavaScript Thread FPS: 60 (State updates queued)\n  JSI Direct Invocation Overhead: 120 ns vs Legacy Bridge: 4.8 ms`,
        codeNotes: [
          { line: 8, note: 'Simulates thread decoupling: JS thread vs Native UI Main thread' },
          { line: 20, note: 'Native UI animations remain at 60 FPS even when JS executes calculations' },
          { line: 36, note: 'Highlights JSI C++ microsecond speed advantages over legacy JSON serialization' }
        ],
        tryIt: 'Simulate a frame drop on the UI thread by enabling heavy native view hierarchy updates.',
        check: {
          question: 'Why do touch animations stay smooth at 60 FPS in React Native even if the JavaScript thread is busy?',
          options: [
            'The Native UI Main thread handles hardware rendering and native driver animations independently of the JavaScript thread',
            'React Native runs exclusively on cloud server farms',
            'Smartphones automatically pause all background apps'
          ],
          answer: 0,
          why: 'React Native decouples the Native UI Main thread from the JavaScript thread, allowing platform gestures and native driver animations to execute at 60 FPS without waiting for JS.'
        }
      },
      {
        title: 'Layout Geometry, Safe Area Invariants & Density Pixels',
        say: [
          'Mobile devices have hundreds of distinct physical screen sizes, pixel densities, and physical hardware cutouts (camera notches, Dynamic Island, home indicator bars).',
          'In mobile engineering, coordinates are never measured in physical device pixels.',
          'Instead, they are defined in Density-Independent Pixels (dp on Android, pt on iOS).',
          'A device with a 3x Retina display has 3 physical pixels per 1 pt, managed automatically by the OS.',
          'Furthermore, mobile apps must satisfy the Safe Area Invariant: no interactive touch controls may be positioned behind physical hardware notches or home indicator bars.',
          'Violating this invariant causes touch events to be intercepted by the operating system instead of your app.'
        ],
        example: 'Like building a picture frame with a thick decorative wooden border. You must center the painting within the visible glass opening (Safe Area), not tuck important signatures under the wooden frame where nobody can see or touch them.',
        code: `// Safe Area Geometry & Density-Independent Pixel Calculation
interface DeviceGeometry {
  screenHeightPt: number;
  screenWidthPt: number;
  scaleFactor: number; // 2x or 3x Retina
  insets: { top: number; bottom: number; left: number; right: number };
}

function computeViewableArea(geo: DeviceGeometry) {
  const safeHeight = geo.screenHeightPt - geo.insets.top - geo.insets.bottom;
  const safeWidth = geo.screenWidthPt - geo.insets.left - geo.insets.right;
  const physicalPixels = (geo.screenHeightPt * geo.scaleFactor) * (geo.screenWidthPt * geo.scaleFactor);

  return {
    safeHeightPt: safeHeight,
    safeWidthPt: safeWidth,
    totalPhysicalPixels: physicalPixels,
    isSafeAreaSatisfied: geo.insets.top >= 44 && geo.insets.bottom >= 34
  };
}

const modernDevice: DeviceGeometry = {
  screenHeightPt: 844, // iPhone 14 / 15
  screenWidthPt: 390,
  scaleFactor: 3,     // Super Retina OLED (3x)
  insets: { top: 47, bottom: 34, left: 0, right: 0 } // Dynamic Island / Notch + Home Bar
};

const result = computeViewableArea(modernDevice);
console.log('Total Screen Size (pt):', \`\${modernDevice.screenWidthPt}x\${modernDevice.screenHeightPt}\`);
console.log('Safe Viewport Height (pt):', result.safeHeightPt, '(Notch & Home Bar protected)');
console.log('Total Rendered Physical Hardware Pixels:', result.totalPhysicalPixels.toLocaleString());
console.log('Safe Area Invariant Status:', result.isSafeAreaSatisfied ? 'VALIDATED (Zero Touch Clipping)' : 'VIOLATED');`,
        output: `Total Screen Size (pt): 390x844\nSafe Viewport Height (pt): 763 (Notch & Home Bar protected)\nTotal Rendered Physical Hardware Pixels: 2,962,440\nSafe Area Invariant Status: VALIDATED (Zero Touch Clipping)`,
        codeNotes: [
          { line: 8, note: 'Calculates active bounds minus system notch and home indicator cutouts' },
          { line: 20, note: '3x scale factor models modern Super Retina displays (e.g. 1170x2532 physical pixels)' },
          { line: 28, note: 'Confirms that touch targets are strictly contained inside safe viewport boundaries' }
        ],
        tryIt: 'Set top inset to 0 and verify that the safe area invariant fails.',
        check: {
          question: 'Why must mobile apps enforce Safe Area boundaries (SafeAreaView)?',
          options: [
            'To prevent buttons and inputs from being obscured by hardware camera notches, speaker cutouts, or the OS home indicator',
            'To prevent batteries from overheating',
            'Because Apple App Store rules require all apps to be square'
          ],
          answer: 0,
          why: 'Safe Area insets guarantee that interactive content stays within viewable boundaries and is never blocked by physical hardware cutouts.'
        }
      },
      {
        title: 'Virtualized Lists: FlatList Memory Invariants vs ScrollView OOM',
        say: [
          'On the web, rendering 5,000 DOM elements causes sluggish scrolling.',
          'On mobile, rendering 5,000 items in a standard ScrollView causes the operating system to forcefully kill your application with an Out Of Memory (OOM) crash.',
          'A mobile phone typically grants an app between 150 MB and 300 MB of total RAM before terminating it.',
          'To achieve 60 FPS scrolling with millions of rows, mobile engineers use Virtualized Lists (FlatList).',
          'FlatList maintains a strict Memory Bounding Invariant: it only renders rows currently visible in the active viewport (plus a tiny window buffer).',
          'Rows that scroll out of view are recycled and unmounted from native memory.',
          'Providing getItemLayout allows the list to skip calculating dynamic row heights, delivering instant O(1) jump-scrolling.'
        ],
        example: 'Like a conveyor belt viewer with a magnifying glass. Instead of laying out 10,000 photos across a 1-mile floor, you keep only the 5 photos under the magnifying glass on the table at any given second.',
        code: `// Virtualized List Memory Invariant Simulator (FlatList vs ScrollView)
interface ListMemoryReport {
  totalItems: number;
  mountedElements: number;
  ramUsageMb: number;
  oomCrashRisk: boolean;
}

function simulateScrollView(itemCount: number): ListMemoryReport {
  // Unbounded: mounts every single item into native memory
  const mounted = itemCount;
  const ram = (mounted * 0.25); // ~250KB per complex native card
  return {
    totalItems: itemCount,
    mountedElements: mounted,
    ramUsageMb: Math.round(ram),
    oomCrashRisk: ram > 250 // Mobile OS terminates apps exceeding 250MB heap
  };
}

function simulateFlatList(itemCount: number, viewportCapacity: number = 8): ListMemoryReport {
  // Virtualized: keeps only viewport + 2 window buffer items mounted
  const buffer = 4;
  const mounted = Math.min(itemCount, viewportCapacity + buffer);
  const ram = (mounted * 0.25) + 12; // Static base overhead
  return {
    totalItems: itemCount,
    mountedElements: mounted,
    ramUsageMb: Math.round(ram),
    oomCrashRisk: false // Strictly memory bounded!
  };
}

const largeDataSet = 5000;
const scrollReport = simulateScrollView(largeDataSet);
const flatReport = simulateFlatList(largeDataSet);

console.log('Unbounded ScrollView:');
console.log(\`  Mounted Native Views: \${scrollReport.mountedElements} | Memory: \${scrollReport.ramUsageMb} MB | OOM Crash: \${scrollReport.oomCrashRisk ? 'YES (CRITICAL)' : 'NO'}\`);

console.log('\\nBounded Virtualized FlatList:');
console.log(\`  Mounted Native Views: \${flatReport.mountedElements} | Memory: \${flatReport.ramUsageMb} MB | OOM Crash: \${flatReport.oomCrashRisk ? 'YES' : 'NO (STABLE 60 FPS)'}\`);`,
        output: `Unbounded ScrollView:\n  Mounted Native Views: 5000 | Memory: 1250 MB | OOM Crash: YES (CRITICAL)\n\nBounded Virtualized FlatList:\n  Mounted Native Views: 12 | Memory: 15 MB | OOM Crash: NO (STABLE 60 FPS)`,
        codeNotes: [
          { line: 8, note: 'ScrollView mounts all 5,000 items, consuming 1.25 GB of RAM and causing an instant OS crash' },
          { line: 20, note: 'FlatList virtualizes views, mounting only 12 items regardless of dataset size' },
          { line: 36, note: 'Demonstrates constant O(1) memory footprint for infinite feeds' }
        ],
        tryIt: 'Increase the dataset to 50,000 items and observe that FlatList memory consumption remains identical at ~15MB.',
        check: {
          question: 'Why does FlatList scale smoothly to tens of thousands of items without crashing?',
          options: [
            'It virtualizes the view window, recycling and unmounting off-screen rows to maintain a strictly bounded memory footprint',
            'It saves every item to the phone SIM card',
            'It compresses all images to 1x1 pixels'
          ],
          answer: 0,
          why: 'FlatList unmounts views that scroll outside the visible viewport buffer, keeping memory bounded regardless of list size.'
        }
      },
      {
        title: 'Touch Responder System & Gesture Lifecycles',
        say: [
          'On mobile touchscreens, multiple fingers touch the screen simultaneously, generating continuous stream events: start, move, end, and cancel.',
          'When a user touches a button inside a scrollable list, who gets the gesture? The button (for a tap) or the list (for a scroll)?',
          'React Native resolves this through the Touch Responder System.',
          'A component negotiates permission to become the active touch responder via lifecycle hooks:',
          '1. onStartShouldSetPanResponder: Requests permission on initial finger contact.',
          '2. onMoveShouldSetPanResponder: Requests permission when the finger drags beyond a distance slop threshold (e.g. 5 pixels).',
          '3. onPanResponderGrant: Notifies the component that it has acquired exclusive touch ownership.',
          '4. onPanResponderTerminate: Triggered when a parent container (like a parent scroll view) steals gesture control.'
        ],
        example: 'Like an argument over a steering wheel. If you gently touch the wheel (tap), the button handles it. If you vigorously turn the wheel to the left (drag), the parent scroll view takes ownership and cancels the button tap.',
        code: `// Mobile Touch Responder Lifecycle Simulator
interface TouchEvent {
  dx: number; // Drag delta X
  dy: number; // Drag delta Y
}

class PanResponderCoordinator {
  private activeResponder: string | null = null;
  private readonly SLOP_THRESHOLD = 8; // 8pt touch slop

  handleTouchMove(event: TouchEvent): { activeTarget: string; action: string } {
    const isHorizontalDrag = Math.abs(event.dx) > this.SLOP_THRESHOLD;
    const isVerticalDrag = Math.abs(event.dy) > this.SLOP_THRESHOLD;

    if (isHorizontalDrag && Math.abs(event.dx) > Math.abs(event.dy)) {
      // Horizontal swipe gesture claims ownership (e.g. Carousel or Drawer)
      this.activeResponder = 'HorizontalCarousel';
      return { activeTarget: this.activeResponder, action: 'SWIPE_PAGING' };
    } else if (isVerticalDrag) {
      // Vertical drag claims ownership for parent ScrollView
      this.activeResponder = 'ParentScrollView';
      return { activeTarget: this.activeResponder, action: 'VERTICAL_SCROLL' };
    } else {
      // Small jitter below slop threshold remains with button
      this.activeResponder = 'ChildButton';
      return { activeTarget: this.activeResponder, action: 'TAP_PENDING' };
    }
  }
}

const coordinator = new PanResponderCoordinator();

// Small finger jitter (< 8pt)
const t1 = coordinator.handleTouchMove({ dx: 2, dy: 3 });
console.log('Touch Jitter (<8pt):', t1.activeTarget, '=>', t1.action);

// Large horizontal swipe (dx: 45, dy: 5)
const t2 = coordinator.handleTouchMove({ dx: 45, dy: 5 });
console.log('Horizontal Drag:', t2.activeTarget, '=>', t2.action);

// Large vertical scroll (dx: 3, dy: 60)
const t3 = coordinator.handleTouchMove({ dx: 3, dy: 60 });
console.log('Vertical Drag:', t3.activeTarget, '=>', t3.action);`,
        output: `Touch Jitter (<8pt): ChildButton => TAP_PENDING\nHorizontal Drag: HorizontalCarousel => SWIPE_PAGING\nVertical Drag: ParentScrollView => VERTICAL_SCROLL`,
        codeNotes: [
          { line: 8, note: 'Touch slop threshold prevents micro-tremors from prematurely canceling taps' },
          { line: 15, note: 'Directional arbitration awards gesture ownership to carousel or scroll view' },
          { line: 36, note: 'Demonstrates deterministic gesture conflict resolution' }
        ],
        tryIt: 'Change the touch slop threshold to 15pt and observe the delayed gesture activation.',
        check: {
          question: 'What is the purpose of the "touch slop" threshold in mobile gesture systems?',
          options: [
            'It ignores tiny finger micro-tremors under a few pixels so accidental wiggles do not cancel button taps',
            'It slows down internet downloads on cellular networks',
            'It makes the screen darker in bright sunlight'
          ],
          answer: 0,
          why: 'Touch slop provides a buffer zone allowing fingers to rest or settle on a button without instantly triggering a scroll drag.'
        }
      },
      {
        title: 'Offline-First Synchronization & Optimistic UI Mutex',
        say: [
          'Mobile devices operate in unpredictable network conditions: elevators, subways, and cellular dead zones.',
          'Elite mobile applications follow an Offline-First Architecture.',
          'When a user submits an action (like liking a post or sending a message):',
          '1. The app immediately updates the local UI optimistically (0ms perceived latency).',
          '2. The mutation is written to an atomic local SQLite database.',
          '3. The operation is appended to an offline mutation queue.',
          '4. When network connectivity restores, an asynchronous worker flushes the queue with idempotency keys, reconciling server state seamlessly.'
        ],
        example: 'Like writing a letter and dropping it into your physical home mailbox. Even if the mail truck is delayed by snow, you know the letter is safely recorded in your mailbox and will be dispatched as soon as the roads clear.',
        code: `// Offline-First Mutation Queue & Optimistic UI Sync
interface Mutation {
  id: string;
  action: 'LIKE' | 'COMMENT';
  payload: any;
  status: 'PENDING' | 'SYNCED';
  timestamp: number;
}

class OfflineSyncEngine {
  private localSqliteStore: Mutation[] = [];
  private isOnline = false;

  executeOptimisticAction(action: 'LIKE' | 'COMMENT', payload: any): string {
    const mutationId = 'mut_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
    const mutation: Mutation = {
      id: mutationId,
      action,
      payload,
      status: 'PENDING',
      timestamp: Date.now()
    };
    // 1. Write immediately to local persistent storage
    this.localSqliteStore.push(mutation);
    return mutationId;
  }

  setNetworkOnline(online: boolean) {
    this.isOnline = online;
    if (this.isOnline) {
      this.flushQueue();
    }
  }

  private flushQueue() {
    for (const m of this.localSqliteStore) {
      if (m.status === 'PENDING') {
        // Asynchronously post to backend server with idempotency key
        m.status = 'SYNCED';
      }
    }
  }

  getStore() { return this.localSqliteStore; }
}

const engine = new OfflineSyncEngine();
console.log('User is in subway tunnel (Offline)');
engine.executeOptimisticAction('LIKE', { postId: 'post-101' });
engine.executeOptimisticAction('COMMENT', { postId: 'post-101', text: 'Great insight!' });

console.log('Local SQLite Queue State:');
console.log(engine.getStore().map(m => \`  [\${m.status}] \${m.action} (id: \${m.id})\`).join('\\n'));

console.log('\\nReconnecting to 5G Network...');
engine.setNetworkOnline(true);
console.log('Post-Sync State:');
console.log(engine.getStore().map(m => \`  [\${m.status}] \${m.action} (id: \${m.id})\`).join('\\n'));`,
        output: `User is in subway tunnel (Offline)\nLocal SQLite Queue State:\n  [PENDING] LIKE (id: mut_1)\n  [PENDING] COMMENT (id: mut_2)\n\nReconnecting to 5G Network...\nPost-Sync State:\n  [SYNCED] LIKE (id: mut_1)\n  [SYNCED] COMMENT (id: mut_2)`,
        codeNotes: [
          { line: 15, note: 'Writes mutation immediately to local storage for instant zero-latency feedback' },
          { line: 33, note: 'Automatic queue flush triggered when network connectivity restores' },
          { line: 55, note: 'Demonstrates guaranteed eventual consistency across offline periods' }
        ],
        tryIt: 'Queue a third mutation and verify that it syncs automatically when online.',
        check: {
          question: 'What is the primary benefit of an offline-first mobile architecture with optimistic updates?',
          options: [
            'Users experience instantaneous UI responsiveness, and actions are safely persisted locally until connectivity restores',
            'It eliminates the need for any cloud servers',
            'It prevents the smartphone screen from getting scratched'
          ],
          answer: 0,
          why: 'Optimistic updates update the local UI with zero latency while local SQLite storage ensures no data is lost during network dead zones.'
        }
      }
    ],
    summary: [
      'React Native isolates the JavaScript Thread, Native UI Main Thread, and Yoga Layout Shadow Thread.',
      'Safe Area insets protect touch elements from hardware camera notches and home indicator cutouts.',
      'FlatList virtualizes rows to maintain a strictly bounded memory footprint, eliminating ScrollView OOM crashes.',
      'The Touch Responder System arbitrates gestures using touch slop thresholds to prevent scroll hijacking.',
      'Offline-first architectures combine local SQLite persistence with optimistic UI and mutation queue replay.'
    ],
    projectStep: {
      title: 'Build a 60 FPS Virtualized Feed with Offline SQLite Sync',
      steps: [
        'Configure a safe-area bounded screen layout with device-independent density coordinates.',
        'Implement a virtualized FlatList with getItemLayout for 60 FPS scrolling.',
        'Construct a PanResponder gesture coordinator with touch slop filtering.',
        'Implement an offline mutation queue persisting actions to local SQLite storage.'
      ]
    }
  }
];
