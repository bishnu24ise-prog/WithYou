"""
Unit tests for SafeSpark PII Stripper
Verifies that no survivor phone, Aadhaar, email, GPS coordinates, or home address can leak to TinyFish.
"""

import unittest
from backend.utils.pii_stripper import strip_pii_from_text, sanitize_tinyfish_payload

class TestPIIStripper(unittest.TestCase):

    def test_phone_number_redaction(self):
        text = "Please help me at +91 98765 43210 or 9811234567 regarding my case."
        result = strip_pii_from_text(text)
        self.assertNotIn("98765 43210", result)
        self.assertNotIn("9811234567", result)
        self.assertIn("[PROTECTED_PHONE]", result)

    def test_preserves_official_helplines(self):
        text = "You can dial national helplines 112, 1091, or 181 for emergency dispatch."
        result = strip_pii_from_text(text)
        self.assertIn("112", result)
        self.assertIn("1091", result)
        self.assertIn("181", result)

    def test_email_redaction(self):
        text = "Contact the survivor at victim.secret@gmail.com for details."
        result = strip_pii_from_text(text)
        self.assertNotIn("victim.secret@gmail.com", result)
        self.assertIn("[CONFIDENTIAL_EMAIL]", result)

    def test_aadhaar_redaction(self):
        text = "Identity number: 5432 9876 1234 is on the police report."
        result = strip_pii_from_text(text)
        self.assertNotIn("5432 9876 1234", result)
        self.assertIn("[GOVT_ID_REDACTED]", result)

    def test_gps_coordinate_redaction(self):
        text = "Incident occurred at coordinates 28.6139, 77.2090 near the park."
        result = strip_pii_from_text(text)
        self.assertNotIn("28.6139", result)
        self.assertIn("[APPROX_DISTRICT_ZONE]", result)

    def test_street_address_redaction(self):
        text = "Survivor lives at Flat No 402, Block C, Sector 14, Rohini, Delhi."
        result = strip_pii_from_text(text)
        self.assertNotIn("Flat No 402", result)
        self.assertIn("Delhi", result)  # Keep city level for legal jurisdiction

    def test_payload_dict_sanitization(self):
        payload = {
            "name": "Priya Sharma",
            "phone": "+91 9988776655",
            "lat": 28.5355,
            "lng": 77.3910,
            "city": "Noida",
            "query": "Seeking protection order under PWDVA Section 18 for abuse"
        }
        sanitized = sanitize_tinyfish_payload(payload)
        self.assertEqual(sanitized.get("name"), "[CITIZEN_REDACTED]")
        self.assertNotIn("lat", sanitized)
        self.assertNotIn("lng", sanitized)
        self.assertNotIn("phone", sanitized)
        self.assertEqual(sanitized.get("city"), "Noida")

if __name__ == '__main__':
    unittest.main()

