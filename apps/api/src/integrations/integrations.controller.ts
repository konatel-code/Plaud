import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@daka/shared";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CurrentUser, type AuthUser } from "../auth/current-user.decorator";
import { CrmService } from "./crm.service";

@UseGuards(JwtAuthGuard)
@Controller()
export class IntegrationsController {
  constructor(private readonly crm: CrmService) {}

  @Post("recordings/:id/crm")
  sendToCrm(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.crm.sendClientProfile(id, user);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get("admin/integrations")
  list() {
    return this.crm.listEvents();
  }
}
