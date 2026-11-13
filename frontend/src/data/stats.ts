export interface StatStory {
  id: string;
  theme: string;
  headline: string;
  number: string;
  numericValue: number;
  suffix?: string;
  unit: string;
  subtext: string;
  definition: string;
  source: string;
  year: string;
  sourceUrl: string;
  visualType: 'dotgrid' | 'figures' | 'ring' | 'counter' | 'bars';
  accentColor: string;
  badge: string;
}

export interface CountrySafetyMetric {
  country: string;
  code: string;
  womenSafe: number;
  menSafe: number;
  gap: number;
  region: string;
  notes: string;
}

export interface MarqueeCard {
  id: string;
  theme: string;
  statHighlight: string;
  summary: string; // <= 25 words in own words
  sourceName: string;
  year: string;
  sourceUrl: string;
  safeSparkSolution: {
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
  };
}

export interface SolutionBridge {
  problemId: string;
  problemTitle: string;
  problemDesc: string;
  solutionTitle: string;
  solutionTag: string;
  solutionDesc: string;
  iconName: string;
  routeHref: string;
  color: string;
}

// 5 Core Chapters for "The Silence" Data Story
export const SILENCE_CHAPTERS: StatStory[] = [
  {
    id: 'abuse-global-india',
    theme: 'Abuse at Home & Relationships',
    headline: '1 in 3 women face violence in their lifetime',
    number: '30%',
    numericValue: 30,
    unit: 'of women globally',
    subtext: 'Over 840 million women have faced intimate partner or sexual violence. In India, 29.3% of married women report spousal violence.',
    definition: 'Ever-partner physical or sexual violence among women aged 15-49 (WHO 2025 & NFHS-5 2019-21).',
    source: 'WHO Violence Against Women Estimates & NFHS-5',
    year: '2021-2025',
    sourceUrl: 'https://www.who.int/publications/i/item/9789240022256',
    visualType: 'figures',
    accentColor: '#D81B60', // Rani Rose
    badge: 'Critical Reality',
  },
  {
    id: 'mental-health-gap',
    theme: 'Mental Health Ignored',
    headline: '85.2% treatment gap for depression in India',
    number: '85.2%',
    numericValue: 85,
    unit: 'treatment gap',
    subtext: 'In a Mysuru community cohort, ~65% of women screened at risk for depression, but only 5 received care due to intense social stigma.',
    definition: 'Depressive and anxiety disorder treatment gap recorded by the National Mental Health Survey.',
    source: 'National Mental Health Survey (NMHS) & PLOS Mental Health (2024)',
    year: '2024',
    sourceUrl: 'https://journals.plos.org/mentalhealth/',
    visualType: 'ring',
    accentColor: '#E0538D', // burgundy-300
    badge: 'Silent Burden',
  },
  {
    id: 'legal-awareness-gap',
    theme: 'Do Not Know The Law or How to Fight',
    headline: 'Barely 1.3% of survivors seek institutional help',
    number: '1.3%',
    numericValue: 1.3,
    unit: 'institutional contact',
    subtext: 'Most rural and semi-urban survivors are unaware of PWDVA protection orders, legal aid cells, or immediate shelter remedies under law.',
    definition: 'Proportion of women experiencing violence who approached police, courts, or institutional authorities.',
    source: 'NFHS-5 Survey & Karnataka Legal Aid Study',
    year: '2021-2024',
    sourceUrl: 'https://dhsprogram.com/pubs/pdf/FR375/FR375.pdf',
    visualType: 'dotgrid',
    accentColor: '#C32F6E', // burgundy-400
    badge: 'Justice Barrier',
  },
  {
    id: 'companion-isolation-gap',
    theme: 'No Companion, No One to Ask',
    headline: '80.1% never told anyone about their ordeal',
    number: '80.1%',
    numericValue: 80,
    unit: 'suffered in complete silence',
    subtext: 'Only 11.3% ever sought help from any source. Fear of retaliation, shame, and isolation leave women with no trusted ear.',
    definition: 'Percentage of abused married women who never disclosed violence to family, friends, or institutions.',
    source: 'NFHS-5 Report & The Leaflet Analysis',
    year: '2022',
    sourceUrl: 'https://theleaflet.in/',
    visualType: 'dotgrid',
    accentColor: '#74173D', // burgundy-600
    badge: 'Isolation Gap',
  },
  {
    id: 'global-aid-gap',
    theme: 'Prevention Funding & Global Underreporting',
    headline: 'Only 0.2% of global aid funds prevention',
    number: '0.2%',
    numericValue: 0.2,
    unit: 'of development aid',
    subtext: 'Between 55% and 95% of survivors globally remain unrecorded in formal datasets, while prevention receives a fraction of a percent of aid.',
    definition: 'Share of bilateral Official Development Assistance (ODA) dedicated to preventing violence against women.',
    source: 'UN Women & WHO Global Synthesis',
    year: '2024-2025',
    sourceUrl: 'https://www.unwomen.org/',
    visualType: 'bars',
    accentColor: '#E8D7C3', // beige-300
    badge: 'Resource Deficit',
  },
];

