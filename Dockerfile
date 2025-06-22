# ────────────────────────────────
# Etapa 1 – Construtor (builder)
# O objetivo aqui é apenas COMPILAR o código.
# ────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# O "truque" para resolver o erro de falta de espaço (ENOSPC):
# Dizemos ao Puppeteer para NÃO baixar o navegador nesta etapa, pois não precisamos dele para compilar.
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Instala as dependências (agora sem baixar o Chrome) e compila o projeto.
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma generate
RUN yarn build          # -> gera a pasta dist/*

# ────────────────────────────────
# Etapa 2 – Executor (runtime)
# O objetivo aqui é apenas RODAR a aplicação já compilada.
# ────────────────────────────────

# É AQUI QUE A MÁGICA ACONTECE!
# Usamos a imagem oficial do Puppeteer, que já vem com Node.js E o navegador Chrome instalado e configurado.
FROM ghcr.io/puppeteer/puppeteer:22.10.0

# ========= INÍCIO DA MUDANÇA PARA ATUALIZAR O NODE.JS (SINTAXE CORRIGIDA) =========

# Trocamos temporariamente para o usuário root para poder instalar pacotes.
USER root

# Instala o 'curl' para baixar arquivos e define a versão do Node que queremos.
RUN apt-get update && apt-get install -y curl

# CORREÇÃO: Usando o formato CHAVE=VALOR
ENV NODE_VERSION=22.13.1

RUN curl -o- "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" | tar -xJ -C /usr/local --strip-components=1

# CORREÇÃO: Usando o formato CHAVE="VALOR" e aspas para clareza
ENV PATH="/usr/local/bin:${PATH}"

# Trocamos de volta para o usuário não-root por segurança.
USER pptruser

# ========= FIM DA MUDANÇA PARA ATUALIZAR O NODE.JS =========

# Esta imagem já vem com um usuário não-root chamado "pptruser" por segurança. Vamos usá-lo.
USER pptruser
WORKDIR /home/pptruser/app

# Copiamos APENAS os arquivos necessários da etapa de construção para manter a imagem final leve.
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

# O comando para iniciar a aplicação que foi compilada na Etapa 1.
CMD ["node", "dist/main.js"]