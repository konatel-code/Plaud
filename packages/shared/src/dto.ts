import { z } from "zod";

// Zdieľané Zod schémy pre API požiadavky/odpovede (validácia na FE aj BE).

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const recordingTypeSchema = z.enum([
  "KONZULTACIA",
  "PORADA",
  "DODAVATEL",
  "INE",
]);

export const recordingSourceSchema = z.enum(["WEB", "MOBIL", "UPLOAD"]);

/** Žiadosť o pre-signed URL na upload audia. */
export const uploadUrlSchema = z.object({
  contentType: z.string().min(1),
  pripona: z.string().min(1).max(10).default("webm"),
});
export type UploadUrlInput = z.infer<typeof uploadUrlSchema>;

/** Vytvorenie nahrávky po nahratí audia do storage. */
export const createRecordingSchema = z.object({
  nazov: z.string().min(1).max(200),
  typ: recordingTypeSchema.default("INE"),
  audioKey: z.string().min(1),
  dlzkaSek: z.number().int().nonnegative().optional(),
  jazyk: z.string().min(2).max(8).default("sk"),
  zdroj: recordingSourceSchema.default("WEB"),
  poznamka: z.string().max(5000).optional(),
});
export type CreateRecordingInput = z.infer<typeof createRecordingSchema>;

export const updateRecordingSchema = z.object({
  nazov: z.string().min(1).max(200).optional(),
  typ: recordingTypeSchema.optional(),
  poznamka: z.string().max(5000).optional(),
});
export type UpdateRecordingInput = z.infer<typeof updateRecordingSchema>;

export const listRecordingsQuerySchema = z.object({
  typ: recordingTypeSchema.optional(),
  stav: z
    .enum([
      "UPLOADED",
      "TRANSCRIBING",
      "TRANSCRIBED",
      "SUMMARIZING",
      "SUMMARIZED",
      "FAILED",
    ])
    .optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListRecordingsQuery = z.infer<typeof listRecordingsQuerySchema>;

/** Vygenerovanie zhrnutia podľa šablóny. */
export const createSummarySchema = z.object({
  templateKluc: z.string().min(1),
});
export type CreateSummaryInput = z.infer<typeof createSummarySchema>;

export const consentSchema = z.object({
  sposob: z.enum(["USTNY_V_NAHRAVKE", "PISOMNY", "INY"]),
  poznamka: z.string().max(1000).optional(),
});
export type ConsentInput = z.infer<typeof consentSchema>;

export const updateTaskSchema = z.object({
  stav: z.enum(["OTVORENA", "HOTOVA"]).optional(),
  zodpovedny: z.string().max(200).optional(),
  termin: z.string().optional(),
});
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const updateClientProfileSchema = z.object({
  stav: z.enum(["LEAD", "PONUKA_ODOSLANA", "REZERVOVANE", "STRATENY"]),
});
export type UpdateClientProfileInput = z.infer<
  typeof updateClientProfileSchema
>;

export const exportFormatSchema = z.enum(["md", "html", "docx"]);
export type ExportFormat = z.infer<typeof exportFormatSchema>;

export const glossaryCreateSchema = z.object({
  pojem: z.string().min(1).max(120),
  kategoria: z.string().max(60).optional(),
});
export type GlossaryCreateInput = z.infer<typeof glossaryCreateSchema>;

export const templateUpdateSchema = z.object({
  nazov: z.string().min(1).max(120).optional(),
  prompt: z.string().min(1).max(8000).optional(),
  popis: z.string().max(500).optional(),
  aktivna: z.boolean().optional(),
});
export type TemplateUpdateInput = z.infer<typeof templateUpdateSchema>;

export const renameSpeakerSchema = z.object({
  from: z.string().min(1).max(80),
  to: z.string().min(1).max(80),
});
export type RenameSpeakerInput = z.infer<typeof renameSpeakerSchema>;
