"""
Deterministic Python Code Blocks for Course 07 Day 56:
Headless Commerce Architecture, BFF (Backend-for-Frontend) Pattern, GraphQL Federation & Composable Edge APIs
"""
import json
import hashlib
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

print("=== PART 1: DECOUPLED HEADLESS API GATEWAY ROUTING ===")
@dataclass
class ClientContext:
    client_id: str
    device_type: str  # 'MOBILE_APP', 'DESKTOP_WEB', 'IOT_SMART_DISPLAY'
    accept_encoding: str
    client_ip: str

@dataclass
class UpstreamServiceTarget:
    service_name: str
    endpoint_url: str
    timeout_ms: int

class HeadlessAPIGatewayRouter:
    def __init__(self):
        self.routes: Dict[str, UpstreamServiceTarget] = {
            "/api/v2/products": UpstreamServiceTarget("catalog-service", "http://catalog.internal.mesh:8080/products", 150),
            "/api/v2/pricing": UpstreamServiceTarget("pricing-engine", "http://pricing.internal.mesh:8081/calculate", 120),
            "/api/v2/cart": UpstreamServiceTarget("cart-state-store", "http://cart.internal.mesh:8082/session", 100),
            "/api/v2/checkout": UpstreamServiceTarget("checkout-orchestrator", "http://checkout.internal.mesh:8083/flow", 300)
        }

    def route_request(self, path: str, ctx: ClientContext) -> Dict[str, str]:
        target = self.routes.get(path)
        if not target:
            return {"status": "404_NOT_FOUND", "message": f"No upstream microservice registered for {path}"}
        
        # Inject enterprise trace header
        trace_seed = f"{ctx.client_id}:{ctx.client_ip}:{path}"
        trace_id = hashlib.sha256(trace_seed.encode('utf-8')).hexdigest()[:16]
        
        return {
            "status": "200_ROUTED",
            "target_service": target.service_name,
            "upstream_url": target.endpoint_url,
            "allocated_timeout_ms": str(target.timeout_ms),
            "device_profile": ctx.device_type,
            "x_correlation_trace_id": f"trace-mesh-{trace_id}"
        }

router = HeadlessAPIGatewayRouter()
ctx_mobile = ClientContext("CLI-M-9912", "MOBILE_APP", "gzip, br", "198.51.100.42")
ctx_web = ClientContext("CLI-W-4401", "DESKTOP_WEB", "gzip, br", "203.0.113.19")

res_mobile = router.route_request("/api/v2/products", ctx_mobile)
res_web = router.route_request("/api/v2/checkout", ctx_web)

print(f"Mobile Route: Service=[{res_mobile['target_service']}] | Trace=[{res_mobile['x_correlation_trace_id']}] | Timeout={res_mobile['allocated_timeout_ms']}ms")
print(f"Desktop Web Route: Service=[{res_web['target_service']}] | Trace=[{res_web['x_correlation_trace_id']}] | Timeout={res_web['allocated_timeout_ms']}ms")


print("\n=== PART 2: BACKEND-FOR-FRONTEND (BFF) PAYLOAD ADAPTATION ===")
@dataclass
class RawProductRecord:
    sku: str
    title: str
    description_full_html: str
    base_price_cents: int
    currency: str
    desktop_gallery_urls: List[str]
    mobile_thumbnail_urls: List[str]
    technical_specifications: Dict[str, str]

class BFFPayloadAdapter:
    @staticmethod
    def adapt_for_client(product: RawProductRecord, device_type: str) -> Dict[str, object]:
        if device_type == "MOBILE_APP":
            # Strip heavyweight HTML descriptions and high-res desktop galleries for bandwidth optimization
            return {
                "sku": product.sku,
                "title": product.title,
                "price": f"{product.base_price_cents / 100:.2f} {product.currency}",
                "images": product.mobile_thumbnail_urls[:2],
                "badge": product.technical_specifications.get("key_feature", "Standard")
            }
        elif device_type == "DESKTOP_WEB":
            # Return full rich payload for desktop high-resolution screens
            return {
                "sku": product.sku,
                "title": product.title,
                "description": product.description_full_html,
                "price": f"{product.base_price_cents / 100:.2f} {product.currency}",
                "gallery": product.desktop_gallery_urls,
                "specs": product.technical_specifications
            }
        else:
            return {"sku": product.sku, "title": product.title}

