import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TranscriptsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Premenuje hovoriaceho vo všetkých segmentoch prepisu (napr. "Hovoriaci 1" → "Klient"). */
  async renameSpeaker(transcriptId: string, from: string, to: string) {
    const res = await this.prisma.transcriptSegment.updateMany({
      where: { transcriptId, speaker: from },
      data: { speaker: to },
    });
    return { zmenene: res.count };
  }
}
