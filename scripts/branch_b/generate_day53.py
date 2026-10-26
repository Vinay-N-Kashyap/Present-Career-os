import json
import os
import sys

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
output_file = os.path.join(commerce_dir, "scripts", "branch_b", "day53_dmkt_data.json")

def make_part(title, say_paragraphs, example, try_it, code, output, question, options, why):
    say_text = " ".join(say_paragraphs)
    words = len(say_text.strip().split())
    print(f"Part '{title}': {words} words")
    assert words >= 600, f"Part '{title}' under 600 words: {words}"
    print(f"PASSED Part '{title}': {words} words")
    assert len(options) == 4, f"Part '{title}' must have exactly 4 options"
    assert len(why) >= 30, f"Part '{title}' why must be >= 30 chars"
    
    return {
        "title": title,
        "say": say_paragraphs,
        "example": example,
        "tryIt": try_it,
        "code": code,
        "output": output,
        "check": {
            "question": question,
            "options": options,
            "answer": 0,
            "answerIndex": 0,
            "why": why,
            "explanation": why
        }
    }

# ==========================================
# PART 1: Programmatic Digital Out-of-Home (pDOOH) in Retail Storefronts
# ==========================================
p1_title = "Programmatic Digital Out-of-Home (pDOOH) in Retail Storefronts: VAST/VPAID Video Loop Architectures"
p1_say = [
    "While the initial surge of retail media network investment centered on digital websites and mobile applications, enterprise commerce strategists "
    "recognize a glaring structural reality: over eighty-five percent of global grocery, mass merchandise, and consumer packaged goods retail sales still "
    "transpire within physical, brick-and-mortar stores. Consequently, the next multi-billion-dollar frontier of retail media transformation is the "
    "digitization of the physical storefront through In-Store Programmatic Digital Out-of-Home (pDOOH). By deploying networks of high-definition digital "
    "signage, entrance video walls, overhead aisle screens, and checkout lane displays, retailers transform physical real estate into addressable, programmatic "
    "media inventory that brands can bid on through demand-side platforms (DSPs).",
    "To integrate physical store screens into digital ad exchanges, in-store retail media platforms standardize on established digital video protocols, "
    "principally the Video Ad Serving Template (VAST 4.x) and Secure Interactive Media Interface Definition (SIMID), which succeeded legacy VPAID. In a "
    "retail pDOOH environment, digital screen controllers running on edge media players (such as dedicated Android or Linux signage appliances) maintain "
    "continuous network connections to cloud ad servers. Rather than displaying static paper posters or hardcoded video loops that run for weeks without "
    "variation, edge media players execute dynamic ad calls via VAST XML payloads, requesting fresh video creatives, tracking impression beacons, and "
    "enforcing real-time campaign flighting schedules.",
    "A central concept in in-store pDOOH scheduling is the Video Ad Loop and Share of Voice (SOV) structure. Unlike web video players where a single pre-roll "
    "ad plays prior to a piece of content, retail digital signage operates on repeating time-based loops—typically configured in sixty, ninety, or one hundred "
    "and twenty-second cycles. A ninety-second loop might be divided into six fifteen-second slots. Advertisers purchase specific Share of Voice allotments "
    "within these loops. For example, buying two fifteen-second slots within a ninety-second loop guarantees a thirty-three point three percent Share of Voice, "
    "meaning the brand's commercial airs forty times every single hour that the physical retail store remains open to the public.",
    "The programmatic bidding architecture for in-store DOOH utilizes OpenRTB extensions specifically adapted for out-of-home environments. In web-based "
    "programmatic auctions, one ad impression corresponds to exactly one individual user loading a webpage. In retail out-of-home, however, an ad displayed "
    "on a massive six-foot LED entrance display is viewed simultaneously by multiple shoppers entering the store. Programmatic exchanges model this reality "
    "using Impression Multipliers. When an edge player issues an OpenRTB bid request to a DSP, the bid request specifies an audience multiplier calculated "
    "from historical store footfall sensors, time-of-day traffic curves, and dwell time models, allowing the DSP to price bids on a cost-per-thousand (CPM) "
    "effective audience basis.",
    "Critical to the financial integrity and auditing of in-store pDOOH is Proof-of-Play (PoP) telemetry. Enterprise consumer packaged goods brands spending "
    "millions of dollars on physical screen networks require verifiable, tamper-proof audit trails proving that video creatives were actually rendered as "
    "contracted. Edge signage players record hardware-level display logs, verifying that the screen panel was powered on, the video frame buffer completed "
    "playback without dropped frames, and the display was not occluded by physical store obstructions. These proof-of-play event logs are cryptographically "
    "batched and transmitted to cloud analytics warehouses for third-party billing reconciliation.",
    "Furthermore, in-store programmatic signage networks implement content safety and brand collision rules. If two competing carbonated soft drink brands "
    "both purchase ad slots within the same physical store network, the loop orchestration algorithm enforces separation rules, preventing rival ads from "
    "airing consecutively in adjacent time slots or on adjacent screens within the same sightline. By harmonizing VAST video standards, programmatic impression "
    "multipliers, and automated content scheduling, retail media networks successfully bridge the gap between digital programmatic precision and massive "
    "in-store consumer footfall.",
    "From a hardware engineering standpoint, edge media players deploy hardware-accelerated video decoding (such as dedicated H.264 and H.265 decoders) "
    "and maintain local solid-state storage caches. High-definition video assets are pre-fetched during off-peak overnight hours over enterprise Wi-Fi "
    "or cellular gateways. When an ad slot triggers, the edge player renders the video locally from solid-state memory rather than streaming raw video bits "
    "over volatile store networks. In the event of wide-area network partitions or complete cloud disconnections, the player falls back to an offline "
    "emergency playlist, ensuring that physical store displays never suffer from black screens, loading spinners, or degraded consumer experiences."
]
p1_example = "A national supermarket chain converted 650 physical storefronts into an in-store pDOOH media network featuring 5,200 digital endcaps. By integrating VAST 4.2 video players with automated programmatic DSP connectors, consumer brands bid dynamically on 15-second loop slots during peak 4 PM to 7 PM shopping hours, driving an 18.5% in-store sales lift and generating $22M in high-margin retail media ad revenue."
p1_try_it = "Simulate an in-store pDOOH video loop scheduler in Python, calculating hourly ad frequency, impression multipliers, and effective CPM across a physical retail store network."

