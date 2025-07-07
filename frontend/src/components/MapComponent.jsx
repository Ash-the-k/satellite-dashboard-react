import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

// Fallback border radius if theme.radii.lg is not available
const getBorderRadius = ({ theme }) => theme.radii?.lg || '8px';

const MapContainer = styled.div`
  height: 400px;
  margin: 1.5rem 0;
  border-radius: ${getBorderRadius};
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  .leaflet-tile {
    filter: ${({ theme }) => theme.name === 'dark' ? 
      'brightness(0.6) invert(1) grayscale(1) contrast(3) hue-rotate(200deg)' : 
      'none'};
  }
`;

const createDynamicIcon = (primaryColor) => {
  return L.divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${primaryColor}" stroke="#fff" stroke-width="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `,
    className: 'dynamic-marker-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const MapComponent = ({ lat, lng }) => {
  const { theme } = useTheme();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        zoomControl: true,
        minZoom: 2,
        maxZoom: 8
      }).setView([lat || 0, lng || 0], 3);

      // Use CartoDB tiles which have light/dark variants
      L.tileLayer(`https://{s}.basemaps.cartocdn.com/${theme.name === 'dark' ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 8
      }).addTo(mapRef.current);

      markerRef.current = L.marker([lat || 0, lng || 0], {
        icon: createDynamicIcon(theme.primary || '#4285F4'), // Fallback color if primary is undefined
        riseOnHover: true
      }).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setIcon(createDynamicIcon(theme.primary || '#4285F4'));
      mapRef.current.setView([lat, lng], mapRef.current.getZoom());
    }
  }, [lat, lng, theme]);

  return <MapContainer id="map" theme={theme} />;
};

export default MapComponent;