with open('scripts/branch_b/generate_ecom_day47.py', 'r', encoding='utf-8') as f:
    c47 = f.read()

target47 = '''    "goal": "Master complex multi-party marketplace financial engineering: construct double-entry split payment ledgers allocating gross merchandise value (GMV), platform take rates, and sales tax withholdings, navigate strict global financial licensing (PSD2 Title III exemptions, US Money Transmission Licensing, FBO custodial structures), enforce risk-adjusted rolling escrow reserves and dispute holdback periods, orchestrate asynchronous multi-split payouts via Stripe Connect and Adyen for Platforms, and govern treasury solvency through automated IRS 1099-K compliance and three-way ledger reconciliation.",'''
rep47 = '''    "goal": "Architect enterprise B2B corporate account hierarchies and governance: modeling recursive organization trees and cost center lineages, implementing Role-Based Access Control (RBAC) with statutory Separation of Duties (SOX 404), constructing multi-tier Delegation of Authority approval routing engines with budget enforcement, and deploying executive B2B governance cockpits.",'''

if target47 in c47:
    c47 = c47.replace(target47, rep47)
    with open('scripts/branch_b/generate_ecom_day47.py', 'w', encoding='utf-8') as f:
        f.write(c47)
    print("generate_ecom_day47.py patched!")
else:
    print("target47 not found, already patched or different whitespace")

with open('scripts/branch_b/generate_ecom_day48.py', 'r', encoding='utf-8') as f:
    c48 = f.read()

target48 = '''    "goal": "Master modern e-commerce fraud defense architectures: categorize adversarial attack vectors across Card-Not-Present (CNP) theft, Account Takeover (ATO), and triangulation schemes, deploy passive browser device fingerprinting and behavioral biometrics, train real-time machine learning risk scoring engines (Gradient Boosting and Graph Neural Networks), orchestrate EMV 3-D Secure 2 (3DS2) Strong Customer Authentication (SCA) exemptions with legal liability shift, and operate an executive anti-fraud command tower optimizing the frontier between fraud loss minimization and false-positive conversion friction.",'''
rep48 = '''    "goal": "Engineer enterprise B2B trade credit and settlement infrastructure: designing revolving credit underwriting engines with real-time exposure monitoring, generating commercial tax invoices under Net 30/60/90 and 2/10 Net 30 early payment terms, computing Accounts Receivable aging ledgers with CECL expected loss allowances, and orchestrating automated multi-stage dunning state machines with credit hold safeguards.",'''

if target48 in c48:
    c48 = c48.replace(target48, rep48)
    with open('scripts/branch_b/generate_ecom_day48.py', 'w', encoding='utf-8') as f:
        f.write(c48)
    print("generate_ecom_day48.py patched!")
else:
    print("target48 not found, already patched or different whitespace")
