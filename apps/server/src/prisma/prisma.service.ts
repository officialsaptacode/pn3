import {
	Injectable,
	type OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@/generated/client";
import { PrismaPg } from '@prisma/adapter-pg'
@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy {
	constructor(config: ConfigService) {
		const adapter = new PrismaPg({
			connectionString: config.get("DATABASE_URL")
		})
		super({
			adapter
		});
	}
	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}

	async cleanDb() {
		return this.$transaction([
			this.user.deleteMany({}),
			// this.post.deleteMany({}),
			// this.comment.deleteMany({}),
		]);
	}
}
