import React, { useState, useEffect } from 'react';
import { 
  X, User, Shield, MapPin, Sliders, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { UserProfile } from '../types';
import { updateUserPreferences } from '../services/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  onSelectLocation?: (name: string, lat: number, lon: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  onSelectLocation,
}) => {
  // Preferences form state
  const [prefLocation, setPrefLocation] = useState(currentUser?.default_location || 'Safdarjung, New Delhi');
  const [prefAlertThreshold, setPrefAlertThreshold] = useState<'ALL' | 'MODERATE' | 'HIGH' | 'CRITICAL'>(
    currentUser?.alert_threshold || 'MODERATE'
  );
  const [prefTempUnit, setPrefTempUnit] = useState<'C' | 'F'>(currentUser?.temp_unit || 'C');
  const [prefRainUnit, setPrefRainUnit] = useState<'mm' | 'in'>(currentUser?.rain_unit || 'mm');
  const [prefSuccess, setPrefSuccess] = useState<string | null>(null);
  const [prefError, setPrefError] = useState<string | null>(null);
  const [prefSaving, setPrefSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setPrefLocation(currentUser.default_location);
      setPrefAlertThreshold(currentUser.alert_threshold);
      setPrefTempUnit(currentUser.temp_unit);
      setPrefRainUnit(currentUser.rain_unit);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setPrefSaving(true);
    setPrefSuccess(null);
    setPrefError(null);
    try {
      const res = await updateUserPreferences({
        user_id: currentUser.id,
        default_location: prefLocation,
        alert_threshold: prefAlertThreshold,
        temp_unit: prefTempUnit,
        rain_unit: prefRainUnit,
      });
      onUserChange(res.user);
      try {
        localStorage.setItem('rainshield_user', JSON.stringify(res.user));
      } catch {}
      setPrefSuccess('Personal preferences updated successfully.');
      setTimeout(() => setPrefSuccess(null), 3000);
    } catch (err: any) {
      setPrefError('Failed to save preferences.');
    } finally {
      setPrefSaving(false);
    }
  };

  const name = currentUser?.name || 'System User';
  const role = currentUser?.role || 'admin';
  const email = currentUser?.email || 'user@delhi-weather.gov.in';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                User Profile & Preferences
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Manage your personalized alert thresholds and regional defaults
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-6">
            {/* Profile Card Header */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {name}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase ${
                      role === 'admin' 
                        ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                        : role === 'official'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {role}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {email}
                  </span>
                </div>
              </div>
            </div>

            {/* Preferences Form */}
            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  User Preferences & Early Warning Thresholds
                </h3>
              </div>

              {prefSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{prefSuccess}</span>
                </div>
              )}

              {prefError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{prefError}</span>
                </div>
              )}

              {/* Default Primary Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Default Study Location</span>
                </label>
                <input
                  type="text"
                  value={prefLocation}
                  onChange={(e) => setPrefLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Safdarjung, New Delhi"
                  required
                />
              </div>

              {/* Alert Notification Threshold */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Early Warning Notification Trigger</span>
                </label>
                <select
                  value={prefAlertThreshold}
                  onChange={(e: any) => setPrefAlertThreshold(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Alerts (Green, Yellow, Orange, Red)</option>
                  <option value="MODERATE">Moderate & Above (Yellow, Orange, Red) - Recommended</option>
                  <option value="HIGH">High Severity Only (Orange, Red)</option>
                  <option value="CRITICAL">Critical Disasters Only (Red Alert)</option>
                </select>
              </div>

              {/* Units Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Temperature Unit
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPrefTempUnit('C')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition ${
                        prefTempUnit === 'C'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-[#0B0F19] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Celsius (°C)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrefTempUnit('F')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition ${
                        prefTempUnit === 'F'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-[#0B0F19] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Fahrenheit (°F)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Precipitation Unit
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPrefRainUnit('mm')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition ${
                        prefRainUnit === 'mm'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-[#0B0F19] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Millimeters (mm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrefRainUnit('in')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition ${
                        prefRainUnit === 'in'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-[#0B0F19] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Inches (in)
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={prefSaving}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{prefSaving ? 'Saving Changes...' : 'Save Preferences'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