p1_code = """class InStoreDOOHLoopScheduler:
    def __init__(self, store_name: str, loop_duration_sec: int = 90):
        self.store = store_name
        self.loop_duration = loop_duration_sec
        self.slots: list[dict] = []
        self.total_slots = loop_duration_sec // 15  # 15-sec slots

    def book_slot(self, brand: str, sku: str, slot_count: int, bid_cpm: float):
        if len(self.slots) + slot_count > self.total_slots:
            raise ValueError(f"Exceeds loop capacity ({self.total_slots} max 15s slots)")
        
        sov = slot_count / self.total_slots
        plays_per_hour = int((3600 / self.loop_duration) * slot_count)
        
        booking = {
            "brand": brand,
            "sku": sku,
            "slots_booked": slot_count,
            "share_of_voice": f"{sov * 100:.1f}%",
            "plays_per_hour": plays_per_hour,
            "bid_cpm": bid_cpm
        }
        self.slots.append(booking)
        return booking

    def calculate_hourly_telemetry(self, avg_shoppers_per_hour: int) -> list[dict]:
        # Each ad play reaches a portion of the shoppers in store (multiplier)
        results = []
        for b in self.slots:
            # Assume 12% of store shoppers are within screen sightline per loop play
            audience_per_play = max(1, int(avg_shoppers_per_hour * 0.035))
            total_impressions = b["plays_per_hour"] * audience_per_play
            cost = (total_impressions / 1000.0) * b["bid_cpm"]
            
            results.append({
                "brand": b["brand"],
                "sku": b["sku"],
                "plays_per_hour": b["plays_per_hour"],
                "audience_multiplier": audience_per_play,
                "hourly_impressions": total_impressions,
                "hourly_spend": round(cost, 2)
            })
        return results

scheduler = InStoreDOOHLoopScheduler("Supercenter Store #1042", loop_duration_sec=90)
scheduler.book_slot("SparklingBeverageCorp", "SKU_ZERO_SUGAR_LIME", slot_count=2, bid_cpm=14.50)
scheduler.book_slot("ArtisanSnacksLLC", "SKU_SEA_SALT_CRACKERS", slot_count=1, bid_cpm=12.00)

telemetry = scheduler.calculate_hourly_telemetry(avg_shoppers_per_hour=1850)
print(f"--- In-Store pDOOH Telemetry ({scheduler.store}) ---")
for row in telemetry:
    print(f"Brand: {row['brand']} | Plays/Hr: {row['plays_per_hour']} | Impr: {row['hourly_impressions']} | Spend: ${row['hourly_spend']}")
"""

p1_output = """--- In-Store pDOOH Telemetry (Supercenter Store #1042) ---
Brand: SparklingBeverageCorp | Plays/Hr: 80 | Impr: 5120 | Spend: $74.24
Brand: ArtisanSnacksLLC | Plays/Hr: 40 | Impr: 2560 | Spend: $30.72
"""

p1_question = "In physical retail programmatic digital out-of-home (pDOOH), how does an 'Impression Multiplier' differ from standard digital web impression counting?"
p1_options = [
    "It quantifies how many physical shoppers are estimated to view a single digital screen ad playback simultaneously, whereas web impressions measure single individual user views",
    "It multiplies the financial billing cost by the number of digital screens operating within fifty miles of the retail store",
    "It represents the number of times an edge media player dropped video frames due to local Wi-Fi connectivity degradation",
    "It is a legal penalty factor applied when an advertiser cancels their in-store media contract before the end of the promotional quarter"
]
p1_why = "In DOOH, one ad playback is seen by multiple people; the impression multiplier estimates the audience size per play."

