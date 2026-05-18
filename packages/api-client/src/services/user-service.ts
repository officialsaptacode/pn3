import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, User } from "../types";

export const userService = {
  findAll: async (options?: FetchOptions): Promise<ApiResponse<User[]>> => {
    return httpClient.get<ApiResponse<User[]>>("/api/users/admin", options);
  },

  updateRole: async (id: number, role: string, options?: FetchOptions) => {
    return httpClient.put(`/api/users/${id}/role`, { role }, options);
  },

  updateProfile: async (data: { avatarId?: number }, options?: FetchOptions) => {
    return httpClient.patch("/api/users/profile", data, options);
  },

  getProfile: async (options?: FetchOptions): Promise<User> => {
    return httpClient.get<User>("/api/users/profile", options);
  },
};
