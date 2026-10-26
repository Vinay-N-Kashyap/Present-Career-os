"""
Deterministic Python Code Blocks for Course 07 Day 57:
Global Marketplace SEO, Programmatic Product Catalogs, Edge SSR & Core Web Vitals Optimization
"""
import json
import hashlib
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

print("=== PART 1: PROGRAMMATIC FACETED URL & CANONICAL GENERATOR ===")
@dataclass
class FacetFilterSelection:
    category: str
    brand: Optional[str]
    color: Optional[str]
    size: Optional[str]
    sort_order: str

class ProgrammaticCatalogURLRouter:
    # Whitelist of indexable facet combinations to prevent crawl budget exhaustion
    INDEXABLE_FACET_COMBINATIONS = {
        ("category",),
        ("category", "brand"),
        ("category", "color"),
        ("category", "brand", "color")
    }

    @classmethod
    def generate_seo_meta(cls, selection: FacetFilterSelection, base_domain: str) -> Dict[str, str]:
        active_facets = []
        path_segments = [selection.category.lower()]
        
        if selection.brand:
            active_facets.append("brand")
            path_segments.append(selection.brand.lower().replace(" ", "-"))
        if selection.color:
            active_facets.append("color")
            path_segments.append(selection.color.lower())
        if selection.size:
            active_facets.append("size")
        
        facet_signature = tuple(["category"] + active_facets)
        is_indexable = facet_signature in cls.INDEXABLE_FACET_COMBINATIONS and selection.sort_order == "relevance"
        
        clean_path = "/".join(path_segments)
        canonical_url = f"{base_domain}/shop/{clean_path}"
        
        robots_directive = "index, follow" if is_indexable else "noindex, follow"
        return {
            "canonical_url": canonical_url,
            "robots_directive": robots_directive,
            "is_indexable": str(is_indexable),
            "facet_count": str(len(active_facets))
        }

f_clean = FacetFilterSelection("shoes", "Nike", "Black", None, "relevance")
f_bloated = FacetFilterSelection("shoes", "Nike", "Black", "10.5", "price_asc")

seo_clean = ProgrammaticCatalogURLRouter.generate_seo_meta(f_clean, "https://www.example.com")
seo_bloated = ProgrammaticCatalogURLRouter.generate_seo_meta(f_bloated, "https://www.example.com")

print(f"Clean URL:   Canonical=[{seo_clean['canonical_url']}] | Robots=[{seo_clean['robots_directive']}]")
print(f"Bloated URL: Canonical=[{seo_bloated['canonical_url']}] | Robots=[{seo_bloated['robots_directive']}]")


print("\n=== PART 2: SCHEMA.ORG JSON-LD STRUCTURED DATA BUILDER ===")
@dataclass
class ProductOfferData:
    sku: str
    gtin13: str
    name: str
    brand: str
    price_cents: int
    currency: str
    in_stock: bool
    review_count: int
    rating_value: float

class SchemaJsonLdBuilder:
    @staticmethod
    def build_product_schema(prod: ProductOfferData, url: str) -> Dict[str, object]:
        availability = "https://schema.org/InStock" if prod.in_stock else "https://schema.org/OutOfStock"
        return {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": prod.name,
            "sku": prod.sku,
            "gtin13": prod.gtin13,
            "brand": {"@type": "Brand", "name": prod.brand},
            "offers": {
                "@type": "Offer",
                "url": url,
                "priceCurrency": prod.currency,
                "price": f"{prod.price_cents / 100:.2f}",
                "availability": availability,
                "itemCondition": "https://schema.org/NewCondition"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": str(prod.rating_value),
                "reviewCount": str(prod.review_count)
            }
        }

prod_item = ProductOfferData(
    sku="AIR-MAX-90-BLK",
    gtin13="00888407050012",
    name="Nike Air Max 90 Classic",
    brand="Nike",
    price_cents=13000,
    currency="USD",
    in_stock=True,
    review_count=1420,
    rating_value=4.8
)

