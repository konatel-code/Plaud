import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import {
  updateClientProfileSchema,
  updateTaskSchema,
  type UpdateClientProfileInput,
  type UpdateTaskInput,
} from "@daka/shared";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { DomainService } from "./domain.service";

@UseGuards(JwtAuthGuard)
@Controller()
export class DomainController {
  constructor(private readonly domain: DomainService) {}

  @Patch("tasks/:id")
  updateTask(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateTaskSchema)) body: UpdateTaskInput,
  ) {
    return this.domain.updateTask(id, body);
  }

  @Patch("client-profiles/:id")
  updateClientProfile(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateClientProfileSchema))
    body: UpdateClientProfileInput,
  ) {
    return this.domain.updateClientProfile(id, body);
  }
}
