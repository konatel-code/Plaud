# 09 — Prehľad API

REST API (NestJS), JSON, autentifikácia cez Bearer JWT. Notifikácie o stave spracovania cez WebSocket. Nižšie je prehľad hlavných endpointov (MVP).

## Autentifikácia
| Metóda | Cesta | Popis |
|--------|-------|-------|
| POST | `/auth/login` | Prihlásenie → access + refresh token |
| POST | `/auth/refresh` | Obnova access tokenu |
| POST | `/auth/logout` | Odhlásenie |
| GET | `/auth/me` | Aktuálny používateľ a rola |

## Nahrávky
| Metóda | Cesta | Popis |
|--------|-------|-------|
| POST | `/recordings/upload-url` | Vyžiada pre-signed URL na priamy upload audia |
| POST | `/recordings` | Vytvorí nahrávku (metadáta + kľúč audia) → zaradí AI úlohu |
| GET | `/recordings` | Zoznam (filtre: `typ`, `stav`, `od`, `do`, `autor`) |
| GET | `/recordings/:id` | Detail (nahrávka + prepis + zhrnutia) |
| PATCH | `/recordings/:id` | Úprava názvu/typu/poznámky |
| DELETE | `/recordings/:id` | Zmazanie (GDPR; audit log) |
| GET | `/recordings/:id/audio` | Pre-signed URL na prehratie/stiahnutie |

## Prepis
| Metóda | Cesta | Popis |
|--------|-------|-------|
| GET | `/recordings/:id/transcript` | Prepis vrátane segmentov |
| PATCH | `/transcripts/:id/segments/:segId` | Oprava textu / mena hovoriaceho |
| POST | `/recordings/:id/retranscribe` | Znovu spustí prepis |

## Zhrnutia a šablóny
| Metóda | Cesta | Popis |
|--------|-------|-------|
| POST | `/recordings/:id/summaries` | Vygeneruje zhrnutie podľa `templateId` |
| GET | `/recordings/:id/summaries` | Zoznam zhrnutí nahrávky |
| PATCH | `/summaries/:id` | Úprava výstupu (ručné doladenie) |
| GET | `/templates` | Zoznam šablón |
| POST | `/templates` | (ADMIN) Vytvorenie vlastnej šablóny |
| PATCH | `/templates/:id` | (ADMIN) Úprava šablóny |

## Doménové výstupy
| Metóda | Cesta | Popis |
|--------|-------|-------|
| GET | `/recordings/:id/client-profile` | Profil klienta (z konzultácie) |
| PATCH | `/client-profiles/:id` | Úprava / zmena stavu (LEAD→PONUKA…) |
| GET | `/recordings/:id/tasks` | Úlohy z porady |
| PATCH | `/tasks/:id` | Stav/termín/zodpovedný |
| GET | `/recordings/:id/supplier-deal` | Karta dohody s dodávateľom |

## Doplnky
| Metóda | Cesta | Popis |
|--------|-------|-------|
| POST | `/recordings/:id/highlights` | Pridať zvýraznený moment |
| POST | `/recordings/:id/attachments` | Príloha (foto/dokument/poznámka) |
| POST | `/recordings/:id/consent` | Záznam súhlasu s nahrávaním |
| GET | `/recordings/:id/export?format=pdf\|docx\|md` | Export výstupu |
| GET | `/glossary` / POST `/glossary` | (ADMIN) Správa glosára |
| GET | `/admin/users` / POST / PATCH | (ADMIN) Správa používateľov |

## WebSocket udalosti
| Udalosť | Payload |
|---------|--------|
| `recording.status` | `{ recordingId, stav }` (UPLOADED→…→SUMMARIZED/FAILED) |
| `recording.ready` | `{ recordingId }` (prepis aj zhrnutie hotové) |

> Detailná OpenAPI/Swagger špecifikácia sa vygeneruje z NestJS dekorátorov počas implementácie.
