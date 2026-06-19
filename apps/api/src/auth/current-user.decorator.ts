import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { UserRole } from "@daka/shared";

export interface AuthUser {
  id: string;
  email: string;
  meno: string;
  role: UserRole;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthUser;
  },
);
