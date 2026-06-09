import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "../auth/current-user.decorator";

/**
 * Outbound integrácia na CRM / rezervačný systém CK DAKA.
 * Profil klienta sa odošle ako normalizovaný JSON na webhook (CRM_WEBHOOK_URL).
 * Ak URL nie je nastavená, payload sa len pripraví (stub) a zaeviduje.
 */
@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(private readonly prisma: PrismaService) {}

  async sendClientProfile(recordingId: string, user: AuthUser) {
    const recording = await this.prisma.recording.findUnique({
      where: { id: recordingId },
      include: { clientProfile: true, owner: { select: { meno: true, email: true } } },
    });
    if (!recording) throw new BadRequestException("Nahrávka neexistuje");
    if (!recording.clientProfile) {
      throw new BadRequestException("Nahrávka nemá profil klienta");
    }

    const d = recording.clientProfile.dataJson as Record<string, any>;
    const payload = {
      zdroj: "DAKA Hlas",
      typ: "CRM_CLIENT_PROFILE",
      nahravkaId: recording.id,
      profilId: recording.clientProfile.id,
      stav: recording.clientProfile.stav,
      predajca: { meno: recording.owner.meno, email: recording.owner.email },
      klient: d.klient ?? null,
      cestujuci: d.cestujuci ?? null,
      destinacia: d.destinacia ?? null,
      termin: d.termin ?? null,
      rozpocet: d.rozpocet ?? null,
      doprava: d.doprava ?? null,
      ubytovanie: d.ubytovanie ?? null,
      specialne_poziadavky: d.specialne_poziadavky ?? [],
      navrh_zajazdu: d.navrh_zajazdu ?? [],
      vytvorene: new Date().toISOString(),
    };

    const url = process.env.CRM_WEBHOOK_URL;
    if (!url) {
      await this.logEvent("PRIPRAVENE", recordingId, null, payload, "CRM_WEBHOOK_URL nie je nastavená");
      return { stav: "PRIPRAVENE" as const, payload };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.CRM_API_KEY ? { "X-API-Key": process.env.CRM_API_KEY } : {}),
        },
        body: JSON.stringify(payload),
      });
      const odpoved = `HTTP ${res.status}`;
      if (!res.ok) {
        await this.logEvent("CHYBA", recordingId, url, payload, odpoved);
        throw new BadRequestException(`CRM odmietol požiadavku (${odpoved})`);
      }
      await this.logEvent("ODOSLANE", recordingId, url, payload, odpoved);
      this.logger.log(`Profil klienta ${recordingId} odoslaný do CRM (${odpoved})`);
      return { stav: "ODOSLANE" as const, payload };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.logEvent("CHYBA", recordingId, url, payload, message);
      throw new BadRequestException(`Odoslanie do CRM zlyhalo: ${message}`);
    }
  }

  listEvents(limit = 100) {
    return this.prisma.integrationEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  private logEvent(
    stav: string,
    recordingId: string | null,
    cielUrl: string | null,
    payload: unknown,
    odpoved: string,
  ) {
    return this.prisma.integrationEvent
      .create({
        data: {
          typ: "CRM_CLIENT_PROFILE",
          stav,
          recordingId,
          cielUrl,
          payloadJson: payload as object,
          odpoved,
        },
      })
      .catch(() => undefined);
  }
}
