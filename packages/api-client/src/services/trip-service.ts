import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, Trip, TripQuery } from "../types";

export const tripService = {
  getAll: async (params?: TripQuery, options?: FetchOptions): Promise<ApiResponse<Trip[]>> => {
    return httpClient.get<ApiResponse<Trip[]>>("/api/trips", {
      params: params as Record<string, any>,
      ...options,
    });
  },

  findAll: async (params?: any, options?: FetchOptions): Promise<ApiResponse<Trip[]>> => {
    return httpClient.get<ApiResponse<Trip[]>>("/api/trips/admin", { ...options, params });
  },

  getBySlug: async (slug: string, options?: FetchOptions): Promise<Trip> => {
    return httpClient.get<Trip>(`/api/trips/${slug}`, options);
  },

  getFeatured: async (options?: FetchOptions): Promise<Trip[]> => {
    const data = await httpClient.get<ApiResponse<Trip[]>>("/api/trips", {
      params: { featured: true, limit: 6 },
      ...options,
    });
    return data.data;
  },

  getSpecialities: async (options?: FetchOptions): Promise<Trip[]> => {
    const data = await httpClient.get<ApiResponse<Trip[]>>("/api/trips", {
      params: { isSpeciality: true, limit: 6 },
      ...options,
    });
    return data.data;
  },

  getPackages: async (options?: FetchOptions): Promise<Trip[]> => {
    const data = await httpClient.get<ApiResponse<Trip[]>>("/api/trips", {
      params: { isPackage: true, limit: 6 },
      ...options,
    });
    return data.data;
  },

  getById: async (id: number | string, options?: FetchOptions): Promise<Trip> => {
    return httpClient.get<Trip>(`/api/trips/${id}`, options);
  },

  findOne: async (id: number | string, options?: FetchOptions): Promise<Trip> => {
    return httpClient.get<Trip>(`/api/trips/${id}`, options);
  },

  getStats: async (options?: FetchOptions): Promise<any> => {
    return httpClient.get("/api/trips/stats", options);
  },

  create: async (data: any, options?: FetchOptions): Promise<Trip> => {
    return httpClient.post<Trip>("/api/trips", data, options);
  },

  update: async (id: number, data: any, options?: FetchOptions): Promise<Trip> => {
    return httpClient.patch<Trip>(`/api/trips/${id}`, data, options);
  },

  getByPath: async (
    country: string,
    destination: string,
    trip: string,
    options?: FetchOptions,
  ): Promise<Trip> => {
    return httpClient.get<Trip>(`/api/trips/by-path/${country}/${destination}/${trip}`, options);
  },

  getRecommendations: async (limit: number = 5, options?: FetchOptions): Promise<Trip[]> => {
    return httpClient.get<Trip[]>(`/api/trips/recommendations?limit=${limit}`, options);
  },

  getTopPackages: async (
    destinationId: number,
    limit: number = 5,
    options?: FetchOptions,
  ): Promise<Trip[]> => {
    return httpClient.get<Trip[]>(
      `/api/trips/top-packages/${destinationId}?limit=${limit}`,
      options,
    );
  },

  getByTourCategory: async (tourCategory: string, options?: FetchOptions): Promise<Trip[]> => {
    const data = await httpClient.get<ApiResponse<Trip[]>>("/api/trips", {
      params: { limit: 100 } as Record<string, any>,
      ...options,
    });

    // If category is "all", return all trips without filtering
    if (tourCategory === "all") {
      return data.data ?? [];
    }

    // Convert URL slug to DB enum format: "peak-climbing" → "PEAK_CLIMBING"
    const dbCategory = tourCategory.toUpperCase().replace(/-/g, "_");

    return (data.data ?? []).filter(
      (t: any) =>
        Array.isArray(t.category) ? t.category.includes(dbCategory) : t.category === dbCategory, // fallback for safety
    );
  },

  getByRegion: async (region: string, options?: FetchOptions): Promise<Trip[]> => {
    const data = await httpClient.get<ApiResponse<Trip[]>>("/api/trips", {
      params: { limit: 100 } as Record<string, any>,
      ...options,
    });

    // Filter trips by region (case-insensitive match)
    return (data.data ?? []).filter((t: any) => t.region?.toLowerCase() === region.toLowerCase());
  },

  delete: async (id: number, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/trips/${id}`, options);
  },
};
