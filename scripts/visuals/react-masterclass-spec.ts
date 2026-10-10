// scripts/visuals/react-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Full-Stack React Web Development (course-react-web)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, and FAANG/Staff Frontend Engineering rubrics.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const REACT_MONTH_1_SPECS: MasterclassDaySpec[] = [
  // ── BLOCK 1: Web Architecture & The React Mental Model (Days 1–5) ─────────────
  {
    day: 1,
    month: 1,
    blockNum: 1,
    title: "The Modern Web Engine: Browser Parsing, DOM Tree Construction & The Cost of Direct DOM Mutations",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Browser Parsing & DOM Cost Model)",
    spokenGoal: "Master how web browsers work under the hood: HTML tokenization, DOM tree parsing, CSSOM construction, and why mutating the native DOM in loops destroys frame rates.",
    conceptInvariant: "The Document Object Model (DOM) is a C++ data structure inside the browser engine. Every direct JavaScript DOM mutation (like appendChild or innerHTML) crosses the JS-to-C++ boundary and triggers costly layout recalculations and repaint pipelines.",
    failureMode: "Writing imperative loops that update `element.innerHTML` or `element.style` 1,000 times in a single tick locks up the browser main thread, dropping frame rates to single digits.",
    tryItFriction: "Batch 500 individual imperative DOM updates into a single DocumentFragment or observe the 20x performance drop of direct element insertion.",
    socraticHints: [
      "Why did the browser freeze when adding 500 list items one by one?",
      "Every time you modify the live DOM, the browser recalculates layout geometry (reflow) and repaints pixels!",
      "Batch all operations offscreen using a DocumentFragment, or let a declarative library batch updates for you."
    ],
    situationalPuzzle: {
      scenario: "A developer builds a live stock ticker by running a setInterval loop that updates document.getElementById('price').innerText = newPrice every 10ms for 100 stocks. The browser tab consumes 100% CPU and user clicks lag by 400ms. What is the root bottleneck?",
      options: [
        "The JavaScript math calculations are too complex for V8.",
        "Forced synchronous reflow: Repeatedly mutating 100 individual live DOM nodes at 100Hz continuously invalidates the layout tree, overwhelming the browser compositor.",
        "The browser network card cannot handle 100 price updates.",
        "The stocks array is stored in session storage instead of local storage."
      ],
      answerIdx: 1,
      debrief: "Directly mutating live DOM nodes at high frequency forces the browser engine into continuous layout invalidation and style recalculation, starving the event loop of user input cycles."
    },
    quests: [
      { id: "react-m1-d01-q1", name: "The Critical Rendering Path Topology", type: "concept", desc: "Trace how HTML tokens transform into the C++ DOM tree, CSSOM, Render Tree, Layout geometry, and Paint layers." },
      { id: "react-m1-d01-q2", name: "Detective Lab: The Unbatched DOM Mutation Trap", type: "detective", desc: "Profile and fix an imperative script that triggers 500 individual layout reflows in a single animation frame." },
      { id: "react-m1-d01-q3", name: "Mastery Assignment: Offscreen DocumentFragment Ingestion Engine", type: "assignment", desc: "Construct a high-throughput DOM ingestion buffer that batches 10,000 records offscreen before a single commit." },
      { id: "react-m1-d01-q4", name: "Production Incident Lab: Main-Thread UI Lockup Post-Mortem", type: "detective", desc: "Isolate a production memory and reflow spike caused by raw innerHTML injection during high-frequency telemetry streaming." }
    ]
  },
  {
    day: 2,
    month: 1,
    blockNum: 1,
    title: "Declarative UI vs Imperative DOM: The React Element Tree, JSX & React.createElement",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Declarative Paradigm & JSX Transpilation)",
    spokenGoal: "Understand the fundamental shift from imperative scripting to declarative UI: learn what JSX actually compiles to (plain JS objects via React.createElement) and how React decouples UI description from DOM mutation.",
    conceptInvariant: "JSX is not HTML; it is syntactic sugar for `React.createElement(type, props, ...children)` which returns a plain, immutable JavaScript object (a React Element). React reconciles these objects in memory before touching the real DOM.",
    failureMode: "Thinking JSX is a string or HTML template and trying to call DOM methods like `addEventListener` or `classList.add` directly on JSX variables.",
    tryItFriction: "Write a React component using raw `React.createElement` objects without any JSX syntax to prove that React elements are ordinary plain JavaScript objects.",
    socraticHints: [
      "What actually is `<div className='card'>Hello</div>` once compiled by Babel/Vite?",
      "It is simply an object: `{ type: 'div', props: { className: 'card', children: 'Hello' } }`!",
      "React reads this tree of lightweight plain objects to determine what the native DOM should look like."
    ],
    situationalPuzzle: {
      scenario: "A junior engineer tries to inspect a button's computed width inside the render method by logging `const btn = <button>Click</button>; console.log(btn.offsetWidth);`. The console outputs `undefined`. Why?",
      options: [
        "The button has not received CSS styling yet.",
        "The JSX tag `<button>` is an immutable plain JavaScript descriptor object in memory, not a real rendered C++ DOM node.",
        "React requires width to be passed as a prop.",
        "The Babel compiler stripped the offsetWidth property."
      ],
      answerIdx: 1,
      debrief: "JSX produces lightweight React Element objects in memory. They have properties like type, props, and key, but possess zero browser DOM properties like offsetWidth or style sheets until committed to the document."
    },
    quests: [
      { id: "react-m1-d02-q1", name: "The React Element Object Anatomy", type: "concept", desc: "Deconstruct the internal structure of React Element descriptors: $$typeof, type, key, ref, props, and children." },
      { id: "react-m1-d02-q2", name: "Detective Lab: De-Babelizing Broken JSX", type: "detective", desc: "Diagnose an invalid JSX nesting bug by converting the component tree into raw React.createElement calls." },
      { id: "react-m1-d02-q3", name: "Mastery Assignment: Imperative to Declarative UI Port", type: "assignment", desc: "Refactor a 200-line vanilla JS DOM-manipulation widget into a pure declarative React element tree." },
      { id: "react-m1-d02-q4", name: "Production Incident Lab: The Symbol.for('react.element') XSS Defense", type: "detective", desc: "Analyze why React tags all elements with a unique Symbol to prevent malicious JSON injection attacks from rendering." }
    ]
  },
  {
    day: 3,
    month: 1,
    blockNum: 1,
    title: "Component Anatomy & Pure Functions: The Strict Props Immutability Contract",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Functional Purity & Unidirectional Props)",
    spokenGoal: "Master React functional components as pure functions: Understand the strict unidirectional data flow, props immutability, and why components must never produce side effects during the render phase.",
    conceptInvariant: "A React component must be a pure function with respect to its props: given the same inputs (props), it must always return the same output (JSX) and must NEVER mutate the props object passed to it.",
    failureMode: "Mutating `props.user.name = 'New Name'` inside a child component causes silent state bugs, inconsistent renders across sibling trees, and breaks time-travel debugging.",
    tryItFriction: "Identify and eliminate a sneaky prop mutation inside a sorting child component by creating a shallow copy before sorting.",
    socraticHints: [
      "Why did the parent component's user list get re-ordered even though the parent never called a setState?",
      "The child component ran `props.items.sort()`, which mutates the parent array in place!",
      "Always clone arrays before sorting: `[...props.items].sort()` to preserve props immutability."
    ],
    situationalPuzzle: {
      scenario: "A banking application renders an account statement. The statement component calculates interest by writing: `props.account.balance += calculateInterest(props.account.balance)`. Under React 18 Strict Mode, why does the displayed balance double unexpectedly?",
      options: [
        "Strict Mode multiplies all numbers by 2.",
        "React Strict Mode intentionally invokes component render functions twice in development to uncover impure functions and props mutations.",
        "The browser runs JavaScript twice for security.",
        "The calculation function has a memory leak."
      ],
      answerIdx: 1,
      debrief: "React Strict Mode runs render functions twice in development. Because the component mutated props.account.balance in place, the second invocation compounded the mutation, doubling the balance."
    },
    quests: [
      { id: "react-m1-d03-q1", name: "The Mathematical Pure Function Contract in React", type: "concept", desc: "Formalize the rules of pure components: idempotence, zero global mutations, and deterministic output." },
      { id: "react-m1-d03-q2", name: "Detective Lab: The StrictMode Double-Mutation Bug", type: "detective", desc: "Debug an e-commerce cart component where item quantities increase exponentially due to an impure render mutation." },
      { id: "react-m1-d03-q3", name: "Mastery Assignment: Deeply Frozen Props Verification Guard", type: "assignment", desc: "Implement a development-mode invariant wrapper using Object.freeze to guarantee 100% props immutability." },
      { id: "react-m1-d03-q4", name: "Production Incident Lab: Corrupted Global State via Prop Tampering", type: "detective", desc: "Trace an enterprise outage where a nested permissions component mutated a shared organization config object." }
    ]
  },
  {
    day: 4,
    month: 1,
    blockNum: 1,
    title: "Interactive State: useState Dispatcher, State Queuing & Asynchronous Batching Mechanics",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (State Dispatcher & Automatic Batching)",
    spokenGoal: "Master the mechanics of `useState`: Understand how React schedules state updates, why state variables are immutable snapshots of a single render frame, and how React 18 automatic batching groups multiple dispatches.",
    conceptInvariant: "Calling a state setter does NOT immediately update the local variable in the currently executing function; it queues an update for the NEXT render. In React 18, all state updates across timeouts, promises, and native events are automatically batched.",
    failureMode: "Calling `setCount(count + 1)` three times sequentially expecting the count to increase by 3, but observing it only increments by 1 because all three calls read the same render snapshot.",
    tryItFriction: "Refactor three sequential `setCount(count + 1)` calls into functional updater callbacks `setCount(c => c + 1)` and verify that the queue processes all three increments correctly.",
    socraticHints: [
      "Why did calling `setCount(count + 1)` three times in a row only increase count by 1?",
      "In the current render pass, `count` is a constant number (e.g. 0). You passed `0 + 1 = 1` three times!",
      "Use the updater function syntax: `setCount(prev => prev + 1)` so each step reads the pending queued value."
    ],
    situationalPuzzle: {
      scenario: "A developer writes an event handler: `setCount(count + 1); console.log(count);`. If count was initially 0, why does the console print 0 immediately after the setter line?",
      options: [
        "The setter failed to execute.",
        "State is a snapshot scoped to the current render execution context; the new state only exists in the subsequent render frame.",
        "console.log is asynchronous in modern browsers.",
        "React requires a callback parameter in console.log."
      ],
      answerIdx: 1,
      debrief: "State variables are constants within the scope of a specific render execution. Calling setCount schedules a re-render with the new value, but does not alter the local variable in the current frame."
    },
    quests: [
      { id: "react-m1-d04-q1", name: "The Hook Dispatcher Queue Mechanics", type: "concept", desc: "Analyze how React tracks hook state via singly linked lists on fiber nodes and queues update actions." },
      { id: "react-m1-d04-q2", name: "Detective Lab: The Stale Counter Snapshot Trap", type: "detective", desc: "Diagnose an order checkout counter that drops quantity increments during rapid user clicking." },
      { id: "react-m1-d04-q3", name: "Mastery Assignment: Functional State Reducer Pipeline", type: "assignment", desc: "Build an undo/redo state manager using useState updater functions with zero intermediate state corruption." },
      { id: "react-m1-d04-q4", name: "Production Incident Lab: React 18 Auto-Batching Migration Glitch", type: "detective", desc: "Debug an enterprise app where migrating to React 18 caused layout measuring to fire before batched state completed." }
    ]
  },
  {
    day: 5,
    month: 1,
    blockNum: 1,
    title: "Milestone 1: Component Architecture & Interactive Counter State Machine",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Foundational React Architecture)",
    spokenGoal: "Build and defend Milestone 1: An interactive multi-counter state machine featuring step increments, min/max invariant boundaries, history tracking, and strict props/state separation.",
    conceptInvariant: "Interactive components must encapsulate private state while exposing clean, declarative prop contracts to their parents. State transitions must satisfy boundary invariants at all times.",
    failureMode: "Allowing counters to exceed hard financial limits due to unconstrained state mutations or missing clamp logic.",
    tryItFriction: "Enforce hard boundary invariants [MIN: 0, MAX: 100] using pure updater functions and display dynamic warning banners when boundaries are reached.",
    socraticHints: [
      "Where should the boundary check [0, 100] live?",
      "Place it directly inside the functional updater: `setCount(prev => Math.min(100, Math.max(0, prev + delta)))`.",
      "This guarantees that no queued update can ever violate your business invariants."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 1 defense, a reviewer rapidly clicks 'Reset' and 'Increment' within 5 milliseconds. The counter displays NaN. What caused this?",
      options: [
        "The browser ran out of memory.",
        "The reset handler set state to undefined instead of a numeric initial value, and subsequent increment additions evaluated to NaN.",
        "React cannot handle clicks faster than 10ms.",
        "The CSS animation blocked the CPU."
      ],
      answerIdx: 1,
      debrief: "State initializers and reset transitions must always maintain the expected type invariant. Passing undefined to a numeric state causes subsequent mathematical operations to cascade into NaN."
    },
    quests: [
      { id: "react-m1-d05-q1", name: "Milestone 1 Specification & State Architecture", type: "concept", desc: "Design the state transition diagram and prop contracts for the interactive multi-counter system." },
      { id: "react-m1-d05-q2", name: "Detective Lab: The Boundary Overflow Glitch", type: "detective", desc: "Isolate and fix race conditions allowing negative values in an inventory item selector." },
      { id: "react-m1-d05-q3", name: "Mastery Assignment: Multi-Counter Ledger with State Snapshot History", type: "assignment", desc: "Implement a production-grade multi-counter system with step scaling, limits, and an undo/redo stack." },
      { id: "react-m1-d05-q4", name: "Milestone 1 Defense: Architectural Invariant Review", type: "detective", desc: "Defend your component tree, prop design, and functional state updates against Senior Architect review." }
    ]
  },

  // ── BLOCK 2: Collections, Forms & Referential Equality (Days 6–10) ───────────
  {
    day: 6,
    month: 1,
    blockNum: 2,
    title: "Collection Rendering: The List Reconciliation Invariant & Why Index Keys Destroy State",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (List Reconciliation & Key Identity)",
    spokenGoal: "Master rendering dynamic lists in React: Understand how React matches elements across renders, the true purpose of the `key` prop, and why using array indices as keys creates devastating UI bugs in dynamic lists.",
    conceptInvariant: "The `key` prop is React's only identity anchor for elements in a collection. It must be unique, stable, and persistent across renders. Using the array index as a key confuses React when items are inserted, deleted, or reordered.",
    failureMode: "Using `key={index}` in a list of inputs: when the first item is deleted, the DOM input values remain in place while the labels shift, causing user data to attach to the wrong record.",
    tryItFriction: "Demonstrate the index key bug by deleting the top item of an input list, then fix it by assigning persistent unique database IDs as keys.",
    socraticHints: [
      "Why did deleting the top todo item leave its checked checkbox on the NEW top item?",
      "Because with `key={index}`, React sees keys [0, 1] becoming [0]. It thinks item 0 stayed and item 1 was removed!",
      "Assign a permanent unique ID like `key={item.id}` so React knows exactly which DOM node to remove."
    ],
    situationalPuzzle: {
      scenario: "An enterprise data table allows users to sort rows by clicking column headers. The rows contain editable text inputs. The developer used `key={index}`. When a user sorts by 'Name', what critical bug occurs?",
      options: [
        "The browser crashes with an Out of Memory error.",
        "The text labels reorder correctly, but the user's unsaved input text remains tied to their original row indices, corrupting customer data.",
        "React throws an invalid key exception.",
        "All row inputs are wiped blank."
      ],
      answerIdx: 1,
      debrief: "React reuses DOM nodes based on key identity. With index keys, DOM node 0 retains its uncommitted input state even when the underlying data array swaps element 0 with element 5."
    },
    quests: [
      { id: "react-m1-d06-q1", name: "The List Reconciliation Algorithm Mechanics", type: "concept", desc: "Trace how React's diffing engine reconciles keyed children using a Map lookup to achieve O(N) complexity." },
      { id: "react-m1-d06-q2", name: "Detective Lab: The Shifted Form Field Disaster", type: "detective", desc: "Fix an expense tracker where deleting an entry copies receipt amounts onto adjacent colleagues' rows." },
      { id: "react-m1-d06-q3", name: "Mastery Assignment: Dynamic Reorderable Task Priority Queue", type: "assignment", desc: "Build a drag-and-drop or up/down reorderable list with persistent stable keys and animated transitions." },
      { id: "react-m1-d06-q4", name: "Production Incident Lab: Key Collisions in Paginated Tables", type: "detective", desc: "Remediate a production bug where concatenating page items produced duplicate keys, breaking DOM mutations." }
    ]
  },
  {
    day: 7,
    month: 1,
    blockNum: 2,
    title: "Conditional Rendering: Guard Clauses, Ternaries & The Falsy Zero (0 && <Component/>) Pitfall",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Conditional Rendering & Boolean Coercion)",
    spokenGoal: "Master conditional UI rendering: Learn when to use early return guard clauses, ternary operators, and understand why the common `count && <Component/>` pattern leaks the number '0' onto user screens.",
    conceptInvariant: "In JavaScript, `0 && <Component/>` evaluates to `0`, NOT `false`. Because React renders numbers directly to the DOM, an unread count of 0 renders an unwanted '0' on the webpage. Always use boolean coercion `Boolean(count)` or `count > 0`.",
    failureMode: "Writing `{unreadCount && <Badge count={unreadCount} />}` displays an orphaned '0' on the user's navbar when there are no unread messages.",
    tryItFriction: "Audit a component containing multiple logical AND (`&&`) checks, replace falsy numeric traps with explicit comparisons (`items.length > 0 ? ... : null`), and verify clean DOM output.",
    socraticHints: [
      "Why is there a random '0' sitting in the top header?",
      "In JavaScript, `0 && anything` returns `0`. React prints numbers verbatim to the screen!",
      "Write `{items.length > 0 && <Badge />}` or use a ternary `{items.length > 0 ? <Badge /> : null}`."
    ],
    situationalPuzzle: {
      scenario: "A mobile-responsive notification bell uses `{notifications.length && <NotificationList />}`. When the notification array is empty (`length === 0`), QA files a high-priority UI bug. What did QA see?",
      options: [
        "A blank white screen of death.",
        "A raw '0' character rendered directly on top of the bell icon.",
        "An uncaught TypeError in the console.",
        "A frozen navigation drawer."
      ],
      answerIdx: 1,
      debrief: "JavaScript short-circuit evaluation returns the falsy value itself. When notifications.length is 0, the expression evaluates to 0. React treats numbers as valid printable text, rendering '0' into the DOM."
    },
    quests: [
      { id: "react-m1-d07-q1", name: "JavaScript Logical Short-Circuiting in React JSX", type: "concept", desc: "Examine how boolean coercion rules interact with React's JSX child rendering engine." },
      { id: "react-m1-d07-q2", name: "Detective Lab: The Ghost Number Zero Investigation", type: "detective", desc: "Scan a broken dashboard codebase and eliminate 6 instances of falsy numeric leaks in header menus." },
      { id: "react-m1-d07-q3", name: "Mastery Assignment: Polymorphic State Notification Center", type: "assignment", desc: "Build a notification tray supporting empty, loading, error, and loaded states via clean guard patterns." },
      { id: "react-m1-d07-q4", name: "Production Incident Lab: Null Pointer in Unrendered Branch", type: "detective", desc: "Fix a crash where an unprotected deep property read executed even when parent data was null." }
    ]
  },
  {
    day: 8,
    month: 1,
    blockNum: 2,
    title: "Controlled Components: Single Source of Truth, Input State & Synthetic Event Invariants",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Controlled Forms & Synthetic Events)",
    spokenGoal: "Master controlled form components: Understand why React binds input values to state (Single Source of Truth), how React's cross-browser SyntheticEvent system works, and how to prevent uncontrolled-to-controlled warnings.",
    conceptInvariant: "In a controlled component, the React state is the single source of truth for the input's current value. Initializing state with `undefined` or `null` causes React to mount the input as uncontrolled, triggering a console error when state later becomes defined.",
    failureMode: "Initializing form state with `useState()` (which defaults to `undefined`). When the user types their first letter, React warns: 'A component is changing an uncontrolled input to be controlled'.",
    tryItFriction: "Build a controlled input form that formats credit card numbers with spaces every 4 digits on every keystroke, rejecting non-numeric characters in real time.",
    socraticHints: [
      "Why did React warn about 'uncontrolled input changing to be controlled'?",
      "Your initial state was `undefined`, so React mounted the input without a controlled value!",
      "Always initialize input state with an empty string: `useState('')`."
    ],
    situationalPuzzle: {
      scenario: "A user pastes an international phone number with hyphens and letters into a controlled input. The developer wants only digits stored in state. Where must the sanitation logic occur?",
      options: [
        "In a CSS mask property.",
        "Directly inside the `onChange` event handler before calling `setPhone(cleanedDigits)`.",
        "In the component's return JSX statement.",
        "Inside the browser's onsubmit action."
      ],
      answerIdx: 1,
      debrief: "In controlled components, the onChange handler intercepts the native input event, formats/sanitizes the raw value, and passes the cleaned string to the state dispatcher, ensuring state remains canonical."
    },
    quests: [
      { id: "react-m1-d08-q1", name: "The Controlled Component Synchronization Loop", type: "concept", desc: "Diagram the flow: User Keypress -> SyntheticEvent -> onChange Handler -> setState -> Virtual DOM -> DOM Value Commit." },
      { id: "react-m1-d08-q2", name: "Detective Lab: The Uncontrolled Input Mutation Warning", type: "detective", desc: "Eliminate all uncontrolled-to-controlled warning warnings in a complex user profile onboarding form." },
      { id: "react-m1-d08-q3", name: "Mastery Assignment: Real-Time Masked Credit Card & IBAN Formatter", type: "assignment", desc: "Build a production payment form with live formatting, cursor positioning, and instant validation." },
      { id: "react-m1-d08-q4", name: "Production Incident Lab: SyntheticEvent Pooling & Async Handler Loss", type: "detective", desc: "Understand legacy event pooling versus modern React 17/18 direct delegation at the root rootContainer." }
    ]
  },
  {
    day: 9,
    month: 1,
    blockNum: 2,
    title: "Uncontrolled Components & Refs: useRef for DOM Access & Mutable Variables without Re-Rendering",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Refs, Imperative Handles & Render Isolation)",
    spokenGoal: "Master `useRef`: Understand when to break out of declarative React for imperative DOM access (focus, scroll, media playback), and how to use refs as persistent mutable instance variables that survive re-renders without triggering new renders.",
    conceptInvariant: "Mutating `ref.current` is completely synchronous and NEVER triggers a component re-render. Reading or writing `ref.current` during the render phase violates functional purity; refs should only be mutated in effects or event handlers.",
    failureMode: "Storing an active timer ID or WebSocket connection in `useState`, causing an unnecessary full-component re-render every time the timer ticks or resets.",
    tryItFriction: "Create an auto-focusing input field on modal open using `useRef` and implement a stopwatch that counts elapsed milliseconds in a ref without re-rendering on every tick.",
    socraticHints: [
      "Why did setting the interval ID in state cause the stopwatch to glitch?",
      "Every time you updated state with the new interval ID, React re-rendered the component!",
      "Store interval IDs, previous values, and DOM nodes in `useRef` because updating a ref does not trigger a re-render."
    ],
    situationalPuzzle: {
      scenario: "An engineer wants to measure the previous value of a prop. They write: `const prev = useRef(); prev.current = props.val; return <div>{prev.current}</div>;`. Why is writing to `prev.current` during render forbidden?",
      options: [
        "useRef is read-only.",
        "Mutating a ref during render breaks pure rendering: if React interrupts or restarts the render pass, the ref contains corrupted intermediate state.",
        "The browser DOM will crash.",
        "React StrictMode throws a syntax error."
      ],
      answerIdx: 1,
      debrief: "Render functions must remain pure. Writing to refs during render introduces side effects that can corrupt state if React pauses, abandons, or re-runs a concurrent render pass."
    },
    quests: [
      { id: "react-m1-d09-q1", name: "The useRef Object Memory Lifecycle", type: "concept", desc: "Trace how React maintains the same `{ current: value }` container reference across the entire fiber lifetime." },
      { id: "react-m1-d09-q2", name: "Detective Lab: The Re-Render Storm Timer Bug", type: "detective", desc: "Refactor a high-frequency animation timer that mistakenly stored internal frame handles in useState." },
      { id: "react-m1-d09-q3", name: "Mastery Assignment: Video Player Controller with Imperative DOM Ref", type: "assignment", desc: "Build a custom video player interface managing playback, volume, fullscreen, and scrubbing via refs." },
      { id: "react-m1-d09-q4", name: "Production Incident Lab: Focus Trapping & Accessibility Leak", type: "detective", desc: "Remediate a modal dialog where closing failed to return keyboard focus to the triggering ref button." }
    ]
  },
  {
    day: 10,
    month: 1,
    blockNum: 2,
    title: "Milestone 2: Dynamic Multi-Step Form Engine with Validation & Ref Stepping",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Form Engine & Ref Management)",
    spokenGoal: "Build and defend Milestone 2: A production multi-step checkout form featuring controlled inputs, schema-driven validation, error banners, auto-focusing on invalid inputs via refs, and state persistence.",
    conceptInvariant: "Complex multi-step forms must isolate step state, prevent navigation to subsequent steps until current field invariants are satisfied, and maintain a unified canonical form schema.",
    failureMode: "Allowing a user to jump to the review step while mandatory billing address fields contain invalid data, resulting in downstream payment API rejections.",
    tryItFriction: "Implement field-level dirty checking, real-time regex validation, and automatically focus the first invalid input using `inputRef.current.focus()` when the user attempts to advance.",
    socraticHints: [
      "How do we automatically scroll and focus the user's cursor onto the broken input?",
      "Maintain a map of refs for each input field: `inputRefs.current[fieldName]`.",
      "When validation fails, look up the first failing field and call `.focus()` on its ref."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 2 review, a user inputs valid data on Step 1, moves to Step 2, then clicks 'Back' to Step 1. All their previously entered data has disappeared. What structural flaw caused this?",
      options: [
        "The browser cleared memory.",
        "Form state was stored inside the child Step 1 component, which unmounted when switching to Step 2, destroying its local state.",
        "useRef was used instead of useMemo.",
        "The server rejected the back button."
      ],
      answerIdx: 1,
      debrief: "State declared inside a component is destroyed when that component unmounts. Multi-step forms must lift all form data to a persistent parent container so steps can mount and unmount freely."
    },
    quests: [
      { id: "react-m1-d10-q1", name: "Milestone 2 Schema & State Architecture", type: "concept", desc: "Define the centralized form data model, validation rules, and step progression state machine." },
      { id: "react-m1-d10-q2", name: "Detective Lab: The Disappearing Step Data Glitch", type: "detective", desc: "Diagnose and fix state destruction caused by storing form fields in unmounting step components." },
      { id: "react-m1-d10-q3", name: "Mastery Assignment: Multi-Step Enterprise Registration Engine", type: "assignment", desc: "Build a 4-step wizard with real-time validation, error summarization, ref focus management, and draft recovery." },
      { id: "react-m1-d10-q4", name: "Milestone 2 Defense: Form Architecture & Error Recovery Viva", type: "detective", desc: "Defend your form validation invariants, ref focusing strategy, and state lifting against Senior Staff review." }
    ]
  },

  // ── BLOCK 3: Side Effects, Lifecycles & Async Data Fetching (Days 11–15) ──────
  {
    day: 11,
    month: 1,
    blockNum: 3,
    title: "The Component Lifecycle & Purity: Side Effects Outside the Render Phase",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Render Purity & Effect Separation)",
    spokenGoal: "Master the boundary between pure rendering and side effects: Understand why DOM mutations, network requests, timers, and storage writes must NEVER execute in the component render body, and how React schedules effects post-commit.",
    conceptInvariant: "The render phase must be mathematically pure and free of side effects. Side effects must be deferred to the commit phase using `useEffect` or triggered directly by discrete user interaction events.",
    failureMode: "Calling `fetch()` or `localStorage.setItem()` directly in the body of a component causes network request floods on every re-render and can lock up user browsers.",
    tryItFriction: "Relocate an impermissible `document.title` mutation from the top-level component body into a `useEffect` hook and observe that it only fires after the DOM has successfully committed.",
    socraticHints: [
      "Why is `fetch('/api/user')` inside the component body causing thousands of network calls?",
      "Every time the component renders, the body executes again, triggering a new fetch!",
      "Wrap asynchronous calls and external synchronizations inside `useEffect` with appropriate dependencies."
    ],
    situationalPuzzle: {
      scenario: "An engineer writes: `function UserCard({ id }) { const [data, setData] = useState(null); fetch('/api/' + id).then(r => r.json()).then(setData); return <div>{data?.name}</div>; }`. What catastrophic loop occurs?",
      options: [
        "The component renders once and stops.",
        "Infinite render loop: Component renders -> fetch fires -> setData is called -> component re-renders -> fetch fires again -> infinite loop until browser runs out of memory.",
        "The fetch call is blocked by CORS.",
        "The browser turns off JavaScript."
      ],
      answerIdx: 1,
      debrief: "Calling a state setter schedules a re-render. Because the fetch call sits directly in the render body, every re-render triggers another fetch and another state update, causing an infinite execution loop."
    },
    quests: [
      { id: "react-m1-d11-q1", name: "The React Render vs Commit Phase Split", type: "concept", desc: "Trace the execution lifecycle: Render (pure calculation) -> Reconciliation -> Commit (DOM update) -> LayoutEffects -> Paint -> Effects." },
      { id: "react-m1-d11-q2", name: "Detective Lab: The Infinite Fetch Render Loop", type: "detective", desc: "Profile and eliminate an uncontrolled network loop that hammered a backend API with 4,000 requests per minute." },
      { id: "react-m1-d11-q3", name: "Mastery Assignment: Post-Commit Telemetry Logger", type: "assignment", desc: "Build a non-blocking user interaction telemetry dispatcher that safely logs view commits without delaying paints." },
      { id: "react-m1-d11-q4", name: "Production Incident Lab: LocalStorage Quota Exceeded Crash", type: "detective", desc: "Fix an app crash caused by an impure render body repeatedly saving serialized cache data to localStorage." }
    ]
  },
  {
    day: 12,
    month: 1,
    blockNum: 3,
    title: "useEffect Synchronization: The Dependency Array Contract & Stale Closures",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Dependency Invariants & Stale Closures)",
    spokenGoal: "Master `useEffect` dependency mechanics: Understand the dependency array as a synchronization contract, why omitting dependencies creates stale closure bugs, and how cleanup functions prevent resource leaks.",
    conceptInvariant: "Every reactive value (props, state, or derived variables) referenced inside `useEffect` MUST be included in its dependency array. Omitting dependencies locks the effect callback into stale closures from earlier renders.",
    failureMode: "Setting up a `setInterval` inside `useEffect(..., [])` that reads `count`: because dependencies are empty, the timer callback closes over the initial `count = 0` forever, never incrementing past 1.",
    tryItFriction: "Debug a stale interval counter by either passing `count` to the dependency array or switching to a functional state updater `setCount(c => c + 1)`.",
    socraticHints: [
      "Why did the timer stop updating after reaching 1?",
      "The interval callback was created on render 0 when `count` was 0. It is trapped in a closure reading `0` forever!",
      "Use `setCount(c => c + 1)` which does not need `count` in the dependency array, or add `count` to the deps."
    ],
    situationalPuzzle: {
      scenario: "An effect subscribes to a WebSocket room: `useEffect(() => { const ws = connect(roomId); return () => ws.close(); }, [roomId])`. In React 18 development mode, the effect connects, immediately disconnects, and reconnects. Why?",
      options: [
        "The WebSocket server rejected the connection.",
        "React StrictMode intentionally mounts, unmounts, and remounts effects to verify that your cleanup function properly handles teardown.",
        "There is a network glitch in Chrome.",
        "The roomId changed to undefined."
      ],
      answerIdx: 1,
      debrief: "React 18 Strict Mode mounts, unmounts, and re-mounts effects in development to verify that cleanup functions work correctly and don't leak resources when components are unmounted or remounted."
    },
    quests: [
      { id: "react-m1-d12-q1", name: "The Mathematical Dependency Equivalence Check", type: "concept", desc: "Understand how React runs Object.is on every dependency array element between renders to decide if effects run." },
      { id: "react-m1-d12-q2", name: "Detective Lab: The Frozen Chat Stream Stale Closure", type: "detective", desc: "Isolate a chat widget that stopped receiving incoming messages because its effect closed over an old message array." },
      { id: "react-m1-d12-q3", name: "Mastery Assignment: Resilient WebSocket Event Stream Connector", type: "assignment", desc: "Build an event streaming hook with automated reconnection, topic switching, and leak-proof cleanup." },
      { id: "react-m1-d12-q4", name: "Production Incident Lab: Unsubscribing from the Wrong Event Target", type: "detective", desc: "Fix an enterprise leak where an event listener attached to window was never cleaned up due to a changing handler ref." }
    ]
  },
  {
    day: 13,
    month: 1,
    blockNum: 3,
    title: "Async Data Fetching: Network Race Conditions, Cleanup Flags & AbortController Invariants",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Async Race Conditions & Request Cancellation)",
    spokenGoal: "Master resilient asynchronous data fetching: Learn why rapid user interactions cause out-of-order response race conditions, and how to cancel in-flight HTTP requests using `AbortController` and ignore flags.",
    conceptInvariant: "Network responses arrive non-deterministically. If a user clicks User A then User B, User A's slow response might arrive AFTER User B's fast response, overwriting the UI with stale data unless cancelled or flagged.",
    failureMode: "A search-as-you-type box displays results for 'app' even though the user has typed 'apple', because the earlier network request for 'app' completed last.",
    tryItFriction: "Create an active boolean flag or pass `controller.signal` to `fetch()` inside a `useEffect` cleanup function to ensure cancelled requests never call `setState`.",
    socraticHints: [
      "Why did the profile page show Alice's photo when we just clicked on Bob?",
      "Alice's network request took 800ms, while Bob's took 200ms. Alice's response arrived last and overwrote state!",
      "Cancel the pending request in the cleanup function using `const controller = new AbortController(); ... return () => controller.abort();`."
    ],
    situationalPuzzle: {
      scenario: "A user rapidly switches between 'Tab 1' and 'Tab 2'. Tab 1 takes 2 seconds to load; Tab 2 takes 100ms. Tab 2 renders instantly, but 1.9 seconds later, the screen suddenly flips back to Tab 1's content. What bug occurred?",
      options: [
        "The browser back button was clicked.",
        "Network race condition: The asynchronous response for Tab 1 resolved after Tab 2, and because there was no abort or cleanup flag, it committed stale data to state.",
        "Tab 1 had higher CSS z-index.",
        "React Fiber prioritized Tab 1."
      ],
      answerIdx: 1,
      debrief: "Asynchronous network requests do not complete in call order. Without an AbortController or an ignore flag in the effect cleanup, delayed responses from superseded requests overwrite current state."
    },
    quests: [
      { id: "react-m1-d13-q1", name: "The Network Race Condition Timeline", type: "concept", desc: "Diagram asynchronous promise resolution timelines and prove how cleanup flags prevent state corruption." },
      { id: "react-m1-d13-q2", name: "Detective Lab: The Flashing Search Results Bug", type: "detective", desc: "Debug an autocomplete search bar that flashes obsolete suggestions when users type quickly." },
      { id: "react-m1-d13-q3", name: "Mastery Assignment: Production-Grade useFetch Hook with AbortSignal", type: "assignment", desc: "Engineer an asynchronous fetching hook featuring automated cancellation, loading, error, and cached states." },
      { id: "react-m1-d13-q4", name: "Production Incident Lab: Unmounted Component State Warning Post-Mortem", type: "detective", desc: "Analyze why setting state after unmount causes memory leaks and how modern React handles aborted promises." }
    ]
  },
  {
    day: 14,
    month: 1,
    blockNum: 3,
    title: "Custom Hooks: Logic Extraction, Hook Composition & Encapsulating Browser APIs",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Custom Hooks & Compositional Reusability)",
    spokenGoal: "Master custom hooks: Learn how to extract stateful logic into reusable functions starting with `use`, compose multiple built-in hooks together, and encapsulate browser APIs like window size, online status, and media queries.",
    conceptInvariant: "Custom hooks share stateful LOGIC, not state itself. Each component calling a custom hook receives an entirely independent, isolated instance of that hook's state and effects.",
    failureMode: "Assuming that calling `useOnlineStatus()` in two different components connects them to a shared singleton state, rather than creating two independent subscriptions.",
    tryItFriction: "Extract an event listener for `window.innerWidth` into a reusable `useWindowDimensions()` hook that cleans up on unmount and returns current dimensions.",
    socraticHints: [
      "If Component A and Component B both call `useCounter()`, do they share the same count?",
      "No! Hooks reuse stateful logic and behavior, but each component instance has its own private state.",
      "To share actual state values across components, you need React Context or an external store."
    ],
    situationalPuzzle: {
      scenario: "An engineer creates a helper function `function checkAuth() { const [isAuth] = useState(false); return isAuth; }`. The linter throws an error: 'React Hook useState is called in function checkAuth that is neither a React function component nor a custom React Hook function.' How do you fix it?",
      options: [
        "Change the name to start with `use`, e.g. `useCheckAuth`.",
        "Disable the ESLint rule with a comment.",
        "Convert useState to a global variable.",
        "Call it inside an if statement."
      ],
      answerIdx: 0,
      debrief: "React enforces the Rules of Hooks via convention. Custom hooks must begin with the lowercase prefix 'use' (e.g. useCheckAuth) so React and static analysis tools know to enforce hook invariants."
    },
    quests: [
      { id: "react-m1-d14-q1", name: "The Rules of Hooks Internal Compiler Invariants", type: "concept", desc: "Understand why hooks cannot be called inside loops, conditions, or nested functions due to fiber linked lists." },
      { id: "react-m1-d14-q2", name: "Detective Lab: The Conditional Hook Invocation Crash", type: "detective", desc: "Fix an app crash: 'Rendered fewer hooks than expected. This may be caused by an accidental early return'." },
      { id: "react-m1-d14-q3", name: "Mastery Assignment: Suite of Production Sensor Hooks", type: "assignment", desc: "Build `useOnlineStatus`, `useDebounce`, `useLocalStorage`, and `useIntersectionObserver` with full type safety." },
      { id: "react-m1-d14-q4", name: "Production Incident Lab: Memory Leak in useEventListener", type: "detective", desc: "Trace an enterprise leak where dynamic event handlers attached to document were not removed when components unmounted." }
    ]
  },
  {
    day: 15,
    month: 1,
    blockNum: 3,
    title: "Milestone 3: Resilient Search-as-You-Type Ingestion Engine with AbortController",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Async Systems & Search Architecture)",
    spokenGoal: "Build and defend Milestone 3: A high-performance search-as-you-type data exploration engine featuring 300ms debouncing, live HTTP request cancellation via AbortController, error recovery, and search history caching.",
    conceptInvariant: "High-frequency search interfaces must throttle outgoing network requests via debouncing, cancel superseded in-flight requests via AbortController, and maintain cache invariants to deliver instant responses.",
    failureMode: "Allowing every single keystroke to trigger an uncancelled HTTP request, overwhelming backend rate limits (HTTP 429) and locking up UI rendering.",
    tryItFriction: "Combine `useDebounce` with `AbortController` in a custom `useSearch` hook, asserting that typing 'engineer' sends at most 1 network request when typed at normal speed.",
    socraticHints: [
      "How do we stop 8 HTTP requests from firing when the user types 'e-n-g-i-n-e-e-r'?",
      "Debounce the search query: delay updating the active search term until the user stops typing for 300ms.",
      "If an active request is in flight when the user types again, abort it via `controller.abort()`."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 3 defense, a reviewer types quickly, triggers an AbortController cancellation, and an error banner pops up saying 'Error: Failed to fetch'. What went wrong?",
      options: [
        "The server crashed.",
        "The developer failed to check `if (error.name === 'AbortError')` in their catch block, treating deliberate user cancellations as real network failures.",
        "Chrome blocks aborted requests.",
        "The debounce timer expired too early."
      ],
      answerIdx: 1,
      debrief: "When fetch is cancelled via AbortController.abort(), it rejects with a DOMException whose name is 'AbortError'. Code must explicitly ignore AbortError so clean cancellations do not trigger user-facing error banners."
    },
    quests: [
      { id: "react-m1-d15-q1", name: "Milestone 3 System Architecture & Flow Design", type: "concept", desc: "Design the debounce pipeline, abort signal lifecycle, and in-memory query cache architecture." },
      { id: "react-m1-d15-q2", name: "Detective Lab: The AbortError User Banner Glitch", type: "detective", desc: "Fix an issue where normal keystroke cancellations trigger red error banners across the UI." },
      { id: "react-m1-d15-q3", name: "Mastery Assignment: Production Search-as-You-Type Ingestion Engine", type: "assignment", desc: "Deliver the full search engine with debouncing, request cancellation, LRU memory cache, and highlighted matches." },
      { id: "react-m1-d15-q4", name: "Milestone 3 Defense: Network Optimization & Cancellation Viva", type: "detective", desc: "Defend your search engine architecture against network latency, packet loss, and rate-limiting attacks." }
    ]
  },

  // ── BLOCK 4: Context, Global State & Component Composition (Days 16–20) ───────
  {
    day: 16,
    month: 1,
    blockNum: 4,
    title: "Prop Drilling Anti-Pattern: Component Composition, Slots & Inversion of Control",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Composition vs Prop Drilling)",
    spokenGoal: "Master component composition to eliminate prop drilling: Learn how passing JSX elements as `children` or named slots provides Inversion of Control, keeping intermediate components blissfully unaware of data they don't consume.",
    conceptInvariant: "Before reaching for global state or Context, use Component Composition. Passing elements down as `children` or props (e.g. `header={<UserNav />}`) allows the parent to provide data directly, bypassing intermediate presentation containers.",
    failureMode: "Passing a `user` prop through 8 levels of layout components (Page -> Layout -> Shell -> Header -> Nav -> Menu -> Item -> Avatar) just so the Avatar can render an image.",
    tryItFriction: "Refactor a deeply drilled component hierarchy by converting intermediate layout wrappers to accept `{children}`, reducing props on intermediate components to zero.",
    socraticHints: [
      "Why is passing `user` through 6 middle components bad?",
      "Every time `user` updates, all 6 middle components must re-render, and renaming a prop breaks all 6 files!",
      "Render the `<UserAvatar user={user} />` at the top level and pass it down as a child slot."
    ],
    situationalPuzzle: {
      scenario: "An engineer wants to add a 'Dark Mode' toggle inside a deeply nested Sidebar. The team suggests introducing Redux immediately. How would a Staff Frontend Engineer solve this without new state libraries?",
      options: [
        "Store the theme in a cookie and reload the page on change.",
        "Use Component Composition: pass the `<ThemeToggle />` component directly into the Sidebar's `footer` slot, keeping the Sidebar generic and decoupled.",
        "Duplicate the theme state in every child component.",
        "Use window.localStorage polling."
      ],
      answerIdx: 1,
      debrief: "Inversion of control via component composition decouples container layouts from specific child widgets, solving many apparent 'prop drilling' problems without introducing global state complexity."
    },
    quests: [
      { id: "react-m1-d16-q1", name: "The Inversion of Control Architectural Pattern", type: "concept", desc: "Analyze how slot-based composition (`children`, `leftAction`, `sidebar`) reduces coupling in design systems." },
      { id: "react-m1-d16-q2", name: "Detective Lab: The 8-Layer Prop Drilling Refactor", type: "detective", desc: "Refactor a bloated dashboard layout tree, removing 14 drilled props using clean slot composition." },
      { id: "react-m1-d16-q3", name: "Mastery Assignment: Polymorphic Modal & Dialog Layout Engine", type: "assignment", desc: "Build a flexible modal system accepting composable header, body, and action slots with zero hardcoded layouts." },
      { id: "react-m1-d16-q4", name: "Production Incident Lab: Cascading Re-Renders in Drilled Layouts", type: "detective", desc: "Measure and eliminate unnecessary layout re-renders caused by passing changing callback props down deep trees." }
    ]
  },
  {
    day: 17,
    month: 1,
    blockNum: 4,
    title: "React Context API: Providers, Consumers, Re-render Propagation & Splitting State from Dispatch",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Context Invariants & Render Propagation)",
    spokenGoal: "Master React Context: Learn how to broadcast global data (auth, theme, localization), understand why updating Context re-renders ALL consuming components, and master the architectural pattern of splitting State from Dispatch.",
    conceptInvariant: "When a Context value changes, EVERY component that calls `useContext(MyContext)` will re-render, bypassing `React.memo`. To prevent render storms, split frequently changing State into a separate Context from static Dispatch callbacks.",
    failureMode: "Putting both an active user object and a theme string inside a single Context object: updating the theme causes every user profile card in the app to re-render.",
    tryItFriction: "Split a unified `CartContext` into `CartStateContext` and `CartDispatchContext`, proving that components only calling `useCartDispatch()` never re-render when cart items change.",
    socraticHints: [
      "Why did the 'Add to Cart' button re-render when the cart total updated?",
      "The button called `useCart()` which read both `items` and `dispatch`. When `items` changed, the button re-rendered!",
      "Separate the dispatch function into its own context: `CartDispatchContext`. Dispatch functions are stable and never trigger re-renders."
    ],
    situationalPuzzle: {
      scenario: "A developer puts an entire app state in one Context: `<AppContext.Provider value={{ user, theme, cart, search }}>`. A user types in the search bar. The entire application lags visibly. Why?",
      options: [
        "The browser CPU cannot handle Context.",
        "Every keystroke updates `search`, changing the provider's value object reference and forcing EVERY component calling `useContext(AppContext)` to re-render immediately.",
        "The search string has too many characters.",
        "React Context is deprecated."
      ],
      answerIdx: 1,
      debrief: "Context triggers re-renders on all consumers whenever the provided value reference changes. Combining high-frequency state (search) with low-frequency state (user, theme) causes full-application re-render cascades."
    },
    quests: [
      { id: "react-m1-d17-q1", name: "The Context Propagation & Fiber Subscription Mechanics", type: "concept", desc: "Trace how React traverses fiber children to mark context consumers dirty when a provider value changes." },
      { id: "react-m1-d17-q2", name: "Detective Lab: The Monolithic Context Render Cascade", type: "detective", desc: "Profile an enterprise dashboard and isolate a 60 FPS drop caused by an unmemoized context provider value." },
      { id: "react-m1-d17-q3", name: "Mastery Assignment: Dual-Context Architecture (State vs Dispatch)", type: "assignment", desc: "Implement a production Auth and Permissions system with separate State and Dispatch contexts and custom guard hooks." },
      { id: "react-m1-d17-q4", name: "Production Incident Lab: Missing Provider Runtime Crash", type: "detective", desc: "Author a fail-safe `useStrictContext` helper that throws descriptive runtime errors when consumed outside a provider." }
    ]
  },
  {
    day: 18,
    month: 1,
    blockNum: 4,
    title: "Complex State with useReducer: Predictable Redux-Style State Transitions & Action Invariants",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (useReducer & State Machines)",
    spokenGoal: "Master `useReducer`: Learn when component state becomes too complex for `useState`, how to model business logic as explicit actions and pure reducer transitions, and how to guarantee state predictability.",
    conceptInvariant: "A reducer function must be completely pure: `(state, action) => newState`. It must calculate the next state without mutating existing state, without side effects, and must return the unmodified state for unknown actions.",
    failureMode: "Mutating nested properties directly inside a reducer `state.items.push(action.payload)`: React fails to detect the state change because the array reference remains unchanged.",
    tryItFriction: "Convert 5 interdependent `useState` variables in an order checkout form (status, items, discount, shipping, error) into a single pure reducer with strict action types.",
    socraticHints: [
      "Why did the order summary fail to update after dispatching 'ADD_ITEM'?",
      "In the reducer you wrote `state.items.push(item); return state;`. The reference didn't change!",
      "Return a new object with cloned arrays: `return { ...state, items: [...state.items, action.payload] };`."
    ],
    situationalPuzzle: {
      scenario: "A banking ledger reducer receives an action `DISPATCH_TRANSFER`. The developer performs `api.post('/transfer')` inside the reducer function. What fundamental architectural invariant was broken?",
      options: [
        "The action name is too long.",
        "Reducers must be pure functions with zero side effects: performing network calls or timers inside a reducer causes duplicate requests during concurrent rendering and breaks deterministic state transitions.",
        "useReducer does not support async actions.",
        "The browser blocks HTTP calls inside functions."
      ],
      answerIdx: 1,
      debrief: "Reducers must remain pure mathematical functions. Any side effects (HTTP calls, localStorage, analytics) must be triggered in event handlers or useEffect hooks, never inside the reducer function itself."
    },
    quests: [
      { id: "react-m1-d18-q1", name: "The Reducer State Machine Topology", type: "concept", desc: "Map UI states (IDLE, LOADING, SUCCESS, ERROR) as finite state machines using useReducer with impossible states eliminated." },
      { id: "react-m1-d18-q2", name: "Detective Lab: The Mutated Reducer State Bug", type: "detective", desc: "Locate and fix in-place array and object mutations inside a complex shopping cart reducer." },
      { id: "react-m1-d18-q3", name: "Mastery Assignment: Enterprise Ticket Booking Finite State Machine", type: "assignment", desc: "Build a flight seat reservation reducer enforcing strict transitions, expiration timers, and seat locks." },
      { id: "react-m1-d18-q4", name: "Production Incident Lab: Unhandled Action Fall-Through Corruptions", type: "detective", desc: "Enforce TypeScript discriminated unions and exhaustive switch checks to guarantee zero unhandled actions." }
    ]
  },
  {
    day: 19,
    month: 1,
    blockNum: 4,
    title: "Error Boundaries: Declarative Fault Isolation with getDerivedStateFromError & componentDidCatch",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Error Boundaries & Fault Isolation)",
    spokenGoal: "Master React Error Boundaries: Learn why uncaught JavaScript errors unmount the entire component tree, how to build class-based error boundaries to catch render errors, and how to display fallback UIs without crashing the whole app.",
    conceptInvariant: "Error boundaries catch errors during the render phase, lifecycle methods, and constructors of the components BELOW them in the tree. They do NOT catch errors in event handlers, asynchronous code, or server-side rendering.",
    failureMode: "An uncaught runtime error in a single recommended-products widget crashes the entire webpage, leaving the user with a blank white screen instead of isolating the widget failure.",
    tryItFriction: "Build an Error Boundary component that catches a simulated rendering crash, displays a graceful error fallback card, logs the error to an analytics service, and provides a 'Retry' button.",
    socraticHints: [
      "Why did a typo in the footer crash the user's shopping cart and navigation?",
      "In React, uncaught errors during rendering unmount the ENTIRE root component tree by default!",
      "Wrap isolated UI widgets in `<ErrorBoundary fallback={<WidgetError />}>` to prevent blast radius expansion."
    ],
    situationalPuzzle: {
      scenario: "An engineer adds an ErrorBoundary around a button. Inside the button's `onClick`, an error is thrown: `throw new Error('Payment failed')`. The ErrorBoundary does NOT catch it, and the error appears uncaught in the console. Why?",
      options: [
        "The button component is broken.",
        "Error boundaries only catch errors during rendering and lifecycle passes; event handler errors occur outside the render phase and must be handled with try/catch.",
        "The error boundary was not written in TypeScript.",
        "React requires error boundaries to be wrapped in Context."
      ],
      answerIdx: 1,
      debrief: "React Error Boundaries catch exceptions during the render and commit lifecycle. Event handlers execute in response to browser events after rendering has finished, so errors in event handlers must be caught with standard try/catch."
    },
    quests: [
      { id: "react-m1-d19-q1", name: "The Error Boundary Boundary Isolation Boundary", type: "concept", desc: "Trace how getDerivedStateFromError updates fallback state and componentDidCatch logs error stack traces to Sentry." },
      { id: "react-m1-d19-q2", name: "Detective Lab: The Uncaught Event Handler Error Trap", type: "detective", desc: "Identify why an error boundary failed to handle an async image upload error and bridge the gap with custom hook error dispatch." },
      { id: "react-m1-d19-q3", name: "Mastery Assignment: Resilient Multi-Tier Error Boundary Architecture", type: "assignment", desc: "Implement root-level, route-level, and widget-level error boundaries with automatic retry and telemetry reporting." },
      { id: "react-m1-d19-q4", name: "Production Incident Lab: Blast Radius Containment Failure", type: "detective", desc: "Remediate a production outage where a null-pointer error in a promo banner took down the checkout funnel." }
    ]
  },
  {
    day: 20,
    month: 1,
    blockNum: 4,
    title: "Milestone 4: Fault-Tolerant E-Commerce Cart Engine with Context & Reducer Architecture",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Global State & Fault Tolerance)",
    spokenGoal: "Build and defend Milestone 4: A full-scale e-commerce shopping cart engine combining Context, useReducer, error boundaries, inventory boundary validation, coupon code discounts, and persistent storage.",
    conceptInvariant: "Global commerce systems must separate state from dispatch, prevent invalid inventory mutations via pure reducers, and isolate cart widgets with Error Boundaries to protect the checkout pipeline.",
    failureMode: "Allowing users to decrement item quantities below zero or submit orders with corrupted discount calculations when network errors occur.",
    tryItFriction: "Enforce strict reducer invariants: quantity clamps `[1, availableStock]`, atomic promo code calculation, and wrap the checkout button in an isolated Error Boundary.",
    socraticHints: [
      "Where should the discount calculation logic live?",
      "Directly inside the reducer under the `APPLY_COUPON` action, ensuring calculations are deterministic and pure.",
      "Wrap the entire cart provider in an Error Boundary so corrupt data in local storage can be reset gracefully."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 4 viva, the reviewer enters a coupon code that returns invalid JSON from a mock server. The cart unmounts and the page goes blank. How should the architecture handle this?",
      options: [
        "Reload the window.",
        "Catch the async error in the dispatch handler, dispatch a `SET_ERROR` action to the reducer, and keep the cart mounted with an inline warning banner.",
        "Store the invalid JSON anyway.",
        "Disable coupons permanently."
      ],
      answerIdx: 1,
      debrief: "Asynchronous failures must be captured in the action handler and translated into typed error states in the reducer, allowing the UI to remain functional while showing informative feedback."
    },
    quests: [
      { id: "react-m1-d20-q1", name: "Milestone 4 Architecture & Cart State Specification", type: "concept", desc: "Design the comprehensive cart data schema, action union types, discount calculation rules, and error boundaries." },
      { id: "react-m1-d20-q2", name: "Detective Lab: The Negative Quantity Inventory Exploit", type: "detective", desc: "Patch an exploit where users could buy items for negative prices by rapidly dispatching decrement actions." },
      { id: "react-m1-d20-q3", name: "Mastery Assignment: Production E-Commerce Cart & Checkout Engine", type: "assignment", desc: "Deliver the complete cart system with dual context, reducer, promo engine, error boundaries, and persistence." },
      { id: "react-m1-d20-q4", name: "Milestone 4 Defense: Architecture, Invariants & Resiliency Viva", type: "detective", desc: "Defend your cart architecture against boundary exploits, state corruption, and render storms before Senior Staff." }
    ]
  },

  // ── BLOCK 5: Performance Profiling & Routing (Days 21–25) ─────────────────────
  {
    day: 21,
    month: 1,
    blockNum: 5,
    title: "React Re-rendering Engine: Parent-to-Child Cascades vs True DOM Mutations",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Re-rendering Mechanics & DOM Diffs)",
    spokenGoal: "Master the React rendering process: Understand why a component re-renders (state change, prop change, parent re-render, context change), and learn the critical distinction between re-rendering (executing the function) and committing to the real DOM.",
    conceptInvariant: "By default, when a parent component re-renders, ALL of its child components re-render recursively, regardless of whether their props changed. However, React only touches the real DOM if the returned JSX output diffs from the previous frame.",
    failureMode: "Assuming that a component re-rendering means the browser is repainting the DOM, leading to premature memoization micro-optimizations that actually slow down execution.",
    tryItFriction: "Use React Developer Tools Profiler or console logs to visualize how updating a parent counter causes 50 child cards to execute their render functions even when their props are identical.",
    socraticHints: [
      "If ChildCard's props never change, why did its `console.log('Rendering ChildCard')` run?",
      "Because its parent re-rendered! By default in React, child components re-render whenever their parent renders.",
      "The real DOM is untouched if the output didn't change, but the JavaScript function still executed."
    ],
    situationalPuzzle: {
      scenario: "A developer notices that typing in a search input causes a 200-row table below it to re-render. They inspect the browser DOM elements in Chrome DevTools and see ZERO green DOM flash highlights on the table rows. What does this prove?",
      options: [
        "Chrome DevTools is broken.",
        "React executed the component render functions in memory (Virtual DOM diffing), but because the output JSX was identical, React made ZERO changes to the real browser DOM.",
        "The table is rendered on the server.",
        "The input is uncontrolled."
      ],
      answerIdx: 1,
      debrief: "Re-rendering in React refers to executing the JavaScript component function to produce a new React Element tree. If the reconciliation diff finds no differences, zero mutations are committed to the real DOM."
    },
    quests: [
      { id: "react-m1-d21-q1", name: "The Virtual DOM Diffing & Commit Pipeline", type: "concept", desc: "Deconstruct the exact stages: Trigger -> Render (Component Execution) -> Reconcile (Diffing) -> Commit (DOM Mutation) -> Paint." },
      { id: "react-m1-d21-q2", name: "Detective Lab: The Unnecessary Render Cascade Investigation", type: "detective", desc: "Use the React Profiler to identify components re-rendering unnecessarily and isolate state to leaf nodes." },
      { id: "react-m1-d21-q3", name: "Mastery Assignment: State Colocation & Leaf Node Isolation", type: "assignment", desc: "Refactor a bloated analytics page by moving state down to leaf components, cutting top-level re-renders by 90%." },
      { id: "react-m1-d21-q4", name: "Production Incident Lab: Profiler Flamegraph Bottleneck Analysis", type: "detective", desc: "Interpret an enterprise profiler flamegraph and eliminate a 120ms rendering bottleneck on a high-traffic dashboard." }
    ]
  },
  {
    day: 22,
    month: 1,
    blockNum: 5,
    title: "Memoization Mechanics: React.memo, useMemo & useCallback (When Memoization Hurts Performance)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Memoization & Referential Equality)",
    spokenGoal: "Master React memoization: Understand how `React.memo` skips re-renders via shallow prop comparison, how `useMemo` caches expensive calculations, how `useCallback` preserves function identity, and why premature memoization wastes memory.",
    conceptInvariant: "`React.memo` performs a shallow equality check (`Object.is`) on props. Passing an inline arrow function `onClick={() => doSomething()}` or an inline object `style={{ color: 'red' }}` creates a NEW reference on every render, completely defeating `React.memo`.",
    failureMode: "Wrapping every component in `React.memo` while continuing to pass inline functions as props, paying the CPU cost of shallow comparisons without ever preventing a single re-render.",
    tryItFriction: "Stabilize callback references using `useCallback` and wrap a heavy list item in `React.memo`, proving via profiler telemetry that child re-renders drop to zero when parent state changes.",
    socraticHints: [
      "Why did `React.memo(Child)` still re-render when the parent rendered?",
      "The parent passed `onDelete={() => handleDelete(id)}`. That arrow function is a brand-new object reference every render!",
      "Wrap the callback in `useCallback` or pass IDs down so the handler reference remains stable across renders."
    ],
    situationalPuzzle: {
      scenario: "An engineer wraps a simple calculation: `const total = useMemo(() => a + b, [a, b]);`. The team lead requests its removal in code review. Why?",
      options: [
        "useMemo cannot handle addition.",
        "The overhead of allocating the closure, array, and running dependency comparisons costs MORE CPU cycles than simply adding two numbers directly.",
        "useMemo is only for strings.",
        "React will crash on hot reload."
      ],
      answerIdx: 1,
      debrief: "Memoization is not free: allocating closures, tracking dependency arrays, and running Object.is comparisons incurs real CPU and memory costs. Only memoize genuinely expensive calculations (e.g. filtering 10,000 items) or references passed to memoized children."
    },
    quests: [
      { id: "react-m1-d22-q1", name: "The Shallow Equality Comparison Cost Model", type: "concept", desc: "Analyze the algorithmic overhead of Object.is loops in React.memo versus the cost of re-executing pure functional components." },
      { id: "react-m1-d22-q2", name: "Detective Lab: The Defeated React.memo Mystery", type: "detective", desc: "Identify 4 instances where inline object literals and unmemoized callbacks broke React.memo optimization." },
      { id: "react-m1-d22-q3", name: "Mastery Assignment: High-Throughput Matrix Grid Optimization", type: "assignment", desc: "Optimize a 1,000-cell financial matrix using React.memo, useMemo, and useCallback to achieve 60 FPS scrolling." },
      { id: "react-m1-d22-q4", name: "Production Incident Lab: Memory Leaks from Stale Memoized Closures", type: "detective", desc: "Fix an issue where useMemo retained a 50MB array buffer in memory due to an unnecessary closure capture." }
    ]
  },
  {
    day: 23,
    month: 1,
    blockNum: 5,
    title: "Client-Side Routing: Browser History API, URL State & React Router Dynamic Route Segments",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Client Routing & URL Synchronization)",
    spokenGoal: "Master client-side routing: Understand how the HTML5 History API (`pushState`, `popstate`) enables single-page navigation without full page reloads, and how to structure dynamic routes, nested layouts, and URL search params.",
    conceptInvariant: "The URL is the most shareable global state in a web application. Filter criteria, active tabs, and modal states should be stored in URL Search Parameters (`useSearchParams`) rather than ephemeral component state.",
    failureMode: "Storing search query and pagination filters in `useState`: when the user refreshes or bookmarks the page, all filter state is lost, returning them to page 1.",
    tryItFriction: "Build a filterable product catalog where search terms, categories, and page numbers sync bi-directionally with URL query parameters using `useSearchParams`.",
    socraticHints: [
      "Why did sharing the link with a colleague show an empty table instead of the filtered results?",
      "The filters were in local `useState`! The URL had no query parameters, so the colleague started fresh.",
      "Sync filter inputs to URL parameters: `setSearchParams({ query: 'shoes', page: 2 })`."
    ],
    situationalPuzzle: {
      scenario: "A user navigates from `/users/42` to `/users/99`. The component `UserProfile` does not unmount; it remains mounted. However, the user profile data on screen does not update and still shows user 42. Why?",
      options: [
        "React Router crashed.",
        "The component fetched data in `useEffect(..., [])` with an empty dependency array, failing to re-fetch when the route param `id` changed.",
        "The browser cannot change URLs without reloading.",
        "User 99 has no internet access."
      ],
      answerIdx: 1,
      debrief: "When navigating between routes that render the same component (e.g. /users/:id), React reuses the mounted component instance. Any effect that fetches data based on route parameters MUST include `id` in its dependency array."
    },
    quests: [
      { id: "react-m1-d23-q1", name: "The HTML5 History API & Router Topology", type: "concept", desc: "Trace how pushState and popstate intercept browser navigation to render matching route element branches." },
      { id: "react-m1-d23-q2", name: "Detective Lab: The Stale Route Parameter Bug", type: "detective", desc: "Fix an issue where clicking related product links updated the URL path but failed to refresh on-screen product details." },
      { id: "react-m1-d23-q3", name: "Mastery Assignment: Enterprise Nested Layout Route Hierarchy", type: "assignment", desc: "Architect a nested dashboard route tree with breadcrumbs, tabbed views, outlets, and URL-driven modal dialogs." },
      { id: "react-m1-d23-q4", name: "Production Incident Lab: Scroll Restoration & Deep Linking Failures", type: "detective", desc: "Implement scroll restoration and deep-link authentication guards preventing unauthorized page flashes." }
    ]
  },
  {
    day: 24,
    month: 1,
    blockNum: 5,
    title: "Code Splitting & Suspense: React.lazy, Dynamic Imports & Bundle Optimization",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Code Splitting, Dynamic Imports & Suspense)",
    spokenGoal: "Master frontend bundle optimization: Learn how single large JavaScript bundles destroy Core Web Vitals (LCP, INP), how to code-split routes using `React.lazy()` and dynamic imports, and how to design smooth `<Suspense>` loading fallbacks.",
    conceptInvariant: "Code splitting divides a monolithic bundle into smaller on-demand chunks. `React.lazy()` takes a function that returns a dynamic `import()`, and MUST be rendered inside a `<Suspense fallback={<Spinner />}>` boundary to prevent runtime errors.",
    failureMode: "Importing a 2MB PDF generator or charting library at the top of `App.tsx`, forcing every mobile user on 3G to download 2MB of unused code on the initial home landing page.",
    tryItFriction: "Convert heavy route components into `React.lazy` imports, inspect network chunk downloads in Chrome DevTools, and verify that initial bundle size drops by over 60%.",
    socraticHints: [
      "Why is the homepage taking 4 seconds to load on mobile?",
      "You imported Chart.js and PDFExport at the root! They are bundled into the main JS payload.",
      "Use `const HeavyChart = React.lazy(() => import('./HeavyChart'))` and wrap it in `<Suspense>`."
    ],
    situationalPuzzle: {
      scenario: "An engineer implements `const Admin = React.lazy(() => import('./Admin'));` but omits the `<Suspense>` wrapper. When a user clicks the Admin link, what happens?",
      options: [
        "The page works normally.",
        "React throws a runtime exception: 'A React component suspended while rendering, but no fallback UI was specified. Add a <Suspense fallback=...> component'.",
        "The browser downloads the entire internet.",
        "The server returns 500 Internal Server Error."
      ],
      answerIdx: 1,
      debrief: "Lazy components work by throwing a Promise during render. React catches this Promise and looks up the tree for the nearest <Suspense> boundary to render its fallback UI while the chunk downloads. Without Suspense, the uncaught suspension crashes the tree."
    },
    quests: [
      { id: "react-m1-d24-q1", name: "The Dynamic ECMAScript Import Pipeline", type: "concept", desc: "Analyze how bundlers (Vite/Webpack) generate separate chunk files and how the browser loads them via script injection." },
      { id: "react-m1-d24-q2", name: "Detective Lab: The Unwrapped Lazy Component Crash", type: "detective", desc: "Debug an unhandled suspension crash on a user settings route and implement granular skeleton fallbacks." },
      { id: "react-m1-d24-q3", name: "Mastery Assignment: Route-Based & Component-Based Split Architecture", type: "assignment", desc: "Split an enterprise application into route chunks, on-demand modal chunks, and preloaded hover routes." },
      { id: "react-m1-d24-q4", name: "Production Incident Lab: ChunkLoadError on Production Deployment", type: "detective", desc: "Handle ChunkLoadError when a new deployment invalidates old hashed JS chunk URLs on active user tabs." }
    ]
  },
  {
    day: 25,
    month: 1,
    blockNum: 5,
    title: "Milestone 5: High-Performance Dashboard with Lazy Loaded Analytical Charts",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Performance Optimization & Lazy Bundling)",
    spokenGoal: "Build and defend Milestone 5: A high-performance analytics dashboard featuring memoized metrics cards, lazy-loaded chart modules with skeleton loaders, URL-driven time ranges, and zero render cascades.",
    conceptInvariant: "High-performance enterprise dashboards must defer non-critical chart libraries via code-splitting, maintain sub-16ms frame budgets during filter changes, and synchronize all analytical state with URL query parameters.",
    failureMode: "Experiencing frame drops below 30 FPS when switching dashboard dates due to unmemoized data aggregations and un-split charting libraries.",
    tryItFriction: "Profile the dashboard using React DevTools, prove that switching time ranges causes zero re-renders in unaffected navigation components, and verify initial JS bundle size is under 150KB.",
    socraticHints: [
      "How do we prevent date picker changes from re-rendering the header and sidebar?",
      "Move the date picker state down to the dashboard content container, or wrap the header in `React.memo`.",
      "Wrap expensive aggregations in `useMemo` so filtering recalculates only when raw data changes."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 5 defense, the evaluator switches dashboard date ranges rapidly. The FPS meter drops to 15 FPS. Profiling reveals that 5,000 transaction records are being sorted and filtered synchronously on the main thread inside the component render body. How do you resolve this?",
      options: [
        "Disable sorting.",
        "Wrap the sorting and filtering calculation in `useMemo(() => filterData(data, range), [data, range])` and verify memoized reference stability.",
        "Add a 5-second sleep to slow down user clicks.",
        "Convert the numbers to strings."
      ],
      answerIdx: 1,
      debrief: "Heavy data calculations in the render body run on every single re-render. Wrapping expensive filters in useMemo ensures calculations only run when the underlying data or filter parameters change, preserving 60 FPS responsiveness."
    },
    quests: [
      { id: "react-m1-d25-q1", name: "Milestone 5 Architecture & Performance Budget", type: "concept", desc: "Establish the Core Web Vitals performance budget: initial bundle < 150KB, LCP < 1.5s, 60 FPS interaction." },
      { id: "react-m1-d25-q2", name: "Detective Lab: The Date Picker Render Cascade Bottleneck", type: "detective", desc: "Eliminate a 100ms render lag caused by unmemoized time-series chart data transformations." },
      { id: "react-m1-d25-q3", name: "Mastery Assignment: Production Analytics Dashboard with Suspense", type: "assignment", desc: "Build the complete dashboard with lazy-loaded chart widgets, skeleton states, and URL time-range sync." },
      { id: "react-m1-d25-q4", name: "Milestone 5 Defense: Performance Profiling & Bundle Audit Viva", type: "detective", desc: "Defend your bundle chunk breakdown, profiler flamegraphs, and memoization choices before Senior Staff." }
    ]
  },

  // ── BLOCK 6: Persistence, Testing & Month 1 Capstone (Days 26–30) ────────────
  {
    day: 26,
    month: 1,
    blockNum: 6,
    title: "Client-Side Persistence: Web Storage API (LocalStorage/SessionStorage) with Cross-Tab Sync",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Client Storage & Multi-Tab Synchronization)",
    spokenGoal: "Master browser persistence: Learn how to safely serialize and deserialize state to `localStorage` and `sessionStorage`, handle storage quota limits, and synchronize state across multiple open browser tabs using the `storage` event listener.",
    conceptInvariant: "LocalStorage operations are completely SYNCHRONOUS and block the browser main thread for large payloads. Reading storage during initial render should be done lazily via `useState(() => getInitialValue())` to avoid blocking every subsequent render.",
    failureMode: "Calling `localStorage.getItem()` directly in the `useState(localStorage.getItem('key'))` initializer, forcing the browser to read from disk synchronously on EVERY single re-render.",
    tryItFriction: "Refactor an eager storage read into a lazy state initializer function `useState(() => JSON.parse(...))` and implement a `window.addEventListener('storage', ...)` listener to synchronize state across tabs.",
    socraticHints: [
      "Why is `useState(localStorage.getItem('cart'))` slow?",
      "The argument to useState evaluates on EVERY render! Even though React only uses the initial value once, the disk read runs every time.",
      "Pass a function: `useState(() => localStorage.getItem('cart'))`. React will only execute that function once on initial mount."
    ],
    situationalPuzzle: {
      scenario: "A user opens an e-commerce store in Tab A and Tab B. In Tab A, they add an item to their cart. In Tab B, the cart count stays at 0 until they manually refresh. How do you make Tab B update automatically in real time?",
      options: [
        "Poll localStorage every 10 milliseconds with setInterval.",
        "Add a `window.addEventListener('storage', handler)` listener inside a `useEffect`: the browser automatically fires the storage event in all other tabs when localStorage is updated.",
        "Restart the browser.",
        "LocalStorage does not support multiple tabs."
      ],
      answerIdx: 1,
      debrief: "The browser's native `storage` event fires on all other tabs/windows sharing the same origin whenever localStorage is modified. Listening to this event allows seamless cross-tab state synchronization without polling."
    },
    quests: [
      { id: "react-m1-d26-q1", name: "The Browser Storage Engine Memory Model", type: "concept", desc: "Compare LocalStorage (5MB sync), SessionStorage (per tab), IndexedDB (async 50MB+), and Cookies." },
      { id: "react-m1-d26-q2", name: "Detective Lab: The Blocking Eager Storage Initializer", type: "detective", desc: "Profile and fix an app whose frame rate stuttered due to reading 2MB of cached data on every render pass." },
      { id: "react-m1-d26-q3", name: "Mastery Assignment: Production useLocalStorage Hook with Tab Sync", type: "assignment", desc: "Engineer a type-safe persistence hook with lazy initialization, JSON error fallback, and cross-tab event sync." },
      { id: "react-m1-d26-q4", name: "Production Incident Lab: QuotaExceededError in Private Browsing", type: "detective", desc: "Safely catch QuotaExceededError when mobile private browsing modes restrict local storage writes to 0 bytes." }
    ]
  },
  {
    day: 27,
    month: 1,
    blockNum: 6,
    title: "DOM Accessibility (a11y): Semantic HTML, ARIA Attributes & Keyboard Trapping",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Accessibility Standards & Keyboard Navigation)",
    spokenGoal: "Master accessible web applications: Understand semantic HTML elements (`<main>`, `<nav>`, `<button>`), ARIA live regions and roles, screen reader compliance, and implementing robust focus trapping in modal dialogs.",
    conceptInvariant: "Never replace native interactive elements with styled `<div>` tags. A `<button>` provides built-in keyboard activation (Enter/Space), focus management, and accessibility tree roles that a `<div onClick>` completely lacks.",
    failureMode: "Building a clickable card using `<div onClick={handleClick}>` without `role='button'`, `tabIndex={0}`, or keyboard event handlers, making it completely invisible to blind users and keyboard navigators.",
    tryItFriction: "Audit a component containing non-semantic `<div>` buttons, convert them to native `<button>` primitives with accessible names, and implement an Esc key listener to close modals.",
    socraticHints: [
      "Why couldn't a keyboard-only user click the 'Submit' div using their Tab and Enter keys?",
      "A `<div>` is not focusable by default and does not listen to keyboard Enter or Space events!",
      "Use a real `<button type='button'>`. If you must use a div, you need `tabIndex={0}`, `role='button'`, and `onKeyDown`."
    ],
    situationalPuzzle: {
      scenario: "A user opens a modal dialog. When they press the Tab key, their focus moves behind the modal to links on the background page. Screen reader users can no longer tell which dialog is active. What accessibility feature is missing?",
      options: [
        "A CSS blur backdrop.",
        "A Focus Trap: When a modal opens, keyboard focus must be contained strictly within the modal's focusable children until dismissed.",
        "More div tags.",
        "An extra useEffect hook."
      ],
      answerIdx: 1,
      debrief: "Accessible modal dialogs require a Focus Trap: keyboard Tab and Shift+Tab navigation must cycle strictly through the modal's focusable elements, preventing focus from escaping to background content."
    },
    quests: [
      { id: "react-m1-d27-q1", name: "The Browser Accessibility Tree & WCAG 2.1 Standard", type: "concept", desc: "Explore how the browser converts the DOM tree into an Accessibility Tree consumed by screen readers." },
      { id: "react-m1-d27-q2", name: "Detective Lab: The Div Button Accessibility Audit", type: "detective", desc: "Convert an inaccessible checkout form using ESLint jsx-a11y to achieve a 100% Lighthouse Accessibility score." },
      { id: "react-m1-d27-q3", name: "Mastery Assignment: Production Accessible Modal with Focus Trap", type: "assignment", desc: "Build an accessible dialog with focus trapping, initial focus targeting, Esc key dismissal, and ARIA roles." },
      { id: "react-m1-d27-q4", name: "Production Incident Lab: ARIA Live Region Announcement Lag", type: "detective", desc: "Use aria-live='polite' and aria-live='assertive' to communicate dynamic toast messages to screen readers." }
    ]
  },
  {
    day: 28,
    month: 1,
    blockNum: 6,
    title: "Component Testing: React Testing Library, User-Event & DOM Assertion Contracts",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Testing Philosophy & User Simulation)",
    spokenGoal: "Master automated component testing: Learn the React Testing Library philosophy of testing behavior rather than implementation details, using accessible queries (`getByRole`, `getByLabelText`), simulating user interactions with `@testing-library/user-event`, and asserting DOM states.",
    conceptInvariant: "The more your tests resemble the way your software is used, the more confidence they can give you. Query elements by their accessibility roles (`screen.getByRole('button', { name: /submit/i })`), never by CSS class names or internal component state.",
    failureMode: "Testing internal component state `expect(wrapper.state('count')).toBe(5)`: refactoring state to a reducer breaks all tests even though the user-facing UI behavior remains completely identical.",
    tryItFriction: "Write a complete integration test for an authentication login form: fill inputs, click submit, assert loading spinner appears, and verify the welcome banner displays on resolution.",
    socraticHints: [
      "Why is `container.querySelector('.submit-btn-v2')` a fragile test query?",
      "If a designer renames the CSS class to `.btn-primary`, your test fails even though the button still works for users!",
      "Use `screen.getByRole('button', { name: /submit/i })`, matching how real users find the button."
    ],
    situationalPuzzle: {
      scenario: "A test clicks a button that triggers an asynchronous fetch: `userEvent.click(button); expect(screen.getByText('Success')).toBeInTheDocument();`. The test fails immediately with 'Unable to find an element with text: Success'. Why?",
      options: [
        "The fetch call is too fast.",
        "The fetch is asynchronous: `getByText` runs synchronously before the promise resolves. You must use `await screen.findByText('Success')` to wait for DOM updates.",
        "The button cannot be clicked in tests.",
        "React Testing Library does not support fetch."
      ],
      answerIdx: 1,
      debrief: "`getByText` asserts that an element exists in the DOM right now synchronously. For asynchronous state updates (network calls, timers), use `findByText` which returns a promise that retries until the element appears."
    },
    quests: [
      { id: "react-m1-d28-q1", name: "The React Testing Library Query Priority Hierarchy", type: "concept", desc: "Master the query hierarchy: getByRole > getByLabelText > getByPlaceholderText > getByText > getByTestId." },
      { id: "react-m1-d28-q2", name: "Detective Lab: The Brittle Implementation Test Refactor", type: "detective", desc: "Refactor a brittle test suite that asserted on internal state and CSS classes into resilient user-event tests." },
      { id: "react-m1-d28-q3", name: "Mastery Assignment: Comprehensive Test Suite for Checkout Form", type: "assignment", desc: "Write unit and integration tests covering happy path, validation errors, and async failure states." },
      { id: "react-m1-d28-q4", name: "Production Incident Lab: Flaky Async Tests & Act Warnings", type: "detective", desc: "Eliminate 'Warning: An update to Component inside a test was not wrapped in act(...)' warnings." }
    ]
  },
  {
    day: 29,
    month: 1,
    blockNum: 6,
    title: "Production Build & Asset Optimization: Vite Bundling, Tree Shaking & Production Minification",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Production Tooling & Tree Shaking)",
    spokenGoal: "Master production frontend deployments: Understand how modern build tools (Vite/Rollup/ESBuild) transpile TypeScript/JSX, perform static tree shaking to eliminate dead code, minify assets, and generate cache-busting content hashes.",
    conceptInvariant: "Tree shaking relies on ES module static syntax (`import / export`). Importing CommonJS modules with `require()` or barrel export files (`index.ts`) that re-export entire libraries can prevent bundlers from removing unused code, bloating production bundles.",
    failureMode: "Writing `import { debounce } from 'lodash'` instead of `import debounce from 'lodash-es/debounce'`, bundling the entire 70KB Lodash library instead of the single 2KB function.",
    tryItFriction: "Analyze a production build using `rollup-plugin-visualizer`, identify dead code imports, and configure manual chunk splitting for vendor libraries (React, React-DOM).",
    socraticHints: [
      "Why did importing one utility from a utility file add 100KB to the bundle?",
      "The utility file had side effects or used CommonJS, preventing the bundler from tree-shaking unused exports!",
      "Use pure ES modules with `sideEffects: false` in package.json to enable aggressive dead code elimination."
    ],
    situationalPuzzle: {
      scenario: "A production release updates `main.js`. Users who already had the app open continue reporting bugs from the previous version until they do a hard refresh. How do modern build systems guarantee users get new code immediately?",
      options: [
        "Ask users to clear their browser cache manually.",
        "Content Hashing: The bundler embeds a SHA-256 hash of the file contents into the output filename (e.g. `main.a8b1c4.js`), allowing immutable caching headers for old files while index.html points to the new hash.",
        "Disable caching for all files permanently.",
        "Use HTTP 1.0."
      ],
      answerIdx: 1,
      debrief: "Content hashing ensures that every file's URL changes whenever its contents change. Servers can serve JavaScript assets with `Cache-Control: immutable, max-age=31536000`, while `index.html` is served with `no-cache`, guaranteeing instant updates."
    },
    quests: [
      { id: "react-m1-d29-q1", name: "The Modern Bundler Pipeline (ESBuild & Rollup)", type: "concept", desc: "Trace how Vite uses ESBuild for instant development compilation and Rollup for tree-shaken production builds." },
      { id: "react-m1-d29-q2", name: "Detective Lab: The Barrel File Bundle Bloat Investigation", type: "detective", desc: "Diagnose an icon library that added 450KB of unused SVG code to a bundle and configure tree-shakable paths." },
      { id: "react-m1-d29-q3", name: "Mastery Assignment: Production Vite Optimization Configuration", type: "assignment", desc: "Configure manual chunk splitting, gzip/brotli compression, and sourcemap isolation for production builds." },
      { id: "react-m1-d29-q4", name: "Production Incident Lab: Content-Security-Policy (CSP) Script Ingestion Block", type: "detective", desc: "Fix an app blocked by strict enterprise CSP rules forbidding unsafe-inline scripts and hashes." }
    ]
  },
  {
    day: 30,
    month: 1,
    blockNum: 6,
    title: "Month 1 Capstone Viva Gate: JobPilot Production Job Hunting OS Architecture Defense",
    stageName: "Stage 3: Enterprise Capstone Defense",
    stageNum: 3,
    pedagogicalRole: "Month 1 Capstone Viva (Comprehensive Frontend Architecture)",
    spokenGoal: "Defend your Month 1 Capstone project before the Senior Architect Review Board: `JobPilot` — a production-grade Job Hunting OS featuring Kanban status pipelines, full-text search with AbortController, optimistic updates, URL filters, local persistence with cross-tab sync, and an audited test suite.",
    conceptInvariant: "A professional frontend system must unite declarative state machines, pure component trees, resilient async data ingestion with cancellation, accessible keyboard navigation, and production bundle budgets.",
    failureMode: "Failing the live architectural viva by being unable to explain how state updates are scheduled, why index keys corrupt lists, or how AbortController prevents network race conditions.",
    tryItFriction: "Demonstrate live code defense: Walk through your custom hooks, explain how your Error Boundaries isolate component failures, and pass all automated end-to-end test suites.",
    socraticHints: [
      "How would you explain the difference between re-rendering and DOM updating to an interviewer?",
      "Re-rendering is running the component function in JavaScript to generate a new React element object tree.",
      "The commit phase is when React diffs that tree against the previous fiber tree and writes only the actual differences to the browser's C++ DOM."
    ],
    situationalPuzzle: {
      scenario: "During the Month 1 Capstone Viva, the Chief Architect asks: 'If a user drags an application card from 'Applied' to 'Interviewing', how does your architecture ensure the UI updates instantly while gracefully rolling back if the server returns HTTP 500?' How do you answer?",
      options: [
        "Wait for the server to respond before updating the screen.",
        "Optimistic UI update: Immediately update client state in the reducer and save a snapshot of previous state; initiate the async network request; if it rejects, dispatch a ROLLBACK action to restore the snapshot and display an error toast.",
        "Reload the entire page.",
        "Assume the server never fails."
      ],
      answerIdx: 1,
      debrief: "Optimistic UI updates give users instantaneous feedback by applying updates immediately to local state. Retaining a snapshot of the prior state allows clean, automated rollbacks if the asynchronous request fails."
    },
    quests: [
      { id: "react-m1-d30-q1", name: "Capstone System Architecture & State Topology Specification", type: "concept", desc: "Present the complete architectural blueprint of JobPilot: state stores, hook layers, and route topology." },
      { id: "react-m1-d30-q2", name: "Detective Lab: Live Outage Simulation & Hotfix", type: "detective", desc: "Diagnose and resolve a simulated production outage: a race condition during rapid Kanban card dragging." },
      { id: "react-m1-d30-q3", name: "Mastery Assignment: Full JobPilot Production Codebase Delivery", type: "assignment", desc: "Deliver the production-ready JobPilot OS with Kanban pipeline, search, persistence, and 95%+ test coverage." },
      { id: "react-m1-d30-q4", name: "Month 1 Capstone Viva Defense: Staff Architecture Board Evaluation", type: "detective", desc: "Defend your codebase, memory models, rendering trade-offs, and accessibility audits before Senior Staff." }
    ]
  }
];

