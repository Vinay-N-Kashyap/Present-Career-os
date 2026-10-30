/**
 * Long-format lessons: a full class for one course day, written in plain words.
 *
 * A day is about one hour: a ~30 minute lesson (5–7 parts), then practice and a project step.
 * Each part is taught the same way: the teacher explains in simple words, gives an everyday
 * example, shows code with a note for the important lines, asks the student to try a change,
 * and ends with one check question. The lesson page speaks `say` aloud and shows everything.
 *
 * When a course day has a long lesson, it replaces that day's older short lesson plan.
 */
import { REACT_LONG_LESSONS } from './reactLongLessons';
import { PYTHON_LONG_LESSONS } from './pythonLongLessons';
import { SQL_LONG_LESSONS } from './sqlLongLessons';
import { DSA_PYTHON_LONG_LESSONS } from './dsaPythonLongLessons';
import { AI_PYTHON_LONG_LESSONS } from './aiPythonLongLessons';
import { DIST_PYTHON_LONG_LESSONS } from './distPythonLongLessons';
import { CLOUD_PYTHON_LONG_LESSONS } from './cloudPythonLongLessons';
import { NLP_PYTHON_LONG_LESSONS } from './nlpPythonLongLessons';
import { QUANT_PYTHON_LONG_LESSONS } from './quantPythonLongLessons';
import { PROMPT_PYTHON_LONG_LESSONS } from './promptPythonLongLessons';
import { CYBER_PYTHON_LONG_LESSONS } from './cyberPythonLongLessons';
import { TRAIN_PYTHON_LONG_LESSONS } from './trainPythonLongLessons';
import { VECTOR_PYTHON_LONG_LESSONS } from './vectorPythonLongLessons';
import { SAFETY_PYTHON_LONG_LESSONS } from './safetyPythonLongLessons';
import { NODE_WEB_LONG_LESSONS } from './nodeWebLongLessons';
import { DEVOPS_WEB_LONG_LESSONS } from './devopsWebLongLessons';
import { CLOUD_WEB_LONG_LESSONS } from './cloudWebLongLessons';
import { DESIGN_WEB_LONG_LESSONS } from './designWebLongLessons';
import { DSA_WEB_LONG_LESSONS } from './dsaWebLongLessons';
import { DISTRIBUTED_WEB_LONG_LESSONS } from './distributedWebLongLessons';
import { CYBER_WEB_LONG_LESSONS } from './cyberWebLongLessons';
import { AI_WEB_LONG_LESSONS } from './aiWebLongLessons';
import { SRE_WEB_LONG_LESSONS } from './sreWebLongLessons';
import { STREAM_WEB_LONG_LESSONS } from './streamWebLongLessons';
import { AI_DEPLOY_WEB_LONG_LESSONS } from './aiDeployWebLongLessons';
import { COMP_FUND_LONG_LESSONS } from './compFundLongLessons';
import { GIT_VCS_LONG_LESSONS } from './gitVcsLongLessons';
import { IOT_EMB_LONG_LESSONS } from './iotEmbLongLessons';
import { QUANT_SYSTEMS_LONG_LESSONS } from './quantSystemsLongLessons';
import { EXCEL_VIZ_LONG_LESSONS } from './excelVizLongLessons';
import { BLOCKCHAIN_LONG_LESSONS } from './blockchainLongLessons';
import { MOBILE_LONG_LESSONS } from './mobileLongLessons';
import { JAVA_BASICS_LONG_LESSONS } from './javaBasicsLongLessons';
import { SOFT_SKILLS_LONG_LESSONS } from './softSkillsLongLessons';
import { G3D_LONG_LESSONS } from './g3dLongLessons';
import { FULLSTACK_JS_LONG_LESSONS } from './fullstackJsLongLessons';
import { IOT_EDGE_LONG_LESSONS } from './iotEdgeLongLessons';
import { IOT_SEC_LONG_LESSONS } from './iotSecLongLessons';
import { IOT_NET_LONG_LESSONS } from './iotNetLongLessons';
import { BCOM_ANA_LONG_LESSONS } from './bcomAnaLongLessons';
import { BCOM_OPS_LONG_LESSONS } from './bcomOpsLongLessons';
import { BCOM_AIT_LONG_LESSONS } from './bcomAitLongLessons';
import { BCOM_FINANCE_LONG_LESSONS } from './bcomFinanceLongLessons';
import { BCOM_ACCOUNTING_LONG_LESSONS } from './bcomAccountingLongLessons';
import { BCOM_SCRM_LONG_LESSONS } from './bcomScrmLongLessons';
import { BCOM_ENT_LONG_LESSONS } from './bcomEntLongLessons';
import { BCOM_ECOM_LONG_LESSONS } from './bcomEcomLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from './bcomDmktLongLessons';
import { BCOM_BAN_LONG_LESSONS } from './bcomBanLongLessons';
import { BCOM_LAW_LONG_LESSONS } from './bcomLawLongLessons';
import { BCOM_TAX_LONG_LESSONS } from './bcomTaxLongLessons';
import { BCOM_AUD_LONG_LESSONS } from './bcomAudLongLessons';
import { BCOM_MKT_LONG_LESSONS } from './bcomMktLongLessons';

