# Backend (NestJS) + AI worker — DAKA Hlas
FROM node:20-bookworm-slim

# OpenSSL je potrebné pre Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable

WORKDIR /app
COPY . .

# Inštalácia a build (shared → db → api)
RUN pnpm install --frozen-lockfile \
  && pnpm --filter @daka/shared build \
  && pnpm --filter @daka/db build \
  && pnpm --filter @daka/api build

EXPOSE 4000

# Pri štarte: vytvor schému, naplň dáta (demo) a spusti API + worker
CMD ["sh","-lc","pnpm --filter @daka/db exec prisma db push --skip-generate && pnpm --filter @daka/db run seed && pnpm --filter @daka/db run seed:demo && node apps/api/dist/main.js"]
