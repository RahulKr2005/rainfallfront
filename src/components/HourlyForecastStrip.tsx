import React from 'react';
import { Cloud, CloudRain, CloudSun, Sun, Zap, Droplets } from 'lucide-react';
import { HourlyForecastItem } from '../types';

interface HourlyForecastStripProps {
  hourlyData?: HourlyForecastItem[];
  horizon: number;
}

export const HourlyForecastStrip: React.FC<HourlyForecastStripProps> = ({
  hourlyData = [],
  horizon,
}) => {
  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }

  const maxPrecip = Math.max(...hourlyData.map((h) => h.precip_mm || 0), 1.0);

  const formatHour = (isoStr: string) => {
    try {
      const dt = new Date(isoStr);
      return dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return isoStr.slice(11, 16);
    }
  };

  const getWeatherIcon = (precip: number, cape: number) => {
    if (precip > 5.0 || cape > 2000) {
      return <Zap className="w-4 h-4 text-amber-500" />;
    }
    if (precip > 0.5) {
      return <CloudRain className="w-4 h-4 text-blue-500" />;
    }
    if (precip > 0.1) {
      return <Cloud className="w-4 h-4 text-slate-400" />;
    }
    return <CloudSun className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="w-full bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Chronological NWP Trajectory
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Hourly Multi-Parameter Forecast ({horizon} Hours)
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
          NOAA GFS 0.25° Resolution
        </span>
      </div>

      {/* Hourly Timeline Scroller */}
      <div className="overflow-x-auto no-scrollbar flex items-stretch gap-2 pb-1">
        {hourlyData.map((item, index) => {
          const hourLabel = formatHour(item.time);
          const precipHeight = Math.min(Math.max((item.precip_mm / maxPrecip) * 36, 4), 36);
          const isHeavy = item.precip_mm >= 2.5;

          return (
            <div
              key={index}
              className={`shrink-0 flex flex-col items-center justify-between p-3 rounded-lg border transition w-20 sm:w-24 ${
                isHeavy
                  ? 'border-orange-200 dark:border-orange-900/60 bg-orange-50/60 dark:bg-orange-950/20 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19] hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
              }`}
            >
              <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                {hourLabel}
              </span>

              <div className="my-2 p-1.5 rounded-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-xs">
                {getWeatherIcon(item.precip_mm, item.cape)}
              </div>

              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono mb-2">
                {item.temp_c ? `${Math.round(item.temp_c)}°` : '—'}
              </span>

              <div className="w-full flex flex-col items-center gap-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="w-1.5 bg-slate-200 dark:bg-slate-800 rounded-full h-8 flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-full transition-all ${
                      isHeavy ? 'bg-orange-500' : 'bg-blue-600 dark:bg-blue-400'
                    }`}
                    style={{ height: `${precipHeight}px` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-medium">
                  {item.precip_mm} <span className="text-[9px] text-slate-400">mm</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
