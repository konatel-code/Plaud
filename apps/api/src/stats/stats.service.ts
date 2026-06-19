import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const since7 = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const since30 = new Date(Date.now() - 30 * 24 * 3600 * 1000);

    const [
      total,
      poslednych7,
      poslednych30,
      podlaTypu,
      podlaStavu,
      klientiPodlaStavu,
      otvoreneUlohy,
      spracovavaSa,
    ] = await Promise.all([
      this.prisma.recording.count(),
      this.prisma.recording.count({ where: { createdAt: { gte: since7 } } }),
      this.prisma.recording.count({ where: { createdAt: { gte: since30 } } }),
      this.prisma.recording.groupBy({ by: ["typ"], _count: { _all: true } }),
      this.prisma.recording.groupBy({ by: ["stav"], _count: { _all: true } }),
      this.prisma.clientProfile.groupBy({ by: ["stav"], _count: { _all: true } }),
      this.prisma.task.count({ where: { stav: "OTVORENA" } }),
      this.prisma.recording.count({
        where: { stav: { in: ["UPLOADED", "TRANSCRIBING", "SUMMARIZING"] } },
      }),
    ]);

    const toMap = (rows: { _count: { _all: number } }[], key: string) =>
      Object.fromEntries(
        rows.map((r: any) => [r[key], r._count._all]),
      ) as Record<string, number>;

    return {
      nahravky: { total, poslednych7, poslednych30, spracovavaSa },
      podlaTypu: toMap(podlaTypu, "typ"),
      podlaStavu: toMap(podlaStavu, "stav"),
      klientiPodlaStavu: toMap(klientiPodlaStavu, "stav"),
      otvoreneUlohy,
    };
  }
}
