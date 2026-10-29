import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Sun, Moon, RefreshCw, MapPin, Navigation, 
  Search, ShieldAlert, X, Check, Loader2, Star, Download,
  ExternalLink, Bell, User, LogOut
} from 'lucide-react';
import { LocationResult, UserProfile } from '../types';
import { searchLocations } from '../services/api';

// Curated list of Indian villages, towns, and districts in the region for instant zero-latency search
const LOCAL_VILLAGES_AND_TOWNS: LocationResult[] = [
  { name: 'Safdarjung', admin1: 'Central Delhi', country: 'India', latitude: 28.5850, longitude: 77.2060, elevation_m: 216, type: 'IMD Base Station' },
  { name: 'Rampur Village', admin1: 'Sitapur, Uttar Pradesh', country: 'India', latitude: 27.5684, longitude: 80.6829, elevation_m: 138, type: 'Rural Village' },
  { name: 'Palam Airport (IGI)', admin1: 'South-West Delhi', country: 'India', latitude: 28.5630, longitude: 77.1200, elevation_m: 237, type: 'Airport Met' },
  { name: 'Najafgarh Village & Rural Basin', admin1: 'West Delhi', country: 'India', latitude: 28.6100, longitude: 76.9850, elevation_m: 213, type: 'Rural Town / AWS' },
  { name: 'Narela Village & Grain Mandi', admin1: 'North Delhi', country: 'India', latitude: 28.8525, longitude: 77.0911, elevation_m: 215, type: 'Town & Market' },
  { name: 'Bawana Rural District', admin1: 'North-West Delhi', country: 'India', latitude: 28.7981, longitude: 77.0322, elevation_m: 218, type: 'Rural Town' },
  { name: 'Alipur Town', admin1: 'North Delhi', country: 'India', latitude: 28.7980, longitude: 77.1340, elevation_m: 214, type: 'Town & Highway' },
  { name: 'Mundka Village', admin1: 'West Delhi', country: 'India', latitude: 28.6811, longitude: 77.0278, elevation_m: 216, type: 'Village / Metro' },
  { name: 'Shahdara & Seelampur', admin1: 'East Delhi', country: 'India', latitude: 28.6739, longitude: 77.2885, elevation_m: 210, type: 'District' },
  { name: 'Ayanagar Village', admin1: 'South Delhi', country: 'India', latitude: 28.4750, longitude: 77.1330, elevation_m: 268, type: 'Village AWS' },
  { name: 'Delhi Ridge', admin1: 'North Delhi', country: 'India', latitude: 28.6750, longitude: 77.2150, elevation_m: 242, type: 'Ridge Observatory' },
  { name: 'Lodhi Road', admin1: 'South Delhi', country: 'India', latitude: 28.5910, longitude: 77.2270, elevation_m: 211, type: 'Urban AWS' },
  { name: 'Mehrauli Town', admin1: 'South Delhi', country: 'India', latitude: 28.5175, longitude: 77.1852, elevation_m: 245, type: 'Heritage Town' },
  { name: 'Gurugram', admin1: 'Haryana', country: 'India', latitude: 28.4595, longitude: 77.0266, elevation_m: 220, type: 'District City' },
  { name: 'Faridabad', admin1: 'Haryana', country: 'India', latitude: 28.4089, longitude: 77.3178, elevation_m: 205, type: 'District City' },
  { name: 'Noida', admin1: 'Gautam Buddha Nagar, UP', country: 'India', latitude: 28.5355, longitude: 77.3910, elevation_m: 200, type: 'District City' },
  { name: 'Ghaziabad', admin1: 'Uttar Pradesh', country: 'India', latitude: 28.6692, longitude: 77.4538, elevation_m: 214, type: 'District City' },
  { name: 'Hathnikund Barrage', admin1: 'Yamunanagar, Haryana', country: 'India', latitude: 30.3175, longitude: 77.5833, elevation_m: 320, type: 'Upstream River Gauge' },
  { name: 'Yamuna Old Railway Bridge', admin1: 'Central Delhi', country: 'India', latitude: 28.6631, longitude: 77.2482, elevation_m: 204, type: 'River Flood Gauge' },
];

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  activePage: string;
  onNavigateTo: (page: string) => void;
  onRefresh: () => void;
  loading: boolean;
  studyArea: string;
  lastUpdated?: string;
  hasActiveWarning?: boolean;
  warningLevel?: string;
  warningCategory?: string;
  locationName: string;
  locationSource: 'gps' | 'preset' | 'grid';
  onSelectLocation: (name: string, lat: number, lon: number, admin1?: string) => void;
  onDetectGPS: () => void;
  geoLoading: boolean;
  geoError: string | null;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenBulletin?: () => void;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  activePage,
  onNavigateTo,
  onRefresh,
  loading,
  studyArea,
  lastUpdated,
  hasActiveWarning,
  warningLevel = 'GREEN',
  warningCategory,
  locationName,
  locationSource,
  onSelectLocation,
  onDetectGPS,
  geoLoading,
  geoError,
  isBookmarked,
  onToggleBookmark,
  theme,
  onToggleTheme,
  onOpenBulletin,
  currentUser,
  onOpenProfile,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic: immediate local match + debounced global geocoding
  useEffect(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) {
      setSearchResults(LOCAL_VILLAGES_AND_TOWNS.slice(0, 7));
      setSearching(false);
      return;
    }

    const localMatches = LOCAL_VILLAGES_AND_TOWNS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(cleanQuery) ||
        (loc.admin1 && loc.admin1.toLowerCase().includes(cleanQuery))
    );
    setSearchResults(localMatches);

    if (cleanQuery.length >= 2) {
      setSearching(true);
      const timer = setTimeout(async () => {
        const remoteResults = await searchLocations(cleanQuery);
        const combined = [...localMatches];
        const seenCoords = new Set(localMatches.map((m) => `${m.latitude.toFixed(2)},${m.longitude.toFixed(2)}`));

        for (const item of remoteResults) {
          const coordKey = `${item.latitude.toFixed(2)},${item.longitude.toFixed(2)}`;
          if (!seenCoords.has(coordKey)) {
            seenCoords.add(coordKey);
            combined.push(item);
          }
        }

        setSearchResults(combined.slice(0, 8));
        setSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleSelect = (item: LocationResult) => {
    const fullName = item.admin1 ? `${item.name}, ${item.admin1}` : item.name;
    onSelectLocation(fullName, item.latitude, item.longitude, item.admin1);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const getAlertBadgeStyles = (level?: string) => {
    switch (level) {
      case 'RED':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60';
      case 'ORANGE':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
      case 'YELLOW':
        return 'bg-amber-400/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/60';
      default:
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 max-w-[1600px] mx-auto">
        {/* Left Side: Mobile Menu Button, Brand Logo & Project Name, Location Overview */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Official Brand Logo & Project Name */}
          <button
            onClick={() => onNavigateTo('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none group rounded-xl hover:opacity-95 transition"
            title="Rainfall & Inundation AI Dashboard"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white dark:bg-[#131C2E] p-0.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-center shrink-0 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors">
              <img
                src="/logo.png"
                alt="Rainfall & Inundation AI Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm md:text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                Rainfall &amp; Inundation AI
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">
                Predict • Prepare • Protect
              </span>
            </div>
          </button>

          {/* Current Active Location Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 text-xs">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[140px] truncate" title={locationName}>
              {locationName.split(',')[0]}
            </span>
            {locationSource === 'gps' && (
              <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                GPS
              </span>
            )}
          </div>
        </div>

        {/* Center: Search Bar & Use My Location Button */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-auto flex items-center gap-2">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search village, town, or city..."
              className="w-full h-9 pl-9 pr-8 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-[#131C2E] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition"
              aria-label="Search village, town or city"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults(LOCAL_VILLAGES_AND_TOWNS.slice(0, 7));
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : searching ? (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
            ) : null}
          </div>

          {/* Use My Location Button */}
          <button
            onClick={onDetectGPS}
            disabled={geoLoading}
            className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#131C2E] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-medium transition flex items-center gap-1.5 shrink-0 active:scale-[0.98]"
            title="Use current GPS location"
          >
            <Navigation className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${geoLoading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{geoLoading ? 'Locating...' : 'My Location'}</span>
          </button>

          {/* Bookmark Button */}
          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`h-9 px-2.5 rounded-xl border text-xs transition flex items-center gap-1 shrink-0 ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                  : 'bg-slate-100 dark:bg-[#131C2E] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? 'Location saved' : 'Save this location'}
            >
              <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          )}

          {/* Search Results Dropdown Popover */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0B0F19] text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between px-3">
                <span>{searchQuery ? 'Matching Locations' : 'Preset Stations & Villages'}</span>
                {searching && <span className="text-blue-500">Searching...</span>}
              </div>

              <div className="p-1 divide-y divide-slate-100 dark:divide-slate-800/60">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => {
                    const isCurrent = locationName.includes(item.name);
                    return (
                      <button
                        key={`${item.name}-${item.latitude}-${idx}`}
                        onClick={() => handleSelect(item)}
                        className={`w-full p-2.5 rounded-lg text-left transition flex items-center justify-between text-xs ${
                          isCurrent
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <div className="truncate">
                            <span className="font-medium text-slate-900 dark:text-slate-100 block">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate">
                              {[item.admin1, item.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </div>
                        {item.type && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                            {item.type}
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No results found for "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Status, Alert Badge, Refresh, Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* IMD Alert Pill */}
          <button
            onClick={() => onNavigateTo('warnings')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${getAlertBadgeStyles(warningLevel)}`}
            title={warningCategory || `IMD ${warningLevel} Alert`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">IMD {warningLevel}</span>
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            title="Refresh weather data"
            aria-label="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle light or dark theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Export Bulletin Button */}
          {onOpenBulletin && (
            <button
              onClick={onOpenBulletin}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition shadow-xs shrink-0"
              title="Export meteorological advisory bulletin"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Bulletin</span>
            </button>
          )}

          {/* User Profile Button */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition shrink-0 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100/50 dark:hover:bg-blue-900/80"
              title={currentUser ? `User: ${currentUser.name} (${currentUser.role})` : 'User Profile & Preferences'}
              aria-label="User Account"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser ? currentUser.name[0].toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <span className="hidden sm:inline truncate max-w-[100px]">
                {currentUser ? currentUser.name.split(' ')[0] : 'Profile'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Geolocation Error Alert if any */}
      {geoError && (
        <div className="bg-red-50 dark:bg-red-950/60 border-t border-red-200 dark:border-red-900/60 px-4 py-1.5 text-xs text-red-700 dark:text-red-300 flex items-center justify-between">
          <span>{geoError}</span>
          <button onClick={onDetectGPS} className="font-semibold underline ml-2">
            Retry GPS
          </button>
        </div>
      )}
    </header>
  );
};
