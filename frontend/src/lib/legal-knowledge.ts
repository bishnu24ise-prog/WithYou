/**
 * SafeSpark Legal Knowledge Engine
 * Provides exhaustive, section-by-section statutory legal guidance under Indian Law
 * (PWDVA 2005, POSH Act 2013, BNS / IPC, IT Act 2000, NALSA 1987, BNSS / CrPC).
 * Used by LawBot and TinyFish research agents to deliver deeply detailed, authoritative answers.
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
- **Section 9 POSH Act (Filing Timeline):** A written complaint must be submitted within **3 months** of the incident. In cases of ongoing harassment, within 3 months of the last incident. The Committee has statutory discretion to extend this by another 3 months upon recording reasons in writing.
- **Section 16 POSH Act (Strict Non-Disclosure & Confidentiality):** Strictly forbids publishing, publicizing, or disclosing the identity, address, or details of the complainant or witnesses. Violations attract statutory fines on the employer.
- **Section 75 BNS 2023 (Section 354A IPC):** Criminal prosecution for sexual harassment carrying rigorous imprisonment up to **3 years** with fine.
- **Section 79 BNS 2023 (Section 509 IPC):** Word, gesture, or act intended to insult the modesty of a woman, carrying imprisonment up to **3 years**.

---

### 2. Immediate Step-by-Step Action Plan
1. **Document Every Occurrence Immediately:**
   - Record exact dates, times, locations, specific words spoken, and names of any colleagues who were nearby.
   - Preserve all emails, Teams/Slack messages, WhatsApp chats, text messages, and call logs. Take full screenshots showing timestamps and contact handles.
2. **Draft the Formal ICC Complaint:**
   - Address the complaint to: *"The Presiding Officer, Internal Complaints Committee (ICC)"*.
   - Detail the chronology of incidents clearly. Attach printouts or digital copies of all supporting evidence.
   - Submit **6 copies** of the written complaint along with supporting documents (or submit via official grievance email).
3. **Exercise Your Right to Interim Relief (Section 12 POSH Act):**
   - During the pendency of the inquiry, you have the enforceable right to formally request:
     - Transfer of either yourself or the respondent to another department or branch.
     - Up to **3 months of fully paid leave** (this is statutory leave *in addition* to your earned/annual leave).
     - Restraint orders prohibiting the respondent from supervising, reviewing, or writing your performance appraisal.
4. **Timeline of ICC Proceedings (Section 11 & 13 POSH Act):**
   - Copy of complaint forwarded to respondent within **7 working days**.
   - Respondent must file their reply within **10 working days**.
   - Inquiry must be completed within **90 days**.
   - Inquiry report shared with employer and parties within **10 days** of completion.
   - Employer is legally mandated to implement recommendations within **60 days**.

---

### 3. Evidentiary Checklist to Secure Your Position
- [ ] Direct digital evidence: WhatsApp/Slack messages, emails, SMS, voice notes, calendar invites.
- [ ] Indirect/Contextual evidence: Performance appraisal records proving retaliatory downgraded reviews after rebuffing advances.
- [ ] Contemporaneous disclosure: Messages where you informed a friend, colleague, or family member shortly after the incident.
- [ ] CC/BCC copies: Always forward complaint correspondence to your confidential personal email account.

---

### 4. Verified Government Helplines & Legal Redressal Portals
- **National Emergency Response Support System (ERSS):** Dial **112** (Immediate police response)
- **National Commission for Women (NCW) 24/7 Helpline:** Dial **7827170170**
- **She-Box Portal (Central Government Online Complaint):** [https://shebox.wcd.gov.in](https://shebox.wcd.gov.in)
- **National Cybercrime Helpline:** Dial **1930** (For online harassment or morphing)
- **NALSA Free Legal Aid Helpline:** Dial **15100** (Free legal counsel for women under Legal Services Authorities Act)`;
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
  - The Magistrate can issue orders strictly prohibiting the abuser from committing any domestic violence, aiding or abetting violence, entering your place of employment, attempting communication (in person, by phone, or electronic), alienating shared assets, or causing violence to your dependents.
- **Section 19 PWDVA (Residence Orders):**
  - Restraining the abuser from dispossessing or evicting you from the shared household.
  - Directing the abuser to remove himself from the shared household.
  - Restraining the abuser or his relatives from entering any portion of the shared household where you reside.
  - Directing the respondent to secure alternative accommodation of an equivalent standard and pay all rent.
- **Section 20 PWDVA (Monetary Relief):**
  - Enforceable orders directing the respondent to pay for medical expenses, loss of earnings, loss of property, and fair maintenance for you and your minor children.
- **Section 21 PWDVA (Temporary Child Custody):**
  - The Magistrate may grant temporary custody of minor children to the woman to prevent abduction or emotional distress.
- **Section 23 PWDVA (Emergency Ex-Parte Interim Relief):**
  - If the Magistrate is satisfied upon your affidavit that domestic violence has occurred or is likely to occur, **immediate ex-parte interim protection orders can be passed without waiting for the abuser to appear in court**.
- **Section 31 PWDVA (Penalty for Breach):**
  - Breach of any Protection Order by the respondent is a **cognizable and non-bailable offense** punishable by imprisonment up to **1 year** and fine up to ₹20,000.

---

### 2. Criminal Remedies Under BNS 2023 / IPC
- **Section 85 BNS 2023 (Section 498A IPC):** Subjecting a woman to cruelty by her husband or husband's relative is punishable with imprisonment up to **3 years** and fine.
- **Section 86 BNS 2023:** Specifically defines cruelty as willful conduct likely to drive the woman to suicide or cause grave injury, danger to life, limb, or mental/physical health, or harassment with a view to coercing unlawful dowry demands.

---

### 3. Immediate Step-by-Step Action Plan
1. **Ensure Physical Safety (Hours 0–24):**
   - If in immediate physical danger, dial **112** (Police Dispatch) or **1091** (Women Police Helpline) immediately.
   - If injured, visit the nearest Government or District Hospital immediately and insist on a **Medico-Legal Certificate (MLC)**. The MLC is conclusive statutory evidence of physical assault.
2. **Contact a Protection Officer (PO) or One Stop Centre (OSC):**
   - Every district in India has designated **Protection Officers** under the Department of Women and Child Development.
   - The PO is legally required to assist you in preparing and filing the **Domestic Incident Report (Form I / DIR)**, arranging immediate medical aid, safe shelter home accommodation, and free legal counsel.
   - You can also walk into any **Sakhi One Stop Centre (OSC)** located in every district across India (accessible 24/7 via Helpline **181**).
3. **Filing an Application Under Section 12 PWDVA:**
   - File the application before the Judicial Magistrate of the First Class (JMFC) or Metropolitan Magistrate (MM) having jurisdiction over the area where you reside, where the incident occurred, or where the respondent resides.
   - Under Section 12(4), the court is mandated by law to fix the first hearing date **within 3 days** of receiving the application.

---

### 4. Critical Evidence Checklist to Assemble
- [ ] Medico-Legal Certificate (MLC) and all medical prescriptions/records of treatment.
- [ ] Dated photographs of physical injuries, bruises, or property damage.
- [ ] Audio/video recordings, CCTV footage, or call recordings of verbal abuse or threats.
- [ ] WhatsApp chats, SMS, emails, or written notes evidencing demands for money, insults, or threats.
- [ ] Financial proofs: Bank account statements, salary slips, records of Stridhan (jewelry, gifts, fixed deposits given during marriage).
- [ ] Identification documents: Safe digital copies of Aadhaar, voter ID, marriage certificate, children's birth certificates.

---

### 5. 24/7 Emergency Helplines & Verified Portals
- **National Emergency Number:** **112** (Police, Ambulance, Fire)
- **Women Police Helpline:** **1091** (Direct response vehicle dispatch)
- **National Domestic Violence Helpline (Sakhi OSC):** **181** (Toll-free, 24/7 shelter & medical assistance)
- **National Commission for Women (NCW):** **7827170170** (WhatsApp / Call)
- **NALSA Free Legal Aid Helpline:** **15100** (Free advocate representation for women)`;
  }

  // 3. Police Complaints, FIR, and Arrest Safeguards
  if (
    q.includes('police') ||
    q.includes('fir') ||
    q.includes('complaint') ||
    q.includes('station') ||
    q.includes('thana') ||
    q.includes('arrest') ||
    q.includes('cop') ||
    q.includes('investigat')
  ) {
    return `### ⚖️ Comprehensive Legal Advisory: Police Complaint, Zero FIR & Women's Procedural Safeguards
**Governing Statutes:** *Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 / Code of Criminal Procedure (CrPC), 1973* & Supreme Court Guidelines (*Lalita Kumari v. Govt of UP*).

---

### 1. Your Inalienable Rights During Police Interaction
Under Indian criminal jurisprudence, women are afforded strong statutory protections to prevent harassment, arbitrary detention, and procedural denial of justice:

- **The Doctrine of Zero FIR:**
  - A **Zero FIR** can be registered at **any police station across India**, regardless of whether the alleged offense occurred within their territorial jurisdiction.
  - The Supreme Court and Ministry of Home Affairs (MHA) advisories have made it mandatory: if a cognizable offense against a woman is disclosed, the police officer *must* register the Zero FIR immediately, assign it a temporary number '0', commence initial preliminary security, and transfer the case diary to the jurisdictional station.
- **Mandatory Registration (Lalita Kumari Mandate):**
  - Under Section 173 BNSS 2023 (Section 154 CrPC), if a complaint discloses the commission of a cognizable offense (e.g. rape, sexual assault, domestic cruelty, stalking, physical grievous hurt), **registration of an FIR is strictly mandatory**. Police cannot refuse registration or force the victim into compromise before lodging the FIR.
- **Statements Recorded by Women Officers (Section 173(1) BNSS):**
  - Any information relating to sexual offenses, domestic cruelty, or stalking against a woman must be recorded by a **woman police officer** or any woman officer.
- **Recording Under Section 183 BNSS (Section 164 CrPC):**
  - In cases involving sexual assault or molestation, the victim's statement must be recorded directly by a Judicial Magistrate in camera (private chamber), as soon as possible, without the presence of the accused.
- **Strict Safeguards Against Arrest of Women (Section 43 BNSS / Section 46(4) CrPC):**
  - No woman shall be arrested **between sunset and sunrise** (after dark and before morning light).
  - In exceptional circumstances where arrest is unavoidable, the arrest can only be made by a **woman police officer** who has obtained prior written permission from the Judicial Magistrate of the First Class.
  - A woman cannot be called to a police station as a witness or for questioning; questioning must take place at her place of residence in the presence of her parents, guardian, or family (Section 179 BNSS / Section 160 CrPC).
- **Free Copy of FIR (Section 173(2) BNSS / Section 154(2) CrPC):**
  - You have the absolute statutory right to receive a signed, stamped copy of the FIR **free of cost immediately upon registration**.

---

### 2. Step-by-Step Procedure to Lodge a Formal Police Complaint
1. **Drafting the Written Complaint:**
   - Clearly state the Station House Officer (SHO) of the police station.
   - Structure chronologically: Mention your details, accused details, date, time, exact location of each incident, specific criminal acts committed, and names/contacts of witnesses.
   - Mention all applicable offenses (e.g., Section 85 BNS for domestic cruelty, Section 75 BNS for sexual harassment, Section 351 BNS for criminal intimidation).
2. **Submitting and Receiving Acknowledgment:**
   - Submit the complaint in duplicate.
   - Ensure the police officer stamps, dates, and signs your copy with a **Daily Dairy (DD) Number** or **General Diary (GD) Entry Number**.
3. **What to Do If the Police Refuse to Register Your FIR:**
   - **Step A (Approach Senior Officers):** Under Section 173(4) BNSS / Section 154(3) CrPC, submit your complaint in writing by registered post or in person to the **Superintendent of Police (SP)** or **Commissioner of Police (CP)**. The SP is empowered to investigate the case personally or direct registration of the FIR.
   - **Step B (Judicial Magistrate Route):** Under Section 175(3) BNSS / Section 156(3) CrPC, file an application through a lawyer before the Judicial Magistrate. The Magistrate has statutory authority to direct the police to register the FIR and investigate the matter under court supervision.
   - **Step C (Private Criminal Complaint):** File a direct complaint before the Magistrate under Section 223 BNSS / Section 200 CrPC.

---

### 3. Key Helplines for Immediate Police Assistance
- **National Emergency Police Dispatch:** **112** (Monitored nationwide with GPS response)
- **Women's Police Helpline:** **1091** (Specialized women's cell officers)
- **National Legal Services Authority (NALSA):** **15100** (Free legal aid advocate assigned to represent you)
- **National Commission for Women (NCW):** **7827170170**`;
  }

  // 4. Cybercrime, Online Harassment, Stalking & Blackmail
  if (
    q.includes('cyber') ||
    q.includes('online') ||
    q.includes('stalk') ||
    q.includes('blackmail') ||
    q.includes('photo') ||
    q.includes('video') ||
    q.includes('nude') ||
    q.includes('morph') ||
    q.includes('leak') ||
    q.includes('hack') ||
    q.includes('instagram') ||
    q.includes('whatsapp')
  ) {
    return `### ⚖️ Comprehensive Legal Advisory: Cyber Harassment, Digital Stalking & Non-Consensual Imagery
**Governing Statutes:** *Information Technology Act, 2000 (IT Act)*, *Bharatiya Nyaya Sanhita (BNS) 2023*, & *Indian Penal Code (IPC)*.

---

### 1. Governing Legal Sections & Penalties
Digital harassment, non-consensual sharing of intimate images, sextortion, and cyberstalking are serious criminal offenses under Indian cyber laws:

- **Section 66E IT Act (Violation of Bodily Privacy):**
  - Capturing, publishing, or transmitting the image of a private area of any person without consent.
  - Penalty: Imprisonment up to **3 years** or fine up to ₹2,00,000, or both.
- **Section 67 & 67A IT Act (Publishing Obscene / Sexually Explicit Material):**
  - Section 67 penalizes publishing or transmitting obscene electronic content (up to 3 years imprisonment on first conviction, 5 years on second).
  - Section 67A strictly penalizes publishing or transmitting material containing sexually explicit acts. **Mandatory punishment up to 5 years imprisonment** and fine up to ₹10,00,000 on first conviction; up to 7 years on repeat.
- **Section 78 BNS 2023 (Section 354D IPC - Cyber Stalking):**
  - Any person who monitors the use by a woman of the internet, email, or any other form of electronic communication commits cyberstalking.
  - Penalty: Up to **3 years imprisonment** with fine for the first conviction; up to **5 years** for repeat offenses.
- **Section 308 / 351 BNS 2023 (Extortion & Criminal Intimidation - Sextortion):**
  - Threatening to release private photos/videos to extort money, sexual favors, or compliance. Punishable with imprisonment up to **7 years**.
- **Section 318 BNS 2023 (Section 419/420 IPC - Impersonation & Fake Profiles):**
  - Creating fake social media profiles using a woman's photograph or name to defame or harass her.

---

### 2. Immediate Crisis Response Checklist (Do Not Delete Evidence)
1. **Preserve Digital Forensics:**
   - Take full screen captures showing:
     - The profile handle, username, and account URL of the harasser.
     - Exact timestamps and dates of every message, call, or post.
     - Uncropped screenshots of threatening chats, blackmail demands, and payment requests.
   - Do NOT delete the chat history or block the user immediately until screenshots and exported chat transcripts (.txt) are saved safely.
2. **Proactive Prevention via StopNCII.org:**
   - If intimate images or videos are being threatened, visit [https://stopncii.org](https://stopncii.org) (supported by Government of India and global tech platforms).
   - This service creates digital cryptographic hashes (digital fingerprints) directly on your device without uploading the raw photo, preventing the media from ever being shared on Instagram, Facebook, TikTok, and participating platforms.
3. **Register on the National Cybercrime Reporting Portal:**
   - Visit **https://cybercrime.gov.in** and select *"Report Women/Child Related Crime"*.
   - You can choose to file an **anonymous complaint** or a formal complaint leading to an FIR.
   - You can also dial the National Cybercrime Helpline at **1930** (24/7 toll-free).
4. **Platform-Level Takedown Requests:**
   - Under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, social media platforms (Meta, Google, X, WhatsApp) are legally required to remove non-consensual intimate imagery **within 24 hours** of receiving a grievance.

---

### 3. Emergency Contacts for Cybercrime
- **National Cybercrime Helpline:** Dial **1930** (24/7 assistance for reporting harassment and stopping financial fraud)
- **Official National Portal:** [https://cybercrime.gov.in](https://cybercrime.gov.in)
- **National Emergency:** Dial **112**
- **NCW Cyber Cell:** Dial **7827170170**`;
  }

  // 5. Dowry, Stridhan & Matrimonial Property
  if (
    q.includes('dowry') ||
    q.includes('stridhan') ||
    q.includes('dahej') ||
    q.includes('jewel') ||
    q.includes('gold') ||
    q.includes('gift') ||
    q.includes('498a')
  ) {
    return `### ⚖️ Comprehensive Legal Advisory: Dowry Prohibition, Stridhan Rights & Asset Recovery
**Governing Statutes:** *Dowry Prohibition Act, 1961*, *Protection of Women from Domestic Violence Act, 2005 (PWDVA)*, & Landmark Supreme Court Precedents (*Pratibha Rani v. Suraj Kumar*).

---

### 1. Stridhan: Your Absolute, Exclusive Personal Property
A critical and often misunderstood area of Indian matrimonial law is the legal status of **Stridhan**:

- **Supreme Court Mandate (*Pratibha Rani v. Suraj Kumar, 1985*):**
  - The Supreme Court of India ruled that **Stridhan is the absolute, exclusive personal property of the woman**. The husband or his family members act merely as trustees; they have zero ownership rights, title, or co-ownership over her Stridhan.
  - What constitutes Stridhan:
    - All jewelry (gold, silver, diamonds, precious stones) gifted to the woman before, at the time of, or after marriage by her parents, in-laws, husband, or relatives.
    - All cash, bank fixed deposits, real estate, vehicles, clothes, and household articles gifted specifically to her.
- **Criminal Breach of Trust (Section 316 BNS 2023 / Section 405 & 406 IPC):**
  - If the husband or in-laws refuse to return the woman's Stridhan upon demand, they are guilty of **Criminal Breach of Trust**, an offense punishable with imprisonment up to **3 years** and fine.
- **Recovery Under PWDVA 2005 (Section 19(8)):**
  - The Magistrate is empowered to pass a direct order directing the respondent to return all Stridhan, personal jewelry, clothes, and documents to the woman within a specified time limit, enforced through court-appointed Protection Officers.

---

### 2. Dowry Prohibition Act, 1961 Provisions
- **Section 3 Dowry Prohibition Act:** Giving or taking dowry, or abetting the giving or taking of dowry, is punishable with imprisonment for a minimum term of **5 years** and a fine not less than ₹15,000 or the amount of the value of such dowry.
- **Section 4 Dowry Prohibition Act:** Demanding dowry directly or indirectly from the parents or guardians of a bride is punishable with imprisonment up to **2 years** with fine.
- **Section 85 BNS 2023 / Section 498A IPC:** Harassment of a woman to coerce her or any person related to her to meet any unlawful demand for dowry or property constitutes non-bailable cruelty.

---

### 3. Procedural Steps for Stridhan Recovery
1. **Prepare an Itemized Inventory of Stridhan:**
   - Create a comprehensive table listing every item: Description, approx weight (for gold/silver), date gifted, donor name, and photographs/receipts.
2. **Issue a Formal Written Legal Notice:**
   - Send a registered demand letter to the husband and in-laws demanding the unconditional return of all Stridhan items within 15 days.
3. **File Section 19(8) Application under PWDVA:**
   - File along with your Section 12 application before the Judicial Magistrate. The court can order immediate seizure and handover of the items.
4. **Lodge Criminal Complaint for Breach of Trust:**
   - If items are withheld or pawned, register an FIR under Section 316 BNS / Section 406 IPC.

---

### 4. Verified Helplines & Legal Assistance
- **National Legal Services Authority (Free Legal Aid):** Dial **15100**
- **National Commission for Women (NCW):** Dial **7827170170**
- **National Emergency:** Dial **112**
- **Women's Helpline:** Dial **1091** or **181**`;
  }

  // 6. Maintenance, Alimony, Child Custody & Divorce
  if (
    q.includes('maintenance') ||
    q.includes('alimony') ||
    q.includes('custody') ||
    q.includes('divorce') ||
    q.includes('child') ||
    q.includes('separation') ||
    q.includes('kharcha')
  ) {
    return `### ⚖️ Comprehensive Legal Advisory: Maintenance, Child Custody & Matrimonial Remedies
**Governing Statutes:** *Section 144 BNSS 2023 (Section 125 CrPC)*, *Section 20 PWDVA 2005*, *Hindu Marriage Act, 1955*, & *Guardians and Wards Act, 1890*.

---

### 1. Maintenance Rights for Women and Minor Children
Under Indian law, a woman cannot be left destitute or financially incapacitated following matrimonial discord:

- **Section 144 BNSS 2023 / Section 125 CrPC (Universal Maintenance):**
  - Applies to all women across all religions and communities.
  - If any person having sufficient means neglects or refuses to maintain his wife who is unable to maintain herself, the Magistrate can order a monthly maintenance allowance.
  - **Interim Maintenance Timeline:** The law mandates that applications for interim maintenance must be disposed of **within 60 days** from the date of notice to the respondent.
  - **Supreme Court Landmark Precedent (*Rajnesh v. Neha, 2020*):**
    - Both parties are legally mandated to file comprehensive Affidavits of Assets and Liabilities.
    - Maintenance is awarded taking into account the financial standing of the husband, the lifestyle the wife enjoyed during marriage, inflation, and child educational/medical expenses.
- **Section 20 & 22 PWDVA 2005:**
  - Additional maintenance and compensation for emotional trauma can be claimed simultaneously under the Domestic Violence Act.
- **Section 24 & 25 Hindu Marriage Act, 1955:**
  - Section 24: Maintenance *pendente lite* (interim support and full legal expenses paid by husband during the divorce case).
  - Section 25: Permanent alimony and maintenance upon dissolution of marriage.

---

### 2. Child Custody & Guardianship Principles
- **Welfare of the Child is Paramount:**
  - In *Gaurav Nagpal v. Sumedha Nagpal (2009)*, the Supreme Court established that the **welfare of the minor is the supreme consideration**, overriding mere statutory claims of parents.
- **Tender Years Doctrine (Section 6(a) Hindu Minority and Guardianship Act):**
  - The custody of a minor child who has not completed the age of **5 years** shall ordinarily be with the mother.
- **Section 21 PWDVA (Emergency Custody Orders):**
  - Prevents the abuser or his family from forcibly taking away or hiding minor children from the mother.

---

### 3. Step-by-Step Practical Filing Guide
1. **File Under Section 144 BNSS / Section 125 CrPC:**
   - File before the Family Court or Judicial Magistrate in the district where you currently reside.
2. **Draft the Comprehensive Asset Affidavit (*Rajnesh v. Neha* Format):**
   - Detail your expenses: Rent, groceries, children's school fees, medical bills.
   - Detail the husband's income, property ownership, vehicle ownership, business interests, and tax returns (ITR).
3. **Seek Ex-Parte Interim Maintenance:**
   - Request immediate interim maintenance on the very first date of appearance.

---

### 4. Verified Legal Contacts
- **NALSA Free Legal Aid (Family Court Advocates):** Dial **15100**
- **National Emergency:** Dial **112**
- **Women's Distress Helpline:** Dial **181**
- **National Commission for Women (NCW):** Dial **7827170170**`;
  }

  // 7. General Exhaustive Legal Guidance (Default High-Depth Fallback)
  return `### ⚖️ Comprehensive Legal Guidance & Statutory Rights in India
**Authoritative Framework:** *Protection of Women from Domestic Violence Act (PWDVA 2005)*, *Bharatiya Nyaya Sanhita (BNS) 2023*, *Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023*, *POSH Act 2013*, & *Legal Services Authorities Act 1987*.

---

### 1. Fundamental Legal Protections for Every Citizen & Survivor
Under the Constitution of India (Articles 14, 15, and 21) and statutory criminal-civil frameworks, you possess clear, enforceable rights designed to protect your safety, dignity, and autonomy:

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
4. **Workplace Dignity & Non-Retaliation (POSH Act, 2013):**
   - Mandatory Internal Complaints Committee (ICC) in every organization with 10+ employees.
   - Right to 3 months paid leave, transfer, and strict identity confidentiality during inquiry.
5. **Cyber Privacy & Digital Safety (IT Act, 2000 & BNS):**
   - Imprisonment up to 3 to 7 years for digital stalking, non-consensual image sharing, blackmail, or cyber harassment under Sections 66E, 67, 67A of the IT Act and Section 78 BNS.

---

### 2. Immediate Step-by-Step Safety & Action Plan
- **Phase 1 (Immediate Safety):** If in acute danger, dial **112** (National Emergency) or **1091** (Women Police Helpline). If injured, visit a government hospital for a Medico-Legal Certificate (MLC).
- **Phase 2 (Shelter & Protection):** Walk into any **Sakhi One Stop Centre (OSC)** located in every district across India or dial **181** for free temporary shelter, medical assistance, and counseling.
- **Phase 3 (Legal Filing):** Approach the District Legal Services Authority (DLSA) at your local court complex or dial **15100** (NALSA) to be assigned an experienced legal aid attorney at zero cost.

---

### 3. Critical Evidence Checklist
- [ ] Medical examination records (MLC), prescriptions, and injury photos.
- [ ] Digital records: Complete screenshots of threatening messages, call logs, emails, voice notes.
- [ ] Financial documentation: Bank passbooks, salary slips, Stridhan inventory, property papers.
- [ ] Identity proofs: Keep secure digital backups of Aadhaar, voter ID, and certificates in a secure cloud drive.

---

### 4. 24/7 Verified National Emergency Helplines
- **National Emergency Response Support System:** **112** (Police, Ambulance, Fire)
- **Women's Police Helpline:** **1091** (Direct emergency police dispatch)
- **National Domestic Distress Helpline (Sakhi OSC):** **181** (24/7 emergency shelter & support)
- **National Cybercrime Reporting Helpline:** **1930** (Online harassment & financial fraud)
- **NALSA National Free Legal Aid Helpline:** **15100** (Free attorney appointment)`;
}

