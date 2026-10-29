import React from 'react';
import { TodayPartsForecast } from '../components/TodayPartsForecast';
import { HourlyForecastStrip } from '../components/HourlyForecastStrip';
import { ForecastResponse } from '../types';
import { getHumanRainSummary } from '../utils/weatherNarrative';
import { 
  ArrowLeft, MapPin, CloudRain, Umbrella, CheckCircle2, 
  AlertTriangle, Clock, Droplets, ArrowRight 
} from 'lucide-react';

interface RainForecastViewProps {
  forecast: ForecastResponse | null;
  locationName: string;
  loading: boolean;
  horizon: number;
  onNavigateTo: (page: string) => void;
}

export const RainForecastView: React.FC<RainForecastViewProps> = ({
  forecast,
  locationName,
  loading,
  horizon,
  onNavigateTo,
}) => {
  if (loading || !forecast) {
    return (
      <div className="w-full py-8 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
      </div>
    );
  }

  const { prediction, supporting_evidence, daily_forecast } = forecast;
  const rainInfo = getHumanRainSummary(prediction.predicted_accum_mm, supporting_evidence.hourly_series || []);
  const hourly = supporting_evidence.hourly_series || [];

  let peakHour = 'No rain expected';
  let peakAmount = 0;
  for (const h of hourly) {
    if (h.precip_mm > peakAmount) {
      peakAmount = h.precip_mm;
      const hourNum = parseInt(h.time?.slice(11, 13) || '0', 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const formatted = hourNum % 12 === 0 ? 12 : hourNum % 12;
      peakHour = `Around ${formatted} ${ampm} (${h.precip_mm.toFixed(1)} mm/hr)`;
    }
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
              Precipitation Intelligence
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {locationName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            Rain Forecast & Timing
          </h1>
        </div>

        <button
          onClick={() => onNavigateTo('saved')}
          className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#131C2E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition shrink-0 shadow-xs"
        >
          Change Location
        </button>
      </div>

      {/* 1. Primary Rain Decision Banner */}
      <div className="bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 space-y-4 shadow-xs transition-colors">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Rain Assessment for Today
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            rainInfo.safetyLevel === 'danger' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60' :
            rainInfo.safetyLevel === 'caution' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60' :
            'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
          }`}>
            {rainInfo.willRain ? 'Rain Expected' : 'Dry Conditions'}
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {rainInfo.headline}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {rainInfo.subtext}
          </p>
        </div>

        {/* 4 Critical Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              Expected Rainfall
            </span>
            <strong className="text-base font-bold text-slate-900 dark:text-white font-mono block">
              {prediction.predicted_accum_mm.toFixed(1)} mm
            </strong>
            <span className="text-[10px] text-slate-500">In next {horizon} hours</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              Peak Rain Window
            </span>
            <strong className="text-sm font-semibold text-slate-900 dark:text-white block truncate" title={peakHour}>
              {peakHour}
            </strong>
            <span className="text-[10px] text-slate-500">Highest intensity</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              Heavy Rain Risk
            </span>
            <strong className={`text-sm font-semibold block ${
              prediction.predicted_accum_mm >= 64.5 ? 'text-red-600 dark:text-red-400' :
              prediction.predicted_accum_mm >= 15.6 ? 'text-amber-600 dark:text-amber-400' :
              'text-emerald-600 dark:text-emerald-400'
            }`}>
              {prediction.predicted_accum_mm >= 64.5 ? 'High Risk' :
               prediction.predicted_accum_mm >= 15.6 ? 'Moderate Risk' :
               'Low Risk'}
            </strong>
            <span className="text-[10px] text-slate-500">Based on IMD criteria</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              Recent Rain (Past 24h)
            </span>
            <strong className="text-base font-bold text-slate-900 dark:text-white font-mono block">
              {supporting_evidence.station_observed_24h_mm} mm
            </strong>
            <span className="text-[10px] text-slate-500">Observed at station</span>
          </div>
        </div>
      </div>

      {/* 2. Today's Weather Parts Timeline */}
      <TodayPartsForecast
        hourlySeries={supporting_evidence.hourly_series}
        currentTemp={supporting_evidence.temperature_c}
      />

      {/* 3. Detailed Hourly Forecast Strip */}
      <HourlyForecastStrip
        hourlyData={supporting_evidence.hourly_series}
        horizon={horizon}
      />
    </div>
  );
};
