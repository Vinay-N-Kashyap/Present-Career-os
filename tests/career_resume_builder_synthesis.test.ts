import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStructuredResume, mapTrackToRoleCategory } from '../src/lib/ats/resumeGenerator';
import { auditResumeATS } from '../src/lib/ats/atsScreener';
import { matchJobDescription } from '../src/lib/opportunities/jdMatch';
import { generateResumeHtml } from '../src/lib/printResume';
import { TRACKS } from '../src/lib/onboarding/trackResolver';
import { VaultItem } from '../src/hooks/useVault';

test('Block 160 (TASK-480): mapTrackToRoleCategory correctly maps tracks to ATS role categories', () => {
  assert.strictEqual(mapTrackToRoleCategory(TRACKS.frontend), 'frontend');
  assert.strictEqual(mapTrackToRoleCategory(TRACKS.devops), 'devops');
  assert.strictEqual(mapTrackToRoleCategory(TRACKS.analytics), 'data_analyst');
  assert.strictEqual(mapTrackToRoleCategory(TRACKS.marketing), 'sales_marketing');
  assert.strictEqual(mapTrackToRoleCategory(TRACKS.product), 'pm');
  assert.strictEqual(mapTrackToRoleCategory(TRACKS.accounting), 'business_analyst');
  assert.strictEqual(mapTrackToRoleCategory(TRACKS.fullstack), 'sde');
});

test('Block 160 (TASK-480): generateStructuredResume synthesizes ATS-compliant resume scoring >= 85 on atsScreener', () => {
  const mockVaultItems: VaultItem[] = [
    {
      id: 'vault-1',
      title: 'Full-Stack Microservices Architecture',
      item_type: 'project',
      description: 'Architected high-throughput payment processing engine with 99.9% uptime handling 25000 requests reduced by 45% latency.',
      verified: true,
      ai_confidence_score: 95,
      skill_tags: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'],
      is_public: true,
      proof_url: 'https://github.com/candidate/fullstack-microservices',
    },
    {
      id: 'vault-2',
      title: 'PinIT Certified Full-Stack Software Developer',
      item_type: 'certificate',
      organization_name: 'PinIT Industry Verification Council',
      verified: true,
      ai_confidence_score: 98,
      skill_tags: ['Full-Stack', 'System Design'],
      is_public: true,
    },
    {
      id: 'vault-3',
      title: 'Backend Engineering Intern',
      item_type: 'internship',
      organization_name: 'NextGen Cloud Systems',
      description: 'Engineered event-driven message queuing pipeline scaled by 45% throughput and reduced by 35% latency across 15000 requests.',
      verified: true,
      ai_confidence_score: 92,
      skill_tags: ['Node.js', 'Redis', 'Kafka'],
      is_public: true,
    },
  ];

  const candidateProfile = {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@domain.com',
    phone: '+91 98765 43210',
    address: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/aarav-sharma-sde',
    github: 'github.com/aaravsharma',
    portfolio: 'https://aaravsharma.dev',
    degree: 'B.Tech in Computer Science',
    institution: 'National Institute of Technology',
    graduationYear: '2020 - 2024',
    gpa: '8.9 / 10.0 CGPA',
  };

  const synthesized = generateStructuredResume(candidateProfile, mockVaultItems, TRACKS.fullstack);

  // 1. Verify structured data conforms to ResumeFormData
  assert.ok(synthesized.formData.fullName === 'Aarav Sharma');
  assert.ok(synthesized.formData.experiences.length >= 2);
  assert.ok(synthesized.formData.projects.length >= 1);
  assert.ok(synthesized.formData.education.length >= 1);
  assert.ok(synthesized.formData.certificates.length >= 1);

  // 2. Screen with atsScreener
  const atsReport = auditResumeATS(synthesized.plainText, {
    targetRole: synthesized.targetRoleCategory,
  });

  assert.ok(
    atsReport.compositeScore >= 85,
    `Composite ATS score must be >= 85, got ${atsReport.compositeScore}`
  );
  assert.strictEqual(atsReport.extractedProfile.layoutRisk, 'Low', 'ATS layout risk must be Low');
  assert.ok(atsReport.extractedProfile.quantifiedBulletsCount >= 3, 'Must have at least 3 quantified metrics');
  assert.ok(atsReport.extractedProfile.powerVerbsCount >= 3, 'Must have at least 3 power action verbs');
  assert.strictEqual(
    atsReport.extractedProfile.missingSections.length,
    0,
    `Should have 0 missing standard sections, got: ${atsReport.extractedProfile.missingSections.join(', ')}`
  );

  // Contacts extraction verification
  assert.ok(atsReport.extractedProfile.contacts.email, 'Email must be detected');
  assert.ok(atsReport.extractedProfile.contacts.phone, 'Phone must be detected');
  assert.ok(atsReport.extractedProfile.contacts.linkedin, 'LinkedIn must be detected');

  // 3. JD Matching verification
  const sampleJd = `
    Looking for a Full-Stack Software Developer.
    Requirements:
    - Strong experience in JavaScript ES6+, TypeScript, Next.js, and Node.js
    - Experience with PostgreSQL and Docker
    - Knowledge of REST APIs and system performance
  `;

  const jdResult = matchJobDescription(sampleJd, synthesized.skills.all);
  assert.ok(jdResult.analyzable, 'JD should be analyzable');
  assert.ok(
    jdResult.match_score >= 70,
    `JD match score should be >= 70, got ${jdResult.match_score}%`
  );
  assert.ok(
    jdResult.verdict === 'strong' || jdResult.verdict === 'possible',
    `Verdict should be strong or possible, got ${jdResult.verdict}`
  );

  // 4. Standalone HTML print generation
  const html = generateResumeHtml(synthesized.formData);
  assert.ok(html.includes('Aarav Sharma'), 'HTML must contain candidate name');
  assert.ok(html.includes('National Institute of Technology'), 'HTML must contain institution');
  assert.ok(html.includes('Full-Stack Microservices Architecture'), 'HTML must contain project name');
});
