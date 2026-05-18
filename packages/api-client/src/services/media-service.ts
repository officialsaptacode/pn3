import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, FolderStats, Media, MediaQuery } from "../types";

export const mediaService = {
  findAll: async (query?: MediaQuery, options?: FetchOptions): Promise<ApiResponse<Media[]>> => {
    return httpClient.get<ApiResponse<Media[]>>("/api/media", {
      params: query as Record<string, any>,
      ...options,
    });
  },

  getFolders: async (options?: FetchOptions): Promise<FolderStats[]> => {
    return httpClient.get<FolderStats[]>("/api/media/folders", options);
  },

  upload: async (
    file: File,
    folder?: string,
    caption?: string,
    altText?: string,
    options?: FetchOptions,
  ): Promise<Media> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }
    if (caption) {
      formData.append("caption", caption);
    }
    if (altText) {
      formData.append("altText", altText);
    }

    return httpClient.post<Media>("/api/media", formData, options);
  },

  bulkUpload: async (files: File[], folder?: string, options?: FetchOptions): Promise<Media[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (folder) {
      formData.append("folder", folder);
    }

    return httpClient.post<Media[]>("/api/media/bulk-upload", formData, options);
  },

  update: async (
    id: number,
    data: { caption?: string; altText?: string; folder?: string },
    options?: FetchOptions,
  ): Promise<Media> => {
    return httpClient.patch<Media>(`/api/media/${id}`, data, options);
  },

  delete: async (id: number, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/media/${id}`, options);
  },
};
