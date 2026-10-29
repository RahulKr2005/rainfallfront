/**
 * Human-Friendly Weather Narrative Generator
 * Translates raw meteorological and hydrological data into plain, accessible language
 * for everyday users from villages, towns, and cities.
 */

export interface TimeOfDayPeriod {
  label: string;
  timeRange: string;
  temp: number;
  condition: string;
  rainChance: string;
  iconType: 'sun' | 'cloud-sun' | 'cloud-rain' | 'cloud' | 'moon';
  advice: string;
}

export function getHumanRainSummary(predictedAccumMm: number, hourlySeries: any[] = []): {
  headline: string;
  subtext: string;
  safetyLevel: 'safe' | 'caution' | 'warning' | 'danger';
  willRain: boolean;
} {
  // Check if upcoming hours have rain
  const maxHourly = Math.max(...hourlySeries.map((h) => h.precip_mm || 0), 0);
  const totalRain = predictedAccumMm || 0;

  if (totalRain >= 64.5 || maxHourly >= 15.0) {
    return {
      headline: 'Heavy rain expected — waterlogging likely in low areas',
      subtext: `Around ${Math.round(totalRain)} mm rainfall forecasted. Avoid waterlogged underpasses and low-lying roads.`,
      safetyLevel: 'danger',
      willRain: true,
    };
  }

  if (totalRain >= 15.6 || maxHourly >= 4.0) {
    return {
      headline: 'Moderate rain expected — carry an umbrella or raincoat',
      subtext: `About ${Math.round(totalRain)} mm rain expected today. Safe to go out, but expect intermittent showers.`,
      safetyLevel: 'caution',
      willRain: true,
    };
  }

  if (totalRain > 0.5 || maxHourly > 0.2) {
    return {
      headline: 'Light rain showers or drizzle possible',
      subtext: `Passing showers (~${totalRain.toFixed(1)} mm). Generally comfortable to step outside.`,
      safetyLevel: 'safe',
      willRain: true,
    };
  }

  return {
    headline: 'No significant rain expected today',
    subtext: 'Weather will remain mostly dry. Clear conditions for travel and outdoor work.',
    safetyLevel: 'safe',
    willRain: false,
  };
}

export function getHumanComfortSummary(
  tempC: number,
  feelsLikeC: number,
  humidityPct: number,
  windKmh: number
): {
  headline: string;
  outdoorAdvice: string;
  clothingTip: string;
} {
  const diff = feelsLikeC - tempC;

  if (tempC >= 38) {
    return {
      headline: 'Very hot afternoon — drink plenty of water',
      outdoorAdvice: 'Try to stay indoors during peak noon hours (12 PM – 3 PM).',
      clothingTip: 'Wear lightweight cotton clothes and keep a water bottle handy.',
    };
  }

  if (tempC >= 32) {
    if (humidityPct >= 70) {
      return {
        headline: `Feels like ${Math.round(feelsLikeC)}° — warm and humid weather`,
        outdoorAdvice: 'Outdoor work is fine, but you will feel sweat and humidity.',
        clothingTip: 'Comfortable light clothes recommended.',
      };
    }
    return {
      headline: `Warm afternoon (${Math.round(tempC)}°)`,
      outdoorAdvice: 'Comfortable outdoors with occasional sunshine.',
      clothingTip: 'Standard summer or monsoon wear.',
    };
  }

  if (tempC >= 22) {
    return {
      headline: 'Pleasant and comfortable weather',
      outdoorAdvice: 'Great time to go out, travel, or do outdoor work.',
      clothingTip: 'Comfortable everyday clothes.',
    };
  }

  if (tempC >= 15) {
    return {
      headline: 'Mild and cool weather',
      outdoorAdvice: 'Very comfortable outdoors, especially during morning and evening.',
      clothingTip: 'A light layer or jacket is helpful in the evening.',
    };
  }

  return {
    headline: 'Cold weather',
    outdoorAdvice: 'Dress warmly when stepping outside in early morning or late night.',
    clothingTip: 'Warm woolens or jacket recommended.',
  };
}

