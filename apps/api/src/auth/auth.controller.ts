import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { loginSchema, type LoginInput } from "@daka/shared";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUser, type AuthUser } from "./current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body(new ZodValidationPipe(loginSchema)) body: LoginInput) {
    return this.auth.login(body);
  }

  @Post("refresh")
  refresh(@Body("refreshToken") refreshToken: string) {
    return this.auth.refresh(refreshToken);
  }

  @Post("logout")
  logout() {
    // Stateless JWT — odhlásenie rieši klient zahodením tokenov.
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
