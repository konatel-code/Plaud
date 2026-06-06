import { Module } from "@nestjs/common";
import { TranscriptsService } from "./transcripts.service";
import { TranscriptsController } from "./transcripts.controller";

@Module({
  providers: [TranscriptsService],
  controllers: [TranscriptsController],
})
export class TranscriptsModule {}
