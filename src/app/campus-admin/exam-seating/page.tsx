import React from 'react';
import ExamSeatingManager from '@/components/admin/ExamSeatingManager';

export const metadata = {
  title: 'Examination Hall Seating & Invigilation Dispatcher | Campus Admin',
  description: 'Statutory CoE interleaved anti-cheating seating arrangement, faculty invigilation duty rosters, and unfair means incident management.',
};

export default function ExamSeatingPage() {
  return <ExamSeatingManager />;
}
