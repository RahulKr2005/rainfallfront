import React from 'react';
import { EarlyWarningDetail } from '../components/EarlyWarningDetail';
import { RainfallAnalytics } from '../components/RainfallAnalytics';
import { ForecastResponse, MapLayersResponse } from '../types';
import { 
  ArrowLeft, MapPin, ShieldAlert, AlertTriangle, CheckCircle2, 
  Clock, Droplets, Waves, Users, Sprout, Building, Info, ExternalLink 
} from 'lucide-react';

interface EarlyWarningsViewProps {
  forecast: ForecastResponse | null;
  mapData: MapLayersResponse | null;
  locationName: string;
  loading: boolean;
  horizon: number;
  setHorizon: (h: number) => void;
  systemMode: string;
  onNavigateTo: (page: string) => void;
}

export const EarlyWarningsView: React.FC<EarlyWarningsViewProps> = ({
  forecast,
  mapData,
  locationName,
  loading,
  horizon,
  setHorizon,
  systemMode,
  onNavigateTo,
}) => {
  if (loading || !forecast) {
    return (
      <div className="w-full py-8 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3"></div>
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
      </div>
    );
  }

  const { prediction, supporting_evidence, valid_time_ist, horizon_hours } = forecast;
  const warning = prediction.warning;

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
              Early Warning & Hazard Mitigation
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {locationName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            Early Warnings & Severe Rainfall Advisories
          </h1>
        </div>

        {/* Lead Time Horizon Selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#131C2E] p-1 rounded-lg border border-slate-200 dark:border-slate-800 self-start sm:self-auto shadow-xs">
          {[6, 12, 24, 48].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition ${
                horizon === h
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              +{h}h Lead
            </button>
          ))}
        </div>
      </div>

      {/* 1. Official Alert Header Component */}
      <EarlyWarningDetail
        forecast={forecast}
        loading={loading}
        systemMode={systemMode}
      />

      {/* 2. Simple "What You Should Do" Safety Section for City & Village Users */}
      <section className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              What You Should Do (Safety Instructions)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Immediate precautions for citizens, commuters, and village residents
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-[#131C2E] border border-blue-100 dark:border-slate-800">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-xs font-semibold text-slate-900 dark:text-white block">Avoid flooded roads</strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Do not drive or walk through flooded streets or waterlogged underpasses.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-[#131C2E] border border-blue-100 dark:border-slate-800">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-xs font-semibold text-slate-900 dark:text-white block">Stay away from drains and rivers</strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Keep clear distance from open drains, riverbanks, and stormwater canals.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-[#131C2E] border border-blue-100 dark:border-slate-800">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-xs font-semibold text-slate-900 dark:text-white block">Move to a safer area if warned</strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">If living in low-lying zones, relocate to higher ground or relief centers.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-[#131C2E] border border-blue-100 dark:border-slate-800">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div>
              <strong className="text-xs font-semibold text-slate-900 dark:text-white block">Keep important documents safe</strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Store identity papers, medicines, and emergency cash in waterproof bags.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-[#131C2E] border border-blue-100 dark:border-slate-800">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              5
            </span>
            <div>
              <strong className="text-xs font-semibold text-slate-900 dark:text-white block">Follow local authority instructions</strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Heed guidance from district administration, police, and disaster teams.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-[#131C2E] border border-blue-100 dark:border-slate-800">
            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              6
            </span>
            <div>
              <strong className="text-xs font-semibold text-slate-900 dark:text-white block">Emergency Helplines</strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Police/Disaster: 112 • Flood Control: 1078 • Ambulance: 108</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Actionable Stakeholder Advisory Protocols */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Sector Advisories
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Targeted Guidance by Sector
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Valid to {valid_time_ist}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* General Public & Commuters */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm">Citizens & Commuters</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
              <li>Check traffic and arterial waterlogging updates prior to departure.</li>
              <li>Avoid low-lying road underpasses and storm-channel crossings during downpours.</li>
              <li>Stay away from exposed electrical poles, fallen cables, and transformer units.</li>
              <li>Keep emergency phone numbers (112 / 1078) handy and mobile devices charged.</li>
            </ul>
          </div>

          {/* Farming & Agriculture */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Sprout className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm">Farmers & Agriculture</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
              <li>Suspend pesticide and chemical fertilizer application during high rain windows.</li>
              <li>Ensure clear field drainage outlets to prevent root-zone water stagnation.</li>
              <li>Move harvested crops and sensitive produce to elevated, covered storage.</li>
              <li>Secure cattle sheds and livestock away from low-lying river embankments.</li>
            </ul>
          </div>

          {/* Municipal & Disaster Management */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs transition-colors">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm">Municipal & Drainage Teams</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
              <li>Deploy high-capacity mobile dewatering pumps at known underpass choke points.</li>
              <li>Monitor Najafgarh and Shahdara outfall drain regulators continuously.</li>
              <li>Coordinate with Haryana Irrigation on Hathnikund discharge wave arrival.</li>
              <li>Keep local shelters and SDRF / civil defense rapid response teams on standby.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Multi-Model Accumulation Analytics */}
      <section className="space-y-3 pt-2">
        <RainfallAnalytics
          forecast={forecast}
          mapData={mapData}
          horizon={horizon}
        />
      </section>
    </div>
  );
};
