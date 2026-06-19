import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(entry: {
    userId?: string | null;
    akcia: string;
    entita: string;
    entitaId?: string | null;
  }) {
    try {
      await this.prisma.auditLog.create({ data: entry });
    } catch (e) {
      // audit nesmie zhodiť požiadavku
      this.logger.warn(`Audit zlyhal: ${e instanceof Error ? e.message : e}`);
    }
  }

  list(limit = 100) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: { select: { meno: true, email: true } } },
    });
  }
}
