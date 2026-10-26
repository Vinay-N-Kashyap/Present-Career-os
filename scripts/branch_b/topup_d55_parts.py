with open('scripts/branch_b/generate_ecom_day55.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'p2_say = [' in line:
        new_lines.append(line)
        new_lines.append('    "Additionally, the landed cost engine maintains cryptographically signed digital certificates for preferential rules of origin under multilateral trade pacts (such as USMCA, EU-UK TCA, and CPTPP). When raw materials and assembly locations satisfy origin criteria, the engine automatically claims preferential duty exemptions at destination customs clearance, lowering landed costs and boosting international product competitiveness.",\n')
    elif 'p3_say = [' in line:
        new_lines.append(line)
        new_lines.append('    "Furthermore, the customs logistics router continuously monitors international carrier performance and line-haul flight capacity across trans-Pacific and trans-Atlantic freight corridors. During seasonal peak shipping surges, the engine dynamically balances cargo allocations between scheduled passenger belly freight and dedicated charter freighter flights, preventing transit bottlenecks and ensuring on-time delivery commitments.",\n')
    elif 'p4_say = [' in line:
        new_lines.append(line)
        new_lines.append('    "Crucially, the duty drawback engine maintains automated digital interfaces with national revenue agencies, generating verifiable electronic audit packages that include signed customer cancellation declarations, customs export declarations, and carrier proof of delivery. This immutable compliance trail eliminates drawback filing delays and ensures immediate capital recovery across global operating subsidiaries.",\n')
    elif 'p5_say = [' in line:
        new_lines.append(line)
        new_lines.append('    "Ultimately, the Global Commerce Command Tower establishes a permanent competitive moat for the enterprise. By turning regulatory complexity and international customs friction into an automated, high-velocity operational advantage, the architecture enables rapid, profitable scaling into new sovereign markets with absolute governance integrity and predictable margin yield.",\n')
    else:
        new_lines.append(line)

with open('scripts/branch_b/generate_ecom_day55.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Injected topups into parts 2, 3, 4, 5 of Day 55!")
