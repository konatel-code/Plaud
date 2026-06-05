import { Injectable } from "@nestjs/common";
import type {
  UpdateClientProfileInput,
  UpdateTaskInput,
} from "@daka/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DomainService {
  constructor(private readonly prisma: PrismaService) {}

  updateTask(id: string, input: UpdateTaskInput) {
    return this.prisma.task.update({
      where: { id },
      data: {
        stav: input.stav,
        zodpovedny: input.zodpovedny,
        termin: input.termin ? new Date(input.termin) : undefined,
      },
    });
  }

  updateClientProfile(id: string, input: UpdateClientProfileInput) {
    return this.prisma.clientProfile.update({
      where: { id },
      data: { stav: input.stav },
    });
  }
}
