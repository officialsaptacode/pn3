import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, Destination, HierarchicalCountry } from "../types";

export const destinationService = {
  findAll: async (options?: FetchOptions): Promise<ApiResponse<Destination[]>> => {
    return httpClient.get<ApiResponse<Destination[]>>("/api/destinations", options);
  },

  findAllAdmin: async (options?: FetchOptions): Promise<ApiResponse<Destination[]>> => {
    return httpClient.get<ApiResponse<Destination[]>>("/api/destinations/admin", options);
  },

  getHierarchical: async (options?: FetchOptions): Promise<HierarchicalCountry[]> => {
    return httpClient.get<HierarchicalCountry[]>("/api/destinations/hierarchical", options);
  },

  findOne: async (id: number | string, options?: FetchOptions): Promise<Destination> => {
    return httpClient.get<Destination>(`/api/destinations/${id}`, options);
  },

  getBySlug: async (slug: string, options?: FetchOptions): Promise<Destination> => {
    return httpClient.get<Destination>(`/api/destinations/slug/${slug}`, options);
  },

  create: async (data: any, options?: FetchOptions): Promise<Destination> => {
    return httpClient.post<Destination>("/api/destinations", data, options);
  },

  update: async (id: number | string, data: any, options?: FetchOptions): Promise<Destination> => {
    return httpClient.patch<Destination>(`/api/destinations/${id}`, data, options);
  },

  delete: async (id: number | string, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/destinations/${id}`, options);
  },
};
