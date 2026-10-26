"""
Deterministic Python test suite for Course 07 Day 47:
Corporate Account Hierarchies, Multi-Tier Approval Workflows & Role-Based Spending Limits
"""
import sys
import json
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Set, Tuple

sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: RECURSIVE CORPORATE ACCOUNT HIERARCHIES ===")
@dataclass
class OrganizationNode:
    node_id: str
    name: str
    node_type: str  # HOLDING, SUBSIDIARY, DIVISION, COST_CENTER
    parent_id: Optional[str] = None
    cost_center_code: Optional[str] = None
    inherited_discount_tier: str = "TIER_1"

class CorporateHierarchyTree:
    def __init__(self):
        self.nodes: Dict[str, OrganizationNode] = {}
        self.children: Dict[str, List[str]] = {}

    def add_node(self, node: OrganizationNode):
        self.nodes[node.node_id] = node
        if node.parent_id:
            self.children.setdefault(node.parent_id, []).append(node.node_id)

    def resolve_lineage(self, node_id: str) -> List[str]:
        path = []
        curr = node_id
        while curr:
            path.append(curr)
            node = self.nodes.get(curr)
            curr = node.parent_id if node else None
        return list(reversed(path))

    def resolve_inherited_tier(self, node_id: str) -> str:
        lineage = self.resolve_lineage(node_id)
        for nid in lineage:
            node = self.nodes[nid]
            if node.inherited_discount_tier != "TIER_1":
                return node.inherited_discount_tier
        return "TIER_1"

tree = CorporateHierarchyTree()
tree.add_node(OrganizationNode("HOLDING-01", "Global Aerospace Corp", "HOLDING", None, inherited_discount_tier="ENTERPRISE_PLATINUM"))
tree.add_node(OrganizationNode("SUB-01", "North America Defense Systems", "SUBSIDIARY", "HOLDING-01"))
tree.add_node(OrganizationNode("DIV-01", "Avionics Propulsion Division", "DIVISION", "SUB-01"))
tree.add_node(OrganizationNode("CC-401", "Jet Propulsion R&D Lab", "COST_CENTER", "DIV-01", cost_center_code="CC-8820-AERO"))

lineage = tree.resolve_lineage("CC-401")
tier = tree.resolve_inherited_tier("CC-401")
print(f"Node: CC-401 | Path: {' -> '.join(lineage)} | Effective Contract Tier: {tier}")


print("\n=== PART 2: ROLE-BASED ACCESS CONTROL (RBAC) & SOD ENGINE ===")
class Permission(Enum):
    BROWSE_CATALOG = "browse_catalog"
    VIEW_PRICING = "view_pricing"
    CREATE_REQUISITION = "create_requisition"
    APPROVE_REQUISITION = "approve_requisition"
    MANAGE_BUDGET = "manage_budget"

@dataclass
class CorporateUser:
    user_id: str
    name: str
    cost_center_id: str
    roles: List[str]
    individual_spending_limit: float

class PolicyDecisionPoint:
    ROLE_PERMISSIONS = {
        "BUYER": {Permission.BROWSE_CATALOG, Permission.VIEW_PRICING, Permission.CREATE_REQUISITION},
        "APPROVER": {Permission.BROWSE_CATALOG, Permission.VIEW_PRICING, Permission.APPROVE_REQUISITION},
        "BUDGET_OWNER": {Permission.BROWSE_CATALOG, Permission.VIEW_PRICING, Permission.APPROVE_REQUISITION, Permission.MANAGE_BUDGET}
    }

    def has_permission(self, user: CorporateUser, permission: Permission) -> bool:
        user_perms: Set[Permission] = set()
        for role in user.roles:
            user_perms.update(self.ROLE_PERMISSIONS.get(role, set()))
        return permission in user_perms

    def check_separation_of_duties(self, requester: CorporateUser, approver: CorporateUser) -> Tuple[bool, str]:
        if requester.user_id == approver.user_id:
            return False, "Violation: Requester cannot approve their own requisition (SOX-404 conflict)"
        if requester.cost_center_id != approver.cost_center_id and "BUDGET_OWNER" not in approver.roles:
            return False, "Violation: Approver lacks jurisdiction over requester cost center"
        return True, "Separation of duties confirmed"

