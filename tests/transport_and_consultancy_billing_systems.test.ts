import { describe, it, expect } from './helpers/testShim';
import {
  createFleetVehicle,
  dispatchVehicleTrip,
  completeVehicleTrip,
  logFuelCardTransaction,
  recordMaintenanceLog,
  exportCampusTransportFleetCSV,
  generateTransportSeal,
  checkStatutoryCompliance,
  MIN_EV_DISPATCH_SOC_PERCENT
} from '../src/lib/admin/centralCampusTransport';

import {
  createConsultancyProject,
  raiseMilestoneInvoice,
  recordClientPaymentAndDisburse,
  exportFacultyConsultancyLedgerCSV,
  generateConsultancySeal,
  calculateMilestoneBilling,
  getRevenueShareNorms,
  STANDARD_CONSULTANCY_GST_PERCENT,
  STANDARD_CONSULTANCY_SAC_CODE
} from '../src/lib/teacher/facultyConsultancyBilling';

describe('Central Campus Transport Fleet & Faculty Corporate Consultancy Systems (TASK-1031..1035)', () => {
  // Test 1: Vehicle Creation and Token Validation
  it('should create an EV fleet vehicle with statutory token and SHA-256 seal', () => {
    const vehicle = createFleetVehicle({
      registrationNumber: 'KA-01-EQ-5544',
      chassisNumber: 'MAT628491EVB55441',
      category: 'ELECTRIC_BUS_SHUTTLE',
      fuelType: 'EV_BATTERY_ELECTRIC',
      seatingCapacity: 45,
      initialOdometerKm: 12000,
      batterySocPercent: 90,
      ratedEfficiencyKmPerUnit: 1.2,
      pucExpiryDate: '2027-12-31',
      fitnessExpiryDate: '2027-12-31',
      insuranceExpiryDate: '2027-12-31',
      assignedDriver: 'Anand Kumar',
      assignedDriverLicense: 'DL-KA-2016-0033190',
      year: 2026
    });

    expect(vehicle.vehicleId).toMatch(/^TRP-2026-EVBUS-[A-F0-9]{6}$/);
    expect(vehicle.registrationNumber).toBe('KA-01-EQ-5544');
    expect(vehicle.status).toBe('AVAILABLE_ACTIVE');
    expect(vehicle.batterySocPercent).toBe(90);
    expect(vehicle.auditSha256).toBeDefined();
    expect(vehicle.auditSha256.length).toBe(64);
  });

  // Test 2: EV Battery SoC Dispatch Hurdle
  it('should enforce the 25% minimum SoC hurdle for EV dispatch', () => {
    // Low battery vehicle
    const lowBatVehicle = createFleetVehicle({
      registrationNumber: 'KA-01-EQ-1002',
      chassisNumber: 'MAT628491EVB10020',
      category: 'ELECTRIC_BUS_SHUTTLE',
      fuelType: 'EV_BATTERY_ELECTRIC',
      seatingCapacity: 45,
      initialOdometerKm: 15000,
      batterySocPercent: 20, // Below 25%
      ratedEfficiencyKmPerUnit: 1.2,
      pucExpiryDate: '2027-12-31',
      fitnessExpiryDate: '2027-12-31',
      insuranceExpiryDate: '2027-12-31',
      assignedDriver: 'Anand Kumar',
      assignedDriverLicense: 'DL-KA-2016-0033190'
    });

    const failedDispatch = dispatchVehicleTrip(lowBatVehicle, {
      routeName: 'Metro Route 1',
      expectedReturnTimestamp: '2026-04-10T14:00:00Z',
      passengerCount: 30,
      purpose: 'REGULAR_CAMPUS_SHUTTLE'
    });

    expect(failedDispatch.success).toBe(false);
    expect(failedDispatch.error).toContain('below mandatory threshold (25%)');

    // Sufficient battery vehicle
    const okBatVehicle = { ...lowBatVehicle, batterySocPercent: 65 };
    const okDispatch = dispatchVehicleTrip(okBatVehicle, {
      routeName: 'Metro Route 1',
      expectedReturnTimestamp: '2026-04-10T14:00:00Z',
      passengerCount: 30,
      purpose: 'REGULAR_CAMPUS_SHUTTLE'
    });

    expect(okDispatch.success).toBe(true);
    expect(okDispatch.vehicle.status).toBe('ON_ROUTE_DISPATCHED');
    expect(okDispatch.vehicle.trips.length).toBe(1);
    expect(okDispatch.vehicle.trips[0].status).toBe('IN_TRANSIT');
  });

  // Test 3: MVA 1988 Fitness & PUC Expiry Guard
  it('should reject dispatch if MVA fitness or PUC certificate is expired', () => {
    const expiredVehicle = createFleetVehicle({
      registrationNumber: 'KA-01-MB-8800',
      chassisNumber: 'MAT628491DSB88001',
      category: 'DIESEL_CAMPUS_BUS',
      fuelType: 'DIESEL',
      seatingCapacity: 52,
      initialOdometerKm: 60000,
      ratedEfficiencyKmPerUnit: 4.0,
      pucExpiryDate: '2025-01-01', // Expired
      fitnessExpiryDate: '2025-01-01', // Expired
      insuranceExpiryDate: '2027-12-31',
      assignedDriver: 'Suresh Patil',
      assignedDriverLicense: 'DL-KA-2010-0081290'
    });

    // Check compliance
    const compliance = checkStatutoryCompliance(expiredVehicle, '2026-04-01');
    expect(compliance.isCompliant).toBe(false);
    expect(compliance.reasons.length).toBeGreaterThanOrEqual(2);

    // Initial status should be flagged
    expect(expiredVehicle.status).toBe('OUT_OF_SERVICE_FITNESS_EXPIRED');

    const dispatchRes = dispatchVehicleTrip(expiredVehicle, {
      routeName: 'City Campus Loop',
      expectedReturnTimestamp: '2026-04-10T18:00:00Z',
      passengerCount: 40,
      purpose: 'REGULAR_CAMPUS_SHUTTLE'
    });

    expect(dispatchRes.success).toBe(false);
    expect(dispatchRes.error).toContain('not available');
  });

  // Test 4: Fleet Trip Lifecycle & Odometer Update
  it('should complete vehicle trip, calculate distance, and restore availability', () => {
    const vehicle = createFleetVehicle({
      registrationNumber: 'KA-01-SD-7711',
      chassisNumber: 'MAT628491SDN77110',
      category: 'VIP_STAFF_SEDAN',
      fuelType: 'PETROL',
      seatingCapacity: 5,
      initialOdometerKm: 25000,
      ratedEfficiencyKmPerUnit: 14.0,
      pucExpiryDate: '2027-12-31',
      fitnessExpiryDate: '2027-12-31',
      insuranceExpiryDate: '2027-12-31',
      assignedDriver: 'Mahesh Sharma',
      assignedDriverLicense: 'DL-KA-2017-0091234'
    });

    const dispatchRes = dispatchVehicleTrip(vehicle, {
      routeName: 'Airport Guest Protocol Run',
      expectedReturnTimestamp: '2026-04-15T18:00:00Z',
      passengerCount: 3,
      purpose: 'FACULTY_CONFERENCE'
    });

    expect(dispatchRes.success).toBe(true);
    const activeTripId = dispatchRes.vehicle.trips[0].tripId;

    // Complete trip with end odometer 25,068 km (68 km traveled)
    const completeRes = completeVehicleTrip(dispatchRes.vehicle, {
      tripId: activeTripId,
      endOdometerKm: 25068,
      remainingFuelLevelPercent: 75
    });

    expect(completeRes.success).toBe(true);
    expect(completeRes.distanceKm).toBe(68);
    expect(completeRes.vehicle.odometerKm).toBe(25068);
    expect(completeRes.vehicle.status).toBe('AVAILABLE_ACTIVE');
    expect(completeRes.vehicle.trips[0].status).toBe('COMPLETED');
  });

  // Test 5: Fuel Card Transaction Logging & Efficiency Anomaly Telemetry
  it('should log fuel card transaction and detect fuel efficiency anomaly', () => {
    let vehicle = createFleetVehicle({
      registrationNumber: 'KA-01-DS-2233',
      chassisNumber: 'MAT628491DSB22330',
      category: 'DIESEL_CAMPUS_BUS',
      fuelType: 'DIESEL',
      seatingCapacity: 52,
      initialOdometerKm: 30000,
      ratedEfficiencyKmPerUnit: 4.5, // 4.5 km/L rated
      pucExpiryDate: '2027-12-31',
      fitnessExpiryDate: '2027-12-31',
      insuranceExpiryDate: '2027-12-31',
      assignedDriver: 'Jaswant Singh',
      assignedDriverLicense: 'DL-PB-2011-0081290',
      assignedFuelCardNumber: 'FC-IOCL-2233'
    });

    // First tank fill at 30,000 km
    const tx1 = logFuelCardTransaction(vehicle, {
      fuelCardNumber: 'FC-IOCL-2233',
      unitsDispensed: 80,
      unitRateInr: 92.5,
      odometerKm: 30000,
      dispenserStation: 'Campus IOCL Depot'
    });
    vehicle = tx1.vehicle;

    // Second fill at 30,160 km with 80 liters (observed = 160 km / 80 L = 2.0 km/L)
    // 2.0 km/L is significantly below 4.5 * 0.75 = 3.375 km/L (Anomaly!)
    const tx2 = logFuelCardTransaction(vehicle, {
      fuelCardNumber: 'FC-IOCL-2233',
      unitsDispensed: 80,
      unitRateInr: 92.5,
      odometerKm: 30160,
      dispenserStation: 'City Highroad Bunk'
    });

    expect(tx2.hasEfficiencyAnomaly).toBe(true);
    expect(tx2.observedEfficiency).toBe(2.0);
    expect(tx2.transaction.totalAmountInr).toBe(7400);
    expect(tx2.vehicle.fuelTransactions.length).toBe(2);
  });

  // Test 6: Campus Transport Fleet Cryptographic Seal & CSV Ledger Export
  it('should verify transport SHA-256 seal integrity and produce valid CSV export', () => {
    const vehicle = createFleetVehicle({
      registrationNumber: 'KA-01-AM-9900',
      chassisNumber: 'WBA33AY899AMB9900',
      category: 'AMBULANCE_EMERGENCY',
      fuelType: 'DIESEL',
      seatingCapacity: 3,
      initialOdometerKm: 5000,
      ratedEfficiencyKmPerUnit: 12.0,
      pucExpiryDate: '2027-12-31',
      fitnessExpiryDate: '2027-12-31',
      insuranceExpiryDate: '2027-12-31',
      assignedDriver: 'Dr. Joseph',
      assignedDriverLicense: 'DL-KA-2015-0011223'
    });

    const seal1 = generateTransportSeal(vehicle);
    expect(seal1).toBe(vehicle.auditSha256);

    const csv = exportCampusTransportFleetCSV([vehicle]);
    expect(csv).toContain('Vehicle ID,Registration Number,Category');
    expect(csv).toContain('KA-01-AM-9900');
    expect(csv).toContain('AMBULANCE_EMERGENCY');
    expect(csv).toContain(seal1);
  });

  // Test 7: Consultancy Project Creation & Token Formatting
  it('should create a consultancy project with correct token, SAC 9983, and milestones', () => {
    const project = createConsultancyProject({
      projectTitle: 'Smart Grid Demand-Side Response Optimization',
      leadFacultyId: 'FAC-EE-2015-019',
      leadFacultyName: 'Dr. Radhakrishnan',
      department: 'Electrical Engineering',
      facultyAnnualGrossSalaryInr: 2500000,
      clientOrganization: 'Schneider Electric India Pvt Ltd',
      clientGstin: '29AAACS1234F1Z1',
      clientPan: 'AAACS1234F',
      clientAddress: 'Whitefield, Bangalore',
      consultancyType: 'CORPORATE_R_AND_D',
      mouExecutionDate: '2026-02-01',
      expectedDischargeDate: '2026-09-30',
      milestonesData: [
        {
          title: 'Milestone 1: Mathematical formulation',
          deliverableDescription: 'Optimal dispatch model',
          targetCompletionDate: '2026-04-30',
          baseAmountInr: 400000
        },
        {
          title: 'Milestone 2: Real-time API integration',
          deliverableDescription: 'Python cloud microservice',
          targetCompletionDate: '2026-08-31',
          baseAmountInr: 600000
        }
      ],
      year: 2026
    });

    expect(project.projectId).toMatch(/^CNS-2026-ELEC-[A-F0-9]{6}$/);
    expect(project.sacCode).toBe(STANDARD_CONSULTANCY_SAC_CODE);
    expect(project.totalContractValueInr).toBe(1000000);
    expect(project.milestones.length).toBe(2);
    expect(project.milestones[0].gstAmountInr).toBe(72000); // 18% of 400,000
    expect(project.milestones[0].totalInvoiceAmountInr).toBe(472000);
    expect(project.auditSha256).toBeDefined();
  });

  // Test 8: Statutory GST 18% Tax Invoice Formulation
  it('should raise GST 18% tax invoice for a milestone and generate invoice number', () => {
    const project = createConsultancyProject({
      projectTitle: 'Structural Dynamic Testing of Composite Wing Spars',
      leadFacultyId: 'FAC-AERO-2018-032',
      leadFacultyName: 'Prof. Anirudh Rao',
      department: 'Aerospace Engineering',
      facultyAnnualGrossSalaryInr: 2600000,
      clientOrganization: 'Hindustan Aeronautics Ltd',
      clientGstin: '29AAACH0001K1Z9',
      clientPan: 'AAACH0001K',
      clientAddress: 'HAL Old Airport Road, Bangalore',
      consultancyType: 'INSTITUTIONAL_FACILITY_TESTING',
      mouExecutionDate: '2026-03-01',
      expectedDischargeDate: '2026-10-31',
      milestonesData: [
        {
          title: 'Phase 1: High-Frequency Resonance Vibration Testing',
          deliverableDescription: 'Strain gauge frequency spectrum report',
          targetCompletionDate: '2026-05-31',
          baseAmountInr: 800000
        }
      ]
    });

    const invoiceRes = raiseMilestoneInvoice(project, 1, '2026-05-20');
    expect(invoiceRes.success).toBe(true);
    expect(invoiceRes.invoiceNumber).toBeDefined();
    expect(invoiceRes.project.status).toBe('MILESTONE_INVOICE_RAISED');
    expect(invoiceRes.project.milestones[0].status).toBe('TAX_INVOICE_ISSUED');
    expect(invoiceRes.project.milestones[0].invoiceDate).toBe('2026-05-20');
  });

  // Test 9: Revenue Sharing Disbursal & Salary Ceiling Safeguard
  it('should disburse revenue under 70/20/10 norms and detect annual gross salary ceiling breach', () => {
    const project = createConsultancyProject({
      projectTitle: 'AI Algorithm Advisory for Autonomous Warehousing',
      leadFacultyId: 'FAC-CS-2017-088',
      leadFacultyName: 'Dr. Neha Saxena',
      department: 'Computer Science',
      facultyAnnualGrossSalaryInr: 1000000, // ₹10 Lakhs Annual Salary
      clientOrganization: 'OmniLogistics India Pvt Ltd',
      clientGstin: '29AAACL9999M1Z8',
      clientPan: 'AAACL9999M',
      clientAddress: 'Electronic City, Bangalore',
      consultancyType: 'CORPORATE_R_AND_D', // Type I -> 70% Faculty, 20% Univ, 10% DDF
      mouExecutionDate: '2026-01-10',
      expectedDischargeDate: '2026-06-30',
      milestonesData: [
        {
          title: 'Milestone 1: Prototype Engine',
          deliverableDescription: 'Deliverable 1',
          targetCompletionDate: '2026-03-31',
          baseAmountInr: 1600000 // 70% = ₹11.2 Lakhs (Exceeds ₹10 Lakhs salary ceiling!)
        }
      ]
    });

    // Raise invoice first
    const invoiced = raiseMilestoneInvoice(project, 1).project;

    // Record payment
    const paymentRes = recordClientPaymentAndDisburse(invoiced, {
      milestoneNumber: 1,
      paymentReceiptRef: 'UTR-HDFC-99128841',
      paymentClearedDate: '2026-04-05'
    });

    expect(paymentRes.success).toBe(true);
    // 70% of 1,600,000 = 1,120,000
    expect(paymentRes.disbursement.facultyPayout).toBe(1120000);
    // 20% of 1,600,000 = 320,000
    expect(paymentRes.disbursement.universityOverhead).toBe(320000);
    // 10% of 1,600,000 = 160,000
    expect(paymentRes.disbursement.ddfPayout).toBe(160000);

    // Ceiling Warning should trigger because ₹11.2L > ₹10L salary
    expect(paymentRes.isCeilingWarning).toBe(true);
    expect(paymentRes.project.status).toBe('PROJECT_COMPLETED_DISCHARGED');
  });

  // Test 10: Faculty Consultancy Cryptographic Seal & CSV Ledger Export
  it('should verify consultancy SHA-256 seal and export valid CSV report', () => {
    const project = createConsultancyProject({
      projectTitle: 'Urban Watershed Drainage & Flood Mitigation Modeling',
      leadFacultyId: 'FAC-CIV-2016-014',
      leadFacultyName: 'Dr. K. Srinivas',
      department: 'Civil Engineering',
      facultyAnnualGrossSalaryInr: 2200000,
      clientOrganization: 'State Disaster Management Authority',
      clientGstin: '29AAAGD8822A1Z4',
      clientPan: 'AAAGD8822A',
      clientAddress: 'Vikas Soudha, Bangalore',
      consultancyType: 'GOVERNMENT_POLICY_CONSULTING',
      mouExecutionDate: '2026-02-15',
      expectedDischargeDate: '2026-11-30',
      milestonesData: [
        {
          title: 'Hydrological GIS Catchment Modeling',
          deliverableDescription: 'Full GIS flood map and recommended culvert dimensions',
          targetCompletionDate: '2026-06-30',
          baseAmountInr: 750000
        }
      ]
    });

    const seal = generateConsultancySeal(project);
    expect(seal).toBe(project.auditSha256);

    const csv = exportFacultyConsultancyLedgerCSV([project]);
    expect(csv).toContain('Project ID,Project Title,Lead Faculty');
    expect(csv).toContain('29AAAGD8822A1Z4');
    expect(csv).toContain('GOVERNMENT_POLICY_CONSULTING');
    expect(csv).toContain(seal);
  });
});
