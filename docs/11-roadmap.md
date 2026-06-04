# 11 — Roadmapa a postup vývoja

Postupujeme po míľnikoch tak, aby bol systém **použiteľný čo najskôr** (najprv web + kľúčové scenáre), mobil a pokročilé funkcie nasledujú.

## Míľniky

### ✅ M0 — Návrh (aktuálne)
- Špecifikácia, architektúra, dátový model, šablóny, GDPR (tento `docs/`).
- Kostra monorepa.
- **Výstup:** odsúhlasený návrh.

### 🟢 M1 — Základ a nahrávanie
- Monorepo + Docker Compose (Postgres, Redis, MinIO).
- Prisma schéma + migrácie (entity z doc 06).
- API: auth (JWT, roly), CRUD nahrávok, pre-signed upload.
- Web: prihlásenie, nahrávanie cez mikrofón, upload, zoznam nahrávok.
- **Výstup:** dá sa nahrať a uložiť audio.

### 🟢 M2 — Prepis (Whisper)
- Worker + BullMQ; `OpenAITranscriptionProvider` (chunking, SK, glosár).
- Zobrazenie prepisu so segmentmi a prehrávačom; editor prepisu.
- WebSocket notifikácie o stave.
- **Výstup:** z nahrávky vznikne prepis.

### 🟢 M3 — Zhrnutia a šablóny
- `OpenAISummarizationProvider` so štruktúrovaným výstupom.
- Šablóny: Konzultácia, Porada, Dodávateľ + univerzálne.
- Zobrazenie zhrnutí, regenerácia, ručná úprava.
- **Výstup:** hotové štruktúrované zhrnutie podľa typu rozhovoru.

### 🟢 M4 — Doménové výstupy a export
- Profil klienta (stavy LEAD→…), úlohy z porady, karta dodávateľa.
- Návrh follow-up e-mailu.
- Export PDF/DOCX/Markdown.
- **Výstup:** plne použiteľný web pre 3 hlavné scenáre.

### 🟡 M5 — Mobilná aplikácia
- Expo appka: nahrávanie (aj na pozadí), upload, prezeranie výstupov, notifikácie.
- **Výstup:** predajca nahráva z mobilu.

### 🟡 M6 — Pokročilé AI a organizácia
- Diarizácia (mikroservis alebo externý provider), premenovanie hovoriacich.
- Cestovný glosár v admine, vlastné šablóny.
- Fulltextové vyhľadávanie, priečinky/štítky, zdieľanie.
- Myšlienkové mapy.

### 🟡 M7 — Prevádzka, GDPR, integrácie
- Audit log, retencia/automatické mazanie, štatistiky/dashboard.
- DPA, ROPA, súhlasy v procese.
- (neskôr) napojenie na CRM/rezervačný systém DAKA, kalendár.

## Návrh poradia prác hneď po odsúhlasení
1. Scaffold monorepa (pnpm + Turborepo) a `docker-compose.yml`.
2. Prisma schéma + migrácie + seed (šablóny, glosár).
3. API auth + nahrávky + upload.
4. Web: nahrávanie + zoznam.
5. Worker + prepis.
6. Šablóny + zhrnutia.

## Otvorené otázky na doladenie s CK DAKA
- Má sa systém napojiť na existujúci **CRM / rezervačný systém**? (ovplyvní M7)
- Majú predajcovia firemné **mobily** (iOS/Android) — pre M5.
- **Retenčná doba** audia a výstupov (GDPR).
- Kto bude **správcom šablón a glosára** (rola ADMIN).
- Preferovaný **hosting/poskytovateľ** v EU.
