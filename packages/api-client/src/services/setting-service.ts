import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { Setting } from "../types";

export const settingService = {
  getAll: async (options?: FetchOptions): Promise<Setting[]> => {
    return httpClient.get<Setting[]>("/api/settings", options);
  },

  getByKey: async (key: string, options?: FetchOptions): Promise<Setting> => {
    return httpClient.get<Setting>(`/api/settings/${key}`, options);
  },

  create: async (
    data: { key: string; value: string },
    options?: FetchOptions,
  ): Promise<Setting> => {
    return httpClient.post<Setting>("/api/settings", data, options);
  },

  update: async (
    key: string,
    data: { value: string },
    options?: FetchOptions,
  ): Promise<Setting> => {
    return httpClient.patch<Setting>(`/api/settings/${key}`, data, options);
  },

  delete: async (key: string, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/settings/${key}`, options);
  },
};
