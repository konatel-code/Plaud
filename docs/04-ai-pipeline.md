# 04 — AI pipeline

Spracovanie prebieha **asynchrónne** cez frontu, aby nahrávka nikdy nezablokovala UI a nestratila sa pri výpadku.

## Prehľad toku

```
[Klient: web/mobil]
   │  1. nahrá audio + metadáta (typ, jazyk, poznámka)
   ▼
[API]  ──2. uloží audio do Object Storage (S3/MinIO), záznam do DB (stav: UPLOADED)
   │
   │  3. zaradí úlohu do fronty (Redis / BullMQ)
   ▼
[Worker]
   │  4. TRANSCRIBE   → OpenAI Whisper  (stav: TRANSCRIBING → TRANSCRIBED)
   │  5. DIARIZE      → priradenie hovoriacich (voliteľné, viď nižšie)
   │  6. SUMMARIZE    → GPT-4o + JSON schéma šablóny (stav: SUMMARIZED)
   │  7. POSTPROCESS  → profil klienta / úlohy / karta dodávateľa
   ▼
[DB]  uložené: Transcript, Summary, ClientProfile / Tasks / SupplierDeal
   │
   ▼
[Klient]  realtime notifikácia (WebSocket/polling) → zobrazenie výsledku
```

## 1. Prepis — OpenAI Whisper

- Endpoint: `audio.transcriptions` (model `whisper-1`, prípadne `gpt-4o-transcribe`).
- Jazyk: `language=sk` prednastavené, s možnosťou automatickej detekcie.
- Vstup: predĺžené nahrávky sa **rozsekajú na časti** (chunking, ~10–15 min / ≤25 MB limit) a spoja sa s prepočítaním časových značiek.
- Výstup: `verbose_json` → text + segmenty s `start`/`end`/`text`.
- **`prompt` parameter** sa využije na podsunutie cestovného glosára (názvy destinácií, hotelov, pojmy), čím sa zvýši presnosť prepisu.

## 2. Diarizácia (kto hovoril) — dôležitá poznámka k návrhu

OpenAI Whisper **natívne nerozlišuje hovoriacich**. Máme tri možnosti, navrhujem postupné zavedenie:

| Možnosť | Popis | Kedy |
|---------|-------|------|
| **A. Bez diarizácie** | Iba prepis, hovoriacich nerozlišujeme. | MVP (rýchle) |
| **B. Diarizačný mikroservis** | `pyannote.audio` (open-source) v samostatnej Python službe; segmenty hovoriacich sa zarovnajú s Whisper segmentmi. | v2 |
| **C. Externý poskytovateľ** | Napr. AssemblyAI / Deepgram (podporujú slovenčinu + diarizáciu naraz). Jednoduchšie, ale ďalší dodávateľ. | alternatíva k B |

> 💡 Architektúru navrhujeme tak, aby bol **prepis a diarizácia oddelený od zvyšku** (rozhranie `TranscriptionProvider`), takže poskytovateľa vieme vymeniť bez zásahu do appky.

## 3. Zhrnutie — OpenAI GPT-4o so štruktúrovaným výstupom

- Pre každú šablónu existuje **JSON schéma** (Structured Outputs / `response_format: json_schema`), takže výstup je vždy strojovo spracovateľný a konzistentný.
- Prompt = systémová inštrukcia (rola, jazyk = slovenčina, doménový kontext CK DAKA) + prepis (s hovoriacimi) + poznámky + zvýraznené momenty.
- Dlhé prepisy: **map-reduce** zhrnutie (po častiach → finálne zhrnutie), aby sme zmestili kontext.
- Výstup sa ukladá ako štruktúrovaný JSON **aj** ako pekne naformátovaný Markdown na zobrazenie/export.

### Abstrakcia poskytovateľov (kód)

```ts
interface TranscriptionProvider {
  transcribe(audio: AudioRef, opts: { language?: string; glossary?: string[] }): Promise<Transcript>;
}

interface SummarizationProvider {
  summarize(input: SummarizeInput, template: Template): Promise<StructuredSummary>;
}
```

Default implementácie: `OpenAITranscriptionProvider`, `OpenAISummarizationProvider`. Vďaka rozhraniam vieme neskôr pridať lokálny/self-hosted variant kvôli GDPR (viď doc 10).

## 4. Spoľahlivosť

- **Idempotentné úlohy** + opakovanie pri zlyhaní (retry s backoffom).
- Stavový automat nahrávky: `UPLOADED → TRANSCRIBING → TRANSCRIBED → SUMMARIZING → SUMMARIZED` (+ `FAILED`).
- Pri zlyhaní AI sa zachová audio aj doterajší výstup; používateľ môže spustiť **regeneráciu**.
- Limity nákladov: sledovanie spotreby tokenov/minút na nahrávku.

## 5. Náklady (orientačne)

- Whisper: účtované za minútu audia.
- GPT-4o: za tokeny vstupu/výstupu (dĺžka prepisu).
- Odporúčanie: zobrazovať odhad/spotrebu adminovi a nastaviť mesačný limit.
