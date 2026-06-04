# apps/api — Backend a AI worker (NestJS)

Backend systému **DAKA Hlas**: autentifikácia/RBAC, REST API, pre-signed upload audia, zaraďovanie a spracovanie AI úloh (prepis Whisper → diarizácia → zhrnutie GPT-4o), WebSocket notifikácie.

Obsahuje aj **AI worker** (BullMQ konzument) a abstrakciu poskytovateľov (`TranscriptionProvider` / `SummarizationProvider`).

> Placeholder — implementácia začne v míľnikoch **M1–M3** (pozri [`docs/11-roadmap.md`](../../docs/11-roadmap.md)).
