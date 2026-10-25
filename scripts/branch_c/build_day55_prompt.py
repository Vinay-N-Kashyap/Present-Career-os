import json
import hashlib
import re

part1_say = [
    "As enterprise organizations deploy autonomous foundation models to orchestrate core banking, automated healthcare diagnostics, corporate legal synthesis, and critical cloud infrastructure, securing these probabilistic systems against adversarial compromise becomes a paramount strategic mandate. Relying on superficial prompt hardening or isolated regex blocklists is catastrophically inadequate against sophisticated threat actors who employ mathematical gradient optimization, multi-turn conversational manipulation, and cross-modal steganography. Enterprise AI demands a comprehensive, defense-in-depth architectural paradigm: ApexShield.",
    "The multi-tier defense mesh integrates input, runtime, and output layers into an impenetrable, synchronized security mesh. Rather than treating safety as an afterthought or a single perimeter checkpoint, ApexShield constructs a multi-layered defense mesh that envelopes the foundation model across its entire operational lifecycle: from ingress request ingestion and pre-flight semantic evaluation, through in-flight dialogue steering and tool-call mediation, to post-generation output sanitization and cryptographic forensic auditing.",
    "The first tier of the ApexShield architecture operates at the ingress network perimeter. Before any user prompt reaches the primary foundation model, it passes through high-velocity screening proxies that evaluate raw token distributions, compute statistical perplexity, detect token smuggling ciphers, and execute lightweight safety taxonomy classifications. By eliminating obvious exploits and gradient perturbation attacks at the perimeter, the ingress tier prevents malicious tokens from consuming costly downstream inference compute.",
    "The second tier of ApexShield governs in-flight runtime execution and agentic tool invocation. Using programmable dialogue guardrails and deterministic state transition trees, the runtime tier constrains the conversational trajectory of the model, preventing topic drift, policy evasion, and jailbreak steering. Furthermore, when foundation models invoke external tool APIs or database connectors, the runtime tier enforces strict schema validation and isolates code execution within ephemeral, air-gapped sandboxes.",
    "The third tier of ApexShield inspects and sanitizes all generated completions prior to egress delivery. Utilizing high-performance named entity recognition, regular expression matchers, and Shannon entropy analyzers, the egress tier scrubs sensitive Personally Identifiable Information, masks corporate payment credentials, strips accidental API secret leaks, and detects canary token extractions, ensuring that internal enterprise secrets never leave the secure boundary.",
    "Underpinning all three operational tiers is the ApexShield continuous immune system. An autonomous red-teaming engine continuously probes the live defense mesh with thousands of automated adversarial jailbreak vectors—deploying Greedy Coordinate Gradient optimization, PAIR black-box social engineering, and Tree of Attacks with Pruning. When vulnerabilities are detected, the immune system automatically synthesizes new defensive rules and updates perimeter firewalls without human intervention.",
    "Comprehensive cryptographic provenance guarantees complete accountability and statutory compliance. Every transaction processed by ApexShield generates an immutable audit record containing SHA-256 digests of the raw prompt, the intermediate classification scores, the applied guardrail transformations, and the sanitized completion. These records are anchored into append-only cryptographic ledgers, satisfying stringent enterprise governance frameworks.",
    "Defense-in-depth redundancy ensures that no single point of failure can compromise the system. Even if an attacker crafts an unprecedented zero-day prompt that slips past perimeter perplexity filters and evades input classifiers, the runtime dialogue constraints and output canary traps remain active to intercept the attack before sensitive data is compromised.",
    "High-throughput, low-latency execution characterizes the engineering design of ApexShield. By leveraging compiled Rust tokenizers, batched GPU classifier inference, and in-memory Redis caching, the entire multi-tier defense mesh introduces less than twenty milliseconds of end-to-end latency, making it virtually imperceptible to end users while delivering unshakeable protection.",
    "Enterprise policy orchestration provides centralized governance across distributed foundation model fleets. Security administrators define declarative safety policies in standardized configuration files, which ApexShield automatically compiles and distributes across cloud, edge, and hybrid model deployments in real time.",
    "Resilience against adversarial evasion is continuously benchmarked against rigorous empirical standards. ApexShield evaluates model robustness across fourteen distinct safety hazard categories, verifying that defense mechanisms remain steadfast across diverse linguistic styles, low-resource languages, and complex multi-step reasoning tasks.",
    "Mastering the architecture of the ApexShield multi-tier defense mesh represents the pinnacle of modern AI security engineering. By harmonizing ingress sanitization, runtime policy steering, egress scrubbing, and autonomous red-teaming, you build sovereign AI ecosystems that thrive securely in the most adversarial enterprise environments."
]

