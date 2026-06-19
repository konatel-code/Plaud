import { Injectable, Logger } from "@nestjs/common";
import OpenAI from "openai";
import {
  SummarizationProvider,
  type SummarizeInput,
  type SummarizationResult,
  type TemplateLike,
} from "./summarization.provider";

@Injectable()
export class OpenAISummarizationProvider extends SummarizationProvider {
  private readonly logger = new Logger(OpenAISummarizationProvider.name);
  private readonly client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  private readonly model = process.env.OPENAI_SUMMARY_MODEL ?? "gpt-4o";

  async summarize(
    input: SummarizeInput,
    template: TemplateLike,
  ): Promise<SummarizationResult> {
    const parts: string[] = [`PREPIS ROZHOVORU:\n${input.transcript}`];
    if (input.poznamka) parts.push(`POZNÁMKA POUŽÍVATEĽA:\n${input.poznamka}`);
    if (input.highlights?.length) {
      parts.push(`ZVÝRAZNENÉ MOMENTY:\n- ${input.highlights.join("\n- ")}`);
    }

    this.logger.log(`Zhrnutie šablónou "${template.kluc}" (${this.model})`);
    const res = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: template.prompt },
        { role: "user", content: parts.join("\n\n") },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: `sablona_${template.kluc}`,
          strict: true,
          schema: template.schema as Record<string, unknown>,
        },
      },
    });

    const content = res.choices[0]?.message?.content ?? "{}";
    return { data: JSON.parse(content), model: this.model };
  }
}
