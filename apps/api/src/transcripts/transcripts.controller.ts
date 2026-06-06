import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { renameSpeakerSchema, type RenameSpeakerInput } from "@daka/shared";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { TranscriptsService } from "./transcripts.service";

@UseGuards(JwtAuthGuard)
@Controller("transcripts")
export class TranscriptsController {
  constructor(private readonly transcripts: TranscriptsService) {}

  @Patch(":id/speaker")
  renameSpeaker(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(renameSpeakerSchema)) body: RenameSpeakerInput,
  ) {
    return this.transcripts.renameSpeaker(id, body.from, body.to);
  }
}
