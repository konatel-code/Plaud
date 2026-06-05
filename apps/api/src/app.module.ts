import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { StorageModule } from "./storage/storage.module";
import { TemplatesModule } from "./templates/templates.module";
import { RecordingsModule } from "./recordings/recordings.module";
import { SummariesModule } from "./summaries/summaries.module";
import { AiModule } from "./ai/ai.module";
import { QueueModule } from "./queue/queue.module";
import { WorkerModule } from "./worker/worker.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { HealthController } from "./health.controller";

function redisConnection() {
  const url = new URL(process.env.REDIS_URL ?? "redis://localhost:6379");
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    password: url.password || undefined,
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({ connection: redisConnection() }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StorageModule,
    TemplatesModule,
    RecordingsModule,
    SummariesModule,
    AiModule,
    QueueModule,
    WorkerModule,
    RealtimeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
