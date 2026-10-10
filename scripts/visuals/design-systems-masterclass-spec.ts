// scripts/visuals/design-systems-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for UI/UX Design Systems & Visual Frontend (course-design-systems)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, W3C DTCG Token Specs, and WCAG 2.2 AAA rubrics.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const DESIGN_SYSTEMS_MONTH_1_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 1: Design Tokens, Color Science & Typography Architecture (Days 1–5) ────────────────
  {
    day: 1,
    month: 1,
    blockNum: 1,
    title: "Design System Architecture, Anatomy of a Design Token & W3C DTCG Specification",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Design Tokens Foundations & W3C DTCG Format)",
    spokenGoal: "Deconstruct the foundational architecture of an enterprise design system: understand why UI primitives must decouple visual attributes into platform-agnostic design tokens according to the W3C Design Tokens Community Group specification.",
    conceptInvariant: "Token Hierarchy Invariant: A design token is an immutable key-value pair with a defined schema ($value, $type, $description). Raw values must never be consumed directly by UI components; components must reference semantic aliases that resolve to primitive global tokens.",
    failureMode: "Hardcoding raw hex values (`#2563eb`) and arbitrary pixel paddings (`padding: 13px`) across 200 components, making multi-theme switching, brand re-skinning, and accessibility contrast adjustments impossible without manual codebase rewrites.",
    tryItFriction: "Refactor a legacy CSS stylesheet with hardcoded hex colors and pixel values into a structured JSON token catalog conforming strictly to the W3C DTCG specification.",
    socraticHints: [
      "Why should a Button component never reference a raw color like `blue-500` directly?",
      "Because if the button is used in an error state or a secondary theme, `blue-500` loses its semantic meaning!",
      "Map `blue-500` (global token) -> `action-primary-background` (semantic token) -> `button-primary-bg` (component token)."
    ],
    situationalPuzzle: {
      scenario: "An enterprise SaaS platform rebrands from vibrant blue to deep forest green. A developer finds that 450 frontend components have `color: #0066cc` hardcoded in CSS files. Changing it globally breaks 30 information alerts that also used `#0066cc`. What architectural flaw caused this regression?",
      options: [
        "The developer used CSS instead of Sass.",
        "Lack of Semantic Token Indirection: Components consumed raw hex literals directly rather than aliased semantic tokens (`color.brand.primary` vs `color.feedback.info`), coupling brand aesthetics with functional UI states.",
        "The browser cached old CSS stylesheets.",
        "The marketing team chose the wrong hex code."
      ],
      answerIdx: 1,
      debrief: "Semantic design tokens create an essential indirection layer between global scales (palette) and intent (brand, action, surface, feedback). Without semantic aliases, global changes inevitably cause cross-domain visual regressions."
    },
    quests: [
      { id: "ds-m1-d01-q1", name: "W3C DTCG Token Specification Hierarchy", type: "concept", desc: "Diagram the 3-tier token architecture: Global (Primitive) -> Semantic (System) -> Component-Scoped tokens." },
      { id: "ds-m1-d01-q2", name: "Detective Lab: The Untokenized Legacy Stylesheet", type: "detective", desc: "Audit a legacy component repository, detect 150 hardcoded raw styles, and extract them into a W3C DTCG JSON token tree." },
      { id: "ds-m1-d01-q3", name: "Mastery Assignment: Schema-Validated Design Token Engine", type: "assignment", desc: "Build a TypeScript token parser that validates token JSON files against the W3C DTCG schema with Zod." },
      { id: "ds-m1-d01-q4", name: "Production Incident Lab: Catastrophic Rebrand Color Bleed", type: "detective", desc: "Debug an incident where a rebrand PR accidentally recolored all destructive danger buttons to green due to missing semantic separation." }
    ]
  },
  {
    day: 2,
    month: 1,
    blockNum: 1,
    title: "Perceptual Color Spaces (OKLCH, LCH, Display-P3 vs sRGB) & Contrast Math (WCAG 2.2 AA/AAA)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Color Physics, Gamut & Contrast Ratios)",
    spokenGoal: "Master color science for UI engineers: learn why the sRGB color space distorts perceptual lightness, how OKLCH guarantees uniform lightness curves across hues, and calculate mathematical contrast ratios conforming to WCAG 2.2 and APCA.",
    conceptInvariant: "Perceptual Uniformity Invariant: In the OKLCH color space, two colors with identical Lightness (L) values are perceived by the human visual cortex as having identical luminance regardless of Hue (H). sRGB fails this invariant because human eyes are more sensitive to green than blue.",
    failureMode: "Generating a 10-step palette in HSL where yellow at Lightness 50% appears blindingly bright while blue at Lightness 50% appears almost black, resulting in severe WCAG AA contrast failures on dark backgrounds.",
    tryItFriction: "Write an OKLCH palette generator function in TypeScript that produces 10 perceptually uniform tint/shade steps (50 to 950) that mathematically guarantee a 4.5:1 contrast ratio against black/white surfaces.",
    socraticHints: [
      "Why does `#ffff00` (yellow) have a much higher perceptual brightness than `#0000ff` (blue) even if both have 100% saturation?",
      "Because human retinal cone photoreceptors are predominantly sensitive to green and red wavelengths!",
      "Use OKLCH where L (lightness) represents true perceived brightness calibrated to human visual response."
    ],
    situationalPuzzle: {
      scenario: "A fintech dashboard automatically calculates light and dark theme palette shades using HSL (`hsl(var(--hue), 80%, 50%)`). The accessibility compliance test flags that orange alert badges pass WCAG AA (5.2:1 contrast), but cyan badges fail with only 2.8:1 contrast despite having the exact same lightness value (50%). Why did this happen?",
      options: [
        "Cyan has a longer wavelength than orange.",
        "HSL lightness is non-uniform; it does not model human perceptual luminance. In HSL, equal numerical lightness produces wildly disparate visual contrast across different hues.",
        "The test tool had a floating-point rounding bug.",
        "The screen display was not calibrated to D65 standard."
      ],
      answerIdx: 1,
      debrief: "HSL is a simple cylindrical geometry transform of sRGB and completely ignores human ocular sensitivity. Switching to OKLCH ensures that any two colors with identical L values have identical perceptual luminance and contrast behavior."
    },
    quests: [
      { id: "ds-m1-d02-q1", name: "Color Physics: sRGB vs Display-P3 vs OKLCH Gamut", type: "concept", desc: "Analyze the spectral sensitivity of human vision and compare color gamut boundaries and perceptual uniformity across color spaces." },
      { id: "ds-m1-d02-q2", name: "Detective Lab: The Failing WCAG Contrast Audit", type: "detective", desc: "Identify 12 subtle color combinations in a banking portal that fail WCAG 2.2 AA (4.5:1) and recalculate them using OKLCH luminance steps." },
      { id: "ds-m1-d02-q3", name: "Mastery Assignment: Algorithmic OKLCH Palette Generator", type: "assignment", desc: "Implement a TypeScript library that accepts a base brand color and procedurally generates a 10-step accessible palette with verified contrast tiers." },
      { id: "ds-m1-d02-q4", name: "Production Incident Lab: Unreadable Alert Badges in Dark Mode", type: "detective", desc: "Resolve a critical accessibility ticket where financial status badges became completely unreadable for low-vision users during dark mode switch." }
    ]
  },
  {
    day: 3,
    month: 1,
    blockNum: 1,
    title: "Typography Hierarchies, Type Scales, Font Subsetting & Layout Shift (CLS) Prevention",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Modular Scales & Web Font Performance)",
    spokenGoal: "Engineer robust typography systems: establish mathematical modular type scales (Major Third 1.25 / Perfect Fourth 1.333), configure line-height proportions to prevent collisions, and optimize web font loading with `size-adjust` to eliminate Cumulative Layout Shift (CLS).",
    conceptInvariant: "Baseline & Leading Invariant: As font-size increases, proportional line-height must decrease (from 1.6 for 14px body text to 1.1 for 48px display headings) to maintain optical balance and avoid excessive vertical gaps across text wraps.",
    failureMode: "Loading custom web fonts without fallback font metric matching (`ascent-override`, `descent-override`, `size-adjust`), causing a severe CLS score of 0.42 when web fonts swap in, jumping page layout and failing Core Web Vitals.",
    tryItFriction: "Calculate font metric fallback overrides for Arial to match the exact cap-height, x-height, and bounding box of Inter, ensuring zero layout shift when the web font swaps.",
    socraticHints: [
      "Why does a page jump vertically when an `@font-face` finishes downloading from a CDN?",
      "Because the fallback system font (e.g. Times or Arial) has different glyph ascenders, descenders, and advance widths!",
      "Use CSS `@font-face` overrides (`ascent-override`, `descent-override`, `size-adjust`) to force the fallback font to occupy the exact identical bounding box."
    ],
    situationalPuzzle: {
      scenario: "An e-commerce homepage experiences an abrupt 80px downward jump 1.2 seconds after page load. Google Lighthouse flags a catastrophic Cumulative Layout Shift (CLS) of 0.35. Network analysis reveals that the hero heading font file (`BrandSans.woff2`) loaded late, replacing system `Helvetica`. How should the design system fix this at the root?",
      options: [
        "Delete the custom font and only use system Arial.",
        "Synthesize fallback font metrics using `@font-face` with `size-adjust`, `ascent-override`, and `descent-override` so fallback text occupies the exact pixel dimensions of `BrandSans`.",
        "Add `display: none` to the heading until the font loads.",
        "Increase the server network bandwidth."
      ],
      answerIdx: 1,
      debrief: "Font metric overrides (`size-adjust`, `ascent-override`, `descent-override`) allow browsers to render fallback fonts with the exact optical and layout dimensions of custom web fonts, guaranteeing zero layout shift upon swap."
    },
    quests: [
      { id: "ds-m1-d03-q1", name: "Modular Type Scale Mathematical Foundations", type: "concept", desc: "Construct modular typography scales based on 1.25 (Major Third) and 1.333 (Perfect Fourth) with calibrated leading ratios." },
      { id: "ds-m1-d03-q2", name: "Detective Lab: The CLS Hero Heading Disaster", type: "detective", desc: "Profile a landing page with Chrome DevTools Performance panel, capture font-swap layout shift, and calculate metric overrides." },
      { id: "ds-m1-d03-q3", name: "Mastery Assignment: Zero-CLS Web Font Loader Pipeline", type: "assignment", desc: "Build a CSS/Vite plugin that reads WOFF2 font metrics and generates matching fallback `@font-face` definitions automatically." },
      { id: "ds-m1-d03-q4", name: "Production Incident Lab: Broken Header Alignment Across Operating Systems", type: "detective", desc: "Triage a bug where navigation text rendered 3px higher on macOS compared to Windows due to half-leading differences." }
    ]
  },
  {
    day: 4,
    month: 1,
    blockNum: 1,
    title: "Spacing Grids, Fluid Sizing (clamp(), min(), max()) & Mathematical Layout Invariants",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Fluid Math & Spatial Token Systems)",
    spokenGoal: "Construct spatial design systems that scale flawlessly across device dimensions: master the 4px/8px base spacing grid, eliminate arbitrary breakpoint media query spaghetti, and implement fluid typography and layout gutters using CSS `clamp()`.",
    conceptInvariant: "Spatial Coherence Invariant: All spacing dimensions (padding, margin, gap) must be strict integer multiples of the 4px baseline unit. Fluid scaling functions must clamp values between explicit minimum and maximum bounds using linear interpolation slopes.",
    failureMode: "Scattering 12 different media queries (`@media (max-width: 768px)`, `800px`, `992px`, `1024px`) across components to resize headings and paddings, resulting in jarring step-function jumps and layout breakage on foldable devices.",
    tryItFriction: "Derive the mathematical linear equation `y = mx + b` for a heading that scales smoothly from 20px at 320px viewport width to 48px at 1440px viewport width, and express it as a single CSS `clamp()` rule.",
    socraticHints: [
      "How do you convert two viewport width bounds (320px and 1440px) and two font-size bounds (20px and 48px) into a CSS `clamp()` value?",
      "Calculate the slope `m = (48 - 20) / (1440 - 320) = 28 / 1120 = 0.025` (which equals `2.5vw`)!",
      "Find the y-intercept: `b = 20 - (0.025 * 320) = 12px`. Thus: `clamp(1.25rem, 0.75rem + 2.5vw, 3rem)`."
    ],
    situationalPuzzle: {
      scenario: "A designer requests that a hero section's padding scale continuously from 24px on mobile phones to 96px on 4K ultrawide monitors. A junior developer writes 8 `@media` queries with stepped values. During QA on a tablet (768px), the layout feels claustrophobic, and on an iPad Pro (1024px), it suddenly jumps by 30px. What is the clean architectural remedy?",
      options: [
        "Add 10 more media queries every 50px.",
        "Implement a continuous fluid slope token using `clamp(1.5rem, 0.5rem + 3.5vw, 6rem)` to produce perfectly linear scaling with zero layout jumps.",
        "Disable responsiveness and fix the width at 1200px.",
        "Use JavaScript `window.onresize` to set element inline styles."
      ],
      answerIdx: 1,
      debrief: "CSS `clamp()` with linear viewport interpolation replaces brittle media query ladders. It guarantees smooth, continuous scaling between strict minimum and maximum bounds without layout jumps."
    },
    quests: [
      { id: "ds-m1-d04-q1", name: "Linear Interpolation Math for Fluid CSS clamp()", type: "concept", desc: "Derive the mathematical formulas for viewport slope, rem conversion, and clamp boundary invariants." },
      { id: "ds-m1-d04-q2", name: "Detective Lab: The Brittle 14-Breakpoint Stylesheet", type: "detective", desc: "Refactor a bloated 600-line responsive stylesheet with 14 media query blocks into 4 fluid design tokens." },
      { id: "ds-m1-d04-q3", name: "Mastery Assignment: Fluid Spatial Token Generator Library", type: "assignment", desc: "Create a CLI tool that inputs min/max screen widths and min/max target values to output CSS clamp tokens." },
      { id: "ds-m1-d04-q4", name: "Production Incident Lab: Sub-Pixel Rounding Layout Wrap on Safari", type: "detective", desc: "Fix an elusive bug where a 3-column card grid wrapped to a second line on Safari due to fractional sub-pixel flex calculation errors." }
    ]
  },
  {
    day: 5,
    month: 1,
    blockNum: 1,
    title: "Elevation, Shadow Physics, Border Radii & Milestone 1: Multi-Scale Token Engine & Color Palette Generator",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Depth Perception, Radii Hierarchy & Milestone 1)",
    spokenGoal: "Synthesize depth and elevation systems: model natural atmospheric lighting using multi-layered box-shadows, establish concentric border radii math, and deliver Milestone 1 by compiling a complete multi-scale token engine.",
    conceptInvariant: "Concentric Radii Invariant: When an element with border-radius $R_{inner}$ is nested inside a container with padding $P$, the outer container's border-radius must strictly equal $R_{outer} = R_{inner} + P$ to prevent awkward visual pinching.",
    failureMode: "Using a single harsh black shadow (`box-shadow: 0 10px 20px rgba(0,0,0,0.5)`), creating an artificial, muddy, 1990s aesthetic that clashes with modern interfaces and looks unnatural in dark mode.",
    tryItFriction: "Construct a 5-layer natural ambient occlusion shadow using layered offsets and low-opacity OKLCH color tints that feels like real ambient directional sunlight.",
    socraticHints: [
      "Why do single-layer CSS shadows look artificial?",
      "In reality, light casts both sharp direct shadows (umbra) and soft diffused ambient shadows (penumbra)!",
      "Stack multiple shadow definitions in a single `box-shadow` property with increasing blur and decreasing opacity."
    ],
    situationalPuzzle: {
      scenario: "A card component has an outer `border-radius: 8px` and an internal padding of `16px`. Inside it, a button has a `border-radius: 8px`. At high resolutions, the designer complains that the inner corner looks 'pinched' and optically deformed. What mathematical law of geometry was broken?",
      options: [
        "The CSS engine does not support nested borders.",
        "Concentric border radii rule was violated: the outer radius must equal the inner radius plus the padding (`R_outer = R_inner + Padding`). Here, with 8px inner radius and 16px padding, the outer radius should be `24px`.",
        "The button should have 0px border-radius.",
        "The GPU anti-aliasing failed."
      ],
      answerIdx: 1,
      debrief: "To maintain optical concentricity and parallel curved arcs, concentric corners must obey $R_{outer} = R_{inner} + Padding$. Equal inner and outer radii create visual distortion where corners appear pinched."
    },
    quests: [
      { id: "ds-m1-d05-q1", name: "Physical Elevation Models: Umbra, Penumbra & Ambient Occlusion", type: "concept", desc: "Diagram multi-layer shadow physics and map elevation levels (0dp to 24dp) to layered CSS shadow tokens." },
      { id: "ds-m1-d05-q2", name: "Detective Lab: The Disfigured Nested Container Radii", type: "detective", desc: "Identify and correct 10 instances of optical corner pinching across complex nested modal and card components." },
      { id: "ds-m1-d05-q3", name: "Mastery Assignment: Natural Ambient Shadow Generator", type: "assignment", desc: "Build a TypeScript module that accepts elevation levels and light angles to generate multi-layer realistic CSS shadows." },
      { id: "ds-m1-d05-q4", name: "Milestone 1 Gate: Enterprise Multi-Scale Token Engine", type: "assignment", desc: "Deliver Milestone 1: A complete, validated W3C DTCG token engine exporting colors (OKLCH), typography (fluid clamp), spacing, and elevation." }
    ]
  },

  // ─── BLOCK 2: CSS Layout Engines, Responsive Architecture & Container Queries (Days 6–10) ────────
  {
    day: 6,
    month: 1,
    blockNum: 2,
    title: "Modern CSS Layout Models: Flexbox Deep Mechanics, Alignment & Flex Grow/Shrink Math",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Flex Formatting Context & Box Distribution)",
    spokenGoal: "Deconstruct the internal layout algorithm of CSS Flexbox: master how browsers calculate available free space, resolve `flex-basis`, and apportion remaining or negative space using `flex-grow` and `flex-shrink` coefficients.",
    conceptInvariant: "Flex Space Apportionment Invariant: Negative free space is distributed proportionally to $(flex-shrink \\times flex-basis)$, not flex-shrink alone. Setting `flex-shrink: 1` on an element with a large basis causes it to shrink faster than one with a small basis.",
    failureMode: "Leaving `min-width: auto` on flex children containing long strings or code snippets, causing the flex child to refuse to shrink below its content width and triggering unexpected horizontal overflow on mobile screens.",
    tryItFriction: "Diagnose and fix a flex child container that refuses to truncate a long filename with `text-overflow: ellipsis`, discovering the critical role of `min-width: 0`.",
    socraticHints: [
      "Why does `text-overflow: ellipsis` fail to truncate text inside a flex child item?",
      "Because by default, flex items have `min-width: auto`, which prevents them from shrinking below their intrinsic content size!",
      "Override the default by explicitly setting `min-width: 0` on the flex child."
    ],
    situationalPuzzle: {
      scenario: "In a user profile header, an avatar (fixed 48px) sits beside an email address and a timestamp. On narrow mobile viewports, the email address blows past the viewport boundary, creating an unwanted horizontal scrollbar. The developer added `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` to the email `<span>`, but it still does not truncate. Why?",
      options: [
        "The `span` needs `display: block`.",
        "The parent flex container item retains default `min-width: auto`. Setting `min-width: 0` allows the flex item to shrink below its intrinsic text width, enabling ellipsis truncation.",
        "The browser does not support `text-overflow` on mobile.",
        "The avatar needs `flex-shrink: 0`."
      ],
      answerIdx: 1,
      debrief: "By default, flex items have `min-width: auto`, enforcing their minimum size to equal their intrinsic content size. Setting `min-width: 0` allows the item to compress below its content width so text truncation can activate."
    },
    quests: [
      { id: "ds-m1-d06-q1", name: "CSS Flexbox Space Allocation Algorithm Deep Dive", type: "concept", desc: "Calculate free-space distribution formulas for positive space (flex-grow) and negative space (flex-shrink * flex-basis)." },
      { id: "ds-m1-d06-q2", name: "Detective Lab: The Unbreakable Flex Child Overflow", type: "detective", desc: "Debug 5 real-world layout failures where nested flex items cause horizontal viewport blowouts on mobile screens." },
      { id: "ds-m1-d06-q3", name: "Mastery Assignment: Polymorphic Flexbox Primitive Component Suite", type: "assignment", desc: "Implement accessible React `Stack`, `HStack`, and `VStack` components with gap tokens and polymorphic `as` props." },
      { id: "ds-m1-d06-q4", name: "Production Incident Lab: Truncated Navigation Bar Collapse on iOS", type: "detective", desc: "Triage a production bug where navigation action icons disappeared off-screen on iOS Safari due to unconstrained flex items." }
    ]
  },
  {
    day: 7,
    month: 1,
    blockNum: 2,
    title: "CSS Grid 2.0: Subgrid, Implicit vs Explicit Tracks & Complex Data Density Layouts",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Two-Dimensional Track Systems & Subgrid)",
    spokenGoal: "Harness CSS Grid 2.0 for enterprise dashboards: master two-dimensional track definitions (`fr`, `minmax()`, `repeat(auto-fit)`), implicit grid placement, and synchronize nested component alignments using CSS `subgrid`.",
    conceptInvariant: "Subgrid Alignment Invariant: An element with `grid-template-rows: subgrid` adopts the track sizing and line positions of its parent grid, allowing child elements across independent cards (e.g. card headers, bodies, footers) to remain perfectly aligned regardless of variable content heights.",
    failureMode: "Relying on hardcoded heights (`height: 80px`) on card headers to keep multi-card layouts aligned, causing text to clip when translated into German or when user font scaling is enabled.",
    tryItFriction: "Create a 3-column pricing table using CSS Grid and Subgrid where card titles, feature lists, and CTA buttons line up horizontally across all 3 cards even when one card has twice as much feature text.",
    socraticHints: [
      "Why do flexbox cards in a row have mismatched button positions when one card has a longer description?",
      "Because each card is its own isolated layout context and has no awareness of neighboring card heights!",
      "Use `subgrid` on the cards so their internal headers, bodies, and footers share the parent grid's tracks."
    ],
    situationalPuzzle: {
      scenario: "An international e-commerce site displays a row of 4 product cards. In English, all 'Add to Cart' buttons align horizontally at the bottom. When switching to German, the product titles wrap to 3 lines on two cards, causing their 'Add to Cart' buttons to push down by 40px, creating an ugly staggered zigzag across the bottom of the cards. How should this be solved cleanly?",
      options: [
        "Truncate the German titles to 1 line with ellipsis.",
        "Set a fixed `height: 120px` on all product titles.",
        "Structure the card container as a CSS Grid and set `grid-template-rows: subgrid; grid-row: span 3;` on each card, letting all title and button rows align to shared parent tracks.",
        "Use JavaScript to loop through cards and set `button.style.top`."
      ],
      answerIdx: 2,
      debrief: "CSS `subgrid` enables child items to participate directly in the row/column tracks of their parent grid. This perfectly aligns headers, content, and action footers across cards without brittle fixed heights."
    },
    quests: [
      { id: "ds-m1-d07-q1", name: "CSS Grid vs Flexbox: Mental Models & Performance Cost", type: "concept", desc: "Compare layout calculation complexity between one-dimensional Flexbox and two-dimensional CSS Grid engines." },
      { id: "ds-m1-d07-q2", name: "Detective Lab: The Misaligned Pricing Matrix", type: "detective", desc: "Refactor a staggered, misaligned 4-tier SaaS pricing grid to use CSS `subgrid` with zero fixed heights." },
      { id: "ds-m1-d07-q3", name: "Mastery Assignment: Responsive Auto-Fitting Dashboard Grid Component", type: "assignment", desc: "Build a React `Grid` component utilizing `repeat(auto-fit, minmax(min(100%, 300px), 1fr))` with subgrid support." },
      { id: "ds-m1-d07-q4", name: "Production Incident Lab: Firefox vs Chrome Subgrid Inconsistency", type: "detective", desc: "Resolve a cross-browser rendering bug where implicit rows in a nested subgrid collapsed to zero height in older browser engines." }
    ]
  },
  {
    day: 8,
    month: 1,
    blockNum: 2,
    title: "Container Queries (@container, cqw, cqh, cqi) vs Viewport Media Queries",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Component-Centric Responsiveness)",
    spokenGoal: "Liberate component design from viewport constraints: understand why viewport media queries break reusability in multi-column layouts, establish container contexts with `container-type: inline-size`, and implement modular container query units (`cqw`, `cqi`).",
    conceptInvariant: "Modular Encapsulation Invariant: A design system component must respond to the dimensions of its immediate parent container, never the viewport window. A Card rendered in a narrow 300px sidebar must look identical to the same Card rendered on a 320px mobile viewport.",
    failureMode: "Using `@media (max-width: 600px)` inside a Card component. When placed inside a 350px sidebar on a 1920px desktop monitor, the Card renders its wide desktop layout, causing buttons and text to smash together unreadably.",
    tryItFriction: "Refactor an e-commerce ProductCard component to use `@container (min-width: 400px)` instead of viewport media queries, enabling it to render in horizontal mode when placed in wide areas and vertical mode in sidebars.",
    socraticHints: [
      "Why does a Card component break when embedded in a dashboard sidebar on a 4K monitor?",
      "Because the viewport is 3840px wide, so `@media (min-width: 768px)` forces the desktop layout, but the sidebar container is only 300px wide!",
      "Declare `container-type: inline-size` on the card parent and query `@container (min-width: 400px)`."
    ],
    situationalPuzzle: {
      scenario: "A design system team builds a rich `CalendarWidget` with full-month and compact-agenda views. The product team embeds it in two places: as the main page view (1200px wide) and inside an expandable drawer (320px wide) on desktop. The drawer widget renders the massive full-month grid because `@media (min-width: 1024px)` matches, breaking the UI. What is the architectural fix?",
      options: [
        "Pass a `isSmall` prop to the widget manually everywhere it is rendered.",
        "Define `container-type: inline-size` on the widget wrapper and query `@container (max-width: 450px)` to switch to agenda mode based on container space rather than screen width.",
        "Force the drawer to be at least 1024px wide.",
        "Create two separate copy-pasted components: `CalendarDesktop` and `CalendarDrawer`."
      ],
      answerIdx: 1,
      debrief: "Container Queries enable truly autonomous, self-contained responsive components. Querying the component's allocated container width (`@container`) guarantees correct layout regardless of where it is placed in the DOM."
    },
    quests: [
      { id: "ds-m1-d08-q1", name: "Container Queries Architectural Paradigm Shift", type: "concept", desc: "Compare viewport-bound `@media` with container-bound `@container` and evaluate container query performance." },
      { id: "ds-m1-d08-q2", name: "Detective Lab: The Crushed Sidebar Dashboard Widget", type: "detective", desc: "Fix 4 responsive components that explode when rendered inside a multi-column dashboard grid using container queries." },
      { id: "ds-m1-d08-q3", name: "Mastery Assignment: Autonomous Container-Aware Component Suite", type: "assignment", desc: "Build a responsive `MediaCard` component that seamlessly transitions between vertical, horizontal, and compact badge modes via `@container`." },
      { id: "ds-m1-d08-q4", name: "Production Incident Lab: Infinite Layout Loop with Container Queries", type: "detective", desc: "Diagnose an infinite layout oscillation loop caused by querying container height when the container's height depends on child content." }
    ]
  },
  {
    day: 9,
    month: 1,
    blockNum: 2,
    title: "CSS Cascade Layers (@layer), Specificity Management & Reset Strategies",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (The Modern Cascade & Layer Priority)",
    spokenGoal: "Eliminate specificity wars in large codebases: master CSS Cascade Layers (`@layer`), structure layer precedence (`reset`, `base`, `components`, `utilities`), and understand how `@layer` completely overrides selector specificity.",
    conceptInvariant: "Cascade Layer Precedence Invariant: Styles in a higher-priority layer always beat styles in a lower-priority layer, regardless of selector specificity. An element selector in the `utilities` layer (`button`) will override an ID-packed selector in the `components` layer (`#app .card button`).",
    failureMode: "Using `!important` to override third-party library styles or utility classes, triggering an uncontrollable specificity arms race that corrupts global application styling.",
    tryItFriction: "Organize an enterprise CSS architecture into 4 explicit cascade layers (`@layer reset, base, components, overrides;`) and demonstrate that an unlayered or override style cleanly wins without `!important`.",
    socraticHints: [
      "Why does `#main-nav .menu-item a.active` lose to `.text-red` if `.text-red` is in a later layer?",
      "Because layer order takes precedence over selector specificity in the modern CSS cascade!",
      "Declare your layer order at the very top of your root CSS: `@layer reset, base, components, utilities;`."
    ],
    situationalPuzzle: {
      scenario: "A design system adopts a utility-first CSS approach alongside legacy BEM stylesheets. A developer wants to apply `class=\"btn btn-primary p-4\"`, but the padding utility `p-4` (specificity `0-1-0`) is ignored because the legacy BEM class `.btn.btn-primary` has specificity `0-2-0`. The team starts adding `!important` to utilities. How should the design system lead resolve this properly?",
      options: [
        "Wrap the entire legacy codebase in `#root` to increase its specificity even more.",
        "Establish CSS Cascade Layers: place legacy components into `@layer components` and utility classes into `@layer utilities`. Because `utilities` is declared after `components`, utilities will cleanly override components regardless of specificity.",
        "Rewrite the entire application in inline styles.",
        "Ban utility classes completely."
      ],
      answerIdx: 1,
      debrief: "CSS `@layer` allows developers to control cascade order explicitly. A selector in a subsequent layer (e.g. `utilities`) always wins against prior layers (e.g. `components`), completely eliminating specificity battles and `!important` hacks."
    },
    quests: [
      { id: "ds-m1-d09-q1", name: "The Cascade Specification 2024: Layers, Scopes & Importance", type: "concept", desc: "Map the complete CSS cascade calculation pipeline from user-agent styles to `@layer`, specificity, and `!important` reversal." },
      { id: "ds-m1-d09-q2", name: "Detective Lab: Untangling an Enterprise Specificity Nightmare", type: "detective", desc: "Refactor a legacy stylesheet containing 140 `!important` declarations into cleanly structured `@layer` blocks." },
      { id: "ds-m1-d09-q3", name: "Mastery Assignment: Modern Layer-Orchestrated CSS Architecture", type: "assignment", desc: "Implement an enterprise CSS foundation featuring modern reset, base typography, component layers, and utility overrides." },
      { id: "ds-m1-d09-q4", name: "Production Incident Lab: Third-Party Widget CSS Polluting Core UI", type: "detective", desc: "Contain a rogue third-party chat widget that injected global unlayered styles by isolating it within an isolated cascade layer." }
    ]
  },
  {
    day: 10,
    month: 1,
    blockNum: 2,
    title: "CSS Custom Properties Hierarchy, Dynamic Theming & Dark Mode System Invariants",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Runtime Tokens & Theme Inversion)",
    spokenGoal: "Architect dynamic runtime theming systems: understand CSS Custom Properties inheritance and cascade scoping, implement seamless dark mode switching without Flash of Unstyled Content (FOUC), and support `color-scheme` browser integration.",
    conceptInvariant: "Theming Scope Invariant: A theme is not a separate stylesheet; it is a scoped re-declaration of semantic CSS Custom Properties on a container element. Changing `data-theme=\"dark\"` must only re-point semantic tokens to dark global values, leaving component CSS unchanged.",
    failureMode: "Duplicating all component CSS rules inside a `.dark` class (`.dark .btn { background: #333; }`), doubling bundle size and causing subtle UI drift whenever light-mode components receive updates.",
    tryItFriction: "Implement a dark mode toggle engine using CSS Custom Properties and `data-theme` attributes that transitions colors smoothly without flashing unstyled content on SSR page load.",
    socraticHints: [
      "Why is duplicating component CSS rules for dark mode an anti-pattern?",
      "Because components should only consume semantic variables like `var(--surface-primary)`!",
      "Define `var(--surface-primary)` once under `:root` and override its value under `[data-theme='dark']`."
    ],
    situationalPuzzle: {
      scenario: "A Next.js SaaS app implements dark mode. When users with dark mode preference refresh the page, the screen blinks white for 200 milliseconds before turning dark (Flash of Inverted Theme / FOUC). QA flags this as an unacceptable visual defect. How must the frontend architecture eliminate this flash?",
      options: [
        "Delay page rendering with a 500ms splash screen.",
        "Inject a blocking synchronous inline script in the HTML `<head>` before body hydration that reads `localStorage`/`prefers-color-scheme` and sets the `data-theme` attribute immediately on `<html>`.",
        "Disable dark mode on mobile devices.",
        "Store the theme only in React state."
      ],
      answerIdx: 1,
      debrief: "A tiny, synchronous inline `<script>` in the document `<head>` evaluates before the browser paints the body. It reads theme preference and immediately applies the theme class/attribute, completely preventing theme flash."
    },
    quests: [
      { id: "ds-m1-d10-q1", name: "CSS Custom Properties Scope & DOM Inheritance Engine", type: "concept", desc: "Analyze the runtime cost, inheritance tree traversal, and invalid-at-computed-time behavior of CSS Custom Properties." },
      { id: "ds-m1-d10-q2", name: "Detective Lab: The Flashing White SSR Dark Mode Bug", type: "detective", desc: "Diagnose and fix a Next.js / Remix SSR application suffering from severe Flash of Unstyled Content (FOUC) on dark mode load." },
      { id: "ds-m1-d10-q3", name: "Mastery Assignment: Zero-FOUC Multi-Theme Provider Engine", type: "assignment", desc: "Build a lightweight theme provider that handles system preferences, local overrides, and nested scoped theme containers." },
      { id: "ds-m1-d10-q4", name: "Production Incident Lab: Contrast Inversion in Nested Themed Containers", type: "detective", desc: "Fix an incident where a dark-themed card placed inside a dark-mode page caused nested input text to render black on black." }
    ]
  },

  // ─── BLOCK 3: Accessibility (a11y) Foundations & Assistive Technologies (Days 11–15) ─────────────
  {
    day: 11,
    month: 1,
    blockNum: 3,
    title: "WAI-ARIA 1.2 Core Specifications: Roles, States, Properties & Accessible Name Computation (AccName)",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (A11y Semantic Tree & Screen Reader Mental Models)",
    spokenGoal: "Master digital accessibility at the specification level: understand the browser's Accessibility Tree, the difference between semantic HTML and ARIA, and trace how the Accessible Name and Description Computation (AccName 1.2) determines what screen readers announce.",
    conceptInvariant: "First Rule of ARIA Invariant: If you can use a native HTML5 element or attribute with the semantics and behavior you require already built in, then do so. Never apply `role=\"button\"` to a `<div>` if a `<button>` can be used.",
    failureMode: "Building a custom modal with `<div class=\"btn\" onClick={close}>X</div>` without `aria-label`, causing screen readers to announce 'Unlabeled graphic, clickable', leaving blind users unable to close the modal.",
    tryItFriction: "Trace the AccName 1.2 computation tree for a complex icon button containing an SVG, hidden tooltip, and `aria-label`, calculating the exact text string delivered to the screen reader.",
    socraticHints: [
      "In what order does the AccName 1.2 algorithm evaluate accessible names?",
      "It checks `aria-labelledby` first, then `aria-label`, then native attributes (like `alt`), and finally child text content!",
      "If `aria-label` is present on an element, it completely replaces the internal text content in the accessibility tree."
    ],
    situationalPuzzle: {
      scenario: "An accessible button is marked up as `<button aria-label=\"Search Products\"><span>Search</span> <svg aria-hidden=\"true\">...</svg></button>`. A junior engineer changes it to `<button aria-label=\"Search Products\" aria-labelledby=\"search-title\"><span id=\"search-title\">Find Items</span></button>`. What does VoiceOver / NVDA actually announce to the user?",
      options: [
        "'Search Products Find Items'",
        "'Find Items' — because according to the AccName 1.2 specification, `aria-labelledby` has higher precedence than `aria-label` and completely overrides it.",
        "'Search Products'",
        "The screen reader crashes."
      ],
      answerIdx: 1,
      debrief: "The AccName 1.2 precedence ladder dictates: `aria-labelledby` > `aria-label` > native labels > subtree text. Because `aria-labelledby` is present, it completely ignores `aria-label` and announces 'Find Items'."
    },
    quests: [
      { id: "ds-m1-d11-q1", name: "Accessibility Tree & AccName 1.2 Resolution Pipeline", type: "concept", desc: "Trace how browser layout engines map DOM nodes to native OS accessibility APIs (UIAutomation, NSAccessibility, AT-SPI)." },
      { id: "ds-m1-d11-q2", name: "Detective Lab: The Silent Icon Button Audit", type: "detective", desc: "Audit a web application with 20 icon-only buttons, diagnose 14 silent or confusing accessible names, and repair them." },
      { id: "ds-m1-d11-q3", name: "Mastery Assignment: AccName Calculator & Validator Engine", type: "assignment", desc: "Build a TypeScript utility that calculates the computed accessible name of any DOM element matching AccName 1.2 rules." },
      { id: "ds-m1-d11-q4", name: "Production Incident Lab: Conflicting ARIA Attributes Trapping Screen Readers", type: "detective", desc: "Debug an incident where conflicting `aria-expanded` and `aria-hidden` attributes caused TalkBack on Android to lock in an infinite loop." }
    ]
  },
  {
    day: 12,
    month: 1,
    blockNum: 3,
    title: "Keyboard Navigation Paradigms: Tab Sequences, Roving tabindex vs aria-activedescendant",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Keyboard Navigation & APG Patterns)",
    spokenGoal: "Engineer enterprise keyboard navigation: differentiate linear tab sequences from composite widget navigation, implement the Roving `tabindex` pattern, and master `aria-activedescendant` for high-performance virtualized widgets.",
    conceptInvariant: "Composite Widget Invariant: A composite widget (Toolbar, Menu, Grid, TabList) must present only a single tab stop to the outer page sequence (`tabindex=\"0\"` on active item, `-1` on others). Arrow keys must manage focus internally within the widget.",
    failureMode: "Allowing all 50 items in a toolbar to be tab stops (`tabindex=\"0\"`), forcing keyboard users to press the Tab key 50 times just to navigate past the toolbar to reach the main page content.",
    tryItFriction: "Implement a fully accessible Toolbar component where pressing Tab enters/exits the toolbar, and Left/Right arrow keys navigate between buttons using roving `tabindex`.",
    socraticHints: [
      "Why is forcing keyboard users to Tab through every item in a menu an accessibility violation?",
      "Because it creates keyboard fatigue and traps users in giant focus sequences!",
      "Use roving `tabindex`: set `tabindex=\"0\"` only on the currently active item, and `tabindex=\"-1\"` on all sibling items."
    ],
    situationalPuzzle: {
      scenario: "A developer builds an accessible TabList with 6 tabs. A keyboard user presses Tab to enter the tab list, lands on Tab 1, and then presses Tab again expecting to jump into the TabPanel content. Instead, the focus moves to Tab 2, then Tab 3, requiring 6 Tab presses before reaching content. What WAI-ARIA APG pattern was violated?",
      options: [
        "The tabs should have been radio buttons.",
        "Roving tabindex pattern violation: In a tablist, only the selected tab should be in the tab sequence (`tabindex=\"0\"`). Arrow keys must navigate between tabs, while Tab must jump directly into the active panel.",
        "The browser keyboard focus is broken.",
        "The panel should have `autofocus`."
      ],
      answerIdx: 1,
      debrief: "WAI-ARIA Authoring Practices Guide (APG) mandates that composite widgets have exactly one tab stop. Arrow keys move focus horizontally between tabs, and the Tab key moves focus directly into the associated tabpanel."
    },
    quests: [
      { id: "ds-m1-d12-q1", name: "Roving tabindex vs aria-activedescendant Architecture", type: "concept", desc: "Compare DOM focus movement (roving tabindex) with virtual focus management (aria-activedescendant) for high-scale lists." },
      { id: "ds-m1-d12-q2", name: "Detective Lab: The 80-Tab-Stop Navigation Nightmare", type: "detective", desc: "Refactor a bloated navigation header where every dropdown menu item was a tab stop into a proper APG composite widget." },
      { id: "ds-m1-d12-q3", name: "Mastery Assignment: Reusable Roving Focus React Hook", type: "assignment", desc: "Build a generic `useRovingFocus` hook that supports horizontal, vertical, and grid navigation with circular wrapping." },
      { id: "ds-m1-d12-q4", name: "Production Incident Lab: Focus Loss on Dynamic List Item Deletion", type: "detective", desc: "Triage a bug where deleting a selected item from a list caused keyboard focus to be thrown back to the `<body>`, losing user context." }
    ]
  },
  {
    day: 13,
    month: 1,
    blockNum: 3,
    title: "Focus Management, Visual Focus Rings (:focus-visible), and Focus Trap Invariants",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Focus Indicators & Focus Trapping)",
    spokenGoal: "Eliminate invisible focus states and focus escapes: master `:focus-visible` to balance mouse aesthetics with keyboard visibility, design high-contrast focus rings that meet WCAG 2.2 AA (3:1 contrast against adjacent colors), and implement foolproof focus traps.",
    conceptInvariant: "Focus Visibility Invariant: An interactive element must never have `outline: none` without providing an alternative high-contrast `:focus-visible` indicator that has at least a 3:1 contrast ratio against both the element background and the page surface.",
    failureMode: "Resetting `outline: none` globally in CSS because 'the designer disliked the blue ring on mouse clicks', leaving keyboard-only and motor-impaired users completely unable to see where their cursor is located.",
    tryItFriction: "Write a 2-color concentric focus ring CSS utility using `box-shadow` that guarantees a 3:1 contrast ratio on both pure white and pure black backgrounds.",
    socraticHints: [
      "Why did developers historically write `*:focus { outline: none; }`?",
      "Because mouse clicks triggered the default browser focus ring, which designers found visually unappealing!",
      "Use `:focus-visible`, which only applies the outline when the user interacts via keyboard or assistive tech."
    ],
    situationalPuzzle: {
      scenario: "A banking portal has a modal dialog open. A keyboard user presses the Tab key repeatedly. After reaching the modal's 'Submit' button, the next Tab press unexpectedly shifts focus to a hidden hyperlink in the background page behind the modal backdrop. What critical invariant was broken?",
      options: [
        "The modal was missing an `aria-label`.",
        "Focus Trap Invariant violation: A modal dialog must trap keyboard focus within its bounds. When focus reaches the last focusable element, the next Tab must wrap to the first focusable element, preventing background interaction.",
        "The background page should have been deleted from the DOM.",
        "The browser lacks modal support."
      ],
      answerIdx: 1,
      debrief: "Modal dialogs require a strict focus trap. When a modal is open, keyboard focus must cycle strictly between the modal's focusable elements. Background elements should also receive `inert` to prevent screen reader traversal."
    },
    quests: [
      { id: "ds-m1-d13-q1", name: "WCAG 2.2 Focus Appearance & Target Size Math", type: "concept", desc: "Analyze WCAG 2.2 Criterion 2.4.11 (Focus Appearance) contrast math, indicator perimeter calculations, and target sizes." },
      { id: "ds-m1-d13-q2", name: "Detective Lab: The Invisible Keyboard Focus Investigation", type: "detective", desc: "Audit an enterprise web app, discover 25 interactive controls lacking focus indicators, and apply dual-color focus rings." },
      { id: "ds-m1-d13-q3", name: "Mastery Assignment: Bulletproof Focus Trap Engine Component", type: "assignment", desc: "Build a headless React `FocusTrap` component that traps tab cycles, restores previous focus on unmount, and listens to Escape." },
      { id: "ds-m1-d13-q4", name: "Production Incident Lab: Focus Leaking Outside Open Drawer", type: "detective", desc: "Fix an incident where background form inputs could be accidentally submitted via Enter while an overlay drawer was active." }
    ]
  },
  {
    day: 14,
    month: 1,
    blockNum: 3,
    title: "Screen Reader Announcements, Live Regions (aria-live=\"polite\" vs \"assertive\"), and Status Messages",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Asynchronous Assistive Feedback)",
    spokenGoal: "Communicate asynchronous UI updates to assistive technologies: master ARIA Live Regions, understand when to use `polite` vs `assertive`, configure `aria-atomic` and `aria-relevant`, and avoid audio chatter.",
    conceptInvariant: "Live Region Invariant: An `aria-live` region must exist in the DOM *before* its text content is updated. Injecting an element that already contains text and `aria-live=\"polite\"` simultaneously is frequently ignored by screen readers.",
    failureMode: "Using `aria-live=\"assertive\"` on every subtle search autocomplete result, causing screen readers to aggressively interrupt the user's speech synthesizer on every single keystroke.",
    tryItFriction: "Build an accessible toast notification announcer that mounts an invisible persistent `aria-live=\"polite\"` container in the DOM and queues announcements smoothly.",
    socraticHints: [
      "Why doesn't VoiceOver announce a dynamically injected `<div aria-live=\"polite\">Order saved!</div>`?",
      "Because screen readers often need the live region registered in the accessibility tree before mutations occur!",
      "Mount the live region container on initial page load, and append text updates into it dynamically."
    ],
    situationalPuzzle: {
      scenario: "A form validation error occurs when a user submits an invalid credit card number. A junior developer injects `<div role=\"alert\">Invalid card number</div>` into the DOM. Users of JAWS report that the error is never read aloud upon submission. What architectural flaw prevented the announcement?",
      options: [
        "JAWS does not support credit card validation.",
        "The live region was created and populated simultaneously in the same DOM mutation tick, causing the accessibility API to miss the content change. The alert container should be pre-mounted in the layout.",
        "Credit cards require `aria-live=\"assertive\"`.",
        "The font color was too light."
      ],
      answerIdx: 1,
      debrief: "Screen readers monitor existing accessibility nodes for mutations. If a live container is created and populated in the same tick, many screen readers treat it as existing content rather than an update. Pre-mounting the container solves this."
    },
    quests: [
      { id: "ds-m1-d14-q1", name: "ARIA Live Regions & Asynchronous Accessibility Mental Model", type: "concept", desc: "Map `aria-live` levels (off, polite, assertive), `aria-atomic=\"true\"`, and `aria-relevant` event bindings." },
      { id: "ds-m1-d14-q2", name: "Detective Lab: The Babbling Search Autocomplete Disaster", type: "detective", desc: "Triage a search box that fired 40 assertive announcements per second while typing, and refactor to clean polite debounced status updates." },
      { id: "ds-m1-d14-q3", name: "Mastery Assignment: Global Screen Reader Announcer Queue Service", type: "assignment", desc: "Build an enterprise announcement singleton service in TypeScript that prioritizes and queues screen reader messages." },
      { id: "ds-m1-d14-q4", name: "Production Incident Lab: Unannounced Checkout Payment Failure", type: "detective", desc: "Resolve a critical accessibility complaint where blind customers received no feedback when their card was declined at checkout." }
    ]
  },
  {
    day: 15,
    month: 1,
    blockNum: 3,
    title: "Touch Targets, Motion Sensitivity (prefers-reduced-motion) & Milestone 2: Automated WCAG 2.2 A11y Audit Engine",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Motor Accessibility & Milestone 2 Gate)",
    spokenGoal: "Engineer physical accessibility and deliver Milestone 2: enforce WCAG 2.2 Criterion 2.5.8 target sizes (minimum 24x24px / recommended 44x44px), respect vestibular motion disorders via `prefers-reduced-motion`, and construct an automated accessibility test harness.",
    conceptInvariant: "Target Size & Inertia Invariant: An interactive touch target must have a bounding touch area of at least 24x24px (WCAG 2.2 AA) or 44x44px (AAA). Visual dimensions can be smaller (e.g. a 16px checkbox) if padded via pseudo-elements (`::after`).",
    failureMode: "Building an animated parallax landing page that ignores `prefers-reduced-motion`, triggering severe nausea, vertigo, and vestibular migraine attacks for sensitive users.",
    tryItFriction: "Write an automated test using `@axe-core/playwright` that scans 15 design system components and fails CI if any component has color contrast < 4.5:1, missing labels, or touch targets < 24px.",
    socraticHints: [
      "How can a 16px toggle switch meet the 44px minimum touch target requirement without changing its visual size?",
      "Use an invisible pseudo-element `::before` with `position: absolute; inset: -14px;` to expand the clickable hit area!",
      "This guarantees a 44x44px touch target while preserving the sleek 16px visual design."
    ],
    situationalPuzzle: {
      scenario: "A designer creates a minimal icon button with a visual size of 18x18px. On mobile devices, users frequently mis-tap the button, accidentally triggering the adjacent link. The accessibility team flags a WCAG 2.2 AA violation. The designer refuses to make the icon visually larger. How does a Staff UI Engineer solve this?",
      options: [
        "Tell the accessibility team to ignore the violation.",
        "Add an invisible CSS `::after` pseudo-element expanding the pointer hit area to 44x44px centered over the icon using `pointer-events: auto`, satisfying WCAG without altering the visual design.",
        "Make the adjacent link unclickable.",
        "Increase the smartphone screen resolution."
      ],
      answerIdx: 1,
      debrief: "WCAG 2.2 evaluates the *interactive target area*, not the visible icon size. Expanding the click/touch hit-box using an invisible pseudo-element satisfies accessibility criteria while honoring design aesthetics."
    },
    quests: [
      { id: "ds-m1-d15-q1", name: "WCAG 2.2 New Success Criteria Deep Dive", type: "concept", desc: "Analyze the newest WCAG 2.2 criteria: 2.4.11 Focus Appearance, 2.5.7 Dragging Movements, and 2.5.8 Target Size (Minimum)." },
      { id: "ds-m1-d15-q2", name: "Detective Lab: The Vertigo-Inducing Parallax Carousel", type: "detective", desc: "Refactor a dizzying marketing carousel to detect `prefers-reduced-motion` and gracefully fall back to instant cross-fades." },
      { id: "ds-m1-d15-q3", name: "Mastery Assignment: Touch Target Hitbox Expander CSS Utility", type: "assignment", desc: "Create a reusable CSS utility and React wrapper that guarantees 44x44px touch targets across all small interactive controls." },
      { id: "ds-m1-d15-q4", name: "Milestone 2 Gate: Automated WCAG 2.2 A11y CI Audit Engine", type: "assignment", desc: "Deliver Milestone 2: An automated Playwright test suite with Axe-core validating contrast, AccName, focus rings, and target sizes." }
    ]
  },

  // ─── BLOCK 4: Atomic Components & Primitive UI Architecture (Days 16–20) ────────────────────────
  {
    day: 16,
    month: 1,
    blockNum: 4,
    title: "The Universal Button: Polymorphism (asChild / as), Loading States, Slot Topologies & Click Debouncing",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (The Foundational Atom)",
    spokenGoal: "Architect the universal Button component: implement robust polymorphism using the `asChild` / Slot pattern, manage disabled vs `aria-busy` loading states, support icon leading/trailing slots, and prevent double-click payment submission races.",
    conceptInvariant: "Polymorphism Invariant: An interactive component must never nest interactive elements (e.g. `<button><a href=\"...\">...</a></button>` is invalid HTML). When a button acts as a link, the underlying DOM node must polymorph into a real `<a>` tag while retaining button styling.",
    failureMode: "Setting `disabled={isLoading}` on a form submit button. When disabled, the button loses focus immediately in many browsers, dumping the user's keyboard focus to `<body>` and disrupting screen reader announcements.",
    tryItFriction: "Build a polymorphic `Button` in React using Radix UI Slot pattern that accepts `asChild`, preserves ref forwarding, and handles asynchronous loading states without dropping keyboard focus.",
    socraticHints: [
      "Why is rendering `<button onClick={() => navigate('/home')}>` worse than rendering `<a href=\"/home\">`?",
      "Because screen readers cannot identify it as a link, and users cannot right-click to open in a new tab!",
      "Use polymorphic rendering (`asChild`) so navigation actions render real semantic anchor elements."
    ],
    situationalPuzzle: {
      scenario: "A customer on a slow 3G connection clicks 'Pay \$500'. The payment takes 3 seconds. Frustrated, the user rapidly clicks the button three times. The backend charges the customer \$1500 because the button component did not debounce or guard against concurrent submissions. How must the button component handle this?",
      options: [
        "Hide the button with `display: none` after the first click.",
        "Implement an internal idempotent click lock / debouncer and set `aria-busy=\"true\"` with an accessible spinner while keeping the button focused, rejecting subsequent click events until the promise settles.",
        "Show a browser `alert('Please wait')` popup.",
        "Add a 10-second timer to the backend."
      ],
      answerIdx: 1,
      debrief: "Enterprise buttons must manage pending asynchronous operations idempotently. Setting `aria-busy=\"true\"` informs assistive technology of the pending state while programmatic debouncing blocks duplicate clicks."
    },
    quests: [
      { id: "ds-m1-d16-q1", name: "Component Polymorphism: The Evolution from 'as' to 'asChild' Slots", type: "concept", desc: "Compare classic polymorphic `as` prop typing with Radix UI composable Slot pattern and ref forwarding." },
      { id: "ds-m1-d16-q2", name: "Detective Lab: The Double-Submission Payment Bug", type: "detective", desc: "Audit a checkout form, reproduce duplicate API submissions caused by rapid button clicks, and implement idempotent click guards." },
      { id: "ds-m1-d16-q3", name: "Mastery Assignment: Production-Grade Accessible Polymorphic Button", type: "assignment", desc: "Build a TypeScript Button component with 5 visual variants, 3 sizes, icon slots, `asChild` support, and `aria-busy` loading." },
      { id: "ds-m1-d16-q4", name: "Production Incident Lab: Keyboard Focus Lost During Asynchronous Form Submission", type: "detective", desc: "Fix an incident where disabling a button during async validation kicked keyboard focus out of the modal to the body tag." }
    ]
  },
  {
    day: 17,
    month: 1,
    blockNum: 4,
    title: "Accessible Form Controls: Text Input, Label Association (htmlFor, aria-describedby), and Error Validation",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Form Fields & Validation Semantics)",
    spokenGoal: "Engineer enterprise form controls: enforce 1:1 label association (`htmlFor` / `id`), associate helper text and error messages using `aria-describedby`, manage `aria-invalid`, and establish clear visual and programmatic error states.",
    conceptInvariant: "Form Accessibility Invariant: Every form input must have a programmatic accessible label (via `<label for=\"...\">`). Visual placeholders are NOT labels. Error messages must be programmatically linked via `aria-describedby` and flagged with `aria-invalid=\"true\"`.",
    failureMode: "Using `placeholder=\"Enter email\"` instead of a real `<label>`, causing the label to vanish as soon as the user types, disorienting cognitive-impaired users and failing accessibility audits.",
    tryItFriction: "Create an accessible `FormField` wrapper component that generates unique auto-incrementing IDs for labels, helper text, and error messages using React 18 `useId()`.",
    socraticHints: [
      "How does a screen reader know that an error message beneath an input belongs to that specific input?",
      "By pointing the input's `aria-describedby` attribute to the `id` of the error message container!",
      "When an error occurs, also set `aria-invalid=\"true\"` on the input so screen readers announce 'Invalid entry'."
    ],
    situationalPuzzle: {
      scenario: "A user with a screen reader fills out a registration form. They type an invalid password and tab to the next field. A visual red error 'Password must be 8+ characters' appears below the field. The screen reader user continues submitting the form, unaware that the password was rejected. What ARIA attribute was missing on the password input?",
      options: [
        "`role=\"password\"`",
        "`aria-invalid=\"true\"` and `aria-describedby=\"password-error-id\"` — without these, assistive technologies receive zero indication that an error occurred on that input.",
        "`title=\"Error\"`",
        "`tabindex=\"1\"`"
      ],
      answerIdx: 1,
      debrief: "Visual error styling (red border, text below) is invisible to screen reader users unless mapped programmatically. `aria-invalid=\"true\"` alerts the user to the failure, and `aria-describedby` connects the specific error description."
    },
    quests: [
      { id: "ds-m1-d17-q1", name: "Form Control Semantics & The Accessible Name Calculation", type: "concept", desc: "Analyze the interaction between `<label>`, `placeholder`, `aria-label`, and `aria-describedby` in browser accessibility trees." },
      { id: "ds-m1-d17-q2", name: "Detective Lab: The Ghost Input Form", type: "detective", desc: "Audit a 10-field checkout form with disconnected labels and unannounced error states, and wire them up with `useId`." },
      { id: "ds-m1-d17-q3", name: "Mastery Assignment: Enterprise FormField & TextInput Suite", type: "assignment", desc: "Build a production-ready `TextInput` component with prefix/suffix addons, password show/hide toggle, and accessible validation states." },
      { id: "ds-m1-d17-q4", name: "Production Incident Lab: ID Collisions in Multi-Instance Modal Forms", type: "detective", desc: "Fix an incident where opening two modal instances created duplicate HTML `id` attributes, breaking label clicking and focus." }
    ]
  },
  {
    day: 18,
    month: 1,
    blockNum: 4,
    title: "Selection Controls: Accessible Checkbox, Radio Groups, Switch & Tri-State Mechanics",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Stateful Selection Controls)",
    spokenGoal: "Architect accessible selection primitives: understand the semantic differences between Checkbox, Radio, and Switch (`role=\"switch\"`), implement tri-state indeterminate checkboxes (`indeterminate` DOM property), and manage roving focus across radio groups.",
    conceptInvariant: "Switch vs Checkbox Invariant: A Checkbox represents a selection within a form that requires submission; a Switch (`role=\"switch\"`) represents an immediate toggle of state (like turning on Wi-Fi) that takes effect immediately without clicking 'Save'.",
    failureMode: "Attempting to set an indeterminate checkbox via an HTML attribute (`<input type=\"checkbox\" indeterminate />`), failing because `indeterminate` is strictly an IDL DOM property and cannot be set via HTML markup alone.",
    tryItFriction: "Implement a hierarchical table selection component where selecting some child items sets the master header checkbox to indeterminate (`checkboxRef.current.indeterminate = true`).",
    socraticHints: [
      "Why doesn't `<input type=\"checkbox\" indeterminate=\"true\" />` work in HTML?",
      "Because `indeterminate` is not a valid HTML attribute; it exists only as a JavaScript DOM property on `HTMLInputElement`!",
      "Use a React `useEffect` or ref callback to assign `node.indeterminate = isIndeterminate` directly to the DOM element."
    ],
    situationalPuzzle: {
      scenario: "In an enterprise permissions table with 20 sub-permissions, a parent checkbox allows selecting all. When 5 permissions are selected, the parent checkbox shows a minus icon. However, screen reader users hear 'Parent: Checked' instead of 'Partially Checked'. What was neglected in the implementation?",
      options: [
        "The checkbox needed a different CSS icon.",
        "The component only updated visual CSS and failed to set the DOM property `checkbox.indeterminate = true` and `aria-checked=\"mixed\"`, which informs accessibility APIs of the partial state.",
        "HTML checkboxes do not support partial states.",
        "The table needed `role=\"grid\"`."
      ],
      answerIdx: 1,
      debrief: "Tri-state checkboxes must set `aria-checked=\"mixed\"` and the JavaScript DOM property `indeterminate = true`. Without these, assistive technologies announce the control as either completely checked or unchecked."
    },
    quests: [
      { id: "ds-m1-d18-q1", name: "Selection Controls Anatomy: Checkbox vs Radio vs Switch", type: "concept", desc: "Compare WAI-ARIA APG patterns and user mental models across Checkboxes, Radio Groups, and Switches." },
      { id: "ds-m1-d18-q2", name: "Detective Lab: The Broken Radio Group Keyboard Navigation", type: "detective", desc: "Fix a custom radio group where Arrow keys failed to navigate between options and Tab skipped options entirely." },
      { id: "ds-m1-d18-q3", name: "Mastery Assignment: Tri-State Checkbox & Accessible Switch Primitive", type: "assignment", desc: "Build production-ready, styled `Checkbox` (with indeterminate state) and `Switch` components with keyboard support." },
      { id: "ds-m1-d18-q4", name: "Production Incident Lab: Unintended Immediate Side Effects from Misused Checkbox", type: "detective", desc: "Refactor a settings page where users thought unchecking an option required saving, but it immediately deactivated their account." }
    ]
  },
  {
    day: 19,
    month: 1,
    blockNum: 4,
    title: "Visual Feedback Primitives: Badges, Avatars, Tooltips with Popper/Floating UI Positioning & Portals",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Floating UI, Portals & Visual Indicators)",
    spokenGoal: "Engineer floating visual feedback components: master floating element positioning (collision detection, flipping, shifting), understand why floating elements must render into React Portals (`document.body`), and make tooltips accessible without keyboard traps.",
    conceptInvariant: "Floating Portal Invariant: Any floating overlay (Tooltip, Popover, Menu) must be rendered into a DOM portal at the document root to avoid being clipped by parent containers with `overflow: hidden` or distorted by CSS transforms.",
    failureMode: "Rendering a Tooltip inside a parent card with `overflow: hidden`, causing the tooltip to be clipped and cut off when it extends beyond the boundary of the card.",
    tryItFriction: "Build an accessible Tooltip component using `@floating-ui/react` that positions itself above the trigger, flips below if space is constrained, and closes immediately on Escape.",
    socraticHints: [
      "Why does a dropdown or tooltip get clipped when nested inside a scrollable container?",
      "Because the parent has `overflow: hidden` or `overflow: scroll`, which constrains all child elements to the container's box!",
      "Render the floating element into a Portal attached to `document.body`, using fixed positioning calibrated via `getBoundingClientRect`."
    ],
    situationalPuzzle: {
      scenario: "An interactive dashboard has a data table where hovering an information icon shows a tooltip. However, a keyboard user tabs to the icon, and the tooltip appears. When the user wants to read text underneath the tooltip, they cannot dismiss it without moving focus away. What WCAG 2.2 criterion was violated?",
      options: [
        "WCAG 1.1.1 Non-text Content",
        "WCAG 1.4.13 Content on Hover or Focus (Dismissible): The tooltip must be dismissible using the Escape key without moving pointer hover or keyboard focus.",
        "WCAG 2.1.1 Keyboard",
        "WCAG 2.4.7 Focus Visible"
      ],
      answerIdx: 1,
      debrief: "WCAG 2.2 Criterion 1.4.13 mandates that any content appearing on hover or focus must be Dismissible (e.g. via Escape key), Hoverable (cursor can move over the tooltip), and Persistent until dismissed."
    },
    quests: [
      { id: "ds-m1-d19-q1", name: "CSS Stacking Contexts & The Top Layer Paradigm", type: "concept", desc: "Analyze CSS stacking context triggers (z-index, transform, filter, opacity) and contrast with the browser Top Layer API." },
      { id: "ds-m1-d19-q2", name: "Detective Lab: The Clipped Tooltip Inside Scrollable Table", type: "detective", desc: "Refactor 8 clipped tooltips inside a dense financial data table using React Portals and Floating UI flip middleware." },
      { id: "ds-m1-d19-q3", name: "Mastery Assignment: Fully Accessible Tooltip & Avatar Primitive Suite", type: "assignment", desc: "Build an accessible `Tooltip` with Escape dismissal, delay timers, and an `Avatar` component with fallback initials and image error handling." },
      { id: "ds-m1-d19-q4", name: "Production Incident Lab: Tooltip Hover Flickering Infinite Loop", type: "detective", desc: "Fix an infuriating bug where hovering over a trigger made the tooltip appear over the cursor, losing hover on the trigger and causing rapid flickering." }
    ]
  },
  {
    day: 20,
    month: 1,
    blockNum: 4,
    title: "Compound Component Patterns: Tabs, Accordions, and Disclosure State Mechanics (Milestone 3)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Compound Patterns & Milestone 3 Gate)",
    spokenGoal: "Synthesize compound component architectures and deliver Milestone 3: master React Context-driven compound components (`Tabs.List`, `Tabs.Trigger`, `Tabs.Content`), implement disclosure state machines, and enforce WAI-ARIA APG tabs keyboard patterns.",
    conceptInvariant: "Compound State Invariant: Compound components share implicit state via React Context rather than prop drilling. Child components (`TabTrigger`, `TabContent`) must communicate with the root (`Tabs`) through a dedicated context hook that throws if rendered outside the parent.",
    failureMode: "Building a Tabs component that accepts a massive monolithic `tabs={[{ title, content }]}` configuration array, making custom tab headers, icons, badges, and animations virtually impossible without endless prop hacking.",
    tryItFriction: "Build a compound `Accordion` component supporting both single-open and multi-open modes with animated height transitions using CSS grid `grid-template-rows: 0fr -> 1fr`.",
    socraticHints: [
      "Why is `<Tabs.List><Tabs.Trigger>...</Tabs.Trigger></Tabs.List>` better than `<Tabs items={items} />`?",
      "Because it gives the consuming developer total layout and styling flexibility without ballooning the component API!",
      "Use React Context to manage `activeTab` and expose composable compound sub-components."
    ],
    situationalPuzzle: {
      scenario: "A developer builds an accordion for an FAQ section. To animate the expand/collapse transition, they use CSS `transition: height 300ms ease;`. When collapsing, the height transitions smoothly to 0px, but the content inside remains accessible to screen readers and keyboard tab navigation. What critical attribute was neglected?",
      options: [
        "The accordion needed `opacity: 0`.",
        "When collapsed, the accordion panel must have `hidden` or `display: none` applied (or `aria-hidden=\"true\"` and all child controls disabled) so hidden content cannot be focused or read by assistive tech.",
        "The CSS transition should have been 500ms.",
        "The FAQ questions needed `role=\"article\"`."
      ],
      answerIdx: 1,
      debrief: "Collapsed accordion panels must be completely hidden from the accessibility tree and keyboard sequence. Simply animating height to 0px leaves child links and inputs focusable, creating a severe accessibility defect."
    },
    quests: [
      { id: "ds-m1-d20-q1", name: "Compound Component Pattern vs Monolithic Props Array", type: "concept", desc: "Compare API flexibility, bundle size, and developer ergonomics between compound patterns and configuration arrays." },
      { id: "ds-m1-d20-q2", name: "Detective Lab: The Broken Keyboard Navigation in Custom Tabs", type: "detective", desc: "Audit a compound Tabs component where Home/End keys and Left/Right arrows were not bound to tab selection." },
      { id: "ds-m1-d20-q3", name: "Mastery Assignment: Production Compound Accordion with Zero-JS Height Animation", type: "assignment", desc: "Build an accessible `Accordion` compound component with smooth CSS grid-template-rows height animation." },
      { id: "ds-m1-d20-q4", name: "Milestone 3 Gate: Accessible Compound Primitive Suite Delivery", type: "assignment", desc: "Deliver Milestone 3: A suite of Button, TextInput, Selection Controls, and compound Tabs/Accordion with full APG keyboard compliance." }
    ]
  },

  // ─── BLOCK 5: Overlays, Modals, Menus & Headless State Machines (Days 21–25) ─────────────────────
  {
    day: 21,
    month: 1,
    blockNum: 5,
    title: "Modal Dialogs: Focus Locking, Inert Attribute (inert), Body Scroll Lock & Escape Key Traps",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Complex Modal Systems & The Inert Attribute)",
    spokenGoal: "Engineer bulletproof modal dialogs: implement the modern HTML `inert` attribute to freeze background DOM trees, prevent mobile body scroll bleed (`overscroll-behavior`), trap focus cycles, and guarantee focus restoration upon dialog dismissal.",
    conceptInvariant: "Modal Isolation Invariant: When a modal is open, the rest of the application must be marked with the HTML `inert` attribute. This removes background elements from the accessibility tree, prevents pointer clicks, and stops keyboard tabbing in a single native browser operation.",
    failureMode: "Manually iterating over every background DOM element to add `tabindex=\"-1\"` and `aria-hidden=\"true\"`, which fails on dynamically injected elements and breaks if the user opens a nested confirmation dialog.",
    tryItFriction: "Build a native `<dialog>` wrapper or custom modal in React that applies `inert` to the `#root` container, locks body scrollbar width without layout shift, and restores focus to the trigger on close.",
    socraticHints: [
      "Why does adding `overflow: hidden` to `document.body` cause the whole page to jerk horizontally by 15px?",
      "Because removing the browser vertical scrollbar suddenly increases the viewport width by the scrollbar's width!",
      "Calculate the scrollbar width (`window.innerWidth - document.documentElement.clientWidth`) and add matching `padding-right` to `body`."
    ],
    situationalPuzzle: {
      scenario: "On an iOS Safari device, a user opens a modal dialog. When they scroll down inside the modal, once the modal content reaches the bottom, the page background behind the modal suddenly begins scrolling violently (scroll chaining / bounce). How do modern CSS and JS standards prevent this?",
      options: [
        "Set `pointer-events: none` on the entire page.",
        "Apply `overscroll-behavior: contain` on the modal body container, and prevent touchmove events on the backdrop overlay when touching outside scrollable areas.",
        "Disable scrolling on iOS devices completely.",
        "Add a 1000px padding to the bottom of the modal."
      ],
      answerIdx: 1,
      debrief: "`overscroll-behavior: contain` prevents scroll chaining from propagating to parent containers. Combining this with backdrop touch locks prevents mobile background scrolling while keeping the modal interior smoothly scrollable."
    },
    quests: [
      { id: "ds-m1-d21-q1", name: "The HTML inert Attribute vs Legacy aria-hidden Stacks", type: "concept", desc: "Compare native browser `inert` performance and semantics with legacy polyfills for background tree isolation." },
      { id: "ds-m1-d21-q2", name: "Detective Lab: The Escaping Modal Focus & Scrollbar Jitter", type: "detective", desc: "Fix an enterprise modal dialog that shifts the page layout on open and allows keyboard tabbing into the navbar." },
      { id: "ds-m1-d21-q3", name: "Mastery Assignment: Enterprise Modal Dialog & Confirmation Alert", type: "assignment", desc: "Implement an accessible `Dialog` and `AlertDialog` component with native `inert` support, focus restoration, and Escape dismissal." },
      { id: "ds-m1-d21-q4", name: "Production Incident Lab: Nested Modal Focus Restoration Deadlock", type: "detective", desc: "Resolve a bug where closing a 'Delete Confirmation' dialog nested inside an 'Edit Profile' modal restored focus to the wrong trigger." }
    ]
  },
  {
    day: 22,
    month: 1,
    blockNum: 5,
    title: "Popovers & Dropdown Menus: Collision Detection, Viewport Clamping & Outside Click Dismissal",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Dropdown Topologies & Boundary Clamping)",
    spokenGoal: "Architect robust Popovers and Dropdown Menus: master collision detection middleware (flip, shift, size), handle outside pointer dismissal without capturing accidental trigger clicks, and implement WAI-ARIA Menu APG keyboard navigation.",
    conceptInvariant: "Menu vs Listbox Invariant: A Menu (`role=\"menu\"`) represents a list of actions or commands (like an application desktop menu); a Listbox (`role=\"listbox\"`) represents a set of selectable options in a form. Menus should never be used for form data selection.",
    failureMode: "Listening to `document.addEventListener('click')` for outside click dismissal. When a user clicks the trigger to close an open menu, the document listener fires first, closing the menu, and then the trigger click fires, immediately re-opening it.",
    tryItFriction: "Implement a dropdown menu component using `@floating-ui/react` with sub-menu cascading support, outside click handling, and arrow key navigation between menu items.",
    socraticHints: [
      "Why does a dropdown menu toggle instantly back open when clicking the trigger to close it?",
      "Because the outside click handler closes it, but the trigger's click handler immediately toggles it back open!",
      "Use `onPointerDownOutside` or check if the click event target is contained within the trigger before closing."
    ],
    situationalPuzzle: {
      scenario: "A web application has a 'User Settings' dropdown in the top-right corner. On a mobile viewport, opening the menu causes it to extend 60px past the right edge of the screen, creating horizontal overflow and hiding the 'Log Out' button off-screen. What positioning middleware was missing?",
      options: [
        "The dropdown needed `z-index: 999999`.",
        "Floating positioning middleware `shift({ padding: 16 })` was missing — this clamps the floating element inside the viewport boundary by shifting its x-coordinate away from screen edges.",
        "The menu needed `width: 100%`.",
        "The browser window should be resized."
      ],
      answerIdx: 1,
      debrief: "Floating UI's `shift` middleware automatically checks viewport boundaries and pushes the floating element back into the visible viewport, honoring a safety padding boundary."
    },
    quests: [
      { id: "ds-m1-d22-q1", name: "Floating UI Collision Detection Math & Middleware Pipeline", type: "concept", desc: "Trace how offset, shift, flip, and arrow middleware calculate pixel bounding coordinates relative to reference targets." },
      { id: "ds-m1-d22-q2", name: "Detective Lab: The Off-Screen Overflowing Action Menu", type: "detective", desc: "Repair 6 dropdown menus that clip off-screen or jitter violently on window resize using boundary clamping." },
      { id: "ds-m1-d22-q3", name: "Mastery Assignment: Production DropdownMenu & Popover Suite", type: "assignment", desc: "Build an accessible `DropdownMenu` with keyboard sub-menu support, checkable menu items, and portal rendering." },
      { id: "ds-m1-d22-q4", name: "Production Incident Lab: Outside Click Swallowing Legitimate Background Actions", type: "detective", desc: "Fix an outside-click handler that intercepted clicks with `stopPropagation`, preventing users from clicking links on the main page." }
    ]
  },
  {
    day: 23,
    month: 1,
    blockNum: 5,
    title: "Toast Notification Queues: Stack Topologies, Auto-Dismiss Timers & Screen Reader Priority Queues",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Non-Modal Notifications & Timer Physics)",
    spokenGoal: "Engineer an enterprise Toast notification system: implement queue management, handle multiple concurrent toasts with smooth stacking animations, pause auto-dismiss timers on hover or focus, and provide accessible screen reader live region announcements.",
    conceptInvariant: "Timer Pause Invariant: Any notification with an automatic dismiss timer must pause its countdown whenever the user hovers over the toast with a pointer or focuses any element within it with a keyboard (WCAG 2.2 Criterion 2.2.1 Timing Adjustable).",
    failureMode: "Auto-dismissing an error toast with a critical retry action after 3 seconds, leaving slow readers and screen reader users unable to read the message or click 'Retry' before it disappears permanently.",
    tryItFriction: "Build a Toast manager in TypeScript that exposes `toast.success()`, `toast.error()`, queues notifications in a fixed viewport corner, pauses countdown timers on hover, and provides an Undo action.",
    socraticHints: [
      "Why is auto-dismissing an error notification an accessibility violation?",
      "Because users with cognitive or visual impairments need adequate time to perceive and act on the error!",
      "Error toasts should ideally remain persistent until manually dismissed, or have long timers that pause on hover/focus."
    ],
    situationalPuzzle: {
      scenario: "A user deletes a file. A toast appears: 'File moved to trash. [Undo]'. The toast has a 4-second auto-dismiss timer. The user realizes they made a mistake and moves their mouse toward 'Undo'. Just as their cursor reaches the button, the timer expires and the toast disappears, permanently deleting the file. How must this be prevented?",
      options: [
        "Remove the Undo button completely.",
        "Attach `onMouseEnter` and `onFocus` listeners to the toast container to pause the auto-dismiss timer whenever the user hovers or focuses on it, resuming only when the pointer leaves.",
        "Make the toast stay on screen for 60 seconds.",
        "Show a modal confirmation for every single delete."
      ],
      answerIdx: 1,
      debrief: "WCAG 2.2 requires adjustable timing. Pausing auto-dismiss timers on pointer hover or keyboard focus ensures users have sufficient time to interact with toast actions without the target disappearing under them."
    },
    quests: [
      { id: "ds-m1-d23-q1", name: "Toast Queue Architecture: Stacking Topologies & Collision Physics", type: "concept", desc: "Analyze notification queue models: FIFO queues, priority overrides, stack depth limiting, and swipe-to-dismiss gestures." },
      { id: "ds-m1-d23-q2", name: "Detective Lab: The Runaway 20-Toast Avalanche", type: "detective", desc: "Triage a web socket failure that fired 50 rapid error toasts, overlapping and crashing the browser layout." },
      { id: "ds-m1-d23-q3", name: "Mastery Assignment: Enterprise Toast Manager & Animated Viewport Component", type: "assignment", desc: "Build a production-ready Toast library with smooth spring stacking, pause-on-hover, custom actions, and `aria-live` integration." },
      { id: "ds-m1-d23-q4", name: "Production Incident Lab: Ghost Toast Timers Leaking Memory After Route Transition", type: "detective", desc: "Diagnose an uncleaned `setTimeout` memory leak where route navigation left dozens of unmounted toast timers running in background." }
    ]
  },
  {
    day: 24,
    month: 1,
    blockNum: 5,
    title: "Headless State Primitives: Decoupling State from Rendering via Finite State Machines (FSMs)",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (State Machines & Headless Component Architecture)",
    spokenGoal: "Decouple state logic from presentation: understand the headless UI paradigm (Radix UI, Zag.js, React Aria), model complex component interactions using Finite State Machines (FSMs), and eliminate impossible state bugs.",
    conceptInvariant: "Finite State Invariant: A UI component must only exist in exactly one discrete state at any given instant (e.g. `idle`, `open`, `closing`, `disabled`). Boolean state combinations (`isOpen && isClosing && isDisabled`) lead to illegal edge-case states and race conditions.",
    failureMode: "Using 5 boolean flags in a Modal (`isOpen`, `isOpening`, `isClosing`, `isAnimating`, `hasFinished`), leading to a state where `isOpen` is true and `isClosing` is true simultaneously, locking the UI in a frozen semi-transparent state.",
    tryItFriction: "Model an accessible Combobox state machine using a simple reducer or XState machine with explicit states (`idle`, `focused`, `suggesting`, `navigating`) and valid transitions.",
    socraticHints: [
      "Why do boolean state flags like `isLoading` and `isError` cause bugs when combined?",
      "Because both can accidentally be set to `true` at the same time, putting the component into an undefined state!",
      "Replace multiple booleans with an explicit state enum: `status: 'idle' | 'loading' | 'success' | 'error'`."
    ],
    situationalPuzzle: {
      scenario: "A developer builds an animated collapsible panel using two React booleans: `isOpen` and `isAnimating`. Rapidly clicking the toggle button causes both `isOpen` and `isAnimating` to fall out of sync with CSS transition events, leaving the panel permanently stuck at 50% opacity and unresponsive to clicks. What architectural solution prevents this permanently?",
      options: [
        "Add a third boolean flag `isStuck`.",
        "Model the component as a Finite State Machine with explicit discrete states: `closed` -> `opening` -> `open` -> `closing` -> `closed`, ignoring click events during transition phases until transitionend fires.",
        "Remove all animations.",
        "Use `setTimeout(..., 100)` to force the state."
      ],
      answerIdx: 1,
      debrief: "Finite State Machines prevent impossible states by defining mutually exclusive states and strict valid transitions. Discarding invalid event triggers during transitional states completely eliminates animation lockups."
    },
    quests: [
      { id: "ds-m1-d24-q1", name: "The Headless UI Architectural Revolution", type: "concept", desc: "Compare traditional monolithic UI libraries with headless primitives that separate logic/a11y from visual design." },
      { id: "ds-m1-d24-q2", name: "Detective Lab: The Frozen Semi-Closed Drawer Component", type: "detective", desc: "Debug a drawer component locked in an impossible state due to conflicting boolean state variables during rapid user clicking." },
      { id: "ds-m1-d24-q3", name: "Mastery Assignment: Headless Disclosure & Collapsible State Machine Hook", type: "assignment", desc: "Build a headless `useCollapsible` hook powered by an explicit state machine with full keyboard and animation lifecycle events." },
      { id: "ds-m1-d24-q4", name: "Production Incident Lab: TransitionEnd Event Never Firing in Background Tabs", type: "detective", desc: "Fix a bug where toggling a drawer in an inactive browser tab stalled the state machine because browsers throttle transition events." }
    ]
  },
  {
    day: 25,
    month: 1,
    blockNum: 5,
    title: "Component Testing with Storybook 8 & @storybook/addon-a11y Component Gates (Milestone 4)",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Component Documentation & Testing Gates)",
    spokenGoal: "Establish component documentation and automated testing: configure Storybook 8 with Component Story Format (CSF 3.0), implement automated interaction tests using the `play` function, integrate `@storybook/addon-a11y`, and pass Milestone 4.",
    conceptInvariant: "Living Documentation Invariant: Stories are not merely visual catalogs; they are executable component unit tests. Every critical variant, edge-case state, and accessibility permutation must exist as an automated CSF story with verified assertions.",
    failureMode: "Testing components only inside full application pages, allowing visual regressions and keyboard focus bugs in isolated components to go unnoticed until full integration deployments.",
    tryItFriction: "Write a Storybook 8 CSF 3.0 story for a Modal Dialog with an automated `play` function that opens the modal, asserts focus is trapped, presses Escape, and asserts focus returns to the trigger.",
    socraticHints: [
      "What is the advantage of writing component interaction tests inside Storybook using `play` functions?",
      "It tests the real DOM in a real browser environment without needing heavy end-to-end setups!",
      "Use `@storybook/test` (`expect`, `userEvent`) to simulate user interactions directly in isolated stories."
    ],
    situationalPuzzle: {
      scenario: "A PR modifies the `TextInput` component. The automated CI pipeline passes all Jest unit tests. However, when deployed, the input fails contrast in dark mode and fails to announce its error state. Why did standard unit tests miss this, and how does Storybook test runner fix it?",
      options: [
        "Jest does not support React.",
        "Jsdom does not compute actual CSS styles, layout dimensions, or real browser accessibility trees. Storybook Test Runner executes stories in a real Chromium headless browser with Axe-core, catching real computed visual and accessibility defects.",
        "The developer should have manually tested in Internet Explorer.",
        "Jest tests were run in the wrong order."
      ],
      answerIdx: 1,
      debrief: "Jsdom is an in-memory simulation that lacks a real CSS rendering and layout engine. Running Storybook stories in real headless browsers with Axe-core tests true computed contrast, bounding boxes, and accessibility trees."
    },
    quests: [
      { id: "ds-m1-d25-q1", name: "Storybook 8 Architecture: CSF 3.0, Autodocs & Interaction Tests", type: "concept", desc: "Analyze the anatomy of CSF 3.0 stories, controls argument mapping, and interaction testing via the `play` function." },
      { id: "ds-m1-d25-q2", name: "Detective Lab: Triage 10 Accessibility Violations in Storybook A11y Panel", type: "detective", desc: "Inspect a failing Storybook instance, resolve 10 flagged violations (contrast, missing labels, duplicate IDs), and achieve clean passes." },
      { id: "ds-m1-d25-q3", name: "Mastery Assignment: Comprehensive Story Suite with Automated Play Functions", type: "assignment", desc: "Author complete CSF 3.0 stories for Button, Modal, and Dropdown with automated user interaction assertion steps." },
      { id: "ds-m1-d25-q4", name: "Milestone 4 Gate: Storybook 8 Enterprise Component Testing Suite", type: "assignment", desc: "Deliver Milestone 4: A Storybook 8 suite with 100% component coverage, automated a11y gates, and zero accessibility violations." }
    ]
  },

  // ─── BLOCK 6: Performance, Bundling & Month 1 Capstone (Days 26–30) ──────────────────────────────
  {
    day: 26,
    month: 1,
    blockNum: 6,
    title: "CSS-in-JS vs Zero-Runtime CSS (Tailwind v4, Vanilla Extract, CSS Modules) Performance Cost Model",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (CSS Performance Architecture)",
    spokenGoal: "Evaluate the runtime cost of styling solutions: profile the JavaScript execution overhead of runtime CSS-in-JS (Styled Components, Emotion), and master zero-runtime alternatives (Tailwind v4, Vanilla Extract, CSS Modules) for high-performance enterprise applications.",
    conceptInvariant: "Zero-Runtime Styling Invariant: Styling decisions must occur at build time. Injecting dynamic `<style>` tags via JavaScript at runtime causes style recalculation storms, blocks React Server Components (RSC), and degrades Interaction to Next Paint (INP).",
    failureMode: "Using Emotion or Styled Components with dynamic props (`styled.div(props => ({ padding: props.size }))`) in a large table with 1,000 rows, generating 1,000 unique style tags and freezing the browser main thread for 800ms on every render.",
    tryItFriction: "Profile a 1,000-item list rendered with runtime CSS-in-JS vs zero-runtime Tailwind v4 using Chrome DevTools Performance profiler, measuring scripting time and style recalculation duration.",
    socraticHints: [
      "Why does runtime CSS-in-JS perform poorly in large data lists?",
      "Because on every render, it hashes props, computes CSS strings, and inserts new CSS rules into the browser stylesheet!",
      "Use zero-runtime static CSS or pre-compiled atomic utility classes where classes exist in static CSS files."
    ],
    situationalPuzzle: {
      scenario: "An enterprise trading platform migrates to React Server Components (RSC) and Next.js App Router. The team discovers that their component library built on Styled Components fails to render on the server with hydration errors and severe style flashing. What is the fundamental architectural incompatibility?",
      options: [
        "React Server Components do not support CSS.",
        "Runtime CSS-in-JS requires client-side React Context and runtime style tag injection, which cannot execute inside server-only streaming components. Zero-runtime static CSS (Vanilla Extract, Tailwind, CSS Modules) is required.",
        "Next.js only supports Sass.",
        "The server CPU was maxed out."
      ],
      answerIdx: 1,
      debrief: "Runtime CSS-in-JS relies on client-side React Context to collect and inject styles into the DOM. React Server Components stream pure HTML without client React Context, requiring pre-compiled static CSS files."
    },
    quests: [
      { id: "ds-m1-d26-q1", name: "CSS Runtime Cost Model: Scripting vs Style Recalculation vs Paint", type: "concept", desc: "Profile browser rendering pipeline stages and measure the runtime impact of CSS-in-JS on Core Web Vitals (INP, LCP)." },
      { id: "ds-m1-d26-q2", name: "Detective Lab: The 1,000-Row Table Main-Thread Freeze", type: "detective", desc: "Profile a sluggish data table, identify 450ms wasted on runtime CSS hashing, and migrate to zero-runtime static CSS." },
      { id: "ds-m1-d26-q3", name: "Mastery Assignment: Zero-Runtime Style Migration Benchmark", type: "assignment", desc: "Build identical component variants in Emotion and Tailwind v4, benchmark render latency across 5,000 nodes, and document results." },
      { id: "ds-m1-d26-q4", name: "Production Incident Lab: Dynamic Prop Hashes Overflowing Browser Stylesheets", type: "detective", desc: "Triage a memory leak where continuous animation using styled-component props generated 50,000 unique CSS classes." }
    ]
  },
  {
    day: 27,
    month: 1,
    blockNum: 6,
    title: "Iconography Architecture: Inline SVG vs SVG Sprite Sheets vs Icon Fonts (Paint & Tree-shaking Costs)",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Vector Asset Engineering)",
    spokenGoal: "Architect high-performance iconography systems: evaluate inline SVGs vs SVG sprite sheets (`<use href=\"#icon\">`) vs font icons, optimize SVG paths with SVGO, and guarantee proper tree-shaking so unused icons never bloat bundle size.",
    conceptInvariant: "Tree-Shaking Icon Invariant: An icon library must never export icons from a giant monolithic barrel file without `sideEffects: false`. Consuming a single icon (`import { Check } from 'my-icons'`) must not pull all 1,500 SVG definitions into the bundle.",
    failureMode: "Inlining 500 duplicate complex SVG icons in a single table, duplicating 50,000 DOM nodes and causing massive DOM size warnings and sluggish scrolling performance.",
    tryItFriction: "Build an automated SVG build pipeline using SVGO that optimizes raw Figma SVG exports, strips unnecessary metadata/ids, and generates both individual React components and an SVG sprite sheet.",
    socraticHints: [
      "Why is bundling all icons as inline React components harmful for bundle size?",
      "Because SVG path coordinate strings are large pieces of JavaScript code that must be downloaded, parsed, and executed!",
      "Use SVG sprite sheets with `<svg><use href=\"/sprite.svg#icon-check\" /></svg>` to load icons via browser image caching."
    ],
    situationalPuzzle: {
      scenario: "A developer imports one icon: `import { ChevronDown } from '@company/icons'`. In the production bundle analyzer, the entire 2.5 MB icon library containing 2,000 icons is bundled into the main chunk. What package configuration was missing in `@company/icons`?",
      options: [
        "The icons needed to be PNG files.",
        "The package lacked `\"sideEffects\": false` in its `package.json` and bundled all icons through a single barrel file without ESM tree-shaking, forcing Webpack/Vite to bundle the entire library.",
        "The developer imported the icon with lowercase letters.",
        "The browser does not support SVG tree-shaking."
      ],
      answerIdx: 1,
      debrief: "`\"sideEffects\": false` informs bundlers that files in the package contain no global side effects. Combined with ES module exports, this enables the bundler to discard all unused icons during dead code elimination."
    },
    quests: [
      { id: "ds-m1-d27-q1", name: "Icon Delivery Trade-Offs: Inline SVG vs Sprites vs Web Fonts", type: "concept", desc: "Compare DOM footprint, CSS restyling flexibility, HTTP caching, and bundle overhead across icon architectures." },
      { id: "ds-m1-d27-q2", name: "Detective Lab: The 2.5MB Un-Tree-Shaken Icon Bundle Leak", type: "detective", desc: "Audit a web app's bundle stats, diagnose why importing 3 icons bundled 1,200, and fix the package build configuration." },
      { id: "ds-m1-d27-q3", name: "Mastery Assignment: Automated SVGO & Icon Component Build Pipeline", type: "assignment", desc: "Build a Node.js build script that takes raw SVG files, optimizes them via SVGO, and outputs tree-shakeable React components." },
      { id: "ds-m1-d27-q4", name: "Production Incident Lab: SVG ID Namespace Collisions Corrupting Gradients", type: "detective", desc: "Fix an incident where multiple inline SVGs used identical `id=\"linear-gradient\"`, causing all icons to turn black or wrong color." }
    ]
  },
  {
    day: 28,
    month: 1,
    blockNum: 6,
    title: "Component Library Packaging: Rollup/Vite, ESM/CJS Dual Publishing, Side-Effects & Barrel Exports",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Library Bundling & Distribution)",
    spokenGoal: "Package and distribute an enterprise component library: configure Rollup/tsup for dual ESM/CJS publishing, configure `exports` maps in `package.json`, eliminate barrel file performance penalties, and preserve TypeScript type definitions.",
    conceptInvariant: "Modern Package Exports Invariant: An enterprise library must use the Node.js `\"exports\"` field in `package.json` to define subpath exports (`./button`, `./tokens`) with explicit `import` (ESM) and `require` (CJS) conditions and matching `.d.ts` declaration paths.",
    failureMode: "Publishing a single monolithic `index.js` bundle with mixed CJS/ESM modules, causing consumers using Next.js or Vite to crash with `SyntaxError: Cannot use import statement outside a module`.",
    tryItFriction: "Configure a `tsup` build configuration that compiles a TypeScript component library into separate ESM and CJS bundles, emits `.d.ts` declaration maps, and validates tree-shaking with `publint`.",
    socraticHints: [
      "Why should you provide subpath exports (like `@company/ui/button`) instead of forcing all imports through the root package?",
      "Because importing from the root barrel file forces bundlers to parse hundreds of modules before resolving a single component!",
      "Subpath exports allow direct, instant module resolution with zero unused code overhead."
    ],
    situationalPuzzle: {
      scenario: "A developer installs `@design-system/core` in a Next.js application. Running `npm run build` fails with `Module not found: Can't resolve '@design-system/core/button'`. The author confirmed `dist/button.js` exists. What was missing in `@design-system/core/package.json`?",
      options: [
        "The package needed to be published to a private registry.",
        "The `package.json` lacked the `\"exports\"` field defining subpath mapping: `\"./button\": { \"import\": \"./dist/button.mjs\", \"types\": \"./dist/button.d.ts\" }`.",
        "Next.js cannot import external libraries.",
        "The button needed to be an internal file."
      ],
      answerIdx: 1,
      debrief: "Modern package managers and bundlers require explicit `\"exports\"` mappings in `package.json` to support subpath imports. Without `\"./button\"` defined in `exports`, consumers cannot import submodules."
    },
    quests: [
      { id: "ds-m1-d28-q1", name: "Modern NPM Package Architecture: Dual ESM/CJS, Types & Subpaths", type: "concept", desc: "Analyze `package.json` fields: `module`, `main`, `exports`, `typesVersions`, and conditional export resolution." },
      { id: "ds-m1-d28-q2", name: "Detective Lab: Auditing a Broken NPM Package with Publint & Are-The-Types-Wrong", type: "detective", desc: "Run `publint` on a broken component library package, diagnose 6 packaging errors, and fix all export maps." },
      { id: "ds-m1-d28-q3", name: "Mastery Assignment: Zero-Config Component Library Build Engine with tsup", type: "assignment", desc: "Set up a complete build configuration with tsup, compiling TypeScript components to ESM/CJS with preserved directives (`'use client'`)." },
      { id: "ds-m1-d28-q4", name: "Production Incident Lab: Missing 'use client' Directive Breaking Next.js App Router", type: "detective", desc: "Fix an incident where interactive components crashed Next.js consumers because the bundler stripped the `'use client'` directive." }
    ]
  },
  {
    day: 29,
    month: 1,
    blockNum: 6,
    title: "Visual Regression Testing Foundations: Playwright Component Testing & Pixel Diffing",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Automated Pixel Verification)",
    spokenGoal: "Guard against unintended UI regressions: configure Playwright Component Testing, establish screenshot pixel-diffing baselines, handle dynamic anti-aliasing variations, and mask flaky content (dates, avatars, animations).",
    conceptInvariant: "Visual Determinism Invariant: Visual regression tests must execute in a hermetic, deterministic environment. Fonts, animations, carousels, and system clocks must be frozen (`page.clock.setFixedTime()`, `animations: 'disabled'`) to prevent false-positive diff failures.",
    failureMode: "Running visual regression tests against live timestamps ('Updated 2 seconds ago'), causing tests to fail on every single test run with a 2% pixel difference because the timestamp text changed.",
    tryItFriction: "Write a Playwright visual regression test that navigates to a component story, disables animations, freezes the system clock, masks dynamic avatars, and asserts `toHaveScreenshot()` with a 0.1% threshold.",
    socraticHints: [
      "Why do visual regression tests frequently fail in CI even when code didn't change?",
      "Because font rendering and GPU rasterization differ subtly between macOS (developer laptop) and Linux (CI runner)!",
      "Run visual regression tests inside a standardized Docker container with identical Linux font libraries."
    ],
    situationalPuzzle: {
      scenario: "A visual regression test for a UserProfile card fails intermittently in CI with a 0.5% pixel mismatch. Comparing the screenshots reveals that the user's relative signup date says 'Joined 5 minutes ago' in one run and 'Joined 6 minutes ago' in the next. How must the test harness eliminate this flakiness?",
      options: [
        "Increase the pixel diff tolerance to 20%.",
        "Freeze the system clock using `await page.clock.setFixedTime(...)` and use Playwright's `mask: [page.locator('.timestamp')]` option to mask dynamic text elements during screenshot comparison.",
        "Delete the test.",
        "Run the test only once per day."
      ],
      answerIdx: 1,
      debrief: "Dynamic data (timestamps, randomized avatars, animations) must be neutralized in visual regression testing. Freezing time or masking dynamic elements ensures screenshot comparisons only evaluate true CSS/layout changes."
    },
    quests: [
      { id: "ds-m1-d29-q1", name: "Visual Regression Testing Architecture & Pixel Diff Algorithms", type: "concept", desc: "Analyze pixelmatch algorithms, SSIM (Structural Similarity Index), anti-aliasing tolerance, and threshold tuning." },
      { id: "ds-m1-d29-q2", name: "Detective Lab: Eliminating Flaky Tests in a Visual Regression Suite", type: "detective", desc: "Triage a suite of 15 failing visual tests, diagnose causes (blinking cursors, CSS animations, live clocks), and stabilize them." },
      { id: "ds-m1-d29-q3", name: "Mastery Assignment: Playwright Visual Regression CI Test Suite", type: "assignment", desc: "Build an automated Playwright visual regression test suite capturing mobile and desktop snapshots across 10 component stories." },
      { id: "ds-m1-d29-q4", name: "Production Incident Lab: Unintended Global CSS Cascade Leak Caught by CI", type: "detective", desc: "Catch and remediate a regression where modifying a global paragraph line-height broke vertical alignment in 40 components." }
    ]
  },
  {
    day: 30,
    month: 1,
    blockNum: 6,
    title: "Month 1 Capstone Viva Gate: PrismUI Accessible Enterprise Component Library",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Month 1 Capstone Viva Defense)",
    spokenGoal: "Defend the Month 1 Capstone: present PrismUI, a complete, accessible, production-hardened component library featuring validated W3C design tokens, atomic and compound primitives, WCAG 2.2 AAA compliance, and 100% Storybook test coverage before the architectural board.",
    conceptInvariant: "PrismUI Architectural Contract: The library must pass all 4 architectural gates: (1) 100% tokenized via W3C DTCG schema, (2) Zero-runtime CSS bundling with subpath exports, (3) WCAG 2.2 AAA accessibility compliance verified by Axe-core and keyboard navigation, and (4) Zero-FOUC runtime theming.",
    failureMode: "Failing the Capstone viva by submitting components with unhandled keyboard traps, missing ARIA live regions, broken subpath exports, or hardcoded pixel values.",
    tryItFriction: "Subject PrismUI to a live adversarial review: simulate keyboard-only screen reader navigation across nested dialogs, trigger theme inversion, and run full Axe-core accessibility scanners.",
    socraticHints: [
      "What are the 4 core pillars of an enterprise-grade component library?",
      "Design tokens, headless accessibility, composable compound architecture, and automated verification!",
      "Defend every component decision based on WAI-ARIA APG standards and web performance metrics."
    ],
    situationalPuzzle: {
      scenario: "During the Month 1 Capstone Viva Defense, the senior architectural review board asks: 'Your Button and Dialog components are styled with CSS Custom Properties. If an enterprise customer embeds your component inside an existing legacy application that defines `* { box-sizing: content-box; font-family: Comic Sans; }`, how does PrismUI guarantee that its internal components will not be visually distorted?' How do you defend your architecture?",
      options: [
        "Tell the customer they must rewrite their legacy application.",
        "PrismUI encapsulates all component resets within CSS Cascade Layers (`@layer prism.reset, prism.components;`) and applies explicit CSS custom property defaults with `:where()` selectors and `box-sizing: border-box` scoped to component roots.",
        "Use `!important` on every single CSS property.",
        "Render every component inside an `<iframe>`."
      ],
      answerIdx: 1,
      debrief: "Enterprise design systems isolate themselves from host application style bleeding using CSS Cascade Layers (`@layer`) and scoped component-level resets, ensuring consistent box-sizing and typography without polluting global styles."
    },
    quests: [
      { id: "ds-m1-d30-q1", name: "PrismUI Architecture & Component Contract Documentation", type: "concept", desc: "Document the complete architectural specification, token topology, and component contracts of PrismUI." },
      { id: "ds-m1-d30-q2", name: "Adversarial Lab: Live Keyboard & Screen Reader Stress Test", type: "detective", desc: "Navigate the entire PrismUI component catalog using only keyboard and VoiceOver/NVDA, verifying APG compliance." },
      { id: "ds-m1-d30-q3", name: "Mastery Assignment: PrismUI Monorepo Packaging & Dual Publishing", type: "assignment", desc: "Bundle and package PrismUI with tsup, generating clean ESM/CJS distributions, subpath exports, and TypeScript types." },
      { id: "ds-m1-d30-q4", name: "Month 1 Capstone Viva Gate: PrismUI Live Architectural Defense", type: "assignment", desc: "Defend PrismUI live before the senior engineering board, proving zero a11y violations, fluid typography, and subpath bundling." }
    ]
  }
];