# ==========================================
# PART 2: Smart Carts, Interactive Endcaps & In-Aisle Screen Telemetry
# ==========================================
p2_title = "Smart Carts, Interactive Endcaps & In-Aisle Screen Telemetry: Real-Time Dwell Time & Optical Sensor Tracking"
p2_say = [
    "The evolution of in-store retail media extends far beyond passive overhead signage into active, ambient connected retail hardware. Two prime "
    "manifestations of this technological shift are AI-Powered Smart Shopping Carts (such as Instacart Caper Carts, Amazon Dash Carts, and Veeve Smart Carts) "
    "and Interactive Shelf-Edge Endcap Displays. These devices transform traditional passive shopping hardware into intelligent, context-aware interactive "
    "terminals equipped with touchscreens, barcode scanners, weight sensors, optical cameras, and localized indoor positioning systems.",
    "Smart carts represent the ultimate point-of-decision advertising vehicle. As a shopper navigates supermarket aisles pushing an AI-powered smart cart, "
    "the cart's onboard compute module continuously tracks its physical coordinates using Ultrawideband (UWB) radio triangulation or Bluetooth Low Energy "
    "(BLE) ceiling beacon arrays. When the shopper enters a specific retail aisle—such as the breakfast cereal aisle—the cart's display dynamically renders "
    "contextual, location-triggered media units. For example, if the shopper pauses in front of premium granolas, the cart screen presents a sponsored "
    "recipe card or a digital coupon for an organic almond milk brand located on the opposite shelf.",
    "Furthermore, smart carts incorporate real-time basket contents into their programmatic ad arbitration logic. Equipped with computer vision cameras "
    "and sensitive weight scales that detect items as they are placed into the cart basket, the smart cart maintains a live running inventory of the "
    "shopper's current trip. If the cart's onboard AI detects that the shopper has scanned a bag of gourmet coffee beans, the ad server dynamically bids "
    "on a complementary cross-sell ad unit, prompting: Would you like to add artisan oat milk to your order? Take two steps forward to find it on Shelf 3. "
    "This immediate proximity-based cross-merchandising bridges the gap between digital recommendation algorithms and physical retail shelves.",
    "Parallel to smart carts, Interactive Endcaps and Digital Shelf-Edge Strips deploy Optical Sensor Telemetry to measure shopper attention, dwell time, "
    "and interaction depth. Mounted discreetly on retail fixtures, optical edge-AI sensors (such as low-power camera microcontrollers executing lightweight "
    "computer vision models) continuously calculate shopper footfall metrics without recording or transmitting personally identifiable video streams. The sensor "
    "detects when a consumer enters the detection zone (Opportunity-to-See), turns their head toward the digital display (Notice), and pauses in front "
    "of the shelf (Dwell Time).",
    "Dwell time is the critical engagement metric in physical retail media analytics. Industry benchmarks classify an interaction as a Glance if the shopper "
    "gazes at the screen for under one second, an Impression if gaze duration lasts between one and three seconds, and Engaged Dwell if the shopper "
    "lingers for over three seconds. Furthermore, interactive endcaps equipped with touchscreen product finders or motion-activated video sensors log "
    "physical touch interactions, recording when shoppers explore nutritional details, tap to compare brand flavors, or dispense physical promotional coupons.",
    "By capturing granular telemetry on dwell times and physical engagement, retail media platforms provide brand advertisers with unprecedented funnel "
    "visibility in physical retail spaces. For the first time in commerce history, a CPG brand manager can quantify how many shoppers walked past their shelf, "
    "what percentage noticed their digital endcap creative, how long consumers lingered, and whether that physical attention translated into an immediate item "
    "scan at the checkout register. This end-to-end physical telemetry elevates brick-and-mortar marketing to digital-grade accountability.",
    "A key engineering hurdle in smart cart deployment is overcoming radio multipath interference inside cavernous steel-rack warehouse stores. Metal shelving "
    "units and dense pallet stacks reflect and attenuate traditional Wi-Fi and Bluetooth signals, creating spatial dead zones. To achieve sub-meter "
    "localization accuracy, enterprise smart cart systems utilize Ultra-Wideband (UWB) time-of-flight (ToF) radio beacons paired with onboard dead-reckoning "
    "inertial measurement units (IMUs). When optical wheel encoders detect motion, the IMU calculates cart trajectory between beacon pings, ensuring smooth, "
    "jitter-free navigation and timely promotional ad triggers.",
    "Additionally, smart carts seamlessly synchronize with the retailer's mobile application and digital loyalty shopping lists. When a customer logs into "
    "the cart terminal, their saved shopping list populates the interactive display. As the cart navigates toward an aisle containing an item on the list, "
    "the display highlights the precise shelf tier and bin location. Concurrently, the ad arbitration engine evaluates complementary sponsored product bids, "
    "allowing brands to sponsor smart list suggestions that gently nudge consumers toward premium alternatives, maximizing basket value and shopper satisfaction."
]
p2_example = "A global pasta sauce manufacturer launched an interactive digital endcap campaign across 400 grocery stores featuring optical dwell sensors. The sensor telemetry revealed that shoppers who dwelled for >3.5 seconds converted at a 34% rate, while an integrated dynamic coupon button generated 28,000 direct product scans, resulting in a $620,000 physical store sales lift."
p2_try_it = "Simulate an edge optical sensor telemetry processor in Python, categorizing shopper dwell times and calculating physical engagement rates for in-aisle digital displays."

p2_code = """class InAisleOpticalTelemetryProcessor:
    def __init__(self, display_id: str, aisle_category: str):
        self.display_id = display_id
        self.category = aisle_category
        self.raw_events: list[dict] = []

    def log_shopper_passage(self, shopper_id: str, distance_meters: float, gaze_sec: float, touched_screen: bool):
        self.raw_events.append({
            "shopper_id": shopper_id,
            "distance": distance_meters,
            "gaze_sec": gaze_sec,
            "touched": touched_screen
        })

    def generate_attention_funnel(self) -> dict:
        total_footfall = len(self.raw_events)
        if total_footfall == 0:
            return {"status": "NO_DATA"}

        opportunity_to_see = sum(1 for e in self.raw_events if e["distance"] <= 3.0)
        noticed = sum(1 for e in self.raw_events if e["distance"] <= 3.0 and e["gaze_sec"] >= 1.0)
        engaged_dwell = sum(1 for e in self.raw_events if e["distance"] <= 3.0 and e["gaze_sec"] >= 3.0)
        touch_interactions = sum(1 for e in self.raw_events if e["touched"])

        return {
            "display_id": self.display_id,
            "aisle_category": self.category,
            "total_footfall": total_footfall,
            "opportunity_to_see_ots": opportunity_to_see,
            "noticed_glance_rate": f"{(noticed / opportunity_to_see) * 100:.1f}%",
            "engaged_dwell_rate": f"{(engaged_dwell / opportunity_to_see) * 100:.1f}%",
            "touch_interaction_count": touch_interactions,
            "avg_dwell_sec": round(sum(e["gaze_sec"] for e in self.raw_events if e["distance"] <= 3.0) / max(1, opportunity_to_see), 2)
        }

processor = InAisleOpticalTelemetryProcessor("ENDCAP_DISP_AISLE_4B", "Pasta & Italian Sauces")
# Simulate physical shoppers passing the endcap
processor.log_shopper_passage("SHOPPER_01", distance_meters=2.1, gaze_sec=0.5, touched_screen=False)
processor.log_shopper_passage("SHOPPER_02", distance_meters=1.4, gaze_sec=3.8, touched_screen=True)
processor.log_shopper_passage("SHOPPER_03", distance_meters=4.2, gaze_sec=0.0, touched_screen=False)
processor.log_shopper_passage("SHOPPER_04", distance_meters=1.8, gaze_sec=4.5, touched_screen=True)
processor.log_shopper_passage("SHOPPER_05", distance_meters=2.5, gaze_sec=1.6, touched_screen=False)

funnel = processor.generate_attention_funnel()
print("In-Aisle Optical Attention Funnel:")
for k, v in funnel.items():
    print(f"  {k}: {v}")
"""

p2_output = """In-Aisle Optical Attention Funnel:
  display_id: ENDCAP_DISP_AISLE_4B
  aisle_category: Pasta & Italian Sauces
  total_footfall: 5
  opportunity_to_see_ots: 4
  noticed_glance_rate: 75.0%
  engaged_dwell_rate: 50.0%
  touch_interaction_count: 2
  avg_dwell_sec: 2.6
"""

