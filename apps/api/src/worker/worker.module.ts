import { Module } from "@nestjs/common";
import { SummariesModule } from "../summaries/summaries.module";
import { ProcessingProcessor } from "./processing.processor";

/**
 * V MVP beží processor v rámci API procesu. Neskôr ho možno vyčleniť do
 * samostatného workera (viď docs/07-architektura.md).
 */
@Module({
  imports: [SummariesModule],
  providers: [ProcessingProcessor],
})
export class WorkerModule {}