part2_say = [
    "The ingress perimeter serves as the first line of defense in the ApexShield architecture, intercepting malicious prompts before they can influence the latent representations of enterprise foundation models. Modern adversarial attacks employ diverse techniques to bypass simple keyword blocklists—from mathematically optimized universal suffixes and Base64 encoded ciphers to subtle linguistic roleplay. The input interception mesh combines statistical anomaly detection, neural safety classification, and structural normalization into an ultra-low-latency pre-flight evaluation pipeline.",
    "Perplexity estimators and safety classifiers filter malicious tokens at machine speed. The first inspection stage in the input mesh computes the token-level perplexity of incoming prompts using a lightweight language model. Because gradient-optimized attacks like GCG construct adversarial suffixes that minimize training loss rather than adhering to natural linguistic syntax, their statistical surprisal is dramatically higher than natural human language. The perplexity engine identifies and quarantines these unnatural token sequences in less than two milliseconds.",
    "Llama Guard neural classification operates as the second inspection stage within the ingress tier. Fine-tuned specifically for safety evaluation, Llama Guard inspects the user prompt against fourteen standardized hazard categories—including cyberattacks, software exploitation, biological hazards, hate speech, and customer data extraction. In less than eighteen milliseconds of batched inference, Llama Guard emits a definitive classification verdict, categorizing the prompt as safe or unsafe and identifying the specific policy violation.",
    "Semantic embedding similarity scanning checks incoming prompts against a vector database of known adversarial jailbreak clusters. By generating dense vector embeddings of user inputs and calculating cosine distance against high-dimensional clusters of historical attacks, the semantic filter detects paraphrased variations of known exploits, neutralizing attempts to rephrase previously remediated jailbreak templates.",
    "Structural decoding and token de-smuggling unpack obfuscated payloads before safety evaluation. Malicious actors frequently encode prohibited instructions inside Base64 strings, hexadecimal arrays, binary representations, or invisible Unicode zero-width characters. The ApexShield input normalizer recursively decodes and strips these formatting layers, exposing the raw underlying text to subsequent safety classifiers.",
    "Cross-modal perturbation scanning evaluates multimodal inputs for adversarial perturbations. When processing vision-language requests, the input mesh inspects image tensors for high-frequency noise patterns and pixel perturbations designed to override visual safety alignment, rejecting corrupted inputs before they reach multimodal attention layers.",
    "Adaptive velocity throttling and progressive rate limiting defend against automated probing campaigns. When an adversarial threat actor deploys automated fuzzers like PAIR or genetic algorithms to iteratively probe defensive boundaries, the rate limiter tracks query similarity and failure frequency from the client IP or user session, automatically increasing friction and throttling malicious actors before they achieve convergence.",
    "Perimeter caching optimizes system throughput by indexing previously evaluated prompt fingerprints in an in-memory Redis cluster. Benign, frequently recurring enterprise queries bypass heavy classifier inference, allowing ApexShield to sustain massive query volumes while reserving compute resources for novel or suspicious requests.",
    "Zero-trust prompt encapsulation packages validated user inputs into isolated XML envelopes before dispatching them to downstream foundation models. By strictly demarcating untrusted user content from authoritative system instructions, the encapsulation layer prevents direct prompt injections from hijacking model control flow.",
    "Hardware-accelerated tokenization and kernel fusion minimize pre-flight computational overhead across ingress screening nodes. By deploying custom tokenization engines compiled in native C++ and utilizing fused matrix-vector kernels on dedicated inference accelerators, the input interception mesh processes multi-kilobyte prompt payloads in sub-millisecond timeframes. This extreme computational efficiency ensures that enterprise-grade security filtering can be applied universally to all ingress traffic without causing noticeable queueing delays or throttling high-concurrency production API endpoints.",
    "Continuous calibration of classification thresholds balances security rigor against operational usability. Enterprise security teams tune sensitivity parameters across individual hazard categories, maintaining an industry-leading false positive rate of less than zero point two percent on benign corporate workflows.",
    "Ingress telemetry streams detailed event metrics to enterprise SIEM platforms, logging token distributions, perplexity scores, and classifier verdicts in real time, providing security operations centers with total situational awareness of ongoing attack trends.",
    "Mastering the engineering mechanics of the input interception mesh ensures that malicious prompts are systematically neutralized at the perimeter, preserving foundation model integrity and establishing an unshakeable foundation for enterprise AI operations."
]

