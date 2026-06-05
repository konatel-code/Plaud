import type { TemplateUseCase } from "./enums";

/**
 * Definícia šablóny zhrnutia. `schema` je JSON Schema kompatibilná s OpenAI
 * Structured Outputs; `prompt` je systémová inštrukcia pre GPT-4o.
 * Viď docs/05-sablony.md.
 */
export interface TemplateDefinition {
  kluc: string;
  nazov: string;
  useCase: TemplateUseCase;
  popis: string;
  schema: Record<string, unknown>;
  prompt: string;
}

const SK = "Odpovedaj vždy po slovensky.";
const NO_INVENT =
  "Vyplň len to, čo z rozhovoru jednoznačne vyplýva. Čo nezaznelo, nechaj null alebo prázdne pole — nič si nevymýšľaj.";

export const KONZULTACIA_TEMPLATE: TemplateDefinition = {
  kluc: "konzultacia",
  nazov: "Konzultácia s klientom",
  useCase: "KONZULTACIA",
  popis:
    "Z rozhovoru s klientom vytvorí profil klienta a návrh zájazdu z ponuky CK DAKA.",
  prompt: `Si asistent predajcu v cestovnej kancelárii DAKA. Z prepisu konzultácie s klientom vyplň profil klienta podľa schémy. Zameraj sa na preferencie dovolenky (destinácia, termín, rozpočet, počet osôb, doprava, ubytovanie a strava, špeciálne požiadavky a obavy). V poli "navrh_zajazdu" navrhni typy zájazdov z portfólia DAKA (pobytové, poznávacie, letecké aj autobusové, exotika, wellness, víkendové), ktoré najlepšie sedia preferenciám. ${NO_INVENT} ${SK}`,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      klient: {
        type: "object",
        additionalProperties: false,
        properties: {
          meno: { type: ["string", "null"] },
          telefon: { type: ["string", "null"] },
          email: { type: ["string", "null"] },
        },
        required: ["meno", "telefon", "email"],
      },
      cestujuci: {
        type: "object",
        additionalProperties: false,
        properties: {
          dospeli: { type: ["integer", "null"] },
          deti: { type: ["integer", "null"] },
          vek_deti: { type: "array", items: { type: "integer" } },
        },
        required: ["dospeli", "deti", "vek_deti"],
      },
      destinacia: {
        type: "object",
        additionalProperties: false,
        properties: {
          preferovane: { type: "array", items: { type: "string" } },
          typ_dovolenky: { type: ["string", "null"] },
          vylucene: { type: "array", items: { type: "string" } },
        },
        required: ["preferovane", "typ_dovolenky", "vylucene"],
      },
      termin: {
        type: "object",
        additionalProperties: false,
        properties: {
          od: { type: ["string", "null"] },
          do: { type: ["string", "null"] },
          flexibilita: { type: ["string", "null"] },
          pocet_noci: { type: ["integer", "null"] },
        },
        required: ["od", "do", "flexibilita", "pocet_noci"],
      },
      rozpocet: {
        type: "object",
        additionalProperties: false,
        properties: {
          na_osobu: { type: ["number", "null"] },
          spolu: { type: ["number", "null"] },
          mena: { type: ["string", "null"] },
        },
        required: ["na_osobu", "spolu", "mena"],
      },
      doprava: { type: ["string", "null"] },
      ubytovanie: {
        type: "object",
        additionalProperties: false,
        properties: {
          kategoria: { type: ["string", "null"] },
          strava: { type: ["string", "null"] },
        },
        required: ["kategoria", "strava"],
      },
      specialne_poziadavky: { type: "array", items: { type: "string" } },
      namietky_obavy: { type: "array", items: { type: "string" } },
      navrh_zajazdu: { type: "array", items: { type: "string" } },
      dalsie_kroky: {
        type: "object",
        additionalProperties: false,
        properties: {
          akcia: { type: ["string", "null"] },
          termin: { type: ["string", "null"] },
        },
        required: ["akcia", "termin"],
      },
      zhrnutie: { type: "string" },
    },
    required: [
      "klient",
      "cestujuci",
      "destinacia",
      "termin",
      "rozpocet",
      "doprava",
      "ubytovanie",
      "specialne_poziadavky",
      "namietky_obavy",
      "navrh_zajazdu",
      "dalsie_kroky",
      "zhrnutie",
    ],
  },
};

