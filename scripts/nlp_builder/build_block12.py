"""
Master Compiler and Invariant Validator for Block 12: The Sovereign Frontier LLM Pre-Training to Alignment Suite (Days 56-60 & Grand Master Capstone)
Course 37: Natural Language Processing & Computational Linguistics
PinIT Career OS - Month 2 Enterprise Expansion
"""

import json
import os
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from scripts.nlp_builder.day56 import DAY_56_DATA
from scripts.nlp_builder.day57 import DAY_57_DATA
from scripts.nlp_builder.day58 import DAY_58_DATA
from scripts.nlp_builder.day59 import DAY_59_DATA
from scripts.nlp_builder.day60 import DAY_60_DATA

BLOCK_12_DAYS = [
    DAY_56_DATA,
    DAY_57_DATA,
    DAY_58_DATA,
    DAY_59_DATA,
    DAY_60_DATA,
]

def validate_and_compile():
    print("=" * 80)
    print("PINIT CAREER OS: NLP COURSE 37 - BLOCK 12 COMPILATION & AUDIT SUITE")
    print("=" * 80)

    total_words_block = 0
    total_parts_block = 0
    total_code_tests = 0
    failed_checks = []
    audit_rows = []

    for day_idx, day_data in enumerate(BLOCK_12_DAYS, start=56):
        day_num = day_data.get("day")
        day_title = day_data.get("title", "")
        parts = day_data.get("parts", [])
        
        if day_num != day_idx:
            failed_checks.append(f"Day {day_idx}: Expected day {day_idx}, got {day_num}")
            
        if len(parts) != 5:
            failed_checks.append(f"Day {day_idx}: Expected exactly 5 parts, found {len(parts)}")
            
        day_words = 0
        part_word_counts = []
        
        for part_idx, part in enumerate(parts, start=1):
            total_parts_block += 1
            
            # 1. Word count verification
            say_text = " ".join(part.get("say", []))
            word_count = len(say_text.split())
            day_words += word_count
            total_words_block += word_count
            part_word_counts.append(word_count)
            
            if word_count < 600:
                failed_checks.append(
                    f"Day {day_idx} Part {part_idx} FAIL: Word count {word_count} < 600"
                )
                
            # 2. Example check
            example = part.get("example", "")
            if len(example.strip()) < 20:
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: Example missing or too short")
                
            # 3. Code execution & output matching
            code = part.get("code", "")
            expected_output = part.get("output", "")
            if not code.strip():
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: Code missing")
            else:
                total_code_tests += 1
                try:
                    res = subprocess.run(
                        [sys.executable, "-c", code],
                        capture_output=True,
                        text=True,
                        timeout=10
                    )
                    if res.returncode != 0:
                        failed_checks.append(
                            f"Day {day_idx} Part {part_idx} EXEC ERROR: {res.stderr.strip()[:120]}"
                        )
                    else:
                        actual_out = res.stdout.rstrip("\r\n")
                        exp_out = expected_output.rstrip("\r\n")
                        if actual_out != exp_out:
                            failed_checks.append(
                                f"Day {day_idx} Part {part_idx} OUTPUT MISMATCH:\nExpected: {exp_out[:80]}\nActual:   {actual_out[:80]}"
                            )
                except Exception as e:
                    failed_checks.append(f"Day {day_idx} Part {part_idx} EXCEPTION: {str(e)}")
                    
            # 4. Check / Diagnostic MCQ validation
            check = part.get("check", {})
            options = check.get("options", [])
            answer = check.get("answer")
            answer_idx = check.get("answerIndex")
            why = check.get("why", "")
            explanation = check.get("explanation", "")
            
            if len(options) != 4:
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: MCQ must have exactly 4 options")
            if answer != 0 or answer_idx != 0:
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: MCQ answer must be index 0")
            if not why or len(why.strip()) < 20:
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: MCQ 'why' missing or short")
            if why != explanation:
                part["check"]["explanation"] = why
                
            # 5. TryIt verification
            try_it = part.get("tryIt", "")
            if not try_it.strip() or len(try_it.strip()) < 15:
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: 'tryIt' missing or short")
                
        # Clean top-level keys
        if "subtitle" in day_data:
            del day_data["subtitle"]
            
        audit_rows.append({
            "day": day_num,
            "title": day_title,
            "parts": len(parts),
            "words": day_words,
            "part_words": part_word_counts
        })

    print(f"\n{'Day':<6} | {'Words':<8} | {'Parts Word Distribution':<36} | {'Title'}")
    print("-" * 80)
    for row in audit_rows:
        dist_str = ", ".join(str(w) for w in row['part_words'])
        print(f"Day {row['day']:<2} | {row['words']:<8} | [{dist_str:<32}] | {row['title'][:30]}...")

    print("-" * 80)
    print(f"Total Block 12 Spoken Words: {total_words_block:,} across {total_parts_block} parts")
    print(f"Average Words per Part:       {total_words_block / total_parts_block:.1f} (Invariant >= 600)")
    print(f"Total Deterministic Code Tests: {total_code_tests} / {total_parts_block}")
    print("=" * 80)

    if failed_checks:
        print("\n🚨 AUDIT FAILURES DETECTED:")
        for fc in failed_checks:
            print(f"  [X] {fc}")
        sys.exit(1)
    else:
        print("\n✅ ALL INVARIANTS PASSED! 100% DETERMINISTIC VERIFICATION ACHIEVED.")
        
        # Output clean JSON
        out_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data_nlp_block12.json"))
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(BLOCK_12_DAYS, f, indent=2, ensure_ascii=False)
        print(f"Wrote compiled Block 12 data to {out_file} ({len(BLOCK_12_DAYS)} days)")

if __name__ == "__main__":
    validate_and_compile()
