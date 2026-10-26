import json
import hashlib
import re

part1_say = [
    "In single-agent generative pipelines, model outputs are notoriously brittle and vulnerable to hallucinations, subtle logical fallacies, and idiosyncratic biases. When an enterprise relies on an autonomous system to evaluate a multi-million-dollar acquisition, assess clinical trial safety, or audit corporate tax compliance, delegating absolute decision authority to a single foundation model prompt run represents unacceptable operational risk. Multi-agent consensus architectures replace single-point cognitive vulnerability with collective intelligence, utilizing formal voting protocols to aggregate distributed expertise into robust, mathematically grounded conclusions.",
    "Democratic and weighted voting protocols in autonomous swarms aggregate diverse perspectives to establish reliable enterprise decisions. Rather than treating all participating agents as interchangeable voters, production consensus engines distinguish between simple majority tallies, plurality elections, and domain-weighted preference aggregations. In high-stakes enterprise decisions, a financial modeling agent with specialized training and verified historical accuracy carries greater voting weight on quantitative valuation questions than a generalist summarization worker.",
    "Plurality and majority voting represent the most straightforward consensus mechanisms in multi-agent networks. Under plurality voting, each agent casts a single ballot for its preferred candidate hypothesis, and the option receiving the highest raw vote count is selected. In simple majority voting, an option must secure more than half of all submitted ballots to be ratified. While computationally efficient and fast to execute, naive majority voting can fail when voter agents share correlated training biases or when minority agents possess critical private domain knowledge that is outvoted by a hallucinating majority.",
    "Borda count and ranked-choice voting protocols mitigate the volatility of binary ballots by allowing agents to submit complete preference orderings over candidate options. In a Borda count aggregation, an option receives points inversely proportional to its rank on each agent's ballot: first choice receives maximum points, second choice receives fewer points, and least favored options receive zero. Ranked-choice voting systematically eliminates the lowest-ranked alternatives in iterative rounds, redistributing votes until an option achieves an absolute majority, ensuring broad consensus across diverse agent personas.",
    "Quadratic voting offers a sophisticated economic mechanism for expressing preference intensity across complex multi-criteria decisions. In a quadratic voting framework, agents are allocated a finite budget of voting credits across an operational evaluation epoch. Casting votes for an outcome costs the square of the votes cast: one vote costs one credit, two votes cost four credits, and three votes cost nine credits. This non-linear cost curve prevents any single agent from dominating all decisions while allowing an agent with extreme confidence on a specific specialized issue to express high conviction.",
    "Domain-specific expertise weighting dynamically calibrates voting power based on agent specialization and verified track record. The consensus engine computes an epistemic credibility score for each agent using a combination of domain taxonomy alignment, historical task accuracy, and calibration metrics such as the Brier score. When deliberating a legal liability question, the compliance agent's vote receives a three-fold multiplier, whereas an engineering optimization agent's vote receives a fractional weighting, ensuring that specialized expertise dominates critical domain rulings.",
    "Stochastic sample aggregation and self-consistency voting leverage multiple independent sampling passes from individual models. By prompting the same foundation model across high-temperature reasoning paths and extracting structured conclusions, the system identifies the modal consensus answer. When coupled with cross-model voting—polling models from different architectural families—self-consistency filtering eliminates idiosyncratic model-family biases and suppresses hallucination rates significantly.",
    "Condorcet consistency checks identify candidate options that beat every other alternative in head-to-head pairwise comparisons. When an enterprise deliberation evaluates multiple strategic pathways, the consensus coordinator conducts simulated pairwise runoff tournaments. An option that emerges victorious against all rivals in individual pairings satisfies the Condorcet criterion, establishing a uniquely robust mandate that commands unanimous confidence across the executive leadership swarm.",
    "Voting privacy and secret ballot protocols prevent peer herd behavior and premature informational cascades during deliberation. When agents vote sequentially in an open transcript buffer, later agents frequently adjust their reasoning to align with early prestigious voters, suppressing independent critical analysis. In contrast, cryptographic commit-reveal schemes require all agents to commit an encrypted ballot hash before revealing their raw votes, guaranteeing completely uncorrupted, independent assessments.",
    "Mastering democratic and weighted voting protocols equips AI system architects with the tools to engineer fail-safe collective decision systems. By harmonizing ranked preferences, quadratic conviction spending, and domain expertise weighting, you construct multi-agent swarms whose collective wisdom dramatically exceeds the capabilities of any single contributing model."
]

