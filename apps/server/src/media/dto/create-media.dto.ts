import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { MediaType } from "@/generated";

export class CreateMediaDto {
  @IsEnum(MediaType)
  type: MediaType;

  @IsString()
  url: string;

  @IsString()
  filename: string;

  @IsString()
  mimeType: string;

  @IsInt()
  size: number;

  @IsInt()
  @IsOptional()
  width?: number;

  @IsInt()
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsString()
  @IsOptional()
  folder?: string;

  @IsString()
  s3Key: string;

  @IsString()
  s3Bucket: string;

  @IsInt()
  @IsOptional()
  uploadedBy?: number;
}
