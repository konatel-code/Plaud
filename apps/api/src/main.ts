import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Validáciu vstupov riešime cez Zod (ZodValidationPipe), nie class-validator.
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("api", { exclude: ["health"] });

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
  Logger.log(`DAKA Hlas API beží na http://localhost:${port}/api`, "Bootstrap");
}

bootstrap();
