#!/usr/bin/env python3
"""
CI / Lint script to verify i18n parity across all locale files in SafeSpark.
Fails if any locale file is missing keys present in en-IN.json or has mismatched placeholders.
"""

import json
import os
import re
import sys
from pathlib import Path

MESSAGES_DIR = Path(__file__).resolve().parent.parent / "frontend" / "messages"
BASE_LOCALE = "en-IN"
BASE_FILE = MESSAGES_DIR / f"{BASE_LOCALE}.json"

PLACEHOLDER_REGEX = re.compile(r"\{([a-zA-Z0-9_]+)\}")


def flatten_dict(d, parent_key=""):
    items = []
    for k, v in d.items():
        if k == "_meta":
            continue
        new_key = f"{parent_key}.{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key).items())
        else:
            items.append((new_key, str(v)))
    return dict(items)


def extract_placeholders(text):
    return set(PLACEHOLDER_REGEX.findall(text))


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if not BASE_FILE.exists():
        print(f"Error: Base file {BASE_FILE} does not exist.")
        sys.exit(1)

    with open(BASE_FILE, "r", encoding="utf-8") as f:
        base_data = json.load(f)

    base_flat = flatten_dict(base_data)
    print(f"Loaded base locale [{BASE_LOCALE}] with {len(base_flat)} translatable keys.\n")

    locale_files = sorted([p for p in MESSAGES_DIR.glob("*.json") if p.name != f"{BASE_LOCALE}.json"])

    if not locale_files:
        print("Warning: No secondary locale files found to validate.")
        sys.exit(0)

    total_errors = 0

    for locale_path in locale_files:
        locale_code = locale_path.stem
        with open(locale_path, "r", encoding="utf-8") as f:
            try:
                locale_data = json.load(f)
            except Exception as e:
                print(f"❌ [{locale_code}] Failed to parse JSON: {e}")
                total_errors += 1
                continue

        locale_flat = flatten_dict(locale_data)

        missing_keys = set(base_flat.keys()) - set(locale_flat.keys())
        extra_keys = set(locale_flat.keys()) - set(base_flat.keys())
        placeholder_mismatches = []

        for key, base_val in base_flat.items():
            if key in locale_flat:
                loc_val = locale_flat[key]
                base_placeholders = extract_placeholders(base_val)
                loc_placeholders = extract_placeholders(loc_val)
                if base_placeholders != loc_placeholders:
                    placeholder_mismatches.append(
                        f"  Key '{key}': expected {base_placeholders}, got {loc_placeholders}"
                    )

        if missing_keys or placeholder_mismatches:
            print(f"❌ [{locale_code}] Parity validation failed:")
            if missing_keys:
                print(f"   Missing {len(missing_keys)} keys:")
                for k in sorted(list(missing_keys))[:10]:
                    print(f"     - {k}")
                if len(missing_keys) > 10:
                    print(f"     ... and {len(missing_keys) - 10} more")
            if placeholder_mismatches:
                print(f"   Mismatched placeholders:")
                for m in placeholder_mismatches:
                    print(f"     {m}")
            total_errors += 1
        else:
            meta = locale_data.get("_meta", {})
            native = meta.get("nativeName", locale_code)
            status = "⚠️  Needs review" if meta.get("needsNativeReview") else "✅ Native / Verified"
            print(f"✅ [{locale_code}] ({native}) Parity clean ({len(locale_flat)} keys) | {status}")

    print("\n" + "=" * 50)
    if total_errors > 0:
        print(f"❌ FAILED: {total_errors} locale file(s) failed validation.")
        sys.exit(1)
    else:
        print(f"✅ SUCCESS: All {len(locale_files)} locale files match base parity.")
        sys.exit(0)


if __name__ == "__main__":
    main()
