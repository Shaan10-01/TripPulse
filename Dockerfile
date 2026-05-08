# ─── Stage 1: Build client ───
FROM node:20-slim AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ─── Stage 2: Build server ───
FROM node:20-slim AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npx tsc

# ─── Stage 3: Production ───
FROM node:20-slim AS production
WORKDIR /app

# Copy server build
COPY --from=server-build /app/server/dist ./dist
COPY --from=server-build /app/server/package*.json ./

# Copy client build into public folder for Express static serving
COPY --from=client-build /app/client/dist ./public

# Install production deps only
RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
