import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";

/** Validuje vstup pomocou zdieľanej Zod schémy (z @daka/shared). */
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: "Neplatný vstup",
        chyby: result.error.flatten(),
      });
    }
    return result.data;
  }
}
