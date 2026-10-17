/**
 * Student Evaluation of Teaching (SET) & Teacher Effectiveness Index Engine (TASK-918)
 * 
 * Provides:
 * 1. NAAC Criterion 2.7 (Student Satisfaction Survey - SSS) statutory compliance.
 * 2. Likert-scale (1-5) feedback across 5 dimensions:
 *    - Course Content Delivery & Clarity
 *    - Subject Depth & Conceptual Rigor
 *    - Evaluation Fairness & Transparent Grading
 *    - Accessibility & Doubts Resolution
 *    - Interactive Pedagogy & Socratic Engagement
 * 3. Anti-ballot-stuffing student token hashing with complete whistleblower anonymity.
 * 4. Deterministic Teacher Effectiveness Index (TEI: 0 - 100) and performance banding.
 * 5. Automated sentiment tagging on qualitative student feedback.
 * 6. Official NAAC Criterion 2.7 SSS CSV Export.
 */

export type FeedbackDimension = 
  | 'COURSE_DELIVERY' 
  | 'SUBJECT_MASTERY' 
  | 'GRADING_FAIRNESS' 
  | 'DOUBT_AVAILABILITY' 
  | 'SOCRATIC_ENGAGEMENT';

export type PerformanceBand = 'EXEMPLARY' | 'PROFICIENT' | 'DEVELOPING' | 'NEEDS_IMPROVEMENT';
export type SentimentTag = 'POSITIVE' | 'NEUTRAL' | 'CONSTRUCTIVE';

export interface StudentFeedbackSubmission {
  id: string; // SET-[HEX8]
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  courseCode: string;
  courseTitle: string;
  semester: string;
  academicYear: string;
  studentTokenHash: string; // Anonymous unique hash per student per course
  ratings: Record<FeedbackDimension, number>; // 1 - 5 Likert scale
  qualitativeComments: string;
  sentiment: SentimentTag;
  submittedAt: string;
}

export interface TeacherEffectivenessSummary {
  facultyId: string;
  facultyName: string;
  department: string;
  totalResponses: number;
  enrolledStudentsCount: number;
  participationRatePercent: number;
  dimensionAverages: Record<FeedbackDimension, number>; // 1.0 - 5.0
  teiScore: number; // 0 - 100
  performanceBand: PerformanceBand;
  isNaacValid: boolean; // Participation rate >= 60%
  feedbackDistribution: {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
  };
  qualitativeHighlights: {
    id: string;
    comment: string;
    sentiment: SentimentTag;
    courseCode: string;
    submittedAt: string;
  }[];
}

// In-Memory Store
let feedbackStore: StudentFeedbackSubmission[] = [];

export function getFeedbackSubmissions(
  institutionId: string,
  filter?: { facultyId?: string; courseCode?: string }
): StudentFeedbackSubmission[] {
  return feedbackStore
    .filter(f => f.institutionId === institutionId)
    .filter(f => !filter?.facultyId || f.facultyId === filter.facultyId)
    .filter(f => !filter?.courseCode || f.courseCode === filter.courseCode)
    .map(f => ({
      ...f,
      ratings: { ...f.ratings }
    }));
}

export function detectSentiment(comment: string): SentimentTag {
  const text = comment.toLowerCase();
  const positiveKeywords = ['excellent', 'great', 'clear', 'helpful', 'engaging', 'brilliant', 'inspiring', 'best', 'thorough', 'friendly', 'passionate'];
  const constructiveKeywords = ['fast', 'confusing', 'harsh', 'unclear', 'late', 'tough', 'boring', 'unapproachable', 'rushed', 'monotone', 'difficult to follow'];

  const posCount = positiveKeywords.filter(k => text.includes(k)).length;
  const conCount = constructiveKeywords.filter(k => text.includes(k)).length;

  if (posCount > conCount) return 'POSITIVE';
  if (conCount > posCount) return 'CONSTRUCTIVE';
  return 'NEUTRAL';
}