export const PORADA_TEMPLATE: TemplateDefinition = {
  kluc: "porada",
  nazov: "Porada / zápis",
  useCase: "PORADA",
  popis: "Z porady vytvorí zápis s rozhodnutiami a úlohami (kto/čo/dokedy).",
  prompt: `Z prepisu porady vytvor štruktúrovaný zápis. Jasne oddeľ rozhodnutia od úloh. Pri každej úlohe urči zodpovedného a termín, ak zazneli, a prioritu (vysoká/stredná/nízka). Píš stručne a vecne. ${NO_INVENT} ${SK}`,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      nazov_porady: { type: ["string", "null"] },
      datum: { type: ["string", "null"] },
      ucastnici: { type: "array", items: { type: "string" } },
      agenda: { type: "array", items: { type: "string" } },
      prebrane_body: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            tema: { type: "string" },
            zhrnutie: { type: "string" },
          },
          required: ["tema", "zhrnutie"],
        },
      },
      rozhodnutia: { type: "array", items: { type: "string" } },
      ulohy: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            uloha: { type: "string" },
            zodpovedny: { type: ["string", "null"] },
            termin: { type: ["string", "null"] },
            priorita: { type: ["string", "null"] },
          },
          required: ["uloha", "zodpovedny", "termin", "priorita"],
        },
      },
      otvorene_otazky: { type: "array", items: { type: "string" } },
      dalsia_porada: { type: ["string", "null"] },
      zhrnutie: { type: "string" },
    },
    required: [
      "nazov_porady",
      "datum",
      "ucastnici",
      "agenda",
      "prebrane_body",
      "rozhodnutia",
      "ulohy",
      "otvorene_otazky",
      "dalsia_porada",
      "zhrnutie",
    ],
  },
};

export const DODAVATEL_TEMPLATE: TemplateDefinition = {
  kluc: "dodavatel",
  nazov: "Rokovanie s dodávateľom",
  useCase: "DODAVATEL",
  popis:
    "Z jednania s hotelom/dopravcom vytvorí kartu dohody (ceny, alotment, storno).",
  prompt: `Z prepisu rokovania s dodávateľom (hotel alebo dopravca) vytvor kartu dohody. Dôraz daj na ceny, kapacity/alotment, storno a platobné podmienky a termíny. Rozlíš, čo je už dohodnuté a čo treba ešte potvrdiť (otvorene_body). ${NO_INVENT} ${SK}`,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      dodavatel: {
        type: "object",
        additionalProperties: false,
        properties: {
          nazov: { type: ["string", "null"] },
          typ: { type: ["string", "null"] },
          kontakt: { type: ["string", "null"] },
        },
        required: ["nazov", "typ", "kontakt"],
      },
      predmet: { type: ["string", "null"] },
      destinacia_lokalita: { type: ["string", "null"] },
      obdobie_sezona: { type: ["string", "null"] },
      dohodnute_ceny: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            polozka: { type: "string" },
            cena: { type: ["number", "null"] },
            mena: { type: ["string", "null"] },
            poznamka: { type: ["string", "null"] },
          },
          required: ["polozka", "cena", "mena", "poznamka"],
        },
      },
      kapacita_alotment: { type: ["string", "null"] },
      storno_podmienky: { type: ["string", "null"] },
      platobne_podmienky: { type: ["string", "null"] },
      otvorene_body: { type: "array", items: { type: "string" } },
      dalsie_kroky: {
        type: "object",
        additionalProperties: false,
        properties: {
          akcia: { type: ["string", "null"] },
          termin: { type: ["string", "null"] },
          zodpovedny: { type: ["string", "null"] },
        },
        required: ["akcia", "termin", "zodpovedny"],
      },
      zhrnutie: { type: "string" },
    },
    required: [
      "dodavatel",
      "predmet",
      "destinacia_lokalita",
      "obdobie_sezona",
      "dohodnute_ceny",
      "kapacita_alotment",
      "storno_podmienky",
      "platobne_podmienky",
      "otvorene_body",
      "dalsie_kroky",
      "zhrnutie",
    ],
  },
};

export const ZHRNUTIE_TEMPLATE: TemplateDefinition = {
  kluc: "zhrnutie",
  nazov: "Stručné zhrnutie",
  useCase: "UNIVERZAL",
  popis: "Univerzálne stručné zhrnutie a kľúčové body.",
  prompt: `Vytvor stručné zhrnutie rozhovoru (3–5 viet) a zoznam kľúčových bodov. ${SK}`,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      zhrnutie: { type: "string" },
      klucove_body: { type: "array", items: { type: "string" } },
    },
    required: ["zhrnutie", "klucove_body"],
  },
};

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  KONZULTACIA_TEMPLATE,
  PORADA_TEMPLATE,
  DODAVATEL_TEMPLATE,
  ZHRNUTIE_TEMPLATE,
];

export function getTemplateByKey(kluc: string): TemplateDefinition | undefined {
  return TEMPLATE_DEFINITIONS.find((t) => t.kluc === kluc);
}
