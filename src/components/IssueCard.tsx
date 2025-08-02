import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageCircle, ThumbsUp, ThumbsDown, MapPin } from 'lucide-react';
import { CivicIssue } from '../types';
import { CATEGORIES, STATUS_COLORS, STATUS_LABELS } from '../utils/constants';
import { calculateDistance, formatDistance } from '../utils/geolocation';
import { useLocation } from '../context/LocationContext';

interface IssueCardProps {
  issue: CivicIssue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const { userLocation } = useLocation();
  const category = CATEGORIES.find(cat => cat.value === issue.category);
  
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    issue.location.lat,
    issue.location.lng
  );

  return (
    <Link to={`/issue/${issue.id}`} className="block">
      <div className="card issue-card hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{category?.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {issue.title}
              </h3>
              <p className="text-sm text-gray-600">
                {category?.label} • {issue.isAnonymous ? 'Anonymous' : issue.reportedBy}
              </p>
            </div>
          </div>
          <div className={`status-badge ${STATUS_COLORS[issue.status]} text-white`}>
            {STATUS_LABELS[issue.status]}
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {issue.description}
        </p>

        {/* Photos Preview */}
        {issue.photos.length > 0 && (
          <div className="flex space-x-2 mb-4">
            {issue.photos.slice(0, 3).map((photo, index) => (
              <div key={index} className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                <img 
                  src={photo} 
                  alt={`Issue photo ${index + 1}`}
                  className="w-full h-full photo-preview"
                />
              </div>
            ))}
            {issue.photos.length > 3 && (
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                +{issue.photos.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Location and Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{formatDistance(distance)} away</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{issue.comments.length} comments</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{issue.upvotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-4 h-4" />
              <span>{issue.downvotes}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-400">
          Reported {format(issue.reportedAt, 'MMM d, yyyy')}
        </div>
      </div>
    </Link>
  );
};

export default IssueCard; 