pdp = PolicyDecisionPoint()
buyer = CorporateUser("USR-101", "Jane Doe", "CC-401", ["BUYER"], individual_spending_limit=5000.0)
approver = CorporateUser("USR-202", "Robert Vance", "CC-401", ["APPROVER"], individual_spending_limit=50000.0)

can_create = pdp.has_permission(buyer, Permission.CREATE_REQUISITION)
can_approve = pdp.has_permission(approver, Permission.APPROVE_REQUISITION)
sod_valid, sod_reason = pdp.check_separation_of_duties(buyer, approver)
self_sod, self_reason = pdp.check_separation_of_duties(buyer, buyer)

print(f"Buyer Create: {can_create} | Approver Approve: {can_approve}")
print(f"Peer Approval SoD: {sod_valid} | Reason: {sod_reason}")
print(f"Self Approval SoD: {self_sod} | Reason: {self_reason}")


print("\n=== PART 3: MULTI-TIER APPROVAL ROUTING & BUDGET GUARDS ===")
@dataclass
class Requisition:
    req_id: str
    requester_id: str
    cost_center_id: str
    total_amount: float
    category: str  # OPEX or CAPEX

class MultiTierApprovalRouter:
    TIERS = [
        (5000.0, "AUTO_APPROVED", "Direct PunchOut Auto-Release"),
        (25000.0, "TIER_1_MANAGER", "Department Manager Sign-Off Required"),
        (100000.0, "TIER_2_DIRECTOR", "Procurement Director & Controller Review Required"),
        (float('inf'), "TIER_3_EXECUTIVE", "CFO & Chief Procurement Officer Review Required")
    ]

    def evaluate_routing(self, req: Requisition, cost_center_budget_remaining: float) -> dict:
        if req.total_amount > cost_center_budget_remaining:
            return {
                "req_id": req.req_id,
                "status": "REJECTED_BUDGET_EXCEEDED",
                "required_tier": None,
                "description": f"Requisition exceeds available budget ${cost_center_budget_remaining:,.2f}"
            }

        for limit, tier_name, desc in self.TIERS:
            if req.total_amount <= limit:
                return {
                    "req_id": req.req_id,
                    "status": "PENDING_APPROVAL" if tier_name != "AUTO_APPROVED" else "AUTO_APPROVED",
                    "required_tier": tier_name,
                    "description": desc
                }
        return {"req_id": req.req_id, "status": "UNKNOWN", "required_tier": None, "description": ""}

router = MultiTierApprovalRouter()
req1 = Requisition("REQ-8801", "USR-101", "CC-401", 3450.0, "OPEX")
req2 = Requisition("REQ-8802", "USR-101", "CC-401", 18500.0, "OPEX")
req3 = Requisition("REQ-8803", "USR-101", "CC-401", 145000.0, "CAPEX")

r1 = router.evaluate_routing(req1, cost_center_budget_remaining=250000.0)
r2 = router.evaluate_routing(req2, cost_center_budget_remaining=250000.0)
r3 = router.evaluate_routing(req3, cost_center_budget_remaining=250000.0)
r_fail = router.evaluate_routing(req3, cost_center_budget_remaining=100000.0)

print(f"Req1 ($3,450):  Status={r1['status']} | Tier={r1['required_tier']}")
print(f"Req2 ($18,500): Status={r2['status']} | Tier={r2['required_tier']}")
print(f"Req3 ($145k):   Status={r3['status']} | Tier={r3['required_tier']}")
print(f"Budget Breach:  Status={r_fail['status']} | Msg={r_fail['description']}")


print("\n=== PART 4: DELEGATION OF AUTHORITY (DOA) & ESCALATION STATE MACHINE ===")
@dataclass
class ApprovalTask:
    task_id: str
    req_id: str
    assigned_approver_id: str
    status: str  # PENDING, APPROVED, REJECTED, ESCALATED
    hours_pending: int
    audit_trail: List[str] = field(default_factory=list)

