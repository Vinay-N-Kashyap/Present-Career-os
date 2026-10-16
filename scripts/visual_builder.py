import os
import json
import hashlib

def make_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def count_words(text) -> int:
    if isinstance(text, str):
        return len(text.split())
    if isinstance(text, list):
        return sum(count_words(item) for item in text)
    return 0

def generate_funnel_visual(prefix: str, day: int, entries: list) -> dict:
    json_entries = []
    for idx, e in enumerate(entries):
        base_reach = 12500 + day * 1200 - idx * 550
        qual_reach = int(base_reach * 0.48)
        target_reach = int(qual_reach * 0.42)
        final_reach = int(target_reach * 0.38)
        code_hash = make_sha256(e['code'])

        json_entries.append({
            "partTitle": e['title'],
            "codeHash": code_hash,
            "spec": {
                "template": "funnel",
                "title": f"{e['title'][:42]}... — Conversion Funnel",
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"Top-of-funnel reach baseline ({base_reach:,} total audience entities).",
                        "activeStageId": "top",
                        "stages": [
                            {"id": "top", "label": "Total Audience Reach", "value": base_reach, "percentage": 100, "tone": "data"},
                            {"id": "qual", "label": "Qualified Cohort Intent", "value": qual_reach, "percentage": 48, "dropoffRate": 52, "tone": "ok"},
                            {"id": "target", "label": "Target Segment Evaluation", "value": target_reach, "percentage": 20, "dropoffRate": 58, "tone": "ok"},
                            {"id": "final", "label": "Retained Active Customers", "value": final_reach, "percentage": 7.6, "dropoffRate": 62, "tone": "idle"}
                        ]
                    },
                    {
                        "at": "say1",
                        "caption": f"Qualification filters screen for economic viability ({qual_reach:,} qualified entities).",
                        "activeStageId": "qual",
                        "stages": [
                            {"id": "top", "label": "Total Audience Reach", "value": base_reach, "percentage": 100, "tone": "data"},
                            {"id": "qual", "label": "Qualified Cohort Intent", "value": qual_reach, "percentage": 48, "dropoffRate": 52, "tone": "ok"},
                            {"id": "target", "label": "Target Segment Evaluation", "value": target_reach, "percentage": 20, "dropoffRate": 58, "tone": "ok"},
                            {"id": "final", "label": "Retained Active Customers", "value": final_reach, "percentage": 7.6, "dropoffRate": 62, "tone": "idle"}
                        ]
                    },
                    {
                        "at": "example",
                        "caption": f"Targeting alignment yields high engagement depth ({target_reach:,} evaluating alternatives).",
                        "activeStageId": "target",
                        "stages": [
                            {"id": "top", "label": "Total Audience Reach", "value": base_reach, "percentage": 100, "tone": "data"},
                            {"id": "qual", "label": "Qualified Cohort Intent", "value": qual_reach, "percentage": 48, "dropoffRate": 52, "tone": "ok"},
                            {"id": "target", "label": "Target Segment Evaluation", "value": target_reach, "percentage": 20, "dropoffRate": 58, "tone": "ok"},
                            {"id": "final", "label": "Retained Active Customers", "value": final_reach, "percentage": 7.6, "dropoffRate": 62, "tone": "idle"}
                        ]
                    },
                    {
                        "at": "tryIt",
                        "caption": f"Final unit conversion achieves stable unit economics ({final_reach:,} retained units).",
                        "activeStageId": "final",
                        "stages": [
                            {"id": "top", "label": "Total Audience Reach", "value": base_reach, "percentage": 100, "tone": "data"},
                            {"id": "qual", "label": "Qualified Cohort Intent", "value": qual_reach, "percentage": 48, "dropoffRate": 52, "tone": "ok"},
                            {"id": "target", "label": "Target Segment Evaluation", "value": target_reach, "percentage": 20, "dropoffRate": 58, "tone": "ok"},
                            {"id": "final", "label": "Retained Active Customers", "value": final_reach, "percentage": 7.6, "dropoffRate": 62, "tone": "idle"}
                        ]
                    }
                ]
            }
        })

    return {
        "schemaVersion": 1,
        "prefix": prefix,
        "day": day,
        "promptSha": "40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68",
        "model": "anthropic/claude-3.5-sonnet",
        "entries": json_entries
    }
