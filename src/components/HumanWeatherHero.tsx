import React from 'react';
import { 
  ArrowUp, ArrowDown, Droplets, Wind, ShieldCheck, 
  AlertTriangle, CheckCircle2, Umbrella, Sun, CloudRain
} from 'lucide-react';
import { ForecastResponse, Station } from '../types';
import { getHumanRainSummary, getHumanComfortSummary } from '../utils/weatherNarrative';

interface HumanWeatherHeroProps {
  forecast: ForecastResponse | null;
  selectedStation: Station | null;
  locationName: string;
  loading: boolean;
}

export const HumanWeatherHero: React.FC<HumanWeatherHeroProps> = ({
  forecast,
  selectedStation,
  locationName,
  loading,
}) => {
  if (loading || !forecast) {
    return (
      <div className="w-full py-6 space-y-4 animate-shimmer">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-28 w-44 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-6 w-80 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
    );
  }

  const { prediction, supporting_evidence } = forecast;

  const currentTemp = selectedStation?.temperature_c ?? 
    supporting_evidence.temperature_c ?? 31.0;
  const feelsLike = supporting_evidence.feels_like_c ?? (currentTemp + 4.2);
  const humidity = selectedStation?.humidity_pct ?? 
    supporting_evidence.relative_humidity_pct ?? 78;
  const windSpeed = supporting_evidence.wind_speed_kmh ?? 14;

  const todayDaily = forecast.daily_forecast?.[0];
  const tomorrowDaily = forecast.daily_forecast?.[1];
  const maxTemp = todayDaily ? Math.round(todayDaily.temp_max_c) : Math.round(currentTemp + 3);
  const minTemp = todayDaily ? Math.round(todayDaily.temp_min_c) : Math.round(currentTemp - 6);

  const rainInfo = getHumanRainSummary(prediction.predicted_accum_mm, supporting_evidence.hourly_series || []);
  const comfortInfo = getHumanComfortSummary(currentTemp, feelsLike, humidity, windSpeed);

  let conditionTitle = 'Partly Cloudy';
  if (rainInfo.willRain) {
    conditionTitle = prediction.predicted_accum_mm >= 15.6 ? 'Moderate Rain Showers' : 'Light Passing Showers';
  } else if (humidity > 75) {
    conditionTitle = 'Overcast & Humid';
  } else if (currentTemp > 33) {
    conditionTitle = 'Warm & Sunny';
  }

  return (
    <section className="w-full py-2 sm:py-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* Main Temperature Display */}
          <div className="flex items-baseline gap-4">
            <span className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-slate-900 dark:text-white leading-none select-none font-mono">
              {Math.round(currentTemp)}
              <span className="text-4xl sm:text-5xl md:text-6xl font-light text-slate-400 dark:text-slate-500 -ml-1">°</span>
            </span>

            {/* Feels-like and High / Low */}
            <div className="space-y-1.5 pb-2">
              <span className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 block">
                Feels like <strong className="text-slate-900 dark:text-white font-semibold">{Math.round(feelsLike)}°C</strong>
              </span>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-mono">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>High {maxTemp}°</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-mono">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Low {minTemp}°</span>
                </span>
              </div>
            </div>
          </div>

          {/* Human Condition Statement */}
          <div className="pt-2 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {conditionTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {comfortInfo.headline} • {comfortInfo.outdoorAdvice}
            </p>
          </div>
        </div>

        {/* Safety & Status Card */}
        <div className="w-full md:w-auto md:max-w-md bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Safety & Rain Status
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                rainInfo.safetyLevel === 'danger'
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60'
                  : rainInfo.safetyLevel === 'caution'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
              }`}
            >
              {rainInfo.willRain ? 'Rain Expected' : 'Safe Outdoors'}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-start gap-2.5">
              {rainInfo.willRain ? (
                <Umbrella className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-white font-semibold block">
                  {rainInfo.headline}
                </strong>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {rainInfo.subtext}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>Outdoor Advice: <strong className="text-slate-900 dark:text-white">{comfortInfo.clothingTip}</strong></span>
          </div>

          {tomorrowDaily && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-white">Tomorrow:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                High {Math.round(tomorrowDaily.temp_max_c)}° / Low {Math.round(tomorrowDaily.temp_min_c)}°
                {tomorrowDaily.precip_sum_mm > 0 ? ` • ${tomorrowDaily.precip_sum_mm.toFixed(1)} mm rain` : ' • Dry'}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