part3_say = [
    "Even with rigorous perimeter filtering, sophisticated multi-turn attacks and complex tool-use workflows can coax foundation models into unsafe operational states if runtime behavior is left unconstrained. In-flight execution guardrails govern the dynamic reasoning and conversational trajectory of the model during inference. By enforcing programmable dialogue policies and isolating external tool invocations, ApexShield ensures that foundation models adhere strictly to enterprise business logic and safety standards.",
    "Declarative Colang policies steer conversational trajectories safely through programmable dialogue guardrails. Powered by the NeMo Guardrails engine, Colang enables security engineers to write declarative state transition rules that dictate allowable conversational flows. If a user attempts to steer a banking assistant into discussing unverified stock tips or political controversy, the Colang engine intercepts the intent and steers the dialogue back to approved domain boundaries.",
    "Topical self-check rails execute automated parallel verification of user intent and assistant completions. When a foundation model generates a candidate response, a secondary verification model evaluates whether the completion remains strictly within the authorized domain scope. If the self-check model detects policy deviation or ungrounded claims, the response is blocked and replaced with a polite enterprise deflection.",
    "Tool-call authorization gates inspect and sanitize all function invocations before execution. When a tool-augmented agent attempts to invoke an external database query, cloud API, or operating system command, the authorization gate validates parameters against strict JSON schemas, executes SQL injection checks, and enforces role-based access control, ensuring that prompt injections cannot trigger unauthorized database mutations.",
    "Ephemeral sandboxing isolates generated code execution within secure, containerized micro-environments. When agents generate and execute Python code for data analysis or mathematical computation, the code executes inside an isolated Docker or gVisor sandbox with restricted memory, read-only filesystem mounts, and zero network access, completely eliminating remote code execution vulnerabilities.",
    "Fact-checking and groundedness verification suppress model hallucinations in enterprise workflows. In Retrieval-Augmented Generation architectures, the runtime guardrail compares generated claims against retrieved context documents, computing citation overlap and semantic alignment. If the model generates unsupported factual statements, the guardrail trims the hallucinated tokens or prompts the model to regenerate.",
    "Context window boundary isolation prevents conversational context poisoning across long-running sessions. The memory manager continuously audits the conversation buffer, pruning adversarial tokens, neutralizing indirect prompt injections embedded in user history, and preventing memory pollution attacks from degrading agent reasoning over time.",
    "Dynamic system prompt re-anchoring reinforces authoritative instructions during multi-turn exchanges. As conversations extend across dozens of turns, foundation models naturally suffer from attention dilution, forgetting initial safety constraints. ApexShield periodically injects immutable safety reminders into the attention context, keeping the model vigilant against late-stage persuasion attacks.",
    "Automated rollback and transactional consistency mechanisms protect agent state when policy violations occur mid-execution. If an agent executes three benign query steps before attempting an unauthorized database mutation on the fourth step, the runtime guardrail triggers an atomic rollback protocol. This protocol cancels pending asynchronous tasks, restores the agent's internal memory state to the last verified safe checkpoint, and emits a structured error response, preventing partial state corruptions from lingering in enterprise application backends.",
    "Stateful policy enforcement tracks user intent across multi-step transactions. If an agent is executing a multi-step financial wire transfer, the runtime guardrail verifies that explicit multi-factor authentication was confirmed before executing the final transaction, preventing social engineering exploits from bypassing corporate approvals.",
    "Runtime performance optimization ensures that dialogue steering and tool validation introduce minimal latency overhead. By running self-check evaluations asynchronously alongside primary token generation and compiling Colang state machines into efficient finite state automata, runtime guardrails maintain responsive user experiences.",
    "Diagnostic trace logging captures step-by-step reasoning paths, policy branch decisions, and tool validation outcomes, providing comprehensive audit trails that simplify debugging and ensure total transparency into agent decision-making.",
    "Mastering programmable execution guardrails empowers you to build autonomous agents that execute complex business workflows with absolute reliability, preventing policy evasion and securing tool integrations against the most cunning adversarial manipulation."
]

part4_say = [
    "The final defensive checkpoint in the ApexShield architecture operates on the generated completion before it is transmitted to the end user or downstream enterprise application. Even if an adversarial prompt circumvents perimeter filters and evades runtime dialogue constraints, the output inspection tier ensures that sensitive corporate data, compliance violations, and system prompt secrets are never leaked into untrusted environments. Output sanitization represents the critical fail-safe of the defense-in-depth mesh.",
    "Canary token traps intercept prompt extraction attempts deterministically. During system initialization, ApexShield injects unique, cryptographically generated honeypot strings—canary tokens—deep into the system prompt instructions. If an attacker uses sophisticated prompt extraction techniques to trick the model into regurgitating its system prompt, the output scrubber instantly detects the canary string in the generated text, immediately aborts the response, and alerts security teams to the active breach attempt.",
    "Personally Identifiable Information and payment credential scrubbing protects enterprise privacy and statutory compliance. Utilizing Microsoft Presidio and optimized named entity recognition models, the egress filter identifies and masks sensitive entities—including social security numbers, credit card sequences, medical patient identifiers, and personal addresses—replacing them with synthetic placeholders before transmission.",
    "Shannon information entropy scanning detects accidental cryptographic secret and API key leaks. High-entropy character sequences—such as AWS secret access keys, private RSA certificates, and database connection strings—exhibit distinct statistical randomness compared to natural language. The entropy scanner calculates character surprisal across output windows, automatically redacting raw keys and preventing catastrophic credential spillage.",
    "Hallucination suppression and brand safety filtering enforce factual accuracy and regulatory compliance. The output engine checks generated statements against verified enterprise knowledge bases and regulatory guidelines, flagging toxic commentary, unapproved financial advice, or defamatory statements and replacing them with standardized corporate compliance notices.",
    "Synthetic data substitution preserves the utility of generated responses while maintaining absolute privacy. Rather than redacting sensitive fields with blunt black bars, the scrubber generates contextually valid synthetic names, addresses, and numbers, allowing downstream business processes to proceed without compromising confidential client identities.",
    "Dynamic contextual anonymization ensures that sensitive regulatory entities are replaced with semantically congruent synthetic data rather than generic redaction masks. When an enterprise medical or financial assistant processes sensitive queries, the egress engine replaces actual patient names, account numbers, and medical diagnoses with procedurally generated synthetic equivalents that preserve grammatical agreement and statistical distributions. This enables downstream analytics pipelines to process model completions normally while guaranteeing zero exposure of protected customer records.",
    "Cryptographic safety provenance anchors every sanitized transaction into an immutable compliance ledger. ApexShield computes SHA-256 hashes of the prompt, the raw model completion, the identified redaction spans, and the final sanitized output, storing these cryptographic proofs in an append-only audit vault that satisfies SOC Two, ISO twenty-seven thousand and one, and EU AI Act auditing standards.",
    "Automated incident classification and SIEM dispatch automatically escalate egress policy violations to enterprise Security Operations Centers. When an output filter intercepts a high-severity canary leak or mass PII extraction attempt, the system dispatches structured alert webhooks to Splunk, Datadog, or PagerDuty, enabling rapid security incident containment.",
    "Statutory compliance reporting synthesizes output redaction statistics into executive compliance summaries, tracking privacy preservation rates, credential leak prevention metrics, and audit ledger integrity across global enterprise deployments.",
    "Latency minimization in output scrubbing is achieved through parallel streaming token inspection. Rather than waiting for the entire response to complete before scanning, the egress filter evaluates tokens in sliding windows as they stream, delivering sub-millisecond masking without interrupting user interface streaming responsiveness.",
    "Regression test archiving converts intercepted output leaks into automated test cases. Whenever an egress filter catches a sensitive data leak, the interaction transcript is scrubbed and added to the automated red-teaming regression test suite, ensuring that future fine-tuning runs permanently remediate the underlying model vulnerability.",
    "Mastering output scrubbing and canary leakage detection equips you with the ultimate fail-safe in AI security engineering. By implementing rigorous post-generation sanitization and cryptographic auditing, you guarantee that enterprise secrets remain inviolable regardless of adversarial ingenuity."
]

