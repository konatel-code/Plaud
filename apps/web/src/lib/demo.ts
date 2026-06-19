// Demo režim: keď NEXT_PUBLIC_DEMO=1, web nepoužíva backend, ale tieto vložené
// ukážkové dáta. Umožňuje nasadiť plne klikateľnú appku staticky (GitHub Pages).

import type {
  AuthUser,
  RecordingDetail,
  RecordingList,
  RecordingListItem,
} from "./types";

export const DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

export const DEMO_USER: AuthUser = {
  id: "demo-admin",
  email: "admin@ckdaka.sk",
  meno: "Administrátor (demo)",
  role: "ADMIN",
};

const konzultacia: RecordingDetail = {
  id: "demo-konzultacia",
  nazov: "Konzultácia – rodina Nováková",
  typ: "KONZULTACIA",
  stav: "SUMMARIZED",
  jazyk: "sk",
  createdAt: "2026-06-10T09:12:00.000Z",
  owner: { meno: "Jana Predajná" },
  stitky: ["leto-2026", "Grécko", "VIP klient"],
  shares: [{ userId: "u2", user: { id: "u2", meno: "Peter Druhý" } }],
  poznamka: null,
  transcript: {
    id: "t1",
    plnyText: "",
    segments: [
      { id: "s1", startSek: 2, endSek: 9, speaker: "Predajca", text: "Dobrý deň, vitajte v cestovnej kancelárii DAKA. Ako vám môžem pomôcť?" },
      { id: "s2", startSek: 9, endSek: 20, speaker: "Klient", text: "Dobrý deň, plánujeme letnú dovolenku pri mori, s manželom a dvoma deťmi." },
      { id: "s3", startSek: 20, endSek: 30, speaker: "Predajca", text: "Skvelé. Koľko majú deti rokov a kedy by ste chceli cestovať?" },
      { id: "s4", startSek: 30, endSek: 42, speaker: "Klient", text: "Deti majú 6 a 9 rokov. Termín ideálne druhá polovica júla, sme trochu flexibilní." },
      { id: "s5", startSek: 42, endSek: 55, speaker: "Predajca", text: "Akú destináciu by ste preferovali? Máme pekné ponuky do Grécka aj Turecka." },
      { id: "s6", startSek: 55, endSek: 70, speaker: "Klient", text: "Najradšej Grécko, počuli sme dobré veci o Kréte. Chceli by sme all inclusive a letecky." },
      { id: "s7", startSek: 70, endSek: 84, speaker: "Predajca", text: "Aký máte približne rozpočet na celú rodinu?" },
      { id: "s8", startSek: 84, endSek: 96, speaker: "Klient", text: "Do 2500 eur. A dôležité je, že najmladší má bezlepkovú diétu." },
      { id: "s9", startSek: 96, endSek: 108, speaker: "Predajca", text: "Bezlepkové menu vieme zariadiť. Pripravím vám ponuku do zajtra a pošlem e-mailom." },
    ],
  },
  clientProfile: {
    id: "cp1",
    stav: "PONUKA_ODOSLANA",
    dataJson: {
      klient: { meno: "rodina Nováková", telefon: null, email: null },
      cestujuci: { dospeli: 2, deti: 2, vek_deti: [6, 9] },
      destinacia: { preferovane: ["Grécko – Kréta"], typ_dovolenky: "pobytová", vylucene: [] },
      termin: { od: "2026-07-15", do: null, flexibilita: "druhá polovica júla, mierne flexibilní", pocet_noci: null },
      rozpocet: { na_osobu: null, spolu: 2500, mena: "EUR" },
      doprava: "letecky",
      ubytovanie: { kategoria: null, strava: "all inclusive" },
      specialne_poziadavky: ["bezlepková strava pre najmladšie dieťa"],
      namietky_obavy: [],
      navrh_zajazdu: [
        "Pobytový letecký zájazd Kréta, hotel s all inclusive a detským klubom",
        "Alternatíva: Rodos – rodinný hotel pri pláži",
      ],
    },
  },
  summaries: [
    {
      id: "sum1",
      createdAt: "2026-06-10T09:18:00.000Z",
      model: "demo",
      template: { kluc: "konzultacia", nazov: "Konzultácia s klientom" },
      tasks: [],
      dataJson: {},
      markdown:
        "## Profil klienta\n\n**Klient:** rodina Nováková\n**Cestujúci:** 2 dospelí, 2 deti (6, 9)\n\n### Destinácia\n- Grécko – Kréta (pobytová)\n\n### Termín a rozpočet\n- 2. polovica júla, do 2500 EUR\n\n### Doprava a ubytovanie\n- letecky, all inclusive\n\n### Špeciálne požiadavky\n- bezlepková strava pre najmladšie dieťa\n\n### Návrh zájazdu\n- Pobytový letecký zájazd Kréta s detským klubom\n- Alternatíva: Rodos\n\n### Zhrnutie\nRodina Nováková hľadá letnú pobytovú dovolenku pri mori (Grécko – Kréta), all inclusive, letecky, 2. polovica júla, do 2500 €. Bezlepková strava pre najmladšie dieťa. Predajca pripraví ponuku do zajtra.",
    },
  ],
};

