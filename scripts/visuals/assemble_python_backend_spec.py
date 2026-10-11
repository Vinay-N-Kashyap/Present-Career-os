# scripts/visuals/assemble_python_backend_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.python_backend_spec_m1 import DAYS_1_TO_15
from scripts.visuals.python_backend_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.python_backend_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.python_backend_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)
assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

out_path = repo_root / "scripts" / "visuals" / "python-backend-masterclass-spec.ts"

content = f"""// scripts/visuals/python-backend-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Python Programming & Backend Systems (course-python-backend)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders,
// CPython PyObject Anatomy (ob_refcnt, ob_type), PyMalloc Arenas/Pools/Blocks Memory Allocation,
// Generational Cyclic GC & PyGC_Head, Bytecode CEVAL Loop & PEP 659 Specializing Adaptive Interpreter,
// PEP 468 Compact Hash Tables with SipHash-2-4, Dynamic Array Over-Allocation Formula,
// PEP 393 Flexible String Representation & Set Probing, Suspended Generator Frame Lifecycles,
// The Global Interpreter Lock (GIL) & PEP 703 Free-Threading, POSIX Zero-Copy Shared Memory IPC,
// Asyncio Non-Blocking Event Loops & uvloop libuv Engine, Descriptor Protocol & __slots__ Optimization,
// Metaclasses vs __init_subclass__, Abstract Syntax Tree (AST) Security Linters,
// Type Variance & Protocols (PEP 484/PEP 544), ASGI 3.0 Protocol & Uvicorn Framing,
// Radix Tree URL Routing, Onion Middleware & contextvars Request Isolation,
// SIMD JSON Serialization (orjson/msgspec), Structured Concurrency TaskGroups (PEP 654),
// CPython Diagnostics (tracemalloc/py-spy), Pydantic V2 & pydantic-core Rust FFI,
// FastAPI Dependency Injection DAG, WebSockets with Backpressure Eviction, OAuth2 Stateless JWT & Refresh Rotation,
// SQLAlchemy 2.0 Async Engine & QueuePool, Martin Fowler Unit of Work & Identity Map,
// N+1 Query Elimination (selectinload/joinedload), Zero-Downtime Alembic Schema Evolution,
// Celery Distributed Task Queues & Late ACKs, Canvas Workflows (Chains & Chords), Idempotent Distributed Locks,
// Dead-Letter Queue Poison Pill Isolation, gRPC over HTTP/2 with Protobuf,
// aiokafka Event Streaming Pipelines, Redis Caching with XFetch Stampede Defense,
// Distributed Circuit Breakers & Token Bucket Rate Limiting, OpenTelemetry W3C Distributed Tracing,
// Prometheus RED Method Metrics, Structlog JSON Logging with PII Redaction,
// Kubernetes Probes & Graceful SIGTERM Draining, High-Frequency Fintech Ledgers, and Planetary Flash Sale Engines.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const PYTHON_BACKEND_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const PYTHON_BACKEND_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(content)} chars)")
print(f"Month 1: {len(m1_days)} days, {m1_quests} quests")
print(f"Month 2: {len(m2_days)} days, {m2_quests} quests")
print(f"Total: {len(m1_days) + len(m2_days)} days, {m1_quests + m2_quests} quests")
