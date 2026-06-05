# @daka/web — Webová aplikácia (Next.js)

Web rozhranie systému **DAKA Hlas**: prihlásenie, nahrávanie cez mikrofón (MediaRecorder) alebo upload súboru, zoznam nahrávok, detail s prepisom a zhrnutím, opätovné generovanie podľa šablóny.

## Stránky
- `/login` — prihlásenie
- `/nahravky` — zoznam nahrávok (s priebežným obnovením stavu)
- `/nahravky/nova` — nová nahrávka (mikrofón / upload, súhlas GDPR pri konzultácii)
- `/nahravky/[id]` — detail: zhrnutie, prepis, regenerácia šablónou

## Spustenie (dev)
```bash
# API musí bežať (viď apps/api). Nastav NEXT_PUBLIC_API_URL ak nie je default.
pnpm --filter @daka/web dev      # http://localhost:3000
```

Predvolene volá API na `http://localhost:4000` (premenná `NEXT_PUBLIC_API_URL`).
