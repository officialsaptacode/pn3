import type {
  Tokens as AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@workspace/api-client";
import { apiClient as axiosClient } from "@workspace/api-client";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    return axiosClient.post<AuthResponse>("/api/auth/signin", credentials);
  },

  register: async (credentials: RegisterCredentials) => {
    return axiosClient.post<AuthResponse>("/api/auth/signup", credentials);
  },

  logout: async () => {
    await axiosClient.post("/api/auth/logout", {});
  },

  refreshToken: async () => {
    return axiosClient.post<AuthResponse>("/api/auth/refresh-token", {});
  },
};
