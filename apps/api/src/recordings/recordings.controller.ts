import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  consentSchema,
  createRecordingSchema,
  listRecordingsQuerySchema,
  shareRecordingSchema,
  updateRecordingSchema,
  uploadUrlSchema,
  type ConsentInput,
  type CreateRecordingInput,
  type ListRecordingsQuery,
  type ShareRecordingInput,
  type UpdateRecordingInput,
  type UploadUrlInput,
} from "@daka/shared";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser, type AuthUser } from "../auth/current-user.decorator";
import { RecordingsService } from "./recordings.service";

@UseGuards(JwtAuthGuard)
@Controller("recordings")
export class RecordingsController {
  constructor(private readonly recordings: RecordingsService) {}

  @Post("upload-url")
  uploadUrl(
    @Body(new ZodValidationPipe(uploadUrlSchema)) body: UploadUrlInput,
  ) {
    return this.recordings.createUploadUrl(body);
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createRecordingSchema))
    body: CreateRecordingInput,
  ) {
    return this.recordings.create(user, body);
  }

  /** Upload audia priamo cez API (multipart). Pole súboru: "audio". */
  @Post("upload")
  @UseInterceptors(FileInterceptor("audio"))
  upload(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: { buffer: Buffer; mimetype?: string; originalname?: string },
    @Body() body: Record<string, string>,
  ) {
    const meta = {
      nazov: body.nazov ?? "Nahrávka",
      typ: (["KONZULTACIA", "PORADA", "DODAVATEL", "INE"].includes(body.typ)
        ? body.typ
        : "INE") as CreateRecordingInput["typ"],
      jazyk: body.jazyk || "sk",
      zdroj: (["WEB", "MOBIL", "UPLOAD"].includes(body.zdroj)
        ? body.zdroj
        : "WEB") as CreateRecordingInput["zdroj"],
      dlzkaSek: body.dlzkaSek ? Number(body.dlzkaSek) : undefined,
      poznamka: body.poznamka || undefined,
    };
    return this.recordings.uploadAudio(user, file, meta);
  }

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(listRecordingsQuerySchema))
    query: ListRecordingsQuery,
  ) {
    return this.recordings.list(user, query);
  }

  @Get(":id")
  get(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.recordings.get(user, id);
  }

  @Get(":id/audio")
  audio(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.recordings.getAudioUrl(user, id);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateRecordingSchema))
    body: UpdateRecordingInput,
  ) {
    return this.recordings.update(user, id, body);
  }

  @Delete(":id")
  remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.recordings.remove(user, id);
  }

  @Post(":id/consent")
  consent(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(consentSchema)) body: ConsentInput,
  ) {
    return this.recordings.addConsent(user, id, body);
  }

  @Post(":id/highlights")
  highlight(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: { casSek: number; poznamka?: string },
  ) {
    return this.recordings.addHighlight(user, id, body.casSek, body.poznamka);
  }

  @Post(":id/share")
  share(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(shareRecordingSchema)) body: ShareRecordingInput,
  ) {
    return this.recordings.setShares(user, id, body.userId);
  }

  @Delete(":id/share/:userId")
  unshare(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Param("userId") userId: string,
  ) {
    return this.recordings.removeShare(user, id, userId);
  }
}
