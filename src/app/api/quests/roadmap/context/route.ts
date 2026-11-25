import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { collectUserRoadmapEvidence } from '@/lib/roadmap/userEvidenceContext';

export const dynamic = 'force-dynamic';

/**
 * GET /api/quests/roadmap/context
 * Returns a lightweight summary of the authenticated student's uploaded Vault resume,
 * documents, profile role, verified/claimed skills, and skill gaps for Custom Roadmap preview.
 */
export async function GET(req: Request) {
  try {
    const authCheck = await requireUserFromRequest(req);
    if (authCheck.error || !authCheck.user?.id) {
      return authCheck.error || NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const admin = getSupabaseAdmin();
    const evidence = await collectUserRoadmapEvidence(admin, authCheck.user.id, {
      parseStorageResume: false,
    });

    return NextResponse.json({
      ok: true,
      targetRole: evidence.targetRole,
      careerGoal: evidence.careerGoal,
      education: evidence.education,
      department: evidence.department,
      resumeTitle: evidence.resumeTitle,
      hasResumeInVault: evidence.hasResumeInVault,
      vaultDocsCount: evidence.vaultDocsCount,
      verifiedDocsCount: evidence.verifiedDocsCount,
      provenSkills: evidence.provenSkills.slice(0, 12),
      claimedSkills: evidence.claimedSkills.slice(0, 12),
      weakAreas: [...evidence.weakAreas, ...evidence.interviewGaps].slice(0, 8),
      projectsCount: evidence.projects.length,
      certifications: evidence.certifications.slice(0, 6),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Failed to load roadmap context' },
      { status: 500 }
    );
  }
}