export {
  type LongLessonCheck,
  type LongLessonPart,
  type LongLesson,
  type LongLessonLanguage,
  LONG_LESSON_LANGUAGE,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateActivityMinutes,
  estimateLessonMinutes,
} from './longLessonTypes';
import type { LongLesson } from './longLessonTypes';

const LONG_LESSON_SOURCES: Record<string, ReadonlyArray<LongLesson>> = {
  'react-basics': REACT_LONG_LESSONS,
  python: PYTHON_LONG_LESSONS,
  'sql-mastery': SQL_LONG_LESSONS,
  'dsa-py': DSA_PYTHON_LONG_LESSONS,
  'ai-py': AI_PYTHON_LONG_LESSONS,
  'dist-py': DIST_PYTHON_LONG_LESSONS,
  'cloud-py': CLOUD_PYTHON_LONG_LESSONS,
  'nlp-py': NLP_PYTHON_LONG_LESSONS,
  'quant-py': QUANT_PYTHON_LONG_LESSONS,
  'prompt-py': PROMPT_PYTHON_LONG_LESSONS,
  'cyber-py': CYBER_PYTHON_LONG_LESSONS,
  'train-py': TRAIN_PYTHON_LONG_LESSONS,
  'vec-py': VECTOR_PYTHON_LONG_LESSONS,
  'safe-py': SAFETY_PYTHON_LONG_LESSONS,
  'node-web': NODE_WEB_LONG_LESSONS,
  devops: DEVOPS_WEB_LONG_LESSONS,
  cloud: CLOUD_WEB_LONG_LESSONS,
  design: DESIGN_WEB_LONG_LESSONS,
  'dsa-optim': DSA_WEB_LONG_LESSONS,
  dist: DISTRIBUTED_WEB_LONG_LESSONS,
  cyber: CYBER_WEB_LONG_LESSONS,
  ai: AI_WEB_LONG_LESSONS,
  'sre-web': SRE_WEB_LONG_LESSONS,
  'stream-web': STREAM_WEB_LONG_LESSONS,
  'aideploy-web': AI_DEPLOY_WEB_LONG_LESSONS,
  comp_fund: COMP_FUND_LONG_LESSONS,
  git_vcs: GIT_VCS_LONG_LESSONS,
  iot_emb: IOT_EMB_LONG_LESSONS,
  'quant-systems': QUANT_SYSTEMS_LONG_LESSONS,
  excel_viz: EXCEL_VIZ_LONG_LESSONS,
  ai_prompt: PROMPT_PYTHON_LONG_LESSONS,
  nlp: NLP_PYTHON_LONG_LESSONS,
  blockchain: BLOCKCHAIN_LONG_LESSONS,
  mobile: MOBILE_LONG_LESSONS,
  'java-basics': JAVA_BASICS_LONG_LESSONS,
  'soft-skills': SOFT_SKILLS_LONG_LESSONS,
  soft_skills: SOFT_SKILLS_LONG_LESSONS,
  g3d: G3D_LONG_LESSONS,
  'fullstack-js': FULLSTACK_JS_LONG_LESSONS,
  iot_edge: IOT_EDGE_LONG_LESSONS,
  iot_sec: IOT_SEC_LONG_LESSONS,
  iot_net: IOT_NET_LONG_LESSONS,
  bcom_ana: BCOM_ANA_LONG_LESSONS,
  bcom_ops: BCOM_OPS_LONG_LESSONS,
  bcom_ait: BCOM_AIT_LONG_LESSONS,
  'bcom-finance': BCOM_FINANCE_LONG_LESSONS,
  bcom_fin: BCOM_FINANCE_LONG_LESSONS,
  'bcom-accounting': BCOM_ACCOUNTING_LONG_LESSONS,
  bcom_acc: BCOM_ACCOUNTING_LONG_LESSONS,
  bcom_scrm: BCOM_SCRM_LONG_LESSONS,
  bcom_ent: BCOM_ENT_LONG_LESSONS,
  bcom_ecom: BCOM_ECOM_LONG_LESSONS,
  bcom_dmkt: BCOM_DMKT_LONG_LESSONS,
  'bcom-marketing': BCOM_MKT_LONG_LESSONS,
  bcom_mkt: BCOM_MKT_LONG_LESSONS,
  bcom_ban: BCOM_BAN_LONG_LESSONS,
  bcom_law: BCOM_LAW_LONG_LESSONS,
  bcom_tax: BCOM_TAX_LONG_LESSONS,
  bcom_aud: BCOM_AUD_LONG_LESSONS,
};


export function getLongLesson(prefix: string, dayNum: number): LongLesson | null {
  const days = LONG_LESSON_SOURCES[prefix];
  if (!days) return null;
  return days.find((d) => d.day === dayNum) ?? null;
}
