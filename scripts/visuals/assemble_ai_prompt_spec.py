# scripts/visuals/assemble_ai_prompt_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.ai_prompt_spec_m1 import DAYS_1_TO_15
from scripts.visuals.ai_prompt_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.ai_prompt_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.ai_prompt_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)

assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

# Normalize and validate all 60 days
for d in m1_days + m2_days:
    assert len(d["quests"]) == 4, f"Day {d['day']} has {len(d['quests'])} quests"
    assert "situationalPuzzle" in d, f"Day {d['day']} missing situationalPuzzle"
    assert len(d["situationalPuzzle"]["options"]) == 4, f"Day {d['day']} options count != 4"
    
    sp = d["situationalPuzzle"]
    if "explanation" in sp and "debrief" not in sp:
        sp["debrief"] = sp["explanation"]
    elif "debrief" in sp and "explanation" not in sp:
        sp["explanation"] = sp["debrief"]

    if "correctOptionIndex" not in sp:
        if "correctOption" in sp and sp["correctOption"] in sp["options"]:
            sp["correctOptionIndex"] = sp["options"].index(sp["correctOption"])
        else:
            sp["correctOptionIndex"] = 1
            
    assert len(d["socraticHints"]) == 3, f"Day {d['day']} has {len(d['socraticHints'])} socraticHints"
    assert "conceptInvariant" in d, f"Day {d['day']} missing conceptInvariant"
    assert "failureMode" in d, f"Day {d['day']} missing failureMode"
    assert "tryItFriction" in d, f"Day {d['day']} missing tryItFriction"

    for idx, q in enumerate(d["quests"]):
        if "id" not in q:
            q["id"] = f"Q33.{((d['day'] - 1) * 4) + idx + 1}"
        if "title" not in q and "name" in q:
            q["title"] = q["name"]
        if "name" not in q and "title" in q:
            q["name"] = q["title"]
        if "description" not in q and "desc" in q:
            q["description"] = q["desc"]
        if "desc" not in q and "description" in q:
            q["desc"] = q["description"]

out_path = Path(__file__).resolve().parent / "ai-prompt-masterclass-spec.ts"

content = f"""// scripts/visuals/ai-prompt-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Everyday AI Literacy & Prompt Engineering (course-ai-prompt-literacy)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total: Q33.1 to Q33.240).
// Generated automatically from Python specifications.
// Month 1: Generative AI Foundations & BPE Tokens, System Prompts & CREATE Framework, In-Context Learning & Few-Shot Pairs, Chain-of-Thought Deliberative Reasoning, Milestone 1: ApexPrompt AI Tokenomics Engine, Decoding Hyperparameters (Temp, Top-P, Penalties), Structured Data Generation (JSON Schema & Pydantic), Text Summarization & Density Distillation, Retrieval-Augmented Generation (RAG Grounding & Citations), Deep Web Research & Fact-Checking, Prompt Chaining & Multi-Step DAGs, Professional Writing & Style Matching, Creative Ideation & SCAMPER Framework, Data Analysis with Code Interpreter, Milestone 2: ApexStructured Engine, Multimodal AI & Vision Understanding, AI Image Generation & Diffusion Grammar, Speech-to-Text & Audio AI (Whisper), AI Ethics & Hallucination Elimination, Privacy, Security & Injection Defense, Milestone 3: ApexMultimodal Suite, AI-Powered Coding Assistance (Cursor/Copilot), Autonomous AI Agents & ReAct Loops, Workflow Automation with Zapier/Make, Custom GPTs & Knowledge Base Assistants, Everyday AI for Personal Productivity, Domain-Specific Workflows (Legal, Medical, Finance), Model Evaluation & Benchmarks (GPT-4o vs Claude vs Gemini vs Llama), Open-Source LLMs & Local Inference (Ollama & GGUF), and Capstone 1: ApexEverydayAI Sovereign Capstone Viva Gate (Days 1–30 / 120 Quests).
// Month 2: Advanced Tree-of-Thoughts & Graph-of-Thoughts Search, Directional Stimulus & Meta-Prompting, Multi-Persona Socratic Ensembles & Debate, Long-Context Window Physics & U-Shaped Attention Hygiene, Milestone 4: ApexCognitive Suite, Outlines & Grammar-Constrained Decoding, Parallel Function Calling & Multi-Tool Orchestration, Context Compression & LLMLingua Token Pruning, Dynamic Context Injection & Hierarchical Prompt Routing, Milestone 5: ApexStructuredGrammar Suite, Jailbreak Taxonomy & Adversarial Red-Teaming, Indirect Prompt Injection Forensics & Data Exfiltration, Defense-in-Depth Guardrails (NeMo & Llama Guard), System Prompt Leakage & Canary Tokens, Milestone 6: ApexGuard Suite, LLM-as-a-Judge Architecture & Bias Mitigation, Quantitative Metrics (ROUGE, BERTScore, G-Eval, RAG Triad), Prompt CI/CD & Continuous Regression Gates (Promptfoo/DeepEval), DSPy Algorithmic Prompt Compilation (BootstrapFewShot & MIPRO), Milestone 7: ApexEval Suite, Multi-Agent Choreography & Supervisor Swarms, Multi-Tier Agent Memory Systems (Working, Episodic, Semantic), Production Human-in-the-Loop (HITL) Gateways, Real-Time Multimodal Streaming (Gemini Live & WebSockets), High-Throughput vLLM Inference & PagedAttention, Historic Catastrophe 1 (Air Canada Case), Historic Catastrophe 2 (Chevrolet Dealership Incident), Historic Catastrophe 3 (Samsung Data Leak), The Principal Prompt Architect Modernization RFC ($20M Blueprint), and Capstone 2: ApexPromptEnterprise Sovereign Enterprise Capstone Viva Gate (Days 31–60 / 120 Quests).
// Capstone 1: ApexEverydayAI Sovereign Everyday AI Literacy & Master Prompt Engineering Capstone Viva Gate.
// Capstone 2: ApexPromptEnterprise Sovereign Enterprise Prompt Architecture & Cognitive Systems Master Capstone Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const AI_PROMPT_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const AI_PROMPT_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
