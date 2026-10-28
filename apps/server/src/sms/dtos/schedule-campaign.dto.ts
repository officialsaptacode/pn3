import { IsISO8601, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ScheduleCampaignDto {
  @IsOptional()
  @IsISO8601()
  sendAt?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;
}
