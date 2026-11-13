"""
Gnani AI Service (Vachana Speech Platform)
Supports STT (Prisma v3.0) and TTS (Timbre v2.5) across Indian Languages:
Hindi, English, Tamil, Telugu, Kannada, Bengali, Marathi, etc.
"""

import os
import requests
from typing import Dict, Any, Optional

GNANI_API_BASE = "https://api.vachana.ai"

def get_gnani_api_key() -> str:
    key = os.getenv("GNANI_API_KEY")
    if not key:
        raise ValueError("GNANI_API_KEY environment variable is missing.")
    return key

def transcribe_audio(
    audio_bytes: bytes,
    filename: str = "audio.wav",
    content_type: str = "audio/wav",
    language_code: str = "indic-auto"
) -> Dict[str, Any]:
    """
    Transcribes audio using Gnani AI Prisma v3.0 STT
    """
    api_key = get_gnani_api_key()
    url = f"{GNANI_API_BASE}/stt/v3"
    headers = {"X-API-Key-ID": api_key}

    # Automatically correct format by magic bytes
    detected_mime = content_type
    detected_filename = filename
    if len(audio_bytes) >= 4 and audio_bytes[:4] == b"RIFF":
        detected_mime = "audio/wav"
        detected_filename = "audio.wav"
    elif len(audio_bytes) >= 4 and audio_bytes[:4] == b"OggS":
        detected_mime = "audio/ogg"
        detected_filename = "audio.ogg"
    elif (len(audio_bytes) >= 3 and audio_bytes[:3] == b"ID3") or (len(audio_bytes) >= 2 and audio_bytes[:2] == b"\xff\xfb"):
        detected_mime = "audio/mpeg"
        detected_filename = "audio.mp3"

    files = {"audio_file": (detected_filename, audio_bytes, detected_mime)}
    data = {
        "model": "prisma-v3.0",
        "language_code": language_code
    }

    response = requests.post(url, headers=headers, files=files, data=data, timeout=30)
    response.raise_for_status()
    return response.json()

def synthesize_speech(
    text: str,
    language_code: str = "hi-IN",
    voice: str = "Nalini",
    speed: float = 1.0
) -> bytes:
    """
    Synthesizes speech from text using Gnani AI Timbre v2.5 TTS
    """
    api_key = get_gnani_api_key()
    url = f"{GNANI_API_BASE}/api/v1/tts/inference"
    headers = {
        "Content-Type": "application/json",
        "X-API-Key-ID": api_key
    }
    payload = {
        "text": text[:400],
        "voice": voice,
        "model": "timbre-v2.5",
        "language": language_code,
        "speed": speed,
        "audio_config": {
            "sample_rate": 24000,
            "num_channels": 1,
            "sample_width": 2,
            "encoding": "linear_pcm",
            "container": "wav"
        }
    }

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    return response.content

