import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
d36_path = os.path.join(commerce_dir, "scripts", "branch_b", "day36_dmkt_data.json")

with open(d36_path, "r", encoding="utf-8") as f:
    d36 = json.load(f)

# Part 2 extra: currently 544 words. Add ~100 words.
part2_extra = [
    "To handle enterprise throughput at scale, production CAPI architectures implement asynchronous batching protocols. Rather than dispatching an individual HTTP POST request for every single micro-event, backend event pipelines aggregate transactions into batch payloads containing up to one thousand events per API call. This dramatic compression reduces outbound network socket overhead, stays comfortably beneath Meta rate limiting quotas (typically capped per ad account based on historical media spend), and ensures high resilience during extreme flash sale traffic surges.",
    "Furthermore, enterprise CAPI integrations implement real-time error telemetry and monitoring alerts. If Meta Graph API endpoints respond with HTTP 400 client errors (indicating malformed parameters or un-normalized hashes) or HTTP 500 server errors, automated dead-letter queues (DLQs) in Google Cloud Pub/Sub or AWS SQS capture the failed packets. Automated worker routines inspect error codes, apply corrective schema transformations, and re-dispatch events within Meta's allowable 7-day retrospective attribution window, guaranteeing zero revenue signal loss."
]

# Part 3 extra: currently 570 words. Add ~80 words.
part3_extra = [
    "In omnichannel retail environments where purchases can originate across web, native mobile apps, physical point-of-sale (POS) registers, and call centers, deduplication protocols must handle cross-system transaction reconciliation. When a customer browses a product on a mobile web browser and subsequently completes the purchase inside a physical brick-and-mortar store hours later, the POS cash register records the order ID alongside the customer's loyalty card number. By routing POS transactions into the server-side CAPI pipeline with the synchronized customer order ID, the ad platform links the offline in-store conversion back to the original digital ad click, unlocking true closed-loop omnichannel ROAS."
]

# Part 4 extra: currently 526 words. Add ~110 words.
part4_extra = [
    "Beyond individual customer fields, modern Event Quality Score algorithms evaluate the presence of the Action Source and Event Time fidelity. Transmitting events with accurate, un-manipulated UNIX timestamps within milliseconds of occurrence prevents temporal drift penalties. Additionally, enterprise pipelines capture secondary device signals—such as client IP address and user-agent string—to enable Meta's graph engine to resolve complex multi-device household graphs where multiple individuals share identical Wi-Fi networks.",
    "Data engineering teams track Event Quality Scores continuously through automated daily health dashboards. If an e-commerce platform's Event Quality Score drops below 8.0, automated PagerDuty alerts notify the engineering on-call rotation. Root-cause diagnostics immediately identify whether an upstream checkout update broke phone number formatting, whether a new consent banner blocked cookie access, or whether a browser release altered user-agent syntax, ensuring that algorithmic advertising efficiency is perpetually safeguarded."
]

# Part 5 extra: currently 428 words. Add ~210 words.
part5_extra = [
    "The operational governance of an enterprise marketing gateway extends into continuous infrastructure cost optimization and auto-scaling management. When deploying Server-Side Google Tag Manager on Google Cloud Run, container memory allocation (typically 512MB per instance) and CPU concurrency limits (typically 80 requests per container) are calibrated to maintain p99 latency below twenty milliseconds while preventing runaway cloud infrastructure bills. During baseline traffic hours, Cloud Run scales down to minimum warm instances, maintaining readiness without incurring idle compute expenses.",
    "Crucially, the server-side gateway serves as the definitive audit boundary for corporate compliance officers and data protection authorities. Because all outbound marketing signals funnel through this centralized choke point, legal teams can inspect, verify, and document every byte of data transmitted to external advertising vendors. If a consumer exercises their right to opt out of targeted advertising under CCPA or GDPR, the gateway's consent management layer immediately flips the event's data_processing_options flag, automatically instructing Meta to restrict data processing and respect the consumer's statutory privacy choices.",
    "Ultimately, architecting an enterprise server-side tagging gateway elevates performance marketing from a fragile, ad-hoc front-end script collection into a mission-critical, enterprise-grade data engineering discipline. By uniting first-party proxy routing, cryptographic PII normalization, deterministic deduplication, and direct server-to-server API connections, the modern marketing organization establishes an unassailable data foundation that maximizes media efficiency, preserves consumer privacy, and guarantees long-term competitive superiority."
]

d36["parts"][1]["say"].extend(part2_extra)
d36["parts"][2]["say"].extend(part3_extra)
d36["parts"][3]["say"].extend(part4_extra)
d36["parts"][4]["say"].extend(part5_extra)

# Re-audit word counts
total_words = 0
for idx, p in enumerate(d36["parts"]):
    words = len(" ".join(p["say"]).split())
    total_words += words
    print(f"Part {idx+1} ({p['title']}): {words} words")
    assert words >= 600, f"Part {idx+1} is under 600 words: {words}"

print(f"Total Day 36 Words: {total_words}")
assert total_words >= 3000, f"Total Day 36 words under 3000: {total_words}"

with open(d36_path, "w", encoding="utf-8") as f:
    json.dump(d36, f, indent=2)

print("Enriched Day 36 saved successfully!")
