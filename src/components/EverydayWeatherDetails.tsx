import React from 'react';
import { Wind, Droplets, Eye, Gauge, Waves, Activity, Umbrella, CloudRain } from 'lucide-react';
import { 
  getWindHumanText, getHumidityHumanText, getVisibilityHumanText 
} from '../utils/weatherNarrative';

interface EverydayWeatherDetailsProps {
  windSpeedKmh: number;
  windDirectionCardinal?: string;
  humidityPct: number;
  visibilityKm: number;
  pressureHpa: number;
  capeJKg: number;
  rainObserved24hMm: number;
  upstreamDischargeCusecs: number;
  upstreamAlert: string;
}

export const EverydayWeatherDetails: React.FC<EverydayWeatherDetailsProps> = ({
  windSpeedKmh,
  windDirectionCardinal,
  humidityPct,
  visibilityKm,
  pressureHpa,
  capeJKg,
  rainObserved24hMm,
  upstreamDischargeCusecs,
  upstreamAlert,
}) => {
  const wind = getWindHumanText(windSpeedKmh);
  const humidity = getHumidityHumanText(humidityPct);
  const visibility = getVisibilityHumanText(visibilityKm);

  return (
    <section className="w-full space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Atmospheric & Environmental Parameters
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Current Weather Conditions Explained
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Real-Time Station Observations
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Wind */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wide flex items-center gap-1.5 font-medium">
              <Wind className="w-4 h-4 text-teal-500" />
              Wind Speed & Direction
            </span>
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {wind.speedText}{windDirectionCardinal ? ` • ${windDirectionCardinal}` : ''}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {wind.feeling}
          </p>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wide flex items-center gap-1.5 font-medium">
              <Droplets className="w-4 h-4 text-cyan-500" />
              Relative Humidity
            </span>
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{humidity.pctText}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {humidity.feeling}
          </p>
        </div>

        {/* Visibility */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wide flex items-center gap-1.5 font-medium">
              <Eye className="w-4 h-4 text-amber-500" />
              Atmospheric Visibility
            </span>
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{visibility.visText}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {visibility.feeling}
          </p>
        </div>

        {/* Air Pressure */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wide flex items-center gap-1.5 font-medium">
              <Gauge className="w-4 h-4 text-indigo-500" />
              Barometric Air Pressure
            </span>
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{Math.round(pressureHpa)} hPa</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            Normal barometric pressure. Indicates steady air circulation.
          </p>
        </div>

        {/* Rain Fallen in Past 24h */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wide flex items-center gap-1.5 font-medium">
              <CloudRain className="w-4 h-4 text-blue-500" />
              Recorded Rain (Past 24h)
            </span>
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{rainObserved24hMm} mm</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            Recorded by nearest IMD automatic weather station observatory.
          </p>
        </div>

        {/* River Yamuna Upstream Inflow */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wide flex items-center gap-1.5 font-medium">
              <Waves className="w-4 h-4 text-blue-500" />
              River Inflow (Hathnikund)
            </span>
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {(upstreamDischargeCusecs / 1000).toFixed(0)}k cfs
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {upstreamAlert === 'NORMAL'
              ? 'River discharge is within safe bounds. No heavy surge heading downstream.'
              : 'River discharge is elevated upstream. Hydrology teams are monitoring.'}
          </p>
        </div>
      </div>
    </section>
  );
};