export const REACT_MONTH_2_SPECS: MasterclassDaySpec[] = [
  // ── BLOCK 7: React Fiber Reconciliation & Engine Internals (Days 31–35) ──────
  {
    day: 31,
    month: 2,
    blockNum: 7,
    title: "Inside the React Engine: The Fiber Node Data Structure (child, sibling, return, memoizedState)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Fiber Engine & Memory Structures)",
    spokenGoal: "Deconstruct the React Fiber engine from the ground up: Learn why React abandoned the recursive stack reconciler in version 16, and examine the Fiber node data structure as a singly-linked list tree allowing pause, resume, and priority scheduling.",
    conceptInvariant: "A Fiber is a JavaScript object representing a unit of work. Fibers form a singly-linked tree via three pointers: `child` (first child), `sibling` (next sibling), and `return` (parent). This flat structure allows React to traverse trees iteratively without consuming the native call stack.",
    failureMode: "Thinking React traverses components via recursive function calls: deep component trees in the old Stack Reconciler exceeded call stack limits and could not be paused without losing execution context.",
    tryItFriction: "Write a plain JavaScript fiber tree traversal loop using `node.child`, `node.sibling`, and `node.return`, printing every node without using recursive function calls.",
    socraticHints: [
      "Why did the old React Stack Reconciler cause jank during long animations?",
      "Recursive tree traversals cannot be paused! Once started, the call stack is blocked until every single child is visited.",
      "The Fiber linked-list traversal can pause at ANY node, yield to the browser, and resume from the exact same node."
    ],
    situationalPuzzle: {
      scenario: "An L5 frontend engineering interviewer asks: 'How does React store hook state (like multiple useStates and useEffects) on a component fiber?' How do you describe the internal memory structure?",
      options: [
        "In a global dictionary indexed by component name.",
        "As a singly-linked list of Hook objects on `fiber.memoizedState`, where each hook points to the next via `hook.next`.",
        "In browser sessionStorage.",
        "In the DOM element's dataset attribute."
      ],
      answerIdx: 1,
      debrief: "Hook state is stored as a singly-linked list on `fiber.memoizedState`. Each call to useState or useEffect advances a pointer `workInProgressHook = workInProgressHook.next`. This is why hooks cannot be called conditionally or in loops."
    },
    quests: [
      { id: "react-m2-d31-q1", name: "The Fiber Data Structure & Pointer Topology", type: "concept", desc: "Inspect all core fields of a Fiber node: tag, key, type, stateNode, child, sibling, return, memoizedProps, memoizedState, flags, and lanes." },
      { id: "react-m2-d31-q2", name: "Detective Lab: Reconstructing a Corrupted Fiber Linked List", type: "detective", desc: "Trace a manual fiber linked list traversal loop that dropped sibling branches due to missing return pointer checks." },
      { id: "react-m2-d31-q3", name: "Mastery Assignment: Iterative Fiber Tree Walker Engine", type: "assignment", desc: "Implement a non-recursive, iterative fiber tree walker in pure TypeScript that yields execution every 5ms." },
      { id: "react-m2-d31-q4", name: "Staff Interview Lab: The Death of the Stack Reconciler", type: "detective", desc: "Defend why React moved from call-stack recursion to fiber objects to enable cooperative multitasking." }
    ]
  },
  {
    day: 32,
    month: 2,
    blockNum: 7,
    title: "The Two-Phase Architecture: Interruptible Render/Reconciliation vs Synchronous Commit Phase",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Two-Phase Architecture & Schedulers)",
    spokenGoal: "Master the separation between the Render Phase and Commit Phase: Understand how React computes work asynchronously, why the Render phase can be paused, aborted, or restarted, and why the Commit phase must execute synchronously.",
    conceptInvariant: "The Render Phase (reconciliation) calculates differences and tags fibers with effect flags (Placement, Update, Deletion); it creates NO side effects and is completely interruptible. The Commit Phase executes synchronously, applying changes to the real DOM in one unbroken pass to prevent visual tearing.",
    failureMode: "Performing side effects (like initiating network requests or mutating external globals) during the Render phase: because React can restart the render pass multiple times, the side effect executes repeatedly.",
    tryItFriction: "Instrument the two phases using `performance.mark()`: observe how React performs multiple work loops during render before executing a single synchronous commit block.",
    socraticHints: [
      "Why can't the Commit phase be split across multiple animation frames?",
      "If the browser painted halfway through committing DOM changes, users would see half-updated, broken UIs (visual tearing)!",
      "The Commit phase must run synchronously in a single frame so all DOM mutations appear together."
    ],
    situationalPuzzle: {
      scenario: "During concurrent rendering, React starts rendering a low-priority list of 10,000 items. 2ms in, the user types a letter into a search input. What does the React Fiber scheduler do?",
      options: [
        "Ignores the user's keystroke until all 10,000 items finish rendering.",
        "Interrupts and yields: It pauses the low-priority list render, immediately processes the high-priority typing update, commits the input, and then resumes or restarts the list.",
        "Crashes the browser tab.",
        "Spawns 4 Web Workers."
      ],
      answerIdx: 1,
      debrief: "React's cooperative scheduler prioritizes high-urgency discrete user events (typing, clicks). It yields the current low-priority work loop, processes the high-priority update, and returns to the lower priority work."
    },
    quests: [
      { id: "react-m2-d32-q1", name: "The Render vs Commit Execution Lifecycle", type: "concept", desc: "Deconstruct the exact function pipeline: scheduleUpdateOnFiber -> performConcurrentWorkOnRoot -> renderRootConcurrent -> commitRoot." },
      { id: "react-m2-d32-q2", name: "Detective Lab: The Interrupted Render Side-Effect Bug", type: "detective", desc: "Isolate a third-party analytics tracker that recorded duplicate pageviews because its tracking code ran in the render phase." },
      { id: "react-m2-d32-q3", name: "Mastery Assignment: Simulated Cooperative Work Loop Scheduler", type: "assignment", desc: "Build a mini work-loop engine in TypeScript that processes task queues and yields when shouldYield() is true." },
      { id: "react-m2-d32-q4", name: "Staff Interview Lab: Preventing Visual Tearing Invariants", type: "detective", desc: "Explain the mathematical guarantees that prevent partially committed DOM states from appearing to users." }
    ]
  },
  {
    day: 33,
    month: 2,
    blockNum: 7,
    title: "Fiber Double Buffering: The Current Tree vs WorkInProgress Tree Swap Mechanics",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Double Buffering & Pointer Flipping)",
    spokenGoal: "Master double buffering in React: Learn how React borrows a classic computer graphics concept to maintain two fiber trees in memory — the `current` tree (what is on screen) and the `workInProgress` tree (what is being computed) — swapping them with a single pointer change.",
    conceptInvariant: "React never mutates the active tree while computing changes. It constructs a mirrored `workInProgress` tree where each node links to its current counterpart via `fiber.alternate`. At the end of the commit phase, React flips the root pointer: `fiberRoot.current = workInProgressRoot`.",
    failureMode: "Assuming React re-allocates an entirely new tree of fiber objects on every render: React recycles existing alternate fibers to eliminate Garbage Collection memory churn.",
    tryItFriction: "Trace the `alternate` property of a Fiber node across multiple state updates, proving that React reuses the exact same two fiber object instances back and forth.",
    socraticHints: [
      "In video game development, why do graphics engines use a back buffer and a front buffer?",
      "You draw into the invisible back buffer so the user never sees half-drawn pixels. When finished, you flip pointers!",
      "React does the exact same thing: workInProgress is the back buffer; current is the front buffer on screen."
    ],
    situationalPuzzle: {
      scenario: "An enterprise candidate is asked: 'Why does React reuse fiber objects via the `alternate` property instead of discarding them and creating fresh ones on every state update?' What is the primary systems-level reason?",
      options: [
        "JavaScript restricts the total number of objects in memory.",
        "Garbage Collection optimization: Recycling existing fiber objects drastically reduces memory allocations and prevents GC pause spikes during 60 FPS animations.",
        "To prevent CSS classes from resetting.",
        "Because alternate fibers run on a separate CPU core."
      ],
      answerIdx: 1,
      debrief: "Creating and destroying thousands of JavaScript objects per second creates severe Garbage Collection pressure, causing noticeable frame drops (jank). Double buffering recycles alternate fibers, keeping memory churn near zero."
    },
    quests: [
      { id: "react-m2-d33-q1", name: "The Double Buffering Memory Architecture", type: "concept", desc: "Diagram the fiberRoot -> current and current.alternate -> workInProgress relationship and the pointer flip." },
      { id: "react-m2-d33-q2", name: "Detective Lab: Tracking Alternate Fiber Recycling in Memory", type: "detective", desc: "Use Chrome DevTools memory allocation timeline to observe how alternate node recycling prevents GC spikes." },
      { id: "react-m2-d33-q3", name: "Mastery Assignment: Double-Buffered State Machine Simulator", type: "assignment", desc: "Construct a double-buffered data pipeline in TypeScript that processes updates offscreen before flipping active pointers." },
      { id: "react-m2-d33-q4", name: "Staff Interview Lab: Memory Pools & GC Optimization in V8", type: "detective", desc: "Defend the V8 generational GC implications of long-lived fiber references versus short-lived object allocations." }
    ]
  },
  {
    day: 34,
    month: 2,
    blockNum: 7,
    title: "Diffing Algorithm Invariants: Level-by-Level Tree Comparison, Type Changes & Keyed Movements",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Diffing Heuristics & Key Matching)",
    spokenGoal: "Master React's heuristic O(N) diffing algorithm: Learn the three mathematical assumptions React makes to avoid the O(N³) complexity of general tree diffing: elements of different types generate different trees, keys provide stable identities, and diffing only compares siblings at the same depth.",
    conceptInvariant: "If a component's element `type` changes (e.g. from `<div>` to `<section>`, or from `<ComponentA>` to `<ComponentB>`), React immediately UNMOUNTS the entire old subtree, destroying all state below it, rather than attempting to diff child nodes.",
    failureMode: "Conditionally wrapping a component in an outer tag: `{isWrapper ? <div><Child /></div> : <section><Child /></section>}` causes `<Child>` to completely unmount and lose all state whenever `isWrapper` toggles.",
    tryItFriction: "Prove that changing an outer wrapper type destroys child state, and refactor the component using CSS classes or consistent wrapper types to maintain subtree persistence.",
    socraticHints: [
      "Why did the text inside `<Child />` disappear when we toggled from `<div>` to `<section>`?",
      "React's diffing heuristic says: if the element type changes, tear down the entire old tree and build a new one!",
      "Keep the element type stable and modify props/classes, or use a consistent container tag."
    ],
    situationalPuzzle: {
      scenario: "A list of 5 items is reordered from [A, B, C, D, E] to [E, A, B, C, D]. With proper stable keys, how many real DOM node removals and additions does React execute in the commit phase?",
      options: [
        "It removes all 5 nodes and re-creates all 5 from scratch.",
        "Zero removals: React matches all 5 nodes by their keys and executes a single DOM insertBefore mutation to move node E to the front.",
        "5 removals and 5 insertions.",
        "It modifies the innerHTML of all 5 nodes."
      ],
      answerIdx: 1,
      debrief: "With stable keys, React's list reconciliation algorithm detects that all existing fiber nodes can be reused. It keeps nodes A through D in place and issues a single DOM operation to reposition node E before node A."
    },
    quests: [
      { id: "react-m2-d34-q1", name: "The Mathematical Heuristics of O(N) Tree Diffing", type: "concept", desc: "Contrast the theoretical O(N^3) Levenshtein tree edit distance with React's level-by-level O(N) heuristic." },
      { id: "react-m2-d34-q2", name: "Detective Lab: The Unintended Subtree Destruction Bug", type: "detective", desc: "Diagnose an app where conditional rendering of a wrapper component reset user form inputs across tabs." },
      { id: "react-m2-d34-q3", name: "Mastery Assignment: Keyed Sibling Reconciler Engine", type: "assignment", desc: "Build an array reconciliation diffing engine in TypeScript that computes optimal DOM moves using a Map of keys." },
      { id: "react-m2-d34-q4", name: "Staff Interview Lab: Designing Custom Diffing Algorithms", type: "detective", desc: "Defend trade-offs between virtual DOM diffing (React) vs compiled fine-grained reactivity (Svelte/Solid)." }
    ]
  },
  {
    day: 35,
    month: 2,
    blockNum: 7,
    title: "Milestone 6: Custom Mini-Reconciler: Building a Working DOM Fiber Scheduler from Scratch",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Custom Fiber Engine Implementation)",
    spokenGoal: "Build and defend Milestone 6: A fully functional mini-React reconciler from scratch in pure TypeScript, implementing Fiber nodes, cooperative work loops via `requestIdleCallback`/`MessageChannel`, functional components, `useState`, and two-phase DOM commits.",
    conceptInvariant: "The best way to understand an engine is to build it. A working Fiber reconciler requires: element creation, fiber tree generation, time-sliced work loops, hook state linked lists, and a commitRoot function.",
    failureMode: "Allowing work loop computations to exceed frame deadlines, locking up browser responsiveness during large component updates.",
    tryItFriction: "Run your mini-reconciler in a test harness: render a counter component, update state, and assert that the real browser DOM updates correctly without any React imports.",
    socraticHints: [
      "How does our work loop know when to pause?",
      "Check `deadline.timeRemaining() < 1` inside your `while (nextUnitOfWork && !shouldYield())` loop.",
      "If the browser needs the thread, yield execution and schedule the next slice via MessageChannel."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 6 defense, the evaluator inspects your custom `commitRoot` function. They notice you committed DOM mutations inside the `performUnitOfWork` loop instead of `commitRoot`. Why is this a fatal architectural error?",
      options: [
        "The browser doesn't allow DOM updates inside loops.",
        "Because performUnitOfWork is interruptible: if execution yields halfway through the tree, users see a half-rendered, broken DOM on screen!",
        "It uses too much memory.",
        "TypeScript will refuse to compile."
      ],
      answerIdx: 1,
      debrief: "Mutating the real DOM during the interruptible work loop destroys the entire guarantee of concurrent rendering. DOM mutations must be deferred until reconciliation finishes completely, then executed synchronously in commitRoot."
    },
    quests: [
      { id: "react-m2-d35-q1", name: "Milestone 6 Architecture & Mini-Fiber Specification", type: "concept", desc: "Draft the architectural spec for the custom reconciler: createElement, workLoop, reconcileChildren, commitRoot." },
      { id: "react-m2-d35-q2", name: "Detective Lab: The Interrupted Partial DOM Mutation Glitch", type: "detective", desc: "Fix an issue in the mini-reconciler where yielding mid-tree caused orphan elements to remain visible on screen." },
      { id: "react-m2-d35-q3", name: "Mastery Assignment: Complete Custom Fiber DOM Reconciler", type: "assignment", desc: "Deliver a standalone 400-line TypeScript mini-React engine supporting components, useState, and cooperative rendering." },
      { id: "react-m2-d35-q4", name: "Milestone 6 Defense: Deep Engine Internals & Fiber Walker Viva", type: "detective", desc: "Step through your fiber linked list walker, hook pointers, and commit passes before Senior Systems Architects." }
    ]
  },

  // ── BLOCK 8: Concurrent React, Lane Scheduling & Interruptible Rendering (Days 36–40)
  {
    day: 36,
    month: 2,
    blockNum: 8,
    title: "The 16ms Frame Budget: Cooperative Multitasking, MessageChannel Scheduler & Time Slicing",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Frame Budgets & Cooperative Schedulers)",
    spokenGoal: "Master the 16.6ms frame budget: Learn why maintaining 60 FPS (or 120 FPS) requires JavaScript to yield within 5–10ms, how React's Scheduler package uses `MessageChannel` (not setTimeout or requestIdleCallback), and how time-slicing prevents UI thread starvation.",
    conceptInvariant: "The browser has a strict budget per frame (16.6ms at 60Hz). If JavaScript runs for 50ms, 3 consecutive frames are dropped, causing visible stutter. React Scheduler breaks long renders into 5ms slices using MessageChannel macro-tasks to yield to browser paint cycles.",
    failureMode: "Using `setTimeout(fn, 0)` for cooperative multitasking: browsers enforce a 4ms minimum clamp on nested timeouts, wasting valuable frame time.",
    tryItFriction: "Build a high-performance cooperative task scheduler using `MessageChannel`, verifying in the Chrome Performance profiler that tasks yield execution every 5ms.",
    socraticHints: [
      "Why didn't React use `requestIdleCallback` for its production scheduler?",
      "`requestIdleCallback` does not exist in Safari, and on Chrome it only fires when the browser is completely idle, throttling heavily during user interaction!",
      "React uses `MessageChannel` to post immediate macrotasks that yield control to browser layout and paint."
    ],
    situationalPuzzle: {
      scenario: "A developer profiles an app with a heavy 200ms rendering calculation. In React 17, the frame timeline shows a solid 200ms red block (Long Task). In React 18 with Concurrent Mode, what does the flame chart look like instead?",
      options: [
        "The calculation finishes in 0ms.",
        "The single 200ms block is broken into forty discrete ~5ms task slices, with browser layout, user input, and paint cycles running smoothly in between.",
        "The calculation moves to a background thread.",
        "The calculation is skipped entirely."
      ],
      answerIdx: 1,
      debrief: "React 18 time-slicing divides long-running rendering computations into small 5ms cooperative execution slices, allowing the browser to process touch events, cursor typing, and CSS animations without dropping frames."
    },
    quests: [
      { id: "react-m2-d36-q1", name: "The Browser Main Thread 16.6ms Frame Anatomy", type: "concept", desc: "Trace the 16.6ms lifecycle: Input Events -> JS Execution -> rAF Callbacks -> Layout (Reflow) -> Paint -> Composite." },
      { id: "react-m2-d36-q2", name: "Detective Lab: The setTimeout 4ms Clamp Starvation", type: "detective", desc: "Measure how nested setTimeout calls waste 4ms per chunk and replace them with a zero-latency MessageChannel scheduler." },
      { id: "react-m2-d36-q3", name: "Mastery Assignment: Production MessageChannel Time-Slicing Engine", type: "assignment", desc: "Implement a cooperative task scheduler with priority levels, timeout deadlines, and dynamic yield thresholds." },
      { id: "react-m2-d36-q4", name: "Staff Interview Lab: Cooperative Scheduling vs Preemptive OS Threads", type: "detective", desc: "Explain why single-threaded JavaScript runtimes require cooperative scheduling and how fibers fulfill that need." }
    ]
  },
  {
    day: 37,
    month: 2,
    blockNum: 8,
    title: "Lane Priority Architecture: Bitmask Priority Scheduling (Sync, Continuous, Default, Idle Lanes)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Bitmask Lanes & Priority Queues)",
    spokenGoal: "Master React's Lane Priority system: Learn why React replaced the legacy ExpirationTime model with a 31-bit integer bitmask (Lanes), how bitwise operations (`&`, `|`, `~`) evaluate task priority in O(1) time, and how different priority tiers are assigned.",
    conceptInvariant: "React models task priority using a 31-bit integer bitmask. Higher priority work has smaller bit values (e.g. `SyncLane = 0b0001`). Using bitmasks allows React to represent multiple concurrent task batches, entangle related updates, and check priority with instant bitwise operations.",
    failureMode: "Thinking task priority is a simple number from 1 to 10: numeric priorities cannot represent non-contiguous sets of updates or batch overlapping async dependencies without complex array allocations.",
    tryItFriction: "Write bitwise helper functions (`includesSomeLane`, `mergeLanes`, `pickHighestPriorityLane`) using 32-bit integers to simulate React's priority lane decision engine.",
    socraticHints: [
      "How does React check if an update contains SyncLane work in a single CPU instruction?",
      "Bitwise AND: `if ((lanes & SyncLane) !== 0)`! It runs in 1 CPU cycle with zero memory allocations.",
      "Bitmasks allow React to query, merge, and mask priority sets with lightning speed."
    ],
    situationalPuzzle: {
      scenario: "An enterprise candidate is asked: 'What is the priority difference between a user typing in an input (ContinuousLane) and a data fetch resolving (DefaultLane)?'",
      options: [
        "They have the exact same priority.",
        "Input events are assigned InputContinuousLane which preempts DefaultLane work, guaranteeing that keystrokes never wait behind network data processing.",
        "Network data has higher priority so data doesn't get lost.",
        "ContinuousLane runs on a Web Worker."
      ],
      answerIdx: 1,
      debrief: "InputContinuousLane (keystrokes, mouse drags) represents high-frequency user interactions where immediate visual feedback is essential. It preempts DefaultLane (data fetches, background transitions) to keep typing responsive."
    },
    quests: [
      { id: "react-m2-d37-q1", name: "The 31-Bit Lane Architecture Specification", type: "concept", desc: "Examine the bitmask hierarchy: SyncLane, InputContinuousHydrationLane, InputContinuousLane, DefaultLane, IdleLane, OffscreenLane." },
      { id: "react-m2-d37-q2", name: "Detective Lab: Starvation of Low-Priority Lanes", type: "detective", desc: "Analyze how continuous high-priority updates can starve idle background work and how React marks lanes as expired." },
      { id: "react-m2-d37-q3", name: "Mastery Assignment: Bitmask Priority Queue Engine", type: "assignment", desc: "Build a standalone TypeScript task queue implementing 32-bit priority lanes with automated priority promotion." },
      { id: "react-m2-d37-q4", name: "Staff Interview Lab: Why Bitmasks Replaced Expiration Times", type: "detective", desc: "Defend the mathematical advantages of bitmask sets over linear expiration timestamps in concurrent systems." }
    ]
  },
  {
    day: 38,
    month: 2,
    blockNum: 8,
    title: "Non-Urgent Updates with useTransition: Preventing UI Freezes on Heavy State Computations",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (useTransition & Priority De-escalation)",
    spokenGoal: "Master `useTransition`: Learn how to split state updates into urgent (typing, button clicks) and non-urgent transitions (filtering large tables, tab switching), keeping user inputs snappy while heavy renders compute in the background.",
    conceptInvariant: "Updates wrapped in `startTransition(() => { setState(val) })` are assigned `TransitionLane`. React will interrupt this render if a high-priority update occurs, keeping the user interface completely responsive. The `isPending` boolean flags whether the background update is still computing.",
    failureMode: "Updating a large filtered list of 5,000 items directly inside an `onChange` handler without a transition, causing typing inside the search input to lag by 200ms per keystroke.",
    tryItFriction: "Wrap a heavy chart filtering calculation in `startTransition`, assert that the text input updates instantaneously at 60 FPS, and display an `isPending` loading indicator while the chart renders.",
    socraticHints: [
      "Why did typing feel sluggish in the search input?",
      "The input text state AND the 5,000-item filter calculation were updated at the SAME urgent priority!",
      "Keep `setText(e.target.value)` urgent, but wrap `startTransition(() => setFilteredList(...))` to de-escalate the filter work."
    ],
    situationalPuzzle: {
      scenario: "A user is on 'Overview' tab and clicks 'Analytics' tab (wrapped in `startTransition`). While 'Analytics' is computing in the background, the user quickly changes their mind and clicks 'Settings' tab. What does React do with the 'Analytics' render?",
      options: [
        "It forces the user to wait until Analytics finishes.",
        "It instantly discards the incomplete 'Analytics' render in memory and starts rendering 'Settings' immediately, preventing wasted work.",
        "It crashes the tab.",
        "It opens Analytics in a new window."
      ],
      answerIdx: 1,
      debrief: "Transitions are interruptible and discardable. If an update becomes stale before it commits, React immediately abandons the work-in-progress tree in memory and switches focus to the newest user request."
    },
    quests: [
      { id: "react-m2-d38-q1", name: "The startTransition Execution Mechanics", type: "concept", desc: "Trace how startTransition sets internal React scheduler flags (isInsideTransition) to assign TransitionLane to setters." },
      { id: "react-m2-d38-q2", name: "Detective Lab: The Sluggish Search Input Investigation", type: "detective", desc: "Refactor an enterprise dashboard search that caused 300ms input lag into an instantaneous transition-driven UI." },
      { id: "react-m2-d38-q3", name: "Mastery Assignment: Multi-Tab Workspace with Concurrent Transitions", type: "assignment", desc: "Build a heavy multi-view trading terminal where tab switching uses startTransition with pending status indicators." },
      { id: "react-m2-d38-q4", name: "Staff Interview Lab: useTransition vs Debouncing / Throttling", type: "detective", desc: "Articulate the fundamental differences: Debouncing introduces arbitrary delays; useTransition renders immediately as fast as hardware permits." }
    ]
  },
  {
    day: 39,
    month: 2,
    blockNum: 8,
    title: "Responsive Search with useDeferredValue: Debouncing vs Deferred Rendering Benchmarks",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (useDeferredValue & Hardware Adaptation)",
    spokenGoal: "Master `useDeferredValue`: Learn how to defer re-rendering expensive subtrees when you don't control the state setter (e.g. props from a third-party library), and benchmark why deferred rendering outperforms fixed timer debouncing on variable hardware.",
    conceptInvariant: "`useDeferredValue` receives a value and returns a deferred copy that lags behind during urgent updates. React renders with the old value first, then renders with the deferred value in the background. Unlike debouncing with setTimeout, deferred values update IMMEDIATELY on fast machines with zero artificial delay.",
    failureMode: "Using a fixed 300ms debounce on a fast MacBook M3 where filtering could finish in 5ms, forcing the user to suffer an unnecessary artificial 300ms delay on every keystroke.",
    tryItFriction: "Benchmark `useDeferredValue` against `useDebounce` on 10,000 list items under 4x CPU throttling in Chrome DevTools, measuring total input responsiveness and layout stability.",
    socraticHints: [
      "Why is a 300ms setTimeout debounce frustrating on high-end hardware?",
      "Because the computer could have rendered the results in 10ms, but setTimeout forces the user to wait 300ms!",
      "`useDeferredValue` adapts to the user's device: it renders instantly on fast CPUs and lags gracefully on slow CPUs."
    ],
    situationalPuzzle: {
      scenario: "An engineer uses `const deferredQuery = useDeferredValue(query)`. They want to dim the search results list while the new results are computing in the background. How can they detect this state?",
      options: [
        "Check `if (window.isRendering)`.",
        "Compare `query !== deferredQuery`: if the raw query does not equal the deferred query, a background update is pending, so apply an opacity style.",
        "useDeferredValue has a built-in isPending return parameter.",
        "Use a setTimeout flag."
      ],
      answerIdx: 1,
      debrief: "Unlike useTransition (which provides an `isPending` boolean), useDeferredValue only returns the deferred value. You can check if work is pending simply by comparing `query !== deferredQuery`."
    },
    quests: [
      { id: "react-m2-d39-q1", name: "The useDeferredValue Fiber Scheduling Lifecycle", type: "concept", desc: "Trace how React completes the urgent render with the stale value before scheduling a background render with the deferred value." },
      { id: "react-m2-d39-q2", name: "Detective Lab: The Double-Debounce Latency Trap", type: "detective", desc: "Eliminate combined debounce timers and deferred values that caused a 600ms latency penalty on mobile devices." },
      { id: "react-m2-d39-q3", name: "Mastery Assignment: Hardware-Adaptive Data Grid with Deferred Values", type: "assignment", desc: "Build a 10,000-node visual graph query interface that adapts smoothly across both low-end mobile and high-end desktop hardware." },
      { id: "react-m2-d39-q4", name: "Staff Interview Lab: Comparing useTransition vs useDeferredValue", type: "detective", desc: "Defend when to use useTransition (wrapping state updates) versus useDeferredValue (consuming raw values or props)." }
    ]
  },
  {
    day: 40,
    month: 2,
    blockNum: 8,
    title: "Milestone 7: Low-Latency 10,000-Node Visual Graph Filter with useTransition & Time Slicing",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Concurrent UI Engineering)",
    spokenGoal: "Build and defend Milestone 7: A low-latency interactive graph exploration engine filtering 10,000 complex nodes in real time, leveraging `useTransition`, `useDeferredValue`, cooperative time slicing, and zero dropped frames.",
    conceptInvariant: "High-scale visualization tools must maintain a strict 60 FPS input response rate on the main thread while delegating heavy computational tree filtering to interruptible concurrent lanes.",
    failureMode: "Allowing a complex graph filtering pass to block the main thread for over 100ms, triggering browser input delay warnings and janky slider dragging.",
    tryItFriction: "Implement a high-frequency slider filter: assert that the slider handle moves smoothly at 60 FPS without stutter, while the 10,000 graph nodes filter smoothly in the background.",
    socraticHints: [
      "Where should the slider position state live?",
      "Keep `sliderValue` in an urgent `useState` so the handle tracks the mouse instantly.",
      "Wrap the expensive graph recalculation in `startTransition` or `useDeferredValue`."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 7 review, the evaluator drags the threshold slider back and forth rapidly. Chrome DevTools reports 0 dropped frames on the slider, but the background graph node count updates only twice. Why is this desired behavior?",
      options: [
        "The graph engine crashed.",
        "React's concurrent scheduler interrupted and discarded intermediate superseded filter passes, committing only the latest threshold to avoid wasted work.",
        "The computer ran out of memory.",
        "Transitions are limited to 2 renders per second."
      ],
      answerIdx: 1,
      debrief: "This is the signature triumph of concurrent rendering: React does not waste battery or CPU computing obsolete intermediate states. It discards them in memory and commits only the state reflecting the user's latest interaction."
    },
    quests: [
      { id: "react-m2-d40-q1", name: "Milestone 7 System Architecture & Concurrent Flow Design", type: "concept", desc: "Design the dual-priority architecture separating high-urgency gesture tracking from background node filtering." },
      { id: "react-m2-d40-q2", name: "Detective Lab: The Slider Input Jitter Post-Mortem", type: "detective", desc: "Fix an issue where dragging an SVG filter slider stuttered due to an un-transitioned graph calculation." },
      { id: "react-m2-d40-q3", name: "Mastery Assignment: 10,000-Node Concurrent Visual Graph Filter", type: "assignment", desc: "Deliver the full graph visualization engine with time-slicing, transitions, pending states, and 60 FPS guarantees." },
      { id: "react-m2-d40-q4", name: "Milestone 7 Defense: Concurrent Rendering & Frame Rate Auditing Viva", type: "detective", desc: "Defend your frame budgets, lane assignments, and CPU throttling profiles before Senior Performance Architects." }
    ]
  },

  // ── BLOCK 9: External State Stores & Suspense Streaming (Days 41–45) ──────────
  {
    day: 41,
    month: 2,
    blockNum: 9,
    title: "State Tearing in Concurrent Mode & The useSyncExternalStore Contract",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (State Tearing & External Store Subscriptions)",
    spokenGoal: "Master state tearing and `useSyncExternalStore`: Learn why subscribing to mutable external stores (Redux, Zustand, window history) with `useEffect` causes visual tearing during concurrent rendering, and how `useSyncExternalStore` solves it.",
    conceptInvariant: "Tearing occurs when a concurrent render yields to the main thread, an external store updates, and the resumed render reads the NEW store value, causing different components in the same render pass to display conflicting values. `useSyncExternalStore` forces synchronous evaluation to guarantee UI consistency.",
    failureMode: "Writing custom subscription hooks using `useState` and `useEffect`: under Concurrent Mode, components display mismatched data in the same frame (e.g. header shows $100 while sidebar shows $150).",
    tryItFriction: "Build a custom subscription to the browser's `navigator.onLine` or window resize state using `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`.",
    socraticHints: [
      "Why does `getSnapshot` need to return an immutable cached reference?",
      "If `getSnapshot()` returns a new object reference `{ isOnline }` every time it is called, React will detect an infinite update loop!",
      "Always return primitive values or cached immutable objects from `getSnapshot`."
    ],
    situationalPuzzle: {
      scenario: "An enterprise developer builds an external store: `let state = { count: 0 };`. Inside `getSnapshot`, they write: `return { ...state };`. When mounting their component with `useSyncExternalStore`, React throws: 'The result of getSnapshot should be cached to avoid an infinite loop'. Why?",
      options: [
        "getSnapshot cannot read global variables.",
        "Returning `{ ...state }` allocates a brand-new object reference on every invocation. React compares snapshots with `Object.is`: because references never match, React thinks the store is constantly changing.",
        "useSyncExternalStore only works on arrays.",
        "The count variable was not frozen."
      ],
      answerIdx: 1,
      debrief: "React calls `getSnapshot` to determine if the store changed. If getSnapshot returns a new object literal every time, `Object.is(prev, next)` is always false, tricking React into scheduling infinite re-render loops."
    },
    quests: [
      { id: "react-m2-d41-q1", name: "The Visual Tearing Race Condition Timeline", type: "concept", desc: "Diagram how a mutable external store mutation during an interrupted render creates visual UI inconsistencies." },
      { id: "react-m2-d41-q2", name: "Detective Lab: The Infinite getSnapshot Loop Crash", type: "detective", desc: "Fix an app that crashed with 'Maximum update depth exceeded' due to unmemoized snapshot returns." },
      { id: "react-m2-d41-q3", name: "Mastery Assignment: Production useSyncExternalStore WebSocket Cache", type: "assignment", desc: "Build a tear-free subscription layer for a high-frequency WebSocket trading ticker with snapshot caching." },
      { id: "react-m2-d41-q4", name: "Staff Interview Lab: Why Redux & Zustand Migrated to uSES", type: "detective", desc: "Explain the architecture that enabled global state libraries to support React 18 Concurrent Mode without tearing." }
    ]
  },
  {
    day: 42,
    month: 2,
    blockNum: 9,
    title: "Atomic & Micro-State Management: Zustand & Jotai Internals vs Monolithic Redux",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Micro-State Architectures & Selectors)",
    spokenGoal: "Master modern micro-state architecture: Contrast monolithic single-tree stores (Redux) with lightweight external stores (Zustand) and atomic state graphs (Jotai/Recoil), learning how selector functions achieve surgical component re-renders.",
    conceptInvariant: "Monolithic global state trees force components to re-render unless protected by memoized selectors. Zustand decouples state into an external vanilla JS closure, using `useSyncExternalStore` with strict equality selectors (`useStore(state => state.user)`) to re-render ONLY when the selected slice changes.",
    failureMode: "Calling `const store = useStore()` without a selector: any update anywhere in the global store forces that component to re-render, creating the same performance bottleneck as React Context.",
    tryItFriction: "Write a mini-Zustand implementation in 30 lines of TypeScript: create a store with `getState`, `setState`, and `subscribe`, and connect it to React via `useSyncExternalStore`.",
    socraticHints: [
      "Why did the Avatar component re-render when the user toggled the sidebar?",
      "The Avatar wrote `const { user } = useStore();` without a selector, subscribing to the WHOLE store!",
      "Pass a selector: `const user = useStore(state => state.user);`. Now it only re-renders when `user` changes."
    ],
    situationalPuzzle: {
      scenario: "A large enterprise dashboard manages 50 independent analytical widgets. The team considers Redux vs Zustand vs Jotai. If widgets need to subscribe to atomic, derived computations without a central monolithic schema, which architecture offers the lowest re-render footprint?",
      options: [
        "A single global Context provider.",
        "Atomic state (Jotai): Atoms represent independent, composable units of state. Components subscribe only to individual atoms, eliminating all cross-widget re-render cascades.",
        "LocalStorage polling.",
        "Redux without selectors."
      ],
      answerIdx: 1,
      debrief: "Atomic state models (like Jotai) decompose state into small, composable atoms. Dependency graphs track which components read which atoms, guaranteeing that updating atom A cannot re-render components watching atom B."
    },
    quests: [
      { id: "react-m2-d42-q1", name: "The Selector Equality Verification Pipeline", type: "concept", desc: "Analyze how Zustand evaluates `equalityFn(prevSlice, nextSlice)` before triggering a component re-render." },
      { id: "react-m2-d42-q2", name: "Detective Lab: The Unselected Global Store Render Storm", type: "detective", desc: "Profile an enterprise trading app and cut re-renders by 85% by introducing granular selector functions." },
      { id: "react-m2-d42-q3", name: "Mastery Assignment: Building a Mini-Zustand Store from Scratch", type: "assignment", desc: "Implement a complete micro-store library in TypeScript with middleware, selectors, and devtools hooks." },
      { id: "react-m2-d42-q4", name: "Staff Interview Lab: Comparing Context vs Redux vs Zustand vs Jotai", type: "detective", desc: "Present a comprehensive architectural trade-off matrix evaluating bundle size, boilerplates, and performance." }
    ]
  },
  {
    day: 43,
    month: 2,
    blockNum: 9,
    title: "TanStack Query (React Query) Internals: Stale-While-Revalidate, Structural Sharing & Cache Invalidation",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Server State Caching & Structural Sharing)",
    spokenGoal: "Master server state architecture with TanStack Query: Learn why server state is fundamentally different from client state, how the Stale-While-Revalidate (SWR) protocol works, how Structural Sharing preserves referential equality, and how query key serialization drives cache invalidation.",
    conceptInvariant: "Server state is cached remote data owned by the backend. TanStack Query uses Structural Sharing: when re-fetching data, if a nested object within a 1,000-item array hasn't changed, React Query preserves its original object reference, preventing downstream React components from re-rendering.",
    failureMode: "Storing server data in Redux/Zustand: you end up manually coding loading states, error states, cache deduplication, retry exponential backoff, and cache invalidation—badly.",
    tryItFriction: "Demonstrate Structural Sharing by comparing two identical JSON fetch responses, proving that `prevData.items[0] === nextData.items[0]` evaluates to `true` despite being a new network response.",
    socraticHints: [
      "Why didn't the UserCard re-render after a background refetch confirmed identical data?",
      "Structural Sharing! TanStack Query compared the new JSON against the old cache and kept the old object references for unchanged properties.",
      "Because object references were preserved, `React.memo` components saw zero prop changes and skipped rendering."
    ],
    situationalPuzzle: {
      scenario: "An engineer writes: `useQuery({ queryKey: ['user', { id, filter }], queryFn: ... })`. In another component, they write: `useQuery({ queryKey: ['user', { filter, id }], queryFn: ... })`. Notice the object key order is flipped. Does TanStack Query treat them as the same query?",
      options: [
        "No, JavaScript objects with different key order have different string representations.",
        "Yes! TanStack Query automatically deterministically serializes query keys, sorting object keys so that property order does not break cache hits.",
        "It throws a QueryKeyError.",
        "It clears the cache."
      ],
      answerIdx: 1,
      debrief: "TanStack Query uses deterministic JSON serialization for query keys. Object keys inside query key arrays are sorted alphabetically before hashing, ensuring that `{ id, filter }` and `{ filter, id }` share the exact same cache entry."
    },
    quests: [
      { id: "react-m2-d43-q1", name: "The Stale-While-Revalidate Protocol & Cache Lifecycle", type: "concept", desc: "Trace query states: Fresh -> Stale -> Fetching -> Paused -> Inactive -> Garbage Collected (gcTime)." },
      { id: "react-m2-d43-q2", name: "Detective Lab: The Unstable Query Key Infinite Fetch Loop", type: "detective", desc: "Fix an app that triggered continuous HTTP requests due to passing inline array literals into query functions." },
      { id: "react-m2-d43-q3", name: "Mastery Assignment: In-Memory SWR Cache with Structural Sharing", type: "assignment", desc: "Implement a lightweight server-cache manager in TypeScript with deterministic key hashing and structural sharing." },
      { id: "react-m2-d43-q4", name: "Staff Interview Lab: Client State vs Server State Separation", type: "detective", desc: "Defend why modern frontend engineering separates synchronous client state from asynchronous server cache." }
    ]
  },
  {
    day: 44,
    month: 2,
    blockNum: 9,
    title: "Optimistic UI Updates: Rollback Mechanics, Mutation Queues & Offline Mutation Sync",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Optimistic Mutations & Error Rollbacks)",
    spokenGoal: "Master production optimistic UI: Learn how to deliver zero-perceived-latency user interactions by mutating the local cache before server responses return, storing previous state snapshots, executing rollbacks on network failure, and queueing offline mutations.",
    conceptInvariant: "An optimistic mutation requires a 3-step contract: 1) Cancel active queries to prevent in-flight overwrites; 2) Snapshot the current cache and apply the optimistic change; 3) If the mutation fails, rollback using the snapshot; 4) On completion, invalidate queries to synchronize with canonical backend state.",
    failureMode: "Applying an optimistic update without snapshotting previous state: when the server returns HTTP 500 or validation errors, the UI remains corrupted with false data.",
    tryItFriction: "Implement a 'Like' button with TanStack Query `useMutation`: update the count instantly, simulate a 50% network failure rate, and verify that the count cleanly rolls back with an error toast on failure.",
    socraticHints: [
      "Why must we cancel outgoing queries with `queryClient.cancelQueries()` before applying an optimistic update?",
      "If a background refetch is already in flight, its response could arrive 10ms later and overwrite your optimistic update with old data!",
      "Always cancel active queries for that key before modifying the cache."
    ],
    situationalPuzzle: {
      scenario: "A user on a subway train goes through a tunnel and clicks 'Archive' on 3 emails in rapid succession. The app is offline. How must an enterprise optimistic architecture handle this?",
      options: [
        "Display a blocking error modal and prevent any clicking.",
        "Apply all 3 archive actions optimistically to local UI immediately, append the mutation requests to a persistent IndexedDB queue, and drain the queue automatically when the browser fires the `online` event.",
        "Reload the app.",
        "Throw an uncaught exception."
      ],
      answerIdx: 1,
      debrief: "Production offline architecture applies mutations optimistically to the local cache immediately, while persisting the pending mutations in an offline queue (e.g. IndexedDB). When connectivity returns, the queue is replayed sequentially."
    },
    quests: [
      { id: "react-m2-d44-q1", name: "The Optimistic Mutation Lifecycle Contract", type: "concept", desc: "Deconstruct the onMutate -> onError -> onSettled lifecycle flow in TanStack Query and state stores." },
      { id: "react-m2-d44-q2", name: "Detective Lab: The Overwritten Optimistic Update Bug", type: "detective", desc: "Isolate a bug where a background refetch overwrote an optimistic comment before the server mutation finished." },
      { id: "react-m2-d44-q3", name: "Mastery Assignment: Offline-First Mutation Queue with Rollback", type: "assignment", desc: "Build a resilient Kanban card status updater with optimistic movement, automatic retry, and IndexedDB sync." },
      { id: "react-m2-d44-q4", name: "Staff Interview Lab: Designing Idempotent Backend APIs for Optimistic Retries", type: "detective", desc: "Design backend idempotency keys (`Idempotency-Key` headers) to ensure retried mutations never create duplicate charges." }
    ]
  },
  {
    day: 45,
    month: 2,
    blockNum: 9,
    title: "Milestone 8: Real-Time Collaborative Task Board with Zustand & Optimistic Sync Rollbacks",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Real-Time State & Optimistic Engineering)",
    spokenGoal: "Build and defend Milestone 8: A real-time collaborative task board featuring Zustand state slices, TanStack Query cache synchronization, optimistic drag-and-drop status transitions, automated rollback on server rejection, and WebSocket live sync.",
    conceptInvariant: "Collaborative systems must harmonize local optimistic client changes with asynchronous multi-user server broadcasts without dropping local user edits or desynchronizing column ordering.",
    failureMode: "Allowing two concurrent users editing the same task to overwrite each other's changes (lost update problem) due to missing version vector checks.",
    tryItFriction: "Demonstrate live network failure: drag a task to 'Done', simulate a dropped WebSocket connection, and observe the card cleanly animate back to its origin column with an informative toast.",
    socraticHints: [
      "How do we animate the card back to its old position on rollback?",
      "Capture the original column and index in the `onMutate` context snapshot.",
      "In `onError`, restore the snapshot state, triggering a smooth layout transition back to the source column."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 8 defense, User A drags Task #10 to 'In Progress'. At the exact same millisecond, User B deletes Task #10 on another machine. User A's optimistic mutation receives a 404 Not Found from the server. How must your architecture respond?",
      options: [
        "Crash User A's browser.",
        "Rollback the optimistic drag, remove Task #10 from User A's local store, and display a notification: 'Task #10 was deleted by another user'.",
        "Re-create Task #10 on the server.",
        "Freeze the board."
      ],
      answerIdx: 1,
      debrief: "Conflict resolution in real-time apps must gracefully handle deleted resources: roll back the local speculative change, synchronize the local store to reflect the remote deletion, and inform the user without breaking board layout."
    },
    quests: [
      { id: "react-m2-d45-q1", name: "Milestone 8 Collaborative State Architecture Specification", type: "concept", desc: "Design the multi-user synchronization protocol, Zustand slice model, and optimistic rollback flow." },
      { id: "react-m2-d45-q2", name: "Detective Lab: The Desynchronized Column State Glitch", type: "detective", desc: "Fix an issue where rapid dragging caused card ordering indices to drift out of sync with backend database orders." },
      { id: "react-m2-d45-q3", name: "Mastery Assignment: Collaborative Kanban Board with Optimistic Rollbacks", type: "assignment", desc: "Deliver the full task board with drag-and-drop, WebSocket live broadcasts, optimistic updates, and conflict resolution." },
      { id: "react-m2-d45-q4", name: "Milestone 8 Defense: Distributed State Synchronization & Conflict Resolution Viva", type: "detective", desc: "Defend your optimistic mutation contracts, rollback mechanics, and WebSocket recovery before Senior Architects." }
    ]
  },

  // ── BLOCK 10: React Server Components (RSC) & Streaming SSR (Days 46–50) ──────
  {
    day: 46,
    month: 2,
    blockNum: 10,
    title: "SSR Foundations: HTML Hydration Mismatch Pitfalls & Server vs Client Component Boundaries",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (SSR Mechanics & Hydration Mismatches)",
    spokenGoal: "Master Server-Side Rendering (SSR) and Hydration: Understand how Node.js renders React components to an HTML string (`renderToString`), how the browser mounts JavaScript on top of static HTML (Hydration), and why hydration mismatches cause visual flashes and performance penalties.",
    conceptInvariant: "Hydration requires the initial client-rendered Virtual DOM tree to match the server-generated HTML EXACTLY. Any discrepancy (e.g. rendering `new Date().toLocaleTimeString()` or `window.innerWidth`) causes a Hydration Mismatch error, forcing React to discard and recreate the mismatched DOM nodes.",
    failureMode: "Rendering `typeof window !== 'undefined'` inside a component render body: on the server it renders false, on the client it renders true, triggering a severe React Hydration Mismatch warning.",
    tryItFriction: "Isolate a hydration mismatch caused by server vs client timezone differences, and fix it using a `useEffect` two-pass rendering pattern or a suppressHydrationWarning attribute.",
    socraticHints: [
      "Why did the browser console scream: 'Text content does not match server-rendered HTML'?",
      "The server rendered the date in UTC, but the client browser rendered it in local time! The text didn't match during hydration.",
      "Defer client-only rendering until after mount using a `hasMounted` state set in `useEffect`."
    ],
    situationalPuzzle: {
      scenario: "An e-commerce homepage renders a 'Welcome back, John' greeting on the server using a cookie. A user on a public CDN cache receives John's cached HTML. What critical security and architecture failure occurred?",
      options: [
        "The CDN broke.",
        "Personalized user state was cached at a public shared CDN edge instead of using private cache-control headers or deferring personalized rendering to client hydration.",
        "John hacked the server.",
        "React Server Components are broken."
      ],
      answerIdx: 1,
      debrief: "Pages containing personalized user data must NEVER be cached by public shared CDNs. Personalized content must either be served with `Cache-Control: private`, streamed via dynamic SSR, or fetched on the client after hydration."
    },
    quests: [
      { id: "react-m2-d46-q1", name: "The Server-Side Rendering & Hydration Timeline", type: "concept", desc: "Deconstruct the full pipeline: Server renderToString -> HTML Response -> Browser Paints HTML -> JS Bundle Loads -> hydrateRoot -> Interactive." },
      { id: "react-m2-d46-q2", name: "Detective Lab: The Timezone Hydration Mismatch Crash", type: "detective", desc: "Fix an e-commerce order confirmation page that crashed during hydration due to client-side date formatting." },
      { id: "react-m2-d46-q3", name: "Mastery Assignment: Safe Client-Only Hydration Boundary Component", type: "assignment", desc: "Implement a reusable `<ClientOnly>` boundary that guarantees zero hydration mismatches for browser-only APIs." },
      { id: "react-m2-d46-q4", name: "Staff Interview Lab: The Real CPU Cost of Full-Page Hydration", type: "detective", desc: "Analyze why traditional SSR hydrates the entire page at once, creating a 'Uncanny Valley' where UI looks ready but doesn't respond." }
    ]
  },
  {
    day: 47,
    month: 2,
    blockNum: 10,
    title: "React Server Components (RSC) Anatomy: Zero-Bundle Server Components & The 'use client' Directive",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (RSC Mental Model & Zero-Bundle Libraries)",
    spokenGoal: "Master React Server Components (RSC): Understand how RSC fundamentally differs from classic SSR, why Server Components NEVER send their JavaScript code to the browser (Zero-Bundle Size), and how the `'use client'` directive marks entry points for interactive subtrees.",
    conceptInvariant: "Server Components execute ONLY on the server and are NEVER downloaded to the client browser. You can directly access databases, file systems, and heavy libraries (e.g. 100KB markdown parsers) inside Server Components with 0 KB added to the client JavaScript bundle.",
    failureMode: "Adding `'use client'` at the top of every file out of habit, accidentally turning the entire application back into a heavy client-side bundle and losing all RSC performance benefits.",
    tryItFriction: "Build a Server Component that imports a heavy 80KB syntax highlighter and queries a database directly, proving via bundle inspection that 0 KB of that library enters the client bundle.",
    socraticHints: [
      "Does adding `'use client'` mean the component runs ONLY on the client?",
      "NO! Client components STILL render on the server during the initial SSR pass! `'use client'` simply marks the boundary where JavaScript must be sent to the browser for interactivity.",
      "Server Components stay on the server forever; Client Components render on both server and client."
    ],
    situationalPuzzle: {
      scenario: "A developer writes a Server Component: `export default async function ProductPage({ id }) { const product = await db.query(...); const [likes, setLikes] = useState(0); return ... }`. The compiler throws an error. Why can't Server Components use `useState` or `useEffect`?",
      options: [
        "Async functions cannot use hooks.",
        "Server Components execute only once on the server to produce static UI descriptors. They do not run in a browser runtime, so interactive state and lifecycle hooks cannot exist in them.",
        "The database query blocked the hook.",
        "React hasn't implemented hooks on the server yet."
      ],
      answerIdx: 1,
      debrief: "Server Components execute once on the server to produce a stream of UI descriptors. They do not participate in client-side re-render lifecycles, so interactive hooks (`useState`, `useEffect`) are prohibited and belong in `'use client'` leaves."
    },
    quests: [
      { id: "react-m2-d47-q1", name: "The Server Component vs Client Component Topology", type: "concept", desc: "Map the boundaries: Server Components can import Client Components, but Client Components CANNOT import Server Components directly." },
      { id: "react-m2-d47-q2", name: "Detective Lab: The Leaked Server Secret Investigation", type: "detective", desc: "Isolate a security leak where an API private key was accidentally exposed because a server file was imported into a client component." },
      { id: "react-m2-d47-q3", name: "Mastery Assignment: Zero-Bundle Markdown Documentation Portal", type: "assignment", desc: "Build a high-performance documentation portal rendering complex Markdown, syntax highlighting, and SQL queries with zero client JS." },
      { id: "react-m2-d47-q4", name: "Staff Interview Lab: RSC vs SSR Architectural Comparison", type: "detective", desc: "Defend the core distinction: SSR sends HTML + Full JS; RSC sends Streamed UI Descriptors + Only Client Component JS." }
    ]
  },
  {
    day: 48,
    month: 2,
    blockNum: 10,
    title: "Streaming SSR with Node.js: renderToPipeableStream, Chunked HTML & Selective Hydration",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Streaming Architecture & Selective Hydration)",
    spokenGoal: "Master Streaming SSR with Node.js streams: Learn how `renderToPipeableStream` replaces blocking `renderToString`, how HTML shells stream immediately while slow data queries stream in later inside `<Suspense>` slots, and how Selective Hydration hydrates interactive parts before the whole page finishes.",
    conceptInvariant: "Streaming SSR breaks the all-or-nothing bottleneck of traditional SSR. The browser receives the initial HTML shell in 50ms (First Contentful Paint). Slow widgets wrapped in `<Suspense>` stream in as inline `<template>` replacements as soon as their backend promises resolve.",
    failureMode: "Wrapping an entire page in a single synchronous data fetch: a 2-second database query blocks the ENTIRE HTTP response, leaving users staring at a blank white screen for 2 full seconds.",
    tryItFriction: "Configure a Node.js Express server with `renderToPipeableStream`, stream an instant layout shell, and stream in a delayed 1.5-second product review section without blocking initial HTML delivery.",
    socraticHints: [
      "Why did the old `renderToString` hurt Time to First Byte (TTFB)?",
      "Because `renderToString` cannot start sending ANY HTML until the SLOWEST database query on the page finishes!",
      "`renderToPipeableStream` sends the HTML header and layout immediately, streaming slow components as they finish."
    ],
    situationalPuzzle: {
      scenario: "A streaming page has two Suspense sections: 'Comments' (takes 3s) and 'Sidebar' (takes 100ms). The user clicks a button in the Sidebar while Comments are STILL loading. Can the user interact with the Sidebar?",
      options: [
        "No, the page is locked until Comments finish.",
        "Yes! Selective Hydration: React prioritizes hydrating the component the user clicked on, making it interactive immediately while Comments continue streaming in the background.",
        "The browser cancels the Comments stream.",
        "It throws a hydration error."
      ],
      answerIdx: 1,
      debrief: "Selective Hydration allows React to hydrate chunks of HTML as soon as they arrive, without waiting for other Suspense boundaries. If a user clicks on an unhydrated piece, React prioritizes hydrating that specific subtree immediately."
    },
    quests: [
      { id: "react-m2-d48-q1", name: "The renderToPipeableStream Event Lifecycle", type: "concept", desc: "Trace onShellReady, onShellError, onAllReady, and pipe(res) for SEO crawlers versus human browser streaming." },
      { id: "react-m2-d48-q2", name: "Detective Lab: The TTFB Blocking Query Outage", type: "detective", desc: "Refactor a monolithic SSR dashboard where a slow analytics query delayed TTFB from 60ms to 2,400ms." },
      { id: "react-m2-d48-q3", name: "Mastery Assignment: Full-Stack Streaming SSR Server from Scratch", type: "assignment", desc: "Build an Express/Node.js streaming server with renderToPipeableStream, error boundaries, and crawler fallbacks." },
      { id: "react-m2-d48-q4", name: "Staff Interview Lab: Selective Hydration Priority Queues", type: "detective", desc: "Explain how React detects user click events on unhydrated HTML and reprioritizes its hydration queue." }
    ]
  },
  {
    day: 49,
    month: 2,
    blockNum: 10,
    title: "The RSC Wire Protocol: Decoding JSON Stream Payloads ($L, $S, Component Slots)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (RSC Wire Protocol & Payload Internals)",
    spokenGoal: "Deconstruct the React Server Components Wire Format: Learn how React serializes server component trees into a compact text stream (`0:[\"$\",\"div\",null,{\"children\":...}]`), how client component references (`$L`) are serialized, and how the client reconstructs the Virtual DOM without full reloads.",
    conceptInvariant: "The RSC wire protocol is a streaming JSON-like format. Server components serialize as virtual DOM element tuples (`[\"$\",\"type\",key,props]`). Client components serialize as module references (`$L1`). When state changes on the server, React streams replacement tuples without touching client component state.",
    failureMode: "Assuming Server Components return HTML strings: RSC returns a structured Virtual DOM protocol stream, which is why client component state is preserved during server-side re-renders.",
    tryItFriction: "Inspect the raw network response of a Next.js / RSC server action or navigation, parse the wire format lines (`$L`, `$S`), and decode how client component slots are passed as props.",
    socraticHints: [
      "Why didn't typing in an input reset when the parent Server Component re-fetched data?",
      "Because RSC streams Virtual DOM element descriptions, not raw HTML! React reconciles the stream into the existing client tree, preserving active input focus and state.",
      "Raw HTML replacement would destroy the DOM node and wipe input focus; RSC reconciliation preserves it."
    ],
    situationalPuzzle: {
      scenario: "An L5 frontend systems interview asks: 'If a Server Component passes another Server Component as a child to a Client Component (`<ClientWrapper><ServerChild /></ClientWrapper>`), does ServerChild become a Client Component?'",
      options: [
        "Yes, all children of a Client Component are converted into Client Components.",
        "No! ServerChild executes on the server. Its rendered output (an element descriptor) is passed as the `children` prop into ClientWrapper, keeping ServerChild completely off the client bundle.",
        "It throws a compilation error.",
        "It executes twice."
      ],
      answerIdx: 1,
      debrief: "Passing Server Components as `children` (slots) to Client Components is the core architectural pattern of RSC. The server component executes on the server, and its rendered virtual DOM result is passed as an immutable prop into the client container."
    },
    quests: [
      { id: "react-m2-d49-q1", name: "The RSC Wire Format Grammar Specification", type: "concept", desc: "Decode lines in the RSC stream: Module References ($L), Suspense Outlets ($S), Server Element Tuples ($), and Error Payloads." },
      { id: "react-m2-d49-q2", name: "Detective Lab: De-serializable Prop Serialization Failure", type: "detective", desc: "Diagnose an RSC error: 'Functions cannot be passed directly to Client Components unless you use Server Actions'." },
      { id: "react-m2-d49-q3", name: "Mastery Assignment: Custom RSC Stream Parser & Virtual DOM Reconstructor", type: "assignment", desc: "Write a pure TypeScript parser that consumes a raw RSC text stream and builds a live React Element tree in memory." },
      { id: "react-m2-d49-q4", name: "Staff Interview Lab: Preserving Client State Across Server Navigations", type: "detective", desc: "Explain the reconciliation guarantees that allow users to maintain video playback while navigating pages with RSC." }
    ]
  },
  {
    day: 50,
    month: 2,
    blockNum: 10,
    title: "Milestone 9: Full-Stack Streaming Blog Engine with RSC, Server Actions & Selective Hydration",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (RSC & Streaming Architecture)",
    spokenGoal: "Build and defend Milestone 9: A full-stack publishing engine featuring React Server Components, zero-bundle markdown rendering, Server Actions with progressive enhancement, streaming comments with Suspense, and Selective Hydration.",
    conceptInvariant: "Modern full-stack React systems must maximize server execution for data-heavy and library-heavy operations while isolating client components strictly to interactive leaf nodes.",
    failureMode: "Allowing a Server Action form submission to fail when JavaScript is disabled or still loading on slow 3G networks.",
    tryItFriction: "Implement Server Actions with progressive enhancement: assert that the comment form submits successfully both with JavaScript enabled (AJAX) and with JavaScript disabled (native POST).",
    socraticHints: [
      "How do Server Actions achieve progressive enhancement?",
      "Use native HTML forms: `<form action={createComment}>`. If JS hasn't loaded yet, the browser executes a native HTTP POST!",
      "When JS hydrates, React intercepts the form submission and runs the action via fetch without a full page reload."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 9 defense, the evaluator inspects your bundle analyzer report. The entire client JavaScript bundle for the article page is only 22KB, despite rendering 500 lines of syntax-highlighted code and complex math equations. How did your architecture achieve this?",
      options: [
        "You compressed the JavaScript using zip.",
        "React Server Components: The markdown parser, Prism syntax highlighter, and KaTeX math engine executed 100% on the server, streaming pre-rendered virtual DOM nodes to the browser with zero parser libraries in the client bundle.",
        "The browser already had the libraries cached.",
        "You used an iframe."
      ],
      answerIdx: 1,
      debrief: "This demonstrates the revolutionary value of React Server Components: heavy computational libraries that only produce visual output (markdown parsers, syntax highlighters) stay on the server, shrinking client bundle sizes by 90%+."
    },
    quests: [
      { id: "react-m2-d50-q1", name: "Milestone 9 Full-Stack System Architecture Specification", type: "concept", desc: "Design the Server Component layout, Client Component leaves, Server Action mutations, and Streaming Suspense tree." },
      { id: "react-m2-d50-q2", name: "Detective Lab: The Accidental Client Bundle Leak", type: "detective", desc: "Isolate a file where an unneeded 'use client' directive dragged a 120KB syntax highlighter into the client bundle." },
      { id: "react-m2-d50-q3", name: "Mastery Assignment: Full-Stack Streaming RSC Publishing Engine", type: "assignment", desc: "Deliver the complete publishing application with streaming comments, zero-bundle markdown, and Server Actions." },
      { id: "react-m2-d50-q4", name: "Milestone 9 Defense: Server Components vs Client Hydration Viva", type: "detective", desc: "Defend your server boundaries, streaming waterfalls, and security sanitization before Senior Cloud Architects." }
    ]
  },

  // ── BLOCK 11: Advanced Browser Performance & DOM Virtualization (Days 51–55) ──
  {
    day: 51,
    month: 2,
    blockNum: 11,
    title: "Browser Rendering Pipeline: Reflow (Layout), Repaint & Composite Layers (GPU Promotion)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Compositor Architecture & GPU Layers)",
    spokenGoal: "Master the browser compositor and GPU acceleration: Learn how the browser splits pages into layers, why animating `transform` and `opacity` runs on the GPU compositor thread without touching the main thread, and how to avoid layout thrashing.",
    conceptInvariant: "The browser pipeline has 3 tiers: Layout (expensive, main thread) -> Paint (medium, rasterization) -> Composite (ultra-fast, GPU thread). Animating `left` or `top` triggers layout; animating `transform: translate3d()` runs directly on the GPU compositor thread, maintaining 60 FPS even when the JS main thread is busy.",
    failureMode: "Animating a modal drawer using `style={{ top: currentY }}`: every animation frame forces layout recalculations, causing visible jank and stutter on mobile devices.",
    tryItFriction: "Profile an animation in Chrome DevTools: convert a `top`/`left` animation into `transform: translate3d(x, y, 0)` and verify that Paint and Layout count drops to 0 during motion.",
    socraticHints: [
      "Why does animating `transform` feel smoother than animating `top`?",
      "Because `transform` does not change geometry! The browser compositor thread handles it directly on the GPU without recalculating layout.",
      "Promote elements to their own composite layer using `will-change: transform` or `transform: translateZ(0)`."
    ],
    situationalPuzzle: {
      scenario: "An engineer writes a loop: `cards.forEach(card => { const height = card.offsetHeight; card.style.height = (height + 10) + 'px'; })`. The page stutters horribly. What performance anti-pattern occurred?",
      options: [
        "Memory leak.",
        "Forced Synchronous Layout (Layout Thrashing): Alternating between reading geometric properties (`offsetHeight`) and writing styles (`style.height`) forces the browser into a synchronous layout recalculation on EVERY single iteration.",
        "The CSS file was too large.",
        "The browser compositor crashed."
      ],
      answerIdx: 1,
      debrief: "Layout Thrashing occurs when code alternates between reading layout geometry (which flushes pending writes) and writing new styles. Batch all layout reads first, then batch all style writes to allow a single layout calculation."
    },
    quests: [
      { id: "react-m2-d51-q1", name: "The Browser Layer Compositor Architecture", type: "concept", desc: "Trace how the browser compositor creates GPU texture layers and composites them via Direct3D/Metal/Vulkan." },
      { id: "react-m2-d51-q2", name: "Detective Lab: The Layout Thrashing Animation Stutter", type: "detective", desc: "Profile a laggy drag-and-drop animation and eliminate 60 forced synchronous reflows per second." },
      { id: "react-m2-d51-q3", name: "Mastery Assignment: 120 FPS GPU-Accelerated Gesture Sheet", type: "assignment", desc: "Build a high-performance bottom sheet using transform and opacity that maintains 120 FPS under CPU load." },
      { id: "react-m2-d51-q4", name: "Staff Interview Lab: The Memory Cost of Over-Promoting GPU Layers", type: "detective", desc: "Analyze how applying `will-change: transform` indiscriminately consumes VRAM, leading to mobile browser tab crashes." }
    ]
  },
  {
    day: 52,
    month: 2,
    blockNum: 11,
    title: "DOM Virtualization Mechanics: Recycling 100,000 Table Rows with Windowing Math",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (DOM Virtualization & Windowing Algorithms)",
    spokenGoal: "Master DOM Virtualization from first principles: Learn why rendering 10,000 real DOM nodes crashes browser memory, and build an on-screen windowing engine that renders ONLY the ~20 visible items, dynamically swapping rows as the user scrolls.",
    conceptInvariant: "DOM Virtualization calculates visible item indices based on `scrollTop` and viewport height: `startIndex = Math.floor(scrollTop / itemHeight)` and `endIndex = startIndex + visibleCount`. An outer spacer container maintains total scroll height while an inner container shifts visible items using CSS transforms.",
    failureMode: "Rendering 50,000 table rows directly into the DOM: the browser allocates hundreds of megabytes of C++ memory for DOM nodes, freezing scrolling and crashing low-memory mobile devices.",
    tryItFriction: "Build a pure TypeScript virtualization windowing calculator: given a total count of 100,000 items and a scroll position of 4,500px, calculate the exact `startIndex`, `endIndex`, and translateY offset in O(1) time.",
    socraticHints: [
      "How does the scrollbar look realistic if we only render 20 items?",
      "The outer container has a height of `totalCount * itemHeight` (e.g. 100,000 * 50px = 5,000,000px)!",
      "The browser scrollbar reflects the total 5,000,000px height, while you only mount 20 DOM nodes in the visible viewport."
    ],
    situationalPuzzle: {
      scenario: "A virtualized list performs smoothly with fixed item heights (50px). However, when user comments have dynamic variable heights (some 30px, some 250px), the list scrollbar begins jumping erratically. How do production virtualizers (like TanStack Virtual) solve variable height scrolling?",
      options: [
        "Force all comments to be 50px with CSS overflow: hidden.",
        "Dynamic Measurement Cache with ResizeObserver: Estimate item heights initially, measure real DOM heights using a ResizeObserver after rendering, and update a binary search prefix-sum array to keep scroll offsets stable.",
        "Disable virtualization for variable heights.",
        "Re-render the whole list on scroll."
      ],
      answerIdx: 1,
      debrief: "Variable-height virtualization uses dynamic measurement caching. Unrendered rows are estimated; as rows enter the viewport, a ResizeObserver measures their exact height, updating a prefix-sum offset cache to prevent scrollbar jumping."
    },
    quests: [
      { id: "react-m2-d52-q1", name: "The Virtual Windowing Geometric Formula", type: "concept", desc: "Derive the mathematical formulas: startIndex, endIndex, overscan buffer padding, and top translateY positioning." },
      { id: "react-m2-d52-q2", name: "Detective Lab: The Blank Screen Fast Scroll Bug", type: "detective", desc: "Fix an issue where fast scrolling caused a blank white flash by adding dynamic overscan buffer thresholds." },
      { id: "react-m2-d52-q3", name: "Mastery Assignment: Custom Virtualized Table Engine (100,000 Rows)", type: "assignment", desc: "Engineer a high-throughput virtualized data grid from scratch in TypeScript supporting keyboard navigation and fixed headers." },
      { id: "react-m2-d52-q4", name: "Staff Interview Lab: Virtual DOM vs DOM Virtualization", type: "detective", desc: "Clarify the common candidate confusion: Virtual DOM is an in-memory diffing tree; DOM Virtualization is rendering only viewport items." }
    ]
  },
  {
    day: 53,
    month: 2,
    blockNum: 11,
    title: "Memory Leak Detection in React: Detached DOM Nodes, Closure Retainers & Chrome DevTools Profiling",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Memory Profiling & Retainer Trees)",
    spokenGoal: "Master memory leak detection in enterprise single-page applications: Learn how detached DOM nodes, uncleared intervals, and closure retainers prevent garbage collection, and master Chrome DevTools Heap Snapshots to find the exact retainers keeping leaked objects alive.",
    conceptInvariant: "A memory leak in JavaScript occurs when unused objects remain reachable from a GC Root (such as window event listeners, global caches, or active timers). In React, an uncleared event listener in a custom hook retains the entire component's closure scope in memory forever.",
    failureMode: "Adding a `window.addEventListener('resize', handleResize)` without returning a cleanup function: every time the component unmounts and remounts, an additional closure is retained in memory, leaking megabytes of RAM.",
    tryItFriction: "Take two Chrome DevTools Heap Snapshots before and after mounting/unmounting a leaky modal dialog, filter by 'Detached HTMLElement', and trace the retainer tree to the culprit closure.",
    socraticHints: [
      "What is a 'Detached DOM Node' in a heap snapshot?",
      "It is a DOM element that was removed from the web page, but a JavaScript variable or event listener is STILL holding a reference to it!",
      "Because JS holds a reference, the browser's C++ engine cannot free the memory for that DOM element."
    ],
    situationalPuzzle: {
      scenario: "An enterprise trading dashboard's memory usage grows from 100MB to 1.8GB over an 8-hour workday until the Chrome tab crashes with 'Out of Memory'. Heap snapshot analysis reveals 40,000 detached `<tr>` elements retained by an array named `historyLog`. What caused this?",
      options: [
        "The browser has a memory limit.",
        "An unbounded global array `historyLog` kept pushing completed order objects containing references to real DOM elements without pruning old entries.",
        "React Fiber has a memory leak.",
        "The computer needs more RAM."
      ],
      answerIdx: 1,
      debrief: "Unbounded in-memory arrays or caches that grow indefinitely are the #1 cause of long-session memory leaks. Storing references to DOM nodes or large objects in global arrays prevents the Garbage Collector from freeing them."
    },
    quests: [
      { id: "react-m2-d53-q1", name: "The V8 Garbage Collector Mark-and-Sweep Anatomy", type: "concept", desc: "Trace GC Roots, Reachability graphs, Generational hypothesis (Scavenge vs Mark-Sweep-Compact), and heap spaces." },
      { id: "react-m2-d53-q2", name: "Detective Lab: The Detached DOM Node Heap Snapshot Investigation", type: "detective", desc: "Use Chrome DevTools 3-snapshot technique to locate an uncleared event listener leaking 200MB of detached elements." },
      { id: "react-m2-d53-q3", name: "Mastery Assignment: Leak-Proof Resource Lifecycle Manager", type: "assignment", desc: "Build a memory-monitored application wrapper using FinalizationRegistry and WeakRef to detect leaks in development." },
      { id: "react-m2-d53-q4", name: "Staff Interview Lab: Analyzing Complex Retainer Trees", type: "detective", desc: "Walk through a real-world Chrome DevTools heap retainer tree and identify the shortest path from GC Root to leaked target." }
    ]
  },
  {
    day: 54,
    month: 2,
    blockNum: 11,
    title: "Web Workers in React: Offloading Heavy Cryptography & Data Crunching to Background Threads",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Web Workers & Multi-Threaded JavaScript)",
    spokenGoal: "Master multi-threaded web engineering with Web Workers: Learn how to offload heavy CPU-intensive tasks (image processing, CSV parsing, RSA encryption, sorting 1,000,000 records) to background threads, communicating via structured clone message passing without freezing the UI thread.",
    conceptInvariant: "The browser UI runs on a single main thread. No amount of React concurrent scheduling can prevent UI freezes if a single CPU calculation takes 500ms synchronously. Web Workers run on separate OS threads with dedicated memory spaces, communicating via `postMessage()`.",
    failureMode: "Parsing a 50MB CSV file or hashing passwords directly on the main thread, causing complete UI freeze, cursor lockup, and audio stutter for several seconds.",
    tryItFriction: "Spin up an inline Web Worker using `new Worker(new URL('./worker.ts', import.meta.url))`, offload an expensive prime number generator to it, and prove that text inputs remain 100% responsive at 60 FPS during calculation.",
    socraticHints: [
      "Can a Web Worker manipulate `document.getElementById` or call `useState`?",
      "NO! Web Workers have ZERO access to the DOM, window, or React component tree!",
      "They run pure data calculations and communicate purely by sending and receiving messages via `postMessage`."
    ],
    situationalPuzzle: {
      scenario: "An engineer transfers a 100MB ArrayBuffer to a Web Worker via `worker.postMessage(buffer)`. The postMessage call takes 120ms and drops frames on the main thread. How do you transfer large binary buffers in 0 milliseconds?",
      options: [
        "Compress the buffer with gzip first.",
        "Transferable Objects: Pass the buffer as the second transfer parameter `worker.postMessage(buffer, [buffer])`. Memory ownership is transferred instantly with zero copying overhead.",
        "Store the buffer in a cookie.",
        "Split it into 1,000 small strings."
      ],
      answerIdx: 1,
      debrief: "By default, postMessage uses the structured clone algorithm which deep-copies memory. Using Transferable Objects transfers memory ownership of ArrayBuffers to the worker in O(1) time without copying, taking 0ms on the main thread."
    },
    quests: [
      { id: "react-m2-d54-q1", name: "The Web Worker Threading & Message Topology", type: "concept", desc: "Map main thread vs worker thread memory boundaries, event loops, and structured clone serialization." },
      { id: "react-m2-d54-q2", name: "Detective Lab: The Main-Thread CSV Parsing Lockup", type: "detective", desc: "Refactor a financial dashboard where parsing 200,000 transactions froze user navigation into a non-blocking worker thread." },
      { id: "react-m2-d54-q3", name: "Mastery Assignment: Production useWebWorker Hook with Comlink", type: "assignment", desc: "Implement an ergonomic React hook that wraps Web Workers into type-safe asynchronous RPC functions." },
      { id: "react-m2-d54-q4", name: "Staff Interview Lab: Web Workers vs WebAssembly (Wasm) vs SharedArrayBuffer", type: "detective", desc: "Evaluate high-performance computing trade-offs: when to use JS Workers vs compiled Rust/C++ Wasm binaries." }
    ]
  },
  {
    day: 55,
    month: 2,
    blockNum: 11,
    title: "Milestone 10: High-Frequency Financial Matrix (10,000 Live Rows @ 60 FPS with DOM Virtualization)",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Extreme Performance & Virtualization)",
    spokenGoal: "Build and defend Milestone 10: A high-frequency financial order book grid updating 1,000 rows per second across 10,000 total records, featuring custom DOM virtualization, Web Worker sorting, Canvas sparklines, and strict 60 FPS rendering under heavy telemetry load.",
    conceptInvariant: "Extreme frontend performance requires combining all optimization pillars: DOM virtualization to cap node count, Web Workers for background sort/filter math, and GPU compositor layers for visual state flashes.",
    failureMode: "Triggering a full React component tree re-render on every incoming WebSocket price tick, overwhelming the JS event loop and dropping frames.",
    tryItFriction: "Stream 100 price updates per second into the virtualized matrix, asserting that the Chrome Performance Profiler shows 60 FPS frame rates and zero Long Tasks (>50ms).",
    socraticHints: [
      "How do we update a changing stock price cell without re-rendering the entire row?",
      "Isolate the price cell into its own memoized component subscribing to granular updates, or mutate the specific DOM text node directly via ref for ultra-low latency.",
      "Keep the virtualized row container stable so only the changing number updates."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 10 defense, the evaluator injects a simulated market crash: 10,000 price updates arrive per second. The UI begins stuttering. What technique limits rendering frequency without dropping data?",
      options: [
        "Throw away 90% of the price updates.",
        "RequestAnimationFrame Batching (Render Throttling): Buffer all incoming WebSocket updates in a mutable queue; on every rAF tick (every 16ms), flush the accumulated changes into state once, capping renders at 60Hz.",
        "Add a 1-second sleep in the WebSocket handler.",
        "Close the WebSocket."
      ],
      answerIdx: 1,
      debrief: "Human displays only refresh at 60Hz or 120Hz. Rendering faster than the screen's refresh rate is pure waste. Buffering incoming telemetry in a mutable queue and flushing once per requestAnimationFrame caps render cycles to the display refresh rate."
    },
    quests: [
      { id: "react-m2-d55-q1", name: "Milestone 10 High-Frequency Matrix Architecture", type: "concept", desc: "Design the high-frequency telemetry ingestion buffer, virtualization window, and worker sort pipeline." },
      { id: "react-m2-d55-q2", name: "Detective Lab: The WebSocket Flooding Frame-Drop Incident", type: "detective", desc: "Fix an issue where 500 individual setState calls per second caused continuous 100% CPU lockup." },
      { id: "react-m2-d55-q3", name: "Mastery Assignment: Production 10,000-Row Real-Time Trading Terminal", type: "assignment", desc: "Deliver the complete virtualized financial matrix with Web Worker multi-column sorting and rAF telemetry throttling." },
      { id: "react-m2-d55-q4", name: "Milestone 10 Defense: 60 FPS Telemetry & Profiler Benchmark Viva", type: "detective", desc: "Defend your memory footprint, virtualization math, and frame rate stability under 5,000 tx/sec stress tests." }
    ]
  },

  // ── BLOCK 12: Enterprise Production Engineering & Master Capstone (Days 56–60)
  {
    day: 56,
    month: 2,
    blockNum: 12,
    title: "Micro-Frontends & Module Federation: Sharing Remote Components Across Distributed Builds",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Micro-Frontends & Module Federation)",
    spokenGoal: "Master enterprise Micro-Frontends with Webpack/Vite Module Federation: Learn how massive enterprise organizations break monolithic frontends into independent deployable applications, sharing remote components and singleton dependencies (React, React-DOM) at runtime.",
    conceptInvariant: "Module Federation allows an application to dynamically load code from another independent build at runtime. Shared libraries (like `react` and `react-dom`) MUST be configured as `singleton: true` to prevent multiple conflicting copies of the React engine running in the same browser window.",
    failureMode: "Loading a remote micro-frontend that bundles its own private copy of React: multiple React instances conflict, throwing 'Invalid Hook Call: Hooks can only be called inside the body of a function component'.",
    tryItFriction: "Configure a Module Federation host and remote in Vite/Webpack: share a navigation bar component across two independent development ports with singleton React sharing.",
    socraticHints: [
      "Why did the remote component crash with 'Invalid hook call' when loaded into the host app?",
      "Both the host and the remote loaded their OWN copies of React! React hooks require a single shared dispatcher.",
      "Configure `shared: { react: { singleton: true, requiredVersion: '^18.0.0' } }` in the federation config."
    ],
    situationalPuzzle: {
      scenario: "A fintech bank splits its portal into 3 micro-frontends: Dashboard, Payments, and Profile. Payments deploys a critical bug fix to production at 2:00 PM. Does the host dashboard need to be recompiled and redeployed?",
      options: [
        "Yes, all micro-frontends must be redeployed together.",
        "No! The host loads the Payments remote bundle dynamically at runtime via `remoteEntry.js`. The host automatically consumes the updated code on the next page refresh without redeployment.",
        "Micro-frontends can only be updated once per week.",
        "It requires a DNS change."
      ],
      answerIdx: 1,
      debrief: "The core value of Module Federation is autonomous deployment. Host applications fetch remoteEntry.js at runtime, allowing individual domain teams to deploy updates, patches, and features independently without coordinated monolithic releases."
    },
    quests: [
      { id: "react-m2-d56-q1", name: "The Module Federation Runtime Resolution Topology", type: "concept", desc: "Trace how container hosts fetch remoteEntry.js, initialize shared scope containers, and resolve chunk promises." },
      { id: "react-m2-d56-q2", name: "Detective Lab: The Dual React Instance Collision Crash", type: "detective", desc: "Diagnose and resolve an 'Invalid Hook Call' crash caused by mismatched React versions in a federated micro-app." },
      { id: "react-m2-d56-q3", name: "Mastery Assignment: Multi-Team Micro-Frontend Enterprise Portal", type: "assignment", desc: "Build an enterprise portal with dynamic remote loading, error boundary fallback isolation, and shared state." },
      { id: "react-m2-d56-q4", name: "Staff Interview Lab: Micro-Frontends vs Monoliths Architectural Debate", type: "detective", desc: "Defend when micro-frontends are an organizational necessity versus when they introduce catastrophic complexity." }
    ]
  },
  {
    day: 57,
    month: 2,
    blockNum: 12,
    title: "Core Web Vitals Optimization: INP (Interaction to Next Paint), LCP & CLS Debugging",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Core Web Vitals & Real User Monitoring)",
    spokenGoal: "Master Google Core Web Vitals: Learn the exact technical mechanics of INP (Interaction to Next Paint, replacing FID), LCP (Largest Contentful Paint), and CLS (Cumulative Layout Shift), and master how to audit, debug, and optimize them for high SEO rankings and user retention.",
    conceptInvariant: "INP measures the latency between user input (click, tap, keypress) and the next visible paint, encompassing input delay, processing time, and presentation delay. A good INP is sub-200ms. Long tasks (>50ms) on the main thread directly degrade INP scores.",
    failureMode: "A button click runs heavy validation and synchronous DOM calculations taking 350ms before showing a spinner: the browser INP score turns red (>200ms), damaging Google search ranking.",
    tryItFriction: "Audit a page with poor Core Web Vitals in Chrome DevTools: eliminate an unsized image causing Cumulative Layout Shift (CLS) and optimize an event handler to bring INP below 100ms.",
    socraticHints: [
      "Why did the page score poorly on Cumulative Layout Shift (CLS)?",
      "Images and banner ads were loaded without explicit `width` and `height` attributes! When they loaded, they pushed content down.",
      "Always set aspect-ratio or explicit width/height on images and reserve space for dynamic banners."
    ],
    situationalPuzzle: {
      scenario: "A high-traffic e-commerce store suffers an INP spike to 450ms on mobile devices when users tap 'Add to Cart'. Profiling reveals that 5 different third-party marketing tags attach synchronous click listeners to the window. How do you protect INP?",
      options: [
        "Delete all marketing tags.",
        "Yield to main thread before running analytics: Use `requestAnimationFrame` or `setTimeout(..., 0)` to allow the browser to paint the visual cart update BEFORE running heavy third-party tracking scripts.",
        "Upgrade user phones.",
        "Disable buttons on mobile."
      ],
      answerIdx: 1,
      debrief: "Presentation delay is the final phase of INP. Yielding the main thread to allow the browser to paint visual feedback (e.g. button active state or spinner) before executing secondary analytics keeps INP scores under the 200ms threshold."
    },
    quests: [
      { id: "react-m2-d57-q1", name: "The Core Web Vitals Metric Mathematics (INP, LCP, CLS)", type: "concept", desc: "Deconstruct the 75th percentile thresholds: LCP < 2.5s, INP < 200ms, CLS < 0.1, and browser observer APIs." },
      { id: "react-m2-d57-q2", name: "Detective Lab: The Red-Rated INP Mobile Checkout Incident", type: "detective", desc: "Diagnose an e-commerce checkout page whose INP was 600ms due to synchronous cart serialization on button tap." },
      { id: "react-m2-d57-q3", name: "Mastery Assignment: Real User Monitoring (RUM) Telemetry Ingestion", type: "assignment", desc: "Build an automated RUM performance reporter using the `web-vitals` library that beacons metrics to an analytics endpoint." },
      { id: "react-m2-d57-q4", name: "Staff Interview Lab: Optimizing LCP for Server-Rendered vs Client Apps", type: "detective", desc: "Defend strategies for LCP optimization: fetchpriority='high', font preloading, CDN caching, and inline critical CSS." }
    ]
  },
  {
    day: 58,
    month: 2,
    blockNum: 12,
    title: "Enterprise Security for React: XSS Prevention, CSP Directives & Sanitizing Dangerous HTML",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Frontend Security & XSS Mitigation)",
    spokenGoal: "Master enterprise frontend security: Learn how React automatically escapes strings to prevent Cross-Site Scripting (XSS), the severe dangers of `dangerouslySetInnerHTML`, how to sanitize user HTML using DOMPurify, and how to configure strict Content Security Policy (CSP) headers.",
    conceptInvariant: "React escapes all strings rendered in JSX by default (converting `<` to `&lt;`). However, `dangerouslySetInnerHTML`, `javascript:` URLs in `<a href>`, and unescaped SSR hydration payloads bypass this defense, exposing users to session hijacking and credential theft.",
    failureMode: "Rendering user-submitted markdown or comments using `<div dangerouslySetInnerHTML={{ __html: userComment }} />` without sanitization: an attacker injects `<img src=x onerror='stealCookies()'>` and steals user tokens.",
    tryItFriction: "Sanitize a malicious user string containing script injection vectors using `DOMPurify.sanitize(dirtyHtml, { USE_PROFILES: { html: true } })`, proving all script execution vectors are neutralized.",
    socraticHints: [
      "Can an attacker exploit an `<a href={userWebsite}>` tag if userWebsite is `javascript:alert(1)`?",
      "YES! React does NOT prevent `javascript:` pseudoprotocols in href attributes!",
      "Always validate and sanitize URL protocols, permitting only `http://` and `https://`."
    ],
    situationalPuzzle: {
      scenario: "A banking application renders rich customer messages. The security team audits the app and finds `dangerouslySetInnerHTML` in use. They demand a defense-in-depth security layer that prevents XSS even if a developer makes a mistake in code. What HTTP header must be deployed?",
      options: [
        "Cache-Control: private",
        "Content-Security-Policy (CSP): `default-src 'self'; script-src 'self' 'nonce-...'; object-src 'none';` which instructs the browser to refuse execution of any inline scripts or unapproved domains.",
        "Access-Control-Allow-Origin: *",
        "X-Powered-By: React"
      ],
      answerIdx: 1,
      debrief: "A strict Content Security Policy (CSP) is the ultimate defense-in-depth shield against XSS. Even if malicious HTML slips into the DOM via dangerouslySetInnerHTML, the browser refuses to execute any scripts lacking an authentic cryptographic nonce."
    },
    quests: [
      { id: "react-m2-d58-q1", name: "The Cross-Site Scripting (XSS) Attack Vectors in Modern Web", type: "concept", desc: "Analyze Stored XSS, Reflected XSS, DOM-based XSS, and how React's JSX compiler sanitizes string variables." },
      { id: "react-m2-d58-q2", name: "Detective Lab: The Malicious Markdown Profile Exploit", type: "detective", desc: "Isolate a vulnerability where user bios executed arbitrary JavaScript via crafted SVG onload image vectors." },
      { id: "react-m2-d58-q3", name: "Mastery Assignment: Enterprise HTML Sanitizer & Strict CSP Generator", type: "assignment", desc: "Implement a hardened HTML rendering pipeline using DOMPurify, strict URL protocol checkers, and CSP headers." },
      { id: "react-m2-d58-q4", name: "Staff Interview Lab: Defending Against Prototype Pollution & Supply Chain Attacks", type: "detective", desc: "Explain how Object.freeze, lockfile verification, and sandbox boundaries protect frontend apps from malicious npm packages." }
    ]
  },
  {
    day: 59,
    month: 2,
    blockNum: 12,
    title: "Production Observability: OpenTelemetry Tracing, Sentry Replay & Custom Performance Metrics",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Frontend Observability & Tracing)",
    spokenGoal: "Master enterprise frontend observability: Learn how to instrument production applications with distributed tracing (OpenTelemetry), session replay and crash reporting (Sentry), and track custom user timing marks using the browser's User Timing API.",
    conceptInvariant: "You cannot fix what you cannot measure. Production frontend observability requires correlating client-side user actions, component render times, and network HTTP fetch calls with distributed backend traces via `traceparent` headers.",
    failureMode: "Deploying an app with no error monitoring: a silent null-pointer bug on the checkout button prevents thousands of customers from buying products without generating a single alert in engineering chat.",
    tryItFriction: "Instrument a critical checkout flow using `performance.mark('checkout-start')` and `performance.measure('checkout-duration')`, logging the duration to a telemetry endpoint.",
    socraticHints: [
      "How does the backend trace connect to the frontend fetch request in distributed tracing?",
      "The frontend attaches a standard W3C `traceparent` header to outgoing fetch calls!",
      "The backend reads that trace ID, linking client clicks, frontend latency, and database queries into a single distributed flamegraph."
    ],
    situationalPuzzle: {
      scenario: "A customer reports: 'When I click pay, nothing happens.' Sentry shows zero JavaScript errors. How does Session Replay (Sentry Replay / LogRocket) allow engineers to diagnose the exact root cause within minutes?",
      options: [
        "It watches the user through their webcam.",
        "It records a privacy-sanitized DOM mutation timeline, network requests, and mouse clicks, allowing engineers to watch an exact video-like recreation of the user's screen and inspect console logs.",
        "It reads the user's browser history.",
        "It re-runs the transaction automatically."
      ],
      answerIdx: 1,
      debrief: "Session Replay tools capture sanitized DOM mutation mutations and user inputs, reconstructing the exact visual state and network sequence leading up to silent failures (like validation rejections) that don't trigger fatal exceptions."
    },
    quests: [
      { id: "react-m2-d59-q1", name: "The OpenTelemetry Distributed Tracing Protocol", type: "concept", desc: "Examine W3C TraceContext headers, span hierarchies, client-to-backend context propagation, and sampling rates." },
      { id: "react-m2-d59-q2", name: "Detective Lab: The Silent Checkout Failure Investigation", type: "detective", desc: "Use telemetry traces and session replays to diagnose an unhandled promise rejection that silently broke credit card submits." },
      { id: "react-m2-d59-q3", name: "Mastery Assignment: Full-Stack Frontend Observability SDK Integration", type: "assignment", desc: "Build an observability wrapper logging User Timing marks, error breadcrumbs, and network trace headers." },
      { id: "react-m2-d59-q4", name: "Staff Interview Lab: Privacy & PII Masking in Frontend Telemetry", type: "detective", desc: "Defend strategies for scrubbing Personally Identifiable Information (PII) before telemetry payloads leave user browsers." }
    ]
  },
  {
    day: 60,
    month: 2,
    blockNum: 12,
    title: "Month 2 Master Capstone Viva Gate: NexusCloud Real-Time Collaborative Workspace Live Defense",
    stageName: "Stage 3: Enterprise Capstone Defense",
    stageNum: 3,
    pedagogicalRole: "Month 2 Master Capstone Viva (Staff Level Systems Defense)",
    spokenGoal: "Defend your Month 2 Master Capstone before the Senior Staff Architect Review Board: `NexusCloud` — an enterprise real-time collaborative workspace featuring a collaborative canvas with multi-user presence, TanStack Query server caching, concurrent search via `useTransition`, zero-bundle React Server Components, virtualized document trees (10,000 nodes), and complete distributed tracing.",
    conceptInvariant: "Staff-level frontend engineering demands mastery across the entire vertical stack: from low-level browser render pipelines, fiber reconciler internals, and concurrent lane scheduling, to server component streams, distributed state synchronization, and rock-solid production telemetry.",
    failureMode: "Failing the live architectural viva by being unable to explain how fiber nodes are linked, how state tearing is prevented, or how the RSC wire format serializes component trees.",
    tryItFriction: "Demonstrate live systems defense: simulate 50 concurrent users editing documents over WebSockets, inspect the 60 FPS flamegraph, explain your memory allocation profiles, and answer deep architectural viva probes.",
    socraticHints: [
      "How would you explain the difference between Concurrent Mode time-slicing and Web Workers to an engineering VP?",
      "Concurrent Mode time-slicing keeps the main thread responsive by cooperatively yielding every 5ms, but it is STILL single-threaded.",
      "Web Workers run on separate OS threads entirely, providing true parallel multi-core execution for heavy data crunching."
    ],
    situationalPuzzle: {
      scenario: "During the Master Capstone Viva, the VP of Engineering asks: 'Your collaborative app has 50 users typing simultaneously. Why did you choose React Server Components for the document viewer, but Zustand with useSyncExternalStore for the live editor canvas?' How do you defend this architectural decision?",
      options: [
        "Because someone told you to use both.",
        "Separation of concerns based on reactivity requirements: The document viewer is data-heavy, needs zero client JavaScript bundle size, and benefits from streaming SSR. The canvas requires sub-16ms synchronous multi-user updates, optimistic local state, and micro-subscriptions that demand a client-side external store without tearing.",
        "Server Components don't work with text.",
        "Zustand is only for small applications."
      ],
      answerIdx: 1,
      debrief: "A Staff Engineer chooses technologies based on their fundamental trade-offs: RSC excels at zero-bundle data delivery and streaming SSR for read-heavy views, while external micro-stores (Zustand + uSES) excel at sub-frame, ultra-low-latency interactive canvas editing."
    },
    quests: [
      { id: "react-m2-d60-q1", name: "Master Capstone System Topology & Enterprise Architecture Specification", type: "concept", desc: "Present the complete enterprise architecture of NexusCloud: RSC layers, WebSocket mesh, Zustand stores, and virtual grids." },
      { id: "react-m2-d60-q2", name: "Detective Lab: Live High-Concurrency Multi-User Crash Simulation", type: "detective", desc: "Diagnose and resolve a simulated high-concurrency race condition causing document state desynchronization." },
      { id: "react-m2-d60-q3", name: "Mastery Assignment: Full NexusCloud Enterprise Workspace Codebase Delivery", type: "assignment", desc: "Deliver the production-grade NexusCloud codebase with 60 FPS benchmarks, full tests, and zero-bundle server components." },
      { id: "react-m2-d60-q4", name: "Month 2 Master Capstone Defense: Senior Staff Architect Board Examination", type: "detective", desc: "Defend your architecture, memory management, fiber internals, and Core Web Vitals before the Senior Staff Board." }
    ]
  }
];
