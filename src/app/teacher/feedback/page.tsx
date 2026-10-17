import React from 'react';
import { StudentFeedbackStudio } from '@/components/teacher/StudentFeedbackStudio';

export const metadata = {
  title: 'Student Evaluation of Teaching (SET) | Teacher Portal | PinIT Career OS',
  description: 'NAAC Criterion 2.7 Student Satisfaction Survey (SSS), 5-dimension Likert evaluation, and Teacher Effectiveness Index (TEI)',
};

export default function StudentFeedbackPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <StudentFeedbackStudio />
      </div>
    </div>
  );
}
