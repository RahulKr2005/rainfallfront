import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Navigation, MapPin, RefreshCw, AlertTriangle, ShieldCheck, 
  ExternalLink, Droplets, Activity, Layers, Info, CheckCircle2, 
  Compass, Radio, ChevronRight
} from 'lucide-react';
import { MapLayersResponse, GridPoint, Station, UpstreamGauge } from '../types';

interface MapViewerProps {
  mapData: MapLayersResponse | null;
  loading: boolean;
  activeLayer: 'susceptibility' | 'elevation' | 'twi' | 'landcover';
  setActiveLayer: (layer: 'susceptibility' | 'elevation' | 'twi' | 'landcover') => void;
  selectedPoint: GridPoint | null;
  setSelectedPoint: (pt: GridPoint | null) => void;
  activeCoords: { lat: number; lon: number } | null;
  setActiveCoords: (coords: { lat: number; lon: number } | null) => void;
  locationName: string;
  setLocationName: (name: string) => void;
  locationSource: 'gps' | 'preset' | 'grid';
  setLocationSource: (source: 'gps' | 'preset' | 'grid') => void;
  onDetectGPS: () => void;
  geoLoading: boolean;
  geoError: string | null;
}

// Preset monitoring locations and hydrological hotspots for quick navigation
const PRESET_MONITORING_LOCATIONS = [
  { name: 'IMD Safdarjung (Main)', lat: 28.5833, lon: 77.2060, type: 'station' },
  { name: 'IMD Palam Airport', lat: 28.5644, lon: 77.1219, type: 'station' },
  { name: 'Yamuna Old Railway Bridge', lat: 28.6625, lon: 77.2483, type: 'gauge' },
  { name: 'Najafgarh Basin Outfall', lat: 28.6942, lon: 77.1625, type: 'drain' },
  { name: 'Kashmere Gate Flood Plain', lat: 28.6672, lon: 77.2312, type: 'hotspot' },
  { name: 'Delhi Ridge (AMSL High)', lat: 28.6189, lon: 77.1728, type: 'station' },
];

