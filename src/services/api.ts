const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch health');
  return res.json();
}

export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
}

export async function fetchCatalog() {
  const res = await fetch(`${API_BASE}/catalog`);
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}

export async function fetchForecast(horizon: number = 24, lat?: number, lon?: number, locationName?: string) {
  let url = `${API_BASE}/forecast?horizon=${horizon}`;
  if (lat !== undefined && lon !== undefined) {
    url += `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  }
  if (locationName) {
    url += `&location_name=${encodeURIComponent(locationName)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather data is currently unavailable. Please try again.');
  return res.json();
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality = addr.village || addr.town || addr.city || addr.suburb || addr.hamlet || addr.county;
      const state = addr.state;
      if (locality && state) return `${locality}, ${state}`;
      if (locality) return locality;
      if (data.display_name) return data.display_name.split(',').slice(0, 2).join(',').trim();
    }
  } catch {
    // fallback
  }
  return `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
}

export async function fetchMapLayers(horizon: number = 24) {
  const res = await fetch(`${API_BASE}/map/layers?horizon=${horizon}`);
  if (!res.ok) throw new Error('Failed to fetch map layers');
  return res.json();
}

export async function fetchStations() {
  const res = await fetch(`${API_BASE}/stations`);
  if (!res.ok) throw new Error('Failed to fetch stations');
  return res.json();
}

export async function fetchEvaluation() {
  const res = await fetch(`${API_BASE}/evaluation`);
  if (!res.ok) throw new Error('Failed to fetch evaluation');
  return res.json();
}

export async function uploadDataset(sourceType: string, file: File) {
  const formData = new FormData();
  formData.append('source_type', sourceType);
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

export async function fetchBulletin(horizon: number = 24, format: string = 'markdown') {
  const res = await fetch(`${API_BASE}/report/export?horizon=${horizon}&format=${format}`);
  if (!res.ok) throw new Error('Failed to fetch bulletin');
  return res.json();
}

export async function searchLocations(query: string) {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      name: r.name,
      admin1: r.admin1 || '',
      country: r.country || '',
      latitude: r.latitude,
      longitude: r.longitude,
      elevation_m: r.elevation || 200,
      type: r.feature_code === 'PPLA' ? 'State Capital' : (r.feature_code === 'PPL' ? 'Town / Village' : 'District / City')
    }));
  } catch {
    return [];
  }
}

// Module 1: Auth & User Profile APIs

export async function getCurrentUserProfile(userId: string) {
  const res = await fetch(`${API_BASE}/auth/me?user_id=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

export async function updateUserPreferences(payload: {
  user_id: string;
  default_location?: string;
  alert_threshold?: string;
  temp_unit?: string;
  rain_unit?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/preferences`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update preferences');
  return res.json();
}

// Module 7: Analytics API
export async function fetchAnalytics(days: number = 7) {
  const res = await fetch(`${API_BASE}/analytics?days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

// Module 8: Admin APIs
export async function fetchAdminSummary() {
  const res = await fetch(`${API_BASE}/admin/summary`);
  if (!res.ok) throw new Error('Failed to fetch admin summary');
  return res.json();
}

export async function fetchAdminUsers() {
  const res = await fetch(`${API_BASE}/admin/users`);
  if (!res.ok) throw new Error('Failed to fetch admin users');
  return res.json();
}
