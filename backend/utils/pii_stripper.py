"""
Privacy & Safety Shield: PII Stripper for SafeSpark & TinyFish Integration
Strips sensitive survivor personal data (names, phones, emails, Aadhaar, exact coordinates, house addresses)
before any outbound network call is made to TinyFish Search, Fetch, or Web Agent.
"""

import re
from typing import Dict, Any, Union

# Regex patterns for common sensitive Indian identifiers and PII
PHONE_REGEX = re.compile(
    r'(?:(?:\+|00)91[\s.-]?)?(?:[6-9]\d{4}[\s.-]?\d{5}|[6-9]\d{9}|\b\d{3,5}[-\s]?\d{6,8}\b)',
    re.IGNORECASE
)
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
AADHAAR_REGEX = re.compile(r'\b\d{4}[\s-]\d{4}[\s-]\d{4}\b|\b\d{12}\b')
COORDINATE_REGEX = re.compile(
    r'[-+]?\b[0-8]?\d\.\d{3,8},\s*[-+]?(?:1[0-7]\d|[0-9]?\d)\.\d{3,8}\b'
)
STREET_ADDRESS_REGEX = re.compile(
    r'\b(?:flat\s*(?:no\.?|#)?\s*\w+|house\s*(?:no\.?|#)?\s*\w+|h\.?\s*no\.?\s*\w+|plot\s*no\.?\s*\w+|room\s*no\.?\s*\w+|gali\s*no\.?\s*\w+|block\s*[-A-Z0-9]+|sector\s*\d+|street\s*\d+|floor\s*\d+)\b[^,\n]*',
    re.IGNORECASE
)
NAME_PREFIX_REGEX = re.compile(
    r'\b(?:my name is|i am|complainant is|victim is|survivor is|calling on behalf of)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b',
    re.IGNORECASE
)

def strip_pii_from_text(text: str, keep_city: bool = True) -> str:
    """
    Strips PII from any user text, question, or goal description.
    Replaces sensitive data with generic, safe placeholders.
    """
    if not text or not isinstance(text, str):
        return text

    sanitized = text

    # 1. Remove Email addresses
    sanitized = EMAIL_REGEX.sub('[CONFIDENTIAL_EMAIL]', sanitized)

    # 2. Remove Indian Phone & Mobile numbers (preserves 3-4 digit national helplines like 112, 1091, 181, 1930)
    def phone_replacer(match):
        val = match.group(0).strip()
        cleaned = re.sub(r'[\s\+\-\.]', '', val)
        if len(cleaned) in (3, 4) and cleaned in {'112', '1091', '181', '1930', '1090', '100', '101', '102'}:
            return val  # Keep official national helplines
        return '[PROTECTED_PHONE]'

    sanitized = PHONE_REGEX.sub(phone_replacer, sanitized)

    # 3. Remove Aadhaar / National ID
    sanitized = AADHAAR_REGEX.sub('[GOVT_ID_REDACTED]', sanitized)

    # 4. Remove precise GPS coordinates
    sanitized = COORDINATE_REGEX.sub('[APPROX_DISTRICT_ZONE]', sanitized)

    # 5. Remove street/flat/house level addresses
    sanitized = STREET_ADDRESS_REGEX.sub('[LOCAL_AREA]', sanitized)

    # 6. Neutralize explicit name introductions
    sanitized = NAME_PREFIX_REGEX.sub('complainant is [PROTECTED_CITIZEN]', sanitized)

    return sanitized

def sanitize_tinyfish_payload(payload: Union[Dict[str, Any], str]) -> Union[Dict[str, Any], str]:
    """
    Recursively scrubs PII from dictionaries, lists, or strings before sending to TinyFish.
    """
    if isinstance(payload, str):
        return strip_pii_from_text(payload)
    elif isinstance(payload, dict):
        sanitized_dict = {}
        for k, v in payload.items():
            # Never transmit raw location coordinates or full name
            if k.lower() in ('lat', 'lng', 'latitude', 'longitude', 'aadhaar', 'phone', 'mobile'):
                continue
            elif k.lower() in ('name', 'fullname', 'username'):
                sanitized_dict[k] = '[CITIZEN_REDACTED]'
            elif isinstance(v, (str, dict, list)):
                sanitized_dict[k] = sanitize_tinyfish_payload(v)
            else:
                sanitized_dict[k] = v
        return sanitized_dict
    elif isinstance(payload, list):
        return [sanitize_tinyfish_payload(item) for item in payload]
    return payload
