import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # Set 16:9 widescreen dimensions (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide

    # Color Palette
    BG_DARK = RGBColor(11, 15, 25)         # Deep slate navy #0B0F19
    CARD_BG = RGBColor(24, 33, 47)         # Slate card #18212F
    CARD_BORDER = RGBColor(51, 65, 85)     # #334155
    TEXT_LIGHT = RGBColor(248, 250, 252)   # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)   # #94A3B8
    TEXT_DIM = RGBColor(100, 116, 139)     # #64748B
    ACCENT_BLUE = RGBColor(56, 189, 248)   # Sky blue #38BDF8
    ACCENT_INDIGO = RGBColor(129, 140, 248)# Indigo #818CF8
    STATUS_GREEN = RGBColor(16, 185, 129)  # Emerald #10B981
    STATUS_AMBER = RGBColor(245, 158, 11)  # Amber #F59E0B
    WHITE = RGBColor(255, 255, 255)

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="PINIT CAREER OS • SHAREHOLDER PRESENTATION"):
        # Category Tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.3))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        p_c = tf_c.paragraphs[0]
        p_c.text = category_text.upper()
        p_c.font.size = Pt(10)
        p_c.font.bold = True
        p_c.font.color.rgb = ACCENT_BLUE

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(11.7), Inches(0.65))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 1: Executive Portfolio Overview - 37 Courses Title List
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    add_bg(slide1)
    add_header(slide1, "The Master Course Catalog: 37 Career Programs", "Portfolio Architecture & Scale")

    # Subtitle summary badge
    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.42))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(30, 41, 59)
    badge.line.color.rgb = ACCENT_BLUE
    b_tf = badge.text_frame
    b_tf.margin_top = Inches(0.08)
    b_p = b_tf.paragraphs[0]
    b_p.text = "🎯 37 Distinct Mastercourses  •  1,110 Days of Structured Training  •  Spanning Software, AI, Cloud, Hardware & Commerce"
    b_p.font.size = Pt(11)
    b_p.font.bold = True
    b_p.font.color.rgb = TEXT_LIGHT
    b_p.alignment = PP_ALIGN.CENTER

    categories = [
        ("Software Engineering & Stacks (9)", [
            "1. Python Programming & Backend Systems",
            "2. Full-Stack React Web Development",
            "3. Node.js & TypeScript Backend Engineering",
            "4. Java Fundamentals & Core Logic",
            "5. Data Structures & Algorithmic Optimizations",
            "6. Database Engineering & Query Performance",
            "7. High-Scale Distributed System Design",
            "8. UI/UX Design Systems & Visual Frontend",
            "9. Mobile Application Development"
        ]),
        ("Cloud, DevOps & Cyber Defense (5)", [
            "10. Cloud Native Architectures (AWS)",
            "11. DevOps & CI/CD Pipeline Automation",
            "12. Full-Stack JavaScript Engineering",
            "13. Cybersecurity Principles & Secure Systems",
            "14. Quantitative Engineering & Low-Latency"
        ]),
        ("AI, Hardware & Future Tech (9)", [
            "15. AI Engineering & LLM Integration",
            "16. Natural Language Processing (NLP)",
            "17. 3D Interactive Graphics & Avatars",
            "18. Blockchain, Web3 & Smart Contracts",
            "19. IoT, Firmware & Embedded Systems",
            "20. IoT Wireless Networks & Protocols",
            "21. Edge AI, DSP & TinyML Systems",
            "22. Industrial IoT Security & Lifecycle",
            "23. Everyday AI Literacy & Prompting"
        ]),
        ("Commerce, Business & Literacy (14)", [
            "24. Digital Accounting & Taxation",
            "25. Business Finance & Investments",
            "26. Business Analytics & Intelligence",
            "27. Marketing & Brand Management",
            "28. Digital Marketing & Growth Strategy",
            "29. E-Commerce & Digital Business",
            "30. Entrepreneurship & Business Mgmt",
            "31. Sales, Customer Success & CRM",
            "32. Operations, Supply Chain & Compliance",
            "33. AI & Digital Transformation",
            "34. Computer Literacy & OS Fundamentals",
            "35. Excel & Data Analysis Fundamentals",
            "36. Git, GitHub & Version Control",
            "37. Professional Tech Communication"
        ])
    ]

    col_w = Inches(2.78)
    col_gap = Inches(0.2)
    start_x = Inches(0.8)
    start_y = Inches(1.9)
    card_h = Inches(5.1)

    for i, (cat_title, courses) in enumerate(categories):
        x = start_x + i * (col_w + col_gap)
        c_shape = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, start_y, col_w, card_h)
        c_shape.fill.solid()
        c_shape.fill.fore_color.rgb = CARD_BG
        c_shape.line.color.rgb = CARD_BORDER

        tf = c_shape.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.18)
        tf.margin_top = Inches(0.18)

        p_h = tf.paragraphs[0]
        p_h.text = cat_title
        p_h.font.size = Pt(11)
        p_h.font.bold = True
        p_h.font.color.rgb = ACCENT_BLUE

        for c_title in courses:
            p_c = tf.add_paragraph()
            p_c.text = c_title
            p_c.font.size = Pt(8.5)
            p_c.font.color.rgb = TEXT_LIGHT
            p_c.space_before = Pt(3.5)

    # -------------------------------------------------------------
    # SLIDE 2: Flagship Track — Python Full-Stack & Systems
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_bg(slide2)
    add_header(slide2, "Flagship Track 1: Python Full-Stack & AI Engineering", "Flagship Curriculum Architecture")

    # Column 1: Non-Tech Explanation & What We Teach
    c1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.7), Inches(5.6))
    c1.fill.solid()
    c1.fill.fore_color.rgb = CARD_BG
    c1.line.color.rgb = CARD_BORDER
    tf1 = c1.text_frame
    tf1.word_wrap = True
    tf1.margin_left = tf1.margin_right = tf1.margin_top = Inches(0.3)

    p1 = tf1.paragraphs[0]
    p1.text = "The Business & Non-Technical Concept"
    p1.font.size = Pt(14)
    p1.font.bold = True
    p1.font.color.rgb = ACCENT_BLUE

    p2 = tf1.add_paragraph()
    p2.text = "Python is the undisputed global backbone for Artificial Intelligence, financial systems, and web data. We take learners with zero computer background and transform them into enterprise-ready software architects through 30 intensive daily modules."
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_LIGHT
    p2.space_before = Pt(8)

    p3 = tf1.add_paragraph()
    p3.text = "What Topics Do We Cover?"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = ACCENT_INDIGO
    p3.space_before = Pt(14)

    topics_py = [
        ("Core Logical Execution: ", "Sequential instructions, dynamic typing, math operations, and automated decision engines."),
        ("Data Structures & Memory: ", "Lists, dictionaries (Hash Maps), sets, and fast O(1) database ledger lookups."),
        ("Object-Oriented Architecture: ", "Classes, encapsulation, inheritance, and real-world polymorphic payment gateways."),
        ("Web APIs with FastAPI: ", "Building high-speed digital endpoints that connect mobile frontends to backends."),
        ("Production Databases: ", "SQL queries, relational modeling, data integrity, and atomic financial rollbacks.")
    ]
    for bold_txt, norm_txt in topics_py:
        p = tf1.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = "• " + bold_txt
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = norm_txt
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_MUTED

    # Column 2: Lab & Zero-Setup Flight Simulator
    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.6))
    c2.fill.solid()
    c2.fill.fore_color.rgb = CARD_BG
    c2.line.color.rgb = CARD_BORDER
    tf2 = c2.text_frame
    tf2.word_wrap = True
    tf2.margin_left = tf2.margin_right = tf2.margin_top = Inches(0.3)

    p_l1 = tf2.paragraphs[0]
    p_l1.text = "The Zero-Setup Interactive Browser Lab"
    p_l1.font.size = Pt(14)
    p_l1.font.bold = True
    p_l1.font.color.rgb = STATUS_GREEN

    lab_points = [
        ("Zero Laptop Installation Friction: ", "Traditional coding bootcamps fail because students get stuck configuring computers. Our lab runs 100% inside any web browser in a secure cloud sandbox."),
        ("The 'Flight Simulator' Method: ", "Students write real code in a live terminal. Automated proctored assertion engines test their code against edge cases in real-time."),
        ("AI Socratic Debugging Tutor: ", "When code fails, our AI tutor does not reveal the answer. It asks guiding questions to help the student diagnose and fix their own bug."),
        ("Instant Code-to-Cloud Deployment: ", "Students deploy functional web APIs and test endpoints live with shareable preview links to prove their skills.")
    ]
    for b_t, n_t in lab_points:
        p = tf2.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = "✔ " + b_t
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = n_t
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_MUTED

    # Build status footer tag on slide 2
    f_tag = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(5.9), Inches(5.7), Inches(0.85))
    f_tag.fill.solid()
    f_tag.fill.fore_color.rgb = RGBColor(15, 23, 42)
    f_tag.line.color.rgb = STATUS_GREEN
    tf_f = f_tag.text_frame
    tf_f.margin_top = Inches(0.12)
    p_f = tf_f.paragraphs[0]
    p_f.text = "CURRENT CODING STATUS (PYTHON FULL-STACK):"
    p_f.font.size = Pt(9.5)
    p_f.font.bold = True
    p_f.font.color.rgb = STATUS_GREEN
    p_f2 = tf_f.add_paragraph()
    p_f2.text = "Coded: 30 / 30 Days (100% Complete with 60 Tests & Quests) | Remaining: 0 Days"
    p_f2.font.size = Pt(10)
    p_f2.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 3: The Virtual Internship & Workplace Experience
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_bg(slide3)
    add_header(slide3, "The Virtual Workplace: Real Enterprise Internship Experience", "The Competitive Moat")

    # Overview box
    ov_box = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.733), Inches(1.1))
    ov_box.fill.solid()
    ov_box.fill.fore_color.rgb = CARD_BG
    ov_box.line.color.rgb = CARD_BORDER
    ov_tf = ov_box.text_frame
    ov_tf.word_wrap = True
    ov_tf.margin_left = ov_tf.margin_right = Inches(0.3)
    ov_tf.margin_top = Inches(0.15)
    ov_p1 = ov_tf.paragraphs[0]
    ov_p1.text = "Solving the 'No Experience = No Job' Dilemma with a Virtual Company Simulator"
    ov_p1.font.size = Pt(13)
    ov_p1.font.bold = True
    ov_p1.font.color.rgb = ACCENT_BLUE
    ov_p2 = ov_tf.add_paragraph()
    ov_p2.text = "Most online courses give certificates for watching videos. Employers reject these candidates. PinIT Career OS places every student inside a simulated technology enterprise with virtual teams, Jira-style task boards, code reviews, and verifiable supervisor proof."
    ov_p2.font.size = Pt(10.5)
    ov_p2.font.color.rgb = TEXT_LIGHT

    # 4 Workplace Step Cards
    steps = [
        ("1. Virtual Tech Desk & Team", "Students are assigned to an engineering squad with an AI Tech Lead and Product Manager. They attend automated standups and review sprint backlogs.", ACCENT_BLUE),
        ("2. Real Enterprise Bug Tickets", "Tasks are dynamically generated business problems (e.g., payment timeout, database crash). No two students solve the exact same task, preventing answer plagiarism.", ACCENT_INDIGO),
        ("3. Code Review & PR Checks", "Students write code, create Git branches, and submit Pull Requests. Our automated AI Senior Architect conducts line-by-line security and efficiency reviews.", STATUS_AMBER),
        ("4. Verifiable QR Credential", "Upon passing 4 sprints and an oral code defense, students earn an employer-verifiable digital credential backed by a public audit link and code proof.", STATUS_GREEN)
    ]

    card_w = Inches(2.78)
    for i, (s_title, s_desc, col) in enumerate(steps):
        x = Inches(0.8) + i * (card_w + Inches(0.2))
        s_box = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.7), card_w, Inches(4.3))
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = CARD_BG
        s_box.line.color.rgb = col
        stf = s_box.text_frame
        stf.word_wrap = True
        stf.margin_left = stf.margin_right = Inches(0.2)
        stf.margin_top = Inches(0.25)

        sp1 = stf.paragraphs[0]
        sp1.text = s_title
        sp1.font.size = Pt(12)
        sp1.font.bold = True
        sp1.font.color.rgb = col

        sp2 = stf.add_paragraph()
        sp2.text = s_desc
        sp2.font.size = Pt(10)
        sp2.font.color.rgb = TEXT_LIGHT
        sp2.space_before = Pt(12)

        sp3 = stf.add_paragraph()
        sp3.text = "Enterprise Standard:"
        sp3.font.size = Pt(9.5)
        sp3.font.bold = True
        sp3.font.color.rgb = TEXT_MUTED
        sp3.space_before = Pt(14)

        sp4 = stf.add_paragraph()
        if i == 0: sp4.text = "Agile Scrum & Standup Logs"
        elif i == 1: sp4.text = "Hidden Unit Tests Validation"
        elif i == 2: sp4.text = "OWASP Security Auditing"
        else: sp4.text = "Permanent QR Verification Link"
        sp4.font.size = Pt(9.5)
        sp4.font.color.rgb = col

    # -------------------------------------------------------------
    # SLIDE 4: Flagship Track — Enterprise Web Full-Stack Engineering
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_bg(slide4)
    add_header(slide4, "Flagship Track 2: Enterprise Web Full-Stack Engineering", "Flagship Curriculum Architecture")

    # Column 1: Non-Tech Concept
    cw1 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(5.7), Inches(5.6))
    cw1.fill.solid()
    cw1.fill.fore_color.rgb = CARD_BG
    cw1.line.color.rgb = CARD_BORDER
    tfw1 = cw1.text_frame
    tfw1.word_wrap = True
    tfw1.margin_left = tfw1.margin_right = tfw1.margin_top = Inches(0.3)

    pw1 = tfw1.paragraphs[0]
    pw1.text = "The Modern Consumer Web Experience"
    pw1.font.size = Pt(14)
    pw1.font.bold = True
    pw1.font.color.rgb = ACCENT_BLUE

    pw2 = tfw1.add_paragraph()
    pw2.text = "Every digital interaction—from booking a ride on Uber to buying products on Amazon—relies on Full-Stack Web engineering. We train students to build lightning-fast web applications with clean visual screens and bulletproof backends."
    pw2.font.size = Pt(11)
    pw2.font.color.rgb = TEXT_LIGHT
    pw2.space_before = Pt(8)

    pw3 = tfw1.add_paragraph()
    pw3.text = "What Topics Do We Cover?"
    pw3.font.size = Pt(13)
    pw3.font.bold = True
    pw3.font.color.rgb = ACCENT_INDIGO
    pw3.space_before = Pt(14)

    topics_web = [
        ("Frontend Architecture (React & Next.js): ", "Interactive UI components, state management, and Server-Side Rendering (SSR)."),
        ("Backend Services (Node.js & Express): ", "Event loops, REST APIs, JSON data pipelines, and request routing."),
        ("Database Modeling (Prisma ORM & PostgreSQL): ", "Relational schemas, user authentication tables, and caching."),
        ("Real-Time Data (WebSockets): ", "Live bidirectional event streaming for chats and order tracking notifications."),
        ("Security & Payments (Stripe & JWT): ", "Encrypted session tokens, cookie security, and automated credit card billing.")
    ]
    for b_t, n_t in topics_web:
        p = tfw1.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = "• " + b_t
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = n_t
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_MUTED

    # Column 2: Web Capstones & Build Status
    cw2 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.4), Inches(5.7), Inches(5.6))
    cw2.fill.solid()
    cw2.fill.fore_color.rgb = CARD_BG
    cw2.line.color.rgb = CARD_BORDER
    tfw2 = cw2.text_frame
    tfw2.word_wrap = True
    tfw2.margin_left = tfw2.margin_right = tfw2.margin_top = Inches(0.3)

    p_w2 = tfw2.paragraphs[0]
    p_w2.text = "Real-World Capstone Deliverables"
    p_w2.font.size = Pt(14)
    p_w2.font.bold = True
    p_w2.font.color.rgb = STATUS_GREEN

    web_capstones = [
        ("High-Throughput API Gateway: ", "Rate limiting algorithms protecting servers from DDoS attacks during flash sales."),
        ("Multi-Tenant Authentication Hub: ", "Enterprise role-based security protecting patient and client records."),
        ("Real-Time Multi-Room Collaboration: ", "Interactive live canvas and chat engine supporting simultaneous users."),
        ("Enterprise E-Commerce Engine: ", "Complete 30-Day capstone featuring inventory locking, shopping carts, and Stripe payments.")
    ]
    for b_t, n_t in web_capstones:
        p = tfw2.add_paragraph()
        p.space_before = Pt(8)
        r1 = p.add_run()
        r1.text = "✔ " + b_t
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p.add_run()
        r2.text = n_t
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_MUTED

    # Build status footer tag on slide 4
    f_tag4 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(5.9), Inches(5.7), Inches(0.85))
    f_tag4.fill.solid()
    f_tag4.fill.fore_color.rgb = RGBColor(15, 23, 42)
    f_tag4.line.color.rgb = STATUS_GREEN
    tf_f4 = f_tag4.text_frame
    tf_f4.margin_top = Inches(0.12)
    p_f4 = tf_f4.paragraphs[0]
    p_f4.text = "CURRENT CODING STATUS (FULL-STACK REACT & NODE):"
    p_f4.font.size = Pt(9.5)
    p_f4.font.bold = True
    p_f4.font.color.rgb = STATUS_GREEN
    p_f4_2 = tf_f4.add_paragraph()
    p_f4_2.text = "Coded: 30 / 30 Days (100% Complete & Live in Production) | Remaining: 0 Days"
    p_f4_2.font.size = Pt(10)
    p_f4_2.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # HELPER: 4-Course Grid Slide Generator (Slides 5 to 13)
    # -------------------------------------------------------------
    def create_grid_slide(title, block_num, courses):
        s = prs.slides.add_slide(blank_layout)
        add_bg(s)
        add_header(s, title, f"Course Portfolio • Block {block_num} of 9")

        # 4 Cards Layout: 2 rows of 2 (or 3 cards if 3 courses)
        card_w = Inches(5.7)
        card_h = Inches(2.65) if len(courses) > 2 else Inches(5.5)
        positions = [
            (Inches(0.8), Inches(1.4)),
            (Inches(6.8), Inches(1.4)),
            (Inches(0.8), Inches(4.3)),
            (Inches(6.8), Inches(4.3))
        ]

        for idx, c in enumerate(courses):
            if idx >= 4: break
            x, y = positions[idx]
            shape = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, card_w, card_h)
            shape.fill.solid()
            shape.fill.fore_color.rgb = CARD_BG
            is_complete = c["coded"] >= 30
            shape.line.color.rgb = STATUS_GREEN if is_complete else CARD_BORDER

            tf = shape.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_right = Inches(0.2)
            tf.margin_top = Inches(0.15)
            tf.margin_bottom = Inches(0.1)

            # Course Title
            p0 = tf.paragraphs[0]
            p0.text = f"{c['num']}. {c['title']}"
            p0.font.size = Pt(11)
            p0.font.bold = True
            p0.font.color.rgb = ACCENT_BLUE

            # Non-Tech Explanation
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

            # Topics We Teach
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

            # Last Line Requirement: How much we have coded | How much remaining
            p3 = tf.add_paragraph()
            p3.space_before = Pt(5)
            r_st = p3.add_run()
            rem = max(0, 30 - c["coded"])
            status_txt = f"Coded: {c['coded']} / 30 Days ({int(c['coded']/30*100)}% Complete)  |  Remaining to Code: {rem} Days"
            r_st.text = "⚡ Build Status: " + status_txt
            r_st.font.bold = True
            r_st.font.size = Pt(9)
            r_st.font.color.rgb = STATUS_GREEN if is_complete else STATUS_AMBER

        return s

    # -------------------------------------------------------------
    # SLIDE 5: Grid Block 1 — Core Systems & Infrastructure
    # -------------------------------------------------------------
    courses_s5 = [
        {
            "num": 4, "title": "Java Fundamentals & Core Logic",
            "explanation": "The industrial workhorse language running global banking, Android devices, and large corporate IT infrastructure.",
            "topics": "Conditional logic, OOP design, garbage collection, collections framework, exception handling, and multithreading.",
            "coded": 17
        },
        {
            "num": 6, "title": "Database Engineering & Query Performance",
            "explanation": "The secure digital vault where all customer profiles, bank balances, and order histories are stored with instant retrieval.",
            "topics": "Relational SQL schemas, index B-trees, ACID transactions, connection pools, and query execution plans.",
            "coded": 30
        },
        {
            "num": 10, "title": "Cloud Native Architectures (AWS)",
            "explanation": "Renting infinite supercomputing power from Amazon Web Services instead of buying expensive physical office hardware.",
            "topics": "Virtual servers (EC2), serverless Lambda functions, S3 storage buckets, VPC networking, and API gateways.",
            "coded": 5
        },
        {
            "num": 11, "title": "DevOps & CI/CD Pipeline Automation",
            "explanation": "The automated factory assembly line that tests, packages, and deploys software to users with zero human error.",
            "topics": "Docker containerization, GitHub Actions workflows, Kubernetes cluster orchestration, and zero-downtime canary rollouts.",
            "coded": 30
        }
    ]
    create_grid_slide("Core Systems, Databases & Cloud Infrastructure", 1, courses_s5)

    # -------------------------------------------------------------
    # SLIDE 6: Grid Block 2 — Performance, Algorithms & Interfaces
    # -------------------------------------------------------------
    courses_s6 = [
        {
            "num": 5, "title": "Data Structures & Algorithmic Optimizations",
            "explanation": "The mathematical science of organizing information so apps run in split-seconds rather than freezing when millions log in.",
            "topics": "Big-O space-time complexity, binary search trees, hash tables, graph traversals, and dynamic programming.",
            "coded": 30
        },
        {
            "num": 8, "title": "UI/UX Design Systems & Visual Frontend",
            "explanation": "Creating the visual standards, color palettes, and component blueprints that make software beautiful and intuitive to anyone.",
            "topics": "Atomic component hierarchies, WCAG accessibility, typography grids, responsive CSS flexbox, and design tokens.",
            "coded": 30
        },
        {
            "num": 9, "title": "Mobile Application Development",
            "explanation": "Building sleek, high-performance apps for iPhone and Android devices from one single unified codebase.",
            "topics": "React Native components, touch gesture handlers, camera/GPS device APIs, local device storage, and app store deployment.",
            "coded": 6
        },
        {
            "num": 7, "title": "High-Scale Distributed System Design",
            "explanation": "Architecting software that never crashes even when millions of people transact at the exact same second (like Uber or Amazon).",
            "topics": "Load balancing algorithms, Redis in-memory caches, message queues, database sharding, and partition tolerance.",
            "coded": 30
        }
    ]
    create_grid_slide("Software Performance, Algorithms & Interfaces", 2, courses_s6)

    # -------------------------------------------------------------
    # SLIDE 7: Grid Block 3 — Artificial Intelligence & Advanced Tech
    # -------------------------------------------------------------
    courses_s7 = [
        {
            "num": 15, "title": "AI Engineering & LLM Integration",
            "explanation": "Embedding smart generative AI models (like ChatGPT or Claude) directly into company products to automate human tasks.",
            "topics": "Prompt engineering, Retrieval-Augmented Generation (RAG), vector embeddings, autonomous agent loops, and token budgets.",
            "coded": 5
        },
        {
            "num": 16, "title": "Natural Language Processing (NLP)",
            "explanation": "Teaching computer software how to read, understand, summarize, and translate human language and emotion.",
            "topics": "Text tokenization, sentiment classification, transformer models, attention mechanisms, and custom model fine-tuning.",
            "coded": 5
        },
        {
            "num": 17, "title": "3D Interactive Graphics & Avatar Animation",
            "explanation": "Rendering 3D visual environments and animated digital humans inside browsers without downloading heavy game software.",
            "topics": "WebGL canvas setup, perspective projection math, bone rigging skinning weights, and facial blendshape animations.",
            "coded": 5
        },
        {
            "num": 12, "title": "Full-Stack JavaScript Engineering",
            "explanation": "The unified programming standard enabling engineers to build both user screens and server databases with one language.",
            "topics": "Client-server separation, RESTful APIs, ORM migrations, JSON Web Tokens (JWT), and automated cloud pipelines.",
            "coded": 9
        }
    ]
    create_grid_slide("Artificial Intelligence, NLP & 3D Interactive Graphics", 3, courses_s7)

    # -------------------------------------------------------------
    # SLIDE 8: Grid Block 4 — Hardware, Edge Computing & Defense
    # -------------------------------------------------------------
    courses_s8 = [
        {
            "num": 13, "title": "Cybersecurity Principles & Secure Systems",
            "explanation": "The digital defense shield that protects company networks and customer data from hostile hackers and breaches.",
            "topics": "Defeating OWASP Top 10 vulnerabilities, AES encryption, SQL injection defense, CSRF mitigation, and security audits.",
            "coded": 30
        },
        {
            "num": 19, "title": "IoT, Firmware & Embedded Systems",
            "explanation": "Writing the tiny computer code that brings physical hardware to life (smart home devices, medical sensors, auto electronics).",
            "topics": "Microcontroller programming (C/C++), analog sensor ADC conversions, real-time operating systems (RTOS), and MQTT telemetry.",
            "coded": 5
        },
        {
            "num": 20, "title": "IoT Wireless Networks & Protocols",
            "explanation": "The invisible wireless communication lines that connect smart sensors across long distances on tiny battery power.",
            "topics": "Long-range wireless (LoRaWAN), cellular NB-IoT frequencies, Bluetooth Low Energy (BLE), and lightweight CoAP UDP packets.",
            "coded": 5
        },
        {
            "num": 21, "title": "Edge AI, DSP & TinyML Systems",
            "explanation": "Running intelligent machine learning models directly on small battery chips without requiring internet access.",
            "topics": "Digital signal processing (DSP), neural network quantization, accelerometer gesture recognition, and TinyML runtimes.",
            "coded": 5
        }
    ]
    create_grid_slide("Hardware Systems, Edge AI & Cyber Defense", 4, courses_s8)

    # -------------------------------------------------------------
    # SLIDE 9: Grid Block 5 — Next-Gen Systems & Financial Tech
    # -------------------------------------------------------------
    courses_s9 = [
        {
            "num": 22, "title": "Industrial IoT Security & Device Lifecycle",
            "explanation": "Protecting critical physical factories, energy grids, and robotics from unauthorized firmware tampering and digital sabotage.",
            "topics": "Cryptographic hardware root-of-trust, secure boot public keys, anti-rollback protection, and over-the-air (OTA) updates.",
            "coded": 5
        },
        {
            "num": 14, "title": "Quantitative Engineering & Low-Latency Trading",
            "explanation": "Building the hyper-speed financial software used by Wall Street where stock trades execute in microseconds.",
            "topics": "Electronic Limit Order Books (LOB), trade matching engines, VWAP algorithms, market slippage, and network latency physics.",
            "coded": 5
        },
        {
            "num": 18, "title": "Blockchain, Web3 & Smart Contracts",
            "explanation": "Creating permanent, tamper-proof digital contracts and automated agreements that execute safely without intermediary banks.",
            "topics": "Cryptographic ledgers, Solidity smart contracts, Merkle trees, MetaMask JSON-RPC wallets, and decentralized protocols.",
            "coded": 5
        },
        {
            "num": 3, "title": "Node.js & TypeScript Backend Engineering",
            "explanation": "The enterprise server technology powering high-concurrency modern apps (Netflix, PayPal, Uber) with strict type safety.",
            "topics": "Asynchronous event loops, Express middleware, REST APIs, TypeScript compilation, and high-throughput reliability.",
            "coded": 30
        }
    ]
    create_grid_slide("Industrial Security, Financial Tech & Web3 Systems", 5, courses_s9)

    # -------------------------------------------------------------
    # SLIDE 10: Grid Block 6 — Productivity & Workforce Foundations
    # -------------------------------------------------------------
    courses_s10 = [
        {
            "num": 34, "title": "Computer Literacy, Digital Productivity & OS",
            "explanation": "The universal level-0 starting point ensuring any student can navigate operating systems and computer files effortlessly.",
            "topics": "Operating system navigation, command-line terminal (CLI), file systems, cloud storage sync, and cybersecurity hygiene.",
            "coded": 30
        },
        {
            "num": 23, "title": "Everyday AI Literacy & Prompt Engineering",
            "explanation": "Teaching working professionals how to use modern AI assistants to accomplish 8 hours of routine office tasks in 1 hour.",
            "topics": "Structured prompt engineering, AI web research, automated document summarization, generative graphics, and task automation.",
            "coded": 5
        },
        {
            "num": 35, "title": "Excel & Data Analysis Fundamentals",
            "explanation": "The universal numbers language of corporate business, finance departments, and executive board reporting.",
            "topics": "Mathematical formulas, VLOOKUP/XLOOKUP, Pivot Tables, data cleaning, and interactive visual management dashboards.",
            "coded": 30
        },
        {
            "num": 36, "title": "Git, GitHub & Version Control Basics",
            "explanation": "The digital time machine and collaboration tool that lets engineering teams build code together without overwriting work.",
            "topics": "Repository creation, tracking commits, branch isolation, resolving merge conflicts, and team pull request reviews.",
            "coded": 5
        }
    ]
    create_grid_slide("Universal Digital Literacy & Workforce Essentials", 6, courses_s10)

    # -------------------------------------------------------------
    # SLIDE 11: Grid Block 7 — Commerce & Financial Systems
    # -------------------------------------------------------------
    courses_s11 = [
        {
            "num": 24, "title": "Digital Accounting & Taxation (B.Com/BBA)",
            "explanation": "Modernizing accounting by replacing manual ledgers with computerized ERP software, automated GST, and cloud workflows.",
            "topics": "Double-entry accounting, Tally Prime ERP, Goods and Services Tax (GST), automated payroll runs, and statutory compliance.",
            "coded": 30
        },
        {
            "num": 25, "title": "Business Finance & Investment Management",
            "explanation": "Teaching students how company CFOs manage capital, evaluate project returns, and maximize shareholder value.",
            "topics": "Financial statements, time value of money, cash budgeting, corporate cost of capital, and equity valuation models.",
            "coded": 5
        },
        {
            "num": 26, "title": "Business Analytics & Decision Intelligence",
            "explanation": "Translating company operational data into executive visual charts that uncover hidden revenue opportunities.",
            "topics": "Commercial data literacy, Power BI dashboards, business SQL queries, KPI performance tracking, and forecasting.",
            "coded": 5
        },
        {
            "num": 29, "title": "E-Commerce & Digital Business",
            "explanation": "Everything required to launch, run, and scale an online consumer storefront from checkout UX to doorstep fulfillment.",
            "topics": "Online storefront design, payment gateway checkout, catalog management, shipping logistics, and customer retention.",
            "coded": 30
        }
    ]
    create_grid_slide("Business Commerce, Accounting & Investment Systems", 7, courses_s11)

    # -------------------------------------------------------------
    # SLIDE 12: Grid Block 8 — Growth, Sales & Operations
    # -------------------------------------------------------------
    courses_s12 = [
        {
            "num": 27, "title": "Marketing & Brand Management",
            "explanation": "Creating memorable brand identities and marketing campaigns that persuade target customers to buy our product.",
            "topics": "Customer research, market segmentation, brand positioning, pricing psychology, and promotional distribution channels.",
            "coded": 5
        },
        {
            "num": 28, "title": "Digital Marketing & Growth Strategy",
            "explanation": "Attracting customers and driving online sales through search engines, viral social channels, and targeted digital ads.",
            "topics": "Search Engine Optimization (SEO), Google/Meta paid ads, email marketing funnels, and Conversion Rate Optimization (CRO).",
            "coded": 30
        },
        {
            "num": 31, "title": "Sales, Customer Success & CRM",
            "explanation": "Finding enterprise buyers, pitching deals, negotiating win-win contracts, and maintaining long-term customer relationships.",
            "topics": "B2B prospecting, lead qualification (BANT), objection handling, negotiation, CRM software, and account management.",
            "coded": 30
        },
        {
            "num": 32, "title": "Operations, Supply Chain & Compliance",
            "explanation": "Managing the physical movement of materials and manufacturing products on time with zero waste and full legal compliance.",
            "topics": "Business process mapping, inventory control (EOQ/ROP), supplier procurement, Lean Six Sigma quality, and statutory audits.",
            "coded": 30
        }
    ]
    create_grid_slide("Customer Growth, Enterprise Sales & Supply Chain", 8, courses_s12)

    # -------------------------------------------------------------
    # SLIDE 13: Grid Block 9 — Leadership, Strategy & Transformation
    # -------------------------------------------------------------
    courses_s13 = [
        {
            "num": 30, "title": "Entrepreneurship & Business Management",
            "explanation": "Guiding founders through conceiving, testing, launching, and financing a successful, sustainable business venture.",
            "topics": "Business Model Canvas (BMC), financial break-even analysis, market validation, leadership, and investor pitch decks.",
            "coded": 30
        },
        {
            "num": 33, "title": "AI & Digital Transformation for Business",
            "explanation": "Upgrading traditional brick-and-mortar operations by automating manual office tasks with enterprise AI systems.",
            "topics": "Robotic Process Automation (RPA), AI-driven enterprise CRM/ERP workflows, predictive analytics, and AI governance.",
            "coded": 5
        },
        {
            "num": 37, "title": "Professional Tech Communication & Interviews",
            "explanation": "Transforming students into confident, articulate professionals who communicate effectively and ace job interviews.",
            "topics": "Executive business emails, technical presentations, resume optimization, salary negotiation, and behavioral interviews.",
            "coded": 5
        }
    ]
    create_grid_slide("Business Leadership, Digital Transformation & Career Mastery", 9, courses_s13)

    # -------------------------------------------------------------
    # SLIDE 14: Portfolio Summary & Engineering Roadmap
    # -------------------------------------------------------------
    slide14 = prs.slides.add_slide(blank_layout)
    add_bg(slide14)
    add_header(slide14, "Portfolio Summary & Engineering Velocity", "Executive Financial & Delivery Metrics")

    # Metrics Row: 3 KPI Cards
    kpis = [
        ("12 COURSES", "100% Coded & Live", "360 production-grade days with tests & sandboxes ready for market launch today.", STATUS_GREEN),
        ("25 COURSES", "Architecture & Pilots Live", "Core Day 1-5 foundations, visual suites & full 30-day syllabi completed.", ACCENT_BLUE),
        ("ZERO RE-ARCHITECT", "High Capital Efficiency", "Standardized lesson & visual templates enable rapid, low-cost expansion.", ACCENT_INDIGO)
    ]
    kw = Inches(3.7)
    for i, (top_v, sub_v, desc_v, col) in enumerate(kpis):
        x = Inches(0.8) + i * (kw + Inches(0.31))
        kb = slide14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.4), kw, Inches(1.8))
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

    # Bottom Detailed Summary Box
    sum_box = slide14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.45), Inches(11.733), Inches(3.45))
    sum_box.fill.solid()
    sum_box.fill.fore_color.rgb = CARD_BG
    sum_box.line.color.rgb = CARD_BORDER
    stf = sum_box.text_frame
    stf.word_wrap = True
    stf.margin_left = stf.margin_right = Inches(0.3)
    stf.margin_top = Inches(0.25)

    sp_h = stf.paragraphs[0]
    sp_h.text = "Shareholder Takeaway: Immediate Commercial Monetization"
    sp_h.font.size = Pt(14)
    sp_h.font.bold = True
    sp_h.font.color.rgb = ACCENT_BLUE

    points_sum = [
        ("Immediate Go-to-Market Readiness: ", "We can immediately market and monetize complete 1-Month, 3-Month, and 6-Month career accelerator bundles using our 12 fully-finished courses (Full-Stack Python, Full-Stack React, Node.js Backend, Database Engineering, SRE/DevOps, Excel, Accounting, and Business Operations)."),
        ("Predictable Engineering Velocity: ", "All 37 mastercourses have their complete 30-day curriculum blueprints, real-world metaphors, and test criteria formalized in master specification files. Expanding remaining days uses our automated testing pipeline with deterministic quality."),
        ("No Content Debt or Redundancy: ", "Unlike other bootcamps that license third-party content, PinIT owns 100% of its curriculum intellectual property (IP), software engines, and automated assessment code.")
    ]
    for b_t, n_t in points_sum:
        p = stf.add_paragraph()
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

    # -------------------------------------------------------------
    # SLIDE 15: How We Teach — The 20-Minute AI Pedagogy Engine
    # -------------------------------------------------------------
    slide15 = prs.slides.add_slide(blank_layout)
    add_bg(slide15)
    add_header(slide15, "How We Teach: The Proprietary AI Pedagogy Engine", "Our Technology Moat")

    sub_bar = slide15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.42))
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

    pillars = [
        ("1. 20-Min AI Avatar Mentor", "A photorealistic AI instructor explains concepts conversationally in plain words. Uses everyday metaphors (e.g. databases as bank vaults) with zero confusing jargon.", ACCENT_BLUE, "Conversational Audio"),
        ("2. Synchronized Visual Stage", "As the avatar speaks, the interactive screen dynamically animates architectural flows, memory registers, state machines, and data pipelines in real-time.", ACCENT_INDIGO, "Live Dynamic Graphics"),
        ("3. Socratic Knowledge Checks", "Every single concept concludes with an interactive MCQ. If students choose wrong, the system explains WHY that mental model failed and guides them back.", STATUS_AMBER, "Instant Formative Feedback"),
        ("4. Interactive Sandbox Lab", "Students write real code in our browser terminal. Automated test runners verify code assertions on the fly, locking in skills before the next day.", STATUS_GREEN, "Proctored Code Execution")
    ]

    pw = Inches(2.78)
    for i, (p_title, p_desc, col, tag) in enumerate(pillars):
        x = Inches(0.8) + i * (pw + Inches(0.2))
        pb = slide15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.95), pw, Inches(5.0))
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

    output_path = "PinIT_Career_OS_Shareholder_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == '__main__':
    create_deck()
