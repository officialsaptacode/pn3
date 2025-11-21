import { Controller, Get, UseGuards } from "@nestjs/common";
import { AtGuard } from "../auth/guard";
import { UsersService } from "./users.service";

@Controller("api/users")
@UseGuards(AtGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Get()
	findAll() {
		return this.usersService.findAll();
	}
}
