from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class PostInfo(BaseModel):
    name: str
    phone: str
    location: object
    duration_of_abuse: str
    frequency_of_incidents: str
    preferred_contact_method: List[str]
    current_situation: str
    culprit_description: str
    custom_text: Optional[str] = None
    language: Optional[str] = "en-IN"
    english_text: Optional[str] = None
    original_text: Optional[str] = None


class FileContent(BaseModel):
    filename: str
    content: str


class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en-IN"
    session_id: Optional[str] = None
    voice_enabled: Optional[bool] = False


class FormExtractRequest(BaseModel):
    transcript: str
    language: Optional[str] = "en-IN"


class IntentRequest(BaseModel):
    command: str
    language: Optional[str] = "en-IN"


class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "en-IN"
    speaker: Optional[str] = None
