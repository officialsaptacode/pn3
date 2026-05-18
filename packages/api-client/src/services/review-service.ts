import { type FetchOptions, httpClient } from "../lib/fetch-client";

import type { ApiResponse, Review } from "../types";

export const reviewService = {
  findAll: async (options?: FetchOptions): Promise<ApiResponse<Review[]>> => {
    return httpClient.get<ApiResponse<Review[]>>("/api/reviews/admin", options);
  },

  delete: async (id: number | string, options?: FetchOptions): Promise<void> => {
    return httpClient.delete(`/api/reviews/${id}`, options);
  },
};
