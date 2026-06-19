import { Module } from "@nestjs/common";
import { CrmService } from "./crm.service";
import { IntegrationsController } from "./integrations.controller";

@Module({
  providers: [CrmService],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {}
