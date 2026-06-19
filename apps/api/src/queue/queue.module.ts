import { Global, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { PROCESSING_QUEUE } from "./queue.constants";

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: PROCESSING_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
