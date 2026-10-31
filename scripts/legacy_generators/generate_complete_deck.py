import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    BG_DARK = RGBColor(11, 15, 25)         # Deep slate navy #0B0F19
    CARD_BG = RGBColor(24, 33, 47)         # Slate card #18212F
    CARD_BORDER = RGBColor(51, 65, 85)     # #334155
    TEXT_LIGHT = RGBColor(248, 250, 252)   # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)   # #94A3B8
    ACCENT_BLUE = RGBColor(56, 189, 248)   # Sky blue #38BDF8
    ACCENT_INDIGO = RGBColor(129, 140, 248)# Indigo #818CF8
    STATUS_GREEN = RGBColor(16, 185, 129)  # Emerald #10B981
    STATUS_AMBER = RGBColor(245, 158, 11)  # Amber #F59E0B

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="PINIT CAREER OS • SHAREHOLDER PRESENTATION"):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.7), Inches(0.3))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        p_c = tf_c.paragraphs[0]
        p_c.text = category_text.upper()
        p_c.font.size = Pt(10)
        p_c.font.bold = True
        p_c.font.color.rgb = ACCENT_BLUE

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.7), Inches(0.6))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(21)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_LIGHT

    # =========================================================================
    # SLIDE 1: Executive Strategy: Career Accelerator Packages & Program Flow
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)
    add_header(s1, "Career Accelerator Packages: Program Flow & Market Strategy", "Executive Portfolio Blueprint")

    b1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.3), Inches(11.733), Inches(0.45))
    b1.fill.solid()
    b1.fill.fore_color.rgb = RGBColor(30, 41, 59)
    b1.line.color.rgb = ACCENT_BLUE
    btf1 = b1.text_frame
    btf1.margin_top = Inches(0.09)
    bp1 = btf1.paragraphs[0]
    bp1.text = "🎯 Core Product Thesis: 1 Training Bundle  +  1 Portfolio Project  +  1 Simulated Internship Program"
    bp1.font.size = Pt(11.5)
    bp1.font.bold = True
    bp1.font.color.rgb = TEXT_LIGHT
    bp1.alignment = PP_ALIGN.CENTER

    pillars_s1 = [
        ("1. Training Bundle", "Structured curriculum matched to 1, 3, 6, or 9-month package duration. Covers core theoretical foundations, interactive coding, and architectural best practices.", ACCENT_BLUE),
        ("2. Portfolio Project", "One real-world, production-style capstone project built by the learner to demonstrate tangible technical or business capabilities.", ACCENT_INDIGO),
        ("3. Simulated Internship", "Supervised, project-based work simulation replicating enterprise environments with role-specific tasks, sprint deadlines, and senior code reviews.", STATUS_AMBER),
        ("4. Career Portfolio & Proof", "Publicly verifiable digital credentials backed by project source code, documentation, and completion audits for employer hiring validation.", STATUS_GREEN)
    ]
    card_w = Inches(2.78)
    for i, (title, desc, col) in enumerate(pillars_s1):
        x = Inches(0.8) + i * (card_w + Inches(0.2))
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.95), card_w, Inches(4.0))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = col
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_right = Inches(0.2)
        ctf.margin_top = Inches(0.25)
        cp1 = ctf.paragraphs[0]
        cp1.text = title
        cp1.font.size = Pt(13)
        cp1.font.bold = True
        cp1.font.color.rgb = col
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.size = Pt(10)
        cp2.font.color.rgb = TEXT_LIGHT
        cp2.space_before = Pt(12)

    # Note at bottom
    nb = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.85))
    nb.fill.solid()
    nb.fill.fore_color.rgb = RGBColor(15, 23, 42)
    nb.line.color.rgb = CARD_BORDER
    ntf = nb.text_frame
    ntf.word_wrap = True
    ntf.margin_left = Inches(0.25)
    ntf.margin_top = Inches(0.12)
    np1 = ntf.paragraphs[0]
    np1.text = "📌 Commercial Clarification for Investors & Partners:"
    np1.font.size = Pt(9.5)
    np1.font.bold = True
    np1.font.color.rgb = ACCENT_BLUE
    np2 = ntf.add_paragraph()
    np2.text = "The simulated internship is a rigorous educational work-simulation program that bridges the academic gap. It is marketed transparently as career preparation and hands-on experience, eliminating placement liabilities while delivering unmatched student confidence."
    np2.font.size = Pt(9)
    np2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 2: Master Course Names — The 37 Core Programs (1 to 37)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "Master Course Catalog: The 37 Foundational Programs", "Official Course Roster (1–37)")

    b2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.3), Inches(11.733), Inches(0.42))
    b2.fill.solid()
    b2.fill.fore_color.rgb = RGBColor(30, 41, 59)
    b2.line.color.rgb = ACCENT_INDIGO
    btf2 = b2.text_frame
    btf2.margin_top = Inches(0.08)
    bp2 = btf2.paragraphs[0]
    bp2.text = "📚 37 Comprehensive Career Mastercourses Spanning Engineering, Cloud, Systems & Commerce"
    bp2.font.size = Pt(11)
    bp2.font.bold = True
    bp2.font.color.rgb = TEXT_LIGHT
    bp2.alignment = PP_ALIGN.CENTER

    c_cols = [
        ("Core Engineering & Stacks", [
            "1. Full-Stack Python",
            "2. Full-Stack React",
            "3. Node.js Backend",
            "4. Database Engineering",
            "5. SRE/DevOps",
            "6. Excel",
            "7. Accounting",
            "8. Business Operations",
            "9. HTML & CSS",
            "10. JavaScript Fundamentals"
        ]),
        ("Programming & Core CS", [
            "11. TypeScript",
            "12. Python Programming Fundamentals",
            "13. Object-Oriented Programming",
            "14. Data Structures & Algorithms",
            "15. Git & GitHub",
            "16. Linux Fundamentals",
            "17. Networking Fundamentals",
            "18. Operating Systems",
            "19. Software Engineering Principles"
        ]),
        ("APIs, Cloud & DevOps", [
            "20. REST API Development",
            "21. Authentication & Authorization",
            "22. Testing & Quality Assurance",
            "23. CI/CD Engineering",
            "24. Cloud Computing",
            "25. Docker & Containerization",
            "26. Kubernetes",
            "27. Infrastructure as Code",
            "28. System Design"
        ]),
        ("Data, Analytics & Business", [
            "29. Microservices Architecture",
            "30. Data Engineering",
            "31. Data Analytics",
            "32. SQL & Database Design",
            "33. Financial Accounting",
            "34. Management Accounting",
            "35. Business Analytics",
            "36. Project Management",
            "37. Business Communication"
        ])
    ]
    col_w2 = Inches(2.78)
    for i, (col_head, course_list) in enumerate(c_cols):
        x = Inches(0.8) + i * (col_w2 + Inches(0.2))
        box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.85), col_w2, Inches(5.15))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = CARD_BORDER
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.18)
        tf.margin_top = Inches(0.18)
        ph = tf.paragraphs[0]
        ph.text = col_head
        ph.font.size = Pt(11)
        ph.font.bold = True
        ph.font.color.rgb = ACCENT_BLUE

        for crs in course_list:
            p = tf.add_paragraph()
            p.text = crs
            p.font.size = Pt(8.5)
            p.font.color.rgb = TEXT_LIGHT
            p.space_before = Pt(3.5)

    # =========================================================================
    # SLIDE 3: Master Project Titles & Internship Role Titles (1 to 37)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "Master Project Titles & Matching Internship Roles", "Role-Based Practical Specialization (1–37)")

    # 2 Big Columns: Left = 37 Projects, Right = 37 Internships
    col_w3 = Inches(5.7)
    
    # Left: Projects
    box_p = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), col_w3, Inches(5.7))
    box_p.fill.solid()
    box_p.fill.fore_color.rgb = CARD_BG
    box_p.line.color.rgb = CARD_BORDER
    tf_p = box_p.text_frame
    tf_p.word_wrap = True
    tf_p.margin_left = tf_p.margin_right = Inches(0.2)
    tf_p.margin_top = Inches(0.15)
    pp_h = tf_p.paragraphs[0]
    pp_h.text = "🛠️ 37 Production Portfolio Project Titles"
    pp_h.font.size = Pt(12)
    pp_h.font.bold = True
    pp_h.font.color.rgb = ACCENT_BLUE

    projects_sample = [
        "1. Personal Portfolio Website", "2. Full-Stack Task Management App", "3. E-Commerce Web Application",
        "4. Student Management System", "5. Employee Management System", "6. Inventory Management System",
        "7. Library Management System", "8. Expense Tracker Application", "9. Personal Finance Dashboard",
        "10. Sales Analytics Dashboard", "11. CRM System", "12. Learning Management System (LMS)",
        "13. Job Portal Application", "14. Online Appointment Booking", "15. Real-Time Chat Application",
        "16. REST API Development", "17. Auth & Authorization System", "18. Blog Management Platform",
        "19. Food Delivery Application", "20. Online Examination System", "21. Hotel Reservation System",
        "22. Payroll Management System", "23. Accounting & Financial Reporting", "24. Business Operations Dashboard",
        "25. Excel Business Analytics Dashboard", "26. Data Cleaning & Reporting", "27. Database Design & Optimization",
        "28. Automated Testing Framework", "29. CI/CD Pipeline Implementation", "30. Dockerized App Deployment",
        "31. Kubernetes Deployment Project", "32. Cloud Infrastructure Automation", "33. Infrastructure Monitoring Dashboard",
        "34. Log Management & Alerting System", "35. Microservices-Based Application", "36. ETL Data Pipeline",
        "37. End-to-End Career Accelerator Capstone"
    ]
    # Split projects into 2 mini subcolumns in text
    p_half = tf_p.add_paragraph()
    p_half.text = "Sample Mapping (Full Roster Embedded):"
    p_half.font.size = Pt(8.5)
    p_half.font.bold = True
    p_half.font.color.rgb = ACCENT_INDIGO
    p_half.space_before = Pt(4)
    for p_item in projects_sample[:18]:
        p = tf_p.add_paragraph()
        p.text = p_item
        p.font.size = Pt(7.5)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(1.5)
    p_more = tf_p.add_paragraph()
    p_more.text = "... Plus Projects 19 to 37 covering Cloud, Microservices, and Capstones."
    p_more.font.size = Pt(7.5)
    p_more.font.color.rgb = TEXT_MUTED
    p_more.space_before = Pt(3)

    # Right: Internships
    box_i = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.35), col_w3, Inches(5.7))
    box_i.fill.solid()
    box_i.fill.fore_color.rgb = CARD_BG
    box_i.line.color.rgb = CARD_BORDER
    tf_i = box_i.text_frame
    tf_i.word_wrap = True
    tf_i.margin_left = tf_i.margin_right = Inches(0.2)
    tf_i.margin_top = Inches(0.15)
    pi_h = tf_i.paragraphs[0]
    pi_h.text = "💼 37 Industry-Aligned Internship Role Titles"
    pi_h.font.size = Pt(12)
    pi_h.font.bold = True
    pi_h.font.color.rgb = STATUS_GREEN

    internships_sample = [
        "1. Full-Stack Python Developer Intern", "2. Full-Stack React Developer Intern", "3. Node.js Backend Developer Intern",
        "4. Database Engineering Intern", "5. SRE/DevOps Engineer Intern", "6. Excel & MIS Analyst Intern",
        "7. Accounting Intern", "8. Business Operations Intern", "9. Frontend Developer Intern",
        "10. Backend Developer Intern", "11. Software Development Intern", "12. Web Application Developer Intern",
        "13. API Development Intern", "14. Software QA & Testing Intern", "15. Automation Testing Intern",
        "16. DevOps Automation Intern", "17. Cloud Engineering Intern", "18. Site Reliability Engineering Intern",
        "19. Infrastructure Engineering Intern", "20. Data Engineering Intern", "21. Data Analyst Intern",
        "22. Business Intelligence Intern", "23. Financial Analyst Intern", "24. Accounting Operations Intern",
        "25. Management Reporting Intern", "26. Business Analyst Intern", "27. Project Management Intern",
        "28. Product Operations Intern", "29. Technical Support Intern", "30. IT Operations Intern",
        "31. Database Administrator Intern", "32. Systems Administration Intern", "33. Application Support Intern",
        "34. Software Integration Intern", "35. Technical Documentation Intern", "36. Quality Assurance Intern",
        "37. Career Accelerator Capstone Intern"
    ]
    i_sub = tf_i.add_paragraph()
    i_sub.text = "Sample Role Titles (Full Roster Embedded):"
    i_sub.font.size = Pt(8.5)
    i_sub.font.bold = True
    i_sub.font.color.rgb = ACCENT_INDIGO
    i_sub.space_before = Pt(4)
    for i_item in internships_sample[:18]:
        p = tf_i.add_paragraph()
        p.text = i_item
        p.font.size = Pt(7.5)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(1.5)
    i_more = tf_i.add_paragraph()
    i_more.text = "... Plus Roles 19 to 37 covering Cloud, Data Eng, BI, and Capstones."
    i_more.font.size = Pt(7.5)
    i_more.font.color.rgb = TEXT_MUTED
    i_more.space_before = Pt(3)

    # =========================================================================
    # SLIDE 4: Commercial Packages — 1-Month & 3-Month Programs
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "Commercial Packages: 1-Month Starters & 3-Month Foundations", "Commercial Monetization Catalog")

    # Left: 1-Month Packages (P01 to P03)
    p1_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(5.7), Inches(5.6))
    p1_box.fill.solid()
    p1_box.fill.fore_color.rgb = CARD_BG
    p1_box.line.color.rgb = ACCENT_BLUE
    tf_p1 = p1_box.text_frame
    tf_p1.word_wrap = True
    tf_p1.margin_left = tf_p1.margin_right = Inches(0.25)
    tf_p1.margin_top = Inches(0.2)
    h1 = tf_p1.paragraphs[0]
    h1.text = "1-Month Career Starters (Packages P01–P03)"
    h1.font.size = Pt(13)
    h1.font.bold = True
    h1.font.color.rgb = ACCENT_BLUE
    d1 = tf_p1.add_paragraph()
    d1.text = "Best for beginners, students exploring careers, and rapid practical upskilling."
    d1.font.size = Pt(9.5)
    d1.font.color.rgb = TEXT_MUTED
    d1.space_before = Pt(4)

    pkg_1m = [
        ("P01: Excel Career Starter", "Training: Excel Fundamentals", "Project: Business Analytics Dashboard", "Internship: Excel & MIS Analyst Intern"),
        ("P02: Accounting Career Starter", "Training: Accounting & Taxation", "Project: Financial Reporting System", "Internship: Accounting Intern"),
        ("P03: Business Ops Starter", "Training: Business Operations", "Project: Operations KPI Dashboard", "Internship: Business Operations Intern")
    ]
    for p_title, trn, prj, intn in pkg_1m:
        p = tf_p1.add_paragraph()
        p.text = p_title
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(10)
        for sub in [trn, prj, intn]:
            ps = tf_p1.add_paragraph()
            ps.text = "• " + sub
            ps.font.size = Pt(8.5)
            ps.font.color.rgb = TEXT_MUTED

    # Right: 3-Month Packages (P04 to P10)
    p3_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.35), Inches(5.7), Inches(5.6))
    p3_box.fill.solid()
    p3_box.fill.fore_color.rgb = CARD_BG
    p3_box.line.color.rgb = STATUS_GREEN
    tf_p3 = p3_box.text_frame
    tf_p3.word_wrap = True
    tf_p3.margin_left = tf_p3.margin_right = Inches(0.25)
    tf_p3.margin_top = Inches(0.2)
    h3 = tf_p3.paragraphs[0]
    h3.text = "3-Month Job-Ready Foundations (Packages P04–P10)"
    h3.font.size = Pt(13)
    h3.font.bold = True
    h3.font.color.rgb = STATUS_GREEN
    d3 = tf_p3.add_paragraph()
    d3.text = "Best for learners committing to one core technical or business specialization."
    d3.font.size = Pt(9.5)
    d3.font.color.rgb = TEXT_MUTED
    d3.space_before = Pt(4)

    pkg_3m = [
        ("P04: Full-Stack Python", "Task Management App", "Python Developer Intern"),
        ("P05: Full-Stack React", "Responsive Web App", "Frontend Developer Intern"),
        ("P06: Node.js Backend", "Production REST API", "Backend Developer Intern"),
        ("P07: Database Engineering", "Database Design & Optim", "Database Engineering Intern"),
        ("P08: Excel & MIS Pro", "Automated Reporting Dashboard", "Excel & MIS Analyst Intern"),
        ("P09: Accounting Operations", "Payroll Management System", "Accounting Operations Intern"),
        ("P10: Business Operations", "Inventory Management System", "Business Operations Intern")
    ]
    for p_title, prj, intn in pkg_3m:
        p = tf_p3.add_paragraph()
        p.text = f"• {p_title}: {prj} ➔ {intn}"
        p.font.size = Pt(8.5)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(5)

    # =========================================================================
    # SLIDE 5: Commercial Packages — 6-Month & 9-Month Programs
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "Commercial Packages: 6-Month Accelerators & 9-Month Pathways", "Advanced Career Pathways")

    # Left: 6-Month Packages (P11 to P18)
    p6_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(5.7), Inches(5.6))
    p6_box.fill.solid()
    p6_box.fill.fore_color.rgb = CARD_BG
    p6_box.line.color.rgb = ACCENT_INDIGO
    tf_p6 = p6_box.text_frame
    tf_p6.word_wrap = True
    tf_p6.margin_left = tf_p6.margin_right = Inches(0.25)
    tf_p6.margin_top = Inches(0.2)
    h6 = tf_p6.paragraphs[0]
    h6.text = "6-Month Professional Accelerators (P11–P18)"
    h6.font.size = Pt(13)
    h6.font.bold = True
    h6.font.color.rgb = ACCENT_INDIGO

    pkg_6m = [
        ("P11: Full-Stack Python", "E-Commerce Web Application", "Full-Stack Python Dev Intern"),
        ("P12: Full-Stack React", "Learning Management System", "Frontend Developer Intern"),
        ("P13: Node.js Backend", "Job Portal Backend System", "Backend Developer Intern"),
        ("P14: Database Engineering", "Enterprise DBMS", "Database Engineering Intern"),
        ("P15: SRE / DevOps", "Automated CI/CD Pipeline", "DevOps Engineer Intern"),
        ("P16: Advanced Excel", "Advanced Sales Analytics", "MIS Analyst Intern"),
        ("P17: Accounting Analyst", "Financial Reporting System", "Accounting Analyst Intern"),
        ("P18: Operations Analyst", "Operations Analytics Dashboard", "Business Ops Analyst Intern")
    ]
    for p_title, prj, intn in pkg_6m:
        p = tf_p6.add_paragraph()
        p.text = f"• {p_title}: {prj} ➔ {intn}"
        p.font.size = Pt(8.5)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(4.5)

    # Right: 9-Month Packages (P19 to P30)
    p9_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.35), Inches(5.7), Inches(5.6))
    p9_box.fill.solid()
    p9_box.fill.fore_color.rgb = CARD_BG
    p9_box.line.color.rgb = STATUS_AMBER
    tf_p9 = p9_box.text_frame
    tf_p9.word_wrap = True
    tf_p9.margin_left = tf_p9.margin_right = Inches(0.25)
    tf_p9.margin_top = Inches(0.2)
    h9 = tf_p9.paragraphs[0]
    h9.text = "9-Month Future-Ready Pathways (P19–P30)"
    h9.font.size = Pt(13)
    h9.font.bold = True
    h9.font.color.rgb = STATUS_AMBER

    pkg_9m = [
        ("P19: Python + React", "Full-Stack E-Commerce Platform", "Full-Stack Developer Intern"),
        ("P20: Python + Node.js", "Multi-Service Web Application", "Backend Engineering Intern"),
        ("P21: Python + Databases", "Data-Driven Management Platform", "Software & DB Engineer Intern"),
        ("P22: React + Node.js", "Full-Stack Job Portal", "Full-Stack Developer Intern"),
        ("P24: Full-Stack + SRE/DevOps", "Cloud App with CI/CD", "DevOps & Cloud Intern"),
        ("P25: Python + DB + DevOps", "Cloud Data Management Platform", "Cloud & Backend Intern"),
        ("P26: React + Node + DB", "SaaS Business Application", "Full-Stack Software Intern"),
        ("P28: Excel + Acct + Ops", "Integrated Finance & Ops Dashboard", "Finance & Operations Intern")
    ]
    for p_title, prj, intn in pkg_9m:
        p = tf_p9.add_paragraph()
        p.text = f"• {p_title}: {prj} ➔ {intn}"
        p.font.size = Pt(8.5)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(4.5)

    # =========================================================================
    # SLIDE 6: Go-to-Market Strategy: Top 5 Flagships to Launch First
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "Go-to-Market Strategy: Top 5 Flagships to Launch First", "Immediate Revenue Engine")

    b6 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.3), Inches(11.733), Inches(0.42))
    b6.fill.solid()
    b6.fill.fore_color.rgb = RGBColor(30, 41, 59)
    b6.line.color.rgb = STATUS_GREEN
    btf6 = b6.text_frame
    btf6.margin_top = Inches(0.08)
    bp6 = btf6.paragraphs[0]
    bp6.text = "🚀 Focusing on 5 High-Demand Flagship Products Before Expanding All Combinations"
    bp6.font.size = Pt(11)
    bp6.font.bold = True
    bp6.font.color.rgb = TEXT_LIGHT
    bp6.alignment = PP_ALIGN.CENTER

    flagships = [
        ("1. Full-Stack Developer", "6 or 9 Months", "Full-Stack Python + Full-Stack React (+ Node.js option)", "Full-Stack E-Commerce Platform", "Full-Stack Developer Intern", STATUS_GREEN),
        ("2. Cloud & DevOps", "6 or 9 Months", "SRE/DevOps + Database Engineering + Full-Stack Development", "Cloud-Deployed App with CI/CD", "DevOps & Cloud Engineering Intern", ACCENT_BLUE),
        ("3. Data & Business Analytics", "3 or 6 Months", "Excel + Database Engineering (+ Business Ops option)", "Integrated Business Analytics Dashboard", "Data & Business Analyst Intern", ACCENT_INDIGO),
        ("4. Finance & Operations", "3 or 9 Months", "Accounting + Excel + Business Operations", "Automated Financial Reporting & Ops Dashboard", "Finance & Operations Intern", STATUS_AMBER),
        ("5. Backend & Databases", "6 or 9 Months", "Node.js Backend + Database Engineering (+ DevOps)", "Scalable SaaS Backend Platform", "Backend & Database Engineering Intern", RGBColor(236, 72, 153))
    ]
    fw = Inches(2.2)
    for i, (name, dur, bundle, prj, intn, col) in enumerate(flagships):
        x = Inches(0.8) + i * (fw + Inches(0.18))
        fb = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.85), fw, Inches(5.15))
        fb.fill.solid()
        fb.fill.fore_color.rgb = CARD_BG
        fb.line.color.rgb = col
        ftf = fb.text_frame
        ftf.word_wrap = True
        ftf.margin_left = ftf.margin_right = Inches(0.15)
        ftf.margin_top = Inches(0.2)

        fp1 = ftf.paragraphs[0]
        fp1.text = name
        fp1.font.size = Pt(11.5)
        fp1.font.bold = True
        fp1.font.color.rgb = col

        fp_dur = ftf.add_paragraph()
        fp_dur.text = f"Duration: {dur}"
        fp_dur.font.size = Pt(8.5)
        fp_dur.font.bold = True
        fp_dur.font.color.rgb = TEXT_LIGHT
        fp_dur.space_before = Pt(3)

        fp_b = ftf.add_paragraph()
        fp_b.text = "Training Bundle:"
        fp_b.font.size = Pt(8)
        fp_b.font.bold = True
        fp_b.font.color.rgb = ACCENT_BLUE
        fp_b.space_before = Pt(8)
        fp_bt = ftf.add_paragraph()
        fp_bt.text = bundle
        fp_bt.font.size = Pt(8)
        fp_bt.font.color.rgb = TEXT_MUTED

        fp_p = ftf.add_paragraph()
        fp_p.text = "Portfolio Project:"
        fp_p.font.size = Pt(8)
        fp_p.font.bold = True
        fp_p.font.color.rgb = ACCENT_INDIGO
        fp_p.space_before = Pt(8)
        fp_pt = ftf.add_paragraph()
        fp_pt.text = prj
        fp_pt.font.size = Pt(8)
        fp_pt.font.color.rgb = TEXT_LIGHT

        fp_i = ftf.add_paragraph()
        fp_i.text = "Internship Role:"
        fp_i.font.size = Pt(8)
        fp_i.font.bold = True
        fp_i.font.color.rgb = STATUS_GREEN
        fp_i.space_before = Pt(8)
        fp_it = ftf.add_paragraph()
        fp_it.text = intn
        fp_it.font.size = Pt(8)
        fp_it.font.color.rgb = col

    # =========================================================================
    # SLIDE 7: Program Delivery Timeline & Structure
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "Program Delivery Timeline & Operating Cadence", "Academic & Operational Rhythm")

    # 1-Month Delivery Model
    m1_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(2.5))
    m1_card.fill.solid()
    m1_card.fill.fore_color.rgb = CARD_BG
    m1_card.line.color.rgb = ACCENT_BLUE
    m1_tf = m1_card.text_frame
    m1_tf.word_wrap = True
    m1_tf.margin_left = m1_tf.margin_right = Inches(0.25)
    m1_tf.margin_top = Inches(0.18)

    mp1 = m1_tf.paragraphs[0]
    mp1.text = "The 1-Month Standard Delivery Model (30-Day Intensive)"
    mp1.font.size = Pt(13)
    mp1.font.bold = True
    mp1.font.color.rgb = ACCENT_BLUE

    phases_1m = [
        ("Days 1 to 15: Core Training", "Learn core curriculum, complete daily guided coding sandboxes, and build fundamental technical skills."),
        ("Days 16 to 23: Portfolio Project", "Design, build, and document the designated portfolio project with real-time automated code tests."),
        ("Days 24 to 30: Simulated Internship", "Perform role-based workplace tasks, meet sprint deadlines, submit deliverables, and complete final review.")
    ]
    for ph_title, ph_desc in phases_1m:
        p = m1_tf.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = "• " + ph_title + ": "
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = ph_desc
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_MUTED

    # Multi-Month Delivery Model
    mm_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.05), Inches(11.733), Inches(2.95))
    mm_card.fill.solid()
    mm_card.fill.fore_color.rgb = CARD_BG
    mm_card.line.color.rgb = STATUS_GREEN
    mm_tf = mm_card.text_frame
    mm_tf.word_wrap = True
    mm_tf.margin_left = mm_tf.margin_right = Inches(0.25)
    mm_tf.margin_top = Inches(0.18)

    mmp1 = mm_tf.paragraphs[0]
    mmp1.text = "The 3, 6 & 9-Month Progressive Acceleration Models"
    mmp1.font.size = Pt(13)
    mmp1.font.bold = True
    mmp1.font.color.rgb = STATUS_GREEN

    phases_mm = [
        ("3 & 6-Month Programs: ", "Month 1 establishes core foundations. Middle months focus on advanced implementation, live labs, and capstone development. Final month is dedicated to simulated enterprise tasks, code reviews, and portfolio presentations."),
        ("9-Month Future-Ready Pathways: ", "Months 1–3 deliver the first specialization (e.g. Python). Months 4–6 deliver the complementary specialization (e.g. React/DevOps). Months 7–8 develop the integrated multi-tier capstone. Month 9 concludes with simulated internship validation and career readiness."),
        ("Educational Governance: ", "Continuous evaluation prevents student drop-offs. Proctored checks after every 5 days guarantee genuine student competency.")
    ]
    for ph_t, ph_d in phases_mm:
        p = mm_tf.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = "✔ " + ph_t
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = ph_d
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 8: Flagship Track 1: Full-Stack Python Deep Dive
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "Flagship Track 1: Full-Stack Python & Systems", "Flagship Curriculum Architecture")

    # Reuse earlier slide 2 content
    c8_1 = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.7), Inches(5.6))
    c8_1.fill.solid()
    c8_1.fill.fore_color.rgb = CARD_BG
    c8_1.line.color.rgb = CARD_BORDER
    tf8_1 = c8_1.text_frame
    tf8_1.word_wrap = True
    tf8_1.margin_left = tf8_1.margin_right = tf8_1.margin_top = Inches(0.25)
    p = tf8_1.paragraphs[0]
    p.text = "Non-Technical Business Value"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE
    p2 = tf8_1.add_paragraph()
    p2.text = "Python powers modern AI, data engineering, and enterprise backends. We take learners with zero background and transform them into full-stack software engineers in 30 daily modules."
    p2.font.size = Pt(10)
    p2.font.color.rgb = TEXT_LIGHT
    p2.space_before = Pt(6)

    p3 = tf8_1.add_paragraph()
    p3.text = "Topics Covered:"
    p3.font.size = Pt(11)
    p3.font.bold = True
    p3.font.color.rgb = ACCENT_INDIGO
    p3.space_before = Pt(10)

    topics_py_8 = [
        ("Core Logic: ", "Control flows, math operators, functions, and decision engines."),
        ("Data Structures: ", "Lists, dictionaries, hash tables, and O(1) ledgers."),
        ("OOP Architecture: ", "Classes, encapsulation, and payment gateway engines."),
        ("Web APIs (FastAPI): ", "Connecting mobile/web frontends to databases."),
        ("Databases (SQL): ", "Relational models, queries, and ACID transaction safety.")
    ]
    for b_t, n_t in topics_py_8:
        p = tf8_1.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = "• " + b_t
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = n_t
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_MUTED

    c8_2 = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.6))
    c8_2.fill.solid()
    c8_2.fill.fore_color.rgb = CARD_BG
    c8_2.line.color.rgb = CARD_BORDER
    tf8_2 = c8_2.text_frame
    tf8_2.word_wrap = True
    tf8_2.margin_left = tf8_2.margin_right = tf8_2.margin_top = Inches(0.25)
    p_l = tf8_2.paragraphs[0]
    p_l.text = "Interactive Lab & Flight Simulator"
    p_l.font.size = Pt(13)
    p_l.font.bold = True
    p_l.font.color.rgb = STATUS_GREEN
    lab_points_8 = [
        ("Zero Laptop Setup Friction: ", "Runs 100% in any browser. No broken compilers or installation errors."),
        ("Proctored Assertion Engine: ", "Code is checked against real-world edge cases instantly upon execution."),
        ("Socratic Debugging AI: ", "Guides students to fix bugs with probing questions rather than giving away answers."),
        ("Real Deployment: ", "Students launch live web APIs with shareable URLs to showcase skills.")
    ]
    for b_t, n_t in lab_points_8:
        p = tf8_2.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = "✔ " + b_t
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = n_t
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_MUTED

    f8 = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(5.95), Inches(5.7), Inches(0.8))
    f8.fill.solid()
    f8.fill.fore_color.rgb = RGBColor(15, 23, 42)
    f8.line.color.rgb = STATUS_GREEN
    f8_tf = f8.text_frame
    f8_tf.margin_top = Inches(0.12)
    pf8 = f8_tf.paragraphs[0]
    pf8.text = "CODING STATUS: PYTHON FULL-STACK"
    pf8.font.size = Pt(9)
    pf8.font.bold = True
    pf8.font.color.rgb = STATUS_GREEN
    pf8_2 = f8_tf.add_paragraph()
    pf8_2.text = "Coded: 30 / 30 Days (100% Complete & Tested) | Remaining to Code: 0 Days"
    pf8_2.font.size = Pt(9.5)
    pf8_2.font.color.rgb = TEXT_LIGHT

    # =========================================================================
    # SLIDE 9: Flagship Track 2: Enterprise Web Full-Stack Deep Dive
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "Flagship Track 2: Enterprise Web Full-Stack Engineering", "Consumer Web Architecture")

    c9_1 = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.7), Inches(5.6))
    c9_1.fill.solid()
    c9_1.fill.fore_color.rgb = CARD_BG
    c9_1.line.color.rgb = CARD_BORDER
    tf9_1 = c9_1.text_frame
    tf9_1.word_wrap = True
    tf9_1.margin_left = tf9_1.margin_right = tf9_1.margin_top = Inches(0.25)
    p = tf9_1.paragraphs[0]
    p.text = "The Modern Consumer Web Experience"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE
    p2 = tf9_1.add_paragraph()
    p2.text = "Every high-scale consumer platform—from ride-hailing to banking—runs on modern web technologies. We train students to engineer high-velocity frontends and bulletproof backends."
    p2.font.size = Pt(10)
    p2.font.color.rgb = TEXT_LIGHT
    p2.space_before = Pt(6)

    p3 = tf9_1.add_paragraph()
    p3.text = "Topics Covered:"
    p3.font.size = Pt(11)
    p3.font.bold = True
    p3.font.color.rgb = ACCENT_INDIGO
    p3.space_before = Pt(10)

    topics_web_9 = [
        ("Frontend (React & Next.js): ", "Interactive UI components, state management, and Server-Side Rendering."),
        ("Backend Services (Node.js): ", "Event loops, REST APIs, JSON data pipelines, and request routing."),
        ("Database Modeling (Prisma ORM): ", "Relational schemas, user authentication tables, and caching."),
        ("Real-Time Data (WebSockets): ", "Live bidirectional event streaming for chats and order tracking."),
        ("Security & Payments (Stripe): ", "Encrypted session tokens, cookie security, and automated billing.")
    ]
    for b_t, n_t in topics_web_9:
        p = tf9_1.add_paragraph()
        p.space_before = Pt(4)
        r1 = p.add_run()
        r1.text = "• " + b_t
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = n_t
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_MUTED

    c9_2 = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.6))
    c9_2.fill.solid()
    c9_2.fill.fore_color.rgb = CARD_BG
    c9_2.line.color.rgb = CARD_BORDER
    tf9_2 = c9_2.text_frame
    tf9_2.word_wrap = True
    tf9_2.margin_left = tf9_2.margin_right = tf9_2.margin_top = Inches(0.25)
    p_w = tf9_2.paragraphs[0]
    p_w.text = "Production Capstone Deliverables"
    p_w.font.size = Pt(13)
    p_w.font.bold = True
    p_w.font.color.rgb = STATUS_GREEN
    cap_points_9 = [
        ("High-Throughput API Gateway: ", "Rate limiting algorithms protecting servers from DDoS attacks during flash sales."),
        ("Multi-Tenant Auth Hub: ", "Enterprise role-based security protecting patient and client records."),
        ("Live Collaborative Canvas: ", "Interactive live canvas and chat engine supporting simultaneous users."),
        ("Enterprise E-Commerce Engine: ", "Complete 30-Day capstone featuring inventory locking, shopping carts, and Stripe payments.")
    ]
    for b_t, n_t in cap_points_9:
        p = tf9_2.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = "✔ " + b_t
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = n_t
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = TEXT_MUTED

    f9 = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(5.95), Inches(5.7), Inches(0.8))
    f9.fill.solid()
    f9.fill.fore_color.rgb = RGBColor(15, 23, 42)
    f9.line.color.rgb = STATUS_GREEN
    f9_tf = f9.text_frame
    f9_tf.margin_top = Inches(0.12)
    pf9 = f9_tf.paragraphs[0]
    pf9.text = "CODING STATUS: FULL-STACK REACT & NODE"
    pf9.font.size = Pt(9)
    pf9.font.bold = True
    pf9.font.color.rgb = STATUS_GREEN
    pf9_2 = f9_tf.add_paragraph()
    pf9_2.text = "Coded: 30 / 30 Days (100% Complete & Tested) | Remaining to Code: 0 Days"
    pf9_2.font.size = Pt(9.5)
    pf9_2.font.color.rgb = TEXT_LIGHT

    # =========================================================================
    # SLIDE 10: The Simulated Internship Workplace Architecture
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10)
    add_header(s10, "The Simulated Internship Workplace Architecture", "Enterprise Work-Simulation Engine")

    ov10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(1.1))
    ov10.fill.solid()
    ov10.fill.fore_color.rgb = CARD_BG
    ov10.line.color.rgb = CARD_BORDER
    ov10_tf = ov10.text_frame
    ov10_tf.word_wrap = True
    ov10_tf.margin_left = ov10_tf.margin_right = Inches(0.3)
    ov10_tf.margin_top = Inches(0.15)
    op1 = ov10_tf.paragraphs[0]
    op1.text = "Supervised Role-Based Simulation: Replicating Workplace Responsibilities"
    op1.font.size = Pt(13)
    op1.font.bold = True
    op1.font.color.rgb = ACCENT_BLUE
    op2 = ov10_tf.add_paragraph()
    op2.text = "Learners complete role-specific assignments, follow professional sprint workflows, submit deliverables, and receive feedback. It bridges the critical experience barrier without the legal exposure of employment guarantees."
    op2.font.size = Pt(10)
    op2.font.color.rgb = TEXT_LIGHT

    sim_steps = [
        ("1. Virtual Tech Desk", "Assigned to an engineering squad with an AI Tech Lead and Product Manager. They participate in standups and backlog triage.", ACCENT_BLUE),
        ("2. Real Bug Tickets", "Tasks are dynamically generated business problems (e.g., checkout timeouts, database crashes), preventing copied answers.", ACCENT_INDIGO),
        ("3. Code Reviews & PRs", "Students write code, create Git branches, and submit Pull Requests. Our automated AI conducts line-by-line security and efficiency reviews.", STATUS_AMBER),
        ("4. Verifiable QR Proof", "Upon passing sprints and an oral defense, students earn an employer-verifiable digital credential backed by a public audit link.", STATUS_GREEN)
    ]
    sw = Inches(2.78)
    for i, (title, desc, col) in enumerate(sim_steps):
        x = Inches(0.8) + i * (sw + Inches(0.2))
        sb = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.65), sw, Inches(4.35))
        sb.fill.solid()
        sb.fill.fore_color.rgb = CARD_BG
        sb.line.color.rgb = col
        stf = sb.text_frame
        stf.word_wrap = True
        stf.margin_left = stf.margin_right = Inches(0.2)
        stf.margin_top = Inches(0.25)
        p1 = stf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = col
        p2 = stf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_LIGHT
        p2.space_before = Pt(12)

    # =========================================================================
    # SLIDES 11 to 14: Course Portfolios & Exact Build Status
    # =========================================================================
    def add_course_grid(slide_obj, title, block_num, courses):
        add_bg(slide_obj)
        add_header(slide_obj, title, f"Course Portfolio • Block {block_num} of 4")
        card_w = Inches(5.7)
        card_h = Inches(2.65)
        pos = [(Inches(0.8), Inches(1.4)), (Inches(6.8), Inches(1.4)), (Inches(0.8), Inches(4.3)), (Inches(6.8), Inches(4.3))]

        for idx, c in enumerate(courses):
            if idx >= 4: break
            x, y = pos[idx]
            shape = slide_obj.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, card_w, card_h)
            shape.fill.solid()
            shape.fill.fore_color.rgb = CARD_BG
            is_done = c["coded"] >= 30
            shape.line.color.rgb = STATUS_GREEN if is_done else CARD_BORDER

            tf = shape.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_right = Inches(0.2)
            tf.margin_top = Inches(0.15)
            tf.margin_bottom = Inches(0.1)

            p0 = tf.paragraphs[0]
            p0.text = f"{c['num']}. {c['title']}"
            p0.font.size = Pt(11)
            p0.font.bold = True
            p0.font.color.rgb = ACCENT_BLUE

            p1 = tf.add_paragraph()
            r1 = p1.add_run()
            r1.text = "What It Is: "
            r1.font.bold = True
            r1.font.size = Pt(8.5)
            r1.font.color.rgb = TEXT_MUTED
            r2 = p1.add_run()
            r2.text = c["explanation"]
            r2.font.size = Pt(8.5)
            r2.font.color.rgb = TEXT_LIGHT
            p1.space_before = Pt(2.5)

            p2 = tf.add_paragraph()
            r3 = p2.add_run()
            r3.text = "Topics We Teach: "
            r3.font.bold = True
            r3.font.size = Pt(8.5)
            r3.font.color.rgb = ACCENT_INDIGO
            r4 = p2.add_run()
            r4.text = c["topics"]
            r4.font.size = Pt(8.5)
            r4.font.color.rgb = TEXT_LIGHT
            p2.space_before = Pt(2.5)

            p3 = tf.add_paragraph()
            p3.space_before = Pt(5)
            r_st = p3.add_run()
            rem = max(0, 30 - c["coded"])
            status_txt = f"Coded: {c['coded']} / 30 Days ({int(c['coded']/30*100)}% Complete)  |  Remaining to Code: {rem} Days"
            r_st.text = "⚡ Build Status: " + status_txt
            r_st.font.bold = True
            r_st.font.size = Pt(9)
            r_st.font.color.rgb = STATUS_GREEN if is_done else STATUS_AMBER

    # SLIDE 11: Core Engineering & Stacks
    s11 = prs.slides.add_slide(blank_layout)
    courses_11 = [
        {"num": 4, "title": "Java Fundamentals & Core Logic", "explanation": "Industrial programming workhorse running global banking and enterprise legacy systems.", "topics": "Conditionals, OOP inheritance, garbage collection, collections framework, and multithreading.", "coded": 17},
        {"num": 6, "title": "Database Engineering & Query Performance", "explanation": "The secure digital vault where all customer profiles and financial ledgers are stored.", "topics": "Relational SQL, index B-trees, ACID transactions, connection pools, and query execution plans.", "coded": 30},
        {"num": 10, "title": "Cloud Native Architectures (AWS)", "explanation": "Renting infinite supercomputing power from Amazon data centers instead of physical office servers.", "topics": "Virtual servers (EC2), serverless Lambda functions, S3 storage buckets, and API gateways.", "coded": 5},
        {"num": 11, "title": "DevOps & CI/CD Pipeline Automation", "explanation": "The automated factory assembly line that tests, packages, and deploys software with zero errors.", "topics": "Docker containerization, GitHub Actions workflows, Kubernetes clusters, and zero-downtime rollouts.", "coded": 30}
    ]
    add_course_grid(s11, "Course Portfolio: Core Systems & Infrastructure", 1, courses_11)

    # SLIDE 12: Performance & User Experience
    s12 = prs.slides.add_slide(blank_layout)
    courses_12 = [
        {"num": 5, "title": "Data Structures & Algorithmic Optimizations", "explanation": "The mathematical science of organizing data so applications run in split-seconds.", "topics": "Big-O space-time complexity, binary search trees, hash tables, and dynamic programming.", "coded": 30},
        {"num": 8, "title": "UI/UX Design Systems & Visual Frontend", "explanation": "Creating the visual standards and component blueprints that make software intuitive to anyone.", "topics": "Atomic components, WCAG accessibility, typography grids, responsive CSS, and design tokens.", "coded": 30},
        {"num": 9, "title": "Mobile Application Development", "explanation": "Building sleek, native-feel apps for iPhone and Android devices from a unified codebase.", "topics": "React Native, touch gesture handlers, camera/GPS device APIs, and app store deployment.", "coded": 6},
        {"num": 7, "title": "High-Scale Distributed System Design", "explanation": "Architecting systems that never crash even when millions transact at once (like Uber or Amazon).", "topics": "Load balancing, Redis in-memory caches, message queues, database sharding, and fault tolerance.", "coded": 30}
    ]
    add_course_grid(s12, "Course Portfolio: Software Performance & User Interfaces", 2, courses_12)

    # SLIDE 13: AI & Advanced Systems
    s13 = prs.slides.add_slide(blank_layout)
    courses_13 = [
        {"num": 15, "title": "AI Engineering & LLM Integration", "explanation": "Embedding generative AI models (ChatGPT/Claude) directly into company products to automate work.", "topics": "Prompt engineering, Retrieval-Augmented Generation (RAG), vector embeddings, and agent loops.", "coded": 5},
        {"num": 13, "title": "Cybersecurity Principles & Secure Systems", "explanation": "The digital defense shield that protects company networks and customer data from hackers.", "topics": "OWASP Top 10 vulnerabilities, AES encryption, SQL injection defense, and security audits.", "coded": 30},
        {"num": 14, "title": "Quantitative Engineering & Low-Latency Trading", "explanation": "Building the hyper-speed financial software used by Wall Street where trades execute in microseconds.", "topics": "Electronic Limit Order Books (LOB), trade matching engines, VWAP algorithms, and latency physics.", "coded": 5},
        {"num": 3, "title": "Node.js & TypeScript Backend Engineering", "explanation": "The enterprise server technology powering high-concurrency modern apps with strict type safety.", "topics": "Asynchronous event loops, Express middleware, REST APIs, and high-throughput reliability.", "coded": 30}
    ]
    add_course_grid(s13, "Course Portfolio: Artificial Intelligence & High-Scale Systems", 3, courses_13)

    # SLIDE 14: Commerce & Business Operations
    s14 = prs.slides.add_slide(blank_layout)
    courses_14 = [
        {"num": 24, "title": "Digital Accounting & Taxation", "explanation": "Modernizing accounting by replacing manual books with automated ERP software and cloud workflows.", "topics": "Double-entry bookkeeping, Tally Prime ERP, GST tax compliance, and automated payroll runs.", "coded": 30},
        {"num": 29, "title": "E-Commerce & Digital Business", "explanation": "Everything required to launch, run, and scale an online consumer storefront from UX to fulfillment.", "topics": "Storefront design, payment gateway checkout, catalog management, and shipping logistics.", "coded": 30},
        {"num": 31, "title": "Sales, Customer Success & CRM", "explanation": "Finding enterprise buyers, pitching deals, negotiating contracts, and maintaining clients.", "topics": "B2B prospecting, lead qualification (BANT), objection handling, and CRM software management.", "coded": 30},
        {"num": 32, "title": "Operations, Supply Chain & Compliance", "explanation": "Managing the physical movement of materials and manufacturing goods on time with zero waste.", "topics": "Process mapping, inventory control (EOQ/ROP), supplier procurement, and Lean Six Sigma quality.", "coded": 30}
    ]
    add_course_grid(s14, "Course Portfolio: Commerce, Finance & Business Operations", 4, courses_14)

    # =========================================================================
    # SLIDE 15: Financial Summary: Engineering Velocity & Revenue Readiness
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    add_bg(s15)
    add_header(s15, "Engineering Velocity & Immediate Go-to-Market Readiness", "Financial & Commercial Summary")

    kpis_15 = [
        ("12 COURSES", "100% Coded & Live Today", "360 production-grade daily modules with verified tests ready for immediate sales.", STATUS_GREEN),
        ("25 COURSES", "Standardized Architecture", "Complete 30-day syllabi, real-world metaphors, and test criteria formalized.", ACCENT_BLUE),
        ("HIGH CAPITAL EFFICIENCY", "Zero Rework Risk", "Automated test harness enables rapid, deterministic expansion at minimal engineering cost.", ACCENT_INDIGO)
    ]
    kw = Inches(3.7)
    for i, (top_v, sub_v, desc_v, col) in enumerate(kpis_15):
        x = Inches(0.8) + i * (kw + Inches(0.31))
        kb = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.4), kw, Inches(1.8))
        kb.fill.solid()
        kb.fill.fore_color.rgb = CARD_BG
        kb.line.color.rgb = col
        ktf = kb.text_frame
        ktf.word_wrap = True
        ktf.margin_left = ktf.margin_right = Inches(0.2)
        ktf.margin_top = Inches(0.18)
        kp1 = ktf.paragraphs[0]
        kp1.text = top_v
        kp1.font.size = Pt(20)
        kp1.font.bold = True
        kp1.font.color.rgb = col
        kp2 = ktf.add_paragraph()
        kp2.text = sub_v
        kp2.font.size = Pt(11)
        kp2.font.bold = True
        kp2.font.color.rgb = TEXT_LIGHT
        kp2.space_before = Pt(2)
        kp3 = ktf.add_paragraph()
        kp3.text = desc_v
        kp3.font.size = Pt(9.5)
        kp3.font.color.rgb = TEXT_MUTED
        kp3.space_before = Pt(4)

    sb15 = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.45), Inches(11.733), Inches(3.45))
    sb15.fill.solid()
    sb15.fill.fore_color.rgb = CARD_BG
    sb15.line.color.rgb = CARD_BORDER
    s15_tf = sb15.text_frame
    s15_tf.word_wrap = True
    s15_tf.margin_left = s15_tf.margin_right = Inches(0.3)
    s15_tf.margin_top = Inches(0.25)
    sp_h = s15_tf.paragraphs[0]
    sp_h.text = "Shareholder Takeaway: Immediate Commercial Monetization"
    sp_h.font.size = Pt(14)
    sp_h.font.bold = True
    sp_h.font.color.rgb = ACCENT_BLUE

    points_15 = [
        ("Immediate Commercial Launch: ", "We can immediately market and monetize complete 1-Month, 3-Month, and 6-Month career packages using our 12 fully-finished courses (Full-Stack Python, Full-Stack React, Node.js Backend, Database Engineering, SRE/DevOps, Excel, Accounting, and Business Operations)."),
        ("Predictable Engineering Velocity: ", "All 37 mastercourses have their complete 30-day curriculum blueprints, real-world metaphors, and test criteria formalized in master specification files. Expanding remaining days uses our automated testing pipeline with deterministic quality."),
        ("No Content Debt or Redundancy: ", "Unlike other bootcamps that license third-party content, PinIT owns 100% of its curriculum intellectual property (IP), software engines, and automated assessment code.")
    ]
    for b_t, n_t in points_15:
        p = s15_tf.add_paragraph()
        p.space_before = Pt(10)
        r1 = p.add_run()
        r1.text = "✔ " + b_t
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = n_t
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 16: How We Teach: The Proprietary AI Pedagogy Engine
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    add_bg(s16)
    add_header(s16, "How We Teach: The Proprietary AI Pedagogy Engine", "Our Technology Moat")

    sub_bar = s16.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.42))
    sub_bar.fill.solid()
    sub_bar.fill.fore_color.rgb = RGBColor(30, 41, 59)
    sub_bar.line.color.rgb = ACCENT_INDIGO
    sb_tf = sub_bar.text_frame
    sb_tf.margin_top = Inches(0.08)
    sb_p = sb_tf.paragraphs[0]
    sb_p.text = "💡 The Active Learning Cycle: Replacing Passive Video Watching with Interactive Mastery"
    sb_p.font.size = Pt(11)
    sb_p.font.bold = True
    sb_p.font.color.rgb = TEXT_LIGHT
    sb_p.alignment = PP_ALIGN.CENTER

    pillars_16 = [
        ("1. 20-Min AI Avatar Mentor", "A photorealistic AI instructor explains concepts conversationally in plain words. Uses everyday metaphors (e.g. databases as bank vaults) with zero confusing jargon.", ACCENT_BLUE, "Conversational Audio"),
        ("2. Synchronized Visual Stage", "As the avatar speaks, the interactive screen dynamically animates architectural flows, memory registers, state machines, and data pipelines in real-time.", ACCENT_INDIGO, "Live Dynamic Graphics"),
        ("3. Socratic Knowledge Checks", "Every single concept concludes with an interactive MCQ. If students choose wrong, the system explains WHY that mental model failed and guides them back.", STATUS_AMBER, "Instant Formative Feedback"),
        ("4. Interactive Sandbox Lab", "Students write real code in our browser terminal. Automated test runners verify code assertions on the fly, locking in skills before the next day.", STATUS_GREEN, "Proctored Code Execution")
    ]
    pw = Inches(2.78)
    for i, (p_title, p_desc, col, tag) in enumerate(pillars_16):
        x = Inches(0.8) + i * (pw + Inches(0.2))
        pb = s16.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.95), pw, Inches(5.0))
        pb.fill.solid()
        pb.fill.fore_color.rgb = CARD_BG
        pb.line.color.rgb = col
        ptf = pb.text_frame
        ptf.word_wrap = True
        ptf.margin_left = ptf.margin_right = Inches(0.2)
        ptf.margin_top = Inches(0.25)

        pp1 = ptf.paragraphs[0]
        pp1.text = p_title
        pp1.font.size = Pt(12)
        pp1.font.bold = True
        pp1.font.color.rgb = col

        pp_tag = ptf.add_paragraph()
        pp_tag.text = f"[{tag.upper()}]"
        pp_tag.font.size = Pt(8.5)
        pp_tag.font.bold = True
        pp_tag.font.color.rgb = TEXT_MUTED
        pp_tag.space_before = Pt(2)

        pp2 = ptf.add_paragraph()
        pp2.text = p_desc
        pp2.font.size = Pt(10)
        pp2.font.color.rgb = TEXT_LIGHT
        pp2.space_before = Pt(10)

        pp3 = ptf.add_paragraph()
        pp3.text = "Shareholder Advantage:"
        pp3.font.size = Pt(9.5)
        pp3.font.bold = True
        pp3.font.color.rgb = col
        pp3.space_before = Pt(14)

        pp4 = ptf.add_paragraph()
        if i == 0: pp4.text = "Zero expensive human instructor scaling costs."
        elif i == 1: pp4.text = "5x higher student completion rates vs videos."
        elif i == 2: pp4.text = "Guaranteed conceptual understanding."
        else: pp4.text = "Zero cheating; 100% genuine code verification."
        pp4.font.size = Pt(9.5)
        pp4.font.color.rgb = TEXT_LIGHT

    out_pptx = "PinIT_Career_OS_Shareholder_Presentation.pptx"
    prs.save(out_pptx)
    print(f"PowerPoint successfully created at: {out_pptx}")

if __name__ == '__main__':
    build_presentation()
