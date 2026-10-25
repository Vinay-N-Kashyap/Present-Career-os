import json

d46 = json.load(open(r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\day46_dmkt_data.json", encoding="utf-8"))
print("Day:", d46.get("day"))
print("Title:", d46.get("title"))
print("Goal:", d46.get("goal")[:80], "...")
print("Minutes:", d46.get("minutes"))
total_words = 0
for i, p in enumerate(d46["parts"]):
    words = len(" ".join(p["say"]).split())
    total_words += words
    print(f"Part {i+1}: {p['title']} ({words} words)")
    print("  Example:", len(p.get("example", "")), "chars")
    print("  Code lines:", len(p.get("code", "").splitlines()))
    print("  Output lines:", len(p.get("output", "").splitlines()))
    print("  TryIt:", len(p.get("tryIt", "")), "chars")
    print("  Check options:", len(p["check"]["options"]), "Answer:", p["check"]["answer"], "Why len:", len(p["check"]["why"]))
print("Total words in Day 46:", total_words)
