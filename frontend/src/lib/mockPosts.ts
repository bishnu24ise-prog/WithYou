// In-memory / localStorage / disk-cache bridge for live posts
import fs from 'fs';
import path from 'path';

export interface PostRecord {
  _id: string;
  Name: string;
  state: string;
  'Severity of domestic violence': string;
  'Nature of domestic violence': string;
  Location?: string;
  Contact?: string;
  'Current Situation'?: string;
  'Culprit Description'?: string;
  status: string;
  createdAt?: string;
  [key: string]: any;
}

const INITIAL_POSTS: PostRecord[] = [
  {
    _id: '6720f18a2e584b1234567801',
    Name: 'Priya Sharma',
    state: 'New Delhi, Delhi',
    'Severity of domestic violence': 'Very High',
    'Nature of domestic violence': 'Physical Assault and Unlawful Confinement',
    Location: '28.6139, 77.2090',
    Contact: '+91 98765 43210',
    'Current Situation': 'Victim locked in bedroom, requires immediate police intervention and medical checkup.',
    'Culprit Description': 'Husband, 35 years old, aggressive behavior.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6720f18a2e584b1234567802',
    Name: 'Ananya Verma',
    state: 'Bengaluru, Karnataka',
    'Severity of domestic violence': 'High',
    'Nature of domestic violence': 'Severe Psychological Harassment & Threats',
    Location: '12.9716, 77.5946',
    Contact: '+91 98123 45678',
    'Current Situation': 'Constant threats of financial abandonment and verbal harassment in front of children.',
    'Culprit Description': 'In-laws and spouse.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6720f18a2e584b1234567803',
    Name: 'Meera Patel',
    state: 'Ahmedabad, Gujarat',
    'Severity of domestic violence': 'Medium',
    'Nature of domestic violence': 'Financial Deprivation and Surveillance',
    Location: '23.0225, 72.5714',
    Contact: '+91 97234 56789',
    'Current Situation': 'Restricted access to personal bank account and communications phone monitored.',
    'Culprit Description': 'Spouse.',
    status: 'resolved',
    createdAt: new Date().toISOString(),
  },
];

declare global {
  var __mockPosts: PostRecord[] | undefined;
}

function getStoreFilePath(): string {
  return path.join(process.cwd(), 'src', 'lib', 'posts_store.json');
}

function loadPostsFromDisk(): PostRecord[] {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((p: any) => p.Name !== 'Survivor Report');
      }
    }
  } catch (err) {
    console.warn('Notice reading posts_store.json:', err);
  }
  return [...INITIAL_POSTS];
}

function savePostsToDisk(posts: PostRecord[]) {
  try {
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice writing posts_store.json:', err);
  }
}

if (!globalThis.__mockPosts) {
  globalThis.__mockPosts = loadPostsFromDisk();
}

export function getStoredPosts(): PostRecord[] {
  if (!globalThis.__mockPosts || globalThis.__mockPosts.length === 0) {
    globalThis.__mockPosts = loadPostsFromDisk();
  }
  // Clean out any legacy dummy entries
  globalThis.__mockPosts = globalThis.__mockPosts.filter(p => p.Name !== 'Survivor Report');
  return globalThis.__mockPosts;
}