export function getTimeOfDayBreakdown(
  hourlySeries: any[] = [],
  currentTemp: number = 30
): TimeOfDayPeriod[] {
  // Group hourly entries or derive realistic 4-part periods of the day
  const morningHours = hourlySeries.filter((h) => {
    const hour = parseInt(h.time?.slice(11, 13) || '0', 10);
    return hour >= 6 && hour < 12;
  });
  const afternoonHours = hourlySeries.filter((h) => {
    const hour = parseInt(h.time?.slice(11, 13) || '0', 10);
    return hour >= 12 && hour < 17;
  });
  const eveningHours = hourlySeries.filter((h) => {
    const hour = parseInt(h.time?.slice(11, 13) || '0', 10);
    return hour >= 17 && hour < 21;
  });
  const nightHours = hourlySeries.filter((h) => {
    const hour = parseInt(h.time?.slice(11, 13) || '0', 10);
    return hour >= 21 || hour < 6;
  });

  const getAvg = (arr: any[], key: string, fallback: number) => {
    if (!arr.length) return fallback;
    const sum = arr.reduce((acc, item) => acc + (item[key] || 0), 0);
    return Math.round((sum / arr.length) * 10) / 10;
  };

  const getRain = (arr: any[]) => {
    if (!arr.length) return 0;
    return arr.reduce((acc, item) => acc + (item.precip_mm || 0), 0);
  };

  const mRain = getRain(morningHours);
  const aRain = getRain(afternoonHours);
  const eRain = getRain(eveningHours);
  const nRain = getRain(nightHours);

  const mTemp = Math.round(getAvg(morningHours, 'temp_c', currentTemp - 3));
  const aTemp = Math.round(getAvg(afternoonHours, 'temp_c', currentTemp + 2));
  const eTemp = Math.round(getAvg(eveningHours, 'temp_c', currentTemp));
  const nTemp = Math.round(getAvg(nightHours, 'temp_c', currentTemp - 4));

  return [
    {
      label: 'Morning',
      timeRange: '6 AM – 12 PM',
      temp: mTemp,
      condition: mRain > 0.5 ? 'Passing light showers' : 'Pleasant breeze & clouds',
      rainChance: mRain > 0.5 ? `${Math.round(mRain * 10) / 10} mm rain` : 'No rain',
      iconType: mRain > 0.5 ? 'cloud-rain' : 'cloud-sun',
      advice: 'Good time for morning walk or farm / market tasks.',
    },
    {
      label: 'Afternoon',
      timeRange: '12 PM – 5 PM',
      temp: aTemp,
      condition: aRain > 1.0 ? 'Afternoon rain showers' : 'Warm and humid',
      rainChance: aRain > 0.5 ? `${Math.round(aRain * 10) / 10} mm rain` : 'Mostly dry',
      iconType: aRain > 0.5 ? 'cloud-rain' : 'sun',
      advice: 'Peak warmth of the day. Stay hydrated.',
    },
    {
      label: 'Evening',
      timeRange: '5 PM – 9 PM',
      temp: eTemp,
      condition: eRain > 1.0 ? 'Scattered rain showers' : 'Cooler breeze setting in',
      rainChance: eRain > 0.5 ? `${Math.round(eRain * 10) / 10} mm rain` : 'Low chance of rain',
      iconType: eRain > 0.5 ? 'cloud-rain' : 'cloud',
      advice: eRain > 0.5 ? 'Keep an umbrella if stepping out.' : 'Pleasant evening for travel.',
    },
    {
      label: 'Night',
      timeRange: '9 PM – 6 AM',
      temp: nTemp,
      condition: nRain > 0.5 ? 'Light nighttime drizzle' : 'Cool & calm night',
      rainChance: nRain > 0.5 ? `${Math.round(nRain * 10) / 10} mm rain` : 'Dry night',
      iconType: nRain > 0.5 ? 'cloud-rain' : 'moon',
      advice: 'Comfortable night temperatures.',
    },
  ];
}

export function getWindHumanText(windKmh: number): {
  speedText: string;
  feeling: string;
} {
  if (windKmh < 6) {
    return { speedText: `${Math.round(windKmh)} km/h`, feeling: 'Wind is calm • Barely noticeable breeze' };
  }
  if (windKmh < 18) {
    return { speedText: `${Math.round(windKmh)} km/h`, feeling: 'Gentle pleasant breeze • Trees sway gently' };
  }
  if (windKmh < 30) {
    return { speedText: `${Math.round(windKmh)} km/h`, feeling: 'Moderate wind • Dust and loose paper may blow' };
  }
  return { speedText: `${Math.round(windKmh)} km/h`, feeling: 'Strong gusty winds • Be cautious outdoors' };
}

export function getHumidityHumanText(humidityPct: number): {
  pctText: string;
  feeling: string;
} {
  if (humidityPct < 40) {
    return { pctText: `${Math.round(humidityPct)}%`, feeling: 'Dry air • Skin may feel dry' };
  }
  if (humidityPct < 65) {
    return { pctText: `${Math.round(humidityPct)}%`, feeling: 'Comfortable air • Normal moisture' };
  }
  if (humidityPct < 80) {
    return { pctText: `${Math.round(humidityPct)}%`, feeling: 'Humid air • Sweat will evaporate slowly' };
  }
  return { pctText: `${Math.round(humidityPct)}%`, feeling: 'Very sticky and humid air' };
}

export function getVisibilityHumanText(visKm: number): {
  visText: string;
  feeling: string;
} {
  if (visKm >= 8) {
    return { visText: `${visKm} km`, feeling: 'Very clear visibility • Great for driving & flights' };
  }
  if (visKm >= 4) {
    return { visText: `${visKm} km`, feeling: 'Normal visibility • Slight haze or moisture' };
  }
  if (visKm >= 2) {
    return { visText: `${visKm} km`, feeling: 'Moderate haze or mist • Drive with headlights' };
  }
  return { visText: `${visKm} km`, feeling: 'Dense fog or heavy rain mist • Low visibility' };
}
