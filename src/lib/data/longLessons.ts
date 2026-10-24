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

export interface LongLessonCheck {
  question: string;
  options: string[];
  /** Index into options of the right answer. */
  answer?: number;
  /** Why the right answer is right, in one or two plain sentences. */
  why?: string;
  answerIndex?: number;
  explanation?: string;
}

export interface LongLessonPart {
  part?: string | number;
  title: string;
  /** What the teacher says, one paragraph per entry. Shown on screen and spoken aloud. */
  say: string[] | string;
  /** An everyday, non-computer example of the idea. */
  example?: string;
  /** Runnable code that prints its result: JavaScript (console.log) or, for Python courses, Python (print). */
  code?: string;
  rawCode?: string;
  /** What the code prints, so students can compare. */
  output?: string;
  /** Notes for important code lines (1-based line numbers). */
  codeNotes?: ({ line: number; note: string } | string)[];
  /** A small change for the student to make and run. */
  tryIt?: string;
  /**
   * Code for the student's own project on their laptop (a React file or terminal commands).
   * Shown read-only: the in-lesson runner only runs plain JavaScript, not JSX.
   */
  projectCode?: { label: string; code: string };
  check: LongLessonCheck;
}

export interface LongLesson {
  id?: string;
  course?: string;
  coursePrefix?: string;
  course?: string;
  day: number;
  title: string;
  totalParts?: number;
  duration?: string;
  desc?: string;
  description?: string;
  visualBinding?: any;
  /** One sentence: what the student can do after this lesson. */
  goal?: string;
  /** Rough lesson length in minutes (lesson only, not practice). */
  minutes?: number;
  /** Short reminder of the previous day, spoken at the start. */
  recap?: string;
  overview?: string;
  description?: string;
  desc?: string;
  parts: LongLessonPart[];
  /** Key points to remember, shown at the end. */
  summary?: string[];
  /** Today's step of the month project. */
  projectStep?: { title: string; steps: string[] };
  visualBinding?: {
    schemaVersion?: number;
    type?: string;
    visualHash?: string;
    [key: string]: any;
  };
}

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

/** Language of each course's lesson code. Python runs in the browser with Pyodide, SQL with PGlite (PostgreSQL), TypeScript is compiled with esbuild, Bash runs via in-memory POSIX shell sandbox, C++ runs via AST structural invariant inspector. */
export type LongLessonLanguage = 'javascript' | 'python' | 'sql' | 'typescript' | 'bash' | 'cpp' | 'java';

const LONG_LESSON_LANGUAGE: Record<string, LongLessonLanguage> = {
  'react-basics': 'javascript',
  python: 'python',
  'sql-mastery': 'sql',
  'dsa-py': 'python',
  'ai-py': 'python',
  'dist-py': 'python',
  'cloud-py': 'python',
  'nlp-py': 'python',
  'quant-py': 'python',
  'prompt-py': 'python',
  'cyber-py': 'python',
  'train-py': 'python',
  'vec-py': 'python',
  'safe-py': 'python',
  'node-web': 'typescript',
  devops: 'typescript',
  'sre-web': 'typescript',
  'stream-web': 'typescript',
  'aideploy-web': 'typescript',
  cloud: 'typescript',
  design: 'typescript',
  'dsa-optim': 'typescript',
  dist: 'typescript',
  cyber: 'typescript',
  ai: 'typescript',
  comp_fund: 'bash',
  git_vcs: 'bash',
  iot_emb: 'cpp',
  iot_edge: 'python',
  iot_net: 'python',
  iot_sec: 'python',
  'quant-systems': 'cpp',
  excel_viz: 'python',
  bcom_ana: 'python',
  bcom_ops: 'python',
  bcom_ait: 'python',
  ai_prompt: 'python',
  nlp: 'python',
  blockchain: 'typescript',
  'fullstack-js': 'typescript',
  mobile: 'typescript',
  g3d: 'typescript',
  'java-basics': 'javascript',
  'soft-skills': 'javascript',
  soft_skills: 'javascript',
  'bcom-finance': 'python',
  bcom_fin: 'python',
  'bcom-accounting': 'python',
  bcom_acc: 'python',
  bcom_scrm: 'python',
  bcom_ent: 'python',
  bcom_ecom: 'python',
  bcom_dmkt: 'python',
  'bcom-marketing': 'python',
  bcom_mkt: 'python',
  bcom_ban: 'python',
  bcom_law: 'python',
  bcom_tax: 'python',
  bcom_aud: 'python',
};

export function getLongLessonLanguage(prefix: string): LongLessonLanguage {
  return LONG_LESSON_LANGUAGE[prefix] ?? 'javascript';
}

/** The long lesson for a course prefix and day number, if one has been written. */
export function getLongLesson(prefix: string, dayNum: number): LongLesson | null {
  const days = LONG_LESSON_SOURCES[prefix];
  if (!days) return null;
  return days.find((d) => d.day === dayNum) ?? null;
}

/** Speaking time estimate, at a calm teaching pace of about 120 words a minute. */
export function estimateSpokenMinutes(lesson: LongLesson): number {
  const words = lesson.parts
    .flatMap((p) => [...p.say, p.example ?? '', p.tryIt ?? '', p.check.why])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.round(words / 120);
}

/**
 * Rough time for the hands-on work in a lesson: reading and running each example (half a minute),
 * each "your turn" change (1 minute) and each check question (half a minute).
 */
export function estimateActivityMinutes(lesson: LongLesson): number {
  const minutes = lesson.parts.reduce(
    (total, p) => total + (p.code ? 0.5 : 0) + (p.tryIt ? 1 : 0) + 0.5,
    0
  );
  return Math.round(minutes);
}

/** Rough length of a whole class: teaching (spoken) plus doing (examples, your turn, checks). */
export function estimateLessonMinutes(lesson: LongLesson): number {
  return estimateSpokenMinutes(lesson) + estimateActivityMinutes(lesson);
}