p2_question = "How do AI smart shopping carts leverage real-time basket contents to deliver contextual in-store advertising?"
p2_options = [
    "By using onboard computer vision and weight sensors to detect items placed into the cart, triggering complementary cross-sell ad units as the cart navigates corresponding store aisles",
    "By requiring shoppers to take photographs of their paper receipts before the cart unlocks its motorized wheels",
    "By transmitting ultrasonic audio pulses that alter the nutritional labels on physical cereal boxes as the cart passes",
    "By charging the shopper's credit card double if they choose not to view sponsored video ads on the handlebar touchscreen"
]
p2_why = "Smart carts use weight sensors/cameras to track basket items and UWB/BLE to trigger contextual cross-sells as shoppers move."

# ==========================================
# PART 3: Weather, Inventory & Local Foot-Traffic DCO Trigger Engines
# ==========================================
p3_title = "Weather, Inventory & Local Foot-Traffic Dynamic Creative Optimization (DCO) Trigger Engines"
p3_say = [
    "In physical retail environments, consumer purchasing behavior is extraordinarily sensitive to external environmental factors, hyper-local weather "
    "conditions, store inventory status, and fluctuating foot-traffic density. Unlike static digital web ads where the same creative is served across "
    "diverse geographic regions, in-store programmatic signage requires dynamic, real-time creative adaptation. Enterprise retail media networks achieve "
    "this through In-Store Dynamic Creative Optimization (DCO) Trigger Engines, which programmatically assemble video creatives, localized pricing, "
    "and promotional calls-to-action based on real-time environmental APIs and supply chain feeds.",
    "Hyper-local weather triggers represent one of the most commercially impactful applications of in-store DCO. Consumer demand for specific categories—such "
    "as allergy relief medications, hot coffee, ice cream, umbrella accessories, and sunscreen—fluctuates wildly based on temperature, UV index, and "
    "precipitation. An intelligent DCO trigger engine ingests localized meteorological data streams for every individual store zip code. If an outdoor "
    "temperature sensor at a Dallas supercenter detects a heatwave exceeding ninety-five degrees Fahrenheit, overhead entrance screens dynamically serve "
    "ad creatives for chilled isotonic sports drinks and bottled water. If a rainstorm begins at a Seattle location, the same network immediately swaps "
    "the creative to promote hot soup, premium tea, and windshield wiper blades.",
    "Equally vital is Inventory-Conditioned Creative Routing. Advertising a product on high-definition in-store screens when that specific store's physical "
    "shelves are empty creates acute consumer friction, frustrates retail store associates, and damages brand equity. An enterprise in-store DCO engine "
    "maintains a continuous data connection with store-level inventory management systems. If an advertised SKU's on-hand store inventory drops below "
    "a minimum threshold (for example, fewer than three units on the shelf), the DCO engine automatically swaps the primary creative to an alternative in-stock "
    "flavor or variant, or falls back to a category umbrella brand ad, ensuring that zero ad dollars promote out-of-stock products.",
    "Furthermore, in-store DCO engines synchronize with Foot-Traffic Pacing and Store Congestion Telemetry. Retail footfall follows pronounced diurnal "
    "and day-of-week patterns: weekday lunch rushes, post-work evening shopping spikes between five and eight in the evening, and Saturday afternoon family "
    "trips. When optical or Wi-Fi sensors detect that store footfall is surging, the DCO engine tightens ad rotation intervals, prioritizing high-velocity "
    "impulse purchase items (such as single-serve snacks and beverages) near checkout queues. During quieter morning hours with longer shopper dwell times, "
    "the system serves educational brand-building narratives for premium household electronics or high-ticket health supplements.",
    "From an engineering standpoint, in-store DCO architectures utilize modular HTML5 and WebGL creative templates rendered natively by edge media players. "
    "Rather than pre-rendering hundreds of separate static MP4 video files for every conceivable permutation of price, temperature, and inventory condition, "
    "the creative agency authors a dynamic HTML5 template containing parameterized placeholder layers. When the edge player receives a VAST ad call, "
    "the DCO middleware queries the local store context cache and injects localized variables: the current store temperature, the exact aisle location of "
    "the product, the local promotional price, and a scannable digital loyalty barcode.",
    "This edge-rendered modularity drastically reduces bandwidth consumption across large retail store networks. Instead of streaming gigabytes of heavy video "
    "files across cellular or enterprise wide-area networks, the central server merely pushes lightweight JSON metadata payloads. The local media player "
    "assembles and renders sixty-frames-per-second broadcast-quality dynamic creatives instantly on the physical display, delivering hyper-relevant advertising "
    "that maximizes shopper conversion and optimizes supplier return on ad spend.",
    "Beyond visual digital displays, advanced in-store DCO engines synchronize with retail overhead in-store audio systems to deliver multi-sensory retail "
    "promotions. When a weather or inventory trigger fires—such as an unseasonable afternoon temperature spike—the DCO platform orchestrates synchronized "
    "audio cues alongside visual screen takeovers. A short, professional audio announcement highlights the cold beverage promotion in checkout coolers "
    "simultaneously with entrance and aisle screen takeovers, doubling message recall and driving immediate impulse purchasing behavior.",
    "Furthermore, enterprise DCO trigger engines implement multi-variable scoring algorithms that balance competing environmental signals. If a store "
    "experiences simultaneously elevated temperatures and heavy local pollen counts, the scoring engine calculates the relative margin potential and "
    "historical conversion elasticity of both allergy medications and cold beverages. The ad unit with the highest expected revenue yield is allocated "
    "the prime sixty-second loop slot, while the runner-up is queued for the subsequent rotation, optimizing total retail revenue per square foot."
]
p3_example = "A national pharmacy retailer deployed an environmental DCO engine across 1,800 store entrance screens. In cities where pollen count APIs exceeded 8.5 grains/m3, the screens instantly rendered dynamic allergy relief ads displaying the exact aisle number and local store promotional price, driving a 29% category sales lift compared to un-triggered control stores."
p3_try_it = "Build a dynamic in-store creative decision engine in Python that selects creative variations based on local temperature, pollen count, and shelf inventory."

