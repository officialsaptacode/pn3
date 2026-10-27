import { Type } from "class-transformer";
import {
  IsBooleanString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { CampaignStatus } from "@/generated";

export class SmsListQueryDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}

export class TemplateListQueryDto extends SmsListQueryDto {
  @IsBooleanString()
  @IsOptional()
  approved?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

export class CampaignListQueryDto extends SmsListQueryDto {
  @IsEnum(CampaignStatus)
  @IsOptional()
  status?: CampaignStatus;
}

export class CampaignAnalyticsQueryDto {
  @IsIn(["hour", "day"])
  @IsOptional()
  granularity?: "hour" | "day" = "hour";
}
