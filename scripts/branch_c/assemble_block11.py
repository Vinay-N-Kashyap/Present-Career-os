import json
import os
import sys

def main():
    root = r"C:\Users\Admin\Desktop\projects\Present-Career-os-platform"
    lessons_ts_path = os.path.join(root, "src", "lib", "data", "aiWebLongLessons.ts")
    
    with open(lessons_ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the last '];'
    content = content.rstrip()
    if not content.endswith("];"):
        print(f"Error: {lessons_ts_path} does not end with '];' (ends with {content[-20:]!r})")
        sys.exit(1)
        
    trimmed_content = content[:-2].rstrip() # remove ];
    
    days_to_add = [51, 52, 53, 54, 55]
    lesson_jsons = []
    
    for day in days_to_add:
        lesson_file = os.path.join(root, "scripts", "branch_c", f"ai_day{day}_lesson.json")
        if not os.path.exists(lesson_file):
            print(f"Error: {lesson_file} does not exist!")
            sys.exit(1)
        with open(lesson_file, "r", encoding="utf-8") as lf:
            data = json.load(lf)
            assert data["day"] == day, f"Expected day {day}, got {data['day']}"
            lesson_jsons.append(json.dumps(data, indent=2))
            
    print(f"Appending {len(lesson_jsons)} lessons (Days {days_to_add[0]} - {days_to_add[-1]})...")
    
    appended_str = ",\n" + ",\n".join(lesson_jsons) + "\n];\n"
    new_full_content = trimmed_content + appended_str
    
    with open(lessons_ts_path, "w", encoding="utf-8") as f:
        f.write(new_full_content)
        
    print(f"Successfully assembled Block 11 (Days 51-55) into {lessons_ts_path}!")

if __name__ == "__main__":
    main()
