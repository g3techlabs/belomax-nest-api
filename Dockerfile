# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .
COPY .env .env

RUN npx prisma generate
RUN npx prisma migrate deploy
# Não roda build porque queremos rodar `yarn dev`

# Etapa 2: Desenvolvimento
FROM node:22-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app /usr/src/app

# expõe porta usada pelo Nest em dev
EXPOSE 3000

ENV NODE_ENV=development

CMD ["yarn", "dev"]