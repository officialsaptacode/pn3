import { log } from "node:console";
import { type ExecutionContext, Injectable } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AtGuard extends AuthGuard("jwt") {
	constructor(private reflector: Reflector) {
		super();
	}
	canActivate(context: ExecutionContext): any {
		const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}
		log(typeof super.canActivate(context));
		log(typeof isPublic);
		return super.canActivate(context); // this will execute jwt strategy
	}
}
