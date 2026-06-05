// Ľahké typy zodpovedajúce odpovediam API (zhrnuté pre web).

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
  jazyk: string;
  createdAt: string;
  owner?: { meno: string };
}

export interface RecordingList {
  items: RecordingListItem[];
  total: number;
  page: number;
  perPage: number;
}

export interface TranscriptSegment {
  id: string;
  startSek: number;
  endSek: number;
  text: string;
  speaker?: string | null;
}

export interface Summary {
  id: string;
  markdown: string;
  dataJson: Record<string, unknown>;
  model?: string | null;
  createdAt: string;
  template: { kluc: string; nazov: string };
  tasks: {
    id: string;
    text: string;
    zodpovedny?: string | null;
    termin?: string | null;
    stav: string;
  }[];
}

export interface ClientProfile {
  id: string;
  stav: "LEAD" | "PONUKA_ODOSLANA" | "REZERVOVANE" | "STRATENY";
  dataJson: Record<string, any>;
}

export interface RecordingDetail extends RecordingListItem {
  poznamka?: string | null;
  chyba?: string | null;
  transcript?: { plnyText: string; segments: TranscriptSegment[] } | null;
  summaries: Summary[];
  clientProfile?: ClientProfile | null;
  supplierDeal?: { id: string; dataJson: Record<string, any> } | null;
}

export const CLIENT_STATUS_LABEL: Record<ClientProfile["stav"], string> = {
  LEAD: "Záujemca",
  PONUKA_ODOSLANA: "Ponuka odoslaná",
  REZERVOVANE: "Rezervované",
  STRATENY: "Stratený",
};
