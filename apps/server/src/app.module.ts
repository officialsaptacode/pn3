import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { AuthModule } from "@/auth/auth.module";
import { AtGuard } from "@/auth/guard";
import { EmailModule } from "@/email/email.module";
import { MediaModule } from "@/media/media.module";
import { PrismaModule } from "@/prisma/prisma.module";
import { SubscribersModule } from "@/subscribers/subscribers.module";
import { UsersModule } from "@/users/users.module";
import { SettingsModule } from "./settings/settings.module";
import { SmsModule } from './sms/sms.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    SentryModule.forRoot(),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000,
        limit: 3,
      },
      {
        name: "medium",
        ttl: 10000,
        limit: 20,
      },
      {
        name: "long",
        ttl: 60000,
        limit: 100,
      },
    ]),
    UsersModule,
    MediaModule,
    EmailModule,
    SubscribersModule,
    SettingsModule,
    SmsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
