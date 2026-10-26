class AutonomousBiddingControlTower:
    def __init__(self, max_bid_ceiling: float, max_hourly_burn_rate: float):
        self.max_bid_ceiling = max_bid_ceiling
        self.max_hourly_burn_rate = max_hourly_burn_rate
        self.hourly_spend_acc = 0.0
        self.pixel_healthy = True
        self.audit_log: list[str] = []

    def validate_bid(self, raw_bid: float, context: str) -> float:
        if not self.pixel_healthy:
            self.audit_log.append(f"BID_REJECTED: Conversion pixel failure in {context}")
            return 0.0

        if raw_bid > self.max_bid_ceiling:
            clipped_bid = self.max_bid_ceiling
            self.audit_log.append(f"BID_CLIPPED: Raw ${raw_bid:.2f} clipped to ${clipped_bid:.2f} in {context}")
            return clipped_bid

        return raw_bid

    def register_spend(self, amount: float) -> bool:
        if self.hourly_spend_acc + amount > self.max_hourly_burn_rate:
            self.audit_log.append(f"SPEND_THROTTLED: Attempted ${amount:.2f} exceeds burn ceiling")
            return False
        self.hourly_spend_acc += amount
        return True

    def trigger_pixel_health_check(self, observed_conversions: int, expected_minimum: int):
        if observed_conversions < expected_minimum:
            self.pixel_healthy = False
            self.audit_log.append(f"KILLSWITCH_TRIGGERED: Observed convs ({observed_conversions}) below threshold ({expected_minimum})")
        else:
            self.pixel_healthy = True

tower = AutonomousBiddingControlTower(max_bid_ceiling=15.0, max_hourly_burn_rate=500.0)

bids = [8.50, 42.00, 12.00, 14.50]
print("=== AUTONOMOUS BIDDING CONTROL TOWER AUDIT ===")
for idx, b in enumerate(bids):
    approved_bid = tower.validate_bid(b, f"Auction_{idx+1}")
    if approved_bid > 0:
        tower.register_spend(approved_bid * 10)
    print(f"Auction {idx+1}: Proposed Bid = ${b:.2f} -> Approved Bid = ${approved_bid:.2f} (Cumulative Hourly Spend: ${tower.hourly_spend_acc:.2f})")

tower.trigger_pixel_health_check(observed_conversions=0, expected_minimum=5)
rejected_bid = tower.validate_bid(9.00, "Auction_Post_Pixel_Failure")
print(f"Post-Failure Auction: Proposed Bid = $9.00 -> Approved Bid = ${rejected_bid:.2f}")

print("
Control Tower Diagnostic Logs:")
for log in tower.audit_log:
    print(f"  [ALERT] {log}")
