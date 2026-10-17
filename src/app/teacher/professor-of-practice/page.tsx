import React from 'react';
import { Metadata } from 'next';
import FacultyProfessorOfPracticeStudio from '@/components/teacher/FacultyProfessorOfPracticeStudio';

export const metadata: Metadata = {
  title: 'Faculty Professor of Practice (PoP) & Industry Chair Studio | Teacher Portal',
  description: 'UGC 2022 Guidelines on Engaging Professor of Practice, Industry Synergies, and Honorarium Disbursements.',
};

export default function ProfessorOfPracticePage() {
  return <FacultyProfessorOfPracticeStudio />;
}
