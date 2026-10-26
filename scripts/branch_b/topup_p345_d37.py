# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day37.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add extra paragraph to p3_say
p3_extra3 = '''    "To prevent distributed denial-of-service (DDoS) vulnerabilities and resource exhaustion on WebSocket clusters, the gateway enforces client-side rate limiters and socket connection pooling. Each authenticated client is permitted a maximum of three concurrent WebSocket connections across devices, and incoming message frame sizes are capped at sixteen kilobytes. Additionally, binary compression protocols (such as MessagePack or CBOR) are negotiated for mobile clients, reducing socket packet payload sizes by forty percent compared to standard JSON text serialization.",'''
text = text.replace('p3_say = [', 'p3_say = [\n' + p3_extra3)

# Add extra paragraph to p4_say
p4_extra3 = '''    "From an attribution modeling perspective, the abandonment telemetry engine integrates with server-side Google Tag Manager (sGTM) and Conversions API (CAPI) endpoints. When an abandoned cart is successfully recovered via an email or SMS campaign, the conversion event is matched against the originating ad click ID using cryptographic first-party identity hashing, enabling marketing data science teams to calculate incremental Return on Ad Spend (iROAS) with absolute mathematical rigor.",'''
text = text.replace('p4_say = [', 'p4_say = [\n' + p4_extra3)

# Add extra paragraph to p5_say
p5_extra3 = '''    "From a business operations and executive reporting perspective, the unified cart engine emits real-time telemetry to executive command dashboards. Merchandising directors, supply chain leads, and Chief Digital Officers monitor live metrics: Real-Time Add-to-Cart Velocity, Cross-Device Merge Frequency, Average Order Value (AOV) by acquisition channel, and Recovered Abandonment Revenue. This operational transparency ensures that platform engineers and digital marketers collaborate seamlessly to optimize customer conversion funnels.",'''
text = text.replace('p5_say = [', 'p5_say = [\n' + p5_extra3)

with open('scripts/branch_b/generate_ecom_day37.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Topped up Parts 3, 4, 5 successfully!')
