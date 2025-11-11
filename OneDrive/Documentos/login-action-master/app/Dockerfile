# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# Instalar dependencias
FROM base AS deps
COPY package.json ./
RUN npm install --frozen-lockfile

# Construir la aplicación
FROM deps AS build
COPY . .
RUN npm run build

# Imagen final de producción
FROM base AS production
WORKDIR /app

# Copiar dependencias y código construido
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Punto de entrada
CMD ["node", "dist/server.js"]

