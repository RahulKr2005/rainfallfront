import React from 'react';
import { SevenDayForecastList } from '../components/SevenDayForecastList';
import { ForecastResponse } from '../types';
import { Calendar, MapPin, ArrowLeft, Sun, CloudRain, ShieldCheck, Info, Sprout, Car } from 'lucide-react';

interface ForecastViewProps {
  forecast: ForecastResponse | null;
  locationName: string;
  loading: boolean;
  onNavigateTo: (page: string) => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  forecast,
  locationName,
  loading,
  onNavigateTo,
}) => {
  const daily = forecast?.daily_forecast || [];
  const prediction = forecast?.prediction;

  const rainyDaysCount = daily.filter((d) => d.precip_sum_mm >= 1.0).length;
  const maxRainDay = daily.reduce((max, d) => (d.precip_sum_mm > (max?.precip_sum_mm || 0) ? d : max), daily[0]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Breadcrumb & Page Title */}
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
              Extended 7-Day Outlook
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {locationName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            7-Day Weather Outlook & Trends
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTo('saved')}
            className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#131C2E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition shadow-xs"
          >
            Change Location
          </button>
        </div>
      </div>

      {/* Human Weekly Summary Banner */}
      <div className="bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 space-y-3 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Weekly Weather Summary</span>
        </div>

        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
          {rainyDaysCount === 0
            ? 'The coming 7 days are projected to remain mostly dry and stable across the region, with comfortable sunshine and steady daytime temperatures.'
            : rainyDaysCount <= 2
            ? `Expect mostly clear to partly cloudy conditions with light rain or passing showers likely on ${rainyDaysCount} day${rainyDaysCount > 1 ? 's' : ''}. Best outdoor days will be during the dry intervals.`
            : `Active monsoon conditions will persist over the week with ${rainyDaysCount} days of rain showers expected. The heaviest precipitation is favored around ${maxRainDay ? new Date(maxRainDay.date).toLocaleDateString('en-IN', { weekday: 'long' }) : 'mid-week'}.`}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div>
            Rainy Days: <strong className="text-slate-900 dark:text-white font-mono">{rainyDaysCount} of 7 days</strong>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div>
            NWP Cycle: <span className="font-mono text-slate-700 dark:text-slate-300">{forecast?.data_freshness?.gfs_cycle || '00Z Operational'}</span>
          </div>
        </div>
      </div>

      {/* 7-Day Day-by-Day Forecast List */}
      <SevenDayForecastList dailyForecast={daily} />

      {/* Model Accumulation Comparison Table */}
      {prediction && (
        <section className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-1">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Model Verification Matrix
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Precipitation Forecast Comparison
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Lead Time: +{prediction.horizon_hours} Hours
            </span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#131C2E] shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 text-center">
              <div className="p-5 space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  AI/ML Multi-Source Model
                </span>
                <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono">
                  {prediction.predicted_accum_mm} <span className="text-xs font-normal text-slate-400">mm</span>
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  +{prediction.model_metadata.benchmarked_skill_vs_persistence_pct}% skill over baseline
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  Ensemble combining GFS, GPM satellite, and IMD station data.
                </p>
              </div>

              <div className="p-5 space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Persistence Baseline
                </span>
                <p className="text-3xl font-bold text-slate-700 dark:text-slate-300 font-mono">
                  {prediction.persistence_baseline_mm} <span className="text-xs font-normal text-slate-400">mm</span>
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Reference benchmark
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  Assumes previous 24h rainfall persists continuously.
                </p>
              </div>

              <div className="p-5 space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Raw NOAA GFS NWP
                </span>
                <p className="text-3xl font-bold text-slate-700 dark:text-slate-300 font-mono">
                  {prediction.raw_gfs_mm} <span className="text-xs font-normal text-slate-400">mm</span>
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  0.25° grid model
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  Numerical weather physics output before local ML correction.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
