import { BCOM_BAN_LONG_LESSONS } from '../../src/lib/data/bcomBanLongLessons';

for (let d = 56; d <= 60; d++) {
  const lesson = BCOM_BAN_LONG_LESSONS.find(l => l.day === d);
  console.log(`Day ${d}: ${lesson?.title}`);
  lesson?.parts.forEach((p, idx) => {
    const wc = p.say.join(' ').trim().split(/\s+/).length;
    console.log(`  Part ${idx + 1}: ${p.title} (${wc} words)`);
  });
}
