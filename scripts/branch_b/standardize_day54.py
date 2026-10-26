"""
Standardize Day 54 to match the complete Course 07 LongLesson schema.
"""
import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day54_ecom_data.json")

with open(data_file, "r", encoding="utf-8") as f:
    old = json.load(f)

recap = (
    "Expanding an enterprise e-commerce platform globally demands an uncompromising command of international consumer protection, "
    "reverse logistics tax recovery, cross-border data sovereignty, and bidirectional localization engineering. While domestic platforms "
    "can enforce contract-level return restrictions, civil-law jurisdictions such as the European Union subordinate merchant terms to "
    "statutory cooling-off directives. Navigating these mandates without catastrophic margin erosion requires automating Return "
    "Merchandise Authorizations (RMAs), recovering paid customs tariffs via electronic duty drawback (CBP Form 7551), enforcing GDPR "
    "consent gates at the CDN edge, and implementing Unicode Bidirectional (BiDi) isolation for Arabic and Hebrew locales."
)

parts_meta = [
    {
        "example": "A pan-European apparel marketplace automated statutory withdrawal compliance across 27 EU member states. By issuing instant prepaid return labels for claims filed within 14 days of delivery while automatically screening out unsealed cosmetics, the platform reduced customer dispute escalations by 84% while maintaining 100% adherence to the EU Consumer Rights Directive.",
        "tryIt": "Submit an apparel return request 12 days post-delivery in the statutory engine, confirming that the policy grants STATUTORY_14_DAY_COOLING_OFF_MANDATORY_REFUND status.",
        "check": {
            "question": "Under the European Consumer Rights Directive (Directive 2011/83/EU), what is the statutory cooling-off window for online purchases, and what occurs if the merchant fails to disclose it prior to checkout?",
            "options": [
                "Consumers possess an absolute 14-day withdrawal right, and failure to provide pre-contractual withdrawal disclosures extends the cooling-off window by an additional 12 months.",
                "Consumers have 3 days to return goods, and failure to disclose results in a 10-dollar administrative fine.",
                "Merchants can legally eliminate the cooling-off window by inserting an 'all sales final' clause in the website footer.",
                "The cooling-off period only applies if the goods were damaged during international transit."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Article 9 and 10 of Directive 2011/83/EU guarantee an absolute 14-day right of withdrawal; if mandatory information is withheld, the consumer's right of withdrawal is legally extended by an additional 12 months.",
            "explanation": "Article 9 and 10 of Directive 2011/83/EU guarantee an absolute 14-day right of withdrawal; if mandatory information is withheld, the consumer's right of withdrawal is legally extended by an additional 12 months."
        }
    },
    {
        "example": "A direct-to-consumer luxury brand exporting from New Jersey to European buyers integrated automated duty drawback under TFTEA. By pairing returned parcels back to original CBP Form 7501 import entries, the platform reclaimed $845,000 in refundable customs duties and import VAT over twelve months, recovering 99% of outbound tariff expense on returned inventory.",
        "tryIt": "Pass an un-exported return record into the DutyDrawbackManager, verifying that the engine returns zero refundable duty and flags MERCHANDISE_NOT_RE_EXPORTED_DRAWBACK_INELIGIBLE.",
        "check": {
            "question": "Under Title 19 of the United States Code, Section 1313 (Duty Drawback), what percentage of previously paid customs duties can an enterprise recover upon re-exporting returned goods under customs supervision?",
            "options": [
                "Up to 99% of import duties and taxes paid upon original entry, with 1% retained by US Customs and Border Protection for administrative processing.",
                "Exactly 50% of the duties, provided the goods are resold at a discount.",
                "Zero percent, because import duties are non-refundable under all international customs treaties.",
                "One hundred percent of duties plus statutory interest compounded daily from the entry date."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "19 U.S.C. § 1313 authorizes a refund of 99% of paid duties, taxes, and fees upon proof of re-export or destruction under customs supervision, with CBP retaining 1% for administrative costs.",
            "explanation": "19 U.S.C. § 1313 authorizes a refund of 99% of paid duties, taxes, and fees upon proof of re-export or destruction under customs supervision, with CBP retaining 1% for administrative costs."
        }
    },
    {
        "example": "A cross-border beauty retailer deployed a dynamic edge consent gate across its multi-region CDN. For visitors connecting from Germany or France, non-essential cookies and analytics pixels remained deactivated until affirmative opt-in was captured, while EU customer order payloads were encrypted at rest and routed exclusively through EU data centers under validated Standard Contractual Clauses.",
        "tryIt": "Test an EU user payload lacking accepted Standard Contractual Clauses, confirming the validator returns VIOLATION_MISSING_STANDARD_CONTRACTUAL_CLAUSES.",
        "check": {
            "question": "Following the CJEU Schrems II ruling, what must a multinational e-commerce platform establish to lawfully transfer personal data belonging to EU citizens to US-based servers?",
            "options": [
                "Execute valid Standard Contractual Clauses (SCCs) coupled with Transfer Impact Assessments (TIAs) and technical safeguards like strong customer-managed encryption.",
                "Simply display a passive banner in the footer stating that cookies are used on the website.",
                "Obtain verbal authorization from the European Data Protection Board via telephone.",
                "Store user passwords in plaintext on public GitHub repositories."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Schrems II invalidated the Privacy Shield, requiring organizations transferring personal data outside the EEA to implement EU Commission Standard Contractual Clauses with supplementary technical and organizational safeguards.",
            "explanation": "Schrems II invalidated the Privacy Shield, requiring organizations transferring personal data outside the EEA to implement EU Commission Standard Contractual Clauses with supplementary technical and organizational safeguards."
        }
    },
    {
        "example": "A global luxury fashion retailer launched an Arabic storefront serving the GCC region. By wrapping dynamic prices and product titles in Unicode Bidirectional isolate markers and implementing dynamic font subsetting, the team eliminated text inversion bugs and slashed checkout bounce rates in Riyadh and Dubai from 68% down to 18%.",
        "tryIt": "Format a 14,250.75 numeric value for the German locale in the i18n engine, verifying that it correctly outputs '14.250,75 EUR' with periods for thousands and a comma for decimals.",
        "check": {
            "question": "Why is Unicode Bidirectional (BiDi) isolation critical when rendering numeric prices and Western brand names inside a Right-to-Left (RTL) Arabic or Hebrew checkout interface?",
            "options": [
                "Because numbers and Western brand names read left-to-right; without BiDi isolation, the browser layout engine reverses numbers and mangles surrounding sentence syntax.",
                "Because RTL languages cannot legally display Arabic numerals under ISO standards.",
                "Because web browsers crash if they encounter more than one language on the same webpage.",
                "Because BiDi isolation automatically translates product prices into discounted loyalty points."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "The Unicode Bidirectional Algorithm (UAX #9) requires isolation wrappers (like <bdi> or unicode-bidi: isolate) to prevent LTR numbers and latin words from disrupting RTL text layout order.",
            "explanation": "The Unicode Bidirectional Algorithm (UAX #9) requires isolation wrappers (like <bdi> or unicode-bidi: isolate) to prevent LTR numbers and latin words from disrupting RTL text layout order."
        }
    },
    {
        "example": "An omnichannel marketplace operating across 35 countries centralized its cross-border operations into an executive governance command tower. By tracking real-time GDPR consent rates (99.9%), automated duty drawback recovery ($845,000 reclaimed), and localized checkout CSAT (4.88/5.00), the platform achieved a 100/100 composite governance scorecard.",
        "tryIt": "Run the governance tower audit with metric inputs reflecting 99.9% GDPR compliance and $845,000 drawback recovery, confirming that the status outputs APEX_GLOBAL_GOVERNANCE_CERTIFIED.",
        "check": {
            "question": "What primary functions are synthesized within an Enterprise Global Governance Command Tower for cross-border e-commerce?",
            "options": [
                "Real-time monitoring of statutory consumer withdrawal processing, customs duty drawback capital recovery, regional privacy consent compliance, and localized customer satisfaction (CSAT).",
                "Assigning manual data entry tasks to junior retail warehouse stockers.",
                "Generating random marketing discount codes for social media influencers.",
                "Bypassing all customs clearance checks by renaming overseas parcels as diplomatic cargo."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "The Command Tower integrates statutory returns velocity, duty drawback capital recovery, GDPR/CCPA consent adherence, and localized customer experience into actionable executive intelligence.",
            "explanation": "The Command Tower integrates statutory returns velocity, duty drawback capital recovery, GDPR/CCPA consent adherence, and localized customer experience into actionable executive intelligence."
        }
    }
]

new_parts = []
for idx, old_p in enumerate(old["parts"]):
    # Split explanation into paragraphs
    raw_text = old_p.get("explanation", "")
    paragraphs = [p.strip() for p in raw_text.split("\n\n") if p.strip()]
    meta = parts_meta[idx]
    
    new_parts.append({
        "title": old_p["title"],
        "say": paragraphs,
        "example": meta["example"],
        "tryIt": meta["tryIt"],
        "code": old_p["code"],
        "output": old_p["output"],
        "check": meta["check"]
    })

standardized_day = {
    "coursePrefix": "bcom_ecom",
    "day": 54,
    "title": "Cross-Border Consumer Rights, Cross-Border Returns, GDPR/CCPA Privacy & Localization Strategy",
    "goal": "Master cross-border consumer protection frameworks, statutory withdrawal rights, reverse logistics duty drawback recovery, international privacy compliance (GDPR/CCPA/SCC), and bidirectional localization architectures.",
    "minutes": 38,
    "recap": recap,
    "parts": new_parts
}

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(standardized_day, f, indent=2, ensure_ascii=False)

print("Standardized Day 54 written successfully.")
for i, p in enumerate(standardized_day["parts"]):
    w = sum(len(para.split()) for para in p["say"])
    print(f"Part {i+1}: {w} words | check: {p['check']['question'][:50]}...")
