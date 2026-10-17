-- ============================================================================
-- Migration: 20261018_central_governance_and_faculty_studios.sql
-- Description: Comprehensive production database schemas for Central University
--              Campus Administration (Blocks 1-40) and Faculty Studios.
--              Includes relational tables, JSONB telemetry models, foreign keys,
--              performance indexes, and multi-tenant Row-Level Security (RLS) policies.
-- ============================================================================

-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. CENTRAL NIRF & QS WORLD RANKING TELEMETRY (Block 40)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_nirf_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    ranking_year INT NOT NULL DEFAULT 2026,
    category VARCHAR(32) NOT NULL,
    institution_name TEXT NOT NULL,
    tlr_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    rpc_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    go_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    oi_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    pr_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    composite_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    projected_rank_band VARCHAR(64) NOT NULL DEFAULT 'Top 100',
    official_declared_rank INT,
    qs_bridge JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT_DATA_COLLECTION',
    nodal_officer TEXT NOT NULL,
    public_disclosure_url TEXT,
    last_audit_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    audit_sha256 VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_nirf_inst_year ON public.central_nirf_rankings(institution_id, ranking_year);
ALTER TABLE public.central_nirf_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for NIRF rankings" ON public.central_nirf_rankings
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 2. FACULTY EMERITUS FELLOWSHIP & SUPERANNUATION (Block 40)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_emeritus_fellowships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dossier_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    faculty_name TEXT NOT NULL,
    department TEXT NOT NULL,
    superannuation_date DATE NOT NULL,
    total_service_years INT NOT NULL,
    h_index INT NOT NULL DEFAULT 0,
    phd_scholars_mentored INT NOT NULL DEFAULT 0,
    monthly_honorarium_inr NUMERIC(10, 2) NOT NULL DEFAULT 75000.00,
    contingency_grant_annual_inr NUMERIC(10, 2) NOT NULL DEFAULT 300000.00,
    status VARCHAR(32) NOT NULL DEFAULT 'UNDER_SCRUTINY',
    tenure_start_date DATE,
    tenure_end_date DATE,
    audit_sha256 VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_emeritus_inst ON public.faculty_emeritus_fellowships(institution_id);
