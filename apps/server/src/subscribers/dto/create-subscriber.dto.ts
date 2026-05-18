import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateSubscriberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
