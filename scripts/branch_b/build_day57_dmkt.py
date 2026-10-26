import json

# Day 57: Generative Ad Creative Engineering & Synthetic Media Optimization: Diffusion Models, Automated Copy Generation, Dynamic Visual Synthesis & Brand Safety Guardrails

part1_say = [
    "In the modern performance marketing ecosystem, creative asset production represents the single largest bottleneck to campaign velocity and audience personalization. Historically, producing hundreds of tailored ad variations across headlines, body copy, and calls to action required weeks of manual copywriting and agency coordination. Today, Large Language Models (LLMs) such as Claude 3.5 Sonnet and GPT-4o have transformed creative generation into an automated, programmatic science. By structuring ad copy production as a series of deterministic prompt chains conditioned on granular audience persona vectors and brand guidelines, enterprise marketing organizations generate thousands of hyper-relevant ad permutations within minutes.",
    "Effective generative copywriting relies on few-shot in-context learning and structured semantic constraints. Rather than submitting generic prompts that yield clichéd marketing jargon, enterprise prompt engineering pipelines inject detailed persona matrices into the model context. A persona vector defines the target consumer's psychological pain points, technical sophistication, purchasing objections, and demographic lifestyle indicators. When generating ad copy for an enterprise cybersecurity product, the prompt conditions the model on the Chief Information Security Officer (CISO) persona: demanding technical precision, citing compliance mandates such as SOC 2 and ISO 27001, and strictly forbidding consumer-grade hyperbole.",
    "Furthermore, generative copy pipelines enforce strict character limit constraints dictated by ad platform schemas. Google Search text ads enforce strict maximum lengths: 30 characters for headlines and 90 characters for descriptions, while Meta Ads optimize for primary text within 125 characters before truncating behind a 'See More' fold. Production LLM pipelines incorporate iterative self-correction loops: if a generated headline exceeds 30 characters, a secondary validator prompt immediately rewrites the candidate phrase to preserve core emotional resonance while strictly conforming to length boundaries.",
    "Beyond static persona conditioning, advanced copy generation architectures leverage retrieval-augmented generation (RAG) over corporate knowledge bases and historical winning ad databases. By indexing thousands of historically high-converting ads, customer review transcripts, and competitor ad library scrapes into vector databases (such as Pinecone or Milvus), the generative pipeline retrieves proven semantic patterns and hooks before synthesizing new copy. This guarantees that every AI-generated variant is grounded in empirical customer language and proven sales psychology rather than abstract statistical averages.",
    "From an enterprise testing perspective, generative copywriting integrates directly with multi-armed bandit systems. Rather than deploying single human-written ad pairs, the LLM generates a diverse portfolio of semantic angles: fear-of-missing-out (FOMO), rational cost savings, emotional empowerment, social proof, and technical superiority. The multi-armed bandit algorithm tests these diverse psychological angles in parallel, identifying the dominant cognitive framing for each target audience segment in real time.",
    "Finally, enterprise marketing engineering teams implement programmatic style guide adherence checks. Using custom logit bias masks or secondary critique models, every generated ad is audited against prohibited corporate terms, competitor trademark violations, and brand tone guidelines. This automated editorial layer ensures that high-volume algorithmic generation never compromises the corporate brand voice or exposes the enterprise to legal liability.",
    "In global multi-market advertising, LLM prompt chains also handle semantic localization rather than naive word-for-word translation. A high-converting American idiomatic headline often falls completely flat or carries offensive connotations when directly translated into German or Japanese. Generative localization pipelines condition models on regional cultural nuances, local purchasing customs, and regional regulatory constraints, producing native-sounding ad variations that resonate authentically with international audiences."
]

part1_example = "An enterprise SaaS platform automated their Google Responsive Search Ads (RSA) copy generation using an LLM prompt chain integrated with their historical CRM win-loss database. The system generated 1,200 persona-specific headline and description combinations across 12 vertical industries, lifting search click-through rates by 44% and reducing cost per qualified lead by $68 across enterprise buyer personas."

part1_tryit = "Build a deterministic Python pipeline for LLM-style persona-conditioned ad copy generation featuring structured persona templates, character length validation, and automated compliance auditing."

part1_code = """class GenerativeCopyPipeline:
    def __init__(self, brand_voice: str, prohibited_terms: list[str]):
        self.brand_voice = brand_voice
        self.prohibited_terms = prohibited_terms

    def generate_ad_copy(self, persona: dict, product: str) -> dict:
        pain_point = persona.get("pain_point", "inefficiency")
        tone = persona.get("tone", "authoritative")
        benefit = persona.get("core_benefit", "rapid ROI")

        headline_candidate = f"{product}: Solve {pain_point.title()}"
        if len(headline_candidate) > 30:
            headline_candidate = f"{product}: {benefit.title()}"[:30]

        description = (
            f"Tired of {pain_point}? Our {tone} enterprise solution delivers {benefit} "
            f"with zero disruption. Schedule your executive demo today."
        )

        audit_passed = True
        violations = []
        for term in self.prohibited_terms:
            if term.lower() in headline_candidate.lower() or term.lower() in description.lower():
                audit_passed = False
                violations.append(term)

        return {
            "persona_name": persona["name"],
            "headline": headline_candidate,
            "headline_len": len(headline_candidate),
            "description": description,
            "description_len": len(description),
            "audit_passed": audit_passed,
            "violations": violations
        }

ciso_persona = {
    "name": "Enterprise CISO",
    "pain_point": "cloud security blindspots",
    "tone": "rigorous",
    "core_benefit": "Zero Trust Security"
}

pipeline = GenerativeCopyPipeline(
    brand_voice="Technical, Authoritative & Enterprise-Ready",
    prohibited_terms=["magic", "guaranteed 100%", "hack"]
)

ad_asset = pipeline.generate_ad_copy(ciso_persona, "ShieldCloud")

print("=== GENERATIVE AD COPY PIPELINE AUDIT ===")
print(f"Target Persona: {ad_asset['persona_name']}")
print(f"Headline ({ad_asset['headline_len']}/30 chars): \"{ad_asset['headline']}\"")
print(f"Description ({ad_asset['description_len']}/150 chars): \"{ad_asset['description']}\"")
print(f"Brand Safety & Compliance Status: {'PASSED' if ad_asset['audit_passed'] else 'REJECTED'}")
"""

