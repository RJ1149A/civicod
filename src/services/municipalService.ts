import { CivicIssue, Location } from '../types';

// Municipal Corporation data for major Indian cities
interface MunicipalCorporation {
  id: string;
  name: string;
  location: Location;
  email: string;
  phone: string;
  website: string;
  jurisdiction: string;
  categories: string[];
}

// Sample municipal corporations data (you can expand this)
const MUNICIPAL_CORPORATIONS: MunicipalCorporation[] = [
  {
    id: 'mumbai',
    name: 'Brihanmumbai Municipal Corporation',
    location: { lat: 19.0760, lng: 72.8777 },
    email: 'complaints@mcgm.gov.in',
    phone: '022-24937747',
    website: 'https://portal.mcgm.gov.in',
    jurisdiction: 'Mumbai Metropolitan Region',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions']
  },
  {
    id: 'delhi',
    name: 'Municipal Corporation of Delhi',
    location: { lat: 28.7041, lng: 77.1025 },
    email: 'complaints@mcdonline.gov.in',
    phone: '011-23438200',
    website: 'https://mcdonline.gov.in',
    jurisdiction: 'Delhi',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions']
  },
  {
    id: 'bangalore',
    name: 'Bruhat Bengaluru Mahanagara Palike',
    location: { lat: 12.9716, lng: 77.5946 },
    email: 'complaints@bbmp.gov.in',
    phone: '080-22221188',
    website: 'https://bbmp.gov.in',
    jurisdiction: 'Bengaluru',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions']
  },
  {
    id: 'chennai',
    name: 'Greater Chennai Corporation',
    location: { lat: 13.0827, lng: 80.2707 },
    email: 'complaints@chennaicorporation.gov.in',
    phone: '044-25384520',
    website: 'https://chennaicorporation.gov.in',
    jurisdiction: 'Chennai',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions']
  },
  {
    id: 'hyderabad',
    name: 'Greater Hyderabad Municipal Corporation',
    location: { lat: 17.3850, lng: 78.4867 },
    email: 'complaints@ghmc.gov.in',
    phone: '040-21111111',
    website: 'https://ghmc.gov.in',
    jurisdiction: 'Hyderabad',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions']
  },
  {
    id: 'pune',
    name: 'Pune Municipal Corporation',
    location: { lat: 18.5204, lng: 73.8567 },
    email: 'complaints@punecorporation.org',
    phone: '020-25501000',
    website: 'https://punecorporation.org',
    jurisdiction: 'Pune',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions']
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad Municipal Corporation',
    location: { lat: 23.0225, lng: 72.5714 },
    email: 'complaints@ahmedabadcity.gov.in',
    phone: '079-25391800',
    website: 'https://ahmedabadcity.gov.in',
    jurisdiction: 'Ahmedabad',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions']
  },
  {
    id: 'kolkata',
    name: 'Kolkata Municipal Corporation',
    location: { lat: 22.5726, lng: 88.3639 },
    email: 'complaints@kmcgov.in',
    phone: '033-22431111',
    website: 'https://kmcgov.in',
    jurisdiction: 'Kolkata',
    categories: ['roads', 'lighting', 'water-supply', 'cleanliness', 'public-safety', 'obstructions']
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
export function findNearbyMunicipalities(location: Location, radius: number = 50): MunicipalCorporation[] {
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

// Submit issue to municipality
export async function submitToMunicipality(
  issue: CivicIssue,
  municipality: MunicipalCorporation
): Promise<{ success: boolean; message: string; referenceId?: string }> {
  try {
    // Prepare the submission data
    const submissionData = {
      issueId: issue.id,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      location: {
        latitude: issue.location.lat,
        longitude: issue.location.lng,
        address: `Location: ${issue.location.lat.toFixed(6)}, ${issue.location.lng.toFixed(6)}`
      },
      reporter: {
        name: issue.isAnonymous ? 'Anonymous' : issue.reportedBy,
        isAnonymous: issue.isAnonymous
      },
      photos: issue.photos,
      submittedAt: issue.reportedAt,
      municipality: {
        id: municipality.id,
        name: municipality.name,
        email: municipality.email
      }
    };

    // Simulate API call to municipality
    console.log('Submitting to municipality:', municipality.name);
    console.log('Submission data:', submissionData);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/failure (in real implementation, this would be an actual API call)
    const success = Math.random() > 0.1; // 90% success rate for demo

    if (success) {
      const referenceId = `MC-${municipality.id.toUpperCase()}-${Date.now()}`;
      return {
        success: true,
        message: `Successfully submitted to ${municipality.name}`,
        referenceId
      };
    } else {
      throw new Error('Municipality server temporarily unavailable');
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to submit to ${municipality.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Submit to multiple nearby municipalities
export async function submitToNearbyMunicipalities(
  issue: CivicIssue,
  userLocation: Location
): Promise<{ success: boolean; submissions: Array<{ municipality: MunicipalCorporation; result: any }> }> {
  const nearbyMunicipalities = findNearbyMunicipalities(userLocation, 100); // 100km radius

  if (nearbyMunicipalities.length === 0) {
    return {
      success: false,
      submissions: []
    };
  }

  const submissions = await Promise.all(
    nearbyMunicipalities.map(async (municipality) => {
      const result = await submitToMunicipality(issue, municipality);
      return { municipality, result };
    })
  );

  const successfulSubmissions = submissions.filter(sub => sub.result.success);
  
  return {
    success: successfulSubmissions.length > 0,
    submissions
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