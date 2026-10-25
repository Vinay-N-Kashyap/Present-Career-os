file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day32.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

p5_extra = '''    "From an enterprise governance and reliability perspective, production federated routers must enforce strict GraphQL error masking, field-level metrics collection, and zero-trust security postures. When an individual subgraph throws an unhandled database exception or internal runtime error, exposing raw stack traces or internal IP addresses in the GraphQL error extensions violates security compliance frameworks like SOC 2 and PCI DSS. The Apollo Router intercepts all downstream errors, sanitizes error messages for public client consumption, and logs detailed diagnostic context to secure internal logging infrastructure. Concurrently, field-level usage telemetry tracks query frequency and deprecation timelines across all mobile and web storefront clients, empowering architecture committees to safely decommission legacy catalog schemas without breaking consumer experiences.",
'''

idx = text.find('p5_example =')
text = text[:idx-3] + ',\n' + p5_extra + text[idx-3:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Added extra paragraph to p5_say.")
