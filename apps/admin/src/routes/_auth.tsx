import { createFileRoute, redirect } from "@tanstack/react-router";
import DashboardLayout from "@/components/dashboard-layout";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: DashboardLayout,
});