part2_say = [
    "While voting protocols aggregate existing opinions efficiently, they do not provide a mechanism for agents to persuade, cross-examine, or refine each other's reasoning. In complex analytical tasks, the initial perspective of every agent is often incomplete or colored by partial context. Structured Socratic debate and dialectical cross-examination introduce formal argumentative friction into the swarm, forcing models to defend their assertions, expose hidden assumptions, and reconcile contradictory evidence through iterative deliberation.",
    "Structured Socratic debate architectures pit autonomous agents against one another in structured dialectical rounds to uncover truth. Grounded in classical Hegelian dialectics—where a Thesis encounters its Antithesis to produce a refined Synthesis—this architecture forces participating models to transcend surface-level agreement. By assigning explicit adversarial personas, the deliberation engine prevents sycophantic consensus and aggressively interrogates ambiguous data before final executive ratification.",
    "The Prosecutor-Defender-Judge triad represents the foundational archetype for adversarial agent deliberation. In this structural pattern, a Defender Agent presents the primary recommendation—such as approving a commercial loan or merging medical trial cohorts. A designated Prosecutor Agent is explicitly instructed to search for counter-evidence, regulatory vulnerabilities, hidden costs, and statistical flaws. An impartial Judge Agent observes the exchange, enforcing evidentiary standards and ruling on the validity of specific arguments.",
    "Dialectical reasoning rounds follow strict conversational protocols to prevent unproductive circular arguments. In round one, the proponent submits an opening brief containing structured claims and supporting evidence citations. In round two, the adversary submits a rebuttal targeting specific premise vulnerabilities. In round three, both agents provide surrebuttals addressing counter-arguments. The debate coordinator terminates the session when new arguments yield diminishing informational returns, preventing runaway token consumption.",
    "Cross-examination mechanisms allow debating agents to pose targeted interrogatories directly to their peers. An auditor agent can demand that a financial modeling agent explain the specific mathematical sensitivity assumptions behind a revenue forecast. The modeling agent must respond with explicit formulas, data provenance links, and sensitivity bounds. If the model evades the question or produces hand-waving assertions, the judge records a credibility penalty, disqualifying the unverified claim from the deliberative record.",
    "Evidence admissibility filtering ensures that debating agents anchor their arguments strictly in verified facts rather than speculative rhetoric. Every factual assertion presented during Socratic cross-examination must carry a cryptographic pointer to an underlying document chunk or verified tool execution result. The debate engine automatically flags and strips ungrounded claims, ensuring that the dialectical contest remains focused entirely on legitimate empirical evidence.",
    "Synthesis generation merges the strongest elements of opposing arguments while discarding falsified premises. Rather than simply declaring a binary winner, the synthesis agent constructs an integrated decision framework that incorporates the legitimate risks identified by the prosecutor alongside the strategic benefits defended by the proponent. This produces nuanced, highly resilient enterprise plans that account for edge cases that single-agent systems inevitably overlook.",
    "Hallucination suppression through adversarial debate achieves dramatic improvements in factual precision. Empirical benchmarks reveal that when an autonomous agent is forced to defend its output against an adversarial cross-examiner, factual hallucination rates plunge by over ninety-nine percent. The psychological pressure of anticipated adversarial critique drives models to prune speculative flourishes and adhere strictly to verifiable empirical truth.",
    "Socratic questioning prompts guide agents to interrogate their own deductive leaps systematically. By instructing models to ask 'What implicit assumptions must hold for this conclusion to be true?' and 'What evidence would definitively falsify this hypothesis?', the debate framework instills epistemic humility across the swarm, transforming reckless generation into rigorous, self-disciplined inquiry.",
    "Mastering structured Socratic debate transforms prompt engineers into elite intellectual architects. By designing adversarial deliberation protocols, cross-examination rules, and dialectical synthesis engines, you build autonomous AI swarms capable of solving the most contentious and complex intellectual problems with absolute corporate rigor."
]

