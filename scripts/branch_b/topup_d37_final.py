file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day37.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

p5_extra = '''    "To guarantee uninterrupted cart availability during high-velocity promotional flash sales, enterprise cart engines utilize Redis Cluster Sharding with client-side hashing based on the customer user identifier. By partitioning shopping sessions across multiple independent Redis master nodes, write throughput scales linearly with cluster node count, easily absorbing hundreds of thousands of concurrent cart operations per second. Furthermore, write operations append to an in-memory Write-Ahead Log with periodic asynchronous persistence to durable NVMe storage, ensuring that in the event of an abrupt node failover, shopping cart states are completely recovered without data loss or customer disruption.",
'''

idx = text.find('p5_example =')
text = text[:idx-3] + ',\n' + p5_extra + text[idx-3:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Added topup paragraph to Day 37 Part 5.")