schema_dict = SchemaJsonLdBuilder.build_product_schema(prod_item, "https://www.example.com/shop/shoes/nike-air-max-90")
print("JSON-LD Schema Verification:")
print(f"  @type:        {schema_dict['@type']}")
print(f"  Product Name: {schema_dict['name']} (GTIN: {schema_dict['gtin13']})")
print(f"  Price Offer:  ${schema_dict['offers']['price']} {schema_dict['offers']['priceCurrency']} [{schema_dict['offers']['availability'].split('/')[-1]}]")
print(f"  Rating:       {schema_dict['aggregateRating']['ratingValue']}/5.0 ({schema_dict['aggregateRating']['reviewCount']} reviews)")


print("\n=== PART 3: INCREMENTAL STATIC REGENERATION (ISR) SIMULATOR ===")
@dataclass
class StaticPageRecord:
    url_path: str
    html_content: str
    generated_at: float
    revalidate_seconds: float

class IncrementalStaticRegenerationEngine:
    def __init__(self):
        self.page_store: Dict[str, StaticPageRecord] = {}

    def publish_initial_page(self, path: str, html: str, now: float, ttl: float):
        self.page_store[path] = StaticPageRecord(path, html, now, ttl)

    def serve_request(self, path: str, current_time: float) -> Tuple[str, str, bool]:
        record = self.page_store.get(path)
        if not record:
            return "404_NOT_FOUND", "", False
        
        age = current_time - record.generated_at
        if age <= record.revalidate_seconds:
            # Fresh static asset served in sub-5ms
            return "STATIC_EDGE_SERVE_FRESH", record.html_content, False
        else:
            # Stale page served instantly, but asynchronous ISR rebuild queued
            return "STATIC_EDGE_SERVE_STALE_TRIGGER_ISR", record.html_content, True

    def complete_isr_rebuild(self, path: str, new_html: str, current_time: float):
        if path in self.page_store:
            ttl = self.page_store[path].revalidate_seconds
            self.page_store[path] = StaticPageRecord(path, new_html, current_time, ttl)

isr = IncrementalStaticRegenerationEngine()
isr.publish_initial_page("/products/air-max-90", "<html>V1: Price $130</html>", 1000.0, 60.0)

status_1, html_1, trigger_1 = isr.serve_request("/products/air-max-90", 1025.0)  # age 25s <= 60s
status_2, html_2, trigger_2 = isr.serve_request("/products/air-max-90", 1070.0)  # age 70s > 60s -> stale + trigger
isr.complete_isr_rebuild("/products/air-max-90", "<html>V2: Updated Price $119</html>", 1072.0)
status_3, html_3, trigger_3 = isr.serve_request("/products/air-max-90", 1075.0)  # fresh V2

print(f"Request 1 (t=25s): Status=[{status_1}] | HTML=[{html_1}] | RebuildTriggered={trigger_1}")
print(f"Request 2 (t=70s): Status=[{status_2}] | HTML=[{html_2}] | RebuildTriggered={trigger_2}")
print(f"Request 3 (t=75s): Status=[{status_3}] | HTML=[{html_3}] | RebuildTriggered={trigger_3}")


print("\n=== PART 4: CORE WEB VITALS REAL-USER TELEMETRY (RUM) ===")
@dataclass
class UserSessionVitals:
    session_id: str
    lcp_ms: float   # Largest Contentful Paint (Good < 2500ms)
    inp_ms: float   # Interaction to Next Paint (Good < 200ms)
    cls_score: float # Cumulative Layout Shift (Good < 0.1)

class CoreWebVitalsAuditor:
    @staticmethod
    def evaluate_rum_cohort(sessions: List[UserSessionVitals]) -> Dict[str, object]:
        n = len(sessions)
        if n == 0:
            return {"status": "NO_DATA"}
        
        # Calculate 75th percentile (standard Google threshold)
        lcp_p75 = sorted(s.lcp_ms for s in sessions)[int(0.75 * n)]
        inp_p75 = sorted(s.inp_ms for s in sessions)[int(0.75 * n)]
        cls_p75 = sorted(s.cls_score for s in sessions)[int(0.75 * n)]
        
        lcp_pass = lcp_p75 <= 2500.0
        inp_pass = inp_p75 <= 200.0
        cls_pass = cls_p75 <= 0.10
        
        overall_pass = lcp_pass and inp_pass and cls_pass
        return {
            "lcp_p75_ms": round(lcp_p75, 1),
            "lcp_pass": lcp_pass,
            "inp_p75_ms": round(inp_p75, 1),
            "inp_pass": inp_pass,
            "cls_p75": round(cls_p75, 3),
            "cls_pass": cls_pass,
            "google_search_ranking_boost_eligible": overall_pass
        }

