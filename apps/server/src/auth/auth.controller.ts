import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto, RegisterDto } from './dto'
import { GetCurrentUser, GetCurrentUserId, Public } from './decorator'
import { RtGuard } from './guard'
import { Tokens } from './types'
import { AuthEntities } from './entities'

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: RegisterDto): Promise<AuthEntities> {
    return this.authService.signup(dto)
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthDto): Promise<AuthEntities> {
    return this.authService.signin(dto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId)
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): Promise<Tokens> {
    return this.authService.refreshToken(userId, refreshToken)
  }
}
