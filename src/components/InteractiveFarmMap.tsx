import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Layers, RotateCcw, Navigation, Compass, Sparkles, Droplets, Thermometer, Activity } from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface InteractiveFarmMapProps {
  coordinates?: string;
  locationName: string;
  cropType: string;
  growthStage: string;
  ndviValue?: number;
  soilMoisture?: number;
  surfaceTemp?: number;
  language: LanguageCode;
}

export function parseCoordinates(coordStr?: string, locationName?: string): [number, number] {
  if (coordStr) {
    const match = coordStr.match(/([+-]?\d+(?:\.\d+)?)[°\s]*([NSns])?[,\s]+([+-]?\d+(?:\.\d+)?)[°\s]*([EWew])?/);
    if (match) {
      let lat = parseFloat(match[1]);
      const latDir = match[2]?.toUpperCase();
      let lng = parseFloat(match[3]);
      const lngDir = match[4]?.toUpperCase();

      if (latDir === 'S') lat = -lat;
      if (lngDir === 'W') lng = -lng;

      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
  }

  // Fallback lookup based on Indian agricultural district
  const loc = (locationName || '').toLowerCase();
  if (loc.includes('jaipur') || loc.includes('rajasthan')) return [26.9124, 75.7873];
  if (loc.includes('ludhiana') || loc.includes('punjab') || loc.includes('bathinda')) return [30.9010, 75.8573];
  if (loc.includes('wardha') || loc.includes('vidarbha') || loc.includes('maharashtra') || loc.includes('akola') || loc.includes('nashik')) return [20.7453, 78.6022];
  if (loc.includes('warangal') || loc.includes('telangana') || loc.includes('guntur') || loc.includes('khammam')) return [17.9689, 79.5941];
  if (loc.includes('rajkot') || loc.includes('gujarat') || loc.includes('saurashtra') || loc.includes('junagadh') || loc.includes('amreli')) return [22.3039, 70.8022];
  if (loc.includes('thanjavur') || loc.includes('tamil') || loc.includes('madurai') || loc.includes('coimbatore')) return [10.7870, 79.1378];

  return [26.9124, 75.7873]; // Default Jaipur
}

export const InteractiveFarmMap: React.FC<InteractiveFarmMapProps> = ({
  coordinates,
  locationName,
  cropType,
  growthStage,
  ndviValue = 0.45,
  soilMoisture = 22,
  surfaceTemp = 33.5,
  language,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('satellite');
  const [isLoaded, setIsLoaded] = useState(false);

  const [lat, lng] = parseCoordinates(coordinates, locationName);

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; OpenStreetMap | ISRO Bhuvan / Esri')
        .addTo(map);

      mapInstanceRef.current = map;
      setIsLoaded(true);
    } else {
      mapInstanceRef.current.flyTo([lat, lng], 12, { duration: 1.2 });
    }

    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add selected Tile Layer
    if (mapType === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
    }

    // Custom pulsing pin icon
    const customPinHtml = `
      <div class="relative flex items-center justify-center">
        <span class="absolute w-10 h-10 rounded-full bg-emerald-500/40 animate-ping"></span>
        <span class="absolute w-6 h-6 rounded-full bg-emerald-600/60 animate-pulse"></span>
        <div class="relative w-8 h-8 rounded-full bg-emerald-800 border-2 border-white shadow-xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-lime-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.6 12a.6.6 0 0 0 .8 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `;

    const pinIcon = L.divIcon({
      html: customPinHtml,
      className: 'custom-farm-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const popupHtml = `
      <div style="font-family: inherit; font-size: 12px; color: #1c1917; padding: 4px; min-width: 170px;">
        <div style="font-weight: 700; color: #065f46; font-size: 13px; margin-bottom: 2px;">
          📍 ${locationName}
        </div>
        <div style="font-size: 11px; color: #44403c; margin-bottom: 6px;">
          <strong>${cropType}</strong> • ${growthStage}
        </div>
        <div style="font-family: monospace; font-size: 10px; background: #f5f5f4; padding: 3px 6px; border-radius: 4px; color: #57534e; margin-bottom: 6px;">
          ${coordinates || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`}
        </div>
        <div style="font-size: 11px; display: flex; flex-direction: column; gap: 3px; border-top: 1px solid #e7e5e4; padding-top: 5px;">
          <div>🛰️ <strong>NDVI:</strong> ${ndviValue}</div>
          <div>💧 <strong>Soil Moisture:</strong> ${soilMoisture}%</div>
          <div>🌡️ <strong>Temp:</strong> ${surfaceTemp}°C</div>
        </div>
      </div>
    `;

    const marker = L.marker([lat, lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup(popupHtml);

    markerRef.current = marker;

    // Clean resize
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      // Keep map instance across renders or unmount cleanly
    };
  }, [lat, lng, mapType, locationName, cropType, growthStage, ndviValue, soilMoisture, surfaceTemp]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 0.8 });
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  return (
    <div className="rounded-2xl border border-teal-200/90 bg-stone-900 overflow-hidden shadow-sm space-y-0">
      {/* Map Control Toolbar */}
      <div className="bg-stone-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-stone-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            {t.mapTitle || 'Geospatial Farm Coordinate Map'}
          </span>
          <span className="font-mono text-[11px] text-teal-300/90 hidden sm:inline bg-stone-800/80 px-2 py-0.5 rounded border border-stone-700">
            {coordinates || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer switcher */}
          <div className="inline-flex rounded-lg bg-stone-800 p-0.5 border border-stone-700">
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                mapType === 'satellite'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {t.mapSatelliteView || 'Satellite Imagery'}
            </button>
            <button
              type="button"
              onClick={() => setMapType('street')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                mapType === 'street'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {t.mapStreetView || 'Street Map'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleRecenter}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-teal-300 border border-stone-700 text-[11px] font-medium cursor-pointer transition-colors"
            title="Recenter Map"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">{t.recenterMap || 'Recenter'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-64 sm:h-72 bg-stone-950">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Coordinates Overlay Card */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-xl p-2.5 shadow-lg text-[11px] text-white flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-stone-200">{locationName}</div>
              <div className="font-mono text-[10px] text-stone-400">
                {coordinates || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`}
              </div>
            </div>
          </div>
          <div className="h-6 w-px bg-stone-700" />
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-300">
            <span>NDVI: <strong>{ndviValue}</strong></span>
            <span>Moisture: <strong>{soilMoisture}%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
