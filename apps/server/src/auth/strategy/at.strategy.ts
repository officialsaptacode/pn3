import { Injectable } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { JwtPayload } from "../types";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get<string>("JWT_SECRET_KEY") || "defaultSecretKey",
		});
	}

	validate(payload: JwtPayload) {
		return payload;
	}
}