// Gallup 2025 Global Safety Gap: "Feel safe walking alone at night"
export const COUNTRY_SAFETY_DATA: CountrySafetyMetric[] = [
  {
    country: 'Singapore',
    code: 'SG',
    womenSafe: 97,
    menSafe: 98,
    gap: 1,
    region: 'Southeast Asia',
    notes: 'Near parity; consistently top-ranked in perceived public safety.',
  },
  {
    country: 'Global Average',
    code: 'GL',
    womenSafe: 67,
    menSafe: 78,
    gap: 11,
    region: 'World',
    notes: 'Over 100 nations maintain a double-digit safety gap between men and women.',
  },
  {
    country: 'India',
    code: 'IN',
    womenSafe: 62,
    menSafe: 79,
    gap: 17,
    region: 'South Asia',
    notes: '17-point gender divergence in perceived safety walking alone after sunset.',
  },
  {
    country: 'United States',
    code: 'US',
    womenSafe: 58,
    menSafe: 84,
    gap: 26,
    region: 'North America',
    notes: 'Stark 26-point divide; only 58% of women feel secure walking alone at night.',
  },
  {
    country: 'South Africa',
    code: 'ZA',
    womenSafe: 25,
    menSafe: 43,
    gap: 18,
    region: 'Sub-Saharan Africa',
    notes: 'Only 1 in 4 women feels safe walking alone; acute crisis of public security.',
  },
];

// Marquee cards for "What the World is Saying" (Flip to SafeSpark Response)
export const WORLD_VOICES_ROW_1: MarqueeCard[] = [
  {
    id: 'wv-1',
    theme: 'Global Lifetime Violence',
    statHighlight: '840 Million Women',
    summary: 'One in three women worldwide endures physical or sexual partner violence or non-partner sexual assault.',
    sourceName: 'World Health Organization (WHO)',
    year: '2025',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/violence-against-women',
    safeSparkSolution: {
      title: 'Discreet Steganographic SOS',
      description: 'Encodes distress alerts and exact GPS inside benign everyday images, completely invisible to abusive partners checking phones.',
      actionLabel: 'Report Distress',
      actionHref: '/create-post',
    },
  },
  {
    id: 'wv-2',
    theme: 'Spousal Violence in India',
    statHighlight: '29.3% in NFHS-5',
    summary: 'Nearly three in ten married Indian women have experienced spousal domestic violence during their marriage.',
    sourceName: 'Ministry of Health & Family Welfare',
    year: '2021',
    sourceUrl: 'https://dhsprogram.com/pubs/pdf/FR375/FR375.pdf',
    safeSparkSolution: {
      title: 'Direct Authority Escalation',
      description: 'Verified incident tickets automatically triage to local protection officers and accredited support shelters.',
      actionLabel: 'View Dashboard',
      actionHref: '/dashboard',
    },
  },
  {
    id: 'wv-3',
    theme: 'Mental Health Treatment Gap',
    statHighlight: '85.2% Depression Gap',
    summary: 'Over 85% of people with depression in India receive no medical or psychological care whatsoever.',
    sourceName: 'National Mental Health Survey (NMHS)',
    year: '2022',
    sourceUrl: 'https://indianmentalhealth.com/',
    safeSparkSolution: {
      title: '3D Empathetic AI Companion',
      description: 'A confidential, culturally sensitive 3D avatar providing active listening, grounding exercises, and zero-judgment care 24/7.',
      actionLabel: 'Speak to Companion',
      actionHref: '/therapybot',
    },
  },
  {
    id: 'wv-4',
    theme: 'Institutional Reporting Silence',
    statHighlight: 'Barely 1.3% Reach Out',
    summary: 'Only 1.3% of women who face violence ever approach institutional authorities or formal law enforcement.',
    sourceName: 'NFHS-5 Demographic Study',
    year: '2021',
    sourceUrl: 'https://dhsprogram.com/',
    safeSparkSolution: {
      title: 'Bilingual AI LawBot',
      description: 'Instant plain-language legal guidance on PWDVA 2005, Bharatiya Nyaya Sanhita, maintenance, and restraining orders.',
      actionLabel: 'Consult LawBot',
      actionHref: '/lawbot',
    },
  },
];

