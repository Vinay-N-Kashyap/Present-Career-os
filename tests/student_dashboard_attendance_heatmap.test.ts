import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Helper functions mirroring dashboard attendance & heatmap logic
function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface AttendanceState {
  lastCheckInDate: string;
  focusStreak: number;
  attendedDays: string[];
  totalClasses: number;
  attendedClasses: number;
}

function processDailyCheckIn(
  currentState: AttendanceState,
  targetDate: string = getLocalDateString()
): { updatedState: AttendanceState; pinsGranted: number; xpGranted: number; error?: string } {
  // Idempotency guard: prevent duplicate check-ins on same calendar day
  if (currentState.lastCheckInDate === targetDate) {
    return {
      updatedState: currentState,
      pinsGranted: 0,
      xpGranted: 0,
      error: 'Attendance already recorded for today',
    };
  }

  // Calculate streak continuity
  let newStreak = 1;
  if (currentState.lastCheckInDate) {
    const lastDate = new Date(currentState.lastCheckInDate);
    const currDate = new Date(targetDate);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      newStreak = currentState.focusStreak + 1;
    } else if (diffDays <= 0) {
      newStreak = currentState.focusStreak; // Same or prior day anomaly
    } else {
      newStreak = 1; // Streak broken
    }
  }

  const updatedAttendedDays = currentState.attendedDays.includes(targetDate)
    ? currentState.attendedDays
    : [...currentState.attendedDays, targetDate];

  const updatedState: AttendanceState = {
    lastCheckInDate: targetDate,
    focusStreak: newStreak,
    attendedDays: updatedAttendedDays,
    totalClasses: currentState.totalClasses + 1,
    attendedClasses: currentState.attendedClasses + 1,
  };

  return {
    updatedState,
    pinsGranted: 10,
    xpGranted: 25,
  };
}

function calculateAttendancePercentage(attended: number, total: number): {
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
  label: string;
} {
  if (total <= 0) return { percentage: 100, status: 'safe', label: '100% (No classes missed)' };
  const percentage = Number(((attended / total) * 100).toFixed(1));
  
  if (percentage >= 75) {
    return {
      percentage,
      status: 'safe',
      label: `${percentage}% (Eligible for Exams)`,
    };
  } else if (percentage >= 65) {
    return {
      percentage,
      status: 'warning',
      label: `${percentage}% (Warning: Below 75% Criteria)`,
    };
  } else {
    return {
      percentage,
      status: 'critical',
      label: `${percentage}% (Critical: Hall Ticket Detained)`,
    };
  }
}

function computeDailyHeatmapContributions(
  date: Date,
  attendedDays: string[],
  questTimestamps: string[],
  missionTimestamps: string[]
): { count: number; level: 0 | 1 | 2 | 3; details: string[] } {
  const dateStr = getLocalDateString(date);
  let count = 0;
  const details: string[] = [];

  // 1. Attendance check
  if (attendedDays.includes(dateStr)) {
    count++;
    details.push('Present (Daily Check-in)');
  }

  // 2. Quests completed on this date
  const questCount = questTimestamps.filter(ts => {
    const iso = ts.includes('|') ? ts.split('|')[0] : ts;
    const d = new Date(iso);
    return !isNaN(d.getTime()) && getLocalDateString(d) === dateStr;
  }).length;
  if (questCount > 0) {
    count += questCount;
    details.push(`${questCount} Quest${questCount > 1 ? 's' : ''}`);
  }

  // 3. Missions completed on this date
  const missionCount = missionTimestamps.filter(ts => {
    const iso = ts.includes('|') ? ts.split('|')[0] : ts;
    const d = new Date(iso);
    return !isNaN(d.getTime()) && getLocalDateString(d) === dateStr;
  }).length;
  if (missionCount > 0) {
    count += missionCount;
    details.push(`${missionCount} Mission${missionCount > 1 ? 's' : ''}`);
  }

  const level: 0 | 1 | 2 | 3 = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;
  return { count, level, details };
}

