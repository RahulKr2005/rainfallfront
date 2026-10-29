import React from 'react';
import { MapViewer } from '../components/MapViewer';
import { ForecastResponse, MapLayersResponse, GridPoint } from '../types';
import { 
  ArrowLeft, MapPin, Compass, Layers, Info, ShieldAlert, 
  AlertTriangle, Droplets, Waves, CheckCircle2, ShieldCheck, 
  Mountain, Activity, Bell 
} from 'lucide-react';

interface FloodRiskMapViewProps {
  forecast: ForecastResponse | null;
  mapData: MapLayersResponse | null;
  locationName: string;
  setLocationName: (name: string) => void;
  locationSource: 'gps' | 'preset' | 'grid';
  setLocationSource: (source: 'gps' | 'preset' | 'grid') => void;
  loading: boolean;
  horizon: number;
  setHorizon: (h: number) => void;
  activeLayer: 'susceptibility' | 'elevation' | 'twi' | 'landcover';
  setActiveLayer: (layer: 'susceptibility' | 'elevation' | 'twi' | 'landcover') => void;
  selectedPoint: GridPoint | null;
  setSelectedPoint: (point: GridPoint | null) => void;
  activeCoords: { lat: number; lon: number } | null;
  setActiveCoords: (coords: { lat: number; lon: number } | null) => void;
  onDetectGPS: () => void;
  geoLoading: boolean;
  geoError: string | null;
  onNavigateTo: (page: string) => void;
}

