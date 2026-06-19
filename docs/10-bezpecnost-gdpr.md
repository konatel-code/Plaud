# 10 — Bezpečnosť a GDPR

Systém pracuje s **osobnými údajmi klientov** (hlas = osobný údaj, k tomu mená, kontakty, preferencie). Cestovná kancelária je prevádzkovateľ, preto je súlad s GDPR podmienkou nasadenia.

## 1. Právny základ a súhlas s nahrávaním

- **Nahrávanie hovoru = spracovanie osobných údajov.** Pred nahrávaním musí klient dostať informáciu a (spravidla) udeliť **súhlas**.
- V appke: pri konzultácii **povinné potvrdenie**, že klient bol informovaný / súhlasí (entita `ConsentRecord`).
- Pripraviť **informačnú vetu**, ktorú predajca prečíta na začiatku nahrávky (uloží sa aj v audiu).
- Pri poradách a rokovaniach s dodávateľmi: informovať účastníkov.

## 2. Spracovateľ AI (OpenAI)

- Pri použití **OpenAI API** sa dáta **nepoužívajú na trénovanie** modelov a sú mazané podľa politiky poskytovateľa — uzavrieť **DPA** (Data Processing Agreement) a zvážiť **Zero Data Retention**.
- OpenAI vystupuje ako **sprostredkovateľ (processor)**; doplniť do záznamu o spracovateľských činnostiach.
- **Alternatíva pre maximálne súkromie:** vďaka abstrakcii `*Provider` (doc 04) vieme prepnúť na **self-hosted Whisper + lokálny LLM**, takže audio neopustí infraštruktúru CK. Odporúčané zvážiť pre citlivé dáta vo v2.

## 3. Ochrana dát

| Oblasť | Opatrenie |
|--------|-----------|
| **Prenos** | TLS/HTTPS všade. |
| **Úložisko** | Šifrovanie audia a DB at-rest; prístup k audiu len cez krátkodobé pre-signed URL. |
| **Prístup** | RBAC (AGENT vidí svoje, MANAGER tím, ADMIN všetko); princíp najmenších oprávnení. |
| **Hosting** | **EU región** (Postgres, S3, API). |
| **Tajomstvá** | Mimo repozitára (env/secret manager); `.env.example` len ako vzor. |
| **Audit** | `AuditLog` — kto videl/upravil/zmazal/exportoval. |

## 4. Práva dotknutých osôb

- **Právo na výmaz:** mazanie nahrávky odstráni audio (storage) aj odvodené dáta (prepis, zhrnutie, profil) — kaskádovo.
- **Právo na prístup/prenosnosť:** export dát klienta (PDF/DOCX/JSON).
- **Retencia:** nastaviteľná doba uchovania (napr. audio zmazať po X mesiacoch, ponechať len zhrnutie); automatické čistenie cron úlohou.
- **Minimalizácia:** ukladať len potrebné; možnosť anonymizovať prepis.

## 5. Bezpečnostné praktiky vývoja

- Validácia vstupov (Zod) na API.
- Rate limiting a ochrana upload endpointov.
- Žiadne tajomstvá v logoch; redakcia citlivých polí.
- Závislosti pravidelne aktualizované; CI kontrola zraniteľností.
- Zálohy DB a plán obnovy.

## 6. Pred spustením (checklist)

- [ ] DPA s OpenAI (a so všetkými sprostredkovateľmi).
- [ ] Záznam o spracovateľských činnostiach (ROPA).
- [ ] Informačná povinnosť + súhlasy klientov.
- [ ] Posúdenie vplyvu (DPIA), ak je relevantné.
- [ ] Nastavená retencia a postup výmazu.
- [ ] EU hosting potvrdený.
