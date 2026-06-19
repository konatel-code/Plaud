# 01 — Vízia a ciele

## Vízia

Postaviť pre Cestovnú kanceláriu DAKA vlastný **AI hlasový asistent** v štýle [Plaud](https://www.plaud.ai), ktorý z bežných pracovných rozhovorov (s klientmi, na poradách, s dodávateľmi) automaticky vytvorí **prepis** a **štruktúrované zhrnutie**, čím ušetrí predajcom a manažérom hodiny ručného zapisovania a zvýši kvalitu starostlivosti o klienta.

## Problém, ktorý riešime

Dnes v cestovnej kancelárii:
- Predajca počas konzultácie s klientom súčasne počúva, radí a **ručne zapisuje** požiadavky → niečo unikne, profil klienta je neúplný.
- Po porade niekto musí spísať **zápis a úlohy** → často sa to nestane alebo je zápis nekonzistentný.
- Pri **rokovaní s hotelmi/dopravcami** sa dohody zaznamenávajú narýchlo → vznikajú nedorozumenia o cenách a podmienkach.

## Cieľ

Jeden nástroj, kde zamestnanec:
1. **Nahrá** rozhovor (web mikrofón / mobil / upload).
2. Dostane presný **prepis** s rozlíšením hovoriacich.
3. Vyberie **šablónu** (alebo sa zvolí automaticky) a dostane **hotové štruktúrované zhrnutie**.
4. Výstup uloží, zdieľa, exportuje alebo z neho vytvorí **profil klienta / návrh zájazdu / úlohy**.

## Merateľné prínosy (KPI)

- ⏱️ **Úspora času:** −70 % času na zápis z konzultácie a porady.
- 🎯 **Kvalita profilu klienta:** vyšší podiel kompletných dopytov (všetky polia vyplnené).
- 💬 **Rýchlosť ponuky:** kratší čas od konzultácie po zaslanie návrhu zájazdu.
- 🤝 **Menej nedorozumení** s dodávateľmi vďaka jednoznačnému záznamu dohôd.

## Rozsah MVP (čo áno / čo nie)

**MVP zahŕňa:**
- Web aplikáciu + mobilnú appku (nahrávanie a práca s výstupmi).
- Prepis (slovenčina + bežné jazyky), základnú diarizáciu.
- Tri šablóny: **Konzultácia s klientom**, **Porada**, **Rokovanie s dodávateľom** + univerzálne zhrnutie.
- Profil klienta a úlohy, export do PDF/DOCX/Markdown.
- Roly a prihlásenie, základné GDPR (súhlas s nahrávaním, mazanie).

**MVP zatiaľ NEzahŕňa** (neskoršie fázy):
- Vlastné hardvérové zariadenie (ako Plaud Note) — nahrávame cez telefón/web.
- Automatické párovanie na konkrétny zájazd v rezervačnom systéme CK (najprv návrh, integrácia neskôr).
- Pokročilé myšlienkové mapy a 10 000+ šablón (začneme s kľúčovými).

## Nefunkčné požiadavky

- **Slovenčina** ako prvotriedny jazyk (prepis aj zhrnutia).
- **GDPR / EU hosting** — pracujeme s osobnými údajmi klientov.
- Spoľahlivosť asynchrónneho spracovania (nahrávka sa nesmie stratiť).
- Použiteľnosť pre netechnických predajcov — jednoduché UI.
