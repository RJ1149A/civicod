import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    value: 'roads',
    label: 'Roads',
    icon: '🚧',
    color: 'bg-orange-500',
    description: 'Potholes, obstructions, road damage'
  },
  {
    value: 'lighting',
    label: 'Lighting',
    icon: '💡',
    color: 'bg-yellow-500',
    description: 'Broken or flickering street lights'
  },
  {
    value: 'water-supply',
    label: 'Water Supply',
    icon: '💧',
    color: 'bg-blue-500',
    description: 'Leaks, low pressure, water issues'
  },
  {
    value: 'cleanliness',
    label: 'Cleanliness',
    icon: '🗑️',
    color: 'bg-green-500',
    description: 'Overflowing bins, garbage, litter'
  },
  {
    value: 'public-safety',
    label: 'Public Safety',
    icon: '⚠️',
    color: 'bg-red-500',
    description: 'Open manholes, exposed wiring, hazards'
  },
  {
    value: 'obstructions',
    label: 'Obstructions',
    icon: '🌳',
    color: 'bg-purple-500',
    description: 'Fallen trees, debris, blockages'
  }
];

export const DEFAULT_LOCATION = {
  lat: 40.7128,
  lng: -74.0060,
  radius: 3 // 3km radius
};

export const MAX_PHOTOS = 5;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export const STATUS_COLORS = {
  reported: 'bg-gray-500',
  'under-review': 'bg-yellow-500',
  'in-progress': 'bg-blue-500',
  resolved: 'bg-green-500',
  closed: 'bg-red-500'
};

export const STATUS_LABELS = {
  reported: 'Reported',
  'under-review': 'Under Review',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
}; 