export const WORLD_VOICES_ROW_2: MarqueeCard[] = [
  {
    id: 'wv-5',
    theme: 'Unshared Trauma',
    statHighlight: '80.1% Never Disclosed',
    summary: 'Four out of five married survivors never tell anyone—friends, family, or police—about the violence they endure.',
    sourceName: 'The Leaflet / NFHS Analysis',
    year: '2022',
    sourceUrl: 'https://theleaflet.in/',
    safeSparkSolution: {
      title: 'Silent Companion & Safety Hub',
      description: 'No accounts required, no tracking cookies, and emergency history-scrubbing escape keys protect your identity.',
      actionLabel: 'Learn Privacy',
      actionHref: '#privacy',
    },
  },
  {
    id: 'wv-6',
    theme: 'Recorded Domestic Cruelty',
    statHighlight: '4,48,211 Crimes in 2023',
    summary: 'Cruelty by husband or relatives accounted for nearly 30% of all registered crimes against women in India.',
    sourceName: 'National Crime Records Bureau (NCRB)',
    year: '2023',
    sourceUrl: 'https://ncrb.gov.in/',
    safeSparkSolution: {
      title: 'Verifiable Evidence Vault',
      description: 'Structured documentation of incidents, visible injuries, and timeline records for courts and protection officers.',
      actionLabel: 'Open Report Flow',
      actionHref: '/create-post',
    },
  },
  {
    id: 'wv-7',
    theme: 'The Nighttime Safety Divide',
    statHighlight: '58% vs 84% in US',
    summary: 'A 26-point gender gap separates women and men when walking alone at night in the United States.',
    sourceName: 'Gallup Global Safety Report',
    year: '2025',
    sourceUrl: 'https://www.gallup.com/',
    safeSparkSolution: {
      title: 'One-Tap Panic Escalation',
      description: 'Quick-access helpline routing and instant alert beacons built for critical moments on the move.',
      actionLabel: 'Emergency Directory',
      actionHref: '#helplines',
    },
  },
  {
    id: 'wv-8',
    theme: 'Prevention Aid Deficit',
    statHighlight: 'Just 0.2% Global Aid',
    summary: 'Less than one-fifth of one percent of all global development assistance is invested in violence prevention.',
    sourceName: 'UN Women Policy Review',
    year: '2024',
    sourceUrl: 'https://www.unwomen.org/',
    safeSparkSolution: {
      title: 'Community-Driven Technology',
      description: 'Open-access, scalable technology designed to protect millions without corporate paywalls or predatory data collection.',
      actionLabel: 'Read Manifesto',
      actionHref: '#manifesto',
    },
  },
];

// Problem to Solution Thread Bridges
export const SOLUTION_BRIDGES: SolutionBridge[] = [
  {
    problemId: 'stealth',
    problemTitle: 'Phone Monitoring by Abusers',
    problemDesc: 'Checking chat histories, SMS, and search apps often triggers immediate physical retaliation.',
    solutionTitle: 'Steganographic SOS',
    solutionTag: 'Covert Protection',
    solutionDesc: 'Hides encrypted distress messages and GPS coordinates inside ordinary photos that look like everyday snapshots.',
    iconName: 'Shield',
    routeHref: '/create-post',
    color: '#D81B60',
  },
  {
    problemId: 'companion',
    problemTitle: 'Isolation & Crippling Stigma',
    problemDesc: '80% of survivors never tell anyone. Fear of judgment and shame prevents seeking traditional therapy.',
    solutionTitle: '3D Empathetic Companion',
    solutionTag: 'Compassionate AI',
    solutionDesc: 'A comforting, private 3D avatar offering trauma-informed support, deep listening, and soothing presence at any hour.',
    iconName: 'HeartHandshake',
    routeHref: '/therapybot',
    color: '#E0538D',
  },
  {
    problemId: 'lawbot',
    problemTitle: 'Unfamiliar Legal Protections',
    problemDesc: 'Under 2% know how to enforce PWDVA 2005 protection orders, residence rights, or emergency custody.',
    solutionTitle: 'SafeSpark LawBot',
    solutionTag: 'Legal Clarity',
    solutionDesc: 'Explains rights under Bharatiya Nyaya Sanhita and domestic violence laws in plain, accessible language.',
    iconName: 'Scale',
    routeHref: '/lawbot',
    color: '#C32F6E',
  },
  {
    problemId: 'response',
    problemTitle: 'Delayed Emergency Triage',
    problemDesc: 'Distress calls often get lost in bureaucracy when rapid shelter or medical intervention is required.',
    solutionTitle: 'Authority Incident Command',
    solutionTag: 'Rapid Action',
    solutionDesc: 'Streamlines incident records and location telemetry for verified NGOs and emergency responders.',
    iconName: 'Activity',
    routeHref: '/dashboard',
    color: '#74173D',
  },
];

// Emergency Helplines (Verified Indian and International standards)
export const EMERGENCY_HELPLINES = [
  {
    number: '112',
    title: 'National Emergency Response',
    description: 'Police, Fire, and Ambulance all-in-one helpline across India.',
    action: 'tel:112',
    color: 'from-rose-600 to-red-600',
  },
  {
    number: '1091',
    title: 'Women Helpline (Domestic Abuse & Distress)',
    description: '24/7 dedicated police dispatch for women in danger.',
    action: 'tel:1091',
    color: 'from-pink-600 to-rose-600',
  },
  {
    number: '181',
    title: 'Women Helpline (One Stop Crisis Support)',
    description: 'Medical, legal, shelter, and psychological counseling support.',
    action: 'tel:181',
    color: 'from-amber-600 to-orange-600',
  },
  {
    number: '14416',
    title: 'Tele-MANAS (Govt. Mental Health Support)',
    description: 'Toll-free 24/7 confidential psychological support in 20+ languages.',
    action: 'tel:14416',
    color: 'from-teal-600 to-emerald-600',
  },
];

