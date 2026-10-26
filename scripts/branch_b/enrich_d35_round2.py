import json
import os

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'
data_file = os.path.join(commerce_dir, 'scripts', 'branch_b', 'day35_dmkt_data.json')

with open(data_file, 'r', encoding='utf-8') as f:
    d = json.load(f)

# Part 1: Add ~100 words
d['parts'][0]['say'].append(
    "To guard against overfitting on transient promotional blips, the Tier 1 engine incorporates cross-validation across multiple historical rolling folds. By testing model robustness against sudden price hikes, supply-chain delivery bottlenecks, and shifting macroeconomic indices, the econometric regression confirms that estimated channel half-lives and saturation asymptotes remain structurally stable across changing business environments, providing executive leadership with resilient long-term media planning horizons."
)

# Part 2: Add ~100 words
d['parts'][1]['say'].append(
    "Additionally, Tier 2 validates that the treatment DMAs do not suffer from geographic spillover into adjacent control areas. By monitoring radio transmission ranges and digital IP geolocation fidelity across county boundaries, the engineering team confirms that control markets remained completely uncontaminated during the entire sixteen-week intervention period, satisfying the non-interference requirement of the Rubin causal framework."
)

# Part 3: Add ~130 words
d['parts'][2]['say'].append(
    "To provide granular tactical utility to campaign managers, the Tier 3 Markov attribution engine segments customer journeys by product category and customer acquisition tier. This reveals whether high-ticket enterprise subscriptions exhibit different transition graph topologies compared to low-friction self-serve purchases. By calculating separate transition matrices for enterprise versus consumer tiers, the organization discovers that enterprise buyers require three times as many content nurturing touchpoints, tailoring creative distribution accordingly."
)

# Part 4: Add ~130 words
d['parts'][3]['say'].append(
    "In operationalizing the Tier 4 data stack, the pipeline leverages streaming schema registries to validate every inbound event against strict open-source standards. Any payload with missing user identifiers, anomalous timestamp drift, or unapproved custom properties is immediately quarantined to an Amazon SQS dead-letter queue with real-time Slack alerts to data platform engineers. This zero-defect data hygiene ensures that downstream identity graphs and Reverse ETL pipelines operate with pristine integrity."
)

# Part 5: Add ~130 words
d['parts'][4]['say'].append(
    "Beyond optimizing immediate gross revenue, the Tier 5 executive optimization engine integrates long-term Customer Lifetime Value (LTV) multipliers. Rather than allocating capital solely to maximize 30-day transactional sales, the algorithm weighs each channel's marginal return by its historical 3-year net retention rate. This prevents growth teams from pouring money into channels that drive high initial volume but suffer from catastrophic 90-day churn, cementing sustainable, compounding enterprise value."
)

with open(data_file, 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print("Enriched Day 35 Round 2 successfully.")
