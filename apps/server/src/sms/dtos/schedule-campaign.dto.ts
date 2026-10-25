import { Type } from "class-transformer";
import { IsISO8601, IsOptional, IsString, Min } from "class-validator";

export class ScheduleCampaignDto {
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  sendAt?: Date;

  @IsOptional()
  @IsString()
  @Min(1)
  name?: string;
}
