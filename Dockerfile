FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && corepack prepare pnpm@9 --activate && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node_modules/.bin/prisma generate
RUN node_modules/.bin/next build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/dev.db /app/data/dev.db
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/sharp ./node_modules/sharp
RUN chown nextjs:nodejs /app/data/dev.db
RUN mkdir -p /app/node_modules/.pnpm/@img+sharp-libvips-linux-x64@1.3.1/node_modules/@img/sharp-libvips-linux-x64/lib && \
    ln -sf /app/node_modules/.pnpm/@img+sharp-libvips-linux-x64@1.2.4/node_modules/@img/sharp-libvips-linux-x64/lib/libvips-cpp.so.8.17.3 \
           /app/node_modules/.pnpm/@img+sharp-libvips-linux-x64@1.3.1/node_modules/@img/sharp-libvips-linux-x64/lib/libvips-cpp.so.8.18.3
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
