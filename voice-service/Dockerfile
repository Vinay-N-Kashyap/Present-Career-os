FROM python:3.10-slim

WORKDIR /app

# Install native audio & phonemizer libraries required by kokoro-onnx and soundfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libsndfile1 \
    espeak-ng \
    && rm -rf /var/lib/apt/lists/*

# Keep ONNX Runtime memory footprint well under Render 512MB Free Tier limit
ENV OMP_NUM_THREADS=2 \
    OPENBLAS_NUM_THREADS=2 \
    MKL_NUM_THREADS=2 \
    PYTHONUNBUFFERED=1 \
    KOKORO_MODEL_FILE=kokoro-v1.0.int8.onnx \
    KOKORO_VOICES_FILE=voices-v1.0.bin

# Copy requirements and install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-bake quantized Kokoro v1.0 INT8 (88MB) + voices-v1.0.bin (27MB) at build time
# Prevents 45s runtime download stalls and fits cleanly inside 512MB RAM on Render Free Tier
RUN mkdir -p /app/models && \
    curl -fsSL -o /app/models/kokoro-v1.0.int8.onnx \
      https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx && \
    curl -fsSL -o /app/models/voices-v1.0.bin \
      https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin

# Copy application files
COPY . .

# Render injects dynamic $PORT (default 10000); local dev defaults to 3005
EXPOSE 3005

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:${PORT:-3005}/api/v1/health/live || curl -f http://localhost:${PORT:-3005}/api/v1/health || exit 1

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-3005}"]
