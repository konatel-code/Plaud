import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser, type AuthUser } from "../auth/current-user.decorator";
import { UsersService } from "./users.service";

/** Endpointy dostupné každému prihlásenému (napr. výber kolegu pri zdieľaní). */
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersPublicController {
  constructor(private readonly users: UsersService) {}

  @Get("colleagues")
  colleagues(@CurrentUser() user: AuthUser) {
    return this.users.colleagues(user.id);
  }
}
