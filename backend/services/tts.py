"""
Text-to-Speech (TTS) Service Abstraction for SafeSpark.
Supports Sarvam AI Bulbul v3 (Primary for Indian languages) and ElevenLabs (Fallback).
Provider is swappable via TTS_PROVIDER env var.
"""

import os
import io
import base64
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import requests

logger = logging.getLogger("safespark.tts")

SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"
DEFAULT_SARVAM_MODEL = os.getenv("SARVAM_TTS_MODEL", "bulbul:v3")

# Bulbul v3 official supported languages (10 Indic + English)
BULBUL_SUPPORTED_LANGS = {
    "en-IN",
    "hi-IN",
    "bn-IN",
    "ta-IN",
    "te-IN",
    "kn-IN",
    "ml-IN",
    "mr-IN",
    "gu-IN",
    "pa-IN",
    "od-IN",
    "or-IN",
}

# Preferred empathetic female speakers per language
DEFAULT_SPEAKERS = {
    "hi-IN": "ritu",
    "en-IN": "priya",
    "bn-IN": "puja",
    "ta-IN": "ananya",
    "te-IN": "kavya",
    "kn-IN": "shreya",
    "ml-IN": "divya",
    "mr-IN": "swati",
    "gu-IN": "radhika",
    "pa-IN": "simran",
    "od-IN": "sunita",
}


class BaseTTSService(ABC):
    @abstractmethod
    def synthesize(self, text: str, language: str = "en-IN", speaker: Optional[str] = None) -> Dict[str, Any]:
        """
        Synthesize speech from text.
        Returns: { 'audio_base64': str, 'format': 'mp3'|'wav', 'language': str, 'provider': str, 'supported': bool }
        """
        pass


class SarvamTTSService(BaseTTSService):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.getenv("SARVAM_API_KEY")
        self.model = model or os.getenv("SARVAM_TTS_MODEL", DEFAULT_SARVAM_MODEL)

    def synthesize(self, text: str, language: str = "en-IN", speaker: Optional[str] = None) -> Dict[str, Any]:
        # Normalize language tag
        lang_code = language
        if lang_code == "od-IN":
            lang_code = "od-IN"

        # Check if language is supported by Bulbul v3
        if lang_code not in BULBUL_SUPPORTED_LANGS:
            logger.info("Language %s not supported by Bulbul v3. Routing to fallback.", language)
            # Try ElevenLabs fallback if available
            eleven_key = os.getenv("ELEVEN_LABS_API_KEY") or os.getenv("ELEVENLABS_API_KEY")
            if eleven_key:
                return ElevenLabsTTSService(api_key=eleven_key).synthesize(text, language)
            return {
                "audio_base64": None,
                "format": None,
                "language": language,
                "provider": "none",
                "supported": False,
                "message": f"Spoken replies not supported in Bulbul v3 for {language}",
            }

        if not self.api_key:
            raise ValueError("SARVAM_API_KEY is not configured")

        headers = {
            "api-subscription-key": self.api_key,
            "Content-Type": "application/json",
        }

        # Select speaker
        chosen_speaker = speaker or DEFAULT_SPEAKERS.get(lang_code, "shubh")

        payload = {
            "text": text[:2500],  # Bulbul v3 max 2500 chars
            "language_code": lang_code,
            "model": self.model,
            "speaker": chosen_speaker,
            "audio_format": "mp3",
        }

        resp = requests.post(SARVAM_TTS_URL, headers=headers, json=payload, timeout=25)
        if not resp.ok:
            logger.error("Sarvam TTS failed: %s - %s", resp.status_code, resp.text)
            raise RuntimeError(f"Sarvam TTS error {resp.status_code}: {resp.text}")

        res_json = resp.json()
        audios = res_json.get("audios", [])
        if not audios:
            raise RuntimeError("Sarvam TTS returned empty audio list")

        return {
            "audio_base64": audios[0],
            "format": "mp3",
            "language": language,
            "provider": "sarvam",
            "supported": True,
        }


class ElevenLabsTTSService(BaseTTSService):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("ELEVEN_LABS_API_KEY") or os.getenv("ELEVENLABS_API_KEY")
        self.voice_id = os.getenv("ELEVENLABS_VOICE_ID", "cgSgspJ2msm6clMCkdW9")

    def synthesize(self, text: str, language: str = "en-IN", speaker: Optional[str] = None) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "audio_base64": None,
                "format": None,
                "language": language,
                "provider": "elevenlabs",
                "supported": False,
                "message": "ElevenLabs API key not configured",
            }

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.8},
        }

        resp = requests.post(url, headers=headers, json=data, timeout=25)
        if not resp.ok:
            logger.error("ElevenLabs TTS failed: %s", resp.status_code)
            raise RuntimeError(f"ElevenLabs TTS error {resp.status_code}")

        audio_b64 = base64.b64encode(resp.content).decode("utf-8")
        return {
            "audio_base64": audio_b64,
            "format": "mp3",
            "language": language,
            "provider": "elevenlabs",
            "supported": True,
        }


def get_tts_service() -> BaseTTSService:
    provider = os.getenv("TTS_PROVIDER", "sarvam").lower()
    if provider == "elevenlabs":
        return ElevenLabsTTSService()
    return SarvamTTSService()

