import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	userName: string

	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	password: string

}
