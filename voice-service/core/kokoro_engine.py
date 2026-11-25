import os
import time
import io
import asyncio
import logging
import soundfile as sf
import urllib.request

logger = logging.getLogger("voice_service.kokoro_engine")

def phoneme_to_speech_class(phoneme: str) -> str:
    p = phoneme.lower().strip()
    if not p or p in ("sil", "sp", "pau", "", "_"):
        return "REST_NEUTRAL"
    if p in ("p", "b", "m"):
        return "BILABIAL_CLOSE"
    if p in ("f", "v"):
        return "LABIODENTAL"
    if p in ("t", "d", "s", "z", "th", "dh", "sh", "zh", "ch", "jh", "n", "l", "r", "j", "k", "g"):
        return "DENTAL_NARROW"
    if p in ("aa", "ae", "ah", "ao", "a", "ɑ", "ʌ", "æ"):
        return "VOWEL_OPEN"
    if p in ("uw", "uh", "ow", "u", "w", "o", "ʊ", "u:", "oʊ", "ɔ"):
        return "VOWEL_ROUND"
    if p in ("iy", "ih", "ey", "eh", "i", "e", "i:", "ɪ", "eɪ", "ɛ"):
        return "VOWEL_WIDE"
    return "REST_NEUTRAL"


def generate_estimated_visemes(text: str, duration_sec: float) -> list[dict]:
    safe_duration = max(0.1, duration_sec)
    cleaned = "".join(c for c in text.lower() if c.isalnum() or c.isspace())
    words = cleaned.strip().split()
    if not words:
        return [{"start_s": 0.0, "end_s": safe_duration, "speechClass": "REST_NEUTRAL", "weight": 0.0}]

    total_units = sum(len(w) + 1.2 for w in words)
    time_per_letter = safe_duration / total_units

    raw_events = []
    current_time = 0.03

    for word in words:
        word_dur = (len(word) + 0.5) * time_per_letter
        char_dur = word_dur / len(word)
        for i, ch in enumerate(word):
            next_ch = word[i + 1] if i + 1 < len(word) else ""
            speech_class = "REST_NEUTRAL"
            weight = 0.85
            if ch in ("p", "b", "m"):
                speech_class = "BILABIAL_CLOSE"
                weight = 1.0
            elif ch in ("f", "v"):
                speech_class = "LABIODENTAL"
            elif ch in ("w", "u") or (ch == "o" and next_ch == "o"):
                speech_class = "VOWEL_ROUND"
            elif ch == "o":
                speech_class = "VOWEL_ROUND"
            elif ch == "a":
                speech_class = "VOWEL_OPEN"
            elif ch in ("e", "i", "y"):
                speech_class = "VOWEL_WIDE"
            elif ch in "tdsznrlcjkg":
                speech_class = "DENTAL_NARROW"

            start_s = round(current_time, 3)
            end_s = round(current_time + char_dur, 3)
            current_time += char_dur
            raw_events.append({
                "start_s": start_s,
                "end_s": end_s,
                "speechClass": speech_class,
                "weight": 0.0 if speech_class == "REST_NEUTRAL" else weight
            })

        gap_dur = 0.7 * time_per_letter
        raw_events.append({
            "start_s": round(current_time, 3),
            "end_s": round(current_time + gap_dur, 3),
            "speechClass": "REST_NEUTRAL",
            "weight": 0.0
        })
        current_time += gap_dur

    coalesced = []
    for ev in raw_events:
        if not coalesced:
            coalesced.append(dict(ev))
            continue
        if coalesced[-1]["speechClass"] == ev["speechClass"]:
            coalesced[-1]["end_s"] = ev["end_s"]
        else:
            coalesced.append(dict(ev))

    if coalesced:
        coalesced[-1]["end_s"] = max(coalesced[-1]["end_s"], safe_duration)

    return coalesced


try:
    from kokoro_onnx import Kokoro
    HAS_KOKORO = True
except ImportError:
    HAS_KOKORO = False

