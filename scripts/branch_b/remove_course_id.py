import os

p = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomMktLongLessons.ts')
with open(p, 'rb') as f:
    raw = f.read()

# Replace both CRLF and LF versions
raw = raw.replace(b'  "courseId": "bcom_mkt",\r\n', b'')
raw = raw.replace(b'  "courseId": "bcom_mkt",\n', b'')

with open(p, 'wb') as f:
    f.write(raw)

print("Cleaned courseId from bcomMktLongLessons.ts successfully!")