p3_code = """class InStoreDCOTriggerEngine:
    def __init__(self, store_id: str, zip_code: str):
        self.store_id = store_id
        self.zip_code = zip_code

    def evaluate_creative_trigger(self, temp_f: float, precipitation: bool, on_shelf_stock: int, high_pollen: bool) -> dict:
        # Rule 1: Inventory Safety Check
        if on_shelf_stock <= 2:
            return {
                "decision": "SUPPRESS_PROMOTION",
                "creative_variant": "FALLBACK_CORPORATE_BRAND_AWARENESS",
                "headline": "Fresh Quality Guaranteed Every Day",
                "cta": "Explore Our Fresh Aisles",
                "reason": f"Stock depleted on shelf ({on_shelf_stock} units). Suppressing SKU ad."
            }

        # Rule 2: Allergy / Environmental Triggers
        if high_pollen and not precipitation:
            return {
                "decision": "ENVIRONMENTAL_ALLERGY_TRIGGER",
                "creative_variant": "ALLERGY_24HR_FAST_RELIEF",
                "headline": "High Pollen Alert Today in Your Area!",
                "cta": "Find 24-Hr Allergy Relief in Aisle 6",
                "reason": "Pollen index elevated. Activating seasonal antihistamine creative."
            }

        # Rule 3: Weather & Temperature Triggers
        if temp_f >= 85.0:
            return {
                "decision": "WEATHER_HOT_TRIGGER",
                "creative_variant": "REFRESHING_ICED_BEVERAGE",
                "headline": f"Beat the {temp_f:.0f}° Heat with Ice-Cold Refreshment!",
                "cta": "Grab Cold Beverages in Checkout Coolers",
                "reason": f"Extreme heat threshold exceeded ({temp_f}°F)."
            }
        elif precipitation or temp_f < 45.0:
            return {
                "decision": "WEATHER_COLD_RAIN_TRIGGER",
                "creative_variant": "COMFORT_SOUP_AND_WARM_BAKERY",
                "headline": "Warm Up Tonight with Hearty Artisan Soups",
                "cta": "Fresh Prepared Soups in Deli Section",
                "reason": "Cold or wet weather conditions detected."
            }

        # Default Standard Creative
        return {
            "decision": "STANDARD_PROMOTION",
            "creative_variant": "EVERYDAY_ESSENTIALS_VALUE",
            "headline": "Great Value on Everyday Family Favorites",
            "cta": "Shop Featured Items in Aisle 4",
            "reason": "Standard baseline parameters met."
        }

engine = InStoreDCOTriggerEngine("STORE_DAL_081", "75001")
# Test heatwave scenario
print("Scenario 1: 92°F Sunny Day, In-Stock:")
c1 = engine.evaluate_creative_trigger(temp_f=92.0, precipitation=False, on_shelf_stock=45, high_pollen=False)
print(f"  Variant: {c1['creative_variant']} | Headline: {c1['headline']}")

# Test out-of-stock scenario during heatwave
print("\nScenario 2: 92°F Sunny Day, Out-of-Stock:")
c2 = engine.evaluate_creative_trigger(temp_f=92.0, precipitation=False, on_shelf_stock=1, high_pollen=False)
print(f"  Variant: {c2['creative_variant']} | Reason: {c2['reason']}")
"""

p3_output = """Scenario 1: 92°F Sunny Day, In-Stock:
  Variant: REFRESHING_ICED_BEVERAGE | Headline: Beat the 92° Heat with Ice-Cold Refreshment!

Scenario 2: 92°F Sunny Day, Out-of-Stock:
  Variant: FALLBACK_CORPORATE_BRAND_AWARENESS | Reason: Stock depleted on shelf (1 units). Suppressing SKU ad.
"""

p3_question = "Why must an in-store Dynamic Creative Optimization (DCO) engine incorporate real-time on-shelf inventory feeds before selecting an ad creative?"
p3_options = [
    "To avoid displaying advertisements for items that are physically out-of-stock on store shelves, which frustrates shoppers and burns ad spend without sales conversion",
    "Because retail media ad servers automatically disconnect from electrical power if an ad airs for a product with less than ten cases in the distribution center",
    "To comply with federal regulations requiring all digital television displays to shut down whenever grocery inventory falls below thirty percent",
    "Because physical store screens are legally prohibited from displaying commercial branding unless a certified inventory auditor is standing directly in front of the screen"
]
p3_why = "Serving ads for out-of-stock items damages shopper trust and wastes advertising spend that cannot convert."

