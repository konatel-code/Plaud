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

  /** Upload audia cez API: server uloží súbor do úložiska a vytvorí nahrávku. */
  async uploadAudio(
    user: AuthUser,
    file: { buffer: Buffer; mimetype?: string; originalname?: string },
    meta: Omit<CreateRecordingInput, "audioKey">,
  ) {
    const ext = (file.originalname?.split(".").pop() || "webm")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 8);
    const { key } = await this.storage.putObject(
      file.buffer,
      file.mimetype || "audio/webm",
      ext || "webm",
    );
    return this.create(user, { ...meta, audioKey: key });
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
    const and: Record<string, unknown>[] = [this.visibilityFilter(user)];
    if (query.typ) and.push({ typ: query.typ });
    if (query.stav) and.push({ stav: query.stav });
    if (query.stitok) and.push({ stitky: { has: query.stitok } });
    if (query.q) {
      const q = query.q;
      and.push({
        OR: [
          { nazov: { contains: q, mode: "insensitive" } },
          { poznamka: { contains: q, mode: "insensitive" } },
          { transcript: { plnyText: { contains: q, mode: "insensitive" } } },
          { summaries: { some: { markdown: { contains: q, mode: "insensitive" } } } },
        ],
      });
    }
    const where = { AND: and };

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
        shares: { include: { user: { select: { id: true, meno: true } } } },
      },
    });
    if (!recording) throw new NotFoundException("Nahrávka neexistuje");
    const sharedWithMe = recording.shares.some((s) => s.userId === user.id);
    this.assertCanView(user, recording.ownerId, sharedWithMe);
    return recording;
  }

  async setShares(user: AuthUser, id: string, userId: string) {
    await this.getOwned(user, id); // len vlastník/manažér/admin môže zdieľať
    return this.prisma.recordingShare.upsert({
      where: { recordingId_userId: { recordingId: id, userId } },
      update: {},
      create: { recordingId: id, userId },
    });
  }

  async removeShare(user: AuthUser, id: string, userId: string) {
    await this.getOwned(user, id);
    await this.prisma.recordingShare
      .delete({ where: { recordingId_userId: { recordingId: id, userId } } })
      .catch(() => undefined);
    return { ok: true };
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

  /** Prisma filter: čo daný používateľ smie vidieť. */
  private visibilityFilter(user: AuthUser): Record<string, unknown> {
    if (user.role === "AGENT") {
      return {
        OR: [{ ownerId: user.id }, { shares: { some: { userId: user.id } } }],
      };
    }
    return {}; // MANAGER a ADMIN vidia všetko
  }

  /** Prezeranie: vlastník, zdieľané so mnou, alebo MANAGER/ADMIN. */
  private assertCanView(user: AuthUser, ownerId: string, shared: boolean) {
    if (user.role !== "AGENT") return;
    if (ownerId === user.id || shared) return;
    throw new ForbiddenException("Nemáte prístup k tejto nahrávke");
  }

  /** Úpravy/zdieľanie/mazanie: vlastník alebo MANAGER/ADMIN (nie zdieľaný divák). */
  private async getOwned(user: AuthUser, id: string) {
    const recording = await this.prisma.recording.findUnique({ where: { id } });
    if (!recording) throw new NotFoundException("Nahrávka neexistuje");
    if (user.role === "AGENT" && recording.ownerId !== user.id) {
      throw new ForbiddenException("Nemáte oprávnenie na túto akciu");
    }
    return recording;
  }
}
