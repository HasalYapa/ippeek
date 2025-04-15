"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
// Only initialize if we're on the client side
let DefaultIcon: L.Icon;
if (typeof window !== 'undefined') {
  DefaultIcon = L.icon({
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

interface LocationMapProps {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, city, country }) => {
  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') {
      return;
    }

    // This is needed to fix the marker icon issue with Leaflet in Next.js
    if (DefaultIcon) {
      L.Marker.prototype.options.icon = DefaultIcon;
    }
  }, []);

  // If coordinates are invalid, show a default location
  const validCoordinates = !isNaN(latitude) && !isNaN(longitude) &&
                          latitude !== 0 && longitude !== 0;

  const position: [number, number] = validCoordinates
    ? [latitude, longitude]
    : [40.7128, -74.0060]; // Default to New York if coordinates are invalid

  // Only render the map on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder during server-side rendering
    return (
      <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={position}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            {city}, {country}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;
