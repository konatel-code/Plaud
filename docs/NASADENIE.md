# Nasadenie na vlastný server (s reálnym AI)

Stručný postup. Backend (API + AI worker + DB + úložisko) a web bežia na tvojom serveri, web s nimi komunikuje cez jednu doménu (Caddy zariadi HTTPS).

## Čo potrebuješ
- Server (VPS) s **Dockerom** a Docker Compose
- **Doménu** smerujúcu na IP servera (napr. `hlas.ckdaka.sk` → A záznam na IP) — kvôli HTTPS
- **OpenAI API kľúč** (viď nižšie)

## 1. Získanie OpenAI kľúča (5 minút)
1. Choď na **https://platform.openai.com** a zaregistruj sa / prihlás.
2. **Billing → Add payment method** a dobi kredit (napr. 10 €). Bez kreditu API nefunguje.
3. **API keys → Create new secret key**, skopíruj kľúč `sk-...` (zobrazí sa len raz).
4. (Odporúčané) nastav **Usage limit** (mesačný strop), nech máš náklady pod kontrolou.

> Ceny sú za reálne použitie: prepis ~ za minútu audia, zhrnutie ~ za dĺžku textu. Pre bežné množstvo konzultácií ide o jednotky až desiatky € mesačne.

## 2. Spustenie
```bash
git clone -b main https://github.com/konatel-code/Plaud.git
cd Plaud
cp .env.prod.example .env
# uprav .env: SITE_ADDRESS=tvoja doména, OPENAI_API_KEY=sk-..., a zmeň heslá/JWT
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```
Po nábehu otvor svoju doménu. Prihlásenie po prvom štarte:
- **admin@ckdaka.sk** / `admin123` — **hneď si zmeň heslo** (resp. vytvor nového admina a tohto zmaž).

## 3. Overenie AI
Vytvor „Novú nahrávku", nahraj krátky rozhovor → po pár sekundách sa stav zmení na *Hotové* a uvidíš **reálny prepis + zhrnutie + profil klienta**.

## Údržba
- **Aktualizácia:** `git pull && docker compose -f docker-compose.prod.yml --env-file .env up -d --build`
- **Zálohy:** Docker volume `daka-postgres` (databáza) a `daka-minio` (audio).
- **Logy:** `docker compose -f docker-compose.prod.yml logs -f api`

## Poznámky
- Audio sa nahráva cez API a ukladá interne (MinIO) — úložisko nie je vystavené do internetu.
- Whisper má limit ~25 MB na súbor (postačuje na bežné konzultácie). Dlhšie nahrávky odporúčame rozdeliť.
- GDPR: pred ostrou prevádzkou nastav súhlasy a spracovateľskú zmluvu s OpenAI (viď `docs/10-bezpecnost-gdpr.md`).
