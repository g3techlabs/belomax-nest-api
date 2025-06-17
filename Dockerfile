# ────────────────────────────────
# Stage 1 – build
# ────────────────────────────────
# Esta etapa continua a mesma, pois só precisamos do Node.js para compilar o projeto.
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copia os manifestos primeiro para aproveitar o cache do Docker
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia o código-fonte e compila
COPY . .
RUN yarn prisma generate
RUN yarn build          # -> gera a pasta dist/*

# ────────────────────────────────
# Stage 2 – runtime
# ────────────────────────────────
# Use a imagem oficial do Puppeteer, que já inclui Node.js, Chromium e todas as dependências.
# Use uma tag específica para garantir builds consistentes.
FROM ghcr.io/puppeteer/puppeteer:22.10.0

# A imagem do Puppeteer já vem com um usuário não-root chamado "pptruser".
# É uma boa prática usá-lo em vez de criar um novo.
# O diretório de trabalho padrão para este usuário é /home/pptruser.
USER pptruser
WORKDIR /home/pptruser/app

# Copia os artefatos da etapa de build
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

# O comando para iniciar a aplicação continua o mesmo
CMD ["node", "dist/main.js"]