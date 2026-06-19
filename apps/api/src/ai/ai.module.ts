import { Global, Module } from "@nestjs/common";
import { TranscriptionProvider } from "./transcription.provider";
import { SummarizationProvider } from "./summarization.provider";
import { OpenAITranscriptionProvider } from "./openai-transcription.provider";
import { OpenAISummarizationProvider } from "./openai-summarization.provider";

/**
 * AI providery sú viazané cez abstraktné triedy, takže ich možno vymeniť
 * (napr. za self-hosted variant) bez zásahu do zvyšku aplikácie.
 */
@Global()
@Module({
  providers: [
    { provide: TranscriptionProvider, useClass: OpenAITranscriptionProvider },
    { provide: SummarizationProvider, useClass: OpenAISummarizationProvider },
  ],
  exports: [TranscriptionProvider, SummarizationProvider],
})
export class AiModule {}