export function submitStudentFeedback(params: {
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  courseCode: string;
  courseTitle: string;
  semester: string;
  academicYear: string;
  studentTokenHash: string;
  ratings: Record<FeedbackDimension, number>;
  qualitativeComments?: string;
}): { success: boolean; feedback?: StudentFeedbackSubmission; error?: string } {
  // Validate dimension keys
  const dimensions: FeedbackDimension[] = [
    'COURSE_DELIVERY',
    'SUBJECT_MASTERY',
    'GRADING_FAIRNESS',
    'DOUBT_AVAILABILITY',
    'SOCRATIC_ENGAGEMENT'
  ];

  for (const dim of dimensions) {
    const val = params.ratings[dim];
    if (typeof val !== 'number' || val < 1 || val > 5 || !Number.isInteger(val)) {
      return {
        success: false,
        error: `INVALID_RATING: Dimension ${dim} must be an integer between 1 and 5.`
      };
    }
  }

  // Duplicate submission check
  const duplicate = feedbackStore.some(
    f =>
      f.institutionId === params.institutionId &&
      f.courseCode === params.courseCode &&
      f.semester === params.semester &&
      f.studentTokenHash === params.studentTokenHash
  );

  if (duplicate) {
    return {
      success: false,
      error: 'DUPLICATE_FEEDBACK_SUBMISSION: Student has already submitted an evaluation for this course in this semester.'
    };
  }

  const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
  const id = `SET-${hex}`;
  const comments = params.qualitativeComments?.trim() || '';
  const sentiment = comments ? detectSentiment(comments) : 'NEUTRAL';

  const newFeedback: StudentFeedbackSubmission = {
    id,
    institutionId: params.institutionId,
    facultyId: params.facultyId,
    facultyName: params.facultyName,
    department: params.department,
    courseCode: params.courseCode,
    courseTitle: params.courseTitle,
    semester: params.semester,
    academicYear: params.academicYear,
    studentTokenHash: params.studentTokenHash,
    ratings: { ...params.ratings },
    qualitativeComments: comments,
    sentiment,
    submittedAt: new Date().toISOString()
  };

  feedbackStore.push(newFeedback);
  return { success: true, feedback: { ...newFeedback } };
}

export function computeTeacherTEI(
  facultyId: string,
  institutionId: string,
  enrolledStudentsCount: number = 60
): TeacherEffectivenessSummary {
  const submissions = getFeedbackSubmissions(institutionId, { facultyId });
  const totalResponses = submissions.length;

  const dimensions: FeedbackDimension[] = [
    'COURSE_DELIVERY',
    'SUBJECT_MASTERY',
    'GRADING_FAIRNESS',
    'DOUBT_AVAILABILITY',
    'SOCRATIC_ENGAGEMENT'
  ];

  const dimSums: Record<FeedbackDimension, number> = {
    COURSE_DELIVERY: 0,
    SUBJECT_MASTERY: 0,
    GRADING_FAIRNESS: 0,
    DOUBT_AVAILABILITY: 0,
    SOCRATIC_ENGAGEMENT: 0
  };

  const distribution = { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 };

  let facultyName = 'Faculty Member';
  let department = 'Computer Science';

  if (totalResponses > 0) {
    facultyName = submissions[0].facultyName;
    department = submissions[0].department;

    for (const sub of submissions) {
      for (const dim of dimensions) {
        const score = sub.ratings[dim];
        dimSums[dim] += score;

        if (score === 1) distribution.star1++;
        else if (score === 2) distribution.star2++;
        else if (score === 3) distribution.star3++;
        else if (score === 4) distribution.star4++;
        else if (score === 5) distribution.star5++;
      }
    }
  }

  const dimensionAverages: Record<FeedbackDimension, number> = {
    COURSE_DELIVERY: totalResponses > 0 ? parseFloat((dimSums.COURSE_DELIVERY / totalResponses).toFixed(2)) : 0,
    SUBJECT_MASTERY: totalResponses > 0 ? parseFloat((dimSums.SUBJECT_MASTERY / totalResponses).toFixed(2)) : 0,
    GRADING_FAIRNESS: totalResponses > 0 ? parseFloat((dimSums.GRADING_FAIRNESS / totalResponses).toFixed(2)) : 0,
    DOUBT_AVAILABILITY: totalResponses > 0 ? parseFloat((dimSums.DOUBT_AVAILABILITY / totalResponses).toFixed(2)) : 0,
    SOCRATIC_ENGAGEMENT: totalResponses > 0 ? parseFloat((dimSums.SOCRATIC_ENGAGEMENT / totalResponses).toFixed(2)) : 0
  };

  // Mean rating across all dimensions
  const totalDimensions = dimensions.length;
  const overallAvg = totalResponses > 0 
    ? (dimensionAverages.COURSE_DELIVERY +
       dimensionAverages.SUBJECT_MASTERY +
       dimensionAverages.GRADING_FAIRNESS +
       dimensionAverages.DOUBT_AVAILABILITY +
       dimensionAverages.SOCRATIC_ENGAGEMENT) / totalDimensions
    : 0;

  // TEI Score out of 100
  const teiScore = totalResponses > 0 ? Math.round((overallAvg / 5) * 100) : 0;

  // Performance Band
  let performanceBand: PerformanceBand = 'NEEDS_IMPROVEMENT';
  if (teiScore >= 85) performanceBand = 'EXEMPLARY';
  else if (teiScore >= 70) performanceBand = 'PROFICIENT';
  else if (teiScore >= 50) performanceBand = 'DEVELOPING';

  const participationRatePercent = enrolledStudentsCount > 0
    ? Math.round((totalResponses / enrolledStudentsCount) * 100)
    : 0;

  const isNaacValid = participationRatePercent >= 60;

  const qualitativeHighlights = submissions
    .filter(s => s.qualitativeComments.length > 0)
    .map(s => ({
      id: s.id,
      comment: s.qualitativeComments,
      sentiment: s.sentiment,
      courseCode: s.courseCode,
      submittedAt: s.submittedAt
    }));

  return {
    facultyId,
    facultyName,
    department,
    totalResponses,
    enrolledStudentsCount,
    participationRatePercent,
    dimensionAverages,
    teiScore,
    performanceBand,
    isNaacValid,
    feedbackDistribution: distribution,
    qualitativeHighlights
  };
}

