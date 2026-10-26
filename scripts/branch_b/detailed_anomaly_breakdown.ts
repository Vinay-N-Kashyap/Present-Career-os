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

for (const c of courses) {
  console.log(`\n=================== ${c.prefix.toUpperCase()} ===================`);
  const dayBreakdown: Record<string, string[]> = {};

  for (const l of c.lessons) {
    const issues: string[] = [];
    if (!l.goal) issues.push('missing-goal');
    if (!l.recap) issues.push('missing-recap');
    if (l.parts.length !== 5) issues.push(`parts-count-${l.parts.length}`);

    l.parts.forEach((p: any, idx: number) => {
      const words = (Array.isArray(p.say) ? p.say.join(' ') : (p.say || '')).trim().split(/\s+/).filter(Boolean).length;
      if (words < 580) issues.push(`p${idx+1}-under580(${words}w)`);
      if (!p.example) issues.push(`p${idx+1}-no-example`);
      if (!p.tryIt) issues.push(`p${idx+1}-no-tryit`);
      if (!p.code) issues.push(`p${idx+1}-no-code`);
      if (!p.output) issues.push(`p${idx+1}-no-output`);
      if (!p.check) {
        issues.push(`p${idx+1}-no-check`);
      } else {
        if (!p.check.options || p.check.options.length !== 4) issues.push(`p${idx+1}-opts(${p.check.options?.length})`);
        if (p.check.answer !== 0 && p.check.answerIndex !== 0) issues.push(`p${idx+1}-ans(${p.check.answer})`);
      }
    });

    if (issues.length > 0) {
      dayBreakdown[`Day ${l.day}`] = issues;
    }
  }

  const problemDays = Object.keys(dayBreakdown);
  console.log(`Total Days with Any Invariant Issues: ${problemDays.length} / 60`);
  problemDays.forEach(d => {
    console.log(`  ${d}: ${dayBreakdown[d].join(', ')}`);
  });
}
