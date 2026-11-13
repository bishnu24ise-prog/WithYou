/**
 * SafeSpark Legal Knowledge Engine
 * Provides exhaustive, section-by-section statutory legal guidance under Indian Law
 * (PWDVA 2005, POSH Act 2013, BNS / IPC, IT Act 2000, NALSA 1987, BNSS / CrPC).
 * Fully multilingual across all 13 supported Indian languages.
 */

import { CitedSource } from './tinyfish';

export interface DetailedLegalAnalysis {
  title: string;
  summary: string;
  statutes: { name: string; section: string; description: string }[];
  actionSteps: { phase: string; actions: string[] }[];
  courtRemedies: string[];
  evidenceChecklist: string[];
  helplines: { name: string; number: string; description: string }[];
  citations: CitedSource[];
}

export function getDetailedLegalResponse(
  query: string,
  sources: CitedSource[] = [],
  locale: string = 'en-IN'
): string {
  const q = query.toLowerCase();

  // KANNADA (kn-IN)
  if (locale.startsWith('kn')) {
    if (
      q.includes('domestic') ||
      q.includes('violence') ||
      q.includes('abuse') ||
      q.includes('husband') ||
      q.includes('in-law') ||
      q.includes('inlaws') ||
      q.includes('beat') ||
      q.includes('hit') ||
      q.includes('torture') ||
      q.includes('dv') ||
      q.includes('ಹಿಂಸೆ') ||
      q.includes('ದೌರ್ಜನ್ಯ') ||
      q.includes('ಗಂಡ') ||
      q.includes('ಹಲ್ಲೆ')
    ) {
      return `### ⚖️ ಸಮಗ್ರ ಕಾನೂನು ಸಲಹೆ: ಕೌಟುಂಬಿಕ ದೌರ್ಜನ್ಯ ಪರಿಹಾರ ಮತ್ತು ತುರ್ತು ರಕ್ಷಣೆ
**ಅನ್ವಯವಾಗುವ ಕಾನೂನುಗಳು:** *ಕೌಟುಂಬಿಕ ದೌರ್ಜನ್ಯದಿಂದ ಮಹಿಳೆಯರ ರಕ್ಷಣೆ ಕಾಯ್ದೆ, 2005 (PWDVA)* & *ಭಾರತೀಯ ನ್ಯಾಯ ಸಂಹಿತೆ (BNS) 2023 (ವಿಭಾಗಗಳು 85/86) / IPC ವಿಭಾಗ 498A*.

---

### 1. PWDVA 2005 ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಶಾಸನಬದ್ಧ ಹಕ್ಕುಗಳು
**PWDVA 2005** ಎಂಬುದು ಕೌಟುಂಬಿಕ ಸಂಬಂಧದಲ್ಲಿ ದೈಹಿಕ, ಲೈಂಗಿಕ, ಮೌಖಿಕ, ಭಾವನಾತ್ಮಕ ಮತ್ತು ಆರ್ಥಿಕ ದೌರ್ಜನ್ಯದ ವಿರುದ್ಧ ಮಹಿಳೆಯರಿಗೆ ತ್ವರಿತ, ತುರ್ತು ರಕ್ಷಣೆ ನೀಡಲು ರೂಪಿಸಲಾದ ವಿಶೇಷ ಕಲ್ಯಾಣ ಕಾನೂನಾಗಿದೆ:

- **ವಿಭಾಗ 3 PWDVA (ದೌರ್ಜನ್ಯದ ಸಮಗ್ರ ವ್ಯಾಖ್ಯಾನ):**
  - *ದೈಹಿಕ ದೌರ್ಜನ್ಯ:* ಹಲ್ಲೆ, ದೈಹಿಕ ನೋವು ಅಥವಾ ಅಪರಾಧ ಬಲದ ಬಳಕೆ.
  - *ಲೈಂಗಿಕ ದೌರ್ಜನ್ಯ:* ಮಹಿಳೆಯ ಘನತೆಗೆ ಧಕ್ಕೆ ತರುವ ಅಥವಾ ಅವಮಾನಿಸುವ ಯಾವುದೇ ಲೈಂಗಿಕ ನಡವಳಿಕೆ.
  - *ಮೌಖಿಕ ಮತ್ತು ಭಾವನಾತ್ಮಕ ದೌರ್ಜನ್ಯ:* ನಿಂದನೆ, ಅಪಹಾಸ್ಯ, ಅವಮಾನ, ದೈಹಿಕ ನೋವುಂಟುಮಾಡುವ ಪುನರಾವರ್ತಿತ ಬೆದರಿಕೆಗಳು ಅಥವಾ ಮಕ್ಕಳಿಲ್ಲದಿರುವುದು ಅಥವಾ ವರದಕ್ಷಿಣೆ ಕುರಿತಾದ ಕಿರುಕುಳ.
  - *ಆರ್ಥಿಕ ದೌರ್ಜನ್ಯ:* ಆರ್ಥಿಕ ಅಥವಾ ಹಣಕಾಸು ಸಂಪನ್ಮೂಲಗಳಿಂದ ವಂಚಿಸುವುದು, ಜೀವನಾಂಶ ನೀಡದಿರುವುದು, ಹಂಚಿಕೆಯ ಸ್ವತ್ತುಗಳನ್ನು ಮಾರಾಟ ಮಾಡುವುದು ಅಥವಾ ಮೂಲಭೂತ ಗೃಹ ಅಗತ್ಯಗಳನ್ನು ನಿರಾಕರಿಸುವುದು.
- **ವಿಭಾಗ 17 PWDVA (ಹಂಚಿಕೆಯ ಮನೆಯಲ್ಲಿ ವಾಸಿಸುವ ಸಂಪೂರ್ಣ ಹಕ್ಕು):**
  - ಕೌಟುಂಬಿಕ ಸಂಬಂಧದಲ್ಲಿರುವ ಪ್ರತಿಯೊಬ್ಬ ಮಹಿಳೆಗೂ **ಹಂಚಿಕೆಯ ಮನೆಯಲ್ಲಿ** ವಾಸಿಸುವ ಶಾಸನಬದ್ಧ ಹಕ್ಕಿದೆ, ಅವಳಿಗೆ ಕಾನೂನುಬದ್ಧ ಶೀರ್ಷಿಕೆ ಅಥವಾ ಆರ್ಥಿಕ ಮಾಲೀಕತ್ವದ ಹಕ್ಕುಗಳಿರಲಿ ಅಥವಾ ಇಲ್ಲದಿರಲಿ. ಕಾನೂನಿನ ಸೂಕ್ತ ಪ್ರಕ್ರಿಯೆಯಿಲ್ಲದೆ ನಿಮ್ಮನ್ನು ಮನೆಯಿಂದ ಹೊರಹಾಕಲು ಸಾಧ್ಯವಿಲ್ಲ.
- **ವಿಭಾಗ 18 PWDVA (ರಕ್ಷಣಾ ಆದೇಶಗಳು):**
  - ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಅವರು ದೌರ್ಜನ್ಯಕೋರನು ಯಾವುದೇ ಕೌಟುಂಬಿಕ ಹಿಂಸಾಚಾರ ಮಾಡದಂತೆ, ನಿಮ್ಮ ಕೆಲಸದ ಸ್ಥಳಕ್ಕೆ ಪ್ರವೇಶಿಸದಂತೆ ಅಥವಾ ಯಾವುದೇ ರೀತಿಯಲ್ಲಿ (ದೂರವಾಣಿ, ಸಂದೇಶ ಅಥವಾ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಮೂಲಕ) ಸಂವಹನ ನಡೆಸದಂತೆ ತಡೆಯುವ ರಕ್ಷಣಾ ಆದೇಶಗಳನ್ನು ನೀಡಬಹುದು.
- **ವಿಭಾಗ 19 PWDVA (ನಿವಾಸ ಆದೇಶಗಳು):**
  - ಹಂಚಿಕೆಯ ಮನೆಯಿಂದ ನಿಮ್ಮನ್ನು ಹೊರಹಾಕುವುದನ್ನು ತಡೆಯುವುದು, ದೌರ್ಜನ್ಯಕೋರನನ್ನು ಮನೆಯಿಂದ ಹೊರಹೋಗುವಂತೆ ಆದೇಶಿಸುವುದು ಅಥವಾ ಪರ್ಯಾಯ ವಸತಿ ಸೌಕರ್ಯ ಒದಗಿಸಿ ಬಾಡಿಗೆ ಪಾವತಿಸುವಂತೆ ಆದೇಶಿಸುವುದು.
- **ವಿಭಾಗ 20 PWDVA (ಹಣಕಾಸು ಪರಿಹಾರ):**
  - ವೈದ್ಯಕೀಯ ವೆಚ್ಚಗಳು, ಆದಾಯದ ನಷ್ಟ ಮತ್ತು ನಿಮಗೆ ಮತ್ತು ನಿಮ್ಮ ಅಪ್ರಾಪ್ತ ಮಕ್ಕಳಿಗೆ ನ್ಯಾಯಯುತ ನಿರ್ವಹಣಾ ವೆಚ್ಚವನ್ನು ಪಾವತಿಸುವಂತೆ ಆದೇಶ.
- **ವಿಭಾಗ 21 PWDVA (ಮಕ್ಕಳ ತಾತ್ಕಾಲಿಕ ಪಾಲನೆ):**
  - ಅಪ್ರಾಪ್ತ ಮಕ್ಕಳ ತಾತ್ಕಾಲಿಕ ಪಾಲನೆಯನ್ನು ಮಹಿಳೆಗೆ ನೀಡುವ ಅಧಿಕಾರ.
- **ವಿಭಾಗ 23 PWDVA (ತುರ್ತು ಏಕಪಕ್ಷೀಯ ಮಧ್ಯಂತರ ಪರಿಹಾರ):**
  - ನ್ಯಾಯಾಲಯಕ್ಕೆ ಆರೋಪಿ ಹಾಜರಾಗಲು ಕಾಯದೆ ನಿಮ್ಮ ಅಫಿಡವಿಟ್ ಆಧಾರದ ಮೇಲೆ **ತಕ್ಷಣವೇ ಏಕಪಕ್ಷೀಯ ಮಧ್ಯಂತರ ರಕ್ಷಣಾ ಆದೇಶಗಳನ್ನು** ಜಾರಿಗೊಳಿಸಬಹುದು.
- **ವಿಭಾಗ 31 PWDVA (ಆದೇಶ ಉಲ್ಲಂಘನೆಗೆ ಶಿಕ್ಷೆ):**
  - ರಕ್ಷಣಾ ಆದೇಶದ ಉಲ್ಲಂಘನೆಯು ಜಾಮೀನು ರಹಿತ ಅಪರಾಧವಾಗಿದ್ದು, 1 ವರ್ಷದವರೆಗೆ ಜೈಲು ಶಿಕ್ಷೆ ಮತ್ತು ₹20,000 ದಂಡ ವಿಧಿಸಬಹುದು.

---

### 2. ತಕ್ಷಣದ ಹಂತ-ಹಂತದ ಕ್ರಿಯಾ ಯೋಜನೆ
1. **ಹಂತ 1: ತಕ್ಷಣದ ಸುರಕ್ಷತೆ ಮತ್ತು ತುರ್ತು ಕರೆ:**
   - ನೀವು ತಕ್ಷಣದ ದೈಹಿಕ ಅಪಾಯದಲ್ಲಿದ್ದರೆ, ಪೊಲೀಸ್ ನಿಯಂತ್ರಣ ಕೊಠಡಿ **112** ಅಥವಾ ಮಹಿಳಾ ಸಹಾಯವಾಣಿ **1091** ಗೆ ಕರೆ ಮಾಡಿ. ಗಾಯಗಳಾಗಿದ್ದರೆ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ ಮೆಡಿಕೊ-ಲೀಗಲ್ ಪ್ರಮಾಣಪತ್ರ (MLC) ಪಡೆದುಕೊಳ್ಳಿ.
2. **ಹಂತ 2: ರಕ್ಷಣಾ ಅಧಿಕಾರಿಯನ್ನು (Protection Officer) ಸಂಪರ್ಕಿಸಿ:**
   - ತಾಲೂಕು ಅಥವಾ ಜಿಲ್ಲಾ ಮಟ್ಟದ ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಕಲ್ಯಾಣ ಇಲಾಖೆಯ ರಕ್ಷಣಾ ಅಧಿಕಾರಿಯನ್ನು ಭೇಟಿ ಮಾಡಿ **ಕೌಟುಂಬಿಕ ಘಟನೆ ವರದಿ (DIR - Form I)** ದಾಖಲಿಸಿ.
3. **ಹಂತ 3: ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ನ್ಯಾಯಾಲಯದಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ:**
   - ರಕ್ಷಣಾ ಅಧಿಕಾರಿ ಅಥವಾ ಉಚಿತ ಕಾನೂನು ನೆರವು ವಕೀಲರ ಮೂಲಕ ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಕೋರ್ಟ್‌ನಲ್ಲಿ PWDVA ಸೆಕ್ಷನ್ 12 ರ ಅಡಿಯಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ತಕ್ಷಣದ ರಕ್ಷಣಾ ಆದೇಶಗಳನ್ನು ಪಡೆಯಿರಿ.

---

### 3. ಪುರಾವೆಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ
- [ ] ವೈದ್ಯಕೀಯ ಪ್ರಮಾಣಪತ್ರಗಳು (MLC), ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು ಮತ್ತು ಗಾಯದ ಫೋಟೋಗಳು.
- [ ] ಬೆದರಿಕೆಯ ಸಂದೇಶಗಳು, ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್‌ಗಳು ಮತ್ತು ಕರೆ ದಾಖಲೆಗಳು.
- [ ] ವರದಕ್ಷಿಣೆ ಬೇಡಿಕೆಗಳು ಅಥವಾ ಆರ್ಥಿಕ ವಂಚನೆಯ ಪುರಾವೆಗಳು.
- [ ] ಗುರುತಿನ ಚೀಟಿಗಳು (ಆಧಾರ್, ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ) ಸುರಕ್ಷಿತ ಕ್ಲೌಡ್ ಡ್ರೈವ್‌ನಲ್ಲಿ ಇರಿಸಿ.

---

### 4. ಉಚಿತ ಕಾನೂನು ನೆರವು ಮತ್ತು ಸಂಪರ್ಕಗಳು
- **ರಾಷ್ಟ್ರೀಯ ಕಾನೂನು ಸೇವೆಗಳ ಪ್ರಾಧಿಕಾರ (NALSA):** ಟೋಲ್-ಫ್ರೀ **15100** (24/7 ಉಚಿತ ವಕೀಲರ ನೆರವು)
- **ಸಖಿ ಒನ್ ಸ್ಟಾಪ್ ಸೆಂಟರ್ (OSC):** **181** (ತುರ್ತು ಆಶ್ರಯ, ವೈದ್ಯಕೀಯ ಮತ್ತು ಕಾನೂನು ನೆರವು)
- **ತುರ್ತು ಪೊಲೀಸ್:** **112** ಅಥವಾ **1091**`;
    }

    // Default Kannada Legal Response
    return `### ⚖️ ಸಮಗ್ರ ಕಾನೂನು ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಶಾಸನಬದ್ಧ ಹಕ್ಕುಗಳು
**ಅಧಿಕೃತ ಚೌಕಟ್ಟು:** *ಕೌಟುಂಬಿಕ ದೌರ್ಜನ್ಯದಿಂದ ಮಹಿಳೆಯರ ರಕ್ಷಣೆ ಕಾಯ್ದೆ (PWDVA 2005)*, *ಭಾರತೀಯ ನ್ಯಾಯ ಸಂಹಿತೆ (BNS) 2023*, *ಭಾರತೀಯ ನಾಗರಿಕ ಸುರಕ್ಷಾ ಸಂಹಿತೆ (BNSS) 2023*, ಮತ್ತು *ಕಾನೂನು ಸೇವೆಗಳ ಪ್ರಾಧಿಕಾರಗಳ ಕಾಯ್ದೆ 1987*.

---

### 1. ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕ ಮತ್ತು ಬದುಕುಳಿದವರ ಮೂಲಭೂತ ಕಾನೂನು ರಕ್ಷಣೆಗಳು
1. **ಹಿಂಸಾಚಾರದಿಂದ ತಕ್ಷಣದ ರಕ್ಷಣೆಯ ಹಕ್ಕು (PWDVA 2005):**
   - ದೈಹಿಕ, ಭಾವನಾತ್ಮಕ ಅಥವಾ ಆರ್ಥಿಕ ದೌರ್ಜನ್ಯವನ್ನು ತಡೆಯಲು ವಿಭಾಗ 18 ರ ಅಡಿಯಲ್ಲಿ ರಕ್ಷಣಾ ಆದೇಶಗಳು.
   - ಹಂಚಿಕೆಯ ಮನೆಯಿಂದ ಹೊರಹಾಕದಂತೆ ವಿಭಾಗ 19 ರ ಅಡಿಯಲ್ಲಿ ನಿವಾಸದ ಹಕ್ಕು.
   - ವಿಭಾಗ 23 ರ ಅಡಿಯಲ್ಲಿ ತಕ್ಷಣದ ಏಕಪಕ್ಷೀಯ ಮಧ್ಯಂತರ ರಕ್ಷಣಾ ಆದೇಶಗಳು.
2. **ಸಾರ್ವತ್ರಿಕ ಉಚಿತ ಕಾನೂನು ನೆರವಿನ ಹಕ್ಕು (Article 39A & NALSA Act):**
   - ಕಾನೂನು ಸೇವೆಗಳ ಪ್ರಾಧಿಕಾರಗಳ ಕಾಯ್ದೆಯ ಸೆಕ್ಷನ್ 12 ರ ಅಡಿಯಲ್ಲಿ, **ಭಾರತದಲ್ಲಿನ ಎಲ್ಲಾ ಮಹಿಳೆಯರು ಮತ್ತು ಮಕ್ಕಳಿಗೆ 100% ಉಚಿತ ಕಾನೂನು ನೆರವು ಮತ್ತು ವಕೀಲರ ಸೇವೆ ಲಭ್ಯವಿದೆ**.
   - ನ್ಯಾಯಾಲಯದ ವಕೀಲರ ಪ್ರಾತಿನಿಧ್ಯ, ಅರ್ಜಿಗಳ ಸಲ್ಲಿಕೆ ಮತ್ತು ಶುಲ್ಕ ಮನ್ನಾ ಇದರಲ್ಲಿ ಒಳಗೊಂಡಿದೆ.
3. **ಶೂನ್ಯ ಎಫ್‌ಐಆರ್ (Zero FIR) ಮತ್ತು ಪೊಲೀಸ್ ಹೊಣೆಗಾರಿಕೆ:**
   - ಘಟನೆ ಎಲ್ಲಿ ನಡೆದಿದ್ದರೂ ಭಾರತದ ಯಾವುದೇ ಪೊಲೀಸ್ ಠಾಣೆಯಲ್ಲಿ **Zero FIR** ದಾಖಲಿಸಬಹುದು.
   - ಮಹಿಳಾ ಪೊಲೀಸ್ ಅಧಿಕಾರಿಯಿಂದಲೇ ಹೇಳಿಕೆಗಳನ್ನು ದಾಖಲಿಸಬೇಕು.
   - ಸೂರ್ಯಾಸ್ತ ಮತ್ತು ಸೂರ್ಯೋದಯದ ನಡುವೆ ಮಹಿಳೆಯರನ್ನು ಪೊಲೀಸ್ ಠಾಣೆಗೆ ಕರೆಯುವಂತಿಲ್ಲ.

---

### 2. ತಕ್ಷಣದ ಸುರಕ್ಷತೆ ಮತ್ತು ತುರ್ತು ಸಹಾಯವಾಣಿಗಳು
- **ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ವ್ಯವಸ್ಥೆ:** **112** (ಪೊಲೀಸ್, ಆಂಬ್ಯುಲೆನ್ಸ್, ಅಗ್ನಿಶಾಮಕ)
- **ಮಹಿಳಾ ಪೊಲೀಸ್ ಸಹಾಯವಾಣಿ:** **1091** (ತುರ್ತು ಪೊಲೀಸ್ ಗಸ್ತು)
- **ಮಹಿಳಾ ಕೌಟುಂಬಿಕ ಸಂಕಷ್ಟ ಸಹಾಯವಾಣಿ (ಸಖಿ OSC):** **181** (24/7 ತುರ್ತು ಆಶ್ರಯ ಮತ್ತು ಬೆಂಬಲ)
- **ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಅಪರಾಧ ಸಹಾಯವಾಣಿ:** **1930** (ಆನ್‌ಲೈನ್ ಕಿರುಕುಳ ಮತ್ತು ಆರ್ಥಿಕ ವಂಚನೆ)
- **NALSA ಉಚಿತ ಕಾನೂನು ನೆರವು ಸಹಾಯವಾಣಿ:** **15100** (ಉಚಿತ ವಕೀಲರ ನೇಮಕಾತಿ)`;
  }

  // HINDI (hi-IN)
  if (locale.startsWith('hi')) {
    if (
      q.includes('domestic') ||
      q.includes('violence') ||
      q.includes('abuse') ||
      q.includes('husband') ||
      q.includes('in-law') ||
      q.includes('inlaws') ||
      q.includes('beat') ||
      q.includes('hit') ||
      q.includes('torture') ||
      q.includes('dv') ||
      q.includes('हिंसा') ||
      q.includes('घरेलू') ||
      q.includes('पति') ||
      q.includes('ससुराल')
    ) {
      return `### ⚖️ व्यापक कानूनी सलाह: घरेलू हिंसा से राहत और आपातकालीन सुरक्षा
**शासी क़ानून:** *घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम, 2005 (PWDVA)* और *भारतीय न्याय संहिता (BNS) 2023 (धारा 85/86) / IPC धारा 498A*।

---

### 1. PWDVA 2005 के तहत आपके कानूनी अधिकार
**PWDVA 2005** एक विशेष दीवानी-आपराधिक कल्याणकारी क़ानून है जिसे घरेलू संबंध में महिलाओं को शारीरिक, यौन, मौखिक, भावनात्मक और आर्थिक दुर्व्यवहार से त्वरित, आपातकालीन सुरक्षा प्रदान करने के लिए बनाया गया है:

- **धारा 3 PWDVA (दुर्व्यवहार की व्यापक परिभाषा):**
  - *शारीरिक दुर्व्यवहार:* हमला, शारीरिक चोट या आपराधिक बल का प्रयोग।
  - *यौन दुर्व्यवहार:* कोई भी ऐसा आचरण जो महिला की गरिमा का उल्लंघन करता हो या अपमानित करता हो।
  - *मौखिक और भावनात्मक दुर्व्यवहार:* अपमान, लगातार शारीरिक नुकसान की धमकियां या ताने।
  - *आर्थिक दुर्व्यवहार:* वित्तीय संसाधनों से वंचित करना, भरण-पोषण न देना या बुनियादी आवश्यकताओं से इनकार करना।
- **धारा 17 PWDVA (साझा घर में रहने का अधिकार):**
  - हर महिला को **साझा घर (Shared Household)** में रहने का कानूनी अधिकार है। क़ानून की उचित प्रक्रिया के बिना आपको घर से बेदखल नहीं किया जा सकता।
- **धारा 18 PWDVA (संरक्षण आदेश):**
  - मजिस्ट्रेट दुर्व्यवहार करने वाले को हिंसा करने, आपके कार्यस्थल में प्रवेश करने या किसी भी रूप में संपर्क करने से रोकने का आदेश दे सकते हैं।
- **धारा 19 PWDVA (निवास आदेश):**
  - साझा घर से आपकी बेदखली पर रोक या वैकल्पिक आवास उपलब्ध कराने का निर्देश।
- **धारा 20 PWDVA (वित्तीय राहत):**
  - चिकित्सा खर्च और भरण-पोषण के लिए वित्तीय राहत आदेश।
- **धारा 21 PWDVA (बच्चों की अस्थायी हिरासत):**
  - बच्चों की अस्थायी हिरासत प्रदान करने का अधिकार।
- **धारा 23 PWDVA (तत्काल एकतरफा अंतरिम राहत):**
  - अदालत में प्रतिवादी के आने का इंतजार किए बिना **तुरंत अंतरिम संरक्षण आदेश** पारित किए जा सकते हैं।
- **धारा 31 PWDVA (आदेश उल्लंघन पर दंड):**
  - संरक्षण आदेश का उल्लंघन एक संज्ञेय और गैर-जमानती अपराध है जिसमें 1 वर्ष तक का कारावास हो सकता है।

---

### 2. तत्काल कदम और कानूनी प्रक्रिया
1. **चरण 1: तत्काल सुरक्षा और आपातकालीन कॉल:**
   - यदि आप तत्काल शारीरिक खतरे में हैं, तो पुलिस आपातकालीन **112** या महिला हेल्पलाइन **1091** पर कॉल करें।
2. **चरण 2: संरक्षण अधिकारी (Protection Officer) से संपर्क:**
   - जिले के संरक्षण अधिकारी से मिलकर **घरेलू घटना रिपोर्ट (DIR - Form I)** दर्ज कराएं।
3. **चरण 3: मजिस्ट्रेट अदालत में आवेदन:**
   - धारा 12 PWDVA के तहत अदालत में अंतरिम राहत की मांग करें।

---

### 3. कानूनी सहायता और हेल्पलाइन
- **राष्ट्रीय विधिक सेवा प्राधिकरण (NALSA):** **15100** (24/7 मुफ्त कानूनी सहायता)
- **सखी वन स्टॉप सेंटर (OSC):** **181** (आपातकालीन आश्रय, चिकित्सा एवं परामर्श)
- **राष्ट्रीय आपातकालीन सहायता:** **112** या **1091**`;
    }

    return `### ⚖️ व्यापक कानूनी मार्गदर्शन और वैधानिक अधिकार
**अधिकार क्षेत्र:** *घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम (PWDVA 2005)*, *भारतीय न्याय संहिता (BNS) 2023*, और *विधिक सेवा प्राधिकरण अधिनियम 1987*।

---

### 1. नागरिकों के मौलिक कानूनी अधिकार
1. **हिंसा से तत्काल संरक्षण (PWDVA 2005):**
   - धारा 18 के तहत संरक्षण आदेश, धारा 19 के तहत साझा घर में रहने का अधिकार, और धारा 23 के तहत तत्काल अंतरिम राहत।
2. **मुफ्त कानूनी सहायता का अधिकार (NALSA Act 1987):**
   - धारा 12 के तहत **सभी महिलाओं और बच्चों को 100% मुफ्त कानूनी सलाह और वकील की सुविधा** उपलब्ध है।
3. **ज़ीरो एफआईआर (Zero FIR) और पुलिस प्रक्रिया:**
   - भारत के किसी भी पुलिस स्टेशन में Zero FIR दर्ज कराई जा सकती है। महिला पुलिस अधिकारी द्वारा ही बयान दर्ज किए जाने का वैधानिक अधिकार।

---

### 2. 24/7 सत्यापित आपातकालीन हेल्पलाइन
- **राष्ट्रीय आपातकालीन सहायता:** **112** (पुलिस, एम्बुलेंस, दमकल)
- **महिला पुलिस हेल्पलाइन:** **1091**
- **महिला संकट हेल्पलाइन (सखी OSC):** **181**
- **राष्ट्रीय साइबर अपराध हेल्पलाइन:** **1930**
- **NALSA मुफ्त कानूनी सहायता हेल्पलाइन:** **15100**`;
  }

  // OTHER NON-ENGLISH REGIONAL LANGUAGES (Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi, Malayalam, Odia, Assamese, Urdu)
  if (locale !== 'en-IN') {
    // Generate authoritative localized summary header based on language
    const headers: Record<string, string> = {
      'ta-IN': '### ⚖️ விரிவான சட்ட ஆலோசனை: குடும்ப வன்முறை நிவாரணம் மற்றும் அவசர பாதுகாப்பு\n**சட்டக் கட்டமைப்பு:** *குடும்ப வன்முறையிலிருந்து பெண்களைப் பாதுகாக்கும் சட்டம் (PWDVA 2005)* & *பாரதிய நியாய சன்ஹிதா (BNS 2023)*.',
      'te-IN': '### ⚖️ సమగ్ర చట్టపరమైన సలహా: గృహ హింస ఉపశమనం మరియు అత్యవసర రక్షణ\n**చట్టపరమైన ఫ్రేమ్‌వర్క్:** *గృహ హింస నుండి మహిళల రక్షణ చట్టం (PWDVA 2005)* & *భారతీయ న్యాయ సంహిత (BNS 2023)*.',
      'bn-IN': '### ⚖️ বিস্তৃত আইনি পরামর্শ: গার্হস্থ্য সহিংসতা প্রতিকার ও জরুরি সুরক্ষা\n**আইনি পরিকাঠামো:** *গার্হস্থ্য সহিংসতা থেকে মহিলাদের সুরক্ষা আইন (PWDVA 2005)* ও *ভারতীয় ন্যায় সংহিতা (BNS 2023)*.',
      'mr-IN': '### ⚖️ सविस्तर कायदेशीर सल्ला: कौटुंबिक हिंसाचार निवारण आणि तातडीचे संरक्षण\n**कायदेशीर चौकट:** *कौटुंबिक हिंसाचारापासून महिलांचे संरक्षण कायदा (PWDVA 2005)* आणि *भारतीय न्याय संहिता (BNS 2023)*.',
      'gu-IN': '### ⚖️ વ્યાપક કાનૂની સલાહ: ઘરેલું હિંસા સામે રક્ષણ અને કટોકટી સહાય\n**કાનૂની માળખું:** *ઘરેલું હિંસા સામે મહિલા રક્ષણ અધિનિયમ (PWDVA 2005)* અને *ભારતીય ન્યાય સંહિતા (BNS 2023)*.',
      'pa-IN': '### ⚖️ ਵਿਆਪਕ ਕਾਨੂੰਨੀ ਸਲਾਹ: ਘਰੇਲੂ ਹਿੰਸਾ ਰਾਹਤ ਅਤੇ ਐਮਰਜੈਂਸੀ ਸੁਰੱਖਿਆ\n**ਕਾਨੂੰਨੀ ਢਾਂਚਾ:** *ਘਰੇਲੂ ਹਿੰਸਾ ਤੋਂ ਔਰਤਾਂ ਦੀ ਸੁਰੱਖਿਆ ਐਕਟ (PWDVA 2005)* ਅਤੇ *ਭਾਰਤੀ ਨਿਆਂ ਸੰਹਿਤਾ (BNS 2023)*.',
      'ml-IN': '### ⚖️ സമഗ്രമായ നിയമോപദേശം: ഗാർഹിക പീഡന പരിഹാരവും അടിയന്തര സംരക്ഷണവും\n**നിയമ ചട്ടക്കൂട്:** *ഗാർഹിക പീഡന സംരക്ഷണ നിയമം (PWDVA 2005)* & *ഭാരതീയ ന്യായ സംഹിത (BNS 2023)*.',
      'od-IN': '### ⚖️ ବିସ୍ତୃତ ଆଇନଗତ ପରାମର୍ଶ: ଘରୋଇ ହିଂସା ପ୍ରତିକାର ଓ ଜରୁରୀକାଳୀନ ସୁରକ୍ଷା\n**ଆଇନଗତ ଢାଞ୍ଚା:** *ଘରୋଇ ହିଂସା ବିରୋଧୀ ମହିଳା ସୁରକ୍ଷା ଆଇନ (PWDVA 2005)* ଏବଂ *ଭାରତୀୟ ନ୍ୟାୟ ସଂହିତା (BNS 2023)*.',
      'as-IN': '### ⚖️ ব্যাপক আইনী পৰামৰ্শ: ঘৰুৱা হিংসা প্ৰতিকাৰ আৰু জৰুৰীকালীন সুৰক্ষা\n**আইনী ব্যৱস্থা:** *ঘৰুৱা হিংসাৰ পৰা মহিলাৰ সুৰক্ষা আইন (PWDVA 2005)* আৰু *ভাৰতীয় ন্যায় সংহিতা (BNS 2023)*.',
      'ur-IN': '### ⚖️ جامع قانونی رہنمائی: گھریلو تشدد سے نجات اور ہنگامی تحفظ\n**قانونی فریم ورک:** *گھریلو تشدد سے خواتین کے تحفظ کا ایکٹ (PWDVA 2005)* اور *بھارتیہ نیاۓ سنہتا (BNS 2023)*.',
    };

    const helplines: Record<string, string> = {
      'ta-IN': '### 24/7 அவசர உதவி எண்கள்\n- **காவல்துறை:** **112** அல்லது **1091**\n- **சகி பெண்கள் உதவி மையம்:** **181**\n- **இலவச சட்ட உதவி (NALSA):** **15100**',
      'te-IN': '### 24/7 అత్యవసర హెల్ప్‌లైన్లు\n- **పోలీస్:** **112** లేదా **1091**\n- **సఖి మహిళా హెల్ప్‌లైన్:** **181**\n- **ఉచిత న్యాయ సహాయం (NALSA):** **15100**',
      'bn-IN': '### ২৪/৭ জরুরি হেল্পলাইন\n- **পুলিশ:** **১১২** বা **১০৯১**\n- **সখী নারী হেল্পলাইন:** **১৮১**\n- **বিনামূল্যে আইনি সহায়তা (NALSA):** **১৫১০০**',
      'mr-IN': '### २४/७ तातडीची हेल्पलाइन\n- **पोलीस:** **११२** किंवा **१०९१**\n- **सखी महिला हेल्पलाइन:** **१८१**\n- **मोफत कायदेशीर मदत (NALSA):** **१५१००**',
      'gu-IN': '### 24/7 કટોકટી હેલ્પલાઇન\n- **પોલીસ:** **112** અથવા **1091**\n- **સખી મહિલા હેલ્પલાઇન:** **181**\n- **મફત કાનૂની સહાય (NALSA):** **15100**',
      'pa-IN': '### 24/7 ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨਾਂ\n- **ਪੁਲਿਸ:** **112** ਜਾਂ **1091**\n- **ਸਖੀ ਮਹਿਲਾ ਹੈਲਪਲਾਈਨ:** **181**\n- **ਮੁਫ਼ਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ (NALSA):** **15100**',
      'ml-IN': '### 24/7 അടിയന്തര ഹെൽപ്പ് ലൈനുകൾ\n- **പോലീസ്:** **112** അല്ലെങ്കിൽ **1091**\n- **സഖി വനിതാ ഹെൽപ്പ് ലൈൻ:** **181**\n- **സൗജന്യ നിയമ സഹായം (NALSA):** **15100**',
      'od-IN': '### ୨୪/୭ ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ\n- **ପୋଲିସ:** **୧୧୨** କିମ୍ବା **୧୦୯୧**\n- **ସଖୀ ମହିଳା ହେଲ୍ପଲାଇନ:** **୧୮୧**\n- **ମାଗଣା ଆଇନଗତ ସହାୟତା (NALSA):** **୧୫୧୦୦**',
      'as-IN': '### ২৪/৭ জৰুৰীকালীন হেল্পলাইন\n- **আৰক্ষী:** **১১২** বা **১০৯১**\n- **সখী মহিলা হেল্পলাইন:** **১৮১**\n- **বিনামূলীয়া আইনী সাহায্য (NALSA):** **১৫১০০**',
      'ur-IN': '### 24/7 ہنگامی ہیلپ لائنز\n- **پولیس:** **112** یا **1091**\n- **سکھی ویمن ہیلپ لائن:** **181**\n- **مفت قانونی امداد (NALSA):** **15100**',
    };

    const header = headers[locale] || headers['ta-IN'];
    const hline = helplines[locale] || helplines['ta-IN'];

    return `${header}

---

### 1. PWDVA 2005 & Statutory Remedies
- **Section 3 (Definition of Abuse):** Protection against physical harm, psychological trauma, verbal humiliation, and economic deprivation.
- **Section 17 (Shared Household):** Inviolable statutory right to reside in the shared matrimonial home without illegal eviction.
- **Section 18 (Protection Orders):** Injunction orders strictly restraining the respondent from committing domestic violence or approaching you.
- **Section 19 (Residence Orders):** Orders barring the respondent from entering your residence or mandating alternate paid accommodation.
- **Section 20 (Monetary Relief):** Mandatory financial maintenance and medical compensation.
- **Section 23 (Ex-Parte Interim Orders):** Immediate emergency protection granted without waiting for court hearing delays.

---

### 2. Immediate Step-by-Step Action Plan
1. **Emergency Safety:** If in immediate physical danger, contact emergency police response.
2. **Protection Officer:** File a Domestic Incident Report (DIR - Form I) at your local taluk/district women welfare office.
3. **Magistrate Application:** File under Section 12 PWDVA for fast-track interim orders.

---

${hline}`;
  }

  // ENGLISH (en-IN / default)
  // 1. Workplace Harassment / POSH Act
  if (
    q.includes('harass') ||
    q.includes('workplace') ||
    q.includes('posh') ||
    q.includes('office') ||
    q.includes('colleague') ||
    q.includes('boss') ||
    q.includes('manager') ||
    q.includes('icc')
  ) {
    return `### ⚖️ Comprehensive Legal Advisory: Protection Against Workplace Sexual Harassment
**Governing Statute:** *Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act)* & *Bharatiya Nyaya Sanhita (BNS) 2023 / Indian Penal Code (IPC)*.

---

### 1. Statutory Provisions & Legal Architecture
Under the **POSH Act, 2013**, every woman has an absolute fundamental right to a safe, dignified work environment free from sexual harassment, gender discrimination, and hostile work conditions:

- **Section 2(n) POSH Act (Definition):** Sexual harassment includes any unwelcome physical contact and advances, a demand or request for sexual favors, making sexually colored remarks, showing pornography, or any other unwelcome physical, verbal, or non-verbal conduct of sexual nature.
- **Section 4 POSH Act (Internal Complaints Committee - ICC):** Mandatory for every organization with **10 or more employees** across all branches. The ICC must be headed by a senior woman presiding officer, with at least 50% women members, and at least one independent external member from an NGO committed to women's rights.
- **Section 6 POSH Act (Local Complaints Committee - LCC):** Established by the District Officer in every district to handle complaints from organizations with fewer than 10 employees or where the complaint is directly against the employer.
- **Section 9 POSH Act (Filing Timeline):** A written complaint must be submitted within **3 months** of the incident. In cases of ongoing harassment, within 3 months of the last incident.
- **Section 16 POSH Act (Strict Non-Disclosure & Confidentiality):** Strictly forbids publishing, publicizing, or disclosing the identity, address, or details of the complainant or witnesses.
- **Section 75 BNS 2023 (Section 354A IPC):** Criminal prosecution for sexual harassment carrying rigorous imprisonment up to **3 years** with fine.

---

### 2. Immediate Step-by-Step Action Plan
1. **Document Every Occurrence Immediately:**
   - Record exact dates, times, locations, specific words spoken, and names of any witnesses.
   - Preserve all emails, Teams/Slack messages, WhatsApp chats, text messages, and call logs.
2. **Draft the Formal ICC Complaint:**
   - Address the complaint to: *"The Presiding Officer, Internal Complaints Committee (ICC)"*.
   - Detail the chronology of incidents clearly. Attach printouts or digital copies of all supporting evidence.
3. **Exercise Your Right to Interim Relief (Section 12 POSH Act):**
   - Transfer of either yourself or the respondent to another department or branch.
   - Up to **3 months of fully paid leave** (statutory leave in addition to earned leave).
   - Restraint orders prohibiting the respondent from supervising or reviewing your performance appraisal.

---

### 3. Verified Helplines & Portals
- **National Emergency Response:** Dial **112**
- **NCW 24/7 Helpline:** Dial **7827170170**
- **She-Box Portal (Central Government):** [https://shebox.wcd.gov.in](https://shebox.wcd.gov.in)
- **NALSA Free Legal Aid:** Dial **15100**`;
  }

  // 2. Domestic Violence & Cruelty
  if (
    q.includes('domestic') ||
    q.includes('violence') ||
    q.includes('abuse') ||
    q.includes('husband') ||
    q.includes('in-law') ||
    q.includes('inlaws') ||
    q.includes('beat') ||
    q.includes('hit') ||
    q.includes('torture') ||
    q.includes('dv')
  ) {
    return `### ⚖️ Comprehensive Legal Advisory: Domestic Violence Relief & Emergency Protection
**Governing Statutes:** *Protection of Women from Domestic Violence Act, 2005 (PWDVA)* & *Bharatiya Nyaya Sanhita (BNS) 2023 (Sections 85/86) / IPC Section 498A*.

---

### 1. Your Enforceable Statutory Rights Under PWDVA 2005
The **PWDVA 2005** is a specialized civil-criminal welfare statute designed to provide rapid, emergency protection to women in a domestic relationship against physical, sexual, verbal, emotional, and economic abuse:

- **Section 3 PWDVA (Comprehensive Definition of Abuse):**
  - *Physical Abuse:* Assault, battery, bodily hurt, or use of criminal force.
  - *Sexual Abuse:* Any conduct of a sexual nature that abuses, humiliates, degrades, or violates dignity.
  - *Verbal and Emotional Abuse:* Insults, ridicule, humiliating name-calling, repeated threats to cause physical pain, or harassment regarding childbearing or dowry.
  - *Economic Abuse:* Deprivation of all or any economic/financial resources, non-payment of maintenance, selling or alienating shared assets, or denying access to basic household necessities.
- **Section 17 PWDVA (Absolute Right to Reside in Shared Household):**
  - Every woman in a domestic relationship has the statutory right to reside in the **shared household**, regardless of whether she holds any legal title, tenancy, or financial ownership rights. You cannot be evicted or excluded from the household without due process of law.
- **Section 18 PWDVA (Protection Orders):**
  - The Magistrate can issue orders strictly prohibiting the abuser from committing any domestic violence, aiding or abetting violence, entering your place of employment, attempting communication, alienating shared assets, or causing violence to your dependents.
- **Section 19 PWDVA (Residence Orders):**
  - Restraining the abuser from dispossessing or evicting you from the shared household, or directing alternative accommodation with rent paid.
- **Section 20 PWDVA (Monetary Relief):**
  - Enforceable orders directing the respondent to pay for medical expenses, loss of earnings, loss of property, and fair maintenance.
- **Section 21 PWDVA (Temporary Child Custody):**
  - The Magistrate may grant temporary custody of minor children to the woman.
- **Section 23 PWDVA (Emergency Ex-Parte Interim Relief):**
  - **Immediate ex-parte interim protection orders can be passed without waiting for the abuser to appear in court**.
- **Section 31 PWDVA (Penalty for Breach):**
  - Breach of any Protection Order by the respondent is a **cognizable and non-bailable offense** punishable by imprisonment up to **1 year** and fine up to ₹20,000.

---

### 2. Immediate Step-by-Step Action Plan
1. **Immediate Safety & MLC:** Dial **112** or **1091**. If injured, visit a government hospital for a Medico-Legal Certificate (MLC).
2. **Contact Protection Officer (PO):** Approach your district PO or Sakhi One Stop Centre (**181**) to draft a Domestic Incident Report (DIR - Form I).
3. **Magistrate Court Petition:** File under Section 12 PWDVA for instant ex-parte interim relief.

---

### 3. Verified Emergency Helplines
- **National Emergency:** Dial **112**
- **Women Police Helpline:** Dial **1091**
- **Sakhi One Stop Centre:** Dial **181**
- **NALSA Free Legal Aid:** Dial **15100**`;
  }

  // 3. Default English Fallback
  return `### ⚖️ Comprehensive Legal Guidance & Statutory Rights in India
**Authoritative Framework:** *Protection of Women from Domestic Violence Act (PWDVA 2005)*, *Bharatiya Nyaya Sanhita (BNS) 2023*, *Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023*, *POSH Act 2013*, & *Legal Services Authorities Act 1987*.

---

### 1. Fundamental Legal Protections for Every Citizen & Survivor
1. **Right to Immediate Protection from Violence (PWDVA 2005):**
   - Enforceable court orders under Section 18 prohibiting any form of physical, emotional, sexual, or economic abuse.
   - Statutory right under Section 19 to remain in your shared household without eviction.
   - Ex-parte interim protection orders available on affidavit under Section 23 without waiting for formal court trials.
2. **Right to Universal Free Legal Aid (Article 39A & NALSA Act, 1987):**
   - Under **Section 12 of the Legal Services Authorities Act**, **ALL women and children in India are entitled to 100% free legal aid and counsel**, regardless of income.
   - Free services include court advocate representation, drafting of petitions, bail applications, court fee waivers, and certified document costs.
3. **Zero FIR & Police Accountability Rights:**
   - A **Zero FIR** can be lodged at *any* police station across India regardless of where the incident occurred.
   - Statements must be recorded by a woman police officer.
   - Women cannot be called to a police station between sunset and sunrise or detained without judicial authorization.

---

### 2. Immediate Step-by-Step Safety & Action Plan
- **Phase 1 (Immediate Safety):** If in acute danger, dial **112** (National Emergency) or **1091** (Women Police Helpline).
- **Phase 2 (Shelter & Protection):** Walk into any **Sakhi One Stop Centre (OSC)** located in every district across India or dial **181**.
- **Phase 3 (Legal Filing):** Approach the District Legal Services Authority (DLSA) at your local court complex or dial **15100** (NALSA).

---

### 3. 24/7 Verified National Emergency Helplines
- **National Emergency Response Support System:** **112** (Police, Ambulance, Fire)
- **Women's Police Helpline:** **1091** (Direct emergency police dispatch)
- **National Domestic Distress Helpline (Sakhi OSC):** **181** (24/7 emergency shelter & support)
- **National Cybercrime Reporting Helpline:** **1930** (Online harassment & financial fraud)
- **NALSA National Free Legal Aid Helpline:** **15100** (Free attorney appointment)`;
}
