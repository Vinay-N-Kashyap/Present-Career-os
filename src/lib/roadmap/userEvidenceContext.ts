import type { SupabaseClient } from '@supabase/supabase-js';
import { analyzeVaultFileBufferWithGroq } from '@/lib/vault/groqDocumentAnalyzer';

export interface VaultDocumentDigest {
  id: string;
  title: string;
  itemType: string;
  organization: string;
  verified: boolean;
  skills: string[];
  projects: Array<{ name: string; techStack: string[]; claim?: string }>;
  summary?: string;
}

export interface UserRoadmapEvidence {
  userId: string;
  displayName: string;
  targetRole: string;
  careerGoal: string;
  education: string;
  department: string;
  semester: string;
  resumeTitle: string | null;
  hasResumeInVault: boolean;
  vaultDocsCount: number;
  verifiedDocsCount: number;
  provenSkills: string[];
  claimedSkills: string[];
  weakAreas: string[];
  interviewGaps: string[];
  projects: Array<{ name: string; techStack: string[]; claim?: string }>;
  certifications: string[];
  completedQuests: string[];
  vaultDocsSummary: VaultDocumentDigest[];
  rawSummary: string;
}

function uniqNormalized(items: Array<string | null | undefined>, limit = 30): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    if (typeof item !== 'string') continue;
    const clean = item.trim();
    if (!clean || clean.length < 2) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
    if (out.length >= limit) break;
  }
  return out;
}

function inferMimeTypeFromPath(storagePath: string): string {
  const lower = storagePath.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.txt')) return 'text/plain';
  return 'application/pdf';
}

export function extractSafeUserStoragePath(description: unknown, userId: string): string | null {
  if (typeof description !== 'string' || !userId) return null;
  const match = description.match(/Storage:\s*([^\s]+)/i);
  if (!match?.[1]) return null;
  const candidate = match[1].trim();
  // Strict per-user path prefix check to block cross-tenant storage traversal
  if (!candidate.startsWith(`vault/${userId}/`) || candidate.includes('..')) {
    return null;
  }
  return candidate;
}

/**
 * Collects authoritative personalization evidence across `users`, `vault_items` (including
 * on-demand parsing of the uploaded Storage resume), and recent completed `interview_sessions`.
 */
