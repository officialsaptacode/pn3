import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, Author } from "../types";

export const authorService = {
  findAll: async (options?: FetchOptions): Promise<ApiResponse<Author[]>> => {
    return httpClient.get<ApiResponse<Author[]>>("/api/authors", options);
  },

  findAllAdmin: async (options?: FetchOptions): Promise<ApiResponse<Author[]>> => {
    return httpClient.get<ApiResponse<Author[]>>("/api/authors/admin", options);
  },

  findOne: async (id: number | string, options?: FetchOptions): Promise<Author> => {
    return httpClient.get<Author>(`/api/authors/${id}`, options);
  },

  create: async (data: any, options?: FetchOptions): Promise<Author> => {
    return httpClient.post<Author>("/api/authors", data, options);
  },

  update: async (id: number | string, data: any, options?: FetchOptions): Promise<Author> => {
    return httpClient.patch<Author>(`/api/authors/${id}`, data, options);
  },

  delete: async (id: number | string, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/authors/${id}`, options);
  },
};
