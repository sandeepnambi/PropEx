// frontend/src/components/common/MapComponent.jsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issues in Leaflet with Webpack/Vite
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ center, zoom = 13, popupText }) => {
  // Ensure center is valid
  /** @type {[number, number]} */
  const position = Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])
    ? [Number(center[0]), Number(center[1])] 
    : [20.5937, 78.9629]; // Default to India center if invalid

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={position} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          {popupText && (
            <Popup>
              {popupText}
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