export async function collectUserRoadmapEvidence(
  admin: SupabaseClient | null,
  userId: string,
  opts: { parseStorageResume?: boolean } = {}
): Promise<UserRoadmapEvidence> {
  const empty: UserRoadmapEvidence = {
    userId,
    displayName: 'Student',
    targetRole: '',
    careerGoal: '',
    education: '',
    department: '',
    semester: '',
    resumeTitle: null,
    hasResumeInVault: false,
    vaultDocsCount: 0,
    verifiedDocsCount: 0,
    provenSkills: [],
    claimedSkills: [],
    weakAreas: [],
    interviewGaps: [],
    projects: [],
    certifications: [],
    completedQuests: [],
    vaultDocsSummary: [],
    rawSummary: '',
  };

  if (!admin || !userId) return empty;

  const [userRes, vaultRes, ivRes] = await Promise.allSettled([
    admin
      .from('users')
      .select(
        'display_name, full_name, target_role, career_goal, college_name, department, semester, skill_tags, weak_areas, jd_missing_skills, certifications, completed_quests, onboarding_answers, structured_resume'
      )
      .eq('id', userId)
      .maybeSingle(),
    admin
      .from('vault_items')
      .select('id, title, item_type, organization_name, description, verified, ai_confidence_score, skill_tags, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
    admin
      .from('interview_sessions')
      .select('domain, overall_score, evaluation')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const userRow: any = userRes.status === 'fulfilled' ? userRes.value?.data : null;
  const ob: Record<string, any> = (userRow?.onboarding_answers || {}) as Record<string, any>;
  const vaultRows: any[] = vaultRes.status === 'fulfilled' && Array.isArray(vaultRes.value?.data) ? vaultRes.value.data : [];
  const ivRows: any[] = ivRes.status === 'fulfilled' && Array.isArray(ivRes.value?.data) ? ivRes.value.data : [];

  const targetRole = String(userRow?.target_role || ob.role || '').trim();
  const careerGoal = String(userRow?.career_goal || ob.career_goal || ob.goal || '').trim();
  const education = String(ob.education || userRow?.college_name || ob.collegeName || '').trim();
  const department = String(userRow?.department || ob.department || ob.branch || '').trim();
  const semester = String(userRow?.semester || ob.semester || '').trim();
  const completedQuests = Array.isArray(userRow?.completed_quests) ? userRow.completed_quests : [];

  const provenList: string[] = [];
  const claimedList: string[] = [
    ...(Array.isArray(userRow?.skill_tags) ? userRow.skill_tags : []),
    ...(Array.isArray(ob.skills) ? ob.skills : []),
  ];
  const certList: string[] = [...(Array.isArray(userRow?.certifications) ? userRow.certifications : [])];
  const weakList: string[] = [
    ...(Array.isArray(userRow?.weak_areas) ? userRow.weak_areas : []),
    ...(Array.isArray(userRow?.jd_missing_skills) ? userRow.jd_missing_skills : []),
    ...(Array.isArray(ob.weakAreas) ? ob.weakAreas : []),
  ];
  const projectsList: Array<{ name: string; techStack: string[]; claim?: string }> = [];

  if (userRow?.structured_resume && typeof userRow.structured_resume === 'object') {
    const sr = userRow.structured_resume as Record<string, any>;
    if (Array.isArray(sr.skills)) claimedList.push(...sr.skills.map(String));
    if (Array.isArray(sr.projects)) {
      for (const p of sr.projects.slice(0, 5)) {
        if (p?.title || p?.name) {
          projectsList.push({
            name: String(p.title || p.name),
            techStack: Array.isArray(p.techStack) ? p.techStack.map(String) : [],
            claim: typeof p.description === 'string' ? p.description : undefined,
          });
        }
      }
    }
  }

  const interviewGapsList: string[] = [];
  for (const iv of ivRows) {
    const ev = (iv?.evaluation || {}) as Record<string, any>;
    if (Array.isArray(ev.weaknesses)) interviewGapsList.push(...ev.weaknesses.map(String));
    if (Array.isArray(ev.gaps)) interviewGapsList.push(...ev.gaps.map(String));
    if (Array.isArray(ev.improvements)) interviewGapsList.push(...ev.improvements.map(String));
  }

  const vaultDocsSummary: VaultDocumentDigest[] = [];
  let resumeTitle: string | null = null;
  let resumeExcerpt = '';
  let parsedCount = 0;

  for (const doc of vaultRows) {
    const itemType = String(doc?.item_type || 'other').toLowerCase();
    const docSkills = Array.isArray(doc?.skill_tags) ? doc.skill_tags.map(String) : [];
    const verified = Boolean(doc?.verified);

    if (itemType === 'resume' && !resumeTitle) {
      resumeTitle = String(doc.title || 'Uploaded Resume');
    }
    if (itemType === 'certification' && doc.title) {
      certList.push(String(doc.title));
    }

    if (verified) {
      provenList.push(...docSkills);
    } else {
      claimedList.push(...docSkills);
    }

    const digest: VaultDocumentDigest = {
      id: String(doc.id),
      title: String(doc.title || itemType),
      itemType,
      organization: String(doc.organization_name || ''),
      verified,
      skills: docSkills,
      projects: [],
    };

    // Parse primary resume (plus up to 1 project/cert document) straight from Supabase Storage if enabled
    const shouldParseDoc = opts.parseStorageResume !== false && parsedCount < 2 && (itemType === 'resume' || itemType === 'project' || itemType === 'certification');
    const storagePath = shouldParseDoc ? extractSafeUserStoragePath(doc.description, userId) : null;
    if (storagePath && admin.storage) {
      parsedCount += 1;
      try {
        const dlPromise = admin.storage.from('resumes').download(storagePath);
        const dlRes: any = await Promise.race([
          dlPromise,
          new Promise((resolve) => setTimeout(() => resolve({ data: null, error: 'timeout' }), 4500)),
        ]);
        if (dlRes?.data) {
          const buf = Buffer.from(await dlRes.data.arrayBuffer());
          const fileName = storagePath.split('/').pop() || `${itemType}.pdf`;
          const analyzed = await Promise.race([
            analyzeVaultFileBufferWithGroq(buf, fileName, inferMimeTypeFromPath(storagePath), { title: doc.title }),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 6500)),
          ]);
          const parsed = analyzed?.groqAnalysis || null;
          if (parsed) {
            if (Array.isArray(parsed.skills)) {
              digest.skills = uniqNormalized([...digest.skills, ...parsed.skills], 20);
              if (verified) provenList.push(...parsed.skills);
              else claimedList.push(...parsed.skills);
            }
            if (Array.isArray(parsed.projects)) {
              for (const p of parsed.projects.slice(0, 4)) {
                if (!p?.name) continue;
                const projObj = {
                  name: String(p.name),
                  techStack: Array.isArray(p.techStack) ? p.techStack.map(String) : [],
                  claim: typeof p.claim === 'string' ? p.claim : undefined,
                };
                digest.projects.push(projObj);
                projectsList.push(projObj);
              }
            }
            if (Array.isArray(parsed.certifications)) {
              certList.push(...parsed.certifications.map(String));
            }
            if (typeof parsed.summary === 'string' && parsed.summary.trim()) {
              digest.summary = parsed.summary.trim();
            }
            if (itemType === 'resume' && typeof parsed.rawTextExcerpt === 'string') {
              resumeExcerpt = parsed.rawTextExcerpt.slice(0, 2200);
            }
          }
        }
      } catch {}
    }

    vaultDocsSummary.push(digest);
  }

  const provenSkills = uniqNormalized(provenList, 25);
  const claimedSkills = uniqNormalized(claimedList, 25);
  const weakAreas = uniqNormalized(weakList, 15);
  const interviewGaps = uniqNormalized(interviewGapsList, 12);
  const certifications = uniqNormalized(certList, 15);

  const rawParts = [
    targetRole ? `Target Role: ${targetRole}` : '',
    careerGoal ? `Career Goal: ${careerGoal}` : '',
    education || department ? `Academic Background: ${[education, department, semester].filter(Boolean).join(' • ')}` : '',
    resumeTitle ? `Primary Resume: ${resumeTitle}` : '',
    provenSkills.length > 0 ? `Verified Skills: ${provenSkills.join(', ')}` : '',
    claimedSkills.length > 0 ? `Resume/Profile Skills: ${claimedSkills.join(', ')}` : '',
    projectsList.length > 0 ? `Projects Built: ${projectsList.slice(0, 4).map(p => `${p.name} (${p.techStack.join(', ')})`).join('; ')}` : '',
    weakAreas.length > 0 ? `Declared Weak Areas / Missing JD Skills: ${weakAreas.join(', ')}` : '',
    interviewGaps.length > 0 ? `Recent Interview Feedback Gaps: ${interviewGaps.join('; ')}` : '',
    resumeExcerpt ? `Resume Content Excerpt:\n${resumeExcerpt}` : '',
  ].filter(Boolean);

  return {
    userId,
    displayName: String(userRow?.display_name || userRow?.full_name || 'Student').trim(),
    targetRole,
    careerGoal,
    education,
    department,
    semester,
    resumeTitle,
    hasResumeInVault: Boolean(resumeTitle),
    vaultDocsCount: vaultRows.length,
    verifiedDocsCount: vaultRows.filter((v) => Boolean(v.verified)).length,
    provenSkills,
    claimedSkills,
    weakAreas,
    interviewGaps,
    projects: projectsList.slice(0, 8),
    certifications,
    completedQuests,
    vaultDocsSummary,
    rawSummary: rawParts.join('\n'),
  };
}
