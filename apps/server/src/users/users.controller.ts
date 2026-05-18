import { Body, Controller, Get, Param, ParseIntPipe, Patch, Put, UseGuards } from "@nestjs/common";
import { GetCurrentUserId, Roles } from "@/auth/decorator";
import { AtGuard, RolesGuard } from "@/auth/guard";
import { Role } from "@/generated";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get("admin")
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(":id/role")
  updateRole(@Param("id", ParseIntPipe) id: number, @Body("role") role: Role) {
    return this.usersService.updateRole(id, role);
  }
  @UseGuards(AtGuard)
  @Get("profile")
  getProfile(@GetCurrentUserId() userId: number) {
    return this.usersService.findOne(userId);
  }

  @UseGuards(AtGuard)
  @Patch("profile")
  updateProfile(@GetCurrentUserId() userId: number, @Body() data: { avatarId?: number }) {
    return this.usersService.updateProfile(userId, data);
  }
}
