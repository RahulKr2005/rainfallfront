import React from 'react';
import { WeatherBackgroundCondition } from '../types';

interface WeatherBackgroundProps {
  condition: WeatherBackgroundCondition;
  isNight?: boolean;
  theme?: 'light' | 'dark';
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  condition,
  isNight = false,
  theme = 'light',
}) => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-1000 select-none"
      aria-hidden="true"
    >
      {/* Clean Static Professional Background Gradient (No Video or Canvas Animation) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-[#080C14] via-[#0B0F19] to-[#05070B]' 
            : 'bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50/30'
        }`}
      />
    </div>
  );
};
