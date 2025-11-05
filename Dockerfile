# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache docker-cli
WORKDIR /app

# Instalar dependencias
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && \
    yarn config set enableTelemetry 0 && \
    yarn install --frozen-lockfile

# Construir la aplicación
FROM deps AS build
COPY . .
RUN yarn run build

# Imagen final
FROM base AS final
WORKDIR /app

# Copiar el código construido y las dependencias
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Mantener Docker CLI disponible
# El punto de entrada será node dist/index.js
# Nota: Esta imagen requiere que Docker esté disponible en el host
# y se debe montar el socket de Docker con -v /var/run/docker.sock:/var/run/docker.sock
ENTRYPOINT ["node", "dist/index.js"]