export function addStoredPost(data: any): PostRecord {
  const victimName = (data.Name && data.Name !== 'Survivor Report') 
    ? data.Name 
    : (data.name && data.name !== 'Survivor Report' ? data.name : (data.Name || 'Anonymous Survivor'));

  const prefContact = data['Preferred way of contact'] ||
    (Array.isArray(data.preferredContact) ? data.preferredContact.join(', ') : data.preferredContact) ||
    'Phone';

  const contactInfo = data['Contact info'] || data.Contact || data.phone || '+91 Confidential';

  const freq = data['Frequency of domestic violence'] ||
    (data.frequency ? `${data.frequency} times per week` : '1 times per week');

  const dur = data['Duration of domestic violence'] ||
    (data.occurrenceDuration ? `${data.occurrenceDuration} months` : '1 months');

  const situation = data['Current Situation'] || data.currentSituation || data.current_situation || 'Requires urgent safety review';

  const culpritDetails = data['Culprit details'] || data['Culprit Description'] || data.culprit || data.culprit_description || 'Details recorded';

  const severity = data['Severity of domestic violence'] || data.severity || (data.visibleInjuries === 'Yes' ? 'Very High' : 'High');

  const nature = data['Nature of domestic violence'] || data.issue || situation;

  const locString = typeof data.Location === 'string' 
    ? data.Location 
    : `${data.location?.lat || 28.6139}, ${data.location?.lng || 77.2090}`;

  const impact = data['Impact on children'] || 
    (situation.toLowerCase().includes('child') ? 'Child safety risk identified' : 'Confidential welfare review');

  const newPost: PostRecord = {
    _id: data._id || 'post_' + Date.now(),
    Name: victimName,
    name: victimName,
    state: data.state || data.location?.state || 'Emergency SOS Location',
    Location: locString,
    'Preferred way of contact': prefContact,
    preferredContact: prefContact,
    'Contact info': contactInfo,
    Contact: contactInfo,
    phone: contactInfo,
    'Frequency of domestic violence': freq,
    frequency: data.frequency || 1,
    'Duration of domestic violence': dur,
    occurrenceDuration: data.occurrenceDuration || 1,
    'Severity of domestic violence': severity,
    'Nature of domestic violence': nature,
    'Current Situation': situation,
    currentSituation: situation,
    'Culprit details': culpritDetails,
    'Culprit Description': culpritDetails,
    culprit: culpritDetails,
    'Relationship with perpetrator': culpritDetails,
    'Impact on children': impact,
    'Other info': `Report: ${situation}`,
    visibleInjuries: data.visibleInjuries || 'No',
    status: data.status || 'pending',
    createdAt: data.createdAt || new Date().toISOString(),
  };

  const current = getStoredPosts();
  // Filter out any existing post with the same id to avoid duplicates
  const updated = [newPost, ...current.filter(p => p._id !== newPost._id)];
  globalThis.__mockPosts = updated;
  savePostsToDisk(updated);

  return newPost;
}

export function getPostById(id: string): PostRecord | undefined {
  const posts = getStoredPosts();
  const found =
    posts.find((p) => p._id === id) ||
    posts.find((p) => p._id.toLowerCase() === id.toLowerCase()) ||
    posts[0];

  if (!found) return undefined;

  const situation = found['Current Situation'] || found.currentSituation || 'Emergency domestic distress incident.';
  const culprit = found['Culprit Description'] || found['Culprit details'] || found.culprit || 'Details recorded';
  const contact = found.Contact || found['Contact info'] || found.phone || 'Confidential Helpline';

  return {
    ...found,
    'Preferred way of contact': found['Preferred way of contact'] || 'Phone',
    'Contact info': contact,
    Contact: contact,
    phone: contact,
    'Frequency of domestic violence': found['Frequency of domestic violence'] || '1 times per week',
    frequency: found.frequency || 1,
    'Duration of domestic violence': found['Duration of domestic violence'] || '1 months',
    occurrenceDuration: found.occurrenceDuration || 1,
    'Severity of domestic violence': found['Severity of domestic violence'] || 'Very High',
    'Nature of domestic violence': found['Nature of domestic violence'] || situation,
    'Current Situation': situation,
    currentSituation: situation,
    'Culprit details': culprit,
    'Culprit Description': culprit,
    culprit: culprit,
    'Relationship with perpetrator': culprit,
    'Other info': 'Report: ' + situation,
    'Impact on children': situation.toLowerCase().includes('child') ? 'Child safety risk identified' : 'Confidential welfare review',
  };
}

export function updatePostStatus(id: string, status: string = 'closed'): PostRecord | undefined {
  const posts = getStoredPosts();
  const index = posts.findIndex(
    (p) => p._id === id || p._id.toLowerCase() === id.toLowerCase()
  );

  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      status: status,
      closedAt: new Date().toISOString(),
    };
    globalThis.__mockPosts = [...posts];
    savePostsToDisk(globalThis.__mockPosts);
    return posts[index];
  }

  return undefined;
}
