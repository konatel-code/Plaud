/**
 * Vyrenderuje štruktúrované zhrnutie (dataJson) do čitateľného Markdownu
 * podľa kľúča šablóny. Pre neznáme šablóny použije generický výpis.
 */
export function renderSummaryMarkdown(
  templateKluc: string,
  data: Record<string, any>,
): string {
  switch (templateKluc) {
    case "konzultacia":
      return renderKonzultacia(data);
    case "porada":
      return renderPorada(data);
    case "dodavatel":
      return renderDodavatel(data);
    default:
      return renderGeneric(data);
  }
}

const val = (v: unknown) =>
  v === null || v === undefined || v === "" ? "—" : String(v);
const list = (arr?: unknown[]) =>
  arr && arr.length ? arr.map((x) => `- ${val(x)}`).join("\n") : "—";

function renderKonzultacia(d: Record<string, any>): string {
  const k = d.klient ?? {};
  const c = d.cestujuci ?? {};
  const dest = d.destinacia ?? {};
  const t = d.termin ?? {};
  const r = d.rozpocet ?? {};
  const u = d.ubytovanie ?? {};
  const dk = d.dalsie_kroky ?? {};
  return `## Profil klienta

**Klient:** ${val(k.meno)} · ${val(k.telefon)} · ${val(k.email)}
**Cestujúci:** ${val(c.dospeli)} dospelí, ${val(c.deti)} deti ${c.vek_deti?.length ? `(vek: ${c.vek_deti.join(", ")})` : ""}

### Destinácia
- Preferované: ${dest.preferovane?.length ? dest.preferovane.join(", ") : "—"}
- Typ dovolenky: ${val(dest.typ_dovolenky)}
- Vylúčené: ${dest.vylucene?.length ? dest.vylucene.join(", ") : "—"}

### Termín a rozpočet
- Termín: ${val(t.od)} – ${val(t.do)} (${val(t.flexibilita)}), nocí: ${val(t.pocet_noci)}
- Rozpočet: ${val(r.na_osobu)} / os, spolu ${val(r.spolu)} ${val(r.mena)}

### Doprava a ubytovanie
- Doprava: ${val(d.doprava)}
- Ubytovanie: ${val(u.kategoria)}, strava: ${val(u.strava)}

### Špeciálne požiadavky
${list(d.specialne_poziadavky)}

### Námietky / obavy
${list(d.namietky_obavy)}

### Návrh zájazdu
${list(d.navrh_zajazdu)}

### Ďalšie kroky
- ${val(dk.akcia)} (do ${val(dk.termin)})

### Zhrnutie
${val(d.zhrnutie)}
`;
}

function renderPorada(d: Record<string, any>): string {
  const body = (d.prebrane_body ?? [])
    .map((b: any) => `- **${val(b.tema)}:** ${val(b.zhrnutie)}`)
    .join("\n");
  const ulohy = (d.ulohy ?? [])
    .map(
      (t: any) =>
        `- [ ] ${val(t.uloha)} — _${val(t.zodpovedny)}_, do ${val(t.termin)} ${
          t.priorita ? `(priorita: ${t.priorita})` : ""
        }`,
    )
    .join("\n");
  return `## Zápis z porady${d.nazov_porady ? `: ${d.nazov_porady}` : ""}

**Dátum:** ${val(d.datum)}
**Účastníci:** ${d.ucastnici?.length ? d.ucastnici.join(", ") : "—"}

### Agenda
${list(d.agenda)}

### Prebrané body
${body || "—"}

### Rozhodnutia
${list(d.rozhodnutia)}

### Úlohy
${ulohy || "—"}

### Otvorené otázky
${list(d.otvorene_otazky)}

**Ďalšia porada:** ${val(d.dalsia_porada)}

### Zhrnutie
${val(d.zhrnutie)}
`;
}

function renderDodavatel(d: Record<string, any>): string {
  const dod = d.dodavatel ?? {};
  const ceny = (d.dohodnute_ceny ?? [])
    .map(
      (c: any) =>
        `- ${val(c.polozka)}: **${val(c.cena)} ${val(c.mena)}** ${
          c.poznamka ? `(${c.poznamka})` : ""
        }`,
    )
    .join("\n");
  const dk = d.dalsie_kroky ?? {};
  return `## Karta dohody s dodávateľom

**Dodávateľ:** ${val(dod.nazov)} (${val(dod.typ)}) · ${val(dod.kontakt)}
**Predmet:** ${val(d.predmet)}
**Lokalita:** ${val(d.destinacia_lokalita)} · **Obdobie:** ${val(d.obdobie_sezona)}

### Dohodnuté ceny
${ceny || "—"}

- **Kapacita / alotment:** ${val(d.kapacita_alotment)}
- **Storno podmienky:** ${val(d.storno_podmienky)}
- **Platobné podmienky:** ${val(d.platobne_podmienky)}

### Otvorené body
${list(d.otvorene_body)}

### Ďalšie kroky
- ${val(dk.akcia)} — ${val(dk.zodpovedny)} (do ${val(dk.termin)})

### Zhrnutie
${val(d.zhrnutie)}
`;
}

function renderGeneric(d: Record<string, any>): string {
  let md = "## Zhrnutie\n\n";
  if (d.zhrnutie) md += `${val(d.zhrnutie)}\n\n`;
  if (Array.isArray(d.klucove_body)) {
    md += `### Kľúčové body\n${list(d.klucove_body)}\n`;
  }
  return md;
}
