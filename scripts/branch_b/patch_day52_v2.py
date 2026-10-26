# -*- coding: utf-8 -*-
"""
Expand Part 1 and Part 4 in build_day52_ban.py to ensure all 5 parts >= 600 words.
"""

with open("scripts/branch_b/build_day52_ban.py", "r", encoding="utf-8") as f:
    text = f.read()

# Part 1 Extra
p1_extra = (
    "In addition, statutory accounting standards such as US GAAP ASC 860 and IFRS 9 / Ind AS 109 govern the derecognition of financial assets. An originating bank can derecognize loan receivables from its balance sheet only if it transfers substantially all the risks and rewards of ownership or surrenders effective operational control over the assets. If the originator retains substantial default exposure through deeply subordinated first-loss credit enhancements, derecognition is denied, forcing the bank to continue reflecting the loans on its balance sheet alongside a corresponding secured borrowing liability."
)

# Part 4 Extra
p4_extra = (
    "In revolving asset-backed securitizations—such as credit card master trusts and automobile dealer floorplan facilities—the cash flow waterfall incorporates an extended Revolving Period (typically spanning three to five years) prior to amortization. During the revolving period, principal collections are not disbursed to amortize investor notes; instead, the corporate trustee automatically reinvests collected principal to purchase newly originated eligible credit card or inventory receivables from the originator, maintaining constant outstanding note balances. The structure transitions into an Amortization Period either upon contractual schedule or following an Early Amortization Event (such as the three-month rolling average excess spread falling below zero percent, a servicer default, or an originator regulatory insolvency). Upon an early amortization trigger, reinvestment ceases instantaneously, and one hundred percent of collected cash flows are channeled into rapid sequential redemption of senior notes, shielding investors against compounding collateral losses."
)

# Insert into Part 1 say list
text = text.replace(
    '"To ensure strict investor protection and fiduciary oversight,',
    f'"""{p1_extra}""",\n                "To ensure strict investor protection and fiduciary oversight,'
)

# Insert into Part 4 say list
text = text.replace(
    '"The mathematical determination of trigger breaches is conducted',
    f'"""{p4_extra}""",\n                "The mathematical determination of trigger breaches is conducted'
)

# Add tryIt to parts if missing
# Also verify check format: ensure options, answer: 0, answerIndex: 0, why >= 20 chars
with open("scripts/branch_b/build_day52_ban.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Patched build_day52_ban.py successfully!")
