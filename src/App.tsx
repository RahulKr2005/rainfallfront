import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { CurrentWeatherView } from './views/CurrentWeatherView';
import { RainForecastView } from './views/RainForecastView';
import { FloodRiskMapView } from './views/FloodRiskMapView';
import { EarlyWarningsView } from './views/EarlyWarningsView';
import { ForecastView } from './views/ForecastView';
import { DataInsightsView } from './views/DataInsightsView';
import { SavedLocationsView, SavedLocationItem } from './views/SavedLocationsView';
import { AboutHelpView } from './views/AboutHelpView';
import { AnalyticsView } from './views/AnalyticsView';
import { AdminView } from './views/AdminView';
import { WeatherBackground } from './components/WeatherBackground';
import { LandingView } from './views/LandingView';
import { EvaluationModal } from './components/EvaluationModal';
import { DatasetCatalogModal } from './components/DatasetCatalogModal';
import { DataImportModal } from './components/DataImportModal';
import { ReportBulletinModal } from './components/ReportBulletinModal';
import { UserProfileModal } from './components/UserProfileModal';
import { 
  fetchForecast, fetchMapLayers, fetchCatalog, fetchEvaluation, fetchStations, reverseGeocode 
} from './services/api';
import { ForecastResponse, MapLayersResponse, CatalogItem, GridPoint, Station, UpstreamGauge, UserProfile, WeatherBackgroundCondition } from './types';
import { AlertCircle, Shield } from 'lucide-react';

const PUBLIC_PAGES = ['landing', 'about'];
const PROTECTED_PAGES = [
  'dashboard', 'home', 'weather', 'rain', 'rainfall-forecast', 
  'risk', 'flood-risk', 'map', 'flood-map', 'warnings', 'alerts', 
  'analytics', 'admin', 'profile', 'forecast', 'insights', 'saved'
];
const VALID_PAGES = [...PUBLIC_PAGES, ...PROTECTED_PAGES];

