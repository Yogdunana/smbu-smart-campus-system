# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set env for prisma generate to detect openssl
ENV OPENSSL_INCLUDE_DIR=/usr/include/openssl11
ENV OPENSSL_LIB_DIR=/usr/lib/openssl11
ENV PKG_CONFIG_PATH=/usr/lib/openssl11/pkgconfig

RUN npx prisma generate && npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install openssl 1.1 compatibility for Prisma engine
RUN apk add --no-cache openssl1.1-compat

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Copy i18n message files (not included in standalone output)
COPY --from=builder /app/src/i18n/messages ./src/i18n/messages

RUN mkdir -p /app/public/uploads && chown nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
