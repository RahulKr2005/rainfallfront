import React from 'react';
import { LocationSearchBar } from '../components/LocationSearchBar';
import { 
  MapPin, Star, Trash2, ArrowLeft, Navigation, Check, 
  Building2, Home, Landmark, Compass, Plus 
} from 'lucide-react';

export interface SavedLocationItem {
  id: string;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  type?: string;
  addedAt?: string;
}

interface SavedLocationsViewProps {
  currentLocationName: string;
  locationSource: 'gps' | 'preset' | 'grid';
  savedList: SavedLocationItem[];
  onSelectLocation: (name: string, lat: number, lon: number, admin1?: string) => void;
  onRemoveSaved: (id: string) => void;
  onAddSaved: (loc: SavedLocationItem) => void;
  onDetectGPS: () => void;
  geoLoading: boolean;
  geoError: string | null;
  onNavigateTo: (page: string) => void;
}

// Curated settlements representing villages, towns, and cities
const PRESET_VILLAGES_AND_CITIES: SavedLocationItem[] = [
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
    id: 'safdarjung',
    name: 'Safdarjung Observatory',
    admin1: 'Central Delhi',
    country: 'India',
    latitude: 28.5850,
    longitude: 77.2060,
    type: 'IMD Base Station',
  },
  {
    id: 'narela-village',
    name: 'Narela Village & Grain Mandi',
    admin1: 'North Delhi',
    country: 'India',
    latitude: 28.8525,
    longitude: 77.0911,
    type: 'Town & Market',
  },
  {
    id: 'najafgarh-rural',
    name: 'Najafgarh Rural Basin',
    admin1: 'West Delhi',
    country: 'India',
    latitude: 28.6100,
    longitude: 76.9850,
    type: 'Rural AWS',
  },
  {
    id: 'bawana-rural',
    name: 'Bawana Rural District',
    admin1: 'North-West Delhi',
    country: 'India',
    latitude: 28.7981,
    longitude: 77.0322,
    type: 'Rural Town',
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
  {
    id: 'faridabad-city',
    name: 'Faridabad',
    admin1: 'Haryana',
    country: 'India',
    latitude: 28.4089,
    longitude: 77.3178,
    type: 'District City',
  },
];

export const SavedLocationsView: React.FC<SavedLocationsViewProps> = ({
  currentLocationName,
  locationSource,
  savedList,
  onSelectLocation,
  onRemoveSaved,
  onAddSaved,
  onDetectGPS,
  geoLoading,
  geoError,
  onNavigateTo,
}) => {
  const handleChoose = (loc: { name: string; admin1?: string; latitude: number; longitude: number }) => {
    const fullName = loc.admin1 ? `${loc.name}, ${loc.admin1}` : loc.name;
    onSelectLocation(fullName, loc.latitude, loc.longitude, loc.admin1);
    onNavigateTo('home');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={() => onNavigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
              Location Management
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Villages, Towns & Cities
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Search & Saved Locations
          </h1>
        </div>
      </div>

      {/* 1. Universal Search Input */}
      <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium block">
          Search Any Village, Tehsil, Town or City
        </span>
        <LocationSearchBar
          currentLocationName={currentLocationName}
          locationSource={locationSource}
          onSelectLocation={(name, lat, lon, admin1) => {
            onSelectLocation(name, lat, lon, admin1);
            onNavigateTo('home');
          }}
          onDetectGPS={onDetectGPS}
          geoLoading={geoLoading}
          geoError={geoError}
        />
      </div>

      {/* 2. User's Pinned / Saved Locations Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
              Personal Bookmarks
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Your Saved Locations</span>
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {savedList.length} saved
          </span>
        </div>

        {savedList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {savedList.map((item) => {
              const isCurrent = currentLocationName.includes(item.name);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-blue-50/70 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700/60 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => handleChoose(item)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shrink-0">
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </span>
                        {item.type && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 font-mono">
                            {item.type}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    {isCurrent ? (
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                        <Check className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleChoose(item)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                      >
                        Select
                      </button>
                    )}

                    <button
                      onClick={() => onRemoveSaved(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Remove from saved locations"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40 space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No saved locations yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              When viewing weather for your home village or work city, click <strong className="text-slate-800 dark:text-slate-200">Save Location</strong> to pin it here for instant 1-click access.
            </p>
          </div>
        )}
      </section>

      {/* 3. Fast Presets (Villages & Regional Hubs) */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
              Instant Weather Presets
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Popular Regional Settlements & Base Observatories
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Real-time data sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PRESET_VILLAGES_AND_CITIES.map((loc) => {
            const isCurrent = currentLocationName.includes(loc.name);
            const isAlreadySaved = savedList.some((s) => s.name === loc.name);

            return (
              <div
                key={loc.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {loc.type}
                    </span>
                    {!isAlreadySaved && (
                      <button
                        onClick={() => onAddSaved(loc)}
                        className="text-slate-400 hover:text-amber-500 dark:text-slate-500 dark:hover:text-amber-400 transition"
                        title="Add to saved locations"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-2 truncate" title={loc.name}>
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate" title={loc.admin1}>
                    {loc.admin1}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E
                  </span>
                  {isCurrent ? (
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => handleChoose(loc)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 rounded-lg transition"
                    >
                      Check Weather
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