raw_prod = RawProductRecord(
    sku="PROD-ULTRA-88",
    title="Titanium Enterprise Server Rack Switch",
    description_full_html="<div><p>Enterprise grade 48-port L3 managed switch with dual hot-swap redundant PSUs.</p></div>",
    base_price_cents=450000,
    currency="USD",
    desktop_gallery_urls=["https://cdn.example.com/rack_front_8k.jpg", "https://cdn.example.com/rack_rear_8k.jpg"],
    mobile_thumbnail_urls=["https://cdn.example.com/thumb_120.webp"],
    technical_specifications={"throughput": "1.2 Tbps", "ports": "48x 10GbE SFP+", "key_feature": "Dual-PSU Redundancy"}
)

mobile_payload = BFFPayloadAdapter.adapt_for_client(raw_prod, "MOBILE_APP")
desktop_payload = BFFPayloadAdapter.adapt_for_client(raw_prod, "DESKTOP_WEB")

mobile_bytes = len(json.dumps(mobile_payload))
desktop_bytes = len(json.dumps(desktop_payload))
savings_pct = ((desktop_bytes - mobile_bytes) / desktop_bytes) * 100.0

print(f"Mobile Payload Size:  {mobile_bytes} bytes | Keys: {list(mobile_payload.keys())}")
print(f"Desktop Payload Size: {desktop_bytes} bytes | Keys: {list(desktop_payload.keys())}")
print(f"BFF Bandwidth Reduction: {savings_pct:.1f}% bandwidth saved on mobile")


print("\n=== PART 3: GRAPHQL FEDERATION SUBGRAPH ENTITY RESOLUTION ===")
@dataclass
class FederatedProductKey:
    id: str

class CatalogSubgraph:
    def resolve_product_base(self, key: FederatedProductKey) -> Dict[str, object]:
        catalog_db = {
            "prod-101": {"id": "prod-101", "name": "Acoustic Noise-Cancelling Headphones", "sku": "ANC-PRO-1"}
        }
        return catalog_db.get(key.id, {})

class PricingSubgraph:
    def resolve_product_pricing(self, key: FederatedProductKey, user_tier: str) -> Dict[str, object]:
        pricing_matrix = {
            "prod-101": {"RETAIL": 299.00, "VIP_B2B": 239.00}
        }
        prices = pricing_matrix.get(key.id, {"RETAIL": 0.0, "VIP_B2B": 0.0})
        return {"current_price_usd": prices.get(user_tier, prices["RETAIL"]), "applied_tier": user_tier}

class InventorySubgraph:
    def resolve_product_inventory(self, key: FederatedProductKey) -> Dict[str, object]:
        inventory_db = {
            "prod-101": {"in_stock": True, "available_quantity": 482, "fulfillment_lead_days": 1}
        }
        return inventory_db.get(key.id, {"in_stock": False, "available_quantity": 0, "fulfillment_lead_days": 0})

class FederatedGraphQLGateway:
    def __init__(self):
        self.catalog = CatalogSubgraph()
        self.pricing = PricingSubgraph()
        self.inventory = InventorySubgraph()

    def query_federated_product(self, product_id: str, client_tier: str) -> Dict[str, object]:
        key = FederatedProductKey(product_id)
        base = self.catalog.resolve_product_base(key)
        if not base:
            return {"error": "Product not found"}
        
        # Parallel entity resolution across subgraphs
        pricing_data = self.pricing.resolve_product_pricing(key, client_tier)
        inv_data = self.inventory.resolve_product_inventory(key)
        
        return {
            "id": base["id"],
            "name": base["name"],
            "sku": base["sku"],
            "pricing": pricing_data,
            "inventory": inv_data
        }

gateway = FederatedGraphQLGateway()
federated_result = gateway.query_federated_product("prod-101", "VIP_B2B")

print(f"Federated Query Result for ID: {federated_result['id']}")
print(f"  Product:   {federated_result['name']} [{federated_result['sku']}]")
print(f"  Pricing:   ${federated_result['pricing']['current_price_usd']:.2f} USD ({federated_result['pricing']['applied_tier']})")
print(f"  Inventory: InStock={federated_result['inventory']['in_stock']} (Qty: {federated_result['inventory']['available_quantity']})")


print("\n=== PART 4: EDGE CACHE STALE-WHILE-REVALIDATE & SURROGATE-KEY PURGE ===")
@dataclass
class EdgeCacheEntry:
    content: str
    surrogate_keys: List[str]
    cached_timestamp: float
    max_age_seconds: float
    stale_while_revalidate_seconds: float

