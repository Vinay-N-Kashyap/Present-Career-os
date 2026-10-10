// scripts/visuals/cloud-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Cloud Native Architectures (AWS) (course-cloud-native)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, and FAANG/Staff Cloud Architect rubrics.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const CLOUD_MONTH_1_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 1: Cloud Foundations & Core Network Isolation (Days 1–5) ─────────────
  {
    day: 1,
    month: 1,
    blockNum: 1,
    title: "Cloud Computing Models (IaaS, PaaS, SaaS) & The AWS Shared Responsibility Model",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Cloud Service Tiers & Security Demarcation)",
    spokenGoal: "Deconstruct cloud computing from physical hardware up: understand Infrastructure, Platform, and Software as a Service, and master the absolute demarcation of security OF the cloud vs security IN the cloud.",
    conceptInvariant: "Under AWS Shared Responsibility, AWS manages the hypervisor, physical facilities, and host hardware (Security OF the Cloud). You are 100% responsible for guest operating systems, network access controls, firewall rules, encryption keys, and customer data (Security IN the Cloud).",
    failureMode: "Assuming AWS automatically protects EC2 instances from OS-level exploits, leading to unpatched Linux kernels and full root compromise via exposed SSH ports.",
    tryItFriction: "Categorize 10 security failure scenarios (e.g., hypervisor breakout vs compromised S3 bucket policy) into AWS fault vs Customer fault.",
    socraticHints: [
      "Who owns the responsibility when an unpatched Ubuntu kernel on EC2 gets exploited?",
      "AWS provides the physical hardware and hypervisor, but the guest OS updates belong to you!",
      "Classify the layer: Hardware/Facilities = AWS; Guest OS/Data/IAM/Firewall = Customer."
    ],
    situationalPuzzle: {
      scenario: "An enterprise deploys an unencrypted PostgreSQL database on an Amazon EC2 instance. An engineer misconfigures the security group to allow 0.0.0.0/0 on port 5432, resulting in a database ransom attack. The CTO claims AWS violated SOC2 compliance. Who is legally and architecturally at fault?",
      options: [
        "AWS is at fault because AWS should have blocked internet traffic to port 5432 automatically.",
        "The customer is at fault because network security groups, database encryption, and access controls fall entirely under 'Security IN the Cloud'.",
        "The open-source PostgreSQL community is at fault for default port assignments.",
        "AWS is at fault because EC2 instances must always be private by default."
      ],
      answerIdx: 1,
      debrief: "Under the Shared Responsibility Model, AWS manages physical datacenter security and hypervisors. Operating system firewalls, database access rules, and security groups are solely the customer's responsibility."
    },
    quests: [
      { id: "cloud-m1-d01-q1", name: "Shared Responsibility Demarcation Matrix", type: "concept", desc: "Map security boundaries across IaaS (EC2), PaaS (RDS), and SaaS (Amazon WorkMail) environments." },
      { id: "cloud-m1-d01-q2", name: "Detective Lab: The Cloud Security Blame Game", type: "detective", desc: "Audit a compliance violation report and isolate which party breached responsibility invariants." },
      { id: "cloud-m1-d01-q3", name: "Mastery Assignment: Responsibility Boundary Evaluator", type: "assignment", desc: "Write an automated compliance verification function that maps AWS resource configurations to ownership tiers." },
      { id: "cloud-m1-d01-q4", name: "Production Incident Lab: Unpatched Hypervisor vs Guest OS Outage", type: "detective", desc: "Triage a root-level compromise caused by default credential exposure on an internet-facing EC2 instance." }
    ]
  },
  {
    day: 2,
    month: 1,
    blockNum: 1,
    title: "AWS Global Infrastructure: Regions, Availability Zones, Edge Locations & Fault Boundaries",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Physical Topologies & Failure Domains)",
    spokenGoal: "Master AWS physical architecture: understand how Regions, isolated Availability Zones (AZs), Local Zones, and Edge Locations create independent failure domains and sub-millisecond network fabrics.",
    conceptInvariant: "An Availability Zone consists of one or more physically distinct data centers with independent power, cooling, and networking. Deploying across multiple AZs eliminates single points of physical failure within a Region.",
    failureMode: "Deploying high-availability web tiers across multiple EC2 instances all located in the exact same Availability Zone (`us-east-1a`), causing complete system outage when a localized transformer fails.",
    tryItFriction: "Calculate the latency and availability difference between single-AZ, multi-AZ, and multi-Region architectures under a simulated physical power loss.",
    socraticHints: [
      "If you launch two EC2 instances in us-east-1a, are they protected against a datacenter power outage?",
      "No! An AZ represents a physical facility boundary. When us-east-1a goes down, all instances inside it halt.",
      "Distribute workloads across at least two distinct AZs (e.g., us-east-1a and us-east-1b) using an ALB."
    ],
    situationalPuzzle: {
      scenario: "A fintech platform runs 6 web servers across 2 subnets. However, both subnets map to `us-east-1a`. A lightning strike damages the power grid feeding us-east-1a. The entire service goes down for 3 hours despite having 6 running instances. What architectural principle was violated?",
      options: [
        "The instances did not have large enough EBS volumes attached.",
        "Failure Domain Isolation: Multiple instances placed in the same Availability Zone share physical power and flood plains, violating Multi-AZ redundancy.",
        "The company forgot to purchase Route 53 private hosted zones.",
        "The database should have used DynamoDB instead of RDS."
      ],
      answerIdx: 1,
      debrief: "True fault tolerance requires spanning multiple Availability Zones. Redundant compute inside a single AZ provides process-level failover but zero physical disaster resilience."
    },
    quests: [
      { id: "cloud-m1-d02-q1", name: "AWS Global Topology & Blast Radius Analysis", type: "concept", desc: "Examine the physical hierarchy of Regions, AZs, Edge Locations, and Regional Edge Caches." },
      { id: "cloud-m1-d02-q2", name: "Detective Lab: The Single-AZ High-Availability Illusion", type: "detective", desc: "Inspect an Terraform deployment script and catch instances falsely claiming HA while pinned to a single AZ." },
      { id: "cloud-m1-d02-q3", name: "Mastery Assignment: Multi-AZ Fault Boundary Validator", type: "assignment", desc: "Construct an infrastructure topology scanner that verifies every tier spans at least 3 distinct Availability Zones." },
      { id: "cloud-m1-d02-q4", name: "Production Incident Lab: Datacenter Power Failure Post-Mortem", type: "detective", desc: "Simulate a complete AZ blackout and analyze traffic rerouting via Route 53 and ALB target health probes." }
    ]
  },
  {
    day: 3,
    month: 1,
    blockNum: 1,
    title: "Virtual Private Cloud (VPC) Architecture: CIDR Subnetting, Route Tables & Internet Gateways",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Software-Defined Networking & CIDR Math)",
    spokenGoal: "Build your own software-defined private datacenter in the cloud: master RFC 1918 IPv4 CIDR blocks, VPC subnet splitting, Internet Gateways (IGWs), and custom route tables.",
    conceptInvariant: "In every AWS VPC subnet, exactly 5 IP addresses are reserved by AWS (Network, VPC Router, DNS, Future Use, and Broadcast). A /24 subnet has 256 theoretical IPs but only 251 usable host IPs.",
    failureMode: "Allocating a tiny /28 subnet (16 IPs, 11 usable) for microservices auto-scaling, causing IP exhaustion and instant EC2 launch failures during traffic spikes.",
    tryItFriction: "Calculate the exact usable IP address range and reserved addresses for a `10.0.0.0/16` VPC partitioned into four `/24` subnets.",
    socraticHints: [
      "Why does a /24 subnet in AWS only have 251 usable IP addresses instead of 254?",
      "AWS reserves the first 4 IPs (.0, .1, .2, .3) and the last IP (.255) for internal networking, routing, and DNS!",
      "Always calculate `2^(32-prefix) - 5` when planning VPC capacity."
    ],
    situationalPuzzle: {
      scenario: "A backend service in a newly created private subnet needs to pull Docker images from Docker Hub. The subnet has a Route Table with a default route `0.0.0.0/0 -> igw-12345` (Internet Gateway). However, instances in this subnet cannot connect to the internet. Why?",
      options: [
        "Internet Gateways only support IPv6 traffic, not IPv4.",
        "Instances in private subnets cannot route directly through an IGW without a Public IPv4 address assigned to their ENI; they require a NAT Gateway located in a public subnet.",
        "The VPC CIDR block must be 172.16.0.0/16 to communicate with Docker Hub.",
        "The security group must allow inbound ICMP ping traffic from 0.0.0.0/0."
      ],
      answerIdx: 1,
      debrief: "An Internet Gateway performs 1:1 NAT only for instances with public IPv4 addresses. Private instances without public IPs must route through a NAT Gateway located in a public subnet."
    },
    quests: [
      { id: "cloud-m1-d03-q1", name: "RFC 1918 CIDR Subnetting & AWS Reserved IP Mechanics", type: "concept", desc: "Calculate subnet splits, bitmasks, and account for the 5 AWS reserved addresses in every subnet." },
      { id: "cloud-m1-d03-q2", name: "Detective Lab: The Unroutable Private Subnet", type: "detective", desc: "Debug a VPC route table misconfiguration where private database instances are accidentally exposed to an IGW." },
      { id: "cloud-m1-d03-q3", name: "Mastery Assignment: Enterprise Dual-Tier VPC Network Generator", type: "assignment", desc: "Design a production-grade VPC across 3 AZs featuring 3 public subnets, 3 private app subnets, and 3 isolated db subnets." },
      { id: "cloud-m1-d03-q4", name: "Production Incident Lab: Subnet IP Exhaustion Cascade", type: "detective", desc: "Triage an Auto-Scaling Group outage caused by allocating a /27 subnet that ran out of Elastic Network Interfaces (ENIs)." }
    ]
  },
  {
    day: 4,
    month: 1,
    blockNum: 1,
    title: "Network Isolation: Stateful Security Groups vs Stateless Network Access Control Lists (NACLs)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Stateful vs Stateless Firewalls)",
    spokenGoal: "Master cloud firewall defense-in-depth: contrast stateful Elastic Network Interface (ENI) Security Groups with stateless subnet-level Network Access Control Lists (NACLs) and ephemeral port ranges.",
    conceptInvariant: "Security Groups are stateful (inbound return traffic is automatically allowed outbound regardless of outbound rules). NACLs are stateless (rules are processed numerically, and outbound return traffic requires explicit ephemeral port allowances: 1024-65535).",
    failureMode: "Blocking outbound traffic on a NACL without opening ephemeral ports (1024–65535), causing incoming HTTP responses to be dropped immediately after the client connection establishes.",
    tryItFriction: "Configure a custom NACL and Security Group pairing that permits inbound HTTPS (port 443) while blocking all ICMP ping traffic and unauthorized CIDRs.",
    socraticHints: [
      "If a Security Group allows inbound port 443, do you need an outbound rule for the response?",
      "No! Security Groups are stateful; return traffic is tracked automatically at the hypervisor.",
      "NACLs are stateless! If inbound port 443 is allowed, outbound ephemeral ports (1024-65535) MUST be opened."
    ],
    situationalPuzzle: {
      scenario: "A sysadmin adds a NACL rule: 'Rule 100: Allow Inbound TCP 443 from 0.0.0.0/0'. Outbound NACL is left at default: 'Rule 100: Deny All'. Clients attempting to connect over HTTPS receive connection timeouts. What is missing?",
      options: [
        "The security group must be deleted before the NACL can take effect.",
        "Stateless Ephemeral Port Exclusion: The outbound NACL must explicitly allow return traffic on ephemeral ports (TCP 1024–65535) back to the client.",
        "NACL rules must be numbered with negative integers.",
        "Port 443 requires UDP instead of TCP on AWS subnets."
      ],
      answerIdx: 1,
      debrief: "NACLs are stateless. When an external client connects from a random ephemeral port (e.g. 52341) to server port 443, the response must travel outbound from server port 443 to client ephemeral port 52341. A Deny All outbound NACL drops the response."
    },
    quests: [
      { id: "cloud-m1-d04-q1", name: "Stateful vs Stateless Packet Evaluation Pipeline", type: "concept", desc: "Trace packet traversal through Subnet NACLs down to the ENI Security Group boundary." },
      { id: "cloud-m1-d04-q2", name: "Detective Lab: The Dropped Ephemeral Return Packet", type: "detective", desc: "Diagnose an HTTPS timeout caused by a locked-down outbound NACL missing ephemeral port rules." },
      { id: "cloud-m1-d04-q3", name: "Mastery Assignment: Zero-Trust Tiered Firewall Rule Compiler", type: "assignment", desc: "Implement an automated firewall policy generator establishing strict ingress/egress boundaries between Web and DB tiers." },
      { id: "cloud-m1-d04-q4", name: "Production Incident Lab: Misconfigured Ingress Rule Data Exfiltration", type: "detective", desc: "Audit a breach where a security group rule allowed 0.0.0.0/0 on port 22 directly to an internal database node." }
    ]
  },
  {
    day: 5,
    month: 1,
    blockNum: 1,
    title: "⭐ MILESTONE 1: High-Availability Multi-AZ Dual-Tier VPC Topology & SSH Bastion Host",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "Integrative Milestone Synthesis & Live Architecture Verification",
    spokenGoal: "Architect and prove your first production-grade cloud network: build a dual-tier Multi-AZ VPC across 2 Availability Zones featuring public DMZ subnets, private compute subnets, NAT Gateways, and a hardened SSH Bastion Host.",
    conceptInvariant: "Database and application workloads must never reside in subnets with direct Internet Gateway routes. Public internet access must be brokered strictly through Load Balancers, NAT Gateways, or Bastion jump hosts.",
    failureMode: "Placing the NAT Gateway in a private subnet, creating a circular routing black hole where the NAT Gateway attempts to route through itself to reach the internet.",
    tryItFriction: "Deploy and verify end-to-end connectivity from a private subnet instance out to the public internet via NAT Gateway while blocking all direct inbound internet probes.",
    socraticHints: [
      "Where must the NAT Gateway be deployed?",
      "In a PUBLIC subnet that has an explicit route `0.0.0.0/0 -> igw`!",
      "Private subnets then route their `0.0.0.0/0` traffic to the NAT Gateway ID."
    ],
    situationalPuzzle: {
      scenario: "During an audit, security tools flag that developers are SSHing into private backend servers using public IPs. The network architect proposes removing public IPs and routing administrative access through an SSH Bastion Host. What is the security advantage?",
      options: [
        "Bastion hosts make SSH encryption 10x faster.",
        "Attack Surface Minimization: Private instances have zero public IP addresses; SSH traffic is restricted to a single hardened, monitored, and audited jump host in the public DMZ.",
        "Bastion hosts eliminate the need for SSH key pairs.",
        "AWS pays for all data transfer going through a Bastion host."
      ],
      answerIdx: 1,
      debrief: "A Bastion host (jump box) concentrates external administrative access into a single, tightly controlled entry point. Private instances retain zero public IPs, dramatically reducing the internet attack surface."
    },
    quests: [
      { id: "cloud-m1-d05-q1", name: "Milestone Architecture: Multi-AZ Enterprise VPC Blueprint", type: "concept", desc: "Design a complete Multi-AZ topology with public, private, and database subnets across 2 AZs." },
      { id: "cloud-m1-d05-q2", name: "Detective Lab: The NAT Gateway Circular Route Trap", type: "detective", desc: "Locate and correct a routing table loop where private instances cannot reach external package repositories." },
      { id: "cloud-m1-d05-q3", name: "Mastery Assignment: Bastion Host & Security Group Chaining", type: "assignment", desc: "Implement security group referencing where private instances only accept SSH ingress from the Bastion Security Group ID." },
      { id: "cloud-m1-d05-q4", name: "Production Incident Lab: Compromised Bastion Ingress Post-Mortem", type: "detective", desc: "Triage an incident where a bastion host had 0.0.0.0/0 open and enforce MFA with AWS Systems Manager (SSM) Session Manager." }
    ]
  },

  // ─── BLOCK 2: Identity, Compute & Elastic Scaling (Days 6–10) ────────────────────
  {
    day: 6,
    month: 1,
    blockNum: 2,
    title: "Identity & Access Management (IAM): Least Privilege, Role Assumption (STS) & Principal Trust",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Core Security Architecture (Zero-Trust Identity)",
    spokenGoal: "Master AWS Identity & Access Management: learn JSON policy evaluation logic (Explicit Deny > Explicit Allow > Default Deny), IAM Roles, Instance Profiles, and AWS Security Token Service (STS) temporary credentials.",
    conceptInvariant: "Hardcoding long-term AWS Access Keys (`AKIA...`) in applications is an immediate catastrophic vulnerability. EC2, ECS, and Lambda must always assume IAM Roles via Instance Profiles using short-lived STS credentials rotated automatically.",
    failureMode: "Committing AWS Access Keys to a public GitHub repository; bots scrape the keys within 60 seconds and spin up $50,000/day in GPU crypto-mining instances.",
    tryItFriction: "Author a least-privilege IAM policy allowing an application to read from a specific S3 bucket while denying all delete operations and all other buckets.",
    socraticHints: [
      "How does AWS evaluate an IAM policy when both an Allow and a Deny match the same action?",
      "An Explicit Deny ALWAYS overrides an Explicit Allow, regardless of where it appears!",
      "If no Allow is found, the request is Denied by default (Implicit Deny)."
    ],
    situationalPuzzle: {
      scenario: "An EC2 instance needs to read items from an S3 bucket named `company-invoices`. A developer creates an IAM User, generates an Access Key ID and Secret Key, and pastes them into `config.json` on the server. What is the fundamental violation?",
      options: [
        "S3 does not support reading items through config files.",
        "Credential Hygiene Violation: EC2 instances must use IAM Roles with Instance Profiles to fetch temporary STS tokens automatically via the Instance Metadata Service (IMDSv2), eliminating hardcoded keys.",
        "IAM Users cannot access S3 buckets.",
        "The file must be named `.env` instead of `config.json`."
      ],
      answerIdx: 1,
      debrief: "Hardcoding long-term IAM credentials on compute instances exposes them to theft. Using IAM Roles with Instance Profiles delivers automatically rotated, short-lived STS credentials via the local metadata service."
    },
    quests: [
      { id: "cloud-m1-d06-q1", name: "IAM Policy Evaluation Engine & Invariant Truth Table", type: "concept", desc: "Map policy evaluation rules: Explicit Deny, SCPs, Permissions Boundaries, and Identity vs Resource policies." },
      { id: "cloud-m1-d06-q2", name: "Detective Lab: The Overprivileged AdminAccess Leak", type: "detective", desc: "Refactor a bloated `*:*` administrator policy down to exact scoped ARNs and actions." },
      { id: "cloud-m1-d06-q3", name: "Mastery Assignment: Least-Privilege IAM Policy Authoring Engine", type: "assignment", desc: "Construct a JSON IAM policy granting read-only access to `arn:aws:s3:::app-data/*` with condition IP boundaries." },
      { id: "cloud-m1-d06-q4", name: "Production Incident Lab: Leaked Access Key Crypto-Mining Triage", type: "detective", desc: "Execute an emergency IAM lockdown: revoke active STS sessions, invalidate leaked keys, and quarantine rogue EC2 instances." }
    ]
  },
  {
    day: 7,
    month: 1,
    blockNum: 2,
    title: "Amazon EC2: Instance Topologies, Spot Interruption Handlers & Auto Scaling Groups (ASG)",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Core Compute Systems (Elastic Scaling & Cost Architecture)",
    spokenGoal: "Master cloud compute infrastructure: explore EC2 instance families (General, Compute, Memory, Storage), EBS block volumes, Spot Instances with 2-minute interruption warnings, and Auto Scaling Groups (ASGs).",
    conceptInvariant: "Compute instances in cloud-native architectures must be treated as cattle, not pets. Servers must be stateless, booted from immutable AMIs or Launch Templates, and capable of being terminated at any second without data loss.",
    failureMode: "Storing user uploads on the local EC2 root volume (`/dev/xvda`). When the Auto Scaling Group terminates the instance during a scale-in event, all customer data is permanently destroyed.",
    tryItFriction: "Configure an Auto Scaling Group policy that scales based on CPU utilization target tracking (70%) while handling a simulated Spot Instance 2-minute termination notice.",
    socraticHints: [
      "What happens to the local ephemeral storage on an EC2 instance when it scales down?",
      "The storage is wiped clean! All instance storage is volatile.",
      "Always persist uploads to Amazon S3 or shared Elastic File System (EFS), keeping instances completely stateless."
    ],
    situationalPuzzle: {
      scenario: "A batch processing fleet uses 100% Spot Instances to save 80% on compute costs. During peak regional demand, AWS reclaims 60% of the Spot capacity with a 2-minute warning. The batch job crashes and corrupts half-processed files. How should the architect harden this fleet?",
      options: [
        "Switch entirely to On-Demand instances and accept maximum cost.",
        "Implement Spot Interruption Handlers via EventBridge/metadata service to checkpoint progress within the 2-minute window, and use an ASG mixed-instances policy combining On-Demand baseline with Spot bursts.",
        "Increase the Spot bid price to 10x the On-Demand price.",
        "Store the batch files in EC2 Instance Store volumes."
      ],
      answerIdx: 1,
      debrief: "A resilient Spot architecture listens for the 2-minute interruption notice via IMDS (`/latest/meta-data/spot/instance-action`) to checkpoint jobs, while using an ASG with mixed instance types and On-Demand base capacity to maintain continuity."
    },
    quests: [
      { id: "cloud-m1-d07-q1", name: "EC2 Instance Topologies & EBS Block Storage Cost Models", type: "concept", desc: "Compare General Purpose (gp3), Provisioned IOPS (io2), and Throughput Optimized (st1) storage characteristics." },
      { id: "cloud-m1-d07-q2", name: "Detective Lab: The Stateful Pet in the Auto Scaling Group", type: "detective", desc: "Audit an ASG setup and remove local state dependencies that cause data loss on instance termination." },
      { id: "cloud-m1-d07-q3", name: "Mastery Assignment: Spot Interruption Checkpointer & Lifecycle Hook", type: "assignment", desc: "Write an automated script that polls IMDS for Spot interruption notices and triggers an S3 state checkpoint." },
      { id: "cloud-m1-d07-q4", name: "Production Incident Lab: Rapid Scale-Out Throttling Incident", type: "detective", desc: "Diagnose an ASG launch failure cascade caused by hitting regional EC2 vCPU service quotas during a flash sale." }
    ]
  },
  {
    day: 8,
    month: 1,
    blockNum: 2,
    title: "Elastic Load Balancing: Application Load Balancer (ALB), Target Groups & Health Probe Algorithms",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Core Traffic Distribution (Layer 7 Routing & Resiliency)",
    spokenGoal: "Direct production web traffic with precision: master Layer 7 Application Load Balancers (ALB), Target Groups, Path/Host routing rules, and deep health check algorithms that prevent routing to dying instances.",
    conceptInvariant: "An ALB only routes traffic to targets in a 'healthy' state. A health check must probe an internal endpoint that validates real application readiness (e.g. database connectivity) rather than a static 200 OK string on a dead worker.",
    failureMode: "Pointing health checks to a static `index.html` file. When the backend database connection pool exhausts and all queries throw 500 errors, the ALB keeps sending 100% of user traffic to the dead instances.",
    tryItFriction: "Implement an intelligent `/healthz` endpoint that verifies database ping, cache connectivity, and memory headroom before returning HTTP 200 vs HTTP 503.",
    socraticHints: [
      "If a web server returns 200 OK for `/index.html` but crashes on all database queries, will the ALB remove it?",
      "No! The ALB only checks the URL path configured in the health probe.",
      "Configure health checks to hit a dedicated `/healthz` endpoint that tests actual downstream service readiness."
    ],
    situationalPuzzle: {
      scenario: "During a traffic surge, an application experiences latency spikes. The ALB marks 5 out of 10 instances unhealthy simultaneously. The remaining 5 instances receive double the traffic, overload, fail health checks, and the entire cluster collapses in a 'flapping death spiral'. What is the fix?",
      options: [
        "Disable health checks completely so no instances get marked unhealthy.",
        "Tune health check thresholds: increase `HealthyThresholdCount`, adjust `IntervalSeconds`, implement gradual target deregistration (connection draining), and configure Auto Scaling cooldowns.",
        "Switch from ALB to an Internet Gateway.",
        "Add more CPU to the ALB load balancer instances."
      ],
      answerIdx: 1,
      debrief: "Health check flapping occurs when aggressive probe intervals mark temporarily busy instances dead, shifting load onto surviving instances until all fail. Tuning probe thresholds, timeouts, and deregistration delays prevents cascading collapse."
    },
    quests: [
      { id: "cloud-m1-d08-q1", name: "Layer 7 ALB Routing & Health Check Probe Mechanics", type: "concept", desc: "Trace HTTP request distribution across target groups, path-based routing, and deregistration delay." },
      { id: "cloud-m1-d08-q2", name: "Detective Lab: The Shallow Health Check Blindspot", type: "detective", desc: "Examine an outage where dead app servers received user traffic because the health probe checked a static file." },
      { id: "cloud-m1-d08-q3", name: "Mastery Assignment: Resilient Health Probe & Connection Draining Spec", type: "assignment", desc: "Design a target group specification with 30s connection draining, 5s timeout, and deep dependency health validation." },
      { id: "cloud-m1-d08-q4", name: "Production Incident Lab: Target Group Flapping Death Spiral", type: "detective", desc: "Resolve a live production cascading failure by stabilizing health check intervals and scaling out targets." }
    ]
  },
  {
    day: 9,
    month: 1,
    blockNum: 2,
    title: "Amazon S3: Object Immutability, Storage Class Tiering & Lifecycle Transition State Machines",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Core Object Storage (Data Durability & Cost Lifecycle)",
    spokenGoal: "Master cloud object storage at petabyte scale: understand S3 11 9s durability (99.999999999%), object immutability, S3 Standard, Infrequent Access (IA), Intelligent-Tiering, and Glacier Deep Archive lifecycle rules.",
    conceptInvariant: "S3 objects are immutable: you cannot edit a byte in-place; updating an object writes an entirely new version. S3 guarantees 11 9s of data durability by redundantly storing objects across multiple physically separated AZs.",
    failureMode: "Storing petabytes of compliance audit logs in S3 Standard forever, paying $23,000/month instead of transitioning them to S3 Glacier Deep Archive at $0.99/TB/month ($990/month).",
    tryItFriction: "Design an S3 Lifecycle Rule XML/JSON policy that transitions raw logs: Standard -> Intelligent-Tiering at 30 days -> Glacier Flexible at 90 days -> Glacier Deep Archive at 180 days -> Expiration at 365 days.",
    socraticHints: [
      "How much money do you save by moving 100TB of cold data from S3 Standard to Glacier Deep Archive?",
      "S3 Standard is ~$0.023/GB ($2,300/mo). Glacier Deep Archive is ~$0.00099/GB ($99/mo) — a 95%+ savings!",
      "Use S3 Lifecycle Management rules to automate these transitions without writing application code."
    ],
    situationalPuzzle: {
      scenario: "A video streaming platform stores 500 million user-generated video clips. Some become viral hits, while others are never watched after day 2. Access patterns are completely unpredictable. Which S3 storage class delivers optimal cost without retrieval latency penalties?",
      options: [
        "S3 Glacier Deep Archive because it is the cheapest storage class.",
        "S3 Intelligent-Tiering: It automatically moves objects between frequent, infrequent, and archive instant access tiers based on real access patterns with zero operational overhead and no retrieval fees.",
        "S3 One Zone-IA because videos do not need multi-AZ durability.",
        "Amazon EBS gp3 attached to an EC2 file server."
      ],
      answerIdx: 1,
      debrief: "S3 Intelligent-Tiering monitors access patterns and automatically shifts objects between low-latency access tiers (Frequent, Infrequent, Archive Instant) without retrieval fees, perfect for unpredictable workloads."
    },
    quests: [
      { id: "cloud-m1-d09-q1", name: "S3 11 9s Durability Math & Storage Class Cost Topology", type: "concept", desc: "Calculate statistical loss probability across 11 9s and evaluate cost trade-offs between S3 classes." },
      { id: "cloud-m1-d09-q2", name: "Detective Lab: The Runaway $30,000 S3 Storage Bill", type: "detective", desc: "Audit an enterprise AWS bill and discover unexpired non-current versions and incomplete multipart uploads." },
      { id: "cloud-m1-d09-q3", name: "Mastery Assignment: Multi-Tier S3 Lifecycle State Machine", type: "assignment", desc: "Author an automated S3 Lifecycle configuration with intelligent tiering, non-current version pruning, and Glacier transitions." },
      { id: "cloud-m1-d09-q4", name: "Production Incident Lab: Orphaned Multipart Upload Disk Leak", type: "detective", desc: "Diagnose an S3 bucket consuming 80TB of hidden storage from aborted multipart uploads missing abort rules." }
    ]
  },
  {
    day: 10,
    month: 1,
    blockNum: 2,
    title: "Amazon S3 Security: Block Public Access, Bucket Policies & Signed URL Presigned Tokens",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Core Storage Security (Data Protection & Access Delegation)",
    spokenGoal: "Harden cloud object storage: master S3 Block Public Access (BPA), resource-based Bucket Policies, SSE-S3/SSE-KMS server-side encryption, and time-limited Presigned URLs for secure client direct uploads.",
    conceptInvariant: "Client applications should never route large file uploads through backend API servers. The backend should generate a cryptographically signed S3 Presigned URL (valid for 5–15 minutes), allowing the client to upload directly to S3.",
    failureMode: "Proxying 2GB video uploads through Node.js/Python API servers, exhausting server memory, tying up connection sockets, and crashing backend clusters under load.",
    tryItFriction: "Generate a secure S3 Presigned PUT URL with an explicit 15-minute expiration and verify that an unauthorized client without the signed signature gets an HTTP 403 Forbidden.",
    socraticHints: [
      "Why should a browser upload a 500MB profile video directly to S3 instead of sending it to your API server?",
      "Direct uploads offload bandwidth and CPU from your API servers straight to AWS's scalable object store!",
      "The API server generates an S3 Presigned URL using AWS SDK; the client then executes an HTTP PUT directly to S3."
    ],
    situationalPuzzle: {
      scenario: "A healthtech startup accidentally exposed 100,000 medical records because an engineer applied an ACL with 'public-read' to an S3 bucket. What account-wide setting would have categorically prevented this breach regardless of bucket-level misconfigurations?",
      options: [
        "AWS CloudTrail Log Validation.",
        "S3 Block Public Access (Account Level): Enabling all 4 Block Public Access settings overrides any bucket policies or object ACLs that attempt to grant public internet access.",
        "Route 53 DNSSEC.",
        "AWS Trusted Advisor Cost Optimization."
      ],
      answerIdx: 1,
      debrief: "S3 Block Public Access at the AWS Account level acts as a master guardrail. When enabled, it unconditionally blocks public ACLs, public policies, and restricts cross-account access, preventing accidental data leaks."
    },
    quests: [
      { id: "cloud-m1-d10-q1", name: "S3 Security Hierarchy: Block Public Access, Policies & ACLs", type: "concept", desc: "Analyze the evaluation order between Account BPA, Bucket BPA, Bucket Policies, and Object ACLs." },
      { id: "cloud-m1-d10-q2", name: "Detective Lab: The Leaky Public Bucket Policy", type: "detective", desc: "Audit and fix an overly permissive S3 bucket policy allowing anonymous `s3:GetObject` on sensitive directories." },
      { id: "cloud-m1-d10-q3", name: "Mastery Assignment: Secure Presigned URL Generator & S3 Upload Broker", type: "assignment", desc: "Implement a serverless token broker generating time-bound S3 Presigned PUT URLs with content-type restrictions." },
      { id: "cloud-m1-d10-q4", name: "Production Incident Lab: Massive Data Breach Simulation Post-Mortem", type: "detective", desc: "Triage a simulated corporate data exfiltration incident caused by an unauthenticated S3 bucket endpoint." }
    ]
  },

  // ─── BLOCK 3: Serverless Compute & Managed Databases (Days 11–15) ────────────────
  {
    day: 11,
    month: 1,
    blockNum: 3,
    title: "Serverless AWS Lambda: Firecracker Execution Environments, Concurrency & Cold Start Mitigations",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Serverless Compute Foundations (Event-Driven Execution)",
    spokenGoal: "Master event-driven serverless computing: understand AWS Lambda's underlying Firecracker MicroVM architecture, execution lifecycle (Init phase vs Invoke phase), Reserved vs Provisioned Concurrency, and cold starts.",
    conceptInvariant: "Code placed outside the Lambda handler function runs during the initialization (Init) phase and is cached across warm invocations. Database connection pools, SDK clients, and heavy models must be initialized outside the handler.",
    failureMode: "Instantiating a new database connection pool inside the Lambda handler function on every invoke, opening 1,000 simultaneous connections and crashing the RDS PostgreSQL database in 3 seconds.",
    tryItFriction: "Refactor a Lambda function from initializing database connections inside the handler to global variable caching outside the handler, observing warm invocation latency plummet from 450ms to 8ms.",
    socraticHints: [
      "Where should you instantiate `new PrismaClient()` or `new DynamoDBClient()` in a Lambda function?",
      "Outside the `export const handler = async (event) => {}` function!",
      "The global execution context persists across warm invocations, reusing the established connection pool."
    ],
    situationalPuzzle: {
      scenario: "A retail checkout Lambda function experiences 2,000ms latency spikes every time traffic bursts, causing checkout timeouts. Monitoring shows the function runs Java on a 256MB memory allocation. What is the root cause and optimal solution?",
      options: [
        "AWS Lambda cannot run Java in production.",
        "Cold Start & Memory Starvation: Java JVM initialization on a low-memory MicroVM takes seconds; increasing memory to 1024MB allocates proportional CPU, and enabling Provisioned Concurrency or SnapStart eliminates cold starts.",
        "The Lambda timeout must be decreased to 1 second.",
        "The function must be migrated to an EC2 t2.micro instance."
      ],
      answerIdx: 1,
      debrief: "Lambda memory allocation linearly controls CPU allocation (1,769 MB = 1 full vCPU). Low memory severely throttles CPU during JVM startup. Increasing memory and enabling SnapStart or Provisioned Concurrency eliminates cold starts."
    },
    quests: [
      { id: "cloud-m1-d11-q1", name: "Firecracker MicroVM Lifecycle: Init Phase vs Invoke Phase", type: "concept", desc: "Trace container freeze/thaw mechanics, CPU scaling with memory, and ephemeral disk limits." },
      { id: "cloud-m1-d11-q2", name: "Detective Lab: The Connection Pool Exhaustion Trap", type: "detective", desc: "Fix a Lambda function opening new Postgres connections inside the handler on every invoke." },
      { id: "cloud-m1-d11-q3", name: "Mastery Assignment: Cold-Start Optimized Lambda Microservice", type: "assignment", desc: "Build a TypeScript Lambda handler with lazy-loaded dependencies and global connection reuse." },
      { id: "cloud-m1-d11-q4", name: "Production Incident Lab: Unreserved Concurrency Runaway Outage", type: "detective", desc: "Resolve an account-wide Lambda throttle caused by a rogue background worker consuming all 1,000 concurrent executions." }
    ]
  },
  {
    day: 12,
    month: 1,
    blockNum: 3,
    title: "Amazon API Gateway (HTTP/REST): Payload Validation, CORS Preflight & Custom Lambda Authorizers",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "API Edge Architecture (Gateway Routing & Auth Validation)",
    spokenGoal: "Build production serverless entry points: master Amazon API Gateway (HTTP APIs vs REST APIs), request schema validation, CORS preflight headers, and token-based Custom Lambda Authorizers with IAM policy caching.",
    conceptInvariant: "API Gateway should reject invalid payloads and unauthorized tokens at the edge before invoking downstream Lambda functions, saving compute costs and preventing Lambda concurrency exhaustion.",
    failureMode: "Handling authentication inside every individual Lambda function instead of an API Gateway Authorizer, forcing Lambda to spin up MicroVMs and pay compute fees for every single unauthenticated bot request.",
    tryItFriction: "Construct a Lambda Authorizer that verifies an incoming Bearer JWT and returns a cached IAM Policy document (`Effect: Allow`, `Resource: arn:aws:execute-api:...`).",
    socraticHints: [
      "Why use an API Gateway Authorizer instead of checking JWTs inside your business logic Lambda?",
      "API Gateway evaluates the authorizer once, caches the resulting IAM policy, and blocks invalid requests at the edge!",
      "Downstream microservices only execute when the request is pre-validated and authenticated."
    ],
    situationalPuzzle: {
      scenario: "A frontend single-page application hosted on `https://myapp.com` makes an API request to API Gateway at `https://api.myapp.com/orders`. The browser console reports: 'CORS policy: No Access-Control-Allow-Origin header is present'. The developer adds CORS headers to the Lambda response, but the error persists. Why?",
      options: [
        "The browser must use HTTP instead of HTTPS.",
        "Missing CORS Preflight Handler: The browser sends an `OPTIONS` preflight request before the `POST`. If API Gateway does not have an OPTIONS method configured returning 200 OK with proper headers, the preflight fails before Lambda is ever called.",
        "API Gateway does not support web browsers.",
        "The Lambda function needs administrator permissions."
      ],
      answerIdx: 1,
      debrief: "Browsers execute an HTTP `OPTIONS` preflight request for cross-origin calls with custom headers. If API Gateway does not intercept and respond to OPTIONS with `Access-Control-Allow-Origin`, the browser cancels the request before the actual payload reaches Lambda."
    },
    quests: [
      { id: "cloud-m1-d12-q1", name: "API Gateway Request Lifecycle & Edge Validation Pipelines", type: "concept", desc: "Trace requests through Method Request, Integration Request, Lambda Execution, and Integration Response." },
      { id: "cloud-m1-d12-q2", name: "Detective Lab: The Broken CORS Preflight Pipeline", type: "detective", desc: "Debug an API Gateway configuration failing cross-origin OPTIONS requests with missing headers." },
      { id: "cloud-m1-d12-q3", name: "Mastery Assignment: High-Speed JWT Lambda Authorizer Engine", type: "assignment", desc: "Write a Lambda Authorizer that validates RSA256 tokens and generates dynamic IAM policy documents." },
      { id: "cloud-m1-d12-q4", name: "Production Incident Lab: Unauthenticated DDoS API Cost Spike", type: "detective", desc: "Triage a 10,000 req/sec bot attack by placing request validators and usage plan rate limits on API Gateway." }
    ]
  },
  {
    day: 13,
    month: 1,
    blockNum: 3,
    title: "Amazon DynamoDB Foundations: Partition Keys, Sort Keys & Global Secondary Indexes (GSI)",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "NoSQL Data Architecture (Key-Value Scaling & Query Invariants)",
    spokenGoal: "Master cloud NoSQL database design: learn DynamoDB partition key hashing, composite primary keys (PK + SK), Read/Write Capacity Units (RCU/WCU), On-Demand mode, and Global Secondary Indexes (GSI).",
    conceptInvariant: "DynamoDB distributes data across physical storage nodes using a MD5/SHA256 hash of the Partition Key. A query must target a specific Partition Key; running a Scan forces DynamoDB to read every single item in the entire table, leading to massive latency and RU exhaustion.",
    failureMode: "Calling `Scan()` on a 50-million-item DynamoDB table from a web endpoint to find a user by email, burning 10,000 RCUs and locking the table for 45 seconds.",
    tryItFriction: "Create a DynamoDB table with a composite key `PK: tenantId`, `SK: orderId`, and a Global Secondary Index on `email` to execute sub-10ms queries without scanning.",
    socraticHints: [
      "What is the difference between a `Query` and a `Scan` in DynamoDB?",
      "A `Query` uses the Partition Key hash to instantly locate the exact storage partition (O(1))!",
      "A `Scan` reads sequentially through every storage partition across the entire table (O(N)), which is catastrophic at scale."
    ],
    situationalPuzzle: {
      scenario: "A gaming backend stores player events using `timestamp` (e.g. `2026-10-11T12:00:00Z`) as the DynamoDB Partition Key. During a global tournament, millions of events write with the same timestamp. Writes begin failing with `ProvisionedThroughputExceededException` despite having 50,000 WCUs provisioned. What happened?",
      options: [
        "DynamoDB does not support timestamps.",
        "Hot Partition Bottleneck: Using time as a Partition Key routes 100% of simultaneous writes to a single physical partition (which is capped at 1,000 WCU/sec), leaving other partitions idle.",
        "The DynamoDB table must be converted to an RDS instance.",
        "The network bandwidth of the Lambda function was saturated."
      ],
      answerIdx: 1,
      debrief: "A single DynamoDB physical partition cannot exceed 1,000 WCUs or 3,000 RCUs. Using a monotonically increasing value like timestamp as a PK causes a 'hot partition'. Keys must be high-cardinality (e.g. `userId` or sharded IDs) to distribute across nodes."
    },
    quests: [
      { id: "cloud-m1-d13-q1", name: "DynamoDB Physical Partition Hashing & Capacity Math", type: "concept", desc: "Calculate physical storage splits, RCU/WCU pricing, and item collection size limits (10GB)." },
      { id: "cloud-m1-d13-q2", name: "Detective Lab: The Table-Killing DynamoDB Scan Disaster", type: "detective", desc: "Locate an unindexed `Scan` in a microservice codebase and rewrite it to a targeted GSI `Query`." },
      { id: "cloud-m1-d13-q3", name: "Mastery Assignment: Composite Key E-Commerce Schema Builder", type: "assignment", desc: "Design a DynamoDB schema supporting 5 access patterns using composite PK/SK and a sparse GSI." },
      { id: "cloud-m1-d13-q4", name: "Production Incident Lab: Hot Partition Write Throttling Post-Mortem", type: "detective", desc: "Triage a write throttling crisis by implementing write sharding (`PK = eventType_randomSuffix`)." }
    ]
  },
  {
    day: 14,
    month: 1,
    blockNum: 3,
    title: "Amazon Relational Database Service (RDS): Multi-AZ Synchronous Replication & Read Replicas",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Relational Cloud Data (High-Availability & Read Scaling)",
    spokenGoal: "Scale SQL in the cloud: master Amazon RDS PostgreSQL/MySQL architecture, Multi-AZ synchronous block-level replication for automatic failover, asynchronous Read Replicas for query offloading, and automated backups.",
    conceptInvariant: "RDS Multi-AZ is for Disaster Recovery and High Availability (synchronous standby in a second AZ with automated DNS failover in 60s); it CANNOT serve read traffic. Read Replicas are for Scaling (asynchronous replication that serves read-only queries).",
    failureMode: "Thinking an RDS Multi-AZ Standby database can be used to run heavy reporting queries, not realizing the standby database is completely dormant and cannot accept connections.",
    tryItFriction: "Simulate an RDS Multi-AZ reboot with failover and observe how the primary CNAME DNS record flips to the standby instance in the secondary AZ without changing endpoint URLs.",
    socraticHints: [
      "Can your application read data from an RDS Multi-AZ Standby instance?",
      "No! The Standby instance is an exact synchronous mirror reserved exclusively for automated failover.",
      "To scale read queries, create one or more RDS Read Replicas and point your reporting traffic to their endpoints."
    ],
    situationalPuzzle: {
      scenario: "An e-commerce site experiences 10-second checkout delays because marketing runs massive SQL reports on the primary RDS instance during business hours. The lead engineer suggests enabling Multi-AZ to offload the reports. Why will this fail, and what is the proper solution?",
      options: [
        "Multi-AZ deletes reporting tables automatically.",
        "Multi-AZ standbys do not accept connections; the architect must create asynchronous Read Replicas and configure the reporting service to query the Read Replica endpoint.",
        "The database must be migrated to SQLite.",
        "Reports must be run inside AWS Lambda."
      ],
      answerIdx: 1,
      debrief: "RDS Multi-AZ maintains an exact synchronous physical replica in another AZ for instant failover, but the standby cannot accept client connections. Read Replicas are asynchronous copies designed specifically for offloading read traffic."
    },
    quests: [
      { id: "cloud-m1-d14-q1", name: "RDS Multi-AZ vs Read Replica Storage Architecture", type: "concept", desc: "Contrast synchronous EBS storage replication against asynchronous engine-level transaction log replication." },
      { id: "cloud-m1-d14-q2", name: "Detective Lab: The Primary Database Read Saturation Outage", type: "detective", desc: "Diagnose an RDS primary instance CPU spike and reroute analytic queries to read replicas." },
      { id: "cloud-m1-d14-q3", name: "Mastery Assignment: Split-Read/Write Database Connection Router", type: "assignment", desc: "Build an application connection proxy routing write queries (`INSERT/UPDATE`) to primary and reads (`SELECT`) to replicas." },
      { id: "cloud-m1-d14-q4", name: "Production Incident Lab: Unplanned Multi-AZ Failover Triage", type: "detective", desc: "Handle a production primary RDS crash, monitor DNS CNAME propagation, and verify application reconnection." }
    ]
  },
  {
    day: 15,
    month: 1,
    blockNum: 3,
    title: "⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Integrative Milestone Synthesis (Event-Driven Cloud Workflows)",
    spokenGoal: "Build and deploy an enterprise serverless pipeline: construct an event-driven video ingestion engine where S3 ObjectCreated events trigger Lambda transcoders, write metadata to DynamoDB, and notify clients via API Gateway.",
    conceptInvariant: "Event-driven serverless architectures decouple ingest from processing. Direct file uploads land in S3; S3 automatically publishes asynchronous notification events; Lambda consumes the events without blocking the user.",
    failureMode: "Having the client wait synchronously on an HTTP POST while a 500MB video is processed and thumbnailed, hitting the 29-second API Gateway timeout and returning a 504 Gateway Timeout error.",
    tryItFriction: "Trace and verify an end-to-end event flow: Client requests S3 Presigned URL -> uploads raw MP4 -> S3 fires Event -> Lambda generates thumbnail -> DynamoDB records status 'READY'.",
    socraticHints: [
      "What is the maximum execution timeout for Amazon API Gateway HTTP requests?",
      "Exactly 29 seconds! Any long-running job will timeout at the API edge.",
      "Decouple the upload: return 202 Accepted immediately, let S3 trigger Lambda asynchronously, and poll or use WebSockets for completion."
    ],
    situationalPuzzle: {
      scenario: "A video upload pipeline works in testing, but in production, users upload 50 videos simultaneously. S3 triggers 50 Lambda instances simultaneously, which all query a small RDS MySQL database to write metadata. RDS crashes with `Too many connections`. How should this serverless-to-RDS impedance mismatch be resolved?",
      options: [
        "Tell users they can only upload 1 video at a time.",
        "Place an Amazon RDS Proxy between Lambda and RDS to pool connections, or buffer metadata writes through an SQS queue with controlled concurrency.",
        "Switch RDS from MySQL to Microsoft Access.",
        "Increase the Lambda timeout to 15 minutes."
      ],
      answerIdx: 1,
      debrief: "Lambda scales instantly from 0 to 1,000+ executions, but relational databases have fixed connection limits. Using Amazon RDS Proxy maintains persistent connection pools, preventing Lambda from overwhelming database connections."
    },
    quests: [
      { id: "cloud-m1-d15-q1", name: "Milestone Architecture: Event-Driven Serverless Pipeline Spec", type: "concept", desc: "Design the complete event choreography: Presigned S3 -> Event Notification -> Lambda -> DynamoDB." },
      { id: "cloud-m1-d15-q2", name: "Detective Lab: The 29-Second API Gateway Timeout Cliff", type: "detective", desc: "Refactor a synchronous video encoding endpoint into an asynchronous event-driven workflow." },
      { id: "cloud-m1-d15-q3", name: "Mastery Assignment: End-to-End Serverless Transcoding Orchestrator", type: "assignment", desc: "Implement S3 event parsing, DynamoDB metadata recording, and error state dead-letter queues in TypeScript." },
      { id: "cloud-m1-d15-q4", name: "Production Incident Lab: S3 Event Notification Drop Recovery", type: "detective", desc: "Triage lost video processing events caused by unhandled Lambda exceptions and recover messages via SQS DLQ." }
    ]
  },

  // ─── BLOCK 4: Edge Delivery, DNS & Asynchronous Messaging (Days 16–20) ───────────
  {
    day: 16,
    month: 1,
    blockNum: 4,
    title: "Amazon CloudFront: Global CDN Caching Invariants, Cache Invalidation & Lambda@Edge Rewrites",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Edge Acceleration & Distributed Caching",
    spokenGoal: "Accelerate global web performance: master Amazon CloudFront Content Delivery Network (CDN), Edge Locations, Origin Request/Response policies, Cache-Control headers, invalidations, and edge compute with CloudFront Functions.",
    conceptInvariant: "The fastest and cheapest request is the one that never touches your origin. CloudFront serves cached content from local Edge Locations within 10ms; cache invalidation (`/*`) should be used sparingly due to cost and origin stampede risks.",
    failureMode: "Issuing a wildcard `/*` CloudFront cache invalidation on every git push, flushing all global edge caches and causing 100,000 simultaneous users to slam the origin web servers, causing an instant outage.",
    tryItFriction: "Configure CloudFront Cache Policies using `Cache-Control: max-age=31536000, immutable` for hashed asset bundles and `s-maxage=60` for dynamic API responses.",
    socraticHints: [
      "Why is cache busting via filename hashes (`app.a8f2b.js`) superior to CloudFront invalidation?",
      "Filename hashing requires zero invalidations: new files are fetched once, old files expire naturally, and zero origin stampede occurs!",
      "Invalidations cost money after the first 1,000 paths and force origin re-fetches globally."
    ],
    situationalPuzzle: {
      scenario: "A global e-commerce frontend is served via CloudFront backed by S3. A deployment pushes an updated `index.html`. Users across Europe and Asia complain they still see the old version 4 hours later. The developer set `Cache-Control: public, max-age=86400` on `index.html`. What is the correct architectural fix?",
      options: [
        "Delete the CloudFront distribution and recreate it.",
        "Set `Cache-Control: no-cache, no-store, must-revalidate` specifically on `index.html` so edges always revalidate the root document, while assets use long max-age with content hashes.",
        "Increase the S3 bucket size.",
        "Change the domain name."
      ],
      answerIdx: 1,
      debrief: "Root HTML entry points (`index.html`) should never be cached long-term. Using `no-cache` forces edge revalidation, ensuring new deployments take effect immediately while bundled JS/CSS assets remain aggressively cached via content hashes."
    },
    quests: [
      { id: "cloud-m1-d16-q1", name: "CloudFront Edge Topology & Cache Hit Ratio Optimization", type: "concept", desc: "Analyze Regional Edge Caches, TTL hierarchies, and query string / header forwarding policies." },
      { id: "cloud-m1-d16-q2", name: "Detective Lab: The Origin-Busting Wildcard Invalidation", type: "detective", desc: "Investigate an origin server crash caused by automated CI/CD invalidations flushing 400 global edge caches." },
      { id: "cloud-m1-d16-q3", name: "Mastery Assignment: CloudFront Function Lightweight URL Rewriter", type: "assignment", desc: "Write a sub-millisecond CloudFront Function that rewrites vanity URLs and normalizes request headers at the edge." },
      { id: "cloud-m1-d16-q4", name: "Production Incident Lab: Cache Poisoning Security Post-Mortem", type: "detective", desc: "Isolate and remediate a CDN cache poisoning vulnerability where unkeyed HTTP headers overwrote response bodies." }
    ]
  },
  {
    day: 17,
    month: 1,
    blockNum: 4,
    title: "Amazon Route 53: DNS Query Routing Policies (Latency, Geolocation, Weighted, Failover)",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Global Traffic Steering (DNS Architecture & Resiliency)",
    spokenGoal: "Direct global internet traffic at the DNS layer: master Amazon Route 53 Public and Private Hosted Zones, Alias records, Latency-Based Routing, Geolocation, Weighted round-robin, and Active-Passive Failover routing with Health Checks.",
    conceptInvariant: "Route 53 Alias records are AWS-specific extensions that route directly to AWS resources (ALBs, CloudFront distributions, S3 websites) without incurring additional DNS query fees, and can be used at the root zone apex (`example.com`).",
    failureMode: "Attempting to use a standard DNS CNAME record for a zone apex domain (`myapp.com`), violating RFC 1034 DNS specifications and breaking email MX routing.",
    tryItFriction: "Configure a Route 53 Failover Routing policy that monitors primary ALB health probes and automatically diverts global traffic to a static S3 maintenance page within 60 seconds.",
    socraticHints: [
      "Can you create a CNAME record for `example.com` (the root apex domain)?",
      "No! DNS RFC 1034 prohibits CNAME records at the zone apex because it conflicts with SOA and NS records.",
      "Use Route 53 Alias records! They map apex domains directly to ALBs and CloudFront without CNAME restrictions."
    ],
    situationalPuzzle: {
      scenario: "A SaaS company runs an active-passive disaster recovery architecture. Route 53 routes 100% of traffic to Primary (`us-east-1`). A health check monitors `https://app.com/healthz`. The primary datacenter suffers a catastrophic outage. Route 53 fails over to Secondary (`eu-west-1`). However, clients report downtime for 15 minutes. What DNS setting caused this lag?",
      options: [
        "Route 53 only updates DNS records once a day.",
        "High DNS TTL (Time To Live): The DNS record TTL was configured to 900 seconds (15 minutes); client OS and ISP resolvers cached the old primary IP and refused to re-query Route 53 until the TTL expired.",
        "Route 53 requires approval from ICANN for failover.",
        "The secondary region did not have an Internet Gateway."
      ],
      answerIdx: 1,
      debrief: "DNS failover speed is governed by TTL (Time To Live). If a record has a 900-second TTL, client resolvers cache the old IP address for 15 minutes after Route 53 updates. Production failover records must use low TTLs (e.g. 60 seconds)."
    },
    quests: [
      { id: "cloud-m1-d17-q1", name: "DNS Resolution Mechanics & Route 53 Routing Algorithms", type: "concept", desc: "Compare Latency-Based, Geolocation, Geoproximity, and Multivalue routing algorithms." },
      { id: "cloud-m1-d17-q2", name: "Detective Lab: The CNAME Apex Domain Configuration Trap", type: "detective", desc: "Fix an invalid DNS zone apex configuration by migrating broken CNAME records to Route 53 Alias records." },
      { id: "cloud-m1-d17-q3", name: "Mastery Assignment: Active-Passive DNS Disaster Recovery Failover Rig", type: "assignment", desc: "Construct a complete Route 53 failover routing policy backed by deep health checks and secondary S3 origins." },
      { id: "cloud-m1-d17-q4", name: "Production Incident Lab: Split-Brain DNS Routing Cascade", type: "detective", desc: "Resolve a routing crisis where misconfigured health check thresholds caused Route 53 to oscillate between regions." }
    ]
  },
  {
    day: 18,
    month: 1,
    blockNum: 4,
    title: "Amazon Simple Queue Service (SQS): Standard vs FIFO Queues & Visibility Timeouts",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Asynchronous Message Queues (Decoupling & Flow Control)",
    spokenGoal: "Decouple backend microservices with resilient queues: master Amazon SQS Standard queues (at-least-once delivery, nearly unlimited throughput) vs FIFO queues (exactly-once processing, strict ordering), Visibility Timeouts, and Dead-Letter Queues (DLQ).",
    conceptInvariant: "When a consumer receives a message from SQS, the message is NOT deleted. It becomes invisible to other consumers for the duration of the Visibility Timeout. The consumer must explicitly delete the message after successful processing.",
    failureMode: "Processing a 45-second video job with an SQS Visibility Timeout set to 30 seconds. At second 30, SQS makes the message visible again; a second worker picks it up, causing duplicate processing and race conditions.",
    tryItFriction: "Simulate SQS message consumption, dynamic Visibility Timeout extension (`changeMessageVisibility`), and verify automatic message escalation to a Dead-Letter Queue after 3 failed attempts.",
    socraticHints: [
      "What happens if your worker takes 60 seconds to process a message but the SQS Visibility Timeout is 30 seconds?",
      "SQS assumes your worker died! At second 30, another worker receives the same message and processes it simultaneously.",
      "Always set the Visibility Timeout to 6x your expected processing duration, or extend it dynamically."
    ],
    situationalPuzzle: {
      scenario: "A banking application processes debit transactions. The team uses an SQS Standard queue. Occasionally, an account gets charged twice for the same purchase. SQS metrics show no duplicate sends from the producer. What is the architectural flaw?",
      options: [
        "SQS Standard queues randomly generate extra messages.",
        "Standard Queue At-Least-Once Delivery: SQS Standard queues guarantee at-least-once delivery, which can deliver duplicate copies of a message; financial transactions requiring strict ordering and exactly-once execution must use SQS FIFO queues with deduplication IDs.",
        "The database should have used MongoDB.",
        "The visibility timeout was too large."
      ],
      answerIdx: 1,
      debrief: "Amazon SQS Standard queues guarantee at-least-once delivery, meaning occasional duplicate messages are normal. When duplicate execution is impermissible, architectures must use SQS FIFO queues (with MessageDeduplicationId) or implement idempotent consumers."
    },
    quests: [
      { id: "cloud-m1-d18-q1", name: "SQS Distributed Architecture: Standard vs FIFO Invariants", type: "concept", desc: "Contrast at-least-once delivery and best-effort ordering against FIFO message groups and deduplication windows." },
      { id: "cloud-m1-d18-q2", name: "Detective Lab: The Premature Visibility Timeout Duplicate Storm", type: "detective", desc: "Debug an issue where slow worker processing caused SQS to redeliver messages, triggering duplicate database writes." },
      { id: "cloud-m1-d18-q3", name: "Mastery Assignment: Resilient SQS Consumer with Dynamic Visibility Extension", type: "assignment", desc: "Implement a TypeScript worker that processes long-running jobs and extends visibility timeouts heartbeats." },
      { id: "cloud-m1-d18-q4", name: "Production Incident Lab: Poison Pill Message Loop & DLQ Poisoning", type: "detective", desc: "Isolate a malformed payload crashing all worker threads and route it safely to an SQS Dead-Letter Queue." }
    ]
  },
  {
    day: 19,
    month: 1,
    blockNum: 4,
    title: "Amazon Simple Notification Service (SNS): Pub/Sub Topic Fanout & Cross-Account Subscription Filters",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Publish/Subscribe Topologies (One-to-Many Event Fanout)",
    spokenGoal: "Broadcast events across distributed microservices: master Amazon SNS topics, pub/sub fanout architectures, cross-account permissions, SMS/Email delivery, and Subscription Filter Policies that reduce unnecessary compute.",
    conceptInvariant: "The SNS Fanout pattern publishes a single event to an SNS Topic, which instantly replicates that message to multiple independent SQS queues. Each microservice processes the event at its own pace without coupling producers to consumers.",
    failureMode: "Having a payment microservice make 5 synchronous HTTP calls to 5 internal services (Email, Shipping, Fraud, Inventory, Analytics). When Analytics lags, checkout fails completely.",
    tryItFriction: "Create an SNS Topic that fans out order events to two separate SQS queues: Queue 1 receives all orders, while Queue 2 uses a Subscription Filter Policy to only receive high-priority orders (`orderTotal > 1000`).",
    socraticHints: [
      "Why is SNS + SQS fanout superior to an API calling 5 microservices directly?",
      "Decoupling! If the Email or Inventory service goes down, the message safely buffers in its SQS queue.",
      "The producer only makes one fast call to SNS and immediately returns success to the user."
    ],
    situationalPuzzle: {
      scenario: "An e-commerce order service publishes `OrderCreated` events to an SNS topic. Five separate microservices subscribe via SQS queues. The Fraud Detection service only cares about orders originating from international IP addresses. Currently, it consumes every message and discards 90% of them, wasting compute. How should this be optimized?",
      options: [
        "Create a separate SNS topic for every country.",
        "Configure an SNS Subscription Filter Policy on the Fraud queue so SNS filters attributes at the edge, delivering only international orders and dropping the rest before queuing.",
        "Have the Fraud service write discarded messages to S3.",
        "Poll SNS directly without using SQS."
      ],
      answerIdx: 1,
      debrief: "SNS Subscription Filter Policies evaluate message attributes at the pub/sub layer. Messages that do not match the filter criteria are never delivered to the subscriber's SQS queue, saving bandwidth, storage, and consumer compute cycles."
    },
    quests: [
      { id: "cloud-m1-d19-q1", name: "SNS Pub/Sub Topology & Fanout Architecture Invariants", type: "concept", desc: "Map event broadcasting across heterogeneous targets: SQS, Lambda, HTTPS webhooks, and mobile push." },
      { id: "cloud-m1-d19-q2", name: "Detective Lab: The Monolithic Synchronous Chain Reaction", type: "detective", desc: "Refactor a brittle multi-service synchronous HTTP cascade into an asynchronous SNS fanout pipeline." },
      { id: "cloud-m1-d19-q3", name: "Mastery Assignment: SNS Subscription Filter Policy Rule Builder", type: "assignment", desc: "Write JSON subscription filter policies that route events based on numeric ranges, prefixes, and boolean flags." },
      { id: "cloud-m1-d19-q4", name: "Production Incident Lab: Fanout Queue Backlog Cascading Triage", type: "detective", desc: "Manage a downstream queue backlog incident during a flash sale by scaling consumers and tuning DLQs." }
    ]
  },
  {
    day: 20,
    month: 1,
    blockNum: 4,
    title: "Amazon EventBridge: Serverless Event Bus, Content-Filtered Rules & Schema Registry Serialization",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Enterprise Event Choreography (Event Bus & Schema Governance)",
    spokenGoal: "Orchestrate complex cloud architectures with Amazon EventBridge: master custom event buses, pattern-matching rules, SaaS partner integrations (Stripe, Datadog), archive/replay, and Schema Registry code generation.",
    conceptInvariant: "EventBridge is an intelligent serverless event bus that routes events based on payload content matching (`detail-type`, `source`, nested JSON attributes). Unlike SNS which filters on metadata attributes, EventBridge evaluates the full JSON event body.",
    failureMode: "Using EventBridge for ultra-high-throughput real-time telemetry (100,000 events/sec) where Kinesis is required, resulting in unexpected API throttling and latency spikes.",
    tryItFriction: "Author an EventBridge Rule with complex pattern matching (filtering on `source: com.fintech.orders`, `detail.status: [\"APPROVED\", \"COMPLETED\"]`, and `detail.amount: [ { numeric: [ \">=\", 500 ] } ]`).",
    socraticHints: [
      "When should you choose EventBridge over SNS?",
      "Use EventBridge when you need to route events based on payload content, integrate with SaaS partners, or need event replay!",
      "Use SNS for ultra-high-throughput topic fanout (sub-millisecond latency, millions of messages/sec)."
    ],
    situationalPuzzle: {
      scenario: "A microservice deployment introduces a bug that corrupts event processing for 2 hours. The bug is fixed, but 50,000 order events were missed by downstream consumers. If the team had used EventBridge with which feature enabled, could they recover these lost events without touching the database?",
      options: [
        "AWS CloudWatch Metric Filters.",
        "EventBridge Archive and Replay: Enabling event archiving on the event bus captures all raw events and allows replaying them over any specified time window directly into downstream rules.",
        "Amazon Route 53 Traffic Flow.",
        "AWS Systems Manager Parameter Store."
      ],
      answerIdx: 1,
      debrief: "Amazon EventBridge Archive and Replay records events processed by an event bus. When downstream services suffer outages or software regressions, architects can replay past events from the archive to reprocess missed state safely."
    },
    quests: [
      { id: "cloud-m1-d20-q1", name: "EventBridge Architecture: Buses, Content Filtering & Schema Discovery", type: "concept", desc: "Analyze the event envelope structure (`source`, `detail-type`, `detail`), rule evaluation, and OpenAPI bindings." },
      { id: "cloud-m1-d20-q2", name: "Detective Lab: The Malformed Event Pattern Matcher", type: "detective", desc: "Debug an EventBridge rule that fails to match incoming payloads due to strict JSON type mismatch." },
      { id: "cloud-m1-d20-q3", name: "Mastery Assignment: Enterprise Event Bus & Event Replay Harness", type: "assignment", desc: "Build an EventBridge bus configuration with dead-letter queue bindings and automated replay testing." },
      { id: "cloud-m1-d20-q4", name: "Production Incident Lab: Cross-Region Event Replication Desync", type: "detective", desc: "Triage an event bus routing issue where cross-region event targets failed due to IAM role principal trust errors." }
    ]
  },

  // ─── BLOCK 5: Containers, Workflows & Infrastructure as Code (Days 21–25) ────────
  {
    day: 21,
    month: 1,
    blockNum: 5,
    title: "⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus with SQS/SNS Fanout",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Integrative Milestone Synthesis (Distributed Asynchronous Systems)",
    spokenGoal: "Architect and prove an enterprise event-driven backbone: build an e-commerce order routing system combining SNS Topics, SQS FIFO queues, and EventBridge rules to handle 10,000 orders/sec with zero loss and zero coupling.",
    conceptInvariant: "Asynchronous decoupling guarantees that slow or crashing downstream services (e.g. inventory or analytics) cannot degrade the upstream checkout experience. Queues buffer traffic bursts while producers return HTTP 202 Accepted.",
    failureMode: "Designing an event-driven system without Dead-Letter Queues (DLQs). A single poisoned message causes worker threads to crash repeatedly, blocking queue consumption indefinitely.",
    tryItFriction: "Publish 1,000 concurrent orders through an SNS topic fanned out to Payment, Inventory, and Notification queues, verifying that simulated downstream worker errors route cleanly to DLQs.",
    socraticHints: [
      "What is the maximum number of times an SQS message should be retried before being sent to a DLQ?",
      "Typically 3 to 5 retries (`maxReceiveCount: 3`)!",
      "Retrying infinitely causes a poison message to block processing of all subsequent valid messages."
    ],
    situationalPuzzle: {
      scenario: "During Black Friday, a retail site processes 50,000 orders/minute. The order processing queue experiences a sudden 20-minute delay. Monitoring reveals that all workers are stuck retrying an order with a negative price (`-99.99`) that causes an unhandled exception. What mechanism was missing?",
      options: [
        "A bigger EC2 instance for the database.",
        "Dead-Letter Queue (DLQ) with MaxReceiveCount: Without a DLQ, poisoned messages cycle endlessly through the visibility timeout, consuming 100% of worker capacity and starving valid orders.",
        "CloudFront distribution in front of SQS.",
        "Switching the queue to an SNS topic."
      ],
      answerIdx: 1,
      debrief: "A poison pill message causes consumer processes to crash repeatedly. Configuring an SQS Redrive Policy with a Dead-Letter Queue (DLQ) isolates poison messages after N failed attempts (e.g., `maxReceiveCount: 3`), keeping the pipeline clear."
    },
    quests: [
      { id: "cloud-m1-d21-q1", name: "Milestone Architecture: High-Scale Asynchronous E-Commerce Topology", type: "concept", desc: "Design a complete event topology with SNS fanout, SQS buffers, EventBridge routing, and DLQ monitors." },
      { id: "cloud-m1-d21-q2", name: "Detective Lab: The Poison Pill Worker Crash Cascade", type: "detective", desc: "Isolate a malformed event locking up a consumer pool and attach an automated SQS redrive policy." },
      { id: "cloud-m1-d21-q3", name: "Mastery Assignment: Distributed Microservice Event Broker in TypeScript", type: "assignment", desc: "Write an end-to-end publisher/consumer engine featuring idempotency tracking and DLQ alerts." },
      { id: "cloud-m1-d21-q4", name: "Production Incident Lab: Black Friday Event Storm Triage", type: "detective", desc: "Manage an unexpected 50x event volume burst by autoscaling consumer fleets and managing queue depth alarms." }
    ]
  },
  {
    day: 22,
    month: 1,
    blockNum: 5,
    title: "AWS Elastic Container Service (ECS) & AWS Fargate: Task Definitions, Networking Modes & Auto Scaling",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Containerized Workloads (Serverless Container Orchestration)",
    spokenGoal: "Deploy production Docker containers without managing servers: master AWS ECS, AWS Fargate serverless compute, Task Definitions, ECS Services, `awsvpc` networking mode, and target tracking auto-scaling.",
    conceptInvariant: "Under AWS Fargate with `awsvpc` networking, every single container task receives its own dedicated Elastic Network Interface (ENI) with a private VPC IP address, enabling native Security Group enforcement at the container level.",
    failureMode: "Running containers on EC2 launch types using `bridge` networking, where all containers share the host's security group, making it impossible to enforce least-privilege network isolation between microservices on the same host.",
    tryItFriction: "Author a multi-container ECS Task Definition JSON with CPU/memory reservations, CloudWatch logs integration, and secrets injection from AWS Systems Manager Parameter Store.",
    socraticHints: [
      "Why is `awsvpc` the recommended networking mode for AWS ECS tasks?",
      "Every task gets its own ENI and private IP! This means you can attach Security Groups directly to tasks.",
      "No port conflicts (multiple containers can bind to port 80/443 on the same underlying host)."
    ],
    situationalPuzzle: {
      scenario: "A backend service deployed on ECS Fargate crashes immediately upon startup with error: `CannotPullContainerError: API error... i/o timeout`. The task is deployed in a private subnet. The VPC has an Internet Gateway but no NAT Gateway. What is the cause?",
      options: [
        "Fargate does not support Docker images.",
        "Missing Outbound Route for Image Pulls: The Fargate task in a private subnet cannot reach Amazon ECR to pull the container image without an outbound NAT Gateway or AWS PrivateLink VPC Endpoints for ECR.",
        "The Dockerfile is missing an EXPOSE directive.",
        "ECS requires root credentials to pull images."
      ],
      answerIdx: 1,
      debrief: "ECS Fargate tasks need network connectivity to Amazon ECR to download container images during task launch. In a private subnet, this requires either an outbound route via a NAT Gateway or VPC Endpoints for ECR (`ecr.api`, `ecr.dkr`, and S3)."
    },
    quests: [
      { id: "cloud-m1-d22-q1", name: "ECS Architecture: Clusters, Services, Tasks & Fargate Cost Models", type: "concept", desc: "Compare ECS on EC2 vs Fargate serverless, container instance agents, and capacity providers." },
      { id: "cloud-m1-d22-q2", name: "Detective Lab: The ECR Image Pull Timeout in Private Subnets", type: "detective", desc: "Resolve a Fargate launch failure by establishing VPC Endpoints for ECR and S3." },
      { id: "cloud-m1-d22-q3", name: "Mastery Assignment: Production Fargate Task Definition & Service Spec", type: "assignment", desc: "Construct a complete Task Definition with logging, secrets injection, health checks, and IAM task roles." },
      { id: "cloud-m1-d22-q4", name: "Production Incident Lab: Out-of-Memory (OOM) Container Crash Loop", type: "detective", desc: "Diagnose an ECS task terminating with Exit Code 137 (OOMKilled) and reconfigure memory limits." }
    ]
  },
  {
    day: 23,
    month: 1,
    blockNum: 5,
    title: "AWS Step Functions: Distributed State Machines, Choice States & Saga Compensation Patterns",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Workflow Orchestration (Distributed Sagas & Error Handling)",
    spokenGoal: "Coordinate multi-step distributed workflows: master AWS Step Functions (Standard vs Express Workflows), Amazon States Language (ASL), Parallel and Choice states, catch/retry policies, and the Distributed Saga pattern with automated compensating transactions.",
    conceptInvariant: "Distributed transactions across microservices cannot use two-phase commit (2PC) at scale. Step Functions implements the Saga Pattern: if step 4 fails, the state machine invokes compensating actions backwards (undoing steps 3, 2, and 1) to maintain consistency.",
    failureMode: "Using a Lambda function to orchestrate long-running multi-step jobs by calling other Lambdas in a loop, paying double and triple execution fees while risking a 15-minute Lambda timeout.",
    tryItFriction: "Write an Amazon States Language (ASL) state machine that reserves inventory, charges a credit card, and executes an automated refund compensation if the subsequent shipping step fails.",
    socraticHints: [
      "Why should you orchestrate complex multi-step workflows with Step Functions rather than inside a Lambda script?",
      "Step Functions manages state, timeouts, retries, and compensations visually with zero code server overhead!",
      "Standard Workflows can run for up to 1 year without paying for idle wait time."
    ],
    situationalPuzzle: {
      scenario: "An order processing workflow consists of: 1) Reserve Inventory, 2) Charge Credit Card, 3) Create Shipping Label. If Create Shipping Label fails, what must the architecture do to prevent customer complaints and inventory leaks?",
      options: [
        "Throw an unhandled exception and exit.",
        "Execute Compensating Transactions: Catch the failure in Step Functions and trigger reverse operations: refund the credit card charge and release the reserved inventory (Saga Pattern).",
        "Delete the database record.",
        "Retry the shipping step 10,000 times."
      ],
      answerIdx: 1,
      debrief: "In distributed microservices, ACID transactions cannot span separate services. The Saga Pattern uses backward compensation: when a step fails, the workflow executes inverse compensating transactions to restore consistency."
    },
    quests: [
      { id: "cloud-m1-d23-q1", name: "Amazon States Language (ASL) & Distributed Saga Architecture", type: "concept", desc: "Analyze Task, Choice, Wait, Parallel, and Map states with retry and catch blocks." },
      { id: "cloud-m1-d23-q2", name: "Detective Lab: The Uncompensated Failed Order Inconsistency", type: "detective", desc: "Audit a workflow where card charges remained after shipment failures and add compensating steps." },
      { id: "cloud-m1-d23-q3", name: "Mastery Assignment: Resilient E-Commerce Order Saga State Machine", type: "assignment", desc: "Construct a complete ASL state machine with exponential backoff retries and automated refund compensations." },
      { id: "cloud-m1-d23-q4", name: "Production Incident Lab: Step Functions Execution Quota Throttling", type: "detective", desc: "Triage Standard Workflow execution start rate limits and migrate high-throughput paths to Express Workflows." }
    ]
  },
  {
    day: 24,
    month: 1,
    blockNum: 5,
    title: "Infrastructure as Code (IaC) with Terraform: Declarative State, Remote Backends & DynamoDB Locking",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Automated Cloud Provisioning (Declarative IaC Engineering)",
    spokenGoal: "Declare cloud infrastructure as code: master HashiCorp Terraform / OpenTofu fundamentals, HCL syntax, resource graphs, declarative state files (`terraform.tfstate`), remote S3 backends, and state locking via DynamoDB to prevent concurrent collision.",
    conceptInvariant: "The Terraform state file is the single source of truth mapping your code to real AWS resource IDs. State files contain sensitive credentials and must NEVER be stored in Git; they must reside in a secure S3 bucket with versioning and DynamoDB state locking.",
    failureMode: "Two engineers running `terraform apply` simultaneously without state locking, corrupting the remote state file and orphan-deleting production VPC resources.",
    tryItFriction: "Write a complete Terraform configuration for an S3 bucket with remote state backend configuration: `backend \"s3\" { bucket = \"...\", key = \"...\", dynamodb_table = \"...\" }`.",
    socraticHints: [
      "What happens if two CI/CD pipelines run `terraform apply` at the exact same moment without DynamoDB locking?",
      "Both pipelines read and attempt to overwrite the state file simultaneously, causing state corruption and lost resources!",
      "DynamoDB provides distributed mutex locking (`LockID`), forcing the second apply to wait."
    ],
    situationalPuzzle: {
      scenario: "A junior engineer accidentally commits `terraform.tfstate` to a public GitHub repository. Security scans alert immediately. Beyond exposing the entire infrastructure topology, what is the most critical immediate danger?",
      options: [
        "Terraform code cannot be run from GitHub.",
        "Plaintext Secrets Exposure: The Terraform state file stores all resource attributes in unencrypted plaintext, including database master passwords, IAM secret keys, and TLS private keys.",
        "The AWS account is automatically closed by GitHub.",
        "Terraform HCL syntax will fail to compile."
      ],
      answerIdx: 1,
      debrief: "Terraform state files contain every attribute of managed resources in plaintext, including generated database passwords, private keys, and environment variables. Committing state files to version control is an immediate credential leak."
    },
    quests: [
      { id: "cloud-m1-d24-q1", name: "Terraform Execution Graph & Remote State Locking Invariants", type: "concept", desc: "Trace `terraform init`, `plan`, `apply`, and dependency graph DAG construction." },
      { id: "cloud-m1-d24-q2", name: "Detective Lab: The State File Race Condition Disaster", type: "detective", desc: "Remediate a corrupted Terraform state file and configure an S3 backend with DynamoDB locking." },
      { id: "cloud-m1-d24-q3", name: "Mastery Assignment: Production AWS VPC Module in Terraform HCL", type: "assignment", desc: "Author a reusable Terraform module provisioning a Multi-AZ VPC with subnets, route tables, and NAT gateways." },
      { id: "cloud-m1-d24-q4", name: "Production Incident Lab: Terraform Drift & Out-of-Band Resource Desync", type: "detective", desc: "Reconcile infrastructure drift caused by manual AWS console edits using `terraform refresh` and `import`." }
    ]
  },
  {
    day: 25,
    month: 1,
    blockNum: 5,
    title: "Amazon CloudWatch: Metric Math, Composite Alarms & Log Insights High-Cardinality Queries",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Observability & SRE Foundations (Metrics, Logs & Alarms)",
    spokenGoal: "Observe and monitor cloud infrastructure like an SRE: master Amazon CloudWatch Metrics, Metric Math (calculating error rates as a percentage), Composite Alarms, and high-speed Log Insights queries across distributed microservices.",
    conceptInvariant: "Alerting on raw error counts generates false alarms during low-traffic periods and misses critical failures during high-traffic spikes. High-reliability systems must alert on Error Rate Percentages (`(Errors / Invocations) * 100 > 1%`) using CloudWatch Metric Math.",
    failureMode: "Configuring a static alarm on 'Errors > 50'. During an outage at 3 AM when traffic is low (only 60 requests), 55 errors occur (a 92% failure rate), but the alarm barely fires. At 2 PM when traffic is 1,000,000 reqs, 60 transient errors fire a false alarm.",
    tryItFriction: "Write a CloudWatch Log Insights query to aggregate HTTP 500 error counts grouped by request path and IP address over a 1-hour window.",
    socraticHints: [
      "Why is alerting on error rate percentage superior to alerting on raw error counts?",
      "Because 50 errors out of 100 requests is a catastrophic 50% outage, while 50 errors out of 1,000,000 requests is 99.995% success!",
      "Use CloudWatch Metric Math to calculate `e1 = (m1 / m2) * 100` and alert on percentage thresholds."
    ],
    situationalPuzzle: {
      scenario: "An on-call engineer gets woken up 15 times a night by CloudWatch alarms triggering on transient single-minute CPU spikes that resolve themselves in 20 seconds. How should the alarm evaluation periods be configured to eliminate fatigue while still catching real sustained outages?",
      options: [
        "Delete all alarms and rely on user complaints.",
        "Evaluation Period Tuning: Configure the alarm with an evaluation period of `3 out of 3 data points` or `M out of N` (e.g. 3 consecutive 1-minute periods above 80%) to filter out brief transient spikes.",
        "Set the CPU threshold to 100%.",
        "Switch the instances from EC2 to Lambda."
      ],
      answerIdx: 1,
      debrief: "Single-datapoint alarms fire on brief, normal workload spikes. Setting evaluation periods to 'M out of N' (e.g., 3 out of 3 consecutive 1-minute periods) ensures alarms trigger only on sustained, anomalous conditions, eliminating on-call alert fatigue."
    },
    quests: [
      { id: "cloud-m1-d25-q1", name: "CloudWatch Telemetry Architecture: Metrics, Logs & Alarms", type: "concept", desc: "Analyze high-resolution metrics (1-second intervals), metric dimensions, and retention policies." },
      { id: "cloud-m1-d25-q2", name: "Detective Lab: The Flapping False-Alarm Fatigue Nightmare", type: "detective", desc: "Redesign an alert suite using Metric Math error percentages and multi-period evaluation windows." },
      { id: "cloud-m1-d25-q3", name: "Mastery Assignment: CloudWatch Log Insights Query Library & Dashboard", type: "assignment", desc: "Construct production Log Insights queries to parse JSON logs, extract p99 latency, and group top error codes." },
      { id: "cloud-m1-d25-q4", name: "Production Incident Lab: Silent Production Outage Detection", type: "detective", desc: "Diagnose an outage where HTTP 200 responses contained internal error strings, requiring metric filter extraction." }
    ]
  },

  // ─── BLOCK 6: Security Governance, FinOps & Disaster Recovery (Days 26–30) ────────
  {
    day: 26,
    month: 1,
    blockNum: 6,
    title: "AWS Key Management Service (KMS): Envelope Encryption, Customer Managed Keys (CMK) & DEK Caching",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Cryptographic Architecture & Data Protection",
    spokenGoal: "Master cloud cryptography: understand AWS Key Management Service (KMS), symmetric vs asymmetric keys, Customer Managed Keys (CMKs), Key Policies, and Envelope Encryption with Data Encryption Keys (DEKs).",
    conceptInvariant: "KMS never encrypts large data directly (KMS has a 4KB payload limit). Under Envelope Encryption, KMS generates a Data Encryption Key (DEK). Your application encrypts the data locally with the plaintext DEK, and stores the encrypted DEK alongside the ciphertext.",
    failureMode: "Calling `kms:Encrypt` over the network for every single database column or record, hitting KMS regional API rate limits (10,000 req/sec) and incurring thousands of dollars in KMS API request charges.",
    tryItFriction: "Trace the envelope encryption flow: `kms:GenerateDataKey` -> receive plaintext DEK + ciphertext DEK -> encrypt data locally -> wipe plaintext DEK from memory -> persist ciphertext DEK.",
    socraticHints: [
      "Can KMS encrypt a 50MB file directly using the `Encrypt` API?",
      "No! KMS API only accepts data up to 4KB in size.",
      "Use Envelope Encryption: call `GenerateDataKey` to get a 256-bit AES key, encrypt the 50MB file locally, and wipe the plaintext key from RAM."
    ],
    situationalPuzzle: {
      scenario: "A microservice encrypts user PII before saving to DynamoDB. The service calls `kms:Encrypt` for every record. During a marketing campaign (50,000 writes/sec), all requests begin failing with `KMS.KMSThrottlingException`. How should the cryptography architecture be redesigned?",
      options: [
        "Stop encrypting user PII to save performance.",
        "Implement AWS Encryption SDK with Data Key Caching: Cache Data Encryption Keys (DEKs) locally for a short time (e.g. 5 minutes or 1,000 uses) to drastically reduce KMS API calls while maintaining envelope security.",
        "Store the plaintext master key in GitHub.",
        "Increase the database capacity units."
      ],
      answerIdx: 1,
      debrief: "Calling KMS on every operation exhausts API rate limits. The AWS Encryption SDK provides cryptographic Data Key Caching, allowing a single DEK to safely encrypt multiple records within strict time and message limits before requesting a new key from KMS."
    },
    quests: [
      { id: "cloud-m1-d26-q1", name: "Envelope Encryption Cryptographic Mechanics & Key Hierarchy", type: "concept", desc: "Trace Master Keys (KMS), Data Encryption Keys (DEKs), and local AES-GCM cipher execution." },
      { id: "cloud-m1-d26-q2", name: "Detective Lab: The 10,000 Req/Sec KMS API Throttling Outage", type: "detective", desc: "Diagnose an application crashing on KMS rate limits and implement local DEK caching." },
      { id: "cloud-m1-d26-q3", name: "Mastery Assignment: Envelope Encryption Service in TypeScript", type: "assignment", desc: "Implement a client-side encryption wrapper that calls KMS GenerateDataKey and stores encrypted payloads safely." },
      { id: "cloud-m1-d26-q4", name: "Production Incident Lab: Key Policy Lockout Emergency Recovery", type: "detective", desc: "Recover an AWS KMS key accidentally orphaned by a key policy that excluded the root account and all admin roles." }
    ]
  },
  {
    day: 27,
    month: 1,
    blockNum: 6,
    title: "AWS WAF & AWS Shield: DDoS Mitigation, Rate-Based Rules & OWASP Top 10 Protections",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Perimeter Security & Threat Defense",
    spokenGoal: "Defend production cloud applications against cyber attacks: master AWS WAF (Web Application Firewall), Web ACLs, rate-based rules, OWASP Top 10 managed rule groups (SQLi, XSS), and AWS Shield Standard vs Shield Advanced DDoS mitigation.",
    conceptInvariant: "Perimeter defense must stop malicious traffic at the edge (CloudFront / ALB) before it consumes backend CPU, database connections, or Lambda invocations. Rate-based rules automatically throttle rogue IP addresses executing volumetric scraping.",
    failureMode: "Relying on application code to parse and reject SQL injection attacks, allowing sophisticated attackers to bypass naive regex filters and execute SQL extraction on backend databases.",
    tryItFriction: "Configure an AWS WAF Web ACL containing an AWS Managed Rules Common Rule Set and a custom Rate-Based Rule that blocks any IP address exceeding 500 requests per 5-minute window.",
    socraticHints: [
      "Where can you attach an AWS WAF Web ACL?",
      "To Amazon CloudFront, Application Load Balancers (ALB), Amazon API Gateway, and AWS AppSync!",
      "Attaching WAF to CloudFront inspects and drops malicious requests at the global Edge before traffic ever enters your VPC."
    ],
    situationalPuzzle: {
      scenario: "A ticket booking platform suffers a credential-stuffing attack where bots attempt 50,000 logins per second using leaked password lists. Backend servers are overwhelmed and crash. What is the most effective edge security defense to stop this without code changes?",
      options: [
        "Ask users to change their passwords.",
        "Deploy AWS WAF with Bot Control and Rate-Based Rules on the `/login` URI, accompanied by AWS Shield Advanced to absorb Layer 7 DDoS volumetric floods.",
        "Add more memory to the backend database.",
        "Block all web browsers from accessing the website."
      ],
      answerIdx: 1,
      debrief: "AWS WAF Bot Control and custom Rate-Based Rules inspecting specific URIs (like `/login`) identify and block automated credential-stuffing attacks at the edge. AWS Shield Advanced provides automatic DDoS mitigation and financial cost protection."
    },
    quests: [
      { id: "cloud-m1-d27-q1", name: "WAF Inspection Pipeline: Rule Groups, Regex & IP Rate Sets", type: "concept", desc: "Trace packet inspection across Layer 7 HTTP attributes: headers, cookies, query strings, and body payloads." },
      { id: "cloud-m1-d27-q2", name: "Detective Lab: The Credential-Stuffing Login Endpoint Breach", type: "detective", desc: "Analyze access logs of an active brute-force attack and apply a URI-specific WAF rate limit rule." },
      { id: "cloud-m1-d27-q3", name: "Mastery Assignment: OWASP Top 10 Production Web ACL Spec", type: "assignment", desc: "Construct a complete WAF Web ACL incorporating SQLi, XSS, IP reputation, and geo-blocking rules." },
      { id: "cloud-m1-d27-q4", name: "Production Incident Lab: Layer 7 HTTP Flood DDoS Defense", type: "detective", desc: "Mitigate an ongoing 100,000 req/sec volumetric flood using AWS Shield Advanced and edge WAF challenge actions." }
    ]
  },
  {
    day: 28,
    month: 1,
    blockNum: 6,
    title: "AWS FinOps: Cost Optimization, Compute Savings Plans & Cost Allocation Tags",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Financial Engineering & Cloud Unit Economics",
    spokenGoal: "Operate cost-effective cloud systems like a Staff Architect: master AWS Cost Explorer, Cost Allocation Tags, Compute Savings Plans vs Reserved Instances, rightsizing overprovisioned compute, and AWS Budgets alerts.",
    conceptInvariant: "In the cloud, architectural decisions are financial decisions. Compute Savings Plans offer up to 66% discounts in exchange for a 1- or 3-year hourly spend commitment ($/hr), applying flexibly across EC2, Fargate, and Lambda regardless of instance family or region.",
    failureMode: "Leaving hundreds of unattached EBS volumes (`available` status) and orphaned NAT Gateways running across unused developer environments, burning $10,000/month on zero compute.",
    tryItFriction: "Calculate the exact monthly financial savings of migrating a 20-node m5.4xlarge On-Demand fleet to a 3-year Compute Savings Plan combined with 30% Spot instances.",
    socraticHints: [
      "What is the difference between an EC2 Instance Savings Plan and a Compute Savings Plan?",
      "Compute Savings Plans are flexible! They apply automatically to EC2, Fargate, and Lambda across any instance family and any region.",
      "EC2 Instance Savings Plans give slightly deeper discounts (up to 72%) but lock you to a specific instance family in a specific region."
    ],
    situationalPuzzle: {
      scenario: "A startup's AWS bill triples from $15,000 to $45,000 in one month. The CFO demands an immediate breakdown of which team and service caused the spike. However, Cost Explorer shows all spending grouped under a single root account with zero team attribution. What governance control was missing?",
      options: [
        "AWS does not allow cost tracking per team.",
        "Cost Allocation Tags: Without mandatory, automated tagging (`Environment`, `Team`, `Project`, `CostCenter`) activated in AWS Billing, resources cannot be filtered or allocated to specific business units.",
        "The company should have used cash instead of credit card.",
        "The CFO must manually inspect every EC2 instance."
      ],
      answerIdx: 1,
      debrief: "Cost Allocation Tags are the foundation of Cloud FinOps. By enforcing mandatory resource tags (`Team`, `Environment`, `Service`) via AWS Organizations SCPs and activating them in the Billing console, companies gain granular visibility into unit economics."
    },
    quests: [
      { id: "cloud-m1-d28-q1", name: "Cloud Cost Modeling: On-Demand vs Savings Plans vs Spot Pricing", type: "concept", desc: "Calculate break-even utilization curves for Reserved Instances and Compute Savings Plans." },
      { id: "cloud-m1-d28-q2", name: "Detective Lab: The Ghost Resource Zombie Bill Audit", type: "detective", desc: "Identify and eliminate orphaned EBS volumes, idle elastic IPs, and unused NAT Gateways." },
      { id: "cloud-m1-d28-q3", name: "Mastery Assignment: Automated FinOps Compliance & Tagging Policy", type: "assignment", desc: "Author an AWS Organization Service Control Policy (SCP) and AWS Budget alerting script." },
      { id: "cloud-m1-d28-q4", name: "Production Incident Lab: Unplanned $50,000 Cloud Bill Spike Triage", type: "detective", desc: "Trace an overnight cost explosion to an infinite recursive Lambda loop calling S3 and issue immediate cost remediation." }
    ]
  },
  {
    day: 29,
    month: 1,
    blockNum: 6,
    title: "Cloud Disaster Recovery (DR) Strategies: Backup/Restore, Pilot Light, Warm Standby & Multi-Site Active",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Enterprise Resiliency (RPO/RTO & Business Continuity)",
    spokenGoal: "Architect for catastrophic regional disasters: master the 4 AWS Disaster Recovery strategies (Backup & Restore, Pilot Light, Warm Standby, Multi-Site Active-Active), Recovery Point Objective (RPO), and Recovery Time Objective (RTO).",
    conceptInvariant: "RPO (Recovery Point Objective) measures allowable data loss in time (how much data you lose). RTO (Recovery Time Objective) measures allowable downtime (how long it takes to recover). Lower RPO/RTO dramatically increases architecture complexity and infrastructure cost.",
    failureMode: "Promising stakeholders an RTO of 0 seconds and RPO of 0 seconds on a 'Backup & Restore' disaster recovery budget, discovering during a regional outage that restoring 10TB from backups takes 18 hours.",
    tryItFriction: "Map the cost vs complexity trade-offs of the 4 DR tiers: Backup & Restore ($) -> Pilot Light ($$) -> Warm Standby ($$$) -> Multi-Site Active-Active ($$$$).",
    socraticHints: [
      "What is the difference between 'Pilot Light' and 'Warm Standby' in AWS Disaster Recovery?",
      "In Pilot Light, core data is replicated live, but compute instances are completely OFF until disaster strikes!",
      "In Warm Standby, a scaled-down version of your full stack runs live 24/7 in the secondary region, ready to scale up immediately."
    ],
    situationalPuzzle: {
      scenario: "A hospital patient management system requires an RTO of less than 5 minutes and an RPO of less than 1 minute. The budget is moderate. Which disaster recovery strategy meets these strict thresholds without paying for a full-scale redundant active-active deployment?",
      options: [
        "Backup and Restore from S3 once a week.",
        "Warm Standby: Keep core databases continuously replicated in a secondary region with a minimal, scaled-down fleet of compute instances running live 24/7 that auto-scales to full capacity within minutes of failover.",
        "Single-AZ deployment with local backups.",
        "Multi-Site Active-Active with 100% capacity in 5 regions simultaneously."
      ],
      answerIdx: 1,
      debrief: "Warm Standby maintains a scaled-down but live functional environment in the secondary region with continuous data replication. In a disaster, the standby immediately handles baseline traffic while auto-scaling to full capacity, meeting sub-5-minute RTO."
    },
    quests: [
      { id: "cloud-m1-d29-q1", name: "Disaster Recovery Framework: RPO vs RTO Mathematical Invariants", type: "concept", desc: "Calculate replication lag, data recovery windows, and cost curves across the 4 DR tiers." },
      { id: "cloud-m1-d29-q2", name: "Detective Lab: The Unmet RTO Disaster Recovery Failure", type: "detective", desc: "Audit an enterprise DR plan claiming 15-minute RTO and uncover manual database restoration bottlenecks." },
      { id: "cloud-m1-d29-q3", name: "Mastery Assignment: Cross-Region Automated Warm Standby Blueprint", type: "assignment", desc: "Design a Terraform specification for cross-region Aurora replication and standby ECS capacity providers." },
      { id: "cloud-m1-d29-q4", name: "Production Incident Lab: Regional Datacenter Blackout Drill", type: "detective", desc: "Execute a live failover simulation from us-east-1 to us-west-2 and measure real RTO/RPO metrics." }
    ]
  },
  {
    day: 30,
    month: 1,
    blockNum: 6,
    title: "🏆 MONTH 1 CAPSTONE: `CloudFortress` Multi-Tier Resilient Enterprise Banking Architecture & Live Defense",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 1 Master Capstone Viva & Production Defense",
    spokenGoal: "Defend your complete foundational cloud engineering mastery: construct and defend `CloudFortress`—a highly available, multi-tier, PCI-DSS compliant banking architecture across 3 Availability Zones featuring hardened VPC subnets, ALB, Auto-Scaling ECS Fargate, Aurora Multi-AZ, and automated CloudWatch alarms.",
    conceptInvariant: "A production-grade cloud architecture has no single points of failure, enforces least privilege at every network and IAM layer, encrypts data at rest and in transit, and isolates blast radiuses through layered tiering.",
    failureMode: "Building an architecture that passes functional tests but collapses under security audit scrutiny due to exposed database subnets or unencrypted S3 buckets.",
    tryItFriction: "Present the complete architecture diagram, defense of CIDR allocations, IAM role trust policies, and recovery plan before a simulated Staff Enterprise Architect panel.",
    socraticHints: [
      "How do you prove your architecture is completely resilient against an entire AWS Availability Zone outage?",
      "Every single layer (ALB, Fargate, Aurora, NAT Gateway) is deployed redundantly across at least 2, and ideally 3, distinct AZs!",
      "If AZ-1 loses physical power, traffic immediately flows through AZ-2 and AZ-3 with zero manual intervention."
    ],
    situationalPuzzle: {
      scenario: "During the final Capstone Viva architectural defense, the examination panel injects a failure: 'The primary NAT Gateway in AZ-a has died. How does private subnet traffic in AZ-b reach the internet, and what is your blast radius?' What is the correct senior response?",
      options: [
        "Traffic from AZ-b stops working until AWS repairs AZ-a.",
        "Independent Multi-AZ NAT Gateways: Each public AZ has its own dedicated NAT Gateway, and private subnets in AZ-b route strictly to the NAT Gateway in AZ-b; the failure of NAT-a has ZERO impact on AZ-b.",
        "NAT Gateways do not fail because they are software.",
        "All traffic is redirected to an Internet Gateway."
      ],
      answerIdx: 1,
      debrief: "A true multi-AZ architecture deploys a dedicated NAT Gateway in every public subnet. Private subnets in each AZ route to their local NAT Gateway, isolating failure domains so a NAT outage in one AZ never affects another."
    },
    quests: [
      { id: "cloud-m1-d30-q1", name: "Capstone Blueprint: CloudFortress Enterprise Banking Architecture", type: "concept", desc: "Deliver full architectural documentation: network CIDRs, security groups, compute tiers, and data stores." },
      { id: "cloud-m1-d30-q2", name: "Detective Lab: The Pre-Audit Security Vulnerability Scrub", type: "detective", desc: "Identify and resolve 5 critical security misconfigurations before submitting the banking architecture." },
      { id: "cloud-m1-d30-q3", name: "Mastery Assignment: Automated CloudFortress Terraform Provisioning Suite", type: "assignment", desc: "Write production Terraform code deploying the complete 3-AZ Multi-Tier resilient banking environment." },
      { id: "cloud-m1-d30-q4", name: "Capstone Viva: Staff Architect Defense & Failure Injection Board", type: "detective", desc: "Defend your architectural trade-offs, security controls, and disaster recovery SLA live before the evaluation panel." }
    ]
  }
];

