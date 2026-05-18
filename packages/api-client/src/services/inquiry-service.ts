import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type { ApiResponse, CreateInquiryDto, InquiryResponse } from "../types";

export const inquiryService = {
  findAll: async (
    params?: any,
    options?: FetchOptions,
  ): Promise<ApiResponse<InquiryResponse[]>> => {
    return httpClient.get<ApiResponse<InquiryResponse[]>>("/api/inquiries", { ...options, params });
  },

  findOne: async (id: number | string, options?: FetchOptions): Promise<InquiryResponse> => {
    return httpClient.get<InquiryResponse>(`/api/inquiries/${id}`, options);
  },

  create: async (data: CreateInquiryDto, options?: FetchOptions): Promise<InquiryResponse> => {
    return httpClient.post<InquiryResponse>("/api/inquiries", data, options);
  },

  updateStatus: async (
    id: number | string,
    status: string,
    options?: FetchOptions,
  ): Promise<InquiryResponse> => {
    return httpClient.patch<InquiryResponse>(`/api/inquiries/${id}/status`, { status }, options);
  },
};