const porada: RecordingDetail = {
  id: "demo-porada",
  nazov: "Porada tímu – júlové termíny",
  typ: "PORADA",
  stav: "SUMMARIZED",
  jazyk: "sk",
  createdAt: "2026-06-09T13:00:00.000Z",
  owner: { meno: "Administrátor" },
  stitky: ["interné"],
  shares: [],
  transcript: {
    id: "t2",
    plnyText:
      "Prebrali sme obsadenosť leteckých zájazdov na Krétu a navýšenie alotmentu v hoteli Sunrise.",
    segments: [],
  },
  clientProfile: null,
  summaries: [
    {
      id: "sum2",
      createdAt: "2026-06-09T13:40:00.000Z",
      model: "demo",
      template: { kluc: "porada", nazov: "Porada / zápis" },
      dataJson: {},
      markdown:
        "## Zápis z porady: Júlové termíny\n\n### Rozhodnutia\n- Navýšiť kapacitu na Krétu o 20 miest\n\n### Úlohy\n- [ ] Aktualizovať ceny leteckých zájazdov — Jana\n- [ ] Osloviť hotel Sunrise (alotment) — Peter\n\n### Zhrnutie\nTím sa dohodol na navýšení kapacity a aktualizácii cien.",
      tasks: [
        { id: "task1", text: "Aktualizovať ceny leteckých zájazdov na Krétu", zodpovedny: "Jana", termin: "2026-06-13", stav: "HOTOVA" },
        { id: "task2", text: "Osloviť hotel Sunrise ohľadom navýšenia alotmentu", zodpovedny: "Peter", termin: "2026-06-16", stav: "OTVORENA" },
        { id: "task3", text: "Pripraviť last-minute newsletter", zodpovedny: "Marketing", termin: "2026-06-19", stav: "OTVORENA" },
      ],
    },
  ],
};

const dodavatel: RecordingDetail = {
  id: "demo-dodavatel",
  nazov: "Hotel Sunrise – alotment leto 2026",
  typ: "DODAVATEL",
  stav: "SUMMARIZED",
  jazyk: "sk",
  createdAt: "2026-06-08T10:30:00.000Z",
  owner: { meno: "Peter Druhý" },
  stitky: ["Grécko", "dodávateľ"],
  shares: [],
  transcript: { id: "t3", plnyText: "Rokovanie o cenách izieb a storno podmienkach na leto 2026.", segments: [] },
  clientProfile: null,
  supplierDeal: { id: "sd1", dataJson: {} },
  summaries: [
    {
      id: "sum3",
      createdAt: "2026-06-08T11:00:00.000Z",
      model: "demo",
      template: { kluc: "dodavatel", nazov: "Rokovanie s dodávateľom" },
      dataJson: {},
      tasks: [],
      markdown:
        "## Karta dohody s dodávateľom\n\n**Dodávateľ:** Hotel Sunrise (hotel)\n**Predmet:** alotment izieb leto 2026\n\n### Dohodnuté ceny\n- Dvojlôžková izba: **78 EUR / noc** (polpenzia)\n\n- **Kapacita / alotment:** 25 izieb\n- **Storno podmienky:** bezplatne do 30 dní pred príchodom\n\n### Zhrnutie\nDohodnutá cena 78 €/noc s polpenziou, 25 izieb, storno do 30 dní.",
    },
  ],
};

const ALL: RecordingDetail[] = [konzultacia, porada, dodavatel];

function toListItem(r: RecordingDetail): RecordingListItem {
  return {
    id: r.id,
    nazov: r.nazov,
    typ: r.typ,
    stav: r.stav,
    jazyk: r.jazyk,
    stitky: r.stitky,
    createdAt: r.createdAt,
    owner: r.owner,
  };
}

export const DEMO_RECORDING_IDS = ALL.map((r) => r.id);

