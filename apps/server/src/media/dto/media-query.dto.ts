import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { MediaType } from "@/generated";

export class MediaQueryDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  folder?: string;

  @IsEnum(MediaType)
  @IsOptional()
  type?: MediaType;
}
