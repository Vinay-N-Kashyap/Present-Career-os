"""
Master Compiler and Invariant Validator for Block 9: Post-Training Alignment (SFT, LoRA, RLHF, DPO & ApexAlign Capstone)
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

from scripts.nlp_builder.day41 import DAY_41_DATA
from scripts.nlp_builder.day42 import DAY_42_DATA
from scripts.nlp_builder.day43 import DAY_43_DATA
from scripts.nlp_builder.day44 import DAY_44_DATA
from scripts.nlp_builder.day45 import DAY_45_DATA

BLOCK_9_DAYS = [
    DAY_41_DATA,
    DAY_42_DATA,
    DAY_43_DATA,
    DAY_44_DATA,
    DAY_45_DATA,
]

def validate_and_compile():
    print("=" * 80)
    print("PINIT CAREER OS: NLP COURSE 37 - BLOCK 9 COMPILATION & AUDIT SUITE")
    print("=" * 80)

    total_words_block = 0
    total_parts_block = 0
    total_code_tests = 0
    failed_checks = []
    audit_rows = []

    for day_idx, day_data in enumerate(BLOCK_9_DAYS, start=41):
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
            expected_output = part.get("output", "").strip()
            total_code_tests += 1
            
            res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
            actual_output = res.stdout.strip()
            
            if res.returncode != 0:
                failed_checks.append(
                    f"Day {day_idx} Part {part_idx} FAIL: Code exited with code {res.returncode}. Error: {res.stderr[:200]}"
                )
            elif actual_output != expected_output:
                failed_checks.append(
                    f"Day {day_idx} Part {part_idx} FAIL: Output mismatch!\nExpected: {expected_output[:100]}...\nActual: {actual_output[:100]}..."
                )
                
            # 4. CodeNotes check
            code_notes = part.get("codeNotes", [])
            if not isinstance(code_notes, list) or len(code_notes) < 2:
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: codeNotes < 2 entries")
                
            # 5. TryIt check
            try_it = part.get("tryIt", "")
            if len(try_it.strip()) < 15:
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: tryIt < 15 chars")
                
            # 6. Check diagnostic question
            check = part.get("check", {})
            options = check.get("options", [])
            if len(options) != 4:
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: Check options != 4")
            if check.get("answer") != 0 or check.get("answerIndex") != 0:
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: check answer must be 0")
            if not check.get("why") or check.get("why") != check.get("explanation"):
                failed_checks.append(f"Day {day_idx} Part {part_idx} FAIL: why != explanation")

        audit_rows.append((day_idx, day_title, day_words, part_word_counts))
        print(f"Day {day_idx}: {day_words} words (Parts: {part_word_counts}) | {day_title[:50]}...")

    print("-" * 80)
    print(f"Total Block 9 Words: {total_words_block} across {total_parts_block} parts.")
    print(f"Total Code Samples Executed & Verified: {total_code_tests}/{total_parts_block}")
    print(f"Average Words per Part: {total_words_block / total_parts_block:.1f}")

    if failed_checks:
        print("\n❌ INVARIANT FAILURES DETECTED:")
        for err in failed_checks:
            print(f"  - {err}")
        sys.exit(1)

    print("\n✅ ALL INVARIANTS SATISFIED! ZERO FAILURES.")

    # Write compiled json
    out_file = os.path.join(os.path.dirname(__file__), "..", "data_nlp_block9.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(BLOCK_9_DAYS, f, indent=2, ensure_ascii=False)

    print(f"Successfully compiled {len(BLOCK_9_DAYS)} days into {out_file}")

if __name__ == "__main__":
    validate_and_compile()
