import { AuthGuard } from '@nestjs/passport'

export class RtGuard extends AuthGuard('jwtRT') {
	constructor() {
		super()
	}
}
