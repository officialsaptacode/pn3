import { Injectable } from "@nestjs/common";
import { Role } from "@/generated";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        userName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        userName: true,
        role: true,
        avatar: {
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            type: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRole(id: number, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        userName: true,
        role: true,
      },
    });
  }
  async updateProfile(id: number, data: { avatarId?: number }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        avatarId: data.avatarId,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        role: true,
        avatar: {
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            type: true,
          },
        },
      },
    });
  }
}
