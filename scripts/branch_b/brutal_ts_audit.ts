import { BCOM_ACCOUNTING_LONG_LESSONS } from '../../src/lib/data/bcomAccountingLongLessons';
import { BCOM_FINANCE_LONG_LESSONS } from '../../src/lib/data/bcomFinanceLongLessons';
import { BCOM_MKT_LONG_LESSONS } from '../../src/lib/data/bcomMktLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../../src/lib/data/bcomAudLongLessons';
import { BCOM_BAN_LONG_LESSONS } from '../../src/lib/data/bcomBanLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from '../../src/lib/data/bcomDmktLongLessons';
import { BCOM_ECOM_LONG_LESSONS } from '../../src/lib/data/bcomEcomLongLessons';

interface CourseTarget {
  name: string;
  prefix: string;
  lessons: any[];
}

const targets: CourseTarget[] = [
  { name: 'Course 01: Accounting & Forensic Bookkeeping', prefix: 'bcom_acc', lessons: BCOM_ACCOUNTING_LONG_LESSONS },
  { name: 'Course 02: Corporate Finance & Capital Markets', prefix: 'bcom_fin', lessons: BCOM_FINANCE_LONG_LESSONS },
  { name: 'Course 03: Strategic Marketing & Brand Systems', prefix: 'bcom_mkt', lessons: BCOM_MKT_LONG_LESSONS },
  { name: 'Course 04: Statutory Audit & Corporate Assurance', prefix: 'bcom_aud', lessons: BCOM_AUD_LONG_LESSONS },
  { name: 'Course 05: Banking, Treasury & Credit Operations', prefix: 'bcom_ban', lessons: BCOM_BAN_LONG_LESSONS },
  { name: 'Course 06: Digital Marketing Analytics & Performance', prefix: 'bcom_dmkt', lessons: BCOM_DMKT_LONG_LESSONS },
  { name: 'Course 07: E-Commerce Platform Architecture', prefix: 'bcom_ecom', lessons: BCOM_ECOM_LONG_LESSONS },
];

console.log('='.repeat(90));
console.log('  BRUTAL MONTH 1 (DAYS 1-30) vs MONTH 2 (DAYS 31-60) PEDAGOGICAL INVARIANT AUDIT');
console.log('='.repeat(90));

for (const target of targets) {
  const { name, prefix, lessons } = target;
  let m1Days = 0, m2Days = 0;
  let m1Under580 = 0, m2Under580 = 0;
  let m1MissingFields = 0, m2MissingFields = 0;
  let m1QuizFlaws = 0, m2QuizFlaws = 0;
  let m1Words = 0, m2Words = 0;

  for (const lesson of lessons) {
    const isM1 = lesson.day <= 30;
    if (isM1) m1Days++; else m2Days++;

    if (!Array.isArray(lesson.parts) || lesson.parts.length !== 5) {
      if (isM1) m1MissingFields++; else m2MissingFields++;
      continue;
    }

    lesson.parts.forEach((part: any) => {
      const sayText = Array.isArray(part.say) ? part.say.join(' ') : (part.say || '');
      const words = sayText.trim().split(/\s+/).filter(Boolean).length;
      if (isM1) m1Words += words; else m2Words += words;

      if (words < 580) {
        if (isM1) m1Under580++; else m2Under580++;
      }

      if (!part.code || !part.output || !part.example || !part.tryIt) {
        if (isM1) m1MissingFields++; else m2MissingFields++;
      }

      if (!part.check || !Array.isArray(part.check.options) || part.check.options.length !== 4 || (part.check.answer !== 0 && part.check.answerIndex !== 0)) {
        if (isM1) m1QuizFlaws++; else m2QuizFlaws++;
      }
    });
  }

  console.log(`\n📌 ${name} [${prefix}]:`);
  console.log(`   MONTH 1 (Days 1-30):`);
  console.log(`     - Days Present:        ${m1Days}/30`);
  console.log(`     - Total Words:         ${m1Words.toLocaleString()} words (avg: ${(m1Words/30).toFixed(0)} w/day, ${(m1Words/150).toFixed(0)} w/part)`);
  console.log(`     - Parts Under 580w:    ${m1Under580}/150 parts`);
  console.log(`     - Missing Core Fields: ${m1MissingFields}`);
  console.log(`     - Quiz Invariant Flaws:${m1QuizFlaws}`);
  console.log(`   MONTH 2 (Days 31-60):`);
  console.log(`     - Days Present:        ${m2Days}/30`);
  console.log(`     - Total Words:         ${m2Words.toLocaleString()} words (avg: ${(m2Words/30).toFixed(0)} w/day, ${(m2Words/150).toFixed(0)} w/part)`);
  console.log(`     - Parts Under 580w:    ${m2Under580}/150 parts`);
  console.log(`     - Missing Core Fields: ${m2MissingFields}`);
  console.log(`     - Quiz Invariant Flaws:${m2QuizFlaws}`);
}
