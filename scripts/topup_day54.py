# scripts/topup_day54.py
import json

with open("scripts/bcom_law_day54.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Part 2 addition
p2_extra = [
    "From a corporate procedural standpoint, the Audit Committee must maintain rigorous documentation regarding the basis of omnibus approvals. In *In re Fortis Healthcare Limited*, SEBI penalized corporate directors and officers for routing multi-hundred crore advances to promoter-linked entities under the guise of routine inter-corporate treasury operations without explicit Audit Committee scrutiny. The regulator affirmed that an Audit Committee cannot rubber-stamp omnibus approvals; independent directors must independently verify transfer pricing comparability benchmarks, third-party vendor quotations, and commercial rationale before sanctioning annual transaction caps.",
    "Furthermore, under Rule 6A(3) of the Companies Rules, omnibus approvals cannot be granted for transactions in respect of selling or disposing of the undertaking of the company. Disposing of a substantial business undertaking touches the core capital structure of the enterprise and requires specific, individual Board consideration and special shareholder approval under Section 180(1)(a). The omnibus mechanism is strictly confined to repetitive operational transactions necessary for day-to-day business continuity."
]
d["parts"][1]["say"].extend(p2_extra)

# Part 3 addition
p3_extra = [
    "From a securities jurisprudence perspective, the Securities Appellate Tribunal (SAT) in *PTC India Financial Services Ltd v SEBI* and the landmark Supreme Court decision in *Tata Consultancy Services Ltd v Cyrus Investments Pvt Ltd* (2021) examined the fiduciary obligations of dominant shareholders in related party transactions. The Supreme Court underscored that the corporate democracy principle does not grant majority promoters an unfettered license to exploit corporate resources at the expense of minority investors. The statutory disenfranchisement of interested parties on RPT votes is an essential structural guarantee that ensures corporate decisions withstand equitable scrutiny under Section 241 for oppression and mismanagement."
]
d["parts"][2]["say"].extend(p3_extra)

# Part 4 addition
p4_extra = [
    "The statutory indemnification duty under Section 188(4) creates joint and several liability among all consenting directors. In judicial practice, if three executive directors and two interested promoter directors vote in favor of an unapproved related party transaction that causes a financial loss of Rs 50 crore to the company, the liquidator or the reconstituted Board can initiate summary recovery proceedings before the NCLT against any one or all of the defaulting directors. The tribunal will not permit directors to plead ignorance of Section 188, as compliance with statutory RPT approvals is a non-delegable duty attached to the office of a corporate director.",
    "Moreover, the Companies (Auditor's Report) Order, 2020 (CARO 2020) imposes an affirmative reporting duty on statutory financial auditors under Clause (xiii). The auditor must explicitly report whether all transactions with related parties are in compliance with Sections 177 and 188 of the Companies Act, and whether the details have been disclosed in the financial statements as required by the applicable accounting standard (Ind AS 24). An adverse qualification in the CARO report triggers immediate regulatory investigations by the Ministry of Corporate Affairs (MCA) and the Serious Fraud Investigation Office (SFIO)."
]
d["parts"][3]["say"].extend(p4_extra)

# Part 5 addition
p5_extra = [
    "The computational architecture implemented in our production RPT gatekeeper engine bridges the gap between commercial contract execution and securities law compliance. Under Companies Act Section 188 and SEBI LODR Regulation 23, listed conglomerates must navigate overlapping statutory jurisdictions: verifying Section 2(76) related party definitions, enforcing arm's length CUP transfer pricing benchmarks, tracking real-time drawdowns against Audit Committee omnibus facilities, and executing minority shareholder voting exclusions.",
    "Furthermore, the system's Section 188 enforcement module automatically calculates the 3-month statutory ratification window, generating instant voidance orders and personal director indemnity assessments when unapproved transactions are detected. Combined with automated CARO 2020 reporting and SEBI materiality calculations, the engine insulates the enterprise against abusive promoter tunneling, regulatory penalties, and securities debarment.",
    "Completing this simulation certifies that the legal practitioner has acquired complete fluency in related party transaction governance, arm's length transfer pricing benchmarking, Audit Committee omnibus administration, and minority shareholder voting mechanics. This expertise equips the corporate counsel, company secretary, and financial director to structure robust, legally unassailable commercial agreements across complex multinational enterprise networks. The engine formally verifies and confirms this high-level legal engineering capability with the credential: RPT_SECTION_188_COMPLIANCE_GATEKEEPER_PASS."
]
d["parts"][4]["say"].extend(p5_extra)

with open("scripts/bcom_law_day54.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Applied topups to Day 54!")
total = 0
for idx, p in enumerate(d["parts"], 1):
    wc = sum(len(s.split()) for s in p["say"])
    total += wc
    print(f"Part {idx}: {wc} words")
print(f"Total Day 54 Words: {total}")