class NeuralTTSEngine:
    """100% Pure Kokoro ONNX Neural Speech Engine with Auto-Downloader & Edge-TTS Fallback."""

    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(NeuralTTSEngine, cls).__new__(cls)
            cls._instance._init_engine()
        return cls._instance

    def _init_engine(self):
        self.sample_rate = 24000
        self.kokoro = None
        self.active_model_file = None
        self.voices = {
            "af_heart": "Heart (US Female)",
            "af_bella": "Bella (US Female)",
            "af_sarah": "Sarah (US Female)",
            "af_nicole": "Nicole (US Female)",
            "af_sky": "Sky (US Female)",
            "bf_emma": "Emma (UK Female)",
            "bf_isabella": "Isabella (UK Female)",
            "am_liam": "Liam (US Male)",
            "am_fenrir": "Fenrir (US Male)",
            "am_adam": "Adam (US Male)",
            "bm_lewis": "Lewis (UK Male)",
            "bm_george": "George (UK Male)",
            "priya": "Priya (Female Mentor)",
            "mentor_female": "AI Mentor Female",
            "mentor_male": "AI Mentor Male",
        }

        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        models_dir = os.path.join(base_dir, "models")
        os.makedirs(models_dir, exist_ok=True)

        # Quantized Kokoro v1.0 INT8 (88MB) + voices-v1.0.bin (27MB) fits Render 512MB RAM and includes all v1.0 voices
        model_file = os.getenv("KOKORO_MODEL_FILE", "kokoro-v1.0.int8.onnx")
        voices_file = os.getenv("KOKORO_VOICES_FILE", "voices-v1.0.bin")
        self.model_path = os.path.join(models_dir, model_file)
        self.voices_path = os.path.join(models_dir, voices_file)

        # Auto-download quantized v1.0 weights if not baked into Docker image
        self._ensure_model_files()

        if HAS_KOKORO and os.path.exists(self.model_path) and os.path.exists(self.voices_path):
            try:
                self.kokoro = Kokoro(self.model_path, self.voices_path)
                self.active_model_file = model_file
                logger.info(f"Successfully loaded Kokoro ONNX ({model_file}) into RAM!")
            except Exception as e:
                logger.error(f"Failed to load Kokoro ONNX ({model_file}): {e}")
        else:
            logger.warning("Kokoro ONNX v1.0 model files missing or kokoro-onnx package not installed.")

    def get_status(self) -> dict:
        return {
            "status": "ready" if self.kokoro is not None else "fallback",
            "has_kokoro": HAS_KOKORO,
            "model_loaded": self.kokoro is not None,
            "model_file": self.active_model_file,
            "engine": "kokoro-v1.0-int8" if self.kokoro is not None else "edge-tts",
            "sample_rate": self.sample_rate,
            "voices": list(self.voices.keys())
        }

    def _ensure_model_files(self):
        # When KOKORO_REAL=false (e.g. CI, dev), skip the model download.
        kokoro_real = os.getenv("KOKORO_REAL", "true").lower() in ("true", "1", "yes")
        if not kokoro_real:
            logger.info("KOKORO_REAL=false — skipping model download, using edge-tts fallback.")
            return

        MODEL_URL = os.getenv(
            "KOKORO_MODEL_URL",
            "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx",
        )
        VOICES_URL = os.getenv(
            "KOKORO_VOICES_URL",
            "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
        )

        if not os.path.exists(self.model_path) or os.path.getsize(self.model_path) < 10_000_000:
            logger.info(f"Downloading Kokoro v1.0 INT8 model weights from {MODEL_URL}...")
            try:
                urllib.request.urlretrieve(MODEL_URL, self.model_path)
                logger.info("Kokoro v1.0 INT8 model download complete.")
            except Exception as e:
                logger.error(f"Failed to download Kokoro v1.0 INT8 model: {e}")

        if not os.path.exists(self.voices_path) or os.path.getsize(self.voices_path) < 1_000_000:
            logger.info(f"Downloading Kokoro v1.0 voices from {VOICES_URL}...")
            try:
                urllib.request.urlretrieve(VOICES_URL, self.voices_path)
                logger.info("Kokoro v1.0 voices download complete.")
            except Exception as e:
                logger.error(f"Failed to download Kokoro v1.0 voices: {e}")

    async def generate_audio_async(self, text: str, voice: str = "priya", speed: float = 1.0) -> tuple[bytes, float, list[dict]]:
        """Synthesizes speech using Kokoro-82M v1.0 INT8 ONNX Neural Engine with strict Male/Female gender fidelity."""
        t_start = time.time()

        # Comprehensive voice mapping for Kokoro v1.0 style vectors (mirrors src/lib/tts.ts KOKORO_VOICE_MAP exactly)
        PERSONA_TO_KOKORO = {
            # Female Mentors & Interviewers
            "priya": "af_heart",
            "mentor_female": "af_heart",
            "maya": "bf_emma",
            "divya": "af_nicole",
            "neha": "af_bella",
            "shalini": "bf_isabella",
            "sneha": "af_sarah",
            "aisha": "af_sky",
            # Male Mentors & Interviewers
            "anish": "am_liam",
            "akash": "bm_lewis",
            "mentor_male": "am_adam",
            "kashyap": "am_fenrir",
            "karthic": "am_adam",
            "vikram": "bm_lewis",
            "aditya": "am_adam",
            "rajesh": "am_liam",
            "rohan": "am_fenrir",
            "abhijit": "bm_george",
        }

        v_norm = (voice or "priya").strip().lower()
        kokoro_voice = PERSONA_TO_KOKORO.get(v_norm, v_norm if v_norm.startswith(("af_", "am_", "bf_", "bm_")) else "af_heart")
        lang = "en-gb" if kokoro_voice.startswith("b") else "en-us"

        if self.kokoro is not None:
            try:
                samples = None
                sample_rate = self.sample_rate
                visemes = []

                if hasattr(self.kokoro, "create_timed"):
                    try:
                        samples, sample_rate, timings = await asyncio.to_thread(
                            self.kokoro.create_timed,
                            text,
                            voice=kokoro_voice,
                            speed=speed,
                            lang=lang
                        )
                        for t in timings:
                            sc = phoneme_to_speech_class(getattr(t, "phoneme", ""))
                            visemes.append({
                                "start_s": round(getattr(t, "start", 0.0), 3),
                                "end_s": round(getattr(t, "end", 0.0), 3),
                                "speechClass": sc,
                                "weight": 1.0 if sc == "BILABIAL_CLOSE" else 0.85
                            })
                    except Exception as timed_err:
                        logger.warning(f"Kokoro create_timed failed, falling back to create: {timed_err}")

                if samples is None:
                    samples, sample_rate = await asyncio.to_thread(
                        self.kokoro.create,
                        text,
                        voice=kokoro_voice,
                        speed=speed,
                        lang=lang
                    )

                buffer = io.BytesIO()
                sf.write(buffer, samples, sample_rate, format='WAV', subtype='PCM_16')
                wav_bytes = buffer.getvalue()
                
                duration_sec = len(samples) / float(sample_rate)
                if not visemes:
                    visemes = generate_estimated_visemes(text, duration_sec)

                latency_ms = (time.time() - t_start) * 1000
                logger.info(f"Kokoro ONNX synthesized '{text[:30]}...' in {latency_ms:.1f}ms using voice={kokoro_voice} speed={speed}")
                return wav_bytes, duration_sec, visemes
            except Exception as e:
                logger.error(f"Kokoro ONNX synthesis error: {e}")

        # Edge-TTS fallback with strict gender- and accent-matched neural voices for all Kokoro IDs & persona names
        EDGE_TTS_VOICE_MAP = {
            # Female
            "priya": "en-IN-NeerjaNeural",
            "af_heart": "en-IN-NeerjaNeural",
            "mentor_female": "en-IN-NeerjaNeural",
            "sneha": "en-US-EmmaNeural",
            "af_sarah": "en-US-EmmaNeural",
            "neha": "en-US-AvaNeural",
            "af_bella": "en-US-AvaNeural",
            "divya": "en-US-JennyNeural",
            "af_nicole": "en-US-JennyNeural",
            "aisha": "en-US-AriaNeural",
            "af_sky": "en-US-AriaNeural",
            "maya": "en-GB-SoniaNeural",
            "bf_emma": "en-GB-SoniaNeural",
            "shalini": "en-GB-LibbyNeural",
            "bf_isabella": "en-GB-LibbyNeural",
            # Male
            "anish": "en-IN-PrabhatNeural",
            "am_liam": "en-IN-PrabhatNeural",
            "rajesh": "en-IN-PrabhatNeural",
            "mentor_male": "en-IN-PrabhatNeural",
            "rohan": "en-US-AndrewNeural",
            "kashyap": "en-US-AndrewNeural",
            "am_fenrir": "en-US-AndrewNeural",
            "aditya": "en-US-BrianNeural",
            "karthic": "en-US-BrianNeural",
            "am_adam": "en-US-BrianNeural",
            "vikram": "en-GB-RyanNeural",
            "akash": "en-GB-RyanNeural",
            "bm_lewis": "en-GB-RyanNeural",
            "abhijit": "en-GB-ThomasNeural",
            "bm_george": "en-GB-ThomasNeural",
        }
        edge_voice = EDGE_TTS_VOICE_MAP.get(v_norm) or EDGE_TTS_VOICE_MAP.get(kokoro_voice)
        if not edge_voice:
            if kokoro_voice.startswith(("am_", "bm_")) or v_norm in ("mentor_male", "anish", "akash", "rohan", "vikram", "kashyap", "karthic", "aditya", "rajesh", "abhijit"):
                edge_voice = "en-US-AndrewNeural"
            else:
                edge_voice = "en-US-AvaNeural"

        import edge_tts
        communicate = edge_tts.Communicate(text, edge_voice, rate="+5%")
        buffer = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                buffer.write(chunk["data"])
        wav_bytes = buffer.getvalue()
        duration_sec = max(0.5, len(text) / 15.0)
        visemes = generate_estimated_visemes(text, duration_sec)
        return wav_bytes, duration_sec, visemes

    def generate_audio(self, text: str, voice: str = "priya", speed: float = 1.0) -> tuple[bytes, float, list[dict]]:
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                import nest_asyncio
                nest_asyncio.apply()
                return loop.run_until_complete(self.generate_audio_async(text, voice, speed))
            else:
                return loop.run_until_complete(self.generate_audio_async(text, voice, speed))
        except Exception:
            return asyncio.run(self.generate_audio_async(text, voice, speed))

KokoroEngine = NeuralTTSEngine
kokoro_engine = NeuralTTSEngine()
engine = NeuralTTSEngine()
