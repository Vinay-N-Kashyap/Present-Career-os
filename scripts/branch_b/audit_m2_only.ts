import { BCOM_ACCOUNTING_LONG_LESSONS } from '../../src/lib/data/bcomAccountingLongLessons';
import { BCOM_FINANCE_LONG_LESSONS } from '../../src/lib/data/bcomFinanceLongLessons';
import { BCOM_MKT_LONG_LESSONS } from '../../src/lib/data/bcomMktLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../../src/lib/data/bcomAudLongLessons';
import { BCOM_BAN_LONG_LESSONS } from '../../src/lib/data/bcomBanLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from '../../src/lib/data/bcomDmktLongLessons';
import { BCOM_ECOM_LONG_LESSONS } from '../../src/lib/data/bcomEcomLongLessons';

const courses = [
  { prefix: 'bcom_acc', lessons: BCOM_ACCOUNTING_LONG_LESSONS },
  { prefix: 'bcom_fin', lessons: BCOM_FINANCE_LONG_LESSONS },
  { prefix: 'bcom_mkt', lessons: BCOM_MKT_LONG_LESSONS },
  { prefix: 'bcom_aud', lessons: BCOM_AUD_LONG_LESSONS },
  { prefix: 'bcom_ban', lessons: BCOM_BAN_LONG_LESSONS },
  { prefix: 'bcom_dmkt', lessons: BCOM_DMKT_LONG_LESSONS },
  { prefix: 'bcom_ecom', lessons: BCOM_ECOM_LONG_LESSONS },
];

console.log('='.repeat(90));
console.log('     MONTH 2 ONLY (DAYS 31 TO 60) AUDIT ACROSS ALL 7 BRANCH B COURSES');
console.log('='.repeat(90));

for (const c of courses) {
  const m2Lessons = c.lessons.filter((l: any) => l.day >= 31 && l.day <= 60);
  const issues: string[] = [];

  m2Lessons.forEach((l: any) => {
    if (!l.goal) issues.push(`Day ${l.day} missing goal`);
    if (!l.recap) issues.push(`Day ${l.day} missing recap`);
    if (l.parts.length !== 5) issues.push(`Day ${l.day} parts count ${l.parts.length}`);

    l.parts.forEach((p: any, idx: number) => {
      const words = (Array.isArray(p.say) ? p.say.join(' ') : (p.say || '')).trim().split(/\s+/).filter(Boolean).length;
      if (words < 580) issues.push(`Day ${l.day} P${idx+1} under 580w (${words}w)`);
      if (!p.example) issues.push(`Day ${l.day} P${idx+1} missing example`);
      if (!p.tryIt) issues.push(`Day ${l.day} P${idx+1} missing tryIt`);
      if (!p.code) issues.push(`Day ${l.day} P${idx+1} missing code`);
      if (!p.output) issues.push(`Day ${l.day} P${idx+1} missing output`);
      if (!p.check) {
        issues.push(`Day ${l.day} P${idx+1} missing check`);
      } else {
        if (!p.check.options || p.check.options.length !== 4) issues.push(`Day ${l.day} P${idx+1} options ${p.check.options?.length}`);
        if (p.check.answer !== 0 && p.check.answerIndex !== 0) issues.push(`Day ${l.day} P${idx+1} answer ${p.check.answer}`);
      }
    });
  });

  console.log(`\n${c.prefix.toUpperCase()}: ${m2Lessons.length}/30 Month 2 Days`);
  if (issues.length === 0) {
    console.log(`  ✨ FLAWLESS! 0 issues across all 30 days (150 parts)!`);
  } else {
    console.log(`  ⚠️ Issues found (${issues.length}):`);
    issues.slice(0, 20).forEach(i => console.log(`     -> ${i}`));
    if (issues.length > 20) console.log(`     ... and ${issues.length - 20} more.`);
  }
}
