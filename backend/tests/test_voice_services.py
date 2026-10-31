import unittest
from unittest.mock import patch, MagicMock
import os
import sys

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from services.stt import SarvamSTTService, GoogleCloudSTTService, get_stt_service
from services.tts import SarvamTTSService, ElevenLabsTTSService, get_tts_service
from services.voice_extraction import extract_form_from_speech, classify_voice_intent


class TestSTTServices(unittest.TestCase):
    def test_stt_factory_default(self):
        with patch.dict(os.environ, {"STT_PROVIDER": "sarvam"}):
            service = get_stt_service()
            self.assertIsInstance(service, SarvamSTTService)

    def test_sarvam_stt_transcribe_success(self):
        service = SarvamSTTService(api_key="mock-key", model="saaras:v4")
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.ok = True
        mock_response.json.return_value = {
            "transcript": "नमस्ते मुझे मदद चाहिए",
            "language_code": "hi-IN",
        }

        with patch("requests.post", return_value=mock_response) as mock_post:
            result = service.transcribe(b"fake_audio_bytes", language="hi-IN")
            self.assertEqual(result["text"], "नमस्ते मुझे मदद चाहिए")
            self.assertEqual(result["language"], "hi-IN")
            mock_post.assert_called_once()
            call_kwargs = mock_post.call_args[1]
            self.assertEqual(call_kwargs["headers"]["api-subscription-key"], "mock-key")

    def test_sarvam_stt_translate_mode(self):
        service = SarvamSTTService(api_key="mock-key", model="saaras:v4")
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.ok = True
        mock_response.json.return_value = {
            "transcript": "Hello I need emergency domestic help",
            "language_code": "en-IN",
        }

        with patch("requests.post", return_value=mock_response) as mock_post:
            result = service.transcribe(b"fake_audio_bytes", language="hi-IN", mode="translate")
            self.assertEqual(result["text"], "Hello I need emergency domestic help")
            data_sent = mock_post.call_args[1]["data"]
            self.assertEqual(data_sent.get("mode"), "translate")

    def test_sarvam_stt_missing_key(self):
        service = SarvamSTTService(api_key="", model="saaras:v4")
        with self.assertRaises(ValueError):
            service.transcribe(b"fake_bytes", language="en-IN")


class TestTTSServices(unittest.TestCase):
    def test_tts_factory_default(self):
        with patch.dict(os.environ, {"TTS_PROVIDER": "sarvam"}):
            service = get_tts_service()
            self.assertIsInstance(service, SarvamTTSService)

    def test_sarvam_tts_supported_language(self):
        service = SarvamTTSService(api_key="mock-key", model="bulbul:v3")
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.ok = True
        mock_response.json.return_value = {
            "audios": ["bW9ja19iYXNlNjRfYXVkaW8="]
        }

        with patch("requests.post", return_value=mock_response):
            result = service.synthesize("नमस्ते", language="hi-IN")
            self.assertEqual(result["audio_base64"], "bW9ja19iYXNlNjRfYXVkaW8=")
            self.assertTrue(result["supported"])
            self.assertEqual(result["format"], "mp3")

    def test_sarvam_tts_unsupported_language_fallback(self):
        # as-IN and ur-IN are not supported in Bulbul v3
        service = SarvamTTSService(api_key="mock-key", model="bulbul:v3")
        with patch.dict(os.environ, {"ELEVEN_LABS_API_KEY": ""}):
            result = service.synthesize("টেস্ট", language="as-IN")
            self.assertFalse(result["supported"])
            self.assertIsNone(result["audio_base64"])
            self.assertIn("Bulbul v3", result["message"])


class TestVoiceExtraction(unittest.TestCase):
    def test_voice_intent_classification(self):
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = '{"intent": "QUICK_EXIT", "target_language": null, "is_destructive": false}'
        mock_model.generate_content.return_value = mock_response

        with patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}):
            with patch("services.voice_extraction.genai") as mock_genai:
                mock_genai.GenerativeModel.return_value = mock_model
                result = classify_voice_intent("तुरंत बाहर निकलो", language="hi-IN")
                self.assertEqual(result.get("intent"), "QUICK_EXIT")

    def test_natural_speech_form_extraction(self):
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = '''{
            "name": "Sunita",
            "phone": "9876543210",
            "location": {
                "city": "Pune",
                "address": "Camp Area"
            },
            "culprit": {
                "relationship": "Husband",
                "description": "Ramesh, abusive"
            },
            "violence": {
                "frequency": "Daily",
                "severity": "High",
                "visible_injuries": "Yes"
            },
            "current_situation": "Needs safe shelter",
            "missing_fields": [],
            "follow_up_question": ""
        }'''
        mock_model.generate_content.return_value = mock_response

        with patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}):
            with patch("services.voice_extraction.genai") as mock_genai:
                mock_genai.GenerativeModel.return_value = mock_model
                result = extract_form_from_speech("मेरा नाम सुनीता है, मैं पुणे में रहती हूँ...", language="hi-IN")
                self.assertEqual(result["name"], "Sunita")
                self.assertEqual(result["location"]["city"], "Pune")


if __name__ == '__main__':
    unittest.main()
