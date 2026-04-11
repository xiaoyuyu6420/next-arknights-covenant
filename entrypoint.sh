#!/bin/sh
set -e

# Initialize database on first run
if [ ! -f prisma/db/wbti.db ]; then
  echo "Initializing database..."
  mkdir -p prisma/db
  cp prisma/db/wbti.db.init prisma/db/wbti.db
  echo "Database initialized."
fi

exec node server.js
