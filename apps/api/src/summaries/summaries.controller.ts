import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { createSummarySchema, type CreateSummaryInput } from "@daka/shared";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SummariesService } from "./summaries.service";

@UseGuards(JwtAuthGuard)
@Controller("recordings/:id/summaries")
export class SummariesController {
  constructor(private readonly summaries: SummariesService) {}

  @Get()
  list(@Param("id") recordingId: string) {
    return this.summaries.listForRecording(recordingId);
  }

  @Post()
  create(
    @Param("id") recordingId: string,
    @Body(new ZodValidationPipe(createSummarySchema)) body: CreateSummaryInput,
  ) {
    return this.summaries.generate(recordingId, body.templateKluc);
  }
}
