const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// We will write an HTML file optimized for 16:9 PDF printing (1920x1080 per slide)
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PinIT Career OS — Shareholder Presentation</title>
  <style>
    @page {
      size: 1920px 1080px;
      margin: 0;
    }
    :root {
      --bg: #0b0f19;
      --card-bg: #18212f;
      --card-border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent-blue: #38bdf8;
      --accent-indigo: #818cf8;
      --green: #10b981;
      --amber: #f59e0b;
      --pink: #ec4899;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .slide {
      width: 1920px;
      height: 1080px;
      padding: 60px 80px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      page-break-after: always;
      position: relative;
      background: var(--bg);
      overflow: hidden;
    }
    .header {
      margin-bottom: 24px;
    }
    .tag {
      font-size: 16px;
      font-weight: 700;
      color: var(--accent-blue);
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .title {
      font-size: 38px;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.5px;
      border-bottom: 2px solid #1e293b;
      padding-bottom: 16px;
    }
    .banner {
      background: #1e293b;
      border: 1px solid var(--accent-blue);
      border-radius: 10px;
      padding: 16px 24px;
      font-size: 19px;
      font-weight: 700;
      color: var(--text);
      text-align: center;
      margin-bottom: 28px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      flex: 1;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      flex: 1;
    }
    .grid-5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
      flex: 1;
    }
    .grid-4-boxes {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 24px;
      flex: 1;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--accent-blue);
      margin-bottom: 12px;
    }
    .card-meta {
      font-size: 15px;
      line-height: 1.5;
      color: var(--text);
      margin-bottom: 12px;
    }
    .card-meta strong {
      color: var(--text-muted);
    }
    .topics-box {
      font-size: 14.5px;
      line-height: 1.5;
      color: #cbd5e1;
      margin-bottom: 16px;
    }
    .topics-box strong {
      color: var(--accent-indigo);
    }
    .build-status {
      font-size: 14px;
      font-weight: 700;
      padding: 10px 14px;
      border-radius: 8px;
      background: #0f172a;
      border: 1px solid var(--card-border);
      margin-top: auto;
    }
    .status-done {
      color: var(--green);
      border-color: rgba(16, 185, 129, 0.4);
    }
    .status-progress {
      color: var(--amber);
      border-color: rgba(245, 158, 11, 0.4);
    }
    ul.styled-list {
      list-style: none;
    }
    ul.styled-list li {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 8px;
      position: relative;
      padding-left: 24px;
      color: #e2e8f0;
    }
    ul.styled-list li::before {
      content: "•";
      color: var(--accent-blue);
      font-weight: bold;
      font-size: 20px;
      position: absolute;
      left: 6px;
      top: -2px;
    }
    .footer-note {
      font-size: 14px;
      color: var(--text-muted);
      border-top: 1px solid #1e293b;
      padding-top: 12px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <!-- SLIDE 1: Executive Strategy: Career Accelerator Packages -->
  <div class="slide">
    <div class="header">
      <div class="tag">Executive Portfolio Blueprint • PinIT Career OS</div>
      <h1 class="title">Career Accelerator Packages: Program Flow & Market Strategy</h1>
    </div>
    <div class="banner">
      🎯 Core Product Thesis: 1 Training Bundle  +  1 Portfolio Project  +  1 Simulated Internship Program
    </div>
    <div class="grid-4">
      <div class="card" style="border-color: var(--accent-blue);">
        <h3 class="card-title" style="color: var(--accent-blue);">1. Training Bundle</h3>
        <p class="card-meta">Structured courses matched to the package duration (1, 3, 6, or 9 months). Covers foundational concepts, interactive coding sandboxes, and enterprise architectural principles.</p>
        <div class="topics-box"><strong>Outcome:</strong> Clear conceptual mastery with daily active coding.</div>
      </div>
      <div class="card" style="border-color: var(--accent-indigo);">
        <h3 class="card-title" style="color: var(--accent-indigo);">2. Portfolio Project</h3>
        <p class="card-meta">One practical, production-grade project built by the learner to demonstrate real technical ability and business acumen.</p>
        <div class="topics-box"><strong>Outcome:</strong> Production code samples ready for employer inspection.</div>
      </div>
      <div class="card" style="border-color: var(--amber);">
        <h3 class="card-title" style="color: var(--amber);">3. Simulated Internship</h3>
        <p class="card-meta">A supervised work-style experience replicating workplace responsibilities with role-specific tasks, sprint deadlines, and senior code reviews.</p>
        <div class="topics-box"><strong>Outcome:</strong> Verifiable experience bridging the graduate hiring gap.</div>
      </div>
      <div class="card" style="border-color: var(--green);">
        <h3 class="card-title" style="color: var(--green);">4. Career Portfolio</h3>
        <p class="card-meta">Project demonstration, code repository, architectural documentation, and verifiable completion records with permanent QR links.</p>
        <div class="topics-box"><strong>Outcome:</strong> Employer-verifiable proof of real-world competence.</div>
      </div>
    </div>
    <div class="card" style="margin-top: 24px; padding: 16px 24px;">
      <div style="font-size: 14.5px; color: var(--accent-blue); font-weight: bold; margin-bottom: 4px;">Commercial Clarification for Shareholders & Partners:</div>
      <div style="font-size: 13.5px; color: var(--text-muted); line-height: 1.5;">The simulated internship is a supervised training experience designed to replicate workplace responsibilities. It is marketed transparently as career preparation and hands-on experience, eliminating placement liabilities while delivering unmatched student confidence.</div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 1 of 16</span></div>
  </div>

  <!-- SLIDE 2: Master Course Names (1 to 37) -->
  <div class="slide">
    <div class="header">
      <div class="tag">Official Course Roster (1–37) • PinIT Career OS</div>
      <h1 class="title">Master Course Catalog: 37 Foundational Programs</h1>
    </div>
    <div class="banner">
      📚 37 Comprehensive Career Mastercourses Spanning Engineering, Cloud, Systems & Commerce
    </div>
    <div class="grid-4">
      <div class="card">
        <h3 class="card-title">Core Engineering & Stacks</h3>
        <ul class="styled-list" style="font-size: 14px;">
          <li>1. Full-Stack Python</li>
          <li>2. Full-Stack React</li>
          <li>3. Node.js Backend</li>
          <li>4. Database Engineering</li>
          <li>5. SRE/DevOps</li>
          <li>6. Excel</li>
          <li>7. Accounting</li>
          <li>8. Business Operations</li>
          <li>9. HTML & CSS</li>
          <li>10. JavaScript Fundamentals</li>
        </ul>
      </div>
      <div class="card">
        <h3 class="card-title">Programming & Core CS</h3>
        <ul class="styled-list" style="font-size: 14px;">
          <li>11. TypeScript</li>
          <li>12. Python Fundamentals</li>
          <li>13. Object-Oriented Prog.</li>
          <li>14. Data Structures & Algo</li>
          <li>15. Git & GitHub</li>
          <li>16. Linux Fundamentals</li>
          <li>17. Networking Fundamentals</li>
          <li>18. Operating Systems</li>
          <li>19. Software Engineering</li>
        </ul>
      </div>
      <div class="card">
        <h3 class="card-title">APIs, Cloud & DevOps</h3>
        <ul class="styled-list" style="font-size: 14px;">
          <li>20. REST API Development</li>
          <li>21. Authentication & Auth</li>
          <li>22. Testing & QA</li>
          <li>23. CI/CD Engineering</li>
          <li>24. Cloud Computing</li>
          <li>25. Docker & Containers</li>
          <li>26. Kubernetes</li>
          <li>27. Infrastructure as Code</li>
          <li>28. System Design</li>
        </ul>
      </div>
      <div class="card">
        <h3 class="card-title">Data, Analytics & Business</h3>
        <ul class="styled-list" style="font-size: 14px;">
          <li>29. Microservices Arch</li>
          <li>30. Data Engineering</li>
          <li>31. Data Analytics</li>
          <li>32. SQL & Database Design</li>
          <li>33. Financial Accounting</li>
          <li>34. Management Accounting</li>
          <li>35. Business Analytics</li>
          <li>36. Project Management</li>
          <li>37. Business Communication</li>
        </ul>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 2 of 16</span></div>
  </div>

  <!-- SLIDE 3: Master Project Titles & Matching Internship Roles -->
  <div class="slide">
    <div class="header">
      <div class="tag">Role-Based Specialization (1–37) • PinIT Career OS</div>
      <h1 class="title">Master Project Titles & Matching Internship Roles</h1>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title" style="color: var(--accent-blue);">🛠️ 37 Production Portfolio Projects</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12.5px; color: #cbd5e1; line-height: 1.4;">
          <div>1. Personal Portfolio Website</div><div>2. Full-Stack Task Manager</div>
          <div>3. E-Commerce Web Application</div><div>4. Student Management System</div>
          <div>5. Employee Management System</div><div>6. Inventory Management System</div>
          <div>7. Library Management System</div><div>8. Expense Tracker Application</div>
          <div>9. Personal Finance Dashboard</div><div>10. Sales Analytics Dashboard</div>
          <div>11. CRM System Platform</div><div>12. Learning Management System</div>
          <div>13. Job Portal Application</div><div>14. Online Appointment Booking</div>
          <div>15. Real-Time Chat App</div><div>16. REST API Development</div>
          <div>17. Auth & Security System</div><div>18. Blog Management Platform</div>
          <div>19. Food Delivery Application</div><div>20. Online Examination System</div>
          <div>21. Hotel Reservation System</div><div>22. Payroll Management System</div>
          <div>23. Accounting & Financial Reports</div><div>24. Business Operations Dashboard</div>
          <div>25. Excel Business Analytics</div><div>26. Data Cleaning & Reporting</div>
          <div>27. Database Design & Optim</div><div>28. Automated Testing Suite</div>
          <div>29. CI/CD Deployment Pipeline</div><div>30. Dockerized App Deployment</div>
          <div>31. Kubernetes Cluster Project</div><div>32. Cloud Automation Suite</div>
          <div>33. Infrastructure Monitoring</div><div>34. Log Alerting System</div>
          <div>35. Microservices Application</div><div>36. ETL Data Pipeline Engine</div>
          <div style="grid-column: span 2; color: var(--accent-blue); font-weight: bold; margin-top: 4px;">37. End-to-End Career Accelerator Capstone</div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title" style="color: var(--green);">💼 37 Industry Internship Role Titles</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12.5px; color: #cbd5e1; line-height: 1.4;">
          <div>1. Full-Stack Python Dev Intern</div><div>2. Full-Stack React Dev Intern</div>
          <div>3. Node.js Backend Dev Intern</div><div>4. Database Engineering Intern</div>
          <div>5. SRE/DevOps Engineer Intern</div><div>6. Excel & MIS Analyst Intern</div>
          <div>7. Accounting Intern</div><div>8. Business Operations Intern</div>
          <div>9. Frontend Developer Intern</div><div>10. Backend Developer Intern</div>
          <div>11. Software Development Intern</div><div>12. Web App Developer Intern</div>
          <div>13. API Development Intern</div><div>14. Software QA & Test Intern</div>
          <div>15. Automation Testing Intern</div><div>16. DevOps Automation Intern</div>
          <div>17. Cloud Engineering Intern</div><div>18. Site Reliability Intern</div>
          <div>19. Infrastructure Engineer Intern</div><div>20. Data Engineering Intern</div>
          <div>21. Data Analyst Intern</div><div>22. Business Intelligence Intern</div>
          <div>23. Financial Analyst Intern</div><div>24. Accounting Operations Intern</div>
          <div>25. Management Reporting Intern</div><div>26. Business Analyst Intern</div>
          <div>27. Project Management Intern</div><div>28. Product Operations Intern</div>
          <div>29. Technical Support Intern</div><div>30. IT Operations Intern</div>
          <div>31. Database Administrator Intern</div><div>32. Systems Admin Intern</div>
          <div>33. Application Support Intern</div><div>34. Software Integration Intern</div>
          <div>35. Technical Documentation Intern</div><div>36. Quality Assurance Intern</div>
          <div style="grid-column: span 2; color: var(--green); font-weight: bold; margin-top: 4px;">37. Career Accelerator Capstone Intern</div>
        </div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 3 of 16</span></div>
  </div>

  <!-- SLIDE 4: Commercial Packages — 1-Month & 3-Month Programs -->
  <div class="slide">
    <div class="header">
      <div class="tag">Commercial Monetization Catalog • PinIT Career OS</div>
      <h1 class="title">Commercial Packages: 1-Month Starters & 3-Month Foundations</h1>
    </div>
    <div class="grid-2">
      <div class="card" style="border-color: var(--accent-blue);">
        <h3 class="card-title" style="color: var(--accent-blue);">1-Month Career Starters (P01–P03)</h3>
        <p class="card-meta" style="color: var(--text-muted); font-size: 14px;">Focused, high-impact introductory packages for rapid practical upskilling.</p>
        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 12px;">
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-weight: bold; color: var(--text); font-size: 15px;">P01: Excel Career Starter</div>
            <div style="font-size: 13.5px; color: var(--accent-indigo);">Project: Business Analytics Dashboard</div>
            <div style="font-size: 13px; color: var(--green);">Internship: Excel & MIS Analyst Intern</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-weight: bold; color: var(--text); font-size: 15px;">P02: Accounting Career Starter</div>
            <div style="font-size: 13.5px; color: var(--accent-indigo);">Project: Financial Reporting System</div>
            <div style="font-size: 13px; color: var(--green);">Internship: Accounting Intern</div>
          </div>
          <div style="background: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-weight: bold; color: var(--text); font-size: 15px;">P03: Business Operations Starter</div>
            <div style="font-size: 13.5px; color: var(--accent-indigo);">Project: Operations KPI Dashboard</div>
            <div style="font-size: 13px; color: var(--green);">Internship: Business Operations Intern</div>
          </div>
        </div>
      </div>

      <div class="card" style="border-color: var(--green);">
        <h3 class="card-title" style="color: var(--green);">3-Month Job-Ready Foundations (P04–P10)</h3>
        <p class="card-meta" style="color: var(--text-muted); font-size: 14px;">Comprehensive technical or business foundations for entry-level career targeting.</p>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px; font-size: 13.5px;">
          <div style="background: #0f172a; padding: 8px 12px; border-radius: 6px;"><strong>P04: Full-Stack Python:</strong> Task Management App ➔ Python Dev Intern</div>
          <div style="background: #0f172a; padding: 8px 12px; border-radius: 6px;"><strong>P05: Full-Stack React:</strong> Responsive Web App ➔ Frontend Dev Intern</div>
          <div style="background: #0f172a; padding: 8px 12px; border-radius: 6px;"><strong>P06: Node.js Backend:</strong> Production REST API ➔ Backend Dev Intern</div>
          <div style="background: #0f172a; padding: 8px 12px; border-radius: 6px;"><strong>P07: Database Engineering:</strong> DB Design & Optim ➔ Database Eng Intern</div>
          <div style="background: #0f172a; padding: 8px 12px; border-radius: 6px;"><strong>P08: Excel & MIS Pro:</strong> Automated Dashboard ➔ Excel & MIS Analyst Intern</div>
          <div style="background: #0f172a; padding: 8px 12px; border-radius: 6px;"><strong>P09: Accounting Ops:</strong> Payroll Management System ➔ Accounting Ops Intern</div>
          <div style="background: #0f172a; padding: 8px 12px; border-radius: 6px;"><strong>P10: Business Ops:</strong> Inventory Management System ➔ Business Ops Intern</div>
        </div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 4 of 16</span></div>
  </div>

  <!-- SLIDE 5: Commercial Packages — 6-Month & 9-Month Programs -->
  <div class="slide">
    <div class="header">
      <div class="tag">Advanced Career Pathways • PinIT Career OS</div>
      <h1 class="title">Commercial Packages: 6-Month Accelerators & 9-Month Pathways</h1>
    </div>
    <div class="grid-2">
      <div class="card" style="border-color: var(--accent-indigo);">
        <h3 class="card-title" style="color: var(--accent-indigo);">6-Month Professional Accelerators (P11–P18)</h3>
        <p class="card-meta" style="color: var(--text-muted); font-size: 14px;">Deeper technical depth, production architectural rigor, and substantial portfolios.</p>
        <div style="display: flex; flex-direction: column; gap: 7px; margin-top: 8px; font-size: 13px;">
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P11: Full-Stack Python:</strong> E-Commerce Web App ➔ Full-Stack Python Dev Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P12: Full-Stack React:</strong> Learning Management System ➔ Frontend Dev Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P13: Node.js Backend:</strong> Job Portal Backend ➔ Backend Developer Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P14: Database Engineering:</strong> Enterprise DBMS ➔ Database Eng Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P15: SRE / DevOps:</strong> Automated CI/CD Pipeline ➔ DevOps Engineer Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P16: Advanced Excel:</strong> Advanced Sales Analytics ➔ MIS Analyst Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P17: Accounting Analyst:</strong> Financial Reporting System ➔ Accounting Analyst Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P18: Operations Analyst:</strong> Operations Analytics ➔ Business Ops Analyst Intern</div>
        </div>
      </div>

      <div class="card" style="border-color: var(--amber);">
        <h3 class="card-title" style="color: var(--amber);">9-Month Future-Ready Pathways (P19–P30)</h3>
        <p class="card-meta" style="color: var(--text-muted); font-size: 14px;">Multi-disciplinary skill combinations matching high-value enterprise engineering roles.</p>
        <div style="display: flex; flex-direction: column; gap: 7px; margin-top: 8px; font-size: 13px;">
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P19: Python + React:</strong> E-Commerce Platform ➔ Full-Stack Dev Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P20: Python + Node.js:</strong> Multi-Service Web App ➔ Backend Eng Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P21: Python + Databases:</strong> Data Management Platform ➔ Software & DB Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P24: Full-Stack + SRE/DevOps:</strong> Cloud App with CI/CD ➔ DevOps & Cloud Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P25: Python + DB + DevOps:</strong> Cloud Data Platform ➔ Cloud & Backend Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P26: React + Node + DB:</strong> Complete SaaS Application ➔ Full-Stack Software Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P28: Excel + Acct + Ops:</strong> Integrated Finance & Ops ➔ Finance & Ops Intern</div>
          <div style="background: #0f172a; padding: 7px 10px; border-radius: 6px;"><strong>P29: Acct + Excel + Analytics:</strong> Reporting & Analytics ➔ Financial Analyst Intern</div>
        </div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 5 of 16</span></div>
  </div>

  <!-- SLIDE 6: Go-to-Market Strategy: Top 5 Flagships to Launch First -->
  <div class="slide">
    <div class="header">
      <div class="tag">Immediate Revenue Strategy • PinIT Career OS</div>
      <h1 class="title">Go-to-Market Strategy: Top 5 Flagships to Launch First</h1>
    </div>
    <div class="banner">
      🚀 Focusing on 5 High-Demand Flagship Products Before Expanding All Combinations
    </div>
    <div class="grid-5">
      <div class="card" style="border-color: var(--green);">
        <h3 class="card-title" style="color: var(--green); font-size: 18px;">1. Full-Stack Developer</h3>
        <div style="font-size: 13px; font-weight: bold; color: var(--text); margin-bottom: 8px;">Duration: 6 or 9 Months</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Bundle:</strong> Full-Stack Python + Full-Stack React (+ Node.js)</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Project:</strong> Full-Stack E-Commerce Platform</div>
        <div style="font-size: 12.5px; color: var(--green); font-weight: bold; margin-top: auto;">Intern: Full-Stack Developer Intern</div>
      </div>

      <div class="card" style="border-color: var(--accent-blue);">
        <h3 class="card-title" style="color: var(--accent-blue); font-size: 18px;">2. Cloud & DevOps</h3>
        <div style="font-size: 13px; font-weight: bold; color: var(--text); margin-bottom: 8px;">Duration: 6 or 9 Months</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Bundle:</strong> SRE/DevOps + Database Eng + Full-Stack</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Project:</strong> Cloud-Deployed App with CI/CD</div>
        <div style="font-size: 12.5px; color: var(--accent-blue); font-weight: bold; margin-top: auto;">Intern: DevOps & Cloud Eng Intern</div>
      </div>

      <div class="card" style="border-color: var(--accent-indigo);">
        <h3 class="card-title" style="color: var(--accent-indigo); font-size: 18px;">3. Data & Analytics</h3>
        <div style="font-size: 13px; font-weight: bold; color: var(--text); margin-bottom: 8px;">Duration: 3 or 6 Months</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Bundle:</strong> Excel + Database Eng (+ Business Ops)</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Project:</strong> Business Analytics Dashboard</div>
        <div style="font-size: 12.5px; color: var(--accent-indigo); font-weight: bold; margin-top: auto;">Intern: Data & Business Analyst Intern</div>
      </div>

      <div class="card" style="border-color: var(--amber);">
        <h3 class="card-title" style="color: var(--amber); font-size: 18px;">4. Finance & Ops</h3>
        <div style="font-size: 13px; font-weight: bold; color: var(--text); margin-bottom: 8px;">Duration: 3 or 9 Months</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Bundle:</strong> Accounting + Excel + Business Operations</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Project:</strong> Financial Reporting & Ops Dashboard</div>
        <div style="font-size: 12.5px; color: var(--amber); font-weight: bold; margin-top: auto;">Intern: Finance & Operations Intern</div>
      </div>

      <div class="card" style="border-color: var(--pink);">
        <h3 class="card-title" style="color: var(--pink); font-size: 18px;">5. Backend & Databases</h3>
        <div style="font-size: 13px; font-weight: bold; color: var(--text); margin-bottom: 8px;">Duration: 6 or 9 Months</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Bundle:</strong> Node.js Backend + Database Engineering</div>
        <div style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 6px;"><strong>Project:</strong> Scalable SaaS Backend Platform</div>
        <div style="font-size: 12.5px; color: var(--pink); font-weight: bold; margin-top: auto;">Intern: Backend & DB Eng Intern</div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 6 of 16</span></div>
  </div>

  <!-- SLIDE 7: Program Delivery Timeline & Structure -->
  <div class="slide">
    <div class="header">
      <div class="tag">Academic & Operational Rhythm • PinIT Career OS</div>
      <h1 class="title">Program Delivery Timeline & Operating Cadence</h1>
    </div>
    <div style="display: flex; flex-direction: column; gap: 24px; flex: 1;">
      <div class="card" style="border-color: var(--accent-blue);">
        <h3 class="card-title" style="color: var(--accent-blue);">The 1-Month Standard Delivery Model (30-Day Intensive)</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 12px;">
          <div style="background: #0f172a; padding: 16px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-weight: bold; color: var(--accent-blue); font-size: 16px;">Days 1 to 15</div>
            <div style="font-weight: bold; color: var(--text); font-size: 14.5px; margin: 4px 0;">Core Training</div>
            <div style="font-size: 13.5px; color: var(--text-muted); line-height: 1.4;">Master the core curriculum, complete daily guided interactive sandboxes, and build technical foundations.</div>
          </div>
          <div style="background: #0f172a; padding: 16px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-weight: bold; color: var(--accent-indigo); font-size: 16px;">Days 16 to 23</div>
            <div style="font-weight: bold; color: var(--text); font-size: 14.5px; margin: 4px 0;">Portfolio Project</div>
            <div style="font-size: 13.5px; color: var(--text-muted); line-height: 1.4;">Design, build, and document the designated portfolio project with automated code assertion verification.</div>
          </div>
          <div style="background: #0f172a; padding: 16px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-weight: bold; color: var(--green); font-size: 16px;">Days 24 to 30</div>
            <div style="font-weight: bold; color: var(--text); font-size: 14.5px; margin: 4px 0;">Simulated Internship</div>
            <div style="font-size: 13.5px; color: var(--text-muted); line-height: 1.4;">Perform role-based workplace assignments, meet sprint deadlines, submit deliverables, and receive feedback.</div>
          </div>
        </div>
      </div>

      <div class="card" style="border-color: var(--green);">
        <h3 class="card-title" style="color: var(--green);">The 3, 6 & 9-Month Progressive Acceleration Models</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 12px;">
          <div style="background: #0f172a; padding: 16px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-weight: bold; color: var(--text); font-size: 15px;">Stage 1: Core Fundamentals</div>
            <div style="font-size: 13.5px; color: var(--text-muted); line-height: 1.4; margin-top: 6px;">Month 1 establishes foundational code and business concepts through daily 20-min AI avatar lessons.</div>
          </div>
          <div style="background: #0f172a; padding: 16px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-weight: bold; color: var(--text); font-size: 15px;">Stage 2: Advanced Labs & Project</div>
            <div style="font-size: 13.5px; color: var(--text-muted); line-height: 1.4; margin-top: 6px;">Middle months focus on multi-tier architectures, cloud deployment, and end-to-end project implementation.</div>
          </div>
          <div style="background: #0f172a; padding: 16px; border-radius: 8px; border: 1px solid #1e293b;">
            <div style="font-weight: bold; color: var(--text); font-size: 15px;">Stage 3: Internship & Defense</div>
            <div style="font-size: 13.5px; color: var(--text-muted); line-height: 1.4; margin-top: 6px;">Final month executes 4 simulated sprints, senior code reviews, oral defense, and credential verification.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 7 of 16</span></div>
  </div>

  <!-- SLIDE 8: Flagship Track 1: Full-Stack Python Deep Dive -->
  <div class="slide">
    <div class="header">
      <div class="tag">Flagship Curriculum Architecture • PinIT Career OS</div>
      <h1 class="title">Flagship Track 1: Full-Stack Python & Systems</h1>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">The Business & Non-Technical Concept</h3>
        <p class="card-meta">Python is the undisputed global backbone for Artificial Intelligence, financial systems, and web data. We take learners with zero background and transform them into enterprise-ready software architects in 30 daily modules.</p>
        <h4 style="color: var(--accent-indigo); margin-bottom: 8px; font-size: 16px;">Topics We Cover:</h4>
        <ul class="styled-list">
          <li><strong>Core Logic:</strong> Execution order, data types, math operators, and automated rule engines.</li>
          <li><strong>Data Structures:</strong> Lists, Hash Maps (Dictionaries), sets, and fast O(1) database ledgers.</li>
          <li><strong>Object-Oriented Design:</strong> Classes, state encapsulation, and polymorphic payment gateways.</li>
          <li><strong>Web APIs (FastAPI):</strong> Connecting user frontends to backends with lightning speed.</li>
          <li><strong>Enterprise Databases:</strong> SQL queries, relational modeling, and atomic financial rollbacks.</li>
        </ul>
      </div>

      <div class="card">
        <h3 class="card-title" style="color: var(--green);">The Zero-Setup Interactive Browser Lab</h3>
        <ul class="styled-list" style="margin-bottom: 16px;">
          <li><strong>Zero Installation Friction:</strong> Students write real code inside any web browser in a secure cloud sandbox.</li>
          <li><strong>Flight Simulator Learning:</strong> Automated proctored assertion engines test code against edge cases in real-time.</li>
          <li><strong>AI Socratic Debugging Tutor:</strong> When code breaks, the AI asks guiding questions to help students fix their own bugs.</li>
          <li><strong>Instant Cloud Deployment:</strong> Live APIs with shareable preview links prove skills to employers.</li>
        </ul>
        <div class="build-status status-done">
          ⚡ Build Status: Coded: 30 / 30 Days (100% Complete & Tested) | Remaining to Code: 0 Days
        </div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 8 of 16</span></div>
  </div>

  <!-- SLIDE 9: Flagship Track 2: Enterprise Web Full-Stack Deep Dive -->
  <div class="slide">
    <div class="header">
      <div class="tag">Consumer Web Architecture • PinIT Career OS</div>
      <h1 class="title">Flagship Track 2: Enterprise Web Full-Stack Engineering</h1>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">The Modern Consumer Web Experience</h3>
        <p class="card-meta">Every digital interaction—from booking a ride on Uber to shopping on Amazon—relies on Full-Stack Web engineering. We train students to build lightning-fast web applications with clean visual screens and bulletproof backends.</p>
        <h4 style="color: var(--accent-indigo); margin-bottom: 8px; font-size: 16px;">Topics We Cover:</h4>
        <ul class="styled-list">
          <li><strong>Frontend (React & Next.js):</strong> Dynamic UI components, state management, and Server-Side Rendering.</li>
          <li><strong>Backend Services (Node.js):</strong> Event loops, REST APIs, JSON data pipelines, and request routing.</li>
          <li><strong>Database Modeling (Prisma ORM):</strong> Relational schemas, user authentication tables, and caching.</li>
          <li><strong>Real-Time Data (WebSockets):</strong> Live bidirectional event streaming for chats and order tracking.</li>
          <li><strong>Security & Payments (Stripe):</strong> Encrypted session tokens, cookie security, and automated credit card billing.</li>
        </ul>
      </div>

      <div class="card">
        <h3 class="card-title" style="color: var(--green);">Production Capstone Deliverables</h3>
        <ul class="styled-list" style="margin-bottom: 16px;">
          <li><strong>High-Throughput API Gateway:</strong> Rate limiting algorithms protecting servers from DDoS attacks during flash sales.</li>
          <li><strong>Multi-Tenant Auth Hub:</strong> Enterprise role-based security protecting patient and client records.</li>
          <li><strong>Live Collaborative Canvas:</strong> Interactive live canvas and chat engine supporting simultaneous users.</li>
          <li><strong>Enterprise E-Commerce Engine:</strong> Complete 30-Day capstone featuring inventory locking, shopping carts, and Stripe payments.</li>
        </ul>
        <div class="build-status status-done">
          ⚡ Build Status: Coded: 30 / 30 Days (100% Complete & Tested) | Remaining to Code: 0 Days
        </div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 9 of 16</span></div>
  </div>

  <!-- SLIDE 10: The Simulated Internship Workplace Architecture -->
  <div class="slide">
    <div class="header">
      <div class="tag">Enterprise Work-Simulation Engine • PinIT Career OS</div>
      <h1 class="title">The Simulated Internship Workplace Architecture</h1>
    </div>
    <div class="banner">
      Solving the "No Experience = No Job" Dilemma with a Simulated Enterprise Company
    </div>
    <div class="grid-4">
      <div class="card" style="border-color: var(--accent-blue);">
        <h3 class="card-title" style="color: var(--accent-blue);">1. Virtual Tech Desk</h3>
        <p class="card-meta">Students join a simulated engineering squad with an AI Tech Lead and Product Manager. They participate in automated standups and review sprint backlogs.</p>
        <div style="color: var(--accent-blue); font-weight: bold; font-size: 13.5px; margin-top: auto;">Agile Scrum & Standups</div>
      </div>
      <div class="card" style="border-color: var(--accent-indigo);">
        <h3 class="card-title" style="color: var(--accent-indigo);">2. Real Bug Tickets</h3>
        <p class="card-meta">Tasks are dynamically generated business problems (e.g., checkout timeouts, database crashes). Unique tasks prevent answer plagiarism.</p>
        <div style="color: var(--accent-indigo); font-weight: bold; font-size: 13.5px; margin-top: auto;">Hidden Test Verification</div>
      </div>
      <div class="card" style="border-color: var(--amber);">
        <h3 class="card-title" style="color: var(--amber);">3. Code Reviews & PRs</h3>
        <p class="card-meta">Students write code, create Git branches, and submit Pull Requests. Our automated AI Senior Architect conducts line-by-line security and efficiency reviews.</p>
        <div style="color: var(--amber); font-weight: bold; font-size: 13.5px; margin-top: auto;">OWASP Security Auditing</div>
      </div>
      <div class="card" style="border-color: var(--green);">
        <h3 class="card-title" style="color: var(--green);">4. Verifiable QR Proof</h3>
        <p class="card-meta">Upon passing 4 sprints and an oral defense, students receive an employer-verifiable digital credential backed by a public audit link and code proof.</p>
        <div style="color: var(--green); font-weight: bold; font-size: 13.5px; margin-top: auto;">Permanent QR Link</div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 10 of 16</span></div>
  </div>

  <!-- SLIDE 11: Course Portfolio: Core Systems & Infrastructure -->
  <div class="slide">
    <div class="header">
      <div class="tag">Course Portfolio • Block 1 of 4 • PinIT Career OS</div>
      <h1 class="title">Course Portfolio: Core Systems & Infrastructure</h1>
    </div>
    <div class="grid-4-boxes">
      <div class="card">
        <h3 class="card-title">4. Java Fundamentals & Core Logic</h3>
        <div class="card-meta"><strong>What It Is:</strong> Industrial programming workhorse running global banking and enterprise legacy systems.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Conditionals, OOP inheritance, garbage collection, collections framework, and multithreading.</div>
        <div class="build-status status-progress">⚡ Build Status: Coded: 17 / 30 Days (56% Complete) | Remaining to Code: 13 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">6. Database Engineering & Query Performance</h3>
        <div class="card-meta"><strong>What It Is:</strong> The secure digital vault where all customer profiles and financial ledgers are stored.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Relational SQL, index B-trees, ACID transactions, connection pools, and query execution plans.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">10. Cloud Native Architectures (AWS)</h3>
        <div class="card-meta"><strong>What It Is:</strong> Renting infinite supercomputing power from Amazon data centers instead of physical office servers.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Virtual servers (EC2), serverless Lambda functions, S3 storage buckets, and API gateways.</div>
        <div class="build-status status-progress">⚡ Build Status: Coded: 5 / 30 Days (16% Complete) | Remaining to Code: 25 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">11. DevOps & CI/CD Pipeline Automation</h3>
        <div class="card-meta"><strong>What It Is:</strong> The automated factory assembly line that tests, packages, and deploys software with zero errors.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Docker containerization, GitHub Actions workflows, Kubernetes clusters, and zero-downtime rollouts.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 11 of 16</span></div>
  </div>

  <!-- SLIDE 12: Course Portfolio: Software Performance & User Interfaces -->
  <div class="slide">
    <div class="header">
      <div class="tag">Course Portfolio • Block 2 of 4 • PinIT Career OS</div>
      <h1 class="title">Course Portfolio: Software Performance & User Interfaces</h1>
    </div>
    <div class="grid-4-boxes">
      <div class="card">
        <h3 class="card-title">5. Data Structures & Algorithmic Optimizations</h3>
        <div class="card-meta"><strong>What It Is:</strong> The mathematical science of organizing data so applications run in split-seconds.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Big-O space-time complexity, binary search trees, hash tables, and dynamic programming.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">8. UI/UX Design Systems & Visual Frontend</h3>
        <div class="card-meta"><strong>What It Is:</strong> Creating the visual standards and component blueprints that make software intuitive to anyone.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Atomic components, WCAG accessibility, typography grids, responsive CSS, and design tokens.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">9. Mobile Application Development</h3>
        <div class="card-meta"><strong>What It Is:</strong> Building sleek, native-feel apps for iPhone and Android devices from a unified codebase.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> React Native, touch gesture handlers, camera/GPS device APIs, and app store deployment.</div>
        <div class="build-status status-progress">⚡ Build Status: Coded: 6 / 30 Days (20% Complete) | Remaining to Code: 24 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">7. High-Scale Distributed System Design</h3>
        <div class="card-meta"><strong>What It Is:</strong> Architecting systems that never crash even when millions transact at once (like Uber or Amazon).</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Load balancing, Redis in-memory caches, message queues, database sharding, and fault tolerance.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 12 of 16</span></div>
  </div>

  <!-- SLIDE 13: Course Portfolio: Artificial Intelligence & High-Scale Systems -->
  <div class="slide">
    <div class="header">
      <div class="tag">Course Portfolio • Block 3 of 4 • PinIT Career OS</div>
      <h1 class="title">Course Portfolio: Artificial Intelligence & High-Scale Systems</h1>
    </div>
    <div class="grid-4-boxes">
      <div class="card">
        <h3 class="card-title">15. AI Engineering & LLM Integration</h3>
        <div class="card-meta"><strong>What It Is:</strong> Embedding generative AI models (ChatGPT/Claude) directly into company products to automate work.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Prompt engineering, Retrieval-Augmented Generation (RAG), vector embeddings, and agent loops.</div>
        <div class="build-status status-progress">⚡ Build Status: Coded: 5 / 30 Days (16% Complete) | Remaining to Code: 25 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">13. Cybersecurity Principles & Secure Systems</h3>
        <div class="card-meta"><strong>What It Is:</strong> The digital defense shield that protects company networks and customer data from hackers.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> OWASP Top 10 vulnerabilities, AES encryption, SQL injection defense, and security audits.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">14. Quantitative Engineering & Low-Latency Trading</h3>
        <div class="card-meta"><strong>What It Is:</strong> Building the hyper-speed financial software used by Wall Street where trades execute in microseconds.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Electronic Limit Order Books (LOB), trade matching engines, VWAP algorithms, and latency physics.</div>
        <div class="build-status status-progress">⚡ Build Status: Coded: 5 / 30 Days (16% Complete) | Remaining to Code: 25 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">3. Node.js & TypeScript Backend Engineering</h3>
        <div class="card-meta"><strong>What It Is:</strong> The enterprise server technology powering high-concurrency modern apps with strict type safety.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Asynchronous event loops, Express middleware, REST APIs, and high-throughput reliability.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 13 of 16</span></div>
  </div>

  <!-- SLIDE 14: Course Portfolio: Commerce, Finance & Business Operations -->
  <div class="slide">
    <div class="header">
      <div class="tag">Course Portfolio • Block 4 of 4 • PinIT Career OS</div>
      <h1 class="title">Course Portfolio: Commerce, Finance & Business Operations</h1>
    </div>
    <div class="grid-4-boxes">
      <div class="card">
        <h3 class="card-title">24. Digital Accounting & Taxation</h3>
        <div class="card-meta"><strong>What It Is:</strong> Modernizing accounting by replacing manual books with automated ERP software and cloud workflows.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Double-entry bookkeeping, Tally Prime ERP, GST tax compliance, and automated payroll runs.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">29. E-Commerce & Digital Business</h3>
        <div class="card-meta"><strong>What It Is:</strong> Everything required to launch, run, and scale an online consumer storefront from UX to fulfillment.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Storefront design, payment gateway checkout, catalog management, and shipping logistics.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">31. Sales, Customer Success & CRM</h3>
        <div class="card-meta"><strong>What It Is:</strong> Finding enterprise buyers, pitching deals, negotiating contracts, and maintaining clients.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> B2B prospecting, lead qualification (BANT), objection handling, and CRM software management.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
      <div class="card">
        <h3 class="card-title">32. Operations, Supply Chain & Compliance</h3>
        <div class="card-meta"><strong>What It Is:</strong> Managing the physical movement of materials and manufacturing goods on time with zero waste.</div>
        <div class="topics-box"><strong>Topics We Teach:</strong> Process mapping, inventory control (EOQ/ROP), supplier procurement, and Lean Six Sigma quality.</div>
        <div class="build-status status-done">⚡ Build Status: Coded: 30 / 30 Days (100% Complete) | Remaining to Code: 0 Days</div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 14 of 16</span></div>
  </div>

  <!-- SLIDE 15: Engineering Velocity & Revenue Readiness -->
  <div class="slide">
    <div class="header">
      <div class="tag">Financial & Commercial Summary • PinIT Career OS</div>
      <h1 class="title">Engineering Velocity & Immediate Go-to-Market Readiness</h1>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 24px;">
      <div class="card" style="border-color: var(--green);">
        <div style="font-size: 32px; font-weight: 800; color: var(--green);">12 COURSES</div>
        <div style="font-weight: 700; font-size: 18px; margin: 6px 0;">100% Coded & Live Today</div>
        <div style="font-size: 14px; color: var(--text-muted); line-height: 1.4;">360 production-grade daily modules with verified tests ready for immediate sales.</div>
      </div>
      <div class="card" style="border-color: var(--accent-blue);">
        <div style="font-size: 32px; font-weight: 800; color: var(--accent-blue);">25 COURSES</div>
        <div style="font-weight: 700; font-size: 18px; margin: 6px 0;">Standardized Architecture</div>
        <div style="font-size: 14px; color: var(--text-muted); line-height: 1.4;">Complete 30-day syllabi, real-world metaphors, and test criteria formalized.</div>
      </div>
      <div class="card" style="border-color: var(--accent-indigo);">
        <div style="font-size: 32px; font-weight: 800; color: var(--accent-indigo);">HIGH CAPITAL EFFICIENCY</div>
        <div style="font-weight: 700; font-size: 18px; margin: 6px 0;">Zero Rework Risk</div>
        <div style="font-size: 14px; color: var(--text-muted); line-height: 1.4;">Automated test harness enables rapid, deterministic expansion at minimal engineering cost.</div>
      </div>
    </div>
    <div class="card" style="flex: 1; padding: 24px 32px;">
      <h3 class="card-title" style="font-size: 20px;">Shareholder Takeaway: Immediate Commercial Monetization</h3>
      <ul class="styled-list" style="margin-top: 12px; font-size: 16px;">
        <li><strong>Immediate Commercial Launch:</strong> We can immediately market and monetize complete 1-Month, 3-Month, and 6-Month career packages using our 12 fully-finished courses (Full-Stack Python, Full-Stack React, Node.js Backend, Database Engineering, SRE/DevOps, Excel, Accounting, and Business Operations).</li>
        <li><strong>Predictable Engineering Velocity:</strong> All 37 mastercourses have their complete 30-day curriculum blueprints, real-world metaphors, and test criteria formalized in master specification files. Expanding remaining days uses our automated testing pipeline with deterministic quality.</li>
        <li><strong>No Content Debt or Redundancy:</strong> Unlike other bootcamps that license third-party content, PinIT owns 100% of its curriculum intellectual property (IP), software engines, and automated assessment code.</li>
      </ul>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 15 of 16</span></div>
  </div>

  <!-- SLIDE 16: How We Teach: The Proprietary AI Pedagogy Engine -->
  <div class="slide">
    <div class="header">
      <div class="tag">Our Technology Moat • PinIT Career OS</div>
      <h1 class="title">How We Teach: The Proprietary AI Pedagogy Engine</h1>
    </div>
    <div class="banner">
      💡 The Active Learning Cycle: Replacing Passive Video Watching with Interactive Mastery
    </div>
    <div class="grid-4">
      <div class="card" style="border-color: var(--accent-blue);">
        <h3 class="card-title" style="color: var(--accent-blue);">1. 20-Min AI Avatar Mentor</h3>
        <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); margin-bottom: 8px;">[CONVERSATIONAL AUDIO]</div>
        <p class="card-meta">A photorealistic AI instructor explains concepts conversationally in plain words. Uses everyday metaphors (e.g. databases as bank vaults) with zero confusing jargon.</p>
        <div style="margin-top: auto; border-top: 1px solid var(--card-border); padding-top: 10px;">
          <div style="font-size: 12px; color: var(--accent-blue); font-weight: bold;">Shareholder Advantage:</div>
          <div style="font-size: 13.5px; color: var(--text);">Zero expensive human instructor scaling costs.</div>
        </div>
      </div>

      <div class="card" style="border-color: var(--accent-indigo);">
        <h3 class="card-title" style="color: var(--accent-indigo);">2. Synchronized Visual Stage</h3>
        <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); margin-bottom: 8px;">[LIVE DYNAMIC GRAPHICS]</div>
        <p class="card-meta">As the avatar speaks, the interactive screen dynamically animates architectural flows, memory registers, state machines, and data pipelines in real-time.</p>
        <div style="margin-top: auto; border-top: 1px solid var(--card-border); padding-top: 10px;">
          <div style="font-size: 12px; color: var(--accent-indigo); font-weight: bold;">Shareholder Advantage:</div>
          <div style="font-size: 13.5px; color: var(--text);">5x higher student completion rates vs videos.</div>
        </div>
      </div>

      <div class="card" style="border-color: var(--amber);">
        <h3 class="card-title" style="color: var(--amber);">3. Socratic Knowledge Checks</h3>
        <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); margin-bottom: 8px;">[INSTANT FORMATIVE FEEDBACK]</div>
        <p class="card-meta">Every single concept concludes with an interactive MCQ. If students choose wrong, the system explains WHY that mental model failed and guides them back.</p>
        <div style="margin-top: auto; border-top: 1px solid var(--card-border); padding-top: 10px;">
          <div style="font-size: 12px; color: var(--amber); font-weight: bold;">Shareholder Advantage:</div>
          <div style="font-size: 13.5px; color: var(--text);">Guaranteed conceptual understanding.</div>
        </div>
      </div>

      <div class="card" style="border-color: var(--green);">
        <h3 class="card-title" style="color: var(--green);">4. Interactive Sandbox Lab</h3>
        <div style="font-size: 12px; font-weight: bold; color: var(--text-muted); margin-bottom: 8px;">[PROCTORED CODE EXECUTION]</div>
        <p class="card-meta">Students write real code in our browser terminal. Automated test runners verify code assertions on the fly, locking in skills before the next day.</p>
        <div style="margin-top: auto; border-top: 1px solid var(--card-border); padding-top: 10px;">
          <div style="font-size: 12px; color: var(--green); font-weight: bold;">Shareholder Advantage:</div>
          <div style="font-size: 13.5px; color: var(--text);">Zero cheating; 100% genuine code verification.</div>
        </div>
      </div>
    </div>
    <div class="footer-note"><span>PinIT Career OS — Shareholder Presentation</span><span>Slide 16 of 16</span></div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'shareholder_deck_print.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('Written HTML to ' + htmlFilePath);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await page.goto('file:///' + htmlFilePath.replace(/\\\\/g, '/'), { waitUntil: 'networkidle' });
  
  const pdfPath = path.join(__dirname, 'PinIT_Career_OS_Shareholder_Presentation.pdf');
  await page.pdf({
    path: pdfPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log('PDF successfully generated at: ' + pdfPath);
  await browser.close();
})();
