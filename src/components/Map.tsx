import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CivicIssue } from '../types';
import { CATEGORIES } from '../utils/constants';

interface MapProps {
  issues: CivicIssue[];
  userLocation: { lat: number; lng: number; radius: number };
  onIssueClick?: (issue: CivicIssue) => void;
  className?: string;
}

const Map: React.FC<MapProps> = ({ issues, userLocation, onIssueClick, className = "map-container" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 14);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add user location marker
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: '<div class="w-4 h-4 bg-civic-600 rounded-full border-2 border-white shadow-lg"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('Your Location');

    // Add neighborhood circle
    L.circle([userLocation.lat, userLocation.lng], {
      color: '#0ea5e9',
      fillColor: '#0ea5e9',
      fillOpacity: 0.1,
      radius: userLocation.radius * 1000 // Convert km to meters
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [userLocation]);

  // Update markers when issues change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for issues
    issues.forEach(issue => {
      const category = CATEGORIES.find(cat => cat.value === issue.category);
      const icon = L.divIcon({
        className: 'issue-marker',
        html: `<div class="w-6 h-6 ${category?.color} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs">${category?.icon}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([issue.location.lat, issue.location.lng], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${issue.title}</h3>
            <p class="text-sm text-gray-600">${issue.description.substring(0, 100)}...</p>
            <div class="mt-2">
              <span class="inline-block px-2 py-1 text-xs bg-gray-200 rounded">${category?.label}</span>
            </div>
          </div>
        `);

      if (onIssueClick) {
        marker.on('click', () => onIssueClick(issue));
      }

      markersRef.current.push(marker);
    });
  }, [issues, onIssueClick]);

  return <div ref={mapRef} className={className} />;
};

export default Map; 