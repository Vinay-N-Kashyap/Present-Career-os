import { describe, it, expect } from './helpers/testShim';
import {
  logDisasterIncident,
  updateMusterHeadcount,
  issueAllClearDeclaration,
  inspectFireEquipment,
  exportDisasterManagementCSV,
  SAMPLE_DISASTER_INCIDENTS,
  SAMPLE_FIRE_EQUIPMENT,
  MIN_ACCEPTABLE_HYDRANT_PRESSURE_PSI,
} from '../src/lib/admin/centralDisasterManagement';

import {
  registerIncubatedStartup,
  recordRocIncorporation,
  sanctionSeedGrant,
  disburseSeedTranche,
  exportStartupIncubationCSV,
  SAMPLE_STARTUPS,
  MIN_UNIVERSITY_EQUITY_PERCENT,
  MAX_UNIVERSITY_EQUITY_PERCENT,
  MAX_FACULTY_TIME_COMMITMENT_PERCENT,
  MAX_SEED_GRANT_INR,
} from '../src/lib/teacher/facultyStartupIncubation';

describe('Block 39: Central Disaster Safety & Faculty Startup Incubation Systems', () => {
  // Test 1: Log Disaster Incident
  it('logs a new campus hazard incident with valid token, default muster points, and SHA-256 seal', () => {
    const incident = logDisasterIncident({
      hazardCategory: 'CHEMICAL_BIO_SPILL',
      threatLevel: 'LEVEL_2_BUILDING_EVACUATION',
      primaryLocation: 'Biotechnology Research Wing B',
      reportingOfficer: 'Dr. Neha Kapoor (Biosafety Marshall)',
    });

    expect(incident.incidentId).toMatch(/^DSM-2026-CHEM-[A-F0-9]{6}$/);
    expect(incident.hazardCategory).toBe('CHEMICAL_BIO_SPILL');
    expect(incident.threatLevel).toBe('LEVEL_2_BUILDING_EVACUATION');
    expect(incident.sirenTriggered).toBe(true);
    expect(incident.musterHeadcounts.length).toBeGreaterThan(0);
    expect(incident.auditSha256).toHaveLength(64);
  });

  // Test 2: Update Muster Point Headcount
  it('updates muster point evacuation headcount and tracks unaccounted persons accurately', () => {
    const incident = SAMPLE_DISASTER_INCIDENTS[0];
    const musterId = incident.musterHeadcounts[0].musterPointId;

    const updated = updateMusterHeadcount(incident, musterId, {
      evacuatedHeadcount: 445,
      unaccountedPersons: 5,
      isZoneClear: false,
    });

    const target = updated.musterHeadcounts.find(m => m.musterPointId === musterId);
    expect(target?.evacuatedHeadcount).toBe(445);
    expect(target?.unaccountedPersons).toBe(5);
    expect(target?.isZoneClear).toBe(false);
    expect(updated.auditSha256).toHaveLength(64);
    expect(updated.auditSha256).not.toBe(incident.auditSha256);
  });

  // Test 3: Declare ALL-CLEAR
  it('issues an official ALL-CLEAR declaration, resets threat level to NORMAL, and logs remedial actions', () => {
    const incident = SAMPLE_DISASTER_INCIDENTS[0];
    const cleared = issueAllClearDeclaration(
      incident,
      'Col. P. S. Chauhan (Chief Incident Commander)',
      'Fire completely extinguished, ventilation scrubbers verified at 0 ppm toxic fumes.'
    );

    expect(cleared.threatLevel).toBe('NORMAL_MONITORED');
    expect(cleared.incidentStatus).toBe('ALL_CLEAR_RECOVERED');
    expect(cleared.remedialActionsTaken.some(a => a.includes('ALL-CLEAR officially sanctioned'))).toBe(true);
    expect(cleared.auditSha256).toHaveLength(64);
  });

  // Test 4: Fire Equipment Inspection
  it('inspects fire equipment and certifies operational readiness against 45 PSI benchmark', () => {
    const hydrant = inspectFireEquipment({
      equipmentType: 'FIRE_HYDRANT',
      locationTag: 'Campus Main Auditorium Standpipe',
      pressureGaugePsi: 60,
      inspectorName: 'Chief Fire Inspector V. Rawat',
    });
    expect(hydrant.isOperationallyReady).toBe(true);
    expect(hydrant.inspectionId).toMatch(/^F-EQ-\d{6}$/);

    const deficit = inspectFireEquipment({
      equipmentType: 'ABC_DRY_POWDER',
      locationTag: 'Hostel Block 3 Corridors',
      pressureGaugePsi: 35, // below 45 PSI
      inspectorName: 'Sub-Officer R. K. Das',
    });
    expect(deficit.isOperationallyReady).toBe(false);
  });

  // Test 5: Disaster Management CSV Export
  it('exports valid official CSV for Disaster Management and evacuation ledger', () => {
    const csv = exportDisasterManagementCSV(SAMPLE_DISASTER_INCIDENTS);
    expect(csv).toContain('Incident ID,Timestamp,Hazard Category,Threat Level');
    expect(csv).toContain('Chemistry Wing - 2nd Floor Organic Synthesis Lab');
    expect(csv).toContain('DSM-2026-');
  });

  // Test 6: Register Incubated Startup and NISP 20% faculty time rule
  it('registers incubated startup and enforces NISP 2019 maximum 20% faculty time commitment', () => {
    const startup = registerIncubatedStartup({
      startupName: 'QuantEdge Financial ML',
      primaryDomain: 'Algorithmic Trading & Risk Analytics',
      founderStudentName: 'Kunal Singhal',
      founderStudentRoll: '2023CS088',
      facultyMentorName: 'Prof. Ananya Sen',
      facultyMentorEmpId: 'FAC-CS-2015-021',
      department: 'Computer Science',
      facultyTimeCommitmentPercent: 15,
    });

    expect(startup.startupRecordId).toMatch(/^STU-2026-COMP-[A-F0-9]{6}$/);
    expect(startup.incubationStage).toBe('IDEATION_PRE_INCUBATION');
    expect(startup.facultyTimeCommitmentPercent).toBe(15);
    expect(startup.auditSha256).toHaveLength(64);

    expect(() =>
      registerIncubatedStartup({
        startupName: 'Overtime Venture',
        primaryDomain: 'EdTech',
        founderStudentName: 'Student X',
        founderStudentRoll: '2023IT001',
        facultyMentorName: 'Faculty Y',
        facultyMentorEmpId: 'FAC-IT-001',
        department: 'IT',
        facultyTimeCommitmentPercent: 25, // exceeds 20%
      })
    ).toThrow(/faculty mentor time commitment cannot exceed 20%/i);
  });

  // Test 7: ROC Incorporation and NISP 2.0% - 9.5% Equity Stake Cap
  it('certifies ROC incorporation and validates statutory 2.0% to 9.5% university equity stake cap', () => {
    const base = registerIncubatedStartup({
      startupName: 'SolarFlux Energy Pvt Ltd',
      primaryDomain: 'CleanTech Solar Perovskites',
      founderStudentName: 'Tarun Mathur',
      founderStudentRoll: '2024EE044',
      facultyMentorName: 'Dr. G. K. Reddy',
      facultyMentorEmpId: 'FAC-EE-2018-091',
      department: 'Electrical Engineering',
    });

    const incorporated = recordRocIncorporation(base, {
      rocCinOrLlpin: 'U40106DL2026PTC392817',
      incorporationDate: '2026-03-01',
      universityEquityStakePercent: 6.5,
    });

    expect(incorporated.incubationStage).toBe('STARTUP_INCORPORATED_ROC');
    expect(incorporated.rocCinOrLlpin).toBe('U40106DL2026PTC392817');
    expect(incorporated.universityEquityStakePercent).toBe(6.5);

    expect(() =>
      recordRocIncorporation(base, {
        rocCinOrLlpin: 'U40106DL2026PTC392817',
        incorporationDate: '2026-03-01',
        universityEquityStakePercent: 12.0, // exceeds 9.5%
      })
    ).toThrow(/between 2% and 9.5%/i);

    expect(() =>
      recordRocIncorporation(base, {
        rocCinOrLlpin: 'U40106DL2026PTC392817',
        incorporationDate: '2026-03-01',
        universityEquityStakePercent: 1.0, // below 2%
      })
    ).toThrow(/between 2% and 9.5%/i);
  });

  // Test 8: Sanction Seed Grant in 30/40/30 milestone tranches
  it('sanctions NISP seed grant up to ₹10,00,000 ceiling into 30/40/30 milestone tranches', () => {
    const base = SAMPLE_STARTUPS[1]; // Unfunded startup
    const funded = sanctionSeedGrant(base, 800000);

    expect(funded.totalSanctionedSeedFundInr).toBe(800000);
    expect(funded.seedTranches.length).toBe(3);
    expect(funded.seedTranches[0].amountInr).toBe(240000); // 30%
    expect(funded.seedTranches[1].amountInr).toBe(320000); // 40%
    expect(funded.seedTranches[2].amountInr).toBe(240000); // 30%
    expect(funded.incubationStage).toBe('SEED_FUNDED_SCALING');

    expect(() => sanctionSeedGrant(base, 1500000)).toThrow(/maximum allowable seed grant is ₹10,00,000/i);
  });

  // Test 9: Disburse Seed Tranche sequentially
  it('disburses seed tranches sequentially and accumulates total disbursed capital', () => {
    const startup = SAMPLE_STARTUPS[0]; // Already sanctioned ₹5,00,000
    const initialDisbursed = startup.totalDisbursedSeedFundInr;

    // Disburse Tranche 1
    const res1 = disburseSeedTranche(startup, 1, 'TXN-SEED-T1-9901');
    expect(res1.success).toBe(true);
    expect(res1.record.seedTranches[0].isDisbursed).toBe(true);
    expect(res1.record.totalDisbursedSeedFundInr).toBe(initialDisbursed + 150000);

    // Attempting Tranche 3 before Tranche 2 must fail
    const res3Early = disburseSeedTranche(res1.record, 3);
    expect(res3Early.success).toBe(false);
    expect(res3Early.error).toMatch(/must be disbursed first/i);

    // Disburse Tranche 2
    const res2 = disburseSeedTranche(res1.record, 2, 'TXN-SEED-T2-9902');
    expect(res2.success).toBe(true);
    expect(res2.record.seedTranches[1].isDisbursed).toBe(true);
    expect(res2.record.totalDisbursedSeedFundInr).toBe(initialDisbursed + 150000 + 200000);
  });

  // Test 10: Export Startups CSV
  it('exports official CSV for University Incubated Start-Up ledger with SHA-256 seals', () => {
    const csv = exportStartupIncubationCSV(SAMPLE_STARTUPS);
    expect(csv).toContain('Startup Token ID,Startup Name,Domain,Student Founder');
    expect(csv).toContain('AeroGrid Autonomous Robotics Pvt Ltd');
    expect(csv).toContain('Devansh Kulkarni');
  });
});
