/**
 * Počiatočný cestovný glosár pre presnejší prepis (Whisper `prompt`) aj
 * zhrnutia. Admin ho neskôr spravuje v UI. Viď docs/05-sablony.md.
 */
export interface GlossarySeedTerm {
  pojem: string;
  kategoria: string;
}

export const GLOSSARY_SEED: GlossarySeedTerm[] = [
  // Odborné pojmy
  { pojem: "alotment", kategoria: "pojem" },
  { pojem: "transfer", kategoria: "pojem" },
  { pojem: "fakultatívny výlet", kategoria: "pojem" },
  { pojem: "polpenzia", kategoria: "pojem" },
  { pojem: "all inclusive", kategoria: "pojem" },
  { pojem: "first minute", kategoria: "pojem" },
  { pojem: "last minute", kategoria: "pojem" },
  { pojem: "delegát", kategoria: "pojem" },
  { pojem: "poistenie storna", kategoria: "pojem" },
  { pojem: "BSP", kategoria: "pojem" },
  { pojem: "IATA", kategoria: "pojem" },
  // Destinácie a oblasti (príklady — dopĺňa admin podľa ponuky)
  { pojem: "Hurghada", kategoria: "destinacia" },
  { pojem: "Kréta", kategoria: "destinacia" },
  { pojem: "Rodos", kategoria: "destinacia" },
  { pojem: "Chorvátsko", kategoria: "destinacia" },
  { pojem: "Turecko", kategoria: "destinacia" },
  { pojem: "Tunisko", kategoria: "destinacia" },
  { pojem: "Taliansko", kategoria: "destinacia" },
];

/** Vyskladá glosár ako text do Whisper `prompt` parametra. */
export function buildGlossaryPrompt(terms: { pojem: string }[]): string {
  if (terms.length === 0) return "";
  return `Pojmy a názvy, ktoré sa môžu v nahrávke vyskytnúť: ${terms
    .map((t) => t.pojem)
    .join(", ")}.`;
}
