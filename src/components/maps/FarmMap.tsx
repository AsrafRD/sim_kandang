'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card } from '@/components/ui/card';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const activeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export interface FarmMapData {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean; // Is it the currently selected farm?
}

export default function FarmMap({ farms }: { farms: FarmMapData[] }) {
  // We don't need 'mounted' state because FarmMap is dynamically imported with ssr: false
  // This actually prevents the TileLayer appendChild error caused by double-rendering
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    // Workaround for React 18 Strict Mode / Next.js HMR crashing Leaflet
    if (process.env.NODE_ENV === 'development') {
      setMapKey(prev => prev + 1);
    }
  }, []);

  const validFarms = farms.filter(f => f.latitude !== null && f.longitude !== null);
  
  // Default center if no farms have coordinates (Center of Indonesia)
  const defaultCenter: [number, number] = [-2.5489, 118.0149];
  const center: [number, number] = validFarms.length > 0 
    ? [validFarms[0].latitude!, validFarms[0].longitude!] 
    : defaultCenter;
  
  const zoom = validFarms.length > 0 ? 10 : 5;

  return (
    <Card className="p-1 overflow-hidden h-[300px] w-full rounded-2xl border border-border shadow-sm mb-6 z-0">
      <MapContainer 
        key={mapKey}
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="h-full w-full rounded-xl"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {validFarms.map((farm) => (
          <Marker 
            key={farm.id} 
            position={[farm.latitude!, farm.longitude!]}
            icon={farm.isActive ? activeIcon : icon}
          >
            <Popup>
              <div className="font-semibold">{farm.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{farm.address || 'No address'}</div>
              {farm.isActive && <div className="text-xs text-green-600 font-medium mt-1">✓ Kandang Aktif</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
}
