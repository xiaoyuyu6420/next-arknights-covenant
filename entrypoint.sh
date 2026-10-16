#!/bin/sh
set -e

BACKUP_DIR="/app/prisma/db/backups"
DB_PATH="/app/prisma/db/wbti.db"
MAX_BACKUPS=30

# Backup existing database before starting (on every restart)
if [ -f "$DB_PATH" ]; then
  TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
  mkdir -p "$BACKUP_DIR"
  cp "$DB_PATH" "$BACKUP_DIR/wbti-${TIMESTAMP}.db"
  echo "Database backed up to ${BACKUP_DIR}/wbti-${TIMESTAMP}.db"

  # Cleanup: keep only the latest $MAX_BACKUPS backups
  COUNT=$(ls -1t "$BACKUP_DIR"/wbti-*.db 2>/dev/null | wc -l)
  if [ "$COUNT" -gt "$MAX_BACKUPS" ]; then
    ls -1t "$BACKUP_DIR"/wbti-*.db | tail -n +$((MAX_BACKUPS + 1)) | xargs rm -f
    echo "Cleaned up old backups, keeping latest ${MAX_BACKUPS}"
  fi
fi

# Initialize database on first run
if [ ! -f "$DB_PATH" ]; then
  echo "Initializing database..."
  mkdir -p /app/prisma/db
  cp /app/prisma/db/wbti.db.init "$DB_PATH"
  echo "Database initialized."
fi

echo "Ensuring database schema..."
node scripts/ensure-db-schema.cjs
echo "Database schema ready."

exec node server.js
