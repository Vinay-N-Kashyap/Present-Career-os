const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PinitCareer Accelerator Packages — Master Executive Specification</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 14mm 18mm 14mm;
    }
    :root {
      --primary: #0f172a;       /* Deep slate navy */
      --secondary: #1e3a8a;     /* Classic executive navy */
      --accent: #0284c7;        /* Professional blue */
      --text: #1e293b;          /* Charcoal text */
      --text-muted: #64748b;    /* Subdued slate */
      --border: #cbd5e1;        /* Crisp border */
      --bg-light: #f8fafc;      /* Light gray background */
      --green: #059669;         /* Completed emerald */
      --green-bg: #ecfdf5;
      --amber: #d97706;         /* In-progress amber */
      --amber-bg: #fffbeb;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      color: var(--text);
      background: #ffffff;
      font-size: 10pt;
      line-height: 1.5;
    }
    .header-box {
      border-bottom: 2.5px solid var(--primary);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 21pt;
      color: var(--primary);
      font-weight: 800;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
    .doc-subtitle {
      font-size: 11pt;
      color: var(--accent);
      font-weight: 600;
      margin-top: 4px;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: var(--text-muted);
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h2 {
      font-size: 13pt;
      color: var(--secondary);
      margin-top: 22px;
      margin-bottom: 8px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 4px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 10.5pt;
      color: var(--primary);
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    p {
      margin-bottom: 8px;
      text-align: justify;
    }
    .callout {
      background: var(--bg-light);
      border-left: 4px solid var(--accent);
      padding: 12px 14px;
      margin: 12px 0;
      border-radius: 0 6px 6px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    .callout-title {
      font-weight: 700;
      color: var(--secondary);
      margin-bottom: 6px;
      font-size: 10.5pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 16px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f1f5f9;
      color: var(--primary);
      font-weight: 700;
      font-size: 9pt;
    }
    tr:nth-child(even) td {
      background: #fafafa;
    }
    .badge {
      display: inline-block;
      font-weight: 700;
      font-size: 8pt;
      padding: 2px 6px;
      border-radius: 4px;
      text-align: center;
      white-space: nowrap;
    }
    .badge-green { background: var(--green-bg); color: var(--green); border: 1px solid rgba(5, 150, 105, 0.3); }
    .badge-amber { background: var(--amber-bg); color: var(--amber); border: 1px solid rgba(217, 119, 6, 0.3); }
    .badge-blue { background: #e0f2fe; color: #0369a1; border: 1px solid rgba(2, 132, 199, 0.3); }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 10px 0;
      page-break-inside: avoid;
    }
    .card {
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px 12px;
      background: #ffffff;
      font-size: 8.8pt;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card h4 {
      font-size: 9.5pt;
      color: var(--secondary);
      margin-bottom: 4px;
    }
    .card-footer {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px dashed var(--border);
      font-weight: 700;
      font-size: 8.5pt;
    }
    ol, ul {
      margin-left: 20px;
      margin-bottom: 8px;
    }
    li {
      margin-bottom: 4px;
    }
    .page-break {
      page-break-before: always;
    }
    .footer-stamp {
      font-size: 8pt;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      padding-top: 8px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- HEADER & META                              -->
  <!-- ========================================== -->
  <div class="header-box">
    <h1>PinitCareer Accelerator Packages</h1>
    <div class="doc-subtitle">Program Flow, Future-Ready Career Pathways & Master Engineering Audit</div>
    <div class="meta-bar">
      <span>Official Executive Specification</span>
      <span>Document Ref: PINIT-CAP-EXEC-2026</span>
      <span>Confidential — For Leadership & Shareholders</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PART 1: WHAT WE THOUGHT FROM ZERO          -->
  <!-- ========================================== -->
  <h2>1. What We Thought from Zero (The Product Genesis & Core Philosophy)</h2>
  <p>The goal of PinIT Career OS is to turn abstract educational courses into <strong>clear, marketable career pathways</strong>. When we designed this platform from zero, we analyzed why existing educational models (colleges, video websites like Udemy or Coursera, and coding bootcamps) fail both students and employers:</p>

  <div class="callout">
    <div class="callout-title">The Industry Dilemma We Set Out to Solve</div>
    <ul>
      <li><strong>The Passive Video Trap:</strong> Traditional platforms ask students to watch hundreds of hours of recorded videos. Students do not code actively, retention drops below 10%, and students lack the ability to build real software independently.</li>
      <li><strong>The "No Experience = No Job" Paradox:</strong> Employers reject graduates because they lack demonstrable workplace experience, yet companies refuse to hire candidates who do not already possess experience.</li>
      <li><strong>Fake or Copy-Pasted Certificates:</strong> Most online certificates simply certify that video pixels played on a screen. Employers ignore these certificates because anyone can fast-forward through videos or copy code from forums.</li>
    </ul>
  </div>

  <p><strong>Our Zero-to-One Solution: The 4-Part Package Invariant</strong><br>
  To eliminate these flaws, every single training product offered on PinIT Career OS strictly enforces this four-part architecture:</p>
  
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Component</th>
        <th style="width: 45%;">What the Learner Receives</th>
        <th style="width: 30%;">Employer Verification Moat</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Training Bundle</strong></td>
        <td>Structured daily curriculum (1, 3, 6, or 9 months) taught via 20-minute conversational AI avatars and interactive sandboxes.</td>
        <td>Automated daily code assertions; zero passive video skipping.</td>
      </tr>
      <tr>
        <td><strong>2. Portfolio Project</strong></td>
        <td>One practical, production-style application built and documented by the student to demonstrate applied competence.</td>
        <td>Public Git repository and runnable live deployment.</td>
      </tr>
      <tr>
        <td><strong>3. Simulated Internship</strong></td>
        <td>Supervised, work-style experience replicating enterprise tech desks with Jira-like bug tickets, deadlines, Git PRs, and AI code reviews.</td>
        <td>Hidden test validation preventing code plagiarism.</td>
      </tr>
      <tr>
        <td><strong>4. Career Portfolio</strong></td>
        <td>Complete project source code, architectural documentation, supervisor feedback logs, and a verifiable completion record.</td>
        <td>Permanent QR code credential verified on a public ledger.</td>
      </tr>
    </tbody>
  </table>

  <p style="font-size: 8.8pt; color: var(--text-muted); background: #f8fafc; padding: 6px 10px; border-radius: 4px; border: 1px solid var(--border);">
    <strong>📌 Legal & Operational Clarity:</strong> The simulated internship is a supervised training experience designed to replicate workplace responsibilities. It is marketed transparently as career preparation and hands-on skill development, eliminating external placement liabilities while delivering genuine job-ready confidence.
  </p>

  <!-- ========================================== -->
  <!-- PART 2: PACKAGE CATALOGS                   -->
  <!-- ========================================== -->
  <h2>2. Complete Career Accelerator Packages (1, 3, 6 & 9 Months)</h2>
  <p>Each package follows our standardized naming format: <em>Duration — Training Bundle + 1 Practical Project + 1 Simulated Internship</em>.</p>

  <h3>A. One-Month Packages — Career Starters</h3>
  <p>Best for beginners, students exploring careers, and learners seeking focused practical literacy.</p>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Package</th>
        <th style="width: 28%;">Training Program</th>
        <th style="width: 32%;">One Portfolio Project</th>
        <th style="width: 28%;">Simulated Internship</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>P01</strong></td><td>Excel</td><td>Business Analytics Dashboard</td><td>Excel & MIS Analyst Intern</td></tr>
      <tr><td><strong>P02</strong></td><td>Accounting</td><td>Financial Reporting System</td><td>Accounting Intern</td></tr>
      <tr><td><strong>P03</strong></td><td>Business Operations</td><td>Business Operations KPI Dashboard</td><td>Business Operations Intern</td></tr>
    </tbody>
  </table>
  <p style="font-size: 8.8pt;"><em>Learning Flow:</em> Learn core skills ➔ complete project ➔ perform role-based internship tasks ➔ present finished work.<br>
  <em>Outcome:</em> A focused skill portfolio, suitable for entry-level exploration or as a foundation for longer training.</p>

  <div class="page-break"></div>

  <h3>B. Three-Month Packages — Job-Ready Foundations</h3>
  <p>Best for students who want to develop one core technical or business specialization.</p>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Package</th>
        <th style="width: 28%;">Training Program</th>
        <th style="width: 32%;">One Portfolio Project</th>
        <th style="width: 28%;">Simulated Internship</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>P04</strong></td><td>Full-Stack Python</td><td>Full-Stack Task Management Application</td><td>Python Developer Intern</td></tr>
      <tr><td><strong>P05</strong></td><td>Full-Stack React</td><td>Responsive Web Application</td><td>Frontend Developer Intern</td></tr>
      <tr><td><strong>P06</strong></td><td>Node.js Backend</td><td>Production-Style REST API</td><td>Backend Developer Intern</td></tr>
      <tr><td><strong>P07</strong></td><td>Database Engineering</td><td>Database Design & Optimization</td><td>Database Engineering Intern</td></tr>
      <tr><td><strong>P08</strong></td><td>Excel</td><td>Automated Reporting Dashboard</td><td>Excel & MIS Analyst Intern</td></tr>
      <tr><td><strong>P09</strong></td><td>Accounting</td><td>Payroll Management System</td><td>Accounting Operations Intern</td></tr>
      <tr><td><strong>P10</strong></td><td>Business Operations</td><td>Inventory Management System</td><td>Business Operations Intern</td></tr>
    </tbody>
  </table>
  <p style="font-size: 8.8pt;"><em>Learning Flow:</em> Fundamentals ➔ guided implementation ➔ complete project ➔ simulated workplace assignments ➔ portfolio review.<br>
  <em>Outcome:</em> One focused project and evidence of practical skills aligned with an entry-level role.</p>

  <h3>C. Six-Month Packages — Professional Career Accelerators</h3>
  <p>Best for students seeking deeper technical ability and more substantial portfolio projects.</p>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Package</th>
        <th style="width: 28%;">Training Bundle</th>
        <th style="width: 32%;">One Portfolio Project</th>
        <th style="width: 28%;">Simulated Internship</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>P11</strong></td><td>Full-Stack Python</td><td>E-Commerce Web Application</td><td>Full-Stack Python Developer Intern</td></tr>
      <tr><td><strong>P12</strong></td><td>Full-Stack React</td><td>Learning Management System (LMS)</td><td>Frontend Developer Intern</td></tr>
      <tr><td><strong>P13</strong></td><td>Node.js Backend</td><td>Job Portal Backend System</td><td>Backend Developer Intern</td></tr>
      <tr><td><strong>P14</strong></td><td>Database Engineering</td><td>Enterprise Database Management System</td><td>Database Engineering Intern</td></tr>
      <tr><td><strong>P15</strong></td><td>SRE / DevOps</td><td>Automated CI/CD Deployment Pipeline</td><td>DevOps Engineer Intern</td></tr>
      <tr><td><strong>P16</strong></td><td>Excel</td><td>Advanced Sales Analytics Dashboard</td><td>MIS Analyst Intern</td></tr>
      <tr><td><strong>P17</strong></td><td>Accounting</td><td>Accounting & Financial Reporting System</td><td>Accounting Analyst Intern</td></tr>
      <tr><td><strong>P18</strong></td><td>Business Operations</td><td>Operations Analytics Dashboard</td><td>Business Operations Analyst Intern</td></tr>
    </tbody>
  </table>

  <h3>D. Nine-Month Packages — Future-Ready Career Pathways</h3>
  <p>Best for students who want to combine complementary skills rather than learn a single specialization. Designed around modern cloud, software engineering, and data analytics.</p>
  <table>
    <thead>
      <tr>
        <th style="width: 10%;">Pkg</th>
        <th style="width: 34%;">Combined Training Bundle</th>
        <th style="width: 30%;">One Capstone Project</th>
        <th style="width: 26%;">Simulated Internship</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>P19</strong></td><td>Full-Stack Python + Full-Stack React</td><td>Full-Stack E-Commerce Platform</td><td>Full-Stack Developer Intern</td></tr>
      <tr><td><strong>P20</strong></td><td>Full-Stack Python + Node.js Backend</td><td>Multi-Service Web Application</td><td>Backend Engineering Intern</td></tr>
      <tr><td><strong>P21</strong></td><td>Full-Stack Python + Database Engineering</td><td>Data-Driven Management Platform</td><td>Software & DB Engineer Intern</td></tr>
      <tr><td><strong>P22</strong></td><td>Full-Stack React + Node.js Backend</td><td>Full-Stack Job Portal</td><td>Full-Stack Developer Intern</td></tr>
      <tr><td><strong>P23</strong></td><td>Full-Stack Development + Database Eng</td><td>Enterprise Management System</td><td>Software Engineering Intern</td></tr>
      <tr><td><strong>P24</strong></td><td>Full-Stack Development + SRE/DevOps</td><td>Cloud-Deployed App with CI/CD</td><td>DevOps & Cloud Engineering Intern</td></tr>
      <tr><td><strong>P25</strong></td><td>Python + Database Eng + SRE/DevOps</td><td>Cloud Data Management Platform</td><td>Cloud & Backend Engineering Intern</td></tr>
      <tr><td><strong>P26</strong></td><td>React + Node.js + Database Engineering</td><td>SaaS Business Application</td><td>Full-Stack Software Engineer Intern</td></tr>
      <tr><td><strong>P27</strong></td><td>Full-Stack Dev + SRE/DevOps + Database</td><td>Scalable Cloud-Native Application</td><td>Cloud-Native Engineering Intern</td></tr>
      <tr><td><strong>P28</strong></td><td>Excel + Accounting + Business Operations</td><td>Integrated Finance & Ops Dashboard</td><td>Finance & Operations Intern</td></tr>
      <tr><td><strong>P29</strong></td><td>Accounting + Excel + Business Analytics</td><td>Financial Reporting & Analytics Platform</td><td>Financial Analyst Intern</td></tr>
      <tr><td><strong>P30</strong></td><td>Full-Stack + Business Operations + Excel</td><td>Business Management & Analytics Platform</td><td>Business Systems Analyst Intern</td></tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ========================================== -->
  <!-- PART 3: TIMELINE & FLAGSHIPS               -->
  <!-- ========================================== -->
  <h2>3. Recommended Learning Timeline & The 5 Launch Flagships</h2>

  <div class="grid-2">
    <div class="callout" style="margin: 0;">
      <div class="callout-title">Standard Operating Cadence</div>
      <p><strong>1-Month Programs (30 Days):</strong><br>
      • Days 1–15 (Training): Learn core curriculum and practice in guided daily labs.<br>
      • Days 16–23 (Project): Build and document designated portfolio project.<br>
      • Days 24–30 (Simulated Internship): Perform role-based tasks, meet deadlines, submit deliverables, and receive feedback.</p>
      
      <p style="margin-top: 6px;"><strong>3-Month & 6-Month Programs:</strong><br>
      • Month 1: Fundamentals & guided exercises.<br>
      • Middle Months: Advanced labs & project development.<br>
      • Final Month: Simulated internship assignments, code review, and oral defense.</p>
      
      <p style="margin-top: 6px;"><strong>9-Month Programs:</strong><br>
      • Months 1–3: First specialization (e.g. Python).<br>
      • Months 4–6: Complementary specialization (e.g. React/DevOps).<br>
      • Months 7–8: Multi-tier capstone project.<br>
      • Month 9: Simulated internship & portfolio validation.</p>
    </div>

    <div class="callout" style="margin: 0; border-left-color: var(--green);">
      <div class="callout-title">Top 5 Flagships to Launch First</div>
      <p>We recommend launching with these five flagship products rather than releasing all combinations simultaneously:</p>
      <ol style="margin-left: 16px; font-size: 8.8pt;">
        <li><strong>Full-Stack Developer Accelerator (6 or 9 Months):</strong><br>
        <em>Bundle:</em> Full-Stack Python + Full-Stack React (+ Node.js option)<br>
        <em>Project:</em> Full-Stack E-Commerce Platform | <em>Role:</em> Full-Stack Dev Intern</li>
        
        <li style="margin-top: 4px;"><strong>Cloud & DevOps Accelerator (6 or 9 Months):</strong><br>
        <em>Bundle:</em> SRE/DevOps + Database Eng + Full-Stack<br>
        <em>Project:</em> Cloud App with CI/CD | <em>Role:</em> DevOps & Cloud Intern</li>
        
        <li style="margin-top: 4px;"><strong>Data & Business Analytics Accelerator (3 or 6 Months):</strong><br>
        <em>Bundle:</em> Excel + Database Engineering (+ Business Ops)<br>
        <em>Project:</em> Business Analytics Dashboard | <em>Role:</em> Data & Business Analyst Intern</li>
        
        <li style="margin-top: 4px;"><strong>Finance & Operations Accelerator (3 or 9 Months):</strong><br>
        <em>Bundle:</em> Accounting + Excel + Business Operations<br>
        <em>Project:</em> Reporting & Operations Dashboard | <em>Role:</em> Finance & Ops Intern</li>
        
        <li style="margin-top: 4px;"><strong>Backend & Database Engineering Accelerator (6 or 9 Months):</strong><br>
        <em>Bundle:</em> Node.js Backend + Database Engineering<br>
        <em>Project:</em> Scalable SaaS Platform | <em>Role:</em> Backend & DB Eng Intern</li>
      </ol>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PART 4: MASTER 1-TO-37 ROSTER              -->
  <!-- ========================================== -->
  <h2>4. Master Roster: 37 Courses, 37 Projects & 37 Internship Roles</h2>
  <p>The complete 1-to-37 mapping connecting every academic course to its portfolio project and simulated job title:</p>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">#</th>
        <th style="width: 27%;">Master Course Name</th>
        <th style="width: 35%;">Production Portfolio Project</th>
        <th style="width: 33%;">Simulated Internship Role Title</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>Full-Stack Python</td><td>Personal Portfolio Website</td><td>Full-Stack Python Developer Intern</td></tr>
      <tr><td>2</td><td>Full-Stack React</td><td>Full-Stack Task Management App</td><td>Full-Stack React Developer Intern</td></tr>
      <tr><td>3</td><td>Node.js Backend</td><td>E-Commerce Web Application</td><td>Node.js Backend Developer Intern</td></tr>
      <tr><td>4</td><td>Database Engineering</td><td>Student Management System</td><td>Database Engineering Intern</td></tr>
      <tr><td>5</td><td>SRE/DevOps</td><td>Employee Management System</td><td>SRE/DevOps Engineer Intern</td></tr>
      <tr><td>6</td><td>Excel</td><td>Inventory Management System</td><td>Excel & MIS Analyst Intern</td></tr>
      <tr><td>7</td><td>Accounting</td><td>Library Management System</td><td>Accounting Intern</td></tr>
      <tr><td>8</td><td>Business Operations</td><td>Expense Tracker Application</td><td>Business Operations Intern</td></tr>
      <tr><td>9</td><td>HTML & CSS</td><td>Personal Finance Dashboard</td><td>Frontend Developer Intern</td></tr>
      <tr><td>10</td><td>JavaScript Fundamentals</td><td>Sales Analytics Dashboard</td><td>Backend Developer Intern</td></tr>
      <tr><td>11</td><td>TypeScript</td><td>Customer Relationship Management (CRM)</td><td>Software Development Intern</td></tr>
      <tr><td>12</td><td>Python Fundamentals</td><td>Learning Management System (LMS)</td><td>Web Application Developer Intern</td></tr>
      <tr><td>13</td><td>Object-Oriented Programming</td><td>Job Portal Application</td><td>API Development Intern</td></tr>
      <tr><td>14</td><td>Data Structures & Algorithms</td><td>Online Appointment Booking System</td><td>Software QA & Testing Intern</td></tr>
      <tr><td>15</td><td>Git & GitHub</td><td>Real-Time Chat Application</td><td>Automation Testing Intern</td></tr>
      <tr><td>16</td><td>Linux Fundamentals</td><td>REST API Development Project</td><td>DevOps Automation Intern</td></tr>
      <tr><td>17</td><td>Networking Fundamentals</td><td>Authentication & Authorization System</td><td>Cloud Engineering Intern</td></tr>
      <tr><td>18</td><td>Operating Systems</td><td>Blog Management Platform</td><td>Site Reliability Engineering Intern</td></tr>
      <tr><td>19</td><td>Software Engineering Principles</td><td>Food Delivery Application</td><td>Infrastructure Engineering Intern</td></tr>
      <tr><td>20</td><td>REST API Development</td><td>Online Examination System</td><td>Data Engineering Intern</td></tr>
      <tr><td>21</td><td>Authentication & Authorization</td><td>Hotel Reservation System</td><td>Data Analyst Intern</td></tr>
      <tr><td>22</td><td>Testing & Quality Assurance</td><td>Payroll Management System</td><td>Business Intelligence Intern</td></tr>
      <tr><td>23</td><td>CI/CD Engineering</td><td>Accounting & Financial Reporting System</td><td>Financial Analyst Intern</td></tr>
      <tr><td>24</td><td>Cloud Computing</td><td>Business Operations Dashboard</td><td>Accounting Operations Intern</td></tr>
      <tr><td>25</td><td>Docker & Containerization</td><td>Excel-Based Business Analytics Dashboard</td><td>Management Reporting Intern</td></tr>
      <tr><td>26</td><td>Kubernetes</td><td>Data Cleaning & Reporting Project</td><td>Business Analyst Intern</td></tr>
      <tr><td>27</td><td>Infrastructure as Code</td><td>Database Design & Optimization Project</td><td>Project Management Intern</td></tr>
      <tr><td>28</td><td>System Design</td><td>Automated Testing Framework</td><td>Product Operations Intern</td></tr>
      <tr><td>29</td><td>Microservices Architecture</td><td>CI/CD Pipeline Implementation</td><td>Technical Support Intern</td></tr>
      <tr><td>30</td><td>Data Engineering</td><td>Dockerized Application Deployment</td><td>IT Operations Intern</td></tr>
      <tr><td>31</td><td>Data Analytics</td><td>Kubernetes Deployment Project</td><td>Database Administrator Intern</td></tr>
      <tr><td>32</td><td>SQL & Database Design</td><td>Cloud Infrastructure Automation</td><td>Database Administrator Intern</td></tr>
      <tr><td>33</td><td>Financial Accounting</td><td>Infrastructure Monitoring Dashboard</td><td>Systems Administration Intern</td></tr>
      <tr><td>34</td><td>Management Accounting</td><td>Log Management & Alerting System</td><td>Application Support Intern</td></tr>
      <tr><td>35</td><td>Business Analytics</td><td>Microservices-Based Application</td><td>Software Integration Intern</td></tr>
      <tr><td>36</td><td>Project Management</td><td>ETL Data Pipeline</td><td>Technical Documentation Intern</td></tr>
      <tr><td>37</td><td>Business Communication</td><td>End-to-End Career Accelerator Capstone</td><td>Career Accelerator Capstone Intern</td></tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ========================================== -->
  <!-- PART 5: COMPLETE ENGINEERING AUDIT         -->
  <!-- ========================================== -->
  <h2>5. Engineering Audit: What Is Completed vs. What Needed to Do</h2>
  <p>To provide full transparency to shareholders and management, this section outlines our exact codebase completion status, what has been built, and the remaining execution plan:</p>

  <div class="callout" style="border-left-color: var(--green);">
    <div class="callout-title">Master Repository Build Statistics</div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 6px;">
      <div>
        <strong style="color: var(--green); font-size: 13pt;">12 COURSES</strong><br>
        <span style="font-size: 8.5pt;">100% Coded & Live Today (360 Daily Modules with tests & sandboxes).</span>
      </div>
      <div>
        <strong style="color: var(--accent); font-size: 13pt;">25 COURSES</strong><br>
        <span style="font-size: 8.5pt;">Architecture & Days 1–5 Live (Complete 30-day syllabi formalized).</span>
      </div>
      <div>
        <strong style="color: var(--secondary); font-size: 13pt;">520+ MODULES</strong><br>
        <span style="font-size: 8.5pt;">Total Live Daily Classes in repository across all tracks.</span>
      </div>
    </div>
  </div>

  <p><strong>Course-by-Course Technical Audit & Roadmap:</strong></p>

  <div class="grid-2">
    <!-- Course 1 -->
    <div class="course-card">
      <h4>1. Full-Stack Python</h4>
      <p><strong>Non-Tech Concept:</strong> Global backbone for AI, web APIs, and data. Builds robust backend systems.</p>
      <p><strong>Topics We Teach:</strong> Logic execution, lists/dicts, OOP, FastAPI REST endpoints, and PostgreSQL ledgers.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 2 -->
    <div class="course-card">
      <h4>2. Full-Stack React</h4>
      <p><strong>Non-Tech Concept:</strong> Modern visual frontend framework powering responsive consumer applications.</p>
      <p><strong>Topics We Teach:</strong> Component trees, state hooks, Server-Side Rendering (SSR), and mobile-responsive UI.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 3 -->
    <div class="course-card">
      <h4>3. Node.js Backend</h4>
      <p><strong>Non-Tech Concept:</strong> High-concurrency server engine coordinating thousands of client requests simultaneously.</p>
      <p><strong>Topics We Teach:</strong> Event loop, Express middleware, REST APIs, JWT authentication, and Prisma ORM.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 4 -->
    <div class="course-card">
      <h4>4. Database Engineering</h4>
      <p><strong>Non-Tech Concept:</strong> The secure digital vault storing all customer profiles and financial records safely.</p>
      <p><strong>Topics We Teach:</strong> Relational SQL, index B-trees, ACID transactions, connection pools, and query optimization.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 5 -->
    <div class="course-card">
      <h4>5. SRE / DevOps</h4>
      <p><strong>Non-Tech Concept:</strong> Automated assembly line that tests, packages, and deploys software with zero errors.</p>
      <p><strong>Topics We Teach:</strong> Docker containerization, GitHub Actions workflows, Kubernetes clusters, and canary rollouts.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 6 -->
    <div class="course-card">
      <h4>6. Excel & Data Analysis</h4>
      <p><strong>Non-Tech Concept:</strong> The universal numbers language of corporate business, finance, and executive boards.</p>
      <p><strong>Topics We Teach:</strong> Formulas, VLOOKUP/XLOOKUP, Pivot Tables, data cleaning, and KPI executive dashboards.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 7 -->
    <div class="course-card">
      <h4>7. Digital Accounting & Taxation</h4>
      <p><strong>Non-Tech Concept:</strong> Computerized corporate bookkeeping, automated tax calculations, and cloud ERP workflows.</p>
      <p><strong>Topics We Teach:</strong> Double-entry bookkeeping, Tally Prime ERP, GST tax compliance, and automated payroll runs.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 8 -->
    <div class="course-card">
      <h4>8. Business Operations & Supply Chain</h4>
      <p><strong>Non-Tech Concept:</strong> Managing the physical movement of goods and manufacturing products on time with zero waste.</p>
      <p><strong>Topics We Teach:</strong> Process mapping, inventory control (EOQ/ROP), supplier procurement, and Lean Six Sigma quality.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 9 -->
    <div class="course-card">
      <h4>9. Data Structures & Algorithms</h4>
      <p><strong>Non-Tech Concept:</strong> Mathematical science of organizing data so applications execute in milliseconds.</p>
      <p><strong>Topics We Teach:</strong> Big-O complexity, binary search trees, hash tables, graph traversals, and dynamic programming.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 10 -->
    <div class="course-card">
      <h4>10. Cybersecurity Principles</h4>
      <p><strong>Non-Tech Concept:</strong> Digital defense shield protecting company networks and customer records from hackers.</p>
      <p><strong>Topics We Teach:</strong> OWASP Top 10 defenses, AES encryption, SQL injection prevention, and security audits.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 11 -->
    <div class="course-card">
      <h4>11. High-Scale Distributed Systems</h4>
      <p><strong>Non-Tech Concept:</strong> Architecting platforms that handle millions of simultaneous transactions without crashing.</p>
      <p><strong>Topics We Teach:</strong> Load balancers, Redis in-memory caches, message queues, database sharding, and fault tolerance.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 12 -->
    <div class="course-card">
      <h4>12. Computer Literacy & OS Fundamentals</h4>
      <p><strong>Non-Tech Concept:</strong> Level-0 starting point ensuring any student navigates operating systems effortlessly.</p>
      <p><strong>Topics We Teach:</strong> OS navigation, command-line terminal (CLI), file systems, cloud storage, and digital hygiene.</p>
      <div class="card-footer" style="color: var(--green);">
        ✔ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining: 0 Days
      </div>
    </div>

    <!-- Course 13 -->
    <div class="course-card">
      <h4>13. Java Fundamentals & Core Logic</h4>
      <p><strong>Non-Tech Concept:</strong> Industrial programming workhorse running global banking and legacy enterprise systems.</p>
      <p><strong>Topics We Teach:</strong> Conditionals, OOP inheritance, garbage collection, collections framework, and multithreading.</p>
      <div class="card-footer" style="color: var(--amber);">
        ⚡ Build Status: Coded: 17 / 30 Days (56% Complete) | Remaining to Code: 13 Days
      </div>
    </div>

    <!-- Course 14 -->
    <div class="course-card">
      <h4>14. Cloud Native Architectures (AWS)</h4>
      <p><strong>Non-Tech Concept:</strong> Renting scalable supercomputing power from Amazon instead of physical office servers.</p>
      <p><strong>Topics We Teach:</strong> Virtual servers (EC2), serverless Lambda functions, S3 storage buckets, and API gateways.</p>
      <div class="card-footer" style="color: var(--amber);">
        ⚡ Build Status: Coded: 5 / 30 Days (16% Complete) | Remaining to Code: 25 Days
      </div>
    </div>

    <!-- Course 15 -->
    <div class="course-card">
      <h4>15. AI Engineering & LLM Integration</h4>
      <p><strong>Non-Tech Concept:</strong> Embedding generative AI (ChatGPT/Claude) into software to automate business operations.</p>
      <p><strong>Topics We Teach:</strong> Prompt engineering, Retrieval-Augmented Generation (RAG), vector embeddings, and agent loops.</p>
      <div class="card-footer" style="color: var(--amber);">
        ⚡ Build Status: Coded: 5 / 30 Days (16% Complete) | Remaining to Code: 25 Days
      </div>
    </div>

    <!-- Course 16 -->
    <div class="course-card">
      <h4>16. Quantitative Systems & Trading</h4>
      <p><strong>Non-Tech Concept:</strong> Building hyper-speed financial software for Wall Street where trades execute in microseconds.</p>
      <p><strong>Topics We Teach:</strong> Electronic Limit Order Books (LOB), trade matching engines, VWAP algorithms, and latency physics.</p>
      <div class="card-footer" style="color: var(--amber);">
        ⚡ Build Status: Coded: 5 / 30 Days (16% Complete) | Remaining to Code: 25 Days
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ========================================== -->
  <!-- PART 6: HOW WE TEACH                       -->
  <!-- ========================================== -->
  <h2>6. How We Teach — The Proprietary 4-Stage AI Pedagogy Engine</h2>
  <p>To guarantee that students master skills rather than abandoning courses, PinIT Career OS replaces passive video watching with an automated four-stage active learning engine:</p>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 12px 0;">
    <div class="card" style="border-left: 4px solid var(--accent);">
      <h4 style="color: var(--accent);">Stage 1: 20-Minute Conversational AI Avatar</h4>
      <p>A photorealistic AI mentor explains concepts conversationally in plain words. Uses everyday physical metaphors (e.g., explaining memory registers as post office mailboxes) with zero confusing jargon.</p>
      <p style="font-size: 8.5pt; color: var(--accent); font-weight: bold; margin-top: auto;">Institutional Moat: Eliminates expensive human instructor scaling bottlenecks.</p>
    </div>

    <div class="card" style="border-left: 4px solid var(--secondary);">
      <h4 style="color: var(--secondary);">Stage 2: Synchronized Dynamic Visual Stage</h4>
      <p>As the avatar speaks, the interactive screen dynamically animates architectural diagrams, memory flows, and state machines in real-time. Students can tap diagram nodes to explore data paths.</p>
      <p style="font-size: 8.5pt; color: var(--secondary); font-weight: bold; margin-top: auto;">Institutional Moat: 5x higher completion rates compared to static video tutorials.</p>
    </div>

    <div class="card" style="border-left: 4px solid var(--amber);">
      <h4 style="color: var(--amber);">Stage 3: Socratic Knowledge Checks (MCQs)</h4>
      <p>Every single concept concludes with an interactive question. If a student chooses incorrectly, the system explains <em>why</em> that mental model was flawed and guides them back to the right path.</p>
      <p style="font-size: 8.5pt; color: var(--amber); font-weight: bold; margin-top: auto;">Institutional Moat: Immediate formative remediation; zero students left behind.</p>
    </div>

    <div class="card" style="border-left: 4px solid var(--green);">
      <h4 style="color: var(--green);">Stage 4: Zero-Setup Interactive Browser Lab</h4>
      <p>Students write and run real code inside an isolated cloud sandbox right in the web browser. Automated assertion test runners verify code on the fly with immediate pass/fail feedback.</p>
      <p style="font-size: 8.5pt; color: var(--green); font-weight: bold; margin-top: auto;">Institutional Moat: Zero computer setup friction; 100% genuine code verification.</p>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PART 7: EXECUTIVE SHAREHOLDER SUMMARY      -->
  <!-- ========================================== -->
  <h2>7. Executive Financial & Commercial Takeaways for Shareholders</h2>
  <div class="callout" style="border-left-color: var(--green);">
    <p><strong>1. Immediate Commercial Revenue Readiness:</strong><br>
    The company does not need to wait for all 37 courses to finish before selling. We can immediately market and monetize complete 1-Month, 3-Month, and 6-Month career packages using our <strong>12 fully-finished courses</strong> (Full-Stack Python, Full-Stack React, Node.js Backend, Database Engineering, SRE/DevOps, Excel, Accounting, and Business Operations).</p>
    
    <p style="margin-top: 8px;"><strong>2. High Capital Efficiency with Deterministic Velocity:</strong><br>
    All 37 mastercourses have their complete 30-day curriculum blueprints, real-world metaphors, and test criteria formalized in master specification files. Expanding the remaining 25 courses requires zero architectural redesign—they utilize our automated testing pipeline with predictable, low-cost delivery.</p>
    
    <p style="margin-top: 8px;"><strong>3. 100% Owned Intellectual Property:</strong><br>
    Unlike conventional bootcamps that license third-party content, PinIT owns 100% of its curriculum blueprints, code sandboxes, simulated internship desks, and automated assessment engines.</p>
  </div>

  <!-- FOOTER -->
  <div class="footer-stamp">
    <span>PinIT Career OS — Confidential Master Executive Blueprint</span>
    <span>Generated: October 2026 • Verified Codebase Audit</span>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'master_executive_plan.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML written to: ' + htmlFilePath);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('file:///' + htmlFilePath.replace(/\\\\/g, '/'), { waitUntil: 'networkidle' });
  
  const destPdf = 'C:\\\\Users\\\\Admin\\\\Desktop\\\\PinitCareer_Accelerator_Packages_Executive_Plan.pdf';
  await page.pdf({
    path: destPdf,
    format: 'A4',
    margin: { top: '15mm', right: '14mm', bottom: '15mm', left: '14mm' },
    printBackground: true
  });

  console.log('Master Executive Plan PDF successfully created at: ' + destPdf);
  await browser.close();
})();
