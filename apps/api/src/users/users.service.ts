import { ConflictException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import type { UserRole } from "@daka/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, meno: true, role: true, pobocka: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
  }

  /** Zoznam kolegov (na výber pri zdieľaní) — bez citlivých údajov. */
  colleagues(exceptUserId: string) {
    return this.prisma.user.findMany({
      where: { id: { not: exceptUserId } },
      select: { id: true, meno: true, role: true },
      orderBy: { meno: "asc" },
    });
  }

  async create(input: {
    email: string;
    meno: string;
    password: string;
    role?: UserRole;
    pobocka?: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) throw new ConflictException("E-mail už existuje");

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        meno: input.meno,
        passwordHash,
        role: input.role ?? "AGENT",
        pobocka: input.pobocka,
      },
      select: { id: true, email: true, meno: true, role: true, pobocka: true },
    });
    return user;
  }
}
