import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserLocation } from '../types';
import { getCurrentLocation } from '../utils/geolocation';
import { DEFAULT_LOCATION } from '../utils/constants';

interface LocationContextType {
  userLocation: UserLocation;
  setUserLocation: (location: UserLocation) => void;
  isLoading: boolean;
  error: string | null;
  refreshLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const location = await getCurrentLocation();
      setUserLocation({
        lat: location.lat,
        lng: location.lng,
        radius: 3 // Default 3km radius
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
      // Keep default location if geolocation fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  const value: LocationContextType = {
    userLocation,
    setUserLocation,
    isLoading,
    error,
    refreshLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}; 