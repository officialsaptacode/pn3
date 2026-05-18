import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, Blog } from "../types";

export const blogService = {
  findAll: async (params?: any, options?: FetchOptions): Promise<ApiResponse<Blog[]>> => {
    return httpClient.get<ApiResponse<Blog[]>>("/api/blogs/admin", {
      params,
      ...options,
    });
  },

  create: async (data: any, options?: FetchOptions): Promise<Blog> => {
    return httpClient.post<Blog>("/api/blogs", data, options);
  },

  update: async (id: number | string, data: any, options?: FetchOptions): Promise<Blog> => {
    return httpClient.patch<Blog>(`/api/blogs/${id}`, data, options);
  },

  delete: async (id: number | string, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/blogs/${id}`, options);
  },

  togglePublish: async (
    id: number | string,
    isPublished: boolean,
    options?: FetchOptions,
  ): Promise<Blog> => {
    return httpClient.patch<Blog>(`/api/blogs/${id}/toggle-publish`, { isPublished }, options);
  },

  getPopular: async (limit: number = 10, options?: FetchOptions): Promise<Blog[]> => {
    return httpClient.get<Blog[]>("/api/blogs/popular", {
      params: { limit },
      ...options,
    });
  },

  findByCategory: async (
    tagSlug: string,
    params?: any,
    options?: FetchOptions,
  ): Promise<ApiResponse<Blog[]>> => {
    return httpClient.get<ApiResponse<Blog[]>>(`/api/blogs/category/${tagSlug}`, {
      params,
      ...options,
    });
  },

  findOne: async (id: number, options?: FetchOptions): Promise<Blog> => {
    return httpClient.get<Blog>(`/api/blogs/${id}`, options);
  },

  getBySlug: async (slug: string, options?: FetchOptions): Promise<Blog> => {
    return httpClient.get<Blog>(`/api/blogs/${slug}`, options);
  },

  findByAuthor: async (authorId: number, options?: FetchOptions): Promise<ApiResponse<Blog[]>> => {
    return httpClient.get<ApiResponse<Blog[]>>(`/api/blogs/authors/${authorId}`, options);
  },
};
