import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  templateUpdateSchema,
  UserRole,
  type TemplateUpdateInput,
} from "@daka/shared";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { TemplatesService } from "./templates.service";

@UseGuards(JwtAuthGuard)
@Controller("templates")
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Get()
  list() {
    return this.templates.list();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get("all")
  listAll() {
    return this.templates.listAll();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(templateUpdateSchema)) body: TemplateUpdateInput,
  ) {
    return this.templates.update(id, body);
  }
}
