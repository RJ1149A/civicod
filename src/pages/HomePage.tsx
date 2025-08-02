import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Map as MapIcon, List } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useIssues } from '../context/IssuesContext';
import { isWithinNeighborhood } from '../utils/geolocation';
import { CATEGORIES } from '../utils/constants';
import Map from '../components/Map';
import IssueCard from '../components/IssueCard';
import { CivicIssue } from '../types';

const HomePage: React.FC = () => {
  const { userLocation, isLoading, error } = useLocation();
  const { issues } = useIssues();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter issues within neighborhood
  const neighborhoodIssues = useMemo(() => {
    return issues.filter(issue => isWithinNeighborhood(userLocation, issue.location));
  }, [issues, userLocation]);

  // Apply category and status filters
  const filteredIssues = useMemo(() => {
    return neighborhoodIssues.filter(issue => {
      const categoryMatch = selectedCategory === 'all' || issue.category === selectedCategory;
      const statusMatch = selectedStatus === 'all' || issue.status === selectedStatus;
      return categoryMatch && statusMatch;
    });
  }, [neighborhoodIssues, selectedCategory, selectedStatus]);

  const handleIssueClick = (issue: CivicIssue) => {
    navigate(`/issue/${issue.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-civic-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your neighborhood...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Location Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            Please enable location access to view issues in your neighborhood.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Neighborhood</h1>
          <p className="text-gray-600">
            {filteredIssues.length} issues within {userLocation.radius}km radius
          </p>
        </div>
        <button
          onClick={() => navigate('/report')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Report Issue</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'map' 
                  ? 'bg-civic-100 text-civic-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-civic-100 text-civic-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="under-review">Under Review</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Map
            issues={filteredIssues}
            userLocation={userLocation}
            onIssueClick={handleIssueClick}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Issues Found</h3>
              <p className="text-gray-600 mb-4">
                No issues match your current filters in your neighborhood.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage; 