describe('STUDENT DASHBOARD — ATTENDANCE MARKER & HEATMAP BRUTAL VALIDATION', () => {

  describe('Adversarial Test 1: Daily Check-In Idempotency & Reward Safety', () => {
    it('grants +10 Pins and increments streak on initial check-in', () => {
      const initialState: AttendanceState = {
        lastCheckInDate: '2026-10-30',
        focusStreak: 4,
        attendedDays: ['2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30'],
        totalClasses: 30,
        attendedClasses: 26,
      };

      const result = processDailyCheckIn(initialState, '2026-10-31');
      assert.equal(result.pinsGranted, 10, 'Must grant exactly 10 Pins');
      assert.equal(result.xpGranted, 25, 'Must grant exactly 25 XP');
      assert.equal(result.updatedState.focusStreak, 5, 'Streak must increment from 4 to 5');
      assert.equal(result.updatedState.lastCheckInDate, '2026-10-31');
    });

    it('blocks duplicate check-in on the same day and prevents duplicate Pin farming', () => {
      const checkedInToday: AttendanceState = {
        lastCheckInDate: '2026-10-31',
        focusStreak: 5,
        attendedDays: ['2026-10-31'],
        totalClasses: 31,
        attendedClasses: 27,
      };

      const secondAttempt = processDailyCheckIn(checkedInToday, '2026-10-31');
      assert.equal(secondAttempt.pinsGranted, 0, 'Duplicate check-in MUST grant 0 Pins');
      assert.equal(secondAttempt.xpGranted, 0, 'Duplicate check-in MUST grant 0 XP');
      assert.ok(secondAttempt.error, 'Must return error message for duplicate attempt');
      assert.equal(secondAttempt.updatedState.focusStreak, 5, 'Streak must remain unchanged');
    });

    it('resets streak to 1 if a student missed a calendar day', () => {
      const brokenState: AttendanceState = {
        lastCheckInDate: '2026-10-20', // 10 days ago
        focusStreak: 12,
        attendedDays: ['2026-10-20'],
        totalClasses: 30,
        attendedClasses: 25,
      };

      const result = processDailyCheckIn(brokenState, '2026-10-31');
      assert.equal(result.updatedState.focusStreak, 1, 'Missed days must reset streak to 1');
      assert.equal(result.pinsGranted, 10);
    });
  });

  describe('Adversarial Test 2: Indian University 75% Attendance Criteria Meter', () => {
    it('classifies >= 75% attendance as safe for exams', () => {
      const res = calculateAttendancePercentage(34, 40); // 85%
      assert.equal(res.status, 'safe');
      assert.equal(res.percentage, 85);
      assert.ok(res.label.includes('Eligible for Exams'));
    });

    it('classifies 65-74% attendance as warning', () => {
      const res = calculateAttendancePercentage(28, 40); // 70%
      assert.equal(res.status, 'warning');
      assert.equal(res.percentage, 70);
      assert.ok(res.label.includes('Below 75%'));
    });

    it('classifies < 65% attendance as critical detainment risk', () => {
      const res = calculateAttendancePercentage(20, 40); // 50%
      assert.equal(res.status, 'critical');
      assert.equal(res.percentage, 50);
      assert.ok(res.label.includes('Detained'));
    });
  });

  describe('Adversarial Test 3: Socratic Heatmap Contribution Levels', () => {
    it('evaluates level 0 for an inactive day', () => {
      const testDate = new Date('2026-10-25');
      const res = computeDailyHeatmapContributions(testDate, [], [], []);
      assert.equal(res.count, 0);
      assert.equal(res.level, 0);
      assert.equal(res.details.length, 0);
    });

    it('evaluates level 1 for a day with only attendance check-in', () => {
      const testDate = new Date('2026-10-25');
      const res = computeDailyHeatmapContributions(testDate, ['2026-10-25'], [], []);
      assert.equal(res.count, 1);
      assert.equal(res.level, 1);
      assert.ok(res.details.includes('Present (Daily Check-in)'));
    });

    it('evaluates level 3 for multi-activity day (attendance + quests + missions)', () => {
      const testDate = new Date('2026-10-25');
      const res = computeDailyHeatmapContributions(
        testDate,
        ['2026-10-25'],
        ['2026-10-25T10:00:00.000Z|react-day-1', '2026-10-25T14:00:00.000Z|react-day-2'],
        ['2026-10-25T16:00:00.000Z|mission-dsa-1']
      );
      assert.equal(res.count, 4); // 1 attendance + 2 quests + 1 mission
      assert.equal(res.level, 3);
      assert.equal(res.details.length, 3);
    });
  });
});
