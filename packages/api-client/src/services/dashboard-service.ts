import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { DashboardActivity, DashboardChartData, DashboardStats } from "../types";

export const dashboardService = {
  getStats: async (options?: FetchOptions): Promise<DashboardStats> => {
    return httpClient.get<DashboardStats>("/api/dashboard/stats", options);
  },

  getRecentActivity: async (options?: FetchOptions): Promise<DashboardActivity> => {
    return httpClient.get<DashboardActivity>("/api/dashboard/recent-activity", options);
  },

  getChartData: async (options?: FetchOptions): Promise<DashboardChartData[]> => {
    return httpClient.get<DashboardChartData[]>("/api/dashboard/chart-data", options);
  },
};
