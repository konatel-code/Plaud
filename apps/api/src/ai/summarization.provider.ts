import type { TemplateDefinition } from "@daka/shared";

export interface SummarizeInput {
  transcript: string;
  poznamka?: string | null;
  highlights?: string[];
}

export interface SummarizationResult {
  data: Record<string, unknown>;
  model: string;
}

export interface TemplateLike {
  kluc: string;
  nazov: string;
  prompt: string;
  schema: TemplateDefinition["schema"];
}

/** Abstrakcia poskytovateľa zhrnutí (vymeniteľná — viď docs/04). */
export abstract class SummarizationProvider {
  abstract summarize(
    input: SummarizeInput,
    template: TemplateLike,
  ): Promise<SummarizationResult>;
}