# ==========================================
# PART 4: Privacy-Preserving In-Store Audience Measurement
# ==========================================
p4_title = "Privacy-Preserving In-Store Audience Measurement: BLE Beacons, Wi-Fi Probes & Synthetic Footfall Aggregation"
p4_say = [
    "As in-store retail media networks scale into enterprise ad exchanges, the industry faces rigorous scrutiny regarding physical audience measurement "
    "standards and consumer privacy governance. Historically, traditional out-of-home (OOH) billboard advertising relied on static, modeled traffic surveys "
    "conducted every few years. In stark contrast, modern retail media demands continuous, verifiable audience counting that complies with Media Rating "
    "Council (MRC) standards for Out-of-Home measurement while adhering strictly to global data privacy regulations such as GDPR, CCPA/CPRA, and biometric "
    "privacy statutes like the Illinois Biometric Information Privacy Act (BIPA).",
    "The Media Rating Council defines two foundational metrics for physical out-of-home advertising: Opportunity-to-See (OTS) and Likely-to-See (LTS). "
    "Opportunity-to-See measures the total gross footfall of shoppers who pass within the geographical sightline cone of a digital screen fixture during "
    "an active ad playback. Likely-to-See applies empirical discount factors based on distance from the screen, viewing angle, screen size, ambient lighting, "
    "and walking velocity, estimating the true net audience that had a high probability of viewing the commercial. Retail media networks that provide "
    "audited LTS audience metrics command premium programmatic CPMs because they deliver validated visual attention.",
    "To measure footfall density without infringing on consumer privacy, enterprise retail networks deploy Privacy-Preserving Sensor Networks utilizing "
    "Bluetooth Low Energy (BLE) beacon telemetry, Wi-Fi probe aggregation, and Edge Computer Vision Sensors. When a shopper's smartphone enters a store, "
    "its wireless chip emits periodic Wi-Fi probe requests and BLE advertising packets. However, modern mobile operating systems (iOS and Android) enforce "
    "strict MAC Address Randomization, continuously cycling synthetic hardware addresses every few minutes.",
    "Rather than attempting to unmask or track individual consumers across time—which would violate privacy laws—the retail sensor infrastructure processes "
    "these radio signals purely as anonymous volumetric pulses. The sensor firmware detects the signal strength (RSSI) of nearby radio beacons to estimate "
    "ambient shopper density within specific store zones. The raw radio signals are immediately converted into anonymous, aggregated count bins, and the "
    "underlying MAC addresses are discarded from volatile memory within milliseconds, ensuring zero persistent tracking of individual shoppers.",
    "For optical sensor arrays mounted on digital endcaps, privacy compliance is guaranteed through On-Device Edge AI Processing. Optical cameras do not "
    "stream raw video footage to the cloud, nor do they record facial images to disk. Instead, lightweight neural network accelerators embedded directly "
    "in the sensor hardware execute head-pose and gaze-vector estimation algorithms in real time. The model detects a human silhouette, measures the duration "
    "that the head vector intersects the screen bounding box, increments an aggregated attention counter, and immediately purges the video frame buffer. "
    "No facial recognition, demographic classification, or biometric templates are ever generated, stored, or transmitted.",
    "Finally, enterprise platforms apply Differential Privacy Noise Injection to all published audience reports. By adding calibrated mathematical noise "
    "(such as Laplace or Gaussian perturbations) to store footfall aggregates, the system mathematically guarantees that an external observer cannot deduce "
    "whether a specific individual was present in a retail store during any given time window. This rigorous combination of edge anonymization, MRC-compliant "
    "likely-to-see modeling, and differential privacy establishes in-store retail media as a gold standard of privacy-safe performance advertising.",
    "The mathematical foundation of differential privacy in physical retail footfall measurement rests upon the Laplace Mechanism. For an aggregated query "
    "evaluating total footfall count f(D) over dataset D, the global L1 sensitivity is exactly one: the presence or absence of a single individual shopper "
    "can alter the count by at most one unit. The mechanism draws random noise from a Laplace distribution with scale parameter b equal to the sensitivity "
    "divided by the privacy budget epsilon (b = 1 / epsilon). As epsilon decreases, the injected noise increases, providing stronger mathematical privacy "
    "guarantees against membership inference and linkage attacks.",
    "Enterprise data platforms manage privacy budget exhaustion across continuous query workflows using advanced composition theorems and Rényi differential "
    "privacy (RDP). When brand advertisers submit multiple daily footfall queries across thousands of retail store screens, the privacy budget accumulator "
    "tracks cumulative epsilon expenditure. Once a predetermined privacy threshold is reached, the system enforces k-anonymity aggregation minimums—requiring "
    "that no reporting cell contains fewer than fifty independent shoppers—ensuring permanent compliance with international data protection mandates."
]
p4_example = "A national home improvement retailer audited its in-store DOOH network across 1,200 stores. By deploying edge-AI optical sensors with zero biometric storage and applying Laplace differential privacy noise (epsilon=0.8), the retailer earned full MRC accreditation for Likely-to-See impressions while achieving 100% compliance with BIPA and CCPA privacy standards."
p4_try_it = "Simulate an edge sensor privacy aggregator in Python that counts passing shoppers, models Likely-to-See viewing cones, and applies Laplace noise for differential privacy."

p4_code = """import random
import math

class PrivacyPreservingFootfallAggregator:
    def __init__(self, display_id: str, epsilon: float = 1.0):
        self.display_id = display_id
        self.epsilon = epsilon  # Privacy budget parameter
        self.raw_counts: list[dict] = []

    def record_passage(self, angle_deg: float, distance_m: float, walking_speed_mps: float):
        # Determine Opportunity-to-See (OTS): within 5 meters and 60 degree viewing cone
        in_ots = distance_m <= 5.0 and abs(angle_deg) <= 30.0
        
        # Calculate Likely-to-See (LTS) probability based on distance and speed
        lts_prob = 0.0
        if in_ots:
            distance_factor = max(0.0, 1.0 - (distance_m / 5.0))
            speed_factor = max(0.2, 1.0 - (walking_speed_mps / 3.0))
            lts_prob = round(distance_factor * speed_factor, 3)

        self.raw_counts.append({
            "ots": in_ots,
            "lts_prob": lts_prob
        })

    def _laplace_noise(self, scale: float) -> float:
        u = random.random() - 0.5
        return -scale * math.copysign(1.0, u) * math.log(1.0 - 2.0 * abs(u))

    def generate_mrc_compliant_report(self) -> dict:
        total_ots = sum(1 for c in self.raw_counts if c["ots"])
        raw_lts = sum(c["lts_prob"] for c in self.raw_counts if c["ots"])
        
        # Add differential privacy noise (Sensitivity = 1.0)
        scale = 1.0 / self.epsilon
        noisy_ots = max(0, int(round(total_ots + self._laplace_noise(scale))))
        noisy_lts = max(0, int(round(raw_lts + self._laplace_noise(scale))))

        return {
            "display_id": self.display_id,
            "observed_passages": len(self.raw_counts),
            "raw_ots": total_ots,
            "differentially_private_ots": noisy_ots,
            "raw_lts_impressions": round(raw_lts, 1),
            "differentially_private_lts": noisy_lts,
            "privacy_guarantee": f"Differential Privacy (Epsilon={self.epsilon}, Zero Biometrics Retained)"
        }

random.seed(42)
agg = PrivacyPreservingFootfallAggregator("SCREEN_ENTRANCE_01", epsilon=0.9)
# Simulate 10 shoppers passing entrance screen
for _ in range(10):
    agg.record_passage(
        angle_deg=random.uniform(-45.0, 45.0),
        distance_m=random.uniform(1.0, 6.0),
        walking_speed_mps=random.uniform(0.8, 1.8)
    )

report = agg.generate_mrc_compliant_report()
print("Privacy-Preserving MRC DOOH Audience Report:")
for k, v in report.items():
    print(f"  {k}: {v}")
"""

p4_output = """Privacy-Preserving MRC DOOH Audience Report:
  display_id: SCREEN_ENTRANCE_01
  observed_passages: 10
  raw_ots: 6
  differentially_private_ots: 6
  raw_lts_impressions: 2.7
  differentially_private_lts: 3
  privacy_guarantee: Differential Privacy (Epsilon=0.9, Zero Biometrics Retained)
"""

