import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import type {
  ConsentInput,
  CreateRecordingInput,
  ListRecordingsQuery,
  UpdateRecordingInput,
  UploadUrlInput,
} from "@daka/shared";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import type { AuthUser } from "../auth/current-user.decorator";
import {
  PROCESSING_QUEUE,
  type ProcessRecordingJob,
} from "../queue/queue.constants";

@Injectable()
export class RecordingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    @InjectQueue(PROCESSING_QUEUE)
    private readonly queue: Queue<ProcessRecordingJob>,
  ) {}

  createUploadUrl(input: UploadUrlInput) {
    return this.storage.createUploadUrl(input.pripona, input.contentType);
  }

  async create(user: AuthUser, input: CreateRecordingInput) {
    const recording = await this.prisma.recording.create({
      data: {
        ownerId: user.id,
        nazov: input.nazov,
        typ: input.typ,
        audioKey: input.audioKey,
        dlzkaSek: input.dlzkaSek,
        jazyk: input.jazyk,
        zdroj: input.zdroj,
        poznamka: input.poznamka,
        stav: "UPLOADED",
      },
    });

    await this.queue.add("process", { recordingId: recording.id });
    return recording;
  }

  async list(user: AuthUser, query: ListRecordingsQuery) {
    const where: Record<string, unknown> = {};
    if (user.role === "AGENT") where.ownerId = user.id;
    if (query.typ) where.typ = query.typ;
    if (query.stav) where.stav = query.stav;
    if (query.q) {
      const q = query.q;
      where.OR = [
        { nazov: { contains: q, mode: "insensitive" } },
        { poznamka: { contains: q, mode: "insensitive" } },
        { transcript: { plnyText: { contains: q, mode: "insensitive" } } },
        { summaries: { some: { markdown: { contains: q, mode: "insensitive" } } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.recording.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.perPage,
        take: query.perPage,
        include: { owner: { select: { meno: true } } },
      }),
      this.prisma.recording.count({ where }),
    ]);
    return { items, total, page: query.page, perPage: query.perPage };
  }

  async get(user: AuthUser, id: string) {
    const recording = await this.prisma.recording.findUnique({
      where: { id },
      include: {
        transcript: { include: { segments: { orderBy: { poradie: "asc" } } } },
        summaries: {
          include: { template: true, tasks: true },
          orderBy: { createdAt: "desc" },
        },
        clientProfile: true,
        supplierDeal: true,
        highlights: { orderBy: { casSek: "asc" } },
        consent: true,
        owner: { select: { meno: true } },
      },
    });
    if (!recording) throw new NotFoundException("Nahrávka neexistuje");
    this.assertCanAccess(user, recording.ownerId);
    return recording;
  }

  async update(user: AuthUser, id: string, input: UpdateRecordingInput) {
    await this.getOwned(user, id);
    return this.prisma.recording.update({ where: { id }, data: input });
  }

  async remove(user: AuthUser, id: string) {
    const recording = await this.getOwned(user, id);
    if (recording.audioKey) {
      await this.storage.deleteObject(recording.audioKey).catch(() => undefined);
    }
    await this.prisma.recording.delete({ where: { id } });
    return { ok: true };
  }

  async getAudioUrl(user: AuthUser, id: string) {
    const recording = await this.getOwned(user, id);
    if (!recording.audioKey) throw new NotFoundException("Audio chýba");
    return { url: await this.storage.getDownloadUrl(recording.audioKey) };
  }

  async addConsent(user: AuthUser, id: string, input: ConsentInput) {
    await this.getOwned(user, id);
    return this.prisma.consentRecord.upsert({
      where: { recordingId: id },
      update: { sposob: input.sposob, poznamka: input.poznamka },
      create: { recordingId: id, sposob: input.sposob, poznamka: input.poznamka },
    });
  }

  async addHighlight(
    user: AuthUser,
    id: string,
    casSek: number,
    poznamka?: string,
  ) {
    await this.getOwned(user, id);
    return this.prisma.highlight.create({
      data: { recordingId: id, casSek, poznamka },
    });
  }

  // --- pomocné ---

  private assertCanAccess(user: AuthUser, ownerId: string) {
    if (user.role === "AGENT" && ownerId !== user.id) {
      throw new ForbiddenException("Nemáte prístup k tejto nahrávke");
    }
  }

  private async getOwned(user: AuthUser, id: string) {
    const recording = await this.prisma.recording.findUnique({ where: { id } });
    if (!recording) throw new NotFoundException("Nahrávka neexistuje");
    this.assertCanAccess(user, recording.ownerId);
    return recording;
  }
}
