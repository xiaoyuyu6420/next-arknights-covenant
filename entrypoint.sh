#!/bin/sh
set -e

DB_PATH="/app/prisma/db/wbti.db"

if [ ! -f "$DB_PATH" ]; then
  echo "Initializing database..."
  mkdir -p /app/prisma/db
  cp /app/prisma/db/wbti.db.init "$DB_PATH"
  echo "Database initialized."
fi

echo "Ensuring database schema..."
node scripts/ensure-db-schema.cjs
echo "Database schema ready."

sh /app/scripts/backup.sh || true

crond -b -l 8 2>/dev/null || true
echo "0 */6 * * * sh /app/scripts/backup.sh" | crontab - 2>/dev/null || true

exec node server.js
