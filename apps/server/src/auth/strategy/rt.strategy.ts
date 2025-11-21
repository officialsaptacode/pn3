import { Injectable } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import {
	ExtractJwt,
	Strategy,
	type StrategyOptionsWithRequest,
} from "passport-jwt";
import type { PrismaService } from "../../prisma/prisma.service";
import type { JwtPayload, JwtPayloadWithRt } from "../types";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwtRT") {
	constructor(config: ConfigService, _prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get<string>("JWT_REFRESH_SECRET_KEY"),
			passReqToCallback: true,
		} as StrategyOptionsWithRequest);
	}

	validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
		const authHeader = req.get("authorization");
		if (!authHeader) throw new Error("Authorization header not found");
		const refreshToken = authHeader.replace("Bearer ", "").trim();
		if (!refreshToken) throw new Error("Refresh token not found");
		return { ...payload, refreshToken };
	}
}
