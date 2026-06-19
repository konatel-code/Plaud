// Enumy zdieľané naprieč appkami. Hodnoty zodpovedajú Prisma enumom.

export const UserRole = {
  AGENT: "AGENT",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const RecordingType = {
  KONZULTACIA: "KONZULTACIA",
  PORADA: "PORADA",
  DODAVATEL: "DODAVATEL",
  INE: "INE",
} as const;
export type RecordingType = (typeof RecordingType)[keyof typeof RecordingType];

export const RecordingSource = {
  WEB: "WEB",
  MOBIL: "MOBIL",
  UPLOAD: "UPLOAD",
} as const;
export type RecordingSource =
  (typeof RecordingSource)[keyof typeof RecordingSource];

export const RecordingStatus = {
  UPLOADED: "UPLOADED",
  TRANSCRIBING: "TRANSCRIBING",
  TRANSCRIBED: "TRANSCRIBED",
  SUMMARIZING: "SUMMARIZING",
  SUMMARIZED: "SUMMARIZED",
  FAILED: "FAILED",
} as const;
export type RecordingStatus =
  (typeof RecordingStatus)[keyof typeof RecordingStatus];

export const TemplateUseCase = {
  KONZULTACIA: "KONZULTACIA",
  PORADA: "PORADA",
  DODAVATEL: "DODAVATEL",
  UNIVERZAL: "UNIVERZAL",
} as const;
export type TemplateUseCase =
  (typeof TemplateUseCase)[keyof typeof TemplateUseCase];

export const ClientProfileStatus = {
  LEAD: "LEAD",
  PONUKA_ODOSLANA: "PONUKA_ODOSLANA",
  REZERVOVANE: "REZERVOVANE",
  STRATENY: "STRATENY",
} as const;
export type ClientProfileStatus =
  (typeof ClientProfileStatus)[keyof typeof ClientProfileStatus];

export const TaskStatus = {
  OTVORENA: "OTVORENA",
  HOTOVA: "HOTOVA",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

/** Mapovanie typu nahrávky na predvolenú šablónu (kľúč). */
export const DEFAULT_TEMPLATE_FOR_TYPE: Record<RecordingType, string> = {
  KONZULTACIA: "konzultacia",
  PORADA: "porada",
  DODAVATEL: "dodavatel",
  INE: "zhrnutie",
};
