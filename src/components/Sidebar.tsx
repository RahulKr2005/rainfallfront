import React from 'react';
import { 
  LayoutDashboard, CloudSun, CloudRain, Map, ShieldAlert, 
  Calendar, BarChart3, Bookmark, HelpCircle, ChevronLeft, 
  ChevronRight, X, Shield, Activity, Radio, Waves, Bell, 
  User, LogOut
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigateTo: (page: string) => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  hasActiveWarning?: boolean;
  warningLevel?: string;
  studyArea?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigateTo,
  onOpenProfile,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  hasActiveWarning,
  warningLevel,
  studyArea = 'Delhi-NCR',
}) => {
  const primaryNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, description: 'Overview & Key Metrics' },
    { id: 'weather', label: 'Weather', icon: CloudSun, description: 'Atmospheric Observations' },
    { id: 'rain', label: 'Rainfall', icon: CloudRain, description: 'Hourly & Lead Projections' },
    { id: 'risk', label: 'Flood Risk & Map', icon: Waves, description: 'Risk Status & Geospatial Map' },
    { 
      id: 'warnings', 
      label: 'Alerts', 
      icon: Bell, 
      description: 'Alerts & Safety Instructions',
      badge: hasActiveWarning ? (warningLevel || 'ALERT') : null,
      badgeColor: warningLevel === 'RED' ? 'bg-red-500' : warningLevel === 'ORANGE' ? 'bg-amber-600' : warningLevel === 'YELLOW' ? 'bg-amber-400 text-slate-900' : 'bg-emerald-500'
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Trends & Historical Data' },
    { id: 'profile', label: 'Profile', icon: User, description: 'Account & Preferences' },
  ];

  const secondaryNavItems = [
    { id: 'forecast', label: '7-Day Forecast', icon: Calendar, description: 'Extended Weekly Outlook' },
    { id: 'saved', label: 'Saved Locations', icon: Bookmark, description: 'Villages, Towns & Cities' },
    { id: 'about', label: 'Citizen Guide', icon: HelpCircle, description: 'Advisories & Methodology' },
  ];

  const handleItemClick = (id: string) => {
    if (id === 'profile') {
      if (onOpenProfile) {
        onOpenProfile();
      } else {
        onNavigateTo('profile');
      }
    } else {
      onNavigateTo(id);
    }
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col justify-between transition-all duration-300 ease-in-out border-r
          ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-64'}
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
          bg-white/85 dark:bg-[#080C14]/85 backdrop-blur-md border-slate-200/60 dark:border-slate-800/60 shadow-lg lg:shadow-none select-none`}
      >
        {/* Top Header / Branding */}
        <div className="flex flex-col">
          <div className="h-16 px-3.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
            <button
              onClick={() => handleItemClick('home')}
              className="flex items-center gap-2.5 text-left overflow-hidden group focus:outline-none"
              title="Rainfall & Inundation AI"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-[#131C2E] p-0.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-center shrink-0 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors">
                <img
                  src="/logo.png"
                  alt="Rainfall & Inundation AI Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="min-w-0 transition-opacity duration-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                      Rainfall &amp; Inundation AI
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate block">
                    Predict • Prepare • Protect
                  </span>
                </div>
              )}
            </button>

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Operational Status Pill */}
          {(!isCollapsed || isMobileOpen) && (
            <div className="mx-3 mt-3 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Operational</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{studyArea}</span>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 no-scrollbar">
          {/* Group 1: Real-Time Monitoring */}
          <div className="space-y-1">
            {(!isCollapsed || isMobileOpen) && (
              <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block mb-1">
                Monitoring
              </span>
            )}
            {primaryNavItems.map((item) => {
              const isActive = activePage === item.id || 
                (item.id === 'dashboard' && (activePage === 'home' || activePage === 'dashboard')) ||
                (item.id === 'risk' && (activePage === 'risk' || activePage === 'map'));
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {(!isCollapsed || isMobileOpen) && item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold text-white uppercase ${item.badgeColor || 'bg-blue-500'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && !isMobileOpen && item.badge && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Group 2: Research & Information */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            {(!isCollapsed || isMobileOpen) && (
              <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block mb-1">
                Platform & Data
              </span>
            )}
            {secondaryNavItems.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed && !isMobileOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: System Telemetry & Collapse Button */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2 bg-slate-50/50 dark:bg-[#080C14]">
          {(!isCollapsed || isMobileOpen) && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Weather & Alerts</span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Real-time monitoring system
              </p>
            </div>
          )}

          {/* Logout Action Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full py-2 px-3 rounded-lg text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition text-xs font-medium"
              title="Logout from dashboard"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
            </button>
          )}

          {/* Desktop Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition text-xs font-medium"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Navigation</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
