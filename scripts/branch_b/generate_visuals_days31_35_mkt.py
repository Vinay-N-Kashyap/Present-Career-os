# -*- coding: utf-8 -*-
"""
Generate Gate v2 Visual Envelopes for bcom-marketing Days 31 to 35.
Template: funnel
Invariants:
- Exactly 4 steps per entry: ['intro', 'say1', 'example', 'tryIt']
- Captions <= 75 chars, ending with '.', ZERO digits (!/\\d/)
- SHA-256 bindings matching code snippets
"""

import json
import hashlib
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

from create_day31_mkt import day31_data
from create_day32_mkt import day32_data
from create_day33_mkt import day33_data
from create_day34_mkt import day34_data
from create_day35_mkt import day35_data

days = [day31_data, day32_data, day33_data, day34_data, day35_data]

visuals_dir = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom-marketing')
os.makedirs(visuals_dir, exist_ok=True)

# Captions per part step - strict zero digits and <= 75 chars
step_metadata = {
    31: [
        # Part 1: Brand Relationship Spectrum
        [
            ("intro", "Total audience reach baseline across enterprise categories.", "top"),
            ("say1", "Qualified segment intent evaluating corporate master brand trust.", "qual"),
            ("example", "Target division consideration assessing category distance.", "target"),
            ("tryIt", "Final retained buyers under optimal portfolio relationship.", "final")
        ],
        # Part 2: Brand Extension Economics
        [
            ("intro", "Initial market awareness assessing parent brand reputation.", "top"),
            ("say1", "Qualified trial intent measuring perceived category fit.", "qual"),
            ("example", "Target evaluation balancing skill transfer and association.", "target"),
            ("tryIt", "Final repeat purchases confirming zero brand dilution.", "final")
        ],
        # Part 3: Brand Portfolio Auditing
        [
            ("intro", "Total corporate portfolio brand reach before restructuring.", "top"),
            ("say1", "Qualified segment coverage across strategic brand tiers.", "qual"),
            ("example", "Target allocation harvesting cash cows to fund growth.", "target"),
            ("tryIt", "Final rationalized brand assets maximizing enterprise profit.", "final")
        ],
        # Part 4: Keller's Brand Hierarchy
        [
            ("intro", "Corporate institutional trust establishing baseline credibility.", "top"),
            ("say1", "Family brand community fostering lifestyle engagement.", "qual"),
            ("example", "Individual brand selection driving category purchase choice.", "target"),
            ("tryIt", "Modifier trim selection optimizing customer price discrimination.", "final")
        ],
        # Part 5: Algorithmic Cannibalization
        [
            ("intro", "Total new line extension forecasted volume projection.", "top"),
            ("say1", "True competitive conquest buyers defecting from rivals.", "qual"),
            ("example", "Cannibalized volume diverted from high margin flagship.", "target"),
            ("tryIt", "Final net portfolio contribution confirming margin accretion.", "final")
        ]
    ],
    32: [
        # Part 1: Dual-Process Architecture
        [
            ("intro", "Environmental sensory exposure engaging cognitive attention.", "top"),
            ("say1", "Intuitive heuristics processing visual brand clarity.", "qual"),
            ("example", "Deliberative analytical evaluation verifying product claims.", "target"),
            ("tryIt", "Final cognitive ease conversion without decision friction.", "final")
        ],
        # Part 2: Prospect Theory & Loss Aversion
        [
            ("intro", "Subjective reference point baseline anchoring buyer value.", "top"),
            ("say1", "Transaction utility perception evaluating price discount.", "qual"),
            ("example", "Segregated promotional gains softening acquisition pain.", "target"),
            ("tryIt", "Final transaction completion minimizing perceived loss.", "final")
        ],
        # Part 3: Decoy Effect & Choice Architecture
        [
            ("intro", "Baseline choice set awareness across primary alternatives.", "top"),
            ("say1", "Asymmetric decoy introduction shifting cognitive evaluation.", "qual"),
            ("example", "Comparative justification channeling volume to target bundle.", "target"),
            ("tryIt", "Final premium tier selection expanding average order value.", "final")
        ],
        # Part 4: Neuro-Measurement Tooling
        [
            ("intro", "Visual gaze fixation tracking logo and call to action.", "top"),
            ("say1", "Frontal asymmetry alpha power indicating approach motivation.", "qual"),
            ("example", "Autonomic skin conductance arousal measuring emotional impact.", "target"),
            ("tryIt", "Final neural purchase intent confirming creative greenlight.", "final")
        ],
        # Part 5: Computational Neuromarketing
        [
            ("intro", "Simulated buyer population entering synthetic choice model.", "top"),
            ("say1", "Behavioral utility distributions modeling loss aversion.", "qual"),
            ("example", "Decoy preference shift funneling simulated cohorts.", "target"),
            ("tryIt", "Final predicted conversion velocity validating pricing power.", "final")
        ]
    ],
    33: [
        # Part 1: Value Innovation
        [
            ("intro", "Traditional industry competitive factors driving cost burdens.", "top"),
            ("say1", "Strategic factor elimination slashing operational overhead.", "qual"),
            ("example", "Novel utility creation lifting customer value to new heights.", "target"),
            ("tryIt", "Final blue ocean pioneer capturing uncontested market demand.", "final")
        ],
        # Part 2: Strategy Canvas Divergence
        [
            ("intro", "Crowded red ocean benchmarking across standard industry factors.", "top"),
            ("say1", "Competitive convergence diagnosis revealing commodity trap.", "qual"),
            ("example", "Radical value curve divergence breaking industry dogmas.", "target"),
            ("tryIt", "Final compelling strategic profile commanding market focus.", "final")
        ],
        # Part 3: ERRC Framework
        [
            ("intro", "Industry cost structure baseline before strategic overhaul.", "top"),
            ("say1", "Eliminate and reduce actions driving structural cost down.", "qual"),
            ("example", "Raise and create actions delivering unprecedented value.", "target"),
            ("tryIt", "Final balanced innovation grid securing profit margins.", "final")
        ],
        # Part 4: Non-Customer Tiers
        [
            ("intro", "Total addressable non-customer population across three tiers.", "top"),
            ("say1", "Soon to be leavers rescued by friction elimination.", "qual"),
            ("example", "Refusing non-customers converted through simple utility.", "target"),
            ("tryIt", "Final unexplored market expansion unlocking blue ocean scale.", "final")
        ],
        # Part 5: Algorithmic Value Curve
        [
            ("intro", "Incumbent competitor cluster centroid defining red ocean.", "top"),
            ("say1", "Candidate strategic profiles evaluated across factor vectors.", "qual"),
            ("example", "Euclidean distance maximization under cost feasibility.", "target"),
            ("tryIt", "Final optimal blue ocean curve delivering unassailable moats.", "final")
        ]
    ],
    34: [
        # Part 1: Financial Brand Foundations
        [
            ("intro", "Enterprise intangible asset base before valuation audit.", "top"),
            ("say1", "Legal trademark enforceability establishing ownership rights.", "qual"),
            ("example", "Behavioral customer preference strength validating equity.", "target"),
            ("tryIt", "Final income approach discounted cash flow model selection.", "final")
        ],
        # Part 2: Royalty Relief Methodology
        [
            ("intro", "Projected enterprise revenue streams across forecast years.", "top"),
            ("say1", "Arms length royalty licensing benchmark determination.", "qual"),
            ("example", "Hypothetical post tax royalty savings discounted to present.", "target"),
            ("tryIt", "Final capitalized terminal value establishing fair brand worth.", "final")
        ],
        # Part 3: Economic Use & RBI
        [
            ("intro", "Corporate operating profit post tax before capital charges.", "top"),
            ("say1", "Tangible capital charge deduction isolating intangibles.", "qual"),
            ("example", "Role of brand index application isolating brand earnings.", "target"),
            ("tryIt", "Final brand strength discount rate capitalizing asset value.", "final")
        ],
        # Part 4: Brand Accounting in M&A
        [
            ("intro", "Total business acquisition purchase price allocation review.", "top"),
            ("say1", "Indefinite lived trade name identification on balance sheet.", "qual"),
            ("example", "Annual impairment testing comparing carrying value to use.", "target"),
            ("tryIt", "Final clean audit opinion confirming positive asset headroom.", "final")
        ],
        # Part 5: Brand Financial Command Engine
        [
            ("intro", "Multi method valuation models assembled for triangulation.", "top"),
            ("say1", "Royalty relief and economic use cash flows harmonized.", "qual"),
            ("example", "Tight valuation corridor established across market ranges.", "target"),
            ("tryIt", "Final audit grade brand balance sheet statement presented.", "final")
        ]
    ],
    35: [
        # Part 1: Portfolio Rationalization Capstone
        [
            ("intro", "Initial sprawling enterprise brand portfolio baseline reach.", "top"),
            ("say1", "Cannibalization drain arrested by sunsetting weak flankers.", "qual"),
            ("example", "Focused brand entities retaining core market volume.", "target"),
            ("tryIt", "Final rationalized corporate portfolio expanding margins.", "final")
        ],
        # Part 2: Behavioral Pricing Capstone
        [
            ("intro", "Total digital audience traffic entering conversion funnel.", "top"),
            ("say1", "Asymmetric decoy introduction framing target package.", "qual"),
            ("example", "Segregated gains checkout experience eliminating dropoff.", "target"),
            ("tryIt", "Final premium protocol adoption expanding average order value.", "final")
        ],
        # Part 3: Blue Ocean Capstone
        [
            ("intro", "Red ocean commodity cleaning market with heavy plastic.", "top"),
            ("say1", "Dehydrated compact formulation eliminating freight costs.", "qual"),
            ("example", "Refusing eco conscious households converted by glass vessel.", "target"),
            ("tryIt", "Final direct to consumer subscription model scaling profit.", "final")
        ],
        # Part 4: Brand Valuation Capstone
        [
            ("intro", "Balance sheet carrying value subject to annual audit test.", "top"),
            ("say1", "Discrete post tax royalty cash flows discounted to present.", "qual"),
            ("example", "Perpetual terminal value confirming recoverable amount.", "target"),
            ("tryIt", "Final statutory impairment headroom securing clean opinion.", "final")
        ],
        # Part 5: Boardroom Defense Capstone
        [
            ("intro", "Four pillar enterprise turnaround metrics consolidated.", "top"),
            ("say1", "Recurring annual profit expansion validated by deal team.", "qual"),
            ("example", "Capitalized enterprise equity value expanding multiple.", "target"),
            ("tryIt", "Final unanimous board ratification conferring master pass.", "final")
        ]
    ]
}

