// scripts/visuals/mobile-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Mobile Application Development (course-mobile-dev)
// Total Quests: 225 Quests (Month 1: 111 Quests, Month 2: 114 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, and FAANG/Staff Mobile Engineering rubrics.

import { MasterclassDaySpec } from './java-masterclass-spec.js';

export const MOBILE_MONTH_1_SPECS: MasterclassDaySpec[] = [
  {
    day: 1,
    month: 1,
    blockNum: 1,
    title: "Mobile Architecture: The 3-Thread Model, Hermes Bytecode & JSI Bridges",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (3-Thread Runtime & Memory Architecture)",
    spokenGoal: "Master mobile runtime architecture: Understand the 3 concurrent threads (JavaScript, Shadow Thread/Yoga C++, and UI Main Thread), Hermes AOT bytecode compilation, and direct memory invocations.",
    conceptInvariant: "The JavaScript thread executes business logic; the Shadow thread calculates C++ flexbox layout trees; the UI Main thread renders native UIKit/Android views. Long tasks on the JS thread starve touch responsiveness.",
    failureMode: "Running heavy loops (JSON parsing, sorting 50,000 items) on the JS thread freezes user touches and triggers mobile ANR (Application Not Responding) dialogs.",
    tryItFriction: "Offload an expensive computational loop off the primary render cycle and assert zero UI-thread frame drops.",
    socraticHints: [
      "Why does tapping a button freeze while a large array is sorting?",
      "Because JavaScript is single-threaded! While Hermes is busy executing your sort, touch event callbacks cannot be processed.",
      "Schedule heavy work across microtasks or move computations to a background thread or native module."
    ],
    situationalPuzzle: {
      scenario: "A mobile user complains that pressing 'Submit Order' causes a 2-second visual freeze before the spinner appears. Profiling reveals a 5MB JSON string being parsed synchronously on the button press. What thread is starved?",
      options: [
        "The GPU raster thread.",
        "The JavaScript Thread is blocked by synchronous JSON.parse(), delaying the state update and UI render commit.",
        "The Audio playback thread.",
        "The Apple Push Notification thread."
      ],
      answerIdx: 1,
      debrief: "Synchronous JSON parsing on the JavaScript thread blocks the event loop, preventing React from committing the loading state to the native Shadow and UI threads."
    },
    quests: [
      { id: "mobile-m1-d01-q1", name: "The 3-Thread Execution Topology", type: "concept", desc: "Inspect how messages flow between Hermes JS, Yoga C++, and native iOS/Android main threads." },
      { id: "mobile-m1-d01-q2", name: "Detective Lab: The Synchronous JSON UI Freeze", type: "detective", desc: "Isolate a blocking synchronous JSON parse on the JS thread that froze native touch responsiveness." },
      { id: "mobile-m1-d01-q3", name: "Mastery Assignment: 60 FPS Thread Bridge Monitor", type: "assignment", desc: "Build a thread telemetry logger tracking JS event loop delay and UI render latency." },
      { id: "mobile-m1-d01-q4", name: "Production Incident Lab: Main Thread ANR Outage", type: "detective", desc: "Diagnose and remediate an Android Application Not Responding (ANR) lockup in production telemetry." }
    ]
  },
  {
    day: 2,
    month: 1,
    blockNum: 1,
    title: "Native View Primitives: View, Text Strict Nesting & SafeAreaView Insets",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Native Primitives & SafeArea Invariants)",
    spokenGoal: "Master native view primitives: mapping View to UIView/ViewGroup, the strict Text nesting invariant, and dynamic notch/safe area inset math.",
    conceptInvariant: "In React Native, raw string characters CANNOT live inside a View; all strings must be wrapped in a Text primitive. SafeArea insets vary dynamically by device model and orientation.",
    failureMode: "Placing naked text or a raw expression directly inside a <View> triggers an immediate runtime crash: 'Unexpected text node found inside View'.",
    tryItFriction: "Wrap orphaned text strings and dynamic numbers in <Text> primitives and calculate usable viewport height subtracting top notch and bottom home indicator insets.",
    socraticHints: [
      "Why did the app crash with 'Unexpected text node found inside a View'?",
      "In web HTML you can put raw text inside a <div>, but on iOS and Android a native View can only hold child Views, not strings!",
      "Wrap every string, label, and formatted currency inside a <Text> component."
    ],
    situationalPuzzle: {
      scenario: "An app displays user points with: <View>{points && points}</View>. When points = 0, the app instantly crashes on Android with a red screen. Why?",
      options: [
        "Android does not support zero.",
        "The logical AND expression evaluates to the number 0, which React Native tries to render as a raw string inside View without a Text wrapper.",
        "The View overflowed the screen.",
        "The Hermes engine crashed."
      ],
      answerIdx: 1,
      debrief: "In JavaScript, 0 && anything evaluates to 0. React Native attempts to render '0' inside View, crashing because raw strings are forbidden outside Text primitives."
    },
    quests: [
      { id: "mobile-m1-d02-q1", name: "Native Component Mapping Architecture", type: "concept", desc: "Trace how JSX primitives compile into native UIKit UIView and Android ViewGroup components." },
      { id: "mobile-m1-d02-q2", name: "Detective Lab: The Naked Text Red-Screen Crash", type: "detective", desc: "Find and wrap all naked strings and conditional zero falsy values inside Text tags." },
      { id: "mobile-m1-d02-q3", name: "Mastery Assignment: Dynamic Safe Area Inset Calculator", type: "assignment", desc: "Compute exact usable screen bounds across iPhone Dynamic Island and Android navigation bars." },
      { id: "mobile-m1-d02-q4", name: "Production Incident Lab: Notch Clipping Remediation", type: "detective", desc: "Fix UI buttons cut off behind iPhone dynamic islands using safe area context providers." }
    ]
  },
  {
    day: 3,
    month: 1,
    blockNum: 1,
    title: "Yoga C++ Flexbox Engine: Column Defaults, dp/pt Math & Screen Scales",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Layout Engine & Pixel Density Multipliers)",
    spokenGoal: "Master mobile layout mechanics: Understand Yoga C++ layout differences from Web CSS (flexDirection: 'column' by default), and density-independent pixels (dp/pt) across 1x, 2x, 3x screens.",
    conceptInvariant: "Unlike Web CSS which defaults to flexDirection: 'row', mobile Flexbox defaults to flexDirection: 'column'. Dimensions in React Native are density-independent points, scaled by PixelRatio.",
    failureMode: "Assuming web CSS defaults (e.g. flexDirection row) or hardcoding physical pixel coordinates causes shattered layouts on high-DPI screens.",
    tryItFriction: "Convert a broken web CSS layout into mobile Yoga Flexbox with explicit column/row flow and dynamic window dimension scaling.",
    socraticHints: [
      "Why are two cards stacked vertically when on the web they sat side-by-side?",
      "Mobile Flexbox defaults to flexDirection: 'column' to match portrait smartphone reading flow!",
      "Add 'flexDirection: row' and 'alignItems: center' to your container StyleSheet."
    ],
    situationalPuzzle: {
      scenario: "A designer gives you an icon with a hardcoded size of 48px from a 3x Retina Figma mockup. On a standard 1x budget Android device, the icon renders massive and breaks the header. How should size be specified?",
      options: [
        "Use physical millimeters.",
        "Specify size in density-independent points (16pt), which scales correctly across 1x (16px), 2x (32px), and 3x (48px) screens.",
        "Hardcode 48px for all devices.",
        "Disable scaling in Android manifest."
      ],
      answerIdx: 1,
      debrief: "React Native sizes are points (dp on Android, pt on iOS). A 48px asset from a 3x design represents 16 points. The OS automatically multiplies points by the screen density ratio."
    },
    quests: [
      { id: "mobile-m1-d03-q1", name: "Yoga C++ Layout Engine Mechanics", type: "concept", desc: "Inspect how Yoga computes bounding boxes and flexbox constraints into C++ nodes." },
      { id: "mobile-m1-d03-q2", name: "Detective Lab: The Inverted Flex Direction Glitch", type: "detective", desc: "Refactor broken web layout assumptions into mobile column-first Flexbox." },
      { id: "mobile-m1-d03-q3", name: "Mastery Assignment: Multi-Density Responsive Card Grid", type: "assignment", desc: "Build a dynamic 2-column card layout that scales seamlessly across phones and tablets." },
      { id: "mobile-m1-d03-q4", name: "Production Incident Lab: Tablet Multi-Pane Layout Defect", type: "detective", desc: "Resolve iPad screen layout distortions using PixelRatio and useWindowDimensions." }
    ]
  },
  {
    day: 4,
    month: 1,
    blockNum: 1,
    title: "Touch Responders & Pressable Physics: Hit Slop & Android Ripple",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "Balanced Friction (Touch Event Bubbling & Hit Target Ergonomics)",
    spokenGoal: "Master mobile touch interactions: Pressable state lifecycles (pressed, unpressed), hitSlop touch target expansion, and platform-specific ripple effects.",
    conceptInvariant: "Mobile touch targets must be at least 48x48 dp for accessibility. Use hitSlop to expand invisible touch boundaries without altering visual layout bounding boxes.",
    failureMode: "Creating small 16x16 icon buttons without hitSlop forces mobile users to repeatedly tap with high friction, failing accessibility audits.",
    tryItFriction: "Implement a Pressable button with dynamic pressed opacity feedback, hitSlop of 12dp on all edges, and Android native ripple bounds.",
    socraticHints: [
      "Why is the small close button so hard to tap on a real mobile device?",
      "Human fingertips cover a 48x48 point area on physical screens. A 16pt button without hitSlop misses 70% of taps!",
      "Add 'hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}' to the Pressable."
    ],
    situationalPuzzle: {
      scenario: "A finance app has a 'Confirm Transfer' button. Users accidentally trigger double-taps because the button does not debounce rapid clicks, creating duplicate wire transfers. How do you prevent this at the touch layer?",
      options: [
        "Ask the user to click slowly.",
        "Disable the Pressable immediately on press (disabled={isSubmitting}) and ignore rapid subsequent tap events.",
        "Remove the button.",
        "Use a setTimeout of 10 seconds."
      ],
      answerIdx: 1,
      debrief: "Touch responders must protect against rapid duplicate taps by toggling disabled state immediately upon the first touch gesture until asynchronous confirmation returns."
    },
    quests: [
      { id: "mobile-m1-d04-q1", name: "Touch Responder System State Machine", type: "concept", desc: "Trace touch event bubbling from native window down to active Pressable responders." },
      { id: "mobile-m1-d04-q2", name: "Detective Lab: The Unresponsive Small Icon Button", type: "detective", desc: "Expand small touch targets using hitSlop without disturbing surrounding flex layout." },
      { id: "mobile-m1-d04-q3", name: "Mastery Assignment: Haptic-Feedback Interactive Action Button", type: "assignment", desc: "Build an enterprise action button with pressed state transforms and platform-specific feedback." },
      { id: "mobile-m1-d04-q4", name: "Production Incident Lab: Duplicate Touch Submission Bug", type: "detective", desc: "Eliminate duplicate transaction processing caused by unthrottled touch responders." }
    ]
  },
  {
    day: 5,
    month: 1,
    blockNum: 1,
    title: "⭐ Milestone 1: Zero-Jank Responsive Mobile Design System with Safe-Area Layout Guards",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "Balanced Friction (Milestone 1 Architecture Integration)",
    spokenGoal: "Architect an enterprise mobile design system token library with strict Safe Area notch handling, fluid typography, and accessible touch targets.",
    conceptInvariant: "A production mobile design system must decouple visual styles into immutable tokens, guarantee 48dp touch targets, and adapt to all device aspect ratios.",
    failureMode: "Hardcoding static pixel coordinates or neglecting orientation changes breaks layout across foldables and tablets.",
    tryItFriction: "Construct a multi-variant Button, Typography, and Card component system that passes 100% of automated layout boundary checks.",
    socraticHints: [
      "How do you guarantee that buttons never collide with the home bar on iPhone 15?",
      "Use useSafeAreaInsets() from react-native-safe-area-context and apply bottom padding dynamically.",
      "Export a reusable ScreenContainer that enforces notch and home indicator bounds automatically."
    ],
    situationalPuzzle: {
      scenario: "A design team wants a Card component that looks crisp on a 1x Android device and an ultra-dense 3x Super Retina OLED screen without blurred borders. What border width rule is required?",
      options: [
        "Always use borderWidth: 1.",
        "Use StyleSheet.hairlineWidth which translates to exactly 1 physical pixel on whatever screen density is running.",
        "Use borderWidth: 0.5 everywhere.",
        "Disable borders."
      ],
      answerIdx: 1,
      debrief: "StyleSheet.hairlineWidth renders the thinnest possible crisp 1-physical-pixel line supported by the underlying hardware display, preventing sub-pixel antialiasing blur."
    },
    quests: [
      { id: "mobile-m1-d05-q1", name: "Design Token System Architecture", type: "concept", desc: "Design color palettes, spacing scales, and typography hierarchies in TypeScript." },
      { id: "mobile-m1-d05-q2", name: "Detective Lab: The Blurry Sub-Pixel Border Artifact", type: "detective", desc: "Replace arbitrary fractional border widths with StyleSheet.hairlineWidth." },
      { id: "mobile-m1-d05-q3", name: "Mastery Assignment: Production Screen Container Scaffold", type: "assignment", desc: "Implement ScreenScaffold handling safe insets, status bar colors, and orientation changes." },
      { id: "mobile-m1-d05-m1", name: "⭐ Milestone 1: Enterprise Mobile Design System Engine", type: "milestone", desc: "Deliver production design token suite with 100% safe area compliance and 48dp touch targets." }
    ]
  },
  {
    day: 6,
    month: 1,
    blockNum: 2,
    title: "Asset Pipelines: Density-Aware PNGs (@2x, @3x), SVG Vector Icons & Image Memory",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Image Memory Footprint & Density Bundles)",
    spokenGoal: "Master mobile asset bundling: understand @2x and @3x image asset resolution matching, SVG vector graphics compilation, and memory cost of uncompressed bitmaps in mobile RAM.",
    conceptInvariant: "A 10MB uncompressed bitmap decompresses into RAM as width * height * 4 bytes. Density bundles (@2x, @3x) ensure devices download only the exact resolution their display requires.",
    failureMode: "Displaying massive raw camera photos directly in Image components without downsampling exhausts device RAM and triggers OutOfMemory killer.",
    tryItFriction: "Implement a density-aware image loader with placeholder blurhash and explicit dimension bounds to avoid layout shifts.",
    socraticHints: [
      "Why did the mobile app crash when loading five high-resolution PNG images?",
      "Even though a compressed PNG is only 2MB on disk, in mobile RAM it decompresses to raw RGBA bitmap bytes (width * height * 4)!",
      "Always downsample remote images or specify explicit pixel bounds to bound memory usage."
    ],
    situationalPuzzle: {
      scenario: "A mobile user on a 4K display opens an avatar thumbnail (40x40 points). The server sends a raw 4000x4000 photo. How much RAM does this single avatar consume in uncompressed memory?",
      options: [
        "40 KB.",
        "Approximately 64 MB (4000 * 4000 * 4 bytes), causing immediate memory pressure and micro-stutters.",
        "0 bytes because the GPU compresses it.",
        "1 MB."
      ],
      answerIdx: 1,
      debrief: "Bitmaps in memory consume 4 bytes per pixel (RGBA). 4000x4000 = 16 million pixels * 4 bytes = 64 MB of RAM for a tiny 40pt thumbnail!"
    },
    quests: [
      { id: "mobile-m1-d06-q1", name: "Mobile Bitmap Memory Decompression Mechanics", type: "concept", desc: "Calculate exact RAM footprint of decoded bitmap images across device screen scales." },
      { id: "mobile-m1-d06-q2", name: "Detective Lab: The Unbounded Bitmap OOM Crash", type: "detective", desc: "Fix an OutOfMemory crash by adding downsampling bounds to avatar image requests." },
      { id: "mobile-m1-d06-q3", name: "Mastery Assignment: Density-Aware SVG Icon System", type: "assignment", desc: "Build an optimized vector icon component library compiling SVGs into native paths." },
      { id: "mobile-m1-d06-q4", name: "Production Incident Lab: Remote Image Layout Shift Glitch", type: "detective", desc: "Eliminate layout shift on slow cellular networks using aspectRatio and blurhash placeholders." }
    ]
  },
  {
    day: 7,
    month: 1,
    blockNum: 2,
    title: "React Navigation: Native Stack Navigator, Header Transitions & Type-Safe Params",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Native Stack Transitions & Type-Safe Route Graphs)",
    spokenGoal: "Master native screen navigation: @react-navigation/native-stack, UINavigationController / Fragment stack mapping, and compile-time type-safe route parameters.",
    conceptInvariant: "NativeStack utilizes native OS navigation primitives (UINavigationController on iOS), delivering 120fps native transition animations with zero JS thread overhead.",
    failureMode: "Passing massive non-serializable objects (like class instances or callback functions) through navigation route params triggers state desync.",
    tryItFriction: "Define a strictly typed RootStackParamList in TypeScript and navigate with route parameters enforced by static analysis.",
    socraticHints: [
      "Why does passing a callback function in route params cause a warning or crash on deep-linking?",
      "Navigation params MUST be serializable JSON so the OS can save and restore screen state when the app is suspended in the background!",
      "Pass only primitive IDs (e.g. accountId: string) and query the data store on the destination screen."
    ],
    situationalPuzzle: {
      scenario: "A developer passes an entire User class instance with helper methods to a Profile screen via navigation.navigate('Profile', { user }). When deep linking to this screen, the app crashes. Why?",
      options: [
        "The screen was unmounted.",
        "Deep links cannot construct JavaScript class instances from URL query parameters. Only serializable IDs should be passed.",
        "React Navigation does not support classes.",
        "The route was misspelled."
      ],
      answerIdx: 1,
      debrief: "Route params must be flat serializable JSON. Deep links parse strings from URLs; passing complex class instances breaks deep linking, state persistence, and time-travel debugging."
    },
    quests: [
      { id: "mobile-m1-d07-q1", name: "Native Stack vs JS Stack Architecture", type: "concept", desc: "Trace how NativeStack mounts real iOS UINavigationController and Android Activity/Fragments." },
      { id: "mobile-m1-d07-q2", name: "Detective Lab: The Non-Serializable Route Param Bug", type: "detective", desc: "Refactor navigation payload from complex objects to serializable entity IDs." },
      { id: "mobile-m1-d07-q3", name: "Mastery Assignment: Type-Safe Banking Navigation Graph", type: "assignment", desc: "Implement RootStackParamList with strict parameter types across Auth and Home stacks." },
      { id: "mobile-m1-d07-q4", name: "Production Incident Lab: Missing Route Parameter Red-Screen", type: "detective", desc: "Add fallback runtime guards for optional navigation route parameters." }
    ]
  },
  {
    day: 8,
    month: 1,
    blockNum: 2,
    title: "Bottom Tabs & Drawer Navigation: Tab Badges, Lazy Loading & Unmount Invariants",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Tab Screen Memory Lifecycles & State Retention)",
    spokenGoal: "Master tab-based mobile UX: Bottom tabs, notification badges, screen lazy loading (lazy: true), and unmountOnBlur memory trade-offs.",
    conceptInvariant: "By default, tab screens remain mounted in memory when switched. Lazy loading mounts them only on first view; unmountOnBlur frees memory but destroys transient form state.",
    failureMode: "Mounting 10 complex tab screens simultaneously at startup causes slow mobile launch times and battery drain.",
    tryItFriction: "Configure a bottom tab bar with lazy screen rendering, dynamic badge counter synchronization, and customized SVG icons.",
    socraticHints: [
      "Why is the initial app startup taking 4 seconds when the user only sees Tab 1?",
      "Because all tabs are rendering in the background at startup! Enable lazy: true on the tab navigator.",
      "Configure screenOptions={{ lazy: true }} so tabs only mount when the user taps them."
    ],
    situationalPuzzle: {
      scenario: "A user fills out half of a loan application on Tab 2, switches to Tab 1 to check their balance, and switches back to Tab 2. All form inputs are erased. Why?",
      options: [
        "The device ran out of disk space.",
        "The tab was configured with unmountOnBlur: true, destroying the component tree and its local useState whenever focus was lost.",
        "The battery saver triggered.",
        "Zustand cleared state."
      ],
      answerIdx: 1,
      debrief: "Setting unmountOnBlur: true completely unmounts the screen when unfocused, resetting all local component state. If state persistence across tab switches is desired, keep screens mounted or lift state."
    },
    quests: [
      { id: "mobile-m1-d08-q1", name: "Tab Navigation Memory Lifecycle", type: "concept", desc: "Diagram screen mounting, focus event listeners, and unmountOnBlur garbage collection." },
      { id: "mobile-m1-d08-q2", name: "Detective Lab: The Disappearing Form State Bug", type: "detective", desc: "Fix accidental form state resets caused by unmountOnBlur configurations." },
      { id: "mobile-m1-d08-q3", name: "Mastery Assignment: Dynamic Badged Financial Bottom Bar", type: "assignment", desc: "Build bottom tab navigator displaying real-time unread transaction badges." },
      { id: "mobile-m1-d08-q4", name: "Production Incident Lab: Tab Cold-Start Lag Audit", type: "detective", desc: "Optimize app launch time by enforcing lazy tab screen initialization." }
    ]
  },
  {
    day: 9,
    month: 1,
    blockNum: 2,
    title: "Android Hardware Back-Button vs iOS Swipe-Back Gestures & BackHandler",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Platform Navigation Divergence & Modal Traps)",
    spokenGoal: "Master platform-specific navigation physics: Android physical/gesture back button (BackHandler API) vs iOS edge swipe-back gesture, and confirmation dialog guards.",
    conceptInvariant: "Android requires listening to the hardware Back button via BackHandler. Returning true consumes the event; returning false allows the OS to exit the app or pop the stack.",
    failureMode: "Failing to remove the BackHandler event listener when a screen unmounts causes memory leaks and breaks back navigation across the entire app.",
    tryItFriction: "Implement a 'Discard Changes?' alert that intercepts Android hardware back presses and iOS gesture swipes on unsaved forms.",
    socraticHints: [
      "Why does pressing back on Screen A trigger the confirmation popup from Screen B that was already closed?",
      "You registered a BackHandler.addEventListener in useEffect but forgot to return the cleanup function removing the listener!",
      "Return () => subscription.remove() inside the useEffect cleanup."
    ],
    situationalPuzzle: {
      scenario: "A user is on a sensitive payment processing screen. On Android, pressing the back button exits the app mid-payment. On iOS, swiping from the edge aborts the transaction. How do you lock navigation during processing?",
      options: [
        "Delete the back button from the phone.",
        "Set gestureEnabled: false on navigation options and intercept BackHandler returning true while processing is active.",
        "Crash the app intentionally.",
        "Increase screen brightness."
      ],
      answerIdx: 1,
      debrief: "To prevent users from navigating away during active payment processing, disable native gestures (gestureEnabled: false) and intercept Android hardware back events returning true."
    },
    quests: [
      { id: "mobile-m1-d09-q1", name: "Android BackHandler vs iOS Gestures", type: "concept", desc: "Trace how hardware back signals propagate through the native event responder chain." },
      { id: "mobile-m1-d09-q2", name: "Detective Lab: The Leaking BackHandler Listener", type: "detective", desc: "Locate an unremoved BackHandler subscription hijacking navigation across screens." },
      { id: "mobile-m1-d09-q3", name: "Mastery Assignment: Unsaved Changes Navigation Blocker", type: "assignment", desc: "Implement navigation prevention listener (beforeRemove) prompting to save dirty state." },
      { id: "mobile-m1-d09-q4", name: "Production Incident Lab: Mid-Transaction Abort Bug", type: "detective", desc: "Lock iOS swipe-back and Android back buttons during active cryptographic signing." }
    ]
  },
  {
    day: 10,
    month: 1,
    blockNum: 2,
    title: "⭐ Milestone 2: Multi-Screen Financial Navigation Mesh with Type-Safe Route Parameters",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Milestone 2 Architecture Integration)",
    spokenGoal: "Architect an enterprise multi-tier navigation mesh combining Auth Stacks, Main Tab Bars, and Modal Detail Screens with strict compile-time route contracts.",
    conceptInvariant: "The navigation hierarchy must cleanly separate Unauthenticated and Authenticated state machines, automatically resetting stacks on logout without residual history leaks.",
    failureMode: "Navigating to an authenticated screen after token expiration or leaving sensitive screens in the backstack after logout.",
    tryItFriction: "Build a complete Auth -> Main Tabs -> Transaction Details navigation flow with type-safe parameters and protected backstack pruning.",
    socraticHints: [
      "How do you prevent a user from pressing 'Back' to return to the dashboard after logging out?",
      "Do not call navigation.navigate('Login')! Switch the root conditional rendering based on userToken: {userToken ? <AppStack /> : <AuthStack />}",
      "Conditional stack rendering destroys the authenticated stack from memory automatically upon logout."
    ],
    situationalPuzzle: {
      scenario: "After logging out, an Android user presses the hardware back button and finds themselves back on the secret banking dashboard screen. Why did this security vulnerability occur?",
      options: [
        "Android has a bug.",
        "The developer navigated to Login using navigation.navigate() instead of resetting the navigation state, leaving the dashboard in the backstack.",
        "The screen was saved on disk.",
        "The phone was rooted."
      ],
      answerIdx: 1,
      debrief: "Imperatively navigating to Login pushes Login onto the existing stack. Conditional screen rendering ({isAuth ? <AppStack /> : <AuthStack />}) or CommonActions.reset() is required to wipe the history."
    },
    quests: [
      { id: "mobile-m1-d10-q1", name: "Authentication State Machine Navigation Flow", type: "concept", desc: "Architect conditional navigation routing driven by reactive authentication tokens." },
      { id: "mobile-m1-d10-q2", name: "Detective Lab: The Backstack Token Leak Outage", type: "detective", desc: "Eliminate post-logout history retention using navigation state reset actions." },
      { id: "mobile-m1-d10-q3", name: "Mastery Assignment: Modal Transaction Confirmation Sheet", type: "assignment", desc: "Implement native modal presentation with custom header title and dismiss gestures." },
      { id: "mobile-m1-d10-m2", name: "⭐ Milestone 2: Enterprise Banking Navigation Mesh", type: "milestone", desc: "Deliver production navigation mesh with type-safe params, modal layers, and logout pruning." }
    ]
  },
  {
    day: 11,
    month: 1,
    blockNum: 3,
    title: "Keyboard Handling & Inset Physics: KeyboardAvoidingView & Scroll Dismiss",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Native Keyboard Frame Resizing)",
    spokenGoal: "Master mobile keyboard mechanics: KeyboardAvoidingView platform behaviors (behavior: 'padding' on iOS vs 'height' on Android), keyboardVerticalOffset, and dismiss-on-drag.",
    conceptInvariant: "On iOS, the software keyboard floats above views without resizing the window. On Android, windowSoftInputMode resizes or pans the window. The behavior prop must be branched by Platform.OS.",
    failureMode: "Failing to offset inputs causes the keyboard to cover text fields, preventing users from seeing what they type or tapping Submit.",
    tryItFriction: "Configure a KeyboardAvoidingView with platform-specific behavior and keyboardShouldPersistTaps: 'handled' inside a ScrollView.",
    socraticHints: [
      "Why does tapping a Submit button while the keyboard is open dismiss the keyboard instead of submitting?",
      "ScrollView defaults to keyboardShouldPersistTaps: 'never', consuming the tap to hide the keyboard!",
      "Set keyboardShouldPersistTaps='handled' on the enclosing ScrollView."
    ],
    situationalPuzzle: {
      scenario: "On iPhone 15, focusing an input inside a modal pushes the form 100 points too high off the top of the screen. Why did this keyboard over-scroll occur?",
      options: [
        "The keyboard is too tall.",
        "KeyboardAvoidingView was applied inside a modal with a double header offset (keyboardVerticalOffset was set too high).",
        "iOS broke Flexbox.",
        "The phone needs a reboot."
      ],
      answerIdx: 1,
      debrief: "When a screen is presented inside a native modal or navigation header, keyboardVerticalOffset must match the exact header height to avoid double-padding the viewport."
    },
    quests: [
      { id: "mobile-m1-d11-q1", name: "Software Keyboard Frame Inset Mechanics", type: "concept", desc: "Trace how iOS UIKeyboardWillShowNotification and Android windowSoftInputMode resize viewports." },
      { id: "mobile-m1-d11-q2", name: "Detective Lab: The Obscured Submit Button Bug", type: "detective", desc: "Fix a registration form where the software keyboard covers the confirm button." },
      { id: "mobile-m1-d11-q3", name: "Mastery Assignment: Platform-Adaptive Form Wrapper", type: "assignment", desc: "Build KeyboardSafeContainer branching behavior between iOS padding and Android height." },
      { id: "mobile-m1-d11-q4", name: "Production Incident Lab: Trapped Keyboard Focus Outage", type: "detective", desc: "Resolve input focus lockups using Keyboard.dismiss() on background drag gestures." }
    ]
  },
  {
    day: 12,
    month: 1,
    blockNum: 3,
    title: "Controlled Mobile Inputs: Keypad Types, Number Parsing & Auto-Capitalization Invariants",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Guidance (Input Validation & Mobile Keypad Ergonomics)",
    spokenGoal: "Master mobile text inputs: keyboardType (numeric, decimal-pad, email-address), textContentType autofill, and preventing NaN currency parsing errors.",
    conceptInvariant: "Mobile users type on touch keypads with varied locale decimal separators (comma ',' vs dot '.'). Currency inputs must sanitize and parse numbers defensively.",
    failureMode: "Forgetting to set secureTextEntry, autoCapitalize='none', or autoCorrect={false} on password fields causes security leaks and auto-correct corruptions.",
    tryItFriction: "Implement an unformatted currency input that formats live dollars while storing a strict integer cent value in state.",
    socraticHints: [
      "Why did a European user typing '10,50' break the payment calculation?",
      "Many European Android keypads only provide a comma ',' for decimals! parseFloat('10,50') evaluates to 10 in standard JS.",
      "Sanitize commas to dots: value.replace(',', '.') before parsing."
    ],
    situationalPuzzle: {
      scenario: "A user pastes '1,250.00' into a transfer amount field. The app crashes with NaN or debits $1. Why did the raw input parser fail?",
      options: [
        "The bank balance was empty.",
        "The parser did not strip comma grouping separators before calling Number(), resulting in NaN.",
        "The keyboard was wrong.",
        "The screen unmounted."
      ],
      answerIdx: 1,
      debrief: "Never parse formatted display strings directly into monetary numbers. Strip currency symbols and comma separators (replace(/[^0-9.]/g, '')) before arithmetic."
    },
    quests: [
      { id: "mobile-m1-d12-q1", name: "Mobile Keypad Types & Native AutoFill", type: "concept", desc: "Configure native iOS QuickType and Android Autofill hints for passwords, emails, and OTPs." },
      { id: "mobile-m1-d12-q2", name: "Detective Lab: The Locale Decimal Comma Crash", type: "detective", desc: "Fix a payment input crash by normalizing international comma/dot decimal separators." },
      { id: "mobile-m1-d12-q3", name: "Mastery Assignment: Masked Financial Currency Field", type: "assignment", desc: "Build an integer-cent backing input with real-time currency formatting." },
      { id: "mobile-m1-d12-q4", name: "Production Incident Lab: Auto-Capitalized Password Outage", type: "detective", desc: "Remediate user login lockouts caused by default initial capital letter keyboards." }
    ]
  },
  {
    day: 13,
    month: 1,
    blockNum: 3,
    title: "Virtualized Lists: FlatList vs ScrollView, Windowing & getItemLayout",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Memory Windowing & Scroll Frame Drops)",
    spokenGoal: "Master list virtualization: understand why ScrollView renders all items in memory (crashing on 1,000 items), while FlatList windows only visible cells.",
    conceptInvariant: "FlatList maintains an off-screen render window. Providing getItemLayout skips asynchronous layout measurements, enabling instantaneous jumping to index N.",
    failureMode: "Omitting keyExtractor or using array index as key triggers entire list re-renders on item insertion, causing frame drops.",
    tryItFriction: "Implement a FlatList of 10,000 transactions with memoized renderItem, stable keyExtractor, and getItemLayout.",
    socraticHints: [
      "Why is scrolling stuttering when you scroll fast down a 500-item FlatList?",
      "The list is dynamically measuring the height of every single cell as it enters the viewport!",
      "Define getItemLayout with fixed item heights to skip all runtime cell measurements."
    ],
    situationalPuzzle: {
      scenario: "A stock trading app uses a standard ScrollView to display 2,500 real-time price updates. After 30 seconds, the app crashes with an iOS jetsam memory termination. Why?",
      options: [
        "The stock prices were negative.",
        "ScrollView mounts all 2,500 items into native RAM simultaneously, exhausting device memory limits.",
        "The network failed.",
        "The battery died."
      ],
      answerIdx: 1,
      debrief: "ScrollView has zero virtualization. It creates native UIView instances for all 2,500 rows simultaneously, rapidly exhausting mobile RAM. Virtualized lists (FlatList/FlashList) are mandatory for unbounded collections."
    },
    quests: [
      { id: "mobile-m1-d13-q1", name: "FlatList Virtualization Windowing Engine", type: "concept", desc: "Inspect windowSize, maxToRenderPerBatch, and off-screen cell unmounting." },
      { id: "mobile-m1-d13-q2", name: "Detective Lab: The Index Key Re-render Cascade", type: "detective", desc: "Eliminate full list re-rendering by replacing array index keys with stable entity IDs." },
      { id: "mobile-m1-d13-q3", name: "Mastery Assignment: High-Speed Jump-to-Date List", type: "assignment", desc: "Implement initialScrollIndex and getItemLayout for instantaneous scroll positioning." },
      { id: "mobile-m1-d13-q4", name: "Production Incident Lab: ScrollView Memory Explosion Crash", type: "detective", desc: "Refactor an unbounded ScrollView causing memory termination into an efficient FlatList." }
    ]
  },
  {
    day: 14,
    month: 1,
    blockNum: 3,
    title: "Next-Gen Cell Recycling: Shopify FlashList & Estimated Item Size Optimization",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (True Native View Recycling vs Destroy/Recreate)",
    spokenGoal: "Master FlashList: Understand why FlatList destroys and recreates native views, while FlashList recycles existing native views (like Android RecyclerView and iOS UICollectionView).",
    conceptInvariant: "FlashList recycles native views across cells. Components must handle prop updates gracefully without retaining stale local state across recycled item bindings.",
    failureMode: "Setting an incorrect estimatedItemSize causes aggressive layout recalculations and blank white spaces during fast flings.",
    tryItFriction: "Migrate a laggy FlatList to FlashList with exact estimatedItemSize, verifying 60fps scrolling under rapid fling gestures.",
    socraticHints: [
      "Why did a user avatar from row 1 briefly appear on row 42 while scrolling fast in FlashList?",
      "FlashList recycled the native view of row 1 to render row 42! If the image is loading, stale data renders until new props bind.",
      "Ensure components reset visual state or show placeholders immediately when recycled."
    ],
    situationalPuzzle: {
      scenario: "A mobile list with 100,000 items drops to 15 FPS when scrolling rapidly. FlatList is spending 80% of CPU time in native view creation and garbage collection. What is the architectural solution?",
      options: [
        "Reduce screen brightness.",
        "Switch to Shopify FlashList, which recycles existing native views instead of constantly creating and destroying them.",
        "Use static HTML in a WebView.",
        "Force the user to scroll slowly."
      ],
      answerIdx: 1,
      debrief: "Creating and destroying native views in FlatList causes high CPU allocation and GC pressure. FlashList uses true platform view recycling, maintaining 60/120 FPS under fast flings."
    },
    quests: [
      { id: "mobile-m1-d14-q1", name: "View Recycling Mechanics (FlashList vs FlatList)", type: "concept", desc: "Trace how FlashList rebinds props to existing native UIViews without layout re-allocations." },
      { id: "mobile-m1-d14-q2", name: "Detective Lab: The Recycled State Pollution Bug", type: "detective", desc: "Fix a recycled cell that retained checkbox state from a previous row." },
      { id: "mobile-m1-d14-q3", name: "Mastery Assignment: 100,000 Item High-Frequency Feed", type: "assignment", desc: "Build a FlashList feed benchmarked at 60 FPS under continuous velocity flings." },
      { id: "mobile-m1-d14-q4", name: "Production Incident Lab: Estimated Item Size Blanking Glitch", type: "detective", desc: "Eliminate blank scroll spaces by calibrating estimatedItemSize across device profiles." }
    ]
  },
  {
    day: 15,
    month: 1,
    blockNum: 3,
    title: "⭐ Milestone 3: 60 FPS Infinite Ledger Feed with Cell Recycling & Zero-Scroll Jank",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "Balanced Friction (Milestone 3 Architecture Integration)",
    spokenGoal: "Architect an enterprise infinite transaction feed featuring Shopify FlashList, date section headers, skeleton shimmer loading, and pull-to-refresh.",
    conceptInvariant: "A production feed must handle pagination boundaries (onEndReached threshold 0.5), debounce multi-page fetch requests, and preserve scroll offset on data prepend.",
    failureMode: "Calling fetchNextPage repeatedly when the user hits the bottom creates runaway network loops if isFetchingNextPage guards are missing.",
    tryItFriction: "Build a production infinite-scroll transaction feed with sticky headers and zero dropped frames.",
    socraticHints: [
      "How do you prevent onEndReached from firing five times in a row when reaching the bottom?",
      "Guard the fetch with a boolean flag: if (isLoading || !hasNextPage) return; and set onEndReachedThreshold to 0.5.",
      "Set onEndReachedThreshold={0.5} and check !isFetching before triggering pagination."
    ],
    situationalPuzzle: {
      scenario: "A user prepends 20 new transactions to the top of an infinite list. The list violently jumps down 500 points, disorienting the user. What property maintains scroll stability?",
      options: [
        "Disable new items.",
        "maintainVisibleContentPosition on ScrollView/FlatList, which automatically adjusts scroll offset so visible content remains anchored.",
        "Use window.scrollTo().",
        "Reload the app."
      ],
      answerIdx: 1,
      debrief: "maintainVisibleContentPosition instructs the layout engine to track the currently visible item index and adjust scroll offset proportionally when new rows are prepended."
    },
    quests: [
      { id: "mobile-m1-d15-q1", name: "Infinite Pagination State Machine", type: "concept", desc: "Design pagination states: Idle, FetchingNextPage, Refreshing, and Exhausted." },
      { id: "mobile-m1-d15-q2", name: "Detective Lab: The Runaway Pagination Loop Outage", type: "detective", desc: "Fix onEndReached trigger storm that fired 40 duplicate API calls in 2 seconds." },
      { id: "mobile-m1-d15-q3", name: "Mastery Assignment: Sticky Date Section Header Feed", type: "assignment", desc: "Implement sticky header dates grouping financial transactions chronologically." },
      { id: "mobile-m1-d15-m3", name: "⭐ Milestone 3: 60 FPS Production Infinite Ledger Feed", type: "milestone", desc: "Deliver 60 FPS infinite transaction feed with FlashList recycling, pagination, and sticky headers." }
    ]
  },
  {
    day: 16,
    month: 1,
    blockNum: 4,
    title: "Local Mobile Storage: AsyncStorage JSON Serialization Bottlenecks vs MMKV Storage",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Guidance (Storage Engine Latency & Serialization Overhead)",
    spokenGoal: "Master local mobile persistence: Understand why legacy AsyncStorage is slow (asynchronous JSON string serialization over the bridge) and why MMKV is 30x faster (C++ memory-mapped mmap files).",
    conceptInvariant: "AsyncStorage reads require async/await bridge trips. MMKV provides synchronous memory-mapped direct C++ reads (storage.getString('token')), eliminating promise overhead on app launch.",
    failureMode: "Writing massive state blobs (>10MB) into AsyncStorage on the UI thread causes severe frame drops and launch lag.",
    tryItFriction: "Benchmark MMKV vs AsyncStorage for 1,000 read/write operations and verify zero bridge serialization overhead.",
    socraticHints: [
      "Why is reading an auth token from MMKV synchronous while AsyncStorage requires an async await?",
      "MMKV uses the C++ mmap() system call to map the disk file directly into process RAM via JSI!",
      "Use MMKV: const token = storage.getString('auth_token') synchronously without async/await."
    ],
    situationalPuzzle: {
      scenario: "A mobile banking app takes 2.5 seconds to show the home screen because it awaits 15 separate AsyncStorage.getItem() calls during splash screen startup. What is the architectural remediation?",
      options: [
        "Remove authentication.",
        "Migrate to MMKV for synchronous instant memory-mapped config reads on startup, cutting cold launch time to <100ms.",
        "Use a text file.",
        "Increase CPU clock."
      ],
      answerIdx: 1,
      debrief: "AsyncStorage serializes strings through the bridge asynchronously. MMKV uses direct C++ memory-mapped files (mmap), delivering synchronous zero-overhead reads on startup."
    },
    quests: [
      { id: "mobile-m1-d16-q1", name: "Memory-Mapped I/O (mmap) vs Bridge Storage", type: "concept", desc: "Trace how MMKV bypasses JSON serialization via C++ direct memory pointers." },
      { id: "mobile-m1-d16-q2", name: "Detective Lab: The AsyncStorage Cold-Start Lag Bottleneck", type: "detective", desc: "Profile and eliminate 2-second launch lag by migrating auth tokens to MMKV." },
      { id: "mobile-m1-d16-q3", name: "Mastery Assignment: Type-Safe Synchronous Key-Value Storage", type: "assignment", desc: "Build a type-safe wrapper over MMKV with schema-validated get/set methods." },
      { id: "mobile-m1-d16-q4", name: "Production Incident Lab: Unbounded Cache Disk Bloat", type: "detective", desc: "Implement LRU eviction on local mobile storage to enforce a strict 50MB disk ceiling." }
    ]
  },
  {
    day: 17,
    month: 1,
    blockNum: 4,
    title: "Global Mobile State: Zustand Store Slices, Selectors & Re-Render Elimination",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "Balanced Friction (Mobile State Reactivity & Selector Memoization)",
    spokenGoal: "Master global mobile state with Zustand: Store slice modularization, atomic selector subscriptions, and preventing full-app re-renders on high-frequency price updates.",
    conceptInvariant: "In mobile apps, components must only re-render when the exact primitive slice they display changes. Using non-selective useStore() re-renders the entire screen on every tick.",
    failureMode: "Calling useStore() without a selector causes unrelated components to re-render, killing battery life and dropping UI frames.",
    tryItFriction: "Refactor an unoptimized store subscription using granular atomic selectors and shallow equality comparisons.",
    socraticHints: [
      "Why is the entire profile screen re-rendering when a live stock price ticks in the background?",
      "Because the profile component subscribed to the entire state store instead of just useStore(state => state.userProfile)!",
      "Always use atomic selectors: const username = useStore(state => state.username);"
    ],
    situationalPuzzle: {
      scenario: "A crypto price ticker updates 20 times per second. The entire transaction history screen stutters and drops to 20 FPS. Profiling shows 50 components re-rendering on every price update. Why?",
      options: [
        "React Native cannot handle 20 updates/sec.",
        "Components subscribed to the whole store: const { prices, history } = useStore(). Changes to prices trigger re-renders in history components.",
        "Hermes crashed.",
        "The screen was dirty."
      ],
      answerIdx: 1,
      debrief: "Components that destructure from useStore() subscribe to all state changes. Using fine-grained selectors (const price = useStore(s => s.btcPrice)) isolates re-renders to only the price badge."
    },
    quests: [
      { id: "mobile-m1-d17-q1", name: "Zustand Reactive Subscription Mechanics", type: "concept", desc: "Trace how Zustand uses listeners outside React to notify only matching selector subscribers." },
      { id: "mobile-m1-d17-q2", name: "Detective Lab: The Full-Tree Re-Render Avalanche", type: "detective", desc: "Isolate and fix non-selective store subscriptions causing frame drops during live updates." },
      { id: "mobile-m1-d17-q3", name: "Mastery Assignment: Enterprise Multi-Slice Store Architecture", type: "assignment", desc: "Construct modular Zustand store combining AuthSlice, WalletSlice, and SettingsSlice." },
      { id: "mobile-m1-d17-q4", name: "Production Incident Lab: Stale State Closure Memory Leak", type: "detective", desc: "Remediate stale closure bugs in background async thunks using getState()." }
    ]
  },
  {
    day: 18,
    month: 1,
    blockNum: 4,
    title: "Relational Mobile Storage: Embedded SQLite (expo-sqlite), Schema DDL & Prepared Queries",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "Balanced Friction (Local Relational Databases & SQL Schema Invariants)",
    spokenGoal: "Master local relational databases on mobile: embedded SQLite, schema versioning migrations, foreign key constraints, and parameterized queries.",
    conceptInvariant: "Mobile apps require local relational databases to store structured transaction histories and offline balances. All queries must use parameterized inputs to prevent SQL injection.",
    failureMode: "Running unindexed queries on a 50,000-row local SQLite database freezes the mobile UI thread during complex joins.",
    tryItFriction: "Initialize an SQLite database with schema migrations, foreign keys enabled (PRAGMA foreign_keys = ON), and indexed timestamps.",
    socraticHints: [
      "Why are local SQLite queries taking 300ms on a device with only 10,000 transactions?",
      "The 'WHERE account_id = ?' query is doing a full table scan because there is no INDEX on account_id!",
      "Execute: CREATE INDEX idx_tx_account ON transactions(account_id);"
    ],
    situationalPuzzle: {
      scenario: "A user goes offline in an airplane and searches their transaction history. The query takes 800ms and freezes the UI because the query ran synchronously on the main thread. How do you fix it?",
      options: [
        "Disable search offline.",
        "Run SQLite queries asynchronously using expo-sqlite modern async API with indexes, offloading I/O from the main thread.",
        "Store everything in memory.",
        "Delete old transactions."
      ],
      answerIdx: 1,
      debrief: "Heavy database I/O must execute asynchronously off the UI thread, and searchable columns must have B-tree indexes to maintain sub-16ms query times."
    },
    quests: [
      { id: "mobile-m1-d18-q1", name: "Embedded SQLite Mobile Architecture", type: "concept", desc: "Inspect how expo-sqlite bridges SQLite C-libraries directly into mobile process storage." },
      { id: "mobile-m1-d18-q2", name: "Detective Lab: The Unindexed Full Table Scan Lockup", type: "detective", desc: "Diagnose slow queries using EXPLAIN QUERY PLAN and add optimal B-tree indexes." },
      { id: "mobile-m1-d18-q3", name: "Mastery Assignment: Schema Migration Runner for Mobile", type: "assignment", desc: "Build an automatic SQLite schema migration engine tracking user_version pragma." },
      { id: "mobile-m1-d18-q4", name: "Production Incident Lab: Database Lock Contention Defect", type: "detective", desc: "Resolve SQLite busy lock errors by implementing write-ahead logging (PRAGMA journal_mode=WAL)." }
    ]
  },
  {
    day: 19,
    month: 1,
    blockNum: 4,
    title: "Offline-First Data Architecture: Local DB Read-Write, Mutation Queues & Optimistic Updates",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Optimistic UI State & Rollback Invariants)",
    spokenGoal: "Master offline-first mobile architecture: optimistic UI updates, persistent mutation queues in SQLite, and transactional rollbacks on server rejection.",
    conceptInvariant: "In a world-class mobile app, UI actions (like sending money or liking a post) reflect instantly on screen; the mutation is queued in local SQLite and synced when connectivity returns.",
    failureMode: "Applying an optimistic update without a rollback mechanism leaves false balances displayed if the server rejects the payment.",
    tryItFriction: "Implement an optimistic transaction transfer that updates the UI immediately, queues the sync in SQLite, and rolls back cleanly on 400 Bad Request.",
    socraticHints: [
      "What happens if the user creates a transaction offline, but closes the app before the server syncs?",
      "If the mutation was only in memory, it is LOST forever! The mutation MUST be written to an SQLite 'outbox' table immediately.",
      "Persist the mutation to local SQLite with status='PENDING' before triggering network sync."
    ],
    situationalPuzzle: {
      scenario: "A mobile user on a spotty subway connection sends $100. The app displays $900 balance immediately. The server responds with 402 Insufficient Funds. How does the app handle the failure?",
      options: [
        "Crash the app.",
        "Revert the optimistic state: restore balance to $1000, mark the queued mutation as FAILED, and show an actionable error banner.",
        "Keep the false $900 balance.",
        "Clear all local data."
      ],
      answerIdx: 1,
      debrief: "Optimistic updates require strict compensation logic. When the server rejects a queued mutation, the client must roll back local state to the pre-mutation snapshot and alert the user."
    },
    quests: [
      { id: "mobile-m1-d19-q1", name: "Offline Outbox Pattern Architecture", type: "concept", desc: "Design the persistent mutation queue state machine: PENDING -> IN_FLIGHT -> ACKED -> FAILED." },
      { id: "mobile-m1-d19-q2", name: "Detective Lab: The Desynchronized Phantom Balance Bug", type: "detective", desc: "Implement rollback compensation logic after an optimistic mutation is rejected by the server." },
      { id: "mobile-m1-d19-q3", name: "Mastery Assignment: Background Sync Outbox Dispatcher", type: "assignment", desc: "Build an automatic sync worker that flushes queued SQLite mutations upon network reconnection." },
      { id: "mobile-m1-d19-q4", name: "Production Incident Lab: Duplicate Mutation Replay Outage", type: "detective", desc: "Attach idempotency keys to queued mutations to prevent duplicate debits on retry." }
    ]
  },
  {
    day: 20,
    month: 1,
    blockNum: 4,
    title: "⭐ Milestone 4: Offline-First Transactional Expense Tracker with SQLite & MMKV Cache",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "Balanced Friction (Milestone 4 Architecture Integration)",
    spokenGoal: "Architect an enterprise offline-first financial ledger app with local SQLite persistence, MMKV session caching, and background sync queues.",
    conceptInvariant: "The application must function with 100% operational fidelity in Airplane Mode: creating, editing, and querying transactions without throwing network errors.",
    failureMode: "Blocking the UI while waiting for network timeouts when offline violates mobile resilience standards.",
    tryItFriction: "Deliver a complete offline expense tracker with instant UI responses and background synchronization.",
    socraticHints: [
      "How do you detect whether the app is offline before firing an HTTP request?",
      "Use @react-native-community/netinfo to check state.isConnected, or attempt fetch with an immediate timeout to fallback to the offline queue.",
      "Check NetInfo.fetch() and route immediately to the SQLite outbox queue when offline."
    ],
    situationalPuzzle: {
      scenario: "An auditor tests your banking app by switching to Airplane Mode and creating 5 transactions. When Airplane Mode is turned off, all 5 transactions sync in order with 0 duplicates. What architectural pattern proved this?",
      options: [
        "WebSockets.",
        "The Offline-First Outbox Pattern with persistent SQLite storage and idempotent replay tokens.",
        "Local cookies.",
        "Browser localStorage."
      ],
      answerIdx: 1,
      debrief: "The Outbox pattern guarantees eventual consistency by persisting mutations locally in SQLite first, assigning unique idempotency keys, and replaying them deterministically when connectivity resumes."
    },
    quests: [
      { id: "mobile-m1-d20-q1", name: "Offline-First Data Synchronization Topology", type: "concept", desc: "Trace end-to-end data flow: Local SQLite Write -> UI Commit -> Network Sync -> Server Reconciliation." },
      { id: "mobile-m1-d20-q2", name: "Detective Lab: The Airplane Mode Network Hang Glitch", type: "detective", desc: "Bypass 60-second default HTTP timeout by short-circuiting to the offline queue when offline." },
      { id: "mobile-m1-d20-q3", name: "Mastery Assignment: Full SQLite Transaction Ledger Model", type: "assignment", desc: "Implement ACID transactions across double-entry expense and category tables in SQLite." },
      { id: "mobile-m1-d20-m4", name: "⭐ Milestone 4: Enterprise Offline-First Ledger Engine", type: "milestone", desc: "Deliver complete offline-first ledger app with SQLite persistence, MMKV caching, and sync queues." }
    ]
  },
  {
    day: 21,
    month: 1,
    blockNum: 5,
    title: "Mobile Permission Lifecycles: Foreground vs Background & Blocked Fallback Flows",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Guidance (Platform Permission Policies & App Store Compliance)",
    spokenGoal: "Master mobile device permissions: iOS Info.plist usage descriptions, Android runtime permissions, permission status states (UNDETERMINED, GRANTED, DENIED, BLOCKED), and deep linking to system settings.",
    conceptInvariant: "Never request sensitive permissions on app cold-start. Explain the value proposition first ('Pre-Permission Primer'). Once a user selects 'Never Ask Again', you must direct them to OS Settings via Linking.openSettings().",
    failureMode: "Requesting permissions without purpose strings in Info.plist causes Apple App Store review rejection or instant app crash.",
    tryItFriction: "Implement a complete permission flow handling GRANTED, DENIED, and BLOCKED states with custom primer dialogs.",
    socraticHints: [
      "Why did the app crash on iOS the moment Camera.requestCameraPermissionAsync() was called?",
      "iOS requires an NSCameraUsageDescription string in Info.plist! If omitted, the OS terminates the app instantly for privacy violation.",
      "Add NSCameraUsageDescription with an explicit rationale in app.json / Info.plist."
    ],
    situationalPuzzle: {
      scenario: "A user repeatedly taps 'Deny' on the location prompt. The next time the app calls requestPermission(), the system dialog never appears and status returns DENIED immediately. How do you recover?",
      options: [
        "Keep calling requestPermission in an infinite loop.",
        "Detect status === 'BLOCKED' (or canAskAgain === false) and show a custom modal with a button calling Linking.openSettings().",
        "Delete the app.",
        "Reboot the phone."
      ],
      answerIdx: 1,
      debrief: "Once the OS marks a permission as permanently blocked, requestPermission() no longer shows system dialogs. The only way forward is prompting the user to manually enable it in device Settings via Linking.openSettings()."
    },
    quests: [
      { id: "mobile-m1-d21-q1", name: "Mobile Privacy & Permission State Machine", type: "concept", desc: "Map permission transitions: Undetermined -> Primer -> System Prompt -> Granted / Blocked." },
      { id: "mobile-m1-d21-q2", name: "Detective Lab: The Missing Info.plist Termination Crash", type: "detective", desc: "Fix an instant iOS launch crash caused by missing privacy permission description strings." },
      { id: "mobile-m1-d21-q3", name: "Mastery Assignment: Pre-Permission UX Primer Screen", type: "assignment", desc: "Build an educational modal explaining camera usage before triggering the OS prompt." },
      { id: "mobile-m1-d21-q4", name: "Production Incident Lab: Permanently Blocked Permission Deadlock", type: "detective", desc: "Implement Linking.openSettings() fallback flow when canAskAgain is false." }
    ]
  },
  {
    day: 22,
    month: 1,
    blockNum: 5,
    title: "Native Camera & Photo Library: CameraView Invariants, Compression & Temp File URIs",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Hardware Camera Streams & File URIs)",
    spokenGoal: "Master native media capture: CameraView barcode scanning, taking high-res photos, image compression (quality: 0.7), and temporary file URI management.",
    conceptInvariant: "Photos taken by the camera are saved to temporary cache storage (file://.../Camera/...). Temporary files can be purged by the OS under storage pressure; critical assets must be copied to documentDirectory.",
    failureMode: "Uploading raw uncompressed 12MP photos (15MB each) drains user cellular data and causes HTTP 413 Payload Too Large errors.",
    tryItFriction: "Capture a photo, compress it using ImageManipulator to under 500KB, copy it to permanent document storage, and display a thumbnail.",
    socraticHints: [
      "Why did a receipt photo taken yesterday disappear from the app today?",
      "You left it in cacheDirectory (temporary storage)! The OS automatically deleted it to free up disk space.",
      "Move the captured photo to FileSystem.documentDirectory for permanent persistence."
    ],
    situationalPuzzle: {
      scenario: "An expense reporting app allows users to photograph receipts. Users complain that uploading 5 receipts burns 100MB of mobile data and fails on 3G networks. What is the client-side solution?",
      options: [
        "Tell users to connect to fiber internet.",
        "Compress and resize images on device before upload using expo-image-manipulator (quality 0.7, max width 1600px), reducing upload payload by 95%.",
        "Only allow text receipts.",
        "Upload raw HEIC files."
      ],
      answerIdx: 1,
      debrief: "Modern smartphone cameras produce 10-20MB raw images. Compressing on-device before transmission reduces upload payload to ~300KB with zero perceptual loss for receipt auditing."
    },
    quests: [
      { id: "mobile-m1-d22-q1", name: "Camera Sensor Pipeline & Temp File Storage", type: "concept", desc: "Trace photo capture: Hardware Sensor -> Buffer -> Temp File URI -> Document Storage." },
      { id: "mobile-m1-d22-q2", name: "Detective Lab: The Disappearing Receipt Cache Purge", type: "detective", desc: "Resolve lost image attachments by moving files from cacheDirectory to documentDirectory." },
      { id: "mobile-m1-d22-q3", name: "Mastery Assignment: On-Device Receipt Image Optimizer", type: "assignment", desc: "Compress and resize camera captures to <500KB with auto-rotation exif correction." },
      { id: "mobile-m1-d22-q4", name: "Production Incident Lab: Cellular Data Upload Exhaustion", type: "detective", desc: "Enforce maximum payload bounds on multi-part file uploads over cellular connections." }
    ]
  },
  {
    day: 23,
    month: 1,
    blockNum: 5,
    title: "Native Geolocation: Foreground GPS Coordinates, Geofencing & Battery Optimization",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "Balanced Friction (Hardware GPS Radio & Battery Drain)",
    spokenGoal: "Master mobile geolocation: Foreground location tracking (Accuracy.Balanced vs Accuracy.High), geofencing radii, and battery consumption trade-offs.",
    conceptInvariant: "Hardware GPS chips consume significant battery power. Apps must request location with appropriate accuracy (e.g. Balanced / 100m for city search vs High / 10m for navigation) and stop listening immediately when done.",
    failureMode: "Leaving an active watchPositionAsync GPS listener running continuously in the background drains 40% of the device battery in an hour.",
    tryItFriction: "Implement a location-aware merchant finder that queries current coordinates once with a 5-second timeout, then powers down the GPS radio.",
    socraticHints: [
      "Why is the user battery draining rapidly while using your app?",
      "You called watchPositionAsync() but never called remove() on the subscription, keeping the GPS hardware radio permanently powered on!",
      "Save the subscription in a ref and call subscription.remove() when unmounting."
    ],
    situationalPuzzle: {
      scenario: "A mobile banking app needs the user city to verify ATMs. The developer requests Accuracy.Highest with continuous GPS tracking. Apple rejects the app in App Store review. Why?",
      options: [
        "Apple does not allow location in banking apps.",
        "The app requested excessive GPS precision without justification, violating Apple Human Interface Guidelines for battery and privacy. Location should be coarse and one-time.",
        "The developer did not pay Apple.",
        "Android requires it."
      ],
      answerIdx: 1,
      debrief: "App Store review guidelines mandate that apps request only the minimal necessary location accuracy. Continuous high-accuracy GPS for non-navigation apps is flagged for excessive battery consumption."
    },
    quests: [
      { id: "mobile-m1-d23-q1", name: "Hardware GPS Radio Power States", type: "concept", desc: "Analyze battery consumption across GPS High, Balanced, and Cell-Tower coarse location modes." },
      { id: "mobile-m1-d23-q2", name: "Detective Lab: The Leaking GPS Radio Battery Drain", type: "detective", desc: "Locate an uncancelled watchPositionAsync listener and implement automatic power-down cleanup." },
      { id: "mobile-m1-d23-q3", name: "Mastery Assignment: One-Shot Location Timeout Guard", type: "assignment", desc: "Build getCurrentPosition with a 5-second fallback timeout for poor satellite signal environments." },
      { id: "mobile-m1-d23-q4", name: "Production Incident Lab: App Store Location Rejection Audit", type: "detective", desc: "Downgrade continuous GPS tracking to low-power opportunistic cell geocoding." }
    ]
  },
  {
    day: 24,
    month: 1,
    blockNum: 5,
    title: "Biometric Authentication: LocalAuthentication (FaceID, TouchID, Android BiometricPrompt)",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Guidance (Hardware Secure Enclave & Biometric Invariants)",
    spokenGoal: "Master native biometric authentication: expo-local-authentication, FaceID / TouchID / Android BiometricPrompt, hardware availability checking, and fallback to system PIN.",
    conceptInvariant: "Biometric authentication verifies local user presence via the Secure Enclave / TEE without ever exposing raw biometric templates to JavaScript. Never rely on biometrics alone; provide PIN fallback.",
    failureMode: "Assuming biometrics are always available without checking hasHardwareAsync() and isEnrolledAsync() causes silent authentication failures on budget devices.",
    tryItFriction: "Implement a biometric login gate that verifies FaceID/Biometrics, falls back gracefully to a custom PIN keypad, and locks after 3 failed attempts.",
    socraticHints: [
      "Why did authenticateAsync() fail silently on an Android budget phone?",
      "The phone either lacks fingerprint hardware or the user has never registered fingerprints in device settings!",
      "Always verify both hasHardwareAsync() and isEnrolledAsync() before prompting."
    ],
    situationalPuzzle: {
      scenario: "A user disables FaceID in iOS Settings. When opening the banking app, the biometric prompt throws an unhandled error and freezes the app. How must the app respond?",
      options: [
        "Force the user to enable FaceID.",
        "Catch the NOT_ENROLLED error and route immediately to the PIN / Password entry screen.",
        "Crash the app.",
        "Delete the user account."
      ],
      answerIdx: 1,
      debrief: "Biometric hardware state can change at any time (e.g. user resets biometrics). Apps must treat biometric auth as a convenience layer and provide robust fallback to master password or PIN."
    },
    quests: [
      { id: "mobile-m1-d24-q1", name: "Secure Enclave Biometric Topology", type: "concept", desc: "Trace biometric verification: Sensor -> Secure Enclave -> OS Auth Token -> JS Boolean Result." },
      { id: "mobile-m1-d24-q2", name: "Detective Lab: The Missing Biometric Enrollment Crash", type: "detective", desc: "Handle devices with no biometrics configured by falling back seamlessly to PIN entry." },
      { id: "mobile-m1-d24-q3", name: "Mastery Assignment: Biometric Vault Auth Screen", type: "assignment", desc: "Build an authentication screen triggering FaceID with fallback PIN prompt and lockout timers." },
      { id: "mobile-m1-d24-q4", name: "Production Incident Lab: App Backgrounding Biometric Leak", type: "detective", desc: "Obscure banking screen content in the iOS app switcher when entering the background." }
    ]
  },
  {
    day: 25,
    month: 1,
    blockNum: 5,
    title: "⭐ Milestone 5: Biometric Secure Hardware Media Vault with Offline Metadata Tagging",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "Balanced Friction (Milestone 5 Architecture Integration)",
    spokenGoal: "Architect an enterprise hardware vault application combining FaceID/Biometric authentication, camera receipt scanning, image compression, and SQLite encrypted metadata storage.",
    conceptInvariant: "The vault must automatically lock itself when the app moves to the background (AppState === 'background'), blurring the screen in the native iOS multitasking switcher.",
    failureMode: "Leaving decrypted assets visible in the multitasking preview thumbnail exposes sensitive financial documents to shoulder surfers.",
    tryItFriction: "Deliver a complete biometric-protected receipt vault that encrypts metadata and clears memory on app backgrounding.",
    socraticHints: [
      "How do you prevent sensitive banking details from appearing in the iOS multitasking app switcher?",
      "Listen to AppState: when status moves to 'inactive' or 'background', render a solid blur overlay or blank screen!",
      "Render an overlay screen whenever AppState.currentState !== 'active'."
    ],
    situationalPuzzle: {
      scenario: "An auditor takes a screenshot of the iOS app switcher and sees a user bank balance and receipt clearly visible in the preview thumbnail. What security invariant was violated?",
      options: [
        "The screen was too bright.",
        "The app failed to obscure sensitive content when moving from active to background state.",
        "iOS has a security flaw.",
        "The user must lock the phone."
      ],
      answerIdx: 1,
      debrief: "Financial mobile applications must listen to AppState change events and render a privacy shield or blur view before the OS captures the multitasking preview screenshot."
    },
    quests: [
      { id: "mobile-m1-d25-q1", name: "Hardware Vault Architecture & AppState", type: "concept", desc: "Design automatic vault locking based on AppState transitions (active -> background)." },
      { id: "mobile-m1-d25-q2", name: "Detective Lab: The Multitasking Switcher Privacy Leak", type: "detective", desc: "Render a privacy blur shield before the OS captures the background app snapshot." },
      { id: "mobile-m1-d25-q3", name: "Mastery Assignment: Encrypted Receipt Metadata Tagging", type: "assignment", desc: "Capture receipts, compress to 300KB, and persist with category tags in SQLite." },
      { id: "mobile-m1-d25-m5", name: "⭐ Milestone 5: Enterprise Biometric Hardware Media Vault", type: "milestone", desc: "Deliver secure biometric vault with camera capture, background auto-lock, and offline SQLite storage." }
    ]
  },
  {
    day: 26,
    month: 1,
    blockNum: 6,
    title: "Network Connectivity Awareness: NetInfo, Offline Banners & Exponential Backoff Retries",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Guidance (Cellular Flakiness & Network State Machines)",
    spokenGoal: "Master mobile network resilience: NetInfo connection monitoring, detecting expensive cellular vs wifi connections, offline banner state machines, and exponential backoff retry algorithms.",
    conceptInvariant: "Mobile devices switch continuously between 5G, Wi-Fi, and dead zones. Apps must handle network failures gracefully without spamming servers or hanging infinite loading spinners.",
    failureMode: "Retrying failed network requests in an immediate tight while loop drains battery and triggers server-side rate limits (HTTP 429).",
    tryItFriction: "Implement an exponential backoff retry utility with jitter: wait = min(1000 * 2^attempt + rand, 30000).",
    socraticHints: [
      "Why must exponential backoff include random 'jitter'?",
      "Without jitter, 10,000 mobile clients whose connections dropped simultaneously will all retry at the EXACT same millisecond, crushing the server with a thundering herd!",
      "Add a random offset to the retry delay: delay + Math.random() * 500."
    ],
    situationalPuzzle: {
      scenario: "A mobile app enters a tunnel and loses signal. The active network request hangs for 120 seconds because no timeout was configured. The user thinks the app is frozen. What is the standard mobile timeout rule?",
      options: [
        "Wait indefinitely.",
        "Enforce an AbortController timeout of 10-15 seconds on mobile HTTP requests, failing fast to trigger retry or offline fallback.",
        "Crash immediately.",
        "Disable mobile data."
      ],
      answerIdx: 1,
      debrief: "Default fetch() has no timeout in JavaScript. On flaky mobile networks, connections hang in limbo for minutes. Always attach an AbortController with a 10-15s timeout."
    },
    quests: [
      { id: "mobile-m1-d26-q1", name: "Mobile Cellular State Transition Topology", type: "concept", desc: "Analyze NetInfo transitions: Wi-Fi -> Cellular -> None -> Reconnected." },
      { id: "mobile-m1-d26-q2", name: "Detective Lab: The Thundering Herd Retry Storm", type: "detective", desc: "Refactor a naive retry loop into exponential backoff with randomized jitter." },
      { id: "mobile-m1-d26-q3", name: "Mastery Assignment: Global Offline Connectivity Banner", type: "assignment", desc: "Build an animated non-blocking top banner alerting users when network connectivity is lost." },
      { id: "mobile-m1-d26-q4", name: "Production Incident Lab: Hanging HTTP Connection Leak", type: "detective", desc: "Implement AbortController timeout guards across all mobile API client endpoints." }
    ]
  },
  {
    day: 27,
    month: 1,
    blockNum: 6,
    title: "Mobile Accessibility (a11y): VoiceOver, TalkBack, Accessible Roles & 48dp Touch Targets",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Guidance (Screen Readers & Assistive Technology Standards)",
    spokenGoal: "Master mobile accessibility: iOS VoiceOver and Android TalkBack screen readers, accessibilityLabel, accessibilityHint, accessibilityRole ('button', 'header'), and WCAG 48x48dp minimum touch bounds.",
    conceptInvariant: "Mobile apps must be 100% navigable by visually impaired users. Every icon button must have a clear accessibilityLabel ('Close modal', not 'icon-x'). Avoid redundant labels like 'Close button button'.",
    failureMode: "Writing accessibilityLabel='Delete button' when accessibilityRole='button' causes screen readers to announce: 'Delete button, button', annoying users.",
    tryItFriction: "Audit and refactor an entire banking dashboard to pass 100% of iOS Accessibility Inspector and Android Accessibility Scanner checks.",
    socraticHints: [
      "Why did the screen reader announce 'Cart, image, button' for a single icon?",
      "The developer wrote accessibilityLabel='Cart image' and accessibilityRole='button'! Screen readers announce roles automatically.",
      "Set accessibilityLabel='Cart' without repeating the word image or button."
    ],
    situationalPuzzle: {
      scenario: "An enterprise mobile app faces a legal accessibility lawsuit because a blind user cannot navigate the checkout flow. VoiceOver skips the 'Pay Now' button entirely. Why did VoiceOver ignore the button?",
      options: [
        "VoiceOver is broken.",
        "The button was built with a bare View without accessible={true} or accessibilityRole='button', so the screen reader treated it as invisible decorative layout.",
        "The button was too small.",
        "The screen was dark."
      ],
      answerIdx: 1,
      debrief: "Custom interactive views must declare accessible={true} and accessibilityRole='button' to be recognized in the native accessibility tree by VoiceOver and TalkBack."
    },
    quests: [
      { id: "mobile-m1-d27-q1", name: "Native Accessibility Tree Architecture", type: "concept", desc: "Trace how accessible props map to native iOS UIAccessibility and Android AccessibilityNodeInfo." },
      { id: "mobile-m1-d27-q2", name: "Detective Lab: The Invisible Screen Reader Action", type: "detective", desc: "Make custom icon buttons accessible to VoiceOver with descriptive labels and correct roles." },
      { id: "mobile-m1-d27-q3", name: "Mastery Assignment: Fully Accessible Financial Account Card", type: "assignment", desc: "Build an accessible card announcing balance, currency, and change percentage cohesively." },
      { id: "mobile-m1-d27-q4", name: "Production Incident Lab: Sub-48dp Touch Target Violation", type: "detective", desc: "Expand all interactive touch bounds to 48x48dp to pass automated store accessibility audits." }
    ]
  },
  {
    day: 28,
    month: 1,
    blockNum: 6,
    title: "Mobile UI State Machines: Shimmer Skeletons, Error Boundaries & Pull-to-Refresh",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Balanced Friction (UI State Discipline & Perception Optimization)",
    spokenGoal: "Master mobile UI states: The 4 fundamental states (Loading Skeleton, Content, Empty State, Error Recovery), Error Boundaries preventing full-app crashes, and native RefreshControl pull-to-refresh.",
    conceptInvariant: "Never show blank white screens or single tiny spinners. Shimmer skeleton screens give users immediate structural expectations, improving perceived performance by 40%.",
    failureMode: "A single unhandled JavaScript error in a child component crashing the entire application into a native white screen.",
    tryItFriction: "Implement a React ErrorBoundary that catches render exceptions, logs to Sentry, and renders a friendly recovery screen with a 'Reload' button.",
    socraticHints: [
      "Why is a Shimmer skeleton better than a centered ActivityIndicator spinner?",
      "Skeletons match the exact layout of incoming content, preventing disorienting layout shifts and reducing perceived wait time!",
      "Render animated layout skeletons matching the shape of the incoming transaction cards."
    ],
    situationalPuzzle: {
      scenario: "A single corrupted transaction in a list throws 'TypeError: Cannot read property 'toFixed' of undefined' during render. The entire mobile app crashes to the phone home screen. How should this be isolated?",
      options: [
        "Reboot the server.",
        "Wrap list items in a component Error Boundary that catches the render error, displays a fallback card ('Item unavailable'), and keeps the rest of the app functional.",
        "Disable decimals.",
        "Delete the account."
      ],
      answerIdx: 1,
      debrief: "Component-level Error Boundaries isolate rendering failures, preventing a single malformed data item from crashing the entire application."
    },
    quests: [
      { id: "mobile-m1-d28-q1", name: "The 4-State Mobile UI Model", type: "concept", desc: "Design strict component state representations: Loading (Skeleton), Success, Empty, and Error." },
      { id: "mobile-m1-d28-q2", name: "Detective Lab: The Fatal Render Exception Crash", type: "detective", desc: "Trap a component crash using a React ErrorBoundary and render a recovery fallback UI." },
      { id: "mobile-m1-d28-q3", name: "Mastery Assignment: Native Pull-to-Refresh Integration", type: "assignment", desc: "Add RefreshControl to a scrollable feed with haptic feedback on pull trigger." },
      { id: "mobile-m1-d28-q4", name: "Production Incident Lab: Empty State Engagement Drop", type: "detective", desc: "Replace blank empty lists with actionable illustrated empty states and call-to-actions." }
    ]
  },
  {
    day: 29,
    month: 1,
    blockNum: 6,
    title: "Production Refactoring: Memory Leak Scans, Unmounted State Updates & Clean Architecture",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Code Smells, Memory Leaks & Architectural Hygiene)",
    spokenGoal: "Master enterprise mobile codebase hardening: Eliminating memory leaks (clearing timers and listeners in useEffect), stopping 'Can't perform a React state update on an unmounted component', and clean feature-sliced architecture.",
    conceptInvariant: "Mobile devices keep apps running in background memory for days. Unclosed WebSocket connections, lingering setInterval timers, and retained closures accumulate RAM until the OS terminates the process.",
    failureMode: "Navigating away from a screen while an async API call is in flight, triggering state updates on the unmounted screen and leaking memory.",
    tryItFriction: "Audit a messy mobile codebase: convert inline styles to memoized StyleSheets, clean up all async subscriptions, and modularize into Domain/Data/Presentation layers.",
    socraticHints: [
      "Why did React Native warn: 'Can't perform a React state update on an unmounted component'?",
      "An async fetch finished AFTER the user pressed Back and closed the screen, attempting to call setState on a destroyed component!",
      "Use an isMounted ref or an AbortController to cancel in-flight requests when the component unmounts."
    ],
    situationalPuzzle: {
      scenario: "An app's memory usage steadily increases by 15MB every time the user opens and closes the Chat screen. After 10 visits, the app crashes. What is leaking?",
      options: [
        "The chat messages are too long.",
        "The Chat screen registers an event listener on a global event bus in useEffect but never removes it on unmount, retaining the entire screen component tree in memory.",
        "The phone is out of storage.",
        "Hermes is corrupt."
      ],
      answerIdx: 1,
      debrief: "Failing to unsubscribe from event emitters, timers, or navigation listeners prevents garbage collection of the unmounted component, causing steady memory growth (retain cycles)."
    },
    quests: [
      { id: "mobile-m1-d29-q1", name: "Mobile Memory Leak & Retain Cycle Topology", type: "concept", desc: "Trace how unremoved closures in useEffect keep entire native screen trees alive in RAM." },
      { id: "mobile-m1-d29-q2", name: "Detective Lab: The Unmounted Component State Leak", type: "detective", desc: "Cancel in-flight network promises using AbortController on screen unmount." },
      { id: "mobile-m1-d29-q3", name: "Mastery Assignment: Feature-Sliced Mobile Architecture Refactor", type: "assignment", desc: "Refactor a monolithic screen into Clean Architecture: Presentation, Domain Entity, and Repository." },
      { id: "mobile-m1-d29-q4", name: "Production Incident Lab: Retained Event Emitter Memory Outage", type: "detective", desc: "Clean up dangling global notification listeners causing progressive RAM bloat." }
    ]
  },
  {
    day: 30,
    month: 1,
    blockNum: 6,
    title: "🏆 Month 1 Capstone Gate: PocketWallet Mobile Ledger Application & Architecture Defense",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Master Capstone Integration & Code Defense)",
    spokenGoal: "Architect, benchmark, and defend PocketWallet: A production-grade, 60 FPS offline-first personal financial ledger with biometric authentication, local SQLite persistence, MMKV session caching, and zero frame drops.",
    conceptInvariant: "The application must function with zero network dependencies in airplane mode, maintain 60 FPS scrolling on a 10,000-transaction feed, and pass all a11y standards.",
    failureMode: "A single layout shift, unhandled error crash, or dropped frame under fast scroll results in immediate capstone failure.",
    tryItFriction: "Deliver the complete PocketWallet codebase and defend mobile architecture decisions before senior staff engineers.",
    socraticHints: [
      "How does PocketWallet ensure zero data loss if the device battery dies mid-transaction?",
      "All writes execute inside an SQLite ACID transaction: db.withTransactionAsync(() => { ... })!",
      "Wrap multi-table ledger balance updates inside SQLite transactions."
    ],
    situationalPuzzle: {
      scenario: "You are defending PocketWallet to a Principal Mobile Architect. They ask: 'Why did you use SQLite instead of AsyncStorage for the transaction feed?' How do you answer?",
      options: [
        "AsyncStorage is deprecated.",
        "SQLite provides B-tree indexed SQL queries, atomic ACID transactions, and pagination without deserializing the entire database into JavaScript memory.",
        "SQLite looks cooler.",
        "AsyncStorage is written in Python."
      ],
      answerIdx: 1,
      debrief: "AsyncStorage requires parsing large JSON blobs into memory. SQLite executes indexed queries directly on disk, fetching only the active page of 20 items, keeping memory footprint constant regardless of list size."
    },
    quests: [
      { id: "mobile-m1-d30-q1", name: "PocketWallet Architecture Blueprint", type: "concept", desc: "Design the offline-first data, biometric security, and navigation topology of PocketWallet." },
      { id: "mobile-m1-d30-q2", name: "Stress Test: 10,000 Row 60 FPS Scroll Audit", type: "detective", desc: "Benchmark FlashList feed under continuous fling gestures asserting zero dropped frames." },
      { id: "mobile-m1-d30-q3", name: "Mastery Capstone: Production PocketWallet Deployment", type: "assignment", desc: "Deploy PocketWallet with biometric authentication, offline SQLite outbox, and dark mode design tokens." },
      { id: "mobile-m1-d30-cap", name: "🏆 Month 1 Live Architecture Viva & Senior Code Defense", type: "milestone", desc: "Defend mobile memory management, thread architecture, and offline sync invariants against staff engineering review." }
    ]
  }
];