export const CLOUD_MONTH_2_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 7: Advanced Kubernetes (EKS) & Service Meshes (Days 31–35) ─────────────
  {
    day: 31,
    month: 2,
    blockNum: 7,
    title: "Kubernetes on AWS (EKS): Control Plane Architecture, VPC CNI & Custom Pod IP Subnetting",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Advanced Container Orchestration (Kubernetes Networking)",
    spokenGoal: "Master enterprise Kubernetes on AWS: understand the Amazon EKS managed control plane, etcd high availability, the AWS VPC CNI plugin, and how secondary ENIs assign real VPC IP addresses directly to Kubernetes Pods.",
    conceptInvariant: "The AWS VPC CNI gives every Pod a first-class routable IP from your VPC subnets. Without custom networking or secondary CIDRs, high-density Kubernetes clusters quickly exhaust all available IPv4 addresses in private subnets.",
    failureMode: "Deploying an EKS cluster with 50 nodes and 2,000 pods into a `/22` subnet (1,024 IPs), causing Pod scheduling to freeze completely due to total IP address exhaustion on worker node ENIs.",
    tryItFriction: "Configure AWS VPC CNI Custom Networking with a secondary `100.64.0.0/16` CGNAT CIDR block to provide 65,000 dedicated Pod IPs without consuming company corporate VPC address space.",
    socraticHints: [
      "Why does EKS consume far more VPC IP addresses than traditional Kubernetes with overlay networks (like Flannel)?",
      "Because the AWS VPC CNI assigns native VPC IPs directly to Pods via Elastic Network Interfaces (ENIs)!",
      "Use VPC CNI Custom Networking with secondary CIDR blocks to isolate Pod IPs from host node IPs."
    ],
    situationalPuzzle: {
      scenario: "An EKS worker node (`m5.large`) can attach up to 3 ENIs, with each ENI supporting up to 10 IP addresses. A deployment attempts to schedule 40 Pods onto this single node. Pod 31 gets stuck in `ContainerCreating` status indefinitely with the error: `FailedCreatePodSandBox: no IP addresses available`. Why?",
      options: [
        "Kubernetes clusters can only run 30 Pods total across all nodes.",
        "ENI IP Allocation Limit: An m5.large instance has a physical hardware limit of 3 ENIs * 10 IPs = 30 IPs (minus host IPs); it cannot physically bind 40 Pods without ENI prefix delegation enabled.",
        "The Pod container image is corrupted.",
        "The kubelet process ran out of memory."
      ],
      answerIdx: 1,
      debrief: "Each EC2 instance type has strict hardware limits on the number of ENIs and secondary IPs it can attach. On EKS, this limits Pod density per node. Enabling VPC CNI Prefix Delegation assigns `/28` IP prefixes (16 IPs per slot), dramatically expanding Pod density per node."
    },
    quests: [
      { id: "cloud-m2-d31-q1", name: "EKS Control Plane Architecture & VPC CNI IPAM Mechanics", type: "concept", desc: "Trace kube-apiserver managed endpoints, etcd quorum across 3 AZs, and ENI secondary IP attachment." },
      { id: "cloud-m2-d31-q2", name: "Detective Lab: The Worker Node Pod Allocation Freeze", type: "detective", desc: "Debug an EKS cluster running out of ENI IP slots and enable VPC CNI Prefix Delegation." },
      { id: "cloud-m2-d31-q3", name: "Mastery Assignment: Secondary CIDR EKS Custom Networking Blueprint", type: "assignment", desc: "Configure an EKS cluster with ENIConfig CRDs binding Pods to dedicated secondary non-routable subnets." },
      { id: "cloud-m2-d31-q4", name: "Production Incident Lab: Kube-Proxy DaemonSet Crash Cascade", type: "detective", desc: "Triage a cluster-wide service discovery outage caused by iptables rule exhaustion inside kube-proxy." }
    ]
  },
  {
    day: 32,
    month: 2,
    blockNum: 7,
    title: "EKS Compute Engine: Managed Node Groups vs Karpenter Dynamic Node Auto-Provisioning",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Modern Kubernetes Auto-Scaling (Dynamic Compute Orchestration)",
    spokenGoal: "Replace sluggish Cluster Autoscaler with next-generation compute: master Karpenter, the high-velocity, open-source node auto-provisioner that launches right-sized EC2 instances directly via AWS fleet APIs in under 45 seconds.",
    conceptInvariant: "Legacy Cluster Autoscaler scales by increasing Auto Scaling Group counts (slow, 3–6 minutes, rigid instance types). Karpenter bypasses ASGs entirely: it evaluates unscheduled Pod resource requests and launches the exact optimal EC2 instance type within 40 seconds.",
    failureMode: "Using a rigid Managed Node Group with `c5.xlarge` instances for memory-intensive machine learning pods, leaving 80% of CPU idle while nodes run out of RAM, wasting tens of thousands of dollars.",
    tryItFriction: "Write a Karpenter `NodePool` CRD that provisions Spot instances across `c5`, `m5`, and `r5` families, with automated disruption controls (`consolidation: WhenEmptyOrUnderutilized`).",
    socraticHints: [
      "Why is Karpenter faster and cheaper than the Kubernetes Cluster Autoscaler?",
      "Karpenter does not use Auto Scaling Groups! It talks directly to the EC2 Fleet API to launch the exact instance needed.",
      "Karpenter actively consolidates workloads: it terminates underutilized nodes and repacks Pods onto cheaper instances automatically."
    ],
    situationalPuzzle: {
      scenario: "During a traffic lull at 2 AM, an EKS cluster has 10 nodes running at 15% CPU and memory utilization. Karpenter is deployed. However, Karpenter refuses to terminate any nodes or consolidate pods. Inspection shows several pods have no disruption budgets configured, and one pod has a `local-storage` emptyDir without safe eviction annotations. What is preventing node consolidation?",
      options: [
        "Karpenter only runs during business hours.",
        "Pod Disruption Constraints: Karpenter respects Kubernetes eviction rules; pods with local non-replicated storage or violating PDBs block automated node draining unless explicitly configured with consolidation annotations.",
        "Karpenter requires root AWS account keys.",
        "EC2 does not allow terminating instances at night."
      ],
      answerIdx: 1,
      debrief: "Karpenter adheres to Kubernetes eviction safety invariants. If a pod utilizes unevictable local storage without appropriate annotations, or if a PodDisruptionBudget (PDB) prohibits evictions, Karpenter halts consolidation to prevent data loss or availability drops."
    },
    quests: [
      { id: "cloud-m2-d32-q1", name: "Karpenter vs Cluster Autoscaler Architecture & Fleet Mechanics", type: "concept", desc: "Contrast ASG group-based scaling against direct EC2 Fleet API scheduling and bin-packing algorithms." },
      { id: "cloud-m2-d32-q2", name: "Detective Lab: The Underutilized Cluster Money Burn", type: "detective", desc: "Audit an EKS cluster with 70% wasted compute and deploy Karpenter consolidation policies." },
      { id: "cloud-m2-d32-q3", name: "Mastery Assignment: Karpenter Multi-Architecture Spot NodePool CRD", type: "assignment", desc: "Author a Karpenter NodePool configuration leveraging ARM64 Graviton instances and Spot interruption fallbacks." },
      { id: "cloud-m2-d32-q4", name: "Production Incident Lab: Rapid Scale-Up Spot Stockout Emergency", type: "detective", desc: "Resolve a Karpenter launch failure when regional Spot capacity for a specific instance family runs dry." }
    ]
  },
  {
    day: 33,
    month: 2,
    blockNum: 7,
    title: "Kubernetes Ingress Networking: AWS Load Balancer Controller & TargetGroupBinding CRDs",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Cloud-Native Edge Routing (Ingress & Load Balancer Integration)",
    spokenGoal: "Route external internet traffic directly to Kubernetes pods: master the AWS Load Balancer Controller, Ingress resources, Network Load Balancer (NLB) IP mode, and TargetGroupBinding Custom Resources.",
    conceptInvariant: "In `ip` target mode, the AWS ALB routes traffic directly to individual Pod IP addresses, completely bypassing NodePort and kube-proxy double-hopping for minimal latency and true client IP preservation.",
    failureMode: "Using legacy `instance` target mode with NodePort services, routing traffic to a random EC2 node which then hops across the internal network to a second node where the pod actually lives, doubling latency.",
    tryItFriction: "Deploy the AWS Load Balancer Controller via Helm, annotate an Ingress resource with `alb.ingress.kubernetes.io/target-type: ip`, and verify target group registration directly with Pod IPs.",
    socraticHints: [
      "What is the performance advantage of `target-type: ip` over `target-type: instance` on AWS EKS?",
      "`target-type: ip` points the ALB directly at the Pod's VPC IP address!",
      "It eliminates NodePort routing, skips kube-proxy NAT overhead, and prevents unnecessary cross-node network hops."
    ],
    situationalPuzzle: {
      scenario: "An Ingress resource is created with the AWS Load Balancer Controller. The ALB is provisioned, but all target groups show targets in an 'unhealthy' state with HTTP 504 errors. The Pods themselves respond 200 OK when curled from inside the cluster. What security group rule is missing?",
      options: [
        "The ALB must be given an IAM administrator role.",
        "Missing Pod Ingress Security Group Allowance: The worker node / pod security group does not allow inbound traffic from the ALB's security group on the container port, causing health checks to drop.",
        "Kubernetes cannot run on HTTP.",
        "The ingress hostname must be registered with ICANN."
      ],
      answerIdx: 1,
      debrief: "When using `target-type: ip`, the ALB communicates directly with the Pod's ENI IP on the container target port. The security group attached to the worker nodes or Pods must explicitly allow ingress traffic from the security group attached to the ALB."
    },
    quests: [
      { id: "cloud-m2-d33-q1", name: "AWS Load Balancer Controller Architecture: CRDs & Ingress Flow", type: "concept", desc: "Trace how Kubernetes Ingress definitions trigger ALB creation and automated target group synchronization." },
      { id: "cloud-m2-d33-q2", name: "Detective Lab: The NodePort Double-Hop Latency Spike", type: "detective", desc: "Profile an ingress bottleneck and convert a legacy NodePort service to direct ALB IP target mode." },
      { id: "cloud-m2-d33-q3", name: "Mastery Assignment: Production Multi-Service ALB Ingress Specification", type: "assignment", desc: "Write a complete Ingress manifest configuring SSL redirection, path routing, and ACM certificates." },
      { id: "cloud-m2-d33-q4", name: "Production Incident Lab: Subnet Discovery Tagging Failure", type: "detective", desc: "Fix an ALB Controller provisioning crash caused by missing `kubernetes.io/role/elb` tags on public VPC subnets." }
    ]
  },
  {
    day: 34,
    month: 2,
    blockNum: 7,
    title: "Service Mesh on AWS: Istio / AWS App Mesh, Envoy Sidecar Proxies & Mutual TLS (mTLS) Zero Trust",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Zero-Trust Service Meshes (Microservice Traffic Governance)",
    spokenGoal: "Enforce strict Zero-Trust security between microservices: master Service Meshes (Istio and Envoy proxies), transparent sidecar injection, strict Mutual TLS (mTLS) cryptographic identity, and traffic shifting (canary deployments).",
    conceptInvariant: "In a Zero-Trust service mesh, no internal network traffic is trusted by default. Every pod-to-pod HTTP request is intercepted by local Envoy sidecar proxies, upgraded to mutual TLS (mTLS) using SPIFFE X.509 certificates, and cryptographically verified.",
    failureMode: "Assuming VPC private subnets are inherently secure, allowing an attacker who compromises one low-tier pod to sniff unencrypted plaintext database credentials sent across the internal network.",
    tryItFriction: "Configure Istio `PeerAuthentication` in `STRICT` mode and verify with `tcpdump` that unauthenticated plaintext traffic between two Kubernetes pods is completely dropped with connection reset.",
    socraticHints: [
      "Why is Mutual TLS (mTLS) critical even inside a private VPC subnet?",
      "Defense-in-depth! If an attacker compromises a single container, mTLS prevents them from packet-sniffing internal communication.",
      "Envoy sidecars automatically encrypt all traffic in transit and authenticate caller identity via SPIFFE IDs."
    ],
    situationalPuzzle: {
      scenario: "A banking microservice deploys a canary release for a new payment service. The team wants 95% of traffic to route to `v1` and 5% to route to `v2`. Without modifying application code, which Service Mesh resource enables this fine-grained weight-based traffic split?",
      options: [
        "A Kubernetes ReplicaSet with 95 pods and 5 pods.",
        "An Istio `VirtualService` with weighted destination routing: configuring `v1: weight 95` and `v2: weight 5` allows Envoy proxies to split traffic dynamically at Layer 7.",
        "A Route 53 private hosted zone.",
        "An EC2 Auto Scaling policy."
      ],
      answerIdx: 1,
      debrief: "Service meshes decouple traffic routing from deployment scaling. An Istio VirtualService allows dynamic Layer 7 traffic shifting (e.g. 95% to v1, 5% to v2) between versions of the same service using local Envoy proxies, without needing 100 replicas."
    },
    quests: [
      { id: "cloud-m2-d34-q1", name: "Envoy Proxy Architecture: Sidecar Interception & SPIFFE Identity", type: "concept", desc: "Trace Linux iptables PREROUTING packet capture into Envoy listeners and mutual TLS handshakes." },
      { id: "cloud-m2-d34-q2", name: "Detective Lab: The Plaintext Internal Microservice Sniff", type: "detective", desc: "Audit internal pod communications, identify unencrypted traffic, and enforce STRICT mTLS." },
      { id: "cloud-m2-d34-q3", name: "Mastery Assignment: Canary Deployment Traffic Shifter Manifest", type: "assignment", desc: "Construct Istio VirtualService and DestinationRule manifests implementing a 90/10 canary traffic split with circuit breaking." },
      { id: "cloud-m2-d34-q4", name: "Production Incident Lab: Envoy Sidecar Memory Leak Profiling", type: "detective", desc: "Diagnose an Envoy proxy OOM crash caused by runaway access logging under 50,000 req/sec load." }
    ]
  },
  {
    day: 35,
    month: 2,
    blockNum: 7,
    title: "⭐ MILESTONE 6: Enterprise EKS Kubernetes Cluster with Karpenter, ALB Ingress & mTLS Zero Trust",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (Production Kubernetes Platform)",
    spokenGoal: "Architect and prove an enterprise Kubernetes platform: deploy a complete Amazon EKS cluster configured with AWS VPC CNI, Karpenter dynamic Spot auto-provisioning, AWS Load Balancer Controller with IP-mode ingress, and Istio mTLS zero trust.",
    conceptInvariant: "An enterprise Kubernetes platform must be resilient to node failures, dynamically scale compute based on pending pod pressure, route traffic directly without NodePort bottlenecks, and enforce cryptographic zero trust on every hop.",
    failureMode: "Deploying an EKS cluster with Karpenter and ALB without configuring PodDisruptionBudgets (PDBs), causing Karpenter node consolidation to evict all replicas of a critical service simultaneously during peak hours.",
    tryItFriction: "Execute a live load test scaling an EKS deployment from 2 to 100 Pods, observing Karpenter provision optimized Spot compute in under 45 seconds while ALB targets register seamlessly.",
    socraticHints: [
      "What Kubernetes resource prevents Karpenter from terminating all replicas of your service during node consolidation?",
      "A PodDisruptionBudget (`PDB`)!",
      "Setting `minAvailable: 1` or `maxUnavailable: 25%` forces Karpenter to respect application availability invariants."
    ],
    situationalPuzzle: {
      scenario: "During an audit of the new EKS cluster, an engineer points out that worker nodes run in private subnets with IAM roles allowing Karpenter to create EC2 instances. However, an unauthorized Pod executes an AWS SDK call and accesses S3 buckets using the node's IAM role. What security control was missing?",
      options: [
        "Kubernetes pods cannot talk to AWS services.",
        "IAM Roles for Service Accounts (IRSA) / EKS Pod Identities: Pods must assume dedicated, least-privilege IAM roles via OIDC tokens, and IMDSv2 hop limits must be set to 1 to prevent pods from inheriting the host node's EC2 role.",
        "The S3 bucket must be made public.",
        "The EKS cluster must be deleted and recreated."
      ],
      answerIdx: 1,
      debrief: "Pods on worker nodes inherit the node's underlying EC2 instance profile unless isolated. Implementing EKS Pod Identities or IRSA with an IMDSv2 hop limit of 1 prevents containerized workloads from stealing the host's IAM credentials."
    },
    quests: [
      { id: "cloud-m2-d35-q1", name: "Milestone Architecture: Enterprise EKS Platform Blueprint", type: "concept", desc: "Design the complete platform specification: control plane, VPC CNI, Karpenter, ALB Ingress, and Istio." },
      { id: "cloud-m2-d35-q2", name: "Detective Lab: The Node Role Credential Theft Vulnerability", type: "detective", desc: "Isolate a security flaw where pods read node IMDS credentials and enforce EKS Pod Identity isolation." },
      { id: "cloud-m2-d35-q3", name: "Mastery Assignment: End-to-End GitOps EKS Platform Manifest Suite", type: "assignment", desc: "Author production Kubernetes manifests configuring Karpenter NodePools, Ingress, and PDB constraints." },
      { id: "cloud-m2-d35-q4", name: "Production Incident Lab: Cluster Autoscaling Storm & Target Registration Lag", type: "detective", desc: "Triage an incident where 200 pods scaled out rapidly but ALB health check registration lagged, causing 502 Bad Gateway errors." }
    ]
  },

  // ─── BLOCK 8: High-Performance Serverless & Real-Time Streaming (Days 36–40) ──────
  {
    day: 36,
    month: 2,
    blockNum: 8,
    title: "Serverless Runtime Internals: Firecracker MicroVM Jailer, SnapStart & Provisioned Concurrency",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Low-Level Cloud Virtualization (MicroVM Mechanics & Optimization)",
    spokenGoal: "Deconstruct serverless execution engines: dive deep into Firecracker MicroVMs (KVM-based lightweight isolation), the Firecracker Jailer process, cgroups/chroot sandboxing, and AWS Lambda SnapStart micro-snapshotting.",
    conceptInvariant: "Lambda SnapStart initializes your runtime, pauses execution, and takes an encrypted memory snapshot. Subsequent warm invocations resume from the snapshot in under 200ms instead of executing a multi-second initialization phase from scratch.",
    failureMode: "Using Lambda SnapStart while caching a unique cryptographic seed, pseudo-random number generator (PRNG) state, or database connection in memory during snapshot creation, causing every resumed instance to share the exact same random numbers.",
    tryItFriction: "Analyze a Firecracker startup sequence: compare a cold boot (cgroups, Linux kernel init, runtime boot) against SnapStart snapshot restoration, verifying PRNG uniqueness hooks.",
    socraticHints: [
      "Why is caching pseudo-random number seeds (PRNG) in memory dangerous when using Lambda SnapStart?",
      "Because SnapStart snapshots memory! Every resumed execution will have the exact same random state, destroying cryptographic security.",
      "Use SnapStart runtime hooks (`CRaC` / `Resource.afterRestore`) to refresh random seeds and socket connections upon resume."
    ],
    situationalPuzzle: {
      scenario: "A high-frequency trading API runs on AWS Lambda. The team enables Provisioned Concurrency (100 instances). During a flash market move, traffic spikes to 500 concurrent requests. The first 100 requests complete in 5ms, but requests 101 to 500 take 850ms. What happened, and how do you achieve uniform latency?",
      options: [
        "AWS throttled the account because trading is prohibited.",
        "Provisioned Concurrency Spillover: Requests exceeding the 100 provisioned instances spill over into standard on-demand concurrency, triggering cold starts; the team must configure Application Auto Scaling to scale provisioned concurrency proactively based on schedule or metrics.",
        "The trading algorithm had a memory leak.",
        "The network cables at AWS melted."
      ],
      answerIdx: 1,
      debrief: "Provisioned Concurrency maintains pre-initialized MicroVMs for a fixed count. When incoming requests exceed that threshold, excess traffic spills over to on-demand Lambda execution, incurring standard cold start latency. Auto-scaling provisioned concurrency prevents this."
    },
    quests: [
      { id: "cloud-m2-d36-q1", name: "Firecracker MicroVM Internals: KVM, Jailer & Memory Virtualization", type: "concept", desc: "Trace minimal device model creation (virtio-net, virtio-block) and sub-second kernel boot mechanics." },
      { id: "cloud-m2-d36-q2", name: "Detective Lab: The SnapStart Duplicate Random Seed Vulnerability", type: "detective", desc: "Audit a Java/Node Lambda function resuming from SnapStart with shared session tokens and implement restore hooks." },
      { id: "cloud-m2-d36-q3", name: "Mastery Assignment: High-Concurrency Auto-Scaling Provisioned Lambda Spec", type: "assignment", desc: "Build an Application Auto Scaling policy for Lambda provisioned concurrency targeting 70% utilization." },
      { id: "cloud-m2-d36-q4", name: "Production Incident Lab: Firecracker Ephemeral Disk Space Exhaustion", type: "detective", desc: "Diagnose a `/tmp` disk exhaustion crash during high-throughput file compression inside a Lambda worker." }
    ]
  },
  {
    day: 37,
    month: 2,
    blockNum: 8,
    title: "Amazon Kinesis Data Streams: Shard Splitting, Hot Shard Partitioning & Enhanced Fan-Out (EFO)",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "High-Throughput Streaming Systems (Log-Structured Real-Time Ingest)",
    spokenGoal: "Stream millions of events per second with sub-second latency: master Amazon Kinesis Data Streams, shard capacity math (1MB/s write, 2MB/s read per shard), shard splitting/merging, hash key distribution, and Enhanced Fan-Out (EFO) HTTP/2 push.",
    conceptInvariant: "A Kinesis shard provides dedicated throughput: 1 MB/sec (or 1,000 records/sec) write, and 2 MB/sec read. Exceeding either limit throws `ProvisionedThroughputExceededException`. Throughput scales linearly by adding shards.",
    failureMode: "Using a low-cardinality partition key (e.g. `deviceType = 'iOS' | 'Android'`), routing 80% of writes to a single shard, triggering massive throttling while other shards sit 90% idle.",
    tryItFriction: "Calculate the exact number of shards required to ingest 50,000 events/sec (averaging 1.5KB per payload), and design a high-cardinality MD5 hashing strategy to prevent hot shards.",
    socraticHints: [
      "How do multiple independent consumer applications read from the same Kinesis stream without throttling each other?",
      "Use Enhanced Fan-Out (EFO)!",
      "EFO gives each registered consumer its own dedicated 2MB/sec read pipe per shard using HTTP/2 server push."
    ],
    situationalPuzzle: {
      scenario: "A fleet of IoT vehicles streams GPS telemetry to a Kinesis stream with 20 shards. The fleet uses `fleetId` (3 distinct values: A, B, C) as the partition key. Writes begin failing with throughput exceeded errors even though total traffic is only 3MB/sec across the entire 20MB/sec stream. What is the fix?",
      options: [
        "Increase the stream to 100 shards without changing code.",
        "High-Cardinality Key Redesign: Using `fleetId` only hashes to 3 shards; changing the partition key to a high-cardinality composite key like `${fleetId}-${vehicleId}-${timestamp}` distributes writes evenly across all 20 shards.",
        "Switch the protocol to HTTP 1.0.",
        "Disable encryption on Kinesis."
      ],
      answerIdx: 1,
      debrief: "Kinesis uses MD5 hashes of partition keys to assign records to shards. With only 3 unique partition keys, at most 3 shards receive data regardless of how many shards exist. High-cardinality partition keys are required for uniform distribution."
    },
    quests: [
      { id: "cloud-m2-d37-q1", name: "Kinesis Stream Topologies: Shard Math & Enhanced Fan-Out Mechanics", type: "concept", desc: "Calculate write/read throughput limits, KCL iterator models, and HTTP/2 EFO push pipes." },
      { id: "cloud-m2-d37-q2", name: "Detective Lab: The Hot Shard Write Throttling Bottleneck", type: "detective", desc: "Identify an uneven shard distribution in CloudWatch and re-shard data using composite partition hashing." },
      { id: "cloud-m2-d37-q3", name: "Mastery Assignment: Dynamic Shard Auto-Scaler Lambda Service", type: "assignment", desc: "Build an automated monitor that detects high shard utilization and triggers Kinesis shard split operations." },
      { id: "cloud-m2-d37-q4", name: "Production Incident Lab: Consumer Lag Explosion Post-Mortem", type: "detective", desc: "Triage a critical telemetry lag where consumers fell 4 hours behind incoming records during a stream surge." }
    ]
  },
  {
    day: 38,
    month: 2,
    blockNum: 8,
    title: "Amazon MSK (Managed Streaming for Apache Kafka): Broker Topologies, In-Sync Replicas (ISR) & SASL/SCRAM",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Enterprise Distributed Event Streaming (Apache Kafka on AWS)",
    spokenGoal: "Operate enterprise Apache Kafka clusters on AWS: master Amazon MSK, multi-AZ broker topologies, topic partition replication factor, In-Sync Replicas (`min.insync.replicas`), consumer group rebalancing, and SASL/SCRAM authentication via AWS Secrets Manager.",
    conceptInvariant: "To guarantee zero data loss in Kafka (`acks=all`), the producer must wait for acknowledgment from all In-Sync Replicas (`min.insync.replicas=2` on a replication factor of 3). If broker count drops below the threshold, writes fail to prevent split-brain data corruption.",
    failureMode: "Configuring a Kafka producer with `acks=1` on financial ledger events. When the leader broker crashes before replicating data to followers, the transaction is permanently lost despite the producer receiving success.",
    tryItFriction: "Configure an Amazon MSK cluster client with IAM authentication and verify end-to-end TLS encryption with SASL/SCRAM credentials retrieved dynamically from AWS Secrets Manager.",
    socraticHints: [
      "What is the difference between `acks=1` and `acks=all` in Apache Kafka / Amazon MSK?",
      "`acks=1` only waits for the single partition leader to write to its local log (data can be lost if the leader crashes before replicating)!",
      "`acks=all` waits for the leader AND all in-sync replicas to commit the message, guaranteeing zero data loss."
    ],
    situationalPuzzle: {
      scenario: "An enterprise Kafka consumer group with 10 consumer pods processes an MSK topic with 6 partitions. Four of the consumer pods remain completely idle with 0% CPU utilization. The junior engineer files a bug report stating the consumer group rebalance failed. Is this a bug or an invariant?",
      options: [
        "It is a bug; all 10 consumers should receive equal shares of every partition.",
        "Kafka Partition-Consumer Invariant: A Kafka topic partition can be consumed by at most ONE consumer instance within a consumer group at any given time; with 6 partitions, at most 6 consumers can work simultaneously.",
        "Amazon MSK does not support more than 5 consumers.",
        "The cluster must be converted to an SQS queue."
      ],
      answerIdx: 1,
      debrief: "In Apache Kafka, a partition is the fundamental unit of consumer parallelism. Within a consumer group, each partition is assigned to exactly one consumer. If you have 10 consumers and 6 partitions, 4 consumers will always remain idle."
    },
    quests: [
      { id: "cloud-m2-d38-q1", name: "Amazon MSK Architecture: Brokers, Zookeeper/KRaft & Partition Topology", type: "concept", desc: "Trace multi-AZ broker deployment, storage auto-expansion, and replication factor mechanics." },
      { id: "cloud-m2-d38-q2", name: "Detective Lab: The Phantom Consumer Rebalance Storm", type: "detective", desc: "Diagnose a consumer group crash loop caused by slow message processing exceeding `max.poll.interval.ms`." },
      { id: "cloud-m2-d38-q3", name: "Mastery Assignment: Zero-Loss MSK Producer & Consumer Suite in Node.js", type: "assignment", desc: "Construct an MSK client with IAM authentication, `acks=all`, idempotent producer flags, and manual commit offsets." },
      { id: "cloud-m2-d38-q4", name: "Production Incident Lab: Broker Disk Saturation Emergency Cleanup", type: "detective", desc: "Resolve a critical broker disk saturation incident by tuning retention bytes and expanding EBS storage volumes." }
    ]
  },
  {
    day: 39,
    month: 2,
    blockNum: 8,
    title: "AWS AppSync & Managed Real-Time GraphQL: WebSocket Subscriptions & DynamoDB Pipeline Resolvers",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Real-Time Serverless GraphQL (Managed WebSockets & Resolvers)",
    spokenGoal: "Build real-time collaborative applications at scale: master AWS AppSync, managed GraphQL schemas, real-time WebSocket subscriptions, Direct Lambda Resolvers, and JavaScript/VTL pipeline resolvers communicating directly with DynamoDB.",
    conceptInvariant: "AppSync manages millions of persistent WebSocket connections automatically. When a GraphQL mutation executes, AppSync broadcasts the updated payload to all subscribed clients without maintaining dedicated WebSocket servers.",
    failureMode: "Routing simple DynamoDB read/write operations through a Lambda resolver inside AppSync, paying Lambda execution latency and cost when AppSync can query DynamoDB directly via native JavaScript resolvers.",
    tryItFriction: "Write an AppSync JavaScript pipeline resolver that reads from DynamoDB, checks authorization attributes, and writes an audit log in a single transaction without invoking Lambda.",
    socraticHints: [
      "Why use AppSync native JavaScript resolvers rather than Lambda resolvers for database CRUD operations?",
      "Performance and cost! Native resolvers communicate directly with DynamoDB over AWS internal fabrics without invoking a Lambda container.",
      "Zero cold starts, sub-10ms response times, and lower AWS bill."
    ],
    situationalPuzzle: {
      scenario: "A real-time trading app uses AppSync GraphQL subscriptions to stream price updates. 50,000 mobile clients subscribe to `onPriceUpdate(symbol: \"AAPL\")`. When the price updates, clients receive the notification, but some clients receive updates for symbols they did not subscribe to. What was misconfigured in the subscription definition?",
      options: [
        "WebSockets do not support stock symbols.",
        "Missing Subscription Arguments Filtering: The GraphQL subscription directive was defined without filtering arguments, causing AppSync to treat it as a global broadcast rather than scoping payloads to matching mutation arguments.",
        "DynamoDB cannot store stock symbols.",
        "AppSync requires an ALB in front of it."
      ],
      answerIdx: 1,
      debrief: "AWS AppSync subscriptions filter events based on arguments passed by the client matching the mutation response. If the subscription directive does not declare matching arguments, AppSync broadcasts every mutation event to all active subscribers."
    },
    quests: [
      { id: "cloud-m2-d39-q1", name: "AppSync GraphQL Architecture: Schema, WebSockets & Resolvers", type: "concept", desc: "Analyze the subscription lifecycle: connection establishment, MQTT-over-WebSocket framing, and mutation triggers." },
      { id: "cloud-m2-d39-q2", name: "Detective Lab: The Unnecessary Lambda Proxy Resolver Lag", type: "detective", desc: "Refactor a bloated Lambda GraphQL resolver into high-speed native AppSync JavaScript DynamoDB resolvers." },
      { id: "cloud-m2-d39-q3", name: "Mastery Assignment: Real-Time Collaborative Document Engine Schema", type: "assignment", desc: "Design a complete GraphQL schema with granular field-level `@auth` rules and real-time subscription channels." },
      { id: "cloud-m2-d39-q4", name: "Production Incident Lab: Subscription Throttling & Connection Dropping", type: "detective", desc: "Triage a connection drop storm during high-frequency price volatility and optimize payload batching." }
    ]
  },
  {
    day: 40,
    month: 2,
    blockNum: 8,
    title: "⭐ MILESTONE 7: Real-Time 1,000,000 Event/Sec Telemetry Ingestion Engine (Kinesis + MSK + Flink)",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (Massive-Scale Real-Time Streaming)",
    spokenGoal: "Architect and prove extreme scale data streaming: build a 1,000,000 event/sec ingestion backbone using Amazon Kinesis Data Streams with Enhanced Fan-Out, Amazon MSK for durable event log storage, and Apache Flink (Managed Service for Apache Flink) for sliding-window anomaly detection.",
    conceptInvariant: "At 1,000,000 events/sec, traditional databases cannot absorb the write volume directly. Stream buffering and distributed stream processing (Flink sliding windows) must calculate aggregates in-flight before persisting materialized rollups to disk.",
    failureMode: "Writing 1,000,000 raw events directly to DynamoDB or RDS, incurring astronomical write capacity costs and causing database connection collapse within seconds.",
    tryItFriction: "Design the end-to-end stream topology calculating 1-minute tumbling window metrics across 1,000,000 incoming telemetry records and outputting anomaly alerts in under 2 seconds.",
    socraticHints: [
      "How do you process sliding window aggregations (e.g. 5-minute rolling average) over millions of streaming events?",
      "Use Apache Flink (Managed Service for Apache Flink)!",
      "Flink maintains stateful stream processing in memory with checkpointing to S3, processing events with microsecond latency."
    ],
    situationalPuzzle: {
      scenario: "During a stress test of the 1,000,000 msg/sec streaming pipeline, the Flink stream processing application starts falling behind. Checkpointing times surge from 200ms to 45 seconds, and memory alerts fire across Flink TaskManagers. Inspection reveals the team is using an unbounded 24-hour sliding window with a high-cardinality `userId` key. What is the root bottleneck?",
      options: [
        "Flink cannot run on AWS.",
        "Unbounded State Size Explosion: Maintaining in-memory state for millions of unique users across a 24-hour window exceeds TaskManager RAM, causing massive RocksDB state thrashing and checkpointing timeouts; the team must prune state, reduce window sizes, or emit incremental aggregates.",
        "Kinesis streams only support 100 messages/sec.",
        "AWS billing throttled the network."
      ],
      answerIdx: 1,
      debrief: "Stateful stream processing stores in-flight window data in state backends (like RocksDB). High-cardinality keys spanning long time windows create massive state graphs that exhaust memory and destabilize checkpointing. Window sizing and TTL state pruning are required."
    },
    quests: [
      { id: "cloud-m2-d40-q1", name: "Milestone Architecture: 1M Msg/Sec Streaming Backbone Blueprint", type: "concept", desc: "Design the complete ingestion topology: Producer fleets -> Kinesis EFO -> Flink Aggregations -> MSK -> S3 Lake." },
      { id: "cloud-m2-d40-q2", name: "Detective Lab: The Unbounded Stream State Memory Leak", type: "detective", desc: "Profile a crashing Flink application and optimize RocksDB state retention windows." },
      { id: "cloud-m2-d40-q3", name: "Mastery Assignment: Real-Time Anomaly Detection Stream Processor Spec", type: "assignment", desc: "Write an event processing topology that filters, aggregates, and flags fraudulent transactions within a 5s window." },
      { id: "cloud-m2-d40-q4", name: "Production Incident Lab: Out-of-Order Watermark Desync Triage", type: "detective", desc: "Resolve a critical streaming anomaly where late-arriving mobile events distorted financial calculations." }
    ]
  },

  // ─── BLOCK 9: Advanced Security, Governance & Zero Trust (Days 41–45) ─────────────
  {
    day: 41,
    month: 2,
    blockNum: 9,
    title: "Multi-Account Governance: AWS Organizations, Landing Zones, AWS Control Tower & Service Control Policies (SCPs)",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Enterprise Account Architecture & Guardrails",
    spokenGoal: "Architect enterprise multi-account environments: master AWS Organizations, AWS Control Tower, Landing Zone architectures, Organizational Units (OUs), Consolidated Billing, and Service Control Policies (SCPs) that enforce immutable guardrails.",
    conceptInvariant: "Service Control Policies (SCPs) set the maximum permissions boundary for an entire AWS account. An SCP Deny unconditionally blocks an action even for the root user and full administrators of a member account.",
    failureMode: "Operating all environments (Dev, Staging, Production) inside a single AWS account, allowing a junior engineer with developer permissions to accidentally drop the production database.",
    tryItFriction: "Write a Service Control Policy (SCP) that strictly prohibits member accounts from disabling CloudTrail, leaving the AWS Organization, or launching EC2 instances outside approved regions (`us-east-1` and `eu-west-1`).",
    socraticHints: [
      "Can an account administrator inside a member account override an SCP attached by AWS Organizations?",
      "No! An SCP acts as a guardrail above all IAM policies inside the member account.",
      "Even the member account's root user cannot perform an action denied by an SCP."
    ],
    situationalPuzzle: {
      scenario: "An enterprise mandates that under no circumstances may any employee create unencrypted S3 buckets anywhere in the company. A rogue administrator in the Marketing AWS account attempts to create an unencrypted bucket using AdministratorAccess. The action is blocked with `AccessDenied`. What enforced this?",
      options: [
        "A local IAM policy in the Marketing account.",
        "An AWS Organizations Service Control Policy (SCP): An SCP attached at the Organizational Unit (OU) level enforces account-wide guardrails that override local admin permissions.",
        "Amazon GuardDuty automatically deleted the user.",
        "S3 blocked the request because marketing accounts cannot store data."
      ],
      answerIdx: 1,
      debrief: "Service Control Policies (SCPs) define the guardrails for member accounts in AWS Organizations. Even if an IAM user has `AdministratorAccess` (`*:*`), an SCP Deny rule unconditionally overrides all permissions within that account."
    },
    quests: [
      { id: "cloud-m2-d41-q1", name: "Multi-Account Hierarchy & Landing Zone Governance Blueprint", type: "concept", desc: "Design an enterprise OU structure: Core (Security, Log Archive), Workloads (Prod, Non-Prod), and Sandbox." },
      { id: "cloud-m2-d41-q2", name: "Detective Lab: The Bypassed Local Admin Guardrail", type: "detective", desc: "Audit an unmanaged standalone AWS account and integrate it safely under Control Tower guardrails." },
      { id: "cloud-m2-d41-q3", name: "Mastery Assignment: Immutable Enterprise Service Control Policy Suite", type: "assignment", desc: "Author production JSON SCPs enforcing regional restrictions, CloudTrail protection, and encryption mandates." },
      { id: "cloud-m2-d41-q4", name: "Production Incident Lab: Overly Restrictive SCP Lockout Emergency", type: "detective", desc: "Recover an entire engineering department locked out of deployment pipelines by an accidental wildcard SCP Deny." }
    ]
  },
  {
    day: 42,
    month: 2,
    blockNum: 9,
    title: "Advanced IAM & Zero Trust: Permission Boundaries, Attribute-Based Access Control (ABAC) & OIDC Identity Federation",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Scalable Identity Governance (ABAC & Short-Lived Federation)",
    spokenGoal: "Eliminate static credentials and scalable policy sprawl: master IAM Permission Boundaries, Attribute-Based Access Control (ABAC) using resource/principal tags, and OpenID Connect (OIDC) identity federation with GitHub Actions and Okta.",
    conceptInvariant: "Role-Based Access Control (RBAC) requires modifying IAM policies for every new project, leading to policy explosion. Attribute-Based Access Control (ABAC) grants access dynamically when tags match (`aws:PrincipalTag/Department == aws:ResourceTag/Department`), scaling effortlessly.",
    failureMode: "Storing long-term AWS Access Keys (`AKIA...`) in GitHub repository secrets for CI/CD deployments, allowing any compromised third-party GitHub Action to steal production credentials.",
    tryItFriction: "Configure an IAM OIDC Identity Provider for GitHub Actions with an IAM Role trust policy restricting token issuance to a specific GitHub repository branch (`repo:myorg/myrepo:ref:refs/heads/main`).",
    socraticHints: [
      "Why should you use GitHub Actions OIDC federation instead of storing AWS Access Keys in GitHub Secrets?",
      "Zero static credentials! GitHub requests a short-lived STS token dynamically for each job execution.",
      "The token expires automatically after the job completes, eliminating the risk of stolen long-term keys."
    ],
    situationalPuzzle: {
      scenario: "A software architect wants to allow developers to create IAM roles for their Lambda functions, but wants to guarantee they cannot escalate privileges by creating a role with `AdministratorAccess`. Which advanced IAM mechanism enforces this constraint?",
      options: [
        "A strong password policy.",
        "IAM Permissions Boundary: Attaching a Permissions Boundary policy ensures that any role created by developers can never grant permissions beyond the boundary, preventing privilege escalation.",
        "Disabling IAM for all developers.",
        "Writing a weekly cron job to check roles."
      ],
      answerIdx: 1,
      debrief: "An IAM Permissions Boundary defines the maximum permissions an identity can have. When delegating role creation to developers, enforcing that all created roles must include this boundary prevents developers from escalating privileges to Administrator."
    },
    quests: [
      { id: "cloud-m2-d42-q1", name: "IAM ABAC vs RBAC Scaling Models & Policy Evaluation Logic", type: "concept", desc: "Analyze `aws:PrincipalTag`, `aws:ResourceTag`, and context key condition evaluation in IAM." },
      { id: "cloud-m2-d42-q2", name: "Detective Lab: The CI/CD Stolen Long-Term Credential Breach", type: "detective", desc: "Remove hardcoded GitHub Action AWS secret keys and migrate deployment pipelines to secure OIDC federation." },
      { id: "cloud-m2-d42-q3", name: "Mastery Assignment: Delegation with Permissions Boundaries Spec", type: "assignment", desc: "Construct an IAM policy allowing teams to create roles strictly bounded by an enterprise security policy." },
      { id: "cloud-m2-d42-q4", name: "Production Incident Lab: Privilege Escalation Attack Simulation", type: "detective", desc: "Detect and neutralize a simulated attacker exploiting an unbound `iam:PassRole` privilege escalation vector." }
    ]
  },
  {
    day: 43,
    month: 2,
    blockNum: 9,
    title: "Advanced Cryptography: AWS CloudHSM, Custom Key Stores, Multi-Region KMS Keys & Cryptographic Erasure",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Hardware Security Modules & Multi-Region Cryptography",
    spokenGoal: "Meet strict financial and defense cryptographic compliance: master AWS CloudHSM (dedicated FIPS 140-2 Level 3 hardware appliances), KMS Custom Key Stores, Multi-Region Keys with synchronized key material, and Cryptographic Erasure.",
    conceptInvariant: "Multi-Region KMS Keys share the exact same key ID and key material across multiple AWS regions. Ciphertext encrypted in `us-east-1` can be decrypted locally in `eu-west-1` without making cross-region network calls to the originating KMS endpoint.",
    failureMode: "Replicating an encrypted database to a secondary region while using single-region KMS keys, discovering during a regional disaster that the secondary region cannot decrypt the database because the primary region KMS endpoint is unreachable.",
    tryItFriction: "Provision and test a Multi-Region KMS Key: encrypt a string in `us-east-1`, replicate the ciphertext to `us-west-2`, and decrypt it locally using the secondary replica key.",
    socraticHints: [
      "Why are Multi-Region KMS Keys vital for cross-region disaster recovery?",
      "Because standard KMS keys are strictly regional! If the primary region goes down, its KMS endpoint goes down with it.",
      "Multi-Region Keys have identical key material in both regions, enabling local decryption during a regional blackout."
    ],
    situationalPuzzle: {
      scenario: "A European banking regulator orders an enterprise to prove compliance with GDPR 'Right to be Forgotten' for 10 million users stored across immutable WORM S3 compliance archives. Deleting individual lines from immutable archives is physically impossible. How can the architect satisfy the regulator?",
      options: [
        "Delete all backups and close the bank.",
        "Cryptographic Erasure (Crypto-Shredding): Encrypt each user's PII with a unique user-specific KMS Data Key; to delete the user, permanently destroy their specific encryption key, rendering their data irreversibly unreadable ciphertext.",
        "Wait 10 years for the archives to expire naturally.",
        "Rename the users to 'Anonymous' in the database."
      ],
      answerIdx: 1,
      debrief: "Cryptographic Erasure (Crypto-Shredding) solves GDPR compliance on immutable media. By encrypting each user's data with an individual key and destroying that key upon deletion requests, the underlying data becomes mathematically undecryptable noise, satisfying legal requirements."
    },
    quests: [
      { id: "cloud-m2-d43-q1", name: "FIPS 140-2 Level 3 CloudHSM vs KMS Architecture", type: "concept", desc: "Compare dedicated single-tenant CloudHSM clusters with shared multi-tenant KMS and custom key stores." },
      { id: "cloud-m2-d43-q2", name: "Detective Lab: The Unreadable Cross-Region Replica Disaster", type: "detective", desc: "Resolve a disaster recovery failover failure where secondary databases failed to decrypt due to regional key locks." },
      { id: "cloud-m2-d43-q3", name: "Mastery Assignment: Cryptographic Erasure & Key Lifecycle Engine", type: "assignment", desc: "Build an automated key lifecycle manager implementing user-level crypto-shredding on S3 data." },
      { id: "cloud-m2-d43-q4", name: "Production Incident Lab: CloudHSM Quorum Loss Emergency Recovery", type: "detective", desc: "Recover a banking HSM cluster that lost cryptographic quorum after two HSM appliances failed simultaneously." }
    ]
  },
  {
    day: 44,
    month: 2,
    blockNum: 9,
    title: "Advanced Cloud Networking: AWS Network Firewall, Transit Gateway (TGW) Peering & AWS PrivateLink",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Enterprise Network Hub-and-Spoke Architecture",
    spokenGoal: "Connect hundreds of enterprise VPCs securely: master AWS Transit Gateway (TGW) hub-and-spoke topologies, route table isolation, AWS Network Firewall stateful Suricata inspection, and AWS PrivateLink for exposing services without public IPs.",
    conceptInvariant: "VPC Peering does not support transitive routing (if VPC A peers with B, and B peers with C, A cannot talk to C). AWS Transit Gateway acts as a high-throughput cloud router supporting transitive routing across thousands of VPCs and on-premises VPNs.",
    failureMode: "Building a full-mesh VPC peering topology across 50 enterprise VPCs (requiring 1,225 individual peering connections), creating an unmaintainable routing nightmare that collapses on the first subnet collision.",
    tryItFriction: "Design a Transit Gateway route table architecture separating Prod VPCs, Non-Prod VPCs, and a Centralized Inspection VPC with AWS Network Firewall.",
    socraticHints: [
      "Why is AWS Transit Gateway superior to VPC Peering for large enterprise networks?",
      "Transit Gateway uses a hub-and-spoke model supporting transitive routing!",
      "Instead of thousands of point-to-point peerings, every VPC connects to one central router with isolated route tables."
    ],
    situationalPuzzle: {
      scenario: "A fintech platform needs to consume a payment API hosted in a partner company's AWS account. Security policies strictly forbid routing traffic over the public internet, and corporate CIDR blocks overlap (both companies use `10.0.0.0/16`). How can they establish private connectivity without renumbering IP addresses?",
      options: [
        "VPC Peering with custom route tables.",
        "AWS PrivateLink (VPC Endpoint Service): The partner exposes the API as an Endpoint Service; the fintech creates an Interface Endpoint in their VPC, establishing secure unidirectional private connectivity over AWS internal fabrics regardless of overlapping CIDRs.",
        "An open public IP address with basic authentication.",
        "A physical Ethernet cable between datacenters."
      ],
      answerIdx: 1,
      debrief: "AWS PrivateLink provides private connectivity between VPCs and services without exposing traffic to the internet and without requiring VPC Peering. Because PrivateLink works via dedicated ENIs using local IPs, it functions seamlessly even across overlapping CIDR blocks."
    },
    quests: [
      { id: "cloud-m2-d44-q1", name: "Transit Gateway Hub-and-Spoke Topology & Route Table Isolation", type: "concept", desc: "Trace packet forwarding, multi-account attachments, and Suricata stateful firewall inspection VPCs." },
      { id: "cloud-m2-d44-q2", name: "Detective Lab: The Overlapping CIDR Network Peering Deadlock", type: "detective", desc: "Resolve a connection roadblock between two companies using identical 10.0.0.0/16 subnets via PrivateLink." },
      { id: "cloud-m2-d44-q3", name: "Mastery Assignment: Centralized Egress Inspection VPC Architecture", type: "assignment", desc: "Design a Terraform specification for a central egress VPC routing all outbound internet traffic through Network Firewall." },
      { id: "cloud-m2-d44-q4", name: "Production Incident Lab: Transit Gateway Route Table Black Hole", type: "detective", desc: "Triage a corporate network outage caused by an unpropagated TGW route table dropping cross-VPC traffic." }
    ]
  },
  {
    day: 45,
    month: 2,
    blockNum: 9,
    title: "⭐ MILESTONE 8: Multi-Account PCI-DSS Regulated Zero-Trust FinTech VPC Mesh",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (Enterprise Security Architecture)",
    spokenGoal: "Architect and prove an enterprise security topology: build a multi-account, PCI-DSS Level 1 compliant financial network mesh using AWS Organizations, Transit Gateway, AWS Network Firewall, PrivateLink, and OIDC federation with zero static credentials.",
    conceptInvariant: "In a PCI-DSS Cardholder Data Environment (CDE), all network access must be explicitly authorized, all data in transit and at rest must be encrypted with Customer Managed Keys, and administrative access must use multi-factor short-lived STS tokens.",
    failureMode: "Allowing direct internet ingress or egress to any subnet within the Cardholder Data Environment, resulting in immediate failure of the annual QSA audit and revocation of payment processing licenses.",
    tryItFriction: "Audit the end-to-end network topology, proving with automated validation tools that zero unencrypted packets can traverse the boundary between the public DMZ and the Cardholder Data Environment.",
    socraticHints: [
      "What is the single most critical network requirement for a PCI-DSS Cardholder Data Environment (CDE)?",
      "Strict network segmentation! The CDE must be completely isolated from corporate networks and general workloads.",
      "All ingress must pass through inspected reverse proxies, and all egress must pass through stateful firewalls."
    ],
    situationalPuzzle: {
      scenario: "During an audit of the FinTech VPC mesh, the Qualified Security Assessor (QSA) discovers that an application in the CDE logs incoming HTTP requests to CloudWatch Logs. The logs contain raw 16-digit credit card numbers (PANs). What immediate architectural control must be implemented at the edge to prevent PANs from entering log streams?",
      options: [
        "Delete the CloudWatch log groups.",
        "WAF Data Masking & Edge Tokenization: Implement an edge tokenization gateway that intercepts credit card numbers, swaps them for non-sensitive tokens before application processing, and prevents raw PAN storage across logs.",
        "Ask cardholders not to enter credit card numbers.",
        "Encrypt the hard drives of the developers' laptops."
      ],
      answerIdx: 1,
      debrief: "PCI-DSS prohibits storing Primary Account Numbers (PANs) in unencrypted logs. Implementing edge tokenization intercepts card data at the perimeter, storing the raw card in an isolated vault and passing non-sensitive tokens to downstream microservices and logs."
    },
    quests: [
      { id: "cloud-m2-d45-q1", name: "Milestone Architecture: Multi-Account PCI-DSS FinTech Blueprint", type: "concept", desc: "Design the multi-account blueprint: Security Account, Network Hub, Shared Services, and isolated CDE Account." },
      { id: "cloud-m2-d45-q2", name: "Detective Lab: The Cardholder Data Environment Egress Leak", type: "detective", desc: "Audit egress routes from a payment subnet and eliminate unauthorized outbound internet paths." },
      { id: "cloud-m2-d45-q3", name: "Mastery Assignment: Zero-Trust Transit Gateway & Network Firewall Spec", type: "assignment", desc: "Construct a complete Terraform configuration for a centralized inspection VPC with Suricata rules." },
      { id: "cloud-m2-d45-q4", name: "Production Incident Lab: Unauthenticated Lateral Movement Containment", type: "detective", desc: "Execute an emergency containment drill isolating a compromised non-prod pod attempting to reach the production CDE." }
    ]
  },

  // ─── BLOCK 10: GitOps, Infrastructure as Code & Chaos Engineering (Days 46–50) ─────
  {
    day: 46,
    month: 2,
    blockNum: 10,
    title: "Terraform Enterprise & OpenTofu: DRY Module Composition, Terragrunt & State Migration",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Enterprise Infrastructure Engineering (DRY Architecture & Modularity)",
    spokenGoal: "Scale Infrastructure as Code across hundreds of environments: master Terraform / OpenTofu module architecture, Terragrunt for DRY configurations, remote state data sources, workspace isolation, and state refactoring with `moved` blocks.",
    conceptInvariant: "Copy-pasting Terraform code across environments (`dev/`, `staging/`, `prod/`) creates configuration drift. True enterprise IaC uses parameterized root modules orchestrated by Terragrunt or workspaces, guaranteeing environment parity.",
    failureMode: "Refactoring a Terraform resource name from `aws_instance.web` to `aws_instance.app` without a `moved` block, causing Terraform to plan the DESTRUCTION of the production server and recreation from scratch.",
    tryItFriction: "Refactor a monolithic Terraform configuration into reusable modules and execute a zero-downtime state migration using `moved { from = ... to = ... }` without modifying real AWS resources.",
    socraticHints: [
      "What happens if you rename a resource block in Terraform without a `moved` block?",
      "Terraform thinks the old resource was deleted and a new one was created!",
      "It will plan to DESTROY your production resource and create a new one. Always use `moved` blocks for safe refactoring."
    ],
    situationalPuzzle: {
      scenario: "A DevOps engineer needs to deploy the same infrastructure stack across 15 developer environments. The current setup copies 500 lines of HCL into 15 separate directories. When an S3 bucket configuration changes, the engineer must update 15 files. Which tool pattern solves this DRY anti-pattern?",
      options: [
        "Create 15 AWS accounts manually in the console.",
        "Terragrunt / DRY Module Composition: Maintain a single canonical Terraform module and use lightweight Terragrunt files containing only environment-specific input variables (`inputs = { env = \"dev-1\" }`).",
        "Delete all developer environments.",
        "Write a Bash script that runs `sed` on raw HCL."
      ],
      answerIdx: 1,
      debrief: "Terragrunt wraps Terraform to keep configurations DRY (Don't Repeat Yourself). Instead of copying entire resource definitions across environments, Terragrunt points to a single shared module and supplies only environment-specific input variables."
    },
    quests: [
      { id: "cloud-m2-d46-q1", name: "Terraform Module Composition & State DAG Evaluation", type: "concept", desc: "Trace module input/output contracts, dynamic blocks, `for_each` meta-arguments, and provider passing." },
      { id: "cloud-m2-d46-q2", name: "Detective Lab: The Accidental Production Destroy Plan", type: "detective", desc: "Catch and neutralize a dangerous `destroy and recreate` plan caused by an unmapped resource rename." },
      { id: "cloud-m2-d46-q3", name: "Mastery Assignment: Enterprise Multi-Tier Terragrunt Architecture", type: "assignment", desc: "Design a DRY multi-environment repository structure deploying VPC, EKS, and RDS across Dev/Staging/Prod." },
      { id: "cloud-m2-d46-q4", name: "Production Incident Lab: Corrupted State Lock Deadlock Release", type: "detective", desc: "Safely resolve a stuck DynamoDB state lock (`Error acquiring state lock`) following a crashed CI pipeline." }
    ]
  },
  {
    day: 47,
    month: 2,
    blockNum: 10,
    title: "GitOps Continuous Delivery: ArgoCD & FluxCD on EKS with Automated Drift Detection & Rollbacks",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Declarative Continuous Delivery (GitOps Principles & Reconciliation)",
    spokenGoal: "Implement GitOps continuous delivery on AWS: master ArgoCD and FluxCD on Amazon EKS, Git repository as single source of truth, automated reconciliation loops, automated drift detection, self-healing, and automated canary rollbacks.",
    conceptInvariant: "Under GitOps, developers NEVER run `kubectl apply` or access production clusters directly. All infrastructure and application state is committed to Git. An in-cluster GitOps operator (ArgoCD) continuously pulls from Git and reconciles cluster state.",
    failureMode: "An engineer makes manual emergency changes to production Kubernetes pods via `kubectl edit`. When ArgoCD syncs 3 minutes later, it detects drift and unconditionally overwrites the manual changes, reverting the emergency fix.",
    tryItFriction: "Deploy ArgoCD on EKS, configure an `Application` CRD with automated self-healing, manually mutate a deployment via kubectl, and observe ArgoCD revert the drift back to the Git commit within 60 seconds.",
    socraticHints: [
      "Why is GitOps more secure than traditional CI/CD push pipelines (like Jenkins or GitHub Actions runners)?",
      "Pull vs Push! GitOps agents run INSIDE your private cluster and PULL from Git.",
      "You don't need to expose cluster API endpoints or store cluster admin credentials in external CI/CD runners."
    ],
    situationalPuzzle: {
      scenario: "A new microservice release deployed via ArgoCD causes the application error rate to spike to 25%. How does a modern GitOps progressive delivery pipeline automatically detect and roll back this release without human intervention?",
      options: [
        "ArgoCD reboots the Kubernetes worker nodes.",
        "Argo Rollouts with Metric Analysis: Argo Rollouts monitors CloudWatch / Prometheus metrics during a canary release; if the error rate exceeds the threshold, it automatically aborts the rollout, reverts traffic to stable, and marks the deployment degraded.",
        "The developer must wake up and git revert.",
        "The cluster deletes the namespace."
      ],
      answerIdx: 1,
      debrief: "Argo Rollouts extends Kubernetes with canary and blue-green capabilities. By linking an AnalysisTemplate to CloudWatch or Prometheus metrics, the controller automatically evaluates error rates and aborts the rollout instantly if thresholds are breached."
    },
    quests: [
      { id: "cloud-m2-d47-q1", name: "GitOps Reconciliation Engine: Declarative Pull vs Imperative Push", type: "concept", desc: "Trace ArgoCD repository server, application controller, and Kubernetes API server reconciliation loops." },
      { id: "cloud-m2-d47-q2", name: "Detective Lab: The Out-of-Sync Infinite GitOps Drift Loop", type: "detective", desc: "Diagnose an ArgoCD application oscillating between Synced and OutOfSync due to dynamic mutating webhooks." },
      { id: "cloud-m2-d47-q3", name: "Mastery Assignment: Production Argo Rollouts Automated Canary Pipeline", type: "assignment", desc: "Author an Argo Rollout manifest with step-by-step traffic shifting (20% -> 50% -> 100%) and metric analysis." },
      { id: "cloud-m2-d47-q4", name: "Production Incident Lab: Rogue Cluster Mutation & Automated Self-Healing", type: "detective", desc: "Simulate an unapproved manual cluster alteration and demonstrate automated GitOps self-healing enforcement." }
    ]
  },
  {
    day: 48,
    month: 2,
    blockNum: 10,
    title: "AWS Cloud Development Kit (CDK): Construct Trees, L1/L2/L3 Constructs & Custom CloudFormation Macros",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Software-Defined Cloud Architecture (TypeScript CDK Engineering)",
    spokenGoal: "Program the cloud using real software languages: master the AWS Cloud Development Kit (CDK), Construct Trees, L1 (Cfn primitives) vs L2 (opinionated) vs L3 (architectural patterns), `cdk synth`, and custom CloudFormation macros.",
    conceptInvariant: "AWS CDK compiles typed object-oriented code (TypeScript/Python) into pure declarative AWS CloudFormation JSON/YAML templates. CDK provides full type safety, auto-completion, unit testing (via `@aws-cdk/assertions`), and reusable component packaging.",
    failureMode: "Writing custom CloudFormation templates with 3,000 lines of brittle JSON/YAML by hand, spending days debugging missing commas and unvalidated parameter references that fail 45 minutes into deployment.",
    tryItFriction: "Build an L3 Construct in TypeScript that encapsulates a hardened S3 bucket, KMS key, and access logging policy into a single reusable 20-line class, complete with Jest unit tests asserting encryption.",
    socraticHints: [
      "What is the difference between an L1 construct and an L2 construct in AWS CDK?",
      "L1 constructs (`CfnBucket`) map 1:1 to raw CloudFormation resources with zero defaults.",
      "L2 constructs (`s3.Bucket`) provide rich, high-level abstractions with security best practices enabled by default!"
    ],
    situationalPuzzle: {
      scenario: "An enterprise platform engineering team wants to guarantee that every S3 bucket created by any team across 50 CDK repositories has encryption and versioning enabled. Instead of reviewing every pull request manually, how can this be enforced automatically at compile time?",
      options: [
        "Ban the use of AWS CDK.",
        "CDK Aspects: Implementing an `IAspect` visits every node in the CDK construct tree during synthesis, checks for `CfnBucket` instances, and automatically enforces versioning and encryption or fails the build.",
        "Delete all unencrypted buckets after they deploy.",
        "Ask developers to sign an agreement."
      ],
      answerIdx: 1,
      debrief: "AWS CDK Aspects implement the Visitor pattern over the entire construct tree. By writing a custom Aspect, platform teams can inspect, mutate, or validate every synthesized resource across the organization before CloudFormation templates are ever deployed."
    },
    quests: [
      { id: "cloud-m2-d48-q1", name: "AWS CDK Construct Hierarchy & Synthesis Lifecycle", type: "concept", desc: "Trace App -> Stack -> Construct tree evaluation, synthesis tokens (`cdk.Lazy`), and CloudFormation compilation." },
      { id: "cloud-m2-d48-q2", name: "Detective Lab: The Broken CloudFormation Cyclic Dependency", type: "detective", desc: "Resolve a circular dependency error between security groups and compute resources in a synthesized template." },
      { id: "cloud-m2-d48-q3", name: "Mastery Assignment: Enterprise L3 Secure Microservice Construct in TypeScript", type: "assignment", desc: "Construct an L3 CDK library provisioning an ALB, Fargate Service, and DynamoDB table with unit test suites." },
      { id: "cloud-m2-d48-q4", name: "Production Incident Lab: CloudFormation Stack UPDATE_ROLLBACK_FAILED Triage", type: "detective", desc: "Recover an enterprise CloudFormation stack stuck in an unrecoverable failed state using resource skips." }
    ]
  },
  {
    day: 49,
    month: 2,
    blockNum: 10,
    title: "Chaos Engineering in Cloud Native: AWS Fault Injection Simulator (FIS), AZ Evacuation & Packet Drop Injection",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Resiliency Verification & Chaos Engineering",
    spokenGoal: "Prove your system survives real-world chaos before production does: master AWS Fault Injection Simulator (FIS), hypothesis-driven chaos experiments, simulated AZ power outages, network latency/packet drop injection, and automated rollback stop conditions.",
    conceptInvariant: "Chaos engineering is not breaking things randomly; it is the scientific discipline of experimenting on a system to build confidence in its capability to withstand turbulent conditions. Every experiment must have a steady-state hypothesis and an automated stop condition.",
    failureMode: "Running chaos tests in production without automated stop conditions. When a database failover test triggers unexpected latency, the test continues running, knocking down user-facing traffic and causing a real multi-hour outage.",
    tryItFriction: "Design an AWS FIS experiment that injects 200ms latency and 15% packet drops on EC2 network interfaces while monitoring whether the Application Load Balancer successfully reroutes traffic within 30 seconds.",
    socraticHints: [
      "What is the most critical safety guardrail in an AWS Fault Injection Simulator experiment?",
      "The Stop Condition (CloudWatch Alarm)!",
      "If user-facing error rates spike beyond 1%, the FIS experiment halts immediately and restores normal operation."
    ],
    situationalPuzzle: {
      scenario: "A fintech team runs an AZ Evacuation GameDay using AWS Fault Injection Simulator. FIS terminates all compute in `us-east-1a`. Traffic successfully fails over to `us-east-1b`. However, 10 minutes later, `us-east-1b` collapses due to CPU saturation. What capacity planning flaw did the chaos experiment expose?",
      options: [
        "AWS runs out of electricity during chaos tests.",
        "Under-Provisioned Failover Headroom (N+1 Failure): The surviving AZ did not have sufficient baseline capacity or fast enough auto-scaling to absorb 100% of the regional traffic, exposing that each AZ was sized only for 50% load without headroom.",
        "The database deleted all records.",
        "Chaos experiments are illegal in financial services."
      ],
      answerIdx: 1,
      debrief: "A multi-AZ architecture must maintain sufficient headroom (N+1 capacity) so that when one AZ is completely evacuated, the remaining AZs can absorb the entire load without cascading overload. Chaos experiments validate these capacity invariants."
    },
    quests: [
      { id: "cloud-m2-d49-q1", name: "Principles of Chaos Engineering & AWS FIS Architecture", type: "concept", desc: "Define steady-state hypotheses, blast radius controls, action targets, and CloudWatch stop conditions." },
      { id: "cloud-m2-d49-q2", name: "Detective Lab: The Unmonitored Chaos Disaster", type: "detective", desc: "Audit an unsafe chaos script and add automated CloudWatch stop conditions to prevent catastrophic outages." },
      { id: "cloud-m2-d49-q3", name: "Mastery Assignment: Full Availability Zone Evacuation FIS Experiment", type: "assignment", desc: "Construct an AWS FIS experiment definition that disables a subnet, drains instances, and validates ALB failover." },
      { id: "cloud-m2-d49-q4", name: "Production Incident Lab: GameDay Cascading Failure Post-Mortem", type: "detective", desc: "Analyze a simulated regional failure drill where auto-scaling throttles prevented healthy instances from booting." }
    ]
  },
  {
    day: 50,
    month: 2,
    blockNum: 10,
    title: "⭐ MILESTONE 9: GitOps Ephemeral Multi-Tier Pull Request Environments with Terraform & ArgoCD",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (Automated Ephemeral Infrastructure)",
    spokenGoal: "Architect and prove modern developer velocity: build an automated ephemeral environment pipeline where opening a GitHub Pull Request provisions a complete, isolated multi-tier cloud environment (Terraform VPC resources + ArgoCD Kubernetes apps + ephemeral DB), tests it, and destroys it cleanly upon PR merge.",
    conceptInvariant: "Ephemeral environments eliminate staging environment bottlenecks. Each feature branch tests against real, isolated cloud infrastructure without risking shared staging databases or incurring permanent infrastructure costs.",
    failureMode: "Leaving ephemeral environments running after pull requests are closed or merged, accumulating hundreds of orphaned databases and load balancers that balloon the AWS bill by $20,000.",
    tryItFriction: "Automate the complete lifecycle: PR Open -> GitHub Actions triggers Terraform & ArgoCD -> deploys isolated preview URL (`pr-42.preview.app.com`) -> runs e2e tests -> PR Close -> automated teardown.",
    socraticHints: [
      "How do you ensure ephemeral environments are destroyed even if a developer abandons a PR?",
      "Implement automated TTL teardown policies (e.g. AWS Lambda / EventBridge cron checking PR status)!",
      "Never rely solely on webhook events; always enforce a maximum 48-hour lifespan on preview resources."
    ],
    situationalPuzzle: {
      scenario: "A company implements ephemeral preview environments. An engineer opens PR #104. The pipeline provisions an isolated RDS PostgreSQL instance, a Redis cache, and an EKS namespace. The engineer merges the PR, but GitHub webhooks fail due to a network glitch. The environment remains running undetected for 30 days. How should this leak be prevented architecturally?",
      options: [
        "Never use ephemeral environments.",
        "Automated TTL Garbage Collection: Tag all ephemeral resources with `CreatedAt` and `PRNumber`, and run an automated EventBridge/Lambda cleaner every hour that checks GitHub PR status and destroys orphaned environments older than 24 hours.",
        "Make developers pay for their own AWS accounts.",
        "Use local Docker on laptops only."
      ],
      answerIdx: 1,
      debrief: "Webhook delivery is best-effort. Robust ephemeral infrastructure platforms implement a background garbage collector (reaper) that scans resource tags (`TTL`, `PRNumber`), queries the VCS API, and unconditionally tears down closed or expired environments."
    },
    quests: [
      { id: "cloud-m2-d50-q1", name: "Milestone Architecture: Ephemeral Environment Orchestrator Blueprint", type: "concept", desc: "Design the end-to-end architecture: VCS Webhooks -> Terraform Engine -> ArgoCD App-of-Apps -> DNS Routing." },
      { id: "cloud-m2-d50-q2", name: "Detective Lab: The Orphaned Ephemeral Resource Money Sink", type: "detective", desc: "Identify $8,000/month in zombie preview environments and build an automated tag-based reaper Lambda." },
      { id: "cloud-m2-d50-q3", name: "Mastery Assignment: End-to-End Ephemeral PR Environment Workflow", type: "assignment", desc: "Author GitHub Actions workflows deploying dynamic Helm releases and Route 53 wildcard preview URLs." },
      { id: "cloud-m2-d50-q4", name: "Production Incident Lab: Dynamic DNS Subdomain Routing Collisions", type: "detective", desc: "Resolve a Route 53 wildcard routing conflict where overlapping PR branch names hijacked traffic from master." }
    ]
  },

  // ─── BLOCK 11: Advanced Cloud Data Architectures & Global Databases (Days 51–55) ──
  {
    day: 51,
    month: 2,
    blockNum: 11,
    title: "DynamoDB Single-Table Design Mastery: Overloaded Indexes, Composite Keys & Adjacency Lists",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Staff-Level NoSQL Architecture (Single-Table Design)",
    spokenGoal: "Master the pinnacle of NoSQL modeling: learn Rick Houlihan's DynamoDB Single-Table Design, generic partition/sort keys (`PK` and `SK`), overloaded Global Secondary Indexes, adjacency list modeling for many-to-many relationships, and transactional writes.",
    conceptInvariant: "In DynamoDB Single-Table Design, an entire enterprise application (Users, Orders, Products, Invoices) lives in ONE physical table. By overloading generic keys (`PK: USER#123`, `SK: ORDER#999`), a single `Query` can fetch a user and all their recent orders in a single sub-10ms network round-trip.",
    failureMode: "Creating 20 separate DynamoDB tables like a relational database, forcing microservices to execute 20 sequential network calls to join data together in application code, destroying latency and exploding costs.",
    tryItFriction: "Design a single DynamoDB schema that satisfies 6 distinct query access patterns (Get User Profile, Get User Orders, Get Order Items, Get Product Inventory, List Users by Role, List Orders by Date) using 1 table and 1 GSI.",
    socraticHints: [
      "Why is Single-Table Design faster than multi-table DynamoDB architectures?",
      "Item Collections! A single `Query` using `PK = USER#123` can return the user profile AND their last 10 orders in ONE operation.",
      "Zero network joins, zero latency penalty, and maximum compute efficiency."
    ],
    situationalPuzzle: {
      scenario: "A banking system uses DynamoDB Single-Table Design. A funds transfer requires deducting $100 from Account A and adding $100 to Account B. If the service crashes halfway through, Account A loses money without Account B receiving it. Which DynamoDB API guarantees atomic consistency across both records?",
      options: [
        "Call `PutItem` twice in a loop.",
        "`TransactWriteItems`: DynamoDB transactions provide all-or-nothing ACID semantics across up to 100 items or 4MB of data within the same AWS account and region, rolling back completely if any condition fails.",
        "Store the money in an S3 bucket.",
        "Switch to an unencrypted text file."
      ],
      answerIdx: 1,
      debrief: "DynamoDB `TransactWriteItems` provides full ACID transaction guarantees across multiple items. If deducting funds from Account A succeeds but crediting Account B fails (or vice versa), the entire transaction aborts, ensuring financial balance integrity."
    },
    quests: [
      { id: "cloud-m2-d51-q1", name: "DynamoDB Single-Table Design Theory & Entity Key Overloading", type: "concept", desc: "Map entity relationship modeling (1:1, 1:N, N:M) to generic partition/sort key hierarchies." },
      { id: "cloud-m2-d51-q2", name: "Detective Lab: The Multi-Table Latency Cascading Failure", type: "detective", desc: "Refactor a bloated 15-table relational-style DynamoDB setup into an optimized Single-Table model." },
      { id: "cloud-m2-d51-q3", name: "Mastery Assignment: Full E-Commerce Single-Table Schema Specification", type: "assignment", desc: "Construct a complete single-table schema with composite keys, inverted index GSI, and transaction conditions." },
      { id: "cloud-m2-d51-q4", name: "Production Incident Lab: Hot Partition Item Collection Limit Breach", type: "detective", desc: "Resolve a 10GB Local Secondary Index (LSI) item collection limit exception and migrate to sparse GSIs." }
    ]
  },
  {
    day: 52,
    month: 2,
    blockNum: 11,
    title: "Amazon ElastiCache (Redis) Clustering: Shard Replication, Slot Hashing, Eviction Policies & Write-Through Caching",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "In-Memory Distributed Caching (Sub-Millisecond Data Tier)",
    spokenGoal: "Deliver sub-millisecond responses at 10,000,000 ops/sec: master Amazon ElastiCache for Redis in cluster mode, 16,384 hash slot distribution, Multi-AZ automatic failover, eviction algorithms (`volatile-lru` vs `allkeys-lru`), and write-through vs cache-aside patterns.",
    conceptInvariant: "Redis cluster partitions data across 16,384 hash slots. Using hash tags (e.g. `{user:123}.profile` and `{user:123}.cart`) forces related keys onto the same hash slot and node, enabling multi-key transactions and pipelined operations without cross-slot errors.",
    failureMode: "Configuring Redis cache without an eviction policy (`noeviction`). When RAM fills to 100%, Redis rejects all subsequent write operations with Out Of Memory errors, crashing backend applications.",
    tryItFriction: "Benchmark a Node.js API with and without Redis caching under 5,000 req/sec load: observe database CPU drop from 95% to 4% and API p99 latency drop from 140ms to 2ms.",
    socraticHints: [
      "What is the difference between Cache-Aside (Lazy Loading) and Write-Through caching?",
      "In Cache-Aside, the app reads from cache; if missed, it reads DB and writes to cache.",
      "In Write-Through, the app updates the DB AND cache simultaneously, ensuring cache is always fresh."
    ],
    situationalPuzzle: {
      scenario: "A live sports scoreboard caches current scores in Redis. 1,000,000 clients poll the cache. The cached score key expires at the exact second a touchdown is scored. 1,000,000 concurrent requests miss the cache simultaneously and slam the primary PostgreSQL database, crashing it instantly. What is this phenomenon, and how do you prevent it?",
      options: [
        "A DDoS attack by sports fans.",
        "Cache Stampede (Thundering Herd): Prevent it using probabilistic early expiration (XFetch algorithm), mutual exclusion distributed locks (mutex) on cache misses, or background pre-warming before TTL expiry.",
        "PostgreSQL cannot handle sports scores.",
        "Redis cluster mode was disabled."
      ],
      answerIdx: 1,
      debrief: "A Cache Stampede occurs when an intensely popular cached key expires, causing massive concurrent requests to hit the database simultaneously. Mitigations include distributed mutex locks (only one worker regenerates the cache) or probabilistic early refreshing (XFetch)."
    },
    quests: [
      { id: "cloud-m2-d52-q1", name: "ElastiCache Redis Cluster Architecture & 16,384 Hash Slot Mechanics", type: "concept", desc: "Trace primary/replica replication, slot distribution, hash tag keys, and failover elections." },
      { id: "cloud-m2-d52-q2", name: "Detective Lab: The Thundering Herd Cache Stampede Crash", type: "detective", desc: "Diagnose an outage caused by expired hot keys and implement distributed mutex locking with Redis." },
      { id: "cloud-m2-d52-q3", name: "Mastery Assignment: Resilient Multi-Tier Write-Through Cache Engine", type: "assignment", desc: "Implement a TypeScript caching proxy featuring probabilistic early refresh and connection pool failover." },
      { id: "cloud-m2-d52-q4", name: "Production Incident Lab: Out-of-Memory Eviction Policy Lockout", type: "detective", desc: "Triage a production Redis cluster rejecting writes and safely reconfigure memory policies to `allkeys-lru`." }
    ]
  },
  {
    day: 53,
    month: 2,
    blockNum: 11,
    title: "Amazon Aurora Serverless v2: Distributed Log-Structured Storage, Auto-Scaling & Global Database Replication",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Next-Gen Cloud-Native Relational Engines",
    spokenGoal: "Master cloud-native relational databases: understand Amazon Aurora's distributed storage architecture (6 copies across 3 AZs), quorum write models, Aurora Serverless v2 fine-grained scaling (ACUs), and Aurora Global Databases with sub-second replication.",
    conceptInvariant: "Aurora decouples compute from storage. Traditional databases write whole dirty pages to disk; Aurora writes ONLY transaction log records over the network to a distributed, self-healing 6-way storage fleet, eliminating write amplification and I/O bottlenecks.",
    failureMode: "Assuming Aurora Serverless v2 scales instantaneously from 0 to 128 ACUs; a sudden 100x traffic spike can encounter connection queueing if auto-scaling warm-up rates are not accounted for.",
    tryItFriction: "Simulate a compute node failure on Amazon Aurora and observe how Aurora fails over to a replica in another AZ in under 15 seconds without any storage data loss.",
    socraticHints: [
      "Why is Amazon Aurora faster and more resilient than standard RDS PostgreSQL?",
      "Compute is decoupled from storage! Aurora writes logs to a distributed storage fleet spanning 3 AZs.",
      "Storage automatically repairs itself in background 10GB segments, and failover takes under 15 seconds."
    ],
    situationalPuzzle: {
      scenario: "A global enterprise needs a relational database that serves reads with sub-10ms latency in North America, Europe, and Asia, with cross-region disaster recovery RTO under 1 minute. Which Aurora feature delivers this without application-level replication logic?",
      options: [
        "Take manual snapshots and email them to other regions.",
        "Amazon Aurora Global Databases: It replicates dedicated storage across up to 5 secondary regions with typical replication latency under 1 second, providing local read performance and fast uncoordinated failover.",
        "Amazon S3 Glacier Deep Archive.",
        "EC2 instances running SQLite in each region."
      ],
      answerIdx: 1,
      debrief: "Amazon Aurora Global Databases uses dedicated infrastructure at the storage layer to replicate data across regions with typical latency under 1 second. It enables low-latency local reads globally and can be promoted to a primary read/write database in under 1 minute."
    },
    quests: [
      { id: "cloud-m2-d53-q1", name: "Aurora Distributed Storage Architecture: 4/6 Write Quorums & Log Replay", type: "concept", desc: "Trace log-as-the-database mechanics, 10GB storage protection groups, and peer-to-peer gossip repair." },
      { id: "cloud-m2-d53-q2", name: "Detective Lab: The Aurora Serverless ACU Cold Scale Lag", type: "detective", desc: "Optimize an Aurora Serverless v2 configuration by establishing baseline ACUs to absorb instant traffic spikes." },
      { id: "cloud-m2-d53-q3", name: "Mastery Assignment: Global Database Cross-Region Disaster Recovery Blueprint", type: "assignment", desc: "Construct a Terraform specification for an Aurora Global Database with managed failover orchestration." },
      { id: "cloud-m2-d53-q4", name: "Production Incident Lab: Aurora Reader Lag Replication Spike Triage", type: "detective", desc: "Diagnose an Aurora read replica lag incident caused by long-running analytic queries blocking log application." }
    ]
  },
  {
    day: 54,
    month: 2,
    blockNum: 11,
    title: "AWS Modern Data Lakehouse: Amazon Athena, AWS Glue Data Catalog, Apache Iceberg & S3 Lifecycle Tiers",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Petabyte-Scale Data Architecture (Serverless Analytics & Open Formats)",
    spokenGoal: "Build a serverless petabyte-scale analytics engine: master the AWS Modern Data Lakehouse, Amazon Athena serverless SQL, AWS Glue Data Catalog, columnar formats (Apache Parquet / ORC), and Apache Iceberg table formats for ACID transactions on S3.",
    conceptInvariant: "Never query raw JSON or CSV on Amazon S3 with Athena. Converting raw data to columnar Apache Parquet with Snappy compression reduces data scanned by up to 90%, reducing query latency by 85% and cutting Athena costs from $5.00/TB to $0.50/TB.",
    failureMode: "Running unpartitioned Athena queries across 500TB of raw JSON log files, scanning the entire bucket on every query and generating a $2,500 AWS bill for a single dashboard refresh.",
    tryItFriction: "Convert 10GB of raw JSON log records into partitioned Apache Parquet format using AWS Glue, and compare Athena query speed and scanned bytes before and after.",
    socraticHints: [
      "Why does partitioning data in S3 by date (`/year=2026/month=10/day=11/`) make Athena queries faster and cheaper?",
      "Partition Pruning! Athena reads metadata from AWS Glue and only scans the exact S3 directory matching your WHERE clause.",
      "If you query for one day, Athena ignores the other 364 days, saving 99% of scanned bytes and cost."
    ],
    situationalPuzzle: {
      scenario: "A data engineering team builds a data lake on S3. Multiple Spark and Lambda writers write to the same dataset simultaneously. Occasionally, readers read half-written records or deleted data. What open table format brings ACID transactions, schema evolution, and time travel to S3 data lakes?",
      options: [
        "Raw CSV files.",
        "Apache Iceberg on AWS: An open table format supported by Athena and Glue that provides full ACID transactions, row-level mutations, hidden partitioning, and snapshot isolation directly on S3 object storage.",
        "Microsoft Excel files on S3.",
        "Amazon CloudWatch Metrics."
      ],
      answerIdx: 1,
      debrief: "Apache Iceberg provides ACID table capabilities on top of object storage. It tracks data files using atomic metadata tree pointers, enabling concurrent writes, snapshot isolation, row-level updates, and time-travel queries without data corruption on S3."
    },
    quests: [
      { id: "cloud-m2-d54-q1", name: "Data Lakehouse Architecture: Parquet Columnar Storage & Athena Cost Models", type: "concept", desc: "Analyze row vs columnar storage layout, dictionary encoding, and partition pruning math." },
      { id: "cloud-m2-d54-q2", name: "Detective Lab: The $5,000 Unpartitioned Athena Query Disaster", type: "detective", desc: "Audit an expensive analytics pipeline and implement S3 partition projection with Apache Parquet." },
      { id: "cloud-m2-d54-q3", name: "Mastery Assignment: Serverless Apache Iceberg Data Lakehouse Pipeline", type: "assignment", desc: "Build an automated Glue ETL job writing Apache Iceberg tables with snapshot retention and compaction." },
      { id: "cloud-m2-d54-q4", name: "Production Incident Lab: Glue Data Catalog Schema Drift Desync", type: "detective", desc: "Resolve an Athena query crash caused by upstream schema changes adding unmapped columns to raw data." }
    ]
  },
  {
    day: 55,
    month: 2,
    blockNum: 11,
    title: "⭐ MILESTONE 10: Sub-10ms Global E-Commerce Data Tier (DynamoDB Single-Table + ElastiCache Cluster + Aurora Global)",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (High-Scale Polyglot Data Architecture)",
    spokenGoal: "Architect and prove extreme scale data engineering: construct a polyglot persistence tier combining ElastiCache Redis Cluster for hot sub-millisecond caching, DynamoDB Single-Table for linear horizontally scalable cart/orders, and Aurora Global for relational financial ledgers, maintaining sub-10ms global latencies.",
    conceptInvariant: "Different workloads demand different storage engines (Polyglot Persistence). High-velocity ephemeral sessions belong in Redis; high-throughput key-value lookups belong in DynamoDB; ACID financial transactions belong in Aurora. Attempting to force all workloads into a single database breaks performance.",
    failureMode: "Using a single relational database for session storage, shopping carts, product catalog, search indexing, and financial ledgers, leading to table lock deadlocks during flash sales.",
    tryItFriction: "Simulate a flash sale with 100,000 requests/sec distributed across the polyglot data tier, verifying sub-10ms response times and zero database deadlocks.",
    socraticHints: [
      "What is the golden rule of Polyglot Persistence in cloud architectures?",
      "Use the right tool for the right job! Never force all access patterns into one database.",
      "Redis for caching/sessions, DynamoDB for high-scale document/key-value access, Aurora for relational ACID records."
    ],
    situationalPuzzle: {
      scenario: "During an architectural review of the e-commerce data tier, an auditor asks how inventory counts are prevented from going negative when 5,000 users purchase the last 3 items simultaneously. Which architectural pattern guarantees inventory integrity without locking the entire database?",
      options: [
        "Let the inventory go negative and apologize to customers.",
        "Optimistic Locking with Conditional Writes: In DynamoDB, execute `UpdateItem` with `ConditionExpression: inventory >= :quantity`; in Aurora, use `SELECT ... FOR UPDATE` or atomic decrement with condition check, rejecting updates if inventory is exhausted.",
        "Turn off the website when inventory is low.",
        "Store the inventory count in a browser cookie."
      ],
      answerIdx: 1,
      debrief: "Optimistic locking and atomic conditional updates prevent race conditions without heavy distributed locks. DynamoDB's `ConditionExpression: inventory >= :qty` checks and decrements atomically at the storage node, rejecting conflicting updates instantly."
    },
    quests: [
      { id: "cloud-m2-d55-q1", name: "Milestone Architecture: Polyglot Cloud Data Tier Blueprint", type: "concept", desc: "Design the polyglot mapping: Redis session cache -> DynamoDB shopping carts -> Aurora financial ledgers." },
      { id: "cloud-m2-d55-q2", name: "Detective Lab: The Inventory Race Condition Oversell Outage", type: "detective", desc: "Identify and resolve a race condition where simultaneous checkout calls oversold limited stock." },
      { id: "cloud-m2-d55-q3", name: "Mastery Assignment: Sub-10ms Polyglot Persistence Data Access Layer", type: "assignment", desc: "Construct a TypeScript data repository orchestrating ElastiCache, DynamoDB, and Aurora with fallback logic." },
      { id: "cloud-m2-d55-q4", name: "Production Incident Lab: Cross-Database Distributed Saga Desync", type: "detective", desc: "Recover an inconsistent state where a DynamoDB order was created but the Aurora payment record failed." }
    ]
  },

  // ─── BLOCK 12: Global Resiliency, Production War Rooms & Staff Capstone Viva (Days 56–60)
  {
    day: 56,
    month: 2,
    blockNum: 12,
    title: "Multi-Region Active-Active Architectures: Route 53 Application Recovery Controller (ARC) & Zonal Shift",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Extreme Resiliency & High-Availability Traffic Steering",
    spokenGoal: "Achieve true 99.999% availability: master Multi-Region Active-Active systems, Route 53 Application Recovery Controller (ARC), Routing Controls, Readiness Checks, and AWS Route 53 ARC Zonal Shift for rapid single-AZ evacuations.",
    conceptInvariant: "During an active incident, you must never rely on complex automated decision logic or deep dynamic database queries to steer traffic. Route 53 ARC uses simple, isolated, highly reliable 5-region replicated control plane cells that can flip routing switches in seconds even if major AWS regions are failing.",
    failureMode: "Relying on standard Route 53 health checks that depend on the control plane of a failing region, resulting in failed health check updates and an inability to steer traffic away from the outage.",
    tryItFriction: "Execute a simulated Route 53 ARC Zonal Shift to steer all traffic away from an impaired Availability Zone (`us-east-1a`) in under 30 seconds without modifying DNS records or restarting servers.",
    socraticHints: [
      "Why is Route 53 Application Recovery Controller (ARC) more reliable during major outages than standard Route 53 APIs?",
      "ARC has dedicated 5-region redundant control plane cells with static, pre-provisioned quorum!",
      "It allows you to manually or automatically flip routing controls even when the regional AWS management console is down."
    ],
    situationalPuzzle: {
      scenario: "A major enterprise runs an Active-Active deployment across `us-east-1` and `us-west-2`. A regional fiber cut causes severe packet loss in `us-east-1`. The automated failover system attempts to execute an automated multi-step DNS reconfiguration script, but API calls fail due to regional API timeouts. How does Route 53 ARC resolve this?",
      options: [
        "Wait for the fiber cable to be repaired.",
        "Pre-Configured Routing Controls: Route 53 ARC maintains pre-established data plane routing switches replicated across 5 redundant global cells; turning off the `us-east-1` switch reroutes global traffic in seconds with zero regional API dependencies.",
        "Reboot the AWS management console.",
        "Switch the application to an on-premises server."
      ],
      answerIdx: 1,
      debrief: "Route 53 ARC Routing Controls are pre-provisioned binary switches managed by five independent regional data planes. They do not depend on the control plane of the failing region, enabling guaranteed traffic evacuation in seconds even during catastrophic regional blackouts."
    },
    quests: [
      { id: "cloud-m2-d56-q1", name: "Route 53 ARC Architecture: 5-Region Quorum & Routing Controls", type: "concept", desc: "Trace ARC data plane isolation, readiness check evaluation, and safety rule assertions." },
      { id: "cloud-m2-d56-q2", name: "Detective Lab: The Cascading Overload Failover Disaster", type: "detective", desc: "Configure ARC Safety Rules to prevent automated failover from routing traffic to a region with insufficient capacity." },
      { id: "cloud-m2-d56-q3", name: "Mastery Assignment: Multi-Region Active-Active ARC Failover Harness", type: "assignment", desc: "Construct a Terraform specification deploying Route 53 ARC routing controls and Zonal Shift configurations." },
      { id: "cloud-m2-d56-q4", name: "Production Incident Lab: Sub-Minute Zonal Evacuation Drill", type: "detective", desc: "Execute a live zonal evacuation drill under simulated AZ degradation and verify sub-30s traffic redirection." }
    ]
  },
  {
    day: 57,
    month: 2,
    blockNum: 12,
    title: "Global State Synchronization & Conflict Resolution: DynamoDB Global Tables, Vector Clocks & CRDTs",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Distributed Systems Theory & Conflict Resolution",
    spokenGoal: "Synchronize data across the planet without corruption: master Amazon DynamoDB Global Tables, multi-region active-active writes, last-writer-wins (LWW) conflict resolution, vector clocks, and Conflict-Free Replicated Data Types (CRDTs).",
    conceptInvariant: "In multi-region active-active writes, network latency between regions (e.g. US to Europe is ~80ms) makes synchronous locking impossible. Writes must be accepted locally and replicated asynchronously. When two users update the same record simultaneously in different regions, conflict resolution rules must deterministically reconcile state.",
    failureMode: "Building a multi-region active-active counter in DynamoDB using naive increments (`SET counter = counter + 1`). Concurrent writes in two regions overwrite each other due to Last-Writer-Wins, losing 50% of counts.",
    tryItFriction: "Implement a PN-Counter (Positive-Negative Counter CRDT) or state-based G-Counter on top of DynamoDB Global Tables that guarantees convergence regardless of message arrival order across regions.",
    socraticHints: [
      "Why does naive Last-Writer-Wins (LWW) cause data loss in multi-region active-active architectures?",
      "Because clock skew or millisecond arrival differences cause the later timestamp to overwrite the earlier update entirely!",
      "Use CRDTs (Conflict-Free Replicated Data Types) or region-sharded increments so updates commute and merge deterministically."
    ],
    situationalPuzzle: {
      scenario: "A collaborative document editor runs multi-region active-active on DynamoDB Global Tables. User A in Virginia types 'Hello' at 12:00:00.050. User B in Frankfurt types 'World' at 12:00:00.052. Due to Last-Writer-Wins (LWW), Frankfurt overwrites Virginia entirely, and 'Hello' is permanently erased. How must the data structure be remodeled to preserve both edits?",
      options: [
        "Force all users worldwide to connect only to Virginia.",
        "Operation-Based CRDT / Event Sourcing: Store edits as an append-only log of immutable delta operations rather than in-place overwrites; the frontend merges the deltas deterministically using causal ordering.",
        "Increase the CPU of DynamoDB.",
        "Add a 5-second sleep before saving."
      ],
      answerIdx: 1,
      debrief: "In-place overwrites on multi-region databases suffer from Last-Writer-Wins data loss. Event sourcing or CRDTs record changes as immutable append-only operations (deltas). Because deltas are commutative, all regions converge to the exact same merged state regardless of arrival order."
    },
    quests: [
      { id: "cloud-m2-d57-q1", name: "CAP Theorem, PACELC & Global Replication Mechanics", type: "concept", desc: "Analyze network partitions, consistency models, and DynamoDB Global Tables replication lag." },
      { id: "cloud-m2-d57-q2", name: "Detective Lab: The Last-Writer-Wins Concurrent Update Loss", type: "detective", desc: "Identify lost updates in a multi-region inventory table and refactor to regional delta counters." },
      { id: "cloud-m2-d57-q3", name: "Mastery Assignment: Distributed CRDT Convergence Engine in TypeScript", type: "assignment", desc: "Build a state-based Observed-Remove Set (OR-Set) CRDT replicating across multi-region DynamoDB endpoints." },
      { id: "cloud-m2-d57-q4", name: "Production Incident Lab: Cross-Region Replication Asymmetry Outage", type: "detective", desc: "Triage a replication queue stall in DynamoDB Global Tables caused by regional throughput throttling." }
    ]
  },
  {
    day: 58,
    month: 2,
    blockNum: 12,
    title: "Production War Room: 3 AM Outage Post-Mortems (BGP Route Flapping, Split-Brain, and DNS Poisoning)",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "SRE Incident Command & Root Cause Analysis (RCA)",
    spokenGoal: "Operate as a battle-tested Staff SRE Incident Commander: diagnose and resolve catastrophic real-world outages under pressure, lead 3 AM production war rooms, analyze BGP route flapping, split-brain database states, and author Blameless Post-Mortems.",
    conceptInvariant: "During a major P0 production outage, the Incident Commander's sole priority is Mitigating User Impact (stopping the bleeding), NOT debugging the root cause. Once the system is stabilized via rollback, failover, or traffic shedding, root cause analysis begins.",
    failureMode: "An engineer spending 2 hours during a total production blackout trying to inspect source code and reproduce a bug on their laptop instead of immediately executing an automated rollback to the last known stable deployment.",
    tryItFriction: "Lead a simulated 3 AM P0 outage drill: triage conflicting CloudWatch alerts, establish incident command hierarchy, execute traffic shedding, stabilize the service in under 8 minutes, and draft an executive post-mortem.",
    socraticHints: [
      "What is the first action an Incident Commander should take when an unknown deployment causes a 50% error rate?",
      "Roll back immediately! Restore service first; investigate the code later.",
      "Never debug on live production traffic when a stable rollback target is available."
    ],
    situationalPuzzle: {
      scenario: "At 3:15 AM, monitoring alerts fire: global traffic is dropping to zero. The primary database cluster in `us-east-1` reports healthy, but the secondary database in `eu-central-1` simultaneously promoted itself to primary due to an inter-region network partition. Both databases are now accepting conflicting writes (Split-Brain). What is the immediate correct action?",
      options: [
        "Delete both databases and restore from yesterday's backup.",
        "Fence the Partition Immediately: Cut off traffic to one region instantly (e.g. set the secondary region to Read-Only or severed from DNS) to prevent further split-brain writes, stabilize one authoritative primary, and reconcile write logs later.",
        "Wait for the network partition to resolve on its own.",
        "Deploy a code update to all microservices."
      ],
      answerIdx: 1,
      debrief: "In a split-brain disaster, two clusters believe they are the authoritative primary. Immediate fencing (STONITH / traffic severing) is required to restrict all writes to one cluster. Letting both accept writes compounds divergence, making reconciliation mathematically impossible."
    },
    quests: [
      { id: "cloud-m2-d58-q1", name: "SRE Incident Command System & Blameless Post-Mortem Taxonomy", type: "concept", desc: "Learn the 5 Whys, Mean Time to Detect (MTTD), Mean Time to Resolve (MTTR), and corrective action tracking." },
      { id: "cloud-m2-d58-q2", name: "Detective Lab: The Inter-Region Split-Brain State Reconciler", type: "detective", desc: "Audit conflicting database transaction logs following a network partition and reconcile diverged accounts." },
      { id: "cloud-m2-d58-q3", name: "Mastery Assignment: Production Outage Post-Mortem & Incident Runbook", type: "assignment", desc: "Author an executive-level RCA document detailing root cause, timeline, blast radius, and 5 preventative actions." },
      { id: "cloud-m2-d58-q4", name: "Production Incident Lab: Live 3 AM Chaos Outage Simulation", type: "detective", desc: "Survive an unannounced multi-system failure injection and restore service within strict SLA targets." }
    ]
  },
  {
    day: 59,
    month: 2,
    blockNum: 12,
    title: "Advanced FinOps Unit Economics: CloudWatch Metric Math, Cost Per Transaction & Cloud Carbon Footprint",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Executive Cloud Economics & Environmental Governance",
    spokenGoal: "Connect cloud architecture directly to business profitability: calculate Cloud Unit Economics (Cost per Transaction, Cost per Active User), correlate infrastructure metrics with billing via CloudWatch Metric Math, and track environmental impact with AWS Customer Carbon Footprint Tool.",
    conceptInvariant: "A cloud architecture is only successful if its unit cost scales sub-linearly with revenue. If user traffic increases by 10x but your cloud bill increases by 15x, your architecture has a fundamental scaling defect.",
    failureMode: "Celebrating a 10x surge in user traffic while ignoring that the cost to serve each user exceeds the subscription price, driving the business into bankruptcy on AWS infrastructure costs.",
    tryItFriction: "Build a real-time CloudWatch dashboard combining business metrics (orders placed) and cost metrics (EC2 + Lambda spend) to calculate live 'Cost Per Order' in cents.",
    socraticHints: [
      "What is 'Cloud Unit Economics'?",
      "Measuring cloud infrastructure cost per business output (e.g. cost per ride booked, cost per search, cost per streaming hour)!",
      "It proves whether your system becomes more profitable or less profitable as it scales."
    ],
    situationalPuzzle: {
      scenario: "A fintech startup processes 10,000,000 payments a month. The AWS bill is $50,000/month (Cost per transaction = $0.005). Next month, volume doubles to 20,000,000 payments, but the AWS bill surges to $250,000/month (Cost per transaction = $0.0125). What architectural anti-pattern causes unit costs to increase with scale?",
      options: [
        "AWS charges higher rates for successful companies.",
        "Super-Linear Complexity Bottleneck: An N^2 algorithmic or architectural bottleneck (e.g. full table scans, cross-region data transfers, unindexed lookups) where processing cost per item grows as total dataset size grows.",
        "The startup should switch to pen and paper.",
        "The exchange rate between USD and AWS credits changed."
      ],
      answerIdx: 1,
      debrief: "In healthy architectures, economies of scale drive unit costs down. If unit cost increases as volume grows, the system has a super-linear scaling flaw (O(N^2) or worse), such as unpartitioned table scans, excessive cross-AZ data transfer fees, or quadratic service-to-service chatter."
    },
    quests: [
      { id: "cloud-m2-d59-q1", name: "FinOps Unit Economics Framework & Sub-Linear Cost Models", type: "concept", desc: "Calculate gross margin impact, Cost Per Daily Active User (DAU), and Cloud Carbon emission metrics." },
      { id: "cloud-m2-d59-q2", name: "Detective Lab: The Exploding Cross-AZ Data Transfer Money Pit", type: "detective", desc: "Audit an AWS bill and uncover $15,000/month in hidden cross-AZ and cross-region network transfer fees." },
      { id: "cloud-m2-d59-q3", name: "Mastery Assignment: Real-Time Unit Economics & Carbon Dashboard", type: "assignment", desc: "Construct a CloudWatch Metric Math dashboard plotting cost per transaction alongside Scope 1/2/3 carbon emissions." },
      { id: "cloud-m2-d59-q4", name: "Production Incident Lab: Uncontrolled Auto-Scaling Budget Exceeded", type: "detective", desc: "Triage an incident where a runaway auto-scaling group burned $20,000 in 6 hours and implement hard billing circuit breakers." }
    ]
  },
  {
    day: 60,
    month: 2,
    blockNum: 12,
    title: "🏆 MASTER CAPSTONE VIVA: `OmniCloud GlobalCore` 99.999% SLA Financial Clearinghouse & Live Architectural Defense",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Staff Principal Architect Viva Voce Defense",
    spokenGoal: "Defend your complete Staff Cloud Native Architect qualification: present and defend `OmniCloud GlobalCore`—a globally distributed, multi-region active-active financial clearinghouse engineered for 99.999% availability (less than 5.26 minutes of downtime per year). Defend every design decision live before an executive examination board.",
    conceptInvariant: "Five 9s availability (99.999%) is achieved through mathematical rigor: continuous active-active multi-region deployment, zero-downtime canary rollouts, automated fault isolation boundaries, sub-second failover, and zero reliance on human reaction speed during outages.",
    failureMode: "Presenting an architecture that relies on manual runbooks or human intervention to survive a regional disaster, disqualifying the design from 99.999% SLA certification.",
    tryItFriction: "Defend the entire architectural portfolio, surviving live failure injections (simultaneous fiber cut, poisoned database transaction, and compromised CI/CD credential) without violating 99.999% availability.",
    socraticHints: [
      "What is the maximum allowed downtime per year for a system claiming 99.999% availability?",
      "Exactly 5 minutes and 15 seconds across an entire 365-day year!",
      "Every failover, deployment, and recovery must be fully automated in seconds."
    ],
    situationalPuzzle: {
      scenario: "During your Staff Principal Capstone Defense, the Chief Technology Officer asks: 'What is the exact mathematical trade-off your OmniCloud architecture makes under the CAP theorem during an inter-region network partition between US and Europe?' What is the definitive Staff Architect answer?",
      options: [
        "Our architecture achieves 100% Consistency and 100% Availability simultaneously with zero trade-offs.",
        "PACELC Trade-Off Definition: Under partition (P), the system prioritizes Availability (A) for read/write payments using CRDTs and local active-active tables; Else (E) during normal operation, it prioritizes Latency (L) over strict Consistency (C) via asynchronous replication, ensuring sub-10ms global response times.",
        "We avoid the CAP theorem by using AWS Cloud.",
        "The question is not relevant to modern cloud computing."
      ],
      answerIdx: 1,
      debrief: "A Staff Principal Architect understands that the CAP theorem and PACELC theorem cannot be avoided. Under partitions, systems must choose between Availability and Consistency. Articulating how and where the architecture accepts eventual consistency and resolves conflicts via CRDTs is the hallmark of master-level architecture."
    },
    quests: [
      { id: "cloud-m2-d60-q1", name: "Staff Capstone Blueprint: OmniCloud GlobalCore Architecture Document", type: "concept", desc: "Deliver full enterprise architecture: multi-region topology, ARC traffic steering, Karpenter EKS clusters, and CRDT data tier." },
      { id: "cloud-m2-d60-q2", name: "Detective Lab: The 5-Nines SLA Compliance Audit", type: "detective", desc: "Audit the complete system for single points of failure, unmonitored dependencies, and human-in-the-loop bottlenecks." },
      { id: "cloud-m2-d60-q3", name: "Mastery Assignment: OmniCloud Global Automated Infrastructure as Code", type: "assignment", desc: "Deliver production Terraform, CDK, and Kubernetes manifests deploying the entire multi-region active-active topology." },
      { id: "cloud-m2-d60-q4", name: "Staff Capstone Viva: Live Executive Board Architectural Defense", type: "detective", desc: "Defend your design choices, trade-offs, security model, and disaster recovery SLA live before the Staff Examination Board." }
    ]
  }
];
