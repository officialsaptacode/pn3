import { Type } from "class-transformer";
import { IsInt, IsISO8601, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateCampaignDto {
  @IsString()
  @MinLength(1)
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  templateId: number;

  @IsString()
  @MinLength(1)
  csvUrl: string;

  @IsOptional()
  @IsISO8601()
  sendAt?: string;
}
