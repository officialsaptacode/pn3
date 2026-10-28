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

  // Access token lives 150 minutes (see AuthService.signToken) — cookie
  // expiry matches so the browser drops it at the same time.
  private getAccessCookieOptions() {
    return { ...this.getCookieOptions(), maxAge: 150 * 60 * 1000 };
  }

  @Public()
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signup(dto);
    const options = this.getCookieOptions();
    console.log(`[Auth] Signup cookie set. Prod: ${process.env.NODE_ENV === "production"}`);
    res.cookie("refreshToken", tokens.refreshToken, options);
    res.cookie("accessToken", tokens.accessToken, this.getAccessCookieOptions());
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
    res.cookie("accessToken", tokens.accessToken, this.getAccessCookieOptions());
    return { accessToken: tokens.accessToken, role: tokens.role, message: "Login successful" };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number, @Res({ passthrough: true }) res: Response) {
    const options = this.getCookieOptions();
    const accessOptions = this.getAccessCookieOptions();
    res.clearCookie("refreshToken", options);
    res.clearCookie("accessToken", accessOptions);
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
    res.cookie("accessToken", tokens.accessToken, this.getAccessCookieOptions());
    return {
      accessToken: tokens.accessToken,
      role: tokens.role,
      message: "Token refreshed successfully",
    };
  }
}
