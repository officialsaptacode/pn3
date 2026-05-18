import type { User } from "@workspace/api-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user: User, accessToken: string) =>
        set({ user, accessToken, isAuthenticated: true }),
      setAccessToken: (accessToken: string) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      // We only persist user info, not the access token if we want it purely in memory for security,
      // but for better UX (refresh handling) persisting it is okay if short lived,
      // or we rely on refresh token to re-hydrate it on app load.
      // For this implementation, we'll persist for simplicity but rely on interceptor to validate.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    },
  ),
);
