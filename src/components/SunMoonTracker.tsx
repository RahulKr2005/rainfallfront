import React from 'react';
import { Sunrise, Sunset, Sun, Moon, Clock } from 'lucide-react';
import { DailyForecastItem } from '../types';

interface SunMoonTrackerProps {
  todayForecast?: DailyForecastItem;
}

export const SunMoonTracker: React.FC<SunMoonTrackerProps> = ({ todayForecast }) => {
  // Extract or default sunrise and sunset
  const sunriseStr = todayForecast?.sunrise ? todayForecast.sunrise.slice(11, 16) : '06:12';
  const sunsetStr = todayForecast?.sunset ? todayForecast.sunset.slice(11, 16) : '18:18';

  // Calculate sun position on arc (0% = sunrise, 100% = sunset)
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [srH, srM] = sunriseStr.split(':').map(Number);
  const [ssH, ssM] = sunsetStr.split(':').map(Number);
  const sunriseMinutes = (srH || 6) * 60 + (srM || 12);
  const sunsetMinutes = (ssH || 18) * 60 + (ssM || 18);

  const totalDaylightMin = sunsetMinutes - sunriseMinutes;
  const daylightHours = Math.floor(totalDaylightMin / 60);
  const daylightRemMin = totalDaylightMin % 60;

  let progress = 0;
  let isNight = false;
  if (currentMinutes < sunriseMinutes) {
    progress = 0;
    isNight = true;
  } else if (currentMinutes > sunsetMinutes) {
    progress = 100;
    isNight = true;
  } else {
    progress = ((currentMinutes - sunriseMinutes) / totalDaylightMin) * 100;
  }

  const t = Math.max(0, Math.min(1, progress / 100));
  const p0x = 20, p0y = 80;
  const p1x = 150, p1y = 10;
  const p2x = 280, p2y = 80;
  const sunX = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x;
  const sunY = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;

  return (
    <div className="w-full bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Solar Ephemeris
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Sun Position & Daylight Rhythm
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {daylightHours}h {daylightRemMin}m Daylight
        </span>
      </div>

      {/* Visual Solar Arc */}
      <div className="py-2 flex flex-col items-center">
        <svg viewBox="0 0 300 95" className="w-full max-w-sm h-24 overflow-visible">
          {/* Ground Horizon line */}
          <line x1="10" y1="80" x2="290" y2="80" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

          {/* Daylight Arc Path */}
          <path
            d="M 20,80 Q 150,10 280,80"
            fill="none"
            stroke="#CBD5E1"
            className="dark:stroke-slate-700"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Past trajectory progress */}
          <path
            d="M 20,80 Q 150,10 280,80"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeDasharray="300"
            strokeDashoffset={300 - (300 * progress) / 100}
            strokeLinecap="round"
          />

          {/* Current Sun Marker */}
          {!isNight ? (
            <g transform={`translate(${sunX}, ${sunY})`}>
              <circle r="7" fill="#F59E0B" />
              <circle r="12" fill="#F59E0B" opacity="0.25" />
            </g>
          ) : (
            <g transform="translate(150, 80)">
              <circle r="6" fill="#64748B" />
            </g>
          )}

          {/* Horizon endpoints */}
          <circle cx="20" cy="80" r="3" fill="#94A3B8" />
          <circle cx="280" cy="80" r="3" fill="#94A3B8" />
        </svg>

        {/* Sunrise / Sunset Details */}
        <div className="w-full flex items-center justify-between text-xs pt-1 px-2">
          <div className="flex items-center gap-2 text-left">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
              <Sunrise className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Dawn / Sunrise</span>
              <strong className="text-slate-900 dark:text-white font-mono text-xs sm:text-sm font-semibold">{sunriseStr} IST</strong>
            </div>
          </div>

          <div className="text-center hidden sm:block">
            <span className="text-[10px] text-slate-400 font-mono block">Solar Noon</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">12:15 IST</span>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">Dusk / Sunset</span>
              <strong className="text-slate-900 dark:text-white font-mono text-xs sm:text-sm font-semibold">{sunsetStr} IST</strong>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
              <Sunset className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
