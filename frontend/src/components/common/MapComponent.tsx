import { useEffect, type FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Delete the default icon options then set them again
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  popupText?: string;
}

// Component to handle map center changes
const RecenterMap: FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapComponent: FC<MapComponentProps> = ({ center, zoom = 13, popupText }) => {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-gray-800">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Dark mode filter for map (optional, but looks good with the app's theme)
          className="map-tiles"
        />
        <Marker position={center}>
          {popupText && <Popup>{popupText}</Popup>}
        </Marker>
        <RecenterMap center={center} />
      </MapContainer>
      
      <style>{`
        .leaflet-container {
          background: #111827; /* Match app background */
        }
        .map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
