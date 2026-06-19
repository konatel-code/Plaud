import { Module } from "@nestjs/common";
import { GlossaryService } from "./glossary.service";
import { GlossaryController } from "./glossary.controller";

@Module({
  providers: [GlossaryService],
  controllers: [GlossaryController],
})
export class GlossaryModule {}
