import { Injectable, NotFoundException } from "@nestjs/common";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { ExportFormat } from "@daka/shared";
import { PrismaService } from "../prisma/prisma.service";
import { TYPE_LABELS } from "./labels";
import { markdownToHtml, wrapHtmlDocument } from "./html";

export interface ExportResult {
  filename: string;
  contentType: string;
  body: Buffer | string;
}

@Injectable()
export class ExportsService {
  constructor(private readonly prisma: PrismaService) {}

  async export(recordingId: string, format: ExportFormat): Promise<ExportResult> {
    const recording = await this.prisma.recording.findUnique({
      where: { id: recordingId },
      include: {
        transcript: true,
        summaries: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    if (!recording) throw new NotFoundException("Nahrávka neexistuje");

    const md = this.buildMarkdown(recording);
    const safeName = recording.nazov.replace(/[^\p{L}\p{N}_-]+/gu, "_");

    if (format === "md") {
      return {
        filename: `${safeName}.md`,
        contentType: "text/markdown; charset=utf-8",
        body: md,
      };
    }
    if (format === "html") {
      return {
        filename: `${safeName}.html`,
        contentType: "text/html; charset=utf-8",
        body: wrapHtmlDocument(recording.nazov, markdownToHtml(md)),
      };
    }
    return {
      filename: `${safeName}.docx`,
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      body: await this.buildDocx(recording.nazov, md),
    };
  }

  private buildMarkdown(recording: any): string {
    const parts: string[] = [];
    parts.push(`# ${recording.nazov}`);
    parts.push(
      `_${TYPE_LABELS[recording.typ] ?? recording.typ} · ${new Date(
        recording.createdAt,
      ).toLocaleString("sk-SK")}_`,
    );
    if (recording.summaries[0]) {
      parts.push("\n" + recording.summaries[0].markdown);
    }
    if (recording.transcript) {
      parts.push("\n## Prepis\n");
      parts.push(recording.transcript.plnyText);
    }
    return parts.join("\n");
  }

  private async buildDocx(title: string, md: string): Promise<Buffer> {
    const children: Paragraph[] = [
      new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
    ];

    for (const raw of md.split("\n")) {
      const line = raw.trimEnd();
      if (line.startsWith("# ")) continue; // titul už máme
      if (line.startsWith("### ")) {
        children.push(
          new Paragraph({ text: line.slice(4), heading: HeadingLevel.HEADING_2 }),
        );
      } else if (line.startsWith("## ")) {
        children.push(
          new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_1 }),
        );
      } else if (line.startsWith("- ")) {
        children.push(
          new Paragraph({ children: runs(line.slice(2)), bullet: { level: 0 } }),
        );
      } else if (line.trim() === "") {
        children.push(new Paragraph({}));
      } else {
        children.push(new Paragraph({ children: runs(line) }));
      }
    }

    const doc = new Document({ sections: [{ children }] });
    return Packer.toBuffer(doc);
  }
}

/** Rozparsuje **tučné** úseky do TextRun-ov. */
function runs(text: string): TextRun[] {
  const result: TextRun[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) result.push(new TextRun(text.slice(last, m.index)));
    result.push(new TextRun({ text: m[1], bold: true }));
    last = re.lastIndex;
  }
  if (last < text.length) result.push(new TextRun(text.slice(last)));
  return result.length ? result : [new TextRun(text)];
}
