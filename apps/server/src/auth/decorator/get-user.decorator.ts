import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { JwtPayloadWithRt } from "../types";

export const GetCurrentUser = createParamDecorator(
	(data: keyof JwtPayloadWithRt | undefined, ctx: ExecutionContext) => {
		const request: any = ctx.switchToHttp().getRequest();
		if (data) {
			return request.user[data];
		}
		return request.user;
	},
);
