import { type FetchOptions, httpClient } from "../lib/fetch-client";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  findAll: async (params?: any, options?: FetchOptions): Promise<Category[]> => {
    return httpClient.get<Category[]>("/api/categories", { params, ...options });
  },

  findOne: async (id: number, options?: FetchOptions): Promise<Category> => {
    return httpClient.get<Category>(`/api/categories/${id}`, options);
  },

  create: async (data: any, options?: FetchOptions): Promise<Category> => {
    return httpClient.post<Category>("/api/categories", data, options);
  },

  update: async (id: string | number, data: any, options?: FetchOptions): Promise<Category> => {
    return httpClient.patch<Category>(`/api/categories/${id}`, data, options);
  },

  delete: async (id: number, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/categories/${id}`, options);
  },

  getDropdown: async (options?: FetchOptions): Promise<Category[]> => {
    return httpClient.get<Category[]>("/api/categories/dropdown", options);
  },
};
