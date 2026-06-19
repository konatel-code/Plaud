import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import {
  DEFAULT_TEMPLATE_FOR_TYPE,
  buildGlossaryPrompt,
  type RecordingStatus,
} from "@daka/shared";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { TranscriptionProvider } from "../ai/transcription.provider";
import { SummariesService } from "../summaries/summaries.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import {
  PROCESSING_QUEUE,
  type ProcessRecordingJob,
} from "../queue/queue.constants";

@Processor(PROCESSING_QUEUE)
export class ProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(ProcessingProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly transcriber: TranscriptionProvider,
    private readonly summaries: SummariesService,
    private readonly realtime: RealtimeGateway,
  ) {
    super();
  }

  async process(job: Job<ProcessRecordingJob>): Promise<void> {
    const { recordingId } = job.data;
    this.logger.log(`Spracúvam nahrávku ${recordingId}`);

    const recording = await this.prisma.recording.findUnique({
      where: { id: recordingId },
    });
    if (!recording || !recording.audioKey) {
      throw new Error("Nahrávka alebo audio neexistuje");
    }

    try {
      // 1) Prepis
      await this.setStatus(recordingId, "TRANSCRIBING");
      const audio = await this.storage.getObjectBuffer(recording.audioKey);
      const glossary = await this.prisma.glossaryTerm.findMany({
        select: { pojem: true },
      });
      const filename = recording.audioKey.split("/").pop() ?? "nahravka.webm";

      const transcription = await this.transcriber.transcribe(audio, {
        language: recording.jazyk,
        glossaryPrompt: buildGlossaryPrompt(glossary),
        filename,
      });

      await this.prisma.transcript.create({
        data: {
          recordingId,
          plnyText: transcription.text,
          jazyk: transcription.language,
          model: transcription.model,
          segments: {
            create: transcription.segments.map((s, i) => ({
              poradie: i,
              startSek: s.startSek,
              endSek: s.endSek,
              text: s.text,
              speaker: s.speaker,
            })),
          },
        },
      });
      await this.setStatus(recordingId, "TRANSCRIBED");

      // 2) Zhrnutie predvolenou šablónou podľa typu nahrávky
      await this.setStatus(recordingId, "SUMMARIZING");
      const templateKluc = DEFAULT_TEMPLATE_FOR_TYPE[recording.typ];
      await this.summaries.generate(recordingId, templateKluc);

      await this.setStatus(recordingId, "SUMMARIZED");
      this.realtime.emitReady(recordingId);
      this.logger.log(`Nahrávka ${recordingId} hotová`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Chyba pri ${recordingId}: ${message}`);
      await this.prisma.recording.update({
        where: { id: recordingId },
        data: { stav: "FAILED", chyba: message },
      });
      this.realtime.emitStatus(recordingId, "FAILED");
      throw err;
    }
  }

  private async setStatus(recordingId: string, stav: RecordingStatus) {
    await this.prisma.recording.update({
      where: { id: recordingId },
      data: { stav },
    });
    this.realtime.emitStatus(recordingId, stav);
  }
}
