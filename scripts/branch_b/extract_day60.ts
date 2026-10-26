import fs from 'node:fs';
import path from 'node:path';
import { BCOM_BAN_LONG_LESSONS } from '../../src/lib/data/bcomBanLongLessons';

const day60 = BCOM_BAN_LONG_LESSONS.find(l => l.day === 60);
if (!day60) {
  console.error("Day 60 not found!");
  process.exit(1);
}

fs.writeFileSync(
  path.join(process.cwd(), 'scripts', 'branch_b', 'day60_ban_data.json'),
  JSON.stringify(day60, null, 2),
  'utf-8'
);

console.log("Successfully dumped exact Day 60 from bcomBanLongLessons.ts to scripts/branch_b/day60_ban_data.json!");
