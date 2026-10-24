import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/bcom_law_day59.json", "r", encoding="utf-8") as f:
    data = json.load(f)

extra_p4 = """
The statutory interaction between Section 180(1)(a) of the Companies Act 2013 and Regulation 26 of the Takeover Code warrants rigorous analysis. Under Section 180(1)(a), the Board of Directors cannot sell, lease, or otherwise dispose of the whole or substantially the whole of the undertaking of the company without obtaining prior consent of shareholders by way of a Special Resolution. When an aggressive hostile bidder targets a company to seize a specific operational vertical, target directors often consider spinning off the vertical to a friendly joint venture. However, executing this Crown Jewel maneuver during an open offer period without a postal ballot special resolution is an ultra vires act that renders the transaction void ab initio and exposes directors to disqualification under Section 164 of the Companies Act."""

data["parts"][3]["say"] += extra_p4

total_words = 0
for p in data["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 59 Part {p['part']} words: {wc}")
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 59 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_law_day59.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved updated scripts/bcom_law_day59.json successfully!")
