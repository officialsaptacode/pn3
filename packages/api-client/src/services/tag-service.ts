import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, Tag } from "../types";

export const tagService = {
  findAll: async (options?: FetchOptions): Promise<ApiResponse<Tag[]>> => {
    return httpClient.get<ApiResponse<Tag[]>>("/api/tags", options);
  },

  findOne: async (id: number, options?: FetchOptions): Promise<Tag> => {
    return httpClient.get<Tag>(`/api/tags/${id}`, options);
  },

  create: async (data: any, options?: FetchOptions): Promise<Tag> => {
    return httpClient.post<Tag>("/api/tags", data, options);
  },

  update: async (id: number, data: any, options?: FetchOptions): Promise<Tag> => {
    return httpClient.patch<Tag>(`/api/tags/${id}`, data, options);
  },

  delete: async (id: number, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/tags/${id}`, options);
  },
};
