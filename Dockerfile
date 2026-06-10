# ============================================
# Stage 1: Build
# ============================================
FROM oven/bun:1 AS builder
WORKDIR /app

ENV DATABASE_URL=file:./db/wbti.db

COPY package.json bun.lock* ./
COPY prisma/schema.prisma ./prisma/schema.prisma

RUN bun install

COPY . .

RUN bunx prisma generate \
    && bunx prisma db push \
    && bun run prisma/seed.ts \
    && bunx next build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat sqlite curl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:./db/wbti.db

RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/prisma/db/wbti.db ./prisma/db/wbti.db.init
COPY --from=builder /app/scripts/ensure-db-schema.cjs ./scripts/ensure-db-schema.cjs

COPY scripts/backup.sh /app/scripts/backup.sh
COPY entrypoint.sh /app/entrypoint.sh

RUN mkdir -p /app/prisma/db /app/scripts /backups \
    && chown -R nextjs:nodejs /app/prisma/db /backups \
    && chmod +x /app/entrypoint.sh /app/scripts/backup.sh

USER nextjs

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
