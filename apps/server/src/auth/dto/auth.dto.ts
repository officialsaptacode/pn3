import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  userName: string

  @IsString()
  @IsNotEmpty()
  password: string
}
