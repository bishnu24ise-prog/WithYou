"""
Voice Extraction & Intent Recognition using Google Gemini.
Extracts structured PostInfo fields from freeform victim speech narratives,
and classifies voice commands into a strict enum.
"""

import os
import json
import logging
from typing import Dict, Any, Optional
try:
    import google.generativeai as genai
except ImportError:
    genai = None

logger = logging.getLogger("safespark.voice_extraction")

FORM_EXTRACTION_SYSTEM = """
You are an expert, trauma-informed assistant for SafeSpark. A woman in domestic distress has spoken freely about her situation.
Extract the structured fields from her words into the exact JSON format below.

Output JSON Schema:
{
  "name": "string (Victim name or pseudonym, or empty string)",
  "phone": "string (Phone number if mentioned, or empty string)",
  "location": {
    "city": "string (City or area mentioned)",
    "address": "string (Specific address or locality)",
    "lat": 28.6139,
    "lng": 77.2090
  },
  "duration_of_abuse": "string (e.g. '2 years', '6 months', or empty string)",
  "frequency_of_incidents": "string (e.g. 'Daily', 'Weekly', 'Ongoing', or empty string)",
  "visible_injuries": "Yes" | "No",
  "preferred_contact": ["Phone" | "Email" | "Text message" | "In-person"],
  "current_situation": "string (Clear summary of what is happening and any threats)",
  "culprit_description": "string (Relationship, appearance, behavior of the perpetrator)",
  "missing_required_fields": ["array of field names that are critical and missing, e.g. 'name', 'current_situation'"],
  "follow_up_question": "string (A single, gentle, comforting question in the user's language asking for the most critical missing info, or empty string if complete)"
}

Rules:
1. Extract whatever is available without inventing fake details.
2. If language is not English, generate the follow_up_question in the user's spoken language.
3. If immediate severe violence or weapon is mentioned, set visible_injuries to 'Yes' and highlight urgency.
"""

INTENT_CLASSIFICATION_SYSTEM = """
Classify the user's spoken command into one of the following strict intent enums:
- NEXT (e.g. 'next', 'अगला', 'आगे चलो', 'পরবর্তী')
- BACK (e.g. 'back', 'पीछे', 'वापस', 'முந்தைய')
- CLEAR_FIELD (e.g. 'clear this field', 'हटाओ', 'साफ़ करो', 'মুছে ফেলো')
- READ_ALOUD (e.g. 'read this aloud', 'पढ़कर सुनाओ', 'எனக்கு படி', 'পড়ে শোনাও')
- GOTO_LAWBOT (e.g. 'go to lawbot', 'legal advice', 'कानूनी सलाह', 'lawyer')
- GOTO_THERAPY (e.g. 'go to therapy', 'talk to companion', 'बात करनी है', 'माया')
- CHANGE_LANG (e.g. 'change language to hindi', 'भाषा बदलो', 'switch to bengali')
- QUICK_EXIT (e.g. 'quick exit', 'emergency exit', 'बंद करो', 'तुरंत बाहर निकलो')
- DICTATION (The user is dictating message/complaint text, not giving a navigation command)

Output JSON:
{
  "intent": "NEXT" | "BACK" | "CLEAR_FIELD" | "READ_ALOUD" | "GOTO_LAWBOT" | "GOTO_THERAPY" | "CHANGE_LANG" | "QUICK_EXIT" | "DICTATION",
  "target_language": "string or null (e.g. 'hi-IN' if intent is CHANGE_LANG)",
  "is_destructive": true | false
}
"""


def extract_form_from_speech(transcript: str, language: str = "en-IN") -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        # Graceful fallback heuristic
        return {
            "name": "",
            "phone": "",
            "location": {"city": "", "address": "", "lat": 28.6139, "lng": 77.2090},
            "duration_of_abuse": "Ongoing",
            "frequency_of_incidents": "Frequent",
            "visible_injuries": "No",
            "preferred_contact": ["Phone"],
            "current_situation": transcript,
            "culprit_description": "",
            "missing_required_fields": ["name", "culprit_description"],
            "follow_up_question": "Can you share your name or what name you would like to be called?",
        }

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json", "temperature": 0.1},
        system_instruction=FORM_EXTRACTION_SYSTEM,
    )

    prompt = f"User's spoken transcript ({language}):\n{transcript}"
    try:
        resp = model.generate_content(prompt)
        return json.loads(resp.text)
    except Exception as e:
        logger.error("Gemini form extraction error: %s", e)
        return {
            "name": "",
            "phone": "",
            "location": {"city": "", "address": "", "lat": 28.6139, "lng": 77.2090},
            "duration_of_abuse": "Ongoing",
            "frequency_of_incidents": "Frequent",
            "visible_injuries": "No",
            "preferred_contact": ["Phone"],
            "current_situation": transcript,
            "culprit_description": "",
            "missing_required_fields": [],
            "follow_up_question": "",
        }


def classify_voice_intent(command_text: str, language: str = "en-IN") -> Dict[str, Any]:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return {"intent": "DICTATION", "target_language": None, "is_destructive": False}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json", "temperature": 0.0},
        system_instruction=INTENT_CLASSIFICATION_SYSTEM,
    )

    prompt = f"Command text ({language}): {command_text}"
    try:
        resp = model.generate_content(prompt)
        return json.loads(resp.text)
    except Exception as e:
        logger.error("Intent classification error: %s", e)
        return {"intent": "DICTATION", "target_language": None, "is_destructive": False}
