import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { exportFormatSchema } from "@daka/shared";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ExportsService } from "./exports.service";

@UseGuards(JwtAuthGuard)
@Controller("recordings/:id/export")
export class ExportsController {
  constructor(private readonly exports: ExportsService) {}

  @Get()
  async export(
    @Param("id") id: string,
    @Query("format") formatRaw: string,
    @Res() res: Response,
  ) {
    const format = exportFormatSchema.catch("md").parse(formatRaw);
    const result = await this.exports.export(id, format);
    res.setHeader("Content-Type", result.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(result.filename)}"`,
    );
    res.send(result.body);
  }
}