export const MapViewer: React.FC<MapViewerProps> = ({
  mapData,
  loading,
  activeLayer,
  setActiveLayer,
  selectedPoint,
  setSelectedPoint,
  activeCoords,
  setActiveCoords,
  locationName,
  setLocationName,
  locationSource,
  setLocationSource,
  onDetectGPS,
  geoLoading,
  geoError,
}) => {
  // Default fallback center (Delhi Central)
  const DEFAULT_LAT = 28.6139;
  const DEFAULT_LON = 77.2090;

  // Zoom view level for Google Maps embed (street = 16, neighborhood = 14, wide = 11)
  const [zoomLevel, setZoomLevel] = useState<'wide' | 'neighborhood' | 'street'>('neighborhood');

  const zoomValue = useMemo(() => {
    switch (zoomLevel) {
      case 'street': return 16;
      case 'neighborhood': return 14;
      case 'wide': return 11;
    }
  }, [zoomLevel]);

  // When selectedPoint prop changes from external clicks, sync map coordinates
  useEffect(() => {
    if (selectedPoint) {
      setActiveCoords({ lat: selectedPoint.lat, lon: selectedPoint.lon });
      setLocationSource('grid');
      setLocationName(`Grid Cell (${selectedPoint.lat.toFixed(3)}°N, ${selectedPoint.lon.toFixed(3)}°E)`);
    }
  }, [selectedPoint, setActiveCoords, setLocationName, setLocationSource]);

  // Effective coordinates to display
  const currentLat = activeCoords ? activeCoords.lat : DEFAULT_LAT;
  const currentLon = activeCoords ? activeCoords.lon : DEFAULT_LON;

  // Generate dynamic Google Maps iframe embed URL (API-key-free web embed)
  const googleMapsEmbedUrl = useMemo(() => {
    const latStr = currentLat.toFixed(6);
    const lonStr = currentLon.toFixed(6);
    return `https://www.google.com/maps?q=${latStr},${lonStr}&z=${zoomValue}&output=embed`;
  }, [currentLat, currentLon, zoomValue]);

  // External Google Maps link for full navigation / satellite view
  const googleMapsExternalUrl = `https://www.google.com/maps?q=${currentLat.toFixed(6)},${currentLon.toFixed(6)}&z=15`;

  // Find nearest grid point in mapData to correlate physical inundation & flood risk
  const nearestPoint = useMemo(() => {
    if (!mapData?.grid_points || mapData.grid_points.length === 0) return null;

    let closest = mapData.grid_points[0];
    let minDistanceSq = Number.MAX_VALUE;

    for (const pt of mapData.grid_points) {
      const dLat = pt.lat - currentLat;
      const dLon = pt.lon - currentLon;
      const distSq = dLat * dLat + dLon * dLon;
      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        closest = pt;
      }
    }
    return closest;
  }, [mapData, currentLat, currentLon]);

  // Find nearest IMD station for rainfall observation evidence
  const nearestStation = useMemo(() => {
    if (!mapData?.stations || mapData.stations.length === 0) return null;

    let closest = mapData.stations[0];
    let minDistanceSq = Number.MAX_VALUE;

    for (const st of mapData.stations) {
      const dLat = st.latitude - currentLat;
      const dLon = st.longitude - currentLon;
      const distSq = dLat * dLat + dLon * dLon;
      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        closest = st;
      }
    }
    return closest;
  }, [mapData, currentLat, currentLon]);

  // Determine Inundation Risk level: Low, Moderate, High, Severe
  const riskInfo = useMemo(() => {
    const tfsi = nearestPoint?.tfsi_score ?? 0.35;
    if (tfsi >= 0.70) {
      return {
        level: 'Severe',
        badgeClass: 'bg-rust-100 text-rust-700 border-rust-200',
        dotColor: 'bg-rust-600',
        textColor: 'text-rust-700',
        action: 'Immediate flood precaution: Low-lying riverfronts and underpasses prone to submergence.'
      };
    } else if (tfsi >= 0.50) {
      return {
        level: 'High',
        badgeClass: 'bg-terracotta-100 text-terracotta-700 border-terracotta-200',
        dotColor: 'bg-terracotta-600',
        textColor: 'text-terracotta-700',
        action: 'Waterlogging expected: Avoid waterlogged arterial corridors and underpasses.'
      };
    } else if (tfsi >= 0.35) {
      return {
        level: 'Moderate',
        badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
        dotColor: 'bg-amber-500',
        textColor: 'text-amber-700',
        action: 'Ponding possible: Drive cautiously and monitor IMD nowcasts.'
      };
    } else {
      return {
        level: 'Low',
        badgeClass: 'bg-forest-100 text-forest-700 border-forest-200',
        dotColor: 'bg-forest-700',
        textColor: 'text-forest-700',
        action: 'Normal conditions: Natural stormwater gravity runoff functional.'
      };
    }
  }, [nearestPoint]);

  return (
    <div className="relative w-full bg-white dark:bg-[#131C2E] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
      {/* 1. Top Bar: Current Location, Coordinates, & Controls */}
      <div className="bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 shadow-xs shrink-0">
            {locationSource === 'gps' ? (
              <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            ) : (
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {locationName}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider border ${
                locationSource === 'gps' 
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}>
                {locationSource === 'gps' ? 'Live GPS' : 'Monitoring Target'}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono mt-0.5">
              <span>Lat: <strong className="text-slate-800 dark:text-slate-200">{currentLat.toFixed(5)}°N</strong></span>
              <span>•</span>
              <span>Lon: <strong className="text-slate-800 dark:text-slate-200">{currentLon.toFixed(5)}°E</strong></span>
              <span className="hidden md:inline text-slate-400 dark:text-slate-500">• Google Maps (API-Key Free)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Geolocation Trigger & Zoom Levels */}
        <div className="flex items-center gap-2">
          {/* Zoom view level selector */}
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setZoomLevel('street')}
              className={`px-2.5 py-1 rounded-md text-xs transition ${
                zoomLevel === 'street' ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Street (z16)
            </button>
            <button
              onClick={() => setZoomLevel('neighborhood')}
              className={`px-2.5 py-1 rounded-md text-xs transition ${
                zoomLevel === 'neighborhood' ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Area (z14)
            </button>
            <button
              onClick={() => setZoomLevel('wide')}
              className={`px-2.5 py-1 rounded-md text-xs transition ${
                zoomLevel === 'wide' ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Regional (z11)
            </button>
          </div>

          {/* Current Location Button */}
          <button
            onClick={onDetectGPS}
            disabled={geoLoading}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-xs transition flex items-center gap-1.5"
            title="Locate me using browser Geolocation API"
          >
            <Navigation className={`w-3.5 h-3.5 ${geoLoading ? 'animate-spin' : ''}`} />
            <span>{geoLoading ? 'Detecting...' : 'My Location'}</span>
          </button>

          {/* External Google Maps Link */}
          <a
            href={googleMapsExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-white dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 rounded-lg transition border border-slate-200 dark:border-slate-700 shadow-xs"
            title="Open in Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Geolocation Error / Notice */}
      {geoError && (
        <div className="bg-red-50 dark:bg-red-950/50 border-b border-red-200 dark:border-red-900/60 px-4 py-2 text-xs text-red-700 dark:text-red-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{geoError}</span>
          </div>
          <button
            onClick={onDetectGPS}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-md text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-50 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Monitoring Location Quick Pickers */}
      <div className="bg-slate-50/70 dark:bg-[#0B0F19]/80 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono uppercase tracking-wider shrink-0 flex items-center gap-1 pr-1 font-medium">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          Hotspots:
        </span>
        {PRESET_MONITORING_LOCATIONS.map((loc) => {
          const isSelected = Math.abs(currentLat - loc.lat) < 0.002 && Math.abs(currentLon - loc.lon) < 0.002;
          return (
            <button
              key={loc.name}
              onClick={() => {
                setActiveCoords({ lat: loc.lat, lon: loc.lon });
                setLocationSource('preset');
                setLocationName(loc.name);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition font-medium flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                loc.type === 'station' ? 'bg-blue-500' :
                loc.type === 'gauge' ? 'bg-amber-500' :
                loc.type === 'drain' ? 'bg-cyan-500' : 'bg-slate-400'
              }`} />
              <span>{loc.name}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Google Maps Responsive Iframe Viewer */}
      <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px] bg-slate-100 dark:bg-[#0B0F19] overflow-hidden">
        {/* Loading Spinner during GPS retrieval */}
        {geoLoading && (
          <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-white">Acquiring current GPS location...</span>
            <span className="text-[11px] text-slate-300 font-mono">Requesting browser geolocation permission</span>
          </div>
        )}

        {/* Dynamic Responsive Google Maps Iframe */}
        <iframe
          key={`${currentLat}-${currentLon}-${zoomValue}`}
          title="Current Location Google Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={googleMapsEmbedUrl}
          className="w-full h-full border-0 filter saturate-[0.95]"
        />

        {/* 5. In-Map Location & Flood Risk HUD Overlay (Top-Left) */}
        <div className="absolute top-3 left-3 z-10 max-w-xs w-full bg-white/95 dark:bg-[#131C2E]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-lg text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${riskInfo.dotColor}`} />
              <strong className="text-slate-900 dark:text-slate-100 font-semibold">Flood Risk Analysis</strong>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
              riskInfo.level === 'Severe' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60' :
              riskInfo.level === 'High' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60' :
              riskInfo.level === 'Moderate' ? 'bg-amber-400/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/60' :
              'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
            }`}>
              {riskInfo.level} Risk
            </span>
          </div>

          <div className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Target Location:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[160px]" title={locationName}>
                {locationName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Coordinates:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {currentLat.toFixed(4)}°N, {currentLon.toFixed(4)}°E
              </span>
            </div>
            {nearestPoint && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Topographic TFSI:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{nearestPoint.tfsi_score} / 1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">SRTM Elevation / Slope:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{nearestPoint.elevation_m}m ({nearestPoint.slope_deg}°)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Wetness Index (TWI):</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{nearestPoint.twi}</span>
                </div>
              </>
            )}
            {nearestStation && (
              <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Nearest Station:</span>
                <span className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-[150px]">{nearestStation.station_name}</span>
              </div>
            )}
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">Hydrologic Advisory:</span>
            {riskInfo.action}
          </div>
        </div>

        {/* 6. In-Map GIS Layer Switcher (Top-Right) */}
        <div className="absolute top-3 right-3 z-10 bg-white/95 dark:bg-[#131C2E]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-lg text-xs flex flex-col gap-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            GIS Layer
          </span>
          <div className="flex flex-col gap-0.5 text-[11px]">
            <button
              onClick={() => setActiveLayer('susceptibility')}
              className={`px-2 py-1 rounded-md text-left font-medium transition flex items-center justify-between gap-3 ${
                activeLayer === 'susceptibility' ? 'bg-blue-600 text-white shadow-xs font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Susceptibility (TFSI)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            </button>
            <button
              onClick={() => setActiveLayer('elevation')}
              className={`px-2 py-1 rounded-md text-left font-medium transition flex items-center justify-between gap-3 ${
                activeLayer === 'elevation' ? 'bg-blue-600 text-white shadow-xs font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>SRTM DEM Elevation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </button>
            <button
              onClick={() => setActiveLayer('twi')}
              className={`px-2 py-1 rounded-md text-left font-medium transition flex items-center justify-between gap-3 ${
                activeLayer === 'twi' ? 'bg-blue-600 text-white shadow-xs font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>Wetness Index (TWI)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            </button>
            <button
              onClick={() => setActiveLayer('landcover')}
              className={`px-2 py-1 rounded-md text-left font-medium transition flex items-center justify-between gap-3 ${
                activeLayer === 'landcover' ? 'bg-blue-600 text-white shadow-xs font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>ESA WorldCover</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            </button>
          </div>
        </div>

        {/* 7. Bottom-Right Risk Legend */}
        <div className="absolute bottom-3 right-3 z-10 bg-white/95 dark:bg-[#131C2E]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg shadow-md text-[10px] text-slate-600 dark:text-slate-300 flex items-center gap-2 font-mono">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Scale:</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Low</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Mod</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> High</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Severe</span>
        </div>
      </div>

      {/* 8. Bottom Information Footer */}
      <div className="bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>API-Key Free Google Maps:</strong> Embedded iframe. No Google Maps JavaScript SDK token required.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>GPS coordinates remain local in browser session.</span>
          <a
            href={googleMapsExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium transition"
          >
            <span>View on Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
