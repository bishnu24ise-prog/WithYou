import unittest
from unittest.mock import patch, MagicMock
from backend.services.gnani import transcribe_audio, synthesize_speech

class TestGnaniService(unittest.TestCase):
    @patch.dict('os.environ', {'GNANI_API_KEY': 'vach_test_dummy_key_12345'})
    @patch('backend.services.gnani.requests.post')
    def test_transcribe_audio_success(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "success": True,
            "transcript": "नमस्ते SafeSpark",
            "detected_language_code": "hi-IN"
        }
        mock_post.return_value = mock_response

        res = transcribe_audio(b"dummy_wav_data", language_code="hi-IN")
        self.assertTrue(res["success"])
        self.assertEqual(res["transcript"], "नमस्ते SafeSpark")
        self.assertEqual(res["detected_language_code"], "hi-IN")
        self.assertTrue(mock_post.called)

    @patch.dict('os.environ', {'GNANI_API_KEY': 'vach_test_dummy_key_12345'})
    @patch('backend.services.gnani.requests.post')
    def test_synthesize_speech_success(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.content = b"RIFF....WAVEfmt...."
        mock_post.return_value = mock_response

        audio = synthesize_speech("Welcome to SafeSpark", language_code="en-IN")
        self.assertTrue(audio.startswith(b"RIFF"))
        self.assertTrue(mock_post.called)

if __name__ == '__main__':
    unittest.main()

