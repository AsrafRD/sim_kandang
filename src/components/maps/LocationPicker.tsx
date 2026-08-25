'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card } from '@/components/ui/card';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export interface LocationPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

// Component to handle recentering when position is set initially
function MapRecenter({ position }: { position: L.LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [map, position]);
  return null;
}

export default function LocationPicker({ initialLat, initialLng }: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLng ? new L.LatLng(initialLat, initialLng) : null
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-64 w-full bg-muted animate-pulse rounded-lg border border-border" />;

  // Default to center of Java, Indonesia if no initial position
  const defaultCenter: [number, number] = initialLat && initialLng ? [initialLat, initialLng] : [-7.0909, 107.6689];

  return (
    <div className="space-y-2">
      <Card className="p-1 overflow-hidden h-[250px] w-full rounded-xl border border-border shadow-sm">
        <MapContainer 
          center={defaultCenter} 
          zoom={8} 
          scrollWheelZoom={true}
          className="h-full w-full rounded-lg"
          style={{ zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
          {position && <MapRecenter position={position} />}
        </MapContainer>
      </Card>
      
      {/* Hidden inputs to pass data to form action */}
      <input type="hidden" name="latitude" value={position?.lat || ''} />
      <input type="hidden" name="longitude" value={position?.lng || ''} />
      
      <p className="text-xs text-muted-foreground">
        {position 
          ? `Koordinat: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
          : "Klik pada peta untuk menentukan titik koordinat kandang."}
      </p>
    </div>
  );
}