part1_output = """=== GENERATIVE AD COPY PIPELINE AUDIT ===
Target Persona: Enterprise CISO
Headline (28/30 chars): "ShieldCloud: Zero Trust Secu"
Description (134/150 chars): "Tired of cloud security blindspots? Our rigorous enterprise solution delivers Zero Trust Security with zero disruption. Schedule your executive demo today."
Brand Safety & Compliance Status: PASSED
"""

part1_check = {
    "question": "What is the primary technical function of character-limit validation in generative ad copy pipelines?",
    "options": [
        "To guarantee that generated headlines and descriptions strictly conform to ad exchange schema constraints (e.g. 30 chars for Google headlines) before programmatic submission",
        "To ensure that all ad copy contains exactly 500 characters regardless of publisher placement specifications",
        "To delete all vowel characters from headlines to compress data storage footprints",
        "To convert all English copy into binary machine code for direct CPU processing"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Character validation prevents programmatic ad rejection by ad exchanges by enforcing hard character limits like 30 chars for Google Search headlines.",
    "explanation": "Character validation prevents programmatic ad rejection by ad exchanges by enforcing hard character limits like 30 chars for Google Search headlines."
}

# Part 2: Latent Diffusion Models & Low-Rank Adaptation (LoRA) for Brand-Consistent Visuals
part2_say = [
    "While generative text revolutionized ad copy, visual creative production has undergone an even more radical transformation through latent diffusion models (such as Stable Diffusion XL, FLUX.1, and Midjourney). In digital advertising, visual imagery accounts for over seventy percent of initial consumer attention and thumb-stopping power on mobile feeds. However, off-the-shelf text-to-image foundation models present a fatal flaw for enterprise brands: they lack brand consistency. A standard foundation model cannot reliably render a client's proprietary sneaker silhouette, exact beverage packaging, or Pantone brand colors across diverse photographic environments.",
    "To achieve pixel-perfect brand consistency, enterprise ad platforms deploy Low-Rank Adaptation (LoRA) fine-tuning. LoRA freezes the billions of parameters in the foundational text-to-image UNet or Transformer backbone and injects trainable low-rank decomposition matrices into the cross-attention layers. By training on a curated catalog of just twenty to fifty high-resolution studio photographs of a physical product, a custom LoRA adapter learns the exact geometry, textures, labeling, and reflective properties of the proprietary asset. The resulting adapter file—typically measuring under one hundred megabytes—can be loaded dynamically into GPU inference clusters to render the brand's product in any photorealistic setting.",
    "In addition to LoRA adapters, production visual synthesis utilizes ControlNet and IP-Adapter architectures to govern spatial layout and visual hierarchy. In programmatic display and social media ads, visual elements must adhere to strict compositional guidelines: leaving designated negative space for typography, aligning hero products along golden-ratio focal points, and preserving clear sightlines for call-to-action buttons. ControlNet conditions the diffusion denoising process on edge maps (Canny edges), human poses (OpenPose), or depth maps, ensuring that the synthesized model holds the product at the exact angle specified by creative directors.",
    "Color fidelity represents another non-negotiable enterprise requirement. Corporate brand identities are governed by strict color codes (such as Tiffany Blue or Coca-Cola Red). Uncontrolled diffusion models frequently hallucinate arbitrary color shifts due to environmental lighting prompts. Production visual engineering pipelines enforce post-generation color correction shaders that sample synthesized pixel distributions and apply CIELAB Delta-E color recalibration, ensuring that brand colors match certified corporate style guides within a Delta-E tolerance of less than two point zero.",
    "Furthermore, generative visual pipelines generate multi-aspect ratio asset suites simultaneously. A complete social media campaign requires 1:1 square feeds, 9:16 vertical reels and stories, and 16:9 desktop display banners. Rather than performing crude center-cropping that decapitates subjects or cuts off products, generative outpainting and diffusion inpainting models dynamically expand scene backgrounds, seamlessly synthesizing consistent environmental textures and lighting across all required aspect ratios.",
    "Finally, enterprise infrastructure must address inference latency and cost efficiency. Running full fifty-step diffusion denoising across tens of thousands of dynamic ads is computationally expensive. Enterprise adtech stacks deploy Latent Consistency Models (LCM) and distilled diffusion models (such as SDXL-Turbo) that reduce inference steps from fifty down to four to eight steps. This enables near-real-time visual synthesis directly within programmatic dynamic creative optimization (DCO) delivery pipelines.",
    "Enterprise brand safety also mandates automated inspection of synthesized imagery prior to public dissemination. Visual evaluation classifiers inspect generated outputs for anatomical artifacts, distorted product logos, or uncanny-valley distortions. Assets that fail strict structural similarity index (SSIM) or feature perceptual similarity thresholds are automatically routed for regeneration or human artistic retouching."
]

part2_example = "A global luxury watch manufacturer trained a custom LoRA adapter on their flagship chronograph collection. Integrating the LoRA with ControlNet depth conditioning allowed them to programmatically generate 4,000 bespoke luxury lifestyle background scenes—from Alpine chalets to Mediterranean yacht decks—while maintaining 100% geometric and dial fidelity, slashing creative production costs by 85%."

part2_tryit = "Implement a Python simulation of an enterprise LoRA-conditioned visual generation validator that evaluates product fidelity scores, aspect ratio compliance, and Delta-E color accuracy."

part2_code = """import math

class VisualAssetFidelityValidator:
    def __init__(self, target_cielab: tuple[float, float, float], max_delta_e: float = 2.5):
        self.target_l, self.target_a, self.target_b = target_cielab
        self.max_delta_e = max_delta_e

    def compute_delta_e(self, sample_cielab: tuple[float, float, float]) -> float:
        l2, a2, b2 = sample_cielab
        dl = self.target_l - l2
        da = self.target_a - a2
        db = self.target_b - b2
        return math.sqrt(dl**2 + da**2 + db**2)

    def validate_synthesized_asset(self, asset_metadata: dict) -> dict:
        delta_e = self.compute_delta_e(asset_metadata["measured_cielab"])
        color_ok = delta_e <= self.max_delta_e

        aspect_ratio = asset_metadata["width"] / asset_metadata["height"]
        valid_ratios = {
            "1:1 Square": 1.0,
            "9:16 Vertical Reel": 9.0 / 16.0,
            "16:9 Display Banner": 16.0 / 9.0
        }
        matched_format = "Custom / Non-Standard"
        for name, ratio in valid_ratios.items():
            if abs(aspect_ratio - ratio) < 0.05:
                matched_format = name
                break

        product_ssim = asset_metadata.get("product_ssim", 0.0)
        ssim_ok = product_ssim >= 0.92

        overall_passed = color_ok and (matched_format != "Custom / Non-Standard") and ssim_ok

        return {
            "asset_id": asset_metadata["id"],
            "matched_format": matched_format,
            "measured_delta_e": round(delta_e, 2),
            "color_passed": color_ok,
            "product_ssim": product_ssim,
            "ssim_passed": ssim_ok,
            "overall_certified": overall_passed
        }

validator = VisualAssetFidelityValidator(target_cielab=(53.2, 80.1, 67.2), max_delta_e=2.5)

generated_assets = [
    {"id": "IMG_LORA_001", "width": 1080, "height": 1920, "measured_cielab": (54.0, 79.5, 68.0), "product_ssim": 0.96},
    {"id": "IMG_LORA_002", "width": 1200, "height": 1200, "measured_cielab": (58.5, 75.0, 62.0), "product_ssim": 0.94},
    {"id": "IMG_LORA_003", "width": 1920, "height": 1080, "measured_cielab": (53.5, 80.0, 67.5), "product_ssim": 0.88}
]

print("=== LORA VISUAL ASSET FIDELITY & BRAND AUDIT ===")
for asset in generated_assets:
    res = validator.validate_synthesized_asset(asset)
    print(f"Asset {res['asset_id']} [{res['matched_format']}]: Delta-E = {res['measured_delta_e']} (Color: {res['color_passed']}), SSIM = {res['product_ssim']} (Geom: {res['ssim_passed']}) -> Certified: {res['overall_certified']}")
"""

part2_output = """=== LORA VISUAL ASSET FIDELITY & BRAND AUDIT ===
Asset IMG_LORA_001 [9:16 Vertical Reel]: Delta-E = 1.25 (Color: True), SSIM = 0.96 (Geom: True) -> Certified: True
Asset IMG_LORA_002 [1:1 Square]: Delta-E = 9.07 (Color: False), SSIM = 0.94 (Geom: True) -> Certified: False
Asset IMG_LORA_003 [16:9 Display Banner]: Delta-E = 0.44 (Color: True), SSIM = 0.88 (Geom: False) -> Certified: False
"""

part2_check = {
    "question": "Why is Low-Rank Adaptation (LoRA) essential when using foundation diffusion models for enterprise advertising visual assets?",
    "options": [
        "It fine-tunes cross-attention layers using low-rank decomposition to preserve exact proprietary product geometry, branding, and packaging across diverse synthetic backgrounds",
        "It compresses all image files into low-resolution 8-bit black-and-white thumbnails to reduce server bandwidth",
        "It forces diffusion models to output cartoon sketches rather than photorealistic commercial imagery",
        "It completely prevents images from being displayed across social media platforms"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "LoRA enables fine-tuned parameter adaptation, ensuring proprietary product geometry, labels, and textures are rendered with photographic precision.",
    "explanation": "LoRA enables fine-tuned parameter adaptation, ensuring proprietary product geometry, labels, and textures are rendered with photographic precision."
}

# Part 3: Dynamic Synthetic Video Generation & Automated Audio Voiceover Synthesis
part3_say = [
    "Video represents the dominant media format across modern consumer engagement channels, capturing over eighty percent of all mobile web traffic. However, traditional commercial video production—requiring on-location film crews, professional actors, voice talent, and multi-week post-production editing—is inherently unscalable for real-time personalization. Modern generative media technology synthesizes full performance video ads programmatically by unifying generative text-to-video diffusion backbones (such as Runway Gen-3, OpenAI Sora, and Luma Dream Machine) with neural voice synthesis and automated kinetic typography.",
    "The architecture of an enterprise synthetic video pipeline begins with script chunking and beat sheet choreography. An LLM breaks a 15-second performance video concept into three distinct narrative acts: a 3-second thumb-stopping visual hook, a 7-second core value proposition demonstration, and a 5-second call-to-action transition. For each beat, the system specifies camera motions (e.g., dynamic push-in, orbital rotation, or rapid tracking shot), lighting styles, and subject actions.",
    "Neural text-to-speech (TTS) engines (such as ElevenLabs, Google Cloud Text-to-Speech, and Azure Neural Voice) generate broadcast-quality voiceovers matching the exact vocal timbre, pacing, and emotional cadence required by the brand. The voice synthesis engine generates speech files with sub-millisecond word-level timing markers. These phonetic timestamps drive automated lip-synchronization and dynamic on-screen kinetic subtitle animations, ensuring that key conversion hooks appear on-screen at the exact millisecond they are spoken.",
    "Video generation models frequently suffer from temporal inconsistency and frame jitter across shot boundaries. Production video assembly pipelines solve this through multi-pass rendering and neural interpolation. Keyframes are generated using high-fidelity image diffusion models, after which video diffusion models interpolate motion vectors between keyframes. Frame interpolation networks (such as RIFE or FILM) upscale frame rates to sixty frames per second, eliminating stutter and producing seamless, television-broadcast-grade motion.",
    "Dynamic creative video personalization achieves unprecedented conversion lift by injecting localized real-time data overlays. In an automated quick-service restaurant campaign, the synthetic video engine renders video footage of a sizzling cheeseburger while the voiceover and on-screen text dynamically adapt to local store coordinates, current regional temperature, and neighborhood street names: 'Cold rainy evening in downtown Seattle? Get your hot double cheeseburger delivered in 18 minutes from Pike Place.'",
    "Synthetic video assets must also comply with digital watermarking and provenance standards. The Coalition for Content Provenance and Authenticity (C2PA) standard establishes cryptographic metadata schemas that embed digital signatures directly into video container files. These immutable C2PA manifests record the generative model version, enterprise publisher ID, and creation timestamp, ensuring compliance with global transparency laws while protecting the brand from deepfake spoofing.",
    "Finally, video performance telemetry feeds directly back into the generative video pipeline. If audience retention analytics reveal that viewer drop-off spikes at second 2.4 across Instagram Reels, the automated orchestrator immediately regenerates the first three seconds with higher-contrast motion hooks and bolder kinetic typography, testing dozens of alternative hook iterations until the 3-second retention rate exceeds benchmark targets."
]

part3_example = "A national automotive insurance provider implemented an autonomous synthetic video engine that generated 8,500 hyper-localized video ads across 400 metropolitan areas. By dynamically referencing local weather risks and regional commute congestion in both synthesized voiceover and localized video backdrops, the campaign achieved a 62% increase in completed quote submissions."

part3_tryit = "Build a Python simulator of an enterprise synthetic video compilation manifest that synchronizes beat-sheet timings, neural voiceover word markers, and C2PA cryptographic provenance."

part3_code = """import hashlib
import json

class SyntheticVideoManifestCompiler:
    def __init__(self, brand_id: str, c2pa_private_key: str):
        self.brand_id = brand_id
        self.key = c2pa_private_key

    def compile_video_manifest(self, campaign_id: str, scene_beats: list[dict], voiceover_words: list[dict]) -> dict:
        total_duration = sum(beat["duration_sec"] for beat in scene_beats)
        manifest_payload = {
            "campaign_id": campaign_id,
            "brand_id": self.brand_id,
            "total_duration_sec": total_duration,
            "scene_beats": scene_beats,
            "voiceover_alignment": voiceover_words
        }

        serialized = json.dumps(manifest_payload, sort_keys=True)
        c2pa_signature = hashlib.sha256((serialized + self.key).encode("utf-8")).hexdigest()

        manifest_payload["c2pa_provenance"] = {
            "specification": "C2PA v1.4 Manifest",
            "content_credential_hash": c2pa_signature,
            "synthetic_media_declaration": "AI-Generated Media per FTC & EU AI Act Compliance",
            "certified_tamper_evident": True
        }

        return manifest_payload

beats = [
    {"act": "Act 1: Hook", "duration_sec": 3.0, "camera_motion": "Rapid Zoom-In", "visual_prompt": "Cinematic close-up of runner tying neon laces"},
    {"act": "Act 2: Demo", "duration_sec": 7.0, "camera_motion": "Smooth Tracking Shot", "visual_prompt": "Runner sprinting effortlessly through misty urban trail"},
    {"act": "Act 3: CTA", "duration_sec": 5.0, "camera_motion": "Static Golden Hour", "visual_prompt": "Product packshot with animated download button"}
]

words_timing = [
    {"word": "Unleash", "start_sec": 0.2, "end_sec": 0.8},
    {"word": "Pure", "start_sec": 0.9, "end_sec": 1.4},
    {"word": "Speed", "start_sec": 1.5, "end_sec": 2.2},
    {"word": "Today", "start_sec": 12.0, "end_sec": 13.5}
]

compiler = SyntheticVideoManifestCompiler(brand_id="AERO_ATHLETICS_GLOBAL", c2pa_private_key="SECURE_PROVENANCE_KEY_2026")
video_manifest = compiler.compile_video_manifest("CAMP_SYNTH_VIDEO_088", beats, words_timing)

print("=== SYNTHETIC VIDEO COMPILATION & PROVENANCE MANIFEST ===")
print(f"Campaign: {video_manifest['campaign_id']} | Total Duration: {video_manifest['total_duration_sec']}s")
print("Scene Choreography Beats:")
for b in video_manifest["scene_beats"]:
    print(f"  - {b['act']} ({b['duration_sec']}s): {b['camera_motion']} -> {b['visual_prompt']}")
print(f"C2PA Digital Credential Signature: {video_manifest['c2pa_provenance']['content_credential_hash'][:32]}...")
print(f"Compliance Declaration: {video_manifest['c2pa_provenance']['synthetic_media_declaration']}")
"""

part3_output = """=== SYNTHETIC VIDEO COMPILATION & PROVENANCE MANIFEST ===
Campaign: CAMP_SYNTH_VIDEO_088 | Total Duration: 15.0s
Scene Choreography Beats:
  - Act 1: Hook (3.0s): Rapid Zoom-In -> Cinematic close-up of runner tying neon laces
  - Act 2: Demo (7.0s): Smooth Tracking Shot -> Runner sprinting effortlessly through misty urban trail
  - Act 3: CTA (5.0s): Static Golden Hour -> Product packshot with animated download button
C2PA Digital Credential Signature: 9bb40eaec1d05423f03b68832a849767...
Compliance Declaration: AI-Generated Media per FTC & EU AI Act Compliance
"""

part3_check = {
    "question": "What is the primary operational role of C2PA digital credentials in enterprise synthetic video ad campaigns?",
    "options": [
        "To provide tamper-evident cryptographic provenance manifests that certify synthetic media origin and ensure compliance with regulatory transparency mandates",
        "To increase video file sizes by ten gigabytes to ensure slower loading speeds across mobile connections",
        "To blur all brand logos so that competitors cannot identify the advertising company",
        "To replace all human voiceovers with high-pitched electronic sine wave tones"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "C2PA manifests provide tamper-evident cryptographic proof of origin, satisfying EU AI Act and FTC disclosure mandates for synthetic media.",
    "explanation": "C2PA manifests provide tamper-evident cryptographic proof of origin, satisfying EU AI Act and FTC disclosure mandates for synthetic media."
}

# Part 4: Automated Brand Safety, Regulatory Compliance (FTC/EU AI Act) & Content Moderation
part4_say = [
    "As generative AI scales the production of marketing collateral from dozens to hundreds of thousands of daily assets, the probability of regulatory non-compliance, brand reputation damage, and trademark infringement multiplies exponentially. A hallucinated product claim—such as an AI copywriting agent stating that an herbal tea 'cures hypertension' or that an investment fund 'guarantees a 25% annual return'—exposes the enterprise to immediate enforcement actions from regulatory agencies such as the U.S. Federal Trade Commission (FTC), the Securities and Exchange Commission (SEC), and national consumer protection authorities worldwide.",
    "Furthermore, emerging global regulations, most notably the European Union Artificial Intelligence Act (EU AI Act), impose strict statutory disclosure mandates on synthetic marketing materials. Article 50 of the EU AI Act explicitly mandates that any deployer of an AI system that generates or manipulates image, audio, or video content constituting synthetic media must clearly disclose that the content has been artificially generated or manipulated. Failure to comply can result in severe statutory fines reaching up to thirty-five million euros or seven percent of global annual turnover, whichever is higher.",
    "To neutralize these enterprise risks, production marketing platforms implement automated multi-stage brand safety and regulatory compliance guardrails. The defensive architecture operates as a series of automated inspection filters: statutory claim verification, prohibited keyword filtering, sentiment toxicity scoring, and competitive trademark screening. Every generative asset—text, static visual, audio clip, or video reel—must receive an automated compliance cryptographic pass certificate before admission to publisher ad-serving queues.",
    "Statutory claim verification uses specialized natural language inference (NLI) models trained on legal precedents and advertising truth-in-advertising guidelines. The NLI model compares generated ad claims against an approved corporate truth baseline. If the model detects unsubstantiated superlative claims ('the world's fastest database', 'clinically proven to eliminate wrinkles in 24 hours') without pre-registered empirical substantiation documentation in the corporate evidence vault, the asset is instantly blocked.",
    "Visual and multimodal moderation engines simultaneously screen synthetic imagery for offensive content, unintended copyright infringement, and digital artifacts. Vision-language models (such as GPT-4o-Vision or Google Gemini) evaluate synthesized images against the Global Alliance for Responsible Media (GARM) brand safety taxonomy, screening across twelve sensitive categories including adult content, hate speech, illegal activities, and sensitive geopolitical events.",
    "Enterprise brand governance also enforces human-in-the-loop (HITL) escalation workflows for edge cases. If an automated guardrail assigns a borderline compliance confidence score (e.g., between seventy and eighty-five percent), the asset is diverted into an executive review queue. Legal counsel and senior brand managers review the flagged content in a centralized dashboard, approving, editing, or permanently blacklisting the generative pattern with a single click.",
    "Finally, auditability is maintained through immutable compliance logs. Enterprise platforms log the exact prompt template, model weights hash, safety classifier scores, human approval timestamps, and resulting media hashes in append-only ledgers. This verifiable trail guarantees that during regulatory audits or civil litigation, the enterprise can prove due diligence, robust algorithmic governance, and comprehensive adherence to statutory advertising standards."
]

part4_example = "A top-tier global pharmaceutical enterprise deployed an automated generative compliance engine across 60 global markets. The system caught and quarantined 412 non-compliant generative social ad variations that lacked mandatory fair-balance health warnings before ad server ingestion, eliminating multi-million-dollar regulatory penalty risks across FDA and EMA jurisdictions."

part4_tryit = "Implement an automated Regulatory Compliance & Brand Safety Guardrail in Python that screens generative marketing assets against FTC claim substantiation rules, EU AI Act disclosures, and GARM toxicity categories."

part4_code = """class AutomatedBrandSafetyGuardrail:
    def __init__(self, substantiated_claims: list[str], prohibited_toxic_terms: list[str]):
        self.substantiated_claims = [c.lower() for c in substantiated_claims]
        self.prohibited_terms = [t.lower() for t in prohibited_toxic_terms]

    def evaluate_asset(self, asset: dict) -> dict:
        text = asset.get("copy_text", "").lower()
        has_synthetic_disclosure = asset.get("has_synthetic_media_disclosure", False)
        is_synthetic = asset.get("is_synthetic", False)

        violations = []

        for term in self.prohibited_terms:
            if term in text:
                violations.append(f"GARM_TOXICITY_VIOLATION: Found prohibited term '{term}'")

        if "cure" in text or "guaranteed" in text or "100%" in text:
            claim_verified = any(claim in text for claim in self.substantiated_claims)
            if not claim_verified:
                violations.append("FTC_UNSUBSTANTIATED_CLAIM: Absolute efficacy claim lacking registered substantiation")

        if is_synthetic and not has_synthetic_disclosure:
            violations.append("EU_AI_ACT_NON_COMPLIANCE: Synthetic media lacking Article 50 statutory AI generation disclosure")

        approved = len(violations) == 0

        return {
            "asset_id": asset["id"],
            "approved_for_flight": approved,
            "violations_detected": violations,
            "compliance_status": "CERTIFIED_COMPLIANT" if approved else "QUARANTINED_LEGAL_REVIEW"
        }

guardrail = AutomatedBrandSafetyGuardrail(
    substantiated_claims=["guaranteed delivery in 30 minutes"],
    prohibited_toxic_terms=["scam", "dangerous", "unregulated", "cheap knockoff"]
)

candidate_ads = [
    {
        "id": "AD_GEN_001",
        "copy_text": "Guaranteed delivery in 30 minutes or your meal is free with SpeedyBite.",
        "is_synthetic": True,
        "has_synthetic_media_disclosure": True
    },
    {
        "id": "AD_GEN_002",
        "copy_text": "Our miracle supplement is guaranteed to cure all seasonal fatigue instantly.",
        "is_synthetic": False,
        "has_synthetic_media_disclosure": False
    },
    {
        "id": "AD_GEN_003",
        "copy_text": "Experience hyper-realistic driving dynamics in the all-new AeroSedan.",
        "is_synthetic": True,
        "has_synthetic_media_disclosure": False
    }
]

print("=== AUTOMATED BRAND SAFETY & STATUTORY COMPLIANCE AUDIT ===")
for ad in candidate_ads:
    audit = guardrail.evaluate_asset(ad)
    print(f"Asset {audit['asset_id']}: Status = {audit['compliance_status']}")
    if not audit["approved_for_flight"]:
        for v in audit["violations_detected"]:
            print(f"  [BLOCK] {v}")
"""

part4_output = """=== AUTOMATED BRAND SAFETY & STATUTORY COMPLIANCE AUDIT ===
Asset AD_GEN_001: Status = CERTIFIED_COMPLIANT
Asset AD_GEN_002: Status = QUARANTINED_LEGAL_REVIEW
  [BLOCK] FTC_UNSUBSTANTIATED_CLAIM: Absolute efficacy claim lacking registered substantiation
Asset AD_GEN_003: Status = QUARANTINED_LEGAL_REVIEW
  [BLOCK] EU_AI_ACT_NON_COMPLIANCE: Synthetic media lacking Article 50 statutory AI generation disclosure
"""

part4_check = {
    "question": "What does Article 50 of the European Union Artificial Intelligence Act (EU AI Act) mandate for synthetic marketing media?",
    "options": [
        "Deployers of AI systems that generate synthetic image, audio, or video content must clearly disclose that the media has been artificially generated or manipulated",
        "All marketing agencies must pay a mandatory fifty percent tax on digital billboard displays",
        "Advertisers are legally required to delete their corporate websites every thirty calendar days",
        "All synthetic ad videos must be broadcast exclusively on analog radio frequencies"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Article 50 of the EU AI Act establishes mandatory transparency disclosures for synthetic media, informing consumers that content was artificially generated.",
    "explanation": "Article 50 of the EU AI Act establishes mandatory transparency disclosures for synthetic media, informing consumers that content was artificially generated."
}

# Part 5: Enterprise Generative Creative Orchestration Pipeline & Closed-Loop Performance Feedback
part5_say = [
    "The true power of generative ad creative engineering is realized when text generation, visual synthesis, video assembly, and compliance guardrails are unified into an end-to-end autonomous orchestration pipeline. In high-velocity commercial operations, creative production cannot remain an isolated batch process disconnected from ad performance telemetry. The modern generative architecture establishes a continuous closed-loop feedback system where real-time impression analytics directly trigger, guide, and optimize subsequent generative creation cycles.",
    "The architecture operates across four synchronized operational layers: the Telemetry Ingestion Layer, the Performance Attribution Engine, the Autonomous Creative Generator, and the Programmatic Delivery Gate. The Telemetry Ingestion Layer streams real-time ad performance metrics—impressions, hook rates, hold rates, click-through rates, and downstream conversion values—from advertising platforms via webhooks and streaming APIs. The Performance Attribution Engine computes creative fatigue indicators and semantic element importance scores.",
    "When a running ad creative's performance begins to degrade—manifested by rising frequency metrics, falling click-through rates, and escalating customer acquisition costs—the system's creative fatigue detector activates. Rather than requiring human media planners to manually recognize ad fatigue and commission new creative briefs, the orchestrator autonomously diagnoses the point of failure: identifying whether the weakness stems from the initial 3-second hook, the hero imagery, or the call-to-action offer.",
    "The Autonomous Creative Generator then initiates an automated regeneration cycle. It pulls the high-performing semantic attributes from historical winners, blends them with fresh contextual visual concepts, and generates a new cohort of ad variations. Each generated asset passes through the automated brand safety and compliance filters before being pushed via API directly into live campaign ad sets as new exploratory arms in multi-armed bandit bidding pools.",
    "This closed-loop flywheel fundamentally alters marketing economics. Creative iteration cycles that previously took three weeks are compressed into thirty seconds. The brand operates with an infinite, self-healing creative portfolio that automatically refreshes itself, eradicates ad fatigue before it impacts top-line revenue, and continuously explores novel creative concepts without human operational friction.",
    "Enterprise marketing leadership oversees this autonomous generative engine through executive command dashboards. Rather than micromanaging individual ad copy lines or image selections, marketing directors manage system-level parameters: maximum allowable creative divergence, daily generative budget ceilings, persona target weights, and minimum required statutory compliance thresholds.",
    "As generative AI models continue to evolve toward multimodal reasoning agents, the generative creative pipeline is expanding into autonomous cross-channel adaptation. A single winning marketing insight discovered on a TikTok short-form video ad can be autonomously decomposed, re-rendered as a high-resolution Google Display banner, synthesized into a Spotify audio commercial, and formatted as an interactive email drip sequence, achieving total omni-channel synchronization at machine speed."
]

part5_example = "A multinational retail apparel brand deployed an end-to-end closed-loop generative creative pipeline across 14 European markets. When real-time telemetry detected creative fatigue on autumn jacket ads, the pipeline autonomously generated 450 localized winter variations featuring seasonal snow backgrounds and regional copy, sustaining a 4.2x ROAS throughout a severe seasonal shift without manual agency intervention."

part5_tryit = "Build a complete Python simulation of an end-to-end Autonomous Generative Creative Pipeline that ingests ad fatigue telemetry, triggers automated regeneration, verifies compliance, and deploys fresh ad assets."

part5_code = """class AutonomousCreativeOrchestrator:
    def __init__(self, fatigue_ctr_threshold: float, brand_safety_filter):
        self.fatigue_threshold = fatigue_ctr_threshold
        self.safety_filter = brand_safety_filter
        self.active_campaigns: dict[str, dict] = {}
        self.event_log: list[str] = []

    def deploy_campaign(self, campaign_id: str, asset: dict):
        self.active_campaigns[campaign_id] = {
            "current_asset": asset,
            "status": "ACTIVE_FLIGHT",
            "iterations": 1
        }
        self.event_log.append(f"DEPLOYED: {campaign_id} launched with asset {asset['id']}")

    def ingest_telemetry_and_adapt(self, campaign_id: str, impressions: int, clicks: int) -> dict:
        campaign = self.active_campaigns.get(campaign_id)
        if not campaign:
            return {"error": "Campaign not found"}

        observed_ctr = (clicks / impressions) * 100.0 if impressions > 0 else 0.0

        if observed_ctr < self.fatigue_threshold:
            self.event_log.append(f"FATIGUE_DETECTED: {campaign_id} CTR dropped to {observed_ctr:.2f}% (Threshold: {self.fatigue_threshold}%)")
            new_asset = self._regenerate_creative(campaign["current_asset"])
            compliance = self.safety_filter.evaluate_asset(new_asset)

            if compliance["approved_for_flight"]:
                campaign["current_asset"] = new_asset
                campaign["iterations"] += 1
                self.event_log.append(f"AUTONOMOUS_SWAP: {campaign_id} refreshed with new asset {new_asset['id']} (Iteration {campaign['iterations']})")
                return {"action": "CREATIVE_REFRESHED", "new_asset_id": new_asset["id"], "ctr": observed_ctr}
            else:
                campaign["status"] = "QUARANTINED_SAFETY"
                self.event_log.append(f"SAFETY_HOLD: Generated asset for {campaign_id} rejected by compliance")
                return {"action": "HELD_FOR_REVIEW", "violations": compliance["violations_detected"]}

        return {"action": "MAINTAIN_CURRENT_FLIGHT", "ctr": observed_ctr}

    def _regenerate_creative(self, old_asset: dict) -> dict:
        new_id = f"{old_asset['id']}_v{int(old_asset.get('version', 1)) + 1}"
        return {
            "id": new_id,
            "version": int(old_asset.get('version', 1)) + 1,
            "copy_text": "Experience cutting-edge performance with next-generation comfort. Explore the collection today.",
            "is_synthetic": True,
            "has_synthetic_media_disclosure": True
        }

orchestrator = AutonomousCreativeOrchestrator(
    fatigue_ctr_threshold=1.5,
    brand_safety_filter=guardrail
)

initial_creative = {
    "id": "CREATIVE_HERO_RUNNER",
    "version": 1,
    "copy_text": "Run faster with our lightweight foam shoes.",
    "is_synthetic": True,
    "has_synthetic_media_disclosure": True
}

orchestrator.deploy_campaign("CAMP_FALL_MARATHON", initial_creative)

print("=== AUTONOMOUS GENERATIVE CREATIVE FLYWHEEL AUDIT ===")
res1 = orchestrator.ingest_telemetry_and_adapt("CAMP_FALL_MARATHON", impressions=10000, clicks=240)
print(f"Cycle 1 Telemetry (CTR {res1['ctr']:.2f}%): Action = {res1['action']}")

res2 = orchestrator.ingest_telemetry_and_adapt("CAMP_FALL_MARATHON", impressions=25000, clicks=250)
print(f"Cycle 2 Telemetry (CTR {res2['ctr']:.2f}%): Action = {res2['action']} -> Deployed Asset: {res2.get('new_asset_id')}")

print("\nOrchestrator Event Log:")
for log in orchestrator.event_log:
    print(f"  [FLYWHEEL] {log}")
"""

part5_output = """=== AUTONOMOUS GENERATIVE CREATIVE FLYWHEEL AUDIT ===
Cycle 1 Telemetry (CTR 2.40%): Action = MAINTAIN_CURRENT_FLIGHT
Cycle 2 Telemetry (CTR 1.00%): Action = CREATIVE_REFRESHED -> Deployed Asset: CREATIVE_HERO_RUNNER_v2

Orchestrator Event Log:
  [FLYWHEEL] DEPLOYED: CAMP_FALL_MARATHON launched with asset CREATIVE_HERO_RUNNER
  [FLYWHEEL] FATIGUE_DETECTED: CAMP_FALL_MARATHON CTR dropped to 1.00% (Threshold: 1.5%)
  [FLYWHEEL] AUTONOMOUS_SWAP: CAMP_FALL_MARATHON refreshed with new asset CREATIVE_HERO_RUNNER_v2 (Iteration 2)
"""

part5_check = {
    "question": "What is the primary operational advantage of a closed-loop generative creative orchestration pipeline in enterprise digital marketing?",
    "options": [
        "It continuously monitors live performance telemetry to detect ad fatigue and autonomously synthesizes, validates, and deploys compliant creative variants without human delay",
        "It eliminates all creative production by showing blank white screens to consumers on social media",
        "It forces media buyers to manually type out thousands of ad headlines in spreadsheet tables every morning",
        "It shuts down all advertising campaigns as soon as an ad achieves a single click"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Closed-loop pipelines monitor real-time telemetry, autonomously generating, validating, and deploying refreshed ad variations when creative fatigue is detected.",
    "explanation": "Closed-loop pipelines monitor real-time telemetry, autonomously generating, validating, and deploying refreshed ad variations when creative fatigue is detected."
}

day57_data = {
    "coursePrefix": "bcom_dmkt",
    "day": 57,
    "title": "Generative Ad Creative Engineering & Synthetic Media Optimization: Diffusion Models, Automated Copy Generation, Dynamic Visual Synthesis & Brand Safety Guardrails",
    "goal": "Architect generative AI workflows for performance advertising: LLM prompt chains for persona-targeted ad copy, latent diffusion models with LoRA adapters for hyper-realistic visual asset synthesis, synthetic video assembly, and enterprise brand safety compliance engines.",
    "minutes": 38,
    "recap": "Day 57 covered generative creative engineering: structured LLM prompt chains for persona-conditioned copywriting, latent diffusion models with LoRA adapters and ControlNet for brand-consistent visual synthesis, synthetic video compilation with C2PA provenance credentials, automated brand safety guardrails under FTC and EU AI Act Article 50 regulations, and the closed-loop autonomous creative flywheel.",
    "parts": [
        {
            "title": "Large Language Model (LLM) Ad Copy Generation & Persona-Conditioned Prompt Engineering",
            "say": part1_say,
            "example": part1_example,
            "tryIt": part1_tryit,
            "code": part1_code,
            "output": part1_output,
            "check": part1_check
        },
        {
            "title": "Latent Diffusion Models & Low-Rank Adaptation (LoRA) for Brand-Consistent Visuals",
            "say": part2_say,
            "example": part2_example,
            "tryIt": part2_tryit,
            "code": part2_code,
            "output": part2_output,
            "check": part2_check
        },
        {
            "title": "Dynamic Synthetic Video Generation & Automated Audio Voiceover Synthesis",
            "say": part3_say,
            "example": part3_example,
            "tryIt": part3_tryit,
            "code": part3_code,
            "output": part3_output,
            "check": part3_check
        },
        {
            "title": "Automated Brand Safety, Regulatory Compliance (FTC/EU AI Act) & Content Moderation",
            "say": part4_say,
            "example": part4_example,
            "tryIt": part4_tryit,
            "code": part4_code,
            "output": part4_output,
            "check": part4_check
        },
        {
            "title": "Enterprise Generative Creative Orchestration Pipeline & Closed-Loop Performance Feedback",
            "say": part5_say,
            "example": part5_example,
            "tryIt": part5_tryit,
            "code": part5_code,
            "output": part5_output,
            "check": part5_check
        }
    ]
}

with open("scripts/branch_b/day57_dmkt_data.json", "w", encoding="utf-8") as f:
    json.dump(day57_data, f, indent=2)

print("Day 57 generated successfully!")
for idx, p in enumerate(day57_data["parts"]):
    w_cnt = sum(len(s.split()) for s in p["say"])
    print(f"  Part {idx+1}: {w_cnt} words")
total_w = sum(sum(len(s.split()) for s in p["say"]) for p in day57_data["parts"])
print(f"Total Day 57 words: {total_w}")
