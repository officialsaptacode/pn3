import { type FetchOptions, httpClient } from "../lib/fetch-client";

import type { ApiResponse, Subscriber } from "../types";

export const subscriberService = {
  findAll: async (options?: FetchOptions): Promise<ApiResponse<Subscriber[]>> => {
    return httpClient.get<ApiResponse<Subscriber[]>>("/api/subscribers", options);
  },

  sendNewsletter: async (
    data: { subject: string; message: string },
    options?: FetchOptions,
  ): Promise<any> => {
    return httpClient.post("/api/subscribers/send", data, options);
  },
};
