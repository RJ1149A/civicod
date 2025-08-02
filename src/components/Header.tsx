import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Plus, Home, AlertTriangle } from 'lucide-react';
import { useLocation as useLocationContext } from '../context/LocationContext';

const Header: React.FC = () => {
  const { userLocation, isLoading, error } = useLocationContext();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-civic-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Civic Visibility</h1>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'bg-civic-100 text-civic-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/report"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/report') 
                  ? 'bg-civic-100 text-civic-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue</span>
            </Link>
          </nav>

          {/* Location Display */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {isLoading ? (
              <span>Loading location...</span>
            ) : error ? (
              <span className="text-red-600">Location unavailable</span>
            ) : (
              <span>
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                <span className="text-gray-400 ml-1">
                  ({userLocation.radius}km radius)
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 