const TEMPLATES = [
  { id: "tpl1", kluc: "konzultacia", nazov: "Konzultácia s klientom", typ: "SYSTEM", useCase: "KONZULTACIA", popis: "Profil klienta a návrh zájazdu.", prompt: "Si asistent predajcu…", aktivna: true },
  { id: "tpl2", kluc: "porada", nazov: "Porada / zápis", typ: "SYSTEM", useCase: "PORADA", popis: "Zápis, rozhodnutia, úlohy.", prompt: "Z prepisu porady…", aktivna: true },
  { id: "tpl3", kluc: "dodavatel", nazov: "Rokovanie s dodávateľom", typ: "SYSTEM", useCase: "DODAVATEL", popis: "Karta dohody.", prompt: "Z prepisu rokovania…", aktivna: true },
  { id: "tpl4", kluc: "email", nazov: "Follow-up e-mail", typ: "SYSTEM", useCase: "UNIVERZAL", popis: "Návrh e-mailu.", prompt: "Napíš e-mail…", aktivna: true },
  { id: "tpl5", kluc: "zhrnutie", nazov: "Stručné zhrnutie", typ: "SYSTEM", useCase: "UNIVERZAL", popis: "Zhrnutie a kľúčové body.", prompt: "Vytvor zhrnutie…", aktivna: true },
];

const GLOSSARY = [
  { id: "g1", pojem: "all inclusive", kategoria: "pojem" },
  { id: "g2", pojem: "alotment", kategoria: "pojem" },
  { id: "g3", pojem: "Hurghada Grand Resort", kategoria: "hotel" },
  { id: "g4", pojem: "Kréta", kategoria: "destinacia" },
  { id: "g5", pojem: "polpenzia", kategoria: "pojem" },
];

const STATS = {
  nahravky: { total: 3, poslednych7: 3, poslednych30: 3, spracovavaSa: 0 },
  podlaTypu: { KONZULTACIA: 1, PORADA: 1, DODAVATEL: 1 },
  podlaStavu: { SUMMARIZED: 3 },
  klientiPodlaStavu: { PONUKA_ODOSLANA: 1 },
  otvoreneUlohy: 2,
};

const AUDIT = [
  { id: "a1", akcia: "UPRAVA", entita: "client-profiles", createdAt: "2026-06-10T09:20:00.000Z", user: { meno: "Administrátor", email: "admin@ckdaka.sk" } },
  { id: "a2", akcia: "VYTVORENIE", entita: "recordings", createdAt: "2026-06-10T09:12:00.000Z", user: { meno: "Jana Predajná", email: "predajca@ckdaka.sk" } },
];

const INTEGRATIONS = [
  { id: "i1", typ: "CRM_CLIENT_PROFILE", stav: "ODOSLANE", odpoved: "HTTP 200", createdAt: "2026-06-10T09:25:00.000Z" },
];

const COLLEAGUES = [
  { id: "u2", meno: "Peter Druhý", role: "AGENT" },
  { id: "u3", meno: "Mária Tretia", role: "MANAGER" },
];

/** Vráti demo odpoveď pre danú cestu (bez backendu). */
export function demoResponse<T>(method: string, path: string): T {
  const p = path.split("?")[0];
  const query = path.includes("?") ? path.split("?")[1] : "";

  if (p === "/auth/me") return DEMO_USER as T;

  if (p === "/recordings") {
    let items = ALL.map(toListItem);
    const params = new URLSearchParams(query);
    const q = params.get("q")?.toLowerCase();
    const stitok = params.get("stitok");
    if (q) items = items.filter((r) => r.nazov.toLowerCase().includes(q) || r.id === "demo-konzultacia");
    if (stitok) items = items.filter((r) => r.stitky?.includes(stitok));
    return { items, total: items.length, page: 1, perPage: 20 } as T;
  }

  const detailMatch = p.match(/^\/recordings\/([^/]+)$/);
  if (detailMatch && method === "GET") {
    return (ALL.find((r) => r.id === detailMatch[1]) ?? ALL[0]) as T;
  }

  if (p === "/templates") return TEMPLATES.filter((t) => t.aktivna) as T;
  if (p === "/templates/all") return TEMPLATES as T;
  if (p === "/glossary") return GLOSSARY as T;
  if (p === "/stats") return STATS as T;
  if (p === "/admin/audit") return AUDIT as T;
  if (p === "/admin/integrations") return INTEGRATIONS as T;
  if (p === "/users/colleagues") return COLLEAGUES as T;

  if (p.endsWith("/crm")) return { stav: "PRIPRAVENE" } as T;

  // mutácie a ostatné: vráť úspech
  return { ok: true } as T;
}