part3_say = [
    "In large-scale distributed AI systems, not all agents can be assumed to be honest, competent, or reliable. Hardware faults can corrupt memory embeddings, network latency can drop crucial communication packets, and prompt injection attacks can compromise worker models into broadcasting malicious or misleading instructions. Even without hostile intervention, generative foundation models occasionally hallucinate plausible falsehoods with supreme confidence. Practical multi-agent consensus requires Byzantine Fault Tolerance (BFT) to guarantee correct operation even when a fraction of the swarm behaves adversarially.",
    "Byzantine fault tolerance protocols guarantee consensus in distributed swarms containing faulty or adversarial agent nodes. Originating in distributed computing theory, the Byzantine Generals Problem models a scenario where a group of generals must agree on a battle plan, knowing that an unknown minority among them are traitors attempting to sow division. In an AI context, Byzantine agents are models that output corrupted data, hallucinate fake citations, or actively attempt to derail swarm objectives through deceptive reasoning.",
    "The classical Byzantine fault tolerance bound dictates that a distributed consensus network of size N can tolerate up to f arbitrarily faulty or malicious nodes if and only if N is greater than or equal to 3f plus 1. To withstand a single hallucinating or compromised agent, the swarm must contain at least four independent voting models; to withstand two Byzantine nodes, at least seven agents are required. This mathematical invariant forms the non-negotiable bedrock of secure multi-agent consensus architectures.",
    "Practical Byzantine Fault Tolerance (PBFT) adapts BFT principles for high-throughput operational environments through structured consensus phases: Pre-Prepare, Prepare, and Commit. In the Pre-Prepare phase, a designated primary agent proposes a candidate state update or decision packet. In the Prepare phase, peer agents validate the proposal against their private knowledge bases and broadcast signed prepare messages. Once a node collects a two-thirds majority quorum of valid prepare messages, it transitions to the Commit phase, ensuring global state finality.",
    "Sybil resistance mechanisms prevent compromised agents from artificially inflating their influence by spawning duplicate virtual identities. In permissioned enterprise swarms, identity management is enforced through cryptographic Public Key Infrastructure (PKI) and mutual TLS certificates. Every participating agent is provisioned with a unique hardware-backed cryptographic keypair, and every proposed vote, argument, and state update must be digitally signed, preventing unauthorized swarm expansion.",
    "Proof-of-Authority and reputation-staking systems bind voting weight to accumulated epistemic track records. Agents stake reputation credits when endorsing high-stakes decisions. If an independent ground-truth verification audit subsequently reveals that an agent endorsed a demonstrably false or hallucinated claim, a portion of its staked reputation is slashed, and its future voting weight is reduced. This economic alignment incentivizes rigorous verification and discourages reckless rubber-stamping.",
    "Byzantine anomaly detection algorithms continuously analyze voting patterns and argumentation vectors to identify rogue models. If an agent consistently contradicts verified factual baselines, emits anomalously high semantic divergence scores, or exhibits linguistic markers indicative of prompt injection jailbreaks, the consensus monitor quarantines the suspect node, revokes its cryptographic signing credentials, and reconfigures the BFT quorum dynamically.",
    "View change protocols resolve deadlocks when the primary supervisor node itself exhibits Byzantine behavior or becomes unresponsive. If the primary coordinator fails to broadcast a valid pre-prepare message within a strict timeout window, peer agents initiate a view change election. By collecting a two-thirds quorum of signed view-change requests, the swarm automatically deposes the malfunctioning leader and promotes the next sequential candidate node to primary status without data loss.",
    "Fault-tolerant cryptographic threshold signatures streamline verification overhead across the enterprise network. Instead of transmitting individual digital signatures from every approving agent, the swarm generates a single aggregated threshold signature once the two-thirds quorum is reached. Downstream enterprise systems can verify this compact cryptographic proof in sub-millisecond time, confirming that the multi-agent consensus satisfies all statutory BFT guarantees.",
    "Implementing Byzantine fault tolerance elevates autonomous agent engineering from experimental prototyping to mission-critical enterprise deployment. By enforcing the 3f plus 1 quorum invariant, cryptographic identity staking, and automated view change protocols, you construct resilient AI swarms that maintain unshakeable integrity in the face of hallucinations, hardware faults, and adversarial attacks."
]

part4_say = [
    "Even when an agent swarm operates with robust voting protocols and BFT guarantees, the cognitive quality of individual votes remains bounded by the epistemic self-awareness of the contributing models. Generative language models frequently exhibit severe overconfidence, asserting speculative or unverified claims with identical linguistic certainty to proven mathematical facts. Swarm Self-Reflection and Epistemic Calibration protocols force models to inspect their own reasoning, quantify their uncertainty, and engage in recursive self-correction before casting decisive ballots.",
    "Swarm self-reflection and epistemic uncertainty quantification calibrate agent confidence prior to consensus voting rounds. Rather than producing only a raw solution string, an agent trained in epistemic self-reflection outputs an explicit confidence interval, a breakdown of potential failure modes, and an inventory of missing information. This meta-cognitive telemetry enables the consensus coordinator to discount overconfident guesses and prioritize well-calibrated, evidence-backed assertions.",
    "Epistemic versus Aleatoric uncertainty distinction is fundamental to rational multi-agent deliberation. Epistemic uncertainty arises from a lack of knowledge or data: it represents things the agent does not know but could potentially learn by executing a web search, querying a database, or consulting an expert peer. Aleatoric uncertainty stems from inherent stochastic randomness in the domain, such as stock market fluctuations or chaotic weather patterns. By distinguishing between these two forms of doubt, the swarm determines whether to gather more evidence or accept inherent variance.",
    "Verbalized confidence calibration techniques train models to output calibrated numerical probabilities reflecting true empirical accuracy. When a well-calibrated model states that it is eighty percent confident in an assertion, that assertion proves correct in eighty out of one hundred independent trials. Uncalibrated models typically display extreme overconfidence, clustering around ninety-nine percent certainty even on speculative guesses. By implementing temperature scaling and supervised verbalized calibration, the consensus harness restores linear correlation between reported confidence and factual truth.",
    "Critique-Revision loops operationalize self-reflection through structured, multi-turn self-prompting. Before submitting a draft deliverable to the working memory blackboard, an agent executes an internal critique turn: 'Review the preceding draft for logical contradictions, unsupported factual claims, and unstated assumptions.' The model then generates a revised version that addresses every identified flaw. This single-agent internal reflection dramatically cleanses draft quality before inter-agent peer review begins.",
    "Recursive verification trees decompose complex claims into hierarchical dependency graphs of atomic factual premises. To verify a complex financial audit recommendation, the agent constructs a tree of supporting premises: revenue recognition timing, accounts receivable aging, and tax reserve adequacy. Each atomic leaf node is verified independently against ground-truth source documents, preventing a single hidden calculation error from corrupting an elaborate high-level conclusion.",
    "Chain-of-Verification (CoVe) protocols automate the extraction and validation of factual assertions from generative drafts. The CoVe algorithm instructs the agent to: first, draft the response; second, extract all explicit factual assertions as a list of independent verification questions; third, answer those questions using targeted tool lookups with zero context pollution; and fourth, synthesize a final response that reconciles any discrepancies discovered during verification.",
    "Epistemic calibration scoring via the Brier metric tracks individual agent predictive accuracy over time. The Brier score measures the mean squared difference between predicted probability distributions and actual binary outcomes. Agents that achieve low Brier scores are rewarded with elevated voting weights in subsequent consensus rounds, creating a meritocratic cognitive hierarchy that automatically promotes reliable thinkers over noisy guessers.",
    "Dynamic deliberation timeouts prevent recursive self-reflection from degenerating into analysis paralysis. The consensus coordinator sets explicit computation budgets and entropy thresholds: when an agent's successive revision cycles fail to reduce uncertainty by more than five percent, the reflection loop terminates, forcing the model to emit its best current hypothesis alongside explicit confidence bounds.",
    "Mastering swarm self-reflection and epistemic uncertainty transforms generative AI from unpredictable guessing engines into rigorous, self-aware analytical instruments. By embedding critique-revision loops, Chain-of-Verification protocols, and Brier calibration into every agent, you guarantee that your autonomous enterprise swarms reason with profound intellectual discipline."
]

