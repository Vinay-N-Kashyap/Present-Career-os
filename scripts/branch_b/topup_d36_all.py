# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day36.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add an extra paragraph to p2_say
p2_topup = '''    "Moreover, modern 3DS2 implementations support In-App SDK Decoupled Authentication. When a shopper attempts a high-value purchase on an iPad or mobile desktop browser, the 3DS2 engine can push an asynchronous biometric verification notification directly to the consumer's mobile banking app on their primary smartphone. The consumer simply approves the notification using Apple FaceID or Android Biometric Prompt, and the 3DS Access Control Server (ACS) immediately informs the merchant gateway via webhook to finalize authorization, providing an elegant and frictionless consumer experience without SMS OTP delays.",'''
text = text.replace('p2_say = [', 'p2_say = [\n' + p2_topup)

# Add an extra paragraph to p3_say
p3_topup = '''    "In addition to primary network tokenization, enterprise architectures implement Card-on-File (CoF) Network Token Lifecycles. When a customer signs into their account, the platform displays only the brand icon and the last four digits of the physical card, while behind the scenes all recurring transactions, 1-click checkout options, and installment payment schedules execute against the network token vault. This guarantees that third-party analytics trackers, compromised employee administrative consoles, or compromised session tokens cannot expose card credentials.",'''
text = text.replace('p3_say = [', 'p3_say = [\n' + p3_topup)

# Add an extra paragraph to p4_say
p4_topup = '''    "From a corporate treasury perspective, global e-commerce platforms also leverage Real-Time Gross Settlement (RTGS) networks and central bank digital clearing protocols. By integrating with high-speed payment rails like FedNow in the United States, Pix in Brazil, and UPI in India, the multi-currency settlement engine can bypass conventional card interchange rails entirely for eligible domestic transactions, settling funds into corporate merchant operating accounts in under ten seconds at a fraction of standard card scheme interchange fees.",'''
text = text.replace('p4_say = [', 'p4_say = [\n' + p4_topup)

# Add an extra paragraph to p5_say
p5_topup = '''    "To ensure zero-downtime high availability across global operations, the Enterprise Global Payment Orchestrator is deployed in active-active configurations across multiple cloud regions. If an entire cloud region or primary database replica experiences severe infrastructure degradation, distributed health-check monitors steer pending payment requests to secondary global regions within seconds, preserving continuous transactional operations and delivering a certified 99.999% payment uptime SLA.",'''
text = text.replace('p5_say = [', 'p5_say = [\n' + p5_topup)

with open('scripts/branch_b/generate_ecom_day36.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Topped up all parts of generate_ecom_day36.py!')
