# 07 — Architektúra systému

## Komponentový diagram

```
┌──────────────┐     ┌──────────────┐
│   Web app    │     │  Mobil app   │
│  (Next.js)   │     │   (Expo RN)  │
└──────┬───────┘     └──────┬───────┘
       │  HTTPS / REST + WebSocket │
       └──────────┬────────────────┘
                  ▼
          ┌───────────────┐
          │   API (NestJS)│  auth, REST, WebSocket notifikácie
          └───┬───────┬───┘
              │       │
     ┌────────┘       └─────────┐
     ▼                          ▼
┌──────────┐            ┌───────────────┐
│PostgreSQL│            │ Object Storage│  audio súbory
│ (Prisma) │            │  (S3 / MinIO) │
└──────────┘            └───────────────┘
     ▲                          ▲
     │                          │
     │   ┌──────────────────────┘
     ▼   ▼
┌──────────────┐      fronta úloh      ┌───────────────┐
│  Redis +     │◀────────────────────▶│   AI Worker   │
│  BullMQ      │                       │ (Node proces) │
└──────────────┘                       └──────┬────────┘
                                               │
                                ┌──────────────┴───────────────┐
                                ▼                              ▼
                       ┌─────────────────┐           ┌──────────────────┐
                       │ OpenAI Whisper  │           │  OpenAI GPT-4o   │
                       │   (prepis)      │           │   (zhrnutia)     │
                       └─────────────────┘           └──────────────────┘
                       (voliteľne diarizačný mikroservis — pyannote)
```

## Komponenty

| Komponent | Zodpovednosť |
|-----------|--------------|
| **Web app** (Next.js) | Prihlásenie, nahrávanie cez mikrofón, zoznam a detail nahrávok, editor prepisu, zobrazenie zhrnutí, export, admin (šablóny, glosár, používatelia). |
| **Mobil app** (Expo RN) | Nahrávanie v teréne (aj na pozadí), upload, prezeranie výstupov, notifikácie. |
| **API** (NestJS) | Autentifikácia/autorizácia (RBAC), CRUD nad entitami, upload audia (signed URL), zaraďovanie AI úloh, WebSocket notifikácie o stave. |
| **AI Worker** | Konzument fronty: prepis → diarizácia → zhrnutie → postprocessing. Oddelený proces, škálovateľný. |
| **PostgreSQL** | Hlavná databáza (Prisma schéma a migrácie v `packages/db`). |
| **Object Storage** | Audio a prílohy (S3 v produkcii, MinIO v dev). Prístup cez **pre-signed URL** (klient nahráva priamo). |
| **Redis + BullMQ** | Fronta a stav AI úloh, retry/backoff. |
| **AI providers** | OpenAI Whisper + GPT-4o cez abstrakciu `*Provider` (vymeniteľné). |

## Kľúčové rozhodnutia

1. **Asynchrónne spracovanie cez frontu** — UI je okamžite responzívne, ťažká AI práca beží na workeri; nahrávka sa nestratí.
2. **Priamy upload do úložiska cez pre-signed URL** — veľké audio súbory neprechádzajú cez API server.
3. **Abstrakcia AI poskytovateľov** — `TranscriptionProvider` / `SummarizationProvider`, aby sa dali vymeniť (OpenAI → lokálny model kvôli GDPR) bez prepisu appky.
4. **Štruktúrované výstupy (JSON schéma)** — zhrnutia sú strojovo spracovateľné (profil klienta, úlohy, karta dodávateľa), nie len voľný text.
5. **Zdieľaný typový balík** (`packages/shared`) — rovnaké typy a Zod schémy medzi API, webom a mobilom.
6. **EU hosting** pre osobné údaje (viď doc 10).

## Prostredia

| Prostredie | Popis |
|-----------|-------|
| **dev** | Docker Compose: Postgres + Redis + MinIO + API + Worker; web cez `next dev`, mobil cez Expo. |
| **staging** | Testovacie nasadenie pred produkciou. |
| **production** | EU región. Web (napr. Vercel/VPS), API+Worker (kontajner na Fly.io/Render/VPS), managed Postgres, S3, Redis. |
