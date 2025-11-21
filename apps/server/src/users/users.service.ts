import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) { }

	async findAll() {
		return this.prisma.users.findMany({
			select: {
				id: true,
				email: true,
				userName: true,
				role: true,
				createdAt: true,
			},
		});
	}
}
