import React, { useState, useMemo } from 'react';
import { 
  ForecastResponse, Station, MapLayersResponse, GridPoint 
} from '../types';
import { MapViewer } from '../components/MapViewer';
import { getHumanRainSummary, getHumanComfortSummary } from '../utils/weatherNarrative';
import { 
  CloudRain, Umbrella, CheckCircle2, AlertTriangle, ShieldAlert, 
  ArrowRight, Compass, Calendar, Wind, Activity, Layers, Droplets, 
  MapPin, Eye, Gauge, Waves, Thermometer, ShieldCheck, Clock,
  TrendingUp, ExternalLink, ArrowUpRight, Check
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, ReferenceLine 
} from 'recharts';

interface HomeViewProps {
  forecast: ForecastResponse | null;
  mapData: MapLayersResponse | null;
  selectedStation: Station | null;
  locationName: string;
  locationSource: 'gps' | 'preset' | 'grid';
  loading: boolean;
  horizon: number;
  setHorizon?: (h: number) => void;
  onSelectLocation: (name: string, lat: number, lon: number, admin1?: string) => void;
  onDetectGPS: () => void;
  geoLoading: boolean;
  geoError: string | null;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onNavigateTo: (page: string) => void;
  activeLayer: 'susceptibility' | 'elevation' | 'twi' | 'landcover';
  setActiveLayer: (layer: 'susceptibility' | 'elevation' | 'twi' | 'landcover') => void;
  selectedPoint: GridPoint | null;
  setSelectedPoint: (point: GridPoint | null) => void;
  activeCoords: { lat: number; lon: number } | null;
  setActiveCoords: (coords: { lat: number; lon: number } | null) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  forecast,
  mapData,
  selectedStation,
  locationName,
  locationSource,
  loading,
  horizon,
  setHorizon,
  onSelectLocation,
  onDetectGPS,
  geoLoading,
  geoError,
  isBookmarked,
  onToggleBookmark,
  onNavigateTo,
  activeLayer,
  setActiveLayer,
  selectedPoint,
  setSelectedPoint,
  activeCoords,
  setActiveCoords,
}) => {
  const [forecastRangeTab, setForecastRangeTab] = useState<'today' | '24h' | '3days' | '7days'>('today');

  // Skeleton Loading State
  if (loading || !forecast) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Hero Skeleton */}
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
        {/* Weather Cards Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
        {/* Risk & Map Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="lg:col-span-7 h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const { prediction, supporting_evidence, daily_forecast } = forecast;
  const currentTemp = selectedStation?.temperature_c ?? supporting_evidence.temperature_c ?? 31.0;
  const feelsLike = supporting_evidence.feels_like_c ?? (currentTemp + 4.2);
  const humidity = selectedStation?.humidity_pct ?? supporting_evidence.relative_humidity_pct ?? 78;
  const windSpeed = supporting_evidence.wind_speed_kmh ?? 14;
  const windDirection = supporting_evidence.wind_direction_cardinal || 'ESE';
  const pressure = supporting_evidence.pressure_hpa ?? 1004.2;
  const visibility = supporting_evidence.visibility_km ?? 6.0;
  const riverDischarge = supporting_evidence.upstream_discharge_cusecs ?? 85400;
  const riverAlert = supporting_evidence.upstream_alert ?? 'NORMAL';

  const todayDaily = daily_forecast?.[0];
  const tomorrowDaily = daily_forecast?.[1];
  const maxTemp = todayDaily ? Math.round(todayDaily.temp_max_c) : Math.round(currentTemp + 3);
  const minTemp = todayDaily ? Math.round(todayDaily.temp_min_c) : Math.round(currentTemp - 6);

  const rainInfo = getHumanRainSummary(prediction.predicted_accum_mm, supporting_evidence.hourly_series || []);
  const comfortInfo = getHumanComfortSummary(currentTemp, feelsLike, humidity, windSpeed);

  // Inundation Risk calculation from real mapData & prediction
  const inundationArea = mapData?.summary?.estimated_inundated_area_sqkm ?? 0;
  const meanTfsi = mapData?.summary?.mean_susceptibility_tfsi ?? 0.28;
  const maxTfsi = mapData?.summary?.max_susceptibility_tfsi ?? 0.45;

  let riskLevel = 'LOW RISK';
  let riskBadgeColor = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';
  let riskBarWidth = '25%';
  let riskBarColor = 'bg-emerald-500';
  let riskAdvice = 'Natural drainage is functioning normally. Normal stormwater gravity runoff.';

  if (inundationArea > 15 || meanTfsi > 0.65 || prediction.warning.level === 'RED') {
    riskLevel = 'SEVERE RISK';
    riskBadgeColor = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60';
    riskBarWidth = '100%';
    riskBarColor = 'bg-red-600';
    riskAdvice = 'Immediate precaution: Significant submergence in low-lying corridors and riverfront settlements.';
  } else if (inundationArea > 5 || meanTfsi > 0.45 || prediction.warning.level === 'ORANGE') {
    riskLevel = 'HIGH RISK';
    riskBadgeColor = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60';
    riskBarWidth = '75%';
    riskBarColor = 'bg-orange-500';
    riskAdvice = 'Waterlogging anticipated in underpasses and low depressions. Commuters exercise caution.';
  } else if (inundationArea > 1 || meanTfsi > 0.35 || prediction.warning.level === 'YELLOW') {
    riskLevel = 'MODERATE RISK';
    riskBadgeColor = 'bg-amber-400/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800/60';
    riskBarWidth = '50%';
    riskBarColor = 'bg-amber-500';
    riskAdvice = 'Localized rainwater ponding possible on secondary roads. Storm drains monitored.';
  }

  // Hourly rainfall chart data
  const hourlyData = (supporting_evidence.hourly_series || []).slice(0, 12).map((item) => {
    const rawTime = item.time?.slice(11, 16) || '';
    const hourNum = parseInt(rawTime.slice(0, 2), 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return {
      time: `${displayHour} ${ampm}`,
      precip: item.precip_mm,
      temp: item.temp_c ?? currentTemp,
      humidity: item.humidity_pct ?? humidity,
    };
  });

  // Daily forecast chart data for 7-day range
  const dailyData = (daily_forecast || []).map((d) => ({
    time: new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' }),
    precip: d.precip_sum_mm,
    maxTemp: d.temp_max_c,
    minTemp: d.temp_min_c,
  }));

  // Benchmark comparison data for Analytics section
  const comparisonData = [
    {
      name: 'Persistence',
      value: prediction.persistence_baseline_mm,
      fill: '#94A3B8',
    },
    {
      name: 'NOAA GFS',
      value: prediction.raw_gfs_mm,
      fill: '#0284C7',
    },
    {
      name: `AI/ML Model`,
      value: prediction.predicted_accum_mm,
      fill: '#2563EB',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. DASHBOARD HERO / LOCATION SECTION */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md p-4 sm:p-6 shadow-md transition-colors">
        {/* Top Layer: Existing Dashboard Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium uppercase tracking-wider bg-blue-50/90 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                Official Monitoring Area
              </span>
              <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>
              <span className="text-xs text-slate-600 dark:text-slate-300 hidden sm:inline font-medium">
                Synced {forecast.valid_time_ist}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Weather & Flood Risk for Your Area
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              Real-time weather information and early warnings for safer communities.
            </p>
          </div>

          {/* Current Target Location Box & Lead Horizon Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 dark:bg-[#131C2E]/90 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800/80 text-xs shadow-xs">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate max-w-[180px] sm:max-w-xs" title={locationName}>
                  {locationName}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">
                  {activeCoords ? `${activeCoords.lat.toFixed(4)}°N, ${activeCoords.lon.toFixed(4)}°E` : 'IMD Delhi Base'}
                </span>
              </div>
            </div>

            {setHorizon && (
              <div className="flex items-center gap-1 bg-white/80 dark:bg-[#131C2E]/90 backdrop-blur-xs p-1 rounded-lg border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono shadow-xs">
                {[6, 12, 24, 48].map((h) => (
                  <button
                    key={h}
                    onClick={() => setHorizon(h)}
                    className={`px-2.5 py-1 rounded text-xs transition ${
                      horizon === h
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    +{h}h
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. WEATHER SUMMARY CARDS */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Atmospheric & Hydrological Summary
          </h2>
          <span className="text-xs text-slate-400">Station & Numerical Evidence</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Current Temperature */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Temperature</span>
              <Thermometer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {Math.round(currentTemp)}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">°C</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Feels like {Math.round(feelsLike)}° • H:{maxTemp}° L:{minTemp}°
            </p>
          </div>

          {/* Card 2: Current / Forecast Rainfall */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Forecast Rain</span>
              <CloudRain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {prediction.predicted_accum_mm.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">mm</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              +{horizon}h horizon • {rainInfo.willRain ? 'Showers' : 'Dry'}
            </p>
          </div>

          {/* Card 3: Humidity */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Humidity</span>
              <Droplets className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {humidity}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">%</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {humidity > 75 ? 'Humid air' : 'Normal comfort'}
            </p>
          </div>

          {/* Card 4: Wind Speed */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Wind ({windDirection})</span>
              <Wind className="w-4 h-4 text-teal-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {windSpeed}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">km/h</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {windDirection} • {windSpeed > 25 ? 'Moderate breeze' : 'Light breeze'}
            </p>
          </div>

          {/* Card 5: Pressure */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Pressure</span>
              <Gauge className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {Math.round(pressure)}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">hPa</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {pressure < 1000 ? 'Low (Storm trend)' : 'Stable Barometer'}
            </p>
          </div>

          {/* Card 6: Visibility */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5 transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Visibility</span>
              <Eye className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {visibility.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">km</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {visibility >= 6 ? 'Clear optical clarity' : 'Atmospheric haze'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. FLOOD / RAINFALL RISK CARD */}
      <div className="bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${riskBadgeColor}`}>
                {riskLevel}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                • Lead Horizon: +{horizon} Hours
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Hydrological Inundation & Heavy Rain Hazard Assessment
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {riskAdvice}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTo('map')}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-xs flex items-center gap-1.5"
            >
              <span>View Flood Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTo('warnings')}
              className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition border border-slate-200 dark:border-slate-700"
            >
              View Warning Details
            </button>
          </div>
        </div>

        {/* Risk Visual Meter & Telemetry Metrics */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">Calculated Flood Index</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{riskLevel}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${riskBarColor}`}
                style={{ width: riskBarWidth }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Low (Green)</span>
              <span>Moderate (Yellow)</span>
              <span>High (Orange)</span>
              <span>Severe (Red)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 text-xs space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Projected Inundation</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {inundationArea > 0 ? `${inundationArea.toFixed(1)} km²` : '0.0 km² (Clear)'}
            </div>
            <span className="text-[10px] text-slate-500">Lowland puddle zones</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 text-xs space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Upstream River Flow</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {riverDischarge.toLocaleString()} <span className="text-[10px] font-sans font-normal text-slate-400">cfs</span>
            </div>
            <span className="text-[10px] text-slate-500">Hathnikund • Alert: {riverAlert}</span>
          </div>
        </div>
      </div>

      {/* 4. RAINFALL FORECAST + EXISTING FLOOD MAP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Rainfall Forecast Card (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
                <CloudRain className="w-4 h-4" />
                <span>Precipitation Outlook</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Rainfall Forecast
              </h3>
            </div>

            {/* Filter buttons: Today, 24h, 7 Days */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-mono">
              <button
                onClick={() => setForecastRangeTab('today')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                  forecastRangeTab === 'today'
                    ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setForecastRangeTab('24h')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                  forecastRangeTab === '24h'
                    ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                24h
              </button>
              <button
                onClick={() => setForecastRangeTab('7days')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                  forecastRangeTab === '7days'
                    ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                7 Days
              </button>
            </div>
          </div>

          {/* Forecast Summary Text */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
              {rainInfo.headline}
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              {rainInfo.subtext}
            </p>
          </div>

          {/* Interactive Chart */}
          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              {forecastRangeTab === '7days' ? (
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.3} vertical={false} />
                  <XAxis dataKey="time" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#F8FAFC',
                    }}
                    formatter={(val: any) => [`${val} mm`, 'Rain Total']}
                  />
                  <Bar dataKey="precip" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.3} vertical={false} />
                  <XAxis dataKey="time" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#F8FAFC',
                    }}
                    formatter={(val: any) => [`${val} mm`, 'Rain Rate']}
                  />
                  <Bar dataKey="precip" fill="#0284C7" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Expected Accumulation: <strong className="text-slate-800 dark:text-slate-200 font-mono">{prediction.predicted_accum_mm.toFixed(1)} mm</strong>
            </span>
            <button
              onClick={() => onNavigateTo('rain')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
            >
              <span>Full Timing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Existing Flood Map Card (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
                <Compass className="w-4 h-4" />
                <span>Interactive Map</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Flood Risk & Map
              </h3>
            </div>

            <button
              onClick={() => onNavigateTo('map')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <span>View Full Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* EMBEDDING EXISTING MAP COMPONENT - 100% UNCHANGED MAP ENGINE */}
          <div className="w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
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
              setLocationName={(name) => onSelectLocation(name, activeCoords?.lat || 28.585, activeCoords?.lon || 77.206)}
              locationSource={locationSource}
              setLocationSource={() => {}}
              onDetectGPS={onDetectGPS}
              geoLoading={geoLoading}
              geoError={geoError}
            />
          </div>
        </div>
      </div>

      {/* 5. RECENT ALERTS + SAFETY INFORMATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Alerts & Bulletins
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Protocol: IMD & CWC
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Alert 1: Official Weather Warning */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  {prediction.warning.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  prediction.warning.level === 'RED' ? 'bg-red-500 text-white' :
                  prediction.warning.level === 'ORANGE' ? 'bg-orange-500 text-white' :
                  prediction.warning.level === 'YELLOW' ? 'bg-amber-400 text-slate-900' :
                  'bg-emerald-500 text-white'
                }`}>
                  IMD {prediction.warning.level}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {prediction.warning.description}
              </p>
              <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Action: {prediction.warning.action}</span>
                <span className="font-mono text-[10px]">{forecast.valid_time_ist}</span>
              </div>
            </div>

            {/* Alert 2: Upstream Gauge River Advisory */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-blue-500" />
                  Hathnikund Upstream Discharge Watch
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {riverAlert}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Upstream river gauge reports current flow of {riverDischarge.toLocaleString()} cfs. Flood wave propagation time from Yamunanagar to Delhi corridor is estimated at 48 to 72 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Information ("What You Should Do") (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                What You Should Do (Safety Guidelines)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Citizen & Village Safety</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Avoid Flooded Roads
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Do not attempt to drive or walk through flooded underpasses and low depressions. Even 6 inches of moving water can knock you down.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Drains & Electrical Hazards
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Stay away from open storm drains, water channels, submerged electric poles, and fallen overhead wires.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Safeguard Valuables
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Keep important family documents in waterproof bags and charge mobile phones and emergency torches before heavy rain onset.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Follow Official Advisories
              </strong>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Monitor updates from District Disaster Management, IMD Nowcasts, and emergency helpline numbers (112 / 1078).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. EXISTING ANALYTICS */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Forecast Accuracy
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Model Rainfall Forecast Benchmark
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            +{prediction.model_metadata.benchmarked_skill_vs_persistence_pct}% Skill vs Persistence
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Multi-Model Comparison Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Multi-Horizon Rainfall Comparison (+{horizon}h)
              </span>
              <span className="font-mono text-[11px]">Ensemble ML vs GFS NWP vs Persistence</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.3} vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} unit=" mm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#F8FAFC',
                    }}
                    formatter={(val: any) => [`${val} mm`, 'Rainfall']}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap justify-between gap-2">
              <span>Model: <strong>Random Forest Regressor (50 Trees, max_depth 8)</strong></span>
              <span>Predictors: GFS 0.25° NWP + NASA IMERG + IMD Surface AWS</span>
            </div>
          </div>

          {/* Catchment & Inundation Statistics (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3 transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-2">
                Catchment & Basin Vulnerability Exposure
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Est. Flood Extent</span>
                  <span className="text-xl font-bold font-mono text-red-600 dark:text-red-400">
                    {inundationArea.toFixed(1)} <span className="text-xs font-normal text-slate-500">km²</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">High-risk cells</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Peak Susceptibility</span>
                  <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                    {maxTfsi} <span className="text-xs font-normal text-slate-500">/ 1.0</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">TFSI Index</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Mean Basin TFSI</span>
                  <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                    {meanTfsi}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Basin-wide avg</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Digital Elevation</span>
                  <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                    SRTM 30m
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Hydrologic flow</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTo('insights')}
              className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition text-center border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
            >
              <span>View Detailed Data & Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
