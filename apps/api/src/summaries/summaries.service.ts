import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TemplatesService } from "../templates/templates.service";
import { SummarizationProvider } from "../ai/summarization.provider";
import { renderSummaryMarkdown } from "../ai/markdown";

@Injectable()
export class SummariesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templates: TemplatesService,
    private readonly summarizer: SummarizationProvider,
  ) {}

  listForRecording(recordingId: string) {
    return this.prisma.summary.findMany({
      where: { recordingId },
      include: { template: true, tasks: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Vygeneruje zhrnutie nahrávky podľa kľúča šablóny a uloží ho. */
  async generate(recordingId: string, templateKluc: string) {
    const recording = await this.prisma.recording.findUnique({
      where: { id: recordingId },
      include: { transcript: true, highlights: true },
    });
    if (!recording) throw new BadRequestException("Nahrávka neexistuje");
    if (!recording.transcript) {
      throw new BadRequestException("Nahrávka zatiaľ nemá prepis");
    }

    const tmplRow = await this.templates.getRowByKey(templateKluc);
    const tmpl = await this.templates.getByKey(templateKluc);

    const highlights = recording.highlights.map(
      (h) => `${Math.round(h.casSek)}s${h.poznamka ? `: ${h.poznamka}` : ""}`,
    );

    const result = await this.summarizer.summarize(
      {
        transcript: recording.transcript.plnyText,
        poznamka: recording.poznamka,
        highlights,
      },
      tmpl,
    );

    const markdown = renderSummaryMarkdown(templateKluc, result.data);

    const summary = await this.prisma.summary.create({
      data: {
        recordingId,
        templateId: tmplRow.id,
        dataJson: result.data as object,
        markdown,
        model: result.model,
      },
    });

    await this.postProcess(recordingId, templateKluc, summary.id, result.data);
    return summary;
  }

  /** Z výstupu vytvorí doménové entity (profil klienta / úlohy / karta dodávateľa). */
  private async postProcess(
    recordingId: string,
    templateKluc: string,
    summaryId: string,
    data: Record<string, any>,
  ) {
    if (templateKluc === "konzultacia") {
      await this.prisma.clientProfile.upsert({
        where: { recordingId },
        update: { dataJson: data as object },
        create: { recordingId, dataJson: data as object },
      });
    } else if (templateKluc === "porada" && Array.isArray(data.ulohy)) {
      for (const u of data.ulohy) {
        await this.prisma.task.create({
          data: {
            summaryId,
            text: String(u.uloha ?? "").slice(0, 1000),
            zodpovedny: u.zodpovedny ?? null,
            priorita: u.priorita ?? null,
            termin: parseDate(u.termin),
          },
        });
      }
    } else if (templateKluc === "dodavatel") {
      await this.prisma.supplierDeal.upsert({
        where: { recordingId },
        update: { dataJson: data as object },
        create: { recordingId, dataJson: data as object },
      });
    }
  }
}

function parseDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}
