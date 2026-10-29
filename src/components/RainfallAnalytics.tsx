import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ReferenceLine, CartesianGrid, Legend 
} from 'recharts';
import { TrendingUp, AlertCircle, Waves, Gauge, ShieldAlert } from 'lucide-react';
import { ForecastResponse, MapLayersResponse } from '../types';

interface RainfallAnalyticsProps {
  forecast: ForecastResponse | null;
  mapData: MapLayersResponse | null;
  horizon: number;
}

export const RainfallAnalytics: React.FC<RainfallAnalyticsProps> = ({
  forecast,
  mapData,
  horizon,
}) => {
  if (!forecast) return null;

  const { prediction, supporting_evidence } = forecast;

  const comparisonData = [
    {
      name: 'Persistence',
      accumulation_mm: prediction.persistence_baseline_mm,
      fill: '#94A3B8',
      description: 'Prior window continuation baseline',
    },
    {
      name: 'NOAA GFS',
      accumulation_mm: prediction.raw_gfs_mm,
      fill: '#0284C7',
      description: 'Raw 0.25° NWP model forecast',
    },
    {
      name: `AI/ML Model (${horizon}h)`,
      accumulation_mm: prediction.predicted_accum_mm,
      fill: '#2563EB',
      description: 'Random Forest Multi-Source Regressor',
    },
  ];

  const heavyThreshold = horizon === 6 ? 16.2 : (horizon === 12 ? 32.3 : 64.5);
  const modThreshold = horizon === 6 ? 3.9 : (horizon === 12 ? 7.8 : 15.6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Rainfall Accumulation Benchmark Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Multi-Model Comparison
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Accumulation Forecast Benchmark ({horizon}h Horizon)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2.5 h-0.5 bg-amber-500 inline-block"></span> Moderate ({modThreshold} mm)
            </span>
            <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
              <span className="w-2.5 h-0.5 bg-orange-500 inline-block"></span> Heavy ({heavyThreshold} mm)
            </span>
          </div>
        </div>

        <div className="h-64 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.3} vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8" 
                tick={{ fontSize: 11, fill: '#94A3B8' }} 
              />
              <YAxis 
                stroke="#94A3B8" 
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                unit=" mm"
              />
              <Tooltip 
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  borderColor: '#334155', 
                  borderRadius: '8px', 
                  fontSize: '11px',
                  color: '#F8FAFC'
                }}
                formatter={(value: any) => [`${value} mm`, 'Rainfall']}
              />
              <ReferenceLine 
                y={modThreshold} 
                stroke="#F59E0B" 
                strokeDasharray="4 4" 
                label={{ value: 'Moderate', fill: '#F59E0B', fontSize: 10, position: 'right' }} 
              />
              <ReferenceLine 
                y={heavyThreshold} 
                stroke="#EA580C" 
                strokeDasharray="4 4" 
                label={{ value: 'Heavy', fill: '#EA580C', fontSize: 10, position: 'right' }} 
              />
              <Bar dataKey="accumulation_mm" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap justify-between gap-2">
          <span>Model: <strong>Random Forest Regressor (50 Estimators, max_depth 8)</strong></span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
            Benchmarked Skill: +{prediction.model_metadata.benchmarked_skill_vs_persistence_pct}% vs Persistence
          </span>
        </div>
      </div>

      {/* 2. Hydrologic & Inundation Risk Summary Card */}
      <div className="bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Catchment Vulnerability
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Waves className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Catchment & Inundation Exposure
          </h3>
        </div>

        {mapData?.summary ? (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-[#0B0F19] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">Est. Flood Extent</span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400 font-mono">
                {mapData.summary.estimated_inundated_area_sqkm} <span className="text-xs text-slate-400 font-sans font-normal">km²</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">High-risk cells</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#0B0F19] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">Peak Susceptibility</span>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                {mapData.summary.max_susceptibility_tfsi} <span className="text-xs text-slate-400 font-sans font-normal">/ 1.0</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">TFSI Index</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#0B0F19] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">Mean Basin TFSI</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-200 font-mono">
                {mapData.summary.mean_susceptibility_tfsi}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Basin-wide avg</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#0B0F19] p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">Upstream Inflow</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-200 font-mono">
                {(supporting_evidence.upstream_discharge_cusecs / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-sans font-normal">cfs</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Hathnikund Barrage</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 py-6 text-center font-mono">Loading spatial summary...</div>
        )}

        {/* Scientific Integrity Note */}
        <div className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong className="text-slate-900 dark:text-white">Hydraulic Integrity:</strong> Displays topographic flood susceptibility index and inundation extent. Water depth is omitted as calibrated 2D hydrodynamic solvers (HEC-RAS 2D / SWMM) are required for honest water depths.
          </p>
        </div>
      </div>
    </div>
  );
};
