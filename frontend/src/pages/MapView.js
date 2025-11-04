import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon path problem in some setups
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const center = { lat: 18.5204, lng: 73.8567 }; // Pune default

export default function MapView() {
  const [locations, setLocations] = useState([
    // Optional: fallback/demo marker
    { id: 1, name: 'Demo Ambulance', lat: 18.5204, lng: 73.8567, status: 'Available' }
  ]);

  // Optional: fetch real markers from your backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/ambulances'); // change endpoint if needed
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // transform into { id, lat, lng, name, status }
        const pts = data.map(a => ({
          id: a._id || a.id,
          name: a.name || a.label || 'Ambulance',
          lat: a.location?.lat || a.latitude || a.lat,
          lng: a.location?.lng || a.longitude || a.lng,
          status: a.status || 'unknown'
        })).filter(p => p.lat && p.lng);
        if (pts.length) setLocations(pts);
      } catch (err) {
        console.warn('Could not load ambulance locations', err.message);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
        {/* OpenStreetMap tile layer — free */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map(loc => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.name}</strong><br/>
              Status: {loc.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
