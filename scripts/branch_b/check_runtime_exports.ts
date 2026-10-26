import { BCOM_ACCOUNTING_LONG_LESSONS } from '../../src/lib/data/bcomAccountingLongLessons';
import { BCOM_TAX_LONG_LESSONS } from '../../src/lib/data/bcomTaxLongLessons';
import { BCOM_FINANCE_LONG_LESSONS } from '../../src/lib/data/bcomFinanceLongLessons';
import { BCOM_OPS_LONG_LESSONS } from '../../src/lib/data/bcomOpsLongLessons';
import { BCOM_SCRM_LONG_LESSONS } from '../../src/lib/data/bcomScrmLongLessons';
import { BCOM_MKT_LONG_LESSONS } from '../../src/lib/data/bcomMktLongLessons';
import { BCOM_ECOM_LONG_LESSONS } from '../../src/lib/data/bcomEcomLongLessons';
import { BCOM_ANA_LONG_LESSONS } from '../../src/lib/data/bcomAnaLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from '../../src/lib/data/bcomDmktLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../../src/lib/data/bcomAudLongLessons';
import { BCOM_BAN_LONG_LESSONS } from '../../src/lib/data/bcomBanLongLessons';

const list = [
  { name: 'bcomAccounting', arr: BCOM_ACCOUNTING_LONG_LESSONS },
  { name: 'bcomTax', arr: BCOM_TAX_LONG_LESSONS },
  { name: 'bcomFinance', arr: BCOM_FINANCE_LONG_LESSONS },
  { name: 'bcomOps', arr: BCOM_OPS_LONG_LESSONS },
  { name: 'bcomScrm', arr: BCOM_SCRM_LONG_LESSONS },
  { name: 'bcomMkt', arr: BCOM_MKT_LONG_LESSONS },
  { name: 'bcomEcom', arr: BCOM_ECOM_LONG_LESSONS },
  { name: 'bcomAna', arr: BCOM_ANA_LONG_LESSONS },
  { name: 'bcomDmkt', arr: BCOM_DMKT_LONG_LESSONS },
  { name: 'bcomAud', arr: BCOM_AUD_LONG_LESSONS },
  { name: 'bcomBan', arr: BCOM_BAN_LONG_LESSONS },
];

for (const item of list) {
  const days = item.arr.map(x => x.day);
  const min = Math.min(...days);
  const max = Math.max(...days);
  console.log(`${item.name.padEnd(20)}: count = ${item.arr.length}, min = ${min}, max = ${max}, days = [${days.slice(0, 3).join(', ')} ... ${days.slice(-3).join(', ')}]`);
}
