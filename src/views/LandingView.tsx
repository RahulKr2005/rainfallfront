import React, { useState } from 'react';
import { 
  Shield, CloudSun, CloudRain, Waves, Map, ShieldAlert, 
  BarChart3, ArrowRight, CheckCircle2, Lock, Sun, Moon, 
  UserPlus, LogIn, Menu, X, PhoneCall 
} from 'lucide-react';

interface LandingViewProps {
  onNavigateTo: (page: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateTo,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePrimaryAction = () => {
    onNavigateTo('dashboard');
  };

  const handleGetStarted = () => {
    onNavigateTo('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. PUBLIC TOP NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#080C14]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-[#131C2E] p-0.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Rainfall & Inundation AI Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white block leading-tight">
                Rainfall &amp; Inundation AI
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block leading-tight">
                Predict • Prepare • Protect
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Desktop Dashboard Button */}
            <button
              onClick={() => onNavigateTo('dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-xs"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080C14] px-4 py-4 space-y-3">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateTo('dashboard'); }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-14 sm:pt-20 sm:pb-20 max-w-4xl mx-auto text-center space-y-6">
        {/* Brand Emblem */}
        <div className="flex justify-center mb-3">
          <div className="relative inline-flex items-center justify-center p-2 rounded-3xl bg-white/90 dark:bg-[#131C2E]/90 border border-slate-200/80 dark:border-slate-800 shadow-md backdrop-blur-md">
            <img
              src="/logo.png"
              alt="Rainfall & Inundation AI Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-contain"
            />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Heavy Rainfall & Flood Early Warning System
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Weather monitoring, rainfall forecasting and flood-risk intelligence for safer communities.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrimaryAction}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-xs"
          >
            <span>View Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold transition shadow-xs"
          >
            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Get Started</span>
          </button>
        </div>
      </section>

      {/* 3. PUBLIC OVERVIEW — 6 CORE CAPABILITY CARDS */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
            Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Early Warning & Monitoring Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Designed for municipal disaster authorities, emergency personnel, and village communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Current Weather */}
          <div className="p-5 rounded-xl bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs space-y-3 transition-all hover:border-blue-400 dark:hover:border-blue-700">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Current Weather</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                Atmospheric observations from automated IMD weather stations. Measures temperature, humidity, wind velocity, barometric pressure, and visibility.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Automatic Weather Station (AWS)</span>
            </div>
          </div>

          {/* Card 2: Rainfall Forecast */}
          <div className="p-5 rounded-xl bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs space-y-3 transition-all hover:border-blue-400 dark:hover:border-blue-700">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Rainfall Forecast</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                Hourly projections across Today, Next 24 Hours, 3 Days, and 7 Days powered by numerical weather prediction models.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Multi-Day Lead Projections</span>
            </div>
          </div>

          {/* Card 3: Flood Risk Prediction */}
          <div className="p-5 rounded-xl bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs space-y-3 transition-all hover:border-blue-400 dark:hover:border-blue-700">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Flood Risk Prediction</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                Classifies regional hazard into Low, Moderate, High, or Severe Risk using terrain factors and river discharge data.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Terrain & River Flow Analysis</span>
            </div>
          </div>

          {/* Card 4: Interactive Flood Map */}
          <div className="p-5 rounded-xl bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs space-y-3 transition-all hover:border-blue-400 dark:hover:border-blue-700">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Interactive Flood Map</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                Multi-layer map showing ground elevation, natural water flow, surface types, and local drainage channels.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Geospatial Map Layers</span>
            </div>
          </div>

          {/* Card 5: Early Warning Alerts */}
          <div className="p-5 rounded-xl bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs space-y-3 transition-all hover:border-blue-400 dark:hover:border-blue-700">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Early Warning Alerts</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                Color-coded warning levels (Green, Yellow, Orange, Red) accompanied by actionable safety instructions for communities.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Standardized Safety Advisories</span>
            </div>
          </div>

          {/* Card 6: Analytics & Historical Data */}
          <div className="p-5 rounded-xl bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs space-y-3 transition-all hover:border-blue-400 dark:hover:border-blue-700">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Analytics & Trends</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                Rainfall and weather trends over 7-day and 30-day periods to monitor patterns and changes over time.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Historical Trend Filtering</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS FLOWCHART */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Early Warning System Process
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            From raw weather observations to localized flood risk advisories.
          </p>
        </div>

        {/* Step-by-step Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 sm:gap-3 items-stretch">
          {[
            { step: '01', title: 'Weather Data', desc: 'Station and satellite observations' },
            { step: '02', title: 'Data Processing', desc: 'Quality checks and data alignment' },
            { step: '03', title: 'AI/ML Analysis', desc: 'Rainfall prediction algorithms' },
            { step: '04', title: 'Rainfall Forecast', desc: 'Hourly and daily predictions' },
            { step: '05', title: 'Flood Risk', desc: 'Terrain slope and drainage analysis' },
            { step: '06', title: 'Early Warning', desc: 'Safety alert triggers and levels' },
            { step: '07', title: 'Map & Dashboard', desc: 'Clear visual information for everyone' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 text-center flex flex-col justify-between space-y-2 shadow-xs transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {item.step}
                </span>
                {idx < 6 && (
                  <span className="hidden lg:inline text-slate-300 dark:text-slate-700">→</span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
        <div className="p-8 rounded-2xl bg-white/80 dark:bg-[#131C2E]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs space-y-4 transition-colors">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white dark:bg-[#0B0F19] p-1 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-center mx-auto">
            <img
              src="/logo.png"
              alt="Rainfall & Inundation AI Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Monitor Weather & Flood Risk in Your Area
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Get access to live weather observations, hourly rainfall forecasts, flood risk maps, and safety alerts for your location.
          </p>
          <div className="flex justify-center pt-2">
            <button
              onClick={() => onNavigateTo('dashboard')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. CLEAN PRODUCTION FOOTER */}
      <footer className="bg-white dark:bg-[#080C14] border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <img src="/logo.png" alt="Logo" className="w-5 h-5 rounded-md object-contain" />
              <span>Rainfall &amp; Inundation AI</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Heavy Rainfall Early Warning &amp; Inundation System
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            © 2026 Rainfall &amp; Inundation AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
