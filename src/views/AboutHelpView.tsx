import React from 'react';
import { 
  ArrowLeft, HelpCircle, ShieldCheck, PhoneCall, AlertTriangle, 
  Droplets, ExternalLink, Compass, CheckCircle2, ShieldAlert, 
  BookOpen, Landmark, Activity, Satellite, Layers, Sprout, Car 
} from 'lucide-react';

interface AboutHelpViewProps {
  onNavigateTo: (page: string) => void;
}

export const AboutHelpView: React.FC<AboutHelpViewProps> = ({ onNavigateTo }) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={() => onNavigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
              Citizen Handbook & Documentation
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              System Architecture & User Guide
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            About Rainfall &amp; Inundation AI &amp; User Guide
          </h1>
        </div>
      </div>

      {/* 1. Official Project Title & Platform Identity Hero */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>Operational Platform Overview</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-[#131C2E] p-1 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="Rainfall & Inundation AI Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white block">
              Rainfall &amp; Inundation AI
            </span>
            <span className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 block mt-0.5">
              Predict • Prepare • Protect
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
            Project Specification
          </span>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
            "AI/ML-Based Integrated Heavy Rainfall Early Warning and Inundation Prediction System using Satellite, Radar, Observational Weather and Numerical Weather Prediction Model Data"
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Rainfall &amp; Inundation AI delivers accessible, accurate, and actionable early warnings for heavy rainfall and flood inundation. Designed to be completely transparent and easily understood by village farmers, town residents, and city commuters without technical background.
        </p>
      </div>

      {/* 2. How to Read IMD Color Warning Alerts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
              Alert Interpretation
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Understanding Weather Warning Colors
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            IMD 4-Color Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Green */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Green Alert
              </span>
            </div>
            <strong className="text-sm font-semibold text-slate-900 dark:text-white block">
              No Advisory (Normal)
            </strong>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Normal weather conditions. No adverse impact on farming, markets, travel, or school. Proceed normally.
            </p>
          </div>

          {/* Yellow */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Yellow Alert
              </span>
            </div>
            <strong className="text-sm font-semibold text-slate-900 dark:text-white block">
              Be Updated
            </strong>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Passing showers, moderate breeze, or rising humidity. Keep an eye on local weather updates and traffic conditions.
            </p>
          </div>

          {/* Orange */}
          <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300">
                Orange Alert
              </span>
            </div>
            <strong className="text-sm font-semibold text-slate-900 dark:text-white block">
              Be Prepared
            </strong>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Heavy rain or thunderstorm likely. Avoid unpaved dirt tracks, waterlogged roads, low underpasses, and electric poles.
            </p>
          </div>

          {/* Red */}
          <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 dark:bg-rose-400 shrink-0"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                Red Alert
              </span>
            </div>
            <strong className="text-sm font-semibold text-slate-900 dark:text-white block">
              Take Immediate Action
            </strong>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Severe downpour and inundation. Stay indoors on upper floors if near floodplains; obey official evacuation alerts.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Rainfall Measurement Scale */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
              Measurement Scale
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Rainfall Measurements in Everyday Terms
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Official IMD 24h classification
          </span>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 text-xs shadow-xs">
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
            <div className="w-48 font-semibold text-slate-900 dark:text-white">
              Very Light Rain
            </div>
            <div className="w-32 font-mono text-slate-600 dark:text-slate-400">
              0.1 mm to 2.4 mm
            </div>
            <div className="flex-1 text-slate-600 dark:text-slate-400">
              Drizzles that wet the soil surface. Does not cause waterlogging or interfere with transport.
            </div>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
            <div className="w-48 font-semibold text-slate-900 dark:text-white">
              Light Rain
            </div>
            <div className="w-32 font-mono text-slate-600 dark:text-slate-400">
              2.5 mm to 15.5 mm
            </div>
            <div className="flex-1 text-slate-600 dark:text-slate-400">
              Steady rain shower. Umbrella or raincoat recommended. Excellent for agricultural soil moisture.
            </div>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
            <div className="w-48 font-semibold text-slate-900 dark:text-white">
              Moderate Rain
            </div>
            <div className="w-32 font-mono text-slate-600 dark:text-slate-400">
              15.6 mm to 64.4 mm
            </div>
            <div className="flex-1 text-slate-600 dark:text-slate-400">
              Noticeable road runoff, underpass puddles, and slower city or highway traffic.
            </div>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
            <div className="w-48 font-semibold text-slate-900 dark:text-white">
              Heavy Rain
            </div>
            <div className="w-32 font-mono text-slate-600 dark:text-slate-400">
              64.5 mm to 115.5 mm
            </div>
            <div className="flex-1 text-slate-600 dark:text-slate-400">
              Waterlogging in low-lying settlements, subways, and agricultural basins. Commute delays likely.
            </div>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
            <div className="w-48 font-semibold text-rose-700 dark:text-rose-400">
              Very Heavy to Extreme Rain
            </div>
            <div className="w-32 font-mono text-rose-700 dark:text-rose-400 font-bold">
              Above 115.6 mm
            </div>
            <div className="flex-1 text-slate-700 dark:text-slate-300">
              Localized flash flooding, drainage overflows, and high river inundation risk along low-lying basins.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Emergency Helplines Directory */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
              Emergency Directory
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Emergency & Flood Control Helplines</span>
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Toll-free 24x7
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              National Emergency
            </span>
            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
              112
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              All-in-one Police, Fire, Ambulance, and Emergency response.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Disaster Management (NDMA)
            </span>
            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
              1078
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              National Disaster Management Authority 24x7 Control Room.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              District Disaster (DDMA)
            </span>
            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
              1077
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              District Disaster Management Control for local relief and rescue.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Central Flood Control
            </span>
            <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">
              011-22421656
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Irrigation & Flood Control Department, Barrage Monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Scientific Transparency & Data Sources */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
              Data Lineage & Methodology
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Scientific Feeds & Machine Learning Architecture
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          This system aggregates genuine scientific data feeds without fabricated numbers. All live observations reflect India Meteorological Department (IMD) automatic weather station telemetry, calibrated against NOAA Global Forecast System (GFS) 0.25° numerical physics models, NASA Global Precipitation Measurement (GPM) satellite radar, and Copernicus Sentinel-1 SAR imagery.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="font-semibold text-slate-900 dark:text-white block font-mono text-[11px]">IMD AWS</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Surface Stations</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="font-semibold text-slate-900 dark:text-white block font-mono text-[11px]">NOAA GFS</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">7-Day Physics Model</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="font-semibold text-slate-900 dark:text-white block font-mono text-[11px]">NASA GPM</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">IMERG Precipitation</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="font-semibold text-slate-900 dark:text-white block font-mono text-[11px]">Sentinel-1</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">SAR Inundation Map</span>
          </div>
        </div>
      </section>
    </div>
  );
};
