# ────────────────────────────────
# Stage 1 – build
# ────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# copy only manifests first to leverage docker cache
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# copy source and build 
COPY . .
RUN yarn prisma generate
RUN yarn build          # -> dist/*

# ────────────────────────────────
# Stage 2 – runtime
# ────────────────────────────────
FROM node:22-alpine

# create a non‑root user
RUN addgroup -S app && adduser -S app -G app
USER app

WORKDIR /usr/src/app

# copy only the built artefacts and production deps
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]