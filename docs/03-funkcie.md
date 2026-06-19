# 03 — Funkcie (mapované z Plaudu)

Legenda priority: 🟢 MVP · 🟡 v2 · ⚪ neskôr

## A. Nahrávanie a vstup

| Funkcia | Popis | Priorita |
|---------|-------|:--------:|
| Nahrávanie cez web mikrofón | Záznam priamo v prehliadači (MediaRecorder API) | 🟢 |
| Nahrávanie v mobilnej appke | Nahrávanie na pozadí, aj pri zamknutej obrazovke | 🟢 |
| Upload audio súboru | mp3/m4a/wav atď. (napr. z telefónu, diktafónu) | 🟢 |
| Pauza / pokračovanie | Prerušenie a obnovenie nahrávky | 🟢 |
| Zvýraznenie momentu | „Highlight" tlačidlo počas nahrávania (časová značka) | 🟡 |
| Textová poznámka k nahrávke | Doplnkový kontext písaním | 🟢 |
| Priloženie fotky/dokumentu | Multimodálny vstup (napr. foto poznámok, ponuky) | 🟡 |
| Detekcia jazyka | Automaticky, s prednastavením na slovenčinu | 🟢 |

## B. Prepis (transkripcia)

| Funkcia | Popis | Priorita |
|---------|-------|:--------:|
| AI prepis (Whisper) | Vysoká presnosť pre slovenčinu a bežné jazyky | 🟢 |
| Časové značky | Segmenty s časom (klik → skok v audiu) | 🟢 |
| Rozlíšenie hovoriacich (diarizácia) | „Hovoriaci 1/2…", možnosť premenovať (napr. „Klient", „Predajca") | 🟡 |
| Vlastný slovník / glosár | Názvy destinácií, hotelov, odborné pojmy (alotment, transfer…) | 🟡 |
| Editor prepisu | Ručná oprava textu a mien hovoriacich | 🟢 |
| Prehrávač synchronizovaný s textom | Zvýraznenie aktuálnej vety pri prehrávaní | 🟡 |

## C. AI zhrnutia a šablóny

| Funkcia | Popis | Priorita |
|---------|-------|:--------:|
| Šablónové zhrnutia | Konzultácia / Porada / Dodávateľ + univerzálne | 🟢 |
| Štruktúrovaný výstup | JSON podľa schémy šablóny (polia, nie len text) | 🟢 |
| Viacrozmerné zhrnutia | Z jednej nahrávky viac pohľadov (zhrnutie + úlohy + e-mail) | 🟡 |
| Automatický výber šablóny | Podľa typu nahrávky / obsahu | 🟡 |
| Vlastné šablóny | Admin si vytvorí/upraví šablónu a jej prompt | 🟡 |
| Myšlienková mapa | Vizuálna mapa tém z rozhovoru | ⚪ |
| Regenerovanie | Znova vygenerovať zhrnutie (iná šablóna/model) | 🟢 |

## D. Doménové výstupy pre CK DAKA

| Funkcia | Popis | Priorita |
|---------|-------|:--------:|
| Profil klienta | Štruktúrovaný dopyt (destinácia, termín, rozpočet, osoby, strava, doprava) | 🟢 |
| Návrh zájazdu | Odporúčané typy/zájazdy z ponuky DAKA podľa preferencií | 🟡 |
| Follow-up e-mail | Návrh e-mailu klientovi z konzultácie | 🟡 |
| Úlohy (action items) | Z porady: kto / čo / dokedy, stav | 🟢 |
| Karta dohody s dodávateľom | Podmienky, ceny, termíny, storno | 🟢 |

## E. Organizácia a vyhľadávanie

| Funkcia | Popis | Priorita |
|---------|-------|:--------:|
| Zoznam nahrávok | Filtre (typ, dátum, autor, stav) | 🟢 |
| Priečinky / štítky | Organizácia nahrávok | 🟡 |
| Fulltextové vyhľadávanie | V názvoch, prepisoch, zhrnutiach | 🟡 |
| Zdieľanie | S kolegom / tímom (oprávnenia) | 🟡 |

## F. Export a integrácie

| Funkcia | Popis | Priorita |
|---------|-------|:--------:|
| Export PDF / DOCX / Markdown | Prepis aj zhrnutie | 🟢 |
| Export audia | Stiahnutie originálu | 🟢 |
| Odoslanie e-mailom | Priamo zo systému | 🟡 |
| Kalendár (úlohy/termíny) | Google/Microsoft kalendár | ⚪ |
| Napojenie na rezervačný/CRM systém DAKA | Profil klienta → CRM | ⚪ |

## G. Správa, roly a GDPR

| Funkcia | Popis | Priorita |
|---------|-------|:--------:|
| Prihlásenie a roly | AGENT / MANAGER / ADMIN | 🟢 |
| Súhlas s nahrávaním | Evidencia súhlasu klienta | 🟢 |
| Mazanie a retencia | Právo na vymazanie, automatické čistenie | 🟢 |
| Audit log | Kto čo videl/zmenil/zmazal | 🟡 |
| Štatistiky / dashboard | Počty dopytov, čas, využitie | 🟡 |
