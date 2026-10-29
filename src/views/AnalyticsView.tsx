import React, { useState, useEffect } from 'react';
import { AnalyticsResponse, ForecastResponse } from '../types';
import { fetchAnalytics } from '../services/api';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend, ReferenceLine 
} from 'recharts';
import { 
  ArrowLeft, Calendar, TrendingUp, BarChart2, Droplets, 
  Thermometer, ShieldAlert, CheckCircle2, Clock, Filter,
  RefreshCw, AlertTriangle 
} from 'lucide-react';

interface AnalyticsViewProps {
  forecast: ForecastResponse | null;
  locationName: string;
  loading: boolean;
  onNavigateTo: (page: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  forecast,
  locationName,
  loading: initialLoading,
  onNavigateTo,
}) => {
  const [days, setDays] = useState<number>(7);
  const [customMode, setCustomMode] = useState<boolean>(false);
  const [customDays, setCustomDays] = useState<number>(14);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeChart, setActiveChart] = useState<'rainfall' | 'temperature' | 'flood'>('rainfall');

  const loadData = async (queryDays: number) => {
    setLoading(true);
    try {
      const res = await fetchAnalytics(queryDays);
      setAnalyticsData(res);
    } catch (err) {
      console.error('Failed to load historical analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  const handleCustomApply = () => {
    if (customDays >= 3 && customDays <= 90) {
      setDays(customDays);
      setCustomMode(false);
    }
  };

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
              Module 7: Analytics & Historical Data
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Multi-Source Time Series Archives
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            Rainfall Trends & Flood Risk History
          </h1>
        </div>

        {/* Interactive Filter: 7 Days / 30 Days / Custom Date */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#131C2E] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => { setDays(7); setCustomMode(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                days === 7 && !customMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => { setDays(30); setCustomMode(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                days === 30 && !customMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setCustomMode(!customMode)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                customMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Custom Range</span>
            </button>
          </div>

          <button
            onClick={() => loadData(days)}
            disabled={loading}
            className="p-2 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Custom Date Filter Drawer */}
      {customMode && (
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex flex-wrap items-center gap-4 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900 dark:text-blue-300">Set Archive Period:</span>
            <input
              type="number"
              min={3}
              max={90}
              value={customDays}
              onChange={(e) => setCustomDays(parseInt(e.target.value, 10) || 7)}
              className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-xs font-mono font-bold text-slate-900 dark:text-white"
            />
            <span className="text-slate-500">days (Range: 3 to 90)</span>
          </div>

          <button
            onClick={handleCustomApply}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-xs"
          >
            Apply Query
          </button>
        </div>
      )}

      {analyticsData && (
        <div className="space-y-6">
          {/* 1. Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                Total Rainfall
              </span>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {analyticsData.summary.total_rainfall_mm} <span className="text-xs font-normal text-slate-400">mm</span>
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                Over {analyticsData.period_days} days
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                Daily Mean Rain
              </span>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {analyticsData.summary.average_daily_rain_mm} <span className="text-xs font-normal text-slate-400">mm</span>
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                Normalized daily average
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                Rainy Days Count
              </span>
              <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {analyticsData.summary.rainy_days_count} <span className="text-xs font-normal text-slate-400">/ {analyticsData.period_days}</span>
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                Days with &gt; 0.1 mm
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                Peak Single Day
              </span>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {analyticsData.summary.peak_single_day_rain_mm} <span className="text-xs font-normal text-slate-400">mm</span>
              </p>
              <span className="text-[10px] text-orange-500 font-semibold font-mono block">
                24h maximum burst
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                High Risk Days
              </span>
              <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {analyticsData.summary.high_risk_days_count} <span className="text-xs font-normal text-slate-400">days</span>
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                TFSI &ge; 0.50 risk index
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                Prevailing Alert
              </span>
              <div className="flex items-center gap-2 pt-0.5">
                <span className={`w-3.5 h-3.5 rounded-full ${
                  analyticsData.summary.prevailing_alert === 'RED' ? 'bg-red-500 animate-pulse' :
                  analyticsData.summary.prevailing_alert === 'ORANGE' ? 'bg-amber-600' :
                  analyticsData.summary.prevailing_alert === 'YELLOW' ? 'bg-amber-400' : 'bg-emerald-500'
                }`} />
                <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {analyticsData.summary.prevailing_alert}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                IMD advisory tier
              </span>
            </div>
          </div>

          {/* 2. Interactive Chart Canvas */}
          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Time Series Progression ({analyticsData.period_days}-Day Archive)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {analyticsData.start_date} to {analyticsData.end_date}
                </p>
              </div>

              {/* Chart Mode Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0B0F19] p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                <button
                  onClick={() => setActiveChart('rainfall')}
                  className={`px-3 py-1 rounded-md transition ${
                    activeChart === 'rainfall'
                      ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Rainfall (mm)
                </button>
                <button
                  onClick={() => setActiveChart('temperature')}
                  className={`px-3 py-1 rounded-md transition ${
                    activeChart === 'temperature'
                      ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Temperature (°C)
                </button>
                <button
                  onClick={() => setActiveChart('flood')}
                  className={`px-3 py-1 rounded-md transition ${
                    activeChart === 'flood'
                      ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Flood Risk (TFSI)
                </button>
              </div>
            </div>

            <div className="h-72 sm:h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'rainfall' ? (
                  <BarChart data={analyticsData.daily_records} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.25} vertical={false} />
                    <XAxis dataKey="day_name" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} unit=" mm" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '10px',
                        fontSize: '11px',
                        color: '#F8FAFC',
                      }}
                      formatter={(val: any) => [`${val} mm`, 'Rainfall']}
                    />
                    <Bar dataKey="rainfall_mm" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : activeChart === 'temperature' ? (
                  <LineChart data={analyticsData.daily_records} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.25} vertical={false} />
                    <XAxis dataKey="day_name" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} unit="°C" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '10px',
                        fontSize: '11px',
                        color: '#F8FAFC',
                      }}
                      formatter={(val: any, name: string) => [
                        `${val}°C`,
                        name === 'temp_max_c' ? 'Max Temp' : 'Min Temp',
                      ]}
                    />
                    <Line type="monotone" dataKey="temp_max_c" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="temp_min_c" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                ) : (
                  <LineChart data={analyticsData.daily_records} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.25} vertical={false} />
                    <XAxis dataKey="day_name" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, 1]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '10px',
                        fontSize: '11px',
                        color: '#F8FAFC',
                      }}
                      formatter={(val: any) => [`${(val * 100).toFixed(1)}%`, 'Flood Susceptibility (TFSI)']}
                    />
                    <ReferenceLine y={0.7} stroke="#DC2626" strokeDasharray="4 4" label={{ value: 'Severe', fill: '#DC2626', fontSize: 10 }} />
                    <ReferenceLine y={0.5} stroke="#F97316" strokeDasharray="4 4" label={{ value: 'High', fill: '#F97316', fontSize: 10 }} />
                    <ReferenceLine y={0.35} stroke="#EAB308" strokeDasharray="4 4" label={{ value: 'Moderate', fill: '#EAB308', fontSize: 10 }} />
                    <Line type="monotone" dataKey="tfsi_score" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Detailed Historical Observations Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#131C2E] shadow-xs">
            <div className="p-4 bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Daily Archive Ledger ({analyticsData.period_days} Days)
              </span>
              <span className="text-xs font-mono text-slate-500">
                {analyticsData.start_date} to {analyticsData.end_date}
              </span>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Precipitation</th>
                    <th className="p-3">Temp (Max/Min)</th>
                    <th className="p-3">Humidity / Gust</th>
                    <th className="p-3">Flood Risk</th>
                    <th className="p-3 text-right">Alert Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {analyticsData.daily_records.map((rec) => (
                    <tr key={rec.date} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {rec.day_name}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        {rec.rainfall_mm.toFixed(1)} mm
                      </td>
                      <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                        {rec.temp_max_c}° / {rec.temp_min_c}°C
                      </td>
                      <td className="p-3 font-mono text-slate-500 dark:text-slate-400">
                        {rec.relative_humidity_pct}% • {rec.wind_gust_kmh} km/h
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          rec.risk_level === 'Severe' ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900' :
                          rec.risk_level === 'High' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900' :
                          rec.risk_level === 'Moderate' ? 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-900' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {rec.risk_level} ({(rec.tfsi_score * 100).toFixed(0)}%)
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-semibold">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${
                          rec.alert_issued === 'RED' ? 'bg-red-500 text-white' :
                          rec.alert_issued === 'ORANGE' ? 'bg-amber-600 text-white' :
                          rec.alert_issued === 'YELLOW' ? 'bg-amber-400 text-slate-900' :
                          'bg-emerald-500 text-white'
                        }`}>
                          {rec.alert_issued}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