class ApprovalStateMachine:
    def __init__(self, escalation_threshold_hours: int = 48):
        self.threshold = escalation_threshold_hours
        self.delegations: Dict[str, str] = {}  # original_approver -> delegate_approver
        self.escalation_hierarchy: Dict[str, str] = {}  # approver -> manager

    def set_delegation(self, approver_id: str, delegate_id: str):
        self.delegations[approver_id] = delegate_id

    def set_escalation_path(self, approver_id: str, manager_id: str):
        self.escalation_hierarchy[approver_id] = manager_id

    def process_tick(self, task: ApprovalTask) -> ApprovalTask:
        # Check active delegation
        if task.assigned_approver_id in self.delegations:
            proxy = self.delegations[task.assigned_approver_id]
            task.audit_trail.append(f"Delegated from {task.assigned_approver_id} to proxy {proxy}")
            task.assigned_approver_id = proxy

        # Check timeout escalation
        if task.hours_pending >= self.threshold and task.status == "PENDING":
            superior = self.escalation_hierarchy.get(task.assigned_approver_id, "ESCALATION_DESK")
            task.status = "ESCALATED"
            task.audit_trail.append(f"SLA breach ({task.hours_pending}h >= {self.threshold}h): Escalated to {superior}")
            task.assigned_approver_id = superior

        return task

asm = ApprovalStateMachine(escalation_threshold_hours=48)
asm.set_delegation("MGR-202", "PROXY-303")
asm.set_escalation_path("PROXY-303", "DIR-404")

task1 = ApprovalTask("TSK-1", "REQ-8802", "MGR-202", "PENDING", hours_pending=12)
task1 = asm.process_tick(task1)

task2 = ApprovalTask("TSK-2", "REQ-8803", "PROXY-303", "PENDING", hours_pending=52)
task2 = asm.process_tick(task2)

print(f"Task 1: Approver={task1.assigned_approver_id} | Status={task1.status} | Audit={task1.audit_trail}")
print(f"Task 2: Approver={task2.assigned_approver_id} | Status={task2.status} | Audit={task2.audit_trail}")


print("\n=== PART 5: ENTERPRISE B2B ACCOUNT GOVERNANCE DASHBOARD ===")
@dataclass
class CostCenterMetric:
    cost_center_code: str
    allocated_budget: float
    spent_amount: float
    pending_approval_amount: float
    open_approvals_count: int

class AccountGovernanceTower:
    def __init__(self):
        self.metrics: Dict[str, CostCenterMetric] = {}

    def record_cost_center(self, metric: CostCenterMetric):
        self.metrics[metric.cost_center_code] = metric

    def compute_executive_telemetry(self) -> dict:
        total_budget = sum(m.allocated_budget for m in self.metrics.values())
        total_spent = sum(m.spent_amount for m in self.metrics.values())
        total_pipeline = sum(m.pending_approval_amount for m in self.metrics.values())
        total_open_tasks = sum(m.open_approvals_count for m in self.metrics.values())
        
        burn_rate_pct = (total_spent / total_budget * 100.0) if total_budget > 0 else 0.0
        projected_spend = total_spent + total_pipeline
        projected_utilization_pct = (projected_spend / total_budget * 100.0) if total_budget > 0 else 0.0

        return {
            "total_budget": total_budget,
            "total_spent": total_spent,
            "total_pipeline": total_pipeline,
            "total_open_tasks": total_open_tasks,
            "burn_rate_pct": round(burn_rate_pct, 1),
            "projected_utilization_pct": round(projected_utilization_pct, 1)
        }

tower = AccountGovernanceTower()
tower.record_cost_center(CostCenterMetric("CC-8820-AERO", 1500000.0, 850000.0, 145000.0, 4))
tower.record_cost_center(CostCenterMetric("CC-9930-AVIO", 2000000.0, 1100000.0, 220000.0, 7))
tower.record_cost_center(CostCenterMetric("CC-1120-MECH", 800000.0, 320000.0, 45000.0, 2))

telem = tower.compute_executive_telemetry()
print(f"B2B Governance Tower Summary:")
print(f"  Total Corporate Budget:     ${telem['total_budget']:,.2f}")
print(f"  Actual Cleared Spend:       ${telem['total_spent']:,.2f} ({telem['burn_rate_pct']}%)")
print(f"  Pending Approval Pipeline:  ${telem['total_pipeline']:,.2f} ({telem['total_open_tasks']} Open Requisitions)")
print(f"  Projected Budget Burn:      {telem['projected_utilization_pct']}%")
