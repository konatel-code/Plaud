# Web (Next.js) — DAKA Hlas
FROM node:20-bookworm-slim

RUN corepack enable
WORKDIR /app
COPY . .

# URL backendu pre prehliadač sa zapeká do buildu (Next.js NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm install --frozen-lockfile \
  && pnpm --filter @daka/shared build \
  && pnpm --filter @daka/web build

EXPOSE 3000
CMD ["pnpm","--filter","@daka/web","run","start"]
