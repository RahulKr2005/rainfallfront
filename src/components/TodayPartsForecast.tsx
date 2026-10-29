import React from 'react';
import { Sun, CloudSun, CloudRain, Cloud, Moon } from 'lucide-react';
import { getTimeOfDayBreakdown, TimeOfDayPeriod } from '../utils/weatherNarrative';

interface TodayPartsForecastProps {
  hourlySeries?: any[];
  currentTemp?: number;
}

export const TodayPartsForecast: React.FC<TodayPartsForecastProps> = ({
  hourlySeries = [],
  currentTemp = 30,
}) => {
  const parts: TimeOfDayPeriod[] = getTimeOfDayBreakdown(hourlySeries, currentTemp);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'cloud-rain':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'cloud':
        return <Cloud className="w-5 h-5 text-slate-400" />;
      case 'moon':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      default:
        return <CloudSun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section className="w-full space-y-3 pt-2">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Daily Sequence
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Today's Weather Timeline (Morning • Afternoon • Evening • Night)
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
          Clear outlook for planning your day
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {parts.map((part) => (
          <div
            key={part.label}
            className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 flex flex-col justify-between transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white block font-sans">
                    {part.label}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {part.timeRange}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shrink-0">
                  {renderIcon(part.iconType)}
                </div>
              </div>

              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">
                  {part.temp}°
                </span>
                <span className="text-xs text-slate-400 font-mono">C</span>
              </div>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {part.condition}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {part.advice}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
