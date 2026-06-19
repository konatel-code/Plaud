# @daka/api — Backend a AI worker (NestJS)

Backend systému **DAKA Hlas**: autentifikácia/RBAC, REST API, pre-signed upload audia, AI spracovanie (prepis Whisper → zhrnutie GPT-4o cez frontu BullMQ), WebSocket notifikácie. AI providery sú za abstrakciou (`TranscriptionProvider` / `SummarizationProvider`), takže ich možno vymeniť.

## Štruktúra
- `auth/` — JWT prihlásenie, roly (AGENT/MANAGER/ADMIN)
- `recordings/` — nahrávky, upload URL, RBAC viditeľnosť, zaradenie AI úlohy
- `templates/` — šablóny zhrnutí
- `summaries/` — generovanie zhrnutí + post-processing (profil klienta / úlohy / karta dodávateľa)
- `ai/` — providery prepisu a zhrnutí (OpenAI) + render Markdownu
- `worker/` — BullMQ processor (prepis + zhrnutie)
- `realtime/` — WebSocket gateway (stav spracovania)
- `storage/` — S3/MinIO pre-signed URL

## Spustenie (dev)
```bash
# 1) z roota repozitára: infraštruktúra
pnpm infra:up                 # Postgres + Redis + MinIO
# 2) migrácie + seed
pnpm db:migrate && pnpm db:seed
# 3) API (+ worker v rovnakom procese)
pnpm --filter @daka/api dev
```
Premenné prostredia: pozri `.env.example` v roote. Health check: `GET /health`.