class EdgeCDNCacheManager:
    def __init__(self):
        self.cache: Dict[str, EdgeCacheEntry] = {}

    def put(self, uri: str, content: str, keys: List[str], now: float):
        self.cache[uri] = EdgeCacheEntry(content, keys, now, 60.0, 120.0)

    def get(self, uri: str, now: float) -> Tuple[str, Optional[str]]:
        entry = self.cache.get(uri)
        if not entry:
            return "CACHE_MISS", None
        
        age = now - entry.cached_timestamp
        if age <= entry.max_age_seconds:
            return "CACHE_HIT_FRESH", entry.content
        elif age <= (entry.max_age_seconds + entry.stale_while_revalidate_seconds):
            # Return stale content immediately to client while triggering async background refresh
            return "CACHE_HIT_STALE_ASYNC_REFRESH_TRIGGERED", entry.content
        else:
            return "CACHE_EXPIRED", None

    def purge_by_surrogate_key(self, tag: str) -> int:
        purged_count = 0
        uris_to_remove = []
        for uri, entry in self.cache.items():
            if tag in entry.surrogate_keys:
                uris_to_remove.append(uri)
        for uri in uris_to_remove:
            del self.cache[uri]
            purged_count += 1
        return purged_count

cdn = EdgeCDNCacheManager()
cdn.put("/products/anc-pro-1", '{"name": "Headphones", "price": 299.00}', ["product-101", "category-audio"], 1000.0)

status_1, _ = cdn.get("/products/anc-pro-1", 1030.0)  # age 30s <= 60s
status_2, _ = cdn.get("/products/anc-pro-1", 1080.0)  # age 80s: stale-while-revalidate
purged = cdn.purge_by_surrogate_key("product-101")     # Instant purge on price update
status_3, _ = cdn.get("/products/anc-pro-1", 1085.0)  # after purge: miss

print(f"Request at t=30s:  Status=[{status_1}]")
print(f"Request at t=80s:  Status=[{status_2}]")
print(f"Purge Key 'product-101': {purged} URL invalidated instantly")
print(f"Request at t=85s:  Status=[{status_3}]")


print("\n=== PART 5: ENTERPRISE COMPOSABLE HEADLESS GATEWAY COMMAND TOWER ===")
@dataclass
class ComposableGatewayAuditRecord:
    gateway_name: str
    daily_request_volume: int
    edge_cache_hit_rate_pct: float
    p99_latency_ms: float
    mobile_data_saved_terabytes: float
    federated_subgraph_health_pct: float

class ComposableCommerceAuditEngine:
    def audit_architecture_tier(self, record: ComposableGatewayAuditRecord) -> Dict[str, object]:
        score = 0.0
        if record.edge_cache_hit_rate_pct >= 90.0:
            score += 25.0
        if record.p99_latency_ms <= 45.0:
            score += 25.0
        if record.mobile_data_saved_terabytes >= 5.0:
            score += 25.0
        if record.federated_subgraph_health_pct >= 99.9:
            score += 25.0
            
        status = "APEX_COMPOSABLE_ARCHITECTURE_VERIFIED" if score == 100.0 else "SUBOPTIMAL_GATEWAY_PERFORMANCE"
        return {
            "gateway": record.gateway_name,
            "composite_score": score,
            "status": status,
            "daily_volume": f"{record.daily_request_volume:,} requests",
            "p99_latency": f"{record.p99_latency_ms} ms",
            "edge_hit_ratio": f"{record.edge_cache_hit_rate_pct:.1f}%",
            "mobile_data_saved": f"{record.mobile_data_saved_terabytes:.2f} TB"
        }

audit_engine = ComposableCommerceAuditEngine()
audit_input = ComposableGatewayAuditRecord(
    gateway_name="Apex-Composable-Headless-Mesh",
    daily_request_volume=185000000,
    edge_cache_hit_rate_pct=94.2,
    p99_latency_ms=28.5,
    mobile_data_saved_terabytes=12.4,
    federated_subgraph_health_pct=100.0
)

audit_report = audit_engine.audit_architecture_tier(audit_input)
print("=== COMPOSABLE COMMERCE GATEWAY AUDIT REPORT ===")
print(f"Gateway Name:      {audit_report['gateway']}")
print(f"Daily Volume:      {audit_report['daily_volume']}")
print(f"Edge Hit Ratio:    {audit_report['edge_hit_ratio']}")
print(f"P99 Edge Latency:  {audit_report['p99_latency']}")
print(f"Mobile Bandwidth:  {audit_report['mobile_data_saved']} saved/month")
print(f"Composite Score:   {audit_report['composite_score']}/100.0 pts")
print(f"Audit Status:      [{audit_report['status']}]")
