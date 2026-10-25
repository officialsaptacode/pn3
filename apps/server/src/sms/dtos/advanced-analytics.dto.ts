import { Type } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";
import { CampaignAnalyticsQueryDto } from "./sms-query.dto";

export enum EngagementMetric {
  SENT_RATE = "sentRate",
  FAILED_RATE = "failedRate",
  OPT_OUT_RATE = "optOutRate",
}

export class AdvancedAnalyticsQueryDto extends CampaignAnalyticsQueryDto {
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}
