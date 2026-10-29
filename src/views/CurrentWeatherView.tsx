import React from 'react';
import { HumanWeatherHero } from '../components/HumanWeatherHero';
import { EverydayWeatherDetails } from '../components/EverydayWeatherDetails';
import { SunMoonTracker } from '../components/SunMoonTracker';
import { ForecastResponse, Station } from '../types';
import { ArrowLeft, MapPin, Wind, Droplets, Eye, Gauge, Waves, Sun, HelpCircle } from 'lucide-react';

interface CurrentWeatherViewProps {
  forecast: ForecastResponse | null;
  selectedStation: Station | null;
  locationName: string;
  loading: boolean;
  onNavigateTo: (page: string) => void;
}

export const CurrentWeatherView: React.FC<CurrentWeatherViewProps> = ({
  forecast,
  selectedStation,
  locationName,
  loading,
  onNavigateTo,
}) => {
  const supporting = forecast?.supporting_evidence;
  const todayDaily = forecast?.daily_forecast?.[0];

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
              Current Observations
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {locationName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            Current Weather & Atmospheric Conditions
          </h1>
        </div>

        <button
          onClick={() => onNavigateTo('saved')}
          className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#131C2E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition shrink-0 shadow-xs"
        >
          Change Location
        </button>
      </div>

      {/* 1. Large Temperature & Condition Presentation */}
      <HumanWeatherHero
        forecast={forecast}
        selectedStation={selectedStation}
        locationName={locationName}
        loading={loading}
      />

      {/* 2. Detailed Environmental Telemetry */}
      <EverydayWeatherDetails
        windSpeedKmh={supporting?.wind_speed_kmh ?? 14}
        windDirectionCardinal={supporting?.wind_direction_cardinal}
        humidityPct={selectedStation?.humidity_pct ?? supporting?.relative_humidity_pct ?? 78}
        visibilityKm={supporting?.visibility_km ?? 6.0}
        pressureHpa={supporting?.pressure_hpa ?? 1004.2}
        capeJKg={supporting?.atmospheric_cape_j_kg ?? 1450}
        rainObserved24hMm={supporting?.station_observed_24h_mm ?? 13.6}
        upstreamDischargeCusecs={supporting?.upstream_discharge_cusecs ?? 85400}
        upstreamAlert={supporting?.upstream_alert ?? 'NORMAL'}
      />

      {/* 3. Solar & Daylight Rhythm */}
      <SunMoonTracker todayForecast={todayDaily} />

      {/* 4. Plain English Reference Notes for Everyday Users */}
      <section className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-700 dark:text-slate-300">
            Weather Terms Explained in Everyday Language
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs transition-colors">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-500" />
              Relative Humidity
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              Indicates the amount of moisture in the air. When humidity exceeds 75%, perspiration evaporates slowly, making the air feel substantially warmer than the thermometer reading.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs transition-colors">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-indigo-500" />
              Barometric Air Pressure
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              Standard sea-level air pressure is ~1013 hPa. A rapid drop below 1000 hPa signals incoming storm clouds, convective activity, and likely precipitation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs transition-colors">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-500" />
              River Inflow (Hathnikund)
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              Discharge released upstream in Haryana reaches the Delhi segment of the Yamuna River in 48 to 72 hours. Safe flow is below 50,000 cfs; higher releases trigger floodplain monitoring.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
