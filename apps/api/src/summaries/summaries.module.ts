import { Module } from "@nestjs/common";
import { TemplatesModule } from "../templates/templates.module";
import { SummariesService } from "./summaries.service";
import { SummariesController } from "./summaries.controller";

@Module({
  imports: [TemplatesModule],
  providers: [SummariesService],
  controllers: [SummariesController],
  exports: [SummariesService],
})
export class SummariesModule {}
