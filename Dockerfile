# syntax=docker/dockerfile:1

# ---- Build stage -----------------------------------------------------------
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
# Not --frozen-lockfile: bun.lock is currently out of sync with package.json, which
# fails the frozen install. Restore the flag once `bun install` has been run and committed.
RUN bun install

COPY . .

# VITE_* values are baked into the bundle at build time, so they must be
# available here. In Coolify, tick "Build Variable" on VITE_API_BASE_URL.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# The Lovable config defaults to the Cloudflare preset; build a Node server instead.
ENV NITRO_PRESET=node-server
RUN bun run build

# ---- Runtime stage ---------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# Nitro's node-server output is self-contained (dependencies are traced into it).
COPY --from=build /app/.output ./.output

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" >/dev/null || exit 1

CMD ["node", ".output/server/index.mjs"]
