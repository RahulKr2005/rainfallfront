import React from 'react';
import { 
  AlertTriangle, CheckCircle2, ShieldAlert, Activity, 
  Droplets, Waves, Gauge, ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { ForecastResponse } from '../types';

interface EarlyWarningDetailProps {
  forecast: ForecastResponse | null;
  loading: boolean;
  systemMode: string;
}

export const EarlyWarningDetail: React.FC<EarlyWarningDetailProps> = ({
  forecast,
  loading,
  systemMode,
}) => {
  if (loading || !forecast) {
    return (
      <div className="w-full bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-6 animate-shimmer space-y-4">
        <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  const { prediction, supporting_evidence, horizon_hours, valid_time_ist } = forecast;
  const warning = prediction.warning;

  const levelTheme = {
    GREEN: {
      cardBg: 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60',
      badge: 'bg-emerald-500 text-white',
      icon: CheckCircle2,
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    YELLOW: {
      cardBg: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60',
      badge: 'bg-amber-400 text-slate-900',
      icon: AlertTriangle,
      accent: 'text-amber-600 dark:text-amber-400',
    },
    ORANGE: {
      cardBg: 'bg-orange-50/60 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/60',
      badge: 'bg-orange-500 text-white',
      icon: AlertTriangle,
      accent: 'text-orange-600 dark:text-orange-400',
    },
    RED: {
      cardBg: 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/60',
      badge: 'bg-red-600 text-white',
      icon: ShieldAlert,
      accent: 'text-red-600 dark:text-red-400',
    },
  }[warning.level];

  const IconComponent = levelTheme.icon;

  return (
    <section className={`w-full bg-white dark:bg-[#131C2E] border ${levelTheme.cardBg} rounded-xl p-5 sm:p-6 shadow-xs space-y-6 transition-colors`}>
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-xs shrink-0 mt-0.5">
            <IconComponent className={`w-6 h-6 ${levelTheme.accent}`} />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${levelTheme.badge}`}>
                IMD {warning.level} ALERT
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                {warning.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                • Valid to <strong>{valid_time_ist}</strong> (+{horizon_hours}h lead)
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {warning.description}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Operational Advisory:</strong> {warning.action}
            </p>
          </div>
        </div>

        {/* Forecast Accumulation Benchmark Matrix */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          {/* ML Model */}
          <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              ML Model
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono block">
              {prediction.predicted_accum_mm} <span className="text-xs font-normal text-slate-400">mm</span>
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium font-mono block">
              +{prediction.model_metadata.benchmarked_skill_vs_persistence_pct}% skill
            </span>
          </div>

          {/* Persistence */}
          <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              Persistence
            </span>
            <span className="text-lg font-bold text-slate-700 dark:text-slate-300 font-mono block">
              {prediction.persistence_baseline_mm} <span className="text-xs font-normal text-slate-400">mm</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-sans">Baseline</span>
          </div>

          {/* Raw GFS NWP */}
          <div className="text-center px-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              NOAA GFS
            </span>
            <span className="text-lg font-bold text-slate-700 dark:text-slate-300 font-mono block">
              {prediction.raw_gfs_mm} <span className="text-xs font-normal text-slate-400">mm</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-sans">0.25° NWP</span>
          </div>
        </div>
      </div>

      {/* Supporting Evidence Bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
          <Activity className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Atmospheric CAPE</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {supporting_evidence.atmospheric_cape_j_kg.toLocaleString()} J/kg
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
          <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">GPM Satellite (6h)</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {supporting_evidence.gpm_satellite_recent_mm} mm
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
          <Gauge className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">AWS Observed 24h</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {supporting_evidence.station_observed_24h_mm} mm
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800">
          <Waves className="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">Upstream Discharge</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {(supporting_evidence.upstream_discharge_cusecs / 1000).toFixed(0)}k cfs
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
