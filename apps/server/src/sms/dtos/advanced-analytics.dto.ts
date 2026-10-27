import { IsISO8601, IsOptional } from "class-validator";
import { CampaignAnalyticsQueryDto } from "../dto/sms-query.dto";

export enum EngagementMetric {
  SENT_RATE = "sentRate",
  FAILED_RATE = "failedRate",
  OPT_OUT_RATE = "optOutRate",
}

export class AdvancedAnalyticsQueryDto extends CampaignAnalyticsQueryDto {
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;
}