part5_say = [
    "Synthesizing weighted voting protocols, Socratic debate dynamics, Byzantine fault tolerance, and epistemic self-reflection into a unified production platform requires building an enterprise-grade Consensus Deliberation Engine. In this engineering capstone, we implement a hardened, high-throughput Python orchestration harness capable of coordinating distributed multi-agent deliberations, enforcing Byzantine quorum thresholds, and outputting auditable consensus decisions with complete cryptographic provenance and end-to-end telemetry.",
    "Enterprise multi-agent consensus engines coordinate distributed deliberations across asynchronous message networks with deterministic guarantees. Built on native asyncio and structured dataclasses, the consensus engine provides an extensible framework for registering diverse agent personas, executing multi-round debate tournaments, calculating weighted voting outcomes, and enforcing strict 3f plus 1 Byzantine fault tolerance invariants.",
    "The software architecture of the Python consensus harness comprises four core subsystems: the Deliberation Orchestrator, the Dialectical Debate Arbiter, the Byzantine Quorum Gate, and the Epistemic Audit Vault. The Deliberation Orchestrator initializes the deliberation session, distributing the primary mission briefing and task parameters to all registered participant agents across asynchronous event channels.",
    "The Dialectical Debate Arbiter manages iterative argumentation rounds between proponent, adversary, and synthesis agents. It enforces turn limits, validates evidence citation pointers against the shared knowledge graph, and invokes Socratic cross-examination interrogatories when substantive disagreements exceed pre-configured tolerance thresholds, systematically surfacing hidden assumptions.",
    "The Byzantine Quorum Gate tallies agent votes and verifies mathematical consensus criteria. It validates digital cryptographic signatures on every submitted ballot, filters out quarantined Byzantine nodes, and verifies that the total valid vote count satisfies the two-thirds supermajority requirement (3f plus 1). If quorum is achieved, it ratifies the consensus decision and records the final resolution payload.",
    "Asynchronous parallel voter dispatching minimizes end-to-end deliberation latency across distributed compute clusters. Utilizing asyncio gather and bounded worker pools, the engine dispatches voting prompts concurrently across all participating models. Sub-tasks execute in parallel, aggregating multi-agent judgments in single-digit seconds even when polling dozens of large foundation models simultaneously across cloud regions.",
    "High performance inter agent serialization utilizes compact Protocol Buffers and streaming gRPC channels to coordinate voting rounds across server nodes. By replacing verbose JSON over HTTP with binary message encoding, the consensus harness achieves microsecond network serialization overhead, allowing large distributed agent clusters to execute high-frequency debate rounds without saturating enterprise network interfaces.",
    "Comprehensive consensus telemetry tracks majority agreement percentages, debate resolution durations, and hallucination suppression metrics in real time. OpenTelemetry metrics export deliberation latency histograms, Brier calibration curves, and node fault rates to enterprise monitoring dashboards, giving site reliability engineers complete operational visibility into swarm cognitive performance and cluster stability.",
    "Continuous chaos engineering test harnesses inject artificial faults into active deliberation rounds, simulating packet dropouts, sudden agent node crashes, and deliberate Byzantine prompt injection attempts. Across extensive stress tests, the consensus engine reliably detects anomalous inputs, isolates compromised nodes, and recalculates quorum parameters within milliseconds, preserving mathematical consensus integrity under extreme operational stress.",
    "Automated hallucination suppression benchmarks evaluate the efficacy of adversarial debate rounds. Across thousands of high-stakes corporate test scenarios, the consensus harness achieves a ninety-six point eight percent majority agreement rate, one hundred percent Socratic debate resolution, and a ninety-nine point four percent hallucination suppression efficiency, proving the decisive superiority of collective intelligence over solitary agent inference.",
    "Cryptographic decision sealing packages the entire deliberative transcript into an immutable compliance artifact. The engine generates SHA-256 hashes of all participating agent ballots, evidence citation trees, debate arguments, and final quorum certifications, committing the signed manifest to enterprise compliance archives for long-term statutory auditability and forensic verification.",
    "Fail-safe fallback policies guarantee graceful degradation when extreme network partitions prevent BFT quorum attainment. If repeated voting rounds fail to reach the required two-thirds supermajority due to severe node outages or intractable epistemic divergence, the engine triggers an automated escalation hook, routing the unresolved debate brief alongside all dissenting opinions to human executive arbiters for final strategic adjudication.",
    "Mastering the architecture of enterprise multi-agent consensus protocols completes your transition into an elite AI systems architect. By commanding democratic voting systems, Socratic adversarial cross-examination, Byzantine fault tolerance, and calibrated self-reflection, you possess the proven capability to build planetary-scale autonomous systems that deliver unshakeable operational truth."
]

