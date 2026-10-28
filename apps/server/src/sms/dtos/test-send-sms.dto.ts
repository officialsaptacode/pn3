import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class TestSendSmsDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @Matches(/^\+?[0-9]{7,15}$/, { message: "phoneNumber must be a valid phone number" })
  phoneNumber!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  message!: string;
}
