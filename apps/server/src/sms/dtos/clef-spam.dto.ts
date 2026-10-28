import { IsString, MaxLength } from "class-validator";

export class ClefSpamCheckDto {
  @IsString()
  @MaxLength(1000)
  text!: string;
}
