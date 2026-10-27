import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type {
  SmsCampaignAnalytics,
  SmsCampaignDetail,
  SmsCampaignItem,
  SmsCampaignRecord,
  SmsListResult,
  SmsOverview,
  SmsTemplateItem,
  SmsTemplateRecord,
  SmsTemplateUpdateResult,
} from "../types";

export const smsService = {
  listTemplates: async (
    params?: any,
    options?: FetchOptions,
  ): Promise<SmsListResult<SmsTemplateItem>> => {
    return httpClient.get<SmsListResult<SmsTemplateItem>>("/api/sms/admin/templates", {
      ...options,
      params,
    });
  },

  listCampaigns: async (
    params?: any,
    options?: FetchOptions,
  ): Promise<SmsListResult<SmsCampaignItem>> => {
    return httpClient.get<SmsListResult<SmsCampaignItem>>("/api/sms/admin/campaigns", {
      ...options,
      params,
    });
  },

  getCampaign: async (id: number | string, options?: FetchOptions): Promise<SmsCampaignDetail> => {
    return httpClient.get<SmsCampaignDetail>(`/api/sms/admin/campaigns/${id}`, options);
  },

  getCampaignAnalytics: async (
    id: number | string,
    params?: any,
    options?: FetchOptions,
  ): Promise<SmsCampaignAnalytics> => {
    return httpClient.get<SmsCampaignAnalytics>(`/api/sms/admin/campaigns/${id}/analytics`, {
      ...options,
      params,
    });
  },

  getOverview: async (options?: FetchOptions): Promise<SmsOverview> => {
    return httpClient.get<SmsOverview>("/api/sms/admin/overview", options);
  },

  updateTemplate: async (
    id: number | string,
    body: { name?: string; content?: string; isApproved?: boolean },
    options?: FetchOptions,
  ): Promise<SmsTemplateUpdateResult> => {
    return httpClient.patch<SmsTemplateUpdateResult>(
      `/api/sms/admin/templates/${id}`,
      body,
      options,
    );
  },

  evaluateTemplate: async (
    id: number | string,
    options?: FetchOptions,
  ): Promise<SmsTemplateRecord> => {
    return httpClient.post<SmsTemplateRecord>(
      `/api/sms/admin/templates/${id}/evaluate`,
      {},
      options,
    );
  },

  scheduleCampaign: async (
    id: number | string,
    body: { sendAt?: string; name?: string },
    options?: FetchOptions,
  ): Promise<SmsCampaignRecord> => {
    return httpClient.patch<SmsCampaignRecord>(
      `/api/sms/admin/campaigns/${id}/schedule`,
      body,
      options,
    );
  },

  retryFailedJobs: async (
    id: number | string,
    options?: FetchOptions,
  ): Promise<{ retried: number }> => {
    return httpClient.post<{ retried: number }>(
      `/api/sms/admin/campaigns/${id}/retry`,
      {},
      options,
    );
  },
};
