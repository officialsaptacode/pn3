import { IsNotEmpty, IsString } from "class-validator";

export class SendNewsletterDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