p4_question = "How do edge-AI optical sensors ensure compliance with strict biometric privacy statutes (such as Illinois BIPA) while measuring in-store screen viewers?"
p4_options = [
    "By processing gaze vectors locally in volatile RAM and immediately discarding video frames without storing facial geometry, images, or demographic profiles",
    "By asking every shopper to verbally confirm consent before looking at an overhead aisle screen",
    "By encrypting raw facial video files and transmitting them to offshore servers where privacy laws do not apply",
    "By blur-filtering digital screens so that human eyes cannot distinguish the commercial creative"
]
p4_why = "Edge-AI sensors compute gaze/dwell in volatile memory without recording or storing any facial biometric templates or PII."

# ==========================================
# PART 5: Enterprise In-Store DOOH Playlist Orchestrator & Footfall Lift Simulation
# ==========================================
p5_title = "Enterprise In-Store DOOH Playlist Orchestrator & Footfall Lift Simulation in Python"
p5_say = [
    "To unify programmatic VAST video loop scheduling, real-time weather and inventory DCO triggers, and privacy-preserving footfall audience telemetry "
    "into a cohesive enterprise software architecture, commerce engineering teams construct an In-Store DOOH Playlist Orchestrator. This system serves as "
    "the mission-critical edge controller deployed across retail store networks, translating high-level media buying contracts into second-by-second screen "
    "playback schedules that dynamically respond to store conditions.",
    "The architectural design of the orchestrator follows a Three-Tier Pipeline: Ingestion, Dynamic Composition, and Proof-of-Play Telemetry. In the "
    "Ingestion Tier, the orchestrator consumes campaign bookings from the central retail media DSP, regional weather forecasts from meteorological APIs, "
    "and store-level SKU inventory from the retailer's inventory database. These external parameters are evaluated at the beginning of each scheduling cycle "
    "to determine campaign eligibility and active creative variations.",
    "In the Dynamic Composition Tier, the orchestrator constructs the active video loop for each physical display fixture. The engine steps through "
    "available time slots, evaluating brand separation rules to prevent rival advertisers from airing back-to-back. When selecting the specific creative "
    "for an eligible campaign, the system invokes the DCO trigger engine: checking whether local temperature warrants a hot or cold beverage creative, "
    "and confirming that the promoted SKU has sufficient on-shelf inventory. If inventory is depleted, the slot falls back to a secondary brand creative, "
    "guaranteeing that every broadcast second drives actionable physical commerce.",
    "During execution, the edge player simulates video playback and captures second-by-second Proof-of-Play (PoP) telemetry. Concurrently, the footfall "
    "telemetry interface ingests anonymous audience counts, calculating MRC-compliant Likely-to-See impressions for each completed ad playback. By pairing "
    "exact playback timestamps with audience density records, the orchestrator computes empirical effective cost-per-thousand (eCPM) delivery metrics, "
    "verifying that the campaign delivered its contracted impression volume.",
    "Finally, the orchestrator integrates with downstream Store Point-of-Sale (POS) scanner systems to model Footfall Sales Lift. By establishing matched "
    "store groups—comparing stores where the in-store DOOH campaign aired against statistically matched control stores where screens displayed neutral "
    "baseline content—the system measures the incremental unit sales lift directly attributable to in-store screen exposure. This mathematical rigor "
    "provides consumer brands with concrete empirical evidence of in-store advertising effectiveness.",
    "In large enterprise deployments spanning thousands of retail locations, these orchestrators run autonomously as resilient microservices. If local store "
    "internet connectivity drops, the orchestrator continues operating off its cached playlist and local rules engine, storing proof-of-play logs locally in "
    "an encrypted SQLite database. When connectivity restores, the edge player securely syncs batch telemetry to the central cloud data lake, ensuring "
    "seamless operational continuity and complete financial transparency across the retail enterprise.",
    "From a software deployment perspective, enterprise in-store orchestrators are packaged as lightweight, containerized Docker microservices managed via "
    "edge orchestration platforms such as AWS IoT Greengrass, Azure IoT Edge, or enterprise Kubernetes distributions (K3s). Each retail storefront runs "
    "an on-premise edge gateway server that coordinates hundreds of low-power display appliances over isolated local area subnets. Software updates, "
    "VAST protocol patches, and security firmware are pushed over-the-air using canary deployment rings, minimizing store operational disruption.",
    "Data serialization for edge-to-cloud telemetry leverages high-efficiency binary formats, predominantly Apache Avro and Protocol Buffers (Protobuf). "
    "Compared to verbose JSON text payloads, Avro binary serialization reduces network bandwidth consumption by over seventy percent, a critical factor "
    "when thousands of retail stores stream second-by-second proof-of-play events and sensor telemetry over cellular backup modems. The central cloud "
    "ingestion pipeline unpacks these streams into Kafka topics, routing records to real-time analytics engines and downstream billing ledgers.",
    "Finally, the orchestrator architecture bridges directly into Enterprise Retail Clean Rooms (such as Amazon Marketing Cloud, Snowflake, and InfoSum). "
    "By joining in-store screen proof-of-play timestamps with matched loyalty card transaction logs in a privacy-preserving clean room environment, enterprise "
    "marketers conduct closed-loop incrementality testing. Brand directors can prove with statistical significance that in-store screen exposure drove "
    "measurable sales lift over unexposed baseline stores, justifying major retail media budget expansions."
]
p5_example = "An enterprise supermarket chain deployed the In-Store DOOH Playlist Orchestrator across 850 retail stores. The automated system managed 18,000 daily VAST video loops, handled 450 localized stockout creative swaps, and delivered 94 million verified Likely-to-See impressions, unlocking a verified 16.8% incremental sales lift for participating retail media brand partners."
p5_try_it = "Run the full In-Store DOOH Playlist Orchestrator in Python, testing dynamic creative selection, inventory safety fallbacks, and proof-of-play impression calculation."

