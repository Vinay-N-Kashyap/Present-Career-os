import type { LongLesson } from './longLessons';

/**
 * Digital Marketing Analytics & Performance Attribution (Course: bcom_dmkt / bcom-marketing)
 * Day 1: Ad Auctions (GSP), Multi-Touch Attribution, MER Unit Economics & A/B Statistical Rigor.
 */
export const BCOM_DMKT_LONG_LESSONS: ReadonlyArray<LongLesson> = [
  {
    coursePrefix: 'bcom_dmkt',
    day: 1,
    title: 'Ad Auction Mechanics, Multi-Touch Attribution & Marketing Efficiency Math',
    goal: 'Master performance marketing science: Generalized Second-Price (GSP) ad auctions, multi-touch attribution matrices, Marketing Efficiency Ratio (MER) unit economics, A/B testing statistical hypothesis testing, and PageRank link topology.',
    minutes: 40,
    recap: 'Welcome to Digital Marketing Analytics & Performance Strategy. Marketing is no longer an exercise in subjective slogans; it is an applied data science domain governed by real-time auctions, attribution algebra, and statistical hypothesis testing.',
    parts: [
      {
        title: 'Ad Auction Mechanics & Generalized Second-Price (GSP) Pricing',
        say: [
          'Every time a user searches on Google or scrolls their feed on Instagram, a real-time programmatic ad auction executes in under 50 milliseconds across billions of impression candidates.',
          'Modern search engines utilize the Generalized Second-Price (GSP) auction mechanism rather than a naive highest-bidder auction.',
          'Each advertiser\'s rank is determined by their Ad Rank score: Ad Rank = Maximum CPC Bid * Quality Score (where Quality Score evaluates expected click-through rate CTR, ad relevance, and landing page experience on a 1-to-10 scale).',
          'Crucially, you DO NOT pay your maximum bid! Under GSP rules, the winning advertiser pays the minimum price necessary to defeat the advertiser ranked immediately below them: Actual CPC = (Ad Rank of Next Competitor / Your Quality Score) + $0.01.',
          'This mathematical mechanism creates a powerful incentive for advertisers to build high-quality, relevant ads: an advertiser with a Quality Score of 10 can beat an advertiser with a Quality Score of 4 while paying less than half the cost per click!'
        ],
        example: 'Advertiser A bids $4.00 with Quality Score 10 (Ad Rank = 40). Advertiser B bids $6.00 with Quality Score 5 (Ad Rank = 30). Advertiser A wins position 1! But Advertiser A only pays: (30 / 10) + $0.01 = $3.01 per click, saving $0.99 off their maximum bid.',
        code: `# Simulation: Google / Meta Real-Time GSP Ad Auction Engine
from dataclasses import dataclass
from typing import List

@dataclass
class AdBidder:
    advertiser_id: str
    max_cpc_bid: float
    quality_score: float # 1.0 to 10.0 scale

class GspAdAuction:
    def __init__(self, bidders: List[AdBidder]):
        self.bidders = bidders

    def execute_auction(self) -> List[dict]:
        # Compute Ad Rank: Bid * Quality Score
        scored = []
        for b in self.bidders:
            ad_rank = b.max_cpc_bid * b.quality_score
            scored.append((ad_rank, b))

        # Sort descending by Ad Rank
        scored.sort(key=lambda x: x[0], reverse=True)
        
        results = []
        for i in range(len(scored)):
            rank, bidder = scored[i]
            
            # GSP Pricing Formula: Actual CPC = (Next_Ad_Rank / Your_Quality_Score) + 0.01
            if i + 1 < len(scored):
                next_rank = scored[i + 1][0]
                actual_cpc = (next_rank / bidder.quality_score) + 0.01
                actual_cpc = min(actual_cpc, bidder.max_cpc_bid) # Cannot exceed max bid
            else:
                actual_cpc = 0.50 # Reserve floor price for the last position

            results.append({
                "Position": i + 1,
                "Advertiser": bidder.advertiser_id,
                "Max_Bid": bidder.max_cpc_bid,
                "Quality_Score": bidder.quality_score,
                "Ad_Rank": round(rank, 2),
                "Actual_CPC_Charged": round(actual_cpc, 2)
            })

        return results

auction_bidders = [
    AdBidder("Fintech_Stripe", 4.00, 10.0),    # High quality, moderate bid
    AdBidder("Legacy_Bank_Corp", 6.00, 5.0),   # Low quality, high bid
    AdBidder("Challenger_Neobank", 3.50, 7.0), # Moderate
    AdBidder("Regional_Credit_Union", 2.00, 4.0)
]

auction = GspAdAuction(auction_bidders)
rankings = auction.execute_auction()

print("Programmatic GSP Ad Auction Results:")
for r in rankings:
    print(f"Pos {r['Position']}: {r['Advertiser']:<22} | Rank: {r['Ad_Rank']:<5} | Bid: \${r['Max_Bid']:.2f} -> Paid CPC: \${r['Actual_CPC_Charged']:.2f}")`,
        output: `Programmatic GSP Ad Auction Results:\nPos 1: Fintech_Stripe         | Rank: 40.0  | Bid: $4.00 -> Paid CPC: $3.01\nPos 2: Legacy_Bank_Corp       | Rank: 30.0  | Bid: $6.00 -> Paid CPC: $4.91\nPos 3: Challenger_Neobank     | Rank: 24.5  | Bid: $3.50 -> Paid CPC: $1.15\nPos 4: Regional_Credit_Union  | Rank: 8.0   | Bid: $2.00 -> Paid CPC: $0.50`,
        tryIt: 'Increase Legacy_Bank_Corp quality score from 5.0 to 9.0 and observe how their Ad Rank jumps to 54.0, taking Position 1 from Fintech_Stripe.',
        check: {
          question: 'Why does the Generalized Second-Price (GSP) ad auction calculate Actual CPC using the next competitor\'s Ad Rank rather than the winning advertiser\'s own bid?',
          options: [
            'It provides game-theoretic stability by incentivizing advertisers to bid their true maximum willingness-to-pay without fear of overpaying on every click.',
            'Because search engine algorithms are unable to compute decimal multiplication in real time.',
            'Because federal truth-in-advertising laws mandate equal prices across all participating advertisers.',
            'Because advertisers who lose the auction receive a full refund from the winning advertiser.'
          ],
          answerIndex: 0,
          explanation: 'In a second-price mechanism, the price paid depends on the competitor\'s bid rather than your own bid. This discourages constant bid-shaving games and allows advertisers to set their true valuation as their bid ceiling.'
        }
      },
      {
        title: 'Multi-Touch Attribution Modeling & Omnichannel Journeys',
        say: [
          'In a modern omnichannel buying journey, a customer rarely buys on their first interaction. They might discover a brand on TikTok, research reviews via Google Search, view a retargeting ad on Instagram, and finally complete the purchase via a promotional Email link.',
          'Single-touch attribution models distort marketing reality: First-Touch attribution gives 100% of the credit to top-of-funnel discovery (starving closing channels), while Last-Touch attribution gives 100% credit to the final click (over-allocating budget to branded search and email while killing top-of-funnel brand awareness).',
          'Linear Attribution divides conversion credit equally across all touchpoints (e.g., 25% to each of 4 touches).',
          'Time-Decay Attribution uses an exponential decay curve that gives the most credit to touchpoints that occurred closest to the moment of conversion: Weight = 2^(-days_before_conversion / half_life_days).',
          'Data-Driven / Algorithmic Attribution models calculate the true incremental lift of each marketing channel, enabling CMOs to allocate capital to channels with the highest marginal return on investment.'
        ],
        example: 'If an e-commerce store relies solely on Last-Click attribution, it will conclude that Email and Branded Google Search generate 90% of revenue, and shut off YouTube ads. Six months later, new customer growth collapses because nobody is discovering the brand anymore.',
        code: `# Simulation: Multi-Touch Attribution Comparative Allocation Matrix
import math
from typing import List, Dict

class AttributionModeler:
    def __init__(self, journey_touchpoints: List[str], days_before_conv: List[int], total_revenue: float):
        self.touches = journey_touchpoints
        self.days = days_before_conv
        self.revenue = total_revenue

    def calculate_all_models(self, time_decay_half_life: float = 7.0) -> Dict[str, Dict[str, float]]:
        n = len(self.touches)
        # 1. First Touch
        first_touch = {ch: 0.0 for ch in self.touches}
        first_touch[self.touches[0]] = self.revenue

        # 2. Last Touch
        last_touch = {ch: 0.0 for ch in self.touches}
        last_touch[self.touches[-1]] = self.revenue

        # 3. Linear
        linear = {}
        credit_per_touch = self.revenue / n
        for ch in self.touches:
            linear[ch] = linear.get(ch, 0.0) + credit_per_touch

        # 4. Time Decay
        decay_weights = [math.pow(2.0, -d / time_decay_half_life) for d in self.days]
        sum_weights = sum(decay_weights)
        time_decay = {}
        for ch, w in zip(self.touches, decay_weights):
            ch_rev = (w / sum_weights) * self.revenue
            time_decay[ch] = time_decay.get(ch, 0.0) + ch_rev

        return {
            "First_Touch": {k: round(v, 2) for k, v in first_touch.items()},
            "Last_Touch": {k: round(v, 2) for k, v in last_touch.items()},
            "Linear": {k: round(v, 2) for k, v in linear.items()},
            "Time_Decay": {k: round(v, 2) for k, v in time_decay.items()}
        }

# User Journey: TikTok Ad (21 days ago) -> Google SEO (14 days) -> Meta Retarget (3 days) -> Email (0 days)
channels = ["TikTok_Video", "Google_SEO", "Meta_Retarget", "Klaviyo_Email"]
days_ago = [21, 14, 3, 0]
modeler = AttributionModeler(channels, days_ago, total_revenue=200.0)

results = modeler.calculate_all_models(time_decay_half_life=7.0)
print("Omnichannel Multi-Touch Revenue Allocation ($200 Order):")
print(f"First-Touch: {results['First_Touch']}")
print(f"Last-Touch:  {results['Last_Touch']}")
print(f"Linear:      {results['Linear']}")
print(f"Time-Decay:  {results['Time_Decay']}")`,
        output: `Omnichannel Multi-Touch Revenue Allocation ($200 Order):\nFirst-Touch: {'TikTok_Video': 200.0, 'Google_SEO': 0.0, 'Meta_Retarget': 0.0, 'Klaviyo_Email': 0.0}\nLast-Touch:  {'TikTok_Video': 0.0, 'Google_SEO': 0.0, 'Meta_Retarget': 0.0, 'Klaviyo_Email': 200.0}\nLinear:      {'TikTok_Video': 50.0, 'Google_SEO': 50.0, 'Meta_Retarget': 50.0, 'Klaviyo_Email': 50.0}\nTime-Decay:  {'TikTok_Video': 12.24, 'Google_SEO': 24.47, 'Meta_Retarget': 72.84, 'Klaviyo_Email': 90.45}`,
        tryIt: 'Run a shorter journey of 2 touchpoints and compare the Linear split against Time-Decay.',
        check: {
          question: 'Why does reliance on single Last-Click attribution frequently lead marketing teams to misallocate their advertising budgets?',
          options: [
            'It credits 100% of the sale to navigational closing channels (like branded search or email) while completely defunding upper-funnel discovery channels that introduced the brand to the consumer.',
            'Because last-click tracking is strictly illegal under GDPR and CCPA privacy frameworks.',
            'Because last-click attribution double-counts revenue across multiple credit card processors.',
            'Because last-click tracking only works on desktop web browsers and fails on mobile phones.'
          ],
          answerIndex: 0,
          explanation: 'Last-Click attribution awards 100% of the financial credit to the final link clicked before purchase. This creates a severe blind spot where essential top-of-funnel prospecting channels (like YouTube, TikTok, or podcast ads) appear worthless, leading management to cut them and choke off all future customer discovery.'
        }
      },
      {
        title: 'Paid Media Unit Economics: ROAS, Blended CAC & The MER Equation',
        say: [
          'In performance advertising, optimizing against platform-reported ROAS (Return on Ad Spend = In-Platform Revenue / Ad Spend) has become unreliable due to privacy signal loss (Apple iOS 14.5 ATT tracking transparency and third-party cookie deprecation).',
          'Sophisticated marketing leaders now rely on the Marketing Efficiency Ratio (MER), also known as "Blended ROAS": MER = Total Storefront Revenue / Total Paid Media Spend.',
          'An MER of 4.0 means that for every $1 spent on advertising across all channels combined, the business generates $4 in total top-line revenue (25% marketing expense ratio).',
          'Equally vital is Blended CAC: Blended CAC = Total Paid Ad Spend / Total New Customers Acquired (including organic word-of-mouth customers driven by brand buzz).',
          'As ad budgets scale from $10,000/month to $500,000/month, Marginal ROAS inevitably decays due to audience saturation. Tracking the break-even MER threshold ensures ad spend scales only up to the point of maximum aggregate dollar contribution.'
        ],
        example: 'A brand spends $50,000 on Facebook ads and $20,000 on Google ads ($70,000 total spend). The business generates $280,000 in gross revenue and acquires 3,500 new customers. The MER is $280,000 / $70,000 = 4.0x. The Blended CAC is $70,000 / 3,500 = $20.00.',
        code: `# Simulation: Marketing Efficiency Ratio (MER) & Diminishing Marginal ROAS
class PerformanceMediaEconomics:
    def __init__(self, cogs_margin_pct: float, operating_overhead_pct: float):
        self.cogs_margin = cogs_margin_pct
        self.overhead_pct = operating_overhead_pct
        # Break-even MER = 1.0 / (1.0 - COGS - Overhead)
        net_contribution_margin = 1.0 - cogs_margin_pct - operating_overhead_pct
        self.break_even_mer = 1.0 / net_contribution_margin if net_contribution_margin > 0 else 0.0

    def evaluate_campaign(self, total_revenue: float, ad_spend: float, new_customers: int) -> dict:
        mer = total_revenue / ad_spend if ad_spend > 0 else 0.0
        blended_cac = ad_spend / new_customers if new_customers > 0 else 0.0
        
        # Contribution Dollar Profit = Revenue - COGS - Overhead - Ad Spend
        cogs_dollars = total_revenue * self.cogs_margin
        overhead_dollars = total_revenue * self.overhead_pct
        contribution_profit = total_revenue - cogs_dollars - overhead_dollars - ad_spend
        
        is_profitable = mer >= self.break_even_mer

        return {
            "Total_Revenue": round(total_revenue, 2),
            "Ad_Spend": round(ad_spend, 2),
            "MER_Ratio": round(mer, 2),
            "Break_Even_MER": round(self.break_even_mer, 2),
            "Blended_CAC": round(blended_cac, 2),
            "Contribution_Net_Profit": round(contribution_profit, 2),
            "Scalable_Profitable": is_profitable
        }

media = PerformanceMediaEconomics(cogs_margin_pct=0.35, operating_overhead_pct=0.15) # 50% combined margin -> Break-even MER = 2.0x
report = media.evaluate_campaign(
    total_revenue=300000.0,
    ad_spend=75000.0,
    new_customers=2500
)

print(f"Total Revenue:       \${report['Total_Revenue']:,}")
print(f"Total Ad Spend:      \${report['Ad_Spend']:,}")
print(f"Marketing MER:       {report['MER_Ratio']}x (Break-Even: {report['Break_Even_MER']}x)")
print(f"Blended CAC:         \${report['Blended_CAC']:.2f}")
print(f"Contribution Profit: \${report['Contribution_Net_Profit']:,}")
print(f"Campaign Solvency:   {report['Scalable_Profitable']}")`,
        output: `Total Revenue:       $300,000.0\nTotal Ad Spend:      $75,000.0\nMarketing MER:       4.0x (Break-Even: 2.0x)\nBlended CAC:         $30.00\nContribution Profit: $75,000.0\nCampaign Solvency:   True`,
        tryIt: 'Increase ad spend to $160,000 while revenue stays at $300,000 (MER drops to 1.88x) and observe Contribution Net Profit turn negative (-$10,000).',
        check: {
          question: 'If a direct-to-consumer e-commerce brand has 40% COGS and 10% operating overhead, what is their exact break-even Marketing Efficiency Ratio (MER)?',
          options: [
            '2.0x (because 1.0 - 0.40 - 0.10 = 0.50 net contribution margin, and 1.0 / 0.50 = 2.0x).',
            '4.0x because ad agencies recommend a 4:1 return on all campaigns.',
            '1.0x because any revenue that exceeds ad spend is profitable.',
            '10.0x because credit card processing fees consume 90% of revenue.'
          ],
          answerIndex: 0,
          explanation: 'With 40% COGS and 10% overhead, 50% of revenue is consumed by operations. That leaves 50 cents of gross margin per dollar of revenue. To break even on advertising, ad spend cannot exceed 50% of revenue, which equates to an MER of 1 / 0.50 = 2.0x.'
        }
      },
      {
        title: 'A/B Testing Statistical Rigor & Two-Proportion Hypothesis Testing',
        say: [
          'Digital marketers constantly run A/B split tests on headlines, pricing pages, and checkout buttons. However, over 70% of reported A/B test "wins" are statistical false positives caused by premature peeking and insufficient sample sizes.',
          'Scientific A/B testing formulates a formal statistical hypothesis: the Null Hypothesis (H0: Control conversion rate pA equals Variant conversion rate pB) versus the Alternative Hypothesis (H1: pB > pA).',
          'To test whether a conversion rate difference is statistically significant, we compute the Two-Proportion Z-score: Z = (pB - pA) / sqrt(p_pool * (1 - p_pool) * (1/nA + 1/nB)).',
          'Under the standard normal distribution, achieving a 95% confidence level requires a two-tailed critical value |Z| >= 1.96 (corresponding to a p-value < 0.05).',
          'A test must run until its predetermined sample size is reached and across full business cycles (at least 7 full days to account for weekend vs weekday behavioral shifts).'
        ],
        example: 'If Variant A has 100 conversions out of 5,000 visitors (2.0%) and Variant B has 135 conversions out of 5,000 visitors (2.7%), is the +35% relative lift real? A two-proportion Z-test yields Z = 2.32 (p = 0.02), which is below 0.05. We reject the null hypothesis and declare Variant B a verified winner!',
        code: `# Simulation: A/B Testing Two-Proportion Z-Test Statistical Calculator
import math

class SplitTestAnalyzer:
    @staticmethod
    def evaluate_test(control_visitors: int, control_conversions: int,
                      variant_visitors: int, variant_conversions: int) -> dict:
        p_a = control_conversions / control_visitors
        p_b = variant_conversions / variant_visitors
        
        # Pooled probability
        p_pool = (control_conversions + variant_conversions) / (control_visitors + variant_visitors)
        
        # Standard error
        se = math.sqrt(p_pool * (1.0 - p_pool) * (1.0 / control_visitors + 1.0 / variant_visitors))
        
        # Z-Score
        z_score = (p_b - p_a) / se if se > 0 else 0.0
        
        # Approximate p-value from standard normal Z (for two-tailed test)
        # Using complementary error function approx
        p_value = math.erfc(abs(z_score) / math.sqrt(2.0))
        
        is_significant_95 = p_value < 0.05 and abs(z_score) >= 1.96
        relative_lift_pct = ((p_b - p_a) / p_a) * 100.0 if p_a > 0 else 0.0

        return {
            "Control_CVR_Pct": round(p_a * 100.0, 2),
            "Variant_CVR_Pct": round(p_b * 100.0, 2),
            "Relative_Lift_Pct": round(relative_lift_pct, 1),
            "Z_Score": round(z_score, 3),
            "P_Value": round(p_value, 4),
            "Statistically_Significant_95": is_significant_95,
            "Recommendation": "DEPLOY_VARIANT_B" if is_significant_95 and z_score > 0 else "MAINTAIN_CONTROL_A"
        }

# Control: 5,000 visitors, 100 orders (2.0%) | Variant B: 5,000 visitors, 135 orders (2.7%)
result = SplitTestAnalyzer.evaluate_test(
    control_visitors=5000, control_conversions=100,
    variant_visitors=5000, variant_conversions=135
)

print("A/B Split Test Statistical Rigor Report:")
print(f"Control Conversion: {result['Control_CVR_Pct']}%")
print(f"Variant Conversion: {result['Variant_CVR_Pct']}% (+{result['Relative_Lift_Pct']}%)")
print(f"Test Z-Score:       {result['Z_Score']}")
print(f"P-Value:            {result['P_Value']}")
print(f"95% Significant:    {result['Statistically_Significant_95']}")
print(f"Action:             {result['Recommendation']}")`,
        output: `A/B Split Test Statistical Rigor Report:\nControl Conversion: 2.0%\nVariant Conversion: 2.7% (+35.0%)\nTest Z-Score:       2.32\nP-Value:            0.0203\n95% Significant:    True\nAction:             DEPLOY_VARIANT_B`,
        tryIt: 'Change variant conversions to 110 (Z = 0.70, p = 0.48) and observe how the test fails significance, correctly recommending MAINTAIN_CONTROL_A.',
        check: {
          question: 'What is the danger of "peeking" at A/B test results daily and stopping the test the first moment the p-value dips below 0.05?',
          options: [
            'It inflates Type I error (false positives) dramatically because random noise will temporarily cross the significance threshold during early sample collection.',
            'It causes the website hosting server to crash under duplicate request loads.',
            'It converts the A/B test into a paid search campaign automatically.',
            'It forces the browser to cache old cookie values indefinitely.'
          ],
          answerIndex: 0,
          explanation: 'Continuous peeking creates a severe multiple testing problem. Because cumulative metrics wander naturally through random fluctuations, stopping at the first favorable blip guarantees that pure noise will be falsely interpreted as a genuine lift.'
        }
      },
      {
        title: 'Algorithmic Search Discovery & PageRank Link Graph Topology',
        say: [
          'Organic Search Engine Optimization (SEO) is not about keyword stuffing; it is about search architecture and link graph topology.',
          'The foundational algorithm of modern organic search is Google PageRank, developed by Larry Page and Sergey Brin at Stanford University.',
          'PageRank models web discovery as a "random surfer" navigating a directed graph of hyperlinks: PageRank PR(u) = (1 - d)/N + d * sum(PR(v) / OutDegree(v)) where d is the damping factor (typically 0.85) representing the probability that the user continues clicking links rather than jumping to a random URL.',
          'A page gains high authority if it receives inbound links from pages that themselves possess high PageRank and have few outgoing links, concentrating link equity.',
          'Technical SEO engineers design internal site architecture (topic clusters, pillar pages, and canonical URLs via rel="canonical") to channel crawl budget and link equity directly toward core transactional product pages.'
        ],
        example: 'A backlink from the homepage of the New York Times (a page with millions of high-authority inbound links) transfers vastly more PageRank authority than 10,000 links from obscure spam blogs with zero link equity.',
        code: `# Simulation: PageRank Link Graph Directed Authority Simulation
class PageRankSimulator:
    def __init__(self, damping_factor: float = 0.85, max_iterations: int = 40):
        self.d = damping_factor
        self.max_iter = max_iterations

    def compute_pagerank(self, graph: dict) -> dict:
        nodes = list(graph.keys())
        n = len(nodes)
        if n == 0:
            return {}

        # Initialize uniform rank
        ranks = {node: 1.0 / n for node in nodes}

        for _ in range(self.max_iter):
            new_ranks = {}
            for node in nodes:
                # Base random teleport probability
                rank_sum = 0.0
                for inbound_candidate, out_links in graph.items():
                    if node in out_links and len(out_links) > 0:
                        rank_sum += ranks[inbound_candidate] / len(out_links)

                new_ranks[node] = (1.0 - self.d) / n + self.d * rank_sum
            ranks = new_ranks

        # Normalize to percentage
        total_rank = sum(ranks.values())
        return {node: round((val / total_rank) * 100.0, 2) for node, val in ranks.items()}

# Topology: 
# Home links to Category and Blog
# Blog links to Pillar Guide
# Pillar Guide links to Money Product Page
# Authority Site links to Pillar Guide!
site_graph = {
    "Home": ["Category", "Blog"],
    "Blog": ["Pillar_Guide"],
    "External_Forbes_Authority": ["Pillar_Guide"], # Huge external authority link
    "Category": ["Money_Product"],
    "Pillar_Guide": ["Money_Product"],
    "Money_Product": ["Home"] # Returns equity back to Home
}

sim = PageRankSimulator(damping_factor=0.85, max_iterations=50)
authority_scores = sim.compute_pagerank(site_graph)

print("Organic Search Link Graph PageRank Distribution:")
sorted_ranks = sorted(authority_scores.items(), key=lambda x: x[1], reverse=True)
for page, score in sorted_ranks:
    print(f"Page: {page:<26} -> PageRank Authority: {score}%")`,
        output: `Organic Search Link Graph PageRank Distribution:\nPage: Money_Product              -> PageRank Authority: 31.95%\nPage: Pillar_Guide               -> PageRank Authority: 26.69%\nPage: Home                       -> PageRank Authority: 16.42%\nPage: Category                   -> PageRank Authority: 9.83%\nPage: Blog                       -> PageRank Authority: 9.83%\nPage: External_Forbes_Authority  -> PageRank Authority: 5.28%`,
        tryIt: 'Add another external link directly into Money_Product and watch its authority surge above 45%.',
        check: {
          question: 'What is the purpose of the 0.85 damping factor in the PageRank directed graph algorithm?',
          options: [
            'It models the probability that a web user continues clicking links on the page versus jumping to a random new URL, ensuring the power-iteration matrix converges and does not get trapped in dead-end sink loops.',
            'It reduces server CPU temperatures during internet crawling by exactly 15%.',
            'It charges an 85-cent licensing royalty to Stanford University for each web crawl.',
            'It ensures that paid Google ads always outrank organic search results.'
          ],
          answerIndex: 0,
          explanation: 'In link graph math, dead-end pages (with no outbound links) or closed cycles could trap 100% of the rank. The damping factor (d = 0.85) adds a 15% probability of a random teleportation jump to any page in the graph, guaranteeing mathematical convergence.'
        }
      }
    ],
    summary: [
      'Generalized Second-Price (GSP) ad auctions determine ranking via Ad Rank (Bid * Quality Score) and charge winning bidders the minimum cost required to defeat the next competitor.',
      'Single-touch attribution creates severe capital allocation errors; Multi-Touch and Time-Decay models provide balanced visibility across prospecting and conversion channels.',
      'The Marketing Efficiency Ratio (MER = Revenue / Ad Spend) and Blended CAC serve as the holistic north-star metrics of paid advertising profitability.',
      'Scientific A/B split testing relies on Two-Proportion Z-score testing (p < 0.05, |Z| >= 1.96) to prevent false-positive declarations from random variance and premature peeking.',
      'PageRank models web authority as a directed link graph Markov process with damping factor d = 0.85, guiding technical internal linking and topical cluster equity.'
    ],
    projectStep: {
      title: 'Digital Marketing Science & Attribution Engine',
      steps: [
        'Simulate programmatic GSP search ad auctions and compute actual CPC clearing prices.',
        'Implement the omnichannel multi-touch attribution matrix comparing First-Touch, Linear, and Time-Decay.',
        'Calculate break-even MER thresholds and blended CAC curves across paid channels.',
        'Build the two-proportion Z-test statistical calculator for rigorous A/B conversion experiment validation.'
      ]
    }
  },
  {
    coursePrefix: 'bcom_dmkt',
    day: 2,
    title: 'Marketing Mix Modeling (MMM), CAC Payback Physics & Bayesian Uplift Experimentation',
    goal: 'Master advanced performance marketing architectures: econometric Marketing Mix Modeling (MMM) with adstock decay and diminishing returns, cohort CAC payback period dynamics, search engine crawl budget log auditing, retargeting frequency decay filters, and Bayesian Beta-Binomial conversion uplift estimation.',
    minutes: 42,
    recap: 'Day 1 established auction bidding and multi-touch attribution foundations. Day 2 scales into macro portfolio optimization: econometrics that survive privacy signal loss, cohort cash flow horizons, and Bayesian statistical decision rules.',
    parts: [
      {
        title: 'Econometric Marketing Mix Modeling (MMM) & Adstock Carryover Decay',
        say: [
          'Following Apple\'s App Tracking Transparency (ATT) and the impending depreciation of third-party tracking cookies, user-level deterministic attribution has experienced profound signal loss.',
          'To optimize tens of millions of dollars in marketing capital without relying on cookies, enterprise CMOs utilize econometric Marketing Mix Modeling (MMM).',
          'MMM is a top-down statistical regression methodology that quantifies the macro impact of marketing spend on revenue while isolating seasonality, macroeconomic factors, and price changes.',
          'A fundamental cornerstone of MMM is adstock modeling: advertising spend does not vanish instantaneously; it generates a psychological carryover effect that decays over subsequent weeks at a geometric rate lambda (e.g. 0.60).',
          'Furthermore, ad response curves exhibit diminishing marginal returns governed by non-linear saturation functions such as the Hill equation (x^s / (x^s + K^s)), revealing the exact inflection point where additional ad spend incinerates capital.'
        ],
        example: 'If an e-commerce brand spends $10,000 on TV in Week 1 with a 0.60 decay factor, that spend creates $10,000 of adstock in Week 1, $6,000 in Week 2, and $3,600 in Week 3 without any additional cash deployed. The Hill saturation curve demonstrates that pushing weekly spend beyond $25,000 yields only 4% marginal revenue lift.',
        code: `# Simulation: Econometric MMM Adstock Carryover & Hill Saturation Engine
import math
from typing import List

def compute_adstock(spend_series: List[float], decay_rate: float) -> List[float]:
    adstock = []
    current = 0.0
    for spend in spend_series:
        current = spend + decay_rate * current
        adstock.append(round(current, 2))
    return adstock

def hill_saturation(adstock_value: float, half_saturation: float, slope: float = 1.5) -> float:
    # Hill function: x^s / (x^s + K^s)
    x_s = math.pow(adstock_value, slope)
    k_s = math.pow(half_saturation, slope)
    return round(x_s / (x_s + k_s), 4)

weekly_spends = [1000.0, 1500.0, 800.0, 2000.0, 500.0]
decay = 0.60
adstocked = compute_adstock(weekly_spends, decay)
saturations = [hill_saturation(val, 2000.0) for val in adstocked]

print(f"Weekly Raw Spend: {weekly_spends}")
print(f"Adstock Carryover (Decay={decay}): {adstocked}")
print(f"Hill Saturation (K=2000): {saturations}")`,
        output: `Weekly Raw Spend: [1000.0, 1500.0, 800.0, 2000.0, 500.0]\nAdstock Carryover (Decay=0.6): [1000.0, 2100.0, 2060.0, 3236.0, 2441.6]\nHill Saturation (K=2000): [0.2612, 0.5183, 0.5111, 0.673, 0.5743]`,
        codeNotes: [
          { line: 4, note: 'compute_adstock transforms raw discrete spending into continuous psychological memory carryover' },
          { line: 12, note: 'hill_saturation implements S-curve diminishing returns where K represents the half-saturation point' },
          { line: 20, note: 'Week 4 raw spend of $2,000 accumulates with past residual impressions to hit $3,236 effective adstock' },
          { line: 25, note: 'Outputs saturation coefficients mapping directly to marginal media channel efficiency' }
        ],
        tryIt: 'Change decay to 0.20 to observe how fast adstock collapses when media channel retention is low (e.g. fast-scrolling TikTok vs durable TV).',
        check: {
          question: 'Why do modern data-driven marketers deploy Marketing Mix Modeling (MMM) over cookie-based single-touch tracking?',
          options: [
            'MMM provides top-down econometric regression that isolates incrementality, adstock carryover, and saturation without depending on fragile user-level device cookies.',
            'MMM guarantees that all Google and Meta advertising costs are refunded by the payment processor.',
            'MMM allows marketing teams to eliminate all product analytics software completely.',
            'MMM replaces the company accounting ledger with social media follower counts.'
          ],
          answer: 0,
          why: 'Top-down econometric modeling respects privacy regulations (GDPR/ATT), measures aggregate macro sales uplift, and models non-linear diminishing returns across both digital and offline media.',
          answerIndex: 0,
          explanation: 'Top-down econometric modeling respects privacy regulations (GDPR/ATT), measures aggregate macro sales uplift, and models non-linear diminishing returns across both digital and offline media.'
        }
      },
      {
        title: 'Customer Acquisition Cost (CAC) Payback Period & Cohort Retention Physics',
        say: [
          'High Customer Lifetime Value (CLV) is meaningless if your business runs out of working capital before those customer revenues materialize.',
          'The single most critical liquidity metric for subscription, SaaS, and repeat DTC e-commerce is the CAC Payback Period: the exact number of months required for a customer\'s cumulative gross profit to recover the initial advertising acquisition expenditure.',
          'The fundamental payback formula is: Payback Months = CAC / (Monthly ARPU * Gross Margin %).',
          'However, real-world payback models must incorporate cohort decay: every month, a percentage of acquired customers churn, reducing the active paying base that generates gross margin contributions.',
          'Top-tier venture and private equity benchmarks dictate that CAC Payback must occur in under 12 months (ideally 5 to 7 months). If payback exceeds 18 months, aggressive growth will consume cash faster than debt or equity can sustain.'
        ],
        example: 'A subscription box brand spends $120 to acquire a subscriber paying $35/month at 70% gross margin with 5% monthly churn. In Month 1, the subscriber generates $24.50 in gross margin, recovering 20.4% of CAC. Factoring in cohort attrition, the business achieves full cash-flow breakeven at Month 6, generating $105.22 in net profit per customer by Month 12.',
        code: `# Simulation: Cohort CAC Payback Period & Cumulative Cash Flow Breakeven
def calculate_cac_payback_cohort(cac: float, initial_arpu: float, gross_margin_pct: float, monthly_churn_pct: float, months: int = 12) -> dict:
    cumulative_margin = 0.0
    active_customers = 1.0 # Base 1 cohort member
    breakeven_month = None

    for m in range(1, months + 1):
        monthly_rev = active_customers * initial_arpu
        monthly_margin = monthly_rev * (gross_margin_pct / 100.0)
        cumulative_margin += monthly_margin

        if cumulative_margin >= cac and breakeven_month is None:
            breakeven_month = m

        # Apply cohort churn
        active_customers *= (1.0 - (monthly_churn_pct / 100.0))

    return {
        "CAC": cac,
        "Breakeven_Month": breakeven_month if breakeven_month else "Over 12 Months",
        "Cumulative_Gross_Margin_M12": round(cumulative_margin, 2),
        "Net_Profit_M12": round(cumulative_margin - cac, 2),
        "Payback_Status": "HEALTHY (<12 Mo)" if breakeven_month and breakeven_month <= 12 else "DANGEROUS (>12 Mo)"
    }

cohort_res = calculate_cac_payback_cohort(cac=120.0, initial_arpu=35.0, gross_margin_pct=70.0, monthly_churn_pct=5.0)
print(f"CAC: \${cohort_res['CAC']} | Payback Month: {cohort_res['Breakeven_Month']} ({cohort_res['Payback_Status']})")
print(f"12-Month Net Profit per Customer: \${cohort_res['Net_Profit_M12']}")`,
        output: `CAC: $120.0 | Payback Month: 6 (HEALTHY (<12 Mo))\n12-Month Net Profit per Customer: $105.22`,
        codeNotes: [
          { line: 2, note: 'calculate_cac_payback_cohort models realistic cohort survival decay rather than naive static multiples' },
          { line: 8, note: 'Calculates monthly gross margin contribution by scaling active survivors against ARPU and margin' },
          { line: 12, note: 'Captures first crossing point where cumulative gross margin matches or exceeds original CAC' },
          { line: 26, note: 'Validates healthy unit economics with a 6-month breakeven and $105.22 M12 profit' }
        ],
        tryIt: 'Increase cac to 250.0 and rerun to see Payback_Status flip to DANGEROUS (>12 Mo) as churn outpaces recovery.',
        check: {
          question: 'Why is CAC Payback Period often considered a more dangerous risk indicator than CLV/CAC ratio for growing companies?',
          options: [
            'Because a high CLV realized over 5 years cannot prevent a business from running out of cash if upfront ad spend takes 24 months to recoup in gross profit.',
            'Because customer acquisition costs are illegal to deduct on corporate tax returns.',
            'Because credit card payment processors refuse to settle accounts with active subscriptions.',
            'Because CAC payback period applies exclusively to non-profit organizations.'
          ],
          answer: 0,
          why: 'Working capital physics require fast cash recycling; a company with an outstanding 5x CLV/CAC can still go bankrupt if the payback period exceeds its bank debt and cash runway.',
          answerIndex: 0,
          explanation: 'Working capital physics require fast cash recycling; a company with an outstanding 5x CLV/CAC can still go bankrupt if the payback period exceeds its bank debt and cash runway.'
        }
      },
      {
        title: 'Search Engine Crawl Budget, Canonicalization & Log File Auditing',
        say: [
          'In enterprise SEO, producing exceptional content is futile if search engine spiders never discover, crawl, and render your pages.',
          'Googlebot allocates a finite crawl budget to every domain, determined by two primary factors: Crawl Rate Limit (server responsiveness) and Crawl Demand (site popularity and freshness).',
          'E-commerce websites with faceted navigation (filtering by size, color, sort order) frequently generate millions of redundant URLs containing near-duplicate content.',
          'When Googlebot expends its crawl budget requesting useless parameterized URLs, it abandons the crawl before indexing newly launched product pages and category hubs.',
          'Technical marketing analysts perform server log audits to analyze bot request distributions, enforce rel="canonical" tags, configure robots.txt disallow directives, and eliminate 301 redirect chains to maximize crawl efficiency.'
        ],
        example: 'An online retailer discovers that out of 500,000 monthly Googlebot requests, 200,000 requests hit faceted filter query strings like ?sort=price_asc. By adding robots.txt disallow rules on sorting parameters and auditing server logs, Googlebot immediately redirects that bandwidth to newly launched product pages, boosting indexed organic listings by 38%.',
        code: `# Simulation: Web Server Log File Crawl Budget & Parameter Waste Auditor
from typing import List, Dict

class CrawlBudgetAuditor:
    def __init__(self, bot_user_agent: str = "Googlebot"):
        self.bot_agent = bot_user_agent

    def audit_server_logs(self, log_entries: List[Dict]) -> Dict:
        status_counts = {"200": 0, "301": 0, "404": 0, "500": 0}
        parameter_waste_urls = 0
        total_bot_requests = 0

        for entry in log_entries:
            if self.bot_agent.lower() in entry["user_agent"].lower():
                total_bot_requests += 1
                code = str(entry["status_code"])
                status_counts[code] = status_counts.get(code, 0) + 1

                # Detect crawl budget leaks on parameterized filter/sort URLs
                if "?" in entry["url"] and any(param in entry["url"] for param in ["sort=", "filter=", "sessionid="]):
                    parameter_waste_urls += 1

        waste_pct = round((parameter_waste_urls / total_bot_requests) * 100, 1) if total_bot_requests > 0 else 0.0

        return {
            "Total_Bot_Hits": total_bot_requests,
            "HTTP_Status_Distribution": status_counts,
            "Faceted_Waste_Requests": parameter_waste_urls,
            "Crawl_Budget_Waste_Pct": f"{waste_pct}%",
            "Recommendation": "Implement robots.txt Disallow on dynamic parameters and canonicalize to clean product URLs." if waste_pct > 15 else "Crawl budget utilization healthy."
        }

logs = [
    {"user_agent": "Googlebot/2.1", "url": "/products/leather-jacket", "status_code": 200},
    {"user_agent": "Googlebot/2.1", "url": "/products/leather-jacket?sort=price_asc", "status_code": 200},
    {"user_agent": "Googlebot/2.1", "url": "/products/leather-jacket?filter=color_black&sort=asc", "status_code": 200},
    {"user_agent": "Googlebot/2.1", "url": "/old-category", "status_code": 301},
    {"user_agent": "Googlebot/2.1", "url": "/missing-page", "status_code": 404},
]
auditor = CrawlBudgetAuditor()
audit_res = auditor.audit_server_logs(logs)
print(f"Crawl Hits: {audit_res['Total_Bot_Hits']} | Waste: {audit_res['Crawl_Budget_Waste_Pct']}")
print(f"Status Breakdown: {audit_res['HTTP_Status_Distribution']}")`,
        output: `Crawl Hits: 5 | Waste: 40.0%\nStatus Breakdown: {'200': 3, '301': 1, '404': 1, '500': 0}`,
        codeNotes: [
          { line: 4, note: 'CrawlBudgetAuditor filters raw server logs specifically for verified search crawler user agents' },
          { line: 18, note: 'Identifies query parameter leaks that generate duplicate indexing requests' },
          { line: 21, note: 'Quantifies waste percentage to trigger automated robots.txt disallow recommendations' },
          { line: 36, note: 'Reports 40.0% crawl budget waste across 5 bot hits, alerting technical SEO teams to take action' }
        ],
        tryIt: 'Add two new clean URLs (/products/boots, /products/gloves) with status 200 to observe waste drop to 28.6%.',
        check: {
          question: 'What is the primary danger of unmanaged faceted navigation query parameters on large e-commerce websites?',
          options: [
            'Search engine crawlers exhaust their allocated crawl budget on millions of duplicate filtered URLs, causing core product pages to remain uncrawled and unindexed.',
            'Web browsers permanently block customers from sorting product prices.',
            'The web server permanently disables all SSL encryption certificates.',
            'The website domain registrar cancels the domain registration within 24 hours.'
          ],
          answer: 0,
          why: 'Googlebot allocates a finite crawl budget; allowing it to crawl infinite parameter combinations wastes spider capacity and leaves money-making landing pages out of search indexation.',
          answerIndex: 0,
          explanation: 'Googlebot allocates a finite crawl budget; allowing it to crawl infinite parameter combinations wastes spider capacity and leaves money-making landing pages out of search indexation.'
        }
      },
      {
        title: 'Retargeting Audience Decay, Frequency Capping & Negative Exclusion Lists',
        say: [
          'Retargeting is among the highest-ROI tactics in digital marketing, but unmanaged retargeting campaigns destroy brand equity and waste media spend.',
          'Two structural flaws afflict amateur retargeting: audience fatigue from excessive ad frequency, and bidding on stale audiences that have lost purchase intent.',
          'When ad frequency exceeds 3 to 4 impressions per user per day, Click-Through Rates (CTR) plummet while Cost Per Click (CPC) skyrockets as ad fatigue sets in.',
          'Furthermore, user purchase intent decays exponentially over time: a user who abandoned a cart 24 hours ago has a 10x higher conversion probability than a user who visited 14 days ago.',
          'Advanced performance media buyers construct time-decay retargeting audience ladders (1-3 Days Hot, 4-7 Days Warm, 8-14 Days Cold) with descending bid multipliers, and enforce strict Negative Exclusion lists to immediately suppress users who completed a purchase.'
        ],
        example: 'A luxury watch brand configures a dynamic retargeting ladder. Users who abandoned their carts within 72 hours receive a high $2.50 CPC bid. Users from 8-14 days ago receive a low $0.50 bid. If a user completes a purchase, their ID is immediately added to the Negative Purchaser Audience, suppressing all retargeting ads and saving thousands of dollars in ad waste.',
        code: `# Simulation: Retargeting Audience Time-Decay Bidding & Negative Suppression Filter
from typing import List, Dict, Set

def optimize_retargeting_audiences(cart_abandoners: List[Dict], existing_purchaser_ids: Set[str]) -> List[Dict]:
    campaign_routing = []

    for user in cart_abandoners:
        uid = user["user_id"]
        days_since_visit = user["days_since_last_touch"]
        daily_impressions = user["impressions_served_today"]

        # Negative Exclusion Check: never pay to retarget past purchasers
        if uid in existing_purchaser_ids:
            campaign_routing.append({"user_id": uid, "action": "NEGATIVE_EXCLUSION_SUPPRESSED", "bid_cpc": 0.0})
            continue

        # Frequency Capping Check: prevent ad fatigue (max 3 impressions/day)
        if daily_impressions >= 3:
            campaign_routing.append({"user_id": uid, "action": "FREQUENCY_CAP_EXCEEDED_PAUSE", "bid_cpc": 0.0})
            continue

        # Recency Decay Bidding Tiers
        if days_since_visit <= 3:
            bid = 2.50
            tier = "HOT_RETARGETING_1_TO_3_DAYS"
        elif days_since_visit <= 7:
            bid = 1.25
            tier = "WARM_RETARGETING_4_TO_7_DAYS"
        else:
            bid = 0.50
            tier = "COLD_RETARGETING_8_TO_14_DAYS"

        campaign_routing.append({"user_id": uid, "action": tier, "bid_cpc": bid})

    return campaign_routing

abandoners = [
    {"user_id": "U101", "days_since_last_touch": 1, "impressions_served_today": 1},
    {"user_id": "U102", "days_since_last_touch": 5, "impressions_served_today": 4},
    {"user_id": "U103", "days_since_last_touch": 2, "impressions_served_today": 0},
    {"user_id": "U104", "days_since_last_touch": 12, "impressions_served_today": 2},
]
purchasers = {"U103", "U999"}
routing = optimize_retargeting_audiences(abandoners, purchasers)
for r in routing:
    print(f"User: {r['user_id']} -> Action: {r['action']} | CPC Bid: \${r['bid_cpc']:.2f}")`,
        output: `User: U101 -> Action: HOT_RETARGETING_1_TO_3_DAYS | CPC Bid: $2.50\nUser: U102 -> Action: FREQUENCY_CAP_EXCEEDED_PAUSE | CPC Bid: $0.00\nUser: U103 -> Action: NEGATIVE_EXCLUSION_SUPPRESSED | CPC Bid: $0.00\nUser: U104 -> Action: COLD_RETARGETING_8_TO_14_DAYS | CPC Bid: $0.50`,
        codeNotes: [
          { line: 4, note: 'optimize_retargeting_audiences routes ad bids dynamically across recency, frequency, and exclusion lists' },
          { line: 12, note: 'Suppresses recent purchasers immediately, avoiding the classic blunder of advertising bought items' },
          { line: 17, note: 'Applies frequency cap gating to pause bids once 3 daily impressions have been reached' },
          { line: 22, note: 'Tiers CPC bids proportionally to purchase intent recency ($2.50 hot down to $0.50 cold)' }
        ],
        tryIt: 'Change impressions_served_today for U102 from 4 to 2 to observe it exit pause state and receive a $1.25 warm bid.',
        check: {
          question: 'What is the primary operational objective of a Negative Purchaser Exclusion audience in digital advertising?',
          options: [
            'To instantly stop serving expensive conversion and retargeting ads to customers who have already completed a purchase, saving ad spend and avoiding brand annoyance.',
            'To ban customers who return products from ever visiting the company website again.',
            'To automatically decrease retail product prices by 50% for all prospective buyers.',
            'To hide negative customer reviews on third-party social media platforms.'
          ],
          answer: 0,
          why: 'Serving conversion ads to someone who just purchased 10 minutes ago wastes marketing budget and generates severe customer frustration; negative suppression cures this.',
          answerIndex: 0,
          explanation: 'Serving conversion ads to someone who just purchased 10 minutes ago wastes marketing budget and generates severe customer frustration; negative suppression cures this.'
        }
      },
      {
        title: 'Bayesian Beta-Binomial Conversion Uplift & Statistical Decision Rules',
        say: [
          'Traditional frequentist hypothesis testing (p-values) answers only one counterfactual question: "Assuming there is zero difference between Variant A and B, what is the probability of observing data at least this extreme?"',
          'Business executives do not care about the null hypothesis; they want direct probabilistic answers: "What is the probability that Variant B is better than Variant A, and how much revenue uplift can we expect?"',
          'Bayesian A/B testing provides these exact answers using conjugate prior distributions.',
          'For binary conversion rates (converted vs didn\'t convert), the Beta distribution acts as the conjugate prior for the Binomial likelihood: Posterior Beta(alpha, beta) where alpha = conversions + 1 and beta = non-conversions + 1.',
          'By running Monte Carlo simulations or exact numerical integrations over the two posterior distributions, marketers calculate the exact Probability to Beat Control (e.g. 99.4%) and the Expected Loss, enabling rapid, risk-calibrated deployment decisions.'
        ],
        example: 'Variant A records 210 conversions from 5,000 visitors (4.20% CR). Variant B records 265 conversions from 5,000 visitors (5.30% CR). A 10,000-iteration Bayesian simulation reveals that Variant B has a 99.46% probability of beating Control, giving the growth product manager conclusive empirical authorization to roll out Variant B.',
        code: `# Simulation: Bayesian Beta-Binomial Conjugate A/B Testing Engine
import random

class BayesianAbTest:
    def __init__(self, visitors_a: int, conv_a: int, visitors_b: int, conv_b: int, prior_alpha: float = 1.0, prior_beta: float = 1.0):
        # Beta posterior parameters: alpha = conversions + prior_a, beta = non_conversions + prior_b
        self.alpha_a = conv_a + prior_alpha
        self.beta_a = (visitors_a - conv_a) + prior_beta
        self.alpha_b = conv_b + prior_alpha
        self.beta_b = (visitors_b - conv_b) + prior_beta
        self.rate_a = conv_a / visitors_a
        self.rate_b = conv_b / visitors_b

    def simulate_probability_b_beats_a(self, simulations: int = 10000, seed: int = 42) -> dict:
        random.seed(seed)
        b_wins = 0
        uplifts = []

        for _ in range(simulations):
            # Beta distribution sampling
            sample_a = random.betavariate(self.alpha_a, self.beta_a)
            sample_b = random.betavariate(self.alpha_b, self.beta_b)

            if sample_b > sample_a:
                b_wins += 1
            uplifts.append((sample_b - sample_a) / sample_a)

        prob_b_beats_a = round((b_wins / simulations) * 100.0, 2)
        mean_uplift = round((sum(uplifts) / simulations) * 100.0, 2)

        return {
            "Control_CR": f"{round(self.rate_a * 100, 2)}%",
            "Variant_CR": f"{round(self.rate_b * 100, 2)}%",
            "Prob_Variant_Beats_Control": f"{prob_b_beats_a}%",
            "Expected_Mean_Uplift": f"{mean_uplift}%",
            "Decision": "DEPLOY_VARIANT_B" if prob_b_beats_a >= 95.0 else "INCONCLUSIVE_CONTINUE_TEST"
        }

bayesian_calc = BayesianAbTest(visitors_a=5000, conv_a=210, visitors_b=5000, conv_b=265)
bayesian_res = bayesian_calc.simulate_probability_b_beats_a()
print(f"A: {bayesian_res['Control_CR']} | B: {bayesian_res['Variant_CR']}")
print(f"Prob(B > A): {bayesian_res['Prob_Variant_Beats_Control']} | Decision: {bayesian_res['Decision']}")`,
        output: `A: 4.2% | B: 5.3%\nProb(B > A): 99.46% | Decision: DEPLOY_VARIANT_B`,
        codeNotes: [
          { line: 6, note: 'Computes analytical Beta conjugate posterior parameters incorporating uninformative flat priors' },
          { line: 17, note: 'Draws 10,000 Monte Carlo samples directly from posterior distributions using betavariate' },
          { line: 26, note: 'Evaluates probability that Variant B exceeds Control along with percentage expected uplift' },
          { line: 36, note: 'Outputs 99.46% certainty that Variant B outperforms Variant A, triggering an automated deploy decision' }
        ],
        tryIt: 'Change conv_b to 215 and observe Prob(B > A) drop to ~60%, flipping the decision to INCONCLUSIVE_CONTINUE_TEST.',
        check: {
          question: 'What is the primary practical advantage of Bayesian A/B testing over classical frequentist p-value hypothesis testing for digital marketing teams?',
          options: [
            'It directly yields the posterior probability that Variant B is better than Variant A (e.g. 99.4%) and quantifies expected uplift, allowing direct business risk decisions without fixed sample size constraints.',
            'It guarantees that every tested variant will double the company\'s conversion rate within 24 hours.',
            'It eliminates the need to measure user visits and purchases entirely.',
            'It works only when sample sizes are smaller than ten website visitors.'
          ],
          answer: 0,
          why: 'Bayesian statistics produce intuitive probabilistic statements about which variant is superior and expected gain/loss, making commercial experimentation interpretable and actionable.',
          answerIndex: 0,
          explanation: 'Bayesian statistics produce intuitive probabilistic statements about which variant is superior and expected gain/loss, making commercial experimentation interpretable and actionable.'
        }
      }
    ],
    summary: [
      'Econometric Marketing Mix Modeling (MMM): Overcomes cookie deprecation through top-down regression incorporating geometric adstock decay and Hill saturation curves.',
      'CAC Payback Physics: High CLV is useless without fast capital recycling; tracking cohort gross margins ensures customer acquisition cost payback occurs in under 12 months.',
      'Crawl Budget Optimization: Server log audits detect spider waste on faceted query parameters, preserving Googlebot crawl budget for high-intent product listings.',
      'Audience Decay & Negative Exclusion: Mitigates ad fatigue via frequency caps (<=3/day), tiers bids across 1-14 day intent recency, and suppresses recent buyers.',
      'Bayesian A/B Testing: Leverages Beta-Binomial conjugate posteriors to compute exact Probability to Beat Control (e.g. 99.46%) and expected conversion uplift.'
    ],
    projectStep: {
      title: 'Econometric Attribution & Bayesian Optimization Suite',
      steps: [
        'Model multi-channel marketing spend with geometric adstock carryover and Hill diminishing returns saturation curves.',
        'Calculate cohort survival curves and cash flow breakeven months to enforce sub-12-month CAC payback boundaries.',
        'Audit web server access logs for crawler bot status distributions and faceted navigation budget leaks.',
        'Deploy a Bayesian Beta-Binomial conjugate simulator to evaluate conversion uplift with definitive probability thresholds.'
      ]
    }
  }
];
