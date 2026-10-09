import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, BookingResponse, CreateBookingDto } from "../types";

export const bookingService = {
  findAll: async (
    params?: any,
    options?: FetchOptions,
  ): Promise<ApiResponse<BookingResponse[]>> => {
    return httpClient.get<ApiResponse<BookingResponse[]>>("/api/bookings/admin", {
      ...options,
      params,
    });
  },

  getAnalytics: async (options?: FetchOptions): Promise<any> => {
    return httpClient.get("/api/bookings/analytics", options);
  },

  updateStatus: async (
    id: number | string,
    status: string,
    options?: FetchOptions,
  ): Promise<BookingResponse> => {
    return httpClient.put<BookingResponse>(`/api/bookings/${id}/status`, { status }, options);
  },

  confirm: async (id: number | string, options?: FetchOptions): Promise<BookingResponse> => {
    return httpClient.post<BookingResponse>(`/api/bookings/${id}/confirm`, {}, options);
  },

  findOne: async (id: number | string, options?: FetchOptions): Promise<BookingResponse> => {
    return httpClient.get<BookingResponse>(`/api/bookings/${id}`, options);
  },

  create: async (data: CreateBookingDto, options?: FetchOptions): Promise<BookingResponse> => {
    return httpClient.post<BookingResponse>("/api/bookings", data, options);
  },
};
