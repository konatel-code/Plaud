# @daka/mobile — Mobilná aplikácia (Expo / React Native)

Mobilná appka systému **DAKA Hlas**: prihlásenie, nahrávanie cez mikrofón (expo-av), upload, zoznam a detail nahrávky (prepis + zhrnutie). Používa rovnaké API ako web.

## Štruktúra (expo-router)
- `app/_layout.tsx` — root layout + AuthProvider
- `app/index.tsx` — rozcestník (prihlásený → zoznam)
- `app/login.tsx` — prihlásenie
- `app/recordings.tsx` — zoznam nahrávok
- `app/record.tsx` — nahrávanie + upload (s evidenciou súhlasu pri konzultácii)
- `app/recording/[id].tsx` — detail (prepis, zhrnutie)
- `src/lib/` — API klient (token v expo-secure-store), auth kontext, typy

## Spustenie (dev)
```bash
pnpm --filter @daka/mobile start      # Expo dev server (QR kód)
# alebo: pnpm --filter @daka/mobile ios | android
```

## Konfigurácia API
URL backendu je v `app.json` → `expo.extra.apiUrl` (default `http://localhost:4000`).
Pri testovaní na fyzickom zariadení nastav IP adresu počítača v sieti (nie `localhost`).

> Pozn.: appka sa overuje typovou kontrolou (`pnpm --filter @daka/mobile typecheck`);
> spustenie v simulátore/zariadení vyžaduje Expo prostredie.
