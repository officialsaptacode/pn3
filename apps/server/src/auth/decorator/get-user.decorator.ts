import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { JwtPayloadWithRt } from "@/auth/types";

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
