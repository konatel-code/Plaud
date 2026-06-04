# 02 — Používatelia a scenáre

## Persóny

| Persóna | Rola v systéme | Čo potrebuje |
|---------|----------------|--------------|
| **Predajca / agent** (na pobočke alebo po telefóne) | `AGENT` | Nahrať konzultáciu s klientom, dostať profil klienta a návrh zájazdu, poslať follow-up. |
| **Manažér / vedúci pobočky** | `MANAGER` | Zápisy z porád, úlohy pre tím, prehľad nad dopytmi a výkonom. |
| **Nákup / produkt** (rokovania s hotelmi a dopravcami) | `AGENT`/`MANAGER` | Záznam dohôd s dodávateľmi, podmienky a ceny. |
| **Administrátor** | `ADMIN` | Správa používateľov, šablón, glosára, nastavení a GDPR. |

## Roly a oprávnenia (prehľad)

| Akcia | AGENT | MANAGER | ADMIN |
|------|:-----:|:-------:|:-----:|
| Nahrávať a vidieť vlastné nahrávky | ✅ | ✅ | ✅ |
| Vidieť nahrávky celého tímu / pobočky | ➖ | ✅ | ✅ |
| Spravovať šablóny a glosár | ➖ | ➖ | ✅ |
| Spravovať používateľov a roly | ➖ | ➖ | ✅ |
| Mazať nahrávky (GDPR) | vlastné | tím | všetky |

## User stories

### Konzultácia s klientom
- *Ako predajca* chcem počas/po rozhovore s klientom **nahrať konverzáciu**, aby som sa mohol naplno venovať klientovi a nemusel písať.
- *Ako predajca* chcem, aby mi AI z nahrávky **vytiahla preferencie klienta** (destinácia, termín, rozpočet, počet osôb, strava, doprava), aby som mal kompletný dopyt.
- *Ako predajca* chcem dostať **návrh vhodných zájazdov** z ponuky DAKA, aby som klientovi rýchlo poslal ponuku.
- *Ako predajca* chcem z výstupu jedným klikom vygenerovať **e-mail s follow-upom** pre klienta.

### Porada / zápis
- *Ako manažér* chcem nahrať poradu a dostať **zápis s rozhodnutiami a úlohami**, aby tím vedel, kto čo má spraviť.
- *Ako člen tímu* chcem vidieť **svoje pridelené úlohy** s termínmi.

### Rokovanie s dodávateľom
- *Ako nákupca* chcem nahrať jednanie s hotelom/dopravcom a dostať **zhrnutie dohodnutých podmienok, cien a termínov**, aby nevznikli nedorozumenia.

### Univerzálne
- *Ako používateľ* chcem počas nahrávania **zvýrazniť dôležitý moment**, aby ho zhrnutie zdôraznilo.
- *Ako používateľ* chcem v prepise **vidieť, kto čo povedal** (rozlíšenie hovoriacich).
- *Ako používateľ* chcem **vyhľadávať** vo svojich nahrávkach a prepisoch.
- *Ako používateľ* chcem výstup **exportovať** (PDF/DOCX/Markdown) alebo **zdieľať** s kolegom.

## Hlavný používateľský tok (happy path)

```
1. Prihlásenie  →  2. „Nová nahrávka"  →  výber typu (konzultácia/porada/dodávateľ)
        │
        ▼
3. Nahrávanie (mikrofón / mobil)  ──┐    voliteľne: zvýraznenie momentu, poznámka, foto
        │                           │
        ▼                           ▼
4. Stop → upload do úložiska  →  fronta na spracovanie
        │
        ▼
5. AI prepis (Whisper) + diarizácia  →  6. AI zhrnutie podľa šablóny (GPT-4o)
        │
        ▼
7. Detail nahrávky: prepis + zhrnutie + (profil klienta / úlohy / podmienky)
        │
        ▼
8. Úprava / export / zdieľanie / follow-up e-mail
```
