import type { RecordingStatus, RecordingType } from "./types";

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

export const STATUS_COLOR: Record<RecordingStatus, string> = {
  UPLOADED: "bg-gray-100 text-gray-700",
  TRANSCRIBING: "bg-amber-100 text-amber-800",
  TRANSCRIBED: "bg-amber-100 text-amber-800",
  SUMMARIZING: "bg-amber-100 text-amber-800",
  SUMMARIZED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};
