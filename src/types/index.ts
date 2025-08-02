export interface Location {
  lat: number;
  lng: number;
}

export interface MunicipalSubmission {
  municipalityId: string;
  municipalityName: string;
  submittedAt: Date;
  success: boolean;
  message: string;
  referenceId?: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: Location;
  photos: string[];
  status: IssueStatus;
  reportedAt: Date;
  reportedBy: string;
  isAnonymous: boolean;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  municipalSubmissions?: MunicipalSubmission[];
}

export type IssueCategory = 
  | 'roads'
  | 'lighting'
  | 'water-supply'
  | 'cleanliness'
  | 'public-safety'
  | 'obstructions';

export type IssueStatus = 
  | 'reported'
  | 'under-review'
  | 'in-progress'
  | 'resolved'
  | 'closed';

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  isAnonymous: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  radius: number; // in kilometers
}

export interface CategoryInfo {
  value: IssueCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
} 