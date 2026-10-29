import React from 'react';
import { CloudRain, CloudSun, Sun, Cloud, Calendar } from 'lucide-react';
import { DailyForecastItem } from '../types';

interface SevenDayForecastListProps {
  dailyForecast?: DailyForecastItem[];
}

export const SevenDayForecastList: React.FC<SevenDayForecastListProps> = ({
  dailyForecast = [],
}) => {
  if (!dailyForecast || dailyForecast.length === 0) {
    return null;
  }

  const allMins = dailyForecast.map((d) => d.temp_min_c);
  const allMaxs = dailyForecast.map((d) => d.temp_max_c);
  const globalMin = Math.min(...allMins, 18);
  const globalMax = Math.max(...allMaxs, 38);
  const tempRange = Math.max(globalMax - globalMin, 1);

  const getDayLabel = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    try {
      const dt = new Date(dateStr);
      return dt.toLocaleDateString('en-IN', { weekday: 'long' });
    } catch {
      return `Day ${index + 1}`;
    }
  };

  const getFormattedDate = (dateStr: string) => {
    try {
      const dt = new Date(dateStr);
      return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  const getDayIcon = (precip: number, maxTemp: number) => {
    if (precip >= 15.0) {
      return <CloudRain className="w-5 h-5 text-red-500" />;
    }
    if (precip > 1.0) {
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    }
    if (precip > 0) {
      return <CloudSun className="w-5 h-5 text-blue-400" />;
    }
    if (maxTemp > 34) {
      return <Sun className="w-5 h-5 text-amber-500" />;
    }
    return <CloudSun className="w-5 h-5 text-amber-500" />;
  };

  const getConditionName = (precip: number, maxTemp: number) => {
    if (precip >= 25.0) return 'Heavy Monsoon Rain';
    if (precip >= 15.0) return 'Moderate Rain Showers';
    if (precip >= 2.0) return 'Scattered Passing Showers';
    if (precip > 0) return 'Light Intermittent Rain';
    if (maxTemp > 35) return 'Sunny & Hot';
    if (maxTemp > 30) return 'Partly Sunny & Warm';
    return 'Pleasant & Mild';
  };

  return (
    <section className="w-full space-y-3 pt-2">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Weekly Forecast
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            7-Day Weather Outlook
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
          GFS 7-Day Ensemble
        </span>
      </div>

      <div className="space-y-2">
        {dailyForecast.map((day, idx) => {
          const dayName = getDayLabel(day.date, idx);
          const dateStr = getFormattedDate(day.date);
          const condition = getConditionName(day.precip_sum_mm, day.temp_max_c);

          const leftPercent = Math.max(0, ((day.temp_min_c - globalMin) / tempRange) * 100);
          const widthPercent = Math.min(100 - leftPercent, ((day.temp_max_c - day.temp_min_c) / tempRange) * 100);

          return (
            <div
              key={day.date}
              className="p-3 sm:p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-colors"
            >
              {/* Day & Date */}
              <div className="w-48 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shrink-0">
                  {getDayIcon(day.precip_sum_mm, day.temp_max_c)}
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">{dayName}</span>
                  <span className="text-xs text-slate-400 font-mono">{dateStr}</span>
                </div>
              </div>

              {/* Condition Text */}
              <div className="flex-1 sm:px-4">
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                  {condition}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {day.precip_sum_mm > 0 ? (
                    <strong className="text-blue-600 dark:text-blue-400 font-mono font-semibold">
                      {day.precip_sum_mm.toFixed(1)} mm rain expected
                    </strong>
                  ) : (
                    'Dry day • No rain expected'
                  )}
                </span>
              </div>

              {/* Temperature Bar */}
              <div className="w-full sm:w-60 flex items-center gap-3">
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 w-8 text-right">
                  {Math.round(day.temp_min_c)}°
                </span>

                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-blue-600 dark:bg-blue-500 rounded-full"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.max(widthPercent, 12)}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white w-8">
                  {Math.round(day.temp_max_c)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
