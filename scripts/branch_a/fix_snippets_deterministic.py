with open('scripts/branch_a/snippets_data_block11.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Day 52 Part 1 +/-
text = text.replace('±', '+/-')

# Fix Day 53 Part 3
old_part3 = '''    const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    return {
      accessKeyId: "ASIA" + Math.random().toString(36).substring(2, 14).toUpperCase(),
      secretAccessKey: "aws_sec_" + Math.random().toString(36).substring(2, 20),
      sessionToken: "aws_session_" + Math.random().toString(36).substring(2, 30),
      expiration: expiry,
    };'''

new_part3 = '''    const expiry = "2026-10-24T14:15:00.000Z";
    return {
      accessKeyId: "ASIA8VIXQ492EXAMPLE",
      secretAccessKey: "aws_sec_99a8b7c6d5e4f3a2",
      sessionToken: "aws_session_token_xyz123",
      expiration: expiry,
    };'''

assert old_part3 in text, 'old_part3 not found!'
text = text.replace(old_part3, new_part3)

# Fix Day 53 Part 4
old_part4 = 'const id = Math.random().toString(36).substring(2, 8);'
new_part4 = 'const id = "01zjef";'
assert old_part4 in text, 'old_part4 not found!'
text = text.replace(old_part4, new_part4)

# Fix Day 55 Part 2
old_part55_2 = '''    const start = Date.now();
    // Phase 1: Transatlantic Network Partition'''
new_part55_2 = '''    // Phase 1: Transatlantic Network Partition'''
assert old_part55_2 in text, 'old_part55_2 not found!'
text = text.replace(old_part55_2, new_part55_2)

with open('scripts/branch_a/snippets_data_block11.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully cleaned non-deterministic and special char snippets!')
