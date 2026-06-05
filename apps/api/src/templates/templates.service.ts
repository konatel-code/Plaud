import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { TemplateLike } from "../ai/summarization.provider";

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.template.findMany({
      where: { aktivna: true },
      orderBy: { nazov: "asc" },
    });
  }

  async getByKey(kluc: string): Promise<TemplateLike> {
    const t = await this.prisma.template.findUnique({ where: { kluc } });
    if (!t) throw new NotFoundException(`Šablóna "${kluc}" neexistuje`);
    return {
      kluc: t.kluc,
      nazov: t.nazov,
      prompt: t.prompt,
      schema: t.schemaJson as TemplateLike["schema"],
    };
  }

  async getRowByKey(kluc: string) {
    const t = await this.prisma.template.findUnique({ where: { kluc } });
    if (!t) throw new NotFoundException(`Šablóna "${kluc}" neexistuje`);
    return t;
  }
}
