import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, Departure, DepartureQuery } from "../types";

export const departureService = {
  findAll: async (
    params?: DepartureQuery,
    options?: FetchOptions,
  ): Promise<ApiResponse<Departure[]>> => {
    return httpClient.get<ApiResponse<Departure[]>>("/api/departures", {
      params: params as Record<string, any>,
      ...options,
    });
  },

  findOne: async (id: number, options?: FetchOptions): Promise<Departure> => {
    return httpClient.get<Departure>(`/api/departures/${id}`, options);
  },

  create: async (data: any, options?: FetchOptions): Promise<Departure> => {
    return httpClient.post<Departure>("/api/departures", data, options);
  },

  update: async (id: number, data: any, options?: FetchOptions): Promise<Departure> => {
    return httpClient.patch<Departure>(`/api/departures/${id}`, data, options);
  },

  delete: async (id: number, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/departures/${id}`, options);
  },
};
