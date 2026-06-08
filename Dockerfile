# ============================================
# Stage 1: Build
# ============================================
FROM oven/bun:1 AS builder
WORKDIR /app

ENV DATABASE_URL=file:./db/wbti.db

# Copy dependency files first for better caching
COPY package.json bun.lock* ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# Install dependencies
RUN bun install

# Copy all source files
COPY . .

# Generate Prisma Client, create & seed DB, build Next.js
RUN bunx prisma generate \
    && bunx prisma db push \
    && bun run prisma/seed.ts \
    && bunx next build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:./db/wbti.db

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Copy Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma engine (required at runtime)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy Prisma schema and pre-seeded DB
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/prisma/db/wbti.db ./prisma/db/wbti.db.init
COPY --from=builder /app/scripts/ensure-db-schema.cjs ./scripts/ensure-db-schema.cjs

# Copy entrypoint
COPY entrypoint.sh /app/entrypoint.sh

# Make DB dir writable, entrypoint executable
RUN mkdir -p /app/prisma/db \
    && mkdir -p /app/scripts \
    && chown -R nextjs:nodejs /app/prisma/db \
    && chmod +x /app/entrypoint.sh

USER nextjs

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
