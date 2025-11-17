#!/bin/sh
# entrypoint.sh

set -e

echo "Running database migrations..."

# MUDANÇA AQUI:
# Em vez de "npx prisma migrate deploy", chame o binário local direto.
# Isso evita o erro do npm/npx e usa a versão exata instalada no projeto.
./node_modules/.bin/prisma migrate deploy

echo "Migrations finished."
echo "Starting the application..."

exec "$@"