part5_say = [
    "The true resilience of the ApexShield architecture lies in its ability to adapt and self-harden through continuous autonomous red-teaming. In this milestone capstone, we synthesize the entire Block Eleven safety curriculum—integrating adversarial injection vectors, Llama Guard pre-flight sanitization, NeMo Colang runtime steering, Presidio output scrubbing, canary traps, and automated fuzzing meshes—into an enterprise-grade sovereign AI defense platform.",
    "Autonomous red teaming meshes continuously probe and repair guardrails around the clock. Pitting algorithmic attacker models against defensive shields, the ApexShield continuous immune system deploys Greedy Coordinate Gradient optimizers, PAIR black-box refinement engines, and Tree of Attacks with Pruning to uncover zero-day vulnerabilities across enterprise foundation model fleets before external adversaries can exploit them.",
    "The integrated engineering architecture of ApexShield harmonizes five mission-critical subsystems: the Multi-Tier Input Sanitizer, the NeMo Colang Enforcement Core, the Presidio PII and Canary Scrubber, the Autonomous Continuous Red-Teaming Fuzzer, and the Cryptographic Safety Provenance Ledger. Together, these subsystems provide complete, end-to-end protection across the entire AI execution pipeline.",
    "Rigorous empirical benchmark evaluations confirm the extraordinary defense efficacy of the ApexShield platform: achieving an overall attack deflection rate of ninety-nine point eight percent across ten thousand adversarial jailbreak attempts, maintaining an end-to-end defense latency of eighteen point four milliseconds, and sustaining an industry-leading false positive rate of zero point two percent on benign corporate workflows.",
    "Zero-day jailbreak immunity reaches ninety-eight point nine percent under continuous autonomous fuzzing. By instantly synthesizing candidate guardrail rules whenever automated red-teamers uncover an alignment breach, ApexShield closes the vulnerability remediation window from weeks of manual engineering down to mere minutes of automated policy updates.",
    "The canary extraction vulnerability rate is validated at exactly zero point zero percent. Across thousands of simulated prompt extraction attacks, the output canary trap intercepted every single attempt to leak system instructions, proving the absolute reliability of cryptographic honeypot defenses in production environments.",
    "Autonomous policy compilation and hot-reloading architectures allow the ApexShield defense mesh to adapt instantaneously without incurring service downtime. When automated red-teaming nodes uncover an emerging jailbreak pattern, the policy compiler translates the empirical attack trace into optimized Colang state trees, regex signatures, and classifier prompt exemplars. These updated defense artifacts are broadcast across the distributed mesh via Redis Pub/Sub channels and hot-reloaded into active gateway proxies in under three seconds, neutralizing zero-day threats in near real time.",
    "Sovereign multi-cloud orchestration and air-gapped deployment capabilities ensure that ApexShield meets the stringent operational requirements of defense, intelligence, and heavily regulated banking environments. The entire defense platform—including embedding generators, classifier weights, and cryptographic verification engines—runs fully containerized on sovereign on-premises Kubernetes clusters with zero external cloud dependencies. This architectural independence ensures that enterprise organizations retain absolute operational sovereignty and data confidentiality under all regulatory frameworks.",
    "Centralized enterprise telemetry exports real-time safety heatmaps and performance histograms via OpenTelemetry collectors, giving Chief Information Security Officers complete visibility into fleet-wide threat postures, active probing campaigns, and automated mitigation workflows.",
    "Cryptographic audit provenance guarantees that every transaction is immutably recorded with SHA-256 hash chains, providing statutory compliance evidence that satisfies the most demanding regulatory frameworks, including the EU Artificial Intelligence Act, HIPAA, and GDPR.",
    "The ApexShield certification tier formally certifies the engineer as an Apex AI Safety Architect. Graduating this milestone capstone signifies mastery over the entire domain of modern AI safety—from mathematical gradient optimization and adversarial red-teaming to production guardrail orchestration and cryptographic forensic accounting.",
    "Industrial deployments of ApexShield across global enterprise infrastructures demonstrate that proactive, multi-tier defense meshes are essential for sovereign AI autonomy. By embedding security into every layer of the foundation model lifecycle, organizations deploy agentic workflows with complete confidence in their safety, resilience, and compliance.",
    "Looking forward to Block Twelve, we build upon the unshakeable safety foundations established by ApexShield, advancing into enterprise evaluation harnesses, continuous benchmarking pipelines, automated model degradation monitoring, and the Grand Master Capstone.",
    "Mastering the ApexShield capstone establishes you as a preeminent leader in enterprise AI safety and system architecture. By engineering self-defending, continuously adapting AI ecosystems, you stand at the forefront of the secure artificial intelligence revolution."
]

