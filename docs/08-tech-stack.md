# 08 — Technológie a štruktúra monorepa

## Tech stack

| Vrstva | Voľba | Prečo |
|--------|-------|-------|
| Jazyk | **TypeScript** (celý stack) | Jeden jazyk FE/BE, zdieľané typy. |
| Web | **Next.js (App Router) + React** | Moderný, rýchle SSR/CSR, dobré DX. |
| UI | **Tailwind CSS + shadcn/ui** | Rýchle, konzistentné, prístupné komponenty. |
| Mobil | **Expo (React Native)** | iOS + Android z jednej codebase, zdieľaná logika s webom. |
| Backend | **NestJS** | Štruktúrovaný, moduly, DI, dobré pre tím a rast. |
| Fronta/Worker | **BullMQ + Redis** | Spoľahlivé async spracovanie AI úloh. |
| DB | **PostgreSQL + Prisma** | Robustná relačná DB, jsonb pre štruktúrované výstupy. |
| Úložisko | **S3 (prod) / MinIO (dev)** | Audio a prílohy, pre-signed upload. |
| AI | **OpenAI SDK** (Whisper + GPT-4o) | Prepis SK + štruktúrované zhrnutia. |
| Auth | **JWT + refresh** (alebo NextAuth) | RBAC: AGENT/MANAGER/ADMIN. |
| Validácia | **Zod** | Zdieľané schémy FE/BE. |
| Realtime | **WebSocket (Socket.IO)** | Notifikácie o stave spracovania. |
| Export | **PDF (Puppeteer/react-pdf), DOCX (docx), Markdown** | Výstupy pre klienta/interné. |
| Monorepo | **pnpm workspaces + Turborepo** | Rýchle buildy, zdieľanie balíkov. |
| Kontajnery | **Docker / Docker Compose** | Jednotné dev a prod prostredie. |
| Testy | **Vitest/Jest + Playwright** | Unit + e2e. |
| CI | **GitHub Actions** | Lint, test, build na PR. |

## Štruktúra monorepa

```
.
├── apps/
│   ├── web/                 # Next.js
│   │   ├── app/             # routy (App Router)
│   │   ├── components/
│   │   └── lib/
│   ├── mobile/              # Expo (React Native)
│   │   ├── app/
│   │   └── components/
│   └── api/                 # NestJS
│       ├── src/
│       │   ├── auth/
│       │   ├── recordings/
│       │   ├── transcripts/
│       │   ├── summaries/
│       │   ├── templates/
│       │   ├── ai/          # providers (Transcription/Summarization)
│       │   ├── worker/      # BullMQ consumers
│       │   └── storage/     # S3/MinIO
│       └── test/
├── packages/
│   ├── shared/              # typy + Zod schémy + konštanty (šablóny, enumy)
│   └── db/                  # Prisma schéma + migrácie + seed
├── docs/                    # tento návrh
├── docker-compose.yml       # Postgres + Redis + MinIO + API + Worker
├── turbo.json
├── package.json             # workspace root
└── pnpm-workspace.yaml
```

## Premenné prostredia (návrh)

```
# DB & infra
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
S3_ENDPOINT=...           S3_BUCKET=...   S3_ACCESS_KEY=...   S3_SECRET_KEY=...

# Auth
JWT_SECRET=...            JWT_REFRESH_SECRET=...

# AI
OPENAI_API_KEY=...
OPENAI_TRANSCRIBE_MODEL=whisper-1
OPENAI_SUMMARY_MODEL=gpt-4o
AI_DEFAULT_LANGUAGE=sk

# App
APP_BASE_URL=...          DATA_REGION=eu
```

> Tajomstvá nikdy necommitujeme — len `.env.example` so vzorom.