export const FloodRiskMapView: React.FC<FloodRiskMapViewProps> = ({
  forecast,
  mapData,
  locationName,
  setLocationName,
  locationSource,
  setLocationSource,
  loading,
  horizon,
  setHorizon,
  activeLayer,
  setActiveLayer,
  selectedPoint,
  setSelectedPoint,
  activeCoords,
  setActiveCoords,
  onDetectGPS,
  geoLoading,
  geoError,
  onNavigateTo,
}) => {
  if (loading || !forecast) {
    return (
      <div className="w-full py-8 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
      </div>
    );
  }

  const { prediction, supporting_evidence, valid_time_ist } = forecast;
  const inundationArea = mapData?.summary?.estimated_inundated_area_sqkm ?? 0;
  const meanTfsi = mapData?.summary?.mean_susceptibility_tfsi ?? 0.28;
  const maxTfsi = mapData?.summary?.max_susceptibility_tfsi ?? 0.45;
  const riverDischarge = supporting_evidence.upstream_discharge_cusecs ?? 85400;
  const riverAlert = supporting_evidence.upstream_alert ?? 'NORMAL';

  // Determine risk level based on model evidence and warning levels
  let riskLevel = 'LOW RISK';
  let riskBadgeColor = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';
  let riskBarWidth = '25%';
  let riskBarColor = 'bg-emerald-500';
  let riskAdvice = 'Natural drainage is functioning normally. Infiltration and stormwater runoff are within designed channel capacity.';
  let severityCode = 'INFO';

  if (inundationArea > 15 || meanTfsi > 0.65 || prediction.warning.level === 'RED') {
    riskLevel = 'SEVERE RISK';
    riskBadgeColor = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60';
    riskBarWidth = '100%';
    riskBarColor = 'bg-red-600';
    riskAdvice = 'Immediate precaution: Significant submergence in low-lying corridors, underpasses, and riverfront settlements. Water accumulation exceeds local drainage evacuation rates.';
    severityCode = 'CRITICAL';
  } else if (inundationArea > 5 || meanTfsi > 0.45 || prediction.warning.level === 'ORANGE') {
    riskLevel = 'HIGH RISK';
    riskBadgeColor = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
    riskBarWidth = '75%';
    riskBarColor = 'bg-orange-500';
    riskAdvice = 'Waterlogging anticipated in underpasses, natural depressions, and poorly drained roads. Commuters and vulnerable settlements should exercise caution.';
    severityCode = 'HIGH';
  } else if (inundationArea > 1 || meanTfsi > 0.35 || prediction.warning.level === 'YELLOW') {
    riskLevel = 'MODERATE RISK';
    riskBadgeColor = 'bg-amber-400/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/60';
    riskBarWidth = '50%';
    riskBarColor = 'bg-amber-500';
    riskAdvice = 'Localized rainwater ponding possible on secondary roads and construction corridors. Storm drains are being actively monitored.';
    severityCode = 'MODERATE';
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={() => onNavigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Module 4: Flood Risk & Map
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {locationName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            Flood Risk Assessment & Interactive Map
          </h1>
        </div>

        {/* Lead Horizon Selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#131C2E] p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
          {[6, 12, 24, 48].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition ${
                horizon === h
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              +{h}h Lead
            </button>
          ))}
        </div>
      </div>

      {/* TOP SECTION: Current Flood Risk Metrics */}
      <section className="bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-5 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${riskBadgeColor}`}>
                {riskLevel}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Severity: {severityCode}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 font-mono">
                Valid: {valid_time_ist}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Current Flood Risk: {riskLevel}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {riskAdvice}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTo('warnings')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Safety Instructions</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Flood Risk Level</span>
            <span className="font-bold text-slate-900 dark:text-white">{riskLevel} ({riskBarWidth})</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${riskBarColor}`}
              style={{ width: riskBarWidth }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Low Risk (0–25%)</span>
            <span className="text-amber-500 font-medium">Moderate (26–50%)</span>
            <span className="text-orange-500 font-medium">High Risk (51–75%)</span>
            <span className="text-red-500 font-medium">Severe Risk (76–100%)</span>
          </div>
        </div>

        {/* 4 Core Hydrological Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
              Projected Inundation Area
            </span>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {inundationArea > 0 ? `${inundationArea.toFixed(1)} km²` : '0.0 km²'}
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">
              Over 100m grid domain
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
              Mean Susceptibility (TFSI)
            </span>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {(meanTfsi * 100).toFixed(1)}%
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">
              Peak cell: {(maxTfsi * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
              Upstream River Inflow
            </span>
            <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {riverDischarge.toLocaleString()} <span className="text-xs font-normal text-slate-400">cfs</span>
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">
              Status: {riverAlert}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
              Expected Rainfall
            </span>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {prediction.predicted_accum_mm.toFixed(1)} <span className="text-xs font-normal text-slate-400">mm</span>
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">
              +{horizon}h prediction
            </span>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION: Existing Leaflet Map (Preserved 100%) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Geospatial Map
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Interactive Flood & Drainage Map
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-[#131C2E] px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
              {mapData?.summary?.estimated_inundated_area_sqkm
                ? `${mapData.summary.estimated_inundated_area_sqkm.toFixed(1)} km² projected inundation`
                : 'Active Monitoring Grid'}
            </span>
          </div>
        </div>

        {/* Existing Map Component (Preserved 100%) */}
        <MapViewer
          mapData={mapData}
          loading={loading}
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          selectedPoint={selectedPoint}
          setSelectedPoint={setSelectedPoint}
          activeCoords={activeCoords}
          setActiveCoords={setActiveCoords}
          locationName={locationName}
          setLocationName={setLocationName}
          locationSource={locationSource}
          setLocationSource={setLocationSource}
          onDetectGPS={onDetectGPS}
          geoLoading={geoLoading}
          geoError={geoError}
        />
      </section>

      {/* Layer Explanations for City and Village Users */}
      <section className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            How to Read the Map Layers
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <Mountain className="w-4 h-4 text-emerald-600" />
              <span>Elevation (DEM)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Ground height above sea level. Rainwater naturally flows downhill into low-lying areas.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>Wetness Index (TWI)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Calculates where runoff accumulates based on terrain slope and surrounding drainage basin.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Flood Risk (TFSI)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Overall flood susceptibility combining slope, soil, rainfall accumulation, and river discharge.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Land Use / Concrete</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Concrete and paved surfaces prevent rainwater absorption, leading to fast waterlogging.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
