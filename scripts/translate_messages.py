#!/usr/bin/env python3
"""
One-off / Maintenance script to translate frontend message dictionaries using Google Gemini.
Usage:
  python scripts/translate_messages.py --locale bn-IN
  python scripts/translate_messages.py --all
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent
MESSAGES_DIR = BASE_DIR / "frontend" / "messages"
BASE_FILE = MESSAGES_DIR / "en-IN.json"

TARGET_LANGUAGES = {
    "bn-IN": {"name": "Bengali (India)", "nativeName": "বাংলা"},
    "ta-IN": {"name": "Tamil (India)", "nativeName": "தமிழ்"},
    "te-IN": {"name": "Telugu (India)", "nativeName": "తెలుగు"},
    "kn-IN": {"name": "Kannada (India)", "nativeName": "ಕನ್ನಡ"},
    "ml-IN": {"name": "Malayalam (India)", "nativeName": "മലയാളം"},
    "mr-IN": {"name": "Marathi (India)", "nativeName": "मराठी"},
    "gu-IN": {"name": "Gujarati (India)", "nativeName": "ગુજરાતી"},
    "pa-IN": {"name": "Punjabi (India)", "nativeName": "ਪੰਜਾਬੀ"},
    "od-IN": {"name": "Odia (India)", "nativeName": "ଓଡ଼ିଆ"},
    "as-IN": {"name": "Assamese (India)", "nativeName": "অসমীয়া"},
    "ur-IN": {"name": "Urdu (India)", "nativeName": "اردو"},
}

SYSTEM_INSTRUCTION = """
You are a compassionate, trauma-informed translator for SafeSpark, an emergency safety and legal aid platform for women in India facing domestic violence.

CRITICAL RULES:
1. Translate all values into natural, everyday spoken language in the target language's native script.
2. Tone MUST be warm, empathetic, simple, and direct. Avoid formal, legalistic, archaic, or Sanskritized vocabulary that a distressed person or someone with low literacy would struggle to read.
3. NEVER translate or alter:
   - The brand name 'SafeSpark'
   - Emergency helpline numbers ('112', '1091', '181', '7827170170')
   - Statutory act names and section numbers ('PWDVA 2005', 'BNS', 'IPC 498A', 'POSH Act, 2013'). You may append a natural local explanation.
4. PRESERVE ALL PLACEHOLDERS EXACTLY as-is. E.g., '{name}', '{lat}', '{lng}', '{lang}'. Do not alter or translate text inside curly braces.
5. Return ONLY a valid JSON object matching the exact keys and structure of the input JSON. Do not include markdown formatting or backticks around the JSON.
"""


def load_gemini_api_key():
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if key:
        return key

    # Check env files
    for p in [BASE_DIR / "backend" / ".env", BASE_DIR / "frontend" / ".env.local"]:
        if p.exists():
            with open(p, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("GEMINI_API_KEY=") or line.startswith("GOOGLE_API_KEY="):
                        val = line.split("=", 1)[1].strip().strip('"').strip("'")
                        if val and not val.startswith("your_"):
                            return val
    return None


def translate_locale(locale_code, lang_info, api_key):
    try:
        import google.generativeai as genai
    except ImportError:
        print("Error: google-generativeai is not installed. Run 'pip install google-generativeai'.")
        return False

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={"response_mime_type": "application/json", "temperature": 0.2},
        system_instruction=SYSTEM_INSTRUCTION,
    )

    with open(BASE_FILE, "r", encoding="utf-8") as f:
        en_content = json.load(f)

    # Exclude _meta during prompt
    payload = {k: v for k, v in en_content.items() if k != "_meta"}

    prompt = f"""
Target Language: {lang_info['name']} (Native script: {lang_info['nativeName']}, BCP-47: {locale_code})

Translate this complete JSON dictionary into {lang_info['name']}:
{json.dumps(payload, ensure_ascii=False, indent=2)}
"""

    print(f"Translating {locale_code} ({lang_info['nativeName']}) via Gemini...")
    try:
        response = model.generate_content(prompt)
        translated_dict = json.loads(response.text)

        # Re-attach verified _meta
        translated_dict["_meta"] = {
            "locale": locale_code,
            "name": lang_info["name"],
            "nativeName": lang_info["nativeName"],
            "machineTranslated": True,
            "needsNativeReview": True,
        }

        output_path = MESSAGES_DIR / f"{locale_code}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(translated_dict, f, ensure_ascii=False, indent=2)

        print(f"✅ Successfully wrote {output_path}")
        return True
    except Exception as e:
        print(f"❌ Failed to translate {locale_code}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Translate SafeSpark message files using Gemini.")
    parser.add_argument("--locale", help="Specific locale to translate (e.g. bn-IN)")
    parser.add_argument("--all", action="store_true", help="Translate all supported Indic locales")
    args = parser.parse_args()

    api_key = load_gemini_api_key()
    if not api_key:
        print("Note: GEMINI_API_KEY is not set in environment or .env files.")
        print("Locale placeholder files are already initialized with full key parity in frontend/messages/.")
        print("Set GEMINI_API_KEY to run live AI batch translations.")
        sys.exit(0)

    if args.locale:
        if args.locale not in TARGET_LANGUAGES:
            print(f"Error: Unknown locale '{args.locale}'. Available: {list(TARGET_LANGUAGES.keys())}")
            sys.exit(1)
        translate_locale(args.locale, TARGET_LANGUAGES[args.locale], api_key)
    elif args.all:
        for loc, info in TARGET_LANGUAGES.items():
            translate_locale(loc, info, api_key)
    else:
        print("Specify --locale <code|all> to run translations.")


if __name__ == "__main__":
    main()

