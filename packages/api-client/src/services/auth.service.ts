import { httpClient } from "../lib/fetch-client";
import type { LoginCredentials, Tokens } from "../types";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Assuming backend endpoint is /api/auth/signin
    const response = await httpClient.post<Tokens>("/api/auth/signin", credentials);
    return response;
  },

  logout: async () => {
    await httpClient.post("/api/auth/logout", {});
  },

  refreshToken: async () => {
    const response = await httpClient.post<Tokens>("/api/auth/refresh-token", {});
    return response;
  },
};
