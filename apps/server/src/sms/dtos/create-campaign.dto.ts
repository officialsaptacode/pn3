import { Type } from "class-transformer";
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateCampaignDto {
  @IsString()
  @MinLength(1)
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  templateId: number;

  // Either a reachable CSV URL or the raw CSV content (one of the two is required).
  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ["http", "https"] })
  @MaxLength(2000)
  csvUrl?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2_000_000)
  csvText?: string;

  @IsOptional()
  @IsISO8601()
  sendAt?: string;
}
