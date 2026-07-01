#!/bin/sh
set -e

echo "[entrypoint] Running Prisma migrations..."
node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma || echo "[entrypoint] Migration skipped (schema up to date or DB not initialized yet)"

echo "[entrypoint] Starting server..."
exec "$@"
