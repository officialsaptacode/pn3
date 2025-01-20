import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy {
	constructor(config: ConfigService) {
		super({
			datasources: {
				db: {
					url: config.get('DATABASE_URL'),
				},
			},
		})
	}
	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}

	async cleanDb() {
		return this.$transaction([
			this.users.deleteMany({}),
			// this.post.deleteMany({}),
			// this.comment.deleteMany({}),
		])
	}
}
