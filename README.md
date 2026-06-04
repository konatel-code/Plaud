# DAKA Hlas 🎙️

> Vlastný AI hlasový asistent pre **Cestovnú kanceláriu DAKA** — inšpirovaný systémom [Plaud](https://www.plaud.ai), prispôsobený potrebám cestovnej kancelárie.

Nahraj rozhovor → systém ho **prepíše**, **rozpozná hovoriacich** a podľa **šablóny** vytvorí **štruktúrované zhrnutie** (profil klienta a návrh zájazdu, zápis z porady, výsledok rokovania s dodávateľom).

**Pracovný názov produktu:** `DAKA Hlas` (interný, dá sa kedykoľvek zmeniť).

---

## Čo systém robí (jadro Plaudu prispôsobené pre CK DAKA)

| Plaud | DAKA Hlas |
|-------|-----------|
| Nahrávanie cez zariadenie/appku | Nahrávanie cez **web (mikrofón)**, **mobilnú appku** alebo **upload** audio súboru |
| AI prepis v 112 jazykoch + rozlíšenie hovoriacich | **Whisper** prepis optimalizovaný pre **slovenčinu** + diarizácia (kto hovoril) |
| 10 000+ šablón na zhrnutie | **Šablóny šité na CK** (konzultácia s klientom, porada, rokovanie s dodávateľom) |
| Viacrozmerné zhrnutia, action items | **Profil klienta + návrh zájazdu**, **úlohy z porady**, **podmienky dohody** |
| Myšlienkové mapy, glosáre, export | Myšlienkové mapy, **cestovný glosár**, export do PDF/DOCX/Markdown |
| Multimodálny vstup (audio + text + foto) | Audio + poznámky + zvýraznenia kľúčových momentov |

## Hlavné use-case scenáre (MVP)

1. **Konzultácia s klientom** → AI vytiahne preferencie (destinácia, termín, rozpočet, počet osôb, strava, doprava) → vytvorí **profil klienta** a **návrh zájazdu** z ponuky CK DAKA.
2. **Porada / zápis** → zhrnutie, rozhodnutia a **úlohy (kto / čo / dokedy)**.
3. **Rokovanie s dodávateľom** (hotel / dopravca) → zhrnutie **podmienok, cien a dohôd**.

## Dokumentácia návrhu

Kompletná špecifikácia je v priečinku [`docs/`](./docs):

| # | Dokument | Obsah |
|---|----------|-------|
| 01 | [Vízia a ciele](./docs/01-vizia-a-ciele.md) | Prečo to staviame, prínosy, rozsah |
| 02 | [Používatelia a scenáre](./docs/02-pouzivatelia-a-scenare.md) | Persóny, user stories |
| 03 | [Funkcie](./docs/03-funkcie.md) | Zoznam funkcií (mapované z Plaudu) |
| 04 | [AI pipeline](./docs/04-ai-pipeline.md) | Nahrávka → prepis → diarizácia → zhrnutie |
| 05 | [Šablóny](./docs/05-sablony.md) | Šablóny zhrnutí pre CK DAKA |
| 06 | [Dátový model](./docs/06-datovy-model.md) | Entity a vzťahy |
| 07 | [Architektúra](./docs/07-architektura.md) | Komponenty systému |
| 08 | [Technológie](./docs/08-tech-stack.md) | Tech stack a štruktúra monorepa |
| 09 | [API](./docs/09-api.md) | Prehľad REST API |
| 10 | [Bezpečnosť a GDPR](./docs/10-bezpecnost-gdpr.md) | Súhlasy, ochrana dát |
| 11 | [Roadmapa](./docs/11-roadmap.md) | Míľniky a postup vývoja |

## Štruktúra repozitára (plánovaná)

```
.
├── apps/
│   ├── web/        # Next.js web aplikácia (admin + práca s nahrávkami)
│   ├── mobile/     # Expo (React Native) mobilná appka
│   └── api/        # NestJS backend + AI worker
├── packages/
│   ├── shared/     # Zdieľané typy a Zod schémy
│   └── db/         # Prisma schéma a migrácie
└── docs/           # Návrh a špecifikácia
```

## Stav projektu

🟡 **Fáza M0 — Návrh.** Práve dolaďujeme špecifikáciu. Implementácia začne po jej odsúhlasení (pozri [roadmapu](./docs/11-roadmap.md)).
