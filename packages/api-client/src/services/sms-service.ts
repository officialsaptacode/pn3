import { type FetchOptions, httpClient } from "../lib/fetch-client";
import type {
  SmsCampaignDetail,
  SmsCampaignItem,
  SmsListResult,
  SmsOverview,
  SmsTemplateItem,
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

  getOverview: async (options?: FetchOptions): Promise<SmsOverview> => {
    return httpClient.get<SmsOverview>("/api/sms/admin/overview", options);
  },
};
