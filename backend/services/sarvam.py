import os
import logging
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv
from sarvamai import SarvamAI

load_dotenv()
logger = logging.getLogger(__name__)


class SarvamService:
    """
    Sovereign Indic AI service wrapping Sarvam AI 105B models.
    Provides Indic legal advisory, conversational therapy, and complaint extraction.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("SARVAM_API_KEY")
        self._client: Optional[SarvamAI] = None
        if self.api_key:
            try:
                self._client = SarvamAI(api_subscription_key=self.api_key)
                logger.info("Sarvam AI client successfully initialized.")
            except Exception as e:
                logger.warning(f"Failed to initialize SarvamAI client: {e}")

    @property
    def is_available(self) -> bool:
        return self._client is not None

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "sarvam-105b-conversations",
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> Optional[str]:
        if not self._client:
            return None
        try:
            response = self._client.chat.completions(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            if response and response.choices and len(response.choices) > 0:
                return response.choices[0].message.content
        except Exception as e:
            logger.warning(f"Sarvam AI completion error: {e}")
        return None


_sarvam_instance: Optional[SarvamService] = None


def get_sarvam_service() -> SarvamService:
    global _sarvam_instance
    if _sarvam_instance is None:
        _sarvam_instance = SarvamService()
    return _sarvam_instance
