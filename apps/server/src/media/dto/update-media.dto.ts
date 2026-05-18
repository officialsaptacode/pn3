import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateMediaDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsString()
  @IsOptional()
  folder?: string;

  @IsInt()
  @IsOptional()
  displayOrder?: number;
}
