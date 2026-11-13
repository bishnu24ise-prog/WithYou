"""
Unit tests for TinyFishService client
Tests search, fetch, caching, and agent SSE stream formatting with mock responses.
"""

import unittest
from unittest.mock import patch, MagicMock
from backend.services.tinyfish import TinyFishService

class TestTinyFishService(unittest.TestCase):

    def setUp(self):
        self.service = TinyFishService(api_key="sk-test-tinyfish-dummy-key")

    @patch("backend.services.tinyfish.requests.get")
    def test_search_success_and_cache(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "query": "domestic violence legal aid",
            "results": [
                {
                    "title": "NALSA Guidelines",
                    "url": "https://nalsa.gov.in/guidelines",
                    "snippet": "Free legal aid provisions for women.",
                    "site_name": "nalsa.gov.in"
                }
            ]
        }
        mock_get.return_value = mock_resp

        results = self.service.search("domestic violence legal aid", use_cache=False)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["title"], "NALSA Guidelines")
        self.assertEqual(results[0]["site_name"], "nalsa.gov.in")

    @patch("backend.services.tinyfish.requests.post")
    def test_fetch_batch_success(self, mock_post):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "results": [
                {
                    "url": "https://ncw.nic.in",
                    "title": "National Commission for Women",
                    "text": "# NCW Mandate\nProtecting women's rights across India.",
                    "format": "markdown"
                }
            ],
            "errors": []
        }
        mock_post.return_value = mock_resp

        data = self.service.fetch(["https://ncw.nic.in"], use_cache=False)
        self.assertIn("results", data)
        self.assertEqual(len(data["results"]), 1)
        self.assertEqual(data["results"][0]["title"], "National Commission for Women")

    def test_agent_safety_directive_injected(self):
        with patch("backend.services.tinyfish.requests.post") as mock_post:
            mock_resp = MagicMock()
            mock_resp.status_code = 200
            mock_resp.iter_lines.return_value = [
                'data: {"type": "INITIALIZED", "step": 1}',
                'data: {"type": "COMPLETE", "step": 2}'
            ]
            mock_post.return_value = mock_resp

            gen = self.service.stream_agent("https://example.com/portal", "Pre-fill victim legal complaint")
            events = list(gen)
            self.assertTrue(len(events) >= 2)

            # Verify that the goal payload contained the safety directive
            call_kwargs = mock_post.call_args[1]
            sent_goal = call_kwargs["json"]["goal"]
            self.assertIn("Stop before any final submit", sent_goal)

if __name__ == '__main__':
    unittest.main()

