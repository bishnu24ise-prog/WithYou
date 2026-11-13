"""
TinyFish Web Agent & Research Service
Provides unified, rate-limited, and PII-sanitized access to:
- TinyFish Search: GET https://api.search.tinyfish.ai
- TinyFish Fetch: POST https://api.fetch.tinyfish.ai
- TinyFish Web Agent: POST https://agent.tinyfish.ai/v1/automation/run-sse
"""

import os
import time
import json
import logging
import hashlib
from typing import Dict, Any, List, Optional, Generator
import requests
from backend.utils.pii_stripper import strip_pii_from_text, sanitize_tinyfish_payload

logger = logging.getLogger(__name__)

TINYFISH_SEARCH_ENDPOINT = "https://api.search.tinyfish.ai"
TINYFISH_FETCH_ENDPOINT = "https://api.fetch.tinyfish.ai"
TINYFISH_AGENT_SSE_ENDPOINT = "https://agent.tinyfish.ai/v1/automation/run-sse"

# Local in-memory cache with TTL (in seconds)
_CACHE: Dict[str, Dict[str, Any]] = {}

class TinyFishService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("TINYFISH_API_KEY")
        if not self.api_key:
            logger.warning("TINYFISH_API_KEY is not configured. Falling back to local heuristics.")

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "SafeSpark-LegalAI/1.0",
        }
        if self.api_key:
            headers["X-API-Key"] = self.api_key
        return headers

    def _get_cache(self, key: str) -> Optional[Any]:
        if key in _CACHE:
            entry = _CACHE[key]
            if time.time() < entry["expires_at"]:
                return entry["data"]
            else:
                del _CACHE[key]
        return None

    def _set_cache(self, key: str, data: Any, ttl_seconds: int = 3600):
        _CACHE[key] = {
            "data": data,
            "expires_at": time.time() + ttl_seconds,
        }

    def search(
        self,
        query: str,
        location: str = "IN",
        language: str = "en",
        restrict_legal: bool = True,
        max_results: int = 5,
        use_cache: bool = True,
    ) -> List[Dict[str, Any]]:
        """
        Search the web via TinyFish Search API.
        Automatically removes PII and focuses on Indian statutory, government, and legal aid domains.
        """
        clean_query = strip_pii_from_text(query).strip()
        if restrict_legal and "india" not in clean_query.lower():
            clean_query = f"{clean_query} India law legal provisions"

        cache_key = f"search:{hashlib.md5(f'{clean_query}_{location}'.encode()).hexdigest()}"
        if use_cache:
            cached = self._get_cache(cache_key)
            if cached is not None:
                return cached

        if not self.api_key:
            # Fallback mock/heuristic results if API key not available
            return [
                {
                    "title": "National Legal Services Authority (NALSA) - Legal Aid for Women",
                    "url": "https://nalsa.gov.in/womens-assistance/",
                    "snippet": "Free legal aid, counsel, and representation for women under Legal Services Authorities Act.",
                    "site_name": "nalsa.gov.in"
                },
                {
                    "title": "National Commission for Women (NCW) Official Portal",
                    "url": "https://ncw.nic.in/",
                    "snippet": "Statutory body for women's constitutional and legal safeguards, 24/7 complaint registration.",
                    "site_name": "ncw.nic.in"
                }
            ]

        try:
            params = {
                "query": clean_query,
                "location": location,
                "language": language,
            }
            resp = requests.get(
                TINYFISH_SEARCH_ENDPOINT,
                params=params,
                headers=self._get_headers(),
                timeout=2.5,
            )
            resp.raise_for_status()
            data = resp.json()
            results = data.get("results", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
            trimmed = results[:max_results]
            self._set_cache(cache_key, trimmed, ttl_seconds=1800)
            return trimmed
        except Exception as e:
            logger.error(f"TinyFish Search error for query '{clean_query}': {e}")
            return []

    def fetch(
        self,
        urls: List[str],
        format_type: str = "markdown",
        ttl: int = 3600,
        use_cache: bool = True,
    ) -> Dict[str, Any]:
        """
        Batch-fetches and extracts clean markdown/text content from up to 10 URLs in parallel.
        """
        if not urls:
            return {"results": [], "errors": []}

        # Up to 10 URLs per request according to TinyFish specifications
        target_urls = urls[:10]

        cache_key = f"fetch:{hashlib.md5(','.join(sorted(target_urls)).encode()).hexdigest()}"
        if use_cache:
            cached = self._get_cache(cache_key)
            if cached is not None:
                return cached

        if not self.api_key:
            # Mock fallback response
            mock_results = [
                {
                    "url": u,
                    "final_url": u,
                    "title": "Official Portal Resource",
                    "text": "Statutory protections, emergency helpline contacts, and victim assistance guidelines.",
                    "format": format_type
                }
                for u in target_urls
            ]
            return {"results": mock_results, "errors": []}

        try:
            payload = {
                "urls": target_urls,
                "format": format_type,
                "ttl": ttl,
            }
            resp = requests.post(
                TINYFISH_FETCH_ENDPOINT,
                json=payload,
                headers=self._get_headers(),
                timeout=2.5,
            )
            resp.raise_for_status()
            data = resp.json()
            self._set_cache(cache_key, data, ttl_seconds=ttl)
            return data
        except Exception as e:
            logger.error(f"TinyFish Fetch error for {target_urls}: {e}")
            return {"results": [], "errors": [{"urls": target_urls, "message": str(e)}]}

    def stream_agent(
        self,
        url: str,
        goal: str,
        browser_profile: str = "stealth",
    ) -> Generator[str, None, None]:
        """
        Streams events from TinyFish Web Agent using Server-Sent Events (SSE).
        Enforces safety constraint: agent must NEVER finalize or submit forms.
        """
        safe_goal = strip_pii_from_text(goal)
        # Append non-negotiable safety clause
        safe_goal = f"{safe_goal} IMPORTANT SAFETY DIRECTIVE: Stop before any final submit, OTP verification, or CAPTCHA step. Do not submit."

        payload = {
            "url": url,
            "goal": safe_goal,
            "browser_profile": browser_profile,
        }

        if not self.api_key:
            # Simulated SSE stream for test/demo mode
            steps = [
                {"type": "INITIALIZED", "step": 1, "message": f"Connecting to secure browser context for {url}"},
                {"type": "STEP", "step": 2, "message": "Analyzing complaint form input fields"},
                {"type": "STEP", "step": 3, "message": "Pre-populating legal incident description and category"},
                {"type": "PAUSED_FOR_USER", "step": 4, "message": "Halting before final submission. Awaiting human review."},
                {"type": "COMPLETE", "step": 5, "message": "Form pre-filled safely. Ready for user verification and sign-off."}
            ]
            for step in steps:
                time.sleep(0.5)
                yield f"data: {json.dumps(step)}\n\n"
            return

        try:
            resp = requests.post(
                TINYFISH_AGENT_SSE_ENDPOINT,
                json=payload,
                headers=self._get_headers(),
                stream=True,
                timeout=120,
            )
            resp.raise_for_status()
            for line in resp.iter_lines(decode_unicode=True):
                if line:
                    yield f"{line}\n\n"
        except Exception as e:
            logger.error(f"TinyFish Agent SSE error: {e}")
            yield f"data: {json.dumps({'type': 'ERROR', 'message': str(e)})}\n\n"



def get_detailed_legal_response(query: str, sources: Optional[List[Dict[str, Any]]] = None) -> str:
    q = query.lower()
    if any(k in q for k in ['harass', 'workplace', 'posh', 'office', 'colleague', 'boss', 'icc']):
        return """### ⚖️ Comprehensive Legal Advisory: Protection Against Workplace Sexual Harassment
**Governing Statute:** *Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act)* & *Bharatiya Nyaya Sanhita (BNS) 2023 / IPC*.

---

### 1. Statutory Provisions & Legal Architecture
- **Section 2(n) POSH Act (Definition):** Sexual harassment includes unwelcome physical contact, advances, demand for sexual favors, sexually colored remarks, or any unwelcome physical, verbal, or non-verbal conduct.
- **Section 4 POSH Act (Internal Complaints Committee - ICC):** Mandatory for every organization with 10 or more employees. Must be headed by a senior woman presiding officer, with 50% women members, and an external NGO member.
- **Section 9 POSH Act (Filing Timeline):** Written complaint must be submitted within 3 months of the incident (extendable by another 3 months upon reasonable cause).
- **Section 12 POSH Act (Interim Relief):** Complainant can demand transfer, up to 3 months paid leave (beyond statutory leave), and restraint on respondent appraisal.
- **Section 16 POSH Act (Strict Confidentiality):** Strictly prohibits publishing or disclosing complainant identity.
- **Section 75 BNS 2023 (Section 354A IPC):** Criminal prosecution with imprisonment up to 3 years.

---

### 2. Immediate Step-by-Step Action Plan
1. **Document Every Occurrence:** Save screenshots of WhatsApp, Slack, emails, and notes with timestamps.
2. **Submit Formal Complaint:** Submit 6 copies of the written complaint to the Presiding Officer of the ICC.
3. **Seek Interim Relief:** Request immediate department transfer or paid leave under Section 12.
4. **Inquiry Timeline:** Inquiry must be completed within 90 days; employer must implement findings within 60 days.

---

### 3. Emergency Contacts
- **National Emergency:** Dial 112
- **National Commission for Women (NCW):** Dial 7827170170
- **She-Box Central Portal:** https://shebox.wcd.gov.in
- **NALSA Free Legal Aid:** Dial 15100"""

    if any(k in q for k in ['domestic', 'violence', 'abuse', 'husband', 'in-law', 'beat', 'hit', 'torture', 'dv']):
        return """### ⚖️ Comprehensive Legal Advisory: Domestic Violence Relief & Emergency Protection
**Governing Statutes:** *Protection of Women from Domestic Violence Act, 2005 (PWDVA)* & *Bharatiya Nyaya Sanhita (BNS) 2023 (Sections 85/86) / IPC 498A*.

---

### 1. Your Enforceable Statutory Rights Under PWDVA 2005
- **Section 3 PWDVA:** Covers physical, sexual, verbal, emotional, and economic abuse.
- **Section 17 PWDVA (Right to Reside in Shared Household):** Every woman in a domestic relationship has the right to reside in the shared household regardless of legal ownership or title.
- **Section 18 PWDVA (Protection Orders):** Restraining the abuser from violence, communication, entering victim's workplace, or alienating assets.
- **Section 19 PWDVA (Residence Orders):** Restraining eviction, removing respondent from household, or ordering alternative accommodation paid by respondent.
- **Section 20 PWDVA (Monetary Relief):** Medical expenses, maintenance, and compensation for loss of earnings.
- **Section 23 PWDVA (Ex-Parte Interim Orders):** Immediate emergency protection granted on affidavit on the first date of hearing.
- **Section 85 BNS 2023 (Section 498A IPC):** Non-bailable cruelty by husband or relatives punishable with up to 3 years imprisonment.

---

### 2. Step-by-Step Practical Procedure
1. **Medical MLC:** If physically assaulted, visit a government hospital immediately for a Medico-Legal Certificate (MLC).
2. **Protection Officer / Sakhi OSC:** File a Domestic Incident Report (DIR / Form I) with the local Protection Officer or One Stop Centre.
3. **Section 12 Magistrate Application:** Court is mandated to hold first hearing within 3 days under Section 12(4).

---

### 3. Emergency Helplines
- **Police Emergency:** Dial 112
- **Women Police Helpline:** Dial 1091
- **Domestic Distress Helpline (Sakhi OSC):** Dial 181
- **NALSA Free Legal Aid:** Dial 15100"""

    return """### ⚖️ Comprehensive Legal Guidance & Statutory Rights in India
**Governing Framework:** *PWDVA 2005*, *Bharatiya Nyaya Sanhita (BNS) 2023*, *BNSS / CrPC*, & *NALSA Act 1987*.

---

### 1. Key Protections
- **Zero FIR:** You can lodge an FIR at ANY police station in India regardless of jurisdiction.
- **Arrest Protections:** Women cannot be arrested between sunset and sunrise or questioned outside their residence.
- **Free Legal Aid:** Under Section 12 NALSA Act, all women in India are entitled to 100% free legal representation and court advocates.
- **Emergency Helplines:** Dial 112 (Emergency), 1091 (Women Police), 181 (Domestic Distress), 1930 (Cybercrime)."""
