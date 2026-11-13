"""
Speech-to-Text (STT) Service Abstraction for SafeSpark.
Supports Gnani AI Prisma v3.0 (Primary for Indic languages & speech-to-text),
Sarvam AI Saaras v4, and Google Cloud Speech-to-Text (Fallback).
Provider is swappable via STT_PROVIDER env var (default: 'gnani').
"""

import os
import io
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import requests

logger = logging.getLogger("safespark.stt")

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
DEFAULT_SARVAM_MODEL = os.getenv("SARVAM_STT_MODEL", "saaras:v4")


class BaseSTTService(ABC):
    @abstractmethod
    def transcribe(
        self, audio_bytes: bytes, filename: str = "audio.wav", language: str = "en-IN", mode: str = "transcribe"
    ) -> Dict[str, Any]:
        """
        Transcribe audio bytes.
        Returns: { 'text': str, 'language': str, 'confidence': float, 'provider': str }
        """
        pass


class SarvamSTTService(BaseSTTService):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.getenv("SARVAM_API_KEY")
        self.model = model or os.getenv("SARVAM_STT_MODEL", DEFAULT_SARVAM_MODEL)

    def transcribe(
        self, audio_bytes: bytes, filename: str = "audio.wav", language: str = "en-IN", mode: str = "transcribe"
    ) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("SARVAM_API_KEY is not configured")

        headers = {
            "api-subscription-key": self.api_key,
        }

        # Determine mime type
        mime = "audio/wav"
        if filename.endswith(".mp3"):
            mime = "audio/mpeg"
        elif filename.endswith(".webm"):
            mime = "audio/webm"
        elif filename.endswith(".ogg"):
            mime = "audio/ogg"

        files = {
            "file": (filename, io.BytesIO(audio_bytes), mime),
        }
        data = {
            "model": self.model,
            "mode": mode,  # "transcribe" or "translate"
        }

        # Language code matching
        if language:
            data["language_code"] = language

        resp = requests.post(SARVAM_STT_URL, headers=headers, files=files, data=data, timeout=25)
        if not resp.ok:
            logger.error("Sarvam STT failed: %s - %s", resp.status_code, resp.text)
            raise RuntimeError(f"Sarvam STT error {resp.status_code}: {resp.text}")

        res_json = resp.json()
        transcript = res_json.get("transcript", "")
        detected_lang = res_json.get("language_code", language)

        return {
            "text": transcript.strip(),
            "language": detected_lang,
            "confidence": 0.95,
            "provider": "sarvam",
        }


class GoogleCloudSTTService(BaseSTTService):
    def transcribe(
        self, audio_bytes: bytes, filename: str = "audio.wav", language: str = "en-IN", mode: str = "transcribe"
    ) -> Dict[str, Any]:
        # Google Speech-to-Text client integration
        try:
            from google.cloud import speech
            client = speech.SpeechClient()
            audio = speech.RecognitionAudio(content=audio_bytes)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code=language,
                enable_automatic_punctuation=True,
            )
            response = client.recognize(config=config, audio=audio)
            transcript = " ".join([result.alternatives[0].transcript for result in response.results])
            return {
                "text": transcript.strip(),
                "language": language,
                "confidence": 0.90,
                "provider": "google",
            }
        except Exception as e:
            logger.error("Google Cloud STT fallback failed: %s", e)
            raise RuntimeError(f"Google Cloud STT error: {e}")


class GnaniSTTService(BaseSTTService):
    def transcribe(
        self, audio_bytes: bytes, filename: str = "audio.wav", language: str = "indic-auto", mode: str = "transcribe"
    ) -> Dict[str, Any]:
        from backend.services.gnani import transcribe_audio
        mime = "audio/wav"
        if filename.endswith(".mp3"):
            mime = "audio/mpeg"
        elif filename.endswith(".webm"):
            mime = "audio/webm"
        elif filename.endswith(".ogg"):
            mime = "audio/ogg"

        lang_code = language or "indic-auto"
        res = transcribe_audio(audio_bytes, filename=filename, content_type=mime, language_code=lang_code)
        transcript = res.get("transcript", "")
        detected = res.get("detected_language_code", lang_code)
        return {
            "text": transcript.strip(),
            "language": detected,
            "confidence": 0.95,
            "provider": "gnani",
        }


def get_stt_service() -> BaseSTTService:
    provider = os.getenv("STT_PROVIDER", "").lower()
    if provider == "google":
        return GoogleCloudSTTService()
    if provider == "sarvam":
        return SarvamSTTService()
    # Default to Gnani AI (Prisma v3.0) using active credits
    return GnaniSTTService()

