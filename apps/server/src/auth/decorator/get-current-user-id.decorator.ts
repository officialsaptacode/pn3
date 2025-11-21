import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
export const GetCurrentUserId = createParamDecorator(
	(_: undefined, ctx: ExecutionContext) => {
		const request: any = ctx.switchToHttp().getRequest();
		return request.user.sub;
	},
);
