import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { AvailableRoute, CategoryMetadata, NavbarItem, NavbarItemDto } from "../types";

export const navbarService = {
  getNavbar: async (options?: FetchOptions): Promise<NavbarItem[]> => {
    return httpClient.get<NavbarItem[]>("/api/public/navbar", options);
  },

  getAvailableRoutes: async (options?: FetchOptions): Promise<AvailableRoute[]> => {
    return httpClient.get<AvailableRoute[]>("/api/public/navbar/routes", options);
  },

  getCategories: async (options?: FetchOptions): Promise<CategoryMetadata[]> => {
    return httpClient.get<CategoryMetadata[]>("/api/public/navbar/categories", options);
  },

  bulkUpdate: async (items: NavbarItemDto[], options?: FetchOptions): Promise<NavbarItem[]> => {
    return httpClient.post<NavbarItem[]>("/api/navbar/bulk", items, options);
  },
};
