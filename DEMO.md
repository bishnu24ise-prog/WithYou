# ⏱️ SafeSpark 60-Second Judge Demo Walkthrough

Welcome judges! Follow this exact 60-second demonstration flow to experience how **TinyFish Web Agent & Research APIs** power **SafeSpark** with zero PII leakage:

---

## 🎯 Step 1: LawBot Live Cited Research (0:00 – 0:15)
1. Navigate to **[https://with-you-puce.vercel.app/lawbot](https://with-you-puce.vercel.app/lawbot)**.
2. Click any prompt suggestion (e.g. *"PWDVA 2005 & Protection Orders"* or type *"Can police refuse my FIR?"*).
3. **What to Observe**:
   - TinyFish triggers live **Search** across Indian legal domains (`nalsa.gov.in`, `ncw.nic.in`, `wcd.nic.in`) and **Parallel Fetches** top statutory pages.
   - A pulsing badge shows: *"Scanning statutory portals & reading legal pages..."*
   - The response renders with the **Cited Sources Panel**: official domain tags, favicons, *"N Pages Verified"* badge, and direct clickable citations with non-legal-advice disclaimers.

---

## 🏥 Step 2: Self-Healing Crisis Directory (0:15 – 0:30)
1. Click **"Help Directory"** in the top navigation bar or visit **[https://with-you-puce.vercel.app/directory](https://with-you-puce.vercel.app/directory)**.
2. Click the blue **"Self-Heal Directory (TinyFish Fetch)"** button.
3. **What to Observe**:
   - The live status banner activates: *"Checking wcd.nic.in, ncw.nic.in, nalsa.gov.in... 2 of 6 fetched"*.
   - Rows shimmer as parallel batch results stream into the table.
   - Operating hours, one-touch phone helplines (`181`, `112`, `15100`), and verified legal aid services are updated.
   - Each row displays a green **"Verified on 2026-10-31"** badge linked to the official government source portal.

---

## 📡 Step 3: Law & Helpline Watch Feed (0:30 – 0:45)
1. Click **"Dashboard"** in the navbar or visit **[https://with-you-puce.vercel.app/dashboard](https://with-you-puce.vercel.app/dashboard)**.
2. View the **"Law & Helpline Live Watch Feed"** at the top of the dashboard.
3. Click **"Run Live Watch Check"**.
4. **What to Observe**:
   - TinyFish hashes content on official portals (National Cyber Crime 1930, NCW 7827170170, NALSA 15100).
   - Change-alert cards show 1-line plain-language statutory summaries (e.g. *"Helpline 1930 citizen reporting flow updated with real-time financial freeze"*).
   - The green animated pulses confirm the portals are actively monitored.

---

## 🚀 Step 4: Complaint Assist (The "Wow" Demo) (0:45 – 1:00)
1. Click **"Complaint Assist"** in the navbar or visit **[https://with-you-puce.vercel.app/assist](https://with-you-puce.vercel.app/assist)**.
2. Click **"Launch Agent Pre-Fill"** (or click **"Demo Mode"** for instant fixture replay).
3. **What to Observe**:
   - A simulated browser frame opens with URL bar (`cybercrime.gov.in/citizen-reporting-flow`) and progress ring.
   - The live SSE event stream logs:
     1. `[INITIALIZED] Initializing TinyFish Web Agent in stealth sandbox...`
     2. `[STEP] Navigating to National Grievance Portal...`
     3. `[STEP] Pre-filling complaint statement from LawBot summary (PII scrubbed)...`
     4. `[SAFETY_HALT] 🛡️ SAFETY HALT ACTIVATED: Agent paused before final submission / CAPTCHA.`
     5. `[COMPLETE] Pre-fill ready. Complainant must review and submit.`
   - Notice the prominent glowing **"Review & Submit Yourself"** button: the agent strictly protects survivor agency by never submitting forms without human sign-off.

---

### 🛡️ Privacy Verification
- Run tests in the repository:
  ```bash
  python -m unittest backend/tests/test_pii_stripper.py
  python -m unittest backend/tests/test_tinyfish_service.py
  ```
- **Result**: All 10 unit tests pass with zero leaked phones, Aadhaar, GPS coordinates, or emails.

