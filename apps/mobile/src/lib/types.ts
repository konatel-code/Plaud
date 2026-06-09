export type RecordingStatus =
  | "UPLOADED"
  | "TRANSCRIBING"
  | "TRANSCRIBED"
  | "SUMMARIZING"
  | "SUMMARIZED"
  | "FAILED";

export type RecordingType = "KONZULTACIA" | "PORADA" | "DODAVATEL" | "INE";

export interface AuthUser {
  id: string;
  email: string;
  meno: string;
  role: "AGENT" | "MANAGER" | "ADMIN";
}

export interface RecordingListItem {
  id: string;
  nazov: string;
  typ: RecordingType;
  stav: RecordingStatus;
  createdAt: string;
}

export interface RecordingList {
  items: RecordingListItem[];
  total: number;
}

export interface Summary {
  id: string;
  markdown: string;
  template: { kluc: string; nazov: string };
}

export interface RecordingDetail extends RecordingListItem {
  poznamka?: string | null;
  chyba?: string | null;
  transcript?: { plnyText: string } | null;
  summaries: Summary[];
}

export const TYPE_LABEL: Record<RecordingType, string> = {
  KONZULTACIA: "Konzultácia s klientom",
  PORADA: "Porada",
  DODAVATEL: "Rokovanie s dodávateľom",
  INE: "Iné",
};

export const STATUS_LABEL: Record<RecordingStatus, string> = {
  UPLOADED: "Nahraté",
  TRANSCRIBING: "Prepisuje sa…",
  TRANSCRIBED: "Prepísané",
  SUMMARIZING: "Tvorí sa zhrnutie…",
  SUMMARIZED: "Hotové",
  FAILED: "Chyba",
};
