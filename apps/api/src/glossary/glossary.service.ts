import { Injectable } from "@nestjs/common";
import type { GlossaryCreateInput } from "@daka/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GlossaryService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.glossaryTerm.findMany({ orderBy: { pojem: "asc" } });
  }

  create(input: GlossaryCreateInput) {
    return this.prisma.glossaryTerm.upsert({
      where: { pojem: input.pojem },
      update: { kategoria: input.kategoria },
      create: { pojem: input.pojem, kategoria: input.kategoria },
    });
  }

  remove(id: string) {
    return this.prisma.glossaryTerm.delete({ where: { id } });
  }
}
