import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@daka/shared";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UsersService } from "./users.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("admin/users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list() {
    return this.users.list();
  }

  @Post()
  create(
    @Body()
    body: {
      email: string;
      meno: string;
      password: string;
      role?: UserRole;
      pobocka?: string;
    },
  ) {
    return this.users.create(body);
  }
}
