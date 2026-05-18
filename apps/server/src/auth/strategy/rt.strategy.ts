import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy, type StrategyOptionsWithRequest } from "passport-jwt";
import { JwtPayload, JwtPayloadWithRt } from "@/auth/types";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwtRT") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refreshToken, // requires cookie-parser
      ]),
      secretOrKey: config.get<string>("JWT_REFRESH_SECRET_KEY"),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException("Refresh token cookie not found");
    return { ...payload, refreshToken };
  }
}