export const MOBILE_MONTH_2_SPECS: MasterclassDaySpec[] = [
  {
    day: 31,
    month: 2,
    blockNum: 7,
    title: "Reanimated 3 Architecture: The Worklet Runtime, JS Thread vs UI Thread & runOnJS",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Worklet Micro-Runtimes & 120 FPS Frame Pacing)",
    spokenGoal: "Master the Reanimated 3 worklet architecture: Understand how the 'worklet' directive extracts JavaScript functions into small C++ Hermetic runtimes executing directly on the UI Main thread, bypassing the bridge.",
    conceptInvariant: "Animations executed on the JavaScript thread drop frames whenever business logic is busy. Worklets execute synchronously on the native UI thread, guaranteeing 60/120 FPS smoothness.",
    failureMode: "Calling non-worklet functions or accessing React state directly inside a worklet without runOnJS triggers a fatal runtime crash.",
    tryItFriction: "Author a worklet function using the 'worklet' directive and safely communicate back to the JS thread using runOnJS.",
    socraticHints: [
      "Why did calling a state updater inside a worklet throw an error?",
      "The worklet executes in an isolated C++ thread context on the UI thread where React useState does not exist!",
      "Wrap the state update in runOnJS: runOnJS(setCounter)(value)."
    ],
    situationalPuzzle: {
      scenario: "A mobile carousel animation drops to 15 FPS because a heavy network response is parsing on the JavaScript thread. How does Reanimated 3 keep the carousel gliding at 120 FPS despite the JS thread lag?",
      options: [
        "It increases phone RAM.",
        "Reanimated executes animation frame loops entirely on the native UI thread via worklets, completely decoupled from JS thread congestion.",
        "It pauses the network.",
        "It uses CSS transitions."
      ],
      answerIdx: 1,
      debrief: "Reanimated worklets run on the native render thread. Even if the JavaScript thread is 100% frozen parsing data, UI worklet animations continue at full native display refresh rate (120Hz)."
    },
    quests: [
      { id: "mobile-m2-d31-q1", name: "Worklet Execution Context Architecture", type: "concept", desc: "Trace how Babel compiles 'worklet' directives into C++ UI-thread executable blocks." },
      { id: "mobile-m2-d31-q2", name: "Detective Lab: The Unsafely Invoked JS Callback Crash", type: "detective", desc: "Fix a worklet crash by wrapping React state callbacks in runOnJS." },
      { id: "mobile-m2-d31-q3", name: "Mastery Assignment: UI-Thread High-Frequency Clock", type: "assignment", desc: "Build a 120Hz frame timer calculating real-time microsecond render intervals on the UI thread." },
      { id: "mobile-m2-d31-q4", name: "Production Incident Lab: Main Thread Worklet Starvation", type: "detective", desc: "Prevent expensive computations inside worklets that cause native UI stutter." }
    ]
  },
  {
    day: 32,
    month: 2,
    blockNum: 7,
    title: "Shared Values, useAnimatedStyle & Zero-Bridge 120 FPS Property Transitions",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Shared Values & Native Memory Mapping)",
    spokenGoal: "Master Reanimated core primitives: useSharedValue, useAnimatedStyle, withTiming, and withSpring, driving native transform properties with zero bridge serialization.",
    conceptInvariant: "Shared values live in dual memory: synchronized across both JS and UI thread memory spaces. Modifying a shared value on the UI thread updates the native view transform directly.",
    failureMode: "Mutating sharedValue.value directly inside normal React component bodies instead of inside event handlers or hooks causes erratic render loops.",
    tryItFriction: "Build a fluid animated expand/collapse card using useAnimatedStyle and withTiming with cubic bezier easing.",
    socraticHints: [
      "Why must animated styles be declared with useAnimatedStyle?",
      "useAnimatedStyle returns a view descriptor tracked by Reanimated C++ core, updating native view properties without triggering React component re-renders!",
      "Define styles using useAnimatedStyle(() => ({ opacity: opacity.value })) instead of standard style."
    ],
    situationalPuzzle: {
      scenario: "A developer animates a modal slide-up by updating width and height in a standard useState loop (60 setState calls per second). The app lags terribly and phones overheat. Why?",
      options: [
        "React Native is slow.",
        "Updating layout properties (width/height) via useState triggers full React reconciliation, Yoga layout recalculation, and bridge traffic on every frame. Use transform: [{translateY}] via useSharedValue.",
        "The phone screen was dirty.",
        "Hermes ran out of memory."
      ],
      answerIdx: 1,
      debrief: "Never animate width/height/top/left via setState. Always animate transform (translate/scale) and opacity using useSharedValue on the UI thread to bypass layout reflows and React reconciliation."
    },
    quests: [
      { id: "mobile-m2-d32-q1", name: "Shared Value Memory Synchronization", type: "concept", desc: "Inspect how Shared Values bridge C++ memory and JavaScript Hermes objects." },
      { id: "mobile-m2-d32-q2", name: "Detective Lab: The Layout Reflow Animation Stutter", type: "detective", desc: "Refactor a CPU-heavy top/left layout animation into a GPU-accelerated transform translation." },
      { id: "mobile-m2-d32-q3", name: "Mastery Assignment: 120 FPS Interpolated Financial Gauge", type: "assignment", desc: "Build an animated circular progress gauge interpolating shared values to stroke offsets." },
      { id: "mobile-m2-d32-q4", name: "Production Incident Lab: Shared Value Memory Leak", type: "detective", desc: "Clean up active animation loops when unmounting animated view trees." }
    ]
  },
  {
    day: 33,
    month: 2,
    blockNum: 7,
    title: "Physics-Based Animations: Spring Physics (Damping, Stiffness, Mass) & Decay Physics",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Kinematics, Newton Laws & Velocity Continuity)",
    spokenGoal: "Master physics-driven motion: Spring kinematics (stiffness, damping, mass), overshoot clamping, velocity handoffs, and withDecay momentum deceleration.",
    conceptInvariant: "Natural mobile interfaces do not use linear durations; they use physical springs. When a user flings an element, the gesture's release velocity must be handed off to withSpring to preserve kinetic momentum.",
    failureMode: "Ignoring touch release velocity and hardcoding a fixed duration creates robotic, unnatural interfaces that feel jarring to touch.",
    tryItFriction: "Configure an interactive spring animation that absorbs touch fling velocity and settles with critical damping (no infinite oscillation).",
    socraticHints: [
      "What happens if spring damping is too low and stiffness is too high?",
      "The element oscillates back and forth wildly like a plucked guitar string, creating a visually distracting vibrating animation!",
      "Tune damping and stiffness: damping: 15, stiffness: 120, mass: 1 for a crisp native feel."
    ],
    situationalPuzzle: {
      scenario: "A user flings a card off the screen with high velocity. The card abruptly stops moving for a split second, then slowly crawls away with a 300ms ease-out animation. Why did the interface feel broken?",
      options: [
        "The screen was slippery.",
        "The animation discarded the touch gesture's release velocity, breaking the physical law of conservation of momentum. withSpring(0, { velocity }) must inherit gesture velocity.",
        "The phone ran out of battery.",
        "Reanimated crashed."
      ],
      answerIdx: 1,
      debrief: "High-fidelity mobile UX requires velocity continuity: handing event.velocityX into withSpring or withDecay so motion continues seamlessly at the speed the user threw it."
    },
    quests: [
      { id: "mobile-m2-d33-q1", name: "Harmonic Oscillator Physics in Mobile UI", type: "concept", desc: "Derive spring differential equations: mass * a + damping * v + stiffness * x = 0." },
      { id: "mobile-m2-d33-q2", name: "Detective Lab: The Velocity-Stalling Momentum Bug", type: "detective", desc: "Inject touch fling release velocity into withSpring to maintain physical inertia." },
      { id: "mobile-m2-d33-q3", name: "Mastery Assignment: Swipeable Dismiss Card with Decay", type: "assignment", desc: "Build a swipe-to-delete card using withDecay physics with velocity threshold boundaries." },
      { id: "mobile-m2-d33-q4", name: "Production Incident Lab: Unbounded Spring Oscillation Glitch", type: "detective", desc: "Apply overshootClamping to prevent spring values from bouncing past zero boundaries." }
    ]
  },
  {
    day: 34,
    month: 2,
    blockNum: 7,
    title: "Gesture Handler 2: Pan Gestures, Velocity Snapping & Bottom Sheet Drag-to-Dismiss",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "High Cognitive Friction (Gesture State Machines & Simultaneous Recognition)",
    spokenGoal: "Master react-native-gesture-handler 2: The Gesture.Pan() builder, onUpdate, onEnd, simultaneousWithExternalGesture, and building interactive bottom sheets.",
    conceptInvariant: "Gesture Handler runs touch state machines natively in Objective-C and Java, eliminating JS bridge lag. Gestures must declare activeOffsetX/Y to avoid hijacking vertical scroll views.",
    failureMode: "Creating a horizontal swipe gesture inside a vertical list that blocks vertical scrolling because gesture conflict resolution was not defined.",
    tryItFriction: "Implement an interactive drag-to-dismiss bottom sheet that snaps to three discrete heights (25%, 50%, 90%) using Pan gesture velocity.",
    socraticHints: [
      "Why is scrolling down the page impossible after adding a pan gesture to an item?",
      "The pan gesture is greedily consuming all touch events! You must configure activeOffsetX: [-10, 10] or failOffsetY to let vertical scroll pass through.",
      "Define failOffsetY: [-10, 10] so vertical drags pass to the underlying ScrollView."
    ],
    situationalPuzzle: {
      scenario: "A user drags an expandable bottom sheet down. If they drag slowly past 50%, it should dismiss; if they fling down with high velocity even from 80%, it should snap closed immediately. How is this evaluated?",
      options: [
        "Guess the user intent.",
        "Evaluate both position threshold (translationY > height * 0.5) OR velocity threshold (velocityY > 1500) in the onEnd gesture callback.",
        "Ask the user.",
        "Wait 2 seconds."
      ],
      answerIdx: 1,
      debrief: "Fluid mobile gestures check dual thresholds: position AND velocity. High downward velocity triggers dismissal regardless of distance traveled."
    },
    quests: [
      { id: "mobile-m2-d34-q1", name: "Native Gesture Arena & Conflict Resolution", type: "concept", desc: "Trace how native iOS UIGestureRecognizer and Android GestureDetector arbitrate touch ownership." },
      { id: "mobile-m2-d34-q2", name: "Detective Lab: The Hijacked ScrollView Gesture Conflict", type: "detective", desc: "Resolve gesture conflict between a horizontal swipe action and parent vertical scroll." },
      { id: "mobile-m2-d34-q3", name: "Mastery Assignment: 3-Snap Point Native Bottom Sheet", type: "assignment", desc: "Build an interactive bottom sheet with snap points, backdrop opacity, and drag dismissal." },
      { id: "mobile-m2-d34-q4", name: "Production Incident Lab: Ghost Gesture Touches on Unmount", type: "detective", desc: "Cancel active gesture recognizers when dismissing modal sheets to prevent orphaned touches." }
    ]
  },
  {
    day: 35,
    month: 2,
    blockNum: 7,
    title: "⭐ Milestone 6: 120 FPS Interactive Gesture-Driven Stock Candlestick Chart & Bottom Sheet",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Milestone 6 Architecture Integration)",
    spokenGoal: "Architect an institutional-grade financial trading chart with 120 FPS gesture scrubbing, crosshair price overlays, and an interactive draggable trade execution sheet.",
    conceptInvariant: "The scrub crosshair must follow the user's finger smoothly across 1,000 candlestick data points on the UI thread without dropping a single frame.",
    failureMode: "Calculating chart crosshairs on the JS thread drops framerate from 120 FPS to 30 FPS under rapid pan gestures.",
    tryItFriction: "Deliver a 120 FPS interactive trading interface combining Reanimated 3 worklets and Gesture Handler 2 with zero bridge overhead.",
    socraticHints: [
      "How do you update the crosshair price text at 120 FPS without re-rendering the React chart component?",
      "Use an animated text component (or AnimatedTextInput) whose text prop updates directly on the UI thread via worklet!",
      "Drive the crosshair label directly from the shared value without calling setState."
    ],
    situationalPuzzle: {
      scenario: "A trading platform tests your interactive chart on a ProMotion 120Hz iPhone 15 Pro. The instrument drops to 45 FPS during scrub gestures because data interpolation is firing React state updates. How is it fixed?",
      options: [
        "Disable 120Hz display.",
        "Move all candlestick coordinate interpolation and SVG path updates entirely into a Reanimated worklet on the UI thread, bypassing React reconciliation.",
        "Reduce chart resolution to 5 points.",
        "Show a static image."
      ],
      answerIdx: 1,
      debrief: "For 120Hz fluid scrubbing, coordinate math, crosshair positions, and price interpolation must live 100% inside UI-thread worklets, completely decoupled from React component renders."
    },
    quests: [
      { id: "mobile-m2-d35-q1", name: "120Hz ProMotion Frame Timing Architecture", type: "concept", desc: "Analyze 8.3ms per frame budget on 120Hz displays and eliminate JS thread bridge hops." },
      { id: "mobile-m2-d35-q2", name: "Detective Lab: The 120 FPS Scrubbing Frame Drop Bottleneck", type: "detective", desc: "Refactor crosshair scrub coordinates from React state into UI-thread SharedValues." },
      { id: "mobile-m2-d35-q3", name: "Mastery Assignment: Draggable Trade Order Bottom Sheet", type: "assignment", desc: "Integrate interactive bottom sheet with dynamic buy/sell order slider physics." },
      { id: "mobile-m2-d35-m6", name: "⭐ Milestone 6: 120 FPS Production Gesture Trading Terminal", type: "milestone", desc: "Deliver 120 FPS gesture-scrubbing stock chart with draggable order execution sheet." }
    ]
  },
  {
    day: 36,
    month: 2,
    blockNum: 8,
    title: "The New Architecture Foundations: The Bridge Bottleneck & The C++ JSI Revolution",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Guidance (Runtime Internals & C++ Memory Architecture)",
    spokenGoal: "Master React Native's New Architecture: Understand the flaws of the legacy async JSON bridge (serialization overhead, asynchronous queue lag, no synchronous layout measurements) and how JSI solves it.",
    conceptInvariant: "The JavaScript Interface (JSI) exposes C++ host objects directly to the JavaScript runtime. JavaScript can hold references to C++ memory and invoke native C++ methods synchronously in <1 microsecond.",
    failureMode: "Assuming all mobile bridge calls are asynchronous; JSI allows direct synchronous invocations without JSON stringification.",
    tryItFriction: "Benchmark legacy JSON serialization vs JSI direct memory access for 100,000 invocations and observe the 50x throughput gain.",
    socraticHints: [
      "Why did the legacy React Native bridge struggle with fast user gestures?",
      "Because every touch had to be serialized into a JSON string, queued asynchronously, sent across the bridge, deserialized in C++, and returned! By then, the frame was missed.",
      "JSI gives JS a direct memory pointer to the C++ native object, eliminating serialization."
    ],
    situationalPuzzle: {
      scenario: "A mobile game requires querying native gyroscope orientation 1,000 times per second. On the legacy bridge, this creates a massive queue backlog and crashes the app. Why does JSI handle this effortlessly?",
      options: [
        "JSI uses faster JSON.",
        "JSI does not serialize anything; JavaScript invokes the native C++ method directly through memory pointers, executing in nanoseconds with zero bridge queuing.",
        "JSI runs on a remote server.",
        "The phone hardware upgrades."
      ],
      answerIdx: 1,
      debrief: "JSI provides direct memory pointers between JavaScript and C++. Invoking a native module via JSI has the exact same cost as calling a standard C++ function."
    },
    quests: [
      { id: "mobile-m2-d36-q1", name: "JSI Host Object Memory Model", type: "concept", desc: "Trace how Hermes jsi::Runtime exposes jsi::HostObject pointers to JavaScript globals." },
      { id: "mobile-m2-d36-q2", name: "Detective Lab: The Legacy Bridge Serialization Overhead", type: "detective", desc: "Measure JSON.stringify/parse latency on 10MB payloads vs direct JSI pointer access." },
      { id: "mobile-m2-d36-q3", name: "Mastery Assignment: JSI Memory Benchmark Tool", type: "assignment", desc: "Build a benchmarking harness comparing legacy bridge throughput against JSI host objects." },
      { id: "mobile-m2-d36-q4", name: "Production Incident Lab: Async Bridge Queue Congestion", type: "detective", desc: "Diagnose frame drops caused by asynchronous bridge message backlogs under heavy traffic." }
    ]
  },
  {
    day: 37,
    month: 2,
    blockNum: 8,
    title: "Fabric C++ Concurrent Renderer: Shadow Tree Immutability & Synchronous Layout",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Guidance (C++ Rendering Pipeline & Shadow Trees)",
    spokenGoal: "Master Fabric: The new C++ rendering engine. Shadow Tree immutability, thread-safe UI mutations, synchronous layout measurement, and React 18 concurrent features.",
    conceptInvariant: "Fabric creates immutable C++ Shadow Nodes. Instead of mutating views directly, Fabric clones nodes, computes Yoga layout concurrently, and commits the new tree atomically to native UIKit/Android views.",
    failureMode: "Direct view mutations bypassing the Fabric Shadow Tree cause visual desync and native crashes.",
    tryItFriction: "Inspect the Fabric commit pipeline: Trigger a state update and trace Clone -> Layout -> Commit -> Mount phases in the C++ layer.",
    socraticHints: [
      "Why are Fabric Shadow Nodes immutable?",
      "Immutability allows background threads to compute layout and diff trees safely without mutex locks, enabling true thread-safe concurrent rendering!",
      "Fabric clones modified nodes in C++ and swaps the root tree pointer atomically."
    ],
    situationalPuzzle: {
      scenario: "In the legacy architecture, embedding a native iOS map inside a scrollable list caused the map to lag behind the scroll (the 'floating header' glitch). Why does Fabric eliminate this lag entirely?",
      options: [
        "Fabric runs at 240Hz.",
        "Fabric allows synchronous layout measurement on the UI thread, ensuring native views move in lockstep with scrolling during the exact same frame render pass.",
        "The map was downgraded.",
        "Android does not support maps."
      ],
      answerIdx: 1,
      debrief: "Legacy bridge asynchronous layout caused native views and React views to render on separate frames. Fabric executes layout synchronously on the UI thread, completely eliminating visual tearing."
    },
    quests: [
      { id: "mobile-m2-d37-q1", name: "Fabric 4-Phase Rendering Pipeline", type: "concept", desc: "Analyze the lifecycle: Trigger -> Shadow Tree Clone -> Yoga Layout -> Mount to Native." },
      { id: "mobile-m2-d37-q2", name: "Detective Lab: The Native View Tearing Glitch", type: "detective", desc: "Eliminate scroll lag between native map views and React headers using Fabric synchronous mounts." },
      { id: "mobile-m2-d37-q3", name: "Mastery Assignment: Fabric Concurrent Transition Test", type: "assignment", desc: "Implement useTransition in React Native with Fabric to prioritize urgent touch feedback." },
      { id: "mobile-m2-d37-q4", name: "Production Incident Lab: Shadow Node Mutation Conflict", type: "detective", desc: "Debug concurrent state commit conflicts in the C++ Shadow Tree layer." }
    ]
  },
  {
    day: 38,
    month: 2,
    blockNum: 8,
    title: "TurboModules Architecture: C++ Host Objects & Codegen Specification Contracts",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (C++ Codegen & Type-Safe Native Contracts)",
    spokenGoal: "Master TurboModules: Lazy module loading on demand, Codegen type specification files (NativeSpec.ts), and automated C++ glue code generation.",
    conceptInvariant: "Legacy native modules were all instantiated on app startup (slowing cold launch by 2 seconds). TurboModules are lazy: native code is loaded only when first invoked in JavaScript.",
    failureMode: "Writing custom native modules without strict Codegen TypeScript specifications causes runtime type mismatches between C++ and JS.",
    tryItFriction: "Author a strictly typed Codegen specification file NativeMathSpec.ts and run React Native Codegen to generate C++ header boilerplate.",
    socraticHints: [
      "Why do TurboModules dramatically improve mobile app startup time?",
      "Because modules are not initialized at startup! They are loaded lazily upon the first method call, saving hundreds of megabytes of launch memory.",
      "Export TurboModuleRegistry.getEnforcing<Spec>('ModuleName') for lazy on-demand resolution."
    ],
    situationalPuzzle: {
      scenario: "An enterprise mobile app has 80 native third-party libraries. Cold startup takes 3.8 seconds on low-end Android devices. What happens when migrating to TurboModules?",
      options: [
        "The app size increases.",
        "Cold startup drops to under 800ms because none of the 80 modules initialize until the user actually visits the screen requiring them.",
        "The app requires Wi-Fi.",
        "JavaScript files disappear."
      ],
      answerIdx: 1,
      debrief: "Legacy React Native loaded all 80 native modules synchronously on startup. TurboModules initializes modules lazily upon first use, slashing cold start time by over 70%."
    },
    quests: [
      { id: "mobile-m2-d38-q1", name: "TurboModule Lazy Initialization Architecture", type: "concept", desc: "Trace module resolution: TurboModuleRegistry.get -> JSI HostObject Lookup -> C++ Instantiation." },
      { id: "mobile-m2-d38-q2", name: "Detective Lab: The Untyped Native Bridge Crash", type: "detective", desc: "Generate compile-time C++ type contracts using React Native Codegen specs." },
      { id: "mobile-m2-d38-q3", name: "Mastery Assignment: Type-Safe C++ Native Module Contract", type: "assignment", desc: "Write NativeCryptoSpec.ts defining synchronous hash computation interfaces." },
      { id: "mobile-m2-d38-q4", name: "Production Incident Lab: Codegen Architecture Mismatch Outage", type: "detective", desc: "Resolve Xcode build failures caused by stale Codegen header output." }
    ]
  },
  {
    day: 39,
    month: 2,
    blockNum: 8,
    title: "Writing Native Modules: Bridging Native iOS Swift & Android Kotlin via JSI",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Dual-Platform Native Engineering: Swift & Kotlin)",
    spokenGoal: "Master native platform bridge implementation: Writing native modules in Swift (iOS) and Kotlin (Android) backed by TurboModules and direct C++ wrappers.",
    conceptInvariant: "Cross-platform mobile architects must write native Swift and Kotlin code when hardware features or proprietary vendor SDKs lack React Native packages.",
    failureMode: "Failing to handle threading differences (e.g. attempting to touch Android UI on a background coroutine thread) crashes the native application.",
    tryItFriction: "Implement a native BatteryHealth module: write BatteryModule.swift on iOS and BatteryModule.kt on Android with a unified TypeScript API.",
    socraticHints: [
      "Why did the Android app crash when calling Toast.makeText() inside a native module?",
      "Android UI operations MUST execute on the Android Main Looper thread! Background thread UI calls trigger CalledFromWrongThreadException.",
      "Dispatch to the main looper: Handler(Looper.getMainLooper()).post { ... } in Kotlin."
    ],
    situationalPuzzle: {
      scenario: "A fintech company requires integrating an internal proprietary C++ hardware security module into their React Native app. How does a Staff Mobile Architect bridge it?",
      options: [
        "Rewrite the C++ library in JavaScript.",
        "Create a C++ TurboModule that links directly against the native C++ library, exposing its methods via JSI directly to JavaScript without platform wrappers.",
        "Use a WebView.",
        "Send network requests to localhost."
      ],
      answerIdx: 1,
      debrief: "With JSI and TurboModules, C++ libraries can be linked directly into the cross-platform C++ layer, running identically on both iOS and Android with zero Swift/Kotlin bridging overhead."
    },
    quests: [
      { id: "mobile-m2-d39-q1", name: "Swift & Kotlin Native Module Bridges", type: "concept", desc: "Map TypeScript method signatures to Swift @objc methods and Kotlin @ReactMethod implementations." },
      { id: "mobile-m2-d39-q2", name: "Detective Lab: The Android WrongThreadException Crash", type: "detective", desc: "Dispatch native Android UI calls to the main looper thread inside Kotlin modules." },
      { id: "mobile-m2-d39-q3", name: "Mastery Assignment: Native Hardware Diagnostics Bridge", type: "assignment", desc: "Build BatteryHealthTurboModule in Swift and Kotlin exposing native battery cycle counts." },
      { id: "mobile-m2-d39-q4", name: "Production Incident Lab: Native Objective-C Memory Leak", type: "detective", desc: "Resolve retain cycles in Swift delegate closures bound to JavaScript module lifecycles." }
    ]
  },
  {
    day: 40,
    month: 2,
    blockNum: 8,
    title: "⭐ Milestone 7: Custom High-Performance C++ Crypto Hash & Compression TurboModule Engine",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "Zero Support (Milestone 7 Architecture Integration)",
    spokenGoal: "Architect and implement a cross-platform C++ TurboModule that computes SHA-256 cryptographic hashes and Zstandard (zstd) compression synchronously via JSI.",
    conceptInvariant: "The C++ module must compile seamlessly on both iOS (Clang/Xcode) and Android (CMake/NDK), providing synchronous <10 microsecond hash execution to JavaScript.",
    failureMode: "Allocating raw C++ memory pointers without proper RAII smart pointers (std::unique_ptr) causes fatal native memory leaks.",
    tryItFriction: "Deliver the compiled C++ TurboModule with automated TypeScript benchmarks verifying 100,000 hashes per second.",
    socraticHints: [
      "Why is C++ JSI hash calculation 100x faster than pure JavaScript libraries like crypto-js?",
      "C++ compiles to bare-metal CPU SIMD vector instructions, and JSI passes raw memory buffers directly without string conversions!",
      "Use std::string or std::vector with RAII to ensure instant memory freeing upon function return."
    ],
    situationalPuzzle: {
      scenario: "An enterprise audit tests your custom C++ TurboModule with 500,000 rapid hash operations. Native memory usage stays flat at 18MB with 0 memory growth. What C++ idiom guaranteed this?",
      options: [
        "Using malloc without free.",
        "RAII (Resource Acquisition Is Initialization) with modern smart pointers (std::unique_ptr / std::string), guaranteeing automatic memory reclamation when scopes exit.",
        "The garbage collector.",
        "Static variables."
      ],
      answerIdx: 1,
      debrief: "RAII guarantees that heap allocations are tied to object lifetimes. When the C++ stack frame pops, memory is freed immediately, preventing native memory leaks."
    },
    quests: [
      { id: "mobile-m2-d40-q1", name: "Cross-Platform C++ CMake & Xcode Build Matrix", type: "concept", desc: "Configure CMakeLists.txt and podspec to compile C++ source across iOS Clang and Android NDK." },
      { id: "mobile-m2-d40-q2", name: "Detective Lab: The Native C++ Pointer Memory Leak", type: "detective", desc: "Replace raw C pointers with std::vector to eliminate native memory leaks in JSI calls." },
      { id: "mobile-m2-d40-q3", name: "Mastery Assignment: Synchronous SHA-256 JSI Engine", type: "assignment", desc: "Implement jsi::Function computing cryptographic signatures directly on the JS thread in <5μs." },
      { id: "mobile-m2-d40-m7", name: "⭐ Milestone 7: Production C++ TurboModule Engine", type: "milestone", desc: "Deliver compiled C++ SHA-256 & compression TurboModule with cross-platform NDK/Xcode builds." }
    ]
  },
  {
    day: 41,
    month: 2,
    blockNum: 9,
    title: "Deep Linking & Universal Links: Custom Schemes, iOS Universal Links & Android App Links",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Guidance (Platform Intent Routing & Domain Verification)",
    spokenGoal: "Master deep linking architecture: Custom URI schemes (myapp://), iOS Universal Links (apple-app-site-association over HTTPS), and Android App Links (assetlinks.json SHA-256 verification).",
    conceptInvariant: "Custom URI schemes are insecure (any rogue app can register myapp://). Universal Links and App Links cryptographically verify domain ownership via HTTPS host metadata.",
    failureMode: "Failing to handle deep links when the app is completely closed (cold launch) vs already running in the background.",
    tryItFriction: "Configure a unified Linking URL parser handling both cold-start getInitialURL() and warm-start addEventListener('url') routing.",
    socraticHints: [
      "Why did deep linking work when the app was already open, but fail completely when the app was closed?",
      "When closed, the URL is passed to Linking.getInitialURL() on cold start! The runtime event listener only catches URLs while the app is already awake.",
      "Always check Linking.getInitialURL() inside the root startup coordinator."
    ],
    situationalPuzzle: {
      scenario: "A fraudster registers 'bankapp://transfer' in their own malicious app on Android. When users tap a link, Android shows an ambiguous app picker dialog. How does an enterprise bank prevent scheme hijacking?",
      options: [
        "Delete the Android app.",
        "Migrate to Android App Links (verified with digital asset links json on the bank domain) and iOS Universal Links, making domain routing cryptographically exclusive.",
        "Tell users not to click links.",
        "Use SMS."
      ],
      answerIdx: 1,
      debrief: "Custom URI schemes have no security or ownership verification. Universal Links and App Links verify ownership via domain-hosted json files, guaranteeing exclusive routing without app-picker dialogs."
    },
    quests: [
      { id: "mobile-m2-d41-q1", name: "Universal Links vs Custom Scheme Topology", type: "concept", desc: "Compare routing security across custom schemes, apple-app-site-association, and assetlinks.json." },
      { id: "mobile-m2-d41-q2", name: "Detective Lab: The Cold-Start Deep Link Routing Failure", type: "detective", desc: "Implement Linking.getInitialURL() to route users to the correct screen on cold launch." },
      { id: "mobile-m2-d41-q3", name: "Mastery Assignment: Cryptographic App Links Verification Suite", type: "assignment", desc: "Configure assetlinks.json with production keystore SHA-256 fingerprint validation." },
      { id: "mobile-m2-d41-q4", name: "Production Incident Lab: Unauthenticated Deep Link Injection", type: "detective", desc: "Enforce authentication token validation before navigating to deep-linked account transfer routes." }
    ]
  },
  {
    day: 42,
    month: 2,
    blockNum: 9,
    title: "Push Notifications Architecture: APNs Device Tokens, FCM Registration & Message Types",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Guidance (Push Gateway Infrastructure & Token Lifecycles)",
    spokenGoal: "Master mobile push notifications: Apple Push Notification service (APNs) HTTP/2 tokens, Firebase Cloud Messaging (FCM v1 API), and payload structures (Notification vs Data messages).",
    conceptInvariant: "Push notification tokens can expire or change when an app is restored from backup or reinstalled. Clients must sync their active token to the backend upon every launch.",
    failureMode: "Sending sensitive personal data (account balances, passwords) in plain notification payloads, exposing data on the device lockscreen.",
    tryItFriction: "Implement push token registration, handle platform token updates, and parse incoming notification data payloads safely.",
    socraticHints: [
      "Why did a notification arrive on Android but fail completely on iOS?",
      "iOS APNs requires an Apple Developer Push Notification certificate/key and an active APNs token, while Android uses Google Play Services FCM tokens!",
      "Ensure the backend maps both APNs device tokens and FCM registration tokens correctly."
    ],
    situationalPuzzle: {
      scenario: "An enterprise backend sends 1,000,000 push notifications. 50,000 fail with 'BadDeviceToken'. What is the client-side cause?",
      options: [
        "The user turned off their phone.",
        "The user uninstalled and reinstalled the app or updated iOS, invalidating the old APNs token. The client must register the new token on launch.",
        "Apple was offline.",
        "The message was too long."
      ],
      answerIdx: 1,
      debrief: "Device tokens are ephemeral identifiers. When apps are reinstalled or devices restored, APNs issues a fresh token. The client must report token refresh events to the backend immediately."
    },
    quests: [
      { id: "mobile-m2-d42-q1", name: "APNs & FCM Gateway Infrastructure", type: "concept", desc: "Trace push dispatch: Backend Server -> APNs/FCM Gateway -> Device Radio -> App Handler." },
      { id: "mobile-m2-d42-q2", name: "Detective Lab: The Stale Push Device Token Outage", type: "detective", desc: "Implement onTokenRefresh listener to synchronize updated push tokens with the user profile database." },
      { id: "mobile-m2-d42-q3", name: "Mastery Assignment: Notification Payload Security Filter", type: "assignment", desc: "Sanitize incoming push payloads to ensure zero PII (Personally Identifiable Information) leaks." },
      { id: "mobile-m2-d42-q4", name: "Production Incident Lab: Notification Permission Prompt Rejection", type: "detective", desc: "Build a pre-permission prompt explaining transaction alerts before triggering the OS push dialog." }
    ]
  },
  {
    day: 43,
    month: 2,
    blockNum: 9,
    title: "Push Notification Lifecycles: Foreground Banners, Notification Taps & Silent Sync",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Silent Pushes & Background Wakeups)",
    spokenGoal: "Master notification event handling: Foreground presentation options (shouldShowAlert: true), user notification response taps (getNotificationResponseReceivedListener), and silent content-available background sync.",
    conceptInvariant: "When an app is in the foreground, the OS does NOT show a notification banner by default unless explicitly configured. Tapping a notification must navigate the user directly to the referenced entity.",
    failureMode: "Sending background silent pushes without 'content-available': 1 on iOS, preventing the app from waking up in the background to sync data.",
    tryItFriction: "Configure a notification response listener that deep links the user directly to the transaction detail screen when a push notification is tapped.",
    socraticHints: [
      "Why does tapping a push notification just open the app home screen instead of the specific transaction?",
      "You didn't extract the entity ID from response.notification.request.content.data and pass it to navigation!",
      "Read notification.data.transactionId in the notification response handler and call navigation.navigate('TransactionDetail', { id })."
    ],
    situationalPuzzle: {
      scenario: "A mobile banking app needs to sync new transactions quietly in the background before the user wakes up, so the dashboard is instant. What push notification type achieves this?",
      options: [
        "A high-priority alert notification.",
        "A Silent Background Push notification with 'content-available': 1 (iOS) and data-only message (Android), which wakes the app for 30 seconds without showing a banner.",
        "A sound-only alert.",
        "An SMS."
      ],
      answerIdx: 1,
      debrief: "Silent pushes allow servers to wake mobile apps in the background for up to 30 seconds to fetch data, update local SQLite databases, and prepare caches before the user opens the app."
    },
    quests: [
      { id: "mobile-m2-d43-q1", name: "Push Notification Lifecycle State Machine", type: "concept", desc: "Diagram states: Foreground Received -> Banner Displayed -> User Tap Response -> Deep Link Navigation." },
      { id: "mobile-m2-d43-q2", name: "Detective Lab: The Unrouted Notification Tap Glitch", type: "detective", desc: "Parse notification payload data and route directly to the target transaction detail screen." },
      { id: "mobile-m2-d43-q3", name: "Mastery Assignment: Silent Background Database Sync Worker", type: "assignment", desc: "Handle content-available silent pushes to sync new ledger items into local SQLite silently." },
      { id: "mobile-m2-d43-q4", name: "Production Incident Lab: Foreground Notification Duplicate Alert", type: "detective", desc: "Suppress in-app toast alerts when the user is already looking at the active chat screen." }
    ]
  },
  {
    day: 44,
    month: 2,
    blockNum: 9,
    title: "App Lifecycles & Background Execution: AppState, Headless JS & Background Fetch",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Guidance (OS Process Suspension & Background Limitations)",
    spokenGoal: "Master mobile process lifecycles: AppState transitions (active, background, inactive), iOS Background App Refresh invariants, Android Headless JS tasks, and WorkManager.",
    conceptInvariant: "Mobile operating systems aggressively terminate background processes to conserve battery. Background work must be short (<30 seconds) or scheduled via OS background task managers.",
    failureMode: "Attempting to run an unbounded setInterval in the background; the OS suspends the process after 5 seconds, freezing execution until the app reopens.",
    tryItFriction: "Implement an AppState change listener that pauses live WebSocket connections when backgrounded and reconnects upon becoming active.",
    socraticHints: [
      "Why did my background sync timer stop working 30 seconds after locking the phone?",
      "iOS and Android freeze the JavaScript runtime when the app enters the background to protect battery life!",
      "Use expo-background-fetch or Android WorkManager to schedule periodic background tasks legitimately."
    ],
    situationalPuzzle: {
      scenario: "A mobile app maintains an open WebSocket connection while backgrounded in a user's pocket. The device battery drains rapidly, and Android OS flags the app for high background CPU usage. What is the standard pattern?",
      options: [
        "Keep the socket open forever.",
        "Disconnect the WebSocket when AppState moves to 'background', and rely on Push Notifications to wake the device only when new messages arrive.",
        "Reduce screen brightness.",
        "Delete Android."
      ],
      answerIdx: 1,
      debrief: "Persistent sockets in mobile apps must be closed when entering the background. Push notifications must be used to alert the device, and sockets reconnected when AppState returns to 'active'."
    },
    quests: [
      { id: "mobile-m2-d44-q1", name: "Operating System Process Suspension Models", type: "concept", desc: "Compare iOS suspended state vs Android Doze mode and background execution ceilings." },
      { id: "mobile-m2-d44-q2", name: "Detective Lab: The Background WebSocket Battery Drain", type: "detective", desc: "Tear down WebSocket connections on AppState 'background' and reconnect cleanly on 'active'." },
      { id: "mobile-m2-d44-q3", name: "Mastery Assignment: OS-Compliant Periodic Background Fetch Task", type: "assignment", desc: "Configure BackgroundFetch task updating local exchange rates every 15 minutes." },
      { id: "mobile-m2-d44-q4", name: "Production Incident Lab: Headless JS Android Service Outage", type: "detective", desc: "Fix an Android Headless JS task failing to complete before the OS killed the process." }
    ]
  },
  {
    day: 45,
    month: 2,
    blockNum: 9,
    title: "⭐ Milestone 8: Real-Time Event Dispatcher with Universal Link Routing & Background Push Sync",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "Balanced Friction (Milestone 8 Architecture Integration)",
    spokenGoal: "Architect an enterprise real-time event dispatcher combining Universal Links, push notification deep routing, silent background sync, and AppState lifecycle coordination.",
    conceptInvariant: "The system must handle cold-start deep links, background push sync to SQLite, and foreground banners seamlessly across both iOS and Android.",
    failureMode: "Race conditions between navigation container mounting and early push notification tap handling causing unhandled navigation errors.",
    tryItFriction: "Deliver the complete real-time routing engine with 100% test coverage across all deep-link and push states.",
    socraticHints: [
      "How do you prevent a crash when a push notification is tapped before the React Navigation container is ready?",
      "Store the pending target route in a ref or state, and dispatch it inside the NavigationContainer onReady callback!",
      "Defer deep link navigation until NavigationContainer.isReady() evaluates to true."
    ],
    situationalPuzzle: {
      scenario: "A user taps a push notification from their lock screen while the app is completely terminated. The app opens, mounts splash, and fails to navigate to the target screen because navigation wasn't mounted yet. How do you solve this universally?",
      options: [
        "Disable push notifications.",
        "Implement a NavigationReady coordinator: queue the incoming link, and execute the navigate action only once the root NavigationContainer fires onReady.",
        "Wait 10 seconds.",
        "Restart the phone."
      ],
      answerIdx: 1,
      debrief: "On cold launches, native push events fire before React component trees finish mounting. Queueing the target URL and draining it in NavigationContainer's onReady guarantees reliable navigation."
    },
    quests: [
      { id: "mobile-m2-d45-q1", name: "Unified Deep Link & Push Event Bus Topology", type: "concept", desc: "Design a centralized event coordinator arbitrating URL schemes, universal links, and push taps." },
      { id: "mobile-m2-d45-q2", name: "Detective Lab: The Unmounted Navigation Container Crash", type: "detective", desc: "Queue deep-link navigation actions until NavigationContainer onReady has fired." },
      { id: "mobile-m2-d45-q3", name: "Mastery Assignment: Silent Push Local Cache Synchronizer", type: "assignment", desc: "Sync account balance deltas via silent push payloads directly into local SQLite." },
      { id: "mobile-m2-d45-m8", name: "⭐ Milestone 8: Production Real-Time Event Dispatcher Engine", type: "milestone", desc: "Deliver enterprise deep link & push notification routing engine with cold-start queuing." }
    ]
  },
  {
    day: 46,
    month: 2,
    blockNum: 10,
    title: "Hardware Keystore & Keychain: Secure Enclave on iOS vs Android KeyStore & EncryptedStorage",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Guidance (Hardware Cryptographic Chips & Key Vaults)",
    spokenGoal: "Master hardware-backed key storage: iOS Keychain backed by the Secure Enclave, Android KeyStore, EncryptedSharedPreferences (AES-256-GCM), and biometric-gated key retrieval.",
    conceptInvariant: "Never store access tokens, refresh tokens, or cryptographic keys in standard AsyncStorage or MMKV without hardware encryption. Hardware keychains protect keys even if the OS filesystem is dumped.",
    failureMode: "Storing sensitive JWT bearer tokens in plain unencrypted AsyncStorage, allowing rooted or jailbroken devices to extract tokens via adb or file explorers.",
    tryItFriction: "Store and retrieve JWT session tokens using expo-secure-store with biometric access flags (kSecAccessControlBiometryAny).",
    socraticHints: [
      "Why is AsyncStorage unsafe for auth tokens?",
      "AsyncStorage writes unencrypted plaintext JSON directly to an SQLite file on the device filesystem! Anyone with USB adb access can read it in 2 seconds.",
      "Use SecureStore / Keychain which encrypts data with AES-256 keys managed by the phone's dedicated hardware cryptographic chip."
    ],
    situationalPuzzle: {
      scenario: "A security firm performs a penetration test on your mobile app and extracts the user's banking session token from an unencrypted SQLite file in /data/data/com.app. What security control failed?",
      options: [
        "The user had a weak password.",
        "The app used standard AsyncStorage instead of the platform Hardware Keychain / Android KeyStore, violating financial compliance standards.",
        "The network was unencrypted.",
        "The phone screen was unlocked."
      ],
      answerIdx: 1,
      debrief: "Financial mobile applications must store credentials and tokens in the platform hardware key vault (iOS Keychain with kSecAttrAccessibleAfterFirstUnlock / Android KeyStore), preventing extraction even from rooted devices."
    },
    quests: [
      { id: "mobile-m2-d46-q1", name: "Secure Enclave Hardware Cryptography Topology", type: "concept", desc: "Trace key generation: OS KeyStore -> Hardware Security Module -> AES-GCM Encrypted Payload." },
      { id: "mobile-m2-d46-q2", name: "Detective Lab: The Plaintext Token Extraction Vulnerability", type: "detective", desc: "Migrate credentials from unencrypted AsyncStorage to hardware-backed SecureStore." },
      { id: "mobile-m2-d46-q3", name: "Mastery Assignment: Biometric-Gated Secure Key Store", type: "assignment", desc: "Implement hardware keychain storage requiring user FaceID presence to release decryption keys." },
      { id: "mobile-m2-d46-q4", name: "Production Incident Lab: Android KeyStore Invalidation on OS Update", type: "detective", desc: "Handle KeyStore key invalidation gracefully when users update system lockscreen PINs." }
    ]
  },
  {
    day: 47,
    month: 2,
    blockNum: 10,
    title: "WatermelonDB / SQLite JSI: Lazy Loading, Observable Queries & 1,000,000 Record Mobile DBs",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Guidance (Scale Databases on Constrained Mobile Hardware)",
    spokenGoal: "Master large-scale mobile databases: WatermelonDB, SQLite JSI direct memory querying, lazy loading, and reactive RxJS observables driving UI re-renders without full-table serialization.",
    conceptInvariant: "Mobile apps cannot load 100,000 rows into JavaScript memory. WatermelonDB lazy-loads only the active records on demand, enabling snappy performance on multi-million row datasets.",
    failureMode: "Loading entire database tables into a single JavaScript array: JSON memory overhead causes severe garbage collection pauses and out-of-memory crashes.",
    tryItFriction: "Configure a WatermelonDB model with lazy relations and observe a live query update automatically as database rows change in SQLite.",
    socraticHints: [
      "How does WatermelonDB maintain 60 FPS while displaying items from a database of 500,000 records?",
      "It never loads 500,000 records into JS! It only instantiates JavaScript objects for records currently rendered on screen via lazy queries.",
      "Use WatermelonDB query observables: database.get('orders').query().observe()."
    ],
    situationalPuzzle: {
      scenario: "A field technician app has 250,000 service logs stored locally. Querying the log feed crashes budget Android devices with an OOM killer. How do you scale local mobile databases to 250,000 records?",
      options: [
        "Delete old logs.",
        "Use WatermelonDB with SQLite JSI, which operates on lazy references and streams only visible records to the UI layer.",
        "Upload logs to the cloud and delete from phone.",
        "Ask users to buy expensive phones."
      ],
      answerIdx: 1,
      debrief: "WatermelonDB is built specifically for large-scale mobile apps. It uses SQLite JSI under the hood and exposes lazy observable queries, maintaining near-zero memory footprint regardless of dataset size."
    },
    quests: [
      { id: "mobile-m2-d47-q1", name: "WatermelonDB Lazy Architecture & JSI Bridges", type: "concept", desc: "Trace how WatermelonDB bypasses the bridge to query SQLite directly via C++ JSI." },
      { id: "mobile-m2-d47-q2", name: "Detective Lab: The Unbounded 100,000 Row Memory Crash", type: "detective", desc: "Refactor a memory-hogging SQLite SELECT * query into a lazy WatermelonDB observable." },
      { id: "mobile-m2-d47-q3", name: "Mastery Assignment: Reactive Observable Mobile Database Model", type: "assignment", desc: "Build an offline ledger with live database query subscriptions updating the UI on insert." },
      { id: "mobile-m2-d47-q4", name: "Production Incident Lab: Missing Database Index Query Degradation", type: "detective", desc: "Add compound SQLite indices to WatermelonDB schemas to accelerate multi-condition queries." }
    ]
  },
  {
    day: 48,
    month: 2,
    blockNum: 10,
    title: "Delta Synchronization & Conflict Resolution: Last-Write-Wins vs Vector Clocks in Mobile Sync",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Cognitive Friction (Distributed Systems on Flaky Edge Networks)",
    spokenGoal: "Master distributed mobile data synchronization: Delta sync (syncing only changes since last_pulled_at timestamp), conflict resolution strategies (Last-Write-Wins vs Field-Level Merging), and idempotency.",
    conceptInvariant: "Never send entire database snapshots across mobile networks. Delta sync exchanges only records modified since the client's last synchronization checkpoint, saving 99% of bandwidth.",
    failureMode: "Two mobile devices edit the same record offline; syncing blindly overwrites remote changes without conflict resolution, causing permanent data loss.",
    tryItFriction: "Implement a delta sync protocol that pushes local created/updated/deleted records and merges remote changes using Last-Write-Wins timestamps.",
    socraticHints: [
      "What happens if two users edit the same customer phone number offline and then both reconnect?",
      "A conflict occurs! Without conflict resolution, the second sync clobbers the first without warning. You must apply Last-Write-Wins (LWW) or field-level merges.",
      "Compare updated_at timestamps or field-level dirty flags to determine the winning mutation."
    ],
    situationalPuzzle: {
      scenario: "A mobile CRM app has 10,000 contacts. Every sync request downloads the entire 15MB database, causing users on 3G to abandon the app. How is sync optimized?",
      options: [
        "Sync only on Wi-Fi.",
        "Implement Delta Sync: client sends last_pulled_at: 1710000000, and server returns only the 3 contacts modified after that timestamp.",
        "Compress the 15MB file.",
        "Sync once a week."
      ],
      answerIdx: 1,
      debrief: "Delta sync sends only mutated records (created, updated, deleted) since the last checkpoint, reducing typical sync payloads from megabytes to a few kilobytes."
    },
    quests: [
      { id: "mobile-m2-d48-q1", name: "Distributed Mobile Delta Synchronization Topology", type: "concept", desc: "Trace bidirectional sync: Client Push Changes -> Server Conflict Check -> Client Pull Deltas." },
      { id: "mobile-m2-d48-q2", name: "Detective Lab: The Silent Conflict Overwrite Data Loss", type: "detective", desc: "Implement field-level conflict resolution preserving non-overlapping edits made offline." },
      { id: "mobile-m2-d48-q3", name: "Mastery Assignment: Bidirectional Delta Sync Engine", type: "assignment", desc: "Build a sync engine tracking local dirty records and applying server change sets atomically." },
      { id: "mobile-m2-d48-q4", name: "Production Incident Lab: Timestamp Clock Skew Desynchronization", type: "detective", desc: "Eliminate clock-skew bugs by using server-assigned monotonic revision numbers instead of device clocks." }
    ]
  },
  {
    day: 49,
    month: 2,
    blockNum: 10,
    title: "Mobile Security Hardening: SSL Pinning, Root / Jailbreak Detection & ProGuard / R8 Obfuscation",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Guidance (App Hardening, Reverse Engineering & Defense in Depth)",
    spokenGoal: "Master mobile enterprise security: SSL Certificate / Public Key Pinning, detecting jailbroken iOS and rooted Android devices, anti-tampering checks, and ProGuard / R8 bytecode obfuscation.",
    conceptInvariant: "Standard HTTPS can be intercepted on mobile devices using proxy tools (Charles, Proxyman, Burp Suite) if the user installs a rogue root certificate. SSL Pinning guarantees communication only with the bank's exact public key.",
    failureMode: "Deploying release APKs/AABs without ProGuard/R8 obfuscation, allowing attackers to decompile the app into readable Java/Kotlin source code via jadx.",
    tryItFriction: "Configure SSL pinning in React Native using react-native-ssl-pinning with SHA-256 public key hashes, rejecting MITM proxy connections.",
    socraticHints: [
      "Why is standard HTTPS not enough to prevent MITM attacks on a rooted mobile device?",
      "An attacker with root access can install a custom CA certificate into the phone's system trust store, allowing tools like Charles Proxy to decrypt all HTTPS traffic in plaintext!",
      "Enforce SSL Pinning so the app only trusts your specific server's public key hash."
    ],
    situationalPuzzle: {
      scenario: "A penetration tester intercepts all banking API traffic from an iPhone using Charles Proxy. The app continues working without warnings. What security control must be implemented immediately?",
      options: [
        "Disable internet.",
        "Implement SSL Public Key Pinning (HPKP), causing the app's networking layer to immediately abort TLS handshakes if the server certificate does not match pinned hashes.",
        "Change the domain.",
        "Use HTTP."
      ],
      answerIdx: 1,
      debrief: "SSL Pinning pins the server's public key inside the mobile binary. Any proxy attempting to inspect traffic presents a different certificate, triggering an instant TLS abort."
    },
    quests: [
      { id: "mobile-m2-d49-q1", name: "Man-In-The-Middle (MITM) & Proxy Attack Topology", type: "concept", desc: "Analyze how custom root certificates intercept TLS and how Public Key Pinning defeats proxies." },
      { id: "mobile-m2-d49-q2", name: "Detective Lab: The Intercepted Plaintext Payment Request", type: "detective", desc: "Implement SSL Pinning with SHA-256 public key hashes to reject proxy certificates." },
      { id: "mobile-m2-d49-q3", name: "Mastery Assignment: Root & Jailbreak Environmental Sentinel", type: "assignment", desc: "Build an integrity guard detecting SuperSU, Magisk, Cydia, and Frida hooking frameworks." },
      { id: "mobile-m2-d49-q4", name: "Production Incident Lab: Bytecode Reverse Engineering Leak", type: "detective", desc: "Configure Android R8 shrinker and ProGuard rules to obfuscate sensitive class names." }
    ]
  },
  {
    day: 50,
    month: 2,
    blockNum: 10,
    title: "⭐ Milestone 9: High-Throughput Offline-First Delta Sync Engine with Hardware Keychain Storage",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Balanced Friction (Milestone 9 Architecture Integration)",
    spokenGoal: "Architect an institutional-grade offline-first data synchronization engine featuring WatermelonDB/SQLite JSI, hardware-backed Keychain token storage, SSL pinned networking, and monotonic revision conflict resolution.",
    conceptInvariant: "The engine must process 10,000 synchronized records in under 500ms on device, support biometric session gating, and withstand network drops mid-sync without database corruption.",
    failureMode: "A sync interruption leaving the local database in a partially updated, un-versioned inconsistent state.",
    tryItFriction: "Deliver the complete synchronized data architecture with automated stress tests simulating spotty networks.",
    socraticHints: [
      "How do you guarantee that a database sync never leaves corrupt half-synced data if the app is killed mid-transfer?",
      "Execute the entire remote batch commit inside an atomic SQLite transaction: db.write(async () => { ... })!",
      "All delta inserts and checkpoint updates must commit together in a single atomic transaction."
    ],
    situationalPuzzle: {
      scenario: "An enterprise audit tests your offline engine by killing the mobile process during a 5,000-record batch sync. When reopened, the app detects the interrupted transaction, rolls back to the clean snapshot, and resumes cleanly. What architectural invariant proved this?",
      options: [
        "JavaScript promises.",
        "SQLite ACID Transactional Atomicity paired with monotonic revision checkpoints.",
        "Cloud backups.",
        "Device reboot."
      ],
      answerIdx: 1,
      debrief: "Wrapping batch sync updates in SQLite transactions ensures all-or-nothing atomicity. If the app is killed, the uncommitted write-ahead log rolls back automatically on the next launch."
    },
    quests: [
      { id: "mobile-m2-d50-q1", name: "Enterprise Delta Sync & Security Architecture", type: "concept", desc: "Design end-to-end topology: Keychain Auth -> SSL Pinned Net -> SQLite Transaction -> UI Observer." },
      { id: "mobile-m2-d50-q2", name: "Detective Lab: The Interrupted Sync Inconsistent State Bug", type: "detective", desc: "Wrap multi-table batch synchronization inside atomic database transactions." },
      { id: "mobile-m2-d50-q3", name: "Mastery Assignment: 10,000 Record Delta Benchmark", type: "assignment", desc: "Benchmark SQLite JSI batch inserts asserting <500ms processing time on mobile hardware." },
      { id: "mobile-m2-d50-m9", name: "⭐ Milestone 9: Production Offline-First Delta Sync Engine", type: "milestone", desc: "Deliver secure offline delta sync engine with WatermelonDB, hardware keychain, and SSL pinning." }
    ]
  },
  {
    day: 51,
    month: 2,
    blockNum: 11,
    title: "Memory Profiling: Diagnosing Hermes Heap Leaks & Retained Views with Xcode Instruments",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Cognitive Friction (Low-Level Memory Profiling & Profiler Tools)",
    spokenGoal: "Master iOS memory profiling: Xcode Instruments (Allocations, Leaks, VM Tracker), capturing Hermes heap snapshots via Chrome DevTools, and detecting detached native UIViews.",
    conceptInvariant: "Mobile operating systems terminate apps that exceed memory limits (Jetsam on iOS, Low Memory Killer on Android). Developers must inspect memory allocation graphs to find closures retaining native views.",
    failureMode: "Retaining a reference to a native UIView inside a global JavaScript array prevents iOS from freeing its backing render surface, creating a permanent memory leak.",
    tryItFriction: "Capture an Xcode Instruments Allocations trace, reproduce a memory leak by repeatedly pushing and popping a screen, and eliminate the retain cycle.",
    socraticHints: [
      "How do you know if an unmounted screen is actually being garbage collected by iOS?",
      "In Xcode Instruments Allocations, check the count of UIViewController / RCTView instances! If the count increases every time you open and close the screen, you have a leak.",
      "Ensure native view instance counts return to baseline after the screen is popped."
    ],
    situationalPuzzle: {
      scenario: "An iOS app crashes with EXCEPTION_FLAG_JETSAM after 15 minutes of user activity. Profiling shows native memory climbing from 45MB to 850MB. Where should the senior engineer look first?",
      options: [
        "The battery settings.",
        "Xcode Instruments Allocations: look for unreleased high-resolution Image bitmaps and native Views retained by event listener closures in JavaScript.",
        "Change the font size.",
        "Restart the MacBook."
      ],
      answerIdx: 1,
      debrief: "Jetsam terminations occur when an app exceeds OS memory limits. Uncached high-res images and detached native views held by active JavaScript event closures are the primary causes of massive RAM growth."
    },
    quests: [
      { id: "mobile-m2-d51-q1", name: "iOS Jetsam Memory Limits & Instruments Topology", type: "concept", desc: "Inspect how iOS VM Tracker flags dirty memory and how Jetsam kills high-memory processes." },
      { id: "mobile-m2-d51-q2", name: "Detective Lab: The Detached RCTView Retain Cycle Leak", type: "detective", desc: "Locate an unreleased closure in Xcode Instruments retaining a native screen controller in memory." },
      { id: "mobile-m2-d51-q3", name: "Mastery Assignment: Hermes Heap Snapshot Audit", type: "assignment", desc: "Capture and compare Hermes memory snapshots to find retained JavaScript objects across screen transitions." },
      { id: "mobile-m2-d51-q4", name: "Production Incident Lab: High-Resolution Camera Memory Spike", type: "detective", desc: "Clamp maximum image buffer sizes to prevent Jetsam memory kills during photo uploads." }
    ]
  },
  {
    day: 52,
    month: 2,
    blockNum: 11,
    title: "Android Memory Profiling: Android Studio Profiler, Bitmap Allocations & Fragment Leaks",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Cognitive Friction (Android Runtime Heap & Garbage Collection)",
    spokenGoal: "Master Android memory profiling: Android Studio Profiler (Java/Kotlin heap, Native C++ heap, Graphics buffer), capturing HPROF heap dumps, and analyzing LeakCanary reports.",
    conceptInvariant: "On Android, the ART runtime enforces strict per-app heap sizes (often 256MB-512MB). Bitmaps live in native memory (Android 8+), while JavaScript lives in the Hermes heap. Memory leaks occur on both layers.",
    failureMode: "Holding a reference to an Android Activity context inside a static utility class causes the entire Activity and all its views to leak upon screen destruction.",
    tryItFriction: "Capture an Android Studio memory heap dump, find a leaked Activity context reference using class path references, and sever the leak.",
    socraticHints: [
      "Why is passing an Activity context into a long-lived singleton service a severe memory leak on Android?",
      "When the user presses Back, the Activity is destroyed, but the singleton keeps a pointer to it, preventing the garbage collector from freeing the Activity and its entire View tree!",
      "Pass applicationContext instead of Activity context to long-lived singleton services."
    ],
    situationalPuzzle: {
      scenario: "An Android banking app throws java.lang.OutOfMemoryError: Failed to allocate a byte allocation with 16777216 free bytes. LeakCanary flags an Activity leak. How is this resolved?",
      options: [
        "Tell users to buy phones with 16GB RAM.",
        "Inspect the LeakCanary trace: find the static reference holding the destroyed Activity context and nullify the reference in onDestroy.",
        "Disable the camera.",
        "Recompile Android."
      ],
      answerIdx: 1,
      debrief: "LeakCanary automatically detects when a destroyed Activity remains reachable from GC roots. Severing the static reference allows the Android garbage collector to reclaim the Activity's memory."
    },
    quests: [
      { id: "mobile-m2-d52-q1", name: "Android Runtime (ART) Memory Architecture", type: "concept", desc: "Analyze Java Heap, Native C++ Heap, and Graphics memory allocations on Android devices." },
      { id: "mobile-m2-d52-q2", name: "Detective Lab: The Static Context Activity Leak Outage", type: "detective", desc: "Replace an Activity context reference in a native module with ApplicationContext to stop memory leaks." },
      { id: "mobile-m2-d52-q3", name: "Mastery Assignment: LeakCanary Automated Regression Pipeline", type: "assignment", desc: "Integrate LeakCanary into Android debug builds to fail automated tests on memory leaks." },
      { id: "mobile-m2-d52-q4", name: "Production Incident Lab: Native Bitmap Graphics Memory Exhaustion", type: "detective", desc: "Configure Android Fresco/Glide image pipeline bounds to stop graphics memory bloat." }
    ]
  },
  {
    day: 53,
    month: 2,
    blockNum: 11,
    title: "Unit & Component Testing: Jest, React Native Testing Library (RNTL) & Mocking Native Modules",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Balanced Friction (Test Automation & Native Module Test Doubles)",
    spokenGoal: "Master mobile test automation: Jest unit testing, React Native Testing Library (RNTL) component interaction tests, fireEvent, renderHook, and mocking TurboModules and native device APIs.",
    conceptInvariant: "Mobile tests run in a headless Node.js environment without native iOS/Android engines. Native modules (Camera, SecureStore, Reanimated) must be mocked cleanly using test doubles.",
    failureMode: "Attempting to test components that invoke unmocked native modules (like NativeModules.PlatformConstants), resulting in 'Cannot read property of undefined' test failures.",
    tryItFriction: "Write comprehensive RNTL tests verifying that entering an amount and tapping 'Transfer' invokes the correct API service with exact parameters.",
    socraticHints: [
      "Why do React Native component tests crash in Jest when testing a component with animations?",
      "Reanimated and native animation libraries require native C++ bindings that do not exist in Node.js! You must include setUpTests.js with jest-expo or Reanimated test mocks.",
      "Import 'react-native-reanimated/mock' in your Jest setup file."
    ],
    situationalPuzzle: {
      scenario: "A financial transfer form test passes, but in production, users report the submit button was disabled because of an async validation race. How should the test be updated to catch this?",
      options: [
        "Do not write tests.",
        "Use RNTL's waitFor and findByText to assert asynchronous state transitions and button enablement deterministically.",
        "Add a sleep(5000) in the test.",
        "Remove validation."
      ],
      answerIdx: 1,
      debrief: "Testing asynchronous mobile UI states requires waitFor and findBy queries that poll until async promises settle, catching race conditions without brittle hardcoded timeouts."
    },
    quests: [
      { id: "mobile-m2-d53-q1", name: "Headless Mobile Test Architecture", type: "concept", desc: "Trace how Jest and RNTL simulate React Native component trees in Node.js v8 environments." },
      { id: "mobile-m2-d53-q2", name: "Detective Lab: The Unmocked Native Bridge Test Crash", type: "detective", desc: "Mock native SecureStore and Biometrics modules with deterministic in-memory test doubles." },
      { id: "mobile-m2-d53-q3", name: "Mastery Assignment: Full Transfer Flow Component Suite", type: "assignment", desc: "Write complete RNTL test coverage for a payment transfer screen testing input validation and submission." },
      { id: "mobile-m2-d53-q4", name: "Production Incident Lab: Flaky Async Test Race Remediation", type: "detective", desc: "Replace arbitrary setTimeout calls in tests with deterministic waitFor assertions." }
    ]
  },
  {
    day: 54,
    month: 2,
    blockNum: 11,
    title: "Automated End-to-End Testing: Maestro UI Automation, Flake Reduction & Device Emulation",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Guidance (Black-Box E2E Testing & Device Orchestration)",
    spokenGoal: "Master modern mobile E2E automation: Maestro declarative YAML flows, running on real devices and emulators, tapping visible text, inputting text, and avoiding brittle test flakes.",
    conceptInvariant: "Unlike brittle web Selenium or legacy Appium setups that require complex WebDriver servers, Maestro drives native iOS and Android accessibility trees directly with zero flake and instant setup.",
    failureMode: "Writing E2E tests dependent on hardcoded sleep timers instead of waiting for visual element visibility, causing test runs to fail on slow CI runners.",
    tryItFriction: "Author a Maestro E2E test flow testing user login, biometric prompt simulation, navigating to transfer, and asserting successful balance update.",
    socraticHints: [
      "Why is Maestro significantly faster and less flaky than Appium for mobile E2E tests?",
      "Maestro communicates directly with native OS accessibility APIs (UIAutomation on iOS and UiAutomator on Android) using declarative YAML, avoiding fragile XPath locators!",
      "Write clean Maestro YAML flows asserting on visible text: - assertVisible: 'Transfer Complete'."
    ],
    situationalPuzzle: {
      scenario: "A team's mobile CI pipeline takes 45 minutes to run 10 Detox E2E tests, and 40% fail randomly due to network timing flakes. What is the modern mobile E2E solution?",
      options: [
        "Stop testing entirely.",
        "Migrate to Maestro with mocked network responses (or local offline SQLite states), running declarative YAML flows in under 4 minutes with zero flakiness.",
        "Run tests on real phones manually.",
        "Buy faster servers."
      ],
      answerIdx: 1,
      debrief: "Maestro eliminates Appium/Detox infrastructure complexity with declarative YAML flows that automatically wait for UI animations and layout passes to settle before asserting."
    },
    quests: [
      { id: "mobile-m2-d54-q1", name: "Maestro Native Driver Architecture", type: "concept", desc: "Inspect how Maestro hooks into native iOS XCTest and Android UiAutomator frameworks." },
      { id: "mobile-m2-d54-q2", name: "Detective Lab: The Flaky Network Timing E2E Failure", type: "detective", desc: "Replace fragile sleep commands with Maestro extendedWaitUntil: visible element checks." },
      { id: "mobile-m2-d54-q3", name: "Mastery Assignment: End-to-End Payment Regression Suite", type: "assignment", desc: "Write a complete Maestro E2E flow testing onboarding, authentication, and money transfer." },
      { id: "mobile-m2-d54-q4", name: "Production Incident Lab: Device Screen Resolution Test Divergence", type: "detective", desc: "Standardize E2E touch coordinate taps into text and accessibility ID selectors." }
    ]
  },
  {
    day: 55,
    month: 2,
    blockNum: 11,
    title: "⭐ Milestone 10: Zero-Leak Verified Mobile Test Harness with Automated Maestro E2E Regression Suite",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Balanced Friction (Milestone 10 Architecture Integration)",
    spokenGoal: "Architect an enterprise automated test harness integrating Jest unit tests, RNTL component suites, Xcode Instruments leak assertions, and Maestro E2E flows running in GitHub Actions CI.",
    conceptInvariant: "Every pull request must automatically build, run 100% of unit/component tests, verify zero memory retain cycles, and execute Maestro E2E smoke tests on simulated devices before merge.",
    failureMode: "Merging a pull request that passes unit tests but crashes on launch on real devices due to a missing native pod dependency.",
    tryItFriction: "Deliver a complete, passing CI test harness with automated Maestro smoke tests.",
    socraticHints: [
      "How do you run mobile E2E tests automatically inside a headless GitHub Actions CI runner?",
      "Use macOS runners with hardware virtualization enabled to boot an iOS Simulator, install the app binary, and run the Maestro CLI!",
      "Add maestro test .maestro/flow.yaml inside your GitHub Actions workflow."
    ],
    situationalPuzzle: {
      scenario: "A banking app passes all JavaScript unit tests with 100% coverage, but the release build crashes instantly on real iPhones because an iOS CocoaPod was missing from the Podfile. What layer was missing?",
      options: [
        "More unit tests.",
        "Automated End-to-End smoke tests (Maestro / Detox) that build the real native binary and boot it on an actual Simulator in CI before deployment.",
        "TypeScript checking.",
        "Manual testing."
      ],
      answerIdx: 1,
      debrief: "Unit tests only test JavaScript in Node.js. Only real native E2E builds catch native linking failures, missing CocoaPods, Android ProGuard crashes, and binary startup regressions."
    },
    quests: [
      { id: "mobile-m2-d55-q1", name: "Continuous Mobile Test Pyramid Architecture", type: "concept", desc: "Structure the pyramid: 70% Fast Unit Tests -> 20% Component RNTL -> 10% Maestro E2E Smoke Tests." },
      { id: "mobile-m2-d55-q2", name: "Detective Lab: The Native Linking Build Regression", type: "detective", desc: "Catch a missing native pod dependency in CI before deploying to QA testers." },
      { id: "mobile-m2-d55-q3", name: "Mastery Assignment: GitHub Actions Mobile CI Workflow", type: "assignment", desc: "Configure automated CI workflow running lint, typecheck, Jest, and Maestro on PRs." },
      { id: "mobile-m2-d55-m10", name: "⭐ Milestone 10: Enterprise Zero-Leak Test Harness Engine", type: "milestone", desc: "Deliver complete test harness with 100% Jest coverage, RNTL component tests, and Maestro E2E." }
    ]
  },
  {
    day: 56,
    month: 2,
    blockNum: 12,
    title: "Fastlane Automation: Match Code Signing, Matchfiles, Provisioning Profiles & Keystore Management",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Guidance (Code Signing Infrastructure & Release Automation)",
    spokenGoal: "Master automated mobile code signing: Fastlane (fastlane match, gym, supply), managing Apple Developer certificates and provisioning profiles via Git, and Android Keystore signing.",
    conceptInvariant: "Code signing is the single most frustrating bottleneck in mobile engineering. Fastlane Match encrypts certificates in a private Git repo, allowing an entire engineering team to share one deterministic signing identity.",
    failureMode: "Manually generating signing certificates on individual laptops; when an engineer leaves the company, nobody can build or update the production app.",
    tryItFriction: "Configure a Fastfile with automated lane :build_ios and lane :build_android compiling release binaries signed via environment secrets.",
    socraticHints: [
      "Why is 'Fastlane Match' considered the industry gold standard for iOS code signing?",
      "Because it stores one single encrypted set of Apple certificates and provisioning profiles in a secure Git repo, ending certificate chaos across team members!",
      "Run fastlane match appstore to sync deterministic production certificates automatically."
    ],
    situationalPuzzle: {
      scenario: "A release manager attempts to build a production iOS update on a CI server. The build fails with 'Provisioning profile doesn't include signing certificate'. How does Fastlane Match prevent this?",
      options: [
        "Disable code signing.",
        "Fastlane Match decrypts the exact valid certificate and matching provisioning profile from a private repository, ensuring 100% signing reproducibility on any CI machine.",
        "Build without a Mac.",
        "Ask Apple for help."
      ],
      answerIdx: 1,
      debrief: "Fastlane Match eliminates code signing mismatches by creating one central source of truth for certificates and profiles, provisioning CI machines deterministically with one command."
    },
    quests: [
      { id: "mobile-m2-d56-q1", name: "Apple & Android Cryptographic Signing Topology", type: "concept", desc: "Trace certificate chain: Apple Root CA -> Developer Certificate -> Provisioning Profile -> Signed IPA." },
      { id: "mobile-m2-d56-q2", name: "Detective Lab: The CI Certificate Mismatch Failure", type: "detective", desc: "Configure fastlane match to decrypt and install certificates automatically on headless CI runners." },
      { id: "mobile-m2-d56-q3", name: "Mastery Assignment: Multi-Environment Fastfile Pipeline", type: "assignment", desc: "Author Fastfile with staging and production release lanes for TestFlight and Play Store Internal." },
      { id: "mobile-m2-d56-q4", name: "Production Incident Lab: Android Release Keystore Password Leak", type: "detective", desc: "Secure Android release signing credentials using environment variable injection." }
    ]
  },
  {
    day: 57,
    month: 2,
    blockNum: 12,
    title: "EAS Build & Over-The-Air (OTA) Updates: Bundle Versioning & Rollback Strategies",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Guidance (Cloud Build Clusters & Instant Bug Fixes)",
    spokenGoal: "Master cloud mobile build pipelines: Expo Application Services (EAS Build), Over-The-Air (OTA) JavaScript bundle updates (EAS Update), and runtime rollback strategies.",
    conceptInvariant: "OTA updates allow shipping instant bug fixes to millions of users in seconds by downloading fresh JavaScript bundles directly, bypassing the 2-day App Store review queue.",
    failureMode: "Publishing an OTA update with incompatible native code changes (e.g. adding a new native CocoaPod), causing the app to crash on launch for all users.",
    tryItFriction: "Configure EAS Update with runtimeVersion policies ('fingerprint' / '1.0.0') and implement a safe rollback mechanism for bad deployments.",
    socraticHints: [
      "What is the #1 rule of Over-The-Air (OTA) mobile updates?",
      "OTA updates can ONLY modify JavaScript and asset files! If you added, removed, or changed native C++/Swift/Kotlin libraries, you MUST submit a full native app binary to the App Store.",
      "Match runtimeVersion so OTA updates only deliver to compatible native binary versions."
    ],
    situationalPuzzle: {
      scenario: "A critical bug in production causes the checkout screen to crash. App Store review takes 48 hours to approve an update. How does a Staff Mobile Architect deploy a fix in 60 seconds?",
      options: [
        "Wait 48 hours.",
        "Publish an Over-The-Air (OTA) update via EAS Update or CodePush, which delivers the patched JavaScript bundle directly to users' phones upon their next app restart.",
        "Tell users to stop checking out.",
        "Shut down the app."
      ],
      answerIdx: 1,
      debrief: "OTA updates bypass the app store review process for pure JavaScript/TypeScript fixes, allowing emergency hotfixes to reach millions of users within minutes."
    },
    quests: [
      { id: "mobile-m2-d57-q1", name: "OTA Bundle Delivery Infrastructure", type: "concept", desc: "Trace bundle loading: App Launch -> Check Remote Hash -> Download Bundle -> Swap on Next Launch." },
      { id: "mobile-m2-d57-q2", name: "Detective Lab: The Incompatible Native OTA Crash", type: "detective", desc: "Configure runtimeVersion fingerprinting to prevent delivering JS bundles to incompatible native shells." },
      { id: "mobile-m2-d57-q3", name: "Mastery Assignment: Production EAS Build Matrix", type: "assignment", desc: "Configure eas.json with production profiles, environment secrets, and automated changelog tagging." },
      { id: "mobile-m2-d57-q4", name: "Production Incident Lab: Instant Emergency Rollback Dispatch", type: "detective", desc: "Execute an immediate EAS update rollback to revert a bad production deployment in seconds." }
    ]
  },
  {
    day: 58,
    month: 2,
    blockNum: 12,
    title: "App Store & Google Play Compliance: Apple Privacy Manifests & Android AAB Bundles",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "High Guidance (Store Guidelines, Privacy Laws & App Binary Optimization)",
    spokenGoal: "Master store submission compliance: Apple Privacy Manifests (NSPrivacyAccessedAPITypes), App Tracking Transparency (ATT), Google Play Data Safety forms, and Android App Bundles (AAB).",
    conceptInvariant: "Apple rejects all apps using system APIs (User Defaults, File Timestamps, Disk Space) without an explicit Privacy Manifest declaring approved business reasons. Android requires App Bundles (AAB) with dynamic feature delivery.",
    failureMode: "App Store review rejection due to missing privacy manifests in third-party native SDKs or failing to explain tracking permissions.",
    tryItFriction: "Generate a complete NSPrivacy.bundle declaring all accessed API types and compile a release Android App Bundle (AAB).",
    socraticHints: [
      "Why did Apple reject the mobile app update with error ITMS-91053?",
      "The app or one of its dependencies accessed required reason APIs (like system boot time or UserDefaults) without a Privacy Manifest declaring the approved reason!",
      "Add an app.json privacy manifest declaring exact NSPrivacyAccessedAPIType reasons."
    ],
    situationalPuzzle: {
      scenario: "A company submits an update to Google Play. The APK size is 85MB. Google Play console issues a warning about high uninstall rates. How does compiling to an Android App Bundle (.aab) fix this?",
      options: [
        "It deletes images.",
        "Google Play uses the AAB to generate optimized split APKs containing only the exact CPU architecture (arm64-v8a) and screen density for each specific device, cutting download size by 60%.",
        "It removes security.",
        "It requires Android 14."
      ],
      answerIdx: 1,
      debrief: "Android App Bundles (.aab) defer APK generation to Google Play, delivering device-optimized binaries (only the device's exact CPU architecture and screen density) instead of bloated fat APKs."
    },
    quests: [
      { id: "mobile-m2-d58-q1", name: "Apple Privacy Manifest & ATT Regulations", type: "concept", desc: "Analyze Apple's 2024+ privacy manifest mandates and Google Play Data Safety disclosures." },
      { id: "mobile-m2-d58-q2", name: "Detective Lab: The ITMS-91053 Privacy Rejection Fix", type: "detective", desc: "Audit native libraries and generate compliant NSPrivacyAccessedAPIType declarations." },
      { id: "mobile-m2-d58-q3", name: "Mastery Assignment: Optimized Android App Bundle (AAB) Build", type: "assignment", desc: "Compile release AAB with resource shrinking, ProGuard optimization, and architecture splits." },
      { id: "mobile-m2-d58-q4", name: "Production Incident Lab: App Store Guideline 2.1 Resolution", type: "detective", desc: "Remediate review rejections regarding metadata clarity and background audio justification." }
    ]
  },
  {
    day: 59,
    month: 2,
    blockNum: 12,
    title: "Production Monitoring: Sentry Crash Reporting, Native Crash Dumps (dSYM / ProGuard) & Telemetry",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Real-Time Observability & Crash Symbolication)",
    spokenGoal: "Master production observability: Sentry crash reporting, symbolicating minified JavaScript stack traces with source maps, and resolving native crash dumps using Apple dSYMs and ProGuard mapping.txt.",
    conceptInvariant: "When a mobile app crashes in production, the stack trace is minified unreadable gibberish unless uploaded source maps and native dSYM symbols match the exact release build hash.",
    failureMode: "A production native crash report showing only '0x00000001048b2910' because dSYMs were not uploaded to Sentry during the CI build.",
    tryItFriction: "Integrate Sentry SDK, configure automatic source map and dSYM uploads in Fastlane, and trace a production crash from breadcrumbs to line of code.",
    socraticHints: [
      "Why is an uploaded dSYM file required to debug native iOS crashes in Sentry?",
      "Native iOS binaries compile to machine code. A dSYM (Debug Symbol) file maps raw memory addresses back to original Swift/C++ file names and line numbers!",
      "Configure fastlane to upload dSYMs automatically during the gym build phase."
    ],
    situationalPuzzle: {
      scenario: "A release crashes for 2% of users on startup. Sentry reports: 'TypeError: undefined is not an object (evaluating t.get) at index.android.bundle:1:4821'. How do you decode the exact source line?",
      options: [
        "Guess the line.",
        "Upload the production release source maps to Sentry, allowing the crash reporter to symbolicate index.android.bundle back to src/services/AuthService.ts:42.",
        "Ask the user for their phone.",
        "Disable Sentry."
      ],
      answerIdx: 1,
      debrief: "Source maps map minified, bundled production JavaScript back to original TypeScript files. Uploading source maps during CI enables instant symbolication of crash reports in production monitoring."
    },
    quests: [
      { id: "mobile-m2-d59-q1", name: "Production Crash Symbolication Pipeline", type: "concept", desc: "Trace crash telemetry: Device Crash -> Sentry Ingestion -> Source Map / dSYM Demangle -> Clean Stack Trace." },
      { id: "mobile-m2-d59-q2", name: "Detective Lab: The Unsymbolicated Memory Hex Crash", type: "detective", desc: "Upload missing dSYM debug symbols to Sentry to decode a native iOS crash trace." },
      { id: "mobile-m2-d59-q3", name: "Mastery Assignment: Breadcrumb User Journey Tracker", type: "assignment", desc: "Configure Sentry breadcrumb tracking recording navigation events and network state before crashes." },
      { id: "mobile-m2-d59-q4", name: "Production Incident Lab: Crash Free User Rate SLA Alert", type: "detective", desc: "Set up alerts triggering pager duty when 99.5% crash-free session SLA is breached." }
    ]
  },
  {
    day: 60,
    month: 2,
    blockNum: 12,
    title: "🏆 Month 2 Master Capstone Gate: PulseMobile High-Frequency Trading Terminal & Live Viva",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Master Capstone Integration & Code Defense)",
    spokenGoal: "Architect, benchmark, and defend PulseMobile: An institutional-grade mobile trading terminal featuring 120 FPS Reanimated gesture charts, custom C++ JSI order-book matcher, offline-first SQLite delta sync, hardware Keychain authentication, and automated Maestro E2E test passes.",
    conceptInvariant: "PulseMobile must maintain 120 FPS under 1,000 live price ticks per second, survive complete network loss in airplane mode with zero UI lockups, and pass all store compliance checks.",
    failureMode: "A single frame drop, memory retain cycle, unhandled crash, or security vulnerability results in immediate capstone failure.",
    tryItFriction: "Deliver the complete PulseMobile codebase and defend architectural decisions before a panel of Principal Mobile Architects.",
    socraticHints: [
      "How does PulseMobile process 1,000 price updates per second without freezing the mobile UI?",
      "Incoming market ticks pass into our custom C++ JSI TurboModule, and chart rendering is driven directly on the UI thread via Reanimated worklets, completely bypassing React component reconciliation!",
      "Use JSI for high-frequency data and drive animated views directly on the UI thread."
    ],
    situationalPuzzle: {
      scenario: "You are presenting PulseMobile to a panel of Principal Architects at a Tier-1 tech company. They ask: 'Walk us through your memory management strategy: how do you guarantee zero Jetsam terminations during a 4-hour active trading session?' How do you defend your architecture?",
      options: [
        "By hoping the phone has enough memory.",
        "By demonstrating our 4-tier memory architecture: FlashList native view recycling for orders, WatermelonDB lazy loading for historical charts, strict unmounting of gesture subscriptions, and automated Xcode Instruments allocation budgets in CI.",
        "By clearing all data every 10 minutes.",
        "By disabling animations."
      ],
      answerIdx: 1,
      debrief: "Enterprise mobile engineering demands defensive memory management: bounded virtualized lists, lazy database querying, proactive closure unsubscription, and continuous CI profiling against memory regression budgets."
    },
    quests: [
      { id: "mobile-m2-d60-q1", name: "PulseMobile Architecture Blueprint & Security Threat Model", type: "concept", desc: "Design the end-to-end topology: C++ JSI TurboModule -> Reanimated 120Hz UI Thread -> Hardware Keychain -> Fastlane CI." },
      { id: "mobile-m2-d60-q2", name: "Stress Test: 1,000 Tick/Sec 120 FPS High-Frequency Audit", type: "detective", desc: "Benchmark PulseMobile under continuous market ticks asserting 120 FPS and <50MB RAM ceiling." },
      { id: "mobile-m2-d60-q3", name: "Mastery Capstone: Production PulseMobile Deployment", type: "assignment", desc: "Deploy PulseMobile with biometric hardware vault, offline delta sync, and Fastlane release lanes." },
      { id: "mobile-m2-d60-cap", name: "🏆 Live Staff Architecture Viva & Senior Code Defense", type: "milestone", desc: "Defend mobile runtime mechanics, C++ JSI memory models, and store compliance against staff engineering review." }
    ]
  }
];
