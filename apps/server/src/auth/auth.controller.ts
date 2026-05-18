import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { GetCurrentUser, GetCurrentUserId, Public } from "./decorator";
import { AuthDto, RegisterDto } from "./dto";
import { RtGuard } from "./guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  private getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as any,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      ...(isProduction && { domain: ".ana.com.np" }), // Share across subdomains
    };
  }

  @Public()
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signup(dto);
    const options = this.getCookieOptions();
    console.log(`[Auth] Signup cookie set. Prod: ${process.env.NODE_ENV === "production"}`);
    res.cookie("refreshToken", tokens.refreshToken, options);
    return {
      accessToken: tokens.accessToken,
      role: tokens.role,
      message: "Registration successful",
    };
  }

  @Public()
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signin(dto);
    const options = this.getCookieOptions();
    console.log(`[Auth] Signin cookie set. Prod: ${process.env.NODE_ENV === "production"}`);
    res.cookie("refreshToken", tokens.refreshToken, options);
    return { accessToken: tokens.accessToken, role: tokens.role, message: "Login successful" };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number, @Res({ passthrough: true }) res: Response) {
    const options = this.getCookieOptions();
    res.clearCookie("refreshToken", options);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshToken(userId, refreshToken);
    const options = this.getCookieOptions();
    console.log(`[Auth] Refresh cookie set. Prod: ${process.env.NODE_ENV === "production"}`);
    res.cookie("refreshToken", tokens.refreshToken, options);
    return {
      accessToken: tokens.accessToken,
      role: tokens.role,
      message: "Token refreshed successfully",
    };
  }
}
