import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
export const GetCurrentUserId = createParamDecorator((_: undefined, ctx: ExecutionContext) => {
  const request: Express.Request = ctx.switchToHttp().getRequest();
  return (request.user as any).sub;
});
