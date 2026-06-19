import { Injectable, Logger } from "@nestjs/common";
import OpenAI, { toFile } from "openai";
import {
  TranscriptionProvider,
  type TranscribeOptions,
  type TranscriptionResult,
} from "./transcription.provider";

@Injectable()
export class OpenAITranscriptionProvider extends TranscriptionProvider {
  private readonly logger = new Logger(OpenAITranscriptionProvider.name);
  private readonly client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  private readonly model = process.env.OPENAI_TRANSCRIBE_MODEL ?? "whisper-1";

  async transcribe(
    audio: Buffer,
    opts: TranscribeOptions,
  ): Promise<TranscriptionResult> {
    const file = await toFile(audio, opts.filename ?? "nahravka.webm");
    const language = opts.language ?? process.env.AI_DEFAULT_LANGUAGE ?? "sk";

    this.logger.log(`Prepisujem (${this.model}, jazyk=${language})`);
    const res: any = await this.client.audio.transcriptions.create({
      file,
      model: this.model,
      language,
      prompt: opts.glossaryPrompt,
      response_format: "verbose_json",
    });

    const segments = (res.segments ?? []).map((s: any) => ({
      startSek: s.start,
      endSek: s.end,
      text: (s.text ?? "").trim(),
    }));

    return {
      text: res.text ?? "",
      language: res.language ?? language,
      model: this.model,
      segments,
    };
  }
}