export const DESIGN_SYSTEMS_MONTH_2_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 7: Multi-Brand Token Pipelines & Style Dictionary Automation (Days 31–35) ─────────────
  {
    day: 31,
    month: 2,
    blockNum: 7,
    title: "Multi-Brand & Multi-Platform Architecture: Global, Semantic & Component Token Tiering",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Multi-Brand Token Architecture)",
    spokenGoal: "Architect white-label enterprise token systems: design a 3-tier token topology capable of supporting multiple distinct brands (e.g. Luxury vs Discount vs B2B) across multiple platforms (Web, iOS, Android) from a single source of truth.",
    conceptInvariant: "Multi-Brand Aliasing Invariant: Global tokens hold raw values for each brand; Semantic tokens alias global tokens by functional role (`brand-accent`, `surface-background`); Component tokens alias semantic tokens. Changing a brand requires ONLY swapping the Global-to-Semantic mapping.",
    failureMode: "Creating completely separate, duplicated component libraries for each brand, multiplying maintenance overhead by 3x and causing components to diverge within months.",
    tryItFriction: "Design a token schema in JSON that powers two completely different brands ('Fintech Pro' with sharp edges and cool blues, and 'Retail Joy' with pill rounded borders and warm oranges) using identical component code.",
    socraticHints: [
      "How do you change the border radius of all buttons across Brand A to 0px and Brand B to 9999px without editing the Button component?",
      "By binding the button's border radius to a component token `button.border-radius`!",
      "`button.border-radius` points to `radius.interactive`, which resolves to `0px` in Brand A and `9999px` in Brand B."
    ],
    situationalPuzzle: {
      scenario: "A holding company owns three travel brands. They build a shared design system. Brand A demands a sharp, high-density corporate layout (small padding, square corners, dark tones). Brand B demands a breezy, playful layout (large padding, pill corners, bright pastels). How does the design system architect support both without maintaining two codebases?",
      options: [
        "Write `if (brand === 'A')` statements inside all 80 components.",
        "Implement a 3-tier design token architecture where spatial and aesthetic variables (`radius.card`, `spacing.container`, `color.surface`) are defined as semantic tokens that resolve to brand-specific global token sets.",
        "Tell the executive team that all brands must look identical.",
        "Use separate CSS files that overwrite component classes with `!important`."
      ],
      answerIdx: 1,
      debrief: "A 3-tier token system completely decouples component implementation from brand expression. Components only reference semantic/component tokens; brand themes simply inject different token resolution dictionaries."
    },
    quests: [
      { id: "ds-m2-d31-q1", name: "3-Tier Enterprise Token Topology & Aliasing Graphs", type: "concept", desc: "Construct a dependency directed acyclic graph (DAG) showing token resolution across Global, Semantic, and Component tiers." },
      { id: "ds-m2-d31-q2", name: "Detective Lab: The Leaky Multi-Brand Component Repository", type: "detective", desc: "Audit a component repository littered with `brand === 'X'` conditional checks and refactor to clean semantic token aliases." },
      { id: "ds-m2-d31-q3", name: "Mastery Assignment: Multi-Brand Token Dictionary Specification", type: "assignment", desc: "Author a complete W3C DTCG JSON token catalog supporting 3 distinct corporate brands with full typography, color, and shape scales." },
      { id: "ds-m2-d31-q4", name: "Production Incident Lab: Unmapped Token Breaking Secondary Brand Theme", type: "detective", desc: "Triage a production bug where launching a new brand caused all modal dialogs to render transparent due to an unaliased token." }
    ]
  },
  {
    day: 32,
    month: 2,
    blockNum: 7,
    title: "Style Dictionary 4.0: Custom Parsers, Transforms, Filters & Cross-Platform Export (Web, iOS, Android)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Token Compilation & Cross-Platform Compilers)",
    spokenGoal: "Build an automated design token compilation engine: master Style Dictionary 4.0, write custom transforms and formatters, and compile JSON tokens into CSS Custom Properties (Web), Swift structs (iOS), and Kotlin Compose objects (Android).",
    conceptInvariant: "Single Source of Truth Invariant: Token values must be defined once in platform-agnostic JSON. Platform artifacts (CSS, SCSS, Swift, Kotlin, Flutter) must be compiled deterministically by CI build pipelines, never manually edited.",
    failureMode: "Manually copying color hex values from Figma into both an iOS Swift file and a Web CSS file, leading to inevitable human typos and color mismatches between mobile apps and the web platform.",
    tryItFriction: "Configure Style Dictionary 4.0 to parse W3C DTCG token JSON and output both CSS variables formatted in `rem` and Kotlin Compose Color values formatted as `Color(0xFF...)`.",
    socraticHints: [
      "Why can't mobile platforms consume CSS Custom Properties directly?",
      "Because iOS (SwiftUI) and Android (Jetpack Compose) are native environments that require typed code constructs!",
      "Use Style Dictionary to compile the same source JSON into platform-native code (Swift structs and Kotlin objects)."
    ],
    situationalPuzzle: {
      scenario: "A fintech startup launches its mobile app and web portal. The marketing team updates the primary brand blue from `#0055ff` to `#0044ee`. The web team updates their CSS, but the mobile team forgets to update their Swift file. For 3 months, mobile and web display different brand colors. How does Staff Platform Engineering solve this at the root?",
      options: [
        "Send weekly reminder emails to the mobile team.",
        "Establish an automated token pipeline using Style Dictionary: designers update tokens in Git, and a CI action compiles and publishes npm packages for Web, Swift Package Manager for iOS, and Maven artifacts for Android.",
        "Remove custom branding from mobile apps.",
        "Force mobile apps to run inside web views."
      ],
      answerIdx: 1,
      debrief: "Style Dictionary automates cross-platform token distribution. Compiling from a single Git repository directly into platform-native package managers (NPM, SPM, Maven) eliminates human error and cross-platform drift."
    },
    quests: [
      { id: "ds-m2-d32-q1", name: "Style Dictionary 4.0 Architecture: Transforms, Formats & Actions", type: "concept", desc: "Analyze how Style Dictionary processes tokens: reading, matching, transforming (name, size, color), and formatting into output files." },
      { id: "ds-m2-d32-q2", name: "Detective Lab: The Corrupted Swift & Kotlin Token Compilation", type: "detective", desc: "Debug a Style Dictionary build script where box-shadows and fluid clamp functions crashed the native Swift compiler." },
      { id: "ds-m2-d32-q3", name: "Mastery Assignment: Cross-Platform Token Compiler Build Pipeline", type: "assignment", desc: "Build a complete Style Dictionary 4.0 pipeline that compiles W3C DTCG tokens into CSS, Swift, and Jetpack Compose." },
      { id: "ds-m2-d32-q4", name: "Production Incident Lab: Rem vs Px Mismatch Breaking Native Mobile Layouts", type: "detective", desc: "Resolve a bug where web spacing tokens formatted as `rem` caused Android widgets to render with sub-pixel micro sizes." }
    ]
  },
  {
    day: 33,
    month: 2,
    blockNum: 7,
    title: "Figma Tokens & Variables Sync: Bidirectional Git Automation via Figma REST API & Webhooks",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Design-to-Code Automation)",
    spokenGoal: "Bridge the gap between design and code: build an automated bidirectional synchronization pipeline using the Figma REST API and GitHub Actions, converting Figma Variables directly into Git-versioned tokens and opening automated PRs.",
    conceptInvariant: "Automated Bridge Invariant: Designers must manage visual design variables in Figma; developers must consume them in Git. No human should ever manually transcribe tokens between Figma and code; automation must handle export, translation, and PR creation.",
    failureMode: "Relying on manual designer-developer handoff meetings where designers paste hex codes into Slack messages, resulting in weeks of lag time for token updates and frequent human transcription errors.",
    tryItFriction: "Write a Node.js script that authenticates with the Figma REST API, extracts variables from a Figma file (`GET /v1/files/:key/variables/local`), and converts them into W3C DTCG JSON format.",
    socraticHints: [
      "How does Figma represent variables via its REST API?",
      "It returns `variableCollections` and `variables` with types (COLOR, FLOAT, STRING) and mode values (e.g. Light vs Dark)!",
      "Map Figma variable modes directly to your semantic token tiers, and output formatted JSON into your repository."
    ],
    situationalPuzzle: {
      scenario: "A lead designer updates 40 color variables in the company's Figma UI kit for a major product overhaul. Instead of scheduling a 2-hour handoff meeting, the designer simply clicks 'Publish Library' in Figma. 60 seconds later, a GitHub Pull Request appears in the design system repo titled 'feat(tokens): automated sync from Figma'. What automated workflow made this possible?",
      options: [
        "A developer was watching the designer's screen and typed fast.",
        "A Figma Webhook notified a GitHub Actions workflow, which fetched the latest variables via the Figma REST API, ran Style Dictionary transformations, and created a validated PR via GitHub CLI.",
        "Figma directly edits Git repositories.",
        "The browser extension automated the typing."
      ],
      answerIdx: 1,
      debrief: "Modern enterprise design pipelines use Figma REST API webhooks triggered upon library publication. A CI action extracts variables, compiles tokens, runs tests, and opens an automated PR with full changelogs."
    },
    quests: [
      { id: "ds-m2-d33-q1", name: "Figma Variables API Schema & W3C DTCG Mapping Model", type: "concept", desc: "Map Figma variable data models (collections, modes, variable types) to the W3C DTCG token JSON specification." },
      { id: "ds-m2-d33-q2", name: "Detective Lab: The Broken Hex Handoff & Naming Mismatch", type: "detective", desc: "Audit a failed token sync where Figma variable names contained spaces and emojis, breaking CSS Custom Property naming." },
      { id: "ds-m2-d33-q3", name: "Mastery Assignment: Automated Figma-to-GitHub Token Sync Pipeline", type: "assignment", desc: "Build a GitHub Action script that queries the Figma REST API, transforms variables to DTCG tokens, and generates a formatted PR." },
      { id: "ds-m2-d33-q4", name: "Production Incident Lab: Accidental Variable Deletion Wiping Production Tokens", type: "detective", desc: "Implement safety guardrails in a token sync action that rejects incoming Figma updates if more than 10% of tokens are deleted." }
    ]
  },
  {
    day: 34,
    month: 2,
    blockNum: 7,
    title: "Dynamic Runtime Theme Switching: CSS Variable Inversion, Theme Providers & Contrast Guarantees",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Runtime Inversion & Scoped Themes)",
    spokenGoal: "Architect dynamic nested theming: implement CSS Custom Property inversion for high-contrast, dark, and brand themes, support nested theme contexts (e.g. a dark sidebar inside a light application), and guarantee mathematical contrast ratios at runtime.",
    conceptInvariant: "Contextual Inversion Invariant: When an inverted theme is applied to a container (`data-theme=\"inverted\"`), all semantic surface and text tokens inside that subtree must flip roles simultaneously, ensuring nested buttons and inputs inherit correct local contrast.",
    failureMode: "Inverting a container's background to dark (`background: #111`) without scoping text and border variables, causing child form controls to inherit light-theme text colors and render invisible dark-on-dark text.",
    tryItFriction: "Create a React `ThemeProvider` component that supports arbitrary nesting, where wrapping any section in `<Theme name=\"dark\">` correctly flips all child buttons, inputs, and cards without CSS specificity hacks.",
    socraticHints: [
      "How do CSS Custom Properties make nested theming trivial?",
      "Because CSS variables follow the DOM cascade and inheritance tree naturally!",
      "Redeclaring `--surface-bg: #1e293b` on `.theme-dark` re-points all child components inside that DOM subtree automatically."
    ],
    situationalPuzzle: {
      scenario: "An enterprise banking application is primarily light mode. On the dashboard, a 'Security Alerts' card has a dark blue background to draw attention. Inside this dark card, a junior developer places a standard `Button variant=\"secondary\"`. The button renders with a dark gray background and black text, completely unreadable against the dark blue card. What theming invariant was violated?",
      options: [
        "The button component has a bug.",
        "The dark card failed to establish a scoped theme context (`data-theme=\"dark\"`). Without a scoped theme boundary, child components continue resolving tokens from the root light theme rather than adapting to their local surface.",
        "Secondary buttons cannot be used inside cards.",
        "The user's monitor brightness was too low."
      ],
      answerIdx: 1,
      debrief: "Whenever a container introduces a contrasting background, it must establish a scoped theme boundary. Scoped themes re-bind semantic tokens (`surface`, `text`, `border`) so all nested child components adapt automatically."
    },
    quests: [
      { id: "ds-m2-d34-q1", name: "Scoped CSS Variable Inheritance & Cascade Trees", type: "concept", desc: "Trace how browser style engines resolve CSS Custom Properties down the DOM tree across nested theme boundaries." },
      { id: "ds-m2-d34-q2", name: "Detective Lab: The Unreadable Nested Dark Card Investigation", type: "detective", desc: "Diagnose 8 instances of unreadable text in nested dark sections across a light-mode portal and apply scoped theme contexts." },
      { id: "ds-m2-d34-q3", name: "Mastery Assignment: Nested Scoped Theme Provider & Inversion Utility", type: "assignment", desc: "Build a React `ThemeProvider` and CSS token architecture that supports arbitrary nested theme switching with contrast guarantees." },
      { id: "ds-m2-d34-q4", name: "Production Incident Lab: High Contrast Mode Inversion Defect in Windows", type: "detective", desc: "Resolve a critical accessibility defect where custom background colors broke Windows High Contrast Mode (Forced Colors Mode)." }
    ]
  },
  {
    day: 35,
    month: 2,
    blockNum: 7,
    title: "Token Linting & Governance: Automated AST Scanners Preventing Hardcoded Hex & Spacing (Milestone 6)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Governance, Linting & Milestone 6 Gate)",
    spokenGoal: "Enforce design system governance through code: build automated ESLint and Stylelint AST plugins that detect and forbid hardcoded hex codes, raw pixel spacings, and untokenized styles in PRs, and deliver Milestone 6.",
    conceptInvariant: "Zero-Raw-Values Invariant: No application codebase may contain raw color literals (`#...`, `rgb(...)`) or arbitrary pixel values in component styling. Any PR introducing untokenized styling must fail automated CI linting gates.",
    failureMode: "Relying on human code reviewers to spot hardcoded `#2563eb` or `padding: 13px` during PR reviews, leading to hundreds of untokenized styling leaks entering the production codebase.",
    tryItFriction: "Write a custom ESLint / Stylelint rule in TypeScript that uses PostCSS / Babel AST to flag any CSS declaration using a hex color or raw pixel padding, suggesting the nearest design token alias.",
    socraticHints: [
      "Why is automated linting essential for design system adoption?",
      "Because developers under tight deadlines will naturally take shortcuts and paste raw hex values from Figma!",
      "An automated linter blocks PRs with hardcoded values and suggests the exact matching design token automatically."
    ],
    situationalPuzzle: {
      scenario: "A 100-engineer engineering organization launches a new design system. Three months later, a code audit reveals that 40% of newly written frontend code contains hardcoded hex colors and arbitrary pixel margins. The design system team is frustrated that engineers are ignoring guidelines. What structural governance tool was missing?",
      options: [
        "A stern email from the VP of Engineering.",
        "Automated AST Linting CI Gates: An ESLint / Stylelint rule enforced in pre-commit hooks and CI that automatically fails builds when raw hex codes or pixel spacings are detected, offering autofix suggestions to tokens.",
        "A mandatory 4-hour daily training session.",
        "Disabling developer write access to CSS files."
      ],
      answerIdx: 1,
      debrief: "Design system adoption cannot rely on goodwill alone. Enforcing automated AST linting in CI and pre-commit hooks guarantees that untokenized code cannot be merged, providing instant educational feedback to developers."
    },
    quests: [
      { id: "ds-m2-d35-q1", name: "AST-Based Static Analysis for Design System Governance", type: "concept", desc: "Analyze how Babel, PostCSS, and ESLint parse code into Abstract Syntax Trees (ASTs) to detect illegal styling patterns." },
      { id: "ds-m2-d35-q2", name: "Detective Lab: Auditing 500 Component Commits for Token Leaks", type: "detective", desc: "Run an automated AST scanner across a large repository, detect 350 raw color and spacing leaks, and map them to tokens." },
      { id: "ds-m2-d35-q3", name: "Mastery Assignment: Custom Stylelint & ESLint Token Enforcement Plugin", type: "assignment", desc: "Build an open-source ESLint / Stylelint plugin that forbids raw CSS values and provides automated `--fix` token suggestions." },
      { id: "ds-m2-d35-q4", name: "Milestone 6 Gate: Multi-Brand Token Engine & Automated Governance Gate", type: "assignment", desc: "Deliver Milestone 6: A multi-brand Style Dictionary compiler with automated Figma sync and CI token linting gates." }
    ]
  },

  // ─── BLOCK 8: Advanced Enterprise Components: Comboboxes, Pickers & Data Grids (Days 36–40) ──────
  {
    day: 36,
    month: 2,
    blockNum: 8,
    title: "High-Performance Virtualization: Virtualized List Rendering, Overscan Math & DOM Recycling",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (DOM Virtualization Physics)",
    spokenGoal: "Master DOM virtualization for massive datasets: understand why rendering 10,000 DOM nodes destroys browser performance, implement virtual windowing algorithms, calculate overscan buffer zones, and maintain 60 FPS scrolling.",
    conceptInvariant: "DOM Constant Overhead Invariant: The number of DOM nodes in a virtualized container must remain strictly constant ($O(1)$ relative to total dataset size), rendering only the elements currently visible within the scroll viewport plus an overscan buffer.",
    failureMode: "Rendering a full 10,000-item customer list directly into the DOM, consuming 400 MB of RAM, freezing the browser during scrolling, and crashing mobile devices with out-of-memory errors.",
    tryItFriction: "Build a virtualized list component in React from scratch that calculates `startIndex` and `endIndex` from `scrollTop`, translates items using `transform: translateY(...)`, and renders smoothly.",
    socraticHints: [
      "How does a virtualized list know which items to render?",
      "By dividing the container's `scrollTop` by the item height to find the `startIndex`!",
      "`endIndex` is `startIndex + (viewportHeight / itemHeight)`. Render only that slice with absolute positioning."
    ],
    situationalPuzzle: {
      scenario: "A developer builds a virtualized list for 5,000 items. While scrolling slowly, the list works well. But when a user scrolls rapidly, blank white gaps appear for 100 milliseconds before items pop into view (flickering / checkerboarding). What algorithmic optimization was missing?",
      options: [
        "The computer GPU is too slow.",
        "Overscan Buffer Zone: The virtualization engine did not render an overscan buffer (extra items above and below the visible viewport), so fast scrolling outpaces DOM rendering before new items can mount.",
        "The item height should be 0px.",
        "The list should use pagination instead."
      ],
      answerIdx: 1,
      debrief: "An overscan buffer renders a small pool of extra items (e.g. 5 items above and below the viewport). This pre-renders content so rapid scrolling never reveals unrendered blank spaces."
    },
    quests: [
      { id: "ds-m2-d36-q1", name: "Virtualization Physics: Windowing, Dynamic Heights & Scroll Anchoring", type: "concept", desc: "Derive mathematical formulas for scroll offset calculations, variable-height estimation, and scroll anchoring." },
      { id: "ds-m2-d36-q2", name: "Detective Lab: The Checkerboarding Virtual List Investigation", type: "detective", desc: "Profile a choppy, flickering virtual list with Chrome Performance panel, diagnose overscan starvation, and stabilize scrolling." },
      { id: "ds-m2-d36-q3", name: "Mastery Assignment: Production-Grade Virtualized List from Scratch", type: "assignment", desc: "Implement a zero-dependency React `VirtualList` component supporting dynamic item heights and smooth 60 FPS scrolling." },
      { id: "ds-m2-d36-q4", name: "Production Incident Lab: Scroll Position Resetting on Data Array Mutation", type: "detective", desc: "Fix an incident where prepending a new message to a virtualized chat list threw the user's scroll position violently to the top." }
    ]
  },
  {
    day: 37,
    month: 2,
    blockNum: 8,
    title: "The Ultimate Combobox: Async Fuzzy Autocomplete, Keyboard Arrow Navigation & Virtualized Dropdowns",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Complex Combobox / Autocomplete Pattern)",
    spokenGoal: "Architect the most complex single UI primitive: build an enterprise accessible Combobox following WAI-ARIA 1.2 Combobox APG specifications, featuring asynchronous fuzzy search, virtualized dropdown options, and full keyboard navigation.",
    conceptInvariant: "Combobox ARIA Invariant: An accessible Combobox consists of an input (`role=\"combobox\"`, `aria-autocomplete=\"list\"`, `aria-expanded`) controlling a listbox (`role=\"listbox\"`). Focused items must be tracked via `aria-activedescendant` without moving actual DOM focus away from the input.",
    failureMode: "Moving real DOM focus to the dropdown list items when the user presses Down Arrow, causing the input field to lose focus, unmounting the virtual keyboard on mobile, and breaking user typing flow.",
    tryItFriction: "Implement a Combobox in React using `aria-activedescendant` where typing filters 2,000 options asynchronously, Arrow keys highlight items without blurring the input, and Enter selects.",
    socraticHints: [
      "Why must real DOM focus remain on the `<input>` while arrowing through combobox suggestions?",
      "Because if focus moves to the list, the user cannot continue typing or editing their search query!",
      "Use `aria-activedescendant=\"option-{id}\"` on the input to visually and programmatically indicate the active option."
    ],
    situationalPuzzle: {
      scenario: "A user with a screen reader searches for an airport code in an airline Combobox. As they type 'SFO', a dropdown opens with 5 suggestions. The user presses Down Arrow to select 'San Francisco International'. VoiceOver remains completely silent and does not announce the highlighted airport. What ARIA attribute was missing on the input?",
      options: [
        "`role=\"search\"`",
        "`aria-activedescendant` — without pointing this attribute to the ID of the currently highlighted option, the screen reader does not know which item in the virtualized listbox is currently focused.",
        "`aria-label=\"Airport\"`",
        "`tabindex=\"0\"` on the list"
      ],
      answerIdx: 1,
      debrief: "In the WAI-ARIA Combobox pattern, DOM focus stays on the input. `aria-activedescendant` tells assistive technology which child option is virtually focused, triggering screen readers to announce the highlighted item."
    },
    quests: [
      { id: "ds-m2-d37-q1", name: "WAI-ARIA 1.2 Combobox Specification & State Transitions", type: "concept", desc: "Trace the state transition diagram of a WAI-ARIA 1.2 Combobox across open, closed, filtered, and navigated states." },
      { id: "ds-m2-d37-q2", name: "Detective Lab: The Disorienting Screen Reader Combobox", type: "detective", desc: "Audit a custom autocomplete component that failed accessibility audits, repair `aria-activedescendant`, and verify in NVDA." },
      { id: "ds-m2-d37-q3", name: "Mastery Assignment: Enterprise Virtualized Combobox Component", type: "assignment", desc: "Build an accessible `Combobox` component with async fuzzy filtering, virtualized options rendering, and multi-select tags." },
      { id: "ds-m2-d37-q4", name: "Production Incident Lab: Race Condition in Asynchronous Search Query Responses", type: "detective", desc: "Fix an asynchronous search bug where slow responses for an earlier keystroke overwrote newer search results." }
    ]
  },
  {
    day: 38,
    month: 2,
    blockNum: 8,
    title: "Accessible Date Range Picker: Calendar Grids, Two-Month Navigation, ISO-8601 & Keyboard Grid Traversal",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Two-Dimensional Calendar Navigation)",
    spokenGoal: "Engineer an accessible Date Range Picker: construct two-dimensional keyboard grid navigation (`role=\"grid\"`, Arrow keys for day/week navigation, PageUp/PageDown for months), handle range selection states, and eliminate timezone bugs using UTC / ISO-8601.",
    conceptInvariant: "Calendar Grid Keyboard Invariant: A calendar must be structured as a two-dimensional grid (`role=\"grid\"`). Left/Right arrows move by 1 day; Up/Down arrows move by 1 week (7 days); PageUp/PageDown move by 1 month; Home/End jump to the start/end of the month.",
    failureMode: "Using local browser `Date` objects (`new Date('2024-05-01')`) without timezone normalization, causing users in timezones west of UTC to see their selected dates display as the previous day ('2024-04-30').",
    tryItFriction: "Build an accessible single-month calendar grid in React where Arrow keys navigate seamlessly across days and weeks, and pressing Enter on two dates selects the start and end of a range.",
    socraticHints: [
      "Why is Left/Right arrow navigation insufficient for a calendar table?",
      "Because a user wanting to move down one week would have to press Right Arrow 7 times!",
      "Bind Up/Down arrows to add/subtract 7 days, maintaining the day of the week column."
    ],
    situationalPuzzle: {
      scenario: "A customer in New York books a hotel for 'July 15'. When the confirmation screen renders, it displays 'Check-in: July 14'. The customer calls support panicking. Database inspection confirms the backend stored `2024-07-15T00:00:00Z` (UTC). When the frontend formatted it with `date.toLocaleDateString()`, New York is UTC-4, shifting the time back to 8:00 PM July 14. How must the DatePicker architecture handle this?",
      options: [
        "Tell customers to only book hotels during daytime.",
        "Represent calendar dates as strict calendar date strings (`YYYY-MM-DD`) without timestamps or timezone conversions, using modern Temporal API or UTC-normalized date parsers.",
        "Hardcode all dates to UTC-5.",
        "Remove the confirmation screen."
      ],
      answerIdx: 1,
      debrief: "Calendar dates represent whole calendar days, not moments in time. Storing and manipulating dates as ISO-8601 calendar strings (`YYYY-MM-DD`) eliminates timezone offsets that cause dates to shift across midnight."
    },
    quests: [
      { id: "ds-m2-d38-q1", name: "WAI-ARIA Date Picker Grid Specification & Keyboard Topology", type: "concept", desc: "Map the complete WAI-ARIA keyboard navigation matrix for two-dimensional calendar grids." },
      { id: "ds-m2-d38-q2", name: "Detective Lab: The Shifting Midnight Date Bug Investigation", type: "detective", desc: "Audit a hotel booking date picker with timezone shift bugs, replace local Date parsing with timezone-safe utilities, and verify." },
      { id: "ds-m2-d38-q3", name: "Mastery Assignment: Accessible Dual-Month Date Range Picker", type: "assignment", desc: "Build a production-ready `DateRangePicker` component with dual-month display, range highlighting, and full grid keyboard traversal." },
      { id: "ds-m2-d38-q4", name: "Production Incident Lab: Leap Year & Daylight Saving Shift Rendering Failures", type: "detective", desc: "Fix an edge-case bug where calculating month days by adding 86400 seconds skipped a day during Daylight Saving Time transition." }
    ]
  },
  {
    day: 39,
    month: 2,
    blockNum: 8,
    title: "Enterprise Data Grid I: Virtual Scrolling, Pinned Sticky Columns & Header Resizing",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (High-Density Financial Data Tables)",
    spokenGoal: "Architect the centerpiece of enterprise SaaS: the Data Grid. Implement horizontal and vertical virtual scrolling for 100,000 cells, freeze pinned columns with CSS `sticky`, and engineer mouse-drag column resizing with minimum bounds.",
    conceptInvariant: "Bi-Directional Virtualization Invariant: A high-density grid must virtualize in both dimensions simultaneously: only visible rows AND only visible columns are rendered in the DOM, preventing 100-column tables from crashing layout engines.",
    failureMode: "Virtualizing only rows while rendering all 80 columns into the DOM, causing 500 DOM elements per row and triggering severe horizontal scroll lag.",
    tryItFriction: "Build a prototype Data Grid that renders a virtualized table of 10,000 rows by 30 columns with a sticky pinned checkbox column that remains fixed during horizontal scrolling.",
    socraticHints: [
      "Why does `position: sticky; left: 0;` fail inside some table layouts?",
      "Because a parent element with `overflow: hidden` or `transform` creates a new stacking context that breaks sticky positioning!",
      "Ensure the scroll container is the direct parent and assign explicit `z-index` to pinned header cells."
    ],
    situationalPuzzle: {
      scenario: "In a financial data grid, users drag column borders to resize columns. When a user drags the 'Ticker' column border rapidly to the right, the mouse cursor moves faster than the column edge. The mouse leaves the resize handle, and the browser suddenly stops firing mousemove events, leaving the column resize frozen. How must the resizing engine handle mouse capture?",
      options: [
        "Force users to drag the mouse very slowly.",
        "Attach `mousemove` and `mouseup` listeners to the `window` (or use `element.setPointerCapture(e.pointerId)`) when dragging begins, ensuring drag events continue firing even when the pointer moves outside the column handle.",
        "Disable column resizing.",
        "Add a 500px wide invisible handle."
      ],
      answerIdx: 1,
      debrief: "Pointer Capture (`setPointerCapture`) redirects all subsequent pointer events to the targeted element regardless of cursor position. This guarantees smooth, continuous dragging without losing tracking when cursors move fast."
    },
    quests: [
      { id: "ds-m2-d39-q1", name: "Data Grid Architecture: 2D Virtualization & Coordinate Transforms", type: "concept", desc: "Diagram bi-directional row and column virtualization algorithms and cell coordinate matrix calculations." },
      { id: "ds-m2-d39-q2", name: "Detective Lab: The Sticky Header Z-Index Bleed Bug", type: "detective", desc: "Triage a data table where scrolling horizontally caused data cells to slide over pinned frozen columns and under headers." },
      { id: "ds-m2-d39-q3", name: "Mastery Assignment: High-Performance DataGrid with Pinned Columns", type: "assignment", desc: "Build a React `DataGrid` component supporting 2D virtualization, sticky pinned columns, and mouse-drag column resizing." },
      { id: "ds-m2-d39-q4", name: "Production Incident Lab: Sub-Pixel Column Alignment Jitter During Fast Scrolling", type: "detective", desc: "Fix an issue where fractional column widths caused table cells to jitter by 1 pixel relative to headers during fast scroll." }
    ]
  },
  {
    day: 40,
    month: 2,
    blockNum: 8,
    title: "Enterprise Data Grid II: Multi-Column Sorting, Filtering State Engines & Milestone 7: Staff Data Grid Architecture",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Data Grid State Engine & Milestone 7 Gate)",
    spokenGoal: "Deliver Milestone 7 by completing the enterprise Data Grid: implement multi-column sorting state machines, multi-condition filtering pipelines, cell keyboard selection (WAI-ARIA Grid navigation), and CSV export capabilities.",
    conceptInvariant: "WAI-ARIA Grid Keyboard Invariant: A Data Grid (`role=\"grid\"`) must treat every cell (`role=\"gridcell\"`) as a keyboard navigable entity. Arrow keys must navigate between cells horizontally and vertically; Ctrl+Space toggles row selection; Enter activates cell editing.",
    failureMode: "Treating a data table as a simple list of links, forcing keyboard users to Tab through 1,000 cells linearly rather than using two-dimensional Arrow keys to navigate rows and columns.",
    tryItFriction: "Implement multi-column sort logic in TypeScript: when a user clicks Column A and Shift-clicks Column B, sort primarily by A and secondarily by B with direction indicators.",
    socraticHints: [
      "How does a multi-column sort comparator work in JavaScript?",
      "Compare Column A values first: `const diff = compare(a.colA, b.colA)`!",
      "If `diff !== 0`, return `diff`. If `diff === 0`, fall back to comparing Column B: `return compare(a.colB, b.colB)`."
    ],
    situationalPuzzle: {
      scenario: "An enterprise customer loads a portfolio of 50,000 rows into the design system's DataGrid. They apply a filter 'Status = Active' and click 'Sort by Value'. The UI thread completely freezes for 3.2 seconds with a Chrome 'Page Unresponsive' modal. Profiling reveals that sorting and filtering 50,000 objects in memory blocked the main rendering thread. How must Staff Architecture handle this?",
      options: [
        "Limit users to viewing 50 rows maximum.",
        "Offload sorting and filtering operations to a Web Worker (or server-side cursor pagination), returning sorted index arrays to the UI thread without blocking the browser rendering loop.",
        "Disable sorting on large datasets.",
        "Tell the customer to buy faster computers."
      ],
      answerIdx: 1,
      debrief: "Heavy computational operations (sorting and filtering large arrays) must never execute on the main browser UI thread. Offloading computations to a background Web Worker keeps the UI responsive at 60 FPS."
    },
    quests: [
      { id: "ds-m2-d40-q1", name: "WAI-ARIA 1.2 Grid Keyboard Navigation & Selection Contract", type: "concept", desc: "Map the complete 2D cell navigation model, range selection (Shift+Arrows), and cell editing modes." },
      { id: "ds-m2-d40-q2", name: "Detective Lab: Offloading 50,000-Row Grid Sorting to Web Workers", type: "detective", desc: "Refactor a main-thread freezing table sort algorithm to run asynchronously in a dedicated Web Worker." },
      { id: "ds-m2-d40-q3", name: "Mastery Assignment: Full-Featured Enterprise DataGrid Component", type: "assignment", desc: "Complete the `DataGrid` component with multi-column sort, filter popovers, selection checkboxes, and keyboard navigation." },
      { id: "ds-m2-d40-q4", name: "Milestone 7 Gate: Enterprise Staff-Grade DataGrid Delivery", type: "assignment", desc: "Deliver Milestone 7: A production DataGrid handling 50k rows with 2D virtualization, sorting, column resizing, and APG compliance." }
    ]
  },

  // ─── BLOCK 9: Motion Physics, Micro-Interactions & Animation Architecture (Days 41–45) ───────────
  {
    day: 41,
    month: 2,
    blockNum: 9,
    title: "Physics of UI Motion: Spring Curves (Mass, Stiffness, Damping) vs Linear Easing, 60/120 FPS FLIP Animations",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Physics-Based Animation Mechanics)",
    spokenGoal: "Master the physics of natural UI animation: understand why duration-based bezier curves feel mechanical, implement physics-based spring models (mass, stiffness, damping), and master the FLIP technique (First, Last, Invert, Play) for 60/120 FPS layout animations.",
    conceptInvariant: "FLIP Animation Invariant: Layout animations must never animate expensive geometry properties (`width`, `height`, `top`, `left`). Calculate the delta between First and Last positions, and animate exclusively using hardware-accelerated `transform` and `opacity`.",
    failureMode: "Animating `height: 0 -> 200px` on a dropdown menu, forcing the browser to execute expensive layout recalculations (reflow) on every single frame, causing choppy 15 FPS frame drops on mobile.",
    tryItFriction: "Write a pure JavaScript FLIP animation utility that animates a list of cards reordering smoothly at 60 FPS using only `getBoundingClientRect()` and CSS `transform`.",
    socraticHints: [
      "What does FLIP stand for in animation architecture?",
      "First (record initial position), Last (record target position), Invert (apply transform to fake the start position), Play (animate transform to 0)!",
      "Because `transform` is handled by the GPU compositor, it runs at 60/120 FPS without triggering browser layout reflow."
    ],
    situationalPuzzle: {
      scenario: "A designer requests that a modal dialog expand into full-screen when clicking an 'Expand' icon. A developer animates `width: 500px -> 100%` and `height: 400px -> 100vh` with a 300ms CSS transition. On an Android phone, the animation stutters horribly with jank. DevTools Performance profiler shows continuous red bars marked 'Layout' on every frame. What technique should have been used?",
      options: [
        "Use a faster CSS easing function like `ease-in`.",
        "The FLIP technique: calculate the scale and translation difference between the small modal and the full-screen modal, and animate `transform: translate(...) scale(...)` on the GPU compositor layer.",
        "Remove the expand feature.",
        "Add `will-change: width, height`."
      ],
      answerIdx: 1,
      debrief: "Animating width and height triggers browser reflow and repaint on every frame. The FLIP technique translates geometry changes into GPU-accelerated `transform` matrices, guaranteeing 60/120 FPS performance."
    },
    quests: [
      { id: "ds-m2-d41-q1", name: "Spring Physics vs Cubic Beziers: Equations of Motion in UI", type: "concept", desc: "Analyze the second-order differential equation of damped harmonic oscillators and derive spring stiffness/damping parameters." },
      { id: "ds-m2-d41-q2", name: "Detective Lab: The Choppy 15 FPS Layout Reflow Animation", type: "detective", desc: "Profile a stuttering layout animation in Chrome DevTools, diagnose layout thrashing, and rewrite it using FLIP." },
      { id: "ds-m2-d41-q3", name: "Mastery Assignment: Zero-Dependency Pure JS FLIP Layout Animation Engine", type: "assignment", desc: "Build a lightweight FLIP animation utility supporting list reordering and shared element transitions." },
      { id: "ds-m2-d41-q4", name: "Production Incident Lab: Will-Change Memory Blowout Crashing iOS Safari", type: "detective", desc: "Diagnose an out-of-memory crash on iOS Safari caused by applying `will-change: transform` to 500 list items simultaneously." }
    ]
  },
  {
    day: 42,
    month: 2,
    blockNum: 9,
    title: "Framer Motion / Motion One: Declarative Layout Animations, Shared Element Transitions & AnimatePresence",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Declarative Motion Engines)",
    spokenGoal: "Master declarative animation libraries: implement Framer Motion and Motion One, orchestrate enter/exit transitions using `AnimatePresence`, build shared element transitions (`layoutId`), and maintain strict bundle size hygiene.",
    conceptInvariant: "Layout Projection Invariant: Shared element transitions (`layoutId`) use inverted matrix projection to animate elements between different DOM positions. The elements do not move in the DOM; their visual representations smoothly interpolate across coordinates.",
    failureMode: "Unmounting an animated element immediately when state changes (`isOpen && <Modal />`), preventing the exit animation from playing and causing jarring pop-outs.",
    tryItFriction: "Implement an animated Tab indicator using Framer Motion's `layoutId=\"active-tab\"` where clicking a tab causes the indicator pill to glide smoothly underneath the selected label.",
    socraticHints: [
      "How do you animate an element when it is being removed from the React DOM tree?",
      "Wrap it inside `<AnimatePresence>` from Framer Motion!",
      "`AnimatePresence` intercepts the unmount, waits for the `exit` animation to complete, and only then removes the node."
    ],
    situationalPuzzle: {
      scenario: "A web application incorporates rich animations using Framer Motion. The bundle size analyzer reveals that Framer Motion added 32 KB (gzipped) to the initial bundle chunk, causing Lighthouse to flag a slower Largest Contentful Paint (LCP). How does a Staff UI Engineer reduce this bundle footprint without sacrificing animations?",
      options: [
        "Delete all animations.",
        "Adopt Motion One (which uses native Web Animations API under 4 KB) or use Framer Motion's `m` component and `LazyMotion` feature to load animation features asynchronously.",
        "Convert all animations to animated GIF images.",
        "Load Framer Motion via an external CDN script tag."
      ],
      answerIdx: 1,
      debrief: "Framer Motion's `LazyMotion` combined with the `m` component loads animation features dynamically on demand, reducing initial bundle impact by up to 70%. Alternatively, Motion One leverages native WAAPI for ultra-lightweight physics."
    },
    quests: [
      { id: "ds-m2-d42-q1", name: "Declarative Motion Architectures: Web Animations API vs JS Spring Engines", type: "concept", desc: "Compare the browser-native Web Animations API (WAAPI) with JavaScript-driven render-loop animation engines." },
      { id: "ds-m2-d42-q2", name: "Detective Lab: The Pop-Out Abrupt Exit Animation Bug", type: "detective", desc: "Audit 5 dialog and toast components that abruptly vanish on close, and wrap them in `AnimatePresence` with exit springs." },
      { id: "ds-m2-d42-q3", name: "Mastery Assignment: Fluid Shared-Element Navigation Bar Component", type: "assignment", desc: "Build a navigation component with a shared active-indicator pill and animated dropdown menus using `layoutId`." },
      { id: "ds-m2-d42-q4", name: "Production Incident Lab: Layout Projection Distorting Border Radii & Text Scale", type: "detective", desc: "Fix an animation distortion bug where animating a card size via layout projection warped the inner text font scale." }
    ]
  },
  {
    day: 43,
    month: 2,
    blockNum: 9,
    title: "Micro-Interactions: Button Press Spring Haptics, Skeleton Shimmers, Confetti Particles & CSS linear()",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Tactile Micro-Interactions)",
    spokenGoal: "Engineer delight through tactile micro-interactions: build tactile button-press spring scales, skeleton loader shimmers using CSS linear gradients, celebratory confetti particle systems, and modern CSS `linear()` spring approximation curves.",
    conceptInvariant: "Micro-Interaction Restraint Invariant: A micro-interaction must provide instantaneous feedback (< 100ms) and complete quickly (< 300ms). Micro-interactions must feel tactile and responsive, never slow or distracting.",
    failureMode: "Designing a button-press animation that takes 800ms to complete, causing users to perceive the interface as sluggish and unresponsive.",
    tryItFriction: "Generate a pure CSS spring easing curve using modern CSS `linear(0, 0.006, 0.025, 0.058, ... 1)` that simulates a bouncy spring without importing any JavaScript animation libraries.",
    socraticHints: [
      "How can modern CSS achieve spring physics without JavaScript?",
      "By using the modern CSS `linear()` easing function, which accepts a polyline of pre-calculated points simulating a spring!",
      "This delivers 100% native GPU-accelerated spring animations with zero runtime JavaScript overhead."
    ],
    situationalPuzzle: {
      scenario: "A designer creates a Skeleton loading state with a shimmering wave effect. A developer implements it with a CSS animation on `background-position`. On lower-end mobile devices, having 20 skeleton cards on screen causes 100% CPU usage and battery drain while waiting for API data. What is the performance root cause?",
      options: [
        "The skeleton color was too dark.",
        "Animating `background-position` triggers continuous GPU repaints on every frame. Replacing it with an animated pseudo-element using `transform: translateX(...)` eliminates paint operations and uses pure compositor layers.",
        "Skeleton loaders should only be used on desktop.",
        "The API should load instantly."
      ],
      answerIdx: 1,
      debrief: "`background-position` animations force the browser to repaint the element on every frame. Using an animated `::after` gradient strip with `transform: translateX(...)` offloads the animation to the GPU compositor with zero repaint cost."
    },
    quests: [
      { id: "ds-m2-d43-q1", name: "Modern CSS linear() Spring Approximations vs JS Loops", type: "concept", desc: "Analyze how CSS `linear()` samples spring curves into mathematically optimized keyframe polyline arrays." },
      { id: "ds-m2-d43-q2", name: "Detective Lab: Profiling Skeleton Loader CPU Spikes on Mobile", type: "detective", desc: "Profile a laggy skeleton loader using Chrome DevTools Rendering panel, eliminate repaints, and convert to transform shimmers." },
      { id: "ds-m2-d43-q3", name: "Mastery Assignment: Tactile Micro-Interaction Component Suite", type: "assignment", desc: "Build a suite of micro-interactions: spring-press buttons, zero-paint skeleton shimmers, and accessible toggle flips." },
      { id: "ds-m2-d43-q4", name: "Production Incident Lab: Confetti Particle Animation Canvas Memory Leak", type: "detective", desc: "Fix a celebratory confetti effect that failed to cancel `requestAnimationFrame`, causing background memory exhaustion." }
    ]
  },
  {
    day: 44,
    month: 2,
    blockNum: 9,
    title: "Accessible Animation Architecture: Automated prefers-reduced-motion Downgrade Engine",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Motion Accessibility & Vestibular Safety)",
    spokenGoal: "Engineer vestibular safety into animation pipelines: architect an automated motion downgrade engine that detects `@media (prefers-reduced-motion: reduce)` and gracefully collapses motion into instant transitions or opacity cross-fades without breaking animation event callbacks.",
    conceptInvariant: "Safe Motion Downgrade Invariant: Disabling motion must NOT break application logic that relies on animation completion events (`onAnimationEnd`, `onRest`). The downgrade engine must immediately trigger completion callbacks rather than stalling state.",
    failureMode: "Setting `* { animation-duration: 0.001ms !important; }` in a global CSS reset, which breaks React components that wait for `transitionend` events to clean up DOM nodes, freezing modal dismissal.",
    tryItFriction: "Create a Framer Motion / Motion One animation wrapper that automatically substitutes spring translations with gentle opacity fades when `prefers-reduced-motion` is active.",
    socraticHints: [
      "Why does setting `animation: none !important` globally break some modal dialogs?",
      "Because the JavaScript modal logic is waiting for `onAnimationEnd` to fire before removing the modal from state!",
      "If the animation is disabled via CSS without firing events, the modal state machine gets stuck in 'closing' forever."
    ],
    situationalPuzzle: {
      scenario: "A user with vestibular disorder enables 'Reduce Motion' in their operating system settings. When they open a web app with rich animated drawers, clicking 'Close' on a drawer makes the drawer fade out, but the modal backdrop remains permanently stuck on screen, preventing further interaction. The console shows no errors. What went wrong?",
      options: [
        "The browser crashed.",
        "The close handler relied on a CSS `transitionend` event to update state (`setIsClosed(true)`). A global reduced-motion rule set `transition: none`, so `transitionend` never fired, leaving the state machine stuck in 'closing'.",
        "The user should disable Reduce Motion.",
        "The drawer needed a higher z-index."
      ],
      answerIdx: 1,
      debrief: "State machines waiting for CSS transition events must account for reduced-motion. If transitions are removed, state transitions must execute synchronously, or use fallback timers to prevent deadlocks."
    },
    quests: [
      { id: "ds-m2-d44-q1", name: "Vestibular Disorders & WCAG 2.2 Criterion 2.3.3 Animation from Interactions", type: "concept", desc: "Study how parallax and large-scale translations trigger nausea, dizziness, and migraines in vestibular-impaired users." },
      { id: "ds-m2-d44-q2", name: "Detective Lab: The Frozen Modal Close Handler in Reduced-Motion Mode", type: "detective", desc: "Debug an application where closing dialogs locked up in reduced-motion mode due to missing `transitionend` fallback triggers." },
      { id: "ds-m2-d44-q3", name: "Mastery Assignment: Automated Reduced-Motion Provider & Hook Suite", type: "assignment", desc: "Build a `useReducedMotion` React hook and CSS token architecture that automatically downgrades motion across all components." },
      { id: "ds-m2-d44-q4", name: "Production Incident Lab: Unannounced Content Layout Shift in Reduced Motion Mode", type: "detective", desc: "Fix an issue where bypassing a sliding carousel animation caused an abrupt layout jump that startled screen reader users." }
    ]
  },
  {
    day: 45,
    month: 2,
    blockNum: 9,
    title: "Gestures & Drag-and-Drop: Pointer Events, Drag Overlays, Sortable Lists & Milestone 8: Motion Design System",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Touch Gestures & Milestone 8 Gate)",
    spokenGoal: "Deliver Milestone 8: implement fluid touch and pointer gestures, architect accessible drag-and-drop sortable lists (using Pointer Events, collision detection algorithms, and keyboard reordering alternatives), and finalize the Motion Design System.",
    conceptInvariant: "Drag-and-Drop Accessibility Invariant: Every drag-and-drop interaction must have an alternative keyboard-operable mechanism (WCAG 2.2 Criterion 2.5.7 Dragging Movements), allowing keyboard users to pick up, move, and drop items using Space and Arrow keys.",
    failureMode: "Building a Kanban board using HTML5 Drag and Drop API (`draggable=\"true\"`), which has zero touch support on mobile devices and cannot be operated via keyboard or screen readers.",
    tryItFriction: "Build a sortable list component using Pointer Events and Framer Motion / dnd-kit with full keyboard reordering support and live screen reader reordering announcements.",
    socraticHints: [
      "Why is the native HTML5 Drag and Drop API avoided in modern design systems?",
      "Because it has poor mobile touch support, cannot customize drag ghost preview styling, and lacks keyboard accessibility!",
      "Modern design systems use Pointer Events (`onPointerDown`, `onPointerMove`) with custom drag overlay portals."
    ],
    situationalPuzzle: {
      scenario: "An enterprise project management tool releases a Kanban task board with drag-and-drop. An accessibility audit immediately fails the feature under WCAG 2.2 Criterion 2.5.7 (Dragging Movements). Users with motor disabilities who use trackballs or head-wands cannot hold a button down while dragging across columns. How must Staff Architecture satisfy this requirement?",
      options: [
        "Tell motor-impaired users to use a mouse.",
        "Implement alternative single-pointer click actions: clicking 'Move' opens a menu with 'Move Up', 'Move Down', 'Move to Next Column', allowing full reordering via simple clicks and keyboard presses.",
        "Disable drag and drop completely.",
        "Increase the drag sensitivity."
      ],
      answerIdx: 1,
      debrief: "WCAG 2.2 Criterion 2.5.7 mandates that any functionality requiring a dragging movement must provide an alternative single-pointer without dragging (such as buttons or menus) unless dragging is essential."
    },
    quests: [
      { id: "ds-m2-d45-q1", name: "Pointer Events Physics vs HTML5 Drag-and-Drop Limitations", type: "concept", desc: "Compare pointer event capture, inertia tracking, and collision detection algorithms (rect intersection, closest center)." },
      { id: "ds-m2-d45-q2", name: "Detective Lab: The Un-Droppable Mobile Touch Kanban Task", type: "detective", desc: "Refactor a desktop-only drag-and-drop Kanban board to support smooth mobile touch gestures and auto-scrolling." },
      { id: "ds-m2-d45-q3", name: "Mastery Assignment: Accessible Sortable List with Live Screen Reader Feedback", type: "assignment", desc: "Build a sortable list component supporting pointer drag and keyboard reordering with real-time ARIA live status announcements." },
      { id: "ds-m2-d45-q4", name: "Milestone 8 Gate: Motion Design System & Gesture Suite Delivery", type: "assignment", desc: "Deliver Milestone 8: A unified Motion Design System with spring tokens, FLIP layout transitions, and accessible drag-and-drop." }
    ]
  },

  // ─── BLOCK 10: Web Components, Micro-Frontends & Cross-Framework Interop (Days 46–50) ────────────
  {
    day: 46,
    month: 2,
    blockNum: 10,
    title: "Custom Elements & Shadow DOM: Encapsulation, Custom Element Lifecycle & Slot Projections",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Web Components Standard & Shadow DOM)",
    spokenGoal: "Engineer framework-agnostic design system primitives: master the Web Components standard (Custom Elements v1, Shadow DOM, HTML Templates), manage the Custom Element lifecycle (`connectedCallback`, `attributeChangedCallback`), and handle content projection with `<slot>`.",
    conceptInvariant: "Shadow DOM Encapsulation Invariant: Styles defined inside a Shadow Root cannot leak out into the main document, and styles in the main document cannot penetrate into the Shadow Root (except through CSS Custom Properties and `::part()` selectors).",
    failureMode: "Relying on Shadow DOM encapsulation to 'fix' poor CSS architecture, discovering that global typography, CSS reset rules, and accessibility tools (screen readers) struggle when cross-boundary references are poorly configured.",
    tryItFriction: "Build a framework-agnostic `<pinit-button>` Custom Element with an open Shadow Root, slotted icon/text content, and reflected observed attributes (`disabled`, `variant`).",
    socraticHints: [
      "How do CSS Custom Properties cross the Shadow DOM boundary?",
      "CSS Custom Properties pierce through Shadow Roots automatically because they inherit through the DOM tree!",
      "Define global design tokens as CSS variables, and consume them inside the Shadow DOM."
    ],
    situationalPuzzle: {
      scenario: "An enterprise company builds a universal `<company-modal>` Web Component for use across React, Angular, and legacy jQuery apps. Inside the Shadow DOM, an `aria-labelledby=\"modal-title\"` is applied to the dialog. The title is passed via a `<slot>` from the host document. Screen readers fail to announce the modal title. Why did this cross-boundary ARIA link fail?",
      options: [
        "Web Components do not support screen readers.",
        "ARIA ID references (`aria-labelledby`, `aria-describedby`) cannot cross the Shadow DOM boundary. An ID inside a slot lives in the light DOM and cannot be resolved by an ARIA attribute inside the Shadow DOM.",
        "The modal needed `role=\"alert\"`.",
        "The slot needed a name attribute."
      ],
      answerIdx: 1,
      debrief: "ARIA ID references cannot cross the Shadow DOM boundary. To link accessible names across Shadow DOM and Light DOM, use `aria-label` or the emerging Cross-Root ARIA specification (Element Internals API)."
    },
    quests: [
      { id: "ds-m2-d46-q1", name: "Web Components Standards Deep Dive: Shadow DOM, Custom Elements & Slots", type: "concept", desc: "Analyze the browser implementation of Shadow Roots (open vs closed), lifecycle callbacks, and slot assignment algorithms." },
      { id: "ds-m2-d46-q2", name: "Detective Lab: The Severed ARIA Link Across the Shadow DOM Boundary", type: "detective", desc: "Audit a Web Component design system, diagnose broken cross-root ARIA associations, and repair them using `ElementInternals`." },
      { id: "ds-m2-d46-q3", name: "Mastery Assignment: Framework-Agnostic Web Component Primitive Library", type: "assignment", desc: "Implement `<pinit-badge>`, `<pinit-card>`, and `<pinit-button>` using vanilla Custom Elements and open Shadow Roots." },
      { id: "ds-m2-d46-q4", name: "Production Incident Lab: Shadow DOM Slot Change Flash During Framework Re-Renders", type: "detective", desc: "Fix an issue where React wrapper re-renders caused slotted content inside a Web Component to flash and lose input cursor focus." }
    ]
  },
  {
    day: 47,
    month: 2,
    blockNum: 10,
    title: "Styling in Shadow DOM: CSS :host, :host-context, ::part(), and CSS Variable Piercing",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Shadow Tree Styling Mechanisms)",
    spokenGoal: "Master the CSS styling architecture of Shadow DOM: use `:host` and `:host-context` for contextual styling, expose controlled theming APIs using the CSS `::part()` pseudo-element, and leverage CSS Custom Property piercing for global token distribution.",
    conceptInvariant: "The ::part() Contract Invariant: Internal elements in a Shadow Root are private implementation details. To allow external consumer styling customization without breaking encapsulation, elements must explicitly expose a `part=\"...\"` attribute.",
    failureMode: "Exposing internal component internals by removing Shadow DOM (`shadowRoot = null`), allowing external styles to accidentally corrupt internal layout and breaking component encapsulation.",
    tryItFriction: "Create an accessible Web Component `<pinit-input>` with exposed parts (`part=\"input\"`, `part=\"label\"`, `part=\"error\"`) that can be styled from external stylesheets using `pinit-input::part(input) { ... }`.",
    socraticHints: [
      "How does an external stylesheet customize the border of a button inside a Shadow Root?",
      "The button must expose `part=\"button\"` inside the Shadow DOM!",
      "The consumer can then write `my-component::part(button) { border-color: red; }`."
    ],
    situationalPuzzle: {
      scenario: "A design system team distributes Web Components to 5 different product teams. Team A wants to add a subtle box shadow to the internal input element of `<ds-text-field>`. Because the element is inside a Shadow Root, their CSS class `.my-input { box-shadow: ... }` has no effect. What is the clean, standards-compliant way for the design system to support this?",
      options: [
        "Delete the Shadow DOM.",
        "Add `part=\"input-field\"` to the internal input element in the component's Shadow DOM, allowing consumers to style it cleanly via `ds-text-field::part(input-field)` without breaking encapsulation.",
        "Tell Team A they are not allowed to change shadows.",
        "Inject a `<style>` tag into the page via JavaScript."
      ],
      answerIdx: 1,
      debrief: "The CSS `::part()` pseudo-element provides an explicit, opt-in styling contract. Components expose specific internal elements via `part` attributes, allowing external consumers to customize styling safely."
    },
    quests: [
      { id: "ds-m2-d47-q1", name: "Shadow DOM Styling Specifications: :host, :host-context & ::part()", type: "concept", desc: "Compare CSS encapsulation boundaries, specificity rules of `:host`, and the CSS Shadow Parts specification." },
      { id: "ds-m2-d47-q2", name: "Detective Lab: Exposing Controlled Theming APIs for Enterprise Custom Elements", type: "detective", desc: "Audit a closed Web Component library, identify consumer customization requests, and design a clean `::part` API." },
      { id: "ds-m2-d47-q3", name: "Mastery Assignment: Full-Featured Web Component with CSS ::part Styling Contract", type: "assignment", desc: "Build an enterprise `<ds-accordion>` Custom Element with comprehensive `::part` slots, tokens, and keyboard handling." },
      { id: "ds-m2-d47-q4", name: "Production Incident Lab: Inherited CSS Font Metrics Breaking Custom Element Layout", type: "detective", desc: "Fix an issue where parent page `line-height` inherited into a Web Component host element, misaligning internal icons." }
    ]
  },
  {
    day: 48,
    month: 2,
    blockNum: 10,
    title: "Cross-Framework Wrapper Architecture: React, Vue 3, and Angular Wrappers from Single Core",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Multi-Framework Wrapper Pipelines)",
    spokenGoal: "Build a single design system that powers all frontend frameworks: architect a core library (Web Components or vanilla headless engine) and build automated code-generation pipelines that output native React, Vue 3, and Angular wrappers.",
    conceptInvariant: "Wrapper Fidelity Invariant: A framework wrapper must behave like a first-class native component in that framework. React wrappers must support refs, synthetic events, and JSX props; Vue wrappers must support `v-model`; Angular wrappers must support two-way bindings.",
    failureMode: "Forcing React developers to use raw Web Components directly in React 17/18, where React fails to pass object props to custom elements and fails to listen to custom events without manual `ref` event listeners.",
    tryItFriction: "Build an automated wrapper generator script using `@lit/react` or Stencil that converts a set of Custom Elements into fully typed React components with ref forwarding and TypeScript definitions.",
    socraticHints: [
      "Why did React historically have poor support for Web Components?",
      "Because React passes all JSX attributes as HTML string attributes rather than DOM properties, and handles synthetic events differently!",
      "A typed React wrapper bridges this gap by mapping props to DOM properties and custom events to `onEvent` handlers."
    ],
    situationalPuzzle: {
      scenario: "A multi-framework enterprise maintains apps in both React and Vue 3. They distribute raw Web Components. The React team reports that passing a complex object (`<user-card user={userObject} />`) fails because React stringifies it to `[object Object]`. The Vue team reports that `v-model` does not work. How does Staff Architecture solve this cleanly?",
      options: [
        "Force all teams to use only Angular.",
        "Implement automated wrapper generation: use Stencil or custom AST generators to compile lightweight framework wrappers (`@company/ui-react`, `@company/ui-vue`) that map props to properties and handle native framework events seamlessly.",
        "Ban passing objects as props.",
        "Write separate components from scratch for each framework."
      ],
      answerIdx: 1,
      debrief: "A single core Web Component engine paired with automated wrapper generation gives consumers native framework ergonomics (`v-model` in Vue, JSX props and refs in React) while maintaining a single implementation codebase."
    },
    quests: [
      { id: "ds-m2-d48-q1", name: "Cross-Framework Design System Architecture: Lit vs Stencil vs Mitosis", type: "concept", desc: "Compare multi-framework compilation strategies: universal compilers (Mitosis) vs Web Component wrapper generators (Stencil, Lit)." },
      { id: "ds-m2-d48-q2", name: "Detective Lab: The Object-Props Serialization Bug in React Web Components", type: "detective", desc: "Diagnose why passing complex arrays and objects to Custom Elements in React failed, and write a typed bridge wrapper." },
      { id: "ds-m2-d48-q3", name: "Mastery Assignment: Automated React & Vue 3 Wrapper Generation Pipeline", type: "assignment", desc: "Build a build pipeline that reads Web Component manifests and generates typed React and Vue 3 package wrappers." },
      { id: "ds-m2-d48-q4", name: "Production Incident Lab: Event Propagation Discrepancies Between React and Native DOM", type: "detective", desc: "Fix an issue where custom events emitted inside a Web Component bubbled through the native DOM but bypassed React's event portal." }
    ]
  },
  {
    day: 49,
    month: 2,
    blockNum: 10,
    title: "Micro-Frontend Design System Sharing: Shared Module Federation, Singleton Tokens & Style Isolation",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Distributed Frontend Architecture)",
    spokenGoal: "Deploy design systems across Micro-Frontend architectures: configure Webpack 5 Module Federation to share design system packages, guarantee singleton token instances, prevent CSS version collision, and maintain style isolation.",
    conceptInvariant: "Micro-Frontend Singleton Invariant: In a Module Federation architecture, Design System tokens and theme providers must be declared as singleton shared dependencies (`singleton: true`, `strictVersion: true`). Loading duplicate token instances leads to theme state desynchronization.",
    failureMode: "Each micro-frontend bundling its own copy of the design system with different versions, resulting in 5 versions of the component library loaded on one page, 3 MB of duplicate JavaScript, and conflicting CSS styles.",
    tryItFriction: "Configure Webpack Module Federation in a host container and remote micro-frontend to share `@company/design-system` as a singleton, ensuring zero duplicate bundle loading.",
    socraticHints: [
      "What happens when two micro-frontends load different versions of an un-namespaced CSS stylesheet?",
      "The last loaded stylesheet overwrites the previous one in the global DOM cascade, corrupting styles on the first app!",
      "Use CSS Cascade Layers or unique namespace prefixes (`data-ds-version=\"2.4\"`) to isolate versioned styles."
    ],
    situationalPuzzle: {
      scenario: "A large enterprise dashboard integrates 4 micro-frontends developed by independent teams: Header, Checkout, Catalog, and Account. Each team bundles `@enterprise/ui`. The checkout team upgrades to v3.0, while Catalog remains on v2.0. When Checkout mounts, its v3.0 global button styles overwrite Catalog's buttons, shrinking catalog buttons by 20% and breaking alignment. How must this be prevented?",
      options: [
        "Require all 4 teams to deploy on the same day at 2 AM.",
        "Enforce CSS isolation via CSS Cascade Layers or Web Components with Shadow DOM, and configure Module Federation with shared singleton design system dependencies to prevent uncoordinated version conflicts.",
        "Delete micro-frontends and build a monolith.",
        "Use `iframe` tags for all micro-frontends."
      ],
      answerIdx: 1,
      debrief: "In micro-frontend architectures, un-isolated global CSS inevitably collides. Encapsulating styles inside Cascade Layers, Shadow DOM, or federated singleton dependencies guarantees version stability across independent teams."
    },
    quests: [
      { id: "ds-m2-d49-q1", name: "Module Federation Deep Dive: Shared Dependencies, Singletons & Fallbacks", type: "concept", desc: "Analyze how Module Federation's runtime share scope negotiates semver versions and shares singleton libraries." },
      { id: "ds-m2-d49-q2", name: "Detective Lab: Resolving CSS Version Clashes in a 4-App Micro-Frontend", type: "detective", desc: "Triage a host page where mounting a remote micro-frontend broke navigation styling, and isolate styles with `@layer`." },
      { id: "ds-m2-d49-q3", name: "Mastery Assignment: Module Federation Design System Host & Remote Integration", type: "assignment", desc: "Build a working Module Federation setup sharing a centralized component library and token engine as a singleton." },
      { id: "ds-m2-d49-q4", name: "Production Incident Lab: Theme Provider Context Desync Across Federated Boundaries", type: "detective", desc: "Fix a bug where toggling dark mode in the host app failed to update remote federated micro-apps due to non-singleton React Context." }
    ]
  },
  {
    day: 50,
    month: 2,
    blockNum: 10,
    title: "Component Playground & Living Documentation: Interactive Props Tables, Code Snippet Generation (Milestone 9)",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Documentation Engineering & Milestone 9 Gate)",
    spokenGoal: "Deliver Milestone 9: architect a living documentation portal (like Radix Docs or Tailwind UI) featuring interactive component playgrounds, auto-generated TypeScript props tables, real-time code snippet generation, and accessible sandbox previews.",
    conceptInvariant: "Doc-Code Parity Invariant: Documentation must be derived directly from the source code Abstract Syntax Tree (via `react-docgen-typescript`). Prop tables, default values, and type unions must never be manually maintained in markdown.",
    failureMode: "Manually typing props tables in markdown documentation, causing documentation to diverge within weeks as engineers add, rename, or deprecate component props in code without updating docs.",
    tryItFriction: "Build an interactive documentation playground component in Next.js / Astro that parses component TypeScript types with `react-docgen-typescript` and renders live interactive controls.",
    socraticHints: [
      "Why is manual markdown documentation an anti-pattern for design systems?",
      "Because humans will inevitably forget to update markdown tables when props change in code!",
      "Use static analysis tools like `react-docgen-typescript` to extract props, descriptions, and types directly from code."
    ],
    situationalPuzzle: {
      scenario: "An enterprise design system portal displays documentation for 80 components. A developer consults the docs for `ModalDialog`, copies the example code, and pastes it into their project. The app crashes because the prop `isOpen` was renamed to `open` two months ago, but the markdown documentation was never updated. What automated toolchain prevents this?",
      options: [
        "Assign an intern to check the documentation every Friday.",
        "Implement automated type-driven documentation generation using `react-docgen-typescript` or Storybook Autodocs, ensuring props tables and code snippets are generated directly from the live TypeScript source code on every build.",
        "Remove documentation completely.",
        "Revert the prop name back to `isOpen`."
      ],
      answerIdx: 1,
      debrief: "Automating documentation generation directly from TypeScript ASTs guarantees 100% accuracy. When code changes, the documentation portal automatically rebuilds with the updated prop signatures and types."
    },
    quests: [
      { id: "ds-m2-d50-q1", name: "Type-Driven Documentation Architecture: react-docgen-typescript & MDX", type: "concept", desc: "Analyze how TypeScript AST parsers extract JSDoc comments, default props, and type union definitions into structured JSON." },
      { id: "ds-m2-d50-q2", name: "Detective Lab: Rescuing a Stale, Out-of-Sync Design System Documentation Portal", type: "detective", desc: "Audit a documentation site with 40 broken code examples and out-of-date props tables, and migrate to automated AST extraction." },
      { id: "ds-m2-d50-q3", name: "Mastery Assignment: Live Interactive Component Playground & Code Generator", type: "assignment", desc: "Build a responsive documentation page with live interactive control knobs, preview canvas, and copyable JSX code snippets." },
      { id: "ds-m2-d50-q4", name: "Milestone 9 Gate: Enterprise Living Documentation & Cross-Framework Platform", type: "assignment", desc: "Deliver Milestone 9: A complete living documentation portal showcasing all components, interactive props tables, and Web Component wrappers." }
    ]
  },

  // ─── BLOCK 11: Enterprise Governance, Versioning, Deprecations & Codemods (Days 51–55) ───────────
  {
    day: 51,
    month: 2,
    blockNum: 11,
    title: "Monorepo Architecture for Design Systems: Turborepo / Nx, Package Boundaries & Dependency Graphs",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Monorepo Engineering & Build Caching)",
    spokenGoal: "Structure an enterprise design system monorepo: configure Turborepo / Nx, define clean package boundaries (`@ds/tokens`, `@ds/icons`, `@ds/primitives`, `@ds/react`, `@ds/docs`), manage dependency graphs, and leverage remote computation caching.",
    conceptInvariant: "Monorepo Boundary Invariant: Packages within a monorepo must have strict unidirectional dependency graphs. Lower-tier packages (`tokens`) must never import from higher-tier packages (`primitives`), preventing circular dependency build deadlocks.",
    failureMode: "Maintaining a monolithic single package where updating an icon forces a rebuild and re-release of the entire component library, documentation site, and tokens package.",
    tryItFriction: "Configure a Turborepo pipeline with topological build tasks, caching outputs (`dist/**`, `.turbo/**`), and ensuring package updates only trigger builds on dependent packages.",
    socraticHints: [
      "Why is a monorepo preferred over multiple separate git repositories for design systems?",
      "Because tokens, icons, components, and documentation evolve together with synchronized testing and PR reviews!",
      "Turborepo ensures that changing a token only rebuilds the dependent packages while caching untouched ones."
    ],
    situationalPuzzle: {
      scenario: "In a design system monorepo with 12 packages, running `pnpm build` in CI takes 14 minutes. A developer changes a single CSS comment in the documentation package, and CI runs the entire 14-minute build again. How does Staff Architecture reduce CI times to under 30 seconds for this PR?",
      options: [
        "Upgrade to a more expensive 64-core CI runner.",
        "Implement Turborepo Remote Caching with accurate input/output file hashes: Turborepo detects that tokens, icons, and components have not changed, restores their builds from cache in 2 seconds, and only builds the docs package.",
        "Disable CI on documentation changes.",
        "Remove all tests from the repository."
      ],
      answerIdx: 1,
      debrief: "Turborepo Remote Caching hashes task inputs (source files, dependencies, environment). If hashes match previous builds, it instantly downloads the cached outputs from cloud storage, reducing CI times by up to 95%."
    },
    quests: [
      { id: "ds-m2-d51-q1", name: "Enterprise Monorepo Topologies: Package Boundaries & Task Graphs", type: "concept", desc: "Design a Directed Acyclic Graph (DAG) for design system packages, defining build pipelines and boundaries." },
      { id: "ds-m2-d51-q2", name: "Detective Lab: Resolving Circular Dependencies in a Broken Monorepo", type: "detective", desc: "Audit a tangled monorepo with circular imports between `@ds/utils` and `@ds/primitives`, and restore unidirectional flow." },
      { id: "ds-m2-d51-q3", name: "Mastery Assignment: Production Turborepo Monorepo Architecture", type: "assignment", desc: "Configure a production Turborepo workspace containing tokens, core primitives, React components, and Storybook docs." },
      { id: "ds-m2-d51-q4", name: "Production Incident Lab: Cache Poisoning in CI Remote Build Cache", type: "detective", desc: "Diagnose an issue where uncommitted local files poisoned the remote CI cache, causing broken builds to pass falsely." }
    ]
  },
  {
    day: 52,
    month: 2,
    blockNum: 11,
    title: "Semantic Versioning & Release Automation: Changesets, Conventional Commits & Multi-Package Publishing",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Automated Release Engineering)",
    spokenGoal: "Automate multi-package releases: master Semantic Versioning (SemVer 2.0.0), implement Changesets for decentralized contributor changelog tracking, configure GitHub Actions release workflows, and publish scoped packages to npm and GitHub Packages.",
    conceptInvariant: "SemVer Breaking Change Invariant: Any change that alters a prop name, removes a CSS variable, modifies an accessible role, or changes the default visual behavior of a component MUST bump the MAJOR version number.",
    failureMode: "Publishing a breaking component prop rename as a MINOR version update (`2.1.0 -> 2.2.0`), breaking hundreds of downstream production consumer applications when their automated dependabot builds run.",
    tryItFriction: "Configure `@changesets/cli` in a monorepo, author a changeset markdown file declaring a minor feature update, and run `changeset version` to bump package versions and update CHANGELOGs automatically.",
    socraticHints: [
      "Why is `@changesets/cli` superior to single-author release scripts in a multi-team monorepo?",
      "Because each PR author declares the intent and SemVer impact of their specific change in a separate file!",
      "The release bot consolidates all changesets upon merge into main, calculating exact version bumps and changelogs."
    ],
    situationalPuzzle: {
      scenario: "A junior developer modifies `Button.tsx` in a design system, changing `variant=\"default\"` to `variant=\"primary\"`. The developer marks the PR as a 'patch' fix. When published, 40 downstream micro-frontends break because their `<Button variant=\"default\">` calls now render unstyled default buttons. What release governance failure occurred?",
      options: [
        "The developer should not have used TypeScript.",
        "SemVer Violation: Renaming or removing a prop value is a breaking change requiring a MAJOR version bump (or backward-compatible alias fallback). Automated PR checks must validate SemVer impacts against public API contracts.",
        "The downstream teams should not have updated packages.",
        "Buttons should not have variants."
      ],
      answerIdx: 1,
      debrief: "Altering or removing public API signatures breaks backward compatibility. SemVer strictly mandates a MAJOR bump for breaking changes. Providing backward-compatible aliasing allows non-breaking minor releases."
    },
    quests: [
      { id: "ds-m2-d52-q1", name: "SemVer 2.0.0 Specification & Public API Surface Invariants", type: "concept", desc: "Define what constitutes a breaking change in design systems: prop changes, token renames, DOM changes, and a11y roles." },
      { id: "ds-m2-d52-q2", name: "Detective Lab: The Disastrous Accidental Breaking Change Release", type: "detective", desc: "Post-mortem a production outage caused by an accidental breaking change in a minor release, and implement automated API diff checks." },
      { id: "ds-m2-d52-q3", name: "Mastery Assignment: Automated Changeset & Multi-Package Release Workflow", type: "assignment", desc: "Build a GitHub Actions release pipeline with Changesets that publishes packages and generates GitHub Releases." },
      { id: "ds-m2-d52-q4", name: "Production Incident Lab: NPM Publishing Race Condition in Monorepo CI", type: "detective", desc: "Fix an issue where parallel npm publishing failed halfway due to 2FA authentication timeouts on dependent packages." }
    ]
  },
  {
    day: 53,
    month: 2,
    blockNum: 11,
    title: "Breaking Change Management: Deprecation Warnings, Deprecation Telemetry & Safe Phaseouts",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Graceful API Evolution)",
    spokenGoal: "Manage API deprecations with zero downtime: implement runtime deprecation warnings with call stack deduplication, build deprecation telemetry to track downstream usage, and execute multi-version phaseout roadmaps.",
    conceptInvariant: "Graceful Deprecation Invariant: Never delete an API immediately. Deprecate in version $N$ with clear console warnings and JSDoc `@deprecated` tags, maintain full backward compatibility in version $N$, and remove ONLY in major version $N+1$.",
    failureMode: "Spamming the browser console with 5,000 deprecation warning logs inside a rendering loop, freezing the consumer's development environment and causing developers to ignore console logs entirely.",
    tryItFriction: "Write a `warnOnce` deprecation utility in TypeScript that logs a formatted warning with migration instructions only on the first invocation per component name in development mode.",
    socraticHints: [
      "Why must deprecation warnings only log once per component?",
      "Because if a deprecated component renders in a 1,000-row list, logging 1,000 times freezes the browser console!",
      "Use a `Set<string>` cache to track logged component warnings and skip subsequent calls."
    ],
    situationalPuzzle: {
      scenario: "A design system team wants to deprecate `<LegacyCard>` and replace it with `<Card>`. If they delete `<LegacyCard>`, 60 downstream product teams will fail to build. If they don't delete it, nobody will migrate. How does Staff Architecture execute a safe, measurable phaseout?",
      options: [
        "Delete `<LegacyCard>` and let teams figure it out.",
        "Implement a 3-stage phaseout: (1) Mark with `@deprecated` JSDoc and `warnOnce()` runtime warnings, (2) Instrument deprecation telemetry to monitor active adoption metrics, and (3) Provide automated codemods to migrate codebases automatically before the next major release.",
        "Keep both components forever without deprecation.",
        "Break the builds intentionally on Friday."
      ],
      answerIdx: 1,
      debrief: "Enterprise deprecation requires JSDoc annotations, non-spammy runtime warnings, telemetry monitoring, and automated codemods. This gives downstream teams the tools and time to migrate smoothly."
    },
    quests: [
      { id: "ds-m2-d53-q1", name: "Enterprise Deprecation Lifecycle: JSDoc, Linting & Version Ladders", type: "concept", desc: "Design an enterprise deprecation schedule across Alpha, Deprecated, End-of-Life, and Removed stages." },
      { id: "ds-m2-d53-q2", name: "Detective Lab: Auditing 20 Deprecated APIs Across 40 Downstream Repositories", type: "detective", desc: "Scan 40 customer codebases for deprecated design system imports, calculate technical debt scores, and generate reports." },
      { id: "ds-m2-d53-q3", name: "Mastery Assignment: Production Deprecation Logger & Telemetry Reporter", type: "assignment", desc: "Build a `deprecated()` utility that logs structured migration links, dedupes calls, and posts telemetry pings in staging." },
      { id: "ds-m2-d53-q4", name: "Production Incident Lab: Production Console Polluted by Development Warnings", type: "detective", desc: "Fix an incident where development deprecation warnings leaked into production builds because bundler `process.env` checks failed." }
    ]
  },
  {
    day: 54,
    month: 2,
    blockNum: 11,
    title: "Automated Code Migrations: AST Transformations using jscodeshift / Babel for Breaking Component Upgrades",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Automated Code Refactoring via ASTs)",
    spokenGoal: "Eliminate manual upgrade pain: build automated codemods using `jscodeshift` and Babel, parse downstream application ASTs, rename deprecated props, restructure JSX component topologies, and execute painless one-click major version upgrades.",
    conceptInvariant: "Idempotent Codemod Invariant: An automated codemod script must be strictly idempotent. Running the script multiple times against the same codebase must produce the exact same clean output without duplicate imports or mangled formatting.",
    failureMode: "Releasing a major version that requires every engineer to manually find and replace props across 5,000 files, causing migration fatigue and leaving 80% of company apps stuck on legacy, unmaintained versions.",
    tryItFriction: "Write a `jscodeshift` transform script in JavaScript that finds all `<Button type=\"primary\">` JSX elements, renames `type` to `variant`, and removes deprecated `isFlat` props.",
    socraticHints: [
      "What is `jscodeshift`?",
      "It is a toolkit for running codemod scripts that parse JavaScript/TypeScript files into ASTs, modify nodes, and re-output code!",
      "It allows design system teams to automate breaking changes across thousands of consumer files in seconds."
    ],
    situationalPuzzle: {
      scenario: "The design system team releases v4.0. The breaking change renames `<Modal isOpen={x} onClose={y}>` to `<Dialog open={x} onOpenChange={y}>`. Across 30 product repositories, there are 1,200 instances of this component. Downstream teams estimate it will take 3 weeks of manual engineering time to update. How does the design system team solve this in 5 minutes?",
      options: [
        "Tell teams to postpone their roadmap for 3 weeks.",
        "Ship an automated `jscodeshift` codemod (`npx @company/codemod v4-dialog-migration`) that automatically updates JSX imports, renames component tags, and transforms prop names across all repositories with zero manual editing.",
        "Revert the changes and cancel v4.0.",
        "Use a crude regular expression find-and-replace."
      ],
      answerIdx: 1,
      debrief: "Automated AST codemods eliminate the human friction of breaking changes. Packaging a codemod with major releases allows downstream teams to execute migrations across thousands of files instantly and error-free."
    },
    quests: [
      { id: "ds-m2-d54-q1", name: "AST Codemod Architecture: jscodeshift, Recast & JSX Manipulation", type: "concept", desc: "Trace how AST parsers represent JSX elements, attributes, and imports, and learn AST traversal and mutation algorithms." },
      { id: "ds-m2-d54-q2", name: "Detective Lab: Fixing a Destructive Regex Migration Script", type: "detective", desc: "Analyze a botched migration where a regex replace corrupted code comments and strings, and replace it with a safe AST codemod." },
      { id: "ds-m2-d54-q3", name: "Mastery Assignment: Production jscodeshift Codemod Suite", type: "assignment", desc: "Build an automated codemod transforming deprecated Modal and Button APIs into modern equivalents with unit tests." },
      { id: "ds-m2-d54-q4", name: "Production Incident Lab: Codemod Mangling TypeScript Type Generics and Comments", type: "detective", desc: "Fix an AST transform script that accidentally stripped comments and corrupted TypeScript generic parameter brackets." }
    ]
  },
  {
    day: 55,
    month: 2,
    blockNum: 11,
    title: "Design System Health Metrics: Adoption Analytics, Token Coverage Scanners & Milestone 10: Governance Platform",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Metrics, Adoption Tracking & Milestone 10 Gate)",
    spokenGoal: "Deliver Milestone 10 by operationalizing design system governance: build automated scanners that measure token adoption percentage across all company codebases, track component usage analytics, quantify technical debt, and present executive dashboards.",
    conceptInvariant: "Measurable Adoption Invariant: A design system's success is measured by hard metrics: Token Coverage Percentage ($Tokens / (Tokens + RawStyles) \\ge 95\\%$) and Component Adoption Ratio ($DSComponents / TotalComponents \\ge 90\\%$).",
    failureMode: "Having no visibility into whether teams are actually adopting the design system, discovering too late that core product teams bypassed the library and built rogue custom components.",
    tryItFriction: "Write a Node.js repository scanner that parses all JSX files across a GitHub organization, calculates the ratio of design system components vs custom raw HTML tags, and outputs an adoption scorecard.",
    socraticHints: [
      "How do you prove the ROI of a design system to executive leadership?",
      "By demonstrating high token coverage, accelerated feature delivery times, and zero accessibility lawsuits!",
      "Automated repository scanning provides concrete data showing increasing adoption curves month over month."
    ],
    situationalPuzzle: {
      scenario: "At an executive quarterly review, the VP asks: 'We invested \$1.5M in the design system team this year. How do we know company applications are actually using it, and where is our greatest accessibility risk?' The design system lead presents an automated dashboard showing 94% token coverage across 50 repos and flags two legacy repos with 40% rogue styling. What scanner infrastructure produced this data?",
      options: [
        "A survey sent to engineering managers.",
        "An automated static code analysis scanner that runs nightly across all GitHub repositories, counting design system component imports, raw CSS occurrences, and un-tokenized values to generate an organizational adoption index.",
        "Google Analytics tracking.",
        "Manual inspection of production websites."
      ],
      answerIdx: 1,
      debrief: "Automated AST repository scanners quantify design system adoption objectively. Scanning all organization repositories tracks token coverage, component usage, and technical debt hotspots across teams over time."
    },
    quests: [
      { id: "ds-m2-d55-q1", name: "Design System Analytics & Organizational Adoption Index Math", type: "concept", desc: "Formulate mathematical metrics for design system health: Token Coverage, Component Velocity, and A11y Defect Density." },
      { id: "ds-m2-d55-q2", name: "Detective Lab: Uncovering Rogue Component Shadow Libraries in Enterprise Repos", type: "detective", desc: "Scan 10 micro-frontend repositories, identify 8 rogue duplicate button and modal implementations, and plan migration." },
      { id: "ds-m2-d55-q3", name: "Mastery Assignment: Enterprise Design System Adoption Scanner CLI", type: "assignment", desc: "Build a CLI scanner that traverses repositories, counts component imports vs raw elements, and outputs JSON health reports." },
      { id: "ds-m2-d55-q4", name: "Milestone 10 Gate: Automated Enterprise Governance & Analytics Platform", type: "assignment", desc: "Deliver Milestone 10: A complete governance suite with automated AST linters, migration codemods, and adoption analytics." }
    ]
  },

  // ─── BLOCK 12: Production Hardening, SRE War Rooms & Master Capstone Viva (Days 56–60) ────────────
  {
    day: 56,
    month: 2,
    blockNum: 12,
    title: "3 AM UI Production Outages: CSS Specificity Wars, Hydration Flash of Unstyled Content (FOUC), and Infinite Loops",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (War Room Triage & Production Resiliency)",
    spokenGoal: "Survive 3 AM UI production war rooms: triage emergency outages caused by catastrophic CSS specificity collisions, diagnose hydration mismatch loops that freeze user browsers, and resolve emergency FOUC incidents under production pressure.",
    conceptInvariant: "Production Triage Invariant: In a production emergency, identify the failure blast radius immediately. Use surgical feature flags to roll back corrupted component releases before attempting root-cause debugging.",
    failureMode: "Panic-deploying un-tested emergency CSS hotfixes directly into production without verifying browser caching, exacerbating specificity conflicts and taking down the checkout flow entirely.",
    tryItFriction: "Triage a simulated production outage where a bad CSS release caused all primary navigation menus to disappear behind an invisible 100vw backdrop overlay, preventing all user logins.",
    socraticHints: [
      "What is the first action to take when a design system release breaks production checkout?",
      "Roll back or toggle the release feature flag to restore service immediately!",
      "Never attempt live trial-and-error debugging on production servers."
    ],
    situationalPuzzle: {
      scenario: "At 3:15 AM on Black Friday, customer support reports that the checkout page on a major retail site is completely blank. The console displays: `Error: Hydration failed because the initial UI does not match what was rendered on the server`. The root cause is a ThemeProvider that read `localStorage` during SSR rendering, generating different CSS class names on server vs client. How does the on-call engineer restore checkout immediately?",
      options: [
        "Wait for the morning shift to investigate.",
        "Trigger the emergency rollback deployment of the previous stable container build, and apply a hotfix ensuring theme resolution is deferred until after hydration mounts using `useEffect` with a stable default.",
        "Delete the theme provider from the codebase.",
        "Tell customers to clear their browser cookies."
      ],
      answerIdx: 1,
      debrief: "Immediate rollback is the first rule of SRE. Once restored, the root cause is resolved: theme resolution that depends on client state (`localStorage`) must never execute during server render; use stable SSR defaults to guarantee matching hydration trees."
    },
    quests: [
      { id: "ds-m2-d56-q1", name: "Frontend Incident Management: Blast Radius Analysis & Rollback Runbooks", type: "concept", desc: "Formulate emergency runbooks for frontend outages: CDN cache invalidation, feature flags, and hydration triage." },
      { id: "ds-m2-d56-q2", name: "War Room Lab: Triaging the Invisible Navigation Backdrop Outage", type: "detective", desc: "Debug an active production incident where a rogue backdrop modal blocked user clicks across the entire application." },
      { id: "ds-m2-d56-q3", name: "Mastery Assignment: Enterprise Automated Self-Healing Theme Fallback Engine", type: "assignment", desc: "Build an ultra-resilient `ThemeProvider` that catches hydration mismatches gracefully and falls back to safe system defaults." },
      { id: "ds-m2-d56-q4", name: "Production Incident Lab: Specificity Collapse After CDN Stylesheet Load Order Inversion", type: "detective", desc: "Resolve an outage caused when HTTP/2 multiplexing loaded a secondary stylesheet before the base reset, inverting cascade priority." }
    ]
  },
  {
    day: 57,
    month: 2,
    blockNum: 12,
    title: "Memory Leaks in UI Components: Uncleaned ResizeObserver, Event Listeners, and Detached DOM Nodes",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Browser Memory Leak Forensics)",
    spokenGoal: "Diagnose and eliminate browser memory leaks: profile heap snapshots using Chrome DevTools Memory profiler, identify detached DOM trees held by closures, track uncleaned `ResizeObserver` and event listener leaks, and maintain sub-50MB browser footprints.",
    conceptInvariant: "Lifecycle Cleanup Invariant: Every asynchronous subscription, timer, `ResizeObserver`, `IntersectionObserver`, and global window event listener mounted by a component MUST be explicitly disconnected in its unmount cleanup callback.",
    failureMode: "Mounting a `window.addEventListener('resize', handler)` inside a component without returning a cleanup function in `useEffect`, leaking 1,000 active listener functions as users navigate between pages until the browser tab crashes.",
    tryItFriction: "Capture and analyze two Chrome DevTools Heap Snapshots of a SPA before and after mounting/unmounting a complex DataGrid 50 times, identifying detached DOM nodes and tracing their retaining paths.",
    socraticHints: [
      "Why does a detached DOM node consume memory even after being removed from the screen?",
      "Because a JavaScript variable, closure, or event listener is still holding an active reference to it!",
      "The garbage collector cannot reclaim memory until all references to the detached node are severed."
    ],
    situationalPuzzle: {
      scenario: "Users of an analytics dashboard report that after using the app for 2 hours, browser tabs become extremely sluggish and eventually display 'Out of Memory' (Aw, Snap!). A memory heap snapshot shows 45,000 detached `HTMLDivElement` nodes and 300 active `ResizeObserver` instances. What component bug caused this memory blowout?",
      options: [
        "The browser had too many tabs open.",
        "A responsive chart component instantiated a new `new ResizeObserver(...)` on every render without disconnecting it on unmount, retaining references to detached chart DOM elements in observer callbacks.",
        "The computer RAM was faulty.",
        "CSS Grid requires too much memory."
      ],
      answerIdx: 1,
      debrief: "Creating observer instances (`ResizeObserver`, `IntersectionObserver`) without calling `.disconnect()` in component unmount cleanup functions retains the observed DOM nodes in memory indefinitely, causing massive detached DOM leaks."
    },
    quests: [
      { id: "ds-m2-d57-q1", name: "V8 Garbage Collector Mechanics: Retaining Paths & Detached DOM Trees", type: "concept", desc: "Analyze how the V8 GC marks and sweeps objects, identifying root references, retaining trees, and closure memory leaks." },
      { id: "ds-m2-d57-q2", name: "Detective Lab: Profiling Heap Snapshots to Hunt Detached Table Nodes", type: "detective", desc: "Take heap snapshots before and after unmounting a table, locate 5,000 retained detached nodes, and sever retaining references." },
      { id: "ds-m2-d57-q3", name: "Mastery Assignment: Leak-Proof Observer & Event Listener Custom Hooks", type: "assignment", desc: "Build safe, automatically-cleaned `useResizeObserver`, `useEventListener`, and `useInterval` hooks with memory leak tests." },
      { id: "ds-m2-d57-q4", name: "Production Incident Lab: Tooltip Portal Leaving Detached Elements in document.body", type: "detective", desc: "Fix an incident where rapid tooltip unmounting left orphaned portal container divs accumulating in `document.body`." }
    ]
  },
  {
    day: 58,
    month: 2,
    blockNum: 12,
    title: "Comprehensive Visual Regression Pipeline: Chromatic / Playwright Sharding with Docker in CI/CD",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (High-Scale Visual CI Automation)",
    spokenGoal: "Scale visual regression testing to enterprise scale: configure Playwright test sharding across multiple parallel CI jobs, run tests inside hermetic Docker containers to guarantee font rendering consistency, and integrate automated PR visual review workflows.",
    conceptInvariant: "Containerized Determinism Invariant: Visual regression baselines must be captured and evaluated inside identical Docker container images. Running visual diffs across macOS, Windows, and Linux CI runners introduces font rendering discrepancies that destroy test reliability.",
    failureMode: "Running visual regression tests directly on bare-metal CI runners where different Linux kernel versions and font rasterizers trigger 300 false-positive screenshot failures on every PR.",
    tryItFriction: "Configure a GitHub Actions workflow that splits 200 Playwright visual regression tests across 4 parallel shard containers (`--shard=1/4`), combines report artifacts, and gates PR merges on zero unexpected diffs.",
    socraticHints: [
      "How do you run 500 visual tests in under 2 minutes in CI?",
      "By sharding the test suite across multiple parallel runner containers!",
      "Playwright natively supports `--shard=x/y`, distributing tests evenly across parallel workers."
    ],
    situationalPuzzle: {
      scenario: "An enterprise design system CI suite runs 400 visual regression tests. On a single GitHub Actions runner, the suite takes 28 minutes, blocking developer PRs. Developers start skipping visual tests to ship faster, leading to a visual regression in production. How does Staff Platform Engineering reduce the test duration to under 4 minutes?",
      options: [
        "Delete 350 of the visual tests.",
        "Implement parallel test sharding across 8 Docker-based CI matrix runners using Playwright `--shard`, executing tests concurrently and consolidating report artifacts into a unified visual review dashboard.",
        "Test only once a week.",
        "Make developers run tests on their local laptops."
      ],
      answerIdx: 1,
      debrief: "Parallel test sharding distributes test execution across multiple concurrent CI containers. Sharding 400 tests across 8 runners reduces execution time by nearly 8x, keeping PR feedback under 4 minutes while preserving 100% test coverage."
    },
    quests: [
      { id: "ds-m2-d58-q1", name: "High-Scale Visual CI Architecture: Sharding, Caching & Artifact Merging", type: "concept", desc: "Design a distributed visual testing pipeline architecture using Playwright sharding and blob report merging." },
      { id: "ds-m2-d58-q2", name: "Detective Lab: Resolving Linux vs macOS Font Rasterization Inconsistencies", type: "detective", desc: "Containerize a failing visual test suite inside an official Playwright Docker image to achieve 100% pixel determinism." },
      { id: "ds-m2-d58-q3", name: "Mastery Assignment: Distributed Playwright Visual Regression CI Matrix", type: "assignment", desc: "Build a GitHub Actions workflow sharding 50 component visual tests across 4 parallel runners with automated PR comment reports." },
      { id: "ds-m2-d58-q4", name: "Production Incident Lab: Broken Baseline Sync Causing 100 False PR Test Failures", type: "detective", desc: "Resolve a CI deadlock where merging a visual change without updating the base branch baseline caused all subsequent PRs to fail." }
    ]
  },
  {
    day: 59,
    month: 2,
    blockNum: 12,
    title: "Senior Design System RFC & Architectural Review Board: Writing & Defending a Cross-Organization RFC",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Staff Architectural RFC & Governance)",
    spokenGoal: "Lead cross-organizational technical strategy: author a comprehensive Request for Comments (RFC) proposing a major design system architectural evolution (e.g. migrating to Web Components, multi-brand token engines, or Zero-Runtime CSS), and defend it before the Architectural Review Board.",
    conceptInvariant: "RFC Invariant: An engineering RFC must articulate: Problem Statement, Non-Goals, Detailed Architectural Design, Alternative Approaches Considered, Backward Compatibility & Migration Strategy, and Organizational Adoption Timeline.",
    failureMode: "Attempting to push massive breaking architectural changes across an organization without an RFC, triggering political resistance from product teams and leading to fragmented adoption and project abandonment.",
    tryItFriction: "Write a 4-page formal Engineering RFC proposing a multi-brand design token overhaul, outlining technical design, risk mitigations, codemod tooling, and rollout phases.",
    socraticHints: [
      "Why are 'Non-Goals' critical in a technical RFC?",
      "Because they define boundaries and prevent scope creep from derailing the core proposal!",
      "Clearly stating what the RFC will NOT do keeps review discussions focused on the essential architectural problem."
    ],
    situationalPuzzle: {
      scenario: "A Senior Design System Engineer wants to migrate the company's 40 frontend applications from a legacy CSS-in-JS library to zero-runtime Tailwind v4 and CSS Custom Properties. If they simply release the new version, product teams will refuse to upgrade due to tight feature deadlines. How does a Staff Engineer shepherd this organizational transformation?",
      options: [
        "Complain to the CTO that product engineers don't care about performance.",
        "Author a formal RFC detailing measurable performance gains (INP improvements, 40% bundle reduction), provide automated codemods for 90% of the migration, establish an Architectural Review Board with team leads, and execute an opt-in pilot with a high-traffic app.",
        "Fork the repository and work in secret.",
        "Force the migration by breaking the legacy package on npm."
      ],
      answerIdx: 1,
      debrief: "Staff Engineering is about organizational influence and technical consensus. Writing a data-backed RFC, providing automated codemods to eliminate manual friction, and proving success through pilot programs guarantees cross-team buy-in."
    },
    quests: [
      { id: "ds-m2-d59-q1", name: "The Anatomy of an Enterprise Architectural RFC", type: "concept", desc: "Deconstruct the structure of high-impact RFCs from Meta, Google, and Amazon, analyzing technical consensus building." },
      { id: "ds-m2-d59-q2", name: "Detective Lab: Identifying Flaws in a Rejected Design System RFC", type: "detective", desc: "Audit a rejected design system RFC, identify unaddressed migration costs and missing non-goals, and rewrite it for approval." },
      { id: "ds-m2-d59-q3", name: "Mastery Assignment: Authoring a Staff Design System Architectural RFC", type: "assignment", desc: "Write a comprehensive 5-section RFC for an enterprise multi-brand design token overhaul with full migration strategy." },
      { id: "ds-m2-d59-q4", name: "Production Incident Lab: Uncoordinated Deprecation Causing Cross-Department Deadlock", type: "detective", desc: "Mediate an architectural conflict where a team's release broke another department's checkout flow by establishing formal RFC gates." }
    ]
  },
  {
    day: 60,
    month: 2,
    blockNum: 12,
    title: "Month 2 Master Capstone Viva Gate: NexusDesign GlobalDS Enterprise Multi-Brand Design System & Live Oral Architectural Defense",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Master Capstone Viva Defense)",
    spokenGoal: "Defend the ultimate design system masterwork: present NexusDesign GlobalDS before a panel of Principal Architects and Senior Designers. Defend your multi-brand W3C token pipeline, Style Dictionary compiler, virtualized Data Grid, zero-runtime styling, WCAG 2.2 AAA accessibility, and automated codemods in a live oral architectural defense.",
    conceptInvariant: "NexusDesign GlobalDS Master Contract: The architecture must withstand live adversarial cross-examination: (1) Zero untokenized styling across multi-brand themes, (2) 60 FPS 2D virtualized Data Grid performance with 50k rows, (3) 100% WCAG 2.2 AAA compliance verified by automated Axe-core and live screen reader review, (4) Automated Figma-to-Code sync with Style Dictionary cross-platform export, and (5) Automated AST migration codemods.",
    failureMode: "Failing the Master Capstone Viva by being unable to justify architectural trade-offs, failing live screen reader navigation, demonstrating bundle size bloat, or collapsing under adversarial edge-case scenarios.",
    tryItFriction: "Subject NexusDesign GlobalDS to a live adversarial architectural interrogation: survive questions on OKLCH contrast math, Web Components cross-root ARIA, virtual grid memory footprints, and multi-brand white-labeling.",
    socraticHints: [
      "What distinguishes a Senior Design System Engineer from a Junior Component Developer?",
      "A junior developer builds isolated visual widgets; a senior engineer architects scalable, accessible, governed multi-platform systems that empower hundreds of engineers!",
      "Defend every system boundary with mathematical rigor, accessibility standards, and organizational impact metrics."
    ],
    situationalPuzzle: {
      scenario: "During the Master Capstone Viva Defense, the Chief Technology Officer asks: 'NexusDesign GlobalDS powers our web apps, our iOS apps, our Android apps, and our third-party partner portals. If an external partner wants to re-skin our entire application suite with their own typography, colors, and border radii in under 24 hours, how does your architecture guarantee this without modifying a single line of component code?' How do you defend your architecture?",
      options: [
        "Tell the partner that re-skinning takes 6 months of custom frontend engineering.",
        "Demonstrate the 3-tier W3C DTCG token architecture: all visual attributes resolve to semantic tokens. The partner simply supplies a single JSON global token configuration file. The automated Style Dictionary pipeline compiles this into web CSS variables, iOS Swift structs, and Android Compose themes in 3 minutes, transforming all platforms instantly with zero code changes.",
        "Tell the partner to use browser extensions.",
        "Write custom CSS overrides for every partner."
      ],
      answerIdx: 1,
      debrief: "NexusDesign GlobalDS achieves the ultimate goal of design systems engineering: absolute decoupling of design expression from component code. A single token configuration transforms every platform instantly and safely."
    },
    quests: [
      { id: "ds-m2-d60-q1", name: "NexusDesign GlobalDS Master Architecture Specification", type: "concept", desc: "Document the complete enterprise architecture of NexusDesign GlobalDS: tokens, multi-platform compilers, components, and governance." },
      { id: "ds-m2-d60-q2", name: "Adversarial Stress Lab: The 100,000-Cell Virtual Grid & High-Contrast Audit", type: "detective", desc: "Stress-test the DataGrid under heavy load and execute full NVDA screen reader audits across complex comboboxes and modals." },
      { id: "ds-m2-d60-q3", name: "Mastery Assignment: NexusDesign GlobalDS Monorepo Production Package Distribution", type: "assignment", desc: "Build, package, and publish the complete NexusDesign GlobalDS monorepo with automated changelogs and types." },
      { id: "ds-m2-d60-q4", name: "Month 2 Master Capstone Viva Gate: Live Oral Architectural Defense", type: "assignment", desc: "Defend NexusDesign GlobalDS live before the Senior Architectural Review Board, proving Staff-level mastery across all 60 days." }
    ]
  }
];
