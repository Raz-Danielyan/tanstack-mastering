import { API_CONFIG } from './configs';
import {
  Coordinates,
  ForecastData,
  GeocodingResponse,
  WeatherData,
} from './types';

class WeatherApi {
  private createUtl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appId: API_CONFIG.API_KEY,
      ...params,
    });

    return `${endpoint}?${searchParams.toString()}`;
  }
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createUtl(`${API_CONFIG.BASE_URL}/weather`, {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });

    return this.fetchData<WeatherData>(url);
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.createUtl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });

    return this.fetchData<ForecastData>(url);
  }

  async reverseGeoCode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.createUtl(`${API_CONFIG.GEO}/reverse`, {
      lat,
      lon,
      limit: 1,
    });

    return this.fetchData<GeocodingResponse[]>(url);
  }

  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    const url = this.createUtl(`${API_CONFIG.GEO}/direct`, {
      q: query,
      limit: '5',
    });

    return this.fetchData<GeocodingResponse[]>(url);
  }
}

export const weatherApi = new WeatherApi();