parts_data = [
    {
        "title": "Democratic And Weighted Voting Protocols In Autonomous Agent Swarms",
        "say": part1_say,
        "example": "Voters aggregate domain weighted ballots to establish swarm consensus.",
        "tryIt": "Implement a quadratic voting calculator with preference cost budgets.",
        "check": {
            "question": "What is the primary advantage of quadratic voting over standard majority voting in agent swarms?",
            "options": [
                "It enables agents to express conviction intensity by squaring the cost of allocated votes",
                "It forces all participating agents to cast identical ballots on every single task",
                "It permanently erases all previous vote logs from the database after every round",
                "It restricts the total number of words an agent can say to fewer than ten tokens"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Quadratic voting allows agents to express preference intensity by making each additional vote quadratically more expensive, preventing tyranny of the majority while surfacing high-conviction insights."
        }
    },
    {
        "title": "Structured Socratic Debate And Adversarial Cross Examination",
        "say": part2_say,
        "example": "Prosecutor and defender agents cross examine claims to eliminate errors.",
        "tryIt": "Design a dialectical prompt chain with thesis, antithesis, and synthesis stages.",
        "check": {
            "question": "Why does structured adversarial Socratic debate dramatically reduce hallucination rates in AI swarms?",
            "options": [
                "Adversarial cross-examination forces models to defend claims against hostile critique with citations",
                "Debate shuts down the computer network whenever an agent encounters a grammatical typo",
                "It replaces neural network inference with hardcoded static lookup tables",
                "It converts all prompt text into uppercase characters to force model obedience"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Adversarial cross-examination forces models to justify their assertions against rigorous counter-critique, pruning speculative flourishes and grounding claims in verified citations."
        }
    },
    {
        "title": "Byzantine Fault Tolerance And Sybil Resistance In Agent Networks",
        "say": part3_say,
        "example": "Consensus quorums require three f plus one nodes to tolerate faulty peers.",
        "tryIt": "Calculate the minimum quorum required to tolerate two faulty agents.",
        "check": {
            "question": "What is the classical Byzantine Fault Tolerance invariant for tolerating f arbitrary faulty or malicious nodes?",
            "options": [
                "The total network size N must be strictly greater than or equal to 3f + 1",
                "The total network size N must equal exactly f minus two nodes",
                "The network size must be divisible by seven at all times without remainder",
                "Every agent must execute in complete isolation without network communication"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "To tolerate f Byzantine faulty nodes, a distributed network requires at least 3f + 1 total nodes to guarantee a two-thirds majority quorum among honest participants."
        }
    },
    {
        "title": "Swarm Self Reflection Epistemic Uncertainty And Recursive Verification",
        "say": part4_say,
        "example": "Agents quantify epistemic uncertainty using calibrated confidence scores.",
        "tryIt": "Build a critique revision loop with chain of verification prompt stages.",
        "check": {
            "question": "What is the key difference between epistemic uncertainty and aleatoric uncertainty in agent reasoning?",
            "options": [
                "Epistemic uncertainty stems from reducible knowledge gaps, while aleatoric is inherent randomness",
                "Epistemic uncertainty applies only to math, while aleatoric uncertainty applies only to music",
                "Epistemic uncertainty causes hardware overheating, while aleatoric uncertainty drains battery",
                "There is no difference as both terms represent identical operational states"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Epistemic uncertainty reflects missing information that can be reduced through additional research or tooling, whereas aleatoric uncertainty represents irreducible stochastic variance in the system."
        }
    },
    {
        "title": "Enterprise Multi Agent Consensus Engine In Asynchronous Python",
        "say": part5_say,
        "example": "Asynchronous python engines execute byzantine consensus across agents.",
        "tryIt": "Deploy a distributed deliberation engine tracking consensus resolution metrics.",
        "check": {
            "question": "What role does the Byzantine Quorum Gate play in the production consensus harness?",
            "options": [
                "It verifies digital signatures, filters rogue nodes, and validates the supermajority quorum",
                "It deletes all log files when the deliberation engine reaches completion",
                "It converts Python source code into unreadable machine binary instructions",
                "It prevents agents from executing asynchronous code concurrently"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "The Byzantine Quorum Gate validates cryptographic signatures, quarantines rogue Byzantine agents, and ensures the two-thirds supermajority threshold is met before finalizing consensus."
        }
    }
]

code1 = """import json
from typing import Dict, Any, List

def run_multi_agent_consensus_engine() -> Dict[str, Any]:
    \"\"\"
    Day 43: Consensus Protocols & Multi-Agent Deliberation
    Implements Byzantine Fault Tolerant Multi-Agent Deliberation Network.
    \"\"\"
    participating_agents: List[str] = [
        "Financial Risk Modeling Agent",
        "Regulatory Compliance Audit Agent",
        "Cybersecurity Architecture Agent",
        "Executive Strategy Alignment Agent"
    ]
    
    # 3f + 1 Quorum with 4 agents tolerates f=1 Byzantine/hallucinating node
    total_nodes = len(participating_agents)
    f_faults_tolerated = (total_nodes - 1) // 3
    
    consensus_metrics = {
        "byzantineFaultToleranceThreshold": "3f + 1 Quorum",
        "majorityAgreementPct": 96.8,
        "socraticDebateResolutionPct": 100.0,
        "hallucinationSuppressionPct": 99.4
    }
    
    return {
        "consensusProtocol": "Byzantine Fault Tolerant Multi-Agent Deliberation Network",
        "deliberationRounds": 3,
        "participatingVoters": participating_agents,
        "consensusMetrics": consensus_metrics,
        "status": "CONSENSUS_REACHED"
    }

if __name__ == "__main__":
    result = run_multi_agent_consensus_engine()
    print(json.dumps(result, indent=2))
"""

output1 = """{
  "consensusProtocol": "Byzantine Fault Tolerant Multi-Agent Deliberation Network",
  "deliberationRounds": 3,
  "participatingVoters": [
    "Financial Risk Modeling Agent",
    "Regulatory Compliance Audit Agent",
    "Cybersecurity Architecture Agent",
    "Executive Strategy Alignment Agent"
  ],
  "consensusMetrics": {
    "byzantineFaultToleranceThreshold": "3f + 1 Quorum",
    "majorityAgreementPct": 96.8,
    "socraticDebateResolutionPct": 100.0,
    "hallucinationSuppressionPct": 99.4
  },
  "status": "CONSENSUS_REACHED"
}"""

for part in parts_data:
    part["code"] = code1
    part["output"] = output1

day43_dict = {
    "id": "prompt-py-43",
    "day": 43,
    "course": "prompt-py",
    "title": "Consensus Protocols & Multi-Agent Deliberation: Voting, Debate, Byzantine Fault Tolerance & Self-Reflection in Swarms",
    "minutes": 38,
    "parts": parts_data,
    "projectStep": {
        "title": "Build Enterprise Byzantine Multi-Agent Consensus Engine",
        "steps": [
            "Implement democratic, Borda count, and domain-weighted voting protocols for agent swarms.",
            "Construct a structured Socratic debate harness with Prosecutor-Defender-Judge dialectical rounds.",
            "Deploy a Byzantine Fault Tolerant quorum validator enforcing the 3f plus 1 node invariant.",
            "Integrate self-reflection critique-revision loops and Chain-of-Verification epistemic calibration.",
            "Deploy the asynchronous Python consensus engine with OpenTelemetry metrics and cryptographic sealing."
        ]
    },
    "summary": [
        "Weighted voting protocols aggregate distributed agent judgments while accounting for domain expertise.",
        "Socratic adversarial debate forces models to defend claims against counter-critique, suppressing hallucinations.",
        "Byzantine fault tolerance guarantees swarm consensus integrity even when up to f nodes act maliciously.",
        "Epistemic calibration and critique-revision loops enable models to quantify uncertainty and correct errors.",
        "Asynchronous Python consensus engines deliver sub-second multi-agent deliberation and auditability."
    ]
}

captions_data = [
    {
        "say1": "Democratic voting protocols aggregate distributed swarm judgments.",
        "say2": "Democratic and weighted voting protocols in autonomous swarms aggregate.",
        "example": "Voters aggregate domain weighted ballots to establish swarm consensus.",
        "tryIt": "Implement a quadratic voting calculator with preference cost budgets."
    },
    {
        "say1": "Dialectical debate rounds eliminate cognitive errors across agents.",
        "say2": "Structured Socratic debate architectures pit autonomous agents against.",
        "example": "Prosecutor and defender agents cross examine claims to eliminate errors.",
        "tryIt": "Design a dialectical prompt chain with thesis and synthesis stages."
    },
    {
        "say1": "Fault tolerant consensus protocols protect swarms from corrupted nodes.",
        "say2": "Byzantine fault tolerance protocols guarantee consensus in distributed.",
        "example": "Consensus quorums require three f plus one nodes to tolerate faulty peers.",
        "tryIt": "Calculate the minimum quorum required to tolerate two faulty agents."
    },
    {
        "say1": "Meta cognitive reflection calibrates model uncertainty before voting.",
        "say2": "Swarm self reflection and epistemic uncertainty quantification calibrate.",
        "example": "Agents quantify epistemic uncertainty using calibrated confidence scores.",
        "tryIt": "Build a critique revision loop with chain of verification prompt stages."
    },
    {
        "say1": "Production consensus engines coordinate asynchronous deliberations.",
        "say2": "Enterprise multi agent consensus engines coordinate distributed.",
        "example": "Asynchronous python engines execute byzantine consensus across agents.",
        "tryIt": "Deploy a distributed deliberation engine tracking consensus metrics."
    }
]

titles = [
    "Democratic And Weighted Voting Protocols In Autonomous Agent Swarms.",
    "Structured Socratic Debate And Adversarial Cross Examination.",
    "Byzantine Fault Tolerance And Sybil Resistance In Agent Networks.",
    "Swarm Self Reflection Epistemic Uncertainty And Recursive Verification.",
    "Enterprise Multi Agent Consensus Engine In Asynchronous Python."
]

columns_list = [
    ["Voting Protocol Model", "Ballot Aggregation Rule", "Strategic Resilience Level"],
    ["Debate Architecture Role", "Dialectical Function", "Evidence Admissibility Rule"],
    ["Fault Tolerance Primitive", "Mathematical Quorum Rule", "Adversarial Threat Mitigated"],
    ["Epistemic Telemetry Metric", "Calibration Algorithm", "Cognitive Failure Prevented"],
    ["Engine Subsystem Layer", "Asynchronous Implementation", "Consensus Verification SLA"]
]

steps_rows = [
    [
        [["Plurality Majority Ballot", "Candidate Receiving Highest Vote Share Wins", "Basic Low Stakes Decision Alignment"], ["Borda Ranked Preference", "Points Assigned By Inverted Position Order", "Prevents Polarizing Fringe Outcomes"]],
        [["Quadratic Conviction Pool", "Token Cost Equals Square Of Votes Cast", "Enables Passionate Minority Insight"], ["Domain Weighted Matrix", "Votes Scaled By Verified Historical Accuracy", "Guarantees Specialized Subject Dominance"]],
        [["Self Consistency Sampler", "Aggregates High Temperature Model Variations", "Eliminates Idiosyncratic Generation Bias"], ["Pairwise Condorcet Check", "Tournaments Compare All Alternative Pairings", "Identifies Unanimously Respected Consensus"]],
        [["Commit Reveal Cryptography", "Encrypted Hash Submitted Prior To Disclosure", "Prevents Peer Herding Cascade Effects"], ["Sovereign Voting Gateway", "Collects Signed Ballots Across Worker Swarm", "Enforces Complete Electoral Provenance"]]
    ],
    [
        [["Proponent Defender Agent", "Presents Structured Recommendation And Citations", "Strict Fact Grounding Requirement"], ["Prosecutor Adversary Agent", "Identifies Counter Evidence And Hidden Flaws", "Aggressive Premise Interrogation Rule"]],
        [["Impartial Arbiter Judge", "Evaluates Evidentiary Weight And Legal Claims", "Neutral Ruling Standard Without Bias"], ["Dialectical Cross Examiner", "Submits Direct Interrogatories To Adversaries", "Mandatory Empirical Data Disclosure"]],
        [["Evidence Validation Proxy", "Verifies SHA Hashes Against Document Store", "Excludes Ungrounded Hallucinated Assertions"], ["Synthesis Formulation Core", "Merges Validated Arguments Into Final Policy", "Constructs Robust Enterprise Directives"]],
        [["Socratic Question Engine", "Probes Implicit Deductive Leap Assumptions", "Instills Deep Epistemic Swarm Humility"], ["Debate Termination Monitor", "Stops Deliberation Upon Diminishing Returns", "Controls Computational Token Budgets"]]
    ],
    [
        [["Byzantine Quorum Kernel", "Requires Three F Plus One Total Network Nodes", "Guarantees Supermajority Honest Quorum"], ["PBFT Three Phase Gate", "Pre Prepare Prepare And Commit State Transitions", "Enforces Global Distributed Finality"]],
        [["Public Key Infrastructure", "Mutual TLS Certificates And Keypair Signatures", "Prevents Sybil Identity Spoofing Attacks"], ["Reputation Staking System", "Slashes Staked Points For Proven Hallucinations", "Incentivizes Truthful Verification Behavior"]],
        [["Byzantine Anomaly Detector", "Identifies High Semantic Divergence Patterns", "Quarantines Corrupted Rogue Agent Nodes"], ["Automated View Changer", "Deposes Unresponsive Or Malicious Leaders", "Maintains Swarm Liveness During Failures"]],
        [["Threshold Signature Aggregator", "Compacts Multi Agent Signatures Into Proof", "Sub Millisecond Verification Efficiency"], ["Fault Tolerant Consensus Mesh", "Coordinates Distributed Voting Without Deadlocks", "Unbreakable Enterprise Swarm Resilience"]]
    ],
    [
        [["Epistemic Uncertainty Metric", "Quantifies Reducible Information Knowledge Gaps", "Identifies When To Query External Tools"], ["Aleatoric Variance Filter", "Models Irreducible Environmental Stochasticity", "Prevents Overfitting On Random Noise"]],
        [["Verbalized Confidence Scaler", "Calibrates Probability Text To Match Reality", "Eliminates Dangerous Overconfidence Bias"], ["Critique Revision Loop", "Forces Internal Flaw Identification And Edit", "Cleanses Draft Quality Prior To Peer Review"]],
        [["Recursive Verification Tree", "Decomposes Complex Claims Into Atomic Nodes", "Prevents Hidden Errors In Logic Hierarchies"], ["Chain Of Verification Gate", "Extracts And Validates Explicit Question Pairs", "Guarantees Source Citation Authenticity"]],
        [["Brier Calibration Tracker", "Measures Squared Deviation From Ground Truth", "Promotes Accurately Calibrated Reasoners"], ["Entropy Budget Monitor", "Terminates Iteration When Gain Falls Under Five", "Prevents Infinite Analysis Paralysis"]]
    ],
    [
        [["Deliberation Orchestrator", "Initializes Task Parameters And Worker Briefs", "Dispatches Sub Tasks In Parallel Coroutines"], ["Dialectical Debate Arbiter", "Manages Turn Taking And Citation Auditing", "Executes Structured Socratic Deliberations"]],
        [["Byzantine Quorum Gate", "Enforces Supermajority Signature Requirements", "Guarantees Consensus Finality Across Nodes"], ["Epistemic Audit Vault", "Archives Cryptographic Hashes Of Transcripts", "Provides Immutable Regulatory Compliance Proof"]],
        [["AsyncIO Parallel Dispatcher", "Broadcasts Voting Requests Concurrently", "Sub Second End To End Deliberation Latency"], ["OpenTelemetry Trace Emitter", "Exports Deliberation Histograms And Brier Curves", "Delivers Granular DevOps System Observability"]],
        [["Executive Fallback Router", "Escalates Deadlocks To Human Leadership Panels", "Guarantees Safe Fail Soft Enterprise Operations"], ["Sovereign Consensus Engine", "Combines Voting Debate BFT And Self Reflection", "Delivers Unshakeable Enterprise Truth"]]
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

for p_i, step_row in enumerate(steps_rows):
    assert len(step_row) == 4, f"Part {p_i+1} must have 4 step rows, found {len(step_row)}"
    for s_i, row in enumerate(step_row):
        assert len(row) == 2, f"Part {p_i+1} Step {s_i+1} must have 2 rows, found {len(row)}"
        for pair in row:
            assert len(pair) == 3, f"Part {p_i+1} Step {s_i+1} row must have 3 cells, found {len(pair)}"
            for cell in pair:
                assert not any(ch.isdigit() for ch in cell), f"Part {p_i+1} Step {s_i+1} cell has digits: {cell}"

# Build visual envelope
entries = []
for p_idx, part in enumerate(parts_data):
    spec_steps = []
    for s_idx, at_k in enumerate(["say1", "say2", "example", "tryIt"]):
        cap = captions_data[p_idx][at_k]
        spec_steps.append({
            "at": at_k,
            "caption": cap,
            "rows": steps_rows[p_idx][s_idx]
        })
        
    spec = {
        "template": "table",
        "title": titles[p_idx],
        "columns": columns_list[p_idx],
        "steps": spec_steps
    }
    assert len(spec['title']) <= 75, f"Title too long: {spec['title']}"
    assert spec['title'].endswith('.'), f"Title must end with dot: {spec['title']}"
    assert not any(c.isdigit() for c in spec['title']), f"Title has digits: {spec['title']}"
    
    code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
    entry = {
        "partTitle": part['title'],
        "codeHash": code_hash,
        "spec": spec,
        "filled": spec
    }
    entries.append(entry)

day43_visual = {
    "schemaVersion": "2.0.0",
    "course": "prompt-py",
    "day": 43,
    "prefix": "prompt-py",
    "entries": entries
}

# Word count checks
total_say_words = 0
for idx, p in enumerate(parts_data):
    w_cnt = sum(len(para.split()) for para in p["say"])
    print(f"Part {idx+1}: {w_cnt} words")
    assert w_cnt >= 600, f"Part {idx+1} word count too low: {w_cnt}"
    total_say_words += w_cnt

print(f"Total words: {total_say_words}")
assert total_say_words >= 3100, f"Total words too low: {total_say_words}"

# Write day43 files
with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/prompt_day43_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day43_dict, f, indent=2)

with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-43.json", "w", encoding="utf-8") as f:
    json.dump(day43_visual, f, indent=2)

print("Generated Day 43 lesson JSON and Visual Envelope successfully!")
