FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat ffmpeg openssl
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1

# Build-time environment variables for NEXT_PUBLIC_* (required for client-side)
ARG NEXT_PUBLIC_SUPABASE_URL='https://rhxticpmcdzbmnfblkuk.supabase.co'
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoeHRpY3BtY2R6Ym1uZmJsa3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDUzNDUsImV4cCI6MjA4MTQyMTM0NX0.kqTyaBsp-6A3jLWHTjI3n03TC-okKctkhw-3xTlNdSE'
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
