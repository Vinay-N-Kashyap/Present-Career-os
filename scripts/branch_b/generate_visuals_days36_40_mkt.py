# -*- coding: utf-8 -*-
"""
Generate Gate v2 Visual Envelopes for bcom-marketing Days 36 to 40.
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

from create_day36_mkt import day36_data
from create_day37_mkt import day37_data
from create_day38_mkt import day38_data
from create_day39_mkt import day39_data
from create_day40_mkt import day40_data

days = [day36_data, day37_data, day38_data, day39_data, day40_data]

visuals_dir = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom-marketing')
os.makedirs(visuals_dir, exist_ok=True)

# Captions per part step - strict zero digits and <= 75 chars
step_metadata = {
    36: [
        # Part 1: Shannon-Weaver & Belch IMC
        [
            ("intro", "Total raw media impressions broadcast across channels.", "top"),
            ("say1", "Qualified signal reaching uncorrupted consumer decoding.", "qual"),
            ("example", "Target segment engagement filtering competitive noise.", "target"),
            ("tryIt", "Final retained cognitive resonance driving purchase.", "final")
        ],
        # Part 2: PESO Model
        [
            ("intro", "Total blended multi-channel audience discovery reach.", "top"),
            ("say1", "Earned credibility validation accelerating prospect trust.", "qual"),
            ("example", "Shared social advocacy channeling organic community traffic.", "target"),
            ("tryIt", "Final owned portal conversions maximizing blended return.", "final")
        ],
        # Part 3: Message Framing Economics
        [
            ("intro", "Initial prospect consideration pool evaluating claims.", "top"),
            ("say1", "Loss aversion framing motivating risk mitigation focus.", "qual"),
            ("example", "Autonomy reassurance neutralising psychological resistance.", "target"),
            ("tryIt", "Final non-coercive conversion securing account signups.", "final")
        ],
        # Part 4: Frequency Capping & Wearout
        [
            ("intro", "Total programmatic ad impressions served across networks.", "top"),
            ("say1", "Optimal exposure frequency window driving message recall.", "qual"),
            ("example", "Central identity capping suppressing fatigue and burnout.", "target"),
            ("tryIt", "Final effective reach converting without ad annoyance.", "final")
        ],
        # Part 5: Algorithmic MTA & Budget
        [
            ("intro", "Total customer conversion journeys evaluated by model.", "top"),
            ("say1", "Multi-touch coalition analysis mapping marginal causality.", "qual"),
            ("example", "Shapley value weighting crediting true touchpoint lift.", "target"),
            ("tryIt", "Final optimized channel budget maximizing profit margins.", "final")
        ]
    ],
    37: [
        # Part 1: Vertical Marketing Systems
        [
            ("intro", "Total factory manufacturing volume entering channel pipeline.", "top"),
            ("say1", "Wholesale distribution logistics coordinating network supply.", "qual"),
            ("example", "Retail partner merchandising aligning shelf availability.", "target"),
            ("tryIt", "Final customer retail sell-through capturing full margins.", "final")
        ],
        # Part 2: Multi-Channel Conflict & Showrooming
        [
            ("intro", "Total physical retail foot traffic evaluating live hardware.", "top"),
            ("say1", "In-store product demonstrations building customer trust.", "qual"),
            ("example", "Omnichannel commission credit resolving dealer friction.", "target"),
            ("tryIt", "Final harmonized physical and digital sales conversions.", "final")
        ],
        # Part 3: Gray Market Arbitrage
        [
            ("intro", "Total global production volume allocated to world markets.", "top"),
            ("say1", "Authorized regional distributor fulfillment inventory.", "qual"),
            ("example", "Transshipment detection intercepting unauthorized diversion.", "target"),
            ("tryIt", "Final protected territorial sales preserving price equity.", "final")
        ],
        # Part 4: Legal Defense & MAP Policies
        [
            ("intro", "Total marketplace seller listings crawled across web platforms.", "top"),
            ("say1", "Compliance screening detecting advertised price deficits.", "qual"),
            ("example", "Undercover test purchase securing forensic serial evidence.", "target"),
            ("tryIt", "Final distributor contract termination and rebate forfeiture.", "final")
        ],
        # Part 5: Algorithmic Arbitrage Engine
        [
            ("intro", "Cross-border price spread monitoring identifying arbitrage gaps.", "top"),
            ("say1", "Dynamic landed cost calculation flagging risky trade lanes.", "qual"),
            ("example", "Automated cure notice dispatched to non-compliant storefronts.", "target"),
            ("tryIt", "Final price floor restoration across global marketplaces.", "final")
        ]
    ],
    38: [
        # Part 1: Service-Dominant Logic & IHIP
        [
            ("intro", "Total enterprise service capacity available across cycles.", "top"),
            ("say1", "Dynamic yield pricing shifting peak customer demand.", "qual"),
            ("example", "Collaborative value co-creation during active service usage.", "target"),
            ("tryIt", "Final perishable capacity utilization maximizing revenue.", "final")
        ],
        # Part 2: Extended 7Ps & Servicescape
        [
            ("intro", "Initial sensory encounter with physical servicescape cues.", "top"),
            ("say1", "Empathetic frontline personnel interaction building confidence.", "qual"),
            ("example", "Seamless process workflow eliminating customer wait times.", "target"),
            ("tryIt", "Final tangible service delivery driving customer advocacy.", "final")
        ],
        # Part 3: SERVQUAL Gaps Model
        [
            ("intro", "Total customer prior service expectations baseline.", "top"),
            ("say1", "Explicit management performance standards and service rules.", "qual"),
            ("example", "Operational delivery alignment meeting marketing promises.", "target"),
            ("tryIt", "Final perceived service quality exceeding customer desire.", "final")
        ],
        # Part 4: Service Blueprinting & Poka-Yoke
        [
            ("intro", "Chronological customer actions mapped along service journey.", "top"),
            ("say1", "Onstage frontline interactions visible to client eyes.", "qual"),
            ("example", "Backstage support processes and automated error proofing.", "target"),
            ("tryIt", "Final fail-safe service execution eliminating error points.", "final")
        ],
        # Part 5: Algorithmic Gap Audit Engine
        [
            ("intro", "Multi-channel customer satisfaction signals ingested continuously.", "top"),
            ("say1", "Real-time gap scoring pinpointing operational bottlenecks.", "qual"),
            ("example", "Automated service recovery protocol compensating failures.", "target"),
            ("tryIt", "Final service recovery paradox securing account retention.", "final")
        ]
    ],
    39: [
        # Part 1: Market Entry Modes & Uppsala
        [
            ("intro", "Total foreign market potential evaluated across world nations.", "top"),
            ("say1", "Psychic distance screening matching capital commitment.", "qual"),
            ("example", "Strategic joint venture governance sharing local market risk.", "target"),
            ("tryIt", "Final wholly owned subsidiary capturing total foreign equity.", "final")
        ],
        # Part 2: Glocal Strategy & Levitt
        [
            ("intro", "Global standardized technological product core architecture.", "top"),
            ("say1", "Economies of scale captured through centralized fabrication.", "qual"),
            ("example", "Peripheral marketing mix adaptation matching local culture.", "target"),
            ("tryIt", "Final resonant international market penetration and profit.", "final")
        ],
        # Part 3: Hofstede Cultural Dimensions
        [
            ("intro", "Target national population cultural value profile mapped.", "top"),
            ("say1", "Uncertainty avoidance analysis shaping technical claim proof.", "qual"),
            ("example", "Collectivist consensus storytelling engaging local in-groups.", "target"),
            ("tryIt", "Final culturally harmonious brand adoption across territories.", "final")
        ],
        # Part 4: Price Escalation & Tariffs
        [
            ("intro", "Domestic factory gate cost before international shipment.", "top"),
            ("say1", "Landed cost calculation incorporating freight and tariffs.", "qual"),
            ("example", "Local knocked down assembly mitigating customs duty burdens.", "target"),
            ("tryIt", "Final competitive foreign shelf price driving volume.", "final")
        ],
        # Part 5: Algorithmic Screening Engine
        [
            ("intro", "Global candidate country universe entering screening pipeline.", "top"),
            ("say1", "Macroeconomic and political stability gate filtering risk.", "qual"),
            ("example", "Purchasing power and cultural distance indexing rankings.", "target"),
            ("tryIt", "Final prioritized foreign market roadmap for board approval.", "final")
        ]
    ],
    40: [
        # Part 1: Phase 1 IMC Capstone
        [
            ("intro", "International launch budget deployed across marketing mix.", "top"),
            ("say1", "Earned clinical authority establishing medical credibility.", "qual"),
            ("example", "Shapley value multi-touch attribution reallocating spend.", "target"),
            ("tryIt", "Final blended customer acquisition cost reduction.", "final")
        ],
        # Part 2: Phase 2 Channel Conflict Capstone
        [
            ("intro", "Physical pharmacy retail partner showroom discovery volume.", "top"),
            ("say1", "Omnichannel commission sharing protecting dealer profit.", "qual"),
            ("example", "Forensic serial tracking intercepting unauthorized sellers.", "target"),
            ("tryIt", "Final global price floor defended at suggested retail price.", "final")
        ],
        # Part 3: Phase 3 Service Blueprint Capstone
        [
            ("intro", "Initial biosensor onboarding and patient registration flow.", "top"),
            ("say1", "Hardware impedance fail-safing ensuring correct application.", "qual"),
            ("example", "Automated clinical handoff connecting cardiologist review.", "target"),
            ("tryIt", "Final subscriber churn collapse expanding recurring revenue.", "final")
        ],
        # Part 4: Phase 4 Glocal Adaptation Capstone
        [
            ("intro", "Global clinical device rollout across three target regions.", "top"),
            ("say1", "High uncertainty avoidance framing convincing German buyers.", "qual"),
            ("example", "Local Japanese assembly mitigating tariffs and customs fees.", "target"),
            ("tryIt", "Final high-margin multinational revenue realization.", "final")
        ],
        # Part 5: Phase 5 Boardroom Defense Capstone
        [
            ("intro", "Consolidated enterprise launch revenues and operating metrics.", "top"),
            ("say1", "Working capital efficiency and supply chain inventory turns.", "qual"),
            ("example", "Operating profit expansion lifting company valuation.", "target"),
            ("tryIt", "Final master credential conferred by unanimous board vote.", "final")
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

print("All Block 8 (Days 36-40) Gate v2 Visual Envelopes Generated Successfully!")
