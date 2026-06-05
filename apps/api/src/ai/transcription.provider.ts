export interface TranscriptSegmentData {
  startSek: number;
  endSek: number;
  text: string;
  speaker?: string;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  model: string;
  segments: TranscriptSegmentData[];
}

export interface TranscribeOptions {
  /** Predvolený jazyk, napr. "sk". */
  language?: string;
  /** Pojmy z glosára pre presnejší prepis. */
  glossaryPrompt?: string;
  filename?: string;
}

/** Abstrakcia poskytovateľa prepisu (vymeniteľná — viď docs/04). */
export abstract class TranscriptionProvider {
  abstract transcribe(
    audio: Buffer,
    opts: TranscribeOptions,
  ): Promise<TranscriptionResult>;
}
