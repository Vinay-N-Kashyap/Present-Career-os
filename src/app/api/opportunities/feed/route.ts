import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { opportunityToClient } from '@/lib/internships/toClient';

export async function GET(req: NextRequest) {
  try {
    const admin = getSupabaseAdmin();
    const { data: opportunities, error } = await admin
      .from('internship_opportunities')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !opportunities || opportunities.length === 0) {
      // Fallback curated feed for immediate onboarding/dashboard preview
      const fallbackFeed = [
        {
          id: 'opp_swe_sim_1',
          title: 'Full Stack Engineering Simulation',
          company: 'PinIT Global Labs',
          role: 'Junior Software Engineer',
          tier: 't1_job_sim',
          location: 'Remote',
          stipend: 'Performance Grant ($500/mo)',
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          type: 'virtual_sim',
          deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
          description: 'Hands-on production simulation solving backend latency bottlenecks and frontend telemetry.',
        },
        {
          id: 'opp_cloud_infra_2',
          title: 'Cloud Systems Architecture Apprentice',
          company: 'Apex Cloud Systems',
          role: 'Cloud DevOps Associate',
          tier: 't2_virtual_team',
          location: 'Hybrid / Remote',
          stipend: '$750/mo Stipend',
          skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
          type: 'apprenticeship',
          deadline: new Date(Date.now() + 21 * 86400000).toISOString(),
          description: 'Collaborate with senior SREs to deploy containerized microservices and automated health monitors.',
        },
        {
          id: 'opp_ai_eng_3',
          title: 'GenAI & Agentic Systems Fellow',
          company: 'Cognitive Nexus',
          role: 'AI Applications Engineer',
          tier: 't3_project',
          location: 'Remote',
          stipend: '$1,000/mo Stipend',
          skills: ['Python', 'LangChain', 'Gemini API', 'Vector DBs'],
          type: 'fellowship',
          deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
          description: 'Develop multi-agent workflows and retrieval-augmented generation pipelines for enterprise workflows.',
        },
      ];

      return NextResponse.json({
        ok: true,
        opportunities: fallbackFeed,
      });
    }

    return NextResponse.json({
      ok: true,
      opportunities: opportunities.map(opportunityToClient),
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: true,
      opportunities: [],
      error: err?.message || 'Failed to load opportunities feed',
    });
  }
}