p5_code = """class EnterpriseInStoreDOOHOrchestrator:
    def __init__(self, store_id: str, loop_sec: int = 60):
        self.store_id = store_id
        self.loop_sec = loop_sec
        self.slot_duration = 15
        self.total_slots = loop_sec // self.slot_duration
        self.bookings: list[dict] = []
        self.playback_log: list[dict] = []

    def register_campaign(self, brand: str, sku: str, base_headline: str, trigger_type: str, cpm: float):
        self.bookings.append({
            "brand": brand,
            "sku": sku,
            "base_headline": base_headline,
            "trigger_type": trigger_type,
            "cpm": cpm
        })

    def render_loop(self, temp_f: float, sku_inventory: dict[str, int], current_footfall: int) -> list[dict]:
        loop_playlist = []
        
        for slot_idx in range(self.total_slots):
            campaign = self.bookings[slot_idx % len(self.bookings)]
            sku = campaign["sku"]
            stock = sku_inventory.get(sku, 0)
            
            # Dynamic Creative Selection
            if stock <= 2:
                headline = f"Discover Quality Favorites at {self.store_id}"
                status = "INVENTORY_FALLBACK"
            elif campaign["trigger_type"] == "WEATHER_HEAT" and temp_f >= 80.0:
                headline = f"Beat the {temp_f:.0f}° Heat! Ice-Cold {campaign['sku']} Available Now"
                status = "DCO_WEATHER_TRIGGERED"
            else:
                headline = campaign["base_headline"]
                status = "STANDARD_PLAYBACK"

            # Calculate Likely-to-See impressions (assume 25% of footfall is in sightline)
            lts_impressions = int(current_footfall * 0.25)
            cost = (lts_impressions / 1000.0) * campaign["cpm"]

            entry = {
                "slot": slot_idx + 1,
                "brand": campaign["brand"],
                "sku": sku,
                "headline": headline,
                "status": status,
                "stock_available": stock,
                "lts_impressions": lts_impressions,
                "slot_cost": round(cost, 3)
            }
            loop_playlist.append(entry)
            self.playback_log.append(entry)

        return loop_playlist

orchestrator = EnterpriseInStoreDOOHOrchestrator("STORE_MIAMI_042", loop_sec=60)
orchestrator.register_campaign("CitrusBeverages", "SKU_SPARKLING_ORANGE", "Crisp Sparkling Citrus", "WEATHER_HEAT", 15.00)
orchestrator.register_campaign("OrganicSnacks", "SKU_BAKED_CHIPS", "Healthy Crunch for the Family", "STANDARD", 12.50)

# Simulate hot day with sparkling orange in stock, baked chips out of stock
inventory = {"SKU_SPARKLING_ORANGE": 85, "SKU_BAKED_CHIPS": 1}
playlist = orchestrator.render_loop(temp_f=88.5, sku_inventory=inventory, current_footfall=640)

print(f"--- In-Store DOOH Active Playlist ({orchestrator.store_id}) ---")
for item in playlist:
    print(f"Slot {item['slot']}: [{item['brand']}] {item['headline']} | Status: {item['status']} | Impr: {item['lts_impressions']}")
"""

p5_output = """--- In-Store DOOH Active Playlist (STORE_MIAMI_042) ---
Slot 1: [CitrusBeverages] Beat the 88° Heat! Ice-Cold SKU_SPARKLING_ORANGE Available Now | Status: DCO_WEATHER_TRIGGERED | Impr: 160
Slot 2: [OrganicSnacks] Discover Quality Favorites at STORE_MIAMI_042 | Status: INVENTORY_FALLBACK | Impr: 160
Slot 3: [CitrusBeverages] Beat the 88° Heat! Ice-Cold SKU_SPARKLING_ORANGE Available Now | Status: DCO_WEATHER_TRIGGERED | Impr: 160
Slot 4: [OrganicSnacks] Discover Quality Favorites at STORE_MIAMI_042 | Status: INVENTORY_FALLBACK | Impr: 160
"""

p5_question = "What architectural benefit does local edge execution provide for in-store retail media DOOH playlist orchestrators?"
p5_options = [
    "It allows screens to continue rendering dynamic playlists and caching proof-of-play logs locally even if store internet connectivity experiences downtime",
    "It permanently eliminates the need for physical electricity by converting radio waves into battery power",
    "It automatically prints paper discount coupons from the back of the television screen whenever footfall increases",
    "It enables store managers to broadcast live cable television sporting events on commercial advertising screens without paying licensing fees"
]
p5_why = "Local edge execution guarantees resilience, allowing signage playback and logging to persist through internet drops."

# ==========================================
# ASSEMBLE DAY 53
# ==========================================
parts = [
    make_part(p1_title, p1_say, p1_example, p1_try_it, p1_code, p1_output, p1_question, p1_options, p1_why),
    make_part(p2_title, p2_say, p2_example, p2_try_it, p2_code, p2_output, p2_question, p2_options, p2_why),
    make_part(p3_title, p3_say, p3_example, p3_try_it, p3_code, p3_output, p3_question, p3_options, p3_why),
    make_part(p4_title, p4_say, p4_example, p4_try_it, p4_code, p4_output, p4_question, p4_options, p4_why),
    make_part(p5_title, p5_say, p5_example, p5_try_it, p5_code, p5_output, p5_question, p5_options, p5_why)
]

total_words = sum(len(" ".join(p["say"]).split()) for p in parts)
print(f"Total Day 53 words: {total_words}")
assert total_words >= 3000, f"Total words under 3000: {total_words}"

day53_data = {
    "day": 53,
    "title": "In-Store Digital Signage & Programmatic DOOH (Digital Out-of-Home): VAST/VPAID Loops, Smart Carts & Foot Traffic Telemetry",
    "course": "bcom_dmkt",
    "description": "Master programmatic digital out-of-home (pDOOH) in brick-and-mortar retail storefronts, VAST/VPAID video loop scheduling, smart cart sensor telemetry, dynamic creative optimization (DCO) weather and inventory triggers, and privacy-preserving MRC footfall audience measurement.",
    "minutes": 38,
    "recap": "Completed Day 53: engineered in-store programmatic DOOH video loop architectures utilizing VAST standards and impression multipliers; modeled AI smart shopping cart and optical dwell sensor telemetry; constructed weather, inventory, and foot-traffic Dynamic Creative Optimization (DCO) trigger engines; and verified privacy-preserving, MRC-compliant Opportunity-to-See (OTS) and Likely-to-See (LTS) audience measurement with differential privacy noise injection.",
    "parts": parts
}

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(day53_data, f, indent=2, ensure_ascii=False)

print(f"Successfully wrote {output_file} ({total_words} words)")
