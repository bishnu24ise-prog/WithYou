export interface DirectoryRecord {
  id: string;
  name: string;
  type: 'One Stop Centre' | 'Legal Aid Clinic' | 'Crisis Helpline' | 'Shelter Home' | 'Police Unit';
  websiteUrl: string;
  phone?: string;
  address?: string;
  hours?: string;
  languages?: string[];
  services?: string[];
  verifiedAt?: string;
  sourceUrl?: string;
  state: string;
}

export const INITIAL_DIRECTORY_RECORDS: DirectoryRecord[] = [
  {
    id: 'sakhi-osc-national',
    name: 'Sakhi One Stop Centre (OSC) - Ministry of WCD',
    type: 'One Stop Centre',
    websiteUrl: 'https://wcd.nic.in',
    phone: '181',
    address: 'Integrated in 733+ districts across India',
    hours: '24/7 Round the Clock',
    languages: ['Hindi', 'English', 'Regional Languages'],
    services: ['Emergency Shelter', 'Medical Aid', 'Legal Assistance', 'Psychological Counseling'],
    verifiedAt: '2026-10-31',
    sourceUrl: 'https://wcd.nic.in',
    state: 'National',
  },
  {
    id: 'ncw-crisis-cell',
    name: 'National Commission for Women (NCW) 24/7 Helpline',
    type: 'Crisis Helpline',
    websiteUrl: 'https://ncw.nic.in',
    phone: '7827170170',
    address: 'Plot 21, Jasola Institutional Area, New Delhi',
    hours: '24/7 Emergency Line',
    languages: ['Hindi', 'English'],
    services: ['Legal Counseling', 'Online Complaint Registration', 'Protection Follow-up'],
    verifiedAt: '2026-10-31',
    sourceUrl: 'https://ncw.nic.in',
    state: 'Delhi / National',
  },
  {
    id: 'nalsa-legal-aid',
    name: 'NALSA Front Office Legal Services Clinic',
    type: 'Legal Aid Clinic',
    websiteUrl: 'https://nalsa.gov.in',
    phone: '15100',
    address: 'Jamnagar House, Shahjahan Road, New Delhi',
    hours: '10:00 AM - 5:00 PM (Helpline 24/7)',
    languages: ['All 22 Official Languages'],
    services: ['Free Legal Aid', 'Court Representation', 'Lok Adalat Settlements', 'Bail Assistance'],
    verifiedAt: '2026-10-31',
    sourceUrl: 'https://nalsa.gov.in',
    state: 'National',
  },
  {
    id: 'delhi-spuwac',
    name: 'Special Police Unit for Women & Children (SPUWAC)',
    type: 'Police Unit',
    websiteUrl: 'https://delhipolice.nic.in',
    phone: '1091',
    address: 'Malviya Nagar, New Delhi 110017',
    hours: '24/7 Duty Officer',
    languages: ['Hindi', 'English'],
    services: ['Immediate FIR Registration', 'Anti-Stalking Dispatch', 'Self Defense Training', 'Mediation'],
    verifiedAt: '2026-10-31',
    sourceUrl: 'https://delhipolice.nic.in',
    state: 'Delhi',
  },
  {
    id: 'sneha-crisis-mumbai',
    name: 'SNEHA Crisis & Trauma Sanctuary',
    type: 'Shelter Home',
    websiteUrl: 'https://snehamumbai.org',
    phone: '+91 98330 52684',
    address: 'Urban Health Centre, 60 Feet Road, Dharavi, Mumbai 400017',
    hours: '24/7 Emergency Response',
    languages: ['Marathi', 'Hindi', 'English'],
    services: ['Trauma Shelter', 'Hospital Crisis Intervention', 'Police Coordination', 'Child Welfare'],
    verifiedAt: '2026-10-31',
    sourceUrl: 'https://snehamumbai.org',
    state: 'Maharashtra',
  },
  {
    id: 'icall-psychosocial',
    name: 'iCall Psychosocial Helpline (TISS)',
    type: 'Crisis Helpline',
    websiteUrl: 'https://tiss.edu',
    phone: '9152987821',
    address: 'Tata Institute of Social Sciences, V.N. Purav Marg, Deonar, Mumbai',
    hours: 'Mon - Sat (8:00 AM - 10:00 PM)',
    languages: ['Hindi', 'English', 'Marathi', 'Gujarati', 'Bengali', 'Tamil'],
    services: ['Free Professional Counseling', 'Suicide Prevention', 'Domestic Abuse Healing', 'Referrals'],
    verifiedAt: '2026-10-31',
    sourceUrl: 'https://tiss.edu',
    state: 'National',
  },
];

