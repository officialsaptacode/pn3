import { type FetchOptions, httpClient } from "../lib/fetch-client";

export interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const courseService = {
  findAll: async (params?: any, options?: FetchOptions): Promise<Course[]> => {
    return httpClient.get<Course[]>("/api/courses", { params, ...options });
  },

  findOne: async (id: number, options?: FetchOptions): Promise<Course> => {
    return httpClient.get<Course>(`/api/courses/${id}`, options);
  },

  create: async (data: any, options?: FetchOptions): Promise<Course> => {
    return httpClient.post<Course>("/api/courses", data, options);
  },

  update: async (id: string | number, data: any, options?: FetchOptions): Promise<Course> => {
    return httpClient.patch<Course>(`/api/courses/${id}`, data, options);
  },

  delete: async (id: number, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/courses/${id}`, options);
  },

  getDropdown: async (options?: FetchOptions): Promise<Course[]> => {
    return httpClient.get<Course[]>("/api/courses/dropdown", options);
  },
};
