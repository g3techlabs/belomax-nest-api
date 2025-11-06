#!/bin/sh
# entrypoint.sh

# Aborta o script se qualquer comando falhar
set -e

echo "Running database migrations..."
# Roda a migration. O Prisma vai usar a DATABASE_URL do ambiente.
npx prisma migrate deploy

echo "Migrations finished."
echo "Starting the application..."

# O comando "exec $@" executa o comando principal passado para o container
# (o que estiver no CMD do Dockerfile).
exec "$@"