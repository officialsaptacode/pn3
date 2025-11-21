import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { AtGuard } from "./auth/guard";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		UsersModule,
		AuthModule,
		ConfigModule.forRoot({
			isGlobal: true, // Makes the ConfigModule available globally
			envFilePath: ".env", // Path to your .env file
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
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AtGuard,
		},
	],
})
export class AppModule {}
