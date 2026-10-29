export interface WarningInfo {
  code: string;
  category: string;
  level: "GREEN" | "YELLOW" | "ORANGE" | "RED";
  description: string;
  action: string;
}

export interface PredictionData {
  horizon_hours: number;
  predicted_accum_mm: number;
  persistence_baseline_mm: number;
  raw_gfs_mm: number;
  warning: WarningInfo;
  model_metadata: {
    algorithm: string;
    features_used: string[];
    benchmarked_skill_vs_persistence_pct: number;
  };
}

export interface HourlyForecastItem {
  time: string;
  precip_mm: number;
  cape: number;
  temp_c?: number;
  humidity_pct?: number;
  wind_kmh?: number;
  apparent_temp_c?: number;
  pressure_hpa?: number;
}

export interface DailyForecastItem {
  date: string;
  temp_max_c: number;
  temp_min_c: number;
  sunrise: string;
  sunset: string;
  precip_sum_mm: number;
}

export interface ForecastResponse {
  study_area: string;
  location_name?: string;
  coordinates?: { lat: number; lon: number };
  horizon_hours: number;
  issue_time_utc: string;
  issue_time_ist: string;
  valid_time_utc: string;
  valid_time_ist: string;
  is_live_data?: boolean;
  data_classification?: {
    current_weather?: string;
    rainfall_forecast?: string;
    flood_risk?: string;
    alerts?: string;
  };
  prediction: PredictionData;
  supporting_evidence: {
    gfs_nwp_accum_mm: number;
    gpm_satellite_recent_mm: number;
    station_observed_24h_mm: number;
    atmospheric_cape_j_kg: number;
    relative_humidity_pct: number;
    upstream_discharge_cusecs: number;
    upstream_alert: string;
    temperature_c?: number;
    feels_like_c?: number;
    wind_speed_kmh?: number;
    wind_direction_deg?: number;
    wind_direction_cardinal?: string;
    pressure_hpa?: number;
    visibility_km?: number;
    hourly_series?: HourlyForecastItem[];
    daily_forecast?: DailyForecastItem[];
  };
  daily_forecast?: DailyForecastItem[];
  data_freshness: {
    gfs_cycle: string;
    gpm_imerg: string;
    radar_status: string;
  };
  research_notice: string;
}

export interface GridPoint {
  lat: number;
  lon: number;
  elevation_m: number;
  slope_deg: number;
  twi: number;
  landcover_class: number;
  tfsi_score: number;
  is_inundated: number;
  flood_risk: string;
}

export interface Station {
  station_id: string;
  station_name: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  rainfall_accum_24h_mm?: number;
  rain_rate_mmh?: number;
  temperature_c?: number;
  humidity_pct?: number;
  qc_flag?: string;
}

export interface UpstreamGauge {
  gauge_id: string;
  name: string;
  latitude: number;
  longitude: number;
  location: string;
  danger_level_cusecs?: number;
  warning_level_m?: number;
  danger_level_m?: number;
  highest_flood_level_m?: number;
}

export interface MapLayersResponse {
  study_area: string;
  forecast_rain_used_mm: number;
  upstream_discharge_used_cusecs: number;
  summary: {
    estimated_inundated_area_sqkm: number;
    inundated_cells_count: number;
    mean_susceptibility_tfsi: number;
    max_susceptibility_tfsi: number;
  };
  grid_points: GridPoint[];
  hydrological_features: {
    yamuna_river: [number, number][];
    najafgarh_drain: [number, number][];
    barapullah_drain: [number, number][];
  };
  stations: Station[];
  upstream_gauges: UpstreamGauge[];
  disclaimer: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  official_url: string;
  citation: string;
  product_version: string;
  spatial_coverage: string;
  temporal_coverage: string;
  spatial_resolution: string;
  temporal_resolution: string;
  variables: string;
  units: string;
  access_requirements: string;
  licence: string;
  role: string;
  status: string;
  latency_notes: string;
}

export interface LocationResult {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  elevation_m?: number;
  type?: string;
}

// Module 1: User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'official' | 'admin';
  default_location: string;
  alert_threshold: 'ALL' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  temp_unit: 'C' | 'F';
  rain_unit: 'mm' | 'in';
  created_at: string;
}

// Module 7: Historical Analytics
export interface DailyAnalyticsRecord {
  date: string;
  day_name: string;
  rainfall_mm: number;
  temp_max_c: number;
  temp_min_c: number;
  relative_humidity_pct: number;
  wind_gust_kmh: number;
  tfsi_score: number;
  risk_level: string;
  upstream_discharge_cusecs: number;
  alert_issued: string;
}

export interface AnalyticsResponse {
  period_days: number;
  start_date: string;
  end_date: string;
  summary: {
    total_rainfall_mm: number;
    average_daily_rain_mm: number;
    rainy_days_count: number;
    peak_single_day_rain_mm: number;
    high_risk_days_count: number;
    prevailing_alert: string;
  };
  daily_records: DailyAnalyticsRecord[];
}

// Module 8: Admin Summary
export interface AdminSummary {
  total_users: number;
  total_dataset_sources: number;
  active_connected_sources: number;
  dataset_imports_logged: number;
  verified_evaluations: number;
  forecast_runs_logged: number;
  station_records_stored: number;
  system_health: string;
  last_audit_utc: string;
}

// Dynamic Weather Background States
export type WeatherBackgroundCondition = 
  | 'CLEAR' 
  | 'CLOUDY' 
  | 'RAIN' 
  | 'HEAVY_RAIN' 
  | 'THUNDERSTORM' 
  | 'FOG' 
  | 'NIGHT';