export function exportNaacSssCSV(institutionId: string): string {
  const submissions = getFeedbackSubmissions(institutionId);

  const lines: string[] = [];
  lines.push('=== NAAC CRITERION 2.7: STUDENT SATISFACTION SURVEY (SSS) REPORT ===');
  lines.push('Submission_ID,Faculty_ID,Faculty_Name,Department,Course_Code,Course_Title,Semester,Course_Delivery,Subject_Mastery,Grading_Fairness,Doubt_Availability,Socratic_Engagement,Sentiment,Submission_Date');

  for (const s of submissions) {
    lines.push(
      `"${s.id}","${s.facultyId}","${s.facultyName}","${s.department}","${s.courseCode}","${s.courseTitle.replace(/"/g, '""')}","${s.semester}",${s.ratings.COURSE_DELIVERY},${s.ratings.SUBJECT_MASTERY},${s.ratings.GRADING_FAIRNESS},${s.ratings.DOUBT_AVAILABILITY},${s.ratings.SOCRATIC_ENGAGEMENT},"${s.sentiment}","${s.submittedAt}"`
    );
  }

  return lines.join('\n');
}

export function seedStudentFeedbackData(institutionId: string): void {
  feedbackStore = [
    {
      id: 'SET-9A10F4',
      institutionId,
      facultyId: 'FAC-CS-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science',
      courseCode: 'CS-301',
      courseTitle: 'Distributed Systems & Cloud Computing',
      semester: 'Fall 2026',
      academicYear: '2026-2027',
      studentTokenHash: 'TOKEN-STUDENT-A1',
      ratings: {
        COURSE_DELIVERY: 5,
        SUBJECT_MASTERY: 5,
        GRADING_FAIRNESS: 4,
        DOUBT_AVAILABILITY: 5,
        SOCRATIC_ENGAGEMENT: 5
      },
      qualitativeComments: 'Excellent explanations of Raft consensus and Byzantine Fault Tolerance. Highly engaging lectures!',
      sentiment: 'POSITIVE',
      submittedAt: '2026-10-01T14:30:00Z'
    },
    {
      id: 'SET-9A10F5',
      institutionId,
      facultyId: 'FAC-CS-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science',
      courseCode: 'CS-301',
      courseTitle: 'Distributed Systems & Cloud Computing',
      semester: 'Fall 2026',
      academicYear: '2026-2027',
      studentTokenHash: 'TOKEN-STUDENT-A2',
      ratings: {
        COURSE_DELIVERY: 4,
        SUBJECT_MASTERY: 5,
        GRADING_FAIRNESS: 4,
        DOUBT_AVAILABILITY: 4,
        SOCRATIC_ENGAGEMENT: 4
      },
      qualitativeComments: 'Pacing was slightly fast during vector clocks, but office hours were helpful and thorough.',
      sentiment: 'POSITIVE',
      submittedAt: '2026-10-02T11:15:00Z'
    },
    {
      id: 'SET-9A10F6',
      institutionId,
      facultyId: 'FAC-CS-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science',
      courseCode: 'CS-402',
      courseTitle: 'Advanced Distributed Protocols',
      semester: 'Fall 2026',
      academicYear: '2026-2027',
      studentTokenHash: 'TOKEN-STUDENT-A3',
      ratings: {
        COURSE_DELIVERY: 5,
        SUBJECT_MASTERY: 5,
        GRADING_FAIRNESS: 5,
        DOUBT_AVAILABILITY: 4,
        SOCRATIC_ENGAGEMENT: 5
      },
      qualitativeComments: 'Brilliant deep-dive into Paxos variants. Evaluated fairly with clear rubrics.',
      sentiment: 'POSITIVE',
      submittedAt: '2026-10-04T09:45:00Z'
    }
  ];
}

export function resetFeedbackStore(): void {
  feedbackStore = [];
}