cohort = [
    UserSessionVitals("S-01", 1420.0, 65.0, 0.02),
    UserSessionVitals("S-02", 1850.0, 80.0, 0.04),
    UserSessionVitals("S-03", 2100.0, 110.0, 0.03),
    UserSessionVitals("S-04", 2300.0, 145.0, 0.05),
    UserSessionVitals("S-05", 2450.0, 160.0, 0.06),
    UserSessionVitals("S-06", 3100.0, 220.0, 0.12),
    UserSessionVitals("S-07", 1950.0, 95.0, 0.01),
    UserSessionVitals("S-08", 2200.0, 130.0, 0.04),
]

rum_results = CoreWebVitalsAuditor.evaluate_rum_cohort(cohort)
print(f"RUM Cohort P75 Metrics:")
print(f"  Largest Contentful Paint (LCP): {rum_results['lcp_p75_ms']} ms [Pass={rum_results['lcp_pass']}]")
print(f"  Interaction to Next Paint (INP): {rum_results['inp_p75_ms']} ms [Pass={rum_results['inp_pass']}]")
print(f"  Cumulative Layout Shift (CLS):   {rum_results['cls_p75']} [Pass={rum_results['cls_pass']}]")
print(f"  Google Search CWV Ranking Boost: [{rum_results['google_search_ranking_boost_eligible']}]")


print("\n=== PART 5: ENTERPRISE SEO & EDGE RENDERING COMMAND TOWER ===")
@dataclass
class SEOEngineAuditData:
    domain_name: str
    total_indexed_pages: int
    crawl_budget_efficiency_pct: float
    rich_snippet_validity_pct: float
    cwv_passing_urls_pct: float
    organic_search_revenue_usd: float

class EnterpriseSEOAuditEngine:
    def audit_seo_performance(self, audit: SEOEngineAuditData) -> Dict[str, object]:
        score = 0.0
        if audit.crawl_budget_efficiency_pct >= 95.0:
            score += 25.0
        if audit.rich_snippet_validity_pct >= 99.0:
            score += 25.0
        if audit.cwv_passing_urls_pct >= 90.0:
            score += 25.0
        if audit.organic_search_revenue_usd >= 10000000.0:
            score += 25.0
            
        status = "APEX_ENTERPRISE_SEO_CERTIFIED" if score == 100.0 else "SEO_REMEDIATION_REQUIRED"
        return {
            "domain": audit.domain_name,
            "composite_score": score,
            "status": status,
            "indexed_pages": f"{audit.total_indexed_pages:,} URLs",
            "crawl_efficiency": f"{audit.crawl_budget_efficiency_pct:.1f}%",
            "rich_snippets": f"{audit.rich_snippet_validity_pct:.1f}%",
            "cwv_passing_rate": f"{audit.cwv_passing_urls_pct:.1f}%",
            "organic_revenue": f"${audit.organic_search_revenue_usd:,.2f} USD"
        }

seo_auditor = EnterpriseSEOAuditEngine()
audit_input = SEOEngineAuditData(
    domain_name="marketplace.apex-retail.com",
    total_indexed_pages=2450000,
    crawl_budget_efficiency_pct=98.5,
    rich_snippet_validity_pct=100.0,
    cwv_passing_urls_pct=94.8,
    organic_search_revenue_usd=18450000.00
)

seo_report = seo_auditor.audit_seo_performance(audit_input)
print("=== ENTERPRISE SEO & EDGE RENDERING AUDIT REPORT ===")
print(f"Domain Audited:    {seo_report['domain']}")
print(f"Indexed Pages:     {seo_report['indexed_pages']}")
print(f"Crawl Efficiency:  {seo_report['crawl_efficiency']}")
print(f"Rich Snippet Rate: {seo_report['rich_snippets']}")
print(f"CWV Passing Rate:  {seo_report['cwv_passing_rate']}")
print(f"Organic Revenue:   {seo_report['organic_revenue']}")
print(f"Composite Score:   {seo_report['composite_score']}/100.0 pts")
print(f"Audit Status:      [{seo_report['status']}]")