function canonicalizeRoute(raw: string): string {
  let r = raw.replace(/^#\/?/, '').replace(/^\//, '').toLowerCase().trim();
  if (!r || r === '' || r === 'landing') return 'landing';
  if (r === 'home' || r === 'dashboard' || r === 'login' || r === 'register') return 'dashboard';
  if (r === 'rainfall-forecast' || r === 'rain') return 'rain';
  if (r === 'flood-risk' || r === 'risk') return 'risk';
  if (r === 'flood-map' || r === 'map') return 'map';
  if (r === 'alerts' || r === 'warnings') return 'warnings';
  if (r === 'details') return 'weather';
  return r;
}

const DEFAULT_SAVED_LOCATIONS: SavedLocationItem[] = [
  {
    id: 'safdarjung',
    name: 'Safdarjung Observatory',
    admin1: 'Central Delhi',
    country: 'India',
    latitude: 28.5850,
    longitude: 77.2060,
    type: 'IMD Base Station',
  },
  {
    id: 'rampur-sitapur',
    name: 'Rampur Village',
    admin1: 'Sitapur, Uttar Pradesh',
    country: 'India',
    latitude: 27.5684,
    longitude: 80.6829,
    type: 'Rural Village',
  },
  {
    id: 'gurugram-city',
    name: 'Gurugram',
    admin1: 'Haryana',
    country: 'India',
    latitude: 28.4595,
    longitude: 77.0266,
    type: 'District City',
  },
  {
    id: 'noida-city',
    name: 'Noida',
    admin1: 'Gautam Buddha Nagar, UP',
    country: 'India',
    latitude: 28.5355,
    longitude: 77.3910,
    type: 'District City',
  },
];

export default function App() {
  // 1. Theme State (Light / Dark) with localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('weather_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('weather_theme', theme);
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Sidebar Navigation & Collapse State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    } catch {}
    return false;
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem('sidebar_collapsed', String(next)); } catch {}
      return next;
    });
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // User Profile & Preferences State (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('rainshield_user');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      id: 'usr_default',
      name: 'System User',
      email: 'user@delhi-weather.gov.in',
      role: 'admin',
      default_location: 'Safdarjung, New Delhi',
      alert_threshold: 'MODERATE',
      temp_unit: 'C',
      rain_unit: 'mm',
      created_at: new Date().toISOString(),
    };
  });

  // 3. Navigation & Page State (Defaults to 'landing' when opening at /)
  const [activePage, setActivePage] = useState<string>(() => {
    const raw = window.location.hash || window.location.pathname;
    const target = canonicalizeRoute(raw);

    if (target === 'landing') return 'landing';
    if (PUBLIC_PAGES.includes(target) || PROTECTED_PAGES.includes(target)) {
      return target;
    }
    return 'landing';
  });

  const handleNavigate = (page: string) => {
    const target = canonicalizeRoute(page);

    if (target === 'profile') {
      setProfileOpen(true);
      return;
    }

    setActivePage(target);
    window.location.hash = target === 'landing' ? '' : target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    handleNavigate('landing');
  };

  useEffect(() => {
    const onHashChange = () => {
      const target = canonicalizeRoute(window.location.hash);
      if (target === 'profile') {
        setProfileOpen(true);
        return;
      }
      setActivePage(target);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // 4. System & Forecast State
  const [horizon, setHorizon] = useState<number>(24);
  const [systemMode, setSystemMode] = useState<string>('PREDICTION');
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [mapData, setMapData] = useState<MapLayersResponse | null>(null);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [stationsList, setStationsList] = useState<Station[]>([]);
  const [upstreamGauges, setUpstreamGauges] = useState<UpstreamGauge[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<GridPoint | null>(null);

  // Active Map Layer
  const [activeLayer, setActiveLayer] = useState<'susceptibility' | 'elevation' | 'twi' | 'landcover'>('susceptibility');

  // Location State
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('Safdarjung, New Delhi');
  const [locationSource, setLocationSource] = useState<'gps' | 'preset' | 'grid'>('preset');

  // Saved / Bookmarked Locations (stored in localStorage)
  const [savedLocations, setSavedLocations] = useState<SavedLocationItem[]>(() => {
    try {
      const stored = localStorage.getItem('weather_saved_locations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_SAVED_LOCATIONS;
  });

  const isCurrentBookmarked = savedLocations.some((s) => locationName.includes(s.name) || s.name.includes(locationName));

  const toggleBookmarkCurrent = () => {
    if (isCurrentBookmarked) {
      const updated = savedLocations.filter((s) => !locationName.includes(s.name) && !s.name.includes(locationName));
      setSavedLocations(updated);
      try {
        localStorage.setItem('weather_saved_locations', JSON.stringify(updated));
      } catch {}
    } else {
      const coords = activeCoords || { lat: 28.5850, lon: 77.2060 };
      const newItem: SavedLocationItem = {
        id: `loc-${Date.now()}`,
        name: locationName.split(',')[0].trim(),
        admin1: locationName.includes(',') ? locationName.split(',').slice(1).join(',').trim() : undefined,
        country: 'India',
        latitude: coords.lat,
        longitude: coords.lon,
        type: locationSource === 'gps' ? 'GPS Location' : 'Saved Place',
      };
      const updated = [newItem, ...savedLocations];
      setSavedLocations(updated);
      try {
        localStorage.setItem('weather_saved_locations', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleAddSaved = (loc: SavedLocationItem) => {
    if (savedLocations.some((s) => s.id === loc.id || s.name === loc.name)) return;
    const updated = [loc, ...savedLocations];
    setSavedLocations(updated);
    try {
      localStorage.setItem('weather_saved_locations', JSON.stringify(updated));
    } catch {}
  };

  const handleRemoveSaved = (id: string) => {
    const updated = savedLocations.filter((s) => s.id !== id);
    setSavedLocations(updated);
    try {
      localStorage.setItem('weather_saved_locations', JSON.stringify(updated));
    } catch {}
  };

  // Geolocation API State
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Modals
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [bulletinOpen, setBulletinOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);


  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string>('');

  // Load backend data for given horizon and location
  const loadData = async (h: number = horizon, lat?: number, lon?: number, locName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const targetLat = lat !== undefined ? lat : activeCoords?.lat;
      const targetLon = lon !== undefined ? lon : activeCoords?.lon;
      const targetName = locName !== undefined ? locName : locationName;

      const [forecastRes, mapRes, catalogRes, evalRes, stationsRes] = await Promise.all([
        fetchForecast(h, targetLat, targetLon, targetName),
        fetchMapLayers(h),
        fetchCatalog(),
        fetchEvaluation(),
        fetchStations().catch(() => null),
      ]);

      setForecast(forecastRes);
      setMapData(mapRes);
      setCatalog(catalogRes);
      setEvaluation(evalRes);
      setLastSync(forecastRes.issue_time_ist || forecastRes.valid_time_ist);

      // Extract stations list and default station
      const stations = stationsRes?.stations || mapRes?.stations || [];
      setStationsList(stations);
      if (stationsRes?.upstream_gauges) {
        setUpstreamGauges(stationsRes.upstream_gauges);
      }

      if (!selectedStation && stations.length > 0) {
        const baseStation = stations.find((s: Station) => s.station_name.includes('Safdarjung')) || stations[0];
        setSelectedStation(baseStation);
        if (!activeCoords && targetLat === undefined) {
          setActiveCoords({ lat: baseStation.latitude, lon: baseStation.longitude });
          setLocationName(baseStation.station_name);
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Weather data is currently unavailable. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Geolocation Handler with Real Geocoding & Weather Fetch
  const requestCurrentLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoError('Location detection is not supported in this browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setActiveCoords({ lat, lon });
        setLocationSource('gps');
        setGeoLoading(false);
        setGeoError(null);

        // Reverse geocode to resolve readable city or village name
        let resolvedName = `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
        try {
          resolvedName = await reverseGeocode(lat, lon);
        } catch {}
        setLocationName(resolvedName);

        // Find nearest station if within regional perimeter
        if (stationsList.length > 0) {
          let closest = stationsList[0];
          let minDist = Number.MAX_VALUE;
          for (const st of stationsList) {
            const d = (st.latitude - lat) ** 2 + (st.longitude - lon) ** 2;
            if (d < minDist) {
              minDist = d;
              closest = st;
            }
          }
          if (minDist < 0.5) {
            setSelectedStation(closest);
          }
        }

        // Immediately fetch real weather and forecast for user's GPS coordinates
        loadData(horizon, lat, lon, resolvedName);
      },
      (err) => {
        setGeoLoading(false);
        let msg = 'Allow location permission to see weather for your area.';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            msg = 'Allow location permission to see weather for your area. You can also search your village, town, or city above.';
            break;
          case err.POSITION_UNAVAILABLE:
            msg = 'Location information is temporarily unavailable. You can search your village or town above.';
            break;
          case err.TIMEOUT:
            msg = 'Location check took longer than expected. Showing Delhi base observatory.';
            break;
          default:
            msg = 'Allow location to see weather for your area.';
        }
        setGeoError(msg);
      },
      geoOptions
    );
  }, [stationsList, horizon, activeCoords, locationName]);

  useEffect(() => {
    loadData(horizon, activeCoords?.lat, activeCoords?.lon, locationName);
  }, [horizon]);

  // Location selection handler
  const handleSelectLocation = (fullName: string, lat: number, lon: number, admin1?: string) => {
    setLocationName(fullName);
    setActiveCoords({ lat, lon });
    setLocationSource('preset');
    setGeoError(null);

    // If matches a local station, bind it
    const matchedStation = stationsList.find(
      (s) => Math.abs(s.latitude - lat) < 0.04 && Math.abs(s.longitude - lon) < 0.04
    );
    if (matchedStation) {
      setSelectedStation(matchedStation);
    }

    // Immediately fetch real weather and forecast for searched location
    loadData(horizon, lat, lon, fullName);
  };

  const hasActiveWarning = forecast?.prediction?.warning?.level && forecast.prediction.warning.level !== 'GREEN';

  // Dynamic atmospheric weather condition derived strictly from real weather API/backend data
  const weatherCondition: WeatherBackgroundCondition = React.useMemo(() => {
    const rain = forecast?.supporting_evidence?.mean_rain_mm ?? 0;
    const maxRain = forecast?.supporting_evidence?.max_rain_mm ?? 0;
    const warningLevel = forecast?.prediction?.warning?.level;
    const warningCategory = (forecast?.prediction?.warning?.category || '').toUpperCase();
    const humidity = forecast?.supporting_evidence?.relative_humidity_pct ?? 50;
    const visibility = forecast?.supporting_evidence?.visibility_km ?? 10;

    if (warningCategory.includes('THUNDER') || (warningLevel === 'RED' && maxRain > 30)) {
      return 'THUNDERSTORM';
    }
    if (warningLevel === 'RED' || maxRain >= 20 || rain >= 15) {
      return 'HEAVY_RAIN';
    }
    if (rain > 0.5 || maxRain > 2.0 || warningLevel === 'YELLOW' || warningLevel === 'ORANGE') {
      return 'RAIN';
    }
    if (visibility < 3.0 || (humidity > 90 && rain === 0)) {
      return 'FOG';
    }
    if (humidity > 70) {
      return 'CLOUDY';
    }
    return 'CLEAR';
  }, [forecast]);

  const isNight = React.useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6;
  }, []);

  const isPublicPage = activePage === 'landing';

  return (
    <div className="min-h-screen bg-slate-50/20 dark:bg-[#0B0F19]/30 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300 relative">
      {/* Dynamic Realistic Atmospheric Weather Background (placed behind dashboard content) */}
      <WeatherBackground condition={weatherCondition} isNight={isNight} theme={theme} />

      {/* 1. PUBLIC LANDING PAGE (First screen at /) */}
      {activePage === 'landing' && (
        <LandingView
          onNavigateTo={handleNavigate}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {/* 2. FULL USER DASHBOARD (Sidebar + Top Navbar + Modules) */}
      {!isPublicPage && (
        <div className="flex flex-row min-h-screen">
          {/* 1. Professional Left Sidebar (Collapsible & Mobile Drawer) */}
          <Sidebar
            activePage={activePage}
            onNavigateTo={handleNavigate}
            onOpenProfile={() => setProfileOpen(true)}
            onLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebarCollapse}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            hasActiveWarning={Boolean(hasActiveWarning)}
            warningLevel={forecast?.prediction?.warning?.level}
            studyArea={forecast?.study_area || 'Delhi-NCR'}
          />

          {/* 2. Main Content Container */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Header Navigation */}
            <Navbar
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
              activePage={activePage}
              onNavigateTo={handleNavigate}
              onRefresh={() => loadData(horizon)}
              loading={loading}
              studyArea={forecast?.study_area || 'Delhi-NCR'}
              lastUpdated={lastSync}
              hasActiveWarning={Boolean(hasActiveWarning)}
              warningLevel={forecast?.prediction?.warning?.level}
              warningCategory={forecast?.prediction?.warning?.category}
              locationName={locationName}
              locationSource={locationSource}
              onSelectLocation={handleSelectLocation}
              onDetectGPS={requestCurrentLocation}
              geoLoading={geoLoading}
              geoError={geoError}
              isBookmarked={isCurrentBookmarked}
              onToggleBookmark={toggleBookmarkCurrent}
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onOpenBulletin={() => setBulletinOpen(true)}
              currentUser={currentUser}
              onOpenProfile={() => setProfileOpen(true)}
              onLogout={handleLogout}
            />

        {/* Main Content Canvas */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Error Notification Banner if connection failed */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl p-4 text-red-800 dark:text-red-200 flex items-center justify-between text-xs sm:text-sm shadow-xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadData(horizon)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* PAGE 1: Home Dashboard Overview */}
          {(activePage === 'home' || activePage === 'dashboard') && (
            <HomeView
              forecast={forecast}
              mapData={mapData}
              selectedStation={selectedStation}
              locationName={locationName}
              locationSource={locationSource}
              loading={loading}
              horizon={horizon}
              setHorizon={setHorizon}
              onSelectLocation={handleSelectLocation}
              onDetectGPS={requestCurrentLocation}
              geoLoading={geoLoading}
              geoError={geoError}
              isBookmarked={isCurrentBookmarked}
              onToggleBookmark={toggleBookmarkCurrent}
              onNavigateTo={handleNavigate}
              activeLayer={activeLayer}
              setActiveLayer={setActiveLayer}
              selectedPoint={selectedPoint}
              setSelectedPoint={setSelectedPoint}
              activeCoords={activeCoords}
              setActiveCoords={setActiveCoords}
            />
          )}

          {/* PAGE 2: Current Weather */}
          {activePage === 'weather' && (
            <CurrentWeatherView
              forecast={forecast}
              selectedStation={selectedStation}
              locationName={locationName}
              loading={loading}
              onNavigateTo={handleNavigate}
            />
          )}

          {/* PAGE 3: Rain Forecast */}
          {activePage === 'rain' && (
            <RainForecastView
              forecast={forecast}
              locationName={locationName}
              loading={loading}
              horizon={horizon}
              onNavigateTo={handleNavigate}
            />
          )}

          {/* Module 4: Flood Risk & Map (Combined) */}
          {(activePage === 'risk' || activePage === 'map') && (
            <FloodRiskMapView
              forecast={forecast}
              mapData={mapData}
              locationName={locationName}
              setLocationName={setLocationName}
              locationSource={locationSource}
              setLocationSource={setLocationSource}
              loading={loading}
              horizon={horizon}
              setHorizon={setHorizon}
              activeLayer={activeLayer}
              setActiveLayer={setActiveLayer}
              selectedPoint={selectedPoint}
              setSelectedPoint={setSelectedPoint}
              activeCoords={activeCoords}
              setActiveCoords={setActiveCoords}
              onDetectGPS={requestCurrentLocation}
              geoLoading={geoLoading}
              geoError={geoError}
              onNavigateTo={handleNavigate}
            />
          )}

          {/* PAGE 5: Early Warnings */}
          {activePage === 'warnings' && (
            <EarlyWarningsView
              forecast={forecast}
              mapData={mapData}
              locationName={locationName}
              loading={loading}
              horizon={horizon}
              setHorizon={setHorizon}
              systemMode={systemMode}
              onNavigateTo={handleNavigate}
            />
          )}

          {/* Module 7: Analytics & Historical Data */}
          {activePage === 'analytics' && (
            <AnalyticsView
              forecast={forecast}
              locationName={locationName}
              loading={loading}
              onNavigateTo={handleNavigate}
            />
          )}

          {/* Module 8: Data & Admin */}
          {activePage === 'admin' && (
            <AdminView
              currentUser={currentUser}
              onOpenProfile={() => setProfileOpen(true)}
              catalog={catalog}
              stationsList={stationsList}
              forecast={forecast}
              onNavigateTo={handleNavigate}
            />
          )}

          {/* PAGE 6: 7-Day Forecast */}
          {activePage === 'forecast' && (
            <ForecastView
              forecast={forecast}
              locationName={locationName}
              loading={loading}
              onNavigateTo={handleNavigate}
            />
          )}

          {/* PAGE 7: Data Insights & Research Telemetry */}
          {activePage === 'insights' && (
            <DataInsightsView
              forecast={forecast}
              mapData={mapData}
              catalog={catalog}
              evaluation={evaluation}
              stationsList={stationsList}
              locationName={locationName}
              loading={loading}
              horizon={horizon}
              setHorizon={setHorizon}
              systemMode={systemMode}
              setSystemMode={setSystemMode}
              onOpenEvaluation={() => setEvaluationOpen(true)}
              onOpenCatalog={() => setCatalogOpen(true)}
              onOpenImport={() => setImportOpen(true)}
              onOpenBulletin={() => setBulletinOpen(true)}
              onRefresh={() => loadData(horizon)}
              onNavigateTo={handleNavigate}
              currentUser={currentUser}
            />
          )}

          {/* PAGE 8: Saved Locations & Search */}
          {activePage === 'saved' && (
            <SavedLocationsView
              currentLocationName={locationName}
              locationSource={locationSource}
              savedList={savedLocations}
              onSelectLocation={handleSelectLocation}
              onRemoveSaved={handleRemoveSaved}
              onAddSaved={handleAddSaved}
              onDetectGPS={requestCurrentLocation}
              geoLoading={geoLoading}
              geoError={geoError}
              onNavigateTo={handleNavigate}
            />
          )}

          {/* PAGE 9: About & Citizen Guide */}
          {activePage === 'about' && (
            <AboutHelpView
              onNavigateTo={handleNavigate}
            />
          )}
        </main>

        {/* Clean Production Footer */}
        <footer className="bg-white dark:bg-[#080C14] border-t border-slate-200 dark:border-slate-800/80 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center sm:justify-start gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <img src="/logo.png" alt="Logo" className="w-5 h-5 rounded-md object-contain" />
                <span>Rainfall &amp; Inundation AI</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Heavy Rainfall Early Warning &amp; Inundation System
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © 2026 Rainfall &amp; Inundation AI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )}

  {/* Modals for Research & Ingestion */}
      <EvaluationModal
        isOpen={evaluationOpen}
        onClose={() => setEvaluationOpen(false)}
        evaluationData={evaluation}
      />

      <DatasetCatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        catalog={catalog}
      />

      <DataImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onUploadSuccess={() => loadData(horizon)}
      />

      <ReportBulletinModal
        isOpen={bulletinOpen}
        onClose={() => setBulletinOpen(false)}
        horizon={horizon}
      />

      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        currentUser={currentUser}
        onUserChange={(user) => {
          setCurrentUser(user);
          if (user?.default_location) {
            setLocationName(user.default_location);
          }
        }}
      />
    </div>
  );
}