def generate_funnel_stages(active_stage_id):
    stages = [
        {"id": "top", "label": "Total Audience Reach", "value": 50000, "percentage": 100, "tone": "data"},
        {"id": "qual", "label": "Qualified Cohort Intent", "value": 25000, "percentage": 50, "dropoffRate": 50, "tone": "ok"},
        {"id": "target", "label": "Target Segment Evaluation", "value": 10000, "percentage": 20, "dropoffRate": 60, "tone": "ok"},
        {"id": "final", "label": "Retained Active Customers", "value": 4000, "percentage": 8, "dropoffRate": 60, "tone": "idle"}
    ]
    return stages

for day_obj in days:
    day_num = day_obj["day"]
    entries = []
    metadata_list = step_metadata[day_num]
    
    for p_idx, part in enumerate(day_obj["parts"]):
        code = part.get("code", "")
        code_hash = hashlib.sha256(code.encode('utf-8')).hexdigest()
        
        steps = []
        part_steps_meta = metadata_list[p_idx]
        
        for at_marker, caption, active_id in part_steps_meta:
            # Enforce caption rules: length <= 75, period at end, zero digits
            assert len(caption) <= 75, f"Caption too long ({len(caption)}): {caption}"
            assert caption.endswith('.'), f"Caption must end with dot: {caption}"
            assert not any(c.isdigit() for c in caption), f"Caption contains digit: {caption}"
            
            steps.append({
                "at": at_marker,
                "caption": caption,
                "activeStageId": active_id,
                "stages": generate_funnel_stages(active_id)
            })
            
        entries.append({
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": {
                "template": "funnel",
                "title": f"{part['title'][:40]} — Conversion Funnel",
                "steps": steps
            }
        })
        
    day_file_content = {
        "schemaVersion": 1,
        "prefix": "bcom-marketing",
        "day": day_num,
        "entries": entries
    }
    
    day_padded = str(day_num).zfill(2)
    file_path = os.path.join(visuals_dir, f"day-{day_padded}.json")
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(day_file_content, f, indent=2)
        
    print(f"Generated visual envelope for Day {day_num} -> {file_path}")

print("All Block 7 (Days 31-35) Gate v2 Visual Envelopes Generated Successfully!")
