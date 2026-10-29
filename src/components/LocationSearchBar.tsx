import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Check, Loader2, Compass, Star } from 'lucide-react';
import { LocationResult } from '../types';
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

interface LocationSearchBarProps {
  currentLocationName: string;
  locationSource: 'gps' | 'preset' | 'grid';
  onSelectLocation: (name: string, lat: number, lon: number, admin1?: string) => void;
  onDetectGPS: () => void;
  geoLoading: boolean;
  geoError: string | null;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  currentLocationName,
  locationSource,
  onSelectLocation,
  onDetectGPS,
  geoLoading,
  geoError,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Search logic: immediate local match + debounced global geocoding
  useEffect(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      setSearchResults(LOCAL_VILLAGES_AND_TOWNS.slice(0, 8));
      setSearching(false);
      return;
    }

    // Immediate local search
    const localMatches = LOCAL_VILLAGES_AND_TOWNS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(cleanQuery) ||
        (loc.admin1 && loc.admin1.toLowerCase().includes(cleanQuery))
    );
    setSearchResults(localMatches);

    // Debounced API search for external villages/towns
    if (cleanQuery.length >= 2) {
      setSearching(true);
      const timer = setTimeout(async () => {
        const remoteResults = await searchLocations(cleanQuery);
        // Combine unique by latitude and longitude
        const combined = [...localMatches];
        const seenCoords = new Set(localMatches.map((m) => `${m.latitude.toFixed(2)},${m.longitude.toFixed(2)}`));

        for (const item of remoteResults) {
          const coordKey = `${item.latitude.toFixed(2)},${item.longitude.toFixed(2)}`;
          if (!seenCoords.has(coordKey)) {
            seenCoords.add(coordKey);
            combined.push(item);
          }
        }

        setSearchResults(combined.slice(0, 10));
        setSearching(false);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [query]);

  const handleSelect = (item: LocationResult) => {
    const fullName = item.admin1 ? `${item.name}, ${item.admin1}` : item.name;
    onSelectLocation(fullName, item.latitude, item.longitude, item.admin1);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-2">
      {/* Top Location Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Container */}
        <div className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search village, town or city..."
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition shadow-xs"
              aria-label="Search village, town, or city"
            />
            {query ? (
              <button
                onClick={() => {
                  setQuery('');
                  setSearchResults(LOCAL_VILLAGES_AND_TOWNS.slice(0, 8));
                }}
                className="p-1.5 absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : searching ? (
              <div className="absolute right-3.5 text-blue-600 dark:text-blue-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : null}
          </div>
        </div>

        {/* GPS Button ("Use My Location") */}
        <button
          onClick={onDetectGPS}
          disabled={geoLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium transition shadow-xs shrink-0 active:scale-[0.99]"
          title="Allow location to see weather for your area"
        >
          <Navigation className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${geoLoading ? 'animate-spin' : ''}`} />
          <span>{geoLoading ? 'Locating...' : 'Use My Location'}</span>
        </button>
      </div>

      {/* Geolocation Notice / Error message if any */}
      {geoError && (
        <div className="text-xs text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-xl px-4 py-2 flex items-center justify-between">
          <span>{geoError}</span>
          <button
            onClick={onDetectGPS}
            className="text-rose-900 dark:text-rose-200 font-semibold underline hover:no-underline ml-2"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Active Location Display Subtitle + Bookmark Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-slate-400 dark:text-slate-500 shrink-0">Current Area:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-md" title={currentLocationName}>
              {currentLocationName}
            </span>
          </span>
          {locationSource === 'gps' && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-mono text-[10px] font-semibold border border-blue-200 dark:border-blue-800/60 shrink-0">
              Live GPS
            </span>
          )}
        </div>

        {onToggleBookmark && (
          <button
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition shrink-0 ${
              isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 font-medium'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={isBookmarked ? 'Remove from saved locations' : 'Save this location for 1-click access'}
          >
            <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
            <span>{isBookmarked ? 'Saved Location' : 'Save Location'}</span>
          </button>
        )}
      </div>

      {/* Search Results Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between px-3">
            <span>{query ? 'Matching Settlements' : 'Nearby Towns & Observatories'}</span>
            {searching && <span className="text-blue-600 dark:text-blue-400">Searching...</span>}
          </div>

          <div className="p-1 divide-y divide-slate-100 dark:divide-slate-800">
            {searchResults.length > 0 ? (
              searchResults.map((item, idx) => {
                const isCurrent = currentLocationName.includes(item.name);
                return (
                  <button
                    key={`${item.name}-${item.latitude}-${idx}`}
                    onClick={() => handleSelect(item)}
                    className={`w-full p-2.5 rounded-lg text-left transition flex items-center justify-between ${
                      isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</span>
                          {item.type && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                              {item.type}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">
                          {[item.admin1, item.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                <p className="font-medium text-slate-700 dark:text-slate-300">No location found matching "{query}"</p>
                <p className="text-[11px] mt-1 text-slate-400">
                  Try checking the spelling or search by district/state name.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