ALTER TABLE public.faculty_emeritus_fellowships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Emeritus Fellowships" ON public.faculty_emeritus_fellowships
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 3. CENTRAL DISASTER MANAGEMENT & EVACUATION (Block 39)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_disaster_safety (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    building_zone TEXT NOT NULL,
    hazard_type VARCHAR(32) NOT NULL,
    evacuation_routes JSONB NOT NULL DEFAULT '[]'::jsonb,
    assembly_points JSONB NOT NULL DEFAULT '[]'::jsonb,
    fire_noc_valid_until DATE NOT NULL,
    last_mock_drill_date DATE NOT NULL,
    readiness_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    status VARCHAR(32) NOT NULL DEFAULT 'OPERATIONAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_disaster_inst ON public.central_disaster_safety(institution_id);
ALTER TABLE public.central_disaster_safety ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Disaster Safety" ON public.central_disaster_safety
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 4. FACULTY STARTUP INCUBATION & SEED FUND (Block 39)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_startup_incubation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venture_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    startup_name TEXT NOT NULL,
    faculty_mentor TEXT NOT NULL,
    student_founders JSONB NOT NULL DEFAULT '[]'::jsonb,
    seed_funding_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    equity_stake_pct NUMERIC(5, 2) NOT NULL DEFAULT 5.0,
    incubation_stage VARCHAR(32) NOT NULL DEFAULT 'IDEA_VALIDATION',
    ip_disclosure_number VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_incubation_inst ON public.faculty_startup_incubation(institution_id);
ALTER TABLE public.faculty_startup_incubation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Startup Incubation" ON public.faculty_startup_incubation
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 5. CENTRAL EQUAL OPPORTUNITY CELL (EOC) (Block 38)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_equal_opportunity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    category VARCHAR(32) NOT NULL,
    student_or_staff_id VARCHAR(64) NOT NULL,
    grievance_description TEXT NOT NULL,
    accommodation_requested TEXT,
    remedial_measures JSONB NOT NULL DEFAULT '[]'::jsonb,
    resolution_status VARCHAR(32) NOT NULL DEFAULT 'PENDING_COMMITTEE_REVIEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_eoc_inst ON public.central_equal_opportunity(institution_id);
ALTER TABLE public.central_equal_opportunity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for EOC" ON public.central_equal_opportunity
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 6. FACULTY PROFESSOR OF PRACTICE & ADJUNCT SCHOLAR (Block 38)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_professor_of_practice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholar_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    full_name TEXT NOT NULL,
    industry_domain TEXT NOT NULL,
    years_industry_experience INT NOT NULL,
    appointed_department TEXT NOT NULL,
    honorarium_per_lecture_inr NUMERIC(10, 2) NOT NULL DEFAULT 5000.0,
    tenure_start DATE NOT NULL,
    tenure_end DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE_PRACTITIONER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pop_inst ON public.faculty_professor_of_practice(institution_id);
ALTER TABLE public.faculty_professor_of_practice ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for PoP" ON public.faculty_professor_of_practice
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 7. CENTRAL INTERNAL AUDIT & CAG COMPLIANCE (Block 37)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_internal_audit_cag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_para_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    financial_year VARCHAR(16) NOT NULL,
    audited_department TEXT NOT NULL,
    para_category VARCHAR(32) NOT NULL,
    audit_observation TEXT NOT NULL,
    monetary_variance_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    remedial_action_taken TEXT,
    settlement_status VARCHAR(32) NOT NULL DEFAULT 'UNSETTLED_CAG_OBSERVATION',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cag_audit_inst ON public.central_internal_audit_cag(institution_id);
ALTER TABLE public.central_internal_audit_cag ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for CAG Audit" ON public.central_internal_audit_cag
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 8. CENTRAL ACADEMIC BANK OF CREDITS (ABC) & APAAR ID (Block 36)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_academic_bank_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_apaar_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    student_roll_number VARCHAR(64) NOT NULL,
    student_name TEXT NOT NULL,
    abc_account_id VARCHAR(32) NOT NULL,
    accumulated_credits INT NOT NULL DEFAULT 0,
    digilocker_nad_verified BOOLEAN NOT NULL DEFAULT false,
    transferred_credits INT NOT NULL DEFAULT 0,
    last_sync_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_abc_inst ON public.central_academic_bank_credits(institution_id);
ALTER TABLE public.central_academic_bank_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for ABC" ON public.central_academic_bank_credits
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 9. CENTRAL PROCUREMENT & TENDERS (GeM / GFR) (Block 23)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_procurement_tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    procurement_title TEXT NOT NULL,
    estimated_value_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    procurement_method VARCHAR(32) NOT NULL DEFAULT 'GEM_PORTAL',
    technical_bids_received INT NOT NULL DEFAULT 0,
    selected_vendor TEXT,
    po_number VARCHAR(64),
    gfr_compliance_passed BOOLEAN NOT NULL DEFAULT true,
    tender_status VARCHAR(32) NOT NULL DEFAULT 'TENDER_FLOATED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tenders_inst ON public.central_procurement_tenders(institution_id);
ALTER TABLE public.central_procurement_tenders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Tenders" ON public.central_procurement_tenders
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 10. CENTRAL RIGHT TO INFORMATION (RTI 2005) & CPGRAMS (Block 24)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_rti_grievances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appeal_number VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    applicant_name TEXT NOT NULL,
    date_of_application DATE NOT NULL,
    statutory_deadline DATE NOT NULL,
    query_summary TEXT NOT NULL,
    assigned_cpio TEXT NOT NULL,
    disclosure_exempt_section_8 BOOLEAN NOT NULL DEFAULT false,
    disposal_status VARCHAR(32) NOT NULL DEFAULT 'CPIO_SCRUTINY',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rti_inst ON public.central_rti_grievances(institution_id);
ALTER TABLE public.central_rti_grievances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for RTI" ON public.central_rti_grievances
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 11. CENTRAL GUEST HOUSE & VIP PROTOCOL (Block 25)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_guest_house_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    guest_name TEXT NOT NULL,
    category VARCHAR(32) NOT NULL,
    room_number VARCHAR(16) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    daily_tariff_inr NUMERIC(10, 2) NOT NULL DEFAULT 1500.0,
    booking_status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_guest_house_inst ON public.central_guest_house_bookings(institution_id);
ALTER TABLE public.central_guest_house_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Guest House" ON public.central_guest_house_bookings
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 12. CENTRAL COE EXAMINATION PRINTING & QUESTION CUSTODY (Block 26)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_coe_press_custody (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    custody_dossier_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    exam_session VARCHAR(32) NOT NULL,
    course_code VARCHAR(32) NOT NULL,
    total_sets_received INT NOT NULL DEFAULT 3,
    selected_set_code VARCHAR(8) NOT NULL,
    double_lock_verified BOOLEAN NOT NULL DEFAULT true,
    safe_vault_seal_hash VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'LOCKED_IN_SAFE_VAULT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_coe_press_inst ON public.central_coe_press_custody(institution_id);
ALTER TABLE public.central_coe_press_custody ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for CoE Press" ON public.central_coe_press_custody
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 13. CENTRAL ANNUAL CONVOCATION & DEGREE SCROLLS (Block 27)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_convocation_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scroll_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    student_roll_number VARCHAR(64) NOT NULL,
    degree_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    chancellor_gold_medal BOOLEAN NOT NULL DEFAULT false,
    scroll_seal_sha256 VARCHAR(64) NOT NULL,
    is_conferred BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_convocation_inst ON public.central_convocation_records(institution_id);
ALTER TABLE public.central_convocation_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Convocation" ON public.central_convocation_records
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 14. CENTRAL COLLEGE AFFILIATION & INSPECTION (Block 28)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_college_affiliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_code VARCHAR(32) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    college_name TEXT NOT NULL,
    affiliation_type VARCHAR(32) NOT NULL,
    inspection_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    statutory_deficiencies JSONB NOT NULL DEFAULT '[]'::jsonb,
    affiliation_status VARCHAR(32) NOT NULL DEFAULT 'PROVISIONAL_GRANTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_affiliation_inst ON public.central_college_affiliations(institution_id);
ALTER TABLE public.central_college_affiliations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for College Affiliations" ON public.central_college_affiliations
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 15. CENTRAL STUDENT ELECTIONS & CAMPUS COUNCIL (Block 29)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_student_elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id VARCHAR(64) NOT NULL UNIQUE,
    election_year INT NOT NULL DEFAULT 2026,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    post_title VARCHAR(64) NOT NULL,
    candidates JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_ballots_cast INT NOT NULL DEFAULT 0,
    lyngdoh_committee_compliant BOOLEAN NOT NULL DEFAULT true,
    election_status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULE_NOTIFIED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_elections_inst ON public.central_student_elections(institution_id);
ALTER TABLE public.central_student_elections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Elections" ON public.central_student_elections
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 16. CENTRAL ACADEMIC INTEGRITY & PLAGIARISM TRIBUNAL (Block 30)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_plagiarism_tribunals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dossier_number VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    candidate_id VARCHAR(64) NOT NULL,
    thesis_title TEXT NOT NULL,
    similarity_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    ugc_plagiarism_level INT NOT NULL DEFAULT 0,
    tribunal_ruling VARCHAR(64) NOT NULL DEFAULT 'UNDER_SCRUTINY',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tribunal_inst ON public.central_plagiarism_tribunals(institution_id);
ALTER TABLE public.central_plagiarism_tribunals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Plagiarism Tribunal" ON public.central_plagiarism_tribunals
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 17. CENTRAL SPORTS QUOTA & TOURNAMENT GOVERNANCE (Block 31)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_sports_quota (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    athlete_name TEXT NOT NULL,
    sport_discipline VARCHAR(64) NOT NULL,
    highest_level_represented VARCHAR(32) NOT NULL,
    trials_fitness_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    quota_seat_allocated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sports_inst ON public.central_sports_quota(institution_id);
ALTER TABLE public.central_sports_quota ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Sports Quota" ON public.central_sports_quota
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 18. CENTRAL ALUMNI ENDOWMENT & PHILANTHROPIC CORPUS (Block 32)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.central_alumni_endowments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corpus_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    donor_name TEXT NOT NULL,
    graduating_batch_year INT NOT NULL,
    pledged_amount_inr NUMERIC(14, 2) NOT NULL DEFAULT 0.0,
    endowment_purpose VARCHAR(64) NOT NULL,
    tax_80g_receipt_issued BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_alumni_inst ON public.central_alumni_endowments(institution_id);
ALTER TABLE public.central_alumni_endowments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Alumni Endowments" ON public.central_alumni_endowments
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 19. FACULTY RESEARCH FELLOWSHIP (JRF/SRF) MONTHLY STIPEND (Block 36)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_research_fellowships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fellowship_code VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    fellow_name TEXT NOT NULL,
    funding_agency VARCHAR(32) NOT NULL,
    monthly_stipend_inr NUMERIC(10, 2) NOT NULL DEFAULT 37000.0,
    hra_percentage NUMERIC(5, 2) NOT NULL DEFAULT 27.0,
    monthly_attendance_verified BOOLEAN NOT NULL DEFAULT true,
    disbursement_status VARCHAR(32) NOT NULL DEFAULT 'CLEARED_FOR_PAYMENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fellowship_inst ON public.faculty_research_fellowships(institution_id);
ALTER TABLE public.faculty_research_fellowships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Research Fellowships" ON public.faculty_research_fellowships
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 20. FACULTY IPR & PATENT COMMERCIALIZATION (Block 32)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_ipr_patents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    patent_title TEXT NOT NULL,
    lead_inventor TEXT NOT NULL,
    department TEXT NOT NULL,
    filing_jurisdiction VARCHAR(32) NOT NULL DEFAULT 'INDIA_IPO',
    patent_status VARCHAR(32) NOT NULL DEFAULT 'PUBLISHED',
    commercial_royalty_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_patents_inst ON public.faculty_ipr_patents(institution_id);
ALTER TABLE public.faculty_ipr_patents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for IPR Patents" ON public.faculty_ipr_patents
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 21. FACULTY LABORATORY EQUIPMENT & AMC MAINTENANCE (Block 31)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_equipment_amc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_tag VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    equipment_name TEXT NOT NULL,
    laboratory_location TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    amc_expiry_date DATE NOT NULL,
    calibration_status VARCHAR(32) NOT NULL DEFAULT 'VALID_CALIBRATION',
    annual_contract_cost_inr NUMERIC(10, 2) NOT NULL DEFAULT 45000.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_amc_inst ON public.faculty_equipment_amc(institution_id);
ALTER TABLE public.faculty_equipment_amc ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Equipment AMC" ON public.faculty_equipment_amc
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 22. FACULTY MOOC COURSE & SWAYAM/NPTEL REPOSITORY (Block 30)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_mooc_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mooc_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    course_title TEXT NOT NULL,
    platform VARCHAR(32) NOT NULL DEFAULT 'SWAYAM',
    target_credit_equivalence INT NOT NULL DEFAULT 3,
    video_hours INT NOT NULL DEFAULT 40,
    enrolled_learners INT NOT NULL DEFAULT 0,
    course_status VARCHAR(32) NOT NULL DEFAULT 'LIVE_RECORDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mooc_inst ON public.faculty_mooc_courses(institution_id);
ALTER TABLE public.faculty_mooc_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for MOOC Courses" ON public.faculty_mooc_courses
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 23. FACULTY ACADEMIC BOOK PUBLICATION & REPOSITORY (Block 29)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_academic_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn VARCHAR(32) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    book_title TEXT NOT NULL,
    author_faculty TEXT NOT NULL,
    publisher_name TEXT NOT NULL,
    peer_reviewed BOOLEAN NOT NULL DEFAULT true,
    scopus_indexed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_books_inst ON public.faculty_academic_books(institution_id);
ALTER TABLE public.faculty_academic_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Academic Books" ON public.faculty_academic_books
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 24. FACULTY CONTINUING EDUCATION & ATAL FDP WORKSHOPS (Block 28)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_continuing_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_code VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    workshop_title TEXT NOT NULL,
    coordinator_name TEXT NOT NULL,
    duration_days INT NOT NULL DEFAULT 5,
    participants_count INT NOT NULL DEFAULT 0,
    aicte_atal_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fdp_inst ON public.faculty_continuing_education(institution_id);
ALTER TABLE public.faculty_continuing_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Continuing Education" ON public.faculty_continuing_education
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 25. FACULTY STUDENT PROCTORIAL MENTORSHIP & WELLNESS (Block 27)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_student_mentorship (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentorship_cohort_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    faculty_proctor TEXT NOT NULL,
    assigned_students JSONB NOT NULL DEFAULT '[]'::jsonb,
    last_interaction_date DATE,
    flagged_wellness_concerns INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mentorship_inst ON public.faculty_student_mentorship(institution_id);
ALTER TABLE public.faculty_student_mentorship ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Mentorship" ON public.faculty_student_mentorship
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 26. FACULTY QUESTION PAPER AUTHORING & BLOOM'S TAXONOMY (Block 26)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_question_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_token VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    course_code VARCHAR(32) NOT NULL,
    setter_faculty TEXT NOT NULL,
    blooms_distribution JSONB NOT NULL DEFAULT '{"remembering": 20, "understanding": 30, "applying": 30, "analyzing": 20}'::jsonb,
    moderation_passed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_qp_inst ON public.faculty_question_papers(institution_id);
ALTER TABLE public.faculty_question_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Question Papers" ON public.faculty_question_papers
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 27. FACULTY INTERNATIONAL TRAVEL GRANTS & CPDA (Block 25)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_travel_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grant_request_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    faculty_applicant TEXT NOT NULL,
    conference_name TEXT NOT NULL,
    destination_country TEXT NOT NULL,
    sanctioned_amount_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    cpda_balance_remaining_inr NUMERIC(10, 2) NOT NULL DEFAULT 100000.0,
    approval_status VARCHAR(32) NOT NULL DEFAULT 'DEAN_ACADEMIC_APPROVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_travel_inst ON public.faculty_travel_grants(institution_id);
ALTER TABLE public.faculty_travel_grants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Travel Grants" ON public.faculty_travel_grants
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 28. FACULTY ACADEMIC AUDIT & PEER TEACHING OBSERVATION (Block 24)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_academic_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    auditee_faculty TEXT NOT NULL,
    peer_observer TEXT NOT NULL,
    course_name TEXT NOT NULL,
    pedagogical_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    feedback_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_acad_audit_inst ON public.faculty_academic_audits(institution_id);
ALTER TABLE public.faculty_academic_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Academic Audits" ON public.faculty_academic_audits
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 29. FACULTY PURCHASE REQUISITIONS & ASSET INWARD (Block 23)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_department_requisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indent_number VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    requesting_faculty TEXT NOT NULL,
    department TEXT NOT NULL,
    item_description TEXT NOT NULL,
    estimated_cost_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    gem_product_id VARCHAR(64),
    hod_approval_status VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_requisitions_inst ON public.faculty_department_requisitions(institution_id);
ALTER TABLE public.faculty_department_requisitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Department Requisitions" ON public.faculty_department_requisitions
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );

-- ============================================================================
-- 30. FACULTY OUTCOME-BASED SYLLABUS & LESSON PLANS (Block 6)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faculty_syllabi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    syllabus_code VARCHAR(64) NOT NULL UNIQUE,
    institution_id VARCHAR(64) NOT NULL DEFAULT 'inst-apex-001',
    course_id VARCHAR(64) NOT NULL,
    course_title TEXT NOT NULL,
    faculty_id VARCHAR(64) NOT NULL,
    lecture_hours INT NOT NULL DEFAULT 45,
    tutorial_hours INT NOT NULL DEFAULT 15,
    practical_hours INT NOT NULL DEFAULT 30,
    credit_structure VARCHAR(16) NOT NULL DEFAULT '3-1-2',
    learning_outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
    delivery_plan JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_syllabi_inst ON public.faculty_syllabi(institution_id);
ALTER TABLE public.faculty_syllabi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for Syllabi" ON public.faculty_syllabi
    FOR ALL USING (
        auth.role() = 'authenticated' OR auth.role() = 'service_role' OR auth.role() = 'anon'
    );
