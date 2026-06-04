# 05 — Šablóny zhrnutí (šité na CK DAKA)

Každá šablóna má: **názov**, **použitie**, **JSON schému** (polia výstupu) a **prompt**. AI vždy odpovedá po **slovensky** a polia, ktoré z rozhovoru nevyplývajú, nechá prázdne / „neuvedené" (nič si nevymýšľa).

---

## 🧳 Šablóna 1 — Konzultácia s klientom

**Použitie:** rozhovor predajcu s klientom o dovolenke → profil klienta + návrh zájazdu.

**JSON schéma (polia výstupu):**
```json
{
  "klient": {
    "meno": "string|null",
    "telefon": "string|null",
    "email": "string|null"
  },
  "cestujuci": {
    "dospeli": "number|null",
    "deti": "number|null",
    "vek_deti": "number[]|null"
  },
  "destinacia": {
    "preferovane": "string[]",          // napr. ["Egypt", "Grécko"]
    "typ_dovolenky": "string|null",      // pobytová | poznávacia | exotika | wellness | víkendová
    "vylucene": "string[]"               // kam nechce
  },
  "termin": {
    "od": "string|null",
    "do": "string|null",
    "flexibilita": "string|null",        // napr. "+- týždeň", "iba letné prázdniny"
    "pocet_noci": "number|null"
  },
  "rozpocet": {
    "na_osobu": "number|null",
    "spolu": "number|null",
    "mena": "string|null"
  },
  "doprava": "string|null",              // autobus | letecky | vlastná
  "ubytovanie": {
    "kategoria": "string|null",          // napr. "4*"
    "strava": "string|null"              // raňajky | polpenzia | all inclusive
  },
  "specialne_poziadavky": "string[]",    // bezbariérovosť, bezlepková strava, izba pri mori...
  "namietky_obavy": "string[]",          // čoho sa klient obáva / čo rieši
  "navrh_zajazdu": "string[]",           // odporúčané zájazdy/typy z ponuky DAKA
  "dalsie_kroky": {
    "akcia": "string|null",              // napr. "poslať ponuku"
    "termin": "string|null"
  },
  "zhrnutie": "string"                   // 3–5 viet v slovenčine
}
```

**Prompt (skrátene):**
> Si asistent predajcu v cestovnej kancelárii DAKA. Z prepisu konzultácie s klientom vyplň profil klienta podľa schémy. Zameraj sa na preferencie dovolenky. Ak niečo nezaznelo, nechaj prázdne — nič si nevymýšľaj. V poli `navrh_zajazdu` navrhni typy zájazdov z portfólia DAKA (pobytové, poznávacie, letecké/autobusové, exotika, wellness, víkendové), ktoré najlepšie sedia preferenciám.

---

## 📝 Šablóna 2 — Porada / zápis

**Použitie:** interná porada → zápis, rozhodnutia, úlohy.

**JSON schéma:**
```json
{
  "nazov_porady": "string|null",
  "datum": "string|null",
  "ucastnici": "string[]",
  "agenda": "string[]",
  "prebrane_body": [
    { "tema": "string", "zhrnutie": "string" }
  ],
  "rozhodnutia": "string[]",
  "ulohy": [
    {
      "uloha": "string",
      "zodpovedny": "string|null",
      "termin": "string|null",
      "priorita": "string|null"          // vysoká | stredná | nízka
    }
  ],
  "otvorene_otazky": "string[]",
  "dalsia_porada": "string|null",
  "zhrnutie": "string"
}
```

**Prompt (skrátene):**
> Z prepisu porady vytvor štruktúrovaný zápis. Jasne oddeľ rozhodnutia od úloh. Pri každej úlohe urči zodpovedného a termín, ak zazneli. Píš stručne a vecne po slovensky.

---

## 🤝 Šablóna 3 — Rokovanie s dodávateľom (hotel / dopravca)

**Použitie:** jednanie s hotelom alebo dopravcom → karta dohody.

**JSON schéma:**
```json
{
  "dodavatel": {
    "nazov": "string|null",
    "typ": "string|null",                // hotel | dopravca | iné
    "kontakt": "string|null"
  },
  "predmet": "string|null",              // napr. "alotment izieb leto 2026"
  "destinacia_lokalita": "string|null",
  "obdobie_sezona": "string|null",
  "dohodnute_ceny": [
    { "polozka": "string", "cena": "number|null", "mena": "string|null", "poznamka": "string|null" }
  ],
  "kapacita_alotment": "string|null",    // počet izieb/miest
  "storno_podmienky": "string|null",
  "platobne_podmienky": "string|null",
  "otvorene_body": "string[]",           // čo treba doriešiť
  "dalsie_kroky": {
    "akcia": "string|null",
    "termin": "string|null",
    "zodpovedny": "string|null"
  },
  "zhrnutie": "string"
}
```

**Prompt (skrátene):**
> Z prepisu rokovania s dodávateľom vytvor kartu dohody. Dôraz na ceny, kapacity/alotment, storno a platobné podmienky a termíny. Rozlíš, čo je už dohodnuté a čo treba ešte potvrdiť. Po slovensky.

---

## ⚙️ Univerzálne šablóny (dostupné vždy)

| Šablóna | Výstup |
|---------|--------|
| **Stručné zhrnutie** | 3–5 viet + kľúčové body (bullet points) |
| **Action items** | Zoznam úloh kto/čo/dokedy |
| **Follow-up e-mail** | Návrh e-mailu (oslovenie, zhrnutie, ďalšie kroky) |
| **Čistý prepis** | Len naformátovaný prepis bez zhrnutia |

---

## Cestovný glosár (custom vocabulary)

Zoznam pojmov, ktorý sa podsúva do prepisu (Whisper `prompt`) aj do zhrnutí pre lepšiu presnosť:

- **Pojmy:** alotment, transfer, fakultatívny výlet, polpenzia, all inclusive, BSP, IATA, first minute, last minute, delegát, poistenie storna.
- **Destinácie a oblasti:** podľa ponuky DAKA (napr. Egypt – Hurghada, Grécko – Kréta/Rodos, Taliansko, Chorvátsko, Turecko, Tunisko…).
- **Hotely / dopravcovia:** dopĺňa admin podľa aktuálnej ponuky.

> Glosár je editovateľný v admin rozhraní (doc 03, sekcia C/B), aby ho CK DAKA udržiavala aktuálny.
