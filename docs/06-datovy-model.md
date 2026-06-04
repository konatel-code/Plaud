# 06 — Dátový model

Databáza: **PostgreSQL**, ORM: **Prisma**. Nižšie je logický model (entity a vzťahy). Finálna Prisma schéma bude v `packages/db/schema.prisma`.

## ER prehľad

```
User ──< Recording ──1:1── Transcript ──< TranscriptSegment
  │           │
  │           ├──< Summary ──(podľa šablóny)──┐
  │           │                               ├── ClientProfile
  │           ├──< Highlight                  ├── Task
  │           ├──< Attachment                 └── SupplierDeal
  │           └──> Template
  │
Template (system | custom)
GlossaryTerm
ConsentRecord ──> Recording
AuditLog
```

## Entity

### User — zamestnanec
| pole | typ | poznámka |
|------|-----|---------|
| id | uuid | |
| email | string | unikátne, prihlásenie |
| meno | string | |
| passwordHash | string | (alebo SSO) |
| role | enum | `AGENT` \| `MANAGER` \| `ADMIN` |
| pobocka | string? | voliteľné (multi-pobočka) |
| createdAt | datetime | |

### Recording — nahrávka
| pole | typ | poznámka |
|------|-----|---------|
| id | uuid | |
| ownerId | uuid → User | |
| nazov | string | |
| typ | enum | `KONZULTACIA` \| `PORADA` \| `DODAVATEL` \| `INE` |
| audioUrl | string | kľúč v Object Storage |
| dlzkaSek | int | |
| jazyk | string | napr. `sk` |
| zdroj | enum | `WEB` \| `MOBIL` \| `UPLOAD` |
| stav | enum | `UPLOADED`→`TRANSCRIBING`→`TRANSCRIBED`→`SUMMARIZING`→`SUMMARIZED`/`FAILED` |
| poznamka | text? | textový kontext od používateľa |
| createdAt | datetime | |

### Transcript — prepis
| pole | typ | poznámka |
|------|-----|---------|
| id | uuid | |
| recordingId | uuid → Recording | 1:1 |
| plnyText | text | |
| jazyk | string | |
| model | string | napr. `whisper-1` |

### TranscriptSegment — segment prepisu
| pole | typ | poznámka |
|------|-----|---------|
| id | uuid | |
| transcriptId | uuid | |
| startSek | float | |
| endSek | float | |
| text | text | |
| speaker | string? | „Hovoriaci 1" / „Klient" (po diarizácii / premenovaní) |

### Summary — zhrnutie
| pole | typ | poznámka |
|------|-----|---------|
| id | uuid | |
| recordingId | uuid → Recording | |
| templateId | uuid → Template | |
| dataJson | jsonb | štruktúrovaný výstup podľa schémy |
| markdown | text | naformátované na zobrazenie/export |
| model | string | napr. `gpt-4o` |
| createdAt | datetime | viac zhrnutí na nahrávku (regenerácia, rôzne šablóny) |

### Template — šablóna
| pole | typ | poznámka |
|------|-----|---------|
| id | uuid | |
| nazov | string | |
| typ | enum | `SYSTEM` \| `CUSTOM` |
| useCase | enum | `KONZULTACIA` \| `PORADA` \| `DODAVATEL` \| `UNIVERZAL` |
| schemaJson | jsonb | JSON schéma výstupu |
| prompt | text | systémová inštrukcia |
| orgScoped | bool | vlastná šablóna CK |

### ClientProfile — profil klienta (z konzultácie)
Štruktúrované polia podľa šablóny 1 (destinácia, termín, rozpočet, osoby, strava, doprava…), naviazané na `Summary`/`Recording`.
| pole | typ |
|------|-----|
| id | uuid |
| recordingId | uuid → Recording |
| dataJson | jsonb |
| stav | enum `LEAD` \| `PONUKA_ODOSLANA` \| `REZERVOVANE` \| `STRATENY` |

### Task — úloha (z porady)
| pole | typ |
|------|-----|
| id | uuid |
| summaryId | uuid → Summary |
| text | string |
| zodpovedny | string? (alebo userId) |
| termin | date? |
| stav | enum `OTVORENA` \| `HOTOVA` |

### SupplierDeal — karta dohody s dodávateľom
Štruktúrované polia podľa šablóny 3 (ceny, alotment, storno…), naviazané na `Recording`.

### Highlight — zvýraznený moment
| pole | typ |
|------|-----|
| id | uuid |
| recordingId | uuid → Recording |
| casSek | float |
| poznamka | string? |

### Attachment — príloha (multimodál)
| pole | typ |
|------|-----|
| id | uuid |
| recordingId | uuid → Recording |
| typ | enum `IMAGE` \| `FILE` \| `NOTE` |
| url | string |

### GlossaryTerm — pojem v glosári
| pole | typ |
|------|-----|
| id | uuid |
| pojem | string |
| kategoria | string? (destinácia/hotel/pojem) |

### ConsentRecord — súhlas s nahrávaním (GDPR)
| pole | typ |
|------|-----|
| id | uuid |
| recordingId | uuid → Recording |
| sposob | enum `USTNY_V_NAHRAVKE` \| `PISOMNY` \| `INY` |
| poznamka | string? |
| createdAt | datetime |

### AuditLog — audit
| pole | typ |
|------|-----|
| id | uuid |
| userId | uuid |
| akcia | string (`VIEW`/`EDIT`/`DELETE`/`EXPORT`) |
| entita | string |
| entitaId | uuid |
| createdAt | datetime |
