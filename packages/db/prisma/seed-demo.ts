import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Ukážkové demo dáta — realistická konzultácia s klientom vrátane prepisu,
 * štruktúrovaného zhrnutia a profilu klienta. Slúži na predvedenie systému
 * bez potreby reálneho OpenAI spracovania.
 */
async function main() {
  console.log("🎬 Demo seed: predajca + ukážková konzultácia");

  const passwordHash = await bcrypt.hash("agent123", 10);
  const agent = await prisma.user.upsert({
    where: { email: "predajca@ckdaka.sk" },
    update: {},
    create: {
      email: "predajca@ckdaka.sk",
      meno: "Jana Predajná",
      passwordHash,
      role: "AGENT",
      pobocka: "Bratislava",
    },
  });

  const tmpl = await prisma.template.findUnique({ where: { kluc: "konzultacia" } });
  if (!tmpl) throw new Error("Spusti najprv hlavný seed (chýba šablóna konzultacia)");

  // Zmaž predošlú demo nahrávku (idempotencia)
  await prisma.recording.deleteMany({ where: { nazov: "Konzultácia – rodina Nováková" } });

  const recording = await prisma.recording.create({
    data: {
      ownerId: agent.id,
      nazov: "Konzultácia – rodina Nováková",
      typ: "KONZULTACIA",
      jazyk: "sk",
      zdroj: "WEB",
      stav: "SUMMARIZED",
      dlzkaSek: 412,
      audioKey: "demo/konzultacia-novakova.webm",
      consent: {
        create: { sposob: "USTNY_V_NAHRAVKE", poznamka: "Súhlas na začiatku nahrávky" },
      },
    },
  });

  const segments = [
    { s: 2, e: 9, sp: "Predajca", t: "Dobrý deň, vitajte v cestovnej kancelárii DAKA. Ako vám môžem pomôcť?" },
    { s: 9, e: 20, sp: "Klient", t: "Dobrý deň, plánujeme letnú dovolenku pri mori, ideálne s manželom a dvoma deťmi." },
    { s: 20, e: 30, sp: "Predajca", t: "Skvelé. Koľko majú deti rokov a kedy by ste chceli cestovať?" },
    { s: 30, e: 42, sp: "Klient", t: "Deti majú 6 a 9 rokov. Termín ideálne druhá polovica júla, sme trochu flexibilní." },
    { s: 42, e: 55, sp: "Predajca", t: "A akú destináciu by ste preferovali? Máme pekné ponuky do Grécka aj Turecka." },
    { s: 55, e: 70, sp: "Klient", t: "Najradšej Grécko, počuli sme dobré veci o Kréte. Chceli by sme all inclusive a letecky." },
    { s: 70, e: 84, sp: "Predajca", t: "Rozumiem. Aký máte približne rozpočet na celú rodinu?" },
    { s: 84, e: 96, sp: "Klient", t: "Tak do 2500 eur by sme sa chceli zmestiť. A dôležité je, že najmladší má bezlepkovú diétu." },
    { s: 96, e: 108, sp: "Predajca", t: "Jasné, bezlepkové menu vieme zariadiť. Pripravím vám konkrétnu ponuku do zajtra." },
    { s: 108, e: 116, sp: "Klient", t: "Výborne, ďakujem. Pošlite to prosím e-mailom." },
  ];

  await prisma.transcript.create({
    data: {
      recordingId: recording.id,
      jazyk: "sk",
      model: "demo",
      plnyText: segments.map((x) => `${x.sp}: ${x.t}`).join("\n"),
      segments: {
        create: segments.map((x, i) => ({
          poradie: i,
          startSek: x.s,
          endSek: x.e,
          speaker: x.sp,
          text: x.t,
        })),
      },
    },
  });

  const data = {
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
    dalsie_kroky: { akcia: "pripraviť a poslať ponuku e-mailom", termin: "do zajtra" },
    zhrnutie:
      "Rodina Nováková (2 dospelí + 2 deti, 6 a 9 rokov) hľadá letnú pobytovú dovolenku pri mori, preferuje Grécko (Kréta), all inclusive, letecky, v druhej polovici júla. Rozpočet do 2500 € na rodinu. Dôležitá je bezlepková strava pre najmladšie dieťa. Predajca pripraví ponuku do zajtra a pošle e-mailom.",
  };

  const markdown = `## Profil klienta

**Klient:** rodina Nováková · — · —
**Cestujúci:** 2 dospelí, 2 deti (vek: 6, 9)

### Destinácia
- Preferované: Grécko – Kréta
- Typ dovolenky: pobytová
- Vylúčené: —

### Termín a rozpočet
- Termín: 2026-07-15 – — (druhá polovica júla, mierne flexibilní)
- Rozpočet: — / os, spolu 2500 EUR

### Doprava a ubytovanie
- Doprava: letecky
- Ubytovanie: —, strava: all inclusive

### Špeciálne požiadavky
- bezlepková strava pre najmladšie dieťa

### Návrh zájazdu
- Pobytový letecký zájazd Kréta, hotel s all inclusive a detským klubom
- Alternatíva: Rodos – rodinný hotel pri pláži

### Ďalšie kroky
- pripraviť a poslať ponuku e-mailom (do zajtra)

### Zhrnutie
${data.zhrnutie}
`;

  await prisma.summary.create({
    data: {
      recordingId: recording.id,
      templateId: tmpl.id,
      model: "demo",
      dataJson: data as object,
      markdown,
    },
  });

  await prisma.clientProfile.upsert({
    where: { recordingId: recording.id },
    update: { dataJson: data as object },
    create: { recordingId: recording.id, dataJson: data as object, stav: "LEAD" },
  });

  console.log("  ✓ predajca@ckdaka.sk / agent123");
  console.log(`  ✓ ukážková nahrávka: ${recording.id}`);
  console.log("✅ Demo seed hotový");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
