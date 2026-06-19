import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  glossaryCreateSchema,
  UserRole,
  type GlossaryCreateInput,
} from "@daka/shared";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { GlossaryService } from "./glossary.service";

@UseGuards(JwtAuthGuard)
@Controller("glossary")
export class GlossaryController {
  constructor(private readonly glossary: GlossaryService) {}

  @Get()
  list() {
    return this.glossary.list();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(
    @Body(new ZodValidationPipe(glossaryCreateSchema)) body: GlossaryCreateInput,
  ) {
    return this.glossary.create(body);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.glossary.remove(id);
  }
}
