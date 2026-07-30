# ==========================================
# Etapa 1: Build (Construcción)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiamos solo los archivos de dependencias para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Recibimos el nombre de la aplicación que queremos construir como argumento
ARG APP_NAME

# Le pedimos a NestJS que construya solo esa aplicación específica (y sus librerías compartidas)
RUN npm run build ${APP_NAME}

# ==========================================
# Etapa 2: Production (Ejecución Ligera)
# ==========================================
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Solo instalamos dependencias de producción (más ligero y seguro)
COPY package*.json ./
RUN npm install --only=production

# Copiamos la carpeta compilada (dist) desde la Etapa 1
COPY --from=builder /usr/src/app/dist ./dist

# Variable de entorno que indica a Node.js que estamos en producción
ENV NODE_ENV=production

# Recibimos el nombre de la app para saber qué archivo ejecutar
ARG APP_NAME
ENV APP_MAIN_FILE=dist/apps/${APP_NAME}/main.js

# Arrancamos la aplicación leyendo la variable de entorno
CMD node ${APP_MAIN_FILE}
