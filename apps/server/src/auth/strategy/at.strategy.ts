import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy, type StrategyOptionsWithRequest } from "passport-jwt";
import { JwtPayload } from "@/auth/types";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get<string>("JWT_SECRET_KEY") || "defaultSecretKey",
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  validate(_req: Request, payload: JwtPayload) {
    return payload;
  }
}
