import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto, RegisterDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Tokens } from './types'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: RegisterDto) {
    //genereate password
    const hash = await this.hashedData(dto.password)
    try {
      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          username: dto.userName,
          hash,
        },
      })
      const tokens = await this.signToken(
        user.id,
        user.email,
        user.role,
        user.username
      )
      await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
      return tokens
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken')
        }
      }
      throw error
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.users.findUnique({
      where: {
        username: dto.userName,
      },
    })

    if (!user) {
      throw new ForbiddenException('Credentials Incorrect')
    }

    // compare password

    const pwMatches = await argon.verify(user.hash, dto.password)
    // if password incorrect throw exception

    if (!pwMatches) {
      throw new ForbiddenException('Credentials Incorrect')
    }
    // send back the user

    const tokens = await this.signToken(
      user.id,
      user.email,
      user.role,
      user.username
    )
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await this.hashedData(refreshToken)
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }

  async logout(userId: number) {
    await this.prisma.users.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })
  }

  async refreshToken(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied')
    }
    const refreshTokenMatches = await argon.verify(user.hashedRt, rt)
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied')
    }
    const tokens = await this.signToken(
      user.id,
      user.email,
      user.role,
      user.username
    )
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  hashedData(data: string) {
    return argon.hash(data)
  }

  async signToken(
    userId: number,
    email: string,
    role: string,
    username: string
  ): Promise<Tokens> {
    const payload = {
      sub: userId,
      username,
      email,
      role,
    }
    const secretAT = this.config.get<string>('JWT_SECRET_KEY')
    const secretRT = this.config.get<string>('JWT_REFRESH_SECRET_KEY')

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 15 * 10,
        secret: secretAT,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: secretRT,
      }),
    ])

    return {
      accessToken: at,
      refreshToken: rt,
      role,
    }
  }
}
