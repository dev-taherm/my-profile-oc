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
RUN mkdir -p /app/data /app/public/uploads/media /app/public/uploads/resume /app/public/uploads/blog /app/public/uploads/projects && chown -R nextjs:nodejs /app/data /app/public/uploads
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/sharp@0.34.5/ ./node_modules/.pnpm/sharp@0.34.5/
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/@img+sharp-linux-x64@0.34.5/ ./node_modules/.pnpm/@img+sharp-linux-x64@0.34.5/
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/@img+sharp-libvips-linux-x64@1.2.4/ ./node_modules/.pnpm/@img+sharp-libvips-linux-x64@1.2.4/
RUN mkdir -p ./node_modules/@img && \
    ln -sf .pnpm/sharp@0.34.5/node_modules/sharp ./node_modules/sharp && \
    ln -sf ../../.pnpm/@img+sharp-linux-x64@0.34.5/node_modules/@img/sharp-linux-x64 ./node_modules/@img/sharp-linux-x64 && \
    ln -sf ../../.pnpm/@img+sharp-libvips-linux-x64@1.2.4/node_modules/@img/sharp-libvips-linux-x64 ./node_modules/@img/sharp-libvips-linux-x64
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./docker-entrypoint.sh
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD ["node", "server.js"]