parts_data = [
    {
        "title": "ApexShield Architecture: The Multi-Tier Defense Mesh Blueprint",
        "say": part1_say,
        "example": "Layered defensive firewalls intercept adversarial exploits systematically.",
        "tryIt": "Architect a multi tier defense mesh protecting foundation model APIs.",
        "check": {
            "question": "What core architectural principle distinguishes ApexShield from single-point AI safety solutions?",
            "options": [
                "Defense-in-depth across ingress input, in-flight runtime, egress output, and automated red-teaming",
                "Relying entirely on a single regex blocklist placed inside the client web browser",
                "Shutting down foundation model servers whenever a question contains an uppercase letter",
                "Encrypting model weights with a password that must be manually entered every sixty seconds"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "ApexShield enforces layered defense-in-depth across input, runtime, output, and continuous red-teaming, preventing single-point-of-failure vulnerabilities."
        }
    },
    {
        "title": "Input Interception Mesh: Perplexity, Llama Guard, And Classifiers",
        "say": part2_say,
        "example": "Multi tier input filters achieve microsecond detection with zero leakage.",
        "tryIt": "Deploy an input inspection proxy screening perplexity and hazard types.",
        "check": {
            "question": "Why does perplexity estimation effectively intercept Greedy Coordinate Gradient (GCG) adversarial suffixes?",
            "options": [
                "GCG suffixes minimize loss mathematically, resulting in unnatural token sequences with high statistical surprisal",
                "Perplexity engines translate every prompt into medieval Latin before processing",
                "GCG attacks only work on physical optical discs rather than digital text tokens",
                "Transformer attention heads refuse to run backward passes if perplexity is below zero"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "GCG suffixes optimize token loss without syntax constraints, producing high perplexity that anomaly detectors catch in milliseconds."
        }
    },
    {
        "title": "Programmable Execution Guardrails: NeMo Colang Flows And Sandboxing",
        "say": part3_say,
        "example": "Execution guardrails enforce policy flows and isolate untrusted tool calls.",
        "tryIt": "Implement programmable dialog rails constraining multi turn agent state.",
        "check": {
            "question": "How does the NeMo Guardrails Colang engine maintain safe conversational trajectories in autonomous agents?",
            "options": [
                "By executing declarative state transition rules that steer conversational flows and block unauthorized topics",
                "By disconnecting the network interface whenever a user enters a complex question",
                "By forcing the user to re-authenticate with biometric scanning on every token generated",
                "By deleting the agent memory database after every single character typed"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Colang declarative dialog flows constrain conversational states, steering dialog away from prohibited topics and unapproved tool calls."
        }
    },
    {
        "title": "Output Scrubbing, Canary Leakage Traps, And Cryptographic Auditing",
        "say": part4_say,
        "example": "Cryptographic audit ledgers record verified model completions securely.",
        "tryIt": "Construct an output scrubber masking sensitive records and canary tokens.",
        "check": {
            "question": "What is the primary defensive function of injecting canary honeypot tokens into system instructions?",
            "options": [
                "To detect prompt extraction attacks deterministically if the canary token appears in the generated output",
                "To increase the floating point precision of GPU tensor multiplication operations",
                "To generate colorful ASCII art banners on the system administrator terminal",
                "To compress large context windows into smaller physical byte representations"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Canary tokens act as cryptographic tripwires; if an attacker coaxes the model into regurgitating system instructions, the canary in output triggers an immediate block."
        }
    },
    {
        "title": "The Continuous Immune System: Autonomous Fuzzing And Self-Hardening",
        "say": part5_say,
        "example": "ApexShield achieves ninety nine percent attack deflection in production.",
        "tryIt": "Deploy the integrated ApexShield capstone defense mesh in production.",
        "check": {
            "question": "What key benchmark metric confirms the operational success of the ApexShield Milestone 8 Capstone?",
            "options": [
                "An overall attack deflection rate of 99.8% with an end-to-end defense latency of 18.4ms",
                "A requirement that human operators review and manually approve every individual token",
                "A total shutdown of all foundation model APIs during business hours",
                "A zero percent deflection rate combined with unconstrained public database write access"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "The ApexShield capstone achieves 99.8% attack deflection with 18.4ms end-to-end latency and 0.0% canary extraction rate across 10,000 evaluated attacks."
        }
    }
]

code_snippet = """import json
import hashlib
from typing import Dict, Any, List

def run_apexshield_enterprise_capstone() -> Dict[str, Any]:
    integrated_subsystems = [
        "Perplexity & Llama Guard Multi-Tier Input Sanitizer",
        "NeMo Guardrails Programmable Colang Enforcement Core",
        "Presidio PII/PCI Scrubber & Canary Leakage Trap",
        "Autonomous Continuous Red-Teaming Fuzzing Harness",
        "Cryptographic Safety Provenance & Audit Ledger"
    ]
    safety_metrics = {
        "overallAttackDeflectionRatePct": 99.8,
        "endToEndDefenseLatencyMs": 18.4,
        "enterpriseFalsePositiveRatePct": 0.2,
        "zeroDayJailbreakImmunityScorePct": 98.9,
        "canaryExtractionVulnerabilityRatePct": 0.0
    }
    return {
        "defensePlatform": "ApexShield Sovereign Enterprise AI Defense Architecture",
        "integratedSubsystems": integrated_subsystems,
        "enterpriseSafetyMetrics": safety_metrics,
        "certificationTier": "APEX_AI_SAFETY_ARCHITECT",
        "milestoneStatus": "BLOCK_11_MILESTONE_8_ACCOMPLISHED"
    }

if __name__ == "__main__":
    result = run_apexshield_enterprise_capstone()
    print(json.dumps(result, indent=2))"""

code_hash = hashlib.sha256(code_snippet.encode('utf-8')).hexdigest()

output_snippet = """{
  "defensePlatform": "ApexShield Sovereign Enterprise AI Defense Architecture",
  "integratedSubsystems": [
    "Perplexity & Llama Guard Multi-Tier Input Sanitizer",
    "NeMo Guardrails Programmable Colang Enforcement Core",
    "Presidio PII/PCI Scrubber & Canary Leakage Trap",
    "Autonomous Continuous Red-Teaming Fuzzing Harness",
    "Cryptographic Safety Provenance & Audit Ledger"
  ],
  "enterpriseSafetyMetrics": {
    "overallAttackDeflectionRatePct": 99.8,
    "endToEndDefenseLatencyMs": 18.4,
    "enterpriseFalsePositiveRatePct": 0.2,
    "zeroDayJailbreakImmunityScorePct": 98.9,
    "canaryExtractionVulnerabilityRatePct": 0.0
  },
  "certificationTier": "APEX_AI_SAFETY_ARCHITECT",
  "milestoneStatus": "BLOCK_11_MILESTONE_8_ACCOMPLISHED"
}"""

captions_data = [
    {
        "say1": "ApexShield establishes an enterprise defense in depth security mesh.",
        "say2": "The multi tier defense mesh integrates input runtime and output layers.",
        "example": "Layered defensive firewalls intercept adversarial exploits systematically.",
        "tryIt": "Architect a multi tier defense mesh protecting foundation model APIs."
    },
    {
        "say1": "Perimeter input sanitizers screen adversarial prompt payloads in speed.",
        "say2": "Perplexity estimators and safety classifiers filter malicious tokens.",
        "example": "Multi tier input filters achieve microsecond detection with zero leakage.",
        "tryIt": "Deploy an input inspection proxy screening perplexity and hazard types."
    },
    {
        "say1": "Programmable dialogue flows constrain model execution within safe rails.",
        "say2": "Declarative Colang policies steer conversational trajectories safely.",
        "example": "Execution guardrails enforce policy flows and isolate untrusted tool calls.",
        "tryIt": "Implement programmable dialog rails constraining multi turn agent state."
    },
    {
        "say1": "Post generation filters scrub sensitive data and detect canary tokens.",
        "say2": "Canary token traps intercept prompt extraction attempts deterministically.",
        "example": "Cryptographic audit ledgers record verified model completions securely.",
        "tryIt": "Construct an output scrubber masking sensitive records and canary tokens."
    },
    {
        "say1": "Continuous automated red teaming hardens the enterprise immune system.",
        "say2": "Autonomous red teaming meshes continuously probe and repair guardrails.",
        "example": "ApexShield achieves ninety nine percent attack deflection in production.",
        "tryIt": "Deploy the integrated ApexShield capstone defense mesh in production."
    }
]

titles = [
    "ApexShield Architecture The Multi Tier Defense Mesh Blueprint.",
    "Input Interception Mesh Perplexity Llama Guard And Classifiers.",
    "Programmable Execution Guardrails NeMo Colang Flows And Sandboxing.",
    "Output Scrubbing Canary Leakage Traps And Cryptographic Auditing.",
    "The Continuous Immune System Autonomous Fuzzing And Self Hardening."
]

columns_list = [
    ["Defense Tier", "Operational Mechanism", "Protection SLA"],
    ["Inspection Stage", "Detection Primitive", "Filtering Latency SLA"],
    ["Guardrail Component", "Policy Specification", "Enforcement Reliability SLA"],
    ["Scrubbing Module", "Forensic Technique", "Compliance Standard SLA"],
    ["Subsystem Module", "Architecture Role", "Verification Metric SLA"]
]

steps_rows = [
    [
        [["Perimeter Ingress Gateway", "Perplexity Anomaly Detection And Token Filtering", "Sub Ten Milliseconds Screening"], ["Semantic Classifier Tier", "Llama Guard Safety Taxonomy Categorization", "Microsecond Policy Enforcement"]],
        [["Programmable Runtime Rail", "NeMo Colang Dialogue Flow Steering", "Deterministic Turn Execution"], ["Post Generation Scrubber", "Presidio PII Entity Masking And Redaction", "Flawless Privacy Preservation"]],
        [["Canary Extraction Trap", "Cryptographic Honeypot Token Verification", "Zero System Prompt Leakage"], ["Immutable Audit Ledger", "Cryptographic Hash Provenance Chains", "Statutory Compliance Guarantee"]],
        [["Layered Defense Mesh", "Synchronized Defense In Depth Protection", "Ninety Nine Percent Resilience"], ["Apex Sovereign Gateway", "Unified Multi Tier Enterprise AI Firewall", "Enterprise Production Grade SLA"]]
    ],
    [
        [["Perplexity Analysis", "Ngram Surprisal And Cross Entropy Scoring", "Single Millisecond Screening"], ["Embedding Distance Gate", "Cosine Similarity Against Jailbreak Vectors", "Low Latency Vector Lookup"]],
        [["Llama Guard Inference", "Fine Tuned Safety Taxonomy Categorization", "Eighteen Milliseconds Evaluation"], ["Multi Modal Scanner", "Cross Attention Perturbation Analysis", "Comprehensive Image Text Defense"]],
        [["Token Smuggling Trap", "Base Sixty Four And Unicode Normalization", "Immediate Perimeter Rejection"], ["Adaptive Rate Limiter", "Dynamic Probing Velocity Throttling", "Denial Of Service Protection"]],
        [["Ingress Security Mesh", "Unified Perimeter Pre Flight Sanitization", "Zero Unchecked Prompt Leakage"], ["Perimeter Defense Shield", "Deflects Adversarial Inputs Deterministically", "Ultra Low False Positive SLA"]]
    ],
    [
        [["Colang Flow Controller", "Declarative Dialogue State Transition Trees", "Deterministic Conversation Steering"], ["Topical Self Check Rail", "Secondary LLM Verification Of User Intent", "Sub Second Intent Verification"]],
        [["Tool Authorization Gate", "Schema Conformance And Parameter Sanitization", "Zero Injection Tool Execution"], ["Ephemeral Sandbox Engine", "Isolated Containerized Python Tool Runtime", "Complete OS Kernel Protection"]],
        [["Hallucination Interceptor", "Self Consistency And Groundedness Verification", "Factually Anchored Completions"], ["Memory Boundary Guard", "Prevents Context Poisoning Across Turns", "Strict Conversation Isolation"]],
        [["Runtime Execution Mesh", "End To End Programmable Safety Architecture", "Flawless Behavioral Compliance"], ["Autonomous Agent Guard", "Protects Tool Augmented Agent Workflows", "Uncompromising Safety Standards"]]
    ],
    [
        [["Presidio Entity Recognizer", "Named Entity Recognition For PII Detection", "GDPR And HIPAA Privacy Standard"], ["PCI DSS Credit Card Mask", "Luhn Algorithm Check With Regex Substitution", "Zero Payment Record Exposure"]],
        [["Canary Honeypot Monitor", "Exact Cryptographic Nonce Token Matching", "Zero Prompt Extraction Leakage"], ["Entropy Secret Scanner", "Shannon Information Entropy Peak Detection", "Immediate Secret Key Scrubbing"]],
        [["Synthetic Data Replacer", "Substitutes Sensitive Fields With Fake Values", "Preserves Downstream Utility"], ["Automated Redaction Log", "Emits Redacted Completion Audit Transcripts", "Complete Operational Transparency"]],
        [["Cryptographic Ledger Core", "Append Only SHA Two Fifty Six Provenance Chains", "SOC Two Compliance Certification"], ["Egress Defense Gateway", "Comprehensive Post Generation Sanitization", "Flawless Output Governance SLA"]]
    ],
    [
        [["Multi Tier Input Proxy", "Perplexity And Llama Guard Pre Flight Shield", "Eighteen Millisecond Latency SLA"], ["NeMo Colang Engine", "Programmable Dialog Steerage And Rail Routing", "Deterministic State Transitions"]],
        [["Presidio Canary Core", "PII Redaction And Prompt Honeypot Trapping", "Zero Sensitive Data Spillage"], ["Continuous Red Teamer", "Autonomous Multi Algorithm Adversarial Fuzzing", "Ten Thousand Attack Vectors Probed"]],
        [["Cryptographic Audit Vault", "Immutable Hash Chaining And Audit Provenance", "Statutory Compliance Assurance"], ["Immune Self Healing", "Synthesizes Defensive Rules From Red Teaming", "Rapid Automated Patch Deployment"]],
        [["ApexShield Enterprise Mesh", "Unified Defense Platform For Sovereign AI", "Ninety Nine Point Eight Percent Deflection"], ["Milestone Eight Capstone", "Full Block Eleven Enterprise Certification", "Mastery Of AI Safety Systems"]]
    ]
]

# Verify lengths and digits
for p_idx, cap_dict in enumerate(captions_data):
    for k, text_str in cap_dict.items():
        assert len(text_str) <= 75, f"Part {p_idx+1} {k} caption too long: {len(text_str)} ({text_str})"
        assert text_str.endswith('.'), f"Part {p_idx+1} {k} caption must end with dot: {text_str}"
        assert not any(c.isdigit() for c in text_str), f"Part {p_idx+1} {k} caption has digits: {text_str}"

for t in titles:
    assert len(t) <= 75, f"Title too long: {len(t)} ({t})"
    assert t.endswith('.'), f"Title must end with dot: {t}"
    assert not any(c.isdigit() for c in t), f"Title has digits: {t}"

for cols in columns_list:
    for c in cols:
        assert not any(ch.isdigit() for ch in c), f"Column has digits: {c}"

for p_idx, steps in enumerate(steps_rows):
    assert len(steps) == 4, f"Part {p_idx+1} must have 4 steps"
    for s_idx, rows in enumerate(steps):
        assert len(rows) == 2, f"Part {p_idx+1} step {s_idx+1} must have 2 rows"
        for r_idx, row in enumerate(rows):
            assert len(row) == 3, f"Part {p_idx+1} step {s_idx+1} row {r_idx+1} must have 3 cells"
            for c_idx, cell in enumerate(row):
                assert not any(ch.isdigit() for ch in cell), f"Part {p_idx+1} step {s_idx+1} cell {r_idx+1},{c_idx+1} has digits: {cell}"

# Build visual entries
visual_entries = []
step_keys = ["say1", "say2", "example", "tryIt"]

for p_idx in range(5):
    p_num = p_idx + 1
    p_title = parts_data[p_idx]["title"]
    v_title = titles[p_idx]
    v_cols = columns_list[p_idx]
    
    steps = []
    for s_idx, key in enumerate(step_keys):
        cap = captions_data[p_idx][key]
        rows = steps_rows[p_idx][s_idx]
        steps.append({
            "at": key,
            "caption": cap,
            "rows": rows
        })
        
    spec = {
        "template": "table",
        "title": v_title,
        "columns": v_cols,
        "steps": steps
    }
    
    visual_entries.append({
        "partTitle": p_title,
        "codeHash": code_hash,
        "spec": spec
    })

visual_envelope = {
    "schemaVersion": "2.0.0",
    "course": "prompt-py",
    "day": 55,
    "prefix": "prompt-py",
    "entries": visual_entries
}

# Build parts list for lesson
lesson_parts = []
total_words = 0
for idx, p in enumerate(parts_data):
    w_cnt = len(" ".join(p["say"]).split())
    total_words += w_cnt
    print(f"Part {idx+1}: {w_cnt} words")

for idx, p in enumerate(parts_data):
    w_cnt = len(" ".join(p["say"]).split())
    assert w_cnt >= 600, f"Part {idx+1} word count too low: {w_cnt}"
    lesson_parts.append({
        "title": p["title"],
        "say": p["say"],
        "example": p["example"],
        "code": code_snippet,
        "output": output_snippet,
        "tryIt": p["tryIt"],
        "check": p["check"]
    })

print(f"Total words: {total_words}")
assert total_words >= 3100, f"Total words too low: {total_words}"

lesson = {
    "id": "prompt-py-55",
    "day": 55,
    "course": "prompt-py",
    "title": "Milestone 8 Capstone: ApexShield: Enterprise Multi-Tier AI Defense Mesh, Real-Time Guardrail Engine & Adversarial Immune System",
    "minutes": 45,
    "parts": lesson_parts,
    "projectStep": {
        "title": "Deploy ApexShield Enterprise Multi-Tier AI Defense Mesh",
        "steps": [
            "Construct an ingress perimeter proxy evaluating token perplexity and Llama Guard hazard categories.",
            "Deploy runtime NeMo Colang dialogue guardrails steering conversations and sandboxing tool execution.",
            "Integrate Presidio output scrubbing, honeypot canary leakage traps, and Shannon entropy secret scanning.",
            "Deploy the continuous autonomous red-teaming fuzzing harness executing automated penetration sweeps.",
            "Synchronize cryptographic safety provenance ledgers with enterprise SIEM and validate the complete ApexShield defense mesh."
        ]
    },
    "summary": [
        "ApexShield establishes a synchronized multi-tier defense mesh across ingress, runtime, egress, and red-teaming.",
        "Ingress perimeter screening intercepts GCG adversarial suffixes and hazard categories in under twenty milliseconds.",
        "Programmable Colang flows steer dialogue trajectories and isolate untrusted tool calls within ephemeral sandboxes.",
        "Egress scrubbing protects corporate secrets using Presidio PII masking, canary tripwires, and entropy scanning.",
        "ApexShield achieves ninety-nine point eight percent attack deflection, completing Milestone Eight Capstone certification."
    ]
}

# Write lesson JSON and visual envelope JSON
with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day55_lesson.json", "w", encoding="utf-8") as f:
    json.dump(lesson, f, indent=2)

with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-55.json", "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2)

print("Generated Day 55 lesson JSON and Visual Envelope successfully!")
