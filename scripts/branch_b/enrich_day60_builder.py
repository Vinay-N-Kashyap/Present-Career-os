with open("scripts/branch_b/generate_day60.py", "r", encoding="utf-8") as f:
    text = f.read()

# Enrich p1_say
p1_addon = '''    "To ensure mathematical optimality in high-frequency programmatic exchanges, Tier 1 incorporates Thompson Sampling integrated with empirical Bayes "
    "priors for keyword and audience bid valuation. By modeling conversion rate distributions as conjugate Beta posteriors, the system balances exploratory "
    "bid discovery with ruthless revenue exploitation. In first-price exchange environments, the bidding engine estimates clearing price density functions "
    "using Kaplan-Meier survival curves, shading bids dynamically to capture the auction surplus while guaranteeing that cumulative regret asymptotically "
    "satisfies the theoretical Lai and Robbins lower bound.",
'''
text = text.replace('p1_say = [\n', 'p1_say = [\n' + p1_addon)

# Enrich p2_say
p2_addon = '''    "Furthermore, Tier 2 visual generation pipelines integrate IP-Adapter image prompt conditioners alongside LoRA adapters. By extracting dense CLIP "
    "image embeddings from hero product photography, IP-Adapter injects visual reference features directly into the diffusion model's cross-attention layers, "
    "preserving subtle material textures, translucent reflections, and metallic finishes without retraining foundation weights. Coupled with multi-format "
    "diffusion outpainting, the system synthesizes seamless 1:1 square, 9:16 vertical, and 16:9 widescreen assets that preserve flawless compositional balance.",
'''
text = text.replace('p2_say = [\n', 'p2_say = [\n' + p2_addon)

# Enrich p3_say
p3_addon = '''    "In large-scale multi-divisional enterprises, Tier 3 multi-agent swarms resolve resource allocation dilemmas through Nash Bargaining Solutions. "
    "When corporate divisions compete for shared media budgets, the Portfolio Arbitrator Agent computes cooperative game-theoretic equilibria based on each division's "
    "marginal ROAS elasticity. By enforcing automated non-compete keyword pacts and negative match exclusions, the swarm eliminates internal auction cannibalization, "
    "while LangGraph persistent checkpoints guarantee that all state transitions remain fully auditable across distributed enterprise cloud clusters.",
'''
text = text.replace('p3_say = [\n', 'p3_say = [\n' + p3_addon)

# Enrich p4_say
p4_addon = '''    "From an advanced cryptographic perspective, Tier 4 clean room architectures integrate Secure Multi-Party Computation (SMPC) with Homomorphic Encryption. "
    "When computing cross-partner conversion lift with retail media networks, user match sets are compared under encryption, preventing raw identifier exposure. "
    "Simultaneously, causal incrementality is evaluated using Doubly Robust estimators and Synthetic Counterfactual twins, isolating true marketing treatment "
    "effects from baseline organic conversion velocity and providing board-certified econometric proofs of incremental revenue lift.",
'''
text = text.replace('p4_say = [\n', 'p4_say = [\n' + p4_addon)

# Enrich p5_say
p5_addon = '''    "In the executive boardroom, the CMTO presents the definitive five-tier audit scorecard to the Board of Directors, Chief Executive Officer, and Audit Committee. "
    "By demonstrating empirical proofs of 38% regret reduction in programmatic bidding, 100% C2PA and EU AI Act compliance in generative media, zero internal "
    "cannibalization across multi-agent swarms, and mathematical zero-knowledge privacy in clean rooms, the CMTO establishes unshakeable commercial credibility. "
    "The boardroom defense culminates in unanimous executive approval of the sovereign marketing charter and the formal conferral of the CMTO-MPA designation.",
'''
text = text.replace('p5_say = [\n', 'p5_say = [\n' + p5_addon)

with open("scripts/branch_b/generate_day60.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Enriched generate_day60.py successfully!")
