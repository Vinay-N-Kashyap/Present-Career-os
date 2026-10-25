with open("scripts/branch_b/generate_day60.py", "r", encoding="utf-8") as f:
    text = f.read()

p3_extra = '''    "To safeguard enterprise brand reputation during high-velocity autonomous flights, Tier 3 multi-agent swarms implement automated semantic sentiment "
    "monitoring and emergency dead-man switches. If an external social media crisis or geopolitical event unfolds, the swarm's Sentinel Agent broadcasts a "
    "priority interrupt signal across all running LangGraph workflows, freezing active campaigns within milliseconds and returning control to human directors.",
'''

p4_extra = '''    "In addition to differential privacy clean rooms, Tier 4 enforces automated identity hygiene through cryptographic salt rotation and bloom filter "
    "membership tests. By rotating SHA-256 hashing salts every thirty days and verifying match sets against encrypted bloom filters, the architecture eliminates "
    "rainbow table pre-computation vulnerabilities, ensuring unassailable privacy resilience across all enterprise first-party customer touchpoints.",
'''

p5_extra = '''    "Upon the official completion of this defense, the Chief Marketing Technology Officer assumes sovereign stewardship over the enterprise growth engine. "
    "Armed with an unassailable curriculum spanning eighty rigorous instructional units, the CMTO commands the future of autonomous commerce, steering global "
    "enterprise brand portfolios toward enduring commercial market leadership in the AI-native economy.",
'''

text = text.replace('p3_say = [\n', 'p3_say = [\n' + p3_extra)
text = text.replace('p4_say = [\n', 'p4_say = [\n' + p4_extra)
text = text.replace('p5_say = [\n', 'p5_say = [\n' + p5_extra)

with open("scripts/branch_b/generate_day60.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Topped up parts 3, 4, 5 in generate_day60.py successfully!")
