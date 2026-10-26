for d in [46, 47, 48, 49, 50]:
    vis_file = f'scripts/branch_b/generate_ecom_visuals_day{d}.py'
    with open(vis_file, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f'=== Day {d} Visual Generator ===')
    for line in content.splitlines()[:25]:
        if 'intro' in line or 'Part 1' in line or 'day_data' in line or 'Day' in line:
            print(' ', line)
