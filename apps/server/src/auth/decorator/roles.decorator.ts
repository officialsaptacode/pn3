import { SetMetadata } from "@nestjs/common";
import { Role } from "@/generated";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
