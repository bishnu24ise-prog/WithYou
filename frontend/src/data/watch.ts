export interface WatchTarget {
  id: string;
  name: string;
  url: string;
  category: 'Statute' | 'Helpline' | 'Survey Stat' | 'Grievance Portal';
  lastCheckedAt: string;
  status: 'active' | 'changed' | 'verified';
  contentHash?: string;
  diffSummary?: string;
}

export interface WatchAlert {
  id: string;
  targetId: string;
  portalName: string;
  url: string;
  type: 'STATUTE_AMENDMENT' | 'HELPLINE_ROUTING' | 'SURVEY_UPDATE' | 'PORTAL_MAINTENANCE';
  diffSummary: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high';
}

export const WATCH_TARGETS: WatchTarget[] = [
  {
    id: 'ncw-portal',
    name: 'National Commission for Women (NCW)',
    url: 'https://ncw.nic.in',
    category: 'Statute',
    lastCheckedAt: '2026-10-31T08:00:00Z',
    status: 'verified',
    diffSummary: 'Active 24/7 dedicated helpline 7827170170 verified operational across all states.',
  },
  {
    id: 'nalsa-legal-aid',
    name: 'National Legal Services Authority (NALSA)',
    url: 'https://nalsa.gov.in',
    category: 'Helpline',
    lastCheckedAt: '2026-10-31T08:00:00Z',
    status: 'verified',
    diffSummary: 'Front-office legal aid clinic timings verified (10 AM - 5 PM) with toll-free 15100 assistance.',
  },
  {
    id: 'cybercrime-portal',
    name: 'National Cyber Crime Reporting Portal (MHA)',
    url: 'https://cybercrime.gov.in',
    category: 'Grievance Portal',
    lastCheckedAt: '2026-10-31T08:00:00Z',
    status: 'verified',
    diffSummary: 'Special fast-track category for Women & Children online harassment active under helpline 1930.',
  },
  {
    id: 'wcd-pwdva',
    name: 'Ministry of WCD - Domestic Violence Act Guidelines',
    url: 'https://wcd.nic.in',
    category: 'Statute',
    lastCheckedAt: '2026-10-31T08:00:00Z',
    status: 'verified',
    diffSummary: '733+ One Stop Centres integrated with Sakhi 181 emergency shelter helpline.',
  },
];

export const INITIAL_WATCH_ALERTS: WatchAlert[] = [
  {
    id: 'alert-1',
    targetId: 'cybercrime-portal',
    portalName: 'National Cyber Crime Reporting Portal',
    url: 'https://cybercrime.gov.in',
    type: 'PORTAL_MAINTENANCE',
    diffSummary: 'Helpline 1930 citizen reporting flow updated with real-time financial freeze and covert anonymity mode.',
    detectedAt: '2026-10-31T06:15:00Z',
    severity: 'medium',
  },
  {
    id: 'alert-2',
    targetId: 'wcd-pwdva',
    portalName: 'Ministry of Women & Child Development',
    url: 'https://wcd.nic.in',
    type: 'STATUTE_AMENDMENT',
    diffSummary: 'Standard operating procedure for Sakhi One Stop Centres updated to mandate 100% free legal counsel within 2 hours of distress call.',
    detectedAt: '2026-10-30T14:30:00Z',
    severity: 'high',
  },
  {
    id: 'alert-3',
    targetId: 'nalsa-legal-aid',
    portalName: 'NALSA Legal Services Authority',
    url: 'https://nalsa.gov.in',
    type: 'HELPLINE_ROUTING',
    diffSummary: 'Dial 15100 multilingual IVR routing expanded to all 22 scheduled constitutional languages with zero toll charges.',
    detectedAt: '2026-10-29T10:00:00Z',
    severity: 'low',
  },
];

