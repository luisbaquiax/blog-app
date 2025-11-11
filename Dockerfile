FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
    
FROM base AS builder
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
    
RUN npm run build
 
FROM node:22-alpine AS runner
WORKDIR /app
    
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
    
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    
ENV PORT 3000
EXPOSE 3000
    
CMD ["node", "server.js"]