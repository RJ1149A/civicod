import { CivicIssue, Location } from '../types';

// Municipal Corporation data with email templates
interface MunicipalCorporation {
  id: string;
  name: string;
  location: Location;
  email: string;
  phone: string;
  website: string;
  jurisdiction: string;
  categories: string[];
  emailTemplate: string;
  distance?: number;
}

// Municipal corporations with email templates
const MUNICIPAL_CORPORATIONS: MunicipalCorporation[] = [
  {
    id: 'mumbai',
    name: 'Brihanmumbai Municipal Corporation',
    location: { lat: 19.0760, lng: 72.8777 },
    email: 'complaints@mcgm.gov.in',
    phone: '022-24937747',
    website: 'https://portal.mcgm.gov.in',
    jurisdiction: 'Mumbai Metropolitan Region',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions'],
    emailTemplate: 'Subject: Civic Issue Report - {category}\n\nDear Municipal Corporation,\n\nI am reporting a civic issue in your jurisdiction.\n\nIssue Details:\n- Category: {category}\n- Title: {title}\n- Description: {description}\n- Location: {location}\n- Reported by: {reporter}\n\nPlease take necessary action to address this issue.\n\nThank you,\n{reporter}'
  },
  {
    id: 'delhi',
    name: 'Municipal Corporation of Delhi',
    location: { lat: 28.7041, lng: 77.1025 },
    email: 'complaints@mcdonline.gov.in',
    phone: '011-23438200',
    website: 'https://mcdonline.gov.in',
    jurisdiction: 'Delhi',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions'],
    emailTemplate: 'Subject: Civic Issue Report - {category}\n\nDear Municipal Corporation,\n\nI am reporting a civic issue in your jurisdiction.\n\nIssue Details:\n- Category: {category}\n- Title: {title}\n- Description: {description}\n- Location: {location}\n- Reported by: {reporter}\n\nPlease take necessary action to address this issue.\n\nThank you,\n{reporter}'
  },
  {
    id: 'bangalore',
    name: 'Bruhat Bengaluru Mahanagara Palike',
    location: { lat: 12.9716, lng: 77.5946 },
    email: 'complaints@bbmp.gov.in',
    phone: '080-22221188',
    website: 'https://bbmp.gov.in',
    jurisdiction: 'Bengaluru',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions'],
    emailTemplate: 'Subject: Civic Issue Report - {category}\n\nDear Municipal Corporation,\n\nI am reporting a civic issue in your jurisdiction.\n\nIssue Details:\n- Category: {category}\n- Title: {title}\n- Description: {description}\n- Location: {location}\n- Reported by: {reporter}\n\nPlease take necessary action to address this issue.\n\nThank you,\n{reporter}'
  },
  {
    id: 'chennai',
    name: 'Greater Chennai Corporation',
    location: { lat: 13.0827, lng: 80.2707 },
    email: 'complaints@chennaicorporation.gov.in',
    phone: '044-25384520',
    website: 'https://chennaicorporation.gov.in',
    jurisdiction: 'Chennai',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions'],
    emailTemplate: 'Subject: Civic Issue Report - {category}\n\nDear Municipal Corporation,\n\nI am reporting a civic issue in your jurisdiction.\n\nIssue Details:\n- Category: {category}\n- Title: {title}\n- Description: {description}\n- Location: {location}\n- Reported by: {reporter}\n\nPlease take necessary action to address this issue.\n\nThank you,\n{reporter}'
  },
  {
    id: 'hyderabad',
    name: 'Greater Hyderabad Municipal Corporation',
    location: { lat: 17.3850, lng: 78.4867 },
    email: 'complaints@ghmc.gov.in',
    phone: '040-21111111',
    website: 'https://ghmc.gov.in',
    jurisdiction: 'Hyderabad',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions'],
    emailTemplate: 'Subject: Civic Issue Report - {category}\n\nDear Municipal Corporation,\n\nI am reporting a civic issue in your jurisdiction.\n\nIssue Details:\n- Category: {category}\n- Title: {title}\n- Description: {description}\n- Location: {location}\n- Reported by: {reporter}\n\nPlease take necessary action to address this issue.\n\nThank you,\n{reporter}'
  },
  {
    id: 'pune',
    name: 'Pune Municipal Corporation',
    location: { lat: 18.5204, lng: 73.8567 },
    email: 'complaints@punecorporation.org',
    phone: '020-25501000',
    website: 'https://punecorporation.org',
    jurisdiction: 'Pune',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions'],
    emailTemplate: 'Subject: Civic Issue Report - {category}\n\nDear Municipal Corporation,\n\nI am reporting a civic issue in your jurisdiction.\n\nIssue Details:\n- Category: {category}\n- Title: {title}\n- Description: {description}\n- Location: {location}\n- Reported by: {reporter}\n\nPlease take necessary action to address this issue.\n\nThank you,\n{reporter}'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad Municipal Corporation',
    location: { lat: 23.0225, lng: 72.5714 },
    email: 'complaints@ahmedabadcity.gov.in',
    phone: '079-25391800',
    website: 'https://ahmedabadcity.gov.in',
    jurisdiction: 'Ahmedabad',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions'],
    emailTemplate: 'Subject: Civic Issue Report - {category}\n\nDear Municipal Corporation,\n\nI am reporting a civic issue in your jurisdiction.\n\nIssue Details:\n- Category: {category}\n- Title: {title}\n- Description: {description}\n- Location: {location}\n- Reported by: {reporter}\n\nPlease take necessary action to address this issue.\n\nThank you,\n{reporter}'
  },
  {
    id: 'kolkata',
    name: 'Kolkata Municipal Corporation',
    location: { lat: 22.5726, lng: 88.3639 },
    email: 'complaints@kmcgov.in',
    phone: '033-22431111',
    website: 'https://kmcgov.in',
    jurisdiction: 'Kolkata',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions'],
    emailTemplate: 'Subject: Civic Issue Report - {category}\n\nDear Municipal Corporation,\n\nI am reporting a civic issue in your jurisdiction.\n\nIssue Details:\n- Category: {category}\n- Title: {title}\n- Description: {description}\n- Location: {location}\n- Reported by: {reporter}\n\nPlease take necessary action to address this issue.\n\nThank you,\n{reporter}'
  }
];

// Calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearby municipalities based on location
export function findNearbyMunicipalities(location: Location, radius: number = 100): MunicipalCorporation[] {
  return MUNICIPAL_CORPORATIONS
    .map(municipality => ({
      ...municipality,
      distance: calculateDistance(
        location.lat,
        location.lng,
        municipality.location.lat,
        municipality.location.lng
      )
    }))
    .filter(municipality => municipality.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

// Generate email content for a municipality
export function generateEmailContent(
  issue: CivicIssue,
  municipality: MunicipalCorporation
): { to: string; subject: string; body: string; mailtoUrl: string } {
  const categoryLabels: { [key: string]: string } = {
    'roads': 'Roads',
    'lighting': 'Lighting',
    'water-supply': 'Water Supply',
    'cleanliness': 'Cleanliness',
    'public-safety': 'Public Safety',
    'obstructions': 'Obstructions'
  };

  const template = municipality.emailTemplate;
  const location = `${issue.location.lat.toFixed(6)}, ${issue.location.lng.toFixed(6)}`;
  const reporter = issue.isAnonymous ? 'Anonymous Citizen' : issue.reportedBy;

  const body = template
    .replace('{category}', categoryLabels[issue.category] || issue.category)
    .replace('{title}', issue.title)
    .replace('{description}', issue.description)
    .replace('{location}', location)
    .replace('{reporter}', reporter);

  const subject = `Civic Issue Report - ${categoryLabels[issue.category] || issue.category}`;

  // Create mailto URL
  const mailtoUrl = `mailto:${municipality.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    to: municipality.email,
    subject,
    body,
    mailtoUrl
  };
}

// Get municipality contact information
export function getMunicipalityContact(municipalityId: string): MunicipalCorporation | undefined {
  return MUNICIPAL_CORPORATIONS.find(m => m.id === municipalityId);
}

// Get all municipalities
export function getAllMunicipalities(): MunicipalCorporation[] {
  return MUNICIPAL_CORPORATIONS;
}

// Open email client with pre-filled content
export function openEmailClient(mailtoUrl: string): void {
  window.open(mailtoUrl, '_blank');
}

// Copy email content to clipboard
export async function copyEmailContent(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
} 